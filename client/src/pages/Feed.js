import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getGoals, getMyTransactions, getMyGoals } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [goals, setGoals] = useState([]);
  const [myGoals, setMyGoals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, [category]);

  const fetchData = async () => {
    try {
      const [goalsRes, myGoalsRes, txRes] = await Promise.all([
        getGoals({ category, status: 'active' }),
        getMyGoals(),
        getMyTransactions()
      ]);
      setGoals(goalsRes.data);
      setMyGoals(myGoalsRes.data);
      setTransactions(txRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard');
    }
    setLoading(false);
  };

  const handleLogout = () => { logoutUser(); navigate('/'); };

  const getPriceColor = (price) => {
    if (price >= 70) return 'text-[#00ff88]';
    if (price >= 40) return 'text-[#ffd700]';
    return 'text-[#ff4444]';
  };

  // Calculate portfolio metrics
  const portfolioValue = user?.totalPoints || 0;
  const openPositions = transactions.length;
  const completedGoals = myGoals.filter(g => g.status === 'achieved').length;
  const totalGoals = myGoals.length;
  const accuracy = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const categories = ['', 'fitness', 'education', 'finance', 'health', 'career', 'personal'];

  const getHour = () => {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-4 bg-[#0a0a14]/90 backdrop-blur-md border-b border-[#2a2a3e] sticky top-0 z-50">
        <h1 className="text-xl font-bold text-[#00d4ff]">📈 LifeStock</h1>
        <div className="flex items-center gap-3">
          <span className="text-[#ffd700] font-bold text-sm px-3 py-1.5 bg-[#ffd70015] border border-[#ffd700] rounded-full">
            💰 {user?.totalPoints} pts
          </span>
          <Link to="/create" className="bg-[#00d4ff] text-[#0a0a14] px-4 py-2 rounded-lg font-bold text-sm hover:brightness-110 transition-all">
            + Create Goal
          </Link>
            <Link to="/portfolio" className="text-gray-400 hover:text-white px-3 py-2 rounded-lg text-sm transition-all hover:bg-[#1a1a2e]">Portfolio</Link>
            <Link to="/ai" className="text-gray-400 hover:text-white px-3 py-2 rounded-lg text-sm transition-all hover:bg-[#1a1a2e]">🤖 AI</Link>
            <Link to="/leaderboard" className="text-gray-400 hover:text-white px-3 py-2 rounded-lg text-sm transition-all hover:bg-[#1a1a2e]">Leaderboard</Link>
            <Link to="/profile" className="text-gray-400 hover:text-white px-3 py-2 rounded-lg text-sm transition-all hover:bg-[#1a1a2e]">Profile</Link>
          <button onClick={handleLogout} className="text-[#ff4444] border border-[#ff4444] px-3 py-2 rounded-lg text-sm hover:bg-[#ff444415] transition-all">
            Logout
          </button>
        </div>
      </nav>

      <div className="px-10 py-6">

        {/* Greeting */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Good {getHour()}, {user?.name?.split(' ')[0]} 👋</h2>
          <p className="text-gray-500 text-sm mt-1">Here's your trading summary</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Portfolio Value', value: `₹${portfolioValue.toLocaleString()}`, change: '+12% this week', up: true },
            { label: 'Open Positions', value: openPositions, change: `Across ${categories.length - 1} categories`, up: null },
            { label: 'Prediction Accuracy', value: `${accuracy}%`, change: accuracy >= 70 ? 'Top 10% globally' : 'Keep trading!', up: accuracy >= 70 },
            { label: 'Goals Completed', value: completedGoals, change: `${myGoals.filter(g => g.status === 'under_review').length} under review`, up: null },
          ].map(metric => (
            <div key={metric.label} className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-5 hover:border-[#00d4ff33] transition-all">
              <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">{metric.label}</p>
              <p className="text-3xl font-bold text-white">{metric.value}</p>
              <p className={`text-xs mt-2 ${metric.up === true ? 'text-[#00ff88]' : metric.up === false ? 'text-[#ff4444]' : 'text-gray-600'}`}>
                {metric.up === true ? '▲ ' : metric.up === false ? '▼ ' : ''}{metric.change}
              </p>
            </div>
          ))}
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">

          {/* Trending Goals */}
          <div className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm">Trending Goals</h3>
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs border transition-all ${
                      category === cat
                        ? 'bg-[#00d4ff] text-[#0a0a14] border-[#00d4ff] font-bold'
                        : 'border-[#2a2a3e] text-gray-500 hover:border-[#00d4ff] hover:text-[#00d4ff]'
                    }`}
                  >
                    {cat === '' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {loading ? (
              <p className="text-gray-600 text-sm text-center py-8 animate-pulse">Loading...</p>
            ) : goals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-3xl mb-2">🎯</p>
                <p className="text-gray-600 text-sm">No goals yet.</p>
                <Link to="/create" className="text-[#00d4ff] text-xs mt-2 inline-block hover:underline">Create one →</Link>
              </div>
            ) : (
              goals.slice(0, 6).map(goal => (
                <Link to={`/goal/${goal._id}`} key={goal._id}>
                  <div className="flex items-center justify-between py-3 border-b border-[#1a1a2e] last:border-0 hover:bg-[#ffffff05] transition-all rounded px-1">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate pr-3">{goal.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-[#00d4ff10] text-[#00d4ff] px-2 py-0.5 rounded-full text-xs">
                          {goal.category}
                        </span>
                        <span className="text-xs text-gray-600">
                          🔼 {goal.buyerCount} | 🔽 {goal.sellerCount}
                        </span>
                      </div>
                    </div>
                    <span className={`text-lg font-bold ml-3 ${getPriceColor(goal.stockPrice)}`}>
                      {goal.stockPrice}%
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm">Recent Transactions</h3>
              <Link to="/portfolio" className="text-[#00d4ff] text-xs hover:underline">View portfolio →</Link>
            </div>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-3xl mb-2">💹</p>
                <p className="text-gray-600 text-sm">No transactions yet.</p>
                <p className="text-gray-700 text-xs mt-1">Buy shares in a goal to get started.</p>
              </div>
            ) : (
              transactions.slice(0, 6).map(tx => (
                <div key={tx._id} className="flex items-center justify-between py-3 border-b border-[#1a1a2e] last:border-0">
                  <div>
                    <p className="text-sm text-gray-300 truncate max-w-[200px]">{tx.goal?.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {tx.type.toUpperCase()} {tx.shares} {tx.position.toUpperCase()} @ {tx.priceAtTransaction}%
                    </p>
                  </div>
                  <p className="text-sm font-bold text-[#ff4444]">-{tx.pointsSpent} pts</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Goals Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm">My Goals</h3>
            <Link to="/create" className="text-[#00d4ff] text-xs hover:underline">+ New goal</Link>
          </div>
          {myGoals.length === 0 ? (
            <div className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-10 text-center">
              <p className="text-4xl mb-3">🎯</p>
              <p className="text-gray-500">No goals created yet.</p>
              <Link to="/create" className="inline-block mt-3 bg-[#00d4ff] text-[#0a0a14] px-5 py-2 rounded-lg font-bold text-sm hover:brightness-110 transition-all">
                Create your first goal
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myGoals.map(goal => (
                <Link to={`/goal/${goal._id}`} key={goal._id}>
                  <div className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-5 hover:border-[#00d4ff33] hover:-translate-y-0.5 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-[#00d4ff10] text-[#00d4ff] px-2 py-0.5 rounded-full text-xs font-bold uppercase">
                        {goal.category}
                      </span>
                      <span className={`text-lg font-bold ${getPriceColor(goal.stockPrice)}`}>
                        {goal.stockPrice}%
                      </span>
                    </div>
                    <h4 className="font-bold text-sm mb-2 leading-snug">{goal.title}</h4>
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs font-bold ${
                        goal.status === 'achieved' ? 'text-[#00ff88]' :
                        goal.status === 'failed' ? 'text-[#ff4444]' :
                        goal.status === 'under_review' ? 'text-[#ffd700]' :
                        'text-[#00d4ff]'
                      }`}>
                        {goal.status}
                      </span>
                      <span className="text-xs text-gray-600">
                        ⏰ {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;