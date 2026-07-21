import { AvroSchemaInput } from '../gen/messages_pb';
import { detectLogicalTypes } from './detect_logical_types';
import { makeTestContext, USER_RECORD_SCHEMA } from './test_helpers';

const ctx = makeTestContext();

describe('DetectLogicalTypes', () => {
  it('detects decimal (with precision/scale) and timestamp-millis annotations', () => {
    const input = new AvroSchemaInput();
    input.setSchema(USER_RECORD_SCHEMA);
    const result = detectLogicalTypes(ctx, input);
    expect(result.getValid()).toBe(true);
    const entries = result.getLogicalTypesList();
    const byLogicalType = Object.fromEntries(entries.map((e) => [e.getLogicalType(), e]));

    expect(byLogicalType['decimal']).toBeDefined();
    expect(byLogicalType['decimal'].getUnderlyingType()).toBe('bytes');
    expect(byLogicalType['decimal'].getPrecision()).toBe(9);
    expect(byLogicalType['decimal'].getScale()).toBe(2);

    expect(byLogicalType['timestamp-millis']).toBeDefined();
    expect(byLogicalType['timestamp-millis'].getUnderlyingType()).toBe('long');
    expect(byLogicalType['timestamp-millis'].getPrecision()).toBe(0);
  });

  it('detects a logicalType even though avsc itself silently discards unrecognized ones', () => {
    // Regression guard: avsc's own resolved Type.schema({exportAttrs:true})
    // drops `logicalType`/`precision`/`scale` entirely unless a matching
    // class is registered — this node must walk the raw JSON, not avsc's
    // resolved form, to still find it.
    const schema = JSON.stringify({ type: 'record', name: 'R', fields: [{ name: 'id', type: { type: 'string', logicalType: 'uuid' } }] });
    const input = new AvroSchemaInput();
    input.setSchema(schema);
    const result = detectLogicalTypes(ctx, input);
    expect(result.getValid()).toBe(true);
    expect(result.getLogicalTypesList()).toHaveLength(1);
    expect(result.getLogicalTypesList()[0].getLogicalType()).toBe('uuid');
    expect(result.getLogicalTypesList()[0].getUnderlyingType()).toBe('string');
    expect(result.getLogicalTypesList()[0].getPath()).toBe('/fields/0');
  });

  it('returns an empty list (not an error) for a schema with no logical types', () => {
    const input = new AvroSchemaInput();
    input.setSchema(JSON.stringify({ type: 'record', name: 'Plain', fields: [{ name: 'x', type: 'int' }] }));
    const result = detectLogicalTypes(ctx, input);
    expect(result.getValid()).toBe(true);
    expect(result.getLogicalTypesList()).toEqual([]);
  });

  it('returns a structured error for a malformed schema', () => {
    const input = new AvroSchemaInput();
    input.setSchema('{{');
    const result = detectLogicalTypes(ctx, input);
    expect(result.getValid()).toBe(false);
  });
});
