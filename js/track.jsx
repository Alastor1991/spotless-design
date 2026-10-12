// Spotless — кнопки действий с треком (плюсик, донат, загрузка) и строка трека.

// Плюсик: поповер со списком плейлистов. ids — один трек или сразу несколько (весь альбом):
// галочка стоит, только если в плейлисте все они.
// Поповер рендерится в body (портал) с fixed-позицией от кнопки: внутри прокручиваемой страницы
// его обрезал край .main и перекрывала липкая шапка — на странице альбома верхний плейлист
// было не нажать. Монтируется только при открытии, поэтому замер позиции — в правильный момент.
const PlusPop = ({ ids, inPls, anchor, out, close }) => {
  const app = useApp();
  const ref = React.useRef(null);
  const [pos, setPos] = React.useState(null);
  React.useLayoutEffect(() => {
    if (!ref.current || !anchor.current) return;
    const a = boxOf(anchor.current);
    const p = ref.current.getBoundingClientRect();
    const left = Math.max(10, Math.min(window.innerWidth - 10 - p.width, a.left + a.width / 2 - p.width / 2));
    let top = a.top - p.height - 10;                                    // над кнопкой,
    if (top < 10) top = Math.min(a.bottom + 10, window.innerHeight - 10 - p.height); // а не влезает — под ней
    setPos({ left, top: Math.max(10, top) });
  }, []);
  React.useEffect(() => {
    const outside = (e) => {
      if (ref.current && ref.current.contains(e.target)) return;
      if (anchor.current && anchor.current.contains(e.target)) return; // кнопка открывает и закрывает сама
      close();
    };
    // Прокрутили то, в чём живёт кнопка, — она уехала, поповер закрываем (прокрутка текста песни не в счёт)
    const scroll = (e) => {
      const el = e.target;
      if (!anchor.current || (ref.current && ref.current.contains(el))) return;
      if (el === document || (el.contains && el.contains(anchor.current))) close();
    };
    window.addEventListener("pointerdown", outside, true); // перехват: многие элементы гасят всплытие
    window.addEventListener("scroll", scroll, true);
    return () => { window.removeEventListener("pointerdown", outside, true); window.removeEventListener("scroll", scroll, true); };
  }, []);
  useEscape(close, !out);
  // Граница событий: портал всплывает по дереву React к строке трека и жестам плеера — не пускаем
  const wall = (e) => e.stopPropagation();
  return ReactDOM.createPortal(
    <div ref={ref} className={"pop" + (out ? " is-out" : "")}
      onPointerDown={wall} onPointerMove={wall} onPointerUp={wall} onMouseDown={wall} onTouchStart={wall}
      onClick={wall} onDoubleClick={wall} onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
      style={{ position: "fixed", left: pos ? pos.left : -9999, top: pos ? pos.top : -9999, width: 240, padding: 6, zIndex: 300 }}>
      <div className="mlabel" style={{ padding: "8px 10px 8px" }}>{app.t.addToPlaylist}</div>
      <div style={{ maxHeight: 235, overflowY: "auto" }}>
        {app.allPlaylists.filter(p => p.byMe).map(pl => {
          const on = inPls.includes(pl.id);
          return (
            <button key={pl.id} className="pop-item" onClick={() => app.togglePlaylist(ids, pl.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
                padding: "7px 10px", borderRadius: 10, fontSize: 13.5, color: "var(--text)",
              }}>
              <Cover hue={pl.hue} size={24} radius={6} />
              <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{plName(app.lang, pl)}</span>
              {on && <Ic d={ICONS.check} size={14} style={{ color: "var(--acc)" }} />}
            </button>
          );
        })}
      </div>
      <div className="divider" style={{ margin: "6px 0" }}></div>
      <button className="pop-item" onClick={() => { close(); app.openCreatePl({ thenAdd: ids }); }}
        style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "7px 10px", borderRadius: 10, fontSize: 13.5, color: "var(--mut)" }}>
        <Ic d={ICONS.plus} size={16} /><span>{app.t.newPlaylist}</span>
      </button>
    </div>,
    document.body
  );
};

// trackId — один трек; trackIds — несколько (плюсик на странице альбома работает со всем альбомом)
const PlusButton = ({ trackId, trackIds, size = 30, className = "" }) => {
  const app = useApp();
  const [open, setOpen] = React.useState(false);
  const [pop, popOut] = useExit(open);
  const btnRef = React.useRef(null);
  const ids = trackIds || [trackId];
  const inPls = app.playlistsWithAll(ids);
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <button ref={btnRef} className={"iconbtn " + className + (inPls.length ? " lit" : "")} style={{ width: size, height: size }}
        title={app.t.addToPlaylist} aria-label={app.t.addToPlaylist} aria-expanded={open}
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}>
        <Ic d={inPls.length ? ICONS.check : ICONS.plus} size={size * 0.53} />
      </button>
      {pop && <PlusPop ids={ids} inPls={inPls} anchor={btnRef} out={popOut} close={() => setOpen(false)} />}
    </span>
  );
};

// Значок $ — открывает донат
const DonateButton = ({ target, size = 30, className = "" }) => {
  const app = useApp();
  return (
    <button className={"iconbtn " + className} style={{ width: size, height: size }} title={app.t.donate} aria-label={app.t.donate}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => { e.stopPropagation(); app.openDonate(target); }}>
      <Ic d={ICONS.dollar} size={size * 0.5} />
    </button>
  );
};

