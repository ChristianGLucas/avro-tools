import { AvroSchemaInput, SchemaNameResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseAndValidate, ownNamespace, resolveFullName } from './avro_helpers';

/**
 * Extract the unqualified name, namespace, and fully-qualified name
 * ("namespace.name") of a named Avro schema (record, enum, or fixed).
 * is_named=false with empty name fields for unnamed schemas (array, map,
 * union, primitive). A structured error if the schema is malformed.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getSchemaName(ax: AxiomContext, input: AvroSchemaInput): SchemaNameResult {
  const result = new SchemaNameResult();
  const { parsed, error } = parseAndValidate(input.getSchema());
  if (error || !parsed) {
    result.setValid(false);
    if (error) result.setErrorsList([error]);
    return result;
  }
  const { raw, type } = parsed;
  result.setValid(true);
  const isNamed = type.typeName === 'record' || type.typeName === 'enum' || type.typeName === 'fixed';
  result.setIsNamed(isNamed);
  if (isNamed && raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const rec = raw as Record<string, unknown>;
    const name = typeof rec.name === 'string' ? rec.name : '';
    const namespace = ownNamespace(rec, '');
    result.setName(name.indexOf('.') >= 0 ? name.slice(name.lastIndexOf('.') + 1) : name);
    result.setNamespace(namespace);
    result.setFullName(name ? resolveFullName(name, namespace) : '');
  }
  return result;
}
