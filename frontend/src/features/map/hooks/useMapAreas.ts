import { useEffect, useState } from 'react'
import { getMapAreas } from '../api/mapAreasApi'
import type { MapArea } from '../types/MapArea'

export function useMapAreas() {
  const [areas, setAreas] = useState<MapArea[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    let isActive = true

    async function loadAreas() {
      try {
        const loadedAreas = await getMapAreas(controller.signal)

        if (isActive) {
          setAreas(loadedAreas)
        }
      } catch (error) {
        if (
          isActive &&
          !(error instanceof DOMException && error.name === 'AbortError')
        ) {
          setError('Failed to load map areas.')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadAreas()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [])

  return { areas, error, isLoading }
}
