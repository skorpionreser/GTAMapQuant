import { afterEach, describe, expect, it, vi } from 'vitest'
import { createMapArea } from './createMapArea'
import { deleteMapArea } from './deleteMapArea'
import { updateMapArea } from './updateMapArea'

const request = {
  name: 'Test zone',
  description: 'A test area.',
  color: '#2563eb',
  points: [
    { x: 10, y: 10, order: 0 },
    { x: 20, y: 10, order: 1 },
    { x: 20, y: 20, order: 2 },
  ],
}

const area = { ...request, id: 'area-id' }
const token = 'test-token'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('map area mutation API', () => {
  it('creates an area with an authorized JSON POST request', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(area),
      ok: true,
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(createMapArea(request, token)).resolves.toEqual(area)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5114/api/MapAreas',
      expect.objectContaining({
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }),
    )
  })

  it('throws when area creation fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    await expect(createMapArea(request, token)).rejects.toThrow('Failed to create an area.')
  })

  it('updates an area with an authorized JSON PUT request', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(area),
      ok: true,
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(updateMapArea('area-id', request, token)).resolves.toEqual(area)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5114/api/MapAreas/area-id',
      expect.objectContaining({ method: 'PUT' }),
    )
  })

  it('throws when area update fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    await expect(updateMapArea('area-id', request, token)).rejects.toThrow('Failed to update an area.')
  })

  it('deletes an area with an authorized DELETE request', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await expect(deleteMapArea('area-id', token)).resolves.toBeUndefined()
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5114/api/MapAreas/area-id',
      {
        headers: { Authorization: `Bearer ${token}` },
        method: 'DELETE',
      },
    )
  })

  it('throws when area deletion fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    await expect(deleteMapArea('area-id', token)).rejects.toThrow('Failed to delete an area.')
  })
})
