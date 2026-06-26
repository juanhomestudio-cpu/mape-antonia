import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, Radius, Spacing, VoiceTokens } from '@/constants/theme';
import type { ReflectionMemory } from '@/services/memories';

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('es', { day: 'numeric', month: 'short' });
}

export function ReflectionsList({ items }: { items: ReflectionMemory[] }) {
  return (
    <View style={styles.wrap}>
      <ThemedText style={styles.eyebrow}>Tus reflexiones</ThemedText>
      {items.length === 0 ? (
        <ThemedText style={styles.empty}>
          Tus reflexiones aparecerán aquí. Cuanto más avances, más quedará guardado de ti.
        </ThemedText>
      ) : (
        <View style={styles.list}>
          {items.map((r) => {
            const accent = VoiceTokens[r.voice].accent;
            return (
              <View key={r.id} style={[styles.card, { borderLeftColor: accent }]}>
                <ThemedText style={styles.date}>
                  {formatDate(r.created_at)}
                  {r.lesson_title ? ` · ${r.lesson_title}` : ''}
                </ThemedText>
                {r.prompt && <ThemedText style={styles.prompt}>{r.prompt}</ThemedText>}
                {r.response_text && (
                  <ThemedText style={styles.response}>{r.response_text}</ThemedText>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 11,
    color: Brand.textSoft,
  },
  list: { gap: Spacing.two },
  card: {
    backgroundColor: Brand.surfaceLow,
    borderRadius: Radius.md,
    borderLeftWidth: 3,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  date: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: Brand.textSoft,
  },
  prompt: { color: Brand.charcoal, fontSize: 13, lineHeight: 18, fontStyle: 'italic' },
  response: { color: Brand.charcoal, fontSize: 15, lineHeight: 22, marginTop: Spacing.one },
  empty: { color: Brand.textSoft, fontSize: 13, lineHeight: 20 },
});
