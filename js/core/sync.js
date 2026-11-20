/* Cihazlar arası ilerleme taşıma: kopyala/yapıştır kodu.
   Kod = 'IMS1-' + base64(JSON { v:1, p:<ims.progress.v1>, o:<ims.drillopts.v1> }).
   Yüklerken kayıtlar BİRLEŞTİRİLİR (değiştirilmez): her anahtar için daha çok soru/adım (t) içeren kayıt
   kalır, eşitse daha yeni olan. Böylece kod iki yönde tekrar tekrar taşınsa da sayılar ikiye katlanmaz. */
(function () {
  const IM = window.IM;
  const PREFIX = 'IMS1-';

  const isObj = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
  const isNum = (x) => typeof x === 'number' && isFinite(x) && x >= 0;
  const validEntry = (e) => isObj(e) && isNum(e.c) && isNum(e.t) && isNum(e.n) && e.c <= e.t;

  function encode(state) {
    const json = JSON.stringify({ v: 1, p: state.p || {}, o: state.o || {} });
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
    return { p, o };
  }

  // local, incoming: { p, o } -> { p, o, added, updated }
  function merge(local, incoming) {
    const p = Object.assign({}, local.p);
    let added = 0, updated = 0;
    Object.keys(incoming.p).forEach((k) => {
      const a = p[k], b = incoming.p[k];
      if (!validEntry(a)) { p[k] = b; added++; }
      else if (b.t > a.t || (b.t === a.t && (b.last || 0) > (a.last || 0))) { p[k] = b; updated++; }
    });
    const o = Object.assign({}, local.o, incoming.o);
    return { p, o, added, updated };
  }

  IM.sync = { encode, decode, merge, PREFIX };
})();
