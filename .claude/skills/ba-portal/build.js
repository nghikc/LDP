#!/usr/bin/env node
/**
 * ba-portal/build.js
 * Zero-dependency Node.js script to build a self-contained HTML documentation portal
 * from a folder of markdown files.
 *
 * Usage: node build.js <docsDir=docs> <outFile=docs/portal.html>
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ─── CLI ────────────────────────────────────────────────────────────────────
// Portal mode:  node build.js [docsDir=docs] [out=docs/portal.html]
// Single mode:  node build.js --single <file.md> [out=<file>.html]
//
// Mặc định portal CHỈ gom tài liệu do BA toolkit sinh (00..08-*.md ở cấp đầu + 9 file
// chuẩn trong folder mỗi màn). Folder lạ do skill khác tạo (vd docs/superpowers/,
// docs/session-notes/) bị bỏ qua. Thêm cờ --all để gom MỌI .md/.html.

const rawArgv = process.argv.slice(2);
const includeAll = rawArgv.includes('--all');   // tắt lọc, gom mọi file (thoát hiểm)
const argv = rawArgv.filter(a => a !== '--all');
const singleMode = argv[0] === '--single';

let docsDir, outFile, singleInput;

if (singleMode) {
  if (!argv[1]) {
    console.error('Usage: node build.js --single <file.md> [out.html]');
    process.exit(1);
  }
  singleInput = path.resolve(argv[1]);
  if (!fs.existsSync(singleInput)) {
    console.error(`Error: file does not exist: ${singleInput}`);
    process.exit(1);
  }
  outFile = path.resolve(argv[2] || singleInput.replace(/\.md$/i, '.html'));
} else {
  docsDir = path.resolve(argv[0] || 'docs');
  outFile = path.resolve(argv[1] || 'docs/portal.html');
  if (!fs.existsSync(docsDir)) {
    console.error(`Error: docsDir does not exist: ${docsDir}`);
    process.exit(1);
  }
}

// ─── FILE DISCOVERY ─────────────────────────────────────────────────────────

// Bộ nhận diện tài liệu DO BA TOOLKIT sinh — để bỏ qua file/folder lạ (vd
// docs/superpowers/, docs/session-notes/ do skill khác tạo). Tắt bằng cờ --all.
const TOPLEVEL_DOC_RE = /^\d{2}-[\w-]+\.md$/i;        // 00-brainstorm.md … 08-dev-notes.md
const SCREEN_FILES = new Set([                         // 9 file chuẩn trong folder mỗi màn
  'ascii-screen.md', 'brainstorm.md', 'srs.md', 'usecase.md', 'userstory.md',
  'design-spec.md', 'html-design.html', 'test.md', 'plan.md',
]);
function isToolkitDoc(rel, name) {
  const topLevel = !rel.includes(path.sep);
  return topLevel ? TOPLEVEL_DOC_RE.test(name) : SCREEN_FILES.has(name.toLowerCase());
}

let skippedForeign = 0;

function walk(dir, base) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];
  for (const e of entries) {
    const abs = path.join(dir, e.name);
    const rel = path.relative(base, abs);
    // Skip the output file and any existing portal.html
    if (abs === outFile) continue;
    if (e.name === 'portal.html') continue;
    if (e.isDirectory()) {
      results.push(...walk(abs, base));
    } else if (e.isFile()) {
      const ext = path.extname(e.name).toLowerCase();
      if (ext !== '.md' && ext !== '.html') continue;
      // Lọc: chỉ giữ tài liệu của BA toolkit (trừ khi --all)
      if (!includeAll && !isToolkitDoc(rel, e.name)) { skippedForeign++; continue; }
      results.push({ abs, rel, ext });
    }
  }
  return results;
}

let orderedFiles = [];
if (!singleMode) {
  const allFiles = walk(docsDir, docsDir);

  // Separate top-level from nested, sort each group
  const topLevel = allFiles
    .filter(f => !f.rel.includes(path.sep))
    .sort((a, b) => a.rel.localeCompare(b.rel));

  const nested = allFiles.filter(f => f.rel.includes(path.sep));

  // Group nested by their first-level folder
  const groups = {};
  for (const f of nested) {
    const parts = f.rel.split(path.sep);
    const group = parts.slice(0, -1).join('/');
    if (!groups[group]) groups[group] = [];
    groups[group].push(f);
  }
  // Sort within each group
  for (const g of Object.keys(groups)) {
    groups[g].sort((a, b) => a.rel.localeCompare(b.rel));
  }
  const sortedGroups = Object.keys(groups).sort();

  // Final ordered list
  orderedFiles = [
    ...topLevel,
    ...sortedGroups.flatMap(g => groups[g]),
  ];
}

// ─── IMAGE EMBED & OFFLINE CHART ─────────────────────────────────────────────

// Nhúng ảnh local thành data URI base64 → HTML TỰ CHỨA (gửi lẻ 1 file vẫn thấy ảnh).
// Bỏ qua http(s)/data; ảnh không tìm thấy thì giữ nguyên src. baseDir = thư mục file .md nguồn.
function embedImages(html, baseDir) {
  return html.replace(/(\bsrc=")([^"]+)(")/g, (m, a, url, c) => {
    if (/^(https?:|data:)/i.test(url)) return m;
    const p = path.isAbsolute(url) ? url : path.resolve(baseDir, url);
    if (!fs.existsSync(p)) return m;
    const ext = path.extname(p).slice(1).toLowerCase();
    const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'jpg' ? 'image/jpeg' : 'image/' + (ext || 'png');
    return a + 'data:' + mime + ';base64,' + fs.readFileSync(p).toString('base64') + c;
  });
}

// Chart/sơ đồ offline: inline thư viện Mermaid vendored — CHỈ khi HTML thực sự có sơ đồ
// (tránh phình file). Thiếu vendor → fallback CDN (cần internet).
let _mermaidJs;
function mermaidInline(html) {
  if (!/class="mermaid"/.test(html)) return '';
  if (_mermaidJs === undefined) {
    try { _mermaidJs = fs.readFileSync(path.join(__dirname, 'vendor', 'mermaid.min.js'), 'utf8'); }
    catch (e) { _mermaidJs = ''; }
  }
  if (!_mermaidJs) {
    return `<script type="module">try{const m=await import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs');m.default.initialize({startOnLoad:false,theme:'neutral',securityLevel:'loose'});await m.default.run({querySelector:'pre.mermaid'});}catch(e){}</script>`;
  }
  return `<script>${_mermaidJs}</script>\n` +
    `<script>try{mermaid.initialize({startOnLoad:false,theme:'neutral',securityLevel:'loose'});mermaid.run({querySelector:'pre.mermaid'});}catch(e){console.error('mermaid',e);}</script>`;
}

// ─── MARKDOWN RENDERER ──────────────────────────────────────────────────────

/**
 * Escape HTML special characters (for use in text nodes and attribute values).
 * Preserves existing &amp; entities to avoid double-escaping in normal text,
 * but in code blocks we do a full raw escape.
 */
