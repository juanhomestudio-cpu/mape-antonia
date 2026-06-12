import { supabase } from '@/lib/supabase';
import { todayLocalDate } from '@/lib/local-date';
import type { MoodValue } from '@/constants/config';
import type { Database } from '@/types/database';

export type MoodCheckin = Database['public']['Tables']['mood_checkins']['Row'];

async function uid(): Promise<string> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('No hay sesión activa');
  return user.id;
}

export async function getTodayMood(): Promise<MoodCheckin | null> {
  const { data, error } = await supabase
    .from('mood_checkins')
    .select('*')
    .eq('local_date', todayLocalDate())
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertTodayMood(mood: MoodValue, note?: string): Promise<MoodCheckin> {
  const userId = await uid();
  const localDate = todayLocalDate();
  const { data, error } = await supabase
    .from('mood_checkins')
    .upsert(
      {
        user_id: userId,
        mood,
        note: note ?? null,
        local_date: localDate,
      },
      { onConflict: 'user_id,local_date' },
    )
    .select()
    .single();
  if (error) throw error;

  // Activar racha — fire-and-forget, no bloquear UI si falla.
  try {
    await supabase.rpc('track_activity', { p_local_date: localDate });
  } catch {
    // ignorar
  }
  return data;
}

export async function getMoodHistory(days = 30): Promise<MoodCheckin[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const iso = `${since.getFullYear()}-${String(since.getMonth() + 1).padStart(2, '0')}-${String(since.getDate()).padStart(2, '0')}`;
  const { data, error } = await supabase
    .from('mood_checkins')
    .select('*')
    .gte('local_date', iso)
    .order('local_date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
