/// <reference path="fourslash.ts" />

// Issue #62181: Original example from the issue

// @strict: true
// @target: esnext
// @lib: esnext

//// interface ZodType<T> {
////   optional: "true" | "false";
////   output: T;
//// }
////
//// interface ZodString extends ZodType<string> {
////   optional: "false";
//// }
////
//// type ZodShape = Record<string, any>;
//// type Prettify<T> = { [K in keyof T]: T[K] } & {};
//// type InferObjectType<Shape extends ZodShape> = Prettify<
////   {
////     [k in keyof Shape as Shape[k] extends { optional: "true" }
////       ? k
////       : never]?: Shape[k]["output"];
////   } & {
////     [k in keyof Shape as Shape[k] extends { optional: "true" }
////       ? never
////       : k]: Shape[k]["output"];
////   }
//// >;
//// interface ZodObject<T extends ZodShape> extends ZodType<InferObjectType<T>> {
////   optional: "false";
//// }
////
//// interface ZodOptional<T extends ZodType<any>>
////   extends ZodType<T["output"] | undefined> {
////   optional: "true";
//// }
////
//// declare function object<T extends ZodShape>(shape: T): ZodObject<T>;
//// declare function string(): ZodString;
//// declare function optional<T extends ZodType<any>>(schema: T): ZodOptional<T>;
////
//// const Category = object({
////   name: string(),
////   get /*1*/parent() {
////     return optional([|Category|]);
////   },
//// });
////
//// export const output = Category.output;

// First call quickInfoAt - this triggers resolution in a specific order
// Note the expected type of the getter is correctly inferred.
verify.quickInfoAt("1", `(getter) parent: ZodOptional<ZodType<any>>`);

// The key assertion: calling quickInfoAt first should NOT introduce ghost errors.
// The 2345 error is due to incomplete type definitions in the example.
verify.getSemanticDiagnostics([{
    code: 2345,
    message: `Argument of type 'ZodObject<{ name: ZodString; readonly parent: ZodOptional<ZodType<any>>; }>' is not assignable to parameter of type 'ZodType<any>'.\n  Property 'output' is missing in type 'ZodObject<{ name: ZodString; readonly parent: ZodOptional<ZodType<any>>; }>' but required in type 'ZodType<any>'.`
}]);
