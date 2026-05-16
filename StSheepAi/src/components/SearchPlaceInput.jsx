function SearchPlaceInput({ places, query, selectedPlaceId, onQueryChange, onSelectPlace }) {
  const normalizedQuery = query.trim().toLowerCase()
  const filteredPlaces = places.filter((place) => {
    const searchText = `${place.name} ${place.region}`.toLowerCase()
    return searchText.includes(normalizedQuery)
  })

  return (
    <section className="search-panel" aria-label="Select a place">
      <div className="field">
        <label htmlFor="place-search">Search places</label>
        <input
          id="place-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Try konoba, Riva, pizza..."
        />
      </div>

      <div className="place-list" role="list" aria-label="Matching places">
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => {
            const isSelected = place.id === selectedPlaceId

            return (
              <button
                className="place-option"
                type="button"
                key={place.id}
                aria-pressed={isSelected}
                onClick={() => onSelectPlace(place.id)}
              >
                <span>
                  <strong>{place.name}</strong>
                  <small>{place.region}</small>
                </span>
                <span className="rating-pill">{place.googleRating?.toFixed(1) ?? 'N/A'}</span>
              </button>
            )
          })
        ) : (
          <p className="empty-state">No mock places match that search.</p>
        )}
      </div>
    </section>
  )
}

export default SearchPlaceInput

