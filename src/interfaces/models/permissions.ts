import type { ApplicationType } from './applications';

interface Permission {
  type: string;
  description: string;
  applicationTypes: ApplicationType[];
}

export type { Permission };
