import React from 'react';
import './App.scss';
import { StateProvider } from '../StateContext';
import CalendarSVG from './CalendarSVG';
import Sidebar from './Sidebar';
import { downloadPDF, openPDF } from '../utils/pdf';

const App: React.FC = () => {
  const getCalendarElement = () => 
    document.querySelector('#calendar')!;

  const openPDFclick = () => 
    openPDF(getCalendarElement());

  const downloadPDFclick = () => 
    downloadPDF(getCalendarElement());

  return (
    <StateProvider>
      <div className="container">
        <div className="calendar-box">
          <CalendarSVG id="calendar" />
        </div>
        <div className="sidebar-box">
          <Sidebar
            openPDF={openPDFclick}
            downloadPDF={downloadPDFclick}        
          />
        </div>
      </div>
    </StateProvider>
  );
};

export default App;