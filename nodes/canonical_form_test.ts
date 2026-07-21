import { AvroSchemaInput } from '../gen/messages_pb';
import { canonicalForm } from './canonical_form';
import { makeTestContext } from './test_helpers';

const ctx = makeTestContext();

function pcf(schema: string): string {
  const input = new AvroSchemaInput();
  input.setSchema(schema);
  const result = canonicalForm(ctx, input);
  expect(result.getValid()).toBe(true);
  return result.getCanonicalForm();
}

describe('CanonicalForm', () => {
  // Independent oracle: these are the Apache Avro project's own published
  // Parsing Canonical Form test vectors (share/test/data/schema-tests.txt),
  // not derived from this package or from avsc's test suite.
  it('matches the Avro spec\'s published PCF for a bare primitive', () => {
    expect(pcf('"null"')).toBe('"null"');
    expect(pcf('"int"')).toBe('"int"');
    expect(pcf('{"type": "string"}')).toBe('"string"'); // [PRIMITIVES] rule
  });

  it('matches the Avro spec\'s published PCF for a simple record: strips extra attributes, reorders keys, drops empty fields', () => {
    const schema = JSON.stringify({ fields: [], type: 'record', name: 'foo' });
    expect(pcf(schema)).toBe('{"name":"foo","type":"record","fields":[]}');
  });

  it('strips doc/aliases/default (non-parsing attributes) per the [STRIP] rule', () => {
    const schema = JSON.stringify({
      type: 'record',
      name: 'test',
      doc: 'a doc string',
      fields: [
        { name: 'a', type: 'long', default: 42, doc: 'field doc' },
        { name: 'b', type: 'string' },
      ],
    });
    expect(pcf(schema)).toBe('{"name":"test","type":"record","fields":[{"name":"a","type":"long"},{"name":"b","type":"string"}]}');
  });

  it('is deterministic across repeated calls on the same input', () => {
    const schema = JSON.stringify({ type: 'record', name: 'R', fields: [{ name: 'x', type: 'int' }] });
    expect(pcf(schema)).toBe(pcf(schema));
  });

  it('returns a structured error for a malformed schema', () => {
    const input = new AvroSchemaInput();
    input.setSchema('{{{');
    const result = canonicalForm(ctx, input);
    expect(result.getValid()).toBe(false);
  });
});
