export function speakText(text, lang = 'en-US') {
  if (!('speechSynthesis' in window)) {
    return false
  }

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = 0.95
  utterance.pitch = 1

  window.speechSynthesis.speak(utterance)
  return true
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

export function buildAudioGuideText(result) {
  return [
    result.placeName,
    result.whatYouSee,
    result.history,
    result.whyItMatters,
    `Fun fact: ${result.funFact}`,
    `Local tip: ${result.localTip}`,
  ].join('. ')
}

