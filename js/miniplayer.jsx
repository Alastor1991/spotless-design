// Spotless — мини-плееры: плавающее окно на компьютере и капсула над нижней навигацией телефона.

// Мини-плеер: компактное плавающее окно (как у Spotify). Обложка во всю ширину,
// при наведении — скрим с контролами; перетаскивается за верхнюю кромку.
const MINI_W = 248, MINI_H = 292;
const MiniPlayer = ({ out }) => {
  const app = useApp();
  const pct = useProgress();
  const t = app.t;
  const { tr, al, ar } = trackInfo(app.player.trackId);
  const [hov, setHov] = React.useState(false);
  const clamp = (v, max) => Math.max(12, Math.min(v, max - 12));
  const [pos, setPos] = React.useState(() => ({
    x: window.innerWidth - MINI_W - 28,
    y: window.innerHeight - MINI_H - 110,
  }));
  const drag = React.useRef(null);
  const onDown = (e) => {
    if (e.button !== 0) return;
    drag.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y };
    const mv = (ev) => {
      const d = drag.current; if (!d) return;
      setPos({
        x: clamp(d.ox + (ev.clientX - d.sx), window.innerWidth - MINI_W),
        y: clamp(d.oy + (ev.clientY - d.sy), window.innerHeight - MINI_H),
      });
    };
    const up = () => { drag.current = null; window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
  };
  return (
    <div className={"mini fade-up" + (out ? " is-out" : "")} data-screen-label="Мини-плеер"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onContextMenu={(e) => app.openCtx(e, { kind: "track", id: tr.id })}
      style={{
        position: "fixed", left: pos.x, top: pos.y, width: MINI_W, height: MINI_H,
        borderRadius: 20, overflow: "hidden", zIndex: 95, background: "var(--island)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.6)", border: "1px solid var(--bg3)", userSelect: "none",
      }}>
      {/* Верхняя кромка — драг + кнопки окна */}
      <div onMouseDown={onDown} style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 36, zIndex: 3, cursor: "grab",
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px",
        background: hov ? "linear-gradient(180deg, rgba(0,0,0,0.55), transparent)" : "transparent",
        transition: "background 0.18s",
      }}>
        <span className="dots" style={{ fontSize: 12, color: "#fff", opacity: hov ? 0.9 : 0, transition: "opacity 0.18s", paddingLeft: 4 }}>SPOTLESS</span>
        <span style={{ display: "flex", gap: 2, opacity: hov ? 1 : 0, transition: "opacity 0.18s" }}>
          <button title={t.openFull} aria-label={t.openFull} onMouseDown={(e) => e.stopPropagation()}
            onClick={() => { app.setMini(false); app.setFull(true); }}
            style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", background: "rgba(0,0,0,0.4)" }}>
            <Ic d={ICONS.expand} size={13} />
          </button>
          <button title={t.restorePlayer} aria-label={t.restorePlayer} onMouseDown={(e) => e.stopPropagation()}
            onClick={() => app.setMini(false)}
            style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", background: "rgba(0,0,0,0.4)" }}>
            <Ic d={ICONS.x} size={13} />
          </button>
        </span>
      </div>

      <Cover art={al.id} hue={al.hue} size={MINI_W} radius={0} style={{ width: MINI_W, height: MINI_W }} />

      {/* Скрим с контролами по наведению. Поверх затемнённой обложки кнопки всегда светлые:
          в светлых темах --text тёмный, и ⏮/⏭ на тёмном скриме было почти не видно */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: MINI_W,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
        background: "rgba(0,0,0,0.45)", opacity: hov ? 1 : 0, transition: "opacity 0.18s",
        pointerEvents: hov ? "auto" : "none", color: "#fff",
        "--text": "#fff", "--acc": "#fff", "--acc-ink": "#000",
      }}>
        <PrevNext dir="prev" size={38} icon={22} />
        <PlayBtn size={54} />
        <PrevNext dir="next" size={38} icon={22} />
      </div>

      <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, height: MINI_H - MINI_W - 8, padding: "0 10px 0 14px", display: "flex", alignItems: "center", gap: 8, background: "var(--island)" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tr.t}</div>
          <button onClick={() => { app.setMini(false); app.go("artist", ar.id); }}
            style={{ fontSize: 12, color: "var(--mut)", marginTop: 1, display: "block", maxWidth: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ar.name}</button>
        </div>
        <LikeButton trackId={tr.id} always={true} size={34} />
      </div>
      <div style={{ position: "absolute", bottom: 4, left: 12, right: 12, display: "flex" }}>
        <DotBar track pct={pct} pitch={5} onSeek={app.seek} label={app.t.seek} />
      </div>
    </div>
  );
};

