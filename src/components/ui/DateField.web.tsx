import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, Radius, Spacing } from '@/constants/theme';

export type DateFieldProps = {
  label: string;
  value: Date;
  onChange: (next: Date) => void;
  minDate?: Date;
};

function toInputValue(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Versión web: usamos un input HTML nativo `type=date` — el navegador
 * provee un picker accesible y consistente. No usamos
 * `@react-native-community/datetimepicker` porque no funciona en web.
 */
export function DateField({ label, value, onChange, minDate }: DateFieldProps) {
  const handle = (e: any) => {
    const v = e?.target?.value as string | undefined;
    if (!v) return;
    const [y, m, d] = v.split('-').map(Number);
    onChange(new Date(y!, (m ?? 1) - 1, d ?? 1, 9, 0, 0));
  };

  const InputAny = 'input' as any;
  return (
    <View style={styles.wrap}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <InputAny
        type="date"
        value={toInputValue(value)}
        min={minDate ? toInputValue(minDate) : undefined}
        onChange={handle}
        style={styles.input as any}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.two },
  label: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Brand.textSoft,
  },
  input: {
    minHeight: 44,
    paddingLeft: Spacing.three,
    paddingRight: Spacing.three,
    fontSize: 16,
    color: Brand.charcoal,
    backgroundColor: Brand.surfaceLow,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Brand.sand,
  },
});
