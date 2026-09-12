import { MarkerCategory } from "../types/MarkerCategory"

export const categoryOptions = [
  {
    value: MarkerCategory.Other,
    label: 'Other',
    color: '#6b7280',
  },
  {
    value: MarkerCategory.Shop,
    label: 'Markets',
    color: '#2563eb',
  },
  {
    value: MarkerCategory.ServiceStation,
    label: 'STO',
    color: '#f97316',
  },
  {
    value: MarkerCategory.Quest,
    label: 'Quests',
    color: '#a855f7',
  },
] as const

export function getMarkerCategoryColor(category: MarkerCategory): string {
    const option = categoryOptions.find(
        (categoryOption) => categoryOption.value === category,
    )

    return option?.color ?? '#6b7280'
}