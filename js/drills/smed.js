/* 2.6 · SMED — LEAN s.74–104 (s.75 setup tanımı, s.77–78 SMED/OTED/NOTED, s.79 internal/external, s.80–86 aşamalar,
   s.87 internal→external örneği, s.104 plastik enjeksiyon setup çizelgesi).
   Kavramlar (notların yazımıyla):
     Internal setup: mounting, dismounting dies gibi yalnızca makine DURDUKTAN sonra yapılabilen faaliyetler (s.79).
     External setup: sökülen kalıbı depoya taşımak, takılacak kalıbı makine yanına getirmek — makine ÇALIŞIRKEN yapılabilir (s.79).
     Stage 0: internal/external ayrımı yok → tüm faaliyetler makine dururken (s.80–81)
     Stage 1: internal ve external ayrılır → makine yalnızca internal faaliyetler için durur (s.84, "en önemli adım")
     Stage 2: internal faaliyetler mümkün olduğunca external'a çevrilir (s.86; normal setup %30–50 azalabilir)
     SMED: setup < 10 dk (s.77) · OTED: < 1 dk (s.78) · NOTED: otomatik setup (s.78)
     "Reducing setup times saves capacity" (s.75) → haftalık kazanılan süre = setup sayısı × (Stage 0 − Stage 2) süresi.
   Hesaplar (sayısal örnek notlarda yok):
     T0 = Σ tüm faaliyetler; T1 = Σ internal (Stage 1'de çevrilecekler dahil); T2 = T1 − Σ çevrilen
     Azalma(0→1) = (T0 − T1)/T0 × 100;  Azalma(1→2) = (T1 − T2)/T1 × 100;  Kazanç = k × (T0 − T2) dk/hafta
   Faaliyet açıklamaları notlardaki ifadelerden (s.79, 81, 84, 85, 104); kalıp ön ısıtma örneği "(notlarda yok)".
   Kalite kapıları: süreler 0.5 dk'nın katı; tüm yüzdeler ≤2 ondalık; T2 ≠ 10 ve T2 ≠ 1 (SMED/OTED kararı tek); 6–9 faaliyet.
   Bağımsız doğrulama: T0 = T1 + Σ external (iki yoldan toplam).
   Dışa açık: IM.drills.smed.solve(P), .gen(rng). ex.data = P. */
