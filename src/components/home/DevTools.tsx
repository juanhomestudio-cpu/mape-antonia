import { Alert, StyleSheet, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/Button';
import { Brand, Spacing } from '@/constants/theme';
import { useSession } from '@/lib/auth-provider';
import { devResetOnboarding } from '@/services/profile';

/**
 * Atajos visibles SOLO en desarrollo (__DEV__). En la build de producción no
 * se compilan ni se renderizan. Sirven para probar flujos sin tener que
 * editar Supabase a mano.
 */
export function DevTools() {
  if (!__DEV__) return null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { signOut } = useSession();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const qc = useQueryClient();

  const onResetOnboarding = () => {
    Alert.alert(
      'Reiniciar onboarding',
      'Esto te lleva de vuelta a la intro cinemática. Tu cuenta y tus reflexiones se conservan.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, reiniciar',
          style: 'destructive',
          onPress: async () => {
            try {
              await devResetOnboarding();
              // Forzar refetch del perfil para que el gate redirija a /intro.
              await qc.invalidateQueries({ queryKey: ['profile'] });
            } catch (e: any) {
              Alert.alert('Algo salió raro', e?.message ?? 'Inténtalo de nuevo.');
            }
          },
        },
      ],
    );
  };

  const onSignOut = () => {
    Alert.alert(
      'Cerrar sesión',
      'Saldrás de tu cuenta. Puedes volver a entrar con el mismo correo.',
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

  return (
    <View style={styles.wrap}>
      <ThemedText style={styles.label}>Modo desarrollo</ThemedText>
      <Button label="Reiniciar onboarding" variant="ghost" onPress={onResetOnboarding} />
      <Button label="Cerrar sesión" variant="ghost" onPress={onSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: Spacing.six,
    gap: Spacing.one,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: Brand.sand,
  },
  label: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Brand.sand,
    textAlign: 'center',
    marginBottom: Spacing.one,
  },
});
