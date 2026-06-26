import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { STREAK_THRESHOLDS } from '@/constants/config';
import { Brand, Fonts, Radius, Spacing } from '@/constants/theme';

type Props = {
  currentStreak: number;
  longestStreak: number;
};

function nextGoal(streak: number): number {
  return STREAK_THRESHOLDS.find((t) => t > streak) ?? streak;
}

function label(streak: number): string {
  if (streak >= 30) return 'Conectándote';
  if (streak >= 21) return 'Acompañando tu cuerpo';
  if (streak >= 7) return 'Habitándote';
  if (streak >= 3) return 'Escuchándote';
  return 'Empezando tu camino';
}

export function StreakCard({ currentStreak, longestStreak }: Props) {
  const goal = nextGoal(currentStreak);
  const ratio = goal > 0 ? Math.min(1, currentStreak / goal) : 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="caps" style={styles.eyebrow}>
          Racha actual
        </ThemedText>
        <ThemedText style={styles.value}>{currentStreak} días</ThemedText>
      </View>

      <View style={styles.progressRow}>
        <ThemedText style={styles.progressLabel}>{label(currentStreak)}</ThemedText>
        <ThemedText style={styles.progressGoal}>Meta: {goal} días</ThemedText>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${ratio * 100}%` }]} />
      </View>

      <ThemedText style={styles.quote}>
        "La constancia es la forma más pura de amor propio."
      </ThemedText>

      {longestStreak > currentStreak && (
        <ThemedText style={styles.longest}>
          Tu mayor racha: {longestStreak} días
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(245,242,237,0.6)',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(113,87,63,0.1)',
    padding: Spacing.five,
    gap: Spacing.three,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  eyebrow: { color: Brand.primaryBrown, opacity: 0.6 },
  value: { fontFamily: Fonts.serifBold, fontSize: 28, color: Brand.terracotta },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.two },
  progressLabel: { fontFamily: Fonts.sansSemiBold, fontSize: 12, color: Brand.textSoft },
  progressGoal: { fontFamily: Fonts.sans, fontSize: 12, color: Brand.textSoft },
  track: {
    height: 6,
    backgroundColor: Brand.sand,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: Brand.terracotta, borderRadius: 3 },
  quote: {
    fontFamily: Fonts.sans,
    fontStyle: 'italic',
    fontSize: 12,
    lineHeight: 18,
    color: Brand.textSoft,
    opacity: 0.75,
    marginTop: Spacing.two,
  },
  longest: { fontSize: 11, color: Brand.textSoft, opacity: 0.6 },
});
