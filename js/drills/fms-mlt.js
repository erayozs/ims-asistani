/* 3.2 · Doğrudan maliyetler, MLT ve makine–iş parçası zaman analizi — drill `fms-mlt` (Traditional_FMS comparison, FMS s.5–10).
   Notların yazımıyla:
     MLT = Σ_{i=1}^{nm} ( Tsu_i + Q To_i + Tno_i )        (FMS s.7)  i = operasyon no, nm = operasyon sayısı, Q = parti büyüklüğü,
        Tsu_i = setup time, To_i = operating time, Tno_i = non-processing time (process delay, transportation, inspection …)
     To = Tm + Th + Tth                                    (FMS s.8; slaytta yazım hatası "To = Tm + Tm + Tth" — Tm iki kez yazılmış)
        Tm = processing time, Th = loading time, Tth = tool changing time
     FMS s.9: Tm ↓ CAM toolpath optimization module · Th ↓ pallet ve robot kollarıyla otomatik yükleme ·
        Tth ↓ CNC tezgâhlarında otomatik takım değiştirme (takım deposu: CNC tornada turret, işleme merkezinde magazine) ·
        Tno ↓ automatic handling system (daha az taşıma) + computer aided process planning (daha az process delay).
     FMS s.10 (machine–workpiece time analysis): geleneksel Tm/To %30, To/Tml %5; FMS pessimistic %65 / %7.5,
        probable %79 / %10, optimistic %95 / %15; (Th ∪ Tth)/To %70 → %35 / %21 / %7; (Tno ∪ Tsu)/Tml %95 → %92.5 / %90 / %85.
     Bu drill'de parça düzeyinde: Tm/To = ΣTm / ΣTo, To/MLT = Q·ΣTo / MLT (yüzde).
   Notlarda sayısal parça örneği YOK → `notes` seçeneği yok; açıklamalarda "(notlarda sayısal örnek yok; formül FMS s.7–8)".
   Üretim (rejection sampling, ≤600 deneme): 2–3 operasyon; geleneksel Tm, Th, Tth 0.5 adımlı; To/MLT hedef yüzdesi q seçilip
     MLT = 100·Q·ΣTo / q tam sayı olacak şekilde Tno'lar tamamlanır. FMS: Tm %10–30, Th ve Tth %50–90 (son operasyonun Tth'si ve Tth' oranı temiz yüzde verecek adaylardan seçilir), Tsu %50–80 azalır;
     FMS To/MLT hedefi q' > q aday listesinden, Tno' her operasyonda azalır.
   Kalite kapıları: her değer ≤2 ondalık (isNice(2)); geleneksel Tm/To %15–50; FMS Tm/To ≥ geleneksel + 10 puan;
     q' > q (slayt 10 eğilimi: iki oran da artar); MLT azalması %30–95; her Tno_i' < Tno_i, Tsu_i' < Tsu_i.
   Bağımsız kontrol: MLT operasyon toplamı Σ(Tsu_i + Q·To_i + Tno_i) = bileşen toplamı ΣTsu + Q·ΣTo + ΣTno (eşit değilse throw).
   Dışa açık: IM.drills['fms-mlt'].solve(sys, Q) (saf; sys = [{Tsu, Tm, Th, Tth, Tno}] operasyonlar), .gen(rng) → P, .SLIDE10, .FEATURES.
   P = { nm, Q, trad:[op], fms:[op], comp:'Tm'|'Th'|'Tth', group:'To'|'Tno' } — sayılar Frac. */
