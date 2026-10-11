// Spotless — социальное: профили (свой и друзей) и Jam-сессия.

const ProfileAvatar = ({ letter, hue, size = 96, accent = false }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%", flexShrink: 0,
    background: accent ? "var(--bg2)" : `oklch(var(--cover-l1) 0.05 ${hue})`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.38, fontWeight: 800, color: accent ? "var(--acc)" : "var(--text)",
    boxShadow: "var(--island-shadow)",
  }}>{letter}</div>
);

// Свой профиль
const MyProfile = () => {
  const app = useApp();
  const t = app.t;
  const myPls = app.allPlaylists.filter(p => p.byMe);
  return (
    <div className="fade-in" data-screen-label="Профиль: Лиза">
      <header className="hero" style={{ alignItems: "center" }}>
        <ProfileAvatar letter="Л" hue={95} accent={true} />
        <div style={{ minWidth: 0 }}>
          <div className="sec-label" style={{ marginBottom: 8 }}>{t.profile}</div>
          <h1 style={{ fontSize: "clamp(30px, 5cqi, 48px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 10 }}>Лиза</h1>
          <div style={{ fontSize: 14, color: "var(--mut)" }}>
            @liza · {t.memberSince} · {myPls.length} {t.playlists.toLowerCase()} · {app.followed.length} {t.followsLabel.toLowerCase()}
          </div>
        </div>
      </header>

      <section style={{ marginBottom: 30 }}>
        <div className="h-row"><h2>{t.publicPls}</h2></div>
        <div className="cardrow">
          {myPls.map(pl => (
            <MediaCard key={pl.id} {...playlistCard(app, pl, `${app.playlistTracks(pl.id).length} ${t.tracksN}` + (pl.collab ? ` · ${t.collab}` : ""))} />
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 30 }}>
        <div className="h-row"><h2>{t.followsLabel}</h2></div>
        <div className="cardrow">
          {app.followed.map(aid => <MediaCard key={aid} {...artistCard(app, DB.artists[aid], t.artist)} />)}
        </div>
      </section>

      <section>
        <div className="h-row"><h2>{t.friendsLabel}</h2></div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {DB.friends.map(fr => (
            <button key={fr.id} onClick={() => app.go("profile", fr.id)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "9px 18px 9px 10px",
              background: "var(--bg1)", borderRadius: 99, border: "1px solid var(--line)",
            }}>
              <ProfileAvatar letter={fr.name[0]} hue={fr.hue} size={30} />
              <span style={{ fontSize: 13.5, fontWeight: 700 }}>{fr.name}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

// Профиль друга
const FriendProfile = ({ f }) => {
  const app = useApp();
  const t = app.t;
  const tr = DB.trackIndex[f.trackId];
  const al = DB.albums[tr.album];
  const fPls = f.playlists.map(pid => DB.findPlaylist(pid)).filter(Boolean);
  const common = f.topArtists.filter(aid => app.followed.includes(aid));
  return (
    <div className="fade-in" data-screen-label={"Профиль: " + f.name}>
      <header className="hero" style={{ alignItems: "center" }}>
        <ProfileAvatar letter={f.name[0]} hue={f.hue} />
        <div style={{ minWidth: 0 }}>
          <div className="sec-label" style={{ marginBottom: 8 }}>{t.profile}</div>
          <h1 style={{ fontSize: "clamp(30px, 5cqi, 48px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 10 }}>{f.name}</h1>
          <div style={{ fontSize: 14, color: "var(--mut)" }}>{f.handle} · {t.memberSince}</div>
          {common.length > 0 && (
            <div style={{ fontSize: 13, color: "var(--mut)", marginTop: 7, display: "flex", alignItems: "center", gap: 7 }}>
              <Ic d={ICONS.heart} size={13} style={{ color: "var(--hot)" }} fill="currentColor" />
              {t.inCommon}: {common.map(aid => DB.artists[aid].name).join(" · ")}
            </div>
          )}
        </div>
      </header>

      <section style={{ marginBottom: 30 }}>
        <div className="h-row"><h2>{t.listeningNow}</h2></div>
        <button className="friend-now" onClick={() => app.playTrack(tr.id)}
          onContextMenu={(e) => app.openCtx(e, { kind: "track", id: tr.id })} style={{
          display: "flex", alignItems: "center", gap: 14, textAlign: "left",
          border: "1px solid var(--line)", borderRadius: "var(--r)",
          padding: "12px 18px 12px 12px", maxWidth: 480, width: "100%",
        }}>
          <Cover art={al.id} hue={al.hue} size={52} radius={10} />
          <span style={{ minWidth: 0, flex: 1 }}>
            <span style={{ display: "block", fontSize: 14.5, fontWeight: 700 }}>{tr.t}</span>
            <span style={{ display: "block", fontSize: 12.5, color: "var(--mut)", marginTop: 2 }}>
              {DB.artists[tr.artist].name} · {app.lang === "ru" ? f.ago : f.agoEn}
            </span>
          </span>
          <Ic d={ICONS.play} size={20} fill="currentColor" style={{ color: "var(--acc)" }} />
        </button>
      </section>

      <section style={{ marginBottom: 30 }}>
        <div className="h-row"><h2>{t.publicPls}</h2></div>
        <div className="cardrow">
          {fPls.map(pl => <MediaCard key={pl.id} {...playlistCard(app, pl, `${pl.tracks.length} ${t.tracksN} · ${f.name}`, pl.tracks)} />)}
        </div>
      </section>

      <section>
        <div className="h-row"><h2>{t.followsLabel}</h2></div>
        <div className="cardrow">
          {f.topArtists.map(aid => <MediaCard key={aid} {...artistCard(app, DB.artists[aid], t.artist)} />)}
        </div>
      </section>
    </div>
  );
};

const PageProfile = ({ id }) => {
  if (id === "me" || !id) return <MyProfile />;
  const f = DB.friends.find(x => x.id === id);
  return f ? <FriendProfile f={f} /> : <PageHome />;
};

// ---------- Jam ----------
const PageJam = () => {
  const app = useApp();
  const t = app.t;
  const people = [
    { name: "Лиза", hue: 95, you: true },
    { name: "Митя", hue: 210 },
  ];
  return (
    <div className="fade-in" data-screen-label="Jam-сессия">
      <header className="hero" style={{ alignItems: "center" }}>
        <div style={{
          width: "clamp(120px, 12cqi, 160px)", aspectRatio: "1", borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, oklch(var(--cover-l1) 0.08 95), oklch(var(--cover-l2) 0.08 210))",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "var(--island-shadow)",
        }}>
          <Ic d={ICONS.jam} size={56} style={{ color: "var(--acc)" }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div className="sec-label" style={{ marginBottom: 8 }}>Jam · {t.inSession.toLowerCase()}</div>
          <h1 style={{ fontSize: "clamp(28px, 4.5cqi, 44px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 10 }}>{t.jamTitle}</h1>
          <p style={{ fontSize: 14, color: "var(--mut)", lineHeight: 1.6, maxWidth: 520, textWrap: "pretty" }}>{t.jamSub}</p>
        </div>
      </header>

      <div className="actions" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {people.map((p, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 9, padding: "7px 16px 7px 8px",
              background: "var(--bg1)", borderRadius: 99, border: "1px solid var(--line)",
            }}>
              <ProfileAvatar letter={p.name[0]} hue={p.hue} size={28} />
              <span style={{ fontSize: 13, fontWeight: 700 }}>
                {p.name}{p.you && <span style={{ color: "var(--mut)", fontWeight: 500 }}> · {t.jamYou}</span>}
              </span>
            </div>
          ))}
        </div>
        <button className="btn ghost" style={{ padding: "10px 20px" }} onClick={() => {
          copyText("https://spotless.app/jam/7fk2nq");
          app.toast(t.jamLinkCopied);
        }}>
          <Ic d={ICONS.link} size={15} />{t.jamInvite}
        </button>
        <button className="btn outline" style={{ padding: "10px 20px" }} onClick={() => { app.toast(t.jamEnded); app.go("home"); }}>
          {t.jamEnd}
        </button>
      </div>

      <section style={{ maxWidth: 640 }}>
        <div className="h-row"><h2>{t.queue}</h2></div>
        {app.queueIds.slice(0, 7).map((tid, i) => {
          const tr = DB.trackIndex[tid];
          const who = people[i % 2];
          const playing = app.player.trackId === tid;
          return (
            <div key={tid} className={"trow" + (playing ? " playing" : "")}
              style={{ gridTemplateColumns: "34px 44px minmax(0,1fr) auto 52px" }}
              onDoubleClick={() => app.playTrack(tid)}
              onContextMenu={(e) => app.openCtx(e, { kind: "track", id: tid, qIndex: app.queueIds.indexOf(tid) })}>
              <span className="num">{playing ? <span className="hot-dot" style={{ width: 7, height: 7, display: "block", marginLeft: 2 }}></span> : String(i + 1).padStart(2, "0")}</span>
              <button onClick={() => app.playTrack(tid)} style={{ display: "block" }}>
                <Cover art={tr.album} hue={DB.albums[tr.album].hue} size={40} radius={8} />
              </button>
              <div style={{ minWidth: 0 }}>
                <div className="tt">{tr.t}</div>
                <div className="ta">{DB.artists[tr.artist].name}</div>
              </div>
              <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "var(--mut)" }}>
                <ProfileAvatar letter={who.name[0]} hue={who.hue} size={20} />
                {`${t.jamAddedBy} ${who.name}`}
              </span>
              <span className="dur">{tr.dur}</span>
            </div>
          );
        })}
      </section>
    </div>
  );
};

Object.assign(window, { PageProfile, PageJam, ProfileAvatar });
