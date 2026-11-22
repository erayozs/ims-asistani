/* Cihazlar arası ilerleme taşıma: kopyala/yapıştır kodu.
   Kod = 'IMS1-' + base64(JSON { v:1, p:<ims.progress.v1>, o:<ims.drillopts.v1>, x?:<ims.exam.v1> }).
   Yüklerken kayıtlar BİRLEŞTİRİLİR (değiştirilmez): her anahtar için daha çok soru/adım (t) içeren kayıt
   kalır, eşitse daha yeni olan. Böylece kod iki yönde tekrar tekrar taşınsa da sayılar ikiye katlanmaz.
   x (Sınav Hazırlık): ezber kartı başına daha çok tekrar (n) içeren kayıt kalır (eşitse daha yeni);
   sınav denemeleri 'at' zaman damgasına göre birleşir (tekrarsız, en yeni 30); okundu işaretleri birleşir. */
(function () {
  const IM = window.IM;
  const PREFIX = 'IMS1-';
  const MAX_ATTEMPTS = 30;

  const isObj = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
  const isNum = (x) => typeof x === 'number' && isFinite(x) && x >= 0;
  const validEntry = (e) => isObj(e) && isNum(e.c) && isNum(e.t) && isNum(e.n) && e.c <= e.t;
  const validCard = (r) => isObj(r) && Number.isInteger(r.box) && r.box >= 0 && r.box <= 5 && isNum(r.n) && isNum(r.ok) && isNum(r.last) && isNum(r.due);
  const validPair = (p) => Array.isArray(p) && p.length === 2 && isNum(p[0]) && isNum(p[1]) && p[0] <= p[1] + 1e-9;
  const validAttempt = (a) => isObj(a) && isNum(a.at) && typeof a.mode === 'string' && isNum(a.got) && isNum(a.max) && isObj(a.pt) && Object.values(a.pt).every(validPair);

  function cleanX(x) {
    if (!isObj(x)) return null;
    const out = { cards: {}, attempts: [], read: {} };
    if (isObj(x.cards)) Object.keys(x.cards).forEach((k) => { const r = x.cards[k]; if (validCard(r)) out.cards[k] = { box: r.box, n: r.n, ok: r.ok, last: r.last, due: r.due }; });
    if (Array.isArray(x.attempts))
      x.attempts.forEach((a) => {
        if (!validAttempt(a)) return;
        const pt = {};
        Object.keys(a.pt).forEach((k) => (pt[k] = [a.pt[k][0], a.pt[k][1]]));
        out.attempts.push({ at: a.at, mode: a.mode, got: a.got, max: a.max, ...(isNum(a.used) ? { used: a.used } : {}), pt });
      });
    if (isObj(x.read)) Object.keys(x.read).forEach((k) => { if (isNum(x.read[k])) out.read[k] = x.read[k]; });
    return out;
  }

  function encode(state) {
    const data = { v: 1, p: state.p || {}, o: state.o || {} };
    const x = cleanX(state.x);
    if (x && (Object.keys(x.cards).length || x.attempts.length || Object.keys(x.read).length)) data.x = x;
    const json = JSON.stringify(data);
    return PREFIX + btoa(unescape(encodeURIComponent(json)));
  }

  function decode(code) {
    let s = String(code || '').replace(/\s+/g, '');
    if (s.startsWith(PREFIX)) s = s.slice(PREFIX.length);
    if (!s) throw new Error('Kod boş');
    let data;
    try {
      data = JSON.parse(decodeURIComponent(escape(atob(s))));
    } catch (e) {
      throw new Error('Kod okunamadı');
    }
    if (!isObj(data) || data.v !== 1 || !isObj(data.p)) throw new Error('Bu bir IMS Asistanı kodu değil');
    const p = {};
    Object.keys(data.p).forEach((k) => {
      const e = data.p[k];
      if (validEntry(e)) p[k] = { c: e.c, t: e.t, n: e.n, ...(isNum(e.last) ? { last: e.last } : {}) };
    });
    const o = {};
    if (isObj(data.o)) Object.keys(data.o).forEach((k) => { if (isObj(data.o[k])) o[k] = data.o[k]; });
    const out = { p, o };
    const x = cleanX(data.x);
    if (x) out.x = x;
    return out;
  }

  // local, incoming: { p, o, x? } -> { p, o, x?, added, updated }
  function merge(local, incoming) {
    const p = Object.assign({}, local.p);
    let added = 0, updated = 0;
    Object.keys(incoming.p).forEach((k) => {
      const a = p[k], b = incoming.p[k];
      if (!validEntry(a)) { p[k] = b; added++; }
      else if (b.t > a.t || (b.t === a.t && (b.last || 0) > (a.last || 0))) { p[k] = b; updated++; }
    });
    const o = Object.assign({}, local.o, incoming.o);
    const out = { p, o, added, updated };
    const lx = cleanX(local.x), ix = cleanX(incoming.x);
    if (lx || ix) {
      const x = lx || { cards: {}, attempts: [], read: {} };
      if (ix) {
        Object.keys(ix.cards).forEach((k) => {
          const a = x.cards[k], b = ix.cards[k];
          if (!a) { x.cards[k] = b; out.added++; }
          else if (b.n > a.n || (b.n === a.n && b.last > a.last)) { x.cards[k] = b; out.updated++; }
        });
        const seen = new Set(x.attempts.map((a) => a.at));
        ix.attempts.forEach((a) => { if (!seen.has(a.at)) { x.attempts.push(a); seen.add(a.at); out.added++; } });
        Object.keys(ix.read).forEach((k) => { if (!x.read[k]) out.added++; x.read[k] = Math.max(x.read[k] || 0, ix.read[k]); });
      }
      x.attempts.sort((a, b) => a.at - b.at);
      x.attempts = x.attempts.slice(-MAX_ATTEMPTS);
      out.x = x;
    }
    return out;
  }

  IM.sync = { encode, decode, merge, PREFIX };
})();
