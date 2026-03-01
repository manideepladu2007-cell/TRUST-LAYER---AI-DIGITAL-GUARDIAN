import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  LayoutDashboard, 
  Search, 
  ShieldAlert, 
  Users, 
  User as UserIcon, 
  Settings,
  Bell,
  Menu,
  X,
  Lock
} from 'lucide-react';
import { AppProvider, useApp } from './AppContext';
import { Onboarding } from './screens/Onboarding';
import { Dashboard } from './screens/Dashboard';
import { Analyzer } from './screens/Analyzer';
import { TeachBack } from './screens/TeachBack';
import { AppPermissions } from './screens/AppPermissions';
import { PanicMode } from './screens/PanicMode';
import { CommunityFeed } from './screens/CommunityFeed';
import { Profile } from './screens/Profile';
import { AdminDashboard } from './screens/AdminDashboard';
import { cn } from './lib/utils';

const AppContent: React.FC = () => {
  const { user } = useApp();
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [screenData, setScreenData] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user.onboarded) {
    return <Onboarding />;
  }

  const navigate = (screen: string, data?: any) => {
    setCurrentScreen(screen);
    setScreenData(data);
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard': return <Dashboard onNavigate={navigate} />;
      case 'analyzer': return <Analyzer onNavigate={navigate} />;
      case 'analyzer-url': return <Analyzer onNavigate={navigate} initialMode="url" />;
      case 'teachback': return <TeachBack data={screenData} onNavigate={navigate} />;
      case 'permissions': return <AppPermissions />;
      case 'panic': return <PanicMode />;
      case 'community': return <CommunityFeed />;
      case 'profile': return <Profile />;
      case 'admin': return <AdminDashboard />;
      default: return <Dashboard onNavigate={navigate} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Command Nexus', icon: LayoutDashboard },
    { id: 'analyzer', label: 'Shield Zone', icon: Shield },
    { id: 'permissions', label: 'App Auditor', icon: Lock },
    { id: 'community', label: 'Sentinel Network', icon: Users },
    { id: 'profile', label: 'Guardian Profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen flex bg-[#031716] text-[#CCD0CF] overflow-hidden relative">
      <div className="fixed inset-0 bg-cyber-grid opacity-10 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-shift opacity-20 pointer-events-none" />

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-[#032F30]/80 backdrop-blur-xl border-r border-[#0A7075]/40 transition-all duration-500 lg:translate-x-0 lg:static shadow-[10px_0_40px_rgba(0,0,0,0.3)]",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center gap-4 mb-12 group cursor-pointer" onClick={() => navigate('dashboard')}>
            <div className="w-12 h-12 bg-[#0A7075] rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(10,112,117,0.5)] group-hover:scale-110 transition-transform duration-500">
              <Shield className="w-7 h-7 text-[#00F5D4]" />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-2xl font-black tracking-tighter text-white uppercase">TrustLayer</h1>
              <div className="h-1 w-full bg-gradient-to-r from-[#00F5D4] to-transparent rounded-full" />
            </div>
          </div>

          <nav className="flex-1 space-y-3">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 group relative overflow-hidden",
                  currentScreen === item.id 
                    ? "bg-[#0A7075] text-[#00F5D4] shadow-[0_10px_25px_rgba(10,112,117,0.3)]" 
                    : "text-[#6BA3BE] hover:bg-[#0A7075]/20 hover:text-white"
                )}
              >
                {currentScreen === item.id && (
                  <motion.div layoutId="activeNav" className="absolute inset-0 bg-[#0A7075] -z-10" />
                )}
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-500 group-hover:scale-125",
                  currentScreen === item.id ? "text-[#00F5D4]" : "text-[#6BA3BE]"
                )} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-8 border-t border-[#0A7075]/30 space-y-3">
            <button 
              onClick={() => navigate('panic')}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 group",
                currentScreen === 'panic'
                  ? "bg-[#ef4444] text-white shadow-[0_10px_25px_rgba(239,68,68,0.3)]"
                  : "text-[#ef4444] hover:bg-[#ef4444]/10"
              )}
            >
              <ShieldAlert className="w-5 h-5 group-hover:animate-pulse" />
              Panic Protocol
            </button>
            <button 
              onClick={() => navigate('admin')}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 group",
                currentScreen === 'admin'
                  ? "bg-[#00F5D4] text-[#031716] shadow-[0_10px_25px_rgba(0,245,212,0.3)]"
                  : "text-[#6BA3BE] hover:bg-[#0A7075]/20 hover:text-white"
              )}
            >
              <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-700" />
              Command Nexus
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-[#031716]/80 backdrop-blur-xl border-b border-[#0A7075]/30 px-8 py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-3 text-[#6BA3BE] hover:bg-[#0A7075]/20 rounded-xl transition-colors"
            >
              <Menu className="w-7 h-7" />
            </button>

            <div className="flex items-center gap-6 ml-auto">
              <button className="relative p-3 text-[#6BA3BE] hover:bg-[#0A7075]/20 rounded-full transition-all group">
                <Bell className="w-6 h-6 group-hover:text-[#00F5D4] transition-colors" />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#ef4444] rounded-full border-2 border-[#031716] shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
              </button>
              <div className="h-10 w-px bg-[#0A7075]/30" />
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-white uppercase tracking-wider">Guardian Prime</p>
                  <p className="text-[10px] text-[#00F5D4] font-black uppercase tracking-[0.2em]">{user.role}</p>
                </div>
                <div className="w-12 h-12 bg-[#032F30] rounded-2xl flex items-center justify-center border border-[#0A7075]/40 shadow-inner group cursor-pointer hover:border-[#00F5D4]/50 transition-all">
                  <UserIcon className="w-6 h-6 text-[#6BA3BE] group-hover:text-[#00F5D4] transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
