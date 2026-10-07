-- Drop tables if you are re-running this from scratch
-- DROP TABLE IF EXISTS flood_reports CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- 1. users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. flood_reports table
CREATE TABLE IF NOT EXISTS flood_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    location_name VARCHAR(255),
    latitude NUMERIC,
    longitude NUMERIC,
    rainfall_mm NUMERIC,
    rainfall_duration_hours NUMERIC,
    drainage_condition VARCHAR(255),
    water_level_cm NUMERIC,
    risk_score NUMERIC,
    risk_level VARCHAR(100),
    ai_summary TEXT,
    main_causes TEXT,
    safety_actions TEXT,
    recommended_action TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_flood_reports_user_id ON flood_reports(user_id);
CREATE INDEX idx_flood_reports_created_at ON flood_reports(created_at DESC);

-- Trigger function to automatically update `updated_at` on modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flood_reports_updated_at
    BEFORE UPDATE ON flood_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
