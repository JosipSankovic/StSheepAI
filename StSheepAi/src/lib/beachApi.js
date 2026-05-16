export async function fetchBeaches() {
  return fetchJson('/beaches')
}

export async function fetchBeachImages(beachId) {
  return fetchJson(`/beaches/${encodeURIComponent(beachId)}/images`)
}

export async function fetchLatestAnalysis(beachId) {
  return fetchJson(`/beaches/${encodeURIComponent(beachId)}/latest-analysis`)
}

export async function captureBeachImages() {
  return fetchJson('/beaches/capture', {
    method: 'POST',
  })
}

export async function analyzeBeach(beachId) {
  return fetchJson(`/beaches/${encodeURIComponent(beachId)}/analyze`, {
    method: 'POST',
  })
}

async function fetchJson(url, options) {
  const response = await fetch(url, options)
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.detail || data?.error || 'Backend request failed.')
  }

  return data
}

