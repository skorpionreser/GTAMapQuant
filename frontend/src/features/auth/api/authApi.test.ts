import { afterEach, describe, expect, it, vi } from 'vitest'
import { login } from './authApi'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('login', () => {
  it('sends credentials and returns the authenticated session', async () => {
    const session = { login: 'admin', role: 'Admin', token: 'test-token' }
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(session),
      ok: true,
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(login({ login: 'admin', password: 'password' })).resolves.toEqual(session)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5114/api/Auth/login',
      {
        body: JSON.stringify({ login: 'admin', password: 'password' }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      },
    )
  })

  it('throws when credentials are rejected', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    await expect(login({ login: 'admin', password: 'wrong' })).rejects.toThrow('Failed to auth.')
  })
})
