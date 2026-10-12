// Spotless — корень приложения: собирает состояние из хуков (state.jsx) в один объект api,
// сохраняет нужное между запусками и показывает онбординг или само приложение (shell.jsx).

// Части api не должны перекрывать друг друга: совпавшее имя молча заменило бы чужую функцию
const joinApi = (parts) => {
  const api = {};
  parts.forEach(p => Object.keys(p).forEach(k => {
    if (k in api) console.error("Spotless: имя в api повторяется —", k);
    api[k] = p[k];
  }));
  return api;
};

const App = () => {
  // Сохранённое читаем один раз (раньше — на каждом рендере, то есть каждую секунду)
  const saved = React.useState(() => cleanSaved(loadLS()))[0];

  const locale = useLocale(saved);
  const feedback = useFeedback(saved);
  const nav = useNav(saved);
  const settings = useSettings(saved);
  const layout = useLayout(saved);
  const money = useMoney(saved, locale.api);
  const overlays = useOverlays(saved);
  // Тексты, тосты и подсказки нужны почти всем разделам
  const say = { ...locale.api, toast: feedback.api.toast, hint: feedback.api.hint };
  const player = usePlayer(saved, say);
  const library = useLibrary(saved, { ...say, likeRating: settings.api.likeRating, route: nav.api.route, go: nav.api.go });
  const downloads = useDownloads(saved, say);

  const parts = [locale, feedback, nav, settings, layout, money, overlays, player, library, downloads];
  usePersist(Object.assign({}, ...parts.map(p => p.keep)));
  const api = joinApi(parts.map(p => p.api));
  // Цвет из обложки (Material): от играющего трека; в онбординге цвета ещё нет
  useStyleAccent(api.style, api.player.trackId, api.settings.mAccent, api.onboarded);

  return (
    <StyleCtx.Provider value={api.style}>
      <AppCtx.Provider value={api}>
        {api.onboarded ? <Shell /> : <Onboarding />}
      </AppCtx.Provider>
    </StyleCtx.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary fallback={(reset, detail) => <AppCrash detail={detail} />}><App /></ErrorBoundary>
);
