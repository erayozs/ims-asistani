// Usage: node tests/notes-tlc-time.test.js
// js/drills/tlc-time.js (INT s.12–14) için — notlarda sayısal örnek yok, bu yüzden:
//   1) sabit seed'lerle test içinde BAĞIMSIZ yeniden hesap (ham veriden; drill'in solve()'u kullanılmadan):
//      TTLC = BQT1 + BT2 + T3 (dakika), TLC = T1 + T2/Q + T3/BQ, TTLC/(BQ) = TLC, paylar, senaryo TLC' ve % iyileşme
//   2) adım cevapları == bağımsız hesap; choice/multi doğru seçenekleri (baskın terim, INT s.14, B/Q iki katı)
//   3) tüm sayısal cevaplar isNice(2); metinde a/b kesir, undefined/NaN yok; "(notlarda sayısal örnek yok" ibaresi var
//   4) determinizm, senaryo seçeneğine uyum, solve() saflığı, float çapraz kontrol
const load = require('./load');
const core = ['ns', 'rng', 'frac', 'viz', 'runner'].map((f) => `js/core/${f}.js`);
const IM = load(core.concat(['js/drills/tlc-time.js']));
const F = IM.F;
let fails = 0, passes = 0;
function ok(cond, msg) {
  if (cond) passes++;
  else { fails++; if (fails < 40) console.log('✗', msg); }
}
const D = IM.drills['tlc-time'];
const rep = (k, v) => (typeof v === 'bigint' ? v.toString() : v);
const strip = (h) => String(h || '').replace(/<[^>]+>/g, '');
const fieldsOf = (ex) => ex.steps.filter((s) => s.kind === 'number').flatMap((s) => s.fields);
const field = (ex, re) => {
  const f = fieldsOf(ex).filter((x) => re.test(strip(x.label)));
  if (f.length !== 1) throw new Error('field ' + re + ' found ' + f.length);
  return F(f[0].answer);
};
const correctOf = (st) => st.options.filter((o) => o.correct).map((o) => strip(o.html));
const textOf = (ex) => JSON.stringify({ t: ex.title, s: ex.statement, st: ex.steps, so: ex.solution }, rep);
const FRAC_RE = /(?<![\w.\/])-?\d+\/\d+(?![\w.\/])/;

