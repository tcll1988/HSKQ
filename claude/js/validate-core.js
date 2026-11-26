/* =========================================================
   数据检查规则（check.html 和 tools/check.js 共用）
   用法：HSKValidate.run(HSK) → { issues:[{level, where, msg}], files:{audio:[], img:[]} }
   level：'error' = 必须改；'warn' = 请确认
   ========================================================= */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.HSKValidate = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var TF_TYPES = { 'tf-image': 1, 'tf-word': 1 };
  var SHARED_TYPES = { 'match-image': 1, 'match-text': 1, 'fill-word': 1 };

  function run(HSK) {
    var issues = [], files = { audio: [], img: [] };
    var util = HSK.util || {};
    function add(level, where, msg) { issues.push({ level: level, where: where, msg: msg }); }
    function ruby(where, str) {
      if (typeof str !== 'string' || !str.trim()) { add('error', where, '文字是空的'); return; }
      if (util.rubyProblems) util.rubyProblems(str).forEach(function (p) { add('error', where, p); });
    }
    function useAudio(t, rel, where) { if (rel) files.audio.push({ path: (t.audioRoot || '') + rel, where: where }); }
    function useImg(t, rel, where) {
      if (!rel) { add('error', where, '缺少图片文件名'); return; }
      files.img.push({ path: (t.imgRoot || '') + rel, where: where });
    }

    (HSK.errors || []).forEach(function (e) { add('error', '登记', e); });

    var manifest = HSK.manifest || [];
    if (!manifest.length) add('error', 'data/manifest.js', '试卷清单是空的');
    manifest.forEach(function (id) {
      if (!HSK.tests || !HSK.tests[id]) add('error', 'data/manifest.js', '清单里有「' + id + '」，但没有读到 data/' + id + '.js（文件不存在，或文件里有语法错误）');
    });
    Object.keys(HSK.tests || {}).forEach(function (id) {
      if (manifest.indexOf(id) < 0) add('warn', 'data/' + id + '.js', '已登记但不在 manifest 清单里，网页上不会显示');
    });

    manifest.forEach(function (id) {
      var t = HSK.tests && HSK.tests[id];
      if (!t) return;
      var W = id;
      var level = HSK.levels && HSK.levels[t.level];
      if (!level) { add('error', W, '级别「' + t.level + '」在 data/parts.js 里没有定义'); return; }
      if (!t.title) add('warn', W, '缺少 title（试卷名称）');
      if (!t.sections) { add('error', W, '缺少 sections'); return; }

      var seenNo = {};
      level.sections.forEach(function (def) {
        var sec = t.sections[def.id];
        var SW = W + ' ' + def.id + '（' + def.title + '）';
        if (!sec) { add('warn', SW, '这一部分没有数据'); return; }
        if (!sec.questions || !sec.questions.length) { add('error', SW, '没有题目'); return; }
        var listen = def.kind === 'listening';

        if (SHARED_TYPES[def.type]) {
          if (!sec.options) add('error', SW, '缺少共用选项 options（A~F）');
          else Object.keys(sec.options).forEach(function (L) {
            var o = sec.options[L];
            if (def.type === 'match-image') useImg(t, o && o.img, SW + ' 选项' + L);
            else ruby(SW + ' 选项' + L, o && o.text);
          });
        }

        function checkItem(q, QW, isEx) {
          var letters;
          if (TF_TYPES[def.type]) letters = ['T', 'F'];
          else if (def.type === 'pick-image') letters = Object.keys(q.imgs || {});
          else if (def.type === 'pick-text') letters = Object.keys(q.options || {});
          else letters = Object.keys(sec.options || {});

          if (q.answer == null || q.answer === '') add('error', QW, '缺少答案 answer');
          else if (letters.indexOf(q.answer) < 0) add('error', QW, '答案「' + q.answer + '」不在选项里（可选：' + letters.join('/') + '）');

          if (def.type === 'tf-image' || def.type === 'tf-word') useImg(t, q.img, QW);
          if (def.type === 'tf-word') ruby(QW + ' word', q.word);
          if (def.type === 'pick-image') {
            if (letters.length < 2) add('error', QW, '图片选项 imgs 少于 2 个');
            letters.forEach(function (L) { useImg(t, q.imgs[L], QW + ' 选项' + L); });
          }
          if (def.type === 'pick-text') {
            if (letters.length < 2) add('error', QW, '选项 options 少于 2 个');
            letters.forEach(function (L) { var o = q.options[L]; ruby(QW + ' 选项' + L, typeof o === 'string' ? o : o && o.text); });
          }
          if (def.type === 'match-image' && !listen) ruby(QW + ' text', q.text);
          if (def.type === 'match-text') ruby(QW + ' text', q.text);
          if (def.type === 'fill-word') {
            if (!q.lines || !q.lines.length) add('error', QW, '缺少 lines（填空句子）');
            else {
              var blanks = 0;
              q.lines.forEach(function (l, i) { ruby(QW + ' 第' + (i + 1) + '行', l.text); blanks += (String(l.text).match(/___/g) || []).length; });
              if (blanks !== 1) add('error', QW, '填空题应该正好有 1 个 ___，现在有 ' + blanks + ' 个');
            }
          }
          if (listen) {
            if (q.audio === undefined) add('error', QW, '缺少 audio（没有录音请写 null）');
            else if (q.audio === null) add('warn', QW, '没有录音（网页上显示「音声なし」）');
            else useAudio(t, q.audio, QW);
            if (!q.script || !q.script.length) add('warn', QW, '缺少听力原文 script');
            else q.script.forEach(function (l, i) { if (!l.zh) add('error', QW, '原文第' + (i + 1) + '行缺少 zh'); });
            if (!isEx && t.fullAudio && (!q.t || q.t.length !== 2 || !(q.t[0] < q.t[1]))) add('warn', QW, 't（整段录音里的秒数）缺少或不正确，模拟考试无法高亮这道题');
          }
          if (!q.note) add('warn', QW, '缺少解说 note（为什么这是正确答案）');
          if (!isEx && !q.point) add('warn', QW, '缺少 point（值得记住的词语、语法）');
          if (q.others) Object.keys(q.others).forEach(function (L) {
            if (letters.indexOf(L) < 0) add('error', QW, 'others 里的「' + L + '」不是这道题的选项');
            else if (L === q.answer) add('error', QW, 'others 里写了正确答案「' + L + '」（others 只写错误选项）');
          });
        }

        (sec.example || []).forEach(function (e, i) { checkItem(e, SW + ' 例题' + (i + 1), true); });

        var usedAns = {};
        (sec.example || []).forEach(function (e) { if (SHARED_TYPES[def.type]) usedAns[e.answer] = '例题'; });
        sec.questions.forEach(function (q) {
          var QW = W + ' 第' + q.no + '题';
          if (typeof q.no !== 'number' || q.no % 1) { add('error', W + ' ' + def.id, '题号 no 必须是整数：' + q.no); return; }
          if (seenNo[q.no]) add('error', QW, '题号重复');
          seenNo[q.no] = true;
          checkItem(q, QW, false);
          if (SHARED_TYPES[def.type] && q.answer) {
            if (usedAns[q.answer]) add('warn', QW, '答案「' + q.answer + '」和' + usedAns[q.answer] + '相同（HSK 里每个选项通常只用一次）');
            else usedAns[q.answer] = '第' + q.no + '题';
          }
        });
      });

      var nos = Object.keys(seenNo).map(Number).sort(function (a, b) { return a - b; });
      for (var i = 0; i < nos.length; i++) if (nos[i] !== i + 1) { add('warn', W, '题号不连续，请确认（在第 ' + (i + 1) + ' 题附近）'); break; }
      if (t.fullAudio) {
        if (!t.fullAudio.file) add('error', W, 'fullAudio 缺少 file');
        else useAudio(t, t.fullAudio.file, W + ' 整段录音');
      } else add('warn', W, '没有 fullAudio（整段听力录音），模拟考试的听力部分无法播放');
    });

    return { issues: issues, files: files };
  }

  return { run: run };
});
