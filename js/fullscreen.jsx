// Spotless — полный экран плеера: на компьютере и на телефоне.

// Переключатель вида обложки: картинка или точечная матрица
const CoverToggle = ({ glyph, setGlyph, h, bg }) => {
  const app = useApp();
  // «Обложка / точки» — приём «Точки»; у Material обложка всегда обычная (Cover)
  if (useStyle() === "material") return null;
  const opt = (on, label, pick) => (
    <button role="radio" aria-checked={on} className="mono" onClick={pick} style={{
      height: h, padding: "0 14px", borderRadius: h / 2, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", transition: "background var(--t-2) var(--ease), color var(--t-2) var(--ease)",
      background: on ? "var(--acc)" : "transparent", color: on ? "var(--acc-ink)" : "var(--mut)",
    }}>{label}</button>
  );
  return (
    <div role="radiogroup" aria-label={app.t.coverStyle} style={{ display: "flex", gap: 2, padding: 3, borderRadius: 99, boxShadow: "inset 0 0 0 1px var(--bg3)", background: bg }}>
      {opt(!glyph, app.t.viewCover, () => setGlyph(false))}
      {opt(glyph, app.t.viewGlyph, () => setGlyph(true))}
    </div>
  );
};

// Строка текста песни, которая звучит сейчас, и прокрутка к ней, когда строка сменилась.
// on — текст на экране; k — на какой доле высоты окна держать строку
const useLyricLine = (lines, pct, boxRef, on, k) => {
  const idx = lines ? lines.reduce((acc, l, i) => (pct >= l.at ? i : acc), 0) : -1;
  React.useEffect(() => {
    const box = boxRef.current;
    if (!on || !box) return;
    const el = box.querySelector('[data-active="1"]');
    if (el) box.scrollTo({ top: el.offsetTop - box.clientHeight * k, behavior: "smooth" });
  }, [idx, on]);
  return idx;
};

