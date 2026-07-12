export function Icon({ name, size = 24, color = 'currentColor', sw = 1.8, className = '' }) {
  const p = { fill: 'none', stroke: color, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home: (
      <>
        <path {...p} d="M3 10.5 12 3l9 7.5" />
        <path {...p} d="M5 9.5V20h14V9.5" />
        <path {...p} d="M9.5 20v-5h5v5" />
      </>
    ),
    map: (
      <>
        <path {...p} d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11Z" />
        <circle {...p} cx="12" cy="10" r="2.5" />
      </>
    ),
    qr: (
      <>
        <rect {...p} x="3.5" y="3.5" width="6" height="6" rx="1" />
        <rect {...p} x="14.5" y="3.5" width="6" height="6" rx="1" />
        <rect {...p} x="3.5" y="14.5" width="6" height="6" rx="1" />
        <path {...p} d="M14.5 14.5h2.5v2.5M20.5 14.5v6M17 20.5h3.5" />
      </>
    ),
    quest: (
      <>
        <path {...p} d="M6 4h9l3 3v13H6z" />
        <path {...p} d="M9 10h6M9 14h4" />
      </>
    ),
    user: (
      <>
        <circle {...p} cx="12" cy="8" r="3.5" />
        <path {...p} d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
      </>
    ),
    profile: (
      <>
        <circle {...p} cx="12" cy="8" r="3.5" />
        <path {...p} d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
      </>
    ),
    coin: (
      <>
        <circle {...p} cx="12" cy="12" r="8" />
        <path {...p} d="M12 8v8M9 12h6" />
      </>
    ),
    fragment: (
      <>
        <polygon {...p} points="12 2 22 8 22 16 12 22 2 16 2 8" />
        <path {...p} d="M12 22V12" />
        <path {...p} d="M12 12l10-4" />
        <path {...p} d="M2 8l10 4" />
      </>
    ),
    bolt: <path {...p} d="M13 2 4 14h7l-1 8 9-12h-7z" />,
    trophy: (
      <>
        <path {...p} d="M7 4h10v4a5 5 0 0 1-10 0z" />
        <path {...p} d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3M9 20h6M12 13v4" />
      </>
    ),
    fire: <path {...p} d="M12 3c1 3-2 4-2 7a2 2 0 0 0 4 0c2 2 3 3 3 6a5 5 0 0 1-10 0c0-4 5-6 5-13Z" />,
    clock: (
      <>
        <circle {...p} cx="12" cy="12" r="8.5" />
        <path {...p} d="M12 7v5l3 2" />
      </>
    ),
    chev: <path {...p} d="M9 6l6 6-6 6" />,
    route: (
      <>
        <circle {...p} cx="6" cy="18" r="2.5" />
        <circle {...p} cx="18" cy="6" r="2.5" />
        <path {...p} d="M8.5 18H14a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h5.5" />
      </>
    ),
    lock: (
      <>
        <rect {...p} x="5" y="10" width="14" height="10" rx="2" />
        <path {...p} d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    check: <path {...p} d="M5 12.5 10 17l9-10" />,
    star: <path {...p} d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17.9 6.8 19.6l1-5.8-4.3-4.1 5.9-.9z" />,
    gem: (
      <>
        <path {...p} d="M6 3h12l3 5-9 13L3 8z" />
        <path {...p} d="M3 8h18M9 3 7.5 8 12 21M15 3l1.5 5L12 21" />
      </>
    ),
    layer: (
      <>
        <path {...p} d="M12 4 4 8l8 4 8-4-8-4Z" />
        <path {...p} d="M4 12l8 4 8-4" />
        <path {...p} d="M4 16l8 4 8-4" />
      </>
    ),
    plus: (
      <>
        <path {...p} d="M12 5v14M5 12h14" />
      </>
    ),
    arrow: (
      <>
        <path {...p} d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    scan: (
      <>
        <path {...p} d="M4 8V5a1 1 0 0 1 1-1h3M20 8V5a1 1 0 0 0-1-1h-3M4 16v3a1 1 0 0 0 1 1h3M20 16v3a1 1 0 0 1-1 1h-3" />
        <path {...p} d="M4 12h16" />
      </>
    ),
    bell: (
      <>
        <path {...p} d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
        <path {...p} d="M10 19a2 2 0 0 0 4 0" />
      </>
    ),
    logout: (
      <>
        <path {...p} d="M10 22H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h5" />
        <path {...p} d="M17 16l4-4-4-4M21 12H9" />
      </>
    ),
    spinner: (
      <>
        <path {...p} d="M12 4a8 8 0 1 1-5.66 2.34" />
      </>
    ),
    'chev-up': <path {...p} d="M6 15l6-6 6 6" />,
    'chev-down': <path {...p} d="M6 9l6 6 6-6" />,
    tg: <path {...p} d="M21 5 3 12l5 2 2 5 3-4 5 4z" />,
  };

  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name] ?? paths.star}
    </svg>
  );
}
