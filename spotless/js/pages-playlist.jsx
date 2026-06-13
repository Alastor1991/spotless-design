// Spotless — страницы плейлиста/микса, «Любимые треки», «Показать все», жанра.

const plTotalMin = (ids) => {
  let s = 0;
  ids.forEach(id => { const [m, ss] = DB.trackIndex[id].dur.split(":").map(Number); s += m * 60 + ss; });
  return Math.round(s / 60);
};

const PagePlaylist = ({ id }) => {
  const app = useApp();
  const t = app.t;
  const meta = app.findPl(id);
  if (!meta) return <PageLibrary />;
  const ids = app.playlistTracks(id);
  const isMix = meta.kind === "mix";
  const owner = meta.owner ? DB.friends.find(f => f.id === meta.owner) : null;
  const name = app.lang === "ru" ? meta.name : (meta.nameEn || meta.name);
  const ownerName = isMix ? "spotless" : owner ? owner.name : "Лиза";
  const canEdit = !!meta.byMe;
  return (
    <div className="fade-in" data-screen-label={"Плейлист: " + name}>
      <header className="hero">
        <Cover hue={meta.hue} size="clamp(150px, 16cqi, 210px)" label="cover" style={{ boxShadow: "var(--island-shadow)" }} />
        <div style={{ minWidth: 0, paddingBottom: 4 }}>
          <div className="sec-label" style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
            {isMix ? t.mixLabel : t.plLabel} · {ownerName}
            {meta.collab && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--acc)" }}>
                <Ic d={ICONS.users} size={13} />{t.collab}
              </span>
            )}
          </div>
          <h1 style={{ fontSize: "clamp(30px, 5cqi, 52px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.02, marginBottom: 14, textWrap: "balance" }}>{name}</h1>
          <div style={{ fontSize: 14, color: "var(--mut)" }}>
            {ids.length} {t.tracksN}{ids.length > 0 ? ` · ${plTotalMin(ids)} ${t.min}` : ""}
          </div>
        </div>
      </header>

      <div className="actions">
        <button className="playbig" onClick={() => app.playContext(ids)} style={{ opacity: ids.length ? 1 : 0.4 }}>
          <Ic d={ICONS.play} size={24} fill="currentColor" />
        </button>
        <span style={{ display: "inline-flex" }}><ShuffleBtn size={42} icon={19} /></span>
        {ids.length > 0 && <DLButton size={42} listIds={ids} />}
        <button className="iconbtn" style={{ width: 42, height: 42 }} title={t.share} onClick={() => app.toast(t.copied)}><Ic d={ICONS.shareIc} size={18} /></button>
        <button className="iconbtn" style={{ width: 42, height: 42 }} title={t.more}
          onClick={(e) => app.openCtxAt(e.currentTarget, { kind: "playlist", id })}>
          <Ic d={ICONS.more} size={20} sw={3.4} />
        </button>
      </div>

      {ids.length === 0 ? (
        <div style={{ padding: "54px 0", textAlign: "center", color: "var(--mut)" }}>
          <Ic d={ICONS.plus} size={32} style={{ margin: "0 auto 14px", opacity: 0.55 }} />
          <p style={{ fontSize: 14.5, maxWidth: 380, margin: "0 auto", lineHeight: 1.6, textWrap: "pretty" }}>{t.plEmpty}</p>
        </div>
      ) : (
        <React.Fragment>
          <div className="trow-head">
            <span className="sec-label" style={{ textAlign: "right" }}>#</span>
            <span></span>
            <span className="sec-label">{t.tracks}</span>
            <span className="sec-label alb">{t.albums}</span>
            <span></span>
            <Ic d={ICONS.clock} size={15} style={{ color: "var(--mut)", justifySelf: "end" }} />
          </div>
          <div style={{ marginBottom: 34 }}>
            {ids.map((tid, i) => <TrackRow key={tid + i} trackId={tid} num={i + 1} plId={canEdit ? id : undefined} />)}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

// ---------- Любимые треки ----------
const PageLiked = () => {
  const app = useApp();
  const t = app.t;
  const ids = app.likedIds();
  return (
    <div className="fade-in" data-screen-label="Любимые треки">
      <header className="hero">
        <div style={{
          width: "clamp(150px, 16cqi, 210px)", aspectRatio: "1", borderRadius: "calc(var(--r) - 6px)",
          background: "linear-gradient(135deg, oklch(var(--cover-l1) 0.09 95), oklch(var(--cover-l2) 0.09 145))",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          boxShadow: "var(--island-shadow)",
        }}>
          <Ic d={ICONS.heart} size={64} fill="currentColor" style={{ color: "var(--acc)" }} />
        </div>
        <div style={{ minWidth: 0, paddingBottom: 4 }}>
          <div className="sec-label" style={{ marginBottom: 10 }}>{t.plLabel} · Лиза</div>
          <h1 style={{ fontSize: "clamp(30px, 5cqi, 52px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.02, marginBottom: 14 }}>{t.likedTracks}</h1>
          <div style={{ fontSize: 14, color: "var(--mut)" }}>{ids.length} {t.tracksN} · {plTotalMin(ids)} {t.min}</div>
        </div>
      </header>

      <div className="actions">
        <button className="playbig" onClick={() => app.playContext(ids)}>
          <Ic d={ICONS.play} size={24} fill="currentColor" />
        </button>
        <span style={{ display: "inline-flex" }}><ShuffleBtn size={42} icon={19} /></span>
        <DLButton size={42} listIds={ids} />
        <button className="iconbtn" style={{ width: 42, height: 42 }} title={t.share} onClick={() => app.toast(t.copied)}><Ic d={ICONS.shareIc} size={18} /></button>
      </div>

      <div className="trow-head">
        <span className="sec-label" style={{ textAlign: "right" }}>#</span>
        <span></span>
        <span className="sec-label">{t.tracks}</span>
        <span className="sec-label alb">{t.albums}</span>
        <span></span>
        <Ic d={ICONS.clock} size={15} style={{ color: "var(--mut)", justifySelf: "end" }} />
      </div>
      <div style={{ marginBottom: 34 }}>
        {ids.map((tid, i) => <TrackRow key={tid} trackId={tid} num={i + 1} />)}
      </div>
    </div>
  );
};

// ---------- «Показать все» ----------
const PageShowAll = ({ id }) => {
  const app = useApp();
  const t = app.t;
  const [key, arg] = (id || "").split(":");
  let title = t.showAll;
  let cards = [];

  if (key === "recent") {
    title = t.recent;
    const recents = [
      { kind: "playlist", id: "quiet" }, { kind: "artist", id: "lowtide" },
      { kind: "album", id: "grunt" }, { kind: "artist", id: "velvet" },
      { kind: "playlist", id: "train" }, { kind: "album", id: "seven" },
      { kind: "album", id: "salt" }, { kind: "artist", id: "bruno" },
      { kind: "playlist", id: "kitchen" }, { kind: "album", id: "pole" },
    ];
    cards = recents.map(r => {
      if (r.kind === "playlist") {
        const pl = DB.playlists.find(p => p.id === r.id);
        return { title: app.lang === "ru" ? pl.name : pl.nameEn, sub: `${app.playlistTracks(pl.id).length} ${t.tracksN}`, hue: pl.hue, onClick: () => app.go("playlist", pl.id), onPlay: () => app.playContext(app.playlistTracks(pl.id)), ctx: { kind: "playlist", id: pl.id } };
      }
      if (r.kind === "artist") {
        const ar = DB.artists[r.id];
        return { title: ar.name, sub: t.artists.slice(0, -1), hue: ar.hue, round: true, onClick: () => app.go("artist", ar.id), ctx: { kind: "artist", id: ar.id } };
      }
      const al = DB.albums[r.id];
      return { title: al.title, sub: `${t[al.type]} · ${DB.artists[al.artist].name}`, hue: al.hue, onClick: () => app.go("album", al.id), onPlay: () => app.playContext(al.tracks.map(x => x.id)), ctx: { kind: "album", id: al.id } };
    });
  } else if (key === "new") {
    title = t.newFromArtists;
    cards = ["glass", "animal", "pole", "hourglass", "cassette", "salt", "seven", "grunt"].map(aid => {
      const al = DB.albums[aid];
      return { title: al.title, sub: `${t[al.type]} · ${DB.artists[al.artist].name}`, hue: al.hue, onClick: () => app.go("album", al.id), onPlay: () => app.playContext(al.tracks.map(x => x.id)), ctx: { kind: "album", id: al.id } };
    });
  } else if (key === "mixes") {
    title = t.madeForYou;
    cards = DB.mixes.map(m => ({
      title: app.lang === "ru" ? m.name : m.nameEn, sub: "spotless", hue: m.hue,
      onClick: () => app.go("playlist", m.id), onPlay: () => app.playContext(m.tracks), ctx: { kind: "playlist", id: m.id },
    }));
  } else if (key === "disc") {
    const ar = DB.artists[arg];
    title = `${t.discography} — ${ar.name}`;
    cards = Object.values(DB.albums).filter(a => a.artist === arg).map(al => ({
      title: al.title, sub: `${t[al.type]} · ${al.year}`, hue: al.hue,
      onClick: () => app.go("album", al.id), onPlay: () => app.playContext(al.tracks.map(x => x.id)), ctx: { kind: "album", id: al.id },
    }));
  } else if (key === "similar") {
    const ar = DB.artists[arg];
    title = `${t.similar} — ${ar.name}`;
    cards = Object.values(DB.artists).filter(a => a.id !== arg).map(a => ({
      title: a.name, sub: `${a.listeners.toLocaleString(app.lang === "ru" ? "ru" : "en")} ${t.monthlyListeners}`, hue: a.hue, round: true,
      onClick: () => app.go("artist", a.id), ctx: { kind: "artist", id: a.id },
    }));
  }

  return (
    <div className="fade-in" data-screen-label={"Показать все: " + title}>
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "30px 0 20px" }}>{title}</h1>
      <div className="cardrow">
        {cards.map((c, i) => <MediaCard key={i} {...c} />)}
      </div>
    </div>
  );
};

// ---------- Жанр ----------
const PageGenre = ({ id }) => {
  const app = useApp();
  const t = app.t;
  const list = app.lang === "ru" ? GENRES_RU : GENRES_EN;
  const entry = list.find(g => g[0] === id);
  const label = entry ? entry[1] : id;
  const hue = entry ? entry[2] : 60;
  const g = DB.genres[id] || { artists: [] };
  const artists = g.artists.map(aid => DB.artists[aid]);
  const albums = Object.values(DB.albums).filter(a => g.artists.includes(a.artist));
  const topTracks = Object.values(DB.trackIndex).filter(tr => g.artists.includes(tr.artist))
    .sort((a, b) => parseInt(b.plays.replace(/\D/g, "")) - parseInt(a.plays.replace(/\D/g, ""))).slice(0, 5);
  const fallback = Object.values(DB.albums).slice(0, 6);

  return (
    <div className="fade-in" data-screen-label={"Жанр: " + label}>
      <header style={{
        margin: "26px 0 28px", borderRadius: "var(--r)", padding: "42px 34px",
        background: `linear-gradient(135deg, oklch(var(--cover-l1) 0.06 ${hue}), oklch(var(--cover-l2) 0.06 ${hue + 40}))`,
      }}>
        <h1 style={{ fontSize: "clamp(32px, 5cqi, 48px)", fontWeight: 800, letterSpacing: "-0.03em" }}>{label}</h1>
      </header>

      {artists.length === 0 ? (
        <React.Fragment>
          <p style={{ fontSize: 14.5, color: "var(--mut)", marginBottom: 20, lineHeight: 1.6 }}>{t.genreGrow}</p>
          <div className="cardrow">
            {fallback.map(al => (
              <MediaCard key={al.id} title={al.title} sub={`${t[al.type]} · ${DB.artists[al.artist].name}`} hue={al.hue}
                onClick={() => app.go("album", al.id)} onPlay={() => app.playContext(al.tracks.map(x => x.id))}
                ctx={{ kind: "album", id: al.id }} />
            ))}
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <section style={{ marginBottom: 30 }}>
            <div className="h-row"><h2>{t.artists}</h2></div>
            <div className="cardrow">
              {artists.map(a => (
                <MediaCard key={a.id} title={a.name} sub={`${a.listeners.toLocaleString(app.lang === "ru" ? "ru" : "en")} ${t.monthlyListeners}`}
                  hue={a.hue} round={true} onClick={() => app.go("artist", a.id)} ctx={{ kind: "artist", id: a.id }} />
              ))}
            </div>
          </section>
          <section style={{ marginBottom: 30 }}>
            <div className="h-row"><h2>{t.albums}</h2></div>
            <div className="cardrow">
              {albums.map(al => (
                <MediaCard key={al.id} title={al.title} sub={`${t[al.type]} · ${DB.artists[al.artist].name}`} hue={al.hue}
                  onClick={() => app.go("album", al.id)} onPlay={() => app.playContext(al.tracks.map(x => x.id))}
                  ctx={{ kind: "album", id: al.id }} />
              ))}
            </div>
          </section>
          <section>
            <div className="h-row"><h2>{t.tracks}</h2></div>
            {topTracks.map((tr, i) => <TrackRow key={tr.id} trackId={tr.id} num={i + 1} showPlays={true} />)}
          </section>
        </React.Fragment>
      )}
    </div>
  );
};

Object.assign(window, { PagePlaylist, PageLiked, PageShowAll, PageGenre });
