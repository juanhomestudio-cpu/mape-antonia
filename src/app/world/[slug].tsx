import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { LessonRow } from '@/components/path/LessonRow';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { VoiceBadge } from '@/components/ui/VoiceBadge';
import { Brand, Spacing, VoiceTokens } from '@/constants/theme';
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
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()} style={styles.back} hitSlop={12}>
          <SymbolView name="chevron.left" tintColor={Brand.brownDark} size={22} />
          <ThemedText style={styles.backText}>Mi camino</ThemedText>
        </Pressable>

        {worldLoading || !world ? (
          <ThemedText style={{ color: Brand.sageDark }}>Cargando…</ThemedText>
        ) : (
          <>
            <ThemedText style={styles.eyebrow}>Mundo {world.position}</ThemedText>
            <ThemedText type="title" style={[styles.title, { color: accent }]}>
              {world.title}
            </ThemedText>
            {world.subtitle && <ThemedText style={styles.subtitle}>{world.subtitle}</ThemedText>}
            <View style={styles.headerMeta}>
              <VoiceBadge voice={world.voice} size="md" />
            </View>

            <View style={styles.progressWrap}>
              <ProgressBar value={pct} color={accent} />
              <ThemedText style={styles.progressLabel}>
                {completed} de {lessons.length} clases
              </ThemedText>
            </View>

            <ThemedText style={styles.sectionTitle}>Las clases</ThemedText>
            <View style={styles.list}>
              {lessonsLoading ? (
                <ThemedText style={{ color: Brand.sageDark }}>Cargando…</ThemedText>
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone },
  scroll: { padding: Spacing.four, paddingBottom: Spacing.six },
  back: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, marginBottom: Spacing.four },
  backText: { color: Brand.brownDark, fontSize: 15 },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: Brand.sageDark,
    marginBottom: Spacing.two,
  },
  title: { marginBottom: Spacing.two, fontSize: 30, lineHeight: 36 },
  subtitle: { color: Brand.sageDark, lineHeight: 22, fontSize: 15, marginBottom: Spacing.three },
  headerMeta: { flexDirection: 'row', marginBottom: Spacing.four },
  progressWrap: { gap: Spacing.one, marginBottom: Spacing.five },
  progressLabel: { fontSize: 12, color: Brand.sageDark },
  sectionTitle: {
    fontSize: 13,
    color: Brand.sageDark,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: Spacing.three,
  },
  list: { gap: Spacing.two },
});
