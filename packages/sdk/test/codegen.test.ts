import { describe, expect, it } from 'vitest';
import { generateTypes, typeName } from '../src/codegen.js';
import { operations, type Partner, type PostReferralsAssociateBody } from '../src/generated.js';

describe('OpenAPI type generation', () => {
  it('names operation types without the /v1 prefix', () => {
    expect(typeName('get', '/v1/partners/{id}')).toBe('GetPartnersId');
    expect(typeName('post', '/t/{orgToken}/visit')).toBe('PostTOrgTokenVisit');
  });

  it('renders components, nullables, enums, bodies and responses', () => {
    const out = generateTypes({
      components: {
        schemas: {
          Thing: {
            type: 'object',
            properties: { id: { type: 'string' }, note: { anyOf: [{ type: 'string' }, { type: 'null' }] }, kind: { enum: ['a', 'b'] } },
            required: ['id', 'note'],
          },
        },
      },
      paths: {
        '/v1/things': {
          post: {
            operationId: 'postV1Things',
            requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] } } } },
            responses: { '200': { content: { 'application/json': { schema: { $ref: '#/components/schemas/Thing' } } } } },
          },
        },
      },
    });
    expect(out).toContain('export type Thing = {\n  id: string;\n  note: string | null;\n  kind?: "a" | "b";\n};');
    expect(out).toContain('export type PostThingsBody = {\n  name: string;\n};');
    expect(out).toContain('export type PostThingsResponse = Thing;');
    expect(out).toContain("postV1Things: { method: 'POST', path: '/v1/things' },");
  });

  it('ships types for the integration surface', () => {
    const body: PostReferralsAssociateBody = { programId: 'prg_1', customerRef: 'cus_1' };
    const partner: Pick<Partner, 'externalRef'> = { externalRef: null };
    expect(body.customerRef).toBe('cus_1');
    expect(partner.externalRef).toBeNull();
    expect(operations.postV1ReferralsAssociate).toEqual({ method: 'POST', path: '/v1/referrals/associate' });
  });
});
