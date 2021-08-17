import { v4 as uuid } from 'uuid';
import { MockStore, ServiceStore, ClientStore, Services, Token } from './types';

const paymentsStore: ServiceStore = {};
const vaultStore: ServiceStore = {};
const mockStore: MockStore = {
  payments: paymentsStore,
  vault: vaultStore,
};

const getClientStore = (apiKey: string, type: Services): ClientStore => {
  const appStore = mockStore[type];
  let clientStore = appStore[apiKey];
  if (!clientStore) {
    clientStore = appStore[apiKey] = {};
  }
  return clientStore;
};

export const setData = (
  apiKey: string,
  type: Services,
  data: string
): Token => {
  const clientStore = getClientStore(apiKey, type);
  const token: Token = uuid();
  clientStore[token] = data;
  return token;
};

export const getData = (
  apiKey: string,
  type: Services,
  token: Token
): string => {
  const clientStore = getClientStore(apiKey, type);
  return clientStore[token];
};
