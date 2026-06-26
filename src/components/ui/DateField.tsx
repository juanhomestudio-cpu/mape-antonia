import { Platform, Pressable, StyleSheet, View } from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { Brand, Radius, Spacing } from '@/constants/theme';

export type DateFieldProps = {
  label: string;
  value: Date;
  onChange: (next: Date) => void;
  minDate?: Date;
};

function formatDate(d: Date) {
  return d.toLocaleDateString('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Versión nativa: muestra el calendario inline (iOS) o un botón que abre el
 * picker del sistema (Android). Para web, ver DateField.web.tsx.
 */
export function DateField({ label, value, onChange, minDate }: DateFieldProps) {
  const [androidOpen, setAndroidOpen] = useState(false);

  const handle = (_event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setAndroidOpen(false);
    if (date) onChange(date);
  };

  return (
    <View style={styles.wrap}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <Pressable
        onPress={() => Platform.OS === 'android' && setAndroidOpen(true)}
        style={styles.valueBtn}
        hitSlop={4}>
        <ThemedText style={styles.value}>{formatDate(value)}</ThemedText>
      </Pressable>
      {(Platform.OS === 'ios' || androidOpen) && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          minimumDate={minDate}
          onChange={handle}
          locale="es-CO"
          themeVariant="light"
        />
      )}
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
  valueBtn: { paddingVertical: Spacing.one },
  value: {
    color: Brand.charcoal,
    fontSize: 16,
    textTransform: 'capitalize',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: Brand.surfaceLow,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Brand.sand,
  },
});
