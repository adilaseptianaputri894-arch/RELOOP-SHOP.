import { createClient } from '@supabase/supabase-js';

// Menggunakan hardcode URL dan Key agar tidak perlu repot setting Environment Variables di Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://znbncpcrovxyvggfbswa.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_DaT_H60XQkP9kW_J-zNj7Q_Y1YsR4pF';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
