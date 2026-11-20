/* Exact rational arithmetic (BigInt) + tolerant user-answer parsing. Display is ALWAYS decimal (fixed()).
   IM.F(x) accepts Frac | number | bigint | "a/b" | "3.75" | "3,75". */
(function () {
  const IM = window.IM;

  const babs = (a) => (a < 0n ? -a : a);
  const gcd = (a, b) => {
    a = babs(a);
    b = babs(b);
    while (b) [a, b] = [b, a % b];
    return a;
  };

  class Frac {
    constructor(n, d = 1n) {
      if (typeof n !== 'bigint') n = BigInt(n);
      if (typeof d !== 'bigint') d = BigInt(d);
      if (d === 0n) throw new Error('Frac: division by zero');
      if (d < 0n) {
        n = -n;
        d = -d;
      }
      const g = gcd(n, d) || 1n;
      this.n = n / g;
      this.d = d / g;
    }
    static of(x) {
      if (x instanceof Frac) return x;
      if (typeof x === 'bigint') return new Frac(x);
      if (typeof x === 'number') {
        if (Number.isInteger(x)) return new Frac(BigInt(x));
        const p = Frac.parse(String(x));
        if (p) return p;
        throw new Error('Frac.of: bad number ' + x);
      }
      if (typeof x === 'string') {
        const p = Frac.parse(x);
        if (p) return p;
      }
      throw new Error('Frac.of: cannot convert ' + x);
    }
    // Parses "15/4", "-3", "3.75", "3,75", "1.5/2". Returns null if invalid.
    // opt.thousands (varsayılan true): "12,500" / "1,234,567" binlik ayraç sayılır -> tam sayı.
    // checkNum bunu beklenen cevaba göre ayarlar: beklenen cevap tam sayı DEĞİLSE "12,500" = 12.5 (ondalık virgül).
    static parse(s, opt) {
      if (s == null) return null;
      const thousands = !opt || opt.thousands !== false;
      s = String(s).trim().replace(/\s+/g, '').replace(/−/g, '-');
      // binlik ayraç: "362,880" / "1,234,567" (ilk grup 1–3 hane ve sıfır değil) -> tam sayı. "0,375" ondalık kalır.
      if (thousands && /^[+-]?[1-9]\d{0,2}(,\d{3})+$/.test(s)) s = s.replace(/,/g, '');
      s = s.replace(/,/g, '.');
      if (s === '') return null;
      // yüzde: "12.5%" -> 12.5/100
      if (s.endsWith('%')) {
        const p = Frac.parse(s.slice(0, -1), opt);
        return p ? p.div(100) : null;
      }
      // bilimsel gösterim: "1e-3", "2.5E-4", "3e2"
      const em = /^([+-]?(?:\d+\.?\d*|\.\d+))[eE]([+-]?\d+)$/.exec(s);
      if (em) {
        const base = Frac.parse(em[1]);
        const k = parseInt(em[2], 10);
        if (!base || Math.abs(k) > 30) return null;
        return k >= 0 ? base.mul(new Frac(10n ** BigInt(k))) : base.div(new Frac(10n ** BigInt(-k)));
      }
      const dec = (t) => {
        const m = /^([+-]?)(\d*)(?:\.(\d*))?$/.exec(t);
        if (!m || (m[2] === '' && (m[3] === undefined || m[3] === ''))) return null;
        const sign = m[1] === '-' ? -1n : 1n;
        const ip = m[2] || '0';
        const fp = m[3] || '';
        const n = BigInt(ip + fp) * sign;
        const d = 10n ** BigInt(fp.length);
        return new Frac(n, d);
      };
      if (s.includes('/')) {
        const parts = s.split('/');
        if (parts.length !== 2) return null;
        const a = dec(parts[0]);
        const b = dec(parts[1]);
        if (!a || !b || b.n === 0n) return null;
        return a.div(b);
      }
      return dec(s);
    }
    add(o) {
      o = Frac.of(o);
      return new Frac(this.n * o.d + o.n * this.d, this.d * o.d);
    }
    sub(o) {
      o = Frac.of(o);
      return new Frac(this.n * o.d - o.n * this.d, this.d * o.d);
    }
    mul(o) {
      o = Frac.of(o);
      return new Frac(this.n * o.n, this.d * o.d);
    }
    div(o) {
      o = Frac.of(o);
      if (o.n === 0n) throw new Error('Frac: division by zero');
      return new Frac(this.n * o.d, this.d * o.n);
    }
    neg() {
      return new Frac(-this.n, this.d);
    }
    abs() {
      return new Frac(babs(this.n), this.d);
    }
    cmp(o) {
      o = Frac.of(o);
      const l = this.n * o.d;
      const r = o.n * this.d;
      return l < r ? -1 : l > r ? 1 : 0;
    }
    eq(o) { return this.cmp(o) === 0; }
    lt(o) { return this.cmp(o) < 0; }
    le(o) { return this.cmp(o) <= 0; }
    gt(o) { return this.cmp(o) > 0; }
    ge(o) { return this.cmp(o) >= 0; }
    isZero() { return this.n === 0n; }
    isInt() { return this.d === 1n; }
    floor() {
      let q = this.n / this.d;
      if (this.n < 0n && q * this.d !== this.n) q -= 1n;
      return new Frac(q);
    }
    ceil() {
      return this.isInt() ? this : this.floor().add(1);
    }
    frac() {
      return this.sub(this.floor());
    }
    toNumber() {
      return Number(this.n) / Number(this.d);
    }
    // decimal string, rounded to p places, trailing zeros trimmed
    dec(p = 2) {
      const v = this.toNumber();
      let s = v.toFixed(p);
      if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
      if (s === '-0') s = '0';
      return s;
    }
    // Display form used everywhere on the site: integers as-is, everything else as a decimal with
    // at least p places ("0.50", "41.25"). An exact 3-place decimal keeps its 3rd place ("1.125");
    // anything longer is rounded half away from zero to p places ("0.33"). Exact BigInt rounding.
    fixed(p = 2) {
      if (this.isInt()) return this.n.toString();
      let places = p;
      if (p === 2 && 1000n % this.d === 0n && 100n % this.d !== 0n) places = 3;
      const s = 10n ** BigInt(places);
      const a = babs(this.n) * s;
      let q = a / this.d;
      if (2n * (a % this.d) >= this.d) q += 1n;
      const ip = (q / s).toString();
      const fp = places ? '.' + (q % s).toString().padStart(places, '0') : '';
      return (this.n < 0n && q !== 0n ? '-' : '') + ip + fp;
    }
    toString() {
      return this.fixed();
    }
    // "41.25" or "41" (decimal; fractions are never shown as a/b)
    show(p = 2) {
      return this.fixed(p);
    }
    html() {
      return this.fixed();
    }
    // exact "a/b" form — for keys, tests and debugging only, never for display
    exact() {
      return this.d === 1n ? this.n.toString() : `${this.n}/${this.d}`;
    }
    // true if the value is a decimal with at most p places (den divides 10^p)
    isNice(p = 2) {
      return (10n ** BigInt(p)) % this.d === 0n;
    }
    key() {
      return this.exact();
    }
  }

  IM.Frac = Frac;
  IM.F = (x) => Frac.of(x);

  /* Check a user-typed number against the correct value.
     Accepts decimals ("41.25", "41,25"), percents ("85%"), e-notation and, silently, exact fractions ("165/4").
     unit === '%': the field expects a PERCENT number (85 for %85). "85" and "85%" both pass; a value ≤ 1 typed into a
       percent field (e.g. 0.85) is NOT counted wrong — returns {warn} so the runner asks for a percent.
     Tolerance (IMS): default 0.006 + 0.001·|c| (2-decimal rounding + ‰1 relative). Integer correct answer with no tol:
       only exact equality (⌈⌉ kararları, sayımlar).
     Separator rule: "3,75" = 3.75. "12,500" counts as thousands (12500) ONLY when the correct answer is an integer.
     Returns {ok, parsed:boolean, warn?:string} */
  IM.checkNum = function (userStr, correct, tol, unit) {
    const c = Frac.of(correct);
    let s = String(userStr == null ? '' : userStr).trim();
    const pctField = unit === '%';
    if (pctField) s = s.replace(/\s*%$/, '');
    const u = Frac.parse(s, { thousands: c.isInt() });
    if (!u) return { ok: false, parsed: false };
    if (pctField && u.abs().le(1) && c.abs().gt(1)) return { ok: false, parsed: true, warn: 'Yüzde olarak gir (ör. 85 ya da 85%).' };
    if (u.eq(c)) return { ok: true, parsed: true };
    if (tol == null && c.isInt()) return { ok: false, parsed: true };
    const cn = c.toNumber();
    const t = tol != null ? tol : 0.006 + 0.001 * Math.abs(cn);
    return { ok: Math.abs(u.toNumber() - cn) <= t + 1e-12, parsed: true };
  };
})();
