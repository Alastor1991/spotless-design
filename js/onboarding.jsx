// Spotless — онбординг: приветствие → вход → тема → сумма → три карточки.
// Каждый шаг — свой компонент; выбор человека (сумма, фраза-ключ, карточка) живёт в Onboarding,
// чтобы не теряться, если вернуться на шаг назад.
// ObWrap и ObDots — на верхнем уровне: вложенные компоненты пересоздавались при каждом рендере,
// и React перемонтировал поддерево (карточки «мигали»).

const ObDots = ({ step }) => (
  <div className="ob-dots">
    {[0, 1, 2, 3, 4].map(i => (
      <span key={i} className={"ob-dot" + (i === step ? " is-on" : i < step ? " is-done" : "")}></span>
    ))}
  </div>
);

// Три зоны в потоке, без абсолютного позиционирования: верхняя строка, прокручиваемое
// содержимое (по центру, если влезает) и низ с точками шагов — на коротком экране ничего не наезжает.
// У Material точки шагов — в верхней строке, а главная кнопка шага на телефоне прижата к низу (.ob-cta)
const ObWrap = ({ app, t, step, setStep, wide, onBack, children }) => {
  const material = useStyle() === "material";
  return (
    <div className="ob" data-screen-label={"Онбординг шаг " + (step + 1)}>
      <div className="ob-top">
        {step > 0
          ? <button className="iconbtn" style={{ width: 44, height: 44 }} aria-label={t.back} onClick={onBack || (() => setStep(step - 1))}><Ic d={ICONS.back} size={18} /></button>
          : <span></span>}
        {material && <ObDots step={step} />}
        <button className="more" onClick={app.finishOnboarding}>{t.skipAll}</button>
      </div>
      <div className="ob-body">
        <div className="fade-up ob-inner" key={step} style={{ width: wide ? 880 : 520 }}>
          {children}
        </div>
      </div>
      <div className="ob-foot">
        {!material && <ObDots step={step} />}
        {step > 0 && step < 4 && (
          <button className="more" onClick={() => setStep(step + 1)}>{t.skip}</button>
        )}
      </div>
    </div>
  );
};

// Веер обложек на первом шаге Material — вместо логотипа, как в одобренном макете
const ObFan = () => (
  <div className="ob-fan" aria-hidden="true">
    <span className="ob-fan-l"><Cover art="glass" size="var(--fan-s)" radius={20} /></span>
    <span className="ob-fan-r"><Cover art="hourglass" size="var(--fan-s)" radius={20} /></span>
    <span className="ob-fan-c"><Cover art="grunt" size="var(--fan)" radius={22} /></span>
  </div>
);

const obTitle = { fontSize: "clamp(26px, 7vw, 32px)", fontWeight: 800, letterSpacing: "-0.02em" };

// Шаг 0 — приветствие
const ObWelcome = ({ next }) => {
  const t = useApp().t;
  return (
    <React.Fragment>
      {useStyle() === "material"
        ? <ObFan />
        : <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 42 }}><Logo size={30} /></div>}
      <h1 style={{ fontSize: "clamp(34px, 9vw, 46px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.12 }}>
        {t.obWelcome1}<br />{t.obWelcome2}
      </h1>
      <p style={{ fontSize: 16.5, color: "var(--mut)", lineHeight: 1.6, margin: "22px 0 36px", maxWidth: 460, textWrap: "pretty" }}>
        {t.obWelcomeSub}
      </p>
      <button className="btn ob-cta ob-cta-l" onClick={next}>{t.obStart}</button>
      <button className="more ob-alt" onClick={next}>{t.obHaveAcc}</button>
    </React.Fragment>
  );
};

