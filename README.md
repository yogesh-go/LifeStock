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