function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escHtmlCode(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Generate an id-safe slug from a heading string.
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')       // strip any inline HTML
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s]+/g, '-');
}

/**
 * Process inline markdown: bold, italic, inline code, links.
 */
function inlineToHtml(text) {
  // inline code first (prevent other rules from touching content inside)
  text = text.replace(/`([^`]+)`/g, (_, c) => `<code>${escHtmlCode(c)}</code>`);
  // bold
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');
  // italic
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/_(.+?)_/g, '<em>$1</em>');
  // images (đặt TRƯỚC links để rule link không nuốt cú pháp ảnh ![]())
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');
  // links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return text;
}

/**
 * Convert a GFM pipe table (array of raw lines) to HTML.
 */
function tableToHtml(lines) {
  if (lines.length < 2) return lines.map(l => escHtml(l)).join('\n');

  const parseRow = (line) => {
    // strip leading/trailing pipes and whitespace
    let s = line.trim();
    if (s.startsWith('|')) s = s.slice(1);
    if (s.endsWith('|')) s = s.slice(0, -1);
    return s.split('|').map(c => c.trim());
  };

  // Row 0 = header, Row 1 = separator, Rows 2+ = body
  const headerCells = parseRow(lines[0]);
  // lines[1] is separator — skip
  const bodyRows = lines.slice(2);

  let html = '<table>\n<thead>\n<tr>';
  for (const cell of headerCells) {
    html += `<th>${inlineToHtml(escHtml(cell))}</th>`;
  }
  html += '</tr>\n</thead>\n';

  if (bodyRows.length > 0) {
    html += '<tbody>\n';
    for (const row of bodyRows) {
      if (!row.trim()) continue;
      const cells = parseRow(row);
      html += '<tr>';
      for (const cell of cells) {
        html += `<td>${inlineToHtml(escHtml(cell))}</td>`;
      }
      html += '</tr>\n';
    }
    html += '</tbody>\n';
  }
  html += '</table>';
  return html;
}

/**
 * Convert a list block (array of raw lines from the markdown) to HTML.
 * Supports ordered/unordered + checkboxes + 1 level of nesting.
 */
function listToHtml(lines) {
  const UL_RE = /^(\s*)([-*+])\s+(.*)/;
  const OL_RE = /^(\s*)(\d+)\.\s+(.*)/;
  const CB_RE = /^\[([ xX])\]\s*(.*)/;

  // Determine list type from first item
  const firstMatch = UL_RE.exec(lines[0]) || OL_RE.exec(lines[0]);
  if (!firstMatch) return lines.map(l => escHtml(l)).join('\n');

  const isOrdered = /^\s*\d+\./.test(lines[0]);

  // Build a simple tree: items at indent 0 are top-level, >0 are nested
  const items = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const ulm = UL_RE.exec(line);
    const olm = OL_RE.exec(line);
    const m = ulm || olm;
    if (!m) continue;
    const indent = m[1].length;
    const text = m[3];
    // Check for checkbox
    const cbm = CB_RE.exec(text);
    let content, checked = null;
    if (cbm) {
      checked = cbm[1].toLowerCase() === 'x';
      content = cbm[2];
    } else {
      content = text;
    }
    items.push({ indent, content, checked, ordered: /^\s*\d+\./.test(line) });
  }

  const renderItem = (item) => {
    let text = inlineToHtml(escHtml(item.content));
    if (item.checked !== null) {
      const icon = item.checked ? '&#9745;' : '&#9744;';
      text = `<span class="checkbox">${icon}</span> ${text}`;
    }
    return text;
  };

  // Two-pass: group into top-level + sub-lists
  const tag = isOrdered ? 'ol' : 'ul';
  let html = `<${tag}>\n`;
  let i = 0;
  while (i < items.length) {
    const item = items[i];
    if (item.indent > 0) {
      // Orphan nested item — attach to last top-level
      i++;
      continue;
    }
    html += `<li>${renderItem(item)}`;
    // Collect children
    const children = [];
    let j = i + 1;
    while (j < items.length && items[j].indent > 0) {
      children.push(items[j]);
      j++;
    }
    if (children.length > 0) {
      const childTag = children[0].ordered ? 'ol' : 'ul';
      html += `\n<${childTag}>\n`;
      for (const child of children) {
        html += `<li>${renderItem(child)}</li>\n`;
      }
      html += `</${childTag}>\n`;
    }
    html += '</li>\n';
    i = j;
  }
  html += `</${tag}>`;
  return html;
}

/**
 * Main markdown-to-HTML converter.
 * Uses a line-by-line state machine.
 */
function markdownToHtml(md) {
  const lines = md.split('\n');
  const output = [];

  // State
  let inCodeFence = false;
  let codeLang = '';
  let codeLines = [];

  let inTable = false;
  let tableLines = [];

  let inList = false;
  let listLines = [];

  let inBlockquote = false;
  let bqLines = [];

  let inParagraph = false;
  let paraLines = [];

  const flushParagraph = () => {
    if (!inParagraph) return;
    inParagraph = false;
    if (paraLines.length) {
      output.push(`<p>${inlineToHtml(escHtml(paraLines.join(' ')))}</p>`);
    }
    paraLines = [];
  };

  const flushList = () => {
    if (!inList) return;
    inList = false;
    output.push(listToHtml(listLines));
    listLines = [];
  };

  const flushTable = () => {
    if (!inTable) return;
    inTable = false;
    output.push(tableToHtml(tableLines));
    tableLines = [];
  };

  const flushBlockquote = () => {
    if (!inBlockquote) return;
    inBlockquote = false;
    const inner = bqLines.map(l => l.replace(/^>\s?/, '')).join('\n');
    output.push(`<blockquote>${markdownToHtml(inner)}</blockquote>`);
    bqLines = [];
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
    flushTable();
    flushBlockquote();
  };

  const isTableSeparator = (line) => /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/.test(line.trim());
  const isTableRow = (line) => /^\|/.test(line.trim()) || (line.includes('|') && line.trim().length > 0);
  const isListItem = (line) => /^(\s{0,3})([-*+]|\d+\.)\s/.test(line);

  for (let idx = 0; idx < lines.length; idx++) {
    const raw = lines[idx];
    const line = raw; // keep original for code fence content

    // ── Code fence ────────────────────────────────────────────────────────
    if (!inCodeFence && /^```/.test(line.trimStart())) {
      flushAll();
      inCodeFence = true;
      codeLang = line.trimStart().replace(/^```/, '').trim();
      codeLines = [];
      continue;
    }
    if (inCodeFence) {
      if (/^```/.test(line.trimStart())) {
        // Close fence
        inCodeFence = false;
        const content = codeLines.join('\n');
        if (codeLang.toLowerCase() === 'mermaid') {
          // Mermaid renders client-side; keep raw source as fallback if CDN unavailable.
          output.push(`<pre class="mermaid">${escHtmlCode(content)}</pre>`);
        } else {
          const langAttr = codeLang ? ` class="language-${escHtmlCode(codeLang)}"` : '';
          output.push(`<pre><code${langAttr}>${escHtmlCode(content)}</code></pre>`);
        }
        codeLines = [];
        codeLang = '';
      } else {
        codeLines.push(raw);
      }
      continue;
    }

    const trimmed = line.trim();

    // ── Blank line ─────────────────────────────────────────────────────────
    if (trimmed === '') {
      flushAll();
      continue;
    }

    // ── Headings ──────────────────────────────────────────────────────────
    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    if (headingMatch) {
      flushAll();
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const id = level <= 3 ? ` id="${slugify(text)}"` : '';
      output.push(`<h${level}${id}>${inlineToHtml(escHtml(text))}</h${level}>`);
      continue;
    }

    // ── Horizontal rule ───────────────────────────────────────────────────
    if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed) || /^___+$/.test(trimmed)) {
      // But only if not a table separator line (table sep has pipes)
      if (!trimmed.includes('|')) {
        flushAll();
        output.push('<hr>');
        continue;
      }
    }

    // ── Table ─────────────────────────────────────────────────────────────
    // A table is detected when we see a row line followed by a separator line,
    // or when we're already accumulating table lines.
    if (!inTable && isTableRow(trimmed) && !isListItem(line)) {
      // Peek ahead for separator
      const nextLine = lines[idx + 1] ? lines[idx + 1].trim() : '';
      if (isTableSeparator(nextLine)) {
        flushAll();
        inTable = true;
        tableLines = [line];
        continue;
      }
    }
    if (inTable) {
      if (isTableRow(trimmed) || isTableSeparator(trimmed)) {
        tableLines.push(line);
        continue;
      } else {
        flushTable();
        // Fall through to process current line
      }
    }

    // ── Blockquote ────────────────────────────────────────────────────────
    if (/^>\s?/.test(trimmed)) {
      flushList();
      flushParagraph();
      inBlockquote = true;
      bqLines.push(line);
      continue;
    }
    if (inBlockquote) {
      flushBlockquote();
    }

    // ── List ──────────────────────────────────────────────────────────────
    if (isListItem(line) || (inList && /^\s{2,}/.test(line) && !trimmed.startsWith('#'))) {
      flushParagraph();
      flushTable();
      inList = true;
      listLines.push(line);
      continue;
    }
    if (inList && trimmed) {
      // Continuation line for last list item (non-indented text that follows a list item
      // but isn't a new list item — treat as paragraph continuation, flush list first)
      flushList();
    }

    // ── Paragraph ────────────────────────────────────────────────────────
    inParagraph = true;
    paraLines.push(trimmed);
  }

  // Flush anything remaining
  if (inCodeFence) {
    // Unclosed fence — output as pre anyway
    output.push(`<pre><code>${escHtmlCode(codeLines.join('\n'))}</code></pre>`);
  }
  flushAll();

  return output.join('\n');
}

