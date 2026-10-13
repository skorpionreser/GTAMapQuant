import { useEffect, useState } from 'react'
import { getMapModeContent, getMapModes } from './api/mapModesApi'
import { GtaMap } from './components/GtaMap/GtaMap'
import type { MapMode, MapModeContent } from './types/MapMode'
import './MapPage.css'

export function DynamicMapPage() {
  const [modes, setModes] = useState<MapMode[]>([])
  const [selectedModeId, setSelectedModeId] = useState<string | null>(null)
  const [content, setContent] = useState<MapModeContent | null>(null)
  const [showStandardMarkers, setShowStandardMarkers] = useState<boolean | undefined>()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadModes() {
      try {
        const loadedModes = await getMapModes(controller.signal)
        setModes(loadedModes)
        const defaultModeId = loadedModes.find((mode) => mode.isDefault)?.id
          ?? loadedModes[0]?.id
          ?? null
        setSelectedModeId(defaultModeId)
        if (!defaultModeId) {
          setIsLoading(false)
        }
      } catch (caughtError) {
        if (!controller.signal.aborted) {
          setError(caughtError instanceof Error ? caughtError.message : 'Unable to load map modes.')
          setIsLoading(false)
        }
      }
    }

    void loadModes()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (selectedModeId === null) {
      return
    }

    const modeId: string = selectedModeId

    const controller = new AbortController()

    async function loadContent() {
      setIsLoading(true)
      setError(null)

      try {
        const loadedContent = await getMapModeContent(
          modeId,
          showStandardMarkers,
          controller.signal,
        )
        setContent(loadedContent)
      } catch (caughtError) {
        if (!controller.signal.aborted) {
          setError(caughtError instanceof Error ? caughtError.message : 'Unable to load map content.')
          setContent(null)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadContent()
    return () => controller.abort()
  }, [selectedModeId, showStandardMarkers])

  function selectMode(id: string) {
    setSelectedModeId(id)
    setShowStandardMarkers(undefined)
  }

  const visibleItemsCount = (content?.areas.length ?? 0) + (content?.markers.length ?? 0)

  return (
    <main className="map-page">
      {error && <p className="page-error" role="alert">{error}</p>}
      <section className="map-layout">
        <aside className="map-filters">
          <span className="map-filters__label map-filters__label--first">MAP GROUPS</span>
          <div className="map-view-switch" role="tablist" aria-label="Map groups">
            {modes.map((mode) => (
              <button
                key={mode.id}
                className={mode.id === selectedModeId ? 'is-active' : undefined}
                type="button"
                role="tab"
                aria-selected={mode.id === selectedModeId}
                onClick={() => selectMode(mode.id)}
              >
                <span aria-hidden="true">MAP</span>
                {mode.name}
              </button>
            ))}
          </div>
          {content && (
            <>
              <div>
                <h2>{content.name}</h2>
                <p>{content.description ?? 'No description has been added yet.'}</p>
              </div>
              <label className="map-standard-toggle">
                <input
                  type="checkbox"
                  checked={content.showStandardMarkers}
                  onChange={(event) => setShowStandardMarkers(event.target.checked)}
                />
                <span>Standard markers</span>
              </label>
            </>
          )}
          <div className="map-filters__status">
            {isLoading
              ? 'Loading map data…'
              : content
                ? `${visibleItemsCount} visible map items`
                : modes.length === 0
                  ? 'No map modes are available'
                  : 'Choose a map mode'}
          </div>
        </aside>
        <section className="map-page__surface">
          <div className="map-page__caption">
            <b>{content?.name ?? 'SAN ANDREAS'}</b>
            <span>{content?.description ?? 'SELECT A MAP MODE'}</span>
          </div>
          <GtaMap markers={content?.markers ?? []} areas={content?.areas ?? []} />
        </section>
      </section>
    </main>
  )
}
