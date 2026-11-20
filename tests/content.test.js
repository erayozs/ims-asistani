// Validates summaries / concept questions / cheatsheet for every topic.
// Usage: node tests/content.test.js   |   CH=2 node tests/content.test.js   |   CONTENT=ch1,ch2a node tests/content.test.js
// !! Yeni içerik dosyası eklenince aşağıdaki `files` listesini güncelle (yoksa dosya SESSİZCE atlanır).
const load = require('./load');
const fs = require('fs');
const files = ['ch1', 'ch2a', 'ch2b', 'ch3', 'ch4', 'ch5'];
const use = files.filter((f) => (!process.env.CONTENT || process.env.CONTENT.split(',').includes(f)) && fs.existsSync(__dirname + '/../js/content/' + f + '.js'));
const missingFiles = files.filter((f) => !fs.existsSync(__dirname + '/../js/content/' + f + '.js'));
const IM = load(['js/core/ns.js', 'js/content/cheatsheet.js'].concat(use.map((f) => 'js/content/' + f + '.js')));
const CH = process.env.CH ? process.env.CH.split(',').map(Number) : null;
let bad = 0;
const err = (m) => { bad++; console.log('✗', m); };
const warn = (m) => console.log('⚠', m);
const strip = (h) => String(h).replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
let total = 0;
// ekranda a/b kesir yasak (ondalık gösterim). "a / b" (boşluklu) bölme işlemi serbest; tarih/sayfa aralıkları hariç.
const FRAC_RE = /(?<![\w.\/])\d+\/\d+(?![\w.\/])/g;
for (const t of IM.topics.filter((t) => !CH || CH.includes(t.ch))) {
  const s = IM.content.summaries[t.id];
  const c = IM.content.concepts[t.id] || [];
  if (process.env.CONTENT && !s && !c.length) continue; // başka ajanın dosyası, yüklenmedi
  if (!process.env.CONTENT && !s && !c.length && missingFiles.length) { warn(`${t.id}: içerik yok (dosya henüz yok: ${missingFiles.join(',')})`); continue; }
  const len = strip(s || '').length;
  if (!s || len < 1500) err(`${t.id}: summary missing/short (${len} < 1500 chars)`);
  if (s && !/class="warnbox"/.test(s)) err(`${t.id}: summary has no .warnbox (Sınav tuzakları)`);
  if (s && !/class="model"/.test(s)) err(`${t.id}: summary has no .model (formül/model bloğu)`);
  if (s && !/<p class="note">Ders notu: [^<]*s\.\d/.test(s)) err(`${t.id}: summary has no <p class="note">Ders notu: … s.a–b</p>`);
  if (s) { const m = strip(s).match(FRAC_RE); if (m) err(`${t.id}: summary shows a/b fractions: ${m.slice(0, 4).join(' ')}`); }
  if (c.length < 10) err(`${t.id}: only ${c.length} concepts (≥10)`);
  c.forEach((q, i) => {
    const tag = `${t.id}#${i + 1}`;
    if (!q.q || !Array.isArray(q.options) || q.options.length < 2) return err(`${tag}: bad shape`);
    const ans = Array.isArray(q.answer) ? q.answer : [q.answer];
    if (!ans.length || ans.some((a) => !Number.isInteger(a) || a < 0 || a >= q.options.length)) err(`${tag}: answer out of range`);
    if (new Set(ans).size !== ans.length) err(`${tag}: duplicate answer idx`);
    const o = q.options.map(strip);
    if (new Set(o).size !== o.length) err(`${tag}: duplicate options`);
    if (!q.explain || strip(q.explain).length < 15) err(`${tag}: missing explain`);
    if (/hepsi|all of the above|none of the above|hiçbiri|yukarıdakilerin/i.test(o.join('|')) && !q.keepOrder) err(`${tag}: all/none option without keepOrder`);
    const fm = strip(q.q + ' ' + q.options.join(' ') + ' ' + q.explain).match(FRAC_RE);
    if (fm) err(`${tag}: a/b fraction shown: ${fm.slice(0, 3).join(' ')}`);
  });
  // aynı soru metni iki kez
  const qs = c.map((q) => strip(q.q));
  if (new Set(qs).size !== qs.length) err(`${t.id}: duplicate question text`);
  total += c.length;
  console.log(`${t.id.padEnd(6)} summary ${String(len).padStart(5)} chars · ${c.length} concepts`);
}
// Kapsam dışı konu kalıntısı (yalnızca uyarı; bağlama bakarak karar ver)
const blob = strip(JSON.stringify(IM.content));
const OOS = /\bG0[0-3]\b|G-code|G kodu|part program|parça programlama|line balancing|hat dengeleme|rank order|Hollier|Kilbridge|bottleneck model|robot cycle time|robot çevrim|Industry 4\.0|Endüstri 4\.0|\bMES\b|AS\/RS çevrim|single command|dual command/gi;
const hits = blob.match(OOS);
if (hits) warn(`kapsam dışı olabilecek terimler: ${[...new Set(hits)].join(', ')} — bağlamı kontrol et (yalnızca "kapsam dışı" notu olarak geçebilir).`);
if (!IM.content.cheatsheet || strip(IM.content.cheatsheet).length < 500) err('cheatsheet missing/short');
console.log(`total concepts: ${total}`);
console.log(bad ? `${bad} PROBLEMS` : 'content OK');
process.exit(bad ? 1 : 0);
