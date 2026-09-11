import { useEffect, useState } from 'react'
import { getMapMarkers } from '../api/mapMarkersApi'
import type { MapMarker } from '../types/MapMarker'

export function useMapMarkers() {
  const [markers, setMarkers] = useState<MapMarker[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    let isActive = true

    async function loadMarkers() {
      try {
        const loadedMarkers = await getMapMarkers(controller.signal)

        if (isActive) {
          setMarkers(loadedMarkers)
        }
      } catch (error) {
        if (
          isActive &&
          !(error instanceof DOMException && error.name === 'AbortError')
        ) {
          setError('Failed to load map markers.')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadMarkers()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [])

  return { markers, error, isLoading }
}
