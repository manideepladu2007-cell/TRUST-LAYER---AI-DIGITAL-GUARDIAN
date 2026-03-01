import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, CommunityPost, AnalysisResult, AwarenessLevel } from './types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppState {
  user: UserProfile;
  history: { content: string; result: AnalysisResult; timestamp: string }[];
  posts: CommunityPost[];
  toasts: Toast[];
  demoMode: boolean;
  updateUser: (updates: Partial<UserProfile>) => void;
  updateCyberScore: (gain: number) => void;
  addHistory: (content: string, result: AnalysisResult) => void;
  addPost: (post: CommunityPost) => void;
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  resetApp: () => void;
}

const DEFAULT_USER: UserProfile = {
  role: 'IT Professional',
  habits: ['upi', 'email', 'social_media', 'banking'],
  cyberScore: 88,
  trustScore: 940,
  threatsAnalyzed: 42,
  onboarded: true,
  streak: 12,
  awarenessLevel: 'Defender',
};

const SEEDED_HISTORY: { content: string; result: AnalysisResult; timestamp: string }[] = [
  {
    content: "Your bank account will be suspended. Click this link immediately to verify: http://secure-bank-verify.net/login",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    result: {
      risk_score: 98,
      threat_level: 'High',
      threat_type: 'Phishing',
      red_flags: ['Suspicious URL', 'Urgent tone', 'Generic greeting'],
      explanation: 'Classic phishing attempt using fear and urgency.',
      recommended_actions: ['Do not click', 'Report to bank', 'Delete message']
    }
  },
  {
    content: "Hi, I am from Microsoft support. Your PC has a virus. Please install this remote access tool.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    result: {
      risk_score: 92,
      threat_level: 'High',
      threat_type: 'Scam',
      red_flags: ['Unsolicited contact', 'Remote access request'],
      explanation: 'Tech support scam designed to gain control of your device.',
      recommended_actions: ['Hang up', 'Do not install software']
    }
  },
  {
    content: "https://www.google.com",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    result: {
      risk_score: 0,
      threat_level: 'Low',
      threat_type: 'Safe',
      red_flags: [],
      explanation: 'Verified safe domain.',
      recommended_actions: ['Safe to proceed']
    }
  }
];

const SEEDED_POSTS: CommunityPost[] = [
  { id: 'p1', title: 'Fake Internship Scam', content: 'Received a WhatsApp message offering 50k/month for data entry. Link was a credential harvester.', author: 'CyberStudent', trustScore: 450, riskLabel: 'Risky', isModerated: true, upvotes: 24 },
  { id: 'p2', title: 'Crypto Investment Fraud', content: 'Telegram group promising 10x returns in 24 hours. Classic rug pull alert.', author: 'CryptoGuard', trustScore: 890, riskLabel: 'Risky', isModerated: true, upvotes: 56 },
  { id: 'p3', title: 'UPI QR Code Scam', content: 'Seller asked me to scan a QR code to "receive" payment. Remember: QR is only for sending!', author: 'FinSafe', trustScore: 720, riskLabel: 'Risky', isModerated: true, upvotes: 128 },
  { id: 'p4', title: 'Courier Delivery Phishing', content: 'SMS about a failed delivery from "FedEx". Link leads to a fake tracking page asking for CC info.', author: 'TechSavvy', trustScore: 610, riskLabel: 'Risky', isModerated: true, upvotes: 42 },
  { id: 'p5', title: 'Job Offer Phishing', content: 'Email from "Google HR" with a .zip attachment. Scanned it—contained a Trojan.', author: 'HR_Watcher', trustScore: 530, riskLabel: 'Risky', isModerated: true, upvotes: 89 },
  { id: 'p6', title: 'Loan Harassment App', content: 'Avoid "QuickCash" app. It steals your contacts and harasses them if you are 1 day late.', author: 'LoanSlayer', trustScore: 340, riskLabel: 'Risky', isModerated: true, upvotes: 210 },
  { id: 'p7', title: 'Fake Scholarship Portal', content: 'Site looks exactly like the government portal but the URL is .net instead of .gov.in', author: 'EduShield', trustScore: 480, riskLabel: 'Risky', isModerated: true, upvotes: 67 },
  { id: 'p8', title: 'Crypto Giveaway Scam', content: 'Elon Musk "live" on YouTube asking for 0.1 BTC to double it. 100% fake.', author: 'ScamHunter', trustScore: 920, riskLabel: 'Risky', isModerated: true, upvotes: 340 },
];

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [demoMode] = useState(true);
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('trustlayer_v2_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [history, setHistory] = useState<{ content: string; result: AnalysisResult; timestamp: string }[]>(() => {
    const saved = localStorage.getItem('trustlayer_v2_history');
    return saved ? JSON.parse(saved) : SEEDED_HISTORY;
  });

  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('trustlayer_v2_posts');
    return saved ? JSON.parse(saved) : SEEDED_POSTS;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem('trustlayer_v2_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('trustlayer_v2_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('trustlayer_v2_posts', JSON.stringify(posts));
  }, [posts]);

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => {
      const next = { ...prev, ...updates };
      // Awareness level logic
      let level: AwarenessLevel = 'Beginner';
      if (next.cyberScore > 85) level = 'Advanced Defender';
      else if (next.cyberScore > 70) level = 'Defender';
      else if (next.cyberScore > 50) level = 'Aware';
      next.awarenessLevel = level;
      return next;
    });
  };

  const updateCyberScore = (gain: number) => {
    updateUser({ cyberScore: Math.min(100, Math.max(0, user.cyberScore + gain)) });
  };

  const addHistory = (content: string, result: AnalysisResult) => {
    setHistory(prev => [{ content, result, timestamp: new Date().toISOString() }, ...prev]);
    const scoreGain = result.threat_level === 'High' ? 5 : 2;
    updateUser({ 
      threatsAnalyzed: user.threatsAnalyzed + 1,
      cyberScore: Math.min(100, user.cyberScore + scoreGain)
    });
    addToast(`Analysis Complete: +${scoreGain} Cyber Score`, 'success');
  };

  const addPost = (post: CommunityPost) => {
    setPosts(prev => [post, ...prev]);
    updateUser({ trustScore: user.trustScore + 2 });
    addToast('Post Published: +2 Trust Score', 'success');
  };

  const resetApp = () => {
    setUser(DEFAULT_USER);
    setHistory(SEEDED_HISTORY);
    setPosts(SEEDED_POSTS);
    localStorage.clear();
    addToast('Platform Reset Successful', 'warning');
  };

  return (
    <AppContext.Provider value={{ 
      user, history, posts, toasts, demoMode,
      updateUser, updateCyberScore, addHistory, addPost, addToast, removeToast, resetApp 
    }}>
      {children}
      {/* Toast Overlay */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`pointer-events-auto px-6 py-3 rounded-xl shadow-2xl border backdrop-blur-md animate-in slide-in-from-right-full duration-300 ${
              toast.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
              toast.type === 'error' ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' :
              toast.type === 'warning' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' :
              'bg-sky-500/20 border-sky-500/50 text-sky-400'
            }`}
          >
            <p className="text-sm font-bold">{toast.message}</p>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
