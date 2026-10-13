import { notifyAuthSessionExpired } from '../../auth/sessionEvents'
import type { AuditLog } from '../types/AuditLog'

const auditLogsUrl = 'http://localhost:5114/api/AuditLogs'

export async function getAuditLogs(token: string): Promise<AuditLog[]> {
  const response = await fetch(auditLogsUrl, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (response.status === 401) {
    notifyAuthSessionExpired()
    throw new Error('Your session has expired. Sign in again.')
  }

  if (!response.ok) {
    throw new Error('Unable to load audit logs.')
  }

  return response.json() as Promise<AuditLog[]>
}
