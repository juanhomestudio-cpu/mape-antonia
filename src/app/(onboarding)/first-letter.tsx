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
import { createFirstLetter, markOnboardingComplete } from '@/services/onboarding';

const schema = z.object({
  body: z.string().min(10, 'Escribe al menos una idea, aunque sea corta'),
});

type FormData = z.infer<typeof schema>;

export default function FirstLetterScreen() {
  const [submitting, setSubmitting] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { body: '' },
  });

  const finishOnboarding = async () => {
    await markOnboardingComplete();
    router.replace('/');
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const twoMonths = new Date();
      twoMonths.setMonth(twoMonths.getMonth() + 2);
      await createFirstLetter({
        title: 'Mi primera carta',
        body: data.body,
        deliverAt: twoMonths,
        notifyEmail: true,
      });
      await finishOnboarding();
    } catch (e: any) {
      Alert.alert('No pudimos guardar tu carta', e?.message ?? 'Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const onSkip = async () => {
    setSubmitting(true);
    try {
      await finishOnboarding();
    } catch (e: any) {
      Alert.alert('Algo salió raro', e?.message ?? 'Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardScrollView contentContainerStyle={styles.scroll}>
          <ThemedText style={styles.eyebrow}>Paso 4 de 4</ThemedText>
          <ThemedText type="title" style={styles.title}>
            Una carta a tu yo de dentro de dos meses
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Escribe algo que quieras decirle. Algo que estás viviendo hoy, una intención, una
            promesa pequeña. En dos meses te llegará por correo y aparecerá en tu app.
          </ThemedText>

          <Controller
            control={control}
            name="body"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                label="Para mí, en dos meses"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                style={{ minHeight: 160, paddingTop: Spacing.three }}
                error={errors.body?.message ?? null}
              />
            )}
          />

          <Button
            label="Guardar y entrar"
            onPress={handleSubmit(onSubmit)}
            loading={submitting}
            style={{ marginTop: Spacing.three }}
          />
          <Button label="Hacerlo después" variant="ghost" onPress={onSkip} disabled={submitting} />
      </KeyboardScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone },
  scroll: { padding: Spacing.four, paddingTop: Spacing.five },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: Brand.sageDark,
    marginBottom: Spacing.two,
  },
  title: { color: Brand.brownDark, marginBottom: Spacing.three, fontSize: 26, lineHeight: 32 },
  subtitle: { color: Brand.sageDark, lineHeight: 24, marginBottom: Spacing.four, fontSize: 15 },
});
