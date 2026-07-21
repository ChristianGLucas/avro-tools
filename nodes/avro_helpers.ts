import * as avro from 'avsc';
import { AvroError, NamedType, DocEntry, AliasEntry, LogicalTypeEntry } from '../gen/messages_pb';

// ---- Input-surface safety bounds (see the security lenses in the
// axiom-package-authoring / axiom-marketplace-seeding skills: every
// dimension the caller influences gets an explicit, tested upper bound
// checked on the RAW input before we allocate, parse, or recurse). ----

/** Raw .avsc schema text: bounded well below anything that would make
 * JSON.parse or avsc's own schema construction expensive. */
export const MAX_SCHEMA_BYTES = 1_000_000; // 1 MB
/** Recursion/nesting depth bound for both our own JSON walk and the
 * upfront depth pre-check — stops a maliciously deep schema from blowing
 * the stack before we ever touch it. */
export const MAX_DEPTH = 64;
/** JSON-encoded datum bound for EncodeToBinary. */
export const MAX_DATUM_JSON_BYTES = 1_000_000; // 1 MB
/** Avro-binary payload bound for both EncodeToBinary's output and
 * DecodeFromBinary's input — kept safely under Axiom's ~4 MiB node
 * transport cap. */
export const MAX_BINARY_BYTES = 3 * 1024 * 1024; // 3 MiB

const PRIMITIVE_TYPES = new Set([
  'null', 'boolean', 'int', 'long', 'float', 'double', 'bytes', 'string',
]);

export function isPrimitiveName(name: string): boolean {
  return PRIMITIVE_TYPES.has(name);
}

/** Normalizes avsc's internal `typeName` spelling (which distinguishes
 * "union:wrapped" / "union:unwrapped" as an implementation detail of how
 * avsc represents a resolved union value) down to the single "union" kind
 * this package documents and exposes everywhere a schema kind is reported
 * — including in error text, so a caller never sees avsc's internal
 * spelling leak through. */
export function normalizeTypeName(typeName: string): string {
  return typeName.indexOf('union') === 0 ? 'union' : typeName;
}

export function mkError(message: string, path = ''): AvroError {
  const e = new AvroError();
  e.setMessage(message);
  e.setPath(path);
  return e;
}

/** Depth of an arbitrary JSON value (objects/arrays nest; scalars are 0). */
function jsonDepth(node: unknown, depth = 0): number {
  if (depth > MAX_DEPTH + 1) return depth; // already over — short-circuit
  if (Array.isArray(node)) {
    let max = depth;
    for (const item of node) max = Math.max(max, jsonDepth(item, depth + 1));
    return max;
  }
  if (node && typeof node === 'object') {
    let max = depth;
    for (const key of Object.keys(node as Record<string, unknown>)) {
      max = Math.max(max, jsonDepth((node as Record<string, unknown>)[key], depth + 1));
    }
    return max;
  }
  return depth;
}

export interface ParsedSchema {
  /** The exact JSON structure the caller supplied (JSON.parse of their text). */
  raw: unknown;
  /** avsc's validated, resolved Type — the source of truth for correctness
   * (namespace resolution, name qualification, canonical form, fingerprint,
   * compatibility, encode/decode). */
  type: avro.Type;
  /** Every named (and primitive) type avsc encountered while resolving the
   * schema, keyed by fully-qualified name — populated via avsc's own
   * `registry` option, so namespace inheritance is resolved by avsc, not
   * reimplemented here. */
  registry: Record<string, avro.Type>;
}

/**
 * Parse and validate a caller-supplied .avsc schema string: bounds-check
 * it, parse the JSON, bound its nesting depth, then hand it to avsc to
 * confirm it is a well-formed Avro schema. Never throws — every failure
 * mode returns a structured AvroError instead.
 */
export function parseAndValidate(schemaText: string): { parsed?: ParsedSchema; error?: AvroError } {
  if (typeof schemaText !== 'string' || schemaText.length === 0) {
    return { error: mkError('schema must be a non-empty string') };
  }
  if (Buffer.byteLength(schemaText, 'utf8') > MAX_SCHEMA_BYTES) {
    return { error: mkError(`schema exceeds the maximum allowed size of ${MAX_SCHEMA_BYTES} bytes`) };
  }
  let raw: unknown;
  try {
    raw = JSON.parse(schemaText);
  } catch (err) {
    return { error: mkError(`invalid JSON: ${(err as Error).message}`) };
  }
  if (jsonDepth(raw) > MAX_DEPTH) {
    return { error: mkError(`schema nesting exceeds the maximum allowed depth of ${MAX_DEPTH}`) };
  }
  const registry: Record<string, avro.Type> = {};
  let type: avro.Type;
  try {
    type = avro.Type.forSchema(raw as avro.Schema, { registry });
  } catch (err) {
    return { error: mkError((err as Error).message || String(err)) };
  }
  return { parsed: { raw, type, registry } };
}

