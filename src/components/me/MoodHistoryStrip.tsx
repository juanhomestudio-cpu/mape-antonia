import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/Card';
import { Brand, Spacing } from '@/constants/theme';
import type { MoodCheckin } from '@/services/mood';

const MOOD_COLOR: Record<MoodCheckin['mood'], string> = {
  luminosa: '#E5B567',
  calma: '#8FA68E',
  neutral: '#C9B79C',
  turbia: '#C9A9A0',
  agotada: '#5C6A4D',
};

const DAY_LABEL = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

function lastNDates(n: number): string[] {
  const out: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    );
  }
  return out;
}

function weekdayIndex(iso: string): number {
  // ISO yyyy-mm-dd → 0 (Lun) ... 6 (Dom)
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y!, (m ?? 1) - 1, d ?? 1);
  // JS: 0 (Dom) ... 6 (Sáb). Queremos 0 (Lun) ... 6 (Dom).
  return (date.getDay() + 6) % 7;
}

type Props = {
  checkins: MoodCheckin[];
  days?: number;
};

export function MoodHistoryStrip({ checkins, days = 7 }: Props) {
  const dates = lastNDates(days);
  const byDate = new Map(checkins.map((c) => [c.local_date, c]));

  return (
    <Card>
      <ThemedText style={styles.eyebrow}>Tu ánimo de la semana</ThemedText>
      <View style={styles.row}>
        {dates.map((iso) => {
          const checkin = byDate.get(iso);
          const dayLabel = DAY_LABEL[weekdayIndex(iso)];
          return (
            <View key={iso} style={styles.day}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: checkin ? MOOD_COLOR[checkin.mood] : Brand.surfaceMid,
                    borderColor: checkin ? 'transparent' : Brand.sand,
                  },
                ]}
              />
              <ThemedText style={styles.dayLabel}>{dayLabel}</ThemedText>
            </View>
          );
        })}
      </View>
      {checkins.length === 0 && (
        <ThemedText style={styles.empty}>
          Empieza haciendo tu check-in de hoy en Inicio.
        </ThemedText>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Brand.textSoft,
    marginBottom: Spacing.three,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.one },
  day: { alignItems: 'center', gap: Spacing.one, flex: 1 },
  dot: { width: 28, height: 28, borderRadius: 14, borderWidth: 1 },
  dayLabel: { fontSize: 11, color: Brand.textSoft, fontWeight: '500' },
  empty: { color: Brand.textSoft, fontSize: 13, lineHeight: 18, marginTop: Spacing.three },
});
