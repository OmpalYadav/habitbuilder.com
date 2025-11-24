# Habit Builder

A modern, responsive habit-tracking application.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand.
- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL.
- **Database**: PostgreSQL.

## Prerequisites

- Node.js (v18+)
- PostgreSQL

## Setup

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    cd backend && npm install
    cd ../frontend && npm install
    ```
3.  **Environment Variables**:
    - Backend: Create `backend/.env` (see `.env.example` or code).
    - Frontend: Create `frontend/.env` (see `.env.example` or code).

4.  **Database Setup**:
    ```bash
    cd backend
    npx prisma migrate dev --name init
    ```

5.  **Run the App**:
    - Backend: `cd backend && npm run dev`
    - Frontend: `cd frontend && npm run dev`

## Testing

- **E2E**: `npx playwright test`
