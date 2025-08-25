import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

import Onboarding from './pages/Onboarding.jsx'
import SignUp from './pages/SignUp.jsx'
import Nation from './pages/Nation.jsx'
import Language from './pages/Language.jsx'
import Survey from './pages/Survey.jsx'
import Login from './pages/Login.jsx'
import Complete from './pages/Complete.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/nation" element={<Nation />} />
        <Route path="/language" element={<Language />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/login" element={<Login />} />
        <Route path="/complete" element={<Complete />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
