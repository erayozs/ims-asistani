/* 2.10 · Overall Equipment Effectiveness (LEAN s.184–189; s.189 görsel: "Equipment / Six big losses / Calculation of OEE").
   Formüller (notların yazımıyla):
     Net available run time (= loading time) = Gross time available − Planned downtime (mola, planlı bakım)        (LEAN s.187)
     Availability = (loading time − downtime) / loading time × 100;  downtime losses = setup + machine breakdown      (s.187, s.189)
     Performance efficiency = theoretical cycle time × processed amount / operating time × 100                      (s.189)
                            (= theoretical cycle time / realized cycle time, s.188)
     Rate of quality products = (processed amount − defect amount) / processed amount × 100                         (s.189)
     OEE = Availability × Performance efficiency × Rate of quality products                                         (s.185, s.189)
   Zaman zinciri (s.189 şekli): loading time → operating time (− downtime losses) → net operating time (− speed losses)
     → valuable operating time (− defect losses). Şekilden: net operating = theoretical CT × processed, valuable = theoretical CT × (processed − defect).
   Six big losses (s.189): 1 equipment failure, 2 setup & adjustment (downtime losses) · 3 idling & minor stoppages, 4 reduced speed
     (speed losses) · 5 defects in process, 6 reduced yield (defect losses). s.184: time / speed / quality losses.
   Adımlar: [loading time] → operating time → A% → P% → Q% → net/valuable operating time → OEE% → kayıp sınıflandırması → en düşük faktör.
   Notes seçeneği (s.189): 460 dk, downtime 60 → A = 86.96% (slayt 87%), 0.5 dk/adet × 400 / 400 dk = 50%, (400 − 8)/400 = 98%,
     OEE = 42.61% (slayt 0.87 × 0.50 × 0.98 = 42.6%); tol ile ikisi kabul.
   Kalite kapıları (rastgele): A, P, Q, OEE yüzdeleri ≤2 ondalık; A 70–96%, P 55–97%, Q 90–99.5%; A, P, Q farklı (en düşük tek).
   Bağımsız kontrol: OEE = A·P·Q = valuable operating time / loading time.
   Dışa açık: IM.drills.oee.solve(P), .gen(rng, opts) */
