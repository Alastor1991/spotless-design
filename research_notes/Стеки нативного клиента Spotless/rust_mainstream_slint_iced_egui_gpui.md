# Rust-native GUI toolkits for the Spotless client: Slint, Iced, egui, GPUI (state as of Oct 2026)

Method note: versions/dates were pulled directly from crates.io API and the raw CHANGELOG/README/Cargo.toml files in each repo on 2026-10-11 (primary sources). GitHub API (stars, issues) was not reachable from this session, so star counts are absent. Web search coverage for 2026 was thin; where only older or secondary data exists it is flagged.

## 1. Maturity and API stability (version, 1.0 status, cadence, breaking changes, backing)

### Takeaway
Slint is the only one of the four at 1.x with semver stability and a regular ~2-3-month minor cadence (1.18.1, Sep 2026). egui ships fast (0.36.2, Sep 2026; ~monthly) with breaking changes every minor. Iced is slow (0.14.0, Dec 2025; 0.15 still "-dev" ten months later) and self-described "experimental". GPUI's crates.io release is frozen at 0.2.2 (Oct 2025) while the real code lives inside Zed's monorepo, pre-1.0 with "often breaking changes".

### Cited Findings
**Slint**
- Latest: 1.18.1 (2026-09-21); 1.18.0 (2026-09-16), 1.17.0 (2026-06-24), 1.16.0 (2026-04-16), 1.15.0 (2026-02-04) — i.e. a minor release roughly every 2-3 months plus patch releases — [crates.io API](https://crates.io/api/v1/crates/slint); [GitHub releases](https://github.com/slint-ui/slint/releases)
- 1.0 was released in early April 2023 (stable API since then) — [Slint "This week" 2023-04-03](https://www.slint.dev/thisweek/2023-04-03)
- Breaking-ish changes inside 1.x are rare and explicitly labelled, e.g. 1.15.0: "**breaking change**: Adjust Android implementation of the window safe area to match the iOS implementation"; 1.18.0 deprecates setting `Window` x/y, renames Flickable viewport props to `content-*` "The old names remain as deprecated aliases" — [Slint CHANGELOG](https://github.com/slint-ui/slint/blob/master/CHANGELOG.md)
- Some features are behind "unstable" cargo features that do change (e.g. "Upgraded fontique and parley to 0.10: The `unstable-fontique-09` Cargo feature is renamed…") — [Slint CHANGELOG](https://github.com/slint-ui/slint/blob/master/CHANGELOG.md)
- Backing: a company selling commercial licenses (paid "Slint Software License 3.0" plans: Startup/Individual, Small Enterprise, Enterprise; royalties per embedded device) — [Slint terms & conditions](https://slint.dev/terms-and-conditions)
- crates.io downloads: ~1.95M total, ~630k recent (90 days) — [crates.io API](https://crates.io/api/v1/crates/slint)

**Iced**
- Latest: 0.14.0 (2025-12-07); previous 0.13.0 (2024-09-18), 0.12.0 (2024-02-15) — ~1 minor per year recently. Master `Cargo.toml` is `version = "0.15.0-dev"` as of Oct 2026 — [crates.io iced_core API](https://crates.io/api/v1/crates/iced_core); [iced CHANGELOG](https://github.com/iced-rs/iced/blob/master/CHANGELOG.md); [iced Cargo.toml](https://github.com/iced-rs/iced/blob/master/Cargo.toml)
- README: "__Iced is currently experimental software.__" with a link to a graphical roadmap (whimsical.com) — [iced README](https://github.com/iced-rs/iced/blob/master/README.md); [iced ROADMAP.md](https://github.com/iced-rs/iced/blob/master/ROADMAP.md)
- Sponsor: "The development of Iced is sponsored by the Cryptowatch team at Kraken.com" — [iced README](https://github.com/iced-rs/iced/blob/master/README.md)
- 0.14 highlights: reactive rendering, time-travel debugging, `Animation` API for application code, input method support, hot reloading, headless/end-to-end testing, `table`/`grid`/`float`/`pin` widgets — [iced releases](https://github.com/iced-rs/iced/releases); [iced CHANGELOG](https://github.com/iced-rs/iced/blob/master/CHANGELOG.md)
- crates.io downloads: ~2.95M total, ~646k recent — [crates.io API](https://crates.io/api/v1/crates/iced)

**egui**
- Latest: 0.36.2 (2026-09-08); 0.36.0 (2026-08-05), 0.35.0 (2026-06-25), 0.34.0 (2026-03-26); 0.37.0 "UNRELEASED – Colored emojis!" in progress — [crates.io API](https://crates.io/api/v1/crates/egui); [egui CHANGELOG](https://github.com/emilk/egui/blob/main/CHANGELOG.md)
- Every minor carries a "⚠️ Breaking changes" section; e.g. 0.37: "`default_fonts` is no longer a default feature", "`WidgetType` is replaced with `accesskit::Role`"; 0.34 switched font rasterization from `ab_glyph` to `skrifa` + `vello_cpu` — [egui CHANGELOG](https://github.com/emilk/egui/blob/main/CHANGELOG.md)
- Maintainer Emil Ernerfeldt; "egui development is sponsored by Rerun" — [egui README](https://github.com/emilk/egui/blob/main/README.md)
- crates.io downloads: ~25.9M total, ~6.2M recent (by far the most used) — [crates.io API](https://crates.io/api/v1/crates/egui)

**GPUI**
- crates.io: `gpui` 0.2.2 published 2025-10-22 (0.2.0 on 2025-10-09); no newer crates.io release in the year since, although the in-repo `Cargo.toml` still says `version = "0.2.2"`, `publish = true`, `license = "Apache-2.0"` — [crates.io API](https://crates.io/api/v1/crates/gpui); [gpui Cargo.toml](https://github.com/zed-industries/zed/blob/main/crates/gpui/Cargo.toml)
- README: "GPUI is still in active development as we work on the Zed code editor, and is still pre-1.0. There will often be breaking changes between versions." Recommends `gpui = { version = "*" }` plus a new `gpui_platform` crate — [gpui README](https://github.com/zed-industries/zed/blob/main/crates/gpui/README.md)
- gpui.rs: "For the near future, GPUI is tied to Zed, so contributions will need to be made there and kept in sync with it." — [gpui.rs](https://www.gpui.rs/)
- Backing: Zed Industries raised a $32M Series B led by Sequoia (Aug 2025), total >$42M; funding framed around AI-agent collaboration in the editor, not GPUI as a product — [BusinessWire, 2025-08-20](https://www.businesswire.com/news/home/20250820782241/en/)
- Community ecosystem: `gpui-component` (Longbridge) 0.7.1 on 2026-10-05, very frequent releases, Apache-2.0, ~224k downloads — [crates.io API](https://crates.io/api/v1/crates/gpui-component); unofficial redistributions exist (`gpui-box`, "gpui-unofficial") because upstream doesn't publish regularly — [docs.rs gpui-box](https://docs.rs/crate/gpui-box/0.1.1); [gpuikit README](https://tangled.org/nate.rip/gpuikit/blob/main/README.md)

### Inferences
- For a client meant to be a long-lived reference implementation, Slint is the only option with a stability contract. egui churns but in small, well-documented steps; Iced's long gaps between releases means users typically track git master; GPUI effectively requires pinning a Zed git commit.
- GPUI's funding is strong but tied to Zed's product needs; nothing promises external API stability.

### Gaps
- GitHub stars/contributor counts could not be fetched (API blocked in this session).
- No public Iced 0.15 date or 1.0 timeline found; the roadmap is a graphic on whimsical.com, not text.
- Slint company funding (investors, headcount) not found in this session.

## 2. Platform support (Linux Wayland/X11, Windows, Android, iOS) and Flatpak

### Takeaway
Slint is the only one with first-party Android (since 1.5, Mar 2024) and iOS (since 1.12, Jun 2025, actively maintained in 1.17-1.18). egui/eframe supports Android (no official iOS for eframe native per README, though iOS fixes land). Iced officially supports Windows, macOS, Linux, Web only — no mobile. GPUI: macOS, Linux (Wayland+X11), Windows, plus wasm in-tree; mobile only via an early third-party crate. All four run on Wayland and X11 on Linux; Flathub hosts Zed (GPUI), Halloy (Iced), and many COSMIC apps (Iced-based).

### Cited Findings
**Slint**
- Android: "Added support for Android via the `backend-android-activity-05` feature" (1.5.0, 2024-03-14); `Key.Back` (1.13); Android 6 support fix (1.10) — [Slint CHANGELOG](https://github.com/slint-ui/slint/blob/master/CHANGELOG.md)
- iOS: "Initial iOS support" (1.12.0, 2025-06-16); 1.17.0 "Added detection of system dark/light theme"; 1.18.0 adopts UIScene lifecycle "which iOS 27 requires to launch"; 1.18.1 "Fixed applications rendering in software instead of on the GPU via Metal", "Animations now run at the display's full refresh rate, such as 120Hz on ProMotion devices" — [Slint CHANGELOG](https://github.com/slint-ui/slint/blob/master/CHANGELOG.md)
- Android fixes in 1.18: "Animations now follow the display refresh rate", virtual-keyboard key repeat/caret fix, "Fixed `Key.Back` handlers in applications targeting Android 14 or later", "safe-area insets now include the display cutout" — [Slint CHANGELOG](https://github.com/slint-ui/slint/blob/master/CHANGELOG.md)
- Linux: winit backend with Wayland fixes in 1.18 ("first frame being rendered at the wrong size on Wayland"); also LinuxKMS (no compositor) and Qt backends — [Slint CHANGELOG](https://github.com/slint-ui/slint/blob/master/CHANGELOG.md)
- Touch: `SwipeGestureHandler` (limitations "documented more prominently" in 1.16), `ScaleRotateGestureHandler` for pinch (1.16), Flickable touch panning always on — [Slint CHANGELOG](https://github.com/slint-ui/slint/blob/master/CHANGELOG.md)

**Iced**
- README lists "Cross-platform support (Windows, macOS, Linux, and the Web)" — no Android/iOS — [iced README](https://github.com/iced-rs/iced/blob/master/README.md)
- The 0.14 changelog contains no Android/iOS entries (grep of the full CHANGELOG for "android"/"ios" returned nothing) — [iced CHANGELOG](https://github.com/iced-rs/iced/blob/master/CHANGELOG.md)
- Flatpak: Halloy ("IRC client written in Rust", Iced) is on Flathub as `org.squidowl.halloy`; numerous COSMIC-ecosystem apps (e.g. `io.github.pixeldoted.cosmic-ext-color-picker`, `com.vkhitrin.cosmicding`, `dev.mariinkys.Cedilla`) are on Flathub — [Flathub API: Halloy](https://flathub.org/api/v2/appstream/org.squidowl.halloy); [Flathub search "cosmic"](https://flathub.org/api/v2/search)

**egui**
- README: eframe supports "Web, Linux, Mac, Windows, and Android"; iOS not listed — [egui README](https://github.com/emilk/egui/blob/main/README.md)
- Changelog nonetheless has iOS work: "Add support for the safe area on iOS", "Support for back-button on Android", and 0.36: "Autocomplete, autocorrect and IMEs now work correctly on iOS and android (on eframe web)!" (note: that last one is the *web* target on mobile browsers) — [egui CHANGELOG](https://github.com/emilk/egui/blob/main/CHANGELOG.md)

**GPUI**
- `gpui` default features: `["font-kit", "wayland", "x11", "windows-manifest"]`; platform-specific deps for macOS/iOS cfg, Linux/FreeBSD/Windows, and `wasm32-unknown-unknown` — [gpui Cargo.toml](https://github.com/zed-industries/zed/blob/main/crates/gpui/Cargo.toml)
- README: macOS uses Metal; Linux/FreeBSD needs `wayland` and/or `x11`; "Windows — no features are required. Windowing uses Win32 and text uses DirectWrite." — [gpui README](https://github.com/zed-industries/zed/blob/main/crates/gpui/README.md)
- Mobile: only third-party `gpui-mobile` (first published 2026-03-03, v0.1.0); its docs say platform implementations depend on upstream Zed crates "not yet published on crates.io" and the initial release mainly provides a momentum-scrolling module; Android Vulkan/NDK layer "planned" — [docs.rs gpui-mobile](https://docs.rs/gpui-mobile); [depscope](https://depscope.dev/pkg/cargo/gpui-mobile)
- Flatpak: Zed is on Flathub as `dev.zed.Zed` — [Flathub API: Zed](https://flathub.org/api/v2/appstream/dev.zed.Zed)

### Inferences
- Platform order Linux → Windows → Android → iOS maps cleanly only onto Slint. With egui, Android is workable but iOS native is not officially supported; with Iced and GPUI, Android would require substantial own porting work (winit-level for Iced, a whole `Platform` impl for GPUI).
- Flatpak packaging is a non-issue for any of them technically (all are plain native binaries; GPU stacks use the Flatpak GL/Vulkan runtime extensions).

### Gaps
- Slint's official platform-tier page (docs.slint.dev) returned 404 at the guessed URL; whether Android/iOS are labelled "experimental/tech preview" in the docs as of 1.18 could not be confirmed.
- No Slint-based app on Flathub was confirmed (search not done for lack of budget).
- No confirmation of any community Iced Android port status in 2026 (searches returned nothing).

## 3. Memory usage and binary size (measured)

### Takeaway
Hard cross-toolkit numbers are scarce. One Sept-2026 macOS bake-off (100k-row scroll test) shows Slint+FemtoVG 117.6 MiB, egui+wgpu 121.7 MiB, GPUI 0.2.2 125.5 MiB peak RSS — all similar; the GPU stack dominates. A June-2026 Linux case study shows the biggest lever is avoiding the GPU: an egui app at ~135 MB dropped to ~50 MB (Slint GPU) and ~30 MB (Slint software renderer). No reliable Iced measurement found.

### Cited Findings
- Bake-off (Sep 6, 2026; Apple M4 Max, macOS only; 100,000 synthetic rows, 600 scroll steps; 15 runs). Peak RSS / binary: Slint+FemtoVG 117.6 MiB / 9.1 MiB; egui+wgpu 121.7 MiB / 9.3 MiB; AppKit 124.3 MiB / 0.5 MiB; GPUI 0.2.2 125.5 MiB / 3.8 MiB standalone; Qt 6 Widgets 214.5 MiB / 0.1 MiB + >22 MiB Qt runtime. CPU (user/sys): Slint 0.94/0.23 s, egui 1.17/0.58 s, GPUI 4.06/0.23 s. First frame median: GPUI 152.5 ms, egui 158.1 ms, Slint 190.2 ms. Scroll p99: GPUI 8.29 ms, egui 11.68 ms, Slint 13.82 ms. Build flags not described; single author — [Zed Discussion #63832](https://github.com/zed-industries/zed/discussions/63832)
- rproc (Linux process monitor, June 3, 2026): egui ~135 MB → Slint with GPU ~50 MB → Slint software renderer ~30 MB; author attributes the egui weight to "a full GPU pipeline" (driver connection, driver code — "tens of MB" on NVIDIA proprietary — and texture atlas), not egui's own code; for comparison Mission Center 239 MB, Resources 200 MB, GNOME System Monitor 185 MB — [Trystan Sarrade blog](https://trystan-sarrade.com/article/rust-gui-135mb-to-30mb-egui-to-slint/)
- Older anecdote: Slint hello-world ~45 MB in btop with the default Qt backend; a commenter noted other backends are likely smaller (secondary/Reddit, date unclear, possibly pre-2025) — via [search summary of r/rust thread](https://nyc1.lr.ggtyler.dev/r/rust/comments/1jzawxo/small_footprint_gui_library)
- egui ~30–60 MB, iced ~40–100 MB "typical desktop app" — unsourced estimate, low reliability — [an4t.com, 2025](https://an4t.com/rust-gui-libraries-compared/)
- 2023 startup comparison (no RAM): egui ≈280 ms, Iced ≈230 ms — outdated (pre-2025) — [Lukas Kalbertodt blog, 2023](http://lukaskalbertodt.github.io/2023/02/03/tauri-iced-egui-performance-comparison.html)
- Slint 1.18 reduced wasm binary size by dropping line-breaking dictionaries for scripts without word separators and subsetting the fallback font — [Slint CHANGELOG](https://github.com/slint-ui/slint/blob/master/CHANGELOG.md)

### Inferences
- For "doesn't eat RAM like a browser", any of the four is ~2x better than a WebView app, but the real distinguisher is whether the toolkit can run without a GPU context. Slint has a production software renderer (and FemtoVG/Skia/experimental Vello GPU renderers); egui needs wgpu or glow; Iced has a tiny-skia CPU fallback (not verified in this session's sources); GPUI is GPU-only (Metal/Vulkan/DirectX-class).
- For a dot-matrix, mostly-static UI with a progress tick once per second, partial/dirty-region rendering (Slint software renderer, Iced 0.14 "reactive rendering") matters more for idle CPU/battery than raw RSS.

### Gaps
- No controlled Linux/Wayland hello-world RSS comparison of all four found; Iced has no credible 2025-2026 measurement.
- No Android memory numbers for any toolkit.

## 4. Custom rendering capabilities (gradients, clipping/masks, shadows, blur, fonts, animation, custom drawing, renderers)

### Takeaway
Slint: declarative properties cover gradients (linear/radial/conical), clip, drop shadows (blur radius), opacity layers, Path element, image colorize, rich animations (now incl. physics `spring` easing) — but no general alpha mask / backdrop blur, and newer shadow features are Skia-only. Iced: canvas (paths, gradients) + custom wgpu shader widget gives full power at the cost of writing wgpu code; `Animation` API since 0.14. egui: low-level Painter (shapes, meshes, wgpu paint callbacks), easy for dot grids, but styling is far from CSS. GPUI: Tailwind-like styling (shadows, rounded corners, gradients) with GPU primitives; custom drawing via its own element/paint API.

### Cited Findings
**Slint**
- Renderers: FemtoVG (OpenGL and WGPU — "now uses WGPU 30"), Skia (incl. Vulkan/WGPU), software renderer, and in 1.18 "an experimental renderer based on Vello (`renderer-vello`)" — [Slint CHANGELOG](https://github.com/slint-ui/slint/blob/master/CHANGELOG.md)
- Shadows: `drop-shadow-*` with blur; 1.17 "Added `drop-shadow-spread` and `inner-shadow-{color,blur,offset-x,offset-y,spread}` properties to rectangle. (Only supported in Skia)"; 1.18 "drop shadow of an element with `transform-rotation` or `transform-scale` is now transformed with it" — [Slint CHANGELOG](https://github.com/slint-ui/slint/blob/master/CHANGELOG.md)
- Gradients: linear/radial/`@conical-gradient` (conical editable in live-preview color picker); 1.18 made gradient rendering "consistent across renderers" — [Slint CHANGELOG](https://github.com/slint-ui/slint/blob/master/CHANGELOG.md)
- Clipping: `clip: true`; 1.18 "Elements with `clip: true` and a border now clip their children at the inner edge of the border" (rounded clip) — [Slint CHANGELOG](https://github.com/slint-ui/slint/blob/master/CHANGELOG.md)
- Animation: 1.18 "Added the `spring` easing curve: a physics-based animation that keeps its velocity…", `point-at`/`angle-at` on `Path` for animating along a path, fixes for cubic-bezier jumps; `opacity` layers; `cache-rendering-hint` — [Slint CHANGELOG](https://github.com/slint-ui/slint/blob/master/CHANGELOG.md)
- Text: fontique + parley text layout (since ~1.13), `swash` glyph rasterization for FemtoVG & software (1.16); 1.18 `line-height-factor`, `max-lines`, custom font registration fixes — [Slint CHANGELOG](https://github.com/slint-ui/slint/blob/master/CHANGELOG.md)
- UI primitives relevant to Spotless: `PopupWindow` (`close-policy`, `is-open`), `ContextMenuArea`/`ContextMenu`/`MenuBar`, `DragArea`/`DropArea` (1.17), `ListView` "only instantiates items that are visible" (virtualized), dynamic `z` re-sorting (1.18) — [Slint CHANGELOG](https://github.com/slint-ui/slint/blob/master/CHANGELOG.md)
- Grep of the full Slint changelog finds no "mask" or "backdrop"/"blur filter" element; "blur" appears only as shadow blur and "blurry image" fixes — [Slint CHANGELOG](https://github.com/slint-ui/slint/blob/master/CHANGELOG.md)

**Iced**
- 0.14: `shader::Pipeline` trait "for easier `wgpu` resource management" (custom shaders), `Animation` API, `shadow` on menu overlay style, justified text, `text::Shaping` `Auto` strategy, headless `iced_wgpu`, `wgpu-bare` feature — [iced CHANGELOG](https://github.com/iced-rs/iced/blob/master/CHANGELOG.md)

**egui**
- 0.34: font rasterization via `skrifa` + `vello_cpu`, enabling hinting and variable fonts; 0.35: `harfrust` "for better kerning and ligatures", font hinting configurable, smoother panel animations ("Slow down animation time from 0.1s to 0.2s"); 0.37: colored emoji, runtime system font providers, experimental theme plugin system — [egui CHANGELOG](https://github.com/emilk/egui/blob/main/CHANGELOG.md)
- README: styling "is not yet as powerful as say CSS"; non-goals include "Native looking interface"; backends `egui-wgpu` and `egui_glow` — [egui README](https://github.com/emilk/egui/blob/main/README.md)

**GPUI**
- Self-description: "A fast, hybrid immediate and retained mode, GPU-accelerated UI framework for Rust"; examples include "CSS-inspired layouts" with flexbox-style layout — [gpui.rs](https://www.gpui.rs/)
- Text on macOS needs `font-kit` (otherwise "a placeholder text system that lays text out but renders no glyphs"); Windows uses DirectWrite — [gpui README](https://github.com/zed-industries/zed/blob/main/crates/gpui/README.md)

### Inferences
- Spotless's dot-matrix visuals (DotBar = N rounded rects, Doto font digits, rounded 28px corners, thin 1px lines, palette tokens) map naturally to Slint (`for` loops of Rectangles, globals for theme tokens — the CLAUDE.md already assumes "CSS variables → Slint globals") and to egui's painter. The "cover as dots via mask" effect has no direct Slint mask primitive; it would be done by sampling the image on the Rust side and drawing a dot grid (or a pre-rendered image) — feasible in all four. True backdrop blur (Liquid Glass for iOS) is not available in Slint and would need custom shaders in Iced/GPUI.
- Skia-only shadow features mean Slint's look can differ by renderer; choosing one renderer per platform (e.g. Skia or FemtoVG on desktop) avoids inconsistencies.

### Gaps
- GPUI's exact primitive set (gradients, blur, masks) and Iced's tiny-skia fallback status were not verified from primary docs in this session.
- No source confirming any of the four supports arbitrary alpha masks as a built-in primitive.

## 5. Accessibility, IME, and Cyrillic text shaping

### Takeaway
egui has the most visible AccessKit work in 2026 (roles, names, inspection protocol) and much-improved IME; Slint exposes an accessibility tree (AccessKit) and has fixed IME/text-input issues across Android/iOS; Iced 0.14 added IME but its changelog shows no accessibility work; GPUI's README now has an "Accessibility" topic, but details are unverified. Cyrillic shaping is fine in all (Slint uses parley/fontique; egui uses harfrust since 0.35; Iced uses cosmic-text shaping; GPUI uses platform text systems).

### Cited Findings
- Slint 1.18: "Accessibility: Exposed the content of text inputs to assistive technologies, including the text selection…", `window-title-bar` accessible role, "Fixed the IME not being updated when the position of a focused, editable `TextInput` changes", `input-method-hints` property for platform IMEs; earlier "Updated AccessKit", "Fixed panic in accesskit when opening popups" — [Slint CHANGELOG](https://github.com/slint-ui/slint/blob/master/CHANGELOG.md)
- egui: AccessKit "currently implements the native accessibility APIs on Windows and macOS", enabled by default in eframe — [egui README](https://github.com/emilk/egui/blob/main/README.md); 0.37: `accesskit::Role` re-exported as `egui::Role`, `Response::accessible_name`, "Invisible widgets are now hidden from the accessibility tree"; 0.35: inspection protocol reading the AccessKit tree, IME composition overhaul — [egui CHANGELOG](https://github.com/emilk/egui/blob/main/CHANGELOG.md)
- Iced 0.14: "Input method support", "Variable text size for preedit IME window", "Cursor size awareness for input methods"; no accessibility entries in the changelog — [iced CHANGELOG](https://github.com/iced-rs/iced/blob/master/CHANGELOG.md)
- GPUI README lists "Additional Topics: … Accessibility" — [gpui README](https://github.com/zed-industries/zed/blob/main/crates/gpui/README.md)

### Inferences
- The egui README statement that AccessKit covers "Windows and macOS" (README may lag) suggests Linux (AT-SPI) screen-reader support should be verified per toolkit before committing; AccessKit itself has a Unix adapter.
- Search-field Russian input (the main text-entry case in Spotless) is supported by all four on desktop; mobile IME is most battle-tested in Slint (native Android/iOS) among them.

### Gaps
- Linux Orca/AT-SPI status for each toolkit not verified.
- Content of GPUI's accessibility doc not fetched (raw path 404 at the guessed filename).

## 6. License and AGPL-3.0 compatibility

### Takeaway
egui (MIT OR Apache-2.0), Iced (MIT) and GPUI (Apache-2.0) are permissive and can be combined into an AGPL-3.0 app without issue. Slint is tri-licensed; for an AGPL-3.0 open-source client, the GPLv3 option works because GPLv3 §13 explicitly permits combining with AGPLv3; alternatively the Royalty-free 2.0 license is free for desktop/mobile apps but requires an "About Slint" widget or attribution badge.

### Cited Findings
- Slint crate license: `GPL-3.0-only OR LicenseRef-Slint-Royalty-free-2.0 OR LicenseRef-Slint-Software-3.0` — [crates.io API](https://crates.io/api/v1/crates/slint)
- Royalty-free 2.0: free for "desktop, mobile, or web applications"; "does not permit the use of the Software within Embedded Systems"; attribution required: AboutSlint widget in an About screen, or Slint badge on a public webpage. Software 3.0: "Royalties are not necessary for non-commercial projects, personal projects, and open source projects." GPLv3 §13 permits combining with AGPLv3 — [Slint terms & conditions](https://slint.dev/terms-and-conditions)
- egui/eframe: MIT OR Apache-2.0; iced: MIT; gpui: Apache-2.0; gpui-component: Apache-2.0 — [crates.io API egui](https://crates.io/api/v1/crates/egui); [crates.io API iced_core](https://crates.io/api/v1/crates/iced_core); [gpui Cargo.toml](https://github.com/zed-industries/zed/blob/main/crates/gpui/Cargo.toml); [crates.io API gpui-component](https://crates.io/api/v1/crates/gpui-component)
- Apache-2.0 is GPLv3/AGPLv3-compatible (one-way) — general FSF position, not fetched in this session.

### Inferences
- Slint under GPLv3 inside an AGPL project is the cleanest; it also keeps a fallback if someone wants a closed fork (they'd need a commercial license — consistent with Spotless's open stance).

### Gaps
- FSF compatibility page not fetched; statement on Apache-2.0 ↔ AGPL rests on well-known general knowledge.

## 7. Notable real-world apps

### Takeaway
GPUI → Zed (flagship, on Flathub). Iced → System76 COSMIC desktop (via libcosmic, an Iced fork) and Halloy (Flathub). egui → Rerun Viewer and many tools. Slint → mostly embedded/industrial plus smaller desktop apps (e.g. rproc).

### Cited Findings
- Zed on Flathub (`dev.zed.Zed`, "High-performance code editor") — [Flathub API](https://flathub.org/api/v2/appstream/dev.zed.Zed); GPUI "From the creators of Zed" — [gpui.rs](https://www.gpui.rs/)
- Halloy (Iced) on Flathub — [Flathub API](https://flathub.org/api/v2/appstream/org.squidowl.halloy); COSMIC-ecosystem apps on Flathub — [Flathub search](https://flathub.org/api/v2/search); libcosmic builds on Iced — [pop-os/libcosmic](https://github.com/pop-os/libcosmic) (not fetched this session)
- egui: "professional looking applications, like the Rerun Viewer" — [egui README](https://github.com/emilk/egui/blob/main/README.md)
- Slint: rproc Linux resource monitor migrated from egui to Slint (2026) — [Trystan Sarrade blog](https://trystan-sarrade.com/article/rust-gui-135mb-to-30mb-egui-to-slint/)
- gpui-component (Longbridge) — the de-facto widget library for GPUI outside Zed — [crates.io API](https://crates.io/api/v1/crates/gpui-component)

### Inferences
- None of the four has a prominent consumer media/music app as a showcase; Spotless would be pioneering on any of them.

### Gaps
- No list of notable Slint desktop/mobile consumer apps retrieved.

## 8. Documentation and AI-assistant friendliness

### Takeaway
egui has by far the largest usage corpus (~26M downloads) and good docs/examples but constant minor API churn; Slint has a stable 1.x API, a dedicated DSL with LSP/live-preview and even an MCP server for tooling (useful for AI-assisted work), but a smaller corpus; Iced has a book and examples but its long-unreleased master diverges from 0.14 docs; GPUI has minimal docs ("More docs & examples can be found throughout Zed's crates") and the worst churn.

### Cited Findings
- Download counts (proxy for corpus size): egui ~25.9M, iced ~2.95M, slint ~1.95M, gpui ~349k (gpui-component ~224k) — [crates.io API](https://crates.io/api/v1/crates/egui), [iced](https://crates.io/api/v1/crates/iced), [slint](https://crates.io/api/v1/crates/slint), [gpui](https://crates.io/api/v1/crates/gpui)
- Slint tooling: live-preview (persisted settings, remote preview with pairing, viewer on iOS/Android since 1.17), "Added MCP server feature" (1.16), slint-viewer `mcp` feature (1.18) — [Slint CHANGELOG](https://github.com/slint-ui/slint/blob/master/CHANGELOG.md)
- egui: `egui_mcp` inspection consumer and kittest-based testing (0.35) — [egui CHANGELOG](https://github.com/emilk/egui/blob/main/CHANGELOG.md)
- Iced: "Read the book, the documentation, and the examples" (book.iced.rs) — [iced README](https://github.com/iced-rs/iced/blob/master/README.md); 0.14 adds hot reloading and time-travel debugging — [iced CHANGELOG](https://github.com/iced-rs/iced/blob/master/CHANGELOG.md)
- GPUI docs: README intro, `gpui.rs` crate root, "Contexts" and "Key Dispatch" explainers; "More docs & examples can be found throughout Zed's crates" — [gpui.rs](https://www.gpui.rs/)

### Inferences
- An AI assistant will write plausible egui code most reliably but often for an outdated version; Slint's DSL is smaller and stable since 2023, so trained knowledge stays valid, and the declarative DSL is close to the existing CSS/React prototype (token → global property mapping). GPUI code generation will be the least reliable.

### Gaps
- No quantitative measure of LLM accuracy per toolkit.

## 9. Specific weaknesses for the Spotless design

### Takeaway
Slint: no masks/backdrop blur; some shadow features Skia-only; gestures limited (swipe handler with documented limitations), long-press/haptics need custom code; GPL/royalty-free attribution. Iced: no mobile, no accessibility, experimental, slow releases. egui: immediate-mode layout jitter and CPU cost for large scroll areas, non-CSS styling, GPU required (higher RAM), iOS not official. GPUI: Zed-coupled, stale crates.io release, no mobile, minimal docs.

### Cited Findings
- Slint: `SwipeGestureHandler` limitations documented (1.16); inner-shadow/spread Skia-only (1.17); no mask element in changelog — [Slint CHANGELOG](https://github.com/slint-ui/slint/blob/master/CHANGELOG.md)
- egui: "The main disadvantage of immediate mode is it makes layout more difficult" (first-frame jitter); large UIs in scroll areas "can be slow"; styling "not yet as powerful as say CSS" — [egui README](https://github.com/emilk/egui/blob/main/README.md); egui GPU stack ~135 MB vs Slint software ~30 MB in one Linux app — [Trystan Sarrade blog](https://trystan-sarrade.com/article/rust-gui-135mb-to-30mb-egui-to-slint/)
- Iced: "experimental software"; desktop + web only — [iced README](https://github.com/iced-rs/iced/blob/master/README.md)
- GPUI: "tied to Zed"; pre-1.0 with frequent breaking changes; crates.io 0.2.2 unchanged since 2025-10-22; mobile only via early third-party crate — [gpui.rs](https://www.gpui.rs/); [gpui README](https://github.com/zed-industries/zed/blob/main/crates/gpui/README.md); [crates.io API](https://crates.io/api/v1/crates/gpui); [docs.rs gpui-mobile](https://docs.rs/gpui-mobile)
- GPUI had the best scroll p99 and fastest first frame on macOS in the 100k-row test, but highest CPU time (4.06 s user) — [Zed Discussion #63832](https://github.com/zed-industries/zed/discussions/63832)

### Inferences
- Ranking for Spotless's stated priorities (light RAM, pixel-polish, Linux→Windows→Android→iOS, AGPL, AI-assisted frontend): Slint first (only one meeting all platforms + stability + software renderer); egui second (good for prototyping, weaker for CSS-like polish and mobile); Iced third (desktop-only today); GPUI last (desktop-only, unstable distribution). This matches the project's existing choice of Slint in CLAUDE.md §11.
- Spotless-specific Slint risks to prototype early: long-press + bottom-sheet drag gestures on Android, haptics (needs JNI/platform call from Rust), dot-mask cover rendering, and list virtualization with variable-height rows in `ListView`.

### Gaps
- No hands-on test of long-press/haptics in Slint Android found.
- Iced/GPUI list-virtualization specifics not verified.
