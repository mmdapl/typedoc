import assert from "assert";
import ts from "typescript";
import {
    ArrayType,
    ConditionalType,
    DeclarationReflection,
    IndexedAccessType,
    InferredType,
    IntersectionType,
    IntrinsicType,
    LiteralType,
    MappedType,
    NamedTupleMember,
    OptionalType,
    PredicateType,
    QueryType,
    ReferenceType,
    ReflectionFlag,
    ReflectionKind,
    ReflectionType,
    RestType,
    SignatureReflection,
    type SomeType,
    TemplateLiteralType,
    TupleType,
    TypeOperatorType,
    UnionType,
    UnknownType,
} from "../models/index.js";
import { type TranslatedString, zip } from "#utils";
import type { Context } from "./context.js";
import { ConverterEvents } from "./converter-events.js";
import { convertIndexSignatures } from "./factories/index-signature.js";
import { convertParameterNodes, convertTypeParameterNodes, createSignature } from "./factories/signature.js";
import { convertSymbol } from "./symbols.js";
import { isObjectType, isTypeReference } from "./utils/nodes.js";
import { removeUndefined } from "./utils/reflections.js";

export interface TypeConverter<
    TNode extends ts.TypeNode = ts.TypeNode,
    TType extends ts.Type = ts.Type,
> {
    kind: TNode["kind"][];
    // getTypeAtLocation is expensive, so don't pass the type here.
    convert(context: Context, node: TNode): SomeType;
    // We use typeToTypeNode to figure out what method to call in the first place,
    // so we have a non-type-checkable node here, necessary for some converters.
    // We *may* also have an original node which is the node the type was originally
    // retrieved from.
    convertType(
        context: Context,
        type: TType,
        serializedNode: TNode,
        originalNode: ts.TypeNode | undefined,
    ): SomeType;
}

const converters = new Map<ts.SyntaxKind, TypeConverter>();
export function loadConverters() {
    if (converters.size) return;

    for (
        const actor of [
            arrayConverter,
            conditionalConverter,
            constructorConverter,
            exprWithTypeArgsConverter,
            functionTypeConverter,
            importType,
            indexedAccessConverter,
            inferredConverter,
            intersectionConverter,
            intrinsicConverter,
            jsDocVariadicTypeConverter,
            keywordConverter,
            optionalConverter,
            parensConverter,
            predicateConverter,
            queryConverter,
            typeLiteralConverter,
            referenceConverter,
            restConverter,
            namedTupleMemberConverter,
            mappedConverter,
            literalTypeConverter,
            templateLiteralConverter,
            thisConverter,
            tupleConverter,
            typeOperatorConverter,
            unionConverter,
            jSDocTypeExpressionConverter,
            // Only used if skipLibCheck: true
            jsDocNullableTypeConverter,
            jsDocNonNullableTypeConverter,
            jsDocAllTypeConverter,
        ]
    ) {
        for (const key of actor.kind) {
            if (key === undefined) {
                // Might happen if running on an older TS version.
                continue;
            }
            assert(!converters.has(key));
            converters.set(key, actor);
        }
    }
}

// This ought not be necessary, but we need some way to discover recursively
// typed symbols which do not have type nodes. See the `recursive` symbol in the variables test.
const seenTypes = new Set<number>();

function maybeConvertType(
    context: Context,
    typeOrNode: ts.Type | ts.TypeNode | undefined,
): SomeType | undefined {
    if (!typeOrNode) {
        return;
    }

    return convertType(context, typeOrNode);
}

let typeConversionDepth = 0;
export function convertType(
    context: Context,
    typeOrNode: ts.Type | ts.TypeNode | undefined,
    maybeNode?: ts.TypeNode,
): SomeType {
    if (!typeOrNode) {
        return new IntrinsicType("any");
    }

    if (typeConversionDepth > context.converter.maxTypeConversionDepth) {
        return new UnknownType("...");
    }

    loadConverters();
    if ("kind" in typeOrNode) {
        const converter = converters.get(typeOrNode.kind);
        if (converter) {
            ++typeConversionDepth;
            const result = converter.convert(context, typeOrNode);
            --typeConversionDepth;
            return result;
        }
        return requestBugReport(context, typeOrNode);
    }

    // TS 4.2 added this to enable better tracking of type aliases.
    // We need to check it here, not just in the union checker, because typeToTypeNode
    // will use the origin when serializing
    // aliasSymbol check is important - #2468
    if (typeOrNode.isUnion() && typeOrNode.origin && !typeOrNode.aliasSymbol) {
        // Don't increment typeConversionDepth as this is a transparent step to the user.
        return convertType(context, typeOrNode.origin);
    }

    // IgnoreErrors is important, without it, we can't assert that we will get a node.
    const node = context.checker.typeToTypeNode(
        typeOrNode,
        void 0,
        ts.NodeBuilderFlags.IgnoreErrors,
    );
    assert(node); // According to the TS source of typeToString, this is a bug if it does not hold.

    if (seenTypes.has(typeOrNode.id)) {
        const typeString = context.checker.typeToString(typeOrNode);
        context.logger.verbose(
            `Refusing to recurse when converting type: ${typeString}`,
        );
        return new UnknownType(typeString);
    }

    let converter = converters.get(node.kind);
    if (converter) {
        // Hacky fix for #2011, need to find a better way to choose the converter.
        if (
            converter === intersectionConverter &&
            !typeOrNode.isIntersection()
        ) {
            converter = typeLiteralConverter;
        }

        seenTypes.add(typeOrNode.id);
        ++typeConversionDepth;
        const result = converter.convertType(
            context,
            typeOrNode,
            node,
            maybeNode,
        );
        --typeConversionDepth;
        seenTypes.delete(typeOrNode.id);
        return result;
    }

    return requestBugReport(context, typeOrNode);
}

