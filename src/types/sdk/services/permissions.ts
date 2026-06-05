import type { Permission } from '@/types/models';
import { ApplicationType } from '@/types/models';
import type { RequestOptions } from './shared';

interface ListPermissionsQuery {
  applicationType?: ApplicationType;
}

interface Permissions {
  list(
    query?: ListPermissionsQuery,
    options?: RequestOptions
  ): Promise<Permission[]>;
}

export type { Permissions, ListPermissionsQuery };
