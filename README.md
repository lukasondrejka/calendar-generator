# Calendar Generator

Web application for generating printable calendars in PDF, where every week is one row. Layout, date range, paper, language and other options can be adjusted with a live preview. The application is built with React, TypeScript and Vite and runs entirely in the browser – nothing is uploaded, settings are stored in local storage.

## Prerequisites

- Node.js

## Setup

Install dependencies

```sh
npm install
```

Run development server

```sh
npm run dev
```

## Scripts

- `npm run dev` - run development server with hot reloading
- `npm run build` - type check and build application (output in `dist` directory)
- `npm run preview` - serve built application locally
- `npm run lint` - run lint

The `dist` directory is a static site. For hosting on a subpath (e.g. GitHub Pages) build with `npx vite build --base ./`. The build reads the date and hash of the current git commit, shown in the About dialog.

## Resources

- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Vite](https://vite.dev) (build tool)
- [jsPDF](https://github.com/parallax/jsPDF) (PDF generation)
- [svg2pdf.js](https://github.com/yWorks/svg2pdf.js) (SVG rendering for jsPDF)
