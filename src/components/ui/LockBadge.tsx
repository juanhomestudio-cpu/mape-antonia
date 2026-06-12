import { StyleSheet, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { Brand, Radius, Spacing } from '@/constants/theme';

export function LockBadge({ size = 22 }: { size?: number }) {
  return (
    <View style={[styles.wrap, { width: size + Spacing.two, height: size + Spacing.two }]}>
      <SymbolView name="lock.fill" tintColor={Brand.sand} size={size * 0.6} resizeMode="scaleAspectFit" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: Brand.beigeWarm,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
