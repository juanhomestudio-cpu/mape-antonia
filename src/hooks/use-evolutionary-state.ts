import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { useSession } from '@/lib/auth-provider';
import { useProfile } from '@/hooks/use-profile';

/**
 * Estado narrativo de la usuaria. Trayectoria oficial del documento de
 * contenido (sección 19.3):
 *
 *   Mujer en supervivencia → consciente → conectada → regulada → presente
 *   → mujer que se habita
 *
 * En V1 (con sólo Mundo 1 jugable), cubrimos del primer al tercer estado:
 * - Sin progreso o sin onboarding → "Mujer en supervivencia"
 * - 1+ clase completa del M1 → "Mujer consciente"
 * - Mundo 1 cerrado → "Mujer conectada"
 *
 * Cuando habilitemos M2/M3 con contenido, extendemos hacia "regulada",
 * "presente" y "mujer que se habita".
 *
 * Si `profiles.evolutionary_state` está set explícitamente (por un trigger
 * o admin), se respeta. Si no, se deriva del progreso.
 */
type EvolutionaryState =
  | 'Mujer en supervivencia'
  | 'Mujer consciente'
  | 'Mujer conectada'
  | 'Mujer regulada'
  | 'Mujer presente'
  | 'Mujer que se habita';

async function getM1Progress(): Promise<{ completed: number; total: number }> {
  const { data: w, error: wErr } = await supabase
    .from('worlds')
    .select('id')
    .eq('slug', 'un-dia-naci')
    .single();
  if (wErr || !w) return { completed: 0, total: 0 };

  const { data: lessons } = await supabase
    .from('lessons')
    .select('id')
    .eq('world_id', w.id)
    .eq('is_published', true);
  const total = lessons?.length ?? 0;
  if (total === 0) return { completed: 0, total: 0 };

  const ids = lessons!.map((l) => l.id);
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('status')
    .in('lesson_id', ids)
    .eq('status', 'completed');
  const completed = progress?.length ?? 0;
  return { completed, total };
}

export function useEvolutionaryState(): EvolutionaryState {
  const { session } = useSession();
  const { data: profile } = useProfile();

  const { data: progress } = useQuery({
    queryKey: ['m1-progress-for-state', session?.user.id],
    queryFn: getM1Progress,
    enabled: !!session,
  });

  // Si el perfil tiene un estado explícito (asignado por trigger / admin),
  // se respeta. Si no, se deriva.
  if (profile?.evolutionary_state) {
    return profile.evolutionary_state as EvolutionaryState;
  }

  if (!progress || progress.total === 0 || progress.completed === 0) {
    return 'Mujer en supervivencia';
  }
  if (progress.completed < progress.total) {
    return 'Mujer consciente';
  }
  return 'Mujer conectada';
}
