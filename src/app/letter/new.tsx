import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DateField } from '@/components/ui/DateField';
import { KeyboardScrollView } from '@/components/ui/KeyboardScrollView';
import { TextField } from '@/components/ui/TextField';
import { Brand, Spacing } from '@/constants/theme';
import { useCreateLetter } from '@/hooks/use-letters';

const schema = z.object({
  title: z.string().max(80, 'Máximo 80 caracteres').optional(),
  body: z.string().min(10, 'Escribe al menos una idea, aunque sea corta'),
});

type FormData = z.infer<typeof schema>;

function defaultDate(): Date {
  const d = new Date();
  d.setMonth(d.getMonth() + 2);
  d.setHours(9, 0, 0, 0);
  return d;
}

export default function NewLetterScreen() {
  const create = useCreateLetter();
  const [deliverAt, setDeliverAt] = useState<Date>(defaultDate());
  const [notifyEmail, setNotifyEmail] = useState(true);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', body: '' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await create.mutateAsync({
        title: data.title ?? null,
        body: data.body,
        deliverAt,
        notifyEmail,
      });
      router.back();
    } catch (e: any) {
      Alert.alert('No pudimos guardar', e?.message ?? 'Inténtalo de nuevo.');
    }
  };

  const minDate = new Date();
  minDate.setHours(minDate.getHours() + 1);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()} style={styles.back} hitSlop={12}>
          <SymbolView name="chevron.left" tintColor={Brand.brownDark} size={22} />
          <ThemedText style={styles.backText}>Volver</ThemedText>
        </Pressable>

        <ThemedText style={styles.eyebrow}>Carta a tu futura yo</ThemedText>
        <ThemedText type="title" style={styles.title}>
          ¿Qué quieres decirle?
        </ThemedText>

        <Controller
          control={control}
          name="title"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Título (opcional)"
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.title?.message ?? null}
            />
          )}
        />

        <Controller
          control={control}
          name="body"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Tu mensaje"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              style={{ minHeight: 200, paddingTop: Spacing.three }}
              error={errors.body?.message ?? null}
            />
          )}
        />

        <Card style={styles.dateCard}>
          <DateField
            label="Fecha de entrega"
            value={deliverAt}
            onChange={setDeliverAt}
            minDate={minDate}
          />

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.switchLabel}>Avisarme también por correo</ThemedText>
              <ThemedText style={styles.switchHelper}>
                Cuando llegue la fecha, te enviamos la carta a tu email.
              </ThemedText>
            </View>
            <Switch
              value={notifyEmail}
              onValueChange={setNotifyEmail}
              trackColor={{ false: Brand.sand, true: Brand.terracotta }}
              ios_backgroundColor={Brand.sand}
            />
          </View>
        </Card>

        <Button
          label="Guardar carta"
          onPress={handleSubmit(onSubmit)}
          loading={create.isPending}
          style={{ marginTop: Spacing.three }}
        />
      </KeyboardScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone },
  scroll: { padding: Spacing.four, paddingBottom: Spacing.six },
  back: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, marginBottom: Spacing.three },
  backText: { color: Brand.brownDark, fontSize: 15 },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: Brand.sageDark,
    marginBottom: Spacing.two,
  },
  title: { color: Brand.brownDark, fontSize: 26, lineHeight: 32, marginBottom: Spacing.four },
  dateCard: { gap: Spacing.three, marginTop: Spacing.two },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: Brand.sand,
  },
  switchLabel: { color: Brand.brownDark, fontSize: 14 },
  switchHelper: { color: Brand.sageDark, fontSize: 12, marginTop: 2 },
});
