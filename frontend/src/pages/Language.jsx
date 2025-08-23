import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

const LANGS = ['Korean', 'English', 'Japanese', 'Chinese', 'Spanish']

export default function Language() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [selected, setSelected] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('') // 검색어 상태 추가

  useEffect(() => {
    const e = localStorage.getItem('signupEmail') || ''
    setEmail(e)
    if (!e) nav('/signup', { replace: true })

    // 이전에 고른 언어가 있으면 복원
    const savedLang = localStorage.getItem('signupLanguage') || ''
    if (savedLang) setSelected(savedLang)
  }, [nav])

  const onSelect = (lang) => {
    setSelected(lang)
    localStorage.setItem('signupLanguage', lang)
  }

  const onNext = async () => {
    if (!selected) return
    setError('')
    setSaving(true)
    try {
      await api.setLanguage({ email, language: selected })
      nav('/home') // 원하는 다음 경로
    } catch (err) {
      setError(err.message || '저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  // 검색어에 따른 필터링
  const filteredLangs = useMemo(() => {
    const q = query.trim().toLowerCase()
    return LANGS.filter(l => l.toLowerCase().includes(q))
  }, [query])

  const onBack = () => {
    nav('/nation')
  }

  return (
    <div className="page-root">
      <div className="language-container">
        <div
          className="back-btn"
          onClick={onBack}
          style={{ cursor: 'pointer', marginBottom: '16px' }}
        >
        </div>
        <div className="title-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
  {/* 화살표 버튼 */}
  <div className="back-btn" onClick={onBack} style={{ cursor: 'pointer' }}>
    <img src="/img/arrow.svg" alt="Back" style={{ width: '24px', height: '24px' }} />
  </div>

  {/* 제목 */}
  <h2 style={{ margin: 0 }}>Your Language</h2>
</div>

        {/* 검색창 추가 */}
        <div className="search-bar" style={{ marginBottom: '12px' }}>
          <input
            type="search"
            id="search-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

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

        {error && <p className="error-text">{error}</p>}
        <button
          className="button continue-btn"
          onClick={onNext}
          disabled={!selected || saving}
          type="button"
        >
          {saving ? 'Saving...' : 'Next'}
        </button>
      </div>
    </div>
  )
}
