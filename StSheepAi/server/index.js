import express from 'express'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  getGooglePlaceReviews,
  searchGooglePlaces,
  searchNearbyRestaurants,
} from './googlePlacesClient.js'
import { analyzePhotoWithOpenAI } from './openaiClient.js'

loadLocalEnv()

const app = express()
const port = Number(process.env.PORT || 3001)

app.use(express.json({ limit: '8mb' }))

app.get('/api/health', (_request, response) => {
  response.json({ ok: true })
})

app.get('/api/places/search', async (request, response) => {
  const query = String(request.query.query ?? '').trim()

  if (!query) {
    return response.status(400).json({
      error: 'Search for a restaurant or place name first.',
    })
  }

  try {
    const places = await searchGooglePlaces(query)
    return response.json({ places })
  } catch (error) {
    console.error('Google place search failed:', error)
    return response.status(500).json({
      error:
        error.message || 'Could not search Google Places. Check the server API key.',
    })
  }
})

app.get('/api/places/nearby', async (request, response) => {
  const latitude = Number(request.query.lat)
  const longitude = Number(request.query.lng)
  const radius = Number(request.query.radius ?? 600)

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return response.status(400).json({
      error: 'Location permission is needed to find nearby restaurants.',
    })
  }

  try {
    const places = await searchNearbyRestaurants({
      latitude,
      longitude,
      radius: Number.isFinite(radius) ? radius : 600,
    })
    return response.json({ places })
  } catch (error) {
    console.error('Google nearby search failed:', error)
    return response.status(500).json({
      error:
        error.message || 'Could not find nearby restaurants. Check the server API key.',
    })
  }
})

app.get('/api/places/:placeId/reviews', async (request, response) => {
  try {
    const place = await getGooglePlaceReviews(request.params.placeId)
    return response.json(place)
  } catch (error) {
    console.error('Google place details failed:', error)
    return response.status(500).json({
      error:
        error.message || 'Could not load Google reviews for that place.',
    })
  }
})

app.post('/api/analyze-photo', async (request, response) => {
  const { imageBase64, language } = request.body ?? {}

  if (!imageBase64 || !language) {
    return response.status(400).json({
      error: 'Please upload a photo and choose a language before analyzing.',
    })
  }

  if (!process.env.OPENAI_API_KEY) {
    return response.status(500).json({
      error: 'OPENAI_API_KEY is missing on the server.',
    })
  }

  try {
    const result = await analyzePhotoWithOpenAI({ imageBase64, language })
    return response.json(result)
  } catch (error) {
    console.error('Photo analysis failed:', error)
    return response.status(500).json({
      error: 'Could not analyze image. Please try another photo.',
    })
  }
})

app.listen(port, () => {
  console.log(`Photo guide API listening on http://127.0.0.1:${port}`)
})

function loadLocalEnv() {
  const envPath = resolve(process.cwd(), '.env')

  try {
    const envFile = readFileSync(envPath, 'utf8')

    for (const line of envFile.split('\n')) {
      const trimmed = line.trim()

      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
        continue
      }

      const [key, ...valueParts] = trimmed.split('=')
      const value = valueParts.join('=').replace(/^["']|["']$/g, '')

      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  } catch {
    // .env is optional; deployed environments can provide variables directly.
  }
}
