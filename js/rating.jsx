// Spotless — лайк и оценка.
// Модель — в app: toggleLike (тап) и setRating (1–10 или null). Здесь только взаимодействие:
//  • RateScale — сама шкала 1–10: палец (тап и ведение), мышь (наведение и клик), клавиатура.
//    Ничего не знает о том, где живёт: в окне оценки, в «пилюле» полного экрана, в панели плеера.
//  • LikeButton — тап = лайк/снять; удержание = окно оценки. Не отпуская палец, можно вести
//    по шкале: кнопка держит захват указателя и сама считает значение по прямоугольнику шкалы.
//  • RatingPop — окно со шкалой. Рендерится в body (портал) и гасит свои события, чтобы родители
//    (мини-плеер, строки, жесты полного экрана) их не видели. Само не закрывается:
//    только тап мимо, чёрточка сверху или Esc — оценку можно спокойно поправлять.

const rateAt = (el, x) => {
  const r = el.getBoundingClientRect();
  return Math.max(1, Math.min(10, Math.floor((x - r.left) / (r.width / 10)) + 1));
};

// onPreview — значение «на ходу» (палец/мышь над шкалой, null — превью кончилось): по нему родитель
// обновляет свою крупную цифру, чтобы она двигалась вместе с точками.
const RateScale = React.forwardRef(({ value, external = null, onCommit, onPreview, variant = "pop", showValue = false, label }, ref) => {
  const app = useApp();
  const el = React.useRef(null);
  React.useImperativeHandle(ref, () => el.current);
  const [local, setLocalState] = React.useState(null);
  const localRef = React.useRef(null);
  const pressing = React.useRef(false);
  const shown = external != null ? external : local != null ? local : value;
  const setLocal = (n, tick) => {
    if (localRef.current === n) return;
    localRef.current = n;
    setLocalState(n);
    if (onPreview) onPreview(n);
    if (tick && n != null) buzz(6);
  };
  const preview = setLocal;
  const stop = (e) => e.stopPropagation();
  return (
    <span ref={el} className={"rate-scale rate-" + variant} role="slider" tabIndex={0}
      aria-label={label || app.t.yourRating} aria-valuemin={1} aria-valuemax={10} aria-valuenow={shown || 0}
      aria-valuetext={shown ? `${shown} / 10` : app.t.removeRating}
      onPointerDown={(e) => { stop(e); if (e.button !== 0) return; e.currentTarget.setPointerCapture(e.pointerId); pressing.current = true; preview(rateAt(el.current, e.clientX), true); }}
      onPointerMove={(e) => { stop(e); if (pressing.current) preview(rateAt(el.current, e.clientX), true); else if (e.pointerType === "mouse") preview(rateAt(el.current, e.clientX), false); }}
      onPointerUp={(e) => { stop(e); if (!pressing.current) return; pressing.current = false; const n = rateAt(el.current, e.clientX); setLocal(null); onCommit(n); }}
      onPointerCancel={() => { pressing.current = false; setLocal(null); }}
      onPointerLeave={(e) => { if (!pressing.current && e.pointerType === "mouse") setLocal(null); }}
      onClick={stop}
      onKeyDown={(e) => {
        const cur = shown || 0;
        const k = { ArrowRight: Math.min(10, cur + 1), ArrowUp: Math.min(10, cur + 1), ArrowLeft: Math.max(1, cur - 1), ArrowDown: Math.max(1, cur - 1), Home: 1, End: 10 }[e.key];
        if (k != null) { e.preventDefault(); setLocal(k); }
        if (e.key === "Enter" && local != null) { e.preventDefault(); setLocal(null); onCommit(local); }
      }}>
      <span className="rate-cells">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => {
          const on = shown && n <= shown;
          return (
            <span key={n} className="rate-cell">
              <i className={on ? (shown < 5 ? "is-bad" : "is-on") : ""} style={{ transform: n === shown && (local != null || external != null) ? "scale(1.3)" : "none" }}></i>
            </span>
          );
        })}
      </span>
      {showValue && <span className="rate-val mono" aria-hidden="true">{shown || "–"}</span>}
    </span>
  );
});

