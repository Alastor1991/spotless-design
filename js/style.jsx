// Spotless — архитектуры стиля. Человек выбирает не палитру, а дизайн целиком:
//   «Точка» (dot) — в духе Nothing OS, основа прототипа; Material (material) — Material 3
//   «здорового человека». Liquid Glass — позже.
// Общее у всех стилей — раскладка, жесты и поведение (app.css и компоненты). Своё у каждого — токены
// и оформление (у Material — css/style-material.css, действует при data-style="material") и
// несколько компонентов, у которых другая разметка: значки, полоса прогресса, цифры. Компоненты
// не спрашивают «какой стиль?» сами — они берут его из StyleCtx через useStyle().

const STYLE_LIST = [
  { id: "dot", ru: "Точка", en: "Dot" },
  { id: "material", ru: "Material", en: "Material" },
];
// Образцы стилей в настройках и онбординге (StyleSwatch): свои цвета у каждого — образец показывает
// стиль таким, какой он есть, а не в цветах того, что выбран сейчас
const STYLE_PREVIEW = {
  dot: { bg: "#000000", fg: "#F2F2F2", mut: "#8A8A8A", line: "#262626", hot: "#D71921" },
  material: { bg: "#121212", card: "#1B1B1B", bar: "#262626", ind: "#363636", mut: "#5C5C5C", acc: "#F0B54A" },
};
const STYLE_WAVE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M0 4q3-3.5 6 0t6 0' fill='none' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E\") 0 50% / 12px 8px repeat-x";
const StyleCtx = React.createContext("dot");
const useStyle = () => React.useContext(StyleCtx);

// ---------- Material: значки ----------
// Material Symbols Rounded. Имя символа — по ключу ICONS: Ic узнаёт значок по его контуру (тот же
// объект из ICONS), поэтому вызовы <Ic d={ICONS.heart} /> менять не нужно
const MS_NAMES = {
  home: "home", search: "search", library: "library_music", wallet: "account_balance_wallet", card: "credit_card",
  heart: "favorite", heartOff: "heart_broken", downloadCircle: "download_for_offline", panel: "dock_to_right",
  dollar: "paid", play: "play_arrow", pause: "pause", pauseFill: "pause", prev: "skip_previous", next: "skip_next",
  shuffle: "shuffle", repeat: "repeat", queue: "queue_music", volume: "volume_up", gear: "settings", plus: "add",
  check: "check", x: "close", back: "arrow_back", fwd: "arrow_forward", chevR: "chevron_right", chevD: "expand_more",
  bell: "notifications", mic: "lyrics", miniplayer: "picture_in_picture_alt", more: "more_horiz",
  expand: "open_in_full", collapse: "close_fullscreen", devices: "devices", shareIc: "share", user: "person",
  users: "group", key: "key", lock: "lock", eye: "visibility", copy: "content_copy", globe: "language",
  sparkle: "auto_awesome", pin: "push_pin", clock: "schedule", download: "download", refresh: "refresh",
  jam: "groups", note: "music_note", trash: "delete", drag: "drag_indicator", link: "link", image: "image",
  phone: "smartphone", speaker: "speaker",
};
// Значок по контуру: ICONS[k] → k
const ICON_KEY = new Map();
const iconKey = (d) => {
  if (!ICON_KEY.size) Object.keys(ICONS).forEach(k => ICON_KEY.set(ICONS[k], k));
  return ICON_KEY.get(d);
};
// Размеры значков Material — только из ряда; оптический размер — по размеру (класс i*, style-material.css)
const MS_SIZES = [14, 16, 18, 20, 24, 32, 40];
const msSize = (px) => MS_SIZES.reduce((a, b) => (Math.abs(b - px) < Math.abs(a - px) ? b : a));

// Значок Material вместо SVG. filled — залитый (активное состояние)
const MsIcon = ({ name, size = 20, filled, style, className }) => (
  <span aria-hidden="true" className={"ms i" + msSize(size) + (filled ? " f" : "") + (className ? " " + className : "")} style={style}>{name}</span>
);

// ---------- Логотип ----------
// «Точка» — капсом точечным шрифтом и красная точка; Material — слово обычным шрифтом
const Logo = ({ size = 24 }) => (useStyle() === "material"
  ? <span className="logo-word m-logo" style={{ fontSize: size - 4 }}>Spotless</span>
  : <React.Fragment>
      <span className="dots logo-word" style={{ fontSize: size, letterSpacing: "0.02em" }}>SPOTLESS</span>
      <span className="hot-dot" style={size >= 30 ? { width: 9, height: 9 } : size >= 24 ? { width: 7, height: 7 } : undefined}></span>
    </React.Fragment>);

