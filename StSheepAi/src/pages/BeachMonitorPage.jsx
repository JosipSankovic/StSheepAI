import { useEffect, useMemo, useState } from 'react'
import {
  analyzeBeach,
  captureBeachImages,
  fetchBeachImages,
  fetchBeaches,
  fetchLatestAnalysis,
} from '../lib/beachApi'

function BeachMonitorPage() {
  const [beaches, setBeaches] = useState([])
  const [selectedBeachId, setSelectedBeachId] = useState('')
  const [images, setImages] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isWorking, setIsWorking] = useState(false)
  const [error, setError] = useState('')

  const selectedBeach = useMemo(
    () => beaches.find((beach) => beach.id === selectedBeachId),
    [beaches, selectedBeachId],
  )
  const latestImage = images[0]

  useEffect(() => {
    let isMounted = true

    async function loadBeaches() {
      try {
        const nextBeaches = await fetchBeaches()

        if (!isMounted) return

        setBeaches(nextBeaches)
        setSelectedBeachId(nextBeaches[0]?.id ?? '')
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadBeaches()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!selectedBeachId) return

    let isMounted = true

    async function loadBeachData() {
      setError('')
      setAnalysis(null)

      try {
        const nextImages = await fetchBeachImages(selectedBeachId)

        if (!isMounted) return

        setImages(nextImages)
        const imageAnalysis = nextImages[0]?.analysis

        if (imageAnalysis) {
          setAnalysis(imageAnalysis)
          return
        }

        try {
          const latest = await fetchLatestAnalysis(selectedBeachId)
          if (isMounted) setAnalysis(latest)
        } catch {
          if (isMounted) setAnalysis(null)
        }
      } catch (loadError) {
        if (isMounted) {
          setImages([])
          setError(loadError.message)
        }
      }
    }

    loadBeachData()

    return () => {
      isMounted = false
    }
  }, [selectedBeachId])

  async function handleCaptureAll() {
    setIsWorking(true)
    setError('')

    try {
      await captureBeachImages()
      const nextImages = await fetchBeachImages(selectedBeachId)
      setImages(nextImages)
      setAnalysis(nextImages[0]?.analysis ?? null)
    } catch (captureError) {
      setError(captureError.message)
    } finally {
      setIsWorking(false)
    }
  }

  async function handleAnalyzeLatest() {
    if (!selectedBeachId) return

    setIsWorking(true)
    setError('')

    try {
      const nextAnalysis = await analyzeBeach(selectedBeachId)
      const nextImages = await fetchBeachImages(selectedBeachId)
      setAnalysis(nextAnalysis)
      setImages(nextImages)
    } catch (analysisError) {
      setError(analysisError.message)
    } finally {
      setIsWorking(false)
    }
  }

  if (isLoading) {
    return (
      <section className="feature-page">
        <div className="feature-intro hero-panel">
          <p className="eyebrow">Beach Monitor</p>
          <h1>Loading beach backend</h1>
          <p>Connecting to your FastAPI beach webcam service.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="feature-page beach-page">
      <div className="feature-intro hero-panel">
        <p className="eyebrow">Beach Monitor</p>
        <h1>Live webcam intelligence for Split beaches</h1>
        <p>
          Uses your Python backend to capture webcam frames, estimate crowds, read weather
          conditions, and show the latest AI analysis.
        </p>
      </div>

      <div className="beach-layout">
        <aside className="beach-sidebar tool-panel">
          <div>
            <p className="eyebrow">Tracked webcams</p>
            <h2>Choose a beach</h2>
          </div>

          <div className="beach-list">
            {beaches.map((beach) => (
              <button
                key={beach.id}
                type="button"
                className="beach-option"
                aria-pressed={beach.id === selectedBeachId}
                onClick={() => setSelectedBeachId(beach.id)}
              >
                <span>
                  <strong>{beach.name}</strong>
                  <small>{beach.location}</small>
                </span>
              </button>
            ))}
          </div>

          <div className="beach-actions">
            <button
              type="button"
              className="primary-button wide"
              onClick={handleCaptureAll}
              disabled={isWorking}
            >
              {isWorking ? 'Working...' : 'Capture all webcams'}
            </button>
            <button
              type="button"
              className="secondary-button wide"
              onClick={handleAnalyzeLatest}
              disabled={isWorking || !latestImage}
            >
              Analyze latest image
            </button>
          </div>

          {error ? <p className="form-error">{error}</p> : null}
        </aside>

        <div className="beach-main">
          <section className="beach-visual-card">
            <div className="beach-visual-header">
              <div>
                <p className="eyebrow">{selectedBeach?.location ?? 'Split, Croatia'}</p>
                <h2>{selectedBeach?.name ?? 'Select a beach'}</h2>
                <p>{selectedBeach?.description ?? 'Pick a webcam to see latest data.'}</p>
              </div>
              {analysis ? (
                <span className={`crowd-badge ${crowdClass(analysis.people.crowd_level)}`}>
                  {formatCrowd(analysis.people.crowd_level)}
                </span>
              ) : null}
            </div>

            {latestImage ? (
              <figure className="beach-image-frame">
                <img src={latestImage.url} alt={`${selectedBeach?.name ?? 'Beach'} webcam`} />
              </figure>
            ) : (
              <div className="beach-empty-frame">
                <span>No captured image yet. Capture webcams to create the first snapshot.</span>
              </div>
            )}
          </section>

          <AnalysisDashboard analysis={analysis} latestImage={latestImage} />
        </div>
      </div>
    </section>
  )
}

function AnalysisDashboard({ analysis, latestImage }) {
  if (!analysis) {
    return (
      <section className="analysis-dashboard empty-result">
        <p className="eyebrow">AI analysis</p>
        <h2>No analysis yet</h2>
        <p>
          Capture a webcam image and run analysis to see crowd level, weather, image quality,
          and notes.
        </p>
      </section>
    )
  }

  return (
    <section className="analysis-dashboard">
      <MetricCard label="People estimate" value={analysis.people.estimated_count} helper={`${analysis.people.estimated_range.min}-${analysis.people.estimated_range.max} range`} />
      <MetricCard label="Crowd score" value={`${analysis.people.crowd_score}/10`} helper={formatCrowd(analysis.people.crowd_level)} />
      <MetricCard label="Weather" value={formatValue(analysis.weather.condition)} helper={`${formatValue(analysis.weather.visibility)} visibility`} />
      <MetricCard label="Image quality" value={formatValue(analysis.image_quality.lighting)} helper={analysis.image_quality.resolution} />

      <article className="notes-card">
        <div>
          <p className="eyebrow">Latest analysis</p>
          <h2>{new Date(latestImage?.timestamp ?? analysis.timestamp).toLocaleString()}</h2>
        </div>
        <ul>
          {analysis.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </article>
    </section>
  )
}

function MetricCard({ label, value, helper }) {
  return (
    <article className="metric-card">
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{helper}</span>
    </article>
  )
}

function crowdClass(level) {
  if (level === 'low') return 'crowd-low'
  if (level === 'moderate') return 'crowd-medium'
  return 'crowd-high'
}

function formatCrowd(level) {
  return formatValue(level)
}

function formatValue(value) {
  return String(value ?? 'unknown').replaceAll('_', ' ')
}

export default BeachMonitorPage

