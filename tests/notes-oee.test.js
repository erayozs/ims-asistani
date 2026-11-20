// Usage: node tests/notes-oee.test.js
// js/drills/oee.js için:
//   1) notes seçeneği LEAN s.189'daki sayıları BİREBİR üretiyor mu (460, 60 → 86.96% [slayt 87%], 50%, 98%, OEE 42.61% [slayt 42.6%])
//   2) rastgele modda OEE'yi İKİ yoldan yeniden hesapla: A·P·Q ve valuable operating time / loading time; P'yi ayrıca teorik CT / gerçekleşen CT ile
//   3) yüzdeler ≤2 ondalık (isNice), en düşük faktör tek, kayıp sınıflandırması, determinizm
const load = require('./load');
const core = ['ns', 'rng', 'frac', 'viz', 'runner'].map((f) => `js/core/${f}.js`);
const IM = load(core.concat(['js/drills/oee.js']));
const F = IM.F;
let fails = 0, passes = 0;
function ok(cond, msg) {
  if (cond) passes++;
  else { fails++; console.log('✗', msg); }
}
const D = IM.drills.oee;
const rep = (k, v) => (typeof v === 'bigint' ? v.toString() : v);
const nums = (ex) => ex.steps.filter((s) => s.kind === 'number');
const fieldBy = (ex, re) => { for (const s of nums(ex)) for (const f of s.fields) if (re.test(f.label)) return f; return null; };
const accepts = (f, str) => IM.checkNum(str, f.answer, f.tol, f.unit).ok;

// ----------------------------------------------------------------------------- 1) notlardaki örnek
console.log('— notes: LEAN s.189');
{
  const ex = D.generate(IM.rng(2), { notes: true }), d = ex.data;
  ok(d.S.L.eq(F(460)) && d.S.O.eq(F(400)), 'loading 460, operating 400');
  ok(d.A.eq(F(400).div(460)), 'A = (460 − 60) / 460');
  ok(d.Pf.eq(F('0.5')), 'P = 0.5 × 400 / 400 = 50%');
  ok(d.Q.eq(F('0.98')), 'Q = (400 − 8) / 400 = 98%');
  ok(d.OEE.eq(F(400).div(460).mul('0.5').mul('0.98')) && d.OEE.mul(100).fixed(2) === '42.61', 'OEE = 42.61%');
  ok(F('0.87').mul('0.5').mul('0.98').mul(100).eq(F('42.63')), 'slayt yuvarlaması 0.87 × 0.50 × 0.98 = 42.63 → 42.6');
  const fA = fieldBy(ex, /^Availability/), fP = fieldBy(ex, /^Performance/), fQ = fieldBy(ex, /^Rate of quality/), fO = fieldBy(ex, /^OEE/);
  ok(fA.unit === '%' && accepts(fA, '86.96') && accepts(fA, '87') && accepts(fA, '86.96%') && !accepts(fA, '86') && !accepts(fA, '88'), 'A alanı: 86.96 ve 87 kabul');
  ok(IM.checkNum('0.87', fA.answer, fA.tol, '%').warn, 'A alanına 0.87 → yüzde uyarısı');
  ok(fP.answer.eq(F(50)) && accepts(fP, '50') && fQ.answer.eq(F(98)) && accepts(fQ, '98'), 'P = 50, Q = 98');
  ok(fO.unit === '%' && accepts(fO, '42.61') && accepts(fO, '42.6') && accepts(fO, '42.63') && !accepts(fO, '43') && !accepts(fO, '42'), 'OEE alanı: 42.61 ve 42.6 kabul');
  ok(fieldBy(ex, /^Operating time/).answer.eq(F(400)) && fieldBy(ex, /^Net operating/).answer.eq(F(200)) && fieldBy(ex, /^Valuable/).answer.eq(F(196)), 'operating 400, net 200, valuable 196');
  ok(d.lowest === 'Performance efficiency', 'en düşük faktör: performance (50%)');
  ok(d.S.val.div(d.S.L).eq(d.OEE), 'valuable / loading = 196 / 460 = OEE');
  const txt = JSON.stringify(ex, rep);
  ok(/LEAN s\.189/.test(txt) && /87%/.test(txt) && /42\.6%/.test(txt), 'slayt değerleri (87%, 42.6%) ve sayfa atfı');
  ok(ex.steps.length >= 5 && ex.steps.length <= 10, 'adım sayısı: ' + ex.steps.length);
}

