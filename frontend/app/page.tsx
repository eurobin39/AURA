"use client";

import { useRouter } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";
import { Camera, Keyboard, Globe } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-800 text-white flex flex-col items-center justify-center px-8 py-12">
      <Head>
        <title>AURA - AI Productivity Assistant</title>
      </Head>

      {/* 헤더 */}
      <header className="w-full max-w-6xl flex justify-between items-center py-6 px-6">
        {/* 로고 & AURA 텍스트 */}
        <div className="flex items-center space-x-1">
          <img
            src="/AuraLogoBlue.png"
            alt="AURA Logo"
            className="h-50 w-auto max-h-16 object-contain"
          />
          <h1 className="text-4xl font-bold text-blue-400 tracking-wide ">AURA</h1>
        </div>
      </header>




      {/* 메인 Hero 섹션 */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center mt-20"
      >
        <h2 className="text-6xl font-extrabold text-white leading-tight drop-shadow-xl max-w-4xl">
          AI-driven <span className="text-blue-400">Productivity</span> Assistant
        </h2>
        <p className="text-lg text-gray-300 mt-6 max-w-2xl">
          Optimize your focus & workspace with Azure AI. <br />
          Analyze your behavior and get real-time feedback.
        </p>

        <button
          onClick={() => router.push("/login")}
          className="mt-8 px-10 py-4 text-lg font-semibold bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full shadow-xl hover:shadow-green-400/50 hover:scale-105 transition-all">
          Get Started
        </button>
      </motion.main>

      {/* 기능 설명 섹션 */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="max-w-5xl mt-10 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <FeatureCard
          Icon={Camera}
          title="Facial Expression & Eye Tracking"
          description="Track facial expressions & eye movements to analyze focus levels."
          color="from-blue-500 to-blue-400"
        />
        <FeatureCard
          Icon={Keyboard}
          title="Keyboard & Mouse Interaction Analysis"
          description="Understand typing speed, patterns, and mouse activity."
          color="from-green-500 to-green-400"
        />
        <FeatureCard
          Icon={Globe}
          title="IoT-based Environment Optimization"
          description="Optimize workspace lighting & sound based on focus levels."
          color="from-yellow-500 to-yellow-400"
        />
      </motion.section>

      {/* 푸터 */}
      <footer className="mt-20 text-gray-400 text-sm">
        © 2025 AURA. All rights reserved.
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  color: string;
}

function FeatureCard({ Icon, title, description, color }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0,0,0,0.2)" }}
      className="relative flex flex-col items-start p-5 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-md hover:bg-white/20 transition-all"
    >
      <div className={`w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-r ${color} shadow-md`}>
        <Icon className="text-white w-6 h-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-gray-300 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
