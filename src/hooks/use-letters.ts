import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/lib/auth-provider';
import { createLetter, getLetterById, listMyLetters, splitLetters } from '@/services/letters';

export function useMyLetters() {
  const { session } = useSession();
  const q = useQuery({
    queryKey: ['letters', session?.user.id],
    queryFn: listMyLetters,
    enabled: !!session,
  });
  return {
    ...q,
    split: q.data ? splitLetters(q.data) : { past: [], scheduled: [] },
  };
}

export function useLetter(id: string | undefined) {
  return useQuery({
    queryKey: ['letter', id],
    queryFn: () => getLetterById(id!),
    enabled: !!id,
  });
}

export function useCreateLetter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createLetter,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['letters'] });
    },
  });
}
