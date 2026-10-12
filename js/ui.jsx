// Spotless — UI-примитивы: иконки, обложки, точечные полосы и время, окна и ручка листа,
// бегущая строка, карточки, тосты.

const Ic = ({ d, size = 20, sw = 1.7, style = {}, fill = "none", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} className={className}
    stroke={fill === "none" ? "currentColor" : "none"} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, display: "block", ...style }}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  home: "M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z",
  search: ["M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z", "M16 16l5 5"],
  library: ["M4 4v16", "M9 4v16", "M14 5l5 14"],
  wallet: ["M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2", "M3 7v11a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H5a2 2 0 0 1-2-2z", "M16 14h2"],
  card: ["M3 6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z", "M3 10h18", "M7 15h4"],
  heart: "M12 20s-7-4.4-9.3-8.5C1 8.5 2.6 5 6.1 5c2.2 0 3.4 1.2 5.9 3.6C14.5 6.2 15.7 5 17.9 5c3.5 0 5.1 3.5 3.4 6.5C19 15.6 12 20 12 20z",
  heartOff: ["M12 20s-7-4.4-9.3-8.5C1 8.5 2.6 5 6.1 5c2.2 0 3.4 1.2 5.9 3.6C14.5 6.2 15.7 5 17.9 5c3.5 0 5.1 3.5 3.4 6.5C19 15.6 12 20 12 20z", "M4 3.5l16 17"],
  downloadCircle: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 7.5V15", "M8.8 12.2L12 15.4l3.2-3.2"],
  panel: ["M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z", "M9.5 4v16"],
  dollar: ["M12 3v18", "M16.5 7.5c0-1.7-2-2.7-4.5-2.7S7.5 6 7.5 8s2 2.6 4.5 3.2 4.7 1.3 4.7 3.4-2.2 3-4.7 3-4.7-1.1-4.7-2.9"],
  // Заливные значки плеера — со скруглёнными углами (острые треугольники выглядели самодельно)
  play: "M9.7 6.31L17.5 10.89Q19.4 12 17.5 13.11L9.7 17.69Q7.8 18.8 7.8 16.6L7.8 7.4Q7.8 5.2 9.7 6.31Z",
  pause: ["M8 5v14", "M16 5v14"],
  pauseFill: "M7.7 5L9.1 5Q10.5 5 10.5 6.4L10.5 17.6Q10.5 19 9.1 19L7.7 19Q6.3 19 6.3 17.6L6.3 6.4Q6.3 5 7.7 5ZM14.9 5L16.3 5Q17.7 5 17.7 6.4L17.7 17.6Q17.7 19 16.3 19L14.9 19Q13.5 19 13.5 17.6L13.5 6.4Q13.5 5 14.9 5Z",
  // Черта у «предыдущего» и «следующего» — тоже заливкой: тонкой обводкой её не было видно, и кнопки читались как play
  prev: "M19.2 7.6L19.2 16.4Q19.2 18.4 17.49 17.36L10.41 13.04Q8.7 12 10.41 10.96L17.49 6.64Q19.2 5.6 19.2 7.6ZM5.9 5.4Q7.1 5.4 7.1 6.6L7.1 17.4Q7.1 18.6 5.9 18.6Q4.7 18.6 4.7 17.4L4.7 6.6Q4.7 5.4 5.9 5.4Z",
  next: "M6.51 6.64L13.59 10.96Q15.3 12 13.59 13.04L6.51 17.36Q4.8 18.4 4.8 16.4L4.8 7.6Q4.8 5.6 6.51 6.64ZM18.1 5.4Q19.3 5.4 19.3 6.6L19.3 17.4Q19.3 18.6 18.1 18.6Q16.9 18.6 16.9 17.4L16.9 6.6Q16.9 5.4 18.1 5.4Z",
  shuffle: ["M3 7h3.5L17 17h4", "M21 7h-4L6.5 17H3", "M18 4l3 3-3 3", "M18 14l3 3-3 3"],
  repeat: ["M4 12V9a3 3 0 0 1 3-3h13", "M17 3l3 3-3 3", "M20 12v3a3 3 0 0 1-3 3H4", "M7 21l-3-3 3-3"],
  queue: ["M4 6h16", "M4 11h16", "M4 16h8", "M16 16l5 2.5-5 2.5z"],
  volume: ["M4 9v6h4l5 4V5L8 9z", "M16.5 9a4.5 4.5 0 0 1 0 6"],
  gear: ["M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z", "M19.5 12a7.5 7.5 0 0 0-.15-1.5l2.1-1.6-2-3.4-2.45 1a7.6 7.6 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.5a7.6 7.6 0 0 0-2.6 1.5l-2.45-1-2 3.4 2.1 1.6a7.5 7.5 0 0 0 0 3l-2.1 1.6 2 3.4 2.45-1a7.6 7.6 0 0 0 2.6 1.5l.4 2.5h4l.4-2.5a7.6 7.6 0 0 0 2.6-1.5l2.45 1 2-3.4-2.1-1.6c.1-.5.15-1 .15-1.5z"],
  plus: ["M12 5v14", "M5 12h14"],
  check: "M5 13l4 4 10-11",
  x: ["M6 6l12 12", "M18 6L6 18"],
  back: "M15 5l-7 7 7 7",
  fwd: "M9 5l7 7-7 7",
  chevR: "M9 6l6 6-6 6",
  chevD: "M6 9l6 6 6-6",
  bell: ["M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6", "M10 19a2 2 0 0 0 4 0"],
  mic: ["M12 3.5a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0v-5a3 3 0 0 0-3-3z", "M6.5 11.5a5.5 5.5 0 0 0 11 0", "M12 17v3.5", "M9 20.5h6"],
  miniplayer: ["M3 6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z", "M12.5 12.5h6.5V18h-6.5z"],
  // Точки — заливкой: обводка крошечного круга толще его самого рисовалась кольцами («ooo»)
  more: "M3.4 12a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0-3.2 0zM10.4 12a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0-3.2 0zM17.4 12a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0-3.2 0z",
  expand: ["M9 4H4v5", "M15 4h5v5", "M9 20H4v-5", "M15 20h5v-5"],
  collapse: ["M4 9h5V4", "M20 9h-5V4", "M4 15h5v5", "M20 15h-5v5"],
  devices: ["M4 6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v3h-2V7H6v9h5v2H5a1 1 0 0 1-1-1z", "M15 11h5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z"],
  shareIc: ["M12 3v12", "M8 7l4-4 4 4", "M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"],
  user: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M4 21c0-4 3.5-6.5 8-6.5s8 2.5 8 6.5"],
  users: ["M9 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z", "M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5", "M16 11.5a3 3 0 1 0-1.5-5.6", "M17.5 14.7c2.4.5 4 2.2 4 4.8"],
  key: ["M8.5 20a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z", "M11.7 12.3L20 4", "M17 7l2.5 2.5", "M14.5 9.5l1.8 1.8"],
  lock: ["M6 11V8a6 6 0 0 1 12 0v3", "M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z"],
  eye: ["M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
  copy: ["M9 9h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z", "M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"],
  globe: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M3 12h18", "M12 3c2.5 2.4 3.8 5.5 3.8 9S14.5 18.6 12 21c-2.5-2.4-3.8-5.5-3.8-9S9.5 5.4 12 3z"],
  sparkle: ["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z", "M19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9z"],
  pin: ["M12 17v5", "M7 4h10l-1.5 7.5 2.5 3.5H6l2.5-3.5z"],
  clock: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 7v5l3.5 2"],
  download: ["M12 3v12", "M8 11l4 4 4-4", "M5 19h14"],
  refresh: ["M20 12a8 8 0 1 1-2.3-5.6", "M20 3v4h-4"],
  jam: ["M9 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M17 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M12 15V5l8-2v10"],
  note: ["M9 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M12 16V4l7 2v3l-7-2"],
  trash: ["M4 7h16", "M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2", "M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13", "M10 11v6", "M14 11v6"],
  drag: ["M8 9.5h8", "M8 14.5h8"],
  link: ["M10 14a4.5 4.5 0 0 0 6.4 0l2.3-2.3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2", "M14 10a4.5 4.5 0 0 0-6.4 0l-2.3 2.3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"],
  image: ["M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z", "M9 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z", "M4 16l5-5 4 4 3-3 4 4"],
  phone: ["M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z", "M11 18h2"],
  speaker: ["M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z", "M12 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z", "M12 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"],
};

