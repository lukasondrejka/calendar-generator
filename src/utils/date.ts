export const firstDayOfWeek = (date: Date, startWeekOnSunday: boolean): Date => {
  const firstDayOfWeek = new Date(date);
  const dayOffset = startWeekOnSunday ? 0 : 1;
  firstDayOfWeek.setDate(firstDayOfWeek.getDate() - ((firstDayOfWeek.getDay() + 7 - dayOffset) % 7));
  
  return firstDayOfWeek;
}

export const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);

  return newDate;
}

export const addWeeks = (date: Date, weeks: number): Date => {
  return addDays(date, weeks * 7);
}

// Local YYYY-MM-DD (toISOString would give the UTC date)
export const toDateString = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export const todayAsString = (): string => {
  return toDateString(new Date());
}

// Local midnight (new Date('YYYY-MM-DD') would be UTC midnight)
export const parseDate = (value: string): Date => {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return isNaN(date.getTime()) ? new Date() : date;
}
