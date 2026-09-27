// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MapPage } from './MapPage'
import { categoryOptions } from './constants/markerCategoryOptions'
import { useMapAreas } from './hooks/useMapAreas'
import { useMapMarkers } from './hooks/useMapMarkers'
import { MarkerCategory } from './types/MarkerCategory'

vi.mock('./components/GtaMap/GtaMap', () => ({
  GtaMap: ({ markers }: { markers: { id: string }[] }) => (
    <div data-testid="map">Markers on map: {markers.length}</div>
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
  it('shows all categories by default and filters markers when a category is unchecked', () => {
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
    useMapAreasMock.mockReturnValue({ areas: [], error: null, isLoading: false })

    render(<MapPage />)

    expect(screen.getByText('Visible markers: 2')).not.toBeNull()
    expect(screen.getByTestId('map').textContent).toBe('Markers on map: 2')

    const shopOption = categoryOptions.find(
      (option) => option.value === MarkerCategory.Shop,
    )
    fireEvent.click(screen.getByRole('checkbox', { name: shopOption?.label }))

    expect(screen.getByText('Visible markers: 1')).not.toBeNull()
    expect(screen.getByTestId('map').textContent).toBe('Markers on map: 1')

    fireEvent.click(screen.getByRole('checkbox', { name: shopOption?.label }))

    expect(screen.getByText('Visible markers: 2')).not.toBeNull()
  })

  it('shows loading states and errors from both data sources', () => {
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

    expect(screen.getByText('Loading markers...')).not.toBeNull()
    expect(screen.getByText('Loading map areas...')).not.toBeNull()
    expect(screen.getAllByRole('alert')).toHaveLength(2)
  })
})