// ---------- Обложки ----------
// Реальных обложек нет: у каждого релиза и артиста — своя генеративная CSS-картинка
// (README 4.4: при выходе заменятся настоящими). Проценты в градиентах — чтобы рисунок
// одинаково читался и на 40px в строке трека, и на 480px в полноэкранном плеере.
const ALBUM_ART = {
  grunt: "repeating-linear-gradient(180deg, rgba(0,0,0,0.22) 0 1.2%, transparent 1.2% 5%) 0 100% / 100% 38% no-repeat, linear-gradient(180deg, transparent 0 62%, #7A4527 62% 100%), radial-gradient(circle at 50% 62%, #F0B54A 0 25%, transparent 25.5%), #2A1C15",
  glass: "repeating-radial-gradient(circle at 64% 60%, rgba(200,255,232,0.32) 0 0.6%, transparent 0.6% 5%), radial-gradient(circle at 64% 60%, #B8F5E0 0 4.5%, transparent 5%), linear-gradient(165deg, #0B2B2A 0%, #13564C 55%, #2C8C78 100%)",
  salt: "linear-gradient(180deg, transparent 0 46%, #9DB0B9 46% 47.5%, transparent 47.5%), radial-gradient(circle at 74% 36%, #FF4D3D 0 2.4%, transparent 2.8%), linear-gradient(180deg, #D9DEE0 0 46%, #6B8796 47.5% 68%, #3C5A6B 68% 84%, #24394A 84%)",
  hourglass: "repeating-linear-gradient(180deg, transparent 0 6%, #170A2C 6% 8.5%) 0 100% / 100% 42% no-repeat, radial-gradient(circle at 50% 60%, #FFB36B 0, #FF4F9A 26%, transparent 26.5%), linear-gradient(180deg, #170A2C 0 40%, #3B1460 100%)",
  animal: "radial-gradient(circle at 26% 30%, #1E3A8A 0 6%, transparent 6.5%), linear-gradient(118deg, #ECE6DA 0 52%, #1E3A8A 52% 71%, #F2B134 71% 100%)",
  seven: "radial-gradient(circle at 70% 30%, #E0457B 0 18%, transparent 18.5%), radial-gradient(circle, #CFFF3A 0 1.4px, transparent 1.9px) 0 0 / 12px 12px, #121212",
  cassette: "radial-gradient(circle at 34% 56%, #FF5B1F 0 6%, #111111 6.5% 15%, transparent 15.5%), radial-gradient(circle at 66% 56%, #FF5B1F 0 6%, #111111 6.5% 15%, transparent 15.5%), linear-gradient(180deg, #FF5B1F 0 30%, #F4EDE2 30% 34%, #FF5B1F 34%)",
  pole: "linear-gradient(180deg, transparent 0 58%, #C81E1E 58% 63%, transparent 63%), repeating-linear-gradient(176deg, #B59B3E 0 2%, #9C8432 2% 4%) 0 100% / 100% 63% no-repeat, #1B1A17",
};
// Для точечной матрицы тонкие детали теряются — у некоторых обложек своя, более жирная версия
const GLYPH_ART = {
  glass: "repeating-radial-gradient(circle at 60% 56%, #A8F0D6 0 2.4%, transparent 2.4% 10%), radial-gradient(circle at 60% 56%, #E4FFF5 0 9%, transparent 9.5%), linear-gradient(165deg, #0E3A36 0%, #1C6E60 100%)",
  seven: "radial-gradient(circle at 70% 30%, #E0457B 0 22%, transparent 22.5%), repeating-linear-gradient(90deg, #CFFF3A 0 4%, transparent 4% 12%), #121212",
};
const ARTIST_ART = {
  milk: "radial-gradient(circle at 35% 40%, #F0B54A 0 18%, transparent 19%), linear-gradient(200deg, #7A4527, #2A1C15)",
  lowtide: "linear-gradient(180deg, #D9DEE0 0 46%, #6B8796 47.5% 68%, #24394A 84%)",
  velvet: "radial-gradient(circle at 50% 60%, #FFB36B 0, #FF4F9A 30%, transparent 31%), #170A2C",
  paper: "linear-gradient(118deg, #ECE6DA 0 52%, #1E3A8A 52% 71%, #F2B134 71% 100%)",
  bruno: "radial-gradient(circle at 70% 30%, #E0457B 0 22%, transparent 23%), radial-gradient(circle, #CFFF3A 0 1.2px, transparent 1.6px) 0 0 / 9px 9px, #121212",
  gruntovka: "linear-gradient(180deg, #1B1A17 0 45%, #C81E1E 45% 55%, #A38F3A 55%)",
};
// art: id альбома ("grunt") или "ar:<id>" для артиста; без art — точечная плитка в тоне hue (плейлисты, миксы)
const coverBg = (art, hue, px, glyph) => {
  if (art && art.startsWith("ar:") && ARTIST_ART[art.slice(3)]) return ARTIST_ART[art.slice(3)];
  if (art && glyph && GLYPH_ART[art]) return GLYPH_ART[art];
  if (art && ALBUM_ART[art]) return ALBUM_ART[art];
  const p = px ? Math.max(5, Math.round(px / 15)) : 11;
  const r = (p * 0.24).toFixed(1);
  return `radial-gradient(circle, oklch(var(--dot-l) 0.12 ${hue}) 0 ${r}px, transparent ${(+r + 0.5).toFixed(1)}px) 0 0 / ${p}px ${p}px, var(--bg2)`;
};

