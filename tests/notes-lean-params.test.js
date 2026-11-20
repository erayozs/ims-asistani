// Usage: node tests/notes-lean-params.test.js
// js/drills/lean-params.js (2.1, LEAN s.2–3, s.187) — notlarda sayısal örnek yok → notes seçeneği yok.
//   1) sabit seed'li örneklerde tüm adım cevaplarının test içi BAĞIMSIZ yeniden hesabı (CSL sevkiyat tablosundan sayılır)
//   2) karar adımı (CT ≤ takt) ⇔ capacity ≥ talep; CSL Type 1 ≠ Type 2
//   3) her sayısal cevap isNice(2), kendi gösterimiyle checkNum'dan geçer; yüzde alanları unit '%'
//   4) determinizm, solve() saf (aynı girdi → aynı çıktı, girdiyi değiştirmez)
const load = require('./load');
const core = ['ns', 'rng', 'frac', 'viz', 'runner'].map((f) => `js/core/${f}.js`);
const IM = load(core.concat(['js/drills/lean-params.js']));
const F = IM.F;
let fails = 0, passes = 0;
function ok(cond, msg) {
  if (cond) passes++;
  else { fails++; if (fails < 30) console.log('✗', msg); }
}
const rep = (k, v) => (typeof v === 'bigint' ? v.toString() : v);
const D = IM.drills['lean-params'];
ok(D && D.topic === '2.1' && typeof D.solve === 'function' && typeof D.gen === 'function', 'drill registered with solve/gen');
ok(!(D.options || []).some((o) => o.key === 'notes'), 'notes seçeneği yok (notlarda sayısal örnek yok)');

const byLabel = (ex, re) => {
  for (const s of ex.steps) for (const f of s.fields || []) if (re.test(f.label)) return f;
  return null;
};
let meetsN = 0, failN = 0;
for (let seed = 1; seed <= 150; seed++) {
  const ex = D.generate(IM.rng(seed * 104729));
  const P = ex.data;
  const tag = `seed ${seed}`;
  // ---- bağımsız yeniden hesap (Number + F, drill'in solve'unu kullanmadan)
  const nwtMin = P.shifts * P.shiftMin - P.shifts * P.breakMin - P.maintMin;
  const nwtSec = nwtMin * 60;
  const takt = F(nwtSec).div(P.demand);
  const cap = F(nwtSec).div(P.ct);
  const input = F(P.workers * nwtMin).div(60);
  const eff = F(P.actual).div(input);
  const effect = F(P.actual * 100).div(P.demand);
  let totQ = 0, okQ = 0, okN = 0;
  for (const s of P.ship) { totQ += s.q; if (!s.prob) { okQ += s.q; okN++; } }
  const csl1 = F(okQ * 100).div(totQ);
  const csl2 = F(okN * 100).div(P.ship.length);
  const chk = (re, v, name) => {
    const f = byLabel(ex, re);
    ok(f && F(f.answer).eq(v), `${tag} ${name}: got ${f && F(f.answer).show()}, expected ${F(v).show()}`);
    return f;
  };
  chk(/^Net working time \(min/, nwtMin, 'NWT min');
  chk(/^Net working time \(s/, nwtSec, 'NWT s');
  chk(/^Takt time/, takt, 'takt');
  chk(/^Capacity/, cap, 'capacity');
  chk(/^Input/, input, 'input');
  chk(/^Efficiency/, eff, 'efficiency');
  const fe = chk(/^Effectiveness/, effect, 'effectiveness');
  const f1 = chk(/^CSL Type 1/, csl1, 'CSL1');
  const f2 = chk(/^CSL Type 2/, csl2, 'CSL2');
  ok(fe && fe.unit === '%' && f1.unit === '%' && f2.unit === '%', `${tag} yüzde alanları unit %`);
  ok(!csl1.eq(csl2), `${tag} CSL Type 1 ≠ Type 2`);
  ok(P.ship.length >= 6 && P.ship.length <= 10, `${tag} 6–10 sevkiyat`);
  ok(P.ship.some((s) => s.prob) && P.ship.filter((s) => !s.prob).length >= 2, `${tag} sorunlu ve sorunsuz sevkiyat var`);
  // karar: CT ≤ takt ⇔ capacity ≥ demand
  ok(P.ct !== takt.toNumber(), `${tag} CT ≠ takt`);
  const meets = F(P.ct).le(takt);
  ok(meets === cap.ge(P.demand), `${tag} CT≤takt ⇔ cap≥D`);
  meets ? meetsN++ : failN++;
  const ch = ex.steps.find((s) => s.kind === 'choice');
  const corr = ch.options.filter((o) => o.correct);
  ok(corr.length === 1 && (meets ? /^Evet/.test(corr[0].html) : /^Hayır/.test(corr[0].html)), `${tag} choice doğru`);
  ok(P.actual < P.demand && F(P.actual).le(cap), `${tag} gerçekleşen < talep, ≤ kapasite`);
  // isNice + kendi kontrolü
  for (const s of ex.steps) for (const f of s.fields || []) {
    ok(F(f.answer).isNice(2), `${tag} ${f.label} isNice(2): ${F(f.answer).exact()}`);
    ok(IM.checkNum(IM.runner.fmt(f.answer), f.answer, f.tol, f.unit).ok, `${tag} ${f.label} shown passes`);
  }
  ok(ex.steps.length >= 5 && ex.steps.length <= 10, `${tag} 5–10 adım`);
  ok(ex.steps.filter((s) => s.kind !== 'info').every((s) => s.explain), `${tag} her adımda explain`);
  // determinizm + saflık
  if (seed <= 10) {
    const ex2 = D.generate(IM.rng(seed * 104729));
    ok(JSON.stringify(ex, rep) === JSON.stringify(ex2, rep), `${tag} determinizm`);
    const before = JSON.stringify(P, rep);
    const a = JSON.stringify(D.solve(P), rep), b = JSON.stringify(D.solve(P), rep);
    ok(a === b && before === JSON.stringify(P, rep), `${tag} solve saf`);
  }
  // metin: kesir yok, notlarda örnek yok notu
  const txt = JSON.stringify({ s: ex.statement, st: ex.steps.map((s) => [s.prompt, s.explain, s.hint]) }).replace(/<[^>]+>/g, '');
  ok(!/(?<![\w.\/])\d+\/\d+(?![\w.\/])/.test(txt), `${tag} a/b kesir yok`);
  ok(/notlarda sayısal örnek yok/.test(ex.statement), `${tag} "(notlarda sayısal örnek yok)" notu`);
}
ok(meetsN > 10 && failN > 10, `iki karar da görülüyor (karşılanır ${meetsN}, karşılanamaz ${failN})`);
console.log(`lean-params: ${passes} passed, ${fails} failed (karşılanır ${meetsN} / karşılanamaz ${failN})`);
console.log(fails ? 'FAIL' : 'ALL OK');
process.exit(fails ? 1 : 0);
