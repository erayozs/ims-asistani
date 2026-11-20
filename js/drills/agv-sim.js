/* 4.5 · AGV sisteminin simülasyonu — AGV s.23–29 (drill `agv-sim`).
   Yerleşim (AGV s.23): 12 segment; A (sistem girişi, home base; seg 1), B (çıkış; seg 8), M1: a giriş (seg 9) / b çıkış (seg 3),
     M2: c giriş (seg 4) / d çıkış (seg 10), M3: e giriş (seg 6) / f çıkış (seg 7).
   Veriler (AGV s.24–25): segment başına seyir 2 dk, istasyonlar segment ORTASINDA, L/UL 2 dk (istasyon başına).
     Job route / processing time: J1 M1, M3 (5, 7) · J2 M1, M2 (6, 3) · J3 M3 (8).
   Kurallar (AGV s.26): 1) NV talebe yanıt verir; talep yoksa araç home base A'ya döner. 2) Makine çıkış istasyonu ile A aynı anda
     bekliyorsa makine çıkışındaki iş önce; birden çok çıkış bekliyorsa STD. 3) Segmentte full vehicle önceliklidir.
   Zamanlama (s.27–28 tablolarından): yol = segment listesi; ilk ve son segmentin yarısı kat edilir →
     TrT = (segment sayısı − 1) × segment süresi.
     Yüklü sefer: seyir STT + L/UL/2'de başlar (yükleme yarısı), varış = başlangıç + TrT, Comp = STT + L/UL + TrT (boşaltma yarısı).
     Boş sefer: seyir STT'de başlar, Comp = STT + TrT.
     Path loading (s.28): ilk segment [T0, T0 + s/2], ara segmentler s'er dk, son segment s/2.
     Makine: iş Comp anında teslim edilir; makine boşsa hemen, meşgulse boşaldığı anda başlar; bitiş = başlangıç + işlem süresi (s.29).
   Yollar YALNIZCA s.27–28 tablolarından (8 yol): A→a 1,9 · a→A 9,11,8,1 · a→b 9,12,3 · b→e 3,4,5,6 · A→e 1,9,10,6 ·
     e→b 6,7,11,12,3 · e→f 6,7 · b→c 3,4. Yüklü seferler (tablolardaki gibi): A→a, A→e, b→e, b→c; boş: a→A, a→b, e→b, e→f.
   Notes seçeneği: s.27 satırları 1, 2, 3, 4, 7, 8, 9, 12, 14, 16, 17 (Comp 14, 20, 19, 23, 24, 31, 30, 38, 39, 40, 43); satır seed'e göre
     ya da `row` select ile. Rastgele: segment süresi ∈ {1, 2, 3}, L/UL ∈ {2, 4}, STT ve işlem süreleri rastgele, aynı 8 yol.
   Kalite: tüm zamanlar tam sayı ya da .5 (≤ 2 ondalık); Comp iki yoldan (formül vs. path loading son segment + boşaltma yarısı).
   Dışa açık: IM.drills['agv-sim'].solve(T) -> { nseg, trt, ts, te, comp, segs:[{seg,S,F}], mStart?, mEnd? }, .PATHS, .ROWS, .gen(rng) */
