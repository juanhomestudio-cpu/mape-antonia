import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/Button';
import { KeyboardScrollView } from '@/components/ui/KeyboardScrollView';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { VoiceBadge } from '@/components/ui/VoiceBadge';
import { ReflectionPrompt } from '@/components/lesson/ReflectionPrompt';
import { VimeoPlayer } from '@/components/lesson/VimeoPlayer';
import { VIDEO_COMPLETE_PCT } from '@/constants/config';
import { Brand, Spacing, VoiceTokens } from '@/constants/theme';
import { useLesson, useLessonsForWorld } from '@/hooks/use-content';
import {
  useLessonProgress,
  useStartLesson,
  useSubmitMicroResponse,
  useUpdateVideoProgress,
} from '@/hooks/use-lesson-progress';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: lesson, isLoading } = useLesson(id);
  const { data: progress } = useLessonProgress(id);
  const startMutation = useStartLesson();
  const updateProgressMutation = useUpdateVideoProgress();
  const submitMicro = useSubmitMicroResponse();

  const { data: siblings = [] } = useLessonsForWorld(lesson?.world_id);

  // Crear/recuperar lesson_progress al abrir.
  useEffect(() => {
    if (id) startMutation.mutate(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Throttle de updates al server (cada 3s) para no inundar.
  const lastUpdateRef = useRef(0);
  const [localPct, setLocalPct] = useState(0);

  const onVideoProgress = (pct: number) => {
    setLocalPct(pct);
    const now = Date.now();
    if (now - lastUpdateRef.current < 3000 && pct < VIDEO_COMPLETE_PCT) return;
    lastUpdateRef.current = now;
    if (id) updateProgressMutation.mutate({ lessonId: id, percent: pct });
  };

  const onVideoEnded = () => {
    if (id) updateProgressMutation.mutate({ lessonId: id, percent: 100 });
  };

  const requiredMicro = lesson?.micro_experiences.find((m) => m.is_required) ?? null;
  const videoDone =
    Math.max(progress?.video_progress_pct ?? 0, localPct) >= VIDEO_COMPLETE_PCT;
  const microDone = progress?.required_micro_done ?? false;
  const lessonCompleted = progress?.status === 'completed';

  const accent = lesson ? VoiceTokens[lesson.voice].accent : Brand.terracotta;

  const onSubmitReflection = (text: string) => {
    if (!requiredMicro || !id) return;
    submitMicro.mutate({
      microId: requiredMicro.id,
      lessonId: id,
      responseText: text,
      isRequired: true,
    });
  };

  // Próxima clase (la primera después de esta que no esté completada).
  const next = siblings
    .sort((a, b) => a.position - b.position)
    .find((l) => lesson && l.position > lesson.position);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardScrollView contentContainerStyle={styles.scroll}>
        <Pressable
          onPress={() =>
            lesson?.world ? router.replace({ pathname: '/world/[slug]', params: { slug: lesson.world.slug } }) : router.back()
          }
          style={styles.back}
          hitSlop={12}>
          <SymbolView name="chevron.left" tintColor={Brand.brownDark} size={22} />
          <ThemedText style={styles.backText}>
            {lesson?.world?.title ?? 'Volver'}
          </ThemedText>
        </Pressable>

        {isLoading || !lesson ? (
          <ThemedText style={{ color: Brand.sageDark }}>Cargando…</ThemedText>
        ) : (
          <>
            <ThemedText style={styles.eyebrow}>Clase {lesson.position}</ThemedText>
            <ThemedText type="title" style={[styles.title, { color: accent }]}>
              {lesson.title}
            </ThemedText>
            {lesson.subtitle && (
              <ThemedText style={styles.subtitle}>{lesson.subtitle}</ThemedText>
            )}
            <View style={styles.meta}>
              <VoiceBadge voice={lesson.voice} />
            </View>

            {lesson.vimeo_id ? (
              <View style={styles.playerWrap}>
                <VimeoPlayer
                  vimeoId={lesson.vimeo_id}
                  vimeoHash={lesson.vimeo_hash}
                  onProgress={onVideoProgress}
                  onEnded={onVideoEnded}
                  autoplay={false}
                />
              </View>
            ) : (
              <View style={styles.placeholder}>
                <ThemedText style={{ color: Brand.beigeLight }}>
                  Esta clase aún no tiene video.
                </ThemedText>
              </View>
            )}

            <View style={styles.progressWrap}>
              <ProgressBar
                value={Math.max(progress?.video_progress_pct ?? 0, localPct) / 100}
                color={accent}
              />
              <ThemedText style={styles.progressLabel}>
                {videoDone ? 'Video visto' : `${Math.round(Math.max(progress?.video_progress_pct ?? 0, localPct))}%`}
              </ThemedText>
            </View>

            {__DEV__ && !videoDone && (
              <Button
                label="DEV · Marcar video como visto"
                variant="ghost"
                onPress={() => {
                  setLocalPct(100);
                  if (id) updateProgressMutation.mutate({ lessonId: id, percent: 100 });
                }}
              />
            )}

            {requiredMicro && !microDone && videoDone && (
              <ReflectionPrompt
                micro={requiredMicro}
                submitting={submitMicro.isPending}
                onSubmit={onSubmitReflection}
              />
            )}

            {requiredMicro && !videoDone && (
              <View style={styles.helperBox}>
                <ThemedText style={styles.helperText}>
                  Cuando termines el video, te invitaremos a una reflexión breve antes de continuar.
                </ThemedText>
              </View>
            )}

            {lessonCompleted && (
              <View style={styles.footer}>
                <View style={styles.completedRow}>
                  <SymbolView name="checkmark.seal.fill" tintColor={accent} size={28} />
                  <ThemedText style={[styles.completedText, { color: accent }]}>
                    Clase completa
                  </ThemedText>
                </View>
                {next ? (
                  <Button
                    label="Continuar a la siguiente"
                    onPress={() =>
                      router.replace({ pathname: '/lesson/[id]', params: { id: next.id } })
                    }
                  />
                ) : (
                  <Button
                    label="Cerraste el Mundo 1"
                    variant="secondary"
                    onPress={() =>
                      lesson.world
                        ? router.replace({ pathname: '/world/[slug]', params: { slug: lesson.world.slug } })
                        : router.back()
                    }
                  />
                )}
              </View>
            )}
          </>
        )}
      </KeyboardScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone },
  scroll: { padding: Spacing.four, paddingBottom: Spacing.six },
  back: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, marginBottom: Spacing.three },
  backText: { color: Brand.brownDark, fontSize: 15 },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: Brand.sageDark,
    marginBottom: Spacing.two,
  },
  title: { marginBottom: Spacing.two, fontSize: 28, lineHeight: 34 },
  subtitle: { color: Brand.sageDark, fontSize: 15, lineHeight: 22, marginBottom: Spacing.three },
  meta: { flexDirection: 'row', marginBottom: Spacing.four },
  playerWrap: { marginBottom: Spacing.three },
  placeholder: {
    aspectRatio: 16 / 9,
    backgroundColor: Brand.brownDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    marginBottom: Spacing.three,
  },
  progressWrap: { gap: Spacing.one, marginBottom: Spacing.three },
  progressLabel: { fontSize: 12, color: Brand.sageDark },
  helperBox: {
    backgroundColor: Brand.beigeWarm,
    padding: Spacing.three,
    borderRadius: 14,
    marginTop: Spacing.three,
  },
  helperText: { color: Brand.sageDark, fontSize: 14, lineHeight: 20 },
  footer: { gap: Spacing.three, marginTop: Spacing.four },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    justifyContent: 'center',
  },
  completedText: { fontSize: 16, fontWeight: '600' },
});
