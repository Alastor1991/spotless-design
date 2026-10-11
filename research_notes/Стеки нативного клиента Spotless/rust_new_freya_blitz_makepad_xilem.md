# Новые Rust-тулкиты для нативного клиента Spotless: Freya, Dioxus Native (Blitz), Makepad, Xilem/Masonry (состояние на октябрь 2026)

Оговорка о методе: доступ к GitHub API в сессии был закрыт, поэтому README читались через зеркало jsDelivr (`cdn.jsdelivr.net/gh/...`, ветки main/dev на момент запроса), а остальное — через официальные сайты, блоги, docs.rs/lib.rs и обсуждения. Страница анонса Freya 0.4 (docs.freyaui.dev/posts/0.4) вернула 429 — её содержание известно только из поисковой выдачи. Всё, что помечено «из памяти модели», не проверено источником и вынесено в «Пробелы».

## 1. Зрелость, стабильность API, релизы, финансирование

### Takeaway
Ни один из четырёх не заявляет готовность к продакшену и стабильный API. Ближе всех к «стабильному» ярлыку — Freya (0.4 «самый стабильный релиз», июль 2026, но уже идёт 0.5-rc с переписыванием); Blitz — «beta»; Xilem/Masonry — «experimental»; Makepad вышел в 1.0 (май 2025), но сам называл его «early release», а в 2026 развернулся в «Makepad 2.0» с упором на ИИ-генерацию UI.