const Cover = ({ hue = 60, art, size = 150, radius, round = false, glyph = false, style = {} }) => {
  const numeric = typeof size === "number";
  const gp = numeric ? Math.max(4, Math.round(size / 27)) : 9;
  return (
    <div aria-hidden="true" className={glyph ? "glyph" : undefined} style={{
      width: size, height: size, flexShrink: 0,
      borderRadius: round || glyph ? "50%" : (radius != null ? radius : "calc(var(--r) - 10px)"),
      background: coverBg(art, hue, numeric ? size : null, glyph),
      ...(glyph ? { "--gp": gp + "px", "--gr": (gp * 0.34).toFixed(2) + "px" } : {}),
      ...style,
    }}></div>
  );
};

// ---------- Точечная полоса ----------
// Внешний блок тянется, внутренний — ровно целое число точек: на краю нет половинок.
const DotBar = ({ pct = 0, pitch = 8, r, onSeek, on, off, width, label, style = {} }) => {
  const ref = React.useRef(null);
  const w = useWidth(ref);
  const n = Math.max(0, Math.floor(w / pitch));
  const lit = Math.round(n * Math.max(0, Math.min(1, pct)));
  const rr = r != null ? r : pitch * 0.26;
  return (
    <div ref={ref} style={{ flex: width ? "none" : 1, width, minWidth: 0, ...style }}>
      <div className={"dotbar" + (onSeek ? " seek" : "")}
        role={onSeek ? "slider" : undefined} aria-label={label}
        aria-valuemin={onSeek ? 0 : undefined} aria-valuemax={onSeek ? 100 : undefined}
        aria-valuenow={onSeek ? Math.round(pct * 100) : undefined}
        onClick={onSeek}
        style={{ width: n * pitch, "--dp": pitch + "px", "--dr": rr + "px", ...(on ? { "--dot-on": on } : {}), ...(off ? { "--dot-off": off } : {}) }}>
        <i style={{ width: lit * pitch }}></i>
      </div>
    </div>
  );
};

