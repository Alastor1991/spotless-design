// Spotless — каркас окна: страница по маршруту, сайдбар, верхняя панель, нижняя навигация
// телефона, плеер и окна поверх. Экраны ошибок — здесь же.

// Страница по маршруту. Таблица — внутри функции: страницы объявлены в других файлах
const pageFor = (page) => ({
  home: PageHome, search: PageSearch, library: PageLibrary, support: PageSupport, settings: PageSettings,
  album: PageAlbum, artist: PageArtist, playlist: PagePlaylist, liked: PageLiked, profile: PageProfile,
  jam: PageJam, showall: PageShowAll, genre: PageGenre,
})[page] || PageHome;

const Shell = () => {
  const app = useApp();
  const { route, settings, phone, panel, rail } = app;
  const Page = pageFor(route.page);
  const docked = settings.island === "panel";
  // Фон окна с обоями: строка с картинкой может весить сотни килобайт — собираем её, только когда обои меняются
  const wp = settings.wallpaper;
  const wpi = settings.wallpaperImg;
  const shellBg = React.useMemo(() => wpi
    ? { background: `linear-gradient(color-mix(in oklab, var(--bg0) 84%, transparent), var(--bg0) 76%), url("${wpi}") center / cover` }
    : wp != null
      ? { background: `linear-gradient(160deg, oklch(var(--cover-l1) 0.04 ${wp}) 0%, var(--bg0) 55%)` }
      : undefined, [wp, wpi]);
  const cls = "shell" + (phone
    ? " phone" + (docked ? " mp-docked" : "")
    : (panel ? " with-panel" : "") + (rail ? " rail" : "") + (docked ? " docked" : ""));

  return (
    <React.Fragment>
      <div className={cls} style={shellBg}>
        {!phone && <Sidebar />}
        <main className="main">
          <TopBar />
          {/* Упала страница — остальное (плеер, навигация) живёт; другая страница — новая попытка */}
          <ErrorBoundary resetKey={route.page + ":" + route.id} fallback={(reset, detail) => <PageError reset={reset} detail={detail} />}>
            <Page id={route.id} />
          </ErrorBoundary>
        </main>
        {!phone && panel && <NowPanel />}
        {phone
          ? <React.Fragment><MobilePlayer /><MobileNav /></React.Fragment>
          : docked ? <PlayerDock /> : <PlayerIsland />}
      </div>
      {app.full && (phone ? <FullScreenPhone /> : <FullScreen />)}
      {app.mini && !phone && <MiniPlayer />}
      <DonateModal />
      <TopUpModal />
      <CreatePlaylistModal />
      <ContextMenu />
      <Toasts />
    </React.Fragment>
  );
};

// ---------- Ошибки ----------
// Текст ошибки мелким моноширинным шрифтом — для скриншота в отчёте о баге
const ErrDetail = ({ text }) => text
  ? <code className="mono" style={{ fontSize: 11, lineHeight: 1.5, color: "var(--mut2)", maxWidth: 520, overflowWrap: "anywhere", userSelect: "all" }}>{text}</code>
  : null;
