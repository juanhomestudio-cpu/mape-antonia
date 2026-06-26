import { StyleSheet, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { Brand, Fonts, Radius, Spacing, VoiceTokens } from '@/constants/theme';
import type { UserReward } from '@/services/rewards';

const kindIcon: Record<NonNullable<UserReward['reward']>['kind'], string> = {
  letter_antonia: 'envelope.fill',
  letter_mape: 'envelope.fill',
  ritual: 'leaf.fill',
  badge: 'rosette.fill',
};

const kindLabel: Record<NonNullable<UserReward['reward']>['kind'], string> = {
  letter_antonia: 'Carta de Antonia',
  letter_mape: 'Carta de Mape',
  ritual: 'Ritual',
  badge: 'Insignia',
};

export function ToolCard({ item }: { item: UserReward }) {
  if (!item.reward) return null;
  const accent = VoiceTokens[item.reward.voice].accent;
  const soft = VoiceTokens[item.reward.voice].soft;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.icon, { backgroundColor: soft }]}>
          <SymbolView name={kindIcon[item.reward.kind] as any} tintColor={accent} size={22} />
        </View>
        <View style={styles.center}>
          <ThemedText type="caps" style={[styles.eyebrow, { color: accent }]}>
            {kindLabel[item.reward.kind]}
            {item.reward.category ? ` · ${item.reward.category}` : ''}
          </ThemedText>
          <ThemedText style={styles.title}>{item.reward.title}</ThemedText>
          {item.reward.subtitle && (
            <ThemedText style={styles.subtitle}>{item.reward.subtitle}</ThemedText>
          )}
        </View>
        <SymbolView name="chevron.right" tintColor={Brand.outline} size={16} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    padding: Spacing.four,
    shadowColor: Brand.primaryBrown,
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, gap: Spacing.one },
  eyebrow: { letterSpacing: 1.5 },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    lineHeight: 24,
    color: Brand.charcoal,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontStyle: 'italic',
    fontSize: 13,
    lineHeight: 18,
    color: Brand.textSoft,
  },
});
