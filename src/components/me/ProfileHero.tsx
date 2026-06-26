import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { Brand, Fonts, Spacing } from '@/constants/theme';

type Props = {
  displayName?: string;
  evolutionaryState: string;
};

function initials(name?: string) {
  if (!name) return 'M';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}

export function ProfileHero({ displayName, evolutionaryState }: Props) {
  const state = evolutionaryState;

  return (
    <View style={styles.wrap}>
      {/* Botón settings flotante */}
      <Pressable
        onPress={() => router.push('/settings')}
        hitSlop={12}
        style={({ pressed }) => [styles.settingsBtn, pressed && { opacity: 0.6 }]}>
        <SymbolView name="gearshape" tintColor={Brand.primaryBrown} size={22} />
      </Pressable>

      <View style={styles.avatarOuter}>
        <View style={styles.avatar}>
          <ThemedText style={styles.avatarText}>{initials(displayName)}</ThemedText>
        </View>
        {/* Pequeño badge esquina con ícono planta (símbolo de crecimiento) */}
        <View style={styles.badge}>
          <SymbolView name="leaf.fill" tintColor={Brand.white} size={14} />
        </View>
      </View>

      <ThemedText style={styles.name}>{displayName ?? 'Mujer'}</ThemedText>
      <ThemedText type="caps" style={styles.state}>
        {state}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: Spacing.three, marginBottom: Spacing.five, position: 'relative' },
  settingsBtn: { position: 'absolute', top: 0, right: 0, padding: Spacing.two },
  avatarOuter: { position: 'relative' },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Brand.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Brand.bone,
    shadowColor: Brand.primaryBrown,
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  avatarText: {
    fontFamily: Fonts.serif,
    color: Brand.white,
    fontSize: 44,
  },
  badge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Brand.eucalyptus,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Brand.primaryBrown,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  name: {
    fontFamily: Fonts.serif,
    fontSize: 28,
    lineHeight: 34,
    color: Brand.charcoal,
  },
  state: {
    color: Brand.terracotta,
    letterSpacing: 2.4,
  },
});