// ---------- Material: полоса ----------
// Вместо точек «Точки». Прогресс играющего трека (track) — волна, пока играет; на паузе выпрямляется.
// Полоса, которую можно двигать (onSeek), — с ручкой-чертой (Expressive slider); доли и индикаторы — линия.
// on — цвет заполнения (по умолчанию акцент), pitch ≤ 5 — тонкий индикатор (мини-плеер)
const MBar = ({ pct = 0, pitch, onSeek, on, width, label, track, style = {} }) => {
  const app = React.useContext(AppCtx);
  const p = Math.max(0, Math.min(1, pct));
  const playing = !!(track && app && app.player.playing);
  const cls = "mbar" + (pitch != null && pitch <= 5 ? " is-thin" : "") + (onSeek ? " is-slider" : "") + (track ? " is-track" : "") + (playing ? " is-playing" : "");
  return (
    <div className={cls} onClick={onSeek}
      role={onSeek ? "slider" : undefined} aria-label={label}
      aria-valuemin={onSeek ? 0 : undefined} aria-valuemax={onSeek ? 100 : undefined} aria-valuenow={onSeek ? Math.round(p * 100) : undefined}
      style={{ flex: width ? "none" : 1, width, "--p": p, ...(on ? { "--mbar-on": on } : {}), ...style }}>
      <span className="mbar-fill">{track && <span className="mbar-wave"></span>}</span>
      {onSeek && <span className="mbar-thumb"></span>}
      <span className="mbar-rest"></span>
    </div>
  );
};

// ---------- Шрифты стиля ----------
// Шрифты Material грузим, только когда стиль выбран: «Точке» они не нужны
const STYLE_FONTS = {
  material: [
    "https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap",
    // block: пока шрифт значков не пришёл, вместо значка не мелькает его имя («favorite»)
    "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block",
  ],
};
const loadStyleFonts = (style) => {
  (STYLE_FONTS[style] || []).forEach(href => {
    if (document.querySelector(`link[data-style-font="${style}"][href="${href}"]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet"; l.href = href; l.setAttribute("data-style-font", style);
    document.head.appendChild(l);
  });
};

// ---------- Material: цвет из обложки ----------
// Акцент Material — цвет обложки играющего трека (DB.albums[].acc: на тёмной теме и на светлой).
// Свой постоянный цвет — из этого же ряда. null — из обложки
const M_ACCENTS = [
  { id: "amber", ru: "Янтарный", en: "Amber", acc: ["#F0B54A", "#9A5F00"] },
  { id: "mint", ru: "Мятный", en: "Mint", acc: ["#6FE3C1", "#00785C"] },
  { id: "pink", ru: "Розовый", en: "Pink", acc: ["#FF7AB0", "#B0306A"] },
  { id: "blue", ru: "Синий", en: "Blue", acc: ["#8FA8FF", "#3B5BD9"] },
  { id: "white", ru: "Цвет текста", en: "Text color", acc: null },
];
// Пара цветов [тёмная, светлая] для текущего трека; null — цвет текста
const mAccentPair = (trackId, mAccent) => {
  if (mAccent) { const a = M_ACCENTS.find(x => x.id === mAccent); return a ? a.acc : null; }
  const tr = DB.trackIndex[trackId];
  const al = tr && DB.albums[tr.album];
  return (al && al.acc) || null;
};

// Акцент — на корень документа: CSS-переменные --m-acc-d / --m-acc-l (цвет на тёмной и светлой теме)
// и --m-ink-d (текст на цветной кнопке в тёмной теме). Нет цвета (онбординг, «цвет текста») — переменных
// нет, и style-material.css берёт цвет текста. Смена трека перетекает плавно: --m-acc зарегистрирована
// как цвет (@property) и анимируется
const useStyleAccent = (style, trackId, mAccent, active) => {
  React.useEffect(() => {
    const root = document.documentElement;
    const pair = style === "material" && active ? mAccentPair(trackId, mAccent) : null;
    const vars = { "--m-acc-d": pair && pair[0], "--m-acc-l": pair && pair[1], "--m-ink-d": pair && "#161310" };
    Object.keys(vars).forEach(k => (vars[k] ? root.style.setProperty(k, vars[k]) : root.style.removeProperty(k)));
  }, [style, trackId, mAccent, active]);
};

Object.assign(window, { STYLE_PREVIEW, STYLE_WAVE, useStyleAccent, MBar, Logo, STYLE_LIST, StyleCtx, useStyle, MS_NAMES, iconKey, msSize, MsIcon, loadStyleFonts, M_ACCENTS, mAccentPair });
