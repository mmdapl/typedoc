import type { SomeType } from "./types.js";
import { Reflection, type TraverseCallback } from "./Reflection.js";
import type { DeclarationReflection } from "./DeclarationReflection.js";
import { ReflectionKind } from "./kind.js";
import type { Deserializer, JSONOutput, Serializer } from "#serialization";
import type { SignatureReflection } from "./SignatureReflection.js";

/**
 * Modifier flags for type parameters, added in TS 4.7
 * @enum
 */
export const VarianceModifier = {
    in: "in",
    out: "out",
    inOut: "in out",
} as const;
export type VarianceModifier = (typeof VarianceModifier)[keyof typeof VarianceModifier];

/**
 * @category Reflections
 */
export class TypeParameterReflection extends Reflection {
    readonly variant = "typeParam";

    declare parent?: DeclarationReflection | SignatureReflection;

    type?: SomeType;

    default?: SomeType;

    varianceModifier?: VarianceModifier;

    constructor(
        name: string,
        parent: Reflection,
        varianceModifier: VarianceModifier | undefined,
    ) {
        super(name, ReflectionKind.TypeParameter, parent);
        this.varianceModifier = varianceModifier;
    }

    override isTypeParameter(): this is TypeParameterReflection {
        return true;
    }

    override toObject(
        serializer: Serializer,
    ): JSONOutput.TypeParameterReflection {
        return {
            ...super.toObject(serializer),
            variant: this.variant,
            type: serializer.toObject(this.type),
            default: serializer.toObject(this.default),
            varianceModifier: this.varianceModifier,
        };
    }

    override fromObject(
        de: Deserializer,
        obj: JSONOutput.TypeParameterReflection,
    ): void {
        super.fromObject(de, obj);
        this.type = de.reviveType(obj.type);
        this.default = de.reviveType(obj.default);
        this.varianceModifier = obj.varianceModifier;
    }

    override traverse(_callback: TraverseCallback): void {
        // do nothing, no child reflections.
    }
}
