/**
 * Constantes de comportamiento del producto.
 * Cambiar aquí ajusta el sistema sin redeploy de UI.
 */

export const VIDEO_COMPLETE_PCT = 90;

export const STREAK_THRESHOLDS = [3, 7, 21, 30] as const;

/**
 * 5 estados de ánimo del check-in.
 * Orden visual de izquierda a derecha (de "más turbio" a "más conectado").
 * `sfSymbol` aplica al ícono en iOS (mismo set de Material Symbols del diseño).
 */
export const MOOD_OPTIONS = [
  { value: 'agotada',  label: 'Agotada',  sfSymbol: 'cloud.fill',          tint: '#80756C' },
  { value: 'calma',    label: 'En calma', sfSymbol: 'wind',                tint: '#5F7464' },
  { value: 'luminosa', label: 'Vital',    sfSymbol: 'sun.max.fill',        tint: '#D49B5D' },
  { value: 'turbia',   label: 'Inquieta', sfSymbol: 'water.waves',         tint: '#7B91A6' },
  { value: 'neutral',  label: 'Conectada', sfSymbol: 'sparkles',           tint: '#C17B5E' },
] as const;

export type MoodValue = (typeof MOOD_OPTIONS)[number]['value'];

export const STREAK_LABELS: Record<number, string> = {
  3:  '3 días escuchándote',
  7:  '7 días habitándote',
  21: '21 días acompañando tu cuerpo',
  30: '30 días conectando contigo',
};