// ─── FILE PROCESSING ────────────────────────────────────────────────────────

const docs = [];
for (const f of orderedFiles) {
  const id = 'doc-' + f.rel.replace(/[^a-zA-Z0-9]/g, '-');
  if (f.ext === '.md') {
    const raw = fs.readFileSync(f.abs, 'utf8');
    const html = embedImages(markdownToHtml(raw), path.dirname(f.abs));
    docs.push({ ...f, id, html, type: 'md' });
  } else {
    // .html file — just link it separately (not inlined)
    docs.push({ ...f, id, html: null, type: 'html' });
  }
}

// ─── SIDEBAR NAV BUILDER ────────────────────────────────────────────────────

function buildNav(docs) {
  // Top-level items
  const topItems = docs.filter(f => !f.rel.includes(path.sep));
  // Grouped items
  const groupMap = {};
  for (const f of docs.filter(f => f.rel.includes(path.sep))) {
    const parts = f.rel.split(path.sep);
    const group = parts.slice(0, -1).join('/');
    if (!groupMap[group]) groupMap[group] = [];
    groupMap[group].push(f);
  }

  let nav = '<ul class="nav-top">\n';
  for (const f of topItems) {
    if (f.type === 'html') {
      nav += `<li class="nav-item nav-html"><a href="${f.rel}" target="_blank">${escHtml(f.rel)}</a></li>\n`;
    } else {
      const name = f.rel.replace(/\.md$/i, '');
      nav += `<li class="nav-item" data-target="${f.id}"><a href="#${f.id}">${escHtml(name)}</a></li>\n`;
    }
  }
  nav += '</ul>\n';

  for (const group of Object.keys(groupMap).sort()) {
    nav += `<div class="nav-group">\n<div class="nav-group-title">${escHtml(group)}</div>\n<ul>\n`;
    for (const f of groupMap[group]) {
      if (f.type === 'html') {
        nav += `<li class="nav-item nav-html"><a href="${f.rel}" target="_blank">${escHtml(path.basename(f.rel))}</a></li>\n`;
      } else {
        const name = path.basename(f.rel).replace(/\.md$/i, '');
        nav += `<li class="nav-item" data-target="${f.id}"><a href="#${f.id}">${escHtml(name)}</a></li>\n`;
      }
    }
    nav += '</ul>\n</div>\n';
  }

  return nav;
}

