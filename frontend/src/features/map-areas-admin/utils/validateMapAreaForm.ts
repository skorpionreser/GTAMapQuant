import type { MapAreaFormErrors } from '../types/MapAreaFormErrors'
import type { MapAreaFormValues } from '../types/MapAreaFormValues'

const hexColorPattern = /^#[0-9A-Fa-f]{6}$/

export function validateMapAreaForm(
  values: MapAreaFormValues,
): MapAreaFormErrors {
  const errors: MapAreaFormErrors = {}

  if (values.name.trim() === '') {
    errors.name = 'Name is required.'
  }

  if (!hexColorPattern.test(values.color)) {
    errors.color = 'Color must use the #RRGGBB format.'
  }

  if (values.points.length < 3) {
    errors.points = 'Area must contain at least 3 points.'
  }

  return errors
}
