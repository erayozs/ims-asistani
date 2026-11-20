// Usage: node tests/notes-smed.test.js
// js/drills/smed.js (2.6, LEAN s.75–86) — notlarda sayısal örnek yok → notes seçeneği yok.
//   1) sabit seed'li örneklerde Stage 0/1/2 sürelerinin faaliyet listesinden BAĞIMSIZ yeniden toplanması, yüzdeler, kapasite kazancı
//   2) internal/external multi adımı = 'ext' faaliyetler; aynı açıklama her zaman aynı türde (tutarlı sınıflandırma)
//   3) SMED/OTED kararı tek doğru; her iki sonuç da görülüyor
//   4) isNice(2), 6–9 faaliyet, determinizm, solve saf
const load = require('./load');
const core = ['ns', 'rng', 'frac', 'viz', 'runner'].map((f) => `js/core/${f}.js`);
const IM = load(core.concat(['js/drills/smed.js']));
const F = IM.F;
let fails = 0, passes = 0;
function ok(cond, msg) {
  if (cond) passes++;
  else { fails++; if (fails < 30) console.log('✗', msg); }
}
const rep = (k, v) => (typeof v === 'bigint' ? v.toString() : v);
const D = IM.drills.smed;
ok(D && D.topic === '2.6' && typeof D.solve === 'function' && typeof D.gen === 'function', 'drill registered with solve/gen');
ok(!(D.options || []).some((o) => o.key === 'notes'), 'notes seçeneği yok');

const typeOf = new Map();
let smedN = 0, noneN = 0;
for (let seed = 1; seed <= 200; seed++) {
  const ex = D.generate(IM.rng(seed * 6007));
  const P = ex.data;
  const tag = `seed ${seed}`;
  ok(P.acts.length >= 6 && P.acts.length <= 9, `${tag} 6–9 faaliyet`);
  // ---- bağımsız toplamlar (yarım dakika birimiyle tam sayı aritmetiği)
  let h0 = 0, hExt = 0, hConv = 0;
  for (const a of P.acts) {
    const h = F(a.t).mul(2);
    ok(h.isInt() && F(a.t).gt(0), `${tag} süre 0.5 dk'nın katı`);
    h0 += h.toNumber();
    if (a.type === 'ext') hExt += h.toNumber();
    if (a.type === 'conv') hConv += h.toNumber();
    // tutarlı sınıflandırma
    if (typeOf.has(a.desc)) ok(typeOf.get(a.desc) === a.type, `${tag} "${a.desc}" türü tutarlı`);
    else typeOf.set(a.desc, a.type);
  }
  const T0 = F(h0).div(2), T1 = F(h0 - hExt).div(2), T2 = F(h0 - hExt - hConv).div(2);
  ok(hExt > 0 && hConv > 0 && h0 - hExt - hConv > 0, `${tag} external, çevrilebilir ve kalan internal var`);
  const fields = ex.steps.filter((s) => s.kind === 'number').map((s) => s.fields[0]);
  const get = (re) => fields.find((f) => re.test(f.label));
  const eq = (re, v, name) => { const f = get(re); ok(f && F(f.answer).eq(v), `${tag} ${name}: got ${f && F(f.answer).show()}, expected ${F(v).show()}`); return f; };
  eq(/^Stage 0/, T0, 'T0');
  eq(/^Stage 1/, T1, 'T1');
  eq(/^Stage 2/, T2, 'T2');
  const r01 = eq(/Stage 0 → 1/, T0.sub(T1).mul(100).div(T0), 'azalma 0→1');
  const r12 = eq(/Stage 1 → 2/, T1.sub(T2).mul(100).div(T1), 'azalma 1→2');
  ok(r01 && r01.unit === '%' && r12 && r12.unit === '%', `${tag} yüzde alanları unit %`);
  eq(/^Kazanılan kapasite/, T0.sub(T2).mul(P.k), 'kapasite kazancı');
  // multi: external = 'ext'
  const multi = ex.steps.find((s) => s.kind === 'multi');
  ok(multi.options.length === P.acts.length && multi.options.every((o, i) => o.correct === (P.acts[i].type === 'ext')), `${tag} external seçenekleri`);
  // SMED kararı
  ok(!T2.eq(10) && !T2.eq(1), `${tag} sınırda değil`);
  const ch = ex.steps.find((s) => s.kind === 'choice');
  const corr = ch.options.filter((o) => o.correct);
  const isSmed = T2.lt(10) && T2.ge(1);
  isSmed ? smedN++ : noneN++;
  ok(T2.ge(1), `${tag} OTED (<1 dk) üretilmez (gerçekçi)`);
  ok(corr.length === 1 && (isSmed ? /^SMED/.test(corr[0].html) : /^Henüz SMED değil/.test(corr[0].html)), `${tag} SMED/OTED kararı`);
  for (const s of ex.steps) for (const f of s.fields || []) {
    ok(F(f.answer).isNice(2), `${tag} ${f.label} isNice(2)`);
    ok(IM.checkNum(IM.runner.fmt(f.answer), f.answer, f.tol, f.unit).ok, `${tag} ${f.label} shown passes`);
  }
  ok(ex.steps.length >= 5 && ex.steps.length <= 10, `${tag} 5–10 adım`);
  if (seed <= 10) {
    ok(JSON.stringify(ex, rep) === JSON.stringify(D.generate(IM.rng(seed * 6007)), rep), `${tag} determinizm`);
    const before = JSON.stringify(P, rep);
    ok(JSON.stringify(D.solve(P), rep) === JSON.stringify(D.solve(P), rep) && before === JSON.stringify(P, rep), `${tag} solve saf`);
  }
  const txt = JSON.stringify({ s: ex.statement, st: ex.steps.map((s) => [s.prompt, s.explain, s.hint, (s.options || []).map((o) => o.html)]) }).replace(/<[^>]+>/g, '');
  ok(!/(?<![\w.\/])\d+\/\d+(?![\w.\/])/.test(txt), `${tag} a/b kesir yok`);
  ok(/notlarda sayısal örnek yok/.test(ex.statement), `${tag} "(notlarda sayısal örnek yok)" notu`);
}
// sınıflandırma sözlük kontrolü: "sökmek/bağlamak" internal, "depoya/yanına getirmek/hazırlamak" external
for (const [desc, t] of typeOf) {
  if (/makineden sökmek|makineye bağlamak \(mounting\)/.test(desc)) ok(t === 'int', `"${desc}" internal`);
  if (/depoya|makinenin yanına|checklist/.test(desc)) ok(t === 'ext', `"${desc}" external`);
}
ok(smedN > 20 && noneN > 20, `iki sınıf da görülüyor (SMED ${smedN}, henüz değil ${noneN})`);
console.log(`smed: ${passes} passed, ${fails} failed (SMED ${smedN} / ≥10 dk ${noneN}; ${typeOf.size} farklı faaliyet)`);
console.log(fails ? 'FAIL' : 'ALL OK');
process.exit(fails ? 1 : 0);
