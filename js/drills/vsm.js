/* 2.3 · Value Stream Mapping — LEAN s.16–25 (s.22 current state, s.24 future state; görsel sayfalar).
   Formüller:
     Günlük talep           = aylık talep / iş günü                     (s.22: 18,400 / 20 = 920 adet)
     Günlük kullanılabilir  = vardiya sayısı × vardiya başına süre       (s.22: 2 × 27,600 s)
     Takt                   = günlük kullanılabilir süre / günlük talep  (s.24 "Tempo = 60 sec"; s.22'de yazmıyor)
     Envanter günü          = envanter (adet) / günlük talep             (s.22: 7000 / 920 = 7.61 → notlarda 7.6)
     Lead Time (LT)         = Σ envanter günleri (timeline üst basamaklar; hammadde dahil)
     Value added time (VA)  = Σ C/T (timeline alt basamaklar)
     C/T > takt             → süreç müşteri temposuna yetişemiyor (notlarda yok: yorum)
     LT azalması (%)        = (LT_current − LT_future) / LT_current × 100   (s.24 future state LT = 4.5 gün)
   Notes seçeneği = s.22 Holder Bracket current state birebir (notların 1 ondalık yuvarlaması: 7.6, 1.8, 2.7, 2, 4.5; LT 23.6;
     VA 188; takt 60; Assembly #1 62 s > 60 s) + s.24 LT 4.5 → (23.6 − 4.5) / 23.6 = 80.93%.
     Bu alanlarda tol = |tam − yuvarlı| + 0.01 → hem 7.61 hem 7.6 kabul.
   Rastgele mod: 4–5 süreç, envanter = günlük talep × (0.1'in katı gün) → tam sayı; takt tam sayı; C/T ≠ takt; LT azalması temiz.
   Bağımsız doğrulama: LT = Σ(envanter)/günlük talep + hammadde günü (toplamdan) ile gün gün toplam aynı (rastgele modda).
   Dışa açık: IM.drills.vsm.solve(P), .gen(rng), .NOTES. ex.data = P. */
