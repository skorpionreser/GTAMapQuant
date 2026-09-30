// @vitest-environment jsdom

import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GtaMap } from './GtaMap'
import { MarkerCategory } from '../../types/MarkerCategory'

const leafletMocks = vi.hoisted(() => {
  const createMarker = () => ({
    addTo: vi.fn(),
    bindPopup: vi.fn(),
    getLatLng: vi.fn(() => ({ lat: -45, lng: 120 })),
    on: vi.fn(),
  })

  return {
    circleMarker: vi.fn(createMarker),
    divIcon: vi.fn((options: object) => options),
    icon: vi.fn((options: object) => options),
    latLngBounds: vi.fn(() => ({ pad: vi.fn() })),
    layerGroup: vi.fn(() => {
      const layerGroup = {
        addTo: vi.fn(),
        clearLayers: vi.fn(),
      }
      layerGroup.addTo.mockReturnValue(layerGroup)
      return layerGroup
    }),
    map: vi.fn(() => ({
      fitBounds: vi.fn(),
      off: vi.fn(),
      on: vi.fn(),
      remove: vi.fn(),
    })),
    marker: vi.fn(createMarker),
    polygon: vi.fn(createMarker),
    tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
  }
})

vi.mock('leaflet', () => ({
  default: {
    CRS: { Simple: {} },
    ...leafletMocks,
  },
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('GtaMap', () => {
  it('uses an image marker when a category has an icon and a circle otherwise', () => {
    render(
      <GtaMap
        areas={[
          {
            id: 'area-id',
            name: 'Test area',
            description: 'Area description',
            color: '#2563eb',
            points: [
              { id: 'point-1', x: 5, y: 6, order: 1 },
              { id: 'point-2', x: 7, y: 8, order: 2 },
            ],
          },
        ]}
        markers={[
          {
            id: 'shop-id',
            name: 'Market',
            description: 'Market description',
            category: MarkerCategory.Shop,
            x: 10,
            y: 20,
          },
          {
            id: 'other-id',
            name: 'Other',
            description: null,
            category: MarkerCategory.Other,
            x: 30,
            y: 40,
          },
        ]}
      />,
    )

    expect(leafletMocks.icon).toHaveBeenCalledWith(
      expect.objectContaining({
        iconAnchor: [16, 30],
        iconSize: [32, 32],
        iconUrl: expect.stringContaining('market'),
        popupAnchor: [0, -30],
      }),
    )
    expect(leafletMocks.marker).toHaveBeenCalledWith(
      [-20, 10],
      expect.any(Object),
    )
    expect(leafletMocks.circleMarker).toHaveBeenCalledWith(
      [-40, 30],
      expect.objectContaining({ fillColor: '#6b7280' }),
    )
    expect(leafletMocks.polygon).toHaveBeenCalledWith(
      [
        [-6, 5],
        [-8, 7],
      ],
      expect.objectContaining({ color: '#2563eb' }),
    )
  })

  it('converts a Leaflet click into game-map coordinates', () => {
    const onMapClick = vi.fn()

    render(<GtaMap markers={[]} areas={[]} onMapClick={onMapClick} />)

    const map = leafletMocks.map.mock.results[0].value
    const clickHandler = map.on.mock.calls.find(
      ([eventName]: [string]) => eventName === 'click',
    )?.[1]

    clickHandler({ latlng: { lat: -45, lng: 120 } })

    expect(onMapClick).toHaveBeenCalledWith({ x: 120, y: 45 })
  })

  it('renders numbered editable vertices and reports drag coordinates', () => {
    const onPointMove = vi.fn()
    const onMarkerMove = vi.fn()

    render(
      <GtaMap
        markers={[]}
        areas={[]}
        editablePoints={[{ x: 10, y: 20, order: 0 }]}
        editableMarker={{ x: 30, y: 40, label: 'Editor marker' }}
        onPointMove={onPointMove}
        onMarkerMove={onMarkerMove}
      />,
    )

    expect(leafletMocks.divIcon).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'gta-map__vertex-icon',
        html: '<span>1</span>',
      }),
    )

    const vertex = leafletMocks.marker.mock.results[0].value
    const marker = leafletMocks.marker.mock.results[1].value
    const vertexDragHandler = vertex.on.mock.calls.find(
      ([eventName]: [string]) => eventName === 'dragend',
    )?.[1]
    const markerDragHandler = marker.on.mock.calls.find(
      ([eventName]: [string]) => eventName === 'dragend',
    )?.[1]

    vertexDragHandler()
    markerDragHandler()

    expect(onPointMove).toHaveBeenCalledWith(0, { x: 120, y: 45 })
    expect(onMarkerMove).toHaveBeenCalledWith({ x: 120, y: 45 })
  })
})
