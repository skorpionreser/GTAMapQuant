import type { MapAreaPoint } from "./MapAreaPoint";

export interface MapArea{
    id: string
    name: string
    description: string | null
    color: string
    points: MapAreaPoint[]
}