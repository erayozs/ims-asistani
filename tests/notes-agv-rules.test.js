// Usage: node tests/notes-agv-rules.test.js
// js/drills/agv-rules.js için (notlarda sayısal örnek yok → notes seçeneği yok):
//   1) her kural seçiminin tablodaki min/max ile BAĞIMSIZ kontrolü (NV = min uzaklık, LIV = max bekleme, LUV = min kullanım,
//      STT/D = min seyir, MOQS = max kuyruk, MROQS = min boş yer, FV/CSR/CP tablodaki Evet/Hayır sütunlarından)
//   2) tek-cevap garantisi: her choice adımında tam 1 doğru, seçenekler tekrarsız, eşitlik yok
//   3) kavram adımları (RV rastgele, LUV iş yükünü eşitler), sayfa atfı, ≥5 adım, determinizm
const load = require('./load');
const core = ['ns', 'rng', 'frac', 'viz', 'runner'].map((f) => `js/core/${f}.js`);
const IM = load(core.concat(['js/drills/agv-rules.js']));
let fails = 0, passes = 0;
function ok(cond, msg) {
  if (cond) passes++;
  else { fails++; console.log('✗', msg); }
}
const D = IM.drills['agv-rules'];
const rep = (k, v) => (typeof v === 'bigint' ? v.toString() : v);
ok(!D.options || !D.options.some((o) => o.key === 'notes'), 'no notes option');
ok(/notlarda sayısal örnek yok/.test(D.description), 'description says no numeric example in notes');

const correctOf = (st) => st.options.filter((o) => o.correct).map((o) => o.html);
const uniqArg = (arr, f) => {
  const m = f(...arr);
  const idx = arr.map((v, i) => (v === m ? i : -1)).filter((i) => i >= 0);
  return idx.length === 1 ? idx[0] : -1;
};
let variants = new Set();
for (let s = 1; s <= 500; s++) {
  const ex = D.generate(IM.rng(s * 13), {});
  const P = ex.data;
  const st = ex.steps;
  const tag = `seed ${s}`;
  ok(st.length >= 5 && st.every((x) => x.kind === 'choice'), `${tag}: ≥5 choice steps`);
  st.forEach((x, i) => {
    ok(correctOf(x).length === 1, `${tag} step ${i}: exactly one correct`);
    const h = x.options.map((o) => o.html);
    ok(new Set(h).size === h.length, `${tag} step ${i}: unique options`);
    ok(/AGV s\.2[0-2]/.test(x.explain || ''), `${tag} step ${i}: page reference`);
  });
  // (a) bağımsız min/max
  const NV = uniqArg(P.vehicles.map((x) => x.dist), Math.min);
  const LIV = uniqArg(P.vehicles.map((x) => x.idle), Math.max);
  const LUV = uniqArg(P.vehicles.map((x) => x.util), Math.min);
  ok(NV >= 0 && LIV >= 0 && LUV >= 0, `${tag}: no ties in vehicle table`);
  ok(new Set([NV, LIV, LUV]).size === 3, `${tag}: three rules pick three different vehicles`);
  ok(correctOf(st[0])[0] === P.vNames[NV], `${tag}: NV`);
  ok(correctOf(st[1])[0] === P.vNames[LIV], `${tag}: LIV`);
  ok(correctOf(st[2])[0] === P.vNames[LUV], `${tag}: LUV`);
  ok(/rastgele/i.test(correctOf(st[3])[0]), `${tag}: RV = random`);
  ok(/LUV/.test(correctOf(st[4])[0]), `${tag}: equalize workload = LUV`);
  // (b)
  const STT = uniqArg(P.stations.map((x) => x.tt), Math.min);
  const MOQS = uniqArg(P.stations.map((x) => x.queue), Math.max);
  const MROQS = uniqArg(P.stations.map((x) => x.space), Math.min);
  ok(STT >= 0 && MOQS >= 0 && MROQS >= 0 && new Set([STT, MOQS, MROQS]).size === 3, `${tag}: station rules unique & distinct`);
  ok(correctOf(st[5])[0] === P.sNames[STT], `${tag}: STT/D`);
  ok(correctOf(st[6])[0] === P.sNames[MOQS], `${tag}: MOQS`);
  ok(correctOf(st[7])[0] === P.sNames[MROQS], `${tag}: MROQS`);
  // (c) path selection
  const W = P.path;
  const loaded = W.map((x, i) => (x.loaded ? i : -1)).filter((i) => i >= 0);
  ok(W.every((x) => !x.critPart || x.loaded), `${tag}: critical part ⇒ loaded`);
  variants.add(loaded.length);
  const fv = correctOf(st[8])[0];
  if (loaded.length === 1) ok(fv === P.pNames[loaded[0]], `${tag}: FV single loaded`);
  else ok(/rastgele/.test(fv) && loaded.every((i) => fv.includes(P.pNames[i])), `${tag}: FV random among loaded: ${fv}`);
  const csr = W.map((x, i) => (x.critStation ? i : -1)).filter((i) => i >= 0);
  const cp = W.map((x, i) => (x.critPart ? i : -1)).filter((i) => i >= 0);
  ok(csr.length === 1 && correctOf(st[9])[0] === P.pNames[csr[0]], `${tag}: CSR`);
  ok(cp.length === 1 && correctOf(st[10])[0] === P.pNames[cp[0]], `${tag}: CP`);
  // solve() ile çapraz kontrol
  const R = D.solve(P);
  ok(R.NV === NV && R.LIV === LIV && R.LUV === LUV && R.STT === STT && R.MOQS === MOQS && R.MROQS === MROQS, `${tag}: solve agrees`);
}
ok(variants.has(1) && variants.has(2), 'both path-selection variants appear');
const a = JSON.stringify(D.generate(IM.rng(5), {}), rep), b = JSON.stringify(D.generate(IM.rng(5), {}), rep);
ok(a === b, 'deterministic');

console.log(fails ? `${fails} FAIL, ${passes} pass` : `ALL OK (${passes} checks)`);
process.exit(fails ? 1 : 0);
