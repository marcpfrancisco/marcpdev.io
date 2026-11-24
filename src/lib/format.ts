/** Two-digit folio and code numbers: 1 becomes "01". */
export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/**
 * "14 Sep 2026". One fixed format site-wide: Intl's en-GB short month gives "Sept",
 * which breaks the three-letter rhythm of the file markings.
 */
export function fileDate(date: Date): string {
  return `${String(date.getDate())} ${MONTHS[date.getMonth()]} ${String(date.getFullYear())}`;
}

/** Splits "YYYY-MM" or "YYYY-MM-DD" into numbers; missing parts default to 1. */
function isoParts(iso: string): { year: number; month: number; day: number } {
  const [year = '2000', month = '1', day = '1'] = iso.split('-');
  return { year: Number(year), month: Number(month), day: Number(day) };
}

/** Same format from an ISO date string (YYYY-MM-DD), read as a calendar date, not UTC. */
export function fileDateFromIso(iso: string): string {
  const { year, month, day } = isoParts(iso);
  return fileDate(new Date(year, month - 1, day));
}

/** "Sep 2026" for year-month strings (YYYY-MM). */
export function fileMonth(yearMonth: string): string {
  const { year, month } = isoParts(yearMonth);
  return `${MONTHS[month - 1]} ${String(year)}`;
}
