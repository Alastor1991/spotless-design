// Spotless — состояние приложения по разделам. Каждый хук владеет своим куском состояния и
// возвращает { api, keep }:
//   api  — что видят компоненты через useApp(): значения и функции для работы с ними;
//   keep — что сохраняется между запусками (ключи — как в localStorage).
// App (app.jsx) вызывает хуки, склеивает их api в один объект и сохраняет keep.
// saved — сохранённое при прошлом запуске, уже проверенное cleanSaved (storage.jsx).
// Хуки зовут друг друга только через явно переданные функции (toast, go…) — без скрытых связей.

// ---------- Язык ----------
const useLocale = (saved) => {
  const [lang, setLang] = React.useState(saved.lang || "ru");
  return {
    api: { t: I18N[lang], lang, setLang },
    keep: { lang },
  };
};

// ---------- Тосты и одноразовые подсказки ----------
const useFeedback = (saved) => {
  const [toasts, setToasts] = React.useState([]);
  const [hints, setHints] = React.useState(saved.hints || {});
  const hintsRef = React.useRef(hints);
  React.useEffect(() => { hintsRef.current = hints; }, [hints]);
  // Тост; action — { label, run } для «Вернуть» и подобного: такой живёт дольше
  const toast = (msg, action) => {
    const id = Date.now() + Math.random();
    setToasts(ts => [...ts, { id, msg, action }]);
    setTimeout(() => setToasts(ts => ts.filter(x => x.id !== id)), action ? 4500 : 2400);
  };
  const dismissToast = (id) => setToasts(ts => ts.filter(x => x.id !== id));
  // Подсказка показывается один раз за всё время (key — что именно объясняем)
  const hint = (key, msg) => {
    if (hintsRef.current[key]) return;
    hintsRef.current = { ...hintsRef.current, [key]: 1 };
    setHints(h => ({ ...h, [key]: 1 }));
    setTimeout(() => toast(msg), 700);
  };
  return {
    api: { toasts, toast, dismissToast, hint },
    keep: { hints },
  };
};

// ---------- Навигация, поиск, онбординг ----------
const useNav = (saved) => {
  const [route, setRoute] = React.useState(saved.route || { page: "home", id: null });
  const [history, setHistory] = React.useState([]);
  const [future, setFuture] = React.useState([]);
  const [query, setQuery] = React.useState("");
  const [onboarded, setOnboarded] = React.useState(saved.onboarded === true);

  const go = (page, id = null) => {
    if (page === "onboarding") { setOnboarded(false); return; }
    const main = document.querySelector(".main");
    // Уже здесь — просто наверх. Раньше в историю ложился дубль, и «Назад» загоралась впустую
    if (page === route.page && (id || null) === (route.id || null)) {
      if (main) main.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setHistory(h => [...h, route]);
    setFuture([]);
    setRoute({ page, id });
    if (page !== "search") setQuery("");
    if (main) main.scrollTop = 0;
  };
  const goBack = () => {
    if (!history.length) return;
    setFuture(f => [route, ...f]);
    setRoute(history[history.length - 1]);
    setHistory(h => h.slice(0, -1));
  };
  const goFwd = () => {
    if (!future.length) return;
    setHistory(h => [...h, route]);
    setRoute(future[0]);
    setFuture(f => f.slice(1));
  };
  return {
    api: { route, go, goBack, goFwd, history, future, query, setQuery, onboarded, finishOnboarding: () => setOnboarded(true) },
    keep: { route, onboarded },
  };
};

// ---------- Тема и настройки ----------
const useSettings = (saved) => {
  // uiVersion 2 — основа «Точка»: старые сохранения переводим на неё один раз,
  // остальные настройки пользователя не трогаем
  const [theme, setTheme] = React.useState(saved.uiVersion === 2 ? (saved.theme || "dot") : "dot");
  const [settings, setSettings] = React.useState(saved.settings);

  // Тему, плотность и акцент — на корень документа: их читает CSS
  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-density", settings.density || "n");
    ["--acc", "--acc-ink", "--hot"].forEach(p => root.style.removeProperty(p));
    // Акцент подменяет горячий цвет темы (лайк, «сейчас»); главное действие остаётся цвета текста
    if (settings.accent != null) root.style.setProperty("--hot", `oklch(0.66 0.17 ${settings.accent})`);
  }, [theme, settings.accent, settings.density]);

  return {
    api: {
      theme, setTheme, settings, setSettings,
      setAccent: (h) => setSettings(s => ({ ...s, accent: h })),
      setWallpaper: (h) => setSettings(s => ({ ...s, wallpaper: h, wallpaperImg: null })),
      setWallpaperImg: (data) => setSettings(s => ({ ...s, wallpaperImg: data, wallpaper: null })),
      // Оценка быстрого лайка (раздел «Оценки»)
      likeRating: settings.likeRating != null ? settings.likeRating : 10,
    },
    keep: { theme, settings },
  };
};

