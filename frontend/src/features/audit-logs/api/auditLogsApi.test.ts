import { afterEach, describe, expect, it, vi } from 'vitest'
import { getAuditLogs } from './auditLogsApi'

afterEach(() => vi.unstubAllGlobals())

describe('auditLogsApi', () => {
  it('loads audit entries with the session token', async () => {
    const logs = [{ action: 'Created', id: 'log' }]
    const fetchMock = vi.fn().mockResolvedValue({ json: vi.fn().mockResolvedValue(logs), ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await expect(getAuditLogs('token')).resolves.toEqual(logs)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5114/api/AuditLogs', {
      headers: { Authorization: 'Bearer token' },
    })
  })

  it('throws a helpful error when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    await expect(getAuditLogs('token')).rejects.toThrow('Unable to load audit logs.')
  })
})
