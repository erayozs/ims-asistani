/* Bölüm 3 · FMS ve Ekonomik Karşılaştırma — özet, kavram soruları, formül kartı bölümü.
   Düz script (ES module yok); window.IM.content'e ekler.
   Kaynak: "Economic comparison between flexible and traditional manufacturing systems" (Traditional–FMS comparison) s.1–19.
   Görsel olarak okunan slaytlar: s.2 (FMS yerleşimi), s.7–10 (MLT formülü, To bileşenleri, azaltım şeması, makine–iş parçası
   zaman analizi tablosu), s.18–19 (VSEDM grafikleri; yalnızca nitel okuma, sayı uydurulmadı).
   Notlardaki düzeltmeler: s.8 "To = Tm + Tm + Tth" yazım hatası (doğrusu To = Tm + Th + Tth);
   s.10 tablosunda Optimistic sütunu 7 + 95 = 102 (tutarsız, aynen aktarıldı); s.10 son iki satırda "Tml" = MLT (üretim lead time).
   Sayısal MLT örneği notlarda yoktur; "(notlarda yok)" etiketiyle verilmiş, node ile doğrulanmıştır (MLT = 200 min). */
(function () {
  const IM = window.IM;

  /* ------------------------------------------------------------------ 3.1 */
  IM.content.summaries['3.1'] = `
<h2>3.1 Esnek üretim sistemi (FMS) yapısı ve çalışma sistematiği</h2>
<p class="note">Ders notu: Traditional–FMS comparison s.1–4</p>

<p>Dosyanın başlığı: <b>Economic comparison between flexible and traditional manufacturing systems</b>. Aşağıdaki ilk bölüm, karşılaştırmaya konu olan <b>Flexible Manufacturing System (FMS)</b>'in yapısını ve işleyişini anlatır.</p>

<h3>FMS yerleşimi (FMS s.2, görsel şema)</h3>
<ul>
  <li><b>C — Central Computer:</b> sistemi yönetir; <b>LAN (Local Area Network)</b> ile CNC tezgâhlarına bağlıdır; ayrıca malzeme taşıma sistemi, Central Warehouse, WHS ve WUS ile ilişkilidir.</li>
  <li><b>CNC<sub>i</sub>:</b> i numaralı bilgisayarlı sayısal kontrollü tezgâh (CNC<sub>1</sub> … CNC<sub>N</sub>). Her tezgâhın iki depolama alanı vardır:
    <b>FSA<sub>i</sub> — Forward Storage Area i</b> (tezgâha girişteki depolama) ve <b>BSA<sub>i</sub> — Backward Storage Area i</b> (tezgâhtan çıkıştaki depolama).</li>
  <li><b>Material Handling System:</b> iş parçalarını WHS, tezgâh alanları, Central Warehouse ve WUS arasında taşır.</li>
  <li><b>Central Warehouse:</b> merkezi depo (geçici bekletme).</li>
  <li><b>WHS — Workpiece Holding Station:</b> iş parçasının palete bağlandığı istasyon. <b>WUS — Workpiece Unholding Station:</b> iş parçasının paletten çözüldüğü ve sistemden çıktığı istasyon.</li>
</ul>

<h3>Çalışma sistematiği (FMS s.3–4)</h3>
<ol>
  <li>İş parçası <b>WHS</b>'de <b>standart tip palete</b> bağlanır.</li>
  <li><b>Malzeme taşıma sistemi</b> iş parçasını WHS'den alır ve <b>ürünün rotasına (route of the product)</b> göre CNC tezgâhlarına taşır.</li>
  <li>Bir CNC tezgâhı için: taşıma sistemi ürünü <b>forward storage area</b>'ya getirir → iş parçası FSA'dan tezgâha <b>yüklenir</b> (robot kol ile veya manuel) → tezgâh işleyince iş parçası <b>boşaltılır</b> (robot kol ile veya manuel) ve <b>backward storage area</b>'ya bırakılır.</li>
  <li>BSA'dan taşıma sistemi iş parçasını alır ve ürün rotasındaki <b>bir sonraki CNC tezgâhının forward storage area</b>'sına götürür.</li>
  <li>Bir CNC tezgâhının <b>FSA'sı doluysa veya arıza (breakdown)</b> oluşursa iş parçası <b>Central Warehouse'ta geçici olarak</b> depolanır.</li>
  <li>Tüm işlemleri bitince taşıma sistemi iş parçasını <b>WUS</b>'a götürür; orada standart paletten çözülür ve sistemden çıkar.</li>
</ol>
<div class="model">WHS (palete bağla) → Taşıma sistemi → FSA → CNC (yükle · işle · boşalt) → BSA → [sonraki CNC'nin FSA'sı …] → WUS (paletten çöz) → çıkış
FSA dolu / arıza  →  Central Warehouse (geçici depolama)</div>
<p>Yükleme ve boşaltma <b>robot kol ile veya elle</b> yapılabilir (FMS s.3). Rota ürüne göre farklıdır; bu, sistemin esnekliğinin (farklı ürünler, farklı rotalar) temelidir (yorum; notlarda açıkça yazılı değil).</p>

<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
  <li><b>FSA ≠ BSA:</b> FSA tezgâha <b>girişte</b> bekleme/yükleme alanıdır; BSA tezgâhtan <b>çıkışta</b> bırakma alanıdır. Bir parça BSA'dan alınır ve <b>sonraki</b> tezgâhın FSA'sına gider.</li>
  <li><b>WHS ≠ WUS:</b> WHS'de parça palete <b>bağlanır</b> (sisteme giriş), WUS'ta paletten <b>çözülür</b> (sistemden çıkış).</li>
  <li>Central Warehouse <b>geçici</b> depodur: FSA dolu veya tezgâh arızalıysa devreye girer, her parça oraya uğramaz.</li>
  <li>Parça tezgâha doğrudan taşıma sistemiyle <b>girmez</b>: önce FSA'ya getirilir, oradan robot veya elle yüklenir.</li>
  <li>İş parçaları <b>standart tip paletlere</b> bağlanır; her ürüne özel palet yoktur.</li>
  <li>Taşıma <b>ürünün rotasına</b> göre yapılır; tüm parçalar aynı tezgâh sırasını izlemek zorunda değildir.</li>
</ul></div>
`;

  IM.content.concepts['3.1'] = [
    {
      q: 'FMS s.2 şemasında <b>WHS</b> ve <b>WUS</b> kısaltmaları ne anlama gelir?',
      options: [
        'WHS = Workpiece Holding Station, WUS = Workpiece Unholding Station',
        'WHS = Warehouse Holding System, WUS = Warehouse Unloading System',
        'WHS = Work Handling Server, WUS = Work Unit Server',
        'WHS = Workpiece Handling System, WUS = Workpiece Unit System'
      ],
      answer: 0,
      explain: 'FMS s.2: WHS: Workpiece holding station; WUS: Workpiece unholding station.'
    },
    {
      q: 'Çalışma sistematiğine göre iş parçası sisteme girerken ilk nerede ne yapılır?',
      options: [
        'Central Warehouse\'ta sayılır',
        'WHS\'de standart tip palete bağlanır',
        'WUS\'ta palete bağlanır',
        'Doğrudan CNC tezgâhına yüklenir'
      ],
      answer: 1,
      explain: 'FMS s.3: "Workpiece is held to standard type pallet at WHS." WUS çıkıştadır (paletten çözme).'
    },
    {
      q: '<b>FSA</b> ve <b>BSA</b> hakkında hangisi doğrudur?',
      options: [
        'FSA tezgâhtan çıkış depolama alanıdır, BSA girişteki depolama alanıdır',
        'FSA tezgâha giriş (forward), BSA tezgâhtan çıkış (backward) depolama alanıdır',
        'İkisi de Central Warehouse\'un bölümleridir',
        'FSA yalnızca robot kolun alanıdır'
      ],
      answer: 1,
      explain: 'FMS s.2–3: Forward storage area parçayı tezgâha yüklemeden önce bekletir; tezgâhtan boşaltılan parça backward storage area\'ya bırakılır.'
    },
    {
      q: 'Bir CNC tezgâhında iş parçasının izlediği doğru sıra hangisidir?',
      options: [
        'BSA → CNC → FSA',
        'FSA → CNC → BSA',
        'FSA → BSA → CNC',
        'CNC → FSA → BSA'
      ],
      answer: 1,
      explain: 'FMS s.3: taşıma sistemi ürünü FSA\'ya getirir, oradan tezgâha yüklenir, işlendikten sonra boşaltılıp BSA\'ya bırakılır.'
    },
    {
      q: 'Tezgâhta işlem biten iş parçasını BSA\'dan alan taşıma sistemi onu nereye götürür?',
      options: [
        'Her zaman doğrudan WUS\'a',
        'Ürün rotasındaki bir sonraki CNC tezgâhının forward storage area\'sına (tüm işlemler bittiyse WUS\'a)',
        'Aynı tezgâhın FSA\'sına geri',
        'Her zaman Central Warehouse\'a'
      ],
      answer: 1,
      explain: 'FMS s.3–4: BSA\'dan alınan parça rotadaki sonraki tezgâhın FSA\'sına götürülür; tüm işlemler tamamlanınca WUS\'a taşınır.'
    },
    {
      q: 'İş parçası hangi durumlarda <b>Central Warehouse</b>\'ta geçici olarak depolanır? (Birden fazla doğru)',
      options: [
        'Hedef CNC tezgâhının FSA\'sı doluysa',
        'Hedef CNC tezgâhında arıza (breakdown) oluştuysa',
        'Her işlemden önce, istisnasız',
        'Parça WUS\'a ulaştıktan sonra'
      ],
      answer: [0, 1],
      explain: 'FMS s.4: "On the condition that FSA of a CNC machine is full, or a breakdown occurs, workpiece is stored in central warehouse temporarily."'
    },
    {
      q: 'Tüm işlemleri biten iş parçasına ne olur?',
      options: [
        'Central Warehouse\'ta kalır',
        'Taşıma sistemi onu WUS\'a götürür; orada standart paletten çözülür ve sistemden çıkar',
        'WHS\'ye geri döner',
        'FSA\'da paletten çözülür'
      ],
      answer: 1,
      explain: 'FMS s.4: after each process is completed, the material handling system transports the workpiece to WUS; unheld from standard type pallet and exits from the system.'
    },
    {
      q: 'Tezgâhın yükleme/boşaltması notlara göre nasıl yapılır?',
      options: [
        'Yalnızca robot kol ile',
        'Yalnızca manuel',
        'Robot kol ile veya manuel olarak',
        'Yalnızca AGV ile'
      ],
      answer: 2,
      explain: 'FMS s.3: "loaded to the CNC machine (via robot arm or manually)" ve boşaltma da robot kol ile veya manuel yapılır.'
    },
    {
      q: 'FMS yerleşiminde (s.2) hangi bileşenler yer alır? (Birden fazla doğru)',
      options: [
        'Central Computer (C) ve LAN',
        'CNC tezgâhları ve her birinin FSA / BSA alanları',
        'Material Handling System ve Central Warehouse',
        'WHS ve WUS',
        'Kanban panosu ve supermarket'
      ],
      answer: [0, 1, 2, 3],
      explain: 'FMS s.2 şemasında C, LAN, CNC<sub>1</sub>…CNC<sub>N</sub>, FSA<sub>i</sub>, BSA<sub>i</sub>, Material Handling System, Central Warehouse, WHS ve WUS bulunur. Kanban ve supermarket bu şemada yoktur.'
    },
    {
      q: 'Taşıma sistemi iş parçasını WHS\'den aldıktan sonra tezgâhlara hangi bilgiye göre taşır?',
      options: [
        'Rastgele seçilen tezgâha',
        'Ürünün rotasına (route of the product) göre',
        'En kısa kuyruğa göre, notlardaki kural gereği',
        'Palet rengine göre'
      ],
      answer: 1,
      explain: 'FMS s.3: "transports to CNC machines with respect to the route of the product." Kuyruk kuralı notlarda yoktur.'
    },
    {
      q: 'Dosya başlığına (FMS s.1) göre bu slaytlar neyi karşılaştırır?',
      options: [
        'FMS ile Kanban sistemini',
        'Esnek (flexible) ve geleneksel (traditional) üretim sistemlerinin ekonomik karşılaştırmasını',
        'CNC torna ile freze tezgâhını',
        'AGV ile konveyör sistemini'
      ],
      answer: 1,
      explain: 'FMS s.1: "Economic comparison between flexible and traditional manufacturing systems".'
    },
    {
      q: 'LAN (FMS s.2) şemada neyi sağlar?',
      options: [
        'Palet üzerindeki iş parçasını taşımayı',
        'Merkezi bilgisayar (C) ile CNC tezgâhlarının bağlantısını (yerel ağ)',
        'Parçaların paletten çözülmesini',
        'Merkezi deponun enerjisini'
      ],
      answer: 1,
      explain: 'FMS s.2: LAN = Local Area Network; şemada merkezi bilgisayar C ile CNC<sub>1</sub>…CNC<sub>N</sub> arasında bağlantı hattı olarak gösterilir (okuma: görsel).'
    }
  ];

  /* ------------------------------------------------------------------ 3.2 */
  IM.content.summaries['3.2'] = `
<h2>3.2 Doğrudan maliyetler, MLT ve makine–iş parçası zaman analizi</h2>
<p class="note">Ders notu: Traditional–FMS comparison s.5–10</p>

<h3>Doğrudan maliyetler (FMS s.5–6)</h3>
<ul>
  <li><b>Direct labour</b> (doğrudan işçilik) FMS'de <b>azalır</b>.</li>
  <li>Ancak <b>direct labour cost</b> işçilik miktarıyla aynı oranda değişmez, çünkü FMS'de <b>saatlik işçi ücreti daha yüksektir</b>.</li>
  <li><b>İşçi hataları</b> doğrudan maliyetlerle paralel azalır (yeniden işleme — rework ve hurda — scrap).</li>
  <li>Aynı sayıda ürünü üretmek için FMS'de <b>daha az hammadde</b> kullanıldığından <b>direct material cost</b> azalır.</li>
  <li><b>Beklenen doğrudan maliyet azalması: %3 ile %66 arası</b> (slayt: "Between % 3 – 66").</li>
</ul>

<h3>Üretim lead time — MLT (FMS s.7)</h3>
<div class="model">MLT = Σ<sub>i=1</sub><sup>n<sub>m</sub></sup> ( Tsu<sub>i</sub> + Q · To<sub>i</sub> + Tno<sub>i</sub> )

i = operasyon no (i = 1, 2, …, n<sub>m</sub>)      n<sub>m</sub> = operasyon sayısı
To<sub>i</sub>  = i. iş istasyonundaki operating time
Tno<sub>i</sub> = i. iş istasyonundaki non-processing time (process delay, transportation, inspection vb.)
Tsu<sub>i</sub> = setup time        Q = batch size (parti büyüklüğü)</div>
<p><b>Q yalnızca To ile çarpılır</b>; setup (Tsu) ve non-processing (Tno) süreleri parti başına <b>bir kez</b> eklenir.</p>

<h3>Operating time bileşenleri (FMS s.8)</h3>
<div class="model">To = Tm + Th + Tth

Tm  : Processing time (işleme süresi)
Th  : Loading time (yükleme süresi)
Tth : Tool changing time (takım değiştirme süresi)</div>
<p><b>Not:</b> Slayt 8'de formül "To = Tm + Tm + Tth" diye yazılmıştır; bu bir <b>yazım hatasıdır</b> (Tm iki kez yazılmış). Tanım listesine (Th = Loading time) göre doğru ifade <b>To = Tm + Th + Tth</b>'dir.</p>

<h3>FMS'de süreleri azaltan etkenler (FMS s.9, görsel şema)</h3>
<table>
  <tr><th>Terim</th><th>FMS'de nasıl azalır?</th></tr>
  <tr><td><b>Tno</b> (reduced)</td><td>otomatik taşıma sistemiyle <b>daha az taşıma</b>; <b>bilgisayar destekli süreç planlaması</b> ile daha az süreç gecikmesi (process delay)</td></tr>
  <tr><td><b>To</b> (reduced) = Tm + Th + Tth</td><td>aşağıdaki üç terimin azalması</td></tr>
  <tr><td><b>Tm</b> (reduced)</td><td>CAM sistemlerindeki <b>takım yolu optimizasyon (toolpath optimization) modülü</b> ile</td></tr>
  <tr><td><b>Th</b> (reduced)</td><td><b>paletler ve robot kollar</b> ile otomatik yükleme</td></tr>
  <tr><td><b>Tth</b> (reduced)</td><td>CNC tezgâhlarında <b>otomatik takım değiştirme</b> ile</td></tr>
</table>
<p>Takım depolama alanı: <b>CNC torna tezgâhlarında turret</b>, <b>işleme merkezlerinde (machining center) magazine</b>. Şema MLT'nin altında yalnızca Tno ve To kollarını gösterir (Tsu bu şemada ayrı dal olarak yer almaz).</p>

<h3>Makine–iş parçası zaman analizi (FMS s.10, tablo)</h3>
<table>
  <tr><th>Parametre</th><th>Traditional</th><th>FMS Pessimistic</th><th>FMS Probable</th><th>FMS Optimistic</th></tr>
  <tr><td>Machine time without workpiece (Tmw)</td><td>% 50</td><td>% 35</td><td>% 20</td><td>% 5</td></tr>
  <tr><td>Machine time with workpiece (Tmn = 100 − Tmw)</td><td>% 50</td><td>% 65</td><td>% 80</td><td>% 95</td></tr>
  <tr><td>Non-value added time in machine time with workpiece (Th ∪ Tth) / To</td><td>% 70</td><td>% 35</td><td>% 21</td><td>% 7</td></tr>
  <tr><td>Processing time in machine time with workpiece (Tm / To)</td><td>% 30</td><td>% 65</td><td>% 79</td><td>% 95</td></tr>
  <tr><td>Ratio of waiting and transportation times within production lead time (Tno ∪ Tsu) / Tml</td><td>% 95</td><td>% 92.5</td><td>% 90</td><td>% 85</td></tr>
  <tr><td>Ratio of machine time within production lead time To / Tml</td><td>% 5</td><td>% 7.5</td><td>% 10</td><td>% 15</td></tr>
</table>
<p>Okuma: geleneksel sistemde üretim lead time'ının <b>%95'i bekleme ve taşıma</b>, yalnızca <b>%5'i</b> makine (operating) zamanıdır; FMS'de bekleme-taşıma oranı %92.5 / %90 / %85'e düşer, makine zamanı oranı %7.5 / %10 / %15'e çıkar. FMS'de işleme (Tm / To) payı %30'dan %65 / %79 / %95'e yükselir, katma değersiz kısım (Th ∪ Tth) / To ise %70'ten %35 / %21 / %7'ye iner. Slaytlardaki "Tml" ifadesi, bağlamdan <b>MLT</b> (production lead time) olarak okunur.</p>
<p>Sayısal MLT örneği (notlarda yok; formül FMS s.7): n<sub>m</sub> = 2, Q = 10 adet. İstasyon 1: Tsu = 20, To = 6, Tno = 40 min; istasyon 2: Tsu = 10, To = 4, Tno = 30 min.</p>
<div class="model">İstasyon 1: 20 + 10 · 6 + 40 = 120 min
İstasyon 2: 10 + 10 · 4 + 30 =  80 min
MLT = 120 + 80 = 200 min      (To = Tm + Th + Tth ör. 4 + 1 + 1 = 6 min)</div>

<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
  <li>FMS'de direct <b>labour</b> azalır ama direct labour <b>cost</b> aynı oranda azalmaz (saatlik ücret FMS'de daha yüksek). "Labour cost sıfıra iner" yanlıştır.</li>
  <li>Doğrudan maliyet azalması <b>%3–66</b> arası bir <b>beklenen aralıktır</b>, tek bir sabit değer değil.</li>
  <li>MLT'de <b>Q yalnızca To<sub>i</sub> ile çarpılır</b>; Tsu<sub>i</sub> ve Tno<sub>i</sub> parti başına bir kez. Her terimi Q ile çarpmak yaygın hatadır.</li>
  <li><b>To = Tm + Th + Tth</b> (Th = loading time). Slayt 8'deki "Tm + Tm + Tth" yazım hatasıdır. Tm = processing, Th = loading, Tth = tool changing: kısaltmaları karıştırma.</li>
  <li>Tno (non-processing) <b>≠</b> To (operating): Tno taşıma, gecikme, muayene vb. işleme dışı süredir; Tsu setup'tır.</li>
  <li><b>Turret</b> (CNC torna) ≠ <b>magazine</b> (machining center): takım depolama alanları farklıdır.</li>
  <li>Tablo s.10'da Optimistic sütununda 7 + 95 = 102'dir (diğer sütunlarda toplam 100): slayttaki bir tutarsızlıktır, değerler olduğu gibi aktarılmıştır (tutarlı olsaydı Tm / To = 100 − 7 = 93 olurdu). Sınavda slayttaki değeri (95) kullan.</li>
</ul></div>
`;

  IM.content.concepts['3.2'] = [
    {
      q: 'FMS\'de direct labour azalırken <b>direct labour cost</b> neden aynı oranda azalmaz?',
      options: [
        'Çünkü FMS\'de işçi sayısı artar',
        'Çünkü FMS\'de saatlik işçilik ücreti daha yüksektir',
        'Çünkü FMS\'de işçilik hiç azalmaz',
        'Çünkü direct labour cost yalnızca hammaddeye bağlıdır'
      ],
      answer: 1,
      explain: 'FMS s.5: "Direct labour cost does not change in a same way with direct labour. Since hourly labour price is higher in FMS."'
    },
    {
      q: 'FMS\'de <b>direct material cost</b> neden azalır?',
      options: [
        'Aynı sayıda ürün için daha az hammadde kullanıldığı için',
        'Hammadde fiyatları düştüğü için',
        'Üretim miktarı azaldığı için',
        'Taşıma süresi kısaldığı için'
      ],
      answer: 0,
      explain: 'FMS s.6: "Since less raw-material is used to produce same number of products in FMS, direct material costs are decreased."'
    },
    {
      q: 'Notlarda FMS\'de beklenen <b>doğrudan maliyet azalması</b> hangi aralıkla verilir?',
      options: ['%3 – %66', '%30 – %60', '%10 – %20', '%66 – %99'],
      answer: 0,
      explain: 'FMS s.6: "Expected reduce in direct costs between % 3 – 66".'
    },
    {
      q: 'İşçi hatalarının (worker failures) azalması hangi maliyet kalemleriyle ilgilidir?',
      options: [
        'Reworks ve scraps (yeniden işleme ve hurda)',
        'Enerji ve bakım',
        'Taşıma ve depolama',
        'Yatırım maliyeti'
      ],
      answer: 0,
      explain: 'FMS s.6: "Worker failures are decreased in parallel with direct costs (Reworks and scraps)."'
    },
    {
      q: 'FMS s.7\'ye göre üretim lead time <b>MLT</b> için doğru ifade hangisidir?',
      options: [
        'MLT = Σ ( Tsu<sub>i</sub> + Q · To<sub>i</sub> + Tno<sub>i</sub> )',
        'MLT = Σ Q · ( Tsu<sub>i</sub> + To<sub>i</sub> + Tno<sub>i</sub> )',
        'MLT = Σ ( Q · Tsu<sub>i</sub> + To<sub>i</sub> + Tno<sub>i</sub> )',
        'MLT = Σ ( Tsu<sub>i</sub> + To<sub>i</sub> + Q · Tno<sub>i</sub> )'
      ],
      answer: 0,
      explain: 'FMS s.7: MLT = Σ<sub>i=1</sub><sup>n<sub>m</sub></sup> ( Tsu<sub>i</sub> + Q To<sub>i</sub> + Tno<sub>i</sub> ). Batch size Q yalnızca operating time ile çarpılır.',
      hint: 'Setup ve non-processing süreleri parti başına bir kez eklenir.'
    },
    {
      q: 'MLT formülündeki <b>Tno<sub>i</sub></b> neyi temsil eder?',
      options: [
        'Setup süresi',
        'İşleme süresi (processing time)',
        'İş istasyonundaki non-processing time: process delay, transportation, inspection vb.',
        'Takım değiştirme süresi'
      ],
      answer: 2,
      explain: 'FMS s.7: Tno<sub>i</sub> = non-processing time in workstation i (process delay, transportation, inspection etc.). Setup Tsu, takım değiştirme Tth\'dir.'
    },
    {
      q: 'Operating time <b>To</b> için doğru ifade hangisidir? (Slayt 8\'deki yazım hatasını düzelten ifade)',
      options: [
        'To = Tm + Tm + Tth',
        'To = Tm + Th + Tth',
        'To = Tm + Tsu + Tno',
        'To = Th + Tth'
      ],
      answer: 1,
      explain: 'FMS s.8: Tm = processing, Th = loading, Tth = tool changing time. Slayttaki "To = Tm + Tm + Tth" yazım hatasıdır (Tm iki kez yazılmış); doğrusu Tm + Th + Tth.'
    },
    {
      q: 'Aşağıdaki terim–anlam eşleşmelerinden hangisi <b>doğrudur</b>?',
      options: [
        'Tm = loading time, Th = processing time',
        'Tm = processing time, Th = loading time, Tth = tool changing time',
        'Tm = tool changing time, Th = processing time',
        'Th = setup time, Tth = transportation time'
      ],
      answer: 1,
      explain: 'FMS s.8: Tm: Processing time; Th: Loading time; Tth: Tool changing time.'
    },
    {
      q: 'FMS s.9 şemasına göre <b>Th</b> (loading time) hangi etkenle azalır?',
      options: [
        'CAM sistemlerindeki toolpath optimization modülü',
        'Paletler ve robot kollarla otomatik yükleme',
        'CNC tezgâhında otomatik takım değiştirme',
        'Bilgisayar destekli süreç planlaması'
      ],
      answer: 1,
      explain: 'FMS s.9: Th (reduced) via automatic loading with pallets and robot arms. Tm → toolpath optimization (CAM); Tth → otomatik takım değiştirme; Tno → otomatik taşıma + bilgisayar destekli süreç planlaması.'
    },
    {
      q: 'FMS s.9\'a göre <b>Tno</b> (non-processing time) hangi etkenlerle azalır? (Birden fazla doğru)',
      options: [
        'Otomatik taşıma sistemiyle daha az taşıma',
        'Bilgisayar destekli süreç planlamasıyla daha az süreç gecikmesi',
        'CAM toolpath optimizasyonu',
        'Otomatik takım değiştirme'
      ],
      answer: [0, 1],
      explain: 'FMS s.9: Tno (reduced): less transportation with automatic handling system; less process delays with computer aided process planning. Toolpath optimizasyonu Tm\'yi, otomatik takım değiştirme Tth\'yı azaltır.'
    },
    {
      q: 'Takım depolama alanı <b>CNC torna tezgâhlarında</b> ve <b>işleme merkezlerinde</b> sırasıyla nedir?',
      options: [
        'Magazine; turret',
        'Turret; magazine',
        'Turret; turret',
        'Pallet; magazine'
      ],
      answer: 1,
      explain: 'FMS s.9: Tool storage area in CNC lathes: turrets; in machining centers: magazines.'
    },
    {
      q: 'FMS s.10 tablosuna göre <b>Probable</b> FMS performansında <b>Machine time without workpiece (Tmw)</b> yüzde kaçtır?',
      options: ['%50', '%35', '%20', '%5'],
      answer: 2,
      explain: 'FMS s.10: Tmw = Traditional %50; FMS Pessimistic %35, Probable %20, Optimistic %5 (Tmn = 100 − Tmw).'
    },
    {
      q: 'FMS s.10 tablosuna göre <b>geleneksel</b> sistemde production lead time içinde makine (operating) zamanının payı (To / Tml) ve bekleme-taşıma payı kaçtır?',
      options: [
        'To / Tml = %5; (Tno ∪ Tsu) / Tml = %95',
        'To / Tml = %50; (Tno ∪ Tsu) / Tml = %50',
        'To / Tml = %95; (Tno ∪ Tsu) / Tml = %5',
        'To / Tml = %15; (Tno ∪ Tsu) / Tml = %85'
      ],
      answer: 0,
      explain: 'FMS s.10: Traditional sütununda (Tno ∪ Tsu) / Tml = %95 ve To / Tml = %5; toplam %100. %15 / %85 Optimistic FMS değerleridir.'
    },
    {
      q: 'Sayısal kontrol (notlarda yok; formül FMS s.7): n<sub>m</sub> = 2, Q = 10; istasyon 1: Tsu = 20, To = 6, Tno = 40 min; istasyon 2: Tsu = 10, To = 4, Tno = 30 min. <b>MLT</b> kaç dakikadır?',
      options: ['110 min', '130 min', '200 min', '1100 min'],
      answer: 2,
      explain: 'MLT = (20 + 10 · 6 + 40) + (10 + 10 · 4 + 30) = 120 + 80 = 200 min. 110: Q ile çarpmadan toplama; 130: Tno unutulmuş; 1100: tüm toplam Q ile çarpılmış.'
    }
  ];

  /* ------------------------------------------------------------------ 3.3 */
  IM.content.summaries['3.3'] = `
<h2>3.3 Dolaylı maliyetler, belirsizlik ve duyarlılık (Yo, TIMO)</h2>
<p class="note">Ders notu: Traditional–FMS comparison s.11–19</p>

<h3>Stok, makine kullanımı ve ödeme kolaylığı (FMS s.11)</h3>
<ul>
  <li><b>Stoktaki azalma</b>, production lead time'daki azalmayla <b>pozitif ilişkilidir</b>.</li>
  <li>FMS'de <b>makine kullanım oranı (machine utilization rate) artar</b>.</li>
  <li>Daha yüksek kullanım oranları, ürün sermayesi için <b>ödeme maliyeti kolaylığı (payment cost convenience)</b> sağlar. Bu kolaylık şunlarla ilişkilidir: <b>sistem performansı, FMS yatırımı, yatırımın ömrü, maliyet dağıtım yöntemi</b> (cost allocation method).</li>
</ul>

<h3>Yatırım ve işletme maliyeti (FMS s.12)</h3>
<div class="model">FMS                       → yüksek yatırım (high investment), düşük işletme maliyeti (low operating cost)
Conventional (geleneksel) → düşük yatırım (low investment), yüksek işletme maliyeti (high operating cost)</div>
<p><b>Dolaylı işletme maliyetleri (indirect operating cost):</b> bakım maliyeti (maintenance), enerji maliyeti (energy), dolaylı işçilik maliyeti (indirect labour).</p>

<h3>Bakım, enerji ve dolaylı işçilik (FMS s.13–15)</h3>
<table>
  <tr><th>Kalem</th><th>FMS'de sonuç</th></tr>
  <tr><td><b>Maintenance</b> (s.13)</td><td>CNC tezgâhlarında kullanım oranı daha yüksek → FMS'de <b>preventive maintenance</b> maliyeti <b>yüksek</b>; <b>corrective maintenance</b> maliyeti <b>düşük</b></td></tr>
  <tr><td><b>Energy</b> (s.14)</td><td>FMS verimli ama <b>daha fazla enerji</b> kullanır. <b>Adaptive control</b> teknolojileri → FMS'de verimli enerji kullanımı; <b>otomatik malzeme taşıma sistemi ve merkezi bilgisayar</b> → FMS'de daha fazla enerji kullanımı</td></tr>
  <tr><td><b>Indirect labour</b> (s.15)</td><td><b>CAD-CAM entegrasyonu</b> → bilgi yönetimi ve iletişim için <b>daha az personel</b> ihtiyacı → FMS'de dolaylı işçilik kazancı</td></tr>
</table>

<h3>Belirsizlik ve duyarlılık analizi (FMS s.16)</h3>
<ul>
  <li><b>Uncertain parameters (belirsiz parametreler): economic life (ekonomik ömür) ve total operating cost.</b></li>
  <li><b>Sensitivity analysis:</b> belirsiz parametrelerdeki değişimler bir ekonomik verimlilik parametresini nasıl etkiler?</li>
</ul>

<h3>Tanımlar (FMS s.17)</h3>
<div class="model">Yo    = FMS yatırımı / geleneksel sistem yatırımı       (investment ratio)
TIMO  = FMS işletme maliyeti / geleneksel sistem işletme maliyeti
VSEDM = vergi sonrası eşdeğer düzgün maliyet (equivalent uniform cost after tax)
N     = ekonomik ömür (economic life)</div>
<p>Slayt 18 ve 19'un alt yazılarında kısaltma "VSDEM" diye yazılmıştır; slayt 17'deki <b>VSEDM</b> ile aynı şeydir (yazım farkı). Slaytta TIMO değerleri kesir olarak yazılır; ondalık karşılıkları: <b>0.75, 0.67, 0.50, 0.33, 0.25</b>. TIMO &lt; 1 → FMS'in işletme maliyeti geleneksel sistemden düşük; Yo = 2 → FMS yatırımı geleneksel sistemin iki katı.</p>

<h3>Grafik 1 — VSEDM, ekonomik ömrün (N) fonksiyonu (FMS s.18, görsel)</h3>
<p>Parametreler: <b>Yo = 2, TIMO = 0.33, i = %10</b>. Yatay eksen N (3, 4, 5, 6, 8, 10, 12, 14, 15), dikey eksen VSEDM. İki eğri (FMS ve Traditional system) de N arttıkça <b>azalır</b>. <b>Kısa ekonomik ömürde</b> (N küçük) FMS eğrisi geleneksel eğrinin <b>üstündedir</b> (FMS daha pahalı); eğriler <b>N ≈ 3–5 arasında kesişir</b> (kesin değer grafikten okunamaz); <b>kesişimden sonra FMS'in VSEDM'si geleneksel sistemden düşüktür</b> ve fark N büyüdükçe açılır (geleneksel eğri yatay seyre yaklaşırken FMS eğrisi daha aşağıya iner). Sonuç: <b>FMS'in ekonomik üstünlüğü yeterince uzun ekonomik ömür gerektirir</b>.</p>

<h3>Grafik 2 — VSEDM, Yo ve TIMO'nun fonksiyonu (FMS s.19, görsel)</h3>
<p>Parametreler: <b>i = %10, N = 10</b>. Yatay eksen Yo (1.5, 2, 3), her biri için dikey kesikli çizgi; FMS için beş eğri: <b>TIMO = 0.75, 0.67, 0.50, 0.33, 0.25</b>; ayrıca "Traditional system" etiketli eğri. Okunabilen nitel sonuçlar:</p>
<ul>
  <li><b>TIMO küçüldükçe FMS eğrisi aşağı kayar</b> (VSEDM azalır): en alttaki eğri TIMO = 0.25, en üsttekiler TIMO = 0.75 ve 0.67.</li>
  <li>Çizilen aralıkta eğrilerin hepsi Yo arttıkça aşağı doğru ilerler; TIMO = 0.75 ve 0.67 eğrileri "Traditional system" eğrisiyle <b>kesişir</b>, TIMO = 0.50, 0.33 ve 0.25 eğrileri ise bu eğrinin <b>altında</b> kalır.</li>
  <li>Kesişim noktalarının tam Yo değerleri ve VSEDM'nin sayısal değerleri grafikten güvenle okunamaz; bu yüzden burada yazılmamıştır.</li>
</ul>

<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
  <li><b>FMS = yüksek yatırım + düşük işletme maliyeti</b>; geleneksel sistem = düşük yatırım + yüksek işletme maliyeti. Tersini yazma.</li>
  <li>Bakımda <b>preventive ↑ (FMS'de yüksek), corrective ↓ (FMS'de düşük)</b>; ikisi de düşer/yükselir demek yanlıştır.</li>
  <li>Enerji: FMS "verimli ama daha fazla enerji kullanır"; <b>adaptive control</b> verimliliği artırır, <b>otomatik taşıma + merkezi bilgisayar</b> kullanımı artırır.</li>
  <li><b>Yo</b> = <b>yatırım</b> oranı (FMS / geleneksel); <b>TIMO</b> = <b>işletme maliyeti</b> oranı (FMS / geleneksel). İkisini karıştırma; TIMO = 0.33, FMS işletme maliyetinin geleneksel sistemin yaklaşık 0.33 katı olduğunu gösterir.</li>
  <li>Belirsiz parametreler yalnızca <b>economic life</b> ve <b>total operating cost</b>'tur. VSEDM = vergi sonrası eşdeğer düzgün maliyet; N = ekonomik ömür.</li>
  <li>Grafik 1'de FMS, kısa ekonomik ömürde üstün <b>değildir</b>; üstünlük N yeterince büyüyünce başlar. Grafik 2'de TIMO ne kadar küçükse FMS o kadar avantajlıdır.</li>
  <li>Slaytlardaki "VSDEM" = "VSEDM" (yazım farkı); grafiklerden kesin sayı okuma.</li>
</ul></div>
`;

  IM.content.concepts['3.3'] = [
    {
      q: 'Notlara göre FMS ile geleneksel (conventional) üretim sistemi yatırım ve işletme maliyeti açısından nasıl karşılaştırılır?',
      options: [
        'FMS: düşük yatırım, yüksek işletme maliyeti; geleneksel: yüksek yatırım, düşük işletme maliyeti',
        'FMS: yüksek yatırım, düşük işletme maliyeti; geleneksel: düşük yatırım, yüksek işletme maliyeti',
        'İkisinde de yatırım yüksek, işletme maliyeti düşük',
        'İkisinde de yatırım düşük, işletme maliyeti yüksek'
      ],
      answer: 1,
      explain: 'FMS s.12: FMS → high investment, low operating cost; Conventional manufacturing system → low investment, high operating cost.',
      hint: 'FMS pahalı kurulur, ucuz işletilir.'
    },
    {
      q: 'FMS s.12\'ye göre <b>dolaylı işletme maliyeti (indirect operating cost)</b> kalemleri hangileridir? (Birden fazla doğru)',
      options: [
        'Maintenance cost',
        'Energy cost',
        'Indirect labour cost',
        'Direct material cost',
        'Scrap cost'
      ],
      answer: [0, 1, 2],
      explain: 'FMS s.12: Indirect operating cost = maintenance, energy, indirect labour. Direct material ve rework/scrap doğrudan maliyet bölümündedir (s.5–6).'
    },
    {
      q: 'FMS\'de bakım maliyetleri için hangisi doğrudur?',
      options: [
        'Preventive maintenance maliyeti düşük, corrective maintenance maliyeti yüksek',
        'Preventive maintenance maliyeti yüksek, corrective maintenance maliyeti düşük',
        'İkisi de düşük',
        'İkisi de yüksek'
      ],
      answer: 1,
      explain: 'FMS s.13: CNC tezgâhlarının kullanım oranı yüksek olduğundan FMS\'de preventive maintenance maliyeti daha yüksek, corrective maintenance maliyeti daha düşüktür.'
    },
    {
      q: 'FMS\'de enerji kullanımı konusunda hangi ifadeler notlara <b>uygundur</b>? (Birden fazla doğru)',
      options: [
        'Adaptive control teknolojileri FMS\'de verimli enerji kullanımı sağlar',
        'Otomatik malzeme taşıma sistemi ve merkezi bilgisayar FMS\'de daha fazla enerji kullanımına yol açar',
        'FMS geleneksel sistemden mutlaka daha az enerji kullanır',
        'Adaptive control enerji kullanımını artıran teknolojidir'
      ],
      answer: [0, 1],
      explain: 'FMS s.14: "Efficient but more energy usage in FMS"; adaptive control → efficient energy usage; automatic material handling system and central computer → more energy usage. FMS\'in her zaman daha az enerji kullandığı söylenmez.'
    },
    {
      q: 'FMS\'de <b>indirect labour cost</b> kazancı nereden gelir?',
      options: [
        'Hammaddenin ucuzlamasından',
        'CAD-CAM entegrasyonu sayesinde bilgi yönetimi ve iletişim için daha az personel gerekmesinden',
        'Preventive bakımın azalmasından',
        'Saatlik ücretin düşmesinden'
      ],
      answer: 1,
      explain: 'FMS s.15: CAD-CAM integration → less personnel requirement for information management and communication → achievement in indirect labour cost in FMS.'
    },
    {
      q: 'FMS s.11\'e göre ödeme maliyeti kolaylığı (payment cost convenience) hangi etkenlerle ilişkilidir? (Birden fazla doğru)',
      options: [
        'Sistem performansı',
        'FMS yatırımı',
        'Yatırımın ömrü',
        'Maliyet dağıtım yöntemi (cost allocation method)',
        'Operatör sayısının tek başına'
      ],
      answer: [0, 1, 2, 3],
      explain: 'FMS s.11: payment cost convenience is related with system performance, FMS investment, life of investment, cost allocation method.'
    },
    {
      q: 'Notlara göre stok azalması ile production lead time arasındaki ilişki nedir?',
      options: [
        'Stoktaki azalma lead time\'daki azalmayla pozitif ilişkilidir',
        'Stok azalması lead time\'ı artırır',
        'Aralarında ilişki yoktur',
        'Lead time yalnızca setup süresine bağlıdır'
      ],
      answer: 0,
      explain: 'FMS s.11: "Decrease in inventory is positively related with decrease in production lead time." FMS\'de ayrıca makine kullanım oranı artar.'
    },
    {
      q: 'FMS s.16\'ya göre ekonomik karşılaştırmada <b>belirsiz (uncertain) parametreler</b> hangileridir?',
      options: [
        'Economic life ve total operating cost',
        'Yo ve TIMO ile ilgisiz her şey',
        'Direct labour ve direct material',
        'Investment ve interest rate'
      ],
      answer: 0,
      explain: 'FMS s.16: Uncertain parameters: economic life and total operating cost. (Sensitivity analysis bu parametrelerin değişiminin sonucu nasıl etkilediğine bakar.)'
    },
    {
      q: '<b>Sensitivity analysis</b> (duyarlılık analizi) notlarda nasıl tanımlanır?',
      options: [
        'Belirsiz parametrelerdeki değişimlerin bir ekonomik verimlilik parametresini nasıl etkilediğinin incelenmesi',
        'Parçaların işlenme süresinin ölçülmesi',
        'İşçi sayısının azaltılması',
        'CNC tezgâhının hassasiyetinin ölçülmesi'
      ],
      answer: 0,
      explain: 'FMS s.16: "How do changes in an uncertain parameters affect an economic efficiency parameter?"'
    },
    {
      q: 'Tanımlara göre <b>Yo</b> ve <b>TIMO</b> hangi oranlardır?',
      options: [
        'Yo = FMS işletme maliyeti / geleneksel işletme maliyeti; TIMO = FMS yatırımı / geleneksel yatırım',
        'Yo = FMS yatırımı / geleneksel sistem yatırımı; TIMO = FMS işletme maliyeti / geleneksel sistem işletme maliyeti',
        'Yo = ekonomik ömür; TIMO = vergi sonrası maliyet',
        'Yo = geleneksel yatırım / FMS yatırımı; TIMO = geleneksel işletme maliyeti / FMS işletme maliyeti'
      ],
      answer: 1,
      explain: 'FMS s.17: Yo: ratio between investment for FMS and investment for traditional system; TIMO: ratio between operating cost for FMS and operating cost for traditional system. Pay FMS, payda geleneksel.',
      hint: 'Yo yatırım (investment), TIMO işletme (operating) ile ilgili.'
    },
    {
      q: 'FMS işletme maliyeti geleneksel sistemin işletme maliyetinin üçte biri ise TIMO\'nun ondalık değeri nedir? (FMS s.17–19)',
      options: ['0.25', '0.33', '0.50', '3.00'],
      answer: 1,
      explain: 'TIMO = FMS işletme maliyeti / geleneksel işletme maliyeti = 1 / 3 ≈ 0.33 (slayt 18\'de TIMO = 0.33 kullanılır). TIMO &lt; 1 → FMS işletmesi daha ucuz.'
    },
    {
      q: '<b>VSEDM</b> ve <b>N</b> neyi ifade eder?',
      options: [
        'VSEDM = vergi sonrası eşdeğer düzgün maliyet (equivalent uniform cost after tax); N = ekonomik ömür',
        'VSEDM = yatırım oranı; N = işçi sayısı',
        'VSEDM = vergi öncesi toplam gelir; N = parti büyüklüğü',
        'VSEDM = işletme maliyeti oranı; N = faiz oranı'
      ],
      answer: 0,
      explain: 'FMS s.17: VSEDM: Equivalent uniform cost after tax; N: Economic life.'
    },
    {
      q: 'FMS s.18 grafiğinde (Yo = 2, TIMO = 0.33, i = %10; VSEDM, ekonomik ömür N\'nin fonksiyonu) nitel olarak ne görülür?',
      options: [
        'FMS her N değerinde geleneksel sistemden daha pahalıdır',
        'Kısa ekonomik ömürde FMS daha pahalıdır; N yeterince büyüyünce (yaklaşık 3–5 arasındaki kesişimden sonra) FMS\'in VSEDM\'si geleneksel sistemden düşük olur',
        'Geleneksel sistem N arttıkça sürekli artar',
        'İki eğri hiç kesişmez'
      ],
      answer: 1,
      explain: 'FMS s.18 (görsel): iki eğri de N ile azalır; FMS eğrisi küçük N\'de üstte, kesişimden sonra altta kalır. Kesişimin tam N değeri grafikten kesin okunamaz.'
    },
    {
      q: 'FMS s.19 grafiğinde (i = %10, N = 10; VSEDM, Yo ve TIMO\'nun fonksiyonu) TIMO\'nun etkisi nasıl okunur?',
      options: [
        'TIMO küçüldükçe FMS eğrisi aşağı kayar (VSEDM azalır); en alttaki eğri TIMO = 0.25\'tir',
        'TIMO küçüldükçe FMS eğrisi yukarı çıkar',
        'TIMO eğrileri üst üste biner',
        'Yalnızca TIMO = 0.75 çizilmiştir'
      ],
      answer: 0,
      explain: 'FMS s.19 (görsel): TIMO = 0.75 en üstte, 0.67, 0.50, 0.33 ve 0.25 sırasıyla aşağıda; daha ucuz işletme (küçük TIMO) = daha düşük VSEDM.'
    }
  ];

  /* ------------------------------------------------------------------ cheatsheet */
  IM.content.cheatsheet += `
    <h2>Bölüm 3 · FMS ve Ekonomik Karşılaştırma</h2>
    <div class="model">MLT = Σ<sub>i=1</sub><sup>n<sub>m</sub></sup> ( Tsu<sub>i</sub> + Q · To<sub>i</sub> + Tno<sub>i</sub> )     (Q yalnızca To ile çarpılır)
To  = Tm + Th + Tth        (Tm işleme · Th yükleme · Tth takım değiştirme; slayt 8'de "Tm + Tm + Tth" yazım hatası)
Yo   = FMS yatırımı / geleneksel yatırım
TIMO = FMS işletme maliyeti / geleneksel işletme maliyeti      (0.75 · 0.67 · 0.50 · 0.33 · 0.25)
VSEDM = vergi sonrası eşdeğer düzgün maliyet · N = ekonomik ömür</div>
    <table>
      <tr><th>Parametre (%)</th><th>Trad.</th><th>FMS Pess.</th><th>FMS Prob.</th><th>FMS Opt.</th></tr>
      <tr><td>Tmw (boş makine zamanı)</td><td>50</td><td>35</td><td>20</td><td>5</td></tr>
      <tr><td>(Th ∪ Tth) / To</td><td>70</td><td>35</td><td>21</td><td>7</td></tr>
      <tr><td>Tm / To</td><td>30</td><td>65</td><td>79</td><td>95</td></tr>
      <tr><td>(Tno ∪ Tsu) / Tml</td><td>95</td><td>92.5</td><td>90</td><td>85</td></tr>
      <tr><td>To / Tml</td><td>5</td><td>7.5</td><td>10</td><td>15</td></tr>
    </table>
    <ul>
      <li><b>FMS yapısı:</b> C + LAN, CNC<sub>i</sub> (FSA<sub>i</sub> giriş, BSA<sub>i</sub> çıkış), Material Handling System, Central Warehouse (FSA dolu / arıza → geçici depo), WHS (palete bağla), WUS (paletten çöz).</li>
      <li><b>Doğrudan maliyet:</b> işçilik azalır (ücret yüksek → maliyet aynı oranda azalmaz), hata (rework, scrap) ve hammadde azalır; beklenen azalma %3–66.</li>
      <li><b>Azaltım eşlemesi:</b> Tno ← otomatik taşıma + CAPP · Tm ← CAM toolpath optimizasyonu · Th ← palet + robot kol · Tth ← otomatik takım değiştirme (CNC torna: turret; işleme merkezi: magazine).</li>
      <li><b>FMS:</b> yüksek yatırım + düşük işletme maliyeti. Dolaylı maliyet: bakım (preventive ↑, corrective ↓), enerji (verimli ama daha çok kullanım; adaptive control ↓), dolaylı işçilik (CAD-CAM ile ↓).</li>
      <li><b>Belirsiz parametreler:</b> economic life ve total operating cost → sensitivity analysis. Grafik: N kısa → FMS pahalı, N uzun → FMS ucuz; TIMO küçüldükçe VSEDM eğrisi aşağı.</li>
    </ul>
  `;
})();
