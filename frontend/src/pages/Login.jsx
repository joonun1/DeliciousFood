/*import { useState } from 'react'
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
*/

// src/pages/Login.jsx
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
    const password = form.password // 비번은 보통 그대로, 원하면 trim()

    if (!form.email.includes('@')) return setError('이메일 형식이 올바르지 않습니다.')
    if (!form.password) return setError('비밀번호를 입력하세요.')

    setSubmitting(true)
    try {
      // 백엔드 로그인 호출
      await api.login({ email: form.email, password: form.password })

      // 로그인 성공 → 이후 페이지들이 쓰도록 저장
      localStorage.setItem('authEmail', form.email)
      // (언어/국가 페이지에서 같은 키를 읽고 있으니 호환 위해 같이 저장)
      localStorage.setItem('signupEmail', form.email)

      // 원하는 첫 화면으로 이동
      nav('/home') // 필요에 따라 경로 변경
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
      <div className="page-root">
        <div className="signup-container">{/* SignUp과 동일 스타일 박스 재사용 */}
          <h2>Sign in</h2>
          <form onSubmit={onSubmit} className="signup-form">
            <input
                name="email"
                type="email"
                placeholder="E-mail"
                className="input"
                value={form.email}
                onChange={onChange}
                required
            />
            <input
                name="password"
                type="password"
                placeholder="Password"
                className="input"
                value={form.password}
                onChange={onChange}
                required
            />
            {error && <p className="error-text">{error}</p>}
            <button className="button continue-btn" disabled={submitting}>
              {submitting ? '로그인 중...' : 'Sign in'}
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
