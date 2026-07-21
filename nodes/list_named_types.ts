import { AvroSchemaInput, ListNamedTypesResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseAndValidate, collectNamedTypes } from './avro_helpers';

/**
 * List every named type (record, enum, fixed) declared anywhere in a
 * schema tree — including types nested inside record fields, array items,
 * map values, and union branches — deduplicated by full name. A structured
 * error if the schema is malformed.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listNamedTypes(ax: AxiomContext, input: AvroSchemaInput): ListNamedTypesResult {
  const result = new ListNamedTypesResult();
  const { parsed, error } = parseAndValidate(input.getSchema());
  if (error || !parsed) {
    result.setValid(false);
    if (error) result.setErrorsList([error]);
    return result;
  }
  result.setValid(true);
  result.setTypesList(collectNamedTypes(parsed.raw));
  return result;
}
