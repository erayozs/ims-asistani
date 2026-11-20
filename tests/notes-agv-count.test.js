// Usage: node tests/notes-agv-count.test.js
// js/drills/agv-count.js için:
//   1) notes seçeneği AGV s.15–17 sayılarını BİREBİR üretiyor mu (98, 176, 60, 96; 430; 505.88 (slayt 505); 8.43; 9)
//   2) slaytın yuvarlamaları (505, 8.43 / 8.42) alan toleransıyla kabul ediliyor mu
//   3) rastgele mod: test içi bağımsız yeniden hesap (Number aritmetiği) = adım cevapları; kalite kapıları; determinizm
const load = require('./load');
const core = ['ns', 'rng', 'frac', 'viz', 'runner'].map((f) => `js/core/${f}.js`);
const IM = load(core.concat(['js/drills/agv-count.js']));
const F = IM.F;
let fails = 0, passes = 0;
function ok(cond, msg) {
  if (cond) passes++;
  else { fails++; console.log('✗', msg); }
}
const D = IM.drills['agv-count'];
const nums = (ex) => ex.steps.filter((s) => s.kind === 'number');
const rep = (k, v) => (typeof v === 'bigint' ? v.toString() : v);

console.log('— notes: AGV s.15–17');
{
  const ex = D.generate(IM.rng(1), { notes: true });
  const dt = ex.data;
  ok(JSON.stringify(dt.cells) === JSON.stringify([{ d: 90, f: 14, t: 2 }, { d: 150, f: 16, t: 3 }, { d: 180, f: 5, t: 3 }, { d: 240, f: 8, t: 2 }]), 'notes cells');
  ok(dt.v === 60 && F(dt.c).eq(F('0.85')), 'v = 60, c = 0.85');
  const n = nums(ex);
  ok(n.length === 6, 'six number steps: ' + n.length);
  const travel = n[0].fields.map((f) => F(f.answer).show());
  ok(travel.join(',') === '42,80,30,64', 'travel parts 42,80,30,64: ' + travel);
  const use = n[1].fields.map((f) => F(f.answer).show());
  ok(use.join(',') === '98,176,60,96', 'hourly usage 98,176,60,96: ' + use);
  ok(F(n[2].fields[0].answer).show() === '430', 'total 430');
  const load_ = n[3].fields[0];
  ok(F(load_.answer).show() === '505.88', 'total load shows 505.88: ' + F(load_.answer).show());
  ok(F(load_.answer).eq(F(430).div(F('0.85'))), 'load exact = 430 / 0.85');
  ok(IM.checkNum('505', load_.answer, load_.tol).ok, 'slide value 505 accepted');
  ok(IM.checkNum('505.88', load_.answer, load_.tol).ok, '505.88 accepted');
  ok(!IM.checkNum('365.5', load_.answer, load_.tol).ok, '430 × 0.85 = 365.5 rejected');
  const veh = n[4].fields[0];
  ok(F(veh.answer).show() === '8.43', 'vehicles show 8.43: ' + F(veh.answer).show());
  ok(IM.checkNum('8.43', veh.answer, veh.tol).ok && IM.checkNum('8.42', veh.answer, veh.tol).ok, '8.43 and 8.42 (505 / 60) accepted');
  ok(!IM.checkNum('8.5', veh.answer, veh.tol).ok && !IM.checkNum('9', veh.answer, veh.tol).ok, '8.5 / 9 rejected in fractional step');
  const N = n[5].fields[0];
  ok(F(N.answer).eq(9) && N.tol == null, 'N = 9 (exact)');
  ok(IM.checkNum('9', N.answer, N.tol).ok && !IM.checkNum('8', N.answer, N.tol).ok && !IM.checkNum('8.43', N.answer, N.tol).ok, 'only 9 accepted');
  // en çok kullanan hücre: 2
  const ch = ex.steps.find((s) => s.kind === 'choice');
  ok(ch.options.filter((o) => o.correct).map((o) => o.html).join() === 'Hücre 2', 'max-usage cell 2');
  // solve()
  const R = D.solve(D.NOTES);
  ok(R.total.eq(430) && R.N.eq(9), 'solve(NOTES)');
  ok(/505/.test(JSON.stringify(ex, rep)), 'slide 505 mentioned');
}

console.log('— random mode: independent recompute');
{
  const cs = new Set();
  for (let s = 1; s <= 400; s++) {
    const ex = D.generate(IM.rng(s * 31), {});
    const { cells, v, c } = ex.data;
    const cn = Number(c);
    cs.add(c);
    // bağımsız: Number aritmetiği, notların yazımıyla
    const use = cells.map((x) => ((x.d + x.d) * x.f) / v + x.f * x.t * 2);
    const total = use.reduce((a, b) => a + b, 0);
    const load = total / cn;
    const veh = load / 60;
    const N = Math.ceil(veh - 1e-9);
    const n = nums(ex);
    const close = (a, b) => Math.abs(F(a).toNumber() - b) < 1e-9;
    ok(n[1].fields.every((f, i) => close(f.answer, use[i])), `seed ${s}: usage`);
    ok(close(n[2].fields[0].answer, total), `seed ${s}: total`);
    ok(close(n[3].fields[0].answer, load), `seed ${s}: load`);
    ok(close(n[4].fields[0].answer, veh), `seed ${s}: vehicles`);
    ok(F(n[5].fields[0].answer).toNumber() === N, `seed ${s}: N`);
    ok(!Number.isInteger(Math.round(veh * 1e6) / 1e6), `seed ${s}: vehicle count non-integer`);
    ok(cells.length >= 3 && cells.length <= 5 && v >= 60 && v <= 80, `seed ${s}: ranges`);
    ok(['0.80', '0.85', '0.90'].includes(c), `seed ${s}: c in set`);
    // ≤2 ondalık
    ok(n.every((st) => st.fields.every((f) => F(f.answer).isNice(2))), `seed ${s}: clean answers`);
    // tek en büyük hücre
    const mx = Math.max(...use);
    ok(use.filter((u) => Math.abs(u - mx) < 1e-9).length === 1, `seed ${s}: unique max`);
    // ≥5 adım, her number adımında explain
    ok(ex.steps.length >= 5 && n.every((st) => st.explain), `seed ${s}: steps/explain`);
  }
  ok(cs.size === 3, 'all three congestion factors appear: ' + [...cs]);
  // determinizm
  const a = JSON.stringify(D.generate(IM.rng(77), {}), rep), b = JSON.stringify(D.generate(IM.rng(77), {}), rep);
  ok(a === b, 'deterministic');
}

console.log(fails ? `${fails} FAIL, ${passes} pass` : `ALL OK (${passes} checks)`);
process.exit(fails ? 1 : 0);
