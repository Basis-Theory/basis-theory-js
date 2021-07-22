import type {
  Application,
  CreateApplicationModel,
  UpdateApplicationModel,
} from './types';
import { BasisTheoryCRUDService } from '../service/BasisTheoryCRUDService';
import { createRequestConfig, dataExtractor } from '../common';
import { RequestOptions } from '../service';

export class BasisTheoryApplications extends BasisTheoryCRUDService<
  Application,
  CreateApplicationModel,
  UpdateApplicationModel
> {
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
