import React, { useContext } from 'react';
import './App.scss';
import { AppStateContext } from '../AppStateContext';
import CalendarSVG from './CalendarSVG';
import Sidebar from './Sidebar';
import { downloadPDF, openPDF } from '../utils/pdf';

const App: React.FC = () => {
  const { state } = useContext(AppStateContext)!;

  const { pageCount, pageSize } = state;

  const getCalendarElements = () => 
    Array.from(document.querySelectorAll('.calendar-svg'));

  const openPDFclick = () => 
    openPDF(getCalendarElements(), pageSize);

  const downloadPDFclick = () => 
    downloadPDF(getCalendarElements(), pageSize);

  return (
    <div className="app">
      <div className="calendar-box">
        {Array.from({ length: pageCount }).map((_, index) => (
          <div className="calendar-page" key={index}>
            <CalendarSVG pageIndex={index} />
          </div>
        ))}
      </div>
      <div className="sidebar-box">
        <Sidebar
          openPDF={openPDFclick}
          downloadPDF={downloadPDFclick}        
        />
      </div>
    </div>
  );
};

export default App;
