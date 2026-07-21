import { AvroSchemaInput } from '../gen/messages_pb';
import { detectSchemaType } from './detect_schema_type';
import { makeTestContext, USER_RECORD_SCHEMA } from './test_helpers';

const ctx = makeTestContext();

function detect(schema: string) {
  const input = new AvroSchemaInput();
  input.setSchema(schema);
  return detectSchemaType(ctx, input);
}

describe('DetectSchemaType', () => {
  it('detects a record', () => {
    const r = detect(USER_RECORD_SCHEMA);
    expect(r.getValid()).toBe(true);
    expect(r.getSchemaType()).toBe('record');
    expect(r.getIsNamed()).toBe(true);
    expect(r.getIsPrimitive()).toBe(false);
    expect(r.getIsUnion()).toBe(false);
  });

  it('detects an enum', () => {
    const r = detect(JSON.stringify({ type: 'enum', name: 'E', symbols: ['A', 'B'] }));
    expect(r.getSchemaType()).toBe('enum');
    expect(r.getIsNamed()).toBe(true);
  });

  it('detects an array', () => {
    const r = detect(JSON.stringify({ type: 'array', items: 'string' }));
    expect(r.getSchemaType()).toBe('array');
    expect(r.getIsNamed()).toBe(false);
    expect(r.getIsPrimitive()).toBe(false);
  });

  it('detects a map', () => {
    const r = detect(JSON.stringify({ type: 'map', values: 'int' }));
    expect(r.getSchemaType()).toBe('map');
  });

  it('detects a fixed', () => {
    const r = detect(JSON.stringify({ type: 'fixed', name: 'F16', size: 16 }));
    expect(r.getSchemaType()).toBe('fixed');
    expect(r.getIsNamed()).toBe(true);
  });

  it('detects a union', () => {
    const r = detect(JSON.stringify(['null', 'string']));
    expect(r.getSchemaType()).toBe('union');
    expect(r.getIsUnion()).toBe(true);
    expect(r.getIsNamed()).toBe(false);
  });

  it('detects a primitive', () => {
    const r = detect('"long"');
    expect(r.getSchemaType()).toBe('long');
    expect(r.getIsPrimitive()).toBe(true);
    expect(r.getIsNamed()).toBe(false);
    expect(r.getIsUnion()).toBe(false);
  });

  it('returns a structured error for a malformed schema', () => {
    const r = detect('not json at all');
    expect(r.getValid()).toBe(false);
    expect(r.getErrorsList().length).toBeGreaterThan(0);
  });
});
