import { Pressable, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { Brand, Fonts, Radius, Spacing, VoiceTokens } from '@/constants/theme';
import type { World } from '@/services/content';

type Props = {
  world: World;
  state: 'completed' | 'active' | 'locked';
  progress?: { completed: number; total: number };
  cta?: string; // ej. "Clase 1: El despertar"
};

export function WorldNode({ world, state, progress, cta }: Props) {
  const accent = VoiceTokens[world.voice].accent;

  // Mini barra de progreso del mundo
  const ratio =
    state === 'completed'
      ? 1
      : progress && progress.total > 0
        ? progress.completed / progress.total
        : 0;

  const stateLabel =
    state === 'completed'
      ? 'Completado'
      : state === 'locked'
        ? 'Bloqueado'
        : `${progress?.completed ?? 0} de ${progress?.total ?? 0} clases`;

  const Body = (
    <View style={styles.section}>
      {/* Mini barra de progreso */}
      <View style={styles.progressWrap}>
        <View
          style={[
            styles.progressTrack,
            { backgroundColor: state === 'locked' ? 'rgba(113,87,63,0.06)' : `${accent}26` },
          ]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${ratio * 100}%`,
                backgroundColor: state === 'locked' ? Brand.outline : accent,
              },
            ]}
          />
        </View>
        <ThemedText
          style={[
            styles.stateLabel,
            { color: state === 'locked' ? Brand.outline : accent },
          ]}>
          {stateLabel.toUpperCase()}
        </ThemedText>
      </View>

      {/* Orbe / nodo */}
      <View style={styles.orbWrap}>
        {state === 'active' && (
          <View style={[styles.halo, { backgroundColor: accent, opacity: 0.18 }]} />
        )}
        <View
          style={[
            styles.orb,
            state === 'completed' && { backgroundColor: accent, borderColor: accent },
            state === 'active' && {
              backgroundColor: accent,
              borderColor: accent,
              shadowColor: accent,
              shadowOpacity: 0.7,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 0 },
            },
            state === 'locked' && { borderColor: 'rgba(113,87,63,0.3)' },
          ]}
        />
      </View>

      {/* Contenido textual */}
      <View style={[styles.text, state === 'locked' && { opacity: 0.6 }]}>
        <ThemedText type="caps" style={[styles.eyebrow, { color: accent }]}>
          Mundo {world.position}
        </ThemedText>
        <ThemedText style={styles.title}>{world.title}</ThemedText>
        {world.subtitle && state !== 'locked' && (
          <ThemedText style={styles.quote}>"{world.subtitle}"</ThemedText>
        )}
        {state === 'locked' && (
          <View style={styles.lockRow}>
            <SymbolView name="lock.fill" tintColor={Brand.outline} size={12} />
            <ThemedText type="caps" style={styles.lockText}>
              Contenido bloqueado
            </ThemedText>
          </View>
        )}
      </View>

      {/* CTA solo para mundo activo */}
      {state === 'active' && cta && (
        <View style={styles.ctaWrap}>
          <View style={[styles.ctaPill, { backgroundColor: Brand.primaryBrown }]}>
            <ThemedText type="caps" style={styles.ctaText}>
              Continuar mi camino
            </ThemedText>
          </View>
          <ThemedText type="caps" style={styles.ctaSub}>
            {cta}
          </ThemedText>
        </View>
      )}
    </View>
  );

  if (state === 'locked') return Body;
  return (
    <Link href={{ pathname: '/world/[slug]', params: { slug: world.slug } }} asChild>
      <Pressable>{Body}</Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  section: { alignItems: 'center', paddingVertical: Spacing.six, gap: Spacing.three },
  progressWrap: { alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.three },
  progressTrack: { width: 120, height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  stateLabel: { fontSize: 9, fontFamily: Fonts.sansSemiBold, letterSpacing: 1.5 },
  orbWrap: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', width: 64, height: 64, borderRadius: 32 },
  orb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  text: { alignItems: 'center', gap: Spacing.two, maxWidth: 320 },
  eyebrow: { letterSpacing: 1.5 },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 28,
    lineHeight: 34,
    color: Brand.primaryBrown,
    textAlign: 'center',
    marginTop: Spacing.one,
  },
  quote: {
    fontFamily: Fonts.sans,
    fontStyle: 'italic',
    fontSize: 16,
    lineHeight: 26,
    color: Brand.textSoft,
    textAlign: 'center',
    marginTop: Spacing.two,
    opacity: 0.9,
  },
  lockRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: Spacing.two, opacity: 0.5 },
  lockText: { color: Brand.textFaint, fontSize: 9 },
  ctaWrap: { alignItems: 'center', gap: Spacing.two, marginTop: Spacing.three },
  ctaPill: {
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
    borderRadius: Radius.pill,
    shadowColor: Brand.primaryBrown,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  ctaText: { color: Brand.white, letterSpacing: 1.5 },
  ctaSub: { color: Brand.textSoft, opacity: 0.6, fontSize: 9 },
});
