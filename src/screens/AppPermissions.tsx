import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ShieldAlert, AlertCircle, CheckCircle2, Loader2, Smartphone, Info, Zap, Activity, Shield } from 'lucide-react';
import { useApp } from '../AppContext';
import { PermissionRisk } from '../types';
import { cn } from '../lib/utils';

const PERMISSIONS = [
  { id: 'contacts', label: 'Contacts', icon: '👤' },
  { id: 'location', label: 'Location', icon: '📍' },
  { id: 'camera', label: 'Camera', icon: '📷' },
  { id: 'microphone', label: 'Microphone', icon: '🎤' },
  { id: 'sms', label: 'SMS/Messages', icon: '💬' },
  { id: 'storage', label: 'Files & Storage', icon: '📁' },
  { id: 'call_logs', label: 'Call Logs', icon: '📞' },
  { id: 'calendar', label: 'Calendar', icon: '📅' },
];

export const AppPermissions: React.FC = () => {
  const { addToast } = useApp();
  const [selected, setSelected] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PermissionRisk | null>(null);

  const togglePermission = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    setResult(null);
  };

  const handleScan = async () => {
    if (selected.length === 0) {
      addToast('Select at least one permission to scan', 'info');
      return;
    }
    
    setIsAnalyzing(true);
    // Deterministic logic for demo
    setTimeout(() => {
      let risk: PermissionRisk;
      
      const hasHighRiskCombo = (selected.includes('sms') && selected.includes('contacts')) || 
                               (selected.includes('location') && selected.includes('microphone')) ||
                               (selected.includes('storage') && selected.includes('camera'));

      if (hasHighRiskCombo || selected.length > 5) {
        risk = {
          threat_level: 'High',
          risk_explanation: "The combination of requested permissions is highly invasive. This pattern is often seen in spyware or data-harvesting applications that track user behavior and private communications.",
          advice: [
            "Revoke SMS and Contact access unless strictly necessary.",
            "Check if the app has a legitimate reason for background location.",
            "Consider using a privacy-focused alternative.",
            "Monitor data usage for unusual background activity."
          ]
        };
      } else if (selected.length > 2) {
        risk = {
          threat_level: 'Medium',
          risk_explanation: "The app requests multiple sensitive permissions. While common for social or utility apps, ensure you trust the developer before granting access.",
          advice: [
            "Grant permissions only while using the app.",
            "Review the developer's privacy policy.",
            "Use 'Approximate Location' instead of 'Precise' if possible."
          ]
        };
      } else {
        risk = {
          threat_level: 'Low',
          risk_explanation: "The requested permissions are minimal and standard for most basic applications. No immediate red flags detected.",
          advice: [
            "Always stay vigilant when granting any permission.",
            "Periodically review app permissions in system settings."
          ]
        };
      }

      setResult(risk);
      setIsAnalyzing(false);
      addToast(`Permission Scan Complete: ${risk.threat_level} Risk`, risk.threat_level === 'High' ? 'error' : 'success');
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10 division-transition">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Permission Auditor</h2>
          <p className="text-[#6BA3BE] font-bold text-xs uppercase tracking-[0.3em]">Division 01: Shield Operations</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-5 py-2.5 bg-[#0A7075]/10 rounded-2xl border border-[#0C969C]/30">
            <Activity className="w-4 h-4 text-[#0C969C] animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Audit Engine: Ready</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="glass-card p-10 space-y-10 border-[#0C969C]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0A7075]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                <Smartphone className="w-6 h-6 text-[#0C969C]" />
                Select Requested Permissions
              </h3>
              <span className="text-[10px] font-black text-[#6BA3BE] bg-[#031716] px-4 py-1.5 rounded-full border border-[#0A7075]/30 uppercase tracking-widest">
                {selected.length} SELECTED
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
              {PERMISSIONS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => togglePermission(p.id)}
                  className={cn(
                    "p-8 rounded-[2rem] border transition-all duration-500 flex flex-col items-center gap-4 group relative overflow-hidden",
                    selected.includes(p.id)
                      ? "bg-[#0A7075] border-[#0C969C] text-white shadow-[0_0_30px_rgba(10,112,117,0.3)]"
                      : "bg-[#031716] border-[#0A7075]/20 text-[#6BA3BE] hover:border-[#0A7075]/50 hover:bg-[#0A7075]/5"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-4xl group-hover:scale-125 transition-transform duration-500">{p.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">{p.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleScan}
              disabled={isAnalyzing || selected.length === 0}
              className="w-full py-6 bg-[#0A7075] hover:bg-[#0C969C] disabled:opacity-30 text-white font-black uppercase tracking-[0.2em] rounded-[1.5rem] transition-all shadow-[0_15px_40px_rgba(10,112,117,0.4)] flex items-center justify-center gap-4 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />}
              {isAnalyzing ? 'Analyzing Request Pattern...' : 'Execute Permission Audit'}
            </button>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-12 space-y-10 border-[#0C969C]/20 overflow-hidden relative"
              >
                <div className={cn(
                  "absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 rounded-full blur-[100px] opacity-20",
                  result.threat_level === 'High' ? "bg-[#ef4444]" : result.threat_level === 'Medium' ? "bg-[#f59e0b]" : "bg-[#22c55e]"
                )} />

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-[#6BA3BE] uppercase tracking-[0.3em]">Risk Assessment</p>
                    <div className={cn(
                      "text-5xl font-black tracking-tighter uppercase",
                      result.threat_level === 'High' ? "text-[#ef4444] risk-glow-high" : result.threat_level === 'Medium' ? "text-[#f59e0b]" : "text-[#22c55e]"
                    )}>
                      {result.threat_level} SEVERITY
                    </div>
                  </div>
                  <div className={cn(
                    "p-6 rounded-[2rem] border flex items-center gap-6 shadow-xl",
                    result.threat_level === 'High' ? "bg-[#ef4444]/10 border-[#ef4444]/30" : result.threat_level === 'Medium' ? "bg-[#f59e0b]/10 border-[#f59e0b]/30" : "bg-[#22c55e]/10 border-[#22c55e]/30"
                  )}>
                    {result.threat_level === 'High' ? <ShieldAlert className="w-10 h-10 text-[#ef4444]" /> : <ShieldCheck className="w-10 h-10 text-[#22c55e]" />}
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <h4 className="text-[10px] font-black text-[#6BA3BE] uppercase tracking-[0.4em] flex items-center gap-4">
                    <Info className="w-5 h-5" />
                    Intelligence Analysis
                  </h4>
                  <p className="text-[#CCD0CF] font-medium leading-relaxed bg-[#031716] p-8 rounded-[1.5rem] border border-[#0A7075]/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#0C969C]/30" />
                    {result.risk_explanation}
                  </p>
                </div>

                <div className="space-y-6 relative z-10">
                  <h4 className="text-[10px] font-black text-[#6BA3BE] uppercase tracking-[0.4em] flex items-center gap-4">
                    <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
                    Recommended Countermeasures
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {result.advice.map((item, i) => (
                      <div key={i} className="flex items-start gap-6 p-6 bg-[#032F30] rounded-[1.5rem] border border-[#0A7075]/20 text-sm font-bold text-[#CCD0CF] hover:bg-[#0A7075]/10 transition-all">
                        <div className="w-8 h-8 rounded-xl bg-[#0A7075]/30 flex items-center justify-center text-[#0C969C] text-[10px] font-black shrink-0 mt-0.5 border border-[#0A7075]/30">
                          {i + 1}
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-10">
          <div className="glass-card p-10 space-y-8 border-[#0C969C]/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0C969C] to-transparent" />
            <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">Division Protocol</h3>
            <div className="space-y-6">
              <div className="flex gap-6 p-6 bg-[#031716] rounded-2xl border border-[#0A7075]/20 group hover:border-[#0C969C]/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#0A7075]/20 flex items-center justify-center text-[#0C969C] shrink-0 group-hover:scale-110 transition-transform">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-white uppercase">Device Context</p>
                  <p className="text-[10px] text-[#6BA3BE] font-bold leading-relaxed">Audit app requests before installation to prevent data leaks.</p>
                </div>
              </div>
              <div className="flex gap-6 p-6 bg-[#031716] rounded-2xl border border-[#0A7075]/20 group hover:border-[#0C969C]/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#0A7075]/20 flex items-center justify-center text-[#0C969C] shrink-0 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-white uppercase">Risk Correlation</p>
                  <p className="text-[10px] text-[#6BA3BE] font-bold leading-relaxed">Certain combinations (e.g., SMS + Contacts) are high-risk indicators.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-10 space-y-8 border-[#0C969C]/20 bg-gradient-to-br from-[#032F30] to-[#031716] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#6BA3BE] to-transparent" />
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-[#6BA3BE] uppercase tracking-[0.4em]">Recent Audits</h3>
              <Activity className="w-4 h-4 text-[#6BA3BE] animate-pulse" />
            </div>
            <div className="space-y-4">
              {[
                { app: 'Flashlight Pro', risk: 'High', date: '2m ago' },
                { app: 'SocialConnect', risk: 'Medium', date: '1h ago' },
                { app: 'CalcVault', risk: 'High', date: '3h ago' },
              ].map((audit, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#031716]/50 rounded-xl border border-[#0A7075]/10 hover:border-[#0C969C]/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-2 h-2 rounded-full", audit.risk === 'High' ? "bg-[#ef4444] shadow-[0_0_8px_#ef4444]" : "bg-[#f59e0b]")} />
                    <span className="text-[11px] font-black text-white uppercase tracking-tight">{audit.app}</span>
                  </div>
                  <span className="text-[9px] font-black text-[#6BA3BE] uppercase tracking-widest">{audit.date}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-4 text-[9px] font-black text-[#6BA3BE] uppercase tracking-[0.3em] hover:text-white transition-colors border-t border-[#0A7075]/10 pt-6">
              View Audit History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
