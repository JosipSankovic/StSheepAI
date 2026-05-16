import { supportedLanguages } from '../lib/supportedLanguages'

function LanguageSelector({ selectedLanguage, onChange }) {
  return (
    <label className="language-selector" htmlFor="guide-language">
      <span>Guide language</span>
      <select
        id="guide-language"
        value={selectedLanguage}
        onChange={(event) => onChange(event.target.value)}
      >
        {supportedLanguages.map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default LanguageSelector

