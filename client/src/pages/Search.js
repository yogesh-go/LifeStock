import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getGoals } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Search = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [goals, setGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [activeType, setActiveType] = useState('all');
  const [activeSort, setActiveSort] = useState('trending');
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchAllGoals(); }, []);

  useEffect(() => { applyFilters(); }, [query, activeType, activeSort, activeCategory, goals]);

  const fetchAllGoals = async () => {
    setLoading(true);
    try {
      const res = await getGoals({});
      setGoals(res.data);
    } catch (err) {
      toast.error('Failed to load goals');
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let result = [...goals];

    // Search filter
    if (query) {
      result = result.filter(g =>
        g.title.toLowerCase().includes(query.toLowerCase()) ||
        g.description?.toLowerCase().includes(query.toLowerCase()) ||
        g.category.toLowerCase().includes(query.toLowerCase()) ||
        g.creator?.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Category filter
    if (activeCategory) {
      result = result.filter(g => g.category === activeCategory);
    }

    // Sort
    if (activeSort === 'trending') {
      result.sort((a, b) => (b.buyerCount + b.sellerCount) - (a.buyerCount + a.sellerCount));
    } else if (activeSort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (activeSort === 'confidence') {
      result.sort((a, b) => b.stockPrice - a.stockPrice);
    } else if (activeSort === 'mosttraded') {
      result.sort((a, b) => b.totalShares - a.totalShares);
    }

    setFilteredGoals(result);
  };

  const getPriceColor = (price) => {
    if (price >= 70) return 'text-[#00ff88]';
    if (price >= 40) return 'text-[#ffd700]';
    return 'text-[#ff4444]';
  };

  const categories = ['', 'fitness', 'education', 'finance', 'health', 'career', 'personal'];
  const sorts = [
    { key: 'trending', label: 'Trending' },
    { key: 'newest', label: 'Newest' },
    { key: 'confidence', label: 'Highest Confidence' },
    { key: 'mosttraded', label: 'Most Traded' },
  ];

  // Mock users for demo
  const mockUsers = [
    { initial: 'Y', name: 'Yogesh Kumar', rank: 4, credibility: 95, goals: 18, gradient: 'from-[#00d4ff] to-[#0080ff]' },
    { initial: 'A', name: 'Ananya Rao', rank: 12, credibility: 88, goals: 9, gradient: 'from-[#8000ff] to-[#0080ff]' },
    { initial: 'K', name: 'Karan Mehta', rank: 7, credibility: 91, goals: 14, gradient: 'from-[#ff4444] to-[#8000ff]' },
  ].filter(u => !query || u.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-4 bg-[#0a0a14]/90 backdrop-blur-md border-b border-[#2a2a3e] sticky top-0 z-50">
        <h1 className="text-xl font-bold text-[#00d4ff]">📈 LifeStock</h1>
        <div className="flex items-center gap-3">
          <span className="text-[#ffd700] font-bold text-sm px-3 py-1.5 bg-[#ffd70015] border border-[#ffd700] rounded-full">
            💰 {user?.totalPoints} pts
          </span>
          <Link to="/feed" className="text-gray-400 hover:text-white px-3 py-2 rounded-lg text-sm transition-all hover:bg-[#1a1a2e]">Dashboard</Link>
          <Link to="/create" className="bg-[#00d4ff] text-[#0a0a14] px-4 py-2 rounded-lg font-bold text-sm hover:brightness-110 transition-all">
            + Create Goal
          </Link>
        </div>
      </nav>

      <div className="px-6 py-6 max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <Link to="/feed" className="text-[#00d4ff] text-sm font-medium hover:opacity-80 transition-all">← Dashboard</Link>
          <h2 className="text-2xl font-bold mt-1">🔍 Search</h2>
          <p className="text-gray-500 text-sm mt-1">Find goals, users and categories</p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 mb-5">
          <input
            type="text"
            placeholder="Search goals, users, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-5 py-3.5 bg-[#12121f] border border-[#2a2a3e] rounded-xl text-white text-sm outline-none focus:border-[#00d4ff] transition-all placeholder-gray-600"
            autoFocus
          />
          <button
            onClick={applyFilters}
            className="px-6 py-3.5 bg-[#00d4ff] text-[#0a0a14] font-bold rounded-xl text-sm hover:brightness-110 transition-all"
          >
            Search
          </button>
        </div>

        {/* Type Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {['all', 'goals', 'users'].map(type => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-1.5 rounded-full text-xs border transition-all capitalize ${
                activeType === type
                  ? 'bg-[#00d4ff] text-[#0a0a14] border-[#00d4ff] font-bold'
                  : 'border-[#2a2a3e] text-gray-500 hover:border-[#00d4ff] hover:text-[#00d4ff]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        {(activeType === 'all' || activeType === 'goals') && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs border transition-all capitalize ${
                  activeCategory === cat
                    ? 'bg-[#00d4ff15] text-[#00d4ff] border-[#00d4ff44]'
                    : 'border-[#2a2a3e] text-gray-600 hover:border-[#2a2a3e] hover:text-gray-400'
                }`}
              >
                {cat === '' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Sort */}
        {(activeType === 'all' || activeType === 'goals') && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {sorts.map(sort => (
              <button
                key={sort.key}
                onClick={() => setActiveSort(sort.key)}
                className={`px-3 py-1 rounded-full text-xs border transition-all ${
                  activeSort === sort.key
                    ? 'bg-[#1a1a2e] text-white border-[#555570]'
                    : 'border-[#2a2a3e] text-gray-600 hover:text-gray-400'
                }`}
              >
                {sort.label}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="text-center py-16 text-gray-600 animate-pulse">Searching...</div>
        ) : (
          <div>
            {/* Users Section */}
            {(activeType === 'all' || activeType === 'users') && mockUsers.length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-gray-600 uppercase tracking-wider mb-3">Users</p>
                <div className="flex flex-col gap-2">
                  {mockUsers.map(u => (
                    <div key={u.name} className="flex items-center justify-between p-4 bg-[#12121f] border border-[#2a2a3e] rounded-xl hover:border-[#00d4ff33] transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${u.gradient} flex items-center justify-center text-base font-bold text-[#0a0a14]`}>
                          {u.initial}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{u.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Rank #{u.rank} · {u.credibility} credibility · {u.goals} goals
                          </p>
                        </div>
                      </div>
                      <span className="bg-[#00d4ff10] text-[#00d4ff] px-3 py-1 rounded-full text-xs">
                        View Profile
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Goals Section */}
            {(activeType === 'all' || activeType === 'goals') && (
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wider mb-3">
                  Goals {filteredGoals.length > 0 && `(${filteredGoals.length})`}
                </p>
                {filteredGoals.length === 0 ? (
                  <div className="text-center py-16 bg-[#12121f] border border-[#2a2a3e] rounded-xl">
                    <p className="text-4xl mb-3">🔍</p>
                    <p className="text-gray-500 text-sm">No goals found</p>
                    {query && (
                      <p className="text-gray-600 text-xs mt-1">Try a different search term</p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {filteredGoals.map(goal => (
                      <Link to={`/goal/${goal._id}`} key={goal._id}>
                        <div className="flex items-center justify-between p-4 bg-[#12121f] border border-[#2a2a3e] rounded-xl hover:border-[#00d4ff33] transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#00d4ff10] flex items-center justify-center text-lg">
                              {goal.category === 'fitness' ? '💪' :
                               goal.category === 'education' ? '📚' :
                               goal.category === 'finance' ? '💰' :
                               goal.category === 'health' ? '❤️' :
                               goal.category === 'career' ? '💼' : '🌟'}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{goal.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {goal.category} · {goal.creator?.name} · {(goal.buyerCount || 0) + (goal.sellerCount || 0)} trades
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-lg font-bold ${getPriceColor(goal.stockPrice)}`}>
                              {goal.stockPrice}%
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;