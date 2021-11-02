import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '../src';
import { BT_TRACE_ID_HEADER, API_KEY_HEADER } from '../src/common';
import { TenantUsageReport } from '../src/tenants';
import {
  errorStatus,
  expectBasisTheoryApiError,
  mockServiceClient,
} from './setup/utils';

describe('Tenants', () => {
  let bt: BasisTheory;
  let chance: Chance.Chance;
  let apiKey: string;
  let client: MockAdapter;

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
    it('should retrieve a tenant', async () => {
      const id = chance.string();
      const ownerId = chance.string();
      const name = chance.string();
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
          created_at: createdAt,
          created_by: createdBy,
          modified_at: modifiedAt,
          modified_by: modifiedBy,
        })
        /* eslint-enable camelcase */
      );

      expect(await bt.tenants.retrieve()).toEqual({
        id,
        ownerId,
        name,
        createdAt,
        createdBy,
        modifiedAt,
        modifiedBy,
      });
      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
    });

    it('should retrieve a tenant with options', async () => {
      const id = chance.string();
      const ownerId = chance.string();
      const name = chance.string();
      const createdBy = chance.string();
      const createdAt = chance.string();
      const modifiedBy = chance.string();
      const modifiedAt = chance.string();
      const _apiKey = chance.string();
      const correlationId = chance.string();

      client.onGet().reply(
        200,
        /* eslint-disable camelcase */
        JSON.stringify({
          id,
          owner_id: ownerId,
          name,
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
        })
      ).toEqual({
        id,
        ownerId,
        name,
        createdAt,
        createdBy,
        modifiedAt,
        modifiedBy,
      });
      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onGet().reply(status);

      const promise = bt.tenants.retrieve();

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('update', () => {
    it('should update a tenant', async () => {
      const name = chance.string();

      client.onPut().reply(200, JSON.stringify({ name }));

      expect(await bt.tenants.update({ name })).toStrictEqual({
        name,
      });
      expect(client.history.put.length).toBe(1);
      expect(client.history.put[0].data).toStrictEqual(
        JSON.stringify({ name })
      );
      expect(client.history.put[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    it('should update with options', async () => {
      const name = chance.string();
      const _apiKey = chance.string();
      const correlationId = chance.string();

      client.onPut().reply(200, JSON.stringify({ name }));

      expect(
        await bt.tenants.update(
          { name },
          {
            apiKey: _apiKey,
            correlationId,
          }
        )
      ).toStrictEqual({
        name,
      });
      expect(client.history.put.length).toBe(1);
      expect(client.history.put[0].data).toStrictEqual(
        JSON.stringify({ name })
      );
      expect(client.history.put[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onPut().reply(status);

      const promise = bt.tenants.update({ name: chance.string() });

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('delete', () => {
    it('should delete a tenant', async () => {
      client.onDelete().reply(204, {});

      expect(await bt.tenants.delete()).toBeUndefined();
      expect(client.history.delete.length).toBe(1);
      expect(client.history.delete[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    it('should delete a tenant with options', async () => {
      const _apiKey = chance.string();
      const correlationId = chance.string();

      client.onDelete().reply(204, {});

      expect(
        await bt.tenants.delete({
          apiKey: _apiKey,
          correlationId,
        })
      ).toBeUndefined();
      expect(client.history.delete.length).toBe(1);
      expect(client.history.delete[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
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

    it('should retrieve tenant usage report', async () => {
      client.onGet('/reports/usage').reply(200, expectedUsageReportJson);

      expect(await bt.tenants.retrieveUsageReport()).toEqual(
        expectedUsageReport
      );
      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
    });

    it('should retrieve tenant usage report with options', async () => {
      const _apiKey = chance.string();
      const correlationId = chance.string();

      client.onGet('/reports/usage').reply(200, expectedUsageReportJson);

      expect(
        await bt.tenants.retrieveUsageReport({
          apiKey: _apiKey,
          correlationId,
        })
      ).toEqual(expectedUsageReport);
      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onGet('/reports/usage').reply(status);

      const promise = bt.tenants.retrieveUsageReport();

      await expectBasisTheoryApiError(promise, status);
    });
  });
});
