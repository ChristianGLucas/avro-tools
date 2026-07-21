import { AvroSchemaInput } from '../gen/messages_pb';
import { validateSchema } from './validate_schema';
import { makeTestContext, USER_RECORD_SCHEMA } from './test_helpers';

const ctx = makeTestContext();

describe('ValidateSchema', () => {
  it('accepts a well-formed schema', () => {
    const input = new AvroSchemaInput();
    input.setSchema(USER_RECORD_SCHEMA);
    const result = validateSchema(ctx, input);
    expect(result.getValid()).toBe(true);
    expect(result.getErrorsList().length).toBe(0);
  });

  it('rejects a schema with an unresolvable type reference', () => {
    const input = new AvroSchemaInput();
    input.setSchema(JSON.stringify({ type: 'record', name: 'Bad', fields: [{ name: 'x', type: 'no.such.Type' }] }));
    const result = validateSchema(ctx, input);
    expect(result.getValid()).toBe(false);
    expect(result.getErrorsList().length).toBe(1);
  });

  it('rejects a duplicate field name', () => {
    const input = new AvroSchemaInput();
    input.setSchema(
      JSON.stringify({
        type: 'record',
        name: 'Dup',
        fields: [
          { name: 'x', type: 'int' },
          { name: 'x', type: 'string' },
        ],
      }),
    );
    const result = validateSchema(ctx, input);
    expect(result.getValid()).toBe(false);
  });

  it('rejects malformed JSON without throwing', () => {
    const input = new AvroSchemaInput();
    input.setSchema('{"type": "record", ');
    expect(() => validateSchema(ctx, input)).not.toThrow();
    const result = validateSchema(ctx, input);
    expect(result.getValid()).toBe(false);
  });
});
