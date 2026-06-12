import { Pressable, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { Brand, Radius, Spacing, VoiceTokens } from '@/constants/theme';
import { useNextLesson } from '@/hooks/use-next-lesson';

export function ContinueCard() {
  const { data: lesson, isLoading } = useNextLesson();

  if (isLoading) return null;

  if (!lesson) {
    return (
      <View style={[styles.card, { backgroundColor: Brand.beigeWarm, borderColor: Brand.sand }]}>
        <ThemedText style={styles.eyebrow}>Tu camino</ThemedText>
        <ThemedText style={styles.title}>Cerraste el Mundo 1</ThemedText>
        <ThemedText style={styles.subtitle}>
          Espera el Mundo 2 — se abre cuando esté disponible.
        </ThemedText>
      </View>
    );
  }

  const accent = VoiceTokens[lesson.voice].accent;

  return (
    <Link href={{ pathname: '/lesson/[id]', params: { id: lesson.id } }} asChild>
      <Pressable>
        <View style={[styles.card, { backgroundColor: accent }]}>
          <ThemedText style={[styles.eyebrow, styles.eyebrowOnAccent]}>Continuar mi camino</ThemedText>
          <ThemedText style={[styles.title, { color: Brand.white }]}>
            {lesson.title}
          </ThemedText>
          {lesson.subtitle && (
            <ThemedText style={[styles.subtitle, { color: Brand.beigeLight }]}>
              {lesson.subtitle}
            </ThemedText>
          )}
          <View style={styles.footer}>
            <ThemedText style={[styles.meta, { color: Brand.beigeLight }]}>
              Clase {lesson.position}
              {lesson.duration_seconds ? ` · ${Math.round(lesson.duration_seconds / 60)} min` : ''}
            </ThemedText>
            <SymbolView name="arrow.right.circle.fill" tintColor={Brand.white} size={28} />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
    padding: Spacing.four,
    gap: Spacing.two,
    shadowColor: Brand.brownDark,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  eyebrow: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Brand.sageDark,
  },
  eyebrowOnAccent: { color: Brand.beigeLight, opacity: 0.9 },
  title: { color: Brand.brownDark, fontSize: 22, lineHeight: 28 },
  subtitle: { color: Brand.sageDark, fontSize: 14, lineHeight: 20 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  meta: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
});
