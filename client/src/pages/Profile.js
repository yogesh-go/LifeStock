import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getMyGoals, getMyTransactions, getMyRanking } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [ranking, setRanking] = useState(null);
  const [activeTab, setActiveTab] = useState('goals');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [goalsRes, transRes] = await Promise.all([
        getMyGoals(),
        getMyTransactions()
      ]);
      setGoals(goalsRes.data);
      setTransactions(transRes.data);
      try {
        const rankRes = await getMyRanking();
        setRanking(rankRes.data);
      } catch { setRanking(null); }
    } catch (err) {
      toast.error('Failed to load profile');
    }
    setLoading(false);
  };

  const handleLogout = () => { logoutUser(); navigate('/'); };

  const getStatusStyle = (status) => {
    if (status === 'achieved') return 'text-[#00ff88]';
    if (status === 'failed') return 'text-[#ff4444]';
    if (status === 'under_review') return 'text-[#ffd700]';
    return 'text-[#00d4ff]';
  };

  const categories = ['fitness', 'education', 'finance', 'health', 'career', 'personal'];

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white px-5 py-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/feed" className="text-[#00d4ff] text-sm font-medium hover:opacity-80 transition-all">← Back</Link>
          <button
            onClick={handleLogout}
            className="text-[#ff4444] border border-[#ff4444] px-4 py-1.5 rounded-lg text-sm hover:bg-[#ff444415] transition-all"
          >
            Logout
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-7 flex gap-6 items-center mb-5">
          <div className="w-18 h-18 min-w-[72px] min-h-[72px] rounded-full bg-gradient-to-br from-[#00d4ff] to-[#0080ff] flex items-center justify-center text-3xl font-extrabold text-[#0a0a14]">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-extrabold">{user?.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
            <div className="flex gap-8 mt-4">
              {[
                { value: user?.totalPoints, label: 'Points' },
                { value: user?.credibilityScore, label: 'Credibility' },
                { value: ranking?.globalRank || 'N/A', label: 'Global Rank' },
                { value: goals.length, label: 'Goals' },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="text-xl font-extrabold text-[#00d4ff]">{stat.value}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Scores */}
        <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-6 mb-5">
          <h3 className="font-bold text-base mb-4">📊 Category Scores</h3>
          <div className="grid grid-cols-3 gap-3">
            {categories.map(cat => (
              <div
                key={cat}
                className="bg-[#0a0a14] border border-[#2a2a3e] rounded-lg p-4 text-center hover:border-[#00d4ff44] transition-all"
              >
                <p className="text-xs text-gray-500 capitalize mb-1">{cat}</p>
                <p className="text-lg font-extrabold text-[#00d4ff]">
                  {user?.categoryScores?.[cat] || 0}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { key: 'goals', label: `My Goals (${goals.length})` },
            { key: 'transactions', label: `Transactions (${transactions.length})` }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium border transition-all ${
                activeTab === tab.key
                  ? 'bg-[#00d4ff] text-[#0a0a14] border-[#00d4ff] font-bold'
                  : 'border-[#2a2a3e] text-gray-400 hover:border-[#00d4ff] hover:text-[#00d4ff]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Goals List */}
        {activeTab === 'goals' && (
          <div className="flex flex-col gap-3">
            {loading ? (
              <p className="text-center text-gray-500 py-10 animate-pulse">Loading...</p>
            ) : goals.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🎯</p>
                <p className="text-gray-500">No goals yet.</p>
                <Link to="/create" className="inline-block mt-3 text-[#00d4ff] font-semibold hover:underline">
                  Create your first goal →
                </Link>
              </div>
            ) : (
              goals.map(goal => (
                <Link to={`/goal/${goal._id}`} key={goal._id}>
                  <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl px-5 py-4 flex justify-between items-center hover:border-[#00d4ff44] transition-all">
                    <div>
                      <p className="font-semibold text-sm">{goal.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {goal.category} | ⏰ {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold ${getStatusStyle(goal.status)}`}>
                        {goal.status}
                      </p>
                      <p className="text-base font-extrabold text-[#00d4ff] mt-1">
                        {goal.stockPrice}%
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Transactions List */}
        {activeTab === 'transactions' && (
          <div className="flex flex-col gap-3">
            {loading ? (
              <p className="text-center text-gray-500 py-10 animate-pulse">Loading...</p>
            ) : transactions.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">💹</p>
                <p className="text-gray-500">No transactions yet.</p>
              </div>
            ) : (
              transactions.map(tx => (
                <div key={tx._id} className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl px-5 py-4 flex justify-between items-center hover:border-[#00d4ff44] transition-all">
                  <div>
                    <p className="font-semibold text-sm">{tx.goal?.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {tx.type.toUpperCase()} {tx.shares} {tx.position.toUpperCase()} shares @ {tx.priceAtTransaction}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-[#ff4444]">-{tx.pointsSpent} pts</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;