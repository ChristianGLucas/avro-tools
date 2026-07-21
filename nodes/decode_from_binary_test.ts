import { DecodeInput } from '../gen/messages_pb';
import { decodeFromBinary } from './decode_from_binary';
import { makeTestContext } from './test_helpers';

const ctx = makeTestContext();

function decode(schema: string, hex: string) {
  const input = new DecodeInput();
  input.setSchema(schema);
  input.setBinary(Buffer.from(hex, 'hex'));
  return decodeFromBinary(ctx, input);
}

describe('DecodeFromBinary', () => {
  // Independent oracle: the same hand-specifiable zigzag-varint byte
  // sequences used in encode_to_binary_test.ts, decoded in the reverse
  // direction — not a round-trip through this package's own encoder.
  it('decodes a zigzag-varint-encoded int', () => {
    expect(decode('"int"', '02').getDatumJson()).toBe('1');
    expect(decode('"int"', '00').getDatumJson()).toBe('0');
    expect(decode('"int"', '01').getDatumJson()).toBe('-1');
  });

  it('decodes a length-prefixed UTF-8 string', () => {
    const result = decode('"string"', '046869');
    expect(result.getValid()).toBe(true);
    expect(result.getDatumJson()).toBe('"hi"');
  });

  it('decodes a record datum', () => {
    const schema = JSON.stringify({ type: 'record', name: 'R', fields: [{ name: 'a', type: 'int' }, { name: 'b', type: 'string' }] });
    const result = decode(schema, '02046869');
    expect(result.getValid()).toBe(true);
    expect(JSON.parse(result.getDatumJson())).toEqual({ a: 1, b: 'hi' });
  });

  it('decodes a schema with a logical type annotation (bytes underlying)', () => {
    const schema = JSON.stringify({ type: 'record', name: 'R', fields: [{ name: 'amount', type: { type: 'bytes', logicalType: 'decimal', precision: 4, scale: 2 } }] });
    const result = decode(schema, '0800010203');
    expect(result.getValid()).toBe(true);
    // Avro's JSON Datum Encoding represents bytes as a string whose code
    // points 0-255 are the raw byte values.
    expect(JSON.parse(result.getDatumJson()).amount).toBe(String.fromCharCode(0, 1, 2, 3));
  });

  it('returns a structured error for a truncated buffer', () => {
    // Length prefix zigzag-varint 0x08 declares a 4-byte payload, but only
    // 2 bytes ("hi") follow — a truncated buffer.
    const result = decode('"string"', '086869');
    expect(result.getValid()).toBe(false);
    expect(result.getErrorsList().length).toBeGreaterThan(0);
  });

  it('returns a structured error for an empty binary payload', () => {
    const input = new DecodeInput();
    input.setSchema('"int"');
    input.setBinary(new Uint8Array());
    const result = decodeFromBinary(ctx, input);
    expect(result.getValid()).toBe(false);
    expect(result.getErrorsList()[0].getMessage()).toMatch(/non-empty/i);
  });

  it('returns a structured error for a malformed schema', () => {
    const result = decode('{{', '02');
    expect(result.getValid()).toBe(false);
  });
});
