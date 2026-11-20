/* 2.7 · Push sistem örneği — MRP grafik yöntemi (LEAN s.108, görsel; push/pull karşılaştırması s.106, s.109).
   Ürün ağacı (notlardaki yapı): A → B(mB), C(mC);  B → D(mBD), E(mBE);  C → D(mCD), F(mCF)   — D ortak parça (iki ebeveyn).
   Tabloda her parça için iki satır var: "Net Requirement Amount" ve "Planned Order Quantity"; eldeki stok/planlı teslimat yok,
   lot-for-lot:
     net ihtiyaç(çocuk) = ebeveynin planlı sipariş miktarı × çarpan, ebeveynin RELEASE haftasında
     release (planlı sipariş) haftası = ihtiyaç haftası − LT(parça), miktar = net ihtiyaç
   Ortak parça D: B'den ve C'den gelen ihtiyaçlar aynı haftaya düşerse toplanır (notlarda 200·1 + 300·2 = 800, hafta 4 → release 2);
     farklı haftalara düşerse iki ayrı ihtiyaç / iki ayrı planlı sipariş olur.
   Notes seçeneği (LEAN s.108): A 100 adet hafta 7; LT A1 B2 C2 D2 E1 F1 → release A 100 hf6, B 200 hf4, C 300 hf4, D 800 hf2, E 400 hf3, F 600 hf3.
   Rastgele: çarpanlar 1–4 (en az ikisi ≥ 2), LT 1–3, talep miktarı ve haftası (≤ 10); tüm release'ler ≥ hafta 1.
   Bağımsız kontrol (ileri simülasyon): her planlı sipariş release + LT haftasında teslim edilir; teslimatlar her parçanın ebeveyn(ler)inin
     release haftasındaki ihtiyacıyla (miktar × çarpan) birebir örtüşmeli; toplam D = Q·(mB·mBD + mC·mCD).
   Dışa açık: IM.drills['mrp-graphic'].solve(P), .forward(P, R), .gen(rng, opts) */
