import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/lib/auth-provider';
import { getMyStreak } from '@/services/streak';

export function useStreak() {
  const { session } = useSession();
  return useQuery({
    queryKey: ['streak', session?.user.id],
    queryFn: getMyStreak,
    enabled: !!session,
  });
}
