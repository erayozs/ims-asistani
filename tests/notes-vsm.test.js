// Usage: node tests/notes-vsm.test.js
// js/drills/vsm.js (2.3, LEAN s.22 current state, s.24 future state):
//   1) notes modu LEAN s.22'yi BİREBİR üretir: günlük talep 920, takt 60, envanter günleri 7.6/1.8/2.7/2/4.5 (notların yuvarlaması),
//      LT 23.6, VA 188, C/T > takt = yalnızca Assembly #1, future LT 4.5 → 80.93%; yuvarlanmamış değerler (7.61, 23.62) de kabul
//   2) rastgele modda bağımsız yeniden hesap (talep, takt, günler, LT, VA, C/T > takt kümesi, LT azalması), isNice(2)
//   3) determinizm, solve saf
const load = require('./load');
const core = ['ns', 'rng', 'frac', 'viz', 'runner'].map((f) => `js/core/${f}.js`);
const IM = load(core.concat(['js/drills/vsm.js']));
const F = IM.F;
let fails = 0, passes = 0;
function ok(cond, msg) {
  if (cond) passes++;
  else { fails++; if (fails < 30) console.log('✗', msg); }
}
const rep = (k, v) => (typeof v === 'bigint' ? v.toString() : v);
const D = IM.drills.vsm;
const nums = (ex) => ex.steps.filter((s) => s.kind === 'number');
const accepts = (f, s) => IM.checkNum(s, f.answer, f.tol, f.unit).ok;

