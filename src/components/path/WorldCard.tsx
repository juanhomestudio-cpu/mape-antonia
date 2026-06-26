import { Pressable, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { LockBadge } from '@/components/ui/LockBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { VoiceBadge } from '@/components/ui/VoiceBadge';
import { Brand, Radius, Spacing, VoiceTokens } from '@/constants/theme';
import type { World } from '@/services/content';

type Props = {
  world: World;
  isLocked: boolean;
  progress?: { completed: number; total: number };
};

export function WorldCard({ world, isLocked, progress }: Props) {
  const accent = VoiceTokens[world.voice].accent;
  const pct = progress && progress.total > 0 ? progress.completed / progress.total : 0;

  const inner = (
    <View
      style={[
        styles.card,
        { borderColor: isLocked ? Brand.sand : accent },
        isLocked && styles.locked,
      ]}>
      <View style={styles.header}>
        <ThemedText style={styles.position}>Mundo {world.position}</ThemedText>
        {isLocked && <LockBadge size={28} />}
      </View>
      <ThemedText type="title" style={[styles.title, isLocked && styles.lockedText]}>
        {world.title}
      </ThemedText>
      {world.subtitle && (
        <ThemedText style={[styles.subtitle, isLocked && styles.lockedText]}>
          {world.subtitle}
        </ThemedText>
      )}
      <View style={styles.footer}>
        <VoiceBadge voice={world.voice} />
        {!isLocked && progress && progress.total > 0 && (
          <View style={styles.progressWrap}>
            <ProgressBar value={pct} color={accent} />
            <ThemedText style={styles.progressLabel}>
              {progress.completed} / {progress.total} clases
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );

  if (isLocked) return inner;
  return (
    <Link href={{ pathname: '/world/[slug]', params: { slug: world.slug } }} asChild>
      <Pressable>{inner}</Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Brand.surfaceLow,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
    shadowColor: Brand.charcoal,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  locked: { opacity: 0.55 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  position: {
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 11,
    color: Brand.textSoft,
  },
  title: { color: Brand.charcoal, fontSize: 24 },
  subtitle: { color: Brand.textSoft, fontSize: 15, lineHeight: 22 },
  lockedText: { color: Brand.textSoft },
  footer: { gap: Spacing.two, marginTop: Spacing.one },
  progressWrap: { gap: Spacing.one },
  progressLabel: { fontSize: 12, color: Brand.textSoft },
});