### Cited Findings
**Freya**
- Анонс 0.4 датирован 16.07.2026; автор называет его «by far the biggest and most stable release yet», примерно через год после 0.3 — [docs.freyaui.dev/posts/0.4 (через поисковую выдачу)](https://docs.freyaui.dev/posts/0.4)
- В 0.4 Freya больше не зависит от Dioxus: собственная реактивная и компонентная модель с нуля; элементы — обычные Rust-функции, возвращающие билдеры (полная смена API относительно 0.1–0.3) — [docs.freyaui.dev/posts/0.4](https://docs.freyaui.dev/posts/0.4); [README](https://cdn.jsdelivr.net/gh/marc2332/freya@main/README.md) («Starting 0.4 Freya does no longer use Dioxus»)
- Патчи 0.4.1 и 0.4.3 есть на docs.rs — [docs.rs freya 0.4.1](https://docs.rs/crate/freya/0.4.1), [docs.rs freya 0.4.3](https://docs.rs/crate/freya/0.4.3)
- README: стабильная — `freya = "0.4"`, следующая — `0.5.0-rc.10` (поисковая выдача ранее показывала rc.2 — значит, rc идут часто) — [README](https://cdn.jsdelivr.net/gh/marc2332/freya@main/README.md)
- Явной гарантии стабильности API в README нет — [README](https://cdn.jsdelivr.net/gh/marc2332/freya@main/README.md)
- Финансирование — только GitHub Sponsors автора (marc2332); проект по сути одного автора с контрибьюторами — [README](https://cdn.jsdelivr.net/gh/marc2332/freya@main/README.md)
- В более старом форке README стояло «work in progress and not usable for production» (снимок, вероятно, устаревший) — [github.com/synkdev/freya](https://github.com/synkdev/freya)

**Dioxus Native / Blitz**
- README Blitz: «Blitz is currently in a **beta** state», «there are also still many bugs and missing features» — [Blitz README](https://cdn.jsdelivr.net/gh/dioxuslabs/blitz@main/README.md)
- Dioxus 0.7 (сентябрь 2025) — «first-ever version» Dioxus Native; Blitz «still considered a 'work in progress'»; производительностью «have not focused on» — [Dioxus 0.7 release post](https://dioxuslabs.com/blog/release-070)
- git-версии Dioxus Native зависят от стабильного Dioxus 0.7.x с crates.io — [Blitz README](https://cdn.jsdelivr.net/gh/dioxuslabs/blitz@main/README.md)
- Последний релиз crate `dioxus-native` — 0.8.0-alpha.1 от 31.07.2026 (линия 0.8 в альфе) — [lib.rs dioxus-native (через выдачу)](https://lib.rs/crates/dioxus-native); есть обсуждение дорожной карты 0.8 — [Dioxus 0.8 Roadmap #5024](https://github.com/DioxusLabs/dioxus/discussions/5024)
- Доклад Nico Burns о Blitz на RustWeek 2026 — [Linebender 2026 Q1](https://linebender.org/blog/tmil-25/)

**Makepad**
- «Makepad 1.0: Rust UI Framework» — 13.05.2025, мейнтейнер (eddybruel): «early release» с «rough edges and missing bits», обещаны регулярные релизы — [HN 43971829](https://news.ycombinator.com/item?id=43971829)
- Сайт 2026: «Makepad 2.0 is a multiplatform Rust UI layer and AI development environment with Splash, our live readable UI DSL for AI-generateable interfaces»; проект с 2019 года, «transitioning into a wider open source project» — [makepad.nl](https://makepad.nl/)
- README не указывает версию/статус; `cargo install makepad-director` «may lag the repo» — [Makepad README (ветка dev)](https://cdn.jsdelivr.net/gh/makepad/makepad@dev/README.md)

**Xilem / Masonry**
- README: «an experimental Rust architecture for reactive UI» — [Xilem README](https://cdn.jsdelivr.net/gh/linebender/xilem@main/README.md)
- MSRV — Rust 1.96; повышение MSRV «will not be treated as a breaking change» и может прийти в патч-релизе — [Xilem README](https://cdn.jsdelivr.net/gh/linebender/xilem@main/README.md)
- Xilem/Masonry 0.4 — 29.10.2025 (7 crate-ов, в т. ч. Xilem Web; новые masonry_core и masonry_testing; стилевые свойства в Xilem) — [GitHub releases](https://github.com/linebender/xilem/releases); [Linebender, октябрь 2025](https://linebender.org/blog/tmil-22/)
- Q1 2026: новая система раскладки (xilem#1560), новые виджеты (Svg, Divider, CollapsePanel, StepInput, RadioButtons, Switch, Clip, Split); номера новых версий в посте не названы — [Linebender 2026 Q1 (19.04.2026)](https://linebender.org/blog/tmil-25/)
- Офис-часы Linebender «на перерыве» до января — [Linebender 2026 Q1](https://linebender.org/blog/tmil-25/)

### Inferences
- Freya — самый «релизный» проект (тег 0.4 и патчи), но 0.4 уже второй полный разрыв API за два года (уход с Dioxus), а 0.5-rc.10 подсказывает ещё один набор ломающих изменений; при этом бас-фактор ≈1.
- Blitz стоит на самом серьёзном фундаменте (Stylo из Firefox, Taffy, Parley, Vello) и имеет компанию за спиной, но публичный API Dioxus Native — альфа (0.8.0-alpha.1).
- Makepad 2.0 смещает фокус к «ИИ генерирует UI на DSL Splash» — для проекта, где UI делается вайб-кодингом, это интересно, но означает ещё один сдвиг API.
- Xilem — исследовательский проект; стабильный API раньше 2027 ожидать не стоит.

### Gaps
- Не удалось прочитать полный changelog Freya 0.4 и дату 0.5 (страница 429).
- Финансирование DioxusLabs (из памяти модели: стартап из Y Combinator с посевным раундом) и Linebender (из памяти: гранты Google Fonts, NLnet и др.), а также компания за Makepad — первичными источниками в этой сессии не подтверждены.
- Точные даты/номера релизов Xilem после 0.4 и Makepad после 1.0 не найдены.

## 2. Поддержка платформ (Linux, Windows, Android, iOS)

### Takeaway
Linux и Windows есть у всех. Android/iOS «из коробки» заявлены у Makepad (с 1.0, нативно, плюс web) и у Blitz (сборки браузерного UI под Android); у Freya Android — вклад сообщества; у Xilem Android/iOS в README не упомянуты (Masonry ранее показывали на Android, но документально в 2026 не подтверждено).

### Cited Findings
- **Makepad**: «OS X, Windows, Linux, iOS, and Android natively, plus the web via WASM» (мейнтейнер, 1.0) — [HN 43971829](https://news.ycombinator.com/item?id=43971829); README: тулчейны для iOS, tvOS, Android, wasm через `cargo-makepad`; 3D-рендер для Quest — [Makepad README](https://cdn.jsdelivr.net/gh/makepad/makepad@dev/README.md); в Robrix на Linux не реализован drag-n-drop «by Makepad» — [Robrix](https://github.com/project-robius/robrix)
- **Blitz**: страница загрузок с «runnable builds of the Browser UI (Windows / macOS / Linux / Android)» — [Blitz README](https://cdn.jsdelivr.net/gh/dioxuslabs/blitz@main/README.md); в посте 0.7 про Android/iOS для Dioxus Native ничего — [Dioxus 0.7](https://dioxuslabs.com/blog/release-070); lib.rs у dioxus-native перечисляет macOS, Linux, Windows — [lib.rs dioxus-native (через выдачу)](https://lib.rs/crates/dioxus-native)
- **Freya**: Android «contributed by a community member»; оговорка про проблемы компиляции под `windows-gnu`; iOS не упомянут — [Freya README](https://cdn.jsdelivr.net/gh/marc2332/freya@main/README.md)
- **Xilem**: есть web-бэкенд и Masonry-бэкенд; инструкции для Linux/BSD (Wayland, libxkbcommon, libxcb, Vulkan dev-пакеты); Android и iOS не упомянуты — [Xilem README](https://cdn.jsdelivr.net/gh/linebender/xilem@main/README.md)
- **Xilem**: Masonry перешла на `ui-events` (в т. ч. IME), что уменьшает зависимость от winit и «opens the door to deployments not dependent on winit» — [Linebender 2026 Q1](https://linebender.org/blog/tmil-25/)

### Inferences
- Для порядка «Linux (Flatpak) → Windows → Android → iOS» самый прямой путь по мобильным — Makepad; Blitz — второй (Android работает на уровне демо-браузера, а не задокументированного прикладного пути). Freya и Xilem на Android — экспериментально.
- Flatpak: все четыре — обычные бинарники с GPU-стеком (Vulkan/GL через wgpu или Skia/GL); специфических препятствий не найдено, но и готовых примеров упаковки — тоже.

### Gaps
- Нет первичного подтверждения статуса iOS для Freya, Blitz, Xilem в 2026.
- Нет данных о жестах/haptics на Android ни у одного из тулкитов (свайпы, long-press, вибрация — придётся писать самим или через JNI).

## 3. Память и размер бинарника

### Takeaway
Конкретных измерений мало и они старые/анекдотичные: Freya — ~30 МБ (автор, Windows) против ~60–65 МБ (пользователь, Windows, пустое приложение), основная доля — Skia; Blitz — ~12 МБ stripped-бинарник (macOS, ранний этап, 2024), типично 10–20 МБ. По Makepad и Xilem чисел не найдено. Отдельный ориентир: отказ от GPU-стека в Rust-приложении снижал RSS с ~135 до ~30 МБ.

### Cited Findings
- Freya: пустое приложение ~60 МБ RAM, release-сборка ~65 МБ (пользователь, Windows, Freya 0.3-rc); мейнтейнер: «around 30MB on Windows», и подтверждает, что основная доля — Skia («that's pretty much where the usage comes from»); 21.04.2025 — [Freya discussion #1153](https://github.com/marc2332/freya/discussions/1153) (до 2026 — возможно устарело, до переписывания 0.4)
- Freya: Windows Narrator не видел подписи и кнопки (тот же тред, апрель 2025) — [discussion #1153](https://github.com/marc2332/freya/discussions/1153)
- Blitz: «~12mb binary size» — stripped release build на macOS, ранний этап — [слайды Webengines Hackfest 2024, Nico Burns](https://webengineshackfest.org/2024/slides/blitz_a_truly_modular_hackable_web_renderer_by_nico_burns.pdf) (2024 — возможно устарело)
- Blitz/Dioxus: «typical binary sizes are around 10-20mb» — непроверенный комментарий HN через агрегатор — [libhunt](https://www.libhunt.com/compare-dioxus-vs-DioxusLabs--blitz)
- dioxus-native на lib.rs рекламирует «Portable <3mb binaries» (скорее общий слоган Dioxus, не измерение Blitz) — [lib.rs dioxus-native (через выдачу)](https://lib.rs/crates/dioxus-native)
- Dioxus 0.7: производительностью Native «have not focused on»; бенчмарков нет — [Dioxus 0.7](https://dioxuslabs.com/blog/release-070)
- Ориентир по GPU-стеку: Rust-монитор ~135 МБ на egui → ~30 МБ на Slint с софтверным рендером; автор приписывает экономию отказу от GPU (контекст OpenGL, драйвер, атлас в VRAM) — [trystan-sarrade.com](https://trystan-sarrade.com/article/rust-gui-135mb-to-30mb-egui-to-slint/) (одиночный кейс)
- На Android CPU и GPU делят одну RAM, поэтому GPU-кэши Skia засчитываются приложению; измерение через adb на разных устройствах непоследовательно — [skia-discuss](https://groups.google.com/g/skia-discuss/c/Jxr3n_tSnWw)
- Xilem/Masonry теперь могут рендерить через Vello CPU («not requiring a GPU») благодаря абстракции imaging (xilem#1696) — [Linebender 2026 Q1](https://linebender.org/blog/tmil-25/)
- AccessKit отдельно сокращал свою память (общие таблицы свойств между узлами) — [accesskit.dev](https://accesskit.dev/dramatically-reducing-accesskits-memory-usage/)

### Inferences
- Для владельца, который ненавидит «жрущие как браузер» приложения, все четыре на порядок лучше Electron (сотни МБ), но базовый RSS у GPU-тулкитов — десятки МБ из-за драйвера/контекста, а не самого UI. Xilem с Vello CPU потенциально позволяет «лёгкий» режим без GPU.
- Blitz тянет Stylo (полноценный CSS-движок Firefox) — это объясняет 10–20 МБ бинарника; Freya тянет Skia (тоже ~10+ МБ статически, из памяти модели).
- Без собственного замера на макете Spotless (одинаковый экран: список 1000 треков, обложки, точечный прогресс) сравнивать по памяти нельзя.

### Gaps
- Нет измерений RSS/бинарника для Makepad и Xilem; нет свежих (2026) чисел для Freya 0.4 и Blitz; нет Android-замеров ни для кого.

## 4. Кастомная отрисовка; полнота CSS у Blitz

### Takeaway
Blitz — единственный, кто понимает настоящий CSS (Stylo): flex, grid, transitions, animations, box-shadow, border-radius, @font-face, mask-image, clip-path, 2D transform — поддержаны; filter/backdrop-filter — частично; **container queries не поддерживаются** (а прототип Spotless опирается на них для ступеней скрытия), sticky — в работе. Makepad — максимальная свобода отрисовки (стиль = шейдеры на своём DSL). Freya — Skia (градиенты, тени, блюр, шрифты, анимации). Xilem — Vello, но высокоуровневые стили только начали появляться.

### Cited Findings
**Blitz (матрица blitz.is/status/css, прочитана в октябре 2026)** — [blitz.is/status/css](https://blitz.is/status/css)
- `display: flex` — «✅ Supported»; grid — «✅ Supported», subgrid — «❌ Not supported»
- `container-type`, `container` — «❌ Not supported» (т. е. @container-запросов нет)
- transitions — «✅ Supported»; animations — «✅ Supported»
- `filter` — «⚠️ Partial support»; `backdrop-filter` — «⚠️ Partial support»
- `box-shadow`, `border-radius`, `@font-face`, `overflow` scroll, `opacity`, `clip-path`, `mask-image` — «✅ Supported»
- `position: sticky` — «🚧 In Progress»; transform 2D — «✅», 3D — «❌»
- gradient в значении `content` — «❌» (поддержка градиентов в фонах на странице отдельно не перечислена)
- README Blitz: цели — «Modern HTML layout (flexbox, grid, table, block, inline, absolute/fixed, etc)», «Advanced CSS (complex selectors, media queries, css variables)» — [Blitz README](https://cdn.jsdelivr.net/gh/dioxuslabs/blitz@main/README.md)
- Стек: Stylo (CSS-движок Firefox), Taffy (раскладка), Parley (текст), Vello (GPU compute-рендер через WGPU); известные проблемы — неверное направление письма и «occasional layout quirks»; часто результат «indistinguishable from browsers like Chrome and Safari» — [Dioxus 0.7](https://dioxuslabs.com/blog/release-070)
- Рендер в README — `blitz-renderer-vello` и абстракция AnyRender — [Blitz README](https://cdn.jsdelivr.net/gh/dioxuslabs/blitz@main/README.md)
- Freya умеет встраивать HTML-рендер через Blitz (фича-флаг) — [Freya README](https://cdn.jsdelivr.net/gh/marc2332/freya@main/README.md)

**Makepad**
- Рендер «almost solely on the GPU»; внешний вид задаётся шейдерами; свой DSL с шейдерным языком, компилируемым под разные графические бэкенды; live-редактирование DSL без перекомпиляции — [HN 43971829](https://news.ycombinator.com/item?id=43971829)
- «GPU-accelerated 2D and 3D rendering», «live-editable UI DSL» со скриптовым движком — [Makepad README](https://cdn.jsdelivr.net/gh/makepad/makepad@dev/README.md)
- Демо 2026: DJ/VJ с видеоэффектами, векторные карты, нотная запись — [makepad.nl](https://makepad.nl/)

**Freya**
- Анимации (цвета, размеры, позиции, easing), `VirtualScrollView`, rich text editing, фича-модули (router, i18n на Fluent, Material-стили, plotters, терминал), devtools, headless-тесты `freya-testing`, иконки Lucide — [Freya README](https://cdn.jsdelivr.net/gh/marc2332/freya@main/README.md)
- Рендер — Skia через rust-skia (упомянуто в благодарностях); шейдеры в README не упомянуты — [Freya README](https://cdn.jsdelivr.net/gh/marc2332/freya@main/README.md)

**Xilem**
- 2D — Vello + wgpu; текст — Parley/Fontique — [Xilem README](https://cdn.jsdelivr.net/gh/linebender/xilem@main/README.md)
- В 0.4 впервые можно задавать стилевые свойства в Xilem-приложениях — [GitHub releases](https://github.com/linebender/xilem/releases)
- Vello 0.8.0 и sparse strips 0.0.7 (Vello CPU, Vello Hybrid) — в Q1 2026; Vello Hybrid — «roughly beta quality» — [Linebender 2026 Q1](https://linebender.org/blog/tmil-25/)

### Inferences
- Для «точечной» эстетики Spotless (DotBar из целого числа точек, шрифт Doto, маска «обложка точками», 28px радиусы, тонкие линии): у Makepad маска/точки — естественный шейдер; у Freya/Xilem — кастомный canvas/рисование; у Blitz — CSS `mask-image` поддержан, Doto через @font-face поддержан.
- **Перенос CSS прототипа в Blitz не будет «один в один»**: ключевые ступени адаптива сделаны через container queries (островок `clamp(...cqi...)`, `.fs-grid container-type: size`), которых в Blitz нет — их пришлось бы переписать на media queries или логику в Rust. Кроме того, React-код (~7000 строк) пришлось бы переписывать на Dioxus RSX (похоже по модели, но не тот же код), а `localStorage`-подобные веб-API Blitz сознательно не поддерживает (см. п. 9).
- `filter: blur` частичный — эффекты размытия под поповерами (если понадобятся) — риск.

### Gaps
- Не подтверждено: поддержка в Blitz CSS-переменных и media queries «как есть» (в матрице не перечислены; в README — как цель), градиентов в `background-image` (linear/radial/conic).
- Нет первоисточника по кастомным шейдерам во Freya 0.4 и Xilem.

## 5. Доступность (AccessKit), ввод текста и IME, кириллица

### Takeaway
AccessKit используют Xilem/Masonry и Blitz (заявлено), Freya (есть, но в 2025 Narrator не видел элементы); у Makepad доступность в 2025 отсутствовала (комментаторы HN просили). Шейпинг: Xilem/Blitz — Parley + HarfRust (порт HarfBuzz от Google Fonts) → кириллица штатно; Freya — Skia (из памяти: SkParagraph + HarfBuzz).

### Cited Findings
- Xilem: «AccessKit for plugging into accessibility APIs» — [Xilem README](https://cdn.jsdelivr.net/gh/linebender/xilem@main/README.md)
- Xilem 0.4 — первый релиз на HarfRust (Google Fonts) вместо Swash для шейпинга — [Linebender, октябрь 2025](https://linebender.org/blog/tmil-22/)
- Masonry: IME через `ui-events` — [Linebender 2026 Q1](https://linebender.org/blog/tmil-25/)
- Blitz: «Accessibility using AccessKit» — заявленная цель — [Blitz README](https://cdn.jsdelivr.net/gh/dioxuslabs/blitz@main/README.md); Dioxus 0.7: «accessibility integration» поддержана «out of the box», есть text inputs и базовые `<form>` — [Dioxus 0.7](https://dioxuslabs.com/blog/release-070)
- Freya: улучшения доступности от контрибьютора упомянуты без деталей — [Freya README](https://cdn.jsdelivr.net/gh/marc2332/freya@main/README.md); в апреле 2025 «Windows Narrator doesn't detect labels or buttons» — [discussion #1153](https://github.com/marc2332/freya/discussions/1153)
- Makepad: в обсуждении 1.0 комментатор называет доступность среди будущих работ — т. е. на май 2025 её не было в готовом виде — [HN 43971829](https://news.ycombinator.com/item?id=43971829)

### Inferences
- Для русскоязычного интерфейса кириллица не проблема ни для одного (все используют HarfBuzz-класс шейпинг или собственный стек — для Makepad не подтверждено).
- Если доступность (скринридеры) — требование, Makepad сейчас самый слабый.

### Gaps
- Статус IME и доступности в Makepad 2.0 (2026) не найден.
- Качество IME на Linux (Wayland, ibus/fcitx) и Android ни для одного не измерено.

## 6. Лицензия и совместимость с AGPL-3.0

### Takeaway
Все четыре — пермиссивные лицензии, совместимые с AGPL-3.0 клиента: Freya — MIT; Blitz — MIT/Apache-2.0 (+ MPL-2.0 у `stylo_taffy`, а Stylo из Firefox — MPL-2.0); Xilem — Apache-2.0; Makepad — MIT/Apache-2.0 (из памяти модели, не подтверждено в сессии).

### Cited Findings
- Freya — MIT — [Freya README](https://cdn.jsdelivr.net/gh/marc2332/freya@main/README.md)
- Blitz — «dual licensed under the Apache 2.0 and MIT licenses»; `stylo_taffy` дополнительно под MPL 2.0 — [Blitz README](https://cdn.jsdelivr.net/gh/dioxuslabs/blitz@main/README.md)
- Xilem — Apache License 2.0; часть ассетов примеров (Roboto Flex и CSV) под своими лицензиями — [Xilem README](https://cdn.jsdelivr.net/gh/linebender/xilem@main/README.md)
- FSF: Apache-2.0 совместима с GPLv3 (и, соответственно, AGPLv3); MPL-2.0 совместима с GPL через «secondary license» — [FSF license list](https://www.gnu.org/licenses/license-list.html)

### Inferences
- Лицензионно препятствий нет ни у одного; MPL-2.0 (Stylo) требует лишь сохранять исходники изменённых MPL-файлов открытыми — для AGPL-проекта это и так выполняется.

### Gaps
- Лицензия Makepad в прочитанных в сессии источниках не указана (README и сайт её не называют); из памяти модели — MIT OR Apache-2.0, проверить по LICENSE в репозитории.

## 7. Реальные приложения

### Takeaway
Makepad — Robrix (Matrix-клиент, флагман Project Robius) и Moly (LLM-клиент); Xilem — Runebender (редактор шрифтов, перенесён в 2026), Boomaga-IPP, Scrolled Quran; Freya — в основном приложения автора (Valin-редактор, из памяти); Blitz — демо-браузер и рендер сайтов, крупных прикладных приложений не найдено.

### Cited Findings
- Makepad: Robrix и Moly названы мейнтейнером — [HN 43971829](https://news.ycombinator.com/item?id=43971829); Robrix — «flagship app of Project Robius», написан на Makepad — [Project Robius](https://github.com/project-robius), [Robrix](https://github.com/project-robius/robrix); есть китайские форки Robrix2 (Project-Robius-China, OctoSense) — [robrix2](https://github.com/Project-Robius-China/robrix2)
- Makepad 2.0 демо: Finance, Sheets, Files, DJ/VJ со stem separation, Maps (230 ГБ архив), Score — [makepad.nl](https://makepad.nl/)
- Xilem: Runebender перенесён на Xilem (март 2026), Boomaga-IPP, Scrolled Quran — [Linebender 2026 Q1](https://linebender.org/blog/tmil-25/)
- Blitz: рендер Servo.org, Hacker News, BBC; GitHub рендерится с ошибками — [Dioxus 0.7](https://dioxuslabs.com/blog/release-070)
- Freya: README упоминает trev (из той же учётной записи автора) — [github.com/marc2332/trev](https://github.com/marc2332/trev); конкретных продакшн-приложений не найдено

### Inferences
- Makepad DJ/VJ-демо — ближайший аналог «музыкального» приложения с плотной кастомной графикой; Robrix — доказательство, что на Makepad можно сделать мобильно-десктопное приложение среднего размера.

### Gaps
- Нет списка продакшн-приложений на Freya 0.4 и Dioxus Native.

## 8. Документация и пригодность для ИИ-ассистента

### Takeaway
Корпус для обучения ИИ у всех маленький и устаревает из-за переписываний: Freya 0.4 полностью сменила API (старые примеры на Dioxus-синтаксисе вредны); у Xilem API меняется каждую минорную версию; у Makepad свой DSL (но Makepad 2.0 прямо проектирует DSL Splash под генерацию моделями и встраивает ИИ в Studio). У Blitz преимущество: стили — обычный CSS, которому ИИ обучен лучше всего, а компоненты — Dioxus RSX (самый большой корпус из четырёх, но через Dioxus web/desktop).

### Cited Findings
- Makepad 2.0: Splash описывает экраны, виджеты, раскладку, стили и состояние так, чтобы модели генерировали UI «in small, reviewable steps»; Rust-диагностика помогает сгенерированному коду «converge» — [makepad.nl](https://makepad.nl/); README: «AI-accelerated workflow», «AI automation inside Studio to control and inspect UI» — [Makepad README](https://cdn.jsdelivr.net/gh/makepad/makepad@dev/README.md)
- Makepad Studio на 1.0 «not quite ready for prime time» — [HN 43971829](https://news.ycombinator.com/item?id=43971829); есть «Makepad Book» на makepad.rs — [makepad.rs](https://makepad.rs/skills-and-components/components/makepad-component)
- Freya 0.4 — новые билдеры вместо RSX-модели Dioxus — [docs.freyaui.dev/posts/0.4](https://docs.freyaui.dev/posts/0.4); есть сайт документации, nightly/stable docs и book (по README форка) — [github.com/Tharmin/freya](https://github.com/Tharmin/freya)
- Xilem: Masonry — «toolkit for building UI frameworks», Xilem — то, что выбирать новичкам — [Xilem README](https://cdn.jsdelivr.net/gh/linebender/xilem@main/README.md)
- Blitz: есть индекс документации (Algolia DocSearch) — [docsearch](https://docsearch.algolia.com/mcp/docs/repo/dioxuslabs/blitz)
- Общий фон: по опросу, 94,4% Rust GUI-библиотек «aren't production-ready» — [weeklyrust](https://weeklyrust.substack.com/p/the-state-of-rust-gui-the-good-and) (дата и методика опроса не проверены)

### Inferences
- Для владельца, который пишет фронтенд вайб-кодингом: Blitz позволяет переиспользовать навыки и часть CSS прототипа; Makepad сознательно делает ставку на ИИ-генерацию; Freya и Xilem — ИИ будет часто ошибаться на устаревших API.

### Gaps
- Нет объективной меры (число примеров, вопросов на SO, звёзд) — GitHub API был недоступен.

## 9. Ключевые риски для продакшн-приложения

### Takeaway
Главные риски: незрелость и ломающие изменения у всех; бас-фактор у Freya; отсутствие container queries и «бета»-статус у Blitz; закрытость DSL, слабая доступность и смена курса на ИИ у Makepad; экспериментальность и отсутствие мобильной истории у Xilem.

### Cited Findings
- Blitz сознательно не поддерживает часть веб-API (WebRTC, WebSockets, Bluetooth, localStorage) и не имеет биндингов для других языков — [Blitz README](https://cdn.jsdelivr.net/gh/dioxuslabs/blitz@main/README.md)
- Blitz: страницы с JS или редкими CSS-свойствами рендерятся плохо; известны проблемы с направлением письма — [Dioxus 0.7](https://dioxuslabs.com/blog/release-070)
- Xilem: MSRV растёт в патч-релизах; проект «experimental» — [Xilem README](https://cdn.jsdelivr.net/gh/linebender/xilem@main/README.md); единый Vello API «proved more complex than expected» — [Linebender 2026 Q1](https://linebender.org/blog/tmil-25/)
- Makepad: Linux drag-n-drop не реализован (по Robrix) — [Robrix](https://github.com/project-robius/robrix); 1.0 — «rough edges and missing bits» — [HN 43971829](https://news.ycombinator.com/item?id=43971829)
- Freya: два полных разрыва API (0.1–0.3 на Dioxus → 0.4 своё ядро → 0.5-rc) — [README](https://cdn.jsdelivr.net/gh/marc2332/freya@main/README.md)

### Inferences
- Для эталона «выверять каждый пиксель» и 7 палитр во время работы: у всех темы реализуемы (в Blitz — буквально CSS-переменные, если они работают; в остальных — глобальные структуры), но гарантированно повторить CSS-прототип умеет только Blitz, и то без container queries.
- Ни один из четырёх не даёт готовых нижних листов, haptics и Android-жестов уровня прототипа — это писать самим.
- Если выбирать среди этих четырёх для «Linux → Windows → Android», разумная пара для прототипирования-спайка: Makepad (мобильные + кастомная графика) и Blitz (CSS-перенос); Freya — запасной вариант для десктопа; Xilem — наблюдать.

### Gaps
- Нет независимых бенчмарков (FPS при прокрутке длинных списков, задержка ввода) ни для одного тулкита.
