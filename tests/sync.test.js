// Cihazlar arası ilerleme kodu: encode/decode gidiş-dönüş, doğrulama, birleştirme (idempotent, sayılar katlanmaz).
const assert = require('assert');
const load = require('./load');
const IM = load(['js/core/ns.js', 'js/core/sync.js']);
const S = IM.sync;
let checks = 0;
const ok = (cond, msg) => { assert.ok(cond, msg); checks++; };
const eq = (a, b, msg) => { assert.deepStrictEqual(JSON.parse(JSON.stringify(a)), JSON.parse(JSON.stringify(b)), msg); checks++; };

const phone = {
  p: {
    'concept:1.1': { c: 8, t: 10, n: 1, last: 1000 },
    'drill:kanban': { c: 12, t: 15, n: 3, last: 2000 },
  },
  o: { kanban: { mode: 'mix' } },
};
const laptop = {
  p: {
    'concept:1.1': { c: 15, t: 20, n: 2, last: 1500 },
    'drill:oee': { c: 4, t: 5, n: 1, last: 1800 },
  },
  o: { oee: { level: 2 } },
};

// gidiş-dönüş
const code = S.encode(phone);
ok(code.startsWith('IMS1-'), 'prefix');
ok(/^IMS1-[A-Za-z0-9+/=]+$/.test(code), 'yalnızca base64 karakterleri');
eq(S.decode(code), phone, 'round-trip');
eq(S.decode('  ' + code.slice(0, 20) + '\n' + code.slice(20) + '\n'), phone, 'boşluk/satır sonu tolere edilir');
eq(S.decode(code.slice(5)), phone, 'öneksiz de okunur');
ok(code.length < 4000, 'kod kısa: ' + code.length);

// Türkçe karakterli seçenekler bozulmaz
const tr = { p: {}, o: { x: { etiket: 'Çalışma ığüşöç' } } };
eq(S.decode(S.encode(tr)), tr, 'unicode');

// geçersiz kodlar
for (const bad of ['', '   ', 'IMS1-', 'merhaba', 'IMS1-@@@@', S.encode({ p: {} }).replace('IMS1-', 'IMS1-x'),
  'IMS1-' + Buffer.from(JSON.stringify({ topics: {} })).toString('base64'),   // başka uygulamanın kodu (ALM 202)
  'IMS1-' + Buffer.from(JSON.stringify({ v: 2, p: {} })).toString('base64'),
  'IMS1-' + Buffer.from('[1,2]').toString('base64')]) {
  assert.throws(() => S.decode(bad), Error, 'geçersiz: ' + JSON.stringify(bad)); checks++;
}

// bozuk kayıtlar ayıklanır
const dirty = 'IMS1-' + Buffer.from(JSON.stringify({ v: 1, p: {
  good: { c: 1, t: 2, n: 1 }, neg: { c: -1, t: 2, n: 1 }, over: { c: 3, t: 2, n: 1 }, str: { c: '1', t: 2, n: 1 }, nul: null,
}, o: { a: { k: 1 }, b: 5 } })).toString('base64');
eq(S.decode(dirty), { p: { good: { c: 1, t: 2, n: 1 } }, o: { a: { k: 1 } } }, 'geçersiz kayıtlar atılır');

// birleştirme: telefon -> laptop
const m1 = S.merge(laptop, S.decode(S.encode(phone)));
eq(m1.p['concept:1.1'], laptop.p['concept:1.1'], 'daha çok sorulu kayıt kalır (laptop t=20 > telefon t=10)');
eq(m1.p['drill:kanban'], phone.p['drill:kanban'], 'yalnız telefondaki kayıt eklenir');
eq(m1.p['drill:oee'], laptop.p['drill:oee'], 'yalnız laptoptaki kayıt korunur');
eq(m1.o, { oee: { level: 2 }, kanban: { mode: 'mix' } }, 'seçenekler birleşir');
ok(m1.added === 1 && m1.updated === 0, 'sayaçlar: ' + m1.added + '/' + m1.updated);

// laptop -> telefon, sonra tekrar tekrar: sonuç sabit (idempotent), sayılar katlanmaz
const m2 = S.merge(phone, S.decode(S.encode({ p: m1.p, o: m1.o })));
eq(m2.p, m1.p, 'iki yön sonrası iki cihaz aynı');
ok(m2.updated === 1 && m2.added === 1, 'telefonda 1 güncellenen + 1 yeni');
const m3 = S.merge({ p: m2.p, o: m2.o }, S.decode(S.encode({ p: m1.p, o: m1.o })));
eq(m3.p, m2.p, 'aynı kodu tekrar yüklemek değiştirmez');
ok(m3.added === 0 && m3.updated === 0, 'tekrar yüklemede değişiklik yok');
ok(m3.p['concept:1.1'].t === 20, 'sayılar ikiye katlanmadı');

// eşit t -> daha yeni olan
const a = { p: { k: { c: 1, t: 4, n: 1, last: 10 } }, o: {} };
const b = { p: { k: { c: 3, t: 4, n: 1, last: 20 } }, o: {} };
eq(S.merge(a, b).p.k, b.p.k, 'eşit t: yeni olan');
eq(S.merge(b, a).p.k, b.p.k, 'eşit t: eski olan ezmez');

// boş yerel durum
eq(S.merge({ p: {}, o: {} }, phone).p, phone.p, 'boş cihaza yükleme');

console.log(`sync OK (${checks} checks)`);
