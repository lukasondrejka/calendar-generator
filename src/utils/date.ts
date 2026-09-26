export const MIN_YEAR = 1900;
export const MAX_YEAR = 2199;

export const addDays = (date: Date, days: number): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

export const firstDayOfWeek = (date: Date, startsOnSunday: boolean): Date =>
  addDays(date, -((date.getDay() + (startsOnSunday ? 7 : 6)) % 7));

// Local YYYY-MM-DD (toISOString would give the UTC date)
export const toDateString = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const todayAsString = (): string => toDateString(new Date());

// Local midnight (new Date('YYYY-MM-DD') would be UTC midnight)
export const parseDate = (value: string): Date => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Also rejects dates the date input emits while a year is being typed, e.g. 0002-09-26
export const isValidDateString = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const date = parseDate(value);
  const year = date.getFullYear();
  return year >= MIN_YEAR && year <= MAX_YEAR && toDateString(date) === value;
};

// ISO 8601 week number
export const isoWeek = (date: Date): number => {
  const thursday = addDays(date, 3 - ((date.getDay() + 6) % 7));
  const firstThursday = new Date(thursday.getFullYear(), 0, 4);
  const week1Thursday = addDays(firstThursday, 3 - ((firstThursday.getDay() + 6) % 7));
  return 1 + Math.round((thursday.getTime() - week1Thursday.getTime()) / (7 * 24 * 60 * 60 * 1000));
};

// e.g. M T W T F S S
export const weekdayLabels = (locale: string, startsOnSunday: boolean): string[] => {
  const format = new Intl.DateTimeFormat(locale, { weekday: 'narrow' });
  const first = new Date(2024, 0, startsOnSunday ? 7 : 1); // 2024-01-01 was a Monday
  return Array.from({ length: 7 }, (_, i) => format.format(addDays(first, i)).toLocaleUpperCase(locale));
};

// e.g. OCT, MÁJ
export const monthLabel = (date: Date, locale: string): string =>
  date.toLocaleString(locale, { month: 'short' }).replace(/\.$/, '').toLocaleUpperCase(locale);

const monthName = (date: Date, locale: string): string => {
  const name = date.toLocaleString(locale, { month: 'long' });
  return name.charAt(0).toLocaleUpperCase(locale) + name.slice(1);
};

// e.g. "September – December 2026", "November 2026 – February 2027"
export const monthRange = (start: Date, end: Date, locale: string): string => {
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();
  if (startYear !== endYear)
    return `${monthName(start, locale)} ${startYear} – ${monthName(end, locale)} ${endYear}`;
  if (start.getMonth() !== end.getMonth())
    return `${monthName(start, locale)} – ${monthName(end, locale)} ${endYear}`;
  return `${monthName(start, locale)} ${endYear}`;
};

// In the browser's locale, e.g. "Sep 28 – Nov 22, 2026"
export const formatDate = (date: Date): string =>
  date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export const formatDateRange = (start: Date, end: Date): string =>
  new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).formatRange(start, end);
