import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register(formData);
      loginUser(res.data.token, res.data.user);
      toast.success('Account created successfully!');
      navigate('/feed');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center px-5"
      style={{ backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(0,212,255,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,128,255,0.05) 0%, transparent 60%)' }}>
      <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-10 w-full max-w-md shadow-2xl">

        {/* Logo */}
        <h1 className="text-3xl font-extrabold text-[#00d4ff] text-center mb-1">📈 LifeStock</h1>
        <p className="text-gray-500 text-center text-sm mb-8">Create your account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Yogesh Kumar"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#0a0a14] border border-[#2a2a3e] rounded-lg text-white text-sm outline-none focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)] transition-all placeholder-gray-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#0a0a14] border border-[#2a2a3e] rounded-lg text-white text-sm outline-none focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)] transition-all placeholder-gray-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#0a0a14] border border-[#2a2a3e] rounded-lg text-white text-sm outline-none focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)] transition-all placeholder-gray-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#00d4ff] text-[#0a0a14] font-bold rounded-lg text-base hover:brightness-110 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-gray-500 text-center text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#00d4ff] font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;