// Упала одна страница: объяснение и выход на главную, плеер и навигация остаются
const PageError = ({ reset, detail }) => {
  const app = useApp();
  const t = app.t;
  return (
    <div className="fade-in" role="alert" style={{ padding: "72px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
      <h1 style={{ fontSize: 34 }}>{t.errTitle}</h1>
      <p style={{ fontSize: 14.5, color: "var(--mut)", maxWidth: 420, lineHeight: 1.6, textWrap: "pretty" }}>{t.errNote}</p>
      <ErrDetail text={detail} />
      <button className="btn" style={{ marginTop: 8 }} onClick={() => { app.go("home"); reset(); }}>{t.errHome}</button>
    </div>
  );
};
// Упало всё приложение: та же подсказка. Из сохранённого меняем только маршрут — открываем главную,
// настройки, оценки и плейлисты не трогаем
const AppCrash = ({ detail }) => {
  const t = I18N[loadLS().lang === "en" ? "en" : "ru"];
  return (
    <div className="ob" role="alert" style={{ alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center" }}>
      <h1 style={{ fontSize: 34 }}>{t.errTitle}</h1>
      <p style={{ fontSize: 14.5, color: "var(--mut)", maxWidth: 420, lineHeight: 1.6, textWrap: "pretty" }}>{t.errNote}</p>
      <ErrDetail text={detail} />
      <button className="btn" style={{ marginTop: 8 }}
        onClick={() => { saveLS({ ...loadLS(), route: { page: "home", id: null } }); location.reload(); }}>{t.errHome}</button>
    </div>
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
  return (
    <aside className="sidebar" data-screen-label="Сайдбар">
      <div className="logo-row" style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 4px 0 12px", marginBottom: 22 }}>
        <button style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }} onClick={() => app.go("home")} aria-label="Spotless">
          <span className="dots logo-word" style={{ fontSize: 24, letterSpacing: "0.02em" }}>SPOTLESS</span>
          <span className="hot-dot" style={{ width: 7, height: 7 }}></span>
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
        <NavItem page="support" num="04" icon="wallet" label={t.support} badge={app.money.fmt(app.monthly)} />
      </nav>
      <div className="pl-head" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 6px 0 12px", margin: "26px 0 8px" }}>
        <span className="mlabel">{t.playlists}</span>
        <button className="iconbtn ring" style={{ width: 28, height: 28 }} title={t.newPlaylist} aria-label={t.newPlaylist} onClick={() => app.openCreatePl()}><Ic d={ICONS.plus} size={14} /></button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2, minHeight: 0 }}>
        <button className={"plitem" + (r.page === "liked" ? " active" : "")} onClick={() => app.go("liked")} title={t.likedTracks}>
          <span style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--hot)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--hot-ink)" }}>
            <Ic d={ICONS.heart} size={17} fill="currentColor" />
          </span>
          <span className="pl-text" style={{ minWidth: 0 }}>
            <span className="pl-name">{t.likedTracks}</span>
            <span className="pl-sub">{app.likedIds().length} {t.tracksN}</span>
          </span>
        </button>
        {app.allPlaylists.map(pl => (
          <button key={pl.id} className={"plitem" + (r.page === "playlist" && r.id === pl.id ? " active" : "")}
            title={plName(app.lang, pl)}
            onClick={() => app.go("playlist", pl.id)}
            onContextMenu={(e) => app.openCtx(e, { kind: "playlist", id: pl.id })}>
            <Cover hue={pl.hue} size={40} radius={10} />
            <span className="pl-text" style={{ minWidth: 0 }}>
              <span className="pl-name">{plName(app.lang, pl)}</span>
              <span className="pl-sub">{pl.collab ? t.collab + " · " : ""}{app.playlistTracks(pl.id).length} {t.tracksN}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="netline" aria-label={t.netStatus}>
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--text)" }}></span>12 PEERS · DHT OK</span>
        <span style={{ paddingLeft: 12 }}>CACHE 1.2 GB</span>
      </div>
      <NavItem page="settings" num="05" icon="gear" label={t.settings} />
    </aside>
  );
};

// ---------- Верхняя панель ----------
// Колокольчик уведомлений с поповером
const BellBtn = () => {
  const app = useApp();
  const t = app.t;
  const [open, setOpen] = React.useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <button className={"iconbtn" + (open ? " lit" : "")} style={{ width: 44, height: 44 }} title={t.notifTitle} aria-label={t.notifTitle} aria-expanded={open}
        onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}
        onClick={() => setOpen(!open)}>
        <Ic d={ICONS.bell} size={19} />
        {!app.notifRead && <span className="hot-dot" style={{ position: "absolute", top: 11, right: 12 }}></span>}
      </button>
      {open && <BellPop close={() => setOpen(false)} />}
    </span>
  );
};

// Аватар — в свой профиль
const AvatarBtn = ({ size }) => {
  const app = useApp();
  return (
    <button title={app.t.profile} aria-label={app.t.profile} onClick={() => app.go("profile", "me")} style={{
      width: size, height: size, borderRadius: "50%", background: "var(--acc)", color: "var(--acc-ink)",
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 600, flexShrink: 0,
      outline: app.route.page === "profile" && app.route.id === "me" ? "2px solid var(--hot)" : "none", outlineOffset: 3,
    }}>Л</button>
  );
};

// Телефон: когда заголовок страницы уезжает под шапку, его имя появляется в самой шапке,
// а на страницах с большой кнопкой «Слушать» — и маленькая её копия. barRef — сама шапка
const useScrolledTitle = (barRef) => {
  const app = useApp();
  const [sc, setSc] = React.useState({ edge: false, title: null, play: false });
  React.useEffect(() => {
    const m = barRef.current && barRef.current.closest(".main");
    if (!m) return;
    const h = () => {
      const bar = barRef.current.getBoundingClientRect();
      const h1 = m.querySelector("h1");
      const pb = m.querySelector(".playbig");
      const past = h1 && h1.getBoundingClientRect().bottom < bar.bottom - 4;
      const next = { edge: m.scrollTop > 2, title: past ? h1.textContent : null, play: !!(pb && pb.getBoundingClientRect().bottom < bar.bottom) };
      setSc(p => (p.edge === next.edge && p.title === next.title && p.play === next.play) ? p : next);
    };
    h();
    m.addEventListener("scroll", h, { passive: true });
    return () => m.removeEventListener("scroll", h);
  }, [app.route.page, app.route.id]);
  return sc;
};

