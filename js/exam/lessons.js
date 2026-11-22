/* Sınav Hazırlık · 17 konu anlatımı (hocanın sınavda çıkacağını söylediği konular, sırası korunur).
   Her konu: { id, n, title (EN, hocanın yazımı), tr, src (ders notu sayfaları), link (site konusu),
               lesson (Türkçe anlatım), memo (ezberlenecekler, EN), answer (sınavda yazılacak örnek cevap, EN), traps }
   Kaynak: Lean Manufacturing.pdf (LEAN s.x) ve automated guided vehicles.ppt (AGV s.x). Görsel sayfalara bakıldı:
   LEAN s.14 (House of Lean), s.15 (Lean Roadmap), s.32–36, s.107, s.114, s.134 (A3), s.140–147, s.156, s.166, s.172, s.174, s.189; AGV s.15, s.17.
   Notlarda olmayan açıklamalar "(notlarda yok)" diye işaretlenir. a/b kesir yazımı yok (bölme "a / b" boşluklu). */
(function () {
  const IM = window.IM;
  IM.exam = IM.exam || {};

  IM.exam.topics = [
    // ------------------------------------------------------------------ 1
    {
      id: 'agv',
      n: 1,
      title: 'Determining required number of AGVs',
      tr: 'Gerekli AGV sayısının belirlenmesi',
      src: 'AGV s.14–17',
      link: '4.3',
      lesson: `
<p>Hücresel bir yerleşimde (AGV s.14) AGV'ler depodan (warehouse) her hücreye malzeme taşır. Her hücre için bilinenler:
depoya <b>uzaklık d (m)</b>, saatlik <b>sefer sayısı f</b> (frequency of trips), sefer başına <b>yükleme/boşaltma süresi t (dk)</b>.
AGV hızı <b>v</b> (notlarda 60 m/dk; “genellikle 60–80 m/dk”). Amaç: bir saatlik işi bitirecek en az araç sayısı.</p>
<h3>Çözümün 5 adımı (AGV s.16 — sırasıyla ezberle)</h3>
<ol>
  <li>Depodan her hedefe <b>gidiş-dönüş</b> (round trip) seyir süresini bul → (d + d) / v.</li>
  <li>Yükleme ve boşaltma süresini ekle.</li>
  <li>Sefer sıklığını kullanarak toplam araç kullanım süresini bul (hücre başına, sonra topla).</li>
  <li>Bu toplamı <b>traffic congestion factor</b>'e (genellikle <b>0.85</b>) <b>böl</b> → toplam gerekli süre (total load, dk).</li>
  <li>Toplam yükü saatteki <b>60 dakikaya böl</b> → araç sayısı; sonucu <b>yukarı yuvarla</b>.</li>
</ol>
<div class="model">Hücre i'nin saatlik kullanımı  = [ (dᵢ + dᵢ) × fᵢ / v ] + ( fᵢ × tᵢ × 2 )
Toplam kullanım              = Σ hücre kullanımları            (dk / saat)
Toplam yük (total load)       = Toplam kullanım / 0.85
Araç sayısı                  = Toplam yük / 60   →   N = ⌈ … ⌉</div>
<p><b>× 2 neden?</b> Her seferde iki işlem vardır: depoda <b>yükleme</b> ve hücrede <b>boşaltma</b>; tabloda verilen t, bu işlemlerin her biri içindir.
<b>0.85 ile neden bölünür?</b> Araçlar kavşaklarda bekleme, bloke olma, sıkışma yüzünden zamanın ancak %85'inde verimli çalışır;
yani gerçekte <i>daha fazla</i> süre gerekir. Çarparsan sonuç küçülür — yanlış yön.</p>
<h3>Notlardaki örnek (AGV s.15–17)</h3>
<table>
<tr><th>Hücre</th><th>d (m)</th><th>f (sefer/h)</th><th>t (dk)</th><th>Hesap</th><th>Kullanım (dk)</th></tr>
<tr><td>1</td><td>90</td><td>14</td><td>2</td><td>[(90 + 90) × 14 / 60] + (14 × 2 × 2) = 42 + 56</td><td>98</td></tr>
<tr><td>2</td><td>150</td><td>16</td><td>3</td><td>[(150 + 150) × 16 / 60] + (16 × 3 × 2) = 80 + 96</td><td>176</td></tr>
<tr><td>3</td><td>180</td><td>5</td><td>3</td><td>[(180 + 180) × 5 / 60] + (5 × 3 × 2) = 30 + 30</td><td>60</td></tr>
<tr><td>4</td><td>240</td><td>8</td><td>2</td><td>[(240 + 240) × 8 / 60] + (8 × 2 × 2) = 64 + 32</td><td>96</td></tr>
<tr><td colspan="5"><b>Toplam</b></td><td><b>430</b></td></tr>
</table>
<p>Toplam yük = 430 / 0.85 = <b>505.88 dk</b> (slayt 505 yazar) → 505.88 / 60 = <b>8.43</b> → <b>9 AGV</b>.</p>
<p class="note">Slayt sonucu “≅ 9” diye yazar; aslında yuvarlama değil <b>tavan</b> (ceiling) alınır: 8.43 araç olmaz, 8 araç işi bitiremez.</p>`,
      memo: `
<div class="model">usage_i = [(d + d) × f / v] + (f × t × 2)
total load = Σ usage / 0.85
N = ⌈ total load / 60 ⌉</div>
<ol><li>Round-trip travel time</li><li>+ loading/unloading time</li><li>× frequency → total vehicle use time</li><li>÷ traffic congestion factor (0.85)</li><li>÷ 60 min/h → round up</li></ol>
<p>v genellikle 60–80 m/min · notlarda örnek: 430 → 505.88 → 8.43 → <b>9</b></p>`,
      answer: `
<p><b>Procedure:</b> (1) Determine the round-trip travel time from the warehouse to each destination, (d + d) × f / v.
(2) Add the loading and unloading time, f × t × 2 (loading at the warehouse + unloading at the cell).
(3) Using the trip frequencies, find the total vehicle use time per hour: Σ = 98 + 176 + 60 + 96 = 430 min.
(4) Divide by the traffic congestion factor (0.85) to get the total load: 430 / 0.85 = 505.88 min — we divide because vehicles lose time waiting and blocking each other at intersections, so more time is needed than the pure use time.
(5) Divide the total load by 60 min/h: 505.88 / 60 = 8.43 → round up → <b>9 AGVs</b>.</p>`,
      traps: `
<ul><li>Gidiş-dönüş: mesafe <b>iki kez</b> (d + d). Tek yön alırsan seyir yarıya düşer.</li>
<li>Yükleme/boşaltma terimi <b>f × t × 2</b>; 2'yi unutma.</li>
<li>0.85 ile <b>böl</b> (çarpma). Bölünce yük artar.</li>
<li>Son adımda 60'a böl ve <b>yukarı</b> yuvarla (8.43 → 9, 8.05 → 9 bile).</li>
<li>Birimler: d metre, v m/dk → seyir dakikadır. Hız m/s verilirse önce m/dk'ya çevir (× 60).</li></ul>`,
    },
    // ------------------------------------------------------------------ 2
    {
      id: 'waste',
      n: 2,
      title: 'Types of Wastes',
      tr: 'İsraf türleri',
      src: 'LEAN s.4–13',
      link: '2.2',
      lesson: `
<p><b>Waste (israf)</b>: katma değer yaratmayan her faaliyet (LEAN s.4). <b>Value added activity</b>: müşteri gözünden değer katan,
müşterinin <b>parasını ödemeye razı olduğu</b> faaliyet. Müşteri yalnızca son kullanıcı değildir: <b>bir sonraki süreç senin müşterindir</b> (s.5).</p>
<h3>Yedi israf (LEAN s.8 — slayt sırası)</h3>
<table>
<tr><th>#</th><th>Waste</th><th>Kısa açıklama <span class="muted">(açıklama ve örnekler notlarda yok)</span></th></tr>
<tr><td>1</td><td><b>Overproduction</b></td><td>Gerekenden fazla / erken üretmek. En kötüsü sayılır, çünkü diğer israfları (stok, taşıma, bekleme) doğurur.</td></tr>
<tr><td>2</td><td><b>Waiting</b></td><td>Operatörün ya da parçanın malzeme, makine, bilgi, onay beklemesi.</td></tr>
<tr><td>3</td><td><b>Transportation</b></td><td>Malzemenin süreçler arasında gereksiz taşınması (uzak yerleşim, ara depolar).</td></tr>
<tr><td>4</td><td><b>Process</b> (over-processing)</td><td>Müşterinin istemediği ek işlem, gereğinden hassas tolerans, gereksiz adımlar.</td></tr>
<tr><td>5</td><td><b>Inventory</b></td><td>Hammadde, WIP, mamul fazlası; sorunları gizler.</td></tr>
<tr><td>6</td><td><b>Motion</b></td><td>İnsanın gereksiz hareketi: uzanmak, eğilmek, alet aramak, yürümek.</td></tr>
<tr><td>7</td><td><b>Defects</b></td><td>Hurda, yeniden işleme, muayene, müşteri şikâyeti.</td></tr>
</table>
<p><b>The Biggest Waste</b> (s.9): <b>Unused human intelligence and talent</b> (kullanılmayan insan zekâsı ve yeteneği) — bazı kaynaklarda 8. israf.</p>
<h3>Muda – Muri – Mura (s.6–7)</h3>
<ul>
<li><b>Muda (Waste)</b>: Ürüne değer katmak için gerçekten gereken <b>en az</b> ekipman, malzeme, parça, alan ve işgücünün ötesindeki her şey.</li>
<li><b>Muri (Overload)</b>: Makine, ekipman ve insanları kapasitelerinin ötesinde <b>aşırı yüklemek</b>.</li>
<li><b>Mura (Variability)</b>: Üretim planı ve üretim miktarının düzensiz olması, geçici artış–azalışlarla <b>dalgalanması</b>.</li>
</ul>
<h3>Aşırı stokun zararları (Excessive inventory, s.11–12)</h3>
<div class="model">h = i + s
h : holding cost (elde tutma maliyeti oranı)
i : rate of return on investment (yatırımın getiri oranı — bağlanan paranın fırsat maliyeti)
s : warehouse operation cost rate (depo işletme maliyet oranı)</div>
<ul><li>Aşırı elde tutma maliyeti</li><li>Yıpranma, eskime, son kullanma tarihi geçme riski</li><li>Aşırı alan ihtiyacı</li>
<li>Planlama, kapasite yönetimi ve teslimat performansı düşer</li><li><b>İşletme sorunlarını gizler</b> — “stok seviyesi yüksekken sorunlar görünmez” (s.12: su seviyesi düşünce kayalar görünür).</li></ul>
<p><b>Lean Production</b> (s.13): tüm katma değersiz (israf) faaliyetleri yok etmeyi hedefleyerek <b>lead time, cost ve quality</b> performansını iyileştiren yaklaşım.</p>`,
      memo: `
<p><b>7 wastes (slayt sırası):</b></p>
<ol><li>Overproduction</li><li>Waiting</li><li>Transportation</li><li>Process (over-processing)</li><li>Inventory</li><li>Motion</li><li>Defects</li></ol>
<p>+ Biggest waste: <b>unused human intelligence and talent</b></p>
<p class="tip">Hafıza: <b>TIMWOOD</b> = Transportation, Inventory, Motion, Waiting, Overproduction, Over-processing, Defects (sıra farklı ama 7'si eksiksiz).</p>
<div class="model">h = i + s   (holding cost = return on investment rate + warehouse operation cost rate)</div>
<p>Muda = waste · Muri = overload · Mura = variability (unevenness)</p>`,
      answer: `
<p>A waste is any activity that adds no value from the customer's perspective (an activity the customer is not willing to pay for).
The seven wastes in production systems are: <b>(1) Overproduction</b> – producing more or earlier than needed; <b>(2) Waiting</b> – idle people or parts waiting for material, machines or information;
<b>(3) Transportation</b> – unnecessary movement of materials between processes; <b>(4) Process (over-processing)</b> – extra processing the customer does not require;
<b>(5) Inventory</b> – excess raw material, WIP and finished goods, which increases holding cost (h = i + s), needs space and hides problems;
<b>(6) Motion</b> – unnecessary movements of workers (searching, reaching, walking); <b>(7) Defects</b> – scrap, rework and inspection.
The biggest waste is <b>unused human intelligence and talent</b>. Related concepts: muda (waste), muri (overload), mura (variability).</p>`,
      traps: `
<ul><li>Muri = <b>overload</b> (aşırı yük), Mura = <b>variability</b> (dalgalanma). Sık karıştırılır.</li>
<li>“Biggest waste” 7'nin içinde değil: <b>unused human intelligence and talent</b>.</li>
<li>h = i + s: i = <b>return on investment</b> oranı, s = <b>warehouse operation cost</b> oranı.</li>
<li>Müşteri = bir sonraki süreç de olabilir (iç müşteri).</li></ul>`,
    },
    // ------------------------------------------------------------------ 3
    {
      id: 'tools',
      n: 3,
      title: 'Objectives of Lean tools (one sentence each)',
      tr: 'Lean araçlarının amaçları (her biri tek cümle)',
      src: 'LEAN s.14 (House of Lean) + ilgili sayfalar',
      link: '2.2',
      lesson: `
<p>LEAN s.14 “<b>The House of Lean</b>” şeklinde araçları bir ev olarak gösterir: <b>çatı = Continuous Improvement</b>,
çatının altında <b>6 Sigma Root Cause Problem Solving</b>, gövdede 12 araç (3 sütun × 4 sıra), girişte basamak olarak <b>Value Stream Mapping</b>;
evin tamamı <b>Culture</b> (kültür) üzerine kuruludur. Sınavda “her aracın amacını bir cümleyle yazın” denebilir.
Aşağıdaki cümleler notlardaki tanımlara dayanır; notlarda tanımı olmayan araçlar <span class="muted">(notlarda yok)</span> diye işaretli.</p>
<table>
<tr><th>Araç</th><th>Amaç — tek cümle</th></tr>
<tr><td><b>Value Stream Mapping</b></td><td>Bir ürün ailesinin malzeme ve bilgi akışını uçtan uca haritalayarak katma değerli/katma değersiz faaliyetleri görünür kılmak ve gelecek durum (future state) için iyileştirme planı çıkarmak (s.17–18).</td></tr>
<tr><td><b>5S System</b></td><td>Düzenli, temiz ve yüksek performanslı bir işyeri yaratmak; diğer iyileştirmelerin temelini oluşturmak (s.45).</td></tr>
<tr><td><b>Visual Control</b> (görsel yönetim)</td><td>Sorunları hızla fark edip harekete geçmek ve mevcut performansın plana göre durumunu herkese görünür kılmak (s.138).</td></tr>
<tr><td><b>Plant Layout</b></td><td>Malzeme ve bilgi akışını iyileştirip taşıma israfını azaltmak (s.26).</td></tr>
<tr><td><b>Cellular/Flow</b></td><td>Benzer üretim özellikli parça ailelerini ayrı hücrelerde üreterek akışı hızlandırmak, taşıma ve stoku azaltmak (s.30).</td></tr>
<tr><td><b>Quick Set-up</b> (SMED)</td><td>Hazırlık sürelerini kısaltarak kapasite kazanmak ve küçük partilerle üretimi mümkün kılmak (s.75).</td></tr>
<tr><td><b>Lot Size Reduction</b></td><td>Parti büyüklüğünü küçülterek lead time'ı kısaltmak, hataları erken fark etmek ve alan kazanmak (s.75'teki “small batch sizes” faydaları).</td></tr>
<tr><td><b>Pull/Kanban</b></td><td>Malzeme akışını ve üretimi bir plana göre değil gerçek talebe göre başlatıp müşteri ihtiyacını zamanında üretmek (s.110).</td></tr>
<tr><td><b>TPM – Total Productive Maintenance</b></td><td>Ekipmanın güvenilirliğini ve bakım yapılabilirliğini artırıp OEE'yi maksimize etmek; herkesi ekipmandan sorumlu kılmak (s.170, 172, 184).</td></tr>
<tr><td><b>Standardized Work</b></td><td>İşin en iyi bilinen yöntemini iş talimatlarıyla standartlaştırarak değişkenliği azaltmak (s.153–154; ayrıntı notlarda yok).</td></tr>
<tr><td><b>Quality at Source</b></td><td>Hatayı oluştuğu yerde önlemek/yakalamak, kusurlu ürünü bir sonraki sürece göndermemek <span class="muted">(notlarda yok; Poka-Yoke s.157 ile ilişkili)</span>.</td></tr>
<tr><td><b>POUS – Point of Use Storage</b></td><td>Malzeme ve aletleri kullanıldığı noktada tutarak hareket ve taşıma israfını azaltmak <span class="muted">(notlarda yok; 5S kullanım sıklığı kuralı s.54)</span>.</td></tr>
<tr><td><b>Teams</b></td><td>Çok becerili, sorumluluk alan ekiplerle iyileştirmeye herkesin katılımını sağlamak <span class="muted">(notlarda yok; skill matrix, 3×3×3 kuralı s.148–152)</span>.</td></tr>
<tr><td><b>6 Sigma Root Cause Problem Solving</b></td><td>Sorunların kök nedenini veri ile bulup kalıcı çözüm üretmek <span class="muted">(notlarda yok; A3'teki cause analysis — 5 Whys / fishbone s.134)</span>.</td></tr>
<tr><td><b>Continuous Improvement (Kaizen)</b></td><td>Herkesin katıldığı çok sayıda küçük iyileştirmeyle sürekli gelişmeyi sağlamak (s.131–132).</td></tr>
</table>
<h3>Roadmap'teki diğer araçlar (s.15)</h3>
<table>
<tr><td><b>Spaghetti Diagram</b></td><td>Malzeme/insan hareketlerini yerleşim planı üzerine çizerek taşıma ve hareket israfını görünür kılmak (s.27–29).</td></tr>
<tr><td><b>Poka-Yoke</b></td><td>Ürünü/süreci insan hatasına izin vermeyecek şekilde tasarlayarak hataları önlemek (s.157).</td></tr>
<tr><td><b>SMED</b></td><td>Hazırlık süresini 10 dakikanın altına indirmek (s.77).</td></tr>
<tr><td><b>A3 Report</b></td><td>Bir problemi tek sayfada (A3) problem → kök neden → hedef → uygulama → sonuç mantığıyla çözmek ve paylaşmak (s.134).</td></tr>
<tr><td><b>Suggestion System</b></td><td>Çalışanların iyileştirme önerilerini toplayıp puanlayarak katılımı teşvik etmek (s.136).</td></tr>
</table>`,
      memo: `
<p><b>House of Lean (s.14):</b> çatı Continuous Improvement · üst kat 6 Sigma Root Cause Problem Solving ·</p>
<table>
<tr><td>Pull/Kanban</td><td>Cellular/Flow</td><td>TPM</td></tr>
<tr><td>Quality at Source</td><td>POUS</td><td>Quick Set-up</td></tr>
<tr><td>Lot Size Reduction</td><td>Standardized Work</td><td>Teams</td></tr>
<tr><td>5S System</td><td>Visual Control</td><td>Plant Layout</td></tr>
</table>
<p>Basamak: <b>Value Stream Mapping</b> · Temel: <b>Culture</b></p>
<p>Anahtar fiiller: VSM → <i>see the flow / waste</i> · 5S → <i>organised clean workplace</i> · SMED → <i>reduce setup → small batches</i> · Kanban → <i>produce to actual demand</i> · TPM → <i>maximize OEE</i> · Poka-Yoke → <i>prevent human mistakes</i> · Visual → <i>see problems, act quickly</i> · Layout/Cell → <i>improve flow, cut transport</i> · Kaizen → <i>small continuous improvements by everyone</i></p>`,
      answer: `
<ul>
<li><b>VSM:</b> To map the material and information flow of a product family and reveal value-added and non-value-added activities, as a basis for the future-state improvement plan.</li>
<li><b>5S:</b> To create an organised, clean and high-performance workplace that forms the basis for other improvement efforts.</li>
<li><b>Visual management:</b> To realize problems and take action quickly, and to make current performance vs. plan visible to everyone.</li>
<li><b>Layout planning / Cellular manufacturing:</b> To improve the flow of materials and information and reduce transportation waste.</li>
<li><b>SMED (quick set-up):</b> To reduce setup times (below 10 min) so that capacity is saved and production with small batches becomes possible.</li>
<li><b>Kanban (pull):</b> To trigger material flow and production by actual demand rather than a schedule.</li>
<li><b>TPM:</b> To maximize overall equipment effectiveness by improving reliability and maintainability with everyone's participation.</li>
<li><b>Poka-Yoke:</b> To design the product or process so that human mistakes are not allowed.</li>
<li><b>Kaizen:</b> To achieve continuous improvement through many small improvements involving everyone.</li>
</ul>`,
      traps: `
<ul><li>VSM evin <b>basamağıdır</b> (giriş), çatı <b>Continuous Improvement</b>'tır.</li>
<li>Tek cümlede <b>amaç</b> yaz (ne işe yarar), tanım/adım listesi değil: “To … in order to …”.</li>
<li>SMED'in amacı yalnız “süreyi azaltmak” değil: <b>kapasite kazanmak + küçük parti</b>.</li></ul>`,
    },
    // ------------------------------------------------------------------ 4
    {
      id: 'roadmap',
      n: 4,
      title: 'Application sequence of Lean tools (Lean Roadmap)',
      tr: 'Lean araçlarının uygulama sırası (Lean Roadmap)',
      src: 'LEAN s.15',
      link: '2.2',
      lesson: `
<p>LEAN s.15'teki <b>Lean Roadmap</b>, araçların hangi sırayla uygulanacağını gösteren bir akış şemasıdır. Ana akış (yukarıdan aşağı) <b>7 adım</b>dır:</p>
<ol>
<li><b>Determining Product Family</b> — ürün ailesi belirlenir (VSM her zaman bir ürün ailesi için çizilir, s.18).</li>
<li><b>Current State Value Stream Mapping</b> — mevcut durum haritası: israflar, stoklar, lead time görülür.</li>
<li><b>Future State Value Stream Mapping</b> — iyileştirilmiş malzeme/bilgi akışı tasarlanır, uygulama planı çıkar (s.23).</li>
<li><b>Current State Spaghetti Diagram</b> — fiziksel hareketler (taşıma/motion) yerleşim üzerinde çizilir.</li>
<li><b>Layout Planning (Cellular Manufacturing, Lines etc.) and Execution</b> — yeni yerleşim (hücre/hat) tasarlanır ve kurulur.</li>
<li><b>5S</b> — yeni yerleşimde düzen ve temizlik oturtulur.</li>
<li><b>Pull System (Kanban, CONWIP, POLCA)</b> — çekme sistemi kurulur.</li>
</ol>
<h3>Yan kutular (destekleyiciler)</h3>
<ul>
<li><b>SMED</b> → oku doğrudan <b>Pull System</b>'e girer: çekme sistemi küçük partiler ister, küçük parti de kısa hazırlık süresi ister.</li>
<li><b>Poka-Yoke</b> → ana akışa paralel, hata önleme.</li>
<li><b>Visual Management</b>: <b>Asakai, Oobeya, Lean Management Boards, Andon</b> → ana akışa paralel.</li>
<li><b>Continuous Improvement (Kaizen)</b>: <b>A3 reports, Suggestion System</b> → ana akışa paralel, sürekli.</li>
</ul>
<h3>Sıranın mantığı (sınavda “neden bu sıra?” diye sorulabilir)</h3>
<ul>
<li>Önce <b>ne</b> iyileştirileceği seçilir (ürün ailesi), sonra <b>mevcut durum</b> görülmeden gelecek tasarlanamaz.</li>
<li>Future state belirlendikten sonra fiziksel akış (spaghetti) incelenir ve <b>yerleşim değiştirilir</b>; yerleşim değişmeden 5S yapılırsa yeni yerleşimde tekrar yapmak gerekir.</li>
<li>5S düzeni oturmadan (yerler, miktarlar, görsel işaretler) supermarket/kanban adresleri tanımlanamaz → <b>pull en son</b>.</li>
<li>Pull için küçük parti gerekir → <b>SMED pull'dan önce</b> tamamlanmalı.</li>
</ul>
<p class="note">Sıranın gerekçeleri ders notunda yazılı değildir; şemadaki sıradan çıkarılmıştır (notlarda yok).</p>`,
      memo: `
<div class="model">Product Family → Current State VSM → Future State VSM → Current State Spaghetti Diagram
→ Layout Planning (Cellular Mfg, Lines) & Execution → 5S → Pull System (Kanban, CONWIP, POLCA)

SMED ──► Pull System
Parallel: Poka-Yoke · Visual Management (Asakai, Oobeya, Lean Mgmt Boards, Andon) · Kaizen (A3 reports, Suggestion System)</div>
<p class="tip">Hafıza: <b>“Aile → Şimdi → Gelecek → Spagetti → Yerleşim → 5S → Çek”</b> (P-C-F-S-L-5-P)</p>`,
      answer: `
<p>The Lean Roadmap applies the tools in this sequence: <b>(1) Determining the product family → (2) Current state value stream mapping → (3) Future state value stream mapping →
(4) Current state spaghetti diagram → (5) Layout planning (cellular manufacturing, lines etc.) and execution → (6) 5S → (7) Pull system (Kanban, CONWIP, POLCA)</b>.
<b>SMED</b> supports the pull system, because pull requires small batches and therefore short setups.
<b>Poka-Yoke</b>, <b>visual management</b> (Asakai, Oobeya, lean management boards, Andon) and <b>continuous improvement / Kaizen</b> (A3 reports, suggestion system) are applied in parallel throughout the roadmap.</p>`,
      traps: `
<ul><li>Spaghetti diagram <b>future state VSM'den sonra</b>, layout'tan önce gelir.</li>
<li>5S <b>layout'tan sonra</b>, pull'dan önce.</li>
<li>SMED ana akışta bir kutu değil; ok ile <b>Pull System</b>'e bağlanır.</li>
<li>Oobeya, Asakai, Andon → <b>Visual Management</b> kutusunda; A3 ve Suggestion System → <b>Kaizen</b> kutusunda.</li></ul>`,
    },
    // ------------------------------------------------------------------ 5
    {
      id: '5s',
      n: 5,
      title: 'Steps of 5S',
      tr: "5S'in adımları",
      src: 'LEAN s.45–62',
      link: '2.5',
      lesson: `
<p><b>5S</b>: düzenli, temiz ve yüksek performanslı bir işyeri yaratma sistemi; diğer iyileştirme çalışmalarının <b>temelidir</b> ve <b>Kaizen için bir disiplin (conditioning discipline)</b>dir (s.45).</p>
<table>
<tr><th>#</th><th>Japonca</th><th>İngilizce (notlar)</th><th>Özü</th></tr>
<tr><td>1</td><td><b>Seiri</b></td><td>Sort</td><td>Gereksizi ayıkla</td></tr>
<tr><td>2</td><td><b>Seiton</b></td><td>Simplify (set in order)</td><td>Her şeyin bir yeri ve adı olsun</td></tr>
<tr><td>3</td><td><b>Seiso</b></td><td>Shine</td><td>Temizle (ve temizlerken kontrol et)</td></tr>
<tr><td>4</td><td><b>Seiketsu</b></td><td>Standardize</td><td>İlk üç adımı standartlaştır, sürdür</td></tr>
<tr><td>5</td><td><b>Shitsuke</b></td><td>Training &amp; Discipline</td><td>Eğitim, denetim, alışkanlık</td></tr>
</table>
<h3>1 · Seiri – Sort (s.47–51)</h3>
<p>Gereksizi ortamdan uzaklaştır: gerekli/saklanacak olanla gereksiz/atılacak olanı doğru ayır; gereksizden kurtul, gerekliyi <b>kullanım sıklığına göre</b> yerleştir.
Araç: <b>Red Tag Application</b> (kırmızı etiket) — ek alan kazandırır, bozuk aletleri ve fazla malzemeyi/stoku yok eder; <b>Red Tag Action Plan</b> (fotoğraf, eylem, sorumlu, planlanan/gerçekleşen tarih).</p>
<h3>2 · Seiton – Simplify (s.52–54)</h3>
<p>Saklamaya karar verilenleri gerektiğinde kolayca bulup kullanmak için yapılan düzenlemeler. <b>“Everything should have a place and the place should have a name.”</b>
Aletler, ön temizlik, ekipman/mastar/kesici/kalıpların düzenli yerleşimi, <b>zemin çizgileri (painting floor lines)</b>, <b>işaretleme sistemi (visual control)</b>.</p>
<ul><li><b>3 Keys</b>: <b>Where?</b> (yerleri belirle) – <b>What?</b> (nesneleri belirle) – <b>How many?</b> (miktarları belirle).</li>
<li>Herkes hemen <b>görebilmeli – alabilmeli – yerine koyabilmeli</b> (to see, to receive, to replace) → <b>30 saniye kuralı</b>.</li>
<li>Kullanım sıklığı → yer: <b>Always → Close</b> · <b>Sometimes → A little far away</b> · <b>Rarely → To another place</b>.</li></ul>
<h3>3 · Seiso – Shine / Cleaning (s.55–57)</h3>
<p>Amaç: (1) tüm kir ve tozdan kurtulup temiz bir işyeri, (2) temizlik sırasında işyerini (makineyi) <b>tanıma fırsatı</b>. “Her zaman denetime hazırlanıyormuş gibi temiz.”</p>
<p><b>Adımlar:</b> 1) Neyi temizleyeceğine karar ver 2) Kimin temizleyeceğine karar ver 3) Temizlik yöntemine karar ver 4) Temizlik ekipmanını hazırla 5) Temizle.
Kim temizleyecek? → <b>Cleaning responsibility map</b>, temizlik takvimi, görsel olarak asılır.</p>
<h3>4 · Seiketsu – Standardize (s.58–59)</h3>
<p>İlk üç adımda elde edilen başarıları <b>korumak ve sürdürmek</b>. Herkesin hatırlaması gereken 3 ilke:
<b>1) Üretim alanında gereksiz malzeme istemiyoruz! 2) Karmaşa ve düzensizlik istemiyoruz! 3) Toz ve kir istemiyoruz!</b>
Bunun yolu her şeyi sürekli kontrol etmek ve uygunsuzlukları gidermek; <b>5S checklist</b>.</p>
<h3>5 · Shitsuke – Training &amp; Discipline (s.60–61)</h3>
<ul><li>Herkes gerekli çabayı gösterirse işyeri temiz ve düzenli kalır; çalışanlar için <b>eğitim planı</b>.</li>
<li>Denetim sonuçları değerlendirilir; her alanın sonucu <b>görsel olarak duyurulur</b>.</li>
<li>Ofiste herkes çalışma alanını <b>günlük</b> kontrol eder; bölümler <b>haftalık 15 dakikalık</b> ayrıntılı sınıflandırma–düzenleme çalışması ve <b>haftalık 5 dakikalık çapraz 5S değerlendirmesi</b> yapar.</li></ul>
<h3>5S'in faydaları (s.62)</h3>
<p>Hareket israfını azaltır · alan kazandırır · iş sağlığı ve güvenliğini destekler · arızaları azaltır · şirket imajını iyileştirir · çalışanların sisteme aidiyetini artırır.</p>`,
      memo: `
<ol><li><b>Seiri</b> – Sort (red tag)</li><li><b>Seiton</b> – Simplify / set in order (3 keys: where, what, how many · 30-second rule)</li><li><b>Seiso</b> – Shine (5 cleaning steps · responsibility map)</li><li><b>Seiketsu</b> – Standardize (3 principles · checklist)</li><li><b>Shitsuke</b> – Training &amp; Discipline (training plan · audits · daily / weekly 15 min / weekly 5 min cross)</li></ol>
<p class="tip">Hafıza: <b>“Ri-Ton-So-Ke-Ke”</b> → seiRI, seiTON, seiSO, seiKEtsu, shitsuKE · İngilizce baş harfler <b>S-S-S-S-T</b> (Sort, Simplify, Shine, Standardize, Training).</p>
<p>Frequency of use: Always → close · Sometimes → a little far away · Rarely → another place</p>`,
      answer: `
<p>5S is a system for creating an organised, clean and high-performance workplace; it is the basis for other improvement efforts.
<b>(1) Seiri – Sort:</b> separate necessary from unnecessary items and remove the unnecessary ones (red tag application); place necessary items according to frequency of use.
<b>(2) Seiton – Simplify (set in order):</b> everything should have a place and the place should have a name; determine where, what and how many (3 keys) so that anyone can see, take and replace an item within 30 seconds (floor lines, marking/visual control).
<b>(3) Seiso – Shine:</b> clean the workplace and use cleaning as an inspection opportunity; decide what, who (cleaning responsibility map), method, equipment, then clean.
<b>(4) Seiketsu – Standardize:</b> maintain the first three steps — no unnecessary material, no disorder, no dust and dirt — by continuous control with checklists.
<b>(5) Shitsuke – Training &amp; Discipline:</b> training plans, regular audits whose results are visually published, daily checks and weekly 5S assessments.
Benefits: less motion waste, saved space, better occupational health &amp; safety, fewer breakdowns, better company image and employee belonging.</p>`,
      traps: `
<ul><li>Notlarda Seiton = <b>Simplify</b> (başka kaynaklarda “Set in order”); Shitsuke = <b>Training &amp; Discipline</b> (başka kaynaklarda “Sustain”).</li>
<li>Red tag <b>Seiri</b> aracıdır; 30 saniye kuralı ve 3 keys <b>Seiton</b>'dur.</li>
<li>Seiso'nun ikinci amacı: temizlerken ekipmanı <b>tanımak / kontrol etmek</b>.</li>
<li>Seiketsu = ilk üç adımı <b>sürdürmek/standartlaştırmak</b>; yeni bir faaliyet değil.</li></ul>`,
    },
    // ------------------------------------------------------------------ 6
    {
      id: 'smed',
      n: 6,
      title: 'Steps of SMED',
      tr: "SMED'in adımları",
      src: 'LEAN s.74–104',
      link: '2.6',
      lesson: `
<p><b>Setup time</b> (s.75): önceki partinin <b>son ürününün</b> tamamlanma anı ile sonraki partinin <b>ilk kabul edilebilir (sağlam) ürününün</b> tamamlanma anı arasındaki süre.
Hazırlık süresini azaltmak <b>kapasite kazandırır</b> ve <b>küçük partilerle üretimin ön koşuludur</b>. Küçük partiler: daha kısa lead time, hataların hızlı fark edilmesi, alan tasarrufu.
Üretim hedefleri (düşük stok, kısa lead time, yüksek kapasite kullanımı…) birbiriyle çelişir; <b>düşük hazırlık süreleri bu hedefleri birbirine yaklaştırır</b> (s.76).</p>
<div class="model">SMED  (Single-Minute Exchange of Die) : setup < 10 dakika   (tek haneli dakika)
OTED  (One-Touch Exchange of Die)     : setup < 1 dakika
NOTED (Non-Touch Exchange of Dies)    : otomatik setup</div>
<h3>Dört kavramsal aşama (s.80)</h3>
<p><b>Stage 0 — Internal ve external setup ayrılmamış (s.81–83).</b> Pek çok israf tekrarlanır: makine durduktan sonra mamul depoya taşınır / sonraki partinin hammaddesi getirilir;
bıçak ve kalıplar internal setup başladıktan sonra getirilir; yeterince hassas olmadığı için jig değiştirilir; diğer eksiklikler, hatalar.
<b>Yapılacak:</b> atölyeyi ayrıntılı incele, setup'ı <b>videoya çek</b>, işçilerle <b>görüş</b>, <b>setup zaman analizi</b> yap (tablo: faaliyet, işçi, süre, kümülatif süre, setup nesnesi, tip, gelecekteki eylem).</p>
<p><b>Stage 1 — Internal ve external setup'ı ayırmak (s.84–85).</b> SMED'in <b>en önemli adımı</b>.
External setup sırasında kalıp, alet, malzeme makinenin yanına getirilmiş olmalı; internal setup'ta yalnızca gerekli işlemler yapılır (ör. kalıbı sökmek ve yeni kalıbı ayarlamak).
Araçlar: external setup faaliyetleri için <b>kontrol listesi (checklist)</b>, yapılanların çift kontrolü (tüm parçalar mevcut ve doğru yerde, aletler makinenin yanında) — bir görsel kontrol tekniği.</p>
<p><b>Stage 2 — Internal setup'ı external'a dönüştürmek (s.86–87).</b> Normal setup süreleri bu aşamada <b>%30–50</b> azaltılabilir.
Setup işlemlerini yeniden incele, adımları dışarıya (makine çalışırken yapılır hâle) taşımanın yollarını bul.</p>
<p><b>Stage 3 — Setup operasyonunun tüm yönlerini iyileştirmek (s.88–104).</b> External ve internal işlemlerde radikal iyileştirmeler:</p>
<ul>
<li><b>External için:</b> makineye atanmış aletler (machine assigned tools), görsel kalıp–alet depolama, özel kalıp arabası (specialized die car), ardışık işlemler için kalıp ve çoklu besleyiciler.</li>
<li><b>Internal için:</b> takım çalışması / <b>paralel işçiler</b>, <b>sıkma gerektirmeyen bağlama elemanları</b> (clamping without tightening), <b>kalıp standardizasyonu</b>, <b>yükseklik standardizasyonu</b> (farklı bağlantı elemanı ihtiyacını azaltır),
merkezleme (centering ball), <b>konumlandırma pimleri</b> (positioning pins), <b>renk–numara kodlama</b>.</li>
<li>İyileştirilmiş setup için <b>Gantt şeması</b> ile iş organizasyonu (öncül faaliyet, faaliyet bölünebilir mi / birden çok kişi eşzamanlı yapabilir mi, kim yapabilir).</li>
</ul>`,
      memo: `
<ol start="0"><li><b>Stage 0</b>: internal &amp; external not distinguished → video, interviews, setup time analysis</li>
<li><b>Stage 1</b>: separate internal &amp; external (most important) → checklist, double check</li>
<li><b>Stage 2</b>: convert internal to external → 30–50% reduction</li>
<li><b>Stage 3</b>: improve all aspects (radical improvements in external &amp; internal)</li></ol>
<div class="model">SMED < 10 min · OTED < 1 min · NOTED = automated</div>`,
      answer: `
<p>Setup time is the time between the completion of the last product of the previous batch and the completion of the first acceptable product of the next batch. SMED (single-minute exchange of die) aims at setups below 10 minutes.
<b>Stage 0:</b> internal and external setup are not distinguished; study the shop floor (videotaping, interviews with workers, setup time analysis).
<b>Stage 1:</b> separate internal and external setup — the most important step; use a checklist so that dies, tools and materials are prepared beside the machine during external setup.
<b>Stage 2:</b> convert internal setup to external as much as possible (30–50% reduction).
<b>Stage 3:</b> improve all aspects of the setup operation — radical improvements in external setup (machine-assigned tools, visual die/tool storage, specialized die car) and in internal setup (parallel workers, clamping without tightening, standardized dies and heights, positioning pins, colour–number coding).</p>`,
      traps: `
<ul><li>Aşamalar <b>0'dan başlar</b> (Stage 0–3, toplam 4 aşama).</li>
<li>En önemli adım = <b>Stage 1 (ayırmak)</b>; %30–50 azalma = <b>Stage 2</b>.</li>
<li>Setup süresi son sağlam üründen değil, önceki partinin <b>son ürünü</b> → sonraki partinin <b>ilk kabul edilebilir ürünü</b>.</li>
<li>SMED &lt; 10 dk ≠ OTED &lt; 1 dk ≠ NOTED (otomatik).</li></ul>`,
    },
    // ------------------------------------------------------------------ 7
    {
      id: 'kanban',
      n: 7,
      title: 'Working application systematic of Kanban',
      tr: "Kanban'ın çalışma sistematiği (uygulama)",
      src: 'LEAN s.110–130',
      link: '2.7',
      lesson: `
<h3>Kanban'ın amacı (s.110)</h3>
<ul><li>Malzeme akışını ve üretimi bir çizelgeye göre değil <b>gerçek talebe göre</b> sağlamak</li><li>Müşteri ihtiyacını zamanında üretmek</li>
<li>Üretimi müşteri talebiyle dengelemek</li><li>Görsel kontrol sayesinde üretim alanının yönetimini basitleştirmek</li></ul>
<p><b>Kanban kartındaki bilgiler (s.111):</b> raf (store shelf) no · kanban no · parça no · parça adı · araç tipi · kutu (container) kapasitesi · kutu tipi · önceki süreç · sonraki süreç.
<b>Two-card kanban</b> (s.112): çekme (withdrawal) ve üretim (production) kanbanı.</p>
<h3>Kanban sayısı (s.114)</h3>
<div class="model">KS = ⌈ OT × (1 + α) × KCS / KB ⌉⁺       (sonuç yukarı yuvarlanır)
OT  : average demand (ortalama talep, adet/dk)
α   : reliability coefficient (güvenilirlik katsayısı)
KCS : kanban cycle time = kanban'ın bir tam çevrimi
      = receiving box'ta bekleme + order box'a transfer + order box'ta bekleme
        + batch processing cycle time (hazırlık + parti işleme + hücre içi bekleme)
        + hücre çıkışındaki supermarkete kutu transferi + supermarkette bekleme
KB  : kutudaki parça sayısı      ·  her kutu için bir kanban (kutu sayısı = kanban sayısı)</div>
<h3>Uygulama: Büyük Elektrik Kutusu hücreleri ↔ Şalter (switch) hücreleri (s.124–130)</h3>
<p><b>Üretim kanbanı</b> (s.125): Supplier cell: Switch · Customer cell: Big Electric Box · supermarket adresi · taşıma birimi: kutu · kutu kapasitesi: 8 · ürün kodu/adı.</p>
<p><b>Çalışma prensipleri — Working Principles (s.126):</b></p>
<ol>
<li>Üretim kanbanı olmadan <b>kesinlikle üretim yapılmaz</b>.</li>
<li>Nadir üretilen 630 A şalterler (84033, 84047, 89504) için kanban kullanılmaz.</li>
<li>Aynı ürün ailesinin kanbanlarında <b>termini en kısa</b> iş emrine öncelik verilir.</li>
<li>Supermarketten ürün almadan önce üretim kanbanı alınıp ilgili hücrenin <b>askısına</b> asılır.</li>
<li>Üretim kanbanları yalnızca tanımlı yerlerde (supermarket, askı) bulunur.</li>
<li>Her hafta başında hücre takım liderleri kanban sayılarını kontrol eder.</li>
<li>Kodlu supermarket adreslerine tanımı dışındaki ürün konamaz.</li>
<li><b>FIFO</b> uygulanır.</li>
<li><b>Hatalı ürün gönderilmez.</b></li>
</ol>
<p><b>Çalışma sistematiği — Working Systematic (s.127–128) — 5 adım:</b></p>
<ol>
<li>Büyük elektrik kutusu hücrelerinden biri şaltere ihtiyaç duyduğunda <b>lojistik operatörü şalter supermarketine gider</b>.</li>
<li>Lojistik operatörü, supermarketten alacağı şalter sepetinin üzerindeki <b>üretim kanbanını</b>, o şalteri üretecek <b>şalter hücresinin askısına (kanban panosu)</b> asar.</li>
<li>Lojistik operatörü şalter sepetini supermarketten büyük kutu <b>montaj hücrelerine</b> götürür.</li>
<li>Üretim kanbanı ilgili hücrede <b>kırmızı bölgeye</b> asılmışsa üretim <b>hemen</b> başlar (ör. SYK 250 şalteri için).</li>
<li>Kanbana göre üretilen şalterler, hücrede tamamlanır tamamlanmaz asılı üretim kanbanıyla birlikte <b>supermarketteki adreslerine</b> götürülür.</li>
</ol>
<p><b>Kanban panosu</b> (s.117–118): üretimi planlamak ve üretim önceliğini belirlemek için; <b>Kırmızı = acil, Sarı = daha az acil, Yeşil = acil değil</b>.</p>
<h3>Sayısal sonuç (s.129–130)</h3>
<p>SYK 160: OT = 32 adet/gün ÷ 540 dk/gün = 0.059 adet/dk · KCS = 10 (bekleme) + 72 (montaj) + 810 (fason ara işlemler) = 892 dk · α = 0.30 · KB = 8 →
0.05926 × 1.30 × 892 / 8 = 8.59 → <b>KS = 9</b>. SYK 250 için KS = 6.
Envanter: push 6 × 30 + 12 × 18 = <b>396</b> → pull 9 × 8 + 6 × 3 = <b>90</b> → azalma (396 − 90) / 396 = <b>%77</b>.</p>
<h3>Kanban türleri (s.115–123)</h3>
<p>Supplier kanban (merkez depo çevrimi) · Groove system · Kanban square · Two-bin · CONWIP · Signal kanban.</p>`,
      memo: `
<div class="model">KS = ⌈ OT·(1+α)·KCS / KB ⌉⁺</div>
<p><b>Working systematic (5):</b> 1) Need → logistics operator goes to supermarket · 2) Hangs the production kanban (from the basket) on the hanger of the producing cell · 3) Carries the basket to the assembly cells · 4) Kanban in <b>red zone</b> → production starts immediately · 5) Finished items + kanban → back to supermarket address</p>
<p><b>Principles:</b> no kanban → no production · shortest deadline first · kanban only in defined places · weekly kanban count check · only defined products at addresses · FIFO · no defective product</p>
<p>Board: Red urgent · Yellow less urgent · Green not urgent · 396 → 90 = %77 inventory reduction</p>`,
      answer: `
<p>Kanban triggers production by actual demand. In the application between the big electric box cells (customer) and the switch cells (supplier):
(1) when an assembly cell needs a switch, the logistics operator goes to the switch supermarket;
(2) the operator takes the production kanban on the switch basket he/she receives and hangs it on the kanban board (hanger) of the switch cell that will produce it;
(3) the operator carries the basket to the big box assembly cells;
(4) if the kanban is hung in the red zone of the board, production starts immediately (red = urgent, yellow = less urgent, green = not urgent);
(5) produced switches are taken with their production kanban to their address in the supermarket as soon as they are completed.
Principles: there is no production without a production kanban, kanbans stay only in defined locations, FIFO is applied, defective products are not sent, priority is given to the shortest deadline, and team leaders check kanban numbers weekly.
The number of kanbans is KS = ⌈OT·(1+α)·KCS / KB⌉ (e.g. 0.059 × 1.3 × 892 / 8 = 8.59 → 9); in the application inventory fell from 396 to 90 switches (77%).</p>`,
      traps: `
<ul><li>Kanbanı supermarketten <b>alınan</b> sepetten çıkarıp <b>üretecek hücrenin</b> panosuna asan: <b>lojistik operatörü</b>.</li>
<li>Kırmızı bölge = <b>hemen üretim</b>.</li>
<li>KS formülünde KB <b>paydadır</b>, (1 + α) çarpandır; sonuç <b>yukarı</b> yuvarlanır.</li>
<li>Kutu sayısı = kanban sayısı (her kutuya bir kanban).</li></ul>`,
    },
    // ------------------------------------------------------------------ 8
    {
      id: 'visual',
      n: 8,
      title: 'Visual management techniques',
      tr: 'Görsel yönetim teknikleri',
      src: 'LEAN s.138–161',
      link: '2.8',
      lesson: `
<p><b>Visual management</b> (s.138): sorunları fark edip <b>hızla harekete geçmek</b> için kullanılan basit lean teknikleri;
<b>mevcut performansın planlanan performansa göre</b> durumu hakkındaki farkındalığı artırmak.
Neden görsel? <b>Bilginin %83'ü göz</b> ile toplanır (kulak %11, burun %4, dokunma %1, tat %1 — s.139).</p>
<h3>Notlardaki görsel yönetim teknikleri</h3>
<ul>
<li><b>Asakai panoları</b> (s.140–144): <b>Task Assignment Dashboard</b> (görev atama ve takip) ve <b>Production Performance Tracking (QCDSM) Board</b>.</li>
<li><b>Production Scoreboard</b> (s.145): hedef üretim, gerçekleşen üretim, sistem durumu (çalışıyor / setup / durdu), etkinlik oranı (gerçekleşen / hedef).</li>
<li><b>Lean Production Mainboard</b> (s.146) ve <b>Cell Board</b> (s.147).</li>
<li><b>Skill Matrix</b> (s.148–151): işçi × görev; seviyeler: yapamaz / takım liderinin denetiminde yapar / tek başına yapar / eğitim verebilir / işi geliştirebilir (ve “görevi yapması beklenmiyor”).</li>
<li><b>3×3×3 kuralı</b> (s.152): her işçi en az 3 iş yapar, her iş en az 3 işçi tarafından yapılır.</li>
<li><b>Work standardization / Work instruction</b> (s.153–154).</li>
<li><b>Colour coding</b> (s.155): bir hat/hücredeki parça kutuları aynı renk; hattaki benzer parçaların kutuları farklı renk; renkli çizgilerle yer tanımları ve istasyon sınırları.</li>
<li><b>Poka-Yoke</b> (s.157–161): hata önleme; araçları <b>sensörler, ışıklı/sesli uyarılar, asimetri, renk kodlama, numara kodlama</b>.</li>
<li><b>Kanban board</b> (s.117–118): kırmızı/sarı/yeşil öncelik.</li>
<li><b>Andon</b> ve “hourly output tracking” panosu, operatör dinlenme alanında güncel bilgi ekranı, üretim alanında ofisler (s.156 fotoğrafları).</li>
<li>5S'teki görseller: <b>red tag</b>, <b>zemin çizgileri</b>, işaretleme, temizlik sorumluluk haritası, dolap içinin fotoğrafını kapağa yapıştırma (s.48, 52, 57, 73).</li>
<li>TPM'deki görseller: <b>F-tag</b> (arıza etiketi), yağlama haritası, kirlilik kaynakları haritası, one-point lesson (s.177–194).</li>
</ul>`,
      memo: `
<p>Tanım: simple lean techniques to <b>realize problems and take action quickly</b> + awareness of <b>current vs planned performance</b> · 83% of information via sight</p>
<p>Asakai boards (Task Assignment + QCDSM) · Production scoreboard · Lean mainboard · Cell board · Skill matrix · 3×3×3 · Work instruction · Colour coding · Poka-yoke · Kanban board · Andon · Red tag / floor lines</p>
<p>Poka-yoke tools: sensors · light/sound warnings · asymmetry · colour coding · number coding</p>`,
      answer: `
<p>Visual management techniques are simple lean techniques used to realize problems and take action quickly, and to increase awareness of current performance compared with planned performance (83% of information is gathered by sight).
Examples: Asakai meeting boards — task assignment dashboard and production performance tracking (QCDSM) board; production scoreboard (target vs current production, system status, effectiveness rate);
lean production main board and cell boards; skill matrix and the 3×3×3 rule; standardized work instructions; colour coding of containers and floor lines; Poka-Yoke devices (sensors, light/sound warnings, asymmetry, colour and number coding);
kanban boards (red/yellow/green priority); Andon signal boards; red tags and F-tags.</p>`,
      traps: `
<ul><li>Tanımın iki parçası var: <b>sorunu hızla fark et + harekete geç</b> ve <b>plan vs gerçekleşen</b> farkındalığı.</li>
<li>Bilginin %83'ü görme ile.</li>
<li>Skill matrix seviyelerinin sırası: denetimle → tek başına → eğitebilir → geliştirebilir.</li></ul>`,
    },
    // ------------------------------------------------------------------ 9
    {
      id: 'cell',
      n: 9,
      title: 'Cellular manufacturing (definition and benefits)',
      tr: 'Hücresel üretim (tanım ve faydalar)',
      src: 'LEAN s.26–36',
      link: '2.4',
      lesson: `
<h3>Tanım (s.30 — kelimesi kelimesine ezberle)</h3>
<p class="box"><b>Cellular production systems</b> are systems formed by groups of <b>processes, people and machines</b> for the manufacturing of certain groups of parts (<b>part families</b>)
with <b>similar manufacturing characteristics</b> in <b>separate places (cells)</b> within the system.</p>
<p>Türkçesi: benzer üretim özelliklerine sahip parça ailelerini üretmek için süreç, insan ve makine gruplarının sistem içinde ayrı yerlerde (hücrelerde) toplandığı sistemler.</p>
<h3>Job shop ↔ Cellular (s.31–32)</h3>
<ul>
<li><b>Job shop</b> (fonksiyonel yerleşim): tornalama, frezeleme, delme, taşlama, montaj, sevkiyat <b>bölümleri</b> ayrı; parça bölümden bölüme dolaşır → uzun taşıma, yüksek WIP.</li>
<li><b>Cellular (3 hücreli)</b>: farklı tipte makineler parça ailesine göre hücrelerde toplanır; şekilde <b>“Saved Space”</b> (kazanılan alan) ve hücreye atanmamış makineler için <b>fonksiyonel alan</b> görülür.</li>
<li><b>U-type layout</b> (s.33): makineler U biçiminde; bir operatör U içinde yürüyerek birden çok makineyi çalıştırır; giriş ve çıkış yan yana. <b>U-type assembly cell</b> (s.34).</li>
<li><b>Product families</b> (s.35) ve rocker switch montaj alanı önce/sonra (s.36: karmaşık akış → düzenli hücreler).</li>
<li>Yerleşim planlama amacı (s.26): malzeme ve bilgi akışını iyileştirmek, <b>taşıma israfını azaltmak</b>. Spaghetti diyagramı (s.27–29), layout simülasyonu (s.37–40), yazılımlar (FactoryFLOW, Visufact, Factory CAD, visTABLE, VIP-PLANOPT — s.41), planlanan–gerçekleşen takibi (s.42).</li>
</ul>
<h3>Faydalar</h3>
<p class="note">Notlarda hücresel üretimin faydaları ayrı bir liste olarak yazılı değildir (s.32 şeklinde “saved space”, s.26'da taşıma israfının azalması geçer). Aşağıdaki liste standart literatürdür (notlarda yok); sınavda en az 6–8 madde yaz.</p>
<ol>
<li><b>Malzeme taşıma (transportation) ve hareket mesafesi azalır</b> — makineler yan yana.</li>
<li><b>Manufacturing lead time kısalır</b> — parça bölümler arasında beklemez.</li>
<li><b>WIP / ara stok azalır</b> — tek parça ya da küçük parti akışı.</li>
<li><b>Alan kazanılır</b> (saved space, s.32).</li>
<li><b>Hazırlık süreleri azalır</b> — hücredeki parçalar benzer olduğundan setup benzer/kısa.</li>
<li><b>Kalite iyileşir</b> — hatalar hemen bir sonraki istasyonda fark edilir, geri bildirim hızlı.</li>
<li><b>Planlama ve kontrol basitleşir</b> — hücre tek bir birim gibi yönetilir, görsel kontrol kolay.</li>
<li><b>Çok becerili çalışanlar, takım çalışması, sahiplenme ve motivasyon</b> artar.</li>
<li><b>Esneklik</b> ve teslimat performansı artar; birim maliyet düşer.</li>
</ol>`,
      memo: `
<p class="box">…groups of <b>processes, people and machines</b> for the manufacturing of <b>part families</b> with <b>similar manufacturing characteristics</b> in <b>separate places (cells)</b> within the system.</p>
<p>Faydalar (literatür): ↓ transportation · ↓ lead time · ↓ WIP · ↓ space · ↓ setup · ↑ quality feedback · simple scheduling/control · ↑ teamwork / multi-skill / ownership · ↑ flexibility</p>
<p>U-type layout: one operator walks inside the U, entry &amp; exit together.</p>`,
      answer: `
<p><b>Definition:</b> Cellular manufacturing systems are systems formed by groups of processes, people and machines for the manufacturing of certain groups of parts (part families) with similar manufacturing characteristics in separate places (cells) within the system — unlike a job shop, where machines are grouped by function (turning, milling, drilling…).
<b>Benefits:</b> reduced material handling/transportation distances; shorter manufacturing lead time; lower WIP inventory; saved floor space; shorter setups because parts in a family are similar;
faster detection of defects and better quality; simpler production planning and visual control; multi-skilled workers, teamwork and ownership; higher flexibility and lower cost. U-type cells allow one operator to run several machines.</p>`,
      traps: `
<ul><li>Tanımın 4 anahtar ögesi: <b>processes–people–machines</b>, <b>part families</b>, <b>similar manufacturing characteristics</b>, <b>separate places (cells)</b>.</li>
<li>Job shop = fonksiyona göre gruplama; cellular = <b>parça ailesine</b> göre gruplama.</li></ul>`,
    },
    // ------------------------------------------------------------------ 10
    {
      id: 'opf',
      n: 10,
      title: 'Benefits of one piece flow',
      tr: 'Tek parça akışının faydaları',
      src: 'LEAN s.11–12, s.33–34, s.75 (liste notlarda yok)',
      link: '2.4',
      lesson: `
<p><b>One piece flow</b> (tek parça akışı): parçaların partiler hâlinde değil, <b>birer birer</b> bir istasyondan diğerine, aralarında bekleme/stok olmadan geçmesi.
Hücresel üretim ve U tipi hücreler (s.33–34) tek parça akışının fiziksel zeminidir; SMED ile parti büyüklüğünün 1'e yaklaşması mümkün olur.</p>
<p class="note">Notlarda “benefits of one piece flow” başlıklı bir sayfa yok. Notlarla doğrudan bağlantılı dayanaklar: küçük partilerin faydaları (s.75: <i>less lead time, quick realization of defects, saves space</i>),
stokun zararları (s.11–12: stok sorunları gizler) ve VSM'de lead time'ın 23.6 günden 4.5 güne inmesi (s.22–24). Aşağıdaki liste standart literatürdür (notlarda yok).</p>
<h3>Faydalar</h3>
<ol>
<li><b>Lead time çok kısalır</b> — parça parti tamamlanmasını beklemez (bekleme israfı ↓).</li>
<li><b>WIP ve stok azalır</b> → elde tutma maliyeti (h = i + s) ve alan ihtiyacı ↓.</li>
<li><b>Hatalar hemen fark edilir</b> — bir sonraki istasyon hatayı ilk parçada görür; hurda ve yeniden işleme bir partiye yayılmaz (quick realization of defects).</li>
<li><b>Alan kazanılır</b> — istasyonlar arası stok yok, makineler yakın.</li>
<li><b>Taşıma ve elleçleme azalır</b> — parçalar yakındaki bir sonraki istasyona elle geçer.</li>
<li><b>Sorunlar görünür olur</b> — stok tamponu olmadığından duruşlar, darboğazlar ortaya çıkar ve iyileştirme (kaizen) tetiklenir.</li>
<li><b>Esneklik</b> — talep veya ürün değişimine hızlı uyum; takt time'a göre üretim, aşırı üretim ↓.</li>
<li><b>Verimlilik ve hat dengesi</b> artar; katma değersiz faaliyetler (sayma, istifleme, arama) azalır.</li>
<li><b>Güvenlik ve çalışan sahiplenmesi</b> artar; maliyet düşer.</li>
</ol>`,
      memo: `
<p>One piece flow = parts move <b>one at a time</b> between operations without waiting/inventory.</p>
<p>Faydalar: ↓ lead time · ↓ WIP/inventory · immediate defect detection · ↓ space · ↓ handling/transport · problems become visible · ↑ flexibility (produce to takt, no overproduction) · ↑ productivity · ↓ cost</p>
<p>Notlardaki dayanak (s.75 small batches): <b>less lead time · quick realization of defects · saves space</b></p>`,
      answer: `
<p>In one piece flow, parts move one at a time from one operation to the next without waiting in batches. Benefits:
(1) much shorter manufacturing lead time (no waiting for the batch to be completed); (2) lower WIP and inventory, so lower holding cost and space;
(3) defects are realized immediately at the next operation, so scrap and rework are limited to one piece; (4) saved floor space; (5) less transportation and handling;
(6) problems become visible instead of being hidden by inventory, which triggers improvement; (7) higher flexibility to respond to demand changes and produce to takt time without overproduction;
(8) higher productivity and lower cost.</p>`,
      traps: `
<ul><li>Bu konunun notlarda listesi yok: cevabını notlardaki <b>small batch</b> faydalarıyla (s.75) destekle.</li>
<li>“Sorunları görünür kılar” fikri notlardaki “stok sorunları gizler” (s.11–12) ile bağlantılıdır.</li></ul>`,
    },
    // ------------------------------------------------------------------ 11
    {
      id: 'setup',
      n: 11,
      title: 'Internal/External setups',
      tr: 'İç (internal) ve dış (external) hazırlık',
      src: 'LEAN s.79–87',
      link: '2.6',
      lesson: `
<h3>Tanımlar (s.79)</h3>
<ul>
<li><b>Internal setup</b>: yalnızca <b>makine durdurulduktan sonra</b> yapılabilen faaliyetler — ör. kalıbı takmak (mounting), sökmek (dismounting).</li>
<li><b>External setup</b>: <b>makine çalışırken</b> yapılabilen faaliyetler — ör. sökülen kalıbı depoya taşımak, takılacak kalıbı makinenin yanına getirmek.</li>
</ul>
<p>Makine durma süresi = yalnızca internal setup süresi. Bu yüzden SMED'in özü: önce ayır (Stage 1), sonra mümkün olanı internal'dan external'a <b>dönüştür</b> (Stage 2, %30–50 azalma), sonra her ikisini radikal iyileştir (Stage 3).</p>
<h3>Örnek sınıflandırma</h3>
<table>
<tr><th>Faaliyet</th><th>Tip</th></tr>
<tr><td>Eski kalıbı sökmek, yeni kalıbı takmak ve ayarlamak</td><td>Internal</td></tr>
<tr><td>İlk parçaları deneme–ayar ile sağlam ürüne getirmek</td><td>Internal</td></tr>
<tr><td>Kalıpları/aletleri depodan makinenin yanına getirmek</td><td>External</td></tr>
<tr><td>Sökülen kalıbı temizleyip depoya götürmek</td><td>External</td></tr>
<tr><td>Sonraki partinin hammaddesini makinenin yanına getirmek; mamulü depoya taşımak</td><td>External (Stage 0'da yanlışlıkla makine dururken yapılır)</td></tr>
<tr><td>Checklist ile tüm parça/aletlerin hazır olduğunu kontrol etmek</td><td>External</td></tr>
<tr><td>Kalıbı önceden ısıtmak (makine çalışırken) <span class="muted">(notlarda yok)</span></td><td>Internal → External'a dönüştürülmüş</td></tr>
</table>
<h3>Dönüştürme / iyileştirme fikirleri (s.86–103)</h3>
<ul>
<li>Hazırlık faaliyetlerini önceden yapmak (aletleri, kalıbı, malzemeyi makine çalışırken hazırlamak).</li>
<li>Standart kalıp yüksekliği ve standart bağlantı elemanları → makine üzerinde ayar ihtiyacı azalır.</li>
<li>Merkezleme topları, konumlandırma pimleri → ayar (adjustment) internal süresi kısalır.</li>
<li>Sıkma gerektirmeyen bağlama, paralel çalışan işçiler, renk–numara kodlama.</li>
<li>External için: makineye atanmış aletler, görsel kalıp–alet depolama, özel kalıp arabası.</li>
</ul>`,
      memo: `
<p><b>Internal</b> = only after <b>stopping</b> the machine (mounting/dismounting dies)</p>
<p><b>External</b> = while the machine is <b>operating</b> (transporting dismounted dies to storage, conveying next dies to the machine)</p>
<p>Separate (Stage 1) → convert internal → external (Stage 2, 30–50%) → improve both (Stage 3)</p>`,
      answer: `
<p><b>Internal setup</b> consists of activities that can only be done after stopping the machine, such as mounting and dismounting dies.
<b>External setup</b> consists of activities that can be done while the machine is operating, such as transporting dismounted dies to storage or conveying the dies to be mounted next to the machine.
Since only internal setup stops the machine, SMED first separates internal and external setup (stage 1, using checklists), then converts as much internal setup as possible to external (stage 2, 30–50% reduction),
and finally improves both (standardized die heights, positioning pins, clamping without tightening, parallel workers, specialized die cars).</p>`,
      traps: `
<ul><li>Ayırt edici ölçüt: makine <b>dururken mi</b> çalışırken mi yapılabiliyor?</li>
<li>Malzeme/kalıp taşıma makine dururken yapılıyorsa bu bir <b>Stage 0 israfıdır</b>; aslında external faaliyettir.</li></ul>`,
    },
    // ------------------------------------------------------------------ 12
    {
      id: 'pushpull',
      n: 12,
      title: 'Push/Pull system comparison',
      tr: 'İtme / çekme sistemlerinin karşılaştırması',
      src: 'LEAN s.105–109',
      link: '2.7',
      lesson: `
<h3>Tanımlar (s.106)</h3>
<ul>
<li><b>Push system</b>: işlerin sisteme girişini <b>talebe (tahmine) göre çizelgeler</b>.</li>
<li><b>Pull system</b>: işlerin sisteme girişine ve sistem içinde ilerlemesine <b>sistemin durumuna göre</b> izin verir.</li>
</ul>
<p><b>Şekil (s.107)</b>: Push'ta <b>merkezi üretim kontrolü</b> (central production control) her istasyona (rough mfg., precision mfg., subassembly, main assembly, shipment) emir gönderir; istasyonlar arasında <b>stok üçgenleri</b>.
Pull'da üretim kontrolü <b>kanban prensiplerine göre</b> yalnızca <b>son montaja</b> sinyal verir; önceki istasyonlar arasında supermarket ve kanban döngüleri vardır.
Push örneği: <b>MRP grafik yöntemi</b> (s.108).</p>
<h3>Karşılaştırma tablosu (s.109 — ezberle)</h3>
<table>
<tr><th>Push System (ERP, MRP)</th><th>Pull System (Kanban, CONWIP, POLCA)</th></tr>
<tr><td>Ofiste çalışır (works in office)</td><td>Sahada çalışır (works in the field)</td></tr>
<tr><td>Üretim parametrelerini <b>deterministik</b> kabul eder</td><td>Üretim parametrelerini <b>stokastik</b> kabul eder</td></tr>
<tr><td>Beklenmeyen durumları ihmal eder</td><td>Beklenmeyen durumları (arıza vb.) dikkate alır</td></tr>
<tr><td>Planlayıcı sistemi işletir, her birime periyodik olarak üretim emri hazırlayıp gönderir</td><td>Talep yapısında önemli bir değişiklik olduğunda (aylık/çeyreklik) planlayıcı supermarketteki kutu ve kart sayısını yeniden hesaplar; sistem <b>otonom</b> çalışır</td></tr>
<tr><td>Yüksek alan ihtiyacı, cycle inventory ve lead time</td><td>Alan ihtiyacını, cycle inventory'yi ve lead time'ı iyileştirir</td></tr>
<tr><td><b>Yüksek talep değişkenliğinde çalışır</b></td><td>Yüksek talep değişkenliğinde <b>sorunludur</b></td></tr>
<tr><td><b>Yüksek ürün çeşitliliğinde çalışır</b></td><td>Yüksek ürün çeşitliliğinde <b>sorunludur</b></td></tr>
</table>
<p>Sonuç: <b>Hybrid production control</b> — ikisinin güçlü yönleri birleştirilir (ör. MRP ile uzun vadeli plan, kanban ile sahada akış).</p>`,
      memo: `
<table>
<tr><th>Push (ERP, MRP)</th><th>Pull (Kanban, CONWIP, POLCA)</th></tr>
<tr><td>office</td><td>field</td></tr>
<tr><td>deterministic</td><td>stochastic</td></tr>
<tr><td>neglects unexpected</td><td>considers unexpected (breakdown)</td></tr>
<tr><td>planner sends orders periodically</td><td>planner recalculates kanbans when demand changes; autonomous</td></tr>
<tr><td>high space, cycle inventory, lead time</td><td>improves space, inventory, lead time</td></tr>
<tr><td>OK with high demand variability</td><td>problematic</td></tr>
<tr><td>OK with high product variety</td><td>problematic</td></tr>
</table>
<p>Push: schedules job entry by demand · Pull: entry &amp; progression by system state · → Hybrid</p>`,
      answer: `
<p>A <b>push system</b> schedules the entry of jobs into the production system based on (forecast) demand; a <b>pull system</b> allows the entry and progression of jobs according to the state of the system.
Push systems (ERP, MRP) work in the office, treat production parameters as deterministic and neglect unexpected conditions; the planner periodically prepares and sends production orders to each unit; they lead to high space requirement, cycle inventory and lead times, but they work under high demand variability and high product variety.
Pull systems (Kanban, CONWIP, POLCA) work in the field, treat parameters as stochastic and take unexpected conditions (breakdowns) into account; the planner only recalculates the number of containers/kanbans when demand changes significantly and the system works autonomously; they improve space, cycle inventory and lead time, but are problematic under high demand variability and high product variety. Therefore hybrid production control is often used.</p>`,
      traps: `
<ul><li><b>Yüksek talep değişkenliği ve yüksek ürün çeşitliliği → push lehine</b> (pull sorunlu). Ters ezberleme!</li>
<li>Push = deterministik, pull = stokastik.</li>
<li>Pull'da planlayıcı yine var: talep yapısı değişince kanban sayısını yeniden hesaplar.</li></ul>`,
    },
    // ------------------------------------------------------------------ 13
    {
      id: 'a3',
      n: 13,
      title: 'Kaizen A3 Report template',
      tr: 'Kaizen A3 rapor şablonu',
      src: 'LEAN s.131–137',
      link: '2.8',
      lesson: `
<h3>Kaizen (s.131–132)</h3>
<p>Japonca <b>KAI = değişim</b>, <b>ZEN = iyi, daha iyi</b>. Masaaki Imai: “üst yönetim, yöneticiler ve çalışanlar dâhil <b>herkesin katıldığı sürekli iyileştirme</b>.”
<b>Batı yaklaşımı</b>: Ar-Ge bitince büyük bir sıçrama (basamaklı grafik); <b>Kaizen yaklaşımı</b>: çok sayıda küçük iyileştirmenin toplam etkisi, klasik hıza yakın, hatta daha hızlı gelişme (sürekli yükselen çizgi).</p>
<h3>A3 Reporting – Kobetsu Kaizen şablonu (s.134)</h3>
<p>Tek bir A3 kâğıdı iki sütuna bölünür. <b>Sol sütun = problemi anlamak</b>, <b>sağ sütun = çözmek ve doğrulamak</b>.</p>
<table>
<tr><th>Sol sütun</th><th>Sağ sütun</th></tr>
<tr><td><b>1. The problem</b> — müşterinin/hastanın gözünden algılandığı şekliyle</td><td><b>5. Target condition</b> — karşı önlemlerle ulaşılacak yeni ideal sürecin şeması</td></tr>
<tr><td><b>2. Background</b> — bağlam ve önem</td><td><b>6. Implementation plan</b> — <b>What? Who? When? Where?</b></td></tr>
<tr><td><b>3. Current condition</b> — doğrudan gözlemden çıkarılan mevcut süreç şeması</td><td><b>7. Follow-up plan</b> — beklenen performans; ne zaman takip edilip ölçülecek</td></tr>
<tr><td><b>4. Cause analysis</b> — <b>5-Whys</b> ve/veya <b>fishbone</b> (balık kılçığı) diyagramından</td><td><b>8. Results</b> — ölçüm ve tarih; tahmin edilen ölçüden sapma</td></tr>
</table>
<p><b>A3 uygulaması</b> (s.135, Beko Elektronik Kobetsu Kaizen formu): kayıp oranları grafiği (hız kaybının oluştuğu yerler), sorun çizimi, kök neden diyagramı, karşı önlem çizimi, eylem planı (yapılacak, sorumlu, tarih, durum) ve tasarruf (Euro).</p>
<h3>Kaizen öneri sistemi (s.136–137)</h3>
<ul>
<li>Temel soru: <b>“Çalıştığın yerde işini kolaylaştırmak için daha ne yapabilirsin?”</b></li>
<li>Şikâyetler, sahte öneriler, kendi bölümü dışındaki ve sözlü öneriler dikkate alınmaz.</li>
<li>Panoda cepler: Boş form / Fikir / Onaylandı–uygulamada / Uygulandı / Reddedildi.</li>
<li>Puanlama (Orta / İyi / Çok iyi): çözüm bulup uygulama <b>4 / 8 / 16</b> · çözüm önerisi <b>2 / 4 / 8</b> · problem bulma çabası ve katılım <b>1 / 2 / 4</b>. <b>40 puan</b> toplayan ödül alır.</li>
</ul>
<p><b>Before–After Kaizen formu</b> (s.133, Mercedes-Benz Türk): iş adımı, problem, alınan önlem, sonuç (ör. 10 dk zaman tasarrufu, verimlilik +%4).</p>`,
      memo: `
<table>
<tr><th>LEFT (understand)</th><th>RIGHT (solve &amp; check)</th></tr>
<tr><td>1 The problem (customer's eyes)</td><td>5 Target condition (new ideal process chart)</td></tr>
<tr><td>2 Background (context, importance)</td><td>6 Implementation plan (What? Who? When? Where?)</td></tr>
<tr><td>3 Current condition (chart from direct observation)</td><td>7 Follow-up plan (anticipated performance, when to measure)</td></tr>
<tr><td>4 Cause analysis (5-Whys, fishbone)</td><td>8 Results (measurement &amp; date, variance from predicted)</td></tr>
</table>
<p class="tip">Hafıza: <b>P-B-C-C | T-I-F-R</b> → “Problem, Background, Current, Cause — Target, Implement, Follow-up, Results”.</p>
<p>KAI = change, ZEN = good · Imai · Suggestion points 4/8/16 · 2/4/8 · 1/2/4 · 40 points → reward</p>`,
      answer: `
<p>Kaizen (KAI = change, ZEN = good) is continuous improvement involving everyone. The A3 (Kobetsu Kaizen) report summarizes a problem-solving study on one A3 sheet:
<b>Left side:</b> (1) <b>The problem</b> – as perceived through the customer's eyes; (2) <b>Background</b> – context and importance; (3) <b>Current condition</b> – chart of the current process derived from direct observation; (4) <b>Cause analysis</b> – derived from 5-Whys and/or fishbone diagram.
<b>Right side:</b> (5) <b>Target condition</b> – chart of the new ideal process to be achieved through countermeasures; (6) <b>Implementation plan</b> – what, who, when, where; (7) <b>Follow-up plan</b> – performance anticipated and when to follow up and measure; (8) <b>Results</b> – measurement and date, variance from the predicted measure.</p>`,
      traps: `
<ul><li>Cause analysis araçları: <b>5-Whys ve fishbone</b>.</li>
<li>Implementation plan sütunları: <b>What, Who, When, Where</b> (Why/How yok).</li>
<li>Problem müşterinin gözünden; current condition <b>doğrudan gözlemden</b>.</li>
<li>Follow-up (plan, ileriye) ≠ Results (gerçekleşen ölçüm ve sapma).</li></ul>`,
    },
    // ------------------------------------------------------------------ 14
    {
      id: 'vmtools',
      n: 14,
      title: 'Visual management tools: Asakai, Oobeya, Andon, Main Lean Board, Cell boards, Performance score board, QCDSM Board',
      tr: 'Görsel yönetim araçları',
      src: 'LEAN s.15, s.140–147, s.156',
      link: '2.8',
      lesson: `
<p class="note">Asakai, panolar ve QCDSM notlarda fotoğraf/şema olarak var (s.140–147); <b>Oobeya</b> yalnızca roadmap'te (s.15), <b>Andon</b> s.15 ve s.156 fotoğrafında adıyla geçer — bu ikisinin tanımları notlarda yok (standart literatür).</p>
<table>
<tr><th>Araç</th><th>Ne / Amaç</th></tr>
<tr><td><b>Asakai</b><br><span class="muted">asa = sabah, kai = toplantı</span></td><td>Her sabah üretim alanında, panoların önünde yapılan <b>kısa ayakta toplantı</b> (s.140 fotoğrafı). Önceki günün performansı, sorunlar ve günün görevleri konuşulur.
Asakai'de kullanılan panolar (s.141): <b>Task Assignment Dashboard</b> (kişi × gün görev atama ve takip panosu, s.142–143) ve <b>Production Performance Tracking (QCDSM) Board</b> (s.144).</td></tr>
<tr><td><b>Oobeya</b> (Obeya)<br><span class="muted">“büyük oda”</span></td><td>Yönetim/proje ekibinin toplandığı, duvarlarında hedefler, KPI'lar, proje durumları ve problemlerin görsel olarak asılı olduğu <b>savaş odası</b> (war room); bilgiyi tek yerde toplayıp hızlı karar almayı sağlar <span class="muted">(notlarda yok)</span>.</td></tr>
<tr><td><b>Andon</b></td><td>Hattın/makinenin durumunu gösteren <b>ışıklı/sesli sinyal panosu</b>; operatör bir sorun olduğunda yardım çağırır ya da hattı durdurur, sorun anında herkesçe görülür (s.156 fotoğrafında üretim alanındaki ofislerin üstünde) <span class="muted">(tanım notlarda yok)</span>.</td></tr>
<tr><td><b>Lean Production Main Board</b></td><td>Fabrika düzeyinde ana yalın yönetim panosu (s.146): hata analizi / PPM değerleri tabloları, yalın projeler, 5S, kaizen çalışmaları ve performans grafikleri bir duvarda toplanır — tüm fabrikanın yalın dönüşüm durumu görülür.</td></tr>
<tr><td><b>Cell Board</b></td><td>Hücre düzeyinde pano (s.147): hücre adı (“Küçük Kutu Yalın Montaj Sistemi”), <b>hücre lideri</b> ve ekip fotoğrafları, hücre kuralları/standartları, <b>skill matrix</b>, hücre performans takibi.</td></tr>
<tr><td><b>Performance Score Board</b><br>(Production Scoreboard)</td><td>s.145: <b>hedef üretim</b>, <b>gerçekleşen üretim</b>, <b>sistem durumu</b> (çalışıyor, setup, durdu), <b>etkinlik oranı = gerçekleşen üretim / hedef üretim</b> vb. Anlık durumu gösterir (s.156: saatlik çıktı takip panosu, dijital gösterge).</td></tr>
<tr><td><b>QCDSM Board</b></td><td>Production Performance Tracking Board (s.144). Harfler birer takvim (1–31 günler) olarak çizilir:<br>
<b>Q – Quality</b>: Customer quality claims · <b>C – Cost</b>: Non-quality cost (delivery, scrap, waste man-hour cost) · <b>D – Delivery</b>: On-time delivery performance ·
<b>S – Safety</b>: Job safety, Environment · <b>M – Morale</b>: 5S, Absenteeism, Suggestions, Overtime.<br>
Her gün boyanır: <b>yeşil = sonuç 0</b> (hedefte, sorun yok), <b>kırmızı = sonuç &gt; 0</b> (sorun var), <b>mavi = hafta sonu/tatil</b>.</td></tr>
</table>
<p class="note">QCDSM'de M harfi notlarda açıkça adlandırılmamıştır; altındaki göstergeler (5S, devamsızlık, öneriler, fazla mesai) çalışan/“Morale” (bazı kaynaklarda Management) göstergeleridir.</p>`,
      memo: `
<p><b>Asakai</b> = morning shop-floor meeting · boards: Task Assignment Dashboard + QCDSM Board</p>
<p><b>Oobeya</b> = “big room” / war room with visual KPIs &amp; projects</p>
<p><b>Andon</b> = light/sound signal board for line status &amp; calling help</p>
<p><b>Main Lean Board</b> = plant-level lean status · <b>Cell Board</b> = cell leader, team, standards, skill matrix, cell KPIs</p>
<p><b>Scoreboard</b> = target, current production, status (working/setup/stopped), effectiveness = actual / target</p>
<p><b>QCDSM</b> = Quality (claims) · Cost (non-quality cost) · Delivery (on-time) · Safety (job safety, environment) · Morale (5S, absenteeism, suggestions, overtime) · green = 0, red &gt; 0, blue = holiday</p>`,
      answer: `
<ul>
<li><b>Asakai:</b> a short daily morning meeting held on the shop floor in front of the boards (task assignment dashboard and QCDSM board) to review yesterday's performance, problems and today's tasks.</li>
<li><b>Oobeya:</b> a “big room” (war room) where targets, KPIs, projects and problems are displayed visually so that the management team can share information and decide quickly.</li>
<li><b>Andon:</b> a visual/audible signal board showing the status of the line; an operator can signal a problem and call for help immediately.</li>
<li><b>Main lean board:</b> the plant-level lean production board showing defect/PPM analyses, lean projects, 5S/kaizen activities and performance charts.</li>
<li><b>Cell board:</b> a cell-level board with the cell leader and team, standards, skill matrix and cell performance.</li>
<li><b>Performance scoreboard:</b> shows target production, current production, system status (working, setup, stopped) and effectiveness rate (actual / target production).</li>
<li><b>QCDSM board:</b> tracks Quality (customer claims), Cost (non-quality cost), Delivery (on-time delivery), Safety (job safety, environment) and Morale (5S, absenteeism, suggestions, overtime) daily; green = no problem, red = problem.</li>
</ul>`,
      traps: `
<ul><li>QCDSM harf sırası: <b>Q-C-D-S-M</b>; C = <b>non-quality cost</b>, D = <b>on-time delivery</b>.</li>
<li>Asakai'nin iki panosu: <b>Task Assignment Dashboard</b> + <b>QCDSM</b>.</li>
<li>Etkinlik oranı = gerçekleşen / hedef (tersi değil).</li></ul>`,
    },
    // ------------------------------------------------------------------ 15
    {
      id: 'tpm',
      n: 15,
      title: 'Content of TPM',
      tr: "TPM'in içeriği",
      src: 'LEAN s.162–182',
      link: '2.9',
      lesson: `
<h3>Temel kavramlar (s.163–165)</h3>
<ul>
<li><b>Maintenance management</b>: bir ekipmanı belirli bir çalışma koşulunda tutmak için gereken tüm faaliyetler.</li>
<li><b>Maintainability</b>: bir cihaz/sistemin arızaları düzeltmek ve önlemek, bozulmayı öngörmek, performansı iyileştirmek ya da değişen çevreye uyum için onarılma/değiştirilme <b>kolaylığı</b>.</li>
<li><b>Reliability</b>: belirtilen koşullar altında, belirli bir süre boyunca gerekli işlevi yerine getirme <b>yeteneği</b>.</li>
<li><b>Availability</b>: görevin başında sistemin çalışabilir ve göreve hazır durumda olma derecesi. Availability'yi artırmak = <b>arıza sayısını azaltmak (reliability)</b> + <b>onarım süresini kısaltmak (maintainability)</b>.</li>
</ul>
<h3>TPM tanımı (s.170)</h3>
<p>TPM felsefesinin pek çok özelliği <b>Productive Maintenance</b> ile örtüşür: tasarım–ürün yaşam döngüsü maliyeti ilkeleriyle uyumlu planlı bakım yaklaşımlarını birleştiren,
<b>güvenilirlik ve bakım yapılabilirliği</b> iyileştirmeye yönelik <b>duruma dayalı (condition-based) sistematik bakım</b> faaliyetleri.</p>
<p><b>Paradigma değişimi</b> (s.172): Eski tutum “Ben çalıştırırım, sen tamir edersin” · “Ben tamir ederim, sen tasarlarsın” · “Ben tasarlarım, sen çalıştırırsın” → <b>TPM tutumu: “Ekipmanımızdan, tesisimizden ve geleceğimizden hepimiz sorumluyuz.”</b></p>
<h3>Content for TPM (s.171) — 5 madde</h3>
<ol>
<li><b>Design for Maintenance</b> (bakım için tasarım)</li>
<li><b>Planned maintenance</b> (planlı bakım)</li>
<li><b>Autonomous maintenance</b> — yağlama, sıkma, temizlik görevlerinin <b>one-point lesson</b>lar ve <b>makine haritaları</b> ile operatörlere verilmesi</li>
<li><b>F-tags</b> (arıza etiketleri)</li>
<li><b>Maintenance performance management</b> (OEE, MTBF, MTTR)</li>
</ol>
<div class="model">TPM = Design for Maintenance
    + Planned Maintenance (Periodic Maintenance + Predictive Maintenance)
    + Autonomous Maintenance
    + Visual Maintenance Management                       (LEAN s.173)</div>
<h3>Pillars of TPM (s.174) — temel: 5S</h3>
<p><b>Jishu Hozen</b> (autonomous maintenance) · <b>Kobetsu Kaizen</b> (focused improvement) · <b>Planned Maintenance</b> · <b>Quality Maintenance</b> · <b>Training</b> · <b>Office TPM</b> · <b>Safety, Health &amp; Environment</b> — hepsi <b>5S</b> temeli üzerinde.</p>
<h3>Autonomous maintenance — 7 adım (s.176)</h3>
<ol><li>İlk temizlik/muayeneyi yap</li><li>Kirlilik kaynaklarını yok et</li><li>Geçici standartlar oluştur</li><li>Genel muayene eğitimi geliştir</li><li>Genel muayeneleri yap</li><li>İşyeri yönetimini ve kontrolünü iyileştir</li><li>İleri iyileştirme faaliyetlerine katıl</li></ol>
<p><b>Araçlar</b> (s.177–182): one-point lessons, kirlilik kaynakları ve zor çalışma alanları haritası, <b>yağlama haritası</b> (lubrication points), muayene standartları, muayene noktaları ve tipleri.</p>
<h3>Bakım performans yönetimi (s.183, 193–196)</h3>
<p>Performans: <b>OEE</b>, TPM kayıpları, <b>MTBF</b> (Mean Time Between Failures), <b>MTTR</b> (Mean Time To Repair). Yönetim: <b>Failure Tags (F-tag)</b> — planlı bakım ve otonom bakım için; F-tag listesi ve analizi; <b>PM analysis</b> (Phenomena–Mechanism analysis: makine mekanizmasının fiziksel kök nedenlerini doğru belirleyip etkili karşı önlem geliştirmek).</p>`,
      memo: `
<p><b>Content for TPM (s.171):</b> 1 Design for maintenance · 2 Planned maintenance · 3 Autonomous maintenance (lubricating, tightening, cleaning by operators via one-point lessons, machine maps) · 4 F-tags · 5 Maintenance performance management (OEE, MTBF, MTTR)</p>
<div class="model">TPM = Design for Maintenance + Planned Maintenance (Periodic + Predictive) + Autonomous Maintenance + Visual Maintenance Management</div>
<p><b>Pillars:</b> Jishu Hozen · Kobetsu Kaizen · Planned Maint. · Quality Maint. · Training · Office TPM · Safety Health &amp; Environment — base: 5S</p>
<p><b>AM 7 steps:</b> initial cleaning/inspection → eliminate contamination sources → provisional standards → general inspection training → general inspections → workplace management &amp; control → advanced improvement</p>`,
      answer: `
<p>TPM is productive maintenance with everyone's participation: condition-based systematic maintenance activities that combine planned maintenance approaches with design–life cycle cost principles to improve reliability and maintainability (attitude: “we are all responsible for our equipment”).
<b>Content:</b> (1) Design for maintenance; (2) Planned maintenance (periodic + predictive); (3) Autonomous maintenance – lubricating, tightening and cleaning tasks are given to operators via one-point lessons and machine maps (7 steps from initial cleaning to advanced improvement);
(4) F-tags (failure tags) to mark and track abnormalities; (5) Maintenance performance management – OEE, MTBF, MTTR; plus visual maintenance management.
In short: TPM = Design for Maintenance + Planned Maintenance (Periodic + Predictive) + Autonomous Maintenance + Visual Maintenance Management. Pillars: Jishu Hozen, Kobetsu Kaizen, planned maintenance, quality maintenance, training, office TPM, safety–health–environment, built on 5S.</p>`,
      traps: `
<ul><li>Planned maintenance = <b>Periodic + Predictive</b> (s.173 formülünde).</li>
<li>Jishu Hozen = <b>autonomous</b> maintenance; Kobetsu Kaizen = focused improvement.</li>
<li>Availability ↑ = reliability (arıza sayısı ↓) + maintainability (onarım süresi ↓).</li>
<li>TPM'in temeli <b>5S</b>.</li></ul>`,
    },
    // ------------------------------------------------------------------ 16
    {
      id: 'oee',
      n: 16,
      title: 'OEE formula',
      tr: 'OEE formülü',
      src: 'LEAN s.183–190',
      link: '2.10',
      lesson: `
<p>Hedef: <b>OEE'yi maksimize etmek</b> → üç kayıp grubunu minimize etmek (s.184):
<b>Time losses</b> (ekipman arızaları; setup ve ayar süreleri) · <b>Speed losses</b> (makinenin beklenen hızındaki düşüş; kısa duruşlar) · <b>Quality losses</b> (hatalı parça, yeniden işleme, hurda).</p>
<div class="model">OEE = Availability × Performance Efficiency × Quality Ratio            (s.185)

Net available run time (loading time) = Gross time available − Planned downtime
        planned downtime: molalar (öğle, çay), planlı bakım
Availability   = (Net available run time − Downtime losses) / Net available run time
               = (loading time − downtime) / loading time
        downtime losses: setup süreleri, makine arıza süreleri               (s.187)
Performance    = Theoretical cycle time / Realized cycle time                 (s.188)
               = theoretical cycle time × processed amount / operating time   (s.189)
Quality ratio  = Total number of quality products / Total number of products produced
               = (processed amount − defect amount) / processed amount       (s.186, s.189)</div>
<h3>Six big losses (s.189)</h3>
<table>
<tr><th>Zaman zinciri</th><th>Kayıp grubu</th><th>Six big losses</th><th>Etkilediği</th></tr>
<tr><td>Loading time → Operating time</td><td>Downtime losses</td><td>1 Equipment failure · 2 Setup and adjustment</td><td>Availability</td></tr>
<tr><td>Operating → Net operating time</td><td>Speed losses</td><td>3 Idling and minor stoppages · 4 Reduced speed</td><td>Performance</td></tr>
<tr><td>Net operating → Valuable operating time</td><td>Defect losses</td><td>5 Defects in process · 6 Reduced yield</td><td>Quality</td></tr>
</table>
<h3>Notlardaki örnek (s.189)</h3>
<div class="model">Availability = (460 − 60) / 460 × 100 = 86.96% ≈ 87%
Performance  = 0.5 min/unit × 400 units / 400 min × 100 = 50%
Quality      = (400 − 8) / 400 × 100 = 98%
OEE          = 0.87 × 0.50 × 0.98 × 100 = 42.6%</div>
<p>Kontrol: OEE = valuable operating time / loading time = 0.5 × 392 / 460 = 196 / 460 = 42.61%.</p>
<p><b>Performance'ın anlamı:</b> makine yaşlandıkça gerçekleşen çevrim süresi uzar; bakım bunu bir ölçüde önler (s.188).
Örnekte gerçekleşen çevrim = 400 dk / 400 adet = 1 dk/adet, teorik 0.5 → %50.</p>
<p><b>MTBF / MTTR</b> (s.183) performans ölçütleridir. <span class="muted">(Notlarda formül yok; literatürde MTBF = toplam çalışma süresi / arıza sayısı, MTTR = toplam onarım süresi / onarım sayısı, availability = MTBF / (MTBF + MTTR).)</span></p>
<p><b>OEE grafiği</b> (s.190): TV fabrikasında aylık OEE (%59–78) ile availability, performance ve quality oranları ayrı ayrı izlenir; en düşük faktör iyileştirme önceliğini gösterir.</p>`,
      memo: `
<div class="model">OEE = A × P × Q
A = (loading time − downtime) / loading time        loading = gross − planned downtime
P = theoretical CT × processed amount / operating time   (= theoretical CT / realized CT)
Q = (processed − defects) / processed
e.g. 460, 60 → 87% · 0.5 × 400 / 400 → 50% · 392 / 400 → 98% · OEE = 42.6%</div>
<p>Six big losses: failure · setup &amp; adjustment | idling &amp; minor stoppages · reduced speed | defects in process · reduced yield</p>`,
      answer: `
<p>OEE = Availability × Performance efficiency × Quality ratio.
Availability = (loading time − downtime losses) / loading time, where loading time (net available run time) = gross time − planned downtime (breaks, planned maintenance) and downtime losses are setups and breakdowns.
Performance efficiency = theoretical cycle time × processed amount / operating time (= theoretical / realized cycle time).
Quality ratio = (processed amount − defect amount) / processed amount.
Example: A = (460 − 60) / 460 = 87%, P = 0.5 × 400 / 400 = 50%, Q = (400 − 8) / 400 = 98%, OEE = 0.87 × 0.50 × 0.98 = 42.6%.
The six big losses: equipment failure, setup &amp; adjustment (availability); idling &amp; minor stoppages, reduced speed (performance); defects in process, reduced yield (quality).</p>`,
      traps: `
<ul><li>Planlı duruş (mola, planlı bakım) <b>OEE kaybı değildir</b>: loading time'dan önce düşülür.</li>
<li>Setup süresi <b>availability</b> kaybıdır (performance değil).</li>
<li>Performance paydası <b>operating time</b> (loading time değil).</li>
<li>Kısa duruşlar → <b>performance</b>; uzun arıza → <b>availability</b>.</li>
<li>Yüzdeleri çarparken oranla çarp: 0.87 × 0.50 × 0.98 (87 × 50 × 98 değil).</li></ul>`,
    },
    // ------------------------------------------------------------------ 17
    {
      id: 'mstrat',
      n: 17,
      title: 'Maintenance strategy selection criteria',
      tr: 'Bakım stratejisi seçim kriterleri',
      src: 'LEAN s.163–169',
      link: '2.9',
      lesson: `
<h3>Bakım türleri (s.167)</h3>
<ul>
<li><b>Corrective maintenance</b> (düzeltici): arıza olduktan sonra onarım.</li>
<li><b>Planned maintenance</b> (planlı): önceden planlanan bakım faaliyetleri.</li>
<li><b>Periodic maintenance</b> (periyodik): belirli zaman/kullanım aralıklarıyla yapılan bakım.</li>
<li><b>Predictive maintenance</b> (kestirimci): ekipmanın durumunu izleyerek (titreşim, sıcaklık vb.) arızayı öngörüp zamanında bakım <span class="muted">(açıklamalar notlarda yok)</span>.</li>
</ul>
<h3>Bakım türü seçim kriterleri (s.168 — 4 madde, sırasıyla ezberle)</h3>
<ol>
<li><b>Cost of part</b> — parçanın maliyeti</li>
<li><b>Maintenance time of the part</b> — parçanın bakım (onarım) süresi</li>
<li><b>Supply time of the part</b> — parçanın tedarik süresi</li>
<li><b>Criticality (importance) of the part in overall system</b> — parçanın tüm sistemdeki kritikliği</li>
</ol>
<h3>Kriterler stratejiyi nasıl yönlendirir? <span class="muted">(yorum — notlarda yok)</span></h3>
<table>
<tr><th>Durum</th><th>Uygun strateji</th></tr>
<tr><td>Ucuz, hızlı değiştirilen, kolay tedarik edilen, kritik olmayan parça</td><td><b>Corrective</b> (arızada değiştir) — önleyici bakımın maliyeti faydasından fazla</td></tr>
<tr><td>Arızası sistemi durduran (kritik), onarımı uzun süren parça</td><td><b>Planned / periodic</b> ya da <b>predictive</b> — arızayı önceden önle</td></tr>
<tr><td>Pahalı ve tedarik süresi uzun parça</td><td><b>Predictive</b> (ömrünü sonuna kadar kullan, ihtiyacı önceden gör) + yedek parça planlaması</td></tr>
<tr><td>Arıza belirtisi ölçülebilen (titreşim, ısı), pahalı, kritik ekipman</td><td><b>Predictive / condition-based</b></td></tr>
</table>
<h3>Maliyet dengesi (s.166)</h3>
<p>Bakım seviyesi arttıkça <b>planlı bakım maliyeti artar</b>, <b>düzeltici bakım (arıza) maliyeti azalır</b>. Toplam maliyeti en küçükleyen optimum bakım seviyesi <b>M*</b>'dır — ne hiç bakım ne de aşırı bakım.</p>
<h3>RAMS metodolojisi (s.169)</h3>
<p><b>R</b>eliability · <b>A</b>vailability · <b>M</b>aintainability · <b>S</b>afety.</p>`,
      memo: `
<ol><li><b>Cost</b> of part</li><li><b>Maintenance time</b> of the part</li><li><b>Supply time</b> of the part</li><li><b>Criticality</b> (importance) of the part in the overall system</li></ol>
<p class="tip">Hafıza: <b>C-M-S-C</b> → “Cost, Maintenance time, Supply time, Criticality”</p>
<p>Types: corrective · planned · periodic · predictive · Cost graph: planned cost ↑, corrective cost ↓ → optimum <b>M*</b> · RAMS = Reliability, Availability, Maintainability, Safety</p>`,
      answer: `
<p>The maintenance types are corrective, planned, periodic and predictive maintenance. The type is selected according to four criteria:
(1) the <b>cost of the part</b>, (2) the <b>maintenance (repair) time of the part</b>, (3) the <b>supply time of the part</b>, and (4) the <b>criticality (importance) of the part in the overall system</b>.
For a cheap, easily supplied, quickly replaced and non-critical part, corrective maintenance is economical; for critical parts with long repair or supply times, planned/periodic or predictive maintenance is preferred.
As the maintenance level increases, planned maintenance cost rises while corrective maintenance cost falls; the optimum maintenance level M* minimizes the total cost. The RAMS methodology considers reliability, availability, maintainability and safety.</p>`,
      traps: `
<ul><li>4 kriterin hepsi <b>parça (part)</b> ile ilgili: cost, maintenance time, supply time, criticality.</li>
<li>Bakım türleri 4'tür: corrective, planned, periodic, predictive.</li>
<li>M* grafiğinde planlı bakım maliyeti <b>artan</b>, düzeltici bakım maliyeti <b>azalan</b> eğridir.</li></ul>`,
    },
  ];

  IM.exam.topicById = (id) => IM.exam.topics.find((t) => t.id === id);
})();
