// Usage: node tests/notes-kanban.test.js
// js/drills/kanban.js için:
//   1) notes seçeneği LEAN s.129–130'daki sayıları BİREBİR üretiyor mu (OT 0.059, KCS 892, α 0.30, KB 8 → 8.59/8.55 → 9; 396 → 90; %77)
//   2) rastgele modda bağımsız yeniden hesap: (a) formül KS = ⌈OT(1+α)KCS/KB⌉, (b) "KCS boyunca talebin gerektirdiği kutu sayısı"
//      (kutu kutu sayarak en küçük n: n·KB ≥ (1+α)·OT·KCS), (c) float kontrol
//   3) isNice(2), kesirli KS tam sayı değil, determinizm, metin kontrolleri
const load = require('./load');
const core = ['ns', 'rng', 'frac', 'viz', 'runner'].map((f) => `js/core/${f}.js`);
const IM = load(core.concat(['js/drills/kanban.js']));
const F = IM.F;
let fails = 0, passes = 0;
function ok(cond, msg) {
  if (cond) passes++;
  else { fails++; console.log('✗', msg); }
}
const D = IM.drills.kanban;
const rep = (k, v) => (typeof v === 'bigint' ? v.toString() : v);
const nums = (ex) => ex.steps.filter((s) => s.kind === 'number');
const fieldBy = (ex, re) => { for (const s of nums(ex)) for (const f of s.fields) if (re.test(f.label)) return f; return null; };
const accepts = (f, str) => IM.checkNum(str, f.answer, f.tol, f.unit).ok;