// Кнопка загрузки: общее состояние в app.downloads — релиз и его треки связаны.
// trackId — один трек; albumId — весь релиз; listIds — произвольный список (плейлист).
// У списка «загрузка» — только пока что-то правда качается: частично скачанный альбом
// раньше навсегда показывал кольцо прогресса, хотя ничего не происходило.
const DLButton = ({ trackId, albumId, listIds, size = 42, className = "" }) => {
  const app = useApp();
  let state = "idle", dur = 2400;
  const ids = trackId ? null : albumId ? albumIds(DB.albums[albumId]) : listIds;
  if (trackId) {
    state = app.downloads[trackId] || "idle";
  } else if (ids) {
    if (ids.length && ids.every(id => app.downloads[id] === "done")) state = "done";
    else if (ids.some(id => app.downloads[id] === "loading")) state = "loading";
    dur = ids.length * 450 + 1500;
  }
  const click = (e) => {
    e.stopPropagation();
    if (trackId) app.toggleDl(trackId);
    else if (albumId) app.toggleDlAlbum(albumId);
    else if (listIds) app.toggleDlList(listIds);
  };
  const R = 9.2, C = (2 * Math.PI * R).toFixed(1);
  // Линия — 1,25 px, как у значков (Ic). Не через non-scaling-stroke: тогда и штрих прогресса
  // (dasharray) считался бы в px экрана, а не в единицах кольца
  const s = Math.round(size * 0.52), lw = 30 / s;
  return (
    <button className={"iconbtn " + className + (state === "done" ? " lit" : "")} style={{ width: size, height: size }}
      title={state === "done" ? app.t.downloaded : app.t.download} aria-label={state === "done" ? app.t.downloaded : app.t.download} onClick={click}>
      {state === "idle" && <Ic d={ICONS.downloadCircle} size={s} />}
      {state === "loading" && (
        <svg width={s} height={s} viewBox="0 0 24 24" style={{ display: "block" }}>
          <circle cx="12" cy="12" r={R} fill="none" stroke="var(--bg3)" strokeWidth={lw}></circle>
          <circle cx="12" cy="12" r={R} fill="none" stroke="var(--acc)" strokeWidth={lw} strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C} transform="rotate(-90 12 12)"
            style={{ animation: `dlfill ${dur}ms linear forwards` }}></circle>
          <path d="M12 8.2v5.6 M9.8 11.6L12 13.8l2.2-2.2" stroke="var(--mut)" strokeWidth={lw} fill="none" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      )}
      {state === "done" && (
        <svg width={s} height={s} viewBox="0 0 24 24" style={{ display: "block" }}>
          {/* Скачано — круг со стрелкой, а не вторая галочка: галочка у плюсика значит «в плейлисте» */}
          <circle cx="12" cy="12" r="9.5" fill="var(--acc)"></circle>
          <path d="M12 7.4v8.4M8.6 12.4L12 15.8l3.4-3.4" stroke="var(--acc-ink)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      )}
    </button>
  );
};

// Строка трека. plId — контекст плейлиста (для «убрать из плейлиста» в меню),
// qIndex — позиция в очереди (для «убрать из очереди»). noCover — внутри страницы релиза.
const TrackRow = ({ trackId, num, showPlays = false, plId, qIndex, noCover = false }) => {
  const app = useApp();
  const { tr, al, ar } = trackInfo(trackId);
  const playing = app.player.trackId === trackId;
  const payload = { kind: "track", id: trackId, plId, qIndex };
  const lp = useLongPress((x, y) => app.openCtxPoint(x, y, payload));
  return (
    <div className={"trow" + (playing ? " playing" : "") + (noCover ? " nocover" : "")} onDoubleClick={() => app.playTrack(trackId)}
      {...lp} onContextMenu={(e) => isTouchUI() ? e.preventDefault() : app.openCtx(e, payload)}>
      <span className="num">{playing
        ? <span className="hot-dot" style={{ width: 7, height: 7, marginLeft: 2, display: "block" }} title={app.t.nowPlaying}></span>
        : String(num).padStart(2, "0")}</span>
      {!noCover && (
        <button onClick={() => app.playTrack(trackId)} aria-label={`${app.t.play || "▶"} ${tr.t}`} style={{ display: "block", position: "relative" }}>
          <Cover art={al.id} hue={al.hue} size={40} radius={8} />
        </button>
      )}
      {/* На телефоне двойного клика нет: строка играет по тапу (кроме ссылки на артиста) */}
      <div style={{ minWidth: 0 }} onClick={app.phone ? (e) => { if (!e.target.closest(".ta")) app.playTrack(trackId); } : undefined}>
        {noCover
          ? <button className="tt" style={{ display: "block", textAlign: "left", maxWidth: "100%" }} onClick={() => app.playTrack(trackId)}>{tr.t}</button>
          : <div className="tt">{tr.t}</div>}
        {!noCover && <button className="ta" style={{ display: "block", textAlign: "left" }} onClick={() => app.go("artist", ar.id)}>{ar.name}</button>}
      </div>
      {showPlays
        ? <span className="alb" style={{ fontVariantNumeric: "tabular-nums", textAlign: noCover ? "right" : "left" }}>{tr.plays}</span>
        : <button className="alb" style={{ textAlign: "left" }} onClick={() => app.go("album", al.id)}>{al.title}</button>}
      <div className="acts">
        <LikeButton trackId={trackId} />
        <PlusButton trackId={trackId} className="no-phone" />
        <DLButton size={30} className="dlb" trackId={trackId} />
        <DonateButton target={{ kind: "track", id: trackId }} className="no-phone" />
        <button className="iconbtn only-phone" style={{ width: 36, height: 36 }} aria-label={app.t.more}
          onClick={(e) => { e.stopPropagation(); app.openCtxAt(e.currentTarget, payload); }}>
          <Ic d={ICONS.more} size={18} fill="currentColor" />
        </button>
      </div>
      <span className="dur">{tr.dur.padStart(5, "0")}</span>
    </div>
  );
};

Object.assign(window, { PlusPop, PlusButton, DonateButton, DLButton, TrackRow });
