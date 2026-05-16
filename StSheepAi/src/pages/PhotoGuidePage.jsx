import { useMemo, useState } from 'react'
import AudioGuideButton from '../components/AudioGuideButton'
import LanguageSelector from '../components/LanguageSelector'
import PhotoGuideResultCard from '../components/PhotoGuideResultCard'
import PhotoUpload from '../components/PhotoUpload'
import { imageToBase64 } from '../lib/imageToBase64'
import { supportedLanguages } from '../lib/supportedLanguages'

function PhotoGuidePage() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const selectedLanguageConfig = useMemo(
    () =>
      supportedLanguages.find((language) => language.value === selectedLanguage) ??
      supportedLanguages[0],
    [selectedLanguage],
  )

  function handleFileChange(nextFile) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setFile(nextFile)
    setPreviewUrl(URL.createObjectURL(nextFile))
    setResult(null)
  }

  async function handleAnalyze(event) {
    event.preventDefault()

    if (!file) {
      setError('Please upload a photo before analyzing.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const imageBase64 = await imageToBase64(file)
      const response = await fetch('/api/analyze-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64,
          language: selectedLanguage,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Could not analyze image.')
      }

      setResult(data)
    } catch (requestError) {
      setError(
        requestError.message ||
          'We could not recognize this photo clearly. Try taking a clearer photo of the landmark or building.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="feature-page photo-guide-page">
      <div className="feature-intro">
        <p className="eyebrow">AI Photo Guide</p>
        <h1>Turn a Split photo into an audio guide</h1>
        <p>
          Upload a landmark or street photo, choose a language, and get a short guide
          explanation with browser audio narration.
        </p>
      </div>

      <form className="photo-guide-layout" onSubmit={handleAnalyze}>
        <div className="photo-controls">
          <PhotoUpload
            file={file}
            previewUrl={previewUrl}
            onFileChange={handleFileChange}
            onError={setError}
          />

          <section className="guide-action-panel">
            <p className="eyebrow">Step 2</p>
            <h2>Choose language and analyze</h2>
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onChange={setSelectedLanguage}
            />
            <button type="submit" className="primary-button wide" disabled={isLoading}>
              {isLoading ? 'Analyzing your photo...' : 'Analyze photo'}
            </button>
            {error ? <p className="form-error">{error}</p> : null}
          </section>
        </div>

        <div className="photo-results">
          {isLoading ? (
            <section className="photo-result-card loading-card">
              <p className="eyebrow">Analyzing</p>
              <h2>Looking for Split landmarks</h2>
              <p>
                The guide is reading the image and preparing a simple explanation in{' '}
                {selectedLanguageConfig.label}.
              </p>
            </section>
          ) : (
            <PhotoGuideResultCard result={result} />
          )}

          <section className="audio-panel">
            <div>
              <p className="eyebrow">Audio guide</p>
              <h2>Listen in {selectedLanguageConfig.label}</h2>
            </div>
            <AudioGuideButton result={result} speechCode={selectedLanguageConfig.speechCode} />
          </section>
        </div>
      </form>
    </section>
  )
}

export default PhotoGuidePage

