import { useMemo, useState } from 'react'
import PlaceTrustCard from '../components/PlaceTrustCard'
import ReviewCategoryBreakdown from '../components/ReviewCategoryBreakdown'
import { samplePlaces } from '../data/samplePlaces'
import { analyzePlaceReviews } from '../lib/analyzePlaceReviews'

function ReviewAnalyzerPage() {
  const [mockQuery, setMockQuery] = useState('')
  const [googleQuery, setGoogleQuery] = useState('')
  const [selectedPlace, setSelectedPlace] = useState(samplePlaces[0])
  const [googlePlaces, setGooglePlaces] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isFindingNearby, setIsFindingNearby] = useState(false)
  const [isLoadingReviews, setIsLoadingReviews] = useState(false)
  const [googleError, setGoogleError] = useState('')
  const analysis = useMemo(() => analyzePlaceReviews(selectedPlace), [selectedPlace])
  const filteredMockPlaces = samplePlaces.filter((place) => {
    const searchText = `${place.name} ${place.region}`.toLowerCase()
    return searchText.includes(mockQuery.trim().toLowerCase())
  })

  async function handleGoogleSearch(event) {
    event.preventDefault()

    if (!googleQuery.trim()) {
      setGoogleError('Type the restaurant name first.')
      return
    }

    setIsSearching(true)
    setGoogleError('')
    setGooglePlaces([])

    try {
      const response = await fetch(
        `/api/places/search?query=${encodeURIComponent(googleQuery.trim())}`,
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Could not search Google Places.')
      }

      setGooglePlaces(data.places ?? [])

      if (!data.places?.length) {
        setGoogleError('No Google places matched that search. Try adding Split or the street name.')
      }
    } catch (error) {
      setGoogleError(error.message)
    } finally {
      setIsSearching(false)
    }
  }

  function handleNearbySearch() {
    if (!navigator.geolocation) {
      setGoogleError('Location search is not supported in this browser.')
      return
    }

    setIsFindingNearby(true)
    setGoogleError('')
    setGooglePlaces([])

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const params = new URLSearchParams({
            lat: String(position.coords.latitude),
            lng: String(position.coords.longitude),
            radius: '700',
          })
          const response = await fetch(`/api/places/nearby?${params.toString()}`)
          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Could not find nearby restaurants.')
          }

          setGooglePlaces(data.places ?? [])

          if (!data.places?.length) {
            setGoogleError('No nearby restaurants were returned. Try name search instead.')
          }
        } catch (error) {
          setGoogleError(error.message)
        } finally {
          setIsFindingNearby(false)
        }
      },
      () => {
        setGoogleError('Location permission was denied. You can still search by name.')
        setIsFindingNearby(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  async function handleSelectGooglePlace(placeId) {
    setIsLoadingReviews(true)
    setGoogleError('')

    try {
      const response = await fetch(`/api/places/${encodeURIComponent(placeId)}/reviews`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Could not load Google review snippets.')
      }

      if (!data.reviews?.length) {
        throw new Error('Google did not return review text for this place.')
      }

      setSelectedPlace(data)
    } catch (error) {
      setGoogleError(error.message)
    } finally {
      setIsLoadingReviews(false)
    }
  }

  return (
    <section className="feature-page">
      <div className="feature-intro">
        <p className="eyebrow">Review Intelligence</p>
        <h1>Know what reviews really warn tourists about</h1>
        <p>
          Search a mock Split place and see what the review text suggests about food,
          value, service, hidden charges, and tourist-friendly trust.
        </p>
      </div>

      <div className="review-layout">
        <section className="search-panel modern-search" aria-label="Find a restaurant">
          <form className="google-search-form" onSubmit={handleGoogleSearch}>
            <div className="field">
              <label htmlFor="google-place-search">Search exact restaurant</label>
              <input
                id="google-place-search"
                type="search"
                value={googleQuery}
                onChange={(event) => setGoogleQuery(event.target.value)}
                placeholder="Example: Bokeria Split"
              />
            </div>
            <button type="submit" className="primary-button wide" disabled={isSearching}>
              {isSearching ? 'Searching Google...' : 'Search Google reviews'}
            </button>
          </form>

          <button
            type="button"
            className="secondary-button wide nearby-button"
            onClick={handleNearbySearch}
            disabled={isFindingNearby}
          >
            {isFindingNearby ? 'Finding nearby restaurants...' : 'Use my location nearby'}
          </button>

          <p className="helper-copy">
            Search by exact restaurant name, or allow location access to list restaurants near
            you and analyze one of them.
          </p>

          {googleError ? <p className="form-error">{googleError}</p> : null}

          {googlePlaces.length > 0 ? (
            <div className="place-list" aria-label="Google place results">
              {googlePlaces.map((place) => (
                <button
                  className="place-option"
                  type="button"
                  key={place.id}
                  onClick={() => handleSelectGooglePlace(place.id)}
                  disabled={isLoadingReviews}
                >
                  <span>
                    <strong>{place.name}</strong>
                    <small>{place.address}</small>
                  </span>
                  <span className="rating-pill">{place.googleRating?.toFixed(1) ?? 'N/A'}</span>
                </button>
              ))}
            </div>
          ) : null}

          <div className="mock-divider">
            <span>Demo data fallback</span>
          </div>

          <div className="field">
            <label htmlFor="mock-place-search">Search mocked places</label>
            <input
              id="mock-place-search"
              type="search"
              value={mockQuery}
              onChange={(event) => setMockQuery(event.target.value)}
              placeholder="Try Riva, pizza, local..."
            />
          </div>

          <div className="place-list" role="list" aria-label="Mock places">
            {filteredMockPlaces.map((place) => (
              <button
                className="place-option"
                type="button"
                key={place.id}
                aria-pressed={selectedPlace.id === place.id}
                onClick={() => setSelectedPlace(place)}
              >
                <span>
                  <strong>{place.name}</strong>
                  <small>{place.region}</small>
                </span>
                <span className="rating-pill">{place.googleRating?.toFixed(1) ?? 'N/A'}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="analysis-layout">
          {isLoadingReviews ? (
            <section className="loading-strip">
              <span className="pulse-dot" />
              Loading Google review snippets...
            </section>
          ) : null}
          <PlaceTrustCard place={selectedPlace} analysis={analysis} />
          <ReviewCategoryBreakdown categoryCounts={analysis.categoryCounts} />
        </div>
      </div>
    </section>
  )
}

export default ReviewAnalyzerPage
