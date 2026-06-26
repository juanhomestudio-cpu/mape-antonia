import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { LessonRow } from '@/components/path/LessonRow';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { VoiceBadge } from '@/components/ui/VoiceBadge';
import { SanctuaryBackground } from '@/components/home/SanctuaryBackground';
import { Brand, Fonts, Spacing, VoiceTokens } from '@/constants/theme';
import { useLessonsForWorld, useWorld } from '@/hooks/use-content';
import { useWorldProgress } from '@/hooks/use-lesson-progress';
import { deriveLessonStatuses } from '@/services/progress';

export default function WorldScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: world, isLoading: worldLoading } = useWorld(slug);
  const { data: lessons = [], isLoading: lessonsLoading } = useLessonsForWorld(world?.id);
  const { data: progress = [] } = useWorldProgress(world?.id);

  const statuses = deriveLessonStatuses(lessons, progress);
  const completed = statuses.filter((s) => s.derivedStatus === 'completed').length;
  const pct = lessons.length > 0 ? completed / lessons.length : 0;
  const accent = world ? VoiceTokens[world.voice].accent : Brand.terracotta;

  return (
    <View style={styles.container}>
      <SanctuaryBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* Header fijo arriba — chevron a la izquierda, SANTUARIO centrado, spacer a la derecha */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.replace('/path')}
            hitSlop={16}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}>
            <SymbolView name="chevron.left" tintColor={Brand.charcoal} size={24} />
          </Pressable>
          <ThemedText style={styles.brandTitle}>SANTUARIO</ThemedText>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {worldLoading || !world ? (
            <ThemedText style={{ color: Brand.textSoft }}>Cargando…</ThemedText>
          ) : (
            <>
              <ThemedText type="caps" style={[styles.eyebrow, { color: accent }]}>
                Mundo {world.position}
              </ThemedText>
              <ThemedText style={[styles.title, { color: accent }]}>
                {world.title}
              </ThemedText>
              {world.subtitle && (
                <ThemedText style={styles.subtitle}>"{world.subtitle}"</ThemedText>
              )}
              <View style={styles.headerMeta}>
                <VoiceBadge voice={world.voice} size="md" />
              </View>

              <View style={styles.progressWrap}>
                <ProgressBar value={pct} color={accent} />
                <ThemedText style={styles.progressLabel}>
                  {completed} de {lessons.length} clases
                </ThemedText>
              </View>

              <ThemedText type="caps" style={styles.sectionTitle}>
                Las clases
              </ThemedText>
              <View style={styles.list}>
                {lessonsLoading ? (
                  <ThemedText style={{ color: Brand.textSoft }}>Cargando…</ThemedText>
                ) : (
                  statuses.map((s) => {
                    const lesson = lessons.find((l) => l.id === s.id)!;
                    return (
                      <LessonRow
                        key={s.id}
                        lesson={lesson}
                        status={s.derivedStatus}
                        position={s.position}
                      />
                    );
                  })
                )}
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
    minHeight: 44,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerSpacer: { width: 36 },
  brandTitle: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 13,
    color: Brand.primaryBrown,
    letterSpacing: 4,
  },
  scroll: { padding: Spacing.four, paddingTop: Spacing.three, paddingBottom: Spacing.six },
  eyebrow: { letterSpacing: 2.4, marginBottom: Spacing.two },
  title: {
    fontFamily: Fonts.serifBold,
    fontSize: 32,
    lineHeight: 38,
    marginBottom: Spacing.two,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontStyle: 'italic',
    color: Brand.textSoft,
    lineHeight: 24,
    fontSize: 15,
    marginBottom: Spacing.three,
  },
  headerMeta: { flexDirection: 'row', marginBottom: Spacing.four },
  progressWrap: { gap: Spacing.one, marginBottom: Spacing.five },
  progressLabel: { fontSize: 12, color: Brand.textSoft },
  sectionTitle: {
    color: Brand.textSoft,
    letterSpacing: 1.5,
    marginBottom: Spacing.three,
  },
  list: { gap: Spacing.two },
});
