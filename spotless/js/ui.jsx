// Spotless — UI-примитивы: иконки, обложки, точечные полосы, кнопки действий, строка трека, тосты.

const AppCtx = React.createContext(null);
const useApp = () => React.useContext(AppCtx);

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
  play: "M8 5.5v13l11-6.5z",
  pause: ["M8 5v14", "M16 5v14"],
  pauseFill: "M6.5 5h4v14h-4zM13.5 5h4v14h-4z",
  prev: ["M19 5.5v13l-9.5-6.5z", "M6 5v14"],
  next: ["M5 5.5v13l9.5-6.5z", "M18 5v14"],
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
  mic: ["M14.3 4.1a3.25 3.25 0 0 1 4.6 4.6l-1.9 1.9-4.6-4.6 1.9-1.9z", "M5.1 16.3l7.2-7.2 3.5 3.5-7.2 7.2a2.5 2.5 0 0 1-3.5-3.5z", "M11.3 10.1l-3.4 3.4"],
  miniplayer: ["M3 6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z", "M12.5 12.5h6.5V18h-6.5z"],
  more: ["M5 12.5a0.5 0.5 0 1 0 0-1 0.5 0.5 0 0 0 0 1z", "M12 12.5a0.5 0.5 0 1 0 0-1 0.5 0.5 0 0 0 0 1z", "M19 12.5a0.5 0.5 0 1 0 0-1 0.5 0.5 0 0 0 0 1z"],
  expand: ["M9 4H4v5", "M15 4h5v5", "M9 20H4v-5", "M15 20h5v-5"],
  collapse: ["M4 9h5V4", "M20 9h-5V4", "M4 15h5v5", "M20 15h-5v5"],
  devices: ["M4 6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v3h-2V7H6v9h5v2H5a1 1 0 0 1-1-1z", "M15 11h5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z"],
  shareIc: ["M12 3v12", "M8 7l4-4 4 4", "M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"],
  user: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M4 21c0-4 3.5-6.5 8-6.5s8 2.5 8 6.5"],
  users: ["M9 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z", "M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5", "M16 11.5a3 3 0 1 0-1.5-5.6", "M17.5 14.7c2.4.5 4 2.2 4 4.8"],
  key: ["M14 11a4.5 4.5 0 1 0-4.3 4.5L11 14h2v-2h2l1-1z M21 6l-7 7", "M15.5 8.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"],
  lock: ["M6 11V8a6 6 0 0 1 12 0v3", "M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z"],
  eye: ["M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
  copy: ["M9 9h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z", "M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"],
  globe: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M3 12h18", "M12 3c2.5 2.4 3.8 5.5 3.8 9S14.5 18.6 12 21c-2.5-2.4-3.8-5.5-3.8-9S9.5 5.4 12 3z"],
  sparkle: ["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z", "M19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9z"],
  pin: ["M12 17v5", "M7 4h10l-1.5 7.5 2.5 3.5H6l2.5-3.5z"],
  clock: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 7v5l3.5 2"],
  download: ["M12 3v12", "M8 11l4 4 4-4", "M5 19h14"],
  refresh: ["M20 12a8 8 0 1 1-2.3-5.6", "M20 3v4h-4"],
  jam: ["M9 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M12 15V5l8-2v10", "M17 16a3 3 0 1 0 3-3"],
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
  return `radial-gradient(circle, oklch(0.8 0.12 ${hue}) 0 ${r}px, transparent ${(+r + 0.5).toFixed(1)}px) 0 0 / ${p}px ${p}px, var(--bg2)`;
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
const useWidth = (ref) => {
  const [w, setW] = React.useState(0);
  React.useLayoutEffect(() => {
    if (!ref.current) return;
    setW(ref.current.getBoundingClientRect().width);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return w;
};

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

// Короткий тактильный отклик (Android); где вибрация недоступна — молча ничего
const buzz = (ms = 10) => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} };
const isTouchUI = () => { try { return window.matchMedia("(hover: none)").matches; } catch (e) { return false; } };

// Долгое нажатие пальцем (мышь не трогаем — у неё есть ПКМ). Сдвиг больше 10px — это прокрутка, отмена.
// После срабатывания гасим следующий клик, чтобы трек не включился сам.
const useLongPress = (onLong, ms = 450) => {
  const timer = React.useRef(null);
  const start = React.useRef(null);
  const fired = React.useRef(false);
  const clear = () => { clearTimeout(timer.current); timer.current = null; };
  return {
    onPointerDown: (e) => {
      if (e.pointerType === "mouse") return;
      fired.current = false;
      const x = e.clientX, y = e.clientY;
      start.current = [x, y];
      clear();
      timer.current = setTimeout(() => { fired.current = true; buzz(12); onLong(x, y); }, ms);
    },
    onPointerMove: (e) => {
      if (timer.current && start.current && Math.hypot(e.clientX - start.current[0], e.clientY - start.current[1]) > 10) clear();
    },
    onPointerUp: clear, onPointerCancel: clear,
    onClickCapture: (e) => { if (fired.current) { e.stopPropagation(); e.preventDefault(); fired.current = false; } },
  };
};

// Сердечко: тап = лайк; удержание = шкала 1–10. Не отпуская палец, можно сразу вести
// по шкале — оценка меняется на ходу, ставится при отпускании.
const LikeButton = ({ trackId, size = 30, always = false }) => {
  const app = useApp();
  const st = app.trackState(trackId);
  const [open, setOpen] = React.useState(null); // null | { scrub }
  const [burst, setBurst] = React.useState(0);
  const btnRef = React.useRef(null);
  const timer = React.useRef(null);
  const longFired = React.useRef(false);
  const startPt = React.useRef(null);

  const down = (e) => {
    e.stopPropagation();
    if (e.button != null && e.button !== 0) return;
    longFired.current = false;
    startPt.current = [e.clientX, e.clientY];
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { longFired.current = true; buzz(14); setOpen({ scrub: true }); }, 350);
  };
  const move = (e) => {
    // до срабатывания удержания заметный сдвиг — это не нажатие
    if (!longFired.current && startPt.current && Math.hypot(e.clientX - startPt.current[0], e.clientY - startPt.current[1]) > 12) {
      clearTimeout(timer.current); startPt.current = null;
    }
  };
  const up = (e) => {
    e.stopPropagation();
    clearTimeout(timer.current);
    if (!longFired.current && !open && startPt.current) {
      const willLike = !(st.liked || st.rating != null);
      app.toggleLike(trackId);
      if (willLike) { buzz(10); setBurst(Date.now()); }
    }
    startPt.current = null;
  };
  React.useEffect(() => {
    if (!burst) return;
    const id = setTimeout(() => setBurst(0), 650);
    return () => clearTimeout(id);
  }, [burst]);
  const lit = st.liked || st.rating != null;
  const neg = st.rating != null && st.rating < 5;
  const label = st.rating != null ? `${app.t.yourRating}: ${st.rating}` : (st.liked ? app.t.liked || app.t.like : app.t.like);
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <button ref={btnRef}
        className={"iconbtn likebtn" + (neg ? " neg" : lit ? " hot" : "") + (burst ? " pop" : "")}
        style={{ width: size, height: size, opacity: (always || lit) ? 1 : undefined }}
        title={app.t.holdHint} aria-label={label} aria-pressed={lit}
        onPointerDown={down} onPointerMove={move} onPointerUp={up}
        onPointerCancel={() => { clearTimeout(timer.current); startPt.current = null; }}
        onContextMenu={(e) => e.preventDefault()}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); app.toggleLike(trackId); } }}
      >
        <Ic d={neg ? ICONS.heartOff : ICONS.heart} size={size * 0.56}
          fill={!neg && (st.liked || st.rating != null) ? "currentColor" : "none"} sw={1.8} />
      </button>
      {burst > 0 && (
        <span className="burst" key={burst} aria-hidden="true">
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <i key={i} style={{ "--a": `${i * 45}deg` }}></i>)}
        </span>
      )}
      {st.rating != null && (
        <span className="rate-n mono" style={{
          position: "absolute", top: -2, right: -4, fontSize: 10, fontWeight: 500,
          color: neg ? "var(--bad)" : "var(--text)", pointerEvents: "none",
        }}>{st.rating}</span>
      )}
      {open && <RatingPop trackId={trackId} anchor={btnRef} scrub={open.scrub} close={() => setOpen(null)} />}
    </span>
  );
};

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

