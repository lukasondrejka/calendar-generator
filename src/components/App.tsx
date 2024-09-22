import React, { useContext } from 'react';
import './App.scss';
import { AppStateContext } from '../AppStateContext';
import CalendarSVG from './CalendarSVG';
import Sidebar from './Sidebar';
import { downloadPDF, openPDF } from '../utils/pdf';

const App: React.FC = () => {
  const context = useContext(AppStateContext);
  const { state } = context!;

  const { pageCount } = state;

  const getCalendarElements = () => 
    Array.from(document.querySelectorAll('.calendar-svg'));

  const openPDFclick = () => 
    openPDF(getCalendarElements());

  const downloadPDFclick = () => 
    downloadPDF(getCalendarElements());

  return (
    <div className="container">
      <div className="calendar-box">
        {Array.from({ length: pageCount }).map((_, index) => (
          <div className="calendar-page" key={index}>
            <CalendarSVG
              pageIndex={index}
              className="calendar-svg"
            />
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