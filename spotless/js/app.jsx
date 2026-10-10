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
  // uiVersion 2 — основа «Точка»: старые сохранения переводим на неё один раз,
  // остальные настройки пользователя не трогаем (README 7)
  const [theme, setThemeRaw] = React.useState(saved.uiVersion === 2 ? (saved.theme || "dot") : "dot");
  const [lang, setLang] = React.useState(saved.lang || "ru");
  const [currency, setCurrency] = React.useState(saved.currency || "usd");
  const [settings, setSettings] = React.useState(saved.settings || { island: "pill", density: "n", accent: null, wallpaper: null });
  const [onboarded, setOnboarded] = React.useState(saved.onboarded === true);
  // Плеер
  const [player, setPlayer] = React.useState({ trackId: "gl1", playing: true, pct: 0.34, shuffle: 0, repeat: false });
  const [panel, setPanel] = React.useState(true);
  const [volume, setVolume] = React.useState(saved.volume != null ? saved.volume : 0.7);
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
  // Телефон: своя раскладка — нижняя навигация, мини-плеер, полный экран (Android)
  const phone = useMedia(PHONE_Q);

  const t = I18N[lang];

  // Применить тему к документу
  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-density", settings.density || "n");
    ["--acc", "--acc-ink", "--hot"].forEach(p => root.style.removeProperty(p));
    if (settings.accent != null) {
      // В «Точке» главное действие белое, а акцент — горячий цвет (лайк, «сейчас»)
      if (theme === "dot") root.style.setProperty("--hot", `oklch(0.7 0.17 ${settings.accent})`);
      else {
        root.style.setProperty("--acc", `oklch(0.78 0.12 ${settings.accent})`);
        root.style.setProperty("--acc-ink", `oklch(0.26 0.06 ${settings.accent})`);
      }
    }
  }, [theme, settings.accent, settings.density]);

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
  // Персист — после объявления всех сохраняемых состояний (queue, notifRead, hints),
  // иначе без Babel-преобразования const → var это ошибка TDZ
  React.useEffect(() => {
    const doneDl = {};
    Object.entries(downloads).forEach(([k, v]) => { if (v === "done") doneDl[k] = "done"; });
    saveLS({ uiVersion: 2, route, theme, lang, currency, settings, onboarded, trackStates, followed, monthly, auto, rail: railPref, customAmt, downloads: doneDl, userPlaylists, plRemoved, queue, notifRead, hints, volume });
  }, [route, theme, lang, currency, settings, onboarded, trackStates, followed, monthly, auto, railPref, customAmt, downloads, userPlaylists, plRemoved, queue, notifRead, hints, volume]);

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
    panel, setPanel, full, setFull, mini, setMini, fullTab, setFullTab, queueIds, volume, setVolume,
    queue, addToQueue, removeFromQueue, moveInQueue, playContext,
    trackState, toggleLike, setRating, trackPlaylists, togglePlaylist,
    allPlaylists, findPl, playlistTracks, likedIds, removeFromPlaylist, createPlaylist, deletePlaylist,
    followed, toggleFollow,
    downloads, toggleDl, toggleDlAlbum, toggleDlList,
    monthly, setMonthly: setMonthlyV, customAmt, setCustomAmt, commitCustom, auto, setAuto,
    rail, railPref, setRailPref, phone,
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

  const docked = settings.island === "panel";
  const wp = settings.wallpaper;
  const wpi = settings.wallpaperImg;
  const shellBg = wpi
    ? { background: `linear-gradient(color-mix(in oklab, var(--bg0) 84%, transparent), var(--bg0) 76%), url(${wpi}) center / cover` }
    : wp != null
      ? { background: `linear-gradient(160deg, oklch(var(--cover-l1) 0.04 ${wp}) 0%, var(--bg0) 55%)` }
      : undefined;

  return (
    <AppCtx.Provider value={api}>
      <div className={"shell" + (phone ? " phone" + (docked ? " mp-docked" : "") : (panel ? " with-panel" : "") + (rail ? " rail" : "") + (docked ? " docked" : ""))} style={shellBg}>
        {!phone && <Sidebar />}
        <main className="main">
          <TopBar />
          {page}
        </main>
        {!phone && panel && <NowPanel />}
        {phone
          ? <React.Fragment><MobilePlayer /><MobileNav /></React.Fragment>
          : docked ? <PlayerDock /> : <PlayerIsland />}
      </div>
      {full && (phone ? <FullScreenPhone /> : <FullScreen />)}
      {mini && !phone && <MiniPlayer />}
      <DonateModal />
      <TopUpModal />
      <CreatePlaylistModal />
      <ContextMenu />
      <Toasts />
    </AppCtx.Provider>
  );
};

