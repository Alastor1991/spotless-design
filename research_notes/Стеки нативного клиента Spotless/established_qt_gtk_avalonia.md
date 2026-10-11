# Устоявшиеся тулкиты с ядром на Rust: Qt 6/QML + cxx-qt, GTK4/libadwaita + gtk-rs/relm4, Avalonia (.NET) + Rust через FFI (состояние на октябрь 2026)

Примечание к методике: проведено ~17 поисков и загрузок. Где источник старше 2025 года, это отмечено как «возможно устарело». Отдельные утверждения из фоновых знаний, которые в этой сессии не подтверждены источником, вынесены в «Выводы» с пометкой «не проверено» или в «Пробелы».

## 1. Зрелость Rust-привязки (2026)

### Takeaway
cxx-qt (KDAB) активно развивается, но всё ещё до 1.0: 0.8 вышла в декабре 2025, 0.9 в июне 2026, 0.10 в августе 2026, и между минорными версиями API ломается. Связка gtk-rs/relm4 зрелая и стабильно выпускается: relm4 0.11, gtk4-rs 0.11, libadwaita-rs 0.9. Для Avalonia своей привязки к Rust нет: стык делается через C ABI (csbindgen или uniffi-bindgen-cs, это сторонний генератор) и P/Invoke, то есть получается двуязычный проект Rust + C#.

