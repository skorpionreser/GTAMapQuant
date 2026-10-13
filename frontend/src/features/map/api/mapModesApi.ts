import type { MapMode, MapModeContent } from '../types/MapMode'

const mapModesUrl = 'http://localhost:5114/api/MapModes'

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error('Failed to load map modes.')
  }

  return response.json() as Promise<T>
}

export function getMapModes(signal?: AbortSignal): Promise<MapMode[]> {
  return getJson<MapMode[]>(mapModesUrl, signal)
}

export function getMapModeContent(
  id: string,
  showStandardMarkers?: boolean,
  signal?: AbortSignal,
): Promise<MapModeContent> {
  const url = new URL(`${mapModesUrl}/${id}`)

  if (showStandardMarkers !== undefined) {
    url.searchParams.set('showStandardMarkers', String(showStandardMarkers))
  }

  return getJson<MapModeContent>(url.toString(), signal)
}
