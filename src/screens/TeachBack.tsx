import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, CheckCircle2, AlertTriangle, Brain, ArrowRight, Activity, Shield, Zap, Info } from 'lucide-react';
import { useApp } from '../AppContext';
import { aiService } from '../services/aiService';
import { TeachBackQuestion, AnalysisResult } from '../types';
import { cn } from '../lib/utils';

export const TeachBack: React.FC<{ onNavigate: (screen: string) => void, data?: { content: string, result: AnalysisResult } }> = ({ onNavigate, data }) => {
  const { updateCyberScore, addToast } = useApp();
  const [question, setQuestion] = useState<TeachBackQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuestion = async () => {
      setIsLoading(true);
      try {
        const q = await aiService.generateTeachbackQuestion(data?.content || '');
        setQuestion(q);
      } catch (error) {
        console.error(error);
        addToast('Failed to generate challenge. Loading fallback.', 'error');
        // Fallback question for demo
        setQuestion({
          question: "Why is the bank verification link suspicious?",
          options: [
            "The domain name looks slightly off (secure-bank-verify.net)",
            "It asks for immediate action under pressure",
            "It uses a generic greeting",
            "All of the above"
          ],
          correct_index: 3,
          explanation: "Phishing attacks often use deceptive domains, create a false sense of urgency, and use generic greetings to trick users into providing sensitive information."
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadQuestion();
  }, [data, addToast]);

  const handleSubmit = () => {
    if (selectedOption === null || !question) return;
    setIsSubmitted(true);
    const isCorrect = selectedOption === question.correct_index;
    
    if (isCorrect) {
      updateCyberScore(5);
      addToast('Critical Knowledge Verified! +5 Cyber Score', 'success');
    } else {
      updateCyberScore(-2);
      addToast('Knowledge Gap Detected. -2 Cyber Score', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-8 division-transition">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-[#0A7075]/20 border-t-[#0C969C] rounded-[2.5rem] animate-spin" />
          <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-[#0C969C] animate-pulse" />
          <div className="absolute inset-0 bg-[#0C969C]/10 blur-2xl rounded-full animate-pulse" />
        </div>
        <div className="text-center space-y-3">
          <p className="text-[#6BA3BE] font-black uppercase tracking-[0.5em] animate-pulse">Initializing MindGuard Challenge</p>
          <p className="text-[#0C969C] text-[10px] font-black uppercase tracking-widest">Division 02: Behavioral Intelligence</p>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-10 division-transition">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">MindGuard Challenge</h2>
          <p className="text-[#6BA3BE] font-bold text-xs uppercase tracking-[0.3em]">Division 02: Behavioral Intelligence</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-5 py-2.5 bg-[#0A7075]/10 rounded-2xl border border-[#0C969C]/30">
            <Zap className="w-4 h-4 text-[#f59e0b] animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">+5 Score Potential</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-12 space-y-12 border-[#0C969C]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0A7075]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="space-y-8 relative z-10">
          <div className="flex items-start gap-8">
            <div className="w-16 h-16 bg-[#0A7075]/20 rounded-[1.5rem] flex items-center justify-center border border-[#0A7075]/30 shrink-0 shadow-lg">
              <HelpCircle className="w-8 h-8 text-[#0C969C]" />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-[#6BA3BE] uppercase tracking-[0.3em]">Cognitive Verification</p>
              <h3 className="text-2xl font-black text-white leading-tight tracking-tight">{question.question}</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {question.options.map((option, i) => (
              <button
                key={i}
                disabled={isSubmitted}
                onClick={() => setSelectedOption(i)}
                className={cn(
                  "p-8 rounded-[2rem] text-left transition-all duration-500 border flex items-center gap-8 group relative overflow-hidden",
                  selectedOption === i 
                    ? "bg-[#0A7075] border-[#0C969C] text-white shadow-[0_0_30px_rgba(10,112,117,0.3)]" 
                    : "bg-[#031716] border-[#0A7075]/20 text-[#CCD0CF] hover:border-[#0A7075]/50 hover:bg-[#0A7075]/5",
                  isSubmitted && i === question.correct_index && "bg-[#22c55e] border-[#22c55e] text-white shadow-[0_0_30px_rgba(34,197,94,0.4)]",
                  isSubmitted && selectedOption === i && i !== question.correct_index && "bg-[#ef4444] border-[#ef4444] text-white shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-all duration-500 border",
                  selectedOption === i ? "bg-white/20 border-white/30" : "bg-[#032F30] text-[#6BA3BE] border-[#0A7075]/30"
                )}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="font-bold text-xl tracking-tight">{option}</span>
                {isSubmitted && i === question.correct_index && (
                  <CheckCircle2 className="w-8 h-8 text-white ml-auto animate-bounce" />
                )}
                {isSubmitted && selectedOption === i && i !== question.correct_index && (
                  <AlertTriangle className="w-8 h-8 text-white ml-auto animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-10 rounded-[2.5rem] border space-y-6 relative overflow-hidden",
                selectedOption === question.correct_index 
                  ? "bg-[#22c55e]/5 border-[#22c55e]/30" 
                  : "bg-[#ef4444]/5 border-[#ef4444]/30"
              )}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-current opacity-30" />
              <div className="flex items-center gap-6">
                {selectedOption === question.correct_index ? (
                  <div className="w-12 h-12 bg-[#22c55e] rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-[#ef4444] rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Intelligence Debrief</p>
                  <h4 className="text-2xl font-black text-white uppercase tracking-tight">
                    {selectedOption === question.correct_index ? 'Verification Successful' : 'Verification Failed'}
                  </h4>
                </div>
              </div>
              <p className="text-[#CCD0CF] font-medium text-lg leading-relaxed pl-18">
                {question.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-8 relative z-10">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="flex-1 py-6 bg-[#0A7075] hover:bg-[#0C969C] disabled:opacity-30 text-white font-black uppercase tracking-[0.2em] rounded-[1.5rem] transition-all shadow-[0_15px_40px_rgba(10,112,117,0.4)] group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              Submit Verification
            </button>
          ) : (
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex-1 py-6 bg-[#032F30] hover:bg-[#0A7075]/40 text-[#6BA3BE] font-black uppercase tracking-[0.2em] rounded-[1.5rem] transition-all border border-[#0A7075]/30 flex items-center justify-center gap-4 group"
            >
              Return to Command Nexus
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
