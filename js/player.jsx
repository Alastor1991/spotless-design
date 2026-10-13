// Spotless — плеер внизу окна: островок или панель (настройка «Форма плеера») и их кнопки.
// Правая панель и очередь — queue.jsx, полный экран — fullscreen.jsx, мини-плееры — miniplayer.jsx.

// Перемешивание: выкл → обычное → умное (со звёздочкой)
const ShuffleBtn = ({ size = 30, icon = 16 }) => {
  const app = useApp();
  const m = app.player.shuffle | 0;
  return (
    <button className={"iconbtn" + (m ? " lit" : "")} style={{ width: size, height: size, position: "relative" }}
      title={m === 2 ? app.t.smartShuffle : app.t.shuffle} aria-label={m === 2 ? app.t.smartShuffle : app.t.shuffle} aria-pressed={m > 0}
      onClick={app.toggleShuffle}>
      <Ic d={ICONS.shuffle} size={icon} />
      {m === 2 && <Ic d={ICONS.sparkle} size={Math.round(icon * 0.62)} fill="currentColor"
        style={{ position: "absolute", top: 1, right: 0 }} />}
      {m > 0 && <span style={{
        position: "absolute", bottom: 1, left: "50%", transform: "translateX(-50%)",
        width: 4, height: 4, borderRadius: "50%", background: "var(--hot)",
      }}></span>}
    </button>
  );
};

const RepeatBtn = ({ size = 30, icon = 16, className = "" }) => {
  const app = useApp();
  return (
    <button className={"iconbtn " + className + (app.player.repeat ? " lit" : "")} style={{ width: size, height: size, position: "relative" }}
      aria-label={app.t.repeat} aria-pressed={app.player.repeat} onClick={app.toggleRepeat}>
      <Ic d={ICONS.repeat} size={icon} />
      {app.player.repeat && <span style={{ position: "absolute", bottom: 1, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: "var(--hot)" }}></span>}
    </button>
  );
};

// Главная кнопка: белый круг, чёрный значок; по наведению чуть растёт (.play-circle в app.css).
// Play и пауза — в одном значке: старый уходит с поворотом, новый выходит навстречу (.pp-ic).
// У Material форма кнопки меняется вместе с состоянием: пауза — круг, играет — скруглённый квадрат
// (.play-circle.is-playing в style-material.css), значок — символ Material
const PlayBtn = ({ size = 48 }) => {
  const app = useApp();
  const material = useStyle() === "material";
  const playing = app.player.playing;
  return (
    <button className={"play-circle" + (playing ? " is-playing" : "")} onClick={app.togglePlay} aria-label={playing ? app.t.pause : app.t.playNow}
      style={{
        width: size, height: size, background: "var(--acc)", color: "var(--acc-ink)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
      {material
        ? <MsIcon name={playing ? "pause" : "play_arrow"} size={size * 0.5} filled />
        : <Ic d={[ICONS.play, ICONS.pauseFill]} size={Math.round(size * 0.38)} fill="currentColor" className={"pp-ic" + (playing ? " is-playing" : "")} />}
    </button>
  );
};

const PrevNext = ({ dir, size = 36, icon = 19 }) => {
  const app = useApp();
  const prev = dir === "prev";
  return (
    <button className="iconbtn" style={{ width: size, height: size, color: "var(--text)" }}
      aria-label={prev ? app.t.prevTrack : app.t.nextTrack}
      onClick={prev ? app.prevTrack : app.nextTrack}>
      <Ic d={prev ? ICONS.prev : ICONS.next} size={icon} fill="currentColor" />
    </button>
  );
};

// Поповер выбора устройства (монтируется только при открытии: позицию замеряет usePopClamp)
const DevicesPop = ({ close, out, up = true }) => {
  const app = useApp();
  const t = app.t;
  const [ref, dx] = usePopClamp();
  React.useEffect(() => {
    const h = () => close();
    window.addEventListener("mousedown", h);
    window.addEventListener("touchstart", h);
    return () => { window.removeEventListener("mousedown", h); window.removeEventListener("touchstart", h); };
  }, []);
  const items = [
    { id: "this", icon: "devices", name: t.devThis, sub: "spotless · desktop" },
    { id: "phone", icon: "phone", name: t.devPhone, sub: "spotless · mobile" },
    { id: "speaker", icon: "speaker", name: t.devSpeaker, sub: "AirPlay" },
  ];
  return (
    <div ref={ref} className={"pop" + (out ? " is-out" : "")} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}
      style={{ [up ? "bottom" : "top"]: "calc(100% + 12px)", left: `calc(50% + ${dx}px)`, marginLeft: -135, width: 270, padding: 6 }}>
      <div className="mlabel" style={{ padding: "8px 10px 8px" }}>{t.devices}</div>
      {items.map(d => {
        const on = app.device === d.id;
        return (
          <button key={d.id} className="pop-item"
            onClick={() => { app.setDevice(d.id); if (!on) app.toast(`${t.playingOn} ${d.name}`); close(); }}
            style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", textAlign: "left", padding: "9px 10px", borderRadius: 10 }}>
            <Ic d={ICONS[d.icon]} size={18} style={{ color: on ? "var(--text)" : "var(--mut)", flexShrink: 0 }} />
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 13.5, fontWeight: 500 }}>{d.name}</span>
              <span style={{ display: "block", fontSize: 11.5, color: "var(--mut)", marginTop: 2 }}>{on ? t.devHere : d.sub}</span>
            </span>
            {on && <span className="hot-dot"></span>}
          </button>
        );
      })}
    </div>
  );
};

