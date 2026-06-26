import { Pressable, StyleSheet, View } from 'react-native';
import { Link, router } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { Brand, Radius, Spacing } from '@/constants/theme';
import type { FutureLetter } from '@/services/letters';

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
}

function LetterRow({ letter, interactive }: { letter: FutureLetter; interactive: boolean }) {
  const isPast = !!letter.delivered_at;
  const inner = (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: isPast ? Brand.terracotta : Brand.surfaceMid }]}>
        <SymbolView
          name={isPast ? 'envelope.open.fill' : 'envelope'}
          tintColor={isPast ? Brand.white : Brand.textSoft}
          size={18}
        />
      </View>
      <View style={styles.center}>
        <ThemedText style={styles.title} numberOfLines={1}>
          {letter.title ?? (isPast ? 'Una carta para ti' : 'Carta programada')}
        </ThemedText>
        <ThemedText style={styles.meta}>
          {isPast ? `Entregada · ${formatDate(letter.delivered_at!)}` : `Llega el ${formatDate(letter.deliver_at)}`}
        </ThemedText>
      </View>
      {interactive && (
        <SymbolView name="chevron.right" tintColor={Brand.textSoft} size={16} />
      )}
    </View>
  );

  if (!interactive) return inner;
  return (
    <Link href={{ pathname: '/letter/[id]', params: { id: letter.id } }} asChild>
      <Pressable>{inner}</Pressable>
    </Link>
  );
}

type Props = {
  past: FutureLetter[];
  scheduled: FutureLetter[];
};

export function LettersList({ past, scheduled }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <ThemedText style={styles.eyebrow}>Tus cartas a tu futura yo</ThemedText>
        <Pressable
          onPress={() => router.push('/letter/new')}
          style={({ pressed }) => [styles.newBtn, pressed && { opacity: 0.6 }]}
          hitSlop={8}>
          <SymbolView name="plus" tintColor={Brand.terracotta} size={16} />
          <ThemedText style={styles.newBtnText}>Escribir</ThemedText>
        </Pressable>
      </View>

      {past.length === 0 && scheduled.length === 0 ? (
        <ThemedText style={styles.empty}>
          Aún no tienes cartas. Escríbele a tu yo de dentro de unos meses.
        </ThemedText>
      ) : (
        <View style={styles.list}>
          {past.map((l) => (
            <LetterRow key={l.id} letter={l} interactive />
          ))}
          {scheduled.map((l) => (
            <LetterRow key={l.id} letter={l} interactive={false} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 11,
    color: Brand.textSoft,
  },
  newBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  newBtnText: { color: Brand.terracotta, fontSize: 13, fontWeight: '500' },
  list: { gap: Spacing.two },
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
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, gap: 2 },
  title: { color: Brand.charcoal, fontSize: 15 },
  meta: { color: Brand.textSoft, fontSize: 12 },
  empty: { color: Brand.textSoft, fontSize: 13, lineHeight: 20 },
});
