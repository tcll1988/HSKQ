/* 基本部分：试卷登记 + 共用小工具（网页、check.html、check.js 共用） */
var HSK = window.HSK || {};
window.HSK = HSK;

HSK.tests = {};
HSK.errors = [];

/* 登记一套试卷。同一个 id 不会被覆盖，只记录错误。 */
HSK.registerTest = function (t) {
  if (!t || !t.id) { HSK.errors.push('registerTest：缺少 id'); return; }
  if (HSK.tests[t.id]) {
    HSK.errors.push('试卷 id「' + t.id + '」重复登记，后面的那份已被忽略');
    return;
  }
  HSK.tests[t.id] = t;
};

HSK.util = (function () {
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* 路径：root + 相对路径，逐段 encodeURIComponent */
  function joinPath(root, rel) {
    if (rel == null) return null;
    var p = String(root || '') + String(rel);
    return p.split('/').map(function (seg) { return encodeURIComponent(seg); }).join('/');
  }

  /* 把 "[汉字|pinyin]" 写法拆成片段：
     {t:'ruby', hz, py} / {t:'text', s} / {t:'blank'} */
  function parseRuby(str) {
    var out = [], re = /\[([^\[\]|]*)\|([^\[\]]*)\]|___/g, last = 0, m;
    str = String(str == null ? '' : str);
    while ((m = re.exec(str))) {
      if (m.index > last) out.push({ t: 'text', s: str.slice(last, m.index) });
      if (m[0] === '___') out.push({ t: 'blank' });
      else out.push({ t: 'ruby', hz: m[1], py: m[2] });
      last = re.lastIndex;
    }
    if (last < str.length) out.push({ t: 'text', s: str.slice(last) });
    return out;
  }

  /* 检查写法是否正确，返回问题列表（空数组 = 没问题） */
  function rubyProblems(str) {
    var probs = [];
    parseRuby(str).forEach(function (p) {
      if (p.t === 'ruby' && (!p.hz.trim() || !p.py.trim())) probs.push('有空的汉字或拼音：[' + p.hz + '|' + p.py + ']');
      if (p.t === 'text' && /[\[\]|]/.test(p.s)) probs.push('括号或竖线不成对：「' + p.s + '」');
    });
    return probs;
  }

  /* blankHtml：填空处显示的 HTML（默认是空白） */
  function rubyHtml(str, blankHtml) {
    return '<span class="zh" lang="zh-CN">' + parseRuby(str).map(function (p) {
      if (p.t === 'ruby') return '<ruby>' + esc(p.hz) + '<rt>' + esc(p.py) + '</rt></ruby>';
      if (p.t === 'blank') return '<span class="blank">（<span class="blank-in">' + (blankHtml || '&emsp;&emsp;') + '</span>）</span>';
      return esc(p.s);
    }).join('') + '</span>';
  }

  /* 去掉拼音，只留汉字 */
  function plain(str) {
    return parseRuby(str).map(function (p) {
      return p.t === 'ruby' ? p.hz : p.t === 'blank' ? '（　）' : p.s;
    }).join('');
  }

  return { esc: esc, joinPath: joinPath, parseRuby: parseRuby, rubyProblems: rubyProblems, rubyHtml: rubyHtml, plain: plain };
})();
