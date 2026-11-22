// Sınav Hazırlık: içerik şekli, rubrik ↔ örnek cevap tutarlılığı, ezber kartı kendi kendini tanıma,
// sayısal soru üreticileri, sınav kâğıdı oluşturma, puanlama ve Leitner mantığı.
// Usage: node tests/exam.test.js
const assert = require('assert');
const load = require('./load');
const IM = load([
  'js/core/ns.js', 'js/core/rng.js', 'js/core/frac.js', 'js/core/viz.js', 'js/core/runner.js',
  'js/drills/agv-count.js', 'js/drills/oee.js', 'js/drills/kanban.js',
  'js/exam/lessons.js', 'js/exam/bank.js', 'js/exam/engine.js',
]);
const E = IM.exam;
let bad = 0, checks = 0;
const err = (m) => { bad++; console.log('✗', m); };
const ok = (c, m) => { checks++; if (!c) err(m); };
const strip = (h) => String(h).replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
const FRAC_RE = /(?<![\w.\/])\d+\/\d+(?![\w.\/])/g;

// ---------------------------------------------------------------- konular
ok(E.topics.length === 17, `17 konu olmalı (${E.topics.length})`);
ok(new Set(E.topics.map((t) => t.id)).size === 17, 'konu id tekrarı');
E.topics.forEach((t, i) => {
  ok(t.n === i + 1, `${t.id}: n sırası`);
  ['title', 'tr', 'lesson', 'memo', 'answer', 'traps'].forEach((k) => ok(t[k] && strip(t[k]).length > 10, `${t.id}: ${k} boş`));
  ok(strip(t.lesson).length >= 700, `${t.id}: anlatım kısa (${strip(t.lesson).length})`);
  ok(IM.topicById(t.link), `${t.id}: link konusu yok (${t.link})`);
  const blob = strip(t.lesson + ' ' + t.memo + ' ' + t.answer + ' ' + t.traps);
  const m = blob.match(FRAC_RE);
  ok(!m, `${t.id}: a/b kesir: ${m && m.slice(0, 3)}`);
});

// ---------------------------------------------------------------- regexler derlenir
const allRe = [];
E.cards.forEach((c) => c.items.forEach((it) => it[1] && allRe.push([c.id, it[1]])));
E.questions.forEach((q) => (q.rubric || []).forEach((r) => allRe.push([q.id, r[2]])));
allRe.forEach(([id, re]) => { try { new RegExp(re, 'i'); checks++; } catch (e) { err(`${id}: regex derlenmiyor: ${re}`); } });

// ---------------------------------------------------------------- kartlar
ok(new Set(E.cards.map((c) => c.id)).size === E.cards.length, 'kart id tekrarı');
E.topics.forEach((t) => ok(E.cards.some((c) => c.topic === t.id), `${t.id}: ezber kartı yok`));
E.cards.forEach((c) => {
  ok(E.topicById(c.topic), `${c.id}: konu yok`);
  ok(c.items.length >= 2, `${c.id}: en az 2 öge`);
  // her öge kendi görünen metniyle tespit edilmeli
  c.items.forEach((it) => { if (it[1]) ok(E.detect(it[0], it[1]), `${c.id}: öge kendini tanımıyor: "${it[0]}" ~ /${it[1]}/`); });
  // sıralı kartta doğru sıradaki metin → sıra doğru
  if (c.ordered && c.items.every((it) => it[1])) {
    const r = E.checkCard(c, c.items.map((it) => it[0]).join('\n'));
    ok(r.found.every(Boolean), `${c.id}: doğru metinde eksik öge`);
    ok(r.orderOk === true, `${c.id}: doğru sırada yazılmış metin sıra hatası veriyor`);
  }
  ok(!strip(c.prompt + ' ' + c.items.map((x) => x[0]).join(' ')).match(FRAC_RE), `${c.id}: a/b kesir`);
});

