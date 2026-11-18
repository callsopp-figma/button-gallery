import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
afterEach(() => { cleanup(); localStorage.clear(); vi.useRealTimers() })
Object.defineProperty(window, 'matchMedia', { writable: true, value: () => ({ matches: false }) })
HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }
HTMLElement.prototype.setPointerCapture = () => {}
