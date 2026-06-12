import { forwardRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, Radius, Spacing } from '@/constants/theme';

type Props = TextInputProps & {
  label: string;
  helper?: string;
  error?: string | null;
};

export const TextField = forwardRef<TextInput, Props>(function TextField(
  { label, helper, error, style, ...input },
  ref,
) {
  const hasError = Boolean(error);
  return (
    <View style={styles.wrap}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TextInput
        ref={ref}
        placeholderTextColor={Brand.sand}
        style={[styles.input, hasError && styles.inputError, style]}
        {...input}
      />
      {(error || helper) && (
        <ThemedText style={[styles.helper, hasError && styles.helperError]}>
          {error ?? helper}
        </ThemedText>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: Spacing.one, marginBottom: Spacing.three },
  label: {
    fontSize: 13,
    color: Brand.sageDark,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  input: {
    minHeight: 52,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Brand.sand,
    backgroundColor: Brand.beigeLight,
    color: Brand.brownDark,
    fontSize: 16,
  },
  inputError: { borderColor: Brand.terracotta },
  helper: { fontSize: 12, color: Brand.sageDark, marginTop: 2 },
  helperError: { color: Brand.terracotta },
});
