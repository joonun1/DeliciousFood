import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'

export default function Login() {
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const email = form.email.trim()
    const password = form.password

    if (!email.includes('@')) return setError('이메일 형식이 올바르지 않습니다.')
    if (!password) return setError('비밀번호를 입력하세요.')

    setSubmitting(true)
    try {
      // ✅ 백엔드 로그인 호출
      await api.login({ email, password })

      // ✅ 로그인 성공 시 로컬스토리지에 저장
      localStorage.setItem('authEmail', email)
      localStorage.setItem('signupEmail', email)

      // ✅ 홈으로 이동
      nav('/home')
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-root">
      {/* ✅ CSS 구조에 맞게 수정 */}
      <div className="entire-container">
        <div className="title-row">
          <h2>Sign In</h2>
        </div>

        <form onSubmit={onSubmit} className="signup-form">
          <input
            name="email"
            type="email"
            placeholder="E-mail *"
            className="input"
            value={form.email}
            onChange={onChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password *"
            className="input"
            value={form.password}
            onChange={onChange}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button className="button sign-btn" disabled={submitting}>
            {submitting ? '로그인 중...' : 'Sign In'}
          </button>
        </form>

        <div className="divider"><span>OR</span></div>

        <div className="social-buttons">
          <button className="button social">Continue with Apple</button>
          <button className="button social">Continue with Google</button>
        </div>

        <p className="bottom-text">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  )
}