// ─── INLINE CSS ─────────────────────────────────────────────────────────────

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; height: 100%; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.65;
  color: #1a1a2e;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
/* ── Header ── */
#site-header {
  background: #16213e;
  color: #e0e0e0;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
#site-header h1 { font-size: 1.1rem; font-weight: 600; color: #a8d8f0; }
#site-header .timestamp { font-size: 0.75rem; color: #888; }

/* ── Hamburger toggle (ẩn trên desktop, chỉ hiện trên mobile) ── */
#nav-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 38px;
  height: 38px;
  padding: 8px;
  margin-right: 4px;
  background: transparent;
  border: 1px solid #2a3a5e;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
}
#nav-toggle span {
  display: block;
  height: 2px;
  width: 100%;
  background: #a8d8f0;
  border-radius: 2px;
  transition: transform 0.2s, opacity 0.2s;
}
body.nav-open #nav-toggle span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
body.nav-open #nav-toggle span:nth-child(2) { opacity: 0; }
body.nav-open #nav-toggle span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

/* ── Lớp phủ nền khi mở menu trên mobile ── */
#sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 90;
}

/* ── Layout ── */
#layout {
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

/* ── Sidebar ── */
#sidebar {
  width: 260px;
  min-width: 220px;
  background: #1a1a2e;
  color: #cdd;
  overflow-y: auto;
  flex-shrink: 0;
  min-height: 0;
  padding: 12px 0;
  border-right: 1px solid #2a2a4e;
}
#sidebar::-webkit-scrollbar { width: 5px; }
#sidebar::-webkit-scrollbar-track { background: #1a1a2e; }
#sidebar::-webkit-scrollbar-thumb { background: #3a3a6e; border-radius: 3px; }

