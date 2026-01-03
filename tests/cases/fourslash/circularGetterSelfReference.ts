/// <reference path="fourslash.ts" />

// Issue #62181: Ghost error in circular type situation
// When quickInfoAt is called before getSemanticDiagnostics, the compiler
// was producing an extra error (TS7023) due to order-dependent cycle detection.

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
//// // The problematic pattern: recursive self-reference through getter
//// const /*1*/[|Category|] = object({
////     name: string(),
////     get /*2*/parent() {
////         return optional(Category);  // Self-reference through getter
////     },
//// });
////
//// type CategoryType = typeof Category._output;

// 1. First call quickInfoAt (this triggers the resolution in a specific order)
// This is the key part of the test - quickInfoAt triggers type resolution in a different
// order than normal semantic checking, which previously caused ghost errors.
goTo.marker("1");
verify.quickInfoExists();

goTo.marker("2");
verify.quickInfoExists();

// 2. Then verify diagnostics - should be consistent regardless of quickInfoAt being called first
// The key assertion: calling quickInfoAt first should NOT introduce additional ghost errors.
// Before the fix, calling quickInfoAt would cause an extra TS7023 error to appear.
//
// We expect exactly one error: TS7022 for the self-referential pattern.
// This is a legitimate error - the Category variable references itself in its initializer.
verify.getSemanticDiagnostics([{
    code: 7022,
    message: "'Category' implicitly has type 'any' because it does not have a type annotation and is referenced directly or indirectly in its own initializer.",
}]);
