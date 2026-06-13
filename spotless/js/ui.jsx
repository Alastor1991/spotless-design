// Spotless — UI-примитивы: иконки, обложки, кнопки действий, строка трека, тосты.

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

// Полосатая заглушка обложки (тон от темы)
const Cover = ({ hue = 60, size = 150, radius, round = false, label = "cover", style = {} }) => {
  const numeric = typeof size === "number";
  return (
    <div aria-hidden="true" style={{
      width: size, height: size, borderRadius: round ? "50%" : (radius != null ? radius : "calc(var(--r) - 6px)"),
      background: `repeating-linear-gradient(45deg, oklch(var(--cover-l1) 0.025 ${hue}) 0 10px, oklch(var(--cover-l2) 0.025 ${hue}) 10px 20px)`,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...style,
    }}>
      {(!numeric || size >= 40) && (
        <span style={{
          fontFamily: "var(--mono, monospace)", fontSize: numeric ? Math.max(8, size * 0.07) : 12,
          letterSpacing: "0.06em", opacity: 0.45, color: "var(--mut)",
        }}>{label}</span>
      )}
    </div>
  );
};

// Сердечко: клик = лайк, удержание 350мс = шкала 1–10
const LikeButton = ({ trackId, size = 30, always = false }) => {
  const app = useApp();
  const st = app.trackState(trackId);
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef(null);
  const longFired = React.useRef(false);

  const down = (e) => {
    e.stopPropagation();
    longFired.current = false;
    timer.current = setTimeout(() => { longFired.current = true; setOpen(true); }, 350);
  };
  const up = (e) => {
    e.stopPropagation();
    clearTimeout(timer.current);
    if (!longFired.current && !open) app.toggleLike(trackId);
  };
  const lit = st.liked || st.rating != null;
  const neg = st.rating != null && st.rating < 5;
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <button
        className={"iconbtn" + (neg ? " neg" : lit ? " lit" : "")}
        style={{ width: size, height: size, opacity: (always || lit) ? 1 : undefined }}
        title={app.t.holdHint}
        onMouseDown={down} onMouseUp={up}
        onMouseLeave={() => clearTimeout(timer.current)}
        onClick={(e) => e.stopPropagation()}
      >
        <Ic d={neg ? ICONS.heartOff : ICONS.heart} size={size * 0.56}
          fill={!neg && (st.liked || st.rating != null) ? "currentColor" : "none"} sw={1.8} />
      </button>
      {st.rating != null && (
        <span style={{
          position: "absolute", top: -3, right: -5, fontSize: 10, fontWeight: 800,
          background: neg ? "var(--bad)" : "var(--acc)", color: neg ? "oklch(0.98 0.01 25)" : "var(--acc-ink)",
          borderRadius: 99, padding: "1px 5px", pointerEvents: "none",
        }}>{st.rating}</span>
      )}
      {open && <RatingPop trackId={trackId} close={() => setOpen(false)} />}
    </span>
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

const RatingPop = ({ trackId, close }) => {
  const app = useApp();
  const st = app.trackState(trackId);
  const [hov, setHov] = React.useState(null);
  const [ref, dx] = usePopClamp();
  const shown = hov != null ? hov : st.rating;
  React.useEffect(() => {
    const h = () => close();
    window.addEventListener("mousedown", h);
    return () => window.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="pop fade-up" onMouseDown={(e) => e.stopPropagation()}
      style={{ bottom: "calc(100% + 10px)", left: `calc(50% + ${dx}px)`, marginLeft: -126, width: 252 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "2px 4px 9px" }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--mut)" }}>{app.t.yourRating}</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: "var(--acc)" }}>{shown || "—"}</span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <button key={n}
            onMouseEnter={() => setHov(n)} onMouseLeave={() => setHov(null)}
            onClick={() => { app.setRating(trackId, st.rating === n ? null : n); close(); }}
            style={{
              flex: 1, height: 24, borderRadius: 5, fontSize: 11, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: (shown && n <= shown) ? "var(--acc)" : "var(--bg1)",
              color: (shown && n <= shown) ? "var(--acc-ink)" : "var(--mut)",
              transition: "background 0.08s",
            }}>{n}</button>
        ))}
      </div>
      <div style={{ fontSize: 11.5, color: "var(--mut)", margin: "8px 4px 2px" }}>{app.t.ratingHint}</div>
    </div>
  );
};

// Плюсик: поповер со списком плейлистов.
// Сам поповер — отдельный компонент: он монтируется только при открытии,
// поэтому usePopClamp замеряет его в правильный момент (фикс обрезания у края).
const PlusPop = ({ trackId, inPls }) => {
  const app = useApp();
  const [ref, dx] = usePopClamp();
  return (
    <div ref={ref} className="pop fade-up" onMouseDown={(e) => e.stopPropagation()}
      style={{ bottom: "calc(100% + 10px)", left: `calc(50% + ${dx}px)`, marginLeft: -115, width: 230, padding: 6 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--mut)", padding: "6px 10px 8px", letterSpacing: "0.05em", textTransform: "uppercase" }}>{app.t.addToPlaylist}</div>
      <div style={{ maxHeight: 235, overflowY: "auto" }}>
        {app.allPlaylists.filter(p => p.byMe).map(pl => {
          const on = inPls.includes(pl.id);
          return (
            <button key={pl.id} onClick={() => app.togglePlaylist(trackId, pl.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
                padding: "7px 10px", borderRadius: 7, fontSize: 13.5, color: "var(--text)",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg3)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              <Cover hue={pl.hue} size={22} radius={4} />
              <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{app.lang === "ru" ? pl.name : pl.nameEn}</span>
              {on && <Ic d={ICONS.check} size={14} sw={2.2} style={{ color: "var(--acc)" }} />}
            </button>
          );
        })}
      </div>
      <div className="divider" style={{ margin: "6px 0" }}></div>
      <button onClick={() => app.openCreatePl({ thenAdd: trackId })}
        style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "7px 10px", borderRadius: 7, fontSize: 13.5, color: "var(--mut)" }}
        onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg3)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
        <Ic d={ICONS.plus} size={16} /><span>{app.t.newPlaylist}</span>
      </button>
    </div>
  );
};

