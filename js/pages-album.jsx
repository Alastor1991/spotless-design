// Spotless — страницы альбома/релиза и артиста.

// Кнопки действий над страницей: «Поделиться» и «Ещё» (контекстное меню)
const ShareBtn = ({ size = 48, className = "iconbtn ring" }) => {
  const app = useApp();
  return (
    <button className={className} style={{ width: size, height: size }} title={app.t.share} aria-label={app.t.share} onClick={() => app.toast(app.t.copied)}>
      <Ic d={ICONS.shareIc} size={18} />
    </button>
  );
};
const MoreBtn = ({ ctx, size = 48, className = "iconbtn ring" }) => {
  const app = useApp();
  return (
    <button className={className} style={{ width: size, height: size }} title={app.t.more} aria-label={app.t.more}
      onClick={(e) => app.openCtxAt(e.currentTarget, ctx)}>
      <Ic d={ICONS.more} size={20} fill="currentColor" />
    </button>
  );
};

const PageAlbum = ({ id }) => {
  const app = useApp();
  const t = app.t;
  const m = app.money;
  const al = DB.albums[id];
  if (!al) return <PageHome />; // такого релиза нет (старая ссылка) — не падаем
  const ar = DB.artists[al.artist];
  const ids = albumIds(al);
  const dlN = ids.filter(x => app.downloads[x] === "done").length;
  const moreAlbums = artistAlbums(al.artist).filter(a => a.id !== id);
  return (
    <div className="fade-in" data-screen-label={"Альбом: " + al.title}>
      {/* Шапка */}
      <header className="hero">
        <Cover art={al.id} hue={al.hue} size="clamp(150px, 20cqi, 264px)" radius={24} />
        <div style={{ minWidth: 0, flex: "1 1 320px", paddingBottom: 4 }}>
          <div className="mlabel" style={{ marginBottom: 14 }}>{t[al.type]} · {al.year} · {al.tracks.length} {t.tracksN(al.tracks.length)} · {minutesOf(ids)} {t.min}</div>
          <h1 className="hero-title" style={{ "--fs": "clamp(44px, 9cqi, 128px)", "--lh": 0.88 }}>{al.title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--mut)", flexWrap: "wrap" }}>
            <Cover art={"ar:" + ar.id} hue={ar.hue} size={28} round={true} />
            <button style={{ fontSize: 16, color: "var(--text)" }} onClick={() => app.go("artist", ar.id)}>{ar.name}</button>
            <span className="mlabel no-phone">·</span>
            <span className="mlabel">{t.incomeAvgShort(m.fmt(m.usd(ar.avgPerListener), true))}</span>
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
          <span className="mono" style={{ fontSize: 12 }} aria-label={t.dlCount(dlN, ids.length)}>{dlN}/{ids.length}</span>
        </span>
        <button className="btn ghost act-wide act-donate" style={{ padding: "0 20px", minHeight: 48 }} onClick={() => app.openDonate({ kind: "album", id: al.id })}>
          <DonateMark />{t.supportRelease}
        </button>
        <ShareBtn className="iconbtn ring no-phone" />
        <MoreBtn ctx={{ kind: "album", id }} />
      </div>

      {/* Список треков */}
      <div className="trow-head nocover">
        <span className="mlabel">#</span>
        <span className="mlabel">{t.tracks}</span>
        <span className="mlabel alb" style={{ textAlign: "right" }}>{t.plays}</span>
        <span></span>
        <span className="mlabel" style={{ textAlign: "right" }}>{t.colTime}</span>
      </div>
      <div style={{ marginBottom: 30 }}>
        {al.tracks.map((tr, i) => <TrackRow key={tr.id} trackId={tr.id} num={i + 1} showPlays={true} noCover={true} />)}
      </div>

      <p className="mlabel" style={{ marginBottom: 40 }}>
        {al.year} · {ar.name}. {t.rightsArtist}
      </p>

      {moreAlbums.length > 0 && (
        <section>
          <div className="h-row">
            <h2>{t.moreBy(ar.name)}</h2>
            <button className="more" onClick={() => app.go("artist", ar.id)}>{t.showAll}</button>
          </div>
          <div className="cardrow">
            {moreAlbums.map(a => <MediaCard key={a.id} {...albumCard(app, a, `${t[a.type]} · ${a.year}`)} />)}
          </div>
        </section>
      )}
    </div>
  );
};

