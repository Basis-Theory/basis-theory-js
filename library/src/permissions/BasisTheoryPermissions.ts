import { createRequestConfig, dataExtractor } from '../common';
import { BasisTheoryService, RequestOptions } from '../service';
import type { Permission } from './types';

export class BasisTheoryPermissions extends BasisTheoryService {
  public async list(options?: RequestOptions): Promise<Permission[]> {
    return this.client
      .get('/', createRequestConfig(options))
      .then(dataExtractor);
  }
}
