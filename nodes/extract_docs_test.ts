import { AvroSchemaInput } from '../gen/messages_pb';
import { extractDocs } from './extract_docs';
import { makeTestContext, USER_RECORD_SCHEMA } from './test_helpers';

const ctx = makeTestContext();

describe('ExtractDocs', () => {
  it('collects docs from the schema root, nested named types, and fields', () => {
    const input = new AvroSchemaInput();
    input.setSchema(USER_RECORD_SCHEMA);
    const result = extractDocs(ctx, input);
    expect(result.getValid()).toBe(true);
    const byPath = Object.fromEntries(result.getDocsList().map((d) => [d.getPath(), d.getDoc()]));
    expect(byPath['']).toBe('A user account record.');
    expect(byPath['/fields/0']).toBe('Primary key.'); // id field
    expect(Object.values(byPath)).toContain('Account lifecycle state.'); // Status enum doc
  });

  it('returns an empty list (not an error) for a schema with no docs', () => {
    const input = new AvroSchemaInput();
    input.setSchema(JSON.stringify({ type: 'record', name: 'Plain', fields: [{ name: 'x', type: 'int' }] }));
    const result = extractDocs(ctx, input);
    expect(result.getValid()).toBe(true);
    expect(result.getDocsList()).toEqual([]);
  });

  it('returns a structured error for a malformed schema', () => {
    const input = new AvroSchemaInput();
    input.setSchema('{{');
    const result = extractDocs(ctx, input);
    expect(result.getValid()).toBe(false);
  });
});
