/**
 * Sistema de diseño · Academia Funcional de la Mujer
 *
 * Paleta y tokens definidos en el documento de producto (sección 3.2).
 * Estética: orgánica, femenina, elegante, emocional, cálida, premium.
 * V1: modo claro forzado (Colors.dark = Colors.light) — el documento exige
 * estética premium femenina que no encaja con dark mode automático.
 */

import '@/global.css';

import { Platform } from 'react-native';

/** Paleta de marca · doc sección 3.2 */
export const Brand = {
  bone: '#FBF8F3',        // Fondo base — Blanco hueso
  beigeWarm: '#EFE7DA',   // Fondos suaves — Beige cálido
  beigeLight: '#F7F2EA',  // Tarjetas — Beige claro
  sand: '#C9B79C',        // Bordes — Arena
  brownDark: '#6B5848',   // Texto fuerte — Marrón claro (es oscuro a pesar del nombre)
  sageDark: '#5C6A4D',    // Texto secundario — Salvia oscuro
  sage: '#7C8A6B',        // Color común / estructura — Verde salvia
  eucalyptus: '#8FA68E',  // Acento Mape (mente) — Verde eucalipto
  terracotta: '#B5673F',  // Acento Antonia (cuerpo) — Terracota suave
  rose: '#C9A9A0',        // Acento emocional — Rosado apagado
  white: '#FFFFFF',
  shadow: 'rgba(107, 88, 72, 0.08)',
} as const;

/**
 * Tokens por voz. Aplican al borde de tarjeta, badge de "voz", botón
 * secundario y viñete del player de video.
 */
export const VoiceTokens = {
  antonia: { accent: Brand.terracotta, soft: '#EBD6CB', label: 'Antonia · el cuerpo' },
  mape:    { accent: Brand.eucalyptus, soft: '#D9E2D7', label: 'Mape · la mente'    },
  ambas:   { accent: Brand.sage,       soft: Brand.beigeWarm, label: 'A dos voces'  },
} as const;

export type Voice = keyof typeof VoiceTokens;

/**
 * Colors mantiene el mismo shape que usan ThemedText/ThemedView de la
 * plantilla. dark = light deliberadamente: V1 fuerza modo claro.
 */
const palette = {
  text: Brand.brownDark,
  background: Brand.bone,
  backgroundElement: Brand.beigeLight,
  backgroundSelected: Brand.beigeWarm,
  textSecondary: Brand.sageDark,
} as const;

export const Colors = {
  light: palette,
  dark: palette,
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',       // Títulos premium con serif del sistema
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
