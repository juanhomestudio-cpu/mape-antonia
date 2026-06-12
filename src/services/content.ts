import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

export type World = Database['public']['Tables']['worlds']['Row'];
export type Lesson = Database['public']['Tables']['lessons']['Row'];
export type MicroExperience = Database['public']['Tables']['micro_experiences']['Row'];

export async function getWorlds(): Promise<World[]> {
  // RLS filtra published; aquí solo controlamos el orden.
  const { data, error } = await supabase
    .from('worlds')
    .select('*')
    .order('position', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getWorldBySlug(slug: string): Promise<World | null> {
  const { data, error } = await supabase
    .from('worlds')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getLessonsForWorld(worldId: string): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('world_id', worldId)
    .order('position', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export type LessonWithMicros = Lesson & {
  micro_experiences: MicroExperience[];
  world: { slug: string; title: string } | null;
};

export async function getLessonById(id: string): Promise<LessonWithMicros | null> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*, micro_experiences(*), world:worlds(slug, title)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const micros = ((data.micro_experiences ?? []) as MicroExperience[]).sort(
    (a, b) => a.position - b.position,
  );
  return { ...data, micro_experiences: micros } as LessonWithMicros;
}
