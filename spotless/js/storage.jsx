// Spotless — сохранение между запусками: localStorage, проверка сохранённого при загрузке.

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

// Сохраняем всё из keep (что отдали хуки состояния, см. state.jsx), как только что-то из этого
// поменялось. Набор ключей у keep всегда один и тот же, поэтому его значения годятся в зависимости.
const usePersist = (keep) => {
  React.useEffect(() => { saveLS({ uiVersion: 2, ...keep }); }, Object.values(keep));
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
  if (s.downloads != null) s.downloads = obj(s.downloads); // нет вовсе — положим стартовые загрузки
  s.settings = cleanSettings(s.settings);
  if (!THEME_LIST.some(th => th.id === s.theme)) delete s.theme;
  if (!(typeof s.monthly === "number" && s.monthly > 0)) delete s.monthly;
  if (!(typeof s.volume === "number" && s.volume >= 0 && s.volume <= 1)) delete s.volume;
  if (s.lang !== "ru" && s.lang !== "en") delete s.lang;
  if (!DB.currencies[s.currency]) delete s.currency;
  if (!routeOk(s.route, s.userPlaylists)) s.route = { page: "home", id: null };
  return s;
};

Object.assign(window, { LS_KEY, loadLS, saveLS, usePersist, routeOk, cleanSaved });
