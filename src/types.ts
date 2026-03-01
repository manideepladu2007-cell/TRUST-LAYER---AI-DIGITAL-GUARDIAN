export type UserRole = 'Student' | 'IT Professional' | 'Job Seeker' | 'Business Owner' | 'Senior Citizen' | 'Other' | 'Admin';

export type AwarenessLevel = 'Beginner' | 'Aware' | 'Defender' | 'Advanced Defender';

export interface UserProfile {
  role: UserRole;
  habits: string[];
  cyberScore: number;
  trustScore: number;
  threatsAnalyzed: number;
  onboarded: boolean;
  streak: number;
  awarenessLevel: AwarenessLevel;
}

export interface AnalysisResult {
  risk_score: number;
  threat_level: 'Low' | 'Medium' | 'High';
  threat_type: 'Phishing' | 'Scam' | 'Safe' | 'Malware';
  red_flags: string[];
  explanation: string;
  recommended_actions: string[];
}

export interface TeachBackQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface PermissionRisk {
  risk_explanation: string;
  threat_level: 'Low' | 'Medium' | 'High';
  advice: string[];
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  trustScore: number;
  riskLabel: 'Safe' | 'Risky' | 'Pending';
  isModerated: boolean;
  upvotes: number;
}

export interface ThreatFeedItem {
  id: string;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  category: string;
}
