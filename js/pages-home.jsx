// Spotless — страницы: Главная, Поиск, Медиатека.

const greetKey = () => {
  const h = new Date().getHours();
  if (h < 5) return "gnight";
  if (h < 12) return "gmorning";
  if (h < 18) return "gday";
  return "gevening";
};

// Виджет «Вы остановились здесь»: обложка точечной матрицей + прогресс
const ContinueWidget = () => {
  const app = useApp();
  const kind = useStyle();
  const t = app.t;
  const al = DB.albums.grunt;
  const ar = DB.artists[al.artist];
  const idx = 2;
  const tr = al.tracks[idx];
  const resume = () => { app.playContext(albumIds(al).slice(idx)); setTimeout(() => app.seekTo(0.62), 0); };
  return (
    <section className="widget b-wide cont-w">
      <button onClick={() => app.go("album", al.id)} aria-label={al.title} style={{ flexShrink: 0 }}>
        <Cover art={al.id} hue={al.hue} glyph={true} size="var(--cw-cover)" style={{ "--gp": "9px", "--gr": "3.1px" }} />
      </button>
      <div className="cw-col">
        <span className="mlabel">{t.continueHere}</span>
        <button onClick={() => app.go("album", al.id)} className="ty-reg" style={{ textAlign: "left", fontSize: "clamp(28px, 3.4cqi, 40px)", "--ty-ls": "-0.045em", lineHeight: 1 }}>{al.title}</button>
        <span style={{ fontSize: 14, color: "var(--mut)" }}>{ar.name} · {t[al.type].toLowerCase()}, {al.year}</span>
        <span style={{ marginTop: "auto", display: "flex", alignItems: "baseline", gap: 10, fontSize: 14, minWidth: 0 }}>
          <span className="mono" style={{ fontSize: 11, color: "var(--mut2)" }}>{zpad(idx + 1, 2, kind)}</span>
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tr.t}</span>
        </span>
        <DotBar pct={0.62} pitch={11} r={3} />
        <span className="mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--mut2)" }}><span>{zpad("2:21", 5, kind)}</span><span>{zpad(tr.dur, 5, kind)}</span></span>
        <span className="cw-acts">
          <button className="btn" style={{ padding: "0 22px 0 18px" }} onClick={resume}><Ic d={ICONS.play} size={14} fill="currentColor" />{t.continueBtn}</button>
          <PlusButton trackId={tr.id} size={44} className="ring" />
          <DonateButton target={{ kind: "album", id: al.id }} size={44} className="ring" />
        </span>
      </div>
    </section>
  );
};

// Виджет «Кому идут ваши деньги»: сумма точечным шрифтом и точки по артистам
const SupportWidget = () => {
  const app = useApp();
  const t = app.t;
  const m = app.money;
  const split = splitNow(app.monthly);
  const top = split.slice(0, 4);
  const rest = split.slice(4);
  // Полосы — от самой крупной доли или от всей суммы (настройка «Полосы распределения денег»)
  const max = (app.settings.dotScale === "total" ? app.monthly : split[0].amount) || 1;
  const restSum = rest.reduce((a, s) => a + s.amount, 0);
  const { whole, cents, sep } = m.parts(app.monthly);
  // Крупная сумма вписывается в ширину виджета: раньше большая своя сумма уходила за край
  const sumRef = React.useRef(null);
  const k = useFitScale(sumRef, [app.monthly, m]);
  // Столбец сумм — по самой длинной из них (11px моноширинного ≈ 6,7px на знак), не уже 40px
  const numW = Math.max(40, Math.ceil(Math.max(...[...top.map(s => s.amount), restSum].map(a => m.num(a, true).length)) * 6.7));
  const row = (key, name, amount, dim, onClick) => (
    <button key={key} onClick={onClick} style={{ display: "grid", gridTemplateColumns: `minmax(0, 96px) 1fr ${numW}px`, alignItems: "center", gap: 8, fontSize: 12, textAlign: "left", color: dim ? "var(--mut)" : "var(--text)" }}>
      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>
      <DotBar pct={amount / max} pitch={8} r={2.6} on={dim ? "var(--mut2)" : undefined} />
      <span className="mono" style={{ fontSize: 11, textAlign: "right", color: "var(--mut)" }}>{m.num(amount, true)}</span>
    </button>
  );
  return (
    <section className="widget sup-w" style={{ display: "flex", flexDirection: "column", gap: 7, padding: "24px 22px 22px" }}>
      <button className="mlabel" style={{ textAlign: "left" }} onClick={() => app.go("support")}>{t.supWidget}</button>
      <button onClick={() => app.go("support")} aria-label={m.fmt(app.monthly)} style={{ display: "flex", alignItems: "baseline", margin: "6px 0 10px" }}>
        <span ref={sumRef} style={{ display: "inline-flex", alignItems: "baseline", gap: 3 }}>
          <span className="dots dots-sign" style={{ fontSize: 78 * k, color: "var(--mut2)" }}>{m.sign}</span>
          <span className="dots" style={{ fontSize: 78 * k }}>{whole}</span>
          <span className="dots" style={{ fontSize: 40 * k, color: "var(--mut2)" }}>{sep}{cents}</span>
        </span>
      </button>
      {top.map(s => row(s.artist, DB.artists[s.artist].name, s.amount, false, () => app.go("artist", s.artist)))}
      {rest.length > 0 && row("rest", t.andMoreArtists(rest.length), restSum, true, () => app.go("support"))}
      <span style={{ marginTop: "auto", paddingTop: 8, fontSize: 12, color: "var(--mut)" }}>{t.feeZero}</span>
    </section>
  );
};

