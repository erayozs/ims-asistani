/* Visualizations (saf SVG/HTML, kütüphane yok; renkler CSS değişkenlerinden → karanlık modda da çalışır).
   Her çizici bir HTML dizgesi döndürür. "viz spec" bir nesne ya da nesne dizisidir:

   { type:'bars',   labels:[str], values:[num], highlight?:[idx], decimals?:2, valueLabels?:[html], yLabel?, ref?:[{v, label}], caption? }
        Karşılaştırma çubukları. highlight'lı çubuklar vurgulanır. ref = yatay referans çizgisi (ör. takt time, hedef).
   { type:'tree',   nodes:[{ id, parent:id|null, label?:html, edge?:html, leaf?:html, hl?:bool, dim?:bool }], dir?:'down', caption? }
        dir yoksa soldan sağa ağaç. dir:'down' → YUKARIDAN AŞAĞI ürün ağacı / BOM: label = parça adı ("B"),
        edge = kenar üstündeki miktar ("×2" ya da "(2)"), leaf = düğümün altındaki küçük not ("LT 2 hf").
   { type:'matrix', rowLabels?, colLabels?, corner?, cells:[[html]], cls?:[[cssClass]], caption? }
        Tablo (MRP zaman çizelgesi, AGV veri tablosu, VSM verisi…). Hücre sınıfları: 'hl' (yeşil vurgu), 'sel' (mavi çerçeve),
        'dim' (soluk), 'm' (kırmızı).
   { type:'stack',  rows:[{ label:html, segs:[{ v:number, label?:html, cls?:'s1'|'s2'|'s3'|'s4'|'hl'|'dim' }], total?:html }],
                    unit?:'min', max?:number, legend?:[{ cls, label }], caption? }
        Yatay yığılmış çubuklar: MLT bileşenleri (Tsu, Q·To, Tno), OEE kayıp zinciri, geleneksel vs FMS karşılaştırması.
   { type:'flow',   items:[{ kind:'proc', title, lines?:[html], hl? } | { kind:'inv', label?, hl? } | { kind:'ext', title, hl? }],
                    timeline?:{ inv:[html], proc:[html], lt?:html, va?:html }, caption? }
        Değer akışı haritası (VSM) şeridi: süreç kutuları + envanter üçgenleri (I) + altta zaman merdiveni
        (üst basamak = envanter bekleme günü, alt basamak = süreç C/T). timeline.inv/proc sırasıyla envanter ve süreç sayısı kadar.
   { type:'agvmap', highlight?:[segNo], from?:'A', to?:'e', caption? }
        Ders notundaki AGV simülasyon yerleşimi (AGV s.23): 12 yol segmenti, A/B giriş–çıkış, M1(a,b) M2(c,d) M3(e,f).
        Okların yönü notlardaki şekilden; highlight = vurgulanacak segment numaraları (yol).
   { type:'html',   html }
   IM.viz.render(spec|[spec…]) -> html string */
