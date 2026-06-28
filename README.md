# LifeStock 📈
> A prediction market platform for personal life goals

## What is LifeStock?
Users set life goals and others buy/sell stocks predicting whether those goals will be achieved. Stock prices move based on community confidence.

## Tech Stack
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Auth:** JWT, bcryptjs
- **Upcoming:** React.js, Socket.io, Redis, Whisper API, Google Vision API

## Features
- JWT Authentication (Register/Login)
- Goal creation with categories
- Stock market mechanics (buy/sell shares)
- AI proof verification (coming soon)
- Real-time price updates via WebSockets (coming soon)
- Category-wise leaderboards (coming soon)

## Setup
```bash
cd server
npm install
npm run dev
```

## API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get logged in user |

## Project Status
🚧 Active Development — Week 1 of 6