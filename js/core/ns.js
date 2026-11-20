/* Global namespace + topic metadata + registries.
   Loaded FIRST. All other scripts attach to window.IM. Classic scripts (no ES modules) so
   index.html works when opened directly from disk (file://).

   Kapsam: İTÜ Computer Integrated Manufacturing Systems (IMS) — yalnızca kullanıcının verdiği ders dosyaları:
     INT  = "introduction to CIM.ppt"            (14 slayt)   · syllabus Hafta 1
     WHEN = "when CIM.ppt"                        (5 slayt)    · syllabus Hafta 2
     LEAN = "Lean Manufacturing.pdf"              (199 sayfa)  · syllabus Hafta 2–3
     FMS  = "Traditional_FMS comparison.ppt"      (19 slayt)   · syllabus Hafta 4
     AGV  = "automated guided vehicles.ppt"       (29 slayt)   · syllabus Hafta 6
     CNC  = "CNC_machine tools.pptx"              (29 slayt)   · syllabus Hafta 7
   Kapsam DIŞI (dosyası verilmedi → hiçbir içerik yok): Robots in CIM (Hafta 5), Modern Measurement Techniques,
   Manual CNC programming ve sonrası (CAD/CAM, CAQ, CAPP, conveyors, AS/RS, MES, Industry 4.0), Groover'ın
   notlarda olmayan formülleri.
   'page' alanı: "<DOSYA> s.<a>–<b>" — ppt dosyalarında slayt numarası, PDF'te sayfa numarası. */
