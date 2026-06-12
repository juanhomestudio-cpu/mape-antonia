/**
 * Constantes de comportamiento del producto.
 * Cambiar aquí ajusta el sistema sin redeploy de UI.
 */

export const VIDEO_COMPLETE_PCT = 90;

export const STREAK_THRESHOLDS = [3, 7, 21, 30] as const;

export const MOOD_OPTIONS = [
  { value: 'luminosa', label: 'Luminosa', emoji: '☀️' },
  { value: 'calma',    label: 'En calma', emoji: '🌿' },
  { value: 'neutral',  label: 'Neutral',  emoji: '◯'  },
  { value: 'turbia',   label: 'Turbia',   emoji: '🌫'  },
  { value: 'agotada',  label: 'Agotada',  emoji: '🌒' },
] as const;

export type MoodValue = (typeof MOOD_OPTIONS)[number]['value'];

export const STREAK_LABELS: Record<number, string> = {
  3:  '3 días escuchándote',
  7:  '7 días habitándote',
  21: '21 días acompañando tu cuerpo',
  30: '30 días conectando contigo',
};
