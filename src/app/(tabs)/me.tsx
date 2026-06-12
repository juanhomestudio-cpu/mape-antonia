import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ArchetypeBadge } from '@/components/me/ArchetypeBadge';
import { LettersList } from '@/components/me/LettersList';
import { MoodHistoryStrip } from '@/components/me/MoodHistoryStrip';
import { ProfileHeader } from '@/components/me/ProfileHeader';
import { ReflectionsList } from '@/components/me/ReflectionsList';
import { Brand, Spacing } from '@/constants/theme';
import { useArchetype } from '@/hooks/use-archetype';
import { useMyLetters } from '@/hooks/use-letters';
import { useMoodHistory } from '@/hooks/use-today-mood';
import { useProfile } from '@/hooks/use-profile';
import { useMyReflections } from '@/hooks/use-reflections';
import { useSession } from '@/lib/auth-provider';

export default function MeTab() {
  const { session } = useSession();
  const { data: profile } = useProfile();
  const { data: archetype } = useArchetype(profile?.current_archetype_id);
  const { data: moods = [] } = useMoodHistory(14);
  const letters = useMyLetters();
  const { data: reflections = [] } = useMyReflections();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ProfileHeader displayName={profile?.display_name} email={session?.user.email} />

        {archetype && (
          <View style={styles.section}>
            <ArchetypeBadge
              archetypeName={archetype.name}
              voice={archetype.voice}
              shortDescription={archetype.short_description}
            />
          </View>
        )}

        <View style={styles.section}>
          <MoodHistoryStrip checkins={moods} days={7} />
        </View>

        <View style={styles.section}>
          <LettersList past={letters.split.past} scheduled={letters.split.scheduled} />
        </View>

        <View style={styles.section}>
          <ReflectionsList items={reflections} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.bone },
  scroll: { padding: Spacing.four, paddingBottom: Spacing.six },
  section: { marginBottom: Spacing.four },
});