(function () {
  const IM = window.IM;
  const F = IM.F;
  const d = (x) => F(x).show();
  const S = (t) => `<sub>${t}</sub>`;
  const T = (s, i) => `T${S(i != null ? s + i : s)}`;
  const SRC = '(notlarda sayısal örnek yok; formül FMS s.7–8)';
  const TYPO = '(slaytta yazım hatası: "To = Tm + Tm + Tth" — Tm iki kez yazılmış; doğrusu To = Tm + Th + Tth, Th = loading time)';

  const SLIDE10 = {
    TmTo: { trad: 30, pess: 65, prob: 79, opt: 95 },
    ToMLT: { trad: 5, pess: 7.5, prob: 10, opt: 15 },
  };
  const FEATURES = {
    toolpath: { html: 'CAM sistemlerinde toolpath optimization module', reduces: 'Tm', group: 'To' },
    loading: { html: 'Pallet ve robot kollarıyla otomatik yükleme (automatic loading)', reduces: 'Th', group: 'To' },
    toolchange: { html: 'CNC tezgâhlarında otomatik takım değiştirme (turret / magazine)', reduces: 'Tth', group: 'To' },
    handling: { html: 'Otomatik malzeme taşıma sistemi (automatic handling system)', reduces: 'Tno', group: 'Tno' },
    capp: { html: 'Computer aided process planning (CAPP)', reduces: 'Tno', group: 'Tno' },
  };
  const COMP_NAME = { Tm: 'T<sub>m</sub> (processing time)', Th: 'T<sub>h</sub> (loading time)', Tth: 'T<sub>th</sub> (tool changing time)' };

  // ------------------------------------------------------------------ saf çözüm
  const sum = (a) => a.reduce((x, y) => x.add(y), F(0));
  function solve(sys, Q) {
    Q = F(Q);
    const ops = sys.map((o) => {
      const To = F(o.Tm).add(F(o.Th)).add(F(o.Tth));
      return { To, contrib: F(o.Tsu).add(Q.mul(To)).add(F(o.Tno)) };
    });
    const MLT = sum(ops.map((o) => o.contrib)); // yol 1: operasyon toplamı
    const sTsu = sum(sys.map((o) => F(o.Tsu))), sTno = sum(sys.map((o) => F(o.Tno)));
    const sTm = sum(sys.map((o) => F(o.Tm))), sTo = sum(ops.map((o) => o.To));
    const QTo = Q.mul(sTo);
    const MLT2 = sTsu.add(QTo).add(sTno); // yol 2: bileşen toplamı
    if (!MLT.eq(MLT2)) throw new Error('fms-mlt: MLT iki yoldan farklı');
    const TmTo = sTm.mul(100).div(sTo);
    const ToMLT = QTo.mul(100).div(MLT);
    return { ops, MLT, sTsu, sTno, sTm, sTo, QTo, TmTo, HtTo: F(100).sub(TmTo), ToMLT, WaitMLT: F(100).sub(ToMLT) };
  }

  const nice = (x) => F(x).isNice(2);
  const half = (rng, lo, hi) => F(rng.int(lo * 2, hi * 2)).div(2);

  // ------------------------------------------------------------------ üretici
  function gen(rng) {
    const Q_S = [10, 20, 25, 40, 50];
    const Q_PCT = [4, 5, 6, 8, 10, 12.5, 15, 16, 20];
    const Q2_PCT = [5, 6, 7.5, 8, 10, 12, 12.5, 15, 16, 20, 24, 25, 30, 40];
    const RM = ['0.1', '0.2', '0.3'], RHT = ['0.1', '0.2', '0.3', '0.4', '0.5'], RS = ['0.2', '0.3', '0.4', '0.5'];
    const RNO = ['0.1', '0.2', '0.3', '0.4', '0.5'];
    for (let tries = 0; tries < 600; tries++) {
      const nm = rng.int(2, 3), Q = F(rng.pick(Q_S));
      const trad = [];
      for (let i = 0; i < nm; i++) trad.push({ Tm: half(rng, 1, 6), Th: half(rng, 0.5, 4), Tth: half(rng, 0.5, 4), Tsu: F(rng.int(2, 12) * 10) });
      // son operasyonun Tth'si, Tm/To yüzdesi temiz ve %15–50 olacak adaylar arasından seçilir
      const sTm = sum(trad.map((o) => o.Tm));
      const tthC = [];
      for (let k = 1; k <= 10; k++) {
        trad[nm - 1].Tth = F(k).div(2);
        const p = sTm.mul(100).div(sum(trad.map((o) => o.Tm.add(o.Th).add(o.Tth))));
        if (nice(p) && p.ge(15) && p.le(50)) tthC.push(trad[nm - 1].Tth);
      }
      if (!tthC.length) continue;
      trad[nm - 1].Tth = rng.pick(tthC);
      const sTo = sum(trad.map((o) => o.Tm.add(o.Th).add(o.Tth)));
      const pTm = sTm.mul(100).div(sTo);
      // geleneksel MLT: To/MLT = q
      const q = F(rng.pick(Q_PCT));
      const MLT = Q.mul(sTo).mul(100).div(q);
      if (!MLT.isInt()) continue;
      const sTsu = sum(trad.map((o) => o.Tsu));
      const sTno = MLT.sub(Q.mul(sTo)).sub(sTsu);
      if (sTno.lt(60 * nm)) continue;
      // Tno'ları böl: ilk nm−1 operasyon 10'un katı, sonuncusu kalan
      let rest = sTno, okSplit = true;
      for (let i = 0; i < nm - 1; i++) {
        const share = rest.toNumber() * (0.25 + 0.35 * rng());
        const v = F(Math.max(30, Math.round(share / 10) * 10));
        trad[i].Tno = v;
        rest = rest.sub(v);
      }
      trad[nm - 1].Tno = rest;
      if (rest.lt(30)) okSplit = false;
      if (!okSplit) continue;
      // FMS
      const fms = trad.map((o) => ({
        Tm: o.Tm.mul(F(1).sub(F(rng.pick(RM)))),
        Th: o.Th.mul(F(rng.pick(RHT))),
        Tth: o.Tth.mul(F(rng.pick(RHT))),
        Tsu: o.Tsu.mul(F(rng.pick(RS))),
      }));
      // son operasyonun FMS Tth oranı: FMS Tm/To temiz ve ≥ geleneksel + 10 puan olacak adaylar arasından
      const fTm = sum(fms.map((o) => o.Tm));
      const rC = RHT.filter((r) => {
        fms[nm - 1].Tth = trad[nm - 1].Tth.mul(F(r));
        const p = fTm.mul(100).div(sum(fms.map((o) => o.Tm.add(o.Th).add(o.Tth))));
        return nice(p) && p.ge(pTm.add(10));
      });
      if (!rC.length) continue;
      fms[nm - 1].Tth = trad[nm - 1].Tth.mul(F(rng.pick(rC)));
      if (!fms.every((o) => nice(o.Tm) && nice(o.Th) && nice(o.Tth) && nice(o.Tsu))) continue;
      const fTo = sum(fms.map((o) => o.Tm.add(o.Th).add(o.Tth)));
      const fTsu = sum(fms.map((o) => o.Tsu));
      // FMS Tno: ilk nm−1 operasyon Tno·r, sonuncusu MLT' hedefinden kalan
      const rs = fms.map(() => F(rng.pick(RNO)));
      const head = sum(trad.slice(0, nm - 1).map((o, i) => o.Tno.mul(rs[i])));
      const cands = [];
      for (const q2v of Q2_PCT) {
        const q2 = F(q2v);
        if (!q2.gt(q)) continue;
        const MLT2 = Q.mul(fTo).mul(100).div(q2);
        if (!nice(MLT2) || !MLT2.mul(10).isInt()) continue;
        const last = MLT2.sub(Q.mul(fTo)).sub(fTsu).sub(head);
        if (!last.gt(0) || !last.lt(trad[nm - 1].Tno) || last.lt(trad[nm - 1].Tno.mul('0.05'))) continue;
        const red = MLT.sub(MLT2).mul(100).div(MLT);
        if (!nice(red) || red.lt(30) || red.gt(95)) continue;
        cands.push({ q2, last });
      }
      if (!cands.length) continue;
      const pick = rng.pick(cands);
      fms.forEach((o, i) => { o.Tno = i < nm - 1 ? trad[i].Tno.mul(rs[i]) : pick.last; });
      const P = { nm, Q, trad, fms, comp: rng.pick(['Tm', 'Th', 'Tth']), group: rng.pick(['To', 'Tno']) };
      const A = solve(trad, Q), B = solve(fms, Q);
      const vals = [A, B].flatMap((R) => R.ops.flatMap((o) => [o.To, o.contrib]).concat([R.MLT, R.sTsu, R.sTno, R.sTm, R.sTo, R.QTo, R.TmTo, R.ToMLT]));
      if (!vals.every(nice)) continue;
      return P;
    }
    throw new Error('fms-mlt: uygun örnek bulunamadı');
  }

  // ------------------------------------------------------------------ görseller
  function opTable(sys, cap) {
    return {
      type: 'matrix',
      caption: cap,
      corner: 'Op.',
      colLabels: ['T<sub>su</sub> (min)', 'T<sub>m</sub> (min/pc)', 'T<sub>h</sub> (min/pc)', 'T<sub>th</sub> (min/pc)', 'T<sub>no</sub> (min)'],
      rowLabels: sys.map((_, i) => i + 1),
      cells: sys.map((o) => [d(o.Tsu), d(o.Tm), d(o.Th), d(o.Tth), d(o.Tno)]),
    };
  }
  function opTableHtml(sys) {
    return `<table><thead><tr><th>Op. i</th><th>T<sub>su,i</sub> (min)</th><th>T<sub>m,i</sub> (min/pc)</th><th>T<sub>h,i</sub> (min/pc)</th><th>T<sub>th,i</sub> (min/pc)</th><th>T<sub>no,i</sub> (min)</th></tr></thead><tbody>${sys
      .map((o, i) => `<tr><td>${i + 1}</td><td>${d(o.Tsu)}</td><td>${d(o.Tm)}</td><td>${d(o.Th)}</td><td>${d(o.Tth)}</td><td>${d(o.Tno)}</td></tr>`)
      .join('')}</tbody></table>`;
  }
  function mltViz(A, B) {
    const row = (lab, R) => ({
      label: lab,
      segs: [{ v: R.sTsu.toNumber(), label: 'Tsu', cls: 's1' }, { v: R.QTo.toNumber(), label: 'Q·To', cls: 's2' }, { v: R.sTno.toNumber(), label: 'Tno', cls: 's3' }],
      total: d(R.MLT) + ' min',
    });
    const rows = [row('Geleneksel', A)];
    if (B) rows.push(row('FMS', B));
    return {
      type: 'stack',
      caption: 'MLT bileşenleri: ΣT<sub>su</sub> + Q·ΣT<sub>o</sub> + ΣT<sub>no</sub> (min)',
      unit: 'min',
      max: A.MLT.toNumber(),
      rows,
      legend: [{ cls: 's1', label: 'ΣT<sub>su</sub>' }, { cls: 's2', label: 'Q·ΣT<sub>o</sub>' }, { cls: 's3', label: 'ΣT<sub>no</sub>' }],
    };
  }

  // ------------------------------------------------------------------ egzersiz
  function build(rng) {
    const P = gen(rng);
    const A = solve(P.trad, P.Q), B = solve(P.fms, P.Q);
    const Q = P.Q, nm = P.nm;
    const red = A.MLT.sub(B.MLT).mul(100).div(A.MLT);
    const ix = P.trad.map((_, i) => i);
    const toLine = (sys, R) => ix.map((i) => `T<sub>o,${i + 1}</sub> = ${d(sys[i].Tm)} + ${d(sys[i].Th)} + ${d(sys[i].Tth)} = ${d(R.ops[i].To)}`).join('; ');
    const contribLine = (sys, R) => ix.map((i) => `Op. ${i + 1}: ${d(sys[i].Tsu)} + ${d(Q)}·${d(R.ops[i].To)} + ${d(sys[i].Tno)} = ${d(R.ops[i].contrib)}`).join('<br>');
    const steps = [];

    steps.push({
      kind: 'number',
      prompt: `<b>Geleneksel sistem.</b> Her operasyonun parça başına operating time'ını (T<sub>o,i</sub>) hesapla.`,
      fields: ix.map((i) => ({ label: `T<sub>o,${i + 1}</sub> (min/pc)`, answer: A.ops[i].To })),
      hint: 'To = Tm + Th + Tth (processing + loading + tool changing).',
      explain: `<div class="model">To = Tm + Th + Tth</div>${toLine(P.trad, A)} min/pc. ${TYPO} (FMS s.8).`,
    });
    steps.push({
      kind: 'number',
      prompt: `Q = ${d(Q)} pc. Her operasyonun MLT'ye katkısını (T<sub>su,i</sub> + Q·T<sub>o,i</sub> + T<sub>no,i</sub>) hesapla (T<sub>o</sub> = ${ix.map((i) => d(A.ops[i].To)).join(', ')} min/pc).`,
      fields: ix.map((i) => ({ label: `Op. ${i + 1} katkısı (min)`, answer: A.ops[i].contrib })),
      explain: `${contribLine(P.trad, A)} (min). Setup ve non-processing süreleri parti başına bir kez, T<sub>o</sub> ise partideki her parça için (Q kez) harcanır (FMS s.7).`,
    });
    steps.push({
      kind: 'number',
      prompt: `Operasyon katkıları ${ix.map((i) => d(A.ops[i].contrib)).join(', ')} min. Geleneksel sistemde partinin üretim süresi (production lead time) MLT nedir?`,
      fields: [{ label: 'MLT<sub>trad</sub> (min)', answer: A.MLT }],
      explain: `<div class="model">MLT = Σ ( Tsui + Q Toi + Tnoi ) = ${ix.map((i) => d(A.ops[i].contrib)).join(' + ')} = ${d(A.MLT)} min</div>Bileşenlerle kontrol: ΣT<sub>su</sub> + Q·ΣT<sub>o</sub> + ΣT<sub>no</sub> = ${d(A.sTsu)} + ${d(Q)}·${d(A.sTo)} + ${d(A.sTno)} = ${d(A.sTsu)} + ${d(A.QTo)} + ${d(A.sTno)} = <b>${d(A.MLT)} min</b> ✓ (FMS s.7). ${SRC}`,
      viz: [opTable(P.trad, 'Geleneksel sistem'), mltViz(A)],
    });
    steps.push({
      kind: 'number',
      prompt: `Makine–iş parçası zaman analizi (geleneksel): ΣT<sub>m</sub> = ${d(A.sTm)} ve ΣT<sub>o</sub> = ${d(A.sTo)} min/pc. Makinede iş parçası varken geçen sürenin (T<sub>o</sub>) ne kadarı gerçek işleme (T<sub>m</sub>), ne kadarı katma değersiz (T<sub>h</sub> ∪ T<sub>th</sub>)?`,
      fields: [
        { label: 'Tm/To (%)', answer: A.TmTo, unit: '%' },
        { label: '(Th ∪ Tth)/To (%)', answer: A.HtTo, unit: '%' },
      ],
      explain: `T<sub>m</sub>/T<sub>o</sub> = ${d(A.sTm)} / ${d(A.sTo)} = <b>${d(A.TmTo)}%</b>; (T<sub>h</sub> ∪ T<sub>th</sub>)/T<sub>o</sub> = 100 − ${d(A.TmTo)} = <b>${d(A.HtTo)}%</b>. Slayt 10'da geleneksel sistem için bu oranlar %30 ve %70'tir (FMS s.10).`,
    });
    steps.push({
      kind: 'number',
      prompt: `MLT<sub>trad</sub> = ${d(A.MLT)} min içinde makine süresinin payı nedir? (Q·ΣT<sub>o</sub> = ${d(Q)} × ${d(A.sTo)} = ${d(A.QTo)} min)`,
      fields: [
        { label: 'To/MLT = Q·ΣTo / MLT (%)', answer: A.ToMLT, unit: '%' },
        { label: '(Tno ∪ Tsu)/MLT (%)', answer: A.WaitMLT, unit: '%' },
      ],
      explain: `T<sub>o</sub>/MLT = ${d(A.QTo)} / ${d(A.MLT)} = <b>${d(A.ToMLT)}%</b>; bekleme + taşıma + setup payı (T<sub>no</sub> ∪ T<sub>su</sub>)/MLT = 100 − ${d(A.ToMLT)} = <b>${d(A.WaitMLT)}%</b>. Geleneksel sistemde MLT'nin büyük kısmı makine dışında geçer (FMS s.10: %5 / %95).`,
    });
    steps.push({
      kind: 'number',
      prompt: `<b>FMS.</b> Aynı parça FMS'te işleniyor (veriler soru metnindeki ikinci tabloda: T<sub>m</sub>, T<sub>h</sub>, T<sub>th</sub>, T<sub>su</sub>, T<sub>no</sub> azaldı). FMS'teki T<sub>o,i</sub> değerlerini hesapla.`,
      fields: ix.map((i) => ({ label: `FMS T<sub>o,${i + 1}</sub> (min/pc)`, answer: B.ops[i].To })),
      explain: `${toLine(P.fms, B)} min/pc. Slayt 9: T<sub>m</sub> CAM toolpath optimization ile, T<sub>h</sub> pallet/robot kollarıyla otomatik yükleme ile, T<sub>th</sub> CNC'de otomatik takım değiştirme ile azalır (FMS s.8–9).`,
      vizDuring: opTable(P.fms, 'FMS'),
    });
    steps.push({
      kind: 'number',
      prompt: `Q = ${d(Q)} pc ve FMS T<sub>o</sub> = ${ix.map((i) => d(B.ops[i].To)).join(', ')} min/pc ile FMS'teki MLT nedir?`,
      fields: [{ label: 'MLT<sub>FMS</sub> (min)', answer: B.MLT }],
      explain: `${contribLine(P.fms, B)}<div class="model">MLT_FMS = ${ix.map((i) => d(B.ops[i].contrib)).join(' + ')} = ${d(B.MLT)} min</div>Kontrol: ${d(B.sTsu)} + ${d(Q)}·${d(B.sTo)} + ${d(B.sTno)} = ${d(B.sTsu)} + ${d(B.QTo)} + ${d(B.sTno)} = ${d(B.MLT)} ✓ (FMS s.7).`,
      viz: [opTable(P.fms, 'FMS'), mltViz(A, B)],
    });
    steps.push({
      kind: 'number',
      prompt: `MLT<sub>trad</sub> = ${d(A.MLT)} min, MLT<sub>FMS</sub> = ${d(B.MLT)} min. MLT yüzde kaç azaldı?`,
      fields: [{ label: 'MLT azalması (%)', answer: red, unit: '%' }],
      explain: `(${d(A.MLT)} − ${d(B.MLT)}) / ${d(A.MLT)} = <b>${d(red)}%</b>. Azalmanın çoğu ΣT<sub>no</sub> (${d(A.sTno)} → ${d(B.sTno)} min) ve ΣT<sub>su</sub>'dan (${d(A.sTsu)} → ${d(B.sTsu)} min) gelir; Q·ΣT<sub>o</sub> ${d(A.QTo)} → ${d(B.QTo)} min (FMS s.9: T<sub>no</sub> ve T<sub>o</sub> azalır).`,
    });
    steps.push({
      kind: 'number',
      prompt: `FMS için aynı oranlar: ΣT<sub>m</sub> = ${d(B.sTm)}, ΣT<sub>o</sub> = ${d(B.sTo)} min/pc, Q·ΣT<sub>o</sub> = ${d(B.QTo)} min, MLT<sub>FMS</sub> = ${d(B.MLT)} min.`,
      fields: [
        { label: 'FMS Tm/To (%)', answer: B.TmTo, unit: '%' },
        { label: 'FMS To/MLT (%)', answer: B.ToMLT, unit: '%' },
      ],
      explain: `T<sub>m</sub>/T<sub>o</sub> = ${d(B.sTm)} / ${d(B.sTo)} = <b>${d(B.TmTo)}%</b> (geleneksel ${d(A.TmTo)}%); T<sub>o</sub>/MLT = ${d(B.QTo)} / ${d(B.MLT)} = <b>${d(B.ToMLT)}%</b> (geleneksel ${d(A.ToMLT)}%). T<sub>h</sub> ve T<sub>th</sub>, T<sub>m</sub>'den çok daha fazla azaldığı için işleme payı artar (FMS s.10).`,
    });
    // kavram 1: bileşen → FMS özelliği
    const featKeys = Object.keys(FEATURES);
    const right = featKeys.find((k) => FEATURES[k].reduces === P.comp);
    steps.push({
      kind: 'choice',
      prompt: `Slayt 9'a göre FMS'te <b>${COMP_NAME[P.comp]}</b> hangi özellik sayesinde azalır?`,
      options: featKeys.map((k) => ({ html: FEATURES[k].html, correct: k === right })),
      explain: `FMS s.9: T<sub>m</sub> ↓ toolpath optimization module for CAM systems; T<sub>h</sub> ↓ automatic loading with pallets and robot arms; T<sub>th</sub> ↓ automatic tool changing in CNC machine tools; T<sub>no</sub> ↓ automatic handling system (taşıma) ve CAPP (process delay).`,
    });
    // kavram 2: To mu Tno mu (multi)
    const grpTo = P.group === 'To';
    steps.push({
      kind: 'multi',
      prompt: grpTo
        ? `Slayt 9'daki MLT şemasına göre hangi FMS özellikleri <b>T<sub>o</sub></b>'yu (operating time) azaltır? (birden fazla seçilebilir)`
        : `Slayt 9'daki MLT şemasına göre hangi FMS özellikleri <b>T<sub>no</sub></b>'yu (non-processing time) azaltır? (birden fazla seçilebilir)`,
      options: featKeys.map((k) => ({ html: FEATURES[k].html, correct: FEATURES[k].group === P.group })),
      explain: grpTo
        ? `T<sub>o</sub> = T<sub>m</sub> + T<sub>h</sub> + T<sub>th</sub> dalı: toolpath optimization (T<sub>m</sub>), otomatik yükleme (T<sub>h</sub>), otomatik takım değiştirme (T<sub>th</sub>). Otomatik taşıma ve CAPP ise T<sub>no</sub> dalındadır (FMS s.9).`
        : `T<sub>no</sub> dalı: "less transportation with automatic handling system" ve "less process delays with computer aided process planning". Diğer üçü T<sub>o</sub>'nun bileşenlerini (T<sub>m</sub>, T<sub>h</sub>, T<sub>th</sub>) azaltır (FMS s.9).`,
    });
    steps.push({
      kind: 'choice',
      prompt: 'Slayt 9: otomatik takım değiştirmede takım deposu (tool storage area) CNC tornalarda ve işleme merkezlerinde (machining centers) nasıl adlandırılır?',
      options: [
        { html: 'CNC torna: turret · İşleme merkezi: magazine', correct: true },
        { html: 'CNC torna: magazine · İşleme merkezi: turret', correct: false },
        { html: 'CNC torna: pallet · İşleme merkezi: robot arm', correct: false },
        { html: 'Her ikisinde de magazine', correct: false },
      ],
      explain: '"Tool storage area in CNC lathes: turrets; tool storage area in machining centers: magazines" (FMS s.9).',
    });
    steps.push({
      kind: 'choice',
      prompt: `Hesapladığın değişim (T<sub>m</sub>/T<sub>o</sub>: ${d(A.TmTo)}% → ${d(B.TmTo)}%, T<sub>o</sub>/MLT: ${d(A.ToMLT)}% → ${d(B.ToMLT)}%) slayt 10'daki tabloyla nasıl örtüşür?`,
      options: [
        { html: 'İki oran da artar — slayt 10: Tm/To %30 → %79, To/MLT %5 → %10 (geleneksel → FMS probable)', correct: true },
        { html: 'İki oran da azalır — slayt 10: Tm/To %79 → %30, To/MLT %10 → %5', correct: false },
        { html: 'Tm/To artar, To/MLT azalır — slayt 10: %30 → %79, %10 → %5', correct: false },
        { html: 'Tm/To azalır, To/MLT artar — slayt 10: %70 → %21, %5 → %10', correct: false },
      ],
      explain: `FMS s.10 (machine–workpiece time analysis): geleneksel Tm/To %30, To/Tml %5; FMS pessimistic %65 / %7.5, <b>probable %79 / %10</b>, optimistic %95 / %15. FMS hem makinede iş parçası varken boşa geçen süreyi (Th ∪ Tth: %70 → %21) hem de MLT içindeki bekleme/taşıma/setup payını ((Tno ∪ Tsu)/Tml: %95 → %90) azaltır; bu yüzden iki oran da artar.`,
    });

    return {
      title: 'MLT ve makine–iş parçası zaman analizi: geleneksel vs FMS',
      statement: `<p>Bir parça ${nm} operasyonda, <b>Q = ${d(Q)}</b> pc'lik partiler hâlinde üretiliyor. Geleneksel sistem verileri:</p>${opTableHtml(P.trad)}
        <p>Aynı parça FMS'te (CAM toolpath optimization, pallet/robot ile otomatik yükleme, otomatik takım değiştirme, otomatik malzeme taşıma + CAPP; setup da kısalıyor):</p>${opTableHtml(P.fms)}
        <div class="model">MLT = Σ ( Tsui + Q Toi + Tnoi ),  i = 1 … nm
To  = Tm + Th + Tth</div>
        <p class="note">${SRC}. T<sub>su</sub>, T<sub>no</sub> parti başına (min); T<sub>m</sub>, T<sub>h</sub>, T<sub>th</sub> parça başına (min/pc). Yüzdeleri yüzde sayısı olarak gir (ör. 37.5).</p>`,
      viz: opTable(P.trad, 'Geleneksel sistem'),
      steps,
      solution: `<p>MLT<sub>trad</sub> = ${d(A.MLT)} min → MLT<sub>FMS</sub> = ${d(B.MLT)} min (−${d(red)}%). T<sub>m</sub>/T<sub>o</sub>: ${d(A.TmTo)}% → ${d(B.TmTo)}%; T<sub>o</sub>/MLT: ${d(A.ToMLT)}% → ${d(B.ToMLT)}%.</p>`,
      data: { P, A, B, red },
    };
  }

  IM.registerDrill({
    id: 'fms-mlt',
    topic: '3.2',
    title: 'MLT: geleneksel sistem vs FMS',
    description: '2–3 operasyonlu bir parça için To = Tm + Th + Tth ve MLT = Σ(Tsu + Q·To + Tno); geleneksel ve FMS değerleriyle MLT, yüzde azalma, Tm/To ve To/MLT oranları; slayt 9 (hangi FMS özelliği hangi süreyi azaltır) ve slayt 10 tablosuyla yorum (FMS s.7–10).',
    solve,
    gen,
    SLIDE10,
    FEATURES,
    generate: (rng) => build(rng),
  });
})();
