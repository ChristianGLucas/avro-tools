import { DecodeInput, DecodeResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseAndValidate, mkError } from './avro_helpers';

/**
 * Decode Avro binary bytes back to a JSON-represented datum using a
 * caller-supplied schema. `datum_json` is produced in the Avro
 * specification's own JSON Datum Encoding (e.g. bytes/fixed values are a
 * JSON string whose code points 0-255 are the raw byte values — delegated
 * here to avsc's `fromBuffer`/`toString`). A structured error if the
 * schema is malformed or the bytes do not decode cleanly under it
 * (truncated buffer, trailing data, etc.).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function decodeFromBinary(ax: AxiomContext, input: DecodeInput): DecodeResult {
  const result = new DecodeResult();
  const { parsed, error } = parseAndValidate(input.getSchema());
  if (error || !parsed) {
    result.setValid(false);
    if (error) result.setErrorsList([error]);
    return result;
  }

  const binary = input.getBinary();
  if (!binary || binary.length === 0) {
    result.setValid(false);
    result.setErrorsList([mkError('binary must be non-empty')]);
    return result;
  }
  let datumJson: string;
  try {
    const value = parsed.type.fromBuffer(Buffer.from(binary));
    datumJson = parsed.type.toString(value);
  } catch (err) {
    result.setValid(false);
    result.setErrorsList([mkError((err as Error).message || String(err))]);
    return result;
  }

  result.setValid(true);
  result.setDatumJson(datumJson);
  return result;
}
