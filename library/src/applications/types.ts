export const APPLICATION_TYPES = [
  'server_to_server',
  'public',
  'elements',
  'management',
] as const;

export type ApplicationType = typeof APPLICATION_TYPES[number];

export interface Application {
  id: string;
  tenantId: string;
  name: string;
  key?: string;
  type: ApplicationType;
  permissions: string[];
  createdAt: string;
  modifiedAt: string;
}

export type CreateApplicationModel = Pick<Application, 'name' | 'type'> &
  Partial<Pick<Application, 'permissions'>>;

export type UpdateApplicationModel = Partial<
  Pick<Application, 'name' | 'permissions'>
>;

// we can disable for this next line as we are only exporting interfaces here
// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace ApplicationsApi {
  export interface GetApplicationByKeyResponse {
    id: string;
    owner_id: string;
    name: string;
    type: ApplicationType;
    created_at: string;
    modified_at: string;
    permissions: string[];
    key?: string;
  }
}
