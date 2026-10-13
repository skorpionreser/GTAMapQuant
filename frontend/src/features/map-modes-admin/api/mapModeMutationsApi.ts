import type { MapMode } from '../../map/types/MapMode'
import { notifyAuthSessionExpired } from '../../auth/sessionEvents'

export interface MapModeRequest {
  name: string
  description: string | null
  sortOrder: number
  isDefault: boolean
  showStandardMarkersByDefault: boolean
  mapAreaIds: string[]
  mapMarkerIds: string[]
}

const mapModesUrl = 'http://localhost:5114/api/MapModes'

async function sendRequest(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE',
  token: string,
  body?: MapModeRequest,
): Promise<MapMode> {
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (response.status === 401) {
    notifyAuthSessionExpired()
    throw new Error('Your session has expired. Sign in again.')
  }

  if (!response.ok) {
    throw new Error(await response.text() || 'Unable to save map mode.')
  }

  return response.json() as Promise<MapMode>
}

export function createMapMode(request: MapModeRequest, token: string): Promise<MapMode> {
  return sendRequest(mapModesUrl, 'POST', token, request)
}

export function updateMapMode(
  id: string,
  request: MapModeRequest,
  token: string,
): Promise<MapMode> {
  return sendRequest(`${mapModesUrl}/${id}`, 'PUT', token, request)
}

export function deleteMapMode(id: string, token: string): Promise<MapMode> {
  return sendRequest(`${mapModesUrl}/${id}`, 'DELETE', token)
}