/** Avro spec namespace resolution: a named type's own effective namespace
 * (also the namespace its children inherit if they declare none). Per the
 * spec, a dotted (already fully-qualified) `name` takes priority over an
 * explicit `namespace` attribute — the namespace attribute is ignored in
 * that case, not merged with it (verified against avsc's own resolution:
 * `{name:"a.b.Foo", namespace:"ignored.ns"}` resolves to full name
 * "a.b.Foo", not something derived from "ignored.ns"). */
export function ownNamespace(node: Record<string, unknown>, enclosingNamespace: string): string {
  const name = node.name;
  if (typeof name === 'string' && name.indexOf('.') >= 0) {
    return name.slice(0, name.lastIndexOf('.'));
  }
  if (typeof node.namespace === 'string') return node.namespace;
  return enclosingNamespace;
}

export function resolveFullName(name: string, namespace: string): string {
  if (name.indexOf('.') >= 0) return name;
  return namespace ? `${namespace}.${name}` : name;
}

function isNamedTypeKind(kind: unknown): kind is 'record' | 'error' | 'enum' | 'fixed' {
  return kind === 'record' || kind === 'error' || kind === 'fixed' || kind === 'enum';
}

/** Every named type (record/enum/fixed) declared anywhere in the schema
 * tree, deduplicated by full name, in first-seen (declaration) order. Walks
 * the RAW parsed JSON (not avsc's re-serialized form, which silently drops
 * unrecognized/logicalType attributes) — safe because the schema has
 * already been proven well-formed by parseAndValidate before this runs. */
export function collectNamedTypes(raw: unknown): NamedType[] {
  const out: NamedType[] = [];
  const seen = new Set<string>();
  walk(raw, '', 0, (node, namespace) => {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return;
    const kind = (node as Record<string, unknown>).type;
    if (!isNamedTypeKind(kind)) return;
    const name = (node as Record<string, unknown>).name;
    if (typeof name !== 'string') return;
    const ns = ownNamespace(node as Record<string, unknown>, namespace);
    const fullName = resolveFullName(name, ns);
    if (seen.has(fullName)) return;
    seen.add(fullName);
    const nt = new NamedType();
    nt.setFullName(fullName);
    nt.setType(kind === 'error' ? 'record' : kind);
    nt.setNamespace(ns);
    const doc = (node as Record<string, unknown>).doc;
    nt.setDoc(typeof doc === 'string' ? doc : '');
    out.push(nt);
  });
  return out;
}

/** Every non-empty `doc` string anywhere in the schema tree: the root, any
 * named type, and any record field. */
export function collectDocs(raw: unknown): DocEntry[] {
  const out: DocEntry[] = [];
  const push = (path: string, doc: unknown) => {
    if (typeof doc === 'string' && doc.length > 0) {
      const e = new DocEntry();
      e.setPath(path);
      e.setDoc(doc);
      out.push(e);
    }
  };
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    push('', (raw as Record<string, unknown>).doc);
  }
  walk(raw, '', 0, (node, _namespace, path) => {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return;
    const rec = node as Record<string, unknown>;
    if (isNamedTypeKind(rec.type) && path !== '') {
      push(path, rec.doc);
    }
    if (rec.type === 'record' || rec.type === 'error') {
      const fields = rec.fields;
      if (Array.isArray(fields)) {
        fields.forEach((f, i) => {
          if (f && typeof f === 'object') push(`${path}/fields/${i}`, (f as Record<string, unknown>).doc);
        });
      }
    }
  });
  return out;
}

/** Every non-empty `aliases` array anywhere in the schema tree: named
 * types and record fields can each declare aliases for evolution renames. */
