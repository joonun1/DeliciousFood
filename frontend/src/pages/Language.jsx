import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const ALL_LANGUAGES = [
  "English", "Japanese", "Chinese", "French", "Korean", "Filipino",
  "Thai", "Dutch", "German", "Norweigan", "Spanish", "Italy"
]

export default function Language() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ALL_LANGUAGES.filter(l => l.toLowerCase().includes(q))
  }, [query])

  return (
    <div className="page-root">
      <div className="Language-container">
        <h2>Your Language</h2>
        <div className="search-bar">
          <input type="search" id="search-input" value={query} onChange={e => setQuery(e.target.value)} />
          <span className="search-icon">🔍</span>
        </div>
        <div className="language">
          {filtered.length === 0 && (
            <p style={{ color: '#888', textAlign: 'center' }}>검색 결과가 없습니다.</p>
          )}
          {filtered.map(lang => (
            <button
              key={lang}
              className={`language-btn ${selected === lang ? 'selected' : ''}`}
              onClick={() => setSelected(lang)}
            >
              {lang}
            </button>
          ))}
        </div>
        <Link className="button continue-btn" to="/survey">Next</Link>
      </div>
    </div>
  )
}


