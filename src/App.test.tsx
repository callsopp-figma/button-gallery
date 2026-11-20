import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import { Hold, Like, Loading, Split, Toggle } from './Buttons'
import { demos, getSource } from './catalog'

describe('gallery workflows', () => {
  it('shows all 19 demos, combines category and search, and clears an empty result', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getAllByRole('article')).toHaveLength(19)
    expect(screen.getByRole('button', { name: 'Test 54962' })).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Motion' }))
    expect(screen.getAllByRole('article')).toHaveLength(5)
    await user.type(screen.getByRole('textbox', { name: 'Search buttons' }), 'ripple')
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByRole('heading', { name: 'The ripple effect' })).toBeTruthy()
    await user.type(screen.getByRole('textbox'), 'no matches')
    expect(screen.queryAllByRole('article')).toHaveLength(0)
    await user.click(screen.getByRole('button', { name: 'Back to the collection' }))
    expect(screen.getAllByRole('article')).toHaveLength(19)
  })

  it('persists saved favorites across remounts and removes them', async () => {
    const user = userEvent.setup()
    const view = render(<App />)
    await user.click(screen.getByRole('button', { name: 'Save The everyday' }))
    expect(JSON.parse(localStorage.getItem('button-gallery-saved')!)).toEqual(['classic'])
    view.unmount()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^Saved/ }))
    expect(screen.getAllByRole('article')).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Unsave The everyday' }))
    expect(screen.getByText('Keep a little inspiration.')).toBeTruthy()
  })

  it('inspects a demo and copies both complete component source and CSS', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'View code for The ripple effect' }))
    const dialog = screen.getByRole('dialog', { name: 'The ripple effect' })
    expect(within(dialog).getByText(/export function Ripple/)).toBeTruthy()
    const copy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    await user.click(within(dialog).getByRole('button', { name: 'Copy code' }))
    expect(copy).toHaveBeenLastCalledWith(getSource('ripple').component)
    await user.click(within(dialog).getByRole('button', { name: 'CSS' }))
    await user.click(within(dialog).getByRole('button', { name: /Copied|Copy code/ }))
    expect(copy).toHaveBeenLastCalledWith(getSource('ripple').css)
    await user.click(within(dialog).getByRole('button', { name: 'Close inspector' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('supplies isolated source and matching styles for every demo', () => {
    for (const demo of demos) {
      const source = getSource(demo.id)
      expect(source.component).toContain(`export function ${demo.Component.name}(`)
      expect(source.css).toContain('.demo-button')
      expect(source.css).toContain(`.${demo.id === 'toggle' ? 'toggle-control' : demo.id === 'split' ? 'split-wrap' : demo.id}`)
      expect(source.component).not.toContain('// @end')
    }
  })

  it('resets demo state through playground settings', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /Hello, world/ }))
    expect(screen.getByRole('button', { name: /Lovely choice/ })).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Playground settings' }))
    await user.click(screen.getByRole('button', { name: 'Reset all demos' }))
    expect(screen.getByRole('button', { name: /Hello, world/ })).toBeTruthy()
  })
})

describe('stateful buttons', () => {
  it('toggles the like count and accessible switch state', async () => {
    const user = userEvent.setup()
    render(<><Like /><Toggle /></>)
    await user.click(screen.getByRole('button', { name: /Send some love/ }))
    expect(screen.getByRole('button', { name: /Loved.*129/ }).getAttribute('aria-pressed')).toBe('true')
    const toggle = screen.getByRole('switch')
    expect(toggle.getAttribute('aria-checked')).toBe('true')
    await user.click(toggle)
    expect(toggle.getAttribute('aria-checked')).toBe('false')
  })

  it('transitions from idle to loading to success and back', () => {
    vi.useFakeTimers()
    render(<Loading />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button').hasAttribute('disabled')).toBe(true)
    act(() => vi.advanceTimersByTime(1400))
    expect(screen.getByRole('button').textContent).toContain('All taken care of')
    act(() => vi.advanceTimersByTime(2200))
    expect(screen.getByRole('button').textContent).toContain('Make it happen')
  })

  it('cancels short holds, confirms a full keyboard hold, and keeps success on release', () => {
    vi.useFakeTimers()
    render(<Hold />)
    const button = screen.getByRole('button')
    fireEvent.keyDown(button, { key: ' ' })
    act(() => vi.advanceTimersByTime(600))
    fireEvent.keyUp(button, { key: ' ' })
    act(() => vi.advanceTimersByTime(1000))
    expect(button.textContent).toContain('Hold to confirm')
    fireEvent.keyDown(button, { key: 'Enter' })
    act(() => vi.advanceTimersByTime(1200))
    fireEvent.keyUp(button, { key: 'Enter' })
    fireEvent.click(button)
    expect(button.textContent).toContain('Confirmed')
    fireEvent.keyDown(button, { key: 'Enter' })
    expect(button.textContent).toContain('Hold to confirm')
  })

  it('opens split options, saves a selection, and dismisses on Escape', async () => {
    const user = userEvent.setup()
    render(<Split />)
    await user.click(screen.getByRole('button', { name: 'Save options' }))
    await user.click(screen.getByRole('button', { name: 'Save to collection' }))
    expect(screen.getByRole('button', { name: 'Saved ✓' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Save to collection' })).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Save options' }))
    await user.keyboard('{Escape}')
    expect(screen.getByRole('button', { name: 'Save options' }).getAttribute('aria-expanded')).toBe('false')
  })
})
