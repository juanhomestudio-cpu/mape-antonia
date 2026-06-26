import { Fragment } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { Brand, Spacing, VoiceTokens, type Voice } from '@/constants/theme';
import { deriveLessonStatuses, type LessonProgress } from '@/services/progress';
import type { Lesson } from '@/services/content';

type Props = {
  lessons: Lesson[];
  currentId: string;
  progress: LessonProgress[];
  voice: Voice;
};

/**
 * Navegador inferior entre las clases del mundo actual. Sólo los nodos
 * (sin texto): "constelación" mínima de 8 puntos conectados con una
 * línea, cada uno con estado visual. Tap → router.replace a esa clase.
 */
export function LessonNavigator({ lessons, currentId, progress, voice }: Props) {
  const accent = VoiceTokens[voice].accent;
  const sorted = [...lessons].sort((a, b) => a.position - b.position);
  const statuses = deriveLessonStatuses(sorted, progress);

  return (
    <View style={styles.shell}>
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
                hitSlop={12}
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
    paddingTop: Spacing.four,
    paddingBottom: Spacing.four,
    shadowColor: Brand.primaryBrown,
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -8 },
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.two,
  },
  connector: { flex: 1, height: 1, marginHorizontal: 2 },
  dotWrap: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  halo: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    opacity: 0.18,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
});
