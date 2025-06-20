// File: api/supabaseClient.js

import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Ambil URL dan Key dari environment variables yang disediakan oleh Expo
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validasi untuk memastikan variabel tidak kosong
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing. Check your .env file.");
}

// Buat dan ekspor client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);