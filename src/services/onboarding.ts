import { supabase } from '@/lib/supabase';
import { scoreDiagnostic, type DiagnosticAnswer } from '@/lib/archetype-scoring';

export type DiagnosticQuestionRow = {
  id: string;
  position: number;
  prompt: string;
  options: any;
};

export async function getInitialDiagnostic() {
  const { data, error } = await supabase
    .from('diagnostics')
    .select('id, title, description, slug, diagnostic_questions(id, position, prompt, options)')
    .eq('slug', 'inicial-mundo-1')
    .single();
  if (error) throw error;
  const questions = ((data?.diagnostic_questions ?? []) as DiagnosticQuestionRow[]).sort(
    (a, b) => a.position - b.position,
  );
  return { diagnosticId: data.id, title: data.title, description: data.description, questions };
}

export async function getArchetype(slug: string) {
  const { data, error } = await supabase
    .from('archetypes')
    .select('id, slug, name, short_description, long_description, color_hex, voice')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function submitDiagnostic(args: {
  diagnosticId: string;
  answers: DiagnosticAnswer[];
  questions: { id: string; options: any }[];
}) {
  const { archetypeSlug, scores } = scoreDiagnostic(args.answers, args.questions);

  // Fallback: si scoring no asignó arquetipo, usar 'en-supervivencia'
  // (estado más común de entrada según doc 11.4).
  const finalSlug = archetypeSlug ?? 'en-supervivencia';

  const archetype = await getArchetype(finalSlug);
  if (!archetype) throw new Error(`Arquetipo no encontrado: ${finalSlug}`);

  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('No hay sesión activa');

  const { error: insertErr } = await supabase.from('diagnostic_responses').insert({
    user_id: user.id,
    diagnostic_id: args.diagnosticId,
    answers: args.answers as any,
    resulting_archetype_id: archetype.id,
    archetype_scores: scores as any,
  });
  if (insertErr) throw insertErr;

  const { error: profErr } = await supabase
    .from('profiles')
    .update({ current_archetype_id: archetype.id })
    .eq('user_id', user.id);
  if (profErr) throw profErr;

  return archetype;
}

export async function markIntroSeen() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('No hay sesión activa');
  const { error } = await supabase
    .from('profiles')
    .update({ intro_seen: true })
    .eq('user_id', user.id);
  if (error) throw error;
}

export async function markOnboardingComplete() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('No hay sesión activa');
  const { error } = await supabase
    .from('profiles')
    .update({ onboarding_completed_at: new Date().toISOString() })
    .eq('user_id', user.id);
  if (error) throw error;
}

export async function createFirstLetter(args: {
  title: string;
  body: string;
  deliverAt: Date;
  notifyEmail: boolean;
}) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('No hay sesión activa');
  const { error } = await supabase.from('future_letters').insert({
    user_id: user.id,
    title: args.title,
    body: args.body,
    deliver_at: args.deliverAt.toISOString(),
    notify_email: args.notifyEmail,
  });
  if (error) throw error;
}
