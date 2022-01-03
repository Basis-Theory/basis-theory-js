import type { Permission } from '@basis-theory/basis-theory-elements-interfaces/models';
import type { RequestOptions } from '@basis-theory/basis-theory-elements-interfaces/sdk';
import { createRequestConfig, dataExtractor } from '../common';
import { BasisTheoryService } from '../service';

export class BasisTheoryPermissions extends BasisTheoryService {
  public list(options?: RequestOptions): Promise<Permission[]> {
    return this.client
      .get('/', createRequestConfig(options))
      .then(dataExtractor);
  }
}
