import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  'https://dojeysuwdjrswswurovx.supabase.co';

const SUPABASE_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_KEY ||
  'sb_publishable_rX3Bz_GDvdhiZOxPxz75Hw_9rqanO20';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
