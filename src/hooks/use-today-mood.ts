import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/lib/auth-provider';
import { getMoodHistory, getTodayMood, upsertTodayMood } from '@/services/mood';

export function useTodayMood() {
  const { session } = useSession();
  return useQuery({
    queryKey: ['mood', 'today', session?.user.id],
    queryFn: getTodayMood,
    enabled: !!session,
  });
}

export function useMoodHistory(days = 14) {
  const { session } = useSession();
  return useQuery({
    queryKey: ['mood', 'history', session?.user.id, days],
    queryFn: () => getMoodHistory(days),
    enabled: !!session,
  });
}

export function useUpsertTodayMood() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { mood: Parameters<typeof upsertTodayMood>[0]; note?: string }) =>
      upsertTodayMood(args.mood, args.note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mood'] });
      qc.invalidateQueries({ queryKey: ['streak'] });
      qc.invalidateQueries({ queryKey: ['user-rewards'] });
    },
  });
}
