<img src="assets/icon.svg" width="64" height="64" alt="">

# IMS Asistanı

İTÜ **Computer Integrated Manufacturing Systems** (Bilgisayarla Bütünleşik Üretim Sistemleri) dersi için bağımlılıksız, statik, interaktif çalışma sitesi.
Arayüz ve özetler Türkçe, terimler İngilizce (*takt time*, *kanban*, *MLT*, *OEE*…).

> **Uyarı:** Bu, İTÜ *Computer Integrated Manufacturing Systems* dersinin ders notlarına dayanan **gayriresmî** bir çalışma aracıdır; hocalar veya İTÜ ile bağlantılı değildir.
> Bu sitedeki özet ve sorularda hata olabilir; bir yerde emin olamazsan ders notlarını esas al.

## Kapsam

Yalnızca paylaşılan ders dosyaları (syllabus 2026 haftaları):

| Bölüm | Kaynak dosya | Syllabus |
|---|---|---|
| 1 · CIM'e Giriş | introduction to CIM.ppt (14 slayt), when CIM.ppt (5 slayt) | Hafta 1–2 |
| 2 · Lean Manufacturing | Lean Manufacturing.pdf (199 sayfa) | Hafta 2–3 |
| 3 · FMS ve Ekonomik Karşılaştırma | Traditional_FMS comparison.ppt (19 slayt) | Hafta 4 |
| 4 · AGV | automated guided vehicles.ppt (29 slayt) | Hafta 6 |
| 5 · CNC Tezgâhları | CNC_machine tools.pptx (29 slayt) | Hafta 7 |

Kapsam dışı (dosyası yok): Robots in CIM, Modern Measurement Techniques, Manual CNC programming ve sonraki haftalar.

Ders kitabı (syllabus): Groover, M.P., 2022, *Automation, Production Systems and Computer Integrated Manufacturing*, Pearson.

## Açma

`index.html` dosyasını tarayıcıda doğrudan açın (build, sunucu, internet gerekmez). İsterseniz: `python3 -m http.server 8931` → http://localhost:8931

- Her konu: **Özet** · **Kavram Testi** · (varsa) **Alıştırma** (seed'li, her seferinde yeni sayılarla üretilen çok adımlı problemler)
- **Karışık Quiz**, yazdırılabilir **Formül Kartı** (A4), ilerleme tablosu (localStorage `ims.*`)
- **Cihazlar arası taşıma** (ana sayfa → İlerleme): *Kodu kopyala* / *Kodu yükle* — `IMS1-…` kodu ilerlemeyi telefona/bilgisayara taşır; kayıtlar birleştirilir (anahtar başına daha çok çözülmüş kayıt kalır), tekrar yüklemek sayıları katlamaz.
- Bağlantı `#/d/<drill>/<seed>` aynı problemi tekrar açar.

## Testler

```sh
export PATH=/opt/homebrew/bin:$PATH
node tests/sync.test.js                       # ilerleme kodu: gidiş-dönüş, geçersiz kod, birleştirme (idempotent)
node tests/core.test.js                       # Frac + ondalık gösterim, checkNum (yüzde, tolerans, tam sayı), viz
node tests/content.test.js                    # özet ≥1500 karakter, konu başına ≥10 soru, açıklama, formül kartı
node tests/drills.test.js all 60              # tüm üreticiler × seçenekler × 60 seed: yapı + süre + determinizm
node tests/fraction-audit.js all 20           # ekranda a/b kesir yok, rastgele örneklerde temiz (≤2 ondalık) değerler
for f in tests/notes-*.test.js; do node $f; done   # notlardaki çözümlü örnekler birebir
```
