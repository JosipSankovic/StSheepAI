const placesBaseUrl = 'https://places.googleapis.com/v1'
const splitLocationBias = {
  circle: {
    center: {
      latitude: 43.5081,
      longitude: 16.4402,
    },
    radius: 9000,
  },
}

export async function searchGooglePlaces(query) {
  ensureGoogleKey()

  const response = await fetch(`${placesBaseUrl}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.types',
    },
    body: JSON.stringify({
      textQuery: `${query} Split Croatia`,
      locationBias: splitLocationBias,
      maxResultCount: 8,
    }),
  })

  const data = await parseGoogleResponse(response)

  return (data.places ?? []).map((place) => ({
    id: place.id,
    name: place.displayName?.text ?? 'Unknown place',
    address: place.formattedAddress ?? 'Split, Croatia',
    googleRating: place.rating,
    reviewCount: place.userRatingCount,
    types: place.types ?? [],
  }))
}

export async function searchNearbyRestaurants({ latitude, longitude, radius = 600 }) {
  ensureGoogleKey()

  const response = await fetch(`${placesBaseUrl}/places:searchNearby`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.types',
    },
    body: JSON.stringify({
      includedTypes: ['restaurant'],
      maxResultCount: 10,
      locationRestriction: {
        circle: {
          center: {
            latitude,
            longitude,
          },
          radius,
        },
      },
      rankPreference: 'DISTANCE',
    }),
  })

  const data = await parseGoogleResponse(response)

  return (data.places ?? []).map((place) => ({
    id: place.id,
    name: place.displayName?.text ?? 'Unknown restaurant',
    address: place.formattedAddress ?? 'Nearby restaurant',
    googleRating: place.rating,
    reviewCount: place.userRatingCount,
    types: place.types ?? [],
  }))
}

export async function getGooglePlaceReviews(placeId) {
  ensureGoogleKey()

  const response = await fetch(`${placesBaseUrl}/places/${encodeURIComponent(placeId)}`, {
    headers: {
      'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
      'X-Goog-FieldMask':
        'id,displayName,formattedAddress,rating,userRatingCount,reviews,googleMapsUri',
    },
  })

  const place = await parseGoogleResponse(response)
  const reviews = (place.reviews ?? []).map((review) => ({
    author: review.authorAttribution?.displayName,
    rating: review.rating,
    text: extractReviewText(review),
  }))

  return {
    id: place.id ?? placeId,
    name: place.displayName?.text ?? 'Selected Google place',
    region: place.formattedAddress ?? 'Split, Croatia',
    googleRating: place.rating,
    reviewCount: place.userRatingCount,
    googleMapsUri: place.googleMapsUri,
    source: 'google',
    reviews: reviews.filter((review) => review.text),
  }
}

function extractReviewText(review) {
  if (typeof review.text === 'string') {
    return review.text
  }

  return review.text?.text ?? review.originalText?.text ?? ''
}

async function parseGoogleResponse(response) {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error?.message || 'Google Places request failed.')
  }

  return data
}

function ensureGoogleKey() {
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY is missing on the server.')
  }
}
