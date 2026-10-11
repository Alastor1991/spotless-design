// Spotless — основа без картинки: контекст приложения, хранилище прогресса, окна и жесты,
// помощники мок-базы, деньги и суммы, проверка настроек.

const AppCtx = React.createContext(null);
const useApp = () => React.useContext(AppCtx);

// Прогресс трека — отдельное маленькое хранилище, а не состояние App. Он меняется каждую секунду,
// и через общий контекст это перерисовывало бы всё дерево (сотни элементов в секунду даже на
// неподвижном экране). На него подписываются только плеерные компоненты — через useProgress().
const createProgress = (initial = 0) => {
  let pct = initial;
  const subs = new Set();
  return {
    get: () => pct,
    set: (v) => {
      const n = Math.min(1, Math.max(0, Number(v) || 0));
      if (n === pct) return;
      pct = n;
      subs.forEach(f => f());
    },
    subscribe: (f) => { subs.add(f); return () => subs.delete(f); },
  };
};
const useProgress = () => {
  const p = useApp().progress;
  return React.useSyncExternalStore(p.subscribe, p.get);
};

// Граница ошибок: если экран упал при отрисовке, вместо чёрного окна — объяснение и выход.
// fallback(reset, detail) — что показать; detail — текст ошибки и компонент, где она случилась:
// он виден на экране ошибки, чтобы для отчёта хватило скриншота без консоли разработчика.
// При смене resetKey (например, другая страница) пробуем снова.
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null, where: "" }; this.reset = () => this.setState({ error: null, where: "" }); }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) {
    console.error("Spotless:", error, info && info.componentStack);
    // Первый компонент из стека: «at FullScreen (…)» в Chrome, «FullScreen@…» в Firefox
    const names = String((info && info.componentStack) || "").split("\n")
      .map(l => (l.trim().match(/^(?:at\s+)?([A-Z][\w$]*)/) || [])[1]).filter(n => n && n !== "ErrorBoundary");
    if (names[0]) this.setState({ where: names[0] });
  }
  componentDidUpdate(prev) { if (this.state.error && prev.resetKey !== this.props.resetKey) this.reset(); }
  render() {
    const e = this.state.error;
    if (!e) return this.props.children;
    return this.props.fallback(this.reset, String((e && e.name) || "Error") + ": " + String((e && e.message) || e) + (this.state.where ? " · " + this.state.where : ""));
  }
}

// Телефонная раскладка (Android): ниже 640px — нижняя навигация и свой плеер
const PHONE_Q = "(max-width: 640px)";
const useMedia = (q) => {
  const [m, setM] = React.useState(() => window.matchMedia(q).matches);
  React.useEffect(() => {
    const mq = window.matchMedia(q);
    const h = () => setM(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", h) : mq.addListener(h);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", h) : mq.removeListener(h); };
  }, [q]);
  return m;
};

// ---------- Окна ----------
// Esc закрывает окно. Слушаем в фазе перехвата и гасим событие, чтобы заодно не закрылся
// полноэкранный плеер под окном. active = false — окно закрыто, не слушаем.
const useEscape = (close, active = true) => {
  const ref = React.useRef(close);
  ref.current = close;
  React.useEffect(() => {
    if (!active) return;
    const k = (e) => { if (e.key === "Escape") { e.stopPropagation(); ref.current(); } };
    window.addEventListener("keydown", k, true);
    return () => window.removeEventListener("keydown", k, true);
  }, [active]);
};

// Поповер не должен вылезать за край окна: замеряем и сдвигаем
const usePopClamp = () => {
  const ref = React.useRef(null);
  const [dx, setDx] = React.useState(0);
  React.useLayoutEffect(() => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    let d = 0;
    if (r.right > window.innerWidth - 10) d = window.innerWidth - 10 - r.right;
    if (r.left + d < 10) d = 10 - r.left;
    if (Math.abs(d) > 1) setDx(prev => prev + d);
  }, []);
  return [ref, dx];
};

// Во сколько раз уменьшить крупное число, чтобы оно влезло в ширину своего виджета (1 — влезает).
// ref — само число (inline-элемент), deps — от чего зависит его ширина. Следит за шириной виджета.
// Без этого на телефоне четырёхзначные суммы вылезали за край и давали горизонтальную прокрутку
const useFitScale = (ref, deps) => {
  const kRef = React.useRef(1);
  const [k, setK] = React.useState(1);
  React.useLayoutEffect(() => {
    const el = ref.current;
    const box = el && el.closest(".widget");
    if (!box) return;
    const fit = () => {
      const cs = getComputedStyle(box);
      const avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const natural = el.getBoundingClientRect().width / kRef.current; // ширина при полном размере
      const next = Math.min(1, Math.floor((avail / natural) * 100) / 100);
      if (next !== kRef.current) { kRef.current = next; setK(next); }
    };
    fit();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => ro.disconnect();
  }, deps);
  return k;
};

