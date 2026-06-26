import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { Brand, Fonts, Radius, Spacing } from '@/constants/theme';

type Props = {
  reflectionCount: number;
  onPress: () => void;
};

/**
 * Banner grande tipo "diario emocional". El diseño Stitch usa una imagen
 * de fondo etérea; en RN replicamos con un gradiente cálido + overlay.
 */
export function DiaryBanner({ reflectionCount, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.wrap, pressed && { opacity: 0.85 }]}>
      <LinearGradient
        colors={[Brand.terracotta, Brand.primaryBrown]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bg}
      />
      <View style={styles.content}>
        <ThemedText type="caps" style={styles.eyebrow}>
          Tu legado emocional
        </ThemedText>
        <ThemedText style={styles.title}>Entrar al diario de reflejos</ThemedText>
        <View style={styles.row}>
          <ThemedText style={styles.count}>
            {reflectionCount} {reflectionCount === 1 ? 'reflexión guardada' : 'reflexiones guardadas'}
          </ThemedText>
          <SymbolView name="arrow.right" tintColor={Brand.white} size={16} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: Radius.xl, overflow: 'hidden', height: 160 },
  bg: { ...StyleSheet.absoluteFillObject },
  content: {
    flex: 1,
    padding: Spacing.five,
    justifyContent: 'flex-end',
    gap: Spacing.two,
  },
  eyebrow: { color: 'rgba(255,255,255,0.8)', letterSpacing: 1.5 },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    lineHeight: 30,
    color: Brand.white,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginTop: Spacing.two },
  count: { color: 'rgba(255,255,255,0.9)', fontSize: 13 },
});
