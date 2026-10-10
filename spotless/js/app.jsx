// Spotless — корневое приложение: состояние, каркас, навигация, Tweaks.

const LS_KEY = "spotless_proto_v1";
const loadLS = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; } };
const saveLS = (obj) => {
  try { localStorage.setItem(LS_KEY, JSON.stringify(obj)); }
  catch (e) {
    // Не влезло в квоту браузера (~5 МБ на сайт) — сохраняем всё, кроме картинки обоев:
    // иначе молча переставало сохраняться вообще всё (темы, оценки, плейлисты)
    console.warn("Spotless: состояние не влезло в localStorage, обои не сохранены", e);
    try { localStorage.setItem(LS_KEY, JSON.stringify({ ...obj, settings: { ...obj.settings, wallpaperImg: null } })); } catch (e2) {}
  }
};

const DEFAULT_QUEUE = ["gl1", "s2", "h2", "a2", "g9", "b2", "p3"];

// Длительность трека в секундах (из строки «3:56»)
const trackSec = (id) => {
  const tr = DB.trackIndex[id];
  const [m, s] = tr ? tr.dur.split(":").map(Number) : [3, 0];
  return m * 60 + s || 180;
};

// Маршрут ведёт на то, что есть в мок-базе (или в своих плейлистах)?
const routeOk = (r, userPls) => {
  if (!r || typeof r !== "object") return false;
  const id = r.id;
  switch (r.page) {
    case "home": case "search": case "library": case "support": case "settings": case "liked": case "jam": return true;
    case "album": return !!DB.albums[id];
    case "artist": return !!DB.artists[id];
    case "genre": return !!DB.genres[id];
    case "playlist": return !!(DB.findPlaylist(id) || (userPls || []).some(p => p.id === id));
    case "profile": return !id || id === "me" || DB.friends.some(f => f.id === id);
    case "showall": {
      const [k, a] = String(id || "").split(":");
      return ["recent", "new", "mixes"].includes(k) || ((k === "disc" || k === "similar") && !!DB.artists[a]);
    }
    default: return false;
  }
};

// Сохранённое состояние проверяем при загрузке. В нём могут остаться id, которых в мок-базе уже нет
// (трек переименовали, плейлист удалили), и мусор из импорта темы. Раньше любой такой id ронял
// приложение при каждом запуске — чёрный экран до очистки данных сайта. Отбрасываем только битое,
// всё остальное (настройки, оценки, плейлисты) остаётся как было.
const cleanSaved = (raw) => {
  const s = raw && typeof raw === "object" ? { ...raw } : {};
  const arr = (v) => (Array.isArray(v) ? v : []);
  const obj = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v : {});
  const isTrack = (id) => !!DB.trackIndex[id];
  if (s.queue != null) {
    const q = arr(s.queue).filter(isTrack);
    // Очередь целиком из пропавших треков — берём стартовую, а не пустую
    if (q.length || !arr(s.queue).length) s.queue = q; else delete s.queue;
  }
  const ts = {};
  Object.entries(obj(s.trackStates)).forEach(([id, st]) => {
    if (isTrack(id) && st && typeof st === "object") ts[id] = { ...st, playlists: arr(st.playlists).filter(p => typeof p === "string") };
  });
  s.trackStates = ts;
  if (s.followed != null) s.followed = arr(s.followed).filter(id => DB.artists[id]);
  s.userPlaylists = arr(s.userPlaylists).filter(p => p && typeof p.id === "string" && typeof p.name === "string");
  const plr = {};
  Object.entries(obj(s.plRemoved)).forEach(([k, v]) => { plr[k] = arr(v); });
  s.plRemoved = plr;
  if (s.downloads != null) s.downloads = obj(s.downloads); // нет вовсе — App положит стартовые загрузки
  s.settings = cleanSettings(s.settings);
  if (!THEME_LIST.some(th => th.id === s.theme)) delete s.theme;
  if (!(typeof s.monthly === "number" && s.monthly > 0)) delete s.monthly;
  if (!(typeof s.volume === "number" && s.volume >= 0 && s.volume <= 1)) delete s.volume;
  if (s.lang !== "ru" && s.lang !== "en") delete s.lang;
  if (!routeOk(s.route, s.userPlaylists)) s.route = { page: "home", id: null };
  return s;
};

