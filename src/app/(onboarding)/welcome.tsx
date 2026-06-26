import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

import { SanctuaryBackground } from '@/components/home/SanctuaryBackground';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/Button';
import { Brand, Fonts, Spacing } from '@/constants/theme';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <SanctuaryBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={styles.body}>
          <ThemedText type="caps" style={styles.eyebrow}>
            Academia Funcional
          </ThemedText>
          <ThemedText style={styles.title}>
            El lugar donde una mujer{'\n'}
            por fin se siente{'\n'}
            <ThemedText style={styles.titleAccent}>comprendida.</ThemedText>
          </ThemedText>
        </View>

        <View style={styles.footer}>
          <Link href="/register" asChild>
            <Button label="Empezar mi camino" />
          </Link>
          <Link href="/sign-in" asChild>
            <Button label="Ya tengo cuenta" variant="ghost" />
          </Link>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone, padding: Spacing.four },
  body: { flex: 1, justifyContent: 'center', gap: Spacing.three },
  eyebrow: {
    color: Brand.terracotta,
    letterSpacing: 3,
    textAlign: 'center',
  },
  title: {
    fontFamily: Fonts.serif,
    fontStyle: 'italic',
    fontSize: 36,
    lineHeight: 46,
    color: Brand.primaryBrown,
    textAlign: 'center',
    fontWeight: '300',
    marginTop: Spacing.three,
  },
  titleAccent: {
    fontFamily: Fonts.serifBold,
    fontSize: 36,
    lineHeight: 46,
    color: Brand.charcoal,
    fontStyle: 'italic',
  },
  footer: { gap: Spacing.one, paddingBottom: Spacing.three },
});
