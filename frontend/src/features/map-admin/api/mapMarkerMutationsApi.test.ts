import { afterEach, describe, expect, it, vi } from 'vitest'
import { createMapMarker } from './createMapMarker'
import { deleteMapMarker } from './deleteMapMarker'
import { updateMapMarker } from './updateMapMarker'
import { MarkerCategory } from '../../map/types/MarkerCategory'

const request = {
  category: MarkerCategory.Shop,
  description: 'Open all day',
  name: 'Shop',
  x: 10,
  y: 20,
}

const marker = { ...request, id: 'marker-id' }

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('map marker mutation API', () => {
  it('creates a marker with a JSON POST request', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(marker),
      ok: true,
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(createMapMarker(request)).resolves.toEqual(marker)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5114/api/MapMarkers',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('throws when marker creation fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    await expect(createMapMarker(request)).rejects.toThrow(
      'Failed to create a marker',
    )
  })

  it('updates a marker with a JSON PUT request', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(marker),
      ok: true,
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(updateMapMarker('marker-id', request)).resolves.toEqual(marker)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5114/api/MapMarkers/marker-id',
      expect.objectContaining({ method: 'PUT' }),
    )
  })

  it('throws when an updated marker cannot be found', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ json: vi.fn().mockResolvedValue(null), ok: true }),
    )

    await expect(updateMapMarker('marker-id', request)).rejects.toThrow(
      'Marker was not found',
    )
  })

  it('throws when marker update fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    await expect(updateMapMarker('marker-id', request)).rejects.toThrow(
      'Failed to update a marker',
    )
  })

  it('deletes a marker with a DELETE request', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await expect(deleteMapMarker('marker-id')).resolves.toBeUndefined()
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5114/api/MapMarkers/marker-id',
      { method: 'DELETE' },
    )
  })

  it('throws when marker deletion fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    await expect(deleteMapMarker('marker-id')).rejects.toThrow(
      'Failed to delete a marker',
    )
  })
})
