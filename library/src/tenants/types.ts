interface Tenant {
  id: string;
  ownerId: string;
  name: string;
  createdAt: string;
  modifiedAt: string;
}

type UpdateTenantModel = Pick<Tenant, 'name'>;

export { Tenant, UpdateTenantModel };
