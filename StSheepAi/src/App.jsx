import { useState } from 'react'
import Navigation from './components/Navigation'
import PhotoGuidePage from './pages/PhotoGuidePage'
import ReviewAnalyzerPage from './pages/ReviewAnalyzerPage'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('reviews')

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Split Tourist Assistant</p>
          <h1>Smarter decisions while exploring Split</h1>
        </div>
        <p>
          Two simple hackathon tools: review trust analysis for places and an AI photo
          guide with multilingual browser audio.
        </p>
        <Navigation activePage={activePage} onChangePage={setActivePage} />
      </header>

      {activePage === 'reviews' ? <ReviewAnalyzerPage /> : <PhotoGuidePage />}
    </main>
  )
}

export default App
