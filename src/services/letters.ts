import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

export type FutureLetter = Database['public']['Tables']['future_letters']['Row'];

async function uid(): Promise<string> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('No hay sesión activa');
  return user.id;
}

export async function listMyLetters(): Promise<FutureLetter[]> {
  const { data, error } = await supabase
    .from('future_letters')
    .select('*')
    .order('deliver_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getLetterById(id: string): Promise<FutureLetter | null> {
  const { data, error } = await supabase
    .from('future_letters')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createLetter(args: {
  title?: string | null;
  body: string;
  deliverAt: Date;
  notifyEmail?: boolean;
}): Promise<FutureLetter> {
  const userId = await uid();
  const { data, error } = await supabase
    .from('future_letters')
    .insert({
      user_id: userId,
      title: args.title ?? null,
      body: args.body,
      deliver_at: args.deliverAt.toISOString(),
      notify_email: args.notifyEmail ?? true,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export function splitLetters(letters: FutureLetter[]) {
  const past = letters.filter((l) => l.delivered_at !== null);
  const scheduled = letters.filter((l) => l.delivered_at === null);
  return { past, scheduled };
}
