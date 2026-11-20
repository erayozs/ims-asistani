/* 1.2 · Ürün yaşam döngüsü zaman analizi — drill `tlc-time` (Introduction to CIM, INT s.12–14).
   Notların yazımıyla:
     TTLC = B Q T1 + B T2 + T3                         (INT s.12)  ürünün tüm ömrü için harcanan toplam süre
     TLC  = T1 + T2 / Q + T3 / BQ                       (INT s.13)  yaşam döngüsünde birim ürün başına ortalama süre
     T1 = birim ürün üretim süresi, T2 = parti (batch) başına planlama + hazırlık (setup) süresi,
     T3 = ürün tipi başına tasarım süresi (bir kez), B = parti sayısı, Q = ortalama parti büyüklüğü, BQ = yaşam döngüsündeki ürün sayısı.
     INT s.14: automation → T1 ve T2'nin azalması, özellikle T1; CAD/CAM → üç terimle de ilişkili, en çok T2 ve T3.
   Notlarda sayısal örnek YOK → `notes` seçeneği yok; açıklamalarda "(notlarda sayısal örnek yok; formül INT s.12–13)".
   Birimler: T1 dakika (min/pc), T2 saat (h/batch), T3 saat (h) verilir → ilk adımda T2, T3 dakikaya çevrilir; hesap dakikada,
     TTLC ayrıca saate çevrilir.
   Adımlar: birim dönüşümü → BQ → B·Q·T1 → B·T2 → TTLC (min, h) → TLC (T2/Q, T3/(BQ), TLC; kontrol TTLC/(BQ) = TLC)
     → baskın terim (choice) → terim payları (%) → senaryo yeni T değerleri → yeni TLC ve % iyileşme → INT s.14 kavram (choice)
     → B ya da Q iki katına çıkarsa hangi terimler küçülür (multi).
   Kalite kapıları (rejection sampling, ≤600 deneme): gösterilen/hesaplanan her değer ≤2 ondalık (isNice(2)); baskın terim tek
     (en büyük pay ikinciden ≥5 puan fazla), her pay ≥2%; baskın terim hedefi rastgele (üç terim de görülsün);
     senaryo iyileşmesi %3–%70. Bağımsız kontrol: TTLC/(BQ) = TLC (eşit değilse throw).
   Hızlı arama: B, Q, T1, T2 rastgele; T3 (10 h adımlı) aday listesinden kapılara uyanlar arasından seçilir.
   Dışa açık: IM.drills['tlc-time'].solve(P) (saf), .gen(rng, opts) → P, .TECH (INT s.14 metinleri).
   P = { T1 (min/pc), T2h (h/batch), T3h (h), B, Q, scen:{ kind:'automation'|'cadcam', x (T1 azaltma %), y (T2 %), z (T3 %) },
         dbl:'B'|'Q' }  — sayılar Frac. */
