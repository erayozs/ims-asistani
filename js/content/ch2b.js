/* Bölüm 2 (devam) · Lean Manufacturing — 2.6 SMED · 2.7 Push/pull ve Kanban · 2.8 Kaizen, görsel yönetim, Poka-Yoke ·
   2.9 Bakım ve TPM · 2.10 Bakım performansı ve OEE.   Kaynak: Lean Manufacturing.pdf s.74–199.
   Not: s.76, 83, 87, 89–104, 105–109, 112–125, 129–130, 132–137, 139–151, 155–161, 166, 172–174, 176–182, 189–196 görsel sayfalardır;
   formül/şekil/örnekler PDF görüntüsünden okunmuş, sayılar node ile yeniden hesaplanmıştır. Notlarda olmayan ek açıklama "(notlarda yok)" ile işaretlidir. */
(function () {
  const IM = window.IM;

  /* ============================== 2.6 SMED ============================== */
  IM.content.summaries['2.6'] = `
<h2>2.6 Hazırlık süresi azaltma (SMED)</h2>
<p class="note">Ders notu: Lean Manufacturing s.74–104</p>

<h3>Set-up time nedir, neden azaltılır? (s.75–76)</h3>
<p><b>Set-up time</b>: bir önceki partinin <b>son ürününün tamamlanması</b> ile sonraki partinin <b>ilk kabul edilebilir (acceptable) ürününün tamamlanması</b> arasındaki zaman aralığıdır. Yani yalnızca "kalıp değiştirme" değil, ilk iyi parça çıkana kadar geçen ayar-deneme süresi de buna dahildir.</p>
<ul>
  <li>Hazırlık süresini azaltmak <b>kapasite kazandırır</b>.</li>
  <li>Hazırlık süresini düşürmek, <b>daha küçük partilerle üretimin ön koşuludur</b>.</li>
  <li>Küçük parti büyüklüğü: <b>daha kısa lead time</b>, <b>hataların hızlı fark edilmesi</b>, <b>yerden tasarruf</b>.</li>
  <li>s.76 piramit şekli: <b>Setup Time = 0</b> tepe noktasında; tabanda birbiriyle çelişen hedefler — üretim maliyetini minimize etmek, kapasite kullanımını maksimize etmek, envanter maliyetini minimize etmek, teslimat performansını maksimize etmek. Hazırlık süreleri düştükçe bu çelişen hedefler birbirine yaklaşır.</li>
</ul>

<h3>SMED – OTED – NOTED (s.77–78)</h3>
<div class="model">SMED  (Single-Minute Exchange of Die)  : hazırlık süresi  &lt; 10 dakika
OTED  (One-Touch Exchange of Die)     : hazırlık süresi  &lt; 1 dakika
NOTED (Non-Touch Exchange of Dies)    : otomatik hazırlık (insan müdahalesi yok)</div>
<p>"Single-minute" = süre <b>tek haneli dakikadır</b> (10 dakikanın altı); 1 dakika demek değildir.</p>

<h3>Temel kavramlar: internal ve external setup (s.79)</h3>
<ul>
  <li><b>Internal setup (iç hazırlık)</b>: ancak <b>makine durdurulduktan sonra</b> yapılabilen işler — ör. kalıbı <b>takma / sökme (mounting, dismounting)</b>.</li>
  <li><b>External setup (dış hazırlık)</b>: <b>makine çalışırken</b> yapılabilen işler — ör. sökülen kalıbın depoya taşınması, bir sonra takılacak kalıbın makinenin yanına getirilmesi.</li>
</ul>

<h3>SMED'in dört kavramsal aşaması (s.80–88)</h3>
<table>
  <tr><th>Aşama</th><th>İçerik</th></tr>
  <tr><td><b>Stage 0</b> (s.81–83)</td><td>İç ve dış hazırlık <b>ayırt edilmez</b>; israflar tekrarlanır: makine durdurulduktan sonra bitmiş ürünün depoya, sonraki hammaddenin makineye taşınması; iç hazırlık başladıktan sonra bıçak/kalıp taşınması; hassas olmadığı için fikstürlerin değiştirilmesi; eksik malzeme, hatalar. Çalışma: <b>shop floor koşullarını ayrıntılı etüt</b>, <b>videoya alma</b>, <b>çalışanlarla görüşme</b>, <b>setup time analizi</b>. s.83 analiz formu: No, Setup Activity, Worker, Time, Cumulative Time, Setup Object, Comment, Action, <b>Type in Future State</b> (iç/dış).</td></tr>
  <tr><td><b>Stage 1</b> (s.84–85)</td><td><b>İç ve dış hazırlığı ayırma — SMED'in en önemli adımı.</b> Dış hazırlıkta kalıp, takım, malzeme makinenin yanına getirilir; iç hazırlıkta yalnızca gerekli işler yapılır (ör. kalıbı sökme ve ayarlama). Dış hazırlık için <b>kontrol listesi (checklist)</b> kullanılır, yapılanlar <b>iki kez kontrol edilir</b> (tüm parçalar hazır ve doğru yerde, tüm takımlar makinenin yanında) — bir <b>görsel kontrol</b> tekniğidir.</td></tr>
  <tr><td><b>Stage 2</b> (s.86–87)</td><td><b>İç hazırlığı mümkün olduğunca dış hazırlığa çevirme.</b> Bu aşamada normal hazırlık süreleri <b>%30–50 azaltılabilir</b>. Hazırlık işlemleri yeniden incelenir, adımları dışa çevirmenin yolları aranır. s.87: pres kalıp değişiminde öncesi/sonrası şeması (numaralı adımlar).</td></tr>
  <tr><td><b>Stage 3</b> (s.88–104)</td><td><b>Hazırlık işleminin her yönünü iyileştirme:</b> dış hazırlıkta radikal iyileştirmeler + iç hazırlıkta radikal iyileştirmeler.</td></tr>
</table>

<h3>Stage 3 — radikal iyileştirmeler (görsel sayfalardaki başlıklar)</h3>
<p><b>Dış hazırlıkta (s.89–94):</b> machine assigned tools (makineye atanmış takımlar, s.90) · visual die-tool storage (görsel kalıp-takım depolama, s.91) · specialized die car (özel kalıp arabası, döner masa/rulo; s.92–93) · die for consecutive operations ve multi feeders (ardışık işlemler için kalıp ve çoklu besleyici, s.94).</p>
<p><b>İç hazırlıkta (s.95–104):</b> teamwork / parallel workers (paralel çalışan işçiler, s.96) · clamping devices without tightening (sıkma gerektirmeyen bağlama, s.97; yay vida/ayar bağlantısını ortadan kaldırır) · standardization of dies (kalıp standardizasyonu, s.98) · height standardization (yükseklik standardizasyonu — şimlerle, s.99–100; "bağlantı elemanlarındaki çeşitliliği azaltmak") · centering (merkezleme bilyası, s.101) · positioning pins (konumlama pimleri, s.102) · colour-number coding (renk-sayı kodlama, s.103) · s.104: plastik enjeksiyon makinesi için iş organizasyonu (Gantt): dış/iç işler, 2 çalışan ve kalite kontrolcü; ek sütunlar: işin öncülü, işin bölünüp bölünemeyeceği (birden fazla kişi eşzamanlı yapabilir mi), işi yapabilecek çalışanlar.</p>

<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
  <li><b>SMED (&lt; 10 dk) ≠ OTED (&lt; 1 dk) ≠ NOTED (otomatik)</b> — üçü birbirinin yerine kullanılmaz.</li>
  <li><b>Internal = makine durmuşken</b> (kalıp takma/sökme); <b>external = makine çalışırken</b> (taşıma, hazırlık). İkisini ters yazmak klasik hatadır.</li>
  <li><b>Stage 1</b> ayırma adımıdır ve <b>en önemli</b> adımdır; <b>Stage 2</b> iç → dış <b>dönüştürme</b> adımıdır ve <b>%30–50</b> azalma verir; Stage 0'da ayrım <b>yoktur</b>.</li>
  <li>Set-up time = son iyi ürün → <b>ilk kabul edilebilir</b> ürün; yalnızca makinenin durma süresi değildir.</li>
  <li>Stage 3'te radikal iyileştirme <b>hem dış hem iç</b> hazırlık için yapılır.</li>
</ul></div>
`;

  IM.content.concepts['2.6'] = [
    { q: 'Lean Manufacturing notlarına göre <b>set-up time</b> aşağıdakilerden hangisidir?',
      options: ['Makinenin arıza nedeniyle durduğu toplam süre',
        'Sonraki parti için hammaddenin depodan çekilip makineye getirildiği süre',
        'Bir önceki partinin son ürününün tamamlanması ile sonraki partinin ilk kabul edilebilir ürününün tamamlanması arasındaki süre',
        'Kalıbın makineden sökülmesi ile yenisinin bağlanması arasındaki süre (deneme üretimi hariç)'],
      answer: 2, hint: 'Tanım "ilk acceptable ürün" ifadesine kadar uzanır.',
      explain: 'LEAN s.75: set-up time, önceki partinin son ürününün bitişi ile sonraki partinin ilk kabul edilebilir ürününün bitişi arasındaki süredir; kalıp değişimi ile birlikte ayar/deneme süresini de kapsar.' },
    { q: 'Hazırlık süresini azaltmanın / <b>küçük parti</b> üretiminin notlarda sayılan sonuçları hangileridir? (Birden fazla)',
      options: ['Daha kısa lead time', 'Hataların daha hızlı fark edilmesi', 'Yerden tasarruf', 'Ara stok ve WIP alanı ihtiyacının artması'],
      answer: [0, 1, 2],
      explain: 'LEAN s.75: küçük parti → daha az lead time, hataların hızlı fark edilmesi, yerden tasarruf. Küçük parti stok alanını artırmaz, azaltır.' },
    { q: 'SMED, OTED ve NOTED eşleştirmesi hangi seçenekte doğrudur?',
      options: ['SMED: otomatik hazırlık · OTED: 10 dk altı · NOTED: 1 dk altı',
        'SMED: 1 dk altı · OTED: 10 dk altı · NOTED: otomatik hazırlık',
        'SMED: 10 dk altı · OTED: otomatik hazırlık · NOTED: 1 dk altı',
        'SMED: 10 dk altı · OTED: 1 dk altı · NOTED: otomatik hazırlık'],
      answer: 3, hint: 'Şekil: Single-Minute → One-Touch → Non-Touch, süre giderek kısalır.',
      explain: 'LEAN s.77–78: SMED = 10 dakikadan kısa; OTED = 1 dakikadan kısa; NOTED = otomatik (dokunmasız) hazırlık.' },
    { q: 'Aşağıdakilerden hangisi <b>internal setup</b> (iç hazırlık) faaliyetidir?',
      options: ['Kalıbın makineye bağlanması (mounting) — makine durdurulmuşken',
        'Bir sonra takılacak kalıbın makinenin yanına getirilmesi',
        'Sökülmüş kalıbın depoya taşınması',
        'Takım ve kontrol listesinin makine yanında hazır edilmesi'],
      answer: 0,
      explain: 'LEAN s.79: internal setup, ancak makine durdurulduktan sonra yapılabilen işlerdir (kalıp takma/sökme). Taşıma ve hazırlık işleri makine çalışırken yapılabildiği için external\'dır.' },
    { q: 'Hangileri <b>external setup</b> (dış hazırlık) örnekleridir? (Birden fazla)',
      options: ['Sökülmüş kalıpların depoya taşınması', 'Takılacak kalıbın makinenin yanına getirilmesi',
        'Kalıbın makineden sökülmesi', 'Kalıbın makineye takılması'],
      answer: [0, 1],
      explain: 'LEAN s.79: external setup (ör. sökülen kalıpların depoya taşınması, takılacak kalıbın makine yanına getirilmesi) makine çalışırken yapılabilir. Kalıp takma/sökme ise internal\'dır.' },
    { q: 'SMED\'in <b>Stage 0</b> aşamasının tanımı hangisidir?',
      options: ['İç hazırlığın dış hazırlığa dönüştürülmesi', 'İç ve dış hazırlığın birbirinden ayrılması',
        'İç ve dış hazırlık koşullarının ayırt edilmediği başlangıç durumu', 'Hazırlık işleminin her yönünün radikal biçimde iyileştirilmesi'],
      answer: 2, hint: 'Aşamalar 0, 1, 2, 3 sırasıyla: ayırt etmeme → ayırma → dönüştürme → her yönü iyileştirme.',
      explain: 'LEAN s.80–81: Stage 0\'da iç ve dış hazırlık ayırt edilmez; makine durduktan sonra taşıma yapılması gibi israflar tekrarlanır. Stage 1 ayırma, Stage 2 dönüştürme, Stage 3 tüm yönleri iyileştirmedir.' },
    { q: 'Notlarda SMED\'in <b>en önemli adımı</b> olarak hangi aşama gösterilir?',
      options: ['Stage 0: mevcut durumun videoya alınması', 'Stage 1: iç ve dış hazırlığın ayrılması',
        'Stage 2: iç hazırlığın dış hazırlığa dönüştürülmesi', 'Stage 3: radikal iyileştirmeler'],
      answer: 1,
      explain: 'LEAN s.84: "Separating Internal & External Setup – the most important step in SMED". Stage 2 %30–50 kazanç sağlar ama en önemli adım olarak Stage 1 belirtilmiştir.' },
    { q: 'Stage 2 (iç hazırlığı dışa çevirme) sonunda normal hazırlık sürelerinde notlara göre yaklaşık ne kadar azalma sağlanabilir?',
      options: ['%10–20', 'Hazırlık süresi 10 dakikanın altına iner (SMED hedefi)', '%60–70', '%30–50'],
      answer: 3,
      explain: 'LEAN s.86: Stage 2\'de normal hazırlık süreleri %30–50 azaltılabilir. 10 dk altı SMED\'in tanımıdır, Stage 2\'nin garantili sonucu değildir.' },
    { q: 'Stage 1\'de dış hazırlık için <b>kontrol listesi (checklist)</b> kullanılıp yapılanların iki kez kontrol edilmesinin amacı/niteliği nedir?',
      options: ['Hazırlık süresini ölçmek için zaman etüdü yapmak',
        'İç hazırlık işlerini makine çalışırken yapmak',
        'Tüm parçaların ve takımların hazır ve doğru yerde olduğundan emin olmak — bir görsel kontrol tekniği',
        'Kalıpları standartlaştırarak bağlantı elemanı çeşidini azaltmak'],
      answer: 2,
      explain: 'LEAN s.85: dış hazırlık işleri için checklist kullanılır ve çift kontrol yapılır (tüm parçalar mevcut ve doğru yerde, tüm takımlar makine yanında); bu bir visual control tekniğidir.' },
    { q: 'Stage 0\'da shop floor koşullarını incelemek için notlarda sayılan yöntemler hangileridir? (Birden fazla)',
      options: ['Hazırlık işlemlerinin videoya alınması', 'Çalışanlarla görüşme', 'Setup time analizi', 'Kalıp yüksekliklerinin şimlerle standartlaştırılması'],
      answer: [0, 1, 2],
      explain: 'LEAN s.82: gerçek shop floor koşullarının ayrıntılı etüdü, setup süreçlerinin videoya alınması, çalışanlarla görüşme ve setup time analizi. Yükseklik standardizasyonu Stage 3 (iç hazırlık) uygulamasıdır (s.99).' },
    { q: 'Hangileri Stage 3\'te <b>dış hazırlıkta radikal iyileştirme</b> başlığı altında gösterilen uygulamalardır? (Birden fazla)',
      options: ['Machine assigned tools (makineye atanmış takımlar)', 'Visual die-tool storage (görsel kalıp-takım depolama)',
        'Specialized die car (özel kalıp arabası)', 'Centering (merkezleme) ve positioning pins (konumlama pimleri)'],
      answer: [0, 1, 2],
      explain: 'LEAN s.89–94: dış hazırlıkta machine assigned tools, visual die-tool storage, specialized die car ile ardışık işlemler için kalıp/multi feeders. Merkezleme ve konumlama pimleri iç hazırlık iyileştirmeleridir (s.101–102).' },
    { q: 'Hangileri Stage 3\'te <b>iç hazırlıkta radikal iyileştirme</b> uygulamalarıdır? (Birden fazla)',
      options: ['Teamwork — paralel çalışan işçiler', 'Clamping devices without tightening (sıkma gerektirmeyen bağlama)', 'Standardization of dies ve height standardization',
        'Specialized die car ile kalıbın makine dışında hazırlanması'],
      answer: [0, 1, 2],
      explain: 'LEAN s.95–103: iç hazırlıkta paralel çalışma (s.96), sıkmasız bağlama (s.97), kalıp ve yükseklik standardizasyonu (s.98–100), centering, positioning pins, colour-number coding. Özel kalıp arabası dış hazırlık iyileştirmesidir (s.92).' },
    { q: 'Kalıp tablası/bağlama <b>yüksekliğinin standartlaştırılması</b> (height standardization) notlara göre neyi sağlar?',
      options: ['Farklı bağlantı elemanı (cıvata/somun) ihtiyacını ve bağlantı elemanlarındaki çeşitliliği azaltır', 'Kalıbın makine merkezine otomatik oturmasını sağlar',
        'İç hazırlığı tamamen dış hazırlığa çevirir', 'Operatör sayısını artırarak paralel çalışmayı mümkün kılar'],
      answer: 0, hint: 'Altı çizili cümle: "Decreasing variability in fasteners".',
      explain: 'LEAN s.99–100: kalıp tablası yüksekliğinin standartlaştırılması farklı bağlantı elemanı ihtiyacını azaltır ("Decreasing variability in fasteners"). Merkezleme ayrı bir uygulamadır (s.101).' },
    { q: 'Hazırlık süreleri düştükçe s.76\'daki piramitte gösterilen hedeflerden hangileri birbirine yaklaşır? (Birden fazla)',
      options: ['Üretim maliyetinin minimizasyonu', 'Kapasite kullanımının maksimizasyonu', 'Envanter maliyetinin minimizasyonu', 'Teslimat performansının maksimizasyonu'],
      answer: [0, 1, 2, 3],
      explain: 'LEAN s.76: bu hedefler birbiriyle çelişir ("conflicting objectives"); hazırlık süresi 0\'a yaklaştıkça dördü de birbirine yaklaşır.' }
  ];

  /* ====================== 2.7 Push/pull ve Kanban ====================== */
  IM.content.summaries['2.7'] = `
<h2>2.7 Push/pull sistemler ve Kanban</h2>
<p class="note">Ders notu: Lean Manufacturing s.105–130</p>

<h3>Push ve pull tanımı (s.105–107)</h3>
<ul>
  <li><b>Push system</b>: işlerin üretim sistemine girişini <b>talebe göre</b> planlar (schedule eder). Şekilde (s.107) merkezi üretim kontrolü her birime (Rough, Precision, Subassembly, Main Assembly, Shipment) emir gönderir; birimler arasında stok bulunur.</li>
  <li><b>Pull system</b>: işlerin sisteme girişine ve sistemde ilerlemesine <b>sistemin durumuna göre</b> izin verir. Şekilde üretim kontrolü <b>Kanban prensiplerine göre</b> yapılır; her aşama bir sonrakinin çektiği kadar üretir.</li>
</ul>

<h3>Push ve pull karşılaştırması (s.109 tablosu)</h3>
<table>
  <tr><th>Push System (ERP, MRP)</th><th>Pull System (Kanban, CONWIP, POLCA)</th></tr>
  <tr><td>Ofiste çalışır</td><td>Sahada (field) çalışır</td></tr>
  <tr><td>Üretim parametrelerini <b>deterministik</b> kabul eder</td><td>Parametreleri <b>stokastik</b> kabul eder</td></tr>
  <tr><td>Beklenmedik durumları (arıza vb.) göz ardı eder</td><td>Beklenmedik durumları dikkate alır</td></tr>
  <tr><td>Planlayıcı sistemi işletir, periyodik olarak her birime üretim emri hazırlayıp gönderir</td><td>Talep yapısı önemli ölçüde değişince (aylık/üç aylık) planlayıcı supermarket'teki kasa/kutu ve kart (kanban) sayısını yeniden hesaplar; sistem özerk çalışır</td></tr>
  <tr><td>Yüksek alan ihtiyacı, çevrim stoğu ve lead time</td><td>Alan ihtiyacını, çevrim stoğunu ve lead time'ı iyileştirir</td></tr>
  <tr><td>Yüksek talep değişkenliğinde çalışır</td><td>Yüksek talep değişkenliğinde sorunludur</td></tr>
  <tr><td>Yüksek ürün çeşitliliğinde çalışır</td><td>Yüksek ürün çeşitliliğinde sorunludur</td></tr>
</table>
<p>Tablonun altındaki not: <b>"Hybrid production control…"</b> (hibrit üretim kontrolü; notlarda ayrıntı yok).</p>

<h3>Push örneği: MRP grafik yöntemi (s.108)</h3>
<p>Ürün ağacı: <b>A → B(2), C(3)</b>; <b>B → D(1), E(2)</b>; <b>C → D(2), F(2)</b>. Lead time (hafta): A=1, B=2, C=2, D=2, E=1, F=1. İhtiyaç: <b>A için 100 adet, 7. hafta</b>. Görselde elde stok gösterilmez; net ihtiyaç = brüt ihtiyaç. İhtiyaç, lead time kadar <b>geriye</b> kaydırılır (offset) ve bir üst parçanın planlı siparişi alt parçaların ihtiyacını doğurur:</p>
<div class="model">A : 100 adet hf 7 → planlı sipariş hf 7 − 1 = 6   (100)
B : 2 × 100 = 200 (ihtiyaç hf 6) → planlı sipariş hf 6 − 2 = 4   (200)
C : 3 × 100 = 300 (ihtiyaç hf 6) → planlı sipariş hf 6 − 2 = 4   (300)
D : 1 × 200 + 2 × 300 = 800 (ihtiyaç hf 4) → planlı sipariş hf 4 − 2 = 2   (800)
E : 2 × 200 = 400 (ihtiyaç hf 4) → planlı sipariş hf 4 − 1 = 3   (400)
F : 2 × 300 = 600 (ihtiyaç hf 4) → planlı sipariş hf 4 − 1 = 3   (600)</div>

<h3>Kanban: amaç, kart, iki kartlı sistem (s.110–113)</h3>
<ul>
  <li><b>Amaç</b>: malzeme akışını ve üretimi <b>gerçek talebe</b> (çizelgeye değil) göre sağlamak; müşteri ihtiyacını zamanında üretmek; üretimi talebe dengelemek; <b>görsel kontrol</b> sayesinde üretim alanı yönetimini basitleştirmek.</li>
  <li><b>Kanban kartındaki bilgiler (s.111)</b>: store shelf number · kanban number · item (part) number · item name · car type · box (container) capacity · box type · preceding process · subsequent process.</li>
  <li><b>Two-card kanban (s.112)</b>: <b>Production Kanban</b> tedarikçi hücreyi (Supplier Cell A) üretime yönlendirir; <b>Withdrawal Kanban</b> müşteri hücrenin (Customer Cell B) supermarket'ten ürün çekmesini sağlar. Ürün hücreden supermarket'e, oradan müşteri hücreye akar. s.113: kart, kanban receiving box → kanban order box → hücre → supermarket döngüsünde dolaşır.</li>
</ul>

<h3>Kanban sayısı (s.114)</h3>
<div class="model">KS = ⌈ OT · (1 + α) · KCS / KB ⌉      (sonuç yukarı yuvarlanır)
KS  : kanban sayısı           OT  : ortalama talep (adet/dk)
α   : güvenilirlik katsayısı  KCS : kanban çevrim süresi (dk)
KB  : konteynerdeki parça sayısı (adet/konteyner)
KCS = alıcı kutudaki bekleme + sipariş kutusuna transfer + sipariş kutusunda bekleme
      + parti işlem çevrim süresi (hazırlık + parti işleme + hücre içi bekleme)
      + konteynerin hücre çıkışındaki supermarket'e transferi + supermarket'te bekleme</div>
<p>Her konteyner için bir kanban vardır: <b>konteyner sayısı = kanban sayısı</b>.</p>

<h3>Kanban türleri ve araçları (s.115–123)</h3>
<ul>
  <li><b>Supplier kanban</b> (s.115–116): tedarikçiden gelen malzeme için kanban; merkezi depo – montaj – tedarikçi arasında dolaşır.</li>
  <li><b>Kanban board</b> (s.117–118): üretimi planlamak ve üretim önceliğini belirlemek için kullanılır; renkler: <b>kırmızı = acil, sarı = daha az acil, yeşil = acil değil</b>.</li>
  <li><b>Groove system</b> (s.119): iki makine arasındaki oluk; oluk dolunca anahtar (switch) geri besleme ile önceki makineyi uyarır.</li>
  <li><b>Kanban square</b> (s.120): kanbanın konduğu işaretli kare; görsel kontrol.</li>
  <li><b>Two bin</b> (s.121): iki kutulu sistem, kutuların birinde kanban bulunur.</li>
  <li><b>CONWIP</b> (s.122): tedarikçi hücre ile müşteri hücre arasında kart/kanban ile toplam WIP üst sınırlanır; arada FIFO hattı vardır (şekilde en çok 50 parça); dolunca tedarikçi hücre durur (STOP).</li>
  <li><b>Signal kanban</b> (s.123): malzeme sipariş sinyal kanbanı ve üretim sipariş sinyal kanbanı; stok belirli bir seviyeye inince tetiklenir (notlarda şekil var, ayrıntılı metin yok).</li>
</ul>

<h3>Uygulama: Big Electric Box hücreleri ve Switch hücreleri (s.124–130)</h3>
<ul>
  <li>Switch hücreleri (tedarikçi) ile Big Electric Box montaj hücreleri (müşteri) arasında <b>supermarket</b> ile pull sistemi kuruldu. Production kanban: ürün kodu, ürün adı, supermarket adresi, taşıma birimi (kutu), kutu kapasitesi (örn. 8), tedarikçi ve müşteri hücre.</li>
  <li>Çalışma prensipleri (s.126): production kanban olmadan <b>kesinlikle üretim yok</b>; seyrek üretilen 630 A şalterler (84033, 84047, 89504) için kanban kullanılmaz; aynı ürün ailesinde <b>teslim tarihi en yakın</b> iş emrine öncelik; supermarket'ten ürün almadan önce production kanban alınıp ilgili hücrenin askısına asılır; kanbanlar yalnızca tanımlı yerlerde (supermarket, askı) bulunur; her haftanın başında hücre takım liderleri kanban sayılarını kontrol eder; kodlu supermarket gözlerine tanımı dışında ürün konmaz; <b>FIFO</b> uygulanır; hatalı ürün gönderilmez.</li>
  <li>Çalışma sistematiği (s.127–128): lojistik operatörü supermarket'e gider → production kanbanı alacağı şalter sepetine takıp ilgili hücrenin askısına asar → sepeti montaj hücrelerine götürür → kanban <b>kırmızı bölgedeyse</b> üretim <b>hemen</b> başlar (SYK 250 örneği) → üretilen şalterler askıdaki kanbanla birlikte hücre çıkışında supermarket'teki adreslerine konur.</li>
</ul>
<div class="model">SYK 160 :  OT = 32 adet/gün / 540 dk/gün = 0.059 adet/dk (tam değer 0.05926)
           KCS = 10 (bekleme) + 72 (montaj) + 810 (dış kaynaklı ara işlemler) = 892 dk
           α = 0.30 ,  KB = 8
           KS = ⌈ 0.05926 · 1.30 · 892 / 8 ⌉ = ⌈ 8.59 ⌉ = 9   (0.059 ile 8.55 → yine 9)
SYK 250 :  kanban sayısı 6 (notlarda hesap yok; kutu kapasitesi 3)

Push (mevcut): 6 kutu · 30 = 180  +  12 kutu · 18 = 216  →  396 adet
Pull         : 9 kutu · 8  = 72   +  6 kutu · 3  = 18   →   90 adet
Envanter azalması = (396 − 90) / 396 = 0.7727 → %77</div>

<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
  <li><b>Push ≠ pull</b>: push talebe göre <b>çizelgeler</b> (MRP/ERP, ofis, deterministik); pull sistemin <b>durumuna göre</b> çeker (Kanban, CONWIP, POLCA; saha, stokastik). Pull yüksek talep değişkenliğinde ve yüksek ürün çeşitliliğinde <b>sorunludur</b>, push'ta çalışır.</li>
  <li>KS sonucu <b>yukarı yuvarlanır</b> (⌈ ⌉): 8.59 → 9, 8 değil. OT <b>adet/dk</b>, KCS <b>dakika</b> olmalı (birim tutarlılığı); KB konteynerdeki parça sayısıdır.</li>
  <li><b>(1 + α)</b> güvenlik payıdır; α = 0.30 → %30 ek. KCS yalnızca işleme süresi değil, <b>bekleme ve transfer sürelerini</b> de içerir.</li>
  <li>MRP grafiğinde lead time <b>geriye</b> uygulanır; D'nin ihtiyacı hem B'den (1 × 200) hem C'den (2 × 300) gelir = 800.</li>
  <li>Two-card sistemde <b>production kanban üretim izni</b>, <b>withdrawal kanban çekme izni</b> verir. Slayttaki 0.059 yuvarlanmış değerdir; tam değer 540 dakikada 32 adet → 0.05926.</li>
</ul></div>
`;

  IM.content.concepts['2.7'] = [
    { q: 'Notlara göre <b>push system</b> için hangisi doğrudur?',
      options: ['İşlerin sisteme giriş ve ilerleyişine sistemin durumuna göre izin verir',
        'Üretim parametrelerini stokastik kabul eder ve sistem özerk çalışır',
        'Yalnızca kanban kartı geldiğinde üretim yapar',
        'İşlerin üretim sistemine girişini talebe göre planlar (çizelgeler)'],
      answer: 3,
      explain: 'LEAN s.106: push system işlerin üretim sistemine girişini talebe göre planlar; pull system ise işlerin girişine ve ilerleyişine sistemin durumuna göre izin verir.' },
    { q: 'Notlardaki tanıma göre <b>pull system</b> nedir?',
      options: ['Planlayıcının her birime periyodik üretim emri gönderdiği sistem', 'İşlerin sisteme girişine ve sistemde ilerlemesine sistemin durumuna göre izin veren sistem',
        'Tedarikçiden en büyük partilerle mal çekme sistemi', 'MRP\'nin ofiste çalışan türü'],
      answer: 1, hint: 'Karşılaştırma ifadesi: "state of the system".',
      explain: 'LEAN s.106: pull system, işlerin üretim sistemine girişine ve sistemde ilerlemesine sistemin durumuna göre izin verir (Kanban, CONWIP, POLCA).' },
    { q: 'Hangileri s.109 tablosuna göre <b>push system (ERP, MRP)</b> özellikleridir? (Birden fazla)',
      options: ['Ofiste çalışır', 'Üretim parametrelerini deterministik kabul eder', 'Beklenmedik durumları (arıza vb.) göz ardı eder', 'Alan ihtiyacını, çevrim stoğunu ve lead time\'ı iyileştirir'],
      answer: [0, 1, 2],
      explain: 'LEAN s.109: push ofiste çalışır, parametreleri deterministik kabul eder, beklenmedik durumları göz ardı eder; yüksek alan ihtiyacı, çevrim stoğu ve lead time üretir. Bunları iyileştiren pull\'dur.' },
    { q: 'Hangileri s.109 tablosuna göre <b>pull system (Kanban, CONWIP, POLCA)</b> özellikleridir? (Birden fazla)',
      options: ['Sahada (field) çalışır', 'Üretim parametrelerini stokastik kabul eder', 'Beklenmedik durumları (arıza vb.) dikkate alır', 'Planlayıcı periyodik olarak her birime üretim emri gönderir'],
      answer: [0, 1, 2],
      explain: 'LEAN s.109: pull sahada çalışır, stokastik parametre ve beklenmedik durumları dikkate alır; talep yapısı değişince planlayıcı kart/kutu sayısını yeniden hesaplar ve sistem özerk çalışır. Periyodik üretim emri push\'a aittir.' },
    { q: 'Hangi koşullarda pull sistem notlarda "<b>sorunlu</b>" (problematic) olarak belirtilmiştir?',
      options: ['Düşük talep değişkenliği ve düşük ürün çeşitliliği',
        'Yalnızca yüksek talep (hacim) olduğunda',
        'Yüksek talep değişkenliği ve yüksek ürün çeşitliliği',
        'Stokastik üretim parametrelerinde'],
      answer: 2,
      explain: 'LEAN s.109: push yüksek talep değişkenliğinde ve yüksek ürün çeşitliliğinde çalışır; pull bu iki durumda sorunludur (tablonun altında "Hybrid production control…" notu vardır).' },
    { q: 'Notlarda sayılan <b>kanbanın amaçları</b> hangileridir? (Birden fazla)',
      options: ['Malzeme akışını ve üretimi gerçek talebe göre sağlamak (çizelgeye göre değil)', 'Müşteri ihtiyaçlarını zamanında üretmek',
        'Görsel kontrol sayesinde üretim alanı yönetimini basitleştirmek', 'Tüm istasyonlarda ara stokları artırarak arızaya karşı güvence sağlamak'],
      answer: [0, 1, 2],
      explain: 'LEAN s.110: kanbanın amacı gerçek talebe göre akış ve üretim, müşteri ihtiyacını zamanında üretme, üretimi talebe dengeleme ve görsel kontrolle yönetimi basitleştirmedir. Ara stok artırmak amaç değildir.' },
    { q: 'Hangileri notlara göre bir <b>kanban kartında</b> bulunan bilgilerdendir? (Birden fazla)',
      options: ['Store shelf number (raf numarası) ve kanban numarası', 'Kutu (container) kapasitesi ve kutu tipi', 'Önceki (preceding) ve sonraki (subsequent) proses', 'Takt time ve operatör ücreti'],
      answer: [0, 1, 2],
      explain: 'LEAN s.111: store shelf number, kanban number, item number, item name, car type, box capacity, box type, preceding process, subsequent process. Takt time ve ücret kartta yer almaz.' },
    { q: '<b>Two-card kanban</b> sisteminde (s.112) <b>withdrawal kanban</b> hangi görevi görür?',
      options: ['Tedarikçi hücreye üretim başlatma izni verir',
        'Tedarikçiden hammadde siparişi verir ve depoyu doldurur',
        'Kutu kapasitesini belirler',
        'Müşteri hücrenin supermarket\'ten ürün çekmesini (taşımayı) sağlar'],
      answer: 3, hint: 'İki kart: biri üretim, biri çekme.',
      explain: 'LEAN s.112: production kanban tedarikçi hücreyi (A) üretime yönlendirir; withdrawal kanban müşteri hücrenin (B) supermarket\'ten ürün çekmesini sağlar.' },
    { q: 'Kanban sayısı formülü notlara göre hangisidir? (OT: ortalama talep, α: güvenilirlik katsayısı, KCS: kanban çevrim süresi, KB: konteynerdeki parça sayısı)',
      options: ['KS = ⌈ OT · (1 + α) · KCS / KB ⌉', 'KS = ⌈ OT · KCS / (KB · (1 + α)) ⌉', 'KS = ⌊ OT · (1 + α) · KCS / KB ⌋', 'KS = ⌈ OT · (1 − α) · KB / KCS ⌉'],
      answer: 0,
      explain: 'LEAN s.114: KS = ⌈ OT · (1 + α) · KCS / KB ⌉; sonuç yukarı yuvarlanır (aşağı değil). (1 + α) güvenlik çarpanı kesrin <b>payında</b> (OT ve KCS ile birlikte) yer alır; paydada yalnızca KB (konteyner kapasitesi) bulunur.' },
    { q: 'Kanban çevrim süresi (KCS) hangi bileşenlerden oluşur? (Birden fazla)',
      options: ['Kanbanın alıcı kutuda ve sipariş kutusunda bekleme süreleri ile sipariş kutusuna transfer süresi',
        'Parti işlem çevrim süresi (hazırlık + parti işleme + hücre içi bekleme)',
        'Konteynerin hücre çıkışındaki supermarket\'e transferi ve orada bekleme süresi', 'Yalnızca bir parçanın cycle time\'ı'],
      answer: [0, 1, 2],
      explain: 'LEAN s.114: KCS, kanbanın bir tam çevrimde harcadığı süredir; bekleme, transfer, parti işlem çevrimi ve supermarket transfer/bekleme sürelerinin toplamıdır. Tek parça cycle time\'ı değildir.' },
    { q: 'SYK 160 örneğinde OT = 0.059 adet/dk, α = 0.30, KCS = 892 dk, KB = 8 adet için kanban sayısı kaçtır? (s.129)',
      options: ['8 (8.55 aşağı yuvarlanır)', '7', '9 (8.55 veya 8.59 yukarı yuvarlanır)', '10'],
      answer: 2,
      explain: 'LEAN s.129: 0.059 · 1.30 · 892 / 8 = 8.55 (tam OT = 32 / 540 = 0.05926 ile 8.59); ⌈ ⌉ ile 9 kanban. KCS = 10 + 72 + 810 = 892 dk.' },
    { q: 'MRP grafik örneğinde (s.108) A için 7. haftaya 100 adet ihtiyaç var. <b>D parçası için planlı sipariş</b> ne zaman, kaç adet verilir? (D: B\'de 1, C\'de 2 adet; B ve C 4. haftada 200 ve 300 adet; D lead time = 2 hf)',
      options: ['4. haftada 800 adet', '2. haftada 800 adet', '2. haftada 500 adet', '4. haftada 200 adet'],
      answer: 1, hint: '1 · 200 + 2 · 300, sonra 2 hafta geri.',
      explain: 'LEAN s.108: D ihtiyacı = 1 · 200 (B) + 2 · 300 (C) = 800 adet, 4. haftada; lead time 2 hafta geri kaydırılınca planlı sipariş 4 − 2 = 2. haftada, 800 adet.' },
    { q: 'MRP grafik örneğinde A için planlı sipariş <b>6. haftada</b> verilmesinin nedeni nedir?',
      options: ['B ve C\'nin planlı siparişleri 6. haftada çıkar',
        'A\'nın lead time\'ı 2 hafta olduğundan',
        'İhtiyaç, lead time kadar ileriye ötelenir',
        'A\'nın lead time\'ı 1 hafta olduğundan ihtiyaç tarihi (hf 7) bir hafta geriye çekilir'],
      answer: 3,
      explain: 'LEAN s.108: A\'nın lead time\'ı 1 hafta; ihtiyaç 7. haftada olduğundan planlı sipariş 7 − 1 = 6. haftada verilir. Lead time geriye uygulanır. B ve C\'nin ihtiyaçları da bu 6. haftalık siparişten doğar.' },
    { q: 'Kanban türlerinden hangisinde kartlarla <b>toplam WIP sınırlanır</b> ve arada FIFO hattı bulunur; hat dolunca tedarikçi hücre durur?',
      options: ['Groove system', 'Kanban square', 'CONWIP', 'Two bin'],
      answer: 2,
      explain: 'LEAN s.122: CONWIP şeklinde tedarikçi hücre (A) ile müşteri hücre (B) arasında en çok 50 parçalık FIFO hattı vardır; dolu (FULL) olunca tedarikçi hücreye STOP verilir.' },
    { q: 'Kanban board\'da (s.118) <b>kırmızı</b> bölge/renk neyi gösterir?',
      options: ['Acil (üretim hemen başlar)', 'Acil olmayan ürün', 'Daha az acil ürün', 'Kalite hatası'],
      answer: 0,
      explain: 'LEAN s.118: Kırmızı = acil, sarı = daha az acil, yeşil = acil değil. s.127: kanban kırmızı bölgedeyse üretim hemen başlar.' },
    { q: 'Big Electric Box–Switch hücreleri uygulamasında (s.129–130) pull sisteme geçişle envanterde ne olmuştur?',
      options: ['216 adetten 72 adede düşmüş, %66 azalma', '90 adetten 396 adede çıkmış', '396 adetten 180 adede düşmüş', '396 adetten 90 adede düşmüş, yaklaşık %77 azalma'],
      answer: 3,
      explain: 'LEAN s.129–130: push\'ta 180 + 216 = 396 adet; pull\'da 72 + 18 = 90 adet; azalma (396 − 90) / 396 = %77.27, notlarda "%77".' },
    { q: 'Uygulamadaki çalışma prensiplerine (s.126) göre hangileri doğrudur? (Birden fazla)',
      options: ['Production kanban olmadan kesinlikle üretim yapılmaz', 'Seyrek üretilen 630 A şalterler için kanban kullanılmaz',
        'Aynı ürün ailesinde teslim tarihi en yakın iş emrine öncelik verilir', 'Supermarket\'e istenirse kodu dışında ürün konabilir'],
      answer: [0, 1, 2],
      explain: 'LEAN s.126: kanbansız üretim yok; 84033, 84047, 89504 kodlu seyrek 630 A şalterlerde kanban yok; en kısa teslim tarihli iş emri öncelikli; kodlu supermarket gözlerine tanımı dışında ürün konamaz; FIFO uygulanır.' }
  ];

  /* ================= 2.8 Kaizen, görsel yönetim, Poka-Yoke ================= */
  IM.content.summaries['2.8'] = `
<h2>2.8 Kaizen, görsel yönetim ve Poka-Yoke</h2>
<p class="note">Ders notu: Lean Manufacturing s.131–161</p>

<h3>Kaizen (s.131–137)</h3>
<ul>
  <li>Japoncada <b>KAI = değişim</b>, <b>ZEN = iyi, daha iyi</b>. Kaizen: bu yolla daha iyiye ulaşmak; genel kullanımda <b>sürekli iyileştirme (continuous improvement)</b>.</li>
  <li><b>Masaaki Imai</b>'ye göre: <b>"üst yönetim, yöneticiler ve çalışanlar dahil herkesin katıldığı sürekli iyileştirme"</b>.</li>
  <li><b>Western approach (s.132)</b>: üretim belirli standartlarda sürerken araştırmacılar laboratuvarlarda Ar-Ge yapar; iş bitince buluş uygulanır ve gelişim seviyesinde <b>sıçrama</b> olur; yeni buluşa kadar üretim yeni standartlarla sürer (grafikte <b>büyük basamaklar</b>).</li>
  <li><b>Kaizen approach</b>: belirli sürede çok sayıda <b>küçük iyileştirme</b> yapılabilirse, toplam etkiyle klasik gelişim hızına yakın, bazen ondan daha hızlı bir gelişim eğilimi yakalanır (grafikte <b>çok sayıda küçük basamak</b>).</li>
  <li><b>Before–After Kaizen (s.133)</b>: Mercedes Benz Türk örneği — enine taşıyıcıların 1390 yüksekliğine getirilmesi çok zor → şablon taşıyıcılar üzerine ayar düzeneği; sonuç <b>10 dakika zaman kazancı, verimlilik +%4</b>.</li>
  <li><b>A3 Reporting – Kobetsu Kaizen (s.134–135)</b>: tek sayfalık rapor bölümleri: The problem · Background · Current condition · Cause analysis (5-Whys ve/veya balık kılçığı) · Target condition · Implementation plan (What? Who? When? Where?) · Follow-up plan · Results.</li>
  <li><b>Kaizen suggestion system örneği (s.136)</b>: kuralların özeti — Kaizen formunun temel sorusu "<i>Çalıştığınız yerde işinizi kolaylaştırmak için daha neler yapabilirsiniz?</i>"; <b>şikâyetler, sahte öneriler, çalışanın kendi bölümü dışındaki öneriler ve sözlü öneriler dikkate alınmaz</b>; her bölüm panosunda Boş Form / Fikir / Onaylı-Uygulamada / Uygulandı / Reddedildi cepleri bulunur; <b>40 puan toplayan çalışan ödül hakkı kazanır</b>.</li>
</ul>
<table>
  <tr><th>Kriter</th><th>Orta (Middle)</th><th>İyi (Good)</th><th>Çok iyi (Very good)</th></tr>
  <tr><td>Çözüm bulma ve uygulama</td><td>4 puan</td><td>8 puan</td><td>16 puan</td></tr>
  <tr><td>Çözüm önerme</td><td>2 puan</td><td>4 puan</td><td>8 puan</td></tr>
  <tr><td>Problem bulma çabası ve katılım</td><td>1 puan</td><td>2 puan</td><td>4 puan</td></tr>
</table>
<p>Örnek (notlarda yok, tablodan hesap): "çok iyi" 16 + "çok iyi" 16 + "çok iyi" 8 = 40 puan → ödül eşiği. s.137 Q&amp;E Kaizen Form: öncesi/önerilen iyileştirme, etki, kategori, <b>sekiz israf</b> kutucukları ve Poka-Yoke var/yok alanı içerir.</p>

<h3>Görsel yönetim (visual management, s.138–156)</h3>
<ul>
  <li>Sorunları fark edip hızla harekete geçmek için kullanılan <b>basit lean teknikleridir</b>; mevcut performansın planlanan performansa göre <b>farkındalığını artırır</b>.</li>
  <li><b>Information gathering (s.139)</b>: duyulardan bilgi edinme payı — <b>görme %83</b>, işitme %11, koklama %4, dokunma %1, tat alma %1 (görseldeki simgelere göre).</li>
  <li><b>Asakai (s.140–141)</b>: Asakai toplantısında kullanılan panolar: <b>Task Assignment Dashboard</b> (görev atama panosu, s.142–143) ve <b>Production Performance Tracking (QCDSM) Board</b> (s.144). QCDSM panosunda müşteri kalite şikâyetleri, kalitesizlik maliyeti, zamanında teslimat, iş güvenliği, çevre, 5S, devamsızlık, öneriler ve fazla mesai gibi göstergeler izlenir (QCDSM harflerinin açılımı notlarda yazmaz; standart açılım Quality, Cost, Delivery, Safety, Morale — notlarda yok).</li>
  <li><b>Production scoreboard (s.145)</b>: hedef üretim, mevcut üretim, sistem durumu (çalışıyor / hazırlık / durdu), <b>etkinlik oranı = gerçekleşen üretim / hedef üretim</b> vb. Ayrıca Lean Production Mainboard (s.146) ve Cell Board (s.147).</li>
  <li><b>Skill matrix (s.148–151)</b>: satırlarda çalışanlar, sütunlarda işler; düzey gösterimi (sayısal değerlendirme s.150–151):</li>
</ul>
<div class="model">0 = işi yapamaz
1 = işi takım liderinin kontrolüyle yapabilir      (çeyrek dolu daire)
2 = işi tek başına yapabilir                       (yarım dolu daire)
3 = işi öğretebilir (eğitebilir)                   (üç çeyrek dolu daire)
4 = işi iyileştirebilir                            (tam dolu daire)
gri = bu işi yapması beklenmiyor</div>
<ul>
  <li><b>3*3*3 rule (s.152)</b>: her çalışan en az 3 iş yapar; her iş en az 3 çalışan tarafından yapılır (slayttaki üçüncü madde "her çalışan 3 iş yapacak" birincinin tekrarıdır).</li>
  <li><b>Work standardization / work instruction (s.153–154)</b>: standart iş talimatları çalışma yerinde görsel olarak asılır.</li>
  <li><b>Colour coding (s.155)</b>: aynı ürün hattı/hücredeki parça konteynerleri <b>aynı renktedir</b>; hat içinde benzer parçaların konteynerleri <b>farklı renktedir</b>; yer tanımları ve istasyon sınırları renkli çizgilerle belirlenir. s.156: andon, saatlik üretim takip panosu gibi görsel yönetim örnekleri.</li>
</ul>

<h3>Poka-Yoke (s.157–161)</h3>
<ul>
  <li><b>Poka</b> = dikkatsizlik hatası (careless mistake), <b>Yoke</b> = önlemek (prevent). Ürünü veya prosesi <b>insan hatasına izin vermeyecek biçimde tasarlamak</b>; hata önleme mekanizmalarıdır; <b>her insanın hata yapabileceğini</b> varsayar.</li>
  <li>Örnekler (s.158–160): farklı renkli/şekilli atık bölmeleri, tek yönde takılan fişler ve farklı geometrili gaz prizleri, kutuda beyaz/kırmızı renk kodlaması (36G / 36GC, s.159), ışık kulesi ile uyarı (s.160).</li>
  <li><b>Poka-Yoke araçları (s.161)</b>: sensors (sensörler) · light or sound supported warnings (ışık veya ses destekli uyarılar) · asymmetry (asimetri) · colour coding (renk kodlama) · number coding (sayı kodlama).</li>
</ul>

<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
  <li><b>Western = sıçramalı</b> (Ar-Ge, büyük basamak), <b>Kaizen = çok sayıda küçük iyileştirme</b>; Kaizen <b>herkesi</b> (üst yönetim dahil) kapsar, yalnızca çalışanları değil.</li>
  <li>Öneri sistemi: <b>şikâyet, sahte öneri, kendi bölümü dışı ve sözlü öneri kabul edilmez</b>; ödül eşiği <b>40 puan</b>; en yüksek tek kalem <b>16 puan</b> (çözüm bulma + uygulama, çok iyi).</li>
  <li><b>83%</b> bilgiyi <b>gözle</b> alırız (işitme %11) — görsel yönetimin dayanağı.</li>
  <li>Skill matrix'te <b>4 en yüksek</b> düzeydir (işi iyileştirebilir); <b>3 = öğretebilir</b>, 2 = tek başına, 1 = lider kontrolüyle. <b>3*3*3</b>: her çalışan ≥ 3 iş, her iş ≥ 3 çalışan.</li>
  <li><b>Poka-Yoke</b> hatayı bulmak/ayıklamak değil, <b>hatanın oluşmasını engellemektir</b>; araçları: sensör, ışık/ses uyarısı, asimetri, renk ve sayı kodlaması.</li>
  <li>QCDSM panosu <b>Production Performance Tracking Board</b>'dur (görev atama panosu değil).</li>
</ul></div>
`;

  IM.content.concepts['2.8'] = [
    { q: 'Kaizen kelimesinin Japonca kökleri ve anlamı hangisidir?',
      options: ['KAI = iyi, ZEN = değişim', 'KAI = değişim, ZEN = iyi / daha iyi', 'KAI = sürekli, ZEN = iyileştirme', 'KAI = hata, ZEN = önleme'],
      answer: 1, hint: 'Kaizen = "daha iyiye değişim".',
      explain: 'LEAN s.131: Japoncada KAI değişim, ZEN iyi/daha iyi demektir; Kaizen sürekli iyileştirme anlamında kullanılır. "Hata önleme" Poka-Yoke\'dir.' },
    { q: 'Masaaki Imai\'ye göre Kaizen nedir?',
      options: ['Yalnızca üretim çalışanlarının önerdiği küçük iyileştirmeler',
        'Ar-Ge laboratuvarlarının sıçramalı yenilikleri',
        'Üst yönetim, yöneticiler ve çalışanlar dahil herkesin katıldığı sürekli iyileştirme',
        'Yılda bir yapılan proje bazlı iyileştirme'],
      answer: 2,
      explain: 'LEAN s.131: Imai\'ye göre kaizen, "üst yönetim, yöneticiler ve çalışanlar dahil herkesin katıldığı sürekli iyileştirme"dir.' },
    { q: '<b>Western approach</b> ile <b>Kaizen approach</b> farkı hangi seçenekte doğru verilmiştir?',
      options: ['Western: çok sayıda küçük iyileştirme · Kaizen: Ar-Ge ile büyük sıçramalar',
        'Western: tüm çalışanların katılımı · Kaizen: yalnızca uzmanların katılımı',
        'Her ikisi de sürekli ve küçük adımlıdır, fark yalnızca hızdadır',
        'Western: laboratuvarda Ar-Ge ile gelen sıçramalı gelişim · Kaizen: çok sayıda küçük iyileştirmenin toplam etkisi'],
      answer: 3,
      explain: 'LEAN s.132: Western yaklaşımda üretim belirli standartlarla sürerken Ar-Ge tamamlanınca bir sıçrama olur (büyük basamaklar); Kaizen\'de çok sayıda küçük iyileştirmenin toplam etkisi klasik hıza yakın, bazen ondan hızlı gelişim sağlar.' },
    { q: 'Mercedes Benz Türk Before–After Kaizen örneğinde (s.133) elde edilen sonuç nedir?',
      options: ['10 dakika zaman kazancı ve verimlilikte +%4', '10 saat zaman kazancı ve verimlilikte +%40', 'Hurda oranında %4 azalma', 'WIP\'in %10 azalması'],
      answer: 0,
      explain: 'LEAN s.133: enine taşıyıcıların 1390 yüksekliğine getirilmesi için şablon taşıyıcılar üzerine ayar düzeneği yapıldı; sonuç "10 minutes of time saving, efficiency +4%".' },
    { q: 'A3 raporunda (Kobetsu Kaizen, s.134) yer alan bölümler hangileridir? (Birden fazla)',
      options: ['The problem (sorun) ve Background (arka plan)', 'Current condition ve Cause analysis (5-Whys / balık kılçığı)', 'Target condition, Implementation plan ve Follow-up plan', 'Takt time hesabı ve kanban sayısı'],
      answer: [0, 1, 2],
      explain: 'LEAN s.134: A3 şablonu The problem, Background, Current condition, Cause analysis, Target condition, Implementation plan (What/Who/When/Where), Follow-up plan ve Results bölümlerinden oluşur.' },
    { q: 'Örnek Kaizen öneri sistemi kurallarına (s.136) göre hangi öneriler <b>dikkate alınmaz</b>? (Birden fazla)',
      options: ['Şikâyetler', 'Sahte (fake) öneriler', 'Çalışanın kendi bölümü dışındaki öneriler', 'Yazılı Kaizen formuyla sunulan, kendi bölümüne ait öneriler'],
      answer: [0, 1, 2],
      explain: 'LEAN s.136: şikâyetler, sahte öneriler, çalışanın kendi departmanı dışındaki öneriler ve sözlü öneriler dikkate alınmaz. Kaizen formuyla sunulan kendi bölümü önerisi değerlendirilir.' },
    { q: 'Öneri sistemi puan tablosuna (s.136) ve "40 puan = ödül" kuralına göre aşağıdakilerden hangisi çalışanı ödüle hak kazandırır?',
      options: ['Çözüm bulma ve uygulama (iyi) 8 + çözüm önerme (iyi) 4 + katılım (iyi) 2 = 14',
        'Çözüm bulma ve uygulama (orta) 4 + çözüm önerme (orta) 2 + katılım (orta) 1 = 7',
        'Çözüm bulma ve uygulamada iki kez "çok iyi" (16 + 16) ve çözüm önermede bir kez "çok iyi" (8)',
        'Çözüm bulma ve uygulama (çok iyi) 16 + katılım (çok iyi) 4 = 20'],
      answer: 2, hint: '16 + 16 + 8 = ?',
      explain: 'LEAN s.136: çok iyi değerlendirme çözüm bulma/uygulamada 16, çözüm önermede 8 puandır; 16 + 16 + 8 = 40 puan ödül eşiğine ulaşır. Diğer seçenekler 14, 7 ve 20 puandır.' },
    { q: 'Görsel yönetimin (visual management) amacı notlarda nasıl tanımlanır?',
      options: ['Üretim planlarını yalnızca ofis ortamında gizli tutmak',
        'Sorunları fark edip hızlı harekete geçmeyi sağlayan basit lean teknikleri; gerçek performansın planlanan performansa göre farkındalığını artırmak',
        'Çalışanların performansını cezalandırmak için ölçmek',
        'Bakım faaliyetlerini operatörlerden almak'],
      answer: 1,
      explain: 'LEAN s.138: visual management, problemleri fark edip hızla önlem almak için kullanılan basit lean tekniklerdir; mevcut performansın planlanana göre farkındalığını artırır.' },
    { q: 'Notlardaki "information gathering" görseline göre bilgi edinmede en büyük pay hangi duyuya aittir?',
      options: ['İşitme — %11', 'İşitme — %83', 'Görme — %38', 'Görme — %83'],
      answer: 3,
      explain: 'LEAN s.139: görme %83, işitme %11, koklama %4, dokunma %1, tat alma %1. Görsel yönetimin dayanağı budur.' },
    { q: 'Asakai\'de kullanılan iki pano hangileridir?',
      options: ['Kanban board ve Andon panosu', 'Skill matrix ve Cell Board', 'Task Assignment Dashboard ve Production Performance Tracking (QCDSM) Board', 'F-tag panosu ve OEE panosu'],
      answer: 2,
      explain: 'LEAN s.141: Boards in Asakai — Task Assignment Dashboard ve Production Performance Tracking (QCDSM) Board.' },
    { q: 'Production scoreboard\'da (s.145) <b>effectiveness rate</b> nasıl tanımlanır?',
      options: ['Gerçekleşen üretim / hedef üretim', 'Hedef üretim / gerçekleşen üretim', 'Sistem çalışma süresi / hazırlık süresi', 'Hatalı üretim / toplam üretim'],
      answer: 0,
      explain: 'LEAN s.145: Effectiveness Rate = Actual Production / Target Production; panoda hedef ve mevcut üretim ile sistem durumu (çalışıyor, hazırlık, durdu) da gösterilir.' },
    { q: 'Skill matrix\'in sayısal değerlendirmesinde (s.150–151) hangi eşleştirme doğrudur?',
      options: ['4 = işi takım liderinin kontrolüyle yapar · 1 = işi iyileştirebilir',
        '0 = tek başına yapar · 4 = yapamaz',
        '4 = işi öğretebilir · 3 = işi iyileştirebilir',
        '4 = işi iyileştirebilir · 3 = işi öğretebilir · 2 = tek başına yapar · 1 = lider kontrolüyle yapar · 0 = yapamaz'],
      answer: 3,
      explain: 'LEAN s.148–151: daire doluluğu arttıkça yetkinlik artar; sayısal değerlendirmede 4 can improve the job, 3 can train about the job, 2 can do the task alone, 1 can do the task with inspection of the team leader, 0 can not do the task.' },
    { q: '<b>3*3*3 rule</b> neyi söyler?',
      options: ['Her makinede 3 vardiya, her vardiyada 3 çalışan çalışır', 'Her çalışan en az 3 iş yapar ve her iş en az 3 çalışan tarafından yapılır', 'Her kanban 3 kez kontrol edilir', 'Her hata 3 kez sorgulanır (3 Why)'],
      answer: 1,
      explain: 'LEAN s.152: each worker will do at least 3 jobs; each job will be done by at least 3 workers. Çok yönlü çalışan sağlar; skill matrix ile izlenir.' },
    { q: 'Colour coding (renk kodlama) için notlarda verilen uygulamalar hangileridir? (Birden fazla)',
      options: ['Bir ürün hattı veya hücredeki parça konteynerleri aynı renktedir', 'Hat içindeki benzer parçaların konteynerleri farklı renklerdedir', 'Yer tanımları ve istasyon sınırları renkli çizgilerle belirlenir', 'Tüm konteynerler fabrikada tek renge boyanır'],
      answer: [0, 1, 2],
      explain: 'LEAN s.155: aynı hat/hücre konteynerleri aynı renkte, hattaki benzer parçaların konteynerleri farklı renkte; konum ve istasyon sınırları renkli çizgilerle belirlenir.' },
    { q: '<b>Poka-Yoke</b> için hangisi doğrudur?',
      options: ['Hatalı ürünü üretim sonunda ayıklayan muayene yöntemidir',
        'Çalışanların hata yapmasını cezalandıran bir performans sistemidir',
        'Ürün/prosesi insan hatasına izin vermeyecek biçimde tasarlayan hata önleme mekanizmasıdır; her insanın hata yapabileceğini varsayar',
        'Yalnızca elektronik sensörlerle çalışan bir sistemdir'],
      answer: 2,
      explain: 'LEAN s.157: Poka = dikkatsizlik hatası, Yoke = önlemek; insan hatasına izin vermeyen tasarım. Araçları sensör, ışık/ses uyarısı, asimetri, renk ve sayı kodlamadır (sadece sensör değil).' },
    { q: 'Hangileri notlarda sayılan <b>Poka-Yoke araçlarıdır</b>? (Birden fazla)',
      options: ['Sensörler', 'Işık veya ses destekli uyarılar', 'Asimetri (yalnızca doğru yönde takılan parça)', 'Renk ve sayı kodlama'],
      answer: [0, 1, 2, 3],
      explain: 'LEAN s.161: Poka-Yoke araçları sensors, light or sound supported warnings, asymmetry, colour coding, number coding.' }
  ];

  /* ======================= 2.9 Bakım yönetimi ve TPM ======================= */
  IM.content.summaries['2.9'] = `
<h2>2.9 Bakım yönetimi ve TPM</h2>
<p class="note">Ders notu: Lean Manufacturing s.162–182</p>

<h3>Temel kavramlar (s.163–165)</h3>
<ul>
  <li><b>Maintenance management (bakım yönetimi)</b>: bir ekipmanı <b>belirlenmiş çalışma durumunda tutmak için gereken tüm faaliyetler</b>.</li>
  <li><b>Maintainability (bakım yapılabilirlik)</b>: bir cihaz veya sistemin, arızaları düzeltmek ve önlemek, bozulmayı öngörmek, performansı artırmak veya değişen çevreye uyum sağlamak için <b>ne kadar kolay onarılabildiği veya değiştirilebildiği</b>.</li>
  <li><b>Reliability (güvenilirlik)</b>: bir cihaz veya sistemin <b>belirtilen koşullarda, belirli bir süre boyunca</b> gereken fonksiyonu yerine getirebilme yeteneği.</li>
  <li><b>Availability (hazır bulunurluk)</b>: sistem veya ekipmanın, görev belirli bir süre sürdüğünde <b>görevin başında çalışabilir ve görevlendirilebilir durumda olma</b> derecesi. Availability'yi artırmak = <b>arıza sayısını azaltmak (reliability)</b> + <b>onarım süresini azaltmak (maintainability)</b>.</li>
</ul>

<h3>Bakım maliyet eğrisi (s.166)</h3>
<p>Yatay eksen <b>maintenance level</b> (bakım seviyesi), dikey eksen <b>cost</b>. <b>Planned maintenance cost</b> bakım seviyesi arttıkça <b>artar</b>; <b>corrective maintenance cost</b> bakım seviyesi arttıkça <b>azalır</b>. Dikey kesikli çizgiyle işaretli <b>M*</b>, iki maliyet arasındaki dengeyi gösteren (toplam maliyeti en küçükleyen — yorum notlarda yok) bakım seviyesidir; görselde M*, iki eğrinin kesişim noktasının solunda işaretlenmiştir.</p>

<h3>Bakım türleri ve seçim kriterleri (s.167–169)</h3>
<ul>
  <li><b>Corrective maintenance</b> (düzeltici, arıza sonrası) · <b>Planned maintenance</b> — <b>Periodic maintenance</b> (periyodik) ve <b>Predictive maintenance</b> (kestirimci).</li>
  <li><b>Bakım türünü seçme kriterleri</b>: (1) parçanın maliyeti, (2) parçanın bakım süresi, (3) parçanın tedarik süresi, (4) parçanın genel sistem içindeki <b>kritikliği (önemi)</b>.</li>
  <li><b>RAMS metodolojisi</b>: <b>R</b>eliability · <b>A</b>vailability · <b>M</b>aintainability · <b>S</b>afety.</li>
</ul>

<h3>Total Productive Maintenance — TPM (s.170–174)</h3>
<ul>
  <li>TPM felsefesinin birçok temel özelliği <b>Productive Maintenance</b> ile örtüşür. <b>Productive Maintenance</b>: tasarım–ürün yaşam döngüsü maliyeti ilkeleriyle uyumlu <b>planlı bakım yaklaşımlarını</b> birleştirip güvenilirliği ve bakım yapılabilirliği artıran, <b>duruma dayalı sistematik bakım faaliyetleridir</b>.</li>
  <li><b>TPM içeriği (s.171)</b>: Design for Maintenance · Planned maintenance · <b>Autonomous maintenance</b> (yağlama, sıkma, temizleme işlerinin <b>one-point lesson</b>'lar ve makine haritalarıyla operatörlere verilmesi) · <b>F-tags</b> · Maintenance performance management (<b>OEE, MTBF, MTTR</b>).</li>
  <li><b>Paradigma değişimi (s.172)</b>: <b>Old attitude</b>: "Ben işletirim, sen onarırsın · Ben onarırım, sen tasarlarsın · Ben tasarlarım, sen işletirsin". <b>TPM attitude</b>: "Ekipmanımızdan, tesisimizden ve geleceğimizden <b>hepimiz sorumluyuz</b>".</li>
</ul>
<div class="model">TPM = Design for Maintenance
      + Planned Maintenance ( Periodic Maintenance + Predictive Maintenance )
      + Autonomous Maintenance
      + Visual Maintenance Management                          (s.173)</div>
<ul>
  <li><b>TPM'in sütunları (s.174)</b> — 5S temeli üzerinde yedi sütun: <b>Jishu Hozen</b> (autonomous maintenance) · <b>Kobetsu Kaizen</b> · <b>Planned Maintenance</b> · <b>Quality Maintenance</b> · <b>Training</b> · <b>Office TPM</b> · <b>Safety, Health &amp; Environment</b>. <b>Temel (foundation) = 5S.</b></li>
</ul>

<h3>Autonomous maintenance (s.175–182)</h3>
<ul>
  <li><b>Autonomous (self) maintenance</b>: operatörün kendi makinesinde <b>temizleme (clean), yağlama (lubricate), kontrol (inspect) ve ayar (adjust)</b> yapması. Şekle göre: kir, talaş, yağ, kirletici maddeler temizlenir; yağlama <b>yağlama föyüne</b> göre yapılır; sıvı seviyeleri, bağlantı uçları, filtreler, kablolar kontrol edilir; hava basıncı, bağlantı elemanları, sensörler (talimata göre) ayarlanır; anormallikler raporlanır, gerekirse <b>bakım iş talebi</b> açılır.</li>
</ul>
<ol>
  <li>Conduct initial cleaning / inspection (ilk temizlik ve kontrol)</li>
  <li>Eliminate sources of contamination (kirlenme kaynaklarını yok et)</li>
  <li>Establish provisional standards (geçici standartlar oluştur)</li>
  <li>Develop general inspection training (genel kontrol eğitimi geliştir)</li>
  <li>Conduct general inspections (genel kontroller yap)</li>
  <li>Improve workplace management and control (iş yeri yönetimi ve kontrolünü iyileştir)</li>
  <li>Participate in advanced improvement activities (ileri iyileştirme faaliyetlerine katıl)</li>
</ol>
<p><b>Araçlar (s.177–182)</b>: <b>One-Point Lessons</b> (tek konulu kısa eğitim kartı; s.178 örneği: dikiş makinesi iğne çubuğu yağlaması) · <b>Contamination Sources and Difficult Work Areas Map</b> (kirlenme kaynakları ve zor çalışılan yerler haritası; s.179: kirlenme kaynakları ve zor erişilen noktalar işaretli) · <b>Lubrication Map</b> (yağlama noktaları: bölge, yağ türü, yöntem, sıklık, makine açık/kapalı, sorumlu; s.180) · <b>Inspection Standards</b> (kontrol standartları ve kontrol noktaları/türleri; s.181–182).</p>

<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
  <li><b>Maintainability ≠ reliability</b>: maintainability = <b>onarım/bakım kolaylığı</b>; reliability = <b>belirli koşul ve sürede fonksiyonu yerine getirme</b>. Availability ikisiyle artar (arıza sayısı ↓ ve onarım süresi ↓).</li>
  <li><b>Planned maintenance = periodic + predictive</b>; corrective ayrı bir türdür (arıza sonrası).</li>
  <li>Maliyet eğrisinde <b>planned</b> maliyet seviye ile <b>artar</b>, <b>corrective</b> maliyet <b>azalır</b>.</li>
  <li>Bakım türü seçim kriterleri 4 tanedir: <b>parça maliyeti, bakım süresi, tedarik süresi, kritiklik</b>.</li>
  <li><b>TPM</b> yalnızca bakım departmanının işi değildir ("we are all responsible"); <b>5S</b> sütunların temelidir; <b>yedi sütun</b>'un ilki Jishu Hozen'dir. Autonomous maintenance <b>yedi adımlıdır</b> ve <b>ilk adım temizlik/kontrol</b>tür.</li>
</ul></div>
`;

  IM.content.concepts['2.9'] = [
    { q: 'Notlardaki tanıma göre <b>maintenance management</b> nedir?',
      options: ['Arızalı makinelerin yenilenmesi', 'Yedek parça stoğu yönetimi', 'Yalnızca periyodik yağlama ve temizlik işleri', 'Bir ekipmanı belirlenmiş çalışma durumunda tutmak için gereken tüm faaliyetler'],
      answer: 3,
      explain: 'LEAN s.163: maintenance management, bir ekipmanı belirlenmiş (specified) işletme durumunda tutmak için gereken tüm faaliyetlerdir.' },
    { q: '<b>Maintainability</b> tanımı hangisidir?',
      options: ['Bir cihaz veya sistemin arızaları düzeltmek/önlemek, performansı artırmak için ne kadar kolay onarılıp değiştirilebildiği',
        'Bir sistemin belirtilen koşullarda belirli bir süre fonksiyonunu yerine getirebilme yeteneği',
        'Sistemin görev başında çalışabilir durumda olma derecesi',
        'Çalışanların güvenliğinin sağlanma düzeyi'],
      answer: 0, hint: 'Kolaylık (ease) kelimesi tanımda geçer.',
      explain: 'LEAN s.164: maintainability, bir cihaz/sistemin arızaları düzeltmek ve önlemek, bozulmayı öngörmek, performansı artırmak veya değişen çevreye uyum sağlamak için kolaylıkla onarılıp değiştirilebilmesidir. Reliability ve availability tanımları ayrı kavramlardır (s.164–165).' },
    { q: '<b>Reliability</b> tanımı hangisidir?',
      options: ['Sistemin onarılma kolaylığı',
        'Ekipmanın görev başında çalışabilir ve görevlendirilebilir durumda olma derecesi',
        'Bir cihaz/sistemin belirtilen koşullar altında belirli bir süre boyunca gereken fonksiyonu yerine getirebilme yeteneği',
        'Bakım maliyetinin minimum olması'],
      answer: 2,
      explain: 'LEAN s.164: reliability, belirtilen koşullarda belirli bir süre için gerekli fonksiyonu yerine getirme yeteneğidir.' },
    { q: 'Notlara göre <b>availability</b>\'yi artırmak neleri içerir? (Birden fazla)',
      options: ['Arıza sayısını azaltmak (reliability)', 'Onarım süresini azaltmak (maintainability)', 'Hazırlık sürelerini 10 dakikanın altına indirmek (SMED)', 'Bakım performansı ölçümünden vazgeçmek'],
      answer: [0, 1],
      explain: 'LEAN s.165: availability\'yi artırmak, arıza sayısını azaltmayı (reliability) ve onarım süresini azaltmayı (maintainability) içerir.' },
    { q: 'Bakım maliyet eğrisinde (s.166) maintenance level arttıkça maliyetlerin davranışı nasıldır?',
      options: ['Planned maintenance cost azalır, corrective maintenance cost artar', 'Planned maintenance cost artar, corrective maintenance cost azalır',
        'İkisi de artar', 'İkisi de azalır'],
      answer: 1,
      explain: 'LEAN s.166: bakım seviyesi yükseldikçe planlı bakım maliyeti artar, düzeltici (arıza sonrası) bakım maliyeti azalır; M* dikey kesikli çizgiyle gösterilen bakım seviyesidir.' },
    { q: 'Notlardaki <b>bakım türleri</b> sınıflandırması hangisidir?',
      options: ['Predictive, Periodic ve Autonomous (corrective yok)', 'Corrective, Periodic, Autonomous, Visual', 'Planned, Preventive, Autonomous', 'Corrective, Planned (Periodic + Predictive)'],
      answer: 3,
      explain: 'LEAN s.167: corrective, planned, periodic ve predictive maintenance listelenir; TPM formülünde (s.173) planned maintenance = periodic + predictive olarak verilir.' },
    { q: 'Bakım türünü seçerken notlarda sayılan kriterler hangileridir? (Birden fazla)',
      options: ['Parçanın maliyeti', 'Parçanın bakım süresi', 'Parçanın tedarik süresi', 'Parçanın genel sistem içindeki kritikliği (önemi)'],
      answer: [0, 1, 2, 3],
      explain: 'LEAN s.168: seçim kriterleri 1) parçanın maliyeti, 2) bakım süresi, 3) tedarik süresi, 4) parçanın genel sistemdeki kritikliğidir.' },
    { q: 'RAMS metodolojisinin harfleri neyi ifade eder?',
      options: ['Repair, Availability, Maintenance, Safety', 'Reliability, Autonomy, Maintenance, Standardization', 'Reliability, Availability, Maintainability, Safety', 'Reliability, Availability, Maintenance, Stock'],
      answer: 2,
      explain: 'LEAN s.169: RAMS = Reliability, Availability, Maintainability, Safety.' },
    { q: 'Notlara göre <b>Productive Maintenance</b> nedir?',
      options: ['Tasarım–ürün yaşam döngüsü maliyeti ilkeleriyle uyumlu planlı bakım yaklaşımlarını birleştiren, güvenilirliği ve bakım yapılabilirliği artıran duruma dayalı sistematik bakım faaliyetleri',
        'Yalnızca operatörlerin yaptığı temizlik ve yağlama',
        'Arıza oluşana kadar bekleyip onarma yaklaşımı',
        'Bakım işlerinin tamamen dışarıdan hizmet alımıyla yapılması'],
      answer: 0,
      explain: 'LEAN s.170: TPM\'in birçok özelliği Productive Maintenance ile örtüşür; productive maintenance duruma dayalı sistematik bakım faaliyetleridir ve planlı bakım yaklaşımlarını yaşam döngüsü maliyeti ilkeleriyle birleştirir.' },
    { q: 'Notlardaki <b>TPM içeriği</b> (s.171) hangi unsurları kapsar? (Birden fazla)',
      options: ['Design for Maintenance ve Planned maintenance', 'Autonomous maintenance ve F-tags', 'Maintenance performance management (OEE, MTBF, MTTR)', 'Kanban sayısı hesabı ve MRP planlaması'],
      answer: [0, 1, 2],
      explain: 'LEAN s.171: TPM içeriği — design for maintenance, planned maintenance, autonomous maintenance (yağlama, sıkma, temizleme; one-point lessons, machine maps), F-tags, maintenance performance management (OEE, MTBF, MTTR).' },
    { q: 'TPM paradigma değişimini (s.172) en iyi anlatan ifade hangisidir?',
      options: ['Eski tutum ile TPM tutumu aynıdır; yalnızca isim değişmiştir',
        '"Hepimiz sorumluyuz" → "Ben işletirim, sen onarırsın"',
        '"Ben onarırım, sen işletirsin" → "Bakım departmanı sorumludur"',
        '"Ben işletirim, sen onarırsın" → "Ekipmanımızdan, tesisimizden ve geleceğimizden hepimiz sorumluyuz"'],
      answer: 3,
      explain: 'LEAN s.172: Old attitude "I operate, you fix; I fix, you design; I design, you operate" → TPM attitude "We are all responsible for our equipment, our plant, and our future".' },
    { q: 'Notlardaki TPM formülü (s.173) hangisidir?',
      options: ['TPM = Corrective Maintenance + Planned Maintenance + 5S',
        'TPM = Design for Maintenance + Planned Maintenance (Periodic + Predictive) + Autonomous Maintenance + Visual Maintenance Management',
        'TPM = Autonomous Maintenance + Kaizen + Poka-Yoke',
        'TPM = Design for Maintenance + Corrective + Predictive'],
      answer: 1,
      explain: 'LEAN s.173: TPM = Design for Maintenance + Planned Maintenance (Periodic Maintenance + Predictive Maintenance) + Autonomous Maintenance + Visual Maintenance Management.' },
    { q: 'TPM sütunları (Pillars of TPM, s.174) ile ilgili hangi ifadeler doğrudur? (Birden fazla)',
      options: ['Jishu Hozen (autonomous maintenance) ve Kobetsu Kaizen sütunlardandır', 'Planned Maintenance ve Quality Maintenance sütunlardandır', 'Training, Office TPM ile Safety, Health & Environment de sütunlardandır', 'Sütunların temeli (foundation) SMED\'dir'],
      answer: [0, 1, 2],
      explain: 'LEAN s.174: yedi sütun — Jishu Hozen, Kobetsu Kaizen, Planned Maintenance, Quality Maintenance, Training, Office TPM, Safety Health & Environment; temel 5S\'tir (SMED değil).' },
    { q: 'Autonomous maintenance şemasında (s.175) <b>operatörün</b> yaptığı işler hangileridir? (Birden fazla)',
      options: ['Clean — kir, talaş, yağ ve kirleticilerin temizlenmesi', 'Lubricate — yağlama föyüne göre yağlama', 'Inspect — sıvı seviyeleri, bağlantı uçları, filtreler, kablolar', 'Adjust — hava basıncı, bağlantı elemanları, sensörlerin (talimata göre) ayarı'],
      answer: [0, 1, 2, 3],
      explain: 'LEAN s.175: autonomous (self) maintenance; clean, lubricate, inspect, adjust. Anormallikler raporlanır ve gerekirse bakım iş talebi açılır.' },
    { q: 'Autonomous maintenance\'ın <b>yedi adımı</b> (s.176) sırasında ilk iki adım hangileridir?',
      options: ['1) Conduct general inspections · 2) Improve workplace management',
        '1) Establish provisional standards · 2) General inspection training',
        '1) Initial cleaning / inspection · 2) Eliminate sources of contamination',
        '1) Participate in advanced improvement activities · 2) Initial cleaning'],
      answer: 2,
      explain: 'LEAN s.176: 1) ilk temizlik/kontrol, 2) kirlenme kaynaklarını yok etme, 3) geçici standartlar, 4) genel kontrol eğitimi, 5) genel kontroller, 6) iş yeri yönetimi ve kontrolünü iyileştirme, 7) ileri iyileştirme faaliyetlerine katılım.' },
    { q: 'Autonomous maintenance <b>araçları</b> (s.177) hangileridir? (Birden fazla)',
      options: ['One-Point Lessons', 'Contamination Sources and Difficult Work Areas Map', 'Lubrication Map', 'Inspection Standards'],
      answer: [0, 1, 2, 3],
      explain: 'LEAN s.177: autonomous maintenance araçları — one point lessons, kirlenme kaynakları ve zor çalışılan yerler haritası, yağlama haritası, kontrol standartları.' }
  ];

  /* ==================== 2.10 Bakım performansı ve OEE ==================== */
  IM.content.summaries['2.10'] = `
<h2>2.10 Bakım performansı ve OEE</h2>
<p class="note">Ders notu: Lean Manufacturing s.183–199</p>

<h3>Bakım performans yönetimi (s.183)</h3>
<ul>
  <li><b>Performance</b> göstergeleri: <b>Overall Equipment Effectiveness (OEE)</b> · <b>TPM losses</b> · <b>MTBF</b> (Mean Time Between Failures — arızalar arası ortalama süre) · <b>MTTR</b> (Mean Time To Repair — ortalama onarım süresi).</li>
  <li><b>Management</b> araçları: <b>Failure Tags (F-tag)</b> ve <b>PM analysis</b>.</li>
</ul>

<h3>Üç kayıp grubu (s.184)</h3>
<p>Hedef <b>OEE'yi maksimize etmek</b>; bunun için <b>üç kayıp grubu</b> minimize edilir:</p>
<ul>
  <li><b>Time losses</b> (zaman kayıpları): ekipman arızaları · hazırlık (setup) ve ayar süreleri.</li>
  <li><b>Speed losses</b> (hız kayıpları): makinenin beklenen üretim hızında düşüş · kısa duruşlar.</li>
  <li><b>Quality losses</b> (kalite kayıpları): hatalı parça, yeniden işleme (rework), hurda (scrap).</li>
</ul>

<h3>OEE ve bileşenleri (s.185–188)</h3>
<div class="model">OEE = Availability × Performance efficiency × Quality ratio

Net available run time (yükleme süresi) = Gross time available − Planned downtime
      (planlı duruş: mola — öğle/çay — ve planlı bakım süresi)
Availability = (Net available run time − Downtime losses) / Net available run time
      (downtime losses: hazırlık süreleri, makine arıza süreleri)
Performance efficiency = Theoretical cycle time / Realized cycle time
      (s.189: = teorik çevrim süresi · işlenen miktar / çalışma süresi)
Quality ratio = Quality (good) products / Total products produced
      (s.189: = (işlenen miktar − hatalı miktar) / işlenen miktar)</div>
<ul>
  <li><b>Performance efficiency</b>: makinenin gerçekleşen çevrim süresi, <b>makine yaşlanması (aging)</b> nedeniyle genellikle uzar; bakımla bir ölçüde önlenebilir.</li>
  <li><b>Quality ratio</b>: makine bakımıyla <b>hatalı ürün üretimi</b> ortadan kaldırılmaya çalışılır.</li>
</ul>

<h3>Altı büyük kayıp (six big losses) ve s.189 çözümlü örnek</h3>
<table>
  <tr><th>Kayıp grubu</th><th>Altı büyük kayıp</th><th>Etkilediği bileşen</th></tr>
  <tr><td>Downtime losses</td><td>1 Equipment failure · 2 Setup and adjustment</td><td>Availability</td></tr>
  <tr><td>Speed losses</td><td>3 Idling and minor stoppages · 4 Reduced speed</td><td>Performance efficiency</td></tr>
  <tr><td>Defect losses</td><td>5 Defects in process · 6 Reduced yield</td><td>Quality ratio</td></tr>
</table>
<p>Süre ağacı: Loading time → (downtime losses çıkarılır) → <b>Operating time</b> → (speed losses çıkarılır) → <b>Net operating time</b> → (defect losses çıkarılır) → <b>Valuable operating time</b>.</p>
<div class="model">Availability = (460 − 60) / 460 = 0.8696 → %86.96  (slaytta %87)
Performance = 0.5 dk/adet · 400 adet / 400 dk = 0.50 → %50
Quality     = (400 − 8) / 400 = 0.98 → %98
OEE = 0.8696 · 0.50 · 0.98 = 0.4261 → %42.6
      (slayt yuvarlanmış 0.87 ile: 0.87 · 0.50 · 0.98 = 0.4263 → %42.6)
Kontrol (değerli çalışma süresi): 0.5 · 392 = 196 dk → 196 / 460 = 0.4261</div>

<h3>OEE grafikleri (s.190–192)</h3>
<ul>
  <li><b>OEE Graph (s.190)</b>: bir TV fabrikasının aylık (Ocak–Ağustos) OEE oranı %63, 68, 59, 66, 69, 78, 65, 67; altında availability, performance ve quality oranlarının ayrı grafikleri (bu üçü iyileştikçe OEE artar — oklar yukarı = iyi). Kontrol: Ağustos için 0.92 · 0.75 · 0.97 = 0.669 → %67.</li>
  <li><b>Equipment Loss Graphs (s.191)</b>: arıza oranı (%), set-up kayıpları (saat/ay), başlangıç (start-up) kayıpları, küçük duruş ve boşta çalışma kayıpları (saat/ay), hata ve tamir kayıpları (adet/ay) — oklar aşağı = iyi.</li>
  <li><b>Management Loss Graphs (s.192)</b>: yönetim kayıpları (saat/ay); aşağı ok = iyi.</li>
</ul>

<h3>Failure Tags — F-TAG (s.193–195)</h3>
<ul>
  <li>Ekipman üzerinde gözlenen anormallik/arıza, <b>etiket (tag)</b> asılarak işaretlenir. İki tür etiket: <b>Planned Maintenance</b> etiketi (bakım ekibi çözer) ve <b>Autonomous Maintenance</b> etiketi (operatör çözer); etikette ekipman adı, kontrol no, hatanın bulunduğu tarih, bulan kişi ve hata tanımı yazılır (s.193).</li>
  <li><b>F-Tag List (s.194)</b>: tag no, yer, bulan kişi, tarih, hata nedeni, tür (operatör / bakım / diğer), çözüm önerisi, F-tag çözen kişi.</li>
  <li><b>F-TAG Analysis (s.195)</b>: yıllara göre <b>asılan (hanged)</b> ve <b>çözülen (solved)</b> etiket sayıları (2019–2023, grafikte okunan değerler: asılan 0, 50, 3738, 12158, 26068; çözülen yaklaşık 0, 48, 3133, 9987, 24204). Örnek (notlarda yok): 2023'te çözüm oranı 24204 / 26068 = %92.85.</li>
</ul>

<h3>PM Analysis (s.196–199)</h3>
<p><b>PM analysis</b> (Phenomena Mechanism analysis): TPM'in en iyi uygulamasına dayalı olarak, makine mekanizmasının <b>fiziksel kök nedenlerini doğru belirleyip</b> etkili karşı önlemler geliştirmek ve ekipman durumunu değiştirmek için kullanılan analizdir (s.196). s.197'de <b>tek yollu 5-Why, Why-Why, WWLBA ve P-M Analysis</b> karşılaştırılır; P-M Analysis'te fenomenden <b>fiziksel boşluğa (physical gap, "P-M gap")</b>, oradan alt sistem–birim–bileşen düzeyinde boşluklara inilir. s.198: P-M Analysis story board düzeni (ekip profili, trend grafikleri, çalışma prensibi OPL'leri, 5W1H, fenomen özeti, hedef belirleme, plan–uygulama–kontrol, otonom/planlı bakım standartları, fayda özeti); s.199: bir PM analiz örneği.</p>

<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
  <li><b>Availability ≠ performance ≠ quality</b>: availability zaman kaybı (arıza + setup), performance hız kaybı (teorik / gerçekleşen çevrim süresi), quality hatalı ürün oranı. <b>OEE bunların çarpımıdır</b> (toplamı veya ortalaması değil).</li>
  <li>Availability paydası <b>net available run time</b>'dır (brüt süre − <b>planlı duruş</b>); planlı duruşlar (mola, planlı bakım) kayıp sayılmaz, <b>downtime losses</b> (setup, arıza) kayıptır.</li>
  <li>s.189 örneğinde performance = <b>0.5 · 400 / 400 = %50</b> (operating time = 460 − 60 = 400 dk); quality = (400 − 8) / 400 = <b>%98</b>; OEE = <b>%42.6</b> (0.87 yuvarlamasıyla 0.4263, tam değerle 0.4261).</li>
  <li>Setup ve ayar süreleri <b>zaman kaybı (availability)</b>, kısa duruşlar ve düşük hız <b>hız kaybı (performance)</b>, hurda/rework <b>kalite kaybıdır</b>.</li>
  <li><b>MTBF</b> arızalar arası, <b>MTTR</b> onarım süresidir; <b>F-tag</b> iki türdür (planned maintenance / autonomous maintenance); <b>PM analysis</b> 5-Why'den farklı olarak fiziksel boşluğa (physical gap) odaklanır.</li>
</ul></div>
`;

  IM.content.concepts['2.10'] = [
    { q: 'Notlarda <b>bakım performansı</b> kapsamında sayılan performans göstergeleri hangileridir? (Birden fazla)',
      options: ['Overall Equipment Effectiveness (OEE)', 'TPM losses', 'MTBF ve MTTR', 'Kanban sayısı (KS)'],
      answer: [0, 1, 2],
      explain: 'LEAN s.183: Maintenance performance management — performance: OEE, TPM losses, MTBF, MTTR; management: failure tags ve PM analysis.' },
    { q: 'OEE\'yi düşüren <b>üç kayıp grubu</b> ve doğru eşleştirmesi hangisidir?',
      options: ['Üç grup: maliyet, kalite ve teslimat kayıpları',
        'Time losses: hurda ve rework · Speed losses: arızalar · Quality losses: setup süreleri',
        'Time losses: kısa duruşlar · Speed losses: setup süreleri · Quality losses: arızalar',
        'Time losses: arızalar, setup/ayar · Speed losses: beklenen hızda düşüş, kısa duruşlar · Quality losses: hatalı parça, rework, hurda'],
      answer: 3, hint: 'Zaman → duruşlar, hız → yavaşlama ve kısa duruş, kalite → hatalı ürün.',
      explain: 'LEAN s.184: time losses (equipment failures, setup/adjustment), speed losses (düşen üretim hızı, short stoppages), quality losses (defective parts, rework, scrap).' },
    { q: 'OEE formülü hangisidir?',
      options: ['OEE = Availability × Performance efficiency × Quality ratio',
        'OEE = Availability + Performance efficiency + Quality ratio',
        'OEE = (Availability + Performance efficiency + Quality ratio) / 3',
        'OEE = Availability × Quality ratio (performans ayrıca ölçülmez)'],
      answer: 0,
      explain: 'LEAN s.185: OEE = Availability × Performance efficiency × Quality ratio. Üç oran çarpılır; toplam veya ortalama alınmaz.' },
    { q: '<b>Net available run time</b> nasıl hesaplanır ve planlı duruşa neler girer?',
      options: ['Brüt süre + planlı duruş',
        'Brüt süre − downtime losses; downtime: arıza ve setup süreleri',
        'Brüt süre − planlı duruş; planlı duruş: mola (öğle/çay) ve planlı bakım süresi',
        'Çalışma süresi − hurda süresi'],
      answer: 2,
      explain: 'LEAN s.187: net available run time = gross time available − planned downtime; planned downtime = mola süreleri (öğle, çay) ve planlı bakım süresidir. Arıza ve setup ise downtime losses\'tur.' },
    { q: 'Availability oranı hangisiyle hesaplanır?',
      options: ['Teorik çevrim süresi / Gerçekleşen çevrim süresi', '(Net available run time − Downtime losses) / Net available run time', '(İşlenen miktar − hatalı miktar) / işlenen miktar', 'Downtime losses / Gross time available'],
      answer: 1,
      explain: 'LEAN s.187: availability = (net available run time − downtime losses) / net available run time; downtime losses = setup süreleri ve makine arıza süreleri. Teorik / gerçekleşen çevrim süresi performance efficiency, iyi ürün oranı quality ratio\'dur.' },
    { q: '<b>Performance efficiency</b> notlarda nasıl tanımlanır?',
      options: ['Gerçekleşen çevrim süresi / Teorik çevrim süresi', 'Çalışma süresi / yükleme süresi', 'İyi ürün sayısı / toplam ürün sayısı', 'Teorik çevrim süresi / Gerçekleşen çevrim süresi'],
      answer: 3, hint: 'Makine yaşlandıkça gerçek çevrim süresi uzar → oran düşer.',
      explain: 'LEAN s.188: performance efficiency = theoretical cycle time / realized cycle time; makine yaşlanması gerçekleşen çevrim süresini uzatır ve oran düşer. s.189\'da teorik çevrim süresi · işlenen miktar / çalışma süresi olarak yazılmıştır.' },
    { q: '<b>Quality ratio</b> hangisidir?',
      options: ['Teorik çevrim süresi / gerçekleşen çevrim süresi', 'Toplam hatalı ürün sayısı / toplam üretilen ürün sayısı', 'Toplam kaliteli ürün sayısı / toplam üretilen ürün sayısı', 'Net available run time / gross time'],
      answer: 2,
      explain: 'LEAN s.186: quality ratio = total number of quality products / total number of products produced; s.189\'da (işlenen miktar − hatalı miktar) / işlenen miktar.' },
    { q: 'Altı büyük kayıptan <b>hangileri availability</b> (downtime losses) bileşenini etkiler? (Birden fazla)',
      options: ['Equipment failure (ekipman arızası)', 'Setup and adjustment (hazırlık ve ayar)', 'Idling and minor stoppages (boşta çalışma ve kısa duruşlar)', 'Defects in process (proses hataları)'],
      answer: [0, 1],
      explain: 'LEAN s.189: 1 equipment failure ve 2 setup and adjustment downtime losses\'tur (availability); 3 idling/minor stoppages ve 4 reduced speed speed losses\'tur (performance); 5 defects in process ve 6 reduced yield defect losses\'tur (quality).' },
    { q: 'Altı büyük kayıptan <b>hangileri performance efficiency</b> (speed losses) bileşenini etkiler? (Birden fazla)',
      options: ['Idling and minor stoppages', 'Reduced speed', 'Reduced yield', 'Equipment failure'],
      answer: [0, 1],
      explain: 'LEAN s.189: speed losses = idling and minor stoppages (3) ve reduced speed (4). Reduced yield kalite kaybıdır (6), equipment failure ise downtime kaybıdır (1).' },
    { q: 's.189 örneğinde loading time = 460 dk, downtime = 60 dk. <b>Availability</b> yaklaşık kaçtır?',
      options: ['%86.96 (slaytta %87)', '%13.04', '%98', '%50'],
      answer: 0,
      explain: 'LEAN s.189: availability = (460 − 60) / 460 = 0.8696 → %86.96 ≈ %87. %13.04 kayıp oranıdır (60 / 460).' },
    { q: 's.189 örneğinde teorik çevrim süresi 0.5 dk/adet, işlenen miktar 400 adet, çalışma süresi 400 dk. <b>Performance efficiency</b> kaçtır?',
      options: ['%98', '%100', '%87', '%50'],
      answer: 3, hint: '0.5 · 400 = 200 dk "olması gereken" süre; gerçekte 400 dk harcanmış.',
      explain: 'LEAN s.189: performance efficiency = 0.5 · 400 / 400 = 0.50 → %50. Çalışma süresi 460 − 60 = 400 dk\'dır.' },
    { q: 's.189 örneğinde availability %86.96, performance %50, işlenen 400 adetin 8\'i hatalı (quality %98). <b>OEE</b> yaklaşık kaçtır?',
      options: ['%78.32 (ortalama)', '%42.6', '%98', '%62.5'],
      answer: 1,
      explain: 'LEAN s.189: OEE = 0.8696 · 0.50 · 0.98 = 0.4261 → %42.6 (slaytta 0.87 · 0.50 · 0.98 = 0.4263 → %42.6). Üç oran çarpılır; ortalama (%78.32) yanlıştır. Kontrol: 0.5 · 392 / 460 = 0.4261.' },
    { q: 'OEE grafiğindeki (s.190) bir ayda availability %92, performance %75, quality %97 ise OEE yaklaşık kaçtır?',
      options: ['%88', '%92', '%67', '%75'],
      answer: 2,
      explain: 'LEAN s.190 (Ağustos): 0.92 · 0.75 · 0.97 = 0.669 → %67; grafikte Ağustos OEE değeri %67\'dir. Ortalama (%88) alınmaz.' },
    { q: '<b>F-TAG</b> (Failure Tag) için hangisi doğrudur?',
      options: ['Yalnızca planlı bakım ekibinin kullandığı tek tür etikettir',
        'Çalışan öneri formudur',
        'Kanban kartının bir türüdür',
        'İki türü vardır: Planned Maintenance etiketi ve Autonomous Maintenance etiketi; ekipman üzerindeki anormalliği işaretler'],
      answer: 3,
      explain: 'LEAN s.193–194: F-tag\'ler Planned Maintenance ve Autonomous Maintenance olmak üzere iki türdür; etikette ekipman adı, kontrol no, bulunma tarihi, bulan kişi ve hata tanımı yer alır; F-Tag List\'te izlenir. s.195\'te asılan/çözülen sayıları yıllara göre analiz edilir.' },
    { q: '<b>PM analysis</b> (Phenomena Mechanism analysis) notlara göre ne amaçla kullanılır?',
      options: ['Makine mekanizmasının fiziksel kök nedenlerini doğru belirleyerek etkili karşı önlemler geliştirmek', 'Hazırlık sürelerini 10 dakikanın altına indirmek', 'Kanban sayısını hesaplamak', 'OEE\'nin üç bileşenini çarpmak'],
      answer: 0,
      explain: 'LEAN s.196: PM analysis, TPM\'in en iyi uygulamasına dayalı olarak ekipman durumunu değiştirmek için makine mekanizmasının fiziksel kök nedenlerini doğru belirleyerek etkili karşı önlemler geliştirmeyi amaçlar. s.197\'de 5-Why, Why-Why, WWLBA ile karşılaştırılır.' }
  ];

  IM.content.cheatsheet += `
    <h2>Bölüm 2 · Lean Manufacturing (2)</h2>
    <h3>2.6 SMED</h3>
    <div class="model">Set-up time = son iyi ürün (önceki parti) → ilk kabul edilebilir ürün (sonraki parti)
SMED &lt; 10 dk · OTED &lt; 1 dk · NOTED = otomatik
Internal setup = makine durmuşken (kalıp takma/sökme) · External setup = makine çalışırken (taşıma, hazırlık)
Stage 0 ayırt etme yok · Stage 1 iç/dış ayırma (en önemli) · Stage 2 iç → dış (%30–50 azalma) · Stage 3 radikal iyileştirme</div>
    <h3>2.7 Push / pull, MRP grafiği, Kanban</h3>
    <table>
      <tr><th></th><th>Push (ERP, MRP)</th><th>Pull (Kanban, CONWIP, POLCA)</th></tr>
      <tr><td>Giriş kararı</td><td>talebe göre çizelgeler</td><td>sistemin durumuna göre çeker</td></tr>
      <tr><td>Parametre</td><td>deterministik, ofiste</td><td>stokastik, sahada</td></tr>
      <tr><td>Alan / stok / lead time</td><td>yüksek</td><td>iyileştirir</td></tr>
      <tr><td>Talep değişkenliği, ürün çeşitliliği</td><td>çalışır</td><td>sorunlu</td></tr>
    </table>
    <div class="model">KS = ⌈ OT · (1 + α) · KCS / KB ⌉    OT: adet/dk · KCS: dk · KB: adet/konteyner · α: güvenilirlik katsayısı
SYK 160: OT = 32 / 540 = 0.0593 · KCS = 10 + 72 + 810 = 892 dk · α = 0.30 · KB = 8 → 8.59 → KS = 9
Envanter: push 6 · 30 + 12 · 18 = 396 → pull 9 · 8 + 6 · 3 = 90 → azalma %77.27
MRP grafiği: planlı sipariş haftası = ihtiyaç haftası − lead time (geriye)
A 100 (hf 7) → A hf 6 · B 200 hf 4 · C 300 hf 4 · D 800 hf 2 · E 400 hf 3 · F 600 hf 3</div>
    <p>Kanban türleri: groove system · kanban square · two bin · CONWIP · signal kanban. Two-card: production kanban + withdrawal kanban. Kanban board: kırmızı acil, sarı daha az acil, yeşil acil değil.</p>
    <h3>2.8 Kaizen, görsel yönetim, Poka-Yoke</h3>
    <ul>
      <li>Kaizen = KAI (değişim) + ZEN (iyi); Imai: üst yönetim dahil herkesle sürekli iyileştirme. Western = sıçrama, Kaizen = çok sayıda küçük adım.</li>
      <li>A3: problem · background · current condition · cause analysis · target · implementation plan · follow-up · results.</li>
      <li>Öneri puanı: çözüm bulma + uygulama 4 / 8 / 16 · çözüm önerme 2 / 4 / 8 · problem bulma-katılım 1 / 2 / 4; 40 puan = ödül.</li>
      <li>Duyularla bilgi: görme %83, işitme %11, koklama %4, dokunma %1, tat %1. Asakai panoları: Task Assignment, Production Performance Tracking (QCDSM).</li>
      <li>Skill matrix: 0 yapamaz · 1 lider kontrolüyle · 2 tek başına · 3 öğretebilir · 4 iyileştirebilir. 3*3*3: her çalışan ≥ 3 iş, her iş ≥ 3 çalışan.</li>
      <li>Poka-Yoke (poka = dikkatsizlik hatası, yoke = önlemek) araçları: sensör · ışık/ses uyarısı · asimetri · renk kodlama · sayı kodlama.</li>
    </ul>
    <h3>2.9 Bakım ve TPM</h3>
    <div class="model">TPM = Design for Maintenance + Planned Maintenance (Periodic + Predictive) + Autonomous Maintenance + Visual Maintenance Management
Availability ↑ = arıza sayısı ↓ (reliability) + onarım süresi ↓ (maintainability)
Bakım türü seçimi: parça maliyeti · bakım süresi · tedarik süresi · kritiklik     RAMS = Reliability, Availability, Maintainability, Safety</div>
    <p>TPM sütunları (temel 5S): Jishu Hozen · Kobetsu Kaizen · Planned Maintenance · Quality Maintenance · Training · Office TPM · Safety, Health &amp; Environment. Autonomous maintenance 7 adım: ilk temizlik/kontrol → kirlenme kaynaklarını yok et → geçici standartlar → kontrol eğitimi → genel kontrol → iş yeri yönetimi → ileri iyileştirme. Araçlar: one-point lesson, kirlenme/zor alan haritası, yağlama haritası, kontrol standartları.</p>
    <h3>2.10 OEE</h3>
    <div class="model">OEE = Availability × Performance efficiency × Quality ratio
Availability = (net available run time − downtime losses) / net available run time      (net = brüt − planlı duruş)
Performance = teorik çevrim süresi · işlenen miktar / çalışma süresi
Quality     = (işlenen miktar − hatalı miktar) / işlenen miktar
Örnek s.189: (460 − 60) / 460 = 0.8696 · 0.5 · 400 / 400 = 0.50 · (400 − 8) / 400 = 0.98 → OEE = 0.4261 (%42.6)</div>
    <p>Altı büyük kayıp: arıza, setup/ayar (availability) · boşta/kısa duruş, düşük hız (performance) · proses hatası, düşük verim (quality). MTBF = arızalar arası ortalama süre, MTTR = ortalama onarım süresi. F-tag: planned / autonomous maintenance. PM analysis: fiziksel kök neden (physical gap).</p>
  `;
})();
