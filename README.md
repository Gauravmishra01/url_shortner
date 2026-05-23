# URL Shortner

A simple, self-hosted URL shortening service with a React + Vite frontend and a Node.js + Express backend using MongoDB for persistence.

Features

- Create short URLs with optional custom aliases
- User authentication (register / login)
- Dashboard to manage user URLs
- QR code preview for generated links

Tech stack

- Frontend: React, Vite
- Backend: Node.js, Express
- Database: MongoDB (Atlas or local)

Repository layout

- `BACKEND/` — Express API and server code
- `FRONTEND/` — React app (Vite)
- `PRODUCTION_READINESS_CHECKLIST.md` — deployment checklist
- `BUG_FIX_REPORT.md` — known fixes and past issues

Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)

Environment
Create `.env` files for `BACKEND/` and `FRONTEND/` as needed. Example variables used by the backend:

- `PORT` — port to run the backend (default 3000)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing JWT tokens

Quickstart (Backend)

```powershell
cd BACKEND
npm install
npm run start
```

Quickstart (Frontend)

```powershell
cd FRONTEND
npm install
npm run dev -- --host localhost
```

Running tests

- Backend tests (if present) are under `BACKEND/tests/` — run with the backend test script if available.
- Frontend tests are under `FRONTEND/src/tests/`.

Development notes

- Backend entry: `BACKEND/app.js`
- Frontend entry: `FRONTEND/index.html` and `FRONTEND/src/main.jsx`

Cleaning up unused files
This repo contains some auxiliary files and scripts. See `CLEANUP_SUGGESTIONS.md` for a safe list of items you can remove after review.

Contribution

- Fork the repo, create a feature branch, open a pull request with a clear description and tests if applicable.

License

- See the `LICENSE` file at the repository root.

Contact

- For questions, open an issue or contact the maintainer.

--
This README was refreshed to provide clearer getting-started instructions. If you'd like, I can also apply the suggested cleanup changes automatically after your confirmation.
