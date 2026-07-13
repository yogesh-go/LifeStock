import axios from 'axios';

const API = axios.create({
  baseURL: 'https://lifestock-backend.onrender.com/api'
});

// Attach token to every request automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Goals
export const createGoal = (data) => API.post('/goals', data);
export const getGoals = (params) => API.get('/goals', { params });
export const getMyGoals = () => API.get('/goals/my');
export const getGoalById = (id) => API.get(`/goals/${id}`);
export const deleteGoal = (id) => API.delete(`/goals/${id}`);

// Stock
export const buyShares = (id, data) => API.post(`/stock/${id}/buy`, data);
export const getStockData = (id) => API.get(`/stock/${id}`);
export const getMyTransactions = () => API.get('/stock/transactions/my');

// Proof
export const submitProof = (id, data) => API.post(`/proof/${id}/submit`, data);
export const getProofs = (id) => API.get(`/proof/${id}`);
export const flagProof = (goalId, proofId, data) => API.post(`/proof/${goalId}/${proofId}/flag`, data);

// Ranking
export const getGlobalLeaderboard = () => API.get('/ranking/global');
export const getCategoryLeaderboard = (category) => API.get(`/ranking/category/${category}`);
export const getMyRanking = () => API.get('/ranking/me');

// AI
export const categorizeGoal = (data) => API.post('/ai/categorize', data);
export const verifyProof = (data) => API.post('/ai/verify', data);
export const getGoalSuggestions = (data) => API.post('/ai/suggestions', data);