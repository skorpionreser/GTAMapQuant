import type { CreateMapMarkerRequest } from '../types/CreateMapMarkerRequest'
import type { MapMarker } from '../../map/types/MapMarker'

const mapMarkerUrl = 'http://localhost:5114/api/MapMarkers'

export async function createMapMarker(
  request: CreateMapMarkerRequest,
  token: string,
): Promise<MapMarker> {
  const response = await fetch(mapMarkerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('Failed to create a marker')
  }

  return response.json() as Promise<MapMarker>
}
