import { MarkerCategory } from "../types/MarkerCategory"
import autoserviceIcon from '../assets/icons/autoservice.png'
import marketIcon from '../assets/icons/market.png'
import questsIcon from '../assets/icons/quests.png'


export const categoryOptions = [
  {
    value: MarkerCategory.Other,
    label: 'Other',
    color: '#6b7280',
    icon: undefined,
  },
  {
    value: MarkerCategory.Shop,
    label: 'Markets',
    color: '#2563eb',
    icon: marketIcon,
  },
  {
    value: MarkerCategory.ServiceStation,
    label: 'STO',
    color: '#f97316',
    icon: autoserviceIcon,
  },
  {
    value: MarkerCategory.Quest,
    label: 'Quests',
    color: '#a855f7',
    icon: questsIcon,
  },
] as const

export function getMarkerCategoryColor(category: MarkerCategory): string {
    const option = categoryOptions.find(
        (categoryOption) => categoryOption.value === category,)

    return option?.color ?? '#6b7280'
}

export function getMarkerCategoryIcon(
  category: MarkerCategory,
): string | undefined {
  const option = categoryOptions.find(
    (categoryOption) => categoryOption.value === category,
  )

  return option?.icon
}