const App = () => {
  // Читаем сохранённое один раз (раньше — на каждом рендере, то есть каждую секунду)
  const saved = React.useState(() => cleanSaved(loadLS()))[0];

  // Навигация
  const [route, setRoute] = React.useState(saved.route || { page: "home", id: null });
  const [history, setHistory] = React.useState([]);
  const [future, setFuture] = React.useState([]);
  // Тема и настройки
  // uiVersion 2 — основа «Точка»: старые сохранения переводим на неё один раз,
  // остальные настройки пользователя не трогаем (README 7)
  const [theme, setThemeRaw] = React.useState(saved.uiVersion === 2 ? (saved.theme || "dot") : "dot");
  const [lang, setLang] = React.useState(saved.lang || "ru");
  const [currency, setCurrency] = React.useState(saved.currency || "usd");
  const [settings, setSettings] = React.useState(saved.settings);
  const [onboarded, setOnboarded] = React.useState(saved.onboarded === true);
  // Плеер. Прогресс (0–1) — не здесь, а в отдельном хранилище: см. createProgress в ui.jsx
  const [player, setPlayer] = React.useState({ trackId: DB.trackIndex.gl1 ? "gl1" : Object.keys(DB.trackIndex)[0], playing: true, shuffle: 0, repeat: false });
  const progress = React.useState(() => createProgress(0.34))[0];
  const playerRef = React.useRef(player);
  playerRef.current = player;
  const [panel, setPanel] = React.useState(true);
  const [volume, setVolume] = React.useState(saved.volume != null ? saved.volume : 0.7);
  const [full, setFull] = React.useState(false);
  const [mini, setMini] = React.useState(false);
  const [fullTab, setFullTab] = React.useState("lyrics");
  // Данные пользователя
  const [trackStates, setTrackStates] = React.useState(saved.trackStates || {});
  const [followed, setFollowed] = React.useState(saved.followed || ["milk", "lowtide", "velvet"]);
  const [userPlaylists, setUserPlaylists] = React.useState(saved.userPlaylists || []);
  const [plRemoved, setPlRemoved] = React.useState(saved.plRemoved || {});
  // Загрузки: общее состояние треков и релизов
  const [downloads, setDownloads] = React.useState(() => {
    if (saved.downloads) return saved.downloads;
    const seed = {};
    DB.albums.grunt.tracks.forEach(tr => seed[tr.id] = "done");
    DB.albums.salt.tracks.forEach(tr => seed[tr.id] = "done");
    return seed;
  });
  const dlRef = React.useRef(downloads);
  React.useEffect(() => { dlRef.current = downloads; }, [downloads]);
  const dlTimers = React.useRef({});
  const [monthly, setMonthly] = React.useState(saved.monthly != null ? saved.monthly : 5);
  const [customAmt, setCustomAmt] = React.useState(saved.customAmt || "");
  const [auto, setAuto] = React.useState(saved.auto !== false);
  // UI
  const [query, setQuery] = React.useState("");
  const [donateTarget, setDonateTarget] = React.useState(null);
  const [toasts, setToasts] = React.useState([]);
  const [railPref, setRailPref] = React.useState(saved.rail === true);
  const [narrow, setNarrow] = React.useState(window.innerWidth < 1180);
  React.useEffect(() => {
    const h = () => setNarrow(window.innerWidth < 1180);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  const rail = railPref || narrow;
  // Телефон: своя раскладка — нижняя навигация, мини-плеер, полный экран (Android)
  const phone = useMedia(PHONE_Q);

  const t = I18N[lang];

  // Применить тему к документу
  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-density", settings.density || "n");
    ["--acc", "--acc-ink", "--hot"].forEach(p => root.style.removeProperty(p));
    // Акцент подменяет горячий цвет темы (лайк, «сейчас»); главное действие остаётся цвета текста
    if (settings.accent != null) root.style.setProperty("--hot", `oklch(0.66 0.17 ${settings.accent})`);
  }, [theme, settings.accent, settings.density]);

  // Тикающий прогресс. Шаг — ровно секунда трека, поэтому время на экране идёт с настоящей скоростью
  // (раньше шаг был один на все треки, и часы шли примерно вдвое медленнее). Пишем в хранилище
  // прогресса, а не в состояние App, — тик не перерисовывает всё дерево. Трек доиграл —
  // onEndRef.current (задаётся ниже, рядом с очередью; через ref — чтобы видеть свежую очередь).
  const onEndRef = React.useRef(null);
  React.useEffect(() => {
    if (!player.playing) return;
    const iv = setInterval(() => {
      const next = progress.get() + 1 / trackSec(playerRef.current.trackId);
      if (next >= 1) onEndRef.current(); else progress.set(next);
    }, 1000);
    return () => clearInterval(iv);
  }, [player.playing]);

  // Очередь — изменяемая: добавление, удаление, перетаскивание
  const [queue, setQueue] = React.useState(saved.queue || DEFAULT_QUEUE);
  const queueIds = queue;

  // API
  // —— Реакция на трек: оценка ——
  // Лайк — это тоже оценка. Единственный источник правды — число 1–10 или null:
  //   5–10 — трек в любимых; 1–4 — «не нравится»; null — вы его не оценивали.
  // Быстрый тап по сердечку ставит «оценку быстрого лайка» (настройка, по умолчанию 10).
  // Лайк без числа (данные из базы, старые сохранения) читается как оценка быстрого лайка.
  // Состояние считается из переданного снимка (stateFrom), чтобы функциональные обновления
  // не читали устаревшее замыкание.
  const likeRating = settings.likeRating != null ? settings.likeRating : 10;
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

  // —— Плейлисты ——
  // Базовый состав лежит в DB (tracks), пользовательские добавления — в trackStates,
  // удаления базовых треков — в plRemoved. Свои плейлисты — в userPlaylists.
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
  const trackPlaylists = (id) => playlistsWithAll([id]);
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
  const removeFromPlaylist = (id, plId) => { if (inPlaylist(id, plId)) togglePlaylist(id, plId); };
  const playlistTracks = (plId) => {
    const meta = findPl(plId);
    if (!meta) return [];
    const removed = plRemoved[plId] || [];
    const base = (meta.tracks || []).filter(tid => !removed.includes(tid));
    const added = Object.keys(trackStates).filter(tid =>
      ((trackStates[tid].playlists) || []).includes(plId) && !base.includes(tid));
    return [...base, ...added];
  };
  const likedIds = () => Object.keys(DB.trackIndex).filter(id => trackState(id).liked);
  const createPlaylist = (name, thenAdd, hue) => {
    const id = "u" + Date.now().toString(36);
    setUserPlaylists(u => [...u, { id, name, nameEn: name, hue: hue != null ? hue : 55, byMe: true, collab: false, tracks: [], user: true }]);
    if (thenAdd) setInPlaylist(Array.isArray(thenAdd) ? thenAdd : [thenAdd], id, true); // трек или весь альбом
    setCreatePl(null);
    toast(t.plCreated);
    go("playlist", id);
  };
  const deletePlaylist = (id) => {
    setUserPlaylists(u => u.filter(p => p.id !== id));
    toast(t.plDeleted);
    if (route.page === "playlist" && route.id === id) go("library");
  };
  const toggleFollow = (id) => setFollowed(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  // —— Загрузки ——
  // Таймеры: dlTimers[id] — загрузка трека, dlTimers["st_" + id] — его место в каскаде релиза
  const clearDl = (id) => {
    clearTimeout(dlTimers.current[id]); clearTimeout(dlTimers.current["st_" + id]);
    delete dlTimers.current[id]; delete dlTimers.current["st_" + id];
  };
  const dropDl = (ids) => setDownloads(d => { const nd = { ...d }; ids.forEach(id => delete nd[id]); return nd; });
  const startTrackDl = (id, dur = 2400) => {
    clearDl(id);
    setDownloads(d => ({ ...d, [id]: "loading" }));
    dlTimers.current[id] = setTimeout(() => {
      delete dlTimers.current[id];
      setDownloads(d => d[id] === "loading" ? { ...d, [id]: "done" } : d);
    }, dur);
  };
  const toggleDl = (id) => {
    if (dlRef.current[id] || dlTimers.current["st_" + id]) { clearDl(id); dropDl([id]); }
    else { startTrackDl(id); hint("dl", t.hintDl); }
  };
  // Релиз или плейлист. Идёт загрузка — нажатие её отменяет (как у отдельного трека), скачанное остаётся;
  // всё скачано — убирает загрузку; иначе докачивает недостающее каскадом. Раньше нажатие во время
  // загрузки запускало её заново, а отложенные треки каскада потом всё равно начинали качаться.
  const toggleDlList = (ids) => {
    const cur = dlRef.current;
    const busy = ids.filter(id => cur[id] === "loading" || dlTimers.current["st_" + id]);
    if (busy.length) { busy.forEach(clearDl); dropDl(busy); return; }
    if (ids.length && ids.every(id => cur[id] === "done")) { dropDl(ids); return; }
    // каскад: треки стартуют со сдвигом, каждый со своей анимацией
    let k = 0;
    ids.forEach((id) => {
      if (cur[id] === "done") return;
      const delay = k++ * 450;
      dlTimers.current["st_" + id] = setTimeout(() => { delete dlTimers.current["st_" + id]; startTrackDl(id, 1400); }, delay);
    });
    hint("dl", t.hintDl);
  };
  const toggleDlAlbum = (albumId) => toggleDlList(DB.albums[albumId].tracks.map(tr => tr.id));

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

  const playTrack = (id) => {
    if (!DB.trackIndex[id]) return; // неизвестный id уронил бы весь плеер
    setPlayer(p => ({ ...p, trackId: id, playing: true }));
    progress.set(0);
  };
  const togglePlay = () => setPlayer(p => ({ ...p, playing: !p.playing }));
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
  const removeFromQueue = (i) => setQueue(q => q.filter((_, k) => k !== i));
  // Трек встаёт перед тем, над которым его отпустили (линия-подсказка рисуется над ним).
  // Раньше при переносе вниз он вставал на одну позицию дальше.
  const moveInQueue = (from, to) => setQueue(q => {
    if (from == null || to == null || from === to) return q;
    const n = [...q]; const [x] = n.splice(from, 1); n.splice(from < to ? to - 1 : to, 0, x); return n;
  });
  // Слушать контекст целиком: очередь = список, играет первый
  const playContext = (ids) => { if (!ids || !ids.length) return; setQueue(ids); playTrack(ids[0]); };
  const toggleShuffle = () => {
    const m = ((player.shuffle | 0) + 1) % 3;
    if (m === 2) toast(t.smartShuffleOn);
    setPlayer(p => ({ ...p, shuffle: m }));
  };
  const toggleRepeat = () => setPlayer(p => ({ ...p, repeat: !p.repeat }));
  const seek = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    progress.set((e.clientX - r.left) / r.width);
  };
  const seekTo = (pct) => progress.set(pct);
  const fmtTime = (pct) => {
    const tr = DB.trackIndex[player.trackId];
    const [m, s] = tr.dur.split(":").map(Number);
    const cur = Math.round((m * 60 + s) * pct);
    return `${Math.floor(cur / 60)}:${String(cur % 60).padStart(2, "0")}`;
  };

  const openDonate = (target) => setDonateTarget(target);
  const closeDonate = () => setDonateTarget(null);
  const [topUp, setTopUp] = React.useState(false);
  const openTopUp = () => setTopUp(true);
  const closeTopUp = () => setTopUp(false);
  // Создание плейлиста (модалка); thenAdd — трек, который сразу добавится
  const [createPl, setCreatePl] = React.useState(null);
  const openCreatePl = (opts) => setCreatePl(opts || {});
  const closeCreatePl = () => setCreatePl(null);
  // Глобальное контекстное меню (ПКМ и «⋯»)
  const [ctx, setCtx] = React.useState(null);
  const openCtx = (e, payload) => { e.preventDefault(); e.stopPropagation(); setCtx({ x: e.clientX, y: e.clientY, ...payload }); };
  const openCtxAt = (el, payload) => { const r = el.getBoundingClientRect(); setCtx({ x: r.left, y: r.bottom + 8, ...payload }); };
  // Долгое нажатие пальцем: меню у точки касания
  const openCtxPoint = (x, y, payload) => setCtx({ x, y, ...payload });
  const closeCtx = () => setCtx(null);
  // Устройства, уведомления, одноразовые подсказки
  const [device, setDevice] = React.useState("this");
  const [notifRead, setNotifRead] = React.useState(saved.notifRead === true);
  const [hints, setHints] = React.useState(saved.hints || {});
  const hintsRef = React.useRef(hints);
  React.useEffect(() => { hintsRef.current = hints; }, [hints]);
  // Персист — после объявления всех сохраняемых состояний (queue, notifRead, hints),
  // иначе без Babel-преобразования const → var это ошибка TDZ
  React.useEffect(() => {
    const doneDl = {};
    Object.entries(downloads).forEach(([k, v]) => { if (v === "done") doneDl[k] = "done"; });
    saveLS({ uiVersion: 2, route, theme, lang, currency, settings, onboarded, trackStates, followed, monthly, auto, rail: railPref, customAmt, downloads: doneDl, userPlaylists, plRemoved, queue, notifRead, hints, volume });
  }, [route, theme, lang, currency, settings, onboarded, trackStates, followed, monthly, auto, railPref, customAmt, downloads, userPlaylists, plRemoved, queue, notifRead, hints, volume]);

  const hint = (key, msg) => {
    if (hintsRef.current[key]) return;
    hintsRef.current = { ...hintsRef.current, [key]: 1 };
    setHints(h => ({ ...h, [key]: 1 }));
    setTimeout(() => toast(msg), 700);
  };
  // Тост; action — { label, run } для «Вернуть» и подобного: такой живёт дольше
  const toast = (msg, action) => {
    const id = Date.now() + Math.random();
    setToasts(ts => [...ts, { id, msg, action }]);
    setTimeout(() => setToasts(ts => ts.filter(x => x.id !== id)), action ? 4500 : 2400);
  };
  const dismissToast = (id) => setToasts(ts => ts.filter(x => x.id !== id));
  const setTheme = (th) => setThemeRaw(th);
  const setAccent = (h) => setSettings(s => ({ ...s, accent: h }));
  const setWallpaper = (h) => setSettings(s => ({ ...s, wallpaper: h, wallpaperImg: null }));
  const setWallpaperImg = (data) => setSettings(s => ({ ...s, wallpaperImg: data, wallpaper: null }));
  const finishOnboarding = () => setOnboarded(true);
  const setMonthlyV = (v) => { setMonthly(v); setCustomAmt(""); };
  // Своя сумма: фиксируется по клику вне поля (или Enter), значение остаётся в капсуле.
  // Непонятное («0», «,») не принимаем: в поле возвращается действующая сумма, если она своя,
  // иначе оно очищается и горит чип — раньше в капсуле висел «0», а сумма оставалась прежней
  const commitCustom = () => {
    const v = parseAmount(customAmt);
    if (v > 0) setMonthly(v);
    else setCustomAmt([2, 5, 10].includes(monthly) ? "" : String(monthly).replace(".", lang === "ru" ? "," : "."));
  };

  // Фон окна с обоями: строка с картинкой может весить сотни килобайт — собираем её, только когда обои меняются.
  // Хук — до раннего return онбординга, чтобы порядок хуков не прыгал
  const wp = settings.wallpaper;
  const wpi = settings.wallpaperImg;
  const shellBg = React.useMemo(() => wpi
    ? { background: `linear-gradient(color-mix(in oklab, var(--bg0) 84%, transparent), var(--bg0) 76%), url("${wpi}") center / cover` }
    : wp != null
      ? { background: `linear-gradient(160deg, oklch(var(--cover-l1) 0.04 ${wp}) 0%, var(--bg0) 55%)` }
      : undefined, [wp, wpi]);

  const api = {
    t, lang, setLang, currency, setCurrency,
    route, go, goBack, goFwd, history, future,
    theme, setTheme, settings, setSettings, setAccent, setWallpaper, setWallpaperImg,
    player, progress, playTrack, togglePlay, nextTrack, prevTrack, toggleShuffle, toggleRepeat, seek, seekTo, fmtTime,
    panel, setPanel, full, setFull, mini, setMini, fullTab, setFullTab, queueIds, volume, setVolume,
    queue, addToQueue, removeFromQueue, moveInQueue, playContext,
    trackState, toggleLike, setRating, likeRating, trackPlaylists, playlistsWithAll, togglePlaylist,
    allPlaylists, findPl, playlistTracks, likedIds, removeFromPlaylist, createPlaylist, deletePlaylist,
    followed, toggleFollow,
    downloads, toggleDl, toggleDlAlbum, toggleDlList,
    monthly, setMonthly: setMonthlyV, customAmt, setCustomAmt, commitCustom, auto, setAuto,
    rail, railPref, setRailPref, phone,
    query, setQuery,
    donateTarget, openDonate, closeDonate,
    topUp, openTopUp, closeTopUp,
    createPl, openCreatePl, closeCreatePl,
    ctx, openCtx, openCtxAt, openCtxPoint, closeCtx,
    device, setDevice,
    notifRead, setNotifRead, hint,
    lyricsFor: DB.lyricsFor,
    toasts, toast, dismissToast, finishOnboarding,
  };

  if (!onboarded) {
    return (
      <AppCtx.Provider value={api}>
        <Onboarding />
      </AppCtx.Provider>
    );
  }

  const page = route.page === "home" ? <PageHome />
    : route.page === "search" ? <PageSearch />
    : route.page === "library" ? <PageLibrary />
    : route.page === "support" ? <PageSupport />
    : route.page === "settings" ? <PageSettings />
    : route.page === "album" ? <PageAlbum id={route.id} />
    : route.page === "artist" ? <PageArtist id={route.id} />
    : route.page === "playlist" ? <PagePlaylist id={route.id} />
    : route.page === "liked" ? <PageLiked />
    : route.page === "profile" ? <PageProfile id={route.id} />
    : route.page === "jam" ? <PageJam />
    : route.page === "showall" ? <PageShowAll id={route.id} />
    : route.page === "genre" ? <PageGenre id={route.id} />
    : <PageHome />;

  const docked = settings.island === "panel";

  return (
    <AppCtx.Provider value={api}>
      <div className={"shell" + (phone ? " phone" + (docked ? " mp-docked" : "") : (panel ? " with-panel" : "") + (rail ? " rail" : "") + (docked ? " docked" : ""))} style={shellBg}>
        {!phone && <Sidebar />}
        <main className="main">
          <TopBar />
          {/* Упала страница — остальное (плеер, навигация) живёт; другая страница — новая попытка */}
          <ErrorBoundary resetKey={route.page + ":" + route.id} fallback={(reset) => <PageError reset={reset} />}>
            {page}
          </ErrorBoundary>
        </main>
        {!phone && panel && <NowPanel />}
        {phone
          ? <React.Fragment><MobilePlayer /><MobileNav /></React.Fragment>
          : docked ? <PlayerDock /> : <PlayerIsland />}
      </div>
      {full && (phone ? <FullScreenPhone /> : <FullScreen />)}
      {mini && !phone && <MiniPlayer />}
      <DonateModal />
      <TopUpModal />
      <CreatePlaylistModal />
      <ContextMenu />
      <Toasts />
    </AppCtx.Provider>
  );
};

