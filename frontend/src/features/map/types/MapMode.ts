import type { MapArea } from './MapArea'
import type { MapMarker } from './MapMarker'

export interface MapMode {
  id: string
  name: string
  description: string | null
  sortOrder: number
  isDefault: boolean
  isSystem: boolean
  showStandardMarkersByDefault: boolean
}

export interface MapModeContent {
  id: string
  name: string
  description: string | null
  showStandardMarkers: boolean
  areas: MapArea[]
  markers: MapMarker[]
}
