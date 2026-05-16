const riskLabelClass = {
  Low: 'risk-low',
  Medium: 'risk-medium',
  High: 'risk-high',
}

function PlaceTrustCard({ place, analysis }) {
  const warningSignals =
    analysis.warningSignals.length > 0
      ? analysis.warningSignals
      : ['No major warning categories were found in the mock reviews.']

  const positiveSignals =
    analysis.positiveSignals.length > 0
      ? analysis.positiveSignals
      : ['No strong positive categories were found in the mock reviews.']

  return (
    <section className="trust-card" aria-labelledby="selected-place-name">
      <div className="trust-card-header">
        <div>
          <p className="eyebrow">{place.region}</p>
          <h2 id="selected-place-name">{place.name}</h2>
          <p className="place-meta">
            Google rating {place.googleRating?.toFixed(1) ?? 'N/A'} from{' '}
            {place.reviewCount ?? place.reviews.length} reviews
          </p>
          {place.source === 'google' ? (
            <p className="source-note">
              Analyzing review snippets returned by Google Places.
              {place.googleMapsUri ? (
                <>
                  {' '}
                  <a href={place.googleMapsUri} target="_blank" rel="noreferrer">
                    Open in Google Maps
                  </a>
                </>
              ) : null}
            </p>
          ) : (
            <p className="source-note">Using local mock reviews for demo mode.</p>
          )}
        </div>
        <span className={`risk-badge ${riskLabelClass[analysis.riskLevel]}`}>
          {analysis.riskLevel} Risk
        </span>
      </div>

      <div className="score-row">
        <div className="score-meter" aria-label={`Tourist Trust Score ${analysis.trustScore} out of 100`}>
          <span>{analysis.trustScore}</span>
          <small>/100</small>
        </div>
        <div>
          <p className="score-label">Tourist Trust Score</p>
          <p className="score-copy">
            Keyword analysis of the available mock reviews, weighted for tourist-friendly
            signals and common warning patterns.
          </p>
        </div>
      </div>

      <div className="signal-grid">
        <div className="signal-column positive">
          <h3>Positive Signals</h3>
          <ul>
            {positiveSignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </div>
        <div className="signal-column warning">
          <h3>Warning Signals</h3>
          <ul>
            {warningSignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="advice-box">
        <h3>Tourist Advice</h3>
        <p>{analysis.touristAdvice}</p>
      </div>
    </section>
  )
}

export default PlaceTrustCard
