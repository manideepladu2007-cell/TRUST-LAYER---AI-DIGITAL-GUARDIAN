import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ShieldCheck, ShieldAlert, CheckCircle2, Lock, Smartphone, Key, Globe, ArrowRight, Loader2, Activity, Shield } from 'lucide-react';
import { useApp } from '../AppContext';
import { cn } from '../lib/utils';

const EMERGENCY_STEPS = [
  { id: 'passwords', label: 'Reset Primary Passwords', icon: Key, description: 'Change passwords for email, banking, and social accounts immediately.' },
  { id: 'mfa', label: 'Enable Multi-Factor Auth', icon: Lock, description: 'Add an extra layer of security to all sensitive accounts.' },
  { id: 'sessions', label: 'Terminate Active Sessions', icon: Globe, description: 'Log out from all devices in your account security settings.' },
  { id: 'bank', label: 'Notify Financial Institutions', icon: ShieldAlert, description: 'Inform your bank about potential compromise to freeze cards.' },
  { id: 'scan', label: 'Run Full Device Scan', icon: Smartphone, description: 'Use a trusted antivirus to scan for malware or keyloggers.' },
];

export const PanicMode: React.FC = () => {
  const { updateCyberScore, addToast } = useApp();
  const [completed, setCompleted] = useState<string[]>([]);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleStep = (id: string) => {
    setCompleted(prev => {
      const isNew = !prev.includes(id);
      if (isNew) {
        addToast('Emergency protocol step logged', 'info');
      }
      return isNew ? [...prev, id] : prev.filter(s => s !== id);
    });
  };

  const handleFinalize = () => {
    setIsFinalizing(true);
    setTimeout(() => {
      updateCyberScore(2);
      setIsFinalizing(false);
      setShowSuccess(true);
      addToast('Emergency Response Protocol Completed. +2 Cyber Score', 'success');
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="max-w-4xl mx-auto p-8 division-transition">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-card p-16 text-center space-y-10 border-[#22c55e]/30 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#22c55e] to-transparent" />
          <div className="absolute inset-0 bg-[#22c55e]/5 blur-3xl rounded-full -z-10" />
          
          <div className="w-32 h-32 bg-[#22c55e]/20 rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-[#22c55e] shadow-[0_0_50px_rgba(34,197,94,0.4)] relative group">
            <ShieldCheck className="w-16 h-16 text-[#22c55e] group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-[#22c55e]/20 rounded-[2.5rem] animate-ping opacity-20" />
          </div>

          <div className="space-y-6">
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase">Protocol Secured</h2>
            <p className="text-[#6BA3BE] font-bold text-xl max-w-2xl mx-auto leading-relaxed">
              You have successfully executed the emergency response checklist. Your risk profile has been updated and your accounts are now under enhanced monitoring.
            </p>
          </div>

          <div className="p-8 bg-[#22c55e]/10 rounded-[2rem] border border-[#22c55e]/30 inline-block relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <p className="text-[#22c55e] font-black text-2xl tracking-widest uppercase">+2 Cyber Score Earned</p>
          </div>

          <div className="pt-10">
            <button 
              onClick={() => window.location.reload()}
              className="px-12 py-6 bg-[#0A7075] hover:bg-[#0C969C] text-white font-black uppercase tracking-[0.2em] rounded-[1.5rem] transition-all shadow-[0_15px_40px_rgba(10,112,117,0.4)] flex items-center justify-center gap-4 mx-auto group"
            >
              Return to Command Nexus
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-10 division-transition">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-[#ef4444] tracking-tighter flex items-center gap-6 uppercase">
            <div className="relative">
              <AlertTriangle className="w-12 h-12 animate-pulse" />
              <div className="absolute inset-0 bg-[#ef4444]/20 blur-xl rounded-full animate-ping" />
            </div>
            Panic Mode: Active
          </h2>
          <p className="text-[#6BA3BE] font-bold text-xs uppercase tracking-[0.3em]">Division 01: Shield Operations / Emergency Response</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-6 py-3 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <span className="text-[10px] font-black text-[#ef4444] uppercase tracking-[0.2em] animate-pulse">Critical Alert State</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-12 space-y-12 border-[#ef4444]/30 bg-gradient-to-b from-[#ef4444]/10 to-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ef4444]/5 rounded-full -mr-48 -mt-48 blur-[100px]" />
        
        <div className="space-y-6 relative z-10">
          <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-4">
            <Shield className="w-8 h-8 text-[#ef4444]" />
            Emergency Incident Checklist
          </h3>
          <p className="text-[#6BA3BE] font-bold text-lg max-w-3xl leading-relaxed">
            Execute these critical countermeasures immediately to mitigate damage from a potential security breach. Every second counts.
          </p>
        </div>

        <div className="space-y-6 relative z-10">
          {EMERGENCY_STEPS.map((step, i) => (
            <motion.button
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className={cn(
                "w-full p-8 rounded-[2rem] border transition-all duration-500 flex items-center gap-8 text-left group relative overflow-hidden",
                completed.includes(step.id)
                  ? "bg-[#22c55e]/10 border-[#22c55e]/40 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                  : "bg-[#031716] border-[#ef4444]/20 hover:border-[#ef4444]/50 hover:bg-[#ef4444]/5"
              )}
            >
              <div className={cn(
                "w-20 h-20 rounded-[1.5rem] flex items-center justify-center shrink-0 transition-all duration-500 shadow-lg",
                completed.includes(step.id) 
                  ? "bg-[#22c55e] text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]" 
                  : "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20"
              )}>
                {completed.includes(step.id) ? <CheckCircle2 className="w-10 h-10" /> : <step.icon className="w-10 h-10 group-hover:scale-110 transition-transform" />}
              </div>
              <div className="flex-1 space-y-2">
                <h4 className={cn("text-xl font-black uppercase tracking-tight transition-colors", completed.includes(step.id) ? "text-[#22c55e]" : "text-white")}>
                  {step.label}
                </h4>
                <p className="text-sm text-[#6BA3BE] font-bold leading-relaxed opacity-80">{step.description}</p>
              </div>
              <div className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 shrink-0",
                completed.includes(step.id) ? "bg-[#22c55e] border-[#22c55e] scale-110" : "border-[#ef4444]/30"
              )}>
                {completed.includes(step.id) && <CheckCircle2 className="w-5 h-5 text-white" />}
              </div>
            </motion.button>
          ))}
        </div>

        <div className="pt-12 border-t border-[#ef4444]/20 flex flex-col items-center gap-8 relative z-10">
          <div className="w-full space-y-4">
            <div className="w-full bg-[#031716] h-4 rounded-full overflow-hidden border border-[#ef4444]/20 p-1">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#ef4444] via-[#f59e0b] to-[#22c55e] rounded-full shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                initial={{ width: 0 }}
                animate={{ width: `${(completed.length / EMERGENCY_STEPS.length) * 100}%` }}
                transition={{ type: 'spring', bounce: 0, duration: 1 }}
              />
            </div>
            <div className="flex justify-between w-full text-[10px] font-black text-[#6BA3BE] uppercase tracking-[0.4em]">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#ef4444]" />
                Protocol Progress
              </span>
              <span className="text-white">{completed.length} / {EMERGENCY_STEPS.length} Steps Logged</span>
            </div>
          </div>

          <button
            onClick={handleFinalize}
            disabled={completed.length < EMERGENCY_STEPS.length || isFinalizing}
            className="w-full py-8 bg-[#ef4444] hover:bg-[#b91c1c] disabled:opacity-30 text-white font-black uppercase tracking-[0.3em] rounded-[2rem] transition-all shadow-[0_20px_50px_rgba(239,68,68,0.4)] flex items-center justify-center gap-6 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            {isFinalizing ? <Loader2 className="w-8 h-8 animate-spin" /> : <ShieldCheck className="w-8 h-8 group-hover:scale-125 transition-transform" />}
            {isFinalizing ? 'Finalizing Incident Report...' : 'Finalize Emergency Response'}
          </button>
        </div>
      </div>
    </div>
  );
};
