import * as Buttons from './Buttons'
import rawComponents from './Buttons.tsx?raw'
import rawStyles from './buttons.css?raw'

export const categories = ['All buttons', 'Minimal', 'Playful', 'Motion', 'Utility'] as const
export type Category = typeof categories[number]
export const demos = [
  { id: 'classic', name: 'The everyday', category: 'Minimal', feel: 'Clean & confident', stage: 'sage', Component: Buttons.Classic },
  { id: 'lift', name: 'A little push', category: 'Playful', feel: 'Tactile · 3D press', stage: 'peach', Component: Buttons.Lift },
  { id: 'glow', name: 'After hours', category: 'Motion', feel: 'Soft neon · Glow', stage: 'night', Component: Buttons.Glow },
  { id: 'slide', name: 'On the move', category: 'Motion', feel: 'Directional · Hover fill', stage: 'cream', Component: Buttons.Slide },
  { id: 'like', name: 'Love at first click', category: 'Playful', feel: 'Expressive · Toggle', stage: 'pink', Component: Buttons.Like },
  { id: 'magnetic', name: 'Natural attraction', category: 'Motion', feel: 'Magnetic · Follows you', stage: 'lavender', Component: Buttons.Magnetic },
  { id: 'loading', name: 'Worth the wait', category: 'Utility', feel: 'Loading → Success', stage: 'blue', Component: Buttons.Loading },
  { id: 'toggle', name: 'A change of state', category: 'Utility', feel: 'Switch · On / off', stage: 'sage', Component: Buttons.Toggle },
  { id: 'ripple', name: 'The ripple effect', category: 'Motion', feel: 'Fluid · Click anywhere', stage: 'lilac', Component: Buttons.Ripple },
  { id: 'hold', name: 'A moment of intention', category: 'Utility', feel: 'Hold · Confirm', stage: 'sand', Component: Buttons.Hold },
  { id: 'glass', name: 'Clear intentions', category: 'Minimal', feel: 'Glass · Translucent', stage: 'glass-stage', Component: Buttons.Glass },
  { id: 'pixel', name: 'Player one', category: 'Playful', feel: 'Retro · Pixel press', stage: 'pixel-stage', Component: Buttons.Pixel },
  { id: 'jelly', name: 'Soft spot', category: 'Playful', feel: 'Bouncy · Squish', stage: 'yellow', Component: Buttons.Jelly },
  { id: 'orbit', name: 'Out of this world', category: 'Motion', feel: 'Orbital · Animated border', stage: 'night', Component: Buttons.Orbit },
  { id: 'split', name: 'Keep your options open', category: 'Utility', feel: 'Split · Dropdown', stage: 'cream', Component: Buttons.Split },
  { id: 'tactile', name: 'Power trip', category: 'Utility', feel: 'Hardware · Toggle', stage: 'gray', Component: Buttons.Tactile },
  { id: 'gradient', name: 'A brighter idea', category: 'Playful', feel: 'Gradient · Color shift', stage: 'pink', Component: Buttons.Gradient },
  { id: 'minimal', name: 'Quietly confident', category: 'Minimal', feel: 'Understated · Underline', stage: 'sage', Component: Buttons.Minimal },
  { id: 'test-3578', name: 'Test 3578', category: 'Minimal', feel: 'Bold · Direct', stage: 'cream', Component: Buttons.Test3578 },
] as const
export type Demo = typeof demos[number]
export function getSource(id: string) {
  const component = rawComponents.split(`// @demo ${id}\n`)[1]?.split('// @end')[0]?.trim() ?? ''
  const css = rawStyles.split(`/* @demo ${id} */`)[1]?.split('/* @end */')[0]?.trim() ?? ''
  const shared = rawStyles.split('/* @shared */')[1]?.split('/* @end */')[0]?.trim() ?? ''
  const hooks = ['useEffect', 'useRef', 'useState'].filter(hook => component.includes(hook))
  return { component: `${hooks.length ? `import { ${hooks.join(', ')} } from 'react'\n` : ''}import './button.css'\n\n${component}`, css: `${shared}\n\n${css}\n\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }\n}` }
}
