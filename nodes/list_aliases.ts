import { AvroSchemaInput, ListAliasesResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseAndValidate, collectAliases } from './avro_helpers';

/**
 * Collect every non-empty `aliases` declaration found anywhere in a schema
 * tree — named types and record fields can each declare aliases for
 * schema-evolution renames — each tagged with its path in the tree. A
 * structured error if the schema is malformed.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listAliases(ax: AxiomContext, input: AvroSchemaInput): ListAliasesResult {
  const result = new ListAliasesResult();
  const { parsed, error } = parseAndValidate(input.getSchema());
  if (error || !parsed) {
    result.setValid(false);
    if (error) result.setErrorsList([error]);
    return result;
  }
  result.setValid(true);
  result.setEntriesList(collectAliases(parsed.raw));
  return result;
}
