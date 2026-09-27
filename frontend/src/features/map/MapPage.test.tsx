// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MapPage } from './MapPage'
import { useMapAreas } from './hooks/useMapAreas'
import { useMapMarkers } from './hooks/useMapMarkers'
import { MarkerCategory } from './types/MarkerCategory'

vi.mock('./components/GtaMap/GtaMap', () => ({
  GtaMap: ({
    areas,
    markers,
  }: {
    areas: { id: string }[]
    markers: { id: string }[]
  }) => (
    <div data-testid="map">
      Markers: {markers.length}; Areas: {areas.length}
    </div>
  ),
}))

vi.mock('./hooks/useMapMarkers', () => ({
  useMapMarkers: vi.fn(),
}))

vi.mock('./hooks/useMapAreas', () => ({
  useMapAreas: vi.fn(),
}))

const useMapMarkersMock = vi.mocked(useMapMarkers)
const useMapAreasMock = vi.mocked(useMapAreas)

describe('MapPage', () => {
  it('shows markers in the world view and areas in the zones view', () => {
    useMapMarkersMock.mockReturnValue({
      error: null,
      isLoading: false,
      markers: [
        {
          category: MarkerCategory.Shop,
          description: null,
          id: 'shop-id',
          name: 'Shop',
          x: 10,
          y: 20,
        },
        {
          category: MarkerCategory.Quest,
          description: null,
          id: 'quest-id',
          name: 'Quest',
          x: 30,
          y: 40,
        },
      ],
    })
    useMapAreasMock.mockReturnValue({
      areas: [
        {
          color: '#2563eb',
          description: null,
          id: 'area-id',
          name: 'Test area',
          points: [],
        },
      ],
      error: null,
      isLoading: false,
    })

    render(<MapPage />)

    expect(screen.getByTestId('map').textContent).toBe('Markers: 2; Areas: 0')

    fireEvent.click(screen.getByRole('tab', { name: /game zones/i }))

    expect(screen.getByTestId('map').textContent).toBe('Markers: 0; Areas: 1')
  })

  it('shows a loading state and an error from map data requests', () => {
    useMapMarkersMock.mockReturnValue({
      error: 'Failed to load map markers.',
      isLoading: true,
      markers: [],
    })
    useMapAreasMock.mockReturnValue({
      areas: [],
      error: 'Failed to load map areas.',
      isLoading: true,
    })

    render(<MapPage />)

    expect(screen.getByText('Loading map data…')).not.toBeNull()
    expect(screen.getByRole('alert').textContent).toBe(
      'Failed to load map markers.',
    )
  })
})
