import { useEffect, useState } from 'react'
import { buildAudioGuideText, speakText, stopSpeaking } from '../lib/speech'

function AudioGuideButton({ result, speechCode }) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    return () => stopSpeaking()
  }, [])

  function handlePlay() {
    if (!result) {
      return
    }

    const didStart = speakText(buildAudioGuideText(result), speechCode)

    if (!didStart) {
      setMessage('Audio is not supported in this browser.')
      return
    }

    setMessage('')
    setIsSpeaking(true)
  }

  function handleStop() {
    stopSpeaking()
    setIsSpeaking(false)
  }

  return (
    <div className="audio-controls">
      <button type="button" className="primary-button" onClick={handlePlay} disabled={!result}>
        Play audio
      </button>
      <button type="button" className="secondary-button" onClick={handleStop} disabled={!result}>
        Stop
      </button>
      {isSpeaking ? <span className="audio-status">Playing browser narration</span> : null}
      {message ? <span className="form-error">{message}</span> : null}
    </div>
  )
}

export default AudioGuideButton

