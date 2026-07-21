import { CompatibilityInput, CompatibilityResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseAndValidate, mkError } from './avro_helpers';

/**
 * Check Avro schema-evolution compatibility: can data written with
 * `writer_schema` be correctly read back using `reader_schema`? Uses
 * avsc's resolver (`readerType.createResolver(writerType)`), the same
 * resolution logic avsc uses to actually decode writer-encoded bytes under
 * a reader schema. Returns compatible=true, or compatible=false with
 * structured errors (a malformed writer/reader schema, or a concrete
 * incompatibility avsc's resolver rejected).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function checkCompatibility(ax: AxiomContext, input: CompatibilityInput): CompatibilityResult {
  const result = new CompatibilityResult();

  const writer = parseAndValidate(input.getWriterSchema());
  const reader = parseAndValidate(input.getReaderSchema());
  const errors = [];
  if (writer.error) errors.push(mkError(`writer_schema: ${writer.error.getMessage()}`, 'writer_schema'));
  if (reader.error) errors.push(mkError(`reader_schema: ${reader.error.getMessage()}`, 'reader_schema'));
  if (errors.length > 0 || !writer.parsed || !reader.parsed) {
    result.setCompatible(false);
    result.setErrorsList(errors);
    return result;
  }

  try {
    reader.parsed.type.createResolver(writer.parsed.type);
  } catch (err) {
    result.setCompatible(false);
    result.setErrorsList([mkError((err as Error).message || String(err))]);
    return result;
  }

  result.setCompatible(true);
  return result;
}
