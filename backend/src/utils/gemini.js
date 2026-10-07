const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

let genAI;
let model;

if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key') {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
} else {
    console.warn("WARNING: Gemini API Key is not configured in .env. AI features will fail.");
}

async function explainFloodRisk(location, rainfall, drainage, waterLevel, riskLevel) {
    if (!model) {
        return `AI Explanation requires API key. Base risk at ${location} is ${riskLevel}.`;
    }

    const prompt = `
    You are an urban flood analysis assistant. 
    Location: ${location}
    Rainfall: ${rainfall}mm
    Drainage Status: ${drainage}
    Water Level: ${waterLevel}cm
    Categorized Risk Level: ${riskLevel}

    Please provide a very short, one to two sentence explanation of why this combination results in a "${riskLevel}" flood risk. Give actionable but brief advice.
  `;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Could not generate AI explanation at this time.";
    }
}

module.exports = { explainFloodRisk };
