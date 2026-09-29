import { type SubmitEvent, useEffect, useMemo, useRef, useState } from 'react'
import { GtaMap } from '../map/components/GtaMap/GtaMap'
import { getMapAreas } from '../map/api/mapAreasApi'
import type { MapArea } from '../map/types/MapArea'
import { useAuth } from '../auth/useAuth'
import '../admin/styles/AdminPage.css'
import './MapAreaAdminPage.css'
import { createMapArea } from './api/createMapArea'
import { deleteMapArea } from './api/deleteMapArea'
import { updateMapArea } from './api/updateMapArea'
import type { MapAreaFormErrors } from './types/MapAreaFormErrors'
import type { MapAreaFormValues } from './types/MapAreaFormValues'
import type { MapAreaRequest } from './types/MapAreaRequest'
import { validateMapAreaForm } from './utils/validateMapAreaForm'

const initialFormValues: MapAreaFormValues = {
  name: '',
  description: '',
  color: '#facc15',
  points: [],
}

export function MapAreaAdminPage() {
  const { session } = useAuth()
  const token = session?.token
  const formSectionRef = useRef<HTMLElement>(null)
  const [areas, setAreas] = useState<MapArea[]>([])
  const [formValues, setFormValues] = useState<MapAreaFormValues>(initialFormValues)
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<MapAreaFormErrors>({})
  const [error, setError] = useState<string | null>(null)

  const previewAreas = useMemo<MapArea[]>(() => {
    if (formValues.points.length === 0) {
      return []
    }

    return [{
      id: 'area-preview',
      name: formValues.name || 'Zone preview',
      description: formValues.description.trim() || null,
      color: formValues.color,
      points: formValues.points.map((point) => ({
        ...point,
        id: `preview-point-${point.order}`,
      })),
    }]
  }, [formValues])

  useEffect(() => {
    async function loadAreas() {
      try {
        setAreas(await getMapAreas())
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Unable to load areas.',
        )
      }
    }

    void loadAreas()
  }, [])

  function clearValidationError(field: keyof MapAreaFormErrors) {
    setValidationErrors((currentErrors) => {
      const nextErrors = { ...currentErrors }
      delete nextErrors[field]
      return nextErrors
    })
  }

  function handleTextChange(
    field: 'name' | 'description' | 'color',
    value: string,
  ) {
    if (field !== 'description') {
      clearValidationError(field)
    }

    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))
  }

  function handleMapClick(coordinates: { x: number; y: number }) {
    clearValidationError('points')
    setFormValues((currentValues) => ({
      ...currentValues,
      points: [
        ...currentValues.points,
        {
          x: Math.round(coordinates.x * 100) / 100,
          y: Math.round(coordinates.y * 100) / 100,
          order: currentValues.points.length,
        },
      ],
    }))
  }

  function removePoint(order: number) {
    clearValidationError('points')
    setFormValues((currentValues) => ({
      ...currentValues,
      points: currentValues.points
        .filter((point) => point.order !== order)
        .map((point, index) => ({ ...point, order: index })),
    }))
  }

  function clearPoints() {
    clearValidationError('points')
    setFormValues((currentValues) => ({ ...currentValues, points: [] }))
  }

  function resetForm() {
    setFormValues(initialFormValues)
    setEditingAreaId(null)
    setValidationErrors({})
    setError(null)
  }

  function handleEdit(area: MapArea) {
    setFormValues({
      name: area.name,
      description: area.description ?? '',
      color: area.color,
      points: area.points
        .slice()
        .sort((firstPoint, secondPoint) => firstPoint.order - secondPoint.order)
        .map((point, index) => ({
          x: point.x,
          y: point.y,
          order: index,
        })),
    })
    setEditingAreaId(area.id)
    setValidationErrors({})
    setError(null)
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function handleDelete(area: MapArea) {
    if (!window.confirm(`Delete area "${area.name}"?`)) {
      return
    }

    if (!token) {
      setError('Your session has expired. Sign in again.')
      return
    }

    setError(null)

    try {
      await deleteMapArea(area.id, token)
      setAreas((currentAreas) =>
        currentAreas.filter((currentArea) => currentArea.id !== area.id),
      )

      if (editingAreaId === area.id) {
        resetForm()
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to delete area.',
      )
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!token) {
      setError('Your session has expired. Sign in again.')
      return
    }

    const errors = validateMapAreaForm(formValues)
    setValidationErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    const request: MapAreaRequest = {
      name: formValues.name.trim(),
      description: formValues.description.trim() || null,
      color: formValues.color,
      points: formValues.points,
    }

    try {
      const savedArea = editingAreaId === null
        ? await createMapArea(request, token)
        : await updateMapArea(editingAreaId, request, token)

      setAreas((currentAreas) => editingAreaId === null
        ? [...currentAreas, savedArea]
        : currentAreas.map((area) =>
          area.id === savedArea.id ? savedArea : area,
        ))
      resetForm()
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to save area.',
      )
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-page__intro">
        <div>
          <span className="page-eyebrow page-eyebrow--accent">ZONE MANAGEMENT</span>
          <h1>Game zone administration</h1>
          <p>Create territories and define their borders directly on the map.</p>
        </div>
        <span className="admin-page__count">{areas.length} zones</span>
      </section>

      {error && <p role="alert">{error}</p>}

      <section ref={formSectionRef} className="admin-card admin-form-card">
        <div className="admin-card__heading">
          <div>
            <span className="page-eyebrow">
              {editingAreaId === null ? 'NEW ZONE' : 'EDIT MODE'}
            </span>
            <h2>{editingAreaId === null ? 'Add a game zone' : 'Update game zone'}</h2>
          </div>
          {editingAreaId !== null && <span className="admin-card__editing">Editing</span>}
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label className="admin-form__field" htmlFor="area-name">
            <span>Name</span>
            <input
              id="area-name"
              type="text"
              value={formValues.name}
              onChange={(event) => handleTextChange('name', event.target.value)}
              aria-invalid={Boolean(validationErrors.name)}
            />
            {validationErrors.name && <span className="admin-form__error">{validationErrors.name}</span>}
          </label>

          <label className="admin-form__field admin-form__field--wide" htmlFor="area-description">
            <span>Description</span>
            <textarea
              id="area-description"
              value={formValues.description}
              onChange={(event) => handleTextChange('description', event.target.value)}
            />
          </label>

          <label className="admin-form__field" htmlFor="area-color">
            <span>Zone color</span>
            <input
              id="area-color"
              type="color"
              value={formValues.color}
              onChange={(event) => handleTextChange('color', event.target.value)}
              aria-invalid={Boolean(validationErrors.color)}
            />
            {validationErrors.color && <span className="admin-form__error">{validationErrors.color}</span>}
          </label>

          <div className="area-editor">
            <div className="area-editor__heading">
              <div>
                <span className="page-eyebrow">ZONE BORDER</span>
                <h3>Click the map to add points</h3>
              </div>
              <button className="button button--secondary" type="button" onClick={clearPoints}>
                Clear points
              </button>
            </div>

            <div className="area-editor__map">
              <GtaMap markers={[]} areas={previewAreas} onMapClick={handleMapClick} />
            </div>

            <div className="area-editor__points">
              <div>
                <b>{formValues.points.length} points</b>
                <span>At least 3 points are required to save a zone.</span>
              </div>
              {validationErrors.points && <span className="admin-form__error">{validationErrors.points}</span>}
              <ol>
                {formValues.points.map((point) => (
                  <li key={point.order}>
                    <span>#{point.order + 1}: {point.x}, {point.y}</span>
                    <button
                      type="button"
                      aria-label={`Remove point ${point.order + 1}`}
                      onClick={() => removePoint(point.order)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="admin-form__actions">
            <button className="button button--primary" type="submit">
              {editingAreaId === null ? 'Create zone' : 'Save changes'}
            </button>
            {editingAreaId !== null && (
              <button className="button button--secondary" type="button" onClick={resetForm}>
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
            <h2>All game zones</h2>
          </div>
          <span className="admin-table-card__hint">Changes are saved immediately</span>
        </div>

        <div className="admin-table-card__scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Color</th>
                <th>Points</th>
                <th>Description</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => (
                <tr key={area.id}>
                  <td><b>{area.name}</b></td>
                  <td>
                    <span className="area-color-swatch" style={{ backgroundColor: area.color }} />
                    {area.color}
                  </td>
                  <td className="admin-table-card__coordinates">{area.points.length}</td>
                  <td>{area.description ?? '—'}</td>
                  <td className="admin-table-card__actions">
                    <button type="button" onClick={() => handleEdit(area)}>Edit</button>
                    <button type="button" onClick={() => void handleDelete(area)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