// ---------- Телефон (Android) ----------
// Жесты капсулы: вбок — лента треков (stripDrag, core.jsx), вверх — развернуть, тап — тоже развернуть.
// Капсула сама распознаёт тап и свайпы; кнопки внутри (лайк, play) и полоса перемотки — не её зона.
// На клик не опираемся: он всплывает от детей и может прийти не туда.
const useCapsuleGestures = ({ stripRef, near, step, onOpen, onStep }) => {
  const g = React.useRef(null);
  const onDown = (e) => {
    const el = stripRef.current;
    if (!el || el.dataset.swiped || e.target.closest("button, [role=slider], .dotbar.seek")) return;
    g.current = { x: e.clientX, y: e.clientY, t: e.timeStamp, dx: 0, dy: 0, v: 0, axis: null, base: shiftX(el) };
  };
  const onMove = (e) => {
    const s = g.current; if (!s) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (!s.axis && Math.hypot(dx, dy) > SLOP) s.axis = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
    if (s.axis === "h") {
      s.v = 0.8 * (dx - s.dx) / Math.max(1, e.timeStamp - s.t) + 0.2 * s.v;
      stripDrag(stripRef.current, s.base + dx, near);
    }
    s.dx = dx; s.dy = dy; s.t = e.timeStamp;
  };
  const onUp = () => {
    const s = g.current; g.current = null; if (!s) return;
    if (s.axis === "h") stripRelease(stripRef.current, s.base + s.dx, s.v, step(), near, onStep);
    else if (!s.axis || s.dy < -36) onOpen(); // тап или вверх
  };
  // Жест отняла система — лента просто возвращается
  const onCancel = () => { const s = g.current; g.current = null; if (s && s.axis === "h") stripBack(stripRef.current); };
  return { onPointerDown: onDown, onPointerMove: onMove, onPointerUp: onUp, onPointerCancel: onCancel };
};

// Трек в капсуле: обложка и название. Соседи по краям ленты — такие же, с прогрессом с нуля
const MpTrack = ({ id, pct, docked }) => {
  const app = useApp();
  const kind = useStyle();
  const { tr, al, ar } = trackInfo(id);
  return (
    <React.Fragment>
      <Cover art={al.id} hue={al.hue} size={42} round={true} />
      <div style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column", gap: docked ? 3 : kind === "material" ? 0 : 1 }}>
        {kind === "material" && !docked ? (
          // Material: название и артист двумя строками, прогресс — линией по краю капсулы (MobilePlayer)
          <React.Fragment>
            <span className="mp-title">{tr.t}</span>
            <span className="mp-artist">{ar.name}</span>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <span style={{ fontSize: 14, fontWeight: docked ? 400 : 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tr.t}</span>
            {docked
              ? <span className="mlabel ml-s">{ar.name} · {zpad(app.fmtTime(pct), 5, kind)}</span>
              : (
                // «Точка»: название и артист двумя строками, под ними — прогресс точками
                <React.Fragment>
                  <span className="mlabel" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ar.name}</span>
                  <DotBar track pct={pct} pitch={5} r={1.4} label={app.t.trackProgress} style={{ marginTop: 4 }} />
                </React.Fragment>
              )}
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};

// Мини-плеер над нижней навигацией: островок-капсула или панель во всю ширину (та же настройка).
// Листается только лента с обложкой и названием, кнопки стоят на месте
const MobilePlayer = () => {
  const app = useApp();
  const kind = useStyle();
  const pct = useProgress();
  const id = app.player.trackId;
  const docked = app.settings.island === "panel";
  const near = nearTracks(app.queue, id);
  const stripRef = React.useRef(null);
  const step = () => stripRef.current.offsetWidth;
  useStripSync(stripRef, id, near, step);
  const gestures = useCapsuleGestures({ stripRef, near, step, onOpen: () => app.setFull(true), onStep: (d) => (d > 0 ? app.nextTrack() : app.prevTrack()) });
  const slot = (key, tid, i) => tid && (
    <div key={key} className={"mp-slot" + (i ? " is-side" : "")} style={i ? { "--i": i } : undefined}>
      <MpTrack id={tid} pct={i ? 0 : pct} docked={docked} />
    </div>
  );
  return (
    <div className={"mplayer" + (docked ? " docked" : app.settings.island === "square" ? " square" : "")} data-screen-label="Мини-плеер (телефон)" {...gestures}
      role="button" tabIndex={0} aria-label={app.t.openFull + ": " + DB.trackIndex[id].t}
      onKeyDown={(e) => { if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); app.setFull(true); } }}>
      {docked && <div style={{ display: "flex" }}><DotBar track pct={pct} pitch={6} onSeek={app.seek} label={app.t.seek} /></div>}
      <div className="mp-row">
        <div className="mp-pager">
          <div className="mp-strip" ref={stripRef}>{slot("prev", near.prev, -1)}{slot("cur", id, 0)}{slot("next", near.next, 1)}</div>
        </div>
        <LikeButton trackId={id} always={true} size={44} icon={kind === "material" ? undefined : 20} />
        <PlayBtn size={44} />
      </div>
      {kind === "material" && !docked && <div className="mp-edge"><MBar pct={pct} pitch={3} label={app.t.trackProgress} /></div>}
    </div>
  );
};

Object.assign(window, { MiniPlayer, useCapsuleGestures, MobilePlayer });
