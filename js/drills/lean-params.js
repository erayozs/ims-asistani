/* 2.1 · Üretim sistemi parametreleri — LEAN s.2–3 (tanımlar), s.187 (net available run time).
   Formüller (notların yazımıyla):
     Net working time  = Gross time available − Planned downtime            (LEAN s.187: break times, planned maintenance)
                       = vardiya sayısı × vardiya süresi − vardiya sayısı × mola − planlı bakım
     Takt Time         = Net working time / Total Demand                    (LEAN s.2, "customer requested cycle time")
     Capacity          = Net working time / Cycle Time                      (LEAN s.2)
     CT ≤ takt  ⇔  Capacity ≥ Demand  ⇔  talep karşılanır
     Efficiency        = Output / Input                                     (LEAN s.2)  → burada adet / (işçi·saat)
     Effectiveness     = degree of reaching a goal                          (LEAN s.2)  → gerçekleşen / hedef (talep) × 100
     CSL Type 1        = sorunsuz (zaman, miktar, kalite) sevk edilen ürün sayısı / toplam sevk edilen ürün   (LEAN s.3)
     CSL Type 2        = sorunsuz sevkiyat sayısı / toplam sevkiyat sayısı                                   (LEAN s.3)
   Notlarda sayısal örnek YOK → notes seçeneği yok; açıklamalarda "(notlarda sayısal örnek yok)".
   Kalite kapıları: tüm gösterilen/hesaplanan değerler ≤2 ondalık (isNice(2)); CT ≠ takt (karar tek); A < talep;
     CSL Type 1 ≠ Type 2; 6–10 sevkiyat, en az 1 sorunlu ve en az 2 sorunsuz sevkiyat.
   Bağımsız doğrulama: CT ≤ takt kararı ⇔ Capacity ≥ Demand; CSL Type 1 = 100 − (sorunlu ürün payı).
   Dışa açık: IM.drills['lean-params'].solve(P) (saf), .gen(rng) (rastgele parametre). ex.data = P. */
