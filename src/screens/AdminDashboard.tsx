import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, AlertTriangle, Users, Activity, Globe, Zap, ArrowUpRight, ArrowDownRight, Search, Filter, MoreVertical, Play, Terminal, Loader2, ShieldAlert, Settings } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useApp } from '../AppContext';
import { cn } from '../lib/utils';

const MOCK_CHART_DATA = [
  { name: '00:00', threats: 45, blocked: 42 },
  { name: '04:00', threats: 32, blocked: 30 },
  { name: '08:00', threats: 85, blocked: 80 },
  { name: '12:00', threats: 120, blocked: 115 },
  { name: '16:00', threats: 95, blocked: 90 },
  { name: '20:00', threats: 65, blocked: 62 },
];

const THREAT_TYPES = [
  { name: 'Phishing', value: 45, color: '#0A7075' },
  { name: 'Malware', value: 25, color: '#0C969C' },
  { name: 'Social Eng', value: 20, color: '#6BA3BE' },
  { name: 'Zero Day', value: 10, color: '#ef4444' },
];

export const AdminDashboard: React.FC = () => {
  const { addToast } = useApp();
  const [isSimulating, setIsSimulating] = useState(false);
  const [drillLog, setDrillLog] = useState<string[]>([]);

  const startDrill = () => {
    setIsSimulating(true);
    setDrillLog(['[SYSTEM] Initializing Attack Simulation...', '[NETWORK] Deploying Honeypots...']);
    
    const steps = [
      '[THREAT] Detected brute-force attempt on Node-04',
      '[SHIELD] Auto-blocking IP: 192.168.1.105',
      '[SYSTEM] Escalating to Level 2 Response',
      '[NETWORK] Isolating affected subnet...',
      '[SUCCESS] Threat neutralized. Drill completed.'
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setDrillLog(prev => [...prev, step]);
        if (i === steps.length - 1) {
          setIsSimulating(false);
          addToast('Incident Drill Completed Successfully', 'success');
        }
      }, (i + 1) * 1000);
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10 division-transition">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase title-accent">Command Nexus</h2>
          <p className="text-[#6BA3BE] font-bold text-xs uppercase tracking-[0.4em] opacity-80">Division 04: Administrative Oversight</p>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-3 px-6 py-3 bg-[#00F5D4]/10 border border-[#00F5D4]/30 rounded-2xl shadow-[0_0_20px_rgba(0,245,212,0.2)]">
            <div className="radar-pulse">
              <div className="w-3 h-3 bg-[#00F5D4] rounded-full" />
            </div>
            <span className="text-[11px] font-black text-[#00F5D4] uppercase tracking-[0.2em]">System Nominal</span>
          </div>
          <button 
            onClick={() => addToast('Secure Terminal Access Initialized...', 'info')}
            className="p-4 bg-[#032F30] border border-[#0A7075]/40 rounded-2xl text-[#6BA3BE] hover:text-[#00F5D4] hover:border-[#00F5D4]/50 transition-all shadow-lg group"
          >
            <Terminal className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Users', value: '1,284', trend: '+12%', icon: Users, color: '#00F5D4' },
          { label: 'Active Threats', value: '12', trend: '-5%', icon: ShieldAlert, color: '#ef4444' },
          { label: 'System Uptime', value: '99.99%', trend: 'Stable', icon: Activity, color: '#00F5D4' },
          { label: 'Network Nodes', value: '42', trend: '+2', icon: Globe, color: '#6BA3BE' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 border-[#0C969C]/20 space-y-6 group hover:border-[#00F5D4]/30 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00F5D4] to-transparent opacity-0 group-hover:opacity-30 transition-opacity" />
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl shadow-inner" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border",
                stat.trend.startsWith('+') ? "text-[#22c55e] border-[#22c55e]/30 bg-[#22c55e]/10" : stat.trend.startsWith('-') ? "text-[#ef4444] border-[#ef4444]/30 bg-[#ef4444]/10" : "text-[#6BA3BE] border-[#6BA3BE]/30 bg-[#6BA3BE]/10"
              )}>
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-3xl font-black text-white tracking-tighter group-hover:text-[#00F5D4] transition-colors">{stat.value}</p>
              <p className="text-[11px] font-black text-[#6BA3BE] uppercase tracking-[0.2em] opacity-70">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="glass-card p-10 space-y-10 border-[#0C969C]/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00F5D4] to-transparent opacity-30" />
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Global Threat Heatmap</h3>
              <div className="flex items-center gap-3 text-[10px] font-black text-[#6BA3BE] uppercase tracking-widest">
                <div className="w-3 h-3 bg-[#ef4444] rounded-sm" /> High Risk
                <div className="w-3 h-3 bg-[#00F5D4] rounded-sm ml-4" /> Low Risk
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              {Array.from({ length: 144 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.005 }}
                  className={cn(
                    "aspect-square rounded-sm transition-all hover:scale-150 hover:z-10 cursor-crosshair",
                    i % 15 === 0 ? "bg-[#ef4444]/60 shadow-[0_0_10px_rgba(239,68,68,0.3)]" : 
                    i % 7 === 0 ? "bg-[#f59e0b]/40" : 
                    "bg-[#00F5D4]/10 border border-[#00F5D4]/5"
                  )}
                  title={`Node ${i}: ${i % 15 === 0 ? 'Critical' : 'Stable'}`}
                />
              ))}
            </div>
          </div>

          <div className="glass-card p-10 space-y-10 border-[#0C969C]/30 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#00F5D4]/5 rounded-full -mr-32 -mb-32 blur-3xl" />
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Weekly Intelligence Report</h3>
              <button 
                onClick={() => addToast('Downloading Weekly Intelligence Report...', 'info')}
                className="px-6 py-2 bg-[#00F5D4] text-[#031716] text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:scale-105 transition-transform"
              >
                Download PDF
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="p-6 bg-[#031716] rounded-2xl border border-[#0A7075]/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#6BA3BE] uppercase tracking-widest">Detection Rate</span>
                    <span className="text-xs font-black text-[#22c55e]">+4.2%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#00F5D4] h-full w-[92%]" />
                  </div>
                </div>
                <div className="p-6 bg-[#031716] rounded-2xl border border-[#0A7075]/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#6BA3BE] uppercase tracking-widest">Response Time</span>
                    <span className="text-xs font-black text-[#22c55e]">-12s</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#00F5D4] h-full w-[78%]" />
                  </div>
                </div>
              </div>
              <div className="p-8 bg-[#031716] rounded-[2rem] border border-[#0A7075]/30 flex flex-col justify-center text-center space-y-4">
                <p className="text-4xl font-black text-white tracking-tighter">98.4%</p>
                <p className="text-[10px] font-black text-[#6BA3BE] uppercase tracking-[0.3em]">Network Trust Index</p>
                <div className="pt-4">
                  <span className="px-4 py-1.5 bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30 rounded-full text-[9px] font-black uppercase tracking-widest">Optimal Performance</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-10 space-y-10 border-[#0C969C]/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00F5D4]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Threat Intelligence Velocity</h3>
              <div className="flex gap-3">
                <button className="px-5 py-2 bg-[#031716] border border-[#0A7075]/40 rounded-xl text-[10px] font-black text-[#6BA3BE] hover:text-[#00F5D4] hover:border-[#00F5D4]/50 uppercase tracking-widest transition-all">24 Hours</button>
                <button className="px-5 py-2 bg-[#031716] border border-[#0A7075]/40 rounded-xl text-[10px] font-black text-[#6BA3BE] hover:text-[#00F5D4] hover:border-[#00F5D4]/50 uppercase tracking-widest transition-all">7 Days</button>
              </div>
            </div>
            <div className="h-[350px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART_DATA}>
                  <defs>
                    <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00F5D4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00F5D4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0A707530" vertical={false} />
                  <XAxis dataKey="name" stroke="#6BA3BE" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} />
                  <YAxis stroke="#6BA3BE" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#032F30', border: '1px solid #0A707560', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                    itemStyle={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  />
                  <Area type="monotone" dataKey="threats" stroke="#ef4444" fillOpacity={1} fill="url(#colorThreats)" strokeWidth={4} />
                  <Area type="monotone" dataKey="blocked" stroke="#00F5D4" fillOpacity={1} fill="url(#colorBlocked)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={cn(
            "glass-card p-10 space-y-10 border-[#0C969C]/30 relative overflow-hidden",
            isSimulating && "scanning-effect"
          )}>
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Incident Drill Terminal</h3>
              <button 
                onClick={startDrill}
                disabled={isSimulating}
                className="px-10 py-4 bg-[#0A7075] hover:bg-[#0C969C] disabled:opacity-30 text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center gap-4 shadow-[0_10px_30px_rgba(10,112,117,0.3)] group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {isSimulating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 group-hover:scale-125 transition-transform" />}
                {isSimulating ? 'Running Drill...' : 'Initiate Drill'}
              </button>
            </div>
            <div className="bg-[#031716] rounded-[2rem] p-8 border border-[#0A7075]/40 font-mono text-sm space-y-3 h-64 overflow-y-auto custom-scrollbar shadow-inner relative z-10">
              {drillLog.length === 0 ? (
                <p className="text-[#6BA3BE]/30 italic animate-pulse">Terminal ready for simulation input...</p>
              ) : (
                drillLog.map((log, i) => (
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className={cn(
                      "flex items-center gap-3",
                      log.includes('[SUCCESS]') ? "text-[#00F5D4]" : log.includes('[THREAT]') ? "text-[#ef4444]" : "text-[#6BA3BE]"
                    )}
                  >
                    <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
                    <span className="font-bold">{log}</span>
                  </motion.p>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <div className="glass-card p-10 space-y-10 border-[#0C969C]/30 relative overflow-hidden">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Threat Distribution</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={THREAT_TYPES}>
                  <XAxis dataKey="name" hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#032F30', border: '1px solid #0A707560', borderRadius: '16px' }}
                    cursor={{ fill: 'rgba(0, 245, 212, 0.05)' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {THREAT_TYPES.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color === '#0A7075' ? '#00F5D4' : entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {THREAT_TYPES.map((type, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-[#0A7075]/20 group hover:border-[#00F5D4]/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ backgroundColor: type.color === '#0A7075' ? '#00F5D4' : type.color }} />
                    <span className="text-[11px] font-black text-[#6BA3BE] uppercase tracking-[0.2em] group-hover:text-white transition-colors">{type.name}</span>
                  </div>
                  <span className="text-sm font-black text-white">{type.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-10 space-y-8 border-[#0C969C]/30 relative overflow-hidden">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Recent Alerts</h3>
            <div className="space-y-5">
              {[
                { msg: 'Unauthorized Login Attempt', time: '2m ago', risk: 'High' },
                { msg: 'New Sentinel Verified', time: '12m ago', risk: 'Low' },
                { msg: 'Subnet Node-04 Offline', time: '45m ago', risk: 'Medium' },
              ].map((alert, i) => (
                <div key={i} className="flex items-start gap-5 p-5 bg-[#031716]/60 rounded-2xl border border-[#0A7075]/30 hover:border-[#00F5D4]/40 transition-all group">
                  <div className={cn(
                    "w-3 h-3 rounded-full mt-2 shrink-0 shadow-[0_0_10px_rgba(0,0,0,0.5)]",
                    alert.risk === 'High' ? "bg-[#ef4444] risk-glow-high" : alert.risk === 'Medium' ? "bg-[#f59e0b] risk-glow-medium" : "bg-[#00F5D4] safe-outline"
                  )} />
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-black text-white uppercase leading-tight group-hover:text-[#00F5D4] transition-colors">{alert.msg}</p>
                    <p className="text-[10px] font-black text-[#6BA3BE] uppercase tracking-[0.2em] opacity-70">{alert.time} • {alert.risk} Priority</p>
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
