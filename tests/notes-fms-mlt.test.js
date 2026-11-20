// Usage: node tests/notes-fms-mlt.test.js
// js/drills/fms-mlt.js (FMS s.5–10) için — notlarda sayısal parça örneği yok, bu yüzden:
//   1) sabit seed'lerle test içinde BAĞIMSIZ yeniden hesap (ham operasyon verisinden; solve() kullanılmadan):
//      To_i = Tm_i + Th_i + Tth_i; MLT iki yoldan: Σ_i (Tsu_i + Q·To_i + Tno_i) ve ΣTsu + Q·ΣTo + ΣTno
//      Tm/To, (Th ∪ Tth)/To, To/MLT = Q·ΣTo/MLT, (Tno ∪ Tsu)/MLT, MLT % azalma
//   2) adım cevapları == bağımsız hesap; FMS bileşenleri gerçekten azalıyor; slayt 10 eğilimi (iki oran artar)
//   3) kavram adımları: slayt 9 bileşen → özellik, To/Tno dalı, turret/magazine, slayt 10 probable %79 / %10
//   4) tüm cevaplar isNice(2), metin temiz, yazım hatası notu var, determinizm, solve() saflığı
const load = require('./load');
const core = ['ns', 'rng', 'frac', 'viz', 'runner'].map((f) => `js/core/${f}.js`);
const IM = load(core.concat(['js/drills/fms-mlt.js']));
const F = IM.F;
let fails = 0, passes = 0;
function ok(cond, msg) {
  if (cond) passes++;
  else { fails++; if (fails < 40) console.log('✗', msg); }
}
const D = IM.drills['fms-mlt'];
const rep = (k, v) => (typeof v === 'bigint' ? v.toString() : v);
const strip = (h) => String(h || '').replace(/<[^>]+>/g, '');
const nums = (ex) => ex.steps.filter((s) => s.kind === 'number');
const fieldsOf = (ex) => nums(ex).flatMap((s) => s.fields);
const field = (ex, re) => {
  const f = fieldsOf(ex).filter((x) => re.test(strip(x.label)));
  if (f.length !== 1) throw new Error('field ' + re + ' found ' + f.length);
  return F(f[0].answer);
};
const correctOf = (st) => st.options.filter((o) => o.correct).map((o) => strip(o.html));
const textOf = (ex) => JSON.stringify({ t: ex.title, s: ex.statement, st: ex.steps, so: ex.solution }, rep);
const FRAC_RE = /(?<![\w.\/])-?\d+\/\d+(?![\w.\/])/;
const sum = (a) => a.reduce((x, y) => x.add(y), F(0));

function recompute(sys, Q) {
  const To = sys.map((o) => F(o.Tm).add(F(o.Th)).add(F(o.Tth)));
  const viaOps = sum(sys.map((o, i) => F(o.Tsu).add(Q.mul(To[i])).add(F(o.Tno))));
  const sTsu = sum(sys.map((o) => F(o.Tsu))), sTno = sum(sys.map((o) => F(o.Tno))), sTo = sum(To), sTm = sum(sys.map((o) => F(o.Tm)));
  const viaComp = sTsu.add(Q.mul(sTo)).add(sTno);
  // float, operasyon operasyon
  let fl = 0;
  sys.forEach((o) => { fl += o.Tsu.toNumber() + Q.toNumber() * (o.Tm.toNumber() + o.Th.toNumber() + o.Tth.toNumber()) + o.Tno.toNumber(); });
  return { To, viaOps, viaComp, fl, sTsu, sTno, sTo, sTm, QTo: Q.mul(sTo), TmTo: sTm.mul(100).div(sTo), ToMLT: Q.mul(sTo).mul(100).div(viaOps) };
}

