// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { AuthProvider } from './AuthContext'
import { RequireAdmin } from './RequireAdmin'

const storageKey = 'gtamapquant-auth-session'

function renderProtectedRoute() {
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<p>Home page</p>} />
          <Route path="/admin" element={<RequireAdmin><p>Protected page</p></RequireAdmin>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  sessionStorage.clear()
})

afterEach(cleanup)

describe('RequireAdmin', () => {
  it('redirects an anonymous visitor to the home page', () => {
    renderProtectedRoute()

    expect(screen.getByText('Home page')).toBeTruthy()
  })

  it('renders protected content for an administrator', () => {
    sessionStorage.setItem(
      storageKey,
      JSON.stringify({ login: 'admin', role: 'Admin', token: 'test-token' }),
    )

    renderProtectedRoute()

    expect(screen.getByText('Protected page')).toBeTruthy()
  })
})