// ----------------------------------------------------------------------------- 1) notlardaki örnek (LEAN s.129–130)
console.log('— notes: SYK 160 (LEAN s.129)');
{
  const ex = D.generate(IM.rng(1), { notes: true }), d = ex.data;
  ok(d.OT.eq(F(32).div(540)), 'OT = 32 / 540');
  ok(d.KCS.eq(F(892)), 'KCS = 10 + 72 + 810 = 892');
  ok(d.P.alpha.eq(F('0.3')) && d.P.KB === 8, 'α = 0.30, KB = 8');
  const exactRaw = F(32).div(540).mul('1.3').mul(892).div(8);
  ok(d.ksRaw.eq(exactRaw), 'kesirli KS = (32/540)·1.3·892/8');
  ok(Math.abs(d.ksRaw.toNumber() - 8.5896) < 1e-4, 'kesirli KS ≈ 8.59: ' + d.ksRaw.toNumber());
  ok(Math.abs(F('0.059').mul('1.3').mul(892).div(8).toNumber() - 8.5521) < 1e-4, '0.059 ile ≈ 8.55');
  ok(d.KS.eq(F(9)), 'KS = 9');
  ok(d.pull1.eq(F(72)) && d.pullOther.eq(F(18)) && d.pullTotal.eq(F(90)), 'pull: 9×8 + 6×3 = 90');
  ok(d.pushParts[0].eq(F(180)) && d.pushParts[1].eq(F(216)) && d.pushTotal.eq(F(396)), 'push: 6×30 + 12×18 = 396');
  ok(d.reduction.eq(F(306).div(396).mul(100)) && d.reduction.fixed(2) === '77.27', 'azalma 77.27%');
  // alanlar ve toleranslar
  const fOT = fieldBy(ex, /^OT \(/), fKCS = fieldBy(ex, /^KCS/), fRaw = fieldBy(ex, /kesirli/), fKS = fieldBy(ex, /^KS/), fRed = fieldBy(ex, /azalma/);
  ok(fOT && accepts(fOT, '0.059') && accepts(fOT, '0.0593') && accepts(fOT, '0.05926') && accepts(fOT, '32/540') && !accepts(fOT, '0.07') && !accepts(fOT, '0.05'), 'OT alanı: 0.059 / 0.0593 kabul');
  ok(fKCS && fKCS.answer.eq(F(892)) && accepts(fKCS, '892') && !accepts(fKCS, '891'), 'KCS alanı 892');
  ok(fRaw && accepts(fRaw, '8.59') && accepts(fRaw, '8.55') && accepts(fRaw, '8.5896') && !accepts(fRaw, '9') && !accepts(fRaw, '8.4'), 'kesirli alan: 8.59 ve 8.55 kabul, 9 red');
  ok(fKS && accepts(fKS, '9') && !accepts(fKS, '8') && !accepts(fKS, '10') && !accepts(fKS, '8.59') && fKS.tol == null, 'KS = 9 tam eşleşme');
  ok(fRed && fRed.unit === '%' && accepts(fRed, '77.27') && accepts(fRed, '77') && accepts(fRed, '77.27%') && !accepts(fRed, '78') && !accepts(fRed, '0.7727'), 'azalma alanı: 77.27 ve 77 kabul');
  ok(IM.checkNum('0.7727', fRed.answer, fRed.tol, '%').warn, '0.7727 yüzde uyarısı');
  ok(fieldBy(ex, /Push toplam/).answer.eq(F(396)) && fieldBy(ex, /Pull toplam/).answer.eq(F(90)), 'toplam alanları 396 / 90');
  // ⌈⌉ ayrı adım: kesirli adımdan hemen sonra
  const ns = nums(ex);
  const iRaw = ns.findIndex((s) => /kesirli/.test(s.fields[0].label));
  ok(iRaw >= 0 && /^KS/.test(ns[iRaw + 1].fields[0].label), '⌈⌉ kesirli değerden sonra ayrı adım');
  // notlardaki ifadeler
  const txt = JSON.stringify(ex, rep);
  ok(/LEAN s\.129/.test(txt) && /LEAN s\.114/.test(txt) && /s\.130/.test(txt), 'sayfa atıfları');
  ok(ex.steps.length >= 5 && ex.steps.length <= 10, 'adım sayısı 5–10: ' + ex.steps.length);
}

// ----------------------------------------------------------------------------- 2) rastgele mod: bağımsız yeniden hesap
console.log('— rastgele: bağımsız yeniden hesap');
{
  let cnt = 0;
  const seenKS = new Set();
  for (let s = 1; s <= 400; s++) {
    const ex = D.generate(IM.rng(s * 101 + 7), {}), d = ex.data, P = d.P;
    // ham veriden (statement'ta görünen sayılar) yeniden hesap
    const OT = F(P.D).div(P.M);
    const KCS = P.comps.reduce((a, c) => a + c.v, 0);
    const batch = P.comps.filter((c) => c.batch).reduce((a, c) => a + c.v, 0);
    const raw = OT.mul(F(1).add(P.alpha)).mul(KCS).div(P.KB);
    const KS = raw.ceil();
    // (b) kutu kutu: KCS boyunca talebin (güvenlik payıyla) gerektirdiği kutu sayısı
    const demandSafe = OT.mul(KCS).mul(F(1).add(P.alpha));
    let n = 0, stock = F(0);
    while (stock.lt(demandSafe)) { n++; stock = stock.add(P.KB); }
    // (c) float
    const fl = Math.ceil((P.D / P.M) * (1 + P.alpha.toNumber()) * KCS / P.KB - 1e-9);
    ok(KS.eq(F(n)) && n === fl, `KS formül = kutu sayımı = float (seed ${s}): ${KS.show()} / ${n} / ${fl}`);
    ok(d.KS.eq(KS) && d.ksRaw.eq(raw) && d.KCS.eq(F(KCS)) && d.batch.eq(F(batch)) && d.OT.eq(OT), 'data == yeniden hesap');
    ok(P.comps.length === 8 && P.comps.filter((c) => c.batch).length === 3, 'KCS: s.114 bileşenleri (8 kalem, 3\'ü parti çevrimi)');
    const pull = KS.mul(P.KB).add(P.other.KS * P.other.KB);
    const push = P.push.reduce((a, p) => a + p.boxes * p.size, 0);
    const red = F(push).sub(pull).div(push).mul(100);
    ok(d.pullTotal.eq(pull) && d.pushTotal.eq(F(push)) && d.reduction.eq(red), 'envanter ve azalma');
    // adım cevapları
    ok(fieldBy(ex, /^OT \(/).answer.eq(OT) && fieldBy(ex, /^KCS/).answer.eq(F(KCS)) && fieldBy(ex, /Parti işleme/).answer.eq(F(batch)), 'adım: OT, parti çevrimi, KCS');
    ok(fieldBy(ex, /^OT·KCS/).answer.eq(OT.mul(KCS)) && fieldBy(ex, /^OT·\(1\+α\)·KCS \(pc\)/).answer.eq(demandSafe), 'adım: OT·KCS, OT(1+α)KCS');
    ok(fieldBy(ex, /kesirli/).answer.eq(raw) && fieldBy(ex, /^KS/).answer.eq(KS), 'adım: kesirli ve ⌈⌉');
    ok(fieldBy(ex, /azalma/).answer.eq(red) && fieldBy(ex, /azalma/).unit === '%', 'adım: azalma %');
    // kalite kapıları
    ok(!raw.isInt() && raw.isNice(2), 'kesirli KS tam sayı değil ve ≤2 ondalık: ' + raw.exact());
    ok(KS.ge(3) && KS.le(16) && red.ge(40) && red.le(90), 'aralıklar');
    let allNice = true;
    for (const st of nums(ex)) for (const f of st.fields) if (!F(f.answer).isNice(2) || f.tol != null) allNice = false;
    ok(allNice, 'tüm cevaplar ≤2 ondalık ve tol yok (seed ' + s + ')');
    ok(OT.isNice(2) && P.alpha.isNice(2), 'OT ve α ≤2 ondalık');
    // determinizm
    const ex2 = D.generate(IM.rng(s * 101 + 7), {});
    ok(JSON.stringify(ex, rep) === JSON.stringify(ex2, rep), 'determinizm');
    const txt = JSON.stringify({ a: ex.statement, b: ex.steps, c: ex.solution }, rep);
    ok(!/undefined|NaN|\[object/.test(txt), 'metinde undefined/NaN yok');
    seenKS.add(KS.toNumber());
    cnt++;
  }
  console.log(`   ${cnt} egzersiz; KS değerleri: ${[...seenKS].sort((a, b) => a - b).join(',')}`);
  ok(seenKS.size >= 8, 'KS çeşitliliği');
}

console.log(fails ? `${fails} FAILED, ${passes} passed` : `notes-kanban OK (${passes} checks)`);
process.exit(fails ? 1 : 0);
