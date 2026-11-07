const PATHS = {
  bold: ['M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z'],
  italic: ['M10 5h8M6 19h8M15 5L9 19'],
  underline: ['M7 4v7a5 5 0 0 0 10 0V4M5 21h14'],
  strike: ['M4 12h16M16 7c-.8-1.2-2.1-2-4-2-2.4 0-4 1.2-4 3 0 1.5 1.2 2.3 3 3M8 17c.9 1.3 2.3 2 4.2 2 2.6 0 4.3-1.300 4.300-3.200'],
  alignLeft: ['M4 6h16M4 10h10M4 14h16M4 18h10'],
  alignCenter: ['M4 6h16M7 10h10M4 14h16M7 18h10'],
  alignRight: ['M4 6h16M10 10h10M4 14h16M10 18h10'],
  listUl: ['M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01'],
  listOl: ['M10 6h10M10 12h10M10 18h10M4 5l1.500-1v5M3.500 14c0-1.200 2.500-1.200 2.500 0 0 1-2.500 2-2.500 3H6M3.500 20h2.500l-1 1 1 1'],
  link: ['M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1M14 10a4 4 0 0 0-5.700 0l-3 3A4 4 0 0 0 11 18.700l1-1'],
  image: ['M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9.500h.01'],
  undo: ['M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3'],
  redo: ['M15 14l5-5-5-5M20 9H10a6 6 0 0 0 0 12h3'],
  mic: ['M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3'],
  speaker: ['M11 5L6 9H3v6h3l5 4zM15.500 8.500a5 5 0 0 1 0 7M18.500 5.500a9 9 0 0 1 0 13'],
  trash: ['M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3'],
  upload: ['M12 15V3M7 8l5-5 5 5M5 21h14'],
  download: ['M12 3v12M7 10l5 5 5-5M5 21h14'],
  keyboard: ['M3 6h18v12H3zM7 10h.01M11 10h.01M15 10h.01M7 14h10'],
  expand: ['M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5'],
  shrink: ['M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5'],
  moon: ['M21 12.800A9 9 0 1 1 11.200 3a7 7 0 0 0 9.800 9.800zM17 3v4M15 5h4'],
  sun: ['M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.900 4.900l1.400 1.400M17.700 17.700l1.400 1.400M2 12h2M20 12h2M4.900 19.100l1.400-1.400M17.700 6.300l1.400-1.400'],
  share: ['M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.600 13.500l6.800 4M15.400 6.500l-6.800 4'],
  cloud: ['M7 18a4 4 0 0 1-.500-8A6 6 0 0 1 18 9a4.500 4.500 0 0 1 0 9z'],
  file: ['M6 3h8l4 4v14H6zM14 3v4h4'],
  home: ['M4 11l8-7 8 7M6 10v10h12V10'],
  inbox: ['M4 13l2-8h12l2 8M4 13v6h16v-6M4 13h5l1 2h4l1-2h5'],
  info: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v6M12 7.500h.01'],
  copy: ['M9 9h11v11H9zM5 15H4V4h11v1'],
  x: ['M6 6l12 12M18 6L6 18'],
  save: ['M5 3h11l3 3v15H5zM8 3v5h7V3M8 21v-7h8v7'],
};

export default function Icon({ name, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name].map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
