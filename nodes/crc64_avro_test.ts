import { crc64AvroFingerprint, crc64AvroFingerprintHex } from './crc64_avro';

// Independent oracle: these are the Apache Avro project's own published
// CRC-64-AVRO (Rabin) fingerprint test vectors
// (share/test/data/schema-tests.txt) — a schema's Parsing Canonical Form
// string, and the fingerprint Java's SchemaNormalization (the reference
// implementation) computes over its UTF-8 bytes, published as a signed
// 64-bit decimal. Verified independently of avsc, which does not
// implement this algorithm at all.
const VECTORS: Array<[string, string]> = [
  ['"null"', '7195948357588979594'],
  ['"string"', '-8142146995180207161'],
  ['"int"', '8247732601305521295'],
  ['{"name":"foo","type":"record","fields":[]}', '-4824392279771201922'],
];

function toSigned64(u: bigint): bigint {
  return u >= 1n << 63n ? u - (1n << 64n) : u;
}

describe('crc64AvroFingerprint', () => {
  it.each(VECTORS)('matches the Avro spec\'s published fingerprint for %s', (canonicalForm, expectedSigned) => {
    const unsigned = crc64AvroFingerprint(Buffer.from(canonicalForm, 'utf8'));
    expect(toSigned64(unsigned).toString()).toBe(expectedSigned);
  });

  it('is deterministic', () => {
    const buf = Buffer.from('"long"', 'utf8');
    expect(crc64AvroFingerprintHex(buf)).toBe(crc64AvroFingerprintHex(buf));
  });

  it('produces a zero-padded 16-hex-digit string', () => {
    // "null"'s fingerprint's top byte happens to be small enough to expose
    // padding bugs if the hex conversion drops leading zeros.
    const hex = crc64AvroFingerprintHex(Buffer.from('"null"', 'utf8'));
    expect(hex).toHaveLength(16);
    expect(hex).toBe('63dd24e7cc258f8a');
  });
});
