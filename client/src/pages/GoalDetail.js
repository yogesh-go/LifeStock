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

  useEffect(() => {
    fetchData();
  }, [id]);

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
    if (price >= 70) return '#00ff88';
    if (price >= 40) return '#ffd700';
    return '#ff4444';
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!goal) return <div style={styles.loading}>Goal not found</div>;

  const chartData = stockData?.priceHistory?.map((p, i) => ({
    index: i + 1,
    price: p.price
  })) || [];

  const isCreator = user?._id === goal.creator?._id || user?.id === goal.creator?._id;
  const cost = shares * (stockData?.stockPrice || 50);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Back button */}
        <Link to="/" style={styles.back}>← Back to Feed</Link>

        {/* Goal Header */}
        <div style={styles.goalHeader}>
          <div>
            <span style={styles.category}>{goal.category}</span>
            <h2 style={styles.title}>{goal.title}</h2>
            <p style={styles.description}>{goal.description}</p>
            <p style={styles.meta}>
              👤 {goal.creator?.name} &nbsp;|&nbsp;
              ⏰ Deadline: {new Date(goal.deadline).toLocaleDateString()} &nbsp;|&nbsp;
              📊 Status: {goal.status}
            </p>
          </div>
          <div style={styles.priceBox}>
            <p style={styles.priceLabel}>Market Confidence</p>
            <p style={{ ...styles.bigPrice, color: getPriceColor(stockData?.stockPrice) }}>
              {stockData?.stockPrice}%
            </p>
            <p style={styles.priceLabel}>
              🔼 {stockData?.buyerCount} YES &nbsp; 🔽 {stockData?.sellerCount} NO
            </p>
          </div>
        </div>

        {/* Price Chart */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📈 Price History</h3>
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="index" stroke="#666" />
                <YAxis domain={[0, 100]} stroke="#666" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#00d4ff"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p style={styles.noData}>Not enough data for chart yet. Make some trades!</p>
          )}
        </div>

        {/* Buy/Sell Panel */}
        {goal.status === 'active' && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>💹 Trade Shares</h3>
            <div style={styles.tradeRow}>
              <div>
                <label style={styles.label}>Your Position</label>
                <div style={styles.positionBtns}>
                  <button
                    onClick={() => setPosition('yes')}
                    style={{
                      ...styles.posBtn,
                      backgroundColor: position === 'yes' ? '#00ff88' : 'transparent',
                      color: position === 'yes' ? '#0f0f1a' : '#00ff88',
                      borderColor: '#00ff88'
                    }}
                  >
                    ✅ YES
                  </button>
                  <button
                    onClick={() => setPosition('no')}
                    style={{
                      ...styles.posBtn,
                      backgroundColor: position === 'no' ? '#ff4444' : 'transparent',
                      color: position === 'no' ? '#fff' : '#ff4444',
                      borderColor: '#ff4444'
                    }}
                  >
                    ❌ NO
                  </button>
                </div>
              </div>
              <div>
                <label style={styles.label}>Shares</label>
                <input
                  style={styles.sharesInput}
                  type="number"
                  min="1"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                />
              </div>
              <div>
                <label style={styles.label}>Cost</label>
                <p style={styles.cost}>{cost} pts</p>
              </div>
            </div>
            <button
              onClick={handleBuy}
              style={styles.buyBtn}
              disabled={buying}
            >
              {buying ? 'Processing...' : `Buy ${shares} ${position.toUpperCase()} shares`}
            </button>
          </div>
        )}

        {/* Proof Submission */}
        {isCreator && goal.status === 'active' && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📋 Submit Proof</h3>
            <textarea
              style={styles.proofInput}
              placeholder="Describe your proof of achievement..."
              value={proofDesc}
              onChange={(e) => setProofDesc(e.target.value)}
            />
            <button
              onClick={handleProofSubmit}
              style={styles.proofBtn}
              disabled={submittingProof}
            >
              {submittingProof ? 'Submitting...' : '📤 Submit Proof'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0f0f1a', color: '#fff', padding: '20px' },
  content: { maxWidth: '800px', margin: '0 auto' },
  loading: { color: '#fff', textAlign: 'center', padding: '40px' },
  back: { color: '#00d4ff', textDecoration: 'none', fontSize: '14px' },
  goalHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', margin: '20px 0',
    backgroundColor: '#1a1a2e', padding: '24px',
    borderRadius: '12px', border: '1px solid #333', gap: '20px'
  },
  category: {
    backgroundColor: '#0f0f1a', color: '#00d4ff',
    padding: '4px 10px', borderRadius: '12px', fontSize: '12px'
  },
  title: { color: '#fff', margin: '10px 0' },
  description: { color: '#888', fontSize: '14px' },
  meta: { color: '#666', fontSize: '12px' },
  priceBox: { textAlign: 'center', minWidth: '120px' },
  priceLabel: { color: '#666', fontSize: '12px', margin: '4px 0' },
  bigPrice: { fontSize: '48px', fontWeight: 'bold', margin: '8px 0' },
  card: {
    backgroundColor: '#1a1a2e', borderRadius: '12px',
    padding: '24px', marginBottom: '20px', border: '1px solid #333'
  },
  cardTitle: { color: '#fff', marginTop: 0, marginBottom: '16px' },
  noData: { color: '#666', textAlign: 'center', padding: '20px' },
  tradeRow: { display: 'flex', gap: '24px', alignItems: 'flex-end', marginBottom: '16px' },
  label: { display: 'block', color: '#aaa', fontSize: '13px', marginBottom: '8px' },
  positionBtns: { display: 'flex', gap: '8px' },
  posBtn: {
    padding: '8px 16px', borderRadius: '8px',
    border: '1px solid', cursor: 'pointer', fontWeight: 'bold'
  },
  sharesInput: {
    width: '80px', padding: '8px', borderRadius: '8px',
    border: '1px solid #333', backgroundColor: '#0f0f1a',
    color: '#fff', fontSize: '16px'
  },
  cost: { color: '#ffd700', fontWeight: 'bold', fontSize: '18px', margin: 0 },
  buyBtn: {
    width: '100%', padding: '12px', backgroundColor: '#00d4ff',
    color: '#0f0f1a', border: 'none', borderRadius: '8px',
    fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
  },
  proofInput: {
    width: '100%', padding: '12px', borderRadius: '8px',
    border: '1px solid #333', backgroundColor: '#0f0f1a',
    color: '#fff', fontSize: '14px', height: '100px',
    resize: 'vertical', boxSizing: 'border-box', marginBottom: '12px'
  },
  proofBtn: {
    padding: '10px 20px', backgroundColor: '#ffd700',
    color: '#0f0f1a', border: 'none', borderRadius: '8px',
    fontWeight: 'bold', cursor: 'pointer'
  }
};

export default GoalDetail;