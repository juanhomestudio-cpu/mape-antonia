import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/lib/auth-provider';
import { getMyProfile } from '@/services/profile';

export function useProfile() {
  const { session } = useSession();
  return useQuery({
    queryKey: ['profile', session?.user.id],
    queryFn: getMyProfile,
    enabled: !!session,
  });
}
