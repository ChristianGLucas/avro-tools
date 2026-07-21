import { EncodeInput, EncodeResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseAndValidate, mkError, MAX_DATUM_JSON_BYTES, MAX_BINARY_BYTES } from './avro_helpers';

/**
 * Encode a JSON-represented datum to Avro binary using a caller-supplied
 * schema. `datum_json` must use the Avro specification's own JSON Datum
 * Encoding (e.g. bytes/fixed values are a JSON string whose code points
 * 0-255 are the raw byte values — the same convention the `avro-tools`
 * CLI's `fromjson` uses, delegated here to avsc's `fromString`/`toBuffer`).
 * Input datum JSON and output binary are both size-bounded well under the
 * platform's transport limit. A structured error if the schema is
 * malformed, the datum JSON is malformed, or the datum does not conform to
 * the schema.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function encodeToBinary(ax: AxiomContext, input: EncodeInput): EncodeResult {
  const result = new EncodeResult();
  const { parsed, error } = parseAndValidate(input.getSchema());
  if (error || !parsed) {
    result.setValid(false);
    if (error) result.setErrorsList([error]);
    return result;
  }

  const datumJson = input.getDatumJson();
  if (typeof datumJson !== 'string' || datumJson.length === 0) {
    result.setValid(false);
    result.setErrorsList([mkError('datum_json must be a non-empty string')]);
    return result;
  }
  if (Buffer.byteLength(datumJson, 'utf8') > MAX_DATUM_JSON_BYTES) {
    result.setValid(false);
    result.setErrorsList([mkError(`datum_json exceeds the maximum allowed size of ${MAX_DATUM_JSON_BYTES} bytes`)]);
    return result;
  }

  let binary: Buffer;
  try {
    const value = parsed.type.fromString(datumJson);
    binary = parsed.type.toBuffer(value);
  } catch (err) {
    result.setValid(false);
    result.setErrorsList([mkError((err as Error).message || String(err))]);
    return result;
  }

  if (binary.length > MAX_BINARY_BYTES) {
    result.setValid(false);
    result.setErrorsList([mkError(`encoded binary (${binary.length} bytes) exceeds the maximum allowed size of ${MAX_BINARY_BYTES} bytes`)]);
    return result;
  }

  result.setValid(true);
  result.setBinary(binary);
  return result;
}
