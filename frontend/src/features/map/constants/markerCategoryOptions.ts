import { MarkerCategory } from "../types/MarkerCategory"
const iconUrls = import.meta.glob<string>('../assets/icons/*.png' , {
  eager: true,
  import: 'default',
  query: '?url',
})

function getIconUrl(iconFile: string | undefined): string | undefined {
  if (iconFile === undefined) {
    return undefined
  }

  const iconUrl = iconUrls[`../assets/icons/${iconFile}`]

  if (iconUrl === undefined) {
    throw new Error(`Icon not found: ${iconFile}`)
  }

  return iconUrl
}

export const categoryOptions = [
  {
    value: MarkerCategory.Other,
    label: 'Other',
    color: '#6b7280',
    iconFile: undefined,
  },
  {
    value: MarkerCategory.Shop,
    label: 'Магазин 24/7',
    color: '#2563eb',
    iconFile: 'market.png',
  },
  {
    value: MarkerCategory.ServiceStation,
    label: 'Станція чіп-тюнінгу',
    color: '#f97316',
    iconFile: 'chip-tuning.png',
  },
  {
    value: MarkerCategory.Quest,
    label: 'Quests',
    color: '#a855f7',
    iconFile: 'quests.png',
  },
  {
    value: MarkerCategory.Gunshop,
    label: 'Магазин зброї',
    color: '#a855f7',
    iconFile: 'gunshop.png',
  },
  {
    value: MarkerCategory.Bar,
    label: 'Бар',
    color: '#a855f7',
    iconFile: 'bar.png',
  },
  {
    value: MarkerCategory.Barbershop,
    label: 'Перукарня',
    color: '#a855f7',
    iconFile: 'barbershop.png',
  },
  {
    value: MarkerCategory.Tatooshop,
    label: 'Тату Салон',
    color: '#a855f7',
    iconFile: 'tattoo.png',
  },
  {
    value: MarkerCategory.ClothingStore,
    label: 'Магазин Одягу',
    color: '#a855f7',
    iconFile: 'clothing-store.png',
  },
  {
    value: MarkerCategory.AZS,
    label: 'АЗС',
    color: '#a855f7',
    iconFile: 'AZS.png',
  },
  {
    value: MarkerCategory.LSV,
    label: 'LSV',
    color: '#a855f7',
    iconFile: 'LSV.png',
  },
  {
    value: MarkerCategory.BLS,
    label: 'BLS',
    color: '#a855f7',
    iconFile: 'BLS.png',
  },
  {
    value: MarkerCategory.MG,
    label: 'MG',
    color: '#a855f7',
    iconFile: 'MG.png',
  },
  {
    value: MarkerCategory.GSF,
    label: 'GSF',
    color: '#a855f7',
    iconFile: 'GSF.png',
  },
  {
    value: MarkerCategory.OM,
    label: 'OM',
    color: '#a855f7',
    iconFile: 'OM.png',
  },
  {
    value: MarkerCategory.CC,
    label: 'CC',
    color: '#a855f7',
    iconFile: 'CC.png',
  },
  {
    value: MarkerCategory.YAK,
    label: 'YAK',
    color: '#a855f7',
    iconFile: 'Yak.png',
  },
  {
    value: MarkerCategory.LCN,
    label: 'LCN',
    color: '#a855f7',
    iconFile: 'LCN.png',
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

  return getIconUrl(option?.iconFile)
}
