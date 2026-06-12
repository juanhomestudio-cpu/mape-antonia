import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/Card';
import { MOOD_OPTIONS, type MoodValue } from '@/constants/config';
import { Brand, Radius, Spacing } from '@/constants/theme';
import { useTodayMood, useUpsertTodayMood } from '@/hooks/use-today-mood';

export function MoodCheckIn() {
  const { data: today, isLoading } = useTodayMood();
  const upsert = useUpsertTodayMood();

  const onSelect = (mood: MoodValue) => {
    upsert.mutate({ mood });
  };

  if (isLoading) return null;

  if (today) {
    const opt = MOOD_OPTIONS.find((o) => o.value === today.mood);
    return (
      <Card style={styles.summary}>
        <View style={styles.summaryRow}>
          <ThemedText style={styles.summaryEmoji}>{opt?.emoji}</ThemedText>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.summaryLabel}>Hoy te sientes</ThemedText>
            <ThemedText style={styles.summaryValue}>{opt?.label}</ThemedText>
          </View>
        </View>
      </Card>
    );
  }

  return (
    <Card style={styles.wrap}>
      <ThemedText style={styles.title}>¿Cómo amaneciste hoy?</ThemedText>
      <View style={styles.options}>
        {MOOD_OPTIONS.map((opt) => (
          <Pressable
            key={opt.value}
            onPress={() => onSelect(opt.value as MoodValue)}
            style={({ pressed }) => [styles.option, pressed && { opacity: 0.6 }]}>
            <ThemedText style={styles.emoji}>{opt.emoji}</ThemedText>
            <ThemedText style={styles.optionLabel}>{opt.label}</ThemedText>
          </Pressable>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  title: { color: Brand.brownDark, fontSize: 17, lineHeight: 22 },
  options: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.one },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
    backgroundColor: Brand.beigeWarm,
    borderRadius: Radius.md,
    gap: 4,
  },
  emoji: { fontSize: 24 },
  optionLabel: { fontSize: 10, color: Brand.sageDark, textAlign: 'center' },
  summary: { backgroundColor: Brand.beigeWarm },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  summaryEmoji: { fontSize: 32 },
  summaryLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Brand.sageDark,
  },
  summaryValue: { fontSize: 18, color: Brand.brownDark, marginTop: 2 },
});
