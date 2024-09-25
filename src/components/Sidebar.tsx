import React, { useContext } from 'react';
import './Sidebar.scss';
import { AppStateContext } from '../AppStateContext';
import { firstDayOfWeek } from '../utils/date';

const Sidebar: React.FC<{ openPDF: () => void; downloadPDF: () => void }> = ({ openPDF, downloadPDF }) => {
  const { state, dispatch }  = useContext(AppStateContext)!;

  const { state, dispatch } = context!;
  const { startOnDate, startWeekOn, pageCount, weeksPerPage, pageSize, showYearFooter } = state;

  const getRange= (): string => {
    const startDate = firstDayOfWeek(new Date(startOnDate), startWeekOn === 'Sunday');
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7 * weeksPerPage * pageCount - 1);

    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  }

  return (
    <div className="sidebar">
      <div className="form-group">
        <h1>Calendar Generator</h1>
        <p>Range: { getRange() }</p>
      </div>

      <div className="form-group">
        <button onClick={openPDF}>Open PDF</button>
        <button onClick={downloadPDF}>Download PDF</button>
      </div>

      <div className="form-group">
        <label htmlFor="startDate">Start on date</label>
        <input
          type="date"
          id="startDate"
          value={startOnDate}
          onChange={(e) => dispatch({ type: 'SET_START_ON_DATE', payload: e.target.value })}
        />
      </div>

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

      {/* <div className="about">
        <h3>About (License)</h3>
        <p>
          Print out and plan your upcoming weeks. Mark only the most important milestones. Optionally strike out past days to visualize time passing.
        </p>
      </div> */}

    </div>
  );
};

export default Sidebar;
