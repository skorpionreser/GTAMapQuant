export interface AuditLog {
  id: string
  adminLogin: string
  action: string
  entityType: string
  entityId: string
  entityName: string
  data: string
  createdAtUtc: string
}
