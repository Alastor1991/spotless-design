// Направление B — «Студия»
// Прохладный нейтральный графит, плотнее, тонкие линии вместо заливок,
// Source Sans 3 + JetBrains Mono для цифр. Спокойный «профессиональный» тон.

const dirB = {
  bg0: "oklch(0.185 0.008 255)",
  bg1: "oklch(0.215 0.009 255)",
  bg2: "oklch(0.27 0.01 255)",
  line: "oklch(0.30 0.01 255)",
  text: "oklch(0.92 0.008 250)",
  mut: "oklch(0.62 0.012 250)",
  acc: "oklch(0.80 0.13 95)",
  accInk: "oklch(0.25 0.05 95)",
  r: 8,
  font: "'Source Sans 3', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

const BNavItem = ({ icon, label, active, badge }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 12, padding: "8px 12px",
    borderRadius: dirB.r - 2, cursor: "default",
    background: active ? dirB.bg2 : "transparent",
    boxShadow: active ? `inset 2px 0 0 ${dirB.acc}` : "none",
    color: active ? dirB.text : dirB.mut, fontWeight: active ? 600 : 400, fontSize: 14.5,
  }}>
    <Ic d={ICONS[icon]} size={19} sw={1.6} />
    <span style={{ flex: 1 }}>{label}</span>
    {badge ? <span style={{ fontFamily: dirB.mono, fontSize: 12, color: dirB.acc }}>{badge}</span> : null}
  </div>
);

const BCard = ({ it }) => (
  <div style={{
    width: 152, display: "flex", flexDirection: "column", gap: 9,
    border: `1px solid ${dirB.line}`, borderRadius: dirB.r, padding: 11, background: dirB.bg1,
  }}>
    <Cover hue={it.hue} size={128} radius={dirB.r - 3} round={it.round} />
    <div>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: dirB.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.t}</div>
      <div style={{ fontSize: 12, color: dirB.mut, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.s}</div>
    </div>
  </div>
);

// Компактная строка трека — метаданные моноширинным
const BTrackRow = ({ n, it, dur, rating }) => (
  <div style={{
    display: "grid", gridTemplateColumns: "28px 44px 1fr 120px 56px 44px", alignItems: "center",
    gap: 12, padding: "7px 10px", borderRadius: dirB.r - 2,
    background: n === 1 ? dirB.bg2 : "transparent",
  }}>
    <span style={{ fontFamily: dirB.mono, fontSize: 12, color: n === 1 ? dirB.acc : dirB.mut, textAlign: "right" }}>{String(n).padStart(2, "0")}</span>
    <Cover hue={it.hue} size={40} radius={5} />
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: dirB.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.t}</div>
      <div style={{ fontSize: 12, color: dirB.mut, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.s}</div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 12, color: dirB.mut, justifyContent: "flex-end" }}>
      <Ic d={ICONS.heart} size={15} fill={rating ? "currentColor" : "none"} sw={rating ? 0 : 1.6} style={rating ? { color: dirB.acc } : {}} />
      <Ic d={ICONS.dollar} size={14} />
    </div>
    <span style={{ fontFamily: dirB.mono, fontSize: 11.5, color: rating ? dirB.acc : "transparent", textAlign: "center" }}>{rating ? `${rating}/10` : "·"}</span>
    <span style={{ fontFamily: dirB.mono, fontSize: 12, color: dirB.mut, textAlign: "right" }}>{dur}</span>
  </div>
);

