import { StateProvider } from '../StateContext';
import { downloadPDF, openPDF } from '../utils/pdf';
import './App.scss';
import CalendarSVG from './CalendarSVG';
import Sidebar from './Sidebar';
import React from 'react';

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