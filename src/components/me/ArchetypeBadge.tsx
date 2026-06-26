import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, Fonts, Radius, Spacing, VoiceTokens, type Voice } from '@/constants/theme';

type Props = {
  archetypeName: string;
  voice: Voice;
  shortDescription?: string | null;
  longDescription?: string | null;
};

export function ArchetypeBadge({
  archetypeName,
  voice,
  shortDescription,
  longDescription,
}: Props) {
  const accent = VoiceTokens[voice].accent;
  return (
    <View style={styles.card}>
      <ThemedText type="caps" style={styles.eyebrow}>
        Arquetipo actual
      </ThemedText>
      <ThemedText style={[styles.name]}>{archetypeName}</ThemedText>
      {(longDescription || shortDescription) && (
        <ThemedText style={styles.description}>
          {longDescription ?? shortDescription}
        </ThemedText>
      )}
      <View style={styles.note}>
        <View style={[styles.dot, { backgroundColor: accent }]} />
        <ThemedText type="caps" style={[styles.noteText, { color: accent }]}>
          {VoiceTokens[voice].label}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    padding: Spacing.five,
    gap: Spacing.three,
    shadowColor: Brand.primaryBrown,
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  eyebrow: { color: Brand.primaryBrown, opacity: 0.6 },
  name: {
    fontFamily: Fonts.serif,
    fontSize: 26,
    lineHeight: 32,
    color: Brand.charcoal,
  },
  description: { color: Brand.textSoft, fontSize: 15, lineHeight: 24 },
  note: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginTop: Spacing.two },
  dot: { width: 6, height: 6, borderRadius: 3 },
  noteText: { letterSpacing: 1.5 },
});