// ---------------------------------------------------------------- sorular
ok(new Set(E.questions.map((q) => q.id)).size === E.questions.length, 'soru id tekrarı');
E.topics.forEach((t) => {
  const n = E.questions.filter((q) => q.topic === t.id).length;
  ok(n >= 2, `${t.id}: en az 2 soru (${n})`);
});
const TYPES = ['open', 'order', 'match', 'classify', 'mcq', 'calc'];
let openFull = 0, openTotal = 0;
E.questions.forEach((q) => {
  ok(TYPES.includes(q.type), `${q.id}: tip`);
  ok(E.topicById(q.topic), `${q.id}: konu`);
  ok(q.pts > 0 && q.q, `${q.id}: pts/q`);
  ok(!strip(q.q).match(FRAC_RE), `${q.id}: soru metninde a/b kesir`);
  if (q.type === 'open') {
    ok(q.rubric.length >= 3, `${q.id}: rubrik kısa`);
    const model = q.model || E.topicById(q.topic).answer;
    const ticks = E.suggestTicks(q, strip(model));
    const g = E.gradeOpen(q, ticks);
    openTotal++;
    const miss = q.rubric.filter((r, i) => !ticks[i]).map((r) => r[1]);
    if (g.got / g.max >= 0.999) openFull++; else console.log(`  · ${q.id}: ${g.got}/${g.max} — eksik: ${miss.join(' | ')}`);
    ok(g.got / g.max >= 0.85, `${q.id}: örnek cevap ${g.got}/${g.max} alıyor; eksik: ${miss.join(' | ')}`);
    // boş ve alakasız cevap 0 almalı
    ok(E.gradeOpen(q, E.suggestTicks(q, '')).got === 0, `${q.id}: boş cevap puan alıyor`);
    const junk = E.gradeOpen(q, E.suggestTicks(q, 'Lorem ipsum dolor sit amet, I do not know this topic.'));
    ok(junk.got <= 0.15 * q.pts, `${q.id}: alakasız cevap ${junk.got} puan alıyor`);
    if (q.cap) ok(q.cap <= E.rubricMax(q), `${q.id}: cap > rubrik toplamı`);
  }
  if (q.type === 'order') {
    ok(q.items.length >= 3 && new Set(q.items).size === q.items.length, `${q.id}: order ögeleri`);
    ok(E.gradeOrder(q, q.items.map((_, i) => i)).got === q.pts, `${q.id}: doğru sıra tam puan değil`);
    ok(E.gradeOrder(q, []).got === 0, `${q.id}: boş sıra puan alıyor`);
  }
  if (q.type === 'match') {
    ok(q.pairs.length >= 3, `${q.id}: match çifti az`);
    ok(new Set(q.pairs.map((p) => p[1])).size === q.pairs.length, `${q.id}: sağ taraf tekrarı`);
    ok(new Set(q.pairs.map((p) => p[0])).size === q.pairs.length, `${q.id}: sol taraf tekrarı`);
    ok(E.gradeMatch(q, q.pairs.map((_, i) => i)).got === q.pts, `${q.id}: doğru eşleşme tam puan değil`);
  }
  if (q.type === 'classify') {
    ok(q.cats.length >= 2 && q.items.every((it) => it[1] >= 0 && it[1] < q.cats.length), `${q.id}: kategori indeksi`);
    q.cats.forEach((c, k) => ok(q.items.some((it) => it[1] === k), `${q.id}: boş kategori ${c}`));
    ok(E.gradeClassify(q, q.items.map((it) => it[1])).got === q.pts, `${q.id}: doğru sınıflandırma tam puan değil`);
  }
  if (q.type === 'mcq') {
    const ans = Array.isArray(q.answer) ? q.answer : [q.answer];
    ok(ans.every((a) => a >= 0 && a < q.options.length), `${q.id}: answer aralığı`);
    ok(new Set(q.options).size === q.options.length, `${q.id}: seçenek tekrarı`);
    ok(E.gradeMcq(q, ans).got === q.pts, `${q.id}: doğru seçim tam puan değil`);
    if (Array.isArray(q.answer)) {
      const all = q.options.map((_, i) => i);
      ok(E.gradeMcq(q, all).got < q.pts, `${q.id}: hepsini seçmek tam puan alıyor`);
    }
  }
});
console.log(`örnek cevaplar: ${openFull}/${openTotal} açık uçlu soruda tam puan`);

