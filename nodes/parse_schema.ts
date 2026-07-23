import { AvroSchemaInput, ParseSchemaResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseAndValidate, ownNamespace, resolveFullName, isPrimitiveName, normalizeTypeName } from './avro_helpers';

/**
 * Parse an Avro .avsc JSON schema into a structured, normalized
 * representation: top-level type kind, name/namespace/full-name, doc, and
 * aliases, plus the full re-serialized structural form. A malformed schema
 * (bad JSON, or a schema avsc rejects as invalid Avro) returns valid=false
 * with a structured error instead of throwing.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseSchema(ax: AxiomContext, input: AvroSchemaInput): ParseSchemaResult {
  const result = new ParseSchemaResult();
  const { parsed, error } = parseAndValidate(input.getSchema());
  if (error || !parsed) {
    result.setValid(false);
    if (error) result.setErrorsList([error]);
    return result;
  }

  const { raw, type } = parsed;
  result.setValid(true);
  result.setSchemaType(normalizeTypeName(type.typeName));
  result.setNormalizedJson(JSON.stringify(type.schema({ exportAttrs: true })));

  const isNamed = type.typeName === 'record' || type.typeName === 'enum' || type.typeName === 'fixed';
  if (isNamed && raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const rec = raw as Record<string, unknown>;
    const name = typeof rec.name === 'string' ? rec.name : '';
    const namespace = ownNamespace(rec, '');
    result.setName(name.indexOf('.') >= 0 ? name.slice(name.lastIndexOf('.') + 1) : name);
    result.setNamespace(namespace);
    result.setFullName(name ? resolveFullName(name, namespace) : '');
    if (typeof rec.doc === 'string') result.setDoc(rec.doc);
    if (Array.isArray(rec.aliases)) {
      result.setAliasesList(rec.aliases.filter((a): a is string => typeof a === 'string'));
    }
  } else if (!isNamed && typeof raw === 'string' && !isPrimitiveName(raw)) {
    // A bare reference to an already-declared named type used as the whole schema.
    result.setFullName(raw);
  }

  return result;
}
