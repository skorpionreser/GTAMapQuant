import type { MapAreaPointRequest } from './MapAreaRequest'

export interface MapAreaFormValues {
  name: string
  description: string
  color: string
  points: MapAreaPointRequest[]
}
