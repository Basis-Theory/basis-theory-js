import 'reflect-metadata';
import { registry } from 'tsyringe';
import { MockProviderKeyRepository } from './utils';

@registry([
  {
    token: 'ProviderKeyRepository',
    useToken: MockProviderKeyRepository,
  },
])
export class MockRepository {}
