import { Pressable, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { LockBadge } from '@/components/ui/LockBadge';
import { Brand, Radius, Spacing, VoiceTokens } from '@/constants/theme';
import type { Lesson } from '@/services/content';

type Props = {
  lesson: Lesson;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  position: number;
};

export function LessonRow({ lesson, status, position }: Props) {
  const isLocked = status === 'locked';
  const accent = VoiceTokens[lesson.voice].accent;

  const body = (
    <View style={[styles.row, isLocked && styles.locked]}>
      <View style={styles.left}>
        <ThemedText style={styles.position}>{String(position).padStart(2, '0')}</ThemedText>
      </View>

      <View style={styles.center}>
        <ThemedText style={styles.title}>{lesson.title}</ThemedText>
        {lesson.subtitle && (
          <ThemedText style={styles.subtitle}>{lesson.subtitle}</ThemedText>
        )}
        <View style={styles.meta}>
          <View style={[styles.voiceDot, { backgroundColor: accent }]} />
          <ThemedText style={styles.metaText}>
            {VoiceTokens[lesson.voice].label}
          </ThemedText>
          {lesson.duration_seconds && (
            <ThemedText style={styles.metaText}>
              · {Math.round(lesson.duration_seconds / 60)} min
            </ThemedText>
          )}
        </View>
      </View>

      <View style={styles.right}>
        {status === 'completed' && (
          <SymbolView name="checkmark.circle.fill" tintColor={accent} size={26} />
        )}
        {status === 'in_progress' && (
          <SymbolView name="play.circle.fill" tintColor={accent} size={26} />
        )}
        {status === 'available' && (
          <SymbolView name="arrow.right.circle" tintColor={Brand.charcoal} size={26} />
        )}
        {isLocked && <LockBadge />}
      </View>
    </View>
  );

  if (isLocked) return body;
  return (
    <Link href={{ pathname: '/lesson/[id]', params: { id: lesson.id } }} asChild>
      <Pressable>{body}</Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    backgroundColor: Brand.surfaceLow,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Brand.sand,
    gap: Spacing.three,
  },
  locked: { opacity: 0.5 },
  left: { width: 32, alignItems: 'center' },
  center: { flex: 1, gap: 2 },
  right: { width: 36, alignItems: 'flex-end' },
  position: { fontSize: 13, color: Brand.textSoft, fontVariant: ['tabular-nums'] },
  title: { fontSize: 16, color: Brand.charcoal, fontWeight: '500' },
  subtitle: { fontSize: 13, color: Brand.textSoft },
  meta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, marginTop: Spacing.one },
  voiceDot: { width: 6, height: 6, borderRadius: 3 },
  metaText: { fontSize: 11, color: Brand.textSoft, textTransform: 'uppercase', letterSpacing: 0.6 },
});