// Поповер не должен вылезать за край окна: замеряем и сдвигаем
const usePopClamp = () => {
  const ref = React.useRef(null);
  const [dx, setDx] = React.useState(0);
  React.useLayoutEffect(() => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    let d = 0;
    if (r.right > window.innerWidth - 10) d = window.innerWidth - 10 - r.right;
    if (r.left + d < 10) d = 10 - r.left;
    if (Math.abs(d) > 1) setDx(prev => prev + d);
  }, []);
  return [ref, dx];
};

// Шкала оценки. Рендерится в body (портал), позиционируется от кнопки:
// так её не обрезают прокручиваемые списки и анимированные контейнеры.
// Мышь: наведение показывает значение, клик ставит. Палец: ведите по шкале — значение
// меняется на ходу с лёгкой вибрацией на каждом делении, ставится при отпускании.
const RatingPop = ({ trackId, anchor, scrub, close }) => {
  const app = useApp();
  const st = app.trackState(trackId);
  const [hov, setHov] = React.useState(null);
  const [pos, setPos] = React.useState(null);
  const popRef = React.useRef(null);
  const scaleRef = React.useRef(null);
  const hovRef = React.useRef(null);
  const done = React.useRef(false);
  const shown = hov != null ? hov : st.rating;

  React.useLayoutEffect(() => {
    if (!popRef.current || !anchor || !anchor.current) return;
    const a = anchor.current.getBoundingClientRect();
    const p = popRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const left = Math.max(10, Math.min(vw - 10 - p.width, a.left + a.width / 2 - p.width / 2));
    let top = a.top - p.height - 12;
    if (top < 10) top = a.bottom + 12;
    setPos({ left, top });
  }, []);

  const valAt = (x) => {
    const r = scaleRef.current.getBoundingClientRect();
    return Math.max(1, Math.min(10, Math.floor((x - r.left) / (r.width / 10)) + 1));
  };
  const live = (n) => { if (n !== hovRef.current) { hovRef.current = n; setHov(n); if (n != null) buzz(6); } };
  const commit = (n) => {
    if (done.current) return;
    done.current = true;
    if (n != null) { app.setRating(trackId, n); buzz(14); }
    close();
  };

  // Палец ещё на сердечке после удержания: слушаем движение по всему окну.
  // Фаза перехвата обязательна — кнопка сердечка гасит всплытие своих событий.
  React.useEffect(() => {
    if (!scrub) return;
    let moved = false;
    const mv = (e) => { if (!scaleRef.current) return; moved = true; live(valAt(e.clientX)); };
    const up = () => { if (moved) commit(hovRef.current); };
    window.addEventListener("pointermove", mv, true);
    window.addEventListener("pointerup", up, true);
    return () => { window.removeEventListener("pointermove", mv, true); window.removeEventListener("pointerup", up, true); };
  }, []);
  // Тап мимо закрывает; Esc тоже
  React.useEffect(() => {
    const h = (e) => { if (popRef.current && !popRef.current.contains(e.target)) close(); };
    const k = (e) => { if (e.key === "Escape") close(); };
    const id = setTimeout(() => window.addEventListener("pointerdown", h, true), 0);
    window.addEventListener("keydown", k);
    return () => { clearTimeout(id); window.removeEventListener("pointerdown", h, true); window.removeEventListener("keydown", k); };
  }, []);

  const node = (
    <div ref={popRef} className="pop fade-up ratepop" role="dialog" aria-label={app.t.yourRating}
      onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}
      style={{ position: "fixed", left: pos ? pos.left : -9999, top: pos ? pos.top : -9999, zIndex: 300 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span className="mlabel">{app.t.yourRating}</span>
        <span className="dots" style={{ fontSize: 30, minWidth: 40, textAlign: "right", color: shown && shown < 5 ? "var(--bad)" : "var(--text)" }}>{shown || "–"}</span>
      </div>
      <div ref={scaleRef} className="rate-scale" role="slider" aria-valuemin={1} aria-valuemax={10} aria-valuenow={shown || 0} tabIndex={0}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); live(valAt(e.clientX)); }}
        onPointerMove={(e) => { if (e.pointerType === "mouse" && !e.buttons) { const n = valAt(e.clientX); if (n !== hovRef.current) { hovRef.current = n; setHov(n); } } else live(valAt(e.clientX)); }}
        onPointerUp={(e) => commit(valAt(e.clientX))}
        onPointerLeave={(e) => { if (e.pointerType === "mouse" && !e.buttons) { hovRef.current = null; setHov(null); } }}
        onKeyDown={(e) => {
          const cur = hovRef.current != null ? hovRef.current : (st.rating || 0);
          if (e.key === "ArrowRight") { e.preventDefault(); live(Math.min(10, cur + 1)); }
          if (e.key === "ArrowLeft") { e.preventDefault(); live(Math.max(1, cur - 1)); }
          if (e.key === "Enter") { e.preventDefault(); commit(hovRef.current); }
        }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => {
          const on = shown && n <= shown;
          return (
            <span key={n} className="rate-cell">
              <span style={{
                background: on ? (shown < 5 ? "var(--bad)" : "var(--hot)") : "var(--dot-off)",
                transform: n === shown && hov != null ? "scale(1.3)" : "none",
              }}></span>
            </span>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginTop: 10 }}>
        <span style={{ fontSize: 12, color: "var(--mut)", lineHeight: 1.45 }}>{app.t.ratingHint}</span>
        {st.rating != null && (
          <button className="more" style={{ fontSize: 12, flexShrink: 0 }} onClick={() => { done.current = true; app.setRating(trackId, null); close(); }}>{app.t.removeRating}</button>
        )}
      </div>
    </div>
  );
  return ReactDOM.createPortal(node, document.body);
};