const PlusButton = ({ trackId, size = 30 }) => {
  const app = useApp();
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    const h = () => setOpen(false);
    window.addEventListener("mousedown", h);
    return () => window.removeEventListener("mousedown", h);
  }, [open]);
  const inPls = app.trackPlaylists(trackId);
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <button className={"iconbtn" + (inPls.length ? " lit" : "")} style={{ width: size, height: size, opacity: inPls.length ? 1 : undefined }}
        title={app.t.addToPlaylist}
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        onMouseDown={(e) => e.stopPropagation()}>
        <Ic d={inPls.length ? ICONS.check : ICONS.plus} size={size * 0.53} sw={2} />
      </button>
      {open && <PlusPop trackId={trackId} inPls={inPls} />}
    </span>
  );
};

// Значок $ — открывает донат
const DonateButton = ({ target, size = 30 }) => {
  const app = useApp();
  return (
    <button className="iconbtn" style={{ width: size, height: size }} title={app.t.donate}
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
      title={state === "done" ? app.t.downloaded : app.t.download} onClick={click}>
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
// qIndex — позиция в очереди (для «убрать из очереди»).
const TrackRow = ({ trackId, num, showAlbum = true, showPlays = false, plId, qIndex }) => {
  const app = useApp();
  const tr = DB.trackIndex[trackId];
  const al = DB.albums[tr.album];
  const ar = DB.artists[tr.artist];
  const playing = app.player.trackId === trackId;
  return (
    <div className={"trow" + (playing ? " playing" : "")} onDoubleClick={() => app.playTrack(trackId)}
      onContextMenu={(e) => app.openCtx(e, { kind: "track", id: trackId, plId, qIndex })}>
      <span className="num">{playing ? <Ic d={ICONS.note} size={15} style={{ color: "var(--acc)", marginLeft: "auto" }} /> : num}</span>
      <button onClick={() => app.playTrack(trackId)} style={{ display: "block", position: "relative" }}>
        <Cover hue={al.hue} size={40} radius={6} />
      </button>
      <div style={{ minWidth: 0 }}>
        <div className="tt">{tr.t}</div>
        <button className="ta" style={{ display: "block", textAlign: "left" }} onClick={() => app.go("artist", ar.id)}>{ar.name}</button>
      </div>
      {showPlays
        ? <span className="alb" style={{ fontVariantNumeric: "tabular-nums" }}>{tr.plays}</span>
        : <button className="alb" style={{ textAlign: "left" }} onClick={() => app.go("album", al.id)}>{al.title}</button>}
      <div className="acts">
        <LikeButton trackId={trackId} />
        <PlusButton trackId={trackId} />
        <DLButton size={30} className="dlb" trackId={trackId} />
        <DonateButton target={{ kind: "track", id: trackId }} />
      </div>
      <span className="dur">{tr.dur}</span>
    </div>
  );
};

// Карточка (альбом/артист/плейлист). ctx — payload для контекстного меню по ПКМ.
const MediaCard = ({ title, sub, hue, round, onClick, onPlay, ctx }) => {
  const app = useApp();
  return (
    <button className="card" onClick={onClick}
      onContextMenu={ctx && app ? (e) => app.openCtx(e, ctx) : undefined}>
      <div style={{ position: "relative" }}>
        <Cover hue={hue} size="100%" round={round} style={{ aspectRatio: "1", width: "100%", height: "auto" }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="t">{title}</div>
        <div className="s">{sub}</div>
      </div>
      <span className="hoverplay" onClick={(e) => { e.stopPropagation(); onPlay && onPlay(); }}>
        <Ic d={ICONS.play} size={20} fill="currentColor" />
      </span>
    </button>
  );
};

// Тосты
const Toasts = () => {
  const app = useApp();
  return (
    <div style={{ position: "fixed", bottom: 110, left: "50%", transform: "translateX(-50%)", zIndex: 200, display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
      {app.toasts.map(t => (
        <div key={t.id} className="fade-up" style={{
          background: "var(--text)", color: "var(--bg0)", borderRadius: 99,
          padding: "10px 22px", fontSize: 13.5, fontWeight: 600, boxShadow: "var(--island-shadow)",
        }}>{t.msg}</div>
      ))}
    </div>
  );
};

Object.assign(window, { AppCtx, useApp, Ic, ICONS, Cover, LikeButton, RatingPop, PlusButton, DonateButton, DLButton, TrackRow, MediaCard, Toasts });