(function () {
  const IM = window.IM;
  const F = IM.F;
  const d = IM.util.d;
  const sum = (a) => a.reduce((x, y) => x + y, 0);
  const fmtInt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const NOTES = {
    notes: true,
    title: 'Holder Bracket Product Family — Current State (LEAN s.22)',
    supplier: 'Michigan Steel Company',
    customer: 'State Street Assembly Plant',
    monthly: 18400,
    monthlySplit: '12,000 Left + 6,400 Right',
    days: 20,
    shifts: 2,
    shiftSec: 27600,
    rawName: 'Steel coil',
    rawDays: F(5),
    procs: [
      { name: 'Press', ct: 1, co: '1 hour', avail: 85 },
      { name: 'Welding #1', ct: 39, co: '10 min', avail: 100 },
      { name: 'Welding #2', ct: 46, co: '10 min', avail: 80 },
      { name: 'Assembly #1', ct: 62, co: '0', avail: 100 },
      { name: 'Assembly #2', ct: 40, co: '0', avail: 100 },
    ],
    // süreç sonrası envanterler (son = sevkiyat önü mamul)
    inv: [
      { q: 7000, txt: '4600 L + 2400 R', notesDays: F('7.6') },
      { q: 1700, txt: '1100 L + 600 R', notesDays: F('1.8') },
      { q: 2450, txt: '1600 L + 850 R', notesDays: F('2.7') },
      { q: 1840, txt: '1200 L + 640 R', notesDays: F(2) },
      { q: 4140, txt: '2700 L + 1440 R', notesDays: F('4.5') },
    ],
    notesLT: F('23.6'),
    futureLT: F('4.5'),
    notesRed: F('80.93'),
  };

  // ------------------------------------------------------------------ saf çözüm (tam kesir) + notes yuvarlaması
  function solve(P) {
    const daily = F(P.monthly).div(P.days);
    const avail = F(P.shifts * P.shiftSec);
    const takt = avail.div(daily);
    const invDays = P.inv.map((v) => F(v.q).div(daily));
    const ltExact = invDays.reduce((a, x) => a.add(x), F(P.rawDays));
    const va = sum(P.procs.map((p) => p.ct));
    const over = P.procs.map((p, i) => (F(p.ct).gt(takt) ? i : -1)).filter((i) => i >= 0);
    const tie = P.procs.some((p) => F(p.ct).eq(takt));
    // gösterilen (notes: notların yuvarlaması) değerler
    const shownDays = P.notes ? P.inv.map((v) => v.notesDays) : invDays;
    const lt = P.notes ? P.notesLT : ltExact;
    const red = P.notes ? P.notesRed : lt.sub(P.futureLT).div(lt).mul(100);
    const redExact = ltExact.sub(P.futureLT).div(ltExact).mul(100);
    return { daily, avail, takt, invDays, shownDays, ltExact, lt, va, over, tie, red, redExact };
  }

  // ------------------------------------------------------------------ rastgele parametre
  const NAMES = ['Cutting', 'Press', 'Machining', 'Welding', 'Painting', 'Assembly', 'Testing', 'Packing'];
  const PARTS = ['Bracket', 'Housing', 'Shaft', 'Frame', 'Cover', 'Hinge'];
  function gen(rng) {
    for (let tries = 0; tries < 600; tries++) {
      const shifts = rng.pick([1, 2, 2, 3]);
      const shiftSec = rng.pick([25200, 27000, 27600, 28800]);
      const days = rng.pick([20, 20, 21, 22]);
      const avail = shifts * shiftSec;
      const dailies = [];
      for (let D = 200; D <= 1500; D += 10) if (avail % D === 0 && avail / D >= 25 && avail / D <= 150) dailies.push(D);
      if (!dailies.length) continue;
      const daily = rng.pick(dailies);
      const takt = avail / daily;
      const k = rng.pick([4, 5]);
      const idx = rng.shuffle(IM.util.range(NAMES.length)).slice(0, k).sort((a, b) => a - b);
      const procs = idx.map((i) => {
        let ct;
        do ct = rng.int(Math.max(1, Math.round(takt * 0.4)), takt + 12); while (ct === takt);
        if (NAMES[i] === 'Press' || NAMES[i] === 'Cutting') ct = rng.int(1, 8);
        return { name: NAMES[i], ct, co: rng.pick(['0', '5 min', '10 min', '20 min', '30 min', '1 hour']), avail: rng.pick([80, 85, 90, 95, 100]) };
      });
      if (procs.filter((p) => p.ct > takt).length > 2) continue;
      const inv = procs.map(() => {
        const dd = F(rng.int(5, 70)).div(10);
        return { q: dd.mul(daily).toNumber() };
      });
      const rawDays = F(rng.int(2, 8)).div(rng.pick([1, 2]));
      const P = {
        notes: false,
        title: `${rng.pick(PARTS)} Product Family — Current State`,
        supplier: 'Tedarikçi', customer: 'Müşteri',
        monthly: daily * days, days, shifts, shiftSec, rawName: 'Hammadde', rawDays, procs, inv,
      };
      // gelecek durum LT: 0.5'in katı, mevcut LT'nin %10–40'ı, azalma temiz
      const S0 = solve(Object.assign({}, P, { futureLT: F(1) }));
      const cands = [];
      for (let h = 2; h * 0.5 <= S0.lt.toNumber() * 0.4; h++) {
        const f = F(h).div(2);
        if (f.ge(S0.lt.mul(F('0.1'))) && S0.lt.sub(f).div(S0.lt).mul(100).isNice(2)) cands.push(f);
      }
      if (!cands.length) continue;
      P.futureLT = rng.pick(cands);
      const S = solve(P);
      if (S.tie || !S.takt.isInt() || !S.lt.isNice(2) || !S.red.isNice(2) || S.invDays.some((x) => !x.isNice(2))) continue;
      // bağımsız kontrol: LT = Σq / günlük talep + hammadde
      if (!F(sum(inv.map((v) => v.q))).div(daily).add(rawDays).eq(S.lt)) throw new Error('vsm: LT check');
      return P;
    }
    throw new Error('vsm: uygun örnek bulunamadı');
  }

  // ------------------------------------------------------------------ viz
  function flowViz(P, S, stage) {
    // stage: 0 veri, 1 envanter günleri, 2 +LT, 3 +VA
    const items = [{ kind: 'ext', title: P.notes ? 'Supplier' : 'Tedarikçi' }];
    items.push({ kind: 'inv', label: `${P.rawName}` });
    P.procs.forEach((p, i) => {
      items.push({ kind: 'proc', title: p.name, lines: [`C/T = ${p.ct} s`, `C/O = ${p.co}`, `Avail. = ${p.avail}%`], hl: stage >= 4 && S.over.includes(i) });
      items.push({ kind: 'inv', label: fmtInt(P.inv[i].q) });
    });
    items.push({ kind: 'ext', title: P.notes ? 'Customer' : 'Müşteri' });
    const inv = [d(P.rawDays) + ' gün'].concat(S.shownDays.map((x) => (stage >= 1 ? d(x) + ' gün' : '?')));
    return {
      type: 'flow',
      caption: P.title,
      items,
      timeline: { inv, proc: P.procs.map((p) => p.ct + ' s'), lt: stage >= 2 ? d(S.lt) + ' gün' : '?', va: stage >= 3 ? S.va + ' s' : '?' },
    };
  }

  // rounding tolerance: accept exact value and the notes' rounded value
  const tolFor = (shown, exact) => {
    const diff = Math.abs(shown.toNumber() - exact.toNumber());
    return diff < 1e-12 ? undefined : +(diff + 0.01).toFixed(4);
  };

  function build(rng, opts) {
    const P = opts && opts.notes ? NOTES : gen(rng);
    const S = solve(P);
    if (!P.notes && !S.ltExact.eq(S.lt)) throw new Error('vsm: LT mismatch');
    const N = P.notes;
    const ref = N ? 'LEAN s.22' : '(notlarda sayısal örnek yok; yöntem LEAN s.22)';
    const steps = [];

    steps.push({
      kind: 'number',
      prompt: `<b>Günlük talep.</b> Aylık talep ${fmtInt(P.monthly)} adet${N ? ` (${P.monthlySplit})` : ''}, ayda ${P.days} iş günü.`,
      fields: [{ label: 'Günlük talep (adet/gün)', answer: S.daily }],
      explain: `${fmtInt(P.monthly)} / ${P.days} = <b>${d(S.daily)} adet/gün</b>${N ? ' (s.22: "Daily Demand: 920 pieces")' : ''}. Envanter günleri bu değere bölünerek bulunur.`,
      vizDuring: flowViz(P, S, 0),
    });
    steps.push({
      kind: 'number',
      prompt: `<b>Günlük kullanılabilir süre ve takt.</b> ${P.shifts} vardiya, vardiya başına ${fmtInt(P.shiftSec)} s kullanılabilir süre; günlük talep ${d(S.daily)} adet.`,
      fields: [
        { label: 'Günlük kullanılabilir süre (s/gün)', answer: S.avail },
        { label: 'Takt time (s/pc)', answer: S.takt },
      ],
      hint: 'Takt Time = Net working time / Total Demand (LEAN s.2).',
      explain: `${P.shifts} × ${fmtInt(P.shiftSec)} = ${fmtInt(S.avail.toNumber())} s; takt = ${fmtInt(S.avail.toNumber())} / ${d(S.daily)} = <b>${d(S.takt)} s/pc</b>.${N ? ' (Takt s.22 haritasında yazmıyor; s.24 future state\'te "Tempo = 60 sec".)' : ''}`,
    });
    steps.push({
      kind: 'number',
      prompt: `<b>Envanter günleri.</b> Her envanter üçgenindeki stok kaç günlük talebe eşit? (günlük talep ${d(S.daily)} adet)`,
      fields: P.inv.map((v, i) => ({
        label: `${P.procs[i].name} sonrası (gün)`,
        answer: S.shownDays[i],
        tol: N ? tolFor(S.shownDays[i], S.invDays[i]) : undefined,
      })),
      hint: 'Envanter günü = envanter (adet) / günlük talep.',
      explain: P.inv.map((v, i) => `${N ? v.txt + ' = ' : ''}${fmtInt(v.q)} / ${d(S.daily)} = ${N && !S.invDays[i].eq(S.shownDays[i]) ? `${S.invDays[i].fixed(2)} → notlarda <b>${d(S.shownDays[i])}</b>` : `<b>${d(S.shownDays[i])}</b>`} gün`).join('<br>') +
        `<br>${P.rawName}: ${d(P.rawDays)} gün (verilmiş). ${N ? 'Notlar günleri 1 ondalığa yuvarlar (LEAN s.22).' : ''}`,
      viz: flowViz(P, S, 1),
    });
    const ltTerms = [d(P.rawDays)].concat(S.shownDays.map((x) => d(x))).join(' + ');
    steps.push({
      kind: 'number',
      prompt: `<b>Lead Time.</b> ${P.rawName} ${d(P.rawDays)} gün ve envanter günleri ${S.shownDays.map((x) => d(x)).join(', ')} ile üretim lead time'ı (timeline üst basamaklarının toplamı) nedir?`,
      fields: [{ label: 'Lead Time (gün)', answer: S.lt, tol: N ? tolFor(S.lt, S.ltExact) : undefined }],
      hint: 'Production Lead Time: hammadde girişinden sevkiyata kadar geçen süre (LEAN s.3) → tüm envanter bekleme günlerinin toplamı.',
      explain: `LT = ${ltTerms} = <b>${d(S.lt)} gün</b>${N ? ` (s.22: "Lead Time = 23.6 days"; yuvarlanmamış günlerle ${S.ltExact.fixed(2)})` : ''}. Süreç C/T'leri saniye düzeyinde olduğundan LT'yi neredeyse tamamen envanter bekleme belirler.`,
      viz: flowViz(P, S, 2),
    });
    steps.push({
      kind: 'number',
      prompt: `<b>Value added time.</b> Timeline alt basamaklarındaki süreç C/T'lerini topla.`,
      fields: [{ label: 'Value added time (s)', answer: F(S.va) }],
      explain: `VA = ${P.procs.map((p) => p.ct).join(' + ')} = <b>${S.va} s</b>${N ? ' (s.22: "Value added time = 188 sec")' : ''}. LT = ${d(S.lt)} gün iken değer katan süre yalnızca ${S.va} s: akışın çok küçük bir kısmı değer katıyor, gerisi bekleme (israf).`,
      viz: flowViz(P, S, 3),
    });
    const none = !S.over.length;
    steps.push({
      kind: 'multi',
      prompt: `<b>Takt ile karşılaştırma.</b> Takt = ${d(S.takt)} s/pc. Hangi süreç(ler)in C/T'si takt'tan büyük (müşteri temposuna yetişemiyor)? ${N ? '<span class="muted">(notlarda yok: yorum)</span>' : ''}`,
      options: P.procs.map((p, i) => ({ html: `${p.name} (C/T = ${p.ct} s)`, correct: S.over.includes(i) })).concat([{ html: 'Hiçbiri (tüm C/T ≤ takt)', correct: none }]),
      keepOrder: true,
      explain: none
        ? `Tüm C/T değerleri ${d(S.takt)} s'nin altında: her süreç tek başına talebe yetişiyor; sorun akış ve envanterde.`
        : `${S.over.map((i) => `${P.procs[i].name}: ${P.procs[i].ct} s > ${d(S.takt)} s`).join('; ')} → bu süreç(ler) takt temposunu tutturamaz; fazla mesai/ek kapasite ya da iş içeriği dengelemesi gerekir. ${N ? 'Future state (s.24) welding ve assembly\'yi tek hücrede birleştirip "Tempo = 60 sec, total work < 168 sec" hedefler.' : ''}`,
      viz: flowViz(P, S, 4),
    });
    steps.push({
      kind: 'number',
      prompt: `<b>Future state.</b> ${N ? 'Future state map\'te (LEAN s.24; SMED ile C/O &lt; 10 min, EPE = 1 shift, hücre tipi yerleşim, kanban/supermarket) lead time 4.5 gün.' : `İyileştirilmiş future state map'te (supermarket'ler, kanban, hücre tipi yerleşim) lead time ${d(P.futureLT)} gün.`} Mevcut LT = ${d(S.lt)} gün'e göre LT yüzde kaç azalır?`,
      fields: [{ label: 'LT azalması (%)', answer: S.red, unit: '%', tol: N ? +(Math.abs(S.red.toNumber() - S.redExact.toNumber()) + 0.01).toFixed(4) : undefined }],
      hint: 'Azalma = (LT_mevcut − LT_gelecek) / LT_mevcut × 100.',
      explain: `(${d(S.lt)} − ${d(P.futureLT)}) / ${d(S.lt)} × 100 = <b>${d(S.red)}%</b>. ${N ? 'Future state\'te VA da 188 s\'den 169 s\'ye iner (s.24).' : ''} Future state map, yalın kavram ve tekniklerle iyileştirilmiş malzeme ve bilgi akışıdır; ayrıntılı iyileştirme planına yol gösterir (LEAN s.23).`,
    });

    const invRows = P.inv.map((v, i) => `<tr><td>${P.procs[i].name} sonrası</td><td>${fmtInt(v.q)}${N ? ` (${v.txt})` : ''}</td></tr>`).join('');
    const statement = `<p>${N ? '<b>Ders notundaki örnek (LEAN s.22):</b> ' : ''}<b>${P.title}</b>. Aylık talep ${fmtInt(P.monthly)} adet${N ? ` (${P.monthlySplit})` : ''}, ayda ${P.days} iş günü; ${P.shifts} vardiya, vardiya başına ${fmtInt(P.shiftSec)} s kullanılabilir süre. ${P.rawName} stoku ${d(P.rawDays)} gün.</p>
      <table><tr><th>Süreç</th><th>C/T</th><th>C/O</th><th>Availability</th></tr>${P.procs.map((p) => `<tr><td>${p.name}</td><td>${p.ct} s</td><td>${p.co}</td><td>${p.avail}%</td></tr>`).join('')}</table>
      <table><tr><th>Envanter</th><th>Adet</th></tr>${invRows}</table>
      <p>Current state map'in timeline'ını doldur: envanter günleri (üst basamak), Lead Time, Value added time; sonra takt ile karşılaştır. <span class="muted">${ref}</span></p>`;
    return {
      title: N ? 'Value Stream Mapping (LEAN s.22 örneği)' : 'Value Stream Mapping · Current State',
      statement,
      viz: flowViz(P, S, 0),
      steps,
      data: P,
      solution: `Günlük talep ${d(S.daily)} · takt ${d(S.takt)} s · envanter günleri ${S.shownDays.map((x) => d(x)).join(', ')} · LT ${d(S.lt)} gün · VA ${S.va} s · C/T > takt: ${none ? 'yok' : S.over.map((i) => P.procs[i].name).join(', ')} · future LT ${d(P.futureLT)} gün → ${d(S.red)}% azalma.`,
    };
  }

  IM.registerDrill({
    id: 'vsm',
    topic: '2.3',
    title: 'Value Stream Map: Lead Time, VA ve Takt',
    description: 'Current state map verisinden günlük talep, takt, envanter günleri, Lead Time ve Value added time; C/T–takt karşılaştırması ve future state ile lead time azalması (LEAN s.22, s.24).',
    options: [{ key: 'notes', label: 'Ders notundaki örneği kullan (Holder Bracket, LEAN s.22)', type: 'checkbox', default: false }],
    solve,
    gen,
    NOTES,
    generate: (rng, opts) => build(rng, opts || {}),
  });
})();
