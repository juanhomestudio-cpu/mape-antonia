import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/Button';
import { Brand, Spacing } from '@/constants/theme';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.body}>
        <ThemedText style={styles.eyebrow}>Academia Funcional</ThemedText>
        <ThemedText type="title" style={styles.title}>
          Un viaje para volver a ti
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Dos voces te acompañan: Antonia, para el cuerpo. Mape, para la mente. No es una academia
          ni un curso. Es un espacio para descubrirte.
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone, padding: Spacing.four },
  body: { flex: 1, justifyContent: 'center' },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: Brand.terracotta,
    marginBottom: Spacing.three,
  },
  title: { color: Brand.charcoal, marginBottom: Spacing.three, fontSize: 32, lineHeight: 38 },
  subtitle: { color: Brand.textSoft, lineHeight: 26, fontSize: 16 },
  footer: { gap: Spacing.one, paddingBottom: Spacing.three },
});
