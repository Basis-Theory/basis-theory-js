export const applicationTypes = [
  'server_to_server',
  'public',
  'elements',
  'management',
] as const;

export type ApplicationType = typeof applicationTypes[number];

export interface Application {
  id: string;
  ownerId: string;
  name: string;
  type: ApplicationType;
  createdAt: string;
  modifiedAt: string;
  permissions: string[];
  key?: string;
}

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
