# Focus Backend API

Express.js REST API with TypeScript, Prisma, and Socket.io for the Focus productivity app.

## Setup

```bash
npm install
cp .env.example .env  # Add your Supabase DATABASE_URL
npx prisma db push
npm run dev
```

## API v1 Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/signup` | Register user |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/auth/me` | Current user |
| CRUD | `/api/v1/tasks` | Task management |
| GET/POST | `/api/v1/sessions` | Focus sessions |
| GET | `/api/v1/sessions/stats` | Statistics |
| GET/PUT | `/api/v1/settings` | User settings |

## WebSocket Events

- `task:created` - New task
- `task:updated` - Task modified
- `task:deleted` - Task removed
- `session:created` - Session completed

## Scripts

```bash
npm run dev     # Development
npm run build   # Production build
npm start       # Run production
```
