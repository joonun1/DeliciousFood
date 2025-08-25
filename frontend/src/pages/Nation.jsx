import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ALL_NATIONS = [
  "USA", "Japan", "China", "France", "Philippines", "Thailand", "Canada",
  "South Korea", "United Kingdom", "Australia", "Brazil", "India", "Mexico",
  "Spain", "Italy", "Russia", "Argentina", "Egypt", "Nigeria", "South Africa",
  "Sweden", "Norway", "Finland", "Denmark", "Switzerland", "Austria",
  "Belgium", "Portugal", "Greece", "Turkey", "Indonesia", "Vietnam",
  "Malaysia", "Singapore", "New Zealand"
]

export default function Nation() {
  const nav = useNavigate()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ALL_NATIONS.filter(n => n.toLowerCase().includes(q))
  }, [query])

  useEffect(() => {
    // 이전에 고른 나라가 있으면 복원
    const saved = localStorage.getItem('signupNation') || ''
    if (saved) setSelected(saved)
  }, [])

  const onSelect = (nation) => {
    setSelected(nation)
    localStorage.setItem('signupNation', nation)
  }

  const onContinue = (e) => {
    if (!selected) {
      e.preventDefault()
      return
    }
    // 바로 다음 페이지 이동
    nav('/language')
  }

  // 🔙 뒤로 가기
  const onBack = () => {
    nav('/signup')
  }

  return (
    <div className="page-root">
      <div className="entire-container">
        <div className="title-row">
          <div className="back-btn" onClick={onBack}>
            <img src="/img/arrow.svg" alt="Back"/>
          </div>
          <h2>Your Nation</h2>
        </div>

        <div className="search-bar">
          <input
            type="search"
            id="search-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <span className="search-icon"><img src="/img/search.svg" alt="search" /></span>
        </div>

        <div className="nation-list">
          {filtered.length === 0 && (
            <p style={{ color: '#888', textAlign: 'center' }}>검색 결과가 없습니다.</p>
          )}
          {filtered.map(nation => (
            <button
              key={nation}
              className={`nation-btn ${selected === nation ? 'selected' : ''}`}
              onClick={() => onSelect(nation)}
              type="button"
            >
              {nation}
            </button>
          ))}
        </div>

        <button
          className="button continue-btn"
          onClick={onContinue}
          type="button"
          disabled={!selected}
        >
          Next
        </button>
      </div>
    </div>
  )
}
