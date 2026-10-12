// Spotless — правая панель «Сейчас играет» и очередь.

// «Далее в очереди»: ближайшие треки и переход ко всей очереди
const NextUpCard = ({ ids, onAll }) => {
  const app = useApp();
  const t = app.t;
  return (
    <div className="widget" style={{ padding: "16px 16px 10px", borderRadius: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span className="mlabel" style={{ fontSize: 10 }}>{t.nextUp}</span>
        <button className="mlabel" style={{ fontSize: 10, color: "var(--mut)" }} onClick={onAll}>{t.showAll}</button>
      </div>
      {ids.map(id => {
        const { tr, al, ar } = trackInfo(id);
        return (
          <button key={id} onClick={() => app.playTrack(id)}
            onContextMenu={(e) => app.openCtx(e, { kind: "track", id })}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", padding: "6px 0" }}>
            <Cover art={al.id} hue={al.hue} size={36} radius={8} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tr.t}</div>
              <div style={{ fontSize: 12, color: "var(--mut)" }}>{ar.name}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

// «Об артисте»: слушатели, пара строк о нём, подписка и донат
const AboutArtistCard = ({ ar }) => {
  const app = useApp();
  const t = app.t;
  const small = { padding: "7px 16px", fontSize: 12.5, minHeight: 36 };
  return (
    <div className="widget" style={{ padding: 16, borderRadius: 20 }}>
      <div className="mlabel" style={{ fontSize: 10, marginBottom: 12 }}>{t.aboutArtist}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
        <Cover art={"ar:" + ar.id} hue={ar.hue} size={44} round={true} />
        <div>
          <button style={{ fontSize: 15 }} onClick={() => app.go("artist", ar.id)}>{ar.name}</button>
          <div style={{ fontSize: 12, color: "var(--mut)", marginTop: 2 }}>{listenersLine(app, ar)}</div>
        </div>
      </div>
      <p style={{ fontSize: 12.5, color: "var(--mut)", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{ar.about}</p>
      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        <button className="btn outline" style={small} onClick={() => app.toggleFollow(ar.id)}>
          {app.followed.includes(ar.id) ? t.following : t.follow}
        </button>
        <button className="btn ghost" style={small} onClick={() => app.openDonate({ kind: "artist", id: ar.id })}>
          <span className="mono">$</span>{t.donate}
        </button>
      </div>
    </div>
  );
};

// Правая колонка: «Сейчас играет» + очередь
const NowPanel = () => {
  const app = useApp();
  const t = app.t;
  const { tr, al, ar } = trackInfo(app.player.trackId);
  const [tab, setTab] = React.useState("now");
  const next = upNext(app.queue, tr.id).slice(0, 2).map(x => x.id);
  const tabBtn = (k, label) => (
    <button role="tab" aria-selected={tab === k} className={"chip" + (tab === k ? " on" : "")} style={{ padding: "7px 14px", fontSize: 12.5, whiteSpace: "nowrap" }} onClick={() => setTab(k)}>{label}</button>
  );
  return (
    <aside className="npanel fade-in" data-screen-label="Панель: сейчас играет">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div role="tablist" style={{ display: "flex", gap: 4 }}>
          {tabBtn("now", t.nowPlaying)}
          {tabBtn("queue", t.queue)}
        </div>
        <button className="iconbtn" style={{ width: 32, height: 32 }} aria-label={t.close} onClick={() => app.setPanel(false)}>
          <Ic d={ICONS.x} size={15} />
        </button>
      </div>

      {tab === "now" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <button key={tr.id} className="fade-in" onClick={() => app.setFull(true)} aria-label={t.openFull} style={{ display: "block" }}>
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
          {next.length > 0 && <NextUpCard ids={next} onAll={() => setTab("queue")} />}
          <AboutArtistCard ar={ar} />
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

// Соседи трека — те, на которые переключат «Предыдущий» и «Следующий» (usePlayer): очередь по кругу;
// трека нет в очереди — следующий её начало, а предыдущего нет (кнопка начнёт трек заново).
// Тот же трек (он в очереди один) — не сосед. По соседям листает лента треков (stripDrag в core.jsx)
const nearTracks = (queue, current) => {
  const i = queue.indexOf(current), n = queue.length;
  const next = n ? queue[(i + 1) % n] : null;
  const prev = i < 0 ? null : queue[(i - 1 + n) % n];
  return { prev: prev === current ? null : prev, next: next === current ? null : next };
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
    <button className="qrow" onClick={() => app.playTrack(id)}
      onContextMenu={(e) => app.openCtx(e, { kind: "track", id, qIndex })}
      style={{
        display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
        padding: "6px 8px", borderRadius: 12,
      }}>
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

Object.assign(window, { NowPanel, NextUpCard, AboutArtistCard, upNext, nearTracks, QueueList, QueueRow });
