import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
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
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { initial: 'K', name: 'Karan M.', text: 'Bought 20 YES shares. Very bullish on this goal! 🚀', time: '2 hours ago' },
    { initial: 'A', name: 'Ananya R.', text: 'Interesting goal. Bought some NO shares as a hedge.', time: '5 hours ago' },
    { initial: 'R', name: 'Rohit K.', text: 'This is very achievable. Going YES!', time: '1 day ago' },
  ]);

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
      toast.success('Proof submitted!');
      setProofDesc('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to submit proof');
    }
    setSubmittingProof(false);
  };

  const handleComment = () => {
    if (!comment.trim()) return;
    setComments([
      { initial: user?.name?.charAt(0).toUpperCase(), name: user?.name, text: comment, time: 'Just now' },
      ...comments
    ]);
    setComment('');
    toast.success('Comment posted!');
  };

  const getPriceColor = (price) => {
    if (price >= 70) return 'text-[#00ff88]';
    if (price >= 40) return 'text-[#ffd700]';
    return 'text-[#ff4444]';
  };

  const getDaysLeft = (deadline) => {
    const diff = new Date(deadline) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const getProgress = (createdAt, deadline) => {
    const total = new Date(deadline) - new Date(createdAt);
    const elapsed = new Date() - new Date(createdAt);
    return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
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
  const potentialWin = cost * 2;
  const daysLeft = getDaysLeft(goal.deadline);
  const progress = getProgress(goal.createdAt, goal.deadline);
  const totalVotes = (stockData?.buyerCount || 0) + (stockData?.sellerCount || 0);
  const yesPercent = totalVotes > 0 ? Math.round(((stockData?.buyerCount || 0) / totalVotes) * 100) : 50;
  const noPercent = 100 - yesPercent;

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
          <Link to="/portfolio" className="text-gray-400 hover:text-white px-3 py-2 rounded-lg text-sm transition-all hover:bg-[#1a1a2e]">Portfolio</Link>
        </div>
      </nav>

      <div className="px-6 py-6 max-w-7xl mx-auto">

        {/* Back */}
        <Link to="/feed" className="text-[#00d4ff] text-sm font-medium flex items-center gap-1 mb-5 hover:opacity-80 transition-all">
          ← Back to Dashboard
        </Link>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-5">

            {/* Goal Header + Chart */}
            <div className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-6">
              <span className="bg-[#00d4ff10] text-[#00d4ff] px-3 py-1 rounded-full text-xs font-bold uppercase mb-3 inline-block">
                {goal.category}
              </span>
              <h1 className="text-2xl font-bold mb-2">{goal.title}</h1>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">{goal.description}</p>

              {/* Price */}
              <div className="flex items-end gap-3 mb-1">
                <span className={`text-5xl font-bold ${getPriceColor(stockData?.stockPrice)}`}>
                  {stockData?.stockPrice}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-5">Market confidence · Updated in real-time</p>

              {/* Area Chart */}
              {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
                    <XAxis dataKey="index" stroke="#333" tick={{ fontSize: 10, fill: '#555' }} />
                    <YAxis domain={[0, 100]} stroke="#333" tick={{ fontSize: 10, fill: '#555' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#12121f', border: '1px solid #2a2a3e', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff', fontSize: '11px' }}
                      itemStyle={{ color: '#00d4ff', fontSize: '11px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#00d4ff"
                      strokeWidth={2}
                      fill="url(#priceGrad)"
                      dot={false}
                      activeDot={{ r: 4, fill: '#00d4ff' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-10 text-gray-600 bg-[#0a0a14] rounded-xl">
                  <p className="text-2xl mb-2">📊</p>
                  <p className="text-sm">Not enough data yet. Make the first trade!</p>
                </div>
              )}
            </div>

            {/* Market Statistics */}
            <div className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-6">
              <h3 className="font-bold text-sm mb-4">Market Statistics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'YES Shares', value: stockData?.buyerCount || 0, color: 'text-[#00ff88]' },
                  { label: 'NO Shares', value: stockData?.sellerCount || 0, color: 'text-[#ff4444]' },
                  { label: 'Total Volume', value: (stockData?.buyerCount || 0) + (stockData?.sellerCount || 0), color: 'text-white' },
                  { label: 'Days Left', value: daysLeft, color: daysLeft < 7 ? 'text-[#ff4444]' : 'text-[#ffd700]' },
                ].map(stat => (
                  <div key={stat.label} className="bg-[#0a0a14] border border-[#2a2a3e] rounded-lg p-3">
                    <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* YES/NO Bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span className="text-[#00ff88]">YES {yesPercent}%</span>
                  <span className="text-[#ff4444]">NO {noPercent}%</span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden">
                  <div className="bg-[#00ff88] transition-all" style={{ width: `${yesPercent}%` }} />
                  <div className="bg-[#ff4444] transition-all" style={{ width: `${noPercent}%` }} />
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-6">
              <h3 className="font-bold text-sm mb-4">Goal Progress</h3>
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Time elapsed</span>
                <span className="text-[#00d4ff] font-bold">{progress}%</span>
              </div>
              <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #00d4ff, #00ff88)'
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Created: {new Date(goal.createdAt).toLocaleDateString()}</span>
                <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-6">
              <h3 className="font-bold text-sm mb-5">Timeline</h3>
              <div className="relative">
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-[#2a2a3e]" />
                {[
                  { title: 'Goal created', date: new Date(goal.createdAt).toLocaleDateString(), done: true },
                  { title: 'First investor joined', date: 'Market opened', done: (stockData?.buyerCount || 0) > 0 },
                  { title: 'Goal in progress', date: `${daysLeft} days remaining`, active: goal.status === 'active' },
                  { title: 'Proof submission', date: new Date(goal.deadline).toLocaleDateString(), done: goal.status === 'under_review' || goal.status === 'achieved' },
                  { title: 'Settlement', date: 'Points distributed to winners', done: goal.status === 'achieved' || goal.status === 'failed' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 pb-5 last:pb-0">
                    <div className={`w-[12px] h-[12px] rounded-full border-2 flex-shrink-0 mt-1 relative z-10 ${
                      item.done ? 'bg-[#00ff88] border-[#00ff88]' :
                      item.active ? 'bg-[#00d4ff] border-[#00d4ff]' :
                      'bg-[#0a0a14] border-[#2a2a3e]'
                    }`} />
                    <div>
                      <p className={`text-sm font-medium ${
                        item.active ? 'text-[#00d4ff]' :
                        item.done ? 'text-white' : 'text-gray-600'
                      }`}>{item.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Creator Info */}
            <div className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-6">
              <h3 className="font-bold text-sm mb-4">Creator</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#0080ff] flex items-center justify-center text-xl font-bold text-[#0a0a14] flex-shrink-0">
                  {goal.creator?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-base">{goal.creator?.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Credibility score: {goal.creator?.credibilityScore || 100}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00d4ff] rounded-full"
                        style={{ width: `${goal.creator?.credibilityScore || 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{goal.creator?.credibilityScore || 100}/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Proof Submission */}
            {isCreator && goal.status === 'active' && (
              <div className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-6">
                <h3 className="font-bold text-sm mb-4">📋 Submit Proof</h3>
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

            {/* Discussion */}
            <div className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-6">
              <h3 className="font-bold text-sm mb-5">Discussion ({comments.length})</h3>
              <div className="flex flex-col gap-4 mb-5">
                {comments.map((c, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1a1a2e] border border-[#2a2a3e] flex items-center justify-center text-xs font-bold text-[#00d4ff] flex-shrink-0">
                      {c.initial}
                    </div>
                    <div className="flex-1 bg-[#0a0a14] border border-[#2a2a3e] rounded-xl px-4 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#00d4ff]">{c.name}</span>
                        <span className="text-xs text-gray-600">{c.time}</span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment Input */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#0080ff] flex items-center justify-center text-xs font-bold text-[#0a0a14] flex-shrink-0">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Share your analysis..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                    className="flex-1 px-4 py-2.5 bg-[#0a0a14] border border-[#2a2a3e] rounded-xl text-white text-sm outline-none focus:border-[#00d4ff] transition-all placeholder-gray-600"
                  />
                  <button
                    onClick={handleComment}
                    className="px-4 py-2.5 bg-[#00d4ff] text-[#0a0a14] font-bold rounded-xl text-sm hover:brightness-110 transition-all"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN — Sticky Trade Panel */}
          <div className="flex flex-col gap-5">
            <div className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-5 lg:sticky lg:top-20">
              <h3 className="font-bold text-sm mb-4">Trade Shares</h3>

              {goal.status === 'active' ? (
                <>
                  {/* Position Buttons */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setPosition('yes')}
                      className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${
                        position === 'yes'
                          ? 'bg-[#00ff88] text-[#0a0a14] border-[#00ff88]'
                          : 'border-[#00ff88] text-[#00ff88] hover:bg-[#00ff8815]'
                      }`}
                    >
                      ✅ YES
                    </button>
                    <button
                      onClick={() => setPosition('no')}
                      className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${
                        position === 'no'
                          ? 'bg-[#ff4444] text-white border-[#ff4444]'
                          : 'border-[#ff4444] text-[#ff4444] hover:bg-[#ff444415]'
                      }`}
                    >
                      ❌ NO
                    </button>
                  </div>

                  {/* Shares Controls */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-600 uppercase tracking-wider">Shares</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShares(Math.max(1, shares - 1))}
                        className="w-8 h-8 rounded-lg bg-[#1a1a2e] border border-[#2a2a3e] flex items-center justify-center text-lg hover:border-[#00d4ff] transition-all"
                      >−</button>
                      <span className="text-xl font-bold w-8 text-center">{shares}</span>
                      <button
                        onClick={() => setShares(shares + 1)}
                        className="w-8 h-8 rounded-lg bg-[#1a1a2e] border border-[#2a2a3e] flex items-center justify-center text-lg hover:border-[#00d4ff] transition-all"
                      >+</button>
                    </div>
                  </div>

                  {/* Cost */}
                  <div className="bg-[#0a0a14] border border-[#2a2a3e] rounded-xl p-4 mb-4">
                    <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Total Cost</p>
                    <p className="text-2xl font-bold text-[#ffd700]">{cost} pts</p>
                  </div>

                  {/* Buy Button */}
                  <button
                    onClick={handleBuy}
                    disabled={buying}
                    className="w-full py-3.5 bg-[#00d4ff] text-[#0a0a14] font-bold rounded-xl hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed mb-4 text-sm"
                  >
                    {buying ? 'Processing...' : `Buy ${shares} ${position.toUpperCase()} share${shares > 1 ? 's' : ''}`}
                  </button>

                  {/* Market Info */}
                  <div className="flex flex-col gap-2.5 pt-4 border-t border-[#2a2a3e]">
                    {[
                      { label: 'Current price', value: `${stockData?.stockPrice}%`, color: getPriceColor(stockData?.stockPrice) },
                      { label: 'Your balance', value: `${user?.totalPoints} pts`, color: 'text-white' },
                      { label: 'Potential win', value: `${potentialWin} pts`, color: 'text-[#ffd700]' },
                      { label: 'Deadline', value: new Date(goal.deadline).toLocaleDateString(), color: 'text-gray-400' },
                      { label: 'Status', value: goal.status, color: 'text-[#00d4ff]' },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">{item.label}</span>
                        <span className={`text-xs font-bold ${item.color}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-3xl mb-3">
                    {goal.status === 'achieved' ? '🏆' : goal.status === 'failed' ? '❌' : '⏳'}
                  </p>
                  <p className="font-bold text-base mb-1 capitalize">{goal.status}</p>
                  <p className="text-gray-500 text-sm">Trading is closed for this goal</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GoalDetail;