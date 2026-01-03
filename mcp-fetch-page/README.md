# mcp-fetch-page

Minimal Node.js project scaffold for fetching and processing web pages.

## Scripts

- `npm start` — run the app (`node ./src/index.js`)
- `npm run dev` — run in development with `nodemon`
 
After the TypeScript => ESM conversion, use:

- `npm run dev` — run the app directly from `src/index.mts` using the ts-node ESM loader (`node --loader ts-node/esm src/index.mts`)
- `npm run build` — compile TypeScript to ESM JavaScript in `./dist`
- `npm start` — run the compiled ESM build (`node ./dist/index.js`)

## Usage

1. Install dependencies: `npm install`
2. Run: `npm start` or `npm run dev`

