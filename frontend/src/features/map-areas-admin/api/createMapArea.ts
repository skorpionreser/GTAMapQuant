import type { MapArea } from '../../map/types/MapArea'
import type { MapAreaRequest } from '../types/MapAreaRequest'

const mapAreaUrl = 'http://localhost:5114/api/MapAreas'

export async function createMapArea(
  request: MapAreaRequest,
  token: string,
): Promise<MapArea> {
  const response = await fetch(mapAreaUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('Failed to create an area.')
  }

  return response.json() as Promise<MapArea>
}
