import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useQueryClient } from '@tanstack/react-query';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Brand, Spacing } from '@/constants/theme';
import { useSession } from '@/lib/auth-provider';

const PRIVACY_TEXT = `Lo que escribes aquí es solo tuyo.

Tus reflexiones, journaling y cartas a tu futura yo nunca se comparten con nadie y no se usan para entrenar nada. Solo se recoge lo que mejora tu experiencia.

Puedes exportar o borrar tu cuenta cuando quieras. Esta plataforma es educativa y de acompañamiento — no sustituye atención médica ni terapéutica.`;

export default function SettingsScreen() {
  const { signOut, session } = useSession();
  const qc = useQueryClient();

  const onSignOut = () => {
    Alert.alert(
      'Cerrar sesión',
      'Saldrás de tu cuenta. Tu progreso se queda guardado.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            await qc.clear();
          },
        },
      ],
    );
  };

  const onDeleteAccount = () => {
    Alert.alert(
      'Borrar mi cuenta',
      'Esta función estará disponible próximamente. Mientras tanto, escríbenos a juan.homestudio@gmail.com y procesamos tu solicitud.',
      [{ text: 'Entendido' }],
    );
  };

  const showPrivacy = () => {
    Alert.alert('Privacidad', PRIVACY_TEXT, [{ text: 'Cerrar' }]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()} style={styles.back} hitSlop={12}>
          <SymbolView name="chevron.left" tintColor={Brand.brownDark} size={22} />
          <ThemedText style={styles.backText}>Volver</ThemedText>
        </Pressable>

        <ThemedText type="title" style={styles.title}>
          Ajustes
        </ThemedText>

        <Card style={styles.accountCard}>
          <ThemedText style={styles.eyebrow}>Tu cuenta</ThemedText>
          {session?.user.email && (
            <ThemedText style={styles.value}>{session.user.email}</ThemedText>
          )}
        </Card>

        <View style={styles.section}>
          <Pressable onPress={showPrivacy} style={styles.row}>
            <View style={styles.rowLeft}>
              <SymbolView name="lock.shield" tintColor={Brand.sageDark} size={20} />
              <ThemedText style={styles.rowLabel}>Política de privacidad</ThemedText>
            </View>
            <SymbolView name="chevron.right" tintColor={Brand.sand} size={16} />
          </Pressable>
        </View>

        <View style={styles.footerActions}>
          <Button label="Cerrar sesión" variant="secondary" onPress={onSignOut} />
          <Button label="Borrar mi cuenta" variant="ghost" onPress={onDeleteAccount} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone },
  scroll: { padding: Spacing.four, paddingBottom: Spacing.six },
  back: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, marginBottom: Spacing.three },
  backText: { color: Brand.brownDark, fontSize: 15 },
  title: { color: Brand.brownDark, marginBottom: Spacing.four, fontSize: 28 },
  accountCard: { marginBottom: Spacing.four, gap: Spacing.two },
  eyebrow: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Brand.sageDark,
  },
  value: { color: Brand.brownDark, fontSize: 15 },
  section: { gap: Spacing.two, marginBottom: Spacing.four },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    backgroundColor: Brand.beigeLight,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Brand.sand,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  rowLabel: { color: Brand.brownDark, fontSize: 15 },
  footerActions: { gap: Spacing.two, marginTop: Spacing.four },
});