const arrayConverter: TypeConverter<ts.ArrayTypeNode, ts.TypeReference> = {
    kind: [ts.SyntaxKind.ArrayType],
    convert(context, node) {
        return new ArrayType(convertType(context, node.elementType));
    },
    convertType(context, type) {
        const params = type.aliasTypeArguments || context.checker.getTypeArguments(type);
        // This is *almost* always true... except for when this type is in the constraint of a type parameter see GH#1408
        // assert(params.length === 1);
        assert(params.length > 0);
        return new ArrayType(convertType(context, params[0]));
    },
};

const conditionalConverter: TypeConverter<
    ts.ConditionalTypeNode,
    ts.ConditionalType
> = {
    kind: [ts.SyntaxKind.ConditionalType],
    convert(context, node) {
        return new ConditionalType(
            convertType(context, node.checkType),
            convertType(context, node.extendsType),
            convertType(context, node.trueType),
            convertType(context, node.falseType),
        );
    },
    convertType(context, type) {
        return new ConditionalType(
            convertType(context, type.checkType),
            convertType(context, type.extendsType),
            convertType(context, type.resolvedTrueType),
            convertType(context, type.resolvedFalseType),
        );
    },
};

const constructorConverter: TypeConverter<ts.ConstructorTypeNode, ts.Type> = {
    kind: [ts.SyntaxKind.ConstructorType],
    convert(context, node) {
        const symbol = context.getSymbolAtLocation(node) ?? node.symbol;
        const type = context.getTypeAtLocation(node);
        if (!symbol || !type) {
            return new IntrinsicType("Function");
        }

        const reflection = new DeclarationReflection(
            "__type",
            ReflectionKind.Constructor,
            context.scope,
        );
        const rc = context.withScope(reflection);
        rc.convertingTypeNode = true;

        context.registerReflection(reflection, symbol);
        context.converter.trigger(
            ConverterEvents.CREATE_DECLARATION,
            context,
            reflection,
        );

        const signature = new SignatureReflection(
            "__type",
            ReflectionKind.ConstructorSignature,
            reflection,
        );
        // This is unfortunate... but seems the obvious place to put this with the current
        // architecture. Ideally, this would be a property on a "ConstructorType"... but that
        // needs to wait until TypeDoc 0.22 when making other breaking changes.
        if (
            node.modifiers?.some(
                (m) => m.kind === ts.SyntaxKind.AbstractKeyword,
            )
        ) {
            signature.setFlag(ReflectionFlag.Abstract);
        }
        context.project.registerSymbolId(
            signature,
            context.createSymbolId(symbol, node),
        );
        context.registerReflection(signature, void 0);
        const signatureCtx = rc.withScope(signature);

        reflection.signatures = [signature];
        signature.type = convertType(signatureCtx, node.type);
        signature.parameters = convertParameterNodes(
            signatureCtx,
            signature,
            node.parameters,
        );
        signature.typeParameters = convertTypeParameterNodes(
            signatureCtx,
            node.typeParameters,
        );

        return new ReflectionType(reflection);
    },
    convertType(context, type) {
        const symbol = type.getSymbol();
        if (!symbol) {
            return new IntrinsicType("Function");
        }

        const reflection = new DeclarationReflection(
            "__type",
            ReflectionKind.Constructor,
            context.scope,
        );
        context.registerReflection(reflection, symbol);
        context.converter.trigger(
            ConverterEvents.CREATE_DECLARATION,
            context,
            reflection,
        );

        createSignature(
            context.withScope(reflection),
            ReflectionKind.ConstructorSignature,
            type.getConstructSignatures()[0],
            symbol,
        );

        return new ReflectionType(reflection);
    },
};

const exprWithTypeArgsConverter: TypeConverter<
    ts.ExpressionWithTypeArguments,
    ts.Type