const FriendsWidget = () => {
  const app = useApp();
  const t = app.t;
  return (
    <section className="widget fr-w" style={{ display: "flex", flexDirection: "column", gap: 14, padding: "24px 22px 22px" }}>
      <span className="mlabel" style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="hot-dot"></span>{t.friendsListen}</span>
      {DB.friends.map(f => {
        const now = f.ago === "сейчас";
        return (
          <button key={f.id} onClick={() => app.go("profile", f.id)} style={{ display: "flex", gap: 12, alignItems: "center", textAlign: "left", minWidth: 0 }}>
            <span className={"friend-av" + (now ? " is-now" : "")} style={{ "--fh": f.hue }}>{f.name[0]}</span>
            <span style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{f.name} <span className={"friend-when" + (now ? " is-now" : "")}>· {now ? t.agoNow : t.ago(app.lang === "ru" ? f.ago : f.agoEn)}</span></span>
              <span style={{ fontSize: 12, color: "var(--mut)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.track} — {f.artist}</span>
            </span>
          </button>
        );
      })}
      <button className="btn ghost" style={{ marginTop: "auto" }} onClick={() => app.go("jam")}>{t.listenTogether}</button>
    </section>
  );
};

// Ряд карточек с заголовком и «Показать все»
const CardShelf = ({ title, more, last, children }) => {
  const app = useApp();
  return (
    <section style={last ? undefined : { marginBottom: 34 }}>
      <div className="h-row">
        <h2>{title}</h2>
        <button className="more" onClick={() => app.go("showall", more)}>{app.t.showAll}</button>
      </div>
      <div className="cardrow hscroll">{children}</div>
    </section>
  );
};

// Недавно слушали (мок)
const HOME_RECENT = [
  { kind: "album", id: "salt" }, { kind: "playlist", id: "quiet" },
  { kind: "album", id: "hourglass" }, { kind: "artist", id: "lowtide" },
  { kind: "album", id: "seven" }, { kind: "playlist", id: "train" },
];
const HOME_NEW = ["glass", "animal", "pole", "hourglass", "cassette", "salt"];

const PageHome = () => {
  const app = useApp();
  const t = app.t;
  const [chip, setChip] = React.useState("all");
  const card = (r, key) => {
    if (r.kind === "playlist") {
      const pl = DB.playlists.find(p => p.id === r.id);
      return <MediaCard key={key} {...playlistCard(app, pl, `${t.plLabel} · ${t.nTracks(app.playlistTracks(pl.id).length)}`)} />;
    }
    if (r.kind === "artist") {
      const ar = DB.artists[r.id];
      return <MediaCard key={key} {...artistCard(app, ar, t.artist, () => app.playContext(albumIds(artistAlbums(ar.id)[0])))} />;
    }
    const al = DB.albums[r.id];
    return <MediaCard key={key} {...albumCard(app, al, DB.artists[al.artist].name)} />;
  };
  return (
    <div className="fade-in" data-screen-label="Главная">
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", margin: "14px 0 26px" }}>
        <h1 style={{ fontSize: "clamp(34px, 5cqi, 52px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 0.95 }}>{t[greetKey()]}, Лиза</h1>
        <div role="tablist" style={{ display: "flex", gap: 4 }}>
          {[["all", t.all], ["music", t.music], ["pod", t.podcasts]].map(([k, label]) => (
            <button key={k} role="tab" aria-selected={chip === k} className={"chip" + (chip === k ? " on" : "")} onClick={() => setChip(k)}>{label}</button>
          ))}
        </div>
      </div>

      {chip === "pod" ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "var(--mut)" }}>
          <Ic d={ICONS.mic} size={36} style={{ margin: "0 auto 14px", opacity: 0.6 }} />
          <p style={{ fontSize: 15 }}>{t.podcastsSoon}</p>
        </div>
      ) : (
        <React.Fragment>
          {/* Виджеты можно убрать в настройках («Внешний вид»): тогда на главной только подборки */}
          {app.settings.homeWidgets && (
            <div className="home-bento">
              <ContinueWidget />
              <SupportWidget />
              <FriendsWidget />
            </div>
          )}
          <CardShelf title={t.recent} more="recent">{HOME_RECENT.map((r, i) => card(r, i))}</CardShelf>
          <CardShelf title={t.newFromArtists} more="new">{HOME_NEW.map((id, i) => card({ kind: "album", id }, "n" + i))}</CardShelf>
          <CardShelf title={t.madeForYou} more="mixes" last={true}>
            {DB.mixes.map(mx => <MediaCard key={mx.id} {...playlistCard(app, mx, "spotless", mx.tracks)} />)}
          </CardShelf>
        </React.Fragment>
      )}
    </div>
  );
};

// ---------- Поиск ----------
// [ключ жанра (DB.genres), подпись, тон]
const GENRES_RU = [["indie", "Инди", 25], ["electronic", "Электроника", 250], ["hiphop", "Хип-хоп", 320], ["rock", "Рок", 10], ["jazz", "Джаз", 60], ["classical", "Классика", 95], ["ambient", "Эмбиент", 180], ["pop", "Поп", 340], ["metal", "Метал", 270], ["folk", "Фолк", 130]];
const GENRES_EN = [["indie", "Indie", 25], ["electronic", "Electronic", 250], ["hiphop", "Hip-Hop", 320], ["rock", "Rock", 10], ["jazz", "Jazz", 60], ["classical", "Classical", 95], ["ambient", "Ambient", 180], ["pop", "Pop", 340], ["metal", "Metal", 270], ["folk", "Folk", 130]];

// На телефоне поле поиска живёт на самой странице, а не в верхней панели
const SearchField = () => {
  const app = useApp();
  const t = app.t;
  return (
    <label className="psearch">
      <Ic d={ICONS.search} size={18} style={{ color: "var(--mut2)" }} />
      <input value={app.query} placeholder={t.searchPh} aria-label={t.search} onChange={(e) => app.setQuery(e.target.value)} />
      {app.query && <button className="iconbtn" style={{ width: 36, height: 36 }} aria-label={t.clear} onClick={() => app.setQuery("")}><Ic d={ICONS.x} size={16} /></button>}
    </label>
  );
};

// Пустой запрос: недавние поиски и жанры
const SearchStart = () => {
  const app = useApp();
  const t = app.t;
  return (
    <React.Fragment>
      <div className="mlabel" style={{ marginBottom: 12 }}>{t.recentSearches}</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 34, flexWrap: "wrap" }}>
        {["Молоко и мёд", "Salt & Signal", "Velvet Antenna"].map(s => (
          <button key={s} className="chip" onClick={() => app.setQuery(s)}>{s}</button>
        ))}
      </div>
      <div className="mlabel" style={{ marginBottom: 14 }}>{t.browseAll}</div>
      <div className="genre-grid">
        {(app.lang === "ru" ? GENRES_RU : GENRES_EN).map(([key, g, hue]) => (
          <button key={key} className="genre-tile" onClick={() => app.go("genre", key)} style={{ "--gh": hue }}>
            <span className="genre-name">{g}</span>
          </button>
        ))}
      </div>
    </React.Fragment>
  );
};

