import React, { useState } from 'react';

export default function App() {
    const [rainfall, setRainfall] = useState('');
    const [drainage, setDrainage] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [alertSent, setAlertSent] = useState(false);

    const handleAssessment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAiResult(null);
        setAlertSent(false);

        const rainVal = Number(rainfall);
        const drainVal = Number(drainage);

        let risk_level = "Low";
        let risk_score = 30;

        if (rainVal > 100 || drainVal < 40) {
            risk_level = "High";
            risk_score = 88;
        } else if (rainVal > 50 || drainVal < 70) {
            risk_level = "Medium";
            risk_score = 62;
        }

        const recommendation = {
            risk_level,
            risk_score,
            primary_factors: [
                `Recorded Rainfall: ${rainVal} mm (High Runoff Risk)`,
                `Drainage Capacity: ${drainVal}% (Inundation Risk High)`,
                `Target Location Zone: ${location}`
            ],
            immediate_actions: [
                risk_level === 'High' ? "Issue immediate high alert & divert city traffic." : "Monitor low-lying drainage channels.",
                "Deploy emergency pumping machinery to inundation spots.",
                "Notify local disaster management teams (NDRF / Municipal Corp)."
            ]
        };

        // Save directly to Supabase via REST API
        try {
            await fetch("https://sdcjexrwdqpzkxiowkqx.supabase.co/rest/v1/flood_reports", {
                method: "POST",
                headers: {
                    "apikey": "sb_publishable_tqSSksZmXpTkbMR3qRDhKQ_YXnJ54I7",
                    "Authorization": "Bearer sb_publishable_tqSSksZmXpTkbMR3qRDhKQ_YXnJ54I7",
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },
                body: JSON.stringify({
                    location_name: location,
                    rainfall_mm: rainVal,
                    drainage_capacity_pct: drainVal,
                    risk_level: risk_level,
                    ai_recommendation: recommendation
                })
            });
        } catch (err) {
            console.warn("Supabase Log:", err);
        }

        setAiResult(recommendation);
        setLoading(false);
    };

    const sendEmergencyAlert = () => {
        const alertMessage = `🚨 URBAN FLOOD ALERT: High Risk detected at ${location}! Rainfall: ${rainfall}mm, Drainage: ${drainage}%. Immediate Action Required!`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(alertMessage)}`;
        window.open(whatsappUrl, '_blank');
        setAlertSent(true);
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '1.5rem', fontFamily: 'sans-serif' }}>
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', color: '#38bdf8', margin: 0 }}>🌊 Urban Flood Alert Platform</h1>
                    <p style={{ color: '#94a3b8', margin: '4px 0 0 0' }}>Problem ID: S7 · Smart City Flood Monitoring System</p>
                </div>
                <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Logout
                </button>
            </header>

            {/* Main Grid: Form, AI Analysis & Map */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                {/* Form Panel */}
                <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#f1f5f9' }}>1. Enter Flood Risk Parameters</h2>

                    <form onSubmit={handleAssessment}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.4rem', color: '#cbd5e1' }}>Location Name</label>
                            <input
                                type="text"
                                placeholder="e.g. M.G. Road, Vijayawada"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.4rem', color: '#cbd5e1' }}>Rainfall Intensity (mm)</label>
                            <input
                                type="number"
                                placeholder="e.g. 120"
                                value={rainfall}
                                onChange={(e) => setRainfall(e.target.value)}
                                required
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.4rem', color: '#cbd5e1' }}>Drainage Capacity (%)</label>
                            <input
                                type="number"
                                placeholder="e.g. 35"
                                value={drainage}
                                onChange={(e) => setDrainage(e.target.value)}
                                required
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: 'none', backgroundColor: '#0284c7', color: '#fff', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
                        >
                            {loading ? 'Analyzing Risk Parameters...' : 'Run Flood Risk Assessment'}
                        </button>
                    </form>
                </div>

                {/* AI Advisory Panel */}
                <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#f1f5f9' }}>2. AI Advisory & Emergency Actions</h2>

                    {!aiResult && !loading && (
                        <div style={{ color: '#64748b', textAlign: 'center', marginTop: '3rem' }}>
                            Fill in the parameters and submit to generate real-time risk advisory.
                        </div>
                    )}

                    {loading && (
                        <div style={{ color: '#38bdf8', textAlign: 'center', marginTop: '3rem', fontWeight: 'bold' }}>
                            🤖 Processing parameters and checking risk thresholds...
                        </div>
                    )}

                    {aiResult && (
                        <div>
                            <div style={{
                                padding: '0.8rem',
                                borderRadius: '8px',
                                marginBottom: '1rem',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: aiResult.risk_level === 'High' ? '#7f1d1d' : aiResult.risk_level === 'Medium' ? '#78350f' : '#14532d',
                                color: aiResult.risk_level === 'High' ? '#fca5a5' : aiResult.risk_level === 'Medium' ? '#fde68a' : '#86efac'
                            }}>
                                <span>Risk Level: {aiResult.risk_level}</span>
                                <span>Score: {aiResult.risk_score}/100</span>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '0.95rem', color: '#93c5fd', marginBottom: '0.4rem' }}>Risk Factors:</h3>
                                <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.9rem', margin: 0 }}>
                                    {aiResult.primary_factors.map((factor, idx) => (
                                        <li key={idx} style={{ marginBottom: '0.2rem' }}>{factor}</li>
                                    ))}
                                </ul>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '0.95rem', color: '#86efac', marginBottom: '0.4rem' }}>Recommended Actions:</h3>
                                <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.9rem', margin: 0 }}>
                                    {aiResult.immediate_actions.map((action, idx) => (
                                        <li key={idx} style={{ marginBottom: '0.2rem' }}>{action}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Emergency Alert Dispatcher */}
                            {aiResult.risk_level === 'High' && (
                                <div style={{ marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid #334155' }}>
                                    <button
                                        onClick={sendEmergencyAlert}
                                        style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: 'none', backgroundColor: '#dc2626', color: '#fff', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        📢 Broadcast Emergency Alert (WhatsApp / SMS)
                                    </button>
                                    {alertSent && (
                                        <p style={{ color: '#4ade80', fontSize: '0.8rem', textAlign: 'center', marginTop: '0.4rem' }}>
                                            ✓ Emergency alert dispatch link generated!
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Live Geospatial Flood Map Panel */}
            <div style={{ marginTop: '1.5rem', backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '10px' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#f1f5f9' }}>3. Live Geospatial Risk Map</h2>
                <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155' }}>
                    <iframe
                        title="Urban Flood Risk Map"
                        width="100%"
                        height="320"
                        style={{ border: 0 }}
                        loading="lazy"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(location || 'Vijayawada, Andhra Pradesh')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    ></iframe>
                </div>
            </div>
        </div>
    );
}