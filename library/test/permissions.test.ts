import { Chance } from 'chance';
import MockAdapter from 'axios-mock-adapter';
import type { ApplicationType } from '../src/applications/types';
import type { PermissionType } from './../src/permissions/types';
import { BasisTheory } from '../src';
import {
  errorStatus,
  expectBasisTheoryApiError,
  mockServiceClient,
} from './setup/utils';
import { BT_TRACE_ID_HEADER, API_KEY_HEADER } from '../src/common';

describe('Permissions', () => {
  let bt: BasisTheory;
  let chance: Chance.Chance;
  let apiKey: string;
  let client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    client = mockServiceClient(bt.permissions);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('list permissions', () => {
    it('should list permissions', async () => {
      const type = chance.string() as PermissionType;
      const description = chance.string();
      const applicationTypes = [chance.string() as ApplicationType];

      client.onGet().reply(200, [
        {
          type,
          description,
          application_types: applicationTypes,
        },
      ]);

      expect(await bt.permissions.list()).toEqual([
        {
          type,
          description,
          applicationTypes,
        },
      ]);

      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
    });

    it('should list permissions w/ options', async () => {
      const type = chance.string() as PermissionType;
      const description = chance.string();
      const applicationTypes = [chance.string() as ApplicationType];
      const _apiKey = chance.string();
      const correlationId = chance.string();

      client.onGet().reply(200, [
        {
          type,
          description,
          application_types: applicationTypes,
        },
      ]);

      expect(
        await bt.permissions.list({ apiKey: _apiKey, correlationId })
      ).toEqual([
        {
          type,
          description,
          applicationTypes,
        },
      ]);

      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onGet().reply(status);

      const promise = bt.permissions.list();

      await expectBasisTheoryApiError(promise, status);
    });
  });
});
