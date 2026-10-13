import { DynamicMapPage } from './features/map/DynamicMapPage'
import { Route, Routes } from 'react-router-dom'
import { MapAreaAdminPage } from './features/map-areas-admin/MapAreaAdminPage'
import { MapMarkerAdminPage } from './features/map-markers-admin/MapMarkerAdminPage'
import { AppLayout } from './components/AppLayout/AppLayout'
import { HomePage } from './features/home/HomePage'
import { RequireAdmin } from './features/auth/RequireAdmin'
import { MapModeAdminPage } from './features/map-modes-admin/MapModeAdminPage'
import { AuditLogsPage } from './features/audit-logs/AuditLogsPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<DynamicMapPage />} />
        <Route path="/admin/map-markers" element={<RequireAdmin><MapMarkerAdminPage /></RequireAdmin>} />
        <Route path="/admin/map-areas" element={<RequireAdmin><MapAreaAdminPage /></RequireAdmin>} />
        <Route path="/admin/map-modes" element={<RequireAdmin><MapModeAdminPage /></RequireAdmin>} />
        <Route path="/admin/audit-logs" element={<RequireAdmin><AuditLogsPage /></RequireAdmin>} />
      </Route>
    </Routes>
  )
}

export default App
