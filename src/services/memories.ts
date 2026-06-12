import { supabase } from '@/lib/supabase';

/**
 * V1: las "memorias" se construyen leyendo las respuestas que la usuaria
 * ha escrito a las micro experiencias (reflexiones). Devolvemos el texto
 * junto con el prompt original y el título de la clase para dar contexto.
 *
 * Cuando alimentemos la tabla `memories` con triggers (Fase posterior),
 * este helper consumirá esa tabla unificada.
 */
export type ReflectionMemory = {
  id: string;
  created_at: string;
  response_text: string | null;
  is_favorite: boolean;
  prompt: string | null;
  lesson_title: string | null;
  voice: 'antonia' | 'mape' | 'ambas';
};

export async function listMyReflections(): Promise<ReflectionMemory[]> {
  const { data, error } = await supabase
    .from('micro_experience_responses')
    .select(
      'id, created_at, response_text, is_favorite, micro:micro_experiences(prompt, voice), lesson:lessons(title)',
    )
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.id as string,
    created_at: r.created_at as string,
    response_text: r.response_text as string | null,
    is_favorite: r.is_favorite as boolean,
    prompt: r.micro?.prompt ?? null,
    lesson_title: r.lesson?.title ?? null,
    voice: (r.micro?.voice ?? 'ambas') as 'antonia' | 'mape' | 'ambas',
  }));
}
