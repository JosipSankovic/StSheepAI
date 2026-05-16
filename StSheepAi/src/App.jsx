import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Icon } from './icons.jsx'
import Beach from './screens/Beach.jsx'
import Photo from './screens/Photo.jsx'
import Reviews from './screens/Reviews.jsx'

const ACCENTS = {
  sun: { '--accent': '#f5b81e', '--accent-soft': '#ffe9a6' },
  coral: { '--accent': '#d96a3c', '--accent-soft': '#fbd5c2' },
  teal: { '--accent': '#2d8fa3', '--accent-soft': '#bfe1e7' },
}

function App() {
  const [tab, setTab] = useState('reviews')
  const scrollRef = useRef(null)

  useEffect(() => {
    Object.entries(ACCENTS.sun).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
  }, [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
  }, [tab])

  return (
    <main className="stage" aria-label="Split Tourist Assistant">
      <section className="phone">
        <div className="notch" />
        <StatusBar />

        <div className="brandbar" aria-label="Split Tura">
          <span className="brand-mark" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
              <path d="M9 14 a6 6 0 0 1 6 -6" stroke="#f5b81e" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M16 5 L18 8 L18 21 L14 21 L14 8 Z" stroke="#0d3b66" strokeWidth="1.6" strokeLinejoin="round"/>
              <path d="M7 21 L11 17 L14 21 M18 21 L22 18 L25 21" stroke="#0d3b66" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"/>
              <path d="M5 25 q 3 -1.6 6 0 t 6 0 t 6 0 t 6 0" stroke="#1d6fb8" strokeWidth="1.6" strokeLinecap="round"/>
              <path d="M7 28 q 3 -1.4 5 0 t 5 0 t 5 0" stroke="#4aa3df" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="brand-word">Split Tura</span>
          <span className="brand-tag">Your Split · Your Guide</span>
        </div>

        <div ref={scrollRef} className="scroll">
          <div
            data-screen-label={
              tab === 'reviews'
                ? '01 Reviews'
                : tab === 'photo'
                  ? '02 AI Photo Guide'
                  : '03 Beach Monitor'
            }
            key={tab}
            className="fade-up"
            style={{ paddingTop: 4 }}
          >
            {tab === 'reviews' && <Reviews />}
            {tab === 'photo' && <Photo />}
            {tab === 'beach' && <Beach />}
          </div>
        </div>

        <TabBar tab={tab} setTab={setTab} />
      </section>
    </main>
  )
}

function StatusBar() {
  return (
    <div className="statusbar">
      <span className="mono">9:41</span>
      <span className="statusbar-icons" aria-hidden="true">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <path
            d="M1 8.5C3 6.5 6 5 9 5s6 1.5 8 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M3 10.5c1.5-1.2 3.5-2 6-2s4.5.8 6 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="9" cy="11" r="1" fill="currentColor" />
        </svg>
        <svg
          width="14"
          height="12"
          viewBox="0 0 14 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <path d="M1 7.5 7 1.5l6 6M3 9.5 7 5.5l4 4" />
        </svg>
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
          <rect
            x="1"
            y="1"
            width="20"
            height="10"
            rx="2.5"
            stroke="currentColor"
            strokeWidth="1"
          />
          <rect x="3" y="3" width="14" height="6" rx="1" fill="currentColor" />
          <rect x="22" y="4" width="1.5" height="4" rx="0.5" fill="currentColor" />
        </svg>
      </span>
    </div>
  )
}

function TabBar({ tab, setTab }) {
  const tabs = [
    { id: 'reviews', label: 'Reviews', icon: <Icon.Star /> },
    { id: 'photo', label: 'AI Photo', icon: <Icon.Camera /> },
    { id: 'beach', label: 'Beaches', icon: <Icon.Wave /> },
  ]

  return (
    <nav className="tabbar" aria-label="Assistant sections">
      {tabs.map((item) => {
        const active = item.id === tab

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            aria-current={active ? 'page' : undefined}
            style={{
              border: 0,
              borderRadius: 22,
              padding: '12px 8px 10px',
              cursor: 'pointer',
              background: active ? 'var(--accent)' : 'transparent',
              color: active ? 'var(--sea-deep)' : 'rgba(255,255,255,0.7)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              fontFamily: 'inherit',
              transition: 'background .25s, color .2s, transform .2s',
              transform: active ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <span style={{ display: 'inline-flex' }}>{item.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.1 }}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

export default App
