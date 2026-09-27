import type { CreateMapMarkerRequest } from '../types/CreateMapMarkerRequest'
import type { MapMarker } from '../../map/types/MapMarker'

const mapMarkerUrl = 'http://localhost:5114/api/MapMarkers'

export async function updateMapMarker(
  id: string,
  request: CreateMapMarkerRequest,
): Promise<MapMarker> {
  const response = await fetch(`${mapMarkerUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('Failed to update a marker')
  }

  const updatedMarker = (await response.json()) as MapMarker | null

  if (updatedMarker === null) {
    throw new Error('Marker was not found')
  }

  return updatedMarker
}
