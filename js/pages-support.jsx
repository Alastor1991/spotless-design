// Spotless — раздел «Артистам» (кому идут ваши деньги) и окна доната и пополнения.
// Суммы — в валюте человека (app.money, см. core.jsx).

// Цена одной точки в распределении: ровный ряд от 5 центов до 100, а если и 100 мало —
// целая часть от деления (с округлением вверх) самой крупной доли на число точек, которое
// помещается в колонку. Потолка нет: раньше ряд кончался на 100, и у крупных сумм полосы обрезались
const DOT_UNITS = [0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10, 25, 50, 100];

// Крупная сумма: знак валюты тонким шрифтом, целые — точечным, копейки — приглушённо.
// Вписывается в ширину своего виджета (useFitScale)
const BigMoney = ({ value, size: full = 150 }) => {
  const m = useApp().money;
  const ref = React.useRef(null);
  const size = full * useFitScale(ref, [value, m]);
  const { whole, cents, sep } = m.parts(value);
  return (
    <span ref={ref} aria-label={m.fmt(value)} style={{ display: "inline-flex", alignItems: "baseline", gap: size * 0.03 }}>
      <span aria-hidden="true" style={{ fontWeight: 300, fontSize: size * 0.37, color: "var(--mut)" }}>{m.sign}</span>
      <span aria-hidden="true" className="dots" style={{ fontSize: size }}>{whole}</span>
      {cents !== "00" && <span aria-hidden="true" className="dots" style={{ fontSize: size * 0.42, color: "var(--dot-off)" }}>{sep}{cents}</span>}
    </span>
  );
};

// Подпись над числом: «Комиссия сервиса 0%» читается именно в таком порядке
const SupStat = ({ label, value }) => (
  <span style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <span className="mlabel ml-s">{label}</span>
    <span className="ty-light" style={{ fontSize: 30, lineHeight: 1 }}>{value}</span>
  </span>
);

// Сумма в месяц: крупная цифра, чипы, своя сумма, итоги и напоминание
const MonthlyWidget = ({ split }) => {
  const app = useApp();
  const t = app.t;
  const m = app.money;
  const passed = DB.supportHistory.reduce((a, h) => a + h.amount + h.extra, 0);
  const preset = (n) => !app.customAmt && app.monthly === n;
  // Выбрали новую сумму в месяц, а на балансе меньше — предложить пополнить счёт на разницу сейчас
  const chosen = (v) => { if (v != null && v !== app.monthly && v > app.balance) app.offerTopUp(v); };
  return (
    <section className="widget" style={{ display: "flex", gap: 32, flexWrap: "wrap", padding: "26px 28px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span className="mlabel">{t.everyMonth}</span>
        <BigMoney value={app.monthly} size={150} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0, flex: "1 1 300px" }}>
        <div role="radiogroup" aria-label={t.supMonthly} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[2, 5, 10].map(n => (
            <button key={n} role="radio" aria-checked={preset(n)} className={"chip mono" + (preset(n) ? " on" : "")}
              style={{ minHeight: 44, padding: "0 20px" }} onClick={() => { chosen(n); app.setMonthly(n); }}>{m.sign}{n}</button>
          ))}
          <label className={"amt-field amt-fill" + (app.customAmt ? " is-on" : "")} style={{ gap: 4, minHeight: 44, padding: "0 16px", fontSize: 14 }}>
            <span className="mono">{m.sign}</span><input value={app.customAmt} inputMode="decimal" onChange={(e) => app.setCustomAmt(cleanAmount(e.target.value))}
              onBlur={() => chosen(app.commitCustom())} onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }} aria-label={t.supCustom}
              placeholder={t.supCustom} style={{
                width: 96, background: "none", border: "none", outline: "none",
                color: "inherit", fontSize: 14, padding: "10px 0",
              }} />
          </label>
        </div>
        <p style={{ fontSize: 14, color: "var(--mut)", lineHeight: 1.55, maxWidth: 460 }}>{t.supNote}</p>
        <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
          <SupStat label={t.passedSince} value={m.fmt(passed)} />
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
  );
};

