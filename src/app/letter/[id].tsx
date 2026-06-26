import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/Card';
import { Brand, Spacing } from '@/constants/theme';
import { useLetter } from '@/hooks/use-letters';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function LetterReadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: letter, isLoading } = useLetter(id);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()} style={styles.back} hitSlop={12}>
          <SymbolView name="chevron.left" tintColor={Brand.charcoal} size={22} />
          <ThemedText style={styles.backText}>Volver</ThemedText>
        </Pressable>

        {isLoading || !letter ? (
          <ThemedText style={{ color: Brand.textSoft }}>Cargando…</ThemedText>
        ) : (
          <>
            <ThemedText style={styles.eyebrow}>Carta a tu futura yo</ThemedText>
            {letter.title && (
              <ThemedText type="title" style={styles.title}>
                {letter.title}
              </ThemedText>
            )}

            <Card style={styles.bodyCard}>
              <ThemedText style={styles.body}>{letter.body}</ThemedText>
            </Card>

            <View style={styles.meta}>
              <View style={styles.metaRow}>
                <ThemedText style={styles.metaLabel}>Escrita</ThemedText>
                <ThemedText style={styles.metaValue}>{formatDate(letter.created_at)}</ThemedText>
              </View>
              {letter.delivered_at && (
                <View style={styles.metaRow}>
                  <ThemedText style={styles.metaLabel}>Entregada</ThemedText>
                  <ThemedText style={styles.metaValue}>
                    {formatDate(letter.delivered_at)}
                  </ThemedText>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone },
  scroll: { padding: Spacing.four, paddingBottom: Spacing.six },
  back: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, marginBottom: Spacing.three },
  backText: { color: Brand.charcoal, fontSize: 15 },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: Brand.textSoft,
    marginBottom: Spacing.two,
  },
  title: { color: Brand.charcoal, marginBottom: Spacing.four, fontSize: 24, lineHeight: 30 },
  bodyCard: { marginBottom: Spacing.four },
  body: { color: Brand.charcoal, fontSize: 17, lineHeight: 26 },
  meta: { gap: Spacing.two, paddingTop: Spacing.three, borderTopWidth: 1, borderTopColor: Brand.sand },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metaLabel: { color: Brand.textSoft, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  metaValue: { color: Brand.charcoal, fontSize: 14 },
});
