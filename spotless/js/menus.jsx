// Spotless — глобальные меню и модалки: контекстное меню (ПКМ и «⋯»),
// уведомления (колокольчик), создание плейлиста.
// Поповер устройств живёт в player.jsx рядом с островком.

const MenuRow = ({ icon, label, danger, chev, check, onClick }) => (
  <button onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: 11, width: "100%", textAlign: "left",
      padding: "8px 11px", borderRadius: 7, fontSize: 13.5,
      color: danger ? "var(--bad)" : "var(--text)",
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg3)"}
    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
    {icon && <Ic d={ICONS[icon]} size={16} style={{ color: danger ? "var(--bad)" : "var(--mut)", flexShrink: 0 }} />}
    <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
    {chev && <Ic d={ICONS.chevR} size={14} style={{ color: "var(--mut)" }} />}
    {check && <Ic d={ICONS.check} size={14} sw={2.2} style={{ color: "var(--acc)" }} />}
  </button>
);

const MenuDivider = () => <div className="divider" style={{ margin: "5px 4px" }}></div>;

// Глобальное контекстное меню. Открывается ПКМ (строки, карточки) и кнопками «⋯».
const ContextMenu = () => {
  const app = useApp();
  const t = app.t;
  const c = app.ctx;
  const [sub, setSub] = React.useState(null);
  const [pos, setPos] = React.useState(null);
  const ref = React.useRef(null);

  React.useEffect(() => { setSub(null); }, [c]);
  React.useLayoutEffect(() => {
    if (!c || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    let x = c.x, y = c.y;
    if (x + r.width > window.innerWidth - 8) x = window.innerWidth - 8 - r.width;
    if (y + r.height > window.innerHeight - 8) y = Math.max(8, c.y - r.height);
    setPos({ x, y });
  }, [c, sub]);
  React.useEffect(() => {
    if (!c) return;
    const close = () => app.closeCtx();
    const key = (e) => { if (e.key === "Escape") app.closeCtx(); };
    window.addEventListener("mousedown", close);
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("mousedown", close); window.removeEventListener("keydown", key); };
  }, [c]);

  if (!c) return null;
  const X = () => app.closeCtx();

  let content = null;

  if (c.kind === "track" && sub === "pl") {
    const inPls = app.trackPlaylists(c.id);
    content = (
      <React.Fragment>
        <MenuRow icon="back" label={t.addToPlaylist} onClick={() => setSub(null)} />
        <MenuDivider />
        <div style={{ maxHeight: 230, overflowY: "auto" }}>
          {app.allPlaylists.filter(p => p.byMe).map(pl => (
            <MenuRow key={pl.id} label={app.lang === "ru" ? pl.name : pl.nameEn}
              check={inPls.includes(pl.id)} onClick={() => app.togglePlaylist(c.id, pl.id)} />
          ))}
        </div>
        <MenuDivider />
        <MenuRow icon="plus" label={t.newPlaylist} onClick={() => { app.openCreatePl({ thenAdd: c.id }); X(); }} />
      </React.Fragment>
    );
  } else if (c.kind === "track") {
    const tr = DB.trackIndex[c.id];
    const st = app.trackState(c.id);
    const dl = app.downloads[c.id] === "done";
    const plMeta = c.plId ? app.findPl(c.plId) : null;
    content = (
      <React.Fragment>
        <MenuRow icon="play" label={t.play} onClick={() => { app.playTrack(c.id); X(); }} />
        <MenuRow icon="queue" label={t.addToQueue} onClick={() => { app.addToQueue(c.id); X(); }} />
        <MenuRow icon="plus" label={t.addToPlaylist} chev={true} onClick={() => setSub("pl")} />
        <MenuDivider />
        <MenuRow icon={st.liked ? "heartOff" : "heart"} label={st.liked ? t.unlike : t.like} onClick={() => { app.toggleLike(c.id); X(); }} />
        <MenuRow icon="downloadCircle" label={dl ? t.dlRemove : t.download} onClick={() => { app.toggleDl(c.id); X(); }} />
        <MenuRow icon="dollar" label={t.donate} onClick={() => { app.openDonate({ kind: "track", id: c.id }); X(); }} />
        <MenuDivider />
        <MenuRow icon="user" label={t.goToArtist} onClick={() => { app.go("artist", tr.artist); X(); }} />
        <MenuRow icon="note" label={t.goToAlbum} onClick={() => { app.go("album", tr.album); X(); }} />
        <MenuRow icon="shareIc" label={t.share} onClick={() => { app.toast(t.copied); X(); }} />
        {(plMeta && plMeta.byMe) && (
          <React.Fragment>
            <MenuDivider />
            <MenuRow icon="x" label={t.removeFromPl} onClick={() => { app.removeFromPlaylist(c.id, c.plId); X(); }} />
          </React.Fragment>
        )}
        {c.qIndex != null && (
          <React.Fragment>
            <MenuDivider />
            <MenuRow icon="x" label={t.ctxRemoveQueue} onClick={() => { app.removeFromQueue(c.qIndex); X(); }} />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  } else if (c.kind === "album") {
    const al = DB.albums[c.id];
    const ids = al.tracks.map(tr => tr.id);
    const allDl = ids.every(id => app.downloads[id] === "done");
    content = (
      <React.Fragment>
        <MenuRow icon="play" label={t.play} onClick={() => { app.playContext(ids); X(); }} />
        <MenuRow icon="queue" label={t.addToQueue} onClick={() => { app.addToQueue(ids); X(); }} />
        <MenuRow icon="downloadCircle" label={allDl ? t.dlRemove : t.download} onClick={() => { app.toggleDlAlbum(c.id); X(); }} />
        <MenuRow icon="dollar" label={t.supportRelease} onClick={() => { app.openDonate({ kind: "album", id: c.id }); X(); }} />
        <MenuDivider />
        <MenuRow icon="user" label={t.goToArtist} onClick={() => { app.go("artist", al.artist); X(); }} />
        <MenuRow icon="shareIc" label={t.share} onClick={() => { app.toast(t.copied); X(); }} />
      </React.Fragment>
    );
  } else if (c.kind === "artist") {
    const top = Object.values(DB.trackIndex).filter(tr => tr.artist === c.id)
      .sort((a, b) => parseInt(b.plays.replace(/\D/g, "")) - parseInt(a.plays.replace(/\D/g, "")));
    const following = app.followed.includes(c.id);
    content = (
      <React.Fragment>
        <MenuRow icon="play" label={t.play} onClick={() => { app.playContext(top.slice(0, 5).map(tr => tr.id)); X(); }} />
        <MenuRow icon="check" label={following ? t.following : t.follow} check={following} onClick={() => { app.toggleFollow(c.id); X(); }} />
        <MenuRow icon="dollar" label={t.supportArtist} onClick={() => { app.openDonate({ kind: "artist", id: c.id }); X(); }} />
        <MenuDivider />
        <MenuRow icon="shareIc" label={t.share} onClick={() => { app.toast(t.copied); X(); }} />
      </React.Fragment>
    );
  } else if (c.kind === "playlist") {
    const meta = app.findPl(c.id);
    if (!meta) return null;
    const ids = app.playlistTracks(c.id);
    content = (
      <React.Fragment>
        <MenuRow icon="play" label={t.play} onClick={() => { app.playContext(ids); X(); }} />
        <MenuRow icon="queue" label={t.addToQueue} onClick={() => { app.addToQueue(ids); X(); }} />
        <MenuRow icon="shareIc" label={t.share} onClick={() => { app.toast(t.copied); X(); }} />
        {meta.user && (
          <React.Fragment>
            <MenuDivider />
            <MenuRow icon="trash" danger={true} label={t.deletePl} onClick={() => { app.deletePlaylist(c.id); X(); }} />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  return (
    <div ref={ref} className="pop fade-in"
      onMouseDown={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        position: "fixed", left: pos ? pos.x : c.x, top: pos ? pos.y : c.y,
        width: 236, padding: 6, zIndex: 130, visibility: pos ? "visible" : "hidden",
      }}>
      {content}
    </div>
  );
};

// Поповер уведомлений (живёт под колокольчиком в топбаре)
const BellPop = ({ close }) => {
  const app = useApp();
  const t = app.t;
  const ru = app.lang === "ru";
  React.useEffect(() => {
    const h = () => close();
    window.addEventListener("mousedown", h);
    return () => window.removeEventListener("mousedown", h);
  }, []);
  const items = [
    { hue: 15, icon: "note", title: ru ? "Новый сингл «Кассета 04»" : "New single “Кассета 04”", sub: ru ? "Танец Бруно · вчера" : "Танец Бруно · yesterday", go: () => app.go("album", "cassette") },
    { hue: 35, icon: "users", title: ru ? "Аня К. добавила 2 трека" : "Anya K. added 2 tracks", sub: ru ? "в «Кухня по выходным»" : "to “Weekend Kitchen”", go: () => app.go("playlist", "kitchen") },
    { hue: 95, icon: "wallet", title: ru ? "Пора пополнить счёт" : "Time to top up", sub: ru ? "баланс $3.40 — в два касания" : "balance $3.40 — two taps", go: () => app.openTopUp() },
    { hue: 145, icon: "heart", title: ru ? "«Молоко и мёд» говорят спасибо" : "Молоко и мёд says thanks", sub: ru ? "за донат $1.00" : "for your $1.00 tip", go: () => app.go("artist", "milk") },
  ];
  return (
    <div className="pop fade-up" onMouseDown={(e) => e.stopPropagation()}
      style={{ top: "calc(100% + 10px)", right: 0, left: "auto", width: 330, padding: 8, zIndex: 70 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px 9px" }}>
        <span className="sec-label">{t.notifTitle}</span>
        <button className="more" style={{ fontSize: 12 }} onClick={() => { app.setNotifRead(true); }}>{t.notifReadAll}</button>
      </div>
      {items.map((n, i) => (
        <button key={i} onClick={() => { app.setNotifRead(true); n.go(); close(); }}
          style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", padding: "9px 10px", borderRadius: 8 }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg3)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
          <span style={{
            width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
            background: `oklch(var(--cover-l1) 0.05 ${n.hue})`,
            display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)",
          }}>
            <Ic d={ICONS[n.icon]} size={17} />
          </span>
          <span style={{ minWidth: 0, flex: 1 }}>
            <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.title}</span>
            <span style={{ display: "block", fontSize: 12, color: "var(--mut)", marginTop: 2 }}>{n.sub}</span>
          </span>
          {!app.notifRead && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--acc)", flexShrink: 0 }}></span>}
        </button>
      ))}
    </div>
  );
};

// Модалка создания плейлиста (вызывается из сайдбара, медиатеки, плюсика, контекстного меню)
const CreatePlaylistModal = () => {
  const app = useApp();
  const t = app.t;
  const [name, setName] = React.useState("");
  const [hue, setHue] = React.useState(55);
  React.useEffect(() => {
    if (app.createPl) { setName(""); setHue([55, 120, 250, 300, 170, 35][Math.floor(Math.random() * 6)]); }
  }, [app.createPl]);
  if (!app.createPl) return null;
  const create = () => {
    const nm = name.trim();
    if (!nm) return;
    app.createPlaylist(nm, app.createPl.thenAdd, hue);
  };
  return (
    <div className="scrim fade-in" onClick={() => app.closeCreatePl()}>
      <div className="modal fade-up" onClick={(e) => e.stopPropagation()} style={{ width: 420 }} data-screen-label="Новый плейлист">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{t.newPlaylist}</div>
          <button className="iconbtn" onClick={() => app.closeCreatePl()}><Ic d={ICONS.x} size={16} /></button>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 18 }}>
          <Cover hue={hue} size={64} radius={10} label="" />
          <input value={name} autoFocus placeholder={t.plName}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") create(); }}
            style={{
              flex: 1, background: "var(--bg2)", border: "1px solid var(--line)", borderRadius: "var(--r-sm)",
              padding: "11px 14px", fontSize: 14.5, fontWeight: 600, color: "var(--text)", outline: "none", minWidth: 0,
            }} />
        </div>
        <div style={{ display: "flex", gap: 7, marginBottom: 22 }}>
          {[55, 120, 250, 300, 170, 35].map(h => (
            <button key={h} onClick={() => setHue(h)} style={{
              width: 30, height: 30, borderRadius: 8,
              background: `oklch(var(--cover-l1) 0.05 ${h})`,
              outline: hue === h ? "2px solid var(--acc)" : "1px solid var(--line)", outlineOffset: 1.5,
            }}></button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn ghost" style={{ padding: "10px 20px" }} onClick={() => app.closeCreatePl()}>{t.cancel}</button>
          <button className="btn" style={{ padding: "10px 24px", opacity: name.trim() ? 1 : 0.45 }} onClick={create}>{t.create}</button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ContextMenu, BellPop, CreatePlaylistModal, MenuRow, MenuDivider });
