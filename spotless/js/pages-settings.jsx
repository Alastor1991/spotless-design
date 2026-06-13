// Spotless — Настройки: внешний вид, язык/валюта, обучение, продвинутое, аккаунт.

const THEME_LIST = [
  { id: "dark-warm", ru: "Тёплая ночь", en: "Warm night", bg: "oklch(0.22 0.012 75)", fg: "oklch(0.93 0.015 90)", acc: "oklch(0.80 0.13 95)" },
  { id: "dark-neutral", ru: "Студия", en: "Studio", bg: "oklch(0.20 0.008 255)", fg: "oklch(0.92 0.008 250)", acc: "oklch(0.80 0.13 95)" },
  { id: "dark-sea", ru: "Глубина", en: "Deep sea", bg: "oklch(0.22 0.012 75)", fg: "oklch(0.93 0.01 240)", acc: "oklch(0.76 0.11 230)" },
  { id: "light-cream", ru: "Солнечная", en: "Sunny", bg: "oklch(0.972 0.012 95)", fg: "oklch(0.28 0.02 80)", acc: "oklch(0.78 0.13 95)" },
  { id: "light-neutral", ru: "Бумага", en: "Paper", bg: "oklch(0.975 0.003 250)", fg: "oklch(0.27 0.01 260)", acc: "oklch(0.78 0.13 95)" },
  { id: "light-rose", ru: "Зефир", en: "Marshmallow", bg: "oklch(0.972 0.008 350)", fg: "oklch(0.28 0.02 340)", acc: "oklch(0.74 0.12 350)" },
];

const ThemeSwatch = ({ th, active, onClick, size = "norm" }) => {
  const app = useApp();
  return (
    <button onClick={onClick} style={{
      borderRadius: 14, padding: 4,
      outline: active ? "2.5px solid var(--acc)" : "1px solid var(--line)",
      outlineOffset: 2, background: "transparent", textAlign: "left",
    }}>
      <div style={{
        width: size === "norm" ? 132 : 150, height: size === "norm" ? 84 : 96, borderRadius: 11,
        background: th.bg, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", left: 10, top: 10, width: 36, height: 5, borderRadius: 99, background: th.fg, opacity: 0.85 }}></div>
        <div style={{ position: "absolute", left: 10, top: 21, width: 56, height: 5, borderRadius: 99, background: th.fg, opacity: 0.4 }}></div>
        <div style={{ position: "absolute", left: 10, bottom: 10, right: 10, height: 16, borderRadius: 99, background: `color-mix(in oklab, ${th.fg} 12%, ${th.bg})`, display: "flex", alignItems: "center", paddingLeft: 5, gap: 4 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: th.acc }}></span>
          <span style={{ width: 26, height: 3.5, borderRadius: 99, background: th.fg, opacity: 0.5 }}></span>
        </div>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 700, padding: "8px 4px 4px", color: "var(--text)" }}>
        {app ? (app.lang === "ru" ? th.ru : th.en) : th.ru}
      </div>
    </button>
  );
};

const SettingRow = ({ label, note, children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14.5, fontWeight: 600 }}>{label}</div>
      {note && <div style={{ fontSize: 12.5, color: "var(--mut)", marginTop: 3, lineHeight: 1.5 }}>{note}</div>}
    </div>
    <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>{children}</div>
  </div>
);

const Seg = ({ options, value, onChange }) => (
  <div style={{ display: "flex", background: "var(--bg2)", borderRadius: 99, padding: 3 }}>
    {options.map(([k, label]) => (
      <button key={k} onClick={() => onChange(k)} style={{
        padding: "6px 14px", borderRadius: 99, fontSize: 12.5, fontWeight: 700,
        background: value === k ? "var(--acc)" : "transparent",
        color: value === k ? "var(--acc-ink)" : "var(--mut)",
      }}>{label}</button>
    ))}
  </div>
);

