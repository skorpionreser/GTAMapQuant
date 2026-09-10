import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './GtaMap.css'

export function GtaMap() {
  const mapElementRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) {
      return
    }

    const bounds = L.latLngBounds([-256, 0], [0, 256])

    const map = L.map(mapElementRef.current, {
      crs: L.CRS.Simple,
      attributionControl: false,
      minZoom: 0,
      maxZoom: 6,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      maxBounds: bounds.pad(0.15),
      maxBoundsViscosity: 0.85,
    })

    L.tileLayer('/gtamap/{z}/{x}/{y}.jpg', {
      minZoom: 0,
      maxNativeZoom: 5,
      maxZoom: 6,
      tileSize: 256,
      noWrap: true,
      bounds,
      className: 'world-tiles',
    }).addTo(map)

    map.fitBounds(bounds, { padding: [18, 18] })
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  return <div ref={mapElementRef} className="gta-map" />
}