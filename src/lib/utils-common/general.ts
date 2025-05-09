/**
 * This type provides a flag that can be used to turn off more lax overloads intended for
 * plugin use only to catch type errors in the TypeDoc codebase. The prepublishOnly npm
 * script will be used to switch this flag to false when publishing, then immediately back
 * to true after a successful publish.
 */
type InternalOnly = true;

/**
 * Helper type to convert `T` to `F` if compiling TypeDoc with stricter types.
 *
 * Can be used in overloads to map a parameter type to `never`. For example, the
 * following function will work with any string argument, but to improve the type safety
 * of internal code, we only ever want to pass 'a' or 'b' to it. Plugins on the other
 * hand need to be able to pass any string to it. Overloads similar to this are used
 * in the {@link Options} class.
 *
 * This is also used to prevent TypeDoc code from using deprecated methods which will
 * be removed in a future release.
 *
 * ```ts
 * function over(flag: 'a' | 'b'): string
 * // deprecated
 * function over(flag: IfInternal<never, string>): string
 * function over(flag: string): string { return flag }
 * ```
 */
export type IfInternal<T, F> = InternalOnly extends true ? T : F;

/**
 * Helper type to convert `T` to `never` if compiling TypeDoc with stricter types.
 *
 * See {@link IfInternal} for the rationale.
 */
export type NeverIfInternal<T> = IfInternal<never, T>;

/**
 * Utility to help type checking ensure that there is no uncovered case.
 */
export function assertNever(x: never): never {
    throw new Error(
        `Expected handling to cover all possible cases, but it didn't cover: ${JSON.stringify(x)}`,
    );
}

export function assert(x: unknown, message = "Assertion failed"): asserts x {
    if (!x) {
        throw new Error(message);
    }
}

export function NonEnumerable(
    _cls: unknown,
    context: ClassFieldDecoratorContext,
) {
    context.addInitializer(function () {
        Object.defineProperty(this, context.name, {
            enumerable: false,
            configurable: true,
            writable: true,
        });
    });
}
