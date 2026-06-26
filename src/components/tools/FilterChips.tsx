import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, Radius, Spacing } from '@/constants/theme';

export type ChipOption<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: ChipOption<T>[];
  selected: T[];
  onToggle: (value: T) => void;
};

export function FilterChips<T extends string>({ options, selected, onToggle }: Props<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {options.map((opt) => {
        const isOn = selected.includes(opt.value);
        return (
          <Pressable
            key={opt.value}
            onPress={() => onToggle(opt.value)}
            style={({ pressed }) => [
              styles.chip,
              isOn && styles.chipOn,
              pressed && { opacity: 0.7 },
            ]}>
            <ThemedText style={[styles.label, isOn && styles.labelOn]}>{opt.label}</ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: Spacing.two, paddingVertical: Spacing.one },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Brand.sand,
    backgroundColor: 'transparent',
  },
  chipOn: { backgroundColor: Brand.terracotta, borderColor: Brand.terracotta },
  label: { fontSize: 13, color: Brand.charcoal },
  labelOn: { color: Brand.white, fontWeight: '500' },
});
