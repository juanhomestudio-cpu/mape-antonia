import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { FilterChips } from '@/components/tools/FilterChips';
import { ToolCard } from '@/components/tools/ToolCard';
import { KeyboardScrollView } from '@/components/ui/KeyboardScrollView';
import { Brand, Radius, Spacing } from '@/constants/theme';
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <ThemedText style={styles.eyebrow}>Herramientas</ThemedText>
          <ThemedText type="title" style={styles.title}>
            Tu biblioteca
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Todo lo que has desbloqueado: rituales, cartas e insignias.
          </ThemedText>
        </View>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar…"
          placeholderTextColor={Brand.sand}
          style={styles.search}
        />

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
          <ThemedText style={styles.empty}>
            Aún no has desbloqueado herramientas. Sigue avanzando — irán apareciendo aquí.
          </ThemedText>
        ) : (
          <View style={styles.list}>
            {rewards.map((r) => (
              <ToolCard key={r.id} item={r} />
            ))}
          </View>
        )}
      </KeyboardScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone },
  scroll: { padding: Spacing.four, paddingBottom: Spacing.six },
  header: { marginBottom: Spacing.three },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: Brand.textSoft,
    marginBottom: Spacing.two,
  },
  title: { color: Brand.charcoal, fontSize: 28, marginBottom: Spacing.two },
  subtitle: { color: Brand.textSoft, fontSize: 14, lineHeight: 20 },
  search: {
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    backgroundColor: Brand.surfaceLow,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Brand.sand,
    color: Brand.charcoal,
    fontSize: 15,
    marginBottom: Spacing.two,
  },
  filters: { gap: Spacing.one, marginBottom: Spacing.three },
  empty: { color: Brand.textSoft, fontSize: 14, lineHeight: 22, marginTop: Spacing.three },
  list: { gap: Spacing.two },
});
