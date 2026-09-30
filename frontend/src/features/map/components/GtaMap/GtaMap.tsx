import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './GtaMap.css'
import type { GtaMapProps } from '../../types/GtaMapProps'
import { getMarkerCategoryColor, getMarkerCategoryIcon } from '../../constants/markerCategoryOptions'

export function GtaMap({
  markers,
  areas,
  onMapClick,
  editablePoints = [],
  editableMarker,
  onPointMove,
  onMarkerMove,
} : GtaMapProps) {
  const mapElementRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const areasLayerRef = useRef<L.LayerGroup | null>(null)
  const editorLayerRef = useRef<L.LayerGroup | null>(null)

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

    areasLayerRef.current = L.layerGroup().addTo(map)

    markersLayerRef.current = L.layerGroup().addTo(map)

    editorLayerRef.current = L.layerGroup().addTo(map)

    map.fitBounds(bounds, { padding: [18, 18] })
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markersLayerRef.current = null
      areasLayerRef.current = null
      editorLayerRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const handleClick = onMapClick

    if (!map || !handleClick) {
      return
    }

    function handleMapClick(event: L.LeafletMouseEvent) {
      handleClick?.({
        x: event.latlng.lng,
        y: -event.latlng.lat,
      })
    }

    map.on('click', handleMapClick)

    return () => {
      map.off('click', handleMapClick)
    }
  }, [onMapClick])

  useEffect(() => {
    const markersLayer = markersLayerRef.current

    if(!markersLayer){
      return
    }
    
    markersLayer.clearLayers();
    for(const marker of markers){
      const iconUrl = getMarkerCategoryIcon(marker.category);
      let leafletMarker
      if (iconUrl) {
        leafletMarker = L.marker([-marker.y, marker.x], {
            icon: L.icon({
              iconUrl,
              iconSize: [32, 32],
              iconAnchor: [16, 30],
              popupAnchor: [0, -30],
            }),
          })
      } else {
        leafletMarker = L.circleMarker([-marker.y, marker.x], {
            radius: 8,
            color: '#ffffff',
            weight: 2,
            fillColor: getMarkerCategoryColor(marker.category),
            fillOpacity: 1,
          })
      }
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

  useEffect(() => {
    const areasLayer = areasLayerRef.current

    if (!areasLayer) {
      return
    }

    areasLayer.clearLayers()

    for (const area of areas) {
      const positions: L.LatLngExpression[] = area.points.map(
        (point) => [-point.y, point.x],
      )

      const leafletArea = L.polygon(positions, {
        color: area.color,
        fillColor: area.color,
        weight: 2,
        fillOpacity: 0.25,
      })

      const popup = document.createElement('div')

      const title = document.createElement('strong')
      title.textContent = area.name
      popup.append(title)

      if (area.description !== null) {
        const description = document.createElement('p')
        description.textContent = area.description
        popup.append(description)
      }

      leafletArea.bindPopup(popup)
      leafletArea.addTo(areasLayer)
    }
  }, [areas])

  useEffect(() => {
    const editorLayer = editorLayerRef.current

    if (!editorLayer) {
      return
    }

    editorLayer.clearLayers()

    for (const point of editablePoints) {
      const vertex = L.marker([-point.y, point.x], {
        draggable: Boolean(onPointMove),
        icon: L.divIcon({
          className: 'gta-map__vertex-icon',
          html: `<span>${point.order + 1}</span>`,
          iconAnchor: [14, 14],
          iconSize: [28, 28],
        }),
        title: `Point ${point.order + 1}`,
      })

      if (onPointMove) {
        vertex.on('dragend', () => {
          const position = vertex.getLatLng()
          onPointMove(point.order, {
            x: position.lng,
            y: -position.lat,
          })
        })
      }

      vertex.addTo(editorLayer)
    }

    if (editableMarker) {
      const marker = L.marker([-editableMarker.y, editableMarker.x], {
        draggable: Boolean(onMarkerMove),
        icon: L.divIcon({
          className: 'gta-map__editor-marker-icon',
          html: '<span>●</span>',
          iconAnchor: [14, 14],
          iconSize: [28, 28],
        }),
        title: editableMarker.label,
      })

      if (onMarkerMove) {
        marker.on('dragend', () => {
          const position = marker.getLatLng()
          onMarkerMove({
            x: position.lng,
            y: -position.lat,
          })
        })
      }

      marker.addTo(editorLayer)
    }
  }, [editableMarker, editablePoints, onMarkerMove, onPointMove])

  return <div ref={mapElementRef} className="gta-map" />
}
