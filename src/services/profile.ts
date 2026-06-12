import { supabase } from '@/lib/supabase';

export type Profile = {
  user_id: string;
  display_name: string;
  age: number | null;
  avatar_url: string | null;
  current_archetype_id: string | null;
  evolutionary_state: string | null;
  onboarding_completed_at: string | null;
  intro_seen: boolean;
  locale: string;
};

export async function getMyProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select(
      'user_id, display_name, age, avatar_url, current_archetype_id, evolutionary_state, onboarding_completed_at, intro_seen, locale',
    )
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateMyProfile(patch: {
  display_name?: string;
  age?: number | null;
  avatar_url?: string | null;
  current_archetype_id?: string | null;
  evolutionary_state?: string | null;
  intro_seen?: boolean;
  onboarding_completed_at?: string | null;
}) {
  const { data, error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('user_id', (await supabase.auth.getUser()).data.user!.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Devuelve el perfil al estado anterior al onboarding y borra el snapshot
 * del diagnóstico para que la usuaria pueda repetir todo el flujo.
 * Solo se usa en modo desarrollo.
 */
export async function devResetOnboarding() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('No hay sesión activa');
  await supabase
    .from('profiles')
    .update({
      onboarding_completed_at: null,
      intro_seen: false,
      current_archetype_id: null,
      evolutionary_state: null,
    })
    .eq('user_id', user.id);
  await supabase.from('diagnostic_responses').delete().eq('user_id', user.id);
}
