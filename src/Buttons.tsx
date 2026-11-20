import { useEffect, useRef, useState } from 'react'

// @demo classic
export function Classic() {
  const [done, setDone] = useState(false)
  return <button className="demo-button classic" onClick={() => setDone(!done)}>{done ? 'Lovely choice ✓' : 'Hello, world'} <span>↗</span></button>
}
// @end

// @demo lift
export function Lift() {
  const [count, setCount] = useState(0)
  return <button className="demo-button lift" onClick={() => setCount(count + 1)}>{count ? `That’s ${count} clicks!` : 'Give me a click'} <span>↗</span></button>
}
// @end

// @demo glow
export function Glow() {
  const [on, setOn] = useState(false)
  return <button className="demo-button glow" aria-pressed={on} onClick={() => setOn(!on)}>{on ? '✧ You’re glowing' : '✧ A little magic'}</button>
}
// @end

// @demo slide
export function Slide() {
  const [done, setDone] = useState(false)
  return <button className="demo-button slide" onClick={() => setDone(!done)}><span>{done ? 'You’re on your way' : 'Let’s go somewhere'}</span><span aria-hidden="true">↗</span></button>
}
// @end

// @demo like
export function Like() {
  const [liked, setLiked] = useState(false)
  return <button className={`demo-button like ${liked ? 'is-liked' : ''}`} aria-pressed={liked} onClick={() => setLiked(!liked)}><span className="heart" aria-hidden="true">{liked ? '♥' : '♡'}</span>{liked ? 'Loved' : 'Send some love'}<span className="like-count">{liked ? 129 : 128}</span></button>
}
// @end

// @demo magnetic
export function Magnetic() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [clicked, setClicked] = useState(false)
  return <button className="demo-button magnetic" style={{ transform: `translate(${position.x}px, ${position.y}px)` }} onPointerMove={event => {
    if (event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    setPosition({ x: (event.clientX - box.left - box.width / 2) * .25, y: (event.clientY - box.top - box.height / 2) * .35 })
  }} onPointerLeave={() => setPosition({ x: 0, y: 0 })} onClick={() => setClicked(!clicked)}>{clicked ? 'Good chemistry ↗' : 'Feeling drawn in ↗'}</button>
}
// @end

// @demo loading
export function Loading() {
  const [state, setState] = useState('idle')
  useEffect(() => {
    if (state === 'idle') return
    const timer = window.setTimeout(() => setState(state === 'loading' ? 'done' : 'idle'), state === 'loading' ? 1400 : 2200)
    return () => window.clearTimeout(timer)
  }, [state])
  return <button className={`demo-button loading ${state}`} disabled={state === 'loading'} onClick={() => setState('loading')}><span aria-live="polite">{state === 'loading' ? <><i className="spinner" /> Making it happen</> : state === 'done' ? '✓ All taken care of' : 'Make it happen ↗'}</span></button>
}
// @end

// @demo toggle
export function Toggle() {
  const [enabled, setEnabled] = useState(true)
  return <button className={`toggle-control ${enabled ? 'is-on' : ''}`} role="switch" aria-checked={enabled} aria-label="Good vibes" onClick={() => setEnabled(!enabled)}><span className="switch-track"><span /></span><span>Good vibes {enabled ? 'on' : 'off'}</span></button>
}
// @end

// @demo ripple
export function Ripple() {
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null)
  return <button className="demo-button ripple" onClick={event => {
    const box = event.currentTarget.getBoundingClientRect()
    setRipple({ x: event.detail ? event.clientX - box.left : box.width / 2, y: event.detail ? event.clientY - box.top : box.height / 2, id: Date.now() })
  }}>{ripple && <i key={ripple.id} style={{ left: ripple.x, top: ripple.y }} />}<span>Make a little wave ◎</span></button>
}
// @end

// @demo hold
export function Hold() {
  const [holding, setHolding] = useState(false)
  const [done, setDone] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stop = () => { if (timer.current) clearTimeout(timer.current); setHolding(false) }
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  const start = () => {
    if (done) { setDone(false); return }
    if (timer.current) return
    setHolding(true)
    timer.current = setTimeout(() => { setDone(true); setHolding(false); timer.current = null }, 1200)
  }
  const release = () => { stop(); timer.current = null }
  return <button className={`demo-button hold ${holding ? 'is-holding' : ''} ${done ? 'is-done' : ''}`} onPointerDown={event => { if (event.button !== 0) return; event.currentTarget.setPointerCapture(event.pointerId); start() }} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release} onBlur={release} onKeyDown={event => { if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); if (!event.repeat) start() } }} onKeyUp={event => { if (event.key === ' ' || event.key === 'Enter') release() }}><span aria-live="polite">{done ? '✓ Confirmed · reset' : holding ? 'Almost there…' : '◉ Hold to confirm'}</span></button>
}
// @end

// @demo glass
export function Glass() {
  const [open, setOpen] = useState(false)
  return <button className="demo-button glass" aria-pressed={open} onClick={() => setOpen(!open)}>{open ? 'You’re in ✧' : 'Through the looking glass'}<span>↗</span></button>
}
// @end

// @demo pixel
export function Pixel() {
  const [playing, setPlaying] = useState(false)
  return <button className="demo-button pixel" aria-pressed={playing} onClick={() => setPlaying(!playing)}>{playing ? 'Ⅱ PAUSE GAME' : '▶ PRESS START'}</button>
}
// @end

// @demo jelly
export function Jelly() {
  const [bounce, setBounce] = useState(0)
  return <button key={bounce} className={`demo-button jelly ${bounce ? 'bouncing' : ''}`} onClick={() => setBounce(bounce + 1)}>Boop me <span>✿</span></button>
}
// @end

// @demo orbit
export function Orbit() {
  const [active, setActive] = useState(false)
  return <button className={`demo-button orbit ${active ? 'is-active' : ''}`} aria-pressed={active} onClick={() => setActive(!active)}><span>{active ? '✧ In another orbit' : 'Something cosmic ✧'}</span></button>
}
// @end

// @demo split
export function Split() {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('Save for later')
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const dismiss = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [open])
  return <div ref={root} className="split-wrap" onKeyDown={event => { if (event.key === 'Escape') setOpen(false) }}><div className="split"><button onClick={() => setLabel('Saved ✓')}>{label}</button><button aria-label="Save options" aria-expanded={open} onClick={() => setOpen(!open)}>⌄</button></div>{open && <div className="split-options">{['Save to favorites', 'Save to collection'].map(option => <button key={option} onClick={() => { setLabel('Saved ✓'); setOpen(false) }}>{option}</button>)}</div>}</div>
}
// @end

// @demo tactile
export function Tactile() {
  const [on, setOn] = useState(false)
  return <button className={`tactile ${on ? 'is-on' : ''}`} aria-label="Power" aria-pressed={on} onClick={() => setOn(!on)}><span>⏻</span><i /></button>
}
// @end

// @demo gradient
export function Gradient() {
  const [active, setActive] = useState(false)
  return <button className="demo-button gradient" aria-pressed={active} onClick={() => setActive(!active)}>{active ? 'The future looks bright ✧' : 'Meet your next idea ✧'}</button>
}
// @end

// @demo minimal
export function Minimal() {
  const [count, setCount] = useState(0)
  return <button className="demo-button minimal" onClick={() => setCount(count + 1)}>{count ? `One more thing (${count})` : 'Less, but better'}<span>↗</span></button>
}
// @end

// @demo test91537
export function Test91537() {
  return <button className="demo-button test91537">Test 91537</button>
}
// @end
