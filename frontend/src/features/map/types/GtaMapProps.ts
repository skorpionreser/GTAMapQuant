import type { MapArea } from "./MapArea"
import type { MapMarker } from "./MapMarker"

export interface MapCoordinates {
  x: number
  y: number
}

export interface EditableMapPoint extends MapCoordinates {
  order: number
}

export interface EditableMapMarker extends MapCoordinates {
  label: string
}

export interface GtaMapProps{
  markers: MapMarker[]
  areas: MapArea[]
  onMapClick?: (coordinates: MapCoordinates) => void
  editablePoints?: EditableMapPoint[]
  editableMarker?: EditableMapMarker
  onPointMove?: (order: number, coordinates: MapCoordinates) => void
  onMarkerMove?: (coordinates: MapCoordinates) => void
}
