import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, ShieldCheck, ShieldAlert, TrendingUp, Filter, Search, Send, User, ThumbsUp, AlertTriangle, Loader2, Info, X, ExternalLink } from 'lucide-react';
import { useApp } from '../AppContext';
import { aiService } from '../services/aiService';
import { cn } from '../lib/utils';
import { CommunityPost } from '../types';

export const CommunityFeed: React.FC = () => {
  const { user, posts, addPost, addToast } = useApp();
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [isPosting, setIsPosting] = useState(false);
  const [filter, setFilter] = useState<'All' | 'High Risk' | 'Verified' | 'My Sector'>('All');
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  const handlePost = async () => {
    if (!newPost.title || !newPost.content) return;
    setIsPosting(true);
    try {
      const moderation = await aiService.moderatePost(newPost.title, newPost.content);
      
      if (moderation.isSafe) {
        addPost({
          id: Date.now().toString(),
          title: newPost.title,
          content: newPost.content,
          author: user?.role || 'User',
          trustScore: 85,
          riskLabel: 'Safe',
          isModerated: true,
          upvotes: 0
        });
        setNewPost({ title: '', content: '' });
        addToast('Intelligence shared with the network', 'success');
      } else {
        addToast(`Post Blocked: ${moderation.reason}`, 'error');
      }
    } catch (error) {
      console.error(error);
      addToast('Moderation service unavailable', 'error');
    } finally {
      setIsPosting(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'High Risk') return post.riskLabel === 'Risky';
    if (filter === 'Verified') return post.riskLabel === 'Safe';
    if (filter === 'My Sector') return post.author === user.role;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10 division-transition">
      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 bg-[#031716]/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl glass-card p-12 border-[#0C969C]/40 shadow-[0_0_100px_rgba(0,245,212,0.1)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#00F5D4] to-transparent" />
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-8 right-8 p-3 bg-[#031716] border border-[#0A7075]/40 rounded-xl text-[#6BA3BE] hover:text-[#00F5D4] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-10">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-[#031716] rounded-3xl flex items-center justify-center border-2 border-[#0A7075]/40 shadow-inner">
                    <User className="w-10 h-10 text-[#00F5D4]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight">{selectedPost.title}</h3>
                    <p className="text-xs text-[#6BA3BE] font-black uppercase tracking-[0.3em]">
                      {selectedPost.author} • <span className="text-[#00F5D4]">{selectedPost.trustScore}% Trust Score</span>
                    </p>
                  </div>
                </div>

                <div className="bg-[#031716]/50 p-8 rounded-[2rem] border border-[#0A7075]/20">
                  <p className="text-lg text-[#CCD0CF] leading-relaxed font-medium">
                    {selectedPost.content}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-[#031716] rounded-2xl border border-[#0A7075]/20 text-center space-y-2">
                    <p className="text-[10px] font-black text-[#6BA3BE] uppercase tracking-widest">Risk Level</p>
                    <p className={cn(
                      "text-xl font-black uppercase",
                      selectedPost.riskLabel === 'Safe' ? "text-[#22c55e]" : "text-[#ef4444]"
                    )}>{selectedPost.riskLabel}</p>
                  </div>
                  <div className="p-6 bg-[#031716] rounded-2xl border border-[#0A7075]/20 text-center space-y-2">
                    <p className="text-[10px] font-black text-[#6BA3BE] uppercase tracking-widest">Upvotes</p>
                    <p className="text-xl font-black text-white">{selectedPost.upvotes}</p>
                  </div>
                  <div className="p-6 bg-[#031716] rounded-2xl border border-[#0A7075]/20 text-center space-y-2">
                    <p className="text-[10px] font-black text-[#6BA3BE] uppercase tracking-widest">Status</p>
                    <p className="text-xl font-black text-[#00F5D4] uppercase">Verified</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <button className="flex-1 py-5 bg-[#0A7075] hover:bg-[#0C969C] text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-4 shadow-lg">
                    <ThumbsUp className="w-5 h-5" />
                    Upvote Intelligence
                  </button>
                  <button className="flex-1 py-5 bg-[#032F30] border border-[#0A7075]/40 text-[#6BA3BE] hover:text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-4">
                    <ExternalLink className="w-5 h-5" />
                    Share Advisory
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase title-accent">Sentinel Network</h2>
          <p className="text-[#6BA3BE] font-bold text-xs uppercase tracking-[0.4em] opacity-80">Division 03: Community Intelligence</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6BA3BE] group-focus-within:text-[#00F5D4] transition-colors" />
            <input 
              type="text" 
              placeholder="Search Intelligence..." 
              className="bg-[#032F30] border border-[#0A7075]/40 rounded-2xl py-3 pl-14 pr-6 text-sm text-[#CCD0CF] focus:ring-2 focus:ring-[#00F5D4] focus:border-transparent w-72 transition-all shadow-inner"
            />
          </div>
          <button className="p-3 bg-[#032F30] border border-[#0A7075]/40 rounded-2xl text-[#6BA3BE] hover:text-[#00F5D4] hover:border-[#00F5D4]/50 transition-all shadow-lg">
            <Filter className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div className="glass-card p-10 space-y-8 border-[#0C969C]/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00F5D4]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] flex items-center gap-4 relative z-10">
              <Send className="w-5 h-5 text-[#00F5D4]" />
              Broadcast Threat Intelligence
            </h3>
            <div className="space-y-6 relative z-10">
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Incident Title (e.g., New WhatsApp Scam Variant)"
                className="w-full bg-[#031716] border border-[#0A7075]/40 rounded-2xl p-5 text-base text-white focus:ring-2 focus:ring-[#00F5D4] focus:border-transparent transition-all shadow-inner"
              />
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Describe the threat pattern, red flags, and recommended actions..."
                className="w-full h-40 bg-[#031716] border border-[#0A7075]/40 rounded-2xl p-5 text-base text-white focus:ring-2 focus:ring-[#00F5D4] focus:border-transparent transition-all resize-none shadow-inner"
              />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-3 px-4 py-2 bg-[#00F5D4]/5 rounded-xl border border-[#00F5D4]/20">
                  <ShieldCheck className="w-4 h-4 text-[#00F5D4]" />
                  <p className="text-[10px] text-[#00F5D4] font-black uppercase tracking-widest">
                    AI-Moderation Active: Real-time scanning enabled
                  </p>
                </div>
                <button
                  onClick={handlePost}
                  disabled={isPosting || !newPost.title || !newPost.content}
                  className="px-10 py-4 bg-[#0A7075] hover:bg-[#0C969C] disabled:opacity-30 text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-4 shadow-[0_10px_30px_rgba(10,112,117,0.3)] group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  {isPosting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  Broadcast
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {['All', 'High Risk', 'Verified', 'My Sector'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={cn(
                  "px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] border transition-all duration-500",
                  filter === f 
                    ? "bg-[#00F5D4] border-[#00F5D4] text-[#031716] shadow-[0_0_20px_rgba(0,245,212,0.3)]" 
                    : "bg-[#032F30] border-[#0A7075]/30 text-[#6BA3BE] hover:text-white hover:border-[#0A7075]/60"
                )}
              >
                {f} Intelligence
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {filteredPosts.map((post, i) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={post.id}
                className="glass-card p-10 space-y-8 border-[#0C969C]/20 hover:border-[#00F5D4]/30 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-transparent via-[#00F5D4] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div 
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-[#031716] rounded-2xl flex items-center justify-center border border-[#0A7075]/40 group-hover:border-[#00F5D4]/50 transition-colors shadow-inner">
                      <User className="w-7 h-7 text-[#6BA3BE] group-hover:text-[#00F5D4] transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[#00F5D4] transition-colors">{post.title}</h4>
                      <p className="text-[10px] text-[#6BA3BE] font-black uppercase tracking-[0.2em] opacity-70">
                        {post.author} • <span className="text-[#00F5D4]">{post.trustScore}% Trust Score</span>
                      </p>
                    </div>
                  </div>
                  <div className={cn(
                    "px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                    post.riskLabel === 'Safe' ? "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/40 safe-outline" : "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/40 risk-glow-high"
                  )}>
                    {post.riskLabel}
                  </div>
                </div>

                <p 
                  className="text-base text-[#CCD0CF]/80 leading-relaxed font-medium pl-20 cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  {post.content}
                </p>

                <div className="flex items-center justify-between pt-8 border-t border-[#0A7075]/20 pl-20">
                  <div className="flex items-center gap-10">
                    <button className="flex items-center gap-3 text-[#6BA3BE] hover:text-[#00F5D4] transition-all group/btn">
                      <div className="p-2 bg-black/20 rounded-lg group-hover/btn:bg-[#00F5D4]/10 transition-colors">
                        <ThumbsUp className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black">{post.upvotes}</span>
                    </button>
                    <button className="flex items-center gap-3 text-[#6BA3BE] hover:text-[#00F5D4] transition-all group/btn">
                      <div className="p-2 bg-black/20 rounded-lg group-hover/btn:bg-[#00F5D4]/10 transition-colors">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black">Discuss</span>
                    </button>
                  </div>
                  <button className="text-[10px] font-black text-[#6BA3BE] hover:text-[#ef4444] uppercase tracking-widest flex items-center gap-3 transition-colors">
                    <ShieldAlert className="w-4 h-4" />
                    Report Mismatch
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          <div className="glass-card p-10 space-y-8 border-[#0C969C]/30 bg-gradient-to-br from-[#043a3b] to-[#031716] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00F5D4] to-transparent opacity-30" />
            <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] flex items-center gap-4">
              <div className="radar-pulse">
                <TrendingUp className="w-5 h-5 text-[#00F5D4]" />
              </div>
              Trending Scam Radar
            </h3>
            <div className="space-y-5">
              {[
                { title: 'AI Voice Cloning', trend: '+140%', risk: 'High' },
                { title: 'Fake Job Offers', trend: '+85%', risk: 'Medium' },
                { title: 'UPI Refund Scam', trend: '+62%', risk: 'High' },
                { title: 'Tax Rebate Phishing', trend: '+40%', risk: 'Medium' },
              ].map((scam, i) => (
                <div key={i} className="p-5 bg-[#031716]/60 rounded-2xl border border-[#0A7075]/30 space-y-3 hover:border-[#00F5D4]/40 transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[#00F5D4] transition-colors">{scam.title}</span>
                    <span className="text-[11px] font-black text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded-lg border border-[#22c55e]/30">{scam.trend}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full", 
                      scam.risk === 'High' ? "bg-[#ef4444] shadow-[0_0_10px_#ef4444]" : "bg-[#f59e0b] shadow-[0_0_10px_#f59e0b]"
                    )} />
                    <span className="text-[10px] font-black text-[#6BA3BE] uppercase tracking-widest opacity-70">{scam.risk} Risk Level</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-10 space-y-8 border-[#0C969C]/30 relative overflow-hidden">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] flex items-center gap-4">
              <Info className="w-5 h-5 text-[#6BA3BE]" />
              Network Vitality
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-[#031716] rounded-3xl border border-[#0A7075]/30 shadow-inner group hover:border-[#00F5D4]/40 transition-all">
                <p className="text-3xl font-black text-white tracking-tighter group-hover:text-[#00F5D4] transition-colors">12.4K</p>
                <p className="text-[10px] font-black text-[#6BA3BE] uppercase tracking-widest mt-1">Sentinels</p>
              </div>
              <div className="text-center p-6 bg-[#031716] rounded-3xl border border-[#0A7075]/30 shadow-inner group hover:border-[#00F5D4]/40 transition-all">
                <p className="text-3xl font-black text-[#22c55e] tracking-tighter group-hover:text-[#00F5D4] transition-colors">98.2%</p>
                <p className="text-[10px] font-black text-[#6BA3BE] uppercase tracking-widest mt-1">Accuracy</p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-[#ef4444]/5 rounded-[2.5rem] border border-[#ef4444]/30 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#ef4444] opacity-30" />
            <div className="flex items-center gap-4 text-[#ef4444]">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
              <h4 className="text-xs font-black uppercase tracking-[0.3em]">Global Alert</h4>
            </div>
            <p className="text-sm text-[#CCD0CF]/90 font-medium leading-relaxed">
              New zero-day exploit detected in common browser extensions. Audit your extensions in Shield Zone immediately.
            </p>
            <button className="w-full py-3 bg-[#ef4444]/10 hover:bg-[#ef4444]/20 text-[#ef4444] text-[10px] font-black uppercase tracking-widest rounded-xl border border-[#ef4444]/30 transition-all">
              View Advisory Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
