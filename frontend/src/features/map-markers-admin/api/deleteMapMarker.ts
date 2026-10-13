import { notifyAuthSessionExpired } from '../../auth/sessionEvents'

const mapMarkerUrl = 'http://localhost:5114/api/MapMarkers'

export async function deleteMapMarker(id: string, token: string): Promise<void> {
  const response = await fetch(`${mapMarkerUrl}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    if (response.status === 401) notifyAuthSessionExpired()
    throw new Error('Failed to delete a marker')
  }
}