(function () {
  const IM = window.IM;
  const PARTS = ['A', 'B', 'C', 'D', 'E', 'F'];
  // (ebeveyn, çocuk, çarpan anahtarı)
  // Türkçe ekler: harf adının son ünlüsüne göre (A → "A'nın", B/C/D/E/F → "'nin"); hafta numarası + bulunma eki
  const nin = (p) => p + (p === 'A' ? "'nın" : "'nin");
  const de = (n) => n + ({ 1: "'de", 2: "'de", 3: "'te", 4: "'te", 5: "'te", 6: "'da", 7: "'de", 8: "'de", 9: "'da", 10: "'da" }[n] || "'de");
  const EDGES = [['A', 'B', 'B'], ['A', 'C', 'C'], ['B', 'D', 'BD'], ['B', 'E', 'BE'], ['C', 'D', 'CD'], ['C', 'F', 'CF']];

  // Saf çözüm (geri yönlü patlatma). P = { Q, T, m:{B,C,BD,BE,CD,CF}, LT:{A..F} }
  // Dönüş: reqs[part] = [{qty, week, from}], orders[part] = [{qty, week}] (week = release haftası)
  function solve(P) {
    const reqs = {}, orders = {};
    PARTS.forEach((p) => { reqs[p] = []; orders[p] = []; });
    reqs.A.push({ qty: P.Q, week: P.T, from: null });
    const release = (p) => {
      // aynı haftaya düşen ihtiyaçları birleştir (lot-for-lot)
      const byW = new Map();
      reqs[p].forEach((r) => byW.set(r.week, (byW.get(r.week) || 0) + r.qty));
      orders[p] = [...byW.entries()].sort((a, b) => a[0] - b[0]).map(([w, q]) => ({ qty: q, week: w - P.LT[p], need: w }));
    };
    release('A');
    for (const p of ['B', 'C', 'D', 'E', 'F']) {
      for (const [par, ch, k] of EDGES) if (ch === p) orders[par].forEach((o) => reqs[p].push({ qty: o.qty * P.m[k], week: o.week, from: par }));
      // B, C'den önce D'yi patlatmak mümkün değil; sıra A,B,C,D,E,F ebeveynlerin hazır olmasını sağlar
      release(p);
    }
    const merged = reqs.D.length === 2 && reqs.D[0].week === reqs.D[1].week;
    const minRelease = Math.min(...PARTS.flatMap((p) => orders[p].map((o) => o.week)));
    return { reqs, orders, merged, minRelease };
  }

  // İleri simülasyon: planlı siparişler release + LT'de teslim edilir; her parçanın ihtiyacı ebeveyn siparişlerinden yeniden kurulur.
  function forward(P, orders) {
    const need = {}, recv = {};
    PARTS.forEach((p) => { need[p] = {}; recv[p] = {}; });
    need.A[P.T] = P.Q;
    for (const [par, ch, k] of EDGES) orders[par].forEach((o) => (need[ch][o.week] = (need[ch][o.week] || 0) + o.qty * P.m[k]));
    PARTS.forEach((p) => orders[p].forEach((o) => (recv[p][o.week + P.LT[p]] = (recv[p][o.week + P.LT[p]] || 0) + o.qty)));
    const same = (a, b) => Object.keys(a).length === Object.keys(b).length && Object.keys(a).every((w) => a[w] === b[w]);
    const okAll = PARTS.every((p) => same(need[p], recv[p]));
    const totalD = Object.values(recv.D).reduce((a, b) => a + b, 0);
    return { ok: okAll && totalD === P.Q * (P.m.B * P.m.BD + P.m.C * P.m.CD), need, recv, totalD };
  }

  const NOTES = { notes: true, Q: 100, T: 7, m: { B: 2, C: 3, BD: 1, BE: 2, CD: 2, CF: 2 }, LT: { A: 1, B: 2, C: 2, D: 2, E: 1, F: 1 } };

  function gen(rng, opts) {
    if (opts && opts.notes) return NOTES;
    for (let t = 0; t < 500; t++) {
      const LT = {};
      PARTS.forEach((p) => (LT[p] = rng.int(1, 3)));
      const m = { B: rng.int(1, 4), C: rng.int(1, 4), BD: rng.int(1, 4), BE: rng.int(1, 4), CD: rng.int(1, 4), CF: rng.int(1, 4) };
      if (Object.values(m).filter((x) => x >= 2).length < 2) continue;
      if (m.B === m.C && m.BD === m.CD) continue; // iki dal birebir aynı olmasın
      const depth = LT.A + Math.max(LT.B + Math.max(LT.D, LT.E), LT.C + Math.max(LT.D, LT.F));
      const T = depth + 1 + rng.int(0, 2);
      if (T > 10) continue;
      const Q = rng.pick([20, 25, 30, 40, 50, 60, 75, 80, 100, 120, 150]);
      const P = { notes: false, Q, T, m, LT };
      const S = solve(P);
      if (S.minRelease < 1) continue;
      if (Math.max(...PARTS.flatMap((p) => S.orders[p].map((o) => o.qty))) > 5000) continue;
      if (P.Q === NOTES.Q && P.T === NOTES.T && JSON.stringify(m) === JSON.stringify(NOTES.m) && JSON.stringify(LT) === JSON.stringify(NOTES.LT)) continue;
      return P;
    }
    throw new Error('mrp-graphic: uygun örnek bulunamadı');
  }

  // ---------------------------------------------------------------- viz
  function bomViz(P) {
    const n = (id, parent, label, k) => ({ id, parent, label, edge: k ? '×' + P.m[k] : undefined, leaf: 'LT ' + P.LT[label] });
    return {
      type: 'tree', dir: 'down', caption: `Ürün ağacı (BOM) ve tedarik süreleri (hafta)`,
      nodes: [n('A', null, 'A'), n('B', 'A', 'B', 'B'), n('C', 'A', 'C', 'C'), n('D1', 'B', 'D', 'BD'), n('E', 'B', 'E', 'BE'), n('D2', 'C', 'D', 'CD'), n('F', 'C', 'F', 'CF')],
    };
  }
  // units: [{part, req:{qty,week}|null, po:{qty,week}|null}] — upto = gösterilecek birim sayısı, son birim vurgulanır
  function tableViz(P, units, upto, cap) {
    const rowLabels = [], cells = [], cls = [];
    const W = P.T;
    const idx = {};
    PARTS.forEach((p, i) => {
      rowLabels.push(`<b>${p}</b> · Net req.`, `${p} · Planned order`);
      idx[p] = 2 * i;
      cells.push(Array(W + 1).fill(''), Array(W + 1).fill(''));
      cls.push(Array(W + 1).fill(''), Array(W + 1).fill(''));
      cells[2 * i][W] = String(P.LT[p]);
    });
    const put = (r, w, q, hl) => {
      const c = w - 1;
      const cur = cells[r][c];
      cells[r][c] = cur ? cur + ' + ' + q : String(q);
      if (hl) cls[r][c] = 'hl';
    };
    units.slice(0, upto).forEach((u, i) => {
      const hl = i === upto - 1 && upto > 1;
      if (u.req) put(idx[u.part], u.req.week, u.req.qty, hl);
      if (u.po) put(idx[u.part] + 1, u.po.week, u.po.qty, hl);
    });
    return {
      type: 'matrix', corner: 'Parça', rowLabels, colLabels: IM.util.range(W).map((i) => String(i + 1)).concat(['LT']),
      cells, cls, caption: cap || 'MRP tablosu (grafik yöntem, LEAN s.108)',
    };
  }

  const CONCEPT = [
    { html: 'Push sistem: işlerin sisteme girişi talebe (plana) göre çizelgelenir; planlayıcı planlı siparişleri hazırlayıp her birime gönderir', correct: true },
    { html: 'Pull sistem: işler sisteme sistemin durumuna göre (boşalan kutu / kanban sinyaliyle) girer', correct: false },
    { html: 'CONWIP: sistemdeki toplam iş miktarı sabit tutulur ve biten iş yeni işi sisteme çeker', correct: false },
    { html: 'Bu tablo talep değişkenliğini ve beklenmedik arızaları otomatik olarak hesaba katan stokastik bir sistemdir', correct: false },
  ];

  IM.registerDrill({
    id: 'mrp-graphic',
    topic: '2.7',
    title: 'Push sistem · MRP grafik yöntemi',
    description: 'Ürün ağacından (A → B, C; B → D, E; C → D, F) net ihtiyaçları ve planlı sipariş (release) haftalarını geri yönlü bul; ortak parça D (LEAN s.108).',
    options: [{ key: 'notes', label: 'Ders notundaki örneği kullan (Product A için MRP, LEAN s.108)', type: 'checkbox', default: false }],
    solve,
    forward,
    gen,
    generate(rng, opts) {
      opts = opts || {};
      const P = gen(rng, opts);
      const S = solve(P);
      const fw = forward(P, S.orders);
      if (!fw.ok) throw new Error('mrp-graphic: ileri simülasyon tutmadı');
      const N = !!P.notes;
      const o = S.orders, r = S.reqs, LT = P.LT, m = P.m;

      // gösterim birimleri (tablo adım adım dolar)
      const units = [{ part: 'A', req: r.A[0], po: null }, { part: 'A', req: null, po: o.A[0] }];
      units.push({ part: 'B', req: r.B[0], po: o.B[0] }, { part: 'C', req: r.C[0], po: o.C[0] });
      if (S.merged) units.push({ part: 'D', req: { qty: o.D[0].qty, week: o.D[0].need }, po: o.D[0] });
      else {
        const dB = r.D.find((x) => x.from === 'B'), dC = r.D.find((x) => x.from === 'C');
        units.push({ part: 'D', req: dB, po: o.D.find((x) => x.need === dB.week) }, { part: 'D', req: dC, po: o.D.find((x) => x.need === dC.week) });
      }
      units.push({ part: 'E', req: r.E[0], po: o.E[0] }, { part: 'F', req: r.F[0], po: o.F[0] });
      const bom = bomViz(P);
      const tv = (k, cap) => [bom, tableViz(P, units, k, cap)];

      const statement = `<p>${N ? '<b>Ders notu (LEAN s.108):</b> ' : ''}Ürün A'nın ürün ağacı ve tedarik süreleri (LT, hafta) yandaki gibidir:
          A → B(${m.B}), C(${m.C}); B → D(${m.BD}), E(${m.BE}); C → D(${m.CD}), F(${m.CF}). Parantez içi: bir üst parça başına adet.
          LT: A ${LT.A}, B ${LT.B}, C ${LT.C}, D ${LT.D}, E ${LT.E}, F ${LT.F} hafta.</p>
        <p>A için net ihtiyaç: <b>${P.Q} adet, hafta ${P.T}</b>. Grafik yöntemle (eldeki stok yok, lot-for-lot) her parçanın net ihtiyacını ve
          planlı sipariş (release) haftasını bul.</p>
        <div class="model">release haftası = ihtiyaç haftası − LT
net ihtiyaç (çocuk) = ebeveynin planlı sipariş miktarı × çarpan   (ebeveynin release haftasında)</div>
        ${N ? '' : '<p class="note">Notlardaki örnek: Product A, LEAN s.108; bu soru aynı yapıyla üretildi.</p>'}`;

      const steps = [];
      let k = 1;
      // A
      steps.push({
        kind: 'number',
        prompt: `A: net ihtiyaç ${P.Q} adet, hafta ${P.T}, LT = ${LT.A} hafta. A'nın planlı siparişi hangi hafta verilir (release)?`,
        fields: [{ label: 'A release (hafta)', answer: o.A[0].week }],
        hint: 'Sipariş, ihtiyaç haftasından LT kadar önce verilmelidir.',
        explain: `A: ${P.T} − ${LT.A} = hafta <b>${o.A[0].week}</b>; planlı sipariş miktarı ${P.Q} adet (lot-for-lot, LEAN s.108).`,
        viz: tv(++k),
      });
      const partStep = (p, par, key, u) => {
        const pr = o[par][0];
        const req = r[p].find((x) => x.from === par);
        const po = o[p].find((x) => x.need === req.week);
        return {
          kind: 'number',
          prompt: `${nin(par)} planlı siparişi <b>${pr.qty} adet, hafta ${pr.week}</b>. ${p} (${par} başına ${m[key]} adet, LT = ${LT[p]} hafta) için net ihtiyaç miktarı, ihtiyaç haftası ve release haftası nedir?`,
          fields: [
            { label: `${p} net ihtiyaç (pc)`, answer: req.qty },
            { label: `${p} ihtiyaç haftası`, answer: req.week },
            { label: `${p} release (hafta)`, answer: po.week },
          ],
          hint: `${p}, ${par} üretimine başlanırken (yani ${nin(par)} release haftasında) hazır olmalıdır.`,
          explain: `${p} net ihtiyaç = ${pr.qty} × ${m[key]} = <b>${req.qty}</b> adet, hafta <b>${req.week}</b> (${nin(par)} release haftası);
            release = ${req.week} − ${LT[p]} = hafta <b>${po.week}</b>. İleri kontrol: ${po.week} + ${LT[p]} = ${req.week} ✓.`,
          viz: tv(u),
        };
      };
      steps.push(partStep('B', 'A', 'B', ++k));
      steps.push(partStep('C', 'A', 'C', ++k));
      // D
      const dB = r.D.find((x) => x.from === 'B'), dC = r.D.find((x) => x.from === 'C');
      if (S.merged) {
        const po = o.D[0];
        steps.push({
          kind: 'number',
          prompt: `D ortak parçadır: B'nin planlı siparişi ${o.B[0].qty} adet (hafta ${o.B[0].week}, B başına ${m.BD} D) ve C'nin planlı siparişi ${o.C[0].qty} adet (hafta ${o.C[0].week}, C başına ${m.CD} D). D (LT = ${LT.D}) için net ihtiyaç miktarı, ihtiyaç haftası ve release haftası nedir?`,
          fields: [
            { label: 'D net ihtiyaç (pc)', answer: po.qty },
            { label: 'D ihtiyaç haftası', answer: po.need },
            { label: 'D release (hafta)', answer: po.week },
          ],
          hint: 'İki ebeveynin ihtiyacı aynı haftaya düşüyorsa tek ihtiyaçta toplanır.',
          explain: `İki ihtiyaç da hafta ${de(po.need)}: D = ${o.B[0].qty} × ${m.BD} + ${o.C[0].qty} × ${m.CD} = ${dB.qty} + ${dC.qty} = <b>${po.qty}</b> adet, hafta <b>${po.need}</b>;
            release = ${po.need} − ${LT.D} = hafta <b>${po.week}</b>${N ? ' (notlarda D: 800 → hafta 2, LEAN s.108)' : ''}.`,
          viz: tv(++k),
        });
      } else {
        const pB = o.D.find((x) => x.need === dB.week), pC = o.D.find((x) => x.need === dC.week);
        steps.push(Object.assign(partStep('D', 'B', 'BD', ++k), {
          prompt: `D ortak parçadır (hem B'de hem C'de kullanılır). Önce B'den gelen ihtiyaç: B'nin planlı siparişi <b>${o.B[0].qty} adet, hafta ${o.B[0].week}</b>, B başına ${m.BD} D, LT(D) = ${LT.D}. Bu ihtiyacın miktarı, haftası ve release haftası nedir?`,
        }));
        steps.push(Object.assign(partStep('D', 'C', 'CD', ++k), {
          prompt: `C'den gelen D ihtiyacı: C'nin planlı siparişi <b>${o.C[0].qty} adet, hafta ${o.C[0].week}</b>, C başına ${m.CD} D. Bu ihtiyacın miktarı, haftası ve release haftası nedir?`,
          explain: `D (C'den) = ${o.C[0].qty} × ${m.CD} = <b>${dC.qty}</b> adet, hafta <b>${dC.week}</b>; release = ${dC.week} − ${LT.D} = hafta <b>${pC.week}</b>.
            B ve C'nin release haftaları farklı (${o.B[0].week} ≠ ${o.C[0].week}) olduğu için D'nin iki ihtiyacı <b>toplanmaz</b>: iki ayrı planlı sipariş
            (${pB.qty} adet hafta ${pB.week}, ${pC.qty} adet hafta ${pC.week}); toplam ${fw.totalD} adet. (Notlarda B ve C'nin LT'si eşit olduğundan ikisi hafta 4'te toplanmıştı: 200 + 600 = 800, LEAN s.108.)`,
        }));
      }
      steps.push(partStep('E', 'B', 'BE', ++k));
      steps.push(partStep('F', 'C', 'CF', ++k));
      // en erken release
      const minW = S.minRelease;
      steps.push({
        kind: 'multi',
        prompt: `Tamamlanan tabloya göre en erken planlı sipariş hafta <b>${de(minW)}</b>. Bu hafta hangi parça(lar) için sipariş verilmelidir? (birden fazla olabilir)`,
        options: PARTS.map((p) => ({ html: p, correct: o[p].some((x) => x.week === minW) })),
        keepOrder: true,
        explain: `Hafta ${de(minW)} release: <b>${PARTS.filter((p) => o[p].some((x) => x.week === minW)).join(', ')}</b>. Planlı siparişler: ${PARTS.map((p) => o[p].map((x) => `${p} ${x.qty} (hf ${x.week})`).join(', ')).join(' · ')}.
          A'nın teslimi hafta ${P.T} olduğu için en alt seviyedeki parçaların siparişi en erken verilir.`,
      });
      steps.push({
        kind: 'choice',
        prompt: 'Bu planlama tablosu hangi üretim kontrol mantığının örneğidir? (LEAN s.106–109)',
        options: CONCEPT,
        explain: 'Notlar MRP grafik yöntemini "An example of a push system" olarak verir (LEAN s.108). Push sistem işlerin sisteme girişini talebe göre çizelgeler; planlayıcı siparişleri periyodik olarak hazırlayıp birimlere gönderir ve parametreleri deterministik kabul eder, beklenmedik durumları ihmal eder. Pull sistemde (Kanban, CONWIP, POLCA) işlerin girişi sistemin durumuna bağlıdır (LEAN s.106, s.109).',
      });

      const solution = `<div class="model">${PARTS.map((p) => `${p}: ` + o[p].map((x) => `ihtiyaç ${x.qty} hf ${x.need} → release hf ${x.week}`).join('; ')).join('\n')}</div>`;
      return {
        title: N ? 'MRP grafik yöntemi · Product A (LEAN s.108)' : 'Push sistem · MRP grafik yöntemi',
        statement,
        viz: tv(1, 'MRP tablosu: A\'nın net ihtiyacı verildi'),
        steps,
        solution,
        data: { P, reqs: S.reqs, orders: S.orders, merged: S.merged, minRelease: S.minRelease, forward: fw },
      };
    },
  });
})();