// Результаты: лучший результат, треки, артисты, альбомы. q — запрос в нижнем регистре
const SearchResults = ({ q }) => {
  const app = useApp();
  const t = app.t;
  const has = (s) => s.toLowerCase().includes(q);
  const trks = Object.values(DB.trackIndex).filter(tr => has(tr.t) || has(DB.artists[tr.artist].name)).slice(0, 4);
  const arts = Object.values(DB.artists).filter(a => has(a.name));
  const albs = Object.values(DB.albums).filter(a => has(a.title) || has(DB.artists[a.artist].name));
  const top = arts[0] || (trks[0] && DB.artists[trks[0].artist]);
  // Пустые разделы не показываем (раньше висел заголовок «Треки» без строк), а если не нашлось
  // ничего — так и говорим, вместо пустой страницы
  const nothing = !top && !trks.length && !arts.length && !albs.length;
  return (
    <React.Fragment>
      {nothing && <p style={{ padding: "56px 0", textAlign: "center", fontSize: 15, color: "var(--mut)", overflowWrap: "anywhere" }}>{t.searchNothing(app.query.trim())}</p>}
      {(top || trks.length > 0) && <div className="search-grid">
        {top && (
          <section>
            <div className="h-row"><h2>{t.topResult}</h2></div>
            <button onClick={() => app.go("artist", top.id)} className="widget" style={{
              display: "block", width: "100%", textAlign: "left", transition: "background 0.14s",
            }}>
              <Cover art={"ar:" + top.id} hue={top.hue} size={96} round={true} />
              <div className="ty-reg" style={{ fontSize: 30, margin: "18px 0 8px" }}>{top.name}</div>
              <span className="mlabel">{t.artist} · {top.listeners.toLocaleString(app.lang)} {t.listenersShort}</span>
            </button>
          </section>
        )}
        {trks.length > 0 && (
          <section style={{ minWidth: 0 }}>
            <div className="h-row"><h2>{t.tracks}</h2></div>
            <div>
              {trks.map((tr, i) => <TrackRow key={tr.id} trackId={tr.id} num={i + 1} />)}
            </div>
          </section>
        )}
      </div>}
      {arts.length > 0 && (
        <section style={{ marginBottom: 30 }}>
          <div className="h-row"><h2>{t.artists}</h2></div>
          <div className="cardrow">
            {arts.map(a => <MediaCard key={a.id} {...artistCard(app, a, listenersLine(app, a))} />)}
          </div>
        </section>
      )}
      {albs.length > 0 && (
        <section>
          <div className="h-row"><h2>{t.albums}</h2></div>
          <div className="cardrow">
            {albs.map(a => <MediaCard key={a.id} {...albumCard(app, a, `${a.year} · ${DB.artists[a.artist].name}`)} />)}
          </div>
        </section>
      )}
    </React.Fragment>
  );
};

