import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, TeachBackQuestion, PermissionRisk, CommunityPost, ThreatFeedItem, UserRole } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const aiService = {
  async analyzeMessage(content: string): Promise<AnalysisResult> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this message or URL for cybersecurity threats: "${content}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            risk_score: { type: Type.NUMBER },
            threat_level: { type: Type.STRING },
            threat_type: { type: Type.STRING },
            red_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
            explanation: { type: Type.STRING },
            recommended_actions: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["risk_score", "threat_level", "threat_type", "red_flags", "explanation", "recommended_actions"],
        },
      },
    });
    return JSON.parse(response.text);
  },

  async generateTeachbackQuestion(content: string): Promise<TeachBackQuestion> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a multiple choice question to test a user's understanding of why this content is suspicious: "${content}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correct_index: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
          },
          required: ["question", "options", "correct_index", "explanation"],
        },
      },
    });
    return JSON.parse(response.text);
  },

  async evaluatePermissions(permissions: string[]): Promise<PermissionRisk> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Evaluate the cybersecurity risk of an app requesting these permissions: ${permissions.join(", ")}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            risk_explanation: { type: Type.STRING },
            threat_level: { type: Type.STRING },
            advice: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["risk_explanation", "threat_level", "advice"],
        },
      },
    });
    return JSON.parse(response.text);
  },

  async moderatePost(title: string, content: string): Promise<{ isSafe: boolean; reason?: string }> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Moderate this community post for malicious links or harmful cybersecurity misinformation. Title: ${title}, Content: ${content}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSafe: { type: Type.BOOLEAN },
            reason: { type: Type.STRING },
          },
          required: ["isSafe"],
        },
      },
    });
    return JSON.parse(response.text);
  },

  async generateThreatFeed(role: UserRole): Promise<ThreatFeedItem[]> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 3 personalized cybersecurity threat alerts for a user with the role: ${role}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              severity: { type: Type.STRING },
              category: { type: Type.STRING },
            },
            required: ["id", "title", "description", "severity", "category"],
          },
        },
      },
    });
    return JSON.parse(response.text);
  },
};
