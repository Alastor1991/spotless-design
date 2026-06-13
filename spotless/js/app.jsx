// Spotless — корневое приложение: состояние, каркас, навигация, Tweaks.

const LS_KEY = "spotless_proto_v1";
const loadLS = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; } };
const saveLS = (obj) => { try { localStorage.setItem(LS_KEY, JSON.stringify(obj)); } catch {} };

const App = () => {
  const saved = React.useRef(loadLS()).current;

  // Навигация
  const [route, setRoute] = React.useState(saved.route || { page: "home", id: null });
  const [history, setHistory] = React.useState([]);
  const [future, setFuture] = React.useState([]);
  // Тема и настройки
  const [theme, setThemeRaw] = React.useState(saved.theme || "dark-warm");
  const [lang, setLang] = React.useState(saved.lang || "ru");
  const [currency, setCurrency] = React.useState(saved.currency || "usd");
  const [settings, setSettings] = React.useState(saved.settings || { island: "pill", density: "n", accent: null, wallpaper: null });
  const [onboarded, setOnboarded] = React.useState(saved.onboarded === true);
  // Плеер
  const [player, setPlayer] = React.useState({ trackId: "gl1", playing: true, pct: 0.34, shuffle: 0, repeat: false });
  const [panel, setPanel] = React.useState(true);
  const [full, setFull] = React.useState(false);
  const [mini, setMini] = React.useState(false);
  const [fullTab, setFullTab] = React.useState("lyrics");
  // Данные пользователя
  const [trackStates, setTrackStates] = React.useState(saved.trackStates || {});
  const [followed, setFollowed] = React.useState(saved.followed || ["milk", "lowtide", "velvet"]);
  const [userPlaylists, setUserPlaylists] = React.useState(saved.userPlaylists || []);
  const [plRemoved, setPlRemoved] = React.useState(saved.plRemoved || {});
  // Загрузки: общее состояние треков и релизов
  const [downloads, setDownloads] = React.useState(() => {
    if (saved.downloads) return saved.downloads;
    const seed = {};
    DB.albums.grunt.tracks.forEach(tr => seed[tr.id] = "done");
    DB.albums.salt.tracks.forEach(tr => seed[tr.id] = "done");
    return seed;
  });
  const dlRef = React.useRef(downloads);
  React.useEffect(() => { dlRef.current = downloads; }, [downloads]);
  const dlTimers = React.useRef({});
  const [monthly, setMonthly] = React.useState(saved.monthly != null ? saved.monthly : 5);
  const [customAmt, setCustomAmt] = React.useState(saved.customAmt || "");
  const [auto, setAuto] = React.useState(saved.auto !== false);
  // UI
  const [query, setQuery] = React.useState("");
  const [donateTarget, setDonateTarget] = React.useState(null);
  const [toasts, setToasts] = React.useState([]);
  const [railPref, setRailPref] = React.useState(saved.rail === true);
  const [narrow, setNarrow] = React.useState(window.innerWidth < 1180);
  React.useEffect(() => {
    const h = () => setNarrow(window.innerWidth < 1180);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  const rail = railPref || narrow;

  const t = I18N[lang];

  // Персист
  React.useEffect(() => {
    const doneDl = {};
    Object.entries(downloads).forEach(([k, v]) => { if (v === "done") doneDl[k] = "done"; });
    saveLS({ route, theme, lang, currency, settings, onboarded, trackStates, followed, monthly, auto, rail: railPref, customAmt, downloads: doneDl, userPlaylists, plRemoved, queue, notifRead, hints });
  }, [route, theme, lang, currency, settings, onboarded, trackStates, followed, monthly, auto, railPref, customAmt, downloads, userPlaylists, plRemoved, queue, notifRead, hints]);

  // Применить тему к документу
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (settings.accent != null) {
      document.documentElement.style.setProperty("--acc", `oklch(0.78 0.12 ${settings.accent})`);
      document.documentElement.style.setProperty("--acc-ink", `oklch(0.26 0.06 ${settings.accent})`);
    } else {
      document.documentElement.style.removeProperty("--acc");
      document.documentElement.style.removeProperty("--acc-ink");
    }
  }, [theme, settings.accent]);

  // Тикающий прогресс
  React.useEffect(() => {
    if (!player.playing) return;
    const iv = setInterval(() => {
      setPlayer(p => ({ ...p, pct: p.pct + 0.0022 > 1 ? 0 : p.pct + 0.0022 }));
    }, 1000);
    return () => clearInterval(iv);
  }, [player.playing]);

  // Очередь — изменяемая: добавление, удаление, перетаскивание
  const [queue, setQueue] = React.useState(saved.queue || ["gl1", "s2", "h2", "a2", "g9", "b2", "p3"]);
  const queueIds = queue;

  // API
  const trackState = (id) => {
    const base = DB.trackIndex[id] || {};
    const o = trackStates[id] || {};
    return {
      liked: o.liked != null ? o.liked : !!base.liked,
      rating: o.rating !== undefined ? o.rating : (base.rating != null ? base.rating : null),
      playlists: o.playlists || [],
    };
  };
  const patchTrack = (id, patch) => setTrackStates(s => ({ ...s, [id]: { ...trackState(id), ...patch } }));
  const toggleLike = (id) => {
    const v = !trackState(id).liked;
    patchTrack(id, { liked: v });
    if (v) hint("rate", t.holdHint);
  };
  const setRating = (id, r) => patchTrack(id, { rating: r, liked: r == null ? trackState(id).liked : r >= 5 });

  // —— Плейлисты ——
  // Базовый состав лежит в DB (tracks), пользовательские добавления — в trackStates,
  // удаления базовых треков — в plRemoved. Свои плейлисты — в userPlaylists.
  const allPlaylists = [...DB.playlists, ...userPlaylists];
  const findPl = (id) => DB.findPlaylist(id) || userPlaylists.find(p => p.id === id) || null;
  const inPlaylist = (tid, plId) => {
    const meta = findPl(plId);
    const baseIn = !!(meta && (meta.tracks || []).includes(tid)) && !((plRemoved[plId] || []).includes(tid));
    const stIn = ((trackStates[tid] && trackStates[tid].playlists) || []).includes(plId);
    return baseIn || stIn;
  };
  const trackPlaylists = (id) => allPlaylists.filter(p => inPlaylist(id, p.id)).map(p => p.id);
  const plToastName = (plId) => { const pl = findPl(plId); return lang === "ru" ? pl.name : (pl.nameEn || pl.name); };
  const togglePlaylist = (id, plId) => {
    const meta = findPl(plId);
    const stPls = trackState(id).playlists;
    if (inPlaylist(id, plId)) {
      if (stPls.includes(plId)) patchTrack(id, { playlists: stPls.filter(p => p !== plId) });
      if (meta && (meta.tracks || []).includes(id)) setPlRemoved(r => ({ ...r, [plId]: [...(r[plId] || []), id] }));
      toast(`${t.removedFrom} «${plToastName(plId)}»`);
    } else {
      if (meta && (meta.tracks || []).includes(id)) setPlRemoved(r => ({ ...r, [plId]: (r[plId] || []).filter(x => x !== id) }));
      else patchTrack(id, { playlists: [...stPls, plId] });
      toast(`${t.addedTo} «${plToastName(plId)}»`);
    }
  };
  const removeFromPlaylist = (id, plId) => { if (inPlaylist(id, plId)) togglePlaylist(id, plId); };
  const playlistTracks = (plId) => {
    const meta = findPl(plId);
    if (!meta) return [];
    const removed = plRemoved[plId] || [];
    const base = (meta.tracks || []).filter(tid => !removed.includes(tid));
    const added = Object.keys(trackStates).filter(tid =>
      ((trackStates[tid].playlists) || []).includes(plId) && !base.includes(tid));
    return [...base, ...added];
  };
  const likedIds = () => Object.keys(DB.trackIndex).filter(id => trackState(id).liked);
  const createPlaylist = (name, thenAdd, hue) => {
    const id = "u" + Date.now().toString(36);
    setUserPlaylists(u => [...u, { id, name, nameEn: name, hue: hue != null ? hue : 55, byMe: true, collab: false, tracks: [], user: true }]);
    if (thenAdd) patchTrack(thenAdd, { playlists: [...trackState(thenAdd).playlists, id] });
    setCreatePl(null);
    toast(t.plCreated);
    go("playlist", id);
  };
  const deletePlaylist = (id) => {
    setUserPlaylists(u => u.filter(p => p.id !== id));
    toast(t.plDeleted);
    if (route.page === "playlist" && route.id === id) go("library");
  };
  const toggleFollow = (id) => setFollowed(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  // —— Загрузки ——
  const startTrackDl = (id, dur = 2400) => {
    setDownloads(d => ({ ...d, [id]: "loading" }));
    clearTimeout(dlTimers.current[id]);
    dlTimers.current[id] = setTimeout(() => {
      setDownloads(d => d[id] === "loading" ? { ...d, [id]: "done" } : d);
    }, dur);
  };
  const toggleDl = (id) => {
    if (dlRef.current[id]) {
      clearTimeout(dlTimers.current[id]);
      setDownloads(d => { const nd = { ...d }; delete nd[id]; return nd; });
    } else { startTrackDl(id); hint("dl", t.hintDl); }
  };
  const toggleDlList = (ids) => {
    const allDone = ids.length && ids.every(id => dlRef.current[id] === "done");
    if (allDone) {
      setDownloads(d => { const nd = { ...d }; ids.forEach(id => delete nd[id]); return nd; });
    } else {
      // каскад: треки стартуют со сдвигом, каждый со своей анимацией
      let k = 0;
      ids.forEach((id) => {
        if (dlRef.current[id] === "done") return;
        const delay = k * 450; k++;
        dlTimers.current["st_" + id] = setTimeout(() => startTrackDl(id, 1400), delay);
      });
      hint("dl", t.hintDl);
    }
  };
  const toggleDlAlbum = (albumId) => toggleDlList(DB.albums[albumId].tracks.map(tr => tr.id));

  const go = (page, id = null) => {
    if (page === "onboarding") { setOnboarded(false); return; }
    setHistory(h => [...h, route]);
    setFuture([]);
    setRoute({ page, id });
    if (page !== "search") setQuery("");
    const main = document.querySelector(".main");
    if (main) main.scrollTop = 0;
  };
  const goBack = () => {
    if (!history.length) return;
    setFuture(f => [route, ...f]);
    setRoute(history[history.length - 1]);
    setHistory(h => h.slice(0, -1));
  };
  const goFwd = () => {
    if (!future.length) return;
    setHistory(h => [...h, route]);
    setRoute(future[0]);
    setFuture(f => f.slice(1));
  };

  const playTrack = (id) => setPlayer(p => ({ ...p, trackId: id, playing: true, pct: 0.02 }));
  const togglePlay = () => setPlayer(p => ({ ...p, playing: !p.playing }));
  const nextTrack = () => {
    const i = queueIds.indexOf(player.trackId);
    playTrack(queueIds[(i + 1) % queueIds.length]);
  };
  const prevTrack = () => {
    const i = queueIds.indexOf(player.trackId);
    playTrack(queueIds[(i - 1 + queueIds.length) % queueIds.length]);
  };
  const addToQueue = (x) => {
    setQueue(q => [...q, ...(Array.isArray(x) ? x : [x]).filter(id => !q.includes(id))]);
    toast(t.queueAdded);
    hint("queue", t.hintQueue);
  };
  const removeFromQueue = (i) => setQueue(q => q.filter((_, k) => k !== i));
  const moveInQueue = (from, to) => setQueue(q => {
    if (from == null || to == null || from === to) return q;
    const n = [...q]; const [x] = n.splice(from, 1); n.splice(to, 0, x); return n;
  });
  // Слушать контекст целиком: очередь = список, играет первый
  const playContext = (ids) => { if (!ids || !ids.length) return; setQueue(ids); playTrack(ids[0]); };
  const toggleShuffle = () => {
    const m = ((player.shuffle | 0) + 1) % 3;
    if (m === 2) toast(t.smartShuffleOn);
    setPlayer(p => ({ ...p, shuffle: m }));
  };
  const toggleRepeat = () => setPlayer(p => ({ ...p, repeat: !p.repeat }));
  const seek = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPlayer(p => ({ ...p, pct: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) }));
  };
  const seekTo = (pct) => setPlayer(p => ({ ...p, pct }));
  const fmtTime = (pct) => {
    const tr = DB.trackIndex[player.trackId];
    const [m, s] = tr.dur.split(":").map(Number);
    const cur = Math.round((m * 60 + s) * pct);
    return `${Math.floor(cur / 60)}:${String(cur % 60).padStart(2, "0")}`;
  };

  const openDonate = (target) => setDonateTarget(target);
  const closeDonate = () => setDonateTarget(null);
  const [topUp, setTopUp] = React.useState(false);
  const openTopUp = () => setTopUp(true);
  const closeTopUp = () => setTopUp(false);
  // Создание плейлиста (модалка); thenAdd — трек, который сразу добавится
  const [createPl, setCreatePl] = React.useState(null);
  const openCreatePl = (opts) => setCreatePl(opts || {});
  const closeCreatePl = () => setCreatePl(null);
  // Глобальное контекстное меню (ПКМ и «⋯»)
  const [ctx, setCtx] = React.useState(null);
  const openCtx = (e, payload) => { e.preventDefault(); e.stopPropagation(); setCtx({ x: e.clientX, y: e.clientY, ...payload }); };
  const openCtxAt = (el, payload) => { const r = el.getBoundingClientRect(); setCtx({ x: r.left, y: r.bottom + 8, ...payload }); };
  const closeCtx = () => setCtx(null);
  // Устройства, уведомления, одноразовые подсказки
  const [device, setDevice] = React.useState("this");
  const [notifRead, setNotifRead] = React.useState(saved.notifRead === true);
  const [hints, setHints] = React.useState(saved.hints || {});
  const hintsRef = React.useRef(hints);
  React.useEffect(() => { hintsRef.current = hints; }, [hints]);
  const hint = (key, msg) => {
    if (hintsRef.current[key]) return;
    hintsRef.current = { ...hintsRef.current, [key]: 1 };
    setHints(h => ({ ...h, [key]: 1 }));
    setTimeout(() => toast(msg), 700);
  };
  const toast = (msg) => {
    const id = Date.now() + Math.random();
    setToasts(ts => [...ts, { id, msg }]);
    setTimeout(() => setToasts(ts => ts.filter(x => x.id !== id)), 2400);
  };
  const setTheme = (th) => setThemeRaw(th);
  const setAccent = (h) => setSettings(s => ({ ...s, accent: h }));
  const setWallpaper = (h) => setSettings(s => ({ ...s, wallpaper: h, wallpaperImg: null }));
  const setWallpaperImg = (data) => setSettings(s => ({ ...s, wallpaperImg: data, wallpaper: null }));
  const finishOnboarding = () => setOnboarded(true);
  const setMonthlyV = (v) => { setMonthly(v); setCustomAmt(""); };
  // Своя сумма: фиксируется по клику вне поля, значение остаётся в капсуле
  const commitCustom = () => { const v = parseFloat(customAmt); if (v > 0) setMonthly(v); };

  const api = {
    t, lang, setLang, currency, setCurrency,
    route, go, goBack, goFwd, history, future,
    theme, setTheme, settings, setSettings, setAccent, setWallpaper, setWallpaperImg,
    player, playTrack, togglePlay, nextTrack, prevTrack, toggleShuffle, toggleRepeat, seek, seekTo, fmtTime,
    panel, setPanel, full, setFull, mini, setMini, fullTab, setFullTab, queueIds,
    queue, addToQueue, removeFromQueue, moveInQueue, playContext,
    trackState, toggleLike, setRating, trackPlaylists, togglePlaylist,
    allPlaylists, findPl, playlistTracks, likedIds, removeFromPlaylist, createPlaylist, deletePlaylist,
    followed, toggleFollow,
    downloads, toggleDl, toggleDlAlbum, toggleDlList,
    monthly, setMonthly: setMonthlyV, customAmt, setCustomAmt, commitCustom, auto, setAuto,
    rail, railPref, setRailPref,
    query, setQuery,
    donateTarget, openDonate, closeDonate,
    topUp, openTopUp, closeTopUp,
    createPl, openCreatePl, closeCreatePl,
    ctx, openCtx, openCtxAt, closeCtx,
    device, setDevice,
    notifRead, setNotifRead, hint,
    lyricsFor: DB.lyricsFor,
    toasts, toast, finishOnboarding,
  };

  if (!onboarded) {
    return (
      <AppCtx.Provider value={api}>
        <Onboarding />
      </AppCtx.Provider>
    );
  }

  const page = route.page === "home" ? <PageHome />
    : route.page === "search" ? <PageSearch />
    : route.page === "library" ? <PageLibrary />
    : route.page === "support" ? <PageSupport />
    : route.page === "settings" ? <PageSettings />
    : route.page === "album" ? <PageAlbum id={route.id} />
    : route.page === "artist" ? <PageArtist id={route.id} />
    : route.page === "playlist" ? <PagePlaylist id={route.id} />
    : route.page === "liked" ? <PageLiked />
    : route.page === "profile" ? <PageProfile id={route.id} />
    : route.page === "jam" ? <PageJam />
    : route.page === "showall" ? <PageShowAll id={route.id} />
    : route.page === "genre" ? <PageGenre id={route.id} />
    : <PageHome />;

  const wp = settings.wallpaper;
  const wpi = settings.wallpaperImg;
  const shellBg = wpi
    ? { background: `linear-gradient(color-mix(in oklab, var(--bg0) 84%, transparent), var(--bg0) 76%), url(${wpi}) center / cover` }
    : wp != null
      ? { background: `linear-gradient(160deg, oklch(var(--cover-l1) 0.04 ${wp}) 0%, var(--bg0) 55%)` }
      : undefined;

  return (
    <AppCtx.Provider value={api}>
      <div className={"shell" + (panel ? " with-panel" : "") + (rail ? " rail" : "")} style={shellBg}>
        <Sidebar />
        <main className="main">
          <TopBar />
          {page}
        </main>
        {panel && <NowPanel />}
        <PlayerIsland />
      </div>
      {full && <FullScreen />}
      {mini && <MiniPlayer />}
      <DonateModal />
      <TopUpModal />
      <CreatePlaylistModal />
      <ContextMenu />
      <Toasts />
    </AppCtx.Provider>
  );
};

