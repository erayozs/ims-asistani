// Çekirdek testleri: Frac + fixed/isNice, checkNum (yüzde, tolerans, tam sayı, ayırıcı), viz render, rng determinizmi.
const load = require('./load');
const IM = load(['js/core/ns.js', 'js/core/rng.js', 'js/core/frac.js', 'js/core/viz.js', 'js/core/runner.js']);
let fails = 0;
const eq = (a, b, m) => { if (String(a) !== String(b)) { fails++; console.log('FAIL', m, 'got', String(a), 'want', String(b)); } };
const F = IM.F;
// Frac aritmetiği + ondalık gösterim
eq(F('1/2').show(), '0.50', 'show 1/2 -> 0.50');
eq(F('165/4').show(), '41.25', 'show 41.25');
eq(F('9/8').show(), '1.125', 'exact 3-place keeps 3rd place');
eq(F('1/3').show(), '0.33', '1/3 -> 0.33');
eq(F('430').div('0.85').show(), '505.88', '430/0.85 = 505.88');
eq(F(-1).div(8).show(), '-0.125', 'negative 3-place');
eq(F('2/3').exact(), '2/3', 'exact()');
eq(F('0.87').mul('0.5').mul('0.98').show(), '0.43', 'OEE 0.4263 -> 0.43');
eq(F('0.4263').mul(100).fixed(1), '42.6', 'fixed(1)');
eq(F('41.25').isNice(2), true, 'isNice 41.25'); eq(F('1/3').isNice(2), false, 'isNice 1/3'); eq(F('1.125').isNice(2), false, 'isNice 1.125 (3 places)');
eq(F(7).ceil(), '7', 'ceil int'); eq(F('8.43').ceil(), '9', 'ceil 8.43');
eq(IM.util.pct('0.8696'), '86.96%', 'util.pct');
// parse
eq(IM.Frac.parse('3,75').exact(), '15/4', 'decimal comma');
eq(IM.Frac.parse('12,500').exact(), '12500', 'thousands by default');
eq(IM.Frac.parse('12,500', { thousands: false }).exact(), '25/2', 'thousands off -> 12.5');
eq(IM.Frac.parse('12.5%').exact(), '1/8', 'percent in ratio field');
// checkNum: tolerans 0.006 + 0.001|c|
eq(IM.checkNum('8.43', '8.4313').ok, true, '8.43 ~ 8.4313');
eq(IM.checkNum('8.40', '8.4313').ok, false, '8.40 !~ 8.4313 (tol 0.014)');
eq(IM.checkNum('505.88', F(430).div('0.85')).ok, true, '505.88');
eq(IM.checkNum('505', F(430).div('0.85')).ok, false, '505 !~ 505.88 (relative ‰1 = 0.51)');
eq(IM.checkNum('0.06', '0.0593').ok, true, '0.06 ~ 0.0593 (abs 0.006)');
// tam sayı: yalnızca birebir
eq(IM.checkNum('9', 9).ok, true, 'int exact'); eq(IM.checkNum('8.9', 9).ok, false, 'int not approx'); eq(IM.checkNum('12,500', 12500).ok, true, 'thousands for int answer');
eq(IM.checkNum('12,5', '12.5').ok, true, 'decimal comma 12,5'); eq(IM.checkNum('12,500', '12.5').ok, true, '12,500 = 12.5 when answer is not int');
eq(IM.checkNum('abc', 1).parsed, false, 'unparsable');
// yüzde alanları
eq(IM.checkNum('86.96', '86.96', null, '%').ok, true, 'pct plain');
eq(IM.checkNum('86.96%', '86.96', null, '%').ok, true, 'pct with sign');
eq(IM.checkNum('86.8', '86.96', null, '%').ok, false, 'pct 86.8 !~ 86.96 (tol 0.093)');
eq(IM.checkNum('0.8696', '86.96', null, '%').ok, false, 'pct ratio typed -> not ok');
eq(!!IM.checkNum('0.8696', '86.96', null, '%').warn, true, 'pct ratio typed -> warn');
eq(IM.checkNum('42.6', '42.63', null, '%').ok, true, 'pct 42.6 ~ 42.63');
// rng determinizm
const a = IM.rng(42), b = IM.rng(42); eq(a.int(1, 1e6), b.int(1, 1e6), 'rng determinism');
// viz
const specs = [
  { type: 'bars', labels: ['0', '1', '2'], values: [0.2, 0.5, 0.3], highlight: [1], ref: [{ v: 0.4, label: 'takt' }] },
  { type: 'tree', nodes: [{ id: 0, parent: null, label: 'Başla' }, { id: 1, parent: 0, label: 'D', edge: '0.3' }, { id: 2, parent: 0, label: 'Dᶜ', edge: '0.7', hl: true, leaf: '0.7' }] },
  { type: 'tree', dir: 'down', nodes: [{ id: 0, parent: null, label: 'A', leaf: 'LT 1' }, { id: 1, parent: 0, label: 'B', edge: '×2' }, { id: 2, parent: 0, label: 'C', edge: '×3', hl: true }, { id: 3, parent: 1, label: 'D', edge: '×1' }] },
  { type: 'matrix', rowLabels: ['a', 'b'], colLabels: ['x', 'y'], cells: [['1', '2'], ['3', '4']], cls: [['hl', ''], ['', 'sel']] },
  { type: 'stack', unit: 'min', rows: [{ label: 'Trad.', segs: [{ v: 30, label: 'Tsu' }, { v: 50, label: 'Q·To' }, { v: 120, label: 'Tno' }] }, { label: 'FMS', segs: [{ v: 10 }, { v: 40 }, { v: 30, cls: 'hl' }] }], legend: [{ cls: 's1', label: 'Tsu' }] },
  { type: 'flow', items: [{ kind: 'ext', title: 'Supplier' }, { kind: 'inv', label: '5 d' }, { kind: 'proc', title: 'Press', lines: ['C/T=1 s', 'C/O=1 h'] }, { kind: 'inv', label: '7000', hl: true }, { kind: 'proc', title: 'Weld', lines: ['C/T=39 s'] }], timeline: { inv: ['5 d', '7.6 d'], proc: ['1 s', '39 s'], lt: '12.6 d', va: '40 s' } },
  { type: 'agvmap', highlight: [9, 11, 8, 1], from: 'a', to: 'A' },
  { type: 'html', html: '<b>x</b>' },
];
specs.forEach((s, i) => { try { const h = IM.viz.render(s); if (!h || h.length < 20) throw new Error('empty'); } catch (e) { fails++; console.log('FAIL viz', i, s.type, e.message); } });
// runner fmt ondalık
eq(IM.runner.fmt(F('1/4')), '0.25', 'runner.fmt decimal');
console.log(fails ? fails + ' FAILURES' : 'ALL OK');
process.exit(fails ? 1 : 0);
