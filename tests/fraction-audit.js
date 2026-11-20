// Decimal-display audit. For every drill × option combo × seed it reports
//   frac  — "a/b" numeric fractions visible in the rendered exercise (must be 0 everywhere)
//   ans   — number-step answers that are not a clean decimal (≤ 2 places)
//   shown — Frac values rendered while building/rendering the exercise that are not clean (≤ 2 places)
// Random instances must be clean. Combos that load the notes' worked examples (opts.notes === true) keep the notes'
// own numbers (shown rounded) and are reported separately. EXEMPT drills may show non-clean float values (√, ln…).
// Usage: [FILES=kanban,oee] node tests/fraction-audit.js [drillId|all] [seeds]
const path = require('path');
const ROOT = path.join(__dirname, '..');
const load = require(path.join(ROOT, 'tests/load.js'));
const fs = require('fs');
const core = ['ns', 'rng', 'frac', 'viz', 'runner'].map((f) => `js/core/${f}.js`);
const all = fs.readdirSync(ROOT + '/js/drills').filter((f) => f.endsWith('.js')).sort();
const want = process.env.FILES ? process.env.FILES.split(',').map((x) => x.trim().replace(/\.js$/, '') + '.js') : null;
const drills = all.filter((f) => !want || want.includes(f)).map((f) => 'js/drills/' + f);
const IM = load(core.concat(drills));
const only = process.argv[2] || 'all';
const N = +(process.argv[3] || 10);
const EXEMPT = new Set([]);
const isNotes = (o) => o.notes === true;

// count every non-clean Frac that gets rendered
let shownBad = 0;
let shownSample = null;
const origFixed = IM.Frac.prototype.fixed;
IM.Frac.prototype.fixed = function (p) {
  if (!this.isNice(2)) { shownBad++; if (!shownSample) shownSample = this.exact(); }
  return origFixed.call(this, p);
};

function combos(options) {
  let out = [{}];
  for (const o of options || []) {
    const vals = o.type === 'checkbox' ? [true, false] : o.choices.map((c) => c.value);
    out = out.flatMap((c) => vals.map((v) => Object.assign({}, c, { [o.key]: v })));
  }
  return out;
}
// unspaced a/b = a displayed fraction ("a / b = c" with spaces is an explicit division step and is allowed)
const FRAC_RE = /(?<![\w.\/])-?\d+\/\d+(?![\w.\/])/g;
const strip = (h) => String(h || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
function texts(ex) {
  const out = [];
  const push = (where, h) => { if (h) out.push([where, strip(h)]); };
  push('statement', ex.statement);
  push('solution', ex.solution);
  const vr = (v, w) => { if (!v) return; try { push(w, IM.viz.render(v)); } catch (e) {} };
  vr(ex.viz, 'viz0');
  ex.steps.forEach((s, i) => {
    push(`s${i}.prompt`, s.prompt);
    push(`s${i}.hint`, s.hint);
    push(`s${i}.explain`, s.explain);
    (s.options || []).forEach((o, k) => push(`s${i}.opt${k}`, o.html));
    (s.fields || []).forEach((f, k) => push(`s${i}.label${k}`, f.label + ' = ' + IM.runner.fmt(f.answer)));
    vr(s.viz, `s${i}.viz`);
    vr(s.vizDuring, `s${i}.vizD`);
  });
  return out;
}
let failing = 0;
for (const d of Object.values(IM.drills)) {
  if (only !== 'all' && d.id !== only) continue;
  const st = { random: { n: 0, frac: 0, ans: 0, tot: 0, shown: 0 }, notes: { n: 0, frac: 0, ans: 0, tot: 0, shown: 0 } };
  const samples = new Map();
  for (const opts of combos(d.options)) for (let s = 1; s <= N; s++) {
    const g = st[isNotes(opts) ? 'notes' : 'random'];
    let ex;
    shownBad = 0;
    shownSample = null;
    try { ex = d.generate(IM.rng(s * 7919), opts); } catch (e) { continue; }
    const tx = texts(ex); // renders viz + answers -> counts shown values too
    g.n++;
    g.shown += shownBad;
    if (shownBad && !samples.has('shown')) samples.set('shown', `${shownSample} (${JSON.stringify(opts)} seed ${s})`);
    for (const [w, t] of tx) {
      const m = t.match(FRAC_RE);
      if (m) { g.frac += m.length; const key = 'frac ' + w.replace(/\d+/g, '#'); if (!samples.has(key)) samples.set(key, m.slice(0, 4).join(' ') + '  …' + t.slice(Math.max(0, t.search(FRAC_RE) - 40), t.search(FRAC_RE) + 30).replace(/\s+/g, ' ')); }
    }
    ex.steps.forEach((step) => (step.fields || []).forEach((f) => {
      let v; try { v = IM.F(f.answer); } catch (e) { return; }
      g.tot++;
      if (!v.isNice(2)) { g.ans++; const key = 'ans  ' + strip(f.label).slice(0, 30); if (samples.size < 12 && !samples.has(key)) samples.set(key, v.exact()); }
    }));
  }
  const r = st.random, n = st.notes;
  const bad = r.frac + n.frac + (EXEMPT.has(d.id) ? 0 : r.ans + r.shown);
  if (bad) failing++;
  console.log(`${bad ? '✗' : '✓'} ${d.id}: random ${r.n} ex · frac=${r.frac} ans=${r.ans}/${r.tot} shown=${r.shown}` +
    (n.n ? ` | notes ${n.n} ex · frac=${n.frac} ans=${n.ans}/${n.tot} shown=${n.shown}` : '') + (EXEMPT.has(d.id) ? ' (exempt)' : ''));
  if (bad) for (const [k, v] of samples) console.log('     ', k, '→', v);
}
console.log(failing ? `${failing} drill(s) with fractions / non-clean random values` : 'decimal display OK');
process.exit(failing ? 1 : 0);