> = {
    kind: [ts.SyntaxKind.ExpressionWithTypeArguments],
    convert(context, node) {
        const targetSymbol = context.getSymbolAtLocation(node.expression);
        // Mixins... we might not have a symbol here.
        if (!targetSymbol) {
            return convertType(
                context,
                context.checker.getTypeAtLocation(node),
            );
        }
        const parameters = node.typeArguments?.map((type) => convertType(context, type)) ?? [];
        const ref = context.createSymbolReference(
            context.resolveAliasedSymbol(targetSymbol),
            context,
        );
        ref.typeArguments = parameters;
        return ref;
    },
    convertType: requestBugReport,
};

const functionTypeConverter: TypeConverter<ts.FunctionTypeNode, ts.Type> = {
    kind: [ts.SyntaxKind.FunctionType],
    convert(context, node) {
        const symbol = context.getSymbolAtLocation(node) ?? node.symbol;
        const type = context.getTypeAtLocation(node);
        if (!symbol || !type) {
            return new IntrinsicType("Function");
        }

        const reflection = new DeclarationReflection(
            "__type",
            ReflectionKind.TypeLiteral,
            context.scope,
        );
        const rc = context.withScope(reflection);

        context.registerReflection(reflection, symbol);
        context.converter.trigger(
            ConverterEvents.CREATE_DECLARATION,
            context,
            reflection,
        );

        const signature = new SignatureReflection(
            "__type",
            ReflectionKind.CallSignature,
            reflection,
        );
        context.project.registerSymbolId(
            signature,
            context.createSymbolId(symbol, node),
        );
        context.registerReflection(signature, undefined);
        const signatureCtx = rc.withScope(signature);

        reflection.signatures = [signature];
        signature.type = convertType(signatureCtx, node.type);
        signature.parameters = convertParameterNodes(
            signatureCtx,
            signature,
            node.parameters,
        );
        signature.typeParameters = convertTypeParameterNodes(
            signatureCtx,
            node.typeParameters,
        );

        return new ReflectionType(reflection);
    },
    convertType(context, type) {
        const symbol = type.getSymbol();
        if (!symbol) {
            return new IntrinsicType("Function");
        }

        const reflection = new DeclarationReflection(
            "__type",
            ReflectionKind.TypeLiteral,
            context.scope,
        );
        context.registerReflection(reflection, symbol);
        context.converter.trigger(
            ConverterEvents.CREATE_DECLARATION,
            context,
            reflection,
        );

        createSignature(
            context.withScope(reflection),
            ReflectionKind.CallSignature,
            type.getCallSignatures()[0],
            type.getSymbol(),
        );

        return new ReflectionType(reflection);
    },
};

const importType: TypeConverter<ts.ImportTypeNode> = {
    kind: [ts.SyntaxKind.ImportType],
    convert(context, node) {
        const name = node.qualifier?.getText() ?? "__module";
        const symbol = context.getSymbolAtLocation(node.qualifier || node);
        // #2792, we should always have a symbol here unless there is a compiler
        // error ignored with ts-expect-error or ts-ignore.
        if (!symbol) {
            return new IntrinsicType("any");
        }

        return context.createSymbolReference(
            context.resolveAliasedSymbol(symbol),
            context,
            name,
        );
    },
    convertType(context, type) {
        const symbol = type.getSymbol();
        assert(symbol, "Missing symbol when converting import type"); // Should be a compiler error
        return context.createSymbolReference(
            context.resolveAliasedSymbol(symbol),
            context,
            "__module",
        );
    },
};

const indexedAccessConverter: TypeConverter<
    ts.IndexedAccessTypeNode,
    ts.IndexedAccessType
> = {
    kind: [ts.SyntaxKind.IndexedAccessType],
    convert(context, node) {
        return new IndexedAccessType(
            convertType(context, node.objectType),
            convertType(context, node.indexType),
        );
    },
    convertType(context, type) {
        return new IndexedAccessType(
            convertType(context, type.objectType),
            convertType(context, type.indexType),
        );
    },
};

const inferredConverter: TypeConverter<ts.InferTypeNode> = {
    kind: [ts.SyntaxKind.InferType],
    convert(context, node) {
        return new InferredType(
            node.typeParameter.name.text,
            maybeConvertType(context, node.typeParameter.constraint),
        );
    },
    convertType(context, type) {
        return new InferredType(
            type.getSymbol()!.name,
            maybeConvertType(context, type.getConstraint()),
        );
    },
};

const intersectionConverter: TypeConverter<
    ts.IntersectionTypeNode,
    ts.IntersectionType
> = {
    kind: [ts.SyntaxKind.IntersectionType],
    convert(context, node) {
        return new IntersectionType(
            node.types.map((type) => convertType(context, type)),
        );
    },
    convertType(context, type) {
        return new IntersectionType(
            type.types.map((type) => convertType(context, type)),
        );
    },
};

const intrinsicConverter: TypeConverter<
    ts.KeywordTypeNode<ts.SyntaxKind.IntrinsicKeyword>,
    ts.Type
> = {
    kind: [ts.SyntaxKind.IntrinsicKeyword],
    convert() {
        return new IntrinsicType("intrinsic");
    },
    convertType() {
        return new IntrinsicType("intrinsic");
    },
};