// ---------- Артист ----------
// Число с подписью в карточке «Об артисте»
const ArtistStat = ({ label, value }) => (
  <span style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <span className="mlabel ml-s">{label}</span>
    <span className="ty-light" style={{ fontSize: 26 }}>{value}</span>
  </span>
);

// Скромная строчка прозрачности: сколько артист получает (доходы — в долларах, по курсу в валюту человека)
const IncomeLine = ({ ar }) => {
  const app = useApp();
  const t = app.t;
  const m = app.money;
  const avg = m.fmt(m.usd(ar.avgPerListener), true);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--mut)", flexWrap: "wrap", lineHeight: 1.5 }}>
      <span>{ar.incomeHidden ? t.incomeLineHidden(avg) : t.incomeLine(avg, m.int(m.usd(ar.totalMonth)))}</span>
      <button style={{ color: "var(--mut)", textDecoration: "underline", textUnderlineOffset: 3, fontSize: 13 }}
        onClick={() => app.toast(t.incomeWhyNote)}>
        {t.incomeWhy}
      </button>
    </div>
  );
};

const PageArtist = ({ id }) => {
  const app = useApp();
  const t = app.t;
  const ar = DB.artists[id];
  if (!ar) return <PageHome />;
  const discs = artistAlbums(id);
  const top = topTracks([id]).slice(0, 5);
  const similar = Object.values(DB.artists).filter(a => a.id !== id).slice(0, 6);
  const following = app.followed.includes(id);
  return (
    <div className="fade-in" data-screen-label={"Артист: " + ar.name}>
      <header className="hero" style={{ alignItems: "center", paddingBottom: 24 }}>
        <Cover art={"ar:" + ar.id} hue={ar.hue} size="clamp(140px, 18cqi, 220px)" round={true} />
        <div style={{ minWidth: 0, flex: "1 1 320px" }}>
          <div className="mlabel" style={{ marginBottom: 14 }}>
            {t.artist} · {ar.listeners.toLocaleString(app.lang)} {t.monthlyListeners}
          </div>
          <h1 className="hero-title" style={{ "--fs": "clamp(40px, 8cqi, 112px)", "--lh": 0.9, textWrap: "wrap" }}>{ar.name}</h1>
          <IncomeLine ar={ar} />
          {shareOf(id, app.monthly) && <div style={{ marginTop: 10 }}><YouGave artistId={id} short={true} /></div>}
        </div>
      </header>

      <div className="actions" style={{ marginBottom: 30 }}>
        <button className="playbig" aria-label={t.play} onClick={() => app.playContext(top.map(tr => tr.id))}>
          <Ic d={ICONS.play} size={22} fill="currentColor" />
        </button>
        <button className={"btn " + (following ? "ghost" : "")} style={{ padding: "0 22px", minHeight: 48 }} aria-pressed={following} onClick={() => app.toggleFollow(id)}>
          {following && <Ic d={ICONS.check} size={15} />}{following ? t.following : t.follow}
        </button>
        <button className="btn ghost act-wide act-donate" style={{ padding: "0 20px", minHeight: 48 }} onClick={() => app.openDonate({ kind: "artist", id })}>
          <DonateMark />{t.supportArtist}
        </button>
        <ShareBtn className="iconbtn ring no-phone" />
        <MoreBtn ctx={{ kind: "artist", id }} />
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
              <ArtistStat label={t.followers} value={ar.followers.toLocaleString(app.lang)} />
              <ArtistStat label={t.releases} value={discs.length} />
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
          {discs.map(a => <MediaCard key={a.id} {...albumCard(app, a, `${t[a.type]} · ${a.year}`)} />)}
        </div>
      </section>

      <section>
        <div className="h-row">
          <h2>{t.similar}</h2>
          <button className="more" onClick={() => app.go("showall", "similar:" + id)}>{t.showAll}</button>
        </div>
        <div className="cardrow">
          {similar.map(a => <MediaCard key={a.id} {...artistCard(app, a, t.artist)} />)}
        </div>
      </section>
    </div>
  );
};

Object.assign(window, { PageAlbum, PageArtist, ShareBtn, MoreBtn });
