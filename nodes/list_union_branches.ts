import { AvroSchemaInput, UnionBranchesResult, UnionBranch } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseAndValidate, mkError, isPrimitiveName, ownNamespace, resolveFullName, normalizeTypeName } from './avro_helpers';

/**
 * List the branches of an Avro union schema, in declaration order: each
 * branch's re-serialized type JSON, its kind (record/enum/array/map/
 * fixed/primitive), and its full name when the branch is a named type. A
 * structured error if the schema is not a union or is malformed.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listUnionBranches(ax: AxiomContext, input: AvroSchemaInput): UnionBranchesResult {
  const result = new UnionBranchesResult();
  const { parsed, error } = parseAndValidate(input.getSchema());
  if (error || !parsed) {
    result.setValid(false);
    if (error) result.setErrorsList([error]);
    return result;
  }
  const { raw, type, registry } = parsed;
  if (type.typeName.indexOf('union') !== 0 || !Array.isArray(raw)) {
    result.setValid(false);
    result.setErrorsList([mkError(`schema is not a union (top-level type is "${normalizeTypeName(type.typeName)}")`)]);
    return result;
  }

  const branches: UnionBranch[] = raw.map((branch) => {
    const ub = new UnionBranch();
    ub.setTypeJson(JSON.stringify(branch));
    if (typeof branch === 'string') {
      if (isPrimitiveName(branch)) {
        ub.setBranchType(branch);
      } else {
        const resolved = registry[branch];
        ub.setBranchType(resolved ? resolved.typeName : 'reference');
        ub.setFullName(branch);
      }
    } else if (branch && typeof branch === 'object' && !Array.isArray(branch)) {
      const rec = branch as Record<string, unknown>;
      const kind = typeof rec.type === 'string' ? rec.type : 'unknown';
      ub.setBranchType(kind);
      if ((kind === 'record' || kind === 'error' || kind === 'enum' || kind === 'fixed') && typeof rec.name === 'string') {
        // Compute the branch's own full name directly (same namespace
        // resolution used everywhere else in this package), rather than
        // searching the registry by unqualified-name suffix: a suffix
        // search picks whichever entry happens to be first, which is
        // wrong whenever two branches share an unqualified name in
        // different namespaces (e.g. union<billing.Address, shipping.Address>).
        const topLevelNamespace = ''; // a union that is itself the top-level schema has no enclosing namespace
        ub.setFullName(resolveFullName(rec.name, ownNamespace(rec, topLevelNamespace)));
      }
    } else {
      ub.setBranchType('unknown');
    }
    return ub;
  });

  result.setValid(true);
  result.setBranchesList(branches);
  return result;
}