// Время точечным шрифтом: двоеточие — две точки, у шрифта оно рисуется криво
const DotTime = ({ value, size = 72, color, label }) => {
  const [m, s] = value.split(":");
  const d = Math.max(3, Math.round(size * 0.1));
  return (
    <span aria-label={label || value} className="dots" style={{ display: "inline-flex", alignItems: "center", fontSize: size, color, fontWeight: 900 }}>
      <span aria-hidden="true">{m.padStart(2, "0")}</span>
      <span aria-hidden="true" style={{ display: "inline-flex", flexDirection: "column", gap: d * 1.9, margin: `0 ${d * 0.8}px` }}>
        <span style={{ width: d, height: d, borderRadius: "50%", background: "currentColor" }}></span>
        <span style={{ width: d, height: d, borderRadius: "50%", background: "currentColor" }}></span>
      </span>
      <span aria-hidden="true">{s}</span>
    </span>
  );
};

// 10 точек оценки: горят до значения
const RateDots = ({ value, size = 6, gap = 4, on = "var(--text)" }) => (
  <span aria-hidden="true" style={{ display: "inline-flex", gap }}>
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
      <span key={n} style={{ width: size, height: size, borderRadius: "50%", background: value && n <= value ? on : "var(--dot-off)" }}></span>
    ))}
  </span>
);

