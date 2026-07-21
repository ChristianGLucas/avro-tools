import { AvroSchemaInput, ExtractDocsResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseAndValidate, collectDocs } from './avro_helpers';

/**
 * Collect every non-empty `doc` string found anywhere in a schema tree —
 * the schema root, every named type (record/enum/fixed), and every record
 * field — each tagged with its path in the tree. A structured error if the
 * schema is malformed.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractDocs(ax: AxiomContext, input: AvroSchemaInput): ExtractDocsResult {
  const result = new ExtractDocsResult();
  const { parsed, error } = parseAndValidate(input.getSchema());
  if (error || !parsed) {
    result.setValid(false);
    if (error) result.setErrorsList([error]);
    return result;
  }
  result.setValid(true);
  result.setDocsList(collectDocs(parsed.raw));
  return result;
}
