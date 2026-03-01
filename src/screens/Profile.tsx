import React from 'react';
import { motion } from 'motion/react';
import { User, Shield, Award, Zap, Target, Clock, ChevronRight, Settings, LogOut, Share2, Star, ShieldCheck, Fingerprint } from 'lucide-react';
import { useApp } from '../AppContext';
import { cn } from '../lib/utils';

export const Profile: React.FC = () => {
  const { user, resetApp, addToast } = useApp();

  const achievements = [
    { id: '1', title: 'First Analysis', icon: Shield, date: '2 days ago', color: '#0A7075' },
    { id: '2', title: 'Scam Spotter', icon: Target, date: '1 day ago', color: '#0C969C' },
    { id: '3', title: '7 Day Streak', icon: Zap, date: 'Today', color: '#22c55e' },
    { id: '4', title: 'Verified Sentinel', icon: ShieldCheck, date: '3 days ago', color: '#6BA3BE' },
  ];

  const stats = [
    { label: 'Threats Neutralized', value: user?.threatsAnalyzed || '0', icon: Shield },
    { label: 'Awareness Level', value: user?.awarenessLevel || 'Novice', icon: Target },
    { label: 'Network Trust', value: `${user?.trustScore || 0}%`, icon: Award },
    { label: 'Cyber Streak', value: `${user?.streak || 0} Days`, icon: Zap },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10 division-transition">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase title-accent">Personnel Profile</h2>
          <p className="text-[#6BA3BE] font-bold text-xs uppercase tracking-[0.4em] opacity-80">Division 00: Identity Management</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => addToast('Identity settings terminal initialized...', 'info')}
            className="p-4 bg-[#032F30] border border-[#0A7075]/40 rounded-2xl text-[#6BA3BE] hover:text-[#00F5D4] hover:border-[#00F5D4]/50 transition-all shadow-lg group"
          >
            <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-700" />
          </button>
          <button 
            onClick={() => addToast('Generating encrypted profile share link...', 'info')}
            className="p-4 bg-[#032F30] border border-[#0A7075]/40 rounded-2xl text-[#6BA3BE] hover:text-[#00F5D4] hover:border-[#00F5D4]/50 transition-all shadow-lg group"
          >
            <Share2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-10">
          <div className="glass-card p-12 text-center space-y-8 border-[#0C969C]/30 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#00F5D4] to-transparent opacity-50" />
            <div className="relative inline-block">
              <div className="w-40 h-40 bg-[#031716] rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-[#0A7075] shadow-[0_0_40px_rgba(10,112,117,0.3)] group-hover:border-[#00F5D4] transition-colors duration-500 shadow-inner">
                <User className="w-20 h-20 text-[#6BA3BE] group-hover:text-[#00F5D4] transition-colors" />
              </div>
              <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-[#00F5D4] rounded-2xl flex items-center justify-center border-4 border-[#032F30] shadow-xl radar-pulse">
                <ShieldCheck className="w-6 h-6 text-[#031716]" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-white uppercase tracking-tight group-hover:text-[#00F5D4] transition-colors">{user?.role || 'Sentinel'}</h3>
              <p className="text-[11px] text-[#6BA3BE] font-black uppercase tracking-[0.3em] opacity-70">Active Duty • ID: TL-99281</p>
            </div>
            <div className="pt-8 border-t border-[#0A7075]/20 flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-black text-[#6BA3BE] uppercase tracking-[0.2em]">Digital Habits</span>
                <span className="text-[11px] font-black text-[#00F5D4] uppercase tracking-widest">{user?.habits.length || 0} Tracked</span>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                {user?.habits.map((habit, i) => (
                  <span key={i} className="px-4 py-2 bg-[#031716] border border-[#0A7075]/40 rounded-xl text-[10px] font-black text-[#6BA3BE] uppercase tracking-widest hover:border-[#00F5D4]/40 transition-colors">
                    {habit}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card p-8 border-[#ef4444]/30 bg-[#ef4444]/5 hover:bg-[#ef4444]/10 transition-all group">
            <button 
              onClick={resetApp}
              className="w-full flex items-center justify-between text-[#ef4444]"
            >
              <div className="flex items-center gap-5">
                <div className="p-4 bg-[#ef4444]/10 rounded-2xl group-hover:bg-[#ef4444]/20 transition-colors shadow-inner">
                  <LogOut className="w-6 h-6" />
                </div>
                <span className="font-black uppercase tracking-[0.2em] text-xs">Terminate Session</span>
              </div>
              <ChevronRight className="w-6 h-6 opacity-50 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="glass-card p-8 border-[#0C969C]/20 text-center space-y-4 hover:border-[#00F5D4]/30 transition-all group shadow-lg"
              >
                <div className="w-12 h-12 bg-[#031716] rounded-2xl flex items-center justify-center mx-auto border border-[#0A7075]/40 group-hover:border-[#00F5D4]/50 transition-colors shadow-inner">
                  <stat.icon className="w-6 h-6 text-[#6BA3BE] group-hover:text-[#00F5D4] transition-colors" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-white tracking-tighter group-hover:text-[#00F5D4] transition-colors">{stat.value}</p>
                  <p className="text-[10px] font-black text-[#6BA3BE] uppercase tracking-[0.2em] leading-tight opacity-70">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="glass-card p-12 space-y-10 border-[#0C969C]/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00F5D4]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-5">
                <Award className="w-8 h-8 text-[#00F5D4]" />
                Merit Badges & Achievements
              </h3>
              <button 
                onClick={() => addToast('Accessing achievement archives...', 'info')}
                className="text-[11px] font-black text-[#6BA3BE] uppercase tracking-[0.2em] hover:text-[#00F5D4] transition-colors"
              >
                View All Archive
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {achievements.map((achievement, i) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={achievement.id}
                  className="p-8 bg-[#031716]/60 border border-[#0A7075]/40 rounded-3xl flex items-center gap-8 group hover:border-[#00F5D4]/50 transition-all shadow-inner"
                >
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-xl group-hover:scale-110 transition-transform duration-500 border"
                    style={{ backgroundColor: `${achievement.color}15`, color: achievement.color === '#0A7075' ? '#00F5D4' : achievement.color, borderColor: `${achievement.color}40` }}
                  >
                    <achievement.icon className="w-9 h-9" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-[#00F5D4] transition-colors">{achievement.title}</h4>
                    <div className="flex items-center gap-3 text-[10px] text-[#6BA3BE] font-black uppercase tracking-[0.2em] opacity-70">
                      <Clock className="w-4 h-4" />
                      Earned {achievement.date}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass-card p-12 space-y-10 border-[#0C969C]/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00F5D4] to-transparent opacity-30" />
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-5">
                <Fingerprint className="w-8 h-8 text-[#6BA3BE]" />
                Security Clearance & Access
              </h3>
            </div>
            <div className="space-y-5">
              {[
                { label: 'Shield Zone Access', level: 'Level 4 / Authorized', status: 'Active' },
                { label: 'Mindguard Intelligence', level: 'Level 2 / Authorized', status: 'Active' },
                { label: 'Sentinel Network Node', level: 'Standard / Verified', status: 'Active' },
                { label: 'Command Nexus Terminal', level: 'Restricted / Admin Only', status: 'Locked' },
              ].map((access, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-[#031716]/60 rounded-2xl border border-[#0A7075]/30 hover:border-[#00F5D4]/40 transition-all group shadow-inner">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[#00F5D4] transition-colors">{access.label}</p>
                    <p className="text-[10px] font-black text-[#6BA3BE] uppercase tracking-[0.2em] opacity-70">{access.level}</p>
                  </div>
                  <div className={cn(
                    "px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                    access.status === 'Active' ? "bg-[#00F5D4]/10 text-[#00F5D4] border-[#00F5D4]/40 safe-outline" : "bg-white/5 text-white/30 border-white/10"
                  )}>
                    {access.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
