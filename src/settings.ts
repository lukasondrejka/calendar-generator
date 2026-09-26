import { useEffect, useState } from 'react';
import { isValidDateString, todayAsString } from './utils/date';
import { clamp, cmToIn, inToCm, roundTo } from './utils/units';

export type PageSize = 'A4' | 'Letter';
export type WeekStart = 'Monday' | 'Sunday';
export type Units = 'cm' | 'in';
export type Pagination = 'weeks' | 'months';

export interface Settings {
  pagination: Pagination;
  weeksPerPage: number;
  monthsPerPage: 1 | 2;
  startOnDate: string;
  startWeekOn: WeekStart;
  pageCount: number;
  title: string;
  pageSize: PageSize;
  margin: number; // cm
  units: Units;
  locale: string; // 'auto' = browser language
  shadeWeekends: boolean;
  showWeekNumbers: boolean;
}

export const limits = {
  weeksPerPage: { min: 4, max: 14, step: 1 },
  pageCount: { min: 1, max: 24, step: 1 },
  margin: {
    cm: { min: 0.8, max: 2.5, step: 0.1 },
    in: { min: 0.35, max: 0.95, step: 0.05 },
  },
  title: { maxLength: 40 },
};

// Latin-script languages only – the PDF font has no other glyphs
const LANGUAGES = [
  'en', 'sk', 'cs', 'de', 'pl', 'hu', 'fr', 'es', 'it', 'pt', 'nl', 'sv', 'da', 'nb', 'fi',
  'ro', 'hr', 'sl', 'tr', 'et', 'lv', 'lt', 'ca',
];

const languageName = (code: string): string => {
  const name = new Intl.DisplayNames([code], { type: 'language' }).of(code) ?? code;
  return name.charAt(0).toLocaleUpperCase(code) + name.slice(1);
};

const browserLanguage = (): string => {
  const code = navigator.language.split('-')[0].toLowerCase();
  return LANGUAGES.includes(code) ? code : 'en';
};

export const resolveLocale = (locale: string): string =>
  locale === 'auto' ? browserLanguage() : locale;

export const locales = [
  { value: 'auto', label: `Browser language (${languageName(browserLanguage())})` },
  ...LANGUAGES.map((code) => ({ value: code, label: languageName(code) }))
    .sort((a, b) => a.label.localeCompare(b.label)),
];

// Regions using Letter paper and inches, which mostly also start the week on Sunday
const LETTER_REGIONS = ['US', 'CA', 'MX', 'PH'];

const defaultSettings = (): Settings => {
  const region = new Intl.Locale(navigator.language).maximize().region ?? '';
  const letter = LETTER_REGIONS.includes(region);

  return {
    pagination: 'weeks',
    weeksPerPage: 8,
    monthsPerPage: 1,
    startOnDate: todayAsString(),
    startWeekOn: letter ? 'Sunday' : 'Monday',
    pageCount: 1,
    title: '',
    pageSize: letter ? 'Letter' : 'A4',
    margin: letter ? inToCm(0.6) : 1.5,
    units: letter ? 'in' : 'cm',
    locale: 'auto',
    shadeWeekends: false,
    showWeekNumbers: false,
  };
};

const oneOf = <T,>(value: unknown, allowed: T[], fallback: T): T =>
  allowed.includes(value as T) ? value as T : fallback;

const integer = (value: unknown, fallback: number, { min, max }: { min: number; max: number }): number =>
  clamp(Math.round(Number(value)) || fallback, min, max);

// Builds valid settings from anything, e.g. outdated or hand-edited storage
const sanitize = (value: Partial<Settings>): Settings => {
  const d = defaultSettings();
  return {
    pagination: oneOf(value.pagination, ['weeks', 'months'], d.pagination),
    weeksPerPage: integer(value.weeksPerPage, d.weeksPerPage, limits.weeksPerPage),
    monthsPerPage: oneOf(value.monthsPerPage, [1, 2], d.monthsPerPage),
    startOnDate: isValidDateString(value.startOnDate ?? '') ? value.startOnDate! : d.startOnDate,
    startWeekOn: oneOf(value.startWeekOn, ['Monday', 'Sunday'], d.startWeekOn),
    pageCount: integer(value.pageCount, d.pageCount, limits.pageCount),
    title: String(value.title ?? '').slice(0, limits.title.maxLength),
    pageSize: oneOf(value.pageSize, ['A4', 'Letter'], d.pageSize),
    margin: clamp(Number(value.margin) || d.margin, limits.margin.cm.min, limits.margin.cm.max),
    units: oneOf(value.units, ['cm', 'in'], d.units),
    locale: oneOf(value.locale, locales.map((l) => l.value), d.locale),
    shadeWeekends: value.shadeWeekends === true,
    showWeekNumbers: value.showWeekNumbers === true,
  };
};

const STORAGE_KEY = 'settings';
const ONE_DAY = 24 * 60 * 60 * 1000;

const load = (): Settings => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (!stored)
      return defaultSettings();
    const settings = sanitize(stored);
    // A start date saved more than a day ago is outdated
    if (!(Date.now() - stored.savedAt < ONE_DAY))
      settings.startOnDate = todayAsString();
    return settings;
  } catch {
    return defaultSettings();
  }
};

export const useSettings = () => {
  const [settings, setSettings] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...settings, savedAt: Date.now() }));
    } catch {
      // Storage unavailable (private mode) – settings just won't persist
    }
  }, [settings]);

  const update = (changes: Partial<Settings>) => {
    // Ignore half-typed dates from the date input
    if (changes.startOnDate !== undefined && !isValidDateString(changes.startOnDate))
      return;

    setSettings((current) => {
      const next = { ...current, ...changes };
      // Round the margin to a step of the new unit
      if (changes.units === 'in')
        next.margin = inToCm(roundTo(cmToIn(current.margin), limits.margin.in.step));
      else if (changes.units === 'cm')
        next.margin = roundTo(current.margin, limits.margin.cm.step);
      return sanitize(next);
    });
  };

  const reset = () => setSettings(defaultSettings());

  return { settings, update, reset };
};
