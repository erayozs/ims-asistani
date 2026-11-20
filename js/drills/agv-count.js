/* 4.3 · Gerekli AGV sayısının belirlenmesi — AGV s.14–17 (drill `agv-count`).
   Notlardaki çözüm adımları (AGV s.16):
     1. depodan her hücreye gidiş-dönüş seyir süresi, 2. yükleme/boşaltma süresi eklenir, 3. sefer sıklığı ile toplam araç kullanım süresi,
     4. traffic congestion factor (genelde 0.85) ile BÖLÜNÜR → toplam yük (dk), 5. toplam yük ÷ 60 dk → araç sayısı, ⌈⌉.
   Formül (AGV s.17 yazımı):  hücre i saatlik kullanımı = [(d + d) × f / v] + (f × t × 2)
     d = depo uzaklığı (m), f = saatlik sefer, t = yükleme/boşaltma süresi (dk), v = AGV hızı (m/dk; normalde 60–80 m/dk, AGV s.15).
     Toplam = Σ kullanım;  toplam yük = Toplam / c;  araç sayısı = toplam yük / 60;  N = ⌈araç sayısı⌉.
   Notes seçeneği (AGV s.15–17): (90,14,2) (150,16,3) (180,5,3) (240,8,2), v = 60, c = 0.85 → 98, 176, 60, 96; 430;
     430 / 0.85 = 505.88 (slayt 505'e yuvarlıyor; alan tol'u ikisini de kabul eder); 505.88 / 60 = 8.43 (505 / 60 = 8.42 de kabul); ⌈⌉ = 9.
   Kalite kapıları (rastgele): 3–5 hücre, v ∈ {60, 70, 75, 80}, c ∈ {0.80, 0.85, 0.90} (önce seçilir, sonra örnek reddedilir);
     tüm ara değerler (seyir, kullanım, toplam, yük, araç sayısı) ≤ 2 ondalık; araç sayısı tam sayı DEĞİL ve 2–12 arası;
     en çok kullanan hücre tek (eşitlik yok). Toplam iki bağımsız yoldan: Σ kullanım = 2·Σ(d·f)/v + 2·Σ(f·t).
   Dışa açık: IM.drills['agv-count'].solve(P) -> { travel[], lul[], use[], total, load, veh, N, maxIdx }, .gen(rng), .NOTES */
