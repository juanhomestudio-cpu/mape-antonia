import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

async function getArchetypeById(id: string) {
  const { data, error } = await supabase
    .from('archetypes')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export function useArchetype(id: string | null | undefined) {
  return useQuery({
    queryKey: ['archetype', id],
    queryFn: () => getArchetypeById(id!),
    enabled: !!id,
  });
}
