import type { Permission } from '@/interfaces/models';
import type { RequestOptions } from './shared';

interface Permissions {
  list(options?: RequestOptions): Promise<Permission[]>;
}

export type { Permissions };