const jsDocVariadicTypeConverter: TypeConverter<ts.JSDocVariadicType> = {
    kind: [ts.SyntaxKind.JSDocVariadicType],
    convert(context, node) {
        return new ArrayType(convertType(context, node.type));
    },
    convertType(context, type, _node, origNode) {
        assert(isTypeReference(type));
        return arrayConverter.convertType(context, type, null!, origNode);
    },
};

const keywordNames = {
    [ts.SyntaxKind.AnyKeyword]: "any",
    [ts.SyntaxKind.BigIntKeyword]: "bigint",
    [ts.SyntaxKind.BooleanKeyword]: "boolean",
    [ts.SyntaxKind.NeverKeyword]: "never",
    [ts.SyntaxKind.NumberKeyword]: "number",
    [ts.SyntaxKind.ObjectKeyword]: "object",
    [ts.SyntaxKind.StringKeyword]: "string",
    [ts.SyntaxKind.SymbolKeyword]: "symbol",
    [ts.SyntaxKind.UndefinedKeyword]: "undefined",
    [ts.SyntaxKind.UnknownKeyword]: "unknown",
    [ts.SyntaxKind.VoidKeyword]: "void",
    [ts.SyntaxKind.IntrinsicKeyword]: "intrinsic",
};

const keywordConverter: TypeConverter<ts.KeywordTypeNode> = {
    kind: [
        ts.SyntaxKind.AnyKeyword,
        ts.SyntaxKind.BigIntKeyword,
        ts.SyntaxKind.BooleanKeyword,
        ts.SyntaxKind.NeverKeyword,
        ts.SyntaxKind.NumberKeyword,
        ts.SyntaxKind.ObjectKeyword,
        ts.SyntaxKind.StringKeyword,
        ts.SyntaxKind.SymbolKeyword,
        ts.SyntaxKind.UndefinedKeyword,
        ts.SyntaxKind.UnknownKeyword,
        ts.SyntaxKind.VoidKeyword,
    ],
    convert(_context, node) {
        return new IntrinsicType(keywordNames[node.kind]);
    },
    convertType(_context, _type, node) {
        return new IntrinsicType(keywordNames[node.kind]);
    },
};

const optionalConverter: TypeConverter<ts.OptionalTypeNode> = {
    kind: [ts.SyntaxKind.OptionalType],
    convert(context, node) {
        return new OptionalType(
            removeUndefined(convertType(context, node.type)),
        );
    },
    // Handled by the tuple converter
    convertType: requestBugReport,
};

const parensConverter: TypeConverter<ts.ParenthesizedTypeNode> = {
    kind: [ts.SyntaxKind.ParenthesizedType],
    convert(context, node) {
        return convertType(context, node.type);
    },
    // TS strips these out too... shouldn't run into this.
    convertType: requestBugReport,
};

const predicateConverter: TypeConverter<ts.TypePredicateNode, ts.Type> = {
    kind: [ts.SyntaxKind.TypePredicate],
    convert(context, node) {
        const name = ts.isThisTypeNode(node.parameterName)
            ? "this"
            : node.parameterName.getText();
        const asserts = !!node.assertsModifier;
        const targetType = node.type ? convertType(context, node.type) : void 0;
        return new PredicateType(name, asserts, targetType);
    },
    // Never inferred by TS 4.0, could potentially change in a future TS version.
    convertType: requestBugReport,
};

// This is a horrible thing... we're going to want to split this into converters
// for different types at some point.
const typeLiteralConverter = {
    kind: [ts.SyntaxKind.TypeLiteral],
    convert(context, node) {
        const symbol = context.getSymbolAtLocation(node) ?? node.symbol;
        const type = context.getTypeAtLocation(node);
        if (!symbol || !type) {
            return new IntrinsicType("Object");
        }

        const reflection = new DeclarationReflection(
            "__type",
            ReflectionKind.TypeLiteral,
            context.scope,
        );
        const rc = context.withScope(reflection);
        rc.convertingTypeNode = true;

        context.registerReflection(reflection, symbol);
        context.converter.trigger(
            ConverterEvents.CREATE_DECLARATION,
            context,
            reflection,
        );

        for (const prop of context.checker.getPropertiesOfType(type)) {
            convertSymbol(rc, prop);
        }
        for (const signature of type.getCallSignatures()) {
            createSignature(
                rc,
                ReflectionKind.CallSignature,
                signature,
                symbol,
            );
        }
        for (const signature of type.getConstructSignatures()) {
            createSignature(
                rc,
                ReflectionKind.ConstructorSignature,
                signature,
                symbol,
            );
        }

        convertIndexSignatures(rc, type);

        return new ReflectionType(reflection);
    },
    convertType(context, type) {
        const symbol = type.getSymbol();
        const reflection = new DeclarationReflection(
            "__type",
            ReflectionKind.TypeLiteral,
            context.scope,
        );
        context.registerReflection(reflection, symbol);
        context.converter.trigger(
            ConverterEvents.CREATE_DECLARATION,
            context,
            reflection,
        );

        for (const prop of context.checker.getPropertiesOfType(type)) {
            convertSymbol(context.withScope(reflection), prop);
        }
        for (const signature of type.getCallSignatures()) {
            createSignature(
                context.withScope(reflection),
                ReflectionKind.CallSignature,
                signature,
                symbol,
            );
        }
        for (const signature of type.getConstructSignatures()) {
            createSignature(
                context.withScope(reflection),
                ReflectionKind.ConstructorSignature,
                signature,
                symbol,
            );
        }

        if (symbol) {
            convertIndexSignatures(context.withScope(reflection), type);
        }

        return new ReflectionType(reflection);
    },
} satisfies TypeConverter<ts.TypeLiteralNode>;

