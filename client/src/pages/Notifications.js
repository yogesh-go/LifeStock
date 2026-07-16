import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Notifications = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'price', icon: '📈', bg: 'bg-[#00ff8810]', title: 'Your goal reached 87% confidence', desc: '"Run a half marathon" is now at 87%. The market believes in you!', time: '2 minutes ago', unread: true },
    { id: 2, type: 'trade', icon: '💹', bg: 'bg-[#00d4ff10]', title: 'Karan bought 10 YES shares', desc: 'Someone invested in your goal. Price moved to 92%.', time: '15 minutes ago', unread: true },
    { id: 3, type: 'proof', icon: '✅', bg: 'bg-[#ffd70010]', title: 'Proof approved!', desc: '"Complete DSA sheet" proof was approved. Points distributed to YES holders.', time: '1 hour ago', unread: true },
    { id: 4, type: 'goal', icon: '⚠️', bg: 'bg-[#ff444410]', title: 'Goal deadline in 7 days', desc: '"Save ₹50k this month" deadline is approaching. Submit proof on time.', time: '3 hours ago', unread: false },
    { id: 5, type: 'rank', icon: '🏆', bg: 'bg-[#8000ff10]', title: 'You climbed to Global Rank #4', desc: 'Your prediction accuracy put you in the top 10 globally!', time: 'Yesterday', unread: false },
    { id: 6, type: 'trade', icon: '💰', bg: 'bg-[#00ff8810]', title: 'You earned 480 pts', desc: 'Your NO bet paid off. Goal marked failed. Points credited.', time: '2 days ago', unread: false },
    { id: 7, type: 'proof', icon: '🔍', bg: 'bg-[#00d4ff10]', title: 'Proof under review', desc: '"Run 5km daily" proof is being reviewed by the community.', time: '3 days ago', unread: false },
    { id: 8, type: 'goal', icon: '🎯', bg: 'bg-[#ffd70010]', title: 'New goal in your category', desc: 'A new fitness goal was created. Check it out and invest!', time: '4 days ago', unread: false },
  ]);

  const tabs = ['all', 'goals', 'trades', 'proof'];

  const filtered = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'goals') return ['goal', 'rank', 'price'].includes(n.type);
    if (activeTab === 'trades') return n.type === 'trade';
    if (activeTab === 'proof') return n.type === 'proof';
    return true;
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

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

      <div className="px-6 py-6 max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link to="/feed" className="text-[#00d4ff] text-sm font-medium hover:opacity-80 transition-all">← Dashboard</Link>
            <h2 className="text-2xl font-bold mt-1">
              🔔 Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-[#00d4ff] text-[#0a0a14] text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h2>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-[#00d4ff] text-sm hover:underline transition-all"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs border transition-all capitalize ${
                activeTab === tab
                  ? 'bg-[#00d4ff] text-[#0a0a14] border-[#00d4ff] font-bold'
                  : 'border-[#2a2a3e] text-gray-500 hover:border-[#00d4ff] hover:text-[#00d4ff]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex flex-col gap-2">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔔</p>
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            filtered.map(notif => (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  notif.unread
                    ? 'bg-[#0d1a2a] border-[#00d4ff22] hover:border-[#00d4ff44]'
                    : 'bg-[#0a0a14] border-[#2a2a3e] hover:border-[#2a2a3e]'
                }`}
              >
                <div className={`w-10 h-10 rounded-full ${notif.bg} flex items-center justify-center text-lg flex-shrink-0`}>
                  {notif.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${notif.unread ? 'text-white' : 'text-gray-300'}`}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notif.desc}</p>
                  <p className="text-xs text-gray-600 mt-1.5">{notif.time}</p>
                </div>
                {notif.unread && (
                  <div className="w-2 h-2 rounded-full bg-[#00d4ff] flex-shrink-0 mt-1.5" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;