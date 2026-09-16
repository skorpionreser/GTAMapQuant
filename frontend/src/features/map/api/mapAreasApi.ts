import type { MapArea } from "../types/MapArea";

const mapAreaUrl = 'http://localhost:5114/api/MapAreas'

export async function getMapAreas(signal?:AbortSignal) : Promise<MapArea[]> {
    const response = await fetch(mapAreaUrl, { signal })

    if (!response.ok) {
        throw new Error('Failed to load map areas.')
    }

    return response.json() as Promise<MapArea[]>
}