const queryConverter: TypeConverter<ts.TypeQueryNode> = {
    kind: [ts.SyntaxKind.TypeQuery],
    convert(context, node) {
        const querySymbol = context.getSymbolAtLocation(node.exprName);
        if (!querySymbol) {
            // This can happen if someone uses `typeof` on some property
            // on a variable typed as `any` with a name that doesn't exist.
            return new QueryType(
                ReferenceType.createBrokenReference(
                    node.exprName.getText(),
                    context.project,
                ),
            );
        }

        const ref = context.createSymbolReference(
            context.resolveAliasedSymbol(querySymbol),
            context,
            node.exprName.getText(),
        );
        ref.preferValues = true;
        return new QueryType(ref);
    },
    convertType(context, type, node) {
        // Order matters here - check the node location first so that if the typeof is targeting
        // an instantiation expression we get the user's exprName.
        const symbol = context.getSymbolAtLocation(node.exprName) || type.getSymbol();
        assert(
            symbol,
            `Query type failed to get a symbol for: ${
                context.checker.typeToString(
                    type,
                )
            }. This is a bug.`,
        );
        const ref = context.createSymbolReference(
            context.resolveAliasedSymbol(symbol),
            context,
        );
        ref.preferValues = true;
        return new QueryType(ref);
    },
};

const referenceConverter: TypeConverter<
    ts.TypeReferenceNode,
    ts.TypeReference | ts.StringMappingType | ts.SubstitutionType
> = {
    kind: [ts.SyntaxKind.TypeReference],
    convert(context, node) {
        const type = context.checker.getTypeAtLocation(node.typeName);
        const isArray = context.checker.typeToTypeNode(
            type,
            void 0,
            ts.NodeBuilderFlags.IgnoreErrors,
        )?.kind === ts.SyntaxKind.ArrayType;

        if (isArray) {
            return new ArrayType(convertType(context, node.typeArguments?.[0]));
        }

        const symbol = context.expectSymbolAtLocation(node.typeName);
        const name = node.typeName.getText();

        // Ignore @inline if there are type arguments, as they won't be resolved
        // in the type we just retrieved from node.typeName.
        if (
            !node.typeArguments &&
            context.shouldInline(symbol, name)
        ) {
            return convertTypeInlined(context, type);
        }

        const ref = context.createSymbolReference(
            context.resolveAliasedSymbol(symbol),
            context,
            name,
        );
        ref.typeArguments = node.typeArguments?.map((type) => convertType(context, type));
        return ref;
    },
    convertType(context, type, node, originalNode) {
        // typeName.symbol handles the case where this is a union which happens to refer
        // to an enumeration. TS doesn't put the symbol on the type for some reason, but
        // does add it to the constructed type node.
        const symbol = type.aliasSymbol ?? type.getSymbol() ?? node.typeName.symbol;
        if (!symbol) {
            // This happens when we get a reference to a type parameter
            // created within a mapped type, `K` in: `{ [K in T]: string }`
            const ref = ReferenceType.createBrokenReference(
                context.checker.typeToString(type),
                context.project,
            );
            ref.refersToTypeParameter = true;
            return ref;
        }

        // #2954 mapped type aliases are special! The type that we have here will
        // not point at the type alias which names it like we want, but instead at
        // the mapped type instantiation. Fall back to converting via the original
        // type node to avoid creating a reference which points to the mapped type.
        if (
            originalNode && ts.isTypeReferenceNode(originalNode) && isObjectType(type) &&
            type.objectFlags & ts.ObjectFlags.Mapped
        ) {
            return referenceConverter.convert(context, originalNode);
        }

        let name: string;
        if (ts.isIdentifier(node.typeName)) {
            name = node.typeName.text;
        } else {
            name = node.typeName.right.text;
        }

        if (context.shouldInline(symbol, name)) {
            return convertTypeInlined(context, type);
        }

        const ref = context.createSymbolReference(
            context.resolveAliasedSymbol(symbol),
            context,
            name,
        );

        if (type.flags & ts.TypeFlags.Substitution) {
            // NoInfer<T>
            ref.typeArguments = [
                convertType(context, (type as ts.SubstitutionType).baseType),
            ];
        } else if (type.flags & ts.TypeFlags.StringMapping) {
            ref.typeArguments = [
                convertType(context, (type as ts.StringMappingType).type),
            ];
        } else {
            const args = type.aliasSymbol
                ? type.aliasTypeArguments
                : (type as ts.TypeReference).typeArguments;

            const maxArgLength = originalNode && ts.isTypeReferenceNode(originalNode)
                ? (originalNode.typeArguments?.length ?? 0)
                : args?.length;

            ref.typeArguments = args
                ?.slice(0, maxArgLength)
                .map((ref) => convertType(context, ref));
        }
        return ref;
    },
};

