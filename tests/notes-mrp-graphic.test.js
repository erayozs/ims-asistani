// Usage: node tests/notes-mrp-graphic.test.js
// js/drills/mrp-graphic.js için:
//   1) notes seçeneği LEAN s.108 tablosunu BİREBİR üretiyor mu (A 100 hf7 → A 100 hf6, B 200 hf4, C 300 hf4, D 800 hf2, E 400 hf3, F 600 hf3)
//   2) rastgele modda bağımsız doğrulama: adımlardaki cevaplardan planı kur, test içindeki İLERİ simülasyonla
//      (release + LT = teslim haftası, teslimatlar = ebeveyn release'indeki ihtiyaç × çarpan) kontrol et; ayrıca test içi özyinelemeli patlatma
//   3) ortak parça D: farklı haftalarda iki ayrı ihtiyaç / aynı haftada tek ihtiyaç; release ≥ 1; determinizm
const load = require('./load');
const core = ['ns', 'rng', 'frac', 'viz', 'runner'].map((f) => `js/core/${f}.js`);
const IM = load(core.concat(['js/drills/mrp-graphic.js']));
const F = IM.F;
let fails = 0, passes = 0;
function ok(cond, msg) {
  if (cond) passes++;
  else { fails++; console.log('✗', msg); }
}
const D = IM.drills['mrp-graphic'];
const rep = (k, v) => (typeof v === 'bigint' ? v.toString() : v);
const nums = (ex) => ex.steps.filter((s) => s.kind === 'number');
const num = (f) => F(f.answer).toNumber();
const PARENTS = { B: [['A', 'B']], C: [['A', 'C']], D: [['B', 'BD'], ['C', 'CD']], E: [['B', 'BE']], F: [['C', 'CF']] };

// adımlardan plan: [{part, qty, need, rel}]
function planFromSteps(ex) {
  const out = [];
  for (const st of nums(ex)) {
    const f = st.fields;
    if (f.length === 1 && /^A release/.test(f[0].label)) out.push({ part: 'A', qty: ex.data.P.Q, need: ex.data.P.T, rel: num(f[0]) });
    else if (f.length === 3) out.push({ part: f[0].label[0], qty: num(f[0]), need: num(f[1]), rel: num(f[2]) });
  }
  return out;
}
// test içi ileri simülasyon: her sipariş rel + LT'de teslim; her parçanın ihtiyacı = ebeveyn siparişleri × çarpan (ebeveyn release haftasında)
function forwardCheck(P, plan) {
  const errs = [];
  const by = (p) => plan.filter((x) => x.part === p);
  const sumByWeek = (list, key) => list.reduce((m, x) => ((m[x[key]] = (m[x[key]] || 0) + x.qty), m), {});
  plan.forEach((x) => { if (x.rel + P.LT[x.part] !== x.need) errs.push(`${x.part}: rel ${x.rel} + LT ${P.LT[x.part]} ≠ ${x.need}`); if (x.rel < 1) errs.push(`${x.part}: release < 1`); });
  // A
  const recvA = sumByWeek(by('A').map((x) => ({ w: x.rel + P.LT.A, qty: x.qty })), 'w');
  if (JSON.stringify(recvA) !== JSON.stringify({ [P.T]: P.Q })) errs.push('A teslimatı');
  for (const p of ['B', 'C', 'D', 'E', 'F']) {
    const need = {};
    for (const [par, k] of PARENTS[p]) by(par).forEach((o) => (need[o.rel] = (need[o.rel] || 0) + o.qty * P.m[k]));
    const recv = sumByWeek(by(p).map((x) => ({ w: x.rel + P.LT[p], qty: x.qty })), 'w');
    const keys = new Set([...Object.keys(need), ...Object.keys(recv)]);
    for (const w of keys) if (need[w] !== recv[w]) errs.push(`${p} hafta ${w}: ihtiyaç ${need[w]} ≠ teslim ${recv[w]}`);
  }
  return errs;
}
// test içi özyinelemeli patlatma (lot-for-lot, stok yok)
function explode(P) {
  const ch = { A: [['B', 'B'], ['C', 'C']], B: [['D', 'BD'], ['E', 'BE']], C: [['D', 'CD'], ['F', 'CF']], D: [], E: [], F: [] };
  const reqs = { A: [], B: [], C: [], D: [], E: [], F: [] };
  const go = (p, qty, week) => {
    reqs[p].push({ qty, week });
    const rel = week - P.LT[p];
    ch[p].forEach(([c, k]) => go(c, qty * P.m[k], rel));
  };
  go('A', P.Q, P.T);
  const orders = {};
  for (const p in reqs) {
    const m = {};
    reqs[p].forEach((r) => (m[r.week] = (m[r.week] || 0) + r.qty));
    orders[p] = Object.keys(m).map(Number).sort((a, b) => a - b).map((w) => ({ qty: m[w], need: w, rel: w - P.LT[p] }));
  }
  return orders;
}

