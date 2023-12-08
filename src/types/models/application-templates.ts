import type { ApplicationType, AccessRule } from './applications';

const TEMPLATE_TYPES = [
  'starters',
  'payments',
  'banking',
  'pii',
  'management',
] as const;

type TemplateType = typeof TEMPLATE_TYPES[number];

interface ApplicationTemplate {
  id: string;
  name: string;
  description: string;
  applicationType: ApplicationType;
  templateType: TemplateType;
  isStarter: boolean;
  permissions?: string[];
  rules?: AccessRule[];
}

export type { TemplateType, ApplicationTemplate };

export { TEMPLATE_TYPES };
