// Spotless — «Моя поддержка» + модалка доната.

const fmtUsd = (n) => "$" + n.toFixed(2).replace(/\.00$/, "");

const PageSupport = () => {
  const app = useApp();
  const t = app.t;
  const [detail, setDetail] = React.useState(null); // id артиста для раскрытия
  const total = app.monthly;
  return (
    <div className="fade-in" data-screen-label="Моя поддержка" style={{ maxWidth: 920 }}>
      <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", margin: "26px 0 22px" }}>{t.supTitle}</h1>

      <div className="sup-grid">
        {/* Ежемесячная поддержка */}
        <div style={{ background: "var(--bg1)", borderRadius: "var(--r)", padding: 24, border: "1px solid var(--line)" }}>
          <div className="sec-label" style={{ marginBottom: 14 }}>{t.supMonthly}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.02em" }}>{fmtUsd(total)}</span>
            <span style={{ fontSize: 15, color: "var(--mut)" }}>/ {t.supMonth} · {t.supThisMonth}</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            {[2, 5, 10].map(n => (
              <button key={n} className={"chip" + (!app.customAmt && app.monthly === n ? " on" : "")} onClick={() => app.setMonthly(n)}>${n}</button>
            ))}
            <div style={{
              display: "flex", alignItems: "center", gap: 4, borderRadius: 99,
              padding: "0 14px", fontSize: 13.5, fontWeight: 600,
              background: app.customAmt ? "var(--acc)" : "var(--bg2)",
              color: app.customAmt ? "var(--acc-ink)" : "var(--text)",
            }}>
              $<input value={app.customAmt} onChange={(e) => app.setCustomAmt(e.target.value.replace(/[^\d.]/g, ""))}
                onBlur={app.commitCustom}
                placeholder={t.supCustom} style={{
                  width: 76, background: "none", border: "none", outline: "none",
                  color: "inherit", fontSize: 13.5, fontWeight: 600, padding: "7px 0",
                }} />
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, cursor: "pointer" }}
            onClick={() => app.setAuto(!app.auto)}>
            <span className={"toggle" + (app.auto ? " on" : "")}></span>
            <span style={{ fontSize: 13.5 }}>{t.supRemind} <span style={{ color: "var(--mut)" }}>{t.supRemindNote}</span></span>
          </label>
          <p style={{ fontSize: 12.5, color: "var(--mut)", lineHeight: 1.55 }}>{t.supNote}</p>
        </div>

        {/* Баланс + история */}
        <div style={{ background: "var(--bg1)", borderRadius: "var(--r)", padding: 24, border: "1px solid var(--line)", display: "flex", flexDirection: "column" }}>
          <div className="sec-label" style={{ marginBottom: 14 }}>{t.supBalance}</div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 30, fontWeight: 800 }}>{fmtUsd(7.35)}</span>
            <button className="btn ghost" style={{ padding: "8px 18px", fontSize: 13 }} onClick={() => app.openTopUp()}>
              <Ic d={ICONS.plus} size={14} />{t.supTopUp}
            </button>
          </div>
          <div className="sec-label" style={{ marginBottom: 10 }}>{t.supHistory}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
            {DB.supportHistory.map((h, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}>
                <span style={{ color: h.state === "current" ? "var(--text)" : "var(--mut)", fontWeight: h.state === "current" ? 700 : 500 }}>
                  {app.lang === "ru" ? h.month : h.monthEn}
                  {h.extra > 0 && <span style={{ color: "var(--mut)", fontWeight: 500 }}> · +{fmtUsd(h.extra)} {t.supExtra}</span>}
                </span>
                <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--mut)" }}>{fmtUsd(h.amount + h.extra)}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "var(--mut)", marginTop: 12 }}>{t.supNoFees}</p>
        </div>
      </div>

      {/* Распределение */}
      <div style={{ background: "var(--bg1)", borderRadius: "var(--r)", padding: 24, border: "1px solid var(--line)" }}>
        <div style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 17, fontWeight: 700 }}>{t.supSplitTitle} {fmtUsd(total)} {t.supThisMonth}</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--mut)", marginBottom: 18 }}>{t.supSplitNote}</p>

        {/* Полоса распределения */}
        <div style={{ display: "flex", height: 14, borderRadius: 99, overflow: "hidden", gap: 2, marginBottom: 20 }}>
          {DB.supportSplit.map((s) => (
            <div key={s.artist} title={DB.artists[s.artist].name}
              style={{ width: `${s.pct}%`, background: `oklch(0.72 0.11 ${DB.artists[s.artist].hue})`, cursor: "pointer" }}
              onClick={() => setDetail(detail === s.artist ? null : s.artist)}></div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {DB.supportSplit.map((s) => {
            const a = DB.artists[s.artist];
            const open = detail === s.artist;
            return (
              <div key={s.artist}>
                <button onClick={() => setDetail(open ? null : s.artist)} style={{
                  display: "grid", gridTemplateColumns: "36px minmax(0,1fr) 70px 90px 24px", alignItems: "center",
                  gap: 12, width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: "var(--r-sm)",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg2)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <Cover hue={a.hue} size={34} round={true} label="" />
                  <span style={{ fontSize: 14.5, fontWeight: 600 }}>{a.name}</span>
                  <span style={{ fontSize: 13.5, color: "var(--mut)", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{s.pct}%</span>
                  <span style={{ fontSize: 14, fontWeight: 700, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtUsd(s.amount)}</span>
                  <Ic d={ICONS.chevD} size={15} style={{ color: "var(--mut)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
                </button>
                {open && (
                  <div className="fade-up" style={{ padding: "4px 10px 14px 58px", display: "flex", gap: 28, fontSize: 13, color: "var(--mut)" }}>
                    <span><b style={{ color: "var(--text)" }}>{s.minutes}</b> {t.supMinutes}</span>
                    <span><b style={{ color: "var(--text)" }}>{Math.round(s.minutes / 3.8)}</b> {app.lang === "ru" ? "прослушиваний" : "plays"}</span>
                    <button style={{ color: "var(--acc)", fontWeight: 600 }} onClick={() => app.go("artist", s.artist)}>{t.goToArtist} →</button>
                    <button style={{ color: "var(--acc)", fontWeight: 600 }} onClick={() => app.openDonate({ kind: "artist", id: s.artist })}>+ {t.donate}</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
  if (!tgt) return null;

  let title, sub, hue, round = false;
  if (tgt.kind === "track") {
    const tr = DB.trackIndex[tgt.id];
    title = tr.t; sub = `${t.dnTrack} · ${DB.artists[tr.artist].name}`; hue = DB.albums[tr.album].hue;
  } else if (tgt.kind === "album") {
    const al = DB.albums[tgt.id];
    title = al.title; sub = `${t[al.type].toLowerCase()} · ${DB.artists[al.artist].name}`; hue = al.hue;
  } else {
    const a = DB.artists[tgt.id];
    title = a.name; sub = t.dnArtist; hue = a.hue; round = true;
  }
  const val = custom ? parseFloat(custom) || 0 : amt;

  return (
    <div className="scrim fade-in" onClick={() => app.closeDonate()}>
      <div className="modal fade-up" onClick={(e) => e.stopPropagation()} data-screen-label="Модалка доната">
        {!sent ? (
          <React.Fragment>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <Cover hue={hue} size={56} round={round} radius={10} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, color: "var(--mut)", marginBottom: 2 }}>{t.dnTitle} {sub}</div>
                <div style={{ fontSize: 18, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
              </div>
              <button className="iconbtn" style={{ marginLeft: "auto" }} onClick={() => app.closeDonate()}>
                <Ic d={ICONS.x} size={16} />
              </button>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {[1, 2, 5, 10].map(n => (
                <button key={n} className={"chip" + (!custom && amt === n ? " on" : "")}
                  style={{ flex: 1, padding: "10px 0", fontSize: 15 }}
                  onClick={() => { setAmt(n); setCustom(""); }}>${n}</button>
              ))}
              <div style={{
                flex: 1.2, display: "flex", alignItems: "center", background: "var(--bg2)",
                borderRadius: 99, padding: "0 14px", fontSize: 15, fontWeight: 600,
                outline: custom ? "2px solid var(--acc)" : "none",
              }}>
                $<input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="…"
                  style={{ width: "100%", background: "none", border: "none", outline: "none", color: "var(--text)", fontSize: 15, fontWeight: 600, padding: "10px 0 10px 2px" }} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--mut)", marginBottom: 18 }}>
              <span>{t.dnFrom}: <b style={{ color: "var(--text)" }}>{fmtUsd(7.35)}</b></span>
              <span>{t.dnNote}</span>
            </div>
            <button className="btn" style={{ width: "100%", padding: "13px 0", fontSize: 15 }}
              onClick={() => { setSent(true); setTimeout(() => app.closeDonate(), 1600); }}>
              <Ic d={ICONS.dollar} size={16} />{t.dnSend} {val > 0 ? fmtUsd(val) : ""}
            </button>
          </React.Fragment>
        ) : (
          <div style={{ textAlign: "center", padding: "26px 0 22px" }} className="fade-up">
            <div style={{
              width: 64, height: 64, borderRadius: "50%", background: "var(--acc)", color: "var(--acc-ink)",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
            }}>
              <Ic d={ICONS.check} size={30} sw={2.6} />
            </div>
            <p style={{ fontSize: 16, fontWeight: 700 }}>{t.dnThanks}</p>
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
      <div className="modal fade-up" onClick={(e) => e.stopPropagation()} data-screen-label="Пополнение счёта">
        {mode !== "done" && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            {mode !== "choose" && (
              <button className="iconbtn" onClick={() => setMode("choose")}>
                <Ic d={ICONS.back} size={17} />
              </button>
            )}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>
                {mode === "choose" ? t.tuTitle : mode === "card" ? t.tuCard : t.tuWallet}
              </div>
              {mode === "choose" && <div style={{ fontSize: 13, color: "var(--mut)", marginTop: 2 }}>{t.tuChoose}</div>}
            </div>
            <button className="iconbtn" style={{ marginLeft: "auto" }} onClick={() => app.closeTopUp()}>
              <Ic d={ICONS.x} size={16} />
            </button>
          </div>
        )}

        {mode === "choose" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { go: "card", icon: "card", title: t.tuCard, note: t.tuCardNote },
              { go: "wallet", icon: "wallet", title: t.tuWallet, note: t.tuWalletNote },
            ].map(c => (
              <button key={c.go} onClick={() => setMode(c.go)} style={{
                display: "flex", alignItems: "center", gap: 15, textAlign: "left", padding: "16px 18px",
                background: "transparent", border: "1px solid var(--line)", borderRadius: "var(--r)",
                transition: "border-color 0.15s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--acc)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--line)"}>
                <span style={{
                  width: 44, height: 44, borderRadius: "50%", background: "var(--bg2)", color: "var(--acc)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Ic d={ICONS[c.icon]} size={21} />
                </span>
                <span>
                  <span style={{ display: "block", fontSize: 15.5, fontWeight: 700 }}>{c.title}</span>
                  <span style={{ display: "block", fontSize: 12.5, color: "var(--mut)", marginTop: 4, lineHeight: 1.5 }}>{c.note}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        {mode === "card" && (
          <React.Fragment>
            <div style={{ border: "1px dashed var(--line)", borderRadius: "var(--r)", padding: 18, marginBottom: 14 }}>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--mut)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>{t.tuPartner}</div>
              <div className="sec-label" style={{ marginBottom: 8 }}>{t.tuAmount}</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {[5, 10, 25].map(n => (
                  <button key={n} className={"chip" + (!custom && amt === n ? " on" : "")}
                    style={{ flex: 1, padding: "10px 0", fontSize: 14.5 }}
                    onClick={() => { setAmt(n); setCustom(""); }}>${n}</button>
                ))}
                <div style={{
                  flex: 1.1, display: "flex", alignItems: "center", background: "var(--bg2)",
                  borderRadius: 99, padding: "0 13px", fontSize: 14.5, fontWeight: 600,
                  outline: custom ? "2px solid var(--acc)" : "none",
                }}>
                  $<input value={custom} onChange={(e) => setCustom(e.target.value.replace(/[^\d.]/g, ""))} placeholder="…"
                    style={{ width: "100%", background: "none", border: "none", outline: "none", color: "var(--text)", fontSize: 14.5, fontWeight: 600, padding: "10px 0 10px 2px" }} />
                </div>
              </div>
              <div className="sec-label" style={{ marginBottom: 8 }}>{t.tuMethod}</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {methods.map(m => (
                  <button key={m.id} className={"chip" + (method === m.id ? " on" : "")}
                    style={{ flex: 1, padding: "9px 0" }} onClick={() => setMethod(m.id)}>{m.label}</button>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, fontSize: 13, color: "var(--mut)", marginBottom: 14 }}>
                <span>{t.tuLanded}: <b style={{ color: "var(--text)", fontVariantNumeric: "tabular-nums" }}>${landed.toFixed(2)}</b></span>
                <span>{t.tuLandedNote}</span>
              </div>
              <button className="btn" style={{ width: "100%", padding: "12px 0", fontSize: 15 }}
                onClick={() => { if (val <= 0) return; setMode("done"); setTimeout(() => app.closeTopUp(), 1600); }}>
                <Ic d={ICONS.card} size={16} />{t.tuPay} {val > 0 ? fmtUsd(val) : ""}
              </button>
            </div>
            <p style={{ fontSize: 12, color: "var(--mut)", lineHeight: 1.55 }}>{t.tuKycOnce}</p>
          </React.Fragment>
        )}

        {mode === "wallet" && (
          <React.Fragment>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bg2)",
              borderRadius: 99, padding: "7px 14px", fontSize: 13, fontWeight: 700, marginBottom: 16,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--acc)", flexShrink: 0 }}></span>
              {t.tuNetwork}
            </div>
            <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 16 }}>
              <Cover hue={95} size={126} radius={12} label="qr" />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="sec-label" style={{ marginBottom: 8 }}>{t.tuYourAddress}</div>
                <div className="mono" style={{ fontSize: 12.5, lineHeight: 1.55, wordBreak: "break-all", marginBottom: 12 }}>{TU_ADDRESS}</div>
                <button className="btn ghost" style={{ padding: "8px 16px", fontSize: 13 }}
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
              width: 64, height: 64, borderRadius: "50%", background: "var(--acc)", color: "var(--acc-ink)",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
            }}>
              <Ic d={ICONS.check} size={30} sw={2.6} />
            </div>
            <p style={{ fontSize: 16, fontWeight: 700 }}>{t.tuDone}</p>
            <p style={{ fontSize: 13, color: "var(--mut)", marginTop: 6 }}>+${landed.toFixed(2)} · {t.tuDoneNote}</p>
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { PageSupport, DonateModal, TopUpModal, fmtUsd });
