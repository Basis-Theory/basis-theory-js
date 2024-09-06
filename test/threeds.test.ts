import type MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import {
  API_KEY_HEADER,
  transformRequestSnakeCase,
  transformResponseCamelCase,
} from '@/common';
import { AuthenticateThreeDSSessionRequest } from '@/types/models/threeds';
import type { BasisTheory as IBasisTheory } from '@/types/sdk';
import { mockServiceClient } from './setup/utils';

const expectBasisTheoryApiError = <T>(
  promise: Promise<T>,
  status: number
): Promise<void> =>
  expect(promise).rejects.toMatchObject({
    name: 'BasisTheoryApiError',
    status,
  });

describe('ThreeDS', () => {
  let bt: IBasisTheory,
    chance: Chance.Chance,
    apiKey: string,
    client: MockAdapter;

  const errorStatus = (): number =>
    new Chance().integer({
      min: 400,
      max: 599,
    });

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    client = mockServiceClient(bt.threeds);
  });
  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('get session by id', () => {
    test('should return 3ds session', async () => {
      const id = chance.string();

      /* eslint-disable camelcase */
      const response = {
        id: chance.string(),
        tenant_id: chance.string(),
        pan_token_id: chance.string(),
        card_brand: chance.string(),
        expiration_date: chance.string(),
        created_date: chance.string(),
        created_by: chance.string(),
        modified_date: chance.string(),
        modified_by: chance.string(),
        device: chance.string(),
        device_info: {
          browser_accept_header: chance.string(),
          browser_javascript_enabled: chance.bool(),
          browser_java_enabled: chance.bool(),
          browser_language: chance.string(),
          browser_color_depth: chance.string(),
          browser_screen_height: chance.string(),
          browser_screen_width: chance.string(),
          browser_tz: chance.string(),
          browser_user_agent: chance.string(),
        },
        version: {
          recommended_version: chance.string(),
          available_version: [chance.string(), chance.string()],
          earliest_acs_supported_version: chance.string(),
          earliest_ds_supported_version: chance.string(),
          latest_acs_supported_version: chance.string(),
          latest_ds_supported_version: chance.string(),
          acs_information: [chance.string(), chance.string(), chance.string()],
        },
        method: {
          method_url: chance.string(),
          method_completion_indicator: chance.string(),
        },
        authentication: {
          threeds_version: chance.string(),
          acs_transaction_id: chance.string(),
          ds_transaction_id: chance.string(),
          acs_reference_number: chance.string(),
          ds_reference_number: chance.string(),
          authentication_value: chance.string(),
          authentication_status: chance.string(),
          eci: chance.string(),
          acs_challenge_mandated: chance.string(),
          authentication_challenge_type: chance.string(),
          acs_challenge_url: chance.string(),
          challenge_attempts: chance.string(),
          message_extensions: [],
        },
      };
      /* eslint-enable camelcase */

      client.onGet(`/sessions/${id}`).reply(200, JSON.stringify(response));

      expect(await bt.threeds.getSessionById(id)).toStrictEqual(
        transformResponseCamelCase(response)
      );
      expect(client.history.get).toHaveLength(1);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
    });

    test('should reject with status >= 400 <= 599', async () => {
      const id = chance.string();
      const status = errorStatus();

      client.onGet(`/sessions/${id}`).reply(status);

      const promise = bt.threeds.getSessionById(id);

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('authenticate', () => {
    test('should authenticate', async () => {
      const id = chance.string();

      const request: AuthenticateThreeDSSessionRequest = {
        authenticationCategory: 'payment',
        authenticationType: 'payment-transaction',
        purchaseInfo: {
          amount: '80000',
          currency: '826',
          exponent: '2',
          date: '20240109141010',
        },
        requestorInfo: {
          id: 'example-3ds-merchant',
          name: 'Example 3DS Merchant',
          url: 'https://www.example.com/example-merchant',
        },
        merchantInfo: {
          mid: '9876543210001',
          acquirerBin: '000000999',
          name: 'Example 3DS Merchant',
          categoryCode: '7922',
          countryCode: '826',
        },
        cardholderInfo: {
          name: 'John Doe',
          email: 'john@me.com',
        },
      };

      /* eslint-disable camelcase */
      const response = {
        threeds_version: '2.2.0',
        acs_transaction_id: '50b9c543-4abc-4fbd-8bed-7e1931ed862c',
        ds_transaction_id: '497acd8d-4b50-4f55-9e56-c6dcaeff2933',
        acs_reference_number: 'mock-acs-reference-number',
        ds_reference_number: 'mock-directory-server-a',
        authentication_value: 'LVJhdmVsaW4gVGVzdCBWYWx1ZS0=',
        authentication_status: 'successful',
        eci: '05',
        acs_challenge_mandated: 'N',
        authentication_challenge_type: 'static',
        acs_challenge_url: 'https://acs.ravelin.com/3ds/acs/browser/creq',
        challenge_attempts: '01',
        message_extensions: [],
      };
      /* eslint-enable camelcase */

      client
        .onPost(`/sessions/${id}/authenticate`)
        .reply(200, JSON.stringify(response));

      expect(await bt.threeds.authenticateSession(id, request)).toStrictEqual(
        transformResponseCamelCase(response)
      );
      expect(client.history.post).toHaveLength(1);
      expect(client.history.post[0].data).toStrictEqual(
        JSON.stringify(transformRequestSnakeCase(request))
      );
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
    });

    test('should reject with status >= 400 <= 599', async () => {
      const id = chance.string();
      const status = errorStatus();

      client.onPost(`/sessions/${id}/authenticate`).reply(status);

      const promise = bt.threeds.authenticateSession(
        id,
        {} as AuthenticateThreeDSSessionRequest
      );

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('challenge result', () => {
    test('should return challenge result', async () => {
      const id = chance.string();

      /* eslint-disable camelcase */
      const response = {
        threeds_version: chance.string(),
        acs_transaction_id: chance.string(),
        ds_transaction_id: chance.string(),
        acs_reference_number: chance.string(),
        ds_reference_number: chance.string(),
        authentication_value: chance.string(),
        authentication_status: chance.string(),
        eci: chance.string(),
        acs_challenge_mandated: chance.string(),
        authentication_challenge_type: chance.string(),
        acs_challenge_url: chance.string(),
        challenge_attempts: chance.string(),
        message_extensions: [],
      };
      /* eslint-enable camelcase */

      client
        .onGet(`/sessions/${id}/challenge-result`)
        .reply(200, JSON.stringify(response));

      expect(await bt.threeds.getChallengeResult(id)).toStrictEqual(
        transformResponseCamelCase(response)
      );
      expect(client.history.get).toHaveLength(1);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
      });
    });

    test('should reject with status >= 400 <= 599', async () => {
      const id = chance.string();
      const status = errorStatus();

      client.onGet(`/sessions/${id}/challenge-result`).reply(status);

      const promise = bt.threeds.getChallengeResult(id);

      await expectBasisTheoryApiError(promise, status);
    });
  });
});