// Телефон: на вкладках — логотип, внутри разделов — «Назад»; настройки — шестерёнкой
const TopBarPhone = () => {
  const app = useApp();
  const t = app.t;
  const barRef = React.useRef(null);
  const sc = useScrolledTitle(barRef);
  const isTab = MOB_TABS.some(([p]) => p === app.route.page);
  const playFromPage = () => { const b = barRef.current && barRef.current.closest(".main").querySelector(".playbig"); if (b) b.click(); };
  return (
    <div ref={barRef} className={"topbar" + (sc.edge ? " edge" : "")}>
      {!isTab && (
        <button className="iconbtn ring" style={{ width: 44, height: 44, flexShrink: 0 }} aria-label={t.back}
          onClick={() => app.history.length ? app.goBack() : app.go("home")}>
          <Ic d={ICONS.back} size={18} />
        </button>
      )}
      {/* Логотип и заголовок делят одно место: при прокрутке одно сменяет другое */}
      <div className={"tb-mid" + (sc.title ? " on" : "")}>
        {isTab && (
          <button className="tb-logo" onClick={() => app.go("home")} aria-label="Spotless">
            <span className="dots" style={{ fontSize: 20, letterSpacing: "0.02em" }}>SPOTLESS</span>
            <span className="hot-dot"></span>
          </button>
        )}
        <div className="tb-title" aria-hidden={!sc.title}>
          <span>{sc.title}</span>
          {sc.play && (
            <button className="tb-play" aria-label={t.play} onClick={playFromPage}><Ic d={ICONS.play} size={14} fill="currentColor" /></button>
          )}
        </div>
      </div>
      <BellBtn />
      <button className={"iconbtn" + (app.route.page === "settings" ? " lit" : "")} style={{ width: 44, height: 44 }} title={t.settings} aria-label={t.settings} onClick={() => app.go("settings")}>
        <Ic d={ICONS.gear} size={19} />
      </button>
      <AvatarBtn size={38} />
    </div>
  );
};

// Компьютер: назад/вперёд, поиск, колокольчик, аватар
const TopBarDesktop = () => {
  const app = useApp();
  const t = app.t;
  // ⌘K / Ctrl+K — к поиску: подсказка в поле обещает это сочетание. По e.code — работает и в русской раскладке
  const searchRef = React.useRef(null);
  React.useEffect(() => {
    const k = (e) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.code === "KeyK" && searchRef.current) { e.preventDefault(); searchRef.current.focus(); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  const toSearch = () => { if (app.route.page !== "search") app.go("search"); };
  return (
    <div className="topbar">
      <div className="tb-nav" style={{ display: "flex", gap: 8 }}>
        <button className="iconbtn ring" style={{ width: 40, height: 40, opacity: app.history.length ? 1 : 0.35 }} aria-label={t.back} onClick={app.goBack}>
          <Ic d={ICONS.back} size={17} />
        </button>
        <button className="iconbtn ring" style={{ width: 40, height: 40, opacity: app.future.length ? 1 : 0.35 }} aria-label={t.forward} onClick={app.goFwd}>
          <Ic d={ICONS.fwd} size={17} />
        </button>
      </div>
      <label className="tb-search" style={{
        flex: "0 1 440px", display: "flex", alignItems: "center", gap: 10, background: "var(--bg2)",
        borderRadius: 22, height: 44, padding: "0 8px 0 16px", marginLeft: 6, cursor: "text",
      }} onClick={toSearch}>
        <Ic d={ICONS.search} size={17} style={{ color: "var(--mut2)" }} />
        <input ref={searchRef} value={app.query} placeholder={t.searchPh} aria-label={t.search}
          onChange={(e) => { app.setQuery(e.target.value); toSearch(); }}
          style={{ flex: 1, minWidth: 0, background: "none", border: "none", outline: "none", color: "var(--text)", fontSize: 14 }} />
        <span className="mono tb-k" style={{ fontSize: 11, border: "1px solid var(--bg3)", borderRadius: 8, padding: "4px 8px", color: "var(--mut2)" }}>⌘K</span>
      </label>
      <div style={{ flex: 1 }}></div>
      <BellBtn />
      <AvatarBtn size={40} />
    </div>
  );
};

const TopBar = () => (useApp().phone ? <TopBarPhone /> : <TopBarDesktop />);

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
  // Каждая вкладка помнит, где вы остановились; повторный тап по открытой — плавно наверх
  const memo = React.useRef({});
  const tap = (p) => {
    const m = document.querySelector(".main");
    if (app.route.page === p) { if (m) m.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (m && MOB_TABS.some(([q]) => q === app.route.page)) memo.current[app.route.page] = m.scrollTop;
    buzz(5);
    app.go(p);
    const y = memo.current[p];
    if (y) requestAnimationFrame(() => requestAnimationFrame(() => { const mm = document.querySelector(".main"); if (mm) mm.scrollTop = y; }));
  };
  return (
    <nav className="mobnav" aria-label={t.sections}>
      {MOB_TABS.map(([p, ic]) => (
        <button key={p} className={"mn-item" + (active === p ? " active" : "")} aria-current={app.route.page === p ? "page" : undefined}
          onClick={() => tap(p)}>
          <Ic d={ICONS[ic]} size={22} />
          <span className="mn-label">{active === p && <span className="hot-dot"></span>}{p === "support" ? t.navSupport : t[p]}</span>
        </button>
      ))}
    </nav>
  );
};

Object.assign(window, { Shell, PageError, AppCrash, Sidebar, TopBar, MobileNav, BellBtn, AvatarBtn });
