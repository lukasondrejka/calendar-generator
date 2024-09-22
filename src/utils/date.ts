export const firstDayOfWeek = (date: Date, startWeekOnSunday: boolean): Date => {
  const firstDayOfWeek = new Date(date);
  const dayOffset = startWeekOnSunday ? 0 : 1;
  firstDayOfWeek.setDate(firstDayOfWeek.getDate() - ((firstDayOfWeek.getDay() + 7 - dayOffset) % 7));
  
  return firstDayOfWeek;
}