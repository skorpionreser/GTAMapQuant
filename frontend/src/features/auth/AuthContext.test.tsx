// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider, useAuth } from './AuthContext'

const apiMocks = vi.hoisted(() => ({ login: vi.fn() }))

vi.mock('./api/authApi', () => ({ login: apiMocks.login }))

const storageKey = 'gtamapquant-auth-session'
const session = { login: 'admin', role: 'Admin', token: 'test-token' }

function AuthProbe() {
  const { session: currentSession, isAdmin, signIn, signOut } = useAuth()

  return (
    <div>
      <span data-testid="login">{currentSession?.login ?? 'anonymous'}</span>
      <span data-testid="role">{isAdmin ? 'admin' : 'not-admin'}</span>
      <button type="button" onClick={() => void signIn({ login: 'admin', password: 'password' })}>
        Sign in
      </button>
      <button type="button" onClick={signOut}>Sign out</button>
    </div>
  )
}

beforeEach(() => {
  sessionStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('AuthProvider', () => {
  it('restores a saved admin session', () => {
    sessionStorage.setItem(storageKey, JSON.stringify(session))

    render(<AuthProvider><AuthProbe /></AuthProvider>)

    expect(screen.getByTestId('login').textContent).toBe('admin')
    expect(screen.getByTestId('role').textContent).toBe('admin')
  })

  it('saves the session after a successful sign in', async () => {
    apiMocks.login.mockResolvedValue(session)
    render(<AuthProvider><AuthProbe /></AuthProvider>)

    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => expect(screen.getByTestId('login').textContent).toBe('admin'))
    expect(sessionStorage.getItem(storageKey)).toBe(JSON.stringify(session))
  })

  it('clears the session on sign out', () => {
    sessionStorage.setItem(storageKey, JSON.stringify(session))
    render(<AuthProvider><AuthProbe /></AuthProvider>)

    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }))

    expect(screen.getByTestId('login').textContent).toBe('anonymous')
    expect(sessionStorage.getItem(storageKey)).toBeNull()
  })
})
