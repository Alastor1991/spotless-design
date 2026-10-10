// Spotless — «Моя поддержка» + модалки доната и пополнения.

const fmtUsd = (n, lang) => fmtMoney(n, lang);
const BALANCE = 7.35;

// Крупная сумма: «$» тонким шрифтом, целые — точечным, копейки — приглушённо
const BigMoney = ({ value, size = 150, lang }) => {
  const whole = Math.floor(value);
  const cents = Math.round((value - whole) * 100);
  return (
    <span aria-label={fmtMoney(value, lang)} style={{ display: "inline-flex", alignItems: "baseline", gap: size * 0.03 }}>
      <span aria-hidden="true" style={{ fontWeight: 300, fontSize: size * 0.37, color: "var(--mut)" }}>$</span>
      <span aria-hidden="true" className="dots" style={{ fontSize: size }}>{whole}</span>
      {cents > 0 && <span aria-hidden="true" className="dots" style={{ fontSize: size * 0.42, color: "var(--dot-off)" }}>{lang === "ru" ? "," : "."}{String(cents).padStart(2, "0")}</span>}
    </span>
  );
};

// Подпись над числом: «Комиссия сервиса 0%» читается именно в таком порядке
const SupStat = ({ label, value }) => (
  <span style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <span className="mlabel" style={{ fontSize: 10, letterSpacing: "0.1em" }}>{label}</span>
    <span style={{ fontSize: 30, fontWeight: 300, letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</span>
  </span>
);

const PageSupport = () => {
  const app = useApp();
  const t = app.t;
  const [detail, setDetail] = React.useState(null); // id артиста для раскрытия
  const total = app.monthly;
  const split = splitNow(total);
  const history = DB.supportHistory.slice().reverse(); // март → июнь
  const passed = DB.supportHistory.reduce((a, h) => a + h.amount + h.extra, 0);
  // Цена одной точки растёт с суммой, чтобы самая длинная полоса помещалась в строку
  const unit = [0.05, 0.1, 0.25, 0.5, 1].find(u => split[0].amount / u <= 38) || 1;
  return (
    <div className="fade-in" data-screen-label="Моя поддержка">
      <div style={{ margin: "14px 0 24px" }}>
        <div className="mlabel" style={{ marginBottom: 12 }}>{t.june} · {t.currentMonth}</div>
        <h1 style={{ fontSize: "clamp(38px, 6cqi, 60px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 0.9 }}>{t.supTitle}</h1>
      </div>

      <div className="sup-grid">
        {/* Ежемесячная поддержка */}
        <section className="widget" style={{ display: "flex", gap: 32, flexWrap: "wrap", padding: "26px 28px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span className="mlabel">{t.everyMonth}</span>
            <BigMoney value={total} size={150} lang={app.lang} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0, flex: "1 1 300px" }}>
            <div role="radiogroup" aria-label={t.supMonthly} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[2, 5, 10].map(n => (
                <button key={n} role="radio" aria-checked={!app.customAmt && app.monthly === n} className={"chip mono" + (!app.customAmt && app.monthly === n ? " on" : "")}
                  style={{ minHeight: 44, padding: "0 20px" }} onClick={() => app.setMonthly(n)}>${n}</button>
              ))}
              <label style={{
                display: "flex", alignItems: "center", gap: 4, borderRadius: 99, minHeight: 44,
                padding: "0 16px", fontSize: 14,
                background: app.customAmt ? "var(--acc)" : "transparent",
                color: app.customAmt ? "var(--acc-ink)" : "var(--text)",
                boxShadow: app.customAmt ? "none" : "inset 0 0 0 1px var(--bg3)",
              }}>
                <span className="mono">$</span><input value={app.customAmt} onChange={(e) => app.setCustomAmt(e.target.value.replace(/[^\d.,]/g, "").replace(",", "."))}
                  onBlur={app.commitCustom} aria-label={t.supCustom}
                  placeholder={t.supCustom} style={{
                    width: 96, background: "none", border: "none", outline: "none",
                    color: "inherit", fontSize: 14, padding: "10px 0",
                  }} />
              </label>
            </div>
            <p style={{ fontSize: 14, color: "var(--mut)", lineHeight: 1.55, maxWidth: 460 }}>{t.supNote}</p>
            <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
              <SupStat label={t.passedSince} value={fmtMoney(passed, app.lang)} />
              <SupStat label={t.artistsInMonth} value={split.length} />
              <SupStat label={t.feeLabel} value="0%" />
            </div>
            <label style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 16, paddingTop: 16, borderTop: "1px solid var(--line)", cursor: "pointer" }}>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontSize: 14 }}>{t.supRemind}</span>
                <span style={{ display: "block", fontSize: 12, color: "var(--mut)", marginTop: 3 }}>{t.supRemindNote}</span>
              </span>
              <button role="switch" aria-checked={app.auto} aria-label={t.supRemind} className={"toggle" + (app.auto ? " on" : "")} onClick={() => app.setAuto(!app.auto)}></button>
            </label>
          </div>
        </section>

        {/* Баланс */}
        <section className="widget" style={{ display: "flex", flexDirection: "column", gap: 12, padding: "26px 24px 22px" }}>
          <span className="mlabel">{t.supBalance}</span>
          <span style={{ display: "flex", alignItems: "baseline", gap: 2, fontWeight: 300, lineHeight: 1, letterSpacing: "-0.04em", margin: "6px 0 6px" }}>
            <span style={{ fontSize: 30, color: "var(--mut)" }}>$</span>
            <span style={{ fontSize: 60 }}>{Math.floor(BALANCE)}</span>
            <span style={{ fontSize: 32, color: "var(--mut2)" }}>{app.lang === "ru" ? "," : "."}{String(Math.round((BALANCE % 1) * 100)).padStart(2, "0")}</span>
          </span>
          <button className="btn" onClick={() => app.openTopUp()}><Ic d={ICONS.plus} size={15} sw={2} />{t.supTopUp}</button>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
            {[[t.tuCard, "Apple Pay, Google Pay"], [t.tuWallet, t.tuNetwork]].map(([a, b], i) => (
              <button key={i} onClick={() => app.openTopUp()} style={{ padding: "10px 12px", borderRadius: 14, boxShadow: "inset 0 0 0 1px var(--line)", textAlign: "left", display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "var(--mut)" }}>
                <span style={{ color: "var(--text)", fontSize: 13 }}>{a}</span>{b}
              </button>
            ))}
          </div>
          <p style={{ marginTop: "auto", fontSize: 12, lineHeight: 1.5, color: "var(--mut2)" }}>{t.supNoFees}</p>
        </section>
      </div>

      <div className="sup-grid">
        {/* Распределение */}
        <section className="widget" style={{ padding: "24px 28px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>{t.howSplit(fmtMoney(total, app.lang))}</h2>
            <span className="mlabel" style={{ fontSize: 10, letterSpacing: "0.1em" }}>{t.dotIsC(unit)}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {split.map((s) => {
              const a = DB.artists[s.artist];
              const open = detail === s.artist;
              return (
                <div key={s.artist}>
                  <button onClick={() => setDetail(open ? null : s.artist)} aria-expanded={open} className="split-row" style={{
                    display: "grid", gridTemplateColumns: "28px minmax(90px, 170px) 64px minmax(0, 1fr) 60px", alignItems: "center",
                    gap: 14, width: "100%", textAlign: "left", padding: "7px 8px", borderRadius: 12,
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg3)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                    <Cover art={"ar:" + a.id} hue={a.hue} size={28} round={true} />
                    <span style={{ fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</span>
                    <span className="mono sr-min" style={{ fontSize: 11, color: "var(--mut2)" }}>{s.minutes} {app.lang === "ru" ? "МИН" : "MIN"}</span>
                    <span style={{ display: "flex", minWidth: 0, overflow: "hidden" }}>
                      <DotBar pct={1} pitch={8} r={2.6} width={Math.max(1, Math.round(s.amount / unit)) * 8} />
                    </span>
                    <span className="mono" style={{ fontSize: 13, textAlign: "right" }}>{fmtMoney(s.amount, app.lang, true)}</span>
                  </button>
                  {open && (
                    <div className="fade-up" style={{ padding: "4px 10px 14px 50px", display: "flex", gap: 24, fontSize: 13, color: "var(--mut)", flexWrap: "wrap" }}>
                      <span>{s.pct}%</span>
                      <span><b style={{ color: "var(--text)", fontWeight: 500 }}>{s.minutes}</b> {t.supMinutes}</span>
                      <span><b style={{ color: "var(--text)", fontWeight: 500 }}>{Math.round(s.minutes / 3.8)}</b> {app.lang === "ru" ? "прослушиваний" : "plays"}</span>
                      <button style={{ color: "var(--text)", textDecoration: "underline", textUnderlineOffset: 3 }} onClick={() => app.go("artist", s.artist)}>{t.goToArtist}</button>
                      <button style={{ color: "var(--text)", textDecoration: "underline", textUnderlineOffset: 3 }} onClick={() => app.openDonate({ kind: "artist", id: s.artist })}>{t.donate}</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 12, color: "var(--mut2)", marginTop: 12 }}>{t.supSplitNote}</p>
        </section>

        {/* История: столбики из точек, доп. донаты — красным */}
        <section className="widget" style={{ display: "flex", flexDirection: "column", gap: 14, padding: "24px 24px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>{t.supHistory}</h2>
            <span className="mlabel" style={{ fontSize: 10, letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 6 }}><span className="hot-dot"></span>{t.supExtra}</span>
          </div>
          <div style={{ flex: 1, minHeight: 150, display: "grid", gridTemplateColumns: `repeat(${history.length}, minmax(0, 1fr))`, alignItems: "end", gap: 8 }}>
            {history.map((h, i) => {
              const cur = h.state === "current";
              const base = Math.round(h.amount), extra = Math.round(h.extra);
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
                  title={`${app.lang === "ru" ? h.month : h.monthEn}: ${fmtMoney(h.amount + h.extra, app.lang)}`}>
                  <span className="mono" style={{ fontSize: 12, color: cur ? "var(--text)" : "var(--mut)" }}>{fmtMoney(h.amount + h.extra, app.lang)}</span>
                  <span style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {Array.from({ length: extra }).map((_, k) => <span key={"e" + k} style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--hot)" }}></span>)}
                    {Array.from({ length: base }).map((_, k) => <span key={"b" + k} style={{ width: 9, height: 9, borderRadius: "50%", background: cur ? "var(--text)" : "var(--mut2)" }}></span>)}
                  </span>
                  <span className="mlabel" style={{ fontSize: 10, letterSpacing: "0.1em", color: cur ? "var(--text)" : "var(--mut2)" }}>{app.lang === "ru" ? h.month : h.monthEn}</span>
                </div>
              );
            })}
          </div>
          <span style={{ fontSize: 12, color: "var(--mut2)" }}>{t.dotIs1}</span>
        </section>
      </div>
    </div>
  );
};

// ---------- Модалка доната ----------
const DonateModal = () => {
  const app = useApp();
  const t = app.t;
  const tgt = app.donateTarget;
  const [amt, setAmt] = React.useState(2);
  const [custom, setCustom] = React.useState("");
  const [sent, setSent] = React.useState(false);
  React.useEffect(() => { if (tgt) { setSent(false); setCustom(""); setAmt(2); } }, [tgt]);
  if (!tgt) return null;

  let title, sub, hue, art, round = false;
  if (tgt.kind === "track") {
    const tr = DB.trackIndex[tgt.id];
    title = tr.t; sub = `${t.dnTrack} · ${DB.artists[tr.artist].name}`; hue = DB.albums[tr.album].hue; art = tr.album;
  } else if (tgt.kind === "album") {
    const al = DB.albums[tgt.id];
    title = al.title; sub = `${t[al.type].toLowerCase()} · ${DB.artists[al.artist].name}`; hue = al.hue; art = al.id;
  } else {
    const a = DB.artists[tgt.id];
    title = a.name; sub = t.dnArtist; hue = a.hue; art = "ar:" + a.id; round = true;
  }
  const val = custom ? parseFloat(custom) || 0 : amt;

  return (
    <div className="scrim fade-in" onClick={() => app.closeDonate()}>
      <div className="modal fade-up" role="dialog" aria-label={t.dnTitle + " " + title} onClick={(e) => e.stopPropagation()} data-screen-label="Модалка доната">
        {!sent ? (
          <React.Fragment>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
              <Cover art={art} hue={hue} size={56} round={round} radius={12} />
              <div style={{ minWidth: 0 }}>
                <div className="mlabel" style={{ fontSize: 10, marginBottom: 6 }}>{t.dnTitle} {sub}</div>
                <div style={{ fontSize: 20, fontWeight: 400, letterSpacing: "-0.03em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
              </div>
              <button className="iconbtn" style={{ marginLeft: "auto" }} aria-label={t.close} onClick={() => app.closeDonate()}>
                <Ic d={ICONS.x} size={16} />
              </button>
            </div>
            <div role="radiogroup" style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[1, 2, 5, 10].map(n => (
                <button key={n} role="radio" aria-checked={!custom && amt === n} className={"chip mono" + (!custom && amt === n ? " on" : "")}
                  style={{ flex: 1, padding: 0, minHeight: 48, fontSize: 15 }}
                  onClick={() => { setAmt(n); setCustom(""); }}>${n}</button>
              ))}
              <label style={{
                flex: 1.3, display: "flex", alignItems: "center", borderRadius: 99, padding: "0 14px", fontSize: 15,
                boxShadow: custom ? "inset 0 0 0 2px var(--acc)" : "inset 0 0 0 1px var(--bg3)",
              }}>
                <span className="mono">$</span><input value={custom} onChange={(e) => setCustom(e.target.value.replace(/[^\d.,]/g, "").replace(",", "."))} placeholder="…" aria-label={t.supCustom}
                  style={{ width: "100%", background: "none", border: "none", outline: "none", color: "var(--text)", fontSize: 15, padding: "12px 0 12px 2px" }} />
              </label>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13, color: "var(--mut)", marginBottom: 20, flexWrap: "wrap" }}>
              <span>{t.dnFrom}: <span className="mono" style={{ color: "var(--text)" }}>{fmtMoney(BALANCE, app.lang)}</span></span>
              <span>{t.dnNote}</span>
            </div>
            <button className="btn" style={{ width: "100%", minHeight: 52, fontSize: 15 }}
              onClick={() => { if (val <= 0) return; setSent(true); setTimeout(() => app.closeDonate(), 1600); }}>
              {t.dnSend} {val > 0 ? fmtMoney(val, app.lang) : ""}
            </button>
          </React.Fragment>
        ) : (
          <div style={{ textAlign: "center", padding: "26px 0 22px" }} className="fade-up">
            <div style={{
              width: 72, height: 72, borderRadius: "50%", background: "var(--hot)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px",
            }}>
              <Ic d={ICONS.heart} size={30} fill="currentColor" />
            </div>
            <p style={{ fontSize: 18, fontWeight: 400, letterSpacing: "-0.02em" }}>{t.dnThanks}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------- Модалка пополнения ----------
// Два равноправных пути (см. README 1.2): фиат-виджет партнёра / перевод с другого кошелька.
const TU_ADDRESS = "7XbR4wqLmZk2tNcVAhuFD9rGoyPe8sJv31MxBqWnK9Qe";

const TopUpModal = () => {
  const app = useApp();
  const t = app.t;
  const [mode, setMode] = React.useState("choose"); // choose | card | wallet | done
  const [amt, setAmt] = React.useState(10);
  const [custom, setCustom] = React.useState("");
  const [method, setMethod] = React.useState("apple");
  React.useEffect(() => {
    if (app.topUp) { setMode("choose"); setAmt(10); setCustom(""); setMethod("apple"); }
  }, [app.topUp]);
  if (!app.topUp) return null;

  const val = custom ? parseFloat(custom) || 0 : amt;
  const fee = val > 0 ? Math.max(0.25, val * 0.024) : 0;
  const landed = Math.max(0, val - fee);
  const methods = [
    { id: "apple", label: "Apple Pay" },
    { id: "google", label: "Google Pay" },
    { id: "plastic", label: t.tuMethodCard },
  ];

  return (
    <div className="scrim fade-in" onClick={() => app.closeTopUp()}>
      <div className="modal fade-up" role="dialog" aria-label={t.tuTitle} onClick={(e) => e.stopPropagation()} data-screen-label="Пополнение счёта">
        {mode !== "done" && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            {mode !== "choose" && (
              <button className="iconbtn ring" aria-label={app.lang === "ru" ? "Назад" : "Back"} onClick={() => setMode("choose")}>
                <Ic d={ICONS.back} size={17} />
              </button>
            )}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 22, fontWeight: 400, letterSpacing: "-0.03em" }}>
                {mode === "choose" ? t.tuTitle : mode === "card" ? t.tuCard : t.tuWallet}
              </div>
              {mode === "choose" && <div style={{ fontSize: 13, color: "var(--mut)", marginTop: 3 }}>{t.tuChoose}</div>}
            </div>
            <button className="iconbtn" style={{ marginLeft: "auto" }} aria-label={t.close} onClick={() => app.closeTopUp()}>
              <Ic d={ICONS.x} size={16} />
            </button>
          </div>
        )}

        {mode === "choose" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { go: "card", icon: "card", title: t.tuCard, note: t.tuCardNote },
              { go: "wallet", icon: "wallet", title: t.tuWallet, note: t.tuWalletNote },
            ].map(c => (
              <button key={c.go} onClick={() => setMode(c.go)} style={{
                display: "flex", alignItems: "center", gap: 15, textAlign: "left", padding: "18px 18px",
                borderRadius: 20, boxShadow: "inset 0 0 0 1px var(--bg3)", transition: "background 0.15s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg2)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <span style={{
                  width: 46, height: 46, borderRadius: "50%", background: "var(--bg2)", color: "var(--text)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Ic d={ICONS[c.icon]} size={21} />
                </span>
                <span>
                  <span style={{ display: "block", fontSize: 16 }}>{c.title}</span>
                  <span style={{ display: "block", fontSize: 12.5, color: "var(--mut)", marginTop: 4, lineHeight: 1.5 }}>{c.note}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        {mode === "card" && (
          <React.Fragment>
            <div style={{ borderRadius: 20, boxShadow: "inset 0 0 0 1px var(--bg3)", padding: 18, marginBottom: 14 }}>
              <div className="mlabel" style={{ fontSize: 10, marginBottom: 14 }}>{t.tuPartner}</div>
              <div className="mlabel" style={{ marginBottom: 8 }}>{t.tuAmount}</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {[5, 10, 25].map(n => (
                  <button key={n} className={"chip mono" + (!custom && amt === n ? " on" : "")}
                    style={{ flex: 1, padding: 0, minHeight: 44, fontSize: 14.5 }}
                    onClick={() => { setAmt(n); setCustom(""); }}>${n}</button>
                ))}
                <label style={{
                  flex: 1.1, display: "flex", alignItems: "center", borderRadius: 99, padding: "0 13px", fontSize: 14.5,
                  boxShadow: custom ? "inset 0 0 0 2px var(--acc)" : "inset 0 0 0 1px var(--bg3)",
                }}>
                  <span className="mono">$</span><input value={custom} onChange={(e) => setCustom(e.target.value.replace(/[^\d.,]/g, "").replace(",", "."))} placeholder="…" aria-label={t.tuAmount}
                    style={{ width: "100%", background: "none", border: "none", outline: "none", color: "var(--text)", fontSize: 14.5, padding: "10px 0 10px 2px" }} />
                </label>
              </div>
              <div className="mlabel" style={{ marginBottom: 8 }}>{t.tuMethod}</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {methods.map(m => (
                  <button key={m.id} className={"chip" + (method === m.id ? " on" : "")}
                    style={{ flex: 1, padding: "0 10px", minHeight: 42 }} onClick={() => setMethod(m.id)}>{m.label}</button>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, fontSize: 13, color: "var(--mut)", marginBottom: 14, flexWrap: "wrap" }}>
                <span>{t.tuLanded}: <span className="mono" style={{ color: "var(--text)" }}>{fmtMoney(landed, app.lang, true)}</span></span>
                <span>{t.tuLandedNote}</span>
              </div>
              <button className="btn" style={{ width: "100%", minHeight: 50, fontSize: 15 }}
                onClick={() => { if (val <= 0) return; setMode("done"); setTimeout(() => app.closeTopUp(), 1600); }}>
                {t.tuPay} {val > 0 ? fmtMoney(val, app.lang) : ""}
              </button>
            </div>
            <p style={{ fontSize: 12, color: "var(--mut)", lineHeight: 1.55 }}>{t.tuKycOnce}</p>
          </React.Fragment>
        )}

        {mode === "wallet" && (
          <React.Fragment>
            <div className="mono" style={{
              display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 99, padding: "8px 14px",
              fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16, boxShadow: "inset 0 0 0 1px var(--bg3)",
            }}>
              <span className="hot-dot"></span>{t.tuNetwork}
            </div>
            <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap" }}>
              <div aria-label="QR" style={{ width: 128, height: 128, borderRadius: 16, flexShrink: 0, background: "radial-gradient(circle, var(--text) 0 2.2px, transparent 2.6px) 0 0 / 8px 8px, var(--bg2)", boxShadow: "inset 0 0 0 10px var(--bg2)" }}></div>
              <div style={{ minWidth: 0, flex: "1 1 200px" }}>
                <div className="mlabel" style={{ marginBottom: 8 }}>{t.tuYourAddress}</div>
                <div className="mono" style={{ fontSize: 12.5, lineHeight: 1.55, wordBreak: "break-all", marginBottom: 12 }}>{TU_ADDRESS}</div>
                <button className="btn ghost" style={{ padding: "0 16px", fontSize: 13 }}
                  onClick={() => { try { navigator.clipboard.writeText(TU_ADDRESS); } catch {} app.toast(t.tuCopied); }}>
                  <Ic d={ICONS.copy} size={14} />{t.tuCopy}
                </button>
              </div>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--bad)", lineHeight: 1.55, marginBottom: 8 }}>{t.tuNetworkWarn}</p>
            <p style={{ fontSize: 12.5, color: "var(--mut)", lineHeight: 1.55 }}>{t.tuNoKyc}</p>
          </React.Fragment>
        )}

        {mode === "done" && (
          <div style={{ textAlign: "center", padding: "26px 0 22px" }} className="fade-up">
            <div style={{
              width: 72, height: 72, borderRadius: "50%", background: "var(--acc)", color: "var(--acc-ink)",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px",
            }}>
              <Ic d={ICONS.check} size={30} sw={2.6} />
            </div>
            <p style={{ fontSize: 18, fontWeight: 400, letterSpacing: "-0.02em" }}>{t.tuDone}</p>
            <p className="mono" style={{ fontSize: 12, color: "var(--mut)", marginTop: 8 }}>+{fmtMoney(landed, app.lang, true)} · {t.tuDoneNote}</p>
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { PageSupport, DonateModal, TopUpModal, fmtUsd, BigMoney, BALANCE });
