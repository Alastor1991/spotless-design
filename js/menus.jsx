// Spotless — глобальные меню и окна: контекстное меню (ПКМ и «⋯»),
// уведомления (колокольчик), создание плейлиста.
// Поповер устройств живёт в player.jsx рядом с островком.

const MenuRow = ({ icon, label, danger, chev, check, onClick }) => (
  <button className="pop-item" onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: 11, width: "100%", textAlign: "left",
      padding: "8px 11px", borderRadius: 7, fontSize: 13.5,
      color: danger ? "var(--bad)" : "var(--text)",
    }}>
    {icon && <Ic d={ICONS[icon]} size={16} style={{ color: danger ? "var(--bad)" : "var(--mut)", flexShrink: 0 }} />}
    <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
    {chev && <Ic d={ICONS.chevR} size={14} style={{ color: "var(--mut)" }} />}
    {check && <Ic d={ICONS.check} size={14} sw={2.2} style={{ color: "var(--acc)" }} />}
  </button>
);

const MenuDivider = () => <div className="divider" style={{ margin: "5px 4px" }}></div>;

// Шапка меню-листа на телефоне: что именно мы сейчас настраиваем
const CtxHead = ({ c }) => {
  const app = useApp();
  const t = app.t;
  let art, hue, title, sub, round = false;
  if (c.kind === "track") {
    const { tr, al, ar } = trackInfo(c.id);
    art = al.id; hue = al.hue; title = tr.t; sub = ar.name + " · " + al.title;
  } else if (c.kind === "album") {
    const al = DB.albums[c.id];
    art = al.id; hue = al.hue; title = al.title; sub = t[al.type] + " · " + DB.artists[al.artist].name;
  } else if (c.kind === "artist") {
    const ar = DB.artists[c.id];
    art = "ar:" + ar.id; hue = ar.hue; title = ar.name; sub = t.artist; round = true;
  } else if (c.kind === "playlist") {
    const pl = app.findPl(c.id);
    if (!pl) return null;
    hue = pl.hue; title = plName(app.lang, pl); sub = `${app.playlistTracks(c.id).length} ${t.tracksN}`;
  } else return null;
  return (
    <div className="ctx-head">
      <Cover art={art} hue={hue} size={48} radius={10} round={round} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
        <div className="mlabel" style={{ marginTop: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div>
      </div>
    </div>
  );
};

// ---------- Пункты меню ----------
// c — про что меню (kind, id и где открыли: plId, qIndex); close — закрыть меню; setSub — подменю.
// Пункт с действием сначала делает дело, потом закрывает меню.

// Трек: «В плейлист» открывает подменю со списком
const TrackItems = ({ c, close, setSub }) => {
  const app = useApp();
  const t = app.t;
  const tr = DB.trackIndex[c.id];
  const st = app.trackState(c.id);
  const dl = app.downloads[c.id] === "done";
  const plMeta = c.plId ? app.findPl(c.plId) : null;
  const act = (f) => () => { f(); close(); };
  return (
    <React.Fragment>
      <MenuRow icon="play" label={t.play} onClick={act(() => app.playTrack(c.id))} />
      <MenuRow icon="queue" label={t.addToQueue} onClick={act(() => app.addToQueue(c.id))} />
      <MenuRow icon="plus" label={t.addToPlaylist} chev={true} onClick={() => setSub("pl")} />
      <MenuDivider />
      <MenuRow icon={st.rating != null ? "heartOff" : "heart"}
        label={st.rating == null ? t.like : st.rating === app.likeRating ? t.unlike : t.removeRating}
        onClick={act(() => app.toggleLike(c.id))} />
      <MenuRow icon="downloadCircle" label={dl ? t.dlRemove : t.download} onClick={act(() => app.toggleDl(c.id))} />
      <MenuRow icon="dollar" label={t.donate} onClick={act(() => app.openDonate({ kind: "track", id: c.id }))} />
      <MenuDivider />
      <MenuRow icon="user" label={t.goToArtist} onClick={act(() => app.go("artist", tr.artist))} />
      <MenuRow icon="note" label={t.goToAlbum} onClick={act(() => app.go("album", tr.album))} />
      <MenuRow icon="shareIc" label={t.share} onClick={act(() => app.toast(t.copied))} />
      {(plMeta && plMeta.byMe) && (
        <React.Fragment>
          <MenuDivider />
          <MenuRow icon="x" label={t.removeFromPl} onClick={act(() => app.removeFromPlaylist(c.id, c.plId))} />
        </React.Fragment>
      )}
      {c.qIndex != null && (
        <React.Fragment>
          <MenuDivider />
          <MenuRow icon="x" label={t.ctxRemoveQueue} onClick={act(() => app.removeFromQueue(c.qIndex))} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

// Подменю трека: свои плейлисты с галочками и «Новый плейлист»
const TrackPlaylistItems = ({ c, close, setSub }) => {
  const app = useApp();
  const t = app.t;
  const inPls = app.trackPlaylists(c.id);
  return (
    <React.Fragment>
      <MenuRow icon="back" label={t.addToPlaylist} onClick={() => setSub(null)} />
      <MenuDivider />
      <div style={{ maxHeight: 230, overflowY: "auto" }}>
        {app.allPlaylists.filter(p => p.byMe).map(pl => (
          <MenuRow key={pl.id} label={plName(app.lang, pl)}
            check={inPls.includes(pl.id)} onClick={() => app.togglePlaylist(c.id, pl.id)} />
        ))}
      </div>
      <MenuDivider />
      <MenuRow icon="plus" label={t.newPlaylist} onClick={() => { app.openCreatePl({ thenAdd: c.id }); close(); }} />
    </React.Fragment>
  );
};

const AlbumItems = ({ c, close }) => {
  const app = useApp();
  const t = app.t;
  const al = DB.albums[c.id];
  const ids = albumIds(al);
  const allDl = ids.every(id => app.downloads[id] === "done");
  const act = (f) => () => { f(); close(); };
  return (
    <React.Fragment>
      <MenuRow icon="play" label={t.play} onClick={act(() => app.playContext(ids))} />
      <MenuRow icon="queue" label={t.addToQueue} onClick={act(() => app.addToQueue(ids))} />
      <MenuRow icon="downloadCircle" label={allDl ? t.dlRemove : t.download} onClick={act(() => app.toggleDlAlbum(c.id))} />
      <MenuRow icon="dollar" label={t.supportRelease} onClick={act(() => app.openDonate({ kind: "album", id: c.id }))} />
      <MenuDivider />
      <MenuRow icon="user" label={t.goToArtist} onClick={act(() => app.go("artist", al.artist))} />
      <MenuRow icon="shareIc" label={t.share} onClick={act(() => app.toast(t.copied))} />
    </React.Fragment>
  );
};

const ArtistItems = ({ c, close }) => {
  const app = useApp();
  const t = app.t;
  const following = app.followed.includes(c.id);
  const act = (f) => () => { f(); close(); };
  return (
    <React.Fragment>
      <MenuRow icon="play" label={t.play} onClick={act(() => app.playContext(topTracks([c.id]).slice(0, 5).map(tr => tr.id)))} />
      <MenuRow icon="check" label={following ? t.following : t.follow} check={following} onClick={act(() => app.toggleFollow(c.id))} />
      <MenuRow icon="dollar" label={t.supportArtist} onClick={act(() => app.openDonate({ kind: "artist", id: c.id }))} />
      <MenuDivider />
      <MenuRow icon="shareIc" label={t.share} onClick={act(() => app.toast(t.copied))} />
    </React.Fragment>
  );
};

const PlaylistItems = ({ c, close }) => {
  const app = useApp();
  const t = app.t;
  const ids = app.playlistTracks(c.id);
  const act = (f) => () => { f(); close(); };
  return (
    <React.Fragment>
      <MenuRow icon="play" label={t.play} onClick={act(() => app.playContext(ids))} />
      <MenuRow icon="queue" label={t.addToQueue} onClick={act(() => app.addToQueue(ids))} />
      <MenuRow icon="shareIc" label={t.share} onClick={act(() => app.toast(t.copied))} />
      {app.findPl(c.id).user && (
        <React.Fragment>
          <MenuDivider />
          <MenuRow icon="trash" danger={true} label={t.deletePl} onClick={act(() => app.deletePlaylist(c.id))} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const MENU_ITEMS = { track: TrackItems, album: AlbumItems, artist: ArtistItems, playlist: PlaylistItems };

// Глобальное контекстное меню. Открывается ПКМ (строки, карточки), кнопками «⋯» и долгим нажатием.
// На компьютере — поповер у курсора, на телефоне — лист снизу.
const ContextMenu = () => {
  const app = useApp();
  const c = app.ctx;
  const [sub, setSub] = React.useState(null);
  const [pos, setPos] = React.useState(null);
  const ref = React.useRef(null);

  const openedAt = React.useRef(0);
  React.useEffect(() => { setSub(null); openedAt.current = Date.now(); }, [c]);
  // Не вылезать за край окна: сдвигаем влево или поднимаем над точкой
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
    // Меню могло открыться долгим нажатием: первые мгновения игнорируем «отпускание» пальца
    const opened = Date.now();
    const close = (e) => { if (Date.now() - opened < 400) return; if (ref.current && ref.current.contains(e.target)) return; app.closeCtx(); };
    window.addEventListener("pointerdown", close, true);
    return () => window.removeEventListener("pointerdown", close, true);
  }, [c]);
  // Esc закрывает только меню: открытое из полного экрана, оно раньше сворачивало и его
  useEscape(() => app.closeCtx(), !!c);

  if (!c) return null;
  if (c.kind === "playlist" && !app.findPl(c.id)) return null; // такого плейлиста уже нет
  const X = () => app.closeCtx();
  const Items = c.kind === "track" && sub === "pl" ? TrackPlaylistItems : MENU_ITEMS[c.kind];
  const content = Items ? <Items c={c} close={X} setSub={setSub} /> : null;

  // Телефон: то же меню, но листом снизу — с шапкой, крупными строками и смахиванием вниз
  if (app.phone) {
    return (
      <div className="scrim fade-in ctx-scrim" onClick={() => { if (Date.now() - openedAt.current > 450) X(); }}>
        <div ref={ref} className="modal ctx-sheet" role="menu" onClick={(e) => e.stopPropagation()} onContextMenu={(e) => e.preventDefault()}>
          <SheetGrip onClose={X} />
          {sub !== "pl" && <CtxHead c={c} />}
          {content}
        </div>
      </div>
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
  React.useEffect(() => {
    const h = () => close();
    window.addEventListener("mousedown", h);
    return () => window.removeEventListener("mousedown", h);
  }, []);
  const items = [
    { hue: 15, icon: "note", title: t.notifSingle, sub: t.notifSingleSub, go: () => app.go("album", "cassette") },
    { hue: 35, icon: "users", title: t.notifAdded, sub: t.notifAddedSub, go: () => app.go("playlist", "kitchen") },
    { hue: 95, icon: "wallet", title: t.notifTopUp, sub: t.notifTopUpSub(app.money.fmt(app.balance)), go: () => app.openTopUp() },
    { hue: 145, icon: "heart", title: t.notifThanks, sub: t.notifThanksSub(app.money), go: () => app.go("artist", "milk") },
  ];
  return (
    <div className="pop fade-up bellpop" onMouseDown={(e) => e.stopPropagation()}
      style={{ top: "calc(100% + 10px)", right: 0, left: "auto", width: 330, padding: 8, zIndex: 70 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px 9px" }}>
        <span className="sec-label">{t.notifTitle}</span>
        <button className="more" style={{ fontSize: 12 }} onClick={() => { app.setNotifRead(true); }}>{t.notifReadAll}</button>
      </div>
      {items.map((n, i) => (
        <button key={i} className="pop-item" onClick={() => { app.setNotifRead(true); n.go(); close(); }}
          style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", padding: "9px 10px", borderRadius: 8 }}>
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
          {!app.notifRead && <span className="hot-dot"></span>}
        </button>
      ))}
    </div>
  );
};

// Окно создания плейлиста (из сайдбара, медиатеки, плюсика, контекстного меню).
// Монтируется заново при каждом открытии — имя пустое, цвет случайный
const CreatePlaylistModal = () => (useApp().createPl ? <CreatePlaylistSheet /> : null);
const PL_HUES = [55, 120, 250, 300, 170, 35];
const CreatePlaylistSheet = () => {
  const app = useApp();
  const t = app.t;
  const [name, setName] = React.useState("");
  const [hue, setHue] = React.useState(() => PL_HUES[Math.floor(Math.random() * PL_HUES.length)]);
  const close = () => app.closeCreatePl();
  const create = () => {
    const nm = name.trim();
    if (!nm) return;
    app.createPlaylist(nm, app.createPl.thenAdd, hue);
    close();
  };
  return (
    <Sheet close={close} width={420} label={t.newPlaylist} screen="Новый плейлист">
      <SheetHead title={t.newPlaylist} close={close} />
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 18 }}>
        <Cover hue={hue} size={64} radius={10} />
        <input value={name} autoFocus placeholder={t.plName}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") create(); }}
          style={{
            flex: 1, background: "var(--bg2)", border: "1px solid var(--line)", borderRadius: "var(--r-sm)",
            padding: "11px 14px", fontSize: 14.5, fontWeight: 600, color: "var(--text)", outline: "none", minWidth: 0,
          }} />
      </div>
      <div style={{ display: "flex", gap: 7, marginBottom: 22 }}>
        {PL_HUES.map(h => (
          <button key={h} onClick={() => setHue(h)} style={{
            width: 30, height: 30, borderRadius: 8,
            background: `oklch(var(--cover-l1) 0.05 ${h})`,
            outline: hue === h ? "2px solid var(--acc)" : "1px solid var(--line)", outlineOffset: 1.5,
          }}></button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button className="btn ghost" style={{ padding: "10px 20px" }} onClick={close}>{t.cancel}</button>
        <button className="btn" style={{ padding: "10px 24px", opacity: name.trim() ? 1 : 0.45 }} onClick={create}>{t.create}</button>
      </div>
    </Sheet>
  );
};

Object.assign(window, { ContextMenu, BellPop, CreatePlaylistModal, MenuRow, MenuDivider });
