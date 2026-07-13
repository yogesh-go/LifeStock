import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getGoalById, getStockData, buyShares, submitProof } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const GoalDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [goal, setGoal] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shares, setShares] = useState(1);
  const [position, setPosition] = useState('yes');
  const [proofDesc, setProofDesc] = useState('');
  const [buying, setBuying] = useState(false);
  const [submittingProof, setSubmittingProof] = useState(false);

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const [goalRes, stockRes] = await Promise.all([
        getGoalById(id),
        getStockData(id)
      ]);
      setGoal(goalRes.data);
      setStockData(stockRes.data);
    } catch (err) {
      toast.error('Failed to load goal');
    }
    setLoading(false);
  };

  const handleBuy = async () => {
    setBuying(true);
    try {
      const res = await buyShares(id, { position, shares: parseInt(shares) });
      toast.success(`Bought ${shares} shares! New price: ${res.data.newPrice}%`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to buy shares');
    }
    setBuying(false);
  };

  const handleProofSubmit = async () => {
    if (!proofDesc) return toast.error('Enter proof description');
    setSubmittingProof(true);
    try {
      await submitProof(id, { description: proofDesc });
      toast.success('Proof submitted successfully!');
      setProofDesc('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to submit proof');
    }
    setSubmittingProof(false);
  };

  const getPriceColor = (price) => {
    if (price >= 70) return 'text-[#00ff88]';
    if (price >= 40) return 'text-[#ffd700]';
    return 'text-[#ff4444]';
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center text-[#00d4ff] text-lg font-semibold animate-pulse">
      Loading...
    </div>
  );

  if (!goal) return (
    <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center text-gray-500">
      Goal not found
    </div>
  );

  const chartData = stockData?.priceHistory?.map((p, i) => ({
    index: i + 1,
    price: p.price
  })) || [];

  const isCreator = user?._id === goal.creator?._id || user?.id === goal.creator?._id;
  const cost = shares * (stockData?.stockPrice || 50);

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white px-5 py-6">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <Link to="/feed" className="text-[#00d4ff] text-sm font-medium flex items-center gap-1 mb-5 hover:opacity-80 transition-all">
          ← Back to Feed
        </Link>

        {/* Goal Header */}
        <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-7 flex justify-between items-start gap-6 mb-5">
          <div className="flex-1">
            <span className="bg-[#00d4ff15] text-[#00d4ff] px-3 py-1 rounded-full text-xs font-bold uppercase">
              {goal.category}
            </span>
            <h2 className="text-2xl font-extrabold mt-3 mb-2">{goal.title}</h2>
            <p className="text-gray-400 text-sm">{goal.description}</p>
            <p className="text-gray-600 text-xs mt-3">
              👤 {goal.creator?.name} &nbsp;|&nbsp;
              ⏰ {new Date(goal.deadline).toLocaleDateString()} &nbsp;|&nbsp;
              📊 {goal.status}
            </p>
          </div>
          <div className="text-center min-w-[130px]">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Market Confidence</p>
            <p className={`text-5xl font-extrabold my-2 ${getPriceColor(stockData?.stockPrice)}`}>
              {stockData?.stockPrice}%
            </p>
            <p className="text-xs text-gray-600">
              🔼 {stockData?.buyerCount} YES &nbsp; 🔽 {stockData?.sellerCount} NO
            </p>
          </div>
        </div>

        {/* Price Chart */}
        <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-6 mb-5">
          <h3 className="font-bold text-base mb-4">📈 Price History</h3>
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                <XAxis dataKey="index" stroke="#555" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#555" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#00d4ff' }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#00d4ff"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#00d4ff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-10 text-gray-600">
              <p className="text-3xl mb-2">📊</p>
              <p>Not enough data yet. Make some trades!</p>
            </div>
          )}
        </div>

        {/* Trade Panel */}
        {goal.status === 'active' && (
          <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-6 mb-5">
            <h3 className="font-bold text-base mb-5">💹 Trade Shares</h3>
            <div className="flex gap-6 items-end mb-5 flex-wrap">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Your Position</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPosition('yes')}
                    className={`px-5 py-2.5 rounded-lg border font-bold text-sm transition-all ${
                      position === 'yes'
                        ? 'bg-[#00ff88] text-[#0a0a14] border-[#00ff88]'
                        : 'border-[#00ff88] text-[#00ff88] hover:bg-[#00ff8815]'
                    }`}
                  >
                    ✅ YES
                  </button>
                  <button
                    onClick={() => setPosition('no')}
                    className={`px-5 py-2.5 rounded-lg border font-bold text-sm transition-all ${
                      position === 'no'
                        ? 'bg-[#ff4444] text-white border-[#ff4444]'
                        : 'border-[#ff4444] text-[#ff4444] hover:bg-[#ff444415]'
                    }`}
                  >
                    ❌ NO
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Shares</p>
                <input
                  type="number"
                  min="1"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  className="w-20 px-3 py-2.5 bg-[#0a0a14] border border-[#2a2a3e] rounded-lg text-white text-center font-bold outline-none focus:border-[#00d4ff] transition-all"
                />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Cost</p>
                <p className="text-xl font-extrabold text-[#ffd700]">{cost} pts</p>
              </div>
            </div>
            <button
              onClick={handleBuy}
              disabled={buying}
              className="w-full py-3 bg-[#00d4ff] text-[#0a0a14] font-bold rounded-lg hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {buying ? 'Processing...' : `Buy ${shares} ${position.toUpperCase()} shares`}
            </button>
          </div>
        )}

        {/* Proof Submission */}
        {isCreator && goal.status === 'active' && (
          <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-6 mb-5">
            <h3 className="font-bold text-base mb-4">📋 Submit Proof</h3>
            <textarea
              placeholder="Describe your proof of achievement in detail..."
              value={proofDesc}
              onChange={(e) => setProofDesc(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a14] border border-[#2a2a3e] rounded-lg text-white text-sm outline-none focus:border-[#00d4ff] transition-all placeholder-gray-600 resize-vertical h-24 mb-3"
            />
            <button
              onClick={handleProofSubmit}
              disabled={submittingProof}
              className="px-6 py-2.5 bg-[#ffd700] text-[#0a0a14] font-bold rounded-lg hover:brightness-110 transition-all disabled:opacity-60"
            >
              {submittingProof ? 'Submitting...' : '📤 Submit Proof'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalDetail;