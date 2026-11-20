// Usage: node tests/notes-agv-sim.test.js
// js/drills/agv-sim.js için:
//   1) notlardaki 8 yolun TrT'leri (segment 2 dk): A→a 2, a→A 6, a→b 4, b→e 6, A→e 6, e→b 8, e→f 2, b→c 2
//   2) Vehicle Loading Table (AGV s.27) Comp sütunu: 14, 20, 19, 23, 24, 31, 30, 38, 39, 40, 43
//   3) Path Loading Table (AGV s.28): seyir STT–ENDT ve segment bazında S–F değerleri BİREBİR
//   4) Machine Loading Table (AGV s.29): M1 14→19, 19→25, 25→30 · M3 31→38, 38→46 · M2 43→46
//   5) notes egzersizlerinin adım cevapları = tablo; rastgele mod bağımsız yeniden hesap; determinizm
const load = require('./load');
const core = ['ns', 'rng', 'frac', 'viz', 'runner'].map((f) => `js/core/${f}.js`);
const IM = load(core.concat(['js/drills/agv-sim.js']));
const F = IM.F;
let fails = 0, passes = 0;
function ok(cond, msg) {
  if (cond) passes++;
  else { fails++; console.log('✗', msg); }
}
const D = IM.drills['agv-sim'];
const rep = (k, v) => (typeof v === 'bigint' ? v.toString() : v);
const num = (x) => F(x).toNumber();

console.log('— 8 paths (AGV s.27–28)');
{
  const expect = { 'A-a': ['1,9', 2], 'a-A': ['9,11,8,1', 6], 'a-b': ['9,12,3', 4], 'b-e': ['3,4,5,6', 6], 'A-e': ['1,9,10,6', 6], 'e-b': ['6,7,11,12,3', 8], 'e-f': ['6,7', 2], 'b-c': ['3,4', 2] };
  ok(Object.keys(D.PATHS).length === 8, '8 paths');
  for (const [k, [p, trt]] of Object.entries(expect)) {
    ok(D.PATHS[k] && D.PATHS[k].path.join(',') === p, `path ${k} = ${p}`);
    const R = D.solve({ key: k, stt: 0, seg: 2, lul: 2 });
    ok(num(R.trt) === trt, `TrT ${k} = ${trt} (got ${num(R.trt)})`);
    // bağımsız: (segment sayısı − 1) × 2
    ok((p.split(',').length - 1) * 2 === trt, `independent TrT ${k}`);
  }
  ok(['A-a', 'A-e', 'b-e', 'b-c'].every((k) => D.PATHS[k].loaded) && ['a-A', 'a-b', 'e-b', 'e-f'].every((k) => !D.PATHS[k].loaded), 'loaded/empty classification as in tables');
}

