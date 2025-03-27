"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Brain, BarChart2, Settings, LogOut } from "lucide-react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <div className="flex h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-black/20 backdrop-blur-lg border-r border-gray-700 flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <Link href="/home" className="flex items-center">
            <img
              src="/AuraLogoBlue.png"
              alt="AURA Logo"
              className="h-8 w-auto mr-2"
            />
            <span className="text-2xl font-bold text-blue-400">AURA</span>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 mt-6">
          <ul className="space-y-2">
            <li>
              <Link
                href="/home"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive('/home') 
                    ? 'bg-blue-600/20 text-blue-400' 
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
            </li>
            
            <li>
              <Link
                href="/home/focus-coach"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  pathname.includes('/focus-coach') 
                    ? 'bg-blue-600/20 text-blue-400' 
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <Brain className="mr-3 h-5 w-5" />
                Focus Coach
              </Link>
            </li>
            
            <li>
              <Link
                href="/home/work"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  pathname.includes('/work') 
                    ? 'bg-blue-600/20 text-blue-400' 
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <BarChart2 className="mr-3 h-5 w-5" />
                Work Efficiency
              </Link>
            </li>
            
            <li>
              <Link
                href="/home/settings"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  pathname.includes('/settings') 
                    ? 'bg-blue-600/20 text-blue-400' 
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
        <button
            onClick={async () => {
            await fetch("/api/logout", { method: "POST" });
            window.location.href = "/login"; // or use router.push
            }}
            className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
        >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
        </button>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}