export interface MapAreaPointRequest {
  x: number
  y: number
  order: number
}

export interface MapAreaRequest {
  name: string
  description: string | null
  color: string
  points: MapAreaPointRequest[]
}
