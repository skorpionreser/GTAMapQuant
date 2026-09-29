// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AccountMenu } from './AccountMenu'

const authMocks = vi.hoisted(() => ({ useAuth: vi.fn() }))

vi.mock('../../AuthContext', () => ({ useAuth: authMocks.useAuth }))

function renderMenu() {
  render(<MemoryRouter><AccountMenu /></MemoryRouter>)
}

beforeEach(() => {
  authMocks.useAuth.mockReturnValue({
    isAdmin: false,
    session: null,
    signIn: vi.fn(),
    signOut: vi.fn(),
  })
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('AccountMenu', () => {
  it('opens a sign-in form for an anonymous visitor', () => {
    renderMenu()

    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeTruthy()
    expect(screen.getByLabelText('Login')).toBeTruthy()
    expect(screen.getByLabelText('Password')).toBeTruthy()
  })

  it('closes the form after a successful sign in', async () => {
    const signIn = vi.fn().mockResolvedValue(undefined)
    authMocks.useAuth.mockReturnValue({
      isAdmin: false,
      session: null,
      signIn,
      signOut: vi.fn(),
    })
    renderMenu()

    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    fireEvent.change(screen.getByLabelText('Login'), { target: { value: 'admin' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } })
    fireEvent.submit(screen.getByLabelText('Login').closest('form')!)

    await waitFor(() => expect(signIn).toHaveBeenCalledWith({ login: 'admin', password: 'password' }))
    expect(screen.queryByRole('heading', { name: 'Sign in' })).toBeNull()
  })

  it('shows an error when sign in fails', async () => {
    authMocks.useAuth.mockReturnValue({
      isAdmin: false,
      session: null,
      signIn: vi.fn().mockRejectedValue(new Error('Rejected')),
      signOut: vi.fn(),
    })
    renderMenu()

    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    fireEvent.change(screen.getByLabelText('Login'), { target: { value: 'admin' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } })
    fireEvent.submit(screen.getByLabelText('Login').closest('form')!)

    expect((await screen.findByRole('alert')).textContent).toBe('Incorrect login or password.')
  })

  it('shows administration and signs out an administrator', () => {
    const signOut = vi.fn()
    authMocks.useAuth.mockReturnValue({
      isAdmin: true,
      session: { login: 'admin', role: 'Admin', token: 'test-token' },
      signIn: vi.fn(),
      signOut,
    })
    renderMenu()

    fireEvent.click(screen.getByRole('button', { name: 'admin' }))

    expect(screen.getByRole('link', { name: 'Administration' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }))
    expect(signOut).toHaveBeenCalledOnce()
  })
})
