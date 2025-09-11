## Expense Tracker (Full‑Stack)

A full‑stack expense tracking application with a React (Vite) frontend and a Node.js/Express/MongoDB backend. Features authentication, groups, contacts, expenses, and bills.

### Monorepo structure
- `backend/` — Express API, MongoDB models, auth, email, and resource routes
- `ExpenseTracker/` — React app (Vite), Redux Toolkit store and feature pages

### Tech stack
- Frontend: React, React Router, Redux Toolkit, Vite
- Backend: Node.js, Express, Mongoose, JWT auth
- Email: Nodemailer (SMTP)
- DB: MongoDB Atlas or local MongoDB

### Prerequisites
- Node.js 18+ and npm
- MongoDB connection string (Atlas or local)

### Quick start
1) Install dependencies
```bash
# backend
cd backend
npm install

# frontend
cd ../ExpenseTracker
npm install
```

2) Configure environment (backend)
Create `backend/.env` with:
```bash
PORT=7000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here

# SMTP for email (recommended to use app passwords / provider secrets)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=you@example.com
SMTP_PASS=your_smtp_password
```

3) Run the apps (two terminals)
```bash
# Terminal A (backend)
cd backend
npm run start   # uses nodemon; if missing, run: npm i -D nodemon
# or: node server.js

# Terminal B (frontend)
cd ExpenseTracker
npm run dev
```

Frontend runs on `http://localhost:5173`. Backend defaults to `http://localhost:7000` and allows CORS from `5173`.

### Environment variables (backend)
- `PORT` — API port (default 7000)
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing JWTs
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` — SMTP credentials used by Nodemailer

Note: The sample transport currently targets Gmail SMTP. Prefer provider secrets and app‑passwords; never commit real credentials.

### Available scripts
- Backend (`backend/package.json`):
  - `start`: `nodemon server.js`
  - `dev`: `npm --watch server.js` (Node watch)
- Frontend (`ExpenseTracker/package.json`):
  - `dev`: Vite dev server
  - `build`: Vite production build
  - `preview`: Preview built app
  - `lint`: Run ESLint

### API overview (backend)
Base URL: `http://localhost:<PORT>`
- `POST /auth/...` — authentication endpoints
- `GET/POST/PUT/DELETE /Home/...` — grouped resource routes:
  - Expenses: `/Home/...` via `expenseRouter`
  - Groups: `/Home/...` via `GroupRouter`
  - Contacts: `/Home/...` via `contactRouter`
  - Bills: `/Home/...` via `billRouter`

Review the routers in `backend/Routes/` and controllers in `backend/controller/` for exact request/response shapes.

### Frontend
- Entry: `ExpenseTracker/src/main.jsx`
- App shell: `ExpenseTracker/src/App.jsx`
- State: `ExpenseTracker/src/store/`
- Views: `ExpenseTracker/src/pages/` and `ExpenseTracker/src/component/`

Update the API base URLs inside components or services if you deploy the backend.

### Building & deploying
Frontend build:
```bash
cd ExpenseTracker
npm run build
# Output in: ExpenseTracker/dist
```
Serve the `dist` directory with any static host. Ensure the frontend points to your deployed API URL.

Backend deploy: supply the same `.env` variables on your host (Render, Railway, Fly.io, etc.). Ensure `CORS` origin matches your frontend origin.

### Troubleshooting
- Backend not starting: verify `MONGODB_URI` and network access; check that `nodemon` is installed or use `node server.js`.
- 401/403 responses: ensure `JWT_SECRET` matches across sign/verify and that cookies/headers are sent correctly from the frontend.
- Email not sending: confirm SMTP credentials and less‑secure/app‑password settings. Log the transporter options and check provider logs.
- CORS errors: update `origin` in `backend/server.js` to your actual frontend URL.

### Screenshots & assets
Example navigation and icons are in `ExpenseTracker/public/`. A header image (`Header.png`) is present at the repo root.

### Notes
- There is an additional `CONTACT_SECTION_README.md` with context specific to the contacts feature.
- Replace any hard‑coded credentials in source with environment variables before production.

### License
This project is provided as‑is for educational use. Add your preferred license here.


