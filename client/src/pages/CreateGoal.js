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
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAICategorize = async () => {
    if (!formData.title) return toast.error('Enter a title first');
    setAiLoading(true);
    try {
      const res = await categorizeGoal({ title: formData.title, description: formData.description });
      const result = res.data.result;
      setAiSuggestion(result);
      setFormData({ ...formData, category: result.category });
      toast.success('AI categorized your goal!');
    } catch (err) {
      toast.error('AI categorization failed');
    }
    setAiLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createGoal(formData);
      toast.success('Goal created successfully!');
      navigate('/feed');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to create goal');
    }
    setLoading(false);
  };

  const categories = ['fitness', 'education', 'finance', 'health', 'career', 'personal'];

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white flex justify-center px-5 py-10"
      style={{ backgroundImage: 'radial-gradient(ellipse at 30% 30%, rgba(0,212,255,0.04) 0%, transparent 60%)' }}>
      <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-9 w-full max-w-lg h-fit">

        {/* Header */}
        <div className="flex items-center gap-4 mb-7">
          <Link to="/feed" className="text-[#00d4ff] text-sm font-medium hover:opacity-80 transition-all">← Back</Link>
          <h2 className="text-xl font-extrabold">Create New Goal</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Goal Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Run 5km every day for 30 days"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#0a0a14] border border-[#2a2a3e] rounded-lg text-white text-sm outline-none focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)] transition-all placeholder-gray-600"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe your goal in detail..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#0a0a14] border border-[#2a2a3e] rounded-lg text-white text-sm outline-none focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)] transition-all placeholder-gray-600 h-24 resize-vertical"
            />
          </div>

          {/* AI Categorize Button */}
          <button
            type="button"
            onClick={handleAICategorize}
            disabled={aiLoading}
            className="w-full py-3 bg-transparent text-[#00d4ff] border border-[#00d4ff] rounded-lg font-semibold text-sm hover:bg-[#00d4ff15] hover:shadow-[0_0_20px_rgba(0,212,255,0.15)] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {aiLoading ? '🤖 Categorizing...' : '🤖 Auto Categorize with AI'}
          </button>

          {/* AI Result */}
          {aiSuggestion && (
            <div className="bg-[#0a0a14] border border-[#00d4ff44] rounded-lg p-4 text-sm text-gray-400">
              <p>✅ Category: <span className="text-white font-bold">{aiSuggestion.category}</span></p>
              <p className="mt-1">📊 Confidence: <span className="text-white font-bold">{aiSuggestion.confidence}</span></p>
              {aiSuggestion.suggestion && (
                <p className="mt-1">💡 Suggestion: <span className="text-gray-300">{aiSuggestion.suggestion}</span></p>
              )}
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#0a0a14] border border-[#2a2a3e] rounded-lg text-white text-sm outline-none focus:border-[#00d4ff] transition-all cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#0a0a14] border border-[#2a2a3e] rounded-lg text-white text-sm outline-none focus:border-[#00d4ff] transition-all"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#00d4ff] text-[#0a0a14] font-bold rounded-lg text-base hover:brightness-110 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-[#00d4ff22]"
          >
            {loading ? 'Creating...' : '🚀 Create Goal'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGoal;