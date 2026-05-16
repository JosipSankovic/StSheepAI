const negativeWeights = {
  BAD_FOOD: { value: 8, max: 25 },
  BAD_SERVICE: { value: 6, max: 20 },
  OVERPRICED: { value: 7, max: 25 },
  TOURIST_TRAP: { value: 15, max: 35 },
  HIDDEN_CHARGES: { value: 12, max: 35 },
  SERVICE_NOT_INCLUDED: { value: 10, max: 25 },
  SCAM_WARNING: { value: 20, max: 45 },
}

const positiveWeights = {
  GOOD_FOOD: { value: 4, max: 20 },
  GOOD_SERVICE: { value: 3, max: 15 },
  GOOD_VALUE: { value: 5, max: 20 },
  AUTHENTIC_LOCAL: { value: 5, max: 15 },
}

export function calculateTrustScore(categoryCounts, googleRating) {
  let score = 100

  for (const [category, weight] of Object.entries(negativeWeights)) {
    const count = categoryCounts[category] ?? 0
    score -= Math.min(count * weight.value, weight.max)
  }

  for (const [category, weight] of Object.entries(positiveWeights)) {
    const count = categoryCounts[category] ?? 0
    score += Math.min(count * weight.value, weight.max)
  }

  if (typeof googleRating === 'number') {
    if (googleRating < 3.5) {
      score -= 20
    } else if (googleRating < 4.0) {
      score -= 10
    } else if (googleRating > 4.5) {
      score += 10
    }
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}

export function getRiskLevel(score) {
  if (score >= 80) return 'Low'
  if (score >= 60) return 'Medium'
  return 'High'
}

