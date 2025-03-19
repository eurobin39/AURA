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
            { label: "Fatigue Level", data: [20, 50, 70], borderColor: "#ff6384", backgroundColor: "rgba(255, 99, 132, 0.2)", fill: true },
          ],
        },
        options: {
          responsive: true,
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
            { label: "Work Efficiency", data: [80, 60, 90], backgroundColor: "#36a2eb" },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: "#ffffff" } } },
          scales: { x: { ticks: { color: "#ffffff" } }, y: { ticks: { color: "#ffffff" } } },
        },
      });
    }
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-700 min-h-screen flex items-center justify-center px-6">
      <div className="max-w-5xl w-full">
        <div className="text-center bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-600">
          <h1 className="text-4xl font-extrabold text-blue-400 tracking-wide">AURA - Work Efficiency Management</h1>
          <p className="text-gray-300 mt-2 text-lg">Current Status: Analyzing Focus...</p>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-8">
          {/* Fatigue Chart */}
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-600">
            <h3 className="text-xl font-semibold text-white">Fatigue Level</h3>
            <canvas ref={fatigueChartRef} className="w-full h-48 mt-4"></canvas>
          </div>
          {/* Work Efficiency Chart */}
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-600">
            <h3 className="text-xl font-semibold text-white">Work Efficiency</h3>
            <canvas ref={efficiencyChartRef} className="w-full h-48 mt-4"></canvas>
          </div>
          {/* Alert Message */}
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-600 flex flex-col justify-center items-center">
            <h3 className="text-xl font-semibold text-white">Alert</h3>
            <p className="text-red-400 font-medium text-lg mt-4">⚠ Focus level is dropping.</p>
            <p className="text-gray-300 text-sm">We recommend taking a short break.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkEfficiencyPage;
