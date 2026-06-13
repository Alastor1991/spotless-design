// Карточка токенов направления: шрифт, палитра, формы, характер.

const TokenCard = ({ spec }) => {
  const S = spec;
  const swatch = (c, name, ink) => (
    <div key={name} style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
      <div style={{ height: 56, borderRadius: 10, background: c, border: `1px solid ${S.cardLine}` }}></div>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: S.cardMut, lineHeight: 1.4 }}>{name}</span>
    </div>
  );
  return (
    <div style={{
      width: 400, height: 900, background: S.cardBg, color: S.cardText, fontFamily: S.font,
      padding: 32, display: "flex", flexDirection: "column", gap: 26, overflow: "hidden",
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: S.acc, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{S.tag}</div>
        <div style={{ fontSize: 27, fontWeight: 800, letterSpacing: "-0.02em" }}>{S.name}</div>
        <div style={{ fontSize: 14.5, color: S.cardMut, marginTop: 8, lineHeight: 1.55 }}>{S.desc}</div>
      </div>

      <div>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: S.cardMut, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Типографика</div>
        <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}>Аа Gg</div>
        <div style={{ fontSize: 15, marginTop: 8 }}>{S.fontName}</div>
        <div style={{ fontSize: 13, color: S.cardMut, marginTop: 2 }}>{S.fontNote}</div>
      </div>

      <div>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: S.cardMut, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Палитра</div>
        <div style={{ display: "flex", gap: 10 }}>
          {S.swatches.map(s => swatch(s[0], s[1]))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: S.cardMut, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Форма и кнопки</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{
            padding: "10px 22px", borderRadius: S.btnR, background: S.acc, color: S.accInk,
            fontSize: 14, fontWeight: 700,
          }}>{S.btnPrimary}</span>
          <span style={{
            padding: "10px 22px", borderRadius: S.btnR, background: S.btn2bg, color: S.cardText,
            fontSize: 14, fontWeight: 600, border: `1px solid ${S.cardLine}`,
          }}>{S.btnSecondary}</span>
          <span style={{
            width: 42, height: 42, borderRadius: "50%", background: S.btn2bg, border: `1px solid ${S.cardLine}`,
            display: "inline-flex", alignItems: "center", justifyContent: "center", color: S.cardMut,
          }}><Ic d={ICONS.dollar} size={17} /></span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: S.cardMut, marginTop: 10 }}>radius {S.radiusNote}</div>
      </div>

      <div style={{ flex: 1 }}></div>

      <div>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: S.cardMut, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Характер</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {S.mood.map(m => (
            <span key={m} style={{
              padding: "6px 14px", borderRadius: 99, fontSize: 13, fontWeight: 600,
              background: S.btn2bg, border: `1px solid ${S.cardLine}`, color: S.cardText,
            }}>{m}</span>
          ))}
        </div>
        <div style={{ fontSize: 13.5, color: S.cardMut, marginTop: 16, lineHeight: 1.55 }}>{S.note}</div>
      </div>
    </div>
  );
};

const TOKENS_A = {
  tag: "Направление A", name: "Тёплая бумага",
  desc: "Тёплый графит и кремовый текст. Мягко, спокойно, по-домашнему — интерфейс, который не торопит. Базовый кандидат на дефолтную тёмную тему.",
  font: "'Golos Text', sans-serif", fontName: "Golos Text", fontNote: "гуманистический гротеск, отличная кириллица",
  cardBg: "oklch(0.245 0.013 75)", cardText: "oklch(0.93 0.015 90)", cardMut: "oklch(0.65 0.018 80)",
  cardLine: "oklch(0.33 0.015 75)", acc: "oklch(0.80 0.13 95)", accInk: "oklch(0.27 0.06 95)",
  btn2bg: "oklch(0.30 0.015 75)", btnR: 12, radiusNote: "14 / 10 / pill-чипы",
  btnPrimary: "Поддержать", btnSecondary: "Слушать",
  swatches: [["oklch(0.20 0.012 75)", "фон\n0.20 0.012 75"], ["oklch(0.30 0.015 75)", "поверхность\n0.30 0.015 75"], ["oklch(0.80 0.13 95)", "акцент\n0.80 0.13 95"], ["oklch(0.93 0.015 90)", "текст\n0.93 0.015 90"]],
  mood: ["мягкое", "тёплое", "уютное", "неторопливое"],
  note: "Заливки вместо линий, крупные отступы, круглый плей. Оценка — поповер над сердечком (показан на макете).",
};

const TOKENS_B = {
  tag: "Направление B", name: "Студия",
  desc: "Прохладный нейтральный графит, тонкие линии вместо заливок, плотная вёрстка. Моноширинный — для цифр, времени и «технических» приветов продвинутым.",
  font: "'Source Sans 3', sans-serif", fontName: "Source Sans 3 + JetBrains Mono", fontNote: "гуманистический гротеск + mono для метаданных",
  cardBg: "oklch(0.215 0.009 255)", cardText: "oklch(0.92 0.008 250)", cardMut: "oklch(0.62 0.012 250)",
  cardLine: "oklch(0.30 0.01 255)", acc: "oklch(0.80 0.13 95)", accInk: "oklch(0.25 0.05 95)",
  btn2bg: "oklch(0.27 0.01 255)", btnR: 8, radiusNote: "8 / 6 / без pill",
  btnPrimary: "Поддержать", btnSecondary: "Слушать",
  swatches: [["oklch(0.185 0.008 255)", "фон\n0.185 0.008 255"], ["oklch(0.27 0.01 255)", "поверхность\n0.27 0.01 255"], ["oklch(0.80 0.13 95)", "акцент\n0.80 0.13 95"], ["oklch(0.92 0.008 250)", "текст\n0.92 0.008 250"]],
  mood: ["собранное", "тихое", "точное", "для своих"],
  note: "Списки плотнее, рейтинг виден цифрой 8/10, ⌘K, FLAC-бейдж, строка статуса в сайдбаре — те самые «и про вас не забыли».",
};

const TOKENS_C = {
  tag: "Направление C", name: "Солнечная",
  desc: "Кремовый свет, тональные поверхности, капсулы и круги. Самая дружелюбная и «гугловая» по духу — но со своим характером. Кандидат на дефолтную светлую тему.",
  font: "'Nunito Sans', sans-serif", fontName: "Nunito Sans", fontNote: "округлый гуманистический гротеск",
  cardBg: "oklch(0.972 0.012 95)", cardText: "oklch(0.28 0.02 80)", cardMut: "oklch(0.50 0.025 85)",
  cardLine: "oklch(0.885 0.028 95)", acc: "oklch(0.78 0.13 95)", accInk: "oklch(0.34 0.07 95)",
  btn2bg: "oklch(0.93 0.02 95)", btnR: 99, radiusNote: "24 / 20 / всё pill",
  btnPrimary: "Support", btnSecondary: "Play",
  swatches: [["oklch(0.972 0.012 95)", "фон\n0.972 0.012 95"], ["oklch(0.93 0.02 95)", "поверхность\n0.93 0.02 95"], ["oklch(0.78 0.13 95)", "акцент\n0.78 0.13 95"], ["oklch(0.34 0.07 95)", "чернила\n0.34 0.07 95"]],
  mood: ["светлое", "игривое", "доброе", "лёгкое"],
  note: "Плеер — плавающая капсула, активный пункт меню — жёлтая пилюля. Интерфейс показан на английском.",
};

Object.assign(window, { TokenCard, TOKENS_A, TOKENS_B, TOKENS_C });
