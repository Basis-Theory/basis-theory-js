export interface ClientStore {
  [token: string]: string;
}

export interface ServiceStore {
  [apiKey: string]: ClientStore;
}

export enum Services {
  payments = 'payments',
  vault = 'vault',
}

export type MockStore = {
  [key in Services]: ServiceStore;
};

export type Token = string;

export * from '@/types';