(function () {
  const IM = window.IM;
  const F = IM.F;
  const d = IM.util.d;

  // tip: 'int' (doğası gereği internal), 'ext' (external), 'conv' (şu anki yöntemle internal; Stage 2'de external'a çevrilir)
  const INTERNAL = [
    { desc: 'Eski kalıbı makineden sökmek (dismounting)', src: 's.79', lo: 2, hi: 8 },
    { desc: 'Yeni kalıbı makineye bağlamak (mounting)', src: 's.79', lo: 2, hi: 8 },
    { desc: 'Yeni kalıbı makinede konumlandırmak ve ayarlamak (setting of die)', src: 's.84', lo: 1, hi: 6 },
    { desc: 'Soğutma suyunu makinedeki kalıba bağlamak', src: 's.104', lo: 1, hi: 4 },
    { desc: 'Boğaz (nozzle) temizliği ve makinede kaba program ayarı', src: 's.104', lo: 1, hi: 5 },
    { desc: 'İlk numuneyi almak ve makinede ince ayar yapmak', src: 's.104 (setup ilk kabul edilebilir ürünle biter, s.75)', lo: 1, hi: 5 },
  ];
  const EXTERNAL = [
    { desc: 'Yeni kalıbı raftan alıp kalıp arabasıyla makinenin yanına getirmek', src: 's.79, s.104', lo: 2, hi: 10 },
    { desc: 'Sökülen eski kalıbı depoya (kalıphaneye) götürmek', src: 's.79, s.104', lo: 2, hi: 10 },
    { desc: 'Gerekli takım ve aparatları makinenin yanına hazırlamak', src: 's.84', lo: 2, hi: 8 },
    { desc: 'Bir sonraki partinin hammaddesini makinenin yanına getirmek', src: 's.81', lo: 2, hi: 10 },
    { desc: 'Önceki partinin bitmiş ürünlerini depoya taşımak', src: 's.81', lo: 2, hi: 10 },
    { desc: 'Gerekli parçaların hazır ve doğru yerde olduğunu checklist ile kontrol etmek', src: 's.85', lo: 1, hi: 5 },
  ];
  const CONVERT = [
    {
      desc: 'Makineye bağlanan yeni kalıbı makine üzerinde çalışma sıcaklığına kadar ısıtmak',
      how: 'kalıp, makine çalışırken ayrı bir ısıtıcıda önceden ısıtılır (ön ısıtma)',
      src: 'ilke s.86; ön ısıtma örneği notlarda yok', lo: 2, hi: 8,
    },
    {
      desc: 'Kalıp makineye konduktan sonra mapa ve cıvataları seçip kalıba takmak',
      how: 'mapa ve cıvatalar kalıp makine dışındayken önceden takılır (s.104 çizelgesinde "yeni kalıba mapa ve cıvata takılması" external sütununda)',
      src: 's.86, s.104', lo: 1, hi: 5,
    },
    {
      desc: 'Kalıbın merkez ve yükseklik ön ayarını makine tablasında yapmak',
      how: 'ön ayar, makine çalışırken ayrı bir ayar tezgâhında yapılır',
      src: 'ilke s.86', lo: 1, hi: 6,
    },
  ];

  // ------------------------------------------------------------------ saf çözüm
  function solve(P) {
    const sumOf = (pred) => P.acts.filter(pred).reduce((a, x) => a.add(x.t), F(0));
    const T0 = sumOf(() => true);
    const ext = sumOf((a) => a.type === 'ext');
    const T1 = sumOf((a) => a.type !== 'ext');
    const conv = sumOf((a) => a.type === 'conv');
    const T2 = T1.sub(conv);
    const red01 = T0.sub(T1).div(T0).mul(100);
    const red12 = T1.sub(T2).div(T1).mul(100);
    const red02 = T0.sub(T2).div(T0).mul(100);
    const gain = T0.sub(T2).mul(P.k);
    const cls = T2.lt(1) ? 'OTED' : T2.lt(10) ? 'SMED' : 'none';
    return { T0, ext, T1, conv, T2, red01, red12, red02, gain, cls };
  }

  // ------------------------------------------------------------------ rastgele parametre
  const halfIn = (rng, lo, hi) => F(rng.int(lo * 2, hi * 2)).div(2);
  function gen(rng) {
    const wantSmed = rng.chance(0.5);
    for (let tries = 0; tries < 3000; tries++) {
      const nInt = rng.int(3, 4), nConv = rng.int(1, 2), nExt = rng.int(2, 3);
      const acts = []
        .concat(rng.shuffle(INTERNAL).slice(0, nInt).map((a) => ({ desc: a.desc, src: a.src, type: 'int', t: halfIn(rng, a.lo, a.hi) })))
        .concat(rng.shuffle(CONVERT).slice(0, nConv).map((a) => ({ desc: a.desc, how: a.how, src: a.src, type: 'conv', t: halfIn(rng, a.lo, a.hi) })))
        .concat(rng.shuffle(EXTERNAL).slice(0, nExt).map((a) => ({ desc: a.desc, src: a.src, type: 'ext', t: halfIn(rng, a.lo, a.hi) })));
      const P = { acts: rng.shuffle(acts), k: rng.int(3, 15), machine: rng.pick(['bir preste', 'bir plastik enjeksiyon makinesinde', 'bir kalıplama presinde']) };
      const S = solve(P);
      if ((S.cls === 'SMED') !== wantSmed) continue;
      if (S.T2.eq(10) || S.T2.eq(1)) continue;
      if (!S.red01.isNice(2) || !S.red12.isNice(2) || !S.red02.isNice(2) || !S.gain.isNice(2)) continue;
      if (!S.T0.eq(S.T1.add(S.ext))) throw new Error('smed: total check');
      return P;
    }
    throw new Error('smed: uygun örnek bulunamadı');
  }

  // ------------------------------------------------------------------ viz
  const TYPE_TXT = { int: 'Internal', ext: 'External', conv: 'Internal (Stage 2: → External)' };
  function tableViz(P, reveal) {
    return {
      type: 'matrix',
      caption: 'Setup faaliyetleri (Stage 0 analizi, s.83)',
      corner: 'No',
      colLabels: reveal ? ['Faaliyet', 'Süre (dk)', 'Tür'] : ['Faaliyet', 'Süre (dk)'],
      rowLabels: P.acts.map((_, i) => i + 1),
      cells: P.acts.map((a) => [a.desc, d(a.t)].concat(reveal ? [reveal === 2 ? TYPE_TXT[a.type] : a.type === 'ext' ? 'External' : 'Internal'] : [])),
      cls: P.acts.map((a) => (reveal ? ['', '', a.type === 'ext' ? 'hl' : a.type === 'conv' && reveal === 2 ? 'sel' : ''] : ['', ''])),
    };
  }
  function stackViz(S, upto) {
    const rows = [{ label: 'Stage 0', segs: [{ v: S.T0.toNumber(), label: d(S.T0), cls: 's4' }], total: d(S.T0) + ' dk' }];
    if (upto >= 1) rows.push({ label: 'Stage 1', segs: [{ v: S.T2.toNumber(), label: d(S.T2), cls: 's1' }, { v: S.conv.toNumber(), label: d(S.conv), cls: 's2' }], total: d(S.T1) + ' dk' });
    if (upto >= 2) rows.push({ label: 'Stage 2', segs: [{ v: S.T2.toNumber(), label: d(S.T2), cls: 's1' }], total: d(S.T2) + ' dk' });
    return {
      type: 'stack',
      caption: 'Makinenin durduğu süre (setup süresi)',
      rows,
      max: S.T0.toNumber(),
      legend: [{ cls: 's4', label: 'ayrım yok' }, { cls: 's1', label: 'internal' }, { cls: 's2', label: "external'a çevrilebilir internal" }],
    };
  }

  function build(rng) {
    const P = gen(rng);
    const S = solve(P);
    const NOTE = '(notlarda sayısal örnek yok; kavramlar LEAN s.79–86)';
    const steps = [];
    const extIdx = P.acts.map((a, i) => (a.type === 'ext' ? i : -1)).filter((i) => i >= 0);
    const intList = P.acts.map((a, i) => (a.type !== 'ext' ? i + 1 : null)).filter(Boolean);
    const convActs = P.acts.filter((a) => a.type === 'conv');

    steps.push({
      kind: 'multi',
      prompt: '<b>Internal / external ayrımı.</b> Mevcut yöntemle, hangi faaliyetler <b>external</b> setup\'tır (makine çalışırken yapılabilir)?',
      options: P.acts.map((a, i) => ({ html: `${i + 1}. ${a.desc}`, correct: a.type === 'ext' })),
      keepOrder: true,
      hint: 'Internal: mounting/dismounting gibi yalnızca makine durduktan sonra yapılabilenler. External: kalıbı depoya taşımak, takılacak kalıbı makine yanına getirmek (LEAN s.79).',
      explain: `External: ${extIdx.map((i) => `${i + 1} (${P.acts[i].src})`).join(', ')} — makine çalışırken yapılabilir. Internal: ${intList.join(', ')} — kalıp makinedeyken / makine dururken yapılır (s.79, s.84: internal setup sırasında yalnızca gerekli işlemler, ör. kalıp sökme ve ayar).`,
      viz: tableViz(P, 1),
    });
    steps.push({
      kind: 'number',
      prompt: '<b>Stage 0.</b> Internal ve external ayrılmıyor: tüm faaliyetler makine durduktan sonra yapılıyor (s.80–81). Setup süresi (makinenin durduğu süre) nedir?',
      fields: [{ label: 'Stage 0 setup süresi (dk)', answer: S.T0 }],
      explain: `T<sub>0</sub> = ${P.acts.map((a) => d(a.t)).join(' + ')} = <b>${d(S.T0)} dk</b>. Stage 0'da kalıp taşıma, malzeme getirme gibi işler makine durunca başladığı için israf tekrar tekrar oluşur (s.81). ${NOTE}`,
      viz: [tableViz(P, 1), stackViz(S, 0)],
    });
    steps.push({
      kind: 'number',
      prompt: `<b>Stage 1.</b> Internal ve external ayrıldı: external faaliyetler (${extIdx.map((i) => i + 1).join(', ')}) makine çalışırken yapılıyor. Makine artık yalnızca internal faaliyetler (${intList.join(', ')}) için duruyor. Yeni setup süresi?`,
      fields: [{ label: 'Stage 1 setup süresi (dk)', answer: S.T1 }],
      hint: 'Setup süresi = makinenin durduğu süre = internal faaliyetlerin toplamı.',
      explain: `T<sub>1</sub> = ${P.acts.filter((a) => a.type !== 'ext').map((a) => d(a.t)).join(' + ')} = <b>${d(S.T1)} dk</b> (kontrol: T<sub>0</sub> − Σexternal = ${d(S.T0)} − ${d(S.ext)} = ${d(S.T1)}). Stage 1 SMED'in en önemli adımıdır (s.84); external işler için checklist kullanılır (s.85).`,
      viz: [tableViz(P, 1), stackViz(S, 1)],
    });
    steps.push({
      kind: 'number',
      prompt: `<b>Stage 1 kazancı.</b> Setup süresi ${d(S.T0)} dk'dan ${d(S.T1)} dk'ya indi. Yüzde azalma?`,
      fields: [{ label: 'Azalma, Stage 0 → 1 (%)', answer: S.red01, unit: '%' }],
      explain: `(${d(S.T0)} − ${d(S.T1)}) / ${d(S.T0)} × 100 = <b>${d(S.red01)}%</b>.`,
    });
    steps.push({
      kind: 'number',
      prompt: `<b>Stage 2: internal → external.</b> ${convActs.map((a) => `"${a.desc}" (${d(a.t)} dk) → ${a.how}`).join('; ')}. Stage 1 setup süresi ${d(S.T1)} dk idi. Yeni internal setup süresi?`,
      fields: [{ label: 'Stage 2 setup süresi (dk)', answer: S.T2 }],
      hint: 'Çevrilen faaliyet(ler) artık makine çalışırken yapılır → internal toplamdan düşülür.',
      explain: `T<sub>2</sub> = ${d(S.T1)} − ${convActs.map((a) => d(a.t)).join(' − ')} = <b>${d(S.T2)} dk</b>. Stage 2'de setup işlemleri yeniden incelenir ve adımları external'a çevirmenin yolları aranır (s.86; s.87 kalıp değişimi örneği). (${convActs.map((a) => a.src).join('; ')})`,
      viz: [tableViz(P, 2), stackViz(S, 2)],
    });
    const band = S.red12.ge(30) && S.red12.le(50);
    steps.push({
      kind: 'number',
      prompt: `<b>Stage 2 kazancı.</b> Setup süresi ${d(S.T1)} dk'dan ${d(S.T2)} dk'ya indi. Bu aşamadaki yüzde azalma?`,
      fields: [{ label: 'Azalma, Stage 1 → 2 (%)', answer: S.red12, unit: '%' }],
      explain: `(${d(S.T1)} − ${d(S.T2)}) / ${d(S.T1)} × 100 = <b>${d(S.red12)}%</b> — notlarda bu aşama için verilen tipik %30–50 aralığının ${band ? 'içinde' : S.red12.lt(30) ? 'altında' : 'üstünde'} (s.86). Stage 0'a göre toplam azalma ${d(S.red02)}%.`,
    });
    steps.push({
      kind: 'choice',
      prompt: `<b>Sınıflandırma.</b> Stage 2 sonunda setup süresi ${d(S.T2)} dk. Bu setup nasıl sınıflandırılır?`,
      options: [
        { html: 'Henüz SMED değil (≥ 10 dk)', correct: S.cls === 'none' },
        { html: 'SMED (< 10 dk; Single-Minute Exchange of Die)', correct: S.cls === 'SMED' },
        { html: 'OTED (< 1 dk; One-Touch Exchange of Die)', correct: S.cls === 'OTED' },
        { html: 'NOTED (otomatik setup)', correct: false },
      ],
      keepOrder: true,
      explain: S.cls === 'SMED'
        ? `${d(S.T2)} dk < 10 dk → SMED (s.77); ama ≥ 1 dk olduğu için OTED değil (s.78). NOTED otomatik setup demektir, süreye göre değil.`
        : `${d(S.T2)} dk ≥ 10 dk → henüz SMED değil (SMED < 10 dk, s.77). Stage 3'te radikal iyileştirmeler (paralel çalışan ekip, sıkmasız bağlama, kalıp standardizasyonu, s.88–103) gerekir.`,
    });
    steps.push({
      kind: 'number',
      prompt: `<b>Kapasite kazancı.</b> Makinede haftada <b>${P.k}</b> setup yapılıyor. Stage 0 (${d(S.T0)} dk) yerine Stage 2 (${d(S.T2)} dk) yöntemiyle haftada kaç dakika üretim süresi kazanılır?`,
      fields: [{ label: 'Kazanılan kapasite (dk/hafta)', answer: S.gain }],
      hint: '"Reducing setup times saves capacity" (s.75).',
      explain: `${P.k} × (${d(S.T0)} − ${d(S.T2)}) = ${P.k} × ${d(S.T0.sub(S.T2))} = <b>${d(S.gain)} dk/hafta</b>. Kısa setup daha küçük partilerle üretimi mümkün kılar: daha kısa lead time, hataların hızlı fark edilmesi, yer tasarrufu (s.75).`,
    });

    const statement = `<p>${P.machine.charAt(0).toUpperCase() + P.machine.slice(1)} kalıp değişimi (setup) için yapılan faaliyetler ve süreleri sağdaki tabloda (Stage 0 setup analizi, s.82–83). Setup süresi: önceki partinin son ürününün tamamlanmasından sonraki partinin ilk kabul edilebilir ürününün tamamlanmasına kadar geçen süre (s.75).</p>
      <p>SMED aşamalarını uygula: faaliyetleri internal/external olarak ayır, Stage 0–1–2 setup sürelerini hesapla, sonucu SMED/OTED olarak sınıflandır. <span class="muted">${NOTE}</span></p>
      <div class="model">Stage 0: ayrım yok → setup = Σ tüm faaliyetler
Stage 1: internal ↔ external ayrılır → setup = Σ internal
Stage 2: internal → external çevrilir → setup = Σ kalan internal
SMED &lt; 10 dk · OTED &lt; 1 dk · NOTED = otomatik</div>`;
    return {
      title: 'SMED: Setup Süresi Azaltma',
      statement,
      viz: tableViz(P, 0),
      steps,
      data: P,
      solution: `T<sub>0</sub> = ${d(S.T0)} dk → T<sub>1</sub> = ${d(S.T1)} dk (${d(S.red01)}% azalma) → T<sub>2</sub> = ${d(S.T2)} dk (${d(S.red12)}% azalma; ${S.cls === 'SMED' ? 'SMED' : 'henüz SMED değil'}); haftalık kazanç ${d(S.gain)} dk.`,
    };
  }

  IM.registerDrill({
    id: 'smed',
    topic: '2.6',
    title: 'SMED: Internal / External Setup',
    description: 'Setup faaliyetlerini internal/external olarak ayır; Stage 0, Stage 1 ve Stage 2 setup sürelerini ve yüzde azalmaları hesapla; SMED/OTED sınıflandırması ve haftalık kapasite kazancı (LEAN s.75–86).',
    solve,
    gen,
    generate: (rng) => build(rng),
  });
})();
