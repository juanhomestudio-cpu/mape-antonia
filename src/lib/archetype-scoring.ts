import type { Json } from '@/types/database';

export type DiagnosticAnswer = {
  questionId: string;
  value: string;
};

export type DiagnosticQuestion = {
  id: string;
  options: Json;
};

type Option = {
  value: string;
  label?: string;
  archetype_weight?: Record<string, number>;
};

/**
 * Calcula scores acumulando archetype_weight de las opciones elegidas y
 * devuelve el arquetipo de mayor puntaje. En caso de empate, gana el
 * primero en orden de iteración (determinista).
 *
 * Si ninguna respuesta arroja peso, devuelve null como slug — la UI
 * puede mostrar un arquetipo "neutro" o pedir reintentar.
 */
export function scoreDiagnostic(
  answers: DiagnosticAnswer[],
  questions: DiagnosticQuestion[],
): { archetypeSlug: string | null; scores: Record<string, number> } {
  const questionsById = new Map(questions.map((q) => [q.id, q] as const));
  const scores: Record<string, number> = {};

  for (const answer of answers) {
    const question = questionsById.get(answer.questionId);
    if (!question) continue;
    const options = (question.options as Option[]) ?? [];
    const chosen = options.find((o) => o.value === answer.value);
    if (!chosen?.archetype_weight) continue;
    for (const [slug, weight] of Object.entries(chosen.archetype_weight)) {
      scores[slug] = (scores[slug] ?? 0) + weight;
    }
  }

  let topSlug: string | null = null;
  let topScore = 0;
  for (const [slug, score] of Object.entries(scores)) {
    if (score > topScore) {
      topScore = score;
      topSlug = slug;
    }
  }

  return { archetypeSlug: topSlug, scores };
}
