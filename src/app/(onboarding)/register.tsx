import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/Button';
import { KeyboardScrollView } from '@/components/ui/KeyboardScrollView';
import { TextField } from '@/components/ui/TextField';
import { Brand, Spacing } from '@/constants/theme';
import { signUpWithEmail } from '@/services/auth';
import { updateMyProfile } from '@/services/profile';

const schema = z.object({
  displayName: z.string().min(2, 'Tu nombre, aunque sea uno'),
  email: z.string().email('Ingresa un correo válido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  age: z
    .string()
    .min(1, 'Ingresa tu edad')
    .refine((v) => /^\d{1,3}$/.test(v), { message: 'Solo números' })
    .refine((v) => Number(v) >= 14 && Number(v) <= 100, {
      message: 'Una edad válida',
    }),
});

type FormData = z.infer<typeof schema>;

export default function RegisterScreen() {
  const [submitting, setSubmitting] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { displayName: '', email: '', password: '', age: '' },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const result = await signUpWithEmail({
        email: data.email,
        password: data.password,
        displayName: data.displayName,
      });

      // Si Supabase tiene "confirm email" activo, signUp no devuelve sesión.
      // El profile YA fue creado por el trigger handle_new_user (con
      // service_role internamente). Pedimos a la usuaria que confirme.
      if (!result.session) {
        Alert.alert(
          'Confirma tu correo',
          'Te enviamos un enlace a ' +
            data.email +
            '. Ábrelo desde tu correo, luego vuelve a la app y entra con "Ya tengo cuenta".',
          [{ text: 'Entendido', onPress: () => router.replace('/sign-in') }],
        );
        return;
      }

      // El trigger handle_new_user creó profile + user_streaks. Si hay edad,
      // actualizamos el profile (requiere sesión, por eso va dentro del if).
      if (data.age) {
        await updateMyProfile({ age: Number(data.age) });
      }
      router.push('/intro');
    } catch (e: any) {
      const msg = e?.message ?? 'Inténtalo de nuevo.';
      // Si el correo ya existe, dirigimos al sign-in.
      if (/already registered|user already exists/i.test(msg)) {
        Alert.alert(
          'Ya tienes una cuenta con ese correo',
          'Entra con "Ya tengo cuenta" usando tu contraseña.',
          [{ text: 'Ir a entrar', onPress: () => router.replace('/sign-in') }],
        );
      } else {
        Alert.alert('No pudimos crear tu cuenta', msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <ThemedText style={styles.eyebrow}>Paso 1 de 4</ThemedText>
            <ThemedText type="title" style={styles.title}>
              ¿Cómo te llamamos?
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Tu cuenta es tuya, privada. Lo que escribes aquí no lo ve nadie más.
            </ThemedText>
          </View>

          <Controller
            control={control}
            name="displayName"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                label="Nombre"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                textContentType="givenName"
                error={errors.displayName?.message ?? null}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                label="Correo"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                error={errors.email?.message ?? null}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                label="Contraseña"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                autoComplete="new-password"
                textContentType="newPassword"
                error={errors.password?.message ?? null}
              />
            )}
          />
          <Controller
            control={control}
            name="age"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                label="Edad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="number-pad"
                helper="La usamos para acompañarte con contenido cercano a tu momento."
                error={errors.age?.message ?? null}
              />
            )}
          />

          <Button
            label="Continuar"
            onPress={handleSubmit(onSubmit)}
            loading={submitting}
            style={{ marginTop: Spacing.three }}
          />
      </KeyboardScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone },
  scroll: { padding: Spacing.four, paddingTop: Spacing.five },
  header: { marginBottom: Spacing.four },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: Brand.textSoft,
    marginBottom: Spacing.two,
  },
  title: { color: Brand.charcoal, marginBottom: Spacing.three, fontSize: 28 },
  subtitle: { color: Brand.textSoft, lineHeight: 24 },
});