(function () {
  const IM = window.IM;
  const F = IM.F;
  const d = (x) => F(x).show();
  const S = (t) => `<sub>${t}</sub>`;
  const T1h = `T${S(1)}`, T2h = `T${S(2)}`, T3h = `T${S(3)}`;
  const SRC = '(notlarda sayısal örnek yok; formül INT s.12–13)';

  const T1S = [2, 2.5, 3, 4, 5, 6, 7.5, 8, 10, 12, 15, 20, 24, 30];
  const QS = [10, 20, 25, 30, 40, 50, 60, 75, 80, 100, 120, 125, 150, 200, 240, 250, 300];
  const AUTO_X = [20, 25, 30, 40, 50]; // T1 azaltma
  const AUTO_Y = [10, 20, 25]; // T2 azaltma (x > y: "especially T1")
  const CAD_Y = [20, 25, 30, 40, 50]; // T2
  const CAD_Z = [20, 25, 30, 40, 50, 60]; // T3

  const TECH = {
    automation: { name: 'Automation (otomasyon)', terms: 'T1 ve T2, özellikle T1' },
    cadcam: { name: 'CAD/CAM', terms: 'üç terimle de ilişkili, en çok T2 ve T3' },
  };

  // ------------------------------------------------------------------ saf çözüm
  function solve(P) {
    const T1 = F(P.T1), B = F(P.B), Q = F(P.Q);
    const T2 = F(P.T2h).mul(60), T3 = F(P.T3h).mul(60); // dakika
    const BQ = B.mul(Q);
    const tA = BQ.mul(T1), tB = B.mul(T2), tC = T3;
    const TTLC = tA.add(tB).add(tC);
    const c1 = T1, c2 = T2.div(Q), c3 = T3.div(BQ);
    const TLC = c1.add(c2).add(c3);
    if (!TTLC.div(BQ).eq(TLC)) throw new Error('tlc-time: TTLC/(BQ) ≠ TLC');
    const terms = [tA, tB, tC];
    const shares = terms.map((t) => t.mul(100).div(TTLC));
    let dom = 0;
    terms.forEach((t, i) => { if (t.gt(terms[dom])) dom = i; });
    const R = { T1, T2, T3, B, Q, BQ, tA, tB, tC, TTLC, TTLCh: TTLC.div(60), c1, c2, c3, TLC, shares, dom };
    if (P.scen) {
      const s = P.scen;
      const f = (v) => F(100).sub(F(v || 0)).div(100);
      const n1 = T1.mul(f(s.x)), n2 = T2.mul(f(s.y)), n3 = T3.mul(f(s.z));
      const m1 = n1, m2 = n2.div(Q), m3 = n3.div(BQ);
      const TLCn = m1.add(m2).add(m3);
      const TTLCn = BQ.mul(n1).add(B.mul(n2)).add(n3);
      if (!TTLCn.div(BQ).eq(TLCn)) throw new Error('tlc-time: senaryo TTLC/(BQ) ≠ TLC');
      R.scen = { n1, n2, n3, m1, m2, m3, TLC: TLCn, TTLC: TTLCn, imp: TLC.sub(TLCn).mul(100).div(TLC) };
    }
    return R;
  }

  const nice = (x) => F(x).isNice(2);
  function allNice(R) {
    const v = [R.T2, R.T3, R.BQ, R.tA, R.tB, R.tC, R.TTLC, R.TTLCh, R.c1, R.c2, R.c3, R.TLC].concat(R.shares);
    if (R.scen) { const s = R.scen; v.push(s.n1, s.n2, s.n3, s.m1, s.m2, s.m3, s.TLC, s.imp); }
    return v.every(nice);
  }

  // ------------------------------------------------------------------ üretici (rejection sampling)
  function gen(rng, opts) {
    opts = opts || {};
    const want = rng.int(0, 2); // baskın terim hedefi denemelerden önce seçilir → üç terim eşit sıklıkta
    for (let tries = 0; tries < 600; tries++) {
      const B = rng.int(2, 30), Q = rng.pick(QS), T1 = F(rng.pick(T1S)), T2 = F(rng.int(2, 32)).div(2);
      const base = { T1, T2h: T2, B, Q };
      if (!F(T2).mul(60).div(Q).isNice(2)) continue;
      // T3 adayları: 20..2000 h, 10 h adım
      const cands = [];
      for (let t3 = 20; t3 <= 2000; t3 += 10) {
        const R = solve(Object.assign({}, base, { T3h: F(t3) }));
        if (!allNice(R)) continue;
        if (R.dom !== want) continue;
        const sh = R.shares.map((x) => x.toNumber()).sort((a, b) => b - a);
        if (sh[0] - sh[1] < 5 || sh[2] < 2) continue;
        cands.push(t3);
      }
      if (!cands.length) continue;
      const P = Object.assign({}, base, { T3h: F(rng.pick(cands)) });
      const kind = opts.scenario === 'automation' || opts.scenario === 'cadcam' ? opts.scenario : rng.pick(['automation', 'cadcam']);
      const combos = [];
      if (kind === 'automation') AUTO_X.forEach((x) => AUTO_Y.forEach((y) => { if (x > y) combos.push({ kind, x, y, z: 0 }); }));
      else CAD_Y.forEach((y) => CAD_Z.forEach((z) => combos.push({ kind, x: 0, y, z })));
      const okc = combos.filter((s) => {
        const R = solve(Object.assign({}, P, { scen: s }));
        const imp = R.scen.imp.toNumber();
        return allNice(R) && imp >= 3 && imp <= 70;
      });
      if (!okc.length) continue;
      P.scen = rng.pick(okc);
      P.dbl = rng.pick(['B', 'Q']);
      return P;
    }
    throw new Error('tlc-time: uygun örnek bulunamadı');
  }

  // ------------------------------------------------------------------ görseller
  function dataViz(P) {
    return {
      type: 'matrix',
      caption: 'Ürün verisi',
      colLabels: ['Değer', 'Birim'],
      rowLabels: [T1h, T2h, T3h, 'B', 'Q'],
      cells: [[d(P.T1), 'min/pc'], [d(P.T2h), 'h/batch'], [d(P.T3h), 'h (bir kez)'], [String(P.B), 'batch'], [String(P.Q), 'pc/batch']],
    };
  }
  function tlcViz(R, withScen) {
    const rows = [{ label: 'Mevcut', segs: [{ v: R.c1.toNumber(), label: 'T1', cls: 's1' }, { v: R.c2.toNumber(), label: 'T2/Q', cls: 's2' }, { v: R.c3.toNumber(), label: 'T3/BQ', cls: 's3' }], total: d(R.TLC) + ' min' }];
    if (withScen) {
      const s = R.scen;
      rows.push({ label: 'Senaryo', segs: [{ v: s.m1.toNumber(), label: 'T1', cls: 's1' }, { v: s.m2.toNumber(), label: 'T2/Q', cls: 's2' }, { v: s.m3.toNumber(), label: 'T3/BQ', cls: 's3' }], total: d(s.TLC) + ' min' });
    }
    return {
      type: 'stack',
      caption: 'T<sub>LC</sub> bileşenleri (min/pc)',
      unit: 'min',
      rows,
      max: R.TLC.toNumber(),
      legend: [{ cls: 's1', label: 'T<sub>1</sub>' }, { cls: 's2', label: 'T<sub>2</sub> / Q' }, { cls: 's3', label: 'T<sub>3</sub> / (BQ)' }],
    };
  }

  // ------------------------------------------------------------------ egzersiz
  function build(rng, opts) {
    const P = gen(rng, opts);
    const R = solve(P);
    const s = P.scen, RS = R.scen;
    const isA = s.kind === 'automation';
    const termNames = [`B·Q·${T1h} (üretim)`, `B·${T2h} (planlama + hazırlık)`, `${T3h} (tasarım, bir kez)`];
    const scenTxt = isA
      ? `<b>Automation</b> yatırımı: ${T1h} %${s.x}, ${T2h} %${s.y} azalır (${T3h} değişmez).`
      : `<b>CAD/CAM</b> yatırımı: ${T2h} %${s.y}, ${T3h} %${s.z} azalır (${T1h} değişmez).`;
    const steps = [];

    steps.push({
      kind: 'number',
      prompt: `Önce birimleri eşitle: ${T1h} dakika cinsinden. ${T2h} = ${d(P.T2h)} h ve ${T3h} = ${d(P.T3h)} h değerlerini <b>dakikaya</b> çevir.`,
      fields: [{ label: `${T2h} (min/batch)`, answer: R.T2 }, { label: `${T3h} (min)`, answer: R.T3 }],
      hint: '1 h = 60 min.',
      explain: `${T2h} = ${d(P.T2h)} × 60 = <b>${d(R.T2)} min/batch</b>; ${T3h} = ${d(P.T3h)} × 60 = <b>${d(R.T3)} min</b>. Formülde bütün terimler aynı birimde olmalı (INT s.12).`,
    });
    steps.push({
      kind: 'number',
      prompt: `Yaşam döngüsü boyunca kaç ürün üretilir? (B = ${P.B} parti, Q = ${P.Q} pc/batch)`,
      fields: [{ label: 'BQ (pc)', answer: R.BQ }],
      explain: `BQ = ${P.B} × ${P.Q} = <b>${d(R.BQ)} pc</b> — "BQ is the number of products in its lifecycle" (INT s.13).`,
    });
    steps.push({
      kind: 'number',
      prompt: `BQ = ${d(R.BQ)} pc ve ${T1h} = ${d(R.T1)} min/pc ile toplam üretim süresi terimini hesapla.`,
      fields: [{ label: `B·Q·${T1h} (min)`, answer: R.tA }],
      explain: `B·Q·${T1h} = ${d(R.BQ)} × ${d(R.T1)} = <b>${d(R.tA)} min</b>. Her ürün için ${T1h} bir kez harcanır (INT s.12).`,
    });
    steps.push({
      kind: 'number',
      prompt: `Her parti için ${T2h} = ${d(R.T2)} min planlama + hazırlık harcanıyor. B = ${P.B} parti için toplam?`,
      fields: [{ label: `B·${T2h} (min)`, answer: R.tB }],
      explain: `B·${T2h} = ${P.B} × ${d(R.T2)} = <b>${d(R.tB)} min</b>. ${T2h} parti başına bir kez oluşur, ürün başına değil (INT s.12).`,
    });
    steps.push({
      kind: 'number',
      prompt: `B·Q·${T1h} = ${d(R.tA)} min, B·${T2h} = ${d(R.tB)} min, ${T3h} = ${d(R.T3)} min. Ürünün tüm ömrü için harcanan toplam süre T<sub>TLC</sub>'yi dakika ve saat olarak bul.`,
      fields: [{ label: 'TTLC (min)', answer: R.TTLC }, { label: 'TTLC (h)', answer: R.TTLCh }],
      explain: `<div class="model">TTLC = B Q T1 + B T2 + T3 = ${d(R.tA)} + ${d(R.tB)} + ${d(R.T3)} = ${d(R.TTLC)} min</div>${d(R.TTLC)} / 60 = <b>${d(R.TTLCh)} h</b>. ${T3h} (tasarım) ürün tipi başına yalnızca bir kez eklenir (INT s.12). ${SRC}`,
    });
    steps.push({
      kind: 'number',
      prompt: `Birim ürün başına ortalama süreyi T<sub>LC</sub> = ${T1h} + ${T2h} / Q + ${T3h} / BQ formülüyle hesapla (${T1h} = ${d(R.T1)} min, ${T2h} = ${d(R.T2)} min, ${T3h} = ${d(R.T3)} min, Q = ${P.Q}, BQ = ${d(R.BQ)}).`,
      fields: [{ label: `${T2h} / Q (min/pc)`, answer: R.c2 }, { label: `${T3h} / BQ (min/pc)`, answer: R.c3 }, { label: 'TLC (min/pc)', answer: R.TLC }],
      explain: `${T2h} / Q = ${d(R.T2)} / ${P.Q} = ${d(R.c2)}; ${T3h} / BQ = ${d(R.T3)} / ${d(R.BQ)} = ${d(R.c3)}.<div class="model">TLC = ${d(R.T1)} + ${d(R.c2)} + ${d(R.c3)} = ${d(R.TLC)} min/pc</div>Kontrol: TTLC / (BQ) = ${d(R.TTLC)} / ${d(R.BQ)} = <b>${d(R.TLC)}</b> ✓ (TLC, TTLC'nin BQ ürüne bölünmüş hâlidir; INT s.13).`,
      viz: [dataViz(P), tlcViz(R, false)],
    });
    steps.push({
      kind: 'choice',
      prompt: `TLC = ${d(R.TLC)} min/pc (${T1h} = ${d(R.c1)}, ${T2h} / Q = ${d(R.c2)}, ${T3h} / BQ = ${d(R.c3)}). Toplam süre TTLC'de hangi terim baskındır?`,
      options: termNames.map((h, i) => ({ html: h, correct: i === R.dom })),
      explain: `TTLC terimleri: B·Q·${T1h} = ${d(R.tA)}, B·${T2h} = ${d(R.tB)}, ${T3h} = ${d(R.tC)} min → en büyüğü <b>${termNames[R.dom]}</b>. TLC'deki üç bileşen bu terimlerin BQ'ya bölünmüş hâli olduğundan sıralama aynıdır (INT s.12–13).`,
    });
    steps.push({
      kind: 'number',
      prompt: `TTLC = ${d(R.TTLC)} min içinde her terimin payı (%) nedir?`,
      fields: [
        { label: `B·Q·${T1h} payı (%)`, answer: R.shares[0], unit: '%' },
        { label: `B·${T2h} payı (%)`, answer: R.shares[1], unit: '%' },
        { label: `${T3h} payı (%)`, answer: R.shares[2], unit: '%' },
      ],
      explain: `${d(R.tA)} / ${d(R.TTLC)} = ${d(R.shares[0])}%; ${d(R.tB)} / ${d(R.TTLC)} = ${d(R.shares[1])}%; ${d(R.tC)} / ${d(R.TTLC)} = ${d(R.shares[2])}% (toplam 100%). Aynı paylar TLC bileşenlerinde de geçerlidir: ${d(R.c1)} / ${d(R.TLC)} = ${d(R.shares[0])}% (TLC = TTLC / BQ, INT s.13).`,
    });
    const chgFields = isA
      ? [{ label: `Yeni ${T1h} (min/pc)`, answer: RS.n1 }, { label: `Yeni ${T2h} (min/batch)`, answer: RS.n2 }]
      : [{ label: `Yeni ${T2h} (min/batch)`, answer: RS.n2 }, { label: `Yeni ${T3h} (min)`, answer: RS.n3 }];
    steps.push({
      kind: 'number',
      prompt: `Senaryo — ${scenTxt} Azalan süreleri dakika olarak hesapla.`,
      fields: chgFields,
      hint: '%p azalma → yeni değer = eski × (1 − p/100).',
      explain: isA
        ? `${T1h}' = ${d(R.T1)} × ${d(F(100 - s.x).div(100))} = <b>${d(RS.n1)} min/pc</b>; ${T2h}' = ${d(R.T2)} × ${d(F(100 - s.y).div(100))} = <b>${d(RS.n2)} min/batch</b>; ${T3h} = ${d(R.T3)} min aynı kalır. Automation esas olarak ${T1h} ve ${T2h}'yi azaltır (INT s.14).`
        : `${T2h}' = ${d(R.T2)} × ${d(F(100 - s.y).div(100))} = <b>${d(RS.n2)} min/batch</b>; ${T3h}' = ${d(R.T3)} × ${d(F(100 - s.z).div(100))} = <b>${d(RS.n3)} min</b>; ${T1h} = ${d(R.T1)} min/pc aynı kalır. CAD/CAM en çok ${T2h} ve ${T3h} üzerinde etkilidir (INT s.14).`,
    });
    steps.push({
      kind: 'number',
      prompt: `Yeni değerlerle (${T1h}' = ${d(RS.n1)} min/pc, ${T2h}' = ${d(RS.n2)} min/batch, ${T3h}' = ${d(RS.n3)} min; B ve Q aynı) yeni T<sub>LC</sub>'yi ve mevcut TLC = ${d(R.TLC)} min/pc'ye göre yüzde iyileşmeyi bul.`,
      fields: [{ label: "Yeni TLC (min/pc)", answer: RS.TLC }, { label: 'TLC iyileşmesi (%)', answer: RS.imp, unit: '%' }],
      explain: `<div class="model">TLC' = ${d(RS.m1)} + ${d(RS.n2)} / ${P.Q} + ${d(RS.n3)} / ${d(R.BQ)} = ${d(RS.m1)} + ${d(RS.m2)} + ${d(RS.m3)} = ${d(RS.TLC)} min/pc</div>İyileşme = (${d(R.TLC)} − ${d(RS.TLC)}) / ${d(R.TLC)} = <b>${d(RS.imp)}%</b>. Kontrol: TTLC' / (BQ) = ${d(RS.TTLC)} / ${d(R.BQ)} = ${d(RS.TLC)} ✓. İyileşme, azaltılan terimlerin TLC içindeki payına bağlıdır (TLC formülü, INT s.13).`,
      viz: [dataViz(P), tlcViz(R, true)],
    });
    const techOpts = [
      { key: 'automation', html: `Esas olarak ${T1h} ve ${T2h} — özellikle ${T1h}` },
      { key: 'cadcam', html: `Üç terimle de ilişkili, ama en çok ${T2h} ve ${T3h}` },
      { key: 'x1', html: `Yalnızca ${T3h} (tasarım süresi)` },
      { key: 'x2', html: 'Yalnızca B ve Q (parti sayısı ve parti büyüklüğü)' },
    ];
    steps.push({
      kind: 'choice',
      prompt: `INT s.14'e göre <b>${TECH[s.kind].name}</b> teknolojisi hangi zaman terimleriyle ilişkilidir?`,
      options: techOpts.map((o) => ({ html: o.html, correct: o.key === s.kind })),
      explain: `INT s.14: "Automation technologies is related with the decrease for T1 and T2, especially T1. CAD/CAM technology is related with all of the three terms. However, it mostly focuses on T2 and T3." Senaryodaki azaltmalar bu yüzden ${isA ? `${T1h} ve ${T2h}` : `${T2h} ve ${T3h}`} üzerindeydi.`,
    });
    const dblB = P.dbl === 'B';
    steps.push({
      kind: 'multi',
      prompt: `Diğer her şey sabitken <b>${dblB ? 'parti sayısı B' : 'parti büyüklüğü Q'}</b> iki katına çıkarsa TLC = ${T1h} + ${T2h} / Q + ${T3h} / BQ içindeki hangi bileşen(ler) küçülür? (birden fazla seçilebilir)`,
      options: [
        { html: T1h, correct: false },
        { html: `${T2h} / Q`, correct: !dblB },
        { html: `${T3h} / BQ`, correct: true },
      ],
      keepOrder: true,
      explain: dblB
        ? `B yalnızca ${T3h} / BQ'nun paydasındadır: tasarım süresi daha çok ürüne yayılır (${R.c3.div(2).isNice(2) ? `${d(R.c3)} → ${d(R.c3.div(2))} min/pc` : 'yarıya iner'}). ${T2h} / Q parti başına süreyi parti içindeki ürünlere böler, B'den bağımsızdır; ${T1h} birim süredir (INT s.13).`
        : `Q hem ${T2h} / Q hem ${T3h} / BQ paydasındadır: hazırlık süresi daha büyük partiye, tasarım süresi daha çok ürüne yayılır. ${T1h} birim üretim süresi değişmez (INT s.13).`,
    });

    return {
      title: 'Ürün yaşam döngüsü zaman analizi (TTLC, TLC)',
      statement: `<p>Bir ürün tipinin yaşam döngüsü verileri: birim üretim süresi ${T1h} = <b>${d(P.T1)} min/pc</b>, parti başına planlama + hazırlık süresi ${T2h} = <b>${d(P.T2h)} h/batch</b>, tasarım süresi ${T3h} = <b>${d(P.T3h)} h</b> (ürün tipi başına bir kez). Ömür boyunca <b>B = ${P.B}</b> parti, ortalama <b>Q = ${P.Q}</b> pc/batch üretilir.</p>
        <div class="model">TTLC = B Q T1 + B T2 + T3
TLC  = T1 + T2 / Q + T3 / BQ</div>
        <p>Ardından senaryo: ${scenTxt}</p>
        <p class="note">${SRC}. Hesapları dakika cinsinden yap; sayıları ondalık gir (ör. 12.5).</p>`,
      viz: dataViz(P),
      steps,
      solution: `<p>TTLC = ${d(R.TTLC)} min = ${d(R.TTLCh)} h; TLC = ${d(R.TLC)} min/pc (baskın terim: ${termNames[R.dom]}). ${TECH[s.kind].name} senaryosunda TLC' = ${d(RS.TLC)} min/pc, iyileşme ${d(RS.imp)}%.</p>`,
      data: { P, R },
    };
  }

  IM.registerDrill({
    id: 'tlc-time',
    topic: '1.2',
    title: 'TTLC ve TLC: yaşam döngüsü zaman analizi',
    description: 'T1, T2, T3, B, Q verisiyle toplam yaşam döngüsü süresi TTLC = BQT1 + BT2 + T3 ve birim başına ortalama TLC = T1 + T2/Q + T3/BQ; baskın terim, automation ya da CAD/CAM senaryosunda yeni TLC ve yüzde iyileşme (INT s.12–14).',
    options: [
      {
        key: 'scenario',
        label: 'Senaryo',
        type: 'select',
        default: 'mix',
        choices: [
          { value: 'mix', label: 'Karışık' },
          { value: 'automation', label: 'Automation (T1, T2 azalır)' },
          { value: 'cadcam', label: 'CAD/CAM (T2, T3 azalır)' },
        ],
      },
    ],
    solve,
    gen,
    TECH,
    generate: (rng, opts) => build(rng, opts || {}),
  });
})();
