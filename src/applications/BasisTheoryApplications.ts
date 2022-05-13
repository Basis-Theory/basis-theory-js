import { createRequestConfig, dataExtractor } from '@/common';
import type {
  Application,
  CreateApplication,
  UpdateApplication,
} from '@/interfaces/models';
import type { ListApplicationsQuery, RequestOptions } from '@/interfaces/sdk';
import { BasisTheoryService } from '@/service';
import { CrudBuilder } from '@/service/CrudBuilder';

export const BasisTheoryApplications = new CrudBuilder(
  class BasisTheoryApplications extends BasisTheoryService {
    /**
     * @deprecated use {@link retrieveByKey} instead
     */
    public getApplicationByKey(): Promise<Application> {
      return this.retrieveByKey();
    }

    public retrieveByKey(options?: RequestOptions): Promise<Application> {
      return this.client
        .get('/key', createRequestConfig(options))
        .then(dataExtractor);
    }

    public regenerateKey(
      id: string,
      options?: RequestOptions
    ): Promise<Application> {
      return this.client
        .post(`${id}/regenerate`, undefined, createRequestConfig(options))
        .then(dataExtractor);
    }
  }
)
  .create<Application, CreateApplication>()
  .retrieve<Application>()
  .update<Application, UpdateApplication>()
  .delete()
  .list<Application, ListApplicationsQuery>()
  .build();

export type BasisTheoryApplications = InstanceType<
  typeof BasisTheoryApplications
>;
