# TeamUp — Backend

Node.js + Express + MongoDB backend implementing every endpoint the frontend calls.

## Setup

1. Install MongoDB locally, or create a free cluster at mongodb.com/cloud/atlas
2. Copy `.env` and set `MONGO_URI` to your connection string (local default already set)
3. Install and run:

```bash
npm install
npm run dev
```

Server runs at http://localhost:8080 — check http://localhost:8080/api/health to confirm it's up.

## Endpoints

| Method | Route | Auth | User Story |
|---|---|---|---|
| POST | /api/auth/register | - | US-01 |
| POST | /api/auth/login | - | US-02 |
| POST | /api/auth/forgot-password | - | US-03 |
| POST | /api/auth/reset-password | - | US-03 |
| GET | /api/profile/me | ✓ | US-04 |
| PUT | /api/profile/me | ✓ | US-05 |
| POST | /api/profile/link-github | ✓ | US-06 |
| PUT | /api/profile/skills | ✓ | US-06 |
| POST | /api/teams | ✓ | US-07, 08 |
| GET | /api/teams/mine | ✓ | US-07 |
| GET | /api/teams/search | ✓ | US-10, 11, 12 |
| GET | /api/teams/:teamId | ✓ | — |
| PUT | /api/teams/:teamId | ✓ | US-09 |
| DELETE | /api/teams/:teamId | ✓ | — |
| POST | /api/teams/:teamId/requests | ✓ | US-13 |
| GET | /api/teams/:teamId/requests | ✓ | US-14 |
| PUT | /api/requests/:requestId | ✓ | US-15 |
| GET | /api/requests/mine | ✓ | US-13 |
| GET | /api/notifications | ✓ | US-16 |
| PUT | /api/notifications/:id/read | ✓ | US-17 |
| PUT | /api/notifications/read-all | ✓ | US-17 |

Routes marked "Auth ✓" require an `Authorization: Bearer <token>` header — the frontend's `api.js` already attaches this automatically after login.

## Connecting the frontend

In `teamup-frontend/.env`, make sure:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

Run both servers at the same time (two terminals): backend on :8080, frontend on :5173.
