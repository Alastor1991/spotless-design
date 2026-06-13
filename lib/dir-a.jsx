// Направление A — «Тёплая бумага»
// Тёплый графит, кремовый текст, мягкие скругления, Golos Text.
// Показан открытый поповер оценки (long-press на сердечке).

const dirA = {
  bg0: "oklch(0.20 0.012 75)",
  bg1: "oklch(0.245 0.013 75)",
  bg2: "oklch(0.30 0.015 75)",
  line: "oklch(0.33 0.015 75)",
  text: "oklch(0.93 0.015 90)",
  mut: "oklch(0.65 0.018 80)",
  acc: "oklch(0.80 0.13 95)",
  accInk: "oklch(0.27 0.06 95)",
  r: 14,
  font: "'Golos Text', sans-serif",
};

const ANavItem = ({ icon, label, active, badge }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 14, padding: "10px 14px",
    borderRadius: dirA.r - 4, cursor: "default",
    background: active ? dirA.bg2 : "transparent",
    color: active ? dirA.text : dirA.mut, fontWeight: active ? 600 : 500, fontSize: 15,
  }}>
    <Ic d={ICONS[icon]} size={21} sw={active ? 2 : 1.7} />
    <span style={{ flex: 1 }}>{label}</span>
    {badge ? <span style={{
      fontSize: 12.5, fontWeight: 700, color: dirA.accInk, background: dirA.acc,
      borderRadius: 99, padding: "2px 9px",
    }}>{badge}</span> : null}
  </div>
);

const ACard = ({ it }) => (
  <div style={{ width: 168, display: "flex", flexDirection: "column", gap: 10 }}>
    <Cover hue={it.hue} size={168} radius={dirA.r - 2} round={it.round} />
    <div style={{ padding: "0 2px" }}>
      <div style={{ fontSize: 14.5, fontWeight: 600, color: dirA.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.t}</div>
      <div style={{ fontSize: 13, color: dirA.mut, marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.s}</div>
    </div>
  </div>
);

const ARow = ({ row }) => (
  <div>
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
      <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: dirA.text, letterSpacing: "-0.01em" }}>{row.ru}</h2>
      <span style={{ fontSize: 13, color: dirA.mut, fontWeight: 600 }}>Показать все</span>
    </div>
    <div style={{ display: "flex", gap: 18 }}>
      {row.items.map((it, i) => <ACard key={i} it={it} />)}
    </div>
  </div>
);

