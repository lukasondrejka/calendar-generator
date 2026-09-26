import React from 'react';

export const GitHubIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="gh">
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

// Same artwork as public/favicon.svg
export const AppLogo: React.FC = () => (
  <svg className="brand-logo" viewBox="0 0 32 32" aria-hidden="true">
    <rect width="32" height="32" rx="7" fill="var(--accent)" />
    <g fill="none" stroke="var(--on-accent)" strokeLinecap="round">
      <rect x="7" y="8.5" width="18" height="16.5" rx="2.5" strokeWidth="2.2" />
      <path d="M7 13.5h18M12 6v4.5M20 6v4.5" strokeWidth="2.2" />
      <path d="M11.5 17.5h2M15 17.5h2M18.5 17.5h2M11.5 21h2M15 21h2" strokeWidth="2" />
    </g>
  </svg>
);