// ---------- Раскладка ----------
const useLayout = (saved) => {
  const [railPref, setRailPref] = React.useState(saved.rail === true);
  const [narrow, setNarrow] = React.useState(window.innerWidth < 1180);
  React.useEffect(() => {
    const h = () => setNarrow(window.innerWidth < 1180);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  // Телефон: своя раскладка — нижняя навигация, мини-плеер, полный экран (Android)
  const phone = useMedia(PHONE_Q);
  return {
    // Сайдбар — рейлом по кнопке или сам, когда окно узкое
    api: { rail: railPref || narrow, railPref, setRailPref, phone },
    keep: { rail: railPref },
  };
};

// ---------- Деньги: валюта и сумма в месяц ----------
const useMoney = (saved, { lang }) => {
  const [currency, setCurrency] = React.useState(saved.currency || "usd");
  const [monthly, setMonthly] = React.useState(saved.monthly != null ? saved.monthly : 5);
  const [customAmt, setCustomAmt] = React.useState(saved.customAmt || "");
  const [auto, setAuto] = React.useState(saved.auto !== false);
  // Своя сумма: фиксируется по клику вне поля (или Enter), значение остаётся в капсуле.
  // Непонятное («0», «,») не принимаем: в поле возвращается действующая сумма, если она своя,
  // иначе оно очищается и горит чип — раньше в капсуле висел «0», а сумма оставалась прежней
  // Возвращает принятую сумму (или null) — по ней экран решает, предложить ли пополнить счёт
  const commitCustom = () => {
    const v = parseAmount(customAmt);
    if (v > 0) { setMonthly(v); return v; }
    setCustomAmt([2, 5, 10].includes(monthly) ? "" : amountText(monthly, lang));
    return null;
  };
  // Суммы на экране — в выбранной валюте (makeMoney, core.jsx)
  const money = React.useMemo(() => makeMoney(currency, lang), [currency, lang]);
  return {
    api: {
      currency, setCurrency, money,
      monthly, setMonthly: (v) => { setMonthly(v); setCustomAmt(""); },
      customAmt, setCustomAmt, commitCustom, auto, setAuto,
    },
    keep: { currency, monthly, customAmt, auto },
  };
};

// ---------- Окна поверх страницы и уведомления ----------
const useOverlays = (saved) => {
  const [donateTarget, setDonateTarget] = React.useState(null);
  // Пополнение: null — закрыто; { amount } — сколько должно дойти до баланса (null — выберет сам)
  const [topUp, setTopUp] = React.useState(null);
  // Предложение пополнить: выбранная сумма в месяц, на которую не хватает баланса
  const [topUpOffer, setTopUpOffer] = React.useState(null);
  // Создание плейлиста; thenAdd — трек (или несколько), которые сразу добавятся
  const [createPl, setCreatePl] = React.useState(null);
  // Контекстное меню (ПКМ, «⋯», долгое нажатие): где открыть и про что оно
  const [ctx, setCtx] = React.useState(null);
  const [notifRead, setNotifRead] = React.useState(saved.notifRead === true);
  return {
    api: {
      donateTarget, openDonate: (target) => setDonateTarget(target), closeDonate: () => setDonateTarget(null),
      topUp, openTopUp: (amount) => setTopUp({ amount: typeof amount === "number" && amount > 0 ? amount : null }), closeTopUp: () => setTopUp(null),
      topUpOffer, offerTopUp: (monthly) => setTopUpOffer(monthly), closeTopUpOffer: () => setTopUpOffer(null),
      createPl, openCreatePl: (opts) => setCreatePl(opts || {}), closeCreatePl: () => setCreatePl(null),
      ctx,
      openCtx: (e, payload) => { e.preventDefault(); e.stopPropagation(); setCtx({ x: e.clientX, y: e.clientY, ...payload }); },
      openCtxAt: (el, payload) => { const r = el.getBoundingClientRect(); setCtx({ x: r.left, y: r.bottom + 8, ...payload }); },
      openCtxPoint: (x, y, payload) => setCtx({ x, y, ...payload }), // долгое нажатие: меню у пальца
      closeCtx: () => setCtx(null),
      notifRead, setNotifRead,
    },
    keep: { notifRead },
  };
};

// ---------- Плеер и очередь ----------
const DEFAULT_QUEUE = ["gl1", "s2", "h2", "a2", "g9", "b2", "p3"];

const usePlayer = (saved, { t, toast, hint }) => {
  const [player, setPlayer] = React.useState({ trackId: DB.trackIndex.gl1 ? "gl1" : Object.keys(DB.trackIndex)[0], playing: true, shuffle: 0, repeat: false });
  const playerRef = React.useRef(player);
  playerRef.current = player;
  // Прогресс (0–1) — не в состоянии, а в отдельном хранилище: см. createProgress в core.jsx
  const progress = React.useState(() => createProgress(0.34))[0];
  // Очередь — изменяемая: добавление, удаление, перетаскивание
  const [queue, setQueue] = React.useState(saved.queue || DEFAULT_QUEUE);
  const [volume, setVolume] = React.useState(saved.volume != null ? saved.volume : 0.7);
  const [device, setDevice] = React.useState("this");
  // Где виден плеер: правая панель, полный экран (и что в нём открыто), мини-плеер
  const [panel, setPanel] = React.useState(true);
  const [full, setFull] = React.useState(false);
  const [fullTab, setFullTab] = React.useState("lyrics");
  const [mini, setMini] = React.useState(false);

  // Тикающий прогресс. Шаг — ровно секунда трека, поэтому время на экране идёт с настоящей скоростью
  // (раньше шаг был один на все треки, и часы шли примерно вдвое медленнее). Пишем в хранилище
  // прогресса, а не в состояние, — тик не перерисовывает всё дерево. Трек доиграл — onEndRef.current
  // (задаётся ниже, рядом с очередью; через ref — чтобы видеть свежую очередь).
  const onEndRef = React.useRef(null);
  React.useEffect(() => {
    if (!player.playing) return;
    const iv = setInterval(() => {
      const next = progress.get() + 1 / trackSec(playerRef.current.trackId);
      if (next >= 1) onEndRef.current(); else progress.set(next);
    }, 1000);
    return () => clearInterval(iv);
  }, [player.playing]);

  const playTrack = (id) => {
    if (!DB.trackIndex[id]) return; // неизвестный id уронил бы весь плеер
    setPlayer(p => ({ ...p, trackId: id, playing: true }));
    progress.set(0);
  };
  // Очередь крутится по кругу: после последнего — первый. Играющего трека может не быть в очереди
  // (включили из списка, очередь не меняли) — тогда «следующий» — её начало, а «предыдущий» —
  // начало этого же трека. Пустая очередь — кнопки ничего не делают (раньше это роняло приложение).
  const nextTrack = () => {
    if (!queue.length) return;
    const i = queue.indexOf(player.trackId);
    playTrack(queue[(i + 1) % queue.length]);
  };
  const prevTrack = () => {
    const i = queue.indexOf(player.trackId);
    if (i < 0) { progress.set(0); return; }
    playTrack(queue[(i - 1 + queue.length) % queue.length]);
  };
  // Трек доиграл: с повтором — сначала он же, иначе следующий из очереди; очередь пуста — пауза
  onEndRef.current = () => {
    if (player.repeat) progress.set(0);
    else if (queue.length) nextTrack();
    else { setPlayer(p => ({ ...p, playing: false })); progress.set(0); }
  };
  const addToQueue = (x) => {
    setQueue(q => [...q, ...(Array.isArray(x) ? x : [x]).filter(id => !q.includes(id))]);
    toast(t.queueAdded);
    hint("queue", t.hintQueue);
  };
  // Трек встаёт перед тем, над которым его отпустили (линия-подсказка рисуется над ним).
  // Раньше при переносе вниз он вставал на одну позицию дальше.
  const moveInQueue = (from, to) => setQueue(q => {
    if (from == null || to == null || from === to) return q;
    const n = [...q]; const [x] = n.splice(from, 1); n.splice(from < to ? to - 1 : to, 0, x); return n;
  });
  // Перемешивание: выкл → обычное → умное
  const toggleShuffle = () => {
    const m = ((player.shuffle | 0) + 1) % 3;
    if (m === 2) toast(t.smartShuffleOn);
    setPlayer(p => ({ ...p, shuffle: m }));
  };
  // Время от начала трека для доли pct: «2:21»
  const fmtTime = (pct) => {
    const cur = Math.round(trackSec(player.trackId) * pct);
    return `${Math.floor(cur / 60)}:${String(cur % 60).padStart(2, "0")}`;
  };

  return {
    api: {
      player, progress, playTrack, nextTrack, prevTrack, toggleShuffle, fmtTime,
      togglePlay: () => setPlayer(p => ({ ...p, playing: !p.playing })),
      toggleRepeat: () => setPlayer(p => ({ ...p, repeat: !p.repeat })),
      seek: (e) => { const r = e.currentTarget.getBoundingClientRect(); progress.set((e.clientX - r.left) / r.width); },
      seekTo: (pct) => progress.set(pct),
      queue, queueIds: queue, addToQueue, moveInQueue,
      removeFromQueue: (i) => setQueue(q => q.filter((_, k) => k !== i)),
      // Слушать контекст целиком: очередь = список, играет первый
      playContext: (ids) => { if (!ids || !ids.length) return; setQueue(ids); playTrack(ids[0]); },
      volume, setVolume, device, setDevice,
      panel, setPanel, full, setFull, fullTab, setFullTab, mini, setMini,
      lyricsFor: DB.lyricsFor,
    },
    keep: { queue, volume },
  };
};

// ---------- Медиатека: оценки, плейлисты, подписки ----------
// Лайк — это тоже оценка. Единственный источник правды — число 1–10 или null:
//   5–10 — трек в любимых; 1–4 — «не нравится»; null — вы его не оценивали.
// Быстрый тап по сердечку ставит «оценку быстрого лайка» (настройка, по умолчанию 10).
// Лайк без числа (данные из базы, старые сохранения) читается как оценка быстрого лайка.
// Плейлисты: базовый состав лежит в DB (tracks), пользовательские добавления — в trackStates,
// удаления базовых треков — в plRemoved. Свои плейлисты — в userPlaylists.
const useLibrary = (saved, { t, lang, toast, hint, likeRating, route, go }) => {
  const [trackStates, setTrackStates] = React.useState(saved.trackStates || {});
  const [userPlaylists, setUserPlaylists] = React.useState(saved.userPlaylists || []);
  const [plRemoved, setPlRemoved] = React.useState(saved.plRemoved || {});
  const [followed, setFollowed] = React.useState(saved.followed || ["milk", "lowtide", "velvet"]);

  // —— Оценки ——
  // Состояние считается из переданного снимка (stateFrom), чтобы функциональные обновления
  // не читали устаревшее замыкание.
  const stateFrom = (all, id) => {
    const base = DB.trackIndex[id] || {};
    const o = all[id] || {};
    let rating = "rating" in o ? o.rating : (base.rating != null ? base.rating : null);
    const likedFlag = "liked" in o ? o.liked : !!base.liked;
    if (rating == null && likedFlag) rating = likeRating;
    return { rating, liked: rating != null && rating >= 5, playlists: o.playlists || [] };
  };
  const trackState = (id) => stateFrom(trackStates, id);
  const patchTrack = (id, patch) => setTrackStates(all => ({ ...all, [id]: { ...stateFrom(all, id), ...patch } }));
  // Оценка 1–10 или null. null — «Убрать оценку»: как будто вы трек вообще не оценивали.
  const setRating = (id, r) => patchTrack(id, r == null ? { rating: null, liked: false } : { rating: r, liked: r >= 5 });
  // Тап по сердечку: пустое — оценка быстрого лайка; горящее — снять оценку одним касанием.
  // Осознанно выставленную оценку (не равную быстрой) жалко потерять случайно — в тосте «Вернуть».
  const toggleLike = (id) => {
    const s = trackState(id);
    if (s.rating != null) {
      setRating(id, null);
      if (s.rating !== likeRating) toast(t.ratingRemoved(s.rating), { label: t.undo, run: () => setRating(id, s.rating) });
    } else {
      setRating(id, likeRating);
      hint("rate", t.holdHint);
    }
  };
  const likedIds = () => Object.keys(DB.trackIndex).filter(id => trackState(id).liked);

  // —— Плейлисты ——
  const allPlaylists = [...DB.playlists, ...userPlaylists];
  const findPl = (id) => DB.findPlaylist(id) || userPlaylists.find(p => p.id === id) || null;
  const inPlaylist = (tid, plId) => {
    const meta = findPl(plId);
    const baseIn = !!(meta && (meta.tracks || []).includes(tid)) && !((plRemoved[plId] || []).includes(tid));
    const stIn = ((trackStates[tid] && trackStates[tid].playlists) || []).includes(plId);
    return baseIn || stIn;
  };
  // Плейлисты, в которых есть все эти треки (у плюсика альбома галочка — только если там весь альбом)
  const playlistsWithAll = (ids) => allPlaylists.filter(p => ids.length && ids.every(id => inPlaylist(id, p.id))).map(p => p.id);
  const plToastName = (plId) => { const pl = findPl(plId); return lang === "ru" ? pl.name : (pl.nameEn || pl.name); };
  // Добавить (on) или убрать сразу несколько треков. Базовые треки плейлиста включаются и выключаются
  // через plRemoved, остальные — через trackStates. Обновления функциональные: считаем от снимка.
  const setInPlaylist = (ids, plId, on) => {
    const meta = findPl(plId);
    const base = (meta && meta.tracks) || [];
    const baseIds = ids.filter(id => base.includes(id));
    if (baseIds.length) setPlRemoved(r => {
      const cur = r[plId] || [];
      return { ...r, [plId]: on ? cur.filter(x => !baseIds.includes(x)) : [...cur, ...baseIds.filter(x => !cur.includes(x))] };
    });
    const own = on ? ids.filter(id => !base.includes(id)) : ids;
    if (own.length) setTrackStates(all => {
      const next = { ...all };
      own.forEach(id => {
        const s = stateFrom(all, id);
        const rest = s.playlists.filter(p => p !== plId);
        if (!on && rest.length === s.playlists.length) return; // этого трека там и не было
        next[id] = { ...s, playlists: on ? [...rest, plId] : rest };
      });
      return next;
    });
  };
  // Один трек или список: если в плейлисте уже все — убираем, иначе добавляем недостающие
  const togglePlaylist = (idOrIds, plId) => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    const on = !ids.every(id => inPlaylist(id, plId));
    setInPlaylist(ids, plId, on);
    toast(`${on ? t.addedTo : t.removedFrom} «${plToastName(plId)}»`);
  };
  const playlistTracks = (plId) => {
    const meta = findPl(plId);
    if (!meta) return [];
    const removed = plRemoved[plId] || [];
    const base = (meta.tracks || []).filter(tid => !removed.includes(tid));
    const added = Object.keys(trackStates).filter(tid =>
      ((trackStates[tid].playlists) || []).includes(plId) && !base.includes(tid));
    return [...base, ...added];
  };
  // Новый плейлист: сразу кладём в него thenAdd (трек или весь альбом) и открываем
  const createPlaylist = (name, thenAdd, hue) => {
    const id = "u" + Date.now().toString(36);
    setUserPlaylists(u => [...u, { id, name, nameEn: name, hue: hue != null ? hue : 55, byMe: true, collab: false, tracks: [], user: true }]);
    if (thenAdd) setInPlaylist(Array.isArray(thenAdd) ? thenAdd : [thenAdd], id, true);
    toast(t.plCreated);
    go("playlist", id);
  };
  const deletePlaylist = (id) => {
    setUserPlaylists(u => u.filter(p => p.id !== id));
    toast(t.plDeleted);
    if (route.page === "playlist" && route.id === id) go("library");
  };

  return {
    api: {
      trackState, toggleLike, setRating, likedIds,
      allPlaylists, findPl, playlistsWithAll, trackPlaylists: (id) => playlistsWithAll([id]),
      togglePlaylist, removeFromPlaylist: (id, plId) => { if (inPlaylist(id, plId)) togglePlaylist(id, plId); },
      playlistTracks, createPlaylist, deletePlaylist,
      followed, toggleFollow: (id) => setFollowed(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]),
    },
    keep: { trackStates, followed, userPlaylists, plRemoved },
  };
};

