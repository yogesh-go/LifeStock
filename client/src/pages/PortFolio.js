import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getMyTransactions, getGoals } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Portfolio = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await getMyTransactions();
      setTransactions(res.data);
    } catch (err) {
      toast.error('Failed to load portfolio');
    }
    setLoading(false);
  };

  const getPriceColor = (price) => {
    if (price >= 70) return 'text-[#00ff88]';
    if (price >= 40) return 'text-[#ffd700]';
    return 'text-[#ff4444]';
  };

  const getPnL = (buyPrice, currentPrice) => {
    const pnl = ((currentPrice - buyPrice) / buyPrice) * 100;
    return pnl.toFixed(1);
  };

  const getPnLColor = (pnl) => {
    return parseFloat(pnl) >= 0 ? 'text-[#00ff88]' : 'text-[#ff4444]';
  };

  const getBarWidth = (price) => `${price}%`;

  const getBarColor = (price) => {
    if (price >= 70) return 'bg-[#00ff88]';
    if (price >= 40) return 'bg-[#ffd700]';
    return 'bg-[#ff4444]';
  };

  // Calculate total stats
  const totalSpent = transactions.reduce((sum, tx) => sum + tx.pointsSpent, 0);
  const totalShares = transactions.reduce((sum, tx) => sum + tx.shares, 0);
  const yesPositions = transactions.filter(tx => tx.position === 'yes').length;
  const noPositions = transactions.filter(tx => tx.position === 'no').length;

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white px-5 py-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/feed" className="text-[#00d4ff] text-sm font-medium hover:opacity-80 transition-all">← Dashboard</Link>
            <h2 className="text-2xl font-bold">💼 My Portfolio</h2>
          </div>
          <Link to="/create" className="bg-[#00d4ff] text-[#0a0a14] px-4 py-2 rounded-lg font-bold text-sm hover:brightness-110 transition-all">
            + Create Goal
          </Link>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Invested', value: `${totalSpent} pts`, color: 'text-white' },
            { label: 'Total Shares', value: totalShares, color: 'text-white' },
            { label: 'YES Positions', value: yesPositions, color: 'text-[#00ff88]' },
            { label: 'NO Positions', value: noPositions, color: 'text-[#ff4444]' },
          ].map(stat => (
            <div key={stat.label} className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-5">
              <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Holdings Table */}
        <div className="bg-[#12121f] border border-[#2a2a3e] rounded-xl overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-[#2a2a3e]">
            <h3 className="font-bold text-sm">My Holdings</h3>
          </div>
          {loading ? (
            <div className="text-center py-16 text-gray-600 animate-pulse">Loading portfolio...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">💼</p>
              <p className="text-gray-500 mb-2">No holdings yet.</p>
              <p className="text-gray-600 text-sm">Buy shares in a goal to build your portfolio.</p>
              <Link to="/feed" className="inline-block mt-4 bg-[#00d4ff] text-[#0a0a14] px-5 py-2 rounded-lg font-bold text-sm">
                Browse Goals
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0a0a14]">
                    {['Goal', 'Position', 'Shares', 'Buy Price', 'Current', 'Confidence', 'P&L'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs text-gray-600 uppercase tracking-wider font-medium border-b border-[#2a2a3e]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => {
                    const currentPrice = tx.goal?.stockPrice || tx.priceAtTransaction;
                    const pnl = getPnL(tx.priceAtTransaction, currentPrice);
                    return (
                      <tr key={tx._id} className="border-b border-[#1a1a2e] hover:bg-[#ffffff03] transition-all">
                        <td className="px-5 py-4">
                          <Link to={`/goal/${tx.goal?._id}`}>
                            <p className="font-semibold text-white hover:text-[#00d4ff] transition-all truncate max-w-[180px]">
                              {tx.goal?.title || 'Unknown Goal'}
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">{tx.goal?.category}</p>
                          </Link>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            tx.position === 'yes'
                              ? 'bg-[#00ff8815] text-[#00ff88]'
                              : 'bg-[#ff444415] text-[#ff4444]'
                          }`}>
                            {tx.position.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-400">{tx.shares}</td>
                        <td className="px-5 py-4 text-gray-400">{tx.priceAtTransaction}%</td>
                        <td className={`px-5 py-4 font-bold ${getPriceColor(currentPrice)}`}>
                          {currentPrice}%
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${getBarColor(currentPrice)}`}
                                style={{ width: getBarWidth(currentPrice) }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">{currentPrice}%</span>
                          </div>
                        </td>
                        <td className={`px-5 py-4 font-bold ${getPnLColor(pnl)}`}>
                          {parseFloat(pnl) >= 0 ? '+' : ''}{pnl}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-6">
          <h3 className="font-bold text-sm mb-5">Category Breakdown</h3>
          <div className="grid grid-cols-3 gap-3">
            {['fitness', 'education', 'finance', 'health', 'career', 'personal'].map(cat => {
              const catTx = transactions.filter(tx => tx.goal?.category === cat);
              const catSpent = catTx.reduce((sum, tx) => sum + tx.pointsSpent, 0);
              return (
                <div key={cat} className="bg-[#0a0a14] border border-[#2a2a3e] rounded-lg p-4 text-center hover:border-[#00d4ff33] transition-all">
                  <p className="text-xs text-gray-600 capitalize mb-1">{cat}</p>
                  <p className="text-lg font-bold text-[#00d4ff]">{catSpent}</p>
                  <p className="text-xs text-gray-600 mt-0.5">pts invested</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;