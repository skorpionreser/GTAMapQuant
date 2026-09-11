import { GtaMap } from './components/GtaMap/GtaMap'
import { useMapMarkers } from './hooks/useMapMarkers'
import './MapPage.css'

export function MapPage() {
  const { markers, error, isLoading } = useMapMarkers()


  return (
    <main className="app">
      <header className="app__header">
        <h1>GTA V Map</h1>
        <p>Map markers: {markers.length}</p>

        {isLoading && <p>Loading markers...</p>}

        {error && (
          <p className="app__error" role="alert">
            {error}
          </p>
        )}
      </header>

      <section className="app__map">
        <GtaMap markers={markers}/>
      </section>
    </main>
  )
}