// ---------- Сайдбар ----------
const Sidebar = () => {
  const app = useApp();
  const t = app.t;
  const r = app.route;
  const studio = app.theme === "dark-neutral";
  return (
    <aside className="sidebar" data-screen-label="Сайдбар">
      <div className="logo-row" style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 6px 0 14px", marginBottom: 18 }}>
        <button style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }} onClick={() => app.go("home")}>
          <span style={{ width: 14, height: 14, borderRadius: "50%", background: "var(--acc)", display: "inline-block", flexShrink: 0 }}></span>
          <span className="nav-label" style={{ fontSize: 21, fontWeight: 800, letterSpacing: "-0.02em" }}>spotless</span>
          {studio && <span className="nav-label mono" style={{ fontSize: 10.5, color: "var(--mut)" }}>v0.4</span>}
        </button>
        <button className="iconbtn sb-toggle" style={{ width: 30, height: 30, marginLeft: "auto" }}
          title={app.railPref ? t.sbExpand : t.sbCollapse}
          onClick={() => app.setRailPref(!app.railPref)}>
          <Ic d={ICONS.panel} size={16} />
        </button>
      </div>
      <button className={"navitem" + (r.page === "home" ? " active" : "")} onClick={() => app.go("home")}>
        <Ic d={ICONS.home} size={20} /><span className="nav-label">{t.home}</span>
      </button>
      <button className={"navitem" + (r.page === "search" ? " active" : "")} onClick={() => app.go("search")}>
        <Ic d={ICONS.search} size={20} /><span className="nav-label">{t.search}</span>
      </button>
      <button className={"navitem" + (r.page === "library" ? " active" : "")} onClick={() => app.go("library")}>
        <Ic d={ICONS.library} size={20} /><span className="nav-label">{t.library}</span>
      </button>
      <button className={"navitem" + (r.page === "support" ? " active" : "")} onClick={() => app.go("support")}>
        <Ic d={ICONS.wallet} size={20} /><span className="nav-label">{t.support}</span>
        <span className="badge">${app.monthly}</span>
      </button>
      <div className="divider" style={{ margin: "14px 14px" }}></div>
      <div className="pl-head" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", marginBottom: 6 }}>
        <span className="sec-label">{t.playlists}</span>
        <button className="iconbtn" style={{ width: 26, height: 26 }} title={t.newPlaylist} onClick={() => app.openCreatePl()}><Ic d={ICONS.plus} size={15} /></button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1, minHeight: 0 }}>
        <button className={"plitem" + (r.page === "liked" ? " active" : "")} style={{ display: "flex", alignItems: "center", gap: 10 }}
          onClick={() => app.go("liked")}>
          <Ic d={ICONS.heart} size={15} fill="currentColor" style={{ color: "var(--acc)" }} />
          <span className="nav-label" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{t.likedTracks}</span>
        </button>
        {app.allPlaylists.map(pl => (
          <button key={pl.id} className={"plitem" + (r.page === "playlist" && r.id === pl.id ? " active" : "")}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
            onClick={() => app.go("playlist", pl.id)}
            onContextMenu={(e) => app.openCtx(e, { kind: "playlist", id: pl.id })}>
            <Cover hue={pl.hue} size={22} radius={5} label="" />
            <span className="nav-label" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {app.lang === "ru" ? pl.name : pl.nameEn}
              {pl.collab && <Ic d={ICONS.users} size={13} style={{ display: "inline-block", verticalAlign: "-2px", marginLeft: 7, opacity: 0.6 }} />}
            </span>
          </button>
        ))}
      </div>
      <div className="divider" style={{ margin: "10px 14px" }}></div>
      {studio && <div className="mono nav-label" style={{ fontSize: 10.5, color: "var(--mut)", padding: "4px 14px 6px" }}>cache 1.2 GB · 12 peers · dht ok</div>}
      <button className={"navitem" + (r.page === "settings" ? " active" : "")} onClick={() => app.go("settings")}>
        <Ic d={ICONS.gear} size={20} /><span className="nav-label">{t.settings}</span>
      </button>
    </aside>
  );
};

