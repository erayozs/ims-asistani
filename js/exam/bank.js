/* Sınav Hazırlık · soru bankası
   IM.exam.cards     — ezber (aktif hatırlama) kartları:
       { id, topic, prompt, ordered?, items: [[görünen, regex|null], …], note? }
       regex katlanmış (fold) metne uygulanır: küçük harf, Türkçe harfler sadeleşmiş (ç→c, ğ→g, ı→i, ö→o, ş→s, ü→u), noktalama → boşluk.
   IM.exam.questions — sınav soruları (soru metni İngilizce, sınavdaki gibi):
       open     : { rubric: [[puan, 'ölçüt', regex], …], cap?, model? (yoksa konunun answer'ı) }
       order    : { items: [doğru sıradaki metinler] }                        puan = LCS / n
       match    : { pairs: [[sol, sağ], …] }                                  her eşleşme eşit puan
       classify : { cats: [...], items: [[metin, katIdx], …] }               her öge eşit puan
       mcq      : { options: [...], answer: idx | [idx…] }                    çoklu: doğru seçim − yanlış seçim (≥0)
       calc     : { gen: 'agv' | 'oee' | 'kanban' }                           js/exam/calc.js üretir
   pts: sorunun ham puanı (tam sınavda toplam 100'e ölçeklenir). */