// ---------- Ошибки ----------
// Упала одна страница: объяснение и выход на главную, плеер и навигация остаются
const PageError = ({ reset }) => {
  const app = useApp();
  const t = app.t;
  return (
    <div className="fade-in" role="alert" style={{ padding: "72px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
      <h1 style={{ fontSize: 34 }}>{t.errTitle}</h1>
      <p style={{ fontSize: 14.5, color: "var(--mut)", maxWidth: 420, lineHeight: 1.6, textWrap: "pretty" }}>{t.errNote}</p>
      <button className="btn" style={{ marginTop: 8 }} onClick={() => { app.go("home"); reset(); }}>{t.errHome}</button>
    </div>
  );
};
// Упало всё приложение: та же подсказка. Из сохранённого меняем только маршрут — открываем главную,
// настройки, оценки и плейлисты не трогаем
const AppCrash = () => {
  const t = I18N[loadLS().lang === "en" ? "en" : "ru"];
  return (
    <div className="ob" role="alert" style={{ alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center" }}>
      <h1 style={{ fontSize: 34 }}>{t.errTitle}</h1>
      <p style={{ fontSize: 14.5, color: "var(--mut)", maxWidth: 420, lineHeight: 1.6, textWrap: "pretty" }}>{t.errNote}</p>
      <button className="btn" style={{ marginTop: 8 }}
        onClick={() => { saveLS({ ...loadLS(), route: { page: "home", id: null } }); location.reload(); }}>{t.errHome}</button>
    </div>
  );
};

// ---------- Сайдбар ----------
// В «Точке» пункты пронумерованы моно-цифрами, активный отмечен красной точкой;
// в рейле и старых темах вместо номеров — иконки.
const NavItem = ({ page, num, icon, label, badge }) => {
  const app = useApp();
  const active = app.route.page === page;
  return (
    <button className={"navitem" + (active ? " active" : "")} aria-current={active ? "page" : undefined} title={label}
      onClick={() => app.go(page)}>
      <span className="nav-ic"><Ic d={ICONS[icon]} size={20} /></span>
      <span className="nav-num">{num}</span>
      <span className="nav-label" style={{ flex: badge == null ? 1 : "none" }}>{label}</span>
      {badge != null && <span className="badge">{badge}</span>}
      <span className="hot-dot nav-dot"></span>
    </button>
  );
};

const Sidebar = () => {
  const app = useApp();
  const t = app.t;
  const r = app.route;
  return (
    <aside className="sidebar" data-screen-label="Сайдбар">
      <div className="logo-row" style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 4px 0 12px", marginBottom: 22 }}>
        <button style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }} onClick={() => app.go("home")} aria-label="Spotless">
          <span className="dots logo-word" style={{ fontSize: 24, letterSpacing: "0.02em" }}>SPOTLESS</span>
          <span className="hot-dot" style={{ width: 7, height: 7 }}></span>
        </button>
        <button className="iconbtn sb-toggle" style={{ width: 30, height: 30, marginLeft: "auto" }}
          title={app.railPref ? t.sbExpand : t.sbCollapse} aria-label={app.railPref ? t.sbExpand : t.sbCollapse}
          onClick={() => app.setRailPref(!app.railPref)}>
          <Ic d={ICONS.panel} size={16} />
        </button>
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <NavItem page="home" num="01" icon="home" label={t.home} />
        <NavItem page="search" num="02" icon="search" label={t.search} />
        <NavItem page="library" num="03" icon="library" label={t.library} />
        <NavItem page="support" num="04" icon="wallet" label={t.support} badge={fmtMoney(app.monthly, app.lang)} />
      </nav>
      <div className="pl-head" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 6px 0 12px", margin: "26px 0 8px" }}>
        <span className="mlabel">{t.playlists}</span>
        <button className="iconbtn ring" style={{ width: 28, height: 28 }} title={t.newPlaylist} aria-label={t.newPlaylist} onClick={() => app.openCreatePl()}><Ic d={ICONS.plus} size={14} /></button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2, minHeight: 0 }}>
        <button className={"plitem" + (r.page === "liked" ? " active" : "")} onClick={() => app.go("liked")} title={t.likedTracks}>
          <span style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--hot)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--hot-ink)" }}>
            <Ic d={ICONS.heart} size={17} fill="currentColor" />
          </span>
          <span className="pl-text" style={{ minWidth: 0 }}>
            <span className="pl-name">{t.likedTracks}</span>
            <span className="pl-sub">{app.likedIds().length} {t.tracksN}</span>
          </span>
        </button>
        {app.allPlaylists.map(pl => (
          <button key={pl.id} className={"plitem" + (r.page === "playlist" && r.id === pl.id ? " active" : "")}
            title={app.lang === "ru" ? pl.name : pl.nameEn}
            onClick={() => app.go("playlist", pl.id)}
            onContextMenu={(e) => app.openCtx(e, { kind: "playlist", id: pl.id })}>
            <Cover hue={pl.hue} size={40} radius={10} />
            <span className="pl-text" style={{ minWidth: 0 }}>
              <span className="pl-name">{app.lang === "ru" ? pl.name : pl.nameEn}</span>
              <span className="pl-sub">{pl.collab ? t.collab + " · " : ""}{app.playlistTracks(pl.id).length} {t.tracksN}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="netline" aria-label={app.lang === "ru" ? "Состояние сети" : "Network status"}>
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--text)" }}></span>12 PEERS · DHT OK</span>
        <span style={{ paddingLeft: 12 }}>CACHE 1.2 GB</span>
      </div>
      <NavItem page="settings" num="05" icon="gear" label={t.settings} />
    </aside>
  );
};