(function () {
  const IM = window.IM;
  const F = IM.F;
  const d = IM.util.d;
  const pct100 = (x) => F(x).mul(100); // oran -> yüzde sayısı (Frac)
  const sum = (a) => a.reduce((x, y) => x + y, 0);
  const NOTE = '(notlarda sayısal örnek yok; tanımlar LEAN s.2–3)';
  const PROB = { time: 'zaman (geç teslim)', qty: 'miktar (eksik)', qual: 'kalite (hatalı ürün)' };

  // ------------------------------------------------------------------ saf çözüm
  function solve(P) {
    const grossMin = P.shifts * P.shiftMin;
    const plannedMin = P.shifts * P.breakMin + P.maintMin;
    const nwtMin = grossMin - plannedMin;
    const nwtSec = nwtMin * 60;
    const takt = F(nwtSec).div(P.demand);
    const cap = F(nwtSec).div(P.ct);
    const meets = F(P.ct).le(takt);
    const inputWh = F(nwtMin).div(60).mul(P.workers);
    const eff = F(P.actual).div(inputWh);
    const effect = pct100(F(P.actual).div(P.demand));
    const totQ = sum(P.ship.map((s) => s.q));
    const okQ = sum(P.ship.filter((s) => !s.prob).map((s) => s.q));
    const okN = P.ship.filter((s) => !s.prob).length;
    const csl1 = pct100(F(okQ).div(totQ));
    const csl2 = pct100(F(okN).div(P.ship.length));
    return { grossMin, plannedMin, nwtMin, nwtSec, takt, cap, meets, inputWh, eff, effect, totQ, okQ, okN, csl1, csl2 };
  }

  // ------------------------------------------------------------------ rastgele parametre
  function gen(rng) {
    for (let tries = 0; tries < 600; tries++) {
      const shifts = rng.pick([1, 2, 2, 3]);
      const shiftMin = rng.pick([450, 480, 480, 540]);
      const breakMin = rng.pick([30, 40, 45, 60]);
      const maintMin = rng.pick([0, 0, 15, 20, 30]);
      const nwtMin = shifts * (shiftMin - breakMin) - maintMin;
      const nwtSec = nwtMin * 60;
      if (!F(nwtMin).div(60).isNice(2)) continue;
      // takt tam sayı saniye, talep tam sayı
      const takts = [];
      for (let t = 20; t <= 150; t++) if (nwtSec % t === 0) { const D = nwtSec / t; if (D >= 150 && D <= 3000) takts.push(t); }
      if (!takts.length) continue;
      const takt = rng.pick(takts);
      const demand = nwtSec / takt;
      // cycle time: takt'a yakın, ≠ takt, kapasite temiz
      const cts = [];
      for (let c = Math.max(5, takt - 15); c <= takt + 10; c++) if (c !== takt && F(nwtSec).div(c).isNice(2)) cts.push(c);
      if (!cts.length) continue;
      const ct = rng.pick(cts);
      const cap = F(nwtSec).div(ct);
      // gerçekleşen üretim: talebin %75–99'u, kapasiteyi aşamaz, etkinlik ve verimlilik temiz
      const workers = rng.int(3, 12);
      const inputWh = F(nwtMin).div(60).mul(workers);
      const lo = Math.ceil(demand * 0.75), hi = Math.min(demand - 1, cap.floor().toNumber());
      const As = [];
      for (let a = lo; a <= hi; a++) if (F(a * 100).div(demand).isNice(2) && F(a).div(inputWh).isNice(2)) As.push(a);
      if (!As.length) continue;
      const actual = rng.pick(As);
      // sevkiyat tablosu
      const n = rng.pick([6, 8, 8, 10, 10]);
      const ship = [];
      for (let i = 0; i < n; i++) ship.push({ q: rng.int(2, 30) * 10, prob: null });
      const nBad = rng.int(1, Math.ceil(n / 2));
      rng.shuffle(IM.util.range(n)).slice(0, nBad).forEach((i) => (ship[i].prob = rng.pick(['time', 'qty', 'qual'])));
      const P = { shifts, shiftMin, breakMin, maintMin, demand, ct, workers, actual, ship };
      const S = solve(P);
      if (!S.csl1.isNice(2) || !S.csl2.isNice(2) || S.csl1.eq(S.csl2)) continue;
      if (!S.takt.isInt() || !S.cap.isNice(2) || !S.eff.isNice(2) || !S.effect.isNice(2)) continue;
      return P;
    }
    throw new Error('lean-params: uygun örnek bulunamadı');
  }

  // ------------------------------------------------------------------ görseller
  const shipViz = (P, reveal) => ({
    type: 'matrix',
    caption: 'Geçen haftaki sevkiyatlar',
    corner: 'Sevkiyat',
    colLabels: ['Miktar (adet)', 'Sorun'],
    rowLabels: P.ship.map((_, i) => '#' + (i + 1)),
    cells: P.ship.map((s) => [s.q, s.prob ? PROB[s.prob] : '— (sorunsuz)']),
    cls: P.ship.map((s) => (reveal ? [s.prob ? 'm' : 'hl', s.prob ? 'm' : 'hl'] : ['', s.prob ? 'm' : ''])),
  });
  const ctViz = (P, S) => ({
    type: 'bars',
    caption: 'Cycle time ve takt time (s/pc)',
    labels: ['Cycle time', 'Takt time'],
    values: [P.ct, S.takt.toNumber()],
    highlight: S.meets ? [] : [0],
    decimals: 0,
    ref: [{ v: S.takt.toNumber(), label: 'takt' }],
  });

  function build(rng) {
    const P = gen(rng);
    const S = solve(P);
    const sh = P.shifts;
    const steps = [];
    const plannedTxt = `${sh} × ${P.breakMin}${P.maintMin ? ` + ${P.maintMin}` : ''} = ${S.plannedMin}`;

    steps.push({
      kind: 'number',
      prompt: `<b>Net working time.</b> Günlük brüt süre ${sh} × ${P.shiftMin} = ${S.grossMin} dk. Planlı duruşları (mola${P.maintMin ? ', planlı bakım' : ''}) düşerek günlük net çalışma süresini dakika olarak bul.`,
      fields: [{ label: 'Net working time (min/gün)', answer: F(S.nwtMin) }],
      hint: 'Net available run time = Gross time available − Planned downtime (molalar, planlı bakım) — LEAN s.187.',
      explain: `Planlı duruş = ${plannedTxt} dk → Net working time = ${S.grossMin} − ${S.plannedMin} = <b>${S.nwtMin} dk/gün</b>. Molalar ve planlı bakım "planned downtime"dır; arızalar ve setup ise planlı değildir (downtime losses, LEAN s.187).`,
    });
    steps.push({
      kind: 'number',
      prompt: `<b>Birim dönüşümü.</b> Net working time = ${S.nwtMin} dk/gün. Cycle time saniye cinsinden verildiği için bunu saniyeye çevir.`,
      fields: [{ label: 'Net working time (s/gün)', answer: F(S.nwtSec) }],
      explain: `${S.nwtMin} × 60 = <b>${S.nwtSec} s/gün</b>. Takt ve cycle time aynı birimde olmalı — dakika/saniye karışıklığı klasik sınav tuzağıdır.`,
    });
    steps.push({
      kind: 'number',
      prompt: `<b>Takt time.</b> Net working time = ${S.nwtSec} s/gün, günlük toplam talep = ${P.demand} adet.`,
      fields: [{ label: 'Takt time (s/pc)', answer: S.takt }],
      hint: 'Takt Time = Net working time / Total Demand — müşterinin istediği çevrim süresi (LEAN s.2).',
      explain: `Takt = ${S.nwtSec} / ${P.demand} = <b>${d(S.takt)} s/pc</b>: müşteri talebini tam karşılamak için her ${d(S.takt)} saniyede bir ürün çıkmalı. ${NOTE}`,
    });
    steps.push({
      kind: 'number',
      prompt: `<b>Capacity.</b> Darboğaz istasyonun cycle time'ı (art arda iki ürün çıkışı arası süre) CT = ${P.ct} s. Net working time = ${S.nwtSec} s/gün ile günlük kapasite nedir?`,
      fields: [{ label: 'Capacity (pc/gün)', answer: S.cap }],
      hint: 'Capacity = Net working time / Cycle Time (LEAN s.2) — takt ile değil, cycle time ile bölünür.',
      explain: `Capacity = ${S.nwtSec} / ${P.ct} = <b>${d(S.cap)} adet/gün</b>. (Takt ile bölseydin talebi, ${P.demand}, bulurdun — capacity değil.)`,
    });
    steps.push({
      kind: 'choice',
      prompt: `<b>Karar.</b> CT = ${P.ct} s, takt = ${d(S.takt)} s/pc. Mevcut sistem günlük talebi karşılayabilir mi?`,
      options: [
        { html: 'Evet — CT ≤ takt (capacity ≥ talep)', correct: S.meets },
        { html: 'Hayır — CT > takt (capacity < talep)', correct: !S.meets },
        { html: 'Karar için production lead time da gerekir', correct: false },
      ],
      keepOrder: true,
      explain: S.meets
        ? `${P.ct} ≤ ${d(S.takt)} → ürünler talebin gerektirdiğinden hızlı çıkar; kontrol: capacity ${d(S.cap)} ≥ talep ${P.demand}. Lead time (hammadde girişinden sevke kadar geçen süre) bu kararı belirlemez.`
        : `${P.ct} > ${d(S.takt)} → hat, müşterinin istediği hızdan yavaş; kontrol: capacity ${d(S.cap)} < talep ${P.demand} (günde ${d(F(P.demand).sub(S.cap))} adet eksik). Lead time bu kararı belirlemez.`,
      viz: [ctViz(P, S), shipViz(P, false)],
    });
    steps.push({
      kind: 'number',
      prompt: `<b>Efficiency = Output / Input.</b> Gün içinde ${P.workers} işçi net working time (${S.nwtMin} dk) boyunca çalıştı ve <b>${P.actual}</b> adet üretildi. Girdi = işçi·saat, çıktı = adet olarak al.`,
      fields: [
        { label: 'Input (işçi·saat)', answer: S.inputWh },
        { label: 'Efficiency (adet / işçi·saat)', answer: S.eff },
      ],
      hint: `${S.nwtMin} dk = ${d(F(S.nwtMin).div(60))} saat.`,
      explain: `Input = ${P.workers} × ${S.nwtMin} / 60 = ${P.workers} × ${d(F(S.nwtMin).div(60))} = <b>${d(S.inputWh)} işçi·saat</b>; Efficiency = ${P.actual} / ${d(S.inputWh)} = <b>${d(S.eff)} adet/işçi·saat</b>. Efficiency kaynak kullanımını (çıktı/girdi) ölçer (LEAN s.2). ${NOTE}`,
    });
    steps.push({
      kind: 'number',
      prompt: `<b>Effectiveness.</b> Günün hedefi talebi karşılamaktı (${P.demand} adet); gerçekleşen üretim ${P.actual} adet. Hedefe ulaşma derecesi nedir?`,
      fields: [{ label: 'Effectiveness (%)', answer: S.effect, unit: '%' }],
      hint: 'Effectiveness: degree of reaching a goal (LEAN s.2) → gerçekleşen / hedef.',
      explain: `Effectiveness = ${P.actual} / ${P.demand} × 100 = <b>${d(S.effect)}%</b>. Efficiency (çıktı/girdi) ≠ effectiveness (hedefe ulaşma): bir sistem verimli olup yine de hedefi tutturamayabilir.`,
    });
    steps.push({
      kind: 'number',
      prompt: `<b>Customer Service Level (Type 1).</b> Sevkiyat tablosunu kullan. Sorunlu (zaman, miktar veya kalite) bir sevkiyattaki tüm ürünler sorunlu sayılır.`,
      fields: [{ label: 'CSL Type 1 (%)', answer: S.csl1, unit: '%' }],
      hint: 'Type 1 = sorunsuz sevk edilen ÜRÜN sayısı / toplam sevk edilen ürün (LEAN s.3).',
      explain: `Toplam ürün = ${P.ship.map((s) => s.q).join(' + ')} = ${S.totQ}; sorunsuz sevkiyatlardaki ürün = ${P.ship.filter((s) => !s.prob).map((s) => s.q).join(' + ')} = ${S.okQ} → Type 1 = ${S.okQ} / ${S.totQ} × 100 = <b>${d(S.csl1)}%</b>. ${NOTE}`,
      viz: shipViz(P, true),
    });
    steps.push({
      kind: 'number',
      prompt: `<b>Customer Service Level (Type 2).</b> Aynı tabloda (${P.ship.length} sevkiyat; Type 1 = ${d(S.csl1)}%) sevkiyat bazlı hizmet düzeyi nedir?`,
      fields: [{ label: 'CSL Type 2 (%)', answer: S.csl2, unit: '%' }],
      hint: 'Type 2 = sorunsuz SEVKİYAT sayısı / toplam sevkiyat sayısı (LEAN s.3) — miktarlar önemsiz.',
      explain: `Sorunsuz sevkiyat = ${S.okN}, toplam = ${P.ship.length} → Type 2 = ${S.okN} / ${P.ship.length} × 100 = <b>${d(S.csl2)}%</b>. Type 1 (${d(S.csl1)}%) ürün adedini, Type 2 sevkiyat sayısını sayar; ${S.csl1.gt(S.csl2) ? 'sorunlu sevkiyatlar ortalamadan küçük olduğu için Type 1 daha yüksek' : 'sorunlu sevkiyatlar ortalamadan büyük olduğu için Type 1 daha düşük'}.`,
      viz: shipViz(P, true),
    });

    const statement = `<p>Bir üretim hattı günde <b>${sh}</b> vardiya çalışıyor; vardiya süresi <b>${P.shiftMin} dk</b>, vardiya başına mola <b>${P.breakMin} dk</b>${P.maintMin ? `, ayrıca günde <b>${P.maintMin} dk</b> planlı bakım` : ''}. Günlük toplam talep <b>${P.demand}</b> adet, darboğaz istasyonun cycle time'ı <b>${P.ct} s</b>.</p>
      <p>Sağdaki tablo geçen haftaki sevkiyatları gösteriyor (miktar ve varsa sorun türü). Üretim sistemi parametrelerini hesapla. <span class="muted">${NOTE}</span></p>
      <div class="model">Net working time = Gross time − Planned downtime   (LEAN s.187)
Takt Time = Net working time / Total Demand
Capacity  = Net working time / Cycle Time</div>`;
    return {
      title: 'Üretim Sistemi Parametreleri',
      statement,
      viz: shipViz(P, false),
      steps,
      data: P,
      solution: `Net working time ${S.nwtMin} dk = ${S.nwtSec} s · Takt ${d(S.takt)} s/pc · Capacity ${d(S.cap)} pc/gün (${S.meets ? 'talep karşılanır' : 'talep karşılanamaz'}) · Efficiency ${d(S.eff)} adet/işçi·saat · Effectiveness ${d(S.effect)}% · CSL Type 1 ${d(S.csl1)}%, Type 2 ${d(S.csl2)}%.`,
    };
  }

  IM.registerDrill({
    id: 'lean-params',
    topic: '2.1',
    title: 'Takt Time, Capacity ve Service Level',
    description: 'Vardiya ve mola verisinden net working time; takt time, capacity ve CT–takt kararı; efficiency / effectiveness; sevkiyat tablosundan Customer Service Level Type 1 ve Type 2 (LEAN s.2–3).',
    solve,
    gen,
    generate: (rng) => build(rng),
  });
})();
