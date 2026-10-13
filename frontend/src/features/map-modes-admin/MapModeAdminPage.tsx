import { type SubmitEvent, useEffect, useState } from 'react'
import { getMapAreas } from '../map/api/mapAreasApi'
import { getMapModeContent, getMapModes } from '../map/api/mapModesApi'
import { getMapMarkers } from '../map/api/mapMarkersApi'
import type { MapArea } from '../map/types/MapArea'
import type { MapMarker } from '../map/types/MapMarker'
import type { MapMode } from '../map/types/MapMode'
import { useAuth } from '../auth/useAuth'
import '../admin/styles/AdminPage.css'
import { createMapMode, deleteMapMode, type MapModeRequest, updateMapMode } from './api/mapModeMutationsApi'
import './MapModeAdminPage.css'

interface FormValues {
  name: string
  description: string
  sortOrder: string
  isDefault: boolean
  showStandardMarkersByDefault: boolean
  mapAreaIds: string[]
  mapMarkerIds: string[]
}

const initialFormValues: FormValues = {
  name: '', description: '', sortOrder: '0', isDefault: false,
  showStandardMarkersByDefault: false, mapAreaIds: [], mapMarkerIds: [],
}

export function MapModeAdminPage() {
  const { session } = useAuth()
  const [modes, setModes] = useState<MapMode[]>([])
  const [areas, setAreas] = useState<MapArea[]>([])
  const [markers, setMarkers] = useState<MapMarker[]>([])
  const [form, setForm] = useState<FormValues>(initialFormValues)
  const [editingMode, setEditingMode] = useState<MapMode | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  async function loadData() {
    try {
      const [loadedModes, loadedAreas, loadedMarkers] = await Promise.all([
        getMapModes(), getMapAreas(), getMapMarkers(),
      ])
      setModes(loadedModes)
      setAreas(loadedAreas)
      setMarkers(loadedMarkers)
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load administration data.')
    }
  }

  useEffect(() => {
    let isActive = true

    void Promise.all([getMapModes(), getMapAreas(), getMapMarkers()])
      .then(([loadedModes, loadedAreas, loadedMarkers]) => {
        if (!isActive) return

        setModes(loadedModes)
        setAreas(loadedAreas)
        setMarkers(loadedMarkers)
      })
      .catch((caughtError: unknown) => {
        if (!isActive) return

        setError(caughtError instanceof Error ? caughtError.message : 'Unable to load administration data.')
      })

    return () => { isActive = false }
  }, [])

  function toggleId(field: 'mapAreaIds' | 'mapMarkerIds', id: string) {
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(id)
        ? current[field].filter((currentId) => currentId !== id)
        : [...current[field], id],
    }))
  }

  async function startEdit(mode: MapMode) {
    if (mode.isSystem) {
      setError('System map modes are protected and cannot be edited.')
      return
    }

    try {
      const content = await getMapModeContent(mode.id, false)
      setEditingMode(mode)
      setForm({
        name: mode.name,
        description: mode.description ?? '',
        sortOrder: String(mode.sortOrder),
        isDefault: mode.isDefault,
        showStandardMarkersByDefault: mode.showStandardMarkersByDefault,
        mapAreaIds: content.areas.map((area) => area.id),
        mapMarkerIds: content.markers.map((marker) => marker.id),
      })
      setError(null)
      setNotice(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load map mode.')
    }
  }

  function resetForm() {
    setEditingMode(null)
    setForm(initialFormValues)
    setError(null)
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!session) { setError('Your session has expired. Sign in again.'); return }
    if (!form.name.trim()) { setError('Name is required.'); return }

    const request: MapModeRequest = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      sortOrder: Number(form.sortOrder),
      isDefault: form.isDefault,
      showStandardMarkersByDefault: form.showStandardMarkersByDefault,
      mapAreaIds: form.mapAreaIds,
      mapMarkerIds: form.mapMarkerIds,
    }

    try {
      await (editingMode
        ? await updateMapMode(editingMode.id, request, session.token)
        : createMapMode(request, session.token))
      setNotice(editingMode ? 'Map mode updated.' : 'Map mode created.')
      resetForm()
      await loadData()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to save map mode.')
    }
  }

  async function handleDelete(mode: MapMode) {
    if (mode.isSystem) { setError('System map modes are protected and cannot be deleted.'); return }
    if (!session) { setError('Your session has expired. Sign in again.'); return }
    if (!window.confirm(`Delete map mode "${mode.name}"? This cannot be undone.`)) return

    try {
      await deleteMapMode(mode.id, session.token)
      setModes((current) => current.filter((item) => item.id !== mode.id))
      setNotice('Map mode deleted.')
      if (editingMode?.id === mode.id) resetForm()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to delete map mode.')
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-page__intro"><div><span className="page-eyebrow page-eyebrow--accent">MAP MANAGEMENT</span><h1>Map modes</h1><p>Configure the groups visitors can choose on the map.</p></div><span className="admin-page__count">{modes.length} modes</span></section>
      {error && <p role="alert" className="admin-feedback admin-feedback--error">{error}</p>}
      {notice && <p role="status" className="admin-feedback">{notice}</p>}
      <section className="admin-card admin-form-card">
        <div className="admin-card__heading"><div><span className="page-eyebrow">{editingMode ? 'EDIT MODE' : 'NEW MODE'}</span><h2>{editingMode ? `Edit ${editingMode.name}` : 'Create map mode'}</h2></div></div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label className="admin-form__field"><span>Name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
          <label className="admin-form__field admin-form__field--wide"><span>Description</span><textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
          <label className="admin-form__field"><span>Display order</span><input type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: event.target.value })} /></label>
          <label className="mode-checkbox"><input type="checkbox" checked={form.isDefault} onChange={(event) => setForm({ ...form, isDefault: event.target.checked })} />Default map mode</label>
          <label className="mode-checkbox"><input type="checkbox" checked={form.showStandardMarkersByDefault} onChange={(event) => setForm({ ...form, showStandardMarkersByDefault: event.target.checked })} />Show standard markers by default</label>
          <fieldset className="mode-selector"><legend>Zones</legend>{areas.map((area) => <label key={area.id}><input type="checkbox" checked={form.mapAreaIds.includes(area.id)} onChange={() => toggleId('mapAreaIds', area.id)} />{area.name}</label>)}</fieldset>
          <fieldset className="mode-selector"><legend>Markers</legend>{markers.map((marker) => <label key={marker.id}><input type="checkbox" checked={form.mapMarkerIds.includes(marker.id)} onChange={() => toggleId('mapMarkerIds', marker.id)} />{marker.name}</label>)}</fieldset>
          <div className="admin-form__actions"><button className="button button--primary" type="submit">{editingMode ? 'Save changes' : 'Create mode'}</button>{editingMode && <button className="button button--secondary" type="button" onClick={resetForm}>Cancel edit</button>}</div>
        </form>
      </section>
      <section className="admin-card admin-table-card"><div className="admin-card__heading"><div><span className="page-eyebrow">DATABASE</span><h2>Available map modes</h2></div></div><div className="admin-table-card__scroll"><table><thead><tr><th>Name</th><th>Description</th><th>Order</th><th>Default</th><th aria-label="Actions" /></tr></thead><tbody>{modes.map((mode) => <tr key={mode.id}><td><b>{mode.name}</b>{mode.isSystem && <small className="mode-system">System</small>}</td><td>{mode.description ?? '—'}</td><td>{mode.sortOrder}</td><td>{mode.isDefault ? 'Yes' : 'No'}</td><td className="admin-table-card__actions"><button type="button" disabled={mode.isSystem} onClick={() => void startEdit(mode)}>Edit</button><button type="button" disabled={mode.isSystem} onClick={() => void handleDelete(mode)}>Delete</button></td></tr>)}</tbody></table></div></section>
    </main>
  )
}
