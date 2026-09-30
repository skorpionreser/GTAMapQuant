import { type SubmitEvent, useEffect, useMemo, useRef, useState } from 'react'
import { GtaMap } from '../map/components/GtaMap/GtaMap'
import { categoryOptions } from '../map/constants/markerCategoryOptions'
import { MarkerCategory } from '../map/types/MarkerCategory'
import type { MarkerFormValues } from './types/MarkerFormValues'
import { createMapMarker } from './api/createMapMarker'
import { deleteMapMarker } from './api/deleteMapMarker'
import { updateMapMarker } from './api/updateMapMarker'
import type { CreateMapMarkerRequest } from './types/CreateMapMarkerRequest'
import { getMapMarkers } from '../map/api/mapMarkersApi'
import type { MapMarker } from '../map/types/MapMarker'
import '../admin/styles/AdminPage.css'
import { validateMarkerForm } from './utils/validateMarkerForm'
import type { MarkerFormErrors } from './types/MarkerFormErrors'
import { useAuth } from '../auth/useAuth'
import './MapMarkerAdminPage.css'

type TextField = 'name' | 'description' | 'x' | 'y'

const initialFormValues: MarkerFormValues = {
  name: '',
  description: '',
  category: MarkerCategory.Other,
  x: '',
  y: '',
}

