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

  const latest = logs[logs.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">🧠 Focus Tracking Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Focus Score Chart */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">📈 Focus Score Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={logs}>
                <XAxis
                  dataKey="timestamp"
                  stroke="#ccc"
                  tickFormatter={(timeStr) => {
                    const date = new Date(timeStr);
                    return date.toLocaleTimeString();
                  }}
                />
                <YAxis domain={[0, 100]} stroke="#ccc" />
                <Tooltip
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleTimeString();
                  }}
                />
                <Line type="monotone" dataKey="focusScore" stroke="#38bdf8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Summary Section */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-semibold">📊 Latest Session Summary</h2>

          {latest ? (
            <>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-slate-300">🕒 Time</p>
                  <p className="text-lg font-semibold">{new Date(latest.timestamp).toLocaleTimeString()}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-slate-300">⌨️ Keyboard Inputs</p>
                  <p className="text-lg font-semibold">{latest.keyboard}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-slate-300">🖱 Mouse Clicks</p>
                  <p className="text-lg font-semibold">{latest.mouseClicks}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-slate-300">📐 Mouse Distance</p>
                  <p className="text-lg font-semibold">{latest.mouseDistance} px</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">📈 Focus Score</p>
                    <p className="text-lg font-semibold">{latest.focusScore} / 100</p>
                  </div>
                  <Badge>{latest.focusScore >= 60 ? "✅ Good" : "⚠ Low"}</Badge>
                </CardContent>
              </Card>
            </>
          ) : (
            <p>Waiting for first log...</p>
          )}
        </div>
      </div>
    </div>
  );
}
