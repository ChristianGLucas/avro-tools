import { AvroSchemaInput } from '../gen/messages_pb';
import { listFields } from './list_fields';
import { makeTestContext, USER_RECORD_SCHEMA } from './test_helpers';

const ctx = makeTestContext();

describe('ListFields', () => {
  it('lists every field of a record with name/type/default/doc/aliases/order', () => {
    const input = new AvroSchemaInput();
    input.setSchema(USER_RECORD_SCHEMA);
    const result = listFields(ctx, input);
    expect(result.getValid()).toBe(true);
    const fields = result.getFieldsList();
    expect(fields.map((f) => f.getName())).toEqual([
      'id', 'name', 'email', 'signupTimestamp', 'balance', 'status', 'tags', 'metadata', 'sessionKey',
    ]);

    const id = fields[0];
    expect(id.getTypeJson()).toBe('"long"');
    expect(id.getHasDefault()).toBe(false);
    expect(id.getDoc()).toBe('Primary key.');

    const email = fields[2];
    expect(email.getHasDefault()).toBe(true);
    expect(email.getDefaultJson()).toBe('null');
    expect(JSON.parse(email.getTypeJson())).toEqual(['null', 'string']);

    const tags = fields[6];
    expect(tags.getHasDefault()).toBe(true);
    expect(tags.getDefaultJson()).toBe('[]');

    const balance = fields[4];
    // logicalType must survive verbatim in type_json (avsc's own resolved
    // schema silently drops unrecognized logicalType annotations).
    expect(JSON.parse(balance.getTypeJson())).toMatchObject({ type: 'bytes', logicalType: 'decimal', precision: 9, scale: 2 });
  });

  it('returns a structured error when the schema is not a record', () => {
    const input = new AvroSchemaInput();
    input.setSchema('"string"');
    const result = listFields(ctx, input);
    expect(result.getValid()).toBe(false);
    expect(result.getErrorsList()[0].getMessage()).toMatch(/not a record/i);
  });

  it('returns a structured error for a malformed schema', () => {
    const input = new AvroSchemaInput();
    input.setSchema('{broken');
    const result = listFields(ctx, input);
    expect(result.getValid()).toBe(false);
  });
});