(function () {
  const IM = window.IM;
  IM.exam = IM.exam || {};

  // ------------------------------------------------------------------ ezber kartları
  IM.exam.cards = [
    // 1 AGV
    { id: 'agv-steps', topic: 'agv', ordered: true, prompt: 'Gerekli AGV sayısını bulmanın <b>5 adımı</b> (sırasıyla).',
      items: [
        ['Round-trip travel time from storage to each destination', 'round ?trip|gidis ?donus|(d \\+ d)|travel time|seyir'],
        ['Add loading and unloading time', 'load|yukle|bosalt'],
        ['Multiply by frequency of trips → total vehicle use time', 'frequen|siklik|sefer|total vehicle use|kullanim'],
        ['Divide by traffic congestion factor (0.85)', 'congestion|0 85|trafik|sikisik'],
        ['Divide by 60 min/h → number of vehicles, round up', '\\b60\\b|round up|yukari|tavan|ceil'],
      ] },
    { id: 'agv-formula', topic: 'agv', prompt: 'Hücre başına saatlik AGV kullanımı, toplam yük ve araç sayısı <b>formülleri</b>.',
      items: [
        ['usage = [(d + d) × f / v] + (f × t × 2)', null],
        ['total load = Σ usage / 0.85', null],
        ['N = ⌈ total load / 60 ⌉', null],
        ['Notlardaki örnek: 98 + 176 + 60 + 96 = 430 → 505.88 → 8.43 → 9', null],
      ] },
    // 2 Waste
    { id: 'waste7', topic: 'waste', ordered: true, prompt: '<b>7 israf türü</b> (slayt sırasıyla) + en büyük israf.',
      items: [
        ['Overproduction', 'over ?produc|asiri uretim|fazla uretim'],
        ['Waiting', 'wait|bekle'],
        ['Transportation', 'transport|tasima'],
        ['Process (over-processing)', 'process|islem'],
        ['Inventory', 'inventor|stok|envanter'],
        ['Motion', 'motion|hareket'],
        ['Defects', 'defect|hata|kusur|hurda'],
        ['Biggest waste: unused human intelligence and talent', 'intelligen|talent|zeka|yetenek|human'],
      ] },
    { id: 'muda', topic: 'waste', prompt: '<b>Muda, Muri, Mura</b> ne demek? Holding cost formülü ve sembolleri?',
      items: [
        ['Muda = waste (anything beyond the minimum required to add value)', 'muda.{0,15}(waste|israf)'],
        ['Muri = overload (beyond capacity)', 'muri.{0,15}(overload|asiri yuk|yuk)'],
        ['Mura = variability (irregular plan / quantity)', 'mura.{0,15}(variab|dalgalan|degisken|uneven|fluct)'],
        ['h = i + s (i: rate of return on investment, s: warehouse operation cost rate)', 'h ?= ?i ?\\+ ?s'],
      ] },
    { id: 'inv-harm', topic: 'waste', prompt: 'Aşırı stokun (excessive inventory) <b>5 zararı</b>.',
      items: [
        ['Excessive holding cost', 'holding|elde tutma|maliyet|cost'],
        ['Risk of wear, tear and expiration', 'wear|tear|expir|yipran|eskime|son kullanma'],
        ['Excessive space requirement', 'space|alan|yer'],
        ['Planning, capacity management and delivery performance decrease', 'planning|capacity|delivery|planlama|kapasite|teslim'],
        ['It hides business problems', 'hide|hidden|gizle|sakla'],
      ] },
    // 3 Tools
    { id: 'house', topic: 'tools', prompt: '<b>House of Lean</b> (s.14): çatı, üst kat, 12 araç, basamak, temel.',
      items: [
        ['Roof: Continuous Improvement', 'continuous improvement|surekli iyilestirme|kaizen'],
        ['6 Sigma Root Cause Problem Solving', 'sigma|root cause|kok neden'],
        ['Pull/Kanban', 'pull|kanban'],
        ['Cellular/Flow', 'cellular|cell|flow|hucre|akis'],
        ['TPM', 'tpm|productive maint'],
        ['Quality at Source', 'quality at source|kaynakta kalite'],
        ['POUS – Point of Use Storage', 'pous|point of use'],
        ['Quick Set-up', 'quick set|set ?up|smed|hazirlik'],
        ['Lot Size Reduction', 'lot size|batch size|parti'],
        ['Standardized Work', 'standardi[sz]ed work|standart is'],
        ['Teams', 'team|takim|ekip'],
        ['5S System', '5 ?s'],
        ['Visual Control', 'visual|gorsel'],
        ['Plant Layout', 'layout|yerlesim'],
        ['Steps: Value Stream Mapping · Base: Culture', 'value stream|vsm|deger akis'],
      ] },
    { id: 'tool-obj', topic: 'tools', prompt: 'Her aracın <b>amacı tek cümle</b>: VSM, 5S, SMED, Kanban, TPM, Poka-Yoke, Visual Mgmt, Layout/Cell, Kaizen.',
      items: [
        ['VSM: map material & information flow, reveal value-added / non-value-added, plan the future state', null],
        ['5S: organised, clean, high-performance workplace; basis of other improvements', null],
        ['SMED: reduce setup time (<10 min) → save capacity, enable small batches', null],
        ['Kanban: trigger production by actual demand, not a schedule', null],
        ['TPM: maximize OEE by improving reliability & maintainability with everyone', null],
        ['Poka-Yoke: design product/process so that human mistakes are not allowed', null],
        ['Visual mgmt: realize problems & act quickly; current vs planned performance', null],
        ['Layout / Cell: improve material & information flow, reduce transportation', null],
        ['Kaizen: continuous improvement through many small improvements by everyone', null],
      ] },
    // 4 Roadmap
    { id: 'roadmap', topic: 'roadmap', ordered: true, prompt: '<b>Lean Roadmap</b> ana akışının 7 adımı (sırasıyla).',
      items: [
        ['Determining Product Family', 'product family|urun ailesi'],
        ['Current State VSM', 'current state (value stream|vsm|map)|mevcut durum'],
        ['Future State VSM', 'future state|gelecek durum'],
        ['Current State Spaghetti Diagram', 'spag+h?etti|spagetti'],
        ['Layout Planning (Cellular Mfg, Lines) and Execution', 'layout|yerlesim|cellular|hucre'],
        ['5S', '5 ?s'],
        ['Pull System (Kanban, CONWIP, POLCA)', 'pull|kanban|conwip|polca|cekme'],
      ] },
    { id: 'roadmap-side', topic: 'roadmap', prompt: "Roadmap'teki <b>yan kutular</b> ve içerikleri; SMED nereye bağlanır?",
      items: [
        ['SMED → Pull System', 'smed'],
        ['Poka-Yoke', 'poka'],
        ['Visual Management: Asakai, Oobeya, Lean Management Boards, Andon', 'asakai|oobeya|obeya|andon'],
        ['Continuous Improvement (Kaizen): A3 reports, Suggestion System', 'a3|suggestion|oneri'],
      ] },
    // 5 5S
    { id: '5s', topic: '5s', ordered: true, prompt: "<b>5S adımları</b> — Japonca + İngilizce (sırasıyla).",
      items: [
        ['Seiri – Sort', 'seiri|sort'],
        ['Seiton – Simplify (set in order)', 'seiton|simplif|set in order'],
        ['Seiso – Shine', 'seiso|seise|shine|clean'],
        ['Seiketsu – Standardize', 'seiketsu|standard'],
        ['Shitsuke – Training & Discipline', 'shitsuke|discipline|training|sustain'],
      ] },
    { id: '5s-detail', topic: '5s', prompt: '5S ayrıntıları: Seiton 3 keys, 30 sn kuralı, kullanım sıklığı, Seiso 5 adım, Seiketsu 3 ilke.',
      items: [
        ['3 Keys: Where? What? How many?', 'where|what|how many|nerede|ne kadar'],
        ['Anyone immediately: see – receive – replace (30-second rule)', '30'],
        ['Always → close · Sometimes → a little far · Rarely → another place', 'always|sometimes|rarely|sik|nadir'],
        ['Seiso: what → who → method → equipment → clean', 'who|kim|method|yontem'],
        ['Seiketsu: no unnecessary material · no disorder · no dust and dirt', 'unnecessary|disorder|dust|dirt|gereksiz|toz|kir'],
      ] },
    { id: '5s-benefit', topic: '5s', prompt: "5S'in <b>6 faydası</b> (s.62).",
      items: [
        ['Reduces motion wastes', 'motion|hareket'],
        ['Saves space', 'space|alan'],
        ['Promotes occupational health and safety', 'safety|health|guvenlik|saglik'],
        ['Reduces breakdowns', 'break ?down|ariza'],
        ['Improves image of the company', 'image|imaj'],
        ['Improves belonging of employees', 'belong|aidiyet|sahiplen'],
      ] },
    // 6 SMED
    { id: 'smed', topic: 'smed', ordered: true, prompt: "<b>SMED'in 4 aşaması</b> (Stage 0–3) ve her birinin özü.",
      items: [
        ['Stage 0: internal & external not distinguished (video, interviews, setup analysis)', 'not distinguish|ayrilmamis|ayirt|stage 0|video'],
        ['Stage 1: separate internal & external — most important (checklist)', 'separat|ayir'],
        ['Stage 2: convert internal to external (30–50%)', 'convert|donustur'],
        ['Stage 3: improve all aspects (radical improvements)', 'improve all|all aspects|radical|tum yon|iyilestir'],
      ] },
    { id: 'smed-def', topic: 'smed', prompt: 'Setup time tanımı; SMED / OTED / NOTED.',
      items: [
        ['Setup time: last product of previous batch → first acceptable product of next batch', 'last|first acceptable|son urun|ilk (saglam|kabul)'],
        ['SMED < 10 min (Single-Minute Exchange of Die)', '10'],
        ['OTED < 1 min (One-Touch Exchange of Die)', 'oted|one ?touch|\\b1 (min|dk|dakika)'],
        ['NOTED = automated (Non-Touch Exchange of Dies)', 'noted|non ?touch|automat|otomatik'],
      ] },
    { id: 'smed-radical', topic: 'smed', prompt: 'Stage 3 radikal iyileştirme örnekleri (external ve internal).',
      items: [
        ['External: machine-assigned tools, visual die/tool storage, specialized die car, multi feeders', 'die car|araba|assigned|storage|depolama'],
        ['Internal: parallel workers (teamwork)', 'parallel|paralel|team'],
        ['Internal: clamping without tightening', 'clamp|bagla|sikma'],
        ['Internal: standardization of dies / heights', 'standard|height|yukseklik'],
        ['Internal: centering, positioning pins, colour–number coding', 'pin|center|merkez|colou?r|renk'],
      ] },
    // 7 Kanban
    { id: 'kanban-sys', topic: 'kanban', ordered: true, prompt: "Kanban uygulamasının <b>çalışma sistematiği</b> — 5 adım (Büyük kutu ↔ şalter hücreleri).",
      items: [
        ['Assembly cell needs a switch → logistics operator goes to the switch supermarket', 'supermarket|lojistik|logistic'],
        ['Hangs the production kanban (from the basket) on the hanger of the producing switch cell', 'hang|as(ar|ilir|mak)|hanger|aski|board|pano'],
        ['Carries the basket to the big box assembly cells', 'carr|basket|sepet|gotur|tasi'],
        ['Kanban in the red zone → production starts immediately', 'red|kirmizi'],
        ['Produced switches + kanban → back to their supermarket address', 'address|adres|back|geri'],
      ] },
    { id: 'kanban-princ', topic: 'kanban', prompt: 'Kanban <b>çalışma prensipleri</b> (s.126) — en az 6.',
      items: [
        ['No production without a production kanban', 'no production|without|kanbansiz|kanban olmadan'],
        ['Rarely produced items (630 A switches) are not on kanban', 'rare|nadir|630'],
        ['Same family: shortest deadline first', 'deadline|termin|shortest|en kisa'],
        ['Take the kanban and hang it before taking the product from the supermarket', 'before|once'],
        ['Kanbans only in defined locations (supermarket, hanger)', 'defined|tanimli|location'],
        ['Team leaders check kanban numbers every week', 'week|hafta|leader|lider'],
        ['Only defined products at coded supermarket addresses', 'coded|kodlu|address|adres'],
        ['FIFO', 'fifo|first in'],
        ['No defective product is sent', 'defect|hatali|kusurlu'],
      ] },
    { id: 'kanban-formula', topic: 'kanban', prompt: 'Kanban sayısı formülü, sembolleri ve KCS bileşenleri.',
      items: [
        ['KS = ⌈ OT × (1 + α) × KCS / KB ⌉ (round up)', null],
        ['OT: average demand · α: reliability coefficient · KB: pieces per container', null],
        ['KCS = wait in receiving box + transfer to order box + wait in order box + batch processing cycle (prep + processing + in-cell wait) + transfer to supermarket + wait in supermarket', null],
        ['One kanban per container · SYK 160: 0.059 × 1.3 × 892 / 8 = 8.59 → 9 · inventory 396 → 90 (77%)', null],
      ] },
    { id: 'kanban-card', topic: 'kanban', prompt: '<b>Kanban kartındaki 9 bilgi</b> ve kanban panosu renkleri.',
      items: [
        ['Store shelf number', 'shelf|raf'],
        ['Kanban number', 'kanban (no|number)'],
        ['Item (part) number', 'item number|part number|parca no'],
        ['Item name', 'item name|parca adi|name'],
        ['Car type', 'car|arac'],
        ['Box (container) capacity', 'capacity|kapasite'],
        ['Box type', 'box type|kutu tip|type'],
        ['Preceding process', 'preced|onceki'],
        ['Subsequent process', 'subsequent|sonraki'],
        ['Board: red = urgent, yellow = less urgent, green = not urgent', 'red|kirmizi|yellow|sari|green|yesil'],
      ] },
    // 8 Visual mgmt
    { id: 'visual-def', topic: 'visual', prompt: 'Görsel yönetim <b>tanımı</b> ve en az 6 teknik.',
      items: [
        ['Simple lean techniques to realize problems and take action quickly', 'quick|hizli|realiz|fark'],
        ['Awareness of current performance vs planned performance', 'current performance|planned performance|plan.{0,40}(vs|versus|compar|kars|gercek|actual)|(actual|gercek|mevcut).{0,40}plan'],
        ['Asakai boards (Task Assignment + QCDSM)', 'asakai|task|gorev'],
        ['Production scoreboard / Lean main board / Cell board', 'score|board|pano'],
        ['Skill matrix & 3×3×3 rule', 'skill|beceri|yetkinlik'],
        ['Colour coding', 'colou?r|renk'],
        ['Poka-Yoke', 'poka'],
        ['Kanban board / Andon / work instruction / red tag', 'andon|kanban|instruction|talimat|red tag'],
      ] },
    { id: 'pokayoke', topic: 'visual', prompt: '<b>Poka-Yoke</b> tanımı ve 5 aracı; skill matrix seviyeleri; 3×3×3.',
      items: [
        ['Poka = careless mistake, Yoke = prevent; design so human mistake is not allowed', 'mistake|hata'],
        ['Tools: sensors · light/sound warnings · asymmetry · colour coding · number coding', 'sensor|asym|asimetri|light|sound'],
        ['Skill levels: with team leader inspection → alone → can train → can improve', 'train|alone|improve|egit|tek basina'],
        ['3×3×3: each worker ≥3 jobs, each job ≥3 workers', '3'],
        ['83% of information is gathered by sight', '83'],
      ] },
    // 9 Cell
    { id: 'cell-def', topic: 'cell', prompt: 'Hücresel üretimin <b>tanımı</b> (s.30) — 4 anahtar öge.',
      items: [
        ['Groups of processes, people and machines', 'process|people|machine|insan|makine'],
        ['For manufacturing certain groups of parts (part families)', 'famil|aile'],
        ['With similar manufacturing characteristics', 'similar|benzer'],
        ['In separate places (cells) within the system', 'separate|ayri|cell|hucre'],
      ] },
    { id: 'cell-ben', topic: 'cell', prompt: 'Hücresel üretimin <b>faydaları</b> — en az 6.',
      items: [
        ['Less transportation / material handling', 'transport|handling|tasima'],
        ['Shorter lead time', 'lead ?time|teslim sure|tedarik sure|sure kisal'],
        ['Less WIP inventory', 'wip|inventor|stok'],
        ['Saved space', 'space|alan'],
        ['Shorter setups (similar parts)', 'set ?up|hazirlik'],
        ['Better quality / faster defect feedback', 'qualit|defect|kalite|hata'],
        ['Simpler planning & visual control', 'plan|control|kontrol'],
        ['Teamwork, multi-skilled workers, ownership', 'team|skill|takim|beceri|sahiplen|motiv'],
        ['Flexibility, lower cost', 'flexib|esnek|cost|maliyet'],
      ] },
    // 10 One piece flow
    { id: 'opf', topic: 'opf', prompt: '<b>Tek parça akışının faydaları</b> — en az 6 (+ notlardaki küçük parti faydaları).',
      items: [
        ['Shorter lead time', 'lead ?time|teslim suresi|uretim suresi|sure(si)? kisal'],
        ['Less WIP / inventory', 'wip|inventor|stok'],
        ['Defects detected immediately (quick realization of defects)', 'defect|hata|kusur'],
        ['Saves space', 'space|alan'],
        ['Less transportation and handling', 'transport|handling|tasima'],
        ['Problems become visible', 'visible|problem|gorun|sorun'],
        ['Flexibility to demand changes; no overproduction', 'flexib|esnek|overprod|talep'],
        ['Higher productivity, lower cost', 'productiv|verim|cost|maliyet'],
      ] },
    // 11 Setup
    { id: 'setup-def', topic: 'setup', prompt: '<b>Internal</b> ve <b>external</b> setup tanımları + birer örnek.',
      items: [
        ['Internal: can only be done after stopping the machine', '(stop|dur)'],
        ['e.g. mounting / dismounting dies', 'mount|sok|tak'],
        ['External: can be done while the machine is operating', '(operat|work|run|calis)'],
        ['e.g. transporting dismounted dies to storage, conveying next dies to the machine', 'transport|convey|storage|tasi|depo|getir'],
      ] },
    // 12 Push/Pull
    { id: 'pushpull', topic: 'pushpull', prompt: 'Push ↔ Pull karşılaştırma tablosu (s.109) — 7 satır + tanımlar.',
      items: [
        ['Push schedules job entry based on demand · Pull: entry & progression by state of the system', 'state|durum'],
        ['Office ↔ Field', 'office|field|ofis|saha'],
        ['Deterministic ↔ Stochastic', 'determin|stochas|stokas'],
        ['Neglects unexpected ↔ considers unexpected (breakdowns)', 'unexpect|beklenmeyen|breakdown|ariza'],
        ['Planner sends orders periodically ↔ recalculates kanbans when demand changes, autonomous', 'planner|planlayici|autonom|otonom'],
        ['High space, cycle inventory, lead time ↔ improves them', 'space|inventor|lead|alan|stok'],
        ['High demand variability: push works, pull problematic', 'demand variab|talep degis|variab'],
        ['High product variety: push works, pull problematic', 'variety|cesit'],
      ] },
    // 13 A3
    { id: 'a3', topic: 'a3', ordered: true, prompt: '<b>A3 rapor şablonu</b> — 8 bölüm (sol sütun → sağ sütun) ve içerikleri.',
      items: [
        ['The problem — through the customer’s eyes', 'problem'],
        ['Background — context and importance', 'background|arka ?plan|context|baglam'],
        ['Current condition — chart from direct observation', 'current|mevcut'],
        ['Cause analysis — 5-Whys, fishbone', 'cause|neden|why|fishbone|balik'],
        ['Target condition — new ideal process via countermeasures', 'target|hedef'],
        ['Implementation plan — What? Who? When? Where?', 'implement|uygulama|who|kim'],
        ['Follow-up plan — anticipated performance, when to measure', 'follow|takip'],
        ['Results — measurement & date, variance from predicted', 'result|sonuc'],
      ] },
    { id: 'kaizen', topic: 'a3', prompt: 'Kaizen tanımı, Batı ↔ Kaizen yaklaşımı, öneri sistemi puanları.',
      items: [
        ['KAI = change, ZEN = good/better; continuous improvement involving everyone (Imai)', 'change|degisim|everyone|herkes'],
        ['Western: big leaps after R&D · Kaizen: many small improvements', 'small|kucuk|leap|sicrama'],
        ['Points: implement 4/8/16 · suggest 2/4/8 · problem finding 1/2/4 · 40 points → reward', '40'],
      ] },
    // 14 VM tools
    { id: 'vmtools', topic: 'vmtools', prompt: '7 görsel yönetim aracını birer cümleyle tanımla: Asakai, Oobeya, Andon, Main Lean Board, Cell Board, Performance Scoreboard, QCDSM.',
      items: [
        ['Asakai: daily morning shop-floor meeting at the boards', 'asakai'],
        ['Oobeya: “big room” / war room with visual KPIs & projects', 'oobeya|obeya'],
        ['Andon: light/sound signal of line status, call for help', 'andon'],
        ['Main lean board: plant-level lean status (PPM, projects, 5S, kaizen)', 'main|ana'],
        ['Cell board: cell leader, team, standards, skill matrix, cell KPIs', 'cell|hucre'],
        ['Performance scoreboard: target, actual, status, effectiveness = actual / target', 'score|target|hedef'],
        ['QCDSM: Quality, Cost, Delivery, Safety, Morale', 'qcdsm'],
      ] },
    { id: 'qcdsm', topic: 'vmtools', ordered: true, prompt: '<b>QCDSM</b> harfleri ve panoda izlenen göstergeler; renk kodu.',
      items: [
        ['Q – Quality: customer quality claims', 'qualit|kalite|claim|sikayet'],
        ['C – Cost: non-quality cost (delivery, scrap, waste man-hour)', 'cost|maliyet'],
        ['D – Delivery: on-time delivery performance', 'deliver|teslim'],
        ['S – Safety: job safety, environment', 'safety|guvenlik|environment|cevre'],
        ['M – Morale: 5S, absenteeism, suggestions, overtime', 'moral|absent|devamsiz|suggest|overtime|mesai|5 ?s'],
        ['Green = result 0 · Red = result > 0 · Blue = weekend/holiday', 'green|yesil|red|kirmizi'],
      ] },
    // 15 TPM
    { id: 'tpm-content', topic: 'tpm', prompt: "<b>Content for TPM</b> (s.171, 5 madde) ve s.173 formülü.",
      items: [
        ['Design for maintenance', 'design|tasarim'],
        ['Planned maintenance (periodic + predictive)', 'planned|planli'],
        ['Autonomous maintenance (lubricating, tightening, cleaning by operators; one-point lessons, machine maps)', 'autonom|otonom|self|jishu'],
        ['F-tags', 'f ?tag|failure tag|ariza etiket'],
        ['Maintenance performance management (OEE, MTBF, MTTR)', 'oee|mtbf|mttr|performance'],
        ['+ Visual maintenance management (s.173)', 'visual|gorsel'],
      ] },
    { id: 'tpm-pillars', topic: 'tpm', prompt: '<b>TPM sütunları</b> (s.174) ve temeli.',
      items: [
        ['Jishu Hozen (autonomous maintenance)', 'jishu|autonom|otonom'],
        ['Kobetsu Kaizen (focused improvement)', 'kobetsu|focused'],
        ['Planned Maintenance', 'planned|planli'],
        ['Quality Maintenance', 'quality|kalite'],
        ['Training', 'training|egitim'],
        ['Office TPM', 'office|ofis'],
        ['Safety, Health & Environment', 'safety|health|environment|guvenlik|saglik|cevre'],
        ['Foundation: 5S', '5 ?s'],
      ] },
    { id: 'am7', topic: 'tpm', ordered: true, prompt: '<b>Autonomous maintenance 7 adımı</b> (sırasıyla).',
      items: [
        ['Conduct initial cleaning / inspection', 'initial|ilk|clean|temiz'],
        ['Eliminate sources of contamination', 'contamina|kirlilik|kaynak'],
        ['Establish provisional standards', 'provisional|gecici'],
        ['Develop general inspection training', 'training|egitim'],
        ['Conduct general inspections', 'conduct general|general inspections|genel muayeneleri|genel muayene yap'],
        ['Improve workplace management and control', 'workplace|isyeri|management|yonetim'],
        ['Participate in advanced improvement activities', 'advanced|ileri'],
      ] },
    { id: 'maint-def', topic: 'tpm', prompt: 'Maintainability, reliability, availability tanımları; TPM paradigma değişimi.',
      items: [
        ['Maintainability: ease of repair / modification', 'ease|kolay'],
        ['Reliability: ability to perform a required function under stated conditions for a specified period', 'ability|period|sure|yetenek'],
        ['Availability: operable & committable at the start of a mission; ↑ by reliability (fewer failures) + maintainability (shorter repair)', 'operable|committable|hazir|start'],
        ['Old: “I operate, you fix…” → TPM: “We are all responsible for our equipment, plant and future”', 'responsib|sorumlu|all|hepimiz'],
      ] },
    // 16 OEE
    { id: 'oee-formula', topic: 'oee', prompt: '<b>OEE formülü</b> ve A, P, Q tanımları; notlardaki örnek.',
      items: [
        ['OEE = Availability × Performance efficiency × Quality ratio', null],
        ['A = (loading time − downtime) / loading time; loading = gross − planned downtime', null],
        ['P = theoretical CT × processed amount / operating time (= theoretical CT / realized CT)', null],
        ['Q = (processed − defects) / processed', null],
        ['460 − 60 → 87% · 0.5 × 400 / 400 → 50% · 392 / 400 → 98% · OEE = 42.6%', null],
      ] },
    { id: 'six-losses', topic: 'oee', ordered: true, prompt: '<b>Six big losses</b> ve hangi faktörü etkiledikleri.',
      items: [
        ['1 Equipment failure (A)', 'failure|breakdown|ariza'],
        ['2 Setup and adjustment (A)', 'set ?up|adjust|ayar|hazirlik'],
        ['3 Idling and minor stoppages (P)', 'idl|minor|kisa durus|stoppage'],
        ['4 Reduced speed (P)', 'speed|hiz'],
        ['5 Defects in process (Q)', 'defect|hata'],
        ['6 Reduced yield (Q)', 'yield|verim'],
      ] },
    // 17 Maintenance strategy
    { id: 'mcrit', topic: 'mstrat', ordered: true, prompt: '<b>Bakım türü seçim kriterleri</b> (4) ve bakım türleri (4).',
      items: [
        ['Cost of part', 'cost|maliyet'],
        ['Maintenance time of the part', 'maintenance time|bakim sure|repair time|onarim'],
        ['Supply time of the part', 'supply|tedarik'],
        ['Criticality (importance) of the part in the overall system', 'critical|kritik|importan|onem'],
        ['Types: corrective · planned · periodic · predictive', 'corrective|predictive|duzeltici|kestirimci'],
      ] },
    { id: 'mcost', topic: 'mstrat', prompt: 'Bakım maliyet grafiği (s.166) ve RAMS.',
      items: [
        ['Maintenance level ↑ → planned maintenance cost ↑, corrective cost ↓', 'planned|corrective|planli|duzeltici'],
        ['Optimum level M* minimizes total cost', 'm\\*|optim'],
        ['RAMS = Reliability, Availability, Maintainability, Safety', 'rams|reliab'],
      ] },
  ];

  // ------------------------------------------------------------------ sınav soruları
  const Q = [];
  const add = (q) => Q.push(q);

  // 1 · AGV ------------------------------------------------------------
  add({ id: 'agv-calc', topic: 'agv', type: 'calc', gen: 'agv', pts: 14, q: 'AGV fleet sizing' });
  add({ id: 'agv-open', topic: 'agv', type: 'open', pts: 8,
    q: 'Explain step by step how the required number of AGVs is determined in a cellular layout. Why is the total vehicle use time <b>divided</b> by the traffic congestion factor?',
    rubric: [
      [1, 'Round-trip travel time (d + d) / v', 'round ?trip|gidis ?donus|d \\+ d|both ways|two ways|iki yon'],
      [1, 'Loading/unloading time added (f × t × 2)', 'load|yukle|bosalt'],
      [1, 'Multiplied by trip frequency → total use time per hour', 'frequen|siklik|sefer|trips'],
      [2, 'Divide by traffic congestion factor (≈0.85)', 'congestion|0 85|trafik'],
      [1, 'Divide total load by 60 min/h', '\\b60\\b'],
      [1, 'Round up to an integer number of vehicles', 'round(ed)? up|yukari|ceil|tavan|integer|tam sayi'],
      [1, 'Reason: congestion/blocking means more time is needed (vehicles are productive only ~85% of the time)', 'block|wait|bekle|interfer|intersec|kavsak|more time|daha fazla|85 ?%|productive|verimli'],
    ] });
  add({ id: 'agv-order', topic: 'agv', type: 'order', pts: 5,
    q: 'Put the solution steps for determining the number of AGVs in the correct order.',
    items: [
      'Determine the round-trip travel time from storage to each destination',
      'Add the time for loading and unloading',
      'Using the frequency of trips, determine the total vehicle use time',
      'Divide by the traffic congestion factor (0.85) to find the total load',
      'Divide the total load by 60 min/h and round up',
    ] });

  // 2 · Waste ------------------------------------------------------------
  add({ id: 'waste-open', topic: 'waste', type: 'open', pts: 8,
    q: 'Define <i>waste</i> in lean production. List the seven types of waste and give a short explanation of each. What is called “the biggest waste”?',
    rubric: [
      [1, 'Waste = activity with no added value (customer not willing to pay)', 'no (added )?value|non ?value|katma deger|value add|willing to pay|deger katmayan'],
      [1, 'Overproduction', 'over ?produc|asiri uretim|fazla uretim'],
      [1, 'Waiting', 'wait|bekle'],
      [1, 'Transportation', 'transport|tasima'],
      [1, 'Process (over-processing)', 'process|islem'],
      [1, 'Inventory', 'inventor|stok'],
      [1, 'Motion', 'motion|hareket'],
      [1, 'Defects', 'defect|hata|kusur|scrap|hurda'],
      [1, 'Biggest waste: unused human intelligence and talent', 'intelligen|talent|zeka|yetenek'],
    ] });
  add({ id: 'waste-match', topic: 'waste', type: 'match', pts: 6,
    q: 'Match each shop-floor observation with the type of waste it represents.',
    pairs: [
      ['1,200 units are produced although the customer ordered 1,000', 'Overproduction'],
      ['The operator stands idle until the automatic cycle of the machine ends', 'Waiting'],
      ['A forklift carries pallets between departments at opposite ends of the plant', 'Transportation'],
      ['A hidden inner surface that the customer never sees is polished to a mirror finish', 'Process (over-processing)'],
      ['Three months of raw material are stocked in the warehouse', 'Inventory'],
      ['The operator bends down and searches the drawer for the right tool', 'Motion'],
      ['Parts are scrapped or reworked at final inspection', 'Defects'],
    ] });
  add({ id: 'waste-mmm', topic: 'waste', type: 'match', pts: 5,
    q: 'Match the terms with their meanings.',
    pairs: [
      ['Muda', 'Anything beyond the minimum resources actually required to add value'],
      ['Muri', 'Overloading machines, equipment and people beyond their capacity'],
      ['Mura', 'Irregular, fluctuating production plans and quantities'],
      ['h (in h = i + s)', 'Holding cost'],
      ['i (in h = i + s)', 'Rate of return on investment'],
      ['s (in h = i + s)', 'Warehouse operation cost rate'],
    ] });

  // 3 · Lean tools ------------------------------------------------------------
  add({ id: 'tools-open', topic: 'tools', type: 'open', pts: 8,
    q: 'Write the objective of each of the following lean tools in <b>one sentence</b>: VSM, 5S, SMED, Kanban, TPM, Poka-Yoke, Visual management, Cellular layout.',
    rubric: [
      [1, 'VSM: map material/information flow, see value-added vs waste, future state', '(vsm|value stream).{0,160}(flow|waste|value|future|akis|israf)'],
      [1, '5S: organised, clean, high-performance workplace / basis', '5 ?s.{0,160}(organi[sz]|clean|tidy|duzen|temiz|basis|temel)'],
      [1, 'SMED: reduce setup time → capacity / small batches', 'smed.{0,160}(setup|set up|hazirlik|batch|parti|capacity)'],
      [1, 'Kanban: produce by actual demand (pull), not schedule', 'kanban.{0,160}(demand|talep|pull|cek|need)'],
      [1, 'TPM: maximize OEE / reliability & maintainability / everyone', 'tpm.{0,200}(oee|reliab|maintainab|equipment|ekipman|everyone|herkes|breakdown|ariza)'],
      [1, 'Poka-Yoke: prevent human mistakes by design', 'poka.{0,160}(mistake|error|hata)'],
      [1, 'Visual mgmt: realize problems & act quickly / performance visible', 'visual.{0,160}(problem|quick|hizli|perform|visible|gorun|sorun)'],
      [1, 'Cellular layout: improve flow, reduce transportation', '(cell|layout|hucre).{0,160}(flow|transport|akis|tasima|lead)'],
    ] });
  add({ id: 'tools-match', topic: 'tools', type: 'match', pts: 6,
    q: 'Match each lean tool with its objective.',
    pairs: [
      ['Value Stream Mapping', 'Make the material and information flow of a product family visible and plan the future state'],
      ['5S', 'Create an organised, clean, high-performance workplace that is the basis of other improvements'],
      ['SMED', 'Reduce setup times to save capacity and allow production in small batches'],
      ['Kanban', 'Trigger material flow and production by actual demand instead of a schedule'],
      ['TPM', 'Maximize overall equipment effectiveness with everyone’s participation'],
      ['Poka-Yoke', 'Design the product or process so that human mistakes are not allowed'],
      ['Visual management', 'Realize problems and take action quickly'],
      ['Kaizen', 'Achieve continuous improvement through many small improvements by everyone'],
    ] });
  add({ id: 'tools-house', topic: 'tools', type: 'mcq', pts: 4,
    q: 'In the “House of Lean” (LEAN s.14), which of the following are drawn <b>inside the house</b> as lean tools? (Select all that apply.)',
    options: ['Pull/Kanban', 'Quality at Source', 'POUS – Point of Use Storage', 'Lot Size Reduction', 'Teams', 'MRP', 'CNC programming', 'Line balancing'],
    answer: [0, 1, 2, 3, 4] });

  // 4 · Roadmap ------------------------------------------------------------
  add({ id: 'roadmap-order', topic: 'roadmap', type: 'order', pts: 7,
    q: 'Put the main steps of the Lean Roadmap in the correct application sequence.',
    items: [
      'Determining product family',
      'Current state value stream mapping',
      'Future state value stream mapping',
      'Current state spaghetti diagram',
      'Layout planning (cellular manufacturing, lines etc.) and execution',
      '5S',
      'Pull system (Kanban, CONWIP, POLCA)',
    ] });
  add({ id: 'roadmap-open', topic: 'roadmap', type: 'open', pts: 8,
    q: 'Explain the application sequence of lean tools according to the Lean Roadmap. Where do SMED, Poka-Yoke, visual management and Kaizen fit into the roadmap?',
    rubric: [
      [1, 'Starts with determining the product family', 'product family|urun ailesi'],
      [1, 'Current state VSM', 'current state|mevcut durum'],
      [1, 'Future state VSM', 'future state|gelecek durum'],
      [1, 'Spaghetti diagram (after future state)', 'spag+h?etti|spagetti'],
      [1, 'Layout planning / cellular manufacturing & execution', 'layout|yerlesim|cellular|hucresel'],
      [1, '5S after layout', '5 ?s'],
      [1, 'Pull system (Kanban, CONWIP, POLCA) last', 'pull|kanban|conwip|polca|cekme'],
      [1, 'SMED supports/precedes the pull system', 'smed.{0,80}(pull|kanban|cek)|(pull|kanban|cek).{0,80}smed'],
      [1, 'Poka-Yoke, visual mgmt (Asakai, Oobeya, Andon, boards), Kaizen (A3, suggestions) applied in parallel', 'parallel|paralel|throughout|boyunca|support|destek|asakai|oobeya|andon|a3'],
    ], cap: 8 });
  add({ id: 'roadmap-side', topic: 'roadmap', type: 'mcq', pts: 4,
    q: 'Which of the following appear in the <b>Visual Management</b> box of the Lean Roadmap? (Select all that apply.)',
    options: ['Asakai', 'Oobeya', 'Lean Management Boards', 'Andon', 'A3 reports', 'Suggestion System', 'SMED', 'CONWIP'],
    answer: [0, 1, 2, 3] });

  // 5 · 5S ------------------------------------------------------------
  add({ id: '5s-order', topic: '5s', type: 'order', pts: 5,
    q: 'Put the steps of 5S in the correct order.',
    items: ['Seiri – Sort', 'Seiton – Simplify', 'Seiso – Shine', 'Seiketsu – Standardize', 'Shitsuke – Training & Discipline'] });
  add({ id: '5s-open', topic: '5s', type: 'open', pts: 8,
    q: 'Explain the five steps of 5S. For each step give one tool, rule or activity used in that step.',
    rubric: [
      [1, 'Seiri / Sort: separate necessary from unnecessary, remove', '(seiri|sort).{0,200}(unnecessar|necessar|remove|discard|gereksiz|ayikla|ayir)'],
      [0.5, 'Red tag', 'red ?tag|kirmizi etiket'],
      [1, 'Seiton / Simplify: a place for everything, easy to find', '(seiton|simplif|set in order).{0,200}(place|find|yer|bul|name|isim)'],
      [0.5, '3 keys / 30-second rule / floor lines / frequency of use', '30 ?s|30 sec|30 saniye|three keys|3 keys|where|floor|frequen|zemin|siklik'],
      [1, 'Seiso / Shine: cleaning (also inspection)', '(seiso|seise|shine).{0,200}(clean|temiz|inspect|dirt)'],
      [0.5, 'Cleaning responsibility map / steps', 'responsib|sorumluluk|who will clean|kim temiz|calendar|takvim'],
      [1, 'Seiketsu / Standardize: maintain first three steps', '(seiketsu|standardi[sz]).{0,200}(maintain|sustain|first three|ilk uc|surdur|koru|control|kontrol)'],
      [0.5, '3 principles / checklist', 'checklist|kontrol listesi|principle|ilke|dust|toz'],
      [1, 'Shitsuke / Discipline: training & habit', '(shitsuke|disciplin).{0,200}(train|egitim|habit|aliskanlik|audit|denetim|everyone|herkes)'],
      [1, 'Audits / results published visually / weekly assessments', 'audit|inspection|denetim|weekly|haftalik|publish|duyur|assessment|degerlendir'],
    ] });
  add({ id: '5s-classify', topic: '5s', type: 'classify', pts: 6,
    q: 'Assign each tool / rule to the 5S step it belongs to.',
    cats: ['Seiri', 'Seiton', 'Seiso', 'Seiketsu', 'Shitsuke'],
    items: [
      ['Red tag application', 0],
      ['Getting rid of broken tools and excess material', 0],
      ['“Everything should have a place and the place should have a name”', 1],
      ['3 keys: where? what? how many? — 30-second rule', 1],
      ['Cleaning responsibility map', 2],
      ['Using cleaning as an opportunity to get familiar with the machine', 2],
      ['Principles: no unnecessary material, no disorder, no dust and dirt', 3],
      ['5S sample checklist to maintain the first three steps', 3],
      ['Training plan; audit results announced visually', 4],
      ['Weekly 5-minute cross 5S assessment between departments', 4],
    ] });

  // 6 · SMED ------------------------------------------------------------
  add({ id: 'smed-open', topic: 'smed', type: 'open', pts: 8,
    q: 'Define setup time and explain the conceptual stages of SMED. What does SMED aim at, and how does it differ from OTED and NOTED?',
    rubric: [
      [1, 'Setup time: last product of previous batch → first acceptable product of next batch', '(last|son).{0,80}(first|ilk)|first acceptable|ilk (saglam|kabul)'],
      [1, 'SMED < 10 min; OTED < 1 min; NOTED automated', '10 ?(min|dk|dakika)|ten minutes|single.minute|single digit'],
      [1, 'Stage 0: internal/external not distinguished', 'not distinguish|ayrilmamis|ayirt edil|stage 0|asama 0|karisik'],
      [1, 'Stage 0 analysis: video, interviews, setup time analysis', 'video|interview|gorusme|analys|analiz'],
      [1, 'Stage 1: separate internal & external (most important)', 'separat|ayir'],
      [1, 'Stage 2: convert internal to external (30–50%)', 'convert|donustur'],
      [1, 'Stage 3: improve all aspects (radical improvements)', 'improve all|all aspects|radical|radikal|tum yon'],
      [1, 'Example improvements (checklist, die car, parallel workers, standard heights, pins…)', 'checklist|die car|parallel|paralel|standard|height|pin|clamp|colou?r|renk|araba'],
    ] });
  add({ id: 'smed-match', topic: 'smed', type: 'match', pts: 5,
    q: 'Match each SMED concept with the correct statement.',
    pairs: [
      ['SMED', 'Setup time less than 10 minutes'],
      ['OTED', 'Setup time less than one minute'],
      ['NOTED', 'Automated setup'],
      ['Stage 0', 'Videotaping, interviews and setup time analysis of the current setup'],
      ['Stage 1', 'Separating internal and external setup — the most important step'],
      ['Stage 2', 'Converting internal to external setup; 30–50% reduction'],
      ['Stage 3', 'Radical improvements in internal and external setup operations'],
    ] });

  // 7 · Kanban ------------------------------------------------------------
  add({ id: 'kanban-order', topic: 'kanban', type: 'order', pts: 5,
    q: 'Put the working systematic of the kanban application between the big electric box cells and the switch cells in the correct order.',
    items: [
      'An assembly cell needs a switch; the logistics operator goes to the switch supermarket',
      'The operator hangs the production kanban of the basket on the hanger (kanban board) of the switch cell that will produce it',
      'The operator carries the switch basket to the big box assembly cells',
      'If the kanban is in the red zone of the board, production starts immediately',
      'Completed switches are taken with the production kanban to their supermarket address',
    ] });
  add({ id: 'kanban-open', topic: 'kanban', type: 'open', pts: 8,
    q: 'Explain the working systematic and the working principles of the kanban system designed between the big electric box assembly cells and the switch cells.',
    rubric: [
      [1, 'Logistics operator goes to the switch supermarket when a cell needs switches', 'supermarket|lojistik|logistic'],
      [1, 'Production kanban hung on the hanger/board of the producing cell', 'hang|hanger|aski|asar|asili'],
      [1, 'Basket carried to the assembly cells', 'basket|sepet|carr|tasi|gotur'],
      [1, 'Red zone → immediate production (red/yellow/green priority)', 'red (zone|area|region)|kirmizi (bolge|alan)|red.{0,20}(urgent|immediate)|kirmizi.{0,30}(acil|hemen)'],
      [1, 'Produced parts + kanban returned to the supermarket address', 'address|adres|return|back|geri'],
      [1, 'No production without a production kanban', 'no production|without (a )?(production )?kanban|kanbansiz|kanban olmadan'],
      [1, 'FIFO / no defective product sent', 'fifo|first in|defective (product|part|item)|hatali (urun|parca)'],
      [1, 'Other principles: shortest deadline first, defined locations, weekly check by team leaders', 'deadline|termin|defined|tanimli|week|hafta|leader|lider'],
    ] });
  add({ id: 'kanban-calc', topic: 'kanban', type: 'calc', gen: 'kanban', pts: 10, q: 'Number of kanbans' });
  add({ id: 'kanban-match', topic: 'kanban', type: 'match', pts: 4,
    q: 'Match each kanban term with its meaning.',
    pairs: [
      ['KS', 'Number of kanbans (rounded up)'],
      ['OT', 'Average demand'],
      ['α', 'Reliability coefficient'],
      ['KCS', 'Time spent by a kanban to complete one full cycle'],
      ['KB', 'Number of pieces in the container'],
      ['Red zone of the kanban board', 'Urgent — production starts immediately'],
      ['Green zone of the kanban board', 'Not urgent'],
    ] });

  // 8 · Visual management ------------------------------------------------------------
  add({ id: 'visual-open', topic: 'visual', type: 'open', pts: 8, cap: 8,
    q: 'What is visual management? Explain at least six visual management techniques used in lean production.',
    rubric: [
      [1, 'Definition: simple techniques to realize problems and take action quickly', '(problem|sorun).{0,80}(quick|hizli|action|aksiyon|fark|notice|realiz)|(realiz|notice|fark|see|detect|gor).{0,40}(problem|sorun)'],
      [1, 'Awareness of current performance vs planned', 'current performance|planned performance|plan.{0,40}(vs|versus|compar|kars|gercek|actual)|(actual|gercek|mevcut).{0,40}plan'],
      [1, 'Asakai boards (task assignment, QCDSM)', 'asakai|task assign|gorev atama|qcdsm'],
      [1, 'Production / performance scoreboard', 'score ?board|scoreboard|skor'],
      [1, 'Lean main board / cell board', 'main ?board|cell board|hucre pano|ana pano'],
      [1, 'Skill matrix (3×3×3)', 'skill|beceri|yetkinlik'],
      [1, 'Colour coding / floor lines', 'colou?r|renk|floor|zemin'],
      [1, 'Poka-Yoke', 'poka'],
      [1, 'Kanban board', 'kanban'],
      [1, 'Andon', 'andon'],
      [1, 'Work instructions / standardization', 'instruction|talimat|standard'],
      [1, 'Red tag / F-tag / shadow photos', 'red ?tag|f ?tag|etiket|photo|fotograf'],
    ] });
  add({ id: 'visual-poka', topic: 'visual', type: 'mcq', pts: 4,
    q: 'Which of the following are listed as <b>Poka-Yoke tools</b> in the lecture notes? (Select all that apply.)',
    options: ['Sensors', 'Light or sound supported warnings', 'Asymmetry', 'Colour coding', 'Number coding', 'Red tag', 'Kanban card', 'Gantt chart'],
    answer: [0, 1, 2, 3, 4] });
  add({ id: 'visual-skill', topic: 'visual', type: 'order', pts: 4,
    q: 'Order the skill matrix levels from lowest to highest competence.',
    items: ['Can not do the task', 'Can do the task with inspection of the team leader', 'Can do the task alone', 'Can train about the job', 'Can improve the job'] });

  // 9 · Cellular ------------------------------------------------------------
  add({ id: 'cell-open', topic: 'cell', type: 'open', pts: 8, cap: 8,
    q: 'Define cellular manufacturing and explain its benefits compared with a job shop (functional) layout.',
    rubric: [
      [1, 'Groups of processes, people and machines', 'process.{0,20}people|people.{0,20}machine|machines?.{0,20}people|insan.{0,20}makine|makine.{0,20}insan'],
      [1, 'Part families', 'famil|aile'],
      [1, 'Similar manufacturing characteristics', 'similar|benzer'],
      [1, 'Separate places (cells)', 'separate (place|cell|area|location)|ayri (yer|hucre|alan|bolge)'],
      [1, 'Less transportation / handling', 'transport|handling|tasima|distance|mesafe'],
      [1, 'Shorter lead time', 'lead ?time|throughput|sure kisa|teslim'],
      [1, 'Less WIP / inventory', 'wip|inventor|stok'],
      [1, 'Saved space', 'space|alan'],
      [1, 'Shorter setups / better quality feedback', 'set ?up|hazirlik|qualit|kalite|defect|hata'],
      [1, 'Simpler control / teamwork / flexibility', 'control|kontrol|team|takim|flexib|esnek|motiv|owner|sahip'],
    ] });
  add({ id: 'cell-classify', topic: 'cell', type: 'classify', pts: 5,
    q: 'Classify each feature as typical of a <b>job shop (functional) layout</b> or a <b>cellular layout</b>.',
    cats: ['Job shop', 'Cellular'],
    items: [
      ['Machines are grouped by function (turning, milling, drilling sections)', 0],
      ['Machines are grouped by part family', 1],
      ['Parts travel long distances between departments', 0],
      ['U-type layout where one operator runs several machines', 1],
      ['High work-in-process inventory between sections', 0],
      ['Saved floor space', 1],
      ['Simple visual control of the flow', 1],
      ['Complex, spaghetti-like material flow', 0],
    ] });

  // 10 · One piece flow ------------------------------------------------------------
  add({ id: 'opf-open', topic: 'opf', type: 'open', pts: 8, cap: 8,
    q: 'What is one piece flow? Explain its benefits.',
    rubric: [
      [1, 'Definition: parts move one at a time without waiting / batches', 'one (at a time|by one|piece)|tek tek|birer|teker'],
      [1, 'Shorter lead time', 'lead ?time|throughput time|teslim suresi|tedarik suresi|uretim suresi|sure(si)? kisal'],
      [1, 'Less WIP / inventory', 'wip|inventor|stok'],
      [1, 'Defects detected immediately', 'defect|hata|kusur'],
      [1, 'Saves space', 'space|alan'],
      [1, 'Less transportation / handling', 'transport|handling|tasima'],
      [1, 'Problems become visible', 'visible|hidden|gorun|gizle|expose'],
      [1, 'Flexibility / no overproduction', 'flexib|esnek|overprod|asiri uretim|demand|talep'],
      [1, 'Productivity / cost', 'productiv|verim|cost|maliyet'],
    ] });
  add({ id: 'opf-mcq', topic: 'opf', type: 'mcq', pts: 4,
    q: 'According to the lecture notes (setup section, LEAN s.75), which are benefits of <b>small batch sizes</b>? (Select all that apply.)',
    options: ['Less lead time', 'Quick realization of defects', 'Saves space', 'Fewer setups are needed', 'Higher finished-goods safety stock', 'Longer machine runs without interruption'],
    answer: [0, 1, 2] });

  // 11 · Internal/External ------------------------------------------------------------
  add({ id: 'setup-classify', topic: 'setup', type: 'classify', pts: 6,
    q: 'Classify each setup activity as <b>internal</b> or <b>external</b> (in a well-designed setup).',
    cats: ['Internal', 'External'],
    items: [
      ['Dismounting the old die from the press', 0],
      ['Mounting and setting the new die', 0],
      ['Transporting the dismounted die to storage', 1],
      ['Conveying the next die from storage to beside the machine', 1],
      ['Bringing the raw material of the next batch next to the machine', 1],
      ['Checking with a checklist that all tools and parts are ready', 1],
      ['Adjusting until the first acceptable part is produced', 0],
      ['Carrying finished goods of the previous batch to the warehouse', 1],
    ] });
  add({ id: 'setup-open', topic: 'setup', type: 'open', pts: 6,
    q: 'Define internal and external setup and give an example of each. Why is the distinction important for reducing setup time?',
    rubric: [
      [1, 'Internal: only when the machine is stopped', 'stop|durdur|durmus|dururken|durunca'],
      [1, 'Internal example: mounting / dismounting dies', 'mount|sokme|sokul|takma|takil|\\bdies?\\b|kalip'],
      [1, 'External: while the machine is operating', 'operat|running|while.{0,20}(work|run)|calisirken|calisir'],
      [1, 'External example: transporting dies / bringing tools & material', 'transport|convey|storage|bring|tasi|depo|getir'],
      [1, 'Only internal setup stops the machine → separate them (stage 1)', '(separat|ayir).{0,60}(internal|external|\\bic\\b|\\bdis\\b)|(internal|external|\\bic\\b|\\bdis\\b).{0,60}(separat|ayir)'],
      [1, 'Convert internal to external (stage 2, 30–50%)', 'convert|donustur|30'],
    ] });

  // 12 · Push/Pull ------------------------------------------------------------
  add({ id: 'pp-classify', topic: 'pushpull', type: 'classify', pts: 7,
    q: 'Classify each statement as a characteristic of a <b>push</b> system or a <b>pull</b> system (LEAN s.109).',
    cats: ['Push', 'Pull'],
    items: [
      ['Works in the office', 0],
      ['Works in the field', 1],
      ['Accepts production parameters as deterministic', 0],
      ['Accepts production parameters as stochastic', 1],
      ['Neglects unexpected conditions', 0],
      ['Takes unexpected conditions (breakdowns) into account', 1],
      ['The planner periodically prepares and sends production orders to each unit', 0],
      ['The system works autonomously; kanban numbers are recalculated only when demand changes significantly', 1],
      ['High space requirement, cycle inventory and lead times', 0],
      ['Works well under high demand variability', 0],
      ['Problematic with high product variety', 1],
      ['Examples: Kanban, CONWIP, POLCA', 1],
    ] });
  add({ id: 'pp-open', topic: 'pushpull', type: 'open', pts: 8, cap: 8,
    q: 'Define push and pull production control systems and compare them in terms of at least five criteria.',
    rubric: [
      [1, 'Push: schedules job entry based on demand / central planning (MRP, ERP)', '(push|itme).{0,120}(schedul|demand|forecast|talep|tahmin|mrp|erp|central|merkez)'],
      [1, 'Pull: entry & progression by system state / actual consumption (Kanban, CONWIP)', '(pull|cekme).{0,120}(state|durum|kanban|conwip|consum|tuket|actual|gercek)'],
      [1, 'Office ↔ field', 'office|field|ofis|saha'],
      [1, 'Deterministic ↔ stochastic', 'determin|stochas|stokas'],
      [1, 'Unexpected conditions neglected ↔ considered', 'unexpect|beklenmeyen|stochastic event'],
      [1, 'Planner sends orders ↔ autonomous, recalculates kanbans', 'planner|planlayici|autonom|otonom|production orders|uretim emri'],
      [1, 'Space / inventory / lead time high ↔ improved', 'space requirement|cycle inventory|lead time|alan ihtiyac|stok|inventor|wip'],
      [1, 'High demand variability: push OK, pull problematic', 'variab|degiskenlik|dalgalan'],
      [1, 'High product variety: push OK, pull problematic', 'variety|cesit'],
      [1, 'Hybrid production control', 'hybrid|hibrit|melez'],
    ] });

  // 13 · A3 ------------------------------------------------------------
  add({ id: 'a3-match', topic: 'a3', type: 'match', pts: 6,
    q: 'Match each section of the Kaizen A3 report with its content.',
    pairs: [
      ['The problem', 'As perceived through the customer’s eyes'],
      ['Background', 'Context and importance'],
      ['Current condition', 'Chart of the current process derived from direct observation'],
      ['Cause analysis', 'Derived from 5-Whys and/or fishbone diagram'],
      ['Target condition', 'Chart of the new ideal process to be achieved through countermeasures'],
      ['Implementation plan', 'What? Who? When? Where?'],
      ['Follow-up plan', 'Performance anticipated; when to follow up and measure'],
      ['Results', 'Measurement and date; variance from predicted measure'],
    ] });
  add({ id: 'a3-order', topic: 'a3', type: 'order', pts: 5,
    q: 'Put the sections of the A3 report in the order they are filled in (left column top → bottom, then right column top → bottom).',
    items: ['The problem', 'Background', 'Current condition', 'Cause analysis', 'Target condition', 'Implementation plan', 'Follow-up plan', 'Results'] });
  add({ id: 'a3-open', topic: 'a3', type: 'open', pts: 8, cap: 8,
    q: 'What is Kaizen? Sketch the Kaizen A3 report template and explain what is written in each section.',
    rubric: [
      [1, 'Kaizen: continuous improvement involving everyone (KAI change, ZEN good)', 'continuous|surekli|everyone|herkes|kai'],
      [1, 'The problem (customer’s eyes)', 'problem.{0,60}(customer|musteri|perceiv|eye|goz)|(customer|musteri).{0,40}problem|problem (statement|tanimi|section|bolumu)'],
      [1, 'Background (context, importance)', 'background|arka ?plan|context|baglam'],
      [1, 'Current condition (direct observation)', 'current (condition|state|process|situation)|mevcut (durum|surec)|direct observation|dogrudan gozlem'],
      [1, 'Cause analysis (5-Whys, fishbone)', 'why|fishbone|balik|cause analysis|neden analiz|root cause'],
      [1, 'Target condition (countermeasures)', 'target (condition|state)|hedef (durum|surec)|ideal process|countermeasure|karsi onlem'],
      [1, 'Implementation plan (what, who, when, where)', 'implement|uygulama plan'],
      [1, 'Follow-up plan', 'follow|takip'],
      [1, 'Results (measurement, variance)', 'results?.{0,60}(measur|olcum|varian|sapma|date|tarih|predict)|sonuc.{0,60}(olcum|sapma|tarih)'],
    ] });

  // 14 · VM tools ------------------------------------------------------------
  add({ id: 'vm-match', topic: 'vmtools', type: 'match', pts: 7,
    q: 'Match each visual management tool with its description.',
    pairs: [
      ['Asakai', 'Short daily morning meeting on the shop floor in front of the boards'],
      ['Oobeya', '“Big room” where targets, KPIs and projects are displayed for the management team'],
      ['Andon', 'Light/sound signal showing line status and calling for help'],
      ['Main lean board', 'Plant-level board showing defect (PPM) analyses, lean projects, 5S and kaizen activities'],
      ['Cell board', 'Board with the cell leader, team members, standards and skill matrix of one cell'],
      ['Performance scoreboard', 'Target vs current production, system status and effectiveness rate'],
      ['QCDSM board', 'Daily tracking of quality, cost, delivery, safety and morale indicators'],
    ] });
  add({ id: 'vm-open', topic: 'vmtools', type: 'open', pts: 8,
    q: 'Briefly explain the following visual management tools: Asakai, Oobeya, Andon, Main Lean Board, Cell Board, Performance Scoreboard and QCDSM Board.',
    rubric: [
      [1, 'Asakai: daily morning meeting at the boards', 'asakai.{0,160}(morning|daily|meeting|sabah|toplanti|gunluk)'],
      [1, 'Oobeya: big room / war room', '(oobeya|obeya).{0,160}(room|oda|war|savas|project|proje)'],
      [1, 'Andon: signal light / call for help', 'andon.{0,160}(light|signal|lamp|isik|sinyal|alarm|help|yardim|stop|dur)'],
      [1, 'Main lean board: plant-level lean status', '(main|ana).{0,160}(plant|factory|fabrika|lean|yalin|project)'],
      [1, 'Cell board: cell team, standards, skill matrix', 'cell.{0,160}(team|leader|lider|skill|standard|ekip)'],
      [1, 'Scoreboard: target vs actual, status, effectiveness', 'score.{0,160}(target|actual|current|hedef|gercek|status|durum|effective)'],
      [1, 'QCDSM: quality, cost, delivery, safety, morale', 'qualit|kalite'],
      [1, 'QCDSM colours / daily tracking', 'green|red|yesil|kirmizi|daily|gunluk|calendar|takvim'],
    ] });
  add({ id: 'vm-qcdsm', topic: 'vmtools', type: 'match', pts: 5,
    q: 'On the QCDSM (production performance tracking) board, match each letter with an indicator tracked under it.',
    pairs: [
      ['Q', 'Customer quality claims'],
      ['C', 'Non-quality cost (delivery cost, scrap cost, waste man-hour cost)'],
      ['D', 'On-time delivery performance'],
      ['S', 'Job safety and environment'],
      ['M', '5S, absenteeism, suggestions, overtime'],
    ] });

  // 15 · TPM ------------------------------------------------------------
  add({ id: 'tpm-open', topic: 'tpm', type: 'open', pts: 8, cap: 8,
    q: 'Explain the content of Total Productive Maintenance (TPM).',
    rubric: [
      [1, 'TPM aim: reliability & maintainability / everyone responsible', 'reliab|maintainab|everyone|herkes|all responsible|hepimiz|sorumlu'],
      [1, 'Design for maintenance', 'design|tasarim'],
      [1, 'Planned maintenance', 'planned|planli'],
      [1, 'Periodic + predictive', 'periodic|predictive|periyodik|kestirimci'],
      [1, 'Autonomous maintenance (operators clean, lubricate, tighten)', 'autonom|otonom|jishu|self'],
      [1, 'One-point lessons / machine maps', 'one ?point|tek nokta|map|harita'],
      [1, 'F-tags', 'f ?tag|failure tag|etiket'],
      [1, 'Maintenance performance management: OEE, MTBF, MTTR', 'oee|mtbf|mttr'],
      [1, 'Visual maintenance management', 'visual|gorsel'],
    ] });
  add({ id: 'tpm-am-order', topic: 'tpm', type: 'order', pts: 5,
    q: 'Put the seven steps of autonomous maintenance in the correct order.',
    items: [
      'Conduct initial cleaning/inspection',
      'Eliminate sources of contamination',
      'Establish provisional standards',
      'Develop general inspection training',
      'Conduct general inspections',
      'Improve workplace management and control',
      'Participate in advanced improvement activities',
    ] });
  add({ id: 'tpm-mcq', topic: 'tpm', type: 'mcq', pts: 4,
    q: 'Which items are listed under “Content for TPM” in the lecture notes (LEAN s.171)? (Select all that apply.)',
    options: ['Design for maintenance', 'Planned maintenance', 'Autonomous maintenance', 'F-tags', 'Maintenance performance management (OEE, MTBF, MTTR)', 'Value stream mapping', 'Kanban board', 'Red tag application'],
    answer: [0, 1, 2, 3, 4] });

  // 16 · OEE ------------------------------------------------------------
  add({ id: 'oee-calc', topic: 'oee', type: 'calc', gen: 'oee', pts: 12, q: 'OEE calculation' });
  add({ id: 'oee-open', topic: 'oee', type: 'open', pts: 8,
    q: 'Write the OEE formula and define each of its factors. Which of the six big losses affect each factor?',
    rubric: [
      [1, 'OEE = A × P × Q', 'availab.{0,40}perform.{0,40}qualit|a ?[x×*] ?p ?[x×*] ?q'],
      [1, 'Availability = (loading − downtime) / loading', '(loading|net available|yukleme).{0,60}(downtime|durus)|(downtime|durus).{0,60}(loading|yukleme)'],
      [1, 'Loading time = gross − planned downtime (breaks, planned maintenance)', 'planned downtime|gross|break|mola|planli durus'],
      [1, 'Performance = theoretical CT × processed / operating time (theoretical / realized CT)', 'theoretical|teorik|realized|gerceklesen'],
      [1, 'Quality = (processed − defects) / processed', '(defect|hata|kusur).{0,80}(processed|produced|uretilen|total|toplam)|(quality|good|saglam).{0,40}(product|urun)'],
      [1, 'Availability losses: equipment failure, setup & adjustment', 'failure|breakdown|ariza'],
      [1, 'Performance losses: idling & minor stoppages, reduced speed', 'idl|minor|speed|hiz|kisa durus'],
      [1, 'Quality losses: defects in process, reduced yield', 'yield|rework|scrap|hurda|yeniden isle'],
    ] });
  add({ id: 'oee-classify', topic: 'oee', type: 'classify', pts: 6,
    q: 'Classify each event by the OEE factor it reduces. (Planned downtime is subtracted before the loading time and is <b>not</b> an OEE loss.)',
    cats: ['Not an OEE loss', 'Availability', 'Performance', 'Quality'],
    items: [
      ['Lunch and coffee breaks', 0],
      ['Planned (periodic) maintenance scheduled in the calendar', 0],
      ['A bearing breaks and the machine stops for repair', 1],
      ['Die change and trial adjustments at product changeover', 1],
      ['Frequent stoppages of a few seconds due to jammed material', 2],
      ['Realized cycle time is longer than the theoretical cycle time because of machine aging', 2],
      ['Parts scrapped or reworked in the process', 3],
      ['Yield loss during start-up until the process stabilizes', 3],
    ] });

  // 17 · Maintenance strategy ------------------------------------------------------------
  add({ id: 'ms-open', topic: 'mstrat', type: 'open', pts: 7,
    q: 'Which criteria are used to select the maintenance type for a part? Explain how they influence the choice between corrective, planned/periodic and predictive maintenance.',
    rubric: [
      [1, 'Cost of the part', 'cost of (the )?(part|component|spare)|part.{0,10}cost|parca(nin)? (maliyet|fiyat)|price of'],
      [1, 'Maintenance (repair) time of the part', 'maintenance time|repair time|bakim sure|onarim sure|time to repair|mttr'],
      [1, 'Supply time of the part', 'supply|tedarik|lead time of the part'],
      [1, 'Criticality (importance) in the overall system', 'critical|kritik|importan|onem'],
      [1, 'Maintenance types: corrective, planned, periodic, predictive', 'corrective|duzeltici|predictive|kestirimci|periodic|periyodik'],
      [1, 'Cheap/non-critical → corrective; critical/long supply → planned or predictive', '(cheap|ucuz|non ?critical|kritik olmayan).{0,120}(corrective|duzeltici|run to failure)|(critical|kritik).{0,120}(predictive|planned|periodic|kestirimci|planli|onleyici|preventive)'],
      [1, 'Cost trade-off: planned cost ↑, corrective cost ↓, optimum M*', 'm\\*|optim|trade|total cost|toplam maliyet'],
    ] });
  add({ id: 'ms-mcq', topic: 'mstrat', type: 'mcq', pts: 4,
    q: 'Which of the following are the criteria for selecting the maintenance type in the lecture notes (LEAN s.168)? (Select all that apply.)',
    options: ['Cost of part', 'Maintenance time of the part', 'Supply time of the part', 'Criticality (importance) of the part in the overall system', 'Number of operators using the machine', 'Selling price of the final product', 'Takt time of the line'],
    answer: [0, 1, 2, 3] });
  add({ id: 'ms-graph', topic: 'mstrat', type: 'mcq', pts: 3,
    q: 'In the maintenance cost graph (LEAN s.166), what happens as the maintenance level increases, and what is M*?',
    options: [
      'Planned maintenance cost increases, corrective maintenance cost decreases; M* is the level that minimizes total cost',
      'Both planned and corrective maintenance costs decrease; M* is the maximum maintenance level',
      'Planned maintenance cost decreases, corrective maintenance cost increases; M* is where corrective cost is zero',
      'Corrective maintenance cost is constant; M* is the level where planned maintenance cost is zero',
    ],
    answer: 0 });

  IM.exam.questions = Q;
})();
