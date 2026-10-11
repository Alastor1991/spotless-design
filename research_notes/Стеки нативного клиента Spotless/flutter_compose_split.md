# Flutter + flutter_rust_bridge, Compose Multiplatform / Jetpack Compose + UniFFI и «раздельные» стратегии над Rust-ядром (состояние на октябрь 2026)

Примечание исследователя: сделано около 20 поисковых запросов и загрузок страниц. Цифры по памяти и размеру у всех стеков в основном старые (2020–2022) и получены на демо-приложениях. Свежих воспроизводимых замеров 2025–2026 года для Flutter-десктопа и Compose Desktop я не нашёл. Всё, что старше 2025 года, помечено как **[возможно устарело]**.

## 1. Flutter: зрелость десктопа (Linux/Windows), Impeller, управление проектом

### Takeaway
В Flutter 3.47 (12 августа 2026) Impeller стал рендерером по умолчанию на macOS, Windows и Linux. Официальный блог называет бэкендом для Windows/Linux Vulkan, но открытые issue на GitHub (август 2026) говорят, что Vulkan-компоновщика в Windows-эмбеддере пока нет и Impeller там работает через OpenGL ES. Значит, переход свежий и сырой. Важная новость 2026 года по управлению: на Google I/O 2026 объявили, что ведущим мейнтейнером и «стратегическим стюардом» Flutter-десктопа становится Canonical.

