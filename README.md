# unspoken_web

It is written by me in a few days with the help of AI so there are much room of improvement. Feel free to contribute to this project if you like. The web is live [here](https://unspoken-web.onrender.com).

A Website for 
1. verifying if your crush love you without letting your crush know if he/she doesn't love you back.
2. Sending anonymous letter to someone whom you know each other (In a same group)<br />

---

## Table of Contents

- Overview
- Features
- Tech Stack
- Repository Structure
- Getting Started
  - Prerequisites
  - Clone
  - Environment Variables
  - Install Dependencies
  - Run (Development)
  - Build and Run (Production)
- Configuration Details
  - Server
  - Web
- API Overview
- Frontend Overview
- Internationalization (i18n)
- Contributing
- Security
- License

---

## Overview

This repository is a monorepo with two main parts:

- `Server/`: Node.js backend using Express and TypeScript, connected to MongoDB via Mongoose. It provides a RESTful API and handles authentication using JSON Web Tokens (JWT), including Google Login.
- `Web/`: React frontend built with Vite and TypeScript. State is managed with Redux Toolkit (including RTK Query for data fetching). UI components use PrimeReact, and styling uses Tailwind CSS. Client-side authentication integrates with the server API and Google login.

---

## Features

- Backend
  - Express-based REST API with modular routing
  - MongoDB + Mongoose models and schema validation
  - JWT authentication middleware and Google login support
  - Centralized configuration via environment variables
- Frontend
  - React with Vite for fast DX
  - Redux Toolkit + RTK Query for state and data fetching
  - Client-side routing with `react-router-dom`
  - PrimeReact components and Tailwind CSS styling
  - i18n via `i18next` with language packs in `public/locales/`

---

## Tech Stack

- Server
  - Node.js, Express, TypeScript
  - MongoDB, Mongoose
  - JWT, google-auth-library
  - dotenv for environment config
- Web
  - React, Vite, TypeScript
  - Redux Toolkit, RTK Query
  - react-router-dom
  - PrimeReact, Tailwind CSS
  - i18next

---

## Repository Structure

```
unspoken_web/
├─ Server/
│  ├─ src/
│  │  ├─ server.ts           # Express app entry and middleware setup
│  │  ├─ db.ts               # MongoDB connection
│  │  ├─ config.ts           # Centralized env configuration
│  │  ├─ middlewares/
│  │  │  └─ auth.ts          # JWT authentication middleware
│  │  ├─ models/
│  │  │  └─ user.model.ts    # Example Mongoose model (User)
│  │  └─ routes/
│  │     └─ user.ts          # Example user-related routes
│  ├─ package.json
│  └─ ...
├─ Web/
│  ├─ src/
│  │  ├─ main.tsx            # App entrypoint
│  │  ├─ app/router.tsx      # Client-side routes
│  │  ├─ slices/
│  │  │  ├─ authSlice.ts
│  │  │  └─ userSlice.ts
│  │  ├─ api/apiSlice.ts     # RTK Query base API
│  │  ├─ hooks/
│  │  │  ├─ useLogin.ts
│  │  │  └─ useGoogleLogin.ts
│  │  └─ assets/theme/       # Global styles/theme
│  ├─ public/locales/        # i18n language files
│  ├─ package.json
│  └─ ...
├─ README.md
└─ ...
```

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm (comes with Node) or yarn/pnpm
- MongoDB (local instance or MongoDB Atlas)

### Clone

```bash
git clone https://github.com/johnnycls/unspoken_web.git
cd unspoken_web
```

### Environment Variables

Create `.env` files before running. Below are variables used in this codebase.

- Server (`Server/.env`)

  ```
  PORT=
  MONGODB_URI=
  WEB_URL=
  JWT_SECRET=
  GOOGLE_CLIENT_ID=
  ```

- Web (`Web/.env`)

  ```
  VITE_SERVER_URL=
  VITE_GOOGLE_CLIENT_ID=
  ```

### Install Dependencies

- Server

  ```bash
  cd Server
  npm i
  ```

- Web

  ```bash
  cd Web
  npm i
  ```

### Run (Development)

Open two terminals:

- Terminal 1: Server

  ```bash
  cd Server
  npm start
  ```

- Terminal 2: Web

  ```bash
  cd Web
  npm run dev
  ```
  
---

## Contributing

Contributions are welcome!

- Fork the repository
- Create a feature branch
- Commit your changes with clear messages
- Open a Pull Request describing your changes

Recommended practices:
- Keep changes scoped and focused
- Add/update documentation when behavior changes
- Ensure the app builds and runs locally

If you plan significant changes, consider opening an issue first to discuss.

---

## Security

If you discover a security vulnerability, please do not open a public issue. Instead, contact [the maintainers](mailto:goulonghuangdi@gmail.com) privately so we can address it responsibly.

Best practices when deploying:
- Use strong `JWT_SECRET` values
- Restrict CORS to trusted origins
- Prefer HTTPS everywhere
- Store secrets in your platform’s secret manager

---

## Troubleshooting

- MongoDB connection errors
  - Verify `MONGODB_URI`
  - Ensure MongoDB is running or your Atlas connection string is correct
- CORS errors
  - Confirm `WEB_URL` matches the frontend origin
- Google login issues
  - Ensure `GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_ID` match
  - Verify authorized origins/redirects in Google Cloud Console
- API base URL mismatch
  - Confirm `VITE_API_BASE_URL` matches your server’s actual URL and port

---

## Acknowledgements

- Express, Mongoose, and the Node.js ecosystem
- React, Vite, Redux Toolkit, RTK Query
- PrimeReact and Tailwind CSS
- i18next
