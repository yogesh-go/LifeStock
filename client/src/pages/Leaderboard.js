import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getGlobalLeaderboard, getCategoryLeaderboard } from '../utils/api';

const Leaderboard = () => {
  const [rankings, setRankings] = useState([]);
  const [category, setCategory] = useState('global');
  const [loading, setLoading] = useState(true);

  const categories = ['global', 'fitness', 'education', 'finance', 'health', 'career', 'personal'];

  useEffect(() => {
    fetchRankings();
  }, [category]);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      let res;
      if (category === 'global') {
        res = await getGlobalLeaderboard();
      } else {
        res = await getCategoryLeaderboard(category);
      }
      setRankings(res.data);
    } catch (err) {
      toast.error('Failed to load rankings');
    }
    setLoading(false);
  };

  const getMedalEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <Link to="/" style={styles.back}>← Back</Link>
          <h2 style={styles.title}>🏆 Leaderboard</h2>
        </div>

        {/* Category tabs */}
        <div style={styles.tabs}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                ...styles.tab,
                backgroundColor: category === cat ? '#00d4ff' : '#1a1a2e',
                color: category === cat ? '#0f0f1a' : '#fff',
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Rankings */}
        <div style={styles.rankingList}>
          {loading ? (
            <p style={styles.empty}>Loading...</p>
          ) : rankings.length === 0 ? (
            <p style={styles.empty}>No rankings yet. Start trading!</p>
          ) : (
            rankings.map((ranking, index) => (
              <div key={ranking._id} style={{
                ...styles.rankCard,
                borderColor: index === 0 ? '#ffd700' : index === 1 ? '#aaa' : index === 2 ? '#cd7f32' : '#333'
              }}>
                <span style={styles.medal}>{getMedalEmoji(index)}</span>
                <div style={styles.userInfo}>
                  <p style={styles.userName}>{ranking.user?.name}</p>
                  <p style={styles.userEmail}>{ranking.user?.email}</p>
                </div>
                <div style={styles.scoreInfo}>
                  <p style={styles.score}>
                    {category === 'global'
                      ? ranking.globalScore
                      : ranking.categoryRanks?.[category]?.score || 0} pts
                  </p>
                  <p style={styles.credibility}>
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

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0f0f1a', color: '#fff', padding: '20px' },
  content: { maxWidth: '700px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  back: { color: '#00d4ff', textDecoration: 'none' },
  title: { color: '#fff', margin: 0 },
  tabs: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' },
  tab: {
    padding: '8px 16px', borderRadius: '20px',
    border: '1px solid #333', cursor: 'pointer', fontSize: '13px'
  },
  rankingList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  empty: { color: '#666', textAlign: 'center', padding: '40px' },
  rankCard: {
    backgroundColor: '#1a1a2e', borderRadius: '12px',
    padding: '16px 20px', border: '1px solid',
    display: 'flex', alignItems: 'center', gap: '16px'
  },
  medal: { fontSize: '24px', minWidth: '40px', textAlign: 'center' },
  userInfo: { flex: 1 },
  userName: { color: '#fff', margin: 0, fontWeight: 'bold' },
  userEmail: { color: '#666', margin: 0, fontSize: '12px' },
  scoreInfo: { textAlign: 'right' },
  score: { color: '#00d4ff', fontWeight: 'bold', margin: 0, fontSize: '18px' },
  credibility: { color: '#666', margin: 0, fontSize: '12px' }
};

export default Leaderboard;