import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Brand, Spacing } from '@/constants/theme';
import type { MicroExperience } from '@/services/content';

type Props = {
  micro: MicroExperience;
  submitting?: boolean;
  onSubmit: (text: string) => void;
};

export function ReflectionPrompt({ micro, submitting, onSubmit }: Props) {
  const [text, setText] = useState('');
  const canSubmit = text.trim().length >= 3;

  return (
    <View style={styles.wrap}>
      <ThemedText style={styles.eyebrow}>Una pregunta para ti</ThemedText>
      <ThemedText style={styles.prompt}>{micro.prompt}</ThemedText>
      <TextField
        label="Tu reflexión"
        value={text}
        onChangeText={setText}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        style={{ minHeight: 140, paddingTop: Spacing.three }}
        helper="Lo que escribas se guarda solo para ti."
      />
      <Button
        label="Guardar y continuar"
        disabled={!canSubmit}
        loading={submitting}
        onPress={() => onSubmit(text.trim())}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three, marginTop: Spacing.four },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 11,
    color: Brand.sageDark,
  },
  prompt: { fontSize: 18, lineHeight: 26, color: Brand.brownDark },
});