(function () {
  const IM = window.IM;
  const F = IM.F;
  const pc = (r) => r.mul(100).show(); // oran → yüzde metni (sayı)

  // P = { G?, breaks?, pm?, L?, setup, breakdown, ct (Frac, dk/adet), N, defects }
  function solve(P) {
    const L = P.L != null ? F(P.L) : F(P.G).sub(P.breaks).sub(P.pm);
    const DT = F(P.setup).add(P.breakdown);
    const O = L.sub(DT);
    const ct = F(P.ct);
    const A = O.div(L);
    const netOp = ct.mul(P.N);
    const Pf = netOp.div(O);
    const good = F(P.N).sub(P.defects);
    const Q = good.div(P.N);
    const val = ct.mul(good);
    const OEE = A.mul(Pf).mul(Q);
    const OEE2 = val.div(L);
    if (!OEE.eq(OEE2)) throw new Error('oee: A·P·Q ≠ valuable/loading');
    const realCT = O.div(P.N);
    if (!ct.div(realCT).eq(Pf)) throw new Error('oee: P ≠ theoretical CT / realized CT');
    return { L, DT, O, A, netOp, Pf, good, Q, val, OEE, realCT, speed: O.sub(netOp), defect: netOp.sub(val) };
  }

  // notlarda downtime (60 dk) setup/arıza olarak ayrıştırılmamış: solve için 60 + 0
  const NOTES = { notes: true, L: 460, setup: 60, breakdown: 0, ct: F('0.5'), N: 400, defects: 8 };
  const notesP = () => Object.assign({}, NOTES);

  const EVENTS = [
    { t: 'Öğle yemeği ve çay molaları', g: 0 },
    { t: 'Takvime bağlı planlı (periyodik) bakım', g: 0 },
    { t: 'Rulman kırıldı; makine onarım için durdu', g: 1 },
    { t: 'Ürün değişiminde kalıp değiştirme ve deneme–ayar yapıldı', g: 1 },
    { t: 'Malzeme sıkışması yüzünden sık sık birkaç saniyelik kısa duruşlar oluyor', g: 2 },
    { t: 'Makine yaşlandığı için gerçekleşen çevrim süresi teorik çevrim süresinden uzun', g: 2 },
    { t: 'Proses içinde hatalı çıkan, hurdaya ayrılan ya da yeniden işlenen parçalar', g: 3 },
  ];
  const GROUPS = [
    "Planned downtime → loading time'dan önce düşülür (OEE kaybı sayılmaz)",
    'Downtime losses (equipment failure, setup & adjustment) → Availability',
    'Speed losses (idling & minor stoppages, reduced speed) → Performance efficiency',
    'Defect losses (defects in process, reduced yield) → Rate of quality',
  ];

  function gen(rng, opts) {
    if (opts && opts.notes) return notesP();
    const CTS = [40, 50, 60, 75, 80, 100, 120, 125, 150, 200]; // yüzde birim: 0.40 … 2.00 dk/adet
    for (let t = 0; t < 600; t++) {
      const G = rng.pick([480, 510, 540, 600]);
      const breaks = rng.pick([30, 40, 45, 50, 60]);
      const pm = rng.pick([0, 10, 15, 20, 30]);
      const L = G - breaks - pm;
      const c = rng.pick(CTS);
      // processed amount: c·N/100 ∈ [0.45L, 0.9L]
      const nLo = Math.ceil((0.45 * L * 100) / c), nHi = Math.floor((0.9 * L * 100) / c);
      if (nHi < nLo) continue;
      // processed amount + kusurlu adet: Q% ve OEE% ≤2 ondalık, 90 ≤ Q ≤ 99.5
      let N = 0, d = 0;
      for (let u = 0; u < 40 && !N; u++) {
        const n = rng.int(nLo, nHi);
        const ds = [];
        for (let k = Math.ceil(n / 200); k <= Math.floor(n * 0.1); k++) if ((10000 * k) % n === 0 && (100 * c * (n - k)) % L === 0) ds.push(k);
        if (ds.length) { N = n; d = rng.pick(ds); }
      }
      if (!N) continue;
      // operating time adayları
      const Os = [];
      for (let O = Math.ceil(0.7 * L); O <= Math.floor(0.96 * L); O++) {
        if ((10000 * O) % L !== 0) continue; // A%
        if ((100 * c * N) % O !== 0) continue; // P%
        const P100 = c * N; // P = c·N / (100·O)
        if (P100 < 55 * O || P100 > 97 * O) continue;
        if (L - O < 10) continue;
        Os.push(O);
      }
      if (!Os.length) continue;
      const O = rng.pick(Os);
      const DT = L - O;
      const setup = rng.int(5, DT - 5);
      const P = { notes: false, G, breaks, pm, setup, breakdown: DT - setup, ct: F(c).div(100), N, defects: d };
      const S = solve(P);
      const vals = [S.A, S.Pf, S.Q];
      if (new Set(vals.map((v) => v.exact())).size < 3) continue;
      if (![S.A, S.Pf, S.Q, S.OEE].every((v) => v.mul(100).isNice(2))) continue;
      return P;
    }
    throw new Error('oee: uygun örnek bulunamadı');
  }

  function chainViz(P, S, rows, cap) {
    const mn = (x) => x.show() + ' dk';
    const all = [];
    if (!P.notes) all.push({ label: 'Gross time', segs: [{ v: S.L.toNumber(), cls: 's1' }, { v: P.breaks + P.pm, cls: 'dim', label: 'planlı' }], total: mn(F(P.G)) });
    all.push({ label: 'Loading time', segs: [{ v: S.L.toNumber(), cls: 's1', label: S.L.show() }], total: mn(S.L) });
    all.push({ label: 'Operating', segs: [{ v: S.O.toNumber(), cls: 's1', label: S.O.show() }, { v: S.DT.toNumber(), cls: 'dim', label: 'downtime' }], total: mn(S.O) });
    all.push({ label: 'Net operating', segs: [{ v: S.netOp.toNumber(), cls: 's1', label: S.netOp.show() }, { v: S.speed.toNumber(), cls: 's2', label: 'speed' }, { v: S.DT.toNumber(), cls: 'dim' }], total: mn(S.netOp) });
    all.push({ label: 'Valuable', segs: [{ v: S.val.toNumber(), cls: 'hl', label: S.val.show() }, { v: S.defect.toNumber(), cls: 's3' }, { v: S.speed.toNumber(), cls: 's2' }, { v: S.DT.toNumber(), cls: 'dim' }], total: mn(S.val) });
    return {
      type: 'stack', max: P.notes ? S.L.toNumber() : P.G, rows: all.slice(0, rows),
      caption: cap || 'Zaman zinciri ve kayıplar (LEAN s.189)',
      legend: [{ cls: 'dim', label: 'Downtime / planlı duruş' }, { cls: 's2', label: 'Speed losses' }, { cls: 's3', label: 'Defect losses' }, { cls: 'hl', label: 'Valuable operating time' }],
    };
  }

  IM.registerDrill({
    id: 'oee',
    topic: '2.10',
    title: 'OEE · Availability × Performance × Quality',
    description: 'Loading time, operating time, availability, performance efficiency, rate of quality ve OEE; six big losses sınıflandırması (LEAN s.184–189).',
    options: [{ key: 'notes', label: 'Ders notundaki örneği kullan (460 dk, LEAN s.189)', type: 'checkbox', default: false }],
    solve,
    gen,
    generate(rng, opts) {
      opts = opts || {};
      const P = gen(rng, opts);
      const S = solve(P);
      const N = !!P.notes;
      const R = N ? 0 : 1; // gross time satırı kaydırması
      const ctS = F(P.ct).show();
      const ev = rng.pick(EVENTS);

      const statement = N
        ? `<p><b>Ders notu (LEAN s.189):</b> Bir makinenin yükleme süresi (loading time) <b>460 dk</b>; arıza ve hazırlık–ayar kaynaklı duruş (downtime) <b>60 dk</b>.
           Teorik çevrim süresi <b>0.5 dk/adet</b>, işlenen miktar <b>400 adet</b>, hatalı (defect) miktar <b>8 adet</b>.</p>
           <div class="model">OEE = Availability × Performance efficiency × Rate of quality products   (LEAN s.185, s.189)</div>`
        : `<p>Bir vardiyada brüt kullanılabilir süre (gross time available) <b>${P.G} dk</b>. Planlı duruşlar: molalar <b>${P.breaks} dk</b>${P.pm ? `, planlı bakım <b>${P.pm} dk</b>` : ' (planlı bakım yok)'}.
           Vardiya içinde hazırlık–ayar (setup & adjustment) <b>${P.setup} dk</b>, makine arızası (equipment failure) <b>${P.breakdown} dk</b> sürdü.</p>
           <p>Teorik çevrim süresi <b>${ctS} dk/adet</b>, işlenen miktar <b>${P.N} adet</b>, hatalı (defect) miktar <b>${P.defects} adet</b>.</p>
           <div class="model">OEE = Availability × Performance efficiency × Rate of quality products   (LEAN s.185, s.189)</div>
           <p class="note">Notlardaki örnek: LEAN s.189 (460 dk, OEE = 42.6%); bu soru aynı yöntemle üretildi.</p>`;

      const steps = [];
      if (!N) {
        steps.push({
          kind: 'number',
          prompt: 'Yükleme süresi (loading time = net available run time) kaç dakikadır?',
          fields: [{ label: 'Loading time (min)', answer: S.L }],
          hint: 'Net available run time = gross time available − planned downtime (molalar, planlı bakım) — LEAN s.187.',
          explain: `Loading time = ${P.G} − ${P.breaks}${P.pm ? ' − ' + P.pm : ''} = <b>${S.L.show()}</b> dk. Planlı duruşlar (mola, planlı bakım) OEE kaybı sayılmaz; baştan düşülür (LEAN s.187).`,
          viz: chainViz(P, S, 2),
        });
      }
      steps.push({
        kind: 'number',
        prompt: N
          ? 'Loading time 460 dk, downtime 60 dk. Operating time kaç dakikadır?'
          : `Loading time ${S.L.show()} dk ile operating time (çalışma süresi) kaç dakikadır?`,
        fields: [{ label: 'Operating time (min)', answer: S.O }],
        hint: 'Downtime losses = setup (hazırlık–ayar) + makine arızası; operating time = loading time − downtime losses.',
        explain: N
          ? `Operating time = 460 − 60 = <b>400</b> dk (LEAN s.189).`
          : `Downtime losses = ${P.setup} + ${P.breakdown} = ${S.DT.show()} dk → operating time = ${S.L.show()} − ${S.DT.show()} = <b>${S.O.show()}</b> dk (LEAN s.187).`,
        viz: chainViz(P, S, 2 + R),
      });
      steps.push({
        kind: 'number',
        prompt: `Operating time ${S.O.show()} dk, loading time ${S.L.show()} dk. Availability (%) nedir?`,
        fields: [{ label: 'Availability (%)', answer: S.A.mul(100), unit: '%', tol: N ? 0.05 : undefined }],
        hint: 'Availability = (loading time − downtime) / loading time × 100.',
        explain: `Availability = (${S.L.show()} − ${S.DT.show()}) / ${S.L.show()} × 100 = <b>${pc(S.A)}%</b>${N ? ' (slayt 87%; ikisi de kabul, LEAN s.189)' : ' (LEAN s.187, s.189)'}.`,
      });
      const realTxt = S.realCT.isNice(2) || N
        ? ` Eşdeğer yol (LEAN s.188): gerçekleşen çevrim süresi = ${S.O.show()} / ${P.N} = ${S.realCT.show()} dk/adet → ${F(P.ct).show()} / ${S.realCT.show()} = ${pc(S.Pf)}%.`
        : '';
      steps.push({
        kind: 'number',
        prompt: `Operating time ${S.O.show()} dk, teorik çevrim süresi ${F(P.ct).show()} dk/adet, işlenen miktar ${P.N} adet. Performance efficiency (%) nedir?`,
        fields: [{ label: 'Performance efficiency (%)', answer: S.Pf.mul(100), unit: '%' }],
        hint: 'Performance efficiency = theoretical cycle time × processed amount / operating time × 100.',
        explain: `Performance efficiency = ${F(P.ct).show()} × ${P.N} / ${S.O.show()} × 100 = ${S.netOp.show()} / ${S.O.show()} × 100 = <b>${pc(S.Pf)}%</b>.${realTxt}`,
      });
      steps.push({
        kind: 'number',
        prompt: `İşlenen ${P.N} adetin ${P.defects} adedi hatalı. Rate of quality products (%) nedir?`,
        fields: [{ label: 'Rate of quality (%)', answer: S.Q.mul(100), unit: '%' }],
        hint: 'Rate of quality = (processed amount − defect amount) / processed amount × 100.',
        explain: `Rate of quality = (${P.N} − ${P.defects}) / ${P.N} × 100 = ${S.good.show()} / ${P.N} × 100 = <b>${pc(S.Q)}%</b> (LEAN s.186, s.189).`,
      });
      steps.push({
        kind: 'number',
        prompt: `Zaman zinciri (LEAN s.189 şekli): net operating time = teorik CT × işlenen miktar, valuable operating time = teorik CT × sağlam miktar. İkisi kaç dakikadır?`,
        fields: [
          { label: 'Net operating time (min)', answer: S.netOp },
          { label: 'Valuable operating time (min)', answer: S.val },
        ],
        explain: `Net operating = ${F(P.ct).show()} × ${P.N} = <b>${S.netOp.show()}</b> dk (operating time − speed losses ${S.speed.show()} dk);
          valuable operating = ${F(P.ct).show()} × ${S.good.show()} = <b>${S.val.show()}</b> dk (net operating − defect losses ${S.defect.show()} dk).
          (Şekildeki zincirden çıkarım; notlarda bu iki süre sayısal verilmez.)`,
        viz: chainViz(P, S, 4 + R),
      });
      steps.push({
        kind: 'number',
        prompt: `Availability ${pc(S.A)}%, performance efficiency ${pc(S.Pf)}%, rate of quality ${pc(S.Q)}%. OEE (%) nedir?`,
        fields: [{ label: 'OEE (%)', answer: S.OEE.mul(100), unit: '%', tol: N ? 0.05 : undefined }],
        hint: 'OEE = Availability × Performance efficiency × Rate of quality products.',
        explain: N
          ? `OEE = 0.8696 × 0.50 × 0.98 × 100 = <b>${pc(S.OEE)}%</b>; slayt yuvarlanmış A ile 0.87 × 0.50 × 0.98 × 100 = <b>42.6%</b> yazar (LEAN s.189) — ikisi de kabul.
             Bağımsız kontrol: valuable operating time / loading time = 196 / 460 × 100 = ${pc(S.OEE)}%.`
          : `OEE = ${pc(S.A)}% × ${pc(S.Pf)}% × ${pc(S.Q)}% = <b>${pc(S.OEE)}%</b>.
             Bağımsız kontrol: valuable operating time / loading time = ${S.val.show()} / ${S.L.show()} × 100 = ${pc(S.OEE)}% ✓ (A·P·Q'da operating time ve işlenen miktar sadeleşir).`,
        viz: [chainViz(P, S, 4 + R), {
          type: 'bars', labels: ['A', 'P', 'Q', 'OEE'], values: [S.A, S.Pf, S.Q, S.OEE].map((v) => v.mul(100).toNumber()),
          valueLabels: [S.A, S.Pf, S.Q, S.OEE].map((v) => pc(v) + '%'), highlight: [3], yLabel: '%', caption: 'OEE bileşenleri (%)',
        }],
      });
      steps.push({
        kind: 'choice',
        prompt: `Aynı makinede şu durum gözleniyor: <b>“${ev.t}”</b>. Bu kayıp OEE hesabında nereye yazılır?`,
        options: GROUPS.map((g, i) => ({ html: g, correct: i === ev.g })),
        keepOrder: true,
        explain: `Doğru: <b>${GROUPS[ev.g]}</b>. Six big losses (LEAN s.189): 1 equipment failure, 2 setup & adjustment → downtime losses (availability);
          3 idling & minor stoppages, 4 reduced speed → speed losses (performance); 5 defects in process, 6 reduced yield → defect losses (quality).
          Mola ve planlı bakım planned downtime'dır: gross time'dan düşülerek loading time bulunur (LEAN s.187). s.184'teki gruplama: time / speed / quality losses.`,
      });
      const facs = [['Availability', S.A], ['Performance efficiency', S.Pf], ['Rate of quality', S.Q]];
      const minI = facs.reduce((b, f, i) => (f[1].lt(facs[b][1]) ? i : b), 0);
      steps.push({
        kind: 'choice',
        prompt: 'OEE\'yi en çok aşağı çeken (en düşük) faktör hangisidir? İyileştirme önce buraya odaklanmalıdır.',
        options: facs.map((f, i) => ({ html: f[0], correct: i === minI })),
        keepOrder: true,
        explain: `${facs.map((f) => `${f[0]} ${pc(f[1])}%`).join(', ')} → en düşük: <b>${facs[minI][0]}</b>.
          ${['Arıza ve setup sürelerini azalt (TPM, SMED).', 'Kısa duruşları ve hız kaybını azalt (bakımla gerçekleşen çevrim süresini teorik değere yaklaştır, LEAN s.188).', 'Hatalı ürün üretimini bakım ve proses kontrolüyle azalt (LEAN s.186).'][minI]}
          Hedef OEE\'yi maksimize etmek, yani üç kayıp grubunu da en aza indirmektir (LEAN s.184).`,
      });

      return {
        title: N ? 'OEE · ders notu örneği (LEAN s.189)' : 'OEE · Availability × Performance × Quality',
        statement,
        viz: chainViz(P, S, 1),
        steps,
        solution: `<div class="model">A = ${pc(S.A)}% · P = ${pc(S.Pf)}% · Q = ${pc(S.Q)}% → OEE = ${pc(S.OEE)}%${N ? ' (slayt 42.6%)' : ''}</div>`,
        data: { P, S, A: S.A, Pf: S.Pf, Q: S.Q, OEE: S.OEE, event: ev, lowest: facs[minI][0] },
      };
    },
  });
})();