// Поповер оценки 1–10 (раскрыт)
const ARating = () => (
  <div style={{ position: "absolute", bottom: 46, left: -86, width: 248, zIndex: 5 }}>
    <div style={{
      background: dirA.bg2, borderRadius: dirA.r, padding: "12px 14px 10px",
      boxShadow: "0 12px 32px oklch(0.1 0.01 75 / 0.55)", border: `1px solid ${dirA.line}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 9 }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: dirA.mut }}>Ваша оценка</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: dirA.acc }}>8</span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <div key={n} style={{
            flex: 1, height: 22, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
            background: n <= 8 ? dirA.acc : dirA.bg1,
            color: n <= 8 ? dirA.accInk : dirA.mut, fontSize: 11, fontWeight: 700,
          }}>{n}</div>
        ))}
      </div>
      <div style={{ fontSize: 11.5, color: dirA.mut, marginTop: 8 }}>Оценки делают рекомендации точнее</div>
    </div>
    <div style={{
      width: 12, height: 12, background: dirA.bg2, transform: "rotate(45deg)",
      margin: "-6px auto 0", borderRight: `1px solid ${dirA.line}`, borderBottom: `1px solid ${dirA.line}`,
    }}></div>
  </div>
);

const DirectionA = () => (
  <div style={{
    width: 1440, height: 900, background: dirA.bg0, fontFamily: dirA.font, color: dirA.text,
    display: "grid", gridTemplateRows: "1fr 92px", overflow: "hidden", position: "relative",
  }}>
    <div style={{ display: "grid", gridTemplateColumns: "264px 1fr", minHeight: 0 }}>

      {/* Сайдбар */}
      <aside style={{ background: dirA.bg1, padding: "22px 14px 16px", display: "flex", flexDirection: "column", gap: 4, borderRight: `1px solid ${dirA.line}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 14px", marginBottom: 18 }}>
          <span style={{ width: 14, height: 14, borderRadius: "50%", background: dirA.acc, display: "inline-block" }}></span>
          <span style={{ fontSize: 21, fontWeight: 700, letterSpacing: "-0.02em" }}>spotless</span>
        </div>
        <ANavItem icon="home" label="Главная" active={true} />
        <ANavItem icon="search" label="Поиск" />
        <ANavItem icon="library" label="Библиотека" />
        <ANavItem icon="wallet" label="Моя поддержка" badge="$5" />
        <div style={{ height: 1, background: dirA.line, margin: "14px 14px" }}></div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", marginBottom: 6 }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: dirA.mut, letterSpacing: "0.08em", textTransform: "uppercase" }}>Плейлисты</span>
          <Ic d={ICONS.plus} size={16} style={{ color: dirA.mut }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
          {PLAYLISTS_RU.map((p, i) => (
            <div key={i} style={{ padding: "8px 14px", fontSize: 14.5, color: i === 0 ? dirA.text : dirA.mut, borderRadius: 8 }}>{p}</div>
          ))}
        </div>
        <ANavItem icon="gear" label="Настройки" />
      </aside>

      {/* Основная область */}
      <main style={{ minHeight: 0, padding: "0 32px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 0 14px" }}>
          <div style={{ display: "flex", gap: 8, color: dirA.mut }}>
            <Ic d={ICONS.back} size={20} /><Ic d={ICONS.fwd} size={20} style={{ opacity: 0.4 }} />
          </div>
          <div style={{
            flex: "0 1 380px", display: "flex", alignItems: "center", gap: 10, background: dirA.bg1,
            borderRadius: 99, padding: "9px 16px", color: dirA.mut, fontSize: 14,
          }}>
            <Ic d={ICONS.search} size={17} />Артисты, треки, плейлисты…
          </div>
          <div style={{ flex: 1 }}></div>
          <Ic d={ICONS.bell} size={20} style={{ color: dirA.mut }} />
          <div style={{
            width: 34, height: 34, borderRadius: "50%", background: dirA.bg2, display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 14.5, fontWeight: 700, color: dirA.acc,
          }}>Л</div>
        </div>

        <div style={{ display: "flex", gap: 8, margin: "6px 0 18px" }}>
          {["Всё", "Музыка", "Подкасты"].map((c, i) => (
            <span key={c} style={{
              padding: "7px 16px", borderRadius: 99, fontSize: 13.5, fontWeight: 600,
              background: i === 0 ? dirA.acc : dirA.bg1, color: i === 0 ? dirA.accInk : dirA.text,
            }}>{c}</span>
          ))}
        </div>

        <h1 style={{ margin: "0 0 20px", fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em" }}>Добрый вечер, Лиза</h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <ARow row={ROW_RECENT} />
          <ARow row={ROW_NEW} />
        </div>
      </main>
    </div>

    {/* Плеер */}
    <footer style={{
      background: dirA.bg1, borderTop: `1px solid ${dirA.line}`,
      display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "0 22px", gap: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
        <Cover hue={NOW.hue} size={56} radius={10} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 600 }}>{NOW.t}</div>
          <div style={{ fontSize: 12.5, color: dirA.mut, marginTop: 2 }}>{NOW.a}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 10, position: "relative" }}>
          <ARating />
          <div style={{
            width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            background: dirA.bg2, color: dirA.acc,
          }}>
            <Ic d={ICONS.heart} size={18} fill="currentColor" sw={0} />
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            color: dirA.mut,
          }} title="Поддержать артиста">
            <Ic d={ICONS.dollar} size={17} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, width: 560 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, color: dirA.mut }}>
          <Ic d={ICONS.shuffle} size={17} />
          <Ic d={ICONS.prev} size={19} style={{ color: dirA.text }} />
          <div style={{
            width: 40, height: 40, borderRadius: "50%", background: dirA.acc, color: dirA.accInk,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Ic d={ICONS.pause} size={17} sw={2.4} />
          </div>
          <Ic d={ICONS.next} size={19} style={{ color: dirA.text }} />
          <Ic d={ICONS.repeat} size={17} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
          <span style={{ fontSize: 12, color: dirA.mut, width: 34, textAlign: "right" }}>{NOW.at}</span>
          <div style={{ flex: 1, height: 5, borderRadius: 99, background: dirA.bg2, position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, width: `${NOW.pct * 100}%`, borderRadius: 99, background: dirA.acc }}></div>
          </div>
          <span style={{ fontSize: 12, color: dirA.mut, width: 34 }}>{NOW.len}</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "flex-end", color: dirA.mut }}>
        <Ic d={ICONS.mic} size={18} />
        <Ic d={ICONS.queue} size={19} />
        <Ic d={ICONS.volume} size={19} />
        <div style={{ width: 100, height: 5, borderRadius: 99, background: dirA.bg2, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, width: "62%", borderRadius: 99, background: dirA.mut }}></div>
        </div>
      </div>
    </footer>
  </div>
);

window.DirectionA = DirectionA;
