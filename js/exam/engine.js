/* Sınav Hazırlık · saf mantık (DOM yok; node testleri bunu yükler)
   - fold / detect: açık uçlu cevaplarda anahtar kavram tespiti (öneri; kullanıcı onaylar)
   - grade*: soru tipi başına puanlama
   - calc(gen, rng): sayısal soru örneği (mevcut drill üreticileri: agv-count, oee, kanban)
   - buildExam(mode, opts, rng): sınav kâğıdı oluşturma
   - Leitner: ezber kartı kutu/aralık mantığı */
(function () {
  const IM = window.IM;
  const E = (IM.exam = IM.exam || {});

  // ------------------------------------------------------------------ metin
  const TR = { ç: 'c', ğ: 'g', ı: 'i', i̇: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u' };
  E.fold = function (s) {
    return String(s || '')
      .toLowerCase()
      .replace(/i̇/g, 'i')
      .replace(/[çğıöşüâîû]/g, (c) => TR[c] || c)
      .replace(/[’'`´]/g, '')
      .replace(/[^a-z0-9%*+=<>]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };
  const reCache = {};
  E.detect = function (text, re) {
    if (!re) return false;
    if (!reCache[re]) reCache[re] = new RegExp(re, 'i');
    return reCache[re].test(' ' + E.fold(text) + ' ');
  };
  // ilk eşleşmenin konumu (sıralı listelerde sıra kontrolü için); yoksa -1
  E.detectAt = function (text, re) {
    if (!re) return -1;
    if (!reCache[re]) reCache[re] = new RegExp(re, 'i');
    const m = reCache[re].exec(' ' + E.fold(text) + ' ');
    return m ? m.index : -1;
  };

  // en uzun ortak alt dizi uzunluğu
  E.lcs = function (a, b) {
    const n = a.length, m = b.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = 1; i <= n; i++)
      for (let j = 1; j <= m; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    return dp[n][m];
  };

  const round2 = (x) => Math.round(x * 100) / 100;

  // ------------------------------------------------------------------ puanlama
  // Her grader → { got, max } (got 0..max, 0.01 hassasiyet)
  E.rubricMax = (q) => q.rubric.reduce((s, r) => s + r[0], 0);
  // açık uçlu: ticks = ölçüt başına boolean (kullanıcı onaylı)
  E.gradeOpen = function (q, ticks) {
    const raw = q.rubric.reduce((s, r, i) => s + (ticks[i] ? r[0] : 0), 0);
    const rmax = E.rubricMax(q);
    const cap = q.cap || rmax;
    return { got: round2((Math.min(raw, cap) / cap) * q.pts), max: q.pts, raw, cap };
  };
  E.suggestTicks = (q, text) => q.rubric.map((r) => E.detect(text, r[2]));

  // sıralama: seq = kullanıcının sırası (doğru indekslerin listesi)
  E.gradeOrder = function (q, seq) {
    const n = q.items.length;
    const s = (seq || []).filter((x) => Number.isInteger(x));
    const l = E.lcs(s, q.items.map((_, i) => i));
    return { got: round2((l / n) * q.pts), max: q.pts, lcs: l, n };
  };
  // eşleştirme: ans[i] = seçilen sağ metnin indeksi (pairs içindeki), doğru = i
  E.gradeMatch = function (q, ans) {
    const n = q.pairs.length;
    const ok = q.pairs.map((_, i) => (ans || [])[i] === i);
    return { got: round2((ok.filter(Boolean).length / n) * q.pts), max: q.pts, ok };
  };
  E.gradeClassify = function (q, ans) {
    const n = q.items.length;
    const ok = q.items.map((it, i) => (ans || [])[i] === it[1]);
    return { got: round2((ok.filter(Boolean).length / n) * q.pts), max: q.pts, ok };
  };
  // mcq: tek doğru → 0/1; çoklu → (doğru seçim − yanlış seçim) / doğru sayısı, alt sınır 0
  E.gradeMcq = function (q, sel) {
    const S = new Set(sel || []);
    if (!Array.isArray(q.answer)) return { got: S.size === 1 && S.has(q.answer) ? q.pts : 0, max: q.pts };
    const A = new Set(q.answer);
    let good = 0, bad = 0;
    S.forEach((i) => (A.has(i) ? good++ : bad++));
    return { got: round2((Math.max(0, good - bad) / A.size) * q.pts), max: q.pts, good, bad };
  };
  // sayısal: inst.fields[{w, ans, tol, unit}], vals = kullanıcı metinleri
  E.checkField = function (f, v) {
    if (v == null || String(v).trim() === '') return false;
    const r = IM.checkNum(v, f.ans, f.tol, f.unit);
    return !!r.ok;
  };
  E.gradeCalc = function (q, inst, vals) {
    const W = inst.fields.reduce((s, f) => s + f.w, 0);
    const ok = inst.fields.map((f, i) => E.checkField(f, (vals || [])[i]));
    const g = inst.fields.reduce((s, f, i) => s + (ok[i] ? f.w : 0), 0);
    return { got: round2((g / W) * q.pts), max: q.pts, ok };
  };

  // ------------------------------------------------------------------ sayısal sorular
  const F = (x) => IM.F(x);
  const sh = (x) => F(x).show();
  const num = (x) => F(x).toNumber();
  const pc = (r) => F(r).mul(100).show();

  const CALC = {
    agv(rng) {
      const D = IM.drills['agv-count'];
      const P = D.gen(rng);
      const R = D.solve(P);
      const rows = P.cells.map((c, i) => `<tr><td>${i + 1}</td><td>${c.d}</td><td>${c.f}</td><td>${c.t}</td></tr>`).join('');
      const statement = `
<p>Materials are delivered by AGVs from a central warehouse to the cells of a cellular layout. The AGV speed is <b>${P.v} m/min</b> and the traffic congestion factor is <b>${sh(P.c)}</b>.
Each trip is a round trip; the loading/unloading time is given per operation (loading at the warehouse and unloading at the cell).</p>
<table><tr><th>Cell</th><th>Distance from warehouse (m)</th><th>Trips per hour</th><th>Loading/unloading (min)</th></tr>${rows}</table>
<p>Find the hourly AGV usage of each cell, the total load and the required number of AGVs.</p>`;
      const fields = P.cells.map((c, i) => ({ label: `Cell ${i + 1} hourly usage (min)`, ans: num(R.use[i]), w: 1 }));
      fields.push({ label: 'Total vehicle use time (min/h)', ans: num(R.total), w: 1 });
      fields.push({ label: `Total load = total / ${sh(P.c)} (min)`, ans: num(R.load), w: 2, tol: 0.6 });
      fields.push({ label: 'Number of vehicles (decimal, before rounding)', ans: num(R.veh), w: 1, tol: 0.02 });
      fields.push({ label: 'Required number of AGVs (integer)', ans: num(R.N), w: 2 });
      const srows = P.cells
        .map((c, i) => `<tr><td>${i + 1}</td><td>[(${c.d} + ${c.d}) × ${c.f} / ${P.v}] + (${c.f} × ${c.t} × 2) = ${sh(R.travel[i])} + ${sh(R.lul[i])}</td><td><b>${sh(R.use[i])}</b></td></tr>`)
        .join('');
      const solution = `
<table><tr><th>Cell</th><th>Calculation</th><th>Usage (min)</th></tr>${srows}<tr><td colspan="2"><b>Total</b></td><td><b>${sh(R.total)}</b></td></tr></table>
<p>Total load = ${sh(R.total)} / ${sh(P.c)} = <b>${sh(R.load)} min</b> → ${sh(R.load)} / 60 = <b>${sh(R.veh)}</b> → round up → <b>${sh(R.N)} AGVs</b> (AGV s.16–17).</p>`;
      return { statement, fields, solution, data: { P } };
    },
    oee(rng) {
      const D = IM.drills.oee;
      const P = D.gen(rng, {});
      const S = D.solve(P);
      const statement = `
<p>A machine works one shift of <b>${P.G} min</b>. Planned breaks take <b>${P.breaks} min</b>${P.pm ? ` and planned maintenance <b>${P.pm} min</b>` : ''}.
During the shift the machine had <b>${P.setup} min</b> of setup/adjustment and <b>${P.breakdown} min</b> of breakdowns.
The theoretical cycle time is <b>${sh(P.ct)} min/unit</b>; <b>${P.N}</b> units were processed and <b>${P.defects}</b> of them were defective.</p>
<p>Calculate the loading time, operating time, availability, performance efficiency, quality rate and OEE.</p>`;
      const fields = [
        { label: 'Loading time (min)', ans: num(S.L), w: 1 },
        { label: 'Operating time (min)', ans: num(S.O), w: 1 },
        { label: 'Availability (%)', ans: num(S.A.mul(100)), unit: '%', w: 1.5 },
        { label: 'Performance efficiency (%)', ans: num(S.Pf.mul(100)), unit: '%', w: 1.5 },
        { label: 'Quality rate (%)', ans: num(S.Q.mul(100)), unit: '%', w: 1.5 },
        { label: 'OEE (%)', ans: num(S.OEE.mul(100)), unit: '%', w: 2.5, tol: 0.3 },
      ];
      const solution = `
<div class="model">Loading time   = ${P.G} − ${P.breaks}${P.pm ? ` − ${P.pm}` : ''} = ${sh(S.L)} min      (planned downtime is not an OEE loss)
Operating time = ${sh(S.L)} − (${P.setup} + ${P.breakdown}) = ${sh(S.O)} min
Availability   = ${sh(S.O)} / ${sh(S.L)} = ${pc(S.A)}%
Performance    = ${sh(P.ct)} × ${P.N} / ${sh(S.O)} = ${sh(S.netOp)} / ${sh(S.O)} = ${pc(S.Pf)}%
Quality        = (${P.N} − ${P.defects}) / ${P.N} = ${pc(S.Q)}%
OEE            = ${pc(S.A)}% × ${pc(S.Pf)}% × ${pc(S.Q)}% = ${pc(S.OEE)}%
Check: valuable operating time / loading time = ${sh(P.ct)} × ${sh(S.good)} / ${sh(S.L)} = ${pc(S.OEE)}%</div>`;
      return { statement, fields, solution, data: { P } };
    },
    kanban(rng) {
      const D = IM.drills.kanban;
      const P = D.gen(rng, {});
      const S = D.solve(P);
      const comps = P.comps.map((c) => `<tr><td>${c.label.replace("Receiving box'ta bekleme", 'Waiting in the receiving box').replace("Order box'a transfer", 'Transfer to the order box').replace("Order box'ta bekleme", 'Waiting in the order box').replace('Hazırlık (setup)', 'Preparation (setup)').replace('Parti işleme', 'Batch processing').replace('Hücre içi bekleme', 'In-cell waiting').replace('Supermarkete taşıma', 'Transfer to the supermarket').replace('Supermarkette bekleme', 'Waiting in the supermarket')}</td><td>${c.v}</td></tr>`).join('');
      const statement = `
<p>A cell supplies part P1 to a customer cell with a kanban system. Daily demand is <b>${P.D} pieces</b> and the cell works <b>${P.M} min/day</b>.
The reliability coefficient is <b>α = ${sh(P.alpha)}</b> and each container holds <b>KB = ${P.KB}</b> pieces. The kanban cycle consists of (min):</p>
<table><tr><th>Component</th><th>min</th></tr>${comps}</table>
<p>Find the average demand OT, the kanban cycle time KCS and the number of kanbans KS.</p>`;
      const fields = [
        { label: 'OT — average demand (pcs/min)', ans: num(S.OT), w: 1 },
        { label: 'KCS — kanban cycle time (min)', ans: num(S.KCS), w: 1.5 },
        { label: 'OT × (1 + α) × KCS / KB (decimal)', ans: num(S.ksRaw), w: 1.5, tol: 0.03 },
        { label: 'KS — number of kanbans (integer)', ans: num(S.KS), w: 2 },
      ];
      const solution = `
<div class="model">OT  = ${P.D} / ${P.M} = ${sh(S.OT)} pcs/min
KCS = ${P.comps.map((c) => c.v).join(' + ')} = ${sh(S.KCS)} min
KS  = ${sh(S.OT)} × (1 + ${sh(P.alpha)}) × ${sh(S.KCS)} / ${P.KB} = ${sh(S.ksRaw)}  →  round up  →  ${sh(S.KS)} kanbans</div>
<p>One kanban per container, so ${sh(S.KS)} containers circulate (maximum stock ${sh(S.KS)} × ${P.KB} = ${sh(S.pull1)} pcs) — LEAN s.114.</p>`;
      return { statement, fields, solution, data: { P } };
    },
  };
  E.calc = function (gen, rng) {
    if (!CALC[gen]) throw new Error('unknown calc ' + gen);
    return CALC[gen](rng);
  };

  // ------------------------------------------------------------------ sınav kâğıdı
  // modlar: full (17 konu, her konudan 1 soru), quick (6 konu), weak (en zayıf 6 konu), custom (seçilen konular)
  E.MODES = {
    full: { label: 'Tam sınav', minutes: 100, desc: '17 konunun hepsinden birer soru · 100 puan · önerilen süre 100 dk' },
    quick: { label: 'Hızlı deneme', minutes: 30, desc: 'Rastgele 6 konu · 30 dk' },
    weak: { label: 'Zayıf konular', minutes: 30, desc: 'Puanın en düşük olduğu 6 konu · 30 dk' },
    custom: { label: 'Seçtiğim konular', minutes: 0, desc: 'Konuları sen seç (soru başına ~6 dk)' },
  };
  // Tam sınavda AGV ve OEE her zaman hesap sorusudur (gerçek sınavda en olası hesaplar); diğer modlarda konu havuzundan rastgele
  const FULL_FIXED = { agv: 'agv-calc', oee: 'oee-calc' };

  E.pickQuestion = function (topic, rng, avoid, mode) {
    const pool = E.questions.filter((q) => q.topic === topic);
    if (mode === 'full' && FULL_FIXED[topic]) return pool.find((q) => q.id === FULL_FIXED[topic]);
    let ids = pool.map((q) => q.id);
    const fresh = ids.filter((id) => !(avoid || []).includes(id));
    if (fresh.length) ids = fresh;
    const id = rng.pick(ids);
    return pool.find((q) => q.id === id);
  };

  // topicScores: { topicId: oran 0..1 | undefined } (zayıf mod için)
  E.buildExam = function (mode, opts, rng) {
    opts = opts || {};
    const all = E.topics.map((t) => t.id);
    let topics;
    if (mode === 'full') topics = all.slice();
    else if (mode === 'quick') topics = rng.shuffle(all.slice()).slice(0, 6);
    else if (mode === 'weak') {
      const sc = opts.topicScores || {};
      // hiç denenmemiş konu en zayıf sayılır (−1); eşitlikte rastgele
      const order = rng.shuffle(all.slice()).sort((a, b) => (sc[a] == null ? -1 : sc[a]) - (sc[b] == null ? -1 : sc[b]));
      topics = order.slice(0, 6);
    } else topics = (opts.topics || []).filter((id) => all.includes(id));
    if (!topics.length) throw new Error('Konu seçilmedi');
    topics.sort((a, b) => all.indexOf(a) - all.indexOf(b));
    // allQuestions: seçili konuların tüm soruları (konu mini sınavı); yoksa konu başına 1 soru
    const qs = opts.allQuestions
      ? topics.flatMap((tid) => E.questions.filter((q) => q.topic === tid))
      : topics.map((tid) => E.pickQuestion(tid, rng, opts.avoid, mode));
    const items = qs.map((q) => {
      const tid = q.topic;
      const it = { qid: q.id, topic: tid };
      if (q.type === 'calc') {
        const seed = Math.floor(rng() * 2147483646) + 1;
        it.seed = seed;
      }
      if (q.type === 'order') it.perm = rng.shuffle(q.items.map((_, i) => i));
      if (q.type === 'match') it.perm = rng.shuffle(q.pairs.map((_, i) => i));
      if (q.type === 'mcq') it.perm = rng.shuffle(q.options.map((_, i) => i));
      if (q.type === 'classify') it.perm = rng.shuffle(q.items.map((_, i) => i));
      return it;
    });
    const rawMax = items.reduce((s, it) => s + E.qById(it.qid).pts, 0);
    const minutes = opts.minutes != null ? opts.minutes : E.MODES[mode] && E.MODES[mode].minutes ? E.MODES[mode].minutes : Math.max(10, items.length * 6);
    return { v: 1, mode, items, rawMax, minutes, startedAt: null };
  };
  E.qById = (id) => E.questions.find((q) => q.id === id);
  // sayısal sorunun örneği (seed'den deterministik)
  E.calcInstance = (it) => E.calc(E.qById(it.qid).gen, IM.rng(it.seed));

  // bir sınav maddesini puanla: answer = kullanıcı cevabı, ticks = açık uçlu için onaylı ölçütler
  E.gradeItem = function (it, answer, ticks) {
    const q = E.qById(it.qid);
    switch (q.type) {
      case 'open': return E.gradeOpen(q, ticks || E.suggestTicks(q, (answer && answer.text) || ''));
      case 'order': return E.gradeOrder(q, answer && answer.seq);
      case 'match': return E.gradeMatch(q, answer && answer.sel);
      case 'classify': return E.gradeClassify(q, answer && answer.sel);
      case 'mcq': return E.gradeMcq(q, answer && answer.sel);
      case 'calc': return E.gradeCalc(q, E.calcInstance(it), answer && answer.vals);
      default: return { got: 0, max: q.pts };
    }
  };
  // toplam ve konu bazında: { got, max, pct(0..100, 100 puana ölçekli), perTopic: {tid: [got, max]} }
  E.summarize = function (exam, grades) {
    let got = 0, max = 0;
    const perTopic = {};
    exam.items.forEach((it, i) => {
      const g = grades[i] || { got: 0, max: E.qById(it.qid).pts };
      got += g.got; max += g.max;
      const p = perTopic[it.topic] || [0, 0];
      p[0] = round2(p[0] + g.got); p[1] = round2(p[1] + g.max);
      perTopic[it.topic] = p;
    });
    return { got: round2(got), max: round2(max), pct: max ? Math.round((1000 * got) / max) / 10 : 0, perTopic };
  };

  // ------------------------------------------------------------------ Leitner (ezber kartları)
  // kutu 1..5; aralıklar: 1 → hemen (aynı oturumda), 2 → 10 dk, 3 → 1 saat, 4 → 1 gün, 5 → 3 gün
  E.BOX_MS = [0, 0, 10 * 60e3, 60 * 60e3, 24 * 3600e3, 3 * 24 * 3600e3];
  // grade: 2 = tam biliyordum, 1 = kısmen, 0 = bilemedim
  E.leitner = function (rec, grade, now) {
    const r = Object.assign({ box: 0, n: 0, ok: 0, last: 0, due: 0 }, rec || {});
    if (grade === 2) r.box = Math.min(5, Math.max(1, r.box) + 1);
    else if (grade === 1) r.box = Math.max(1, Math.min(r.box, 2));
    else r.box = 1;
    r.n += 1;
    if (grade === 2) r.ok += 1;
    r.last = now;
    r.due = now + E.BOX_MS[r.box];
    return r;
  };
  // sıradaki kart: önce vadesi gelmiş (kutusu küçük olan önce), sonra hiç görülmemiş; hiçbiri yoksa null
  E.nextCard = function (cards, recs, now, opts) {
    opts = opts || {};
    const pool = cards.filter((c) => !opts.topic || c.topic === opts.topic).filter((c) => c.id !== opts.skip);
    const due = pool.filter((c) => recs[c.id] && recs[c.id].due <= now).sort((a, b) => recs[a.id].box - recs[b.id].box || recs[a.id].due - recs[b.id].due);
    if (due.length) return due[0];
    const unseen = pool.filter((c) => !recs[c.id]);
    if (unseen.length) return unseen[0];
    if (opts.force) {
      const all = pool.slice().sort((a, b) => recs[a.id].box - recs[b.id].box || recs[a.id].due - recs[b.id].due);
      return all[0] || null;
    }
    return null;
  };
  // kart için otomatik tespit: hangi ögeler yazılmış, sıralı kartlarda sıra doğru mu
  E.checkCard = function (card, text) {
    const pos = card.items.map((it) => (it[1] ? E.detectAt(text, it[1]) : -1));
    const found = pos.map((p) => p >= 0);
    let orderOk = null;
    if (card.ordered) {
      const seq = pos.map((p, i) => [p, i]).filter((x) => x[0] >= 0).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
      orderOk = E.lcs(seq, seq.slice().sort((a, b) => a - b)) === seq.length;
    }
    const auto = card.items.some((it) => it[1]);
    return { found, orderOk, auto };
  };

  // konu hâkimiyeti: ezber (kutu ≥3 oranı) ve sınav (son 3 denemedeki konu puanı) → 0..100
  E.mastery = function (state) {
    const out = {};
    E.topics.forEach((t) => {
      const cards = E.cards.filter((c) => c.topic === t.id);
      const recs = cards.map((c) => (state.cards || {})[c.id]).filter(Boolean);
      const memo = cards.length ? cards.reduce((s, c) => { const r = (state.cards || {})[c.id]; return s + (r ? Math.min(r.box, 4) / 4 : 0); }, 0) / cards.length : null;
      const att = (state.attempts || []).filter((a) => a.perTopic && a.perTopic[t.id]).slice(-3);
      const exam = att.length ? att.reduce((s, a) => s + a.perTopic[t.id][0], 0) / att.reduce((s, a) => s + a.perTopic[t.id][1], 0) : null;
      out[t.id] = {
        read: !!(state.read || {})[t.id],
        memo: memo == null ? null : Math.round(memo * 100),
        seen: recs.length,
        cards: cards.length,
        exam: exam == null ? null : Math.round(exam * 100),
        tries: att.length,
      };
    });
    return out;
  };
})();
