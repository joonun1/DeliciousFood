import { useNavigate } from 'react-router-dom'

export default function Complete() {
  const nav = useNavigate()

  const onStart = () => {
    nav('/home')
  }

  return (
    <div className="page-root">
        <div className="entire-container">

        {/* 메인 콘텐츠 */}
        <div className="success-content">
          <h3 className="success-title">You’ve successfully</h3>
          <h3 className='success-title'> signed up!</h3>
          <p className="success-sub">
            Discover great restaurants with kkini!
          </p>
        </div>

        {/* 하단 버튼 */}
        <button onClick={onStart} className="button continue-btn">
          Start
        </button>
      </div>
    </div>
  )
}
