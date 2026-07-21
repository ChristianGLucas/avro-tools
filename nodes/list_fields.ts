import { AvroSchemaInput, ListFieldsResult, AvroField } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseAndValidate, mkError } from './avro_helpers';

/**
 * List every field of a record schema, in declaration order: name, type
 * (re-serialized as JSON exactly as declared, so logicalType annotations
 * are preserved), default value (if any), doc, aliases, and sort order. A
 * structured error if the schema is not a record or is otherwise
 * malformed.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listFields(ax: AxiomContext, input: AvroSchemaInput): ListFieldsResult {
  const result = new ListFieldsResult();
  const { parsed, error } = parseAndValidate(input.getSchema());
  if (error || !parsed) {
    result.setValid(false);
    if (error) result.setErrorsList([error]);
    return result;
  }
  const { raw, type } = parsed;
  if (type.typeName !== 'record' || !raw || typeof raw !== 'object' || Array.isArray(raw)) {
    result.setValid(false);
    result.setErrorsList([mkError(`schema is not a record (top-level type is "${type.typeName}")`)]);
    return result;
  }
  const rec = raw as Record<string, unknown>;
  const fields = rec.fields;
  if (!Array.isArray(fields)) {
    result.setValid(false);
    result.setErrorsList([mkError('record schema has no "fields" array')]);
    return result;
  }

  const out: AvroField[] = fields.map((f) => {
    const field = (f && typeof f === 'object' ? f : {}) as Record<string, unknown>;
    const af = new AvroField();
    af.setName(typeof field.name === 'string' ? field.name : '');
    af.setTypeJson(JSON.stringify(field.type));
    const hasDefault = Object.prototype.hasOwnProperty.call(field, 'default');
    af.setHasDefault(hasDefault);
    af.setDefaultJson(hasDefault ? JSON.stringify(field.default) : '');
    af.setDoc(typeof field.doc === 'string' ? field.doc : '');
    if (Array.isArray(field.aliases)) {
      af.setAliasesList(field.aliases.filter((a): a is string => typeof a === 'string'));
    }
    af.setOrder(typeof field.order === 'string' ? field.order : '');
    return af;
  });

  result.setValid(true);
  result.setFieldsList(out);
  return result;
}
