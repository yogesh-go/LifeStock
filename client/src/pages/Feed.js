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
    fetchGoals();
  }, [category]);

  const fetchGoals = async () => {
    try {
      const res = await getGoals({ category, status: 'active' });
      setGoals(res.data);
    } catch (err) {
      toast.error('Failed to load goals');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const getPriceColor = (price) => {
    if (price >= 70) return '#00ff88';
    if (price >= 40) return '#ffd700';
    return '#ff4444';
  };

  const categories = ['', 'fitness', 'education', 'finance', 'health', 'career', 'personal'];

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>📈 LifeStock</h1>
        <div style={styles.navLinks}>
          <span style={styles.points}>💰 {user?.totalPoints} pts</span>
          <Link to="/create" style={styles.navBtn}>+ Create Goal</Link>
          <Link to="/leaderboard" style={styles.navLink}>Leaderboard</Link>
          <Link to="/profile" style={styles.navLink}>Profile</Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      {/* Category Filter */}
      <div style={styles.filterContainer}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              ...styles.filterBtn,
              backgroundColor: category === cat ? '#00d4ff' : '#1a1a2e',
              color: category === cat ? '#0f0f1a' : '#fff',
            }}
          >
            {cat === '' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Goals Feed */}
      <div style={styles.feed}>
        {loading ? (
          <p style={styles.loading}>Loading goals...</p>
        ) : goals.length === 0 ? (
          <p style={styles.loading}>No goals found. Be the first to create one!</p>
        ) : (
          goals.map(goal => (
            <div key={goal._id} style={styles.goalCard}>
              <div style={styles.cardHeader}>
                <span style={styles.category}>{goal.category}</span>
                <span style={{
                  ...styles.price,
                  color: getPriceColor(goal.stockPrice)
                }}>
                  {goal.stockPrice}%
                </span>
              </div>
              <h3 style={styles.goalTitle}>{goal.title}</h3>
              <p style={styles.goalDesc}>{goal.description}</p>
              <div style={styles.cardFooter}>
                <span style={styles.creator}>
                  👤 {goal.creator?.name}
                </span>
                <span style={styles.stats}>
                  🔼 {goal.buyerCount} | 🔽 {goal.sellerCount}
                </span>
                <span style={styles.deadline}>
                  ⏰ {new Date(goal.deadline).toLocaleDateString()}
                </span>
              </div>
              <Link to={`/goal/${goal._id}`} style={styles.viewBtn}>
                View & Trade →
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0f0f1a', color: '#fff' },
  navbar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 32px', backgroundColor: '#1a1a2e',
    borderBottom: '1px solid #333'
  },
  logo: { color: '#00d4ff', margin: 0 },
  navLinks: { display: 'flex', alignItems: 'center', gap: '16px' },
  points: { color: '#ffd700', fontWeight: 'bold' },
  navBtn: {
    backgroundColor: '#00d4ff', color: '#0f0f1a', padding: '8px 16px',
    borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold'
  },
  navLink: { color: '#fff', textDecoration: 'none' },
  logoutBtn: {
    backgroundColor: 'transparent', color: '#ff4444',
    border: '1px solid #ff4444', padding: '6px 12px',
    borderRadius: '6px', cursor: 'pointer'
  },
  filterContainer: {
    display: 'flex', gap: '8px', padding: '20px 32px',
    flexWrap: 'wrap'
  },
  filterBtn: {
    padding: '6px 16px', borderRadius: '20px',
    border: '1px solid #333', cursor: 'pointer', fontSize: '13px'
  },
  feed: { padding: '0 32px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  loading: { color: '#888', textAlign: 'center', padding: '40px' },
  goalCard: {
    backgroundColor: '#1a1a2e', borderRadius: '12px',
    padding: '20px', border: '1px solid #333',
    display: 'flex', flexDirection: 'column', gap: '10px'
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  category: {
    backgroundColor: '#0f0f1a', color: '#00d4ff',
    padding: '4px 10px', borderRadius: '12px', fontSize: '12px'
  },
  price: { fontSize: '24px', fontWeight: 'bold' },
  goalTitle: { margin: 0, fontSize: '16px', color: '#fff' },
  goalDesc: { margin: 0, fontSize: '13px', color: '#888', lineHeight: '1.5' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' },
  creator: { color: '#aaa' },
  stats: { color: '#aaa' },
  deadline: { color: '#aaa' },
  viewBtn: {
    backgroundColor: '#00d4ff', color: '#0f0f1a',
    padding: '8px 16px', borderRadius: '8px',
    textDecoration: 'none', fontWeight: 'bold',
    textAlign: 'center', fontSize: '14px'
  }
};

export default Feed;