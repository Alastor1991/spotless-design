// Spotless — страницы: Главная, Поиск, Медиатека.

const greetKey = () => {
  const h = new Date().getHours();
  if (h < 5) return "gnight";
  if (h < 12) return "gmorning";
  if (h < 18) return "gday";
  return "gevening";
};

// Распределение текущей суммы по артистам: доли из истории прослушиваний,
// сумма — та, что выбрал пользователь (меняется в разделе «Артистам»)
const splitNow = (monthly) => DB.supportSplit.map(s => ({ ...s, amount: Math.round(monthly * s.pct) / 100 }));

// Виджет «Вы остановились здесь»: обложка точечной матрицей + прогресс
const ContinueWidget = () => {
  const app = useApp();
  const t = app.t;
  const al = DB.albums.grunt;
  const ar = DB.artists[al.artist];
  const idx = 2;
  const tr = al.tracks[idx];
  const ids = al.tracks.map(x => x.id);
  const resume = () => { app.playContext(ids.slice(idx)); setTimeout(() => app.seekTo(0.62), 0); };
  return (
    <section className="widget b-wide cont-w" style={{ display: "flex", gap: 26, alignItems: "center" }}>
      <button onClick={() => app.go("album", al.id)} aria-label={al.title} style={{ flexShrink: 0 }}>
        <Cover art={al.id} hue={al.hue} glyph={true} size="clamp(110px, 17cqi, 236px)" style={{ "--gp": "9px", "--gr": "3.1px" }} />
      </button>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0, flex: 1, alignSelf: "stretch" }}>
        <span className="mlabel">{t.continueHere}</span>
        <button onClick={() => app.go("album", al.id)} style={{ textAlign: "left", fontSize: "clamp(28px, 3.4cqi, 40px)", letterSpacing: "-0.045em", lineHeight: 1, fontWeight: 400 }}>{al.title}</button>
        <span style={{ fontSize: 14, color: "var(--mut)" }}>{ar.name} · {t[al.type].toLowerCase()}, {al.year}</span>
        <span style={{ marginTop: "auto", display: "flex", alignItems: "baseline", gap: 10, fontSize: 14, minWidth: 0 }}>
          <span className="mono" style={{ fontSize: 11, color: "var(--mut2)" }}>{String(idx + 1).padStart(2, "0")}</span>
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tr.t}</span>
        </span>
        <DotBar pct={0.62} pitch={8} />
        <span className="mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--mut2)" }}><span>02:21</span><span>{tr.dur.padStart(5, "0")}</span></span>
        <span style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 2 }}>
          <button className="btn" style={{ padding: "0 22px 0 18px" }} onClick={resume}><Ic d={ICONS.play} size={14} fill="currentColor" />{t.continueBtn}</button>
          <PlusButton trackId={tr.id} size={44} className="ring" />
          <DonateButton target={{ kind: "album", id: al.id }} size={44} className="ring" />
        </span>
      </div>
    </section>
  );
};

