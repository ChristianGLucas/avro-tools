import { AxiomContext, AxiomLogger, AxiomSecrets, AxiomReflection, AxiomMutation } from '../gen/axiomContext';

const testReflection: AxiomReflection = {
  flow: {
    nodes: [],
    edges: [],
    loopEdges: [],
    position: { currentInstance: 0, depth: 0, loopIterations: {}, subflowStackGraphIds: [] },
    graphId: '',
  },
};

const testMutation: AxiomMutation = {
  flow: {
    addNode: (_packageName: string, _packageVersion: string) => 0,
    addEdge: (_srcInstance: number, _dstInstance: number) => {},
  },
};

export function makeTestContext(): AxiomContext {
  return {
    log: {
      debug: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
    } satisfies AxiomLogger,
    secrets: {
      get: (_name: string): [string, boolean] => ['', false],
    } satisfies AxiomSecrets,
    executionId: 'test-execution-id',
    flowId: 'test-flow-id',
    tenantId: 'test-tenant-id',
    reflection: testReflection,
    mutation: testMutation,
  };
}

// ---- Shared fixture schemas ----

export const USER_RECORD_SCHEMA = JSON.stringify({
  type: 'record',
  name: 'User',
  namespace: 'com.example',
  doc: 'A user account record.',
  aliases: ['Account'],
  fields: [
    { name: 'id', type: 'long', doc: 'Primary key.' },
    { name: 'name', type: 'string' },
    { name: 'email', type: ['null', 'string'], default: null },
    { name: 'signupTimestamp', type: { type: 'long', logicalType: 'timestamp-millis' } },
    {
      name: 'balance',
      type: { type: 'bytes', logicalType: 'decimal', precision: 9, scale: 2 },
    },
    {
      name: 'status',
      type: {
        type: 'enum',
        name: 'Status',
        symbols: ['ACTIVE', 'SUSPENDED', 'DELETED'],
        default: 'ACTIVE',
        doc: 'Account lifecycle state.',
      },
    },
    {
      name: 'tags',
      type: { type: 'array', items: 'string' },
      default: [],
    },
    {
      name: 'metadata',
      type: { type: 'map', values: 'string' },
      default: {},
    },
    {
      name: 'sessionKey',
      type: { type: 'fixed', name: 'Key16', size: 16 },
    },
  ],
});

export const COLOR_ENUM_SCHEMA = JSON.stringify({
  type: 'enum',
  name: 'Color',
  namespace: 'com.example',
  symbols: ['RED', 'GREEN', 'BLUE'],
  default: 'RED',
});

export const NESTED_UNION_SCHEMA = JSON.stringify([
  'null',
  'string',
  { type: 'record', name: 'Inner', namespace: 'com.example', fields: [{ name: 'x', type: 'int' }] },
]);
