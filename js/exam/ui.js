/* Sınav Hazırlık · arayüz. app.js yönlendiricisi #/sinav/... için IM.examUI.route(main, parts) çağırır.
   Sayfalar:
     #/sinav               → merkez (konu tablosu, hazırlık durumu, denemeler)
     #/sinav/k/<id>        → konu anlatımı (anlatım · ezberle · örnek cevap · tuzaklar)
     #/sinav/ezber[/<id>]  → ezber kartları (aktif hatırlama + Leitner)
     #/sinav/kagit         → yazdırılabilir ezber kağıdı
     #/sinav/sim           → sınav simülasyonu (kurulum / devam eden sınav / puanlama)
     #/sinav/sonuc         → son sınavın sonucu ve incelemesi */
(function () {
  const IM = window.IM;
  const E = IM.exam;
  const S = IM.examStore;
  const esc = (s) => IM.util.esc(s);
  let main = null;
  let timer = null;
  let keyHandler = null;

  const stopTimers = () => {
    if (timer) { clearInterval(timer); timer = null; }
    if (keyHandler) { document.removeEventListener('keydown', keyHandler); keyHandler = null; }
  };
  const band = (p) => (p == null ? '' : p >= 80 ? 'hi' : p >= 50 ? 'mid' : 'lo');
  const badge = (p, suffix) => (p == null ? '<span class="muted">—</span>' : `<span class="badge ${band(p)}">%${p}${suffix || ''}</span>`);
  const fmtTime = (sec) => {
    const s = Math.max(0, Math.round(sec));
    const m = Math.floor(s / 60), r = s % 60;
    return `${m}:${String(r).padStart(2, '0')}`;
  };
  const fmtDate = (ts) => {
    const d = new Date(ts);
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  const topicShort = (t) => t.title.replace(/^Visual management tools:.*/, 'Visual management tools (Asakai, Oobeya, Andon, boards, QCDSM)');
  const pageLabel = (p) => esc(p).replace(/\b(LEAN|AGV)\b(?= s\.)/g, (m) => (m === 'LEAN' ? 'Lean Manufacturing' : 'AGV'));
  const TYPE_LABEL = { open: 'Açık uçlu', order: 'Sıralama', match: 'Eşleştirme', classify: 'Sınıflandırma', mcq: 'Çoktan seçmeli', calc: 'Hesaplama' };

  // ------------------------------------------------------------------ merkez
  function hub() {
    const st = S.get();
    const ms = E.mastery(st);
    const now = Date.now();
    const due = E.cards.filter((c) => !st.cards[c.id] || st.cards[c.id].due <= now).length;
    const readN = E.topics.filter((t) => ms[t.id].read).length;
    const memoAvg = Math.round(E.topics.reduce((s, t) => s + (ms[t.id].memo || 0), 0) / E.topics.length);
    const att = st.attempts.slice().reverse();
    const lastFull = att.find((a) => a.mode === 'full');
    const cur = S.cur();
    const rows = E.topics.map((t) => {
      const m = ms[t.id];
      return `<tr>
        <td class="num">${t.n}</td>
        <td><a href="#/sinav/k/${t.id}">${esc(topicShort(t))}</a><div class="muted small">${esc(t.tr)}</div></td>
        <td class="c">${m.read ? '<span class="okmark" title="Okundu">✓</span>' : '<span class="muted">—</span>'}</td>
        <td class="c"><a href="#/sinav/ezber/${t.id}" title="${m.seen}/${m.cards} kart görüldü">${badge(m.seen ? m.memo : null)}</a></td>
        <td class="c">${badge(m.exam)}${m.tries ? `<div class="muted small">${m.tries}×</div>` : ''}</td>
      </tr>`;
    }).join('');
    main.innerHTML = `
      <section class="hero xhero">
        <h1>📝 Sınav Hazırlık</h1>
        <p>Hocanın sınavda çıkacağını söylediği <b>17 konu</b>: konu anlatımı, ezberlenmesi gereken liste ve formüller, sınavda yazılacak örnek cevaplar,
        aktif hatırlama kartları ve gerçek sınav gibi <b>süreli simülasyon</b>. Sonuçlar konu bazında tutulur; zayıf konular otomatik öne çıkar.</p>
        ${cur ? `<div class="resume"><b>⏸ Yarım kalan bir sınavın var</b> (${esc(E.MODES[cur.mode] ? E.MODES[cur.mode].label : cur.mode)}, ${cur.items.length} soru). <a class="btn primary sm" href="#/sinav/sim">Devam et →</a></div>` : ''}
        <div class="how xsteps">
          <div><b>1 · Oku</b><br>Her konunun anlatımını oku, <i>Ezberle</i> kutusunu çalış, örnek cevabı açmadan önce kendin söylemeyi dene. Bitince “Okudum” işaretle.</div>
          <div><b>2 · Ezberle</b><br><a href="#/sinav/ezber">Ezber kartları</a>: listeyi/formülü aklından yaz → kontrol et → kendini puanla. Bilemediğin kart sık, bildiğin seyrek gelir.</div>
          <div><b>3 · Sına</b><br><a href="#/sinav/sim">Sınav simülasyonu</a>: süre işler, cevaplar sınav bitene kadar gösterilmez. Açık uçlu soruları rubrikle kendin puanlarsın.</div>
          <div><b>4 · Kapat</b><br>Sonuç ekranındaki zayıf konulara dön; “Zayıf konular” denemesi bu konulardan yeni sorular sorar.</div>
        </div>
        <div class="xstats">
          <div class="xstat"><div class="xv">${readN}/17</div><div class="xl">okunan konu</div></div>
          <div class="xstat"><div class="xv">%${memoAvg}</div><div class="xl">ezber hâkimiyeti</div></div>
          <div class="xstat"><div class="xv">${due}</div><div class="xl">sırası gelen kart</div></div>
          <div class="xstat"><div class="xv">${lastFull ? '%' + Math.round((100 * lastFull.got) / lastFull.max) : '—'}</div><div class="xl">son tam sınav</div></div>
        </div>
        <div class="herobtns">
          <a class="btn primary" href="#/sinav/sim">🎯 Sınav simülasyonu</a>
          <a class="btn" href="#/sinav/ezber">🧠 Ezber kartları${due ? ` <span class="cnt">${due}</span>` : ''}</a>
          <a class="btn ghost" href="#/sinav/k/agv">📖 1. konudan başla</a>
          <a class="btn ghost" href="#/sinav/kagit">📄 Ezber kağıdı (yazdır)</a>
        </div>
      </section>
      <h2 class="sec">📚 Konular <small class="muted">— hocanın listesindeki sırayla</small></h2>
      <div class="xtable-wrap"><table class="prog xtable">
        <tr><th>#</th><th>Konu</th><th class="c">Okundu</th><th class="c">Ezber</th><th class="c">Sınav</th></tr>
        ${rows}
      </table></div>
      <p class="note">Ezber % = konunun kartlarının Leitner kutusu (kutu 4–5 = %100). Sınav % = son 3 denemede o konudan alınan puan. ${''}</p>
      ${att.length ? `<h2 class="sec">🗂 Denemelerin</h2>
      <div class="xtable-wrap"><table class="prog xtable">
        <tr><th>Tarih</th><th>Tür</th><th class="c">Puan</th><th class="c">Süre</th></tr>
        ${att.slice(0, 12).map((a) => `<tr><td>${fmtDate(a.at)}</td><td>${esc(E.MODES[a.mode] ? E.MODES[a.mode].label : a.mode)} <span class="muted small">(${Object.keys(a.pt).length} konu)</span></td><td class="c">${badge(Math.round((100 * a.got) / a.max))} <span class="muted small">${a.got}/${a.max}</span></td><td class="c muted">${a.used ? fmtTime(a.used) : '—'}</td></tr>`).join('')}
      </table></div>
      ${S.last() ? '<p><a class="btn ghost sm" href="#/sinav/sonuc">Son sınavın ayrıntılı incelemesi →</a></p>' : ''}` : ''}
      <p class="disclaimer">Konu anlatımları ders notlarına (Lean Manufacturing ve Automated Guided Vehicles slaytları) dayanır; notlarda olmayan açıklamalar “(notlarda yok)” diye işaretlidir.
      Hücresel üretim/tek parça akışının faydaları, Oobeya ve Andon tanımları notlarda liste/tanım olarak bulunmadığından standart literatürden yazılmıştır. Emin olamadığın yerde ders notunu esas al.</p>
      <p><button class="btn ghost sm" id="xreset">Sınav Hazırlık ilerlemesini sıfırla</button></p>`;
    document.getElementById('xreset').addEventListener('click', () => {
      if (confirm('Sınav Hazırlık ilerlemesi (ezber kartları, denemeler, okundu işaretleri) silinsin mi?')) { S.reset(); hub(); }
    });
  }

  // ------------------------------------------------------------------ konu anlatımı
  function lesson(id) {
    const t = E.topicById(id);
    if (!t) return hub();
    const i = E.topics.indexOf(t);
    const prev = E.topics[i - 1], next = E.topics[i + 1];
    const st = S.get();
    const read = !!st.read[id];
    const site = IM.topicById(t.link);
    const nq = E.questions.filter((q) => q.topic === id).length;
    const nc = E.cards.filter((c) => c.topic === id).length;
    main.innerHTML = `
      <div class="crumb"><a href="#/sinav">📝 Sınav Hazırlık</a> › Konu ${t.n}/17</div>
      <h1 class="ttl">${t.n} · ${esc(t.title)} <small>${esc(t.tr)} · ders notu: ${pageLabel(t.src)}</small></h1>
      <div class="xjump">
        <a href="#x-anlatim">📖 Anlatım</a><a href="#x-ezber">🧠 Ezberle</a><a href="#x-cevap">✍️ Örnek cevap</a><a href="#x-tuzak">⚠️ Tuzaklar</a>
      </div>
      <article class="summary card" id="x-anlatim"><h2>📖 Konu anlatımı</h2>${t.lesson}</article>
      <article class="summary card xmemo" id="x-ezber"><h2>🧠 Ezberlenecekler</h2>${t.memo}</article>
      <article class="summary card" id="x-cevap">
        <h2>✍️ Sınavda böyle yaz <small class="muted">(İngilizce örnek cevap)</small></h2>
        <details class="xreveal"><summary>Önce kendin söylemeyi/yazmayı dene, sonra aç</summary>${t.answer}</details>
      </article>
      <article class="summary card" id="x-tuzak"><h2>⚠️ Sınav tuzakları</h2><div class="warnbox">${t.traps}</div></article>
      <div class="after">
        <button class="btn ${read ? '' : 'primary'}" id="xread">${read ? '✓ Okundu (geri al)' : '✓ Okudum'}</button>
        <a class="btn" href="#/sinav/ezber/${id}">🧠 Bu konunun kartları (${nc})</a>
        <button class="btn" id="xmini">🎯 Bu konudan mini sınav (${nq} soru)</button>
        ${site ? `<a class="btn ghost" href="#/t/${site.id}">Ayrıntılı özet ve alıştırmalar: ${site.id} →</a>` : ''}
      </div>
      <div class="pn">${prev ? `<a class="btn ghost" href="#/sinav/k/${prev.id}">← ${prev.n}. ${esc(topicShort(prev))}</a>` : '<span></span>'}${next ? `<a class="btn ghost" href="#/sinav/k/${next.id}">${next.n}. ${esc(topicShort(next))} →</a>` : '<a class="btn primary" href="#/sinav/sim">🎯 Sınav simülasyonuna geç →</a>'}</div>`;
    main.querySelectorAll('.xjump a').forEach((a) =>
      a.addEventListener('click', (e) => { e.preventDefault(); const el = document.querySelector(a.getAttribute('href')); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); })
    );
    document.getElementById('xread').addEventListener('click', () => { S.markRead(id, !read); lesson(id); IM.examUI.onChange(); });
    document.getElementById('xmini').addEventListener('click', () => startExam('custom', { topics: [id], allQuestions: true, minutes: 0 }));
  }

  // ------------------------------------------------------------------ ezber kağıdı
  function sheet() {
    main.innerHTML = `<h1 class="ttl">📄 Ezber kağıdı <button class="btn ghost sm" onclick="window.print()">🖨 Yazdır</button></h1>
      <p class="muted">17 konunun ezberlenmesi gereken liste ve formülleri tek sayfada. Sınavdan önceki son tekrar için.</p>
      <article class="summary card cheat xsheet">${E.topics.map((t) => `<section><h3>${t.n} · ${esc(topicShort(t))}</h3>${t.memo}</section>`).join('')}</article>`;
  }

  // ------------------------------------------------------------------ ezber kartları
  function recall(topic, force) {
    const st = S.get();
    const now = Date.now();
    const pool = E.cards.filter((c) => !topic || c.topic === topic);
    const dueN = pool.filter((c) => !st.cards[c.id] || st.cards[c.id].due <= now).length;
    const mastered = pool.filter((c) => st.cards[c.id] && st.cards[c.id].box >= 4).length;
    const card = E.nextCard(E.cards, st.cards, now, { topic, force });
    const tsel = `<select id="xtopic"><option value="">Tüm konular (${E.cards.length} kart)</option>${E.topics.map((t) => `<option value="${t.id}" ${t.id === topic ? 'selected' : ''}>${t.n}. ${esc(topicShort(t))}</option>`).join('')}</select>`;
    const head = `
      <div class="crumb"><a href="#/sinav">📝 Sınav Hazırlık</a> › Ezber kartları</div>
      <h1 class="ttl">🧠 Ezber kartları</h1>
      <div class="xbar">${tsel}<span class="muted small">Sırası gelen <b>${dueN}</b> · Öğrenilmiş (kutu 4–5) <b>${mastered}/${pool.length}</b></span></div>`;
    if (!card) {
      const recs = pool.map((c) => st.cards[c.id]).filter(Boolean);
      const soon = recs.length ? Math.min(...recs.map((r) => r.due)) : null;
      main.innerHTML = head + `<div class="card endcard"><div class="score hi">🎉 Şu an sırası gelen kart yok</div>
        <p>${soon ? `Sıradaki kart yaklaşık <b>${fmtTime((soon - now) / 1000)}</b> dk sonra.` : ''} Aralıklı tekrar bildiğin kartları seyrek gösterir; yine de çalışmak istersen en zayıf kartlardan başla.</p>
        <div class="endbtns"><button class="btn primary" id="xforce">Yine de çalış (en zayıflardan)</button><a class="btn ghost" href="#/sinav/sim">🎯 Sınav simülasyonu</a></div></div>`;
      bindTopicSel();
      document.getElementById('xforce').addEventListener('click', () => recall(topic, true));
      return;
    }
    const t = E.topicById(card.topic);
    const rec = st.cards[card.id];
    main.innerHTML = head + `
      <div class="card xcard">
        <div class="xcard-top"><a class="dtopic" href="#/sinav/k/${t.id}">${t.n} · ${esc(topicShort(t))}</a><span class="muted small">${rec ? `kutu ${rec.box}/5 · ${rec.n} tekrar` : 'yeni kart'}${card.ordered ? ' · <b>sıra önemli</b>' : ''}</span></div>
        <div class="xprompt">${card.prompt}</div>
        <textarea id="xans" rows="6" placeholder="Aklından yaz — her satıra bir madde (Türkçe ya da İngilizce). Yazmak istemezsen sesli say ve “Cevabı göster”e bas." spellcheck="false"></textarea>
        <div class="step-actions"><button class="btn primary" id="xshow">Cevabı göster <span class="kbd">Enter</span></button></div>
        <div id="xback" hidden></div>
      </div>
      <p class="note">Otomatik ✓/✗ işaretleri yalnızca anahtar kelime eşleşmesidir; asıl ölçü kendi dürüst puanın. Kısayollar: <span class="kbd">Ctrl/⌘ + Enter</span> göster · <span class="kbd">1</span> bilemedim · <span class="kbd">2</span> kısmen · <span class="kbd">3</span> tam.</p>`;
    bindTopicSel();
    const ta = document.getElementById('xans');
    const back = document.getElementById('xback');
    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      const txt = ta.value;
      const r = E.checkCard(card, txt);
      const typed = txt.trim().length > 0;
      const li = card.items.map((it, k) => {
        const mark = !typed || !it[1] ? '<span class="xm muted">•</span>' : r.found[k] ? '<span class="xm ok">✓</span>' : '<span class="xm no">✗</span>';
        return `<li>${mark} ${esc(it[0])}</li>`;
      }).join('');
      const nFound = r.found.filter(Boolean).length, nAuto = card.items.filter((it) => it[1]).length;
      back.innerHTML = `
        <div class="xanswer"><${card.ordered ? 'ol' : 'ul'} class="xlist">${li}</${card.ordered ? 'ol' : 'ul'}></div>
        ${typed && r.auto ? `<p class="small">Yazdıklarında tespit edilen: <b>${nFound}/${nAuto}</b>${card.ordered && nFound >= 2 ? (r.orderOk ? ' · sıra ✓' : ' · <b class="bad">sıra hatalı olabilir</b>') : ''}</p>` : ''}
        <div class="xgrade">
          <span class="muted small">Kendini dürüstçe puanla:</span>
          <button class="btn g0" data-g="0">😣 Bilemedim <span class="kbd">1</span></button>
          <button class="btn g1" data-g="1">🤔 Kısmen <span class="kbd">2</span></button>
          <button class="btn g2" data-g="2">😎 Tam biliyordum <span class="kbd">3</span></button>
        </div>`;
      back.hidden = false;
      document.getElementById('xshow').hidden = true;
      back.querySelectorAll('[data-g]').forEach((b) => b.addEventListener('click', () => grade(+b.dataset.g)));
      back.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };
    const grade = (g) => {
      S.setCard(card.id, E.leitner(S.get().cards[card.id], g, Date.now()));
      IM.examUI.onChange();
      recall(topic, force);
      window.scrollTo(0, 0);
    };
    document.getElementById('xshow').addEventListener('click', show);
    keyHandler = (e) => {
      if (!document.getElementById('xans')) return;
      if (!shown && e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); show(); }
      else if (!shown && e.key === 'Enter' && document.activeElement !== ta) { e.preventDefault(); show(); }
      else if (shown && document.activeElement !== ta && ['1', '2', '3'].includes(e.key)) { e.preventDefault(); grade(+e.key - 1); }
    };
    document.addEventListener('keydown', keyHandler);
  }
  function bindTopicSel() {
    const sel = document.getElementById('xtopic');
    if (sel) sel.addEventListener('change', () => { location.hash = sel.value ? `#/sinav/ezber/${sel.value}` : '#/sinav/ezber'; });
  }

  // ------------------------------------------------------------------ sınav: kurulum
  function setup() {
    const st = S.get();
    const ms = E.mastery(st);
    main.innerHTML = `
      <div class="crumb"><a href="#/sinav">📝 Sınav Hazırlık</a> › Sınav simülasyonu</div>
      <h1 class="ttl">🎯 Sınav simülasyonu</h1>
      <p class="muted">Gerçek sınav gibi: süre işler, cevaplar ve puanlar <b>sınav bitene kadar gösterilmez</b>. Sayısal ve yapılandırılmış sorular otomatik puanlanır;
      açık uçlu sorularda bitişte örnek cevap + rubrik gelir ve yazdıklarındaki anahtar kavramlar önceden işaretlenir — sen onaylarsın.
      Cevapları İngilizce ya da Türkçe yazabilirsin; telefonda yazmak zorsa kâğıda yazıp rubrikle puanla.</p>
      <div class="cards xmodes">
        ${['full', 'quick', 'weak'].map((m) => `<button class="dcard xmode" data-mode="${m}"><div class="dtop"><span class="dtopic">${m === 'full' ? '100 puan' : '6 soru'}</span></div><div class="dtitle">${esc(E.MODES[m].label)}</div><div class="ddesc">${esc(E.MODES[m].desc)}</div><div class="dgo">Başla →</div></button>`).join('')}
      </div>
      <h2 class="sec">Seçtiğim konular</h2>
      <form class="card quizform xcustom">
        <div class="qcol">
          <div class="qh">Konular <button type="button" class="btn ghost sm" data-sel="all">Tümü</button><button type="button" class="btn ghost sm" data-sel="none">Hiçbiri</button><button type="button" class="btn ghost sm" data-sel="weak">Puanı &lt; %60 olanlar</button></div>
          ${E.topics.map((t) => `<label class="qt"><input type="checkbox" name="topic" value="${t.id}"> ${t.n}. ${esc(topicShort(t))} <small class="muted">${ms[t.id].exam == null ? '' : '%' + ms[t.id].exam}</small></label>`).join('')}
        </div>
        <div class="qcol">
          <div class="qh">Ayarlar</div>
          <label class="qt"><input type="radio" name="qmode" value="one" checked> Her konudan 1 soru</label>
          <label class="qt"><input type="radio" name="qmode" value="all"> Seçili konuların <b>tüm</b> soruları</label>
          <label class="dopt" style="margin-top:10px">Süre (dk, 0 = süresiz) <input type="number" name="min" value="0" min="0" max="240"></label>
          <button class="btn primary" type="submit" style="margin-top:16px">Sınavı başlat →</button>
        </div>
      </form>`;
    main.querySelectorAll('.xmode').forEach((b) => b.addEventListener('click', () => {
      const mode = b.dataset.mode;
      const topicScores = {};
      E.topics.forEach((t) => { if (ms[t.id].exam != null) topicScores[t.id] = ms[t.id].exam / 100; });
      startExam(mode, { topicScores });
    }));
    const form = main.querySelector('.xcustom');
    form.querySelectorAll('[data-sel]').forEach((b) => b.addEventListener('click', () => {
      const m = b.dataset.sel;
      form.querySelectorAll('input[name=topic]').forEach((c) => {
        c.checked = m === 'all' || (m === 'weak' && (ms[c.value].exam == null || ms[c.value].exam < 60));
      });
    }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const topics = [...form.querySelectorAll('input[name=topic]:checked')].map((c) => c.value);
      if (!topics.length) return alert('En az bir konu seç.');
      const minutes = Math.max(0, parseInt(form.elements.min.value, 10) || 0);
      startExam('custom', { topics, allQuestions: form.elements.qmode.value === 'all', minutes });
    });
  }

  // son denemelerde sorulan sorular (aynı soruyu art arda sormamak için)
  const recentQids = () => {
    const last = S.last();
    return last ? last.exam.items.map((it) => it.qid) : [];
  };

  function startExam(mode, opts) {
    const cur = S.cur();
    if (cur && !confirm('Yarım kalan sınav silinip yenisi başlasın mı?')) { location.hash = '#/sinav/sim'; return; }
    const rng = IM.rng(IM.newSeed());
    let exam;
    try {
      exam = E.buildExam(mode, Object.assign({ avoid: recentQids() }, opts), rng);
    } catch (e) { alert(e.message); return; }
    exam.startedAt = Date.now();
    exam.answers = exam.items.map(() => null);
    exam.cur = 0;
    exam.phase = 'answer';
    S.saveCur(exam);
    if (location.hash === '#/sinav/sim') simulate(); else location.hash = '#/sinav/sim';
  }

  // ------------------------------------------------------------------ sınav: cevaplama
  function answered(it, a) {
    if (!a) return false;
    const q = E.qById(it.qid);
    if (q.type === 'open') return !!((a.text && a.text.trim()) || a.paper);
    if (q.type === 'order') return (a.seq || []).length > 0;
    if (q.type === 'match' || q.type === 'classify') return (a.sel || []).some((x) => x != null);
    if (q.type === 'mcq') return (a.sel || []).length > 0;
    if (q.type === 'calc') return (a.vals || []).some((v) => v && String(v).trim());
    return false;
  }

  function simulate() {
    const ex = S.cur();
    if (!ex) return setup();
    if (ex.phase === 'grade') return grading();
    const n = ex.items.length;
    const i = Math.min(Math.max(0, ex.cur || 0), n - 1);
    const it = ex.items[i];
    const q = E.qById(it.qid);
    const t = E.topicById(it.topic);
    const scale = ex.mode === 'full' ? 100 / ex.rawMax : 1;
    const ptsLabel = (Math.round(q.pts * scale * 10) / 10).toString();
    const chips = ex.items.map((x, k) => `<button class="xchip ${k === i ? 'cur' : ''} ${answered(x, ex.answers[k]) ? 'done' : ''}" data-go="${k}">${k + 1}</button>`).join('');
    main.innerHTML = `
      <div class="xexambar">
        <div class="xtimer" id="xtimer">⏱ —</div>
        <div class="xprog"><span id="xdone">0</span>/${n} cevaplandı</div>
        <button class="btn primary sm" id="xfinish">Sınavı bitir</button>
      </div>
      <div class="xchips">${chips}</div>
      <div class="card xq">
        <div class="xq-head"><span class="xq-n">Soru ${i + 1}/${n}</span><span class="badge mid">${ptsLabel} puan</span><span class="muted small">${TYPE_LABEL[q.type]} · ${t.n}. ${esc(topicShort(t))}</span></div>
        <div class="xq-body" id="xqbody"></div>
      </div>
      <div class="pn">
        <button class="btn ghost" id="xprev" ${i === 0 ? 'disabled' : ''}>← Önceki</button>
        ${i < n - 1 ? '<button class="btn primary" id="xnext">Sonraki →</button>' : '<button class="btn primary" id="xfinish2">Sınavı bitir →</button>'}
      </div>`;
    const body = document.getElementById('xqbody');
    const save = (a) => {
      const e2 = S.cur();
      if (!e2) return;
      e2.answers[i] = a;
      S.saveCur(e2);
      ex.answers[i] = a;
      const chip = main.querySelector(`.xchip[data-go="${i}"]`);
      if (chip) chip.classList.toggle('done', answered(it, a));
      updDone();
    };
    renderAnswer(body, it, q, ex.answers[i], save);
    const go = (k) => { const e2 = S.cur(); e2.cur = k; S.saveCur(e2); simulate(); window.scrollTo(0, 0); };
    main.querySelectorAll('.xchip').forEach((b) => b.addEventListener('click', () => go(+b.dataset.go)));
    document.getElementById('xprev').addEventListener('click', () => go(i - 1));
    const nx = document.getElementById('xnext');
    if (nx) nx.addEventListener('click', () => go(i + 1));
    const finish = () => {
      const e2 = S.cur();
      const left = e2.items.filter((x, k) => !answered(x, e2.answers[k])).length;
      if (left && !confirm(`${left} soru boş. Yine de sınavı bitirip puanlamaya geçilsin mi?`)) return;
      toGrade(false);
    };
    document.getElementById('xfinish').addEventListener('click', finish);
    const f2 = document.getElementById('xfinish2');
    if (f2) f2.addEventListener('click', finish);
    function updDone() {
      const d = ex.items.filter((x, k) => answered(x, ex.answers[k])).length;
      const el = document.getElementById('xdone');
      if (el) el.textContent = d;
    }
    updDone();
    // zamanlayıcı
    const tEl = document.getElementById('xtimer');
    const tick = () => {
      const el = (Date.now() - ex.startedAt) / 1000;
      if (ex.minutes > 0) {
        const left = ex.minutes * 60 - el;
        tEl.textContent = `⏱ ${fmtTime(left)}`;
        tEl.className = 'xtimer' + (left < 60 ? ' bad' : left < 600 ? ' warn' : '');
        if (left <= 0) { stopTimers(); alert('⏰ Süre doldu! Puanlamaya geçiliyor.'); toGrade(true); }
      } else tEl.textContent = `⏱ ${fmtTime(el)} (süresiz)`;
    };
    tick();
    timer = setInterval(tick, 1000);
  }

  function renderAnswer(body, it, q, a, save) {
    if (q.type === 'calc') {
      const inst = E.calcInstance(it);
      const vals = (a && a.vals) || [];
      body.innerHTML = `<div class="xq-text">${inst.statement}</div>
        <div class="xfields">${inst.fields.map((f, k) => `<label class="fld"><span>${esc(f.label)} =</span><input type="text" inputmode="decimal" autocomplete="off" spellcheck="false" data-k="${k}" value="${esc(vals[k] || '')}" placeholder="${f.unit === '%' ? 'ör. 85' : ''}">${f.unit === '%' ? '<span class="unit">%</span>' : ''}</label>`).join('')}</div>
        <p class="note">Ara değerleri 2 ondalıkla yazman yeterli. Yüzde alanlarına yüzde sayısı gir (ör. 86.96).</p>`;
      body.querySelectorAll('input').forEach((inp) => inp.addEventListener('input', () => {
        const v = [...body.querySelectorAll('input')].map((x) => x.value);
        save({ vals: v });
      }));
      return;
    }
    const qtext = `<div class="xq-text">${q.q}</div>`;
    if (q.type === 'open') {
      body.innerHTML = qtext + `
        <textarea class="xopen" rows="9" placeholder="Cevabını yaz (İngilizce ya da Türkçe; madde madde yazabilirsin)…">${esc((a && a.text) || '')}</textarea>
        <label class="qt small"><input type="checkbox" class="xpaper" ${a && a.paper ? 'checked' : ''}> Cevabı kâğıda/aklımdan verdim — bitişte rubrikle kendim puanlayacağım</label>`;
      const ta = body.querySelector('textarea'), cb = body.querySelector('.xpaper');
      const s = () => save({ text: ta.value, paper: cb.checked });
      ta.addEventListener('input', s); cb.addEventListener('change', s);
      return;
    }
    if (q.type === 'order') {
      const perm = it.perm;
      let seq = ((a && a.seq) || []).slice();
      const draw = () => {
        const left = perm.filter((k) => !seq.includes(k));
        body.innerHTML = qtext + `
          <div class="xorder">
            <div><div class="qh small">Senin sıran <span class="muted">(çıkarmak için dokun)</span></div>
              <ol class="xseq">${seq.map((k) => `<li><button class="xitem sel" data-rm="${k}">${esc(q.items[k])}</button></li>`).join('') || '<li class="muted small xempty">Aşağıdan sırayla seç…</li>'}</ol></div>
            <div><div class="qh small">Ögeler <span class="muted">(sıradakini seç)</span></div>
              <div class="xpool">${left.map((k) => `<button class="xitem" data-add="${k}">${esc(q.items[k])}</button>`).join('') || '<span class="muted small">Hepsi yerleştirildi ✓</span>'}</div></div>
          </div>
          ${seq.length ? '<button class="btn ghost sm" data-reset>Sıfırla</button>' : ''}`;
        body.querySelectorAll('[data-add]').forEach((b) => b.addEventListener('click', () => { seq.push(+b.dataset.add); save({ seq: seq.slice() }); draw(); }));
        body.querySelectorAll('[data-rm]').forEach((b) => b.addEventListener('click', () => { seq = seq.filter((k) => k !== +b.dataset.rm); save({ seq: seq.slice() }); draw(); }));
        const r = body.querySelector('[data-reset]');
        if (r) r.addEventListener('click', () => { seq = []; save({ seq: [] }); draw(); });
      };
      draw();
      return;
    }
    if (q.type === 'match') {
      const sel = ((a && a.sel) || []).slice();
      body.innerHTML = qtext + `<div class="xmatch">${q.pairs.map((p, k) => `
        <label class="xmrow"><span class="xml">${esc(p[0])}</span>
          <select data-k="${k}"><option value="">— seç —</option>${it.perm.map((j) => `<option value="${j}" ${sel[k] === j ? 'selected' : ''}>${esc(q.pairs[j][1])}</option>`).join('')}</select></label>`).join('')}</div>`;
      body.querySelectorAll('select').forEach((s) => s.addEventListener('change', () => {
        sel[+s.dataset.k] = s.value === '' ? null : +s.value;
        save({ sel: sel.slice() });
      }));
      return;
    }
    if (q.type === 'classify') {
      const sel = ((a && a.sel) || []).slice();
      const draw = () => {
        body.innerHTML = qtext + `<div class="xclass">${it.perm.map((k) => `
          <div class="xcrow"><div class="xcl">${esc(q.items[k][0])}</div>
            <div class="xseg">${q.cats.map((c, ci) => `<button class="${sel[k] === ci ? 'on' : ''}" data-k="${k}" data-c="${ci}">${esc(c)}</button>`).join('')}</div></div>`).join('')}</div>`;
        body.querySelectorAll('[data-c]').forEach((b) => b.addEventListener('click', () => {
          const k = +b.dataset.k, c = +b.dataset.c;
          sel[k] = sel[k] === c ? null : c;
          save({ sel: sel.slice() });
          draw();
        }));
      };
      draw();
      return;
    }
    if (q.type === 'mcq') {
      const multi = Array.isArray(q.answer);
      let sel = ((a && a.sel) || []).slice();
      const draw = () => {
        body.innerHTML = qtext + (multi ? '<p class="note">Birden fazla doğru var; yanlış seçimler doğru seçimlerden düşülür.</p>' : '') +
          `<div class="opts ${multi ? 'multi' : ''}">${it.perm.map((k) => `<button class="opt ${sel.includes(k) ? 'sel' : ''}" data-k="${k}"><span class="box"></span><span>${esc(q.options[k])}</span></button>`).join('')}</div>`;
        body.querySelectorAll('[data-k]').forEach((b) => b.addEventListener('click', () => {
          const k = +b.dataset.k;
          if (multi) sel = sel.includes(k) ? sel.filter((x) => x !== k) : sel.concat([k]);
          else sel = [k];
          save({ sel: sel.slice() });
          draw();
        }));
      };
      draw();
    }
  }

  function toGrade(timeUp) {
    stopTimers();
    const ex = S.cur();
    if (!ex) return setup();
    ex.phase = 'grade';
    ex.finishedAt = Date.now();
    ex.timeUp = !!timeUp;
    // açık uçlu: önerilen işaretler
    ex.ticks = ex.items.map((it, k) => {
      const q = E.qById(it.qid);
      return q.type === 'open' ? E.suggestTicks(q, (ex.answers[k] && ex.answers[k].text) || '') : null;
    });
    S.saveCur(ex);
    if (location.hash === '#/sinav/sim') grading(); else location.hash = '#/sinav/sim';
    window.scrollTo(0, 0);
  }

  // ------------------------------------------------------------------ puanlama + inceleme (devam eden ya da kaydedilmiş)
  function reviewItem(ex, k, editable) {
    const it = ex.items[k];
    const q = E.qById(it.qid);
    const t = E.topicById(it.topic);
    const a = ex.answers[k];
    const g = E.gradeItem(it, a, ex.ticks && ex.ticks[k]);
    const scale = ex.mode === 'full' ? 100 / ex.rawMax : 1;
    const sc = (x) => Math.round(x * scale * 10) / 10;
    const head = `<div class="xq-head"><span class="xq-n">Soru ${k + 1}</span><span class="badge ${band(Math.round((100 * g.got) / g.max))}" data-score="${k}">${sc(g.got)}/${sc(g.max)}</span><span class="muted small">${TYPE_LABEL[q.type]} · <a href="#/sinav/k/${t.id}">${t.n}. ${esc(topicShort(t))}</a></span></div>`;
    let inner = '';
    if (q.type === 'open') {
      const txt = (a && a.text) || '';
      const ticks = (ex.ticks && ex.ticks[k]) || E.suggestTicks(q, txt);
      const model = q.model || t.answer;
      inner = `<div class="xq-text">${q.q}</div>
        <div class="xgrid2">
          <div><div class="qh small">Senin cevabın</div><div class="xyours">${txt.trim() ? esc(txt).replace(/\n/g, '<br>') : `<span class="muted">${a && a.paper ? 'Kâğıda / aklından cevapladın.' : 'Boş bırakıldı.'}</span>`}</div></div>
          <div><div class="qh small">Rubrik ${editable ? '<span class="muted">— yazdıklarında bulunanlar işaretlendi; düzelt</span>' : ''}${q.cap ? ` <span class="muted">(en çok ${q.cap} ölçüt puanı sayılır)</span>` : ''}</div>
            <div class="xrubric">${q.rubric.map((r, j) => `<label class="xrb ${ticks[j] ? 'on' : ''}"><input type="checkbox" data-k="${k}" data-j="${j}" ${ticks[j] ? 'checked' : ''} ${editable ? '' : 'disabled'}> <span>${esc(r[1])}</span><b>${r[0]}</b></label>`).join('')}</div></div>
        </div>
        <details class="xreveal" ${editable ? 'open' : ''}><summary>Örnek cevap (İngilizce)</summary>${model}</details>`;
    } else if (q.type === 'calc') {
      const inst = E.calcInstance(it);
      const vals = (a && a.vals) || [];
      inner = `<div class="xq-text">${inst.statement}</div>
        <table class="xres"><tr><th>Alan</th><th>Senin</th><th>Doğru</th></tr>${inst.fields.map((f, j) => `<tr class="${g.ok[j] ? 'ok' : 'no'}"><td>${esc(f.label)}</td><td>${esc(vals[j] || '—')}</td><td>${IM.F(f.ans).show()}${f.unit === '%' ? '%' : ''}</td></tr>`).join('')}</table>
        <details class="xreveal"><summary>Çözüm</summary>${inst.solution}</details>`;
    } else if (q.type === 'order') {
      const seq = (a && a.seq) || [];
      inner = `<div class="xq-text">${q.q}</div><div class="xgrid2">
        <div><div class="qh small">Senin sıran</div><ol class="xlist">${seq.map((j) => `<li>${esc(q.items[j])}</li>`).join('') || '<li class="muted">Boş</li>'}</ol></div>
        <div><div class="qh small">Doğru sıra</div><ol class="xlist">${q.items.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></div></div>
        <p class="small muted">Puan = en uzun doğru sıralı alt dizi ${g.lcs}/${g.n}.</p>`;
    } else if (q.type === 'match') {
      const sel = (a && a.sel) || [];
      inner = `<div class="xq-text">${q.q}</div><table class="xres"><tr><th></th><th>Senin eşleştirmen</th><th>Doğru</th></tr>${q.pairs.map((p, j) => `<tr class="${g.ok[j] ? 'ok' : 'no'}"><td><b>${esc(p[0])}</b></td><td>${sel[j] == null ? '—' : esc(q.pairs[sel[j]][1])}</td><td>${esc(p[1])}</td></tr>`).join('')}</table>`;
    } else if (q.type === 'classify') {
      const sel = (a && a.sel) || [];
      inner = `<div class="xq-text">${q.q}</div><table class="xres"><tr><th></th><th>Senin</th><th>Doğru</th></tr>${q.items.map((x, j) => `<tr class="${g.ok[j] ? 'ok' : 'no'}"><td>${esc(x[0])}</td><td>${sel[j] == null ? '—' : esc(q.cats[sel[j]])}</td><td>${esc(q.cats[x[1]])}</td></tr>`).join('')}</table>`;
    } else if (q.type === 'mcq') {
      const sel = (a && a.sel) || [];
      const A = Array.isArray(q.answer) ? q.answer : [q.answer];
      inner = `<div class="xq-text">${q.q}</div><div class="opts">${q.options.map((o, j) => `<div class="opt ${A.includes(j) ? 'right' : sel.includes(j) ? 'wrong' : ''}"><span class="box"></span><span>${esc(o)}${sel.includes(j) ? ' <b>(seçtin)</b>' : ''}</span></div>`).join('')}</div>`;
    }
    return `<div class="card xq xrev" id="xrev-${k}">${head}<div class="xq-body">${inner}</div></div>`;
  }

  function scoreBlock(ex) {
    const grades = ex.items.map((it, k) => E.gradeItem(it, ex.answers[k], ex.ticks && ex.ticks[k]));
    const sum = E.summarize(ex, grades);
    return { grades, sum };
  }

  function grading() {
    const ex = S.cur();
    if (!ex) return setup();
    const nOpen = ex.items.filter((it) => E.qById(it.qid).type === 'open').length;
    main.innerHTML = `
      <div class="crumb"><a href="#/sinav">📝 Sınav Hazırlık</a> › Puanlama</div>
      <h1 class="ttl">🧾 Puanlama ${ex.timeUp ? '<small class="bad">süre doldu</small>' : ''}</h1>
      <div class="card xscorebar"><div><span class="muted small">Şu anki puan</span><div class="xbig" id="xlive"></div></div>
        <div class="muted small">${nOpen ? `${nOpen} açık uçlu soruda rubriği kontrol et: kutular yazdıklarındaki anahtar kavramlara göre önceden işaretlendi. Gerçekten yazdığın/doğru açıkladığın ölçütleri bırak, gerisini kaldır.` : 'Tüm sorular otomatik puanlandı.'}</div>
        <button class="btn primary" id="xsave">Sonucu kaydet →</button></div>
      ${ex.items.map((_, k) => reviewItem(ex, k, true)).join('')}
      <div class="after"><button class="btn primary" id="xsave2">Sonucu kaydet →</button></div>`;
    const live = () => {
      const { sum, grades } = scoreBlock(ex);
      const scale = ex.mode === 'full' ? 100 / ex.rawMax : 1;
      document.getElementById('xlive').innerHTML = `${Math.round(sum.got * scale * 10) / 10} <small>/ ${Math.round(sum.max * scale * 10) / 10} · %${sum.pct}</small>`;
      grades.forEach((g, k) => {
        const b = main.querySelector(`[data-score="${k}"]`);
        if (b) { b.textContent = `${Math.round(g.got * scale * 10) / 10}/${Math.round(g.max * scale * 10) / 10}`; b.className = `badge ${band(Math.round((100 * g.got) / g.max))}`; }
      });
    };
    main.querySelectorAll('.xrubric input').forEach((cb) => cb.addEventListener('change', () => {
      const k = +cb.dataset.k, j = +cb.dataset.j;
      ex.ticks[k][j] = cb.checked;
      cb.closest('.xrb').classList.toggle('on', cb.checked);
      S.saveCur(ex);
      live();
    }));
    live();
    const saveIt = () => {
      const { sum } = scoreBlock(ex);
      const used = Math.round(((ex.finishedAt || Date.now()) - ex.startedAt) / 1000);
      const attempt = { at: ex.finishedAt || Date.now(), mode: ex.mode, got: sum.got, max: sum.max, used, pt: sum.perTopic };
      S.addAttempt(attempt);
      const weak = Object.keys(sum.perTopic).filter((tid) => sum.perTopic[tid][0] / sum.perTopic[tid][1] < 0.6);
      if (weak.length) S.dueNow(weak);
      S.saveLast({ exam: ex, attempt });
      S.saveCur(null);
      IM.examUI.onChange();
      location.hash = '#/sinav/sonuc';
    };
    document.getElementById('xsave').addEventListener('click', saveIt);
    document.getElementById('xsave2').addEventListener('click', saveIt);
  }

  // ------------------------------------------------------------------ sonuç
  function result() {
    const last = S.last();
    if (!last) return hub();
    const ex = last.exam, a = last.attempt;
    const pct = Math.round((1000 * a.got) / a.max) / 10;
    const scale = ex.mode === 'full' ? 100 / ex.rawMax : 1;
    const rows = Object.keys(a.pt).map((tid) => {
      const t = E.topicById(tid);
      const p = Math.round((100 * a.pt[tid][0]) / a.pt[tid][1]);
      return { t, p, g: a.pt[tid] };
    }).sort((x, y) => x.p - y.p);
    const weak = rows.filter((r) => r.p < 60);
    const verdict = pct >= 85 ? 'Çok iyi — sınava hazırsın; kalan zayıf noktaları kapat.' : pct >= 70 ? 'İyi — birkaç konuyu tekrar edersen yüksek puan gelir.' : pct >= 50 ? 'Orta — zayıf konuların anlatımına ve kartlarına dön, sonra yeniden dene.' : 'Daha çalışmalısın — önce konu anlatımlarını oku, kartlarla ezberle, sonra tekrar dene.';
    main.innerHTML = `
      <div class="crumb"><a href="#/sinav">📝 Sınav Hazırlık</a> › Sonuç</div>
      <h1 class="ttl">📊 Sınav sonucu <small>${esc(E.MODES[ex.mode] ? E.MODES[ex.mode].label : ex.mode)} · ${fmtDate(a.at)}${a.used ? ' · ' + fmtTime(a.used) + ' dk' : ''}</small></h1>
      <div class="card endcard xresult">
        <div class="score ${band(pct)}">${Math.round(a.got * scale * 10) / 10} <small>/ ${Math.round(a.max * scale * 10) / 10} · %${pct}</small></div>
        <p>${verdict}</p>
        <div class="xbars">${rows.map((r) => `
          <a class="xbarrow" href="#/sinav/k/${r.t.id}"><span class="xbl">${r.t.n}. ${esc(topicShort(r.t))}</span>
          <span class="xbt"><span class="xbf ${band(r.p)}" style="width:${Math.max(2, r.p)}%"></span></span><span class="xbp">%${r.p}</span></a>`).join('')}</div>
        ${weak.length ? `<p class="small">Puanı %60'ın altında kalan <b>${weak.length}</b> konunun ezber kartları tekrar sırasına alındı.</p>` : ''}
        <div class="endbtns">
          ${weak.length ? `<a class="btn primary" href="#/sinav/ezber">🧠 Zayıf konuların kartları</a>` : ''}
          <a class="btn ${weak.length ? '' : 'primary'}" href="#/sinav/sim">🎯 Yeni sınav</a>
          <a class="btn ghost" href="#/sinav">📝 Sınav Hazırlık</a>
        </div>
      </div>
      <h2 class="sec">🔍 Soru soru inceleme</h2>
      ${ex.items.map((_, k) => reviewItem(ex, k, false)).join('')}`;
  }

  // ------------------------------------------------------------------ yönlendirici
  IM.examUI = {
    onChange: () => {},
    stop: stopTimers,
    route(mainEl, parts) {
      stopTimers();
      main = mainEl;
      const [p0, p1] = parts;
      if (!p0) hub();
      else if (p0 === 'k') lesson(p1);
      else if (p0 === 'ezber') recall(p1 || null, false);
      else if (p0 === 'kagit') sheet();
      else if (p0 === 'sim') simulate();
      else if (p0 === 'sonuc') result();
      else hub();
    },
    // kenar çubuğu bağlantıları (app.js renderNav)
    nav(cur) {
      const st = S.get();
      const now = Date.now();
      const due = E.cards.filter((c) => !st.cards[c.id] || st.cards[c.id].due <= now).length;
      const ms = E.mastery(st);
      const a = (href, icon, label, extra, active) => `<a class="nav-t${active ? ' active' : ''}" href="${href}"><span class="tid">${icon}</span><span class="tt">${label}</span>${extra || ''}</a>`;
      let h = `<div class="nav-ch">📝 Sınav Hazırlık</div>`;
      h += a('#/sinav', '🏁', 'Genel bakış', '', cur === '#/sinav');
      h += a('#/sinav/sim', '🎯', 'Sınav simülasyonu', S.cur() ? '<span class="badge mid">devam</span>' : '', cur.startsWith('#/sinav/sim') || cur.startsWith('#/sinav/sonuc'));
      h += a('#/sinav/ezber', '🧠', 'Ezber kartları', due ? `<span class="badge lo">${due}</span>` : '', cur.startsWith('#/sinav/ezber'));
      h += `<details class="nav-x" ${cur.startsWith('#/sinav/k/') ? 'open' : ''}><summary>17 konu anlatımı</summary>`;
      E.topics.forEach((t) => {
        const m = ms[t.id];
        const sc = m.exam != null ? `<span class="badge ${band(m.exam)}">%${m.exam}</span>` : m.read ? '<span class="okmark">✓</span>' : '';
        h += a(`#/sinav/k/${t.id}`, String(t.n), esc(topicShort(t)), sc, cur === `#/sinav/k/${t.id}`);
      });
      h += `</details>`;
      return h;
    },
  };
})();
