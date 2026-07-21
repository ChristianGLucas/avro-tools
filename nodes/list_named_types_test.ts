import * as avro from 'avsc';
import { AvroSchemaInput } from '../gen/messages_pb';
import { listNamedTypes } from './list_named_types';
import { makeTestContext, USER_RECORD_SCHEMA, NESTED_UNION_SCHEMA } from './test_helpers';

const ctx = makeTestContext();

describe('ListNamedTypes', () => {
  it('lists every named type declared in the schema, deduplicated by full name', () => {
    const input = new AvroSchemaInput();
    input.setSchema(USER_RECORD_SCHEMA);
    const result = listNamedTypes(ctx, input);
    expect(result.getValid()).toBe(true);
    const byName = Object.fromEntries(result.getTypesList().map((t) => [t.getFullName(), t]));
    expect(Object.keys(byName).sort()).toEqual(['com.example.Key16', 'com.example.Status', 'com.example.User'].sort());
    expect(byName['com.example.User'].getType()).toBe('record');
    expect(byName['com.example.Status'].getType()).toBe('enum');
    expect(byName['com.example.Status'].getDoc()).toBe('Account lifecycle state.');
    expect(byName['com.example.Key16'].getType()).toBe('fixed');
  });

  it('finds a named type nested inside a union branch, independently cross-checked against avsc\'s own registry', () => {
    const input = new AvroSchemaInput();
    input.setSchema(NESTED_UNION_SCHEMA);
    const result = listNamedTypes(ctx, input);
    expect(result.getValid()).toBe(true);
    const fullNames = result.getTypesList().map((t) => t.getFullName());
    expect(fullNames).toEqual(['com.example.Inner']);

    // Independent oracle: avsc's own `registry` option (not our walker) is
    // the authoritative source for which named types a schema resolves to.
    const registry: Record<string, avro.Type> = {};
    avro.Type.forSchema(JSON.parse(NESTED_UNION_SCHEMA), { registry });
    const namedInRegistry = Object.keys(registry).filter((k) => avro.Type.isType(registry[k], 'record', 'enum', 'fixed'));
    expect(namedInRegistry).toEqual(fullNames);
  });

  it('returns a structured error for a malformed schema', () => {
    const input = new AvroSchemaInput();
    input.setSchema('nope');
    const result = listNamedTypes(ctx, input);
    expect(result.getValid()).toBe(false);
  });
});
