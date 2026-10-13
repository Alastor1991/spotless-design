// Spotless — Настройки: разделы слева, содержимое раздела справа. Каждый раздел — свой компонент.

const THEME_LIST = [
  // Образцы: фон, текст и горячий цвет палитры (как в app.css)
  { id: "dot", ru: "Точка", en: "Dot", bg: "#000000", fg: "#F2F2F2", acc: "#D71921" },
  { id: "dark-warm", ru: "Тёплая ночь", en: "Warm night", bg: "oklch(0.20 0.012 75)", fg: "oklch(0.93 0.015 90)", acc: "oklch(0.82 0.14 90)" },
  { id: "dark-neutral", ru: "Студия", en: "Studio", bg: "oklch(0.185 0.008 255)", fg: "oklch(0.92 0.008 250)", acc: "oklch(0.82 0.14 90)" },
  { id: "dark-sea", ru: "Глубина", en: "Deep sea", bg: "oklch(0.20 0.012 75)", fg: "oklch(0.93 0.01 240)", acc: "oklch(0.76 0.12 230)" },
  { id: "light-cream", ru: "Солнечная", en: "Sunny", bg: "oklch(0.972 0.012 95)", fg: "oklch(0.28 0.02 80)", acc: "oklch(0.62 0.15 60)" },
  { id: "light-neutral", ru: "Бумага", en: "Paper", bg: "oklch(0.975 0.003 250)", fg: "oklch(0.24 0.01 260)", acc: "#D71921" },
  { id: "light-rose", ru: "Зефир", en: "Marshmallow", bg: "oklch(0.972 0.008 350)", fg: "oklch(0.28 0.02 340)", acc: "oklch(0.58 0.18 355)" },
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
  <div className="set-row" style={{ display: "flex", alignItems: "center", gap: 20, padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14.5, fontWeight: 600 }}>{label}</div>
      {note && <div style={{ fontSize: 12.5, color: "var(--mut)", marginTop: 3, lineHeight: 1.5 }}>{note}</div>}
    </div>
    <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>{children}</div>
  </div>
);

// Переключатель из нескольких вариантов. Вид — классами (.seg): у Material это группа кнопок
const Seg = ({ options, value, onChange }) => (
  <div className="seg" role="group">
    {options.map(([k, label]) => (
      <button key={k} className={"seg-btn" + (value === k ? " is-on" : "")} aria-pressed={value === k} onClick={() => onChange(k)}>{label}</button>
    ))}
  </div>
);

// Переключатель вкл/выкл
const Toggle = ({ on, onClick }) => <button className={"toggle" + (on ? " on" : "")} onClick={onClick}></button>;

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
const GalleryModal = ({ close, out }) => {
  const app = useApp();
  const t = app.t;
  const apply = (th) => {
    app.setTheme(th.base); app.setAccent(th.accent);
    app.toast(`${t.galApplied} «${app.lang === "ru" ? th.ru : th.en}»`);
    close();
  };
  return (
    <Sheet close={close} out={out} width={560} label={t.stThemeGallery} screen="Галерея тем">
      <SheetHead title={t.stThemeGallery} close={close} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {COMMUNITY_THEMES.map(th => (
          <button key={th.id} className="gal-card" onClick={() => apply(th)} style={{ borderRadius: 14, padding: 4, textAlign: "left" }}>
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
    </Sheet>
  );
};

// Дата своей операции: «11 октября» / «Oct 11» — как у записей из мок-базы
const txDate = (iso, ru) => new Date(iso).toLocaleDateString(ru ? "ru-RU" : "en-US", ru ? { day: "numeric", month: "long" } : { month: "short", day: "numeric" });

// История операций: записи мок-базы и свои (пополнения, донаты); суммы — свои, комиссии сети — в долларах, по курсу
const TxModal = ({ close, out }) => {
  const app = useApp();
  const t = app.t;
  const m = app.money;
  const ru = app.lang === "ru";
  return (
    <Sheet close={close} out={out} width={480} label={t.stTx} screen="Транзакции">
      <SheetHead title={t.stTx} close={close} style={{ marginBottom: 6 }} />
      <p style={{ fontSize: 12.5, color: "var(--mut)", marginBottom: 14, lineHeight: 1.5 }}>{t.txNote}</p>
      <div>
        {app.txs.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
            <span className={r.amount < 0 ? undefined : "ok-text"} style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--bg2)", color: r.amount < 0 ? "var(--acc)" : undefined, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Ic d={r.amount < 0 ? ICONS.dollar : ICONS.downloadCircle} size={16} />
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 13.5, fontWeight: 600 }}>{r.kind === "topup" ? t.txTopUp : r.kind === "tip" ? t.txTip(r.name) : ru ? r.title : r.titleEn}</span>
              <span style={{ display: "block", fontSize: 11.5, color: "var(--mut)", marginTop: 1 }}>{r.at ? txDate(r.at, ru) : ru ? r.d : r.dEn} · {t.txFee} {m.fee(m.usd(r.fee))}</span>
            </span>
            <span className={"mono" + (r.amount < 0 ? "" : " ok-text")} style={{ fontSize: 13.5, fontWeight: 700, color: r.amount < 0 ? "var(--text)" : undefined }}>
              {r.amount < 0 ? "−" : "+"}{m.fmt(Math.abs(r.amount), true)}
            </span>
          </div>
        ))}
      </div>
    </Sheet>
  );
};

