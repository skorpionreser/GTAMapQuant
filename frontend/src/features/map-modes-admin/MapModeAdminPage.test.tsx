// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../auth/AuthContext'
import { MapModeAdminPage } from './MapModeAdminPage'

const apiMocks = vi.hoisted(() => ({
  createMapMode: vi.fn(), deleteMapMode: vi.fn(), getMapAreas: vi.fn(), getMapModeContent: vi.fn(),
  getMapModes: vi.fn(), getMapMarkers: vi.fn(), updateMapMode: vi.fn(),
}))

vi.mock('../map/api/mapAreasApi', () => ({ getMapAreas: apiMocks.getMapAreas }))
vi.mock('../map/api/mapMarkersApi', () => ({ getMapMarkers: apiMocks.getMapMarkers }))
vi.mock('../map/api/mapModesApi', () => ({
  getMapModeContent: apiMocks.getMapModeContent, getMapModes: apiMocks.getMapModes,
}))
vi.mock('./api/mapModeMutationsApi', () => ({
  createMapMode: apiMocks.createMapMode, deleteMapMode: apiMocks.deleteMapMode, updateMapMode: apiMocks.updateMapMode,
}))

const mode = {
  id: 'mode', name: 'World', description: 'Everything', sortOrder: 0, isDefault: true,
  isSystem: false, showStandardMarkersByDefault: true,
}
const area = { id: 'area', name: 'Central zone', color: '#ffffff', description: null, points: [] }
const marker = { id: 'marker', name: 'Shop', category: 1, description: null, isStandard: true, x: 1, y: 2 }
const request = {
  name: 'New mode', description: 'For events', sortOrder: 2, isDefault: false,
  showStandardMarkersByDefault: false, mapAreaIds: ['area'], mapMarkerIds: ['marker'],
}

beforeEach(() => {
  apiMocks.getMapModes.mockResolvedValue([mode])
  apiMocks.getMapAreas.mockResolvedValue([area])
  apiMocks.getMapMarkers.mockResolvedValue([marker])
  apiMocks.getMapModeContent.mockResolvedValue({ ...mode, areas: [area], markers: [marker], showStandardMarkers: true })
  sessionStorage.setItem('gtamapquant-auth-session', JSON.stringify({ login: 'admin', role: 'Admin', token: 'token' }))
  Object.defineProperty(window, 'scrollTo', { configurable: true, value: vi.fn() })
})

afterEach(() => {
  cleanup()
  sessionStorage.clear()
  vi.clearAllMocks()
  vi.unstubAllGlobals()
})

function renderPage() {
  return render(<AuthProvider><MapModeAdminPage /></AuthProvider>)
}

function fillForm() {
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: request.name } })
  fireEvent.change(screen.getByLabelText('Description'), { target: { value: request.description } })
  fireEvent.change(screen.getByLabelText('Display order'), { target: { value: String(request.sortOrder) } })
  fireEvent.click(screen.getByLabelText('Central zone'))
  fireEvent.click(screen.getByLabelText('Shop'))
}

describe('MapModeAdminPage', () => {
  it('loads modes, areas and markers, then creates a map mode with assignments', async () => {
    apiMocks.createMapMode.mockResolvedValue({ ...mode, ...request, id: 'new' })
    renderPage()
    await screen.findByText('World')

    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Create mode' }))

    await waitFor(() => expect(apiMocks.createMapMode).toHaveBeenCalledWith(request, 'token'))
    expect(screen.getByRole('status').textContent).toBe('Map mode created.')
  })

  it('loads assignments into the form and saves an edited mode', async () => {
    apiMocks.updateMapMode.mockResolvedValue({ ...mode, name: 'Updated World' })
    renderPage()
    await screen.findByText('World')

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    await screen.findByRole('button', { name: 'Save changes' })
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Updated World' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))

    await waitFor(() => expect(apiMocks.updateMapMode).toHaveBeenCalledWith('mode', {
      ...request, name: 'Updated World', description: 'Everything', sortOrder: 0,
      isDefault: true, showStandardMarkersByDefault: true,
    }, 'token'))
  })

  it('deletes after confirmation and protects system modes', async () => {
    apiMocks.deleteMapMode.mockResolvedValue(undefined)
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(true))
    renderPage()
    await screen.findByText('World')
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    await waitFor(() => expect(apiMocks.deleteMapMode).toHaveBeenCalledWith('mode', 'token'))

    apiMocks.getMapModes.mockResolvedValue([{ ...mode, isSystem: true }])
    renderPage()
    const buttons = await screen.findAllByRole('button', { name: 'Delete' })
    expect(buttons.at(-1)?.hasAttribute('disabled')).toBe(true)
  })

  it('shows validation and loading errors', async () => {
    apiMocks.getMapModes.mockRejectedValueOnce(new Error('Cannot load modes'))
    renderPage()
    expect((await screen.findByRole('alert')).textContent).toBe('Cannot load modes')

    cleanup()
    apiMocks.getMapModes.mockResolvedValueOnce([])
    renderPage()
    await waitFor(() => expect(screen.getByRole('button', { name: 'Create mode' })).toBeTruthy())
    fireEvent.click(screen.getByRole('button', { name: 'Create mode' }))
    expect(screen.getByRole('alert').textContent).toBe('Name is required.')
  })
})
