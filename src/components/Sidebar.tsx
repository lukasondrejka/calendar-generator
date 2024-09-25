import React, { useContext } from 'react';
import './Sidebar.scss';
import { AppStateContext } from '../AppStateContext';
import { firstDayOfWeek } from '../utils/date';

const Sidebar: React.FC<{ openPDF: () => void; downloadPDF: () => void }> = ({ openPDF, downloadPDF }) => {
  const { state, dispatch }  = useContext(AppStateContext)!;

  const { startOnDate, startWeekOn, pageCount, weeksPerPage, pageSize, showYearFooter } = state;

  const getRange= (): string => {
    const startDate = firstDayOfWeek(new Date(startOnDate), startWeekOn === 'Sunday');
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7 * weeksPerPage * pageCount - 1);

    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  }

  return (
    <div className="sidebar">

      {/* Header */}
      <div className="form-group">
        <h1>Calendar Generator</h1>
        <p>Range: { getRange() }</p>
      </div>

      {/* Buttons */}
      <div className="form-group">
        <button onClick={openPDF}>Open PDF</button>
        <button onClick={downloadPDF}>Download PDF</button>
      </div>

      {/* Start on date */}
      <div className="form-group">
        <label htmlFor="startDate">Start on date</label>
        <input
          type="date"
          id="startDate"
          value={startOnDate}
          onChange={(e) => dispatch({ type: 'SET_START_ON_DATE', payload: e.target.value })}
        />
      </div>

      {/* Weeks per page */}
      <div className="form-group">
        <label>Number of weeks per page</label>
        <input
          type="number"
          value={weeksPerPage}
          onChange={(e) => dispatch({ type: 'SET_WEEKS_PER_PAGE', payload: Math.min(Number(e.target.value), 24) })}
          min="4"
          max="24"
          step="1"
        />
      </div>

      {/* Page count */}
      <div className="form-group">
        <label>Page Count</label>
        <input
          type="number"
          value={pageCount}
          onChange={(e) => dispatch({ type: 'SET_PAGE_COUNT', payload: Math.min(Number(e.target.value), 10) })}
          min="1"
          max="10"
          step="1"
        />
      </div>

      {/* Page size */}
      <div className="form-group">
        <label>Page size</label>
        <select
          value={pageSize}
          onChange={(e) => dispatch({ type: 'SET_PAGE_SIZE', payload: e.target.value as 'A4' | 'Letter' })}
        >
          <option value="A4">A4</option>
          <option value="Letter">Letter</option>
        </select>
      </div>

      {/* Start week on */}
      <div className="form-group">
        <label>Start week on</label>
        <select
          value={startWeekOn}
          onChange={(e) => dispatch({ type: 'SET_START_WEEK_ON', payload: e.target.value })}
        >
          <option value="Monday">Monday</option>
          <option value="Sunday">Sunday</option>
        </select>
      </div>

      {/* Show year */}
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={showYearFooter}
            onChange={(e) => dispatch({ type: 'SET_YEAR_FOOTER', payload: e.target.checked })}
          />
          Show year at the bottom
        </label>
      </div>

      {/* Margin */}
      <div className="form-group">
        <label>Margin (cm)</label>
        <input
          type="number"
          value={state.margin}
          onChange={(e) => dispatch({ type: 'SET_MARGIN', payload: Math.min(Math.max(Number(e.target.value), 0.8), 3.0) })}
          min="0.8"
          max="3.0"
          step="0.1"
        />
      </div>

      {/* Show edge lines */}
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={state.edgeLines}
            onChange={(e) => dispatch({ type: 'SET_EDGE_LINES', payload: e.target.checked })}
          />
          Show edge lines
        </label>
      </div>

      {/* Reset */}
      <div className="form-group">
        <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
      </div>
    </div>
  );
};

export default Sidebar;
