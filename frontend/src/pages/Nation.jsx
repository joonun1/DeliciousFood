import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const ALL_NATIONS = [
  "USA", "Japan", "China", "France", "Philippines", "Thailand", "Canada",
  "South Korea", "United Kingdom", "Australia", "Brazil", "India", "Mexico",
  "Spain", "Italy", "Russia", "Argentina", "Egypt", "Nigeria", "South Africa",
  "Sweden", "Norway", "Finland", "Denmark", "Switzerland", "Austria",
  "Belgium", "Portugal", "Greece", "Turkey", "Indonesia", "Vietnam",
  "Malaysia", "Singapore", "New Zealand"
]

export default function Nation() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ALL_NATIONS.filter(n => n.toLowerCase().includes(q))
  }, [query])

  useEffect(() => {
    // no-op for now
  }, [])

  return (
    <div className="page-root">
      <div className="nation-container">
        <h2>Your Nation</h2>
        <div className="search-bar">
          <input type="search" id="search-input" value={query} onChange={e => setQuery(e.target.value)} />
          <span className="search-icon">🔍</span>
        </div>
        <div className="nation-list">
          {filtered.length === 0 && (
            <p style={{ color: '#888', textAlign: 'center' }}>검색 결과가 없습니다.</p>
          )}
          {filtered.map(nation => (
            <button
              key={nation}
              className={`nation-btn ${selected === nation ? 'selected' : ''}`}
              onClick={() => setSelected(nation)}
            >
              {nation}
            </button>
          ))}
        </div>
        <Link className="button continue-btn" to="/language">Next</Link>
      </div>
    </div>
  )
}


