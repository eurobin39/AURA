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
            <span className="text-2xl font-bold text-white">AURA</span>
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
                    ? 'bg-blue-600/20 text-white' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Home className="mr-3 h-5 w-5 text-white" />
                <div className="text-white">Dashboard</div>
              </Link>
            </li>
            
            <li>
              <Link
                href="/home/focus-coach"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  pathname.includes('/focus-coach') 
                    ? 'bg-blue-600/20 text-white' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Brain className="mr-3 h-5 w-5 text-white" />
                <div className="text-white">Focus Coach</div>  
              </Link>
            </li>
            
            <li>
              <Link
                href="/home/dopple"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  pathname.includes('/dopple') 
                    ? 'bg-blue-600/20 text-white' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <BarChart2 className="mr-3 h-5 w-5 text-white" />
                <div className="text-white">Work Efficiency</div>
              </Link>
            </li>
            
            <li>
              <Link
                href="/home/settings"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  pathname.includes('/settings') 
                    ? 'bg-blue-600/20 text-white' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Settings className="mr-3 h-5 w-5 text-white" />
                <div className="text-white">Settings</div>
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <Link
            href="/api/logout"
            className="flex items-center px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-white" />
            <div className="text-white">Logout</div>
          </Link>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}