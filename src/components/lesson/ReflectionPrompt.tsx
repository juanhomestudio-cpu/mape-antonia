import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/Button';
import { Brand, Fonts, Radius, Spacing } from '@/constants/theme';
import type { MicroExperience } from '@/services/content';

type Props = {
  micro: MicroExperience;
  submitting?: boolean;
  onSubmit: (text: string) => void;
};

/**
 * Bloque "Una pausa para ti" del diseño Stitch. Input minimalista solo con
 * línea inferior, sin caja de texto pesada. Botón pill grande para cerrar
 * la clase.
 */
export function ReflectionPrompt({ micro, submitting, onSubmit }: Props) {
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const canSubmit = text.trim().length >= 3;

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Una pausa para ti</ThemedText>
        <ThemedText style={styles.prompt}>{micro.prompt}</ThemedText>
      </View>

      <View style={styles.inputArea}>
        <TextInput
          value={text}
          onChangeText={setText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Escribe lo que sientes aquí…"
          placeholderTextColor={Brand.outline}
          multiline
          style={styles.input}
        />
        <View
          style={[
            styles.underline,
            focused && { backgroundColor: Brand.terracotta, opacity: 1 },
          ]}
        />
      </View>

      <View style={styles.cta}>
        <Button
          label="CONTINUAR MI CAMINO"
          disabled={!canSubmit}
          loading={submitting}
          onPress={() => onSubmit(text.trim())}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'rgba(245,242,237,0.4)',
    borderRadius: Radius.xl,
    padding: Spacing.five,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    gap: Spacing.five,
    marginTop: Spacing.five,
  },
  header: { alignItems: 'center', gap: Spacing.two },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    lineHeight: 30,
    color: Brand.primaryBrown,
    opacity: 0.85,
    textAlign: 'center',
  },
  prompt: {
    fontFamily: Fonts.sans,
    fontStyle: 'italic',
    fontSize: 15,
    lineHeight: 22,
    color: Brand.textSoft,
    textAlign: 'center',
  },
  inputArea: { paddingHorizontal: Spacing.two },
  input: {
    fontFamily: Fonts.sans,
    fontSize: 17,
    lineHeight: 26,
    color: Brand.primaryBrown,
    minHeight: 80,
    padding: 0,
    textAlignVertical: 'top',
  },
  underline: {
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: Brand.outline,
    opacity: 0.5,
    marginTop: Spacing.two,
  },
  cta: { alignItems: 'center', marginTop: Spacing.two },
});
