import { addDays, firstDayOfWeek, parseDate } from './utils/date';
import type { PageSize, Settings } from './settings';

// Page geometry in cm
export const paperSizes: Record<PageSize, { width: number; height: number }> = {
  A4: { width: 21, height: 29.7 },
  Letter: { width: 21.59, height: 27.94 },
};
export const HEADER_HEIGHT = 1.5;
export const ROW_GAP = 0.4;
export const WEEK_NUMBER_WIDTH = 0.8;

export interface CalendarPage {
  firstDay: Date; // first day of the first row
  weeks: number;
  // Days belonging to the page; other days in the first and last row are dimmed
  rangeStart: Date;
  rangeEnd: Date;
}

const lastDayOfMonth = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0);

const weekRows = (start: Date, end: Date, startsOnSunday: boolean): number => {
  const first = firstDayOfWeek(start, startsOnSunday);
  const last = firstDayOfWeek(end, startsOnSunday);
  // Rounded, because a daylight saving change makes a week an hour shorter or longer
  return Math.round((last.getTime() - first.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
};

export const buildPages = ({ pagination, weeksPerPage, monthsPerPage, startOnDate, startWeekOn, pageCount }: Settings): CalendarPage[] => {
  const startsOnSunday = startWeekOn === 'Sunday';
  const start = parseDate(startOnDate);

  if (pagination === 'weeks') {
    const firstDay = firstDayOfWeek(start, startsOnSunday);
    return Array.from({ length: pageCount }, (_, index) => {
      const pageStart = addDays(firstDay, index * weeksPerPage * 7);
      return {
        firstDay: pageStart,
        weeks: weeksPerPage,
        rangeStart: pageStart,
        rangeEnd: addDays(pageStart, weeksPerPage * 7 - 1),
      };
    });
  }

  // Whole months, starting with the month of the start date (two months take at most 10 rows)
  let month = new Date(start.getFullYear(), start.getMonth(), 1);
  return Array.from({ length: pageCount }, () => {
    const rangeStart = month;
    const rangeEnd = lastDayOfMonth(new Date(month.getFullYear(), month.getMonth() + monthsPerPage - 1, 1));
    month = addDays(rangeEnd, 1);
    return {
      firstDay: firstDayOfWeek(rangeStart, startsOnSunday),
      weeks: weekRows(rangeStart, rangeEnd, startsOnSunday),
      rangeStart,
      rangeEnd,
    };
  });
};
