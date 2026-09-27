// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MapMarkerAdminPage } from './MapMarkerAdminPage'

const apiMocks = vi.hoisted(() => ({
  createMapMarker: vi.fn(),
  deleteMapMarker: vi.fn(),
  getMapMarkers: vi.fn().mockResolvedValue([]),
  updateMapMarker: vi.fn(),
}))

vi.mock('../map/api/mapMarkersApi', () => ({
  getMapMarkers: apiMocks.getMapMarkers,
}))

vi.mock('./api/createMapMarker', () => ({
  createMapMarker: apiMocks.createMapMarker,
}))

vi.mock('./api/deleteMapMarker', () => ({
  deleteMapMarker: apiMocks.deleteMapMarker,
}))

vi.mock('./api/updateMapMarker', () => ({
  updateMapMarker: apiMocks.updateMapMarker,
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('MapMarkerAdminPage', () => {
  it('shows field errors and does not call the API when an empty form is submitted', () => {
    render(<MapMarkerAdminPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Create marker' }))

    expect(screen.getByText('Name is required.')).toBeTruthy()
    expect(screen.getByText('X must be a finite number.')).toBeTruthy()
    expect(screen.getByText('Y must be a finite number.')).toBeTruthy()
    expect(apiMocks.createMapMarker).not.toHaveBeenCalled()
  })
})