// Картинку для обоев уменьшаем и пережимаем в JPEG: целая фотография с телефона (3–8 МБ) не влезала
// в localStorage (~5 МБ на сайт), и после этого переставало сохраняться вообще всё. Обои лежат
// за затемнением, так что 1600 px по длинной стороне хватает с запасом.
const shrinkImage = (file, max = 1600, quality = 0.82) => new Promise((resolve, reject) => {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(img.naturalWidth * k));
    c.height = Math.max(1, Math.round(img.naturalHeight * k));
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(url);
    resolve(c.toDataURL("image/jpeg", quality));
  };
  img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("not an image")); };
  img.src = url;
});

// ---------- Разделы ----------
// Окна (галерея тем, транзакции) открывает страница — через openModal: лист рендерится в body,
// но пусть живёт дольше раздела, из которого его открыли.

// Тема: экспорт в буфер и импорт из JSON. Импорт берёт только известное и только допустимые
// значения (cleanSettings) — раньше сохранялось что угодно, например несуществующая тема или «island»: "zzz"
const ThemeTools = ({ openModal }) => {
  const app = useApp();
  const t = app.t;
  const S = app.settings;
  const [importOpen, setImportOpen] = React.useState(false);
  const [importVal, setImportVal] = React.useState("");
  const exportTheme = () => {
    const json = JSON.stringify({ style: S.style, theme: app.theme, accent: S.accent, mTheme: S.mTheme, mAccent: S.mAccent, wallpaper: S.wallpaper, island: S.island, density: S.density }, null, 0);
    copyText(json);
    app.toast(t.themeCopied);
  };
  const applyImport = () => {
    let o = null;
    try { o = JSON.parse(importVal); } catch (e) {}
    const themeOk = !!o && THEME_LIST.some(th => th.id === o.theme);
    const next = o && typeof o === "object" ? cleanSettings({ ...o, wallpaperImg: undefined }, S) : S;
    if (!themeOk && Object.keys(next).every(k => next[k] === S[k])) { app.toast(t.importBad); return; } // ничего годного
    if (themeOk) app.setTheme(o.theme);
    app.setSettings(next);
    app.toast(t.imported); setImportOpen(false); setImportVal("");
  };
  const link = (icon, label, onClick) => (
    <button className="more" style={{ display: "flex", gap: 6, alignItems: "center" }} onClick={onClick}><Ic d={ICONS[icon]} size={14} />{label}</button>
  );
  return (
    <React.Fragment>
      <div style={{ display: "flex", gap: 14, marginBottom: 26, flexWrap: "wrap" }}>
        {link("sparkle", t.stThemeGallery, () => openModal("gallery"))}
        {link("shareIc", t.stThemeShare, exportTheme)}
        {link("download", t.stExport + " · JSON", exportTheme)}
        {link("refresh", t.apply + " JSON", () => setImportOpen(!importOpen))}
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
    </React.Fragment>
  );
};

