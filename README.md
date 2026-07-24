# avro-tools

Composable [Axiom](https://axiomide.com) nodes for deterministic parsing, inspection, canonicalization, and
compatibility analysis of Apache Avro schemas (`.avsc` JSON), wrapping
[`avsc`](https://github.com/mtth/avsc) (mtth/avsc, MIT, zero runtime dependencies) — a pure-JS Avro
implementation.

Built for the Axiom marketplace (`christiangeorgelucas/avro-tools`).

Every node is a pure text-in / struct-out transform: the schema is always supplied as plain JSON text by
the caller, nothing is fetched from a schema registry or the network, and there is no randomness or
wall-clock use.

## Use it from your agent or app

Every node in this package is a **live, auto-scaling API endpoint** on the
[Axiom](https://axiomide.com) marketplace — call it from an AI agent or your own
code, with nothing to self-host.

**📦 See it on the marketplace:**
https://dev.axiomide.com/marketplace/christiangeorgelucas/avro-tools@0.1.1

**Hook it up to an AI agent (MCP).** Add Axiom's hosted MCP server to any MCP
client and every node becomes a typed tool your agent can call — search the
catalog, inspect a schema, and invoke it directly.

```bash
# Claude Code
claude mcp add --transport http axiom https://api.axiomide.com/mcp \
  --header "Authorization: Bearer $AXIOM_API_KEY"
```

Claude Desktop, Cursor, or any config-based client:

```json
{
  "mcpServers": {
    "axiom": {
      "type": "http",
      "url": "https://api.axiomide.com/mcp",
      "headers": { "Authorization": "Bearer YOUR_AXIOM_API_KEY" }
    }
  }
}
```

**Call it from the CLI.**

```bash
axiom invoke christiangeorgelucas/avro-tools/ParseSchema --input '{ ... }'
```

**Call it over HTTP.**

```bash
curl -X POST https://api.axiomide.com/invocations/v1/nodes/christiangeorgelucas/avro-tools/0.1.1/ParseSchema \
  -H "Authorization: Bearer $AXIOM_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```

> Input/output schema for each node is on the marketplace page above, or via
> `axiom inspect node christiangeorgelucas/avro-tools/ParseSchema`.

### Get started free

Install the CLI:

```bash
# macOS / Linux — Homebrew
brew install axiomide/tap/axiom

# macOS / Linux — install script
curl -fsSL https://raw.githubusercontent.com/AxiomIDE/axiom-releases/main/install.sh | sh
```

**Windows:** download the `windows/amd64` `.zip` from the
[releases page](https://github.com/AxiomIDE/axiom-releases/releases), unzip it,
and put `axiom.exe` on your `PATH`.

Then `axiom version` to verify, `axiom login` (GitHub or Google) to authenticate,
and create an API key under **Console → API Keys**. Docs and sign-up at
**[axiomide.com](https://axiomide.com)**.

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
