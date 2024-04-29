import type { ApplicationKey } from '@/types/models';

interface ApplicationKeys {
  create(id: string): Promise<ApplicationKey>;
  delete(applicationId: string, keyId: string): Promise<void>;
  get(applicationId: string): Promise<ApplicationKey[]>;
  getById(applicationId: string, keyId: string): Promise<ApplicationKey>;
}

export type { ApplicationKeys };
