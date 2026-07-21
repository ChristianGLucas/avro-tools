/**
 * The Avro specification's 64-bit Rabin fingerprint ("CRC-64-AVRO") — the
 * algorithm every Avro implementation (Java's SchemaNormalization, Python's
 * fastavro, etc.) uses to compute the schema-ID fingerprint most schema
 * registries key on. avsc does not implement this algorithm (it only
 * delegates to Node's `crypto.createHash`, which has no CRC-64-AVRO
 * digest), so it is implemented here directly from the specification's
 * published algorithm:
 * https://avro.apache.org/docs/1.11.1/specification/#schema-fingerprints
 *
 * Verified (see crc64_avro_test.ts) against the Apache Avro project's own
 * published test vectors (share/test/data/schema-tests.txt) — an
 * independent oracle, not merely self-consistency.
 */

const EMPTY = 0xc15d213aa4d7a795n;
const MASK64 = 0xffffffffffffffffn;

function buildFpTable(): bigint[] {
  const table: bigint[] = new Array(256);
  for (let i = 0; i < 256; i++) {
    let fp = BigInt(i);
    for (let j = 0; j < 8; j++) {
      const lsb = fp & 1n;
      const mask = lsb === 1n ? MASK64 : 0n;
      fp = (fp >> 1n) ^ (EMPTY & mask);
      fp &= MASK64;
    }
    table[i] = fp;
  }
  return table;
}

const FP_TABLE = buildFpTable();

/** Computes the unsigned 64-bit CRC-64-AVRO fingerprint of `buf` as a BigInt. */
export function crc64AvroFingerprint(buf: Buffer): bigint {
  let fp = EMPTY;
  for (let i = 0; i < buf.length; i++) {
    const idx = Number((fp ^ BigInt(buf[i])) & 0xffn);
    fp = (fp >> 8n) ^ FP_TABLE[idx];
    fp &= MASK64;
  }
  return fp;
}

/** Lowercase 16-hex-digit (zero-padded) representation of an unsigned 64-bit fingerprint. */
export function crc64AvroFingerprintHex(buf: Buffer): string {
  return crc64AvroFingerprint(buf).toString(16).padStart(16, '0');
}
