# button-gallery

React + Vite project running inside Figma Make.

## Development server

A Vite development server is already managed by Figma Make. Do not start another one.

## Project structure

- `src/App.tsx` — gallery application and interactions
- `src/Buttons.tsx` — isolated interactive button components
- `src/catalog.ts` — gallery metadata and source extraction
- `src/buttons.css` — shared and demo-specific button styles
- `src/styles.css` — responsive gallery layout and themes
- `src/App.test.tsx` — interaction and source-export tests

Use npm and the scripts in `package.json`. Preserve the `// @demo` and `/* @demo */` markers when adding catalog entries because source extraction depends on them.
