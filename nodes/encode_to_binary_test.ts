import { EncodeInput } from '../gen/messages_pb';
import { encodeToBinary } from './encode_to_binary';
import { makeTestContext } from './test_helpers';

const ctx = makeTestContext();

function encode(schema: string, datumJson: string) {
  const input = new EncodeInput();
  input.setSchema(schema);
  input.setDatumJson(datumJson);
  return encodeToBinary(ctx, input);
}

describe('EncodeToBinary', () => {
  // Independent oracle: Avro's int/long encoding is a hand-specifiable
  // zigzag + variable-length integer — not derived from this package, from
  // avsc's own decoder, or from a round-trip. zigzag(1) = 2 = a single
  // varint byte 0x02.
  it('encodes an int using the spec\'s zigzag-varint encoding', () => {
    const result = encode('"int"', '1');
    expect(result.getValid()).toBe(true);
    expect(Buffer.from(result.getBinary()).toString('hex')).toBe('02');
  });

  it('encodes zero and negative ints per the spec\'s zigzag mapping', () => {
    expect(Buffer.from(encode('"int"', '0').getBinary()).toString('hex')).toBe('00');
    expect(Buffer.from(encode('"int"', '-1').getBinary()).toString('hex')).toBe('01');
  });

  it('encodes a string as a zigzag-varint length prefix followed by UTF-8 bytes', () => {
    const result = encode('"string"', '"hi"');
    expect(Buffer.from(result.getBinary()).toString('hex')).toBe('046869');
  });

  it('encodes a record datum', () => {
    const schema = JSON.stringify({ type: 'record', name: 'R', fields: [{ name: 'a', type: 'int' }, { name: 'b', type: 'string' }] });
    const result = encode(schema, JSON.stringify({ a: 1, b: 'hi' }));
    expect(result.getValid()).toBe(true);
    // Concatenation of the two independently-verified primitive encodings above.
    expect(Buffer.from(result.getBinary()).toString('hex')).toBe('02046869');
  });

  it('returns a structured error when the datum does not conform to the schema', () => {
    const result = encode('"int"', '"not an int"');
    expect(result.getValid()).toBe(false);
    expect(result.getErrorsList().length).toBeGreaterThan(0);
  });

  it('returns a structured error for malformed datum JSON', () => {
    const result = encode('"int"', 'not json');
    expect(result.getValid()).toBe(false);
  });

  it('returns a structured error for a malformed schema', () => {
    const result = encode('{{', '1');
    expect(result.getValid()).toBe(false);
  });
});
