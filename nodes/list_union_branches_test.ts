import { AvroSchemaInput } from '../gen/messages_pb';
import { listUnionBranches } from './list_union_branches';
import { makeTestContext, NESTED_UNION_SCHEMA } from './test_helpers';

const ctx = makeTestContext();

describe('ListUnionBranches', () => {
  it('lists every branch in declaration order with its kind', () => {
    const input = new AvroSchemaInput();
    input.setSchema(NESTED_UNION_SCHEMA);
    const result = listUnionBranches(ctx, input);
    expect(result.getValid()).toBe(true);
    const branches = result.getBranchesList();
    expect(branches).toHaveLength(3);
    expect(branches[0].getBranchType()).toBe('null');
    expect(branches[1].getBranchType()).toBe('string');
    expect(branches[2].getBranchType()).toBe('record');
    expect(branches[2].getFullName()).toBe('com.example.Inner');
    expect(JSON.parse(branches[2].getTypeJson())).toMatchObject({ type: 'record', name: 'Inner' });
  });

  it('resolves a bare-name-reference branch back to its named type kind', () => {
    // A union branch may reference a named type defined elsewhere in the
    // same schema (here, nested inside the first branch's own field) —
    // referencing a *sibling* union branch's own name would be an invalid
    // duplicate, so the definition has to live one level deeper.
    const input = new AvroSchemaInput();
    input.setSchema(
      JSON.stringify([
        { type: 'record', name: 'Wrapper', fields: [{ name: 'c', type: { type: 'enum', name: 'Color', symbols: ['RED', 'GREEN'] } }] },
        'Color',
      ]),
    );
    const result = listUnionBranches(ctx, input);
    expect(result.getValid()).toBe(true);
    const branches = result.getBranchesList();
    expect(branches[1].getTypeJson()).toBe('"Color"');
    expect(branches[1].getBranchType()).toBe('enum');
    expect(branches[1].getFullName()).toBe('Color');
  });

  it('reports each branch\'s own full name when two branches share an unqualified name in different namespaces (regression)', () => {
    // Found by adversarial review: computing a branch's full name by
    // searching the registry for any key ending in ".Address" always
    // returned the FIRST match, so both branches were wrongly reported as
    // the same full name. The fix resolves each branch's own name/
    // namespace directly instead of searching.
    const input = new AvroSchemaInput();
    input.setSchema(
      JSON.stringify([
        { type: 'record', name: 'Address', namespace: 'billing', fields: [{ name: 'city', type: 'string' }] },
        { type: 'record', name: 'Address', namespace: 'shipping', fields: [{ name: 'city', type: 'string' }] },
      ]),
    );
    const result = listUnionBranches(ctx, input);
    expect(result.getValid()).toBe(true);
    const branches = result.getBranchesList();
    expect(branches[0].getFullName()).toBe('billing.Address');
    expect(branches[1].getFullName()).toBe('shipping.Address');
  });

  it('returns a structured error when the schema is not a union', () => {
    const input = new AvroSchemaInput();
    input.setSchema('"string"');
    const result = listUnionBranches(ctx, input);
    expect(result.getValid()).toBe(false);
    expect(result.getErrorsList()[0].getMessage()).toMatch(/not a union/i);
  });
});
