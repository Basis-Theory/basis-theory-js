import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import {
  BT_TRACE_ID_HEADER,
  API_KEY_HEADER,
  BT_IDEMPOTENCY_KEY_HEADER,
} from '@/common';
import type {
  CreateTenantInvitation,
  TenantInvitation,
  TenantMember,
  TenantUsageReport,
} from '@/types/models';
import type { BasisTheory as IBasisTheory, PaginatedList } from '@/types/sdk';
import {
  errorStatus,
  expectBasisTheoryApiError,
  mockServiceClient,
} from './setup/utils';

describe('Tenants', () => {
  let bt: IBasisTheory,
    chance: Chance.Chance,
    apiKey: string,
    client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    client = mockServiceClient(bt.tenants);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('retrieve', () => {
    test('should retrieve a tenant', async () => {
      const id = chance.string();
      const ownerId = chance.string();
      const name = chance.string();
      const settings = {
        [chance.word()]: chance.string(),
        [chance.word()]: chance.string(),
        [chance.word()]: chance.string(),
      };
      const createdBy = chance.string();
      const createdAt = chance.string();
      const modifiedBy = chance.string();
      const modifiedAt = chance.string();

      client.onGet().reply(
        200,
        /* eslint-disable camelcase */
        JSON.stringify({
          id,
          owner_id: ownerId,
          name,
          settings,
          created_at: createdAt,
          created_by: createdBy,
          modified_at: modifiedAt,
          modified_by: modifiedBy,
        })
        /* eslint-enable camelcase */
      );

      expect(await bt.tenants.retrieve()).toStrictEqual({
        id,
        ownerId,
        name,
        settings,
        createdAt,
        createdBy,
        modifiedAt,
        modifiedBy,
      });
      expect(client.history.get).toHaveLength(1);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
    });

    test('should retrieve a tenant with options', async () => {
      const id = chance.string();
      const ownerId = chance.string();
      const name = chance.string();
      const settings = {
        [chance.word()]: chance.string(),
        [chance.word()]: chance.string(),
        [chance.word()]: chance.string(),
      };
      const createdBy = chance.string();
      const createdAt = chance.string();
      const modifiedBy = chance.string();
      const modifiedAt = chance.string();
      const _apiKey = chance.string();
      const correlationId = chance.string();
      const idempotencyKey = chance.string();

      client.onGet().reply(
        200,
        /* eslint-disable camelcase */
        JSON.stringify({
          id,
          owner_id: ownerId,
          name,
          settings,
          created_at: createdAt,
          created_by: createdBy,
          modified_at: modifiedAt,
          modified_by: modifiedBy,
        })
        /* eslint-enable camelcase */
      );

      expect(
        await bt.tenants.retrieve({
          apiKey: _apiKey,
          correlationId,
          idempotencyKey,
        })
      ).toStrictEqual({
        id,
        ownerId,
        name,
        settings,
        createdAt,
        createdBy,
        modifiedAt,
        modifiedBy,
      });
      expect(client.history.get).toHaveLength(1);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
        [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
      });
    });

    test('should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onGet().reply(status);

      const promise = bt.tenants.retrieve();

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('update', () => {
    test('should update a tenant', async () => {
      const name = chance.string();
      const settings = {
        [chance.word()]: chance.string(),
        [chance.word()]: chance.string(),
        [chance.word()]: chance.string(),
      };

      client.onPut().reply(
        200,
        JSON.stringify({
          name,
          settings,
        })
      );

      expect(
        await bt.tenants.update({
          name,
          settings,
        })
      ).toStrictEqual({
        name,
        settings,
      });
      expect(client.history.put).toHaveLength(1);
      expect(client.history.put[0].data).toStrictEqual(
        JSON.stringify({
          name,
          settings,
        })
      );
      expect(client.history.put[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    test('should update with options', async () => {
      const name = chance.string();
      const settings = {
        [chance.word()]: chance.string(),
        [chance.word()]: chance.string(),
        [chance.word()]: chance.string(),
      };
      const _apiKey = chance.string();
      const correlationId = chance.string();
      const idempotencyKey = chance.string();

      client.onPut().reply(
        200,
        JSON.stringify({
          name,
          settings,
        })
      );

      expect(
        await bt.tenants.update(
          {
            name,
            settings,
          },
          {
            apiKey: _apiKey,
            correlationId,
            idempotencyKey,
          }
        )
      ).toStrictEqual({
        name,
        settings,
      });
      expect(client.history.put).toHaveLength(1);
      expect(client.history.put[0].data).toStrictEqual(
        JSON.stringify({
          name,
          settings,
        })
      );
      expect(client.history.put[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
        [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
      });
    });

    test('should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onPut().reply(status);

      const promise = bt.tenants.update({ name: chance.string() });

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('delete', () => {
    test('should delete a tenant', async () => {
      client.onDelete().reply(204, {});

      expect(await bt.tenants.delete()).toBeUndefined();
      expect(client.history.delete).toHaveLength(1);
      expect(client.history.delete[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    test('should delete a tenant with options', async () => {
      const _apiKey = chance.string();
      const correlationId = chance.string();
      const idempotencyKey = chance.string();

      client.onDelete().reply(204, {});

      expect(
        await bt.tenants.delete({
          apiKey: _apiKey,
          correlationId,
          idempotencyKey,
        })
      ).toBeUndefined();
      expect(client.history.delete).toHaveLength(1);
      expect(client.history.delete[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
        [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
      });
    });

    test('should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onDelete().reply(status);

      const promise = bt.tenants.delete();

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('retrieve tenant usage report', () => {
    let expectedUsageReport: TenantUsageReport;
    let expectedUsageReportJson: string;

    beforeEach(() => {
      expectedUsageReport = {
        tokenReport: {
          metricsByType: {
            [chance.string({
              alpha: true,
              casing: 'lower',
            })]: {
              count: chance.integer(),
              lastCreatedAt: chance.string(),
            },
          },
          includedMonthlyActiveTokens: chance.integer(),
          monthlyActiveTokens: chance.integer(),
        },
      };
      /* eslint-disable camelcase */
      expectedUsageReportJson = JSON.stringify({
        token_report: {
          metrics_by_type: expectedUsageReport.tokenReport.metricsByType,
          monthly_active_tokens:
            expectedUsageReport.tokenReport.monthlyActiveTokens,
          included_monthly_active_tokens:
            expectedUsageReport.tokenReport.includedMonthlyActiveTokens,
        },
      });
      /* eslint-enable camelcase */
    });

    test('should retrieve tenant usage report', async () => {
      client.onGet('/reports/usage').reply(200, expectedUsageReportJson);

      expect(await bt.tenants.retrieveUsageReport()).toStrictEqual(
        expectedUsageReport
      );
      expect(client.history.get).toHaveLength(1);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
    });

    test('should retrieve tenant usage report with options', async () => {
      const _apiKey = chance.string();
      const correlationId = chance.string();
      const idempotencyKey = chance.string();

      client.onGet('/reports/usage').reply(200, expectedUsageReportJson);

      expect(
        await bt.tenants.retrieveUsageReport({
          apiKey: _apiKey,
          correlationId,
          idempotencyKey,
        })
      ).toStrictEqual(expectedUsageReport);
      expect(client.history.get).toHaveLength(1);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
        [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
      });
    });

    test('should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onGet('/reports/usage').reply(status);

      const promise = bt.tenants.retrieveUsageReport();

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('tenant members', () => {
    describe('list', () => {
      let totalItems: number;
      let pageNumber: number;
      let pageSize: number;
      let totalPages: number;
      let expectedMember: TenantMember;
      let expectedTenantMembers: PaginatedList<TenantMember>;
      let expectedTenantMembersJson: string;

      beforeEach(() => {
        totalItems = chance.integer();
        pageNumber = chance.integer();
        pageSize = chance.integer();
        totalPages = chance.integer();
        expectedMember = {
          id: chance.guid(),
          tenantId: chance.guid(),
          role: 'ADMIN',
          user: {
            id: chance.guid(),
          },
          createdAt: new Date().toISOString(),
          createdBy: chance.guid(),
        };

        expectedTenantMembers = {
          pagination: {
            totalItems,
            pageNumber,
            pageSize,
            totalPages,
          },
          data: [expectedMember],
        };

        /* eslint-disable camelcase */
        expectedTenantMembersJson = JSON.stringify({
          pagination: {
            total_items: totalItems,
            page_number: pageNumber,
            page_size: pageSize,
            total_pages: totalPages,
          },
          data: [
            {
              id: expectedMember.id,
              tenant_id: expectedMember.tenantId,
              role: expectedMember.role,
              user: {
                id: expectedMember.user.id,
              },
              created_at: expectedMember.createdAt,
              created_by: expectedMember.createdBy,
            },
          ],
        });
        /* eslint-enable camelcase */
      });

      test('should list', async () => {
        client.onGet('/members').reply(200, expectedTenantMembersJson);

        expect(await bt.tenants.listMembers()).toStrictEqual(
          expectedTenantMembers
        );
        expect(client.history.get).toHaveLength(1);
        expect(client.history.get[0].url).toStrictEqual('/members');
        expect(client.history.get[0].headers).toMatchObject({
          [API_KEY_HEADER]: expect.any(String),
        });
      });

      test('should list with query', async () => {
        client.onGet().reply(200, expectedTenantMembersJson);

        expect(
          await bt.tenants.listMembers({
            userId: ['foo', 'bar'],
            page: pageNumber,
            size: pageSize,
          })
        ).toStrictEqual(expectedTenantMembers);
        expect(client.history.get).toHaveLength(1);
        expect(client.history.get[0].url).toStrictEqual(
          `/members?user_id=foo&user_id=bar&page=${pageNumber}&size=${pageSize}`
        );
        expect(client.history.get[0].headers).toMatchObject({
          [API_KEY_HEADER]: expect.any(String),
        });
      });

      test('should list with options', async () => {
        const correlationId = chance.string();
        const idempotencyKey = chance.string();

        client.onGet('/members').reply(200, expectedTenantMembersJson);

        expect(
          await bt.tenants.listMembers(
            {},
            {
              apiKey,
              correlationId,
              idempotencyKey,
            }
          )
        ).toStrictEqual(expectedTenantMembers);
        expect(client.history.get).toHaveLength(1);
        expect(client.history.get[0].url).toStrictEqual(`/members`);
        expect(client.history.get[0].headers).toMatchObject({
          [API_KEY_HEADER]: apiKey,
          [BT_TRACE_ID_HEADER]: correlationId,
          [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
        });
      });

      test('should reject with status >= 400 <= 599', async () => {
        const status = errorStatus();

        client.onGet('/members').reply(status);

        const promise = bt.tenants.listMembers();

        await expectBasisTheoryApiError(promise, status);
      });
    });

    describe('delete', () => {
      let expectedMemberId: string;
      let path: string;

      beforeEach(() => {
        expectedMemberId = chance.guid();
        path = `/members/${expectedMemberId}`;
      });

      test('should delete', async () => {
        client.onDelete(path).reply(204, {});

        expect(await bt.tenants.deleteMember(expectedMemberId)).toBeUndefined();
        expect(client.history.delete).toHaveLength(1);
        expect(client.history.delete[0].url).toStrictEqual(path);
        expect(client.history.delete[0].headers).toMatchObject({
          [API_KEY_HEADER]: expect.any(String),
        });
      });

      test('should delete with options', async () => {
        const correlationId = chance.string();
        const idempotencyKey = chance.string();

        client.onDelete(path).reply(204, {});

        expect(
          await bt.tenants.deleteMember(expectedMemberId, {
            apiKey,
            correlationId,
            idempotencyKey,
          })
        ).toBeUndefined();
        expect(client.history.delete).toHaveLength(1);
        expect(client.history.delete[0].url).toStrictEqual(path);
        expect(client.history.delete[0].headers).toMatchObject({
          [API_KEY_HEADER]: apiKey,
          [BT_TRACE_ID_HEADER]: correlationId,
          [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
        });
      });

      test('should reject with status >= 400 <= 599', async () => {
        const status = errorStatus();

        client.onDelete(path).reply(status);

        const promise = bt.tenants.deleteMember(expectedMemberId);

        await expectBasisTheoryApiError(promise, status);
      });
    });
  });

  describe('tenant invitations', () => {
    describe('create', () => {
      let expectedCreateInvitationRequest: CreateTenantInvitation;
      let expectedTenantInvitation: TenantInvitation;
      let expectedTenantInvitationJson: string;

      beforeEach(() => {
        expectedCreateInvitationRequest = {
          email: chance.email(),
        };

        expectedTenantInvitation = {
          id: chance.guid(),
          tenantId: chance.guid(),
          email: expectedCreateInvitationRequest.email,
          status: 'PENDING',
          expiresAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          createdBy: chance.guid(),
        };

        /* eslint-disable camelcase */
        expectedTenantInvitationJson = JSON.stringify({
          id: expectedTenantInvitation.id,
          tenant_id: expectedTenantInvitation.tenantId,
          email: expectedTenantInvitation.email,
          status: expectedTenantInvitation.status,
          expires_at: expectedTenantInvitation.expiresAt,
          created_at: expectedTenantInvitation.createdAt,
          created_by: expectedTenantInvitation.createdBy,
        });
        /* eslint-enable camelcase */
      });

      test('should create', async () => {
        client.onPost('/invitations').reply(201, expectedTenantInvitationJson);

        expect(
          await bt.tenants.createInvitation(expectedCreateInvitationRequest)
        ).toStrictEqual(expectedTenantInvitation);
        expect(client.history.post).toHaveLength(1);
        expect(client.history.post[0].url).toStrictEqual('/invitations');
        expect(client.history.post[0].data).toStrictEqual(
          JSON.stringify(expectedCreateInvitationRequest)
        );
        expect(client.history.post[0].headers).toMatchObject({
          [API_KEY_HEADER]: expect.any(String),
        });
      });

      test('should create with options', async () => {
        const correlationId = chance.string();
        const idempotencyKey = chance.string();

        client.onPost('/invitations').reply(201, expectedTenantInvitationJson);

        expect(
          await bt.tenants.createInvitation(expectedCreateInvitationRequest, {
            apiKey,
            correlationId,
            idempotencyKey,
          })
        ).toStrictEqual(expectedTenantInvitation);
        expect(client.history.post).toHaveLength(1);
        expect(client.history.post[0].url).toStrictEqual('/invitations');
        expect(client.history.post[0].headers).toMatchObject({
          [API_KEY_HEADER]: apiKey,
          [BT_TRACE_ID_HEADER]: correlationId,
          [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
        });
      });

      test('should reject with status >= 400 <= 599', async () => {
        const status = errorStatus();

        client.onPost('/invitations').reply(status);

        const promise = bt.tenants.createInvitation(
          expectedCreateInvitationRequest
        );

        await expectBasisTheoryApiError(promise, status);
      });
    });

    describe('resend', () => {
      let expectedInvitationId: string;
      let path: string;
      let expectedTenantInvitation: TenantInvitation;
      let expectedTenantInvitationJson: string;

      beforeEach(() => {
        expectedInvitationId = chance.guid();
        path = `/invitations/${expectedInvitationId}/resend`;

        expectedTenantInvitation = {
          id: chance.guid(),
          tenantId: chance.guid(),
          email: chance.email(),
          status: 'PENDING',
          expiresAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          createdBy: chance.guid(),
        };

        /* eslint-disable camelcase */
        expectedTenantInvitationJson = JSON.stringify({
          id: expectedTenantInvitation.id,
          tenant_id: expectedTenantInvitation.tenantId,
          email: expectedTenantInvitation.email,
          status: expectedTenantInvitation.status,
          expires_at: expectedTenantInvitation.expiresAt,
          created_at: expectedTenantInvitation.createdAt,
          created_by: expectedTenantInvitation.createdBy,
        });
        /* eslint-enable camelcase */
      });

      test('should resend invitation', async () => {
        client.onPost(path).reply(200, expectedTenantInvitationJson);

        expect(
          await bt.tenants.resendInvitation(expectedInvitationId)
        ).toStrictEqual(expectedTenantInvitation);
        expect(client.history.post).toHaveLength(1);
        expect(client.history.post[0].url).toStrictEqual(path);
        expect(client.history.post[0].headers).toMatchObject({
          [API_KEY_HEADER]: expect.any(String),
        });
      });

      test('should resend invitation with options', async () => {
        const correlationId = chance.string();
        const idempotencyKey = chance.string();

        client.onPost(path).reply(200, expectedTenantInvitationJson);

        expect(
          await bt.tenants.resendInvitation(expectedInvitationId, {
            apiKey,
            correlationId,
            idempotencyKey,
          })
        ).toStrictEqual(expectedTenantInvitation);
        expect(client.history.post).toHaveLength(1);
        expect(client.history.post[0].url).toStrictEqual(path);
        expect(client.history.post[0].headers).toMatchObject({
          [API_KEY_HEADER]: apiKey,
          [BT_TRACE_ID_HEADER]: correlationId,
          [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
        });
      });

      test('should reject with status >= 400 <= 599', async () => {
        const status = errorStatus();

        client.onPost(path).reply(status);

        const promise = bt.tenants.resendInvitation(expectedInvitationId);

        await expectBasisTheoryApiError(promise, status);
      });
    });

    describe('list', () => {
      let totalItems: number;
      let pageNumber: number;
      let pageSize: number;
      let totalPages: number;
      let expectedInvitation: TenantInvitation;
      let expectedTenantInvitations: PaginatedList<TenantInvitation>;
      let expectedTenantInvitationsJson: string;

      beforeEach(() => {
        totalItems = chance.integer();
        pageNumber = chance.integer();
        pageSize = chance.integer();
        totalPages = chance.integer();
        expectedInvitation = {
          id: chance.guid(),
          tenantId: chance.guid(),
          email: chance.email(),
          status: 'PENDING',
          expiresAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          createdBy: chance.guid(),
        };

        expectedTenantInvitations = {
          pagination: {
            totalItems,
            pageNumber,
            pageSize,
            totalPages,
          },
          data: [expectedInvitation],
        };

        /* eslint-disable camelcase */
        expectedTenantInvitationsJson = JSON.stringify({
          pagination: {
            total_items: totalItems,
            page_number: pageNumber,
            page_size: pageSize,
            total_pages: totalPages,
          },
          data: [
            {
              id: expectedInvitation.id,
              tenant_id: expectedInvitation.tenantId,
              email: expectedInvitation.email,
              status: expectedInvitation.status,
              expires_at: expectedInvitation.expiresAt,
              created_at: expectedInvitation.createdAt,
              created_by: expectedInvitation.createdBy,
            },
          ],
        });
        /* eslint-enable camelcase */
      });

      test('should list', async () => {
        client.onGet('/invitations').reply(200, expectedTenantInvitationsJson);

        expect(await bt.tenants.listInvitations()).toStrictEqual(
          expectedTenantInvitations
        );
        expect(client.history.get).toHaveLength(1);
        expect(client.history.get[0].url).toStrictEqual('/invitations');
        expect(client.history.get[0].headers).toMatchObject({
          [API_KEY_HEADER]: expect.any(String),
        });
      });

      test('should list with query', async () => {
        client.onGet().reply(200, expectedTenantInvitationsJson);

        expect(
          await bt.tenants.listInvitations({
            status: 'PENDING',
            page: pageNumber,
            size: pageSize,
          })
        ).toStrictEqual(expectedTenantInvitations);
        expect(client.history.get).toHaveLength(1);
        expect(client.history.get[0].url).toStrictEqual(
          `/invitations?status=PENDING&page=${pageNumber}&size=${pageSize}`
        );
        expect(client.history.get[0].headers).toMatchObject({
          [API_KEY_HEADER]: expect.any(String),
        });
      });

      test('should list with options', async () => {
        const correlationId = chance.string();
        const idempotencyKey = chance.string();

        client.onGet('/invitations').reply(200, expectedTenantInvitationsJson);

        expect(
          await bt.tenants.listInvitations(
            {},
            {
              apiKey,
              correlationId,
              idempotencyKey,
            }
          )
        ).toStrictEqual(expectedTenantInvitations);
        expect(client.history.get).toHaveLength(1);
        expect(client.history.get[0].url).toStrictEqual(`/invitations`);
        expect(client.history.get[0].headers).toMatchObject({
          [API_KEY_HEADER]: apiKey,
          [BT_TRACE_ID_HEADER]: correlationId,
          [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
        });
      });

      test('should reject with status >= 400 <= 599', async () => {
        const status = errorStatus();

        client.onGet('/invitations').reply(status);

        const promise = bt.tenants.listInvitations();

        await expectBasisTheoryApiError(promise, status);
      });
    });

    describe('retrieve', () => {
      let expectedInvitationId: string;
      let path: string;
      let expectedTenantInvitation: TenantInvitation;
      let expectedTenantInvitationJson: string;

      beforeEach(() => {
        expectedInvitationId = chance.guid();
        path = `/invitations/${expectedInvitationId}`;

        expectedTenantInvitation = {
          id: chance.guid(),
          tenantId: chance.guid(),
          email: chance.email(),
          status: 'PENDING',
          expiresAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          createdBy: chance.guid(),
        };

        /* eslint-disable camelcase */
        expectedTenantInvitationJson = JSON.stringify({
          id: expectedTenantInvitation.id,
          tenant_id: expectedTenantInvitation.tenantId,
          email: expectedTenantInvitation.email,
          status: expectedTenantInvitation.status,
          expires_at: expectedTenantInvitation.expiresAt,
          created_at: expectedTenantInvitation.createdAt,
          created_by: expectedTenantInvitation.createdBy,
        });
        /* eslint-enable camelcase */
      });

      test('should retrieve', async () => {
        client.onGet(path).reply(200, expectedTenantInvitationJson);

        expect(
          await bt.tenants.retrieveInvitation(expectedInvitationId)
        ).toStrictEqual(expectedTenantInvitation);
        expect(client.history.get).toHaveLength(1);
        expect(client.history.get[0].url).toStrictEqual(path);
        expect(client.history.get[0].headers).toMatchObject({
          [API_KEY_HEADER]: expect.any(String),
        });
      });

      test('should retrieve with options', async () => {
        const correlationId = chance.string();
        const idempotencyKey = chance.string();

        client.onGet(path).reply(200, expectedTenantInvitationJson);

        expect(
          await bt.tenants.retrieveInvitation(expectedInvitationId, {
            apiKey,
            correlationId,
            idempotencyKey,
          })
        ).toStrictEqual(expectedTenantInvitation);
        expect(client.history.get).toHaveLength(1);
        expect(client.history.get[0].url).toStrictEqual(path);
        expect(client.history.get[0].headers).toMatchObject({
          [API_KEY_HEADER]: apiKey,
          [BT_TRACE_ID_HEADER]: correlationId,
          [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
        });
      });

      test('should reject with status >= 400 <= 599', async () => {
        const status = errorStatus();

        client.onGet(path).reply(status);

        const promise = bt.tenants.retrieveInvitation(expectedInvitationId);

        await expectBasisTheoryApiError(promise, status);
      });
    });

    describe('delete', () => {
      let expectedInvitationId: string;
      let path: string;

      beforeEach(() => {
        expectedInvitationId = chance.guid();
        path = `/invitations/${expectedInvitationId}`;
      });

      test('should delete', async () => {
        client.onDelete(path).reply(204, {});

        expect(
          await bt.tenants.deleteInvitation(expectedInvitationId)
        ).toBeUndefined();
        expect(client.history.delete).toHaveLength(1);
        expect(client.history.delete[0].url).toStrictEqual(path);
        expect(client.history.delete[0].headers).toMatchObject({
          [API_KEY_HEADER]: expect.any(String),
        });
      });

      test('should delete with options', async () => {
        const correlationId = chance.string();
        const idempotencyKey = chance.string();

        client.onDelete(path).reply(204, {});

        expect(
          await bt.tenants.deleteInvitation(expectedInvitationId, {
            apiKey,
            correlationId,
            idempotencyKey,
          })
        ).toBeUndefined();
        expect(client.history.delete).toHaveLength(1);
        expect(client.history.delete[0].url).toStrictEqual(path);
        expect(client.history.delete[0].headers).toMatchObject({
          [API_KEY_HEADER]: apiKey,
          [BT_TRACE_ID_HEADER]: correlationId,
          [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
        });
      });

      test('should reject with status >= 400 <= 599', async () => {
        const status = errorStatus();

        client.onDelete(path).reply(status);

        const promise = bt.tenants.deleteInvitation(expectedInvitationId);

        await expectBasisTheoryApiError(promise, status);
      });
    });
  });
});
