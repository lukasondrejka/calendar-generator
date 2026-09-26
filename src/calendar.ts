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
  rangeStart: Date;
  rangeEnd: Date;
}

export const buildPages = ({ weeksPerPage, startOnDate, startWeekOn, pageCount }: Settings): CalendarPage[] => {
  const firstDay = firstDayOfWeek(parseDate(startOnDate), startWeekOn === 'Sunday');
  return Array.from({ length: pageCount }, (_, index) => {
    const pageStart = addDays(firstDay, index * weeksPerPage * 7);
    return {
      firstDay: pageStart,
      weeks: weeksPerPage,
      rangeStart: pageStart,
      rangeEnd: addDays(pageStart, weeksPerPage * 7 - 1),
    };
  });
};
