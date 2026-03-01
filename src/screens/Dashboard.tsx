import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield,
  ShieldCheck, 
  Search, 
  Link as LinkIcon, 
  Lock, 
  AlertTriangle, 
  TrendingUp, 
  History,
  ChevronRight,
  ArrowUpRight,
  Zap,
  Activity,
  Globe,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../AppContext';
import { aiService } from '../services/aiService';
import { ThreatFeedItem } from '../types';
import { cn } from '../lib/utils';

export const Dashboard: React.FC<{ onNavigate: (screen: string) => void }> = ({ onNavigate }) => {
  const { user, history, addToast } = useApp();
  const [threatFeed, setThreatFeed] = useState<ThreatFeedItem[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const feed = await aiService.generateThreatFeed(user.role);
        setThreatFeed(feed);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingFeed(false);
      }
    };
    fetchFeed();
  }, [user.role]);

  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-[#22c55e]';
    if (score > 50) return 'text-[#0C969C]';
    return 'text-[#ef4444]';
  };

  return (
    <div className="space-y-10 p-8 max-w-7xl mx-auto division-transition">
      {/* Division Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase title-accent">Shield Zone</h2>
          <p className="text-[#6BA3BE] font-bold text-xs uppercase tracking-[0.4em] opacity-80">Division 01: Protection Core</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 px-6 py-3 bg-[#043a3b] rounded-2xl border border-[#00F5D4]/30 shadow-[0_0_15px_rgba(0,245,212,0.1)]">
            <div className="relative">
              <Activity className="w-4 h-4 text-[#00F5D4]" />
              <div className="absolute inset-0 bg-[#00F5D4]/40 blur-sm rounded-full animate-pulse" />
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">System Nominal</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-[#ef4444]/10 rounded-2xl border border-[#ef4444]/40 risk-glow-high">
            <ShieldAlert className="w-4 h-4 text-[#ef4444]" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Threat Pulse: Active</span>
          </div>
        </div>
      </div>

      {/* Real-time Alert Ticker */}
      <div className="glass-card py-3 px-6 border-[#0A7075]/20 bg-[#031716]/50 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#031716] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#031716] to-transparent z-10" />
        <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
          {[
            "CRITICAL: New Phishing Campaign targeting UPI users detected in Sector 04",
            "ADVISORY: System update required for MindGuard Division",
            "ALERT: Unusual login attempt blocked from IP: 192.168.1.105",
            "INFO: TrustLayer v2.4.0 successfully deployed to all nodes",
            "WARNING: High-risk URL pattern detected in Community Feed"
          ].map((alert, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#00F5D4] rounded-full shadow-[0_0_8px_#00F5D4]" />
              <span className="text-[10px] font-black text-[#6BA3BE] uppercase tracking-widest">{alert}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card p-10 flex items-center justify-between border-[#0C969C]/40 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#00F5D4]/5 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-[#00F5D4]/10 transition-colors" />
          <div className="space-y-3 relative z-10">
            <p className="text-[10px] font-black text-[#6BA3BE] uppercase tracking-[0.3em] opacity-70">Cyber Hygiene</p>
            <h2 className={cn("text-7xl font-black tracking-tighter drop-shadow-2xl", getScoreColor(user.cyberScore))}>{user.cyberScore}%</h2>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#00F5D4] rounded-full animate-pulse" />
              <p className="text-[9px] font-bold text-[#00F5D4] uppercase tracking-widest">Optimal Status</p>
            </div>
          </div>
          <div className="relative w-28 h-28">
            <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(0,245,212,0.2)]" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#031716]" strokeWidth="4" />
              <motion.circle 
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${user.cyberScore}, 100` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="18" cy="18" r="16" fill="none" 
                className={cn("stroke-current", getScoreColor(user.cyberScore))} 
                strokeWidth="4" strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className={cn("w-10 h-10", getScoreColor(user.cyberScore))} />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card p-10 space-y-6 border-[#0C969C]/40 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#22c55e]/5 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-[#22c55e]/10 transition-colors" />
          <p className="text-[10px] font-black text-[#6BA3BE] uppercase tracking-[0.3em] opacity-70">Trust Network Score</p>
          <div className="flex items-end gap-4">
            <h2 className="text-7xl font-black text-white tracking-tighter">{user.trustScore}</h2>
            <div className="flex items-center gap-1 text-[#22c55e] mb-4 bg-[#22c55e]/10 px-2 py-1 rounded-lg border border-[#22c55e]/30">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[10px] font-black">+12%</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-[#032F30] bg-[#0A7075] flex items-center justify-center text-[8px] font-black text-white">
                  {i}
                </div>
              ))}
            </div>
            <p className="text-[9px] font-bold text-[#6BA3BE] uppercase tracking-widest">Top 15% Global Ranking</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card p-10 space-y-6 border-[#0C969C]/40 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#6BA3BE]/5 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-[#6BA3BE]/10 transition-colors" />
          <p className="text-[10px] font-black text-[#6BA3BE] uppercase tracking-[0.3em] opacity-70">Awareness Level</p>
          <div className="flex items-center gap-5">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{user.awarenessLevel}</h2>
            <div className="p-3 bg-[#6BA3BE]/10 rounded-2xl border border-[#6BA3BE]/40 shadow-lg">
              <Globe className="w-6 h-6 text-[#6BA3BE]" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-3 bg-[#031716] rounded-full overflow-hidden border border-[#0A7075]/30 p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: user.awarenessLevel === 'Beginner' ? '25%' : user.awarenessLevel === 'Aware' ? '50%' : user.awarenessLevel === 'Defender' ? '75%' : '100%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#0A7075] via-[#0C969C] to-[#00F5D4] rounded-full shadow-[0_0_20px_rgba(0,245,212,0.4)]" 
              />
            </div>
            <div className="flex justify-between text-[8px] font-black text-[#6BA3BE] uppercase tracking-[0.4em]">
              <span>Novice</span>
              <span className="text-[#00F5D4]">Elite Guardian</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <section className="space-y-10">
        <div className="flex items-center gap-6">
          <h3 className="text-xs font-black text-[#00F5D4] uppercase tracking-[0.5em] flex items-center gap-4 shrink-0">
            <Zap className="w-4 h-4 fill-current" />
            Tactical Operations
          </h3>
          <div className="h-px flex-1 bg-gradient-to-r from-[#00F5D4]/40 via-[#0A7075]/20 to-transparent" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { id: 'analyzer', label: 'Threat Analyzer', icon: Search, color: 'bg-[#0A7075]/10 text-[#00F5D4] border-[#00F5D4]/30 shadow-[0_10px_30px_rgba(0,245,212,0.1)]' },
            { id: 'analyzer-url', label: 'URL Scanner', icon: LinkIcon, color: 'bg-[#6BA3BE]/10 text-[#6BA3BE] border-[#6BA3BE]/40' },
            { id: 'permissions', label: 'App Auditor', icon: Lock, color: 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/40' },
            { id: 'panic', label: 'Panic Mode', icon: AlertTriangle, color: 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/40 risk-glow-high' },
          ].map(action => (
            <button
              key={action.id}
              onClick={() => {
                onNavigate(action.id);
                addToast(`Initializing ${action.label}...`, 'info');
              }}
              className={cn(
                "p-12 rounded-[3rem] border flex flex-col items-center gap-8 transition-all duration-700 hover:scale-[1.1] hover:cyber-glow active:scale-[0.9] group relative overflow-hidden",
                action.color
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-5 bg-black/20 rounded-[2rem] border border-white/5 group-hover:border-white/20 transition-all">
                <action.icon className="w-14 h-14 group-hover:scale-110 transition-transform duration-700" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Personalized Threat Feed */}
        <section className="lg:col-span-8 space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-[#00F5D4] uppercase tracking-[0.5em] flex items-center gap-4">
              <Globe className="w-4 h-4" />
              Intelligence Feed
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-5 py-2 bg-[#043a3b] border border-[#0A7075]/40 rounded-xl">
                <div className="w-2 h-2 bg-[#00F5D4] rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-[#6BA3BE] uppercase tracking-widest">Sector: {user.role}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            {loadingFeed ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="glass-card p-12 animate-pulse h-48 border-[#0A7075]/20" />
              ))
            ) : (
              threatFeed.map(item => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={item.id}
                  className="glass-card p-12 group cursor-pointer hover:border-[#00F5D4]/40 transition-all duration-700 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-transparent via-[#00F5D4] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start justify-between gap-10">
                    <div className="space-y-6">
                      <div className="flex items-center gap-5">
                        <span className={cn(
                          "px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                          item.severity === 'High' ? 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/40 risk-glow-high' : 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/40 risk-glow-medium'
                        )}>
                          {item.severity} SEVERITY
                        </span>
                        <div className="flex items-center gap-2 text-[#6BA3BE]">
                          <Shield className="w-3 h-3" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em]">{item.category}</span>
                        </div>
                      </div>
                      <h4 className="text-3xl font-black text-white group-hover:text-[#00F5D4] transition-colors tracking-tighter leading-none">{item.title}</h4>
                      <p className="text-base text-[#CCD0CF]/70 leading-relaxed line-clamp-2 font-medium max-w-2xl">{item.description}</p>
                    </div>
                    <div className="p-6 bg-[#031716] rounded-[2rem] border border-[#0A7075]/40 group-hover:border-[#00F5D4] transition-all group-hover:shadow-[0_0_30px_rgba(0,245,212,0.2)] shrink-0">
                      <ArrowUpRight className="w-8 h-8 text-[#6BA3BE] group-hover:text-[#00F5D4] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Micro Activity Timeline */}
        <section className="lg:col-span-4 space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-[#00F5D4] uppercase tracking-[0.5em] flex items-center gap-4">
              <Activity className="w-4 h-4" />
              Activity Stream
            </h3>
            <div className="p-2 bg-[#043a3b] border border-[#0A7075]/40 rounded-lg">
              <History className="w-4 h-4 text-[#6BA3BE]" />
            </div>
          </div>

          <div className="glass-card p-8 border-[#0A7075]/30 bg-[#032F30]/40 relative overflow-hidden">
            <div className="absolute left-12 top-10 bottom-10 w-px bg-gradient-to-b from-[#00F5D4]/50 via-[#0A7075]/30 to-transparent" />
            
            <div className="space-y-10 relative z-10">
              {history.length === 0 ? (
                <div className="py-20 text-center space-y-6">
                  <div className="w-24 h-24 bg-[#031716] rounded-[2rem] flex items-center justify-center mx-auto border border-[#0A7075]/30 shadow-inner">
                    <ShieldCheck className="w-12 h-12 text-[#0A7075]/40" />
                  </div>
                  <p className="text-[11px] font-black text-[#6BA3BE] uppercase tracking-[0.4em] opacity-60">Stream Idle</p>
                </div>
              ) : (
                history.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex gap-8 group cursor-pointer">
                    <div className="relative shrink-0">
                      <div className={cn(
                        "w-8 h-8 rounded-full border-2 border-[#032F30] flex items-center justify-center z-10 relative transition-transform group-hover:scale-110",
                        item.result.threat_level === 'High' ? 'bg-[#ef4444] shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-[#00F5D4] shadow-[0_0_10px_rgba(0,245,212,0.5)]'
                      )}>
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-[#6BA3BE] uppercase tracking-widest">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className={cn(
                          "text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-widest",
                          item.result.threat_level === 'High' ? 'text-[#ef4444] border-[#ef4444]/30' : 'text-[#00F5D4] border-[#00F5D4]/30'
                        )}>
                          {item.result.threat_type}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white/90 line-clamp-1 group-hover:text-[#00F5D4] transition-colors">{item.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {history.length > 5 && (
              <button 
                onClick={() => addToast('Full activity archives terminal initialized...', 'info')}
                className="w-full mt-10 py-5 text-[10px] font-black text-[#00F5D4] uppercase tracking-[0.4em] hover:bg-[#00F5D4]/5 transition-all border-t border-[#0A7075]/20 rounded-b-2xl"
              >
                View Full Archives
              </button>
            )}
          </div>

          {/* Weekly Report Widget */}
          <div className="glass-card p-10 space-y-8 border-[#0C969C]/30 bg-gradient-to-br from-[#032F30] to-[#031716] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00F5D4] to-transparent opacity-30" />
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] flex items-center gap-4">
                <ShieldCheck className="w-5 h-5 text-[#00F5D4]" />
                Weekly Intelligence
              </h3>
              <ArrowUpRight className="w-5 h-5 text-[#6BA3BE] group-hover:text-[#00F5D4] transition-colors" />
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black text-[#6BA3BE] uppercase tracking-widest">Next Report: 04 MAR 2026</p>
              <button 
                onClick={() => addToast('Generating Weekly Intelligence Report...', 'info')}
                className="w-full py-4 bg-[#00F5D4]/10 hover:bg-[#00F5D4]/20 text-[#00F5D4] text-[10px] font-black uppercase tracking-widest rounded-xl border border-[#00F5D4]/30 transition-all"
              >
                Access Latest Report
              </button>
            </div>
          </div>

          {/* Compact Analytics Widget */}
          <div className="glass-card p-8 border-[#00F5D4]/20 bg-gradient-to-br from-[#00F5D4]/5 to-transparent space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[#00F5D4]">
                <TrendingUp className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Security Velocity</span>
              </div>
              <span className="text-[10px] font-black text-[#22c55e]">+24%</span>
            </div>
            <div className="flex items-end gap-1 h-16">
              {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85].map((h, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-[#0A7075]/30 rounded-t-sm hover:bg-[#00F5D4] transition-all cursor-crosshair"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <p className="text-[9px] font-bold text-[#6BA3BE] uppercase tracking-widest leading-relaxed">
              Real-time threat mitigation efficiency is at an all-time high.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
