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

export const todayAsString = (): string => {
  return new Date().toISOString().split('T')[0];
}
