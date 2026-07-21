import { AvroSchemaInput, ValidateSchemaResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseAndValidate } from './avro_helpers';

/**
 * Check whether a .avsc JSON schema is a well-formed Avro schema per the
 * Avro specification, by constructing an avsc Type from it. Returns
 * valid=true, or valid=false with a structured error describing what avsc
 * rejected (unknown type, duplicate field name, unresolvable named-type
 * reference, malformed default, oversized/too-deeply-nested input, etc.).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function validateSchema(ax: AxiomContext, input: AvroSchemaInput): ValidateSchemaResult {
  const result = new ValidateSchemaResult();
  const { error } = parseAndValidate(input.getSchema());
  if (error) {
    result.setValid(false);
    result.setErrorsList([error]);
    return result;
  }
  result.setValid(true);
  return result;
}