// ----------------------------------------------------------------------------- 1) notlardaki örnek
console.log('— notes: Product A (LEAN s.108)');
{
  const ex = D.generate(IM.rng(3), { notes: true }), d = ex.data, o = d.orders;
  const exp = { A: [100, 6, 7], B: [200, 4, 6], C: [300, 4, 6], D: [800, 2, 4], E: [400, 3, 4], F: [600, 3, 4] };
  for (const p in exp) ok(o[p].length === 1 && o[p][0].qty === exp[p][0] && o[p][0].week === exp[p][1] && o[p][0].need === exp[p][2], `${p}: ${exp[p][0]} adet, ihtiyaç hf ${exp[p][2]} → release hf ${exp[p][1]}`);
  ok(d.merged === true, 'D ihtiyaçları hafta 4\'te birleşir (200·1 + 300·2 = 800)');
  ok(d.reqs.D.length === 2 && d.reqs.D.some((r) => r.from === 'B' && r.qty === 200) && d.reqs.D.some((r) => r.from === 'C' && r.qty === 600), 'D: B\'den 200, C\'den 600');
  const plan = planFromSteps(ex);
  ok(JSON.stringify(plan.map((x) => [x.part, x.qty, x.need, x.rel])) === JSON.stringify([['A', 100, 7, 6], ['B', 200, 6, 4], ['C', 300, 6, 4], ['D', 800, 4, 2], ['E', 400, 4, 3], ['F', 600, 4, 3]]), 'adım cevapları s.108 ile aynı: ' + JSON.stringify(plan));
  ok(forwardCheck(d.P, plan).length === 0, 'notes ileri simülasyon');
  const txt = JSON.stringify(ex, rep);
  ok(/LEAN s\.108/.test(txt), 'sayfa atfı');
  ok(ex.steps.length >= 5 && ex.steps.length <= 10, 'adım sayısı: ' + ex.steps.length);
  // görsel: BOM ağacı (dir down, ×2, LT) + MRP matrisi
  const v = ex.steps[0].viz;
  ok(Array.isArray(v) && v[0].type === 'tree' && v[0].dir === 'down' && v[0].nodes.some((n) => n.edge === '×2') && v[0].nodes.some((n) => n.leaf === 'LT 2') && v[1].type === 'matrix', 'viz: tree(down) + matrix');
  const last = ex.steps.filter((s) => s.viz).pop().viz[1];
  ok(last.cells.flat().includes('800') && last.cells.flat().includes('600') && last.colLabels.length === 8, 'son tablo dolu (7 hafta + LT)');
}

// ----------------------------------------------------------------------------- 2) rastgele: ileri simülasyon + patlatma
console.log('— rastgele: bağımsız doğrulama');
{
  let cnt = 0, merged = 0, split = 0;
  for (let s = 1; s <= 400; s++) {
    const ex = D.generate(IM.rng(s * 53 + 11), {}), d = ex.data, P = d.P;
    const plan = planFromSteps(ex);
    const errs = forwardCheck(P, plan);
    ok(errs.length === 0, `ileri simülasyon (seed ${s}): ${errs.slice(0, 3).join('; ')}`);
    // patlatma == adımlar
    const ref = explode(P);
    const flat = (o) => ['A', 'B', 'C', 'D', 'E', 'F'].flatMap((p) => o[p].map((x) => `${p}:${x.qty}@${x.need}->${x.rel}`)).sort().join(' ');
    ok(flat(ref) === plan.map((x) => `${x.part}:${x.qty}@${x.need}->${x.rel}`).sort().join(' '), `patlatma == adımlar (seed ${s})`);
    // ortak parça
    const isMerged = P.LT.B === P.LT.C;
    ok(d.merged === isMerged, 'D birleşik ⇔ LT(B) = LT(C)');
    const dSteps = plan.filter((x) => x.part === 'D');
    ok(dSteps.length === (isMerged ? 1 : 2), 'D adım sayısı (ayrı haftalar → iki ihtiyaç)');
    const totD = dSteps.reduce((a, x) => a + x.qty, 0);
    ok(totD === P.Q * (P.m.B * P.m.BD + P.m.C * P.m.CD), 'toplam D = Q·(mB·mBD + mC·mCD)');
    if (isMerged) merged++; else split++;
    // aralıklar
    ok(Object.values(P.m).every((x) => x >= 1 && x <= 4) && Object.values(P.LT).every((x) => x >= 1 && x <= 3) && P.T <= 10, 'çarpan 1–4, LT 1–3, T ≤ 10');
    ok(Math.min(...plan.map((x) => x.rel)) >= 1, 'release ≥ 1');
    ok(nums(ex).every((st) => st.fields.every((f) => F(f.answer).isInt() && f.tol == null)), 'tam sayı cevaplar, tol yok');
    // multi adımı: en erken release
    const mStep = ex.steps.find((st) => st.kind === 'multi');
    const minW = Math.min(...plan.map((x) => x.rel));
    const corr = mStep.options.filter((o) => o.correct).map((o) => o.html).sort().join('');
    ok(corr === [...new Set(plan.filter((x) => x.rel === minW).map((x) => x.part))].sort().join(''), 'en erken release parçaları');
    ok(ex.steps.filter((st) => st.kind === 'choice').length === 1, 'yorum adımı');
    const ex2 = D.generate(IM.rng(s * 53 + 11), {});
    ok(JSON.stringify(ex, rep) === JSON.stringify(ex2, rep), 'determinizm');
    ok(!/undefined|NaN|\[object/.test(JSON.stringify({ a: ex.statement, b: ex.steps, c: ex.solution }, rep)), 'metinde undefined/NaN yok');
    cnt++;
  }
  console.log(`   ${cnt} egzersiz; D birleşik ${merged}, ayrı ${split}`);
  ok(merged > 30 && split > 30, 'iki D durumu da üretiliyor');
}

console.log(fails ? `${fails} FAILED, ${passes} passed` : `notes-mrp-graphic OK (${passes} checks)`);
process.exit(fails ? 1 : 0);
