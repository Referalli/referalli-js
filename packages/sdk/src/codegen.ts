/**
 * Turns Referalli's OpenAPI document into TypeScript types: one type per
 * component, plus `<OperationId>Body` / `<OperationId>Response` / `<OperationId>Query`
 * for every operation and an `operations` table of methods and paths.
 * Dependency-free; it understands the JSON Schema subset the API emits.
 */
type Schema = Record<string, unknown>;

const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const pascal = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const key = (k: string) => (IDENT.test(k) ? k : JSON.stringify(k));

function render(schema: unknown, indent: string): string {
  if (schema === true || schema === undefined) return 'unknown';
  if (schema === false) return 'never';
  const s = schema as Schema;
  if (typeof s.$ref === 'string') return s.$ref.split('/').pop()!;
  if ('const' in s) return JSON.stringify(s.const);
  if (Array.isArray(s.enum)) return s.enum.map((v) => JSON.stringify(v)).join(' | ');
  const union = (s.anyOf ?? s.oneOf) as unknown[] | undefined;
  if (union) return union.map((o) => wrap(render(o, indent))).join(' | ');
  if (Array.isArray(s.allOf)) return s.allOf.map((o) => wrap(render(o, indent))).join(' & ');
  if (Array.isArray(s.type)) return s.type.map((t) => render({ ...s, type: t }, indent)).join(' | ');
  switch (s.type) {
    case 'string':
      return 'string';
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'null':
      return 'null';
    case 'array':
      return `Array<${render(s.items, indent)}>`;
    case 'object':
    case undefined: {
      const props = (s.properties ?? {}) as Record<string, unknown>;
      const required = new Set((s.required as string[] | undefined) ?? []);
      const extra = s.additionalProperties;
      const entries = Object.entries(props);
      if (entries.length === 0) {
        if (s.type === undefined && !('additionalProperties' in s)) return 'unknown';
        return extra && typeof extra === 'object' ? `Record<string, ${render(extra, indent)}>` : 'Record<string, unknown>';
      }
      const inner = indent + '  ';
      const lines = entries.map(([k, v]) => {
        const doc = (v as Schema).description ? `${inner}/** ${String((v as Schema).description)} */\n` : '';
        return `${doc}${inner}${key(k)}${required.has(k) ? '' : '?'}: ${render(v, inner)};`;
      });
      if (extra && typeof extra === 'object') lines.push(`${inner}[key: string]: ${render(extra, inner)};`);
      return `{\n${lines.join('\n')}\n${indent}}`;
    }
    default:
      return 'unknown';
  }
}

const wrap = (t: string) => (t.includes(' | ') || t.includes(' & ') ? `(${t})` : t);

/** `GET /v1/partners/{id}` → `GetPartnersId`: the base name of an operation's types. */
export function typeName(method: string, path: string): string {
  const words = path.replace(/^\/v1\//, '/').replace(/[{}]/g, '');
  return pascal(`${method}${words.replace(/[^A-Za-z0-9]+(.)?/g, (_, c: string | undefined) => (c ? c.toUpperCase() : ''))}`);
}

interface Operation {
  operationId: string;
  summary?: string;
  parameters?: Array<{ name: string; in: string; required?: boolean; schema: unknown }>;
  requestBody?: { content: Record<string, { schema: unknown }> };
  responses: Record<string, { content?: Record<string, { schema: unknown }> }>;
}

export function generateTypes(spec: {
  components?: { schemas?: Record<string, unknown> };
  paths: Record<string, Record<string, Operation>>;
  webhooks?: Record<string, Record<string, { summary?: string; description?: string; requestBody?: { content?: Record<string, { schema?: unknown }> } }>>;
}): string {
  const out: string[] = [
    '// Generated from the Referalli OpenAPI document. Do not edit by hand:',
    '// run `pnpm --filter referalli gen` after changing the API.',
    '',
  ];
  for (const [name, schema] of Object.entries(spec.components?.schemas ?? {})) {
    const doc = (schema as Schema).description;
    if (doc) out.push(`/** ${String(doc)} */`);
    out.push(`export type ${name} = ${render(schema, '')};`, '');
  }
  const table: string[] = [];
  for (const [path, methods] of Object.entries(spec.paths)) {
    for (const [method, op] of Object.entries(methods)) {
      // Same names the API gives operation-specific components (no /v1 prefix).
      const id = typeName(method, path);
      if (op.summary) out.push(`/** ${method.toUpperCase()} ${path}: ${op.summary} */`);
      const body = op.requestBody?.content['application/json']?.schema;
      if (body) out.push(`export type ${id}Body = ${render(body, '')};`);
      const query = (op.parameters ?? []).filter((p) => p.in === 'query');
      if (query.length > 0) {
        const fields = query.map((p) => `  ${key(p.name)}${p.required ? '' : '?'}: ${render(p.schema, '  ')};`);
        out.push(`export type ${id}Query = {\n${fields.join('\n')}\n};`);
      }
      const success = Object.entries(op.responses).find(([code]) => /^2\d\d$/.test(code))?.[1];
      const json = success?.content?.['application/json']?.schema as Schema | undefined;
      // A response that is already the component `<Id>Response` needs no alias.
      if (json?.$ref !== `#/components/schemas/${id}Response`) {
        out.push(`export type ${id}Response = ${json ? render(json, '') : success?.content ? 'string' : 'void'};`);
      }
      out.push('');
      table.push(`  ${op.operationId}: { method: '${method.toUpperCase()}', path: '${path}' },`);
    }
  }
  // Webhook payloads by topic (the OpenAPI document's `webhooks`); the SDK's
  // `WebhookEvent` union is built from this map.
  const hooks = Object.entries(spec.webhooks ?? {}).flatMap(([topic, item]) => {
    const op = item.post ?? Object.values(item)[0];
    const schema = op?.requestBody?.content?.['application/json']?.schema;
    if (!schema) return [];
    const doc = op.summary ?? op.description;
    return [`${doc ? `  /** ${String(doc).replace(/\n/g, ' ')} */\n` : ''}  ${JSON.stringify(topic)}: ${render(schema, '  ')};`];
  });
  out.push(
    '/** Every webhook topic and its payload. */',
    hooks.length ? `export type WebhookPayloads = {\n${hooks.join('\n')}\n};` : 'export type WebhookPayloads = Record<never, never>;',
    '',
  );
  out.push('/** Every operation, by operationId. */', `export const operations = {\n${table.join('\n')}\n} as const;`, '');
  out.push('export type OperationId = keyof typeof operations;', '');
  return out.join('\n');
}
