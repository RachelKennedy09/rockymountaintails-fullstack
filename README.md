# Rocky Mountain Tails

A full-stack dog walking website with a protected Walk Reports/Notes area for logged-in users.

- Public marketing site (browse services, learn about the business)
- Authentication (register, login, logout)
- Protected notes area (create, view, edit, delete walk reports)
- MongoDB persistence (Mongoose)
- Sessions stored in MongoDB (connect-mongo)

## Features

- Public marketing pages for services and business info
- User registration, login, and logout
- Auth-protected walk reports/notes CRUD
- Session-based auth stored in MongoDB
- Server-rendered views with EJS

## Tech Stack

- Node.js + Express
- MongoDB Atlas + Mongoose
- EJS (server-rendered views)
- express-session + connect-mongo
- HTML/CSS/JS (public marketing UI)

## Live Demo

- Live site: https://YOUR-RENDER-URL.onrender.com

## Local Setup

1) Clone the repo

```bash
git clone https://github.com/RachelKennedy09/rockymountaintails-fullstack.git
cd RockyMountainTails-main
```

2) Install dependencies

```bash
npm install
```

3) Create a `.env` file in the project root

Create a file named `.env` beside `server.js`:

```env
MONGO_URI=your_mongodb_atlas_connection_string
SESSION_SECRET=some_long_random_secret
NODE_ENV=development
```

Notes:
- `MONGO_URI` comes from MongoDB Atlas: Connect -> Drivers
- `SESSION_SECRET` can be any long random string (keep it private)


4) Start the server

```bash
npm start
```

5) Open the app

- Marketing site: http://localhost:3000
- Login: http://localhost:3000/login
- Register: http://localhost:3000/register
- Notes (requires login): http://localhost:3000/notes

## Deployment (Render)

1) Push to GitHub

```bash
git status
git push origin main
```

2) Create a Render Web Service

- Render Dashboard -> New -> Web Service
- Connect your GitHub repo
- Build Command: `npm install`
- Start Command: `npm start`

Make sure your Express server listens on the Render port:

```js
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));
```

3) Add environment variables in Render

- `MONGO_URI` = your MongoDB Atlas connection string
- `SESSION_SECRET` = long random secret
- `NODE_ENV` = `production`

4) MongoDB Atlas Network Access

Atlas must allow connections from Render.

- Atlas -> Security -> Network Access -> IP Access List
- For quick testing, allow all: `0.0.0.0/0` (not recommended long-term)

## Requirements
- Node.js 18+ recommended
- MongoDB Atlas cluster (free tier works)

## Troubleshooting

- “MongoNetworkError / IP not allowed” → update Atlas Network Access

- “MONGO_URI missing” → check .env location and spelling

- “Cannot find module” → run npm install
## How Authentication Works

- Sessions are stored in MongoDB via `connect-mongo`
- Logged-in status is tracked via `req.session.userId`
- Notes routes are protected by auth middleware

## Future Improvements

- Forgot password flow
- Per-user notes permissions (walkers only see their own)
- Cleaner nav UX (logged-in vs logged-out)
- Admin role features
