/**
 * Devuelve la fecha local del dispositivo en formato YYYY-MM-DD.
 * Útil para uniqueness por día (mood_checkins, rachas).
 */
export function todayLocalDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
