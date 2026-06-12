import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing, VoiceTokens, type Voice } from '@/constants/theme';

type Props = {
  voice: Voice;
  size?: 'sm' | 'md';
};

export function VoiceBadge({ voice, size = 'sm' }: Props) {
  const tokens = VoiceTokens[voice];
  const pad = size === 'sm' ? Spacing.one : Spacing.two;
  return (
    <View style={[styles.chip, { backgroundColor: tokens.soft, paddingHorizontal: pad * 2, paddingVertical: pad }]}>
      <View style={[styles.dot, { backgroundColor: tokens.accent }]} />
      <ThemedText style={[styles.label, { color: tokens.accent, fontSize: size === 'sm' ? 11 : 13 }]}>
        {tokens.label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontWeight: '600', letterSpacing: 0.3 },
});
