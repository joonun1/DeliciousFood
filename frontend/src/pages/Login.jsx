import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api/client'

export default function Login() {
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.email.includes('@')) return setError('이메일 형식이 올바르지 않습니다.')
    if (form.password.length < 4) return setError('비밀번호는 4자 이상이어야 합니다.')

    setSubmitting(true)
    try {
      // 1) 로그인 API 호출
      await api.login({
        email: form.email,
        password: form.password,
      })

      // 2) 로그인 성공 후 홈으로 이동
      nav('/home')
    } catch (err) {
      setError(err.message || '네트워크 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const onBack = () => {
    nav('/home')
  }

  return (
    <div className="page-root">
      {/* ✅ Language/Nation/SignUp과 동일한 상단 헤더 */}
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
            minLength={4}
          />

          {error && <p className="error-text">{error}</p>}

          <button className="button sign-btn" disabled={submitting}>
            {submitting ? '로그인 중...' : 'Continue'}
          </button>
        </form>

        <div className="divider"><span>OR</span></div>
        <div className="social-buttons">
          <button className="button social">Continue with Apple</button>
          <button className="button social">Continue with Google</button>
        </div>

        <p className="bottom-text">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
