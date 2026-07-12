import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createGoal, categorizeGoal } from '../utils/api';

const CreateGoal = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'fitness',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAICategorize = async () => {
    if (!formData.title) return toast.error('Enter a title first');
    try {
      const res = await categorizeGoal({ title: formData.title, description: formData.description });
      const result = res.data.result;
      setAiSuggestion(result);
      setFormData({ ...formData, category: result.category });
      toast.success('AI categorized your goal!');
    } catch (err) {
      toast.error('AI categorization failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createGoal(formData);
      toast.success('Goal created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to create goal');
    }
    setLoading(false);
  };

  const categories = ['fitness', 'education', 'finance', 'health', 'career', 'personal'];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <Link to="/" style={styles.back}>← Back</Link>
          <h2 style={styles.title}>Create New Goal</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Goal Title</label>
          <input
            style={styles.input}
            type="text"
            name="title"
            placeholder="e.g. Run 5km every day for 30 days"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Description</label>
          <textarea
            style={{ ...styles.input, height: '100px', resize: 'vertical' }}
            name="description"
            placeholder="Describe your goal in detail..."
            value={formData.description}
            onChange={handleChange}
          />

          <button
            type="button"
            onClick={handleAICategorize}
            style={styles.aiBtn}
          >
            🤖 Auto Categorize with AI
          </button>

          {aiSuggestion && (
            <div style={styles.aiResult}>
              <p>✅ Category: <strong>{aiSuggestion.category}</strong></p>
              <p>📊 Confidence: <strong>{aiSuggestion.confidence}</strong></p>
              {aiSuggestion.suggestion && (
                <p>💡 Suggestion: {aiSuggestion.suggestion}</p>
              )}
            </div>
          )}

          <label style={styles.label}>Category</label>
          <select
            style={styles.input}
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <label style={styles.label}>Deadline</label>
          <input
            style={styles.input}
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Creating...' : '🚀 Create Goal'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh', backgroundColor: '#0f0f1a',
    display: 'flex', justifyContent: 'center',
    padding: '40px 20px'
  },
  card: {
    backgroundColor: '#1a1a2e', borderRadius: '12px',
    padding: '32px', width: '100%', maxWidth: '500px',
    height: 'fit-content', border: '1px solid #333'
  },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  back: { color: '#00d4ff', textDecoration: 'none' },
  title: { color: '#fff', margin: 0 },
  label: { display: 'block', color: '#aaa', fontSize: '13px', marginBottom: '6px' },
  input: {
    width: '100%', padding: '12px', marginBottom: '16px',
    borderRadius: '8px', border: '1px solid #333',
    backgroundColor: '#0f0f1a', color: '#fff',
    fontSize: '14px', boxSizing: 'border-box'
  },
  aiBtn: {
    width: '100%', padding: '10px', marginBottom: '16px',
    backgroundColor: 'transparent', color: '#00d4ff',
    border: '1px solid #00d4ff', borderRadius: '8px',
    cursor: 'pointer', fontSize: '14px'
  },
  aiResult: {
    backgroundColor: '#0f0f1a', borderRadius: '8px',
    padding: '12px', marginBottom: '16px',
    border: '1px solid #00d4ff', color: '#aaa', fontSize: '13px'
  },
  submitBtn: {
    width: '100%', padding: '12px',
    backgroundColor: '#00d4ff', color: '#0f0f1a',
    border: 'none', borderRadius: '8px',
    fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
  }
};

export default CreateGoal;