import { FingerprintInput } from '../gen/messages_pb';
import { fingerprint } from './fingerprint';
import { makeTestContext } from './test_helpers';

const ctx = makeTestContext();

function fp(schema: string, algorithm?: string) {
  const input = new FingerprintInput();
  input.setSchema(schema);
  if (algorithm) input.setAlgorithm(algorithm);
  return fingerprint(ctx, input);
}

describe('Fingerprint', () => {
  // Independent oracle: the Apache Avro project's own published
  // CRC-64-AVRO (Rabin) fingerprint test vectors
  // (share/test/data/schema-tests.txt) as unsigned 64-bit hex — each is the
  // published signed decimal value converted to its two's-complement
  // unsigned hex form (e.g. "null" -> 7195948357588979594 -> 63dd24e7cc258f8a):
  //   "null"   -> 7195948357588979594  -> 63dd24e7cc258f8a
  //   "string" -> -8142146995180207161 -> 8f014872634503c7
  //   "int"    -> 8247732601305521295  -> 7275d51a3f395c8f
  it('computes the default crc64-avro fingerprint matching the Avro spec\'s published test vectors', () => {
    expect(fp('"null"').getFingerprintHex()).toBe('63dd24e7cc258f8a');
    expect(fp('"string"').getFingerprintHex()).toBe('8f014872634503c7');
    expect(fp('"int"').getFingerprintHex()).toBe('7275d51a3f395c8f');
  });

  it('defaults the algorithm field to crc64-avro', () => {
    const withDefault = fp('"int"');
    const explicit = fp('"int"', 'crc64-avro');
    expect(withDefault.getAlgorithm()).toBe('crc64-avro');
    expect(withDefault.getFingerprintHex()).toBe(explicit.getFingerprintHex());
  });

  // Independent oracle: avsc's md5 output for "int" is cross-checked here
  // against the Avro spec's own published MD5 test vector for that schema.
  it('computes md5 matching the Avro spec\'s published test vector', () => {
    const result = fp('"int"', 'md5');
    expect(result.getValid()).toBe(true);
    expect(result.getFingerprintHex()).toBe('ef524ea1b91e73173d938ade36c1db32');
  });

  it('computes sha256 as a 32-byte (64 hex char) digest', () => {
    const result = fp('"int"', 'sha256');
    expect(result.getValid()).toBe(true);
    expect(result.getFingerprintHex()).toHaveLength(64);
  });

  it('is deterministic: invoking twice on the same schema yields the same fingerprint', () => {
    const a = fp('"long"');
    const b = fp('"long"');
    expect(a.getFingerprintHex()).toBe(b.getFingerprintHex());
  });

  it('different schemas produce different fingerprints', () => {
    expect(fp('"int"').getFingerprintHex()).not.toBe(fp('"long"').getFingerprintHex());
  });

  it('returns a structured error for an unsupported algorithm', () => {
    const result = fp('"int"', 'sha1-turbo');
    expect(result.getValid()).toBe(false);
    expect(result.getErrorsList()[0].getMessage()).toMatch(/unsupported algorithm/i);
  });

  it('returns a structured error for a malformed schema', () => {
    const result = fp('not json');
    expect(result.getValid()).toBe(false);
  });
});