// Плюсик: поповер со списком плейлистов.
// Сам поповер — отдельный компонент: он монтируется только при открытии,
// поэтому usePopClamp замеряет его в правильный момент (фикс обрезания у края).
const PlusPop = ({ trackId, inPls }) => {
  const app = useApp();
  const [ref, dx] = usePopClamp();
  return (
    <div ref={ref} className="pop fade-up" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}
      style={{ bottom: "calc(100% + 10px)", left: `calc(50% + ${dx}px)`, marginLeft: -120, width: 240, padding: 6 }}>
      <div className="mlabel" style={{ padding: "8px 10px 8px" }}>{app.t.addToPlaylist}</div>
      <div style={{ maxHeight: 235, overflowY: "auto" }}>
        {app.allPlaylists.filter(p => p.byMe).map(pl => {
          const on = inPls.includes(pl.id);
          return (
            <button key={pl.id} onClick={() => app.togglePlaylist(trackId, pl.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
                padding: "7px 10px", borderRadius: 10, fontSize: 13.5, color: "var(--text)",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg3)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              <Cover hue={pl.hue} size={24} radius={6} />
              <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{app.lang === "ru" ? pl.name : pl.nameEn}</span>
              {on && <Ic d={ICONS.check} size={14} sw={2.2} style={{ color: "var(--acc)" }} />}
            </button>
          );
        })}
      </div>
      <div className="divider" style={{ margin: "6px 0" }}></div>
      <button onClick={() => app.openCreatePl({ thenAdd: trackId })}
        style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "7px 10px", borderRadius: 10, fontSize: 13.5, color: "var(--mut)" }}
        onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg3)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
        <Ic d={ICONS.plus} size={16} /><span>{app.t.newPlaylist}</span>
      </button>
    </div>
  );
};

