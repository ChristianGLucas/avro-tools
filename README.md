# avro-tools

Composable [Axiom](https://axiom.co) nodes for deterministic parsing, inspection, canonicalization, and
compatibility analysis of Apache Avro schemas (`.avsc` JSON), wrapping
[`avsc`](https://github.com/mtth/avsc) (mtth/avsc, MIT, zero runtime dependencies) — a pure-JS Avro
implementation.

Built for the Axiom marketplace (`christiangeorgelucas/avro-tools`).

Every node is a pure text-in / struct-out transform: the schema is always supplied as plain JSON text by
the caller, nothing is fetched from a schema registry or the network, and there is no randomness or
wall-clock use.

## Nodes

- **ParseSchema** — parse a schema into its structured/normalized shape (kind, name, namespace, doc, aliases).
- **ValidateSchema** — is this a well-formed Avro schema?
- **DetectSchemaType** — record / enum / array / map / union / fixed / primitive.
- **ListFields** — a record's fields: name, type, default, doc, aliases, order.
- **GetSchemaName** — unqualified name / namespace / fully-qualified name of a named schema.
- **ListNamedTypes** — every named type (record/enum/fixed) declared anywhere in the tree.
- **ListEnumSymbols** — an enum's symbols plus its optional default symbol.
- **ListUnionBranches** — a union's branches, each with kind and (for named branches) full name.
- **CanonicalForm** — the Avro spec's Parsing Canonical Form (PCF).
- **Fingerprint** — CRC-64-AVRO (Rabin, the schema-registry identity), MD5, or SHA-256, over the PCF.
- **CheckCompatibility** — can data written with a writer schema be read as a reader schema (schema evolution)?
- **ExtractDocs** — every `doc` string anywhere in the schema tree.
- **ListAliases** — every declared `aliases` anywhere in the schema tree.
- **DetectLogicalTypes** — every `logicalType` annotation (decimal, date, timestamp-millis, uuid, ...).
- **EncodeToBinary** — encode a JSON datum to Avro binary.
- **DecodeFromBinary** — decode Avro binary back to a JSON datum.

## License

MIT — see [LICENSE](./LICENSE).
