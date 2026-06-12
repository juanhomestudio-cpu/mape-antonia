import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';

import { Brand } from '@/constants/theme';
import { AuthProvider } from '@/lib/auth-provider';
import { queryClient } from '@/lib/query-client';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Brand.bone,
    card: Brand.bone,
    text: Brand.brownDark,
    primary: Brand.terracotta,
    border: Brand.sand,
    notification: Brand.terracotta,
  },
};

export default function RootLayout() {
  // V1: modo claro forzado. Ignoramos useColorScheme.
  return (
    <ThemeProvider value={navTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Brand.bone } }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
