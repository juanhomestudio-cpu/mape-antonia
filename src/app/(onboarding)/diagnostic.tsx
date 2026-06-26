import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Brand, Radius, Spacing } from '@/constants/theme';
import { getInitialDiagnostic, submitDiagnostic } from '@/services/onboarding';
import type { DiagnosticAnswer } from '@/lib/archetype-scoring';

type OptionRow = { value: string; label: string };

export default function DiagnosticScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['diagnostic', 'inicial-mundo-1'],
    queryFn: getInitialDiagnostic,
  });

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<DiagnosticAnswer[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const questions = data?.questions ?? [];
  const current = questions[index];
  const options: OptionRow[] = useMemo(
    () => (current ? ((current.options as OptionRow[]) ?? []) : []),
    [current],
  );
  const selected = answers.find((a) => a.questionId === current?.id)?.value;

  const onSelect = (value: string) => {
    if (!current) return;
    const next = answers.filter((a) => a.questionId !== current.id);
    next.push({ questionId: current.id, value });
    setAnswers(next);
  };

  const onNext = async () => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      return;
    }
    if (!data) return;
    setSubmitting(true);
    try {
      const archetype = await submitDiagnostic({
        diagnosticId: data.diagnosticId,
        answers,
        questions: questions.map((q) => ({ id: q.id, options: q.options })),
      });
      router.replace({ pathname: '/archetype', params: { slug: archetype.slug } });
    } catch (e: any) {
      Alert.alert('Algo salió raro', e?.message ?? 'Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !current) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ThemedText style={{ color: Brand.textSoft }}>Cargando…</ThemedText>
      </SafeAreaView>
    );
  }

  const progress = `${index + 1} / ${questions.length}`;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText style={styles.eyebrow}>Paso 3 de 4 · {progress}</ThemedText>
        <ThemedText type="title" style={styles.title}>
          {current.prompt}
        </ThemedText>

        <View style={styles.options}>
          {options.map((opt) => {
            const isSelected = opt.value === selected;
            return (
              <Pressable key={opt.value} onPress={() => onSelect(opt.value)}>
                <Card
                  style={[
                    styles.option,
                    isSelected && { borderColor: Brand.terracotta, backgroundColor: Brand.surfaceMid },
                  ]}>
                  <ThemedText style={[styles.optionLabel, isSelected && { color: Brand.charcoal }]}>
                    {opt.label}
                  </ThemedText>
                </Card>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={index < questions.length - 1 ? 'Continuar' : 'Ver mi perfil'}
          onPress={onNext}
          disabled={!selected}
          loading={submitting}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone },
  scroll: { padding: Spacing.four, paddingTop: Spacing.five, paddingBottom: Spacing.six },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: Brand.textSoft,
    marginBottom: Spacing.three,
  },
  title: { color: Brand.charcoal, marginBottom: Spacing.four, fontSize: 24, lineHeight: 32 },
  options: { gap: Spacing.two },
  option: { padding: Spacing.three, borderRadius: Radius.lg },
  optionLabel: { fontSize: 16, color: Brand.charcoal, lineHeight: 22 },
  footer: { padding: Spacing.four, paddingBottom: Spacing.three },
});
