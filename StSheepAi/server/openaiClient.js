import OpenAI from 'openai'

const fallbackResult = {
  placeName: 'Unknown Split location',
  confidence: 'Low',
  whatYouSee:
    'The photo could not be matched clearly to a specific Split landmark from the available image.',
  history:
    'Split has many historic layers, from Roman palace walls to Venetian streets and modern waterfront life.',
  whyItMatters:
    'A clearer photo of a facade, statue, square, tower, or sign will help identify the place more reliably.',
  funFact:
    'Split grew inside and around Diocletian’s Palace, so everyday city life still happens inside ancient walls.',
  localTip: 'Try taking another photo in good light with the full building or monument in frame.',
  language: 'English',
}

export async function analyzePhotoWithOpenAI({ imageBase64, language }) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const response = await client.responses.create({
    model: process.env.OPENAI_VISION_MODEL || 'gpt-4.1-mini',
    input: [
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: buildPrompt(language),
          },
          {
            type: 'input_image',
            image_url: imageBase64,
          },
        ],
      },
    ],
  })

  return normalizeGuideResult(parseJsonResponse(response.output_text), language)
}

function buildPrompt(language) {
  return `You are a friendly local tourist guide for Split, Croatia.

Analyze the uploaded image and identify the place, landmark, building, street, statue, monument, church, square, or attraction if possible.

Return the answer in the selected language: ${language}.

Return only valid JSON using this exact structure:

{
  "placeName": "string",
  "confidence": "High | Medium | Low",
  "whatYouSee": "string",
  "history": "string",
  "whyItMatters": "string",
  "funFact": "string",
  "localTip": "string",
  "language": "string"
}

Rules:
- Keep the explanation tourist-friendly.
- Use simple language.
- Do not write too much.
- If you are not sure, say the confidence is Low or Medium.
- If the image does not show a recognizable Split landmark, say what it might be and suggest taking a clearer photo.
- Do not invent exact facts if uncertain.
- Focus on Split, Croatia.
- Mention if it looks like Diocletian's Palace, Peristyle, Cathedral of Saint Domnius, Riva, Gregory of Nin statue, Jupiter's Temple, Prokurative, Marjan, Bacvice, Matejuska, or another known Split location.`
}

function parseJsonResponse(text = '') {
  const trimmed = text.trim()

  try {
    return JSON.parse(trimmed)
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/)
    if (!match) {
      return fallbackResult
    }

    try {
      return JSON.parse(match[0])
    } catch {
      return fallbackResult
    }
  }
}

function normalizeGuideResult(result, language) {
  const confidenceValues = ['High', 'Medium', 'Low']
  const confidence = confidenceValues.includes(result.confidence)
    ? result.confidence
    : 'Low'

  return {
    placeName: stringOrFallback(result.placeName, fallbackResult.placeName),
    confidence,
    whatYouSee: stringOrFallback(result.whatYouSee, fallbackResult.whatYouSee),
    history: stringOrFallback(result.history, fallbackResult.history),
    whyItMatters: stringOrFallback(result.whyItMatters, fallbackResult.whyItMatters),
    funFact: stringOrFallback(result.funFact, fallbackResult.funFact),
    localTip: stringOrFallback(result.localTip, fallbackResult.localTip),
    language: stringOrFallback(result.language, language),
  }
}

function stringOrFallback(value, fallback) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

