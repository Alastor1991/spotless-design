// Spotless — островок-плеер, панель «Сейчас играет»/очередь, полный экран с текстом.

// Перемешивание: выкл → обычное → умное (со звёздочкой)
const ShuffleBtn = ({ size = 30, icon = 16 }) => {
  const app = useApp();
  const m = app.player.shuffle | 0;
  return (
    <button className={"iconbtn" + (m ? " lit" : "")} style={{ width: size, height: size, position: "relative" }}
      title={m === 2 ? app.t.smartShuffle : app.t.shuffle} onClick={app.toggleShuffle}>
      <Ic d={ICONS.shuffle} size={icon} />
      {m === 2 && <Ic d={ICONS.sparkle} size={Math.round(icon * 0.62)} fill="currentColor"
        style={{ position: "absolute", top: 1, right: 0 }} />}
      {m > 0 && <span style={{
        position: "absolute", bottom: 1, left: "50%", transform: "translateX(-50%)",
        width: 4, height: 4, borderRadius: "50%", background: "var(--acc)",
      }}></span>}
    </button>
  );
};

// Поповер выбора устройства (монтируется только при открытии — см. 5.4)
const DevicesPop = ({ close }) => {
  const app = useApp();
  const t = app.t;
  const [ref, dx] = usePopClamp();
  React.useEffect(() => {
    const h = () => close();
    window.addEventListener("mousedown", h);
    return () => window.removeEventListener("mousedown", h);
  }, []);
  const items = [
    { id: "this", icon: "devices", name: t.devThis, sub: "spotless · desktop" },
    { id: "phone", icon: "phone", name: t.devPhone, sub: "spotless · mobile" },
    { id: "speaker", icon: "speaker", name: t.devSpeaker, sub: "AirPlay" },
  ];
  return (
    <div ref={ref} className="pop fade-up" onMouseDown={(e) => e.stopPropagation()}
      style={{ bottom: "calc(100% + 12px)", left: `calc(50% + ${dx}px)`, marginLeft: -130, width: 260, padding: 6 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--mut)", padding: "6px 10px 8px", letterSpacing: "0.05em", textTransform: "uppercase" }}>{t.devices}</div>
      {items.map(d => {
        const on = app.device === d.id;
        return (
          <button key={d.id}
            onClick={() => { app.setDevice(d.id); if (!on) app.toast(`${t.playingOn} ${d.name}`); close(); }}
            style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 7 }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg3)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            <Ic d={ICONS[d.icon]} size={18} style={{ color: on ? "var(--acc)" : "var(--mut)", flexShrink: 0 }} />
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: on ? "var(--acc)" : "var(--text)" }}>{d.name}</span>
              <span style={{ display: "block", fontSize: 11.5, color: "var(--mut)", marginTop: 1 }}>{on ? t.devHere : d.sub}</span>
            </span>
            {on && <Ic d={ICONS.check} size={14} sw={2.2} style={{ color: "var(--acc)" }} />}
          </button>
        );
      })}
    </div>
  );
};

