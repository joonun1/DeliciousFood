import { useNavigate } from 'react-router-dom'

export default function Onboarding() {
  const navigate = useNavigate()
  return (
    <div className="onboarding-container">
      <div className="logo">
        <img src="/img/logo.png" alt="Logo" />
      </div>
      <div className="auth-buttons">
        <button className="button signup-btn" onClick={() => navigate('/signup')}>Sign up</button>
        <button className="button signin-btn">Sign in</button>
      </div>
    </div>
  );
}


