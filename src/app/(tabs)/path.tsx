import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { WorldCard } from '@/components/path/WorldCard';
import { Brand, Spacing } from '@/constants/theme';
import { useWorlds } from '@/hooks/use-content';
import { useWorldProgress } from '@/hooks/use-lesson-progress';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

/** Cuenta de lecciones por mundo, para el progreso de cada tarjeta. */
async function getLessonCountsByWorld() {
  const { data, error } = await supabase
    .from('lessons')
    .select('world_id');
  if (error) throw error;
  const counts = new Map<string, number>();
  for (const l of data ?? []) counts.set(l.world_id, (counts.get(l.world_id) ?? 0) + 1);
  return counts;
}

export default function PathTab() {
  const { data: worlds = [], isLoading } = useWorlds();
  const mundo1 = worlds.find((w) => w.slug === 'un-dia-naci');
  const { data: m1Progress = [] } = useWorldProgress(mundo1?.id);
  const { data: counts } = useQuery({ queryKey: ['lesson-counts'], queryFn: getLessonCountsByWorld });

  const m1Completed = m1Progress.filter((p) => p.status === 'completed').length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <ThemedText style={styles.eyebrow}>Mi camino</ThemedText>
          <ThemedText type="title" style={styles.title}>
            Tu recorrido
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Tres mundos componen tus bases. Cada uno se revela cuando hayas cerrado el anterior.
          </ThemedText>
        </View>

        {isLoading ? (
          <ThemedText style={{ color: Brand.sageDark }}>Cargando…</ThemedText>
        ) : (
          <View style={styles.list}>
            {worlds.map((world) => {
              const isMundo1 = world.slug === 'un-dia-naci';
              const total = counts?.get(world.id) ?? 0;
              return (
                <WorldCard
                  key={world.id}
                  world={world}
                  isLocked={!isMundo1}
                  progress={isMundo1 ? { completed: m1Completed, total } : undefined}
                />
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone },
  scroll: { padding: Spacing.four, paddingBottom: Spacing.six },
  header: { marginBottom: Spacing.four },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: Brand.sageDark,
    marginBottom: Spacing.two,
  },
  title: { color: Brand.brownDark, marginBottom: Spacing.three, fontSize: 28 },
  subtitle: { color: Brand.sageDark, lineHeight: 24, fontSize: 15 },
  list: { gap: Spacing.three },
});
