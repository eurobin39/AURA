"use client";

import { useRouter } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";
import { Camera, Keyboard, Sparkles } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center px-8 py-12">
      <Head>
        <title>AURA - AI Productivity Assistant</title>
      </Head>

      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center h-16 mb-2">
        <div className="flex items-center space-x-2">
          <Image
            src="/AuraLogoBlue.png"
            alt="AURA Logo"
            width={120} // 로고 크기 줄임
            height={72}
            className="object-contain"
          />
        </div>
      </header>

      {/* Hero Section */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center"
      >
        <h2 className="text-6xl font-extrabold text-white leading-tight drop-shadow-xl max-w-4xl">
          AI-powered <span className="text-blue-400">Focus</span> Optimization
        </h2>
        <p className="text-lg text-gray-300 mt-6 max-w-2xl">
          Supercharge your workflow with real-time behavioral insights and personalized feedback powered by Azure and OpenAI.
        </p>

        <button
          onClick={() => router.push("/login")}
          className="mt-4 px-10 py-4 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-full shadow-xl hover:shadow-indigo-400/50 hover:scale-105 transition-all"
        >
          Get Started
        </button>
      </motion.main>

      {/* Feature Cards */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="max-w-5xl mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <FeatureCard
          Icon={Camera}
          title="Facial Expression & Eye Tracking"
          description="Detect yaw, pitch, and expressions to evaluate your real-time focus levels."
          color="from-blue-500 to-blue-400"
        />
        <FeatureCard
          Icon={Keyboard}
          title="Interaction-Based Metrics"
          description="Track keyboard typing and mouse activity to analyze engagement."
          color="from-green-500 to-green-400"
        />
        <FeatureCard
          Icon={Sparkles}
          title="Generative AI Feedback"
          description="Get personalized insights and productivity feedback using OpenAI models."
          color="from-purple-500 to-pink-400"
        />
      </motion.section>

      <footer className="mt-10 text-gray-400 text-sm">
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
      className="relative flex flex-col items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg hover:bg-white/20 transition-all"
    >
      <div className={`w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-r ${color} shadow-md`}>
        <Icon className="text-white w-6 h-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-gray-300 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}