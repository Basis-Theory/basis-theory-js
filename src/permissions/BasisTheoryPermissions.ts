import { createRequestConfig, dataExtractor, getQueryParams } from '@/common';
import { BasisTheoryService } from '@/service';
import type { Permission } from '@/types/models';
import type { ListPermissionsQuery, RequestOptions } from '@/types/sdk';

export class BasisTheoryPermissions extends BasisTheoryService {
  public list(
    query?: ListPermissionsQuery,
    options?: RequestOptions
  ): Promise<Permission[]> {
    const url = `/${getQueryParams(query)}`;

    return this.client
      .get(url, createRequestConfig(options))
      .then(dataExtractor);
  }
}
