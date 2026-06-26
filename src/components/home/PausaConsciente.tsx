import { Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { Brand, Fonts, Spacing } from '@/constants/theme';

/**
 * "Pausa consciente" — la acción central del home según el Design System.
 * Un blob orgánico que invita a detenerse un instante. Por ahora, tap = feedback
 * háptico + animación visual sutil; más adelante puede abrir una respiración
 * guiada.
 */
export function PausaConsciente() {
  const onPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft).catch(() => {});
  };

  return (
    <View style={styles.wrap}>
      {/* Halo difuso terracota detrás del blob */}
      <View style={styles.halo} pointerEvents="none" />

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.blob, pressed && { transform: [{ scale: 0.97 }] }]}>
        <View style={styles.innerDot} />
        <ThemedText type="caps" style={styles.label}>
          PAUSA{'\n'}CONSCIENTE
        </ThemedText>
      </Pressable>

      <ThemedText style={styles.quote}>
        “Tómate un instante para observar cómo habitas tu cuerpo hoy.”
      </ThemedText>
    </View>
  );
}

const SIZE = 200;

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: Spacing.six },
  halo: {
    position: 'absolute',
    width: SIZE * 1.6,
    height: SIZE * 1.6,
    top: -SIZE * 0.3,
    borderRadius: SIZE,
    backgroundColor: Brand.terracotta,
    opacity: 0.15,
  },
  blob: {
    width: SIZE,
    height: SIZE,
    // Asimetría orgánica — del Design System (super-elipse irregular)
    borderTopLeftRadius: SIZE * 0.4,
    borderTopRightRadius: SIZE * 0.55,
    borderBottomRightRadius: SIZE * 0.45,
    borderBottomLeftRadius: SIZE * 0.5,
    backgroundColor: Brand.white,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    shadowColor: Brand.primaryBrown,
    shadowOpacity: 0.12,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  innerDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: Brand.terracotta,
    backgroundColor: 'transparent',
  },
  label: {
    color: Brand.primaryBrown,
    textAlign: 'center',
    letterSpacing: 2.4,
    fontSize: 11,
    lineHeight: 16,
  },
  quote: {
    fontFamily: Fonts.sans,
    fontStyle: 'italic',
    fontSize: 14,
    lineHeight: 22,
    color: Brand.textSoft,
    textAlign: 'center',
    marginTop: Spacing.four,
    maxWidth: 280,
    opacity: 0.85,
  },
});
