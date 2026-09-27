import { afterEach, describe, expect, it, vi } from 'vitest'
import { getMapAreas } from './mapAreasApi'

describe('getMapAreas', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns areas when the API responds successfully', async () => {
    const areas = [{ id: 'area-id', name: 'Test area' }]
    const response = {
      json: vi.fn().mockResolvedValue(areas),
      ok: true,
    }
    const fetchMock = vi.fn().mockResolvedValue(response)
    const controller = new AbortController()
    vi.stubGlobal('fetch', fetchMock)

    const result = await getMapAreas(controller.signal)

    expect(result).toEqual(areas)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5114/api/MapAreas',
      { signal: controller.signal },
    )
  })

  it('throws an error when the API response is unsuccessful', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    await expect(getMapAreas()).rejects.toThrow('Failed to load map areas.')
  })
})
