/* Formül kartı — ana dosya. Bölüm dosyaları (ch1, ch2a, ch2b, ch3, ch4, ch5) kendi bölümlerini
   `IM.content.cheatsheet += \`<h2>Bölüm N · …</h2>…\`` ile ekler; bu dosya ÖNCE yüklenir.
   Yazdırılabilir (A4, css @media print). Sayılar ondalık gösterilir (0.50, 41.25), a/b kesir yok. */
(function () {
  const IM = window.IM;
  IM.content.cheatsheet = `
    <p class="muted">IMS · Computer Integrated Manufacturing Systems. Kapsam: Introduction to CIM, When CIM, Lean Manufacturing,
    Traditional–FMS comparison, AGV, CNC Machine Tools slaytları. Notlarda görsel olan formüller standart yazımla yeniden yazılmıştır.
    Hata görürsen ders notlarını esas al.</p>
    <h2>Birim dönüşümleri ve yuvarlama</h2>
    <table>
      <tr><td><b>1 h = 60 min = 3600 s</b></td><td>1 shift (vardiya) süresi probleme göre verilir; <i>net</i> süre = brüt − planlı duruş (mola, planlı bakım)</td></tr>
      <tr><td><b>⌈x⌉</b></td><td>yukarı yuvarlama: araç (AGV) sayısı, kanban sayısı gibi tam sayı kararları her zaman <b>yukarı</b> yuvarlanır (8.43 → 9)</td></tr>
      <tr><td><b>% ↔ oran</b></td><td>87% = 0.87; OEE gibi çarpımlarda oranlarla çarp, sonucu yüzdeye çevir</td></tr>
    </table>
  `;
})();
