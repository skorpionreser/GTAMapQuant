import { MapPage } from './features/map/MapPage'
import { Route, Routes } from 'react-router-dom'
import { MapAreaAdminPage } from './features/map-areas-admin/MapAreaAdminPage'
import { MapMarkerAdminPage } from './features/map-markers-admin/MapMarkerAdminPage'
import { AppLayout } from './components/AppLayout/AppLayout'
import { HomePage } from './features/home/HomePage'
import { RequireAdmin } from './features/auth/RequireAdmin'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/admin/map-markers" element={<RequireAdmin><MapMarkerAdminPage /></RequireAdmin>} />
        <Route path="/admin/map-areas" element={<RequireAdmin><MapAreaAdminPage /></RequireAdmin>} />
      </Route>
    </Routes>
  )
}

export default App
