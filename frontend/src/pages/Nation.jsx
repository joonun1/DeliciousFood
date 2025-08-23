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
    // 선택 안 했으면 이동 막기 (UI 변경 없음)
    if (!selected) {
      e.preventDefault()
      return
    }

    // 백엔드에 nation 저장 (이메일은 회원가입 단계에서 저장해둔 값 사용)
    const email = localStorage.getItem('signupEmail') || ''
    if (!email) {
      e.preventDefault()
      nav('/signup', { replace: true })
      return
    }
    try {
      await api.setNation({ email, nation: selected })
      // 성공 시 그대로 링크 네비게이션 진행 (preventDefault 안 했으므로 OK)
    } catch (err) {
      // 저장 실패 시 이동 중단
      e.preventDefault()
      alert(err.message || '국가 저장 중 오류가 발생했습니다.')
    }
  }

  return (
      <div className="page-root">
        <div className="nation-container">
          <h2>Your Nation</h2>
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
          {/* 디자인 그대로: Link 유지. onClick으로 기능만 추가 */}
          <Link className="button continue-btn" to="/language" onClick={onContinue}>
            Next
          </Link>
        </div>
      </div>
  )
}