// Шаг 1 — способ входа: Google или фраза-ключ, на одном экране
const ObSignIn = ({ onGoogle, onSeed }) => {
  const t = useApp().t;
  const choice = { display: "flex", alignItems: "center", gap: 16, textAlign: "left", padding: "18px 22px", borderRadius: "var(--r)", transition: "border-color 0.15s" };
  const text = (title, note) => (
    <span>
      <span style={{ display: "block", fontSize: 16, fontWeight: 700 }}>{title}</span>
      <span style={{ display: "block", fontSize: 12.5, color: "var(--mut)", marginTop: 4, lineHeight: 1.5 }}>{note}</span>
    </span>
  );
  return (
    <React.Fragment>
      <h1 style={{ ...obTitle, marginBottom: 34 }}>{t.obSignTitle}</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, width: 420, maxWidth: "100%" }}>
        <button className="ob-choice ob-google" onClick={onGoogle} style={{ ...choice, background: "var(--bg1)" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81z"></path>
            <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.93-2.91l-3.87-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.29v3.1A12 12 0 0 0 12 24z"></path>
            <path fill="#FBBC05" d="M5.29 14.29a7.2 7.2 0 0 1 0-4.58V6.6H1.29a12 12 0 0 0 0 10.79l4-3.1z"></path>
            <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.29 6.6l4 3.1C6.23 6.87 8.88 4.77 12 4.77z"></path>
          </svg>
          {text(t.obGoogle, t.obGoogleNote)}
        </button>
        <button className="ob-choice ob-seed" onClick={onSeed} style={{ ...choice, background: "transparent" }}>
          <Ic d={ICONS.key} size={24} style={{ color: "var(--mut)" }} />
          {text(t.obSeed, t.obSeedNote)}
        </button>
      </div>
    </React.Fragment>
  );
};

// Шаг 1 — вход по фразе-ключу
const ObSeed = ({ seed, setSeed, next }) => {
  const app = useApp();
  const t = app.t;
  const words = seed.trim().split(/\s+/).filter(Boolean);
  const ok = words.length === 12;
  const paste = async () => { try { const txt = await navigator.clipboard.readText(); if (txt) setSeed(txt); } catch { app.toast(t.seedPaste); } };
  return (
    <React.Fragment>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--bg1)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--acc)", marginBottom: 22 }}>
        <Ic d={ICONS.key} size={26} />
      </div>
      <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 10 }}>{t.seedTitle}</h1>
      <p style={{ fontSize: 14, color: "var(--mut)", lineHeight: 1.6, marginBottom: 24, maxWidth: 420, textWrap: "pretty" }}>{t.seedNote}</p>
      <textarea value={seed} autoFocus onChange={(e) => setSeed(e.target.value)}
        placeholder="lunar velvet anchor tide paper humming gravel north cassette ember quiet arc"
        className="mono"
        style={{
          width: 440, maxWidth: "100%", height: 96, resize: "none", background: "var(--bg1)",
          border: "1px solid " + (ok ? "var(--acc)" : "var(--line)"), borderRadius: "var(--r)",
          padding: "14px 16px", fontSize: 14, lineHeight: 1.7, color: "var(--text)", outline: "none",
          textAlign: "center", letterSpacing: "0.01em",
        }} />
      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "12px 0 26px" }}>
        <button className="more" style={{ display: "flex", alignItems: "center", gap: 6 }} onClick={paste}>
          <Ic d={ICONS.copy} size={14} />{t.seedPaste}
        </button>
        <span style={{ fontSize: 12.5, color: ok ? "var(--acc)" : "var(--mut)", fontWeight: 600 }}>
          {words.length} / 12 {t.seedCount}
        </span>
      </div>
      <button className="btn ob-cta" style={{ opacity: ok ? 1 : 0.45 }}
        onClick={() => { if (ok) next(); }}>
        <Ic d={ICONS.lock} size={15} />{t.seedGo}
      </button>
    </React.Fragment>
  );
};

