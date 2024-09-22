import React, { useContext } from 'react';
import './CalendarSVG.scss';
import { AppStateContext } from '../AppStateContext';
import { cmToPx, pxToCm } from '../utils/units';
import { firstDayOfWeek } from '../utils/date';

const pageSizes = {
  A4: { width: 21, height: 29.7 },
  Letter: { width: 21.59, height: 27.94 },
};

// props
interface CalendarSVGProps {
  className?: string;
  pageIndex?: number;
}

const CalendarSVG: React.FC<CalendarSVGProps> = ({ className, pageIndex }) => {
  const context = useContext(AppStateContext);
  const { state } = context!;

  const generateSVG = () => {
    const { startOnDate, weeksPerPage, pageCount, startWeekOn, pageSize, showYearFooter } = state;

    const margin = 1.5;

    const firstDay: Date = firstDayOfWeek(new Date(startOnDate), startWeekOn === 'Sunday');
    firstDay.setDate(firstDay.getDate() + pageIndex! * weeksPerPage * 7);

    const { width: svgWidth, height: svgHeight } = pageSizes[pageSize as typeof pageSize];

    const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    if (startWeekOn === 'Sunday') {
      daysOfWeek.unshift(daysOfWeek.pop()!);
    }

    const cellWidth = (svgWidth - 2 * margin) / daysOfWeek.length;
    const cellHeight = (svgHeight - 2 * margin) / weeksPerPage;
    const bottomLine = true;

    return (
      <svg 
        className={className}
        viewBox={`0 0 ${cmToPx(svgWidth)} ${cmToPx(svgHeight)}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ 
          fontFamily: 'Roboto, sans-serif',
          fontSize: '20px',
        }}
      >
        {/* Background */}
        <rect
          width={`${svgWidth}cm`} 
          height={`${svgHeight}cm`} 
          fill="#FFF"
        />
    
        {/* Header (days of the week) */}
        {daysOfWeek.map((day, index) => (
          <text 
            key={index} 
            textAnchor="middle" 
            x={`${margin + cellWidth / 2 + index * cellWidth}cm`} 
            y={`${margin - 0.15}cm`}
          >
            {day}
          </text>
        ))}
    
        {Array.from({ length: weeksPerPage }).map((_, week) => {
          const y = margin + week * cellHeight;
          return (
            <React.Fragment key={week}>
              {/* Vertical lines (above the week) */}
              <line 
                x1={`${margin}cm`} 
                y1={`${y}cm`} 
                x2={`${svgWidth - margin}cm`} 
                y2={`${y}cm`} 
                style={{ stroke: 'rgb(0, 0, 0)', strokeWidth: 1 }}
              />
              {Array.from({ length: daysOfWeek.length + 1 }).map((_, day) => {
                const x = margin + day * cellWidth;
                const date = new Date(firstDay);
                date.setDate(firstDay.getDate() + week * 7 + day);
                return (
                  <React.Fragment key={day}>
                    {/* Horizontal lines (inside the week) */}
                    <line 
                      x1={`${x}cm`} 
                      y1={`${y}cm`} 
                      x2={`${x}cm`} 
                      y2={`${y + cellHeight - 0.0}cm`}
                      style={{ stroke: 'rgb(0, 0, 0)', strokeWidth: 1 }}
                    />
                    {/* Day number */}
                    {day < daysOfWeek.length && (
                      <>
                        <text 
                          textAnchor="middle" 
                          x={`${margin + cellWidth / 2 + day * cellWidth}cm`} 
                          y={`${margin + week * cellHeight - pxToCm(20) / 2 + 0.8 + (date.getDate() === 1 ? + 0.4 : 0) }cm`}
                        >
                          {date.getDate()}
                        </text>
                        {date.getDate() === 1 && (
                          <text
                            textAnchor="middle"
                            fontWeight="bold"
                            fontSize={`14px`}
                            x={`${margin + cellWidth / 2 + day * cellWidth}cm`}
                            y={`${margin + week * cellHeight - pxToCm(14) / 2 + 0.6 }cm`}
                          >
                            {date.toLocaleString('default', { month: 'short' }).toUpperCase()}
                          </text>
                        )}
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          );
        })}

        {bottomLine && (
          <line
            x1={`${margin}cm`}
            y1={`${svgHeight - margin}cm`}
            x2={`${svgWidth - margin}cm`}
            y2={`${svgHeight - margin}cm`}
            style={{ stroke: 'rgb(0, 0, 0)', strokeWidth: 1 }}
          />
        )}

        {showYearFooter && (
          <text
            textAnchor="middle"
            x={`${svgWidth / 2}cm`}
            y={`${svgHeight - margin + pxToCm(20)}cm`}
          >
            {firstDay.getFullYear() === new Date(firstDay.getTime() + weeksPerPage * 7 * 24 * 60 * 60 * 1000).getFullYear() 
              ? firstDay.getFullYear() 
              : `${firstDay.getFullYear()} - ${new Date(firstDay.getTime() + weeksPerPage * 7 * 24 * 60 * 60 * 1000).getFullYear()}`
            }
          </text>
        )}

        {/* Page number */}
        {pageCount > 1 && (
          <text
            textAnchor="end"
            x={`${svgWidth - margin}cm`}
            y={`${svgHeight - margin + pxToCm(18) }cm`}
            fontSize="18px"
          >
            {pageIndex! + 1} / {pageCount}
          </text>
        )}
      </svg>
    );
  };

  return generateSVG();
};

export default CalendarSVG;