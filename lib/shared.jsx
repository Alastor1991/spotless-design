// Общие компоненты для стилевых направлений Spotless
// Иконки (простые stroke-глифы), заглушки обложек, мок-данные.

const Ic = ({ d, size = 20, sw = 1.7, style = {}, fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, ...style }}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  home: "M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z",
  search: ["M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z", "M16 16l5 5"],
  library: ["M4 4v16", "M9 4v16", "M14 5l5 14"],
  wallet: ["M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2", "M3 7v11a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H5a2 2 0 0 1-2-2z", "M16 14h2"],
  heart: "M12 20s-7-4.4-9.3-8.5C1 8.5 2.6 5 6.1 5c2.2 0 3.4 1.2 5.9 3.6C14.5 6.2 15.7 5 17.9 5c3.5 0 5.1 3.5 3.4 6.5C19 15.6 12 20 12 20z",
  dollar: ["M12 3v18", "M16.5 7.5c0-1.7-2-2.7-4.5-2.7S7.5 6 7.5 8s2 2.6 4.5 3.2 4.7 1.3 4.7 3.4-2.2 3-4.7 3-4.7-1.1-4.7-2.9"],
  play: "M8 5.5v13l11-6.5z",
  pause: ["M8 5v14", "M16 5v14"],
  prev: ["M19 5.5v13l-9.5-6.5z", "M6 5v14"],
  next: ["M5 5.5v13l9.5-6.5z", "M18 5v14"],
  shuffle: ["M3 7h3.5L17 17h4", "M21 7h-4L6.5 17H3", "M18 4l3 3-3 3", "M18 14l3 3-3 3"],
  repeat: ["M4 12V9a3 3 0 0 1 3-3h13", "M17 3l3 3-3 3", "M20 12v3a3 3 0 0 1-3 3H4", "M7 21l-3-3 3-3"],
  queue: ["M4 6h16", "M4 11h16", "M4 16h8", "M16 16l5 2.5-5 2.5z"],
  volume: ["M4 9v6h4l5 4V5L8 9z", "M16.5 9a4.5 4.5 0 0 1 0 6"],
  gear: ["M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z", "M19.5 12a7.5 7.5 0 0 0-.15-1.5l2.1-1.6-2-3.4-2.45 1a7.6 7.6 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.5a7.6 7.6 0 0 0-2.6 1.5l-2.45-1-2 3.4 2.1 1.6a7.5 7.5 0 0 0 0 3l-2.1 1.6 2 3.4 2.45-1a7.6 7.6 0 0 0 2.6 1.5l.4 2.5h4l.4-2.5a7.6 7.6 0 0 0 2.6-1.5l2.45 1 2-3.4-2.1-1.6c.1-.5.15-1 .15-1.5z"],
  plus: ["M12 5v14", "M5 12h14"],
  back: "M15 5l-7 7 7 7",
  fwd: "M9 5l7 7-7 7",
  bell: ["M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6", "M10 19a2 2 0 0 0 4 0"],
  mic: ["M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z", "M6 11a6 6 0 0 0 12 0", "M12 17v4"],
};

// Полосатая заглушка обложки. hue задаёт тон, mono-подпись поясняет слот.
const Cover = ({ hue = 60, size = 150, radius = 8, label = "cover", round = false, dark = true, style = {} }) => {
  const l1 = dark ? 0.32 : 0.84, l2 = dark ? 0.27 : 0.79;
  const c = 0.025;
  return (
    <div style={{
      width: size, height: size, borderRadius: round ? "50%" : radius,
      background: `repeating-linear-gradient(45deg, oklch(${l1} ${c} ${hue}) 0 10px, oklch(${l2} ${c} ${hue}) 10px 20px)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, ...style,
    }}>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: Math.max(9, size * 0.07),
        letterSpacing: "0.06em", opacity: 0.5,
        color: dark ? "oklch(0.85 0.01 90)" : "oklch(0.35 0.02 60)",
      }}>{label}</span>
    </div>
  );
};

// ---- Мок-данные ----
const ROW_RECENT = {
  ru: "Недавно слушали", en: "Recently played",
  items: [
    { t: "Тихие часы", te: "Quiet Hours", s: "Плейлист · 43 трека", se: "Playlist · 43 tracks", hue: 55 },
    { t: "Low Tide Choir", te: "Low Tide Choir", s: "Артист", se: "Artist", hue: 200, round: true },
    { t: "Грунт", te: "Грунт", s: "Альбом · Молоко и мёд", se: "Album · Молоко и мёд", hue: 25 },
    { t: "Velvet Antenna", te: "Velvet Antenna", s: "Артист", se: "Artist", hue: 285, round: true },
    { t: "Утро вторника", te: "Tuesday Morning", s: "Ваш микс на сегодня", se: "Your mix for today", hue: 95 },
    { t: "Семь восьмых", te: "Семь восьмых", s: "Альбом · Танец Бруно", se: "Album · Танец Бруно", hue: 330 },
  ],
};
const ROW_NEW = {
  ru: "Новое от ваших артистов", en: "New from your artists",
  items: [
    { t: "Стеклянная вода", te: "Стеклянная вода", s: "Сингл · Молоко и мёд", se: "Single · Молоко и мёд", hue: 145 },
    { t: "Animal Letters", te: "Animal Letters", s: "Альбом · Paper Planes Club", se: "Album · Paper Planes Club", hue: 240 },
    { t: "Поле, ещё поле", te: "Поле, ещё поле", s: "EP · Грунтовка", se: "EP · Грунтовка", hue: 70 },
    { t: "Hourglass II", te: "Hourglass II", s: "Альбом · Velvet Antenna", se: "Album · Velvet Antenna", hue: 305 },
    { t: "Кассета 04", te: "Кассета 04", s: "Сингл · Танец Бруно", se: "Single · Танец Бруно", hue: 15 },
    { t: "Salt & Signal", te: "Salt & Signal", s: "Альбом · Low Tide Choir", se: "Album · Low Tide Choir", hue: 190 },
  ],
};
const PLAYLISTS_RU = ["Тихие часы", "Бег по набережной", "Кухня по выходным", "Для поезда", "2025", "С плохим интернетом"];
const PLAYLISTS_EN = ["Quiet Hours", "Riverside Run", "Weekend Kitchen", "Train Rides", "2025", "Bad Wi-Fi Mix"];

const NOW = {
  t: "Стеклянная вода", a: "Молоко и мёд", at: "2:41", len: "3:56", pct: 0.68, hue: 145,
};

Object.assign(window, { Ic, ICONS, Cover, ROW_RECENT, ROW_NEW, PLAYLISTS_RU, PLAYLISTS_EN, NOW });
