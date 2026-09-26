import React from 'react';
import './CalendarSVG.css';
import { resolveLocale } from '../settings';
import type { Settings } from '../settings';
import { HEADER_HEIGHT, paperSizes, ROW_GAP, WEEK_NUMBER_WIDTH } from '../calendar';
import type { CalendarPage } from '../calendar';
import { addDays, isoWeek, monthLabel, monthRange, weekdayLabels } from '../utils/date';
import { fitText, textWidth } from '../utils/text';
import { cmToPx } from '../utils/units';

const LINE = '#000';
const WEEKEND_FILL = '#f0f0f0';
const MUTED_TEXT = '#666';
const OUTSIDE_TEXT = '#b3b3b3';

const cm = (value: number) => `${value}cm`;

const CalendarSVG: React.FC<{
  settings: Settings;
  page: CalendarPage;
  pageNumber: number;
  pageCount: number;
}> = ({ settings, page, pageNumber, pageCount }) => {
  const { startWeekOn, pageSize, margin, title, shadeWeekends, showWeekNumbers } = settings;
  const { firstDay, weeks, rangeStart, rangeEnd } = page;
  const locale = resolveLocale(settings.locale);
  const startsOnSunday = startWeekOn === 'Sunday';
  const { width, height } = paperSizes[pageSize];

  // Week numbers get their own column inside the margin area
  const left = margin + (showWeekNumbers ? WEEK_NUMBER_WIDTH : 0);
  const right = width - margin;
  const top = margin + HEADER_HEIGHT;
  const bottom = height - margin;
  const cellWidth = (right - left) / 7;
  const cellHeight = (bottom - top) / weeks;
  const headerY = margin + 0.55;

  const months = monthRange(rangeStart, rangeEnd, locale);
  const header = title.trim()
    ? fitText(title.trim(), right - left - textWidth(months, 14) - 0.6, 20, 12, 'bold')
    : null;

  return (
    <svg
      className="calendar-svg"
      viewBox={`0 0 ${cmToPx(width)} ${cmToPx(height)}`}
      xmlns="http://www.w3.org/2000/svg"
      fontFamily="Work Sans"
      fontSize="20px"
      role="img"
      aria-label={`Calendar page ${pageNumber}`}
    >
      <rect width={cm(width)} height={cm(height)} fill="#fff" />

      {/* Header: the title (if any) with the months on the right, or just the months */}
      {header && (
        <text x={cm(left)} y={cm(headerY)} fontSize={`${header.fontSize}px`} fontWeight="bold">
          {header.text}
        </text>
      )}
      <text
        x={cm(header ? right : left)}
        y={cm(headerY)}
        textAnchor={header ? 'end' : 'start'}
        fontSize={header ? '14px' : '20px'}
        fontWeight={header ? 'normal' : 'bold'}
        fill={header ? MUTED_TEXT : undefined}
      >
        {months}
      </text>

      {weekdayLabels(locale, startsOnSunday).map((day, index) => (
        <text key={index} textAnchor="middle" x={cm(left + (index + 0.5) * cellWidth)} y={cm(top - 0.18)} fontSize="18px">
          {day}
        </text>
      ))}

      {Array.from({ length: weeks }, (_, week) => {
        const y = top + week * cellHeight;
        const weekStart = addDays(firstDay, week * 7);
        const days = Array.from({ length: 7 }, (_, day) => addDays(weekStart, day));
        const numberY = y + 0.535;

        return (
          <React.Fragment key={week}>
            {shadeWeekends && days.map((date, day) => (date.getDay() === 0 || date.getDay() === 6) && (
              <rect
                key={day}
                x={cm(left + day * cellWidth)}
                y={cm(y)}
                width={cm(cellWidth)}
                height={cm(cellHeight - ROW_GAP)}
                fill={WEEKEND_FILL}
              />
            ))}

            {showWeekNumbers && (
              <text textAnchor="end" x={cm(left - 0.2)} y={cm(numberY)} fontSize="16px" fill={MUTED_TEXT}>
                {isoWeek(days[startsOnSunday ? 1 : 0])}
              </text>
            )}

            <line x1={cm(left)} y1={cm(y)} x2={cm(right)} y2={cm(y)} stroke={LINE} />
            {Array.from({ length: 8 }, (_, column) => (
              <line
                key={column}
                x1={cm(left + column * cellWidth)}
                y1={cm(y)}
                x2={cm(left + column * cellWidth)}
                y2={cm(y + cellHeight - ROW_GAP)}
                stroke={LINE}
              />
            ))}

            {/* Day numbers, the 1st also gets the month name */}
            {days.map((date, day) => {
              const x = cm(left + (day + 0.5) * cellWidth);
              const isFirst = date.getDate() === 1;
              const fill = date < rangeStart || date > rangeEnd ? OUTSIDE_TEXT : undefined;
              return (
                <React.Fragment key={day}>
                  {isFirst && (
                    <text textAnchor="middle" x={x} y={cm(y + 0.39)} fontSize="16px" fontWeight="bold" fill={fill}>
                      {monthLabel(date, locale)}
                    </text>
                  )}
                  <text textAnchor="middle" x={x} y={cm(numberY + (isFirst ? 0.4 : 0))} fill={fill}>
                    {date.getDate()}
                  </text>
                </React.Fragment>
              );
            })}
          </React.Fragment>
        );
      })}

      <line x1={cm(left)} y1={cm(bottom)} x2={cm(right)} y2={cm(bottom)} stroke={LINE} />
      {pageCount > 1 && (
        <text textAnchor="end" x={cm(right)} y={cm(bottom + 0.42)} fontSize="13px" fill={MUTED_TEXT}>
          {pageNumber} / {pageCount}
        </text>
      )}
    </svg>
  );
};

export default CalendarSVG;
