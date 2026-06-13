// Spotless — мок-данные (plain JS)

window.DB = (() => {
  const artists = {
    milk: {
      id: "milk", name: "Молоко и мёд", hue: 145, listeners: 48213,
      avgPerListener: 0.42, totalMonth: 4980, incomeHidden: false,
      about: "Инди-дуэт из Казани. Тихие песни про большие вещи: дом, воду, расстояния. Записываются в бывшей котельной, выпускаются сами.",
      followers: 12840,
    },
    lowtide: {
      id: "lowtide", name: "Low Tide Choir", hue: 200, listeners: 112450,
      avgPerListener: 0.38, totalMonth: 11020, incomeHidden: false,
      about: "Dream-pop collective from Brighton. Six voices, one tape machine.",
      followers: 33420,
    },
    velvet: {
      id: "velvet", name: "Velvet Antenna", hue: 285, listeners: 67800,
      avgPerListener: 0.51, totalMonth: null, incomeHidden: true,
      about: "Synthwave solo project. Hides the numbers, not the music.",
      followers: 21080,
    },
    paper: {
      id: "paper", name: "Paper Planes Club", hue: 240, listeners: 89300,
      avgPerListener: 0.33, totalMonth: 7430, incomeHidden: false,
      about: "Indie-rock quartet, Lisbon. Loud guitars, soft hearts.",
      followers: 27660,
    },
    bruno: {
      id: "bruno", name: "Танец Бруно", hue: 330, listeners: 23100,
      avgPerListener: 0.47, totalMonth: 1890, incomeHidden: false,
      about: "Электроника на стыке хауса и дворовой лирики. Москва.",
      followers: 8120,
    },
    gruntovka: {
      id: "gruntovka", name: "Грунтовка", hue: 70, listeners: 9400,
      avgPerListener: 0.55, totalMonth: 740, incomeHidden: false,
      about: "Пост-панк из Перми. Две гитары, барабанщица и честность.",
      followers: 3940,
    },
  };

  const albums = {
    grunt: {
      id: "grunt", artist: "milk", title: "Грунт", year: 2024, type: "album", hue: 25,
      tracks: [
        { id: "g1", t: "Первый снег в сентябре", dur: "3:24", plays: "1 204 318", liked: true, rating: 9 },
        { id: "g2", t: "Грунт", dur: "4:02", plays: "987 220", liked: false, rating: null },
        { id: "g3", t: "Вода находит дорогу", dur: "3:48", plays: "1 567 002", liked: true, rating: 8 },
        { id: "g4", t: "Не спеши", dur: "2:56", plays: "744 580", liked: false, rating: null },
        { id: "g5", t: "Письмо без адреса", dur: "4:31", plays: "612 304", liked: false, rating: 7 },
        { id: "g6", t: "Тёплый гараж", dur: "3:11", plays: "529 871", liked: true, rating: null },
        { id: "g7", t: "Полночь, кухня", dur: "3:39", plays: "488 213", liked: false, rating: null },
        { id: "g8", t: "Минус один", dur: "2:47", plays: "401 556", liked: false, rating: null },
        { id: "g9", t: "Свет остаётся", dur: "5:04", plays: "823 449", liked: true, rating: 10 },
      ],
    },
    glass: {
      id: "glass", artist: "milk", title: "Стеклянная вода", year: 2026, type: "single", hue: 145,
      tracks: [{ id: "gl1", t: "Стеклянная вода", dur: "3:56", plays: "214 870", liked: true, rating: 8 }],
    },
    salt: {
      id: "salt", artist: "lowtide", title: "Salt & Signal", year: 2025, type: "album", hue: 190,
      tracks: [
        { id: "s1", t: "Foam Letters", dur: "3:42", plays: "2 304 118", liked: false, rating: null },
        { id: "s2", t: "Lighthouse Keeper", dur: "4:15", plays: "1 887 410", liked: true, rating: 9 },
        { id: "s3", t: "Slow Tide", dur: "3:58", plays: "1 204 882", liked: false, rating: null },
        { id: "s4", t: "Radio Fog", dur: "4:44", plays: "966 201", liked: false, rating: null },
        { id: "s5", t: "Anchor Song", dur: "3:21", plays: "1 432 095", liked: false, rating: 6 },
      ],
    },
    hourglass: {
      id: "hourglass", artist: "velvet", title: "Hourglass II", year: 2026, type: "album", hue: 305,
      tracks: [
        { id: "h1", t: "Neon Stairs", dur: "4:08", plays: "884 312", liked: false, rating: null },
        { id: "h2", t: "Afterimage", dur: "3:51", plays: "1 102 480", liked: true, rating: 8 },
        { id: "h3", t: "Tape Rewind", dur: "5:12", plays: "693 207", liked: false, rating: null },
        { id: "h4", t: "Hourglass", dur: "4:33", plays: "1 240 663", liked: false, rating: null },
      ],
    },
    animal: {
      id: "animal", artist: "paper", title: "Animal Letters", year: 2026, type: "album", hue: 240,
      tracks: [
        { id: "a1", t: "Fox on the Roof", dur: "3:18", plays: "1 540 220", liked: false, rating: null },
        { id: "a2", t: "Paper Cranes", dur: "3:47", plays: "2 011 873", liked: true, rating: 9 },
        { id: "a3", t: "Owl Hours", dur: "4:02", plays: "874 410", liked: false, rating: null },
      ],
    },
    seven: {
      id: "seven", artist: "bruno", title: "Семь восьмых", year: 2025, type: "album", hue: 330,
      tracks: [
        { id: "b1", t: "Семь восьмых", dur: "3:33", plays: "412 380", liked: false, rating: null },
        { id: "b2", t: "Панельный вальс", dur: "4:11", plays: "388 102", liked: true, rating: 7 },
        { id: "b3", t: "Лифт до неба", dur: "3:02", plays: "297 440", liked: false, rating: null },
      ],
    },
    cassette: {
      id: "cassette", artist: "bruno", title: "Кассета 04", year: 2026, type: "single", hue: 15,
      tracks: [{ id: "c1", t: "Кассета 04", dur: "2:48", plays: "118 204", liked: false, rating: 7 }],
    },
    pole: {
      id: "pole", artist: "gruntovka", title: "Поле, ещё поле", year: 2026, type: "ep", hue: 70,
      tracks: [
        { id: "p1", t: "Поле, ещё поле", dur: "4:12", plays: "88 320", liked: false, rating: null },
        { id: "p2", t: "Провода", dur: "3:27", plays: "64 110", liked: false, rating: null },
        { id: "p3", t: "Сухая трава", dur: "5:01", plays: "71 893", liked: true, rating: 8 },
      ],
    },
  };

  const playlists = [
    { id: "quiet", name: "Тихие часы", nameEn: "Quiet Hours", hue: 55, byMe: true, collab: false, tracks: ["g1", "g5", "g7", "gl1", "s3", "h3", "p3"] },
    { id: "run", name: "Бег по набережной", nameEn: "Riverside Run", hue: 120, byMe: true, collab: false, tracks: ["b1", "b3", "a1", "s1", "g3", "c1"] },
    { id: "kitchen", name: "Кухня по выходным", nameEn: "Weekend Kitchen", hue: 35, byMe: true, collab: true, tracks: ["g6", "b2", "a2", "s5", "c1", "gl1"] },
    { id: "train", name: "Для поезда", nameEn: "Train Rides", hue: 250, byMe: true, collab: false, tracks: ["s2", "s4", "h1", "h2", "a3", "g9", "p1", "p2"] },
    { id: "y2025", name: "2025", nameEn: "2025", hue: 300, byMe: true, collab: false, tracks: ["gl1", "c1", "a2", "h4", "s2", "g3", "b1", "p3", "h2", "g1"] },
    { id: "wifi", name: "С плохим интернетом", nameEn: "Bad Wi-Fi Mix", hue: 170, byMe: true, collab: false, tracks: ["g2", "g4", "g8", "b3", "p2"] },
  ];

  // Плейлисты друзей (публичные)
  const extraPlaylists = [
    { id: "fp1", name: "Морская соль", nameEn: "Sea Salt", hue: 210, byMe: false, collab: false, owner: "f1", tracks: ["s1", "s2", "s3", "s5", "h1"] },
    { id: "fp2", name: "Утро вторника", nameEn: "Tuesday Morning", hue: 20, byMe: false, collab: false, owner: "f2", tracks: ["g1", "g4", "gl1", "p2"] },
    { id: "fp3", name: "Неон", nameEn: "Neon", hue: 290, byMe: false, collab: false, owner: "f3", tracks: ["h1", "h2", "h3", "h4", "c1", "b1"] },
  ];

  // Миксы «Собрано для вас»
  const mixes = [
    { id: "mx-daily", kind: "mix", name: "Микс дня", nameEn: "Daily Mix", hue: 95, tracks: ["g3", "s2", "h2", "a2", "b2", "p3", "gl1", "g9"] },
    { id: "mx-radar", kind: "mix", name: "Радар новинок", nameEn: "Release Radar", hue: 210, tracks: ["gl1", "c1", "a1", "p1", "h4"] },
    { id: "mx-disc", kind: "mix", name: "Открытия недели", nameEn: "Discover Weekly", hue: 290, tracks: ["s4", "h3", "b3", "p2", "g8", "a3"] },
    { id: "mx-quiet", kind: "mix", name: "Время тишины", nameEn: "Quiet Time", hue: 45, tracks: ["g7", "g5", "s3", "h3", "p3"] },
    { id: "mx-energy", kind: "mix", name: "Энергия", nameEn: "Energy", hue: 10, tracks: ["b1", "a1", "s1", "g2", "c1"] },
    { id: "mx-repeat", kind: "mix", name: "На повторе", nameEn: "On Repeat", hue: 160, tracks: ["gl1", "g1", "s2", "a2", "g9"] },
  ];

  const friends = [
    { id: "f1", name: "Митя", track: "Lighthouse Keeper", artist: "Low Tide Choir", trackId: "s2", ago: "сейчас", agoEn: "now", hue: 210, handle: "@mitya", topArtists: ["lowtide", "velvet"], playlists: ["fp1"] },
    { id: "f2", name: "Аня К.", track: "Свет остаётся", artist: "Молоко и мёд", trackId: "g9", ago: "12 мин", agoEn: "12 min", hue: 20, handle: "@anya_k", topArtists: ["milk", "gruntovka"], playlists: ["fp2"] },
    { id: "f3", name: "Тоша", track: "Neon Stairs", artist: "Velvet Antenna", trackId: "h1", ago: "1 ч", agoEn: "1 h", hue: 290, handle: "@tosha", topArtists: ["velvet", "bruno"], playlists: ["fp3"] },
  ];

  // Жанры: ключ → артисты каталога (пусто = каталог жанра ещё растёт)
  const genres = {
    indie: { artists: ["milk", "paper", "gruntovka"] },
    electronic: { artists: ["bruno", "velvet"] },
    hiphop: { artists: [] },
    rock: { artists: ["paper", "gruntovka"] },
    jazz: { artists: [] },
    classical: { artists: [] },
    ambient: { artists: ["lowtide", "velvet"] },
    pop: { artists: ["milk", "lowtide"] },
    metal: { artists: [] },
    folk: { artists: ["milk", "gruntovka"] },
  };

  // Распределение моей поддержки за месяц (июнь)
  const supportSplit = [
    { artist: "milk", pct: 38, amount: 1.90, minutes: 412 },
    { artist: "lowtide", pct: 24, amount: 1.20, minutes: 261 },
    { artist: "velvet", pct: 16, amount: 0.80, minutes: 174 },
    { artist: "paper", pct: 12, amount: 0.60, minutes: 130 },
    { artist: "bruno", pct: 7, amount: 0.35, minutes: 76 },
    { artist: "gruntovka", pct: 3, amount: 0.15, minutes: 33 },
  ];

  const supportHistory = [
    { month: "Июнь", monthEn: "June", amount: 5.0, extra: 2.0, state: "current" },
    { month: "Май", monthEn: "May", amount: 5.0, extra: 0, state: "done" },
    { month: "Апрель", monthEn: "April", amount: 5.0, extra: 3.0, state: "done" },
    { month: "Март", monthEn: "March", amount: 2.0, extra: 0, state: "done" },
  ];

  // Караоке-текст «Стеклянной воды» (оригинальный, тайм-коды)
  const lyrics = [
    { at: 0.00, l: "Город спит, вода стоит стеклом" },
    { at: 0.08, l: "Мы идём по тонкому без слов" },
    { at: 0.16, l: "Фонари рисуют жёлтый круг" },
    { at: 0.24, l: "Не спеши, не выпускай из рук" },
    { at: 0.34, l: "Стеклянная вода — держи меня" },
    { at: 0.42, l: "Стеклянная вода — до самого дна" },
    { at: 0.52, l: "Если тронешь — разойдутся круги" },
    { at: 0.60, l: "Просто будь, просто рядом иди" },
    { at: 0.70, l: "Город спит, и нам пора домой" },
    { at: 0.78, l: "По воде — как по мостовой" },
    { at: 0.88, l: "Стеклянная вода — держи меня" },
    { at: 0.96, l: "Стеклянная вода…" },
  ];

  // Пулы строк для остальных треков — чтобы у КАЖДОГО трека был текст в караоке-режиме.
  const LYRIC_RU = [
    "Снова свет за окном до утра", "Мы молчим, но всё понял без слов",
    "Где-то там обрывается нить", "Я хочу это всё сохранить",
    "Тихий гул в проводах городских", "Между нами — полметра и стих",
    "Падал снег на пустые мосты", "Я держал твою тень за листы",
    "Не зови — я и так на пути", "Всё, что было, осталось внутри",
    "Этот ритм не даёт мне уснуть", "Дай мне только до края дойти",
  ];
  const LYRIC_EN = [
    "Streetlights bleeding into the rain", "I keep your name like a quiet refrain",
    "We were younger, the city was loud", "Now I hum it alone in the crowd",
    "Hold the night just a little too long", "Every heartbeat turns into a song",
    "Static hums on the radio line", "Half a step and your hand finds mine",
    "Don't look back at the road we let go", "Everything we were, only we know",
    "Let it ring till the morning is gone", "Carry me till the feeling moves on",
  ];
  const hashStr = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };

  // Возвращает тайм-кодированный текст для любого трека (gl1 — настоящий).
  const lyricsFor = (trackId) => {
    if (trackId === "gl1") return lyrics;
    const tr = trackIndex[trackId];
    if (!tr) return lyrics;
    const ru = /[а-яё]/i.test(tr.t);
    const pool = ru ? LYRIC_RU : LYRIC_EN;
    const chorus = ru ? `${tr.t} — не отпускай` : `${tr.t}, hold on tight`;
    const h = hashStr(trackId);
    const n = 11;
    const out = [];
    for (let i = 0; i < n; i++) {
      const line = (i === 4 || i === 10) ? chorus : pool[(h + i * 5) % pool.length];
      out.push({ at: +(i / n).toFixed(3), l: line });
    }
    return out;
  };

  const trackIndex = {};
  Object.values(albums).forEach(al => al.tracks.forEach(tr => {
    trackIndex[tr.id] = { ...tr, album: al.id, artist: al.artist };
  }));

  // Поиск плейлиста по всем источникам (свои — в состоянии приложения)
  const findPlaylist = (id) =>
    playlists.find(p => p.id === id) ||
    extraPlaylists.find(p => p.id === id) ||
    mixes.find(p => p.id === id) || null;

  return { artists, albums, playlists, extraPlaylists, mixes, friends, genres, supportSplit, supportHistory, lyrics, lyricsFor, trackIndex, findPlaylist };
})();
