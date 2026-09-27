// @vitest-environment jsdom

import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getMapAreas } from '../api/mapAreasApi'
import { useMapAreas } from './useMapAreas'

vi.mock('../api/mapAreasApi', () => ({
  getMapAreas: vi.fn(),
}))

const getMapAreasMock = vi.mocked(getMapAreas)

describe('useMapAreas', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns loaded areas after a successful request', async () => {
    const areas = [
      {
        color: '#2563eb',
        description: null,
        id: 'area-id',
        name: 'Test area',
        points: [],
      },
    ]
    getMapAreasMock.mockResolvedValue(areas)

    const { result } = renderHook(() => useMapAreas())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.areas).toEqual(areas)
    expect(result.current.error).toBeNull()
  })

  it('returns an error when loading areas fails', async () => {
    getMapAreasMock.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useMapAreas())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).toBe('Failed to load map areas.')
    expect(result.current.areas).toEqual([])
  })

  it('does not return an error when the request is aborted', async () => {
    getMapAreasMock.mockRejectedValue(new DOMException('Aborted', 'AbortError'))

    const { result } = renderHook(() => useMapAreas())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).toBeNull()
  })
})
