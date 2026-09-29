import { describe, expect, it } from 'vitest'
import { validateMapAreaForm } from './validateMapAreaForm'

const validValues = {
  name: 'Test zone',
  description: '',
  color: '#2563eb',
  points: [
    { x: 10, y: 10, order: 0 },
    { x: 20, y: 10, order: 1 },
    { x: 20, y: 20, order: 2 },
  ],
}

describe('validateMapAreaForm', () => {
  it('returns no errors for a valid zone', () => {
    expect(validateMapAreaForm(validValues)).toEqual({})
  })

  it('requires a name and at least three points', () => {
    expect(validateMapAreaForm({ ...validValues, name: ' ', points: [] })).toEqual({
      name: 'Name is required.',
      points: 'Area must contain at least 3 points.',
    })
  })

  it('requires a hexadecimal color', () => {
    expect(validateMapAreaForm({ ...validValues, color: 'blue' })).toEqual({
      color: 'Color must use the #RRGGBB format.',
    })
  })
})
