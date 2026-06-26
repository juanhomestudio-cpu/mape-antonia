import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/Button';
import { KeyboardScrollView } from '@/components/ui/KeyboardScrollView';
import { LessonNavigator } from '@/components/lesson/LessonNavigator';
import { ReflectionPrompt } from '@/components/lesson/ReflectionPrompt';
import { VimeoPlayer } from '@/components/lesson/VimeoPlayer';
import { SanctuaryBackground } from '@/components/home/SanctuaryBackground';
import { VIDEO_COMPLETE_PCT } from '@/constants/config';
import { Brand, Fonts, Radius, Spacing, VoiceTokens } from '@/constants/theme';
import { useLesson, useLessonsForWorld } from '@/hooks/use-content';
import {
  useLessonProgress,
  useStartLesson,
  useSubmitMicroResponse,
  useUpdateVideoProgress,
  useWorldProgress,
} from '@/hooks/use-lesson-progress';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: lesson, isLoading } = useLesson(id);
  const { data: progress } = useLessonProgress(id);
  const startMutation = useStartLesson();
  const updateProgressMutation = useUpdateVideoProgress();
  const submitMicro = useSubmitMicroResponse();
  const { data: siblings = [] } = useLessonsForWorld(lesson?.world_id);
  const { data: worldProgress = [] } = useWorldProgress(lesson?.world_id);

  useEffect(() => {
    if (id) startMutation.mutate(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
  const videoDone = Math.max(progress?.video_progress_pct ?? 0, localPct) >= VIDEO_COMPLETE_PCT;
  const microDone = progress?.required_micro_done ?? false;
  const lessonCompleted = progress?.status === 'completed';
  const accent = lesson ? VoiceTokens[lesson.voice].accent : Brand.terracotta;
  const voiceLabel =
    lesson?.voice === 'antonia'
      ? 'con Antonia Cardona'
      : lesson?.voice === 'mape'
        ? 'con Mape'
        : 'A dos voces';
  const durationMin = lesson?.duration_seconds ? Math.round(lesson.duration_seconds / 60) : null;

  const onSubmitReflection = (text: string) => {
    if (!requiredMicro || !id) return;
    submitMicro.mutate({
      microId: requiredMicro.id,
      lessonId: id,
      responseText: text,
      isRequired: true,
    });
  };

  const next = siblings
    .sort((a, b) => a.position - b.position)
    .find((l) => lesson && l.position > lesson.position);

  const goBackToWorld = () => {
    if (lesson?.world) {
      router.replace({ pathname: '/world/[slug]', params: { slug: lesson.world.slug } });
    } else {
      router.back();
    }
  };

  // Detección de dirección para animación: si avanzamos a una clase con
  // position mayor → slide hacia la izquierda (entra desde la derecha).
  // Si retrocedemos → slide hacia la derecha (entra desde la izquierda).
  const prevPositionRef = useRef<number | null>(null);
  const direction: 'forward' | 'backward' = useMemo(() => {
    const prev = prevPositionRef.current;
    const curr = lesson?.position ?? null;
    if (prev === null || curr === null || curr === prev) return 'forward';
    return curr > prev ? 'forward' : 'backward';
  }, [lesson?.position]);

  useEffect(() => {
    if (lesson?.position !== undefined) prevPositionRef.current = lesson.position;
  }, [lesson?.position]);

  const enterAnim =
    direction === 'forward'
      ? SlideInRight.duration(280).springify().damping(18)
      : SlideInLeft.duration(280).springify().damping(18);
  const exitAnim =
    direction === 'forward' ? SlideOutLeft.duration(180) : SlideOutRight.duration(180);

  return (
    <View style={styles.container}>
      <SanctuaryBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* Header — solo título centrado y botón cerrar a la derecha */}
        <View style={styles.header}>
          <View style={styles.headerSide} />
          <ThemedText style={styles.brandTitle}>SANTUARIO</ThemedText>
          <Pressable
            onPress={goBackToWorld}
            hitSlop={12}
            style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}>
            <SymbolView name="xmark" tintColor={Brand.primaryBrown} size={22} />
          </Pressable>
        </View>

        <View style={styles.animatedShell}>
        <Animated.View
          key={id}
          entering={enterAnim}
          exiting={exitAnim}
          style={styles.animatedInner}>
        <KeyboardScrollView contentContainerStyle={styles.scroll}>
          {isLoading || !lesson ? (
            <ThemedText style={{ color: Brand.textSoft }}>Cargando…</ThemedText>
          ) : (
            <>
              {/* Architectural title */}
              <View style={styles.titleFrame}>
                <ThemedText type="caps" style={[styles.titleEyebrow, { color: accent }]}>
                  {lesson.world?.title ? `Mundo 1: ${lesson.world.title}` : `Clase ${lesson.position}`}
                </ThemedText>
                <ThemedText style={styles.titleHeadline}>{lesson.title}</ThemedText>
                <View style={styles.titleMetaRow}>
                  <ThemedText style={styles.titleMeta}>{voiceLabel}</ThemedText>
                  {durationMin && (
                    <>
                      <View style={styles.metaDot} />
                      <ThemedText style={styles.titleMeta}>{durationMin} min</ThemedText>
                    </>
                  )}
                </View>
              </View>

              {/* Player */}
              <View style={styles.playerWrap}>
                {lesson.vimeo_id ? (
                  <VimeoPlayer
                    vimeoId={lesson.vimeo_id}
                    vimeoHash={lesson.vimeo_hash}
                    onProgress={onVideoProgress}
                    onEnded={onVideoEnded}
                    autoplay={false}
                  />
                ) : (
                  <View style={styles.placeholder}>
                    <ThemedText style={{ color: Brand.surfaceMid }}>
                      Esta clase aún no tiene video.
                    </ThemedText>
                  </View>
                )}
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.max(progress?.video_progress_pct ?? 0, localPct)}%`,
                        backgroundColor: accent,
                      },
                    ]}
                  />
                </View>
              </View>

              {__DEV__ && !videoDone && (
                <View style={styles.devRow}>
                  <Button
                    label="DEV · Marcar visto"
                    variant="ghost"
                    onPress={() => {
                      setLocalPct(100);
                      if (id) updateProgressMutation.mutate({ lessonId: id, percent: 100 });
                    }}
                  />
                </View>
              )}

              {/* Reflexión */}
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

              {/* Cierre */}
              {lessonCompleted && (
                <View style={styles.completedBlock}>
                  <View style={styles.completedRow}>
                    <SymbolView name="checkmark.seal.fill" tintColor={accent} size={28} />
                    <ThemedText style={[styles.completedText, { color: accent }]}>
                      Clase completa
                    </ThemedText>
                  </View>
                  {next ? (
                    <Button
                      label="Continuar a la siguiente"
                      onPress={() => router.replace({ pathname: '/lesson/[id]', params: { id: next.id } })}
                    />
                  ) : (
                    <Button
                      label="Cerraste el Mundo 1"
                      variant="secondary"
                      onPress={goBackToWorld}
                    />
                  )}
                </View>
              )}
            </>
          )}
        </KeyboardScrollView>
        </Animated.View>
        </View>

        {/* Navegador inferior entre clases — fuera del wrapper animado para
            que sólo el contenido transicione y la barra inferior se mantenga estable */}
        {lesson && siblings.length > 0 && id && (
          <LessonNavigator
            lessons={siblings}
            currentId={id}
            progress={worldProgress}
            voice={lesson.voice}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
  },
  headerSide: { width: 36 },
  closeBtn: { width: 36, alignItems: 'flex-end' },
  brandTitle: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 13,
    color: Brand.primaryBrown,
    letterSpacing: 4,
  },
  animatedShell: { flex: 1, overflow: 'hidden' },
  animatedInner: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.four, paddingBottom: Spacing.five },
  titleFrame: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    backgroundColor: 'rgba(253,252,249,0.45)',
    borderRadius: Radius.xl,
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.five,
  },
  titleEyebrow: { letterSpacing: 2.4 },
  titleHeadline: {
    fontFamily: Fonts.serifBold,
    fontSize: 36,
    lineHeight: 42,
    color: Brand.primaryBrown,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  titleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  titleMeta: {
    fontFamily: Fonts.sans,
    fontStyle: 'italic',
    fontSize: 14,
    color: Brand.textSoft,
    opacity: 0.7,
  },
  metaDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Brand.outline },
  playerWrap: { marginBottom: Spacing.three },
  placeholder: {
    aspectRatio: 16 / 9,
    backgroundColor: Brand.primaryBrown,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 2,
    backgroundColor: 'rgba(113,87,63,0.15)',
    marginTop: Spacing.two,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 1 },
  devRow: { alignItems: 'center', marginBottom: Spacing.three },
  helperBox: {
    backgroundColor: 'rgba(245,242,237,0.5)',
    padding: Spacing.four,
    borderRadius: Radius.lg,
    marginTop: Spacing.three,
  },
  helperText: {
    fontFamily: Fonts.sans,
    fontStyle: 'italic',
    fontSize: 14,
    lineHeight: 22,
    color: Brand.textSoft,
    textAlign: 'center',
  },
  completedBlock: { gap: Spacing.four, marginTop: Spacing.five },
  completedRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, justifyContent: 'center' },
  completedText: { fontFamily: Fonts.sansSemiBold, fontSize: 16 },
});
