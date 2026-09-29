// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../auth/AuthContext'
import { MapAreaAdminPage } from './MapAreaAdminPage'

const apiMocks = vi.hoisted(() => ({
  createMapArea: vi.fn(),
  deleteMapArea: vi.fn(),
  getMapAreas: vi.fn(),
  updateMapArea: vi.fn(),
}))

vi.mock('../map/api/mapAreasApi', () => ({
  getMapAreas: apiMocks.getMapAreas,
}))

vi.mock('./api/createMapArea', () => ({
  createMapArea: apiMocks.createMapArea,
}))

vi.mock('./api/deleteMapArea', () => ({
  deleteMapArea: apiMocks.deleteMapArea,
}))

vi.mock('./api/updateMapArea', () => ({
  updateMapArea: apiMocks.updateMapArea,
}))

vi.mock('../map/components/GtaMap/GtaMap', () => ({
  GtaMap: ({ onMapClick }: { onMapClick?: (coordinates: { x: number; y: number }) => void }) => (
    <button
      type="button"
      aria-label="Add map point"
      onClick={() => onMapClick?.({ x: 100.125, y: 200.875 })}
    >
      Map preview
    </button>
  ),
}))

const existingArea = {
  id: 'area-id',
  name: 'Existing zone',
  description: 'Existing description.',
  color: '#2563eb',
  points: [
    { id: 'point-1', x: 10, y: 10, order: 0 },
    { id: 'point-2', x: 20, y: 10, order: 1 },
    { id: 'point-3', x: 20, y: 20, order: 2 },
  ],
}

const testToken = 'test-token'
const scrollIntoViewMock = vi.fn()

beforeEach(() => {
  apiMocks.getMapAreas.mockResolvedValue([])
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: scrollIntoViewMock,
  })
  sessionStorage.setItem(
    'gtamapquant-auth-session',
    JSON.stringify({ login: 'test-admin', role: 'Admin', token: testToken }),
  )
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.unstubAllGlobals()
  sessionStorage.clear()
})

function renderAdminPage() {
  return render(
    <AuthProvider>
      <MapAreaAdminPage />
    </AuthProvider>,
  )
}

function addThreePoints() {
  const addPointButton = screen.getByRole('button', { name: 'Add map point' })
  fireEvent.click(addPointButton)
  fireEvent.click(addPointButton)
  fireEvent.click(addPointButton)
}

describe('MapAreaAdminPage', () => {
  it('shows validation errors without calling the API', () => {
    renderAdminPage()

    fireEvent.click(screen.getByRole('button', { name: 'Create zone' }))

    expect(screen.getByText('Name is required.')).toBeTruthy()
    expect(screen.getByText('Area must contain at least 3 points.')).toBeTruthy()
    expect(apiMocks.createMapArea).not.toHaveBeenCalled()
  })

  it('adds clicked points and creates a zone', async () => {
    const savedArea = { ...existingArea, id: 'new-area-id', name: 'New zone' }
    apiMocks.createMapArea.mockResolvedValue(savedArea)
    renderAdminPage()

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New zone' } })
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'New description' } })
    addThreePoints()

    expect(screen.getByText('3 points')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Create zone' }))

    await waitFor(() => expect(apiMocks.createMapArea).toHaveBeenCalledWith({
      name: 'New zone',
      description: 'New description',
      color: '#facc15',
      points: [
        { x: 100.13, y: 200.88, order: 0 },
        { x: 100.13, y: 200.88, order: 1 },
        { x: 100.13, y: 200.88, order: 2 },
      ],
    }, testToken))
    expect(screen.getByText('New zone')).toBeTruthy()
    expect(screen.getByText('0 points')).toBeTruthy()
  })

  it('edits an existing zone and can cancel edit mode', async () => {
    apiMocks.getMapAreas.mockResolvedValue([existingArea])
    apiMocks.updateMapArea.mockResolvedValue({ ...existingArea, name: 'Updated zone' })
    renderAdminPage()

    await screen.findByText('Existing zone')
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    expect(screen.getByRole('button', { name: 'Save changes' })).toBeTruthy()
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
    fireEvent.click(screen.getByRole('button', { name: 'Cancel edit' }))
    expect(screen.getByRole('button', { name: 'Create zone' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Updated zone' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))

    await waitFor(() => expect(apiMocks.updateMapArea).toHaveBeenCalledWith('area-id', {
      name: 'Updated zone',
      description: 'Existing description.',
      color: '#2563eb',
      points: [
        { x: 10, y: 10, order: 0 },
        { x: 20, y: 10, order: 1 },
        { x: 20, y: 20, order: 2 },
      ],
    }, testToken))
  })

  it('deletes a confirmed zone from the table', async () => {
    apiMocks.getMapAreas.mockResolvedValue([existingArea])
    apiMocks.deleteMapArea.mockResolvedValue(undefined)
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(true))
    renderAdminPage()

    await screen.findByText('Existing zone')
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

    await waitFor(() => expect(apiMocks.deleteMapArea).toHaveBeenCalledWith('area-id', testToken))
    expect(screen.queryByText('Existing zone')).toBeNull()
  })

  it('removes and clears points from the draft', () => {
    renderAdminPage()

    addThreePoints()
    fireEvent.click(screen.getByRole('button', { name: 'Remove point 2' }))
    expect(screen.getByText('2 points')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Clear points' }))
    expect(screen.getByText('0 points')).toBeTruthy()
  })

  it('shows errors when loading or saving an area fails', async () => {
    apiMocks.getMapAreas.mockRejectedValue(new Error('Unable to load areas.'))
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    renderAdminPage()

    expect(await screen.findByRole('alert').then((alert) => alert.textContent)).toBe(
      'Unable to load areas.',
    )

    apiMocks.createMapArea.mockRejectedValue(new Error('Unable to save area.'))
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New zone' } })
    addThreePoints()
    fireEvent.click(screen.getByRole('button', { name: 'Create zone' }))

    await waitFor(() =>
      expect(screen.getByRole('alert').textContent).toBe('Unable to save area.'),
    )
    consoleError.mockRestore()
  })
})