// icon — размер сердца, если он не из размера кнопки (мини-плеер «Точки»: кнопка 44, сердце 20)
const LikeButton = ({ trackId, size = 30, always = false, icon }) => {
  const app = useApp();
  const st = app.trackState(trackId);
  const btnRef = React.useRef(null);
  const scaleRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [pop, popOut] = useExit(open);
  const [draft, setDraft] = React.useState(null);
  const [justLiked, setJustLiked] = React.useState(false);
  // Жест: press → (отпустил быстро) тап | (держит HOLD_MS) armed → (сдвинул > SLOP) scrub → отпустил = оценка
  const g = React.useRef(null);

  React.useEffect(() => () => { if (g.current) clearTimeout(g.current.timer); }, []);

  // Оценка ставится, окно остаётся открытым — закрывает его только сам человек
  const commit = (n) => { app.setRating(trackId, n); buzz(14); setDraft(null); };
  const tap = () => {
    const willLike = st.rating == null;
    setOpen(false);
    app.toggleLike(trackId);
    if (willLike) { buzz(10); setJustLiked(true); }
  };

  const onDown = (e) => {
    e.stopPropagation();
    if (e.button !== 0 || g.current) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
    const s = { id: e.pointerId, x: e.clientX, y: e.clientY, phase: "press" };
    s.timer = setTimeout(() => {
      s.phase = "armed"; s.x = s.lastX != null ? s.lastX : s.x; s.y = s.lastY != null ? s.lastY : s.y;
      setDraft(null); setOpen(true); buzz(14);
    }, HOLD_MS);
    g.current = s;
  };
  const onMove = (e) => {
    const s = g.current;
    if (!s || e.pointerId !== s.id) return;
    e.stopPropagation();
    s.lastX = e.clientX; s.lastY = e.clientY;
    const d = Math.hypot(e.clientX - s.x, e.clientY - s.y);
    if (s.phase === "press" && d > SLOP) { clearTimeout(s.timer); g.current = null; return; } // это не нажатие, а движение
    if (s.phase === "armed" && d > SLOP) s.phase = "scrub";
    if (s.phase === "scrub" && scaleRef.current) {
      const n = rateAt(scaleRef.current, e.clientX);
      setDraft(prev => { if (prev !== n) buzz(6); return n; });
    }
  };
  const onUp = (e) => {
    const s = g.current;
    if (!s || e.pointerId !== s.id) return;
    e.stopPropagation();
    clearTimeout(s.timer);
    g.current = null;
    if (s.phase === "press") tap();
    else if (s.phase === "scrub" && scaleRef.current) commit(rateAt(scaleRef.current, e.clientX));
    // armed без движения: окно остаётся открытым — дальше можно тапать и водить по шкале
  };
  const onCancel = () => { const s = g.current; if (s) clearTimeout(s.timer); g.current = null; setDraft(null); };

  const lit = st.rating != null;
  const neg = lit && st.rating < 5;
  // Цифра у сердечка — только для осознанной оценки: быстрый лайк и так читается по сердечку
  const showNum = lit && st.rating !== app.likeRating;
  const label = st.rating != null ? `${app.t.yourRating}: ${st.rating}` : app.t.like; // состояние — в aria-pressed
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <button ref={btnRef}
        className={"iconbtn likebtn" + (neg ? " neg" : lit ? " hot" : "") + (justLiked ? " just-liked" : "")}
        style={{ width: size, height: size, opacity: (always || lit) ? 1 : undefined }}
        title={app.t.holdHint} aria-label={label} aria-pressed={lit} aria-haspopup="dialog" aria-expanded={open}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onCancel}
        onContextMenu={(e) => e.preventDefault()}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tap(); }
          if (e.key === "ArrowUp" || e.key === "ArrowDown") { e.preventDefault(); setOpen(true); }
        }}
      >
        <Ic d={neg ? ICONS.heartOff : ICONS.heart} size={icon || size * 0.56} fill={!neg && lit ? "currentColor" : "none"} />
      </button>
      {/* Разлёт точек (app.css). just-liked снимается по его концу: он дольше подпрыгивания сердца,
          а подпрыгивание в «Уменьшить движение» выключено совсем — его конца не дождаться */}
      {justLiked && (
        <span className="like-burst" aria-hidden="true" style={{ fontSize: icon || size * 0.56 }} onAnimationEnd={() => setJustLiked(false)}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map(k => <i key={k} style={{ "--a": k * 45 + "deg" }}></i>)}
        </span>
      )}
      {showNum && (
        <span className={"rate-n mono" + (neg ? " is-bad" : "")}>{st.rating}</span>
      )}
      {pop && (
        <RatingPop trackId={trackId} anchor={btnRef} scaleRef={scaleRef} draft={draft} out={popOut}
          onCommit={commit}
          onClear={() => { app.setRating(trackId, null); setOpen(false); }}
          close={() => { setDraft(null); setOpen(false); }} />
      )}
    </span>
  );
};

