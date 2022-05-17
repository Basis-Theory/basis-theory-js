interface Log {
  tenantId: string;
  actorId?: string;
  actorType?: string;
  entityType: string;
  entityId: string;
  operation: string;
  message: string;
  createdAt: string;
}

export type { Log };
