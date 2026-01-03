/// <reference path="fourslash.ts" />

// Issue #62181: Ghost error in circular type situation
// Test case: Nested circular references through multiple getters
// This tests a more complex scenario where multiple getters create a chain of circular references.

// @strict: true
// @target: esnext

//// interface Schema<T = any> {
////     _type: T;
//// }
////
//// interface ObjectSchema<T extends Record<string, Schema>> extends Schema<{ [K in keyof T]: T[K]["_type"] }> {
////     shape: T;
//// }
////
//// interface ArraySchema<T extends Schema> extends Schema<T["_type"][]> {
////     element: T;
//// }
////
//// declare function obj<T extends Record<string, Schema>>(shape: T): ObjectSchema<T>;
//// declare function arr<T extends Schema>(element: T): ArraySchema<T>;
////
//// // Nested circular reference: Tree -> children -> Tree[]
//// const /*1*/[|Tree|] = obj({
////     value: { _type: "" as string } as Schema<string>,
////     get /*2*/children() {
////         return arr(Tree);  // Circular: Tree -> children -> Tree[]
////     },
//// });
////
//// // Double circular reference: Node -> parent, children
//// const [|Node|] = obj({
////     id: { _type: 0 as number } as Schema<number>,
////     get /*3*/parent() {
////         return Node;  // Circular to self
////     },
////     get children() {
////         return arr(Node);  // Circular through array
////     },
//// });

// Trigger type resolution through quickInfo first
goTo.marker("1");
verify.quickInfoExists();

goTo.marker("2");
verify.quickInfoExists();

goTo.marker("3");
verify.quickInfoExists();

// Verify consistent diagnostics - only the expected circularity errors, no ghost errors
// Both Tree and Node have self-references in their initializers
// Order matters: Tree comes first in the file (position 476), then Node (position 704)
const ranges = test.ranges();
verify.getSemanticDiagnostics([
    {
        code: 7022,
        message: "'Tree' implicitly has type 'any' because it does not have a type annotation and is referenced directly or indirectly in its own initializer.",
        range: ranges[0],
    },
    {
        code: 7022,
        message: "'Node' implicitly has type 'any' because it does not have a type annotation and is referenced directly or indirectly in its own initializer.",
        range: ranges[1],
    },
]);
