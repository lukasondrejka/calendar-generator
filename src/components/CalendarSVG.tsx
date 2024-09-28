import React, { useContext } from 'react';
import './CalendarSVG.scss';
import { AppStateContext } from '../AppStateContext';
import { cmToPx, pxToCm } from '../utils/units';
import { addWeeks, firstDayOfWeek } from '../utils/date';
import { pageSizes } from '../utils/pdf';

const CalendarSVG: React.FC<{pageIndex?: number}> = ({ pageIndex }) => {
  const { state } = useContext(AppStateContext)!;

  const { startOnDate, weeksPerPage, pageCount, startWeekOn, pageSize, showYearFooter, margin, edgeLines } = state;

  const { width: svgWidth, height: svgHeight } = pageSizes[pageSize as typeof pageSize];

  const firstDay: Date = addWeeks(firstDayOfWeek(new Date(startOnDate), startWeekOn === 'Sunday'),
    pageIndex! * weeksPerPage);

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  if (startWeekOn === 'Sunday')
    daysOfWeek.unshift(daysOfWeek.pop()!);

  const cellWidth = (svgWidth - 2 * margin) / daysOfWeek.length;
  const cellHeight = (svgHeight - 2 * margin) / weeksPerPage;

  return (
    <svg 
      className="calendar-svg"
      viewBox={`0 0 ${cmToPx(svgWidth)} ${cmToPx(svgHeight)}`}
      xmlns="http://www.w3.org/2000/svg"
      fontFamily="Work Sans"
      fontSize="20px"
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
          y={`${margin - 0.18}cm`}
          fontSize="14px"
        >
          {day}
        </text>
      ))}
  
      {/* Content */}
      {Array.from({ length: weeksPerPage }).map((_, week) => {
        const y = margin + week * cellHeight;
        return (
          <React.Fragment key={week}>
            {/* Horizontal lines */}
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
                  {/* Vertical lines */}
                  {((day > 0 && day < daysOfWeek.length) || edgeLines) && (
                    <line 
                      x1={`${x}cm`} 
                      y1={`${y}cm`} 
                      x2={`${x}cm`} 
                      y2={`${y + cellHeight - 0.4}cm`}
                      style={{ stroke: 'rgb(0, 0, 0)', strokeWidth: 1 }}
                    />
                  )}

                  {/* Day header */}
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
                          fontSize={`16px`}
                          x={`${margin + cellWidth / 2 + day * cellWidth}cm`}
                          y={`${margin + week * cellHeight - pxToCm(16) / 2 + 0.6 }cm`}
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

      {/* Footer horisontal line */}
      {edgeLines && (
        <line
          x1={`${margin}cm`}
          y1={`${svgHeight - margin}cm`}
          x2={`${svgWidth - margin}cm`}
          y2={`${svgHeight - margin}cm`}
          style={{ stroke: 'rgb(0, 0, 0)', strokeWidth: 1 }}
        />
      )}

      {/* Footer text */}
      <>
        {showYearFooter && (
          <text
            textAnchor="middle"
            x={`${svgWidth / 2}cm`}
            y={`${svgHeight - margin + pxToCm(16)}cm`}
            fontSize="16px"
          >
            {firstDay.getFullYear() === new Date(firstDay.getTime() + weeksPerPage * 7 * 24 * 60 * 60 * 1000).getFullYear() 
              ? firstDay.getFullYear() 
              : `${firstDay.getFullYear()} - ${new Date(firstDay.getTime() + weeksPerPage * 7 * 24 * 60 * 60 * 1000).getFullYear()}`
            }
          </text>
        )}

        {pageCount > 1 && (
          <>
            {!showYearFooter && (
              <text
                textAnchor="middle"
                x={`${svgWidth / 2}cm`}
                y={`${svgHeight - margin + pxToCm(16)}cm`}
                fontSize="16px"
              >
                {pageIndex! + 1} / {pageCount}
              </text>
            )}
            {showYearFooter && (
              <text
                textAnchor="end"
                x={`${svgWidth - margin}cm`}
                y={`${svgHeight - margin + pxToCm(18) }cm`}
                fontSize="16px"
              >
                {pageIndex! + 1} / {pageCount}
              </text>
          )}
          </>
        )}
      </>
    </svg>
  );
};

export default CalendarSVG;