const DirectionB = () => (
  <div style={{
    width: 1440, height: 900, background: dirB.bg0, fontFamily: dirB.font, color: dirB.text,
    display: "grid", gridTemplateRows: "1fr 84px", overflow: "hidden",
  }}>
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: 0 }}>

      {/* Сайдбар */}
      <aside style={{ borderRight: `1px solid ${dirB.line}`, padding: "20px 12px 14px", display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 12px", marginBottom: 16 }}>
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: dirB.acc, display: "inline-block" }}></span>
          <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.01em" }}>spotless</span>
          <span style={{ fontFamily: dirB.mono, fontSize: 10.5, color: dirB.mut, marginLeft: "auto" }}>v0.4</span>
        </div>
        <BNavItem icon="home" label="Главная" active={true} />
        <BNavItem icon="search" label="Поиск" />
        <BNavItem icon="library" label="Библиотека" />
        <BNavItem icon="wallet" label="Моя поддержка" badge="$5.00" />
        <div style={{ height: 1, background: dirB.line, margin: "12px 12px" }}></div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", marginBottom: 4 }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: dirB.mut, letterSpacing: "0.1em", textTransform: "uppercase" }}>Плейлисты</span>
          <Ic d={ICONS.plus} size={15} style={{ color: dirB.mut }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {PLAYLISTS_RU.map((p, i) => (
            <div key={i} style={{ padding: "6px 12px", fontSize: 13.5, color: i === 0 ? dirB.text : dirB.mut }}>{p}</div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${dirB.line}`, paddingTop: 10 }}>
          <BNavItem icon="gear" label="Настройки" />
          <div style={{ fontFamily: dirB.mono, fontSize: 10.5, color: dirB.mut, padding: "6px 12px 0" }}>cache 1.2 GB · peers ok</div>
        </div>
      </aside>

      {/* Основная область */}
      <main style={{ minHeight: 0, padding: "0 28px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0 12px", borderBottom: `1px solid ${dirB.line}` }}>
          <div style={{ display: "flex", gap: 6, color: dirB.mut }}>
            <Ic d={ICONS.back} size={18} /><Ic d={ICONS.fwd} size={18} style={{ opacity: 0.4 }} />
          </div>
          <div style={{
            flex: "0 1 420px", display: "flex", alignItems: "center", gap: 9,
            border: `1px solid ${dirB.line}`, background: dirB.bg1,
            borderRadius: dirB.r, padding: "7px 12px", color: dirB.mut, fontSize: 13.5,
          }}>
            <Ic d={ICONS.search} size={15} />
            <span style={{ flex: 1 }}>Артисты, треки, плейлисты…</span>
            <span style={{ fontFamily: dirB.mono, fontSize: 11, border: `1px solid ${dirB.line}`, borderRadius: 4, padding: "1px 5px" }}>⌘K</span>
          </div>
          <div style={{ flex: 1 }}></div>
          <Ic d={ICONS.bell} size={18} style={{ color: dirB.mut }} />
          <div style={{
            width: 30, height: 30, borderRadius: "50%", border: `1px solid ${dirB.line}`, background: dirB.bg2,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: dirB.acc,
          }}>Л</div>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 14, margin: "20px 0 16px" }}>
          <h1 style={{ margin: 0, fontSize: 25, fontWeight: 700, letterSpacing: "-0.01em" }}>Добрый вечер, Лиза</h1>
          <span style={{ fontFamily: dirB.mono, fontSize: 12, color: dirB.mut }}>вт, 21:42</span>
        </div>

        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 11 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Недавно слушали</h2>
            <span style={{ fontSize: 12.5, color: dirB.mut }}>показать все</span>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {ROW_RECENT.items.map((it, i) => <BCard key={i} it={it} />)}
          </div>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 7 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Новое от ваших артистов</h2>
            <span style={{ fontSize: 12.5, color: dirB.mut }}>показать все</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <BTrackRow n={1} it={ROW_NEW.items[0]} dur="3:56" rating={8} />
            <BTrackRow n={2} it={ROW_NEW.items[2]} dur="4:12" />
            <BTrackRow n={3} it={ROW_NEW.items[4]} dur="2:48" rating={7} />
            <BTrackRow n={4} it={ROW_NEW.items[1]} dur="3:21" />
          </div>
        </div>
      </main>
    </div>

    {/* Плеер */}
    <footer style={{ background: dirB.bg1, borderTop: `1px solid ${dirB.line}`, position: "relative" }}>
      <div style={{ position: "absolute", top: -1, left: 0, right: 0, height: 2, background: dirB.bg2 }}>
        <div style={{ width: `${NOW.pct * 100}%`, height: "100%", background: dirB.acc }}></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", height: "100%", padding: "0 20px", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <Cover hue={NOW.hue} size={50} radius={6} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{NOW.t}</div>
            <div style={{ fontSize: 12, color: dirB.mut, marginTop: 1 }}>{NOW.a}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: 12, color: dirB.mut }}>
            <Ic d={ICONS.heart} size={17} fill="currentColor" sw={0} style={{ color: dirB.acc }} />
            <Ic d={ICONS.dollar} size={15} />
            <span style={{ fontFamily: dirB.mono, fontSize: 11.5, color: dirB.acc }}>8/10</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20, color: dirB.mut }}>
          <Ic d={ICONS.shuffle} size={16} />
          <Ic d={ICONS.prev} size={18} style={{ color: dirB.text }} />
          <div style={{
            width: 36, height: 36, borderRadius: "50%", border: `1.5px solid ${dirB.text}`, color: dirB.text,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Ic d={ICONS.pause} size={15} sw={2.2} />
          </div>
          <Ic d={ICONS.next} size={18} style={{ color: dirB.text }} />
          <Ic d={ICONS.repeat} size={16} />
          <span style={{ fontFamily: dirB.mono, fontSize: 11.5, color: dirB.mut, marginLeft: 6 }}>{NOW.at} / {NOW.len}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "flex-end", color: dirB.mut }}>
          <span style={{ fontFamily: dirB.mono, fontSize: 11, border: `1px solid ${dirB.line}`, borderRadius: 4, padding: "2px 6px" }}>FLAC · 24/96</span>
          <Ic d={ICONS.queue} size={18} />
          <Ic d={ICONS.volume} size={18} />
          <div style={{ width: 90, height: 4, borderRadius: 99, background: dirB.bg2, position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, width: "62%", borderRadius: 99, background: dirB.mut }}></div>
          </div>
        </div>
      </div>
    </footer>
  </div>
);

window.DirectionB = DirectionB;
