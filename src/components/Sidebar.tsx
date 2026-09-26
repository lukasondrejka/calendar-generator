import React from 'react';
import './Sidebar.css';
import { limits, locales } from '../settings';
import type { PageSize, Pagination, Settings, Units, WeekStart } from '../settings';
import { paperSizes } from '../calendar';
import type { CalendarPage } from '../calendar';
import { formatDate, formatDateRange, MAX_YEAR, MIN_YEAR, toDateString } from '../utils/date';
import { cmToIn, inToCm, roundTo } from '../utils/units';
import { GITHUB_URL } from '../constants';
import { NumberField, Segmented, SelectField, TextField, Toggle } from './FormControls';
import { AppLogo, GitHubIcon } from './Icons';

const datePresets = () => {
  const today = new Date();
  return [
    { label: 'Today', value: toDateString(today) },
    { label: 'This month', value: toDateString(new Date(today.getFullYear(), today.getMonth(), 1)) },
    { label: 'Next month', value: toDateString(new Date(today.getFullYear(), today.getMonth() + 1, 1)) },
  ];
};

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

const Sidebar: React.FC<{
  settings: Settings;
  pages: CalendarPage[];
  update: (changes: Partial<Settings>) => void;
  reset: () => void;
  busy: boolean;
  error: string | null;
  onDownload: () => void;
  onOpen: () => void;
  onAbout: () => void;
}> = ({ settings, pages, update, reset, busy, error, onDownload, onOpen, onAbout }) => {
  const {
    pagination, weeksPerPage, monthsPerPage, startOnDate, startWeekOn, pageCount,
    title, pageSize, margin, units, locale, shadeWeekends, showWeekNumbers,
  } = settings;

  const startDate = pages[0].rangeStart;
  const endDate = pages[pages.length - 1].rangeEnd;
  const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth() + 1;

  const toUnits = (lengthCm: number, step: number) => roundTo(units === 'in' ? cmToIn(lengthCm) : lengthCm, step);
  const paper = paperSizes[pageSize];
  const marginLimits = limits.margin[units];

  return (
    <div className="sidebar">
      <header className="sidebar-header">
        <div className="brand">
          <AppLogo />
          <h1>Calendar Generator</h1>
          <button type="button" className="about-btn" onClick={onAbout} title="How to use it, tips and info">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5.5M12 7.5h.01" />
            </svg>
            About
          </button>
        </div>
      </header>

      <div className="summary" aria-live="polite">
        <span className="summary-range">{formatDateRange(startDate, endDate)}</span>
        <span className="summary-meta">
          {pagination === 'weeks' ? plural(weeksPerPage * pageCount, 'week') : plural(months, 'month')}
          {' '}· {plural(pageCount, 'page')} · {pageSize}
        </span>
      </div>

      <div className="sidebar-actions">
        <div className="actions-row">
          <button type="button" className="btn btn-primary" onClick={onDownload} disabled={busy}>
            {busy ? <span className="spinner" aria-hidden="true" /> : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14" /></svg>
            )}
            {busy ? 'Generating…' : 'Download PDF'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpen}
            disabled={busy}
            title="Open the PDF in a new tab to view or print it"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
            Open
          </button>
        </div>
        {error && <p className="error" role="alert">{error}</p>}
      </div>

      <div className="sidebar-body">
        <section className="panel">
          <h2>Layout</h2>
          <Segmented<Pagination>
            name="pagination"
            label="Each page shows"
            options={['weeks', 'months']}
            labels={{ weeks: 'Weeks', months: 'Whole months' }}
            value={pagination}
            onChange={(value) => update({ pagination: value })}
          />
          {pagination === 'weeks' ? (
            <NumberField
              id="weeksPerPage"
              label="Weeks per page"
              value={weeksPerPage}
              {...limits.weeksPerPage}
              onChange={(value) => update({ weeksPerPage: value })}
            />
          ) : (
            <Segmented<'1' | '2'>
              name="monthsPerPage"
              label="Months per page"
              options={['1', '2']}
              value={String(monthsPerPage) as '1' | '2'}
              onChange={(value) => update({ monthsPerPage: Number(value) as 1 | 2 })}
            />
          )}
        </section>

        <section className="panel">
          <h2>Dates</h2>
          <div className="field">
            <label htmlFor="startDate">Start date</label>
            <input
              type="date"
              id="startDate"
              value={startOnDate}
              min={`${MIN_YEAR}-01-01`}
              max={`${MAX_YEAR}-12-31`}
              onChange={(e) => update({ startOnDate: e.target.value })}
            />
            <div className="chips">
              {datePresets().map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className={`chip ${preset.value === startOnDate ? 'active' : ''}`}
                  onClick={() => update({ startOnDate: preset.value })}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            {pagination === 'months' && (
              <small className="hint">The calendar starts with the month of this date.</small>
            )}
          </div>
          <div className="field-row">
            <NumberField
              id="pageCount"
              label="Pages"
              hint={`Until ${formatDate(endDate)}`}
              value={pageCount}
              {...limits.pageCount}
              onChange={(value) => update({ pageCount: value })}
            />
            <Segmented<WeekStart>
              name="startWeekOn"
              label="Week starts on"
              options={['Monday', 'Sunday']}
              value={startWeekOn}
              onChange={(value) => update({ startWeekOn: value })}
            />
          </div>
        </section>

        <details className="panel more">
          <summary>
            <h2>More options</h2>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="chevron"><path d="m6 9 6 6 6-6" /></svg>
          </summary>
          <div className="more-content">
            <TextField
              id="title"
              label="Title"
              hint="Optional, printed in the header next to the months"
              placeholder="e.g. Marathon training"
              value={title}
              maxLength={limits.title.maxLength}
              onChange={(value) => update({ title: value })}
            />
            <Segmented<PageSize>
              name="pageSize"
              label="Paper size"
              hint={`${toUnits(paper.width, 0.01)} × ${toUnits(paper.height, 0.01)} ${units}`}
              options={['A4', 'Letter']}
              value={pageSize}
              onChange={(value) => update({ pageSize: value })}
            />
            <div className="field-row">
              <NumberField
                id="margin"
                label="Margin"
                unit={units}
                value={toUnits(margin, marginLimits.step)}
                {...marginLimits}
                onChange={(value) => update({ margin: units === 'in' ? inToCm(value) : value })}
              />
              <Segmented<Units>
                name="units"
                label="Units"
                options={['cm', 'in']}
                value={units}
                onChange={(value) => update({ units: value })}
              />
            </div>
            <SelectField
              id="locale"
              label="Language"
              value={locale}
              options={locales}
              onChange={(value) => update({ locale: value })}
            />
            <div className="toggles">
              <Toggle
                label="Shade weekends"
                checked={shadeWeekends}
                onChange={(checked) => update({ shadeWeekends: checked })}
              />
              <Toggle
                label="Week numbers"
                checked={showWeekNumbers}
                onChange={(checked) => update({ showWeekNumbers: checked })}
              />
            </div>
          </div>
        </details>
      </div>

      <footer className="sidebar-footer">
        <button type="button" className="btn btn-ghost" onClick={reset} title="Reset all settings to defaults">
          Reset
        </button>
        <a className="icon-btn icon-btn-sm" href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="Source on GitHub" title="Source on GitHub">
          <GitHubIcon />
        </a>
      </footer>
    </div>
  );
};

export default Sidebar;
