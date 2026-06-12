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
import { sendPasswordReset } from '@/services/auth';

const schema = z.object({ email: z.string().email('Ingresa un correo válido') });
type FormData = z.infer<typeof schema>;

export default function ForgotScreen() {
  const [submitting, setSubmitting] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await sendPasswordReset(data.email);
      Alert.alert(
        'Revisa tu correo',
        'Te enviamos un enlace para restablecer tu contraseña.',
        [{ text: 'Volver', onPress: () => router.back() }],
      );
    } catch (e: any) {
      Alert.alert('No pudimos enviar el correo', e?.message ?? 'Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Recupera tu acceso
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Te enviaremos un enlace al correo con el que te registraste.
            </ThemedText>
          </View>

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
                error={errors.email?.message ?? null}
              />
            )}
          />

          <Button
            label="Enviar enlace"
            onPress={handleSubmit(onSubmit)}
            loading={submitting}
            style={{ marginTop: Spacing.three }}
          />
          <Button label="Volver" variant="ghost" onPress={() => router.back()} />
      </KeyboardScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone },
  scroll: { padding: Spacing.four, paddingTop: Spacing.five },
  header: { marginBottom: Spacing.five },
  title: { color: Brand.brownDark, marginBottom: Spacing.three },
  subtitle: { color: Brand.sageDark, lineHeight: 24 },
});
