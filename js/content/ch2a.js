/* Bölüm 2 (1/2) · Lean Manufacturing — konular 2.1–2.5. Düz <script> (ES module yok), window.IM'e ekler.
   Kaynak: "Lean Manufacturing.pdf" (LEAN) s.1–73. Görsel sayfalar (s.2–3, 6–7, 11–12, 14–15, 19–22, 24–25, 27–29, 31–40, 42–44,
   48–50, 53–54, 57, 59) PDF görüntüsü olarak okunmuştur.
   Sayılar node ile doğrulandı: takt = 2 × 27,600 / 920 = 60 s; LT = 5 + 7.6 + 1.8 + 2.7 + 2 + 4.5 = 23.6 gün;
   VA = 1 + 39 + 46 + 62 + 40 = 188 s; future LT = 1.5 + 1 + 2 = 4.5 gün, VA = 1 + 168 = 169 s;
   spagetti: 65.5 × 40 = 2620 m, 20 × 160 = 3200 m, toplam 5820 m/ay, × 12 = 69,840 m/yıl ≈ 70 km/yıl.
   Soru yazım kolaylığı: seçenek metni "@@" ile başlıyorsa doğru cevaptır (yardımcı Q() işaretçiyi siler, indeksi hesaplar). */
(function () {
  const IM = window.IM;
  const Q = (q, opts, explain, extra) => {
    const options = [];
    const ans = [];
    opts.forEach((t, i) => {
      if (t.slice(0, 2) === '@@') { ans.push(i); options.push(t.slice(2)); } else options.push(t);
    });
    return Object.assign({ q, options, answer: ans.length === 1 ? ans[0] : ans, explain }, extra || {});
  };

  /* ===================================================================== 2.1 */
  IM.content.summaries['2.1'] = `
<h2>2.1 Üretim sistemi parametreleri (takt time, capacity, service level)</h2>
<p class="note">Ders notu: Lean Manufacturing s.1–3</p>
<p>Lean Manufacturing notları, üretim sistemini ölçmek için birkaç temel parametre tanımlayarak başlar (LEAN s.2–3). Bunların hepsi
sonraki konularda (VSM, hücresel üretim, kanban) tekrar tekrar kullanılır; bu yüzden tanımları kelimesi kelimesine bilmek gerekir.</p>

<h3>Temel tanımlar (LEAN s.2)</h3>
<ul>
  <li><b>Efficiency (verimlilik)</b> = Output / Input — girdi birimi başına elde edilen çıktı.</li>
  <li><b>Effectiveness (etkinlik)</b> = bir hedefe ulaşma derecesi (degree of reaching a goal). Efficiency "işi doğru yapmak", effectiveness "hedefe varmak" ile ilgilidir; ikisi aynı şey değildir.</li>
  <li><b>Manufacturing Lead Time (MLT)</b> = hammadde girişi ile sevkiyat (shipment) arasında geçen süre (LEAN s.2; s.3'te "Production Lead Time" adıyla aynı tanım tekrar edilir).</li>
  <li><b>Cycle Time</b> = iki ardışık ürün çıkışı arasındaki zaman aralığı (hat ya da istasyon ne sıklıkla bir ürün üretiyor).</li>
  <li><b>Capacity</b> = Net working time / Cycle time (slaytta "Networking Time" yazılmıştır; "Net working time" kastedilir).</li>
  <li><b>Takt Time</b> = Net working time / Total demand — müşterinin istediği çevrim süresi (customer requested cycle time).</li>
</ul>
<div class="model">Efficiency = Output / Input
Capacity  = Net working time / Cycle time          (adet)
Takt time = Net working time / Total demand        (süre / adet)
MLT       = shipment zamanı − hammadde giriş zamanı</div>

<h3>Customer Service Level (LEAN s.3)</h3>
<p>Müşteri hizmet düzeyi iki biçimde ölçülür; ikisi de "problemsiz" (zamanında, doğru miktarda, doğru kalitede — <b>time, quantity, quality</b>) teslimata bakar, ama sayılan şey farklıdır:</p>
<table>
  <tr><th>Tür</th><th>Formül</th><th>Sayılan birim</th></tr>
  <tr><td><b>Type 1</b></td><td>Dönemde problemsiz sevk edilen <b>ürün</b> sayısı / Toplam sevk edilen ürün sayısı</td><td>ürün (adet) bazlı</td></tr>
  <tr><td><b>Type 2</b></td><td>Dönemde problemsiz yapılan <b>sevkiyat</b> sayısı / Toplam sevkiyat sayısı</td><td>sevkiyat (shipment) bazlı</td></tr>
</table>

<h3>Kısa sayısal örnekler (notlarda yok; yalnızca tanımları pekiştirmek için)</h3>
<ul>
  <li>Efficiency: 900 adet çıktı, 150 işçi-saat girdi → 900 / 150 = 6 adet/saat.</li>
  <li>Takt time: 2 vardiya × 450 dk net = 900 dk = 54,000 s; günlük talep 900 adet → takt = 54,000 / 900 = <b>60 s/adet</b>.</li>
  <li>Capacity: cycle time 45 s ise kapasite = 54,000 / 45 = 1,200 adet/gün (talep 900'ü karşılar). Cycle time 75 s ise 54,000 / 75 = 720 adet/gün — talep 900'ün altında kalır; cycle time takt time'ı (60 s) aştığı için talep karşılanamaz.</li>
  <li>Service level: 1,000 ürünün 950'si problemsiz → Type 1 = 950 / 1,000 = %95. Aynı dönemde 40 sevkiyatın 36'sı problemsiz → Type 2 = 36 / 40 = %90. Tek bir sevkiyattaki tek bir problem Type 2'de bütün sevkiyatı "problemli" yapar, Type 1'de yalnızca etkilenen ürünleri.</li>
</ul>

<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
  <li><b>Takt time ≠ cycle time.</b> Takt <i>talepten</i> gelir (net süre / talep), cycle time <i>süreçten</i> gelir (iki ardışık çıkış arası). Takt "olması gereken", cycle time "olan" hızdır.</li>
  <li><b>Capacity = net working time / cycle time</b> — takt time'a bölünmez. Takt ile bölerseniz "talep" bulursunuz, kapasite değil.</li>
  <li>Takt time = <i>Net</i> çalışma süresi / talep. Brüt vardiya süresi değil; slayt "net" der.</li>
  <li><b>CSL Type 1 = ürün bazlı, Type 2 = sevkiyat bazlı.</b> Pay ve payda hangi birimse tür odur; ikisini karıştırmayın.</li>
  <li><b>MLT ≠ cycle time:</b> MLT tüm akışın (giriş → sevkiyat) süresidir; cycle time iki çıkış arasındaki sıklıktır.</li>
  <li>Efficiency (Output / Input) ile effectiveness (hedefe ulaşma derecesi) farklı kavramlardır.</li>
</ul></div>
`;

  IM.content.concepts['2.1'] = [
    Q('Notlara göre <b>efficiency</b> nasıl tanımlanır?',
      ['@@Output / Input', 'Input / Output', 'Hedefe ulaşma derecesi', 'Net working time / Cycle time'],
      'LEAN s.2: Efficiency = Output/Input. "Hedefe ulaşma derecesi" effectiveness tanımıdır; Net working time / Cycle time ise capacity formülüdür.'),
    Q('<b>Effectiveness</b> notlarda nasıl tanımlanır?',
      ['Çıktının girdiye oranı', '@@Bir hedefe ulaşma derecesi (degree of reaching a goal)', 'İki ardışık ürün çıkışı arasındaki süre', 'Müşterinin istediği çevrim süresi'],
      'LEAN s.2: Effectiveness = degree of reaching a goal. Çıktı/girdi oranı efficiency; ardışık çıkışlar arası süre cycle time; müşterinin istediği çevrim süresi takt time\'dır.'),
    Q('<b>Manufacturing (Production) Lead Time</b> hangi iki an arasındaki süredir?',
      ['İki ardışık ürün çıkışı', '@@Hammadde girişi ile sevkiyat (shipment)', 'Sipariş verilmesi ile üretime başlanması', 'Vardiya başlangıcı ile vardiya sonu'],
      'LEAN s.2 ve s.3: MLT / Production lead time = hammadde girişi ile sevkiyat arasındaki zaman aralığı.'),
    Q('<b>Cycle time</b> notlarda nasıl tanımlanır?',
      ['Hammadde girişinden sevkiyata kadar geçen süre', '@@İki ardışık ürün çıkışı arasındaki zaman aralığı', 'Net çalışma süresinin toplam talebe bölünmesi', 'Bir parçanın tezgâhta işlenme süresinin toplamı'],
      'LEAN s.2: Cycle time = time interval between two consecutive product exits. Hammadde–sevkiyat süresi MLT; net süre / talep takt time\'dır.'),
    Q('Slayttaki kapasite formülü hangisidir?',
      ['Capacity = Net working time / Takt time', '@@Capacity = Net working time / Cycle time', 'Capacity = Total demand / Cycle time', 'Capacity = Cycle time / Net working time'],
      'LEAN s.2: Capacity = Net working time (slaytta "Networking") / Cycle time. Takt time\'a bölmek yaygın bir hatadır; takt talepten türetilir.'),
    Q('<b>Takt time</b> hangi formülle hesaplanır?',
      ['Cycle time × Total demand', '@@Net working time / Total demand', 'Total demand / Net working time', 'Net working time / Cycle time'],
      'LEAN s.2: Takt time = Net working time / Total demand; yani müşterinin istediği çevrim süresi (customer requested cycle time).'),
    Q('Net çalışma süresi 54,000 s/gün, günlük talep 900 adet olan bir sistemin <b>takt time</b>\'ı nedir? (notlarda sayısal örnek yok; formül LEAN s.2)',
      ['@@60 s/adet', '45 s/adet', '1,200 s/adet', '0.017 s/adet'],
      'Takt = 54,000 / 900 = 60 s/adet. 0.017, bölmenin ters yapılmasıyla (900 / 54,000) çıkar; 45 s ise sadece örnekteki cycle time değeridir.'),
    Q('Takt time 60 s/adet iken hattın cycle time\'ı 75 s ise ne söylenebilir? (Net süre 54,000 s, talep 900 adet; notlarda yok)',
      ['Talep karşılanır, çünkü cycle time takt time\'dan büyük', '@@Kapasite 54,000 / 75 = 720 adet olur; talep 900\'ün altında kalır', 'Kapasite 54,000 / 60 = 900 adet olduğu için sorun yoktur', 'Takt time cycle time\'a eşitlenir'],
      'Capacity = net süre / cycle time = 720 < 900. Talebi karşılamak için cycle time\'ın takt time\'ı (60 s) aşmaması gerekir. Takt time talepten gelir, hattın cycle time\'ına göre değişmez (LEAN s.2).'),
    Q('<b>Customer Service Level (Type 1)</b> neyi ölçer?',
      ['Problemsiz yapılan sevkiyat sayısının toplam sevkiyat sayısına oranı', '@@Dönemde problemsiz (zaman, miktar, kalite) sevk edilen ürün sayısının toplam sevk edilen ürün sayısına oranı', 'Hammadde girişinden sevkiyata kadar geçen süreyi', 'Takt time\'ın cycle time\'a oranını'],
      'LEAN s.3: Type 1 ürün bazlıdır (number of products shipped without problems / total number of products shipped). Sevkiyat bazlı olan Type 2\'dir.'),
    Q('<b>Customer Service Level (Type 2)</b> neyi ölçer?',
      ['@@Problemsiz yapılan sevkiyat sayısı / Toplam sevkiyat sayısı', 'Problemsiz sevk edilen ürün sayısı / Toplam sevk edilen ürün sayısı', 'Sevkiyat sayısı / Ürün sayısı', 'Net çalışma süresi / Toplam talep'],
      'LEAN s.3: Type 2 = number of shipments made without problems in a period / total number of shipments. Pay ve payda sevkiyat sayısıdır.'),
    Q('Bir dönemde 1,000 ürün ve 40 sevkiyat yapılmış; 950 ürün ve 36 sevkiyat problemsizdir. Service level değerleri nedir? (notlarda sayısal örnek yok; formül LEAN s.3)',
      ['Type 1 = %90, Type 2 = %95', '@@Type 1 = %95, Type 2 = %90', 'Type 1 = %95, Type 2 = %95', 'Type 1 = %36, Type 2 = %95'],
      'Type 1 = 950 / 1,000 = 0.95 (ürün bazlı); Type 2 = 36 / 40 = 0.90 (sevkiyat bazlı). Türleri ters yazmak klasik hatadır.'),
    Q('Notlara göre bir ürünün/sevkiyatın "problemsiz" sayılması için hangi boyutlar dikkate alınır? <i>(birden fazla doğru)</i>',
      ['@@Zaman (time)', '@@Miktar (quantity)', '@@Kalite (quality)', 'Fiyat (price)', 'Ambalaj rengi'],
      'LEAN s.3 service level tanımı: "without problems (time, quantity, quality)". Fiyat ve ambalaj rengi tanımda yoktur.'),
    Q('Aşağıdakilerden hangileri <b>takt time</b> için doğrudur? <i>(birden fazla doğru)</i>',
      ['@@Müşterinin istediği çevrim süresidir (customer requested cycle time).', '@@Net çalışma süresinin toplam talebe bölünmesiyle bulunur.', 'İki ardışık ürün çıkışı arasındaki ölçülen süredir.', 'Kapasite formülünün paydasıdır.'],
      'LEAN s.2. Ölçülen ardışık çıkış süresi ve kapasite formülünün paydası cycle time\'dır; takt time talebe bağlı, hedef niteliğinde bir süredir.'),
  ];

  /* ===================================================================== 2.2 */
  IM.content.summaries['2.2'] = `
<h2>2.2 İsraf (waste), muda–muri–mura ve lean araçları</h2>
<p class="note">Ders notu: Lean Manufacturing s.4–15</p>
<p>Lean yaklaşımının çıkış noktası <b>değer katan</b> ile <b>değer katmayan</b> faaliyeti ayırmaktır (LEAN s.4). Bu konu israf kavramını,
israf türlerini, stokun neden tehlikeli olduğunu, lean production tanımını ve lean araçlarının "evini" ve yol haritasını içerir.</p>

<h3>İsraf kavramı (LEAN s.4–5)</h3>
<ul>
  <li>Bir faaliyetin <b>katma değeri yoksa israftır</b> (waste).</li>
  <li><b>Value added activity:</b> müşteri açısından değer katan, yani <b>müşterinin ödemeye razı olduğu</b> faaliyetler.</li>
  <li>"Müşteri kimdir?" (s.5): <b>izleyen süreç/süreçler sizin müşterinizdir</b> (iç müşteri). Bir sonraki istasyon da müşteridir.</li>
</ul>

<h3>Muda – Muri – Mura (LEAN s.6–7)</h3>
<table>
  <tr><th>Terim</th><th>Anlam</th><th>Notlardaki tanım</th></tr>
  <tr><td><b>Muda</b></td><td>Waste (israf)</td><td>Ürüne değer katmak için fiilen gereken minimum ekipman, malzeme, parça, alan ve işgücü miktarının ötesindeki her şey</td></tr>
  <tr><td><b>Muri</b></td><td>Overload (aşırı yüklenme)</td><td>Makine, ekipman ve insanın kapasitesinin üzerinde işle yüklenmesi</td></tr>
  <tr><td><b>Mura</b></td><td>Variability (düzensizlik)</td><td>Üretim planlama ve üretim miktarının düzenli olmadığı, geçici olarak artıp azalarak dalgalandığı durum</td></tr>
</table>
<p>s.7'deki şekilde <b>Muri (Overload)</b> ve <b>Mura (Variability)</b> okları <b>Muda (Waste)</b>'ya doğru akar: aşırı yük ve dalgalanma israfa yol açar.</p>

<h3>Yedi israf türü (LEAN s.8)</h3>
<ol>
  <li>Overproduction (aşırı üretim)</li>
  <li>Waiting (bekleme)</li>
  <li>Transportation (taşıma)</li>
  <li>Process (gereksiz/fazla işlem)</li>
  <li>Inventory (stok)</li>
  <li>Motion (hareket)</li>
  <li>Defects (hatalı ürün)</li>
</ol>
<p><b>The Biggest Waste (s.9): kullanılmayan insan zekâsı ve yeteneği</b> (unused human intelligence and talent) — yedi türün dışında, en büyük israf olarak ayrıca vurgulanır. s.10'daki "Inappropriate Crate/Box" fotoğrafında büyük bir sandığın içinde az sayıda küçük parça görünür (uygunsuz kasa/kutu örneği; yorum notlarda yok).</p>

<h3>Excessive Inventory (LEAN s.11–12)</h3>
<div class="model">h = i + s
h : holding cost (stok tutma maliyeti oranı)
i : yatırımın getiri oranı (rate of return on investment)
s : depo işletme maliyeti oranı (warehouse operation cost rate)</div>
<ul>
  <li>Aşırı stok → yüksek tutma maliyeti; aşınma/yıpranma ve miadı dolma riski; fazla alan ihtiyacı; planlama, kapasite yönetimi ve teslimat performansında düşüş.</li>
  <li><b>İşletme sorunlarını gizler</b> (hides business problems). s.12'deki "gemi ve kayalar" şeklinde su seviyesi stok düzeyidir: stok yüksekken kayalar (long set-ups, rework, poor housekeeping, machine breakdowns, mixed materials, delay in deliveries, generating defective products) suyun altında kalır; stok azaldıkça ortaya çıkar. "In-process inventory is high, problems are hidden…"</li>
  <li>Sayısal örnek (notlarda yok): i = 0.10 ve s = 0.05 ise h = 0.15 → 200,000 TL'lik stokun yıllık tutma maliyeti 200,000 × 0.15 = 30,000 TL.</li>
</ul>

<h3>Lean Production (LEAN s.13)</h3>
<p>Lean Production, <b>değer katmayan (israf) tüm faaliyetleri ortadan kaldırmayı hedefleyerek lead time, maliyet ve kalite performansını iyileştiren</b> bir yaklaşımdır.</p>

<h3>Lean araçları — House of Lean (LEAN s.14)</h3>
<table>
  <tr><th>Katman (yukarıdan aşağı)</th><th>Araçlar</th></tr>
  <tr><td>Çatı</td><td><b>Continuous Improvement</b> (şekilde "Culture" etiketi çatıdan 3. sıradaki Pull/Kanban–Cellular/Flow–TPM bloklarına kadar uzanan bölgeyi işaret eder)</td></tr>
  <tr><td>Üst blok</td><td>6 Sigma Root Cause Problem Solving</td></tr>
  <tr><td>3. sıra</td><td>Pull/Kanban · Cellular/Flow · TPM (Total Productive Maintenance)</td></tr>
  <tr><td>2. sıra</td><td>Quality at Source · POUS (Point of Use Storage) · Quick Set-up</td></tr>
  <tr><td>1. sıra</td><td>Lot Size Reduction · Standardized Work · Teams</td></tr>
  <tr><td>Taban</td><td>5S System · Visual Control · Plant Layout</td></tr>
  <tr><td>Merdiven (giriş)</td><td><b>Value Stream Mapping</b></td></tr>
</table>

<h3>Lean Roadmap (LEAN s.15)</h3>
<div class="model">Determining Product Family
   ↓
Current State Value Stream Mapping
   ↓
Future State Value Stream Mapping
   ↓
Current State Spaghetti Diagram
   ↓
Layout Planning (Cellular Manufacturing, Lines etc.) and Execution
   ↓
5S            ← SMED
   ↓
Pull System (Kanban, CONWIP, POLCA)</div>
<p>Yan kutular: <b>Poka-Yoke</b>; <b>Visual Management</b> (Asakai, Oobeya, Lean Management Boards, Andon); <b>Continuous Improvement (Kaizen)</b> — A3 reports, Suggestion System. SMED oku, Pull System kutusuna girer.</p>

<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
  <li><b>Muda = israf, Muri = aşırı yüklenme, Mura = düzensizlik/dalgalanma.</b> Üçü karıştırılır; Muri ve Mura, Muda'ya yol açar (s.7).</li>
  <li>Yedi israfın sırası: Overproduction, Waiting, Transportation, Process, Inventory, Motion, Defects. "En büyük israf" bunlardan biri değil, <b>kullanılmayan insan zekâsı ve yeteneği</b>dir.</li>
  <li>h = i + s: s depo işletme maliyeti oranı, i yatırımın getiri oranıdır — çarpım değil toplam.</li>
  <li>Stok azaldığında sorunlar <i>ortaya çıkar</i>; stok sorunları çözmez, <b>gizler</b>.</li>
  <li>Roadmap'te <b>VSM → spaghetti diagram → layout planning → 5S → pull system</b> sırası vardır; SMED pull system'e giriş yapar.</li>
  <li>Müşteri yalnızca dış müşteri değildir: izleyen süreç de müşteridir.</li>
</ul></div>
`;

  IM.content.concepts['2.2'] = [
    Q('Notlara göre bir faaliyet ne zaman <b>israf</b> (waste) sayılır?',
      ['@@Katma değeri yoksa', 'Yalnızca hatalı ürün üretiyorsa', 'Makine çalışırken bekliyorsa', 'Sadece dış müşteri ödemiyorsa'],
      'LEAN s.4: "If an activity has no added value, it is waste." Bekleme ve hata yedi israf türündendir ama tanım daha geneldir: katma değer yoksa israf.'),
    Q('<b>Value added activity</b> hakkında hangileri doğrudur? <i>(birden fazla doğru)</i>',
      ['@@Müşteri açısından değer katan faaliyettir.', '@@Müşterinin ödemeye razı olduğu faaliyettir.', 'Üretim maliyetini en çok artıran faaliyettir.', 'Her zaman en uzun süren operasyondur.'],
      'LEAN s.4: value added = customer perspective + customer is willing to pay. Süre veya maliyet büyüklüğü tanımda yoktur.'),
    Q('"Who is customer?" sorusuna notlardaki cevap nedir?',
      ['Yalnızca ürünü satın alan son kullanıcı', '@@İzleyen süreç/süreçler sizin müşterinizdir', 'Satış departmanı', 'Tedarikçi'],
      'LEAN s.5: "The following process/processes are your customers." İç müşteri kavramı: bir sonraki istasyon da müşteridir.'),
    Q('<b>Muda</b> notlarda nasıl tanımlanır?',
      ['@@Ürüne değer katmak için fiilen gereken minimum ekipman, malzeme, parça, alan ve işgücünün ötesindeki her şey', 'Makine ve insanların kapasitesinin üzerinde yüklenmesi', 'Üretim miktarının düzensiz dalgalanması', 'Gereksiz kâğıt işi'],
      'LEAN s.6: Muda (waste) = anything beyond the minimum amount of equipment, materials, parts, space and labor actually required to add value. İkinci şık Muri, üçüncü şık Mura tanımıdır.'),
    Q('Planlama ve üretim miktarı düzensiz olup geçici olarak artıp azalıyorsa hangi kavram söz konusudur?',
      ['Muda', 'Muri', '@@Mura', 'Seiri'],
      'LEAN s.6: Mura (variability) = üretim planlama ve miktarının düzenli olmadığı, geçici olarak yükselip alçaldığı durum. Muri aşırı yüklenmedir.'),
    Q('Makine ve çalışanların kapasitelerinin üzerinde işle yüklenmesi hangi kavramdır?',
      ['Muda', '@@Muri', 'Mura', 'Kaizen'],
      'LEAN s.6: Muri (overload) = overloading machinery, equipment and people with work beyond their capacity.'),
    Q('s.7\'deki şekle göre <b>Muri</b> ve <b>Mura</b> ile <b>Muda</b> arasındaki ilişki nedir?',
      ['@@Muri (Overload) ve Mura (Variability) Muda\'ya (Waste) yol açar', 'Muda, Muri ve Mura\'ya yol açar', 'Üçü birbirinden bağımsızdır', 'Mura, Muri\'nin başka adıdır'],
      'LEAN s.7: iki ok (Overload, Variability) Waste kutusuna iner. Aşırı yük ve düzensizlik israf üretir.'),
    Q('Aşağıdakilerden hangileri notlardaki <b>yedi israf türünden</b> biridir? <i>(birden fazla doğru)</i>',
      ['@@Waiting', '@@Process', '@@Motion', 'Training', 'Planning'],
      'LEAN s.8: Overproduction, Waiting, Transportation, Process, Inventory, Motion, Defects. Training ve Planning listede yoktur.'),
    Q('Yedi israf türü listesinde <b>Overproduction</b>\'dan hemen sonra hangisi gelir?',
      ['Transportation', '@@Waiting', 'Inventory', 'Defects'],
      'LEAN s.8 sırası: 1 Overproduction, 2 Waiting, 3 Transportation, 4 Process, 5 Inventory, 6 Motion, 7 Defects.'),
    Q('Notlarda <b>"en büyük israf"</b> (the biggest waste) olarak neden bahsedilir?',
      ['Overproduction', 'Inventory', 'Defects', '@@Kullanılmayan insan zekâsı ve yeteneği'],
      'LEAN s.9: "The Biggest Waste: Unused human intelligence and talent." Yedi türün dışında ayrıca vurgulanır.'),
    Q('Excessive inventory formülü <b>h = i + s</b> içinde <b>s</b> neyi gösterir?',
      ['Yatırımın getiri oranı', '@@Depo işletme maliyeti oranı', 'Stok seviyesi', 'Set-up süresi'],
      'LEAN s.11: h = holding cost; i = rate of return on investment; s = warehouse operation cost rate. Getiri oranı i\'dir.'),
    Q('Aşırı stoğun sonuçları arasında hangileri notlarda sayılır? <i>(birden fazla doğru)</i>',
      ['@@Aşınma/yıpranma ve miadı dolma riski', '@@Fazla alan ihtiyacı', '@@İşletme sorunlarını gizler', 'Teslimat performansını artırır', 'Tutma maliyetini düşürür'],
      'LEAN s.11: yüksek tutma maliyeti, wear and tear / expiration riski, fazla alan, planlama-kapasite yönetimi-teslimat performansında düşüş ve sorunları gizleme.'),
    Q('s.12\'deki "gemi ve kayalar" şekli stok hakkında ne anlatır?',
      ['Stok arttıkça kalite artar', '@@Stok yüksekken sorunlar gizli kalır; stok düzeyi düştükçe sorunlar ortaya çıkar', 'Stok düzeyi sorunların kaynağıdır', 'Stok düşürmek makine arızalarını artırır'],
      'LEAN s.12: "In-process inventory is high, problems are hidden…" Su seviyesi stoktur; long set-ups, rework, poor housekeeping, machine breakdowns, mixed materials, delay in deliveries gibi kayalar su altında kalır.'),
    Q('Notlardaki <b>Lean Production</b> tanımı hangisidir?',
      ['@@Tüm değer katmayan (israf) faaliyetleri ortadan kaldırmayı hedefleyerek lead time, maliyet ve kalite performansını iyileştiren yaklaşım', 'Stoku mümkün olduğunca artırarak teslimat güvencesi sağlayan yaklaşım', 'Yalnızca işgücü maliyetini düşüren yaklaşım', 'Üretimi tamamen otomatikleştiren yaklaşım'],
      'LEAN s.13: Lean Production is an approach that improves lead time, cost and quality performance by aiming to eliminate all non-value added (wasteful) activities.'),
    Q('House of Lean (s.14) şemasında <b>çatı</b> ve <b>merdiven</b> (giriş basamağı) hangileridir?',
      ['Çatı: 5S System — Merdiven: Kanban', '@@Çatı: Continuous Improvement — Merdiven: Value Stream Mapping', 'Çatı: Value Stream Mapping — Merdiven: TPM', 'Çatı: Pull/Kanban — Merdiven: Quick Set-up'],
      'LEAN s.14: çatı Continuous Improvement; taban sırası 5S System, Visual Control, Plant Layout; yan merdivende Value Stream Mapping yer alır.'),
    Q('Lean Roadmap\'te (s.15) <b>Future State Value Stream Mapping</b>\'ten hemen sonra hangi adım gelir?',
      ['5S', 'Pull System', '@@Current State Spaghetti Diagram', 'Layout Planning'],
      'LEAN s.15 sırası: Product Family → Current State VSM → Future State VSM → Current State Spaghetti Diagram → Layout Planning and Execution → 5S → Pull System (SMED, Pull System\'e girer).'),
  ];

  /* ===================================================================== 2.3 */
  IM.content.summaries['2.3'] = `
<h2>2.3 Değer akışı haritalama (Value Stream Mapping)</h2>
<p class="note">Ders notu: Lean Manufacturing s.16–25</p>
<p>Value Stream Mapping (VSM), bir ürünün hammaddeden müşteriye ulaşana kadarki <b>bütün</b> malzeme ve bilgi akışını tek sayfada gösteren bir haritalama yöntemidir
(LEAN s.16–17). Klasik yaklaşım her süreci/faaliyeti ayrı ayrı ele alırken, <b>value stream</b> yaklaşımı süreçleri birbirine bağlı bir akış olarak görür.</p>

<h3>Value stream ve VSM adımları (LEAN s.17–18)</h3>
<ul>
  <li><b>Value stream:</b> bir ürünü oluşturmak için temel akışlar boyunca gerekli olan, değer yaratan <i>ve yaratmayan</i> bütün faaliyetler kümesidir.</li>
  <li>VSM süreci: <b>Product Family</b> seçimi → <b>Current State Map</b> (faaliyetlerin tam anlaşılması ve gösterimi) → <b>Future State Map</b> (Lean Flow Design) → <b>Business Plan and Implementation</b> (uygulama planının hazırlanması ve yürütülmesi) → döngü yeniden başlar ("Again").</li>
</ul>

<h3>VSM sembolleri (LEAN s.19–21)</h3>
<table>
  <tr><th>Grup</th><th>Semboller</th></tr>
  <tr><td>Malzeme akışı (s.19)</td><td>Process box · Supplier/Customer · <b>Data box</b> (örnek: C/T = 45 sec, C/O = 30 min, 2 Shifts, 2% scrap ("Fire")) · Inventory (üçgen, "I"; örnek 300 pieces, 1 day) · Supermarket · Delivery (kamyon, örn. Mon + Thu) · <b>Push</b> (kesik çizgili ok) · <b>Physically pull</b> (dairesel ok) · Shipment to customer · <b>FIFO</b></td></tr>
  <tr><td>Bilgi akışı (s.20)</td><td>Manual information flow · Electronic information flow · Weekly chart · <b>Heijunka box</b> (OXOX) · Sequential-pull box · Withdrawal kanban · Production kanban · Signal kanban · Kanban box</td></tr>
  <tr><td>Genel (s.21)</td><td>Operator · <b>Improvement point</b> (patlama/kaizen şekli; örn. availability, preparation time) · Safety stock</td></tr>
</table>

<h3>Current State Map — Holder Bracket örneği (LEAN s.22)</h3>
<p>Müşteri State Street Assembly Plant: <b>18,400 adet/ay</b> (12,000 Left + 6,400 Right), kasa = 20 adet, 2 vardiya; tedarikçi Michigan Steel Company (500 ft coil, haftada Salı–Perşembe sevkiyat). Üretim planlama MRP ile haftalık üretim çizelgesi ve günlük sevkiyat çizelgesi verir. Günlük talep <b>920 adet</b> (18,400 / 20 iş günü).</p>
<table>
  <tr><th>Süreç</th><th>C/T</th><th>C/O</th><th>Availability</th><th>Sonrasındaki stok</th><th>Stok süresi</th></tr>
  <tr><td>Steel coil</td><td>—</td><td>—</td><td>—</td><td>—</td><td>5 gün</td></tr>
  <tr><td>Press (100-ton hydraulic)</td><td>1 s</td><td>1 saat</td><td>85%</td><td>4600 L + 2400 R = 7000</td><td>7.6 gün</td></tr>
  <tr><td>Welding #1</td><td>39 s</td><td>10 dk</td><td>100%</td><td>1100 L + 600 R = 1700</td><td>1.8 gün</td></tr>
  <tr><td>Welding #2</td><td>46 s</td><td>10 dk</td><td>80%</td><td>1600 L + 850 R = 2450</td><td>2.7 gün</td></tr>
  <tr><td>Assembly #1</td><td>62 s</td><td>0</td><td>100%</td><td>1200 L + 640 R = 1840</td><td>2 gün</td></tr>
  <tr><td>Assembly #2</td><td>40 s</td><td>0</td><td>100%</td><td>2700 L + 1440 R = 4140</td><td>4.5 gün</td></tr>
</table>
<div class="model">Stok süresi (gün) = Stok adedi / Günlük talep   (7000 / 920 = 7.6 ; 1700 / 920 = 1.8 ; 2450 / 920 = 2.7 ; 1840 / 920 = 2 ; 4140 / 920 = 4.5)
Lead Time = 5 + 7.6 + 1.8 + 2.7 + 2 + 4.5 = 23.6 gün
Value added time = 1 + 39 + 46 + 62 + 40 = 188 s
Takt time = 2 vardiya × 27,600 s / 920 = 60 s   (slayt 22'de yazmaz; s.24'te "Tempo = 60 sec")</div>
<p>Her süreç kutusunun altında 27,600 s (vardiya başına çalışma süresi) yazılıdır; takt time bu yüzden 2 vardiya için hesaplanır: 55,200 / 920 = 60 s. Alt zaman çizelgesinde stok beklemeleri (gün) üstte, değer katan işlem süreleri (s) altta gösterilir: 1 s, 39 s, 46 s, 62 s, 40 s. Lead time 23.6 gün iken değer katan süre yalnızca 188 s'dir; (notlarda yok) 1 gün = 55,200 s varsayımıyla bu, lead time'ın yaklaşık %0.014'üdür — zamanın neredeyse tamamı bekleme/stoktur.</p>

<h3>Future State Map — Retainer Bracket örneği (LEAN s.23–24)</h3>
<p>Future state map, <b>iyileştirilmiş malzeme ve bilgi akışıdır</b>; lean kavram ve tekniklerini bir araya getirir ve ayrıntılı bir iyileştirme planının hazırlanmasına yol gösterir (s.23). s.24'te: pressing (SMED, EPE = 1 shift, C/O &lt; 10 min), <b>cell type layout</b> ile Welding + Assembly (Tempo = 60 sec, C/O = 0, "User." (muhtemelen uptime) = %100, toplam iş &lt; 168 s), Heijunka box (OXOX), kanban kartları (20 adetlik), günlük sevkiyat ve "Elimination of waste".</p>
<div class="model">Future Lead Time = 1.5 + 1 + 2 = 4.5 gün      (current: 23.6 gün)
Future Value added time = 1 + 168 = 169 s        (current: 188 s)
Lead time azalması = (23.6 − 4.5) / 23.6 = %80.93   (notlarda yok)</div>

<h3>Yıllık değer akışı planı (LEAN s.25)</h3>
<p>Annual Value Flow Plan tablosu: ürün ailesi ve iş hedefleri, value flow cycle (pacemaker, press, coil), value flow purpose, ölçülebilir hedefler (ör. 0 WIP, C/O &lt; 60 s, press C/O &lt; 10 dk, stok &lt; 1.5 gün), 12 aylık program (oklar), sorumlu kişi, imza (factory direction, union, engineering, care) ve review/history sütunlarını içerir. Slayt görseli bozuk çevrilmiş metin içerir (ör. "165 sec" hedefi); ayrıntı için ders notundaki şekle bakın.</p>

<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
  <li><b>Stok süresi = stok adedi / günlük talep</b> (920); toplam LT bu sürelerin toplamıdır, değer katan süre (188 s) LT'ye eklenmeden ayrı raporlanır.</li>
  <li>Günlük talep 18,400 / 20 = 920; takt = <b>iki vardiya</b> × 27,600 / 920 = 60 s. Tek vardiya (27,600 / 920 = 30 s) ya da bütün ay üzerinden hesap yanlıştır.</li>
  <li>VA = 1 + 39 + 46 + 62 + 40 = <b>188</b>; future state'te 1 + 168 = <b>169</b> s. LT: <b>23.6 → 4.5</b> gün.</li>
  <li>Notlardaki ürün ailesi adı sayfalar arasında tutarsızdır: s.22 ve s.25 <i>Holder Bracket</i>, s.24 future state başlığı <i>Retainer Bracket</i>; s.25'te hedef "≤ 165 s" yazılırken s.24'te "&lt; 168 s" yazılıdır. Sayıları slaytta yazıldığı gibi kullanın.</li>
  <li>Push (kesik çizgili ok) ile physically pull (dairesel ok) sembollerini; withdrawal kanban ile production kanban'ı karıştırmayın.</li>
  <li>VSM sırası: product family → current state → future state → business plan and implementation.</li>
</ul></div>
`;

  IM.content.concepts['2.3'] = [
    Q('Notlarda <b>value stream</b> nasıl tanımlanır?',
      ['Yalnızca değer katan faaliyetlerin toplamı', '@@Bir ürünü oluşturmak için temel akışlar boyunca gerekli olan, değer yaratan ve yaratmayan faaliyetler kümesi', 'Sadece üretim hattındaki işlemler', 'Tedarikçi–müşteri sözleşme zinciri'],
      'LEAN s.17: value stream = set of activities essential for every product that create and do not create added value, along the basic flows. Değer yaratmayanlar da dahildir.'),
    Q('s.16\'daki klasik yaklaşım ile value stream yaklaşımı arasındaki fark nedir?',
      ['@@Klasik yaklaşım süreç/faaliyetleri ayrı ayrı ele alır; value stream yaklaşımı süreçleri bağlı bir akış olarak görür', 'Klasik yaklaşım bütün akışı, value stream tek süreci inceler', 'İkisi aynıdır', 'Value stream yaklaşımı yalnızca bilgi akışını ele alır'],
      'LEAN s.16 şeması: classical approach\'ta process/activity kutuları ayrı; value stream approach\'ta akışla bağlı. (Yorum şekilden çıkarılmıştır.)'),
    Q('VSM sürecinin adımlarının doğru sırası hangisidir? (LEAN s.18)',
      ['Current State Map → Product Family → Future State Map → Business Plan', '@@Product Family → Current State Map → Future State Map → Business Plan and Implementation', 'Future State Map → Current State Map → Product Family → Business Plan', 'Product Family → Future State Map → Current State Map → Business Plan'],
      'LEAN s.18: Product Family Selection → Current State Map (complete understanding and portrayal of activities) → Future State Map (Lean Flow Design) → Business Plan and Implementation → "Again".'),
    Q('s.19\'daki <b>data box</b> örneğinde hangi bilgiler yer alır? <i>(birden fazla doğru)</i>',
      ['@@C/T (cycle time) = 45 sec', '@@C/O (changeover) = 30 min', '@@Vardiya sayısı (2 Shifts)', '@@Fire/hurda oranı (2%)', 'Lead time'],
      'LEAN s.19 data box: C/T = 45 sec, C/O = 30 min, 2 Shifts, 2% Fire (scrap). Lead time haritanın alt zaman çizelgesinde gösterilir, data box\'ta yoktur.'),
    Q('Aşağıdakilerden hangisi malzeme akışı sembolü <b>değildir</b>? (s.19–20)',
      ['Push oku', 'FIFO', 'Supermarket', '@@Heijunka box (OXOX)'],
      'Heijunka box bilgi akışı sembollerindendir (LEAN s.20). Push, FIFO ve supermarket malzeme akışı sembolleridir (s.19).'),
    Q('<b>Improvement point</b> (patlama şekli) ve <b>safety stock</b> hangi sembol grubundadır?',
      ['Malzeme akışı sembolleri', 'Bilgi akışı sembolleri', '@@General symbols', 'Kanban sembolleri'],
      'LEAN s.21 General Symbols: Operator, Improvement Point (örnek: availability, preparation time), Safety Stock.'),
    Q('Current state map\'te (s.22) günlük talep nasıl bulunur?',
      ['12,000 + 6,400 = 18,400 adet/gün', '@@18,400 / 20 iş günü = 920 adet/gün', '27,600 / 18,400 = 1.5 adet/gün', '2 × 27,600 / 920 = 60 adet/gün'],
      'LEAN s.22: 18,400 adet/ay (12,000 L + 6,400 R) ve haritada Daily Demand: 920 pieces → 18,400 / 20 = 920. Son şık takt time\'dır (60 s), günlük talep değil.'),
    Q('Assembly #2 sonrasındaki 4140 adetlik stok (2700 L + 1440 R) kaç gündür? (günlük talep 920)',
      ['2 gün', '2.7 gün', '@@4.5 gün', '7.6 gün'],
      'Stok süresi = 4140 / 920 = 4.5 gün (LEAN s.22 zaman çizelgesinin son basamağı). 7.6 gün press sonrası 7000 adetlik stoktur.'),
    Q('Current state map\'te toplam <b>Lead Time</b> nasıl oluşur ve değeri nedir?',
      ['@@Stok sürelerinin toplamı: 5 + 7.6 + 1.8 + 2.7 + 2 + 4.5 = 23.6 gün', 'Değer katan sürelerin toplamı: 188 s', 'Takt time × stok sayısı = 360 s', 'Sadece press sonrası stok: 7.6 gün'],
      'LEAN s.22: Lead Time = 23.6 days; 5 gün steel coil + 7.6 + 1.8 + 2.7 + 2 + 4.5. 188 s değer katan işlem süresidir (Value added time).'),
    Q('s.22\'deki <b>Value added time = 188 s</b> değeri nasıl elde edilir?',
      ['5 + 7.6 + 1.8 + 2.7 + 2 + 4.5', '@@Süreçlerin C/T toplamı: 1 + 39 + 46 + 62 + 40', 'Yalnızca Assembly #1 + #2: 62 + 40', '2 × 27,600 / 920'],
      'Value added time = 1 + 39 + 46 + 62 + 40 = 188 s (LEAN s.22). 60 s ise takt time\'dır.'),
    Q('Current state\'te çalışma süresi 27,600 s/vardiya, 2 vardiya ve günlük talep 920 ise <b>takt time</b> kaçtır?',
      ['30 s', '@@60 s', '188 s', '27,600 s'],
      'Takt = 2 × 27,600 / 920 = 55,200 / 920 = 60 s (s.22\'de yazmaz; s.24\'te "Tempo = 60 sec"). 30 s tek vardiya hesabıdır (yanlış).'),
    Q('Future state map\'e (s.24) göre aşağıdakilerden hangileri doğrudur? <i>(birden fazla doğru)</i>',
      ['@@Lead time 4.5 gündür', '@@Value added time 169 s\'dir', '@@Pressing için SMED uygulanır ve C/O &lt; 10 dk hedeflenir', '@@Welding + Assembly cell type layout ile yapılır (Tempo = 60 sec)', 'Lead time 23.6 gündür'],
      'LEAN s.24: Lead time 4.5 days (1.5 + 1 + 2), VA = 169 s (1 + 168), SMED / EPE = 1 shift / C/O &lt; 10 min, cell type layout, Tempo = 60 sec. 23.6 gün current state değeridir.'),
    Q('Future state map\'in amacı notlara göre nedir?',
      ['@@İyileştirilmiş malzeme ve bilgi akışını göstermek, lean tekniklerini birleştirmek ve ayrıntılı iyileştirme planına yol göstermek', 'Mevcut durumu olduğu gibi belgelemek', 'Yalnızca tedarikçi seçimi yapmak', 'Stokları artırmak'],
      'LEAN s.23: improved material and information flow; combines lean concepts and techniques; leads the preparation of a detailed improvement plan.'),
    Q('Annual Value Flow Plan (s.25) tablosunda hangi unsurlar bulunur? <i>(birden fazla doğru)</i>',
      ['@@Ölçülebilir hedefler (measurable goals)', '@@12 aylık program (monthly program)', '@@Sorumlu kişi ve imzalar', 'Anlık makine arıza kayıtları'],
      'LEAN s.25: product family / business goals, value flow cycle ve purpose, measurable goals, monthly program (12 ay), responsible person, signatures, review/history. Arıza kaydı tabloda yoktur.'),
  ];

  /* ===================================================================== 2.4 */
  IM.content.summaries['2.4'] = `
<h2>2.4 Yerleşim planlama ve hücresel üretim (Cellular manufacturing)</h2>
<p class="note">Ders notu: Lean Manufacturing s.26–44</p>
<p>Yerleşim planlaması (<b>layout planning</b>) lean roadmap'te value stream haritalarından sonra gelir (LEAN s.15): önce mevcut hareketler <b>spaghetti diagram</b> ile görülür, sonra yerleşim yeniden tasarlanır.</p>

<h3>Layout planning (LEAN s.26)</h3>
<ul>
  <li>Malzeme ve bilgi akışını iyileştirmek,</li>
  <li><b>taşıma israfını (transportation waste) azaltmak</b>,</li>
  <li>tesisi ve ofisi doğru biçimde düzenlemek.</li>
</ul>

<h3>Spaghetti diagram (LEAN s.27–29)</h3>
<p>Bir ürün/ürün ailesinin yerleşim planı üzerindeki gerçek hareket güzergâhı çizilir (slaytta "Spagetti Diyagramı" / "Yerleşim Planı"). s.27 örneği "kalın tuşlu piezo çakmak ürün ailesi"dir: yol numaraları 1–11, sonuçta hesap:</p>
<div class="model">65.5 × 40 = 2620 m
20 × 160   = 3200 m
─────────────
toplam     = 5820 m / ay
5820 × 12  = 69,840 m / yıl ≈ 70 km / yıl   (gövde — kalın tuşlu)</div>
<p>(65.5 ve 20 muhtemelen yol uzunluğu [m], 40 ve 160 sefer sayısıdır; slayt çarpanların anlamını yazmaz.) s.28 başka bir ürün ailesinin spagetti şemasıdır (talaşlı imalat bölümü, tezgâh numaraları ve renkli rotalar; başlık okunaklı değil); s.29 farklı renklerle çizilmiş çok sayıda hareket çizgisi gösterir. Çok dolaşık spagetti = uzun ve karmaşık malzeme akışı = taşıma israfı.</p>

<h3>Cellular Production System (LEAN s.30–32)</h3>
<p><b>Tanım:</b> belirli parça gruplarının (<b>part families</b>) üretimi için, benzer imalat özelliklerine sahip parçaları sistem içinde ayrı yerlerde (<b>cells</b>) üreten süreç, insan ve makine gruplarından oluşan sistemlerdir.</p>
<table>
  <tr><th></th><th>Job Shop (s.31)</th><th>Cellular (s.32, 3 hücre)</th></tr>
  <tr><td>Düzen</td><td>Makineler <b>fonksiyonel bölümlerde</b>: Turning, Milling, Drilling, Grinding, Assembly, Shipping Section</td><td>Makineler <b>Cell 1, Cell 2, Cell 3</b> içinde ürün ailesine göre gruplanır; Shipping Section ayrı</td></tr>
  <tr><td>Akış</td><td>Parçalar bölümler arasında dolaşır, çok sayıda uzun çapraz yol</td><td>Parça kendi hücresi içinde akar, yollar kısalır</td></tr>
  <tr><td>Alan</td><td>—</td><td><b>Saved Space</b> kazanılır; hücrelere atanmamış makineler için <b>Functional Area for Unassigned Machines</b> ayrılır</td></tr>
</table>

<h3>U-type layout ve montaj hücresi (LEAN s.33–34)</h3>
<p>s.33'te bir operatör makinelerin ortasında U biçiminde yürüyerek parçayı sırayla makinelere yükler; bu <b>U-type layout</b>'tur. s.34 <b>U-type assembly cell</b> fotoğrafıdır: iki çalışan U şeklinde kurulmuş montaj hücresinde çalışır (U düzeninin faydaları — kısa yürüme mesafesi vb. — notlarda yazılı değildir).</p>

<h3>Product families, rocker switch (LEAN s.35–36)</h3>
<p>s.35 "Product Families": üstte birbirine karışmış parçalar, altta aile bazında ışınsal olarak ayrılmış parçalar — hücre kurmadan önce ürünler/parçalar ailelere ayrılır. s.36 <b>Rocker Switch Assembly Area</b>: <i>Before</i> — çok sayıda üst üste binmiş yol içeren dolaşık spagetti şeması; <i>After</i> — düzenli, akış raflı (flow rack) montaj alanı fotoğrafı.</p>

<h3>Layout planning simulation ve yazılımlar (LEAN s.37–41)</h3>
<ul>
  <li><b>Example 1 (s.37):</b> fabrikanın fiziksel masa üstü maketi üzerinde (blok parçalarla) planlama.</li>
  <li><b>Example 2 (s.38–40):</b> makinelerin ölçekli kâğıt kesitleri (s.38) plan üzerine yerleştirilir; ekip masada çalışır (s.39); sonuç yerleşimde "gelecek yatırım için boşaltılan alan" ayrılır (s.40).</li>
  <li><b>Facility Design Softwares (s.41):</b> FactoryFLOW · Visufact · Factory Cad · visTABLE · VIP-PLANOPT.</li>
</ul>

<h3>Planned–Realized Tracking (LEAN s.42–44)</h3>
<ul>
  <li><b>s.42:</b> hücre izleme formu — Cell No / Cell Name; saatlik satırlar (8:00–9:00, …, 17:00–18:00); sütunlar: <b>Product, Planned, Realized, Total Planned, Total Realized, +/−, # of Defects, Problem/Comment</b>.</li>
  <li><b>s.43 Project Management:</b> projeler ve aşamalar (Order Entry, Contract Preparation, Customer Review, …, Down Payment Tracking); her aşamanın planlanan süresi (ör. 2 days, 8 days, 1 day, 4 days, 13 days), planlanan/gerçekleşen tarih kutuları, "Early or Late Cause" sütunu.</li>
  <li><b>s.44 Project Phases:</b> aynı fikrin pano (whiteboard) uygulaması: satırlar projeler, sütunlar aşamalar.</li>
</ul>

<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
  <li><b>Job shop = fonksiyonel bölümler</b> (turning, milling, drilling, grinding…); <b>cell = ürün ailesine göre gruplanmış makineler</b>. Hücresel üretimin kazancı akışın kısalması ve <b>saved space</b>'dir.</li>
  <li>Hücre kurmak için önce <b>part/product family</b> belirlenir (benzer imalat özellikleri); yalnızca makine tipine bakarak değil.</li>
  <li>Spagetti diagram bir <i>mevcut durum</i> aracıdır (current state spaghetti → layout planning); amacı hareket/taşıma israfını görünür kılmaktır. s.27 hesabı: 2620 + 3200 = 5820 m/ay; × 12 = 69,840 m ≈ 70 km/yıl.</li>
  <li>Layout planning'in amacı taşıma israfını azaltmaktır — üretim miktarını artırmak değil.</li>
  <li>U-type layout operatör hareketiyle ilgilidir; U-type assembly cell montaj içindir (s.33–34).</li>
  <li>Planned–Realized tracking'de fark sütunu "+/−"dır; "# of defects" ayrı sütundur.</li>
</ul></div>
`;

  IM.content.concepts['2.4'] = [
    Q('Notlara göre <b>layout planning</b>\'in amaçları arasında hangileri yer alır? <i>(birden fazla doğru)</i>',
      ['@@Malzeme ve bilgi akışını iyileştirmek', '@@Taşıma israfını azaltmak', '@@Tesisi ve ofisi doğru biçimde yapılandırmak', 'Makine sayısını artırmak', 'Stoku yükseltmek'],
      'LEAN s.26: improving the flow of materials and information; reduce transportation waste; configuring the facility and office correctly.'),
    Q('Lean roadmap\'e göre <b>current state spaghetti diagram</b> hangi adımdan sonra, hangisinden önce gelir?',
      ['5S\'ten sonra, SMED\'den önce', '@@Future state VSM\'den sonra, layout planning\'den önce', 'Layout planning\'den sonra, 5S\'ten önce', 'Product family seçiminden önce'],
      'LEAN s.15: Future State VSM → Current State Spaghetti Diagram → Layout Planning (Cellular Manufacturing, Lines etc.) and Execution.'),
    Q('s.27\'deki spagetti diagram örneğinde aylık toplam hareket mesafesi nasıl bulunur?',
      ['@@65.5 × 40 + 20 × 160 = 2620 + 3200 = 5820 m/ay', '65.5 + 40 + 20 + 160 = 285.5 m/ay', '5820 × 12 = 69,840 m/ay', '2620 − 3200 = −580 m/ay'],
      'LEAN s.27: 65.5×40 = 2620 m, 20×160 = 3200 m, toplam 5820 m/AY. 69,840 m yıllık değerdir.'),
    Q('s.27\'de aylık 5820 m yıllık kaç metre/km eder?',
      ['58,200 m ≈ 58 km', '@@69,840 m ≈ 70 km', '6,982 m ≈ 7 km', '698,400 m ≈ 698 km'],
      'LEAN s.27: 5820 × 12 = 69,840 m/yıl = 70 km/yıl.'),
    Q('<b>Cellular production system</b> notlarda nasıl tanımlanır?',
      ['Tüm makinelerin türüne göre bölümlerde toplandığı sistem', '@@Benzer imalat özelliklerine sahip parça gruplarının (part families) sistem içinde ayrı yerlerde (cells) üretildiği, süreç, insan ve makine gruplarından oluşan sistem', 'Tek makineli ve tek operatörlü sistem', 'Tamamen otomatik montaj hattı'],
      'LEAN s.30: groups of processes, people and machines for the manufacturing of certain groups of parts (part families) with similar manufacturing characteristics in separate places (cells). İlk şık job shop düzenidir.'),
    Q('s.31\'deki <b>job shop</b> yerleşiminde makineler nasıl gruplanmıştır?',
      ['Ürün ailesine göre hücrelerde', '@@Fonksiyonel bölümlerde: Turning, Milling, Drilling, Grinding, Assembly, Shipping', 'Rastgele', 'Tedarikçiye göre'],
      'LEAN s.31 Job Shop Manufacturing System: Turning Section, Milling Section, Drilling Section, Grinding Section, Assembly Section, Shipping Section.'),
    Q('s.32\'deki üç hücreli sistemde (<b>cellular manufacturing system with 3 cells</b>) job shop\'a göre hangi kazanç ve ayrılan alan gösterilir? <i>(birden fazla doğru)</i>',
      ['@@Saved Space (kazanılan alan)', '@@Functional Area for Unassigned Machines (hücrelere atanmamış makineler için alan)', '@@Cell 1, Cell 2, Cell 3 olarak ayrılmış hücreler', 'Montaj bölümünün tamamen kaldırılması'],
      'LEAN s.32: Cell 1, Cell 2, Cell 3, Saved Space, Shipping Section ve Functional Area for Unassigned Machines.'),
    Q('Hücre oluşturmadan önce makine/parçalar hangi temele göre gruplanır?',
      ['Makine markası', '@@Benzer imalat özelliklerine sahip product/part family', 'Operatörün kıdemi', 'Parçanın rengi'],
      'LEAN s.30 ve s.35 (Product Families): benzer imalat özelliklerine sahip parça aileleri → hücre.'),
    Q('<b>U-type layout</b> (s.33) şekli nedir?',
      ['Makinelerin düz bir sıra halinde dizilmesi', '@@Operatörün U biçimli bir yol izleyerek makineler arasında çalıştığı yerleşim', 'Tek makinenin etrafında depo', 'Stok alanının U şeklinde ayrılması'],
      'LEAN s.33: operatör U biçiminde (kesik çizgili ok) makinelerin arasında parçayı taşır; s.34 U-type assembly cell fotoğrafıdır.'),
    Q('s.36\'daki <b>rocker switch</b> montaj alanı örneğinde "Before" ve "After" nasıl farklıdır?',
      ['Before düzenli akış raflı alan, After dolaşık spagetti şeması', '@@Before çok sayıda yol çizgisi içeren dolaşık spagetti şeması, After düzenli akış raflı montaj alanı fotoğrafı', 'İkisi aynı yerleşimdir', 'Before otomatik montaj hattı, After elle montaj'],
      'LEAN s.36: Rocker Switch Assembly Area (Before) = spagetti şeması; (After) = yeni düzenli montaj alanı.'),
    Q('Layout planning <b>simulation</b> örneklerinde (s.37–40) aşağıdakilerden hangileri görülür? <i>(birden fazla doğru)</i>',
      ['@@Fabrikanın fiziksel masa üstü maketi (Example 1)', '@@Makinelerin ölçekli kâğıt kesitleriyle plan üzerinde yerleştirme (Example 2)', '@@Gelecek yatırım için boşaltılan alan', 'Robot programlama ekranı'],
      'LEAN s.37 (maket), s.38–39 (kâğıt kesitler ve ekip çalışması), s.40 (plan üzerinde "gelecek yatırım için boşaltılan alan").'),
    Q('s.41\'deki <b>Facility Design Softwares</b> listesinde hangileri vardır? <i>(birden fazla doğru)</i>',
      ['@@FactoryFLOW', '@@Visufact', '@@visTABLE', '@@VIP-PLANOPT', 'SolidWorks'],
      'LEAN s.41: FactoryFLOW, Visufact, Factory Cad, visTABLE, VIP-PLANOPT. SolidWorks listede yoktur.'),
    Q('s.42\'deki <b>Planned–Realized Tracking</b> formunda hangi sütunlar vardır?',
      ['Yalnızca Planned ve Realized', '@@Time, Product, Planned, Realized, Total Planned, Total Realized, +/−, # of Defects, Problem/Comment', 'Operator, Machine, Cost, Profit', 'Date, Supplier, Price'],
      'LEAN s.42: Cell No / Cell Name başlığı altında saatlik satırlar ve bu sütunlar.'),
    Q('s.43–44\'teki <b>Planned–Realized Tracking in Project Management</b> neyi izler?',
      ['Hücre başına saatlik üretim adedini', '@@Projelerin aşamalarını (planlanan ve gerçekleşen tarih/süre) ve erken ya da geç kalma nedenini', 'Stok seviyelerini', 'Makine bakım maliyetlerini'],
      'LEAN s.43–44: projeler satır, aşamalar (Order Entry, Contract Preparation, Customer Review, …) sütun; planned/realized kutuları ve "Early or Late Cause" sütunu.'),
  ];

  /* ===================================================================== 2.5 */
  IM.content.summaries['2.5'] = `
<h2>2.5 5S</h2>
<p class="note">Ders notu: Lean Manufacturing s.45–73</p>
<p><b>5S</b>, düzenli, temiz ve yüksek performanslı bir çalışma ortamı yaratan ve diğer iyileştirme çalışmalarının temelini oluşturan bir sistemdir; aynı zamanda <b>Kaizen için koşullandırıcı bir disiplindir</b> (LEAN s.45).</p>

<h3>5S adımları (LEAN s.46)</h3>
<table>
  <tr><th>#</th><th>Japonca</th><th>İngilizce (notlarda)</th></tr>
  <tr><td>1</td><td><b>Seiri</b></td><td>Sort</td></tr>
  <tr><td>2</td><td><b>Seiton</b></td><td>Simplify</td></tr>
  <tr><td>3</td><td><b>Seiso</b></td><td>Shine</td></tr>
  <tr><td>4</td><td><b>Seiketsu</b></td><td>Standardize</td></tr>
  <tr><td>5</td><td><b>Shitsuke</b></td><td>Training &amp; Discipline</td></tr>
</table>

<h3>1. Seiri – Sort (LEAN s.47–51)</h3>
<ul>
  <li>Ortamdan <b>gereksizi uzaklaştırmak</b>: neyin gerekli olduğunu ve tutmamız gerektiğini, neyin gereksiz olduğunu ve atmamız gerektiğini doğru ayırt etmek; sonra gereksizden kurtulup gerekli olanları <b>kullanım sıklığına göre</b> yerleştirmek.</li>
  <li><b>Araç: Red Tag uygulaması</b> (s.48) — kırmızı etiket gibi görsel yöntemler kullanılır; ek alan kazandırır, bozuk aletleri ve fazla malzemeyi (stok) elemeye yardım eder. Etiket üzerinde tarih, etiketleyen, malzeme adı, yer, kategori (equipment, machine parts, tools &amp; jigs, raw materials, finished goods, work-in-process…) ve neden (scrap, old/obsolete, not needed, extra, defect…) alanları bulunur; eylem seçenekleri (trash, hold, move to…) etiket formunda yer alır.</li>
  <li>s.49: kırmızı etiket yapıştırılmış dolap, kablo, kutu ve karton fotoğrafları. s.50: <b>5S Red Tag Action Plan</b> tablosu — No, Photo No, Action, Responsible, Planned Date, Realized Date, Comment. s.51: bir red tag vakası (before/after; yangın tüpü örneği).</li>
</ul>

<h3>2. Seiton – Simplify (LEAN s.52–54)</h3>
<ul>
  <li>Tutmaya karar verdiğimiz şeyleri ihtiyaç anında kolayca bulup kullanabilmek için yaptığımız düzenlemelerdir. <b>"Her şeyin bir yeri olmalı ve o yerin bir adı olmalı."</b></li>
  <li>Araçlar: <b>Tools</b>, pre-cleaning, ekipman/ölçü aleti/kesici/kalıpların düzenli yerleşimi, boyama (zemin çizgileri), işaretleme sistemi (visual control).</li>
  <li><b>3 Keys</b> (s.53): <b>Where?</b> → yerleri belirle (identify places); <b>What?</b> → nesneleri belirle (identify objects); <b>How many?</b> → miktarları belirle (determine quantities). Amaç: <b>herkes anında görebilsin, alabilsin ve yerine koyabilsin</b> (anyone immediately: to see, to receive, to replace) — <b>30 seconds rule!</b> Standardization ile ilişkilidir.</li>
</ul>
<table>
  <tr><th>Kullanım sıklığı (Frequency of use)</th><th>Duracağı yer (Place to stay)</th></tr>
  <tr><td>Always (her zaman)</td><td>Close (yakın)</td></tr>
  <tr><td>Sometimes (ara sıra)</td><td>A little far away (biraz uzak)</td></tr>
  <tr><td>Rarely (nadiren)</td><td>To another place (başka bir yere)</td></tr>
</table>

<h3>3. Seiso – Cleaning (LEAN s.55–57)</h3>
<ul>
  <li><b>Amaç:</b> (1) bütün kir ve pislikten arınmış temiz bir çalışma yeri; (2) temizlik sırasında çalışma alanını tanıma fırsatı. İş yeri her zaman "denetime hazırlanıyormuş gibi" temiz olmalıdır.</li>
  <li><b>Adımlar:</b> 1. neyi temizleyeceğine karar ver; 2. kimin temizleyeceğine karar ver; 3. temizlik yöntemini belirle; 4. temizlik ekipmanını hazırla; 5. temizle.</li>
  <li><b>Kim temizleyecek?</b> (s.56): <b>cleaning responsibility map</b> ve <b>cleaning calendar</b> hazırlanır, görsel olarak asılır. s.57'de ofis için renk kodlu alan sorumluluk haritası: her çalışan kendi rengindeki alandan sorumludur, ortak alan ayrı renktedir.</li>
</ul>

<h3>4. Seiketsu – Standardization (LEAN s.58–59)</h3>
<p>İlk üç adımla sağlanan başarıları <b>sürdürmek</b> içindir. Herkesin aklında olması gereken <b>3 ilke</b>: (1) üretim alanında gereksiz malzeme istemiyoruz; (2) karmaşa ve düzensizlik istemiyoruz; (3) toz ve kir istemiyoruz. Bunu sağlamanın yolu her şeyi sürekli kontrol etmek ve uygunsuzlukları gidermektir. s.59 <b>5S Sample Checklist</b>: her S için kontrol maddeleri (Sort: dolaplar, masalar, çekmeceler…; Set in order: tools and equipment, labeling, inventory control (kanban kartı, FIFO, min–max), outlining; Shine: bina yapısı, raflar, makineler, aydınlatma, havalandırma…; Standardize: visual controls, procedures, 5S documentation, responsibilities, regular audits; Sustain: 5S system, success stories, rewards and recognition) ve "Exist? / Rating / Comments" sütunları.</p>

<h3>5. Shitsuke – Discipline &amp; Training (LEAN s.60–61)</h3>
<ul>
  <li>Herkes gerekli çabayı gösterirse iş yeri temiz ve düzenli tutulabilir.</li>
  <li>Çalışanlar için <b>eğitim planı</b>; denetim sonuçları değerlendirilir; her alanın sonuçları <b>görsel olarak duyurulur ve yayımlanır</b>.</li>
  <li><b>Günlük:</b> ofis ortamında herkes çalışma alanının düzenini kontrol eder. <b>Haftalık:</b> bölümler <b>15 dakikalık</b> ayrıntılı sınıflandırma–düzenleme çalışması yapar. <b>Haftalık:</b> bölümler <b>5 dakikalık çapraz (cross) 5S değerlendirmesi</b> yapar.</li>
</ul>
<div class="model">Günlük         : herkes kendi alanının düzenini kontrol eder
Haftalık 15 dk : bölüm içi ayrıntılı sınıflandırma–düzenleme çalışması
Haftalık  5 dk : bölümler arası çapraz 5S değerlendirmesi</div>

<h3>5S'in faydaları (LEAN s.62)</h3>
<ul>
  <li>Hareket israfını azaltır; alan kazandırır; iş sağlığı ve güvenliğini destekler; arızaları azaltır; firma imajını iyileştirir; çalışanların üretim sistemine aidiyetini artırır.</li>
</ul>
<p>s.63–73: iyileştirme örnekleri (before/after fotoğrafları, ofis 5S örnekleri, çekmece düzeni, klasör işaretleme, renk kodlu klasör yönetimi, kapaklı dolapların içinin fotoğrafını kapağa yapıştırarak görsel hale getirme).</p>

<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
  <li><b>Sıra ve çeviri:</b> Seiri = Sort (gereksizi ayır/at), Seiton = Simplify (yerleştir, her şeyin yeri), Seiso = Shine (temizle), Seiketsu = Standardize, Shitsuke = Training &amp; Discipline. Notlarda Seiton "Simplify" olarak geçer ("Set in order" kontrol listesinde).</li>
  <li>Sıklık tablosu: <b>always → close</b>, <b>sometimes → a little far away</b>, <b>rarely → to another place</b>.</li>
  <li><b>3 keys = Where? What? How many?</b> (yer, nesne, miktar) ve <b>30 seconds rule</b>: herkes anında görsün, alsın, yerine koysun.</li>
  <li>Seiso adım sırası: neyi temizleyeceğine karar ver → kim → yöntem → ekipman → temizle. "Kim temizleyecek" cleaning responsibility map + cleaning calendar ile görselleştirilir.</li>
  <li>Seiketsu'nun 3 ilkesi: gereksiz malzeme, karmaşa/düzensizlik, toz/kir <i>istemiyoruz</i>. Shitsuke: günlük + haftalık <b>15 dk</b> + haftalık <b>5 dk</b>.</li>
  <li>5S Kaizen'in yerine geçmez; Kaizen için koşullandırıcı bir disiplindir ve diğer iyileştirmelerin temelidir.</li>
  <li>Red tag Seiri aracıdır (Seiso/Seiton değil).</li>
</ul></div>
`;

  IM.content.concepts['2.5'] = [
    Q('Notlara göre <b>5S</b> nedir?',
      ['@@Düzenli, temiz ve yüksek performanslı bir iş yeri yaratan, diğer iyileştirme çalışmalarının temelini oluşturan ve Kaizen için koşullandırıcı bir disiplin olan sistem', 'Yalnızca temizlik kampanyası', 'Stok kontrol yöntemi', 'Bakım planlama yöntemi'],
      'LEAN s.45: a system for creating an organised, clean and high-performance workplace; forms the basis for other improvement efforts; a conditioning discipline for Kaizen.'),
    Q('5S adımlarının notlardaki sırası ve İngilizce karşılıkları hangisidir?',
      ['Seiri (Simplify) – Seiton (Sort) – Seiso (Shine) – Seiketsu (Standardize) – Shitsuke (Discipline)', '@@Seiri (Sort) – Seiton (Simplify) – Seiso (Shine) – Seiketsu (Standardize) – Shitsuke (Training & Discipline)', 'Seiri (Shine) – Seiton (Sort) – Seiso (Simplify) – Seiketsu (Discipline) – Shitsuke (Standardize)', 'Seiso (Sort) – Seiri (Shine) – Seiton (Simplify) – Shitsuke (Standardize) – Seiketsu (Discipline)'],
      'LEAN s.46: Seiri (Sort), Seiton (Simplify), Seiso (Shine), Seiketsu (Standardize), Shitsuke (Training & Discipline).'),
    Q('Hangi adım "ortamdan gereksizi uzaklaştırma ve gerekli olanları kullanım sıklığına göre yerleştirme"dir?',
      ['Seiton', '@@Seiri', 'Seiso', 'Shitsuke'],
      'LEAN s.47: Seiri–Sort = removing the unnecessary; place the necessary according to the frequency of use. Seiton ise bulmayı kolaylaştıran düzenlemedir.'),
    Q('<b>Red tag</b> uygulaması hakkında hangileri doğrudur? <i>(birden fazla doğru)</i>',
      ['@@Seiri adımının aracıdır (görsel yöntem).', '@@Ek alan kazanmaya yardım eder.', '@@Bozuk aletlerin ve fazla malzemenin (stok) elenmesine yardım eder.', 'Temizlik takvimini oluşturmak için kullanılır.'],
      'LEAN s.48: Tool: Red Tag Application — use visual methods; can help gain additional space and eliminate broken tools and excess material (inventory). Temizlik takvimi Seiso\'dadır.'),
    Q('s.50\'deki <b>5S Red Tag Action Plan</b> tablosunda hangi sütunlar vardır?',
      ['Photo No, Machine, Cost, Profit', '@@No, Photo No, Action, Responsible, Planned Date, Realized Date, Comment', 'Time, Product, Planned, Realized', 'Seiri, Seiton, Seiso, Seiketsu, Shitsuke'],
      'LEAN s.50: Company/Section Red Tag Action Plan; sütunlar: No, Photo No, Action, Responsible, Planned Date, Realized Date, Comment.'),
    Q('<b>Seiton</b>\'un temel ilkesi hangisidir?',
      ['Gereksiz her şeyi atmak', '@@Her şeyin bir yeri olmalı ve o yerin bir adı olmalı', 'Haftada 5 dakika çapraz değerlendirme yapmak', 'Her gün zemini silmek'],
      'LEAN s.52: "Everything should have a place and the place should have a name." Araçlar: pre-cleaning, düzenli yerleşim, zemin çizgileri, işaretleme sistemi.'),
    Q('Seiton\'daki <b>3 keys</b> hangileridir?',
      ['@@Where? What? How many? (yer, nesne, miktar)', 'Sort, Shine, Standardize', 'Always, Sometimes, Rarely', 'Who? When? How?'],
      'LEAN s.53: Where? → identify places; What? → identify objects; How many? → determine quantities (3 Keys).'),
    Q('<b>30 seconds rule</b> neyi ifade eder?',
      ['Her gün 30 saniye temizlik yapmak', '@@Herkesin (anyone) gerekli şeyi anında görebilmesi, alabilmesi ve yerine koyabilmesi', 'Red tag\'in 30 saniyede yapıştırılması', 'Haftalık değerlendirmenin 30 saniye sürmesi'],
      'LEAN s.53: anyone immediately: to see, to receive, to replace — 30 seconds rule! Standardization ile ilişkilidir.'),
    Q('Kullanım sıklığı–duracağı yer eşleşmesi (s.54) hangisidir?',
      ['Always → another place; Rarely → close', 'Always → a little far away; Sometimes → close', '@@Always → close; Sometimes → a little far away; Rarely → to another place', 'Always → to another place; Sometimes → close; Rarely → a little far away'],
      'LEAN s.54: Always–Close, Sometimes–A little far away, Rarely–To another place.'),
    Q('<b>Seiso</b> adımlarının notlardaki sırası hangisidir?',
      ['Temizle → yöntemi belirle → kim temizleyecek → neyi temizleyeceksin → ekipmanı hazırla', '@@Neyi temizleyeceğine karar ver → kimin temizleyeceğine karar ver → yöntemi belirle → ekipmanı hazırla → temizle', 'Ekipmanı hazırla → temizle → neyi → kimi → yöntemi belirle', 'Kim temizleyecek → temizle → neyi → yöntem → ekipman'],
      'LEAN s.55: 1 decide what to clean, 2 decide who, 3 decide the method, 4 prepare the cleaning equipment, 5 clean.'),
    Q('"Kim temizleyecek?" sorusu notlarda hangi araçlarla yanıtlanır? <i>(birden fazla doğru)</i>',
      ['@@Cleaning responsibility map', '@@Cleaning calendar', '@@Bunların görsel olarak asılması', 'Red tag', 'Planned–realized tracking tablosu'],
      'LEAN s.56–57: cleaning responsibility map ve cleaning calendar hazırlanır, görsel olarak asılır. Red tag Seiri aracıdır.'),
    Q('<b>Seiso</b>\'nun amaçları nelerdir? <i>(birden fazla doğru)</i>',
      ['@@Her türlü kir ve pislikten arınmış temiz bir iş yeri', '@@Temizlik sırasında çalışma alanını tanıma fırsatı', 'Stok maliyetini hesaplamak', 'Parçaları ailelere ayırmak'],
      'LEAN s.55: objective 1) clean workplace by getting rid of all dirt; 2) opportunity to familiarise oneself with the work site during cleaning.'),
    Q('<b>Seiketsu</b> (Standardization) için notlardaki üç ilke hangisidir?',
      ['@@Üretim alanında gereksiz malzeme, karmaşa/düzensizlik ve toz/kir istemiyoruz', 'Where? What? How many?', 'Günlük, haftalık 15 dk, haftalık 5 dk', 'Sort, Simplify, Shine'],
      'LEAN s.58: 1 unnecessary material, 2 complexity and disorder, 3 dust and dirt — "we do not want". Yol: sürekli kontrol ve uygunsuzlukları giderme. Üçüncü şık 3 keys, dördüncü Shitsuke kuralıdır.'),
    Q('<b>Shitsuke</b> kapsamındaki disiplin kuralları hangileridir? <i>(birden fazla doğru)</i>',
      ['@@Herkes çalışma alanının düzenini günlük olarak kontrol eder', '@@Bölümler haftada 15 dakikalık ayrıntılı sınıflandırma–düzenleme çalışması yapar', '@@Bölümler haftada 5 dakikalık çapraz 5S değerlendirmesi yapar', 'Bölümler her gün 15 dakikalık çapraz değerlendirme yapar'],
      'LEAN s.61: daily check by everyone; weekly 15-minute detailed classification-organisation exercise; weekly 5-minute cross 5S assessment. 15 dk haftalık, günlük değil.'),
    Q('Shitsuke adımının unsurları arasında hangileri sayılır? <i>(birden fazla doğru)</i>',
      ['@@Çalışanlar için eğitim planı', '@@Denetim sonuçlarının değerlendirilmesi', '@@Her alanın sonuçlarının görsel olarak duyurulması', 'Red tag etiketleme'],
      'LEAN s.60: training plan for employees; results of inspection should be evaluated; results of each area visually announced and published.'),
    Q('Notlardaki <b>5S faydaları</b> arasında hangileri vardır? <i>(birden fazla doğru)</i>',
      ['@@Hareket israfını azaltır', '@@Alan kazandırır', '@@İş sağlığı ve güvenliğini destekler', '@@Arızaları azaltır', 'Stok tutma maliyetini artırır'],
      'LEAN s.62: reduces movement wastes; saves space; promotes OHS; reduces breakdowns; improves image; improves employees\' belonging to the manufacturing system.'),
    Q('s.59\'daki <b>5S Sample Checklist</b> hangi unsurları kapsar?',
      ['Yalnızca temizlik maddeleri', '@@Sort, Set in order, Shine, Standardize, Sustain başlıkları altında kontrol maddeleri; Exist?/Rating/Comments sütunları', 'Sadece red tag kayıtları', 'Makine arıza kodları'],
      'LEAN s.59: her S için kriterler (ör. Set in order: inventory control — kanban cards, FIFO, min & max; Standardize: visual controls, procedures, regular audits; Sustain: success stories, rewards and recognition).'),
  ];

  /* ===================================================================== Cheatsheet */
  IM.content.cheatsheet += `
    <h2>Bölüm 2 · Lean Manufacturing (1) — 2.1–2.5</h2>
    <h3>2.1 Parametreler (LEAN s.2–3)</h3>
    <div class="model">Efficiency = Output / Input
Capacity  = Net working time / Cycle time
Takt time = Net working time / Total demand   (customer requested cycle time)
CSL Type 1 = problemsiz sevk edilen ÜRÜN sayısı / toplam ürün sayısı
CSL Type 2 = problemsiz yapılan SEVKİYAT sayısı / toplam sevkiyat sayısı</div>
    <p class="muted">MLT = hammadde girişi → sevkiyat. Cycle time = iki ardışık çıkış arası. Takt ≠ cycle time. Problemsiz = zaman, miktar, kalite.</p>
    <h3>2.2 İsraf, muda–muri–mura (s.4–15)</h3>
    <table>
      <tr><td><b>Muda</b></td><td>waste (minimumun ötesindeki ekipman, malzeme, parça, alan, işgücü)</td></tr>
      <tr><td><b>Muri</b></td><td>overload (kapasite üstü yük)</td></tr>
      <tr><td><b>Mura</b></td><td>variability (düzensiz plan/miktar, dalgalanma)</td></tr>
      <tr><td><b>7 waste</b></td><td>Overproduction · Waiting · Transportation · Process · Inventory · Motion · Defects</td></tr>
      <tr><td><b>Biggest waste</b></td><td>kullanılmayan insan zekâsı ve yeteneği</td></tr>
    </table>
    <div class="model">h = i + s     (holding cost = yatırım getiri oranı + depo işletme maliyeti oranı)</div>
    <p class="muted">Lean production = israfı yok ederek lead time, maliyet, kalite iyileştirme. House of Lean: çatı Continuous Improvement, taban 5S · Visual Control · Plant Layout, giriş VSM.
    Roadmap: Product family → Current VSM → Future VSM → Spaghetti → Layout planning → 5S (+SMED) → Pull system.</p>
    <h3>2.3 VSM (s.16–25)</h3>
    <div class="model">Günlük talep = 18,400 / 20 = 920
Stok süresi (gün) = stok adedi / günlük talep
Current: LT = 5 + 7.6 + 1.8 + 2.7 + 2 + 4.5 = 23.6 gün ; VA = 1 + 39 + 46 + 62 + 40 = 188 s
Takt = 2 × 27,600 / 920 = 60 s
Future : LT = 1.5 + 1 + 2 = 4.5 gün ; VA = 1 + 168 = 169 s (SMED, C/O &lt; 10 dk, cell layout)</div>
    <p class="muted">VSM adımları: Product family → Current state → Future state → Business plan &amp; implementation. Semboller: push ≠ pull, withdrawal ≠ production kanban, heijunka box (OXOX).</p>
    <h3>2.4 Yerleşim ve hücresel üretim (s.26–44)</h3>
    <ul>
      <li><b>Layout planning:</b> akışı iyileştir, taşıma israfını azalt.</li>
      <li><b>Spaghetti örneği:</b> 65.5 × 40 + 20 × 160 = 2620 + 3200 = 5820 m/ay → × 12 = 69,840 m/yıl ≈ 70 km.</li>
      <li><b>Job shop</b> = fonksiyonel bölümler; <b>cell</b> = part family'ye göre, saved space + kısa akış; U-type layout/assembly cell.</li>
      <li>Yazılımlar: FactoryFLOW, Visufact, Factory Cad, visTABLE, VIP-PLANOPT. Planned–realized tracking: Planned, Realized, Total, +/−, # of defects, comment.</li>
    </ul>
    <h3>2.5 5S (s.45–73)</h3>
    <table>
      <tr><td><b>Seiri</b> (Sort)</td><td>gereksizi ayır/at; red tag; kullanım sıklığına göre yerleştir</td></tr>
      <tr><td><b>Seiton</b> (Simplify)</td><td>her şeyin adı konmuş yeri; 3 keys: where / what / how many; 30 seconds rule</td></tr>
      <tr><td><b>Seiso</b> (Shine)</td><td>5 adım: ne → kim → yöntem → ekipman → temizle; responsibility map + calendar</td></tr>
      <tr><td><b>Seiketsu</b> (Standardize)</td><td>3 ilke: gereksiz malzeme, karmaşa, toz/kir istemiyoruz; sürekli kontrol</td></tr>
      <tr><td><b>Shitsuke</b> (Training &amp; Discipline)</td><td>günlük kontrol; haftalık 15 dk sınıflandırma–düzenleme; haftalık 5 dk çapraz 5S değerlendirmesi</td></tr>
    </table>
    <p class="muted">Sıklık → yer: always → close · sometimes → a little far away · rarely → to another place.
    Faydalar: hareket israfı ↓, alan, OHS, arıza ↓, imaj, aidiyet.</p>
  `;
})();