// ---------- Сайдбар ----------
// В «Точке» пункты пронумерованы моно-цифрами, активный отмечен красной точкой;
// в рейле и старых темах вместо номеров — иконки.
const NavItem = ({ page, num, icon, label, badge }) => {
  const app = useApp();
  const active = app.route.page === page;
  return (
    <button className={"navitem" + (active ? " active" : "")} aria-current={active ? "page" : undefined} title={label}
      onClick={() => app.go(page)}>
      <span className="nav-ic"><Ic d={ICONS[icon]} size={20} /></span>
      <span className="nav-num">{num}</span>
      <span className="nav-label" style={{ flex: badge == null ? 1 : "none" }}>{label}</span>
      {badge != null && <span className="badge">{badge}</span>}
      <span className="hot-dot nav-dot"></span>
    </button>
  );
};

const Sidebar = () => {
  const app = useApp();
  const t = app.t;
  const r = app.route;
  const tech = app.theme === "dot" || app.theme === "dark-neutral";
  return (
    <aside className="sidebar" data-screen-label="Сайдбар">
      <div className="logo-row" style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 4px 0 12px", marginBottom: 22 }}>
        <button style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }} onClick={() => app.go("home")} aria-label="Spotless">
          <span className="dots logo-word" style={{ fontSize: 24, letterSpacing: "0.02em" }}>SPOTLESS</span>
          <span className="hot-dot" style={{ width: 7, height: 7 }}></span>
          {app.theme === "dark-neutral" && <span className="nav-label mono" style={{ fontSize: 10.5, color: "var(--mut)" }}>v0.4</span>}
        </button>
        <button className="iconbtn sb-toggle" style={{ width: 30, height: 30, marginLeft: "auto" }}
          title={app.railPref ? t.sbExpand : t.sbCollapse} aria-label={app.railPref ? t.sbExpand : t.sbCollapse}
          onClick={() => app.setRailPref(!app.railPref)}>
          <Ic d={ICONS.panel} size={16} />
        </button>
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <NavItem page="home" num="01" icon="home" label={t.home} />
        <NavItem page="search" num="02" icon="search" label={t.search} />
        <NavItem page="library" num="03" icon="library" label={t.library} />
        <NavItem page="support" num="04" icon="wallet" label={t.support} badge={fmtMoney(app.monthly, app.lang)} />
      </nav>
      <div className="pl-head" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 6px 0 12px", margin: "26px 0 8px" }}>
        <span className="mlabel">{t.playlists}</span>
        <button className="iconbtn ring" style={{ width: 28, height: 28 }} title={t.newPlaylist} aria-label={t.newPlaylist} onClick={() => app.openCreatePl()}><Ic d={ICONS.plus} size={14} /></button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2, minHeight: 0 }}>
        <button className={"plitem" + (r.page === "liked" ? " active" : "")} onClick={() => app.go("liked")} title={t.likedTracks}>
          <span style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--hot)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff" }}>
            <Ic d={ICONS.heart} size={17} fill="currentColor" />
          </span>
          <span className="pl-text" style={{ minWidth: 0 }}>
            <span className="pl-name">{t.likedTracks}</span>
            <span className="pl-sub">{app.likedIds().length} {t.tracksN}</span>
          </span>
        </button>
        {app.allPlaylists.map(pl => (
          <button key={pl.id} className={"plitem" + (r.page === "playlist" && r.id === pl.id ? " active" : "")}
            title={app.lang === "ru" ? pl.name : pl.nameEn}
            onClick={() => app.go("playlist", pl.id)}
            onContextMenu={(e) => app.openCtx(e, { kind: "playlist", id: pl.id })}>
            <Cover hue={pl.hue} size={40} radius={10} />
            <span className="pl-text" style={{ minWidth: 0 }}>
              <span className="pl-name">{app.lang === "ru" ? pl.name : pl.nameEn}</span>
              <span className="pl-sub">{pl.collab ? t.collab + " · " : ""}{app.playlistTracks(pl.id).length} {t.tracksN}</span>
            </span>
          </button>
        ))}
      </div>
      {tech && (
        <div className="netline" aria-label={app.lang === "ru" ? "Состояние сети" : "Network status"}>
          <span style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--text)" }}></span>12 PEERS · DHT OK</span>
          <span style={{ paddingLeft: 12 }}>CACHE 1.2 GB</span>
        </div>
      )}
      <NavItem page="settings" num="05" icon="gear" label={t.settings} />
    </aside>
  );
};

