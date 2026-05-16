import { useState } from 'react'
import Navigation from './components/Navigation'
import BeachMonitorPage from './pages/BeachMonitorPage'
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
          Review trust analysis, an AI photo guide, and live beach webcam intelligence
          for visitors moving through Split.
        </p>
        <Navigation activePage={activePage} onChangePage={setActivePage} />
      </header>

      {activePage === 'reviews' ? <ReviewAnalyzerPage /> : null}
      {activePage === 'photo-guide' ? <PhotoGuidePage /> : null}
      {activePage === 'beaches' ? <BeachMonitorPage /> : null}
    </main>
  )
}

export default App
