export interface Tenant {
  id: string;
  ownerId: string;
  name: string;
  createdAt: string;
  modifiedAt: string;
}

export type UpdateTenantModel = Pick<Tenant, 'name'>;