// Баланс кошелька и два пути пополнения
const BalanceWidget = () => {
  const app = useApp();
  const t = app.t;
  const m = app.money;
  const { whole, cents, sep } = m.parts(app.balance);
  // Крупный баланс вписывается в ширину виджета
  const balRef = React.useRef(null);
  const k = useFitScale(balRef, [app.balance, m]);
  return (
    <section className="widget" style={{ display: "flex", flexDirection: "column", gap: 12, padding: "26px 24px 22px" }}>
      <span className="mlabel">{t.supBalance}</span>
      <span className="ty-light" style={{ display: "flex", alignItems: "baseline", lineHeight: 1, margin: "6px 0 6px" }}>
        <span ref={balRef} style={{ display: "inline-flex", alignItems: "baseline", gap: 2 }}>
          <span style={{ fontSize: 30 * k, color: "var(--mut)" }}>{m.sign}</span>
          <span style={{ fontSize: 60 * k }}>{whole}</span>
          <span style={{ fontSize: 32 * k, color: "var(--mut2)" }}>{sep}{cents}</span>
        </span>
      </span>
      <button className="btn" onClick={() => app.openTopUp()}><Ic d={ICONS.plus} size={15} />{t.supTopUp}</button>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
        {[[t.tuCard, "Apple Pay, Google Pay"], [t.tuWallet, t.tuNetwork]].map(([a, b], i) => (
          <button key={i} onClick={() => app.openTopUp()} style={{ padding: "10px 12px", borderRadius: 14, boxShadow: "inset 0 0 0 1px var(--line)", textAlign: "left", display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "var(--mut)" }}>
            <span style={{ color: "var(--text)", fontSize: 13 }}>{a}</span>{b}
          </button>
        ))}
      </div>
      <p style={{ marginTop: "auto", fontSize: 12, lineHeight: 1.5, color: "var(--mut2)" }}>{t.supNoFees(m.fmt(m.usd(0.01), true))}</p>
    </section>
  );
};

