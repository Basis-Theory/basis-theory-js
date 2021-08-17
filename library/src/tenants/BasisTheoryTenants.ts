import type { Tenant, UpdateTenantModel } from './types';
import { createRequestConfig, dataExtractor } from '../common';
import { BasisTheoryService, RequestOptions } from '../service';
import { CrudBuilder } from '../service/CrudBuilder';

export const BasisTheoryTenants = new CrudBuilder(
  class BasisTheoryTenants extends BasisTheoryService {
    public async retrieve(options?: RequestOptions): Promise<Tenant> {
      return this.client
        .get('/', createRequestConfig(options))
        .then(dataExtractor);
    }

    public async update(
      model: UpdateTenantModel,
      options?: RequestOptions
    ): Promise<Tenant> {
      return this.client
        .put('/', model, createRequestConfig(options))
        .then(dataExtractor);
    }

    public async delete(options?: RequestOptions): Promise<void> {
      await this.client.delete('/', createRequestConfig(options));
    }
  }
).build();

export type BasisTheoryTenants = InstanceType<typeof BasisTheoryTenants>;
