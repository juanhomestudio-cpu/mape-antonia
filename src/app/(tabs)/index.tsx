import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContinueCard } from '@/components/home/ContinueCard';
import { DailyRitualCard } from '@/components/home/DailyRitualCard';
import { DevTools } from '@/components/home/DevTools';
import { Greeting } from '@/components/home/Greeting';
import { MoodCheckIn } from '@/components/home/MoodCheckIn';
import { PausaConsciente } from '@/components/home/PausaConsciente';
import { SanctuaryBackground } from '@/components/home/SanctuaryBackground';
import { ThemedText } from '@/components/themed-text';
import { Brand, Fonts, Spacing } from '@/constants/theme';
import { useProfile } from '@/hooks/use-profile';
import { useStreak } from '@/hooks/use-streak';

export default function HomeTab() {
  const { data: profile } = useProfile();
  const { data: streak } = useStreak();

  return (
    <View style={styles.container}>
      <SanctuaryBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.header}>
          <ThemedText style={styles.brandTitle}>SANTUARIO</ThemedText>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}>
          <Greeting
            displayName={profile?.display_name}
            streakDays={streak?.current_streak ?? 0}
          />

          <PausaConsciente />
          <MoodCheckIn />

          <View style={styles.stack}>
            <ContinueCard />
            <DailyRitualCard />
          </View>

          <DevTools />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone },
  header: {
    alignItems: 'center',
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
  },
  brandTitle: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 13,
    color: Brand.primaryBrown,
    letterSpacing: 4,
  },
  scroll: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    paddingBottom: Spacing.six * 2,
    alignItems: 'center',
  },
  stack: { gap: Spacing.three, width: '100%' },
});
