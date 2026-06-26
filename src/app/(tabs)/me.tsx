import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ArchetypeBadge } from '@/components/me/ArchetypeBadge';
import { BadgesGrid } from '@/components/me/BadgesGrid';
import { DiaryBanner } from '@/components/me/DiaryBanner';
import { LettersList } from '@/components/me/LettersList';
import { MoodHistoryStrip } from '@/components/me/MoodHistoryStrip';
import { ProfileHero } from '@/components/me/ProfileHero';
import { StreakCard } from '@/components/me/StreakCard';
import { SanctuaryBackground } from '@/components/home/SanctuaryBackground';
import { ThemedText } from '@/components/themed-text';
import { Brand, Fonts, Spacing } from '@/constants/theme';
import { useArchetype } from '@/hooks/use-archetype';
import { useMyLetters } from '@/hooks/use-letters';
import { useMoodHistory } from '@/hooks/use-today-mood';
import { useProfile } from '@/hooks/use-profile';
import { useMyReflections } from '@/hooks/use-reflections';
import { useMyRewards } from '@/hooks/use-rewards';
import { useStreak } from '@/hooks/use-streak';

export default function MeTab() {
  const { data: profile } = useProfile();
  const { data: archetype } = useArchetype(profile?.current_archetype_id);
  const { data: moods = [] } = useMoodHistory(14);
  const { data: streak } = useStreak();
  const { data: badges = [] } = useMyRewards({ kinds: ['badge'] });
  const letters = useMyLetters();
  const { data: reflections = [] } = useMyReflections();

  return (
    <View style={styles.container}>
      <SanctuaryBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.header}>
          <ThemedText style={styles.brandTitle}>SANTUARIO</ThemedText>
        </View>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <ProfileHero
            displayName={profile?.display_name}
            evolutionaryState={profile?.evolutionary_state}
            streakDays={streak?.current_streak ?? 0}
          />

          {archetype && (
            <View style={styles.section}>
              <ArchetypeBadge
                archetypeName={archetype.name}
                voice={archetype.voice}
                shortDescription={archetype.short_description}
                longDescription={archetype.long_description}
              />
            </View>
          )}

          <View style={styles.section}>
            <StreakCard
              currentStreak={streak?.current_streak ?? 0}
              longestStreak={streak?.longest_streak ?? 0}
            />
          </View>

          <View style={styles.section}>
            <MoodHistoryStrip checkins={moods} days={7} />
          </View>

          <View style={styles.section}>
            <BadgesGrid earned={badges} />
          </View>

          <View style={styles.section}>
            <LettersList past={letters.split.past} scheduled={letters.split.scheduled} />
          </View>

          <View style={styles.section}>
            <DiaryBanner
              reflectionCount={reflections.length}
              onPress={() => router.push('/tools')}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone },
  header: { alignItems: 'center', paddingTop: Spacing.three, paddingBottom: Spacing.three },
  brandTitle: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 13,
    color: Brand.primaryBrown,
    letterSpacing: 4,
  },
  scroll: { paddingHorizontal: Spacing.four, paddingBottom: Spacing.six * 2 },
  section: { marginBottom: Spacing.four },
});