const restConverter: TypeConverter<ts.RestTypeNode> = {
    kind: [ts.SyntaxKind.RestType],
    convert(context, node) {
        return new RestType(convertType(context, node.type));
    },
    // This is handled in the tuple converter
    convertType: requestBugReport,
};

const namedTupleMemberConverter: TypeConverter<ts.NamedTupleMember> = {
    kind: [ts.SyntaxKind.NamedTupleMember],
    convert(context, node) {
        const innerType = convertType(context, node.type);
        return new NamedTupleMember(
            node.name.getText(),
            !!node.questionToken,
            innerType,
        );
    },
    // This ought to be impossible.
    convertType: requestBugReport,
};

// { -readonly [K in string]-?: number}
//   ^ readonlyToken
//              ^ typeParameter
//                   ^^^^^^ typeParameter.constraint
//                          ^ questionToken
//                              ^^^^^^ type
const mappedConverter: TypeConverter<
    ts.MappedTypeNode,
    ts.Type & {
        // Beware! Internal TS API here.
        templateType: ts.Type;
        typeParameter: ts.TypeParameter;
        constraintType: ts.Type;
        nameType?: ts.Type;
    }
> = {
    kind: [ts.SyntaxKind.MappedType],
    convert(context, node) {
        const optionalModifier = kindToModifier(node.questionToken?.kind);
        const templateType = convertType(context, node.type);

        return new MappedType(
            node.typeParameter.name.text,
            convertType(context, node.typeParameter.constraint),
            optionalModifier === "+"
                ? removeUndefined(templateType)
                : templateType,
            kindToModifier(node.readonlyToken?.kind),
            optionalModifier,
            node.nameType ? convertType(context, node.nameType) : void 0,
        );
    },
    convertType(context, type, node) {
        // This can happen if a generic function does not have a return type annotated.
        const optionalModifier = kindToModifier(node.questionToken?.kind);
        const templateType = convertType(context, type.templateType);

        return new MappedType(
            type.typeParameter.symbol.name || "__type",
            convertType(context, type.typeParameter.getConstraint()),
            optionalModifier === "+"
                ? removeUndefined(templateType)
                : templateType,
            kindToModifier(node.readonlyToken?.kind),
            optionalModifier,
            type.nameType ? convertType(context, type.nameType) : void 0,
        );
    },
};

const literalTypeConverter: TypeConverter<ts.LiteralTypeNode, ts.LiteralType> = {
    kind: [ts.SyntaxKind.LiteralType],
    convert(context, node) {
        switch (node.literal.kind) {
            case ts.SyntaxKind.TrueKeyword:
            case ts.SyntaxKind.FalseKeyword:
                return new LiteralType(
                    node.literal.kind === ts.SyntaxKind.TrueKeyword,
                );
            case ts.SyntaxKind.StringLiteral:
                return new LiteralType(node.literal.text);
            case ts.SyntaxKind.NumericLiteral:
                return new LiteralType(Number(node.literal.text));
            case ts.SyntaxKind.NullKeyword:
                return new LiteralType(null);
            case ts.SyntaxKind.PrefixUnaryExpression: {
                const operand = (node.literal as ts.PrefixUnaryExpression)
                    .operand;
                switch (operand.kind) {
                    case ts.SyntaxKind.NumericLiteral:
                        return new LiteralType(
                            Number(node.literal.getText()),
                        );
                    case ts.SyntaxKind.BigIntLiteral:
                        return new LiteralType(
                            BigInt(node.literal.getText().replace("n", "")),
                        );
                    default:
                        return requestBugReport(context, node.literal);
                }
            }
            case ts.SyntaxKind.BigIntLiteral:
                return new LiteralType(
                    BigInt(node.literal.getText().replace("n", "")),
                );
            case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
                return new LiteralType(node.literal.text);
        }

        return requestBugReport(context, node.literal);
    },
    convertType(_context, type, node) {
        switch (node.literal.kind) {
            case ts.SyntaxKind.StringLiteral:
                return new LiteralType(node.literal.text);
            case ts.SyntaxKind.NumericLiteral:
                return new LiteralType(+node.literal.text);
            case ts.SyntaxKind.TrueKeyword:
            case ts.SyntaxKind.FalseKeyword:
                return new LiteralType(
                    node.literal.kind === ts.SyntaxKind.TrueKeyword,
                );
            case ts.SyntaxKind.NullKeyword:
                return new LiteralType(null);
        }

        if (typeof type.value === "object") {
            return new LiteralType(
                BigInt(
                    `${type.value.negative ? "-" : ""}${type.value.base10Value}`,
                ),
            );
        }

        return new LiteralType(type.value);
    },
};

