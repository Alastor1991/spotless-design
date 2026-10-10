// Spotless — плеер: островок или панель (настройка «Форма плеера»), правая колонка
// «Сейчас играет»/очередь, полный экран с текстом, мини-плеер.

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
      aria-label={app.lang === "ru" ? "Повтор" : "Repeat"} aria-pressed={app.player.repeat} onClick={app.toggleRepeat}>
      <Ic d={ICONS.repeat} size={icon} />
      {app.player.repeat && <span style={{ position: "absolute", bottom: 1, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: "var(--hot)" }}></span>}
    </button>
  );
};

// Главная кнопка: белый круг, чёрный значок
const PlayBtn = ({ size = 48 }) => {
  const app = useApp();
  return (
    <button onClick={app.togglePlay} aria-label={app.player.playing ? (app.lang === "ru" ? "Пауза" : "Pause") : (app.lang === "ru" ? "Играть" : "Play")}
      style={{
        width: size, height: size, borderRadius: "50%", background: "var(--acc)", color: "var(--acc-ink)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "transform 0.1s",
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
      <Ic d={app.player.playing ? ICONS.pauseFill : ICONS.play} size={Math.round(size * 0.38)} fill="currentColor" />
    </button>
  );
};

const PrevNext = ({ dir, size = 36, icon = 19 }) => {
  const app = useApp();
  const prev = dir === "prev";
  return (
    <button className="iconbtn" style={{ width: size, height: size, color: "var(--text)" }}
      aria-label={prev ? (app.lang === "ru" ? "Предыдущий" : "Previous") : (app.lang === "ru" ? "Следующий" : "Next")}
      onClick={prev ? app.prevTrack : app.nextTrack}>
      <Ic d={prev ? ICONS.prev : ICONS.next} size={icon} fill="currentColor" sw={0.5} />
    </button>
  );
};

// Поповер выбора устройства (монтируется только при открытии — см. 5.4)
const DevicesPop = ({ close, up = true }) => {
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
    <div ref={ref} className="pop fade-up" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}
      style={{ [up ? "bottom" : "top"]: "calc(100% + 12px)", left: `calc(50% + ${dx}px)`, marginLeft: -135, width: 270, padding: 6 }}>
      <div className="mlabel" style={{ padding: "8px 10px 8px" }}>{t.devices}</div>
      {items.map(d => {
        const on = app.device === d.id;
        return (
          <button key={d.id}
            onClick={() => { app.setDevice(d.id); if (!on) app.toast(`${t.playingOn} ${d.name}`); close(); }}
            style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", textAlign: "left", padding: "9px 10px", borderRadius: 10 }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg3)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
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
  return (
    <span className={className} style={{ position: "relative", display: "inline-flex" }}>
      <button className={"iconbtn" + (app.device !== "this" || open ? " lit" : "")} style={{ width: size, height: size }}
        title={app.t.devices} aria-label={app.t.devices} aria-expanded={open}
        onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}
        onClick={() => setOpen(!open)}>
        <Ic d={ICONS.devices} size={Math.round(size * 0.52)} />
      </button>
      {open && <DevicesPop up={up} close={() => setOpen(false)} />}
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
  const pct = useProgress();
  const tr = DB.trackIndex[app.player.trackId];
  const al = DB.albums[tr.album];
  const ar = DB.artists[tr.artist];
  const t = app.t;
  const square = app.settings.island === "square";
  return (
    <div className={"island" + (square ? " square" : "")} data-screen-label="Островок-плеер"
      onContextMenu={(e) => app.openCtx(e, { kind: "track", id: tr.id })}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <button onClick={() => app.setFull(true)} title={t.openFull} aria-label={t.openFull} style={{ flexShrink: 0 }}>
          <Cover art={al.id} hue={al.hue} size={54} radius={square ? 12 : 99} round={!square} />
        </button>
        <div className="isl-who" style={{ flex: 1 }}>
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
          <span className="isl-time mono" style={{ fontSize: 11, color: "var(--mut2)", width: 36, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{app.fmtTime(pct)}</span>
          <DotBar pct={pct} pitch={6} onSeek={app.seek} label={app.lang === "ru" ? "Перемотка" : "Seek"} />
          <span className="isl-time mono" style={{ fontSize: 11, color: "var(--mut2)", width: 36, fontVariantNumeric: "tabular-nums" }}>{tr.dur.padStart(5, "0")}</span>
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
  const pct = useProgress();
  const t = app.t;
  const tr = DB.trackIndex[app.player.trackId];
  const al = DB.albums[tr.album];
  const ar = DB.artists[tr.artist];
  const st = app.trackState(tr.id);
  return (
    <footer className="dock" data-screen-label="Плеер-панель" onContextMenu={(e) => app.openCtx(e, { kind: "track", id: tr.id })}>
      <DotBar pct={pct} pitch={8} onSeek={app.seek} label={app.lang === "ru" ? "Перемотка" : "Seek"} />
      <div className="dock-cells">
        <div className="dock-cell" style={{ paddingLeft: 24 }}>
          <span className="mlabel" style={{ fontSize: 9, display: "flex", alignItems: "center", gap: 7 }}>
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
          <span className="mlabel" style={{ fontSize: 9 }}>{t.dkRate}</span>
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
          <span className="mlabel" style={{ fontSize: 9 }}>{t.dkTime}</span>
          <span className="row" style={{ gap: 8 }}>
            <DotTime value={app.fmtTime(pct)} size={26} />
            <span className="mono" style={{ fontSize: 11, color: "var(--mut2)" }}>/ {tr.dur.padStart(5, "0")}</span>
          </span>
        </div>
        <div className="dock-cell dk-vol">
          <span className="mlabel" style={{ fontSize: 9 }}>{t.dkVol}</span>
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

// Строка «в июне вы слушали…» — главная мысль продукта, видна прямо в плеере
const YouGave = ({ artistId, short = false, style }) => {
  const app = useApp();
  const s = supportFor(artistId);
  if (!s) return null;
  const amt = fmtMoney(s.amount, app.lang, true);
  if (short) return <span className="mlabel" style={style}>{app.t.youGaveShort(s.minutes, amt)}</span>;
  return <span style={{ fontSize: 14.5, color: "var(--mut)", lineHeight: 1.5, ...style }}>{app.t.youGave(DB.artists[artistId].name, s.minutes, amt)}</span>;
};

// Правая колонка: «Сейчас играет» + очередь
const NowPanel = () => {
  const app = useApp();
  const t = app.t;
  const tr = DB.trackIndex[app.player.trackId];
  const al = DB.albums[tr.album];
  const ar = DB.artists[tr.artist];
  const [tab, setTab] = React.useState("now");
  const queue = upNext(app.queue, tr.id).slice(0, 6).map(x => x.id);
  return (
    <aside className="npanel fade-in" data-screen-label="Панель: сейчас играет">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div role="tablist" style={{ display: "flex", gap: 4 }}>
          <button role="tab" aria-selected={tab === "now"} className={"chip" + (tab === "now" ? " on" : "")} style={{ padding: "7px 14px", fontSize: 12.5, whiteSpace: "nowrap" }} onClick={() => setTab("now")}>{t.nowPlaying}</button>
          <button role="tab" aria-selected={tab === "queue"} className={"chip" + (tab === "queue" ? " on" : "")} style={{ padding: "7px 14px", fontSize: 12.5, whiteSpace: "nowrap" }} onClick={() => setTab("queue")}>{t.queue}</button>
        </div>
        <button className="iconbtn" style={{ width: 32, height: 32 }} aria-label={t.close} onClick={() => app.setPanel(false)}>
          <Ic d={ICONS.x} size={15} />
        </button>
      </div>

      {tab === "now" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <button onClick={() => app.setFull(true)} aria-label={t.openFull} style={{ display: "block" }}>
            <Cover art={al.id} hue={al.hue} size="100%" radius={22} style={{ width: "100%", height: "auto", aspectRatio: "1" }} />
          </button>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 22, fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1 }}>{tr.t}</div>
              <button style={{ fontSize: 14, color: "var(--mut)", marginTop: 4 }} onClick={() => app.go("artist", ar.id)}>{ar.name}</button>
            </div>
            <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
              <LikeButton trackId={tr.id} always={true} />
              <PlusButton trackId={tr.id} />
              <DonateButton target={{ kind: "track", id: tr.id }} />
            </div>
          </div>
          <YouGave artistId={ar.id} short={true} style={{ fontSize: 10, lineHeight: 1.6 }} />

          {queue.length > 0 && (
            <div className="widget" style={{ padding: "16px 16px 10px", borderRadius: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <span className="mlabel" style={{ fontSize: 10 }}>{t.nextUp}</span>
                <button className="mlabel" style={{ fontSize: 10, color: "var(--mut)" }} onClick={() => setTab("queue")}>{t.showAll}</button>
              </div>
              {queue.slice(0, 2).map(id => {
                const q = DB.trackIndex[id];
                return (
                  <button key={id} onClick={() => app.playTrack(id)}
                    onContextMenu={(e) => app.openCtx(e, { kind: "track", id })}
                    style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", padding: "6px 0" }}>
                    <Cover art={q.album} hue={DB.albums[q.album].hue} size={36} radius={8} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{q.t}</div>
                      <div style={{ fontSize: 12, color: "var(--mut)" }}>{DB.artists[q.artist].name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="widget" style={{ padding: 16, borderRadius: 20 }}>
            <div className="mlabel" style={{ fontSize: 10, marginBottom: 12 }}>{t.aboutArtist}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
              <Cover art={"ar:" + ar.id} hue={ar.hue} size={44} round={true} />
              <div>
                <button style={{ fontSize: 15 }} onClick={() => app.go("artist", ar.id)}>{ar.name}</button>
                <div style={{ fontSize: 12, color: "var(--mut)", marginTop: 2 }}>{ar.listeners.toLocaleString(app.lang === "ru" ? "ru" : "en")} {t.monthlyListeners}</div>
              </div>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--mut)", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{ar.about}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
              <button className="btn outline" style={{ padding: "7px 16px", fontSize: 12.5, minHeight: 36 }} onClick={() => app.toggleFollow(ar.id)}>
                {app.followed.includes(ar.id) ? t.following : t.follow}
              </button>
              <button className="btn ghost" style={{ padding: "7px 16px", fontSize: 12.5, minHeight: 36 }} onClick={() => app.openDonate({ kind: "artist", id: ar.id })}>
                <span className="mono">$</span>{t.donate}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <QueueList current={tr.id} />
      )}
    </aside>
  );
};

// Что заиграет дальше: треки после текущего, потом — с начала очереди (она крутится по кругу).
// Раньше «Далее» показывало начало очереди, хотя играло совсем другое. i — индекс в самой
// очереди: по нему удаляем и перетаскиваем. Трека нет в очереди — дальше вся очередь с начала.
const upNext = (queue, current) => {
  const all = queue.map((id, i) => ({ id, i }));
  const k = queue.indexOf(current);
  return (k < 0 ? all : [...all.slice(k + 1), ...all.slice(0, k)]).filter(x => x.id !== current);
};

// Очередь с перетаскиванием и удалением
const QueueList = ({ current }) => {
  const app = useApp();
  const t = app.t;
  const [dragI, setDragI] = React.useState(null);
  const [overI, setOverI] = React.useState(null);
  const rest = upNext(app.queue, current);
  return (
    <div>
      <div className="mlabel" style={{ margin: "4px 0 10px" }}>{t.nowPlaying}</div>
      <QueueRow id={current} active={true} />
      <div className="mlabel" style={{ margin: "18px 0 10px" }}>{t.nextUp}</div>
      {rest.map(({ id, i }) => (
        <div key={id} draggable
          onDragStart={() => setDragI(i)}
          onDragOver={(e) => { e.preventDefault(); setOverI(i); }}
          onDrop={(e) => { e.preventDefault(); app.moveInQueue(dragI, i); setDragI(null); setOverI(null); }}
          onDragEnd={() => { setDragI(null); setOverI(null); }}
          style={{
            display: "flex", alignItems: "center", gap: 2,
            borderTop: overI === i && dragI !== null && dragI !== i ? "2px solid var(--acc)" : "2px solid transparent",
            opacity: dragI === i ? 0.45 : 1, cursor: "grab",
          }}>
          <Ic d={ICONS.drag} size={15} style={{ color: "var(--mut)", flexShrink: 0, opacity: 0.65 }} />
          <div style={{ flex: 1, minWidth: 0 }}><QueueRow id={id} qIndex={i} /></div>
          <button className="iconbtn" style={{ width: 28, height: 28 }} title={t.ctxRemoveQueue} aria-label={t.ctxRemoveQueue}
            onClick={() => app.removeFromQueue(i)}>
            <Ic d={ICONS.x} size={12} />
          </button>
        </div>
      ))}
    </div>
  );
};

const QueueRow = ({ id, active, qIndex }) => {
  const app = useApp();
  const q = DB.trackIndex[id];
  return (
    <button onClick={() => app.playTrack(id)}
      onContextMenu={(e) => app.openCtx(e, { kind: "track", id, qIndex })}
      style={{
        display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
        padding: "6px 8px", borderRadius: 12,
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg2)"}
      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
      <Cover art={q.album} hue={DB.albums[q.album].hue} size={38} radius={8} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 13.5, display: "flex", alignItems: "center", gap: 7 }}>
          {active && <span className="hot-dot"></span>}
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{q.t}</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--mut)" }}>{DB.artists[q.artist].name}</div>
      </div>
      <span className="mono" style={{ fontSize: 11, color: "var(--mut2)", fontVariantNumeric: "tabular-nums" }}>{q.dur}</span>
    </button>
  );
};

// Полноэкранный режим: обложка, название, караоке-текст, точечный таймкод
const FullScreen = () => {
  const app = useApp();
  const pct = useProgress();
  const t = app.t;
  const tr = DB.trackIndex[app.player.trackId];
  const al = DB.albums[tr.album];
  const ar = DB.artists[tr.artist];
  const st = app.trackState(tr.id);
  const lines = DB.lyricsFor(tr.id);
  const showLyrics = app.fullTab === "lyrics" && lines;
  const activeIdx = lines ? lines.reduce((acc, l, i) => (pct >= l.at ? i : acc), 0) : -1;
  const lyricsRef = React.useRef(null);
  const [glyph, setGlyph] = React.useState(false);
  React.useEffect(() => {
    if (!lyricsRef.current) return;
    const el = lyricsRef.current.querySelector('[data-active="1"]');
    if (el) {
      const cont = lyricsRef.current;
      cont.scrollTo({ top: el.offsetTop - cont.clientHeight * 0.38, behavior: "smooth" });
    }
  }, [activeIdx, showLyrics]);
  React.useEffect(() => {
    const k = (e) => { if (e.key === "Escape") app.setFull(false); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  return (
    <div className="fade-in fs" data-screen-label="Полный экран плеера" role="dialog" aria-label={t.nowPlaying} style={{
      position: "fixed", inset: 0, zIndex: 90,
      background: "radial-gradient(circle, var(--bg2) 0 1.2px, transparent 1.6px) 0 0 / 18px 18px, var(--bg0)",
      display: "flex", flexDirection: "column", padding: "26px 44px 30px", gap: 18,
    }}>
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
          <Ic d={ICONS.more} size={20} sw={3.4} />
        </button>
      </div>

      <div className={"fs-grid" + (showLyrics ? " with-lyrics" : "")}>
        <div className="fs-side" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, justifySelf: showLyrics ? "stretch" : "center" }}>
          <Cover art={al.id} hue={al.hue} glyph={glyph} radius={28}
            size={showLyrics ? "min(100%, calc(100dvh - 380px))" : "min(52vw, calc(100dvh - 400px))"}
            style={{ maxWidth: 520, maxHeight: 520, aspectRatio: "1", "--gp": "10px", "--gr": "3.4px" }} />
          <div role="radiogroup" aria-label={app.lang === "ru" ? "Вид обложки" : "Cover style"} style={{ display: "flex", gap: 2, padding: 3, borderRadius: 99, boxShadow: "inset 0 0 0 1px var(--bg3)", background: "var(--bg0)" }}>
            <button role="radio" aria-checked={!glyph} className="mono" onClick={() => setGlyph(false)} style={{ height: 30, padding: "0 14px", borderRadius: 15, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", background: !glyph ? "var(--acc)" : "transparent", color: !glyph ? "var(--acc-ink)" : "var(--mut)" }}>{t.viewCover}</button>
            <button role="radio" aria-checked={glyph} className="mono" onClick={() => setGlyph(true)} style={{ height: 30, padding: "0 14px", borderRadius: 15, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", background: glyph ? "var(--acc)" : "transparent", color: glyph ? "var(--acc-ink)" : "var(--mut)" }}>{t.viewGlyph}</button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0, maxHeight: "100%" }}>
          <h1 style={{ fontSize: "clamp(38px, 5.6vw, 80px)", lineHeight: 0.95, marginBottom: 12 }}>{tr.t}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
            <button style={{ fontSize: 19, color: "var(--text)", opacity: 0.86 }} onClick={() => { app.setFull(false); app.go("artist", ar.id); }}>{ar.name}</button>
            <button className="mono" onClick={() => app.toggleFollow(ar.id)} style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", padding: "6px 10px", borderRadius: 99, boxShadow: "inset 0 0 0 1px var(--bg3)", color: "var(--mut)" }}>
              {app.followed.includes(ar.id) ? t.following : t.follow}
            </button>
          </div>
          {showLyrics && (
            <div ref={lyricsRef} style={{ position: "relative", flex: 1, minHeight: 0, overflowY: "auto", margin: "18px 0 0", paddingRight: 12, maskImage: "linear-gradient(180deg, transparent, black 10%, black 86%, transparent)", WebkitMaskImage: "linear-gradient(180deg, transparent, black 10%, black 86%, transparent)" }}>
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
              <div className="mono" style={{ fontSize: 11, color: "var(--mut2)", padding: "16px 0 40%" }}>© {app.lang === "ru" ? "текст" : "lyrics"}: {ar.name}</div>
            </div>
          )}
          <div style={{ marginTop: showLyrics ? 14 : 26 }}><YouGave artistId={ar.id} /></div>
        </div>
      </div>

      <div className="fs-time" style={{ display: "flex", alignItems: "center", gap: 28, padding: "0 4px" }}>
        <DotTime value={app.fmtTime(pct)} size={68} />
        <DotBar pct={pct} pitch={12} r={3} onSeek={app.seek} label={app.lang === "ru" ? "Перемотка" : "Seek"} />
        <DotTime value={tr.dur} size={68} color="var(--dot-off)" />
      </div>

      <div className="fs-ctrl" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span className="like-pill" style={{ display: "inline-flex", alignItems: "center", gap: 10, height: 48, padding: "0 16px 0 6px", borderRadius: 24, boxShadow: "inset 0 0 0 1px var(--bg3)" }}>
            <LikeButton trackId={tr.id} always={true} size={38} />
            <RateScale value={st.rating} variant="inline" showValue={true} onCommit={(n) => app.setRating(tr.id, n)} />
          </span>
          <PlusButton trackId={tr.id} size={48} className="ring" />
          <DLButton trackId={tr.id} size={48} className="ring" />
          <button className="btn ghost" style={{ padding: "0 20px", minHeight: 48 }} onClick={() => app.openDonate({ kind: "track", id: tr.id })}>
            <span className="mono">$</span>{t.donate}
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <ShuffleBtn size={44} icon={21} />
          <PrevNext dir="prev" size={52} icon={25} />
          <PlayBtn size={76} />
          <PrevNext dir="next" size={52} icon={25} />
          <RepeatBtn size={44} icon={21} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
          <button className="iconbtn ring" aria-pressed={!!showLyrics} title={t.lyrics} aria-label={t.lyrics}
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
    </div>
  );
};

// Мини-плеер: компактное плавающее окно (как у Spotify). Обложка во всю ширину,
// при наведении — скрим с контролами; перетаскивается за верхнюю кромку.
const MINI_W = 248, MINI_H = 292;
const MiniPlayer = () => {
  const app = useApp();
  const pct = useProgress();
  const t = app.t;
  const tr = DB.trackIndex[app.player.trackId];
  const al = DB.albums[tr.album];
  const ar = DB.artists[tr.artist];
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
    <div className="mini fade-up" data-screen-label="Мини-плеер"
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
        <DotBar pct={pct} pitch={5} onSeek={app.seek} label={app.lang === "ru" ? "Перемотка" : "Seek"} />
      </div>
    </div>
  );
};

Object.assign(window, { PlayerIsland, PlayerDock, NowPanel, QueueRow, QueueList, upNext, FullScreen, MiniPlayer, ShuffleBtn, RepeatBtn, PlayBtn, PrevNext, DevicesPop, DevicesBtn, VolumeDots, YouGave });

// ---------- Телефон (Android) ----------
// Мини-плеер над нижней навигацией: островок-капсула или панель во всю ширину (та же настройка)
const MobilePlayer = () => {
  const app = useApp();
  const pct = useProgress();
  const tr = DB.trackIndex[app.player.trackId];
  const al = DB.albums[tr.album];
  const ar = DB.artists[tr.artist];
  const docked = app.settings.island === "panel";
  // Жесты: вбок — следующий/предыдущий трек, вверх — развернуть. Тап тоже разворачивает.
  const rowRef = React.useRef(null);
  const g = React.useRef(null);
  // Капсула сама распознаёт тап и свайпы; кнопки внутри (лайк, play) и полоса перемотки — не её зона.
  // На клик не опираемся: он всплывает от детей и может прийти не туда.
  const onDown = (e) => {
    if (e.target.closest("button, [role=slider], .dotbar.seek")) return;
    g.current = { x: e.clientX, y: e.clientY, dx: 0, dy: 0 };
  };
  const onMove = (e) => {
    const s = g.current; if (!s) return;
    s.dx = e.clientX - s.x; s.dy = e.clientY - s.y;
    const r = rowRef.current;
    if (r && Math.abs(s.dx) > Math.abs(s.dy)) {
      r.style.transition = "none";
      r.style.transform = `translateX(${s.dx * 0.45}px)`;
      r.style.opacity = String(1 - Math.min(0.6, Math.abs(s.dx) / 320));
    }
  };
  const onUp = () => {
    const s = g.current; g.current = null; if (!s) return;
    const r = rowRef.current;
    if (r) { r.style.transition = "transform .22s cubic-bezier(.2,.8,.2,1), opacity .22s"; r.style.transform = ""; r.style.opacity = ""; }
    if (Math.abs(s.dx) > 64 && Math.abs(s.dx) > Math.abs(s.dy) * 1.2) { buzz(8); s.dx < 0 ? app.nextTrack() : app.prevTrack(); }
    else if (s.dy < -36 && Math.abs(s.dy) > Math.abs(s.dx)) app.setFull(true);
    else if (Math.hypot(s.dx, s.dy) < SLOP) app.setFull(true); // тап
  };
  return (
    <div className={"mplayer" + (docked ? " docked" : app.settings.island === "square" ? " square" : "")} data-screen-label="Мини-плеер (телефон)"
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={() => { g.current = null; }}
      role="button" tabIndex={0} aria-label={app.t.openFull + ": " + tr.t}
      onKeyDown={(e) => { if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); app.setFull(true); } }}>
      {docked && <div style={{ display: "flex" }}><DotBar pct={pct} pitch={6} onSeek={app.seek} label={app.lang === "ru" ? "Перемотка" : "Seek"} /></div>}
      <div className="mp-row" ref={rowRef}>
        <span key={"c" + tr.id} className="mp-swap" style={{ display: "inline-flex", flexShrink: 0 }}><Cover art={al.id} hue={al.hue} size={42} round={true} /></span>
        <div key={"t" + tr.id} className="mp-swap" style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column", gap: docked ? 3 : 6 }}>
          <span style={{ fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tr.t}{!docked && <span style={{ color: "var(--mut2)" }}> · {ar.name}</span>}</span>
          {docked
            ? <span className="mlabel" style={{ fontSize: 10, letterSpacing: "0.08em" }}>{ar.name} · {app.fmtTime(pct).padStart(5, "0")}</span>
            : <DotBar pct={pct} pitch={5} r={1.4} label={app.lang === "ru" ? "Прогресс трека" : "Track progress"} />}
        </div>
        <LikeButton trackId={tr.id} always={true} size={44} />
        <PlayBtn size={44} />
      </div>
    </div>
  );
};

// Полный экран на телефоне: обложка (по умолчанию — точечной матрицей), точечный таймкод,
// текст и очередь открываются на месте обложки
const FullScreenPhone = () => {
  const app = useApp();
  const pct = useProgress();
  const t = app.t;
  const tr = DB.trackIndex[app.player.trackId];
  const al = DB.albums[tr.album];
  const ar = DB.artists[tr.artist];
  const st = app.trackState(tr.id);
  const [view, setView] = React.useState("cover"); // cover | lyrics | queue
  const [glyph, setGlyph] = React.useState(true);
  const lines = DB.lyricsFor(tr.id);
  const activeIdx = lines ? lines.reduce((acc, l, i) => (pct >= l.at ? i : acc), 0) : -1;
  const lyricsRef = React.useRef(null);
  React.useEffect(() => {
    if (view !== "lyrics" || !lyricsRef.current) return;
    const el = lyricsRef.current.querySelector('[data-active="1"]');
    if (el) lyricsRef.current.scrollTo({ top: el.offsetTop - lyricsRef.current.clientHeight * 0.35, behavior: "smooth" });
  }, [activeIdx, view]);
  const [m, s] = tr.dur.split(":").map(Number);
  const left = Math.max(0, Math.round((m * 60 + s) * (1 - pct)));
  const toggle = (v) => setView(view === v ? "cover" : v);

  // Жесты: тянуть вниз — экран едет за пальцем и сворачивается; вбок по обложке — соседний трек
  const rootRef = React.useRef(null);
  const coverRef = React.useRef(null);
  const g = React.useRef(null);
  const [dir, setDir] = React.useState(0);
  const onDown = (e) => {
    if (e.target.closest("button, input, .dotbar.seek, .fsp-scroll, [role=slider]")) return;
    g.current = { x: e.clientX, y: e.clientY, t: Date.now(), dx: 0, dy: 0, axis: null, onCover: !!e.target.closest(".fsp-stage") && view === "cover" };
  };
  const onMove = (e) => {
    const s = g.current; if (!s) return;
    s.dx = e.clientX - s.x; s.dy = e.clientY - s.y;
    if (!s.axis && Math.hypot(s.dx, s.dy) > 8) s.axis = Math.abs(s.dy) > Math.abs(s.dx) ? "v" : (s.onCover ? "h" : null);
    if (s.axis === "v" && rootRef.current) {
      const el = rootRef.current;
      el.style.transition = "none";
      el.style.transform = `translateY(${Math.max(0, s.dy)}px)`;
      el.style.borderRadius = s.dy > 0 ? "28px 28px 0 0" : "";
    }
    if (s.axis === "h" && coverRef.current) {
      coverRef.current.style.transition = "none";
      coverRef.current.style.transform = `translateX(${s.dx * 0.6}px) rotate(${s.dx * 0.02}deg)`;
    }
  };
  const onUp = () => {
    const s = g.current; g.current = null; if (!s) return;
    const v = s.dy / Math.max(1, Date.now() - s.t);
    if (s.axis === "v" && rootRef.current) {
      const el = rootRef.current;
      el.style.transition = "transform .24s cubic-bezier(.2,.8,.2,1), border-radius .24s";
      if (s.dy > 140 || v > 0.7) { el.style.transform = "translateY(100%)"; buzz(8); setTimeout(() => app.setFull(false), 210); }
      else { el.style.transform = ""; el.style.borderRadius = ""; }
    }
    if (s.axis === "h" && coverRef.current) {
      coverRef.current.style.transition = "transform .22s cubic-bezier(.2,.8,.2,1)";
      coverRef.current.style.transform = "";
      if (Math.abs(s.dx) > 70) { buzz(8); setDir(s.dx < 0 ? 1 : -1); s.dx < 0 ? app.nextTrack() : app.prevTrack(); }
    }
  };
  // Едва заметное свечение цветом обложки поверх точечной сетки
  const glow = `radial-gradient(120% 55% at 50% 18%, color-mix(in oklab, oklch(0.62 0.12 ${al.hue}) 16%, transparent), transparent 72%), radial-gradient(circle, var(--bg2) 0 1.1px, transparent 1.5px) 0 0 / 16px 16px, var(--bg0)`;
  return (
    <div ref={rootRef} className="fade-in fsp" role="dialog" aria-label={t.nowPlaying} data-screen-label="Полный экран (телефон)"
      style={{ background: glow }}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      <span className="fsp-handle" aria-hidden="true"></span>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <button className="iconbtn ring" style={{ width: 44, height: 44 }} aria-label={t.collapse} onClick={() => app.setFull(false)}><Ic d={ICONS.chevD} size={18} /></button>
        <button onClick={() => { app.setFull(false); app.go("album", al.id); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 0 }}>
          <span className="mlabel" style={{ fontSize: 9 }}>{t[al.type]} · {al.year}</span>
          <span style={{ fontSize: 13, fontWeight: 500, maxWidth: "52vw", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{al.title}</span>
        </button>
        <button className="iconbtn ring" style={{ width: 44, height: 44 }} aria-label={t.more} onClick={(e) => app.openCtxAt(e.currentTarget, { kind: "track", id: tr.id })}><Ic d={ICONS.more} size={18} sw={3.4} /></button>
      </div>

      {/* Сцена берёт всё свободное место; обложка считается от её размеров (container query),
          поэтому на коротком экране она уменьшается, а не наезжает на шапку и название */}
      <div className="fsp-stage">
        {view === "cover" && (
          <React.Fragment>
            <div ref={coverRef} style={{ display: "flex", justifyContent: "center" }}>
              <div key={tr.id} className={"fsp-cover" + (dir > 0 ? " from-r" : dir < 0 ? " from-l" : "")}>
                <Cover art={al.id} hue={al.hue} glyph={glyph} radius={28} size="max(120px, min(100cqw, 100cqh - 52px))" style={{ "--gp": "9px", "--gr": "3px" }} />
              </div>
            </div>
            <div role="radiogroup" aria-label={app.lang === "ru" ? "Вид обложки" : "Cover style"} style={{ display: "flex", gap: 2, padding: 3, borderRadius: 99, boxShadow: "inset 0 0 0 1px var(--bg3)" }}>
              <button role="radio" aria-checked={!glyph} className="mono" onClick={() => setGlyph(false)} style={{ height: 32, padding: "0 14px", borderRadius: 16, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", background: !glyph ? "var(--acc)" : "transparent", color: !glyph ? "var(--acc-ink)" : "var(--mut)" }}>{t.viewCover}</button>
              <button role="radio" aria-checked={glyph} className="mono" onClick={() => setGlyph(true)} style={{ height: 32, padding: "0 14px", borderRadius: 16, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", background: glyph ? "var(--acc)" : "transparent", color: glyph ? "var(--acc-ink)" : "var(--mut)" }}>{t.viewGlyph}</button>
            </div>
          </React.Fragment>
        )}
        {view === "lyrics" && lines && (
          <div ref={lyricsRef} className="fsp-scroll" style={{ position: "relative", alignSelf: "stretch", flex: 1, overflowY: "auto", maskImage: "linear-gradient(180deg, transparent, black 12%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(180deg, transparent, black 12%, black 85%, transparent)" }}>
            <div style={{ height: "30%" }}></div>
            {lines.map((l, i) => (
              <p key={i} data-active={i === activeIdx ? "1" : "0"} onClick={() => app.seekTo(l.at)} style={{ fontSize: i === activeIdx ? 26 : 22, lineHeight: 1.25, letterSpacing: "-0.02em", padding: "6px 0", color: i === activeIdx ? "var(--text)" : "var(--mut2)", opacity: i === activeIdx ? 1 : 0.7, transition: "color 0.3s" }}>{l.l}</p>
            ))}
            <div style={{ height: "40%" }}></div>
          </div>
        )}
        {view === "queue" && (
          <div className="fsp-scroll" style={{ alignSelf: "stretch", flex: 1, overflowY: "auto" }}><QueueList current={tr.id} /></div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <Marquee key={tr.id} style={{ fontSize: "clamp(22px, 7vw, 28px)", fontWeight: 300, letterSpacing: "-0.045em", lineHeight: 1.15 }}>{tr.t}</Marquee>
          <button style={{ fontSize: 15, color: "var(--mut)", marginTop: 6 }} onClick={() => { app.setFull(false); app.go("artist", ar.id); }}>{ar.name}</button>
        </div>
        <span className="fsp-like" style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 44, padding: "0 14px 0 2px", borderRadius: 22, boxShadow: "inset 0 0 0 1px var(--bg3)", flexShrink: 0 }}>
          <LikeButton trackId={tr.id} always={true} size={40} />
          <RateScale value={st.rating} variant="inline" showValue={true} onCommit={(n) => app.setRating(tr.id, n)} />
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <DotTime value={app.fmtTime(pct)} size={40} />
          <span className="mono" style={{ fontSize: 12, color: "var(--mut2)" }}>−{Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}</span>
        </div>
        <DotBar pct={pct} pitch={8} r={2.4} onSeek={app.seek} label={app.lang === "ru" ? "Перемотка" : "Seek"} />
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

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <PlusButton trackId={tr.id} size={46} className="ring" />
        <DLButton trackId={tr.id} size={46} className="ring" />
        <button className="btn ghost fsp-donate" style={{ flex: 1, minHeight: 46, padding: "0 12px" }} aria-label={t.donate} onClick={() => app.openDonate({ kind: "track", id: tr.id })}><span className="mono">$</span><span className="fsp-donate-l">{t.donate}</span></button>
        <button className="iconbtn ring" aria-pressed={view === "lyrics"} aria-label={t.lyrics} onClick={() => toggle("lyrics")}
          style={{ width: 46, height: 46, background: view === "lyrics" ? "var(--acc)" : "transparent", color: view === "lyrics" ? "var(--acc-ink)" : "var(--text)" }}><Ic d={ICONS.mic} size={18} /></button>
        <button className="iconbtn ring" aria-pressed={view === "queue"} aria-label={t.queue} onClick={() => toggle("queue")}
          style={{ width: 46, height: 46, background: view === "queue" ? "var(--acc)" : "transparent", color: view === "queue" ? "var(--acc-ink)" : "var(--text)" }}><Ic d={ICONS.queue} size={18} /></button>
      </div>
      <div className="fsp-gave" style={{ textAlign: "center" }}><YouGave artistId={ar.id} short={true} style={{ fontSize: 10 }} /></div>
    </div>
  );
};

Object.assign(window, { MobilePlayer, FullScreenPhone });