// Обои: нет, три градиента или своя картинка
const WallpaperPicker = () => {
  const app = useApp();
  const t = app.t;
  const S = app.settings;
  const fileRef = React.useRef(null);
  const pick = (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!f) return;
    shrinkImage(f).then((data) => { app.setWallpaperImg(data); app.toast(t.wallpaperSet); }, () => app.toast(t.wallpaperBad));
  };
  return (
    <React.Fragment>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={pick} />
      <SettingRow label={t.stWallpaper} note={t.stWallpaperNote}>
        <div style={{ display: "flex", gap: 6 }}>
          {[null, 30, 210, 320].map((h, i) => (
            <button key={i} onClick={() => app.setWallpaper(h)} style={{
              width: 44, height: 32, borderRadius: 8,
              outline: (S.wallpaper === h && !S.wallpaperImg) ? "2px solid var(--acc)" : "1px solid var(--line)", outlineOffset: 1.5,
              background: h == null ? "var(--bg0)" : `linear-gradient(135deg, oklch(var(--cover-l1) 0.05 ${h}), oklch(var(--cover-l2) 0.05 ${h + 60}))`,
              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--mut)",
            }}>{h == null && <Ic d={ICONS.x} size={12} />}</button>
          ))}
          <button onClick={() => fileRef.current && fileRef.current.click()} style={{
            width: 44, height: 32, borderRadius: 8,
            outline: S.wallpaperImg ? "2px solid var(--acc)" : "none",
            border: S.wallpaperImg ? "none" : "1px dashed var(--mut)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "var(--mut)", overflow: "hidden",
            background: S.wallpaperImg ? `url("${S.wallpaperImg}") center / cover` : "transparent",
          }}>{!S.wallpaperImg && <Ic d={ICONS.image} size={14} />}</button>
        </div>
      </SettingRow>
    </React.Fragment>
  );
};

// Образец архитектуры стиля: свой рисунок у каждой — по нему видно, чем они отличаются,
// какой бы стиль ни был выбран сейчас (цвета — из STYLE_PREVIEW, style.jsx)
const StyleSwatch = ({ id, active, onClick, wide }) => {
  const app = useApp();
  const st = STYLE_LIST.find(s => s.id === id);
  const c = STYLE_PREVIEW[id];
  return (
    <button className={"style-card" + (active ? " is-on" : "")} aria-pressed={active} onClick={onClick}>
      <span className="style-pv" style={{ background: c.bg, width: wide ? "100%" : undefined }} aria-hidden="true">
        {id === "dot" ? (
          <React.Fragment>
            <span style={{ position: "absolute", left: 12, top: 12, width: 40, height: 4, borderRadius: 2, background: c.fg }}></span>
            <span style={{ position: "absolute", left: 58, top: 11, width: 6, height: 6, borderRadius: 3, background: c.hot }}></span>
            <span style={{ position: "absolute", left: 12, right: 12, top: 34, height: 6, background: `radial-gradient(circle, ${c.fg} 0 2px, transparent 2.5px) 0 0 / 8px 6px repeat-x` }}></span>
            <span style={{ position: "absolute", left: 12, right: 12, bottom: 12, height: 22, borderRadius: 11, boxShadow: `inset 0 0 0 1px ${c.line}`, display: "flex", alignItems: "center", padding: "0 3px", gap: 6 }}>
              <span style={{ width: 16, height: 16, borderRadius: 8, background: c.fg }}></span>
              <span style={{ width: 34, height: 3, borderRadius: 2, background: c.mut }}></span>
            </span>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <span style={{ position: "absolute", left: 10, right: 10, top: 10, height: 40, borderRadius: 10, background: c.card, display: "flex", alignItems: "center", padding: "0 8px", gap: 8 }}>
              <span style={{ width: 24, height: 24, borderRadius: 8, background: c.acc }}></span>
              <span style={{ flex: 1, height: 8, background: c.acc, WebkitMask: STYLE_WAVE, mask: STYLE_WAVE }}></span>
            </span>
            <span style={{ position: "absolute", left: 10, right: 10, bottom: 10, height: 24, borderRadius: 12, background: c.bar, boxShadow: "0 2px 6px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
              <span style={{ width: 22, height: 12, borderRadius: 6, background: c.ind }}></span>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: c.mut }}></span>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: c.mut }}></span>
            </span>
          </React.Fragment>
        )}
      </span>
      <span className="style-name">{app.lang === "ru" ? st.ru : st.en}</span>
    </button>
  );
};

