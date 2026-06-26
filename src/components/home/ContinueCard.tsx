import { Pressable, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/themed-text';
import { Brand, Fonts, Radius, Spacing, VoiceTokens } from '@/constants/theme';
import { useNextLesson } from '@/hooks/use-next-lesson';
import { useWorlds } from '@/hooks/use-content';
import { useWorldProgress } from '@/hooks/use-lesson-progress';

export function ContinueCard() {
  const { data: lesson, isLoading } = useNextLesson();
  const { data: worlds = [] } = useWorlds();
  const world = worlds.find((w) => w.id === lesson?.world_id);
  const { data: worldProgress = [] } = useWorldProgress(world?.id);

  if (isLoading) return null;

  if (!lesson || !world) {
    return (
      <View style={styles.card}>
        <ThemedText type="caps" style={styles.eyebrow}>Tu camino</ThemedText>
        <ThemedText style={styles.titleSerif}>Cerraste el Mundo 1</ThemedText>
        <ThemedText style={styles.subtitle}>
          El Mundo 2 se abre cuando esté disponible.
        </ThemedText>
      </View>
    );
  }

  // Conteo de clases del mundo y completadas
  const totalLessons = 8; // M1 placeholder; real cuando tengamos query agregada
  const completed = worldProgress.filter((p) => p.status === 'completed').length;
  const accent = VoiceTokens[lesson.voice].accent;

  return (
    <Link href={{ pathname: '/lesson/[id]', params: { id: lesson.id } }} asChild>
      <Pressable>
        <View style={styles.card}>
          <View style={styles.topRow}>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.worldTitle}>
                Mundo {world.position}: {world.title}
              </ThemedText>
              <ThemedText type="caps" style={[styles.eyebrow, { color: Brand.terracotta }]}>
                Continuar mi camino
              </ThemedText>
            </View>
            <View style={styles.progressBubble}>
              <ThemedText style={styles.progressText}>
                {completed}/{totalLessons}
              </ThemedText>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <LinearGradient
              colors={[Brand.terracotta, Brand.eucalyptus]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${(completed / totalLessons) * 100}%` }]}
            />
          </View>

          <View style={styles.bottomRow}>
            <View style={{ flex: 1 }}>
              <ThemedText type="caps" style={styles.proximaLabel}>Próxima clase</ThemedText>
              <ThemedText style={styles.lessonTitle} numberOfLines={2}>
                “{lesson.title}”
              </ThemedText>
            </View>
            <View style={[styles.playBtn, { backgroundColor: accent }]}>
              <SymbolView name="play.fill" tintColor={Brand.white} size={18} />
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: Radius.xl,
    padding: Spacing.four,
    gap: Spacing.four,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: Brand.primaryBrown,
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.three },
  eyebrow: { color: Brand.primaryBrown, opacity: 0.6 },
  worldTitle: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    lineHeight: 28,
    color: Brand.primaryBrown,
    marginBottom: 4,
  },
  progressBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Brand.sand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 13,
    color: Brand.primaryBrown,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(113,87,63,0.10)',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  proximaLabel: { color: Brand.primaryBrown, opacity: 0.5, marginBottom: 4 },
  lessonTitle: {
    fontFamily: Fonts.sans,
    fontStyle: 'italic',
    fontSize: 17,
    lineHeight: 22,
    color: Brand.primaryBrown,
  },
  subtitle: { color: Brand.textSoft, fontSize: 14, lineHeight: 20 },
  titleSerif: { fontFamily: Fonts.serif, fontSize: 22, color: Brand.primaryBrown },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Brand.terracotta,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
