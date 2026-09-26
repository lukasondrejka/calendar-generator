import React, { useEffect, useState } from 'react';
import './App.css';
import { useSettings } from '../settings';
import { buildPages, paperSizes } from '../calendar';
import { formatDateRange, toDateString } from '../utils/date';
import { downloadPDF, openPDF } from '../utils/pdf';
import CalendarSVG from './CalendarSVG';
import Sidebar from './Sidebar';
import About from './About';

const App: React.FC = () => {
  const { settings, update, reset } = useSettings();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [, setFontsLoaded] = useState(false);

  // Re-render with the web font loaded, the header text is measured with it
  useEffect(() => {
    document.fonts.ready.then(() => setFontsLoaded(true));
  }, []);

  const pages = buildPages(settings);
  const paper = paperSizes[settings.pageSize];

  const exportPDF = async (action: typeof downloadPDF) => {
    setBusy(true);
    setError(null);
    try {
      await action(Array.from(document.querySelectorAll('.calendar-svg')), {
        ...paper,
        title: settings.title.trim() || 'Calendar',
        fileName: `calendar-${toDateString(pages[0].rangeStart)}.pdf`,
      });
    } catch (e) {
      console.error(e);
      setError('Could not generate the PDF. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="app">
      <aside className="sidebar-box">
        <Sidebar
          settings={settings}
          pages={pages}
          update={update}
          reset={reset}
          busy={busy}
          error={error}
          onDownload={() => exportPDF(downloadPDF)}
          onOpen={() => exportPDF(openPDF)}
          onAbout={() => setAboutOpen(true)}
        />
      </aside>
      <main className="preview" aria-label="Calendar preview">
        <div className="preview-pages" style={{ '--page-aspect': paper.width / paper.height } as React.CSSProperties}>
          {pages.map((page, index) => (
            <figure className="calendar-page" key={index}>
              <CalendarSVG settings={settings} page={page} pageNumber={index + 1} pageCount={pages.length} />
              <figcaption>
                {pages.length > 1 && <strong>Page {index + 1}</strong>}
                <span>{formatDateRange(page.rangeStart, page.rangeEnd)}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </main>
      <About open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <style>{`@page { size: ${paper.width}cm ${paper.height}cm; margin: 0; }`}</style>
    </div>
  );
};

export default App;
