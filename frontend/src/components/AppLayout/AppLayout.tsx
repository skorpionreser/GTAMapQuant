import { NavLink, Outlet, useLocation } from 'react-router-dom'
import logo from '../../assets/Logo.svg'
import { AccountMenu } from '../../features/auth/components/AccountMenu/AccountMenu'
import './AppLayout.css'

function getPageTitle(pathname: string): string {
  if (pathname === '/admin/map-markers') {
    return 'Marker administration'
  }

  return pathname === '/map' ? 'World map' : 'Wiki overview'
}

export function AppLayout() {
  const location = useLocation()
  const pageTitle = getPageTitle(location.pathname)

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <NavLink className="app-brand" to="/">
          <span className="app-brand__mark">
            <img src={logo} alt="" />
          </span>
          <span>
            QUANT
            <small>GTA V MAP</small>
          </span>
        </NavLink>

        <span className="app-sidebar__label">EXPLORE</span>
        <nav className="app-navigation" aria-label="Main navigation">
          <NavLink end to="/">
            <span aria-hidden="true">◇</span>
            Wiki overview
          </NavLink>
          <NavLink to="/map">
            <span aria-hidden="true">⌖</span>
            World map
          </NavLink>
        </nav>

        <div className="app-sidebar__footer">
          <span className="app-sidebar__label">LOS SANTOS</span>
          <p>Find every important place on one map.</p>
          <span>QUANT MAP · 2026</span>
        </div>
      </aside>

      <div className="app-shell__content">
        <header className="app-topbar">
          <div className="app-breadcrumbs">
            QUANT <span>/</span> <b>{pageTitle}</b>
          </div>
          <div className="app-topbar__actions">
            <div className="app-topbar__identity">
              <span>GTA V</span>
              <img src={logo} alt="QUANT" />
            </div>
            <AccountMenu />
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  )
}