export function MapMarkerAdminPage() {
  const { session } = useAuth()
  const token = session?.token
  const formSectionRef = useRef<HTMLElement>(null)
  const [formValues, setFormValues] = useState<MarkerFormValues>(initialFormValues)
  const [error, setError] = useState<string | null>(null)
  const [markers, setMarkers] = useState<MapMarker[]>([])
  const [editingMarkerId, setEditingMarkerId] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<MarkerFormErrors>({})

  const editableMarker = useMemo(() => {
    if (formValues.x.trim() === '' || formValues.y.trim() === '') {
      return undefined
    }

    const x = Number(formValues.x)
    const y = Number(formValues.y)

    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return undefined
    }

    return {
      x,
      y,
      label: formValues.name.trim() || 'Marker preview',
    }
  }, [formValues.name, formValues.x, formValues.y])

  useEffect(() => {
    async function loadMarkers() {
      const loadedMarkers = await getMapMarkers()
      setMarkers(loadedMarkers)
    }

    void loadMarkers()
  }, [])

    function clearValidationError(field: keyof MarkerFormErrors){
    setValidationErrors((currentErrors) => {
      const nextErrors= { ...currentErrors }

      delete nextErrors[field]

      return nextErrors
    })
  }

  function handleTextFieldChange(field: TextField, value: string) {
    if (field !== 'description') {
      clearValidationError(field)
    }
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))
  }

  function handleCategoryChange(category: MarkerCategory) {
    setFormValues((currentValues) => ({
      ...currentValues,
      category,
    }))
  }

  function updateCoordinates(coordinates: { x: number; y: number }) {
    clearValidationError('x')
    clearValidationError('y')
    setFormValues((currentValues) => ({
      ...currentValues,
      x: (Math.round(coordinates.x * 100) / 100).toString(),
      y: (Math.round(coordinates.y * 100) / 100).toString(),
    }))
  }

  function handleEdit(marker: MapMarker) {
    setFormValues({
      name: marker.name,
      description: marker.description ?? '',
      category: marker.category,
      x: marker.x.toString(),
      y: marker.y.toString(),
    })
    setEditingMarkerId(marker.id)
    setError(null)
    setValidationErrors({})
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleCancelEdit() {
    setFormValues(initialFormValues)
    setEditingMarkerId(null)
    setError(null)
    setValidationErrors({})
  }

  async function handleDelete(marker: MapMarker) {
    const isConfirmed = window.confirm(
      `Delete marker "${marker.name}"?`,
    )

    if (!isConfirmed) {
      return
    }

    setError(null)

    if (!token) {
      setError('Your session has expired. Sign in again.')
      return
    }

    try {
      await deleteMapMarker(marker.id, token)
      setMarkers((currentMarkers) =>
        currentMarkers.filter((currentMarker) => currentMarker.id !== marker.id),
      )

      if (editingMarkerId === marker.id) {
        handleCancelEdit()
      }
    } catch (caughtError) {
      if (caughtError instanceof Error) {
        setError(caughtError.message)
      } else {
        setError('Unexpected error occurred')
      }

      console.error(caughtError)
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!token) {
      setError('Your session has expired. Sign in again.')
      return
    }

    const errors = validateMarkerForm(formValues)
    setValidationErrors(errors)
    
    if (Object.keys(errors).length > 0) {
      return 
    }

    const request: CreateMapMarkerRequest = {
      name: formValues.name,
      description: formValues.description.trim() || null,
      category: formValues.category,
      x: Number(formValues.x),
      y: Number(formValues.y),
    }
    try {
      const savedMarker =
        editingMarkerId === null
          ? await createMapMarker(request, token)
          : await updateMapMarker(editingMarkerId, request, token)

      setMarkers((currentMarkers) =>
        editingMarkerId === null
          ? [...currentMarkers, savedMarker]
          : currentMarkers.map((marker) =>
              marker.id === savedMarker.id ? savedMarker : marker,
            ),
      )
      setFormValues(initialFormValues)
      setEditingMarkerId(null)
      setValidationErrors({})
    } catch (caughtError) {
      if (caughtError instanceof Error) {
        setError(caughtError.message)
      } else {
        setError('Unexpected error occurred')
      }
      console.error(caughtError)
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-page__intro">
        <div>
          <span className="page-eyebrow page-eyebrow--accent">MAP MANAGEMENT</span>
          <h1>Marker administration</h1>
          <p>Create, edit and maintain places visible on the world map.</p>
        </div>
        <span className="admin-page__count">{markers.length} markers</span>
      </section>

      {error && <p role="alert">{error}</p>}

      <section ref={formSectionRef} className="admin-card admin-form-card">
        <div className="admin-card__heading">
          <div>
            <span className="page-eyebrow">{editingMarkerId === null ? 'NEW MARKER' : 'EDIT MODE'}</span>
            <h2>{editingMarkerId === null ? 'Add a location' : 'Update location'}</h2>
          </div>
          {editingMarkerId !== null && <span className="admin-card__editing">Editing</span>}
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label className="admin-form__field" htmlFor="marker-name">
            <span>Name</span>
            <input
              id="marker-name"
              type="text"
              value={formValues.name}
              onChange={(event) =>
                handleTextFieldChange('name', event.target.value)
              }
              aria-invalid={Boolean(validationErrors.name)}
            />
            {validationErrors.name && (<span className='admin-form__error'>{validationErrors.name}</span>)}
          </label>

          <label className="admin-form__field admin-form__field--wide" htmlFor="marker-description">
            <span>Description</span>
            <textarea
              id="marker-description"
              value={formValues.description}
              onChange={(event) =>
                handleTextFieldChange('description', event.target.value)
              }
            />
          </label>

          <label className="admin-form__field" htmlFor="marker-category">
            <span>Category</span>
            <select
              id="marker-category"
              value={formValues.category}
              onChange={(event) =>
                handleCategoryChange(Number(event.target.value) as MarkerCategory)
              }
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-form__field" htmlFor="marker-x">
            <span>X coordinate</span>
            <input
              id="marker-x"
              type="number"
              value={formValues.x}
              onChange={(event) =>
                handleTextFieldChange('x', event.target.value)
              }
              aria-invalid={Boolean(validationErrors.x)}
            />
            {validationErrors.x && (<span className='admin-form__error'>{validationErrors.x}</span>)}
          </label>

          <label className="admin-form__field" htmlFor="marker-y">
            <span>Y coordinate</span>
            <input
              id="marker-y"
              type="number"
              value={formValues.y}
              onChange={(event) =>
                handleTextFieldChange('y', event.target.value)
              }
              aria-invalid={Boolean(validationErrors.y)}
            />
            {validationErrors.y && (<span className='admin-form__error'>{validationErrors.y}</span>)}
          </label>

          <div className="marker-editor">
            <div className="marker-editor__heading">
              <div>
                <span className="page-eyebrow">MARKER POSITION</span>
                <h3>Click the map or drag the marker</h3>
              </div>
              <span>
                {editableMarker
                  ? `${editableMarker.x}, ${editableMarker.y}`
                  : 'Choose a position on the map'}
              </span>
            </div>
            <div className="marker-editor__map">
              <GtaMap
                markers={[]}
                areas={[]}
                editableMarker={editableMarker}
                onMapClick={updateCoordinates}
                onMarkerMove={updateCoordinates}
              />
            </div>
          </div>

          <div className="admin-form__actions">
            <button className="button button--primary" type="submit">
              {editingMarkerId === null ? 'Create marker' : 'Save changes'}
            </button>
            {editingMarkerId !== null && (
              <button className="button button--secondary" type="button" onClick={handleCancelEdit}>
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-card admin-table-card">
        <div className="admin-card__heading">
          <div>
            <span className="page-eyebrow">DATABASE</span>
            <h2>All markers</h2>
          </div>
          <span className="admin-table-card__hint">Changes are saved immediately</span>
        </div>

        <div className="admin-table-card__scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Coordinates</th>
                <th>Description</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {markers.map((marker) => {
                const category = categoryOptions.find(
                  (option) => option.value === marker.category,
                )

                return (
                  <tr key={marker.id}>
                    <td><b>{marker.name}</b></td>
                    <td>{category?.label ?? 'Unknown'}</td>
                    <td className="admin-table-card__coordinates">{marker.x}, {marker.y}</td>
                    <td>{marker.description ?? '—'}</td>
                    <td className="admin-table-card__actions">
                      <button type="button" onClick={() => handleEdit(marker)}>
                        Edit
                      </button>
                      <button type="button" onClick={() => void handleDelete(marker)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
