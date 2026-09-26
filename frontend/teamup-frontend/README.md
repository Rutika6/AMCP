# TeamUp — Frontend

React + Vite frontend for the TeamUp project (Agile TUT2 assignment).

## Setup

```bash
npm install
npm run dev
```

App runs at http://localhost:5173

## Backend

Set your backend API URL in `.env`:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

All API calls currently point to endpoints your backend team needs to implement, matching the User Stories:
- `/auth/register`, `/auth/login`, `/auth/forgot-password` — US-01, 02, 03
- `/profile/me`, `/profile/link-github`, `/profile/skills` — US-04, 05, 06
- `/teams`, `/teams/search`, `/teams/mine` — US-07 to 12
- `/teams/:id/requests`, `/requests/:id` — US-13, 14, 15
- `/notifications` — US-16, 17

## Folder Structure

See `src/` — organized by feature (pages/Auth, pages/Team, etc.) matching each Epic.
