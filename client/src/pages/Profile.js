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

  useEffect(() => {
    fetchData();
  }, []);

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
      } catch {
        setRanking(null);
      }
    } catch (err) {
      toast.error('Failed to load profile data');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    if (status === 'achieved') return '#00ff88';
    if (status === 'failed') return '#ff4444';
    if (status === 'under_review') return '#ffd700';
    return '#00d4ff';
  };

  const categories = ['fitness', 'education', 'finance', 'health', 'career', 'personal'];

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <Link to="/" style={styles.back}>← Back</Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>

        {/* Profile Card */}
        <div style={styles.profileCard}>
          <div style={styles.avatar}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={styles.userInfo}>
            <h2 style={styles.userName}>{user?.name}</h2>
            <p style={styles.userEmail}>{user?.email}</p>
            <div style={styles.statsRow}>
              <div style={styles.stat}>
                <p style={styles.statValue}>{user?.totalPoints}</p>
                <p style={styles.statLabel}>Points</p>
              </div>
              <div style={styles.stat}>
                <p style={styles.statValue}>{user?.credibilityScore}</p>
                <p style={styles.statLabel}>Credibility</p>
              </div>
              <div style={styles.stat}>
                <p style={styles.statValue}>{ranking?.globalRank || 'N/A'}</p>
                <p style={styles.statLabel}>Global Rank</p>
              </div>
              <div style={styles.stat}>
                <p style={styles.statValue}>{goals.length}</p>
                <p style={styles.statLabel}>Goals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Scores */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📊 Category Scores</h3>
          <div style={styles.categoryGrid}>
            {categories.map(cat => (
              <div key={cat} style={styles.categoryItem}>
                <p style={styles.categoryName}>{cat}</p>
                <p style={styles.categoryScore}>
                  {user?.categoryScores?.[cat] || 0} pts
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('goals')}
            style={{
              ...styles.tab,
              backgroundColor: activeTab === 'goals' ? '#00d4ff' : '#1a1a2e',
              color: activeTab === 'goals' ? '#0f0f1a' : '#fff'
            }}
          >
            My Goals ({goals.length})
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            style={{
              ...styles.tab,
              backgroundColor: activeTab === 'transactions' ? '#00d4ff' : '#1a1a2e',
              color: activeTab === 'transactions' ? '#0f0f1a' : '#fff'
            }}
          >
            Transactions ({transactions.length})
          </button>
        </div>

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div style={styles.list}>
            {loading ? (
              <p style={styles.empty}>Loading...</p>
            ) : goals.length === 0 ? (
              <p style={styles.empty}>No goals yet. <Link to="/create" style={{ color: '#00d4ff' }}>Create one!</Link></p>
            ) : (
              goals.map(goal => (
                <Link to={`/goal/${goal._id}`} key={goal._id} style={styles.itemLink}>
                  <div style={styles.item}>
                    <div>
                      <p style={styles.itemTitle}>{goal.title}</p>
                      <p style={styles.itemMeta}>
                        {goal.category} | ⏰ {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={styles.itemRight}>
                      <p style={{ ...styles.status, color: getStatusColor(goal.status) }}>
                        {goal.status}
                      </p>
                      <p style={styles.itemPrice}>{goal.stockPrice}%</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div style={styles.list}>
            {loading ? (
              <p style={styles.empty}>Loading...</p>
            ) : transactions.length === 0 ? (
              <p style={styles.empty}>No transactions yet.</p>
            ) : (
              transactions.map(tx => (
                <div key={tx._id} style={styles.item}>
                  <div>
                    <p style={styles.itemTitle}>{tx.goal?.title}</p>
                    <p style={styles.itemMeta}>
                      {tx.type.toUpperCase()} {tx.shares} {tx.position.toUpperCase()} shares
                      @ {tx.priceAtTransaction}%
                    </p>
                  </div>
                  <div style={styles.itemRight}>
                    <p style={{ color: '#ff4444', fontWeight: 'bold' }}>
                      -{tx.pointsSpent} pts
                    </p>
                    <p style={styles.itemMeta}>
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

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0f0f1a', color: '#fff', padding: '20px' },
  content: { maxWidth: '700px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  back: { color: '#00d4ff', textDecoration: 'none' },
  logoutBtn: {
    backgroundColor: 'transparent', color: '#ff4444',
    border: '1px solid #ff4444', padding: '6px 12px',
    borderRadius: '6px', cursor: 'pointer'
  },
  profileCard: {
    backgroundColor: '#1a1a2e', borderRadius: '12px',
    padding: '24px', border: '1px solid #333',
    display: 'flex', gap: '20px', alignItems: 'center',
    marginBottom: '20px'
  },
  avatar: {
    width: '64px', height: '64px', borderRadius: '50%',
    backgroundColor: '#00d4ff', color: '#0f0f1a',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '28px', fontWeight: 'bold', flexShrink: 0
  },
  userInfo: { flex: 1 },
  userName: { color: '#fff', margin: '0 0 4px 0' },
  userEmail: { color: '#666', margin: '0 0 16px 0', fontSize: '14px' },
  statsRow: { display: 'flex', gap: '24px' },
  stat: { textAlign: 'center' },
  statValue: { color: '#00d4ff', fontWeight: 'bold', fontSize: '20px', margin: 0 },
  statLabel: { color: '#666', fontSize: '12px', margin: 0 },
  card: {
    backgroundColor: '#1a1a2e', borderRadius: '12px',
    padding: '20px', border: '1px solid #333', marginBottom: '20px'
  },
  cardTitle: { color: '#fff', marginTop: 0, marginBottom: '16px' },
  categoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
  categoryItem: {
    backgroundColor: '#0f0f1a', borderRadius: '8px',
    padding: '12px', textAlign: 'center'
  },
  categoryName: { color: '#aaa', margin: '0 0 4px 0', fontSize: '12px', textTransform: 'capitalize' },
  categoryScore: { color: '#00d4ff', fontWeight: 'bold', margin: 0 },
  tabs: { display: 'flex', gap: '8px', marginBottom: '16px' },
  tab: {
    padding: '8px 20px', borderRadius: '8px',
    border: '1px solid #333', cursor: 'pointer', fontSize: '14px'
  },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  empty: { color: '#666', textAlign: 'center', padding: '40px' },
  itemLink: { textDecoration: 'none' },
  item: {
    backgroundColor: '#1a1a2e', borderRadius: '10px',
    padding: '16px', border: '1px solid #333',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  itemTitle: { color: '#fff', margin: '0 0 4px 0', fontSize: '14px' },
  itemMeta: { color: '#666', margin: 0, fontSize: '12px' },
  itemRight: { textAlign: 'right' },
  status: { margin: '0 0 4px 0', fontSize: '12px', fontWeight: 'bold' },
  itemPrice: { color: '#00d4ff', fontWeight: 'bold', margin: 0 }
};

export default Profile;