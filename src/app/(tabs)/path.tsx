import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { WorldNode } from '@/components/path/WorldNode';
import { SanctuaryBackground } from '@/components/home/SanctuaryBackground';
import { Brand, Fonts, Radius, Spacing } from '@/constants/theme';
import { useWorlds } from '@/hooks/use-content';
import { useWorldProgress } from '@/hooks/use-lesson-progress';
import { useNextLesson } from '@/hooks/use-next-lesson';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

async function getLessonCountsByWorld() {
  const { data, error } = await supabase.from('lessons').select('world_id');
  if (error) throw error;
  const counts = new Map<string, number>();
  for (const l of data ?? []) counts.set(l.world_id, (counts.get(l.world_id) ?? 0) + 1);
  return counts;
}

export default function PathTab() {
  const { data: worlds = [] } = useWorlds();
  const mundo1 = worlds.find((w) => w.slug === 'un-dia-naci');
  const { data: m1Progress = [] } = useWorldProgress(mundo1?.id);
  const { data: counts } = useQuery({ queryKey: ['lesson-counts'], queryFn: getLessonCountsByWorld });
  const { data: nextLesson } = useNextLesson();

  const m1Completed = m1Progress.filter((p) => p.status === 'completed').length;
  const m1Total = counts?.get(mundo1?.id ?? '') ?? 8;

  // Estado de cada mundo: el primero es activo (o completado si M1 está cerrado);
  // los demás bloqueados hasta cerrar el anterior.
  const stateFor = (slug: string): 'completed' | 'active' | 'locked' => {
    if (slug === 'un-dia-naci') {
      return m1Completed === m1Total && m1Total > 0 ? 'completed' : 'active';
    }
    return 'locked';
  };

  return (
    <View style={styles.container}>
      <SanctuaryBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}>
          {/* Píldora flotante con el "lugar en el camino" */}
          <View style={styles.headerPill}>
            <ThemedText type="caps" style={styles.headerPillText}>
              Mi camino · Fase 1
            </ThemedText>
          </View>

          {/* Nodo inicial "El comienzo" */}
          <View style={styles.startNode}>
            <View style={styles.startDot} />
            <ThemedText type="caps" style={styles.startLabel}>
              El comienzo
            </ThemedText>
          </View>

          {/* Conector */}
          <View style={styles.connector} />

          {/* Mundos del recorrido */}
          {worlds
            .sort((a, b) => a.position - b.position)
            .map((world, idx) => {
              const state = stateFor(world.slug);
              const isM1 = world.slug === 'un-dia-naci';
              const progress = isM1 ? { completed: m1Completed, total: m1Total } : undefined;
              const cta =
                isM1 && state === 'active' && nextLesson
                  ? `Clase ${nextLesson.position}: ${nextLesson.title}`
                  : undefined;
              return (
                <View key={world.id}>
                  <WorldNode world={world} state={state} progress={progress} cta={cta} />
                  {idx < worlds.length - 1 && <View style={styles.connector} />}
                </View>
              );
            })}

          {/* Tarjetas asimétricas al final */}
          <View style={styles.cardsGrid}>
            <Pressable
              onPress={() => router.push('/letter/new')}
              style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}>
              <SymbolView
                name="text.book.closed.fill"
                tintColor={Brand.terracotta}
                size={28}
              />
              <View style={{ gap: Spacing.two }}>
                <ThemedText style={styles.cardTitle}>Carta a mi futura yo</ThemedText>
                <ThemedText style={styles.cardBody}>
                  ¿Qué necesita escuchar la mujer que serás en unos meses?
                </ThemedText>
              </View>
              <ThemedText type="caps" style={[styles.cardCta, { color: Brand.terracotta }]}>
                Escribir memoria →
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => router.push('/tools')}
              style={({ pressed }) => [
                styles.card,
                styles.cardOffset,
                { backgroundColor: 'rgba(245,242,237,0.6)', borderColor: 'rgba(113,87,63,0.08)' },
                pressed && { opacity: 0.85 },
              ]}>
              <SymbolView name="leaf.fill" tintColor={Brand.eucalyptus} size={28} />
              <View style={{ gap: Spacing.two }}>
                <ThemedText style={styles.cardTitle}>Rituales de regulación</ThemedText>
                <ThemedText style={styles.cardBody}>
                  Respiración y micro-hábitos para regresar a la calma.
                </ThemedText>
              </View>
              <ThemedText type="caps" style={[styles.cardCta, { color: Brand.eucalyptus }]}>
                Ver biblioteca →
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone },
  scroll: { alignItems: 'center', paddingTop: Spacing.three, paddingBottom: Spacing.six * 2 },
  headerPill: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(245,242,237,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(113,87,63,0.1)',
    marginBottom: Spacing.five,
  },
  headerPillText: { color: Brand.primaryBrown, letterSpacing: 2.4 },
  startNode: { alignItems: 'center', gap: Spacing.three },
  startDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Brand.primaryBrown,
    shadowColor: Brand.primaryBrown,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  startLabel: { color: Brand.textSoft, opacity: 0.7, letterSpacing: 2.4 },
  connector: {
    width: 1,
    height: Spacing.six,
    backgroundColor: 'rgba(113,87,63,0.2)',
    marginVertical: Spacing.two,
  },
  cardsGrid: {
    width: '100%',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
    marginTop: Spacing.six,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    padding: Spacing.four,
    gap: Spacing.four,
    minHeight: 220,
    justifyContent: 'space-between',
    shadowColor: Brand.primaryBrown,
    shadowOpacity: 0.04,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardOffset: {},
  cardTitle: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    lineHeight: 28,
    color: Brand.primaryBrown,
  },
  cardBody: { color: Brand.textSoft, fontSize: 15, lineHeight: 22, opacity: 0.85 },
  cardCta: { letterSpacing: 1.5 },
});
