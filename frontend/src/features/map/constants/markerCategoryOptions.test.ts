import { describe, expect, it } from 'vitest'
import {
  categoryOptions,
  getMarkerCategoryColor,
  getMarkerCategoryIcon,
} from './markerCategoryOptions'
import { MarkerCategory } from '../types/MarkerCategory'

describe('markerCategoryOptions', () => {
  it('has one option for every marker category', () => {
    const categoryValues = Object.values(MarkerCategory)
    const configuredValues = categoryOptions.map((option) => option.value)

    expect(categoryOptions).toHaveLength(categoryValues.length)
    expect(new Set(configuredValues).size).toBe(categoryValues.length)
  })

  it('returns an existing icon for every category except Other', () => {
    for (const option of categoryOptions) {
      const iconUrl = getMarkerCategoryIcon(option.value)

      if (option.value === MarkerCategory.Other) {
        expect(iconUrl).toBeUndefined()
        continue
      }

      expect(option.iconFile).toBeDefined()
      expect(iconUrl).toContain(option.iconFile)
    }
  })

  it('returns fallback values for an unknown category', () => {
    const unknownCategory = 999 as MarkerCategory

    expect(getMarkerCategoryIcon(unknownCategory)).toBeUndefined()
    expect(getMarkerCategoryColor(unknownCategory)).toBe('#6b7280')
  })
})
