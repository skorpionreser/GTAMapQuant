import { describe, expect, it } from 'vitest'
import { MarkerCategory } from '../../map/types/MarkerCategory'
import type { MarkerFormValues } from '../types/MarkerFormValues'
import { validateMarkerForm } from './validateMarkerForm'

const validFormValues: MarkerFormValues = {
  name: '24/7 Store',
  description: '',
  category: MarkerCategory.Shop,
  x: '123.5',
  y: '-42',
}

describe('validateMarkerForm', () => {
  it('returns no errors for valid form values', () => {
    expect(validateMarkerForm(validFormValues)).toEqual({})
  })

  it('returns an error when name contains only whitespace', () => {
    expect(validateMarkerForm({ ...validFormValues, name: '   ' })).toEqual({
      name: 'Name is required.',
    })
  })

  it('returns an error when X is empty', () => {
    expect(validateMarkerForm({ ...validFormValues, x: '' })).toEqual({
      x: 'X must be a finite number.',
    })
  })

  it('returns an error when X is not a number', () => {
    expect(validateMarkerForm({ ...validFormValues, x: 'north' })).toEqual({
      x: 'X must be a finite number.',
    })
  })

  it('returns an error when Y is empty', () => {
    expect(validateMarkerForm({ ...validFormValues, y: '' })).toEqual({
      y: 'Y must be a finite number.',
    })
  })

  it('returns an error when Y is not finite', () => {
    expect(validateMarkerForm({ ...validFormValues, y: 'Infinity' })).toEqual({
      y: 'Y must be a finite number.',
    })
  })
})
