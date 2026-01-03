/// <reference path="fourslash.ts" />

// Issue #62181: Ghost error in circular type situation
// This test verifies that normal semantic diagnostics (without quickInfoAt first)
// produce consistent results. This is the "normal" code path that was NOT affected
// by the bug (per "Why Normal Diagnostics Don't Have This Problem" in the analysis).
//
// The key insight: when diagnostics are checked normally, the outer object() call
// triggers getResolvedSignature first, which establishes resolutionStart barrier early.
// This test ensures this path continues to work correctly.

// @strict: true
// @target: esnext

//// // Minimal Zod-like type definition
//// interface ZodType<T = any> {
////     _output: T;
//// }
////
//// interface ZodObject<T extends Record<string, ZodType>> extends ZodType<{ [K in keyof T]: T[K]["_output"] }> {
////     shape: T;
//// }
////
//// interface ZodString extends ZodType<string> {}
////
//// interface ZodOptional<T extends ZodType> extends ZodType<T["_output"] | undefined> {}
////
//// declare function object<T extends Record<string, ZodType>>(shape: T): ZodObject<T>;
//// declare function string(): ZodString;
//// declare function optional<T extends ZodType>(type: T): ZodOptional<T>;
////
//// // Recursive self-reference through getter
//// const [|Category|] = object({
////     name: string(),
////     get parent() {
////         return optional(Category);
////     },
//// });

// Only call getSemanticDiagnostics - NO quickInfoAt
// This is the "normal" diagnostic path that should produce consistent results.
// Expected: exactly one TS7022 error for the self-referential pattern.
verify.getSemanticDiagnostics([{
    code: 7022,
    message: "'Category' implicitly has type 'any' because it does not have a type annotation and is referenced directly or indirectly in its own initializer.",
}]);