// ---------------------------------------------------------------- sayısal üreticiler
['agv', 'oee', 'kanban'].forEach((gen) => {
  let t0 = Date.now();
  for (let s = 1; s <= 120; s++) {
    let inst;
    try { inst = E.calc(gen, IM.rng(s)); } catch (e) { err(`${gen} seed ${s}: ${e.message}`); continue; }
    ok(inst.fields.length >= 4, `${gen}: alan sayısı`);
    ok(inst.fields.every((f) => Number.isFinite(f.ans) && f.w > 0), `${gen} seed ${s}: alan cevabı`);
    const q = E.questions.find((x) => x.type === 'calc' && x.gen === gen);
    const right = inst.fields.map((f) => String(f.ans));
    ok(E.gradeCalc(q, inst, right).got === q.pts, `${gen} seed ${s}: doğru cevaplar tam puan değil`);
    ok(E.gradeCalc(q, inst, []).got === 0, `${gen} seed ${s}: boş cevap puan alıyor`);
    // 2 ondalığa yuvarlanmış cevaplar da kabul
    const r2 = inst.fields.map((f) => f.ans.toFixed(2));
    ok(E.gradeCalc(q, inst, r2).got === q.pts, `${gen} seed ${s}: 2 ondalık yuvarlanmış cevap reddedildi`);
    const m = strip(inst.statement + inst.solution).match(FRAC_RE);
    ok(!m, `${gen} seed ${s}: a/b kesir ${m && m[0]}`);
    // determinizm
    ok(JSON.stringify(E.calc(gen, IM.rng(s)).fields) === JSON.stringify(inst.fields), `${gen}: seed deterministik değil`);
  }
  console.log(`${gen}: 120 seed OK (${Date.now() - t0} ms)`);
});
// AGV: tam sayı alanı yalnızca tam eşleşme; ondalık araç sayısını tam sayı alanına yazmak yanlış
{
  const inst = E.calc('agv', IM.rng(7));
  const fN = inst.fields[inst.fields.length - 1], fV = inst.fields[inst.fields.length - 2];
  ok(Number.isInteger(fN.ans) && fN.ans === Math.ceil(fV.ans), 'agv: N = ⌈araç sayısı⌉');
  ok(!E.checkField(fN, String(Math.floor(fV.ans))), 'agv: aşağı yuvarlanmış N kabul edildi');
}
// OEE: yüzde alanı 0.87 gibi oran girişini kabul etmez
{
  const inst = E.calc('oee', IM.rng(3));
  const fA = inst.fields[2];
  ok(!E.checkField(fA, String(fA.ans / 100)), 'oee: oran girişi yüzde alanında kabul edildi');
  ok(E.checkField(fA, fA.ans.toFixed(2) + '%'), 'oee: "%" son ekli giriş reddedildi');
}

// ---------------------------------------------------------------- sınav kâğıdı
{
  const rng = IM.rng(42);
  const full = E.buildExam('full', {}, rng);
  ok(full.items.length === 17, 'tam sınav 17 soru');
  ok(new Set(full.items.map((it) => it.topic)).size === 17, 'tam sınav her konudan 1');
  ok(full.minutes === 100, 'tam sınav 100 dk');
  ok(full.items.some((it) => it.qid === 'agv-calc') && full.items.some((it) => it.qid === 'oee-calc'), 'tam sınavda AGV ve OEE hesap sorusu');
  // farklı seed'lerde tam sınav farklı sorular seçer (çeşitlilik)
  const sigs = new Set(); for (let s = 1; s <= 20; s++) sigs.add(E.buildExam('full', {}, IM.rng(s)).items.map((it) => it.qid).join(','));
  ok(sigs.size >= 15, 'tam sınav çeşitliliği: ' + sigs.size);
  const quick = E.buildExam('quick', {}, IM.rng(5));
  ok(quick.items.length === 6, 'hızlı deneme 6 soru');
  const sc = {}; E.topics.forEach((t, i) => (sc[t.id] = i / 20)); delete sc.oee; delete sc.a3;
  const weak = E.buildExam('weak', { topicScores: sc }, IM.rng(9));
  const wt = weak.items.map((it) => it.topic);
  ok(wt.includes('oee') && wt.includes('a3') && wt.includes('agv'), `zayıf mod denenmemiş + en düşük konuları seçmeli: ${wt}`);
  const cus = E.buildExam('custom', { topics: ['5s', 'smed'] }, IM.rng(1));
  ok(cus.items.length === 2 && cus.minutes === 12, 'özel mod');
  assert.throws(() => E.buildExam('custom', { topics: [] }, IM.rng(1)));
  checks++;
  // avoid: aynı konuda farklı soru seçilir (havuz yetiyorsa)
  const a = E.pickQuestion('5s', IM.rng(3), []);
  const b = E.pickQuestion('5s', IM.rng(3), [a.id]);
  ok(a.id !== b.id, 'avoid listesi işe yaramıyor');
  // full exam: gradeItem + summarize
  const grades = full.items.map((it) => E.gradeItem(it, null, null));
  const sum = E.summarize(full, grades);
  ok(sum.got === 0 && Math.abs(sum.max - full.rawMax) < 1e-9, 'boş kâğıt 0 puan');
  ok(Object.keys(sum.perTopic).length === 17, 'konu bazında özet');
}

