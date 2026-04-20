# Vercel Options

Checked against Vercel docs on April 20, 2026.

## This repo

- Frontend: `web/` (Create React App)
- Backend: `backend/` (Express)

## Realistic options

### 1. Two Vercel projects, frontend calls backend directly

- Deploy `web/` and `backend/` as separate Vercel projects
- Frontend calls `https://your-backend.vercel.app/openai`
- Use a frontend env var for the backend URL
- Backend needs CORS

Best if:

- You want the smallest change from the current structure

Docs:

- https://vercel.com/docs/monorepos
- https://vercel.com/guides/using-express-with-vercel
- https://vercel.com/docs/environment-variables
- https://vercel.com/guides/how-to-enable-cors

### 2. Two Vercel projects, frontend uses rewrites

- Deploy `web/` and `backend/` separately
- Frontend calls `/api/openai`
- Frontend `vercel.json` rewrites `/api/:path*` to the backend project

Best if:

- You want separate projects but cleaner frontend API calls

Docs:

- https://vercel.com/docs/rewrites
- https://vercel.com/docs/routing/
- https://vercel.com/docs/monorepos

### 3. One Vercel project, move backend routes into Vercel Functions

- Move the Express endpoints into Vercel Functions
- Frontend calls same-origin routes like `/api/openai`
- No CORS between frontend and backend

Best if:

- You want the cleanest final setup on Vercel

Docs:

- https://vercel.com/docs/functions/
- https://vercel.com/docs/functions/runtimes
- https://vercel.com/docs/frameworks/backend

## Quick fixes

### Local backend only

- Run `node backend/server/index.js`
- Keep the computer awake
- Works only for you on the machine running `localhost:3001`

### Tunnel your local backend

- Keep the backend running locally
- Expose it with a public tunnel URL
- Temporary, but other people can use it

### Deploy backend first

- Deploy `backend/` as its own Vercel project
- Change the frontend away from `http://localhost:3001`
- Fastest real fix for sharing the app

## Recommendation

For this project:

1. Fastest proper fix: option 1
2. Cleanest without major refactor: option 2
3. Cleanest long-term setup: option 3
