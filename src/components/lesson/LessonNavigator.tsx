import { Fragment } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Brand, Fonts, Radius, Spacing, VoiceTokens, type Voice } from '@/constants/theme';
import { deriveLessonStatuses, type LessonProgress } from '@/services/progress';
import type { Lesson } from '@/services/content';

type Props = {
  lessons: Lesson[];
  currentId: string;
  progress: LessonProgress[];
  voice: Voice;
};

/**
 * Navegador inferior entre las clases del mundo actual. Muestra una fila
 * de "constelación" — 8 nodos conectados con una línea fina, cada uno con
 * estado visual (completado / en curso / disponible / bloqueado).
 * Tap en un nodo no bloqueado → router.replace a esa clase.
 */
export function LessonNavigator({ lessons, currentId, progress, voice }: Props) {
  const accent = VoiceTokens[voice].accent;
  const sorted = [...lessons].sort((a, b) => a.position - b.position);
  const statuses = deriveLessonStatuses(sorted, progress);
  const currentIdx = sorted.findIndex((l) => l.id === currentId);
  const currentLesson = currentIdx >= 0 ? sorted[currentIdx] : null;

  return (
    <View style={styles.shell}>
      <View style={styles.header}>
        <ThemedText type="caps" style={styles.eyebrow}>
          Clase {currentIdx + 1} de {sorted.length}
        </ThemedText>
        {currentLesson && (
          <ThemedText style={styles.lessonTitle} numberOfLines={1}>
            "{currentLesson.title}"
          </ThemedText>
        )}
      </View>

      <View style={styles.row}>
        {statuses.map((s, i) => {
          const isCurrent = s.id === currentId;
          const tappable = s.derivedStatus !== 'locked' && !isCurrent;
          const isCompleted = s.derivedStatus === 'completed';
          const isLocked = s.derivedStatus === 'locked';

          return (
            <Fragment key={s.id}>
              {i > 0 && (
                <View
                  style={[
                    styles.connector,
                    {
                      backgroundColor:
                        isCompleted || statuses[i - 1]?.derivedStatus === 'completed'
                          ? accent
                          : Brand.outline,
                      opacity:
                        isCompleted || statuses[i - 1]?.derivedStatus === 'completed' ? 0.5 : 0.25,
                    },
                  ]}
                />
              )}
              <Pressable
                onPress={() =>
                  tappable &&
                  router.replace({ pathname: '/lesson/[id]', params: { id: s.id } })
                }
                hitSlop={8}
                style={({ pressed }) => [
                  styles.dotWrap,
                  pressed && tappable && { opacity: 0.6 },
                ]}>
                {isCurrent && (
                  <View style={[styles.halo, { backgroundColor: accent }]} />
                )}
                <View
                  style={[
                    styles.dot,
                    isCompleted && { backgroundColor: accent, borderColor: accent },
                    isCurrent && {
                      backgroundColor: accent,
                      borderColor: accent,
                      transform: [{ scale: 1.3 }],
                    },
                    s.derivedStatus === 'available' && {
                      borderColor: accent,
                      backgroundColor: 'transparent',
                    },
                    isLocked && { borderColor: Brand.outline, backgroundColor: 'transparent' },
                  ]}
                />
              </Pressable>
            </Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: 'rgba(253,252,249,0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(113,87,63,0.08)',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
    gap: Spacing.three,
    // Sutil blur fake con sombra hacia arriba
    shadowColor: Brand.primaryBrown,
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -8 },
    elevation: 8,
  },
  header: { gap: 4, alignItems: 'center' },
  eyebrow: { color: Brand.primaryBrown, opacity: 0.6, letterSpacing: 2 },
  lessonTitle: {
    fontFamily: Fonts.sans,
    fontStyle: 'italic',
    fontSize: 13,
    color: Brand.textSoft,
    maxWidth: 280,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.two,
  },
  connector: { flex: 1, height: 1, marginHorizontal: 2 },
  dotWrap: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  halo: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.18,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
});
