import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/Card';
import { Brand, Spacing, VoiceTokens, type Voice } from '@/constants/theme';

type Props = {
  archetypeName: string;
  voice: Voice;
  shortDescription?: string | null;
};

export function ArchetypeBadge({ archetypeName, voice, shortDescription }: Props) {
  const accent = VoiceTokens[voice].accent;
  return (
    <Card voice={voice} style={styles.card}>
      <ThemedText style={styles.eyebrow}>Tu lugar de partida</ThemedText>
      <ThemedText style={[styles.name, { color: accent }]}>
        Hoy llegas como {archetypeName.toLowerCase()}
      </ThemedText>
      {shortDescription && (
        <ThemedText style={styles.description}>{shortDescription}</ThemedText>
      )}
      <View style={styles.note}>
        <ThemedText style={styles.noteText}>
          Esto no te define. Es lo que la app reconoce de ti hoy.
        </ThemedText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
  eyebrow: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Brand.sageDark,
  },
  name: { fontSize: 20, lineHeight: 26, marginTop: 2 },
  description: { color: Brand.brownDark, fontSize: 14, lineHeight: 20 },
  note: { marginTop: Spacing.two },
  noteText: { color: Brand.sageDark, fontSize: 12, lineHeight: 18, fontStyle: 'italic' },
});
