import { useState } from 'react'
import { GtaMap } from './components/GtaMap/GtaMap'
import { useMapMarkers } from './hooks/useMapMarkers'
import './MapPage.css'
import { MarkerCategory } from './types/MarkerCategory'
import { categoryOptions } from './constants/markerCategoryOptions'

export function MapPage() {
  const { markers, error, isLoading } = useMapMarkers()

  const [selectedCategories, setSelectedCategories] = useState<MarkerCategory[]>([
    MarkerCategory.Other,
    MarkerCategory.Shop,
    MarkerCategory.ServiceStation,
    MarkerCategory.Quest,
  ])

  const filteredMarkers = markers.filter((marker) =>
    selectedCategories.includes(marker.category),
  )

  function toggleCategory(category: MarkerCategory) {
    setSelectedCategories((currentCategories) => {
      if (currentCategories.includes(category)) {
        return currentCategories.filter(
          (currentCategory) => currentCategory !== category,
        )
      }

      return [...currentCategories, category]
    })
  }

  return (
    <main className="app">
      <header className="app__header">
        <h1>GTA V Map</h1>
        <p>Map markers: {markers.length}</p>
        <p>Visible markers: {filteredMarkers.length}</p>

        {isLoading && <p>Loading markers...</p>}

        {error && (
          <p className="app__error" role="alert">
            {error}
          </p>
        )}
        <div className="map-filters">
          {categoryOptions.map((option) => (
            <label className="map-filters__item" key={option.value}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(option.value)}
                onChange={() => toggleCategory(option.value)}
              />
              <span
                className="map-filters__color"
                style={{ backgroundColor: option.color }}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </header>

      <section className="app__map">
        <GtaMap markers={filteredMarkers} />
      </section>
    </main>
  )
}
