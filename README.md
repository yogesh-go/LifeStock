# 📈 LifeStock
> A prediction market platform for personal life goals

## 🌐 Live Demo
**[life-stock-one.vercel.app](https://life-stock-one.vercel.app)**

## 💡 What is LifeStock?
LifeStock is a full-stack prediction market where users set personal life goals and others buy/sell stocks predicting whether those goals will be achieved. Stock prices move in real-time based on community confidence.

## 🛠 Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT, bcryptjs |
| Real-time | Socket.io |
| AI | Goal categorization, Proof verification |
| Deployment | Vercel + Render |

## ✨ Features
- 🔐 JWT Authentication (Register/Login)
- 🎯 Goal creation with AI auto-categorization
- 📈 Stock market mechanics (buy YES/NO shares)
- ⚡ Real-time price updates via WebSockets
- 🤖 AI proof verification system
- 🏆 Global + category-wise leaderboards
- 👤 User profiles with transaction history
- 📊 Live price history charts

## 🚀 Run Locally

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm start
```

### Environment Variables
Create `server/.env`:

## 📡 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get logged in user |

### Goals
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/goals | Create goal |
| GET | /api/goals | Get all goals |
| GET | /api/goals/my | Get my goals |
| GET | /api/goals/:id | Get single goal |
| DELETE | /api/goals/:id | Delete goal |

### Stock Market
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/stock/:id/buy | Buy shares |
| GET | /api/stock/:id | Get stock data |
| GET | /api/stock/transactions/my | Get my transactions |

### Proof
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/proof/:id/submit | Submit proof |
| GET | /api/proof/:id | Get proofs |
| POST | /api/proof/:id/:proofId/flag | Flag proof |
| POST | /api/proof/:id/:proofId/approve | Approve proof |

### Rankings
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/ranking/global | Global leaderboard |
| GET | /api/ranking/category/:cat | Category leaderboard |
| GET | /api/ranking/me | My ranking |
| POST | /api/ranking/settle/:id | Settle goal |

### AI
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/ai/categorize | Categorize goal |
| POST | /api/ai/verify | Verify proof |
| POST | /api/ai/suggestions | Get goal suggestions |

## 🏗 System Design
- **Real-time updates** — Socket.io + Redis pub/sub
- **Stock price algorithm** — buyers/(buyers+sellers) × 100
- **AI verification** — multi-layer proof checking
- **Leaderboard** — category + global rankings
- **Point settlement** — 2x rewards for correct predictions

## 👨‍💻 Built By
**Yogesh Kumar**
BTech CSE — Delhi Technological University (DTU)

[![GitHub](https://img.shields.io/badge/GitHub-yogesh--go-blue)](https://github.com/yogesh-go)