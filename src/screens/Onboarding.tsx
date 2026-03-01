import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../AppContext';
import { UserRole } from '../types';
import { cn } from '../lib/utils';

const ROLES: UserRole[] = ['Student', 'IT Professional', 'Job Seeker', 'Business Owner', 'Senior Citizen', 'Other'];
const HABITS = [
  { id: 'upi', label: 'Uses UPI' },
  { id: 'jobs', label: 'Applies for jobs' },
  { id: 'crypto', label: 'Uses crypto' },
  { id: 'apps', label: 'Installs many apps' },
  { id: 'email', label: 'Uses email frequently' },
];

export const Onboarding: React.FC = () => {
  const { updateUser, addToast } = useApp();
  const [role, setRole] = useState<UserRole>('Student');
  const [habits, setHabits] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]);
  };

  const handleContinue = () => {
    if (!consent) return;
    updateUser({
      role,
      habits,
      cyberScore: 72, // Seeded start
      onboarded: true,
      awarenessLevel: 'Aware'
    });
    addToast('Guardian Profile Initialized', 'success');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#031716] cyber-gradient">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-xl w-full p-10 space-y-10 border-[#0A7075]/40"
      >
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 bg-[#0A7075]/20 rounded-3xl mb-4 border border-[#0C969C]/30 shadow-[0_0_30px_rgba(10,112,117,0.3)]">
            <Shield className="w-10 h-10 text-[#0C969C]" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white">TrustLayer</h1>
          <p className="text-[#6BA3BE] font-medium">Enterprise Cybersecurity Intelligence</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xs font-bold text-[#0C969C] uppercase tracking-[0.2em] mb-5">Division Assignment</h2>
            <div className="grid grid-cols-2 gap-4">
              {ROLES.map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    "px-4 py-4 rounded-2xl text-sm font-bold border transition-all duration-300",
                    role === r 
                      ? "bg-[#0A7075]/30 border-[#0C969C] text-white shadow-[0_0_15px_rgba(12,150,156,0.2)]" 
                      : "bg-[#032F30]/50 border-[#0A7075]/20 text-[#CCD0CF]/60 hover:border-[#0A7075]/50"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold text-[#0C969C] uppercase tracking-[0.2em] mb-5">Digital Footprint</h2>
            <div className="flex flex-wrap gap-3">
              {HABITS.map(h => (
                <button
                  key={h.id}
                  onClick={() => toggleHabit(h.id)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2",
                    habits.includes(h.id)
                      ? "bg-[#0C969C] text-[#031716] border-[#0C969C]"
                      : "bg-[#032F30]/50 border-[#0A7075]/20 text-[#CCD0CF]/60"
                  )}
                >
                  {habits.includes(h.id) && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {h.label}
                </button>
              ))}
            </div>
          </section>

          <section className="pt-6 border-t border-[#0A7075]/20">
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className={cn(
                "mt-1 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all",
                consent ? "bg-[#0C969C] border-[#0C969C]" : "border-[#0A7075]/40 bg-[#032F30]"
              )}>
                <input 
                  type="checkbox" 
                  checked={consent}
                  onChange={e => setConsent(e.target.checked)}
                  className="hidden"
                />
                {consent && <CheckCircle2 className="w-3.5 h-3.5 text-[#031716]" />}
              </div>
              <span className="text-sm text-[#CCD0CF]/70 group-hover:text-[#CCD0CF] transition-colors leading-relaxed">
                I authorize TrustLayer to deploy behavioral intelligence and real-time threat analysis on my digital interactions.
              </span>
            </label>
          </section>

          <button
            onClick={handleContinue}
            disabled={!consent}
            className="w-full py-5 bg-[#0A7075] hover:bg-[#0C969C] disabled:opacity-30 disabled:cursor-not-allowed text-white font-black rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(10,112,117,0.3)] group"
          >
            Deploy Intelligence
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