.nav-top { list-style: none; padding: 0 0 8px; }
.nav-group { border-top: 1px solid #2a2a4e; padding: 8px 0 4px; }
.nav-group-title {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #7a90b8;
  padding: 6px 16px 4px;
}
.nav-group ul { list-style: none; }
.nav-item a {
  display: block;
  padding: 5px 16px 5px 20px;
  color: #b0c4d8;
  text-decoration: none;
  font-size: 0.82rem;
  border-left: 3px solid transparent;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.nav-item a:hover { background: #252550; color: #e0f0ff; }
.nav-item.active a {
  background: #1e3a5f;
  color: #a8d8f0;
  border-left-color: #4a90d9;
  font-weight: 600;
}
.nav-html a { color: #88aacc; font-style: italic; }

/* ── Main content ── */
#content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding: 0;
  background: #f8f9fa;
}
#content::-webkit-scrollbar { width: 8px; }
#content::-webkit-scrollbar-track { background: #f0f0f0; }
#content::-webkit-scrollbar-thumb { background: #c0c0c0; border-radius: 4px; }

.doc-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 48px 60px;
  border-bottom: 2px solid #e0e0e0;
}
.doc-section:last-child { border-bottom: none; }
.doc-section-title {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #999;
  margin-bottom: 20px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e8e8e8;
}

/* ── Typography ── */
h1,h2,h3,h4,h5,h6 { line-height: 1.3; margin-top: 1.6em; margin-bottom: 0.5em; color: #16213e; }
h1 { font-size: 1.9rem; border-bottom: 2px solid #d0d8e8; padding-bottom: 0.3em; }
h2 { font-size: 1.45rem; border-bottom: 1px solid #e8edf5; padding-bottom: 0.25em; }
h3 { font-size: 1.15rem; }
h4 { font-size: 1rem; }
h5, h6 { font-size: 0.9rem; }
.doc-section > *:first-child { margin-top: 0; }
p { margin: 0.75em 0; }
a { color: #2a6496; }
a:hover { text-decoration: underline; }
strong { font-weight: 700; }
em { font-style: italic; }
hr { border: none; border-top: 1px solid #dde3ec; margin: 1.5em 0; }
blockquote {
  border-left: 4px solid #4a90d9;
  background: #f0f6ff;
  margin: 1em 0;
  padding: 10px 16px;
  color: #445;
  border-radius: 0 4px 4px 0;
}

/* ── Code ── */
code {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 0.85em;
  background: #eef1f6;
  padding: 2px 5px;
  border-radius: 3px;
  color: #c7254e;
}
pre {
  background: #1e2030;
  color: #cdd6f4;
  border-radius: 6px;
  padding: 16px 20px;
  overflow-x: auto;
  margin: 1em 0;
  line-height: 1.5;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 0.83rem;
  white-space: pre;
  tab-size: 2;
}
pre code {
  background: none;
  padding: 0;
  color: inherit;
  font-size: inherit;
  border-radius: 0;
}
/* ── Mermaid diagrams (render client-side; fallback = source) ── */
pre.mermaid {
  background: #ffffff;
  color: #334;
  border: 1px solid #e4e4ec;
  text-align: center;
  padding: 14px;
}
pre.mermaid svg { max-width: 100%; height: auto; }

/* ── Tables ── */
table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
  font-size: 0.9rem;
}
th, td {
  border: 1px solid #d0d8e4;
  padding: 8px 14px;
  text-align: left;
  vertical-align: top;
}
th {
  background: #e8edf5;
  font-weight: 700;
  color: #16213e;
}
tr:nth-child(even) td { background: #f5f7fa; }

/* ── Lists ── */
ul, ol { padding-left: 1.6em; margin: 0.6em 0; }
li { margin: 0.25em 0; }
li > ul, li > ol { margin: 0.2em 0; }
.checkbox { font-size: 1.1em; }

/* ── Responsive ── */
@media (max-width: 768px) {
  #nav-toggle { display: flex; }
  #site-header h1 { font-size: 0.95rem; }
  #site-header .timestamp { display: none; }

  /* Sidebar thành drawer trượt từ trái, mặc định ẩn ngoài màn hình */
  #sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 78%;
    max-width: 300px;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    box-shadow: 2px 0 12px rgba(0,0,0,0.4);
    padding-top: 16px;
  }
  body.nav-open #sidebar { transform: translateX(0); }
  body.nav-open #sidebar-overlay { display: block; }

  .doc-section { padding: 24px 20px 40px; }
}
`;

// ─── INLINE JS ──────────────────────────────────────────────────────────────

const JS = `
(function() {
  var content = document.getElementById('content');
  var navItems = document.querySelectorAll('.nav-item[data-target]');
  var sections = document.querySelectorAll('.doc-section[id]');

  // ── Toggle menu trên mobile ──
  var toggle = document.getElementById('nav-toggle');
  var overlay = document.getElementById('sidebar-overlay');
  function openNav() {
    document.body.classList.add('nav-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    if (overlay) overlay.hidden = false;
  }
  function closeNav() {
    document.body.classList.remove('nav-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (overlay) overlay.hidden = true;
  }
  if (toggle) {
    toggle.addEventListener('click', function() {
      if (document.body.classList.contains('nav-open')) closeNav();
      else openNav();
    });
  }
  if (overlay) overlay.addEventListener('click', closeNav);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeNav();
  });

  // Click: scroll to section
  navItems.forEach(function(item) {
    item.addEventListener('click', function(e) {
      var target = document.getElementById(item.dataset.target);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActive(item.dataset.target);
        closeNav(); // đóng drawer sau khi chọn mục (mobile)
      }
    });
  });
  // Đóng menu khi mở một file .html (link target=_blank) trên mobile
  document.querySelectorAll('.nav-html a').forEach(function(a) {
    a.addEventListener('click', closeNav);
  });

  // Scrollspy
  function setActive(id) {
    navItems.forEach(function(n) {
      n.classList.toggle('active', n.dataset.target === id);
    });
  }

  var scrollTimer = null;
  content.addEventListener('scroll', function() {
    if (scrollTimer) return;
    scrollTimer = setTimeout(function() {
      scrollTimer = null;
      var scrollTop = content.scrollTop;
      var best = null;
      sections.forEach(function(sec) {
        if (sec.offsetTop - 60 <= scrollTop) {
          best = sec.id;
        }
      });
      if (best) setActive(best);
    }, 50);
  });

  // Activate first item on load
  if (navItems.length) {
    setActive(navItems[0].dataset.target);
  }
})();
`;

// ─── SINGLE-FILE MODE ────────────────────────────────────────────────────────
// Render ONE markdown file to a clean standalone HTML (no portal sidebar/chrome).

if (singleMode) {
  const SINGLE_CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.65; color: #1a1a2e; background: #f8f9fa; padding: 40px 16px; }
.article { max-width: 860px; margin: 0 auto; background: #fff; border: 1px solid #e4e8ef; border-radius: 8px; padding: 40px 48px 56px; box-shadow: 0 2px 16px rgba(0,0,0,0.05); }
h1,h2,h3,h4,h5,h6 { line-height: 1.3; margin-top: 1.6em; margin-bottom: 0.5em; color: #16213e; }
h1 { font-size: 1.9rem; border-bottom: 2px solid #d0d8e8; padding-bottom: 0.3em; }
h2 { font-size: 1.45rem; border-bottom: 1px solid #e8edf5; padding-bottom: 0.25em; }
h3 { font-size: 1.15rem; } h4 { font-size: 1rem; } h5, h6 { font-size: 0.9rem; }
.article > *:first-child { margin-top: 0; }
p { margin: 0.75em 0; } a { color: #2a6496; } a:hover { text-decoration: underline; }
strong { font-weight: 700; } em { font-style: italic; }
hr { border: none; border-top: 1px solid #dde3ec; margin: 1.5em 0; }
blockquote { border-left: 4px solid #4a90d9; background: #f0f6ff; margin: 1em 0; padding: 10px 16px; color: #445; border-radius: 0 4px 4px 0; }
code { font-family: "SFMono-Regular", Consolas, Menlo, monospace; font-size: 0.85em; background: #eef1f6; padding: 2px 5px; border-radius: 3px; color: #c7254e; }
pre { background: #1e2030; color: #cdd6f4; border-radius: 6px; padding: 16px 20px; overflow-x: auto; margin: 1em 0; line-height: 1.5; font-family: "SFMono-Regular", Consolas, Menlo, monospace; font-size: 0.83rem; white-space: pre; tab-size: 2; }
pre code { background: none; padding: 0; color: inherit; font-size: inherit; border-radius: 0; }
pre.mermaid { background: #fff; color: #334; border: 1px solid #e4e4ec; text-align: center; padding: 14px; }
pre.mermaid svg { max-width: 100%; height: auto; }
table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: 0.9rem; }
th, td { border: 1px solid #d0d8e4; padding: 8px 14px; text-align: left; vertical-align: top; }
th { background: #e8edf5; font-weight: 700; color: #16213e; }
tr:nth-child(even) td { background: #f5f7fa; }
ul, ol { padding-left: 1.6em; margin: 0.6em 0; } li { margin: 0.25em 0; }
.checkbox { font-size: 1.1em; }
@media (max-width: 700px) { .article { padding: 24px 18px 36px; } }
`;

  const raw = fs.readFileSync(singleInput, 'utf8');
  const bodyHtml = embedImages(markdownToHtml(raw), path.dirname(singleInput));
  const title = path.basename(singleInput).replace(/\.md$/i, '');
  const MERMAID_SCRIPT = mermaidInline(bodyHtml);

  const single = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escHtml(title)}</title>
<style>
${SINGLE_CSS}
</style>
</head>
<body>
<article class="article">
${bodyHtml}
</article>
${MERMAID_SCRIPT}
</body>
</html>
`;

  const outDir = path.dirname(outFile);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, single, 'utf8');
  console.log(`Single page written to: ${outFile}`);
  console.log(`  Source: ${singleInput}`);
  console.log(`  Output size: ${(fs.statSync(outFile).size / 1024).toFixed(1)} KB`);
  process.exit(0);
}

// ─── HTML ASSEMBLY ───────────────────────────────────────────────────────────

const timestamp = new Date().toISOString();
const projectTitle = path.basename(docsDir);

const navHtml = buildNav(docs);

let sectionsHtml = '';
for (const doc of docs) {
  if (doc.type === 'html') continue; // skip .html from inline content
  sectionsHtml += `<section class="doc-section" id="${doc.id}">\n`;
  sectionsHtml += `<div class="doc-section-title">${escHtml(doc.rel)}</div>\n`;
  sectionsHtml += doc.html + '\n';
  sectionsHtml += `</section>\n`;
}

const portal = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escHtml(projectTitle)} — Documentation Portal</title>
<style>
${CSS}
</style>
</head>
<body>
<header id="site-header">
  <button id="nav-toggle" aria-label="Hiện/ẩn menu" aria-expanded="false" aria-controls="sidebar">
    <span></span><span></span><span></span>
  </button>
  <h1>${escHtml(projectTitle)} — Documentation Portal</h1>
  <span class="timestamp">Generated: ${timestamp}</span>
</header>
<div id="layout">
  <div id="sidebar-overlay" hidden></div>
  <nav id="sidebar">
${navHtml}
  </nav>
  <main id="content">
${sectionsHtml}
  </main>
</div>
<script>
${JS}
</script>
${mermaidInline(sectionsHtml)}
</body>
</html>
`;

// ─── WRITE OUTPUT ────────────────────────────────────────────────────────────

const outDir = path.dirname(outFile);
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(outFile, portal, 'utf8');
console.log(`Portal written to: ${outFile}`);
console.log(`  Files included: ${docs.filter(d => d.type === 'md').length} markdown, ${docs.filter(d => d.type === 'html').length} html links`);
if (skippedForeign > 0) {
  console.log(`  Bo qua ${skippedForeign} file ngoai bo BA toolkit (folder la nhu superpowers/, session-notes/). Dung --all de gom het.`);
}
console.log(`  Output size: ${(fs.statSync(outFile).size / 1024).toFixed(1)} KB`);