const DevicesBtn = ({ size = 32, up = true, className = "" }) => {
  const app = useApp();
  const [open, setOpen] = React.useState(false);
  const [pop, popOut] = useExit(open);
  return (
    <span className={className} style={{ position: "relative", display: "inline-flex" }}>
      <button className={"iconbtn" + (app.device !== "this" || open ? " lit" : "")} style={{ width: size, height: size }}
        title={app.t.devices} aria-label={app.t.devices} aria-expanded={open}
        onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}
        onClick={() => setOpen(!open)}>
        <Ic d={ICONS.devices} size={Math.round(size * 0.52)} />
      </button>
      {pop && <DevicesPop up={up} out={popOut} close={() => setOpen(false)} />}
    </span>
  );
};

// Громкость точками: клик по полосе — уровень
const VolumeDots = ({ width = 72, pitch = 6 }) => {
  const app = useApp();
  return (
    <DotBar pct={app.volume} pitch={pitch} width={width} label={app.t.dkVol}
      onSeek={(e) => { const r = e.currentTarget.getBoundingClientRect(); app.setVolume(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))); }} />
  );
};

const PlayerIsland = () => {
  const app = useApp();
  const kind = useStyle();
  const pct = useProgress();
  const { tr, al, ar } = trackInfo(app.player.trackId);
  const t = app.t;
  const square = app.settings.island === "square";
  return (
    <div className={"island" + (square ? " square" : "")} data-screen-label="Островок-плеер"
      onContextMenu={(e) => app.openCtx(e, { kind: "track", id: tr.id })}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <button key={"c" + tr.id} className="fade-in" onClick={() => app.setFull(true)} title={t.openFull} aria-label={t.openFull} style={{ flexShrink: 0 }}>
          <Cover art={al.id} hue={al.hue} size={54} radius={square ? 12 : 99} round={!square} />
        </button>
        <div key={"t" + tr.id} className="isl-who fade-in" style={{ flex: 1 }}>
          <div style={{ fontSize: 14.5, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tr.t}</div>
          <button style={{ fontSize: 12.5, color: "var(--mut)", marginTop: 2, display: "block", maxWidth: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
            onClick={() => app.go("artist", ar.id)}>{ar.name}</button>
        </div>
        <div className="isl-extra" style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 4 }}>
          <LikeButton trackId={tr.id} always={true} size={36} />
          <PlusButton trackId={tr.id} size={36} />
          <DonateButton target={{ kind: "track", id: tr.id }} size={36} />
        </div>
      </div>

      <div className="isl-center" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div className="isl-controls">
          <span className="isl-sr" style={{ display: "inline-flex" }}><ShuffleBtn size={32} icon={16} /></span>
          <span className="isl-pn" style={{ display: "inline-flex" }}><PrevNext dir="prev" size={34} icon={18} /></span>
          <PlayBtn size={44} />
          <span className="isl-pn" style={{ display: "inline-flex" }}><PrevNext dir="next" size={34} icon={18} /></span>
          <RepeatBtn size={32} icon={16} className="isl-sr" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
          <span className="isl-time mono" style={{ fontSize: 11, color: "var(--mut2)", width: 36, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{zpad(app.fmtTime(pct), 5, kind)}</span>
          <DotBar track pct={pct} pitch={6} onSeek={app.seek} label={app.t.seek} />
          <span className="isl-time mono" style={{ fontSize: 11, color: "var(--mut2)", width: 36, fontVariantNumeric: "tabular-nums" }}>{zpad(tr.dur, 5, kind)}</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "flex-end" }}>
        <span className="mono isl-meta" style={{
          fontSize: 10, letterSpacing: "0.08em", border: "1px solid var(--bg3)", borderRadius: 6, padding: "3px 7px",
          color: "var(--mut2)", marginRight: 6, whiteSpace: "nowrap",
        }}>FLAC 24/96</span>
        <button className={"iconbtn isl-b2" + (app.full && app.fullTab === "lyrics" ? " lit" : "")} style={{ width: 34, height: 34 }} title={t.lyrics} aria-label={t.lyrics}
          onClick={() => { app.setFull(true); app.setFullTab("lyrics"); }}>
          <Ic d={ICONS.mic} size={16} />
        </button>
        <DevicesBtn size={34} className="isl-b2" />
        <button className={"iconbtn isl-q" + (app.panel ? " lit" : "")} style={{ width: 34, height: 34 }} title={t.queue} aria-label={t.queue} aria-pressed={app.panel}
          onClick={() => app.setPanel(!app.panel)}>
          <Ic d={ICONS.queue} size={17} />
        </button>
        <div className="isl-vol" style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 6px" }}>
          <Ic d={ICONS.volume} size={17} style={{ color: "var(--mut)" }} />
          <VolumeDots width={72} />
        </div>
        <button className="iconbtn isl-q" style={{ width: 34, height: 34 }} title={t.miniPlayer} aria-label={t.miniPlayer}
          onClick={() => { app.setMini(true); app.setFull(false); }}>
          <Ic d={ICONS.miniplayer} size={16} />
        </button>
        <button className="iconbtn" style={{ width: 34, height: 34 }} title={t.openFull} aria-label={t.openFull} onClick={() => app.setFull(true)}>
          <Ic d={ICONS.expand} size={15} />
        </button>
      </div>
    </div>
  );
};

// Плеер-панель: вариант без островка. Встроена в сетку окна, как приборная панель:
// отсеки с подписями, первый отсек — ровно под сайдбаром.
const PlayerDock = () => {
  const app = useApp();
  const kind = useStyle();
  const pct = useProgress();
  const t = app.t;
  const { tr, al, ar } = trackInfo(app.player.trackId);
  const st = app.trackState(tr.id);
  return (
    <footer className="dock" data-screen-label="Плеер-панель" onContextMenu={(e) => app.openCtx(e, { kind: "track", id: tr.id })}>
      <DotBar track pct={pct} pitch={8} onSeek={app.seek} label={app.t.seek} />
      <div className="dock-cells">
        <div className="dock-cell" style={{ paddingLeft: 24 }}>
          <span className="mlabel ml-xs" style={{ display: "flex", alignItems: "center", gap: 7 }}>
            {app.player.playing && <span className="hot-dot" style={{ width: 5, height: 5 }}></span>}{t.dkNow}
          </span>
          <span className="row">
            <button onClick={() => app.setFull(true)} aria-label={t.openFull} style={{ flexShrink: 0 }}>
              <Cover art={al.id} hue={al.hue} size={36} round={true} />
            </button>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tr.t}</span>
              <button onClick={() => app.go("artist", ar.id)} style={{ display: "block", fontSize: 12, color: "var(--mut)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>{ar.name}</button>
            </span>
          </span>
        </div>
        <div className="dock-cell dk-rate">
          <span className="mlabel ml-xs">{t.dkRate}</span>
          <span className="row" style={{ gap: 2 }}>
            <LikeButton trackId={tr.id} always={true} size={32} />
            <span style={{ margin: "0 4px 0 2px", display: "inline-flex" }}><RateScale value={st.rating} variant="inline" onCommit={(n) => app.setRating(tr.id, n)} /></span>
            <PlusButton trackId={tr.id} size={32} />
            <DonateButton target={{ kind: "track", id: tr.id }} size={32} />
          </span>
        </div>
        <div className="dock-cell" style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <ShuffleBtn size={38} icon={18} />
          <PrevNext dir="prev" size={40} icon={20} />
          <PlayBtn size={54} />
          <PrevNext dir="next" size={40} icon={20} />
          <RepeatBtn size={38} icon={18} />
        </div>
        <div className="dock-cell dk-time">
          <span className="mlabel ml-xs">{t.dkTime}</span>
          <span className="row" style={{ gap: 8 }}>
            <DotTime value={app.fmtTime(pct)} size={26} />
            <span className="mono" style={{ fontSize: 11, color: "var(--mut2)" }}>/ {zpad(tr.dur, 5, kind)}</span>
          </span>
        </div>
        <div className="dock-cell dk-vol">
          <span className="mlabel ml-xs">{t.dkVol}</span>
          <span className="row">
            <VolumeDots width={84} pitch={7} />
            <span className="mono" style={{ fontSize: 11, color: "var(--mut)" }}>{Math.round(app.volume * 100)}</span>
          </span>
        </div>
        <div className="dock-cell" style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 2 }}>
          <button className={"iconbtn" + (app.full && app.fullTab === "lyrics" ? " lit" : "")} style={{ width: 38, height: 38 }} title={t.lyrics} aria-label={t.lyrics}
            onClick={() => { app.setFull(true); app.setFullTab("lyrics"); }}><Ic d={ICONS.mic} size={17} /></button>
          <button className={"iconbtn" + (app.panel ? " lit" : "")} style={{ width: 38, height: 38 }} title={t.queue} aria-label={t.queue} aria-pressed={app.panel}
            onClick={() => app.setPanel(!app.panel)}><Ic d={ICONS.queue} size={17} /></button>
          <DevicesBtn size={38} />
          <button className="iconbtn" style={{ width: 38, height: 38 }} title={t.openFull} aria-label={t.openFull} onClick={() => app.setFull(true)}>
            <Ic d={ICONS.expand} size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};

// Строка «в июне вы слушали…» — главная мысль продукта, видна прямо в плеере.
// Доля — от вашей суммы в месяц (раньше здесь стояли доли от $5, какой бы ни была сумма)
const YouGave = ({ artistId, short = false, style }) => {
  const app = useApp();
  const s = shareOf(artistId, app.monthly);
  if (!s) return null;
  const amt = app.money.fmt(s.amount, true);
  if (short) return <span className="mlabel" style={style}>{app.t.youGaveShort(s.minutes, amt)}</span>;
  return <span style={{ fontSize: 14.5, color: "var(--mut)", lineHeight: 1.5, ...style }}>{app.t.youGave(DB.artists[artistId].name, s.minutes, amt)}</span>;
};

Object.assign(window, { ShuffleBtn, RepeatBtn, PlayBtn, PrevNext, DevicesPop, DevicesBtn, VolumeDots, PlayerIsland, PlayerDock, YouGave });
