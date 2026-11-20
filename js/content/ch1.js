/* Bölüm 1 · CIM'e Giriş — özet, kavram soruları, formül kartı bölümü.
   Düz script (ES module yok); window.IM.content'e ekler.
   Kaynak: Introduction to CIM (INT) s.1–14 ve When CIM (WHEN) s.1–5. INT s.6 ve s.11'deki "Product Cycle" akış şemaları
   görsel olarak okunmuştur. Notlarda sayısal örnek YOKTUR; 1.2'deki sayısal örnek (B=10, Q=50, T1=2, T2=10, T3=400)
   "(notlarda yok)" etiketiyle verilmiş ve node ile doğrulanmıştır (TTLC = 1500, TLC = 3.00). */
(function () {
  const IM = window.IM;

  /* ------------------------------------------------------------------ 1.1 */
  IM.content.summaries['1.1'] = `
<h2>1.1 Üretim, performans ölçütleri ve CIM tanımı</h2>
<p class="note">Ders notu: Introduction to CIM s.1–11</p>

<h3>Ulusal hedef ve üretimin tanımı (INT s.2–4)</h3>
<ul>
  <li><b>National Target:</b> ulusal ekonominin büyümesi → yaşam standardının yükselmesi ve istihdam yaratılması.</li>
  <li>Üretim <b>teknolojik, ekonomik ve tarihsel</b> olarak önemlidir. <b>Technology</b> = bilimin, toplumun ve üyelerinin ihtiyaç duyduğu / istediği şeyleri sağlamak üzere uygulanmasıdır.</li>
  <li><b>Teknolojik tanım:</b> manufacturing, verilen bir başlangıç malzemesinin geometrisini, özelliklerini ve/veya görünümünü değiştirmek için <b>fiziksel ve kimyasal süreçlerin</b> uygulanmasıdır (parça veya ürün yapmak için); birden çok parçanın ürün yapmak üzere <b>montajını</b> da içerir.</li>
  <li><b>Ekonomik tanım:</b> manufacturing, malzemelerin bir veya daha fazla işleme ve/veya montaj operasyonuyla <b>daha yüksek değerli ürünlere dönüştürülmesidir</b>.</li>
  <li>Üretim bir <b>faaliyetler dizisidir</b>; çıktıları <b>ürün veya hizmettir</b> (Outputs: Products or service).</li>
</ul>

<h3>Üretimde performans ölçütleri (INT s.5)</h3>
<div class="model">Low Cost · High Quality · In Time · High Effectiveness · High Efficiency
High Flexibility (Time, amount, product variety)</div>
<p>Esneklik (flexibility) notlarda üç boyutla verilir: <b>zaman, miktar, ürün çeşitliliği</b>.</p>

<h3>Ürün döngüsü — tasarım ve imalat (INT s.6, görsel şema)</h3>
<p>Akış: <b>Customer / markets → Product Concept → Design Engineering → Draft → Process Planning</b>. Process Planning'den iki kol ayrılır:
(a) <b>Order for new equipment / tools / machines / material</b> → Manufacturing, (b) <b>Scheduling → Manufacturing</b>.
Manufacturing → <b>Quality Control</b>; Quality Control çıktısı hem <b>Manufacturing'e geri</b> (düzeltme/yeniden işleme oku) hem <b>Customer / markets'e</b> gider ve döngü kapanır.</p>

<h3>CIM tanımı (INT s.7–8)</h3>
<ul>
  <li><b>Computer-integrated manufacturing (CIM)</b> hem bir <b>üretim yöntemi</b> hem de bir üretim işletmesinin mühendislik, üretim, pazarlama ve destek fonksiyonlarının düzenlendiği <b>bilgisayar-otomatik sistemdir</b>.</li>
  <li>Tasarım, analiz, planlama, satın alma, maliyet muhasebesi, stok kontrolü ve dağıtım; malzeme taşıma ve yönetimi gibi <b>fabrika zemini fonksiyonlarıyla bilgisayar üzerinden bağlanır</b> ve tüm operasyonlar doğrudan kontrol edilip izlenir.</li>
  <li><b>CIM'i diğer üretim metodolojilerinden ayıran üç bileşen:</b> (1) veriyi saklama, geri çağırma, işleme ve sunma araçları; (2) durumu algılama (sensing) ve süreçleri değiştirme mekanizmaları; (3) veri işleme bileşenini algılama/değiştirme bileşeniyle birleştiren algoritmalar.</li>
  <li>CIM, bilgi ve iletişim teknolojilerinin (ICT) imalata uygulanmasına bir örnektir. CIM en az <b>iki bilgisayarın bilgi alışverişi</b> yaptığını varsayar; örnek: bir kol robotunun kontrolörü ile bir CNC tezgâhının mikro-kontrolörü.</li>
</ul>

<h3>CIM uygulaması düşünülürken dikkate alınan faktörler (INT s.9)</h3>
<ul>
  <li>üretim hacmi (production volume),</li>
  <li>entegrasyonu yapacak şirketin / personelin deneyimi,</li>
  <li>entegrasyon düzeyinin ürünün kendisine yansıması (level of integration into the product itself),</li>
  <li>üretim süreçlerinin entegrasyonu.</li>
</ul>
<p>CIM, şirkette <b>yüksek düzeyde ICT</b> kullanıldığı yerde (CAD/CAM sistemleri, süreç planlaması ve verisinin varlığı) en yararlıdır.</p>

<h3>Uluslararası kısaltmalar (INT s.10)</h3>
<table>
  <tr><th>Kısaltma</th><th>Açılım</th><th>Türkçe (slayt)</th></tr>
  <tr><td>CIM</td><td>Computer Integrated Manufacturing</td><td>Bilgisayarla Bütünleşik Üretim</td></tr>
  <tr><td>CAD</td><td>Computer Aided Design</td><td>Bilgisayar Destekli Tasarım</td></tr>
  <tr><td>CAPP</td><td>Computer Aided Process Planning</td><td>Bilgisayar Destekli Süreç Planlaması</td></tr>
  <tr><td>CAM</td><td>Computer Aided Manufacturing</td><td>Bilgisayar Destekli Üretim</td></tr>
  <tr><td>CAQ</td><td>Computer Aided Quality</td><td>Bilgisayar Destekli Kalite</td></tr>
  <tr><td>CAH</td><td>Computer Aided Handling</td><td>Bilgisayar Destekli Taşıma</td></tr>
</table>

<h3>Ürün döngüsü — CIM ile iyileştirilmiş (INT s.11, görsel şema)</h3>
<p>Aynı akış, her adıma bir bilgisayar destekli blok eklenerek çizilir: <b>Computer Aided Design</b> → Product Concept ve Design Engineering'i besler; <b>Automatic … and Documentation</b> (slayttaki yazım: "Automatic and Documentation") → Draft; <b>Computer Aided Process Planning</b> → Process planning; CAPP ayrıca <b>Scheduling Softwares, Material Requirement Planning, Shop Floor Control</b> bloğuna bağlanır;
bu blok Manufacturing Scheduling'i ve <b>Computer Controlled Machines / Robots</b> bloğunu besler (→ Manufacturing); <b>Computer Aided Quality Control</b> → Quality Control. Slayttaki "Materails Requirement Planning" yazım hatası "Material Requirement Planning" olarak okunur.</p>

<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
  <li>CIM yalnızca "otomasyon" değildir: tanım gereği <b>yöntem + bilgisayar-otomatik sistem</b>dir; ayırıcı üç bileşen veri işleme, algılama/değiştirme ve bunları birleştiren algoritmalardır.</li>
  <li>CIM en az <b>iki</b> bilgisayarın bilgi alışverişini içerir (robot kontrolörü ↔ CNC mikro-kontrolörü örneği).</li>
  <li>Kısaltmaları karıştırma: <b>CAQ</b> = Computer Aided <b>Quality</b>, <b>CAH</b> = Computer Aided <b>Handling</b> (taşıma), <b>CAPP</b> = Process Planning (süreç planlaması).</li>
  <li>Performans ölçütlerinde <b>effectiveness</b> ile <b>efficiency</b> ayrı satırlardır; flexibility üç boyutludur (zaman, miktar, ürün çeşitliliği).</li>
  <li>Üretimin <b>teknolojik</b> tanımı fiziksel/kimyasal süreçler ve montaj üzerinedir; <b>ekonomik</b> tanımı "daha yüksek değere dönüştürme"dir.</li>
</ul></div>
`;

  IM.content.concepts['1.1'] = [
    {
      q: 'Ders notlarına göre <b>teknolojik</b> açıdan manufacturing nedir?',
      options: [
        'Malzemelerin bir veya daha fazla işleme/montaj operasyonuyla daha yüksek değerli ürünlere dönüştürülmesi',
        'Başlangıç malzemesinin geometrisini, özelliklerini ve/veya görünümünü fiziksel ve kimyasal süreçlerle değiştirmek; çok parçalı ürünlerde montajı da içerir',
        'Yalnızca talaşlı imalat tezgâhlarında parça işlenmesi',
        'Bilgisayarların fabrika zemini fonksiyonlarını yönetmesi'
      ],
      answer: 1,
      explain: 'INT s.4: teknolojik tanım fiziksel ve kimyasal süreçlerle geometri/özellik/görünüm değiştirmek ve montajdır. Birinci seçenek <b>ekonomik</b> tanımdır.',
      hint: '"Fiziksel ve kimyasal süreçler" ifadesini ara.'
    },
    {
      q: 'Ders notlarına göre <b>ekonomik</b> açıdan manufacturing nedir?',
      options: [
        'Fiziksel ve kimyasal süreçlerle geometri değiştirmek',
        'Malzemelerin bir veya daha fazla işleme ve/veya montaj operasyonuyla daha yüksek değerli ürünlere dönüştürülmesi',
        'Stokların en aza indirilmesi',
        'Ürünlerin müşteriye en ucuz fiyatla satılması'
      ],
      answer: 1,
      explain: 'INT s.4: ekonomik tanım "transformation of materials into items of greater value" ifadesidir.'
    },
    {
      q: 'INT s.5\'e göre <b>Performance Measures for Manufacturing</b> listesinde yer alanlar hangileridir? (Birden fazla doğru)',
      options: [
        'Low Cost',
        'High Quality',
        'In Time',
        'High Flexibility (time, amount, product variety)',
        'High Inventory Level',
        'Maximum Number of Operators'
      ],
      answer: [0, 1, 2, 3],
      explain: 'INT s.5: Low Cost, High Quality, In Time, High Effectiveness, High Efficiency, High Flexibility. Yüksek stok ve azami işçi sayısı ölçüt değildir.'
    },
    {
      q: 'Notlarda <b>flexibility</b> hangi üç boyutla birlikte anılır?',
      options: [
        'Maliyet, kalite, teslimat',
        'Zaman, miktar, ürün çeşitliliği',
        'Tasarım, planlama, imalat',
        'Hız, doğruluk, güvenlik'
      ],
      answer: 1,
      explain: 'INT s.5: "High Flexibility (Time, amount, product variety)".'
    },
    {
      q: '"National Target" başlığı altında ders notları ulusal ekonominin büyümesinin hangi sonuçlarını sayar? (Birden fazla doğru)',
      options: [
        'Yaşam standardının yükselmesi',
        'İstihdamın yaratılması',
        'İthalatın artırılması',
        'Üretimde tüm insan işgücünün kaldırılması'
      ],
      answer: [0, 1],
      explain: 'INT s.2: Growth of National Economy → improvement of standard of living, creation of employments.'
    },
    {
      q: 'CIM tanımına göre CIM nedir?',
      options: [
        'Yalnızca CNC tezgâhlarının birbirine bağlanması',
        'Hem bir üretim yöntemi hem de işletmenin mühendislik, üretim, pazarlama ve destek fonksiyonlarının düzenlendiği bilgisayar-otomatik bir sistem',
        'Sadece bilgisayar destekli tasarım yazılımı',
        'İnsansız (işçisiz) fabrika'
      ],
      answer: 1,
      explain: 'INT s.7: CIM "both a method of manufacturing and a computer-automated system in which individual engineering, production, marketing, and support functions … are organized".',
      hint: 'Tanımda "ikisi birden" vurgusu var.'
    },
    {
      q: 'CIM\'i diğer üretim metodolojilerinden ayıran <b>üç bileşen</b> hangileridir? (Birden fazla doğru)',
      options: [
        'Veriyi saklama, geri çağırma, işleme ve sunma araçları',
        'Durumu algılama ve süreçleri değiştirme mekanizmaları',
        'Veri işleme bileşenini algılama/değiştirme bileşeniyle birleştiren algoritmalar',
        'Hücresel yerleşim ve 5S',
        'Kanban kartları'
      ],
      answer: [0, 1, 2],
      explain: 'INT s.8: üç bileşen = veri işleme araçları, sensing/modification mekanizmaları, ikisini birleştiren algoritmalar. Hücresel yerleşim ve 5S/Kanban lean araçlarıdır (WHEN s.2).'
    },
    {
      q: 'Notlara göre "CIM" en az kaç bilgisayarın bilgi alışverişini ima eder ve örnek olarak ne verilir?',
      options: [
        'En az bir bilgisayar; örnek: CAD terminali',
        'En az iki bilgisayar; örnek: kol robotunun kontrolörü ile CNC tezgâhının mikro-kontrolörü',
        'En az üç bilgisayar; örnek: CAD, CAM, CAQ sunucuları',
        'En az on bilgisayar; örnek: tüm fabrika ağı'
      ],
      answer: 1,
      explain: 'INT s.8: "CIM implies that there are at least two computers exchanging information, e.g. the controller of an arm robot and a micro-controller of a CNC machine."'
    },
    {
      q: 'CIM uygulaması düşünülürken ders notlarının saydığı faktörler hangileridir? (Birden fazla doğru)',
      options: [
        'Üretim hacmi',
        'Şirketin / personelin entegrasyonu yapma deneyimi',
        'Entegrasyon düzeyinin ürünün kendisine yansıması',
        'Üretim süreçlerinin entegrasyonu',
        'Şirketin kuruluş yılı'
      ],
      answer: [0, 1, 2, 3],
      explain: 'INT s.9: production volume, experience of the company or personnel, level of integration into the product itself, integration of the production processes.'
    },
    {
      q: 'Notlara göre CIM en çok hangi koşulda yararlıdır?',
      options: [
        'Şirkette ICT düzeyi düşük olduğunda, bilgisayarlar henüz yokken',
        'Şirkette yüksek düzeyde ICT kullanıldığında (CAD/CAM sistemleri, süreç planlaması ve verisinin varlığı gibi)',
        'Yalnızca tek parça (prototip) üretiminde',
        'Yalnızca montaj hatlarında'
      ],
      answer: 1,
      explain: 'INT s.9: "CIM is most useful where a high level of ICT is used in the company or facility, such as CAD/CAM systems, the availability of process planning and its data."'
    },
    {
      q: 'Kısaltma–açılım eşleşmesi hangi seçenekte <b>doğrudur</b>?',
      options: [
        'CAQ = Computer Aided Quantity; CAH = Computer Aided Handling',
        'CAQ = Computer Aided Quality; CAH = Computer Aided Handling',
        'CAQ = Computer Aided Quality; CAH = Computer Aided Hardware',
        'CAPP = Computer Aided Product Planning; CAM = Computer Aided Machining'
      ],
      answer: 1,
      explain: 'INT s.10: CAQ = Computer Aided Quality (Bilgisayar Destekli Kalite), CAH = Computer Aided Handling (Bilgisayar Destekli Taşıma), CAPP = Computer Aided <b>Process</b> Planning, CAM = Computer Aided <b>Manufacturing</b>.'
    },
    {
      q: 'INT s.11 ("Product Cycle improved by CIM") şemasında <b>Process planning</b> adımını besleyen bilgisayar destekli blok hangisidir?',
      options: [
        'Computer Aided Design',
        'Computer Aided Process Planning',
        'Computer Aided Quality Control',
        'Computer Controlled Machines / Robots'
      ],
      answer: 1,
      explain: 'INT s.11: CAPP → Process planning; CAD → Product Concept / Design Engineering (+ Automatic and Documentation → Draft); CAQ → Quality Control; Computer Controlled Machines / Robots → Manufacturing.',
      hint: 'Şemada kutunun adı adımın adıyla aynı ailedir.'
    },
    {
      q: 'INT s.6\'daki (CIM öncesi) ürün döngüsünde <b>Quality Control</b> adımının çıktıları nereye gider?',
      options: [
        'Yalnızca Draft adımına',
        'Manufacturing\'e geri besleme ve Customer / markets',
        'Yalnızca Scheduling adımına',
        'Order for new equipment kutusuna'
      ],
      answer: 1,
      explain: 'INT s.6 (şema): Quality Control → Customer / markets, ve ayrıca Quality Control → Manufacturing (geri besleme oku); döngü Customer / markets → Product Concept ile kapanır.'
    },
    {
      q: 'CIM\'e göre aşağıdakilerden hangileri bilgisayar üzerinden fabrika zemini fonksiyonlarına bağlanır? (Birden fazla doğru)',
      options: [
        'Tasarım ve analiz',
        'Planlama ve satın alma',
        'Maliyet muhasebesi ve stok kontrolü',
        'Dağıtım (distribution)',
        'Şirketin reklam kampanyası seçimi'
      ],
      answer: [0, 1, 2, 3],
      explain: 'INT s.7: design, analysis, planning, purchasing, cost accounting, inventory control, distribution fabrika zemini fonksiyonlarıyla (malzeme taşıma ve yönetimi vb.) bilgisayarla bağlanır; doğrudan kontrol ve izleme sağlanır.'
    }
  ];

  /* ------------------------------------------------------------------ 1.2 */
  IM.content.summaries['1.2'] = `
<h2>1.2 Ürün yaşam döngüsü zaman analizi (TTLC, TLC)</h2>
<p class="note">Ders notu: Introduction to CIM s.12–14</p>

<h3>Toplam yaşam döngüsü süresi (INT s.12–13)</h3>
<p>Bir ürünün tasarımı, planlaması ve imalatı için geçen <b>toplam yaşam süresi</b> şu modelle verilir:</p>
<div class="model">TTLC = B · Q · T<sub>1</sub> + B · T<sub>2</sub> + T<sub>3</sub>

TTLC : ürünün tüm yaşam döngüsü boyunca geçen toplam süre
T<sub>1</sub>   : bir birim ürünün imalat süresi (manufacturing time for a unit product)
T<sub>2</sub>   : bir ürün partisi için planlama ve hazırlık (setup) süresi
T<sub>3</sub>   : her ürün tipi için tasarımla ilgili süre (yalnızca bir kez oluşur)
B     : ürünün yaşam döngüsünde imal edilen parti (batch) sayısı
Q     : parti başına ortalama büyüklük (batch size)
B · Q : yaşam döngüsündeki toplam ürün sayısı</div>
<ul>
  <li><b>T<sub>1</sub></b> her birim için tekrarlanır → toplam katkısı <b>B · Q · T<sub>1</sub></b>.</li>
  <li><b>T<sub>2</sub></b> her parti için bir kez → toplam katkısı <b>B · T<sub>2</sub></b>.</li>
  <li><b>T<sub>3</sub></b> ürün tipi için <b>bir kez</b> (occurs once) → toplam katkısı <b>T<sub>3</sub></b>.</li>
</ul>

<h3>Birim ürün başına ortalama süre (INT s.13)</h3>
<div class="model">TLC = T<sub>1</sub> + T<sub>2</sub> / Q + T<sub>3</sub> / (B · Q)

TLC = TTLC / (B · Q)</div>
<p>TLC, yaşam döngüsü boyunca <b>bir birim ürün için ortalama süredir</b> (Average time for unit product during product life cycle). TTLC'yi toplam ürün sayısı BQ'ya bölünce elde edilir. Formülden okunan sonuç (notlarda ayrıca yazılı değil): parti büyüklüğü Q büyüdükçe T<sub>2</sub> / Q küçülür; toplam ürün sayısı BQ büyüdükçe T<sub>3</sub> / (B · Q) küçülür; T<sub>1</sub> ise ürün sayısından bağımsız olarak olduğu gibi kalır.</p>

<h3>Otomasyon ve CAD/CAM'in etkisi (INT s.14)</h3>
<ul>
  <li><b>Automation technologies</b> → T<sub>1</sub> ve T<sub>2</sub>'nin azalmasıyla ilgilidir, <b>özellikle T<sub>1</sub></b>.</li>
  <li><b>CAD/CAM technology</b> → üç terimin hepsiyle ilgilidir; ancak ağırlıkla <b>T<sub>2</sub> ve T<sub>3</sub></b> üzerinde yoğunlaşır.</li>
  <li><b>Automation tanımı:</b> karmaşık mekanik, elektronik ve bilgisayar destekli sistemlerin imalatın operasyonuna ve kontrolüne uygulanmasıdır.</li>
</ul>

<h3>Sayısal örnek (notlarda yok; formüller INT s.12–13)</h3>
<p>Varsayım: T<sub>1</sub> = 2 h, T<sub>2</sub> = 10 h, T<sub>3</sub> = 400 h, B = 10 parti, Q = 50 adet/parti → BQ = 500 ürün.</p>
<div class="model">TTLC = 10 · 50 · 2 + 10 · 10 + 400 = 1000 + 100 + 400 = 1500 h
TLC  = 2 + 10 / 50 + 400 / 500 = 2 + 0.20 + 0.80 = 3.00 h/ürün
Kontrol: 1500 / 500 = 3.00 h/ürün ✓</div>
<p>Otomasyon T<sub>1</sub>'i 2 h → 1.50 h yaparsa: TTLC = 500 · 1.50 + 100 + 400 = 1250 h, TLC = 1250 / 500 = 2.50 h/ürün. CAD/CAM T<sub>3</sub>'ü 400 h → 200 h yaparsa: TTLC = 1000 + 100 + 200 = 1300 h, TLC = 1300 / 500 = 2.60 h/ürün. (Bu sayılar yalnızca formülü göstermek içindir, notlarda yoktur.)</p>

<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
  <li><b>TTLC</b> toplam süredir (B · Q · T<sub>1</sub> + B · T<sub>2</sub> + T<sub>3</sub>); <b>TLC</b> birim başına ortalamadır. İkisini karıştırma: TLC = TTLC / (B · Q).</li>
  <li>TLC'de paydalar farklıdır: <b>T<sub>2</sub> / Q</b> (parti büyüklüğü) ama <b>T<sub>3</sub> / (B · Q)</b> (tüm ürün sayısı). T<sub>3</sub>'ü yalnızca Q'ya bölme.</li>
  <li>T<sub>2</sub> <b>parti başına</b> (B ile çarpılır), T<sub>3</sub> <b>ürün tipi başına bir kez</b> (çarpan yok), T<sub>1</sub> <b>birim başına</b> (B · Q ile çarpılır).</li>
  <li>Otomasyon → <b>T<sub>1</sub> (ve T<sub>2</sub>)</b>, en çok T<sub>1</sub>; CAD/CAM → <b>üç terim</b>, en çok <b>T<sub>2</sub> ve T<sub>3</sub></b>. Birini diğerinin yerine yazma.</li>
  <li>Birimleri tutarlı tut: T<sub>1</sub> saat ise TTLC saat, TLC saat/ürün çıkar.</li>
</ul></div>
`;

  IM.content.concepts['1.2'] = [
    {
      q: 'INT s.12\'ye göre bir ürünün toplam yaşam döngüsü süresi <b>TTLC</b> hangi ifadeyle verilir?',
      options: [
        'TTLC = B · Q · T<sub>1</sub> + B · T<sub>2</sub> + T<sub>3</sub>',
        'TTLC = Q · T<sub>1</sub> + B · T<sub>2</sub> + B · T<sub>3</sub>',
        'TTLC = B · T<sub>1</sub> + Q · T<sub>2</sub> + T<sub>3</sub>',
        'TTLC = T<sub>1</sub> + T<sub>2</sub> / Q + T<sub>3</sub> / (B · Q)'
      ],
      answer: 0,
      explain: 'INT s.12: TTLC = B Q T<sub>1</sub> + B T<sub>2</sub> + T<sub>3</sub>. Son seçenek TTLC değil, birim başına ortalama süre TLC\'dir (INT s.13).'
    },
    {
      q: 'Modelde <b>T<sub>1</sub></b> neyi ifade eder?',
      options: [
        'Bir ürün partisi için planlama ve hazırlık süresi',
        'Her ürün tipi için tasarım süresi',
        'Bir birim ürünün imalat süresi',
        'Toplam yaşam süresi'
      ],
      answer: 2,
      explain: 'INT s.12: T<sub>1</sub> = manufacturing time for a unit product.'
    },
    {
      q: 'Modelde <b>T<sub>2</sub></b> neyi ifade eder?',
      options: [
        'Bir birim ürünün imalat süresi',
        'Bir ürün partisi (batch) için planlama ve setup ile ilgili süre',
        'Her ürün tipi için bir kez oluşan tasarım süresi',
        'Parti sayısı'
      ],
      answer: 1,
      explain: 'INT s.12: T<sub>2</sub> = planning and setup related time for a product batch; partiler için tekrarlanır (B · T<sub>2</sub>).'
    },
    {
      q: '<b>T<sub>3</sub></b> hakkında hangisi doğrudur?',
      options: [
        'Her parti için tekrarlanan hazırlık süresidir',
        'Her ürün tipi için tasarımla ilgili süredir ve yalnızca bir kez oluşur (occurs once)',
        'Bir birim ürünün imalat süresidir',
        'Parti büyüklüğüyle doğru orantılı artar'
      ],
      answer: 1,
      explain: 'INT s.12: T<sub>3</sub> = design related time for each type of product (occurs once). TTLC\'de çarpansız bir terimdir.'
    },
    {
      q: 'Modelde <b>B</b> ve <b>Q</b> ne anlama gelir ve <b>BQ</b> neyi verir?',
      options: [
        'B = ürün çeşidi sayısı, Q = parti sayısı; BQ = toplam süre',
        'B = yaşam döngüsünde imal edilen parti sayısı, Q = ortalama parti büyüklüğü; BQ = yaşam döngüsündeki ürün sayısı',
        'B = ortalama parti büyüklüğü, Q = parti sayısı; BQ = TTLC',
        'B = bütçe, Q = kalite oranı; BQ = maliyet'
      ],
      answer: 1,
      explain: 'INT s.13: B = number of batches manufactured for the overall life of a product; Q = average size of a batch; BQ = number of products in its life cycle.'
    },
    {
      q: 'Birim ürün başına ortalama süre <b>TLC</b> için doğru ifade hangisidir?',
      options: [
        'TLC = T<sub>1</sub> + T<sub>2</sub> / Q + T<sub>3</sub> / (B · Q)',
        'TLC = T<sub>1</sub> + T<sub>2</sub> / (B · Q) + T<sub>3</sub> / Q',
        'TLC = T<sub>1</sub> + T<sub>2</sub> / Q + T<sub>3</sub> / Q',
        'TLC = B · Q · T<sub>1</sub> + B · T<sub>2</sub> + T<sub>3</sub>'
      ],
      answer: 0,
      explain: 'INT s.13: TLC = T<sub>1</sub> + T<sub>2</sub> / Q + T<sub>3</sub> / BQ. T<sub>2</sub> parti başına olduğu için Q\'ya, T<sub>3</sub> tüm ürünlere dağıldığı için BQ\'ya bölünür.',
      hint: 'TLC = TTLC / (BQ) olmalı.'
    },
    {
      q: 'Sayısal kontrol (notlarda yok; formül INT s.12): T<sub>1</sub> = 2 h, T<sub>2</sub> = 10 h, T<sub>3</sub> = 400 h, B = 10, Q = 50 için <b>TTLC</b> kaç saattir?',
      options: ['1500 h', '1100 h', '1000 h', '5000 h'],
      answer: 0,
      explain: 'TTLC = 10 · 50 · 2 + 10 · 10 + 400 = 1000 + 100 + 400 = 1500 h. (1100 → T<sub>3</sub> unutulmuş; 1000 → yalnızca B·Q·T<sub>1</sub>.)'
    },
    {
      q: 'Aynı veriyle (T<sub>1</sub> = 2 h, T<sub>2</sub> = 10 h, T<sub>3</sub> = 400 h, B = 10, Q = 50; notlarda yok) birim başına ortalama süre <b>TLC</b> kaç h/üründür?',
      options: ['2.20', '3.00', '3.20', '1500'],
      answer: 1,
      explain: 'TLC = 2 + 10 / 50 + 400 / 500 = 2 + 0.20 + 0.80 = 3.00. Kontrol: TTLC / BQ = 1500 / 500 = 3.00. (2.20: T<sub>3</sub> terimi unutulmuş.)'
    },
    {
      q: 'Parti büyüklüğü <b>Q</b> artırılırsa (B ve T değerleri sabit) TLC\'de hangi terimler küçülür? (Birden fazla doğru; formülden çıkarım)',
      options: [
        'T<sub>2</sub> / Q',
        'T<sub>3</sub> / (B · Q)',
        'T<sub>1</sub>'
      ],
      answer: [0, 1],
      explain: 'INT s.13 formülünde Q hem T<sub>2</sub> / Q hem T<sub>3</sub> / (B · Q) paydasında yer alır; T<sub>1</sub> Q\'dan bağımsızdır.'
    },
    {
      q: 'INT s.14\'e göre <b>Automation technologies</b> hangi zaman terimlerinin azalmasıyla ilgilidir?',
      options: [
        'Yalnızca T<sub>3</sub>',
        'T<sub>1</sub> ve T<sub>2</sub>, özellikle T<sub>1</sub>',
        'T<sub>2</sub> ve T<sub>3</sub>, özellikle T<sub>3</sub>',
        'Üç terim de eşit ağırlıkla'
      ],
      answer: 1,
      explain: 'INT s.14: "Automation technologies is related with the decrease for T<sub>1</sub> and T<sub>2</sub>, especially T<sub>1</sub>."'
    },
    {
      q: 'INT s.14\'e göre <b>CAD/CAM technology</b> için hangisi doğrudur?',
      options: [
        'Yalnızca T<sub>1</sub> ile ilgilidir',
        'Üç terimle de ilgilidir ama çoğunlukla T<sub>2</sub> ve T<sub>3</sub> üzerinde yoğunlaşır',
        'Yalnızca T<sub>1</sub> ve T<sub>2</sub> ile ilgilidir, özellikle T<sub>1</sub>',
        'Hiçbir terimle ilgili değildir'
      ],
      answer: 1,
      explain: 'INT s.14: CAD/CAM technology is related with all of the three terms; mostly focuses on T<sub>2</sub> and T<sub>3</sub>. Otomasyonun ağırlığı T<sub>1</sub>\'dedir.'
    },
    {
      q: 'Notlardaki <b>automation</b> tanımı hangisidir?',
      options: [
        'Karmaşık mekanik, elektronik ve bilgisayar destekli sistemlerin imalatın operasyonuna ve kontrolüne uygulanması',
        'Tüm işçilerin kaldırılması',
        'Yalnızca robotların satın alınması',
        'Malzeme taşımanın tamamen ortadan kaldırılması'
      ],
      answer: 0,
      explain: 'INT s.14: "Automation is defined as the application of complex mechanic, electronic and computer aided systems to the operations and control of manufacturing."'
    },
    {
      q: 'Aynı sayısal örnekte (notlarda yok) otomasyon T<sub>1</sub>\'i 2 h\'ten 1.50 h\'e düşürürse <b>TTLC</b> kaç saat olur?',
      options: ['1250 h', '1400 h', '1000 h', '1500 h'],
      answer: 0,
      explain: 'TTLC = 10 · 50 · 1.50 + 10 · 10 + 400 = 750 + 100 + 400 = 1250 h; azalma B · Q · ΔT<sub>1</sub> = 500 · 0.50 = 250 h (INT s.12 formülü).'
    }
  ];

  /* ------------------------------------------------------------------ 1.3 */
  IM.content.summaries['1.3'] = `
<h2>1.3 CIM ne zaman uygulanmalı? (When to apply CIM)</h2>
<p class="note">Ders notu: When CIM s.1–5</p>

<h3>Dünya standartlarında bir üretim sistemine üç aşamalı yol (WHEN s.2)</h3>
<p><i>Manufacturing System in World Class</i> başlığı altında sıra şöyledir:</p>
<ol>
  <li><b>1. Stage — Restructuring manufacturing system:</b> üretim sisteminin yeniden yapılandırılması (<b>Cellular Manufacturing</b>).</li>
  <li><b>2. Stage — Applying other lean manufacturing techniques:</b> <b>5S, SMED, Kanban</b> vb.</li>
  <li><b>3. Stage — Automation and Computer integration (CIM).</b></li>
</ol>
<div class="model">Cellular Manufacturing → Lean teknikler (5S, SMED, Kanban …) → Automation ve CIM
(1. aşama)             (2. aşama)                      (3. aşama)</div>
<p>CIM <b>son aşamadır</b>: önce sistem yeniden yapılandırılır ve lean teknikler uygulanır, otomasyon ve bilgisayar entegrasyonu en sonda gelir.</p>

<h3>CIM'in amacı ve sınırı (WHEN s.3)</h3>
<ul>
  <li>Otomasyon ve bilgisayar entegrasyonu (CIM) <b>operasyonların ve süreçlerin etkinliğini (effectiveness) artırmak</b> içindir.</li>
  <li>Hedefleri: <b>darboğazı önlemek</b> (Preventing the bottleneck) ve <b>kalite problemlerini çözmek</b> (Solving quality problems).</li>
  <li>Ancak notlar açıkça uyarır: CIM <b>genel sistem üzerinde etkisi olmayabilir</b> (May not have effect on overall system).</li>
</ul>

<h3>Önce israf giderilmeli — shallow vs. real improvement (WHEN s.4)</h3>
<p><b>CIM'den önce israflar (wastes) önlenmeli veya azaltılmalıdır.</b> Notlardaki örnek <b>taşıma (Transportation) israfı</b>dır:</p>
<ul>
  <li>İsraf giderilmeden birdenbire CIM uygulanırsa taşıma <b>Automated Guided Vehicles (AGV)</b> ile yapılır → <b>shallow improvement</b> (yüzeysel iyileştirme): israf hâlâ vardır, yalnızca otomatikleşmiştir.</li>
  <li>Oysa taşımanın kendisi <b>ortadan kaldırılabilir</b> (transportation may be prevented) → <b>real improvement</b> (gerçek iyileştirme). Nasıl önleneceği notlarda anlatılmaz; 1. aşamadaki yeniden yapılandırma mantığıyla ilişkilendirmek yorumdur (notlarda yok).</li>
</ul>

<h3>Sonuçlar (WHEN s.5)</h3>
<ul>
  <li>Otomasyon ve bilgisayar entegrasyonu, <b>yanlış yönetilen ve zayıf organize edilmiş</b> üretim sistemlerinin problemlerini çözmez.</li>
  <li>Otomasyon, otomatikleştirilmeden önce <b>başarıyla yapılan</b> faaliyetlere uygulanmalıdır.</li>
  <li>Otomatik malzeme taşıma sistemlerinin entegrasyonundan önce <b>malzeme akışı basit ve etkin</b> olmalıdır.</li>
  <li>IT'yi devreye almadan önce <b>bilgi akışı etkin</b> olmalıdır.</li>
</ul>
<p>Kısa mantık (notların birleşimi): önce yapı ve israf, sonra otomasyon; "bozuk bir süreci otomatikleştirmek" gerçek çözüm değildir. Bu nedenle bu bölümün formülü yoktur; karar sırası ve gerekçeler sınavda kavram sorusu olarak çıkar.</p>

<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
  <li><b>Aşama sırası:</b> 1 = yeniden yapılandırma (Cellular Manufacturing), 2 = diğer lean teknikler (5S, SMED, Kanban …), 3 = otomasyon ve CIM. CIM'i birinci aşamaya koyma.</li>
  <li>Taşıma israfını <b>AGV ile otomatikleştirmek = shallow improvement</b>; taşımayı <b>ortadan kaldırmak = real improvement</b>. Bu iki ifadeyi ters yazma.</li>
  <li>CIM kalite ve darboğaz problemlerinde yardımcı olur ama "tüm sorunları çözer" demek yanlıştır: genel sistem üzerinde etkisi olmayabilir, kötü yönetilen sistemi düzeltmez.</li>
  <li>Otomasyon <b>zaten başarıyla yapılan</b> faaliyetlere uygulanır; başarısız süreci otomatikleştirmek önerilmez.</li>
  <li>Malzeme akışı basitleşmeden otomatik taşıma, bilgi akışı etkin olmadan IT önerilmez (iki ayrı koşul).</li>
</ul></div>
`;

  IM.content.concepts['1.3'] = [
    {
      q: 'WHEN s.2\'ye göre dünya standartlarında bir üretim sistemine giden aşamaların <b>doğru sırası</b> hangisidir?',
      options: [
        'Otomasyon ve CIM → Cellular Manufacturing → 5S, SMED, Kanban',
        'Cellular Manufacturing (yeniden yapılandırma) → 5S, SMED, Kanban vb. → Otomasyon ve CIM',
        '5S, SMED, Kanban → Otomasyon ve CIM → Cellular Manufacturing',
        'CIM → Kanban → 5S'
      ],
      answer: 1,
      explain: 'WHEN s.2: 1. Stage Restructuring (Cellular Manufacturing); 2. Stage other lean techniques (5S, SMED, Kanban etc.); 3. Stage Automation and Computer integration (CIM).',
      hint: 'CIM en sonda gelir.'
    },
    {
      q: 'Birinci aşama (1. Stage) hangisidir?',
      options: [
        'Automation and Computer integration (CIM)',
        'Restructuring manufacturing system (Cellular Manufacturing)',
        'Applying 5S, SMED, Kanban',
        'AGV sistemi kurmak'
      ],
      answer: 1,
      explain: 'WHEN s.2: 1. Stage = Restructuring manufacturing system (Cellular Manufacturing).'
    },
    {
      q: 'İkinci aşamada (2. Stage) uygulanan "diğer lean manufacturing techniques" olarak notlarda hangileri sayılır? (Birden fazla doğru)',
      options: ['5S', 'SMED', 'Kanban', 'Automation and Computer integration (CIM)'],
      answer: [0, 1, 2],
      explain: 'WHEN s.2: "Applying other lean manufacturing techniques (5S, SMED, Kanban etc.)". CIM üçüncü aşamadır.'
    },
    {
      q: 'WHEN s.3\'e göre otomasyon ve bilgisayar entegrasyonunun (CIM) amaçları arasında hangileri vardır? (Birden fazla doğru)',
      options: [
        'Operasyonların ve süreçlerin etkinliğini artırmak',
        'Darboğazı önlemek',
        'Kalite problemlerini çözmek',
        'Tüm israf türlerini tek başına yok etmek',
        'Lean tekniklerin yerine geçmek'
      ],
      answer: [0, 1, 2],
      explain: 'WHEN s.3: to increase the effectiveness of operations and processes; preventing the bottleneck; solving quality problems — ve "May not have effect on overall system". Israfı tek başına yok etmek notlarda amaç olarak geçmez.'
    },
    {
      q: 'WHEN s.3\'teki uyarıya göre CIM ile ilgili aşağıdakilerden hangisi doğrudur?',
      options: [
        'CIM her zaman tüm sistem performansını artırır',
        'CIM genel sistem üzerinde etkisi olmayabilir (may not have effect on overall system)',
        'CIM yalnızca kalite problemlerini çözer',
        'CIM darboğaz yaratır'
      ],
      answer: 1,
      explain: 'WHEN s.3: "May not have effect on overall system." Bu nedenle önce israfın giderilmesi gerekir (s.4).'
    },
    {
      q: 'WHEN s.4\'e göre CIM uygulanmadan <b>önce</b> ne yapılmalıdır?',
      options: [
        'Tüm makineler CNC\'ye çevrilmeli',
        'İsraflar (wastes) önlenmeli veya azaltılmalı',
        'AGV sistemi kurulmalı',
        'Bilgisayar sayısı artırılmalı'
      ],
      answer: 1,
      explain: 'WHEN s.4: "Before CIM, wastes should be prevented or decreased."'
    },
    {
      q: 'Taşıma (Transportation) israfı örneğinde, israf giderilmeden birdenbire CIM uygulanıp taşımanın AGV\'lerle yapılması notlarda nasıl adlandırılır?',
      options: [
        'Real improvement',
        'Shallow improvement',
        'Lean transformation',
        'Kaizen event'
      ],
      answer: 1,
      explain: 'WHEN s.4: taşıma AGV ile yapılırsa "shallow improvement"; taşımanın önlenmesi "real improvement"tır.',
      hint: 'AGV israfı yok etmez, yalnızca otomatikleştirir.'
    },
    {
      q: 'Aynı örnekte <b>real improvement</b> (gerçek iyileştirme) nedir?',
      options: [
        'Taşımayı AGV yerine forklift ile yapmak',
        'Taşımanın kendisini önlemek (ortadan kaldırmak)',
        'AGV sayısını artırmak',
        'Taşıma mesafesini kayıt altına almak'
      ],
      answer: 1,
      explain: 'WHEN s.4: "However, transportation may be prevented. (Real improvement)."'
    },
    {
      q: 'WHEN s.5 "Results" bölümüne göre aşağıdakilerden hangileri <b>doğrudur</b>? (Birden fazla doğru)',
      options: [
        'Otomasyon ve bilgisayar entegrasyonu yanlış yönetilen, zayıf organize edilmiş üretim sistemlerinin problemlerini çözmez',
        'Otomasyon, otomatikleştirilmeden önce başarıyla yapılan faaliyetlere uygulanmalıdır',
        'Otomatik malzeme taşıma sistemlerinden önce malzeme akışı basit ve etkin olmalıdır',
        'IT devreye alınmadan önce bilgi akışı etkin olmalıdır',
        'Otomasyon, kötü yönetilen sistemi düzeltmenin en hızlı yoludur'
      ],
      answer: [0, 1, 2, 3],
      explain: 'WHEN s.5 dört sonucu birebir sayar. Son seçenek notların tam tersini söyler.'
    },
    {
      q: 'Bir işletme taşıma sorunu yaşıyor ve hiçbir yeniden yapılandırma yapmadan AGV alıyor. Notlara göre bu karar nasıl değerlendirilir? (yorum; ilke WHEN s.4–5)',
      options: [
        'Gerçek iyileştirme: taşıma israfı tamamen ortadan kalkmıştır',
        'Yüzeysel iyileştirme: taşıma hâlâ vardır, sadece otomatikleştirilmiştir; önce malzeme akışı basitleştirilmeli / taşıma önlenmeye çalışılmalıdır',
        'Doğru karar: CIM her zaman ilk adımdır',
        'Kararın hiçbir etkisi yoktur ve kavramsal bir tartışma konusu değildir'
      ],
      answer: 1,
      explain: 'WHEN s.4: AGV ile taşıma = shallow improvement; s.5: otomatik malzeme taşımadan önce malzeme akışı basit ve etkin olmalı.'
    },
    {
      q: 'Notlara göre IT (bilgi teknolojisi) devreye alınmadan önce neyin etkin olması gerekir?',
      options: [
        'Stok seviyesinin',
        'Bilgi akışının (information flow)',
        'Çalışan sayısının',
        'Makine sayısının'
      ],
      answer: 1,
      explain: 'WHEN s.5: "Information flow should be effective before introducing IT." Benzer şekilde otomatik taşımadan önce malzeme akışı etkin olmalıdır.'
    },
    {
      q: 'Otomasyonun hangi faaliyetlere uygulanması önerilir?',
      options: [
        'Başarısız ve düzensiz faaliyetlere, çünkü otomasyon onları düzeltir',
        'Otomatikleştirilmeden önce başarıyla yürütülen faaliyetlere',
        'Yalnızca taşıma faaliyetlerine',
        'Yalnızca kalite kontrol faaliyetlerine'
      ],
      answer: 1,
      explain: 'WHEN s.5: "Automation should be applied to activities which are performed successfully before automatization."'
    }
  ];

  /* ------------------------------------------------------------------ cheatsheet */
  IM.content.cheatsheet += `
    <h2>Bölüm 1 · CIM'e Giriş</h2>
    <div class="model">TTLC = B · Q · T<sub>1</sub> + B · T<sub>2</sub> + T<sub>3</sub>        (toplam yaşam süresi)
TLC  = T<sub>1</sub> + T<sub>2</sub> / Q + T<sub>3</sub> / (B · Q)        (birim başına ortalama; TLC = TTLC / BQ)
BQ   = yaşam döngüsündeki toplam ürün sayısı</div>
    <table>
      <tr><td><b>T<sub>1</sub></b></td><td>birim ürün imalat süresi (her birim için)</td></tr>
      <tr><td><b>T<sub>2</sub></b></td><td>parti başına planlama + setup süresi (her parti için)</td></tr>
      <tr><td><b>T<sub>3</sub></b></td><td>ürün tipi başına tasarım süresi (bir kez)</td></tr>
      <tr><td><b>B, Q</b></td><td>parti sayısı, ortalama parti büyüklüğü</td></tr>
      <tr><td><b>Automation</b></td><td>T<sub>1</sub> ve T<sub>2</sub>'yi azaltır, özellikle T<sub>1</sub></td></tr>
      <tr><td><b>CAD/CAM</b></td><td>üç terimle de ilgili, en çok T<sub>2</sub> ve T<sub>3</sub></td></tr>
    </table>
    <ul>
      <li><b>CIM 3 bileşeni:</b> veri saklama/işleme/sunma · algılama + süreç değiştirme · ikisini birleştiren algoritmalar. En az 2 bilgisayar bilgi alışverişi yapar.</li>
      <li><b>Performans ölçütleri:</b> Low Cost · High Quality · In Time · High Effectiveness · High Efficiency · High Flexibility (zaman, miktar, ürün çeşitliliği).</li>
      <li><b>Kısaltmalar:</b> CAD tasarım · CAPP süreç planlama · CAM üretim · CAQ kalite · CAH taşıma.</li>
      <li><b>When CIM:</b> 1) Cellular Manufacturing → 2) 5S, SMED, Kanban … → 3) Automation + CIM. Önce israfı gider (taşımayı AGV'ye devretmek = shallow; taşımayı önlemek = real improvement).</li>
    </ul>
  `;
})();