// Общественные темы: каждая применяет базовую тему + свой акцент
const COMMUNITY_THEMES = [
  { id: "c-amber", ru: "Янтарь", en: "Amber", base: "dark-warm", accent: 75, by: "@kostya", bg: "oklch(0.21 0.014 70)", fg: "oklch(0.93 0.015 85)", acc: "oklch(0.80 0.13 80)" },
  { id: "c-mint", ru: "Мята", en: "Mint", base: "dark-neutral", accent: 160, by: "@dasha", bg: "oklch(0.20 0.01 200)", fg: "oklch(0.92 0.01 180)", acc: "oklch(0.78 0.12 160)" },
  { id: "c-grape", ru: "Виноград", en: "Grape", base: "dark-sea", accent: 300, by: "@nikita", bg: "oklch(0.21 0.016 300)", fg: "oklch(0.93 0.01 300)", acc: "oklch(0.74 0.13 320)" },
  { id: "c-paper", ru: "Сепия", en: "Sepia", base: "light-cream", accent: 55, by: "@vera", bg: "oklch(0.96 0.018 85)", fg: "oklch(0.30 0.03 70)", acc: "oklch(0.70 0.12 60)" },
  { id: "c-ink", ru: "Чернила", en: "Ink", base: "light-neutral", accent: 250, by: "@sam", bg: "oklch(0.97 0.004 250)", fg: "oklch(0.26 0.02 260)", acc: "oklch(0.62 0.14 255)" },
  { id: "c-coral", ru: "Коралл", en: "Coral", base: "light-rose", accent: 25, by: "@lena", bg: "oklch(0.97 0.012 30)", fg: "oklch(0.30 0.03 25)", acc: "oklch(0.70 0.15 30)" },
];

