import type { MapArea } from "./MapArea"
import type { MapMarker } from "./MapMarker"

export interface GtaMapProps{
  markers: MapMarker[]
  areas: MapArea[]
}