(function () {
  const IM = window.IM;
  const esc = (s) => IM.util.esc(s);
  let uid = 0;
  const cap = (spec) => (spec.caption ? `<div class="viz-cap">${spec.caption}</div>` : '');

  // ------------------------------------------------------------------ bars
  function bars(spec) {
    const labels = spec.labels || [], vals = spec.values || [];
    if (!labels.length || labels.length !== vals.length) throw new Error('bars: labels/values length mismatch');
    const hl = new Set(spec.highlight || []);
    const dec = spec.decimals != null ? spec.decimals : 2;
    const n = vals.length;
    const W = Math.max(280, Math.min(460, 40 + n * 38)), H = 190, padL = 38, padB = 30, padT = 18, padR = 8;
    const vmax = Math.max(...vals, ...(spec.ref || []).map((r) => r.v), 1e-9) * 1.12;
    const bw = (W - padL - padR) / n;
    const Y = (v) => H - padB - (v / vmax) * (H - padB - padT);
    let svg = `<svg class="vz-bars" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">`;
    for (let g = 0; g <= 4; g++) {
      const v = (vmax * g) / 4;
      svg += `<line class="vz-grid" x1="${padL}" y1="${Y(v)}" x2="${W - padR}" y2="${Y(v)}"/><text class="vz-tick" x="${padL - 4}" y="${Y(v) + 3}" text-anchor="end">${+v.toFixed(Math.min(dec, 3))}</text>`;
    }
    vals.forEach((v, i) => {
      const x = padL + i * bw + bw * 0.14, w = bw * 0.72;
      svg += `<rect class="vz-bar${hl.has(i) ? ' hl' : ''}" x="${x}" y="${Y(v)}" width="${w}" height="${Math.max(0, H - padB - Y(v))}" rx="2"/>`;
      const lab = spec.valueLabels ? spec.valueLabels[i] : +v.toFixed(dec);
      svg += `<text class="vz-val" x="${x + w / 2}" y="${Y(v) - 4}" text-anchor="middle">${lab}</text>`;
      svg += `<text class="vz-lab" x="${x + w / 2}" y="${H - padB + 14}" text-anchor="middle">${labels[i]}</text>`;
    });
    (spec.ref || []).forEach((r) => {
      svg += `<line class="vz-ref" x1="${padL}" y1="${Y(r.v)}" x2="${W - padR}" y2="${Y(r.v)}"/>`;
      if (r.label) svg += `<text class="vz-reflab" x="${W - padR - 2}" y="${Y(r.v) - 4}" text-anchor="end">${r.label}</text>`;
    });
    svg += `<line class="vz-axis" x1="${padL}" y1="${H - padB}" x2="${W - padR}" y2="${H - padB}"/><line class="vz-axis" x1="${padL}" y1="${padT - 4}" x2="${padL}" y2="${H - padB}"/>`;
    if (spec.yLabel) svg += `<text class="vz-tick" x="${padL + 4}" y="${padT - 6}">${spec.yLabel}</text>`;
    svg += `</svg>`;
    return `<div class="viz viz-bars">${cap(spec)}${svg}</div>`;
  }

  // ------------------------------------------------------------------ tree (left → right; dir:"down" → treeDown)
  function tree(spec) {
    if (spec.dir === 'down') return treeDown(spec);
    const nodes = spec.nodes || [];
    if (!nodes.length) return '';
    const byId = {};
    nodes.forEach((n) => (byId[n.id] = Object.assign({ kids: [] }, n)));
    let root = null;
    nodes.forEach((n) => {
      if (n.parent != null && byId[n.parent]) byId[n.parent].kids.push(byId[n.id]);
      else if (!root) root = byId[n.id];
    });
    if (!root) throw new Error('tree: no root');
    const LEVEL = 128, ROW = 34, NW = 84, NH = 22, padL = 6, padT = 10;
    let slot = 0, maxD = 0;
    const place = (n, d) => {
      n.d = d; maxD = Math.max(maxD, d);
      if (!n.kids.length) n.y = slot++ * ROW;
      else { n.kids.forEach((k) => place(k, d + 1)); n.y = (n.kids[0].y + n.kids[n.kids.length - 1].y) / 2; }
      n.x = d * LEVEL;
    };
    place(root, 0);
    const hasLeaf = nodes.some((n) => n.leaf);
    const W = padL + maxD * LEVEL + NW + (hasLeaf ? 110 : 10), H = padT * 2 + Math.max(1, slot) * ROW;
    let svg = `<svg class="vz-tree" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">`;
    const all = Object.values(byId);
    all.forEach((n) => n.kids.forEach((k) => {
      const x1 = padL + n.x + NW, y1 = padT + n.y + NH / 2, x2 = padL + k.x, y2 = padT + k.y + NH / 2;
      svg += `<line class="vz-edge${k.hl ? ' hl' : ''}${k.dim ? ' dim' : ''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
      if (k.edge != null) svg += `<text class="vz-elabel${k.hl ? ' hl' : ''}" x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 3}" text-anchor="middle">${k.edge}</text>`;
    }));
    all.forEach((n) => {
      const x = padL + n.x, y = padT + n.y;
      svg += `<g class="vz-node${n.hl ? ' hl' : ''}${n.dim ? ' dim' : ''}"><rect x="${x}" y="${y}" width="${NW}" height="${NH}" rx="6"/><text x="${x + NW / 2}" y="${y + NH / 2 + 4}" text-anchor="middle">${n.label != null ? n.label : ''}</text></g>`;
      if (n.leaf) svg += `<text class="vz-leaf${n.hl ? ' hl' : ''}" x="${x + NW + 8}" y="${y + NH / 2 + 4}">${n.leaf}</text>`;
    });
    svg += `</svg>`;
    return `<div class="viz viz-tree">${cap(spec)}<div class="tree-scroll">${svg}</div></div>`;
  }

  // ------------------------------------------------------------------ matrix / table
  function matrix(spec) {
    const cls = spec.cls || [];
    let h = `<table class="mtx">`;
    if (spec.colLabels) h += `<tr><th>${spec.corner || ''}</th>${spec.colLabels.map((c) => `<th>${c}</th>`).join('')}</tr>`;
    spec.cells.forEach((row, i) => {
      h += `<tr>${spec.rowLabels ? `<th>${spec.rowLabels[i]}</th>` : ''}${row.map((c, j) => `<td class="${(cls[i] && cls[i][j]) || ''}">${c}</td>`).join('')}</tr>`;
    });
    h += `</table>`;
    return `<div class="viz viz-matrix">${cap(spec)}${h}</div>`;
  }

  // ------------------------------------------------------------------ top-down tree (BOM / ürün ağacı)
  function treeDown(spec) {
    const nodes = spec.nodes || [];
    if (!nodes.length) return '';
    const byId = {};
    nodes.forEach((n) => (byId[n.id] = Object.assign({ kids: [] }, n)));
    let root = null;
    nodes.forEach((n) => {
      if (n.parent != null && byId[n.parent]) byId[n.parent].kids.push(byId[n.id]);
      else if (!root) root = byId[n.id];
    });
    if (!root) throw new Error('tree(down): no root');
    const NW = 64, NH = 26, GAP = 14, LEVEL = 74, padX = 8, padT = 8;
    const hasLeaf = nodes.some((n) => n.leaf);
    let slot = 0, maxD = 0;
    const place = (n, d) => {
      n.d = d; maxD = Math.max(maxD, d);
      if (!n.kids.length) n.x = slot++ * (NW + GAP);
      else { n.kids.forEach((k) => place(k, d + 1)); n.x = (n.kids[0].x + n.kids[n.kids.length - 1].x) / 2; }
      n.y = d * LEVEL;
    };
    place(root, 0);
    const W = padX * 2 + Math.max(1, slot) * (NW + GAP) - GAP, H = padT * 2 + maxD * LEVEL + NH + (hasLeaf ? 16 : 0);
    let svg = `<svg class="vz-tree vz-bom" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">`;
    const all = Object.values(byId);
    all.forEach((n) => n.kids.forEach((k) => {
      const x1 = padX + n.x + NW / 2, y1 = padT + n.y + NH + (n.leaf ? 14 : 0), x2 = padX + k.x + NW / 2, y2 = padT + k.y;
      const ym = (y1 + y2) / 2;
      svg += `<path class="vz-edge${k.hl ? ' hl' : ''}${k.dim ? ' dim' : ''}" fill="none" d="M${x1},${y1} V${ym} H${x2} V${y2}"/>`;
      if (k.edge != null) svg += `<text class="vz-elabel${k.hl ? ' hl' : ''}" x="${x2 + 4}" y="${y2 - 6}">${k.edge}</text>`;
    }));
    all.forEach((n) => {
      const x = padX + n.x, y = padT + n.y;
      svg += `<g class="vz-node${n.hl ? ' hl' : ''}${n.dim ? ' dim' : ''}"><rect x="${x}" y="${y}" width="${NW}" height="${NH}" rx="6"/><text x="${x + NW / 2}" y="${y + NH / 2 + 4}" text-anchor="middle">${n.label != null ? n.label : ''}</text></g>`;
      if (n.leaf) svg += `<text class="vz-leaf${n.hl ? ' hl' : ''}" x="${x + NW / 2}" y="${y + NH + 12}" text-anchor="middle">${n.leaf}</text>`;
    });
    svg += `</svg>`;
    return `<div class="viz viz-tree">${cap(spec)}<div class="tree-scroll">${svg}</div></div>`;
  }

  // ------------------------------------------------------------------ horizontal stacked bars
  function stack(spec) {
    const rows = spec.rows || [];
    if (!rows.length) throw new Error('stack: no rows');
    const totals = rows.map((r) => (r.segs || []).reduce((a, g) => a + (+g.v || 0), 0));
    const max = spec.max || Math.max(...totals, 1e-9);
    const LW = 92, BW = 300, RH = 30, padT = 6, padR = 70;
    const W = LW + BW + padR, H = padT * 2 + rows.length * RH;
    let svg = `<svg class="vz-stack" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">`;
    rows.forEach((r, i) => {
      const y = padT + i * RH;
      svg += `<text class="vz-lab" x="${LW - 6}" y="${y + RH / 2 + 4}" text-anchor="end">${r.label != null ? r.label : ''}</text>`;
      let x = LW;
      (r.segs || []).forEach((g, k) => {
        const w = Math.max(0, ((+g.v || 0) / max) * BW);
        const c = g.cls || 's' + ((k % 4) + 1);
        svg += `<rect class="vz-seg ${c}" x="${x}" y="${y + 4}" width="${w}" height="${RH - 8}" rx="2"/>`;
        if (g.label != null && w >= 26) svg += `<text class="vz-segl" x="${x + w / 2}" y="${y + RH / 2 + 4}" text-anchor="middle">${g.label}</text>`;
        x += w;
      });
      const tot = r.total != null ? r.total : +totals[i].toFixed(2) + (spec.unit ? ' ' + spec.unit : '');
      svg += `<text class="vz-val" x="${x + 5}" y="${y + RH / 2 + 4}">${tot}</text>`;
    });
    svg += `</svg>`;
    const leg = spec.legend ? `<div class="viz-legend">${spec.legend.map((l) => `<span><span class="lg lgseg ${l.cls}"></span>${l.label}</span>`).join('')}</div>` : '';
    return `<div class="viz viz-stack">${cap(spec)}${svg}${leg}</div>`;
  }

  // ------------------------------------------------------------------ VSM flow strip
  function flow(spec) {
    const items = spec.items || [];
    if (!items.length) throw new Error('flow: no items');
    const PW = 96, TW = 46, EW = 70, G = 10, padT = 6;
    const lines = Math.max(1, ...items.filter((it) => it.kind === 'proc').map((it) => (it.lines || []).length));
    const PH = 24 + lines * 14;
    const tl = spec.timeline;
    const TLH = tl ? 50 : 0;
    let x = 6;
    const pos = items.map((it) => { const w = it.kind === 'proc' ? PW : it.kind === 'inv' ? TW : EW; const p = { x, w }; x += w + G; return p; });
    const W = x + (tl ? 92 : 0), H = padT + PH + 18 + TLH + 6;
    let svg = `<svg class="vz-flow" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">`;
    const midY = padT + PH / 2;
    items.forEach((it, i) => {
      const p = pos[i], hl = it.hl ? ' hl' : '';
      if (i > 0) svg += `<line class="vz-farrow" x1="${pos[i - 1].x + pos[i - 1].w + 1}" y1="${midY}" x2="${p.x - 1}" y2="${midY}"/>`;
      if (it.kind === 'proc') {
        svg += `<g class="vz-proc${hl}"><rect x="${p.x}" y="${padT}" width="${p.w}" height="${PH}" rx="4"/><line x1="${p.x}" y1="${padT + 20}" x2="${p.x + p.w}" y2="${padT + 20}"/>`;
        svg += `<text class="vz-ptitle" x="${p.x + p.w / 2}" y="${padT + 14}" text-anchor="middle">${it.title || ''}</text>`;
        (it.lines || []).forEach((l, k) => (svg += `<text class="vz-pline" x="${p.x + 5}" y="${padT + 34 + k * 14}">${l}</text>`));
        svg += `</g>`;
      } else if (it.kind === 'inv') {
        const cx = p.x + p.w / 2, ty = midY - 17, by = midY + 13;
        svg += `<g class="vz-inv${hl}"><polygon points="${cx},${ty} ${cx - 17},${by} ${cx + 17},${by}"/><text x="${cx}" y="${by - 6}" text-anchor="middle">I</text></g>`;
        if (it.label != null) svg += `<text class="vz-ilab${hl}" x="${cx}" y="${by + 14}" text-anchor="middle">${it.label}</text>`;
      } else {
        svg += `<g class="vz-ext${hl}"><rect x="${p.x}" y="${midY - 18}" width="${p.w}" height="36" rx="3"/><text x="${p.x + p.w / 2}" y="${midY + 4}" text-anchor="middle">${it.title || ''}</text></g>`;
      }
    });
    if (tl) {
      const yU = padT + PH + 24, yD = yU + 22;
      let ii = 0, pi = 0, d = '';
      let started = false;
      items.forEach((it, i) => {
        const p = pos[i];
        if (it.kind !== 'inv' && it.kind !== 'proc') return;
        const y = it.kind === 'inv' ? yU : yD;
        d += started ? ` V${y} H${p.x + p.w}` : `M${p.x},${y} H${p.x + p.w}`;
        started = true;
        const lab = it.kind === 'inv' ? (tl.inv || [])[ii++] : (tl.proc || [])[pi++];
        if (lab != null) svg += `<text class="vz-tl${it.kind === 'inv' ? ' up' : ''}" x="${p.x + p.w / 2}" y="${y - 4}" text-anchor="middle">${lab}</text>`;
      });
      svg += `<path class="vz-ladder" fill="none" d="${d}"/>`;
      const lx = x + 2;
      if (tl.lt != null) svg += `<text class="vz-tltot" x="${lx}" y="${yU - 2}">LT = ${tl.lt}</text>`;
      if (tl.va != null) svg += `<text class="vz-tltot va" x="${lx}" y="${yD + 12}">VA = ${tl.va}</text>`;
    }
    svg += `</svg>`;
    const hint = W > 440 ? `<div class="viz-legend">↔ şerit yatay kaydırılabilir · üst basamak = stok (gün), alt basamak = C/T</div>` : '';
    return `<div class="viz viz-flow">${cap(spec)}<div class="tree-scroll">${svg}</div>${hint}</div>`;
  }

  // ------------------------------------------------------------------ AGV simulation layout (AGV s.23)
  // Segment uçları (sütun 0..2, satır 0=üst..2=alt) ve şekildeki ok yönü. 'both' = iki yönlü: 11 (şekilde iki ok başı) ve 3
  // (şekilde tek ok aşağı, ama 2 numaralı segmentin tek çıkışı 3'tür ve tablolar 3'ü iki yönde kullanır: a→b 9,12,3 / b→e 3,4,5,6).
  const AGV_SEG = {
    1: [[0, 2], [1, 2], 'f'], 2: [[1, 2], [2, 2], 'f'], 3: [[2, 1], [2, 2], 'both'], 4: [[2, 1], [2, 0], 'f'],
    5: [[2, 0], [1, 0], 'f'], 6: [[1, 0], [0, 0], 'f'], 7: [[0, 0], [0, 1], 'f'], 8: [[0, 1], [0, 2], 'f'],
    9: [[1, 2], [1, 1], 'f'], 10: [[1, 1], [1, 0], 'f'], 11: [[0, 1], [1, 1], 'both'], 12: [[1, 1], [2, 1], 'f'],
  };
  // istasyon -> bulunduğu segmentin ortası; (dx,dy) etiket kayması
  const AGV_ST = { A: [1, 0, -14], B: [8, 14, 0], a: [9, 12, 0], b: [3, -12, 0], c: [4, -12, 0], d: [10, 12, 0], e: [6, 0, 16], f: [7, 12, 0] };
  function agvmap(spec) {
    const X = [40, 170, 300], Y = [28, 148, 268], W = 340, H = 300;
    const hl = new Set((spec.highlight || []).map(Number));
    const P = (c) => [X[c[0]], Y[c[1]]];
    let svg = `<svg class="vz-agv" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">`;
    const arrow = (x, y, ux, uy, cls) => {
      const s = 7, px = -uy, py = ux;
      return `<polygon class="vz-ah${cls}" points="${x + ux * s},${y + uy * s} ${x - ux * s + px * s * 0.7},${y - uy * s + py * s * 0.7} ${x - ux * s - px * s * 0.7},${y - uy * s - py * s * 0.7}"/>`;
    };
    Object.keys(AGV_SEG).forEach((k) => {
      const [a, b, dir] = AGV_SEG[k];
      const [x1, y1] = P(a), [x2, y2] = P(b);
      const c = hl.has(+k) ? ' hl' : '';
      svg += `<line class="vz-seg-l${c}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
      const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
      if (dir === 'both') {
        svg += arrow(x1 + (x2 - x1) * 0.2, y1 + (y2 - y1) * 0.2, ux, uy, c) + arrow(x1 + (x2 - x1) * 0.8, y1 + (y2 - y1) * 0.8, -ux, -uy, c);
      } else svg += arrow(x1 + (x2 - x1) * 0.78, y1 + (y2 - y1) * 0.78, ux, uy, c);
      // segment numarası: yatayda üstte, dikeyde solda
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const vert = x1 === x2;
      // alt sıradaki yatay segmentlerin (1, 2) numarası notlardaki gibi çizginin altında (A etiketi üstte)
      const below = !vert && y1 === Y[2];
      svg += `<text class="vz-segno${c}" x="${vert ? mx - 7 : mx}" y="${vert ? my - 22 : below ? my + 16 : my - 7}" text-anchor="${vert ? 'end' : 'middle'}">${k}</text>`;
    });
    Object.keys(AGV_ST).forEach((st) => {
      const [seg, dx, dy] = AGV_ST[st];
      const [a, b] = AGV_SEG[seg];
      const [x1, y1] = P(a), [x2, y2] = P(b);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const on = st === spec.from || st === spec.to;
      svg += `<circle class="vz-st${on ? ' on' : ''}" cx="${mx}" cy="${my}" r="${on ? 5.5 : 3.5}"/>`;
      svg += `<text class="vz-stl${on ? ' on' : ''}" x="${mx + dx}" y="${my + dy + 4}" text-anchor="middle">${st}</text>`;
    });
    [['M1', 235, 212], ['M2', 235, 92], ['M3', 105, 92]].forEach(([m, x, y]) => (svg += `<text class="vz-mach" x="${x}" y="${y}" text-anchor="middle">${m}</text>`));
    svg += `</svg>`;
    const leg = `<div class="viz-legend">İstasyonlar segment ortasında (AGV s.23). 3 ve 11 iki yönlü: simülasyon tablolarında iki yönde de kullanılıyor (s.27–28).</div>`;
    return `<div class="viz viz-agv">${cap(spec)}${svg}${leg}</div>`;
  }

  function render(spec) {
    if (!spec) return '';
    if (Array.isArray(spec)) return spec.map(render).join('');
    switch (spec.type) {
      case 'bars': return bars(spec);
      case 'tree': return tree(spec);
      case 'matrix': return matrix(spec);
      case 'stack': return stack(spec);
      case 'flow': return flow(spec);
      case 'agvmap': return agvmap(spec);
      case 'html': return `<div class="viz viz-html">${spec.html}</div>`;
      default: throw new Error('unknown viz type: ' + spec.type);
    }
  }

  IM.viz = { render, bars, tree, treeDown, matrix, stack, flow, agvmap };
})();
