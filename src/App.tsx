import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, CheckCheck, Code2, Copy, Github, Heart, LayoutGrid, List, Moon, MousePointer2, RotateCcw, Search, SlidersHorizontal, Sparkles, Sun, X } from 'lucide-react'
import { categories, demos, getSource } from './catalog'
import type { Category, Demo } from './catalog'
import './buttons.css'

function readSaved(): string[] {
  try { const value: unknown = JSON.parse(localStorage.getItem('button-gallery-saved') || '[]'); return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [] } catch { return [] }
}

function Inspector({ demo, close }: { demo: Demo; close: () => void }) {
  const [tab, setTab] = useState<'component' | 'css'>('component')
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const [version, setVersion] = useState(0)
  const dialog = useRef<HTMLDialogElement>(null)
  const source = getSource(demo.id)
  useEffect(() => { const node = dialog.current; node?.showModal(); return () => node?.close() }, [])
  useEffect(() => { if (!copied) return; const timer = setTimeout(() => setCopied(false), 2000); return () => clearTimeout(timer) }, [copied])
  async function copy() { try { await navigator.clipboard.writeText(source[tab]); setCopied(true); setCopyError(false) } catch { setCopied(false); setCopyError(true) } }
  const Component = demo.Component
  return <dialog ref={dialog} className="inspector" aria-labelledby="inspector-title" onCancel={close} onClick={event => { if (event.target === event.currentTarget) close() }}>
    <div className="inspector-head"><div><span className="eyebrow">UNDER THE HOOD</span><h2 id="inspector-title">{demo.name}</h2></div><button className="icon-button" onClick={close} aria-label="Close inspector"><X size={20} /></button></div>
    <div className={`inspector-preview stage ${demo.stage}`}><Component key={version} /><button className="preview-reset icon-button" aria-label="Reset button demo" onClick={() => setVersion(version + 1)}><RotateCcw size={15} /></button></div>
    <div className="code-toolbar"><div className="code-tabs"><button className={tab === 'component' ? 'selected' : ''} onClick={() => setTab('component')}>React / TSX</button><button className={tab === 'css' ? 'selected' : ''} onClick={() => setTab('css')}>CSS</button></div><button className="copy-button" onClick={copy}>{copied ? <CheckCheck size={14} /> : <Copy size={14} />}{copied ? 'Copied!' : 'Copy code'}</button></div>
    <pre tabIndex={0}><code>{source[tab]}</code></pre>
    <p className="code-note" aria-live="polite">{copyError ? 'Clipboard access is unavailable. Select the code above and copy it manually.' : 'Copy the React component and CSS into your project. No extra dependencies needed.'}</p>
  </dialog>
}

