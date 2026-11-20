/* Bölüm 4 · AGV — özet, kavram soruları, formül kartı.
   Kaynak: automated guided vehicles.ppt (AGV s.1–29). Sayılar node ile doğrulandı:
   AGV sayısı: 98 + 176 + 60 + 96 = 430 · 430 / 0.85 = 505.88 · 505.88 / 60 = 8.43 → ⌈⌉ = 9.
   Simülasyon (s.27–29): TrT = (segment sayısı − 1) × 2; yüklü Comp = STT + L/UL + TrT; boş Comp = STT + TrT. */
(function () {
  const IM = window.IM;

  /* ===================== 4.1 AGV tanımı, kapasite, avantajlar, türler ===================== */
  IM.content.summaries['4.1'] = `<h2>4.1 AGV tanımı, kapasite, avantajlar ve türler</h2>
<p class="note">Ders notu: AGV s.1–9</p>
<h3>Tanım (AGV s.2)</h3>
<p><b>Automated Guided Vehicle (AGV)</b>: bilgisayar kontrollü bir araçtır; önceden programlanmış talimatlara göre ya da gelişmiş bir bilgisayarın koordinasyonuyla bir <b>guide path</b> (kılavuz yol) izler.
Bilgisayar kontrolü malzeme taşıma işlerine de genişletilmiştir: istasyondaki bir sistem operatörü araçları önceden belirlenmiş yollarda hareket ettirip belirli görevleri yaptırabilir.
Böyle bir düzene <b>AGV sistemi</b> denir.</p>
<h3>Neden AGV? (AGV s.3)</h3>
<ul>
<li>Bazı malzeme taşıma durumlarında giderek <b>ekonomik</b> hâle gelmektedir.</li>
<li>İstasyonlar arasında parça/malzemenin <b>rastgele ve bağımsız</b> hareketine izin verir.</li>
<li>Değişikliklere verimli tepki verir: normal makine meşgulse ya da arızalıysa, işi başka bir makine yapabilir ve/veya malzeme <b>alternatif bir yoldan</b> başka bir noktaya teslim edilebilir.</li>
</ul>
<h3>Kapasite (AGV s.4)</h3>
<ul>
<li>Bugün <b>10 tona</b> kadar yük taşıyan AGV sistemleri yaygın olarak bulunur.</li>
<li>Araç ile zemin arasında yaklaşık <b>0.003 inç</b> kalınlığında çok ince bir hava filmi üzerinde süzülen yeni geliştirilmiş bir sistem <b>35 tona</b> kadar yük taşıyabilir.</li>
<li>Sürtünmesiz tasarım, yüklerin pürüzlü zeminlerde hareketine izin verir; aksi hâlde bu kadar ağır yükler için gerekecek <b>vinç ve köprü yapılarını</b> ortadan kaldırabilir.</li>
</ul>
<h3>8 avantaj (AGV s.5–6)</h3>
<ol>
<li><b>Material control</b>: malzeme belirlenmiş noktalar arasında taşındığı için kullanım ve transferin daha doğru kaydı → büyük güvenlik stokuna ihtiyaç azalır.</li>
<li><b>More efficient use of personnel</b>: forklift operatörlerine gerek kalmaz; taşıma personeli ve aralarındaki koordinasyon azalır.</li>
<li><b>Efficient work environment</b>: her istasyonun yüklemesi/boşaltması diğerlerinden bağımsızdır; her operatör kendi hızında çalışır, konveyör hızına bağlı kalmaz. Çoğu AGV'nin hareketli platformu işi istenen yükseklikte teslim eder.</li>
<li><b>Flexibility</b>: rotalar sabit yataklı konveyörlere göre çok daha kolay değiştirilir ve yenileri eklenir.</li>
<li><b>Better use of floor space</b>: gömülü kılavuz hatlar, zemine sabitlenmiş konveyörler gibi zemini kalıcı olarak işgal etmez.</li>
<li><b>Adaptability to automation</b>: robotlar, otomatik depolama-geri alma sistemleri, konveyörler, asansörler, kapılar ve otomatik üretim makineleriyle verimli çalışır.</li>
<li><b>Integration within plant</b>: tesisteki farklı otomasyon hücreleri arasında bağ kurarak genel operasyonu bütünleştirir.</li>
<li><b>Adaptability to existing facilities</b>: mevcut tesise en az yapısal değişiklikle kurulur; kılavuz yollar için zeminde yuvalar yeterlidir (vinç için ağır taşıyıcı yapı, konveyör için kapsamlı zemin/yapı değişikliği gerekir).</li>
</ol>
<h3>AGV türleri (AGV s.7–9)</h3>
<table>
<tr><th>Tür</th><th>Özellik (notlara göre)</th></tr>
<tr><td><b>AGV towing vehicles</b></td><td>En eski tür; kapasite <b>500 kg – 22.5 ton</b>; esas olarak depo alanlarına giren/çıkan dökme (bulk) malzeme taşımada</td></tr>
<tr><td><b>AGV unit load vehicles</b></td><td>Birim yük taşıyan <b>güverteli (deck)</b> araçlar; genelde konveyör ve otomatik depolama-geri alma sistemleriyle bütünleşir → depoya/dağıtım sistemine giriş-çıkış tamamen otomatik</td></tr>
<tr><td><b>AGV fork trucks</b></td><td>Forklift gibi çalışır; yükü zeminden ayakta duruş yüksekliğine kadar farklı yüksekliklerde otomatik alır/bırakır; <b>transfer yüksekliği istasyondan istasyona değiştiğinde</b> özellikle yararlı</td></tr>
<tr><td><b>Light load AGVs</b></td><td><b>250 kg</b>'a kadar hafif yük; hafif ve kompakt, dar alanlarda manevra yapar; çoğunlukla hafif imalatta</td></tr>
<tr><td><b>AGV assembly line vehicles</b></td><td>Light-load AGV'nin modifikasyonu; motor, şanzıman gibi ana alt montajları istasyondan istasyona taşır, her istasyonda parça eklenerek tam montaj tamamlanır</td></tr>
</table>
<div class="model">AGV sistemi = bilgisayar kontrollü araç + guide path + önceden programlanmış talimat / koordinasyon
Tür seçimi:  bulk (500 kg – 22.5 t) → towing · deck + konveyör → unit load · değişken yükseklik → fork truck
             ≤ 250 kg → light load · alt montaj taşıyıp parça eklenen hat → assembly line vehicle</div>
<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
<li>10 ton (klasik AGV) ile 35 ton (hava filmi üzerinde süzülen sistem) karıştırılmaz; 35 ton için sürtünmesiz tasarım ve 0.003 inç film gerekir.</li>
<li>Towing = en eski tür (500 kg – 22.5 ton); light load = en çok 250 kg. Assembly line vehicle, light-load AGV'nin <i>değiştirilmiş</i> hâlidir.</li>
<li>AGV'nin üstünlüğü konveyöre kıyasla: esneklik (rota değişimi kolay), zemin kullanımı (gömülü hat) ve operatörün kendi hızıyla çalışması. "Konveyör hızına bağlı çalışma" bir avantaj değil, konveyörün sınırlamasıdır.</li>
</ul></div>`;

  IM.content.concepts['4.1'] = [
    { q: `AGV (Automated Guided Vehicle) sistemi notlara göre en iyi hangisidir?`,
      options: [`Operatörün elle sürdüğü, rotası serbest forklift filosu`, `Bilgisayar kontrollü, önceden programlanmış talimatlara ya da gelişmiş bir bilgisayarın koordinasyonuna göre bir guide path izleyen araç (sistem)`, `Yalnızca sabit yataklı konveyörlerden oluşan taşıma hattı`, `Sadece robot kolu ile makine besleyen hücre`],
      answer: 1, explain: `AGV s.2: AGV, önceden programlanmış talimatlara ya da gelişmiş bilgisayar koordinasyonuna göre bir kılavuz yolu izleyen bilgisayar kontrollü araçtır.` },
    { q: `AGV'lerin malzeme taşımadaki özellikleri olarak notlarda geçenler hangileridir? (birden fazla)`,
      options: [`İstasyonlar arasında parça/malzemenin rastgele ve bağımsız hareketine izin verir`, `Makine meşgul ya da arızalıyken işi başka makineye, malzemeyi alternatif yoldan başka noktaya yönlendirmeye elverişlidir`, `Yalnızca tek bir sabit rotada, sabit sırayla çalışabilir`, `Bazı taşıma durumlarında ekonomik hâle gelmektedir`],
      answer: [0, 1, 3], explain: `AGV s.3: rastgele ve bağımsız hareket, makine meşgul/arızalıyken alternatif makine ve alternatif yol, ve giderek ekonomik olma. Tek sabit rota konveyörlerin özelliğidir.` },
    { q: `Bugün yaygın olarak bulunan klasik AGV sistemlerinin yük kapasitesi ve hava filmi üzerinde süzülen yeni sistemin kapasitesi sırasıyla nedir?`,
      options: [`10 ton ve 35 ton`, `22.5 ton ve 35 ton`, `250 kg ve 10 ton`, `35 ton ve 10 ton`],
      answer: 0, explain: `AGV s.4: 10 tona kadar sistemler yaygındır; yaklaşık 0.003 inçlik hava filmi üzerinde süzülen sistem 35 tona kadar taşır. (22.5 ton towing araçların üst sınırı, 250 kg light load sınırıdır.)` },
    { q: `Hava filmi üzerinde süzülen (sürtünmesiz) AGV tasarımının notlarda belirtilen sonucu hangisidir?`,
      options: [`Yüklerin pürüzlü zeminlerde taşınabilmesi ve aksi hâlde gerekecek vinç ve köprü yapılarının ortadan kalkabilmesi`, `Kılavuz kablonun zeminden tamamen kaldırılması ve bataryaya gerek kalmaması`, `Taşıma hızının 60 – 80 m/dk'dan yüzlerce m/dk'ya çıkması`, `Yalnızca 250 kg'a kadar yüklerin taşınabilmesi`],
      answer: 0, explain: `AGV s.4: sürtünmesiz tasarım yüklerin pürüzlü zeminde hareketine izin verir ve ağır yükler için gerekecek vinç/köprü yapılarını gereksiz kılabilir. Diğer seçenekler notlarda yok.` },
    { q: `"Material control" avantajı notlara göre neyi sağlar?`,
      options: [`Forklift operatörü sayısını azaltır`, `Malzeme belirlenmiş noktalar arasında taşındığından kullanım ve transferin daha doğru kaydını sağlar; büyük güvenlik stokuna ihtiyacı azaltır`, `Rotaların konveyörlere göre kolay değiştirilmesini sağlar`, `Zeminde kalıcı yer kaplamaz`],
      answer: 1, explain: `AGV s.5, madde 1. Forklift operatörü azalması "personel" avantajı (madde 2), rota değişimi "flexibility" (madde 4), zemin "floor space" (madde 5) avantajıdır.` },
    { q: `Operatörün kendi hızında çalışabilmesi ve konveyör hızıyla sınırlanmaması hangi avantaj başlığı altındadır?`,
      options: [`Material control`, `Flexibility`, `Efficient work environment`, `Integration within plant`],
      answer: 2, explain: `AGV s.5, madde 3: AGV her istasyonun yüklemesini/boşaltmasını diğerlerinden bağımsız yapar; operatör kendi hızında çalışır, hareketli platform işi istenen yükseklikte teslim eder.` },
    { q: `AGV'nin konveyörlere göre "flexibility" ve "better use of floor space" üstünlüğü doğru olarak hangisinde verilmiştir?`,
      options: [`Rotalar sabit yataklı konveyörlerden çok daha kolay değiştirilir/eklenir; gömülü kılavuz hatlar zemini kalıcı olarak işgal etmez`, `Rotalar zor değiştirilir ama zemin çok verimli kullanılır`, `Rotalar kolay değiştirilir ama kılavuz hatlar zemin üstünde kalıcı yer kaplar`, `İkisi de yalnızca vinçli sistemlere göre geçerlidir`],
      answer: 0, explain: `AGV s.5–6, madde 4 ve 5: esneklik (rota değişimi kolay) ve gömülü hatlar (zemini kalıcı işgal etmez; konveyör zemine sabittir).` },
    { q: `AGV'lerin "adaptability to automation" avantajı kapsamında notlarda sayılan sistemler hangileridir? (birden fazla)`,
      options: [`Robotlar`, `Otomatik depolama ve geri alma sistemleri`, `Asansörler ve kapılar`, `Manuel torna tezgâhları`],
      answer: [0, 1, 2], explain: `AGV s.6, madde 6: robotlar, otomatik depolama-geri alma sistemleri, konveyörler, asansörler, kapılar ve otomatik üretim makineleriyle verimli çalışabilir. Manuel tezgâh listede yok.` },
    { q: `AGV'lerin tesisteki farklı otomasyon hücreleri arasında bağlantı kurarak genel operasyonu bütünleştirmesi hangi avantajdır?`,
      options: [`Adaptability to existing facilities`, `Integration within plant`, `More efficient use of personnel`, `Adaptability to automation`],
      answer: 1, explain: `AGV s.6, madde 7: "Integration within plant" — AGV farklı otomasyon hücreleri arasında bağ sağlar. Madde 6 (automation) ise AGV'nin robot, AS/RS vb. sistemlerle birlikte çalışabilmesidir.` },
    { q: `Mevcut bir tesise AGV kurmak neden "minimum yapısal değişiklik" gerektirir?`,
      options: [`Kılavuz yollar için zeminde yuvalar yeterlidir; vinç için ağır taşıyıcı yapı, konveyör için kapsamlı zemin/yapı değişikliği gerekir`, `AGV'ler hiç kılavuz yol gerektirmez`, `AGV sistemleri yalnızca yeni kurulan tesislerde çalışır`, `AGV'ler her zaman konveyörle birlikte kurulur`],
      answer: 0, explain: `AGV s.6, madde 8: guide path'ler zeminde en çok yuva gerektirir; vinç/konveyör sistemlerine kıyasla yapısal değişiklik çok azdır.` },
    { q: `Depo alanlarına giren/çıkan dökme (bulk) malzemeyi taşımada kullanılan, 500 kg – 22.5 ton kapasiteli ve en eski AGV türü hangisidir?`,
      options: [`AGV unit load vehicle`, `AGV fork truck`, `AGV towing vehicle`, `Light load AGV`],
      answer: 2, explain: `AGV s.7: towing vehicles en eski türdür, 500 kg – 22.5 ton, esas olarak depolarda bulk malzeme hareketi.` },
    { q: `Yük transfer yüksekliğinin istasyondan istasyona değiştiği durumlarda hangi AGV türü özellikle yararlıdır?`,
      options: [`AGV towing vehicle`, `AGV assembly line vehicle`, `Light load AGV`, `AGV fork truck`],
      answer: 3, explain: `AGV s.8: fork truck AGV, forklift gibi yükü zeminden ayakta duruş seviyesine kadar farklı yüksekliklerde otomatik alıp bırakır; transfer yüksekliği değişen yerlerde yararlıdır.` },
    { q: `Motor ya da şanzıman gibi ana alt montajların istasyondan istasyona taşındığı ve her istasyonda parça eklenerek montajın tamamlandığı AGV türü hangisidir, hangi türün modifikasyonudur?`,
      options: [`Assembly line vehicle; light-load AGV'nin modifikasyonu`, `Unit load vehicle; towing AGV'nin modifikasyonu`, `Fork truck AGV; unit load AGV'nin modifikasyonu`, `Towing vehicle; fork truck AGV'nin modifikasyonu`],
      answer: 0, explain: `AGV s.9: assembly line vehicles, light-load AGV'lerin modifikasyonudur (light load: en çok 250 kg, dar alanlarda manevra, hafif imalat).` },
    { q: `Güverteli (deck) araçlarla birim yük taşıyan, genellikle konveyör ve otomatik depolama-geri alma sistemleriyle bütünleşip depoya giriş-çıkışı tamamen otomatik yapan tür hangisidir?`,
      options: [`AGV unit load vehicles`, `AGV towing vehicles`, `AGV fork trucks`, `AGV assembly line vehicles`],
      answer: 0, explain: `AGV s.7: unit load vehicles — birim yük taşıyan güverteler; konveyör ve AS/RS ile bütünleşerek depo/dağıtım sisteminde malzeme hareketini tamamen otomatik yapar.` }
  ];

  /* ===================== 4.2 Kılavuzlama, güvenlik, batarya ===================== */
  IM.content.summaries['4.2'] = `<h2>4.2 Kılavuzlama, güvenlik ve batarya yönetimi</h2>
<p class="note">Ders notu: AGV s.10–13</p>
<h3>Kılavuzlama (guiding) — AGV s.10</h3>
<p>Kılavuzlama, aracı <b>önceden belirlenmiş yolda tutmak</b> içindir. Yolu değiştirmek konveyörlerin aksine <b>kolaydır</b> (konveyörde hat fiziksel olarak sabittir).</p>
<h3>Guidance system types — AGV s.11 (hiyerarşi slayttaki girintiden okunur)</h3>
<table>
<tr><th>Ana grup</th><th>Alt grup</th><th>Sistemler</th></tr>
<tr><td><b>Guidance systems with cable</b> (kablolu)</td><td>—</td><td>kablolu kılavuzlama</td></tr>
<tr><td rowspan="2"><b>Guidance systems without cable</b> (kablosuz)</td><td><b>On-floor systems</b> (zemin üzerinde)</td><td>Optic guidance · Lined guidance (painted = boyalı, chemical = kimyasal)</td></tr>
<tr><td><b>Floor-independent systems</b> (zeminden bağımsız)</td><td>Position estimating · Gyroscopic · Laser guided · Sign tower guided</td></tr>
</table>
<p>Özet: on-floor sistemler zemindeki bir izi (optik/boya/kimyasal çizgi) izler; floor-independent sistemler zemine bağlı bir iz gerektirmez — konum tahmini, jiroskop, lazer ve işaret kulesi ile yön bulur. (Bu çıkarım slayttaki grup adlarına dayanır; her yöntemin çalışma ayrıntısı notlarda yok.)</p>
<h3>Güvenlik (Security) — AGV s.12</h3>
<ul>
<li>Light (ışık uyarısı)</li>
<li>Security brakes (güvenlik frenleri)</li>
<li>Sensors (sensörler)</li>
<li>Emergency stop buttons (acil durdurma butonları)</li>
<li>"Weak Battery" warning message (zayıf batarya uyarı mesajı)</li>
<li>Floor cleaning brush and cylinders (zemin temizleme fırça ve silindirleri)</li>
</ul>
<h3>Batarya yönetimi (Battery management) — AGV s.13</h3>
<table>
<tr><th>Yöntem</th><th>Notlardaki tanım</th></tr>
<tr><td><b>Battery changing</b></td><td>Operatör biten bataryayı yenisiyle değiştirir ve eskiyi şarj eder (insan işlemi)</td></tr>
<tr><td><b>Automated charging</b></td><td>Bir saatlik çalışma için <b>12 dakika</b> şarj gerekir; şarj otomatik yapılır</td></tr>
<tr><td><b>Opportunity-based charging</b></td><td>Şarj, uygun bir zamanda yapılır</td></tr>
<tr><td><b>Automated battery changing</b></td><td>Batarya değişimi otomatik batarya değiştirici ile yapılır</td></tr>
</table>
<div class="model">Şarj oranı (automated charging, AGV s.13):  12 dk şarj → 1 saat (60 dk) çalışma   ⇒   12 / 60 = 0.20 dk şarj / dk çalışma
Örnek (notlarda yok, aynı oranla): 3 saat çalışma için 3 × 12 = 36 dk şarj</div>
<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
<li><b>Battery changing</b> (operatör değiştirir) ile <b>automated battery changing</b> (otomatik değiştirici) farklıdır; <b>automated charging</b> ise değişim değil, otomatik şarjdır.</li>
<li>Rakam: <b>12 dakika şarj = 1 saat çalışma</b> (tersi değil, 1 saat şarj değil).</li>
<li>Optic ve lined guidance <b>on-floor</b>; position estimating, gyroscopic, laser ve sign tower <b>floor-independent</b> gruptadır. Kablolu sistem, kablosuz ağacın dışında ayrı bir ana gruptur.</li>
<li>"Weak Battery" uyarısı güvenlik listesinde yer alır; battery management başlığıyla karıştırılıp güvenlik listesinden çıkarılmasın.</li>
</ul></div>`;

  IM.content.concepts['4.2'] = [
    { q: `AGV'lerde kılavuzlama (guiding) neden vardır ve konveyöre göre avantajı nedir?`,
      options: [`Aracı önceden belirlenmiş yolda tutar; yolu değiştirmek konveyörlerin aksine kolaydır`, `Aracı serbestçe dolaştırır; yol hiç tanımlanmaz`, `Yalnızca bataryayı şarj eder; yol değişimi zordur`, `Hızı sınırlar; konveyörden daha pahalıdır`],
      answer: 0, explain: `AGV s.10: kılavuzlama aracı önceden belirlenmiş yolda tutmak içindir; yol değiştirmek konveyörlerin aksine kolaydır.` },
    { q: `Notlardaki guidance system types ağacının en üst düzeyde ayrımı hangisidir?`,
      options: [`On-floor ve floor-independent`, `Kablolu (with cable) ve kablosuz (without cable)`, `Optik ve lazer`, `Boyalı ve kimyasal`],
      answer: 1, explain: `AGV s.11: ana gruplar "with cable" ve "without cable"; kablosuz grup ise on-floor ve floor-independent diye ikiye ayrılır.` },
    { q: `On-floor systems grubunda notlarda yer alan yöntemler hangileridir? (birden fazla)`,
      options: [`Optic guidance`, `Lined guidance (painted veya chemical)`, `Laser guided systems`, `Gyroscopic guidance systems`],
      answer: [0, 1], explain: `AGV s.11: on-floor → optic guidance ve lined guidance (painted/chemical). Laser ve gyroscopic floor-independent gruptadır.` },
    { q: `Floor-independent systems grubunda notlarda yer alan yöntemler hangileridir? (birden fazla)`,
      options: [`Position estimating guidance systems`, `Gyroscopic guidance systems`, `Laser guided systems`, `Sign tower guided systems`, `Optic guidance`],
      answer: [0, 1, 2, 3], explain: `AGV s.11: floor-independent → position estimating, gyroscopic, laser guided, sign tower guided. Optic guidance on-floor grubundadır.` },
    { q: `"Lined guidance (painted or chemical)" hangi grubun altındadır?`,
      options: [`Guidance systems with cable`, `Floor-independent systems`, `On-floor systems (kablosuz grup)`, `Sign tower guided systems`],
      answer: 2, explain: `AGV s.11: lined guidance (boyalı ya da kimyasal çizgi), kablosuz sistemlerin on-floor alt grubundadır; kablolu sistem ayrı bir ana gruptur.` },
    { q: `Aşağıdakilerden hangisi notlardaki güvenlik (security) listesinde YER ALMAZ?`,
      options: [`Security brakes`, `Emergency stop buttons`, `"Weak Battery" warning message`, `Otomatik yangın söndürme sistemi`],
      answer: 3, explain: `AGV s.12 listesi: light, security brakes, sensors, emergency stop buttons, "weak battery" warning message, floor cleaning brush and cylinders. Yangın söndürme listede yok.` },
    { q: `Notlardaki güvenlik özellikleri hangileridir? (birden fazla)`,
      options: [`Light`, `Sensors`, `Floor cleaning brush and cylinders`, `Opportunity-based charging`],
      answer: [0, 1, 2], explain: `AGV s.12: light, security brakes, sensors, emergency stop buttons, weak battery uyarısı, floor cleaning brush/cylinders. Opportunity-based charging batarya yönetimi başlığındadır (s.13).` },
    { q: `Operatörün biten bataryayı yenisiyle değiştirip eskisini şarj ettiği batarya yönetimi yöntemi hangisidir?`,
      options: [`Automated charging`, `Opportunity-based charging`, `Battery changing`, `Automated battery changing`],
      answer: 2, explain: `AGV s.13: "Battery changing" — operatör değiştirir ve eski bataryayı şarj eder. Otomatik değiştirici kullanılırsa "automated battery changing" olur.` },
    { q: `"12 dakikalık şarj bir saatlik çalışma için gerekir" ifadesi hangi yönteme aittir?`,
      options: [`Battery changing`, `Automated charging`, `Opportunity-based charging`, `Automated battery changing`],
      answer: 1, explain: `AGV s.13: automated charging — bir saatlik çalışma için 12 dakikalık şarj gerekir ve şarj otomatik yapılır.` },
    { q: `Aynı oranla (12 dk şarj → 60 dk çalışma) bir AGV 5 saat çalışacaksa gereken toplam şarj süresi nedir? (türetilmiş hesap, notlarda yok)`,
      options: [`30 dk`, `48 dk`, `60 dk`, `72 dk`],
      answer: 2, explain: `5 saat × 12 dk = 60 dk (oran 0.20). Oran AGV s.13'ten; 5 saatlik örnek notlarda yok.` },
    { q: `Şarjın "uygun bir zamanda yapıldığı" yöntem hangisidir?`,
      options: [`Opportunity-based charging`, `Battery changing`, `Automated battery changing`, `Automated charging`],
      answer: 0, explain: `AGV s.13: opportunity-based charging — şarj uygun bir zamanda yapılır.` },
    { q: `Batarya değişiminin otomatik bir batarya değiştirici tarafından yapıldığı yöntem ile operatörün yaptığı yöntemi doğru eşleştiren seçenek hangisidir?`,
      options: [`Otomatik değiştirici: automated battery changing · operatör: battery changing`, `Otomatik değiştirici: battery changing · operatör: automated battery changing`, `Otomatik değiştirici: automated charging · operatör: opportunity-based charging`, `Otomatik değiştirici: opportunity-based charging · operatör: automated charging`],
      answer: 0, explain: `AGV s.13: battery changing = operatör; automated battery changing = otomatik batarya değiştirici.` },
    { q: `Sign tower guided ve gyroscopic guidance aşağıdaki hangi gruba girer?`,
      options: [`Guidance systems with cable`, `On-floor systems`, `Floor-independent systems`, `Güvenlik sistemleri`],
      answer: 2, explain: `AGV s.11: position estimating, gyroscopic, laser ve sign tower guided → floor-independent (zeminden bağımsız) sistemler.` }
  ];

  /* ===================== 4.3 Gerekli AGV sayısı ===================== */
  IM.content.summaries['4.3'] = `<h2>4.3 Gerekli AGV sayısının belirlenmesi</h2>
<p class="note">Ders notu: AGV s.14–17</p>
<h3>Problem (AGV s.14–15)</h3>
<p>Hücresel yerleşimde bir depo (warehouse) ve 4 hücre (Cell 1–4) vardır; AGV'ler depodan her hücreye gidip gelir. Veriler (AGV s.15):</p>
<table>
<tr><th>Hücre</th><th>Depodan mesafe d (m)</th><th>Sefer sıklığı f (sefer / saat)</th><th>Yükleme/boşaltma t (dk)</th></tr>
<tr><td>1</td><td>90</td><td>14</td><td>2</td></tr>
<tr><td>2</td><td>150</td><td>16</td><td>3</td></tr>
<tr><td>3</td><td>180</td><td>5</td><td>3</td></tr>
<tr><td>4</td><td>240</td><td>8</td><td>2</td></tr>
</table>
<p>AGV hızı <b>v = 60 m/dk</b> (notlara göre AGV'lerin normal hızı genellikle 60 – 80 m/dk).</p>
<h3>Çözüm adımları (AGV s.16)</h3>
<ol>
<li>Depodan her varış noktasına toplam seyahat süresini belirle (<b>gidiş-dönüş</b>).</li>
<li>Yükleme ve boşaltma süresini ekle.</li>
<li>Sefer sıklığını kullanarak toplam araç kullanım süresini bul.</li>
<li>Bu sayıyı <b>traffic congestion factor</b>'e (genelde <b>0.85</b>) <b>böl</b> → toplam gerekli süre (dk).</li>
<li>Toplam yükü <b>60 dk / saat</b>'e bölerek gerekli araç sayısını bul.</li>
</ol>
<div class="model">Hücre i saatlik AGV kullanımı:  U<sub>i</sub> = (2 · d<sub>i</sub> · f<sub>i</sub>) / v  +  f<sub>i</sub> · t<sub>i</sub> · 2        (dk / saat)
Toplam gerekli süre = ΣU<sub>i</sub> / 0.85           (dk / saat)
AGV sayısı N = ⌈ Toplam gerekli süre / 60 ⌉</div>
<h3>Hesap (AGV s.17)</h3>
<table>
<tr><th>Hücre</th><th>Gidiş-dönüş seyahat</th><th>Yükleme/boşaltma</th><th>U<sub>i</sub> (dk)</th></tr>
<tr><td>1</td><td>(90 + 90) × 14 / 60 = 42</td><td>14 × 2 × 2 = 56</td><td><b>98</b></td></tr>
<tr><td>2</td><td>(150 + 150) × 16 / 60 = 80</td><td>16 × 3 × 2 = 96</td><td><b>176</b></td></tr>
<tr><td>3</td><td>(180 + 180) × 5 / 60 = 30</td><td>5 × 3 × 2 = 30</td><td><b>60</b></td></tr>
<tr><td>4</td><td>(240 + 240) × 8 / 60 = 64</td><td>8 × 2 × 2 = 32</td><td><b>96</b></td></tr>
<tr><td colspan="3"><b>Toplam</b></td><td><b>430</b></td></tr>
</table>
<p>Toplam yük: 430 / 0.85 = <b>505.88</b> dk (slayt 505'e yuvarlıyor). Gerekli AGV: 505.88 / 60 = <b>8.43</b> → ⌈8.43⌉ = <b>9 AGV</b>. (Not: slaytta "505 / 60 = 8.43" yazılıdır; yuvarlanmış 505 ile bölme 8.42 verir, 8.43 yuvarlanmamış 505.88'den gelir. Sonuç iki durumda da 9'dur.)</p>
<p>Yorum (notlarda yok): çarpan 2, bir seferde hem yüklemenin hem boşaltmanın t dakika sürmesinden gelir; slayt çarpanı açıklamaz. Ayrıca hız artarsa seyahat süresi azalır (ör. v = 80 m/dk için toplam 376, 376 / 0.85 = 442.35 dk, 442.35 / 60 = 7.37 → 8 AGV).</p>
<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
<li><b>0.85 ile BÖLÜNÜR, çarpılmaz</b>: 430 × 0.85 = 365.5 → 6.09 → 7 yanlış sonuç verir; doğrusu 430 / 0.85 = 505.88. Trafik tıkanıklığı araç ihtiyacını artırır.</li>
<li>Mesafe <b>tek yön</b> değil <b>gidiş-dönüş</b> alınır (d + d = 2d); aksi hâlde seyahat süresi yarıya iner.</li>
<li>Mesafe m, hız m/dk → süre dakika; toplam saat başına dakikadır, bu yüzden son adımda 60 dk'ya bölünür.</li>
<li>Son adım <b>⌈⌉</b>: 8.43 → 9 (en yakın tam sayıya yuvarlamak 8 verir, yetersizdir).</li>
<li>Yükleme/boşaltma süresi seferle çarpılır (f · t · 2); sadece t kullanmak veya sefer sayısını unutmak hatalıdır.</li>
</ul></div>`;

  IM.content.concepts['4.3'] = [
    { q: `Notlardaki AGV sayısı çözümünün adım sırası hangisidir (AGV s.16)?`,
      options: [`Gidiş-dönüş seyahat süresi → yükleme/boşaltma ekle → sefer sıklığıyla toplam kullanım → 0.85'e böl → 60'a böl`, `Yükleme/boşaltma → 0.85 ile çarp → gidiş-dönüş süresi → 60 ile çarp`, `Sefer sıklığı → 60'a böl → 0.85 ile çarp → mesafe ekle`, `Toplam kullanım → 60'a böl → 0.85'e böl → gidiş-dönüş ekle`],
      answer: 0, explain: `AGV s.16: (1) toplam seyahat süresi (gidiş-dönüş), (2) yükleme/boşaltma ekle, (3) sefer sıklığıyla toplam araç kullanım süresi, (4) traffic congestion factor'e böl, (5) 60 dk / saat'e böl.` },
    { q: `Cell 1 için gidiş-dönüş seyahat süresi saatte toplam kaç dakikadır? (d = 90 m, f = 14 sefer / saat, v = 60 m/dk)`,
      options: [`21 dk`, `42 dk`, `84 dk`, `3 dk`],
      answer: 1, explain: `Bir tur: (90 + 90) / 60 = 3 dk; saatte 14 sefer → 3 × 14 = 42 dk (AGV s.17). 21 dk tek yön, 3 dk tek tur değeridir.` },
    { q: `Cell 1'in saatlik AGV kullanımı nedir? (seyahat 42 dk, yükleme/boşaltma 14 × 2 × 2)`,
      options: [`70 dk`, `84 dk`, `98 dk`, `112 dk`],
      answer: 2, explain: `42 + 14 × 2 × 2 = 42 + 56 = 98 dk (AGV s.17).` },
    { q: `Cell 2'nin saatlik AGV kullanımı nedir? (d = 150 m, f = 16, t = 3 dk)`,
      options: [`128 dk`, `176 dk`, `96 dk`, `224 dk`],
      answer: 1, explain: `Seyahat (150 + 150) × 16 / 60 = 80; yükleme/boşaltma 16 × 3 × 2 = 96; toplam 176 dk (AGV s.17). 96 yalnızca yükleme/boşaltma kısmıdır.` },
    { q: `Cell 3'ün saatlik AGV kullanımı kaçtır? (d = 180 m, f = 5, t = 3 dk)`,
      options: [`30 dk`, `45 dk`, `60 dk`, `90 dk`],
      answer: 2, explain: `Seyahat (180 + 180) × 5 / 60 = 30; yükleme/boşaltma 5 × 3 × 2 = 30; toplam 60 dk (AGV s.17).` },
    { q: `Dört hücrenin saatlik kullanımları 98, 176, 60 ve 96 dk ise toplam yük kaçtır?`,
      options: [`410 dk`, `420 dk`, `430 dk`, `505 dk`],
      answer: 2, explain: `98 + 176 + 60 + 96 = 430 dk (AGV s.17). 505, congestion factor'e bölündükten sonraki değerdir.` },
    { q: `430 dk'lık toplam yük traffic congestion factor 0.85 ile nasıl işleme girer ve sonuç nedir?`,
      options: [`430 × 0.85 = 365.5 dk`, `430 / 0.85 = 505.88 dk (slayt: 505)`, `430 + 0.85 = 430.85 dk`, `430 / 0.15 = 2866.67 dk`],
      answer: 1, explain: `AGV s.16–17: toplam kullanım congestion factor'e bölünür → 430 / 0.85 = 505.88 dk (slayt 505'e yuvarlar). Çarpmak yük azaltır ve yanlıştır.` },
    { q: `430 dk'lık yükü 0.85 ile çarparak (365.5 dk) hesaplayan öğrenci kaç AGV bulur ve bu neden hatalıdır?`,
      options: [`⌈6.09⌉ = 7; trafik tıkanıklığı yükü azaltmaz, artırır (bölme gerekir)`, `⌈8.43⌉ = 9; hata yok`, `⌈10.24⌉ = 11; hata yok`, `⌈6.09⌉ = 7; doğru çözüm budur`],
      answer: 0, explain: `365.5 / 60 = 6.09 → 7 AGV. Oysa doğru işlem 430 / 0.85 = 505.88 ve 505.88 / 60 = 8.43 → 9 (AGV s.17). Tıkanıklık AGV'lerin etkin çalışma süresini azaltır, gereken araç sayısı artar.` },
    { q: `505.88 dk toplam yük için gereken AGV sayısı nedir ve sonuç nasıl bulunur?`,
      options: [`8 AGV; 8.43 en yakın tam sayıya yuvarlanır`, `9 AGV; 505.88 / 60 = 8.43 yukarı yuvarlanır (⌈8.43⌉)`, `10 AGV; 8.43 + 1`, `505 AGV; yük doğrudan araç sayısıdır`],
      answer: 1, explain: `AGV s.17: 505.88 / 60 = 8.43 ≅ 9. Bir AGV saatte 60 dk hizmet verir; 8 AGV 480 dk sağlar ve 505.88 dk'yı karşılamaz, bu yüzden tavan alınır.` },
    { q: `Slayt "505 / 60 = 8.43" yazar. Bu satırla ilgili doğru yorum hangisidir?`,
      options: [`505 / 60 tam olarak 8.43'tür, başka bir yorum gerekmez`, `505 / 60 = 8.42'dir; 8.43 yuvarlanmamış 505.88 / 60 değeridir. Her iki durumda ⌈⌉ = 9`, `Sonuç 505 ile 9'dan farklı çıkar, slayt yanlıştır`, `Burada hata yoktur ama AGV sayısı 8'dir`],
      answer: 1, explain: `505 / 60 = 8.4167 ≈ 8.42; 505.88 / 60 = 8.4314 ≈ 8.43. Slayt 505'i yuvarlayıp 8.43'ü yuvarlanmamış değerden almıştır; sonuç 9 AGV (AGV s.17).` },
    { q: `Notlardaki örnekte AGV hızı nedir ve genel olarak normal AGV hız aralığı hangisidir?`,
      options: [`60 m/dk; genelde 60 – 80 m/dk`, `80 m/dk; genelde 60 – 80 m/dk`, `60 m/dk; genelde 20 – 40 m/dk`, `90 m/dk; genelde 60 – 80 m/s`],
      answer: 0, explain: `AGV s.15: AGV hızı 60 m/dk; normal hız genellikle 60 – 80 m/dk.` },
    { q: `Aynı problemde hız 80 m/dk olsa (diğer veriler aynı) sonuç ne olur? (türetilmiş hesap, notlarda yok)`,
      options: [`9 AGV (değişmez)`, `8 AGV: toplam 376 dk, 376 / 0.85 = 442.35 dk, 442.35 / 60 = 7.37 → 8`, `7 AGV: 7.37 aşağı yuvarlanır`, `10 AGV: hız artınca araç sayısı artar`],
      answer: 1, explain: `v = 80: seyahat süreleri 31.5 + 60 + 22.5 + 48 = 162; yükleme/boşaltma 214; toplam 376. 376 / 0.85 = 442.35; 442.35 / 60 = 7.37 → ⌈⌉ = 8. Daha yüksek hız seyahat süresini ve araç ihtiyacını azaltır.` },
    { q: `Hesaptaki "× 2" ifadeleri (f · t · 2) ve "(d + d)" ifadeleri neyi temsil eder? (birden fazla)`,
      options: [`(d + d): depodan hücreye gidiş ve hücreden depoya dönüş (round trip)`, `f · t · 2: seferde hem yükleme hem boşaltma süresinin hesaba katılması (slayt çarpanı açıklamaz; yorum)`, `(d + d): iki AGV'nin aynı anda çalışması`, `f · t · 2: iki vardiyalı çalışma`],
      answer: [0, 1], explain: `AGV s.16–17: adım 1 gidiş-dönüş seyahat süresi, adım 2 yükleme ve boşaltma süresidir. İki çarpanı iki vardiya ya da iki AGV olarak okumak notlarda yok.` },
    { q: `Toplam gerekli süre 505.88 dk/saat iken son adımda neden 60'a bölünür?`,
      options: [`Bir AGV bir saatte en fazla 60 dk hizmet verebilir; 505.88 dk'lık yükü karşılamak için kaç AGV-saati gerektiği bulunur`, `60, congestion factor'ün yüzde karşılığıdır`, `60 m/dk AGV hızıdır, bu yüzden bölünür`, `60, hücre sayısıdır`],
      answer: 0, explain: `AGV s.16, adım 5: toplam yük 60 dk / saat'e bölünerek gerekli araç sayısı bulunur. (60 m/dk hızıyla karıştırılmamalı; hız seyahat süresi hesabında kullanılır.)` }
  ];

  /* ===================== 4.4 AGV işletim kuralları ===================== */
  IM.content.summaries['4.4'] = `<h2>4.4 AGV işletim kuralları</h2>
<p class="note">Ders notu: AGV s.18–22</p>
<h3>AGV'yi üretim tesisine sokarken sorulan tasarım soruları (AGV s.18–19)</h3>
<ol>
<li>AGV yolunun <b>konfigürasyonu</b> (path configuration) ne olmalı?</li>
<li>Sistemde <b>kaç AGV</b> olmalı ve <b>kapasiteleri</b> ne olmalı?</li>
<li>Bir AGV'yi bir istasyona göndermede hangi <b>kontrol sistemi (kurallar)</b> kullanılmalı? (dispatching)</li>
<li>Birden fazla istasyon aynı anda AGV talep ediyorsa, ilk ziyaret edilecek istasyonu seçmede hangi <b>öncelik kuralı</b> izlenmeli?</li>
<li>Her istasyonda gelen ve giden birimler için <b>in-process storage bank</b>'lar (ara depolar) ne kadar büyük olmalı?</li>
<li>AGV, bir başlangıç noktasından varış noktasına hangi <b>rotayı</b> izlemeli?</li>
<li>Yolların kesişimlerinde çarpışmayı ya da yolların tıkanmasını önlemek için AGV hangi <b>kurallara</b> uymalı?</li>
</ol>
<h3>Vehicle dispatching rules (AGV s.20) — "hangi araç?"</h3>
<table>
<tr><th>Kural</th><th>Anlamı</th></tr>
<tr><td><b>RV</b> — Random vehicle</td><td>Herhangi bir aracı rastgele ata</td></tr>
<tr><td><b>NV</b> — Nearest vehicle</td><td>Talep noktasına en yakın aracı ata</td></tr>
<tr><td><b>LIV</b> — Longest idle vehicle</td><td>En uzun süredir boşta (idle) bekleyen araç önce atanır</td></tr>
<tr><td><b>LUV</b> — Least utilized vehicle</td><td>Talep anında kullanımı en az olan araç atanır; <b>araçlar arası iş yükünü eşitlemeye</b> çalışır</td></tr>
</table>
<h3>Station prioritizing rules (AGV s.21) — "hangi istasyon?"</h3>
<p>Birden fazla istasyon aynı anda AGV isterse uygulanır.</p>
<table>
<tr><th>Kural</th><th>Anlamı</th></tr>
<tr><td><b>RW</b> — Random work center</td><td>İstasyonu rastgele seç</td></tr>
<tr><td><b>STT/D</b> — Shortest travel time / distance</td><td>Uygun bir araca (mesafe ya da seyahat süresi bakımından) en yakın istasyonu ata</td></tr>
<tr><td><b>MOQS</b> — Maximum outgoing queue size</td><td>Çıkış stokunda (output inventory) en çok birim yük bulunan istasyona araç gönder</td></tr>
<tr><td><b>MROQS</b> — Minimum remaining outgoing queue space</td><td>Çıkış stoku için kalan boş yeri en az olan istasyona araç gönder</td></tr>
</table>
<h3>Path selection rules (AGV s.22) — "hangi araç segmenti kullanır?"</h3>
<p>Bir yol segmenti aynı anda iki ya da daha fazla araç tarafından isteniyorsa aşağıdakilerden biriyle bir araca verilir:</p>
<table>
<tr><th>Kural</th><th>Anlamı</th></tr>
<tr><td><b>RS</b> — Random selection</td><td>Araç rastgele seçilir</td></tr>
<tr><td><b>FV</b> — Full vehicle</td><td>Yük taşıyan araç boş araca göre önceliklidir; yüklü araçlar arasında atama rastgeledir</td></tr>
<tr><td><b>CSR</b> — Critical station response</td><td>Kritik bir istasyona yanıt veren araç önceliklidir</td></tr>
<tr><td><b>CP</b> — Critical part</td><td>Kritik bir parça taşıyan araç önceliklidir</td></tr>
</table>
<div class="model">Karar türü               Kural ailesi (kısaltmalar)
Hangi ARAÇ gitsin?       RV · NV · LIV · LUV
Hangi İSTASYON önce?     RW · STT/D · MOQS · MROQS
Segmenti hangi ARAÇ?     RS · FV · CSR · CP</div>
<p>Küçük örnek (notlarda yok, kuralların farkını göstermek için): iki istasyonun çıkış stoku kapasitesi 20 ve 5 birim; birinde 5 yük (15 yer kalmış), diğerinde 4 yük (1 yer kalmış) var. MOQS birinci istasyonu (5 > 4 yük), MROQS ikinciyi (1 < 15 boş yer) seçer.</p>
<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
<li>Üç kural ailesi farklı sorulara cevap verir: <b>NV/LIV/LUV araç</b> seçer; <b>STT/D, MOQS, MROQS istasyon</b> seçer; <b>FV/CSR/CP segment önceliği</b> belirler. NV ile STT/D'yi karıştırma: NV talep noktasına en yakın <i>aracı</i>, STT/D bir araca en yakın <i>istasyonu</i> seçer.</li>
<li><b>LIV</b> (en uzun süre idle) ile <b>LUV</b> (en az kullanılmış) aynı değildir; iş yükünü eşitlemeye çalışan LUV'dur.</li>
<li><b>MOQS</b> (çıkışta en çok yük) ile <b>MROQS</b> (çıkış stokunda en az boş yer) farklı sayılara bakar; stok kapasiteleri eşit değilse farklı istasyon seçebilirler.</li>
<li><b>FV</b>: yüklü araç önce; yüklüler arasında seçim rastgele. <b>CSR</b> kritik <i>istasyon</i>, <b>CP</b> kritik <i>parça</i> ile ilgilidir.</li>
<li>Tasarım soruları 7 tanedir; in-process storage bank büyüklüğü de bunlardan biridir.</li>
</ul></div>`;

  IM.content.concepts['4.4'] = [
    { q: `Notlara göre AGV'yi tesise sokarken sorulan tasarım sorularından hangisi YOKTUR?`,
      options: [`AGV yolunun konfigürasyonu nasıl olmalı?`, `Kaç AGV olmalı ve kapasiteleri ne olmalı?`, `Operatörlerin vardiya planı nasıl yapılmalı?`, `Kesişimlerde çarpışmayı önlemek için hangi kurallar izlenmeli?`],
      answer: 2, explain: `AGV s.18–19: yol konfigürasyonu, AGV sayısı/kapasitesi, dispatching kuralı, istasyon önceliği, in-process storage büyüklüğü, rota seçimi, kesişim kuralları. Vardiya planı listede yok.` },
    { q: `Her istasyonda gelen ve giden birimler için ara depo (in-process storage bank) büyüklüğü hangi tasarım sorusuna aittir?`,
      options: [`Dispatching kuralı sorusuna`, `AGV sayısı sorusuna`, `Rota seçimi sorusuna`, `Bağımsız bir tasarım sorusudur: "inprocess storage banks ne kadar büyük olmalı?"`],
      answer: 3, explain: `AGV s.19: "How large should the inprocess storage banks be for incoming and outgoing units at each station?" ayrı bir tasarım sorusudur.` },
    { q: `Birden fazla istasyon aynı anda AGV talep ettiğinde ilk istasyonu seçmeyi hangi kural ailesi belirler?`,
      options: [`Vehicle dispatching rules (RV, NV, LIV, LUV)`, `Station prioritizing rules (RW, STT/D, MOQS, MROQS)`, `Path selection rules (RS, FV, CSR, CP)`, `Rastgele seçim zorunludur; kural ailesi yoktur`],
      answer: 1, explain: `AGV s.19 ve s.21: birden fazla istasyon talep ederse station prioritizing rules uygulanır. Vehicle dispatching rules hangi aracın gönderileceğini, path selection rules segment çakışmasını çözer.` },
    { q: `Nearest vehicle (NV) kuralı neyi yapar?`,
      options: [`Talep noktasına en yakın aracı atar`, `Bir araca en yakın istasyonu seçer`, `En uzun süre boşta kalan aracı atar`, `Kullanımı en az olan aracı atar`],
      answer: 0, explain: `AGV s.20: NV — talep noktasına en yakın araç atanır. Araca en yakın istasyonu seçmek STT/D'dir (s.21).` },
    { q: `Vehicle dispatching rules listesi hangi seçenekte doğru ve eksiksizdir? (birden fazla)`,
      options: [`RV`, `NV`, `LIV`, `LUV`, `MOQS`],
      answer: [0, 1, 2, 3], explain: `AGV s.20: RV, NV, LIV, LUV. MOQS istasyon önceliği kuralıdır (s.21).` },
    { q: `Araçlar arasında iş yükünü eşitlemeye çalışan dispatching kuralı hangisidir?`,
      options: [`RV`, `NV`, `LIV`, `LUV`],
      answer: 3, explain: `AGV s.20: LUV (least utilized vehicle) talep anında kullanımı en az olan aracı atar ve tüm araçlardaki iş yükünü eşitlemeye çalışır. LIV ise en uzun süre idle olanı seçer.` },
    { q: `Üç araç talep anında sırasıyla 5, 12 ve 3 dakikadır boştadır (idle). LIV kuralı hangisini atar?`,
      options: [`3 dakikadır boşta olan`, `5 dakikadır boşta olan`, `12 dakikadır boşta olan`, `Talep noktasına en yakın olan, süreden bağımsız`],
      answer: 2, explain: `AGV s.20: LIV, en uzun süredir idle olan aracı önce atar → 12 dk. (Sayılar örnektir, notlarda yok.)` },
    { q: `STT/D (shortest travel time/distance) kuralı nedir?`,
      options: [`Çıkış stoku en dolu istasyonu seçer`, `Uygun bir araca, mesafe ya da seyahat süresi bakımından en yakın istasyonu atar`, `Yüklü aracı boş araca tercih eder`, `Rastgele istasyon seçer`],
      answer: 1, explain: `AGV s.21: STT/D — mevcut (uygun) bir araca mesafe veya seyahat süresi bakımından en yakın istasyon atanır.` },
    { q: `MOQS ve MROQS kurallarını doğru tanımlayan eşleşme hangisidir?`,
      options: [`MOQS: çıkış stokunda en çok birim yük olan istasyon · MROQS: çıkış stoku için kalan yeri en az olan istasyon`, `MOQS: çıkış stoku için kalan yeri en az olan istasyon · MROQS: çıkışta en çok yük olan istasyon`, `MOQS: giriş stoku en boş istasyon · MROQS: giriş stoku en dolu istasyon`, `MOQS ve MROQS aynı kuraldır`],
      answer: 0, explain: `AGV s.21: MOQS = maximum outgoing queue size (output inventory'de en çok yük); MROQS = minimum remaining outgoing queue space (çıkış stokunda en az kalan yer).` },
    { q: `İki istasyonun çıkış stokları: S1'de 5 yük, 15 boş yer; S2'de 4 yük, 1 boş yer. MOQS ve MROQS hangi istasyonu seçer? (örnek notlarda yok)`,
      options: [`İkisi de S1`, `İkisi de S2`, `MOQS: S1 · MROQS: S2`, `MOQS: S2 · MROQS: S1`],
      answer: 2, explain: `MOQS en çok yüke bakar: 5 > 4 → S1. MROQS en az boş yere bakar: 1 < 15 → S2 (AGV s.21). Kapasiteler eşit olmayınca kurallar ayrışır.` },
    { q: `Path selection rules ne zaman devreye girer?`,
      options: [`Bir yol segmenti iki ya da daha fazla araç tarafından aynı anda isteniyorsa`, `Bir istasyon tek başına AGV istiyorsa`, `Batarya zayıfladığında`, `Yeni bir AGV satın alınırken`],
      answer: 0, explain: `AGV s.22: bir segment iki veya daha fazla araç tarafından aynı anda gerekiyorsa aşağıdaki kurallardan biriyle atanır.` },
    { q: `Path selection rules hangileridir? (birden fazla)`,
      options: [`RS (random selection)`, `FV (full vehicle)`, `CSR (critical station response)`, `CP (critical part)`, `LUV`],
      answer: [0, 1, 2, 3], explain: `AGV s.22: RS, FV, CSR, CP. LUV vehicle dispatching kuralıdır (s.20).` },
    { q: `Bir segmentte yüklü bir araç ile boş bir araç çakışırsa FV (full vehicle) kuralına göre ne olur? Yüklü araçlar arasında seçim nasıldır?`,
      options: [`Boş araç geçer; yüklüler arasında en yakın olan seçilir`, `Yüklü araç geçer; yüklü araçlar arasında atama rastgeledir`, `İkisi de bekler`, `Yüklü araçlar arasında en uzun idle olan seçilir`],
      answer: 1, explain: `AGV s.22: FV — yük taşıyan araç boş araca göre önceliklidir; yüklü araçlar arasında atama rastgeledir.` },
    { q: `CSR ve CP kurallarının farkı nedir?`,
      options: [`CSR: kritik bir istasyona yanıt veren araç öncelikli · CP: kritik bir parça taşıyan araç öncelikli`, `CSR: kritik parça taşıyan araç · CP: kritik istasyona yanıt veren araç`, `Her ikisi de yüklü aracı boş araca tercih eder`, `Her ikisi de rastgele seçimdir`],
      answer: 0, explain: `AGV s.22: CSR = critical station response (istasyon odaklı); CP = critical part (taşınan parça odaklı).` }
  ];

  /* ===================== 4.5 AGV sisteminin simülasyonu ===================== */
  IM.content.summaries['4.5'] = `<h2>4.5 AGV sisteminin simülasyonu</h2>
<p class="note">Ders notu: AGV s.23–29</p>
<h3>Yerleşim (AGV s.23) ve varsayımlar (s.24)</h3>
<p>Sistemde <b>12 yol segmenti</b> (1–12), <b>iki araç</b> (Vehicle 1, Vehicle 2; slayt araç sayısını yazmaz, tablolardan çıkarım; boştayken home base A'dadırlar), 3 makine ve giriş/çıkış istasyonları vardır. Her segmentin seyahat süresi <b>2 dakika</b>; giriş-çıkış istasyonları segmentlerin <b>ortasındadır</b> (ör. a, 9. segmentin ortasında); her istasyonda <b>yükleme-boşaltma (L/UL) 2 dakika</b>dır. Yerleşim görseli özette kullanılamadığı için tablo ile verilir:</p>
<table>
<tr><th>İstasyon</th><th>Rolü</th><th>Bulunduğu segment</th></tr>
<tr><td><b>A</b></td><td>Sistem girişi (input), araçların <b>home base</b>'i</td><td>1</td></tr>
<tr><td><b>B</b></td><td>Sistem çıkışı (output)</td><td>8</td></tr>
<tr><td><b>a</b> / <b>b</b></td><td>M1 giriş / M1 çıkış</td><td>9 / 3</td></tr>
<tr><td><b>c</b> / <b>d</b></td><td>M2 giriş / M2 çıkış</td><td>4 / 10</td></tr>
<tr><td><b>e</b> / <b>f</b></td><td>M3 giriş / M3 çıkış</td><td>6 / 7</td></tr>
</table>
<p>Tek yönlü yollar (tablolarda geçenler): A→a: 1,9 · a→A: 9,11,8,1 · a→b: 9,12,3 · b→e: 3,4,5,6 · A→e: 1,9,10,6 · e→b: 6,7,11,12,3 · e→f: 6,7 · b→c: 3,4.</p>
<h3>İşler (AGV s.25)</h3>
<table>
<tr><th>İş</th><th>Rota</th><th>İşlem süreleri (dk)</th><th>Geliş arası süre IAT (dk)</th></tr>
<tr><td>J1</td><td>M1, M3</td><td>5, 7</td><td>10</td></tr>
<tr><td>J2</td><td>M1, M2</td><td>6, 3</td><td>15</td></tr>
<tr><td>J3</td><td>M3</td><td>8</td><td>20</td></tr>
</table>
<p>Varışlar: J1 → 10, 20, 30, 40…; J2 → 15, 30, 45…; J3 → 20, 40, 60….</p>
<h3>İşletim kuralları (AGV s.26)</h3>
<ol>
<li>Talebe <b>NV</b> (nearest vehicle) yanıt verir; talep yoksa araç <b>A'daki home base'e</b> döner.</li>
<li>Bir makine çıkış istasyonu ile sistem giriş istasyonu A aynı anda araç bekliyorsa, <b>makine çıkışındaki kısmen/tamamen bitmiş işe öncelik</b> verilir; birden fazla çıkış istasyonu bekliyorsa <b>STD</b> (shortest travel distance) uygulanır.</li>
<li>Bir yol segmentinde <b>full vehicle</b> (yüklü araç) önceliklidir.</li>
</ol>
<h3>Zamanlama kuralı</h3>
<div class="model">TrT = (yoldaki segment sayısı − 1) × 2        (ilk ve son segmentten yarım, 1 dk, kullanılır)
Yüklü yolculuk:  Comp = STT + L/UL + TrT      (1 dk yükleme · seyir STT + 1'de başlar · 1 dk boşaltma)
Boş yolculuk:    Comp = STT + TrT
Örnek: A→a, STT 10, yol 1,9: TrT = (2 − 1) × 2 = 2 → seyir 11–13, Comp = 10 + 2 + 2 = 14</div>
<p>Tablo sütunları (açılımlar slaytta verilmez, tablolardan çıkarım): CC = saat (clock), JA = job arrival, JQA = A'daki iş kuyruğu, ST/EN = başlangıç/bitiş istasyonu, STT = yolculuğun başlama zamanı, PT = yol, TrT = seyahat süresi, Comp = yolculuk bitişi; makine tablosunda JIQ/JOQ = giriş/çıkış kuyruğu, JM = makinedeki iş, ST/PR/CMP = başlangıç/işlem süresi/bitiş.</p>
<h3>Tabloların okunması (AGV s.27–29, birkaç satır adım adım)</h3>
<ul>
<li><b>CC 10, satır 1:</b> J1 gelir ve A'dadır; V1 gider. A→a, yol 1,9, TrT 2. Yükleme 10–11, seyir 11–13 (Path tablosu: seg 1: 11–12, seg 9: 12–13), boşaltma 13–14 → Comp 14.</li>
<li><b>CC 14, satır 2:</b> V1 a'dan A'ya boş döner (kural 1), yol 9,11,8,1 → TrT 6 → Comp 20. Aynı anda Machine tablosunda M1'e J1 girer: ST 14, PR 5, CMP 19.</li>
<li><b>CC 15, satır 3:</b> J2 gelir; V1 uzakta olduğundan V2 (A'da) alır: A→a, STT 15, Comp 19. <b>CC 19:</b> M1 J1'i bitirir (JOQ b = J1) ve J2 aynı anda M1'e girer (ST 19, PR 6, CMP 25). a'da boşalan V2, b'ye en yakın araçtır (NV) → a→b, yol 9,12,3, boş yolculuk, TrT 4, Comp 23.</li>
<li><b>CC 20:</b> V1 A'ya döner, kuyrukta J1 ve J3 vardır; sırayla J1 alınır (A→a, STT 20, Comp 24). <b>CC 23:</b> V2 b'deki J1'i yükler: b→e, yol 3,4,5,6, TrT 6, Comp 31 → M3'te J1 ST 31, PR 7, CMP 38.</li>
<li><b>CC 24:</b> J1 a'ya varır ama M1, J2 ile 25'e kadar meşgul → JIQ a'da bekler; M1'de J1 ST 25, CMP 30 olur; J2 b'ye çıkar (JOQ b).</li>
<li><b>CC 30:</b> A'daki kuyruk 3, 1, 2 (J3 20'den beri bekler); V1 A'da J3'ü alır: A→e, yol 1,9,10,6, STT 30, Comp 38. <b>CC 31:</b> V2 e'den b'ye boş döner (6,7,11,12,3 → TrT 8 → Comp 39) ve <b>CC 39</b>'da J2'yi b→c taşır (STT 39, Comp 43); M2'de J2: ST 43, PR 3, CMP 46.</li>
<li><b>CC 38:</b> V1 J3'ü e'ye teslim eder (M3'te J3 ST 38, PR 8, CMP 46); M3'ten J1 çıkış f'ye gelir, V1 e→f boş gider (yol 6,7, Comp 40).</li>
</ul>
<p>Kuyruk gösterimi: "1.3" iki iş (J1, J3), "3.1 / 2" sırayla J3, J1, J2 demektir.</p>
<p><b>Şüpheli noktalar (slayt açıklamıyor):</b> (i) CC 30'da J2 b çıkışında 25'ten beri beklerken V1 A'daki J3'ü alıyor; kural 2'ye göre çıkış istasyonu öncelikli olurdu — notlarda gerekçe yok. (ii) CC 30'da M1'de biten J1, JOQ b sütununa yazılmamış (yalnız "2" görünür).</p>
<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
<li>İstasyonlar segment <b>ortasında</b> olduğundan yolun ilk ve son segmentinin yalnız <b>yarısı</b> (1 dk) kullanılır: TrT = (n − 1) × 2, n × 2 <b>değil</b> (A→a: 2 dk, 4 dk değil).</li>
<li>L/UL = 2 dk <b>toplam</b> (1 dk yükleme + 1 dk boşaltma), her ucunda 2 dk değil. Yüklü yolculukta Comp = STT + 2 + TrT; boş yolculukta L/UL yoktur.</li>
<li>Path tablosunda yüklü yolculukta seyir <b>STT + 1</b>'de başlar (boşta STT'de). Segment süreleri: yarım segment 1 dk, tam segment 2 dk.</li>
<li>Kural sırası: makine çıkışı A girişinden önceliklidir; çıkışlar arasında STD. Aynı segmentte FV kuralı. İş yoksa araç home base A'ya döner.</li>
<li>4.3'teki "L/UL × 2" ile karıştırma: bu bölümde L/UL toplam 2 dk'dır ve her yolculuk için Comp formülüne bir kez girer.</li>
</ul></div>`;

  IM.content.concepts['4.5'] = [
    { q: `Simülasyon örneğindeki varsayımlar notlara göre hangisidir?`,
      options: [`Her segment 1 dk, istasyonlar segment başında, L/UL 1 dk`, `Her segment 2 dk, istasyonlar segmentlerin sonunda, L/UL 4 dk`, `Her segment 2 dk, istasyonlar segmentlerin ortasında, her istasyonda L/UL 2 dk`, `Her segment 5 dk, istasyonlar ortada, L/UL yok`],
      answer: 2, explain: `AGV s.24: seyahat süresi her segment için 2 dk; giriş-çıkış istasyonları segment ortasında (ör. a, 9. segmentin ortasında); L/UL her istasyon için 2 dk.` },
    { q: `Yerleşimde A ve B istasyonları nedir ve hangi segmentlerdedir?`,
      options: [`A sistem çıkışı (segment 8) · B sistem girişi (segment 1)`, `A makine M1 girişi · B makine M3 çıkışı`, `A ve B ikisi de segment 9'dadır`, `A sistem girişi (home base, segment 1) · B sistem çıkışı (segment 8)`],
      answer: 3, explain: `AGV s.23 ve 26: A sistem giriş istasyonu ve home base (1. segment); B çıkış (8. segment). M1: a (9) giriş, b (3) çıkış; M2: c (4), d (10); M3: e (6), f (7).` },
    { q: `Notlardaki işler için rotalar ve işlem süreleri hangisidir? (AGV s.25)`,
      options: [`J1: M1, M2 (5, 7) · J2: M1, M3 (6, 3) · J3: M3 (8)`, `J1: M1, M3 (5, 7) · J2: M1, M2 (6, 3) · J3: M3 (8)`, `J1: M1, M3 (7, 5) · J2: M2, M1 (3, 6) · J3: M2 (8)`, `J1: M1 (5) · J2: M2 (6) · J3: M3 (8)`],
      answer: 1, explain: `AGV s.25: J1 M1 (5) sonra M3 (7), IAT 10; J2 M1 (6) sonra M2 (3), IAT 15; J3 yalnızca M3 (8), IAT 20.` },
    { q: `Simülasyonda işletim kurallarından hangileri vardır? (birden fazla)`,
      options: [`Talebe en yakın araç (NV) yanıt verir; talep yoksa araç A'daki home base'e döner`, `Makine çıkış istasyonu ve A aynı anda bekliyorsa makine çıkışına öncelik verilir; birden fazla çıkışta STD uygulanır`, `Segmentte yüklü araç (full vehicle) önceliklidir`, `Rastgele araç seçilir (RV)`],
      answer: [0, 1, 2], explain: `AGV s.26: kural 1 NV + home base A, kural 2 makine çıkışı > A girişi ve STD, kural 3 full vehicle önceliği. RV kullanılmaz.` },
    { q: `A→a yolu 1,9 segmentlerinden geçer. Travel time (TrT) kaç dakikadır?`,
      options: [`1 dk`, `2 dk`, `4 dk`, `6 dk`],
      answer: 1, explain: `A 1. segmentin, a 9. segmentin ortasındadır: yarım 1 (1 dk) + yarım 9 (1 dk) = 2 dk. Formül: (2 − 1) × 2 = 2 (AGV s.27). 4 dk iki tam segment varsayımıdır, yanlıştır.` },
    { q: `a→A yolu 9,11,8,1 için TrT kaçtır?`,
      options: [`4 dk`, `6 dk`, `8 dk`, `10 dk`],
      answer: 1, explain: `Dört segment: (4 − 1) × 2 = 6 → yarım 9 (1) + 11 (2) + 8 (2) + yarım 1 (1) = 6 (AGV s.27–28).` },
    { q: `e→b yolu 6,7,11,12,3 (boş yolculuk) için TrT ve STT = 31 iken Comp nedir?`,
      options: [`TrT 8, Comp 39`, `TrT 10, Comp 41`, `TrT 8, Comp 41`, `TrT 6, Comp 37`],
      answer: 0, explain: `Beş segment: (5 − 1) × 2 = 8. Boş yolculukta Comp = STT + TrT = 31 + 8 = 39 (AGV s.27).` },
    { q: `Yüklü yolculuk A→a: STT 10, L/UL 2, TrT 2. Comp ve seyahatin segmentlerdeki zamanlaması nedir?`,
      options: [`Comp 12; seyir 10–12`, `Comp 16; seyir 12–14`, `Comp 14; seyir 11–13 (segment 1: 11–12, segment 9: 12–13)`, `Comp 14; seyir 10–12 (yükleme yok)`],
      answer: 2, explain: `Comp = STT + L/UL + TrT = 10 + 2 + 2 = 14. Yükleme 10–11, seyir STT + 1 = 11'de başlar, 13'te biter; 13–14 boşaltma (AGV s.27–28).` },
    { q: `Boş yolculuk için Comp formülü hangisidir ve L/UL neden yoktur?`,
      options: [`Comp = STT + L/UL + TrT; her yolculukta L/UL vardır`, `Comp = STT + 2 × TrT`, `Comp = STT + L/UL`, `Comp = STT + TrT; araç yük taşımadığı için yükleme/boşaltma yapılmaz`],
      answer: 3, explain: `AGV s.27–28: a→A (STT 14, TrT 6) → Comp 20; a→b (STT 19, TrT 4) → Comp 23. Boş yolculukta yükleme/boşaltma yoktur.` },
    { q: `CC 14'te V1 neden a'dan A'ya boş döner?`,
      options: [`Kural 3: full vehicle önceliği gereği`, `Kural 1: talep yoksa araç A'daki home base'e döner`, `M1 arızalı olduğu için`, `Araç bataryası bittiği için`],
      answer: 1, explain: `AGV s.26, kural 1: talep yoksa araç home base A'ya döner. a→A: yol 9,11,8,1, STT 14, TrT 6, Comp 20 (s.27).` },
    { q: `CC 15'te J2 geldiğinde A→a'yı neden Vehicle 2 yapar?`,
      options: [`V2 daha hızlıdır`, `J2 öncelikli iştir`, `V1 arızalıdır`, `V1, a'ya teslim edip A'ya dönüşte yoldadır (14–20); A'daki en yakın (müsait) araç V2'dir (NV)`],
      answer: 3, explain: `AGV s.27: V1 CC 14–20 arasında dönüş yolculuğundadır; A'da bekleyen V2 talebe en yakın araçtır (kural 1, NV). Satır 3: V2 A→a, STT 15, Comp 19.` },
    { q: `Machine Loading tablosu satır 2 (CC 14): M1'de JM = 1, ST = 14, PR = 5, CMP = ? Bu değer nasıl bulunur?`,
      options: [`CMP = 20; ST + PR + 1`, `CMP = 19; ST + PR = 14 + 5`, `CMP = 21; ST + PR + L/UL`, `CMP = 16; ST + 2`],
      answer: 1, explain: `AGV s.29: J1, a'ya 14'te (Comp 14) ulaşır ve M1'e girer; CMP = ST + PR = 14 + 5 = 19.` },
    { q: `CC 19'da M1 J1'i bitirir ve J2 aynı anda a'dan M1'e girer. J2 için M1 satırı (ST, PR, CMP) nedir ve J1 nereye gider?`,
      options: [`ST 19, PR 3, CMP 22; J1 M2'ye`, `ST 20, PR 6, CMP 26; J1 B'ye`, `ST 19, PR 6, CMP 25; J1 çıkış kuyruğu b'ye (JOQ b = 1)`, `ST 19, PR 6, CMP 25; J1 doğrudan e'ye`],
      answer: 2, explain: `AGV s.29: satır 4 JOQ b = 1 (J1 bitti), satır 5 J2: ST 19, PR 6 (J2'nin M1 süresi), CMP 25. J1'in sıradaki makinesi M3'tür ama önce b'den taşınmalıdır.` },
    { q: `CC 19'da b'deki J1'i almak için V2 (a'da) neden gider ve yolculuk nasıl hesaplanır?`,
      options: [`V1 gider; TrT 6, Comp 25`, `V2 gider; TrT 6, Comp 25`, `Kimse gitmez; J1 A'ya döner`, `V2 b'ye en yakın araçtır (NV); a→b yolu 9,12,3 → TrT = (3 − 1) × 2 = 4; boş yolculuk Comp = 19 + 4 = 23`],
      answer: 3, explain: `AGV s.27–28: a→b, yol 9,12,3, STT 19, TrT 4, Comp 23 (Path tablosu: seg 9: 19–20, seg 12: 20–22, seg 3: 22–23).` },
    { q: `CC 24'te J1 a'ya ulaşır ama M1 hâlâ J2'yi işlemektedir (CMP 25). Machine Loading tablosunda ne görülür?`,
      options: [`J1 hemen M1'e girer ve J2 kesilir`, `J1 A'ya geri gönderilir`, `JIQ a = 1: J1 giriş kuyruğunda bekler; CC 25'te M1'e girer (ST 25, PR 5, CMP 30)`, `J1 M3'e atlanır`],
      answer: 2, explain: `AGV s.29: satır 9 (CC 24) JIQ a = 1, JM = 2; satır 10 (CC 25) M1: J1 ST 25, PR 5, CMP 30 ve J2 JOQ b'ye geçer (JOQ b = 2).` },
    { q: `Path Loading tablosuna göre V2'nin e→b (STT 31, ENDT 39) yolculuğunda segment 11'e giriş-çıkış zamanları hangisidir?`,
      options: [`34 – 36`, `32 – 34`, `36 – 38`, `38 – 39`],
      answer: 0, explain: `Boş yolculuk STT'de başlar: seg 6 yarım 31–32, seg 7 tam 32–34, seg 11 34–36, seg 12 36–38, seg 3 yarım 38–39 (AGV s.28).` }
  ];

  /* ===================== Formül kartı: Bölüm 4 ===================== */
  IM.content.cheatsheet += `
    <h2>Bölüm 4 · AGV</h2>
    <h3>AGV sayısı (AGV s.14–17)</h3>
    <div class="model">U<sub>i</sub> = (2 · d<sub>i</sub> · f<sub>i</sub>) / v + f<sub>i</sub> · t<sub>i</sub> · 2        (dk / saat; d: m, f: sefer / saat, v: m/dk, t: L/UL dk)
Toplam gerekli süre = ΣU<sub>i</sub> / 0.85   (traffic congestion factor, 0.85 ile BÖL)
N = ⌈ Toplam gerekli süre / 60 ⌉</div>
    <table>
      <tr><td>Hücre 1 · 2 · 3 · 4</td><td><b>98 · 176 · 60 · 96</b> → toplam <b>430</b></td></tr>
      <tr><td>430 / 0.85</td><td><b>505.88</b> dk (slayt 505) → 505.88 / 60 = <b>8.43</b> → <b>9 AGV</b></td></tr>
      <tr><td>Hız v</td><td>60 m/dk (genelde 60 – 80 m/dk)</td></tr>
    </table>
    <h3>İşletim kuralları kısaltmaları (AGV s.20–22)</h3>
    <table>
      <tr><th>Karar</th><th>Kural</th><th>Kısaca</th></tr>
      <tr><td rowspan="4"><b>Dispatching</b> (hangi araç)</td><td>RV</td><td>rastgele araç</td></tr>
      <tr><td>NV</td><td>talep noktasına en yakın araç</td></tr>
      <tr><td>LIV</td><td>en uzun süre idle araç</td></tr>
      <tr><td>LUV</td><td>kullanımı en az araç (iş yükü eşitleme)</td></tr>
      <tr><td rowspan="4"><b>Station prioritizing</b> (hangi istasyon)</td><td>RW</td><td>rastgele istasyon</td></tr>
      <tr><td>STT/D</td><td>uygun araca en yakın (süre/mesafe) istasyon</td></tr>
      <tr><td>MOQS</td><td>çıkış stokunda en çok yük</td></tr>
      <tr><td>MROQS</td><td>çıkış stokunda en az kalan yer</td></tr>
      <tr><td rowspan="4"><b>Path selection</b> (segment çakışması)</td><td>RS</td><td>rastgele araç</td></tr>
      <tr><td>FV</td><td>yüklü araç önce (yüklüler arasında rastgele)</td></tr>
      <tr><td>CSR</td><td>kritik istasyona yanıt veren araç önce</td></tr>
      <tr><td>CP</td><td>kritik parça taşıyan araç önce</td></tr>
    </table>
    <h3>Simülasyon zamanlaması (AGV s.24–29)</h3>
    <div class="model">Segment = 2 dk · istasyon segment ORTASINDA · L/UL = 2 dk (1 yükleme + 1 boşaltma)
TrT = (segment sayısı − 1) × 2
Yüklü yolculuk: Comp = STT + L/UL + TrT  (seyir STT + 1'de başlar)     Boş yolculuk: Comp = STT + TrT
Örnek: A→a (1,9): STT 10 → TrT 2, seyir 11–13, Comp 14 · a→A (9,11,8,1): STT 14 → TrT 6, Comp 20
Kurallar: NV · iş yoksa A'ya dön · makine çıkışı &gt; A girişi (çıkışlar arası STD) · segmentte full vehicle önce</div>
    <p class="muted">AGV: 10 t klasik · 35 t hava filmi (0.003 inç) · towing 500 kg – 22.5 t · light load ≤ 250 kg · automated charging: 12 dk şarj = 1 saat çalışma.</p>
  `;
})();
