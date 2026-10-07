import express from 'express';
import { analyzeFloodRisk } from '../gemini.js';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

router.post('/assess', async (req, res) => {
    try {
        const { location_name, rainfall_mm, drainage_capacity_pct } = req.body;

        // Direct mock assessment fallback if Gemini key is missing
        let ai_recommendation;
        try {
            ai_recommendation = await analyzeFloodRisk(
                rainfall_mm,
                drainage_capacity_pct,
                location_name
            );
        } catch (gErr) {
            console.warn("Gemini fallback triggered:", gErr.message);
            const risk_level = rainfall_mm > 100 || drainage_capacity_pct < 40 ? "High" : "Medium";
            ai_recommendation = {
                risk_level,
                risk_score: risk_level === "High" ? 85 : 50,
                primary_factors: [
                    `Heavy rainfall detected: ${rainfall_mm}mm`,
                    `Drainage capacity low: ${drainage_capacity_pct}%`
                ],
                immediate_actions: [
                    "Deploy emergency water pumps to low-lying areas",
                    "Issue public alert for urban traffic diversion"
                ]
            };
        }

        // Save to Supabase
        await supabase.from('flood_reports').insert([
            {
                location_name,
                rainfall_mm,
                drainage_capacity_pct,
                risk_level: ai_recommendation.risk_level,
                ai_recommendation
            }
        ]);

        res.json({
            location_name,
            rainfall_mm,
            drainage_capacity_pct,
            risk_level: ai_recommendation.risk_level,
            ai_recommendation
        });
    } catch (err) {
        console.error('Assessment Route Error:', err);
        res.status(500).json({ error: err.message || 'Server error' });
    }
});

export default router;