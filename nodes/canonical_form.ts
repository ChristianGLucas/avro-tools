import { AvroSchemaInput, CanonicalFormResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseAndValidate } from './avro_helpers';

/**
 * Compute the Avro specification's Parsing Canonical Form (PCF) of a
 * schema — the normalized, whitespace-free, fully-qualified, attribute-
 * stripped string form the spec defines as the basis for schema
 * fingerprinting and canonical-equality checks (avsc's default
 * `type.schema()` — verified in canonical_form_test.ts to match the Avro
 * project's own published PCF test vectors, not merely self-consistency).
 * A structured error if the schema is malformed.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function canonicalForm(ax: AxiomContext, input: AvroSchemaInput): CanonicalFormResult {
  const result = new CanonicalFormResult();
  const { parsed, error } = parseAndValidate(input.getSchema());
  if (error || !parsed) {
    result.setValid(false);
    if (error) result.setErrorsList([error]);
    return result;
  }
  result.setValid(true);
  result.setCanonicalForm(JSON.stringify(parsed.type.schema()));
  return result;
}
