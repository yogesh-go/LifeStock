import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const categories = [
    { emoji: '💪', name: 'Fitness', desc: 'Run, gym, yoga, sports' },
    { emoji: '📚', name: 'Education', desc: 'Learn, study, certify' },
    { emoji: '💰', name: 'Finance', desc: 'Save, invest, budget' },
    { emoji: '❤️', name: 'Health', desc: 'Diet, sleep, wellness' },
    { emoji: '💼', name: 'Career', desc: 'Jobs, skills, projects' },
    { emoji: '🌟', name: 'Personal', desc: 'Habits, travel, hobbies' },
  ];

  const steps = [
    { num: 1, title: 'Create a Goal', desc: 'Set a personal goal with a deadline. AI automatically categorizes it.' },
    { num: 2, title: 'Community Invests', desc: 'Others buy YES or NO shares predicting whether you will achieve your goal.' },
    { num: 3, title: 'Submit Proof', desc: 'When you achieve your goal, submit proof. AI verifies it.' },
    { num: 4, title: 'Earn Rewards', desc: 'Winners earn 2x their investment. Climb the leaderboard.' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-5 border-b border-[#2a2a3e] sticky top-0 bg-[#0a0a14]/90 backdrop-blur-md z-50">
        <h1 className="text-2xl font-extrabold text-[#00d4ff]">📈 LifeStock</h1>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-gray-400 px-5 py-2 rounded-lg border border-[#2a2a3e] hover:text-white hover:border-gray-500 transition-all text-sm font-medium">
            Login
          </Link>
          <Link to="/register" className="bg-[#00d4ff] text-[#0a0a14] px-5 py-2 rounded-lg font-bold text-sm hover:brightness-110 transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="text-center px-5 py-24 max-w-4xl mx-auto relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.08)_0%,transparent_70%)] pointer-events-none" />
        <span className="inline-block bg-[#00d4ff15] text-[#00d4ff] border border-[#00d4ff33] px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
          🚀 The Future of Goal Setting
        </span>
        <h1 className="text-6xl font-extrabold leading-tight mb-5">
          Invest in Human{' '}
          <span className="bg-gradient-to-r from-[#00d4ff] via-[#0080ff] to-[#8000ff] bg-clip-text text-transparent">
            Potential
          </span>
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
          LifeStock is a prediction market for personal goals. Set goals,
          let others invest in your success, and earn rewards when you achieve them.
        </p>
        <div className="flex gap-4 justify-center mb-16">
          <Link to="/register" className="bg-[#00d4ff] text-[#0a0a14] px-8 py-4 rounded-xl font-bold text-base hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-lg shadow-[#00d4ff22]">
            🚀 Start Trading Goals
          </Link>
          <Link to="/login" className="border border-[#2a2a3e] text-white px-8 py-4 rounded-xl font-medium text-base hover:border-gray-500 transition-all">
            Login →
          </Link>
        </div>
        <div className="flex justify-center gap-12 flex-wrap">
          {[
            { emoji: '📈', label: 'Live Stock Prices' },
            { emoji: '🤖', label: 'AI Verification' },
            { emoji: '🏆', label: 'Global Rankings' },
            { emoji: '⚡', label: 'Real-time Updates' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl mb-1">{stat.emoji}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-6xl mx-auto px-10 py-20">
        <h2 className="text-4xl font-extrabold text-center mb-3">How It Works</h2>
        <p className="text-gray-400 text-center mb-12">Four simple steps to start trading goals</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map(step => (
            <div key={step.num} className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-7 text-center hover:border-[#00d4ff44] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#00d4ff11] transition-all">
              <div className="w-11 h-11 bg-[#00d4ff] text-[#0a0a14] rounded-full flex items-center justify-center font-extrabold text-lg mx-auto mb-4">
                {step.num}
              </div>
              <h3 className="font-bold text-base mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto px-10 py-20">
        <h2 className="text-4xl font-extrabold text-center mb-3">Goal Categories</h2>
        <p className="text-gray-400 text-center mb-12">Trade across 6 life categories</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <div key={cat.name} className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-6 text-center hover:border-[#00d4ff44] hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-[#00d4ff11] transition-all cursor-pointer">
              <p className="text-3xl mb-2">{cat.emoji}</p>
              <p className="font-bold text-sm mb-1">{cat.name}</p>
              <p className="text-xs text-gray-500">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-20 px-5 border-t border-[#2a2a3e] bg-gradient-to-b from-[#0a0a14] to-[#12121f]">
        <h2 className="text-4xl font-extrabold mb-3">Ready to Invest in Yourself?</h2>
        <p className="text-gray-400 mb-8 text-base">Join LifeStock and turn your goals into a market</p>
        <Link to="/register" className="bg-[#00d4ff] text-[#0a0a14] px-10 py-4 rounded-xl font-bold text-base hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-lg shadow-[#00d4ff22]">
          🚀 Create Free Account
        </Link>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-[#1a1a2e] text-gray-600 text-sm">
        📈 LifeStock — Built with MERN Stack, Socket.io & AI
      </footer>
    </div>
  );
};

export default Landing;