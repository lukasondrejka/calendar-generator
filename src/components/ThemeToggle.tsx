import React, { useEffect, useState } from 'react';

type Theme = 'auto' | 'light' | 'dark';

// Also read by the inline script in index.html, which applies the theme before the first paint
const STORAGE_KEY = 'theme';

const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
  {
    value: 'light',
    label: 'Light',
    icon: <path d="M12 4V2.5M12 21.5V20M4 12H2.5M21.5 12H20M6.3 6.3 5.2 5.2M18.8 18.8l-1.1-1.1M6.3 17.7l-1.1 1.1M18.8 5.2l-1.1 1.1M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />,
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />,
  },
  {
    value: 'auto',
    label: 'System',
    icon: <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1ZM9 21h6M12 17v4" />,
  },
];

const loadTheme = (): Theme => {
  try {
    const theme = localStorage.getItem(STORAGE_KEY);
    return theme === 'light' || theme === 'dark' ? theme : 'auto';
  } catch {
    return 'auto';
  }
};

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState(loadTheme);

  useEffect(() => {
    if (theme === 'auto')
      delete document.documentElement.dataset.theme;
    else
      document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage unavailable – the theme just won't persist
    }
  }, [theme]);

  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      {themes.map(({ value, label, icon }) => (
        <button
          key={value}
          type="button"
          className="icon-btn icon-btn-sm"
          aria-pressed={theme === value}
          aria-label={`${label} theme`}
          title={`${label} theme`}
          onClick={() => setTheme(value)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">{icon}</svg>
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
