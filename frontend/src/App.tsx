import { MapPage } from './features/map/MapPage'
import { Route, Routes } from 'react-router-dom'
import { MapMarkerAdminPage } from './features/map-admin/MapMarkerAdminPage'
import { AppLayout } from './components/AppLayout/AppLayout'
import { HomePage } from './features/home/HomePage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/admin/map-markers" element={<MapMarkerAdminPage />} />
      </Route>
    </Routes>
  )
}

export default App
