import { Pressable, StyleSheet, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { MOOD_OPTIONS, type MoodValue } from '@/constants/config';
import { Brand, Spacing } from '@/constants/theme';
import { useTodayMood, useUpsertTodayMood } from '@/hooks/use-today-mood';

export function MoodCheckIn() {
  const { data: today, isLoading } = useTodayMood();
  const upsert = useUpsertTodayMood();

  const onSelect = (mood: MoodValue) => {
    Haptics.selectionAsync().catch(() => {});
    upsert.mutate({ mood });
  };

  if (isLoading) return null;

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <ThemedText type="caps" style={styles.eyebrow}>
          {today ? 'Hoy te sientes' : '¿Cómo te sientes?'}
        </ThemedText>
        <View style={styles.divider} />
      </View>

      <View style={styles.row}>
        {MOOD_OPTIONS.map((opt) => {
          const isSelected = today?.mood === opt.value;
          const isOther = !!today && !isSelected;
          return (
            <Pressable
              key={opt.value}
              onPress={() => !today && onSelect(opt.value as MoodValue)}
              style={({ pressed }) => [styles.option, pressed && !today && { transform: [{ scale: 0.95 }] }]}>
              <SymbolView
                name={opt.sfSymbol as any}
                tintColor={isSelected ? opt.tint : isOther ? Brand.outline : Brand.textFaint}
                size={28}
                resizeMode="scaleAspectFit"
              />
              <ThemedText
                style={[
                  styles.label,
                  isSelected && { opacity: 1, color: opt.tint, fontWeight: '600' },
                  isOther && { opacity: 0.4 },
                ]}>
                {opt.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: Spacing.six, width: '100%' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, marginBottom: Spacing.four, paddingHorizontal: Spacing.two },
  eyebrow: { color: Brand.primaryBrown, opacity: 0.5 },
  divider: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Brand.primaryBrown, opacity: 0.15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.two },
  option: { alignItems: 'center', gap: Spacing.two, flex: 1 },
  label: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: Brand.primaryBrown,
    opacity: 0.5,
    textAlign: 'center',
  },
});