// Распределение: строка на артиста, полоса точек; по нажатию — подробности
const SplitWidget = ({ split, total }) => {
  const app = useApp();
  const t = app.t;
  const m = app.money;
  const [detail, setDetail] = React.useState(null); // id артиста, у которого раскрыты подробности
  // Цена одной точки растёт с суммой, чтобы самая длинная полоса помещалась в свою колонку.
  // Место меряем по колонке первой строки: раньше считали на 38 точек (304px), а колонка уже почти
  // везде, кроме 1440px, — полосы обрезались, и $1,90 выглядело так же, как $1,20 и $0,80
  const barCell = React.useRef(null);
  const cellW = useWidth(barCell);
  const maxDots = cellW ? Math.max(3, Math.floor(cellW / 8)) : 38;
  // От чего считать: от самой крупной доли (её полоса — во всю ширину) или от всей суммы (вся ширина —
  // сумма в месяц) — настройка «Полосы распределения денег»
  const base = app.settings.dotScale === "total" ? total : split[0].amount;
  const unit = DOT_UNITS.find(u => base / u <= maxDots) || Math.ceil(base / maxDots);
  const link = { color: "var(--text)", textDecoration: "underline", textUnderlineOffset: 3 };
  // Колонка сумм — по самой длинной (13px моноширинного ≈ 7,9px на знак), не уже 60px: огромная сумма
  // раньше вылезала из строки и давала прокрутку вбок
  const amtW = Math.max(60, Math.ceil(Math.max(...split.map(s => m.fmt(s.amount, true).length)) * 7.9));
  // Длинные суммы на телефоне уходят строкой ниже — иначе полосам не остаётся места (app.css)
  const longAmt = amtW > 100;
  return (
    <section className="widget" style={{ padding: "24px 28px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>{t.howSplit(m.fmt(total))}</h2>
        <span className="mlabel ml-s">{t.dotIsC(unit, m.currency, unit >= 1000 ? m.int(unit) : m.fmt(unit))}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {split.map((s) => {
          const a = DB.artists[s.artist];
          const open = detail === s.artist;
          return (
            <div key={s.artist}>
              <button onClick={() => setDetail(open ? null : s.artist)} aria-expanded={open} className={"split-row" + (longAmt ? " is-long" : "")} style={{
                display: "grid", gridTemplateColumns: `28px minmax(90px, 170px) 64px minmax(0, 1fr) ${amtW}px`, alignItems: "center",
                gap: 14, width: "100%", textAlign: "left", padding: "7px 8px", borderRadius: 12,
              }}>
                <Cover art={"ar:" + a.id} hue={a.hue} size={28} round={true} />
                <span style={{ fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</span>
                <span className="mono sr-min" style={{ fontSize: 11, color: "var(--mut2)" }}>{s.minutes} {t.minCaps}</span>
                <span ref={s === split[0] ? barCell : undefined} style={{ display: "flex", minWidth: 0, overflow: "hidden" }}>
                  <DotBar pct={1} pitch={8} r={2.6} width={Math.max(1, Math.round(s.amount / unit)) * 8} />
                </span>
                <span className="mono" style={{ fontSize: 13, textAlign: "right" }}>{m.fmt(s.amount, true)}</span>
              </button>
              {open && (
                <div className="fade-up" style={{ padding: "4px 10px 14px 50px", display: "flex", gap: 24, fontSize: 13, color: "var(--mut)", flexWrap: "wrap" }}>
                  <span>{s.pct}%</span>
                  <span><b style={{ color: "var(--text)", fontWeight: 500 }}>{s.minutes}</b> {t.supMinutes}</span>
                  <span><b style={{ color: "var(--text)", fontWeight: 500 }}>{Math.round(s.minutes / 3.8)}</b> {t.playsN}</span>
                  <button style={link} onClick={() => app.go("artist", s.artist)}>{t.goToArtist}</button>
                  <button style={link} onClick={() => app.openDonate({ kind: "artist", id: s.artist })}>{t.donate}</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: 12, color: "var(--mut2)", marginTop: 12 }}>{t.supSplitNote}</p>
    </section>
  );
};

// История по месяцам: столбики из точек (точка — одна единица валюты), доп. донаты — горячим цветом
const HistoryWidget = () => {
  const app = useApp();
  const t = app.t;
  const m = app.money;
  const history = DB.supportHistory.slice().reverse(); // март → июнь
  return (
    <section className="widget" style={{ display: "flex", flexDirection: "column", gap: 14, padding: "24px 24px 22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>{t.supHistory}</h2>
        <span className="mlabel ml-s" style={{ display: "flex", alignItems: "center", gap: 6 }}><span className="hot-dot"></span>{t.supExtra}</span>
      </div>
      <div style={{ flex: 1, minHeight: 150, display: "grid", gridTemplateColumns: `repeat(${history.length}, minmax(0, 1fr))`, alignItems: "end", gap: 8 }}>
        {history.map((h, i) => {
          const cur = h.state === "current";
          const month = app.lang === "ru" ? h.month : h.monthEn;
          const dots = (n, key, bg) => Array.from({ length: Math.round(n) }).map((_, k) => <span key={key + k} style={{ width: 9, height: 9, borderRadius: "50%", background: bg }}></span>);
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }} title={`${month}: ${m.fmt(h.amount + h.extra)}`}>
              <span className="mono" style={{ fontSize: 12, color: cur ? "var(--text)" : "var(--mut)" }}>{m.fmt(h.amount + h.extra)}</span>
              <span style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {dots(h.extra, "e", "var(--hot)")}
                {dots(h.amount, "b", cur ? "var(--text)" : "var(--mut2)")}
              </span>
              <span className="mlabel ml-s" style={{ color: cur ? "var(--text)" : "var(--mut2)" }}>{month}</span>
            </div>
          );
        })}
      </div>
      <span style={{ fontSize: 12, color: "var(--mut2)" }}>{t.dotIs1(m.fmt(1))}</span>
    </section>
  );
};

const PageSupport = () => {
  const app = useApp();
  const t = app.t;
  const total = app.monthly;
  const split = splitNow(total);
  return (
    <div className="fade-in" data-screen-label="Артистам">
      <div style={{ margin: "14px 0 24px" }}>
        <div className="mlabel" style={{ marginBottom: 12 }}>{t.june} · {t.currentMonth}</div>
        <h1 style={{ fontSize: "clamp(34px, 6cqi, 60px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1, textWrap: "balance" }}>{t.supTitle}</h1>
      </div>
      <div className="sup-grid">
        <MonthlyWidget split={split} />
        <BalanceWidget />
      </div>
      <div className="sup-grid">
        <SplitWidget split={split} total={total} />
        <HistoryWidget />
      </div>
    </div>
  );
};

// ---------- Окно доната ----------
// Окно монтируется заново при каждом открытии: раньше его состояние жило между открытиями,
// и на долю секунды мелькало «Спасибо» от прошлого доната, а таймер закрытия от прошлого раза
// мог закрыть новое окно. Закрытое окно ещё EXIT_MS уходит с анимацией (useExit)
const DonateModal = () => {
  const [tgt, out] = useExit(useApp().donateTarget);
  return tgt ? <DonateSheet key={keyOf(tgt)} tgt={tgt} out={out} /> : null;
};

// Кому донат: обложка, название и подпись
const donateHead = (t, tgt) => {
  if (tgt.kind === "track") {
    const { tr, al, ar } = trackInfo(tgt.id);
    return { title: tr.t, sub: `${t.dnTrack} · ${ar.name}`, hue: al.hue, art: al.id };
  }
  if (tgt.kind === "album") {
    const al = DB.albums[tgt.id];
    return { title: al.title, sub: `${t[al.type].toLowerCase()} · ${DB.artists[al.artist].name}`, hue: al.hue, art: al.id };
  }
  const a = DB.artists[tgt.id];
  return { title: a.name, sub: t.dnArtist, hue: a.hue, art: "ar:" + a.id, round: true };
};

const DonateSheet = ({ tgt, out }) => {
  const app = useApp();
  const t = app.t;
  const m = app.money;
  const [amt, setAmt] = React.useState(2);
  const [custom, setCustom] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const close = () => app.closeDonate();
  const { title, sub, hue, art, round = false } = donateHead(t, tgt);
  const val = custom ? parseAmount(custom) || 0 : amt;
  // Донат идёт с баланса: больше, чем на нём есть, не отправить — вместо этого предлагаем пополнить
  const short = val > app.balance;
  const send = () => {
    if (out) return;
    if (short) { close(); app.openTopUp(); return; }
    if (val <= 0) return;
    app.payFromBalance(val, title);
    setSent(true); timer.current = setTimeout(close, 1600);
  };

  return (
    <Sheet close={close} out={out} label={t.dnTitle + " " + title} screen="Модалка доната">
      {!sent ? (
        <React.Fragment>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
            <Cover art={art} hue={hue} size={56} round={round} radius={12} />
            <div style={{ minWidth: 0 }}>
              <div className="mlabel ml-s" style={{ marginBottom: 6 }}>{t.dnTitle} {sub}</div>
              <div style={{ fontSize: 20, fontWeight: 400, letterSpacing: "-0.03em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
            </div>
            <button className="iconbtn" style={{ marginLeft: "auto" }} aria-label={t.close} onClick={close}>
              <Ic d={ICONS.x} size={16} />
            </button>
          </div>
          <div role="radiogroup" style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[1, 2, 5, 10].map(n => (
              <button key={n} role="radio" aria-checked={!custom && amt === n} className={"chip mono" + (!custom && amt === n ? " on" : "")}
                style={{ flex: 1, padding: 0, minHeight: 48, fontSize: 15 }}
                onClick={() => { setAmt(n); setCustom(""); }}>{m.sign}{n}</button>
            ))}
            <label className={"amt-field" + (custom ? " is-on" : "")} style={{ flex: 1.3, padding: "0 14px", fontSize: 15 }}>
              <span className="mono">{m.sign}</span><input value={custom} inputMode="decimal" onChange={(e) => setCustom(cleanAmount(e.target.value))} placeholder="…" aria-label={t.supCustom}
                style={{ width: "100%", background: "none", border: "none", outline: "none", color: "var(--text)", fontSize: 15, padding: "12px 0 12px 2px" }} />
            </label>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13, color: "var(--mut)", marginBottom: 20, flexWrap: "wrap" }}>
            <span>{t.dnFrom}: <span className="mono" style={{ color: short ? "var(--bad)" : "var(--text)", overflowWrap: "anywhere" }}>{m.fmt(app.balance)}</span></span>
            <span>{t.dnNote}</span>
          </div>
          <button className="btn" style={{ width: "100%", minHeight: 52, fontSize: 15, opacity: short || val > 0 ? 1 : 0.45 }} onClick={send}>
            {short ? t.tuTitle : <React.Fragment>{t.dnSend} {val > 0 ? m.fmt(val) : ""}</React.Fragment>}
          </button>
        </React.Fragment>
      ) : (
        <div style={{ textAlign: "center", padding: "26px 0 22px" }} className="fade-up">
          <div style={{
            width: 72, height: 72, borderRadius: "50%", background: "var(--hot)", color: "var(--hot-ink)",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px",
          }}>
            <Ic d={ICONS.heart} size={30} fill="currentColor" />
          </div>
          <p style={{ fontSize: 18, fontWeight: 400, letterSpacing: "-0.02em" }}>{t.dnThanks}</p>
        </div>
      )}
    </Sheet>
  );
};

// ---------- Окно пополнения ----------
// Два равноправных пути: виджет платёжного партнёра (с карты) или перевод с другого кошелька.
const TU_ADDRESS = "7XbR4wqLmZk2tNcVAhuFD9rGoyPe8sJv31MxBqWnK9Qe";

// Комиссия партнёра при пополнении с карты (заглушка) и сколько заплатить, чтобы на баланс дошло need
const topUpFee = (val) => (val > 0 ? Math.max(0.25, val * 0.024) : 0);
const payFor = (need) => Math.ceil(Math.max(need + 0.25, need / 0.976) * 100 - 1e-6) / 100;

// Как и донат, монтируется заново при каждом открытии — без вспышки «Счёт пополнен» от прошлого раза
const TopUpModal = () => {
  const [tu, out] = useExit(useApp().topUp);
  return tu ? <TopUpSheet key={keyOf(tu)} need={tu.amount} out={out} /> : null;
};

// Выбрали сумму в месяц больше баланса: предложить пополнить на разницу сейчас. «Пополнить» открывает
// обычное окно пополнения (оба пути), в пути «с карты» сумма подставлена так, чтобы дошла вся разница
const TopUpOfferModal = () => {
  const [monthly, out] = useExit(useApp().topUpOffer);
  return monthly ? <TopUpOffer monthly={monthly} out={out} /> : null;
};
const TopUpOffer = ({ monthly, out }) => {
  const app = useApp();
  const t = app.t;
  const m = app.money;
  const need = Math.round((monthly - app.balance) * 100) / 100;
  const close = () => app.closeTopUpOffer();
  return (
    <Sheet close={close} out={out} label={t.offerTitle} screen="Предложение пополнить счёт" width={420}>
      <SheetHead title={t.offerTitle} close={close} />
      <p style={{ fontSize: 14.5, color: "var(--mut)", lineHeight: 1.6, marginBottom: 20, overflowWrap: "anywhere", textWrap: "pretty" }}>
        {t.offerNote(m.fmt(monthly), m.fmt(app.balance), m.fmt(need))}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button className="btn" style={{ minHeight: 50, fontSize: 15, whiteSpace: "normal", overflowWrap: "anywhere" }}
          onClick={() => { close(); app.openTopUp(need); }}>{t.offerGo(m.fmt(need))}</button>
        <button className="btn ghost" style={{ minHeight: 46 }} onClick={close}>{t.offerLater}</button>
      </div>
    </Sheet>
  );
};

// Выбор пути: две равноправные карточки
const TopUpChoice = ({ setMode }) => {
  const t = useApp().t;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {[
        { go: "card", icon: "card", title: t.tuCard, note: t.tuCardNote },
        { go: "wallet", icon: "wallet", title: t.tuWallet, note: t.tuWalletNote },
      ].map(c => (
        <button key={c.go} className="tu-choice" onClick={() => setMode(c.go)} style={{
          display: "flex", alignItems: "center", gap: 15, textAlign: "left", padding: "18px 18px",
          borderRadius: 20, boxShadow: "inset 0 0 0 1px var(--bg3)", transition: "background 0.15s",
        }}>
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
  );
};

// С карты: сумма, способ оплаты, итог к зачислению (комиссия партнёра — до подтверждения).
// order — { amt, custom, method }: живёт в окне, чтобы не сбрасываться при возврате к выбору пути
const TopUpCard = ({ order, setOrder, onPaid }) => {
  const app = useApp();
  const t = app.t;
  const m = app.money;
  const { amt, custom, method } = order;
  const setAmt = (n) => setOrder(o => ({ ...o, amt: n, custom: "" }));
  const setCustom = (v) => setOrder(o => ({ ...o, custom: v }));
  const setMethod = (id) => setOrder(o => ({ ...o, method: id }));
  const val = custom ? parseAmount(custom) || 0 : amt;
  const fee = topUpFee(val);
  const landed = Math.max(0, val - fee);
  const methods = [
    { id: "apple", label: "Apple Pay" },
    { id: "google", label: "Google Pay" },
    { id: "plastic", label: t.tuMethodCard },
  ];
  return (
    <React.Fragment>
      <div style={{ borderRadius: 20, boxShadow: "inset 0 0 0 1px var(--bg3)", padding: 18, marginBottom: 14 }}>
        <div className="mlabel ml-s" style={{ marginBottom: 14 }}>{t.tuPartner}</div>
        <div className="mlabel" style={{ marginBottom: 8 }}>{t.tuAmount}</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[5, 10, 25].map(n => (
            <button key={n} className={"chip mono" + (!custom && amt === n ? " on" : "")}
              style={{ flex: 1, padding: 0, minHeight: 44, fontSize: 14.5 }}
              onClick={() => setAmt(n)}>{m.sign}{n}</button>
          ))}
          <label className={"amt-field" + (custom ? " is-on" : "")} style={{ flex: 1.1, padding: "0 13px", fontSize: 14.5 }}>
            <span className="mono">{m.sign}</span><input value={custom} inputMode="decimal" onChange={(e) => setCustom(cleanAmount(e.target.value))} placeholder="…" aria-label={t.tuAmount}
              style={{ width: "100%", background: "none", border: "none", outline: "none", color: "var(--text)", fontSize: 14.5, padding: "10px 0 10px 2px" }} />
          </label>
        </div>
        <div className="mlabel" style={{ marginBottom: 8 }}>{t.tuMethod}</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {methods.map(x => (
            <button key={x.id} className={"chip" + (method === x.id ? " on" : "")}
              style={{ flex: 1, padding: "0 10px", minHeight: 42 }} onClick={() => setMethod(x.id)}>{x.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, fontSize: 13, color: "var(--mut)", marginBottom: 14, flexWrap: "wrap" }}>
          <span>{t.tuLanded}: <span className="mono" style={{ color: "var(--text)" }}>{m.fmt(landed, true)}</span></span>
          <span>{t.tuLandedNote}</span>
        </div>
        <button className="btn" style={{ width: "100%", minHeight: 50, fontSize: 15, opacity: landed > 0 ? 1 : 0.45 }}
          onClick={() => { if (landed > 0) onPaid(landed); }}>
          {t.tuPay} {val > 0 ? m.fmt(val) : ""}
        </button>
      </div>
      <p style={{ fontSize: 12, color: "var(--mut)", lineHeight: 1.55 }}>{t.tuKycOnce}</p>
    </React.Fragment>
  );
};

// С другого кошелька: адрес, QR и предупреждение про сеть
const TopUpWallet = () => {
  const app = useApp();
  const t = app.t;
  return (
    <React.Fragment>
      <div className="mono net-chip">
        <span className="hot-dot"></span>{t.tuNetwork}
      </div>
      <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap" }}>
        <div aria-label="QR" style={{ width: 128, height: 128, borderRadius: 16, flexShrink: 0, background: "radial-gradient(circle, var(--text) 0 2.2px, transparent 2.6px) 0 0 / 8px 8px, var(--bg2)", boxShadow: "inset 0 0 0 10px var(--bg2)" }}></div>
        <div style={{ minWidth: 0, flex: "1 1 200px" }}>
          <div className="mlabel" style={{ marginBottom: 8 }}>{t.tuYourAddress}</div>
          <div className="mono" style={{ fontSize: 12.5, lineHeight: 1.55, wordBreak: "break-all", marginBottom: 12 }}>{TU_ADDRESS}</div>
          <button className="btn ghost" style={{ padding: "0 16px", fontSize: 13 }}
            onClick={() => { copyText(TU_ADDRESS); app.toast(t.tuCopied); }}>
            <Ic d={ICONS.copy} size={14} />{t.tuCopy}
          </button>
        </div>
      </div>
      <p style={{ fontSize: 12.5, color: "var(--bad)", lineHeight: 1.55, marginBottom: 8 }}>{t.tuNetworkWarn}</p>
      <p style={{ fontSize: 12.5, color: "var(--mut)", lineHeight: 1.55 }}>{t.tuNoKyc}</p>
    </React.Fragment>
  );
};

// need — сколько должно дойти до баланса (из предложения пополнить): в пути «с карты» сумма подставлена
const TopUpSheet = ({ need, out }) => {
  const app = useApp();
  const t = app.t;
  const [mode, setMode] = React.useState("choose"); // choose | card | wallet | done
  const [order, setOrder] = React.useState({ amt: 10, custom: need ? amountText(payFor(need), app.lang) : "", method: "apple" });
  const [landed, setLanded] = React.useState(0);
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const close = () => app.closeTopUp();
  const paid = (sum) => { if (out) return; app.topUpBalance(sum); setLanded(sum); setMode("done"); timer.current = setTimeout(close, 1600); };

  return (
    <Sheet close={close} out={out} label={t.tuTitle} screen="Пополнение счёта">
      {mode !== "done" && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          {mode !== "choose" && (
            <button className="iconbtn ring" aria-label={t.back} onClick={() => setMode("choose")}>
              <Ic d={ICONS.back} size={17} />
            </button>
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 400, letterSpacing: "-0.03em" }}>
              {mode === "choose" ? t.tuTitle : mode === "card" ? t.tuCard : t.tuWallet}
            </div>
            {mode === "choose" && <div style={{ fontSize: 13, color: "var(--mut)", marginTop: 3 }}>{t.tuChoose}</div>}
          </div>
          <button className="iconbtn" style={{ marginLeft: "auto" }} aria-label={t.close} onClick={close}>
            <Ic d={ICONS.x} size={16} />
          </button>
        </div>
      )}
      {mode === "choose" && <TopUpChoice setMode={setMode} />}
      {mode === "card" && <TopUpCard order={order} setOrder={setOrder} onPaid={paid} />}
      {mode === "wallet" && <TopUpWallet />}
      {mode === "done" && (
        <div style={{ textAlign: "center", padding: "26px 0 22px" }} className="fade-up">
          <div style={{
            width: 72, height: 72, borderRadius: "50%", background: "var(--acc)", color: "var(--acc-ink)",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px",
          }}>
            <Ic d={ICONS.check} size={30} sw={3.25} />
          </div>
          <p style={{ fontSize: 18, fontWeight: 400, letterSpacing: "-0.02em" }}>{t.tuDone}</p>
          <p className="mono" style={{ fontSize: 12, color: "var(--mut)", marginTop: 8 }}>+{app.money.fmt(landed, true)} · {t.tuDoneNote}</p>
        </div>
      )}
    </Sheet>
  );
};

Object.assign(window, { PageSupport, DonateModal, DonateSheet, TopUpModal, TopUpSheet, TopUpOfferModal, TopUpOffer, BigMoney });
