import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Link as LinkIcon, 
  Upload, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Loader2,
  ChevronRight,
  Info,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { useApp } from '../AppContext';
import { aiService } from '../services/aiService';
import { AnalysisResult } from '../types';
import { cn } from '../lib/utils';

export const Analyzer: React.FC<{ onNavigate: (screen: string, data?: any) => void, initialMode?: 'text' | 'url' }> = ({ onNavigate, initialMode = 'text' }) => {
  const { addHistory, addToast } = useApp();
  const [mode, setMode] = useState<'text' | 'url'>(initialMode);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    let content = input.trim();
    if (!content) {
      content = "Your bank account will be suspended. Click this link immediately to verify: http://secure-bank-verify.net/login";
      setInput(content);
      addToast('Demo sample loaded for analysis', 'info');
    }
    
    setIsAnalyzing(true);
    try {
      const res = await aiService.analyzeMessage(content);
      // Normalize score to 0-100 if it's 0-1
      if (res.risk_score <= 1 && res.risk_score > 0) {
        res.risk_score = Math.round(res.risk_score * 100);
      } else {
        res.risk_score = Math.min(100, Math.max(0, Math.round(res.risk_score)));
      }
      setResult(res);
      addHistory(content, res);
    } catch (error) {
      console.error(error);
      addToast('Analysis failed. Please try again.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-10 division-transition">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase title-accent">Threat Analyzer</h2>
          <p className="text-[#6BA3BE] font-bold text-xs uppercase tracking-[0.4em] opacity-80">Division 01: Shield Operations</p>
        </div>
        <div className="flex bg-[#032F30] p-2 rounded-[1.5rem] border border-[#0A7075]/40 shadow-xl">
          <button 
            onClick={() => setMode('text')}
            className={cn(
              "px-10 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-700", 
              mode === 'text' 
                ? "bg-[#00F5D4] text-[#031716] shadow-[0_0_25px_rgba(0,245,212,0.4)]" 
                : "text-[#6BA3BE] hover:text-white"
            )}
          >
            Message
          </button>
          <button 
            onClick={() => setMode('url')}
            className={cn(
              "px-10 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-700", 
              mode === 'url' 
                ? "bg-[#00F5D4] text-[#031716] shadow-[0_0_25px_rgba(0,245,212,0.4)]" 
                : "text-[#6BA3BE] hover:text-white"
            )}
          >
            URL
          </button>
        </div>
      </div>

      <div className={cn(
        "glass-card p-12 space-y-12 border-[#0C969C]/30 relative overflow-hidden",
        isAnalyzing && "scanning-effect"
      )}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00F5D4]/5 rounded-full -mr-40 -mt-40 blur-3xl" />
        
        <div className="space-y-10 relative z-10">
          {mode === 'text' ? (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste suspicious content here or leave empty for demo sample..."
              className="w-full h-72 bg-[#031716] border border-[#0A7075]/40 rounded-[2.5rem] p-10 text-[#CCD0CF] focus:ring-2 focus:ring-[#00F5D4] focus:border-transparent transition-all resize-none font-mono text-base leading-relaxed placeholder-[#6BA3BE]/30 shadow-inner"
            />
          ) : (
            <div className="relative">
              <LinkIcon className="absolute left-10 top-1/2 -translate-y-1/2 w-10 h-10 text-[#00F5D4]" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="https://suspicious-link.com/verify"
                className="w-full bg-[#031716] border border-[#0A7075]/40 rounded-[2.5rem] py-10 pl-24 pr-10 text-[#CCD0CF] focus:ring-2 focus:ring-[#00F5D4] focus:border-transparent transition-all font-mono text-base placeholder-[#6BA3BE]/30 shadow-inner"
              />
            </div>
          )}

          <div className="flex gap-8">
            <button 
              onClick={() => addToast('Asset upload terminal initialized. Select file...', 'info')}
              className="flex-1 py-7 bg-[#032F30] hover:bg-[#0A7075]/30 text-[#6BA3BE] font-black uppercase tracking-[0.3em] rounded-[2rem] transition-all flex items-center justify-center gap-5 border border-[#0A7075]/40 group"
            >
              <Upload className="w-7 h-7 group-hover:-translate-y-2 transition-transform duration-500" />
              Upload Asset
            </button>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex-[2] py-7 bg-[#0A7075] hover:bg-[#0C969C] disabled:opacity-30 text-white font-black uppercase tracking-[0.3em] rounded-[2rem] transition-all flex items-center justify-center gap-5 shadow-[0_20px_50px_rgba(10,112,117,0.4)] group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {isAnalyzing ? <Loader2 className="w-7 h-7 animate-spin" /> : <Search className="w-7 h-7 group-hover:scale-125 transition-transform duration-500" />}
              {isAnalyzing ? 'Processing Intelligence...' : 'Execute Analysis'}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-16 border-t border-[#0A7075]/30 space-y-16"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="glass-card p-12 text-center space-y-5 border-[#0A7075]/30 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#00F5D4] to-transparent opacity-50" />
                  <p className="text-[11px] font-black text-[#6BA3BE] uppercase tracking-[0.4em]">Risk Index</p>
                  <h3 className={cn(
                    "text-7xl font-black tracking-tighter transition-all duration-700", 
                    result.risk_score > 70 ? "text-[#ef4444] risk-glow-high" : result.risk_score > 30 ? "text-[#f59e0b] risk-glow-medium" : "text-[#00F5D4] safe-outline"
                  )}>
                    {result.risk_score}%
                  </h3>
                </div>
                <div className="glass-card p-12 text-center space-y-6 border-[#0A7075]/30 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#00F5D4] to-transparent opacity-50" />
                  <p className="text-[11px] font-black text-[#6BA3BE] uppercase tracking-[0.4em]">Threat Severity</p>
                  <div className={cn(
                    "inline-flex px-10 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border shadow-lg",
                    result.threat_level === 'High' ? "bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/50 risk-glow-high" : result.threat_level === 'Medium' ? "bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/50 risk-glow-medium" : "bg-[#00F5D4]/15 text-[#00F5D4] border-[#00F5D4]/50 safe-outline"
                  )}>
                    {result.threat_level}
                  </div>
                </div>
                <div className="glass-card p-12 text-center space-y-5 border-[#0A7075]/30 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#00F5D4] to-transparent opacity-50" />
                  <p className="text-[11px] font-black text-[#6BA3BE] uppercase tracking-[0.4em]">Classification</p>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight drop-shadow-lg">{result.threat_type}</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <section className="space-y-6">
                  <h4 className="text-[10px] font-black flex items-center gap-4 text-[#ef4444] uppercase tracking-[0.4em]">
                    <ShieldAlert className="w-5 h-5" />
                    Critical Red Flags
                  </h4>
                  <div className="space-y-4">
                    {result.red_flags.map((flag, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="flex items-start gap-5 text-sm font-medium text-[#CCD0CF] bg-[#ef4444]/5 p-6 rounded-[1.5rem] border border-[#ef4444]/20 hover:bg-[#ef4444]/10 transition-all"
                      >
                        <AlertCircle className="w-6 h-6 text-[#ef4444] shrink-0 mt-0.5" />
                        {flag}
                      </motion.div>
                    ))}
                  </div>
                </section>

                <section className="space-y-6">
                  <h4 className="text-[10px] font-black flex items-center gap-4 text-[#6BA3BE] uppercase tracking-[0.4em]">
                    <Info className="w-5 h-5" />
                    Intelligence Summary
                  </h4>
                  <div className="bg-[#031716] p-8 rounded-[1.5rem] border border-[#0A7075]/30 text-sm text-[#CCD0CF]/80 leading-relaxed font-medium relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#0C969C]/30" />
                    {result.explanation}
                  </div>
                </section>
              </div>

              <section className="space-y-6">
                <h4 className="text-[10px] font-black flex items-center gap-4 text-[#22c55e] uppercase tracking-[0.4em]">
                  <CheckCircle2 className="w-5 h-5" />
                  Countermeasures
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.recommended_actions.map((action, i) => (
                    <div key={i} className="flex items-center gap-6 text-sm font-bold text-[#CCD0CF] bg-[#22c55e]/5 p-6 rounded-[1.5rem] border border-[#22c55e]/20 hover:bg-[#22c55e]/10 transition-all">
                      <div className="w-8 h-8 bg-[#22c55e]/20 rounded-xl flex items-center justify-center text-[#22c55e] text-[10px] font-black border border-[#22c55e]/30">
                        {i + 1}
                      </div>
                      {action}
                    </div>
                  ))}
                </div>
              </section>

              <div className="pt-12 flex flex-col md:flex-row gap-8">
                <button 
                  onClick={() => {
                    onNavigate('teachback', { content: input, result });
                    addToast('Initializing MindGuard Challenge', 'info');
                  }}
                  className="flex-1 py-6 bg-[#0C969C] hover:bg-[#6BA3BE] text-[#031716] font-black uppercase tracking-[0.2em] rounded-[1.5rem] transition-all flex items-center justify-center gap-4 shadow-[0_15px_40px_rgba(12,150,156,0.4)] group"
                >
                  Deploy MindGuard Challenge
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
                <button 
                  onClick={() => { 
                    setInput(''); 
                    setResult(null); 
                    addToast('Analyzer Reset', 'info');
                  }}
                  className="flex-1 py-6 bg-[#032F30] hover:bg-[#0A7075]/40 text-[#6BA3BE] font-black uppercase tracking-[0.2em] rounded-[1.5rem] transition-all border border-[#0A7075]/30"
                >
                  New Analysis
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