// Шаг 2 — тема
// Шаг 2 — стиль и его цвета: архитектура стиля (style.jsx), под ней палитры «Точки»
// или тема и акцент Material
const ObTheme = ({ next }) => {
  const app = useApp();
  const t = app.t;
  const material = app.style === "material";
  return (
    <React.Fragment>
      <h1 style={{ ...obTitle, marginBottom: 8, textWrap: "balance" }}>{t.obStyleTitle}</h1>
      <p style={{ fontSize: 14.5, color: "var(--mut)", marginBottom: 26, textWrap: "pretty" }}>{t.obStyleSub}</p>
      <div className="style-grid ob-styles">
        {STYLE_LIST.map(s => <StyleSwatch key={s.id} id={s.id} active={app.style === s.id} onClick={() => app.setStyle(s.id)} />)}
      </div>
      {material ? (
        <div className="ob-mcolors">
          <Seg value={app.settings.mTheme} onChange={app.setMTheme}
            options={[["dark", t.stThemeDark], ["light", t.stThemeLight], ["system", t.stThemeSystem]]} />
          <MAccentPicker />
        </div>
      ) : (
        <div className="ob-themes" style={{ display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center" }}>
          {THEME_LIST.map(th => (
            <ThemeSwatch key={th.id} th={th} size="big" active={app.theme === th.id} onClick={() => app.setTheme(th.id)} />
          ))}
        </div>
      )}
      <button className="btn ob-cta ob-cta-gap" onClick={next}>{t.next}</button>
    </React.Fragment>
  );
};

// Шаг 3 — сумма в месяц: чипы или своя сумма (amt — чип, custom — текст поля)
const ObAmount = ({ amt, setAmt, custom, setCustom, next }) => {
  const app = useApp();
  const t = app.t;
  const m = app.money;
  const val = custom ? parseAmount(custom) || 0 : amt;
  // Своя сумма остаётся своей и в разделе «Артистам» (там она живёт в капсуле «Своя сумма»)
  const commit = () => {
    if (val > 0) { app.setMonthly(val); if (![2, 5, 10].includes(val)) app.setCustomAmt(amountText(val, app.lang)); }
    next();
  };
  return (
    <React.Fragment>
      <h1 style={{ ...obTitle, marginBottom: 12, textWrap: "balance" }}>{t.obAmountTitle}</h1>
      <p style={{ fontSize: 14.5, color: "var(--mut)", lineHeight: 1.6, marginBottom: 30, maxWidth: 440, textWrap: "pretty" }}>{t.obAmountSub}</p>
      <div className="ob-amts">
        {[2, 5, 10].map(n => {
          const on = !custom && amt === n;
          return (
            <button key={n} onClick={() => { setAmt(n); setCustom(""); }} style={{
              width: 84, padding: "16px 0", borderRadius: "var(--r)", fontSize: 21, fontWeight: 800,
              background: on ? "var(--acc)" : "var(--bg1)",
              color: on ? "var(--acc-ink)" : "var(--text)",
              border: "1px solid " + (on ? "var(--acc)" : "var(--line)"),
            }}>{m.sign}{n}</button>
          );
        })}
        <div style={{
          width: 110, minHeight: 58, display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "var(--r)", fontSize: 19, fontWeight: 800,
          background: "var(--bg1)", border: "1px solid " + (custom ? "var(--acc)" : "var(--line)"),
        }}>
          {m.sign}<input value={custom} inputMode="decimal" aria-label={t.supCustom} onChange={(e) => setCustom(cleanAmount(e.target.value))}
            placeholder="…" style={{
              width: 56, background: "none", border: "none", outline: "none",
              color: "var(--text)", fontSize: 19, fontWeight: 800, textAlign: "left",
            }} />
        </div>
      </div>
      <button className="btn ob-cta" onClick={commit}>
        {t.next}{val > 0 ? ` · ${m.fmt(val)}/${t.supMonth}` : ""}
      </button>
      <button className="more ob-alt ob-alt-s" onClick={next}>{t.obAmountSkip}</button>
    </React.Fragment>
  );
};

// Шаг 4 у Material — все три пункта на одной карточке, с крупными пояснениями
const ObTourCard = () => {
  const app = useApp();
  const t = app.t;
  const items = [
    { icon: "heart", fill: true, title: t.obTour1t, sub: t.obTour1s(app.likeRating) },
    { icon: "plus", title: t.obTour2t, sub: t.obTour2s },
    { icon: "dollar", title: t.obTour3t, sub: t.obTour3s },
  ];
  return (
    <React.Fragment>
      <h1 style={{ ...obTitle, marginBottom: 20 }}>{t.obTourTitle}</h1>
      <div className="ob-tour">
        {items.map(it => (
          <div key={it.icon} className="ob-tour-row">
            <span className="ob-tour-ic"><Ic d={ICONS[it.icon]} size={24} fill={it.fill ? "currentColor" : "none"} /></span>
            <span>
              <span className="ob-tour-t">{it.title}</span>
              <span className="ob-tour-s">{it.sub}</span>
            </span>
          </div>
        ))}
      </div>
      <button className="btn ob-cta ob-cta-gap" onClick={app.finishOnboarding}>{t.obFinish}</button>
    </React.Fragment>
  );
};

// Шаг 4 — три карточки: сердечко, плюсик, $
const ObTour = ({ card, setCard }) => {
  const app = useApp();
  const t = app.t;
  if (useStyle() === "material") return <ObTourCard />;
  const cards = [
    { icon: "heart", title: t.obTour1t, sub: t.obTour1s(app.likeRating), demo: "rating" },
    { icon: "plus", title: t.obTour2t, sub: t.obTour2s, demo: null },
    { icon: "dollar", title: t.obTour3t, sub: t.obTour3s, demo: null },
  ];
  const c = cards[card];
  const heart = c.icon === "heart";
  return (
    <React.Fragment>
      <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 30 }}>{t.obTourTitle}</h1>
      <div key={card} className="fade-up" style={{
        width: 430, maxWidth: "100%", background: "var(--bg1)", border: "1px solid var(--line)",
        borderRadius: "var(--r)", padding: "clamp(22px, 6vw, 34px) clamp(18px, 6vw, 34px) clamp(20px, 5vw, 30px)", marginBottom: 26,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%", background: "var(--bg2)", color: heart ? "var(--hot)" : "var(--acc)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px",
        }}>
          <Ic d={ICONS[c.icon]} size={28} fill={heart ? "currentColor" : "none"} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>{c.title}</h2>
        <p style={{ fontSize: 14, color: "var(--mut)", lineHeight: 1.6, textWrap: "pretty" }}>{c.sub}</p>
        {c.demo === "rating" && (
          <div style={{ display: "flex", gap: 4, marginTop: 20 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <span key={n} style={{
                flex: 1, height: 24, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
                background: n <= 8 ? "var(--hot)" : "var(--bg2)",
                color: n <= 8 ? "var(--hot-ink)" : "var(--mut)",
              }}>{n}</span>
            ))}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {cards.map((_, i) => (
          <button key={i} onClick={() => setCard(i)} style={{
            width: i === card ? 20 : 7, height: 7, borderRadius: 99,
            background: i === card ? "var(--acc)" : "var(--bg3)", transition: "all 0.2s",
          }}></button>
        ))}
      </div>
      {card < 2
        ? <button className="btn ob-cta" onClick={() => setCard(card + 1)}>{t.next}</button>
        : <button className="btn ob-cta" onClick={app.finishOnboarding}>{t.obFinish}</button>}
    </React.Fragment>
  );
};

const Onboarding = () => {
  const app = useApp();
  const t = app.t;
  const [step, setStep] = React.useState(0);
  // Сумма — та, что уже выбрана (при повторном знакомстве из настроек раньше подставлялись $5,
  // и «Далее» молча перезаписывало сумму человека)
  const preset = [2, 5, 10].includes(app.monthly);
  const [amt, setAmt] = React.useState(preset ? app.monthly : 5);
  const [custom, setCustom] = React.useState(preset ? "" : amountText(app.monthly, app.lang));
  const [card, setCard] = React.useState(0);
  const [seedMode, setSeedMode] = React.useState(false);
  const [seed, setSeed] = React.useState("");
  const W = { app, t, step, setStep };
  const to = (n) => () => setStep(n);

  if (step === 0) return <ObWrap {...W}><ObWelcome next={to(1)} /></ObWrap>;
  if (step === 1 && seedMode) return <ObWrap {...W} onBack={() => setSeedMode(false)}><ObSeed seed={seed} setSeed={setSeed} next={to(2)} /></ObWrap>;
  if (step === 1) return <ObWrap {...W}><ObSignIn onGoogle={to(2)} onSeed={() => setSeedMode(true)} /></ObWrap>;
  if (step === 2) return <ObWrap {...W} wide={true}><ObTheme next={to(3)} /></ObWrap>;
  if (step === 3) return <ObWrap {...W}><ObAmount amt={amt} setAmt={setAmt} custom={custom} setCustom={setCustom} next={to(4)} /></ObWrap>;
  return <ObWrap {...W}><ObTour card={card} setCard={setCard} /></ObWrap>;
};

Object.assign(window, { Onboarding, ObWrap, ObDots });
