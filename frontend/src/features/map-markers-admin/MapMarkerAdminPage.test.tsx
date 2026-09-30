// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../auth/AuthContext'
import { MarkerCategory } from '../map/types/MarkerCategory'
import { MapMarkerAdminPage } from './MapMarkerAdminPage'

const apiMocks = vi.hoisted(() => ({
  createMapMarker: vi.fn(),
  deleteMapMarker: vi.fn(),
  getMapMarkers: vi.fn(),
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

vi.mock('../map/components/GtaMap/GtaMap', () => ({
  GtaMap: ({
    onMapClick,
    onMarkerMove,
  }: {
    onMapClick?: (coordinates: { x: number; y: number }) => void
    onMarkerMove?: (coordinates: { x: number; y: number }) => void
  }) => (
    <>
      <button
        type="button"
        aria-label="Choose marker position"
        onClick={() => onMapClick?.({ x: 123.456, y: 234.567 })}
      >
        Map preview
      </button>
      <button
        type="button"
        aria-label="Drag marker"
        onClick={() => onMarkerMove?.({ x: 42.424, y: 24.242 })}
      >
        Drag marker
      </button>
    </>
  ),
}))

const existingMarker = {
  category: MarkerCategory.Shop,
  description: 'Open all day',
  id: 'marker-id',
  name: 'Shop',
  x: 10,
  y: 20,
}

const testToken = 'test-token'
const scrollIntoViewMock = vi.fn()

beforeEach(() => {
  apiMocks.getMapMarkers.mockResolvedValue([])
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: scrollIntoViewMock,
  })
  scrollIntoViewMock.mockClear()
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
      <MapMarkerAdminPage />
    </AuthProvider>,
  )
}

function fillForm(name = 'New marker') {
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: name } })
  fireEvent.change(screen.getByLabelText('Description'), {
    target: { value: 'Description' },
  })
  fireEvent.change(screen.getByLabelText('X coordinate'), {
    target: { value: '123' },
  })
  fireEvent.change(screen.getByLabelText('Y coordinate'), {
    target: { value: '321' },
  })
}

describe('MapMarkerAdminPage', () => {
  it('shows field errors and does not call the API when an empty form is submitted', () => {
    renderAdminPage()

    fireEvent.click(screen.getByRole('button', { name: 'Create marker' }))

    expect(screen.getByText('Name is required.')).toBeTruthy()
    expect(screen.getByText('X must be a finite number.')).toBeTruthy()
    expect(screen.getByText('Y must be a finite number.')).toBeTruthy()
    expect(apiMocks.createMapMarker).not.toHaveBeenCalled()
  })

  it('writes selected and dragged map coordinates into the form', () => {
    renderAdminPage()

    fireEvent.click(screen.getByRole('button', { name: 'Choose marker position' }))
    expect((screen.getByLabelText('X coordinate') as HTMLInputElement).value).toBe('123.46')
    expect((screen.getByLabelText('Y coordinate') as HTMLInputElement).value).toBe('234.57')

    fireEvent.click(screen.getByRole('button', { name: 'Drag marker' }))
    expect((screen.getByLabelText('X coordinate') as HTMLInputElement).value).toBe('42.42')
    expect((screen.getByLabelText('Y coordinate') as HTMLInputElement).value).toBe('24.24')
  })

  it('creates a marker and adds it to the table', async () => {
    const savedMarker = {
      ...existingMarker,
      id: 'new-marker-id',
      name: 'New marker',
      x: 123,
      y: 321,
    }
    apiMocks.createMapMarker.mockResolvedValue(savedMarker)
    renderAdminPage()

    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Create marker' }))

    await waitFor(() =>
      expect(apiMocks.createMapMarker).toHaveBeenCalledWith({
        category: MarkerCategory.Other,
        description: 'Description',
        name: 'New marker',
        x: 123,
        y: 321,
      }, testToken),
    )
    expect(screen.getByText('New marker')).toBeTruthy()
    expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('')
  })

  it('edits an existing marker and can cancel edit mode', async () => {
    const updatedMarker = { ...existingMarker, name: 'Updated shop' }
    apiMocks.getMapMarkers.mockResolvedValue([existingMarker])
    apiMocks.updateMapMarker.mockResolvedValue(updatedMarker)
    renderAdminPage()

    await screen.findByText('Shop')
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    expect(screen.getByRole('button', { name: 'Save changes' })).toBeTruthy()
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
    fireEvent.click(screen.getByRole('button', { name: 'Cancel edit' }))
    expect(screen.getByRole('button', { name: 'Create marker' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Updated shop' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))

    await waitFor(() =>
      expect(apiMocks.updateMapMarker).toHaveBeenCalledWith('marker-id', {
        category: MarkerCategory.Shop,
        description: 'Open all day',
        name: 'Updated shop',
        x: 10,
        y: 20,
      }, testToken),
    )
    expect(screen.getByText('Updated shop')).toBeTruthy()
  })

  it('deletes a confirmed marker from the table', async () => {
    apiMocks.getMapMarkers.mockResolvedValue([existingMarker])
    apiMocks.deleteMapMarker.mockResolvedValue(undefined)
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(true))
    renderAdminPage()

    await screen.findByText('Shop')
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

    await waitFor(() =>
      expect(apiMocks.deleteMapMarker).toHaveBeenCalledWith('marker-id', testToken),
    )
    expect(screen.queryByText('Shop')).toBeNull()
  })

  it('shows an API error after a failed create request', async () => {
    apiMocks.createMapMarker.mockRejectedValue(new Error('Unable to save marker'))
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    renderAdminPage()

    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Create marker' }))

    expect(await screen.findByRole('alert').then((alert) => alert.textContent)).toBe(
      'Unable to save marker',
    )
  })
})