// ----------------------------------------------------------------------------- 2) rastgele: iki yoldan yeniden hesap
console.log('— rastgele: bağımsız yeniden hesap');
{
  let cnt = 0;
  const low = {}, grp = {};
  for (let s = 1; s <= 400; s++) {
    const ex = D.generate(IM.rng(s * 37 + 3), {}), d = ex.data, P = d.P;
    const L = F(P.G - P.breaks - P.pm);
    const O = L.sub(P.setup + P.breakdown);
    const ct = F(P.ct);
    const A = O.div(L), Pf = ct.mul(P.N).div(O), Q = F(P.N - P.defects).div(P.N);
    const oee1 = A.mul(Pf).mul(Q);
    const oee2 = ct.mul(P.N - P.defects).div(L); // valuable operating time / loading time
    const realCT = O.div(P.N);
    ok(oee1.eq(oee2), `A·P·Q = valuable / loading (seed ${s})`);
    ok(ct.div(realCT).eq(Pf), 'P = teorik CT / gerçekleşen CT (LEAN s.188)');
    const fl = ((O.toNumber() / L.toNumber()) * (ct.toNumber() * P.N / O.toNumber()) * ((P.N - P.defects) / P.N));
    ok(Math.abs(fl - oee1.toNumber()) < 1e-12, 'float kontrol');
    ok(d.A.eq(A) && d.Pf.eq(Pf) && d.Q.eq(Q) && d.OEE.eq(oee1), 'data == yeniden hesap');
    ok(fieldBy(ex, /^Loading/).answer.eq(L) && fieldBy(ex, /^Operating time/).answer.eq(O), 'adım: loading, operating');
    ok(fieldBy(ex, /^Availability/).answer.eq(A.mul(100)) && fieldBy(ex, /^Performance/).answer.eq(Pf.mul(100)) && fieldBy(ex, /^Rate of quality/).answer.eq(Q.mul(100)) && fieldBy(ex, /^OEE/).answer.eq(oee1.mul(100)), 'adım: A, P, Q, OEE yüzdeleri');
    ok(['Availability', 'Performance', 'Rate of quality', 'OEE'].every((k) => fieldBy(ex, new RegExp('^' + k)).unit === '%'), 'yüzde alanları unit %');
    ok([A, Pf, Q, oee1].every((v) => v.mul(100).isNice(2)), 'yüzdeler ≤2 ondalık');
    ok(nums(ex).every((st) => st.fields.every((f) => F(f.answer).isNice(2) && f.tol == null)), 'tüm cevaplar ≤2 ondalık, tol yok');
    ok(A.ge(F('0.7')) && A.le(F('0.96')) && Pf.ge(F('0.55')) && Pf.le(F('0.97')) && Q.ge(F('0.9')) && Q.le(F('0.995')), 'aralıklar');
    // en düşük faktör tek
    const facs = [['Availability', A], ['Performance efficiency', Pf], ['Rate of quality', Q]];
    const mn = facs.reduce((b, f) => (f[1].lt(b[1]) ? f : b));
    ok(facs.filter((f) => f[1].eq(mn[1])).length === 1 && d.lowest === mn[0], 'en düşük faktör tek ve doğru');
    const lastCh = ex.steps[ex.steps.length - 1];
    ok(lastCh.options.find((o) => o.correct).html === mn[0], 'son adım doğru şık');
    // sınıflandırma
    const ch = ex.steps.find((st) => st.kind === 'choice' && /nereye yazılır/.test(st.prompt));
    const c = ch.options.find((o) => o.correct).html, e = d.event.t;
    const expect = /mola|planlı/i.test(e) ? /^Planned/ : /arıza|kırıldı|kalıp|ayar/i.test(e) ? /^Downtime/ : /kısa duruş|çevrim süresi/i.test(e) ? /^Speed/ : /^Defect/;
    ok(expect.test(c), `kayıp sınıfı: "${e}" → ${c}`);
    grp[c.split(' ')[0]] = (grp[c.split(' ')[0]] || 0) + 1;
    low[mn[0]] = (low[mn[0]] || 0) + 1;
    const ex2 = D.generate(IM.rng(s * 37 + 3), {});
    ok(JSON.stringify(ex, rep) === JSON.stringify(ex2, rep), 'determinizm');
    ok(!/undefined|NaN|\[object/.test(JSON.stringify({ a: ex.statement, b: ex.steps, c: ex.solution }, rep)), 'metinde undefined/NaN yok');
    cnt++;
  }
  console.log(`   ${cnt} egzersiz; en düşük: ${JSON.stringify(low)}; sınıflar: ${JSON.stringify(grp)}`);
  ok(Object.keys(low).length === 3 && Object.keys(grp).length === 4, 'çeşitlilik');
}

console.log(fails ? `${fails} FAILED, ${passes} passed` : `notes-oee OK (${passes} checks)`);
process.exit(fails ? 1 : 0);
