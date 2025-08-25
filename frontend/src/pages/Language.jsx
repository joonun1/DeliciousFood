import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

const LANGS = ['Korean', 'English', 'Japanese', 'Chinese', 'Spanish']

export default function Language() {
  const nav = useNavigate()
  const [selected, setSelected] = useState('')
  const [query, setQuery] = useState('')

  const onSelect = (lang) => {
    setSelected(lang)
    localStorage.setItem('signupLanguage', lang) // 선택한 언어 저장
  }

  const onNext = () => {
    if (!selected) return
    nav('/complete') // ✅ 바로 complete 페이지로 이동
  }

  const onBack = () => {
    nav('/nation')
  }

  // 검색어에 따른 필터링
  const filteredLangs = useMemo(() => {
    const q = query.trim().toLowerCase()
    return LANGS.filter(l => l.toLowerCase().includes(q))
  }, [query])

  return (
    <div className="page-root">
      <div className="entire-container">
        {/* 상단 헤더 */}
        <div className="title-row" >
          <div className="back-btn" onClick={onBack} style={{ cursor: 'pointer' }}>
            <img src="/img/arrow.svg" alt="Back"/>
          </div>
          <h2>Your Language</h2>
        </div>

        {/* 검색창 */}
        <div className="search-bar">
          <input
            type="search"
            id="search-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <span className="search-icon"><img src="/img/search.svg" alt="search"/></span>
        </div>

        {/* 언어 리스트 */}
        <div className="language-list">
          {filteredLangs.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center' }}>검색 결과가 없습니다.</p>
          ) : (
            filteredLangs.map(l => (
              <button
                key={l}
                className={`lang-btn ${selected === l ? 'selected' : ''}`}
                onClick={() => onSelect(l)}
                type="button"
              >
                {l}
              </button>
            ))
          )}
        </div>

        {/* 다음 버튼 */}
        <button
          className="button continue-btn"
          onClick={onNext}
          disabled={!selected}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  )
}
