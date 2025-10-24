# Copilot Instructions

This document provides guidance for AI agents working on the unspoken_web codebase.

## Project Overview

This is a monorepo containing two main parts: a backend server and a frontend web application.

- `Server/`: A Node.js backend using Express, TypeScript, and MongoDB. It provides a RESTful API for the client.
- `Web/`: A React frontend application built with Vite, TypeScript, and Redux for state management.

---

## Server (`Server/`)

### Key Concepts

- **Framework**: Express.js. The main application entry point and middleware setup is in `src/server.ts`.
- **Database**: MongoDB with Mongoose for object data modeling. Database connection is handled in `src/db.ts`, and schemas are defined in `src/models/`. For example, see `src/models/user.model.ts`.
- **Authentication**: Authentication is token-based using JSON Web Tokens (JWT). Google login is supported via `google-auth-library`. The primary authentication middleware is `src/middlewares/auth.ts`.
- **Routing**: API routes are modularized and located in `src/routes/`. For instance, user-related endpoints are in `src/routes/user.ts`.
- **Configuration**: Environment variables are managed with the `dotenv` package and centralized in `src/config.ts`.

### Developer Workflow

- **Run (Dev)**: `cd Server && npm start`
- **Build**: `cd Server && npm run build`
- **Run (Production)**: `cd Server && npm run production`

---

## Web (`Web/`)

### Key Concepts

- **Framework**: React with Vite for a fast development experience. The main entry point is `src/main.tsx`.
- **State Management**: Redux Toolkit is used for global state. Slices are defined in `src/slices/`, such as `authSlice.ts` and `userSlice.ts`. `apiSlice.ts` is used for fetching data from the server API (RTK Query).
- **Routing**: Client-side routing is handled by `react-router-dom`. Route definitions are in `src/app/router.tsx`.
- **UI & Styling**: The UI is built with PrimeReact components and styled with Tailwind CSS. Global styles and theme are in `src/assets/theme/`.
- **Authentication**: Client-side authentication logic, including Google login, is managed in hooks like `src/hooks/useLogin.ts` and `src/hooks/useGoogleLogin.ts`.
- **Internationalization (i18n)**: Text is managed for multiple languages using `i18next`. Language files are in `public/locales/`.

### Developer Workflow

- **Run (Dev)**: `cd Web && npm run dev`
- **Build**: `cd Web && npm run build`
- **Preview Build**: `cd Web && npm run preview`
