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
  }, [nav])

  const onNext = async () => {
    if (!selected) return
    setError(''); setSaving(true)
    try {
      const res = await api.setLanguage({ email, language: selected })
      // 확인용
      console.log('language saved:', res)
      // 다음 페이지로
      nav('/home') // 원하는 다음 경로
    } catch (err) {
      setError(err.message || '저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
      <div className="page-root">
        <div className="language-container">
          <h2>Your Language</h2>
          <div className="language-list">
            {LANGS.map(l => (
                <button
                    key={l}
                    className={`lang-btn ${selected === l ? 'selected' : ''}`}
                    onClick={() => setSelected(l)}
                >
                  {l}
                </button>
            ))}
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="button continue-btn" onClick={onNext} disabled={!selected || saving}>
            {saving ? 'Saving...' : 'Next'}
          </button>
        </div>
      </div>
  )
}
