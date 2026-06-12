import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/lib/auth-provider';
import { listMyReflections } from '@/services/memories';

export function useMyReflections() {
  const { session } = useSession();
  return useQuery({
    queryKey: ['reflections', session?.user.id],
    queryFn: listMyReflections,
    enabled: !!session,
  });
}
