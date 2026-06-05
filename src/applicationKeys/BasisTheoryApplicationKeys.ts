import { dataExtractor } from '@/common';
import { BasisTheoryService } from '@/service';
import { CrudBuilder } from '@/service/CrudBuilder';
import type { ApplicationKey } from '@/types/models';

export const BasisTheoryApplicationKeys = new CrudBuilder(
  class BasisTheoryApplicationKeys extends BasisTheoryService {
    public create(applicationId: string): Promise<ApplicationKey> {
      return this.client.post(`${applicationId}/keys`).then(dataExtractor);
    }

    public get(applicationId: string): Promise<ApplicationKey[]> {
      return this.client.get(`${applicationId}/keys`).then(dataExtractor);
    }

    public getById(
      applicationId: string,
      keyId: string
    ): Promise<ApplicationKey> {
      return this.client
        .get(`${applicationId}/keys/${keyId}`)
        .then(dataExtractor);
    }

    public delete(applicationId: string, keyId: string): Promise<void> {
      return this.client
        .delete(`${applicationId}/keys/${keyId}`)
        .then(dataExtractor);
    }
  }
).build();

export type BasisTheoryApplicationKeys = InstanceType<
  typeof BasisTheoryApplicationKeys
>;
