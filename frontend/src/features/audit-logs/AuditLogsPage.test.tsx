// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../auth/AuthContext'
import { AuditLogsPage } from './AuditLogsPage'

const apiMocks = vi.hoisted(() => ({ getAuditLogs: vi.fn() }))
vi.mock('./api/auditLogsApi', () => ({ getAuditLogs: apiMocks.getAuditLogs }))

beforeEach(() => {
  sessionStorage.setItem('gtamapquant-auth-session', JSON.stringify({ login: 'admin', role: 'Admin', token: 'token' }))
})

afterEach(() => {
  cleanup()
  sessionStorage.clear()
  vi.clearAllMocks()
})

describe('AuditLogsPage', () => {
  it('shows recorded administrator actions', async () => {
    apiMocks.getAuditLogs.mockResolvedValue([{
      action: 'Updated', adminLogin: 'admin', createdAtUtc: '2026-10-13T12:00:00Z',
      data: '{"name":"Shop"}', entityId: 'marker', entityName: 'Shop', entityType: 'MapMarker', id: 'log',
    }])

    render(<AuthProvider><AuditLogsPage /></AuthProvider>)

    expect(await screen.findByText('Shop')).toBeTruthy()
    expect(screen.getByText('Updated')).toBeTruthy()
    expect(screen.getByText('admin')).toBeTruthy()
  })

  it('shows an empty state and a load error', async () => {
    apiMocks.getAuditLogs.mockResolvedValueOnce([])
    render(<AuthProvider><AuditLogsPage /></AuthProvider>)
    expect(await screen.findByText('No administrator actions have been recorded yet.')).toBeTruthy()

    cleanup()
    apiMocks.getAuditLogs.mockRejectedValueOnce(new Error('Cannot load audit log'))
    render(<AuthProvider><AuditLogsPage /></AuthProvider>)
    expect((await screen.findByRole('alert')).textContent).toBe('Cannot load audit log')
  })
})
