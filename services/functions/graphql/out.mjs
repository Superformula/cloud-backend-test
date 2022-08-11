const DUMMY_RESOLVER = { serialize: x => x, parseValue: x => x }; 
import SchemaBuilder from '@pothos/core';
import ErrorsPlugin from '@pothos/plugin-errors';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';
import TracingPlugin from '@pothos/plugin-tracing';
var builder = new SchemaBuilder({
    plugins: [
        TracingPlugin,
        SimpleObjectsPlugin,
        ErrorsPlugin
    ],
    errorOptions: { defaultTypes: [] }
});
var CoordinateType = builder.simpleObject('Coordinate', {
    fields: t => ({
        latitude: t.float({ nullable: false }),
        longitude: t.float({ nullable: false })
    })
});
builder.objectType(class Error {
}, {
    name: 'Error',
    fields: t => ({ message: t.exposeString('message') })
});
builder.queryType({
    fields: t => ({
        coordinate: t.field({
            type: CoordinateType,
            errors: { types: [Error] },
            args: { address: t.arg.string({ required: true }) }
        })
    })
});
var schema = builder.toSchema({});
export {
    schema
};