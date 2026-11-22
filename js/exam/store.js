/* Sınav Hazırlık · kalıcı durum (localStorage)
   ims.exam.v1      = { cards: {cardId: {box,n,ok,last,due}}, attempts: [{at,mode,got,max,used,pt:{tid:[g,m]}}], read: {tid: ts} }
                      → cihazlar arası taşıma koduna 'x' olarak eklenir (js/core/sync.js birleştirir)
   ims.exam.cur.v1  = devam eden sınav oturumu (cevaplar dâhil; yalnızca bu cihaz)
   ims.exam.last.v1 = son bitirilen sınav (inceleme için; yalnızca bu cihaz) */
(function () {
  const IM = window.IM;
  const KEY = 'ims.exam.v1', CUR = 'ims.exam.cur.v1', LAST = 'ims.exam.last.v1';
  const MAX_ATTEMPTS = 30;
  const read = (k, d) => {
    try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; }
  };
  const write = (k, v) => {
    try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ }
  };
  const norm = (s) => ({ cards: (s && s.cards) || {}, attempts: (s && s.attempts) || [], read: (s && s.read) || {} });

  IM.examStore = {
    MAX_ATTEMPTS,
    get: () => norm(read(KEY, null)),
    save(s) {
      const n = norm(s);
      n.attempts = n.attempts.slice(-MAX_ATTEMPTS);
      write(KEY, n);
    },
    setCard(id, rec) { const s = this.get(); s.cards[id] = rec; this.save(s); },
    markRead(tid, on) { const s = this.get(); if (on) s.read[tid] = Date.now(); else delete s.read[tid]; this.save(s); },
    addAttempt(a) { const s = this.get(); s.attempts.push(a); this.save(s); },
    // zayıf konuların kartlarını hemen tekrar sırasına al
    dueNow(topicIds) {
      const s = this.get(), now = Date.now();
      IM.exam.cards.filter((c) => topicIds.includes(c.topic)).forEach((c) => { if (s.cards[c.id]) s.cards[c.id].due = Math.min(s.cards[c.id].due, now); });
      this.save(s);
    },
    reset() { write(KEY, null); write(CUR, null); write(LAST, null); },
    cur: () => read(CUR, null),
    saveCur: (x) => write(CUR, x),
    last: () => read(LAST, null),
    saveLast: (x) => write(LAST, x),
  };
})();
