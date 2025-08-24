import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'

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

  const onContinue = async (e) => {
    // 선택 안 했으면 이동 막기
    if (!selected) {
      e.preventDefault()
      return
    }

    // 백엔드에 nation 저장
    const email = localStorage.getItem('signupEmail') || ''
    if (!email) {
      e.preventDefault()
      nav('/signup', { replace: true })
      return
    }
    try {
      await api.setNation({ email, nation: selected })
    } catch (err) {
      e.preventDefault()
      alert(err.message || '국가 저장 중 오류가 발생했습니다.')
    }
  }

  // 🔙 뒤로 가기 (Language → Nation → Home 순서 유지)
  const onBack = () => {
    nav('/signup') // Nation은 홈으로 이동
  }

  return (
    <div className="page-root">
      <div className="nation-container">
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
              onClick={() => onSelect(nation)}
              type="button"
            >
              {nation}
            </button>
          ))}
        </div>

        <Link className="button continue-btn" to="/language" onClick={onContinue}>
          Next
        </Link>
      </div>
    </div>
  )
}
