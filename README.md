# 🎯 Focus - Productivity Timer App

A full-stack productivity application built with React, Node.js, and Supabase. Features a Pomodoro timer, task management, statistics tracking, and **real-time sync** across devices.

![Focus App](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- 🔐 **User Authentication** - Secure signup/login with JWT
- ✅ **Task Management** - CRUD operations with real-time sync
- ⏱️ **Pomodoro Timer** - 15/25/50 min presets + custom duration
- 📊 **Statistics Dashboard** - Track focus hours, sessions, streaks
- 🔌 **Real-time Sync** - WebSocket updates across browser tabs
- 🌙 **Dark Theme** - Modern, eye-friendly design

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite 7** - Build tool
- **Tailwind CSS 4** - Styling
- **React Router 7** - Navigation
- **Socket.io Client** - Real-time updates

### Backend
- **Node.js** - Runtime
- **Express** - API framework
- **TypeScript** - Type safety
- **Prisma 5** - Database ORM
- **Socket.io** - WebSocket server
- **JWT + bcrypt** - Authentication

### Database
- **Supabase PostgreSQL** - Cloud database

## 📁 Project Structure

```
Fucos/
├── Frontend/                 # React + Vite app
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── contexts/         # React context (Auth)
│   │   └── lib/              # API & Socket clients
│   └── package.json
│
└── backend/                  # Express API
    ├── src/
    │   ├── routes/           # API endpoints
    │   ├── middleware/       # JWT auth
    │   └── lib/              # Prisma client
    ├── prisma/
    │   └── schema.prisma     # Database models
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/Fucos.git
cd Fucos
```

### 2. Setup Backend
```bash
cd backend
npm install

# Create .env file with your Supabase credentials
cp .env.example .env
# Edit .env with your DATABASE_URL from Supabase

# Push database schema
npx prisma db push

# Start development server
npm run dev
```

### 3. Setup Frontend
```bash
cd ../Frontend
npm install
npm run dev
```

### 4. Open the app
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 📡 API Endpoints (v1)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/signup` | Register new user | ❌ |
| POST | `/api/v1/auth/login` | Login | ❌ |
| GET | `/api/v1/auth/me` | Get current user | ✅ |
| GET | `/api/v1/tasks` | List tasks | ✅ |
| POST | `/api/v1/tasks` | Create task | ✅ |
| PATCH | `/api/v1/tasks/:id` | Update task | ✅ |
| DELETE | `/api/v1/tasks/:id` | Delete task | ✅ |
| GET | `/api/v1/sessions` | List sessions | ✅ |
| POST | `/api/v1/sessions` | Create session | ✅ |
| GET | `/api/v1/sessions/stats` | Get statistics | ✅ |
| GET | `/api/v1/settings` | Get settings | ✅ |
| PUT | `/api/v1/settings` | Update settings | ✅ |

## 🔌 WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join` | Client → Server | Join user room |
| `task:created` | Server → Client | New task created |
| `task:updated` | Server → Client | Task updated |
| `task:deleted` | Server → Client | Task deleted |
| `session:created` | Server → Client | New session completed |

## 🗄️ Database Schema

```prisma
model User {
  id           String         @id @default(uuid())
  email        String         @unique
  name         String
  passwordHash String
  tasks        Task[]
  sessions     FocusSession[]
  settings     UserSettings?
}

model Task {
  id        String   @id @default(uuid())
  text      String
  done      Boolean  @default(false)
  userId    String
  user      User     @relation(...)
}

model FocusSession {
  id          String   @id @default(uuid())
  task        String?
  minutes     Int
  completedAt DateTime @default(now())
  userId      String
  user        User     @relation(...)
}

model UserSettings {
  id              String  @id @default(uuid())
  userId          String  @unique
  defaultPomodoro Int     @default(25)
  shortBreak      Int     @default(5)
  longBreak       Int     @default(15)
  soundEnabled    Boolean @default(true)
  notifyEnabled   Boolean @default(true)
}
```

## 🔒 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://..."  # Supabase connection string
JWT_SECRET="your-secret-key"     # JWT signing secret
PORT=3001                        # Server port
```

## 📝 Scripts

### Backend
```bash
npm run dev       # Start dev server with hot reload
npm run build     # Build for production
npm start         # Run production build
npx prisma studio # Open database GUI
```

### Frontend
```bash
npm run dev       # Start Vite dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ using React, Node.js, and Supabase