(function () {
  const IM = window.IM;
  const F = IM.F;
  const d = (x) => IM.util.d(x);

  const PATHS = {
    'A-a': { path: [1, 9], loaded: true },
    'a-A': { path: [9, 11, 8, 1], loaded: false },
    'a-b': { path: [9, 12, 3], loaded: false },
    'b-e': { path: [3, 4, 5, 6], loaded: true },
    'A-e': { path: [1, 9, 10, 6], loaded: true },
    'e-b': { path: [6, 7, 11, 12, 3], loaded: false },
    'e-f': { path: [6, 7], loaded: false },
    'b-c': { path: [3, 4], loaded: true },
  };
  const ST_INFO = { A: 'A (sistem girişi, home base)', B: 'B (sistem çıkışı)', a: 'a (M1 girişi)', b: 'b (M1 çıkışı)', c: 'c (M2 girişi)', d: 'd (M2 çıkışı)', e: 'e (M3 girişi)', f: 'f (M3 çıkışı)' };
  const MACH_OF = { a: 'M1', c: 'M2', e: 'M3' };
  const JOBS = { J1: { route: ['M1', 'M3'], pt: [5, 7] }, J2: { route: ['M1', 'M2'], pt: [6, 3] }, J3: { route: ['M3'], pt: [8] } };
  // Loaded trip -> possible jobs (route-consistent)
  const JOB_FOR = { 'A-a': ['J1', 'J2'], 'A-e': ['J3'], 'b-e': ['J1'], 'b-c': ['J2'] };
  const EMPTY_WHY = { 'a-A': 'talep olmadığı için home base A\'ya dönüyor', 'a-b': 'M1 çıkışı b\'deki işi almaya gidiyor', 'e-b': 'M1 çıkışı b\'deki işi almaya gidiyor', 'e-f': 'M3 çıkışı f\'deki işi almaya gidiyor' };

  // Notlardaki satırlar (Vehicle Loading Table s.27 + Path Loading Table s.28 + Machine Loading Table s.29)
  // mach.freeAt: makinenin boşaldığı an (0 = boş); busyJob: o anda işlenen iş
  const ROWS = [
    { L: 1, V: 1, job: 'J1', key: 'A-a', stt: 10, mach: { freeAt: 0, pt: 5 } },
    { L: 2, V: 1, key: 'a-A', stt: 14 },
    { L: 3, V: 2, job: 'J2', key: 'A-a', stt: 15, mach: { freeAt: 19, busyJob: 'J1', pt: 6 } },
    { L: 4, V: 2, key: 'a-b', stt: 19 },
    { L: 7, V: 1, job: 'J1', key: 'A-a', stt: 20, mach: { freeAt: 25, busyJob: 'J2', pt: 5 } },
    { L: 8, V: 2, job: 'J1', key: 'b-e', stt: 23, mach: { freeAt: 0, pt: 7 } },
    { L: 9, V: 1, key: 'a-A', stt: 24 },
    { L: 12, V: 1, job: 'J3', key: 'A-e', stt: 30, mach: { freeAt: 38, busyJob: 'J1', pt: 8 } },
    { L: 14, V: 2, key: 'e-b', stt: 31 },
    { L: 16, V: 1, key: 'e-f', stt: 38 },
    { L: 17, V: 2, job: 'J2', key: 'b-c', stt: 39, mach: { freeAt: 0, pt: 3 } },
  ];

  // T = { key, stt, seg (segment süresi), lul (toplam L/UL), mach?:{freeAt, pt} }
  function solve(T) {
    const P = PATHS[T.key];
    if (!P) throw new Error('agv-sim: bilinmeyen yol ' + T.key);
    const s = F(T.seg), lul = F(T.lul), stt = F(T.stt);
    const nseg = P.path.length;
    const trt = s.mul(nseg - 1);
    const ts = P.loaded ? stt.add(lul.div(2)) : stt;
    const te = ts.add(trt);
    const comp = P.loaded ? stt.add(lul).add(trt) : stt.add(trt);
    // path loading (s.28)
    const segs = [];
    let t = ts;
    P.path.forEach((sg, i) => {
      const dur = i === 0 || i === nseg - 1 ? s.div(2) : s;
      segs.push({ seg: sg, S: t, F: t.add(dur) });
      t = t.add(dur);
    });
    // bağımsız kontrol: son segment bitişi = varış; Comp = varış + boşaltma yarısı
    const comp2 = P.loaded ? segs[nseg - 1].F.add(lul.div(2)) : segs[nseg - 1].F;
    if (!segs[nseg - 1].F.eq(te) || !comp2.eq(comp)) throw new Error('agv-sim: zaman kontrolü');
    const R = { nseg, trt, ts, te, comp, segs, loaded: P.loaded, path: P.path.slice() };
    if (P.loaded && T.mach) {
      const free = F(T.mach.freeAt);
      R.mStart = free.gt(comp) ? free : comp;
      R.mEnd = R.mStart.add(T.mach.pt);
      R.waits = free.gt(comp);
    }
    return R;
  }

  function notesTrip(row) {
    const [from, to] = row.key.split('-');
    const T = { key: row.key, from, to, stt: row.stt, seg: 2, lul: 2, V: row.V, L: row.L, notes: true };
    if (row.job) {
      T.job = row.job;
      const m = MACH_OF[to];
      T.mach = Object.assign({ m }, row.mach);
    }
    return T;
  }

  function gen(rng) {
    for (let tries = 0; tries < 400; tries++) {
      const key = rng.pick(Object.keys(PATHS));
      const [from, to] = key.split('-');
      const T = { key, from, to, stt: rng.int(5, 60), seg: rng.pick([1, 2, 3]), lul: rng.pick([2, 4]), V: rng.int(1, 2), notes: false };
      if (PATHS[key].loaded) {
        T.job = rng.pick(JOB_FOR[key]);
        const m = MACH_OF[to];
        const pt = rng.int(3, 9);
        // makine durumu: boş / iş tam varışta biter / meşgul
        const kind = rng.pick(['idle', 'idle', 'busy', 'busy', 'edge']);
        const R0 = solve(T);
        const c = R0.comp.toNumber();
        let freeAt = 0, busyJob = null;
        if (kind === 'busy') { freeAt = c + rng.int(1, 6); busyJob = rng.pick(Object.keys(JOBS).filter((j) => JOBS[j].route.includes(m))); }
        else if (kind === 'edge') { freeAt = c - rng.int(0, 2); busyJob = rng.pick(Object.keys(JOBS).filter((j) => JOBS[j].route.includes(m))); }
        if (freeAt && !Number.isInteger(freeAt)) continue; // makine zamanları tam sayı
        T.mach = { m, freeAt, busyJob, pt };
      }
      const R = solve(T);
      const vals = [R.trt, R.ts, R.te, R.comp].concat(R.segs.flatMap((x) => [x.S, x.F]), R.mEnd ? [R.mStart, R.mEnd] : []);
      if (!vals.every((x) => x.isNice(2))) continue;
      return T;
    }
    throw new Error('agv-sim: uygun sefer bulunamadı');
  }

  // ---------------------------------------------------------------- kural soruları (AGV s.26)
  function ruleQuestion(rng, T, R) {
    const v = `V${T.V}`, o = `V${3 - T.V}`;
    const s = T.seg;
    const pool = [
      () => ({
        prompt: `${v} işini bitirdi ve sistemde hiçbir araç talebi yok. Notlardaki simülasyon kurallarına göre araç ne yapar?`,
        options: [
          { html: 'Home base olan A istasyonuna döner', correct: true },
          { html: 'Bulunduğu istasyonda bir sonraki talebi bekler', correct: false },
          { html: 'En yakın makine çıkış istasyonuna gider', correct: false },
          { html: 'Sistem çıkışı B istasyonuna gider', correct: false },
        ],
        explain: 'Kural 1 (AGV s.26): "If there is no demand for the vehicle, the vehicle returns to the home base at station A." (s.27: satır 2 ve 9, a→A boş seferleri.)',
      }),
      () => {
        const x = rng.pick([['b', 'M1'], ['f', 'M3'], ['d', 'M2']]);
        return {
          prompt: `Aynı anda ${x[1]} çıkış istasyonu ${x[0]} (yarı ya da tamamen işlenmiş iş) ve sistem giriş istasyonu A (yeni iş) araç bekliyor. Boş araç önce hangisine gider?`,
          options: [
            { html: `${x[0]} (makine çıkışındaki iş)`, correct: true },
            { html: 'A (sistem girişindeki yeni iş)', correct: false },
            { html: 'Önce talep eden istasyona (geliş sırası)', correct: false },
            { html: 'Kuyruğu daha uzun olana (MOQS)', correct: false },
          ],
          explain: `Kural 2 (AGV s.26): makine çıkışı ile A aynı anda bekliyorsa "preference is given to transport the partially or fully completed job at the machine output station" → ${x[0]}. (s.27 satır 14: V2 e'de boşalınca A yerine b'ye gidiyor.)`,
        };
      },
      () => ({
        prompt: `${v} e istasyonunda boşaldı. M1 çıkışı b ve M3 çıkışı f aynı anda araç bekliyor (A'da bekleyen iş yok). Segment süresi ${s} dk iken ${v} önce hangisine gider?`,
        options: [
          { html: 'f (e→f yolu daha kısa)', correct: true },
          { html: 'b (önce M1 bitirilmeli)', correct: false },
          { html: 'A (home base)', correct: false },
          { html: 'Rastgele biri', correct: false },
        ],
        explain: `Kural 2 (AGV s.26): birden çok çıkış bekliyorsa shortest travel distance (STD). e→f = 6,7 (2 segment, TrT = 1 × ${s} = ${s} dk); e→b = 6,7,11,12,3 (5 segment, TrT = 4 × ${s} = ${4 * s} dk) → <b>f</b>.`,
      }),
      () => {
        const sg = rng.pick(R.path);
        return {
          prompt: `Yüklü ${v} ile boş ${o} aynı anda segment ${sg} üzerine girmek istiyor. Segment hangi araca verilir?`,
          options: [
            { html: `Yüklü ${v}`, correct: true },
            { html: `Boş ${o}`, correct: false },
            { html: 'Home base\'e daha yakın olan araç', correct: false },
            { html: 'Rastgele seçilen araç', correct: false },
          ],
          explain: 'Kural 3 (AGV s.26): "On a path segment, a full vehicle gets preference" (path selection FV kuralı, AGV s.22).',
        };
      },
      () => ({
        prompt: `A istasyonuna yeni bir iş geldi; ${v} ve ${o} boş. Notlardaki simülasyonda talebe hangi araç yanıt verir?`,
        options: [
          { html: 'Talebe en yakın araç (nearest vehicle, NV)', correct: true },
          { html: 'En uzun süredir boşta olan araç (LIV)', correct: false },
          { html: 'Kullanımı en düşük araç (LUV)', correct: false },
          { html: 'Rastgele bir araç (RV)', correct: false },
        ],
        explain: 'Kural 1 (AGV s.26): "The nearest vehicle (NV) responds to a demand."',
      }),
    ];
    return rng.pick(pool)();
  }

  function segViz(T, R, shownAll, hlSeg) {
    return {
      type: 'matrix',
      caption: `Path loading (AGV s.28 biçimi) — ${T.from}→${T.to}`,
      corner: 'Segment',
      rowLabels: R.segs.map((x) => x.seg),
      colLabels: ['S (dk)', 'F (dk)'],
      cells: R.segs.map((x) => (shownAll || x.seg === hlSeg ? [d(x.S), d(x.F)] : ['?', '?'])),
      cls: R.segs.map((x) => (x.seg === hlSeg ? ['hl', 'hl'] : ['', ''])),
    };
  }

  function build(rng, opts) {
    opts = opts || {};
    let T;
    if (opts.notes) {
      const want = opts.row && opts.row !== 'auto' ? +opts.row : null;
      const row = want ? ROWS.find((r) => r.L === want) : rng.pick(ROWS);
      if (!row) throw new Error('agv-sim: notlarda böyle satır yok ' + opts.row);
      T = notesTrip(row);
    } else T = gen(rng);
    const R = solve(T);
    const P = PATHS[T.key];
    const v = `V${T.V}`;
    const s = T.seg, half = F(T.lul).div(2);
    const mapBase = { type: 'agvmap', from: T.from, to: T.to, caption: `${v}: ${T.from} → ${T.to}` };
    const mapHl = Object.assign({}, mapBase, { highlight: R.path });
    const steps = [];
    steps.push({
      kind: 'sequence',
      prompt: `<b>1. Yol.</b> ${v} ${T.from} istasyonundan ${T.to} istasyonuna gidecek. Yerleşimdeki ok yönlerine uyarak en kısa yoldan izleyeceği segmentleri sırayla yaz (ilk segment = başlangıç istasyonunun bulunduğu segment).`,
      sequence: { answer: R.path.map(String), placeholder: 'ör. 1-9' },
      hint: `İstasyonlar segment ortasındadır: ${ST_INFO[T.from]} → ${ST_INFO[T.to]}. Segmentler tek yönlüdür (11 iki yönlü).`,
      explain: `Notlardaki tablolarda (AGV s.27–28) ${T.from}→${T.to} yolu <b>${R.path.join(',')}</b>.`,
      vizDuring: mapBase,
      viz: mapHl,
    });
    steps.push({
      kind: 'number',
      prompt: `<b>2. Segment sayısı.</b> Yol ${R.path.join('-')}. Araç kaç segment üzerinden geçer (başlangıç ve bitiş segmentleri dahil)?`,
      fields: [{ label: 'Segment sayısı', answer: R.nseg }],
      explain: `${R.path.join(', ')} → <b>${R.nseg}</b> segment.`,
    });
    steps.push({
      kind: 'number',
      prompt: `<b>3. Seyir süresi TrT.</b> ${R.nseg} segment, segment başına ${s} dk; istasyonlar segment ortasında. TrT (dk) nedir?`,
      fields: [{ label: 'TrT (dk)', answer: R.trt }],
      hint: 'İlk ve son segmentin yalnızca yarısı kat edilir: (segment sayısı − 1) × segment süresi.',
      explain: `TrT = (${R.nseg} − 1) × ${s} = <b>${d(R.trt)}</b> dk (ilk ve son segmentten yarımşar: ${d(F(s).div(2))} + ${R.nseg > 2 ? `${R.nseg - 2} × ${s} + ` : ''}${d(F(s).div(2))}; AGV s.24, s.27 TrT sütunu).`,
    });
    steps.push({
      kind: 'number',
      prompt: P.loaded
        ? `<b>4. Seyir aralığı.</b> Yüklü sefer: ${v} STT = ${T.stt} anında ${T.from} istasyonunda yüklemeye başlıyor; L/UL = ${T.lul} dk (yarısı yüklemede, yarısı boşaltmada). TrT = ${d(R.trt)} dk. Seyir hangi anda başlar ve araç ${T.to} istasyonuna hangi anda varır?`
        : `<b>4. Seyir aralığı.</b> Boş sefer (yükleme/boşaltma yok): ${v} STT = ${T.stt} anında ${T.from} istasyonundan hareket ediyor, TrT = ${d(R.trt)} dk. Seyir başlangıcı ve varış anı nedir?`,
      fields: [{ label: 'Seyir başlangıcı (dk)', answer: R.ts }, { label: 'Varış (dk)', answer: R.te }],
      hint: P.loaded ? 'Başlangıç = STT + L/UL / 2; varış = başlangıç + TrT.' : 'Boş seferde seyir STT\'de başlar; varış = STT + TrT.',
      explain: P.loaded
        ? `Başlangıç = ${T.stt} + ${d(half)} = <b>${d(R.ts)}</b>; varış = ${d(R.ts)} + ${d(R.trt)} = <b>${d(R.te)}</b> (AGV s.28: STT–ENDT sütunları${T.notes ? `, satır ${T.L}: ${d(R.ts)}–${d(R.te)}` : ''}).`
        : `Başlangıç = STT = <b>${d(R.ts)}</b>; varış = ${T.stt} + ${d(R.trt)} = <b>${d(R.te)}</b> (AGV s.28${T.notes ? `, satır ${T.L}: ${d(R.ts)}–${d(R.te)}` : ''}).`,
    });
    // path loading: ≥3 segmentte rastgele bir ara segment, 2 segmentte son segment
    const pick = R.nseg >= 3 ? R.segs[rng.int(1, R.nseg - 2)] : R.segs[R.nseg - 1];
    const pi = R.segs.indexOf(pick);
    const segLines = R.segs.map((x) => `seg ${x.seg}: ${d(x.S)}–${d(x.F)}`).join(' · ');
    steps.push({
      kind: 'number',
      prompt: `<b>5. Path loading.</b> Seyir başlangıcı ${d(R.ts)}, varış ${d(R.te)}. Araç segment ${pick.seg} üzerinde hangi aralıkta bulunur (başlangıç S, bitiş F)?`,
      fields: [{ label: `Segment ${pick.seg} S (dk)`, answer: pick.S }, { label: `Segment ${pick.seg} F (dk)`, answer: pick.F }],
      hint: `İlk segment yarım (${d(F(s).div(2))} dk), ara segmentler tam (${s} dk), son segment yarım.`,
      explain: `${segLines} → segment ${pick.seg}: <b>${d(pick.S)}–${d(pick.F)}</b> (${pi === 0 || pi === R.nseg - 1 ? 'yarım segment' : 'tam segment'}; AGV s.28 Path Loading Table).`,
      vizDuring: [mapHl, segViz(T, R, false, null)],
      viz: [mapHl, segViz(T, R, true, pick.seg)],
    });
    steps.push({
      kind: 'number',
      prompt: P.loaded
        ? `<b>6. Tamamlanma (Comp).</b> Varış ${d(R.te)}, boşaltma için L/UL'nin diğer yarısı (${d(half)} dk). ${v} bu seferi hangi anda tamamlar?`
        : `<b>6. Tamamlanma (Comp).</b> Boş sefer, varış ${d(R.te)}. Comp nedir?`,
      fields: [{ label: 'Comp (dk)', answer: R.comp }],
      hint: P.loaded ? 'Comp = STT + L/UL + TrT.' : 'Boş seferde Comp = STT + TrT.',
      explain: P.loaded
        ? `Comp = ${T.stt} + ${T.lul} + ${d(R.trt)} = <b>${d(R.comp)}</b> (= varış ${d(R.te)} + ${d(half)}; AGV s.27 Comp sütunu).`
        : `Comp = ${T.stt} + ${d(R.trt)} = <b>${d(R.comp)}</b> (AGV s.27).`,
    });
    if (P.loaded) {
      const M = T.mach;
      const busyTxt = M.freeAt ? `${M.m} şu anda ${M.busyJob} işini işliyor ve t = ${M.freeAt} anında boşalacak` : `${M.m} boş`;
      steps.push({
        kind: 'number',
        prompt: `<b>7. Makine.</b> ${T.job}, ${T.to} (${M.m} girişi) istasyonuna Comp = ${d(R.comp)} anında teslim ediliyor. ${busyTxt}. ${T.job} işinin ${M.m} üzerindeki işlem süresi ${M.pt} dk. İşlem ne zaman başlar ve biter?`,
        fields: [{ label: `${M.m} başlangıç (dk)`, answer: R.mStart }, { label: `${M.m} bitiş (dk)`, answer: R.mEnd }],
        hint: 'Makine boşsa iş teslim anında başlar; meşgulse makinenin boşaldığı anda.',
        explain: `${R.waits ? `${M.m} t = ${M.freeAt} anına kadar meşgul → iş giriş kuyruğunda bekler, başlangıç = <b>${M.freeAt}</b>` : `${M.m} ${M.freeAt ? `t = ${M.freeAt} anında boşalıyor (≤ ${d(R.comp)})` : 'boş'} → başlangıç = Comp = <b>${d(R.mStart)}</b>`}; bitiş = ${d(R.mStart)} + ${M.pt} = <b>${d(R.mEnd)}</b> (AGV s.29 Machine Loading Table).`,
      });
    }
    const rq = ruleQuestion(rng, T, R);
    steps.push({ kind: 'choice', prompt: `<b>${P.loaded ? 8 : 7}. Kural (ayrı bir durum).</b> ${rq.prompt}`, options: rq.options, explain: rq.explain });

    const jobTxt = P.loaded
      ? `${v}, ${T.job} işini (route ${JOBS[T.job].route.join(', ')}) ${ST_INFO[T.from]} istasyonundan ${ST_INFO[T.to]} istasyonuna taşıyacak (<b>yüklü sefer</b>).`
      : `${v} ${ST_INFO[T.from]} istasyonunda boşaldı ve ${EMPTY_WHY[T.key]} (<b>boş sefer</b>, hedef ${ST_INFO[T.to]}).`;
    return {
      title: T.notes ? `AGV simülasyonu (AGV s.27, satır ${T.L})` : 'AGV simülasyonu · sefer zamanlaması',
      statement: `<p>Notlardaki AGV yerleşimi (AGV s.23, sağda). Segment başına seyir süresi <b>${s} dk</b>, istasyonlar segment ortasında; yükleme-boşaltma L/UL = <b>${T.lul} dk</b> (yarısı yüklemede, yarısı boşaltmada).</p>
        <p>STT = <b>${T.stt}</b>: ${jobTxt}</p>
        <p class="muted">Kurallar (AGV s.26): NV talebe yanıt verir, talep yoksa araç A'ya döner; makine çıkışı A'ya göre önceliklidir, çıkışlar arasında STD; segmentte full vehicle önceliklidir.</p>`,
      viz: mapBase,
      steps,
      data: Object.assign({}, T, { path: R.path.slice() }),
      solution: `Yol ${R.path.join(',')} (${R.nseg} segment), TrT ${d(R.trt)}; seyir ${d(R.ts)}–${d(R.te)}, Comp <b>${d(R.comp)}</b>${R.mEnd ? `; ${T.mach.m} üzerinde ${T.job}: ${d(R.mStart)} → <b>${d(R.mEnd)}</b>` : ''}.`,
    };
  }

  IM.registerDrill({
    id: 'agv-sim',
    topic: '4.5',
    title: 'AGV simülasyonu (sefer zamanlaması)',
    description: 'Notlardaki yerleşimde bir AGV seferi: yol, segment sayısı, TrT, seyir aralığı, path loading, Comp, makine başlangıç/bitiş ve simülasyon kuralları.',
    options: [
      { key: 'notes', label: 'Ders notundaki tablolardan bir satır kullan (Vehicle/Path Loading Table, AGV s.27–28)', type: 'checkbox', default: false },
      {
        key: 'row', label: 'Notlardaki satır (yalnızca ders notu seçeneğiyle)', type: 'select', default: 'auto',
        choices: [{ value: 'auto', label: 'Seed\'e göre' }].concat(ROWS.map((r) => ({ value: String(r.L), label: `Satır ${r.L}: V${r.V} ${r.key.replace('-', '→')}${r.job ? ' (' + r.job + ')' : ' (boş)'}` }))),
      },
    ],
    solve,
    gen,
    PATHS,
    ROWS,
    notesTrip,
    generate: build,
  });
})();