// Ручка нижнего листа (телефон): лист едет за пальцем вниз; дальше 90px или быстрым рывком — закрывается.
// Анимацию появления снимаем на время жеста, иначе её финальный кадр перебивает transform.
const SheetGrip = ({ onClose }) => {
  const st = React.useRef(null);
  const end = (cancel) => {
    const s = st.current; st.current = null;
    if (!s) return;
    const dy = s.dy || 0;
    const v = dy / Math.max(1, Date.now() - s.t);
    s.sh.style.transition = "transform 0.22s cubic-bezier(.2,.8,.2,1)";
    if (!cancel && (dy > 90 || v > 0.6)) { s.sh.style.transform = "translateY(110%)"; buzz(8); setTimeout(onClose, 190); }
    else s.sh.style.transform = "";
  };
  return (
    <div className="sheet-grip" aria-hidden="true"
      onPointerDown={(e) => {
        const sh = e.currentTarget.closest(".modal");
        if (!sh) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        sh.style.animation = "none"; sh.style.transition = "none";
        st.current = { y: e.clientY, t: Date.now(), sh, dy: 0 };
      }}
      onPointerMove={(e) => {
        const s = st.current; if (!s) return;
        s.dy = Math.max(0, e.clientY - s.y);
        s.sh.style.transform = `translateY(${s.dy}px)`;
      }}
      onPointerUp={() => end(false)} onPointerCancel={() => end(true)}>
      <span></span>
    </div>
  );
};

// Бегущая строка для длинных названий: едет туда-обратно с паузами по краям, только если не влезает
const Marquee = ({ children, style }) => {
  const box = React.useRef(null);
  const inner = React.useRef(null);
  const [d, setD] = React.useState(0);
  React.useLayoutEffect(() => {
    if (!box.current || !inner.current) return;
    const over = inner.current.scrollWidth - box.current.clientWidth;
    setD(over > 2 ? over + 8 : 0);
  }, [children]);
  return (
    <div ref={box} style={{ overflow: "hidden", whiteSpace: "nowrap", minWidth: 0, ...style,
      WebkitMaskImage: d ? "linear-gradient(90deg, #000 0, #000 88%, transparent)" : undefined,
      maskImage: d ? "linear-gradient(90deg, #000 0, #000 88%, transparent)" : undefined }}>
      <span ref={inner} className={d ? "mq" : ""} style={{ display: "inline-block", "--mq": `-${d}px`, animationDuration: `${Math.max(7, d / 18)}s` }}>{children}</span>
    </div>
  );
};

// Окно поверх всего: затемнение, на телефоне — лист снизу с ручкой. Закрывается тапом мимо,
// ручкой и Esc. Рендерится в body: внутри страницы затемнение не накрывало плеер и правую панель
// (галерея тем, транзакции), а лист на телефоне уходил под нижнюю навигацию.
// События портала всплывают по дереву React — до того, кто окно открыл, доходит только то,
// что не погасило само окно (клик — гасит). out — окно уходит (useExit): анимация ухода, без нажатий.
const Sheet = ({ close, out, label, screen, width, children }) => {
  useEscape(close, !out);
  return ReactDOM.createPortal(
    <div className={"scrim" + (out ? " is-out" : "")} onClick={close}>
      <div className="modal" role="dialog" aria-label={label} data-screen-label={screen}
        style={width ? { width } : undefined} onClick={(e) => e.stopPropagation()}>
        <SheetGrip onClose={close} />
        {children}
      </div>
    </div>,
    document.body
  );
};

