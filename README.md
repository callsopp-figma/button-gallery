# Button Gallery

A React playground for the small details that make interfaces feel good. Nineteen original buttons, each with a different look and interaction.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open http://127.0.0.1:5173.

```sh
npm test         # Run interaction and source-export checks
npm run build    # Type-check and create a production build in dist/
npm run preview  # Serve the production build locally
```

## Explore

- Filter by Minimal, Playful, Motion, or Utility; search by name or behavior.
- Try magnetic hover, a tactile 3D press, animated glow, ripple, hold-to-confirm, loading/success, split buttons, and more.
- Save favorites locally in your browser with the heart on each card.
- Open the code inspector to try an isolated demo and copy its React/TypeScript component and CSS. Each copied demo uses only React and CSS.
- Switch between grid and list layouts, use the light/dark theme, or reduce motion from playground settings. System reduced-motion preferences are also respected.
- Press `/` to search and `Escape` to close the inspector or settings. Hold-to-confirm works with the pointer or by holding Space/Enter.

## Structure

- `src/Buttons.tsx` — independent interactive button components.
- `src/buttons.css` — shared button foundation and individually marked demo styles.
- `src/catalog.ts` — gallery metadata and source extraction for the inspector.
- `src/App.tsx` — filtering, favorites, settings, and the native dialog inspector.
- `src/styles.css` — responsive gallery layout and themes.

Built with React, TypeScript, Vite, and Lucide icons. Google Fonts provides DM Sans and Manrope, with system fallbacks. Favorites are stored only in localStorage; there is no backend or account setup.

## Dependency audit

Runtime dependencies pass `npm audit --omit=dev`. The development toolchain currently reports an upstream picomatch advisory with no patched version available in the registry. It is used by build/test file matching and is not included in the shipped app. Recheck with `npm audit` when updating dependencies.
