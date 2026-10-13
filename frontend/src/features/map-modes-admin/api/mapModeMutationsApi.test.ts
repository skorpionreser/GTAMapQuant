import { afterEach, describe, expect, it, vi } from 'vitest'
import { createMapMode, deleteMapMode, updateMapMode } from './mapModeMutationsApi'

const request = {
  name: 'Zones', description: 'Areas only', sortOrder: 1, isDefault: false,
  showStandardMarkersByDefault: false, mapAreaIds: ['area'], mapMarkerIds: ['marker'],
}
const mode = { ...request, id: 'mode', isSystem: false }

afterEach(() => vi.unstubAllGlobals())

describe('map mode mutation API', () => {
  it.each([
    ['createMapMode', () => createMapMode(request, 'token'), 'POST', 'http://localhost:5114/api/MapModes'],
    ['updateMapMode', () => updateMapMode('mode', request, 'token'), 'PUT', 'http://localhost:5114/api/MapModes/mode'],
    ['deleteMapMode', () => deleteMapMode('mode', 'token'), 'DELETE', 'http://localhost:5114/api/MapModes/mode'],
  ])('%s sends an authorized request', async (_name, invoke, method, url) => {
    const fetchMock = vi.fn().mockResolvedValue({ json: vi.fn().mockResolvedValue(mode), ok: true, status: 200 })
    vi.stubGlobal('fetch', fetchMock)

    await expect(invoke()).resolves.toEqual(mode)
    expect(fetchMock).toHaveBeenCalledWith(url, expect.objectContaining({
      headers: { Authorization: 'Bearer token', 'Content-Type': 'application/json' }, method,
    }))
  })

  it('reports an expired session', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401 }))
    await expect(createMapMode(request, 'token')).rejects.toThrow('Your session has expired. Sign in again.')
  })
})
