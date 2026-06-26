/**
 * Sistema de diseño · Academia Funcional de la Mujer
 *
 * Paleta y tokens del Design System "Sanctuary of the Self" (Stitch).
 * Estética: santuario digital — minimalismo orgánico, cinematográfico,
 * cálido. Premium femenino, no clínico.
 *
 * V1: modo claro forzado (Colors.dark = Colors.light) — la estética
 * cálida del santuario no encaja con dark mode automático.
 */

import '@/global.css';

import { Platform } from 'react-native';

/** Paleta del Design System (Sanctuary of the Self) */
export const Brand = {
  // Base
  bone: '#FDFCF9',          // surface / background — Base Surface
  surfaceLow: '#FAF2EE',    // surface-container-low — fondos suaves
  surfaceMid: '#F4ECE8',    // surface-container — tarjetas
  surfaceHigh: '#EEE7E3',   // surface-container-high — bordes/contenedores secundarios
  surfaceTop: '#E8E1DD',    // surface-container-highest

  // Texto
  charcoal: '#333333',      // charcoal-text — texto principal (NUNCA usar negro puro)
  textSoft: '#4F453D',      // on-surface-variant — texto secundario
  textFaint: '#80756C',     // outline — placeholders / hints

  // Voces (acentos dinámicos)
  terracotta: '#C17B5E',    // antonia-terracotta — voz de Antonia (cuerpo)
  eucalyptus: '#5F7464',    // mape-eucalyptus — voz de Mape (mente)

  // Neutrales del sistema
  sand: '#F5F2ED',          // sand-neutral — fondos de inputs/cards alternas
  outline: '#D2C4BA',       // outline-variant — bordes sutiles
  primaryBrown: '#71573F',  // surface-tint / primary — café del sistema

  // Aux
  white: '#FFFFFF',
  shadow: 'rgba(113, 87, 63, 0.08)',  // sombra teñida con primary, NO gris
} as const;

/**
 * Tokens por voz. Aplican al borde de tarjeta, badge de "voz", botón
 * secundario y viñete del player de video.
 */
export const VoiceTokens = {
  antonia: { accent: Brand.terracotta, soft: '#F0DDD2', label: 'Antonia · el cuerpo' },
  mape:    { accent: Brand.eucalyptus, soft: '#D5DED7', label: 'Mape · la mente'    },
  ambas:   { accent: Brand.primaryBrown, soft: Brand.surfaceLow, label: 'A dos voces' },
} as const;

export type Voice = keyof typeof VoiceTokens;

/**
 * Colors mantiene el mismo shape que usan ThemedText/ThemedView.
 * dark = light deliberadamente: V1 fuerza modo claro.
 */
const palette = {
  text: Brand.charcoal,
  background: Brand.bone,
  backgroundElement: Brand.surfaceMid,
  backgroundSelected: Brand.surfaceHigh,
  textSecondary: Brand.textSoft,
} as const;

export const Colors = {
  light: palette,
  dark: palette,
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * Familias de fuentes — cargadas con expo-google-fonts en _layout.tsx.
 * Playfair Display para títulos (serif premium tipo "journal").
 * Work Sans para body (sans grounded, líneas generosas).
 */
export const Fonts = {
  serif: 'PlayfairDisplay_500Medium',
  serifBold: 'PlayfairDisplay_600SemiBold',
  sans: 'WorkSans_400Regular',
  sansMedium: 'WorkSans_500Medium',
  sansSemiBold: 'WorkSans_600SemiBold',
  // Fallbacks de sistema (mientras carga)
  systemSerif: Platform.select({ ios: 'ui-serif', default: 'serif' }),
  systemSans: Platform.select({ ios: 'system-ui', default: 'normal' }),
};

/**
 * Escala tipográfica del Design System.
 */
export const Type = {
  headlineLg:   { fontFamily: Fonts.serifBold, fontSize: 42, lineHeight: 50, letterSpacing: -0.84 },
  headlineLgM:  { fontFamily: Fonts.serifBold, fontSize: 32, lineHeight: 38 },
  headlineMd:   { fontFamily: Fonts.serif,     fontSize: 28, lineHeight: 36 },
  bodyLg:       { fontFamily: Fonts.sans,      fontSize: 18, lineHeight: 31 },
  bodyMd:       { fontFamily: Fonts.sans,      fontSize: 16, lineHeight: 26 },
  labelCaps:    { fontFamily: Fonts.sansSemiBold, fontSize: 12, lineHeight: 17, letterSpacing: 1.2, textTransform: 'uppercase' as const },
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
  // Tokens del Design System
  stackSm: 12,
  stackMd: 24,
  gutter: 24,
  safeMargin: 32,
  sectionGap: 64,
} as const;

export const Radius = {
  sm: 4,
  md: 12,
  lg: 16,
  xl: 24,         // rounded-xl del DS — uso por defecto en cards
  pill: 9999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 1100;
