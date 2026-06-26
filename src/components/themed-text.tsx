import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, Type, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'        // body Work Sans 16/26
    | 'bodyLg'         // body 18/31
    | 'title'          // headline serif 32 (mobile)
    | 'titleLg'        // headline serif 42
    | 'titleMd'        // headline serif 28
    | 'caps'           // label tag uppercase 12
    | 'small'          // 14/20 sans
    | 'smallBold'      // 14/20 sans semibold
    | 'subtitle'       // 24 serif
    | 'link';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && styles.default,
        type === 'bodyLg' && styles.bodyLg,
        type === 'title' && styles.title,
        type === 'titleLg' && styles.titleLg,
        type === 'titleMd' && styles.titleMd,
        type === 'subtitle' && styles.subtitle,
        type === 'caps' && styles.caps,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'link' && styles.link,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: Type.bodyMd,
  bodyLg: Type.bodyLg,
  title: Type.headlineLgM,
  titleLg: Type.headlineLg,
  titleMd: Type.headlineMd,
  subtitle: { fontFamily: Fonts.serif, fontSize: 24, lineHeight: 32 },
  caps: Type.labelCaps,
  small: { fontFamily: Fonts.sans, fontSize: 14, lineHeight: 20 },
  smallBold: { fontFamily: Fonts.sansSemiBold, fontSize: 14, lineHeight: 20 },
  link: { fontFamily: Fonts.sansMedium, fontSize: 14, lineHeight: 20 },
});