const PlayerIsland = () => {
  const app = useApp();
  const tr = DB.trackIndex[app.player.trackId];
  const al = DB.albums[tr.album];
  const ar = DB.artists[tr.artist];
  const t = app.t;
  const [devOpen, setDevOpen] = React.useState(false);
  return (
    <div className={"island" + (app.settings.island === "square" ? " square" : "")} data-screen-label="Островок-плеер"
      onContextMenu={(e) => app.openCtx(e, { kind: "track", id: tr.id })}>
      <div style={{ display: "flex", alignItems: "center", gap: 13, minWidth: 0 }}>
        <button onClick={() => app.setFull(true)} title={t.openFull} style={{ flexShrink: 0 }}>
          <Cover hue={al.hue} size={56} radius={app.settings.island === "square" ? 10 : 99} round={app.settings.island !== "square"} />
        </button>
        <div className="isl-who">
          <div style={{ fontSize: 14.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tr.t}</div>
          <button style={{ fontSize: 12.5, color: "var(--mut)", marginTop: 1, display: "block", maxWidth: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
            onClick={() => app.go("artist", ar.id)}>{ar.name}</button>
        </div>
        <div className="isl-extra" style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 6 }}>
          <LikeButton trackId={tr.id} always={true} size={34} />
          <PlusButton trackId={tr.id} size={34} />
          <DonateButton target={{ kind: "track", id: tr.id }} size={34} />
        </div>
      </div>

      <div className="isl-center" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div className="isl-controls">
          <span className="isl-sr" style={{ display: "inline-flex" }}><ShuffleBtn size={30} icon={16} /></span>
          <button className="iconbtn isl-pn" style={{ width: 32, height: 32, color: "var(--text)" }} onClick={app.prevTrack}>
            <Ic d={ICONS.prev} size={19} fill="currentColor" sw={0.5} />
          </button>
          <button onClick={app.togglePlay} style={{
            width: 42, height: 42, borderRadius: "50%", background: "var(--acc)", color: "var(--acc-ink)",
            display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.1s",
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.06)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
            <Ic d={app.player.playing ? ICONS.pause : ICONS.play} size={18} sw={2.4}
              fill={app.player.playing ? "none" : "currentColor"} />
          </button>
          <button className="iconbtn isl-pn" style={{ width: 32, height: 32, color: "var(--text)" }} onClick={app.nextTrack}>
            <Ic d={ICONS.next} size={19} fill="currentColor" sw={0.5} />
          </button>
          <button className={"iconbtn isl-sr" + (app.player.repeat ? " lit" : "")} style={{ width: 30, height: 30 }} onClick={app.toggleRepeat}>
            <Ic d={ICONS.repeat} size={16} />
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
          <span className="isl-time" style={{ fontSize: 11.5, color: "var(--mut)", width: 34, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{app.fmtTime(app.player.pct)}</span>
          <div className="slider-track" style={{ flex: 1 }} onClick={app.seek}>
            <div className="slider-fill" style={{ width: `${app.player.pct * 100}%` }}></div>
          </div>
          <span className="isl-time" style={{ fontSize: 11.5, color: "var(--mut)", width: 34, fontVariantNumeric: "tabular-nums" }}>{tr.dur}</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "flex-end" }}>
        {app.theme === "dark-neutral" && <span className="mono isl-meta" style={{
          fontSize: 10.5, border: "1px solid var(--line)", borderRadius: 4, padding: "2px 6px",
          color: "var(--mut)", marginRight: 6, whiteSpace: "nowrap",
        }}>FLAC 24/96</span>}
        <button className={"iconbtn isl-b2" + (app.full && app.fullTab === "lyrics" ? " lit" : "")} style={{ width: 32, height: 32 }} title={t.lyrics}
          onClick={() => { app.setFull(true); app.setFullTab("lyrics"); }}>
          <Ic d={ICONS.mic} size={16} />
        </button>
        <span className="isl-b2" style={{ position: "relative", display: "inline-flex" }}>
          <button className={"iconbtn" + (app.device !== "this" || devOpen ? " lit" : "")} style={{ width: 32, height: 32 }} title={t.devices}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setDevOpen(!devOpen)}>
            <Ic d={ICONS.devices} size={17} />
          </button>
          {devOpen && <DevicesPop close={() => setDevOpen(false)} />}
        </span>
        <button className={"iconbtn isl-q" + (app.panel ? " lit" : "")} style={{ width: 32, height: 32 }} title={t.queue}
          onClick={() => app.setPanel(!app.panel)}>
          <Ic d={ICONS.queue} size={17} />
        </button>
        <div className="isl-vol" style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 6 }}>
          <Ic d={ICONS.volume} size={17} style={{ color: "var(--mut)" }} />
          <div className="slider-track" style={{ width: 86 }}>
            <div className="slider-fill" style={{ width: "62%", background: "var(--mut)" }}></div>
          </div>
        </div>
        <button className="iconbtn isl-q" style={{ width: 32, height: 32 }} title={t.miniPlayer}
          onClick={() => { app.setMini(true); app.setFull(false); }}>
          <Ic d={ICONS.miniplayer} size={16} />
        </button>
        <button className="iconbtn" style={{ width: 32, height: 32, marginLeft: 4 }} title={t.openFull} onClick={() => app.setFull(true)}>
          <Ic d={ICONS.expand} size={15} />
        </button>
      </div>
    </div>
  );
};

