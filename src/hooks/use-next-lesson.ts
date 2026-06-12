import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/lib/auth-provider';
import { getNextLesson } from '@/services/next-lesson';

export function useNextLesson() {
  const { session } = useSession();
  return useQuery({
    queryKey: ['next-lesson', session?.user.id],
    queryFn: getNextLesson,
    enabled: !!session,
  });
}