### Cited Findings
- Flutter 3.47, пост от 12 августа 2026: «Impeller becomes the default renderer for macOS, Windows, and Linux». Бэкенды: Metal на macOS, Vulkan на Windows и Linux. Отключить Impeller пока можно: на Windows/Linux — правкой `main.cpp` / `my_application.cc`. При этом «Fallback options will be removed in a future release» (фолбэк на Skia в будущем уберут). Текст на десктопе рендерится через SDF. — [What's new in Flutter 3.47 (flutter.dev)](https://flutter.dev/blog/whats-new-in-flutter-3-47)
- **Противоречие.** Issue #183495 «Design Doc: Impeller Vulkan rendering backend for Linux and Windows desktops» (открыт 11.03.2026, последняя активность 27.08.2026, всё ещё открыт, P2, PR реализации #183382 в статусе draft) утверждает: «Impeller eliminates this [first-frame jank] with ahead-of-time shader compilation but is not available on desktop today». 17.08.2026 к нему как дубликат привязали issue #191175: «Windows: Impeller always runs on OpenGLES; no Vulkan compositor exists in the Windows embedder». — [flutter/flutter#183495](https://github.com/flutter/flutter/issues/183495). Это расходится с формулировкой блога про Vulkan.
- В феврале 2025 PR #162684 добавил возможность включить Impeller на Windows и Linux на этапе компиляции, как опцию. — [flutter/flutter PR #162684](https://github.com/flutter/flutter/pull/162684)
- Что ещё вошло в 3.47 для десктопа: popup-окна на Linux и Windows в рамках экспериментального multi-window API, который делают вместе с Canonical; окна создаются (realize) до первого кадра компоновщика; flavors на Linux; давление и наклон стилуса на Linux; `windowHandle` отдаёт указатель на `GtkWindow`. Пакеты `material_ui` и `cupertino_ui` вышли в 1.0 как отдельные; формальная депрекация встроенных библиотек запланирована на ноябрьский stable. — [flutter.dev blog 3.47](https://flutter.dev/blog/whats-new-in-flutter-3-47)
- Google I/O 2026: Canonical объявлен «new lead maintainer and 'strategic steward' of Flutter desktop for Windows, macOS and Linux» и ведёт его дорожную карту. Это названо первым шагом к более широкому управлению Flutter. Статья OMG! Ubuntu (май 2026, обновлена 1 июня 2026) пишет, что Google этим «сгружает» поддержку платформ, в которые сам вкладывается меньше. — [OMG! Ubuntu](https://www.omgubuntu.co.uk/2026/05/flutter-desktop-canonical-maintained/amp)
- Canonical с 2021 года выбирает Flutter по умолчанию для новых приложений Ubuntu. На нём сделаны App Center, Firmware Updater, Security Center и установщик Ubuntu. — [OMG! Ubuntu](https://www.omgubuntu.co.uk/2026/05/flutter-desktop-canonical-maintained/amp); [Canonical blog «Flutter and Ubuntu so far»](https://canonical.com/blog/flutter-and-ubuntu-so-far)
- В дорожной карте Flutter на 2026 год был пункт «Impeller на десктопе (macOS, Windows, Linux)» (источник вторичный). — [WebArt Design о roadmap 2026](https://webartdesign.com.au/blog/flutters-2026-roadmap-just-dropped-and-its-all-about-finishing-the-job/)

### Inferences
- На Linux Flutter 3.47 только что перешёл на новый рендерер, и в трекере видны нерешённые вопросы про Vulkan. Для проекта, который начинается с Linux и Flatpak (GPU-драйверы внутри песочницы, Mesa из рантайма), это риск на 2026–2027 годы: возможны регрессии на старых и Intel-GPU и в VM. С другой стороны, Canonical как стюард — сильный сигнал, что Linux-десктоп у Flutter будет развиваться лучше, чем раньше.
- Переход руля десктопа к Canonical можно читать двояко: специалист по Linux плюс, но и признак того, что для Google десктоп не в приоритете.

### Gaps
- Не нашёл первичного подтверждения, на чём на самом деле работает Impeller на Linux в 3.47: Vulkan или GLES. Блог и issue расходятся.
- Не нашёл замеров «Impeller vs Skia» на Linux: память, время старта.

## 2. Flutter: RAM и размер пакета (десктоп и Android)

### Takeaway
Свежих замеров нет. Старый, но методичный замер на Linux: около 96–99 МБ (procrank) у пустого `flutter create` и бандл около 18 МБ **[возможно устарело]**. Реальное приложение на Flathub: Spotube 5.1.2 весит 41 MiB на загрузку. На Android у пустого приложения было около 40 МБ (dumpsys) **[устарело]**. По размеру официальная документация даёт только старый пример для iOS: 5,4 МБ на загрузку и 13,7 МБ после установки (Flutter 1.17).

### Cited Findings
- Linux, `flutter build linux --release`, пустое приложение: около 99 МБ (около 96 МБ) по procrank, бандл около 18 МБ. Автор предполагал, что основную долю даёт GTK. — [flutter/flutter#92318](https://github.com/flutter/flutter/issues/92318) **[2021, устарело]**
- Анекдотическое «около 25 МБ» для простого Flutter-приложения на Linux, без методики. — [vercel/hyper discussion #6918](https://github.com/vercel/hyper/discussions/6918)
- Android: пустое приложение около 40 МБ по `dumpsys meminfo`. — [flutter/flutter#48391](https://github.com/flutter/flutter/issues/48391) **[2020, устарело]**
- iOS, Flutter 1.17, демо-приложение: «approximate download size of 5.4 MB and an approximate installation size of 13.7 MB». Цифр для Android в документации нет. `--split-debug-info` «can dramatically reduce code size». — [docs.flutter.dev/perf/app-size](https://docs.flutter.dev/perf/app-size) **[цифры устарели]**
- Spotube (Flutter-клиент музыки) на Flathub: версия 5.1.2, загрузка 41 MiB, около 4 816 загрузок в месяц. — [Flathub: Spotube](https://flathub.org/apps/com.github.KRTirtho.Spotube)
- Посты dasroot.net о том, что 3.38 «снизил память на 20–25 %» («1.2 GB → 950 MB»), без источников. Им не доверять. — [dasroot.net](https://dasroot.net/posts/2026/01/flutter-desktop-applications-building-windows-macos-linux/)

### Inferences
- По порядку величин Flutter-десктоп примерно на уровне Compose Desktop по RAM на старте (около 100 МБ против 108–146 МБ, см. раздел 6) и заметно легче него по размеру дистрибутива (около 18–40 МБ против 50–120 МБ), потому что JVM в комплект не входит. Против pure-Rust тулкитов (Slint, iced и т. п.) Flutter, скорее всего, проигрывает по RAM в несколько раз. Это нужно проверить: сравнительных замеров я не нашёл.
- Для сравнения в итоговом отчёте честнее всего собрать один и тот же экран на каждом стеке и мерить PSS (`smem`) на Linux.

### Gaps
- Нет замеров памяти и размера Flutter 3.4x на Linux/Windows и на Android (APK hello world и реального приложения) за 2025–2026 годы.
- Нет данных о влиянии Impeller на RAM десктопа.

## 3. Flutter: упаковка во Flatpak

### Takeaway
Упаковать можно, но вручную это трудоёмко: сборки Flathub идут офлайн, и каждая зависимость pub.dev и каждый артефакт SDK нужно объявить с контрольной суммой. В 2026 году появились автоматизаторы `flutpak` (Dart) и `flatpak-flutter` (Python). В `flutpak` есть офлайн-сборка Rust/Cargo, которая нужна плагинам на cargokit, а это прямо касается flutter_rust_bridge. Flutter-приложения на Flathub есть (например, Spotube), но, по словам сообщества, их мало.

### Cited Findings
- Пост на форуме Flathub (2 июня 2026): «Flutter apps are underrepresented on Flathub». Каждой зависимости pub.dev нужно два source-элемента: архив и inline-хеш. Артефактам SDK нужны контрольные суммы для x86_64 и aarch64 на конкретной ревизии движка. Bootstrap-скрипт Flutter вызывает `pub upgrade`, и его приходится патчить для офлайна. В поздних версиях `flutpak` добавлена офлайн-сборка Rust/Cargo для плагинов на cargokit. Рантайм — 25.08. — [Flathub Discourse: flutpak](https://discourse.flathub.org/t/introducing-flutpak-automating-flathub-submission-for-flutter-apps/12294)
- `flutpak` пока до 1.0 (0.4.0). — [pub.dev flutpak](https://pub.dev/packages/flutpak/versions/0.4.0)
- Spotube опубликован на Flathub (5.1.2, 41 MiB). — [Flathub: Spotube](https://flathub.org/apps/com.github.KRTirtho.Spotube)

### Inferences
- В связке Flutter + flutter_rust_bridge в Flatpak-манифесте окажутся сразу два офлайн-вендоринга: pub и cargo. Это делается, но при каждом обновлении зависимостей манифест нужно перегенерировать. У pure-Rust тулкита остаётся только cargo-вендоринг (`flatpak-cargo-generator`).

### Gaps
- Не проверил листинг AppFlowy на Flathub и общее число Flutter-приложений там.

## 4. flutter_rust_bridge v2: зрелость

### Takeaway
Это зрелый и активно развивающийся генератор привязок с лицензией MIT: около 5,4 тыс. звёзд, статус Flutter Favorite. Есть async, потоки (Rust Stream → Dart Stream), вызовы Dart из Rust, произвольные непрозрачные типы. Поддерживаются Android, iOS, Windows, Linux, macOS и Web. Почти весь проект держится на одном мейнтейнере (fzyzcjy). Это bus factor.

### Cited Findings
- README v2: настройка одной командой; произвольные типы, включая не сериализуемые и не клонируемые; `async fn`; Rust вызывает Dart; на вход можно подавать целые папки; трейты и trait objects; кодек SSE («several times faster» в части задач); `StreamSink` и итераторы как Dart `Stream`. Платформы: Android, iOS, Windows, Linux, macOS, Web (JS/Wasm). Лицензия MIT. 5,4 тыс. звёзд. «Officially Flutter Favorite». Основной автор — fzyzcjy. — [GitHub fzyzcjy/flutter_rust_bridge](https://github.com/fzyzcjy/flutter_rust_bridge)
- Версии: стабильная линия 2.11.x, беты 2.13.0-beta.6 и 2.14.0-beta.2 на pub.dev. Даты выпусков в выдаче не нашлись. — [pub.dev flutter_rust_bridge 2.14.0-beta.2](https://pub.dev/documentation/flutter_rust_bridge/2.14.0-beta.2/); [2.11.1](https://pub.dev/documentation/flutter_rust_bridge/2.11.1/index.html)

### Inferences
- Под потоки событий плеера (прогресс, состояние p2p, пиры) модель Stream/StreamSink подходит хорошо. Позиция воспроизведения при этом живёт в Rust (cpal), а в UI приходят только снапшоты.

### Gaps
- Не нашёл точной текущей стабильной версии и даты, а также публичного списка крупных продакшен-пользователей.

## 5. Flutter: возможности кастомной отрисовки, a11y, IME на Linux, Liquid Glass, лицензия, Dart и ИИ

### Takeaway
Для визуала Spotless (точечные матрицы, маски, свои шрифты, палитры во время работы) у Flutter самый мощный и самый документированный холст из рассматриваемых стеков. Liquid Glass в официальном Cupertino команда Flutter **не делает и вкладов не принимает**. Есть только сторонние пакеты на нативных platform views или имитация блюром. Доступность на Linux исторически слабая: Ubuntu прямо пишет о проблемах с AT-SPI.

### Cited Findings
- Issue #170310 (Liquid Glass в Cupertino): команда «not developing the new Apple '26 UI design features in the Cupertino library right now, and will not be accepting contributions». В обновлении июля 2025 сказано, что работа пойдёт в отделённые пакеты. — [flutter/flutter#170310](https://github.com/flutter/flutter/issues/170310)
- В посте о 3.47 Liquid Glass и iOS 26 не упоминаются; `cupertino_ui` 1.0 вышел как отдельный пакет. — [flutter.dev blog 3.47](https://flutter.dev/blog/whats-new-in-flutter-3-47)
- Сторонние варианты: `cupertino_native_plus` и `cupertino_native_better` оборачивают нативные компоненты iOS 26+ через platform views. Известная проблема: тень и ореол нативного вида «просвечивают» через листы и попапы, нужен route observer. `adaptive_platform_ui` показывает Liquid Glass на iOS 26+, Cupertino на старых версиях и Material на Android. — [cupertino_native_plus](https://github.com/NarekManukyan/cupertino_native_plus); [cupertino_native_better](https://pub.dev/packages/cupertino_native_better); [adaptive_platform_ui](https://pub.dev/packages/adaptive_platform_ui)
- Доступность на Linux: документация Ubuntu говорит, что у движка Flutter «compatibility issues with AT-SPI». Linux-оболочка Flutter реализована на ATK. — [Ubuntu Desktop docs: Accessibility stack](https://documentation.ubuntu.com/desktop/en/latest/explanation/accessibility-stack); [docs.flutter.dev assistive technologies](https://docs.flutter.dev/ui/accessibility/assistive-technologies.html)
- В 3.47 по доступности: на Android учитываются high contrast и инверсия цветов; семантика `Text.rich` идёт в порядке раскладки; `BlockSemantics` блокирует фокус. — [flutter.dev blog 3.47](https://flutter.dev/blog/whats-new-in-flutter-3-47)
- Рендеринг: в 3.47 на десктопе включён SDF-текст. На macOS по умолчанию широкий цветовой охват. — [flutter.dev blog 3.47](https://flutter.dev/blog/whats-new-in-flutter-3-47)

### Inferences
- Из фоновых знаний, в этой сессии не перепроверялось: в Flutter есть `CustomPainter`, `FragmentProgram` (пользовательские GLSL-шейдеры), `ShaderMask`, `BackdropFilter`, градиенты, произвольные шрифты из ассетов. Этого хватает и на «обложку точками» по маске, и на DotBar. Лицензия фреймворка — BSD-3-Clause, совместима с AGPL. Dart хорошо представлен в обучающих данных ИИ-ассистентов (большой открытый корпус Flutter-кода), но в этом поиске объективных метрик качества ИИ на Dart я не нашёл.
- Для iOS-концепта «Liquid Glass с подходом Дурова» (стекло только у плавающих элементов) на Flutter придётся либо имитировать стекло через `BackdropFilter`, а это не системное стекло, либо врезать нативные platform views с известными проблемами наложения.

### Gaps
- Не нашёл конкретных данных о состоянии IME (fcitx/IBus) у Flutter на Linux в 2026 году.
- Не нашёл измеримых данных о том, насколько хорошо ИИ-ассистенты пишут на Dart.

## 6. Compose Multiplatform: десктоп на JVM (RAM, старт, размер), нативный десктоп, iOS

### Takeaway
Десктоп в Compose Multiplatform по-прежнему работает **только на JVM**. Нативного (Kotlin/Native) десктопного таргета для Compose в 2026 году нет. Текущая версия — 1.12.x (август 2026), 1.13 в бете. Официальный FAQ называет Compose стабильным на Android, iOS и десктопе. Замеры старые: пустое окно занимает 108 МБ (macOS) и 146 МБ (Linux), причём почти вся память нативная, вне Java-кучи. Дистрибутив с JRE — около 50–120 МБ.

### Cited Findings
- Hello World на Compose Desktop: около 108 МБ на macOS и около 146 МБ на Linux. Ограничение кучи до 30 МБ почти ничего не меняет, то есть основную память занимает нативная часть (Skia, JVM). — [JetBrains/compose-multiplatform#1632](https://github.com/JetBrains/compose-multiplatform/issues/1632) **[около 2021–2022, устарело]**
- Windows 10: около 134 МБ на старте, около 234 МБ после перетаскивания окна. — [compose-jb#2436](https://github.com/JetBrains/compose-jb/issues/2436) **[устарело]**. Одно окно — около 90 МБ, десять окон — около 490 МБ. — [compose-jb#1460](https://github.com/JetBrains/compose-jb/issues/1460) **[устарело]**
- Размер: пустой шаблон на Apple silicon — `.app` около 124 МБ и `.dmg` около 65 МБ; с ProGuard — около 110 и 52 МБ; с обфускацией — около 106 и 48 МБ. — [DEV Community: Compose for Desktop app size](https://dev.to/coltonidle/compose-for-desktop-app-size-comparison-3d8h). По умолчанию в пакет попадает полный JDK (200+ МБ); если перечислить `modules`, остаётся около 60 МБ. Переход с Electron дал около 400 → 120 МБ RAM (единичный случай). — [xckevin.com](https://xckevin.com/en/blog/compose-multiplatform-desktop-jvm-window-platform-interop/)
- Нативного десктопа нет: в ветке Kotlin Discussions говорят, что шаблон десктопа работает на JVM, а Compose-библиотеки не собираются под Linux/Windows native. — [Kotlin Discussions](https://discuss.kotlinlang.org/t/compose-for-native-linux-windows-app/30235) **[около 18 месяцев назад]**
- Версии: 1.12.1 — актуальный релиз; минимальные платформы — macOS 13 arm64 и Ubuntu 20.04 (x86-64, arm64). — [kotlinlang.org: Compatibility and versions](https://kotlinlang.org/docs/multiplatform/compose-compatibility-and-versioning.html). На странице Android KMP в октябре 2026 — 1.13.0-beta01. — [developer.android.com/kotlin/multiplatform](https://developer.android.com/kotlin/multiplatform)
- FAQ: Compose «Stable for Android, iOS, and desktop». — [kotlinlang.org FAQ](https://kotlinlang.org/docs/multiplatform/faq.html)
- Compose Multiplatform 1.12.0 (блог JetBrains, 26 августа 2026): MCP-сервер в Compose Hot Reload (экспериментальный), экспериментальный API окон и диалогов v2 для десктопа, улучшенная прокрутка lazy-раскладок на iOS, Skia M150, автоматический fallback на Noto в вебе. Про нативный десктоп, память и размер, AOT/CDS, доступность на Linux, Flatpak и Liquid Glass там ничего нет. — [JetBrains Blog: CMP 1.12.0](https://blog.jetbrains.com/kotlin/2026/08/compose-multiplatform-1-12-0/); [What's new 1.12](https://kotlinlang.org/docs/multiplatform/whats-new-compose-112.html)
- Жалоба на производительность десктопа (YouTrack CMP-6570 «compose very poor performance on desktop»). — [YouTrack CMP-6570](https://youtrack.jetbrains.com/projects/CMP/issues/CMP-6570/compose-very-poor-performance-on-desktop)

### Inferences
- Для владельца, которому неприятны «браузерные» аппетиты, JVM-десктоп с RSS 110–150+ МБ на пустом окне и дистрибутивом 50–120 МБ ближе к Electron, чем к Slint. К тому же Rust-ядро придётся связывать с JVM через JNA или JNI, а это ещё один рантайм в процессе.
- Compose Multiplatform убедителен как «один UI на Android и iOS», но не как лёгкий десктоп.

### Gaps
- Нет свежих (2025–2026) замеров RAM и времени старта Compose Desktop на актуальном JDK (21/25), в том числе с CDS или AppCDS.
- Не нашёл Compose Desktop-приложений на Flathub и описаний опыта их упаковки.
- Не нашёл данных о доступности Compose Desktop на Linux (AT-SPI через Java Access Bridge?) и о поддержке IME.
- Не нашёл, есть ли в CMP на iOS встроенная поддержка Liquid Glass.

## 7. Jetpack Compose на Android: размер и память

### Takeaway
Официальное исследование Google на примере Sunflower: в минифицированном релизе с R8 только Views весит 2 252 КБ, смесь — 3 034 КБ, только Compose — 2 966 КБ. Переход на Compose добавляет около 0,7–0,8 МБ. Официальных замеров RAM нет.

### Cited Findings
- Sunflower: размер загрузки 2 252 КБ у Views, 3 034 КБ у смеси, 2 966 КБ у чистого Compose. Сборка медленнее: 299 → 399 мс (среднее). — [developer.android.com: Compare Compose and View metrics](https://developer.android.com/develop/ui/compose/migrate/compare-metrics)
- Compose приносит весь рантайм с собой, а Views используют системную реализацию. — [Kotlin Slack (старое)](https://slack-chats.kotlinlang.org/t/513956/i-just-noticed-a-big-apk-size-increase-from-dev13-to-dev14-s) **[около 2020, устарело]**

### Inferences
- На Android нативный Jetpack Compose даёт самый маленький APK из всех вариантов: без своего движка, только `.so` Rust-ядра на ABI. Системная интеграция (MediaSession, Media3, уведомление плеера, Predictive Back, хаптика) там «из коробки». Для фонового аудио это важно.

### Gaps
- Нет официальных замеров RAM для Compose и для сравнения с Flutter на Android.

## 8. UniFFI: зрелость Kotlin- и Swift-привязок

### Takeaway
UniFFI (Mozilla) — фактический стандарт для «Rust-ядро → Kotlin/Swift». Версия 0.32.0 вышла 30.06.2026, всё ещё до 1.0 и с ломающими изменениями. Его используют Bitwarden SDK и matrix-rust-sdk (Element X). Kotlin-привязки по умолчанию идут через JNA. Появился экспериментальный JNI-бэкенд, который заметно быстрее.

### Cited Findings
- CHANGELOG: v0.32.0 (2026-06-30). Ломающее изменение: Kotlin и Python теперь не генерируют привязки для async primary constructors. `#[uniffi::export(async_runtime = "tokio")]` теперь работает для трейтов. В proc-macros появилась поддержка HashSet. 0.31.2: исправлены возвращаемые значения u8/u16 через JNA direct-mapping на Android ARM32 и async-функции, возвращающие RustBuffer. В Unreleased — экспериментальный `uniffi-bindgen-kotlin-jni` («large improvements in performance», «very fresh so use at your own risk»). — [uniffi-rs CHANGELOG](https://github.com/mozilla/uniffi-rs/blob/main/CHANGELOG.md)
- Документация по Kotlin-конфигурации и Gradle (0.30/0.31). — [uniffi-rs 0.31 Kotlin Gradle](https://mozilla.github.io/uniffi-rs/0.31/kotlin/gradle.html)
- matrix-rust-sdk: `matrix-sdk-ffi` и `matrix-sdk-crypto-ffi` — привязки на UniFFI для Swift (iOS) и Kotlin (Android). Element использует SDK в Element X для iOS и Android. Timeline API реактивный и наблюдаемый. — [Слайды Matrix Conference 2024, B. Bouvier «Rust SDK Foundation»](https://conference.matrix.org/documents/talk_slides/LAB3%202024-09-20%2011_15%20Benjamin%20Bouvier%20-%20Rust%20SDK%20Foundation.pdf) **[2024]**
- Bitwarden: внутренний SDK на Rust — «single source of truth» бизнес-логики. Привязки для iOS и Android делаются через UniFFI, для веба — через wasm. Клиенты отвечают за UI и интеграции с платформой. — [Bitwarden contributing: SDK Architecture](https://contributing.bitwarden.com/architecture/sdk); [Internal SDK](https://contributing.bitwarden.com/architecture/sdk/internal)

### Inferences
- UniFFI подходит под ядро Spotless: async (tokio), callback-интерфейсы для событий плеера и сети, объекты с методами. Версия до 1.0, так что при обновлениях стоит ждать мелких поломок.

### Gaps
- Не нашёл замеров накладных расходов JNA на частых вызовах (например, обновление прогресса 60 раз в секунду). Выход — снижать частоту вызовов на стороне Rust.

## 9. «Раздельная» стратегия: свой UI на каждой платформе над общим Rust-ядром

### Takeaway
Именно так устроены крупные продукты с Rust-ядром: Bitwarden (нативные Swift и Kotlin над Rust SDK через UniFFI, GA в январе 2025), Element X (iOS и Android над matrix-rust-sdk через UniFFI), Signal (libsignal на Rust, но со своими JNI/C/Node-мостами, а не UniFFI). Плюсы — максимально нативное ощущение и интеграция с системой, тонкий клиент. Минусы — два-три полноценных UI-кодбейса, и каждую мелочь дизайна «Точки» придётся переписывать и выверять на каждой платформе.

### Cited Findings
- Bitwarden объявил GA нативных мобильных приложений (Swift на iOS, Kotlin на Android) в январе 2025. — [Help Net Security](https://www.helpnetsecurity.com/2025/01/17/bitwarden-native-mobile-applications/). Логику держит общий Rust SDK, а UI и интеграции с платформой — клиенты. — [Bitwarden SDK Architecture](https://contributing.bitwarden.com/architecture/sdk)
- Element X (iOS/Android) работает над matrix-rust-sdk через `matrix-sdk-ffi` (UniFFI → Swift/Kotlin). — [Matrix Conference slides](https://conference.matrix.org/documents/talk_slides/LAB3%202024-09-20%2011_15%20Benjamin%20Bouvier%20-%20Rust%20SDK%20Foundation.pdf)
- libsignal: ядро на Rust для Android, iOS и Desktop (и для сервера). Java, Swift и TypeScript-обёртки построены поверх JNI, C и Node-мостов, которые сгенерированы своими макросами `#[bridge_fn]`/`#[bridge_io]`, а не UniFFI. Мосты нестабильны, использование вне Signal не поддерживается. — [GitHub signalapp/libsignal (зеркало)](https://github.com/multiversx/signalapp-libsignal)
- Flutter-аналог раздельного подхода: Canonical делает Flutter только для десктопа Ubuntu, а Flutter-десктопом теперь руководит сам Canonical. — [OMG! Ubuntu](https://www.omgubuntu.co.uk/2026/05/flutter-desktop-canonical-maintained/amp)

### Inferences
- Для Spotless разумный вариант раздельного подхода: Linux и Windows — pure-Rust тулкит (Slint, как в CLAUDE.md), ядро вызывается напрямую без FFI; Android — Jetpack Compose + UniFFI (лучшая поддержка MediaSession, жестов и хаптики, самый маленький APK); iOS — SwiftUI + UniFFI (настоящий Liquid Glass системными средствами). Цена — три UI-кодбейса и три реализации каждого жеста и виджета.
- Чтобы дизайн совпадал между платформами, нужен единый источник токенов: экспорт CSS-переменных прототипа в JSON (уже есть в планах P1) и генерация из него Slint-глобалов, `Color`-объектов Compose и Swift-ассетов. Прототип при этом остаётся эталоном для попиксельного сравнения.
- Для одного разработчика, который к тому же сам пишет бэкенд, три UI заметно дороже, чем Flutter (один UI на все платформы + flutter_rust_bridge). Дешевле всего промежуточный вариант: Slint на десктопе плюс Compose на Android, а iOS отложить.
- Element X и Bitwarden — команды из десятков людей. Прямой аналог проекта одного человека со всеми тремя нативными UI я не нашёл.

### Gaps
- В этой сессии не проверял Mozilla app-services (Firefox Android/iOS) и 1Password (Rust-ядро) как примеры.
- Не нашёл публичных разборов того, как Element или Bitwarden держат дизайн единым между платформами и сколько людей работает над каждым клиентом.
