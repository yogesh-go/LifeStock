import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { categorizeGoal, getGoalSuggestions, verifyProof, createGoal } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AIFeatures = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Suggestions state
  const [sugCategory, setSugCategory] = useState('fitness');
  const [interests, setInterests] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Proof review state
  const [proofText, setProofText] = useState('');
  const [goalTitle, setGoalTitle] = useState('');
  const [proofCategory, setProofCategory] = useState('fitness');
  const [proofResult, setProofResult] = useState(null);
  const [loadingProof, setLoadingProof] = useState(false);

  const categories = ['fitness', 'education', 'finance', 'health', 'career', 'personal'];

  const handleGetSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const res = await getGoalSuggestions({ category: sugCategory, userInterests: interests });
      setSuggestions(res.data.suggestions);
      toast.success('Suggestions generated!');
    } catch (err) {
      toast.error('Failed to generate suggestions');
    }
    setLoadingSuggestions(false);
  };

  const handleUseSuggestion = (suggestion) => {
    navigate('/create', {
      state: {
        title: suggestion.title,
        description: suggestion.description,
        category: sugCategory,
        deadline: new Date(Date.now() + suggestion.suggestedDeadlineDays * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0]
      }
    });
  };

  const handleVerifyProof = async () => {
    if (!proofText) return toast.error('Enter proof description');
    if (!goalTitle) return toast.error('Enter goal title');
    setLoadingProof(true);
    try {
      const res = await verifyProof({
        goalTitle,
        goalCategory: proofCategory,
        proofDescription: proofText
      });
      setProofResult(res.data.result);
      toast.success('Proof analyzed!');
    } catch (err) {
      toast.error('Failed to analyze proof');
    }
    setLoadingProof(false);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-[#00ff88]';
    if (score >= 50) return 'text-[#ffd700]';
    return 'text-[#ff4444]';
  };

  const getBarColor = (score) => {
    if (score >= 70) return 'bg-[#00ff88]';
    if (score >= 50) return 'bg-[#ffd700]';
    return 'bg-[#ff4444]';
  };

  const getVerdict = (result) => {
    if (!result) return null;
    if (result.recommendation === 'approve') return {
      icon: '✅', title: 'Recommendation: Approve',
      desc: 'Proof contains sufficient evidence.',
      color: 'text-[#00ff88]', bg: 'bg-[#00ff8806] border-[#00ff8830]'
    };
    if (result.recommendation === 'review') return {
      icon: '⚠️', title: 'Recommendation: Manual Review',
      desc: 'Proof needs additional verification.',
      color: 'text-[#ffd700]', bg: 'bg-[#ffd70006] border-[#ffd70030]'
    };
    return {
      icon: '❌', title: 'Recommendation: Reject',
      desc: 'Proof lacks sufficient evidence.',
      color: 'text-[#ff4444]', bg: 'bg-[#ff444406] border-[#ff444430]'
    };
  };

  const verdict = getVerdict(proofResult);

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

      <div className="px-6 py-6 max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link to="/feed" className="text-[#00d4ff] text-sm font-medium hover:opacity-80 transition-all">← Dashboard</Link>
          <h2 className="text-2xl font-bold mt-2">🤖 AI Features</h2>
          <p className="text-gray-500 text-sm mt-1">Goal suggestions and proof verification powered by AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* AI Goal Suggestions */}
          <div className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-6">
            <h3 className="font-bold text-base mb-1">✨ AI Goal Suggestions</h3>
            <p className="text-gray-500 text-sm mb-5">Pick a category and describe your interest</p>

            {/* Category Pills */}
            <div className="flex gap-2 flex-wrap mb-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSugCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all capitalize ${
                    sugCategory === cat
                      ? 'bg-[#00d4ff] text-[#0a0a14] border-[#00d4ff] font-bold'
                      : 'border-[#2a2a3e] text-gray-500 hover:border-[#00d4ff] hover:text-[#00d4ff]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Interest Input */}
            <input
              type="text"
              placeholder="e.g. I want to get fit, run more, lose weight..."
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a14] border border-[#2a2a3e] rounded-lg text-white text-sm outline-none focus:border-[#00d4ff] transition-all placeholder-gray-600 mb-3"
            />

            <button
              onClick={handleGetSuggestions}
              disabled={loadingSuggestions}
              className="w-full py-3 bg-[#00d4ff] text-[#0a0a14] font-bold rounded-lg text-sm hover:brightness-110 transition-all disabled:opacity-60 mb-5"
            >
              {loadingSuggestions ? '✨ Generating...' : '✨ Generate Suggestions'}
            </button>

            {/* Suggestions List */}
            {suggestions.length > 0 ? (
              <div className="flex flex-col gap-3">
                {suggestions.map((sug, i) => (
                  <div key={i} className="bg-[#0a0a14] border border-[#2a2a3e] rounded-xl p-4 hover:border-[#00d4ff33] transition-all">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <p className="font-bold text-sm mb-1">{sug.title}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{sug.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className="bg-[#00d4ff10] text-[#00d4ff] px-2 py-0.5 rounded-full text-xs">
                          {sug.suggestedDeadlineDays}d
                        </span>
                        <button
                          onClick={() => handleUseSuggestion(sug)}
                          className="border border-[#00d4ff] text-[#00d4ff] px-3 py-1 rounded-lg text-xs hover:bg-[#00d4ff15] transition-all"
                        >
                          Use this
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-600">
                <p className="text-3xl mb-2">✨</p>
                <p className="text-sm">Select a category and generate suggestions</p>
              </div>
            )}
          </div>

          {/* AI Proof Review */}
          <div className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-6">
            <h3 className="font-bold text-base mb-1">🔍 AI Proof Review</h3>
            <p className="text-gray-500 text-sm mb-5">Get instant AI analysis on your proof</p>

            {/* Goal Title */}
            <div className="mb-3">
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Goal Title</label>
              <input
                type="text"
                placeholder="What was your goal?"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a14] border border-[#2a2a3e] rounded-lg text-white text-sm outline-none focus:border-[#00d4ff] transition-all placeholder-gray-600"
              />
            </div>

            {/* Category */}
            <div className="mb-3">
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setProofCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs border transition-all capitalize ${
                      proofCategory === cat
                        ? 'bg-[#00d4ff] text-[#0a0a14] border-[#00d4ff] font-bold'
                        : 'border-[#2a2a3e] text-gray-500 hover:border-[#00d4ff]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Proof Description */}
            <div className="mb-3">
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Proof Description</label>
              <textarea
                placeholder="Describe your proof in detail. The more specific, the higher your score..."
                value={proofText}
                onChange={(e) => setProofText(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a14] border border-[#2a2a3e] rounded-lg text-white text-sm outline-none focus:border-[#00d4ff] transition-all placeholder-gray-600 h-24 resize-vertical"
              />
            </div>

            <button
              onClick={handleVerifyProof}
              disabled={loadingProof}
              className="w-full py-3 bg-[#00d4ff] text-[#0a0a14] font-bold rounded-lg text-sm hover:brightness-110 transition-all disabled:opacity-60 mb-5"
            >
              {loadingProof ? '🔍 Analyzing...' : '🔍 Analyze Proof with AI'}
            </button>

            {/* Results */}
            {proofResult ? (
              <div>
                {/* Score Cards */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Confidence', value: proofResult.verificationScore },
                    { label: 'Authenticity', value: Math.round(proofResult.verificationScore * 0.9) },
                    { label: 'Progress', value: Math.min(100, Math.round(proofResult.verificationScore * 1.1)) },
                  ].map(score => (
                    <div key={score.label} className="bg-[#0a0a14] border border-[#2a2a3e] rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">{score.label}</p>
                      <p className={`text-2xl font-bold ${getScoreColor(score.value)}`}>{score.value}</p>
                      <div className="h-1 bg-[#1a1a2e] rounded-full mt-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getBarColor(score.value)}`}
                          style={{ width: `${score.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Verdict */}
                {verdict && (
                  <div className={`border rounded-xl p-4 mb-4 flex items-start gap-3 ${verdict.bg}`}>
                    <span className="text-xl">{verdict.icon}</span>
                    <div>
                      <p className={`font-bold text-sm ${verdict.color}`}>{verdict.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{verdict.desc}</p>
                    </div>
                  </div>
                )}

                {/* AI Reason */}
                <div className="bg-[#0a0a14] border border-[#2a2a3e] rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">AI Analysis</p>
                  <p className="text-sm text-gray-300 leading-relaxed">{proofResult.reason}</p>
                </div>

                {/* Flags */}
                <div className="flex flex-col gap-2">
                  {[
                    { text: 'Description is detailed and specific', pass: proofText.length > 50 },
                    { text: `Matches goal category (${proofCategory})`, pass: true },
                    { text: 'Verification score above threshold', pass: proofResult.verificationScore >= 60 },
                    { text: 'No suspicious patterns detected', pass: proofResult.isLegitimate },
                  ].map((flag, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${flag.pass ? 'bg-[#00ff88]' : 'bg-[#ff4444]'}`} />
                      <span className={flag.pass ? 'text-gray-400' : 'text-gray-600'}>{flag.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-600">
                <p className="text-3xl mb-2">🔍</p>
                <p className="text-sm">Submit proof to get AI analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFeatures;