import { createRequestConfig, dataExtractor } from '@/common';
import type { Permission } from '@/interfaces/models';
import type { RequestOptions } from '@/interfaces/sdk';
import { BasisTheoryService } from '@/service';

export class BasisTheoryPermissions extends BasisTheoryService {
  public list(options?: RequestOptions): Promise<Permission[]> {
    return this.client
      .get('/', createRequestConfig(options))
      .then(dataExtractor);
  }
}
