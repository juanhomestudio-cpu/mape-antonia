import { StyleSheet, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { Brand, Fonts, Radius, Spacing, VoiceTokens } from '@/constants/theme';
import type { UserReward } from '@/services/rewards';

type Props = {
  earned: UserReward[];
};

const BADGE_LABELS: Record<string, string> = {
  'badge-3-dias': 'Empecé a escucharme',
  'badge-7-dias': 'Aprendí a regularme',
  'badge-21-dias': 'Habitando mi cuerpo',
  'badge-30-dias': 'Paz profunda',
};

const ALL_BADGES = ['badge-3-dias', 'badge-7-dias', 'badge-21-dias', 'badge-30-dias'];

export function BadgesGrid({ earned }: Props) {
  const earnedSlugs = new Set(earned.map((r) => r.reward?.slug ?? ''));

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.title}>Insignias</ThemedText>
        <ThemedText type="caps" style={styles.count}>
          {earned.length} de {ALL_BADGES.length}
        </ThemedText>
      </View>

      <View style={styles.grid}>
        {ALL_BADGES.map((slug, idx) => {
          const isEarned = earnedSlugs.has(slug);
          const reward = earned.find((r) => r.reward?.slug === slug)?.reward;
          const voice = reward?.voice ?? (idx % 2 === 0 ? 'antonia' : 'mape');
          const accent = VoiceTokens[voice].accent;
          const iconName = idx === 0 ? 'ear' : idx === 1 ? 'wind' : idx === 2 ? 'heart.fill' : 'moon.stars.fill';
          return (
            <View
              key={slug}
              style={[styles.tile, !isEarned && styles.tileLocked]}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: isEarned ? Brand.white : Brand.surfaceMid },
                ]}>
                <SymbolView
                  name={iconName as any}
                  tintColor={isEarned ? accent : Brand.outline}
                  size={20}
                />
              </View>
              <ThemedText
                style={[styles.tileLabel, !isEarned && { opacity: 0.5 }]}
                numberOfLines={2}>
                {reward?.title ?? BADGE_LABELS[slug] ?? 'Próximamente'}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.three },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontFamily: Fonts.serif, fontSize: 24, lineHeight: 30, color: Brand.charcoal },
  count: { color: Brand.primaryBrown, opacity: 0.6 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  tile: {
    width: '48%',
    backgroundColor: Brand.sand,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    alignItems: 'center',
    gap: Spacing.two,
  },
  tileLocked: { opacity: 0.5 },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Brand.primaryBrown,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  tileLabel: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 13,
    color: Brand.charcoal,
    textAlign: 'center',
    lineHeight: 18,
  },
});