// Акцент Material: из обложки (по умолчанию) или постоянный цвет
const MAccentPicker = () => {
  const app = useApp();
  const t = app.t;
  const cur = app.settings.mAccent;
  const light = app.mTheme === "light";
  const ring = (on) => (on ? "m-sw is-on" : "m-sw");
  const tr = DB.trackIndex[app.player.trackId];
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
      <button className={ring(cur == null)} title={t.stFromCover} aria-label={t.stFromCover} aria-pressed={cur == null} onClick={() => app.setMAccent(null)}>
        <Cover art={tr.album} hue={DB.albums[tr.album].hue} size={34} round={true} />
      </button>
      {M_ACCENTS.map(a => (
        <button key={a.id} className={ring(cur === a.id)} title={app.lang === "ru" ? a.ru : a.en} aria-label={app.lang === "ru" ? a.ru : a.en} aria-pressed={cur === a.id}
          onClick={() => app.setMAccent(a.id)}>
          <span style={{ width: 34, height: 34, borderRadius: 17, background: a.acc ? a.acc[light ? 1 : 0] : "var(--text)" }}></span>
        </button>
      ))}
    </div>
  );
};

const SetAppearance = ({ openModal }) => {
  const app = useApp();
  const t = app.t;
  const S = app.settings;
  const set = (k) => (v) => app.setSettings({ ...S, [k]: v });
  const material = app.style === "material";
  return (
    <div className="fade-up">
      <div className="sec-label" style={{ marginBottom: 6 }}>{t.stStyle}</div>
      <p style={{ fontSize: 12.5, color: "var(--mut)", lineHeight: 1.5, marginBottom: 14, maxWidth: 520 }}>{t.stStyleNote}</p>
      <div className="style-grid">
        {STYLE_LIST.map(s => <StyleSwatch key={s.id} id={s.id} active={app.style === s.id} onClick={() => app.setStyle(s.id)} />)}
      </div>
      {material ? (
        <React.Fragment>
          <SettingRow label={t.stTheme}>
            <Seg value={S.mTheme} onChange={app.setMTheme}
              options={[["dark", t.stThemeDark], ["light", t.stThemeLight], ["system", t.stThemeSystem]]} />
          </SettingRow>
          <SettingRow label={t.stAccent} note={t.stMAccentNote}><MAccentPicker /></SettingRow>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="sec-label" style={{ marginBottom: 14 }}>{t.stThemes}</div>
          <div className="theme-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, max-content)", gap: 14, marginBottom: 10 }}>
            {THEME_LIST.map(th => (
              <ThemeSwatch key={th.id} th={th} active={app.theme === th.id} onClick={() => app.setTheme(th.id)} />
            ))}
          </div>
          <ThemeTools openModal={openModal} />
        </React.Fragment>
      )}
      <WallpaperPicker />
      <SettingRow label={t.stIsland} note={t.stIslandNote}>
        <Seg value={S.island} onChange={set("island")}
          options={[["pill", t.stIslandPill], ["square", t.stIslandSquare], ["panel", t.stIslandDock]]} />
      </SettingRow>
      <SettingRow label={t.stDensity}>
        <Seg value={S.density} onChange={set("density")}
          options={[["c", t.stDensityC], ["n", t.stDensityN], ["s", t.stDensityS]]} />
      </SettingRow>
      <SettingRow label={t.stWidgets}>
        <Toggle on={S.homeWidgets} onClick={() => set("homeWidgets")(!S.homeWidgets)} />
      </SettingRow>
      <SettingRow label={t.stDots} note={t.stDotsNote}>
        <Seg value={S.dotScale} onChange={set("dotScale")}
          options={[["share", t.stDotsShare], ["total", t.stDotsTotal]]} />
      </SettingRow>
      {!material && <SettingRow label={t.stAccent} note={t.stAccentNote}>
        <div style={{ display: "flex", gap: 6 }}>
          {[95, 230, 350, 160].map(h => (
            <button key={h} onClick={() => app.setAccent(h)} style={{
              width: 30, height: 30, borderRadius: "50%",
              background: `oklch(0.66 0.17 ${h})`, // тот же цвет, что встанет в --hot
              outline: S.accent === h ? "2.5px solid var(--text)" : "none", outlineOffset: 2,
            }}></button>
          ))}
          <button onClick={() => app.setAccent(null)} style={{
            width: 30, height: 30, borderRadius: "50%", border: "1px dashed var(--mut)",
            color: "var(--mut)", display: "flex", alignItems: "center", justifyContent: "center",
          }} title="reset"><Ic d={ICONS.refresh} size={13} /></button>
        </div>
      </SettingRow>}
    </div>
  );
};

