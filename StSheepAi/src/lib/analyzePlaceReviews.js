import { calculateTrustScore, getRiskLevel } from './calculateTrustScore.js'
import {
  categoryLabels,
  positiveCategories,
  reviewCategories,
  warningCategories,
} from './reviewCategories.js'
import { classifyReview } from './reviewClassifier.js'

export function analyzePlaceReviews(place) {
  const categoryCounts = Object.fromEntries(
    reviewCategories.map((category) => [category, 0]),
  )

  for (const review of place.reviews) {
    const categories = classifyReview(review.text)

    for (const category of categories) {
      categoryCounts[category] += 1
    }
  }

  const trustScore = calculateTrustScore(categoryCounts, place.googleRating)
  const riskLevel = getRiskLevel(trustScore)

  return {
    placeName: place.name,
    trustScore,
    riskLevel,
    categoryCounts,
    positiveSignals: buildSignals(categoryCounts, positiveCategories),
    warningSignals: buildSignals(categoryCounts, warningCategories),
    touristAdvice: generateTouristAdvice(categoryCounts, riskLevel),
  }
}

function buildSignals(counts, categories) {
  return categories
    .filter((category) => counts[category] > 0)
    .map((category) => {
      const count = counts[category]
      const reviewWord = count === 1 ? 'review' : 'reviews'
      return `${count} ${reviewWord} mention ${categoryLabels[category].toLowerCase()}.`
    })
}

function generateTouristAdvice(counts, riskLevel) {
  if (
    counts.HIDDEN_CHARGES > 0 ||
    counts.SERVICE_NOT_INCLUDED > 0 ||
    counts.SCAM_WARNING > 0
  ) {
    return 'Check the menu carefully, ask whether service, bread, or water is included, and review the bill before paying.'
  }

  if (riskLevel === 'Low') {
    return 'Reviews look mostly positive. Based on this mock review set, the place appears tourist-friendly.'
  }

  if (counts.OVERPRICED > 0 || counts.TOURIST_TRAP > 0) {
    return 'Compare prices before ordering and consider nearby alternatives if the menu seems expensive.'
  }

  if (counts.BAD_SERVICE > 0) {
    return 'Service complaints appear in reviews, so consider checking recent reviews before deciding.'
  }

  if (counts.BAD_FOOD > 0) {
    return 'Food feedback is mixed, so scan recent dishes mentioned by visitors before choosing.'
  }

  return 'There are mixed signals in reviews. Read a few recent reviews before deciding.'
}
