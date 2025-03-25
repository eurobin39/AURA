"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "../../components/ui/badge";

interface FocusLog {
  id: number;
  timestamp: string;
  keyboard: number;
  mouseClicks: number;
  mouseDistance: number;
  focusScore: number;
}

export default function FocusStatsPage() {
  const [logs, setLogs] = useState<FocusLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/focus-log", { cache: "no-store" });
        const data = await res.json();
        setLogs(data.reverse());
      } catch (err) {
        console.error("Failed to fetch focus logs:", err);
      }
    };
  
    fetchLogs();
    const interval = setInterval(fetchLogs, 60000);
    return () => clearInterval(interval);
  }, []);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">🧠 Focus Tracking Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">📈 Focus Score</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={logs}>
                <XAxis dataKey="timestamp" stroke="#ccc" />
                <YAxis domain={[0, 100]} stroke="#ccc" />
                <Tooltip />
                <Line type="monotone" dataKey="focusScore" stroke="#38bdf8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">📊 Latest Session Summary</h2>
            {logs.length > 0 ? (
              <div className="space-y-2 text-sm">
                <p><strong>Time:</strong> {new Date(logs[logs.length - 1].timestamp).toLocaleTimeString()}</p>
                <p><strong>Keyboard Inputs:</strong> {logs[logs.length - 1].keyboard}</p>
                <p><strong>Mouse Clicks:</strong> {logs[logs.length - 1].mouseClicks}</p>
                <p><strong>Mouse Distance:</strong> {logs[logs.length - 1].mouseDistance} px</p>
                <p><strong>Focus Score:</strong> <Badge>{logs[logs.length - 1].focusScore} / 100</Badge></p>
              </div>
            ) : (
              <p>Waiting for first log...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
