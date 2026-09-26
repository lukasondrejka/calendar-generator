import React, { useEffect, useRef } from 'react';
import './About.css';
import { GITHUB_URL } from '../constants';
import { formatDate } from '../utils/date';
import { GitHubIcon } from './Icons';

const About: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open)
      dialog.showModal();
    else if (!open && dialog.open)
      dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="about"
      aria-labelledby="about-title"
      onClose={onClose}
      // A click on the dialog itself is a click on the backdrop
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="about-content">
        <header className="about-header">
          <h2 id="about-title">About Calendar Generator</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </header>

        <p className="lead">
          A simple tool for printable multi-week calendars. Every week is one row, so you can see months
          at a glance, write plans into the boxes and pin the page to a wall or keep it in a binder.
        </p>

        <h3>How to use it</h3>
        <ol className="steps">
          <li>
            <strong>Choose the layout</strong> – a number of weeks on each page, or whole calendar months.
          </li>
          <li>
            <strong>Pick a start date and the number of pages.</strong> The calendar begins with the week
            containing that date; the preview updates instantly.
          </li>
          <li>
            <strong>Download the PDF</strong> and print it. A title, paper size, margins and language
            are under <em>More options</em>.
          </li>
        </ol>

        <h3>Ideas</h3>
        <ul className="ideas">
          <li><strong>School semester</strong> – exams and deadlines at a glance.</li>
          <li><strong>Training plan</strong> – 12–16 weeks towards a race, one box per workout.</li>
          <li><strong>Project timeline</strong> – milestones and releases for a quarter.</li>
          <li><strong>Family &amp; shifts</strong> – a planner on the fridge for everyone’s schedule.</li>
        </ul>

        <h3>Printing tips</h3>
        <ul className="tips">
          <li>Print at <strong>100% / Actual size</strong> and turn off “Fit to page” so margins stay as set.</li>
          <li>Use the same paper size in the printer dialog as in the generator.</li>
        </ul>

        <h3>Privacy</h3>
        <p>
          Everything runs in your browser. Nothing is uploaded; settings are stored only on this device.
        </p>

        <footer className="about-footer">
          <a className="btn btn-secondary" href={GITHUB_URL} target="_blank" rel="noreferrer">
            <GitHubIcon />
            Source on GitHub
          </a>
          <a className="btn btn-ghost" href={`${GITHUB_URL}/issues`} target="_blank" rel="noreferrer">
            Report an issue
          </a>
          <p className="version">
            Last updated {formatDate(new Date(__COMMIT_DATE__))}
            {__COMMIT_HASH__ && (
              <> · <a href={`${GITHUB_URL}/commit/${__COMMIT_HASH__}`} target="_blank" rel="noreferrer">{__COMMIT_HASH__}</a></>
            )}
          </p>
        </footer>
      </div>
    </dialog>
  );
};

export default About;
