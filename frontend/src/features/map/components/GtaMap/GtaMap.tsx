import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './GtaMap.css'
import type { MarkersMap } from '../../types/MarkersMap'
import { getMarkerCategoryColor } from '../../constants/markerCategoryOptions'

export function GtaMap({ markers } : MarkersMap) {
  const mapElementRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) {
      return
    }

    const bounds = L.latLngBounds([-256, 0], [0, 256])

    const map = L.map(mapElementRef.current, {
      crs: L.CRS.Simple,
      attributionControl: false,
      minZoom: 0,
      maxZoom: 8,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      maxBounds: bounds.pad(0.15),
      maxBoundsViscosity: 0.85,
    })

    L.tileLayer('/gtamap/{z}/{x}/{y}.png', {
      minZoom: 0,
      maxNativeZoom: 7,
      maxZoom: 8,
      tileSize: 256,
      noWrap: true,
      bounds,
      className: 'world-tiles',
    }).addTo(map)

    markersLayerRef.current = L.layerGroup().addTo(map)

    map.fitBounds(bounds, { padding: [18, 18] })
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markersLayerRef.current = null
    }
  }, [])

  useEffect(() => {
    const markersLayer = markersLayerRef.current

    if(!markersLayer){
      return
    }
    
    markersLayer.clearLayers();
    for(const marker of markers){
      const leafletMarker  = L.circleMarker([-marker.y, marker.x], {
        radius: 8,
        color: '#ffffff',
        weight: 2,
        fillColor: getMarkerCategoryColor(marker.category),
        fillOpacity: 1,
      })

      const popup = document.createElement('div')

      const title = document.createElement('strong')
      title.textContent = marker.name
      popup.append(title)

      if(marker.description !== null){
        const description = document.createElement('p')
        description.textContent = marker.description
        popup.append(description)
      }

      leafletMarker.bindPopup(popup)
      leafletMarker.addTo(markersLayer)
    }

  }, [markers])

  return <div ref={mapElementRef} className="gta-map" />
}