// Шапка окна: заголовок и крестик
const SheetHead = ({ title, close, style }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, ...style }}>
    <div style={{ fontSize: 18, fontWeight: 800 }}>{title}</div>
    <button className="iconbtn" aria-label={useApp().t.close} onClick={close}><Ic d={ICONS.x} size={16} /></button>
  </div>
);

// Карточка (альбом/артист/плейлист). ctx — payload для контекстного меню по ПКМ.
const MediaCard = ({ title, sub, hue, art, round, onClick, onPlay, ctx }) => {
  const app = useApp();
  const lp = useLongPress((x, y) => ctx && app.openCtxPoint(x, y, ctx));
  return (
    <button className="card" onClick={onClick} {...(ctx ? lp : {})}
      onContextMenu={ctx && app ? (e) => isTouchUI() ? e.preventDefault() : app.openCtx(e, ctx) : undefined}>
      <div style={{ position: "relative" }}>
        <Cover art={art} hue={hue} size="100%" round={round} radius={16} style={{ aspectRatio: "1", width: "100%", height: "auto" }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="t">{title}</div>
        <div className="s">{sub}</div>
      </div>
      {onPlay && (
        <span className="hoverplay" role="button" aria-label={title} onClick={(e) => { e.stopPropagation(); onPlay(); }}>
          <Ic d={ICONS.play} size={20} fill="currentColor" />
        </span>
      )}
    </button>
  );
};

// Свойства карточек — одинаковые на всех страницах; sub — подпись, она везде своя.
// Ключ (key) ставит сам список.
const albumCard = (app, al, sub) => ({
  title: al.title, sub, hue: al.hue, art: al.id,
  onClick: () => app.go("album", al.id), onPlay: () => app.playContext(albumIds(al)), ctx: { kind: "album", id: al.id },
});
// onPlay у артиста не везде: где его нет, у карточки нет и кнопки «Слушать»
const artistCard = (app, a, sub, onPlay) => ({
  title: a.name, sub, hue: a.hue, art: "ar:" + a.id, round: true,
  onClick: () => app.go("artist", a.id), onPlay, ctx: { kind: "artist", id: a.id },
});
// tracks — что играть (по умолчанию — текущий состав плейлиста)
const playlistCard = (app, pl, sub, tracks) => ({
  title: plName(app.lang, pl), sub, hue: pl.hue,
  onClick: () => app.go("playlist", pl.id), onPlay: () => app.playContext(tracks || app.playlistTracks(pl.id)), ctx: { kind: "playlist", id: pl.id },
});
// «48 213 слушателей в месяц»
const listenersLine = (app, a) => `${a.listeners.toLocaleString(app.lang)} ${app.t.monthlyListeners}`;

// Тосты
const Toasts = () => {
  const app = useApp();
  return (
    <div className="toasts" role="status" aria-live="polite" style={{ position: "fixed", bottom: 116, left: 16, right: 16, zIndex: 200, display: "flex", flexDirection: "column", gap: 8, alignItems: "center", pointerEvents: "none" }}>
      {app.toasts.map(t => (
        <div key={t.id} className={"toast" + (t.out ? " is-out" : "")} style={{
          background: "var(--text)", color: "var(--bg0)", borderRadius: 99,
          padding: t.action ? "6px 6px 6px 22px" : "11px 22px", fontSize: 13.5, fontWeight: 500, boxShadow: "var(--island-shadow)",
          maxWidth: "calc(100vw - 32px)", textAlign: "center", display: "flex", alignItems: "center", gap: 12,
        }}>
          <span style={{ textWrap: "balance" }}>{t.msg}</span>
          {t.action && (
            <button onClick={() => { t.action.run(); app.dismissToast(t.id); }} style={{
              pointerEvents: "auto", minHeight: 36, padding: "0 16px", borderRadius: 99, fontWeight: 600,
              background: "var(--bg0)", color: "var(--text)",
            }}>{t.action.label}</button>
          )}
        </div>
      ))}
    </div>
  );
};

Object.assign(window, {
  Ic, ICONS, ALBUM_ART, ARTIST_ART, coverBg, Cover, DotBar, DotTime, RateDots, SheetGrip, Marquee, Sheet, SheetHead,
  MediaCard, albumCard, artistCard, playlistCard, listenersLine, Toasts,
});
