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
  const [form, setForm] = useState({ email: '', username: '', password: '' });
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
            setForm({ email: data.email, username: data.username, password: data.password });
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

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lowFocusAlert, feedbackInterval }),
      });

      if (res.ok) {
        setMessage('✅ Profile updated successfully!');
      } else {
        setMessage('❌ Failed to update profile.');
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
          background:
            "radial-gradient(circle at center, rgba(59,130,246,0.15), transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="relative z-5 max-w-2xl mx-auto w-full space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Settings</h1>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {user ? (
          <>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-semibold mb-2">Your Profile</h2>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Low Focus Alerts</h2>
                  <p className="text-sm text-gray-400">
                    Receive notifications when your focus drops below a threshold.
                  </p>
                </div>
                <button
                  onClick={handleToggleAlert}
                  className="text-blue-400 hover:text-blue-300 transition"
                >
                  {lowFocusAlert ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-semibold mb-2">Feedback Frequency</h2>
              <p className="text-sm text-gray-400 mb-3">
                Choose how often you receive AI-based productivity feedback.
              </p>
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
            </div>

            {message && <p className="text-sm text-gray-300 text-right">{message}</p>}
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
      {/* Footer CTA */}
      <footer className="mt-5 text-center text-sm text-gray-500">
          <p className="opacity-60">✨ Stay focused. Let AURA guide you.</p>
        </footer>
    </div>
  );
}