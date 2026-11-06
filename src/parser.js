/* Travel plan markdown <-> model. Runs in browser (window.TP) and node (module.exports). */
(function (root) {
  'use strict';

  var STATUS = [
    ['✅', 'ยืนยันแล้ว'],
    ['📄', 'ตามเอกสาร'],
    ['🔎', 'ตรวจเว็บแล้ว'],
    ['⚠️', 'ต้องยืนยัน'],
    ['❓', 'ยังไม่ทราบ']
  ];
  var STATUS_WORDS = { confirmed: '✅', doc: '📄', web: '🔎', warn: '⚠️', unknown: '❓' };
  var TYPES = ['flight', 'train', 'bus', 'taxi', 'walk', 'hotel', 'food', 'cafe', 'market',
    'temple', 'museum', 'shopping', 'onsen', 'nature', 'nightlife', 'free', 'other'];
  var ITEM_KEYS = ['en', 'zh', 'type', 'status', 'highlight', 'line', 'transport', 'transport_en', 'line_alt', 'transport_alt', 'transport_alt_en', 'cost', 'cost_en', 'notes', 'notes_en', 'map', 'video'];
  var META_KEYS = ['title', 'title_en', 'subtitle', 'subtitle_en', 'country', 'country_native', 'start', 'end', 'timezone', 'travelers', 'style', 'style_en', 'version'];
  var DAY_KEYS = ['route', 'stay', 'summary', 'summary_en', 'theme_en'];

  /* Transit line registry. hex values are approximate display colours from memory, nudged where needed so 12.5px chip text reaches 4.5:1 (G, TRA). Not official brand values. */
  var LINES = {
    R: { hex: '#E3002C', en: 'Red Line', th: 'สายสีแดง', zh: '淡水信義線' },
    BL: { hex: '#0070BD', en: 'Blue Line', th: 'สายสีน้ำเงิน', zh: '板南線' },
    G: { hex: '#008357', en: 'Green Line', th: 'สายสีเขียว', zh: '松山新店線' },
    O: { hex: '#F8B61C', en: 'Orange Line', th: 'สายสีส้ม', zh: '中和新蘆線' },
    BR: { hex: '#C48C31', en: 'Brown Line', th: 'สายสีน้ำตาล', zh: '文湖線' },
    Y: { hex: '#FFDB00', en: 'Circular Line', th: 'สายสีเหลือง', zh: '環狀線' },
    AIRPORT: { hex: '#8246AF', en: 'Airport MRT', th: 'แอร์พอร์ต MRT', zh: '機場捷運' },
    HSR: { hex: '#E8601C', en: 'High Speed Rail', th: 'รถไฟความเร็วสูง', zh: '台灣高鐵' },
    TRA: { hex: '#52708F', en: 'Taiwan Railways', th: 'รถไฟท้องถิ่น', zh: '臺鐵' }
  };
  var LINE_ALIAS = { RED: 'R', BLUE: 'BL', GREEN: 'G', ORANGE: 'O', BROWN: 'BR', YELLOW: 'Y', CIRCULAR: 'Y', A: 'AIRPORT', 'AIRPORT MRT': 'AIRPORT', THSR: 'HSR' };
  // "BL, G, AIRPORT" or custom "Name#RRGGBB" -> [{code, hex|null, known, en, th, zh}]
  function parseLines(str) {
    return String(str || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean).map(function (tok) {
      var m = tok.match(/^(.*?)\s*#([0-9a-fA-F]{6})$/);
      if (m) { var nm = m[1] || ('#' + m[2]); return { code: nm, hex: '#' + m[2].toUpperCase(), known: true, en: nm, th: nm, zh: '' }; }
      var up = tok.toUpperCase(), key = LINES[up] ? up : LINE_ALIAS[up];
      if (key) { var d = LINES[key]; return { code: key, hex: d.hex, known: true, en: d.en, th: d.th, zh: d.zh }; }
      return { code: tok, hex: null, known: false, en: tok, th: tok, zh: '' };
    });
  }

  var FLIGHT_COLS = [['เที่ยวบิน', 'flight'], ['วันที่', 'date'], ['เส้นทาง', 'route'], ['ออก', 'dep'], ['ถึง', 'arr'], ['สถานะ', 'status'], ['หมายเหตุ', 'note']];
  var STAY_COLS = [['เช็กอิน', 'checkin'], ['เช็กเอาต์', 'checkout'], ['ชื่อ', 'name'], ['ที่อยู่', 'address'], ['หมายเหตุ', 'note'], ['สถานะ', 'status']];

  var SEC = { overview: 'ภาพรวม', pack: 'เตรียมของ', todo: 'To-do', ref: 'ข้อมูลอ้างอิง', plan: 'วางแผน' };
  var DAYSEC = { must: 'ห้ามพลาดวันนี้', caution: 'ข้อควรระวัง', extra: 'ข้อมูลเพิ่มเติม' };

  var uidN = 0;
  function uid() { uidN++; return 'x' + Date.now().toString(36) + uidN.toString(36) + Math.random().toString(36).slice(2, 6); }

  function normStatus(s) {
    s = (s || '').trim();
    if (!s) return '';
    if (s.charAt(0) === '⚠') return '⚠️';
    for (var i = 0; i < STATUS.length; i++) if (s.indexOf(STATUS[i][0]) === 0) return STATUS[i][0];
    return STATUS_WORDS[s.toLowerCase()] || '';
  }
  function isDate(s) { return /^\d{4}-\d{2}-\d{2}$/.test(s || '') && !isNaN(Date.parse(s + 'T00:00:00Z')); }
  function trimBlank(lines) {
    var a = 0, b = lines.length;
    while (a < b && !lines[a].trim()) a++;
    while (b > a && !lines[b - 1].trim()) b--;
    return lines.slice(a, b);
  }
  function oneLine(s) { return String(s == null ? '' : s).replace(/\s*\n+\s*/g, ' · ').trim(); }
  function cell(s) { return oneLine(s).replace(/\|/g, '\\|'); }

  function splitRow(l) {
    var s = l.trim();
    if (s.charAt(0) === '|') s = s.slice(1);
    if (s.charAt(s.length - 1) === '|' && s.charAt(s.length - 2) !== '\\') s = s.slice(0, -1);
    var out = [], cur = '';
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (c === '\\' && s.charAt(i + 1) === '|') { cur += '|'; i++; continue; }
      if (c === '|') { out.push(cur.trim()); cur = ''; } else cur += c;
    }
    out.push(cur.trim());
    return out;
  }
  function isSep(row) { return row.every(function (c) { return /^:?-{2,}:?$/.test(c) || c === ''; }) && row.some(function (c) { return /-/.test(c); }); }

  // first markdown table in lines -> {headers, rows}
  function findTable(lines) {
    var start = -1;
    for (var i = 0; i < lines.length; i++) if (lines[i].trim().charAt(0) === '|') { start = i; break; }
    if (start < 0) return null;
    var t = [];
    for (var j = start; j < lines.length && lines[j].trim().charAt(0) === '|'; j++) t.push(splitRow(lines[j]));
    if (t.length < 2 || !isSep(t[1])) return null;
    return { headers: t[0], rows: t.slice(2) };
  }
  function tableToObjects(tbl, cols, warn, where) {
    if (!tbl) return [];
    var idx = {};
    cols.forEach(function (c) {
      var k = tbl.headers.indexOf(c[0]);
      if (k < 0) warn(where + ': ไม่พบคอลัมน์ "' + c[0] + '"');
      idx[c[1]] = k;
    });
    return tbl.rows.filter(function (r) { return r.some(function (c) { return c; }); }).map(function (r) {
      var o = { id: uid() };
      cols.forEach(function (c) { var k = idx[c[1]]; o[c[1]] = k >= 0 ? (r[k] || '') : ''; });
      if ('status' in o) o.status = normStatus(o.status) || o.status;
      return o;
    });
  }

  function splitH2(lines) {
    var pre = [], secs = [], cur = null, fence = false;
    lines.forEach(function (l) {
      if (/^\s*```/.test(l)) fence = !fence;
      var m = !fence && l.match(/^##\s+(?!#)(.*)$/);
      if (m) { cur = { title: m[1].trim(), lines: [] }; secs.push(cur); return; }
      (cur ? cur.lines : pre).push(l);
    });
    return { pre: pre, secs: secs };
  }
  function listItems(lines) {
    var out = [];
    lines.forEach(function (l) {
      var m = l.match(/^\s*[-*]\s+(.*)$/);
      if (m && m[1].trim()) out.push(m[1].trim());
    });
    return out;
  }

  function emptyTrip() {
    return {
      id: '', meta: { title: '', title_en: '', subtitle: '', subtitle_en: '', country: '', country_native: '', start: '', end: '', timezone: '', travelers: '', style: '', style_en: '', version: '' },
      overview: { flights: [], stays: [], remember: '', extra: [] },
      days: [], pack: [], todo: [], ref: [], plan: '',
      metaExtra: {}
    };
  }

  function parse(md) {
    var warnings = [];
    function warn(s) { warnings.push(s); }
    var trip = emptyTrip();
    var text = String(md || '').replace(/\r\n?/g, '\n').replace(/<!--[\s\S]*?-->/g, '');
    var lines = text.split('\n');
    var i = 0;
    while (i < lines.length && !lines[i].trim()) i++;
    if (lines[i] && lines[i].trim() === '---') {
      i++;
      for (; i < lines.length && lines[i].trim() !== '---'; i++) {
        var m = lines[i].match(/^\s*([A-Za-z_]+)\s*:\s*(.*)$/);
        if (!m) { if (lines[i].trim()) warn('front matter: อ่านบรรทัดนี้ไม่ได้ "' + lines[i].trim() + '"'); continue; }
        var k = m[1].trim(), v = m[2].trim();
        if (META_KEYS.indexOf(k) >= 0) trip.meta[k] = v; else { trip.metaExtra[k] = v; warn('front matter: ไม่รู้จัก field "' + k + '" (เก็บไว้ให้)'); }
      }
      i++;
    } else warn('ไม่พบส่วน --- (ข้อมูลทริป) ด้านบนไฟล์');

    // split H1 blocks
    var blocks = [], pre = [], cur = null, fence = false;
    for (; i < lines.length; i++) {
      var l = lines[i];
      if (/^\s*```/.test(l)) fence = !fence;
      var h = !fence && l.match(/^#\s+(?!#)(.*)$/);
      if (h) { cur = { title: h[1].trim(), lines: [] }; blocks.push(cur); continue; }
      (cur ? cur.lines : pre).push(l);
    }
    if (trimBlank(pre).length) { warn('มีข้อความก่อนหัวข้อ # แรก — ย้ายไปไว้ในส่วนวางแผน'); trip.plan = trimBlank(pre).join('\n'); }

    blocks.forEach(function (b) {
      var dm = b.title.match(/^Day\s+(\d+)\s*[—–-]\s*(\S+)\s*(?:·\s*(.*))?$/i);
      if (dm) return trip.days.push(parseDay(dm, b.lines, warn));
      switch (b.title) {
        case SEC.overview: return parseOverview(trip, b.lines, warn);
        case SEC.pack: return (trip.pack = parsePack(b.lines));
        case SEC.todo: return (trip.todo = parseTodo(b.lines));
        case SEC.ref: return (trip.ref = splitH2(b.lines).secs.map(function (s) { return { id: uid(), title: s.title, md: trimBlank(s.lines).join('\n') }; }).concat(refPre(b.lines)));
        case SEC.plan: trip.plan = (trip.plan ? trip.plan + '\n\n' : '') + trimBlank(b.lines).join('\n'); return;
        default:
          warn('ไม่รู้จักหัวข้อ "# ' + b.title + '" — ใส่ไว้ในข้อมูลอ้างอิง');
          trip.ref.push({ id: uid(), title: b.title, md: trimBlank(b.lines).join('\n') });
      }
    });

    var mt = trip.meta;
    if (!mt.title) warn('ไม่มี title');
    if (!isDate(mt.start) && trip.days.length && isDate(trip.days[0].date)) { mt.start = trip.days[0].date; warn('start ไม่ถูกต้อง — ใช้วันที่ของ Day แรกแทน'); }
    if (!isDate(mt.end) && trip.days.length && isDate(trip.days[trip.days.length - 1].date)) { mt.end = trip.days[trip.days.length - 1].date; warn('end ไม่ถูกต้อง — ใช้วันที่ของ Day สุดท้ายแทน'); }
    if (!isDate(mt.start)) warn('start ต้องเป็น YYYY-MM-DD');
    if (!isDate(mt.end)) warn('end ต้องเป็น YYYY-MM-DD');
    if (!mt.timezone) warn('ไม่มี timezone — ใช้เวลาของเครื่องแทน');
    if (!trip.days.length) warn('ไม่พบ # Day ในไฟล์');
    trip.days.forEach(function (d, k) {
      if (+d.n !== k + 1) warn('Day ' + d.n + ' อยู่ลำดับที่ ' + (k + 1) + ' — เว็บนับใหม่ตามลำดับในไฟล์');
    });
    return { trip: trip, warnings: warnings };
  }

  function refPre(lines) {
    var p = trimBlank(splitH2(lines).pre);
    return p.length ? [{ id: uid(), title: '', md: p.join('\n') }] : [];
  }

  function parseOverview(trip, lines, warn) {
    var s = splitH2(lines);
    if (trimBlank(s.pre).length) trip.overview.extra.push({ id: uid(), title: '', md: trimBlank(s.pre).join('\n') });
    s.secs.forEach(function (sec) {
      if (sec.title === 'เที่ยวบิน') trip.overview.flights = tableToObjects(findTable(sec.lines), FLIGHT_COLS, warn, 'เที่ยวบิน');
      else if (sec.title === 'ที่พัก') trip.overview.stays = tableToObjects(findTable(sec.lines), STAY_COLS, warn, 'ที่พัก');
      else if (sec.title === 'จำไว้ตลอดทริป') trip.overview.remember = trimBlank(sec.lines).join('\n');
      else trip.overview.extra.push({ id: uid(), title: sec.title, md: trimBlank(sec.lines).join('\n') });
    });
  }

  function parseDay(dm, lines, warn) {
    var day = { id: uid(), n: +dm[1], date: dm[2], theme: (dm[3] || '').trim(), theme_en: '', route: '', stay: '', summary: '', summary_en: '', items: [], must: [], caution: [], extra: '' };
    var where = 'Day ' + day.n;
    if (!isDate(day.date)) warn(where + ': วันที่ "' + day.date + '" ต้องเป็น YYYY-MM-DD');
    var mode = 'head', item = null, sec = null, extraParts = [];
    function flushSec() {
      if (!sec) return;
      if (sec.title === DAYSEC.must) day.must = day.must.concat(listItems(sec.lines));
      else if (sec.title === DAYSEC.caution) day.caution = day.caution.concat(listItems(sec.lines));
      else if (sec.title === DAYSEC.extra) extraParts.push(trimBlank(sec.lines).join('\n'));
      else { warn(where + ': ไม่รู้จัก "## ' + sec.title + '" — ใส่ไว้ในข้อมูลเพิ่มเติม'); extraParts.push('### ' + sec.title + '\n\n' + trimBlank(sec.lines).join('\n')); }
      sec = null;
    }
    var fence = false;
    lines.forEach(function (l) {
      if (/^\s*```/.test(l)) fence = !fence;
      var h3 = !fence && l.match(/^###\s+(?!#)(.*)$/);
      var h2 = !fence && l.match(/^##\s+(?!#)(.*)$/);
      if (h3 && mode !== 'sec') {
        var t = h3[1].trim(), mm = t.match(/^(.*?)\s*·\s*(.*)$/);
        item = { id: uid(), time: mm ? mm[1].trim() : '', title: mm ? mm[2].trim() : t, extra: {} };
        ITEM_KEYS.forEach(function (k) { item[k] = ''; }); item.type = 'other'; item.highlight = false;
        if (!mm) warn(where + ': รายการ "' + t + '" ไม่มี " · " คั่นเวลากับชื่อ');
        day.items.push(item); mode = 'item'; return;
      }
      if (h2) { flushSec(); sec = { title: h2[1].trim(), lines: [] }; mode = 'sec'; item = null; return; }
      if (mode === 'sec') { sec.lines.push(l); return; }
      if (!l.trim()) return;
      if (mode === 'head') {
        var km = l.match(/^\s*([a-z_]+)\s*:\s*(.*)$/);
        if (km && DAY_KEYS.indexOf(km[1]) >= 0) { day[km[1]] = km[2].trim(); return; }
        warn(where + ': อ่านบรรทัดนี้ไม่ได้ "' + l.trim() + '"');
        return;
      }
      // item field
      var fm = l.match(/^\s*-\s*([a-z_]+)\s*:\s?(.*)$/);
      if (!fm) { warn(where + ' / ' + item.title + ': อ่านบรรทัดนี้ไม่ได้ — ต่อท้าย notes'); item.notes = item.notes ? item.notes + ' · ' + l.trim() : l.trim(); return; }
      var key = fm[1], val = fm[2].trim();
      if (ITEM_KEYS.indexOf(key) < 0) { item.extra[key] = val; warn(where + ' / ' + item.title + ': ไม่รู้จัก field "' + key + '" (เก็บไว้ให้)'); return; }
      if (key === 'highlight') item.highlight = /^(true|yes|1|ใช่)$/i.test(val);
      else if (key === 'status') { item.status = normStatus(val); if (val && !item.status) warn(where + ' / ' + item.title + ': status "' + val + '" ไม่รู้จัก'); }
      else if (key === 'type') { var tv = val.toLowerCase(); if (TYPES.indexOf(tv) < 0) { warn(where + ' / ' + item.title + ': type "' + val + '" ไม่รู้จัก — ใช้ other'); tv = 'other'; } item.type = tv; }
      else if (key === 'line' || key === 'line_alt') {
        item[key] = val;
        parseLines(val).forEach(function (l) { if (!l.known) warn(where + ' / ' + item.title + ': ไม่รู้จักสาย "' + l.code + '" — ใช้สีกลาง (ใส่ ' + l.code + '#RRGGBB เพื่อกำหนดสี)'); });
      } else item[key] = val;
    });
    flushSec();
    day.extra = extraParts.filter(function (x) { return x; }).join('\n\n');
    if (!day.route) warn(where + ': ไม่มี route');
    return day;
  }

  function parsePack(lines) {
    var s = splitH2(lines), groups = [];
    var all = (trimBlank(s.pre).length ? [{ title: '', lines: s.pre }] : []).concat(s.secs);
    all.forEach(function (sec) {
      var g = { id: uid(), title: sec.title, items: [], note: '' }, note = [];
      sec.lines.forEach(function (l) {
        var m = l.match(/^\s*[-*]\s+\[( |x|X)\]\s+(.*)$/);
        if (m) g.items.push({ id: uid(), text: m[2].trim(), done: m[1] !== ' ' });
        else note.push(l);
      });
      g.note = trimBlank(note).join('\n');
      groups.push(g);
    });
    return groups;
  }

  function parseTodo(lines) {
    var out = [];
    lines.forEach(function (l) {
      var m = l.match(/^\s*[-*]\s+\[( |x|X)\]\s+(.*)$/);
      if (!m) return;
      var body = m[2].trim(), dm = body.match(/^(.*?)\s+·\s+(.*)$/);
      var due = dm ? dm[1].trim() : '', txt = dm ? dm[2].trim() : body;
      if (due === '-') due = '';
      out.push({ id: uid(), due: due, text: txt, done: m[1] !== ' ' });
    });
    return out;
  }

  /* ---------- serialize ---------- */
  function toMarkdown(t) {
    var o = [], m = t.meta || {};
    o.push('---');
    META_KEYS.forEach(function (k) { if (/_en$/.test(k) && !String(m[k] || '').trim()) return; o.push(k + ': ' + oneLine(m[k])); });
    Object.keys(t.metaExtra || {}).forEach(function (k) { o.push(k + ': ' + oneLine(t.metaExtra[k])); });
    o.push('---', '');

    o.push('# ' + SEC.overview, '');
    o.push('## เที่ยวบิน', '', tableMd(FLIGHT_COLS, t.overview.flights), '');
    o.push('## ที่พัก', '', tableMd(STAY_COLS, t.overview.stays), '');
    if ((t.overview.remember || '').trim()) o.push('## จำไว้ตลอดทริป', '', t.overview.remember.trim(), '');
    (t.overview.extra || []).forEach(function (s) { if (s.title) o.push('## ' + oneLine(s.title), ''); if ((s.md || '').trim()) o.push(s.md.trim(), ''); });

    (t.days || []).forEach(function (d, k) {
      o.push('# Day ' + (k + 1) + ' — ' + d.date + (d.theme ? ' · ' + oneLine(d.theme) : ''), '');
      DAY_KEYS.forEach(function (key) { if (d[key]) o.push(key + ': ' + oneLine(d[key])); });
      o.push('');
      (d.items || []).forEach(function (it) {
        o.push('### ' + oneLine(it.time) + ' · ' + oneLine(it.title));
        ITEM_KEYS.forEach(function (key) {
          var v = it[key];
          if (key === 'highlight') { if (v) o.push('- highlight: true'); return; }
          if (key === 'type' && !v) return;
          if (v != null && String(v).trim() !== '') o.push('- ' + key + ': ' + oneLine(v));
        });
        Object.keys(it.extra || {}).forEach(function (key) { o.push('- ' + key + ': ' + oneLine(it.extra[key])); });
        o.push('');
      });
      if ((d.must || []).length) { o.push('## ' + DAYSEC.must); d.must.forEach(function (x) { o.push('- ' + oneLine(x)); }); o.push(''); }
      if ((d.caution || []).length) { o.push('## ' + DAYSEC.caution); d.caution.forEach(function (x) { o.push('- ' + oneLine(x)); }); o.push(''); }
      if ((d.extra || '').trim()) o.push('## ' + DAYSEC.extra, '', d.extra.trim(), '');
    });

    if ((t.pack || []).length) {
      o.push('# ' + SEC.pack, '');
      t.pack.forEach(function (g) {
        if (g.title) o.push('## ' + oneLine(g.title), '');
        if ((g.note || '').trim()) o.push(g.note.trim(), '');
        g.items.forEach(function (x) { o.push('- [' + (x.done ? 'x' : ' ') + '] ' + oneLine(x.text)); });
        o.push('');
      });
    }
    if ((t.todo || []).length) {
      o.push('# ' + SEC.todo, '');
      t.todo.forEach(function (x) { o.push('- [' + (x.done ? 'x' : ' ') + '] ' + (oneLine(x.due) || '-') + ' · ' + oneLine(x.text)); });
      o.push('');
    }
    if ((t.ref || []).length) {
      o.push('# ' + SEC.ref, '');
      t.ref.forEach(function (s) { if (s.title) o.push('## ' + oneLine(s.title), ''); if ((s.md || '').trim()) o.push(s.md.trim(), ''); });
    }
    if ((t.plan || '').trim()) o.push('# ' + SEC.plan, '', t.plan.trim(), '');
    return o.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  }
  /* video: clip links (TikTok / YouTube / ...) separated by | (also accepts " · " or spaces). Only http(s) URLs survive. */
  var VIDEO_HOSTS = [['tiktok', /(^|\.)tiktok\.com$/], ['youtube', /(^|\.)(youtube\.com|youtu\.be)$/], ['instagram', /(^|\.)instagram\.com$/], ['facebook', /(^|\.)(facebook\.com|fb\.watch)$/]];
  function videoLinks(str) {
    return String(str || '').split(/\s*\|\s*|\s+·\s+|\s+/).filter(function (u) { return /^https?:\/\/[^\s<>"'`]+$/i.test(u); }).map(function (u) {
      var host = u.replace(/^https?:\/\//i, '').split(/[\/?#:]/)[0].toLowerCase(), kind = 'link';
      VIDEO_HOSTS.forEach(function (h) { if (kind === 'link' && h[1].test(host)) kind = h[0]; });
      return { url: u, kind: kind };
    });
  }
  function tableMd(cols, rows) {
    var h = '| ' + cols.map(function (c) { return c[0]; }).join(' | ') + ' |';
    var s = '|' + cols.map(function () { return '---'; }).join('|') + '|';
    var b = (rows || []).map(function (r) { return '| ' + cols.map(function (c) { return cell(r[c[1]]); }).join(' | ') + ' |'; });
    return [h, s].concat(b).join('\n');
  }

  var api = {
    parse: parse, toMarkdown: toMarkdown, normStatus: normStatus, isDate: isDate, uid: uid, oneLine: oneLine,
    STATUS: STATUS, TYPES: TYPES, ITEM_KEYS: ITEM_KEYS, META_KEYS: META_KEYS, FLIGHT_COLS: FLIGHT_COLS, STAY_COLS: STAY_COLS,
    emptyTrip: emptyTrip, LINES: LINES, parseLines: parseLines, videoLinks: videoLinks
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.TP = api;
})(this);