// Воспроизведение и загрузки. Значения — заглушка: живут в странице (pb, folder), пока она открыта
const SetPlayback = ({ pb, setPb, folder, setFolder }) => {
  const app = useApp();
  const t = app.t;
  const set = (k) => (v) => setPb({ ...pb, [k]: v });
  const flip = (k) => () => setPb({ ...pb, [k]: !pb[k] });
  return (
    <div className="fade-up">
      <SettingRow label={t.qStream} note={t.qNote}>
        <Seg value={pb.stream} onChange={set("stream")} options={[["auto", t.qAuto], ["high", t.qHigh], ["lossless", t.qLossless]]} />
      </SettingRow>
      <SettingRow label={t.qDownload}>
        <Seg value={pb.dlq} onChange={set("dlq")} options={[["high", t.qHigh], ["lossless", t.qLossless]]} />
      </SettingRow>
      <SettingRow label={t.metered} note={t.meteredNote}><Toggle on={pb.metered} onClick={flip("metered")} /></SettingRow>
      <SettingRow label={t.dlFolder} note={folder === "music" ? "~/Music/Spotless" : folder === "down" ? "~/Downloads/Spotless" : "/mnt/media/spotless"}>
        <Seg value={folder} onChange={(v) => { setFolder(v); app.toast(t.folderSaved); }}
          options={[["music", "~/Music"], ["down", "~/Downloads"], ["ext", t.folderCustom]]} />
      </SettingRow>
      <SettingRow label={t.cacheLimit} note={t.cacheNote}>
        <Seg value={pb.cache} onChange={set("cache")} options={[["1", "1 GB"], ["5", "5 GB"], ["10", "10 GB"]]} />
      </SettingRow>
      <SettingRow label={t.normalize}><Toggle on={pb.normalize} onClick={flip("normalize")} /></SettingRow>
      <SettingRow label={t.crossfade}>
        <Seg value={pb.cross} onChange={set("cross")} options={[["0", t.offLabel], ["4", "4 s"], ["8", "8 s"]]} />
      </SettingRow>
      <SettingRow label={t.gapless}><Toggle on={pb.gapless} onClick={flip("gapless")} /></SettingRow>
    </div>
  );
};

const SetLang = () => {
  const app = useApp();
  const t = app.t;
  return (
    <div className="fade-up">
      <SettingRow label={t.stLangUI}>
        <Seg value={app.lang} onChange={app.setLang} options={[["ru", "Русский"], ["en", "English"]]} />
      </SettingRow>
      <SettingRow label={t.stCurrency} note={t.stCurrencyNote}>
        <Seg value={app.currency} onChange={app.setCurrency} options={[["usd", "$ USD"], ["eur", "€ EUR"], ["gbp", "£ GBP"]]} />
      </SettingRow>
    </div>
  );
};

const SetRatings = () => {
  const app = useApp();
  const t = app.t;
  return (
    <div className="fade-up">
      <SettingRow label={t.stLikeRating} note={t.stLikeRatingNote}>
        <Seg value={app.likeRating} onChange={(v) => app.setSettings({ ...app.settings, likeRating: v })}
          options={[5, 6, 7, 8, 9, 10].map(n => [n, String(n)])} />
      </SettingRow>
    </div>
  );
};

const SetHelp = () => {
  const app = useApp();
  const t = app.t;
  return (
    <div className="fade-up">
      <SettingRow label={t.stReplayTour} note={t.stReplayNote}>
        <button className="btn ghost" style={{ padding: "8px 18px", fontSize: 13 }} onClick={() => app.go("onboarding")}>
          <Ic d={ICONS.refresh} size={14} />{t.stStart}
        </button>
      </SettingRow>
      <SettingRow label={t.stCards} note={t.stCardsNote}>
        <button className="iconbtn" style={{ width: 30, height: 30 }} onClick={() => app.go("onboarding")}><Ic d={ICONS.chevR} size={17} style={{ color: "var(--mut)" }} /></button>
      </SettingRow>
    </div>
  );
};

