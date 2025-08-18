import { useEffect, useRef, useState } from 'react'

function PageIntro({ onNext }) {
  return (
    <div className="page intro-page active">
      <div className="text-block">
        <div className="title">Just 5 questions<br/>Before you start!</div>
        <div className="subtitle">Fill Your Bowl with Your Favor</div>
      </div>
      <button className="button" onClick={onNext}>Go</button>
    </div>
  )
}

function TopBar({ step, progress, onBack }) {
  return (
    <div className="top">
      <div className="top-bar">
        <img src="/img/arrow.svg" alt="Back" className="back" onClick={onBack} />
        <span>{step} / 5</span>
      </div>
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div>
    </div>
  )
}

export default function Survey() {
  const [page, setPage] = useState(1)

  const next = () => setPage(p => Math.min(p + 1, 7))
  const prev = () => setPage(p => Math.max(1, p - 1))

  return (
    <div className="container">
      {page === 1 && <PageIntro onNext={() => setPage(2)} />}

      {page === 2 && (
        <div className="page question-page active">
          <TopBar step={1} progress={20} onBack={() => setPage(1)} />
          <div className="content">
            <div className="title1">What kind of meal<br/>are you most excited about<br/>on this trip?</div>
            <div className="options-group">
              <button className="option-outline1">A local hidden gem</button>
              <button className="option-outline1">A trendy spot</button>
              <button className="option-outline1">Traditional dining</button>
              <button className="option-outline1">Street food</button>
            </div>
          </div>
          <button className="button-gray" onClick={() => setPage(3)}>Next</button>
        </div>
      )}

      {page === 3 && (
        <div className="page question-page active">
          <TopBar step={2} progress={40} onBack={prev} />
          <div className="content">
            <div className="title1">How much<br/>do you enjoy spicy food?</div>
            <div className="subtitle1">Drag the plate to indicate your spice tolerance Level!</div>
            <SpiceSlider />
          </div>
          <button className="button-gray" onClick={() => setPage(4)}>Next</button>
        </div>
      )}

      {page === 4 && (
        <div className="page question-page active">
          <TopBar step={3} progress={60} onBack={prev} />
          <div className="content">
            <div className="title1">How open<br/>are you to trying new foods?</div>
            <div className="options-group">
              <button className="option-outline">Always ready to explore!</button>
              <button className="option-outline">A mix of familiar and new dishes</button>
              <button className="option-outline">Prefer familiar options</button>
            </div>
          </div>
          <button className="button-gray" onClick={() => setPage(5)}>Next</button>
        </div>
      )}

      {page === 5 && (
        <div className="page question-page active">
          <TopBar step={4} progress={80} onBack={prev} />
          <div className="content">
            <div className="title1">Is there any food<br/>you want to avoid?</div>
            <input className="input-text" placeholder="ex. Vegetarian, Halal..." />
          </div>
          <button className="button-gray" onClick={() => setPage(6)}>Next</button>
        </div>
      )}

      {page === 6 && (
        <div className="page question-page active">
          <TopBar step={5} progress={100} onBack={prev} />
          <div className="content">
            <div className="title1">What’s most important<br/>when choosing a restaurant?</div>
            <div className="options-group">
              <button className="option-outline1">Close to my location</button>
              <button className="option-outline1">Recommended by locals</button>
              <button className="option-outline1">Great ambiance</button>
              <button className="option-outline1">Affordable prices</button>
            </div>
          </div>
          <button className="button" onClick={() => setPage(7)}>Submit</button>
        </div>
      )}

      {page === 7 && (
        <div className="page question-page active">
          <TopBar step={5} progress={100} onBack={prev} />
          <div className="content">
            <div className="title" style={{ textAlign: 'center' }}>
              Your Preferences<br/>Have Been Identified!
            </div>
            <div className="subtitle" style={{ textAlign: 'center' }}>
              Your Bowl of Preferences is Complete!
            </div>
          </div>
          <button className="button">Start</button>
        </div>
      )}
      <BallLayer count={Math.max(0, Math.min(5, page - 1))} />
    </div>
  )
}

function SpiceSlider() {
  const [value, setValue] = useState(0)
  const max = 40
  const progress = `${(value / max) * 100}%`
  return (
    <input
      type="range"
      min="0"
      max={max}
      value={value}
      onChange={e => setValue(parseInt(e.target.value, 10))}
      className="slider"
      style={{ ['--progress']: progress }}
    />
  )
}

