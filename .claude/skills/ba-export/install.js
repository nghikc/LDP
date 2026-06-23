#!/usr/bin/env node
/**
 * ba-export/install.js
 * Zero-dependency installer: copy bộ BA toolkit (skills ba-* + file hướng dẫn)
 * từ repo này sang một dự án khác.
 *
 * Nguồn = repo chứa script này (tự định vị qua __dirname).
 *
 * Cách dùng (đứng trong dự án đích):
 *   node /abs/path/BA_toolkit_v3.0/.claude/skills/ba-export/install.js
 *
 * Tham số (tùy chọn):
 *   --to <đích>     thư mục dự án đích (mặc định = thư mục hiện tại)
 *   --from <nguồn>  repo BA toolkit nguồn (mặc định = repo chứa script này)
 *   --dry           chỉ in danh sách sẽ copy, không ghi gì
 *   --prune         xoá skill thừa ở đích (prefix ba- hoặc dev-) không còn ở nguồn
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ─── Resolve nguồn / đích ─────────────────────────────────────────────────────
// Có >1 skill ba-* (ngoài chính ba-export) thì coi như repo BA toolkit thật.
const looksLikeToolkit = (root) => {
  const dir = path.join(root, '.claude', 'skills');
  if (!fs.existsSync(dir)) return false;
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => e.isDirectory() && e.name.startsWith('ba-') && e.name !== 'ba-export')
    .length > 0;
};

// __dirname = <repo>/.claude/skills/ba-export  →  repo root = lùi 3 cấp.
// Khi ba-export nằm ở global (~/.claude/skills/ba-export) thì lùi 3 cấp ra HOME,
// không phải repo toolkit → fallback đọc 'ba-source.txt' (ghi lúc cài global).
const DIRNAME_SRC = path.resolve(__dirname, '..', '..', '..');
const SOURCE_FILE = path.join(__dirname, 'ba-source.txt');
let recordedSrc = null;
if (fs.existsSync(SOURCE_FILE)) {
  recordedSrc = path.resolve(fs.readFileSync(SOURCE_FILE, 'utf8').trim());
}
// Ưu tiên: repo cạnh script (chạy trong repo) → đường dẫn đã ghi (chạy global).
const DEFAULT_SRC = looksLikeToolkit(DIRNAME_SRC)
  ? DIRNAME_SRC
  : (recordedSrc || DIRNAME_SRC);

const argv = process.argv.slice(2);
const optVal = (name) => {
  const i = argv.indexOf(name);
  return i !== -1 ? argv[i + 1] : null;
};
const dryRun = argv.includes('--dry');
const prune = argv.includes('--prune');
const srcRoot = path.resolve(optVal('--from') || DEFAULT_SRC);
const destRoot = path.resolve(optVal('--to') || process.cwd());

// ─── Validate ─────────────────────────────────────────────────────────────────
const skillsSrc = path.join(srcRoot, '.claude', 'skills');
if (!fs.existsSync(skillsSrc) || !looksLikeToolkit(srcRoot)) {
  console.error(`Error: nguồn không phải repo BA toolkit (thiếu skill ba-*): ${srcRoot}`);
  if (recordedSrc) console.error(`Đã thử 'ba-source.txt' = ${recordedSrc} nhưng không hợp lệ.`);
  console.error(`Dùng --from <đường-dẫn-repo-BA_toolkit> để chỉ định nguồn.`);
  process.exit(1);
}
if (srcRoot === destRoot) {
  console.error(`Error: đích trùng nguồn (${destRoot}) — không tự cài đè chính mình.`);
  console.error(`Hãy chạy từ trong dự án đích, hoặc dùng --to <path khác>.`);
  process.exit(1);
}

// ─── Banner cho file hướng dẫn ────────────────────────────────────────────────
const IMPORT_BANNER =
  '> 📦 File này được import từ **BA Toolkit**. Thư mục `example/` KHÔNG được copy — ' +
  'các liên kết `example/docs/...` chỉ có ở repo BA_toolkit gốc.\n\n';

// ─── Copy ─────────────────────────────────────────────────────────────────────
const tag = dryRun ? '[dry] ' : '';
console.log(`${tag}Nguồn: ${srcRoot}`);
console.log(`${tag}Đích:  ${destRoot}\n`);

// 1) Skills ba-* + dev-* (framework dev clone từ superpowers, đi kèm toolkit)
const skillNames = fs.readdirSync(skillsSrc, { withFileTypes: true })
  .filter(e => e.isDirectory() && (e.name.startsWith('ba-') || e.name.startsWith('dev-')))
  .map(e => e.name)
  .sort();

const skillsDest = path.join(destRoot, '.claude', 'skills');
if (!dryRun) fs.mkdirSync(skillsDest, { recursive: true });

for (const name of skillNames) {
  if (!dryRun) {
    fs.cpSync(path.join(skillsSrc, name), path.join(skillsDest, name), {
      recursive: true,
      force: true,
    });
  }
  console.log(`  ${tag}skill  ${name}`);
}

// 1b) Dọn skill ba-*/dev-* thừa ở đích (đã đổi tên / gỡ khỏi nguồn)
const srcSet = new Set(skillNames);
let staleNames = [];
if (fs.existsSync(skillsDest)) {
  staleNames = fs.readdirSync(skillsDest, { withFileTypes: true })
    .filter(e => e.isDirectory() && (e.name.startsWith('ba-') || e.name.startsWith('dev-')))
    .map(e => e.name)
    .filter(name => !srcSet.has(name))
    .sort();
}
if (staleNames.length) {
  console.log('');
  for (const name of staleNames) {
    if (prune && !dryRun) {
      fs.rmSync(path.join(skillsDest, name), { recursive: true, force: true });
      console.log(`  ${tag}prune  ${name} (đã xoá — không còn ở nguồn)`);
    } else {
      console.log(`  ${tag}thừa   ${name} (có ở đích, không còn ở nguồn)`);
    }
  }
  if (!prune) {
    console.log(`  → Thêm --prune để xoá ${staleNames.length} skill thừa ở trên.`);
  }
}

// 2) File hướng dẫn (prepend banner)
const guides = [
  { src: 'README.md', dest: 'BA-TOOLKIT-README.md' },
  { src: path.join('example', 'GUIDELINE.md'), dest: 'BA-TOOLKIT-GUIDELINE.md' },
];
let guideCount = 0;
for (const g of guides) {
  const s = path.join(srcRoot, g.src);
  if (!fs.existsSync(s)) {
    console.log(`  ${tag}(bỏ qua ${g.src} — không thấy)`);
    continue;
  }
  if (!dryRun) {
    fs.writeFileSync(path.join(destRoot, g.dest), IMPORT_BANNER + fs.readFileSync(s, 'utf8'), 'utf8');
  }
  console.log(`  ${tag}guide  ${g.dest}`);
  guideCount++;
}

// ─── Summary ──────────────────────────────────────────────────────────────────
const pruneNote = staleNames.length
  ? (prune ? ` · ${staleNames.length} thừa đã xoá` : ` · ${staleNames.length} thừa (dùng --prune)`)
  : '';
console.log(`\n${tag}Xong: ${skillNames.length} skill + ${guideCount} file hướng dẫn${pruneNote} → ${destRoot}`);
if (dryRun) console.log('(dry-run — chưa ghi gì. Bỏ --dry để chạy thật.)');
else console.log('Khởi động lại Claude Code trong dự án đích để nạp skill mới.');