// ---------- Верхняя панель ----------
const TopBar = () => {
  const app = useApp();
  const t = app.t;
  const [bellOpen, setBellOpen] = React.useState(false);
  const bell = (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <button className={"iconbtn" + (bellOpen ? " lit" : "")} style={{ width: 44, height: 44 }} title={t.notifTitle} aria-label={t.notifTitle} aria-expanded={bellOpen}
        onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}
        onClick={() => setBellOpen(!bellOpen)}>
        <Ic d={ICONS.bell} size={19} />
        {!app.notifRead && <span className="hot-dot" style={{ position: "absolute", top: 11, right: 12 }}></span>}
      </button>
      {bellOpen && <BellPop close={() => setBellOpen(false)} />}
    </span>
  );
  const avatar = (size) => (
    <button title={t.profile} aria-label={t.profile} onClick={() => app.go("profile", "me")} style={{
      width: size, height: size, borderRadius: "50%", background: "var(--acc)", color: "var(--acc-ink)",
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 600, flexShrink: 0,
      outline: app.route.page === "profile" && app.route.id === "me" ? "2px solid var(--hot)" : "none", outlineOffset: 3,
    }}>Л</button>
  );
  // Телефон: на вкладках — логотип, внутри разделов — «Назад»; настройки — шестерёнкой
  if (app.phone) {
    const isTab = MOB_TABS.some(([p]) => p === app.route.page);
    return (
      <div className="topbar">
        {isTab ? (
          <button style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 4 }} onClick={() => app.go("home")} aria-label="Spotless">
            <span className="dots" style={{ fontSize: 20, letterSpacing: "0.02em" }}>SPOTLESS</span>
            <span className="hot-dot"></span>
          </button>
        ) : (
          <button className="iconbtn ring" style={{ width: 44, height: 44 }} aria-label={app.lang === "ru" ? "Назад" : "Back"}
            onClick={() => app.history.length ? app.goBack() : app.go("home")}>
            <Ic d={ICONS.back} size={18} />
          </button>
        )}
        <div style={{ flex: 1 }}></div>
        {bell}
        <button className={"iconbtn" + (app.route.page === "settings" ? " lit" : "")} style={{ width: 44, height: 44 }} title={t.settings} aria-label={t.settings} onClick={() => app.go("settings")}>
          <Ic d={ICONS.gear} size={19} />
        </button>
        {avatar(38)}
      </div>
    );
  }
  return (
    <div className="topbar">
      <div className="tb-nav" style={{ display: "flex", gap: 8 }}>
        <button className="iconbtn ring" style={{ width: 40, height: 40, opacity: app.history.length ? 1 : 0.35 }} aria-label={app.lang === "ru" ? "Назад" : "Back"} onClick={app.goBack}>
          <Ic d={ICONS.back} size={17} />
        </button>
        <button className="iconbtn ring" style={{ width: 40, height: 40, opacity: app.future.length ? 1 : 0.35 }} aria-label={app.lang === "ru" ? "Вперёд" : "Forward"} onClick={app.goFwd}>
          <Ic d={ICONS.fwd} size={17} />
        </button>
      </div>
      <label className="tb-search" style={{
        flex: "0 1 440px", display: "flex", alignItems: "center", gap: 10, background: "var(--bg2)",
        borderRadius: 22, height: 44, padding: "0 8px 0 16px", marginLeft: 6, cursor: "text",
      }}
        onClick={() => app.route.page !== "search" && app.go("search")}>
        <Ic d={ICONS.search} size={17} style={{ color: "var(--mut2)" }} />
        <input value={app.query} placeholder={t.searchPh} aria-label={t.search}
          onChange={(e) => { app.setQuery(e.target.value); if (app.route.page !== "search") app.go("search"); }}
          style={{ flex: 1, minWidth: 0, background: "none", border: "none", outline: "none", color: "var(--text)", fontSize: 14 }} />
        {(app.theme === "dot" || app.theme === "dark-neutral") && <span className="mono tb-k" style={{ fontSize: 11, border: "1px solid var(--bg3)", borderRadius: 8, padding: "4px 8px", color: "var(--mut2)" }}>⌘K</span>}
      </label>
      <div style={{ flex: 1 }}></div>
      {bell}
      {avatar(40)}
    </div>
  );
};

// ---------- Нижняя навигация (телефон) ----------
// Четыре вкладки как в сайдбаре; внутри альбома или артиста подсвечена вкладка, откуда пришли
const MOB_TABS = [["home", "home"], ["search", "search"], ["library", "library"], ["support", "dollar"]];
const TAB_OF = { home: "home", search: "search", genre: "search", library: "library", liked: "library", playlist: "library", support: "support" };
const MobileNav = () => {
  const app = useApp();
  const t = app.t;
  const last = React.useRef("home");
  const cur = TAB_OF[app.route.page];
  if (cur) last.current = cur;
  const active = cur || last.current;
  return (
    <nav className="mobnav" aria-label={app.lang === "ru" ? "Разделы" : "Sections"}>
      {MOB_TABS.map(([p, ic]) => (
        <button key={p} className={"mn-item" + (active === p ? " active" : "")} aria-current={app.route.page === p ? "page" : undefined}
          onClick={() => app.go(p)}>
          <Ic d={ICONS[ic]} size={22} />
          <span className="mn-label">{active === p && <span className="hot-dot"></span>}{p === "support" ? t.navSupport : t[p]}</span>
        </button>
      ))}
    </nav>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
