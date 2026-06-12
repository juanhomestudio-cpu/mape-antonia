import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContinueCard } from '@/components/home/ContinueCard';
import { DailyRitualCard } from '@/components/home/DailyRitualCard';
import { DevTools } from '@/components/home/DevTools';
import { Greeting } from '@/components/home/Greeting';
import { MoodCheckIn } from '@/components/home/MoodCheckIn';
import { Brand, Spacing } from '@/constants/theme';
import { useProfile } from '@/hooks/use-profile';
import { useStreak } from '@/hooks/use-streak';

export default function HomeTab() {
  const { data: profile } = useProfile();
  const { data: streak } = useStreak();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Greeting
          displayName={profile?.display_name}
          streakDays={streak?.current_streak ?? 0}
        />

        <View style={styles.stack}>
          <MoodCheckIn />
          <ContinueCard />
          <DailyRitualCard />
        </View>

        <DevTools />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone },
  scroll: { padding: Spacing.four, paddingBottom: Spacing.six },
  stack: { gap: Spacing.three },
});
