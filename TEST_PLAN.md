# Comprehensive Test Plan for Unspoken Web Project

## 1. Introduction

This document outlines the comprehensive testing strategy for the Unspoken Web project, a monorepo consisting of a Node.js/Express backend (`Server/`) and a React frontend (`Web/`). The purpose of this plan is to ensure the quality, reliability, and functionality of all features before deployment.

## 2. Scope of Testing

### In Scope

- **Backend API**: All RESTful endpoints, including authentication, data manipulation (CRUD operations), and business logic.
- **Frontend Application**: All user-facing features, including UI components, state management, routing, and user interactions.
- **Integration**: The communication and data flow between the frontend and backend.
- **Database**: Correctness of data storage and retrieval.
- **Authentication**: Google login flow, JWT handling, and protected routes/components.
- **Cross-browser Compatibility**: Testing on latest versions of major browsers (Chrome, Firefox, Safari).
- **Responsiveness**: UI/UX on different screen sizes (desktop, tablet, mobile).

### Out of Scope

- Third-party service availability (e.g., Google OAuth services being down).
- Performance/Load testing under extreme conditions (can be added in a separate plan).
- Usability testing with real users (recommended but not covered here).

## 3. Testing Types & Tools

| Testing Type            | Location | Tools                                  | Description                                                                                            |
| ----------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Unit Testing**        | Server   | Jest, Supertest                        | Test individual functions, modules, and middleware in isolation.                                       |
| **Integration Testing** | Server   | Jest, Supertest, in-memory MongoDB     | Test API endpoints to ensure they work together as expected, including database interactions.          |
| **Unit Testing**        | Web      | Vitest, React Testing Library (RTL)    | Test individual React components, hooks, and utility functions.                                        |
| **Integration Testing** | Web      | Vitest, RTL, MSW (Mock Service Worker) | Test how multiple components work together, including routing and state management, with a mocked API. |
| **End-to-End (E2E)**    | Web      | Cypress or Playwright                  | Simulate real user scenarios by running tests in a browser against the full-stack application.         |

## 4. Test Strategy

### 4.1. Backend (`Server/`) Testing

#### Unit Tests

- **Location**: `Server/src/**/*.test.ts`
- **Focus**:
  - `utils/`: Test all utility functions for correctness (e.g., `general.ts`, `time.ts`).
  - `models/`: Test any custom methods or static functions on Mongoose models.
  - `middlewares/`: Test middleware logic, such as token validation in `auth.ts`, by mocking `req`, `res`, and `next`.

#### Integration Tests

- **Location**: `Server/tests/integration/**/*.test.ts`
- **Setup**: Use Supertest to make HTTP requests to the Express app. Use an in-memory MongoDB server (like `mongodb-memory-server`) to isolate tests from the development database.
- **Focus**:
  - **Auth Routes (`/api/auth`)**: Test Google login callback, token verification, and user data retrieval.
  - **User Routes (`/api/users`)**: Test fetching and updating user profiles. Ensure protected routes fail without a valid token.
  - **Crush Routes (`/api/crushes`)**: Test full CRUD functionality.
  - **Group Routes (`/api/groups`)**: Test CRUD for groups and management of members (add/remove).
  - **Letter Routes (`/api/letters`)**: Test full CRUD functionality.

### 4.2. Frontend (`Web/`) Testing

#### Unit Tests

- **Location**: `Web/src/**/*.test.tsx`
- **Focus**:
  - **Components**: Render individual components using RTL and assert their output. Test different states based on props (e.g., `LoadingElement`, `Error`).
  - **Hooks**: Test custom hooks (`useLogin`, `useLanguageFont`, etc.) to verify their logic.
  - **Utils**: Test utility functions (`utils/time.ts`, `utils/validation.ts`).
  - **Redux Slices**: Test reducers and actions for each slice (`authSlice`, `userSlice`, etc.) to ensure predictable state changes.

#### Integration Tests

- **Location**: `Web/tests/integration/**/*.test.tsx`
- **Setup**: Use Mock Service Worker (MSW) to intercept API calls and provide mock responses. This allows testing of data-fetching and state management logic without a live backend.
- **Focus**:
  - **Login Flow**: Test that a user can fill the login form, trigger a login action, and the UI updates correctly upon success (redirect, user data in store).
  - **Data Display**: Test that pages correctly fetch and display data from the mocked API (e.g., list of groups on the Group page).
  - **Form Submission**: Test complex forms like creating a new group, ensuring data is sent correctly and the UI updates on success.
  - **Routing**: Test navigation between different pages and that protected routes redirect unauthenticated users.

#### End-to-End (E2E) Tests

- **Location**: `Web/cypress/e2e/**/*.cy.ts`
- **Setup**: Run the full stack (both Server and Web dev servers). E2E tests will interact with the live application in a browser.
- **Focus**: Simulate complete user journeys.
  - **Scenario 1: New User Registration and First Letter**
    1.  User lands on the login page.
    2.  User logs in with Google.
    3.  User is redirected to the main page.
    4.  User navigates to the "Letters" page.
    5.  User creates a new letter and saves it.
    6.  User sees the new letter in the list.
    7.  User logs out.
  - **Scenario 2: Group Management**
    1.  User logs in.
    2.  User navigates to the "Groups" page.
    3.  User creates a new group.
    4.  User enters the group details page.
    5.  User adds a member to the group.
    6.  User verifies the new member is in the member list.
  - **Scenario 3: Settings Change**
    1.  User logs in.
    2.  User navigates to the "Settings" page.
    3.  User changes their display name.
    4.  User verifies the name is updated in the AppBar.
    5.  User changes the language and verifies the UI text changes.

## 5. Test Execution & CI/CD

- **Local Execution**: Developers should run relevant tests locally before pushing code.
  - `cd Server && npm test`
  - `cd Web && npm test`
- **Continuous Integration (CI)**: A CI pipeline (e.g., using GitHub Actions) should be set up to automatically run all tests (unit, integration, and E2E) on every push and pull request to the `main` branch.
- **Reporting**: Test results and code coverage reports should be generated and published by the CI pipeline.

## 6. Defect Management

- **Tracking**: All bugs found during testing will be tracked as issues in the GitHub repository.
- **Reporting**: Bug reports should include:
  - A clear, descriptive title.
  - Steps to reproduce the bug.
  - Expected vs. Actual results.
  - Screenshots or video recordings.
  - Environment details (browser, OS).
- **Prioritization**: Bugs will be prioritized based on severity (Blocker, Critical, Major, Minor) and impact.

## 7. Risks and Mitigation

| Risk                                  | Mitigation                                                                                                                    |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Incomplete test coverage.             | Enforce code coverage thresholds in the CI pipeline. Conduct regular reviews of test cases.                                   |
| E2E tests are brittle and slow.       | Use best practices for selectors (e.g., `data-testid`). Run E2E tests in parallel. Mock external dependencies where possible. |
| Test environment setup is complex.    | Use Docker to containerize the application and its dependencies for consistent test environments.                             |
| Changes in third-party APIs (Google). | Create a wrapper around the Google API client so that changes can be managed in one place. Monitor for API updates.           |