const templateLiteralConverter: TypeConverter<
    ts.TemplateLiteralTypeNode,
    ts.TemplateLiteralType
> = {
    kind: [ts.SyntaxKind.TemplateLiteralType],
    convert(context, node) {
        return new TemplateLiteralType(
            node.head.text,
            node.templateSpans.map((span) => {
                return [convertType(context, span.type), span.literal.text];
            }),
        );
    },
    convertType(context, type) {
        assert(type.texts.length === type.types.length + 1);
        const parts: [SomeType, string][] = [];
        for (const [a, b] of zip(type.types, type.texts.slice(1))) {
            parts.push([convertType(context, a), b]);
        }

        return new TemplateLiteralType(type.texts[0], parts);
    },
};

const thisConverter: TypeConverter<ts.ThisTypeNode> = {
    kind: [ts.SyntaxKind.ThisType],
    convert() {
        return new IntrinsicType("this");
    },
    convertType() {
        return new IntrinsicType("this");
    },
};

const tupleConverter = {
    kind: [ts.SyntaxKind.TupleType],
    convert(context, node) {
        const elements = node.elements.map((node) => convertType(context, node));
        return new TupleType(elements);
    },
    convertType(context, type, node) {
        const types = type.typeArguments?.slice(0, node.elements.length);
        let elements = types?.map((type) => convertType(context, type));

        if (type.target.labeledElementDeclarations) {
            const namedDeclarations = type.target.labeledElementDeclarations;
            elements = elements?.map((el, i) => {
                const namedDecl = namedDeclarations[i];
                return namedDecl
                    ? new NamedTupleMember(
                        namedDecl.name.getText(),
                        !!namedDecl.questionToken,
                        removeUndefined(el),
                    )
                    : el;
            });
        }

        elements = elements?.map((el, i) => {
            if (type.target.elementFlags[i] & ts.ElementFlags.Variable) {
                // In the node case, we don't need to add the wrapping Array type... but we do here.
                if (el instanceof NamedTupleMember) {
                    return new RestType(
                        new NamedTupleMember(
                            el.name,
                            el.isOptional,
                            new ArrayType(el.element),
                        ),
                    );
                }

                return new RestType(new ArrayType(el));
            }

            if (
                type.target.elementFlags[i] & ts.ElementFlags.Optional &&
                !(el instanceof NamedTupleMember)
            ) {
                return new OptionalType(removeUndefined(el));
            }

            return el;
        });

        return new TupleType(elements ?? []);
    },
} satisfies TypeConverter<ts.TupleTypeNode, ts.TupleTypeReference>;

const supportedOperatorNames = {
    [ts.SyntaxKind.KeyOfKeyword]: "keyof",
    [ts.SyntaxKind.UniqueKeyword]: "unique",
    [ts.SyntaxKind.ReadonlyKeyword]: "readonly",
} as const;

const typeOperatorConverter: TypeConverter<ts.TypeOperatorNode> = {
    kind: [ts.SyntaxKind.TypeOperator],
    convert(context, node) {
        return new TypeOperatorType(
            convertType(context, node.type),
            supportedOperatorNames[node.operator],
        );
    },
    convertType(context, type, node) {
        // readonly is only valid on array and tuple literal types.
        if (node.operator === ts.SyntaxKind.ReadonlyKeyword) {
            const resolved = resolveReference(type);
            assert(isObjectType(resolved));
            const args = context.checker
                .getTypeArguments(type as ts.TypeReference)
                .map((type) => convertType(context, type));
            const inner = resolved.objectFlags & ts.ObjectFlags.Tuple
                ? new TupleType(args)
                : new ArrayType(args[0]);

            return new TypeOperatorType(inner, "readonly");
        }

        // keyof will only show up with generic functions, otherwise it gets eagerly
        // resolved to a union of strings.
        if (node.operator === ts.SyntaxKind.KeyOfKeyword) {
            // There's probably an interface for this somewhere... I couldn't find it.
            const targetType = (type as ts.Type & { type: ts.Type }).type;
            return new TypeOperatorType(
                convertType(context, targetType),
                "keyof",
            );
        }

        // TS drops `unique` in `unique symbol` everywhere. If someone used it, we ought
        // to have a type node. This shouldn't ever happen.
        return requestBugReport(context, type);
    },
};

const unionConverter: TypeConverter<ts.UnionTypeNode, ts.UnionType> = {
    kind: [ts.SyntaxKind.UnionType],
    convert(context, node) {
        return new UnionType(
            node.types.map((type) => convertType(context, type)),
        );
    },
    convertType(context, type) {
        const types = type.types.map((type) => convertType(context, type));
        normalizeUnion(types);
        sortLiteralUnion(types);

        return new UnionType(types);
    },
};

