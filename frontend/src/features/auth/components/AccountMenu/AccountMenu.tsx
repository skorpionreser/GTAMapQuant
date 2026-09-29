import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../useAuth'
import './AccountMenu.css'

export function AccountMenu() {
  const { session, isAdmin, signIn, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit() {
    setError(null)
    setIsSubmitting(true)

    try {
      await signIn({ login: loginValue, password })
      setIsOpen(false)
      setPassword('')
    } catch {
      setError('Incorrect login or password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleSignOut() {
    signOut()
    setIsOpen(false)
    setPassword('')
  }

  return (
    <div className="account-menu">
      <button
        className="account-menu__trigger"
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <span className="account-menu__avatar" aria-hidden="true">
          {session ? session.login.charAt(0).toUpperCase() : '↗'}
        </span>
        <span>{session ? session.login : 'Sign in'}</span>
        <span className="account-menu__chevron" aria-hidden="true">⌄</span>
      </button>

      {isOpen && !session && (
        <form
          className="account-menu__panel account-menu__form"
          onSubmit={(event) => {
            event.preventDefault()
            void handleSubmit()
          }}
        >
          <div className="account-menu__heading">
            <span className="page-eyebrow">ACCOUNT</span>
            <h2>Sign in</h2>
            <p>Administrator access only.</p>
          </div>

          <label className="account-menu__field">
            <span>Login</span>
            <input
              type="text"
              value={loginValue}
              onChange={(event) => setLoginValue(event.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label className="account-menu__field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="account-menu__error" role="alert">{error}</p>}

          <button className="account-menu__submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      )}

      {isOpen && session && (
        <div className="account-menu__panel account-menu__profile" role="menu">
          <div className="account-menu__profile-summary">
            <span className="account-menu__profile-avatar" aria-hidden="true">
              {session.login.charAt(0).toUpperCase()}
            </span>
            <div>
              <b>{session.login}</b>
              <span>{session.role}</span>
            </div>
          </div>

          {isAdmin && (
            <>
            <Link
              className="account-menu__link"
              to="/admin/map-markers"
              onClick={() => setIsOpen(false)}
            >
              <span aria-hidden="true">⚙</span>
              Administration
            </Link>
            <Link
              className="account-menu__link"
              to="/admin/map-areas"
              onClick={() => setIsOpen(false)}
            >
              Area administration
            </Link>
            </>
          )}

          <button className="account-menu__sign-out" type="button" onClick={handleSignOut}>
            <span aria-hidden="true">↪</span>
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