console.log('— bağımsız yeniden hesap (sabit seed\'ler)');
const seen = { nm: {}, comp: {}, group: {} };
let cnt = 0;
for (let s = 1; s <= 200; s++) {
  const seed = s * 104729 + 7;
  const ex = D.generate(IM.rng(seed), {});
  const P = ex.data.P, Q = F(P.Q), nm = P.nm;
  const tag = `(seed ${seed})`;
  seen.nm[nm] = (seen.nm[nm] || 0) + 1;
  seen.comp[P.comp] = (seen.comp[P.comp] || 0) + 1;
  seen.group[P.group] = (seen.group[P.group] || 0) + 1;
  ok(nm >= 2 && nm <= 3 && P.trad.length === nm && P.fms.length === nm, '2–3 operasyon ' + tag);
  const A = recompute(P.trad, Q), B = recompute(P.fms, Q);
  ok(A.viaOps.eq(A.viaComp) && B.viaOps.eq(B.viaComp), 'MLT: operasyon toplamı = bileşen toplamı ' + tag);
  ok(Math.abs(A.fl - A.viaOps.toNumber()) < 1e-6 && Math.abs(B.fl - B.viaOps.toNumber()) < 1e-6, 'MLT float çapraz kontrol ' + tag);
  // FMS gerçekten azaltıyor
  P.trad.forEach((o, i) => {
    const f = P.fms[i];
    ok(f.Tm.lt(o.Tm) && f.Th.lt(o.Th) && f.Tth.lt(o.Tth) && f.Tsu.lt(o.Tsu) && f.Tno.lt(o.Tno) && f.Tno.gt(0), `FMS bileşenleri azalır (op ${i + 1}) ${tag}`);
  });
  // adım cevapları
  const n = nums(ex);
  ok(n[0].fields.length === nm && n[0].fields.every((f, i) => F(f.answer).eq(A.To[i])), 'geleneksel To_i ' + tag);
  ok(n[1].fields.every((f, i) => F(f.answer).eq(F(P.trad[i].Tsu).add(Q.mul(A.To[i])).add(P.trad[i].Tno))), 'operasyon katkıları ' + tag);
  ok(field(ex, /^MLTtrad/).eq(A.viaOps), 'MLT_trad ' + tag);
  ok(field(ex, /^Tm\/To \(%\)$/).eq(A.TmTo) && field(ex, /^\(Th ∪ Tth\)\/To/).eq(F(100).sub(A.TmTo)), 'geleneksel Tm/To ' + tag);
  ok(field(ex, /^To\/MLT = /).eq(A.ToMLT) && field(ex, /^\(Tno ∪ Tsu\)\/MLT/).eq(F(100).sub(A.ToMLT)), 'geleneksel To/MLT ' + tag);
  ok(A.ToMLT.eq(A.QTo.mul(100).div(A.viaComp)), 'To/MLT = Q·ΣTo / MLT (bileşen yoluyla) ' + tag);
  ok(n[5].fields.length === nm && n[5].fields.every((f, i) => F(f.answer).eq(B.To[i])), 'FMS To_i ' + tag);
  ok(field(ex, /^MLTFMS/).eq(B.viaOps), 'MLT_FMS ' + tag);
  const red = A.viaOps.sub(B.viaOps).mul(100).div(A.viaOps);
  ok(field(ex, /^MLT azalması/).eq(red) && red.ge(30) && red.le(95), 'MLT % azalma ' + tag);
  ok(field(ex, /^FMS Tm\/To/).eq(B.TmTo) && field(ex, /^FMS To\/MLT/).eq(B.ToMLT), 'FMS oranları ' + tag);
  ok(B.TmTo.ge(A.TmTo.add(10)) && B.ToMLT.gt(A.ToMLT), 'slayt 10 eğilimi: iki oran da artar ' + tag);
  ok(A.TmTo.ge(15) && A.TmTo.le(50), 'geleneksel Tm/To %15–50 ' + tag);
  // kavram adımları
  const ch = ex.steps.filter((st) => st.kind === 'choice');
  const compC = correctOf(ch[0]);
  const want = { Tm: /toolpath optimization/, Th: /otomatik yükleme/, Tth: /otomatik takım değiştirme/ }[P.comp];
  ok(compC.length === 1 && want.test(compC[0]), 'slayt 9 bileşen → özellik ' + tag);
  const mc = correctOf(ex.steps.find((st) => st.kind === 'multi'));
  ok(P.group === 'To' ? mc.length === 3 && mc.every((h) => /toolpath|yükleme|takım değiştirme/.test(h)) : mc.length === 2 && mc.every((h) => /taşıma|CAPP/.test(h)), 'To/Tno dalı ' + tag);
  ok(/turret · İşleme merkezi: magazine/.test(correctOf(ch[1])[0]), 'turret / magazine ' + tag);
  const s10 = correctOf(ch[2]);
  ok(s10.length === 1 && /İki oran da artar/.test(s10[0]) && /%30 → %79/.test(s10[0]) && /%5 → %10/.test(s10[0]), 'slayt 10 yorum ' + tag);
  // temiz sayılar ve metin
  ok(fieldsOf(ex).every((f) => F(f.answer).isNice(2)), 'tüm cevaplar isNice(2) ' + tag);
  ok(P.trad.concat(P.fms).every((o) => ['Tsu', 'Tm', 'Th', 'Tth', 'Tno'].every((k) => F(o[k]).isNice(2))), 'veri isNice(2) ' + tag);
  ok(fieldsOf(ex).filter((f) => /%/.test(strip(f.label))).every((f) => f.unit === '%'), "yüzde alanlarında unit:'%' " + tag);
  const txt = textOf(ex);
  ok(!/undefined|NaN|\[object/.test(txt), 'undefined/NaN yok ' + tag);
  ok(!FRAC_RE.test(strip(txt)), 'a/b kesir yok ' + tag);
  ok(/yazım hatası/.test(n[0].explain) && /Tm \+ Th \+ Tth/.test(n[0].explain), 'slayt 8 yazım hatası notu ' + tag);
  ok(/notlarda sayısal örnek yok; formül FMS s\.7–8/.test(ex.statement), 'kaynak ibaresi ' + tag);
  ok(ex.steps.length >= 5 && ex.steps.every((st) => st.explain && /FMS s\.([5-9]|10)/.test(st.explain)), 'adım sayısı ve explain (slayt atfı) ' + tag);
  // stack viz: Trad vs FMS bileşenleri
  const sv = [].concat(ex.steps[6].viz).find((v) => v.type === 'stack');
  ok(sv && sv.rows.length === 2 && Math.abs(sv.rows[0].segs.reduce((a, g) => a + g.v, 0) - A.viaOps.toNumber()) < 1e-6 && Math.abs(sv.rows[1].segs.reduce((a, g) => a + g.v, 0) - B.viaOps.toNumber()) < 1e-6, 'stack viz toplamları = MLT ' + tag);
  // solve() saf ve tutarlı
  const R1 = D.solve(P.trad, Q), R2 = D.solve(P.trad, Q);
  ok(R1.MLT.eq(A.viaOps) && R1.TmTo.eq(A.TmTo) && R1.ToMLT.eq(A.ToMLT) && JSON.stringify(R1, rep) === JSON.stringify(R2, rep), 'solve() = bağımsız hesap, saf ' + tag);
  cnt++;
}
console.log(`   ${cnt} egzersiz; nm ${JSON.stringify(seen.nm)}, bileşen ${JSON.stringify(seen.comp)}, dal ${JSON.stringify(seen.group)}`);
ok(Object.keys(seen.nm).length === 2 && Object.keys(seen.comp).length === 3 && Object.keys(seen.group).length === 2, 'tüm varyantlar görülüyor');

console.log('— determinizm');
for (const seed of [1, 42, 2026, 99991, 123456]) {
  const a = JSON.stringify(D.generate(IM.rng(seed), {}), rep);
  const b = JSON.stringify(D.generate(IM.rng(seed), {}), rep);
  ok(a === b, `aynı seed → aynı egzersiz (${seed})`);
}
ok(JSON.stringify(D.generate(IM.rng(1), {}).data, rep) !== JSON.stringify(D.generate(IM.rng(2), {}).data, rep), 'farklı seed → farklı veri');

console.log('— slayt 10 sabitleri ve elle kontrol edilmiş örnek');
{
  const S10 = D.SLIDE10;
  ok(S10.TmTo.trad === 30 && S10.TmTo.prob === 79 && S10.ToMLT.trad === 5 && S10.ToMLT.prob === 10 && S10.ToMLT.pess === 7.5 && S10.TmTo.opt === 95 && S10.ToMLT.opt === 15, 'slayt 10 değerleri');
  // 2 operasyon, Q = 10: To = 2+1+2 = 5, 3+2+1 = 6 → MLT = (60 + 50 + 600) + (40 + 60 + 290) = 710 + 390 = 1100
  const op = (Tsu, Tm, Th, Tth, Tno) => ({ Tsu: F(Tsu), Tm: F(Tm), Th: F(Th), Tth: F(Tth), Tno: F(Tno) });
  const R = D.solve([op(60, 2, 1, 2, 600), op(40, 3, 2, 1, 290)], 10);
  ok(R.ops[0].To.eq(5) && R.ops[1].To.eq(6) && R.MLT.eq(1100) && R.QTo.eq(110), 'To 5, 6; MLT 1100; Q·ΣTo 110');
  ok(R.TmTo.eq(F(500).div(11)) && R.ToMLT.eq(10), 'Tm/To = 5 / 11 · 100, To/MLT = 10%');
}

console.log(fails ? `${fails} FAILED, ${passes} passed` : `notes-fms-mlt OK (${passes} checks)`);
process.exit(fails ? 1 : 0);
