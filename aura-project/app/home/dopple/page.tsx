"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const WorkEfficiencyPage = () => {
  const fatigueChartRef = useRef<HTMLCanvasElement>(null);
  const efficiencyChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (fatigueChartRef.current) {
      new Chart(fatigueChartRef.current, {
        type: "line",
        data: {
          labels: ["9 AM", "10 AM", "11 AM"],
          datasets: [
            {
              label: "Fatigue Level",
              data: [20, 50, 70],
              borderColor: "#ff6384",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              fill: true,
              tension: 0.4, // Curve smoothing
            },
          ],
        },
        options: {
          responsive: true,
          animation: { duration: 1000, easing: "easeInOutQuart" }, // Smooth animation
          plugins: { legend: { labels: { color: "#ffffff" } } },
          scales: { x: { ticks: { color: "#ffffff" } }, y: { ticks: { color: "#ffffff" } } },
        },
      });
    }

    if (efficiencyChartRef.current) {
      new Chart(efficiencyChartRef.current, {
        type: "bar",
        data: {
          labels: ["Monday", "Tuesday", "Wednesday"],
          datasets: [
            {
              label: "Work Efficiency",
              data: [80, 60, 90],
              backgroundColor: ["#36a2eb", "#ffce56", "#4bc0c0"],
              borderRadius: 5, // Rounded bar edges
            },
          ],
        },
        options: {
          responsive: true,
          animation: { duration: 1200, easing: "easeOutBounce" },
          plugins: { legend: { labels: { color: "#ffffff" } } },
          scales: { x: { ticks: { color: "#ffffff" } }, y: { ticks: { color: "#ffffff" } } },
        },
      });
    }
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen flex items-center justify-center px-6">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-700 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-blue-400 tracking-wide drop-shadow-lg">
            AURA - Work Efficiency Management
          </h1>
          <p className="text-gray-300 mt-2 text-lg">Real-time focus analysis & fatigue monitoring</p>
        </div>

        {/* Grid Layout for Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {/* Fatigue Level Chart */}
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-700 transition-all hover:scale-105 hover:shadow-2xl">
            <h3 className="text-xl font-semibold text-white">Fatigue Level</h3>
            <canvas ref={fatigueChartRef} className="w-full h-48 mt-4"></canvas>
          </div>

          {/* Work Efficiency Chart */}
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-700 transition-all hover:scale-105 hover:shadow-2xl">
            <h3 className="text-xl font-semibold text-white">Work Efficiency</h3>
            <canvas ref={efficiencyChartRef} className="w-full h-48 mt-4"></canvas>
          </div>

          {/* Alert Message */}
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col justify-center items-center transition-all hover:scale-105 hover:shadow-2xl">
            <h3 className="text-xl font-semibold text-white">Alert</h3>
            <p className="text-red-400 font-medium text-lg mt-4">⚠ Focus level is dropping!</p>
            <p className="text-gray-300 text-sm">Take a short break to restore your energy.</p>
          </div>

          {/* Productivity Tips */}
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col justify-center items-center transition-all hover:scale-105 hover:shadow-2xl">
            <h3 className="text-xl font-semibold text-white">Productivity Tips</h3>
            <p className="text-green-400 font-medium text-lg mt-4">💡 Stay hydrated and move every 45 minutes.</p>
          </div>

          {/* Focus Score */}
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col justify-center items-center transition-all hover:scale-105 hover:shadow-2xl">
            <h3 className="text-xl font-semibold text-white">Focus Score</h3>
            <p className="text-yellow-400 text-4xl font-bold mt-4">🔹 78%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkEfficiencyPage;
