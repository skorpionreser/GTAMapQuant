// @vitest-environment jsdom

import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getMapMarkers } from '../api/mapMarkersApi'
import { MarkerCategory } from '../types/MarkerCategory'
import { useMapMarkers } from './useMapMarkers'

vi.mock('../api/mapMarkersApi', () => ({
  getMapMarkers: vi.fn(),
}))

const getMapMarkersMock = vi.mocked(getMapMarkers)

describe('useMapMarkers', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns loaded markers after a successful request', async () => {
    const markers = [
      {
        category: MarkerCategory.Shop,
        description: null,
        id: 'marker-id',
        name: 'Shop',
        x: 10,
        y: 20,
      },
    ]
    getMapMarkersMock.mockResolvedValue(markers)

    const { result } = renderHook(() => useMapMarkers())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.markers).toEqual(markers)
    expect(result.current.error).toBeNull()
  })

  it('returns an error when loading markers fails', async () => {
    getMapMarkersMock.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useMapMarkers())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).toBe('Failed to load map markers.')
    expect(result.current.markers).toEqual([])
  })

  it('does not return an error when the request is aborted', async () => {
    getMapMarkersMock.mockRejectedValue(new DOMException('Aborted', 'AbortError'))

    const { result } = renderHook(() => useMapMarkers())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).toBeNull()
  })
})
