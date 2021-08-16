import { createRequestConfig, dataExtractor } from '../common';
import { BasisTheoryService, RequestOptions } from '../service';
import { CrudBuilder } from '../service/CrudBuilder';
import { Permission } from './types';

export const BasisTheoryPermissions = new CrudBuilder(
  class BasisTheoryPermissions extends BasisTheoryService {
    public async list(options?: RequestOptions): Promise<Permission[]> {
      return this.client
        .get('/', createRequestConfig(options))
        .then(dataExtractor);
    }
  }
).build();

export type BasisTheoryPermissions = InstanceType<
  typeof BasisTheoryPermissions
>;
