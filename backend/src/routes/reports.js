const express = require('express');
const { z } = require('zod');
const supabase = require('../utils/supabase');
const { authenticateToken } = require('../middleware/auth');
const { explainFloodRisk } = require('../utils/gemini');

const router = express.Router();

const reportSchema = z.object({
    location_name: z.string().min(1),
    rainfall_mm: z.number().min(0),
    drainage_status: z.enum(['Clear', 'Partially Blocked', 'Blocked']),
    water_level_cm: z.number().min(0),
});

function calculateRisk(rainfall, drainage, waterLevel) {
    let riskScore = 0;
    riskScore += rainfall * 0.5;
    riskScore += waterLevel * 2;

    if (drainage === 'Partially Blocked') riskScore += 20;
    if (drainage === 'Blocked') riskScore += 50;

    if (riskScore < 30) return 'Low';
    if (riskScore < 70) return 'Moderate';
    if (riskScore < 120) return 'High';
    return 'Severe';
}

// GET all reports with filtering and sorting
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { location, risk_level, sortBy } = req.query;

        if (!supabase) return res.status(500).json({ error: 'Database not connected' });

        let query = supabase.from('Flood_Reports').select('*');

        if (location) query = query.ilike('location_name', `%${location}%`);
        if (risk_level) query = query.eq('risk_level', risk_level);

        if (sortBy === 'rainfall') {
            query = query.order('rainfall_mm', { ascending: false });
        } else {
            query = query.order('created_at', { ascending: false }); // Default sort
        }

        const { data: reports, error } = await query;
        if (error) throw error;

        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET Single report
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase.from('Flood_Reports').select('*').eq('id', id).single();
        if (error || !data) return res.status(404).json({ error: 'Report not found' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE report
router.post('/', authenticateToken, async (req, res) => {
    try {
        const requestData = reportSchema.parse(req.body);
        const risk_level = calculateRisk(
            requestData.rainfall_mm,
            requestData.drainage_status,
            requestData.water_level_cm
        );

        const newReport = {
            ...requestData,
            user_id: req.user.id,
            risk_level,
        };

        if (!supabase) {
            return res.status(201).json({ ...newReport, id: 'temp-id', message: 'Saved to memory (DB not connected)' });
        }

        const { data, error } = await supabase.from('Flood_Reports').insert([newReport]).select().single();
        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// GET AI Explanation for a report
router.get('/:id/explain', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        if (!supabase) {
            const expl = await explainFloodRisk("Unknown", 50, "Clear", 10, "Moderate");
            return res.json({ explanation: expl });
        }

        const { data: report, error } = await supabase.from('Flood_Reports').select('*').eq('id', id).single();
        if (error || !report) return res.status(404).json({ error: 'Report not found' });

        const explanation = await explainFloodRisk(
            report.location_name,
            report.rainfall_mm,
            report.drainage_status,
            report.water_level_cm,
            report.risk_level
        );

        res.json({ explanation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE report
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Only allow owner to delete
        const { data: existing, error: fetchError } = await supabase.from('Flood_Reports').select('*').eq('id', id).single();
        if (fetchError || !existing) return res.status(404).json({ error: 'Report not found' });

        if (existing.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to delete this report' });
        }

        const { error } = await supabase.from('Flood_Reports').delete().eq('id', id);
        if (error) throw error;

        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
