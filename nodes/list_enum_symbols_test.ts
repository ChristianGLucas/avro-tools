import { AvroSchemaInput } from '../gen/messages_pb';
import { listEnumSymbols } from './list_enum_symbols';
import { makeTestContext, COLOR_ENUM_SCHEMA } from './test_helpers';

const ctx = makeTestContext();

describe('ListEnumSymbols', () => {
  it('lists symbols in declaration order plus the default symbol', () => {
    const input = new AvroSchemaInput();
    input.setSchema(COLOR_ENUM_SCHEMA);
    const result = listEnumSymbols(ctx, input);
    expect(result.getValid()).toBe(true);
    expect(result.getSymbolsList()).toEqual(['RED', 'GREEN', 'BLUE']);
    expect(result.getHasDefault()).toBe(true);
    expect(result.getDefaultSymbol()).toBe('RED');
  });

  it('reports has_default=false when no default is declared', () => {
    const input = new AvroSchemaInput();
    input.setSchema(JSON.stringify({ type: 'enum', name: 'E', symbols: ['A', 'B'] }));
    const result = listEnumSymbols(ctx, input);
    expect(result.getHasDefault()).toBe(false);
    expect(result.getDefaultSymbol()).toBe('');
  });

  it('returns a structured error when the schema is not an enum', () => {
    const input = new AvroSchemaInput();
    input.setSchema('"int"');
    const result = listEnumSymbols(ctx, input);
    expect(result.getValid()).toBe(false);
    expect(result.getErrorsList()[0].getMessage()).toMatch(/not an enum/i);
  });
});
