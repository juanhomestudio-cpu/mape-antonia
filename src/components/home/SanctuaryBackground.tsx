import { Dimensions, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Brand } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

/**
 * Fondo atmosférico tipo "santuario líquido" del Design System.
 * Combina un gradiente cálido base con dos "blobs" de color (terracota
 * arriba-izquierda, eucalipto abajo-derecha) muy difusos. Sin animación
 * en V1 — añadiremos respiración con Reanimated en pulido final.
 */
export function SanctuaryBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={[Brand.bone, Brand.surfaceLow, Brand.surfaceMid]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          styles.blob,
          {
            backgroundColor: Brand.terracotta,
            top: -height * 0.15,
            left: -width * 0.25,
            width: width * 1.1,
            height: width * 1.1,
            opacity: 0.16,
          },
        ]}
      />
      <View
        style={[
          styles.blob,
          {
            backgroundColor: Brand.eucalyptus,
            bottom: -height * 0.1,
            right: -width * 0.3,
            width: width * 1.0,
            height: width * 1.0,
            opacity: 0.13,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    borderRadius: width,
    // El blur sintético en RN se aproxima con shadows muy difusas + opacity baja
    shadowColor: Brand.terracotta,
    shadowOpacity: 0.3,
    shadowRadius: 100,
    shadowOffset: { width: 0, height: 0 },
  },
});