console.log('— notes: LEAN s.22 Holder Bracket');
{
  ok(D.options.some((o) => o.key === 'notes' && o.type === 'checkbox' && /LEAN s\.22/.test(o.label)), 'notes seçeneği var');
  const ex = D.generate(IM.rng(1), { notes: true });
  const P = ex.data;
  ok(P.notes === true && P.monthly === 18400 && P.days === 20 && P.shifts === 2 && P.shiftSec === 27600, 'girdiler: 18,400/ay, 20 gün, 2 × 27,600 s');
  ok(P.procs.map((p) => p.ct).join(',') === '1,39,46,62,40', 'C/T 1, 39, 46, 62, 40');
  ok(P.procs.map((p) => p.name).join('|') === 'Press|Welding #1|Welding #2|Assembly #1|Assembly #2', 'süreç adları');
  ok(P.procs.map((p) => p.avail).join(',') === '85,100,80,100,100', 'availability 85/100/80/100/100');
  ok(P.procs.map((p) => p.co).join('|') === '1 hour|10 min|10 min|0|0', 'C/O');
  ok(P.inv.map((v) => v.q).join(',') === '7000,1700,2450,1840,4140', 'envanterler 7000, 1700, 2450, 1840, 4140');
  ok(F(P.rawDays).eq(5), 'steel coil 5 gün');
  // bağımsız: L + R toplamları
  const LR = [[4600, 2400], [1100, 600], [1600, 850], [1200, 640], [2700, 1440]];
  ok(LR.every(([l, r], i) => l + r === P.inv[i].q), 'L + R = envanter');
  ok(12000 + 6400 === P.monthly, '12000 L + 6400 R = 18400');
  const n = nums(ex);
  ok(F(n[0].fields[0].answer).eq(920), 'günlük talep 920');
  ok(F(n[1].fields[0].answer).eq(55200) && F(n[1].fields[1].answer).eq(60), 'takt = 55,200 / 920 = 60');
  const want = ['7.6', '1.8', '2.7', '2', '4.5'];
  n[2].fields.forEach((f, i) => ok(F(f.answer).eq(F(want[i])), `envanter günü ${i}: ${F(f.answer).show()} = ${want[i]}`));
  // hem tam (2 ondalık) hem notların yuvarlaması kabul
  n[2].fields.forEach((f, i) => {
    const exact = F(P.inv[i].q).div(920);
    ok(accepts(f, exact.fixed(2)) && accepts(f, want[i]), `gün ${i}: ${exact.fixed(2)} ve ${want[i]} kabul`);
  });
  ok(!accepts(n[2].fields[1], '1.9') && !accepts(n[2].fields[0], '7.7'), 'yanlış günler (1.9, 7.7) reddedilir');
  ok(F(n[3].fields[0].answer).eq(F('23.6')), 'LT = 23.6');
  ok(F('5').add(want.reduce((a, x) => a.add(F(x)), F(0))).eq(F('23.6')), 'notların günleriyle 5 + 7.6 + 1.8 + 2.7 + 2 + 4.5 = 23.6');
  const ltExact = F(5).add(F(7000 + 1700 + 2450 + 1840 + 4140).div(920));
  ok(accepts(n[3].fields[0], ltExact.fixed(2)) && accepts(n[3].fields[0], '23.6'), `LT ${ltExact.fixed(2)} ve 23.6 kabul`);
  ok(F(n[4].fields[0].answer).eq(188), 'VA = 188');
  const multi = ex.steps.find((s) => s.kind === 'multi');
  const corr = multi.options.filter((o) => o.correct).map((o) => o.html);
  ok(corr.length === 1 && /^Assembly #1/.test(corr[0]), 'C/T > takt: yalnızca Assembly #1 (62 > 60): ' + corr.join(','));
  ok(/notlarda yok/.test(multi.prompt), 'multi adımı "(notlarda yok: yorum)"');
  const red = n[5].fields[0];
  ok(F(red.answer).eq(F('80.93')) && red.unit === '%', 'LT azalması 80.93%');
  ok(Math.abs(F('23.6').sub(F('4.5')).div(F('23.6')).mul(100).toNumber() - 80.93) < 0.005, '(23.6 − 4.5) / 23.6 = 80.93%');
  ok(accepts(red, '80.93') && accepts(red, '80.95') && accepts(red, '80.93%'), 'azalma 80.93 / 80.95 kabul');
  ok(/23\.6/.test(ex.solution) && /188/.test(ex.solution), 'çözüm özetinde 23.6 ve 188');
  // viz
  ok(ex.steps.every((s) => [s.viz, s.vizDuring].filter(Boolean).every((v) => { try { IM.viz.render(v); return true; } catch (e) { return false; } })), 'viz render');
  const last = ex.steps.filter((s) => s.viz).pop().viz;
  ok(last.type === 'flow' && last.timeline.lt === '23.60 gün' && last.timeline.va === '188 s', 'timeline sonunda LT ve VA: ' + last.timeline.lt + ' / ' + last.timeline.va);
  ok(ex.viz.timeline.lt === '?' && ex.viz.timeline.inv[1] === '?', 'başlangıçta timeline boş');
  // determinizm (notes seed'den bağımsız)
  ok(JSON.stringify(D.generate(IM.rng(99), { notes: true }), rep) === JSON.stringify(ex, rep), 'notes örneği seed\'den bağımsız');
}

console.log('— random mode: bağımsız yeniden hesap');
let overSeen = 0, noneSeen = 0, k4 = 0, k5 = 0;
for (let seed = 1; seed <= 200; seed++) {
  const ex = D.generate(IM.rng(seed * 7907), { notes: false });
  const P = ex.data;
  const tag = `seed ${seed}`;
  const n = nums(ex);
  const daily = P.monthly / P.days;
  ok(Number.isInteger(daily), `${tag} günlük talep tam sayı`);
  const takt = F(P.shifts * P.shiftSec).div(daily);
  ok(takt.isInt(), `${tag} takt tam sayı`);
  ok(P.procs.length === 4 || P.procs.length === 5, `${tag} 4–5 süreç`);
  P.procs.length === 4 ? k4++ : k5++;
  ok(P.inv.length === P.procs.length, `${tag} süreç başına bir envanter`);
  ok(F(n[0].fields[0].answer).eq(daily), `${tag} günlük talep`);
  ok(F(n[1].fields[0].answer).eq(P.shifts * P.shiftSec) && F(n[1].fields[1].answer).eq(takt), `${tag} takt`);
  let lt = F(P.rawDays);
  P.inv.forEach((v, i) => {
    ok(Number.isInteger(v.q), `${tag} envanter tam sayı`);
    const dd = F(v.q).div(daily);
    lt = lt.add(dd);
    ok(dd.isNice(2) && F(n[2].fields[i].answer).eq(dd), `${tag} envanter günü ${i}`);
  });
  ok(F(n[3].fields[0].answer).eq(lt), `${tag} LT`);
  const va = P.procs.reduce((a, p) => a + p.ct, 0);
  ok(F(n[4].fields[0].answer).eq(va), `${tag} VA`);
  const over = P.procs.filter((p) => F(p.ct).gt(takt)).map((p) => p.name);
  ok(P.procs.every((p) => !F(p.ct).eq(takt)), `${tag} C/T ≠ takt`);
  const multi = ex.steps.find((s) => s.kind === 'multi');
  const corr = multi.options.filter((o) => o.correct).map((o) => o.html);
  if (over.length) { overSeen++; ok(corr.length === over.length && over.every((nm) => corr.some((h) => h.startsWith(nm + ' '))), `${tag} C/T > takt kümesi`); }
  else { noneSeen++; ok(corr.length === 1 && /^Hiçbiri/.test(corr[0]), `${tag} hiçbiri`); }
  const red = lt.sub(P.futureLT).div(lt).mul(100);
  ok(F(n[5].fields[0].answer).eq(red) && n[5].fields[0].unit === '%', `${tag} LT azalması`);
  ok(F(P.futureLT).lt(lt), `${tag} future LT < LT`);
  for (const s of ex.steps) for (const f of s.fields || []) {
    ok(F(f.answer).isNice(2), `${tag} ${f.label} isNice(2)`);
    ok(f.tol === undefined, `${tag} rastgele modda tol yok`);
  }
  ok(ex.steps.length >= 5 && ex.steps.length <= 10, `${tag} 5–10 adım`);
  if (seed <= 10) {
    ok(JSON.stringify(ex, rep) === JSON.stringify(D.generate(IM.rng(seed * 7907), { notes: false }), rep), `${tag} determinizm`);
    const before = JSON.stringify(P, rep);
    ok(JSON.stringify(D.solve(P), rep) === JSON.stringify(D.solve(P), rep) && before === JSON.stringify(P, rep), `${tag} solve saf`);
  }
  const txt = JSON.stringify({ s: ex.statement, st: ex.steps.map((s) => [s.prompt, s.explain, s.hint]) }).replace(/<[^>]+>/g, '');
  ok(!/(?<![\w.\/])\d+\/\d+(?![\w.\/])/.test(txt), `${tag} a/b kesir yok`);
}
ok(overSeen > 10 && noneSeen > 10, `rastgele modda iki durum da var (C/T>takt ${overSeen}, hiçbiri ${noneSeen})`);
ok(k4 > 10 && k5 > 10, `4 ve 5 süreçli örnekler (${k4}/${k5})`);
console.log(`vsm: ${passes} passed, ${fails} failed`);
console.log(fails ? 'FAIL' : 'ALL OK');
process.exit(fails ? 1 : 0);