// Ширина элемента, следит за изменениями (точечные полосы считают по ней число точек)
const useWidth = (ref) => {
  const [w, setW] = React.useState(0);
  React.useLayoutEffect(() => {
    if (!ref.current) return;
    setW(ref.current.getBoundingClientRect().width);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return w;
};

// ---------- Жесты ----------
const HOLD_MS = 350;        // удержание сердечка до окна оценки
const SLOP = 10;            // px: меньше — дрожание пальца, а не движение

// Короткий тактильный отклик (Android); где вибрация недоступна — молча ничего
const buzz = (ms = 10) => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} };
const isTouchUI = () => { try { return window.matchMedia("(hover: none)").matches; } catch (e) { return false; } };

// После долгого нажатия гасим клик, который придёт при отпускании пальца, — где бы он ни оказался.
// Меню всплывает листом прямо под пальцем, и этот клик «нажимал» пункт под ним (например, «В очередь»):
// в эмуляции касаний — всегда, на телефоне — если отпустить раньше системного долгого нажатия.
// Слушатель снимается сам: после первого клика или через 300 мс после отпускания.
const swallowReleaseClick = () => {
  let tm = null;
  const off = () => { window.removeEventListener("click", eat, true); window.removeEventListener("pointerup", release, true); clearTimeout(tm); };
  const eat = (e) => { e.stopPropagation(); e.preventDefault(); off(); };
  const release = () => { clearTimeout(tm); tm = setTimeout(off, 300); };
  window.addEventListener("click", eat, true);
  window.addEventListener("pointerup", release, true);
};

// Долгое нажатие пальцем (мышь не трогаем — у неё есть ПКМ). Сдвиг больше SLOP — это прокрутка, отмена.
// После срабатывания гасим следующий клик, чтобы трек не включился сам и не нажался пункт меню.
const useLongPress = (onLong, ms = 450) => {
  const timer = React.useRef(null);
  const start = React.useRef(null);
  const fired = React.useRef(false);
  const clear = () => { clearTimeout(timer.current); timer.current = null; };
  React.useEffect(() => clear, []);
  return {
    onPointerDown: (e) => {
      if (e.pointerType === "mouse") return;
      fired.current = false;
      const x = e.clientX, y = e.clientY;
      start.current = [x, y];
      clear();
      timer.current = setTimeout(() => { fired.current = true; buzz(12); swallowReleaseClick(); onLong(x, y); }, ms);
    },
    onPointerMove: (e) => {
      if (timer.current && start.current && Math.hypot(e.clientX - start.current[0], e.clientY - start.current[1]) > SLOP) clear();
    },
    onPointerUp: clear, onPointerCancel: clear,
    onClickCapture: (e) => { if (fired.current) { e.stopPropagation(); e.preventDefault(); fired.current = false; } },
  };
};

// ---------- Мок-база ----------
// Трек вместе с его релизом и артистом
const trackInfo = (id) => {
  const tr = DB.trackIndex[id];
  return { tr, al: DB.albums[tr.album], ar: DB.artists[tr.artist] };
};
// Длительность трека в секундах (из строки «3:56»)
const trackSec = (id) => {
  const tr = DB.trackIndex[id];
  const [m, s] = tr ? tr.dur.split(":").map(Number) : [3, 0];
  return m * 60 + s || 180;
};
// Сколько минут звучат эти треки вместе
const minutesOf = (ids) => Math.round(ids.reduce((sum, id) => sum + trackSec(id), 0) / 60);
const albumIds = (al) => al.tracks.map(tr => tr.id);
const artistAlbums = (artistId) => Object.values(DB.albums).filter(a => a.artist === artistId);
// Треки этих артистов, самые слушаемые — первыми
const topTracks = (artistIds) => Object.values(DB.trackIndex).filter(tr => artistIds.includes(tr.artist))
  .sort((a, b) => parseInt(b.plays.replace(/\D/g, "")) - parseInt(a.plays.replace(/\D/g, "")));
// Название плейлиста на языке интерфейса (у своих плейлистов английского названия может не быть)
const plName = (lang, pl) => (lang === "ru" ? pl.name : (pl.nameEn || pl.name));

