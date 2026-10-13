import { notifyAuthSessionExpired } from '../../auth/sessionEvents'

const mapAreaUrl = 'http://localhost:5114/api/MapAreas'

export async function deleteMapArea(id: string, token: string): Promise<void> {
  const response = await fetch(`${mapAreaUrl}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    if (response.status === 401) notifyAuthSessionExpired()
    throw new Error('Failed to delete an area.')
  }
}
