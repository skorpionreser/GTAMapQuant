import { useState } from 'react'
import { GtaMap } from './components/GtaMap/GtaMap'
import { useMapMarkers } from './hooks/useMapMarkers'
import { useMapAreas } from './hooks/useMapAreas'
import './MapPage.css'

type MapView = 'world' | 'zones'

export function MapPage() {
  const { markers, error, isLoading } = useMapMarkers()
  const { areas, error: areasError, isLoading: areAreasLoading } = useMapAreas()
  const [mapView, setMapView] = useState<MapView>('world')

  const displayedMarkers = mapView === 'world' ? markers : []
  const displayedAreas = mapView === 'zones' ? areas : []

  return (
    <main className="map-page">
      {(error || areasError) && (
        <p className="page-error" role="alert">
          {error ?? areasError}
        </p>
      )}

      <section className="map-layout">
        <aside className="map-filters">
          <span className="map-filters__label map-filters__label--first">MAP GROUPS</span>
          <div className="map-view-switch" role="tablist" aria-label="Map groups">
            <button
              className={mapView === 'world' ? 'is-active' : undefined}
              type="button"
              role="tab"
              aria-selected={mapView === 'world'}
              onClick={() => setMapView('world')}
            >
              <span aria-hidden="true">Map</span>
              World map
            </button>
            <button
              className={mapView === 'zones' ? 'is-active' : undefined}
              type="button"
              role="tab"
              aria-selected={mapView === 'zones'}
              onClick={() => setMapView('zones')}
            >
              <span aria-hidden="true">Zone</span>
              Game zones
            </button>
          </div>

          <div>
            <h2>{mapView === 'world' ? 'World map' : 'Game zones'}</h2>
            <p>
              {mapView === 'world'
                ? 'All available locations are visible as map icons.'
                : 'Only zone boundaries are shown in this group.'}
            </p>
          </div>

          {mapView === 'zones' && (
            <div className="map-zones-note">
              <span className="map-filters__label">DISPLAY</span>
              <p>Icons are hidden in this mode so that zone borders remain readable.</p>
            </div>
          )}

          <div className="map-filters__status">
            {isLoading || areAreasLoading
              ? 'Loading map data…'
              : mapView === 'world'
                ? `${markers.length} locations available`
                : `${areas.length} zones available`}
          </div>
        </aside>

        <section className="map-page__surface">
          <div className="map-page__caption">
            <b>{mapView === 'world' ? 'SAN ANDREAS' : 'GAME ZONES'}</b>
            <span>
              {mapView === 'world'
                ? 'LOS SANTOS & BLAINE COUNTY'
                : 'TERRITORIES AND ACTIVITIES'}
            </span>
          </div>
          <GtaMap markers={displayedMarkers} areas={displayedAreas} />
        </section>
      </section>
    </main>
  )
}