export function collectAliases(raw: unknown): AliasEntry[] {
  const out: AliasEntry[] = [];
  const push = (path: string, aliases: unknown) => {
    if (Array.isArray(aliases) && aliases.length > 0 && aliases.every((a) => typeof a === 'string')) {
      const e = new AliasEntry();
      e.setPath(path);
      e.setAliasesList(aliases as string[]);
      out.push(e);
    }
  };
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    push('', (raw as Record<string, unknown>).aliases);
  }
  walk(raw, '', 0, (node, _namespace, path) => {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return;
    const rec = node as Record<string, unknown>;
    if (isNamedTypeKind(rec.type) && path !== '') {
      push(path, rec.aliases);
    }
    if (rec.type === 'record' || rec.type === 'error') {
      const fields = rec.fields;
      if (Array.isArray(fields)) {
        fields.forEach((f, i) => {
          if (f && typeof f === 'object') push(`${path}/fields/${i}`, (f as Record<string, unknown>).aliases);
        });
      }
    }
  });
  return out;
}

const KNOWN_UNDERLYING: Record<string, string> = {
  decimal: 'bytes-or-fixed',
  date: 'int',
  'time-millis': 'int',
  'time-micros': 'long',
  'timestamp-millis': 'long',
  'timestamp-micros': 'long',
  uuid: 'string',
  duration: 'fixed',
};

/** Every `logicalType` annotation anywhere in the schema tree. avsc itself
 * silently discards any logicalType it has not been explicitly configured
 * to recognize (see avsc's types.js: it is only retained when a matching
 * class is passed via `opts.logicalTypes`), so this walks the raw JSON
 * directly rather than relying on avsc's resolved Type. */
export function collectLogicalTypes(raw: unknown): LogicalTypeEntry[] {
  const out: LogicalTypeEntry[] = [];
  walk(raw, '', 0, (node, _namespace, path) => {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return;
    const rec = node as Record<string, unknown>;
    const logicalType = rec.logicalType;
    if (typeof logicalType !== 'string' || logicalType.length === 0) return;
    const e = new LogicalTypeEntry();
    e.setPath(path);
    e.setLogicalType(logicalType);
    const underlying = typeof rec.type === 'string' ? rec.type : (KNOWN_UNDERLYING[logicalType] || '');
    e.setUnderlyingType(underlying);
    if (logicalType === 'decimal') {
      const precision = rec.precision;
      const scale = rec.scale;
      e.setPrecision(typeof precision === 'number' ? precision : 0);
      e.setScale(typeof scale === 'number' ? scale : 0);
    }
    out.push(e);
  });
  return out;
}

/**
 * Generic bounded walk over a raw (already-validated) Avro schema JSON
 * tree. Calls `visit(node, namespaceAtThisNode, jsonPointerPath)` for every
 * schema-shaped node reached: the root, every array element (union
 * branch), and every named-type / array-items / map-values / field-type
 * position. Bare name-reference strings (a second use of an
 * already-declared named type) are leaves — they are never expanded, which
 * also makes self-referential schemas (e.g. a linked-list record
 * referencing its own name) naturally terminate without extra tracking.
 */
function walk(
  node: unknown,
  namespace: string,
  depth: number,
  visit: (node: unknown, namespace: string, path: string) => void,
  path = '',
): void {
  if (depth > MAX_DEPTH || node == null) return;
  if (Array.isArray(node)) {
    node.forEach((branch, i) => walk(branch, namespace, depth + 1, visit, `${path}/${i}`));
    return;
  }
  if (typeof node !== 'object') {
    return; // bare string: primitive or a name reference — a leaf.
  }
  visit(node, namespace, path);
  const rec = node as Record<string, unknown>;
  const kind = rec.type;
  let childNamespace = namespace;
  if (isNamedTypeKind(kind)) {
    childNamespace = ownNamespace(rec, namespace);
  }
  if (kind === 'record' || kind === 'error') {
    const fields = rec.fields;
    if (Array.isArray(fields)) {
      fields.forEach((f, i) => {
        if (f && typeof f === 'object') {
          walk((f as Record<string, unknown>).type, childNamespace, depth + 1, visit, `${path}/fields/${i}`);
        }
      });
    }
  } else if (kind === 'array') {
    walk(rec.items, childNamespace, depth + 1, visit, `${path}/items`);
  } else if (kind === 'map') {
    walk(rec.values, childNamespace, depth + 1, visit, `${path}/values`);
  } else if (kind !== undefined && typeof kind === 'object') {
    // Verbose nesting form, e.g. {"type": {"type": "array", "items": "int"}}.
    walk(kind, childNamespace, depth + 1, visit, `${path}/type`);
  }
}
