// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DynamicMapPage } from './DynamicMapPage'

const apiMocks = vi.hoisted(() => ({ getMapModeContent: vi.fn(), getMapModes: vi.fn() }))

vi.mock('./api/mapModesApi', () => apiMocks)
vi.mock('./components/GtaMap/GtaMap', () => ({
  GtaMap: ({ areas, markers }: { areas: { id: string }[]; markers: { id: string }[] }) => (
    <div data-testid="map">{areas.length} areas; {markers.length} markers</div>
  ),
}))

const world = {
  id: 'world', name: 'World map', description: 'Default map', sortOrder: 0,
  isDefault: true, isSystem: true, showStandardMarkersByDefault: true,
}
const zones = { ...world, id: 'zones', isDefault: false, name: 'Zones' }
const worldContent = {
  id: 'world', name: 'World map', description: 'Default map', showStandardMarkers: true,
  areas: [], markers: [{ id: 'marker' }],
}

beforeEach(() => {
  apiMocks.getMapModes.mockResolvedValue([world, zones])
  apiMocks.getMapModeContent.mockImplementation((id: string, showStandardMarkers?: boolean) =>
    Promise.resolve({ ...worldContent, id, name: id === 'zones' ? 'Zones' : 'World map', showStandardMarkers: showStandardMarkers ?? true }),
  )
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('DynamicMapPage', () => {
  it('loads the default mode, its description and map content', async () => {
    render(<DynamicMapPage />)

    expect(await screen.findByRole('heading', { name: 'World map' })).toBeTruthy()
    expect(screen.getAllByText('Default map')).not.toHaveLength(0)
    expect(screen.getByTestId('map').textContent).toBe('0 areas; 1 markers')
    expect(apiMocks.getMapModeContent).toHaveBeenCalledWith('world', undefined, expect.any(AbortSignal))
  })

  it('switches modes and reloads content when standard markers change', async () => {
    render(<DynamicMapPage />)
    await screen.findByRole('heading', { name: 'World map' })

    fireEvent.click(screen.getByRole('tab', { name: /zones/i }))
    await screen.findByRole('heading', { name: 'Zones' })
    fireEvent.click(screen.getByLabelText('Standard markers'))

    await waitFor(() => expect(apiMocks.getMapModeContent).toHaveBeenLastCalledWith(
      'zones', false, expect.any(AbortSignal),
    ))
  })

  it('shows a loading error and the empty state', async () => {
    apiMocks.getMapModes.mockRejectedValueOnce(new Error('Service unavailable'))
    render(<DynamicMapPage />)
    expect((await screen.findByRole('alert')).textContent).toBe('Service unavailable')

    apiMocks.getMapModes.mockResolvedValueOnce([])
    render(<DynamicMapPage />)
    expect(await screen.findByText('No map modes are available')).toBeTruthy()
  })
})
