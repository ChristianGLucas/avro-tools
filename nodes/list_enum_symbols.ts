import { AvroSchemaInput, EnumSymbolsResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseAndValidate, mkError } from './avro_helpers';

/**
 * List the symbols of an Avro enum schema, in declaration order, plus its
 * optional Avro 1.9+ default symbol (used when resolving an unrecognized
 * symbol during schema evolution). A structured error if the schema is not
 * an enum or is malformed.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listEnumSymbols(ax: AxiomContext, input: AvroSchemaInput): EnumSymbolsResult {
  const result = new EnumSymbolsResult();
  const { parsed, error } = parseAndValidate(input.getSchema());
  if (error || !parsed) {
    result.setValid(false);
    if (error) result.setErrorsList([error]);
    return result;
  }
  const { raw, type } = parsed;
  if (type.typeName !== 'enum' || !raw || typeof raw !== 'object' || Array.isArray(raw)) {
    result.setValid(false);
    result.setErrorsList([mkError(`schema is not an enum (top-level type is "${type.typeName}")`)]);
    return result;
  }
  const rec = raw as Record<string, unknown>;
  const symbols = Array.isArray(rec.symbols) ? rec.symbols.filter((s): s is string => typeof s === 'string') : [];
  result.setValid(true);
  result.setSymbolsList(symbols);
  if (typeof rec.default === 'string') {
    result.setHasDefault(true);
    result.setDefaultSymbol(rec.default);
  }
  return result;
}
