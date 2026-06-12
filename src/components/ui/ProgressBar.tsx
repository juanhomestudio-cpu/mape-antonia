import { StyleSheet, View } from 'react-native';

import { Brand, Radius } from '@/constants/theme';

type Props = {
  /** Valor entre 0 y 1 */
  value: number;
  color?: string;
  height?: number;
};

export function ProgressBar({ value, color = Brand.terracotta, height = 6 }: Props) {
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clamped * 100}%`,
            height,
            borderRadius: height / 2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { backgroundColor: Brand.beigeWarm, overflow: 'hidden', borderRadius: Radius.pill },
  fill: { },
});
