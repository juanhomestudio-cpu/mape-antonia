import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Brand, Spacing, VoiceTokens } from '@/constants/theme';
import { getArchetype } from '@/services/onboarding';

export default function ArchetypeScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: archetype, isLoading } = useQuery({
    queryKey: ['archetype', slug],
    queryFn: () => getArchetype(slug!),
    enabled: !!slug,
  });

  if (isLoading || !archetype) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ThemedText style={{ color: Brand.textSoft }}>Cargando…</ThemedText>
      </SafeAreaView>
    );
  }

  const accent = VoiceTokens[archetype.voice].accent;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.body}>
        <ThemedText style={styles.eyebrow}>Tu primer encuentro</ThemedText>
        <ThemedText type="title" style={[styles.title, { color: accent }]}>
          Hoy llegas como {archetype.name.toLowerCase()}
        </ThemedText>

        <Card voice={archetype.voice} style={styles.card}>
          <ThemedText style={styles.body1}>{archetype.short_description}</ThemedText>
          {archetype.long_description && (
            <ThemedText style={styles.body2}>{archetype.long_description}</ThemedText>
          )}
        </Card>

        <ThemedText style={styles.note}>
          Este nombre no te define. Es un punto de partida — algo que la app reconoce hoy de ti para
          acompañarte mejor. Volveremos a medirlo más adelante para ver cómo te vas habitando.
        </ThemedText>
      </View>

      <Button label="Continuar" onPress={() => router.push('/first-letter')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone, padding: Spacing.four },
  body: { flex: 1, justifyContent: 'center' },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: Brand.textSoft,
    marginBottom: Spacing.three,
  },
  title: { marginBottom: Spacing.four, fontSize: 28, lineHeight: 36 },
  card: { marginBottom: Spacing.four, gap: Spacing.three },
  body1: { color: Brand.charcoal, fontSize: 16, lineHeight: 24 },
  body2: { color: Brand.textSoft, fontSize: 15, lineHeight: 22 },
  note: { color: Brand.textSoft, fontSize: 14, lineHeight: 20, fontStyle: 'italic' },
});