(function () {
  const IM = window.IM;
  const F = IM.F;
  const d = (x) => IM.util.d(x);
  const NOTES = { cells: [{ d: 90, f: 14, t: 2 }, { d: 150, f: 16, t: 3 }, { d: 180, f: 5, t: 3 }, { d: 240, f: 8, t: 2 }], v: 60, c: '0.85' };

  function solve(P) {
    const v = F(P.v), c = F(P.c);
    const travel = P.cells.map((x) => F(x.d + x.d).mul(x.f).div(v));
    const lul = P.cells.map((x) => F(x.f * x.t * 2));
    const use = travel.map((tr, i) => tr.add(lul[i]));
    const total = use.reduce((a, b) => a.add(b), F(0));
    // bağımsız yol: 2·Σ(d·f)/v + 2·Σ(f·t)
    const sdf = P.cells.reduce((a, x) => a + x.d * x.f, 0), sft = P.cells.reduce((a, x) => a + x.f * x.t, 0);
    const total2 = F(2 * sdf).div(v).add(2 * sft);
    if (!total.eq(total2)) throw new Error('agv-count: toplam iki yoldan farklı');
    const load = total.div(c);
    const veh = load.div(60);
    const N = veh.ceil();
    let maxIdx = 0, maxTie = false;
    use.forEach((u, i) => {
      if (i === 0) return;
      const k = u.cmp(use[maxIdx]);
      if (k > 0) { maxIdx = i; maxTie = false; } else if (k === 0) maxTie = true;
    });
    return { travel, lul, use, total, load, veh, N: F(N), maxIdx, maxTie };
  }

  function gen(rng) {
    const cs = ['0.80', '0.85', '0.90'];
    const c = rng.pick(cs);
    for (let tries = 0; tries < 6000; tries++) {
      const n = rng.int(3, 5);
      const v = rng.pick([60, 70, 75, 80]);
      const cells = [];
      for (let i = 0; i < n; i++) cells.push({ d: rng.int(3, 30) * 10, f: rng.int(3, 20), t: rng.int(1, 4) });
      const P = { cells, v, c };
      const R = solve(P);
      if (R.maxTie) continue;
      const vals = [...R.travel, ...R.use, R.total, R.load, R.veh];
      if (!vals.every((x) => x.isNice(2))) continue;
      if (R.veh.isInt()) continue;
      if (R.veh.lt(2) || R.veh.gt(12)) continue;
      // okunaklılık: seyir süreleri en çok 1 ondalık
      if (!R.travel.every((x) => x.isNice(1))) continue;
      return P;
    }
    throw new Error('uygun AGV sayısı örneği bulunamadı');
  }

  function table(P, R, show) {
    // show: {travel, use, total}
    const rows = P.cells.map((x, i) => [
      x.d, x.f, x.t,
      show.travel ? d(R.travel[i]) : '?',
      show.use ? d(R.lul[i]) : '?',
      show.use ? d(R.use[i]) : '?',
    ]);
    const cls = P.cells.map((x, i) => ['', '', '', '', '', show.max && i === R.maxIdx ? 'hl' : '']);
    rows.push(['', '', '', '', 'Toplam', show.total ? d(R.total) : '?']);
    cls.push(['', '', '', '', '', show.total ? 'sel' : '']);
    return {
      type: 'matrix',
      caption: `AGV veri tablosu ve saatlik kullanım (v = ${P.v} m/dk)`,
      corner: 'Hücre',
      rowLabels: P.cells.map((x, i) => i + 1).concat(['']),
      colLabels: ['d (m)', 'f (sefer/h)', 't (dk)', '(d + d)·f / v (dk)', 'f·t·2 (dk)', 'Kullanım (dk/h)'],
      cells: rows,
      cls,
    };
  }

  const CONCEPTS = [
    (P, R) => ({
      prompt: `Toplam kullanım ${d(R.total)} dk/h iken neden traffic congestion factor c = ${d(P.c)} ile <b>bölüyoruz</b>?`,
      options: [
        { html: 'Araçlar kavşak, bloke ve bekleme nedeniyle zamanın ancak c kadarında verimli çalışır; gerekli süre artar, bu yüzden c ile bölünür', correct: true },
        { html: 'Trafik sıkışıklığı gerekli süreyi azaltır; c ile bölmek yükü küçültür', correct: false },
        { html: 'c ile bölmek ile c ile çarpmak aynı sonucu verir', correct: false },
        { html: 'c, yükleme/boşaltma süresinin seyir süresine oranıdır', correct: false },
      ],
      explain: `c &lt; 1 olduğundan toplam / c &gt; toplam: ${d(R.total)} / ${d(P.c)} = ${d(R.load)} dk. Çarpmak (${d(R.total)} × ${d(P.c)}) gerekli araç sayısını yanlış biçimde azaltırdı (AGV s.16, adım 4).`,
    }),
    (P, R) => ({
      prompt: `Diğer her şey aynı kalırken traffic congestion factor c = ${d(P.c)} değerinden daha <b>küçük</b> bir değere düşerse (daha yoğun trafik) gerekli araç sayısı nasıl değişir?`,
      options: [
        { html: 'Artar (ya da aynı kalır): toplam yük = toplam / c büyür', correct: true },
        { html: 'Azalır: toplam yük = toplam × c küçülür', correct: false },
        { html: 'Değişmez: c yalnızca seyir süresini etkiler', correct: false },
        { html: 'Değişmez: araç sayısı yalnızca hıza bağlıdır', correct: false },
      ],
      explain: `Toplam yük = toplam / c; c küçüldükçe bölüm büyür, araç sayısı (yük / 60) artar; ⌈⌉ nedeniyle tam sayı karar bazen aynı kalabilir (AGV s.16–17).`,
    }),
    (P, R) => ({
      prompt: `Hücre kullanımında yükleme/boşaltma terimi neden <b>f × t × 2</b> biçiminde (2 ile çarpılmış) yazılır?`,
      options: [
        { html: 'Her seferde depoda yükleme ve hücrede boşaltma olmak üzere iki işlem yapılır', correct: true },
        { html: 'Gidiş-dönüş seyir iki kez sayıldığı için', correct: false },
        { html: 'Traffic congestion factor için emniyet payı olarak', correct: false },
        { html: 'Her hücreye iki araç gönderildiği için', correct: false },
      ],
      explain: `t yükleme/boşaltma süresidir; her seferde bir yükleme ve bir boşaltma → f·t·2 (AGV s.17: ör. hücre 1 için 14 × 2 × 2 = 56 dk). Gidiş-dönüş ise seyir teriminde (d + d) ile hesaba katılır.`,
    }),
  ];

  function build(rng, opts) {
    opts = opts || {};
    const isNotes = !!opts.notes;
    const P = isNotes ? NOTES : gen(rng);
    const R = solve(P);
    const n = P.cells.length;
    const cLab = (i) => `Hücre ${i + 1}`;
    const steps = [];
    const S0 = {}, S1 = { travel: true }, S2 = { travel: true, use: true }, S3 = Object.assign({ max: true }, S2), S4 = Object.assign({ total: true }, S3);
    const travelLines = P.cells.map((x, i) => `${cLab(i)}: (${x.d} + ${x.d}) × ${x.f} / ${P.v} = <b>${d(R.travel[i])}</b>`).join('<br>');
    steps.push({
      kind: 'number',
      prompt: `<b>1. Gidiş-dönüş seyir süresi.</b> Her hücre için depo → hücre → depo seyrinin saatlik toplam süresini hesapla: (d + d) × f / v (dk/h), v = ${P.v} m/dk.`,
      fields: P.cells.map((x, i) => ({ label: `${cLab(i)} seyir (dk/h)`, answer: R.travel[i] })),
      hint: 'Gidiş-dönüş mesafe (d + d) metre; saatte f sefer; hız v m/dk → (d + d)·f / v dakika.',
      explain: `${travelLines}<br>(AGV s.16 adım 1 ve 3; AGV s.17 yazımı)`,
      vizDuring: table(P, R, S0),
      viz: table(P, R, S1),
    });
    const useLines = P.cells.map((x, i) => `${cLab(i)}: ${d(R.travel[i])} + (${x.f} × ${x.t} × 2) = ${d(R.travel[i])} + ${d(R.lul[i])} = <b>${d(R.use[i])}</b>`).join('<br>');
    steps.push({
      kind: 'number',
      prompt: `<b>2. Saatlik AGV kullanımı.</b> Seyir süreleri ${P.cells.map((x, i) => `${cLab(i)} = ${d(R.travel[i])}`).join(', ')} dk/h. Bunlara yükleme/boşaltma süresini (f × t × 2) ekleyerek her hücrenin saatlik AGV kullanımını (dk/h) bul.`,
      fields: P.cells.map((x, i) => ({ label: `${cLab(i)} kullanım (dk/h)`, answer: R.use[i] })),
      hint: 'Her seferde depoda yükleme ve hücrede boşaltma vardır → f·t·2.',
      explain: `${useLines}<br>(AGV s.16 adım 2–3; s.17)`,
      viz: table(P, R, S2),
    });
    steps.push({
      kind: 'choice',
      prompt: `<b>3.</b> Saatlik kullanımlar ${P.cells.map((x, i) => `${cLab(i)} = ${d(R.use[i])}`).join(', ')} dk/h. AGV zamanını en çok hangi hücre kullanıyor?`,
      options: P.cells.map((x, i) => ({ html: cLab(i), correct: i === R.maxIdx })),
      keepOrder: true,
      explain: `En büyük kullanım ${cLab(R.maxIdx)}: ${d(R.use[R.maxIdx])} dk/h. Uzaklık tek başına belirleyici değildir; sefer sıklığı f ve yükleme/boşaltma süresi de kullanımı belirler.`,
      viz: table(P, R, S3),
    });
    steps.push({
      kind: 'number',
      prompt: `<b>4. Toplam kullanım.</b> Hücre kullanımlarını topla (dk/h).`,
      fields: [{ label: 'Toplam kullanım (dk/h)', answer: R.total }],
      explain: `${R.use.map(d).join(' + ')} = <b>${d(R.total)}</b> dk/h (AGV s.17: Total).`,
      viz: table(P, R, S4),
    });
    steps.push({
      kind: 'number',
      prompt: `<b>5. Toplam yük.</b> Toplam kullanım ${d(R.total)} dk/h. Traffic congestion factor c = ${d(P.c)} ile toplam gerekli süreyi (toplam yük, dk) bul.`,
      fields: [isNotes ? { label: 'Toplam yük (dk)', answer: R.load, tol: 0.9 } : { label: 'Toplam yük (dk)', answer: R.load }],
      hint: 'c &lt; 1: araçlar trafik nedeniyle zamanın yalnızca c kadarında verimlidir → c ile BÖL (çarpma).',
      explain: `Toplam yük = ${d(R.total)} / ${d(P.c)} = <b>${d(R.load)}</b> dk${isNotes ? ' (slayt 505\'e yuvarlıyor; 430 / 0.85 = 505.88)' : ''} (AGV s.16 adım 4).`,
    });
    steps.push({
      kind: 'number',
      prompt: `<b>6. Araç sayısı.</b> Toplam yük ${d(R.load)} dk${isNotes ? ' (slayt: 505)' : ''}. Bir AGV saatte 60 dk çalışabilir: gerekli araç sayısını (kesirli) hesapla.`,
      fields: [isNotes ? { label: 'Araç sayısı (kesirli)', answer: R.veh, tol: 0.015 } : { label: 'Araç sayısı (kesirli)', answer: R.veh }],
      explain: `${d(R.load)} / 60 = <b>${d(R.veh)}</b>${isNotes ? ' (slayt: 505 / 60 = 8.43; tam olarak 505 / 60 = 8.42, 505.88 / 60 = 8.43)' : ''} (AGV s.16 adım 5).`,
    });
    steps.push({
      kind: 'number',
      prompt: `<b>7. Tam sayı karar.</b> Gerekli araç sayısı ${d(R.veh)}. Kaç AGV gerekir?`,
      fields: [{ label: 'AGV sayısı N', answer: R.N }],
      hint: 'Kesirli araç olmaz; yükü karşılamak için yukarı yuvarla (⌈⌉).',
      explain: `N = ⌈${d(R.veh)}⌉ = <b>${R.N.show()}</b> AGV. Aşağı yuvarlamak (${R.N.sub(1).show()}) saatlik yükü karşılamaz (AGV s.17: 8.43 ≅ 9).`,
    });
    const cq = rng.pick(CONCEPTS)(P, R);
    steps.push({ kind: 'choice', prompt: `<b>8. Yorum.</b> ${cq.prompt}`, options: cq.options, explain: cq.explain });

    const dataRows = P.cells.map((x, i) => `<tr><td>${i + 1}</td><td>${x.d}</td><td>${x.f}</td><td>${x.t}</td></tr>`).join('');
    return {
      title: isNotes ? 'Gerekli AGV sayısı (AGV s.15–17 örneği)' : 'Gerekli AGV sayısı',
      statement: `<p>Hücresel bir yerleşimde ${n} hücreye merkezi depodan AGV ile malzeme taşınıyor. Her hücre için depo uzaklığı d, saatlik sefer sayısı f ve yükleme/boşaltma süresi t aşağıda. AGV hızı v = <b>${P.v} m/dk</b>, traffic congestion factor c = <b>${d(P.c)}</b>.</p>
        <table><tr><th>Hücre</th><th>d (m)</th><th>f (sefer/h)</th><th>t (dk)</th></tr>${dataRows}</table>
        <p>Notlardaki adımlarla (AGV s.16) gerekli AGV sayısını bul.</p>
        <div class="model">kullanım<sub>i</sub> = [(d + d) × f / v] + (f × t × 2)
toplam yük = Σ kullanım / c   ·   araç sayısı = toplam yük / 60   ·   N = ⌈araç sayısı⌉</div>`,
      viz: table(P, R, S0),
      steps,
      data: { cells: P.cells.map((x) => Object.assign({}, x)), v: P.v, c: P.c, notes: isNotes },
      solution: `Kullanımlar ${R.use.map(d).join(', ')} dk/h → toplam ${d(R.total)}; toplam yük ${d(R.total)} / ${d(P.c)} = ${d(R.load)} dk; ${d(R.load)} / 60 = ${d(R.veh)} → <b>${R.N.show()} AGV</b>.`,
    };
  }

  IM.registerDrill({
    id: 'agv-count',
    topic: '4.3',
    title: 'Gerekli AGV sayısı',
    description: 'Hücre verilerinden (uzaklık, sefer sıklığı, yükleme/boşaltma) saatlik AGV kullanımı, traffic congestion factor ile toplam yük ve ⌈⌉ ile araç sayısı.',
    options: [{ key: 'notes', label: 'Ders notundaki örneği kullan (4 hücre, v = 60 m/dk, c = 0.85; AGV s.15–17)', type: 'checkbox', default: false }],
    solve,
    gen,
    NOTES,
    generate: build,
  });
})();
