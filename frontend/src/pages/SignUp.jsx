import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
    <div className="page-root">
      <div className="signup-container">
        <h2>Sign up</h2>
        <input type="text" placeholder="Nickname*" className="input" />
        <input type="password" placeholder="Password*" className="input" />
        <input type="email" placeholder="E-mail" className="input" />
        <Link className="button continue-btn" to="/nation">Continue</Link>
        <div className="divider"><span>OR</span></div>
        <div className="social-buttons">
          <button className="button social">Continue with Apple</button>
          <button className="button social">Continue with Google</button>
        </div>
        <p className="bottom-text">Already have an account? <a href="#">Sign in</a></p>
      </div>
    </div>
  );
}


