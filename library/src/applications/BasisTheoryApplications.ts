import { BasisTheoryService } from '../service';
import type { Application } from './types';
import camelcaseKeys from 'camelcase-keys';
import { ApplicationsApi } from './types';

export class BasisTheoryApplications extends BasisTheoryService {
  public async getApplicationByKey(): Promise<Application> {
    const {
      data,
    } = await this.client.get<ApplicationsApi.GetApplicationByKeyResponse>(
      '/key'
    );

    const application = (camelcaseKeys(data, {
      deep: true,
    }) as unknown) as Application;

    return application;
  }
}