export default function App() {
  const [category, setCategory] = useState<Category>('All buttons')
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState(readSaved)
  const [showSaved, setShowSaved] = useState(false)
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [dark, setDark] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [settings, setSettings] = useState(false)
  const [inspected, setInspected] = useState<Demo | null>(null)
  const [reset, setReset] = useState(0)
  const search = useRef<HTMLInputElement>(null)
  const settingsRoot = useRef<HTMLDivElement>(null)
  useEffect(() => { try { localStorage.setItem('button-gallery-saved', JSON.stringify(saved)) } catch { /* Bookmarks still work for this session. */ } }, [saved])
  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if (event.key === '/' && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement) && !document.querySelector('dialog[open]')) { event.preventDefault(); search.current?.focus() }
      if (event.key === 'Escape') setSettings(false)
    }
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  }, [])
  useEffect(() => {
    if (!settings) return
    function outside(event: PointerEvent) { if (!settingsRoot.current?.contains(event.target as Node)) setSettings(false) }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [settings])
  const filtered = demos.filter(demo => (category === 'All buttons' || category === demo.category) && (!showSaved || saved.includes(demo.id)) && `${demo.name} ${demo.category} ${demo.feel} ${demo.id}`.toLowerCase().includes(query.toLowerCase()))
  const toggleSaved = (id: string) => setSaved(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  return <div className={`app ${dark ? 'dark' : ''} ${reducedMotion ? 'reduce-motion' : ''}`}>
    <header className="site-header"><a href="#" className="brand" aria-label="Button Gallery home" onClick={() => { setShowSaved(false); setCategory('All buttons'); setQuery('') }}><span className="brand-icon"><MousePointer2 size={19} strokeWidth={1.8} /></span>button<span className="brand-light">gallery</span><span className="beta">BETA</span></a><nav aria-label="Main navigation"><button className={!showSaved ? 'nav-link active' : 'nav-link'} onClick={() => setShowSaved(false)}>The collection</button><button className={showSaved ? 'nav-link active' : 'nav-link'} onClick={() => setShowSaved(true)}>Saved <span className="nav-count">{saved.length}</span></button><span className="nav-divider" /><a className="github-link" href="https://github.com/callsopp-figma/button-gallery" target="_blank" rel="noreferrer" aria-label="View source on GitHub"><Github size={18} /><span>GitHub</span><ArrowUpRight size={13} /></a><button className="icon-button theme-toggle" onClick={() => setDark(!dark)} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button></nav></header>
    <main>
      <section className="hero"><div className="hero-copy"><div className="hero-kicker"><span className="status-dot" /> A COLLECTION MADE FOR CLICKING</div><h1>Small details.<br />Big <span className="feelings">feelings<svg viewBox="0 0 310 18" preserveAspectRatio="none" aria-hidden="true"><path d="M3 11C73 0 209 2 305 8M30 15C114 7 220 9 275 13" /></svg></span><span className="period">.</span></h1><p>A little gallery of buttons with a lot of personality.<br className="desktop-break" /> Explore the looks, feel the interactions, find your next favorite.</p><a className="explore-link" href="#collection">Go on, push some buttons <ArrowDown size={15} /></a></div><div className="hero-art" aria-hidden="true"><span className="art-orbit" /><span className="art-dot dot-one" /><span className="art-dot dot-two" /><span className="art-spark">✧</span><span className="art-label">a very good place to click</span><div className="art-button art-purple">just one more <Heart size={17} /></div><div className="art-button art-green">Click me <ArrowUpRight size={24} /></div><div className="art-button art-white"><span>✦</span> Feels good, right?</div><MousePointer2 className="art-cursor" fill="#2c3029" size={39} strokeWidth={1.2} /><span className="art-caption">100% clickable. 0% commitment.</span></div></section>
      <section id="collection" className="collection" aria-label="Button collection"><div className="collection-top"><div className="collection-heading"><h2>{showSaved ? 'Your favorites' : 'The collection'}</h2><span className="total-badge">{showSaved ? saved.length : demos.length}</span><span className="collection-description">{showSaved ? 'The ones that clicked with you.' : 'Different by design. Delightful by default.'}</span></div><div className="collection-tools"><div className="live-label"><span /> Live playground</div><div className="settings-root" ref={settingsRoot}><button className={`icon-button settings-button ${settings ? 'selected' : ''}`} aria-label="Playground settings" aria-expanded={settings} onClick={() => setSettings(!settings)}><SlidersHorizontal size={16} /></button>{settings && <div className="settings-popover"><span className="eyebrow">PLAYGROUND</span><label><input type="checkbox" checked={reducedMotion} onChange={event => setReducedMotion(event.target.checked)} /> Reduce motion</label><button onClick={() => { setReset(reset + 1); setSettings(false) }}><RotateCcw size={14} /> Reset all demos</button></div>}</div></div></div>
      <div className="filter-bar"><div className="category-tabs" aria-label="Filter by category">{categories.map(item => <button key={item} aria-pressed={category === item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item === 'All buttons' && <LayoutGrid size={13} />}{item}</button>)}</div><div className="filter-right"><div className="search-box"><Search size={15} /><input ref={search} aria-label="Search buttons" placeholder="Find your button…" value={query} onChange={event => setQuery(event.target.value)} />{query ? <button aria-label="Clear search" onClick={() => setQuery('')}><X size={13} /></button> : <kbd>/</kbd>}</div><div className="view-switch" aria-label="Gallery layout"><button aria-pressed={layout === 'grid'} className={layout === 'grid' ? 'selected' : ''} aria-label="Grid view" onClick={() => setLayout('grid')}><LayoutGrid size={15} /></button><button aria-pressed={layout === 'list'} className={layout === 'list' ? 'selected' : ''} aria-label="List view" onClick={() => setLayout('list')}><List size={16} /></button></div></div></div>
      <div className="results-info"><span aria-live="polite">{filtered.length} {filtered.length === 1 ? 'button' : 'buttons'} to play with</span><span><MousePointer2 size={12} /> Hover, click, hold. See what happens.</span></div>
      <div className={`gallery ${layout}`} key={reset}>{filtered.map((demo, index) => <article className="button-card" key={demo.id}><div className={`stage ${demo.stage}`}><span className="demo-number">{String(demos.indexOf(demo) + 1).padStart(2, '0')}</span><button className={`save-button ${saved.includes(demo.id) ? 'is-saved' : ''}`} aria-label={`${saved.includes(demo.id) ? 'Unsave' : 'Save'} ${demo.name}`} aria-pressed={saved.includes(demo.id)} onClick={() => toggleSaved(demo.id)}><Heart size={15} fill={saved.includes(demo.id) ? 'currentColor' : 'none'} /></button><demo.Component /></div><div className="card-info"><div><h3>{demo.name}</h3><p>{demo.feel}</p></div><button className="code-button" onClick={() => setInspected(demo)} aria-label={`View code for ${demo.name}`}><Code2 size={16} /><span>Code</span></button></div><span className="sr-only">Result {index + 1}</span></article>)}</div>
      {!filtered.length && <div className="empty-state"><Search size={28} /><h3>{showSaved && !saved.length ? 'Keep a little inspiration.' : 'No buttons found.'}</h3><p>{showSaved && !saved.length ? 'Tap the heart on any button to save it here.' : 'Try a different search or explore another category.'}</p><button onClick={() => { setQuery(''); setCategory('All buttons'); setShowSaved(false) }}><ArrowLeft size={15} /> Back to the collection</button></div>}
      <div className="collection-end"><span className="end-line" /><span><Sparkles size={14} /> {query || category !== 'All buttons' || showSaved ? 'Every click has a little character.' : 'Good design is a feeling. Sometimes it’s a button.'}</span><span className="end-line" /></div>
      <aside className="bottom-note"><div className="note-icon"><Code2 size={22} /></div><div><h3>Found something that clicks?</h3><p>Every button is built with React & CSS. Peek under the hood and make it yours.</p></div><a href="https://github.com/callsopp-figma/button-gallery" target="_blank" rel="noreferrer">Explore the source <ArrowRight size={15} /></a></aside>
      </section>
    </main>
    <footer><a className="footer-brand" href="#"><MousePointer2 size={14} /> button gallery</a><span>Made for the love of the little things.</span><span className="footer-status"><Check size={12} /> React + CSS + a little curiosity</span></footer>
    {inspected && <Inspector key={inspected.id} demo={inspected} close={() => setInspected(null)} />}
  </div>
}
