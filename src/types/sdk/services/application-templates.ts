import type { ApplicationTemplate } from '@/types/models/application-templates';
import type { RequestOptions, Retrieve } from './shared';

interface ApplicationTemplates extends Retrieve<ApplicationTemplate> {
  list(options?: RequestOptions): Promise<ApplicationTemplate[]>;
}

export type { ApplicationTemplates };
