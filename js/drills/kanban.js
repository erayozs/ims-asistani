/* 2.7 · Kanban sayısı (LEAN s.113–114, uygulama s.124–130).
   Formül (LEAN s.114, görsel):  KS = ⌈ OT·(1+α)·KCS / KB ⌉⁺   (sonuç YUKARI yuvarlanır)
     OT  = ortalama talep (adet/dk) = günlük talep / günlük çalışma dakikası
     α   = güvenilirlik katsayısı (reliability coefficient)
     KCS = kanban çevrim süresi = receiving box'ta bekleme + order box'a transfer + order box'ta bekleme
           + parti işleme çevrimi (hazırlık + parti işleme + hücre içi bekleme) + supermarkete taşıma + supermarkette bekleme
     KB  = kutu (container) başına adet; her kutu için bir kanban → kutu sayısı = kanban sayısı
   Envanter (LEAN s.129–130): pull sistemde azami stok = Σ KS·KB; push stoğu = Σ kutu·kutu kapasitesi;
     azalma % = (push − pull) / push · 100.
   Adımlar: OT → [parti işleme çevrimi] → KCS → OT·KCS (KCS boyunca talep) → OT·(1+α)·KCS → kesirli KS → ⌈KS⌉ (ayrı adım,
     tam eşleşme) → KS·KB → pull/push toplam stok → % azalma.
   Notes seçeneği = SYK 160 (LEAN s.129): OT = 32 / 540 (slayt 0.059), KCS = 10 + 72 + 810 = 892, α = 0.30, KB = 8 →
     kesirli 8.59 (0.059 ile 8.55) → KS = 9; push 6×30 + 12×18 = 396, pull 9×8 + 6×3 = 90 (SYK 250'nin 6 kanbanı notlarda verilir),
     azalma 77.27% (slayt %77). Yuvarlamalı değerler alan bazında tol ile kabul edilir.
   Kalite kapıları (rastgele): OT, OT·KCS, OT·(1+α)·KCS, kesirli KS, yüzde azalma ≤2 ondalık; kesirli KS tam sayı DEĞİL, 3 ≤ KS ≤ 16;
     azalma %40–90. Bağımsız kontrol: KS = KCS boyunca gereken kutu sayısı (OT·KCS / KB)·(1+α) ve KS en küçük n: n·KB ≥ OT(1+α)KCS.
   Dışa açık: IM.drills.kanban.solve(P), .gen(rng, opts) */
