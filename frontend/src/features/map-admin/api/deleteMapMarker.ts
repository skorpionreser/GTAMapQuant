const mapMarkerUrl = 'http://localhost:5114/api/MapMarkers'

export async function deleteMapMarker(id: string): Promise<void> {
  const response = await fetch(`${mapMarkerUrl}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete a marker')
  }
}
