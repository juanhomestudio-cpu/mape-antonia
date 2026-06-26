import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { ReflectionsList } from '@/components/me/ReflectionsList';
import { SanctuaryBackground } from '@/components/home/SanctuaryBackground';
import { ThemedText } from '@/components/themed-text';
import { Brand, Fonts, Spacing } from '@/constants/theme';
import { useMyReflections } from '@/hooks/use-reflections';

export default function DiaryScreen() {
  const { data: reflections = [], isLoading } = useMyReflections();

  return (
    <View style={styles.container}>
      <SanctuaryBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={16}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}>
            <SymbolView name="chevron.left" tintColor={Brand.charcoal} size={24} />
          </Pressable>
          <ThemedText style={styles.brandTitle}>SANTUARIO</ThemedText>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <ThemedText type="caps" style={styles.eyebrow}>
              Tu legado emocional
            </ThemedText>
            <ThemedText style={styles.title}>Diario de reflejos</ThemedText>
            <ThemedText style={styles.subtitle}>
              Todo lo que has escrito en tus clases queda guardado aquí. Solo tú lo ves.
            </ThemedText>
          </View>

          {isLoading ? (
            <ThemedText style={styles.empty}>Cargando…</ThemedText>
          ) : reflections.length === 0 ? (
            <ThemedText style={styles.empty}>
              Cuando avances en tu camino, tus reflexiones aparecerán aquí.
            </ThemedText>
          ) : (
            <ReflectionsList items={reflections} />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
    minHeight: 44,
  },
  backBtn: { width: 36, height: 36, alignItems: 'flex-start', justifyContent: 'center' },
  headerSpacer: { width: 36 },
  brandTitle: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 13,
    color: Brand.primaryBrown,
    letterSpacing: 4,
  },
  scroll: { paddingHorizontal: Spacing.four, paddingBottom: Spacing.six * 2 },
  hero: { alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.five, paddingTop: Spacing.three },
  eyebrow: { color: Brand.primaryBrown, opacity: 0.6, letterSpacing: 2.4 },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 32,
    lineHeight: 38,
    color: Brand.charcoal,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontStyle: 'italic',
    fontSize: 15,
    lineHeight: 22,
    color: Brand.textSoft,
    textAlign: 'center',
    maxWidth: 320,
    marginTop: Spacing.one,
  },
  empty: {
    fontFamily: Fonts.sans,
    fontStyle: 'italic',
    color: Brand.textSoft,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: Spacing.five,
    maxWidth: 280,
    alignSelf: 'center',
  },
});
