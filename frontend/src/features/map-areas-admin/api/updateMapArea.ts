import type { MapArea } from '../../map/types/MapArea'
import type { MapAreaRequest } from '../types/MapAreaRequest'

const mapAreaUrl = 'http://localhost:5114/api/MapAreas'

export async function updateMapArea(
  id: string,
  request: MapAreaRequest,
  token: string,
): Promise<MapArea> {
  const response = await fetch(`${mapAreaUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('Failed to update an area.')
  }

  return response.json() as Promise<MapArea>
}