(function () {
  const IM = (window.IM = window.IM || {});

  // Dosya kodu -> görünen ad (app.js pageLabel)
  IM.sources = {
    INT: 'Introduction to CIM',
    WHEN: 'When CIM',
    LEAN: 'Lean Manufacturing',
    FMS: 'Traditional–FMS comparison',
    AGV: 'AGV',
    CNC: 'CNC Machine Tools',
  };

  // drills: ids of generated exercises shown on the topic page (registered by js/drills/*.js)
  IM.topics = [
    // ---- Bölüm 1 · CIM'e Giriş (Hafta 1–2)
    { id: '1.1', ch: 1, title: 'Üretim, performans ölçütleri ve CIM tanımı', page: 'INT s.1–11', drills: [] },
    { id: '1.2', ch: 1, title: 'Ürün yaşam döngüsü zaman analizi (TTLC, TLC)', page: 'INT s.12–14', drills: ['tlc-time'] },
    { id: '1.3', ch: 1, title: 'CIM ne zaman uygulanmalı? (When to apply CIM)', page: 'WHEN s.1–5', drills: [] },
    // ---- Bölüm 2 · Lean Manufacturing (Hafta 2–3)
    { id: '2.1', ch: 2, title: 'Üretim sistemi parametreleri (takt time, capacity, service level)', page: 'LEAN s.1–3', drills: ['lean-params'] },
    { id: '2.2', ch: 2, title: 'İsraf (waste), muda–muri–mura ve lean araçları', page: 'LEAN s.4–15', drills: [] },
    { id: '2.3', ch: 2, title: 'Değer akışı haritalama (Value Stream Mapping)', page: 'LEAN s.16–25', drills: ['vsm'] },
    { id: '2.4', ch: 2, title: 'Yerleşim planlama ve hücresel üretim (Cellular manufacturing)', page: 'LEAN s.26–44', drills: [] },
    { id: '2.5', ch: 2, title: '5S', page: 'LEAN s.45–73', drills: [] },
    { id: '2.6', ch: 2, title: 'Hazırlık süresi azaltma (SMED)', page: 'LEAN s.74–104', drills: ['smed'] },
    { id: '2.7', ch: 2, title: 'Push/pull sistemler ve Kanban', page: 'LEAN s.105–130', drills: ['kanban', 'mrp-graphic'] },
    { id: '2.8', ch: 2, title: 'Kaizen, görsel yönetim ve Poka-Yoke', page: 'LEAN s.131–161', drills: [] },
    { id: '2.9', ch: 2, title: 'Bakım yönetimi ve TPM', page: 'LEAN s.162–182', drills: [] },
    { id: '2.10', ch: 2, title: 'Bakım performansı ve OEE', page: 'LEAN s.183–199', drills: ['oee'] },
    // ---- Bölüm 3 · FMS ve Ekonomik Karşılaştırma (Hafta 4)
    { id: '3.1', ch: 3, title: 'Esnek üretim sistemi (FMS) yapısı ve çalışma sistematiği', page: 'FMS s.1–4', drills: [] },
    { id: '3.2', ch: 3, title: 'Doğrudan maliyetler, MLT ve makine–iş parçası zaman analizi', page: 'FMS s.5–10', drills: ['fms-mlt'] },
    { id: '3.3', ch: 3, title: 'Dolaylı maliyetler, belirsizlik ve duyarlılık (Yo, TIMO)', page: 'FMS s.11–19', drills: [] },
    // ---- Bölüm 4 · Otomatik Kılavuzlu Araçlar (AGV) (Hafta 6)
    { id: '4.1', ch: 4, title: 'AGV tanımı, kapasite, avantajlar ve türler', page: 'AGV s.1–9', drills: [] },
    { id: '4.2', ch: 4, title: 'Kılavuzlama, güvenlik ve batarya yönetimi', page: 'AGV s.10–13', drills: [] },
    { id: '4.3', ch: 4, title: 'Gerekli AGV sayısının belirlenmesi', page: 'AGV s.14–17', drills: ['agv-count'] },
    { id: '4.4', ch: 4, title: 'AGV işletim kuralları (dispatching, station priority, path selection)', page: 'AGV s.18–22', drills: ['agv-rules'] },
    { id: '4.5', ch: 4, title: 'AGV sisteminin simülasyonu', page: 'AGV s.23–29', drills: ['agv-sim'] },
    // ---- Bölüm 5 · CNC Tezgâhları (Hafta 7)
    { id: '5.1', ch: 5, title: 'CNC tezgâhlarının özellikleri, bileşenleri ve çalışma sistematiği', page: 'CNC s.1–16', drills: [] },
    { id: '5.2', ch: 5, title: 'CNC torna, kontrol ünitesi ve tezgâh seçim kriterleri', page: 'CNC s.17–29', drills: [] },
  ];
  // Kart başlıkları 'Bölüm N · Ad' biçimine bağımlı (app.js split(' · '))
  IM.chapters = {
    1: "Bölüm 1 · CIM'e Giriş",
    2: 'Bölüm 2 · Lean Manufacturing',
    3: 'Bölüm 3 · FMS ve Ekonomik Karşılaştırma',
    4: 'Bölüm 4 · Otomatik Kılavuzlu Araçlar (AGV)',
    5: 'Bölüm 5 · CNC Tezgâhları',
  };
  IM.topicLabel = (t) => t.id;
  IM.topicById = (id) => IM.topics.find((t) => t.id === id);

  // ---- Content registries (filled by js/content/*.js)
  // summaries[topicId] = html string
  // concepts[topicId]  = [{ q, options:[html], answer: idx | [idx...], explain, hint?, keepOrder? }]
  // cheatsheet         = html string (cheatsheet.js tanımlar; bölüm dosyaları += ile ekler)
  IM.content = { summaries: {}, concepts: {}, cheatsheet: '' };

  // ---- Drill registry (filled by js/drills/*.js)
  // IM.registerDrill({ id, topic, title, description, options?:[...], generate(rng, opts) -> Exercise })
  IM.drills = {};
  IM.registerDrill = function (d) {
    if (!d || !d.id || typeof d.generate !== 'function') throw new Error('bad drill');
    IM.drills[d.id] = d;
  };

  // ---- small shared helpers
  IM.util = {
    esc(s) {
      return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    },
    range(n) {
      return Array.from({ length: n }, (_, i) => i);
    },
    // Ondalık gösterim kısayolu: IM.util.d(x) -> "41.25" (IM.F(x).show())
    d: (x) => IM.F(x).show(),
    // Yüzde gösterimi: oran (0.8696) -> "86.96%"; p basamak (varsayılan 2, sondaki sıfırlar korunur)
    pct: (x, p = 2) => IM.F(x).mul(100).fixed(p) + '%',
  };
})();
