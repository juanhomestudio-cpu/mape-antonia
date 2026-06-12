import { StyleSheet, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/Card';
import { Brand, Spacing, VoiceTokens } from '@/constants/theme';
import type { UserReward } from '@/services/rewards';

const kindIcon: Record<NonNullable<UserReward['reward']>['kind'], string> = {
  letter_antonia: 'envelope.fill',
  letter_mape: 'envelope.fill',
  ritual: 'leaf.fill',
  badge: 'rosette',
};

const kindLabel: Record<NonNullable<UserReward['reward']>['kind'], string> = {
  letter_antonia: 'Carta',
  letter_mape: 'Carta',
  ritual: 'Ritual',
  badge: 'Insignia',
};

export function ToolCard({ item }: { item: UserReward }) {
  if (!item.reward) return null;
  const accent = VoiceTokens[item.reward.voice].accent;

  return (
    <Card voice={item.reward.voice}>
      <View style={styles.row}>
        <View style={[styles.icon, { backgroundColor: accent }]}>
          <SymbolView name={kindIcon[item.reward.kind] as any} tintColor={Brand.white} size={20} />
        </View>
        <View style={styles.center}>
          <ThemedText style={styles.eyebrow}>
            {kindLabel[item.reward.kind]}
            {item.reward.category ? ` · ${item.reward.category}` : ''}
          </ThemedText>
          <ThemedText style={styles.title}>{item.reward.title}</ThemedText>
          {item.reward.subtitle && (
            <ThemedText style={styles.subtitle}>{item.reward.subtitle}</ThemedText>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.three, alignItems: 'flex-start' },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, gap: 2 },
  eyebrow: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Brand.sageDark,
  },
  title: { color: Brand.brownDark, fontSize: 16, marginTop: 2 },
  subtitle: { color: Brand.sageDark, fontSize: 13, lineHeight: 18 },
});
