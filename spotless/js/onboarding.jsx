// Spotless — онбординг: приветствие → вход → тема → взнос → 3 карточки.
// ObWrap и ObDots вынесены на верхний уровень: вложенные компоненты пересоздавались
// при каждом рендере и React перемонтировал поддерево (карточки «мигали»).

const ObDots = ({ step }) => (
  <div style={{ display: "flex", gap: 7, justifyContent: "center" }}>
    {[0, 1, 2, 3, 4].map(i => (
      <span key={i} style={{
        width: i === step ? 22 : 7, height: 7, borderRadius: 99,
        background: i === step ? "var(--acc)" : "var(--bg3)", transition: "all 0.25s",
      }}></span>
    ))}
  </div>
);

const ObWrap = ({ app, t, step, setStep, wide, children }) => (
  <div data-screen-label={"Онбординг шаг " + (step + 1)} style={{
    position: "fixed", inset: 0, zIndex: 100, background: "var(--bg0)",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40,
  }}>
    <div className="fade-up" key={step} style={{ width: wide ? 880 : 520, maxWidth: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {children}
    </div>
    <div style={{ position: "absolute", bottom: 36, display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
      <ObDots step={step} />
      {step > 0 && step < 4 && (
        <button className="more" onClick={() => setStep(step + 1)}>{t.skip}</button>
      )}
    </div>
    {step > 0 && (
      <button className="iconbtn" style={{ position: "absolute", top: 28, left: 28 }} onClick={() => setStep(step - 1)}>
        <Ic d={ICONS.back} size={18} />
      </button>
    )}
    <button className="more" style={{ position: "absolute", top: 34, right: 36 }} onClick={app.finishOnboarding}>{t.skipAll}</button>
  </div>
);

const Onboarding = () => {
  const app = useApp();
  const t = app.t;
  const [step, setStep] = React.useState(0);
  const [amt, setAmt] = React.useState(5);
  const [custom, setCustom] = React.useState("");
  const [card, setCard] = React.useState(0);
  const [seedMode, setSeedMode] = React.useState(false);
  const [seed, setSeed] = React.useState("");
  const W = { app, t, step, setStep };

  // Шаг 0 — приветствие
  if (step === 0) return (
    <ObWrap {...W}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 42 }}>
        <span style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--acc)" }}></span>
        <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>spotless</span>
      </div>
      <h1 style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.12 }}>
        {t.obWelcome1}<br />{t.obWelcome2}
      </h1>
      <p style={{ fontSize: 16.5, color: "var(--mut)", lineHeight: 1.6, margin: "22px 0 36px", maxWidth: 460, textWrap: "pretty" }}>
        {t.obWelcomeSub}
      </p>
      <button className="btn" style={{ padding: "14px 44px", fontSize: 16 }} onClick={() => setStep(1)}>{t.obStart}</button>
      <button className="more" style={{ marginTop: 16 }} onClick={() => setStep(1)}>{t.obHaveAcc}</button>
    </ObWrap>
  );

  // Шаг 1 — вход по сид-фразе
  if (step === 1 && seedMode) {
    const words = seed.trim().split(/\s+/).filter(Boolean);
    const ok = words.length === 12;
    return (
      <ObWrap {...W}>
        <button className="iconbtn" style={{ position: "absolute", top: 28, left: 28 }} onClick={() => setSeedMode(false)}>
          <Ic d={ICONS.back} size={18} />
        </button>
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
          <button className="more" style={{ display: "flex", alignItems: "center", gap: 6 }}
            onClick={async () => { try { const txt = await navigator.clipboard.readText(); if (txt) setSeed(txt); } catch { app.toast(t.seedPaste); } }}>
            <Ic d={ICONS.copy} size={14} />{t.seedPaste}
          </button>
          <span style={{ fontSize: 12.5, color: ok ? "var(--acc)" : "var(--mut)", fontWeight: 600 }}>
            {words.length} / 12 {t.seedCount}
          </span>
        </div>
        <button className="btn" style={{ padding: "13px 44px", fontSize: 15, opacity: ok ? 1 : 0.45 }}
          onClick={() => { if (ok) setStep(2); }}>
          <Ic d={ICONS.lock} size={15} />{t.seedGo}
        </button>
      </ObWrap>
    );
  }

  // Шаг 1 — выбор способа входа
  if (step === 1) return (
    <ObWrap {...W}>
      <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 34 }}>{t.obSignTitle}</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, width: 420, maxWidth: "100%" }}>
        <button onClick={() => setStep(2)} style={{
          display: "flex", alignItems: "center", gap: 16, textAlign: "left", padding: "18px 22px",
          background: "var(--bg1)", border: "1px solid var(--line)", borderRadius: "var(--r)",
          transition: "border-color 0.15s",
        }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--acc)"}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--line)"}>
          <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81z"></path>
            <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.93-2.91l-3.87-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.29v3.1A12 12 0 0 0 12 24z"></path>
            <path fill="#FBBC05" d="M5.29 14.29a7.2 7.2 0 0 1 0-4.58V6.6H1.29a12 12 0 0 0 0 10.79l4-3.1z"></path>
            <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.29 6.6l4 3.1C6.23 6.87 8.88 4.77 12 4.77z"></path>
          </svg>
          <span>
            <span style={{ display: "block", fontSize: 16, fontWeight: 700 }}>{t.obGoogle}</span>
            <span style={{ display: "block", fontSize: 12.5, color: "var(--mut)", marginTop: 4, lineHeight: 1.5 }}>{t.obGoogleNote}</span>
          </span>
        </button>
        <button onClick={() => setSeedMode(true)} style={{
          display: "flex", alignItems: "center", gap: 16, textAlign: "left", padding: "18px 22px",
          background: "transparent", border: "1px solid var(--line)", borderRadius: "var(--r)",
          transition: "border-color 0.15s",
        }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--mut)"}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--line)"}>
          <Ic d={ICONS.key} size={24} style={{ color: "var(--mut)" }} />
          <span>
            <span style={{ display: "block", fontSize: 16, fontWeight: 700 }}>{t.obSeed}</span>
            <span style={{ display: "block", fontSize: 12.5, color: "var(--mut)", marginTop: 4, lineHeight: 1.5 }}>{t.obSeedNote}</span>
          </span>
        </button>
      </div>
    </ObWrap>
  );

  // Шаг 2 — тема
  if (step === 2) return (
    <ObWrap {...W} wide={true}>
      <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>{t.obThemeTitle}</h1>
      <p style={{ fontSize: 14.5, color: "var(--mut)", marginBottom: 30 }}>{t.obThemeSub}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center" }}>
        {THEME_LIST.map(th => (
          <ThemeSwatch key={th.id} th={th} size="big" active={app.theme === th.id} onClick={() => app.setTheme(th.id)} />
        ))}
      </div>
      <button className="btn" style={{ padding: "13px 44px", fontSize: 15, marginTop: 34 }} onClick={() => setStep(3)}>{t.next}</button>
    </ObWrap>
  );

  // Шаг 3 — взнос
  if (step === 3) {
    const val = custom ? parseFloat(custom) || 0 : amt;
    return (
      <ObWrap {...W}>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12, textWrap: "balance" }}>{t.obAmountTitle}</h1>
        <p style={{ fontSize: 14.5, color: "var(--mut)", lineHeight: 1.6, marginBottom: 30, maxWidth: 440, textWrap: "pretty" }}>{t.obAmountSub}</p>
        <div style={{ display: "flex", gap: 10, marginBottom: 26, flexWrap: "wrap", justifyContent: "center" }}>
          {[2, 5, 10].map(n => (
            <button key={n} onClick={() => { setAmt(n); setCustom(""); }} style={{
              width: 84, padding: "16px 0", borderRadius: "var(--r)", fontSize: 21, fontWeight: 800,
              background: !custom && amt === n ? "var(--acc)" : "var(--bg1)",
              color: !custom && amt === n ? "var(--acc-ink)" : "var(--text)",
              border: "1px solid " + (!custom && amt === n ? "var(--acc)" : "var(--line)"),
            }}>${n}</button>
          ))}
          <div style={{
            width: 110, display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "var(--r)", fontSize: 19, fontWeight: 800,
            background: "var(--bg1)", border: "1px solid " + (custom ? "var(--acc)" : "var(--line)"),
          }}>
            $<input value={custom} onChange={(e) => setCustom(e.target.value.replace(/[^\d.]/g, ""))}
              placeholder="…" style={{
                width: 56, background: "none", border: "none", outline: "none",
                color: "var(--text)", fontSize: 19, fontWeight: 800, textAlign: "left",
              }} />
          </div>
        </div>
        <button className="btn" style={{ padding: "13px 44px", fontSize: 15 }}
          onClick={() => { if (val > 0) app.setMonthly(val); setStep(4); }}>
          {t.next}{val > 0 ? ` · $${val}/${t.supMonth}` : ""}
        </button>
        <button className="more" style={{ marginTop: 14 }} onClick={() => setStep(4)}>{t.obAmountSkip}</button>
      </ObWrap>
    );
  }

  // Шаг 4 — три карточки
  const cards = [
    { icon: "heart", title: t.obTour1t, sub: t.obTour1s, demo: "rating" },
    { icon: "plus", title: t.obTour2t, sub: t.obTour2s, demo: null },
    { icon: "dollar", title: t.obTour3t, sub: t.obTour3s, demo: null },
  ];
  const c = cards[card];
  return (
    <ObWrap {...W}>
      <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 30 }}>{t.obTourTitle}</h1>
      <div key={card} className="fade-up" style={{
        width: 430, maxWidth: "100%", background: "var(--bg1)", border: "1px solid var(--line)",
        borderRadius: "var(--r)", padding: "34px 34px 30px", marginBottom: 26,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%", background: "var(--bg2)", color: "var(--acc)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px",
        }}>
          <Ic d={ICONS[c.icon]} size={28} fill={c.icon === "heart" ? "currentColor" : "none"} sw={c.icon === "heart" ? 0 : 2} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>{c.title}</h2>
        <p style={{ fontSize: 14, color: "var(--mut)", lineHeight: 1.6, textWrap: "pretty" }}>{c.sub}</p>
        {c.demo === "rating" && (
          <div style={{ display: "flex", gap: 4, marginTop: 20 }}>
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <span key={n} style={{
                flex: 1, height: 24, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
                background: n <= 8 ? "var(--acc)" : "var(--bg2)",
                color: n <= 8 ? "var(--acc-ink)" : "var(--mut)",
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
        ? <button className="btn" style={{ padding: "13px 44px", fontSize: 15 }} onClick={() => setCard(card + 1)}>{t.next}</button>
        : <button className="btn" style={{ padding: "13px 44px", fontSize: 15 }} onClick={app.finishOnboarding}>{t.obFinish}</button>}
    </ObWrap>
  );
};

Object.assign(window, { Onboarding, ObWrap, ObDots });
