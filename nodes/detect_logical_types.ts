import { AvroSchemaInput, LogicalTypesResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseAndValidate, collectLogicalTypes } from './avro_helpers';

/**
 * Find every `logicalType` annotation anywhere in a schema tree (decimal,
 * date, time-millis/micros, timestamp-millis/micros, uuid, duration, or
 * any custom logical-type name), reporting its path, underlying physical
 * Avro type, and (for decimal) precision/scale. Detects the annotation
 * structurally regardless of whether avsc recognizes it as one of its
 * built-in logical types (avsc silently discards any logicalType it has
 * not been explicitly configured to recognize, so this walks the raw
 * schema JSON directly rather than avsc's resolved type). A structured
 * error if the schema is malformed.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function detectLogicalTypes(ax: AxiomContext, input: AvroSchemaInput): LogicalTypesResult {
  const result = new LogicalTypesResult();
  const { parsed, error } = parseAndValidate(input.getSchema());
  if (error || !parsed) {
    result.setValid(false);
    if (error) result.setErrorsList([error]);
    return result;
  }
  result.setValid(true);
  result.setLogicalTypesList(collectLogicalTypes(parsed.raw));
  return result;
}