// ---------- Верхняя панель ----------
const TopBar = () => {
  const app = useApp();
  const t = app.t;
  const [bellOpen, setBellOpen] = React.useState(false);
  return (
    <div className="topbar">
      <div style={{ display: "flex", gap: 4 }}>
        <button className="iconbtn" style={{ opacity: app.history.length ? 1 : 0.35 }} onClick={app.goBack}>
          <Ic d={ICONS.back} size={19} />
        </button>
        <button className="iconbtn" style={{ opacity: app.future.length ? 1 : 0.35 }} onClick={app.goFwd}>
          <Ic d={ICONS.fwd} size={19} />
        </button>
      </div>
      <div style={{
        flex: "0 1 400px", display: "flex", alignItems: "center", gap: 10, background: "var(--bg1)",
        border: "1px solid var(--line)", borderRadius: 99, padding: "9px 16px",
      }}
        onClick={() => app.route.page !== "search" && app.go("search")}>
        <Ic d={ICONS.search} size={16} style={{ color: "var(--mut)" }} />
        <input value={app.query} placeholder={t.searchPh}
          onChange={(e) => { app.setQuery(e.target.value); if (app.route.page !== "search") app.go("search"); }}
          style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--text)", fontSize: 13.5 }} />
        {app.theme === "dark-neutral" && <span className="mono" style={{ fontSize: 11, border: "1px solid var(--line)", borderRadius: 4, padding: "1px 6px", color: "var(--mut)" }}>⌘K</span>}
      </div>
      <div style={{ flex: 1 }}></div>
      <span style={{ position: "relative", display: "inline-flex" }}>
        <button className={"iconbtn" + (bellOpen ? " lit" : "")} title={t.notifTitle}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setBellOpen(!bellOpen)}>
          <Ic d={ICONS.bell} size={19} />
          {!app.notifRead && <span style={{ position: "absolute", top: 6, right: 7, width: 7, height: 7, borderRadius: "50%", background: "var(--acc)" }}></span>}
        </button>
        {bellOpen && <BellPop close={() => setBellOpen(false)} />}
      </span>
      <button title={t.profile} onClick={() => app.go("profile", "me")} style={{
        width: 34, height: 34, borderRadius: "50%", background: "var(--bg2)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "var(--acc)",
        outline: app.route.page === "profile" && app.route.id === "me" ? "2px solid var(--acc)" : "none", outlineOffset: 2,
      }}>Л</button>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
