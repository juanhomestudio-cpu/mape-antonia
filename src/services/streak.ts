import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

export type UserStreak = Database['public']['Tables']['user_streaks']['Row'];

export async function getMyStreak(): Promise<UserStreak | null> {
  const { data, error } = await supabase
    .from('user_streaks')
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return data;
}
