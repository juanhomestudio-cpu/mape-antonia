import { ActivityIndicator, Pressable, StyleSheet, View, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, Radius, Spacing } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: Variant;
  loading?: boolean;
};

export function Button({ label, variant = 'primary', loading, disabled, style, ...rest }: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant].container,
        pressed && !isDisabled && { opacity: 0.85 },
        isDisabled && { opacity: 0.5 },
        typeof style === 'function' ? undefined : style,
      ]}
      {...rest}>
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator color={variantStyles[variant].label.color} />
        ) : (
          <ThemedText style={[styles.label, variantStyles[variant].label]}>{label}</ThemedText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  label: { fontSize: 16, fontWeight: '500' },
});

const variantStyles = {
  primary: {
    container: { backgroundColor: Brand.terracotta },
    label: { color: Brand.white },
  },
  secondary: {
    container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Brand.sand },
    label: { color: Brand.charcoal },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    label: { color: Brand.textSoft },
  },
} as const;