const jSDocTypeExpressionConverter: TypeConverter<ts.JSDocTypeExpression> = {
    kind: [ts.SyntaxKind.JSDocTypeExpression],
    convert(context, node) {
        return convertType(context, node.type);
    },
    convertType: requestBugReport,
};

const jsDocNullableTypeConverter: TypeConverter<ts.JSDocNullableType> = {
    kind: [ts.SyntaxKind.JSDocNullableType],
    convert(context, node) {
        return new UnionType([
            convertType(context, node.type),
            new LiteralType(null),
        ]);
    },
    // Should be a UnionType
    convertType: requestBugReport,
};

const jsDocNonNullableTypeConverter: TypeConverter<ts.JSDocNonNullableType> = {
    kind: [ts.SyntaxKind.JSDocNonNullableType],
    convert(context, node) {
        return convertType(context, node.type);
    },
    // Should be a UnionType
    convertType: requestBugReport,
};

const jsDocAllTypeConverter: TypeConverter<ts.JSDocAllType> = {
    kind: [ts.SyntaxKind.JSDocAllType],
    convert() {
        return new IntrinsicType("any");
    },
    // Should be a UnionType
    convertType: requestBugReport,
};

function requestBugReport(context: Context, nodeOrType: ts.Node | ts.Type) {
    if ("kind" in nodeOrType) {
        const kindName = ts.SyntaxKind[nodeOrType.kind];
        context.logger.warn(
            `Failed to convert type node with kind: ${kindName} and text ${nodeOrType.getText()}. Please report a bug.` as TranslatedString,
            nodeOrType,
        );
        return new UnknownType(nodeOrType.getText());
    } else {
        const typeString = context.checker.typeToString(nodeOrType);
        context.logger.warn(
            `Failed to convert type: ${typeString} when converting ${context.scope.getFullName()}. Please report a bug.` as TranslatedString,
        );
        return new UnknownType(typeString);
    }
}

function resolveReference(type: ts.Type) {
    if (isObjectType(type) && type.objectFlags & ts.ObjectFlags.Reference) {
        return (type as ts.TypeReference).target;
    }
    return type;
}

function kindToModifier(
    kind:
        | ts.SyntaxKind.PlusToken
        | ts.SyntaxKind.MinusToken
        | ts.SyntaxKind.ReadonlyKeyword
        | ts.SyntaxKind.QuestionToken
        | undefined,
): "+" | "-" | undefined {
    switch (kind) {
        case ts.SyntaxKind.ReadonlyKeyword:
        case ts.SyntaxKind.QuestionToken:
        case ts.SyntaxKind.PlusToken:
            return "+";
        case ts.SyntaxKind.MinusToken:
            return "-";
        default:
            return undefined;
    }
}

function sortLiteralUnion(types: SomeType[]) {
    if (
        types.some((t) => t.type !== "literal" || typeof t.value !== "number")
    ) {
        return;
    }

    types.sort((a, b) => {
        const aLit = a as LiteralType;
        const bLit = b as LiteralType;

        return (aLit.value as number) - (bLit.value as number);
    });
}

function normalizeUnion(types: SomeType[]) {
    let trueIndex = -1;
    let falseIndex = -1;
    for (
        let i = 0;
        i < types.length && (trueIndex === -1 || falseIndex === -1);
        i++
    ) {
        const t = types[i];
        if (t instanceof LiteralType) {
            if (t.value === true) {
                trueIndex = i;
            }
            if (t.value === false) {
                falseIndex = i;
            }
        }
    }

    if (trueIndex !== -1 && falseIndex !== -1) {
        types.splice(Math.max(trueIndex, falseIndex), 1);
        types.splice(
            Math.min(trueIndex, falseIndex),
            1,
            new IntrinsicType("boolean"),
        );
    }
}

function convertTypeInlined(context: Context, type: ts.Type): SomeType {
    if (type.isUnion()) {
        const types = type.types.map(type => convertType(context, type));
        return new UnionType(types);
    }

    if (type.isIntersection()) {
        const types = type.types.map(type => convertType(context, type));
        return new IntersectionType(types);
    }

    if (type.isLiteral()) {
        return new LiteralType(
            typeof type.value === "object"
                ? BigInt(type.value.base10Value) * (type.value.negative ? -1n : 1n)
                : type.value,
        );
    }

    if (context.checker.isArrayType(type)) {
        const elementType = convertType(context, context.checker.getTypeArguments(type as ts.TypeReference)[0]);
        return new ArrayType(elementType);
    }
    if (isTypeReference(type) && context.checker.isTupleType(type)) {
        const tupleNode = context.checker.typeToTypeNode(type.target, void 0, ts.NodeBuilderFlags.IgnoreErrors)!;
        if (ts.isTupleTypeNode(tupleNode)) {
            return tupleConverter.convertType(context, type as ts.TupleTypeReference, tupleNode);
        }
    }

    return typeLiteralConverter.convertType(
        context,
        type,
    );
}
