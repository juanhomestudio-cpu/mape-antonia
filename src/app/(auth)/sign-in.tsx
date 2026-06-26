import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/Button';
import { KeyboardScrollView } from '@/components/ui/KeyboardScrollView';
import { TextField } from '@/components/ui/TextField';
import { Brand, Spacing } from '@/constants/theme';
import { signInWithEmail } from '@/services/auth';

const schema = z.object({
  email: z.string().email('Ingresa un correo válido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function SignInScreen() {
  const [submitting, setSubmitting] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await signInWithEmail(data);
      // Navegamos a la raíz; el router-gate de (tabs) decide a dónde
      // (a /intro si el onboarding no está completo, o a los tabs si sí).
      router.replace('/');
    } catch (e: any) {
      Alert.alert('No pudimos entrar', e?.message ?? 'Revisa tu correo y contraseña.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <ThemedText style={styles.eyebrow}>Bienvenida</ThemedText>
            <ThemedText type="title" style={styles.title}>
              Volver a ti
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Ingresa con tu correo para continuar tu camino.
            </ThemedText>
          </View>

          <View style={styles.form}>
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
                  autoComplete="current-password"
                  textContentType="password"
                  error={errors.password?.message ?? null}
                />
              )}
            />

            <Button
              label="Entrar"
              onPress={handleSubmit(onSubmit)}
              loading={submitting}
              style={{ marginTop: Spacing.three }}
            />

            <Link href="/forgot" asChild>
              <Button label="Olvidé mi contraseña" variant="ghost" />
            </Link>
          </View>

          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>¿Aún no tienes cuenta?</ThemedText>
            <Link href="/welcome" replace asChild>
              <Button label="Empezar mi camino" variant="secondary" />
            </Link>
          </View>
      </KeyboardScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone },
  scroll: { padding: Spacing.four, paddingTop: Spacing.five },
  header: { marginBottom: Spacing.five },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: Brand.textSoft,
    marginBottom: Spacing.two,
  },
  title: { color: Brand.charcoal, marginBottom: Spacing.three },
  subtitle: { color: Brand.textSoft, lineHeight: 24 },
  form: { gap: Spacing.one },
  footer: { marginTop: Spacing.six, alignItems: 'center', gap: Spacing.two },
  footerText: { color: Brand.textSoft },
});