// ---------- Верхняя панель ----------
const TopBar = () => {
  const app = useApp();
  const t = app.t;
  const [bellOpen, setBellOpen] = React.useState(false);
  // Телефон: когда заголовок страницы уезжает под шапку, его имя появляется в самой шапке,
  // а на страницах с большой кнопкой «Слушать» — и маленькая её копия
  const barRef = React.useRef(null);
  const [sc, setSc] = React.useState({ edge: false, title: null, play: false });
  React.useEffect(() => {
    if (!app.phone || !barRef.current) return;
    const m = barRef.current.closest(".main");
    if (!m) return;
    const h = () => {
      const bar = barRef.current.getBoundingClientRect();
      const h1 = m.querySelector("h1");
      const pb = m.querySelector(".playbig");
      const past = h1 && h1.getBoundingClientRect().bottom < bar.bottom - 4;
      const next = { edge: m.scrollTop > 2, title: past ? h1.textContent : null, play: !!(pb && pb.getBoundingClientRect().bottom < bar.bottom) };
      setSc(p => (p.edge === next.edge && p.title === next.title && p.play === next.play) ? p : next);
    };
    h();
    m.addEventListener("scroll", h, { passive: true });
    return () => m.removeEventListener("scroll", h);
  }, [app.phone, app.route.page, app.route.id]);
  // ⌘K / Ctrl+K — к поиску: подсказка в поле обещает это сочетание. По e.code — работает и в русской раскладке
  const searchRef = React.useRef(null);
  React.useEffect(() => {
    if (app.phone) return;
    const k = (e) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.code === "KeyK" && searchRef.current) { e.preventDefault(); searchRef.current.focus(); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [app.phone]);
  const bell = (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <button className={"iconbtn" + (bellOpen ? " lit" : "")} style={{ width: 44, height: 44 }} title={t.notifTitle} aria-label={t.notifTitle} aria-expanded={bellOpen}
        onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}
        onClick={() => setBellOpen(!bellOpen)}>
        <Ic d={ICONS.bell} size={19} />
        {!app.notifRead && <span className="hot-dot" style={{ position: "absolute", top: 11, right: 12 }}></span>}
      </button>
      {bellOpen && <BellPop close={() => setBellOpen(false)} />}
    </span>
  );
  const avatar = (size) => (
    <button title={t.profile} aria-label={t.profile} onClick={() => app.go("profile", "me")} style={{
      width: size, height: size, borderRadius: "50%", background: "var(--acc)", color: "var(--acc-ink)",
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 600, flexShrink: 0,
      outline: app.route.page === "profile" && app.route.id === "me" ? "2px solid var(--hot)" : "none", outlineOffset: 3,
    }}>Л</button>
  );
  // Телефон: на вкладках — логотип, внутри разделов — «Назад»; настройки — шестерёнкой
  if (app.phone) {
    const isTab = MOB_TABS.some(([p]) => p === app.route.page);
    const playFromPage = () => { const b = barRef.current && barRef.current.closest(".main").querySelector(".playbig"); if (b) b.click(); };
    return (
      <div ref={barRef} className={"topbar" + (sc.edge ? " edge" : "")}>
        {!isTab && (
          <button className="iconbtn ring" style={{ width: 44, height: 44, flexShrink: 0 }} aria-label={app.lang === "ru" ? "Назад" : "Back"}
            onClick={() => app.history.length ? app.goBack() : app.go("home")}>
            <Ic d={ICONS.back} size={18} />
          </button>
        )}
        {/* Логотип и заголовок делят одно место: при прокрутке одно сменяет другое */}
        <div className={"tb-mid" + (sc.title ? " on" : "")}>
          {isTab && (
            <button className="tb-logo" onClick={() => app.go("home")} aria-label="Spotless">
              <span className="dots" style={{ fontSize: 20, letterSpacing: "0.02em" }}>SPOTLESS</span>
              <span className="hot-dot"></span>
            </button>
          )}
          <div className="tb-title" aria-hidden={!sc.title}>
            <span>{sc.title}</span>
            {sc.play && (
              <button className="tb-play" aria-label={app.t.play} onClick={playFromPage}><Ic d={ICONS.play} size={14} fill="currentColor" /></button>
            )}
          </div>
        </div>
        {bell}
        <button className={"iconbtn" + (app.route.page === "settings" ? " lit" : "")} style={{ width: 44, height: 44 }} title={t.settings} aria-label={t.settings} onClick={() => app.go("settings")}>
          <Ic d={ICONS.gear} size={19} />
        </button>
        {avatar(38)}
      </div>
    );
  }
  return (
    <div className="topbar">
      <div className="tb-nav" style={{ display: "flex", gap: 8 }}>
        <button className="iconbtn ring" style={{ width: 40, height: 40, opacity: app.history.length ? 1 : 0.35 }} aria-label={app.lang === "ru" ? "Назад" : "Back"} onClick={app.goBack}>
          <Ic d={ICONS.back} size={17} />
        </button>
        <button className="iconbtn ring" style={{ width: 40, height: 40, opacity: app.future.length ? 1 : 0.35 }} aria-label={app.lang === "ru" ? "Вперёд" : "Forward"} onClick={app.goFwd}>
          <Ic d={ICONS.fwd} size={17} />
        </button>
      </div>
      <label className="tb-search" style={{
        flex: "0 1 440px", display: "flex", alignItems: "center", gap: 10, background: "var(--bg2)",
        borderRadius: 22, height: 44, padding: "0 8px 0 16px", marginLeft: 6, cursor: "text",
      }}
        onClick={() => app.route.page !== "search" && app.go("search")}>
        <Ic d={ICONS.search} size={17} style={{ color: "var(--mut2)" }} />
        <input ref={searchRef} value={app.query} placeholder={t.searchPh} aria-label={t.search}
          onChange={(e) => { app.setQuery(e.target.value); if (app.route.page !== "search") app.go("search"); }}
          style={{ flex: 1, minWidth: 0, background: "none", border: "none", outline: "none", color: "var(--text)", fontSize: 14 }} />
        <span className="mono tb-k" style={{ fontSize: 11, border: "1px solid var(--bg3)", borderRadius: 8, padding: "4px 8px", color: "var(--mut2)" }}>⌘K</span>
      </label>
      <div style={{ flex: 1 }}></div>
      {bell}
      {avatar(40)}
    </div>
  );
};

