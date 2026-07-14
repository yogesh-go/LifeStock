import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGoals } from '../utils/api';

const Landing = () => {
  const [trendingGoals, setTrendingGoals] = useState([]);

  useEffect(() => {
    fetchTrendingGoals();
  }, []);

  const fetchTrendingGoals = async () => {
    try {
      const res = await getGoals({ status: 'active' });
      setTrendingGoals(res.data.slice(0, 3));
    } catch (err) {
      setTrendingGoals([]);
    }
  };

  const getPriceColor = (price) => {
    if (price >= 70) return 'text-[#00ff88]';
    if (price >= 40) return 'text-[#ffd700]';
    return 'text-[#ff4444]';
  };

  const steps = [
    { num: 1, title: 'Set a goal', desc: 'Create a goal with a deadline. AI categorizes it and suggests improvements instantly.' },
    { num: 2, title: 'Market opens', desc: 'Others buy YES or NO shares. Stock price reflects real-time community confidence.' },
    { num: 3, title: 'Submit proof', desc: 'Achieved it? Upload proof. AI verifies it. Community validates. No fakes pass.' },
    { num: 4, title: 'Collect rewards', desc: 'Winners earn 2x their stake. Climb the leaderboard. Build your credibility score.' },
  ];

  const features = [
    { emoji: '📈', title: 'Live stock prices', desc: 'Prices update in real-time via WebSockets as the community buys and sells shares.' },
    { emoji: '🤖', title: 'AI verification', desc: 'Multi-layer AI checks every proof submission. Fake claims don\'t survive the pipeline.' },
    { emoji: '🏆', title: 'Category leaderboards', desc: 'Rank globally or by category — fitness, education, career, finance, health, personal.' },
    { emoji: '🎯', title: 'Smart categorization', desc: 'Type or speak your goal. AI categorizes it, sets a deadline, and suggests improvements.' },
    { emoji: '⭐', title: 'Credibility score', desc: 'Every user builds a credibility score. Fake proofs tank it. Good track records raise it.' },
    { emoji: '💰', title: '2x reward system', desc: 'Correct predictions earn 2x the points staked. Back the right person and win big.' },
  ];

  const testimonials = [
    { text: '"I finally stuck to my gym goal because 200 people had money on me. The social pressure is real and it works."', name: 'Ananya R.', role: 'Fitness — 3 goals achieved', initial: 'A' },
    { text: '"Made 4,200 points in a week just by backing underdogs who delivered. This is more fun than any fantasy league."', name: 'Karan M.', role: 'Top investor — Global rank #4', initial: 'K' },
    { text: '"Set a goal to get a 15 LPA offer. Stock hit 92%. Got the offer. The community believed before I did."', name: 'Rohit K.', role: 'Career — DTU CSE placement', initial: 'R' },
  ];

  const faqs = [
    { q: 'What are points and how do I earn them?', a: 'Every new user starts with 1,000 points. You earn more by investing in goals that succeed or fail as you predicted. Correct YES and NO bets both pay 2x.' },
    { q: 'How does AI verify proof?', a: 'When you submit proof, AI checks the description against the goal category and assigns a verification score from 0–100. Scores below 60 trigger a community review before approval.' },
    { q: 'Can I bet against someone\'s goal?', a: 'Yes. Buying NO shares means you believe the goal will not be achieved. If you\'re right at the deadline, you earn 2x your stake.' },
    { q: 'What happens if a goal expires without proof?', a: 'If no proof is submitted by the deadline, the goal is marked failed. All NO shareholders receive 2x their investment.' },
  ];

  const stats = [
    { num: '2,400+', label: 'Goals created' },
    { num: '₹18L+', label: 'Points in circulation' },
    { num: '94%', label: 'Prediction accuracy' },
    { num: '6', label: 'Categories' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-4 border-b border-[#2a2a3e] sticky top-0 bg-[#0a0a14]/95 backdrop-blur-md z-50">
        <h1 className="text-xl font-bold text-[#00d4ff]">📈 LifeStock</h1>
        <div className="flex items-center gap-3">
          <a href="#how-it-works" className="text-gray-400 px-4 py-2 rounded-lg text-sm hover:text-white transition-all hidden md:block">How it works</a>
          <a href="#features" className="text-gray-400 px-4 py-2 rounded-lg text-sm hover:text-white transition-all hidden md:block">Features</a>
          <Link to="/login" className="text-gray-400 px-4 py-2 rounded-lg border border-[#2a2a3e] text-sm hover:text-white hover:border-gray-500 transition-all">
            Login
          </Link>
          <Link to="/register" className="bg-[#00d4ff] text-[#0a0a14] px-4 py-2 rounded-lg font-bold text-sm hover:brightness-110 transition-all">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="text-center px-5 py-24 max-w-4xl mx-auto relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.07)_0%,transparent_70%)] pointer-events-none" />
        <span className="inline-block bg-[#00d4ff10] text-[#00d4ff] border border-[#00d4ff30] px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
          🚀 The prediction market for human goals
        </span>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-5">
          Your goals deserve<br />
          a <span className="bg-gradient-to-r from-[#00d4ff] via-[#0080ff] to-[#8000ff] bg-clip-text text-transparent">real market</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
          Set a goal. Let the world bet on you. Earn rewards when you deliver.
          LifeStock turns personal ambition into a live, tradeable market.
        </p>
        <div className="flex gap-4 justify-center mb-16 flex-wrap">
          <Link to="/register" className="bg-[#00d4ff] text-[#0a0a14] px-8 py-4 rounded-xl font-bold text-base hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-lg shadow-[#00d4ff20]">
            Start trading goals →
          </Link>
          <a href="#how-it-works" className="border border-[#2a2a3e] text-white px-8 py-4 rounded-xl text-base hover:border-gray-500 transition-all">
            See how it works
          </a>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-10 flex-wrap">
          {stats.map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-[#00d4ff]">{stat.num}</p>
              <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-[#2a2a3e]" />

      {/* How It Works */}
      <div id="how-it-works" className="max-w-6xl mx-auto px-10 py-20">
        <h2 className="text-3xl font-bold text-center mb-3">How it works</h2>
        <p className="text-gray-400 text-center mb-12">Four steps from goal to reward</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map(step => (
            <div key={step.num} className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-6 text-center hover:border-[#00d4ff33] hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 bg-[#00d4ff] text-[#0a0a14] rounded-full flex items-center justify-center font-bold text-base mx-auto mb-4">
                {step.num}
              </div>
              <h3 className="font-bold text-sm mb-2">{step.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-[#2a2a3e]" />

      {/* Trending Goals */}
      <div className="max-w-6xl mx-auto px-10 py-20">
        <h2 className="text-3xl font-bold text-center mb-3">Trending right now</h2>
        <p className="text-gray-400 text-center mb-12">Goals the community is most confident about</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trendingGoals.length > 0 ? trendingGoals.map(goal => (
            <div key={goal._id} className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-5 hover:border-[#00d4ff33] transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-[#00d4ff10] text-[#00d4ff] px-3 py-1 rounded-full text-xs font-bold uppercase">
                  {goal.category}
                </span>
                <span className={`text-xl font-bold ${getPriceColor(goal.stockPrice)}`}>
                  {goal.stockPrice}%
                </span>
              </div>
              <h3 className="font-bold text-sm mb-3 leading-snug">{goal.title}</h3>
              <div className="flex justify-between text-xs text-gray-600">
                <span>👤 {goal.creator?.name}</span>
                <span>🔼 {goal.buyerCount} | 🔽 {goal.sellerCount}</span>
              </div>
            </div>
          )) : (
            // Placeholder cards if no goals yet
            [
              { category: 'fitness', price: 87, title: 'Run a half marathon by August 2026', creator: 'Arjun S.', buyers: 142, sellers: 21 },
              { category: 'education', price: 61, title: 'Crack GATE 2026 with AIR under 500', creator: 'Priya M.', buyers: 89, sellers: 56 },
              { category: 'career', price: 92, title: 'Land a 15 LPA+ placement offer', creator: 'Rohit K.', buyers: 203, sellers: 17 },
            ].map((goal, i) => (
              <div key={i} className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-5 hover:border-[#00d4ff33] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-[#00d4ff10] text-[#00d4ff] px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {goal.category}
                  </span>
                  <span className={`text-xl font-bold ${getPriceColor(goal.price)}`}>
                    {goal.price}%
                  </span>
                </div>
                <h3 className="font-bold text-sm mb-3 leading-snug">{goal.title}</h3>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>👤 {goal.creator}</span>
                  <span>🔼 {goal.buyers} | 🔽 {goal.sellers}</span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="text-center mt-8">
          <Link to="/register" className="text-[#00d4ff] text-sm font-semibold hover:underline">
            See all goals →
          </Link>
        </div>
      </div>

      <hr className="border-[#2a2a3e]" />

      {/* Features */}
      <div id="features" className="max-w-6xl mx-auto px-10 py-20">
        <h2 className="text-3xl font-bold text-center mb-3">Everything you need</h2>
        <p className="text-gray-400 text-center mb-12">Built for accountability, powered by community</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(feature => (
            <div key={feature.title} className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-6 hover:border-[#00d4ff33] hover:-translate-y-1 transition-all">
              <p className="text-2xl mb-3">{feature.emoji}</p>
              <h3 className="font-bold text-sm mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-[#2a2a3e]" />

      {/* Testimonials */}
      <div className="max-w-6xl mx-auto px-10 py-20">
        <h2 className="text-3xl font-bold text-center mb-3">What users say</h2>
        <p className="text-gray-400 text-center mb-12">From the community</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {testimonials.map(testi => (
            <div key={testi.name} className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-6">
              <p className="text-gray-400 text-sm leading-relaxed mb-5 italic">{testi.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#00d4ff] text-[#0a0a14] flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {testi.initial}
                </div>
                <div>
                  <p className="font-bold text-sm">{testi.name}</p>
                  <p className="text-xs text-gray-600">{testi.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-[#2a2a3e]" />

      {/* FAQ */}
      <div className="max-w-2xl mx-auto px-10 py-20">
        <h2 className="text-3xl font-bold text-center mb-3">Common questions</h2>
        <p className="text-gray-400 text-center mb-12">Everything you need to know</p>
        <div className="flex flex-col gap-4">
          {faqs.map(faq => (
            <div key={faq.q} className="bg-[#12121f] border border-[#2a2a3e] rounded-xl p-5">
              <h3 className="font-bold text-sm mb-2">{faq.q}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-20 px-5 border-t border-[#2a2a3e] bg-gradient-to-b from-[#0a0a14] to-[#12121f]">
        <h2 className="text-4xl font-bold mb-3">Ready to put your goals on the market?</h2>
        <p className="text-gray-400 mb-8">Join thousands of users already trading goals on LifeStock</p>
        <Link to="/register" className="bg-[#00d4ff] text-[#0a0a14] px-10 py-4 rounded-xl font-bold text-base hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-lg shadow-[#00d4ff20]">
          Create free account →
        </Link>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between px-10 py-6 border-t border-[#2a2a3e]">
        <p className="text-gray-600 text-xs">📈 LifeStock — Built with MERN Stack, Socket.io & AI</p>
        <div className="flex gap-6">
          <a href="https://github.com/yogesh-go/lifestock" target="_blank" rel="noreferrer" className="text-gray-600 text-xs hover:text-gray-400 transition-all">GitHub</a>
          <a href="https://www.linkedin.com/in/yogesh91kumar/" target="_blank" rel="noreferrer" className="text-gray-600 text-xs hover:text-gray-400 transition-all">LinkedIn</a>
        </div>
      </footer>

    </div>
  );
};

export default Landing;