console.log('— bağımsız yeniden hesap (sabit seed\'ler)');
const seenKind = {}, seenDom = {}, seenDbl = {};
let cnt = 0;
for (const scenario of ['mix', 'automation', 'cadcam'])
  for (let s = 1; s <= 80; s++) {
    const seed = s * 7919 + 13;
    const ex = D.generate(IM.rng(seed), { scenario });
    const P = ex.data.P;
    const tag = `(${scenario}, seed ${seed})`;
    // ---- ham veri → bağımsız hesap (dakika)
    const T1 = F(P.T1), T2 = F(P.T2h).mul(60), T3 = F(P.T3h).mul(60), B = F(P.B), Q = F(P.Q);
    const BQ = B.mul(Q);
    const terms = [B.mul(Q).mul(T1), B.mul(T2), T3];
    const TTLC = terms[0].add(terms[1]).add(terms[2]);
    const TLC = T1.add(T2.div(Q)).add(T3.div(B.mul(Q)));
    ok(TTLC.div(BQ).eq(TLC), 'TTLC/(BQ) = TLC ' + tag);
    // float çapraz kontrol
    const fT = P.B * P.Q * T1.toNumber() + P.B * T2.toNumber() + T3.toNumber();
    ok(Math.abs(fT - TTLC.toNumber()) < 1e-6 && Math.abs(fT / (P.B * P.Q) - TLC.toNumber()) < 1e-9, 'float TTLC/TLC ' + tag);
    const shares = terms.map((t) => t.mul(100).div(TTLC));
    ok(shares[0].add(shares[1]).add(shares[2]).eq(100), 'paylar toplamı 100 ' + tag);
    // ---- adım cevapları
    ok(field(ex, /^T2 \(min\/batch\)$/).eq(T2) && field(ex, /^T3 \(min\)$/).eq(T3), 'birim dönüşümü ' + tag);
    ok(field(ex, /^BQ \(pc\)$/).eq(BQ), 'BQ ' + tag);
    ok(field(ex, /^B·Q·T1 \(min\)$/).eq(terms[0]), 'BQT1 ' + tag);
    ok(field(ex, /^B·T2 \(min\)$/).eq(terms[1]), 'BT2 ' + tag);
    ok(field(ex, /^TTLC \(min\)$/).eq(TTLC) && field(ex, /^TTLC \(h\)$/).eq(TTLC.div(60)), 'TTLC min/h ' + tag);
    ok(field(ex, /^T2 \/ Q/).eq(T2.div(Q)) && field(ex, /^T3 \/ BQ/).eq(T3.div(BQ)) && field(ex, /^TLC \(min\/pc\)$/).eq(TLC), 'TLC bileşenleri ' + tag);
    ok(field(ex, /^B·Q·T1 payı/).eq(shares[0]) && field(ex, /^B·T2 payı/).eq(shares[1]) && field(ex, /^T3 payı/).eq(shares[2]), 'paylar ' + tag);
    // baskın terim: tek ve doğru seçenek
    const order = shares.map((x, i) => [x.toNumber(), i]).sort((a, b) => b[0] - a[0]);
    ok(order[0][0] - order[1][0] >= 5, 'baskın terim marjı ≥ 5 puan ' + tag);
    const domStep = ex.steps.find((st) => st.kind === 'choice' && /baskındır/.test(st.prompt));
    const domC = correctOf(domStep);
    ok(domC.length === 1 && domC[0].startsWith(['B·Q·T1', 'B·T2', 'T3'][order[0][1]]), 'baskın terim seçeneği ' + tag);
    seenDom[order[0][1]] = (seenDom[order[0][1]] || 0) + 1;
    // ---- senaryo
    const sc = P.scen;
    seenKind[sc.kind] = (seenKind[sc.kind] || 0) + 1;
    if (scenario !== 'mix') ok(sc.kind === scenario, 'senaryo seçeneğine uyum ' + tag);
    const red = (v, p) => v.mul(F(100 - (p || 0))).div(100);
    const n1 = red(T1, sc.x), n2 = red(T2, sc.y), n3 = red(T3, sc.z);
    if (sc.kind === 'automation') ok(sc.x > sc.y && sc.y > 0 && !sc.z && n3.eq(T3), 'automation: T1 ve T2 (özellikle T1) azalır, T3 sabit ' + tag);
    else ok(!sc.x && sc.y > 0 && sc.z > 0 && n1.eq(T1), 'CAD/CAM: T2 ve T3 azalır, T1 sabit ' + tag);
    const TLCn = n1.add(n2.div(Q)).add(n3.div(BQ));
    const TTLCn = BQ.mul(n1).add(B.mul(n2)).add(n3);
    ok(TTLCn.div(BQ).eq(TLCn), 'senaryo TTLC/(BQ) = TLC ' + tag);
    const imp = TLC.sub(TLCn).mul(100).div(TLC);
    ok(field(ex, /^Yeni TLC/).eq(TLCn) && field(ex, /iyileşmesi/).eq(imp), 'yeni TLC ve iyileşme ' + tag);
    if (sc.kind === 'automation') ok(field(ex, /^Yeni T1/).eq(n1) && field(ex, /^Yeni T2/).eq(n2), 'yeni T1, T2 ' + tag);
    else ok(field(ex, /^Yeni T2/).eq(n2) && field(ex, /^Yeni T3/).eq(n3), 'yeni T2, T3 ' + tag);
    ok(imp.gt(0), 'iyileşme pozitif ' + tag);
    // INT s.14 kavram adımı
    const techStep = ex.steps.find((st) => st.kind === 'choice' && /INT s\.14/.test(st.prompt));
    const tc = correctOf(techStep);
    ok(tc.length === 1 && (sc.kind === 'automation' ? /özellikle T1/.test(tc[0]) : /en çok T2 ve T3/.test(tc[0])), 'INT s.14 doğru seçenek ' + tag);
    // B / Q iki katı (multi)
    const dbl = ex.steps.find((st) => st.kind === 'multi');
    const dc = correctOf(dbl).sort();
    seenDbl[P.dbl] = (seenDbl[P.dbl] || 0) + 1;
    ok(P.dbl === 'B' ? dc.join('|') === 'T3 / BQ' : dc.join('|') === 'T2 / Q|T3 / BQ', 'iki katı adımı ' + tag + ' ' + dc.join('|'));
    // ---- temiz sayılar, metin
    ok(fieldsOf(ex).every((f) => F(f.answer).isNice(2)), 'tüm cevaplar isNice(2) ' + tag);
    ok([P.T1, P.T2h, P.T3h, n1, n2, n3, T2.div(Q), T3.div(BQ)].every((v) => F(v).isNice(2)), 'veri ve ara değerler isNice(2) ' + tag);
    const txt = textOf(ex);
    ok(!/undefined|NaN|\[object/.test(txt), 'undefined/NaN yok ' + tag);
    ok(!FRAC_RE.test(strip(txt).replace(/\\u003c|\\"/g, ' ')), 'a/b kesir yok ' + tag);
    ok(/notlarda sayısal örnek yok; formül INT s\.12–13/.test(ex.statement), 'kaynak ibaresi ' + tag);
    ok(ex.steps.length >= 5 && ex.steps.filter((st) => st.kind !== 'info').every((st) => st.explain && /INT s\.1[234]/.test(st.explain)), 'adım sayısı ve explain ' + tag);
    // ---- solve() saf ve egzersizle tutarlı
    const R1 = D.solve(P), R2 = D.solve(P);
    ok(R1.TLC.eq(TLC) && R1.TTLC.eq(TTLC) && R1.scen.TLC.eq(TLCn) && R1.scen.imp.eq(imp) && JSON.stringify(R1, rep) === JSON.stringify(R2, rep), 'solve() = bağımsız hesap, saf ' + tag);
    cnt++;
  }
console.log(`   ${cnt} egzersiz; senaryolar ${JSON.stringify(seenKind)}, baskın terim ${JSON.stringify(seenDom)}, iki katı ${JSON.stringify(seenDbl)}`);
ok(Object.keys(seenKind).length === 2 && Object.keys(seenDom).length === 3 && Object.keys(seenDbl).length === 2, 'tüm varyantlar görülüyor');

console.log('— determinizm');
for (const scenario of ['mix', 'automation', 'cadcam'])
  for (const seed of [1, 42, 2026, 99991]) {
    const a = JSON.stringify(D.generate(IM.rng(seed), { scenario }), rep);
    const b = JSON.stringify(D.generate(IM.rng(seed), { scenario }), rep);
    ok(a === b, `aynı seed → aynı egzersiz (${scenario}, ${seed})`);
  }
ok(JSON.stringify(D.generate(IM.rng(1), {}).data, rep) !== JSON.stringify(D.generate(IM.rng(2), {}).data, rep), 'farklı seed → farklı veri');

console.log('— elle kontrol edilmiş örnek (solve)');
{
  // T1 = 12 min, T2 = 8 h, T3 = 140 h, B = 7, Q = 20 → BQ = 140; TTLC = 1680 + 3360 + 8400 = 13440 min = 224 h; TLC = 12 + 24 + 60 = 96
  const R = D.solve({ T1: F(12), T2h: F(8), T3h: F(140), B: 7, Q: 20, scen: { kind: 'automation', x: 40, y: 25, z: 0 } });
  ok(R.BQ.eq(140) && R.TTLC.eq(13440) && R.TTLCh.eq(224) && R.TLC.eq(96), 'TTLC 13440 min = 224 h, TLC 96');
  ok(R.shares[0].eq('12.5') && R.shares[1].eq(25) && R.shares[2].eq('62.5') && R.dom === 2, 'paylar 12.5 / 25 / 62.5, baskın T3');
  ok(R.scen.n1.eq('7.2') && R.scen.n2.eq(360) && R.scen.TLC.eq('85.2') && R.scen.imp.eq('11.25'), "automation: T1' 7.2, T2' 360, TLC' 85.2, iyileşme 11.25%");
}

console.log(fails ? `${fails} FAILED, ${passes} passed` : `notes-tlc-time OK (${passes} checks)`);
process.exit(fails ? 1 : 0);
