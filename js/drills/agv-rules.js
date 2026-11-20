/* 4.4 · AGV işletim kuralları — AGV s.18–22 (drill `agv-rules`). Notlarda sayısal örnek yok → notes seçeneği YOK;
   üretilen tablolar "(notlarda sayısal örnek yok; kurallar AGV s.20–22)" etiketlidir.
   Kurallar (notların yazımıyla):
     Vehicle dispatching (AGV s.20): RV = assign any vehicle randomly · NV = closest to the demand point ·
       LIV = remained idle for longest period · LUV = least utilization at demand time ("tries to equalize the work load on all vehicles").
     Station prioritizing (AGV s.21): RW = random station · STT/D = closest to an available vehicle (distance or travel time) ·
       MOQS = maximum number of unit loads in its output inventory · MROQS = minimum space remaining for outgoing inventory.
     Path selection (AGV s.22): RS = random · FV = a vehicle carrying a load has priority over an empty vehicle; among loaded vehicles
       assignment is random · CSR = vehicle responding to a critical station · CP = vehicle carrying a critical part.
   Adımlar: (a) NV, LIV, LUV seçimi + RV kavram + "iş yükünü eşitleyen kural (LUV)"; (b) STT/D, MOQS, MROQS; (c) FV, CSR, CP → 11 choice adımı.
   Kalite kapıları: her kriterde tek min/max (eşitlik yok), NV/LIV/LUV üç FARKLI araç, STT/D/MOQS/MROQS üç FARKLI istasyon.
     Path selection: 3 araç; varyant 1 = tek yüklü araç (kritik parça taşıyan), biri kritik istasyona giden boş araç, biri sıradan boş araç;
     varyant 2 = iki yüklü araç (biri kritik parça, biri kritik istasyona gidiyor) + bir boş araç → FV "yüklüler arasında rastgele".
     Kritik parça taşıyan araç her zaman yüklüdür (parça taşımak = yük).
   Dışa açık: IM.drills['agv-rules'].solve(P) -> { NV, LIV, LUV, STT, MOQS, MROQS, FV:{idx|null, among:[…]}, CSR, CP }, .gen(rng) */
