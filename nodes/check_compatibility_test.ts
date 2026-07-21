import { CompatibilityInput } from '../gen/messages_pb';
import { checkCompatibility } from './check_compatibility';
import { makeTestContext } from './test_helpers';

const ctx = makeTestContext();

function check(writer: string, reader: string) {
  const input = new CompatibilityInput();
  input.setWriterSchema(writer);
  input.setReaderSchema(reader);
  return checkCompatibility(ctx, input);
}

const V1 = JSON.stringify({ type: 'record', name: 'R', fields: [{ name: 'a', type: 'int' }] });
const V2_ADD_FIELD_WITH_DEFAULT = JSON.stringify({
  type: 'record',
  name: 'R',
  fields: [
    { name: 'a', type: 'int' },
    { name: 'b', type: 'string', default: 'unknown' },
  ],
});
const V2_ADD_FIELD_NO_DEFAULT = JSON.stringify({
  type: 'record',
  name: 'R',
  fields: [
    { name: 'a', type: 'int' },
    { name: 'b', type: 'string' },
  ],
});
const V2_INCOMPATIBLE_TYPE = JSON.stringify({ type: 'record', name: 'R', fields: [{ name: 'a', type: 'string' }] });

describe('CheckCompatibility', () => {
  it('is compatible when the reader adds a field with a default', () => {
    const result = check(V1, V2_ADD_FIELD_WITH_DEFAULT);
    expect(result.getCompatible()).toBe(true);
    expect(result.getErrorsList().length).toBe(0);
  });

  it('is incompatible when the reader adds a required field with no default', () => {
    const result = check(V1, V2_ADD_FIELD_NO_DEFAULT);
    expect(result.getCompatible()).toBe(false);
    expect(result.getErrorsList().length).toBeGreaterThan(0);
  });

  it('is incompatible when a field\'s type changes incompatibly', () => {
    const result = check(V1, V2_INCOMPATIBLE_TYPE);
    expect(result.getCompatible()).toBe(false);
  });

  it('is compatible with itself (identity)', () => {
    const result = check(V1, V1);
    expect(result.getCompatible()).toBe(true);
  });

  it('reports a structured, field-tagged error when the writer schema is malformed', () => {
    const result = check('{not json', V1);
    expect(result.getCompatible()).toBe(false);
    expect(result.getErrorsList()[0].getPath()).toBe('writer_schema');
  });

  it('reports a structured, field-tagged error when the reader schema is malformed', () => {
    const result = check(V1, '{not json');
    expect(result.getCompatible()).toBe(false);
    expect(result.getErrorsList()[0].getPath()).toBe('reader_schema');
  });
});
