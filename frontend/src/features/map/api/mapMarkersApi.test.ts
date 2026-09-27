import { afterEach, describe, expect, it, vi } from 'vitest'
import { getMapMarkers } from './mapMarkersApi'

describe('getMapMarkers', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns markers when the API responds successfully', async () => {
    const markers = [{ id: 'marker-id', name: 'Shop' }]
    const response = {
      json: vi.fn().mockResolvedValue(markers),
      ok: true,
    }
    const fetchMock = vi.fn().mockResolvedValue(response)
    const controller = new AbortController()
    vi.stubGlobal('fetch', fetchMock)

    const result = await getMapMarkers(controller.signal)

    expect(result).toEqual(markers)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5114/api/MapMarkers',
      { signal: controller.signal },
    )
  })

  it('throws an error when the API response is unsuccessful', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    await expect(getMapMarkers()).rejects.toThrow('Failed to load map markers.')
  })
})