// ---------- Загрузки ----------
// Общее состояние треков: "loading" или "done". Релиз и плейлист скачаны, когда скачаны все их треки.
const useDownloads = (saved, { t, hint }) => {
  const [downloads, setDownloads] = React.useState(() => {
    if (saved.downloads) return saved.downloads;
    const seed = {};
    DB.albums.grunt.tracks.forEach(tr => seed[tr.id] = "done");
    DB.albums.salt.tracks.forEach(tr => seed[tr.id] = "done");
    return seed;
  });
  const dlRef = React.useRef(downloads);
  React.useEffect(() => { dlRef.current = downloads; }, [downloads]);
  // Таймеры: timers[id] — загрузка трека, timers["st_" + id] — его место в каскаде релиза
  const timers = React.useRef({});
  const clearDl = (id) => {
    clearTimeout(timers.current[id]); clearTimeout(timers.current["st_" + id]);
    delete timers.current[id]; delete timers.current["st_" + id];
  };
  const dropDl = (ids) => setDownloads(d => { const nd = { ...d }; ids.forEach(id => delete nd[id]); return nd; });
  const startTrackDl = (id, dur = 2400) => {
    clearDl(id);
    setDownloads(d => ({ ...d, [id]: "loading" }));
    timers.current[id] = setTimeout(() => {
      delete timers.current[id];
      setDownloads(d => d[id] === "loading" ? { ...d, [id]: "done" } : d);
    }, dur);
  };
  const toggleDl = (id) => {
    if (dlRef.current[id] || timers.current["st_" + id]) { clearDl(id); dropDl([id]); }
    else { startTrackDl(id); hint("dl", t.hintDl); }
  };
  // Релиз или плейлист. Идёт загрузка — нажатие её отменяет (как у отдельного трека), скачанное остаётся;
  // всё скачано — убирает загрузку; иначе докачивает недостающее каскадом. Раньше нажатие во время
  // загрузки запускало её заново, а отложенные треки каскада потом всё равно начинали качаться.
  const toggleDlList = (ids) => {
    const cur = dlRef.current;
    const busy = ids.filter(id => cur[id] === "loading" || timers.current["st_" + id]);
    if (busy.length) { busy.forEach(clearDl); dropDl(busy); return; }
    if (ids.length && ids.every(id => cur[id] === "done")) { dropDl(ids); return; }
    // каскад: треки стартуют со сдвигом, каждый со своей анимацией
    let k = 0;
    ids.forEach((id) => {
      if (cur[id] === "done") return;
      const delay = k++ * 450;
      timers.current["st_" + id] = setTimeout(() => { delete timers.current["st_" + id]; startTrackDl(id, 1400); }, delay);
    });
    hint("dl", t.hintDl);
  };
  // Сохраняем только докачанное: прерванная перезагрузкой загрузка начнётся заново по кнопке
  const done = React.useMemo(() => {
    const o = {};
    Object.entries(downloads).forEach(([k, v]) => { if (v === "done") o[k] = "done"; });
    return o;
  }, [downloads]);
  return {
    api: { downloads, toggleDl, toggleDlList, toggleDlAlbum: (albumId) => toggleDlList(DB.albums[albumId].tracks.map(tr => tr.id)) },
    keep: { downloads: done },
  };
};

Object.assign(window, { useLocale, useFeedback, useNav, useSettings, useLayout, useMoney, useOverlays, usePlayer, useLibrary, useDownloads, DEFAULT_QUEUE });
