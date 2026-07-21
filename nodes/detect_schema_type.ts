import { AvroSchemaInput, SchemaTypeResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseAndValidate } from './avro_helpers';

/**
 * Detect the top-level kind of a valid Avro schema — record, enum, array,
 * map, union, fixed, or a primitive type name (null, boolean, int, long,
 * float, double, bytes, string) — plus is_named / is_primitive / is_union
 * convenience flags. A structured error if the schema itself is malformed.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function detectSchemaType(ax: AxiomContext, input: AvroSchemaInput): SchemaTypeResult {
  const result = new SchemaTypeResult();
  const { parsed, error } = parseAndValidate(input.getSchema());
  if (error || !parsed) {
    result.setValid(false);
    if (error) result.setErrorsList([error]);
    return result;
  }
  const { type } = parsed;
  const kind = type.typeName; // e.g. "record", "enum", "array", "map", "fixed", "union:wrapped", "union:unwrapped", "int", "string", ...
  const isUnion = kind.indexOf('union') === 0;
  const isNamed = kind === 'record' || kind === 'enum' || kind === 'fixed';
  const isPrimitive = !isUnion && kind !== 'record' && kind !== 'enum' && kind !== 'fixed' && kind !== 'array' && kind !== 'map';

  result.setValid(true);
  result.setSchemaType(isUnion ? 'union' : kind);
  result.setIsNamed(isNamed);
  result.setIsPrimitive(isPrimitive);
  result.setIsUnion(isUnion);
  return result;
}
