import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getGlobalLeaderboard, getCategoryLeaderboard } from '../utils/api';

const Leaderboard = () => {
  const [rankings, setRankings] = useState([]);
  const [category, setCategory] = useState('global');
  const [loading, setLoading] = useState(true);

  const categories = ['global', 'fitness', 'education', 'finance', 'health', 'career', 'personal'];

  useEffect(() => { fetchRankings(); }, [category]);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const res = category === 'global'
        ? await getGlobalLeaderboard()
        : await getCategoryLeaderboard(category);
      setRankings(res.data);
    } catch (err) {
      toast.error('Failed to load rankings');
    }
    setLoading(false);
  };

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getRankStyle = (index) => {
    if (index === 0) return 'border-[#ffd700] shadow-[0_0_20px_rgba(255,215,0,0.1)]';
    if (index === 1) return 'border-[#aaaaaa] shadow-[0_0_20px_rgba(170,170,170,0.1)]';
    if (index === 2) return 'border-[#cd7f32] shadow-[0_0_20px_rgba(205,127,50,0.1)]';
    return 'border-[#2a2a3e]';
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white px-5 py-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/feed" className="text-[#00d4ff] text-sm font-medium hover:opacity-80 transition-all">← Back</Link>
          <h2 className="text-2xl font-extrabold">🏆 Leaderboard</h2>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                category === cat
                  ? 'bg-[#00d4ff] text-[#0a0a14] border-[#00d4ff] font-bold'
                  : 'border-[#2a2a3e] text-gray-400 hover:border-[#00d4ff] hover:text-[#00d4ff]'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Rankings */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="text-center py-16 text-gray-500">
              <p className="animate-pulse">Loading rankings...</p>
            </div>
          ) : rankings.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🏆</p>
              <p className="text-gray-500">No rankings yet. Start trading!</p>
            </div>
          ) : (
            rankings.map((ranking, index) => (
              <div
                key={ranking._id}
                className={`bg-[#1a1a2e] border rounded-xl px-5 py-4 flex items-center gap-4 hover:translate-x-1 transition-all ${getRankStyle(index)}`}
              >
                <span className="text-2xl min-w-[40px] text-center">{getMedal(index)}</span>
                <div className="flex-1">
                  <p className="font-bold text-base">{ranking.user?.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{ranking.user?.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-extrabold text-[#00d4ff]">
                    {category === 'global'
                      ? ranking.globalScore
                      : ranking.categoryRanks?.[category]?.score || 0} pts
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    ⭐ {ranking.user?.credibilityScore} credibility
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;