### Cited Findings
**cxx-qt**
- Даты выпусков: 0.7.0 — 2024-10-30 (0.7.1 — 2025-03-04, 0.7.2 — 2025-04-28); 0.8.0 — 2025-12-18 (0.8.1 — 2026-02-16); 0.9.0 — 2026-06-23 (0.9.1 — 2026-07-03); 0.10.0 — 2026-08-24 — [CHANGELOG cxx-qt](https://github.com/KDAB/cxx-qt/blob/main/CHANGELOG.md)
- Проект заявляет SemVer, но ломающие изменения идут в каждой минорной версии. В 0.7 из сгенерированных QObject убрали блокировки, и теперь «Qt/User C++ code is responsible for upholding Rusts Safety guarantees». В 0.8 `CxxQtBuilder::cc_builder` стал unsafe, и часть возможностей сборщика убрали. В 0.8.1 поменялась сигнатура `QObjectExt::set_parent`. В 0.9 поддержка минимальной установки Qt помечена как experimental — [CHANGELOG cxx-qt](https://github.com/KDAB/cxx-qt/blob/main/CHANGELOG.md)
- Возможности для QML: 0.8 добавила поддержку qmllint/qmlls (генерация `.qmlls.ini`), динамические плагины QML-модулей через CMake и многокрейтовые проекты Cargo/CMake. 0.9 добавила привязки `QQmlImageProviderBase` и `QQmlEngine::addImageProvider` (это важно, чтобы отдавать обложки из Rust). 0.10 — `QJsonArray`/`QJsonObject`, перечисления `ItemFlag`/`ItemDataRole` (нужны для моделей списков) — [CHANGELOG cxx-qt](https://github.com/KDAB/cxx-qt/blob/main/CHANGELOG.md)
- Поддерживаются Qt 5.15 LTS и все версии Qt 6, по умолчанию Qt 6. Сборка двумя путями: через CMake (Corrosion импортирует Rust-крейт как статическую библиотеку) или только через Cargo (build.rs собирает ресурсы Qt). Для статической линковки Qt 6 нужна фича `link_qt_object_files` — [cxx-qt README / книга](https://github.com/KDAB/cxx-qt), [Building with Cargo](https://kdab.github.io/cxx-qt/book/getting-started/4-cargo-executable.html)
- В README сказано: CXX-Qt проверяется в CI на Linux, Windows, macOS и WebAssembly; на других платформах, которые поддерживают и Qt, и Rust, он «should work», но регулярно не тестируется — [KDAB/cxx-qt README](https://github.com/KDAB/cxx-qt/blob/main/README.md)
- Rust Foundation опубликовала материал о практике связки Rust и Qt во встраиваемых системах; это признак того, что связку используют в промышленности — [Rust Foundation](https://rustfoundation.org/media/best-practices-for-integrating-rust-and-qt-in-embedded-systems/)

**gtk-rs / relm4**
- Последний выпуск relm4 — 0.11.0 от 8 апреля 2026. До него: 0.10.1 (29.12.2025) и 0.10.0 (01.09.2025). relm4 0.11 зависит от gtk4 ^0.11.2 и libadwaita ^0.9.1, MSRV — 1.93 — [lib.rs relm4](https://lib.rs/crates/relm4), [libraries.io relm4](https://libraries.io/cargo/relm4)
- Сборка документации relm4 0.11.0 на docs.rs провалилась, последняя успешная — 0.10.0 — [docs.rs relm4](https://docs.rs/crate/relm4/latest)

**Avalonia и Rust**
- uniffi-bindgen-cs — генератор C# для UniFFI. Это отдельный от uniffi-rs проект, и его версия должна совпадать с версией UniFFI. Генератор берёт метаданные из UDL или из собранной библиотеки и сам генерирует управление памятью, ошибки и async — [uniffi-bindgen-cs (форк)](https://github.com/Nordgit1/uniffi-bindgen-cs), [docs.rs](https://docs.rs/pileks_uniffi-bindgen-cs/latest/uniffi_bindgen_cs/)
- csbindgen генерирует C#-объявления FFI из Rust для .NET и Unity. Обе утилиты — «тонкие» генераторы: они прячут сложность FFI, и из-за этого ошибки труднее отлаживать — [lib.rs FFI](https://lib.rs/development-tools/ffi), [ScyllaDB, 2026-08-31](https://www.scylladb.com/2026/08/31/async-ffi-framework-for-rust-c-interop/)
- ScyllaDB в августе 2026 описала, как пришлось написать собственный async-FFI-фреймворк для Rust↔C#. Это говорит о том, что готовые генераторы не закрывают сложный async — [ScyllaDB](https://www.scylladb.com/2026/08/31/async-ffi-framework-for-rust-c-interop/)

### Inferences
- cxx-qt рабочий и поддерживается KDAB (коммерческой Qt-консалтинговой компанией), но при обновлении придётся переписывать мост примерно раз в полгода. Для владельца, который сам пишет ядро, это терпимо: мост — тонкий слой.
- В случае Avalonia владелец пишет ядро на Rust, а интерфейс получается на C#/XAML. Это второй язык, и к нему добавляется граница FFI для асинхронных потоков данных: прогресс трека, события p2p.
- Не проверено: у gtk-rs есть официальная книга «GUI development with Rust and GTK 4», и среди трёх вариантов это самая «родная» для Rust экосистема.

### Gaps
- Точная дата выпуска gtk4-rs 0.11 и даты выпусков libadwaita-rs не найдены.
- Нет сведений о том, есть ли у cxx-qt дорожная карта к 1.0.
- Нет готового шаблона или руководства «Avalonia + Rust».

## 2. Поддержка платформ (Linux, Windows, Android, iOS)

### Takeaway
Qt охватывает все четыре платформы, но связка cxx-qt + Android/iOS официально не тестируется. GTK на Android только появляется: экспериментальный бэкенд с GTK 4.18, iOS нет. В Avalonia 12 Android переписан с нуля, iOS работает, но сами разработчики называют мобильные платформы самой молодой целью.

### Cited Findings
- Android и iOS не упоминаются ни в одной записи CHANGELOG cxx-qt с 0.7 по 0.10. В CI нет Android — [CHANGELOG](https://github.com/KDAB/cxx-qt/blob/main/CHANGELOG.md), [README](https://github.com/KDAB/cxx-qt/blob/main/README.md)
- В GTK 4.18 (начало 2025) объявлен новый Android-бэкенд, «not yet complete», но с ним GTK-приложения уже можно запускать на Android — [OSNews](https://www.osnews.com/story/141670/gtk-announces-x11-deprecation-new-android-backend-and-much-more/)
- PR #2144 в node-gi (10 октября 2026) запускает GTK4 и libadwaita на Android из воркера NativeScript. Там же отмечено, что Android-бэкенд инициализируется вызовом `gdk_android_initialize(env, loader, context)` и что этот путь неудобен для внешних хостов — [gjsify PR #2144](https://github.com/gjsify/gjsify/pull/2144)
- В gtk4-rs есть открытый запрос «Support building application for Android» — [gtk4-rs issue #1997](https://github.com/gtk-rs/gtk4-rs/issues/1997)
- Avalonia 12: Android-бэкенд «completely rebuilt», запуск с NativeAOT заявлен как в 4 раза быстрее, чем в v11 (утверждение вендора, без методики) — [avaloniaui.net/avalonia](https://avaloniaui.net/avalonia)
- Мобильная Avalonia работает на .NET 10, на iOS используется scene-based lifecycle. Архитектуры: iOS — ARM64; Android — ARM64, ARM32, x64. Всё рисуется через Skia на GPU, на iOS — через Metal. Мобильные платформы — «the youngest of Avalonia's targets», сторонних контролов для телефонов меньше, чем для компьютера. Нативные вью (WebView, карты) всегда лежат поверх поверхности Avalonia — [Avalonia mobile](https://avaloniaui.net/avalonia/mobile)
- Для Android 15+ нужны страницы памяти 16 КБ. Avalonia 12 — это по сути «v11 with SkiaSharp 3 enabled by default», и без этого Android-приложения не получится обновить в Play — [блог Avalonia](https://avaloniaui.net/blog/preparing-your-avalonia-apps-for-android-s-16-kb-page-size-requirement)

### Inferences
- Для порядка «Linux → Windows → Android → iOS» на Linux и Windows годятся все три. Android: у Qt зрелая платформа, но Rust-часть через cxx-qt придётся собирать самим (NDK, линковка статической библиотеки в APK) без официального примера. GTK на Android для продукта в 2026 году не годится. Avalonia на Android работает, но ядро на Rust надо собрать как .so под каждую ABI и подключить через P/Invoke.
- Не проверено: Qt for Android и Qt for iOS — штатные платформы Qt 6, приложения на Qt Quick выпускаются в Play и App Store.

### Gaps
- Не найдено ни одного публичного примера или отчёта «cxx-qt на Android» или «cxx-qt на iOS» 2025–2026 годов.
- Нет данных о жестах, тактильном отклике и нижних листах в Avalonia Mobile: на странице о мобильной версии касания не описаны.
- Состояние Android-бэкенда GTK на GTK 4.20/4.22 (2026) не уточнено.

## 3. Flatpak: рантаймы и размер

### Takeaway
Для Qt есть рантайм org.kde.Platform, для GTK — org.gnome.Platform. Каждый при первой установке весит сотни мегабайт (около 270–380 МБ загрузки, около 700 МБ на диске), но рантайм делят все приложения на нём, а обновления приходят дельтами. Avalonia обычно идёт на freedesktop-рантайме со своим .NET или с NativeAOT-бинарником.

### Cited Findings
- org.kde.Platform 6.6: загрузка «< 325.0 MB», плюс локали «< 380.6 MB» (частичная загрузка) — [Rocky Linux docs PR](https://github.com/rocky-linux/documentation/pull/2030/files)
- KDE 5.15-23.08: загружено 272,9 из 340,5 МБ — [Gentoo forums](https://forums.gentoo.org/viewtopic-p-8847051.html?sid=09253781849f20d8415c74d589a2e869) (данные 2023–2024, возможно устарели)
- GNOME 43: «< 325.2 MB», но реально скачалось 4 кБ: Flatpak обновляет дельтами — [Linux Mint forums](https://forums.linuxmint.com/viewtopic.php?t=389993) (2022, возможно устарело)
- org.gnome.Platform 41 занимает на диске 715 МБ — [Will Thompson, блог GNOME](https://blogs.gnome.org/wjjt/tag/flatpak/) (возможно устарело)
- Flatpak-приложения на GTK4 не подхватывают системные GTK3-темы вроде adw-gtk3, а пользовательский CSS требует доступа к `xdg-config/gtk-4.0`. Для нас это плюс: внешний вид не зависит от системы — [adw-gtk3 README](https://github.com/lassekongo83/adw-gtk3/blob/main/README.md), [FOSTips](https://fostips.com/customize-gtk4-app-window-colors/)

### Inferences
- Пользователю GNOME-рантайм часто уже стоит (его используют многие приложения Flathub), поэтому GTK-приложение для него — самое лёгкое по загрузке. KDE-рантайм на не-KDE системах — дополнительные ~300 МБ при первой установке. Сам пакет приложения в обоих случаях — единицы или десятки МБ.
- Для владельца, который не любит «тяжёлые» приложения: в Flatpak вес рантайма делится между приложениями, но для пользователя без KDE-приложений Qt-клиент по первой загрузке «весит» как Electron-приложение.

### Gaps
- Нет точных цифр для текущих версий рантаймов (KDE 6.9/6.10, GNOME 49/50), этих данных нет в выдаче.
- Нет данных о размере Flatpak-пакета Avalonia-приложения и о том, ставится ли .NET как extension (org.freedesktop.Sdk.Extension.dotnet) или всё собирается в AOT.

## 4. Память и размер пакетов: измерения

### Takeaway
Свежих сопоставимых замеров RSS трёх тулкитов нет. Есть только старые и разнородные цифры: пустое окно Qt — 17 МБ приватной памяти, GTK3 — 5 МБ, Electron — 74,6 МБ (2019); приложение на Qt Quick — 28–60 МБ RSS (форумы, эпоха Qt 5); Avalonia NativeAOT — бинарник ~18 МБ и ~20 МБ памяти (данные шаблона на Windows). Все три тулкита на порядок легче Electron в пустом окне, но реальную цифру даёт только свой замер.

### Cited Findings
- Замер 2019 года (Ubuntu 19.04, ksysguard, приватная память, пустое окно; автор сам называет метод «not scientific at all»): GDK — 1,2 МБ; Gtk+3 — 5,0 МБ; Qt — 17 МБ; Mono WinForms — 16,6 МБ; Java Swing — 59,3 МБ; Electron — 74,6 МБ; JavaFX — 80 МБ; Flutter Desktop — 98 МБ (debug). GTK4 и Avalonia не измерялись — [szibele.com](https://szibele.com/memory-footprint-of-gui-toolkits/) (2019, устарело)
- По данным блога Qt, память QML-движка в примере Qt Quick Controls сократилась с 36,3 МБ (Qt 5.6.3) до 18,5 МБ (5.9.7) и 13,0 МБ (5.12 с предкомпилированным QML). Это только движок, не весь RSS — [блог Qt, 2018](https://www.qt.io/blog/2018/11/16/qt-quick-performance-improvements-qt-5-12-lts) (устарело)
- На форуме Qt разработчики пишут, что два их приложения на Qt Quick 2 занимают 40–60 МБ; простое QML-приложение с Image — 28,7 МБ (macOS Activity Monitor); одна картинка на 50 МБ раздула память до 1,39 ГБ — [forum.qt.io](https://forum.qt.io/topic/105738/why-is-qml-image-taking-up-so-much-memory-slowing-down-application/5), [forum.qt.io](https://forum.qt.io/topic/25330/memory-footprint-of-qml-applications) (старое)
- Qt 6 «may well consume a little more memory than Qt 5», потому что кода и функций стало больше — [блог Qt](https://www.qt.io/blog/qt-performance-and-tools-update)
- Шаблон Avalonia NativeAOT: исполняемый файл ~18 МБ, установщик NSIS ~13 МБ, около 20 МБ памяти — [lixinyang123/AvaloniaAOT](https://github.com/lixinyang123/AvaloniaAOT). Однофайловый AOT с UPX — около 15 МБ — [peaceshi/Avalonia-NativeAOT-SingleFile](https://github.com/peaceshi/Avalonia-NativeAOT-SingleFile)
- Минимальное приложение Avalonia без AOT (2022): 58,2 МБ в распакованном виде и 25 МБ в архиве; с тримингом — 37,4 и 16,1 МБ — [Avalonia discussion #9217](https://github.com/AvaloniaUI/Avalonia/discussions/9217) (устарело). Руководство по публикации на Linux оценивает self-contained без AOT в «~145MB+ RAM» (без проверяемой методики) — [codingisamazing.com](https://codingisamazing.com/complete-avalonia-ui-linux-publishing-guide-with-native-aot/)
- Avalonia, Windows, список из 100 элементов — около 85 МБ (без методики) — [DEV Community](https://dev.to/ironsoftware/avalonia-vs-maui-in-net-10-which-should-you-choose-1bbg)

### Inferences
- Для музыкального приложения с обложками основную память занимают картинки: текстуры и кэш изображений. Выбор тулкита на этом фоне значит меньше, чем дисциплина с кэшем обложек: даунскейл до размера на экране, ленивая загрузка в виртуализированных списках.
- Если сравнивать с чистыми Rust-тулкитами, нужно один раз прогнать один и тот же макет (например, «Главную» Spotless) на каждом стеке и мерить PSS/USS через smaps_rollup на одной машине. Опубликованные цифры несопоставимы.

### Gaps
- Не найдено ни одного замера RSS или PSS приложения на GTK4 или libadwaita за 2024–2026 годы.
- Не найдено замеров Qt 6 Quick hello world за 2025–2026 годы.
- Нет цифр по Avalonia 12 на Linux (AOT): ни размера, ни RSS.
- Нет данных о размере APK для Qt Quick + cxx-qt и для Avalonia Android.

## 5. Свобода собственного дизайна (градиенты, маски, тени, размытие, шейдеры, шрифты, анимации)

### Takeaway
QML — самый гибкий из трёх для «своего» визуального языка: всё рисуется в сцене, есть шейдеры и MultiEffect, свои стили контролов. Avalonia по свободе близка к нему: всё рисует Skia, есть стили и шаблоны в духе WPF и анимации. GTK4 и libadwaita по устройству сопротивляются полностью своему дизайну: CSS — подмножество, а libadwaita навязывает свою базовую тему. Полностью свой вид в GTK — это либо борьба с Adwaita, либо отказ от libadwaita и рисование виджетов вручную (GtkSnapshot).

### Cited Findings
- libadwaita ставит свой базовый стиль, чтобы приложения не конфликтовали с пользовательской темой; добавочный CSS ложится поверх и «will likely conflict» с ним — [GNOME Discourse](https://discourse.gnome.org/t/why-and-how-libadwaita-prevents-theming/17079?page=2)
- Единственный поддерживаемый пользовательский рычаг libadwaita — переопределения `@define-color`, которые читаются только при старте процесса — [omarchy issue #7557](https://github.com/omacom/omarchy/issues/7557)
- Инструменты вроде Gradience с произвольным CSS «may not work properly and even break some programs» — [FOSTips](https://fostips.com/customize-gtk4-app-window-colors/)
- Avalonia сама рисует все контролы через Skia на GPU, без UIKit и Android-виджетов. Одна и та же XAML-разметка выглядит одинаково на iOS, Android и компьютере — [Avalonia mobile](https://avaloniaui.net/avalonia/mobile)
- В Qt 6 есть модуль Qt Lottie Animation (под GPL) и Qt Canvas Painter (в списке модулей Qt 6.12, тоже GPL) — [doc.qt.io Licensing](https://doc.qt.io/qt-6/licensing.html)
- cxx-qt 0.9 добавил `QQmlImageProvider` — так Rust может сам отдавать картинки (обложки, точечные маски) в QML — [CHANGELOG](https://github.com/KDAB/cxx-qt/blob/main/CHANGELOG.md)

### Inferences (из фоновых знаний, источник в этой сессии не получен — проверить)
- Не проверено: в Qt 6.5+ есть `MultiEffect` (размытие, тень, маска, цвет); есть `ShaderEffect` с шейдерами через qsb (Vulkan, Metal, D3D, GL через RHI); `Shape` с градиентами; `FontLoader` для своих шрифтов (Geist, Doto); `Behavior`, `NumberAnimation`, `State` и `Transition` для анимаций; `ListView` и `TableView` с виртуализацией. Container queries нет, но адаптивность от 640 до 1440 px делается привязками к `width`. Точечная матрица (`DotBar`) и «обложка точками» хорошо ложатся на `Repeater` или `ShaderEffect`.
- Не проверено: в GTK4 CSS нет свойств раскладки (нет flex/grid в CSS, раскладка задаётся контейнерами-виджетами); `box-shadow`, градиенты, `border-radius`, `filter` и переходы поддерживаются частично. Свои шейдеры есть через GskGLShader, но он объявлен устаревшим в 4.16 (проверить). Сложные вещи рисуются через `GtkSnapshot` в собственном виджете. Смена семи палитр на лету — через подмену `CssProvider`; так делают многие приложения.
- Не проверено: в Avalonia есть стили с селекторами, ControlTheme, переходы, `OpacityMask`, `BoxShadow`, градиентные кисти, эффекты (`BlurEffect`, `DropShadowEffect`) и SkSL-шейдеры через собственный рендер Skia. Смена тем на лету — через `ResourceDictionary` и `ThemeVariant`.
- Для дизайна «Точки» (чёрный фон, точечные бары, Doto, скругления 28 px, 7 палитр как токены) QML и Avalonia подходят почти один в один: токены становятся singleton-объектом или ресурсами. В GTK нужно отказаться от виджетов и стилей Adwaita и стилизовать всё самим поверх голого GTK4 CSS — работоспособно, но против течения.

### Gaps
- Не получены первичные страницы документации Qt MultiEffect, GTK4 CSS properties и стилей Avalonia с точными списками поддерживаемых свойств.

## 6. Доступность, IME, кириллица

### Takeaway
В этой сессии проверенных источников не собрано. По фоновым знаниям все три поддерживают кириллицу и IME на компьютере; доступность (AT-SPI, UIA) зрелая у Qt и GTK, у Avalonia есть, но слабее на Linux. Это нужно проверить.

### Cited Findings
- Источников по этому вопросу в рамках лимита найти не удалось.

### Inferences (не проверено)
- Qt: AT-SPI на Linux, UIA на Windows, TalkBack/VoiceOver через Qt Accessibility; IME через платформенные плагины (ibus/fcitx). Qt Virtual Keyboard — под GPL, на телефоне не нужен.
- GTK4: доступность переписана в GTK 4 (AT-SPI по D-Bus), IME через ibus/fcitx (im-modules), кириллица и HarfBuzz/Pango на высоком уровне.
- Avalonia: UIA на Windows; поддержка AT-SPI на Linux появилась позже и, по отзывам, неполная. Проверить для 12.x.

### Gaps
- Нужна проверка: состояние AT-SPI в Avalonia 12 на Linux; доступность QML-контролов с полностью своим стилем; работа fcitx5 и ibus внутри Flatpak для каждого тулкита.

## 7. Лицензии и совместимость с AGPL-3.0, мобильная статическая линковка

### Takeaway
Для AGPL-приложения все три варианта юридически совместимы: Qt LGPLv3/GPLv3 (даже GPL-only модули Qt совместимы с AGPLv3 — по GPLv3 §13; это вывод, не юридическая консультация), GTK под LGPL, Avalonia под MIT. Проблема Qt со статической линковкой на iOS касается закрытых приложений, а не открытых AGPL. У Avalonia платные только Accelerate-компоненты (в том числе MediaPlayer и WebView), сам фреймворк — MIT.

### Cited Findings
- В Qt 6.12 под GPLv3 (не LGPL) лицензированы: Qt Canvas Painter, CoAP, Graphs, GRPC, HTTP Server, Lottie Animation, MQTT, Network Authorization, **Qt Qml Compiler**, Quick 3D, Quick 3D Physics, Quick Timeline, **Virtual Keyboard**, Wayland Compositor. Остальное — LGPLv3/GPLv3 или коммерческая лицензия — [doc.qt.io Qt 6 Licensing](https://doc.qt.io/qt-6/licensing.html)
- Вики Qt: вопрос о статической линковке LGPL ни один суд не рассматривал. Есть два толкования: нужно дать объектные файлы для перелинковки либо исходники приложения. Предложенный путь для закрытых приложений — динамические библиотеки — [Qt Wiki](https://wiki.qt.io/Licensing-talk-about-mobile-platforms) (2013–2017, устарело)
- Закрытому iOS-приложению без материалов для перелинковки нужна коммерческая лицензия Qt или GPL — [forum.qt.io](https://forum.qt.io/topic/82014/question-about-qt-lgpl-license-for-android-ios), [qt-project mailing list 2014](https://lists.qt-project.org/pipermail/development/2014-July/017532.html) (устарело)
- Avalonia: сам фреймворк остаётся под MIT и бесплатен для коммерции. Платная часть — Accelerate: инструменты и продвинутые компоненты (Charts, WebView, **MediaPlayer**, расширенные DevTools, Parcel). Community Edition бесплатна для частных лиц и небольших организаций. Старые MIT-версии DevTools и TreeDataGrid остаются под MIT. Анонс изменений — октябрь 2025 — [блог Avalonia](https://avaloniaui.net/blog/building-a-sustainable-future-for-avalonia), [GitHub discussion #19804](https://github.com/AvaloniaUI/Avalonia/discussions/19804)
- По Accelerate: лицензия нужна каждому разработчику проекта, который зависит от этих компонентов; вынос их в отдельную библиотеку в обход лицензии — нарушение условий (2024) — [discussion #17149](https://github.com/AvaloniaUI/Avalonia/discussions/17149)
- Devolutions выделила около $3 млн на три года; по словам мейнтейнеров, спонсорство «contractually binds them to the MIT licence» — [Devolutions](https://devolutions.net/company/press-release/avalonia-accelerate-backed-by-3-million-deal-from-devolutions/), [discussion #19108](https://github.com/AvaloniaUI/Avalonia/discussions/19108)
- В 2024 году обсуждали, что NativeAOT станет платной функцией. Текущее состояние не подтверждено — [discussion #17015](https://github.com/AvaloniaUI/Avalonia/discussions/17015) (устарело)

### Inferences
- Spotless под AGPL-3.0 открывает весь код, поэтому требование LGPL «дать возможность перелинковки» выполняется автоматически, и на iOS и Android можно линковать Qt статически. GPL-only модули (Qt Qml Compiler, то есть qmlsc; Lottie) по §13 GPLv3/AGPLv3 сочетаются с AGPL. Сторонние форки или дистрибуции, закрывающие код, нам не важны.
- Риск для App Store: у пользователей бывают споры о совместимости (A)GPL с условиями App Store (дело VLC 2011 года). Это общий риск для любого (A)GPL-кода на iOS, не только Qt. Не проверено в этой сессии.
- Плеер в Avalonia через платный MediaPlayer не нужен: звук делает Rust-ядро (symphonia + cpal).
- Не юридическая консультация; для iOS стоит отдельно проверить актуальную позицию Apple и FSF.

### Gaps
- Не проверено, под какой лицензией в Qt 6.12 модуль Qt Multimedia и не стал ли он GPL-only (у нас он не нужен: звук в Rust).
- Не проверена лицензия NativeAOT в Avalonia 12: бесплатна или нет.

## 8. Заметные реальные приложения

### Takeaway
На Rust + GTK4 есть реальный нативный музыкальный клиент — Spot, сейчас его продолжение Riff (librespot). Остальные известные примеры (Amberol, Elisa, Strawberry, Telegram Desktop на Qt Widgets) в этой сессии источниками не подтверждены.

### Cited Findings
- Spot — нативный клиент Spotify на Gtk4/Rust для GNOME на основе librespot; не поддерживается, вместо него предлагают форк Riff (Diegovsky/riff), который развивается «на компьютер и телефон» — [spot-rs/spot](https://github.com/spot-rs/spot), [gitcode mirror README](https://gitcode.com/gh_mirrors/sp/spot/blob/development/README.md), [Riff на Flathub (зеркало)](https://linux-meta.duckdns.org/en/p/riff)
- Psst в одной статье 2021 года назван GTK-клиентом на Rust. Это, по всей видимости, ошибка источника: Psst сделан на druid. Источник в выдаче поиска (без ссылки) ненадёжен; приводить его как пример GTK не стоит.

### Inferences (не проверено, из фоновых знаний)
- GTK4 + gtk-rs: Amberol (музыкальный плеер, Rust), Fractal (Matrix), Loupe, Shortwave и другие GNOME Circle и Core приложения на Rust.
- Qt/QML: Elisa (KDE, Kirigami), приложения KDE Plasma Mobile; Strawberry и Telegram Desktop — на Qt Widgets, не QML. Для QML и cxx-qt крупных публичных приложений на Rust не найдено (проверить).
- Avalonia: JetBrains Rider (части интерфейса), Wasabi Wallet и другие. Музыкальные плееры на Avalonia — не проверено.

### Gaps
- Не найдено крупного публичного приложения на cxx-qt + QML.
- Не найдено музыкального плеера на Avalonia с ядром на Rust.

## 9. Документация и работа ИИ-ассистента

### Takeaway
Прямых источников о том, как ИИ-ассистенты пишут код для этих стеков, не найдено. Косвенно: QML и GTK/gtk-rs широко представлены в обучающих данных; cxx-qt быстро меняется между версиями (0.7 → 0.10 за два года), поэтому ассистенты будут путаться в API моста. Avalonia похожа на WPF, примеров на XAML много, но это код на C#, не на Rust.

### Cited Findings
- Для cxx-qt есть книга (Getting started, Cargo, CMake) — [CXX-Qt Book](https://kdab.github.io/cxx-qt/book/getting-started/4-cargo-executable.html); есть индекс в context7 — [context7 kdab/cxx-qt](https://context7.com/kdab/cxx-qt)
- Документация relm4 0.11 на docs.rs не собралась (последняя рабочая — 0.10) — [docs.rs](https://docs.rs/crate/relm4/latest)
- Блог relm4 ведётся — [relm4.org/blog](https://relm4.org/blog/)

### Inferences
- Самая устойчивая к ошибкам ИИ часть — QML: язык стабилен с Qt 5, примеров очень много. Самая хрупкая — мосты: макросы cxx-qt и FFI Avalonia. gtk-rs — середина: API стабилен, но идиомы с subclassing, glib::clone! и object-wrapper многословны, и ассистенты нередко путают версии.

### Gaps
- Нет опубликованных оценок качества кода от ИИ для этих стеков.

## 10. Главные риски

### Takeaway
Qt/QML + cxx-qt: дизайн и платформы подходят лучше всего, но мост до 1.0 и не тестируется на Android/iOS, а KDE-рантайм тяжёлый для не-KDE пользователей. GTK4: экосистема на Rust самая лёгкая и «родная», но с ней нет мобильных платформ и приходится бороться с Adwaita за свой дизайн. Avalonia: дизайн и мобильные платформы хорошие, но это второй язык и рантайм (.NET), FFI-граница, а мобильные платформы — «самая молодая цель».

### Cited Findings
- cxx-qt: ломающие изменения в каждой минорной версии; Android/iOS «not tested regularly» — [CHANGELOG](https://github.com/KDAB/cxx-qt/blob/main/CHANGELOG.md), [README](https://github.com/KDAB/cxx-qt/blob/main/README.md)
- QML и картинки: одна большая картинка может раздуть память до гигабайт, если не ограничивать `sourceSize` — [forum.qt.io](https://forum.qt.io/topic/105738/why-is-qml-image-taking-up-so-much-memory-slowing-down-application/5)
- GTK на Android — «not yet complete» — [OSNews](https://www.osnews.com/story/141670/gtk-announces-x11-deprecation-new-android-backend-and-much-more/); libadwaita конфликтует со сторонним CSS — [GNOME Discourse](https://discourse.gnome.org/t/why-and-how-libadwaita-prevents-theming/17079?page=2)
- Avalonia: мобильные платформы — «the youngest»; нативные вью нельзя перекрывать — [Avalonia mobile](https://avaloniaui.net/avalonia/mobile); у компании меняется модель монетизации (Accelerate) — [блог Avalonia](https://avaloniaui.net/blog/building-a-sustainable-future-for-avalonia); сложный async Rust↔C# требует своего фреймворка — [ScyllaDB](https://www.scylladb.com/2026/08/31/async-ffi-framework-for-rust-c-interop/)
- Требование 16 КБ страниц на Android касается всех нативных библиотек в APK, в том числе Rust-ядра — [блог Avalonia](https://avaloniaui.net/blog/preparing-your-avalonia-apps-for-android-s-16-kb-page-size-requirement)

### Inferences
- По главному требованию владельца — нативность и малый вес — все три в пустом окне на порядок легче Electron (2019: Qt 17 МБ, GTK3 5 МБ, Electron 74,6 МБ приватной памяти). Но в Flatpak рантайм KDE или GNOME добавляет сотни мегабайт на диск при первой установке, если его ещё нет в системе. У Avalonia в AOT нет общего рантайма, и бинарник ~15–20 МБ.
- Владелец будет учиться бэкенду на Rust. Avalonia добавляет C# во фронтенд; если фронтенд делает ИИ, а ядро — владелец, граница FFI становится точкой, где они встречаются, и её проектирование — тоже задача на стороне ядра. В Qt граница — макросы cxx-qt в Rust, в GTK границы нет вовсе (всё на Rust).
- По дизайну «Точки» ранжирование (вывод): QML ≈ Avalonia > GTK4. По мобильным платформам: Qt (с оговоркой про cxx-qt) ≈ Avalonia > GTK. По «чистоте Rust»: GTK > Qt > Avalonia.

### Gaps
- Нет собственных замеров; для честного сравнения с чистыми Rust-тулкитами (Slint, iced, egui, Dioxus native и т. п.) нужен один и тот же экран, собранный на каждом стеке.
