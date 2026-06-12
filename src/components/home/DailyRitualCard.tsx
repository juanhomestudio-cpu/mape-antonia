import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/Card';
import { Brand, Spacing, VoiceTokens } from '@/constants/theme';
import { useDailyRitual } from '@/hooks/use-rewards';

export function DailyRitualCard() {
  const { data: ritual, isLoading } = useDailyRitual();

  if (isLoading) return null;

  if (!ritual?.reward) {
    return (
      <Card>
        <ThemedText style={styles.eyebrow}>Mi ritual de hoy</ThemedText>
        <ThemedText style={styles.empty}>
          Aún no has desbloqueado rituales. Sigue avanzando — pronto aparecerán aquí.
        </ThemedText>
      </Card>
    );
  }

  const accent = VoiceTokens[ritual.reward.voice].accent;

  return (
    <Pressable onPress={() => router.push('/tools')}>
      <Card voice={ritual.reward.voice}>
        <View style={styles.row}>
          <View style={styles.left}>
            <View style={[styles.icon, { backgroundColor: accent }]}>
              <SymbolView name="leaf.fill" tintColor={Brand.white} size={20} />
            </View>
          </View>
          <View style={styles.center}>
            <ThemedText style={styles.eyebrow}>Mi ritual de hoy</ThemedText>
            <ThemedText style={styles.title}>{ritual.reward.title}</ThemedText>
            {ritual.reward.subtitle && (
              <ThemedText style={styles.subtitle}>{ritual.reward.subtitle}</ThemedText>
            )}
          </View>
          <SymbolView name="chevron.right" tintColor={Brand.sageDark} size={18} />
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  left: { },
  center: { flex: 1, gap: 2 },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Brand.sageDark,
  },
  title: { color: Brand.brownDark, fontSize: 16, marginTop: 2 },
  subtitle: { color: Brand.sageDark, fontSize: 13 },
  empty: { color: Brand.sageDark, fontSize: 14, lineHeight: 20, marginTop: Spacing.two },
});