function BallLayer({ count }) {
  const layerRef = useRef(null)
  const bowlRef = useRef(null)
  const rafRef = useRef(0)
  const ballsRef = useRef([])
  const slotsRef = useRef([])
  const size = 16

  // 재계산: 그릇 크기 기반으로 슬롯 좌표(삼각형 쌓임) 생성
  function recomputeSlots() {
    const layer = layerRef.current
    const bowl = bowlRef.current
    if (!layer || !bowl) return
    const l = layer.getBoundingClientRect()
    const r = bowl.getBoundingClientRect()
    const bowlLeft = r.left - l.left
    const bowlTop = r.top - l.top
    const bowlWidth = r.width
    const bowlHeight = r.height

    // 그릇 안쪽 가장자리 보정치 (테두리 두께/입구 기울기 감안)
    const innerMarginX = Math.max(12, bowlWidth * 0.14)
    const innerMarginY = Math.max(10, bowlHeight * 0.22)
    const usableWidth = Math.max(0, bowlWidth - innerMarginX * 2)
    const startY = bowlTop + bowlHeight - innerMarginY - size
    const rowSpacing = size * 0.85
    const colSpacing = size + 4

    // 가장 아래 줄에 들어갈 수 있는 최대 개수 산출
    const maxInRow = Math.max(1, Math.floor(usableWidth / colSpacing))

    const rows = Math.max(3, Math.ceil((usableWidth / 2) / colSpacing))
    const slots = []
    for (let row = 0; row < rows; row++) {
      const count = Math.max(1, maxInRow - row)
      const rowY = startY - row * rowSpacing
      const rowWidth = (count - 1) * colSpacing
      const rowLeft = bowlLeft + (bowlWidth - rowWidth) / 2 - size / 2
      for (let i = 0; i < count; i++) {
        const x = rowLeft + i * colSpacing
        const y = rowY
        slots.push({ x, y, occupied: false })
      }
    }
    slotsRef.current = slots
  }

  // 창 크기/그릇 로드 시 슬롯 재계산
  useEffect(() => {
    const handle = () => recomputeSlots()
    window.addEventListener('resize', handle)
    recomputeSlots()
    return () => window.removeEventListener('resize', handle)
  }, [])

  // count 변경 시 공 개수를 동기화 (빈그릇→최대 5개)
  useEffect(() => {
    const target = Math.max(0, Math.min(5, count))
    // 제거 또는 추가
    if (ballsRef.current.length > target) {
      ballsRef.current = ballsRef.current.slice(0, target)
      render()
    } else if (ballsRef.current.length < target) {
      const toAdd = target - ballsRef.current.length
      for (let i = 0; i < toAdd; i++) spawnBall()
    }
  }, [count])

  // 루프
  useEffect(() => {
    let last = performance.now()
    const tick = (now) => {
      const dt = now - last
      last = now
      step(dt)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  function nextFreeSlot() {
    const s = slotsRef.current
    const idx = s.findIndex(sl => !sl.occupied)
    return idx === -1 ? s.length - 1 : idx
  }

  function spawnBall() {
    const layer = layerRef.current
    if (!layer) return
    if (slotsRef.current.length === 0) recomputeSlots()
    const idx = nextFreeSlot()
    if (idx < 0) return
    slotsRef.current[idx].occupied = true
    const target = slotsRef.current[idx]
    const rect = layer.getBoundingClientRect()
    const x0 = rect.width / 2 - size / 2
    const y0 = -size
    const ball = {
      id: Math.random().toString(36).slice(2),
      x: x0,
      y: y0,
      vy: 0,
      settled: false,
      tx: target.x,
      ty: target.y
    }
    ballsRef.current.push(ball)
    render()
  }

  function step(dt) {
    const gravity = 0.004 // px/ms^2
    const drag = 0.0008   // 공기 저항 근사
    let needsRender = false
    ballsRef.current.forEach((b) => {
      if (b.settled) return
      // target x 으로 서서히 수렴
      const dx = b.tx - b.x
      const k = 0.015 // 스프링 계수(수평)
      b.x += k * dx * dt

      // 중력
      b.vy += gravity * dt
      // 공기 저항
      b.vy *= (1 - drag * dt)
      b.y += b.vy * dt

      if (b.y >= b.ty) {
        b.y = b.ty
        b.vy = -b.vy * 0.35 // 살짝 더 탄력
        if (Math.abs(b.vy) < 0.06) {
          b.vy = 0
          b.x = b.tx
          b.settled = true
        }
      }
      needsRender = true
    })
    if (needsRender) render()
  }

  function render() {
    const layer = layerRef.current
    if (!layer) return
    const children = layer.querySelectorAll('.ball')
    children.forEach((el) => {
      const id = el.getAttribute('data-id')
      if (!ballsRef.current.find((b) => b.id === id)) el.remove()
    })
    ballsRef.current.forEach((b) => {
      let el = layer.querySelector(`.ball[data-id="${b.id}"]`)
      if (!el) {
        el = document.createElement('div')
        el.className = 'ball'
        el.setAttribute('data-id', b.id)
        layer.appendChild(el)
      }
      el.style.transform = `translate(${b.x}px, ${b.y}px)`
    })
  }

  return (
    <div className="ball-layer" ref={layerRef}>
      <div className="ball-bowl">
        {/* 뒤쪽 그릇 (subtract.svg) */}
        <img ref={bowlRef} src="/img/Subtract.svg" alt="bowl-back" className="bowl-back" onLoad={recomputeSlots} />
        {/* 공 렌더 영역: 이 영역의 mask로 공이 그릇 밖으로 보이지 않게 함 */}
        <div className="ball-field"></div>
        {/* 앞쪽 블러 마스크 레이어 */}
        <div className="bowl-front-blur"></div>
        {/* 앞쪽 그릇 라인: 동일 SVG를 재사용하거나 필요 시 제거 가능 (현재 제거) */}
      </div>
    </div>
  )
}


