const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase;
if (supabaseUrl && supabaseUrl !== 'your_supabase_project_url') {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  // Mock client or error warning if not configured
  console.warn("WARNING: Supabase URL/Key is not configured in .env. Database operations will fail.");
  supabase = null;
}

module.exports = supabase;