// Поле поиска на телефоне стоит в одном и том же месте страницы и без запроса, и с ним. Раньше
// после первой буквы страница перестраивалась, поле создавалось заново — фокус пропадал,
// клавиатура закрывалась, и дальше буквы не набирались
const PageSearch = () => {
  const app = useApp();
  const q = app.query.trim().toLowerCase();
  return (
    <div className="fade-in" data-screen-label={q ? "Поиск — результаты" : "Поиск — пусто"}>
      {!q && <h1 style={{ fontSize: 34, fontWeight: 800, margin: "18px 0 18px" }}>{app.t.search}</h1>}
      {app.phone && <div style={q ? { paddingTop: 12 } : undefined}><SearchField /></div>}
      {q ? <SearchResults q={q} /> : <SearchStart />}
    </div>
  );
};

// ---------- Медиатека ----------
// Всё сохранённое одним списком: любимые, плейлисты, подписки, альбомы (мок).
// «Скачано» — по настоящим загрузкам: раньше у «Любимых», «Тихих часов» и «Для поезда» галочка
// стояла всегда, хотя на странице плейлиста кнопка предлагала «Скачать»
const libraryItems = (app) => {
  const t = app.t;
  const allDl = (ids) => ids.length > 0 && ids.every(id => app.downloads[id] === "done");
  const liked = app.likedIds();
  const items = [{ kind: "pl", id: "__liked", name: t.likedTracks, hue: 95, sub: `${t.plLabel} · ${t.nTracks(liked.length)}`, pinned: true, dl: allDl(liked), tracks: liked }];
  app.allPlaylists.forEach(pl => {
    const tracks = app.playlistTracks(pl.id);
    items.push({
      kind: "pl", id: pl.id, name: plName(app.lang, pl), hue: pl.hue,
      sub: t.nTracks(tracks.length) + (pl.collab ? ` · ${t.collab}` : ""), dl: allDl(tracks), tracks,
    });
  });
  app.followed.forEach(id => {
    const a = DB.artists[id];
    items.push({ kind: "ar", id, name: a.name, hue: a.hue, art: "ar:" + id, round: true, sub: t.artist, tracks: albumIds(artistAlbums(id)[0]) });
  });
  ["grunt", "salt", "hourglass"].forEach(id => {
    const a = DB.albums[id];
    items.push({ kind: "al", id, name: a.title, hue: a.hue, art: id, sub: `${t[a.type]} · ${DB.artists[a.artist].name}`, dl: allDl(albumIds(a)), tracks: albumIds(a) });
  });
  return items;
};
const LIB_PAGE = { pl: "playlist", ar: "artist", al: "album" };

