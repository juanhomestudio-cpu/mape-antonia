import { supabase } from '@/lib/supabase';
import type { Lesson } from '@/services/content';

/**
 * Devuelve la próxima clase pendiente del usuario en el Mundo 1.
 * Lógica:
 *  - Si hay una clase con status='in_progress', esa es la próxima.
 *  - Si no, la primera clase del Mundo 1 sin progreso completado, en orden.
 *  - Si todas están completas, devuelve null.
 */
export async function getNextLesson(): Promise<Lesson | null> {
  // 1. Recuperar todas las clases del Mundo 1 publicado.
  const { data: worldRow, error: wErr } = await supabase
    .from('worlds')
    .select('id')
    .eq('slug', 'un-dia-naci')
    .maybeSingle();
  if (wErr) throw wErr;
  if (!worldRow) return null;

  const { data: lessons, error: lErr } = await supabase
    .from('lessons')
    .select('*')
    .eq('world_id', worldRow.id)
    .order('position', { ascending: true });
  if (lErr) throw lErr;
  if (!lessons || lessons.length === 0) return null;

  // 2. Recuperar el progreso del usuario en esas clases.
  const ids = lessons.map((l) => l.id);
  const { data: progress, error: pErr } = await supabase
    .from('lesson_progress')
    .select('lesson_id, status')
    .in('lesson_id', ids);
  if (pErr) throw pErr;
  const byLesson = new Map((progress ?? []).map((p) => [p.lesson_id, p.status]));

  // 3. Lógica.
  const inProgress = lessons.find((l) => byLesson.get(l.id) === 'in_progress');
  if (inProgress) return inProgress as Lesson;

  const nextPending = lessons.find((l) => byLesson.get(l.id) !== 'completed');
  return (nextPending as Lesson) ?? null;
}