console.log('— Vehicle / Path / Machine Loading Tables (AGV s.27–29)');
// L: [V, from, to, STT, travel start, ENDT, Comp, {seg:[S,F]}, machine [start, end] | null]
const TABLE = {
  1: [1, 'A', 'a', 10, 11, 13, 14, { 1: [11, 12], 9: [12, 13] }, [14, 19]],
  2: [1, 'a', 'A', 14, 14, 20, 20, { 9: [14, 15], 11: [15, 17], 8: [17, 19], 1: [19, 20] }, null],
  3: [2, 'A', 'a', 15, 16, 18, 19, { 1: [16, 17], 9: [17, 18] }, [19, 25]],
  4: [2, 'a', 'b', 19, 19, 23, 23, { 9: [19, 20], 12: [20, 22], 3: [22, 23] }, null],
  7: [1, 'A', 'a', 20, 21, 23, 24, { 1: [21, 22], 9: [22, 23] }, [25, 30]],
  8: [2, 'b', 'e', 23, 24, 30, 31, { 3: [24, 25], 4: [25, 27], 5: [27, 29], 6: [29, 30] }, [31, 38]],
  9: [1, 'a', 'A', 24, 24, 30, 30, { 9: [24, 25], 11: [25, 27], 8: [27, 29], 1: [29, 30] }, null],
  12: [1, 'A', 'e', 30, 31, 37, 38, { 1: [31, 32], 9: [32, 34], 10: [34, 36], 6: [36, 37] }, [38, 46]],
  14: [2, 'e', 'b', 31, 31, 39, 39, { 6: [31, 32], 7: [32, 34], 11: [34, 36], 12: [36, 38], 3: [38, 39] }, null],
  16: [1, 'e', 'f', 38, 38, 40, 40, { 6: [38, 39], 7: [39, 40] }, null],
  17: [2, 'b', 'c', 39, 40, 42, 43, { 3: [40, 41], 4: [41, 42] }, [43, 46]],
};
{
  ok(D.ROWS.map((r) => r.L).join(',') === Object.keys(TABLE).join(','), 'notes rows = 1,2,3,4,7,8,9,12,14,16,17');
  ok(D.ROWS.map((r) => num(D.solve(D.notesTrip(r)).comp)).join(',') === '14,20,19,23,24,31,30,38,39,40,43', 'Comp column 14,20,19,23,24,31,30,38,39,40,43');
  for (const r of D.ROWS) {
    const [V, from, to, stt, ts, te, comp, segs, mach] = TABLE[r.L];
    const T = D.notesTrip(r);
    const R = D.solve(T);
    const tag = `row ${r.L}`;
    ok(T.V === V && T.from === from && T.to === to && T.stt === stt, `${tag}: V/from/to/STT`);
    ok(num(R.ts) === ts && num(R.te) === te, `${tag}: travel ${ts}–${te} (got ${num(R.ts)}–${num(R.te)})`);
    ok(num(R.comp) === comp, `${tag}: Comp ${comp}`);
    ok(R.segs.map((x) => x.seg).join(',') === Object.keys(segs).sort((a, b) => R.path.indexOf(+a) - R.path.indexOf(+b)).join(','), `${tag}: segment order`);
    for (const x of R.segs) ok(num(x.S) === segs[x.seg][0] && num(x.F) === segs[x.seg][1], `${tag}: seg ${x.seg} ${segs[x.seg]} (got ${num(x.S)}–${num(x.F)})`);
    // bağımsız Comp: yüklü → STT + L/UL + TrT, boş → STT + TrT
    const trt = (R.path.length - 1) * 2;
    ok(comp === (R.loaded ? stt + 2 + trt : stt + trt), `${tag}: independent Comp formula`);
    if (mach) ok(num(R.mStart) === mach[0] && num(R.mEnd) === mach[1], `${tag}: machine ${mach[0]}→${mach[1]} (got ${R.mStart && num(R.mStart)}→${R.mEnd && num(R.mEnd)})`);
    else ok(R.mEnd == null, `${tag}: empty trip has no machine`);

    // egzersiz (row select) adım cevapları
    const ex = D.generate(IM.rng(3), { notes: true, row: String(r.L) });
    ok(ex.data.L === r.L, `${tag}: row select`);
    const seq = ex.steps.find((s) => s.kind === 'sequence');
    ok(seq.sequence.answer.join(',') === R.path.join(','), `${tag}: sequence step`);
    ok(seq.viz.type === 'agvmap' && seq.viz.highlight.join(',') === R.path.join(','), `${tag}: agvmap highlight`);
    const n = ex.steps.filter((s) => s.kind === 'number');
    const vals = n.map((s) => s.fields.map((f) => num(f.answer)));
    ok(vals[0][0] === R.path.length, `${tag}: segment count step`);
    ok(vals[1][0] === trt, `${tag}: TrT step`);
    ok(vals[2][0] === ts && vals[2][1] === te, `${tag}: travel step`);
    const segStep = n[3];
    const sg = +segStep.fields[0].label.match(/Segment (\d+)/)[1];
    ok(vals[3][0] === segs[sg][0] && vals[3][1] === segs[sg][1], `${tag}: path-loading step seg ${sg}`);
    ok(vals[4][0] === comp, `${tag}: Comp step`);
    if (mach) ok(vals[5][0] === mach[0] && vals[5][1] === mach[1], `${tag}: machine step`);
    ok(ex.steps.length >= 5 && ex.steps[ex.steps.length - 1].kind === 'choice', `${tag}: ≥5 steps, ends with rule question`);
  }
  // seed'e göre (auto) tüm satırlar görünür
  const seen = new Set();
  for (let s = 1; s <= 200; s++) seen.add(D.generate(IM.rng(s), { notes: true, row: 'auto' }).data.L);
  ok(seen.size === 11, 'auto row covers all 11 rows: ' + [...seen].sort((a, b) => a - b));
}

