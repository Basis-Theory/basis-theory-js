import { createRequestConfig, dataExtractor } from '@/common';
import { BasisTheoryService } from '@/service';
import type { Permission } from '@/types/models';
import type { RequestOptions } from '@/types/sdk';

export class BasisTheoryPermissions extends BasisTheoryService {
  public list(options?: RequestOptions): Promise<Permission[]> {
    return this.client
      .get('/', createRequestConfig(options))
      .then(dataExtractor);
  }
}
