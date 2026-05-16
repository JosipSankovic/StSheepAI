import { categoryKeywords } from './reviewCategories.js'

export function classifyReview(text = '') {
  const lower = text.toLowerCase()
  const matched = []

  if (!lower.trim()) {
    return matched
  }

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const hasMatch = keywords.some((keyword) => lower.includes(keyword))

    if (hasMatch) {
      matched.push(category)
    }
  }

  return matched
}