// ---------- Деньги ----------
// Суммы на экране — в валюте, которую человек выбрал в настройках: знак перед числом, в русском
// интерфейсе — десятичная запятая ($1,90 · €1,90 · £1,90). Валюту выбирают один раз, поэтому свои
// деньги — сумму в месяц, баланс, донаты, историю — человек и платил в ней: это те же числа.
// По курсу пересчитываются только суммы, которые сервис считает в долларах (money.usd):
// доходы артистов и комиссии сети. Курсы — заглушка в data.js.
const makeMoney = (currency, lang) => {
  const c = DB.currencies[currency] || DB.currencies.usd;
  const dec = (s) => (lang === "ru" ? s.replace(".", ",") : s);
  // Число без знака: «1,90»; keepZeros — «5,00» вместо «5»
  const num = (n, keepZeros) => {
    const s = Number(n).toFixed(2);
    return dec(keepZeros ? s : s.replace(/\.00$/, ""));
  };
  return {
    currency, sign: c.sign, num,
    fmt: (n, keepZeros) => c.sign + num(n, keepZeros),                 // «€1,90»
    int: (n) => c.sign + Math.round(n).toLocaleString(lang),          // «€4 582» — крупные суммы
    fee: (n) => c.sign + dec(Number(n).toFixed(3)),                    // «€0,011» — комиссии сети
    usd: (n) => n * c.perUsd,                                          // долларовую сумму — в валюту человека
    // Для крупных цифр: целые и копейки отдельно (копейки всегда двумя знаками, «4,99…» не станет «4,100»)
    parts: (n) => {
      const k = Math.round(Number(n) * 100);
      return { whole: Math.floor(k / 100), cents: String(k % 100).padStart(2, "0"), sep: lang === "ru" ? "," : "." };
    },
  };
};
// Сумма для поля ввода — как набрал бы человек: «7,5»
const amountText = (n, lang) => String(n).replace(".", lang === "ru" ? "," : ".");
// Своя сумма в поле ввода: цифры и один десятичный разделитель — запятая или точка, как набрал
// человек, и не больше двух знаков после него. Одно правило на все поля: раньше в онбординге
// запятая выбрасывалась, и «2,5» превращалось в $25. Сумма может быть любой; граница только
// техническая — 13 цифр до разделителя: дальше число в JavaScript не хранит копейки точно,
// и на экране оказывалось бы другое число (99…9,99 → 100…0,00, а с 22 цифр — «1e+22»).
const AMOUNT_MAX = 9999999999999.99;
const cleanAmount = (s) => {
  const v = String(s).replace(/[^\d.,]/g, "");
  const i = v.search(/[.,]/);
  const whole = (i < 0 ? v : v.slice(0, i)).replace(/^0+(?=\d)/, "").slice(0, 13);
  return i < 0 ? whole : whole + v[i] + v.slice(i + 1).replace(/[.,]/g, "").slice(0, 2);
};
const parseAmount = (s) => parseFloat(String(s).replace(",", "."));
// Как сумма в месяц делится между артистами: доли — из истории прослушиваний (мок), сумма — своя
const splitNow = (monthly) => DB.supportSplit.map(s => ({ ...s, amount: Math.round(monthly * s.pct) / 100 }));
// Доля артиста в этом месяце (null — в этом месяце вы его не слушали)
const shareOf = (artistId, monthly) => splitNow(monthly).find(s => s.artist === artistId) || null;

// Копирование в буфер. writeText возвращает промис, и отказ в доступе к буферу (нет разрешения,
// не https) прилетал в консоль необработанной ошибкой — try/catch промис не ловит
const copyText = (s) => {
  try { const p = navigator.clipboard && navigator.clipboard.writeText(s); if (p && p.catch) p.catch(() => {}); } catch (e) {}
};

// ---------- Настройки ----------
// Значения по умолчанию и проверка. Нужна дважды — при загрузке сохранённого и при импорте темы
// из JSON: раньше туда попадало что угодно («island»: "zzz").
// base — что оставить, если значение не годится (при импорте — текущие настройки).
const DEFAULT_SETTINGS = { island: "pill", density: "n", accent: null, wallpaper: null, wallpaperImg: null, likeRating: 10 };
const isHue = (v) => typeof v === "number" && isFinite(v) && v >= 0 && v <= 360;
const cleanSettings = (s, base = DEFAULT_SETTINGS) => {
  const o = s && typeof s === "object" ? s : {};
  const pick = (k, ok) => (o[k] !== undefined && ok(o[k]) ? o[k] : base[k]);
  return {
    island: pick("island", v => ["pill", "square", "panel"].includes(v)),
    density: pick("density", v => ["c", "n", "s"].includes(v)),
    accent: pick("accent", v => v === null || isHue(v)),
    wallpaper: pick("wallpaper", v => v === null || isHue(v)),
    wallpaperImg: pick("wallpaperImg", v => v === null || (typeof v === "string" && v.startsWith("data:image/"))),
    likeRating: pick("likeRating", v => Number.isInteger(v) && v >= 5 && v <= 10),
  };
};

Object.assign(window, {
  AppCtx, useApp, createProgress, useProgress, ErrorBoundary, PHONE_Q, useMedia,
  useEscape, usePopClamp, useWidth, useFitScale, HOLD_MS, SLOP, buzz, isTouchUI, useLongPress,
  trackInfo, trackSec, minutesOf, albumIds, artistAlbums, topTracks, plName,
  makeMoney, amountText, AMOUNT_MAX, cleanAmount, parseAmount, splitNow, shareOf, copyText, DEFAULT_SETTINGS, cleanSettings,
});