const PlusButton = ({ trackId, size = 30, className = "" }) => {
  const app = useApp();
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    const h = () => setOpen(false);
    window.addEventListener("mousedown", h);
    window.addEventListener("touchstart", h);
    return () => { window.removeEventListener("mousedown", h); window.removeEventListener("touchstart", h); };
  }, [open]);
  const inPls = app.trackPlaylists(trackId);
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <button className={"iconbtn " + className + (inPls.length ? " lit" : "")} style={{ width: size, height: size }}
        title={app.t.addToPlaylist} aria-label={app.t.addToPlaylist} aria-expanded={open}
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
        <Ic d={inPls.length ? ICONS.check : ICONS.plus} size={size * 0.53} sw={2} />
      </button>
      {open && <PlusPop trackId={trackId} inPls={inPls} />}
    </span>
  );
};

// Значок $ — открывает донат
const DonateButton = ({ target, size = 30, className = "" }) => {
  const app = useApp();
  return (
    <button className={"iconbtn " + className} style={{ width: size, height: size }} title={app.t.donate} aria-label={app.t.donate}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => { e.stopPropagation(); app.openDonate(target); }}>
      <Ic d={ICONS.dollar} size={size * 0.5} sw={1.9} />
    </button>
  );
};

// Кнопка загрузки: общее состояние в app.downloads — релиз и его треки связаны.
// trackId — один трек; albumId — весь релиз; listIds — произвольный список (плейлист).
const DLButton = ({ trackId, albumId, listIds, size = 42, className = "" }) => {
  const app = useApp();
  let state = "idle", dur = 2400;
  if (trackId) {
    state = app.downloads[trackId] || "idle";
  } else if (albumId) {
    const ids = DB.albums[albumId].tracks.map(t => t.id);
    if (ids.every(id => app.downloads[id] === "done")) state = "done";
    else if (ids.some(id => app.downloads[id])) state = "loading";
    dur = ids.length * 450 + 1500;
  } else if (listIds) {
    if (listIds.length && listIds.every(id => app.downloads[id] === "done")) state = "done";
    else if (listIds.some(id => app.downloads[id])) state = "loading";
    dur = listIds.length * 450 + 1500;
  }
  const click = (e) => {
    e.stopPropagation();
    if (trackId) app.toggleDl(trackId);
    else if (albumId) app.toggleDlAlbum(albumId);
    else if (listIds) app.toggleDlList(listIds);
  };
  const R = 9.2, C = (2 * Math.PI * R).toFixed(1);
  const s = Math.round(size * 0.52);
  return (
    <button className={"iconbtn " + className + (state === "done" ? " lit" : "")} style={{ width: size, height: size }}
      title={state === "done" ? app.t.downloaded : app.t.download} aria-label={state === "done" ? app.t.downloaded : app.t.download} onClick={click}>
      {state === "idle" && <Ic d={ICONS.downloadCircle} size={s} />}
      {state === "loading" && (
        <svg width={s} height={s} viewBox="0 0 24 24" style={{ display: "block" }}>
          <circle cx="12" cy="12" r={R} fill="none" stroke="var(--bg3)" strokeWidth="1.8"></circle>
          <circle cx="12" cy="12" r={R} fill="none" stroke="var(--acc)" strokeWidth="1.8" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C} transform="rotate(-90 12 12)"
            style={{ animation: `dlfill ${dur}ms linear forwards` }}></circle>
          <path d="M12 8.2v5.6 M9.8 11.6L12 13.8l2.2-2.2" stroke="var(--mut)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      )}
      {state === "done" && (
        <svg width={s} height={s} viewBox="0 0 24 24" style={{ display: "block" }}>
          <circle cx="12" cy="12" r="9.5" fill="var(--acc)"></circle>
          <path d="M8 12.5l2.8 2.8L16 9.5" stroke="var(--acc-ink)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      )}
    </button>
  );
};

// Строка трека. plId — контекст плейлиста (для «убрать из плейлиста» в меню),
// qIndex — позиция в очереди (для «убрать из очереди»). noCover — внутри страницы релиза.
const TrackRow = ({ trackId, num, showAlbum = true, showPlays = false, plId, qIndex, noCover = false }) => {
  const app = useApp();
  const tr = DB.trackIndex[trackId];
  const al = DB.albums[tr.album];
  const ar = DB.artists[tr.artist];
  const playing = app.player.trackId === trackId;
  const payload = { kind: "track", id: trackId, plId, qIndex };
  const lp = useLongPress((x, y) => app.openCtxPoint(x, y, payload));
  return (
    <div className={"trow" + (playing ? " playing" : "") + (noCover ? " nocover" : "")} onDoubleClick={() => app.playTrack(trackId)}
      {...lp} onContextMenu={(e) => isTouchUI() ? e.preventDefault() : app.openCtx(e, payload)}>
      <span className="num">{playing
        ? <span className="hot-dot" style={{ width: 7, height: 7, marginLeft: app.theme === "dot" ? 2 : "auto", display: "block" }} title={app.t.nowPlaying}></span>
        : String(num).padStart(2, "0")}</span>
      {!noCover && (
        <button onClick={() => app.playTrack(trackId)} aria-label={`${app.t.play || "▶"} ${tr.t}`} style={{ display: "block", position: "relative" }}>
          <Cover art={al.id} hue={al.hue} size={40} radius={8} />
        </button>
      )}
      {/* На телефоне двойного клика нет: строка играет по тапу (кроме ссылки на артиста) */}
      <div style={{ minWidth: 0 }} onClick={app.phone ? (e) => { if (!e.target.closest(".ta")) app.playTrack(trackId); } : undefined}>
        {noCover
          ? <button className="tt" style={{ display: "block", textAlign: "left", maxWidth: "100%" }} onClick={() => app.playTrack(trackId)}>{tr.t}</button>
          : <div className="tt">{tr.t}</div>}
        {!noCover && <button className="ta" style={{ display: "block", textAlign: "left" }} onClick={() => app.go("artist", ar.id)}>{ar.name}</button>}
      </div>
      {showPlays
        ? <span className="alb" style={{ fontVariantNumeric: "tabular-nums", textAlign: noCover ? "right" : "left" }}>{tr.plays}</span>
        : <button className="alb" style={{ textAlign: "left" }} onClick={() => app.go("album", al.id)}>{al.title}</button>}
      <div className="acts">
        <LikeButton trackId={trackId} />
        <PlusButton trackId={trackId} className="no-phone" />
        <DLButton size={30} className="dlb" trackId={trackId} />
        <DonateButton target={{ kind: "track", id: trackId }} className="no-phone" />
        <button className="iconbtn only-phone" style={{ width: 36, height: 36 }} aria-label={app.t.more}
          onClick={(e) => { e.stopPropagation(); app.openCtxAt(e.currentTarget, { kind: "track", id: trackId, plId, qIndex }); }}>
          <Ic d={ICONS.more} size={18} sw={3.4} />
        </button>
      </div>
      <span className="dur">{tr.dur.padStart(5, "0")}</span>
    </div>
  );
};

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

// Тосты
const Toasts = () => {
  const app = useApp();
  return (
    <div className="toasts" role="status" aria-live="polite" style={{ position: "fixed", bottom: 116, left: "50%", transform: "translateX(-50%)", zIndex: 200, display: "flex", flexDirection: "column", gap: 8, alignItems: "center", pointerEvents: "none" }}>
      {app.toasts.map(t => (
        <div key={t.id} className="fade-up" style={{
          background: "var(--text)", color: "var(--bg0)", borderRadius: 99,
          padding: "11px 22px", fontSize: 13.5, fontWeight: 500, boxShadow: "var(--island-shadow)",
          maxWidth: "calc(100vw - 32px)", textAlign: "center",
        }}>{t.msg}</div>
      ))}
    </div>
  );
};

Object.assign(window, { buzz, isTouchUI, useLongPress, SheetGrip, Marquee, AppCtx, useApp, Ic, ICONS, Cover, coverBg, ALBUM_ART, ARTIST_ART, DotBar, DotTime, RateDots, useWidth, LikeButton, RatingPop, PlusButton, DonateButton, DLButton, TrackRow, MediaCard, Toasts, usePopClamp });

// Деньги: в русском интерфейсе — десятичная запятая ($1,90), в английском — точка
const fmtMoney = (n, lang, keepZeros) => {
  let s = Number(n).toFixed(2);
  if (!keepZeros) s = s.replace(/\.00$/, "");
  return "$" + (lang === "ru" ? s.replace(".", ",") : s);
};
// Вклад слушателя в текущем месяце для артиста (строка «в июне вы слушали…»)
const supportFor = (artistId) => DB.supportSplit.find(s => s.artist === artistId) || null;
Object.assign(window, { fmtMoney, supportFor });

// Телефонная раскладка (Android): ниже 640px — нижняя навигация и свой плеер
const PHONE_Q = "(max-width: 640px)";
const useMedia = (q) => {
  const [m, setM] = React.useState(() => window.matchMedia(q).matches);
  React.useEffect(() => {
    const mq = window.matchMedia(q);
    const h = () => setM(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", h) : mq.addListener(h);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", h) : mq.removeListener(h); };
  }, [q]);
  return m;
};
Object.assign(window, { PHONE_Q, useMedia });
