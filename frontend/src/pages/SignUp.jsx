import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api/client'

export default function SignUp() {
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', password: '', email: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // 간단한 유효성 검사
    if (!form.email.includes('@')) return setError('이메일 형식이 올바르지 않습니다.')
    if (!form.name.trim()) return setError('닉네임을 입력하세요.')
    if (form.password.length < 4) return setError('비밀번호는 4자 이상이어야 합니다.')

    setSubmitting(true)
    try {
      // 1) 회원가입
      await api.signup({
        email: form.email,
        name: form.name,
        password: form.password,
      })

      // 2) 이메일 임시 저장 (다음 단계 API 호출에 사용)
      localStorage.setItem('signupEmail', form.email)

      // 3) 다음 단계로
      nav('/nation')
    } catch (err) {
      setError(err.message || '네트워크 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
      <div className="page-root">
        <div className="signup-container">
          <h2>Sign up</h2>
          <form onSubmit={onSubmit} className="signup-form">
            <input
                name="name"
                type="text"
                placeholder="Nickname*"
                className="input"
                value={form.name}
                onChange={onChange}
                required
            />
            <input
                name="password"
                type="password"
                placeholder="Password*"
                className="input"
                value={form.password}
                onChange={onChange}
                minLength={4}
                required
            />
            <input
                name="email"
                type="email"
                placeholder="E-mail"
                className="input"
                value={form.email}
                onChange={onChange}
                required
            />
            {error && <p className="error-text">{error}</p>}
            <button className="button continue-btn" disabled={submitting}>
              {submitting ? '가입 중...' : 'Continue'}
            </button>
          </form>
          <div className="divider"><span>OR</span></div>
          <div className="social-buttons">
            <button className="button social">Continue with Apple</button>
            <button className="button social">Continue with Google</button>
          </div>
          <p className="bottom-text">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
  )
}
