// Направление C — «Солнечная»
// Светлая кремовая, тональные поверхности, крупные скругления, Nunito Sans.
// Интерфейс на английском. Плеер — «плавающая» капсула.

const dirC = {
  bg0: "oklch(0.972 0.012 95)",
  bg1: "oklch(0.93 0.02 95)",
  bg2: "oklch(0.885 0.028 95)",
  text: "oklch(0.28 0.02 80)",
  mut: "oklch(0.50 0.025 85)",
  acc: "oklch(0.78 0.13 95)",
  accDeep: "oklch(0.34 0.07 95)",
  white: "oklch(0.995 0.005 95)",
  r: 24,
  font: "'Nunito Sans', sans-serif",
};

const CNavItem = ({ icon, label, active, badge }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 13, padding: "11px 18px",
    borderRadius: 99, cursor: "default",
    background: active ? dirC.acc : "transparent",
    color: active ? dirC.accDeep : dirC.mut, fontWeight: active ? 800 : 600, fontSize: 15,
  }}>
    <Ic d={ICONS[icon]} size={20} sw={active ? 2.1 : 1.8} />
    <span style={{ flex: 1 }}>{label}</span>
    {badge ? <span style={{
      fontSize: 12.5, fontWeight: 800, color: dirC.accDeep, background: active ? dirC.white : dirC.bg2,
      borderRadius: 99, padding: "2px 9px",
    }}>{badge}</span> : null}
  </div>
);

const CCard = ({ it }) => (
  <div style={{
    width: 164, background: dirC.white, borderRadius: dirC.r - 4, padding: 12,
    display: "flex", flexDirection: "column", gap: 10,
    boxShadow: "0 1px 3px oklch(0.4 0.03 85 / 0.08)",
  }}>
    <Cover hue={it.hue} size={140} radius={dirC.r - 10} round={it.round} dark={false} />
    <div style={{ padding: "0 4px 4px" }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: dirC.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.te}</div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: dirC.mut, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.se}</div>
    </div>
  </div>
);

const CRow = ({ row }) => (
  <div>
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: dirC.text }}>{row.en}</h2>
      <span style={{ fontSize: 13, color: dirC.mut, fontWeight: 700 }}>See all</span>
    </div>
    <div style={{ display: "flex", gap: 16 }}>
      {row.items.map((it, i) => <CCard key={i} it={it} />)}
    </div>
  </div>
);

const DirectionC = () => (
  <div style={{
    width: 1440, height: 900, background: dirC.bg0, fontFamily: dirC.font, color: dirC.text,
    overflow: "hidden", position: "relative", display: "grid", gridTemplateColumns: "276px 1fr",
  }}>
    {/* Сайдбар */}
    <aside style={{ padding: "26px 18px 20px", display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 18px", marginBottom: 20 }}>
        <span style={{ width: 15, height: 15, borderRadius: "50%", background: dirC.acc, display: "inline-block" }}></span>
        <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>spotless</span>
      </div>
      <CNavItem icon="home" label="Home" active={true} />
      <CNavItem icon="search" label="Search" />
      <CNavItem icon="library" label="Library" />
      <CNavItem icon="wallet" label="My support" badge="$5" />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 18px 8px" }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: dirC.mut, letterSpacing: "0.1em", textTransform: "uppercase" }}>Playlists</span>
        <Ic d={ICONS.plus} size={16} style={{ color: dirC.mut }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {PLAYLISTS_EN.map((p, i) => (
          <div key={i} style={{
            padding: "8px 18px", fontSize: 14.5, fontWeight: i === 0 ? 800 : 600,
            color: i === 0 ? dirC.text : dirC.mut, borderRadius: 99,
            background: i === 0 ? dirC.bg1 : "transparent",
          }}>{p}</div>
        ))}
      </div>
      <CNavItem icon="gear" label="Settings" />
    </aside>

    {/* Основная область */}
    <main style={{ padding: "0 36px 0 16px", display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "22px 0 16px" }}>
        <div style={{ display: "flex", gap: 8, color: dirC.mut }}>
          <Ic d={ICONS.back} size={20} /><Ic d={ICONS.fwd} size={20} style={{ opacity: 0.4 }} />
        </div>
        <div style={{
          flex: "0 1 400px", display: "flex", alignItems: "center", gap: 10, background: dirC.bg1,
          borderRadius: 99, padding: "11px 18px", color: dirC.mut, fontSize: 14, fontWeight: 600,
        }}>
          <Ic d={ICONS.search} size={17} />Artists, tracks, playlists…
        </div>
        <div style={{ flex: 1 }}></div>
        <Ic d={ICONS.bell} size={20} style={{ color: dirC.mut }} />
        <div style={{
          width: 36, height: 36, borderRadius: "50%", background: dirC.accDeep, color: dirC.acc,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14.5, fontWeight: 800,
        }}>L</div>
      </div>

      <div style={{ display: "flex", gap: 8, margin: "2px 0 18px" }}>
        {["All", "Music", "Podcasts"].map((c, i) => (
          <span key={c} style={{
            padding: "8px 18px", borderRadius: 99, fontSize: 13.5, fontWeight: 800,
            background: i === 0 ? dirC.accDeep : dirC.bg1, color: i === 0 ? dirC.white : dirC.mut,
          }}>{c}</span>
        ))}
      </div>

      <h1 style={{ margin: "0 0 22px", fontSize: 31, fontWeight: 800, letterSpacing: "-0.02em" }}>Good evening, Liza</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <CRow row={ROW_RECENT} />
        <CRow row={ROW_NEW} />
      </div>
    </main>

    {/* Плавающий плеер-капсула */}
    <div style={{
      position: "absolute", left: 296, right: 36, bottom: 20, height: 76,
      background: dirC.white, borderRadius: 99, boxShadow: "0 8px 28px oklch(0.4 0.04 85 / 0.18)",
      display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "0 14px 0 10px", gap: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 13, minWidth: 0 }}>
        <Cover hue={NOW.hue} size={56} radius={99} round={true} dark={false} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 800 }}>{NOW.t}</div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: dirC.mut, marginTop: 1 }}>{NOW.a}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", background: dirC.bg1, color: dirC.accDeep,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Ic d={ICONS.heart} size={17} fill="currentColor" sw={0} />
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", color: dirC.mut,
            display: "flex", alignItems: "center", justifyContent: "center",
          }} title="Support this artist">
            <Ic d={ICONS.dollar} size={16} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 18, color: dirC.mut }}>
        <Ic d={ICONS.shuffle} size={17} />
        <Ic d={ICONS.prev} size={19} style={{ color: dirC.text }} />
        <div style={{
          width: 46, height: 46, borderRadius: "50%", background: dirC.accDeep, color: dirC.acc,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Ic d={ICONS.pause} size={18} sw={2.4} />
        </div>
        <Ic d={ICONS.next} size={19} style={{ color: dirC.text }} />
        <Ic d={ICONS.repeat} size={17} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "flex-end" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: dirC.mut }}>{NOW.at}</span>
        <div style={{ width: 180, height: 6, borderRadius: 99, background: dirC.bg1, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, width: `${NOW.pct * 100}%`, borderRadius: 99, background: dirC.acc }}></div>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: dirC.mut }}>{NOW.len}</span>
        <Ic d={ICONS.queue} size={19} style={{ color: dirC.mut, marginLeft: 6 }} />
        <Ic d={ICONS.volume} size={19} style={{ color: dirC.mut }} />
      </div>
    </div>
  </div>
);

window.DirectionC = DirectionC;