(function () {
  const IM = window.IM;
  const F = IM.F;
  const d = (x) => F(x).show();

  const COMP = [
    { key: 'recv', label: "Receiving box'ta bekleme" },
    { key: 'toOrder', label: "Order box'a transfer" },
    { key: 'orderWait', label: "Order box'ta bekleme" },
    { key: 'setup', label: 'Hazırlık (setup)', batch: true },
    { key: 'proc', label: 'Parti işleme', batch: true },
    { key: 'cellWait', label: 'Hücre içi bekleme', batch: true },
    { key: 'toSm', label: 'Supermarkete taşıma' },
    { key: 'smWait', label: 'Supermarkette bekleme' },
  ];

  // Saf çözüm. P = { OT (Frac), comps:[{label, v, batch?}], alpha, KB, other:{name, KS, KB}, push:[{name, boxes, size}] }
  function solve(P) {
    const OT = F(P.OT), alpha = F(P.alpha), KB = F(P.KB);
    const KCS = P.comps.reduce((a, c) => a.add(c.v), F(0));
    const batch = P.comps.filter((c) => c.batch).reduce((a, c) => a.add(c.v), F(0));
    const need = OT.mul(KCS); // KCS boyunca talep (adet)
    const needSafe = need.mul(F(1).add(alpha)); // güvenlik payıyla
    const ksRaw = needSafe.div(KB);
    const KS = ksRaw.ceil();
    // bağımsız yol: KCS boyunca gereken kutu sayısı × (1+α)
    const boxes = OT.mul(KCS).div(KB);
    const ks2 = boxes.mul(F(1).add(alpha));
    let n = 0;
    while (F(n).mul(KB).lt(needSafe)) n++;
    if (!ks2.eq(ksRaw) || !F(n).eq(KS)) throw new Error('kanban: bağımsız kontrol tutmadı');
    const pull1 = KS.mul(KB);
    const pullOther = F(P.other.KS).mul(P.other.KB);
    const pullTotal = pull1.add(pullOther);
    const pushParts = P.push.map((p) => F(p.boxes).mul(p.size));
    const pushTotal = pushParts.reduce((a, b) => a.add(b), F(0));
    const reduction = pushTotal.sub(pullTotal).div(pushTotal).mul(100);
    return { OT, KCS, batch, need, needSafe, ksRaw, KS, boxes, pull1, pullOther, pullTotal, pushParts, pushTotal, reduction };
  }

  const NOTES = {
    notes: true,
    name: 'SYK 160',
    D: 32,
    M: 540,
    OT: F(32).div(540),
    comps: [
      { label: 'Bekleme (waiting time)', v: 10 },
      { label: 'Montaj (assembly)', v: 72 },
      { label: 'Fason ara işlemler (outsourced intermediate operations)', v: 810 },
    ],
    alpha: F('0.30'),
    KB: 8,
    other: { name: 'SYK 250', KS: 6, KB: 3 },
    push: [
      { name: 'SYK 160', boxes: 6, size: 30 },
      { name: 'SYK 250', boxes: 12, size: 18 },
    ],
  };

  function gen(rng, opts) {
    if (opts && opts.notes) return NOTES;
    for (let t = 0; t < 600; t++) {
      const M = rng.pick([400, 420, 450, 480, 500, 600]);
      const ks = [];
      for (let k = 4; k <= 50; k++) if ((k * M) % 100 === 0) ks.push(k); // günlük talep tam sayı
      const k = rng.pick(ks); // OT = k / 100
      const OT = F(k).div(100);
      const D = OT.mul(M);
      const vals = {
        recv: rng.int(1, 6) * 5, toOrder: rng.int(2, 10), orderWait: rng.int(1, 8) * 5,
        setup: rng.int(1, 6) * 5, proc: rng.int(2, 24) * 5, cellWait: rng.int(1, 10) * 5,
        toSm: rng.int(2, 10), smWait: rng.int(2, 20) * 5,
      };
      const comps = COMP.map((c) => ({ label: c.label, v: vals[c.key], batch: !!c.batch }));
      const KCS = comps.reduce((x, c) => x + c.v, 0);
      const a = rng.pick([10, 15, 20, 25, 30]);
      const KB = rng.pick([4, 5, 6, 8, 10, 12, 15, 16, 20, 25]);
      // hızlı tam sayı kapıları: OT·KCS / KB ve OT(1+α)KCS / KB ≤2 ondalık
      if ((k * KCS) % KB !== 0) continue; // kutu sayısı OT·KCS/KB = k·KCS/(100·KB)
      const num = k * (100 + a) * KCS; // ksRaw = num / (10000·KB)
      if (num % (100 * KB) !== 0) continue;
      const ks100 = num / (100 * KB);
      if (ks100 % 100 === 0 || ks100 % 100 < 5 || ks100 < 300 || ks100 > 1600) continue; // tam sayı değil, 3 ≤ KS ≤ 16
      const KS = Math.ceil(ks100 / 100);
      const other = { name: 'P2', KS: rng.int(3, 8), KB: rng.pick([2, 3, 4, 5, 6]) };
      const pull = KS * KB + other.KS * other.KB;
      for (let u = 0; u < 200; u++) {
        const push = [
          { name: 'P1', boxes: rng.int(4, 12), size: rng.pick([10, 12, 15, 20, 24, 25, 30, 40]) },
          { name: 'P2', boxes: rng.int(6, 14), size: rng.pick([10, 12, 15, 18, 20]) },
        ];
        const pt = push[0].boxes * push[0].size + push[1].boxes * push[1].size;
        if ((10000 * pull) % pt !== 0) continue; // azalma yüzdesi ≤2 ondalık
        if (pull > 0.6 * pt || pull < 0.1 * pt) continue; // azalma %40–90
        const P = { notes: false, name: 'P1', D: Number(D.n), M, OT, comps, alpha: F(a).div(100), KB, other, push };
        const S = solve(P);
        if (!S.need.isNice(2) || !S.boxes.isNice(2) || !S.needSafe.isNice(2) || !S.ksRaw.isNice(2) || S.ksRaw.isInt()) break;
        if (!S.reduction.isNice(2) || S.reduction.lt(40) || S.reduction.gt(90)) continue;
        return P;
      }
    }
    throw new Error('kanban: uygun örnek bulunamadı');
  }

  function kcsViz(P, cap) {
    return {
      type: 'stack',
      unit: 'min',
      caption: cap || 'Kanban çevrim süresi (KCS) bileşenleri (LEAN s.114)',
      rows: [{ label: 'KCS', segs: P.comps.map((c, i) => ({ v: F(c.v).toNumber(), label: String(c.v), cls: c.batch ? 'hl' : 's' + ((i % 4) + 1) })) }],
      legend: P.notes ? undefined : [{ cls: 'hl', label: 'Parti işleme çevrimi (hazırlık + işleme + hücre içi bekleme)' }],
    };
  }

  IM.registerDrill({
    id: 'kanban',
    topic: '2.7',
    title: 'Kanban sayısı ve envanter azalması',
    description: 'KS = ⌈OT·(1+α)·KCS / KB⌉: ortalama talep, kanban çevrim süresi, kesirli kanban sayısı, yukarı yuvarlama ve push → pull envanter azalması (LEAN s.114, s.129–130).',
    options: [{ key: 'notes', label: 'Ders notundaki örneği kullan (SYK 160 şalter, LEAN s.129)', type: 'checkbox', default: false }],
    solve,
    gen,
    generate(rng, opts) {
      opts = opts || {};
      const P = gen(rng, opts);
      const S = solve(P);
      const N = !!P.notes;
      const nm = N ? 'SYK 160' : 'P1';
      const on = N ? 'SYK 250' : 'P2';
      const al = d(P.alpha);
      const onePlus = F(1).add(P.alpha);
      // notlardaki yuvarlamayla (0.059) hesap
      const OTr = F('0.059');
      const needR = OTr.mul(S.KCS), needSafeR = needR.mul(onePlus), ksR = needSafeR.div(P.KB);

      const compTxt = P.comps.map((c) => `${c.label}: <b>${c.v}</b> dk`).join(' · ');
      const statement = N
        ? `<p><b>Ders notu (LEAN s.124–130):</b> Big Electric Box montaj hücreleri ile şalter (switch) hücreleri arasında pull sistemi tasarlanıyor.
           <b>SYK 160</b> şalter için: günlük talep <b>32 adet</b>, günlük çalışma süresi <b>540 dk</b>.
           Kanban çevrim süresi bileşenleri: 10 (bekleme) + 72 (montaj) + 810 (fason ara işlemler) dk. Güvenilirlik katsayısı <b>α = 0.30</b>,
           kutu başına adet <b>KB = 8</b> (slayttaki "amount to be deposited in the safe" = kasaya/kutuya konan miktar).</p>
           <p><b>SYK 250</b> için kanban sayısı notlarda <b>6</b> olarak verilmiş (kutu başına 3 adet).
           Push sistemde Big Box ile şalter hücreleri arasındaki stok: SYK 160 → 6 kutu × 30 adet/kutu, SYK 250 → 12 kutu × 18 adet/kutu.</p>
           <div class="model">KS = ⌈ OT·(1+α)·KCS / KB ⌉   (sonuç yukarı yuvarlanır, LEAN s.114)</div>`
        : `<p>Bir hücre ile müşterisi arasında kanban (pull) sistemi kurulacak. <b>${nm}</b> ürünü için günlük talep <b>${S.OT.mul(P.M).show()} adet</b>,
           günlük çalışma süresi <b>${P.M} dk</b>. Bir kanbanın tam çevrimindeki süreler (dk):</p>
           <p>${compTxt}</p>
           <p>Güvenilirlik katsayısı <b>α = ${al}</b>, kutu başına adet <b>KB = ${P.KB}</b>.
           Diğer ürün <b>${on}</b> için kanban sayısı <b>${P.other.KS}</b> (kutu başına ${P.other.KB} adet) olarak hesaplanmış.
           Mevcut push sistemindeki stok: ${nm} → ${P.push[0].boxes} kutu × ${P.push[0].size} adet/kutu, ${on} → ${P.push[1].boxes} kutu × ${P.push[1].size} adet/kutu.</p>
           <div class="model">KS = ⌈ OT·(1+α)·KCS / KB ⌉   (sonuç yukarı yuvarlanır, LEAN s.114)</div>
           <p class="note">Notlardaki uygulama: SYK 160 şalteri (LEAN s.129); bu soru aynı yöntemle üretildi.</p>`;

      const steps = [];
      // 1) OT
      steps.push({
        kind: 'number',
        prompt: N
          ? 'Ortalama talep OT (adet/dk) nedir? (notlar 3 ondalık kullanır)'
          : 'Ortalama talep OT (adet/dk) nedir?',
        fields: [N ? { label: 'OT (pc/min)', answer: OTr, tol: 0.0005 } : { label: 'OT (pc/min)', answer: S.OT }],
        hint: 'OT = günlük talep / günlük çalışma dakikası.',
        explain: N
          ? `OT = 32 / 540 = 0.0593 adet/dk; slayt <b>0.059</b> adet/dk yazar (LEAN s.129). Hem 0.059 hem 0.0593 kabul edilir.`
          : `OT = ${S.OT.mul(P.M).show()} / ${P.M} = <b>${S.OT.show()}</b> adet/dk (günlük talep / günlük çalışma süresi, LEAN s.129'daki gibi).`,
      });
      // 2) parti işleme çevrimi (yalnızca rastgele modda bileşenler ayrık)
      if (!N) {
        const b = P.comps.filter((c) => c.batch);
        steps.push({
          kind: 'number',
          prompt: 'KCS formülündeki <b>parti işleme çevrim süresi</b> (batch processing cycle time) kaç dakikadır?',
          fields: [{ label: 'Parti işleme çevrimi (min)', answer: S.batch }],
          hint: 'LEAN s.114: batch processing cycle time = preparation time + batch processing time + in-cell waiting time.',
          explain: `Parti işleme çevrimi = hazırlık + parti işleme + hücre içi bekleme = ${b.map((c) => c.v).join(' + ')} = <b>${S.batch.show()}</b> dk (LEAN s.114).`,
        });
      }
      // 3) KCS
      steps.push({
        kind: 'number',
        prompt: N
          ? 'Kanban çevrim süresi KCS (dk) nedir?'
          : `Parti işleme çevrimi ${S.batch.show()} dk ile kanban çevrim süresi KCS (dk) nedir?`,
        fields: [{ label: 'KCS (min)', answer: S.KCS }],
        hint: 'KCS = kanbanın bir tam çevrimini tamamlaması için geçen toplam süre: tüm bileşenlerin toplamı.',
        explain: N
          ? `KCS = 10 (bekleme) + 72 (montaj) + 810 (fason ara işlemler) = <b>892</b> dk (LEAN s.129).`
          : `KCS = ${P.comps.filter((c) => !c.batch).slice(0, 3).map((c) => c.v).join(' + ')} + ${S.batch.show()} (parti çevrimi) + ${P.comps.filter((c) => !c.batch).slice(3).map((c) => c.v).join(' + ')} = <b>${S.KCS.show()}</b> dk.
             Receiving box → order box → hücre (parti çevrimi) → supermarket döngüsünün tamamı (LEAN s.113–114).`,
        viz: kcsViz(P),
      });
      // 4) KCS boyunca talep
      steps.push({
        kind: 'number',
        prompt: N
          ? 'KCS = 892 dk boyunca gelen talep OT·KCS (adet) nedir?'
          : `KCS = ${S.KCS.show()} dk boyunca gelen talep OT·KCS (adet) nedir?`,
        fields: [N ? { label: 'OT·KCS (pc)', answer: S.need, tol: 0.25 } : { label: 'OT·KCS (pc)', answer: S.need }],
        hint: 'Bir kanban döngüsünü tamamlayana kadar müşteri bu kadar parça tüketir.',
        explain: N
          ? `OT·KCS = (32 / 540) × 892 = <b>${S.need.show()}</b> adet (0.059 ile 0.059 × 892 = ${needR.show()}; ikisi de kabul).`
          : `OT·KCS = ${S.OT.show()} × ${S.KCS.show()} = <b>${S.need.show()}</b> adet.`,
      });
      // 5) güvenlik payıyla
      steps.push({
        kind: 'number',
        prompt: N
          ? `α = 0.30 güvenlik payıyla OT·(1+α)·KCS (adet) nedir?`
          : `OT·KCS = ${S.need.show()} adet ile α = ${al} güvenlik payı eklenince OT·(1+α)·KCS (adet) nedir?`,
        fields: [N ? { label: 'OT·(1+α)·KCS (pc)', answer: S.needSafe, tol: 0.35 } : { label: 'OT·(1+α)·KCS (pc)', answer: S.needSafe }],
        hint: 'α güvenilirlik katsayısıdır: talep ve süre dalgalanmalarına karşı (1 + α) ile çarpılır.',
        explain: N
          ? `${S.need.show()} × 1.30 = <b>${S.needSafe.show()}</b> adet (0.059 ile ${needSafeR.show()}).`
          : `${S.need.show()} × ${onePlus.show()} = <b>${S.needSafe.show()}</b> adet.`,
      });
      // 6) kesirli KS
      steps.push({
        kind: 'number',
        prompt: N
          ? `KB = 8 adet/kutu ile <b>yuvarlanmamış</b> kanban sayısı OT·(1+α)·KCS / KB nedir?`
          : `OT·(1+α)·KCS = ${S.needSafe.show()} adet ve KB = ${P.KB} adet/kutu ile <b>yuvarlanmamış</b> kanban sayısı nedir?`,
        fields: [N ? { label: 'OT·(1+α)·KCS / KB (kesirli)', answer: S.ksRaw, tol: 0.045 } : { label: 'OT·(1+α)·KCS / KB (kesirli)', answer: S.ksRaw }],
        explain: N
          ? `${S.needSafe.show()} / 8 = <b>${S.ksRaw.show()}</b> (slayttaki OT = 0.059 ile ${ksR.show()}). Notlar yalnızca sonucu (9) verir (LEAN s.129).`
          : `${S.needSafe.show()} / ${P.KB} = <b>${S.ksRaw.show()}</b>. Bağımsız kontrol: KCS boyunca gereken kutu sayısı OT·KCS / KB = ${S.boxes.show()} kutu, × ${onePlus.show()} = ${S.ksRaw.show()}.`,
      });
      // 7) ceil
      steps.push({
        kind: 'number',
        prompt: `Kesirli değer ${N ? S.ksRaw.show() + ' (0.059 ile ' + ksR.show() + ')' : S.ksRaw.show()} ile kanban sayısı KS kaçtır?`,
        fields: [{ label: 'KS (kanban = kutu)', answer: S.KS }],
        hint: 'Formüldeki köşeli parantez: sonuç her zaman YUKARI yuvarlanır (LEAN s.114).',
        explain: `KS = ⌈${S.ksRaw.show()}⌉ = <b>${S.KS.show()}</b> kanban. ${S.ksRaw.floor().show()} kanban ile döngü boyunca gereken ${S.needSafe.show()} adet karşılanamaz (${S.ksRaw.floor().show()} × ${P.KB} = ${S.ksRaw.floor().mul(P.KB).show()} &lt; ${S.needSafe.show()}); bu yüzden aşağı yuvarlanmaz.
          Her kutu için bir kanban vardır: kutu sayısı = kanban sayısı (LEAN s.114)${N ? '; notlarda "Number of Kanbans = 9" (s.129)' : ''}.`,
      });
      // 8) KS·KB
      steps.push({
        kind: 'number',
        prompt: `KS = ${S.KS.show()} kanban ile pull sisteminde ${nm} için tutulabilecek azami stok (adet) nedir?`,
        fields: [{ label: `Pull stok ${nm} (pc)`, answer: S.pull1 }],
        explain: `Her kanban bir dolu kutuya karşılık gelir: ${S.KS.show()} kutu × ${P.KB} adet/kutu = <b>${S.pull1.show()}</b> adet${N ? ' (LEAN s.129: "72 pieces [9 boxes × 8 pieces/box]")' : ''}.`,
      });
      // 9) toplamlar
      steps.push({
        kind: 'number',
        prompt: `${nm} pull stoğu ${S.pull1.show()} adet. ${on} için ${P.other.KS} kanban × ${P.other.KB} adet/kutu. Push ve pull sistemdeki <b>toplam</b> stok (adet) nedir?`,
        fields: [
          { label: 'Push toplam stok (pc)', answer: S.pushTotal },
          { label: 'Pull toplam stok (pc)', answer: S.pullTotal },
        ],
        explain: `Push: ${P.push[0].boxes} × ${P.push[0].size} + ${P.push[1].boxes} × ${P.push[1].size} = ${S.pushParts[0].show()} + ${S.pushParts[1].show()} = <b>${S.pushTotal.show()}</b> adet.
          Pull: ${S.KS.show()} × ${P.KB} + ${P.other.KS} × ${P.other.KB} = ${S.pull1.show()} + ${S.pullOther.show()} = <b>${S.pullTotal.show()}</b> adet${N ? ' (LEAN s.129)' : ''}.`,
        viz: {
          type: 'bars', labels: ['Push', 'Pull'], values: [S.pushTotal.toNumber(), S.pullTotal.toNumber()], highlight: [1], decimals: 0,
          yLabel: 'adet', caption: 'Sistemdeki toplam stok (adet)',
        },
      });
      // 10) % azalma
      steps.push({
        kind: 'number',
        prompt: `Push ${S.pushTotal.show()} adet → pull ${S.pullTotal.show()} adet. Envanterdeki azalma yüzde kaçtır?`,
        fields: [N ? { label: 'Envanter azalması (%)', answer: S.reduction, unit: '%', tol: 0.3 } : { label: 'Envanter azalması (%)', answer: S.reduction, unit: '%' }],
        hint: 'Azalma = (push − pull) / push × 100.',
        explain: `(${S.pushTotal.show()} − ${S.pullTotal.show()}) / ${S.pushTotal.show()} × 100 = <b>${S.reduction.show()}%</b>${N ? ' (slayt "% 77", LEAN s.130)' : ''}.`,
      });

      const solution = `<div class="model">OT = ${N ? '32 / 540 ≈ 0.059' : S.OT.show()} adet/dk · KCS = ${S.KCS.show()} dk · α = ${al} · KB = ${P.KB}
KS = ⌈${S.ksRaw.show()}⌉ = ${S.KS.show()} kanban → pull stok ${S.pullTotal.show()} adet, push ${S.pushTotal.show()} adet, azalma ${S.reduction.show()}%</div>`;

      return {
        title: N ? 'Kanban sayısı · SYK 160 (LEAN s.129)' : 'Kanban sayısı ve envanter azalması',
        statement,
        viz: kcsViz(P),
        steps,
        solution,
        data: Object.assign({ P }, S),
      };
    },
  });
})();
