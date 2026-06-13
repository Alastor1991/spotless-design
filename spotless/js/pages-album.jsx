// Spotless — страницы альбома/релиза и артиста.

const totalMin = (al) => {
  let s = 0;
  al.tracks.forEach(tr => { const [m, ss] = tr.dur.split(":").map(Number); s += m * 60 + ss; });
  return Math.round(s / 60);
};

const PageAlbum = ({ id }) => {
  const app = useApp();
  const t = app.t;
  const al = DB.albums[id];
  const ar = DB.artists[al.artist];
  const moreAlbums = Object.values(DB.albums).filter(a => a.artist === al.artist && a.id !== id);
  return (
    <div className="fade-in" data-screen-label={"Альбом: " + al.title}>
      {/* Шапка */}
      <header className="hero">
        <Cover hue={al.hue} size="clamp(150px, 16cqi, 210px)" label="album art" style={{ boxShadow: "var(--island-shadow)" }} />
        <div style={{ minWidth: 0, paddingBottom: 4 }}>
          <div className="sec-label" style={{ marginBottom: 10 }}>{t[al.type]} · {al.year}</div>
          <h1 style={{ fontSize: "clamp(30px, 5cqi, 52px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.02, marginBottom: 14, textWrap: "balance" }}>{al.title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--mut)" }}>
            <Cover hue={ar.hue} size={26} round={true} label="" />
            <button style={{ fontWeight: 700, color: "var(--text)" }} onClick={() => app.go("artist", ar.id)}>{ar.name}</button>
            <span>· {al.tracks.length} {t.tracksN} · {totalMin(al)} {t.min}</span>
          </div>
        </div>
      </header>

      {/* Действия */}
      <div className="actions">
        <button className="playbig" onClick={() => app.playContext(al.tracks.map(x => x.id))}>
          <Ic d={ICONS.play} size={24} fill="currentColor" />
        </button>
        <span style={{ display: "inline-flex" }}><ShuffleBtn size={42} icon={19} /></span>
        <PlusButton trackId={al.tracks[0].id} size={42} />
        <DLButton size={42} albumId={id} />
        <button className="btn ghost" style={{ padding: "10px 20px" }} onClick={() => app.openDonate({ kind: "album", id: al.id })}>
          <Ic d={ICONS.dollar} size={15} />{t.supportRelease}
        </button>
        <button className="iconbtn" style={{ width: 42, height: 42 }} title={t.share} onClick={() => app.toast(t.copied)}><Ic d={ICONS.shareIc} size={18} /></button>
        <button className="iconbtn" style={{ width: 42, height: 42 }} title={t.more}
          onClick={(e) => app.openCtxAt(e.currentTarget, { kind: "album", id })}>
          <Ic d={ICONS.more} size={20} sw={3.4} />
        </button>
      </div>

      {/* Список треков */}
      <div className="trow-head">
        <span className="sec-label" style={{ textAlign: "right" }}>#</span>
        <span></span>
        <span className="sec-label">{t.tracks}</span>
        <span className="sec-label alb">{t.plays}</span>
        <span></span>
        <Ic d={ICONS.clock} size={15} style={{ color: "var(--mut)", justifySelf: "end" }} />
      </div>
      <div style={{ marginBottom: 34 }}>
        {al.tracks.map((tr, i) => <TrackRow key={tr.id} trackId={tr.id} num={i + 1} showPlays={true} />)}
      </div>

      <p style={{ fontSize: 12.5, color: "var(--mut)", marginBottom: 36 }}>
        {al.year} · {ar.name}. {app.lang === "ru" ? "Права принадлежат артисту." : "All rights belong to the artist."}
      </p>

      {moreAlbums.length > 0 && (
        <section>
          <div className="h-row">
            <h2>{app.lang === "ru" ? `Ещё от ${ar.name}` : `More by ${ar.name}`}</h2>
            <button className="more" onClick={() => app.go("artist", ar.id)}>{t.showAll}</button>
          </div>
          <div className="cardrow">
            {moreAlbums.map(a => (
              <MediaCard key={a.id} title={a.title} sub={`${t[a.type]} · ${a.year}`} hue={a.hue}
                onClick={() => app.go("album", a.id)} onPlay={() => app.playContext(a.tracks.map(x => x.id))} ctx={{ kind: "album", id: a.id }} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

// ---------- Артист ----------
const PageArtist = ({ id }) => {
  const app = useApp();
  const t = app.t;
  const ar = DB.artists[id];
  const discs = Object.values(DB.albums).filter(a => a.artist === id);
  const top = Object.values(DB.trackIndex).filter(tr => tr.artist === id)
    .sort((a, b) => parseInt(b.plays.replace(/\D/g, "")) - parseInt(a.plays.replace(/\D/g, ""))).slice(0, 5);
  const similar = Object.values(DB.artists).filter(a => a.id !== id).slice(0, 6);
  const following = app.followed.includes(id);
  return (
    <div className="fade-in" data-screen-label={"Артист: " + ar.name}>
      <header className="hero" style={{ alignItems: "center", paddingBottom: 24 }}>
        <Cover hue={ar.hue} size="clamp(140px, 14cqi, 190px)" round={true} label="artist photo" style={{ boxShadow: "var(--island-shadow)" }} />
        <div style={{ minWidth: 0 }}>
          <div className="sec-label" style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
            <Ic d={ICONS.sparkle} size={14} style={{ color: "var(--acc)" }} />
            {app.lang === "ru" ? "Артист" : "Artist"}
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5.5cqi, 56px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 12 }}>{ar.name}</h1>
          <div style={{ fontSize: 14.5, color: "var(--mut)", fontWeight: 600 }}>
            {ar.listeners.toLocaleString(app.lang === "ru" ? "ru" : "en")} {t.monthlyListeners}
          </div>
          {/* Скромная строчка прозрачности */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 7, fontSize: 13, color: "var(--mut)", flexWrap: "wrap" }}>
            <Ic d={ICONS.wallet} size={14} style={{ opacity: 0.8 }} />
            <span>
              {ar.incomeHidden ? t.incomeLineHidden(ar.avgPerListener.toFixed(2)) : t.incomeLine(ar.avgPerListener.toFixed(2), ar.totalMonth.toLocaleString("en"))}
            </span>
            <button style={{ color: "var(--mut)", textDecoration: "underline", textUnderlineOffset: 3, fontSize: 12.5 }}
              onClick={() => app.toast(app.lang === "ru" ? "Открытые данные распределения — без посредников" : "Open distribution data — no middlemen")}>
              {t.incomeWhy}
            </button>
          </div>
        </div>
      </header>

      <div className="actions" style={{ marginBottom: 26 }}>
        <button className="playbig" onClick={() => app.playContext(top.map(tr => tr.id))}>
          <Ic d={ICONS.play} size={24} fill="currentColor" />
        </button>
        <button className={"btn " + (following ? "outline" : "ghost")} style={{ padding: "10px 22px" }} onClick={() => app.toggleFollow(id)}>
          {following && <Ic d={ICONS.check} size={15} />}{following ? t.following : t.follow}
        </button>
        <button className="btn ghost" style={{ padding: "10px 20px" }} onClick={() => app.openDonate({ kind: "artist", id })}>
          <Ic d={ICONS.dollar} size={15} />{t.supportArtist}
        </button>
        <button className="iconbtn" style={{ width: 42, height: 42 }} title={t.share} onClick={() => app.toast(t.copied)}><Ic d={ICONS.shareIc} size={18} /></button>
        <button className="iconbtn" style={{ width: 42, height: 42 }} title={t.more}
          onClick={(e) => app.openCtxAt(e.currentTarget, { kind: "artist", id })}>
          <Ic d={ICONS.more} size={20} sw={3.4} />
        </button>
      </div>

      <div className="two-col" style={{ marginBottom: 34 }}>
        <section style={{ minWidth: 0 }}>
          <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 12 }}>{t.topTracks}</h2>
          {top.map((tr, i) => <TrackRow key={tr.id} trackId={tr.id} num={i + 1} showPlays={true} />)}
        </section>
        <section>
          <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 12 }}>{t.about}</h2>
          <div style={{ background: "var(--bg1)", borderRadius: "var(--r)", padding: 20 }}>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--text)" }}>{ar.about}</p>
            <div style={{ display: "flex", gap: 18, marginTop: 16, fontSize: 13, color: "var(--mut)" }}>
              <span><b style={{ color: "var(--text)" }}>{ar.followers.toLocaleString(app.lang === "ru" ? "ru" : "en")}</b> {app.lang === "ru" ? "подписчиков" : "followers"}</span>
              <span><b style={{ color: "var(--text)" }}>{discs.length}</b> {app.lang === "ru" ? "релиза" : "releases"}</span>
            </div>
          </div>
        </section>
      </div>

      <section style={{ marginBottom: 34 }}>
        <div className="h-row">
          <h2>{t.discography}</h2>
          <button className="more" onClick={() => app.go("showall", "disc:" + id)}>{t.showAll}</button>
        </div>
        <div className="cardrow">
          {discs.map(a => (
            <MediaCard key={a.id} title={a.title} sub={`${t[a.type]} · ${a.year}`} hue={a.hue}
              onClick={() => app.go("album", a.id)} onPlay={() => app.playContext(a.tracks.map(x => x.id))} ctx={{ kind: "album", id: a.id }} />
          ))}
        </div>
      </section>

      <section>
        <div className="h-row">
          <h2>{t.similar}</h2>
          <button className="more" onClick={() => app.go("showall", "similar:" + id)}>{t.showAll}</button>
        </div>
        <div className="cardrow">
          {similar.map(a => (
            <MediaCard key={a.id} title={a.name} sub={t.artists.slice(0, -1)} hue={a.hue} round={true}
              onClick={() => app.go("artist", a.id)} ctx={{ kind: "artist", id: a.id }} />
          ))}
        </div>
      </section>
    </div>
  );
};

Object.assign(window, { PageAlbum, PageArtist });