const PageLibrary = () => {
  const app = useApp();
  const t = app.t;
  const [filter, setFilter] = React.useState("all");
  const [sort, setSort] = React.useState("recent");
  let visible = libraryItems(app).filter(it => filter === "all" ? true : filter === "dl" ? it.dl : it.kind === filter);
  if (sort === "az") visible = [...visible].sort((a, b) => a.name.localeCompare(b.name, app.lang));
  const open = (it) => (it.id === "__liked" ? app.go("liked") : app.go(LIB_PAGE[it.kind], it.id));
  return (
    <div className="fade-in" data-screen-label="Медиатека">
      <h1 style={{ fontSize: 34, fontWeight: 800, margin: "18px 0 18px" }}>{t.library}</h1>
      <div className="lib-bar">
        <div className="lib-chips">
          {[["all", t.filterAll], ["pl", t.filterPl], ["ar", t.filterAr], ["al", t.filterAl], ["dl", t.filterDl]].map(([k, label]) => (
            <button key={k} className={"chip" + (filter === k ? " on" : "")} aria-pressed={filter === k} onClick={() => setFilter(k)}>
              {k === "dl" && <Ic d={ICONS.downloadCircle} size={14} style={{ display: "inline-block", verticalAlign: "-2px", marginRight: 6 }} />}
              {label}
            </button>
          ))}
        </div>
        <div className="lib-tools">
          <button className="mlabel" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--mut)", padding: "8px 6px" }}
            onClick={() => setSort(sort === "recent" ? "az" : "recent")}>
            <Ic d={ICONS.clock} size={14} />{sort === "recent" ? t.sortRecent : t.sortAZ}
          </button>
          <button className="btn ghost" style={{ padding: "0 16px", fontSize: 13 }} onClick={() => app.openCreatePl()}>
            <Ic d={ICONS.plus} size={15} />{t.newPlaylist}
          </button>
        </div>
      </div>
      <div className="cardrow" style={{ rowGap: 8 }}>
        {visible.map((it) => (
          <div key={it.kind + ":" + it.id} style={{ position: "relative" }}>
            {it.pinned && <Ic d={ICONS.pin} size={13} style={{ position: "absolute", top: 18, right: 18, color: "var(--text)", zIndex: 2 }} />}
            {it.dl && <span title={t.downloaded} style={{ position: "absolute", top: 17, left: 17, zIndex: 2, width: 18, height: 18, borderRadius: "50%", background: "var(--acc)", color: "var(--acc-ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ic d={ICONS.downloadCircle.slice(1)} size={13} sw={1.4} />
            </span>}
            {it.id === "__liked" ? (
              <button className="card" onClick={() => open(it)}>
                <span style={{ aspectRatio: "1", width: "100%", borderRadius: 16, background: "var(--hot)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--hot-ink)" }}>
                  <Ic d={ICONS.heart} size={48} fill="currentColor" />
                </span>
                <span style={{ minWidth: 0 }}><span className="t" style={{ display: "block" }}>{it.name}</span><span className="s" style={{ display: "block" }}>{it.sub}</span></span>
              </button>
            ) : (
              <MediaCard title={it.name} sub={it.sub} hue={it.hue} art={it.art} round={it.round}
                onClick={() => open(it)} onPlay={() => app.playContext(it.tracks)} ctx={{ kind: LIB_PAGE[it.kind], id: it.id }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { PageHome, PageSearch, PageLibrary, GENRES_RU, GENRES_EN, CardShelf });
