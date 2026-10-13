import { afterEach, describe, expect, it, vi } from 'vitest'
import { getMapModeContent, getMapModes } from './mapModesApi'

afterEach(() => vi.unstubAllGlobals())

describe('mapModesApi', () => {
  it('loads the available modes', async () => {
    const modes = [{ id: 'world', isDefault: true, name: 'World' }]
    const fetchMock = vi.fn().mockResolvedValue({ json: vi.fn().mockResolvedValue(modes), ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await expect(getMapModes()).resolves.toEqual(modes)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5114/api/MapModes', { signal: undefined })
  })

  it('loads content with an explicit standard-marker option', async () => {
    const content = { areas: [], id: 'zones', markers: [], name: 'Zones' }
    const fetchMock = vi.fn().mockResolvedValue({ json: vi.fn().mockResolvedValue(content), ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await expect(getMapModeContent('zones', false)).resolves.toEqual(content)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5114/api/MapModes/zones?showStandardMarkers=false',
      { signal: undefined },
    )
  })

  it('throws a useful error for a failed request', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    await expect(getMapModes()).rejects.toThrow('Failed to load map modes.')
  })
})
