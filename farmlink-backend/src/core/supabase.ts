import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl) {
	throw new Error('Supabase is not configured. Set SUPABASE_URL.');
}

if (!supabaseKey) {
	throw new Error('Supabase is not configured. Set SUPABASE_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
