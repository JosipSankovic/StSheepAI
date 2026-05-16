const confidenceClass = {
  High: 'confidence-high',
  Medium: 'confidence-medium',
  Low: 'confidence-low',
}

function PhotoGuideResultCard({ result }) {
  if (!result) {
    return (
      <section className="photo-result-card empty-result">
        <p className="eyebrow">AI guide result</p>
        <h2>Ready when your photo is</h2>
        <p>
          Upload a clear photo, choose a language, and the guide will return a short
          tourist-friendly explanation.
        </p>
      </section>
    )
  }

  return (
    <section className="photo-result-card" aria-labelledby="photo-result-title">
      <div className="result-header">
        <div>
          <p className="eyebrow">AI guide result</p>
          <h2 id="photo-result-title">{result.placeName}</h2>
        </div>
        <span className={`confidence-badge ${confidenceClass[result.confidence]}`}>
          {result.confidence} confidence
        </span>
      </div>

      <GuideSection title="What you are seeing" text={result.whatYouSee} />
      <GuideSection title="History" text={result.history} />
      <GuideSection title="Why it matters" text={result.whyItMatters} />
      <GuideSection title="Fun fact" text={result.funFact} />
      <GuideSection title="Local tip" text={result.localTip} />
    </section>
  )
}

function GuideSection({ title, text }) {
  return (
    <article className="guide-section">
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  )
}

export default PhotoGuideResultCard

