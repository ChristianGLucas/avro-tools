import { AvroSchemaInput } from '../gen/messages_pb';
import { listAliases } from './list_aliases';
import { makeTestContext, USER_RECORD_SCHEMA } from './test_helpers';

const ctx = makeTestContext();

describe('ListAliases', () => {
  it('collects aliases declared at the schema root and on fields', () => {
    const input = new AvroSchemaInput();
    input.setSchema(USER_RECORD_SCHEMA);
    const result = listAliases(ctx, input);
    expect(result.getValid()).toBe(true);
    const byPath = Object.fromEntries(result.getEntriesList().map((e) => [e.getPath(), e.getAliasesList()]));
    expect(byPath['']).toEqual(['Account']);
  });

  it('collects aliases declared on a record field', () => {
    const schema = JSON.stringify({
      type: 'record',
      name: 'R',
      fields: [{ name: 'x', type: 'int', aliases: ['y', 'oldX'] }],
    });
    const input = new AvroSchemaInput();
    input.setSchema(schema);
    const result = listAliases(ctx, input);
    expect(result.getValid()).toBe(true);
    const entries = result.getEntriesList();
    expect(entries).toHaveLength(1);
    expect(entries[0].getPath()).toBe('/fields/0');
    expect(entries[0].getAliasesList()).toEqual(['y', 'oldX']);
  });

  it('returns an empty list (not an error) for a schema with no aliases', () => {
    const input = new AvroSchemaInput();
    input.setSchema(JSON.stringify({ type: 'record', name: 'Plain', fields: [{ name: 'x', type: 'int' }] }));
    const result = listAliases(ctx, input);
    expect(result.getValid()).toBe(true);
    expect(result.getEntriesList()).toEqual([]);
  });

  it('returns a structured error for a malformed schema', () => {
    const input = new AvroSchemaInput();
    input.setSchema('{{');
    const result = listAliases(ctx, input);
    expect(result.getValid()).toBe(false);
  });
});