// Правая панель: «Сейчас играет» + очередь
const NowPanel = () => {
  const app = useApp();
  const t = app.t;
  const tr = DB.trackIndex[app.player.trackId];
  const al = DB.albums[tr.album];
  const ar = DB.artists[tr.artist];
  const [tab, setTab] = React.useState("now");
  const queue = app.queueIds.filter(id => id !== tr.id).slice(0, 6);
  return (
    <aside className="npanel fade-in" data-screen-label="Панель: сейчас играет">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <button className={"chip" + (tab === "now" ? " on" : "")} style={{ padding: "6px 13px", fontSize: 12.5, whiteSpace: "nowrap" }} onClick={() => setTab("now")}>{t.nowPlaying}</button>
          <button className={"chip" + (tab === "queue" ? " on" : "")} style={{ padding: "6px 13px", fontSize: 12.5, whiteSpace: "nowrap" }} onClick={() => setTab("queue")}>{t.queue}</button>
        </div>
        <button className="iconbtn" style={{ width: 30, height: 30 }} onClick={() => app.setPanel(false)}>
          <Ic d={ICONS.x} size={15} />
        </button>
      </div>

      {tab === "now" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Cover hue={al.hue} size="100%" style={{ width: "100%", height: "auto", aspectRatio: "1" }} label="album art" />
          <div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.01em" }}>{tr.t}</div>
                <button style={{ fontSize: 14, color: "var(--mut)", marginTop: 3 }} onClick={() => app.go("artist", ar.id)}>{ar.name}</button>
              </div>
              <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                <LikeButton trackId={tr.id} always={true} />
                <PlusButton trackId={tr.id} />
                <DonateButton target={{ kind: "track", id: tr.id }} />
              </div>
            </div>
          </div>

          {queue.length > 0 && (
            <div style={{ background: "var(--bg2)", borderRadius: "var(--r-sm)", padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9 }}>
                <span className="sec-label">{t.nextUp}</span>
                <button className="more" style={{ fontSize: 12 }} onClick={() => setTab("queue")}>{t.showAll}</button>
              </div>
              {queue.slice(0, 2).map(id => {
                const q = DB.trackIndex[id];
                return (
                  <button key={id} onClick={() => app.playTrack(id)}
                    onContextMenu={(e) => app.openCtx(e, { kind: "track", id })}
                    style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", padding: "5px 0" }}>
                    <Cover hue={DB.albums[q.album].hue} size={34} radius={5} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{q.t}</div>
                      <div style={{ fontSize: 11.5, color: "var(--mut)" }}>{DB.artists[q.artist].name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div style={{ background: "var(--bg2)", borderRadius: "var(--r-sm)", padding: "14px" }}>
            <div className="sec-label" style={{ marginBottom: 10 }}>{t.aboutArtist}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 10 }}>
              <Cover hue={ar.hue} size={44} round={true} label="" />
              <div>
                <button style={{ fontSize: 14.5, fontWeight: 700 }} onClick={() => app.go("artist", ar.id)}>{ar.name}</button>
                <div style={{ fontSize: 12, color: "var(--mut)", marginTop: 1 }}>{ar.listeners.toLocaleString(app.lang === "ru" ? "ru" : "en")} {t.monthlyListeners}</div>
              </div>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--mut)", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{ar.about}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="btn outline" style={{ padding: "7px 16px", fontSize: 12.5 }} onClick={() => app.toggleFollow(ar.id)}>
                {app.followed.includes(ar.id) ? t.following : t.follow}
              </button>
              <button className="btn ghost" style={{ padding: "7px 16px", fontSize: 12.5 }} onClick={() => app.openDonate({ kind: "artist", id: ar.id })}>
                <Ic d={ICONS.dollar} size={13} />{t.donate}
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

// Очередь с перетаскиванием и удалением
const QueueList = ({ current }) => {
  const app = useApp();
  const t = app.t;
  const [dragI, setDragI] = React.useState(null);
  const [overI, setOverI] = React.useState(null);
  const rest = app.queue.map((id, i) => ({ id, i })).filter(x => x.id !== current);
  return (
    <div>
      <div className="sec-label" style={{ margin: "4px 0 10px" }}>{t.nowPlaying}</div>
      <QueueRow id={current} active={true} />
      <div className="sec-label" style={{ margin: "18px 0 10px" }}>{t.nextUp}</div>
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
          <button className="iconbtn" style={{ width: 26, height: 26 }} title={t.ctxRemoveQueue}
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
      padding: "6px 8px", borderRadius: "var(--r-sm)",
    }}
      onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg2)"}
      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
      <Cover hue={DB.albums[q.album].hue} size={38} radius={6} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: active ? "var(--acc)" : "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{q.t}</div>
        <div style={{ fontSize: 12, color: "var(--mut)" }}>{DB.artists[q.artist].name}</div>
      </div>
      <span style={{ fontSize: 12, color: "var(--mut)", fontVariantNumeric: "tabular-nums" }}>{q.dur}</span>
    </button>
  );
};

// Полноэкранный режим: обложка + караоке-текст
const FullScreen = () => {
  const app = useApp();
  const t = app.t;
  const tr = DB.trackIndex[app.player.trackId];
  const al = DB.albums[tr.album];
  const ar = DB.artists[tr.artist];
  const isGlass = tr.id === "gl1";
  const lines = DB.lyricsFor(tr.id);
  const activeIdx = lines ? lines.reduce((acc, l, i) => (app.player.pct >= l.at ? i : acc), 0) : -1;
  const lyricsRef = React.useRef(null);
  React.useEffect(() => {
    if (!lyricsRef.current) return;
    const el = lyricsRef.current.querySelector('[data-active="1"]');
    if (el) {
      const cont = lyricsRef.current;
      cont.scrollTo({ top: el.offsetTop - cont.clientHeight * 0.4, behavior: "smooth" });
    }
  }, [activeIdx]);

  return (
    <div className="fade-in" data-screen-label="Полный экран плеера" style={{
      position: "fixed", inset: 0, zIndex: 90,
      background: `linear-gradient(180deg, oklch(var(--cover-l2) 0.03 ${al.hue}) 0%, var(--bg0) 78%)`,
      display: "flex", flexDirection: "column", padding: "28px 48px 24px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--mut)", fontWeight: 600, whiteSpace: "nowrap" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--acc)", display: "inline-block" }}></span>
          spotless · {t.nowPlaying}
        </div>
        <button className="iconbtn" onClick={() => app.setFull(false)}><Ic d={ICONS.collapse} size={17} /></button>
      </div>

      <div className={"fs-grid" + (app.fullTab === "lyrics" && lines ? " with-lyrics" : "")}>
        <div className="fs-side" style={{ display: "flex", flexDirection: app.fullTab === "lyrics" && lines ? "column" : "row", alignItems: "center", gap: 36, justifyContent: "center", flexWrap: "wrap" }}>
          <Cover hue={al.hue} size={app.fullTab === "lyrics" && lines ? "clamp(180px, 24vw, 300px)" : "clamp(220px, 30vw, 380px)"} label="album art" style={{ boxShadow: "var(--island-shadow)" }} />
          <div style={{ textAlign: app.fullTab === "lyrics" && lines ? "center" : "left" }}>
            <div style={{ fontSize: "clamp(26px, 3.2vw, 38px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{tr.t}</div>
            <button style={{ fontSize: 17, color: "var(--mut)", marginTop: 8 }} onClick={() => { app.setFull(false); app.go("artist", ar.id); }}>{ar.name} · {al.title} · {al.year}</button>
            <div style={{ display: "flex", gap: 4, marginTop: 16, justifyContent: app.fullTab === "lyrics" && lines ? "center" : "flex-start" }}>
              <LikeButton trackId={tr.id} always={true} size={38} />
              <PlusButton trackId={tr.id} size={38} />
              <DonateButton target={{ kind: "track", id: tr.id }} size={38} />
              <button className="iconbtn" style={{ width: 38, height: 38 }} title={t.share} onClick={() => app.toast(t.copied)}>
                <Ic d={ICONS.shareIc} size={17} />
              </button>
            </div>
          </div>
        </div>

        {app.fullTab === "lyrics" && lines && (
          <div ref={lyricsRef} style={{ maxHeight: "100%", overflowY: "auto", paddingRight: 24, maskImage: "linear-gradient(180deg, transparent, black 12%, black 88%, transparent)" }}>
            {lines.map((l, i) => (
              <p key={i} data-active={i === activeIdx ? "1" : "0"} style={{
                fontSize: 30, fontWeight: 800, letterSpacing: "-0.01em", lineHeight: 1.25,
                padding: "10px 0", cursor: "pointer", transition: "color 0.3s, opacity 0.3s",
                color: i === activeIdx ? "var(--acc)" : i < activeIdx ? "var(--text)" : "var(--mut)",
                opacity: i === activeIdx ? 1 : i < activeIdx ? 0.75 : 0.55,
              }} onClick={() => app.seekTo(l.at)}>{l.l}</p>
            ))}
            <div style={{ fontSize: 12, color: "var(--mut)", padding: "16px 0 30px" }}>© {app.lang === "ru" ? "текст" : "lyrics"}: {ar.name}</div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "var(--mut)", fontVariantNumeric: "tabular-nums" }}>{app.fmtTime(app.player.pct)}</span>
          <div className="slider-track" style={{ flex: 1 }} onClick={app.seek}>
            <div className="slider-fill" style={{ width: `${app.player.pct * 100}%` }}></div>
          </div>
          <span style={{ fontSize: 12, color: "var(--mut)", fontVariantNumeric: "tabular-nums" }}>{tr.dur}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
          <ShuffleBtn size={34} icon={18} />
          <button className="iconbtn" style={{ color: "var(--text)" }} onClick={app.prevTrack}><Ic d={ICONS.prev} size={22} fill="currentColor" sw={0.5} /></button>
          <button onClick={app.togglePlay} style={{
            width: 54, height: 54, borderRadius: "50%", background: "var(--acc)", color: "var(--acc-ink)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Ic d={app.player.playing ? ICONS.pause : ICONS.play} size={22} sw={2.6} fill={app.player.playing ? "none" : "currentColor"} />
          </button>
          <button className="iconbtn" style={{ color: "var(--text)" }} onClick={app.nextTrack}><Ic d={ICONS.next} size={22} fill="currentColor" sw={0.5} /></button>
          <button className={"iconbtn" + (app.fullTab === "lyrics" ? " lit" : "")} title={t.lyrics} onClick={() => app.setFullTab(app.fullTab === "lyrics" ? "cover" : "lyrics")}>
            <Ic d={ICONS.mic} size={18} />
          </button>
          <button className="iconbtn" title={t.miniPlayer} onClick={() => { app.setMini(true); app.setFull(false); }}>
            <Ic d={ICONS.miniplayer} size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Мини-плеер: компактное плавающее окно (как у Spotify). Обложка во всю ширину,
// при наведении — скрим с контролами; перетаскивается за верхнюю кромку.
const MINI_W = 248, MINI_H = 288;
const MiniPlayer = () => {
  const app = useApp();
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
        borderRadius: 14, overflow: "hidden", zIndex: 95, background: "var(--island)",
        boxShadow: "var(--island-shadow)", border: "1px solid var(--line)", userSelect: "none",
      }}>
      {/* Верхняя кромка — драг + кнопки окна */}
      <div onMouseDown={onDown} style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 34, zIndex: 3, cursor: "grab",
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px",
        background: hov ? "linear-gradient(180deg, oklch(0 0 0 / 0.5), transparent)" : "transparent",
        transition: "background 0.18s",
      }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase", opacity: hov ? 0.85 : 0, transition: "opacity 0.18s", paddingLeft: 4, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>spotless</span>
        <span style={{ display: "flex", gap: 2, opacity: hov ? 1 : 0, transition: "opacity 0.18s" }}>
          <button title={t.openFull} onMouseDown={(e) => e.stopPropagation()}
            onClick={() => { app.setMini(false); app.setFull(true); }}
            style={{ width: 26, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", background: "oklch(0 0 0 / 0.35)" }}>
            <Ic d={ICONS.expand} size={13} />
          </button>
          <button title={t.restorePlayer} onMouseDown={(e) => e.stopPropagation()}
            onClick={() => app.setMini(false)}
            style={{ width: 26, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", background: "oklch(0 0 0 / 0.35)" }}>
            <Ic d={ICONS.x} size={13} />
          </button>
        </span>
      </div>

      {/* Обложка */}
      <Cover hue={al.hue} size={MINI_W} label="album art"
        style={{ width: MINI_W, height: MINI_W, borderRadius: 0 }} />

      {/* Скрим с контролами по наведению */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: MINI_W,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
        background: "oklch(0 0 0 / 0.42)", opacity: hov ? 1 : 0, transition: "opacity 0.18s",
        pointerEvents: hov ? "auto" : "none",
      }}>
        <button onClick={app.prevTrack} style={{ color: "#fff", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ic d={ICONS.prev} size={22} fill="currentColor" sw={0.5} />
        </button>
        <button onClick={app.togglePlay} style={{
          width: 52, height: 52, borderRadius: "50%", background: "var(--acc)", color: "var(--acc-ink)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Ic d={app.player.playing ? ICONS.pause : ICONS.play} size={22} sw={2.6} fill={app.player.playing ? "none" : "currentColor"} />
        </button>
        <button onClick={app.nextTrack} style={{ color: "#fff", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ic d={ICONS.next} size={22} fill="currentColor" sw={0.5} />
        </button>
      </div>

      {/* Низ: название + лайк + прогресс */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: MINI_H - MINI_W, padding: "0 12px", display: "flex", alignItems: "center", gap: 8, background: "var(--island)" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tr.t}</div>
          <button onClick={() => { app.setMini(false); app.go("artist", ar.id); }}
            style={{ fontSize: 12, color: "var(--mut)", marginTop: 1, display: "block", maxWidth: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ar.name}</button>
        </div>
        <LikeButton trackId={tr.id} always={true} size={32} />
      </div>
      <div className="slider-track" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, borderRadius: 0 }} onClick={app.seek}>
        <div className="slider-fill" style={{ width: `${app.player.pct * 100}%`, borderRadius: 0 }}></div>
      </div>
    </div>
  );
};

Object.assign(window, { PlayerIsland, NowPanel, QueueRow, QueueList, FullScreen, MiniPlayer, ShuffleBtn, DevicesPop });
