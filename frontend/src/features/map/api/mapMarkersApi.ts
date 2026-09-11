import type { MapMarker } from "../types/MapMarker";

const mapMarkerUrl = 'http://localhost:5114/api/MapMarkers'

export async function getMapMarkers(signal?:AbortSignal) : Promise<MapMarker[]> {
    const response = await fetch(mapMarkerUrl, { signal })

    if (!response.ok) {
        throw new Error('Failed to load map markers.')
    }

    return response.json() as Promise<MapMarker[]>
}