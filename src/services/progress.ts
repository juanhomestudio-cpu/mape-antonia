import { supabase } from '@/lib/supabase';
import { VIDEO_COMPLETE_PCT } from '@/constants/config';
import type { Database } from '@/types/database';

export type LessonProgress = Database['public']['Tables']['lesson_progress']['Row'];

async function uid(): Promise<string> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('No hay sesión activa');
  return user.id;
}

/** Devuelve TODO el progreso del usuario para un mundo (clases del mundo). */
export async function getProgressForWorld(worldId: string): Promise<LessonProgress[]> {
  const { data: lessons, error: lerr } = await supabase
    .from('lessons')
    .select('id')
    .eq('world_id', worldId);
  if (lerr) throw lerr;
  const ids = (lessons ?? []).map((l) => l.id);
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .in('lesson_id', ids);
  if (error) throw error;
  return data ?? [];
}

export async function getLessonProgress(lessonId: string): Promise<LessonProgress | null> {
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('lesson_id', lessonId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** Crea (o recupera) la fila de progreso al abrir una clase. */
export async function startLesson(lessonId: string): Promise<LessonProgress> {
  const userId = await uid();
  // upsert preserva valores existentes; sólo escribe lo nuevo.
  const { data, error } = await supabase
    .from('lesson_progress')
    .upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        status: 'in_progress',
        started_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,lesson_id', ignoreDuplicates: false },
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Actualiza el porcentaje del video en la clase actual. */
export async function updateVideoProgress(args: {
  lessonId: string;
  percent: number;
}): Promise<LessonProgress> {
  const userId = await uid();
  const pct = Math.max(0, Math.min(100, args.percent));
  const { data: existing } = await supabase
    .from('lesson_progress')
    .select('video_progress_pct, required_micro_done, status')
    .eq('lesson_id', args.lessonId)
    .maybeSingle();

  // Nunca bajamos el porcentaje (si la usuaria retrocede, mantenemos el máximo).
  const nextPct = Math.max(existing?.video_progress_pct ?? 0, pct);
  const reached = nextPct >= VIDEO_COMPLETE_PCT;
  const isCompleted =
    reached && (existing?.required_micro_done ?? false) ? true : false;

  const update: Partial<LessonProgress> = {
    user_id: userId,
    lesson_id: args.lessonId,
    video_progress_pct: nextPct,
    last_seen_at: new Date().toISOString(),
    status: isCompleted ? 'completed' : existing?.status ?? 'in_progress',
    ...(isCompleted ? { completed_at: new Date().toISOString() } : {}),
  };

  const { data, error } = await supabase
    .from('lesson_progress')
    .upsert(update as any, { onConflict: 'user_id,lesson_id', ignoreDuplicates: false })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Guarda la respuesta a una micro experiencia. Si es la reflexión obligatoria
 * (is_required), marca required_micro_done = true en lesson_progress y, si el
 * video ya pasó 90%, marca la clase como completada.
 */
export async function submitMicroResponse(args: {
  microId: string;
  lessonId: string;
  responseText?: string;
  responsePayload?: any;
  isRequired: boolean;
  isFavorite?: boolean;
}): Promise<LessonProgress> {
  const userId = await uid();

  const { error: insErr } = await supabase.from('micro_experience_responses').insert({
    user_id: userId,
    micro_experience_id: args.microId,
    lesson_id: args.lessonId,
    response_text: args.responseText ?? null,
    response_payload: args.responsePayload ?? null,
    is_favorite: args.isFavorite ?? false,
  });
  if (insErr) throw insErr;

  if (!args.isRequired) {
    // No cambiamos lesson_progress si la micro era opcional.
    return (await getLessonProgress(args.lessonId))!;
  }

  // Recuperamos el progreso actual para decidir si completar.
  const current = await getLessonProgress(args.lessonId);
  const videoDone = (current?.video_progress_pct ?? 0) >= VIDEO_COMPLETE_PCT;
  const update: Partial<LessonProgress> = {
    user_id: userId,
    lesson_id: args.lessonId,
    required_micro_done: true,
    last_seen_at: new Date().toISOString(),
    status: videoDone ? 'completed' : current?.status ?? 'in_progress',
    ...(videoDone ? { completed_at: new Date().toISOString() } : {}),
  };
  const { data, error } = await supabase
    .from('lesson_progress')
    .upsert(update as any, { onConflict: 'user_id,lesson_id', ignoreDuplicates: false })
    .select()
    .single();
  if (error) throw error;

  // Disparar el contador de racha — la fecha local viene del cliente.
  const localDate = new Date();
  const iso = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
  try {
    await supabase.rpc('track_activity', { p_local_date: iso });
  } catch {
    // No bloquear flujo si track falla.
  }

  return data;
}

/** Helper: dado el listado de clases ordenadas y su progreso, calcula el estado de cada una. */
export function deriveLessonStatuses(
  lessons: { id: string; position: number }[],
  progress: { lesson_id: string; status: LessonProgress['status'] }[],
) {
  const byLesson = new Map(progress.map((p) => [p.lesson_id, p.status] as const));
  // Encontrar el índice de la siguiente clase no completada.
  const sorted = [...lessons].sort((a, b) => a.position - b.position);
  const completedIds = new Set(sorted.filter((l) => byLesson.get(l.id) === 'completed').map((l) => l.id));

  return sorted.map((lesson, idx) => {
    const raw = byLesson.get(lesson.id);
    if (raw === 'completed') return { ...lesson, derivedStatus: 'completed' as const };
    if (raw === 'in_progress') return { ...lesson, derivedStatus: 'in_progress' as const };
    // Disponible si todas las anteriores están completadas.
    const previousAllDone = sorted
      .slice(0, idx)
      .every((prev) => completedIds.has(prev.id));
    return {
      ...lesson,
      derivedStatus: previousAllDone ? ('available' as const) : ('locked' as const),
    };
  });
}
