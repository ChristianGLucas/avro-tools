import { AvroSchemaInput, UnionBranchesResult, UnionBranch } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseAndValidate, mkError, isPrimitiveName } from './avro_helpers';

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
    result.setErrorsList([mkError(`schema is not a union (top-level type is "${type.typeName}")`)]);
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
        // Look up by unqualified name too, since registry keys are fully
        // qualified: find the entry whose declared shape matches this branch.
        const candidateFull = Object.keys(registry).find(
          (k) => registry[k].typeName === (kind === 'error' ? 'record' : kind) && (k === rec.name || k.endsWith(`.${rec.name}`)),
        );
        ub.setFullName(candidateFull || (rec.name as string));
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
