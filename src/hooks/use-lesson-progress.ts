import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/lib/auth-provider';
import {
  getLessonProgress,
  getProgressForWorld,
  startLesson,
  submitMicroResponse,
  updateVideoProgress,
} from '@/services/progress';

export function useLessonProgress(lessonId: string | undefined) {
  const { session } = useSession();
  return useQuery({
    queryKey: ['lesson-progress', session?.user.id, lessonId],
    queryFn: () => getLessonProgress(lessonId!),
    enabled: !!session && !!lessonId,
  });
}

export function useWorldProgress(worldId: string | undefined) {
  const { session } = useSession();
  return useQuery({
    queryKey: ['world-progress', session?.user.id, worldId],
    queryFn: () => getProgressForWorld(worldId!),
    enabled: !!session && !!worldId,
  });
}

export function useStartLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: startLesson,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['lesson-progress'] });
      qc.invalidateQueries({ queryKey: ['world-progress'] });
    },
  });
}

export function useUpdateVideoProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateVideoProgress,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lesson-progress'] });
      qc.invalidateQueries({ queryKey: ['world-progress'] });
    },
  });
}

export function useSubmitMicroResponse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: submitMicroResponse,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lesson-progress'] });
      qc.invalidateQueries({ queryKey: ['world-progress'] });
      qc.invalidateQueries({ queryKey: ['user-rewards'] });
      qc.invalidateQueries({ queryKey: ['user-streaks'] });
    },
  });
}
