import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeFloodRisk(rainfall, drainage, location) {
    const prompt = `Analyze flood risk for location: ${location}. Rainfall: ${rainfall}mm, Drainage capacity: ${drainage}%.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    risk_level: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                    risk_score: { type: Type.NUMBER },
                    primary_factors: { type: Type.ARRAY, items: { type: Type.STRING } },
                    immediate_actions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["risk_level", "risk_score", "primary_factors", "immediate_actions"]
            }
        }
    });

    return JSON.parse(response.text);
}