import { AvroSchemaInput } from '../gen/messages_pb';
import { parseSchema } from './parse_schema';
import { makeTestContext, USER_RECORD_SCHEMA } from './test_helpers';

const ctx = makeTestContext();

describe('ParseSchema', () => {
  it('parses a named record schema into its structured shape', () => {
    const input = new AvroSchemaInput();
    input.setSchema(USER_RECORD_SCHEMA);
    const result = parseSchema(ctx, input);
    expect(result.getValid()).toBe(true);
    expect(result.getSchemaType()).toBe('record');
    expect(result.getName()).toBe('User');
    expect(result.getNamespace()).toBe('com.example');
    expect(result.getFullName()).toBe('com.example.User');
    expect(result.getDoc()).toBe('A user account record.');
    expect(result.getAliasesList()).toEqual(['Account']);
    // The normalized form must at least round-trip as valid JSON and
    // contain the fully-qualified name.
    const normalized = JSON.parse(result.getNormalizedJson());
    expect(normalized.name).toBe('com.example.User');
  });

  it('parses a bare primitive schema', () => {
    const input = new AvroSchemaInput();
    input.setSchema('"string"');
    const result = parseSchema(ctx, input);
    expect(result.getValid()).toBe(true);
    expect(result.getSchemaType()).toBe('string');
    expect(result.getName()).toBe('');
    expect(result.getFullName()).toBe('');
  });

  it('returns a structured error instead of throwing on malformed JSON', () => {
    const input = new AvroSchemaInput();
    input.setSchema('{not json');
    const result = parseSchema(ctx, input);
    expect(result.getValid()).toBe(false);
    expect(result.getErrorsList().length).toBeGreaterThan(0);
    expect(result.getErrorsList()[0].getMessage()).toMatch(/invalid JSON/i);
  });

  it('returns a structured error for a schema avsc rejects as invalid Avro', () => {
    const input = new AvroSchemaInput();
    input.setSchema(JSON.stringify({ type: 'record', name: 'Bad', fields: [{ name: 'x', type: 'not-a-real-type' }] }));
    const result = parseSchema(ctx, input);
    expect(result.getValid()).toBe(false);
    expect(result.getErrorsList().length).toBeGreaterThan(0);
  });
});
