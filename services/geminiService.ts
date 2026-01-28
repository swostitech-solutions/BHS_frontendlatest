
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIRecommendation = async (userQuery: string, currentServices: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User is looking for: "${userQuery}". Here are our available services: ${JSON.stringify(currentServices)}. 
      Recommend the best service and explain why briefly. Return in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedServiceId: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["recommendedServiceId", "reason"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Error:", error);
    return null;
  }
};

export const getSmartFaq = async (question: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the BHS (Best Home Services) AI assistant. Answer this user question about our home services: "${question}". Be professional and helpful.`,
    });
    return response.text;
  } catch (error) {
    return "I'm sorry, I'm having trouble connecting right now. How can I help you manually?";
  }
};
