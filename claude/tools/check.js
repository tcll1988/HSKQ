#!/usr/bin/env node
/* =========================================================
   数据检查工具（Node 版）
   用法：在网站文件夹里运行   node tools/check.js
   比浏览器版 check.html 多查：
     - data/ 里有但 manifest 没列出的文件
     - 0 字节文件、不是 MP3 的录音
     - 内容完全相同（md5 一样）却用在不同题目的录音（可能拿错了文件）
     - 没有被任何题目用到的录音和图片
   有「错误」时退出码为 1
   ========================================================= */
'use strict';
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var crypto = require('crypto');

var ROOT = path.resolve(process.argv[2] || path.join(__dirname, '..'));
var issues = [];
function add(level, where, msg) { issues.push({ level: level, where: where, msg: msg }); }

/* ---- 1. 像浏览器一样读入数据 ---- */
var written = [];
var sandbox = { console: console };
sandbox.window = sandbox;
sandbox.self = sandbox;
sandbox.document = { write: function (html) { var m = /src="([^"]+)"/.exec(html); if (m) written.push(decodeURIComponent(m[1])); } };
vm.createContext(sandbox);

function load(rel, required) {
  var f = path.join(ROOT, rel);
  if (!fs.existsSync(f)) { if (required) add('error', rel, '文件不存在'); return false; }
  try { vm.runInContext(fs.readFileSync(f, 'utf8'), sandbox, { filename: rel }); return true; }
  catch (e) { add('error', rel, '脚本错误（多半是少了逗号、引号或括号）：' + e.message); return false; }
}
['js/core.js', 'data/parts.js', 'data/manifest.js'].forEach(function (r) { load(r, true); });
written.forEach(function (r) { load(r, true); });
load('js/validate-core.js', true);

var HSK = sandbox.HSK;
if (!HSK || !sandbox.HSKValidate) {
  printAndExit();
}
var result = sandbox.HSKValidate.run(HSK);
issues = issues.concat(result.issues);

/* ---- 2. manifest 与 data/ 文件夹是否一致 ---- */
var dataFiles = fs.readdirSync(path.join(ROOT, 'data')).filter(function (f) { return /\.js$/.test(f) && f !== 'manifest.js' && f !== 'parts.js'; });
dataFiles.forEach(function (f) {
  var id = f.replace(/\.js$/, '');
  if ((HSK.manifest || []).indexOf(id) < 0) add('warn', 'data/' + f, '这个文件没有写进 data/manifest.js，网页上不会显示');
});

/* ---- 3. 文件是否存在、大小、格式 ---- */
function isMp3(buf) {
  if (buf.length < 4) return false;
  if (buf.slice(0, 3).toString('latin1') === 'ID3') return true;
  return buf[0] === 0xFF && (buf[1] & 0xE0) === 0xE0;
}
var md5 = {};
function checkFile(kind, item) {
  var f = path.join(ROOT, item.path);
  if (!fs.existsSync(f)) { add('error', item.where, (kind === 'audio' ? '录音' : '图片') + '文件不存在：' + item.path); return; }
  var st = fs.statSync(f);
  if (st.size === 0) { add('error', item.where, '文件是 0 字节：' + item.path); return; }
  var buf = fs.readFileSync(f);
  if (kind === 'audio') {
    if (!isMp3(buf)) add('error', item.where, '不像是 MP3 文件：' + item.path);
    var h = crypto.createHash('md5').update(buf).digest('hex');
    (md5[h] = md5[h] || []).push(item);
  }
}
var seenPath = {};
result.files.audio.forEach(function (it) { seenPath[path.normalize(it.path)] = 1; checkFile('audio', it); });
result.files.img.forEach(function (it) { seenPath[path.normalize(it.path)] = 1; checkFile('img', it); });

Object.keys(md5).forEach(function (h) {
  var list = md5[h], paths = {};
  list.forEach(function (it) { paths[it.path] = 1; });
  if (Object.keys(paths).length > 1) add('warn', '录音', '这些文件内容完全相同，可能拿错了录音：' + Object.keys(paths).join('、'));
  else if (list.length > 1) add('warn', '录音', '同一个录音被多处使用：' + list.map(function (i) { return i.where; }).join('、'));
});

/* ---- 4. 没被用到的录音和图片（按文件夹合并成一行） ---- */
function walk(dir, out) {
  if (!fs.existsSync(dir)) return out;
  fs.readdirSync(dir).forEach(function (f) {
    var p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, out); else if (!/^\./.test(f)) out.push(p);
  });
  return out;
}
['audio', 'img'].forEach(function (top) {
  var unused = {};
  walk(path.join(ROOT, top), []).forEach(function (p) {
    var rel = path.relative(ROOT, p);
    if (!seenPath[path.normalize(rel)]) {
      var d = path.dirname(rel);
      (unused[d] = unused[d] || []).push(path.basename(rel));
    }
  });
  Object.keys(unused).forEach(function (d) {
    add('warn', d, '有 ' + unused[d].length + ' 个文件没有被任何题目用到：' + unused[d].slice(0, 8).join('、') + (unused[d].length > 8 ? ' …' : ''));
  });
});

printAndExit();

function printAndExit() {
  var tests = HSK ? (HSK.manifest || []).filter(function (id) { return HSK.tests && HSK.tests[id]; }) : [];
  var nq = 0;
  tests.forEach(function (id) { var s = HSK.tests[id].sections; Object.keys(s).forEach(function (k) { nq += (s[k].questions || []).length; }); });
  var errs = issues.filter(function (i) { return i.level === 'error'; });
  var warns = issues.filter(function (i) { return i.level !== 'error'; });
  console.log('HSK 練習サイト 数据检查');
  console.log('文件夹：' + ROOT);
  console.log('试卷：' + (tests.join('、') || '无') + '　题目：' + nq + ' 道' +
    (typeof result !== 'undefined' ? '　录音：' + result.files.audio.length + ' 处　图片：' + result.files.img.length + ' 处' : ''));
  console.log('');
  if (errs.length) { console.log('【错误】必须修改（' + errs.length + '）'); errs.forEach(function (i) { console.log('  ✗ ' + i.where + '：' + i.msg); }); console.log(''); }
  if (warns.length) { console.log('【提醒】请确认（' + warns.length + '）'); warns.forEach(function (i) { console.log('  ! ' + i.where + '：' + i.msg); }); console.log(''); }
  if (!errs.length && !warns.length) console.log('✓ 没有发现问题');
  else if (!errs.length) console.log('✓ 没有错误（只有提醒）');
  process.exit(errs.length ? 1 : 0);
}
