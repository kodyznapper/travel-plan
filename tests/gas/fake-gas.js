// Minimal stand-ins for the Apps Script services gas/Code.gs uses, backed by a plain JSON state object.
// Used by tests/gas.test.js (in-process) and tests/gas/call.js (one call per process, state in a file, for e2e).
// Only what Code.gs needs is implemented. This checks our logic, not Google's behaviour.
const vm = require('vm');
const fs = require('fs');
const path = require('path');

function emptyState(o) {
  return Object.assign({ props: {}, files: {}, folders: {}, cache: {}, seq: 0, clock: Date.parse('2026-11-01T00:00:00Z'), activeUser: '', owner: 'owner@example.com' }, o || {});
}

function services(st) {
  const nextId = p => p + (++st.seq);
  const tick = () => (st.clock += 1000);
  // createFile(name, content, mime) or createFile(blob)
  const blobArgs = (name, content) => (name && name.__blob ? { name: name.name, content: name.content } : { name, content: String(content) });
  function File(id) {
    const f = st.files[id];
    return {
      getId: () => id,
      getName: () => f.name,
      getBlob: () => ({ getDataAsString: () => f.content }),
      getLastUpdated: () => new Date(f.updated),
      setContent: s => { f.content = String(s); f.updated = tick(); return File(id); }
    };
  }
  function Folder(id) {
    return {
      getId: () => id,
      getName: () => st.folders[id].name,
      createFile: (name, content) => { const b = blobArgs(name, content); const fid = nextId('f'); st.files[fid] = { name: b.name, content: b.content, updated: tick(), parent: id }; return File(fid); }
    };
  }
  const DriveApp = {
    getFileById: id => { if (!st.files[id]) throw new Error('No item with the given ID could be found'); return File(id); },
    getFolderById: id => { if (!st.folders[id]) throw new Error('No item with the given ID could be found'); return Folder(id); },
    createFile: (name, content) => { const b = blobArgs(name, content); const fid = nextId('f'); st.files[fid] = { name: b.name, content: b.content, updated: tick(), parent: 'root' }; return File(fid); },
    createFolder: name => { const id = nextId('d'); st.folders[id] = { name }; return Folder(id); }
  };
  const props = {
    getProperty: k => (k in st.props ? st.props[k] : null),
    setProperty: (k, v) => { st.props[k] = String(v); return props; }
  };
  const cache = {
    get: k => { const c = st.cache[k]; return c && c.exp > st.clock ? c.v : null; },
    put: (k, v, ttl) => { st.cache[k] = { v: String(v), exp: st.clock + (ttl || 600) * 1000 }; }
  };
  const html = { setTitle() { return html; }, addMetaTag() { return html; }, setXFrameOptionsMode() { return html; } };
  return {
    DriveApp,
    PropertiesService: { getScriptProperties: () => props },
    LockService: { getScriptLock: () => ({ tryLock: () => true, waitLock: () => { }, releaseLock: () => { } }) },
    CacheService: { getScriptCache: () => cache },
    Session: { getActiveUser: () => ({ getEmail: () => st.activeUser }), getEffectiveUser: () => ({ getEmail: () => st.owner }) },
    Utilities: { formatDate: d => new Date(d).toISOString().replace(/[:.]/g, '-'), newBlob: (content, mime, name) => ({ __blob: true, content: String(content), name }) },
    HtmlService: { createHtmlOutputFromFile: () => html, XFrameOptionsMode: { DEFAULT: 'DEFAULT', ALLOWALL: 'ALLOWALL' } },
    ContentService: { MimeType: { JSON: 'JSON' }, createTextOutput: c => { const o = { __text: true, content: String(c), mime: 'TEXT', setMimeType: m => { o.mime = m; return o; }, getContent: () => o.content }; return o; } },
    Logger: { log: () => { } }
  };
}

// Load Code.gs into a fresh context bound to `st`. Returns the context (its top-level functions are properties).
function load(st, codePath) {
  const code = fs.readFileSync(codePath || path.join(__dirname, '../../dist/gas/Code.gs'), 'utf8');
  const ctx = vm.createContext(Object.assign({}, services(st)));
  vm.runInContext(code, ctx, { filename: 'Code.gs' });
  return ctx;
}

// Public function names (callable from the page): no trailing underscore.
function publicNames(ctx) { return Object.keys(ctx).filter(k => typeof ctx[k] === 'function' && !/_$/.test(k)); }

module.exports = { emptyState, services, load, publicNames };
