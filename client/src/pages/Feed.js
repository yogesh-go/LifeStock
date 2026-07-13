import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getGoals } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Feed = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await getGoals({ category, status: 'active' });
        setGoals(res.data);
      } catch (err) {
        toast.error('Failed to load goals');
      }
      setLoading(false);
    };

    fetchGoals();
  }, [category]);




  const handleLogout = () => { logoutUser(); navigate('/'); };

  const getPriceColor = (price) => {
    if (price >= 70) return 'text-[#00ff88]';
    if (price >= 40) return 'text-[#ffd700]';
    return 'text-[#ff4444]';
  };

  const categories = ['', 'fitness', 'education', 'finance', 'health', 'career', 'personal'];

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-4 bg-[#0a0a14]/90 backdrop-blur-md border-b border-[#2a2a3e] sticky top-0 z-50">
        <h1 className="text-xl font-extrabold text-[#00d4ff]">📈 LifeStock</h1>
        <div className="flex items-center gap-3">
          <span className="text-[#ffd700] font-bold text-sm px-3 py-1.5 bg-[#ffd70015] border border-[#ffd700] rounded-full">
            💰 {user?.totalPoints} pts
          </span>
          <Link to="/create" className="bg-[#00d4ff] text-[#0a0a14] px-4 py-2 rounded-lg font-bold text-sm hover:brightness-110 transition-all">
            + Create Goal
          </Link>
          <Link to="/leaderboard" className="text-gray-400 hover:text-white px-3 py-2 rounded-lg text-sm transition-all hover:bg-[#1a1a2e]">
            Leaderboard
          </Link>
          <Link to="/profile" className="text-gray-400 hover:text-white px-3 py-2 rounded-lg text-sm transition-all hover:bg-[#1a1a2e]">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="text-[#ff4444] border border-[#ff4444] px-3 py-2 rounded-lg text-sm hover:bg-[#ff444415] transition-all"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Category Filter */}
      <div className="flex gap-2 px-10 py-4 border-b border-[#2a2a3e] flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-1.5 rounded-full text-sm font-medium border transition-all ${
              category === cat
                ? 'bg-[#00d4ff] text-[#0a0a14] border-[#00d4ff] font-bold'
                : 'border-[#2a2a3e] text-gray-400 hover:border-[#00d4ff] hover:text-[#00d4ff]'
            }`}
          >
            {cat === '' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-10 py-6">
        {loading ? (
          <p className="text-gray-500 col-span-3 text-center py-16">Loading goals...</p>
        ) : goals.length === 0 ? (
          <div className="col-span-3 text-center py-16">
            <p className="text-4xl mb-4">🎯</p>
            <p className="text-gray-500">No goals found. Be the first to create one!</p>
            <Link to="/create" className="inline-block mt-4 bg-[#00d4ff] text-[#0a0a14] px-6 py-2 rounded-lg font-bold text-sm">
              Create Goal
            </Link>
          </div>
        ) : (
          goals.map(goal => (
            <div key={goal._id} className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-5 flex flex-col gap-3 hover:border-[#00d4ff44] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#00d4ff11] transition-all">

              {/* Card Header */}
              <div className="flex items-center justify-between">
                <span className="bg-[#00d4ff15] text-[#00d4ff] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  {goal.category}
                </span>
                <span className={`text-2xl font-extrabold ${getPriceColor(goal.stockPrice)}`}>
                  {goal.stockPrice}%
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-base text-white leading-snug">{goal.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{goal.description}</p>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
                <span>👤 {goal.creator?.name}</span>
                <span>🔼 {goal.buyerCount} | 🔽 {goal.sellerCount}</span>
                <span>⏰ {new Date(goal.deadline).toLocaleDateString()}</span>
              </div>

              {/* CTA */}
              <Link
                to={`/goal/${goal._id}`}
                className="block text-center bg-[#00d4ff] text-[#0a0a14] py-2.5 rounded-lg font-bold text-sm hover:brightness-110 transition-all"
              >
                View & Trade →
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;