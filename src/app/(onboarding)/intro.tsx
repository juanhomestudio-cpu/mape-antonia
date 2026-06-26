import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/Button';
import { VimeoPlayer } from '@/components/lesson/VimeoPlayer';
import { Brand, Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { markIntroSeen } from '@/services/onboarding';

async function getIntroVideo() {
  const { data, error } = await supabase
    .from('worlds')
    .select('intro_vimeo_id, intro_vimeo_hash, title, subtitle')
    .eq('slug', 'un-dia-naci')
    .single();
  if (error) throw error;
  return data;
}

export default function IntroScreen() {
  const { data, isLoading } = useQuery({ queryKey: ['intro'], queryFn: getIntroVideo });
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    // Marca intro_seen al entrar; el botón Continuar se habilita tras un breve
    // delay para que el usuario no salte sin haber visto al menos algo del video.
    markIntroSeen().catch(() => {});
    const t = setTimeout(() => setCanContinue(true), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.body}>
        <ThemedText style={styles.eyebrow}>Paso 2 de 4</ThemedText>
        <ThemedText type="title" style={styles.title}>
          Bienvenida
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Antonia y Mape te dan la bienvenida. Tómate un momento para escucharlas.
        </ThemedText>

        <View style={styles.playerWrap}>
          {isLoading || !data?.intro_vimeo_id ? (
            <View style={styles.playerSkeleton}>
              <ThemedText style={{ color: Brand.surfaceLow }}>Cargando…</ThemedText>
            </View>
          ) : (
            <VimeoPlayer
              vimeoId={data.intro_vimeo_id}
              vimeoHash={data.intro_vimeo_hash}
              onEnded={() => setCanContinue(true)}
            />
          )}
        </View>
      </View>

      <Button
        label="Continuar"
        onPress={() => router.push('/diagnostic')}
        disabled={!canContinue}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone, padding: Spacing.four },
  body: { flex: 1 },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: Brand.textSoft,
    marginBottom: Spacing.two,
    marginTop: Spacing.three,
  },
  title: { color: Brand.charcoal, marginBottom: Spacing.three, fontSize: 28 },
  subtitle: { color: Brand.textSoft, lineHeight: 24, marginBottom: Spacing.four },
  playerWrap: { marginBottom: Spacing.four },
  playerSkeleton: {
    aspectRatio: 16 / 9,
    backgroundColor: Brand.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
});
