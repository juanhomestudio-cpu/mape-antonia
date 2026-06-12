import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

export type Reward = Database['public']['Tables']['rewards']['Row'];
export type UserReward = Database['public']['Tables']['user_rewards']['Row'] & {
  reward: Reward | null;
};

export type RewardFilter = {
  kinds?: Database['public']['Enums']['reward_kind'][];
  voices?: Database['public']['Enums']['voice'][];
  search?: string;
};

export async function getMyRewards(filter: RewardFilter = {}): Promise<UserReward[]> {
  const { data, error } = await supabase
    .from('user_rewards')
    .select('*, reward:rewards(*)')
    .order('unlocked_at', { ascending: false });
  if (error) throw error;
  const rows = (data ?? []) as UserReward[];
  let filtered = rows;
  if (filter.kinds?.length) {
    filtered = filtered.filter((r) => r.reward && filter.kinds!.includes(r.reward.kind));
  }
  if (filter.voices?.length) {
    filtered = filtered.filter((r) => r.reward && filter.voices!.includes(r.reward.voice));
  }
  if (filter.search?.trim()) {
    const q = filter.search.trim().toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.reward &&
        (r.reward.title.toLowerCase().includes(q) ||
          r.reward.subtitle?.toLowerCase().includes(q) ||
          r.reward.category?.toLowerCase().includes(q)),
    );
  }
  return filtered;
}

/** Devuelve un ritual desbloqueado al azar (para "Mi ritual de hoy"). */
export async function getRandomUnlockedRitual(): Promise<UserReward | null> {
  const all = await getMyRewards({ kinds: ['ritual'] });
  if (all.length === 0) return null;
  const idx = Math.floor(Math.random() * all.length);
  return all[idx];
}
