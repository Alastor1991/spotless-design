// Spotless — страницы: Главная, Поиск, Медиатека.

const greetKey = () => {
  const h = new Date().getHours();
  if (h < 5) return "gnight";
  if (h < 12) return "gmorning";
  if (h < 18) return "gday";
  return "gevening";
};

const PageHome = () => {
  const app = useApp();
  const t = app.t;
  const [chip, setChip] = React.useState("all");
  const recents = [
    { kind: "playlist", id: "quiet" }, { kind: "artist", id: "lowtide" },
    { kind: "album", id: "grunt" }, { kind: "artist", id: "velvet" },
    { kind: "playlist", id: "train" }, { kind: "album", id: "seven" },
  ];
  const newRel = ["glass", "animal", "pole", "hourglass", "cassette", "salt"];
  return (
    <div className="fade-in" data-screen-label="Главная">
      <div style={{ display: "flex", gap: 8, margin: "18px 0 22px" }}>
        {[["all", t.all], ["music", t.music], ["pod", t.podcasts]].map(([k, label]) => (
          <button key={k} className={"chip" + (chip === k ? " on" : "")} onClick={() => setChip(k)}>{label}</button>
        ))}
      </div>

      {chip === "pod" ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "var(--mut)" }}>
          <Ic d={ICONS.mic} size={36} style={{ margin: "0 auto 14px", opacity: 0.6 }} />
          <p style={{ fontSize: 15 }}>{t.podcastsSoon}</p>
        </div>
      ) : (
        <React.Fragment>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 20 }}>{t[greetKey()]}, Лиза</h1>

          {/* Лента друзей */}
          <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
            {DB.friends.map(f => (
              <button key={f.id} onClick={() => app.go("profile", f.id)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 16px 8px 9px",
                background: "var(--bg1)", borderRadius: 99, border: "1px solid var(--line)",
              }}>
                <Cover hue={f.hue} size={30} round={true} label="" />
                <span style={{ textAlign: "left" }}>
                  <span style={{ display: "block", fontSize: 12.5, fontWeight: 700 }}>{f.name} <span style={{ color: "var(--mut)", fontWeight: 500 }}>· {app.lang === "ru" ? f.ago : f.agoEn}</span></span>
                  <span style={{ display: "block", fontSize: 12, color: "var(--mut)" }}>{f.track} — {f.artist}</span>
                </span>
              </button>
            ))}
            <button className="iconbtn" style={{ alignSelf: "center" }} title="Jam" onClick={() => app.go("jam")}>
              <Ic d={ICONS.jam} size={19} />
            </button>
          </div>

          <section style={{ marginBottom: 30 }}>
            <div className="h-row">
              <h2>{t.recent}</h2>
              <button className="more" onClick={() => app.go("showall", "recent")}>{t.showAll}</button>
            </div>
            <div className="cardrow">
              {recents.map((r, i) => {
                if (r.kind === "playlist") {
                  const pl = DB.playlists.find(p => p.id === r.id);
                  return <MediaCard key={i} title={app.lang === "ru" ? pl.name : pl.nameEn} sub={`${t.plLabel} · ${app.playlistTracks(pl.id).length} ${t.tracksN}`} hue={pl.hue}
                    onClick={() => app.go("playlist", pl.id)} onPlay={() => app.playContext(app.playlistTracks(pl.id))} ctx={{ kind: "playlist", id: pl.id }} />;
                }
                if (r.kind === "artist") {
                  const ar = DB.artists[r.id];
                  return <MediaCard key={i} title={ar.name} sub={t.artists.slice(0, -1)} hue={ar.hue} round={true} onClick={() => app.go("artist", ar.id)}
                    onPlay={() => app.playContext(Object.values(DB.albums).find(a => a.artist === r.id).tracks.map(x => x.id))} ctx={{ kind: "artist", id: ar.id }} />;
                }
                const al = DB.albums[r.id];
                return <MediaCard key={i} title={al.title} sub={`${t[al.type]} · ${DB.artists[al.artist].name}`} hue={al.hue}
                  onClick={() => app.go("album", al.id)} onPlay={() => app.playContext(al.tracks.map(x => x.id))} ctx={{ kind: "album", id: al.id }} />;
              })}
            </div>
          </section>

          <section style={{ marginBottom: 30 }}>
            <div className="h-row">
              <h2>{t.newFromArtists}</h2>
              <button className="more" onClick={() => app.go("showall", "new")}>{t.showAll}</button>
            </div>
            <div className="cardrow">
              {newRel.map(id => {
                const al = DB.albums[id];
                return <MediaCard key={id} title={al.title} sub={`${t[al.type]} · ${DB.artists[al.artist].name}`} hue={al.hue}
                  onClick={() => app.go("album", al.id)} onPlay={() => app.playContext(al.tracks.map(x => x.id))} ctx={{ kind: "album", id: al.id }} />;
              })}
            </div>
          </section>

          <section>
            <div className="h-row">
              <h2>{t.madeForYou}</h2>
              <button className="more" onClick={() => app.go("showall", "mixes")}>{t.showAll}</button>
            </div>
            <div className="cardrow">
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

  if (!q) {
    return (
      <div className="fade-in" data-screen-label="Поиск — пусто">
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "26px 0 18px" }}>{t.recentSearches}</h1>
        <div style={{ display: "flex", gap: 10, marginBottom: 34 }}>
          {["Молоко и мёд", "Salt & Signal", "Velvet Antenna"].map(s => (
            <button key={s} className="chip" onClick={() => app.setQuery(s)}>{s}</button>
          ))}
        </div>
        <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 14 }}>{t.browseAll}</h2>
        <div className="genre-grid">
          {(app.lang === "ru" ? GENRES_RU : GENRES_EN).map(([key, g, hue]) => (
            <button key={key} onClick={() => app.go("genre", key)} style={{
              height: 96, borderRadius: "var(--r)", padding: "14px 16px",
              background: `linear-gradient(135deg, oklch(var(--cover-l1) 0.06 ${hue}), oklch(var(--cover-l2) 0.06 ${hue + 40}))`,
              display: "flex", alignItems: "flex-end", fontSize: 16.5, fontWeight: 800, color: "var(--text)", textAlign: "left",
            }}>{g}</button>
          ))}
        </div>
      </div>
    );
  }

  const trks = Object.values(DB.trackIndex).filter(tr => tr.t.toLowerCase().includes(q) || DB.artists[tr.artist].name.toLowerCase().includes(q)).slice(0, 4);
  const arts = Object.values(DB.artists).filter(a => a.name.toLowerCase().includes(q));
  const albs = Object.values(DB.albums).filter(a => a.title.toLowerCase().includes(q) || DB.artists[a.artist].name.toLowerCase().includes(q));
  const top = arts[0] || (trks[0] && DB.artists[trks[0].artist]);

  return (
    <div className="fade-in" data-screen-label="Поиск — результаты">
      <div className="search-grid">
        {top && (
          <section>
            <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 14 }}>{t.topResult}</h2>
            <button onClick={() => app.go("artist", top.id)} style={{
              display: "block", width: "100%", textAlign: "left", background: "var(--bg1)",
              borderRadius: "var(--r)", padding: 22, transition: "background 0.14s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg2)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--bg1)"}>
              <Cover hue={top.hue} size={92} round={true} label="" />
              <div style={{ fontSize: 26, fontWeight: 800, margin: "16px 0 6px" }}>{top.name}</div>
              <span className="chip" style={{ padding: "5px 13px", fontSize: 12 }}>{t.artists.slice(0, -1)}</span>
            </button>
          </section>
        )}
        <section style={{ minWidth: 0 }}>
          <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 14 }}>{t.tracks}</h2>
          <div>
            {trks.map((tr, i) => <TrackRow key={tr.id} trackId={tr.id} num={i + 1} />)}
          </div>
        </section>
      </div>
      {arts.length > 0 && (
        <section style={{ marginBottom: 30 }}>
          <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 14 }}>{t.artists}</h2>
          <div className="cardrow">
            {arts.map(a => <MediaCard key={a.id} title={a.name} sub={`${a.listeners.toLocaleString(app.lang === "ru" ? "ru" : "en")} ${t.monthlyListeners}`} hue={a.hue} round={true} onClick={() => app.go("artist", a.id)} ctx={{ kind: "artist", id: a.id }} />)}
          </div>
        </section>
      )}
      {albs.length > 0 && (
        <section>
          <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 14 }}>{t.albums}</h2>
          <div className="cardrow">
            {albs.map(a => <MediaCard key={a.id} title={a.title} sub={`${a.year} · ${DB.artists[a.artist].name}`} hue={a.hue} onClick={() => app.go("album", a.id)} onPlay={() => app.playContext(a.tracks.map(x => x.id))} ctx={{ kind: "album", id: a.id }} />)}
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
  const likedN = app.likedIds().length;
  items.push({ kind: "pl", id: "__liked", name: t.likedTracks, hue: 95, sub: `${t.filterPl.slice(0, -1)} · ${likedN} ${t.tracksN}`, pinned: true, dl: true });
  app.allPlaylists.forEach(pl => items.push({
    kind: "pl", id: pl.id, name: app.lang === "ru" ? pl.name : pl.nameEn, hue: pl.hue,
    sub: `${app.playlistTracks(pl.id).length} ${t.tracksN}` + (pl.collab ? ` · ${t.collab}` : ""),
    dl: pl.id === "quiet" || pl.id === "train",
  }));
  app.followed.forEach(id => {
    const a = DB.artists[id];
    items.push({ kind: "ar", id, name: a.name, hue: a.hue, round: true, sub: t.artists.slice(0, -1) });
  });
  ["grunt", "salt", "hourglass"].forEach(id => {
    const a = DB.albums[id];
    const dl = a.tracks.every(tr => app.downloads[tr.id] === "done");
    items.push({ kind: "al", id, name: a.title, hue: a.hue, sub: `${t[a.type]} · ${DB.artists[a.artist].name}`, dl });
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
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "18px 0 22px", flexWrap: "wrap" }}>
        {[["all", t.filterAll], ["pl", t.filterPl], ["ar", t.filterAr], ["al", t.filterAl], ["dl", t.filterDl]].map(([k, label]) => (
          <button key={k} className={"chip" + (filter === k ? " on" : "")} onClick={() => setFilter(k)}>
            {k === "dl" && <Ic d={ICONS.downloadCircle} size={14} style={{ display: "inline-block", verticalAlign: "-2px", marginRight: 6 }} />}
            {label}
          </button>
        ))}
        <div style={{ flex: 1 }}></div>
        <button className="more" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--mut)", fontWeight: 600 }}
          onClick={() => setSort(sort === "recent" ? "az" : "recent")}>
          <Ic d={ICONS.clock} size={15} />{sort === "recent" ? t.sortRecent : t.sortAZ}
        </button>
        <button className="btn ghost" style={{ padding: "8px 16px", fontSize: 13 }} onClick={() => app.openCreatePl()}>
          <Ic d={ICONS.plus} size={15} />{t.newPlaylist}
        </button>
      </div>
      <div className="cardrow" style={{ rowGap: 8 }}>
        {visible.map((it, i) => (
          <div key={it.id || i} style={{ position: "relative" }}>
            {it.pinned && <Ic d={ICONS.pin} size={13} style={{ position: "absolute", top: 18, right: 18, color: "var(--acc)", zIndex: 2 }} />}
            {it.dl && <span title={t.downloaded} style={{ position: "absolute", top: 17, left: 17, zIndex: 2, color: "oklch(0.68 0.13 150)" }}>
              <Ic d={ICONS.downloadCircle} size={15} />
            </span>}
            <MediaCard title={it.name} sub={it.sub} hue={it.hue} round={it.round}
              onClick={() => open(it)} onPlay={() => playIt(it)} ctx={ctxFor(it)} />
          </div>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { PageHome, PageSearch, PageLibrary, GENRES_RU, GENRES_EN });