(function () {
  const IM = window.IM;
  const NOTE = '(notlarda sayısal örnek yok; kurallar AGV s.20–22)';

  const argUnique = (arr, better) => {
    let best = 0, tie = false;
    for (let i = 1; i < arr.length; i++) {
      const k = better(arr[i], arr[best]);
      if (k > 0) { best = i; tie = false; } else if (k === 0) tie = true;
    }
    return tie ? -1 : best;
  };
  const minIdx = (arr) => argUnique(arr, (a, b) => b - a);
  const maxIdx = (arr) => argUnique(arr, (a, b) => a - b);

  function solve(P) {
    const V = P.vehicles, S = P.stations, W = P.path;
    const loaded = W.map((x, i) => (x.loaded ? i : -1)).filter((i) => i >= 0);
    const crS = W.map((x, i) => (x.critStation ? i : -1)).filter((i) => i >= 0);
    const crP = W.map((x, i) => (x.critPart ? i : -1)).filter((i) => i >= 0);
    return {
      NV: minIdx(V.map((x) => x.dist)),
      LIV: maxIdx(V.map((x) => x.idle)),
      LUV: minIdx(V.map((x) => x.util)),
      STT: minIdx(S.map((x) => x.tt)),
      MOQS: maxIdx(S.map((x) => x.queue)),
      MROQS: minIdx(S.map((x) => x.space)),
      FV: { idx: loaded.length === 1 ? loaded[0] : null, among: loaded },
      CSR: crS.length === 1 ? crS[0] : -1,
      CP: crP.length === 1 ? crP[0] : -1,
    };
  }

  function genVehicles(rng) {
    const n = rng.int(3, 4);
    for (let t = 0; t < 500; t++) {
      const V = [];
      for (let i = 0; i < n; i++) V.push({ dist: rng.int(2, 25) * 10, idle: rng.int(1, 30), util: rng.int(8, 19) * 5 });
      const R = solve({ vehicles: V, stations: [], path: [] });
      if (R.NV < 0 || R.LIV < 0 || R.LUV < 0) continue;
      if (new Set([R.NV, R.LIV, R.LUV]).size !== 3) continue;
      return V;
    }
    throw new Error('agv-rules: araç tablosu bulunamadı');
  }
  function genStations(rng) {
    const n = rng.int(3, 4);
    for (let t = 0; t < 500; t++) {
      const S = [];
      for (let i = 0; i < n; i++) S.push({ tt: rng.int(1, 12), queue: rng.int(0, 8), space: rng.int(0, 6) });
      const R = solve({ vehicles: [], stations: S, path: [] });
      if (R.STT < 0 || R.MOQS < 0 || R.MROQS < 0) continue;
      if (new Set([R.STT, R.MOQS, R.MROQS]).size !== 3) continue;
      return S;
    }
    throw new Error('agv-rules: istasyon tablosu bulunamadı');
  }
  function genPath(rng) {
    const variant = rng.pick([1, 2]);
    let W;
    if (variant === 1) W = [{ loaded: true, critStation: false, critPart: true }, { loaded: false, critStation: true, critPart: false }, { loaded: false, critStation: false, critPart: false }];
    else W = [{ loaded: true, critStation: false, critPart: true }, { loaded: true, critStation: true, critPart: false }, { loaded: false, critStation: false, critPart: false }];
    return { variant, path: rng.shuffle(W) };
  }

  function gen(rng) {
    const vehicles = genVehicles(rng);
    const stations = genStations(rng);
    const { variant, path } = genPath(rng);
    const veh0 = rng.int(1, 3); // araç numaraları: ör. AGV-2, AGV-3, AGV-4
    const stNames = rng.pick([['S1', 'S2', 'S3', 'S4'], ['P', 'Q', 'R', 'T'], ['M1', 'M2', 'M3', 'M4']]);
    const segment = rng.int(1, 12);
    return { vehicles, stations, path, variant, vNames: vehicles.map((x, i) => `AGV-${veh0 + i}`), sNames: stNames.slice(0, stations.length), pNames: ['V1', 'V2', 'V3'], segment };
  }

  const yes = (b) => (b ? 'Evet' : 'Hayır');
  function vTable(P, hl) {
    return {
      type: 'matrix',
      caption: 'Boş araçlar (talep anında)',
      corner: 'Araç',
      rowLabels: P.vNames,
      colLabels: ['Talep noktasına uzaklık (m)', 'Boşta bekleme (dk)', 'Kullanım oranı (%)'],
      cells: P.vehicles.map((x) => [x.dist, x.idle, x.util]),
      cls: P.vehicles.map((x, i) => [hl.NV === i ? 'hl' : '', hl.LIV === i ? 'hl' : '', hl.LUV === i ? 'hl' : '']),
    };
  }
  function sTable(P, hl) {
    return {
      type: 'matrix',
      caption: 'Aynı anda araç isteyen istasyonlar',
      corner: 'İstasyon',
      rowLabels: P.sNames,
      colLabels: ['Boş araca seyir süresi (dk)', 'Çıkış kuyruğundaki yük', 'Çıkış alanında kalan boş yer'],
      cells: P.stations.map((x) => [x.tt, x.queue, x.space]),
      cls: P.stations.map((x, i) => [hl.STT === i ? 'hl' : '', hl.MOQS === i ? 'hl' : '', hl.MROQS === i ? 'hl' : '']),
    };
  }
  function pTable(P, hl) {
    return {
      type: 'matrix',
      caption: `Aynı segmenti (segment ${P.segment}) isteyen araçlar`,
      corner: 'Araç',
      rowLabels: P.pNames,
      colLabels: ['Yüklü mü?', 'Kritik istasyona mı gidiyor?', 'Kritik parça taşıyor mu?'],
      cells: P.path.map((x) => [yes(x.loaded), yes(x.critStation), yes(x.critPart)]),
      cls: P.path.map((x, i) => [hl.FV != null && (hl.FV === i || (hl.FV === 'all' && x.loaded)) ? 'hl' : '', hl.CSR === i ? 'hl' : '', hl.CP === i ? 'hl' : '']),
    };
  }

  function build(rng) {
    const P = gen(rng);
    const R = solve(P);
    // bağımsız kontrol: seçilen indeksler sütunun gerçek min/max'ı ve tek
    const chk = (arr, idx, f) => idx >= 0 && arr.filter((v) => v === f(...arr)).length === 1 && arr[idx] === f(...arr);
    if (!chk(P.vehicles.map((x) => x.dist), R.NV, Math.min) || !chk(P.vehicles.map((x) => x.idle), R.LIV, Math.max) || !chk(P.vehicles.map((x) => x.util), R.LUV, Math.min)) throw new Error('agv-rules: dispatching kontrolü');
    if (!chk(P.stations.map((x) => x.tt), R.STT, Math.min) || !chk(P.stations.map((x) => x.queue), R.MOQS, Math.max) || !chk(P.stations.map((x) => x.space), R.MROQS, Math.min)) throw new Error('agv-rules: station kontrolü');
    const V = P.vNames, S = P.sNames, W = P.pNames;
    const vOpts = (correctIdx) => V.map((nm, i) => ({ html: nm, correct: i === correctIdx }));
    const sOpts = (correctIdx) => S.map((nm, i) => ({ html: nm, correct: i === correctIdx }));
    const steps = [];
    const hv = {};
    const vd = P.vehicles;
    // ---- (a) vehicle dispatching
    steps.push({
      kind: 'choice',
      prompt: `<b>(a) Vehicle dispatching.</b> Bir istasyon araç istiyor; boş araçlar tabloda. <b>Nearest vehicle (NV)</b> kuralına göre hangi araç atanır?`,
      options: vOpts(R.NV), keepOrder: true,
      hint: 'NV: talep noktasına en yakın araç.',
      explain: `NV: "Assign the vehicle that is closest to the demand point" (AGV s.20). Uzaklıklar ${vd.map((x, i) => `${V[i]} ${x.dist} m`).join(', ')} → en küçük <b>${V[R.NV]}</b> (${vd[R.NV].dist} m).`,
      vizDuring: vTable(P, hv),
      viz: vTable(P, Object.assign(hv, { NV: R.NV })),
    });
    steps.push({
      kind: 'choice',
      prompt: `<b>Longest idle vehicle (LIV)</b> kuralına göre hangi araç atanır? (NV ile ${V[R.NV]} seçilmişti.)`,
      options: vOpts(R.LIV), keepOrder: true,
      hint: 'LIV: en uzun süredir boşta bekleyen araç.',
      explain: `LIV: "The vehicle that has remained idle for longest period of time is assigned first" (AGV s.20). Boşta bekleme ${vd.map((x, i) => `${V[i]} ${x.idle} dk`).join(', ')} → en büyük <b>${V[R.LIV]}</b> (${vd[R.LIV].idle} dk).`,
      viz: vTable(P, Object.assign(hv, { LIV: R.LIV })),
    });
    steps.push({
      kind: 'choice',
      prompt: `<b>Least utilized vehicle (LUV)</b> kuralına göre hangi araç atanır?`,
      options: vOpts(R.LUV), keepOrder: true,
      hint: 'LUV: talep anında kullanım oranı en düşük araç.',
      explain: `LUV: "The vehicle with least utilization at the demand time is assigned next" (AGV s.20). Kullanım ${vd.map((x, i) => `${V[i]} ${x.util}%`).join(', ')} → en küçük <b>${V[R.LUV]}</b> (${vd[R.LUV].util}%). Aynı tabloda üç kural üç farklı araç seçti: kural seçimi sonucu değiştirir.`,
      viz: vTable(P, Object.assign(hv, { LUV: R.LUV })),
    });
    steps.push({
      kind: 'choice',
      prompt: `<b>Random vehicle (RV)</b> kuralı bu tabloda hangi aracı seçer?`,
      options: [
        { html: 'Herhangi bir aracı rastgele; tablodaki uzaklık, bekleme ve kullanım değerlerine bakılmaz', correct: true },
        { html: `Talebe en yakın aracı (${V[R.NV]})`, correct: false },
        { html: `Kullanımı en düşük aracı (${V[R.LUV]})`, correct: false },
        { html: `En uzun süredir boşta olan aracı (${V[R.LIV]})`, correct: false },
      ],
      explain: 'RV: "Assign any vehicle randomly" (AGV s.20). Bu kural tablodaki verilere bakmaz; tek doğru "rastgele" cevabıdır.',
    });
    steps.push({
      kind: 'choice',
      prompt: 'Hangi vehicle dispatching kuralı tüm araçlardaki <b>iş yükünü eşitlemeye</b> çalışır?',
      options: [
        { html: 'Least utilized vehicle (LUV)', correct: true },
        { html: 'Nearest vehicle (NV)', correct: false },
        { html: 'Longest idle vehicle (LIV)', correct: false },
        { html: 'Random vehicle (RV)', correct: false },
      ],
      explain: 'AGV s.20: LUV "tries to equalize the work load on all vehicles". LIV de boştaki aracı seçer ama ölçütü bekleme süresidir, kullanım oranı değil; NV seyir süresini kısaltmaya yöneliktir.',
    });
    // ---- (b) station prioritizing
    const sd = P.stations;
    const hs = {};
    steps.push({
      kind: 'choice',
      prompt: `<b>(b) Station prioritizing.</b> Birden çok istasyon aynı anda AGV istiyor (tablo). <b>Shortest travel time/distance (STT/D)</b> kuralına göre araç hangi istasyona gönderilir?`,
      options: sOpts(R.STT), keepOrder: true,
      hint: 'STT/D: boş araca en yakın (seyir süresi ya da mesafe) istasyon.',
      explain: `STT/D: "Assign a station that is closest to an available vehicle based on either distance or travel time" (AGV s.21). Seyir süreleri ${sd.map((x, i) => `${S[i]} ${x.tt} dk`).join(', ')} → <b>${S[R.STT]}</b> (${sd[R.STT].tt} dk).`,
      vizDuring: sTable(P, hs),
      viz: sTable(P, Object.assign(hs, { STT: R.STT })),
    });
    steps.push({
      kind: 'choice',
      prompt: `<b>Maximum outgoing queue size (MOQS)</b> kuralına göre hangi istasyon önce?`,
      options: sOpts(R.MOQS), keepOrder: true,
      hint: 'MOQS: çıkış envanterinde en çok yük bekleyen istasyon.',
      explain: `MOQS: "Dispatch a vehicle to a station with maximum number of unit loads in its output inventory" (AGV s.21). Kuyruklar ${sd.map((x, i) => `${S[i]} ${x.queue}`).join(', ')} → <b>${S[R.MOQS]}</b> (${sd[R.MOQS].queue} yük).`,
      viz: sTable(P, Object.assign(hs, { MOQS: R.MOQS })),
    });
    steps.push({
      kind: 'choice',
      prompt: `<b>Minimum remaining outgoing queue space (MROQS)</b> kuralına göre hangi istasyon önce?`,
      options: sOpts(R.MROQS), keepOrder: true,
      hint: 'MROQS: çıkış alanında en az boş yer kalan istasyon (en çok yük bekleyen değil!).',
      explain: `MROQS: "Dispatch a vehicle to a station that has minimum space remaining in the space for outgoing inventory" (AGV s.21). Kalan boş yer ${sd.map((x, i) => `${S[i]} ${x.space}`).join(', ')} → <b>${S[R.MROQS]}</b> (${sd[R.MROQS].space}). MOQS kuyruktaki yük sayısına, MROQS kalan boş alana bakar; bu yüzden farklı istasyon seçebilirler (burada ${S[R.MOQS]} ≠ ${S[R.MROQS]}).`,
      viz: sTable(P, Object.assign(hs, { MROQS: R.MROQS })),
    });
    // ---- (c) path selection
    const hp = {};
    const pw = P.path;
    const fvOpts = W.map((nm, i) => ({ html: nm, correct: R.FV.idx === i }));
    const among = R.FV.among.map((i) => W[i]);
    fvOpts.push({ html: P.variant === 2 ? `${among.join(' ile ')} arasından rastgele (ikisi de yüklü)` : 'Yüklü araçlar arasından rastgele', correct: R.FV.idx == null });
    if (fvOpts.filter((o) => o.correct).length !== 1) throw new Error('agv-rules: FV tek cevap değil');
    steps.push({
      kind: 'choice',
      prompt: `<b>(c) Path selection.</b> Segment ${P.segment} aynı anda tablodaki üç araç tarafından isteniyor. <b>Full vehicle (FV)</b> kuralına göre segment kime verilir?`,
      options: fvOpts, keepOrder: true,
      hint: 'FV: yük taşıyan araç boş araca göre önceliklidir; yüklü araçlar arasında atama rastgeledir.',
      explain: `FV: "A vehicle carrying a load has priority over an empty vehicle. Among the loaded vehicles, assignment is random" (AGV s.22). Yüklü araç(lar): ${among.join(', ')} → ${R.FV.idx != null ? `<b>${W[R.FV.idx]}</b> (tek yüklü araç)` : `<b>${among.join(' ile ')} arasından rastgele</b>; boş araç ${W[pw.findIndex((x) => !x.loaded)]} beklemeli`}.`,
      vizDuring: pTable(P, hp),
      viz: pTable(P, Object.assign(hp, { FV: R.FV.idx != null ? R.FV.idx : 'all' })),
    });
    steps.push({
      kind: 'choice',
      prompt: `<b>Critical station response (CSR)</b> kuralına göre segment ${P.segment} kime verilir?`,
      options: W.map((nm, i) => ({ html: nm, correct: i === R.CSR })), keepOrder: true,
      explain: `CSR: "A vehicle responding to a critical station has priority" (AGV s.22) → <b>${W[R.CSR]}</b>${pw[R.CSR].loaded ? '' : ' (boş olsa bile)'}.`,
      viz: pTable(P, Object.assign(hp, { CSR: R.CSR })),
    });
    steps.push({
      kind: 'choice',
      prompt: `<b>Critical part (CP)</b> kuralına göre segment ${P.segment} kime verilir?`,
      options: W.map((nm, i) => ({ html: nm, correct: i === R.CP })), keepOrder: true,
      explain: `CP: "A vehicle carrying a critical part has the priority" (AGV s.22) → <b>${W[R.CP]}</b>. Kritik parça taşıyan araç zaten yüklüdür.`,
      viz: pTable(P, Object.assign(hp, { CP: R.CP })),
    });

    return {
      title: 'AGV işletim kuralları',
      statement: `<p>Üç ayrı karar durumu için AGV işletim kurallarını uygula ${NOTE}.</p>
        <p><b>(a)</b> Bir istasyon araç istiyor; ${V.length} boş araç var. <b>(b)</b> ${S.length} istasyon aynı anda araç istiyor. <b>(c)</b> Üç araç aynı yol segmentini aynı anda istiyor.</p>
        <p class="muted">Tablolar sağda; her adımda yalnızca sorulan kuralı uygula.</p>`,
      viz: [vTable(P, {}), sTable(P, {}), pTable(P, {})],
      steps,
      data: P,
      solution: `(a) NV → ${V[R.NV]}, LIV → ${V[R.LIV]}, LUV → ${V[R.LUV]}; (b) STT/D → ${S[R.STT]}, MOQS → ${S[R.MOQS]}, MROQS → ${S[R.MROQS]}; (c) FV → ${R.FV.idx != null ? W[R.FV.idx] : among.join(' / ') + ' (rastgele)'}, CSR → ${W[R.CSR]}, CP → ${W[R.CP]}.`,
    };
  }

  IM.registerDrill({
    id: 'agv-rules',
    topic: '4.4',
    title: 'AGV işletim kuralları',
    description: `Vehicle dispatching (NV/LIV/LUV/RV), station prioritizing (STT/D, MOQS, MROQS) ve path selection (FV, CSR, CP) kurallarını tablolara uygula ${NOTE}.`,
    solve,
    gen,
    generate: build,
  });
})();
