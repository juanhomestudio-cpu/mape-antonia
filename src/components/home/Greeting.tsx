import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, Fonts, Spacing } from '@/constants/theme';

type Props = {
  displayName?: string;
  streakDays?: number;
};

function greetingByHour(hour: number) {
  if (hour >= 5 && hour < 12) return 'Buenos días';
  if (hour >= 12 && hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export function Greeting({ displayName, streakDays = 0 }: Props) {
  const hour = new Date().getHours();
  const hello = greetingByHour(hour);
  const name = displayName?.split(' ')[0] ?? 'mujer';

  return (
    <View style={styles.wrap}>
      <ThemedText type="caps" style={styles.eyebrow}>
        {streakDays > 0 ? `Día ${streakDays} · tu espacio seguro` : 'Tu espacio seguro'}
      </ThemedText>
      <ThemedText style={styles.greeting} allowFontScaling={false}>
        {hello},{'\n'}
        <ThemedText style={styles.name}>{name}</ThemedText>
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: Spacing.five, gap: Spacing.two },
  eyebrow: {
    color: Brand.primaryBrown,
    opacity: 0.6,
    textAlign: 'center',
  },
  greeting: {
    fontFamily: Fonts.serif,
    fontStyle: 'italic',
    fontSize: 40,
    lineHeight: 48,
    color: Brand.primaryBrown,
    textAlign: 'center',
    fontWeight: '300',
  },
  name: {
    fontFamily: Fonts.serif,
    fontStyle: 'italic',
    fontSize: 40,
    lineHeight: 48,
    color: Brand.charcoal,
    fontWeight: '300',
  },
});
