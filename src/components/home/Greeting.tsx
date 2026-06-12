import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing } from '@/constants/theme';

type Props = {
  displayName?: string;
  streakDays?: number;
};

function greetingByHour(hour: number) {
  if (hour >= 5 && hour < 12) return 'Buenos días';
  if (hour >= 12 && hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

function streakLabel(days: number): string {
  if (days <= 0) return 'Hoy empieza tu camino';
  if (days < 3) return `día ${days}`;
  if (days < 7) return `${days} días escuchándote`;
  if (days < 21) return `${days} días habitándote`;
  if (days < 30) return `${days} días acompañando tu cuerpo`;
  return `${days} días conectando contigo`;
}

export function Greeting({ displayName, streakDays = 0 }: Props) {
  const hour = new Date().getHours();
  const hello = greetingByHour(hour);
  const name = displayName?.split(' ')[0] ?? 'mujer';
  return (
    <View style={styles.wrap}>
      <ThemedText style={styles.streak}>{streakLabel(streakDays)}</ThemedText>
      <ThemedText type="title" style={styles.greeting}>
        {hello}, {name}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: Spacing.four },
  streak: {
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 11,
    color: Brand.terracotta,
    marginBottom: Spacing.two,
  },
  greeting: { color: Brand.brownDark, fontSize: 28, lineHeight: 34 },
});
