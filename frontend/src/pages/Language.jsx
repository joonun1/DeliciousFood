import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

const LANGS = ['Korean', 'English', 'Japanese', 'Chinese', 'Spanish']

export default function Language() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [selected, setSelected] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

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

  return (
      <div className="page-root">
        {/* 디자인 변경 없이 원래 구조 유지 */}
        <div className="language-container">
          <h2>Your Language</h2>
          <div className="language-list">
            {LANGS.map(l => (
                <button
                    key={l}
                    className={`lang-btn ${selected === l ? 'selected' : ''}`}
                    onClick={() => onSelect(l)}
                    type="button"
                >
                  {l}
                </button>
            ))}
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
