/// <reference path="fourslash.ts" />

// Issue #62181: Ghost error in circular type situation
// Test case: Multiple accessor properties with interdependent circular references
// Tests the fix with multiple getters that each create their own resolution path.

// @strict: true
// @target: esnext

//// interface SchemaType<T = any> {
////     readonly _output: T;
//// }
////
//// interface ObjectType<T extends Record<string, SchemaType>> extends SchemaType<{
////     [K in keyof T]: T[K]["_output"]
//// }> {}
////
//// interface OptionalType<T extends SchemaType> extends SchemaType<T["_output"] | undefined> {}
////
//// interface ArrayType<T extends SchemaType> extends SchemaType<T["_output"][]> {}
////
//// declare function object<T extends Record<string, SchemaType>>(shape: T): ObjectType<T>;
//// declare function optional<T extends SchemaType>(type: T): OptionalType<T>;
//// declare function array<T extends SchemaType>(type: T): ArrayType<T>;
//// declare function str(): SchemaType<string>;
////
//// // Complex self-referential structure with multiple circular paths
//// const /*1*/[|Person|] = object({
////     name: str(),
////     get /*2*/spouse() {
////         return optional(Person);  // Circular path 1
////     },
////     get /*3*/children() {
////         return array(Person);     // Circular path 2
////     },
////     get /*4*/bestFriend() {
////         return optional(Person);  // Circular path 3
////     },
//// });

// Access multiple getters through quickInfo to stress test the resolution
goTo.marker("1");
verify.quickInfoExists();

goTo.marker("2");
verify.quickInfoExists();

goTo.marker("3");
verify.quickInfoExists();

goTo.marker("4");
verify.quickInfoExists();

// Should have exactly one error for the self-reference, no ghost errors
verify.getSemanticDiagnostics([{
    code: 7022,
    message: "'Person' implicitly has type 'any' because it does not have a type annotation and is referenced directly or indirectly in its own initializer.",
}]);
