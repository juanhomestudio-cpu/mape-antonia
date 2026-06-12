import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/lib/auth-provider';
import { getMyRewards, getRandomUnlockedRitual, type RewardFilter } from '@/services/rewards';

export function useMyRewards(filter: RewardFilter = {}) {
  const { session } = useSession();
  return useQuery({
    queryKey: ['user-rewards', session?.user.id, filter],
    queryFn: () => getMyRewards(filter),
    enabled: !!session,
  });
}

export function useDailyRitual() {
  const { session } = useSession();
  return useQuery({
    queryKey: ['user-rewards', 'daily-ritual', session?.user.id],
    queryFn: getRandomUnlockedRitual,
    enabled: !!session,
    staleTime: 6 * 60 * 60 * 1000, // 6 horas: el ritual del día cambia con baja frecuencia
  });
}