// ---------- Нижняя навигация (телефон) ----------
// Четыре вкладки как в сайдбаре; внутри альбома или артиста подсвечена вкладка, откуда пришли
const MOB_TABS = [["home", "home"], ["search", "search"], ["library", "library"], ["support", "dollar"]];
const TAB_OF = { home: "home", search: "search", genre: "search", library: "library", liked: "library", playlist: "library", support: "support" };
const MobileNav = () => {
  const app = useApp();
  const t = app.t;
  const last = React.useRef("home");
  const cur = TAB_OF[app.route.page];
  if (cur) last.current = cur;
  const active = cur || last.current;
  // Каждая вкладка помнит, где вы остановились; повторный тап по открытой — плавно наверх
  const memo = React.useRef({});
  const tap = (p) => {
    const m = document.querySelector(".main");
    if (app.route.page === p) { if (m) m.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (m && MOB_TABS.some(([q]) => q === app.route.page)) memo.current[app.route.page] = m.scrollTop;
    buzz(5);
    app.go(p);
    const y = memo.current[p];
    if (y) requestAnimationFrame(() => requestAnimationFrame(() => { const mm = document.querySelector(".main"); if (mm) mm.scrollTop = y; }));
  };
  return (
    <nav className="mobnav" aria-label={app.lang === "ru" ? "Разделы" : "Sections"}>
      {MOB_TABS.map(([p, ic]) => (
        <button key={p} className={"mn-item" + (active === p ? " active" : "")} aria-current={app.route.page === p ? "page" : undefined}
          onClick={() => tap(p)}>
          <Ic d={ICONS[ic]} size={22} />
          <span className="mn-label">{active === p && <span className="hot-dot"></span>}{p === "support" ? t.navSupport : t[p]}</span>
        </button>
      ))}
    </nav>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary fallback={() => <AppCrash />}><App /></ErrorBoundary>
);
