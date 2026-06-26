import { StyleSheet, View, type ViewProps } from 'react-native';

import { Brand, Radius, Spacing } from '@/constants/theme';
import { VoiceTokens, type Voice } from '@/constants/theme';

type Props = ViewProps & {
  voice?: Voice;
};

export function Card({ voice, style, children, ...rest }: Props) {
  const borderColor = voice ? VoiceTokens[voice].accent : Brand.sand;
  return (
    <View style={[styles.card, { borderColor }, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Brand.surfaceLow,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    shadowColor: Brand.charcoal,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
});
