import { useCallback, useEffect, useMemo, useState } from 'react'

const WORDS = [
  'APPLE',
  'BEACH',
  'BLOOM',
  'BRAVE',
  'BRICK',
  'CHARM',
  'CLOUD',
  'CRANE',
  'DREAM',
  'FLAME',
  'FROST',
  'GHOST',
  'GRAPE',
  'HEART',
  'LIGHT',
  'MAPLE',
  'NIGHT',
  'OCEAN',
  'OLIVE',
  'PEARL',
  'PILOT',
  'PLANT',
  'PRIDE',
  'ROBIN',
  'SHORE',
  'SMILE',
  'SOLAR',
  'STONE',
  'TIGER',
  'TRAIL',
  'WATER',
]

const KEY_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']
const MAX_GUESSES = 6

type LetterState = 'correct' | 'present' | 'absent' | 'empty'

function getDailyWord() {
  const days = Math.floor(Date.now() / 86_400_000)
  return WORDS[days % WORDS.length]
}

function scoreGuess(guess: string, answer: string): LetterState[] {
  const result: LetterState[] = Array(5).fill('absent')
  const remaining: Record<string, number> = {}

  for (let i = 0; i < 5; i += 1) {
    if (guess[i] === answer[i]) result[i] = 'correct'
    else remaining[answer[i]] = (remaining[answer[i]] || 0) + 1
  }

  for (let i = 0; i < 5; i += 1) {
    if (result[i] === 'correct') continue
    if (remaining[guess[i]] > 0) {
      result[i] = 'present'
      remaining[guess[i]] -= 1
    }
  }
  return result
}

function Icon({ name }: { name: 'help' | 'refresh' }) {
  if (name === 'refresh') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 11a8 8 0 1 0-2.34 5.66M20 5v6h-6" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.8 9a2.3 2.3 0 1 1 3.7 1.83c-.94.69-1.5 1.1-1.5 2.17M12 17h.01" />
    </svg>
  )
}

function AppButton({
  children,
  className = '',
  label,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  label?: string
  onClick: () => void
}) {
  return (
    <button aria-label={label} className={className} onClick={onClick} type="button">
      {children}
    </button>
  )
}

export default function App() {
  const [answer, setAnswer] = useState(getDailyWord)
  const [guesses, setGuesses] = useState<string[]>([])
  const [current, setCurrent] = useState('')
  const [message, setMessage] = useState('Guess the hidden word in six tries.')
  const [showHelp, setShowHelp] = useState(false)
  const won = guesses.at(-1) === answer
  const finished = won || guesses.length === MAX_GUESSES

  const keyStates = useMemo(() => {
    const states: Record<string, LetterState> = {}
    const priority: Record<LetterState, number> = { empty: 0, absent: 1, present: 2, correct: 3 }
    guesses.forEach((guess) =>
      scoreGuess(guess, answer).forEach((state, index) => {
        const letter = guess[index]
        if (!states[letter] || priority[state] > priority[states[letter]]) states[letter] = state
      }),
    )
    return states
  }, [guesses, answer])

  const handleKey = useCallback(
    (key: string) => {
      if (finished) return
      if (key === 'ENTER') {
        if (current.length !== 5) {
          setMessage('Not enough letters')
          return
        }
        const next = [...guesses, current]
        setGuesses(next)
        setCurrent('')
        if (current === answer) setMessage('Beautiful. You found it!')
        else if (next.length === MAX_GUESSES) setMessage(`The word was ${answer}`)
        else setMessage('Keep going — use the clues.')
        return
      }
      if (key === 'BACKSPACE' || key === 'DELETE') {
        setCurrent((value) => value.slice(0, -1))
        return
      }
      if (/^[A-Z]$/.test(key) && current.length < 5) setCurrent((value) => value + key)
    },
    [answer, current, finished, guesses],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => handleKey(event.key.toUpperCase())
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleKey])

  function newGame() {
    const available = WORDS.filter((word) => word !== answer)
    setAnswer(available[Math.floor(Math.random() * available.length)])
    setGuesses([])
    setCurrent('')
    setMessage('A fresh word is ready.')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            W
          </span>
          <span className="brand-name">WORDLY</span>
        </div>
        <div className="header-actions">
          <AppButton className="icon-button" label="How to play" onClick={() => setShowHelp(true)}>
            <Icon name="help" />
          </AppButton>
          <AppButton className="new-game" onClick={newGame}>
            <Icon name="refresh" />
            New word
          </AppButton>
        </div>
      </header>

      <section className="game">
        <div className="eyebrow">DAILY WORD PUZZLE</div>
        <div className="title">Find the word</div>
        <div className="subtitle" aria-live="polite">
          {message}
        </div>

        <div className="board" aria-label="Word grid">
          {Array.from({ length: MAX_GUESSES }, (_, rowIndex) => {
            const guess = guesses[rowIndex] || (rowIndex === guesses.length ? current : '')
            const states = guesses[rowIndex]
              ? scoreGuess(guesses[rowIndex], answer)
              : Array(5).fill('empty')
            return (
              <div className="row" key={rowIndex}>
                {Array.from({ length: 5 }, (_, cellIndex) => (
                  <div
                    className={`tile ${states[cellIndex]} ${guess[cellIndex] ? 'filled' : ''}`}
                    key={cellIndex}
                    style={{ animationDelay: `${cellIndex * 90}ms` }}
                  >
                    {guess[cellIndex] || ''}
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        <div className="legend" aria-label="Color key">
          <span><i className="dot correct" />Right spot</span>
          <span><i className="dot present" />In the word</span>
          <span><i className="dot absent" />Not in word</span>
        </div>

        <div className="keyboard" aria-label="On-screen keyboard">
          {KEY_ROWS.map((row, rowIndex) => (
            <div className="key-row" key={row}>
              {rowIndex === 2 && (
                <AppButton className="key key-wide" onClick={() => handleKey('ENTER')}>
                  Enter
                </AppButton>
              )}
              {row.split('').map((letter) => (
                <AppButton
                  className={`key ${keyStates[letter] || ''}`}
                  key={letter}
                  label={`Letter ${letter}`}
                  onClick={() => handleKey(letter)}
                >
                  {letter}
                </AppButton>
              ))}
              {rowIndex === 2 && (
                <AppButton
                  className="key key-wide delete"
                  label="Delete letter"
                  onClick={() => handleKey('BACKSPACE')}
                >
                  Delete
                </AppButton>
              )}
            </div>
          ))}
        </div>
      </section>

      <footer>One word. Six tries. A new ritual for your day.</footer>

      {showHelp && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowHelp(false)}>
          <div
            aria-label="How to play"
            aria-modal="true"
            className="modal"
            role="dialog"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modal-kicker">HOW TO PLAY</div>
            <div className="modal-title">Guess the word in 6 tries</div>
            <p>Each guess must be five letters. The color of each tile reveals how close you are.</p>
            <div className="example">
              <span className="mini correct">W</span>
              <span>W is in the word and in the right spot.</span>
            </div>
            <div className="example">
              <span className="mini present">O</span>
              <span>O is in the word, but in another spot.</span>
            </div>
            <AppButton className="modal-button" onClick={() => setShowHelp(false)}>
              Start playing
            </AppButton>
          </div>
        </div>
      )}
    </main>
  )
}
