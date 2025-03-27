"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ToggleLeft, ToggleRight } from "lucide-react";

interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  lowFocusAlert?: boolean;
  feedbackInterval?: number;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({ email: '', username: '', newPassword: '' });
  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [lowFocusAlert, setLowFocusAlert] = useState(true);
  const [feedbackInterval, setFeedbackInterval] = useState(60);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const data = await res.json();
          if (!data?.id) router.push('/login');
          else {
            setIsAuthenticated(true);
            setUser(data);
            setForm({ email: data.email, username: data.username, newPassword: '' });
            setLowFocusAlert(data.lowFocusAlert ?? true);
            setFeedbackInterval(data.feedbackInterval ?? 60);
          }
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleToggleAlert = () => {
    setLowFocusAlert((prev) => !prev);
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeedbackInterval(parseInt(e.target.value));
  };

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          username: form.username,
          lowFocusAlert,
          feedbackInterval,
        }),
      });

      if (res.ok) {
        setMessage('✅ Profile updated successfully!');
      } else {
        const errorData = await res.json();
        setMessage(`❌ ${errorData.message || 'Failed to update profile.'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    if (!form.newPassword || !currentPassword) {
      setMessage('❌ Please enter your current and new password.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword: form.newPassword,
        }),
      });

      if (res.ok) {
        setMessage('✅ Password updated successfully!');
        setCurrentPassword('');
        setForm((prev) => ({ ...prev, newPassword: '' }));
      } else {
        const errorData = await res.json();
        setMessage(`❌ ${errorData.message || 'Failed to update password.'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated === null) return null;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-10 relative overflow-hidden flex flex-col">
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ scale: [1, 1.4, 1], opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "radial-gradient(circle at center, rgba(59,130,246,0.15), transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto w-full space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Settings</h1>

        {user ? (
          <>
            <section className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Profile</h2>
                <button
                  onClick={handleProfileSave}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition disabled:opacity-50"
                >
                  Save
                </button>
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleFormChange}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring"
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleFormChange}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring"
              />
            </section>

            <section className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4 shadow-xl mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Change Password</h2>
                <button
                  onClick={handlePasswordSave}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition disabled:opacity-50"
                >
                  Change
                </button>
              </div>
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring"
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={form.newPassword}
                onChange={handleFormChange}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring"
              />
            </section>

            <section className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Low Focus Alerts</h2>
                  <p className="text-sm text-gray-400">Toggle notifications when your focus drops.</p>
                </div>
                <button
                  onClick={handleToggleAlert}
                  className="text-blue-400 hover:text-blue-300 transition"
                >
                  {lowFocusAlert ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>
            </section>

            <section className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl mt-6">
              <h2 className="text-lg font-semibold mb-2">Feedback Interval</h2>
              <input
                type="range"
                min="15"
                max="120"
                step="15"
                value={feedbackInterval}
                onChange={handleIntervalChange}
                className="w-full accent-blue-500"
              />
              <div className="text-sm text-gray-300 mt-2 text-right">
                Every {feedbackInterval} minutes
              </div>
            </section>

            {message && <p className="text-sm text-gray-300 text-right pt-4">{message}</p>}
          </>
        ) : (
          <p className="text-center text-gray-400">Loading user data...</p>
        )}
      </div>

      <footer className="mt-10 text-center text-sm text-gray-500">
        <p className="opacity-60">✨ Stay focused. Let AURA guide you.</p>
      </footer>
    </div>
  );
}
