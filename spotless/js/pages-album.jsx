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
  if (!al) return <PageHome />; // такого релиза нет (старая ссылка) — не падаем
  const ar = DB.artists[al.artist];
  const ids = al.tracks.map(x => x.id);
  const dlN = ids.filter(x => app.downloads[x] === "done").length;
  const moreAlbums = Object.values(DB.albums).filter(a => a.artist === al.artist && a.id !== id);
  return (
    <div className="fade-in" data-screen-label={"Альбом: " + al.title}>
      {/* Шапка */}
      <header className="hero">
        <Cover art={al.id} hue={al.hue} size="clamp(150px, 20cqi, 264px)" radius={24} />
        <div style={{ minWidth: 0, flex: "1 1 320px", paddingBottom: 4 }}>
          <div className="mlabel" style={{ marginBottom: 14 }}>{t[al.type]} · {al.year} · {al.tracks.length} {t.tracksN} · {totalMin(al)} {t.min}</div>
          <h1 style={{ fontSize: "clamp(44px, 9cqi, 128px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 0.88, marginBottom: 18, textWrap: "balance", overflowWrap: "anywhere" }}>{al.title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--mut)", flexWrap: "wrap" }}>
            <Cover art={"ar:" + ar.id} hue={ar.hue} size={28} round={true} />
            <button style={{ fontSize: 16, color: "var(--text)" }} onClick={() => app.go("artist", ar.id)}>{ar.name}</button>
            <span className="mlabel" style={{ letterSpacing: "0.08em" }}>·</span>
            <span className="mlabel" style={{ letterSpacing: "0.08em" }}>{t.incomeAvgShort(fmtMoney(ar.avgPerListener, app.lang, true))}</span>
          </div>
        </div>
      </header>

      {/* Действия */}
      <div className="actions">
        <button className="playbig" aria-label={t.play} onClick={() => app.playContext(ids)}>
          <Ic d={ICONS.play} size={22} fill="currentColor" />
        </button>
        <span className="iconbtn ring" style={{ width: 48, height: 48, padding: 0 }}><ShuffleBtn size={48} icon={19} /></span>
        {/* Плюсик релиза — весь релиз в плейлист (раньше он работал только с первым треком) */}
        <PlusButton trackIds={ids} size={48} className="ring" />
        <span className="btn ghost" style={{ padding: "0 16px 0 8px", minHeight: 48, gap: 4, cursor: "default" }}>
          <DLButton size={34} albumId={id} />
          <span className="mono" style={{ fontSize: 12 }} aria-label={app.lang === "ru" ? `Скачано ${dlN} из ${ids.length}` : `${dlN} of ${ids.length} downloaded`}>{dlN}/{ids.length}</span>
        </span>
        <button className="btn ghost" style={{ padding: "0 20px", minHeight: 48 }} onClick={() => app.openDonate({ kind: "album", id: al.id })}>
          <span className="mono">$</span>{t.supportRelease}
        </button>
        <button className="iconbtn ring" style={{ width: 48, height: 48 }} title={t.share} aria-label={t.share} onClick={() => app.toast(t.copied)}><Ic d={ICONS.shareIc} size={18} /></button>
        <button className="iconbtn ring" style={{ width: 48, height: 48 }} title={t.more} aria-label={t.more}
          onClick={(e) => app.openCtxAt(e.currentTarget, { kind: "album", id })}>
          <Ic d={ICONS.more} size={20} sw={3.4} />
        </button>
      </div>

      {/* Список треков */}
      <div className="trow-head nocover">
        <span className="mlabel">#</span>
        <span className="mlabel">{t.tracks}</span>
        <span className="mlabel alb" style={{ textAlign: "right" }}>{t.plays}</span>
        <span></span>
        <span className="mlabel" style={{ textAlign: "right" }}>{app.lang === "ru" ? "Время" : "Time"}</span>
      </div>
      <div style={{ marginBottom: 30 }}>
        {al.tracks.map((tr, i) => <TrackRow key={tr.id} trackId={tr.id} num={i + 1} showPlays={true} noCover={true} />)}
      </div>

      <p className="mlabel" style={{ marginBottom: 40, letterSpacing: "0.08em" }}>
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
              <MediaCard key={a.id} title={a.title} sub={`${t[a.type]} · ${a.year}`} hue={a.hue} art={a.id}
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
  if (!ar) return <PageHome />;
  const discs = Object.values(DB.albums).filter(a => a.artist === id);
  const top = Object.values(DB.trackIndex).filter(tr => tr.artist === id)
    .sort((a, b) => parseInt(b.plays.replace(/\D/g, "")) - parseInt(a.plays.replace(/\D/g, ""))).slice(0, 5);
  const similar = Object.values(DB.artists).filter(a => a.id !== id).slice(0, 6);
  const following = app.followed.includes(id);
  const avg = fmtMoney(ar.avgPerListener, app.lang, true);
  const total = ar.totalMonth != null ? "$" + ar.totalMonth.toLocaleString(app.lang === "ru" ? "ru" : "en") : null;
  const mine = supportFor(id);
  return (
    <div className="fade-in" data-screen-label={"Артист: " + ar.name}>
      <header className="hero" style={{ alignItems: "center", paddingBottom: 24 }}>
        <Cover art={"ar:" + ar.id} hue={ar.hue} size="clamp(140px, 18cqi, 220px)" round={true} />
        <div style={{ minWidth: 0, flex: "1 1 320px" }}>
          <div className="mlabel" style={{ marginBottom: 14 }}>
            {app.lang === "ru" ? "Артист" : "Artist"} · {ar.listeners.toLocaleString(app.lang === "ru" ? "ru" : "en")} {t.monthlyListeners}
          </div>
          <h1 style={{ fontSize: "clamp(40px, 8cqi, 112px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 0.9, marginBottom: 18, overflowWrap: "anywhere" }}>{ar.name}</h1>
          {/* Скромная строчка прозрачности */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--mut)", flexWrap: "wrap", lineHeight: 1.5 }}>
            <span>{ar.incomeHidden ? t.incomeLineHidden(avg.slice(1)) : t.incomeLine(avg.slice(1), total.slice(1))}</span>
            <button style={{ color: "var(--mut)", textDecoration: "underline", textUnderlineOffset: 3, fontSize: 13 }}
              onClick={() => app.toast(app.lang === "ru" ? "Открытые данные распределения — без посредников" : "Open distribution data — no middlemen")}>
              {t.incomeWhy}
            </button>
          </div>
          {mine && <div style={{ marginTop: 10 }}><YouGave artistId={id} short={true} /></div>}
        </div>
      </header>

      <div className="actions" style={{ marginBottom: 30 }}>
        <button className="playbig" aria-label={t.play} onClick={() => app.playContext(top.map(tr => tr.id))}>
          <Ic d={ICONS.play} size={22} fill="currentColor" />
        </button>
        <button className={"btn " + (following ? "ghost" : "")} style={{ padding: "0 22px", minHeight: 48 }} aria-pressed={following} onClick={() => app.toggleFollow(id)}>
          {following && <Ic d={ICONS.check} size={15} />}{following ? t.following : t.follow}
        </button>
        <button className="btn ghost" style={{ padding: "0 20px", minHeight: 48 }} onClick={() => app.openDonate({ kind: "artist", id })}>
          <span className="mono">$</span>{t.supportArtist}
        </button>
        <button className="iconbtn ring" style={{ width: 48, height: 48 }} title={t.share} aria-label={t.share} onClick={() => app.toast(t.copied)}><Ic d={ICONS.shareIc} size={18} /></button>
        <button className="iconbtn ring" style={{ width: 48, height: 48 }} title={t.more} aria-label={t.more}
          onClick={(e) => app.openCtxAt(e.currentTarget, { kind: "artist", id })}>
          <Ic d={ICONS.more} size={20} sw={3.4} />
        </button>
      </div>

      <div className="two-col" style={{ marginBottom: 34 }}>
        <section style={{ minWidth: 0 }}>
          <div className="h-row"><h2>{t.topTracks}</h2></div>
          {top.map((tr, i) => <TrackRow key={tr.id} trackId={tr.id} num={i + 1} showPlays={true} />)}
        </section>
        <section>
          <div className="h-row"><h2>{t.about}</h2></div>
          <div className="widget" style={{ padding: 22 }}>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--text)" }}>{ar.about}</p>
            <div style={{ display: "flex", gap: 30, marginTop: 20 }}>
              <span style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span className="mlabel" style={{ fontSize: 10 }}>{app.lang === "ru" ? "Подписчиков" : "Followers"}</span>
                <span style={{ fontSize: 26, fontWeight: 300, letterSpacing: "-0.04em" }}>{ar.followers.toLocaleString(app.lang === "ru" ? "ru" : "en")}</span>
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span className="mlabel" style={{ fontSize: 10 }}>{app.lang === "ru" ? "Релизов" : "Releases"}</span>
                <span style={{ fontSize: 26, fontWeight: 300, letterSpacing: "-0.04em" }}>{discs.length}</span>
              </span>
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
            <MediaCard key={a.id} title={a.title} sub={`${t[a.type]} · ${a.year}`} hue={a.hue} art={a.id}
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
            <MediaCard key={a.id} title={a.name} sub={t.artists.slice(0, -1)} hue={a.hue} art={"ar:" + a.id} round={true}
              onClick={() => app.go("artist", a.id)} ctx={{ kind: "artist", id: a.id }} />
          ))}
        </div>
      </section>
    </div>
  );
};

Object.assign(window, { PageAlbum, PageArtist });
