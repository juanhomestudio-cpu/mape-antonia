import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { FilterChips } from '@/components/tools/FilterChips';
import { ToolCard } from '@/components/tools/ToolCard';
import { KeyboardScrollView } from '@/components/ui/KeyboardScrollView';
import { SanctuaryBackground } from '@/components/home/SanctuaryBackground';
import { Brand, Fonts, Radius, Spacing } from '@/constants/theme';
import { useMyRewards } from '@/hooks/use-rewards';
import type { Database } from '@/types/database';

type Kind = Database['public']['Enums']['reward_kind'];
type Voice = Database['public']['Enums']['voice'];

const KIND_OPTIONS: { value: Kind; label: string }[] = [
  { value: 'ritual', label: 'Rituales' },
  { value: 'letter_antonia', label: 'Cartas de Antonia' },
  { value: 'letter_mape', label: 'Cartas de Mape' },
  { value: 'badge', label: 'Insignias' },
];

const VOICE_OPTIONS: { value: Voice; label: string }[] = [
  { value: 'antonia', label: 'Antonia' },
  { value: 'mape', label: 'Mape' },
  { value: 'ambas', label: 'A dos voces' },
];

export default function ToolsTab() {
  const [kinds, setKinds] = useState<Kind[]>([]);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [search, setSearch] = useState('');

  const filter = useMemo(
    () => ({ kinds: kinds.length ? kinds : undefined, voices: voices.length ? voices : undefined, search }),
    [kinds, voices, search],
  );
  const { data: rewards = [], isLoading } = useMyRewards(filter);

  const toggle = <T extends string>(arr: T[], setArr: (v: T[]) => void, v: T) => {
    setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  };

  return (
    <View style={styles.container}>
      <SanctuaryBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.header}>
          <ThemedText style={styles.brandTitle}>SANTUARIO</ThemedText>
        </View>

        <KeyboardScrollView contentContainerStyle={styles.scroll}>
          {/* Encabezado de sección */}
          <View style={styles.hero}>
            <ThemedText type="caps" style={styles.eyebrow}>
              Tu legado
            </ThemedText>
            <ThemedText style={styles.title}>Tu biblioteca</ThemedText>
            <ThemedText style={styles.subtitle}>
              Todo lo que has desbloqueado: rituales, cartas e insignias.
            </ThemedText>
          </View>

          {/* Buscador */}
          <View style={styles.searchWrap}>
            <SymbolView name="magnifyingglass" tintColor={Brand.textFaint} size={18} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar…"
              placeholderTextColor={Brand.textFaint}
              style={styles.searchInput}
            />
          </View>

          <View style={styles.filters}>
            <FilterChips
              options={KIND_OPTIONS}
              selected={kinds}
              onToggle={(v) => toggle(kinds, setKinds, v)}
            />
            <FilterChips
              options={VOICE_OPTIONS}
              selected={voices}
              onToggle={(v) => toggle(voices, setVoices, v)}
            />
          </View>

          {isLoading ? (
            <ThemedText style={styles.empty}>Cargando…</ThemedText>
          ) : rewards.length === 0 ? (
            <View style={styles.emptyState}>
              <SymbolView name="sparkles" tintColor={Brand.outline} size={32} />
              <ThemedText style={styles.empty}>
                Aún no has desbloqueado herramientas. Sigue avanzando — irán apareciendo aquí.
              </ThemedText>
            </View>
          ) : (
            <View style={styles.list}>
              {rewards.map((r) => (
                <ToolCard key={r.id} item={r} />
              ))}
            </View>
          )}
        </KeyboardScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone },
  header: { alignItems: 'center', paddingTop: Spacing.three, paddingBottom: Spacing.three },
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
    fontSize: 36,
    lineHeight: 42,
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
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    marginBottom: Spacing.three,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 15,
    color: Brand.charcoal,
  },
  filters: { gap: Spacing.two, marginBottom: Spacing.four },
  emptyState: { alignItems: 'center', gap: Spacing.three, marginTop: Spacing.six },
  empty: {
    fontFamily: Fonts.sans,
    fontStyle: 'italic',
    color: Brand.textSoft,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 280,
  },
  list: { gap: Spacing.three },
});