// Окно оценки. Позиционируется от кнопки, рендерится в body. Закрывается тапом мимо,
// чёрточкой сверху (тап или смахнуть) и Esc. Крупная цифра показывает значение на ходу:
// при ведении от сердечка (draft) и при ведении/наведении по самой шкале (preview).
const RatingPop = ({ trackId, anchor, scaleRef, draft, out, onCommit, onClear, close }) => {
  const app = useApp();
  const st = app.trackState(trackId);
  const [pos, setPos] = React.useState(null);
  const [preview, setPreview] = React.useState(null);
  const popRef = React.useRef(null);
  const shown = draft != null ? draft : preview != null ? preview : st.rating;

  React.useLayoutEffect(() => {
    if (!popRef.current || !anchor.current) return;
    const a = boxOf(anchor.current);
    const p = popRef.current.getBoundingClientRect();
    const left = Math.max(10, Math.min(window.innerWidth - 10 - p.width, a.left + a.width / 2 - p.width / 2));
    let top = a.top - p.height - 12;
    if (top < 10) top = a.bottom + 12;
    setPos({ left, top });
  }, []);
  React.useEffect(() => {
    const outside = (e) => {
      if (popRef.current && popRef.current.contains(e.target)) return;
      if (anchor.current && anchor.current.contains(e.target)) return; // сердечко решает само
      close();
    };
    window.addEventListener("pointerdown", outside, true); // перехват: многие элементы гасят всплытие
    return () => window.removeEventListener("pointerdown", outside, true);
  }, []);
  useEscape(close, !out); // Esc закрывает только окно, полный экран под ним остаётся

  // Граница событий: портал всплывает по дереву React к родителям сердечка — не пускаем
  const wall = (e) => e.stopPropagation();
  return ReactDOM.createPortal(
    <div ref={popRef} className={"pop ratepop" + (out ? " is-out" : "")} role="dialog" aria-label={app.t.yourRating}
      onPointerDown={wall} onPointerMove={wall} onPointerUp={wall} onClick={wall} onContextMenu={(e) => e.preventDefault()}
      style={{ position: "fixed", left: pos ? pos.left : -9999, top: pos ? pos.top : -9999, zIndex: 300 }}>
      <button className="ratepop-grip" aria-label={app.t.close}
        onPointerDown={(e) => { try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {} }}
        onClick={close}><span></span></button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span className="mlabel">{app.t.yourRating}</span>
        <span className="dots" style={{ fontSize: 30, minWidth: 40, textAlign: "right", color: shown && shown < 5 ? "var(--bad)" : "var(--text)" }}>{shown || "–"}</span>
      </div>
      <RateScale ref={scaleRef} value={st.rating} external={draft} onPreview={setPreview} onCommit={onCommit} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginTop: 10 }}>
        <span style={{ fontSize: 12, color: "var(--mut)", lineHeight: 1.45 }}>{app.t.ratingHint}</span>
        {st.rating != null && (
          <button className="more" style={{ fontSize: 12, flexShrink: 0 }} onClick={onClear}>{app.t.removeRating}</button>
        )}
      </div>
    </div>,
    document.body
  );
};

Object.assign(window, { rateAt, RateScale, LikeButton, RatingPop });
