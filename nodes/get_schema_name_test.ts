import { AvroSchemaInput } from '../gen/messages_pb';
import { getSchemaName } from './get_schema_name';
import { makeTestContext, USER_RECORD_SCHEMA } from './test_helpers';

const ctx = makeTestContext();

describe('GetSchemaName', () => {
  it('extracts name/namespace/full_name for a named schema', () => {
    const input = new AvroSchemaInput();
    input.setSchema(USER_RECORD_SCHEMA);
    const result = getSchemaName(ctx, input);
    expect(result.getValid()).toBe(true);
    expect(result.getIsNamed()).toBe(true);
    expect(result.getName()).toBe('User');
    expect(result.getNamespace()).toBe('com.example');
    expect(result.getFullName()).toBe('com.example.User');
  });

  it('reports is_named=false with empty names for an unnamed schema', () => {
    const input = new AvroSchemaInput();
    input.setSchema(JSON.stringify({ type: 'array', items: 'int' }));
    const result = getSchemaName(ctx, input);
    expect(result.getValid()).toBe(true);
    expect(result.getIsNamed()).toBe(false);
    expect(result.getName()).toBe('');
    expect(result.getFullName()).toBe('');
  });

  it('resolves a fullname given directly with a dot, ignoring any namespace field', () => {
    const input = new AvroSchemaInput();
    input.setSchema(JSON.stringify({ type: 'record', name: 'a.b.C', fields: [] }));
    const result = getSchemaName(ctx, input);
    expect(result.getFullName()).toBe('a.b.C');
    expect(result.getNamespace()).toBe('a.b');
    expect(result.getName()).toBe('C');
  });
});
