import { useEffect, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { getAuditLogs } from './api/auditLogsApi'
import type { AuditLog } from './types/AuditLog'
import '../admin/styles/AdminPage.css'

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(new Date(value))
}

export function AuditLogsPage() {
  const { session } = useAuth()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!session) return

    const controller = new AbortController()
    void getAuditLogs(session.token)
      .then((loadedLogs) => {
        if (!controller.signal.aborted) setLogs(loadedLogs)
      })
      .catch((caughtError: unknown) => {
        if (!controller.signal.aborted) {
          setError(caughtError instanceof Error ? caughtError.message : 'Unable to load audit logs.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [session])

  return (
    <main className="admin-page">
      <section className="admin-page__intro">
        <div>
          <span className="page-eyebrow page-eyebrow--accent">SECURITY</span>
          <h1>Audit log</h1>
          <p>Latest administrator changes to map content.</p>
        </div>
        <span className="admin-page__count">{logs.length} entries</span>
      </section>
      {error && <p role="alert">{error}</p>}
      <section className="admin-card admin-table-card">
        <div className="admin-card__heading">
          <div><span className="page-eyebrow">HISTORY</span><h2>Recent changes</h2></div>
          <span className="admin-table-card__hint">Latest 200 events</span>
        </div>
        <div className="admin-table-card__scroll">
          <table>
            <thead><tr><th>When</th><th>Administrator</th><th>Action</th><th>Object</th><th>Saved data</th></tr></thead>
            <tbody>
              {isLoading && <tr><td colSpan={5}>Loading audit log…</td></tr>}
              {!isLoading && logs.length === 0 && <tr><td colSpan={5}>No administrator actions have been recorded yet.</td></tr>}
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{formatDate(log.createdAtUtc)}</td>
                  <td><b>{log.adminLogin}</b></td>
                  <td>{log.action}</td>
                  <td><b>{log.entityType}</b><br />{log.entityName}</td>
                  <td><code>{log.data}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
