/**
 * V1 fuerza modo claro (estética premium femenina del documento, sección 3).
 * Colors.dark = Colors.light, así que no consultamos el scheme del sistema.
 */
import { Colors } from '@/constants/theme';

export function useTheme() {
  return Colors.light;
}