// Виджет поддержки: сумма точечным шрифтом и точки по артистам
const SupportWidget = () => {
  const app = useApp();
  const t = app.t;
  const split = splitNow(app.monthly);
  const top = split.slice(0, 4);
  const rest = split.slice(4);
  const max = split[0].amount || 1;
  const restSum = rest.reduce((a, s) => a + s.amount, 0);
  const whole = Math.floor(app.monthly);
  const cents = Math.round((app.monthly - whole) * 100);
  const row = (key, name, amount, dim, onClick) => (
    <button key={key} onClick={onClick} style={{ display: "grid", gridTemplateColumns: "minmax(0, 96px) 1fr 40px", alignItems: "center", gap: 8, fontSize: 12, textAlign: "left", color: dim ? "var(--mut)" : "var(--text)" }}>
      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>
      <DotBar pct={amount / max} pitch={7} r={2.1} on={dim ? "var(--mut2)" : undefined} />
      <span className="mono" style={{ fontSize: 11, textAlign: "right", color: "var(--mut)" }}>{fmtMoney(amount, app.lang, true).slice(1)}</span>
    </button>
  );
  return (
    <section className="widget sup-w" style={{ display: "flex", flexDirection: "column", gap: 7, padding: "24px 22px 22px" }}>
      <button className="mlabel" style={{ textAlign: "left" }} onClick={() => app.go("support")}>{t.supWidget}</button>
      <button onClick={() => app.go("support")} aria-label={fmtMoney(app.monthly, app.lang)} style={{ display: "flex", alignItems: "baseline", gap: 3, margin: "6px 0 10px" }}>
        <span style={{ fontWeight: 300, fontSize: 38, color: "var(--mut)" }}>$</span>
        <span className="dots" style={{ fontSize: 78 }}>{whole}</span>
        <span className="dots" style={{ fontSize: 34, color: "var(--dot-off)" }}>{app.lang === "ru" ? "," : "."}{String(cents).padStart(2, "0")}</span>
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
            <span style={{ width: 38, height: 38, borderRadius: "50%", boxShadow: `inset 0 0 0 1.5px ${now ? "var(--hot)" : "var(--bg3)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{f.name[0]}</span>
            <span style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{f.name} <span className="mono" style={{ fontSize: 10, letterSpacing: "0.06em", color: "var(--mut2)", fontWeight: 400, textTransform: "uppercase" }}>· {now ? t.agoNow : t.ago(app.lang === "ru" ? f.ago : f.agoEn)}</span></span>
              <span style={{ fontSize: 12, color: "var(--mut)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.track} — {f.artist}</span>
            </span>
          </button>
        );
      })}
      <button className="btn ghost" style={{ marginTop: "auto" }} onClick={() => app.go("jam")}>{t.listenTogether}</button>
    </section>
  );
};

const PageHome = () => {
  const app = useApp();
  const t = app.t;
  const [chip, setChip] = React.useState("all");
  const recents = [
    { kind: "album", id: "salt" }, { kind: "playlist", id: "quiet" },
    { kind: "album", id: "hourglass" }, { kind: "artist", id: "lowtide" },
    { kind: "album", id: "seven" }, { kind: "playlist", id: "train" },
  ];
  const newRel = ["glass", "animal", "pole", "hourglass", "cassette", "salt"];
  const card = (r, i) => {
    if (r.kind === "playlist") {
      const pl = DB.playlists.find(p => p.id === r.id);
      return <MediaCard key={i} title={app.lang === "ru" ? pl.name : pl.nameEn} sub={`${t.plLabel} · ${app.playlistTracks(pl.id).length} ${t.tracksN}`} hue={pl.hue}
        onClick={() => app.go("playlist", pl.id)} onPlay={() => app.playContext(app.playlistTracks(pl.id))} ctx={{ kind: "playlist", id: pl.id }} />;
    }
    if (r.kind === "artist") {
      const ar = DB.artists[r.id];
      return <MediaCard key={i} title={ar.name} sub={t.artists.slice(0, -1)} hue={ar.hue} art={"ar:" + ar.id} round={true} onClick={() => app.go("artist", ar.id)}
        onPlay={() => app.playContext(Object.values(DB.albums).find(a => a.artist === r.id).tracks.map(x => x.id))} ctx={{ kind: "artist", id: ar.id }} />;
    }
    const al = DB.albums[r.id];
    return <MediaCard key={i} title={al.title} sub={DB.artists[al.artist].name} hue={al.hue} art={al.id}
      onClick={() => app.go("album", al.id)} onPlay={() => app.playContext(al.tracks.map(x => x.id))} ctx={{ kind: "album", id: al.id }} />;
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
          <div className="home-bento">
            <ContinueWidget />
            <SupportWidget />
            <FriendsWidget />
          </div>

          <section style={{ marginBottom: 34 }}>
            <div className="h-row">
              <h2>{t.recent}</h2>
              <button className="more" onClick={() => app.go("showall", "recent")}>{t.showAll}</button>
            </div>
            <div className="cardrow hscroll">{recents.map(card)}</div>
          </section>

          <section style={{ marginBottom: 34 }}>
            <div className="h-row">
              <h2>{t.newFromArtists}</h2>
              <button className="more" onClick={() => app.go("showall", "new")}>{t.showAll}</button>
            </div>
            <div className="cardrow hscroll">{newRel.map((id, i) => card({ kind: "album", id }, "n" + i))}</div>
          </section>

          <section>
            <div className="h-row">
              <h2>{t.madeForYou}</h2>
              <button className="more" onClick={() => app.go("showall", "mixes")}>{t.showAll}</button>
            </div>
            <div className="cardrow hscroll">
              {DB.mixes.map(m => (
                <MediaCard key={m.id} title={app.lang === "ru" ? m.name : m.nameEn} sub="spotless" hue={m.hue}
                  onClick={() => app.go("playlist", m.id)} onPlay={() => app.playContext(m.tracks)} ctx={{ kind: "playlist", id: m.id }} />
              ))}
            </div>
          </section>
        </React.Fragment>
      )}
    </div>
  );
};

// ---------- Поиск ----------
// [ключ жанра (DB.genres), подпись, тон]
const GENRES_RU = [["indie", "Инди", 25], ["electronic", "Электроника", 250], ["hiphop", "Хип-хоп", 320], ["rock", "Рок", 10], ["jazz", "Джаз", 60], ["classical", "Классика", 95], ["ambient", "Эмбиент", 180], ["pop", "Поп", 340], ["metal", "Метал", 270], ["folk", "Фолк", 130]];
const GENRES_EN = [["indie", "Indie", 25], ["electronic", "Electronic", 250], ["hiphop", "Hip-Hop", 320], ["rock", "Rock", 10], ["jazz", "Jazz", 60], ["classical", "Classical", 95], ["ambient", "Ambient", 180], ["pop", "Pop", 340], ["metal", "Metal", 270], ["folk", "Folk", 130]];

const PageSearch = () => {
  const app = useApp();
  const t = app.t;
  const q = app.query.trim().toLowerCase();
  // На телефоне поле поиска живёт на самой странице, а не в верхней панели
  const field = app.phone && (
    <label className="psearch">
      <Ic d={ICONS.search} size={18} style={{ color: "var(--mut2)" }} />
      <input value={app.query} placeholder={t.searchPh} aria-label={t.search} onChange={(e) => app.setQuery(e.target.value)} />
      {app.query && <button className="iconbtn" style={{ width: 36, height: 36 }} aria-label={app.lang === "ru" ? "Очистить" : "Clear"} onClick={() => app.setQuery("")}><Ic d={ICONS.x} size={16} /></button>}
    </label>
  );

  if (!q) {
    return (
      <div className="fade-in" data-screen-label="Поиск — пусто">
        <h1 style={{ fontSize: 34, fontWeight: 800, margin: "18px 0 18px" }}>{t.search}</h1>
        {field}
        <div className="mlabel" style={{ marginBottom: 12 }}>{t.recentSearches}</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 34, flexWrap: "wrap" }}>
          {["Молоко и мёд", "Salt & Signal", "Velvet Antenna"].map(s => (
            <button key={s} className="chip" onClick={() => app.setQuery(s)}>{s}</button>
          ))}
        </div>
        <div className="mlabel" style={{ marginBottom: 14 }}>{t.browseAll}</div>
        <div className="genre-grid">
          {(app.lang === "ru" ? GENRES_RU : GENRES_EN).map(([key, g, hue]) => (
            <button key={key} onClick={() => app.go("genre", key)} style={{
              height: 110, borderRadius: 22, padding: "16px 18px", position: "relative", overflow: "hidden",
              background: `radial-gradient(circle, oklch(var(--dot-l) 0.13 ${hue}) 0 1.6px, transparent 2px) 0 0 / 9px 9px, var(--bg2)`,
              display: "flex", alignItems: "flex-end", textAlign: "left",
            }}>
              <span style={{ fontSize: 18, fontWeight: 400, letterSpacing: "-0.02em", color: "var(--text)", background: "var(--bg2)", padding: "4px 10px 4px 0", borderRadius: 6 }}>{g}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const trks = Object.values(DB.trackIndex).filter(tr => tr.t.toLowerCase().includes(q) || DB.artists[tr.artist].name.toLowerCase().includes(q)).slice(0, 4);
  const arts = Object.values(DB.artists).filter(a => a.name.toLowerCase().includes(q));
  const albs = Object.values(DB.albums).filter(a => a.title.toLowerCase().includes(q) || DB.artists[a.artist].name.toLowerCase().includes(q));
  const top = arts[0] || (trks[0] && DB.artists[trks[0].artist]);
  // Пустые разделы не показываем (раньше висел заголовок «Треки» без строк), а если не нашлось
  // ничего — так и говорим, вместо пустой страницы
  const nothing = !top && !trks.length && !arts.length && !albs.length;

  return (
    <div className="fade-in" data-screen-label="Поиск — результаты">
      {field && <div style={{ paddingTop: 12 }}>{field}</div>}
      {nothing && <p style={{ padding: "56px 0", textAlign: "center", fontSize: 15, color: "var(--mut)", overflowWrap: "anywhere" }}>{t.searchNothing(app.query.trim())}</p>}
      {(top || trks.length > 0) && <div className="search-grid">
        {top && (
          <section>
            <div className="h-row"><h2>{t.topResult}</h2></div>
            <button onClick={() => app.go("artist", top.id)} className="widget" style={{
              display: "block", width: "100%", textAlign: "left", transition: "background 0.14s",
            }}>
              <Cover art={"ar:" + top.id} hue={top.hue} size={96} round={true} />
              <div style={{ fontSize: 30, fontWeight: 400, letterSpacing: "-0.04em", margin: "18px 0 8px" }}>{top.name}</div>
              <span className="mlabel">{t.artists.slice(0, -1)} · {top.listeners.toLocaleString(app.lang === "ru" ? "ru" : "en")} {t.listenersShort}</span>
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
            {arts.map(a => <MediaCard key={a.id} title={a.name} sub={`${a.listeners.toLocaleString(app.lang === "ru" ? "ru" : "en")} ${t.monthlyListeners}`} hue={a.hue} art={"ar:" + a.id} round={true} onClick={() => app.go("artist", a.id)} ctx={{ kind: "artist", id: a.id }} />)}
          </div>
        </section>
      )}
      {albs.length > 0 && (
        <section>
          <div className="h-row"><h2>{t.albums}</h2></div>
          <div className="cardrow">
            {albs.map(a => <MediaCard key={a.id} title={a.title} sub={`${a.year} · ${DB.artists[a.artist].name}`} hue={a.hue} art={a.id} onClick={() => app.go("album", a.id)} onPlay={() => app.playContext(a.tracks.map(x => x.id))} ctx={{ kind: "album", id: a.id }} />)}
          </div>
        </section>
      )}
    </div>
  );
};

// ---------- Медиатека ----------
const PageLibrary = () => {
  const app = useApp();
  const t = app.t;
  const [filter, setFilter] = React.useState("all");
  const [sort, setSort] = React.useState("recent");
  const items = [];
  // «Скачано» — по настоящим загрузкам: раньше у «Любимых», «Тихих часов» и «Для поезда» галочка
  // стояла всегда, хотя на странице плейлиста кнопка предлагала «Скачать»
  const allDl = (ids) => ids.length > 0 && ids.every(id => app.downloads[id] === "done");
  const liked = app.likedIds();
  items.push({ kind: "pl", id: "__liked", name: t.likedTracks, hue: 95, sub: `${t.filterPl.slice(0, -1)} · ${liked.length} ${t.tracksN}`, pinned: true, dl: allDl(liked) });
  app.allPlaylists.forEach(pl => items.push({
    kind: "pl", id: pl.id, name: app.lang === "ru" ? pl.name : pl.nameEn, hue: pl.hue,
    sub: `${app.playlistTracks(pl.id).length} ${t.tracksN}` + (pl.collab ? ` · ${t.collab}` : ""),
    dl: allDl(app.playlistTracks(pl.id)),
  }));
  app.followed.forEach(id => {
    const a = DB.artists[id];
    items.push({ kind: "ar", id, name: a.name, hue: a.hue, art: "ar:" + id, round: true, sub: t.artists.slice(0, -1) });
  });
  ["grunt", "salt", "hourglass"].forEach(id => {
    const a = DB.albums[id];
    const dl = allDl(a.tracks.map(tr => tr.id));
    items.push({ kind: "al", id, name: a.title, hue: a.hue, art: id, sub: `${t[a.type]} · ${DB.artists[a.artist].name}`, dl });
  });
  let visible = items.filter(it => filter === "all" ? true : filter === "dl" ? it.dl : it.kind === filter);
  if (sort === "az") visible = [...visible].sort((a, b) => a.name.localeCompare(b.name, app.lang === "ru" ? "ru" : "en"));
  const open = (it) => {
    if (it.id === "__liked") return app.go("liked");
    if (it.kind === "ar") return app.go("artist", it.id);
    if (it.kind === "al") return app.go("album", it.id);
    return app.go("playlist", it.id);
  };
  const playIt = (it) => {
    if (it.id === "__liked") return app.playContext(app.likedIds());
    if (it.kind === "ar") return app.playContext(Object.values(DB.albums).find(a => a.artist === it.id).tracks.map(x => x.id));
    if (it.kind === "al") return app.playContext(DB.albums[it.id].tracks.map(x => x.id));
    return app.playContext(app.playlistTracks(it.id));
  };
  const ctxFor = (it) => {
    if (it.id === "__liked") return undefined;
    return { kind: it.kind === "ar" ? "artist" : it.kind === "al" ? "album" : "playlist", id: it.id };
  };
  return (
    <div className="fade-in" data-screen-label="Медиатека">
      <h1 style={{ fontSize: 34, fontWeight: 800, margin: "18px 0 18px" }}>{t.library}</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 22, flexWrap: "wrap" }}>
        {[["all", t.filterAll], ["pl", t.filterPl], ["ar", t.filterAr], ["al", t.filterAl], ["dl", t.filterDl]].map(([k, label]) => (
          <button key={k} className={"chip" + (filter === k ? " on" : "")} aria-pressed={filter === k} onClick={() => setFilter(k)}>
            {k === "dl" && <Ic d={ICONS.downloadCircle} size={14} style={{ display: "inline-block", verticalAlign: "-2px", marginRight: 6 }} />}
            {label}
          </button>
        ))}
        <div style={{ flex: 1 }}></div>
        <button className="mlabel" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--mut)", padding: "8px 6px" }}
          onClick={() => setSort(sort === "recent" ? "az" : "recent")}>
          <Ic d={ICONS.clock} size={14} />{sort === "recent" ? t.sortRecent : t.sortAZ}
        </button>
        <button className="btn ghost" style={{ padding: "0 16px", fontSize: 13 }} onClick={() => app.openCreatePl()}>
          <Ic d={ICONS.plus} size={15} />{t.newPlaylist}
        </button>
      </div>
      <div className="cardrow" style={{ rowGap: 8 }}>
        {visible.map((it, i) => (
          <div key={it.kind + ":" + it.id} style={{ position: "relative" }}>
            {it.pinned && <Ic d={ICONS.pin} size={13} style={{ position: "absolute", top: 18, right: 18, color: "var(--text)", zIndex: 2 }} />}
            {it.dl && <span title={t.downloaded} style={{ position: "absolute", top: 17, left: 17, zIndex: 2, width: 18, height: 18, borderRadius: "50%", background: "var(--acc)", color: "var(--acc-ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ic d={ICONS.check} size={11} sw={3} />
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
                onClick={() => open(it)} onPlay={() => playIt(it)} ctx={ctxFor(it)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { PageHome, PageSearch, PageLibrary, GENRES_RU, GENRES_EN, splitNow });
