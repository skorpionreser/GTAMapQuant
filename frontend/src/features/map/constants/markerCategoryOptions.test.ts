import { describe, expect, it } from 'vitest'
import {
  getMarkerCategoryColor,
  getMarkerCategoryIcon,
} from './markerCategoryOptions'
import { MarkerCategory } from '../types/MarkerCategory'

describe('markerCategoryOptions', () => {
  it('returns the matching icon for categories that have one', () => {
    expect(getMarkerCategoryIcon(MarkerCategory.Shop)).toContain('market')
    expect(getMarkerCategoryIcon(MarkerCategory.ServiceStation)).toContain(
      'autoservice',
    )
    expect(getMarkerCategoryIcon(MarkerCategory.Quest)).toContain('quests')
  })

  it('returns no icon and a fallback color for Other', () => {
    expect(getMarkerCategoryIcon(MarkerCategory.Other)).toBeUndefined()
    expect(getMarkerCategoryColor(MarkerCategory.Other)).toBe('#6b7280')
  })

  it('returns fallback values for an unknown category', () => {
    const unknownCategory = 999 as MarkerCategory

    expect(getMarkerCategoryIcon(unknownCategory)).toBeUndefined()
    expect(getMarkerCategoryColor(unknownCategory)).toBe('#6b7280')
  })
})
