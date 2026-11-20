/* Bölüm 5 · CNC Tezgâhları — özetler, kavram soruları, formül/anahtar kart bölümü.
   Düz script (ES module yok), window.IM.content'e ekler.
   Kaynak: CNC_machine tools.pptx (CNC s.1–29). Görsel slaytlara (2, 4, 8–9, 11–12, 15–17, 19, 21, 24) görüntü olarak bakıldı:
   s.9'da potansiyometre formülü (Vo = d / L · Vi) görsel olarak verilmiştir; s.17'deki şekil etiketleri (X eksen servo motoru,
   Z eksen kızağı, bilyalı vida) ve s.21'deki panel markaları (Siemens, Fanuc, Mazatrol, Heidenhain) görselden okunmuştur. */
(function () {
  const IM = window.IM;

  /* ------------------------------------------------------------------ 5.1 */
  IM.content.summaries['5.1'] = `
<h2>5.1 CNC özellikleri, bileşenleri ve çalışma sistematiği</h2>
<p class="note">Ders notu: CNC Machine Tools s.1–16</p>

<p>Notlar iki tezgâh türünü örnekler: <b>CNC Lathe</b> (CNC torna) ve <b>CNC Machining Center</b> (CNC işleme merkezi) (s.2, görsel). Bu iki tezgâhın en önemli farkı, takımların saklandığı ünitedir: tornada <b>turret</b>, işleme merkezinde <b>magazine</b>.</p>

<h3>Özellikler (s.3)</h3>
<ul>
  <li><b>Shorter setup times</b> — daha kısa hazırlık süreleri</li>
  <li><b>Quality standardization</b> — kalitenin standartlaşması</li>
  <li><b>Less tool holding</b> — slayttaki ifade aynen korunmuştur (daha az takım bağlama/tutma gereksinimi)</li>
  <li><b>Sensitive to working conditions</b> — çalışma koşullarına duyarlı</li>
  <li><b>Skilled operators (needs programming)</b> — programlama bilen, nitelikli operatör gerekir</li>
  <li><b>Safer</b> — daha güvenli</li>
</ul>

<h3>CNC tezgâhında işlemler (s.4, görsel)</h3>
<table>
  <tr><th>Grup</th><th>Faaliyetler</th><th>Kim yapar?</th></tr>
  <tr><td><b>Setup activities</b></td><td>Program üretme ve yükleme · iş parçası bağlama (workpiece holding) · takım bağlama (tool holding) · referans noktalarını belirleme</td><td>Operatör <b>veya</b> otomatik</td></tr>
  <tr><td><b>Processing workpiece</b></td><td>İş parçası ve kesici takımın hareketi · kalite kontrol</td><td><b>Operatör yok</b></td></tr>
</table>

<h3>Bileşenler (s.5)</h3>
<p>Control panel (buton, ekran) · <b>control unit</b> (programı 0–1'e çevirir) · her eksen için <b>servo motor</b> · her eksen için <b>sensör</b> · memory · <b>tool storage unit</b> (CNC tornada turret, CNC işleme merkezinde magazine).</p>

<h3>Çalışma sistematiği (s.6)</h3>
<div class="model">PROGRAM  (control panel'den yüklenir)
   │
   ▼
CONTROL UNIT ── geometrik / teknolojik bilgiyi AYIRIR
   │            her eksen için GEREKLİ konum ve hızı belirler
   ▼
COMPARATOR (control unit'in bir elemanı) ◄── GÜNCEL konum ve hız (SENSÖRLER)
   │
   │ gerekli ≠ güncel ise sinyal üretilir
   ▼
SERVO MOTOR (ilgili eksenin) ──► slide / spindle ──► kesici takım veya iş parçası hareket eder
   ▲                                                         │
   └──────────── sensörler yeni konum/hızı ölçer ◄───────────┘</div>

<h3>Sensörler (s.7–9, 13)</h3>
<p>Sensör, fiziksel değişimleri elektrik sinyaline çevirir. Notlardaki türler: heat, pressure, optic, voice, speed, position sensors.</p>
<ul>
  <li><b>Hız:</b> <b>Tachometer</b> — motor milinin açısal hızıyla orantılı gerilim üretir (s.8).</li>
  <li><b>Konum:</b> <b>Potentiometer</b> — konum değişimiyle orantılı gerilim üretir; s.9 görselinde V<sub>o</sub> = (d / L) · V<sub>i</sub> (d: kayan temas noktasının konumu, L: toplam uzunluk). Sayısal örnek notlarda yok: V<sub>i</sub> = 10 V, L = 100 mm, d = 40 mm için V<sub>o</sub> = 4 V.</li>
  <li>s.13: konum, ilerleme (feed) değeri ve kesme hızı ölçülür. Konum ölçümü <b>direct</b> (sensör <b>slide</b> üzerinde) veya <b>indirect</b> (sensör bilyalı vida / mil üzerinde) olabilir; dijital veya analog olabilir. Hız ölçümü için <b>tachometer</b>, konum ölçümü için <b>encoder</b> anılır.</li>
</ul>

<h3>Güç üniteleri ve servo motorlar (s.10–12)</h3>
<ul>
  <li><b>Main motor → spindle</b>, <b>feed motors → slides</b>, <b>supportive motors</b> → kesme sıvısı vb. Ana ve ilerleme motorları <b>servo motor</b>dur.</li>
  <li>Servo motor programlanabilir; mil konumu kodlara göre değiştirilebilir. Hız, konum değişimi, çok eksenli hareket, ölçme ve bilgisayar destekli imalat (robotlar, CNC tezgâhlar) için kullanılır (s.11).</li>
  <li>Çalışma mekanizması (s.12): mile bağlı manyetik dönen kısım = <b>rotor</b>; sargılı sabit kısım = <b>stator</b>.</li>
</ul>

<h3>Gövde, hareket iletimi, yataklar ve kızaklar (s.14–16)</h3>
<ul>
  <li><b>Main body = bed + column</b> (s.14).</li>
  <li><b>Motion transmission elements:</b> gears, clutch, coupler (s.15; slaytta bilyalı vida örnekleri görülür).</li>
  <li><b>Bearings and slides:</b> yataklar kızakların doğrusal hareketini sağlar ve destekler. Sürtünme → <b>aşınma</b>, <b>enerji kaybı</b>, <b>sıcaklık artışı</b>. Yağlama: <b>hydrostatic fluid lubrication</b> (s.16).</li>
</ul>

<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
  <li><b>Turret</b> = CNC <b>torna</b>nın takım ünitesi; <b>magazine</b> = <b>işleme merkezi</b>nin takım ünitesi. Karıştırma.</li>
  <li><b>Tachometer = hız</b>; <b>potentiometer / encoder = konum</b>. Hız ölçerek konum, konum ölçerek hız verildi sanma.</li>
  <li><b>Direct</b> ölçümde sensör <b>slide</b> üzerindedir; <b>indirect</b> ölçümde bilyalı vida/mil üzerindedir.</li>
  <li><b>Comparator</b> sensör ya da servo motor değil, <b>control unit'in bir elemanı</b>dır; gerekli ve güncel değeri kıyaslar.</li>
  <li><b>Setup</b> faaliyetleri operatör <b>veya</b> otomatik yapılır; <b>processing</b> (işleme) operatörsüzdür. Kalite kontrol processing grubundadır, setup değildir.</li>
  <li><b>Main motor</b> spindle'ı, <b>feed motors</b> slide'ları döndürür; ters eşleştirme.</li>
  <li><b>Rotor</b> = dönen manyetik kısım; <b>stator</b> = sargılı sabit kısım.</li>
  <li>Tezgâh <b>çalışma koşullarına duyarlıdır</b> ve nitelikli, programlama bilen operatör gerektirir; "duyarsız" veya "programlama gerekmez" yanlıştır.</li>
</ul></div>
`;

  IM.content.concepts['5.1'] = [
    {
      q: 'CNC Machine Tools slaytında <b>özellik (features)</b> olarak sayılanlar hangileridir?',
      options: [
        'Shorter setup times (daha kısa hazırlık süreleri)',
        'Quality standardization',
        'Safer (daha güvenli)',
        'Çalışma koşullarına duyarsızdır',
        'Operatörün programlama bilmesi gerekmez',
        'Daha uzun hazırlık süreleri'
      ],
      answer: [0, 1, 2],
      explain: 'CNC s.3: shorter setup times, quality standardization, less tool holding, sensitive to working conditions, skilled operators (needs programming), safer. "Duyarsız" ve "programlama gerekmez" ifadeleri notlarla çelişir.',
      hint: 'Slayttaki altı maddeyi hatırla; sensitive ve needs programming ifadelerine dikkat.'
    },
    {
      q: 'Aşağıdakilerden hangileri CNC tezgâhında <b>setup activities</b> grubuna girer?',
      options: [
        'Program üretme ve yükleme',
        'İş parçası bağlama (workpiece holding)',
        'Takım bağlama (tool holding)',
        'Referans noktalarını belirleme',
        'Kalite kontrol',
        'İş parçası ve kesici takımın hareketi'
      ],
      answer: [0, 1, 2, 3],
      explain: 'CNC s.4: setup = programı üretip yükleme, workpiece holding, tool holding, referans noktalarını belirleme. Kalite kontrol ve takım/iş parçası hareketi "processing workpiece" grubundadır.'
    },
    {
      q: 'CNC s.4\'e göre faaliyet gruplarını kimin yürüttüğü hangi seçenekte doğru verilmiştir?',
      options: [
        'Processing: operatör gerekmez · Setup: operatör veya otomatik',
        'Processing: her zaman operatör · Setup: yalnızca otomatik',
        'Processing: operatör veya otomatik · Setup: operatör gerekmez',
        'Her iki grup da yalnızca operatör tarafından yapılır'
      ],
      answer: 0,
      explain: 'CNC s.4: "Processing activities → No operators; Setup activities → Operator or automatic." Hazırlık yapılırken operatör olabilir; işleme sırasında operatör yoktur.'
    },
    {
      q: 'Notlardaki bileşen listesinde (s.5) <b>yer alanlar</b> hangileridir?',
      options: [
        'Her eksen için servo motor',
        'Her eksen için sensör',
        'Memory',
        'Control panel ve control unit',
        'Her eksen için el çarkı (handwheel)',
        'Operatör kontrollü takım değiştirici'
      ],
      answer: [0, 1, 2, 3],
      explain: 'CNC s.5: control panel, control units, her eksen için servo motor ve sensör, memory, tool storage unit. El çarkı ve operatör kontrollü takım değiştirici listede yoktur.'
    },
    {
      q: 'Takım depolama ünitesi için doğru eşleştirme hangisidir?',
      options: [
        'CNC torna → turret · CNC işleme merkezi → magazine',
        'CNC torna → magazine · CNC işleme merkezi → turret',
        'Her ikisi de turret kullanır',
        'Her ikisi de magazine kullanır'
      ],
      answer: 0,
      explain: 'CNC s.5: "Tool Storage Unit (turret for CNC lathe, magazine for CNC Machining Center)". Turret torna içindir (s.19\'da da turret görülür).'
    },
    {
      q: '<b>Control unit</b>\'in notlardaki temel görevi nedir?',
      options: [
        'Programı 0–1 (ikili) sinyallere dönüştürmek',
        'Hareket sırasında iş parçasını bağlamak',
        'Kesme sıvısını pompalamak',
        'Mil konumunu doğrudan ölçmek'
      ],
      answer: 0,
      explain: 'CNC s.5: "Control units (transforming program into 0-1)". Konum/hız ölçümü sensörlerin, hareket üretimi servo motorların işidir.'
    },
    {
      q: 'CNC çalışma sistematiğinde (s.6) adımların <b>doğru sırası</b> hangisidir?',
      options: [
        'Program yüklenir → geometrik/teknolojik bilgi ayrılır → gerekli konum ve hız belirlenir → sensörler güncel konum/hızı ölçer → comparator kıyaslar → fark varsa servo motora sinyal gider',
        'Program yüklenir → sensörler güncel konumu ölçer → servo motor hareket eder → control unit gerekli konumu belirler → comparator kıyaslar',
        'Comparator kıyaslar → program yüklenir → sensörler ölçer → servo motor hareket eder',
        'Servo motor hareket eder → program yüklenir → control unit bilgiyi ayırır → comparator kıyaslar'
      ],
      answer: 0,
      explain: 'CNC s.6: program control panel\'den yüklenir; control unit geometrik–teknolojik bilgiyi ayırır ve eksen başına gerekli konum/hızı belirler; sensörler güncel değeri ölçer; comparator kıyaslar; fark varsa ilgili eksenin servo motoruna sinyal gönderilir.',
      hint: 'Önce "gerekli", sonra "güncel", sonra kıyas, sonra düzeltme sinyali.'
    },
    {
      q: '<b>Comparator</b> nedir ve ne yapar?',
      options: [
        'Control unit içindeki bir elemandır; gerekli ve güncel konum/hızı kıyaslar',
        'Eksenin sonuna takılan bir sensördür; konumu doğrudan ölçer',
        'Servo motorun sargılı sabit kısmıdır',
        'Takımları saklayan ünitedir'
      ],
      answer: 0,
      explain: 'CNC s.6: "Comparison between current and required position is made by comparator (an element in control unit)". Sensör değil, control unit\'in parçasıdır.'
    },
    {
      q: 'Control unit, program okunduktan sonra ilk olarak hangi ayırmayı yapar?',
      options: [
        'Geometrik ve teknolojik bilgiyi ayırır',
        'Rotor ve stator bilgisini ayırır',
        'Setup ve processing faaliyetlerini ayırır',
        'Direct ve indirect ölçümü ayırır'
      ],
      answer: 0,
      explain: 'CNC s.6: "Separation for geometric-technologic information is made by control unit". Ardından eksen başına gerekli konum ve hız belirlenir.'
    },
    {
      q: 'Hangi sensör <b>hız</b>, hangisi <b>konum</b> ölçer? (s.8, 9, 13)',
      options: [
        'Tachometer → hız · potentiometer ve encoder → konum',
        'Tachometer → konum · potentiometer → hız',
        'Encoder → hız · tachometer → konum',
        'Üçü de yalnızca konum ölçer'
      ],
      answer: 0,
      explain: 'CNC s.8: tachometer motor milinin açısal hızıyla orantılı gerilim üretir. s.9: potentiometer konum değişimiyle orantılı gerilim üretir. s.13: "Tachometers for speed measurement, Encoder for position measurement".'
    },
    {
      q: 'Potansiyometre gerilimi V<sub>o</sub> = (d / L) · V<sub>i</sub> ile verilir (s.9). V<sub>i</sub> = 10 V, L = 100 mm, d = 40 mm ise V<sub>o</sub> kaç volttur? <span class="muted">(sayısal örnek notlarda yok; formül CNC s.9)</span>',
      options: ['4 V', '0.40 V', '25 V', '2.50 V'],
      answer: 0,
      explain: 'V<sub>o</sub> = (40 / 100) · 10 = 0.40 · 10 = 4 V. Çıkış gerilimi, kayan temasın konumuyla (d) doğru orantılıdır; bu yüzden konum sensörüdür.'
    },
    {
      q: 'CNC güç ünitelerinde (s.10) <b>doğru</b> eşleştirmeler hangileridir?',
      options: [
        'Main motor → spindle hareketi',
        'Feed motors → slide hareketi',
        'Supportive motors → kesme sıvısı vb.',
        'Ana ve ilerleme motorları için servo motor kullanılır',
        'Main motor → slide hareketi',
        'Feed motors → spindle hareketi'
      ],
      answer: [0, 1, 2, 3],
      explain: 'CNC s.10: "Main motor gives motion to spindle; Feed motors gives motion to slides; Supportive motors for cutting fluids etc.; Servo motors for main and feed motors." Son iki seçenek ters eşleştirmedir.'
    },
    {
      q: 'Servo motorun çalışma mekanizmasında <b>rotor</b> ve <b>stator</b> için doğru tanım hangisidir? (s.12)',
      options: [
        'Rotor: mile bağlı manyetik dönen kısım · Stator: sargılı sabit kısım',
        'Rotor: sargılı sabit kısım · Stator: mile bağlı dönen kısım',
        'Rotor: sensör · Stator: comparator',
        'Rotor: kızak · Stator: yatak'
      ],
      answer: 0,
      explain: 'CNC s.12: "Magnetic Rotational section linked to shaft (rotor); Constant part with winding (stator)".'
    },
    {
      q: 'Konum ölçümünde <b>direct</b> ve <b>indirect</b> ölçüm nasıl ayrılır? (s.13)',
      options: [
        'Direct: sensör slide üzerinde · Indirect: sensör bilyalı vida (mil) üzerinde',
        'Direct: sensör bilyalı vida üzerinde · Indirect: sensör slide üzerinde',
        'Direct: yalnızca hız ölçümü · Indirect: yalnızca konum ölçümü',
        'Direct: analog sensör · Indirect: dijital sensör'
      ],
      answer: 0,
      explain: 'CNC s.13: "Direct measurement: Sensor on slide; Indirect measurement: Sensor on bolt with ball bearing". Analog/dijital ayrı bir sınıflandırmadır (konum ölçümü dijital veya analog olabilir).'
    },
    {
      q: 'Hangi ifadeler <b>bearings and slides</b> (s.16) ve <b>gövde/hareket iletimi</b> (s.14–15) bilgisiyle uyumludur?',
      options: [
        'Main body = bed + column',
        'Hareket iletim elemanları: gears, clutch, coupler',
        'Sürtünme aşınmaya, enerji kaybına ve sıcaklık artışına yol açar',
        'Yağlama için hydrostatic fluid lubrication anılır',
        'Main body = turret + magazine',
        'Sürtünme yalnızca kalite standardizasyonunu artırır'
      ],
      answer: [0, 1, 2, 3],
      explain: 'CNC s.14: main body bed + column. s.15: gears, clutch, coupler. s.16: bearings kızakların doğrusal hareketini sağlar/destekler; sürtünme → wears, loss of energy, increase in temperature; lubrication: hydrostatic fluid lubrication.'
    }
  ];

  /* ------------------------------------------------------------------ 5.2 */
  IM.content.summaries['5.2'] = `
<h2>5.2 CNC torna, kontrol ünitesi ve tezgâh seçim kriterleri</h2>
<p class="note">Ders notu: CNC Machine Tools s.17–29</p>

<h3>CNC Lathe (s.17–19)</h3>
<p>s.17'deki şekil, tornanın eksenlerini gösterir: <b>X eksen servo motoru</b>, <b>Z eksen servo motoru</b>, <b>Z eksen kızağı</b> ve <b>bilyalı vida</b> (görsel). Yani her eksen kendi servo motoruyla ve bilyalı vida ile kızağı sürer.</p>
<ul>
  <li><b>Bileşenler (s.18):</b> main motor · spindle · hydraulic chuck · center.</li>
  <li><b>Turret (s.19):</b> takımlar turret'e bağlanır. Turret CNC tornanın takım tutucusudur; işleme merkezindeki karşılığı <b>magazine</b>'dir (s.5).</li>
</ul>

<h3>Control unit ve control panel (s.20–22)</h3>
<table>
  <tr><th></th><th>Görev</th></tr>
  <tr><td><b>Control panel</b></td><td>Operatör için arayüz (ekran, butonlar) · emergency stop, veri girişi, program çağırma vb. · <b>simülasyon görünümü</b> izlenebilir</td></tr>
  <tr><td><b>Control unit</b></td><td>Programı motorlara giden <b>elektrik sinyallerine</b> çevirir</td></tr>
</table>
<p>s.21'de dört kontrol paneli örneği görülür: <b>Siemens, Fanuc, Mazatrol, Heidenhain</b> (görsel).</p>
<p><b>Kontrol ünitesi/paneli seçim kriterleri (s.22):</b> işlenen ürünlerin geometrik karmaşıklığı · CAM yazılımlarıyla uyum · sektördeki kullanıcı sayısı · kullanım kolaylığı.</p>

<h3>CNC tezgâh seçimi (s.23–29)</h3>
<p>Yatırıma uygunluk (s.23): <b>tolerances, production speed, cost, number of operations</b>. Numaralı seçim kriterleri:</p>
<div class="model">1.  Sizes of products      ürün çeşidinin %85'i · detaylı analiz · kalan %15 için yatırım maliyeti / gelir
2.  Mechanic structure     güç, tezgâh boyutu, yatak ve kızak (işleme operasyonlarına göre)
3.  Control unit           tezgâhın beyni: memory, işlem hızı, CAM yazılımı uyumu
4.  Life of CNC machine    kendini amorti edip yeni yatırımlara fırsat vermeli
5.  Technology             yeni teknolojilere uyum, genişletmeye uygunluk
6.  User-friendliness      control panel, tool holding vb.
7.  Flexibility            ürün çeşitliliği, eksen sayısı, turret/magazine kapasitesi
8.  Reliability            işleme kalitesinin sürekliliği (tolerans vb.)
9.  Safety                 yangın söndürme, güvenlik kapısı, toz-duman emiş (vakum)
10. After sale service     bakım-arıza, eğitim, yedek parça temini
11. Cost                   satın alma + bakım + güncelleme maliyeti</div>

<ul>
  <li><b>1. Sizes of products (s.24):</b> ayrıntılı analiz; ürün çeşidinin <b>%85</b>'ini karşılayacak tezgâh boyutu seçilir; kalan <b>%15</b> için yatırım maliyeti, getirisiyle karşılaştırılır.</li>
  <li><b>2. Mechanic structure (s.25):</b> işleme operasyonlarına göre güç, boyut, yatak ve kızaklar; <b>Turcite B kaplı kutu tipi kızaklar</b> eksantrik veya gevrek malzemeler için.</li>
  <li><b>3. Control unit (s.26):</b> tezgâhın beyni. <b>Fanuc</b> Türkiye'de en sık kullanılan marka. Küresel yüzeyler için Oi-TC, 21-IT, 18-IT, 16-IT (slayttaki yazımıyla); işleme merkezlerinde karmaşık operasyonlar için <b>AICC</b> veya <b>AI NANO</b> kontrollü (look ahead fonksiyonlu) 21i-MB, 18i-MB, 16i-MB; normal işleme operasyonları için <b>Fanuc Oi-Mate</b>.</li>
  <li><b>4–6 (s.27):</b> Life · Technology · User-friendliness.</li>
  <li><b>7–9 (s.28):</b> Flexibility · Reliability · Safety.</li>
  <li><b>10–11 (s.29):</b> After sale service (bakım ve arızalar, eğitim, yedek parça) · Cost (satın alma, bakım, güncelleme).</li>
</ul>

<div class="warnbox"><b>Sınav tuzakları</b>
<ul>
  <li><b>Turret</b> (torna) ≠ <b>magazine</b> (işleme merkezi). Seçim kriteri 7'de "turret <b>veya</b> magazine kapasitesi" birlikte geçer.</li>
  <li><b>Control panel</b> operatör arayüzüdür (emergency stop, veri girişi, simülasyon); <b>control unit</b> programı elektrik sinyaline çevirir.</li>
  <li><b>1. kriter:</b> %85 ürün çeşidi tezgâhın kapsayacağı kısım, <b>%15</b> ise yatırım maliyeti–gelir karşılaştırmasına konu olan kısımdır; sayıları ters yazma.</li>
  <li><b>Bakım</b> iki yerde geçer: 10. kriterde bakım <b>servisi</b> (maintenance and breakdowns), 11. kriterde bakım <b>maliyeti</b>.</li>
  <li>Kriter <b>numaralarını</b> koru: 4 Life, 5 Technology, 6 User-friendliness, 7 Flexibility, 8 Reliability, 9 Safety, 10 After sale service, 11 Cost.</li>
  <li><b>Fanuc</b> notlarda "Türkiye'de en sık kullanılan" kontrol ünitesidir; AICC/AI NANO + look ahead işleme merkezi karmaşık operasyonları içindir, Oi-Mate normal işleme içindir.</li>
  <li>Kontrol ünitesi seçim kriterleri (s.22, dört madde) ile tezgâh seçim kriterleri (s.24–29, on bir madde) farklı listelerdir.</li>
</ul></div>
`;

  IM.content.concepts['5.2'] = [
    {
      q: 'CNC tornanın bileşenleri olarak s.18\'de <b>sayılanlar</b> hangileridir?',
      options: [
        'Main motor',
        'Spindle',
        'Hydraulic chuck',
        'Center',
        'Tool magazine',
        'Pallet shuttle'
      ],
      answer: [0, 1, 2, 3],
      explain: 'CNC s.18: Main Motor, Spindle, Hydraulic chuck, Center. Magazine işleme merkezinin takım ünitesidir; pallet shuttle notlarda geçmez.'
    },
    {
      q: 'CNC tornada takımlar nerede tutulur ve işleme merkezindeki karşılığı nedir?',
      options: [
        'Turret · işleme merkezinde magazine',
        'Magazine · işleme merkezinde turret',
        'Hydraulic chuck · işleme merkezinde spindle',
        'Center · işleme merkezinde column'
      ],
      answer: 0,
      explain: 'CNC s.19: "Tools are hold to turret". s.5: turret for CNC lathe, magazine for CNC Machining Center.'
    },
    {
      q: 'CNC s.17 şekline göre torna eksenlerini ileten düzenek hangisidir?',
      options: [
        'Her eksenin kendi servo motoru vardır; hareket bilyalı vida ile kızağa iletilir (X eksen ve Z eksen servo motoru, Z eksen kızağı)',
        'Tüm eksenler tek bir main motor ile sürülür',
        'Eksenler yalnızca elle (el çarkı) hareket ettirilir',
        'Şekilde yalnızca tachometer gösterilir'
      ],
      answer: 0,
      explain: 'CNC s.17 (görsel): X eksen servo motoru, Z eksen servo motoru, Z eksen kızağı ve bilyalı vida etiketleri görülür. Servo motor/sensör her eksen içindir (s.5).'
    },
    {
      q: '<b>Control panel</b> ile <b>control unit</b> arasındaki fark nedir?',
      options: [
        'Panel operatör arayüzüdür (ekran, butonlar); control unit programı motorlara giden elektrik sinyallerine çevirir',
        'Panel programı elektrik sinyaline çevirir; control unit ekran ve butonlardan oluşur',
        'İkisi aynı şeydir',
        'Panel servo motoru, control unit ise sensörü ifade eder'
      ],
      answer: 0,
      explain: 'CNC s.20: control panel = operatörler için arayüz; control unit = Program → electric signals to motors.'
    },
    {
      q: 'Control panel\'in notlarda sayılan işlevleri hangileridir? (s.20)',
      options: [
        'Operatör arayüzü (ekran, butonlar)',
        'Emergency stop, veri girişi, program çağırma',
        'Simülasyon görünümünün izlenmesi',
        'Bilyalı vidayı yağlamak',
        'Kesici takımı fiziksel olarak değiştirmek'
      ],
      answer: [0, 1, 2],
      explain: 'CNC s.20: "Provide interface for operators (screen, buttons); Emergency stop, data entry, program call etc.; Simulation view can be seen". Yağlama ve takım değiştirme panelin işlevi olarak verilmemiştir.'
    },
    {
      q: 'S.21\'de kontrol paneli örneği olarak gösterilen markalar hangileridir?',
      options: [
        'Siemens',
        'Fanuc',
        'Mazatrol',
        'Heidenhain',
        'Haas',
        'Okuma'
      ],
      answer: [0, 1, 2, 3],
      explain: 'CNC s.21 (görsel): Siemens, Fanuc, Mazatrol ve Heidenhain kontrol panelleri. Haas ve Okuma bu slaytta yoktur.'
    },
    {
      q: 'Kontrol ünitesi/paneli <b>seçim kriterleri</b> (s.22) hangileridir?',
      options: [
        'İşlenen ürünlerin geometrik karmaşıklığı',
        'CAM yazılımlarıyla uyum',
        'Sektördeki kullanıcı sayısı',
        'Kullanım kolaylığı',
        'Kızakların yağlama türü',
        'Turret istasyon sayısı'
      ],
      answer: [0, 1, 2, 3],
      explain: 'CNC s.22: geometrical complexity, conformance with CAM softwares, number of users in the sector, user friendliness. Kızak yağlaması ve turret istasyon sayısı bu listede yoktur.'
    },
    {
      q: 'Tezgâh seçiminde <b>yatırıma uygunluk</b> (s.23) başlığı altında anılan öğeler hangileridir?',
      options: [
        'Tolerances, production speed, cost, number of operations',
        'Tolerances, safety gate, training, spare parts',
        'Number of axes, turret capacity, fire extinguishing, vacuum',
        'Rotor, stator, tachometer, comparator'
      ],
      answer: 0,
      explain: 'CNC s.23: "Convenience in investment — Tolerances, Production speed, Cost, Number of operations".'
    },
    {
      q: '<b>1. Sizes of Products</b> kriteri için notlarda hangi sayılar verilir? (s.24)',
      options: [
        'Ürün çeşidinin %85\'i; kalan %15 için yatırım maliyeti ile gelir karşılaştırması',
        'Ürün çeşidinin %15\'i; kalan %85 için yatırım maliyeti ile gelir karşılaştırması',
        'Ürün çeşidinin %50\'si; kalan %50 için amortisman',
        'Ürün çeşidinin tamamı (%100); karşılaştırma gerekmez'
      ],
      answer: 0,
      explain: 'CNC s.24: "A detailed analysis; %85 of overall product variety; Investment cost versus income of %15".',
      hint: 'Tezgâh ürün çeşidinin çoğunluğunu kapsayacak şekilde seçilir.'
    },
    {
      q: '<b>2. Mechanic Structure</b> kriterinde eksantrik veya gevrek malzemeler için ne önerilir? (s.25)',
      options: [
        'Turcite B kaplı kutu tipi kızaklar',
        'Hydraulic chuck',
        'Look ahead fonksiyonlu kontrol ünitesi',
        'Güvenlik kapısı'
      ],
      answer: 0,
      explain: 'CNC s.25: "Turcite B coated box type slides for eccentric or brittle materials". Mekanik yapı; işleme operasyonlarına göre güç, tezgâh boyutu, yatak ve kızakları kapsar.'
    },
    {
      q: '<b>3. Control Unit</b> kriterinde Fanuc örneklerinin eşleştirmesi hangisidir? (s.26)',
      options: [
        'Normal işleme → Oi-Mate · karmaşık işleme merkezi operasyonları → AICC / AI NANO (look ahead) 21i-MB, 18i-MB, 16i-MB · Fanuc Türkiye\'de en sık kullanılan',
        'Normal işleme → AI NANO · karmaşık operasyonlar → Oi-Mate',
        'Fanuc Türkiye\'de nadir kullanılır; Siemens en yaygındır',
        'Look ahead fonksiyonu yalnızca Oi-Mate\'te bulunur'
      ],
      answer: 0,
      explain: 'CNC s.26: kontrol ünitesi tezgâhın beynidir (memory, işlem hızı, CAM uyumu). Fanuc en sık kullanılan; küresel yüzeyler için Oi-TC, 21-IT, 18-IT, 16-IT; işleme merkezinde karmaşık operasyonlar için AICC veya AI NANO (look ahead) 21i-MB, 18i-MB, 16i-MB; normal işleme için Fanuc Oi-Mate.'
    },
    {
      q: 'Kriter numaraları ve adları hangi seçenekte <b>doğru</b> eşleşmiştir?',
      options: [
        '4 Life · 5 Technology · 6 User-friendliness · 7 Flexibility · 8 Reliability · 9 Safety',
        '4 Technology · 5 Life · 6 Flexibility · 7 User-friendliness · 8 Safety · 9 Reliability',
        '4 Safety · 5 Reliability · 6 Flexibility · 7 User-friendliness · 8 Technology · 9 Life',
        '4 Cost · 5 After sale service · 6 Life · 7 Technology · 8 Flexibility · 9 Reliability'
      ],
      answer: 0,
      explain: 'CNC s.27–28: 4 Life of CNC Machine Tool, 5 Technology, 6 User-friendliness, 7 Flexibility, 8 Reliability, 9 Safety. s.29: 10 After sale service, 11 Cost.'
    },
    {
      q: '<b>7. Flexibility</b> kriterinin alt maddeleri hangileridir? (s.28)',
      options: [
        'Ürün çeşitliliği',
        'Eksen sayısı',
        'Turret veya magazine kapasitesi',
        'Güvenlik kapısı',
        'Yedek parça temini'
      ],
      answer: [0, 1, 2],
      explain: 'CNC s.28: Flexibility = product variety, number of axes, capacity of turret or magazine. Güvenlik kapısı 9. kriterde (Safety), yedek parça 10. kriterde (After sale service) yer alır.'
    },
    {
      q: '<b>9. Safety</b> kriterinin alt maddeleri hangileridir? (s.28)',
      options: [
        'Yangın söndürme (fire extinguishing)',
        'Güvenlik kapısı (safety gate)',
        'Toz ve duman uzaklaştırma sistemi (vakum özelliği)',
        'Eğitim (training)',
        'Güncelleme maliyeti'
      ],
      answer: [0, 1, 2],
      explain: 'CNC s.28: Safety = fire extinguishing, safety gate, dust and smoke removal system (vacuum property). Eğitim 10. kriterde, güncelleme maliyeti 11. kriterdedir.'
    },
    {
      q: '<b>Bakım</b> kavramı hangi iki kriterde geçer ve ayrım nedir? (s.29)',
      options: [
        '10. After sale service: bakım ve arıza hizmeti · 11. Cost: bakım maliyeti',
        '10. After sale service: bakım maliyeti · 11. Cost: bakım ve arıza hizmeti',
        '8. Reliability: bakım maliyeti · 9. Safety: bakım hizmeti',
        'Bakım notlarda hiçbir kriterde geçmez'
      ],
      answer: 0,
      explain: 'CNC s.29: After sale service = maintenance and breakdowns, training, spare parts supply. Cost = purchasing cost, maintenance cost, updating cost.'
    },
    {
      q: '<b>4. Life</b>, <b>5. Technology</b> ve <b>8. Reliability</b> kriterleri için notlardaki ifadeler hangi seçenekte doğru verilmiştir?',
      options: [
        'Life: kendini amorti edip yeni yatırımlara fırsat vermeli · Technology: yeni teknolojilere uyum ve genişletmeye uygunluk · Reliability: işleme kalitesinin sürekliliği (tolerans vb.)',
        'Life: en düşük satın alma bedeli · Technology: yalnızca kullanım kolaylığı · Reliability: yalnızca yedek parça temini',
        'Life: operatörsüz çalışma · Technology: turret kapasitesi · Reliability: toz emiş sistemi',
        'Life: ürün çeşidinin %85\'i · Technology: Turcite B kızak · Reliability: Fanuc Oi-Mate'
      ],
      answer: 0,
      explain: 'CNC s.27: Life = amortize itself and provide opportunities for new investments; Technology = accordance with new technologies and appropriate for extension. s.28: Reliability = continuity for processing quality (tolerances etc.).'
    }
  ];

  /* --------------------------------------------------------------- cheatsheet */
  IM.content.cheatsheet += `
<h2>Bölüm 5 · CNC Tezgâhları</h2>
<table>
  <tr><td><b>Özellikler (s.3)</b></td><td>shorter setup · quality standardization · less tool holding · sensitive to working conditions · skilled operators (programming) · safer</td></tr>
  <tr><td><b>Setup (s.4)</b></td><td>program üret/yükle · workpiece holding · tool holding · referans noktaları — operatör <b>veya</b> otomatik</td></tr>
  <tr><td><b>Processing (s.4)</b></td><td>takım/iş parçası hareketi · kalite kontrol — <b>operatörsüz</b></td></tr>
  <tr><td><b>Bileşenler (s.5)</b></td><td>control panel · control unit (program → 0–1) · her eksen: servo motor + sensör · memory · tool storage (turret = torna, magazine = işleme merkezi)</td></tr>
  <tr><td><b>Sensörler</b></td><td>tachometer = hız · potentiometer / encoder = konum · direct (slide üzerinde) · indirect (bilyalı vida üzerinde)</td></tr>
  <tr><td><b>Güç (s.10–12)</b></td><td>main motor → spindle · feed motors → slides · supportive → kesme sıvısı · servo: rotor (dönen) + stator (sargılı)</td></tr>
  <tr><td><b>Gövde/yatak (s.14–16)</b></td><td>bed + column · gears, clutch, coupler · sürtünme: aşınma, enerji kaybı, ısınma · hydrostatic fluid lubrication</td></tr>
  <tr><td><b>CNC torna (s.18–19)</b></td><td>main motor · spindle · hydraulic chuck · center · turret</td></tr>
  <tr><td><b>Panel / unit (s.20–22)</b></td><td>panel = arayüz, emergency stop, veri girişi, program çağırma, simülasyon · unit = program → elektrik sinyali · seçim: geometrik karmaşıklık, CAM uyumu, kullanıcı sayısı, kullanım kolaylığı</td></tr>
</table>
<div class="model">Çalışma sistematiği:
program → control unit (geom./tekn. ayır; gerekli konum/hız)
        → comparator ◄ güncel konum/hız (sensör)
        → fark varsa sinyal → servo motor (eksen)
Potansiyometre (s.9):  Vo = (d / L) · Vi</div>
<table>
  <tr><th colspan="2">Tezgâh seçim kriterleri (s.23–29)</th></tr>
  <tr><td>1 Sizes of products</td><td>ürün çeşidinin %85'i; kalan %15: yatırım maliyeti ve gelir</td></tr>
  <tr><td>2 Mechanic structure</td><td>güç, boyut, yatak/kızak · Turcite B kaplı kutu tipi kızak (eksantrik/gevrek)</td></tr>
  <tr><td>3 Control unit</td><td>tezgâhın beyni · Fanuc (Türkiye'de en yaygın) · karmaşık: AICC / AI NANO (look ahead) · normal: Oi-Mate</td></tr>
  <tr><td>4 Life · 5 Technology · 6 User-friendliness</td><td>amortisman ve yeni yatırım · yeni teknolojiye uyum/genişletme · panel, tool holding</td></tr>
  <tr><td>7 Flexibility</td><td>ürün çeşidi, eksen sayısı, turret/magazine kapasitesi</td></tr>
  <tr><td>8 Reliability · 9 Safety</td><td>kalite sürekliliği (tolerans) · yangın söndürme, güvenlik kapısı, toz-duman emişi</td></tr>
  <tr><td>10 After sale service · 11 Cost</td><td>bakım-arıza, eğitim, yedek parça · satın alma, bakım, güncelleme maliyeti</td></tr>
</table>
`;
})();