// ---------------------------------------------------------------- puanlama ayrıntıları
{
  const q = { pts: 10, items: ['a', 'b', 'c', 'd', 'e'] };
  ok(E.gradeOrder(q, [1, 2, 3, 4, 0]).got === 8, 'order: bir kaydırma LCS 4/5');
  const m = { pts: 4, answer: [0, 1] , options: ['a', 'b', 'c', 'd'] };
  ok(E.gradeMcq(m, [0]).got === 2, 'mcq çoklu: yarım');
  ok(E.gradeMcq(m, [0, 2]).got === 0, 'mcq çoklu: doğru − yanlış');
  ok(E.gradeMcq({ pts: 3, answer: 1, options: ['x', 'y'] }, [1]).got === 3, 'mcq tek');
  ok(E.fold('Şalter IŞIK Çalışır ÜÖĞ') === 'salter isik calisir uog', 'fold Türkçe: ' + E.fold('Şalter IŞIK Çalışır ÜÖĞ'));
  ok(E.detect('Aşırı üretim', 'asiri uretim'), 'detect Türkçe');
}

// ---------------------------------------------------------------- Leitner
{
  let r = E.leitner(null, 2, 1000);
  ok(r.box === 2 && r.due === 1000 + E.BOX_MS[2], 'leitner: ilk tam → kutu 2');
  r = E.leitner(r, 2, 2000); ok(r.box === 3, 'leitner: kutu 3');
  r = E.leitner(r, 1, 3000); ok(r.box === 2, 'leitner: kısmen → en çok kutu 2');
  r = E.leitner(r, 0, 4000); ok(r.box === 1 && r.due === 4000, 'leitner: bilemedim → kutu 1, hemen');
  ok(r.n === 4 && r.ok === 2, 'leitner sayaçları');
  const cards = E.cards.slice(0, 3);
  const recs = { [cards[0].id]: { box: 3, due: 5000 }, [cards[1].id]: { box: 1, due: 100 } };
  ok(E.nextCard(cards, recs, 1000).id === cards[1].id, 'nextCard: vadesi gelen önce');
  ok(E.nextCard(cards, { [cards[0].id]: { box: 3, due: 9e9 }, [cards[1].id]: { box: 2, due: 9e9 }, [cards[2].id]: { box: 2, due: 9e9 } }, 1000) === null, 'nextCard: hepsi güncel → null');
  ok(E.nextCard(cards, recs, 1000, { skip: cards[1].id }).id === cards[2].id, 'nextCard: skip + görülmemiş');
  const ms = E.mastery({ cards: {}, attempts: [{ perTopic: { agv: [7, 14] } }], read: { agv: 1 } });
  ok(ms.agv.exam === 50 && ms.agv.read && ms.agv.memo === 0 && ms.oee.exam === null, 'mastery');
}

console.log(`${checks} checks`);
console.log(bad ? `${bad} PROBLEMS` : 'exam OK');
process.exit(bad ? 1 : 0);
