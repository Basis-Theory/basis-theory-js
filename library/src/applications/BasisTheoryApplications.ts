import { createRequestConfig, dataExtractor } from '../common';
import { BasisTheoryService, RequestOptions } from '../service';
import { CrudBuilder } from '../service/CrudBuilder';
import type {
  Application,
  ApplicationQuery,
  CreateApplicationModel,
  UpdateApplicationModel,
} from './types';

export const BasisTheoryApplications = new CrudBuilder(
  class BasisTheoryApplications extends BasisTheoryService {
    /**
     * @deprecated use {@link retrieveByKey} instead
     */
    public async getApplicationByKey(): Promise<Application> {
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
  .create<Application, CreateApplicationModel>()
  .retrieve<Application>()
  .update<Application, UpdateApplicationModel>()
  .delete()
  .list<Application, ApplicationQuery>()
  .build();

export type BasisTheoryApplications = InstanceType<
  typeof BasisTheoryApplications
>;