// Верх полного экрана: «Свернуть», релиз (ссылкой), «Ещё»
const FsHeader = ({ tr, al }) => {
  const app = useApp();
  const t = app.t;
  return (
    <div className="fs-top" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <button className="btn ghost" style={{ padding: "0 18px 0 12px", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", background: "var(--bg0)" }}
        onClick={() => app.setFull(false)}>
        <Ic d={ICONS.chevD} size={17} />{t.collapse}
      </button>
      <button onClick={() => { app.setFull(false); app.go("album", al.id); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, minWidth: 0 }}>
        <span className="mlabel">{t[al.type]} · {al.year}</span>
        <span style={{ fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "50vw" }}>{al.title}</span>
      </button>
      <button className="iconbtn ring" style={{ width: 44, height: 44, background: "var(--bg0)" }} aria-label={t.more}
        onClick={(e) => app.openCtxAt(e.currentTarget, { kind: "track", id: tr.id })}>
        <Ic d={ICONS.more} size={20} fill="currentColor" />
      </button>
    </div>
  );
};

// Караоке-текст: звучащая строка крупнее и с точкой, по тапу — перемотка к ней
const FsLyrics = ({ lines, activeIdx, boxRef, ar }) => {
  const app = useApp();
  return (
    <div ref={boxRef} style={{ position: "relative", flex: 1, minHeight: 0, overflowY: "auto", margin: "18px 0 0", paddingRight: 12, maskImage: "linear-gradient(180deg, transparent, black 10%, black 86%, transparent)", WebkitMaskImage: "linear-gradient(180deg, transparent, black 10%, black 86%, transparent)" }}>
      <div style={{ height: "18%" }}></div>
      {lines.map((l, i) => (
        <p key={i} data-active={i === activeIdx ? "1" : "0"} style={{
          fontSize: i === activeIdx ? "clamp(26px, 2.8vw, 40px)" : "clamp(22px, 2.2vw, 30px)",
          fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.2,
          padding: "7px 0", cursor: "pointer", transition: "color 0.3s, font-size 0.3s",
          color: i === activeIdx ? "var(--text)" : "var(--mut2)", opacity: i === activeIdx ? 1 : 0.7,
          display: "flex", alignItems: "center", gap: 14,
        }} onClick={() => app.seekTo(l.at)}>
          {i === activeIdx && <span className="hot-dot" style={{ width: 9, height: 9 }}></span>}{l.l}
        </p>
      ))}
      <div className="mono" style={{ fontSize: 11, color: "var(--mut2)", padding: "16px 0 40%" }}>© {app.t.lyricsBy}: {ar.name}</div>
    </div>
  );
};

// Низ полного экрана: оценка, плюсик, загрузка, донат | плеер | текст, очередь, устройства, мини-плеер
const FsControls = ({ tr, showLyrics }) => {
  const app = useApp();
  const t = app.t;
  const st = app.trackState(tr.id);
  return (
    <div className="fs-ctrl">
      <div className="fs-ctrl-l">
        <span className="like-pill" style={{ display: "inline-flex", alignItems: "center", gap: 10, height: 48, padding: "0 16px 0 6px", borderRadius: 24, boxShadow: "inset 0 0 0 1px var(--bg3)" }}>
          <LikeButton trackId={tr.id} always={true} size={38} />
          <RateScale value={st.rating} variant="inline" showValue={true} onCommit={(n) => app.setRating(tr.id, n)} />
        </span>
        <PlusButton trackId={tr.id} size={48} className="ring" />
        <DLButton trackId={tr.id} size={48} className="ring fs-dl" />
        <button className="btn ghost fs-donate" title={t.donate} aria-label={t.donate} onClick={() => app.openDonate({ kind: "track", id: tr.id })}>
          <span className="mono">$</span><span className="fs-donate-l">{t.donate}</span>
        </button>
      </div>
      <div className="fs-ctrl-c">
        <ShuffleBtn size={44} icon={21} />
        <PrevNext dir="prev" size={52} icon={25} />
        <PlayBtn size={76} />
        <PrevNext dir="next" size={52} icon={25} />
        <RepeatBtn size={44} icon={21} />
      </div>
      <div className="fs-ctrl-r">
        <button className="iconbtn ring" aria-pressed={showLyrics} title={t.lyrics} aria-label={t.lyrics}
          style={{ width: 48, height: 48, background: showLyrics ? "var(--acc)" : "transparent", color: showLyrics ? "var(--acc-ink)" : "var(--text)" }}
          onClick={() => app.setFullTab(app.fullTab === "lyrics" ? "cover" : "lyrics")}>
          <Ic d={ICONS.mic} size={19} />
        </button>
        <button className="iconbtn ring" style={{ width: 48, height: 48 }} title={t.queue} aria-label={t.queue}
          onClick={() => { app.setFull(false); app.setPanel(true); }}>
          <Ic d={ICONS.queue} size={19} />
        </button>
        <span className="iconbtn ring" style={{ width: 48, height: 48, padding: 0 }}><DevicesBtn size={48} /></span>
        <button className="iconbtn ring" style={{ width: 48, height: 48 }} title={t.miniPlayer} aria-label={t.miniPlayer}
          onClick={() => { app.setMini(true); app.setFull(false); }}>
          <Ic d={ICONS.miniplayer} size={18} />
        </button>
      </div>
    </div>
  );
};

// Полноэкранный режим: обложка, название, караоке-текст, точечный таймкод
const FullScreen = ({ out }) => {
  const app = useApp();
  const pct = useProgress();
  const t = app.t;
  const { tr, al, ar } = trackInfo(app.player.trackId);
  const lines = DB.lyricsFor(tr.id);
  const showLyrics = app.fullTab === "lyrics" && !!lines;
  const lyricsRef = React.useRef(null);
  const activeIdx = useLyricLine(lines, pct, lyricsRef, showLyrics, 0.38);
  const [glyph, setGlyph] = React.useState(false);
  React.useEffect(() => {
    const k = (e) => { if (e.key === "Escape") app.setFull(false); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  return (
    <div className={"fs" + (out ? " is-out" : "")} data-screen-label="Полный экран плеера" role="dialog" aria-label={t.nowPlaying} style={{
      position: "fixed", inset: 0, zIndex: 90,
      background: "radial-gradient(circle, var(--bg2) 0 1.2px, transparent 1.6px) 0 0 / 18px 18px, var(--bg0)",
      display: "flex", flexDirection: "column", padding: "26px 44px 30px", gap: 18,
    }}>
      <FsHeader tr={tr} al={al} />

      {/* Раскладка сцены и размер обложки (--fs-cover) — в app.css: inline-стиль перебил бы
          медиа-правила, и на узком окне обложка не пряталась */}
      <div className={"fs-grid" + (showLyrics ? " with-lyrics" : "")}>
        <div className="fs-side">
          <div key={tr.id} className="fade-in"><Cover art={al.id} hue={al.hue} glyph={glyph} radius={28} size="var(--fs-cover)" style={{ "--gp": "10px", "--gr": "3.4px" }} /></div>
          <CoverToggle glyph={glyph} setGlyph={setGlyph} h={30} bg="var(--bg0)" />
        </div>

        <div className="fs-info">
          <h1 key={tr.id} className="fade-in" style={{ fontSize: "clamp(38px, 5.6vw, 80px)", lineHeight: 0.95, marginBottom: 12 }}>{tr.t}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
            <button style={{ fontSize: 19, color: "var(--text)", opacity: 0.86 }} onClick={() => { app.setFull(false); app.go("artist", ar.id); }}>{ar.name}</button>
            <button className="mono" onClick={() => app.toggleFollow(ar.id)} style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", padding: "6px 10px", borderRadius: 99, boxShadow: "inset 0 0 0 1px var(--bg3)", color: "var(--mut)" }}>
              {app.followed.includes(ar.id) ? t.following : t.follow}
            </button>
          </div>
          {showLyrics && <FsLyrics lines={lines} activeIdx={activeIdx} boxRef={lyricsRef} ar={ar} />}
          <div style={{ marginTop: showLyrics ? 14 : 26 }}><YouGave artistId={ar.id} /></div>
        </div>
      </div>

      <div className="fs-time" style={{ display: "flex", alignItems: "center", gap: 28, padding: "0 4px" }}>
        <DotTime value={app.fmtTime(pct)} size={68} />
        <DotBar track pct={pct} pitch={12} r={3} onSeek={app.seek} label={t.seek} />
        <DotTime value={tr.dur} size={68} color="var(--dot-off)" />
      </div>

      <FsControls tr={tr} showLyrics={showLyrics} />
    </div>
  );
};

// Жесты полного экрана на телефоне: тянуть вниз — экран едет за пальцем и сворачивается;
// вбок по обложке — лента обложек (stripDrag, core.jsx). Кнопки, полосы и прокручиваемые списки — не наша зона.
const useFullScreenGestures = ({ rootRef, stripRef, near, step, coverShown, onClose, onStep }) => {
  const g = React.useRef(null);
  const onDown = (e) => {
    if (e.target.closest("button, input, .dotbar.seek, .fsp-scroll, [role=slider]")) return;
    const strip = coverShown ? stripRef.current : null;
    if (strip && strip.dataset.swiped) return;
    g.current = { x: e.clientX, y: e.clientY, t: e.timeStamp, dx: 0, dy: 0, v: 0, axis: null,
      onCover: !!strip && !!e.target.closest(".fsp-stage"), base: strip ? shiftX(strip) : 0 };
  };
  const onMove = (e) => {
    const s = g.current; if (!s) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (!s.axis && Math.hypot(dx, dy) > SLOP) {
      s.axis = Math.abs(dy) > Math.abs(dx) ? "v" : (s.onCover ? "h" : null);
      if (s.axis === "v") finishAnims(rootRef.current); // экран мог ещё выезжать
    }
    // Скорость — по последним движениям: важно, с какой скоростью палец отпустил, а не средняя
    s.v = 0.8 * ((s.axis === "h" ? dx - s.dx : dy - s.dy) / Math.max(1, e.timeStamp - s.t)) + 0.2 * s.v;
    if (s.axis === "v") {
      const el = rootRef.current;
      el.style.transition = "none";
      el.style.transform = `translateY(${Math.max(0, dy)}px)`;
      el.style.borderRadius = dy > 0 ? "28px 28px 0 0" : "";
    }
    if (s.axis === "h") stripDrag(stripRef.current, s.base + dx, near);
    s.dx = dx; s.dy = dy; s.t = e.timeStamp;
  };
  const onUp = () => {
    const s = g.current; g.current = null; if (!s) return;
    if (s.axis === "v") {
      const el = rootRef.current;
      if (s.dy > 140 || s.v > 0.6) {
        const [ms, tr] = fling(el.offsetHeight - s.dy, s.v);
        el.style.transition = tr;
        el.style.transform = "translateY(100%)";
        buzz(8); setTimeout(onClose, ms);
      } else {
        el.style.transition = "transform var(--t-settle) var(--ease-settle), border-radius var(--t-settle) var(--ease)";
        el.style.transform = ""; el.style.borderRadius = "";
      }
    }
    if (s.axis === "h") stripRelease(stripRef.current, s.base + s.dx, s.v, step(), near, onStep);
  };
  // Жест отняла система — экран и лента возвращаются на место
  const onCancel = () => {
    const s = g.current; g.current = null; if (!s) return;
    if (s.axis === "v") { const el = rootRef.current; el.style.transition = "transform var(--t-settle) var(--ease-settle)"; el.style.transform = ""; el.style.borderRadius = ""; }
    if (s.axis === "h") stripBack(stripRef.current);
  };
  return { onPointerDown: onDown, onPointerMove: onMove, onPointerUp: onUp, onPointerCancel: onCancel };
};

// Верх полного экрана на телефоне: «Свернуть», релиз (ссылкой), «Ещё»
const FspHeader = ({ tr, al }) => {
  const app = useApp();
  const t = app.t;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
      <button className="iconbtn ring" style={{ width: 44, height: 44 }} aria-label={t.collapse} onClick={() => app.setFull(false)}><Ic d={ICONS.chevD} size={18} /></button>
      <button onClick={() => { app.setFull(false); app.go("album", al.id); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 0 }}>
        <span className="mlabel" style={{ fontSize: 9 }}>{t[al.type]} · {al.year}</span>
        <span style={{ fontSize: 13, fontWeight: 500, maxWidth: "52vw", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{al.title}</span>
      </button>
      <button className="iconbtn ring" style={{ width: 44, height: 44 }} aria-label={t.more} onClick={(e) => app.openCtxAt(e.currentTarget, { kind: "track", id: tr.id })}><Ic d={ICONS.more} size={18} fill="currentColor" /></button>
    </div>
  );
};

// Текст песни на месте обложки; по тапу на строку — перемотка к ней
const FspLyrics = ({ lines, activeIdx, boxRef }) => {
  const app = useApp();
  return (
    <div ref={boxRef} className="fsp-scroll" style={{ position: "relative", alignSelf: "stretch", flex: 1, overflowY: "auto", maskImage: "linear-gradient(180deg, transparent, black 12%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(180deg, transparent, black 12%, black 85%, transparent)" }}>
      <div style={{ height: "30%" }}></div>
      {lines.map((l, i) => (
        <p key={i} data-active={i === activeIdx ? "1" : "0"} onClick={() => app.seekTo(l.at)} style={{ fontSize: i === activeIdx ? 26 : 22, lineHeight: 1.25, letterSpacing: "-0.02em", padding: "6px 0", color: i === activeIdx ? "var(--text)" : "var(--mut2)", opacity: i === activeIdx ? 1 : 0.7, transition: "color 0.3s" }}>{l.l}</p>
      ))}
      <div style={{ height: "40%" }}></div>
    </div>
  );
};

// Нижний ряд: плюсик, загрузка, донат и переключатели «текст» / «очередь» на месте обложки
const FspActions = ({ tr, view, toggle }) => {
  const app = useApp();
  const t = app.t;
  const roundBtn = (on) => ({ width: 46, height: 46, background: on ? "var(--acc)" : "transparent", color: on ? "var(--acc-ink)" : "var(--text)" });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <PlusButton trackId={tr.id} size={46} className="ring" />
      <DLButton trackId={tr.id} size={46} className="ring" />
      <button className="btn ghost fsp-donate" style={{ flex: 1, minHeight: 46, padding: "0 12px" }} aria-label={t.donate} onClick={() => app.openDonate({ kind: "track", id: tr.id })}><span className="mono">$</span><span className="fsp-donate-l">{t.donate}</span></button>
      <button className="iconbtn ring" aria-pressed={view === "lyrics"} aria-label={t.lyrics} onClick={() => toggle("lyrics")}
        style={roundBtn(view === "lyrics")}><Ic d={ICONS.mic} size={18} /></button>
      <button className="iconbtn ring" aria-pressed={view === "queue"} aria-label={t.queue} onClick={() => toggle("queue")}
        style={roundBtn(view === "queue")}><Ic d={ICONS.queue} size={18} /></button>
    </div>
  );
};

// Полный экран на телефоне: обложка (по умолчанию — точечной матрицей), точечный таймкод,
// текст и очередь открываются на месте обложки
const FullScreenPhone = ({ out }) => {
  const app = useApp();
  const pct = useProgress();
  const t = app.t;
  const { tr, al, ar } = trackInfo(app.player.trackId);
  const st = app.trackState(tr.id);
  const [view, setView] = React.useState("cover"); // cover | lyrics | queue
  const [glyph, setGlyph] = React.useState(true);
  const lines = DB.lyricsFor(tr.id);
  const lyricsRef = React.useRef(null);
  const activeIdx = useLyricLine(lines, pct, lyricsRef, view === "lyrics", 0.35);
  const left = Math.max(0, Math.round(trackSec(tr.id) * (1 - pct)));
  const toggle = (v) => setView(view === v ? "cover" : v);

  const rootRef = React.useRef(null);
  // Лента обложек: соседние треки по бокам, листается пальцем и кнопками (useStripSync)
  const stripRef = React.useRef(null);
  const near = nearTracks(app.queue, tr.id);
  const step = () => stripRef.current.closest(".fsp-stage").clientWidth + 24; // шаг — сцена и зазор, как в app.css (.fsp-slot)
  useStripSync(stripRef, tr.id, near, step);
  const gestures = useFullScreenGestures({
    rootRef, stripRef, near, step, coverShown: view === "cover",
    onClose: () => app.setFull(false),
    onStep: (d) => (d > 0 ? app.nextTrack() : app.prevTrack()),
  });
  const cover = (key, id, i) => id && (
    <div key={key} className={"fsp-slot" + (i ? " is-side" : "")} style={i ? { "--i": i } : undefined}>
      <Cover art={DB.trackIndex[id].album} hue={DB.albums[DB.trackIndex[id].album].hue} glyph={glyph} radius={28}
        size="max(120px, min(100cqw, 100cqh - 52px))" style={{ "--gp": "9px", "--gr": "3px" }} />
    </div>
  );
  // Едва заметное свечение цветом обложки поверх точечной сетки
  const glow = `radial-gradient(120% 55% at 50% 18%, color-mix(in oklab, oklch(0.62 0.12 ${al.hue}) 16%, transparent), transparent 72%), radial-gradient(circle, var(--bg2) 0 1.1px, transparent 1.5px) 0 0 / 16px 16px, var(--bg0)`;
  return (
    <div ref={rootRef} className={"fsp" + (out ? " is-out" : "")} role="dialog" aria-label={t.nowPlaying} data-screen-label="Полный экран (телефон)"
      style={{ background: glow }} {...gestures}>
      <span className="fsp-handle" aria-hidden="true"></span>
      <FspHeader tr={tr} al={al} />

      {/* Сцена берёт всё свободное место; обложка считается от её размеров (container query),
          поэтому на коротком экране она уменьшается, а не наезжает на шапку и название */}
      <div className="fsp-stage">
        {view === "cover" && (
          <React.Fragment>
            <div ref={stripRef} className="fsp-strip">{cover("prev", near.prev, -1)}{cover("cur", tr.id, 0)}{cover("next", near.next, 1)}</div>
            <CoverToggle glyph={glyph} setGlyph={setGlyph} h={32} />
          </React.Fragment>
        )}
        {view === "lyrics" && lines && <FspLyrics lines={lines} activeIdx={activeIdx} boxRef={lyricsRef} />}
        {view === "queue" && (
          <div className="fsp-scroll" style={{ alignSelf: "stretch", flex: 1, overflowY: "auto" }}><QueueList current={tr.id} /></div>
        )}
      </div>

      {/* Название — во всю ширину: рядом с оценкой от него оставалась половина («Стеклянная в…») */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div key={tr.id} className="fade-in" style={{ minWidth: 0 }}>
          <Marquee className="ty-light" style={{ fontSize: "clamp(22px, 7vw, 28px)", "--ty-ls": "-0.045em", lineHeight: 1.15 }}>{tr.t}</Marquee>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <button key={ar.id} className="fade-in" style={{ fontSize: 15, color: "var(--mut)", minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
            onClick={() => { app.setFull(false); app.go("artist", ar.id); }}>{ar.name}</button>
          <span className="fsp-like" style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 44, padding: "0 14px 0 2px", borderRadius: 22, boxShadow: "inset 0 0 0 1px var(--bg3)", flexShrink: 0 }}>
            <LikeButton trackId={tr.id} always={true} size={40} />
            <RateScale value={st.rating} variant="inline" showValue={true} onCommit={(n) => app.setRating(tr.id, n)} />
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <DotTime value={app.fmtTime(pct)} size={40} />
          <span className="mono" style={{ fontSize: 12, color: "var(--mut2)" }}>−{Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}</span>
        </div>
        <DotBar track pct={pct} pitch={8} r={2.4} onSeek={app.seek} label={t.seek} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <ShuffleBtn size={44} icon={21} />
        <PrevNext dir="prev" size={52} icon={26} />
        <PlayBtn size={78} />
        <PrevNext dir="next" size={52} icon={26} />
        <RepeatBtn size={44} icon={21} />
      </div>

      {view === "cover" && lines && (
        <button className="fsp-peek" onClick={() => setView("lyrics")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, textAlign: "center" }}>
          <span style={{ fontSize: 16 }}>{lines[activeIdx] ? lines[activeIdx].l : ""}</span>
          <span style={{ fontSize: 14, color: "var(--mut2)" }}>{lines[activeIdx + 1] ? lines[activeIdx + 1].l : ""}</span>
        </button>
      )}

      <FspActions tr={tr} view={view} toggle={toggle} />
      <div className="fsp-gave" style={{ textAlign: "center" }}><YouGave artistId={ar.id} short={true} style={{ fontSize: 10 }} /></div>
    </div>
  );
};

Object.assign(window, { CoverToggle, useLyricLine, FullScreen, FullScreenPhone });