console.log('— random mode: independent recompute');
{
  const segSet = new Set(), lulSet = new Set(), keys = new Set();
  for (let s = 1; s <= 400; s++) {
    const ex = D.generate(IM.rng(s * 17), {});
    const T = ex.data, tag = `seed ${s}`;
    segSet.add(T.seg); lulSet.add(T.lul); keys.add(T.key);
    ok([1, 2, 3].includes(T.seg) && [2, 4].includes(T.lul), `${tag}: seg/lul sets`);
    const path = D.PATHS[T.key].path, loaded = D.PATHS[T.key].loaded;
    const trt = (path.length - 1) * T.seg;
    const ts = loaded ? T.stt + T.lul / 2 : T.stt;
    const comp = loaded ? T.stt + T.lul + trt : T.stt + trt;
    const n = ex.steps.filter((x) => x.kind === 'number');
    const v = n.map((x) => x.fields.map((f) => num(f.answer)));
    ok(v[1][0] === trt && v[2][0] === ts && v[2][1] === ts + trt && v[4][0] === comp, `${tag}: TrT/travel/Comp`);
    // path-loading: bağımsız segment zamanları
    const sg = +n[3].fields[0].label.match(/Segment (\d+)/)[1];
    const k = path.indexOf(sg);
    let S = ts;
    for (let i = 0; i < k; i++) S += i === 0 ? T.seg / 2 : T.seg;
    const Fv = S + (k === 0 || k === path.length - 1 ? T.seg / 2 : T.seg);
    ok(v[3][0] === S && v[3][1] === Fv, `${tag}: seg ${sg} S/F`);
    if (loaded) {
      const st = Math.max(comp, T.mach.freeAt || 0);
      ok(v[5][0] === st && v[5][1] === st + T.mach.pt, `${tag}: machine start/finish`);
      ok({ a: 'M1', c: 'M2', e: 'M3' }[T.to] === T.mach.m, `${tag}: machine of input station`);
    } else ok(n.length === 5, `${tag}: empty trip has 5 number steps`);
    ok(n.every((x) => x.fields.every((f) => F(f.answer).isNice(2))), `${tag}: clean values`);
    const ch = ex.steps.filter((x) => x.kind === 'choice');
    ok(ch.length === 1 && ch[0].options.filter((o) => o.correct).length === 1, `${tag}: one rule question, one correct`);
  }
  ok(segSet.size === 3 && lulSet.size === 2 && keys.size === 8, `random covers seg {1,2,3}, L/UL {2,4}, 8 paths`);
  const a = JSON.stringify(D.generate(IM.rng(99), {}), rep), b = JSON.stringify(D.generate(IM.rng(99), {}), rep);
  ok(a === b, 'deterministic (random)');
  const c = JSON.stringify(D.generate(IM.rng(99), { notes: true }), rep), d = JSON.stringify(D.generate(IM.rng(99), { notes: true }), rep);
  ok(c === d, 'deterministic (notes)');
}

console.log(fails ? `${fails} FAIL, ${passes} pass` : `ALL OK (${passes} checks)`);
process.exit(fails ? 1 : 0);
