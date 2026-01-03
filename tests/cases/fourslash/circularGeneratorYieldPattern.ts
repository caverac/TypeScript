/// <reference path="fourslash.ts" />

// Issue #62181: Ghost error in circular type situation
// Test case: Generator/Effect pattern with circular type dependencies

// @strict: true
// @target: esnext
// @lib: esnext

//// interface Wrapper<T> {
////     value: T;
////     [Symbol.iterator](): Generator<Wrapper<T>, T>;
//// }
////
//// declare function wrap<T>(value: T): Wrapper<T>;
////
//// declare function run<T, Y extends Wrapper<any>>(
////     gen: () => Generator<Y, T>
//// ): T;
////
//// // Pattern that creates circular resolution during signature inference
//// const /*1*/result = run(function* () {
////     const a = yield* wrap(1);
////     const /*2*/b = yield* wrap("hello");
////     return { a, b };
//// });

// Trigger quickInfo first to test the "inverted" resolution path
goTo.marker("1");
verify.quickInfoExists();

goTo.marker("2");
verify.quickInfoExists();

// No ghost errors should appear
verify.getSemanticDiagnostics([]);
