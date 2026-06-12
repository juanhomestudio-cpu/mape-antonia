import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing } from '@/constants/theme';

type Props = {
  displayName?: string;
  email?: string;
};

function initials(name?: string) {
  if (!name) return 'M';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}

export function ProfileHeader({ displayName, email }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.avatar}>
        <ThemedText style={styles.avatarText}>{initials(displayName)}</ThemedText>
      </View>
      <View style={styles.info}>
        <ThemedText style={styles.name}>{displayName ?? 'Mujer'}</ThemedText>
        {email && <ThemedText style={styles.email}>{email}</ThemedText>}
      </View>
      <Pressable
        onPress={() => router.push('/settings')}
        hitSlop={12}
        style={({ pressed }) => [styles.settingsBtn, pressed && { opacity: 0.6 }]}>
        <SymbolView name="gearshape" tintColor={Brand.sageDark} size={22} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Brand.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: Brand.white, fontSize: 22, fontWeight: '500' },
  info: { flex: 1 },
  name: { color: Brand.brownDark, fontSize: 20, lineHeight: 24 },
  email: { color: Brand.sageDark, fontSize: 13, marginTop: 2 },
  settingsBtn: { padding: Spacing.one },
});
