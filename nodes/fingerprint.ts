import { FingerprintInput, FingerprintResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseAndValidate, mkError } from './avro_helpers';
import { crc64AvroFingerprintHex } from './crc64_avro';

/**
 * Compute a schema's fingerprint over its Parsing Canonical Form — the
 * identifier most Avro schema registries use as the schema ID. Supports
 * "crc64-avro" (the Avro spec's 64-bit Rabin fingerprint, the default;
 * implemented directly per the spec's published algorithm and verified
 * against the spec's own published test vectors, since avsc does not
 * implement it), "md5", and "sha256" (both delegated to avsc, which
 * computes them over the same PCF). A structured error if the schema is
 * malformed or the algorithm name is unrecognized.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function fingerprint(ax: AxiomContext, input: FingerprintInput): FingerprintResult {
  const result = new FingerprintResult();
  const { parsed, error } = parseAndValidate(input.getSchema());
  if (error || !parsed) {
    result.setValid(false);
    if (error) result.setErrorsList([error]);
    return result;
  }

  const algorithm = (input.getAlgorithm() || 'crc64-avro').toLowerCase();
  const canonicalForm = JSON.stringify(parsed.type.schema());

  let hex: string;
  if (algorithm === 'crc64-avro') {
    hex = crc64AvroFingerprintHex(Buffer.from(canonicalForm, 'utf8'));
  } else if (algorithm === 'md5' || algorithm === 'sha256') {
    try {
      hex = parsed.type.fingerprint(algorithm).toString('hex');
    } catch (err) {
      result.setValid(false);
      result.setErrorsList([mkError((err as Error).message || String(err))]);
      return result;
    }
  } else {
    result.setValid(false);
    result.setErrorsList([mkError(`unsupported algorithm "${input.getAlgorithm()}" — use "crc64-avro", "md5", or "sha256"`)]);
    return result;
  }

  result.setValid(true);
  result.setAlgorithm(algorithm);
  result.setFingerprintHex(hex);
  result.setCanonicalForm(canonicalForm);
  return result;
}