// Галерея тем сообщества
const GalleryModal = ({ close }) => {
  const app = useApp();
  const t = app.t;
  return (
    <div className="scrim fade-in" onClick={close}>
      <div className="modal fade-up" onClick={(e) => e.stopPropagation()} style={{ width: 560 }} data-screen-label="Галерея тем">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{t.stThemeGallery}</div>
          <button className="iconbtn" onClick={close}><Ic d={ICONS.x} size={16} /></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {COMMUNITY_THEMES.map(th => (
            <button key={th.id} onClick={() => { app.setTheme(th.base); app.setAccent(th.accent); app.toast(`${t.galApplied} «${app.lang === "ru" ? th.ru : th.en}»`); close(); }}
              style={{ borderRadius: 14, padding: 4, outline: "1px solid var(--line)", textAlign: "left" }}
              onMouseEnter={(e) => e.currentTarget.style.outline = "2px solid var(--acc)"}
              onMouseLeave={(e) => e.currentTarget.style.outline = "1px solid var(--line)"}>
              <div style={{ width: "100%", height: 78, borderRadius: 10, background: th.bg, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 9, top: 9, width: 32, height: 5, borderRadius: 99, background: th.fg, opacity: 0.85 }}></div>
                <div style={{ position: "absolute", left: 9, top: 19, width: 48, height: 5, borderRadius: 99, background: th.fg, opacity: 0.4 }}></div>
                <div style={{ position: "absolute", left: 9, bottom: 9, right: 9, height: 14, borderRadius: 99, background: `color-mix(in oklab, ${th.fg} 12%, ${th.bg})`, display: "flex", alignItems: "center", paddingLeft: 5, gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: th.acc }}></span>
                </div>
              </div>
              <div style={{ padding: "8px 4px 4px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{app.lang === "ru" ? th.ru : th.en}</div>
                <div style={{ fontSize: 11.5, color: "var(--mut)", marginTop: 2 }}>{t.galBy} {th.by}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Транзакции
const TxModal = ({ close }) => {
  const app = useApp();
  const t = app.t;
  const rows = [
    { d: app.lang === "ru" ? "12 июня" : "Jun 12", title: app.lang === "ru" ? "Ежемесячная поддержка" : "Monthly support", amount: -5.0, fee: 0.012 },
    { d: app.lang === "ru" ? "9 июня" : "Jun 9", title: app.lang === "ru" ? "Донат · Молоко и мёд" : "Tip · Молоко и мёд", amount: -1.0, fee: 0.011 },
    { d: app.lang === "ru" ? "3 июня" : "Jun 3", title: app.lang === "ru" ? "Донат · Грунт" : "Tip · Грунт", amount: -1.0, fee: 0.012 },
    { d: app.lang === "ru" ? "1 июня" : "Jun 1", title: app.lang === "ru" ? "Пополнение с карты" : "Top up from card", amount: 10.0, fee: 0.24 },
  ];
  return (
    <div className="scrim fade-in" onClick={close}>
      <div className="modal fade-up" onClick={(e) => e.stopPropagation()} style={{ width: 480 }} data-screen-label="Транзакции">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{t.stTx}</div>
          <button className="iconbtn" onClick={close}><Ic d={ICONS.x} size={16} /></button>
        </div>
        <p style={{ fontSize: 12.5, color: "var(--mut)", marginBottom: 14, lineHeight: 1.5 }}>{t.txNote}</p>
        <div>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
              <span style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--bg2)", color: r.amount < 0 ? "var(--acc)" : "oklch(0.7 0.13 150)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Ic d={r.amount < 0 ? ICONS.dollar : ICONS.downloadCircle} size={16} />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 13.5, fontWeight: 600 }}>{r.title}</span>
                <span style={{ display: "block", fontSize: 11.5, color: "var(--mut)", marginTop: 1 }}>{r.d} · {app.lang === "ru" ? "комиссия" : "fee"} ${r.fee.toFixed(3)}</span>
              </span>
              <span className="mono" style={{ fontSize: 13.5, fontWeight: 700, color: r.amount < 0 ? "var(--text)" : "oklch(0.7 0.13 150)" }}>
                {r.amount < 0 ? "−" : "+"}${Math.abs(r.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PageSettings = () => {
  const app = useApp();
  const t = app.t;
  const [section, setSection] = React.useState("appearance");
  const [seedShown, setSeedShown] = React.useState(false);
  const [gallery, setGallery] = React.useState(false);
  const [txOpen, setTxOpen] = React.useState(false);
  const [importOpen, setImportOpen] = React.useState(false);
  const [importVal, setImportVal] = React.useState("");
  const [folder, setFolder] = React.useState("music");
  const wallRef = React.useRef(null);
  const exportTheme = () => {
    const json = JSON.stringify({ theme: app.theme, accent: S.accent, wallpaper: S.wallpaper, island: S.island, density: S.density }, null, 0);
    try { navigator.clipboard.writeText(json); } catch {}
    app.toast(t.themeCopied);
  };
  const applyImport = () => {
    try {
      const o = JSON.parse(importVal);
      if (o.theme) app.setTheme(o.theme);
      app.setSettings({ ...S, accent: o.accent ?? S.accent, wallpaper: o.wallpaper ?? S.wallpaper, island: o.island || S.island, density: o.density || S.density });
      app.toast(t.imported); setImportOpen(false); setImportVal("");
    } catch { app.toast(t.importBad); }
  };
  const pickWallpaper = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => { app.setWallpaperImg(r.result); app.toast(t.wallpaperSet); };
    r.readAsDataURL(f);
    e.target.value = "";
  };
  const [pb, setPb] = React.useState({ stream: "auto", dlq: "high", metered: false, cache: "5", normalize: true, cross: "0", gapless: true });
  const S = app.settings;

  const sections = [
    ["appearance", t.stAppearance, "sparkle"],
    ["playback", t.stPlayback, "volume"],
    ["lang", t.stLang, "globe"],
    ["help", t.stHelp, "bell"],
    ["account", t.stAccount, "user"],
    ["advanced", t.stAdvanced, "key"],
  ];

  return (
    <div className="fade-in settings-grid" data-screen-label="Настройки">
      <nav className="set-nav" style={{ paddingTop: 26 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 18, paddingLeft: 14 }}>{t.stTitle}</h1>
        {sections.map(([k, label, icon]) => (
          <button key={k} className={"navitem" + (section === k ? " active" : "")} style={{ fontSize: 14, padding: "9px 14px" }} onClick={() => setSection(k)}>
            <Ic d={ICONS[icon]} size={18} />{label}
          </button>
        ))}
      </nav>

      <div className="set-pane">
        {section === "appearance" && (
          <div className="fade-up">
            <div className="sec-label" style={{ marginBottom: 14 }}>{t.stThemes}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, max-content)", gap: 14, marginBottom: 10 }}>
              {THEME_LIST.map(th => (
                <ThemeSwatch key={th.id} th={th} active={app.theme === th.id} onClick={() => app.setTheme(th.id)} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 14, marginBottom: 26, flexWrap: "wrap" }}>
              <button className="more" style={{ display: "flex", gap: 6, alignItems: "center" }} onClick={() => setGallery(true)}><Ic d={ICONS.sparkle} size={14} />{t.stThemeGallery}</button>
              <button className="more" style={{ display: "flex", gap: 6, alignItems: "center" }} onClick={exportTheme}><Ic d={ICONS.shareIc} size={14} />{t.stThemeShare}</button>
              <button className="more" style={{ display: "flex", gap: 6, alignItems: "center" }} onClick={exportTheme}><Ic d={ICONS.download} size={14} />{t.stExport} · JSON</button>
              <button className="more" style={{ display: "flex", gap: 6, alignItems: "center" }} onClick={() => setImportOpen(!importOpen)}><Ic d={ICONS.refresh} size={14} />{t.apply} JSON</button>
            </div>
            {importOpen && (
              <div className="fade-up" style={{ display: "flex", gap: 8, marginBottom: 22 }}>
                <input value={importVal} autoFocus placeholder={t.importPh}
                  onChange={(e) => setImportVal(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") applyImport(); }}
                  className="mono"
                  style={{ flex: 1, background: "var(--bg2)", border: "1px solid var(--line)", borderRadius: "var(--r-sm)", padding: "10px 13px", fontSize: 12.5, color: "var(--text)", outline: "none" }} />
                <button className="btn" style={{ padding: "10px 20px", fontSize: 13 }} onClick={applyImport}>{t.apply}</button>
              </div>
            )}

            <input ref={wallRef} type="file" accept="image/*" style={{ display: "none" }} onChange={pickWallpaper} />
            <SettingRow label={t.stWallpaper} note={app.lang === "ru" ? "Своя картинка, градиент или паттерн за основным фоном" : "Your image, a gradient or a pattern behind the app"}>
              <div style={{ display: "flex", gap: 6 }}>
                {[null, 30, 210, 320].map((h, i) => (
                  <button key={i} onClick={() => app.setWallpaper(h)} style={{
                    width: 44, height: 32, borderRadius: 8,
                    outline: (S.wallpaper === h && !S.wallpaperImg) ? "2px solid var(--acc)" : "1px solid var(--line)", outlineOffset: 1.5,
                    background: h == null ? "var(--bg0)" : `linear-gradient(135deg, oklch(var(--cover-l1) 0.05 ${h}), oklch(var(--cover-l2) 0.05 ${h + 60}))`,
                    display: "flex", alignItems: "center", justifyContent: "center", color: "var(--mut)",
                  }}>{h == null && <Ic d={ICONS.x} size={12} />}</button>
                ))}
                <button onClick={() => wallRef.current && wallRef.current.click()} style={{
                  width: 44, height: 32, borderRadius: 8,
                  outline: S.wallpaperImg ? "2px solid var(--acc)" : "none",
                  border: S.wallpaperImg ? "none" : "1px dashed var(--mut)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "var(--mut)", overflow: "hidden",
                  background: S.wallpaperImg ? `url(${S.wallpaperImg}) center / cover` : "transparent",
                }}>{!S.wallpaperImg && <Ic d={ICONS.image} size={14} />}</button>
              </div>
            </SettingRow>
            <SettingRow label={t.stIsland}>
              <Seg value={S.island} onChange={(v) => app.setSettings({ ...S, island: v })}
                options={[["pill", t.stIslandPill], ["square", t.stIslandSquare]]} />
            </SettingRow>
            <SettingRow label={t.stDensity}>
              <Seg value={S.density} onChange={(v) => app.setSettings({ ...S, density: v })}
                options={[["c", t.stDensityC], ["n", t.stDensityN], ["s", t.stDensityS]]} />
            </SettingRow>
            <SettingRow label={t.stAccent} note={app.lang === "ru" ? "Подменяет акцент выбранной темы" : "Overrides the theme's accent"}>
              <div style={{ display: "flex", gap: 6 }}>
                {[95, 230, 350, 160].map(h => (
                  <button key={h} onClick={() => app.setAccent(h)} style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: `oklch(0.78 0.12 ${h})`,
                    outline: S.accent === h ? "2.5px solid var(--text)" : "none", outlineOffset: 2,
                  }}></button>
                ))}
                <button onClick={() => app.setAccent(null)} style={{
                  width: 30, height: 30, borderRadius: "50%", border: "1px dashed var(--mut)",
                  color: "var(--mut)", display: "flex", alignItems: "center", justifyContent: "center",
                }} title="reset"><Ic d={ICONS.refresh} size={13} /></button>
              </div>
            </SettingRow>
          </div>
        )}

        {section === "playback" && (
          <div className="fade-up">
            <SettingRow label={t.qStream} note={t.qNote}>
              <Seg value={pb.stream} onChange={(v) => setPb({ ...pb, stream: v })}
                options={[["auto", t.qAuto], ["high", t.qHigh], ["lossless", t.qLossless]]} />
            </SettingRow>
            <SettingRow label={t.qDownload}>
              <Seg value={pb.dlq} onChange={(v) => setPb({ ...pb, dlq: v })}
                options={[["high", t.qHigh], ["lossless", t.qLossless]]} />
            </SettingRow>
            <SettingRow label={t.metered} note={t.meteredNote}>
              <button className={"toggle" + (pb.metered ? " on" : "")} onClick={() => setPb({ ...pb, metered: !pb.metered })}></button>
            </SettingRow>
            <SettingRow label={t.dlFolder} note={folder === "music" ? "~/Music/Spotless" : folder === "down" ? "~/Downloads/Spotless" : "/mnt/media/spotless"}>
              <Seg value={folder} onChange={(v) => { setFolder(v); app.toast(t.folderSaved); }}
                options={[["music", "~/Music"], ["down", "~/Downloads"], ["ext", t.folderCustom]]} />
            </SettingRow>
            <SettingRow label={t.cacheLimit} note={t.cacheNote}>
              <Seg value={pb.cache} onChange={(v) => setPb({ ...pb, cache: v })}
                options={[["1", "1 GB"], ["5", "5 GB"], ["10", "10 GB"]]} />
            </SettingRow>
            <SettingRow label={t.normalize}>
              <button className={"toggle" + (pb.normalize ? " on" : "")} onClick={() => setPb({ ...pb, normalize: !pb.normalize })}></button>
            </SettingRow>
            <SettingRow label={t.crossfade}>
              <Seg value={pb.cross} onChange={(v) => setPb({ ...pb, cross: v })}
                options={[["0", t.offLabel], ["4", "4 s"], ["8", "8 s"]]} />
            </SettingRow>
            <SettingRow label={t.gapless}>
              <button className={"toggle" + (pb.gapless ? " on" : "")} onClick={() => setPb({ ...pb, gapless: !pb.gapless })}></button>
            </SettingRow>
          </div>
        )}

        {section === "lang" && (
          <div className="fade-up">
            <SettingRow label={t.stLangUI}>
              <Seg value={app.lang} onChange={app.setLang} options={[["ru", "Русский"], ["en", "English"]]} />
            </SettingRow>
            <SettingRow label={t.stCurrency} note={t.stCurrencyNote}>
              <Seg value={app.currency} onChange={app.setCurrency} options={[["usd", "$ USD"], ["eur", "€ EUR"], ["gbp", "£ GBP"]]} />
            </SettingRow>
          </div>
        )}

        {section === "help" && (
          <div className="fade-up">
            <SettingRow label={t.stReplayTour} note={app.lang === "ru" ? "Те же три карточки, что и при первом входе" : "The same three cards you saw on first launch"}>
              <button className="btn ghost" style={{ padding: "8px 18px", fontSize: 13 }} onClick={() => app.go("onboarding")}>
                <Ic d={ICONS.refresh} size={14} />{app.lang === "ru" ? "Запустить" : "Start"}
              </button>
            </SettingRow>
            <SettingRow label={t.stCards} note={app.lang === "ru" ? "Пошаговые объяснения каждого раздела — если что-то осталось непонятным" : "Step-by-step guides for every section"}>
              <button className="iconbtn" style={{ width: 30, height: 30 }} onClick={() => app.go("onboarding")}><Ic d={ICONS.chevR} size={17} style={{ color: "var(--mut)" }} /></button>
            </SettingRow>
          </div>
        )}

        {section === "account" && (
          <div className="fade-up">
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "6px 0 18px" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "var(--acc)" }}>Л</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>Лиза</div>
                <div style={{ fontSize: 13, color: "var(--mut)" }}>liza.k@gmail.com · Google</div>
              </div>
            </div>
            <SettingRow label={t.stProfile} note={app.lang === "ru" ? "Профиль, плейлисты и активность видны друзьям" : "Profile, playlists and activity are visible to friends"}>
              <span className={"toggle on"}></span>
            </SettingRow>
            <SettingRow label={t.stIncomeVisible} note={app.lang === "ru" ? "Для аккаунтов артистов: показывать доходы на странице" : "For artist accounts: show earnings on your page"}>
              <span className={"toggle on"}></span>
            </SettingRow>
          </div>
        )}

        {section === "advanced" && (
          <div className="fade-up">
            <p style={{ fontSize: 13.5, color: "var(--mut)", lineHeight: 1.6, marginBottom: 18, padding: "12px 16px", background: "var(--bg1)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)" }}>
              {t.stAdvancedNote}
            </p>
            <SettingRow label={t.stSeed} note={t.stSeedNote}>
              <button className="btn ghost" style={{ padding: "8px 16px", fontSize: 13 }} onClick={() => setSeedShown(!seedShown)}>
                <Ic d={ICONS.eye} size={14} />{t.stSeedShow}
              </button>
            </SettingRow>
            {seedShown && (
              <div className="fade-up mono" style={{
                margin: "12px 0", padding: "14px 18px", background: "var(--bg1)", border: "1px solid var(--line)",
                borderRadius: "var(--r-sm)", fontSize: 13, lineHeight: 2, color: "var(--text)", letterSpacing: "0.02em",
              }}>
                lunar&nbsp; velvet&nbsp; anchor&nbsp; tide&nbsp; paper&nbsp; humming&nbsp; gravel&nbsp; north&nbsp; cassette&nbsp; ember&nbsp; quiet&nbsp; arc
                <button className="iconbtn" style={{ width: 28, height: 28, marginLeft: 8, verticalAlign: "middle" }} onClick={() => app.toast(t.copied)}>
                  <Ic d={ICONS.copy} size={14} />
                </button>
              </div>
            )}
            <SettingRow label={t.stAddress}>
              <span className="mono" style={{ fontSize: 12.5, color: "var(--mut)" }}>spl1q…e7xw4</span>
              <button className="iconbtn" style={{ width: 30, height: 30 }} onClick={() => app.toast(t.copied)}><Ic d={ICONS.copy} size={14} /></button>
            </SettingRow>
            <SettingRow label={t.stTx} note={app.lang === "ru" ? "Июнь: 1 поддержка ($5.00) + 2 доната ($2.00) · комиссия сети $0.012" : "June: 1 support ($5.00) + 2 donations ($2.00) · network fee $0.012"}>
              <button className="more" style={{ display: "flex", gap: 4, alignItems: "center" }} onClick={() => setTxOpen(true)}>{t.stTxAll}<Ic d={ICONS.chevR} size={14} /></button>
            </SettingRow>
            <SettingRow label={t.stPeers} note="12 peers · DHT ok · relay off">
              <span className="mono" style={{ fontSize: 12, color: "oklch(0.7 0.13 150)" }}>● online</span>
            </SettingRow>
            <SettingRow label={t.stConfig} note="~/.config/spotless/config.toml">
              <button className="more" style={{ display: "flex", gap: 4, alignItems: "center" }} onClick={() => app.toast(app.lang === "ru" ? "Открыто в редакторе" : "Opened in editor")}>{app.lang === "ru" ? "Открыть" : "Open"}<Ic d={ICONS.chevR} size={14} /></button>
            </SettingRow>
          </div>
        )}
      </div>
      {gallery && <GalleryModal close={() => setGallery(false)} />}
      {txOpen && <TxModal close={() => setTxOpen(false)} />}
    </div>
  );
};

Object.assign(window, { PageSettings, THEME_LIST, ThemeSwatch });
