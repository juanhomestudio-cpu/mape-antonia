import { useQuery } from '@tanstack/react-query';

import { getLessonById, getLessonsForWorld, getWorldBySlug, getWorlds } from '@/services/content';

export function useWorlds() {
  return useQuery({ queryKey: ['worlds'], queryFn: getWorlds });
}

export function useWorld(slug: string | undefined) {
  return useQuery({
    queryKey: ['world', slug],
    queryFn: () => getWorldBySlug(slug!),
    enabled: !!slug,
  });
}

export function useLessonsForWorld(worldId: string | undefined) {
  return useQuery({
    queryKey: ['lessons', worldId],
    queryFn: () => getLessonsForWorld(worldId!),
    enabled: !!worldId,
  });
}

export function useLesson(id: string | undefined) {
  return useQuery({
    queryKey: ['lesson', id],
    queryFn: () => getLessonById(id!),
    enabled: !!id,
  });
}