const SetAccount = () => {
  const t = useApp().t;
  return (
    <div className="fade-up">
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "6px 0 18px" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "var(--acc)" }}>Л</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Лиза</div>
          <div style={{ fontSize: 13, color: "var(--mut)" }}>liza.k@gmail.com · Google</div>
        </div>
      </div>
      <SettingRow label={t.stProfile} note={t.stProfileNote}><span className="toggle on"></span></SettingRow>
      <SettingRow label={t.stIncomeVisible} note={t.stIncomeNote}><span className="toggle on"></span></SettingRow>
    </div>
  );
};

// Продвинутое: ключи, адрес, транзакции, сеть — для тех, кто хочет под капот
const SetAdvanced = ({ openModal }) => {
  const app = useApp();
  const t = app.t;
  const [seedShown, setSeedShown] = React.useState(false);
  const copyBtn = (style) => (
    <button className="iconbtn" style={style} onClick={() => app.toast(t.copied)}><Ic d={ICONS.copy} size={14} /></button>
  );
  return (
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
          {copyBtn({ width: 28, height: 28, marginLeft: 8, verticalAlign: "middle" })}
        </div>
      )}
      <SettingRow label={t.stAddress}>
        <span className="mono" style={{ fontSize: 12.5, color: "var(--mut)" }}>spl1q…e7xw4</span>
        {copyBtn({ width: 30, height: 30 })}
      </SettingRow>
      <SettingRow label={t.stTx} note={t.stTxSummary(app.money)}>
        <button className="more" style={{ display: "flex", gap: 4, alignItems: "center" }} onClick={() => openModal("tx")}>{t.stTxAll}<Ic d={ICONS.chevR} size={14} /></button>
      </SettingRow>
      <SettingRow label={t.stPeers} note="12 peers · DHT ok · relay off">
        <span className="mono ok-text" style={{ fontSize: 12 }}>● online</span>
      </SettingRow>
      <SettingRow label={t.stConfig} note="~/.config/spotless/config.toml">
        <button className="more" style={{ display: "flex", gap: 4, alignItems: "center" }} onClick={() => app.toast(t.stOpened)}>{t.stOpen}<Ic d={ICONS.chevR} size={14} /></button>
      </SettingRow>
    </div>
  );
};

// [ключ, подпись (ключ в i18n), значок]
const SETTINGS_SECTIONS = [
  ["appearance", "stAppearance", "sparkle"],
  ["playback", "stPlayback", "volume"],
  ["ratings", "stRatings", "heart"],
  ["lang", "stLang", "globe"],
  ["help", "stHelp", "bell"],
  ["account", "stAccount", "user"],
  ["advanced", "stAdvanced", "key"],
];

const PageSettings = () => {
  const app = useApp();
  const t = app.t;
  const [section, setSection] = React.useState("appearance");
  const [modal, setModal] = React.useState(null); // gallery | tx
  // Заглушки настроек воспроизведения — живут здесь, чтобы не сбрасываться при смене раздела
  const [pb, setPb] = React.useState({ stream: "auto", dlq: "high", metered: false, cache: "5", normalize: true, cross: "0", gapless: true });
  const [folder, setFolder] = React.useState("music");
  const closeModal = () => setModal(null);
  const [shown, out] = useExit(modal);

  return (
    <div className="fade-in settings-grid" data-screen-label="Настройки">
      <nav className="set-nav" style={{ paddingTop: 26 }}>
        <h1 className="set-title">{t.stTitle}</h1>
        {SETTINGS_SECTIONS.map(([k, label, icon]) => (
          <button key={k} className={"navitem setitem" + (section === k ? " active" : "")} style={{ fontSize: 14, padding: "9px 14px" }} onClick={() => setSection(k)}>
            <Ic d={ICONS[icon]} size={18} />{t[label]}
          </button>
        ))}
      </nav>

      <div className="set-pane">
        {section === "appearance" && <SetAppearance openModal={setModal} />}
        {section === "playback" && <SetPlayback pb={pb} setPb={setPb} folder={folder} setFolder={setFolder} />}
        {section === "lang" && <SetLang />}
        {section === "ratings" && <SetRatings />}
        {section === "help" && <SetHelp />}
        {section === "account" && <SetAccount />}
        {section === "advanced" && <SetAdvanced openModal={setModal} />}
      </div>
      {shown === "gallery" && <GalleryModal close={closeModal} out={out} />}
      {shown === "tx" && <TxModal close={closeModal} out={out} />}
    </div>
  );
};

Object.assign(window, { PageSettings, THEME_LIST, ThemeSwatch, StyleSwatch, MAccentPicker, SettingRow, Seg });
