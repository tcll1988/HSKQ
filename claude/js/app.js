/* =========================================================
   HSK 練習サイト —— 页面逻辑
   目录：
     1. 设置与保存（localStorage）
     2. 数据辅助函数
     3. 题目卡片
     4. 首页
     5. 练习模式（一题一题，答对才能进下一题）
     6. 考试模式（模拟考试）
     7. 底部播放器
     8. 事件、路由与启动
   ========================================================= */
(function () {
  'use strict';

  var U = HSK.util, P = HSK.player, esc = U.esc;
  var main = document.getElementById('main');

  /* ---------- 1. 设置与保存 ---------- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  var KEY_SET = 'hsk.v1.settings', KEY_PRAC = 'hsk.v1.practice', KEY_EXAM = 'hsk.v1.exam.', KEY_SESS = 'hsk.v1.session.';
  var SCALES = [0.85, 1, 1.15, 1.3, 1.5, 1.75];
  var RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

  var settings = store.get(KEY_SET, {}) || {};
  if (SCALES.indexOf(settings.scale) < 0) settings.scale = 1;
  if (typeof settings.pinyin !== 'boolean') settings.pinyin = true;
  if (typeof settings.autoscroll !== 'boolean') settings.autoscroll = true;
  if (typeof settings.autoplay !== 'boolean') settings.autoplay = true;
  if (settings.order !== 'random') settings.order = 'original';
  if (RATES.indexOf(settings.rate) < 0) settings.rate = 1;

  /* 练习记录：只保存「第一次选的选项」，键为 试卷:题号。对错每次按现有数据重新判定 */
  var practice = store.get(KEY_PRAC, {}) || {};

  function saveSettings() { store.set(KEY_SET, settings); }
  function savePractice() { store.set(KEY_PRAC, practice); }
  function applySettings() {
    document.documentElement.style.setProperty('--scale', settings.scale);
    document.body.classList.toggle('no-pinyin', !settings.pinyin);
    var b = document.getElementById('btn-pinyin');
    if (b) { b.setAttribute('aria-pressed', String(settings.pinyin)); b.textContent = settings.pinyin ? 'ピンイン ON' : 'ピンイン OFF'; }
    var i = SCALES.indexOf(settings.scale);
    var dn = document.getElementById('btn-font-down'), up = document.getElementById('btn-font-up');
    if (dn) dn.disabled = i <= 0;
    if (up) up.disabled = i >= SCALES.length - 1;
  }

  var PRAISE = [
    '正解！ 太棒了！', 'すばらしい！ 很好！', 'その調子！ 加油！', 'よくできました！ 真不错！',
    '完璧です！ 非常好！', 'さすが！ 你真棒！', '大正解！ 对了！', 'いいですね！ 好极了！'
  ];
  var lastPraise = -1;
  function praise() {
    var i;
    do { i = Math.floor(Math.random() * PRAISE.length); } while (i === lastPraise && PRAISE.length > 1);
    lastPraise = i;
    return PRAISE[i];
  }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function fmtTime(s) {
    s = Math.max(0, Math.floor(s || 0));
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }

  /* 危险操作：「再点一次确认」，不用 confirm() */
  function armConfirm(btn, msg) {
    if (btn.getAttribute('data-armed') === '1') return true;
    var orig = btn.innerHTML;
    btn.setAttribute('data-armed', '1');
    btn.classList.add('is-armed');
    btn.innerHTML = esc(msg || 'もう一度押すと実行します');
    setTimeout(function () {
      if (!document.body.contains(btn)) return;
      btn.setAttribute('data-armed', '0'); btn.classList.remove('is-armed'); btn.innerHTML = orig;
    }, 3500);
    return false;
  }

  /* ---------- 2. 数据辅助函数 ---------- */
  function tests() {
    return (HSK.manifest || []).filter(function (id) { return HSK.tests[id]; }).map(function (id) { return HSK.tests[id]; });
  }
  function levelOf(t) { return HSK.levels && HSK.levels[t.level]; }
  function sectionsOf(t) {
    var L = levelOf(t);
    if (!L) return [];
    return L.sections.filter(function (d) { return t.sections && t.sections[d.id]; })
      .map(function (d) { return { def: d, sec: t.sections[d.id] }; });
  }
  /* 题号 → {def, sec, q} */
  function qIndex(t) {
    if (t._idx) return t._idx;
    var m = {};
    sectionsOf(t).forEach(function (s) { s.sec.questions.forEach(function (q) { m[q.no] = { def: s.def, sec: s.sec, q: q }; }); });
    t._idx = m;
    return m;
  }
  function choicesFor(def, sec, q) {
    if (def.type === 'tf-image' || def.type === 'tf-word') return ['T', 'F'];
    if (def.type === 'pick-image') return Object.keys(q.imgs || {});
    if (def.type === 'pick-text') return Object.keys(q.options || {});
    return Object.keys(sec.options || {});
  }
  function exampleLetters(def, sec) {
    if (!/^(match|fill)/.test(def.type)) return [];
    return (sec.example || []).map(function (e) { return e.answer; });
  }
  /* 文字选项：{text, ja}（兼容只写字符串的旧写法） */
  function textOption(def, sec, q, L) {
    var o = def.type === 'pick-text' ? (q.options || {})[L] : (sec.options || {})[L];
    if (o == null) return null;
    return typeof o === 'string' ? { text: o } : o;
  }
  function audioSrc(t, rel) { return rel ? U.joinPath(t.audioRoot, rel) : null; }
  function imgSrc(t, rel) { return U.joinPath(t.imgRoot, rel); }
  function pkey(t, no) { return t.id + ':' + no; }
  function statsFor(t, nos) {
    var idx = qIndex(t), a = 0, c = 0;
    nos.forEach(function (no) {
      var v = practice[pkey(t, no)];
      if (v != null) { a++; if (idx[no] && v === idx[no].q.answer) c++; }
    });
    return { answered: a, correct: c, total: nos.length };
  }
  function letterName(L) { return L === 'T' ? '✓' : L === 'F' ? '✗' : L; }

  /* 练习范围：全部 / 听力 / 阅读 / 某个部分 */
  function scopeInfo(t, scope) {
    var ss = sectionsOf(t), nos = [], label = '', def = null;
    ss.forEach(function (s) {
      var hit = scope === 'all' || scope === s.def.kind || scope === s.def.id;
      if (hit) s.sec.questions.forEach(function (q) { nos.push(q.no); });
      if (scope === s.def.id) def = s.def;
    });
    if (scope === 'all') label = '全問（' + nos.length + '問）';
    else if (scope === 'listening') label = '聴解 全' + nos.length + '問';
    else if (scope === 'reading') label = '読解 全' + nos.length + '問';
    else if (def) label = def.title;
    return nos.length ? { scope: scope, label: label, sub: def ? def.range : '', nos: nos } : null;
  }

  /* ---------- 3. 题目卡片 ---------- */
  function playBtn(t, key, rel, label) {
    var src = audioSrc(t, rel);
    if (!src) return '<button type="button" class="play" disabled><span class="play-ic ic-none" aria-hidden="true"></span><span class="play-tx">音声なし</span></button>';
    return '<button type="button" class="play" data-act="play" data-key="' + esc(key) + '" data-src="' + esc(src) +
      '" data-label="' + esc(label) + '"><span class="play-ic" aria-hidden="true"></span><span class="play-tx">再生</span></button>';
  }

  /* 解说：先写「为什么这个是正确答案」，再附原文（拼音・汉字・日语译文） */
  function explainHtml(def, sec, q) {
    var body = '';
    if (q.note) {
      body += '<div class="why"><div class="why-title">なぜ <b>' + letterName(q.answer) + '</b> が正解？</div>' +
        '<p class="note-tx">' + esc(q.note) + '</p></div>';
    }
    var others = q.others ? Object.keys(q.others).sort() : [];
    if (others.length) {
      body += '<div class="others"><div class="ex-sub">ほかの選択肢が違う理由</div><ul>' + others.map(function (L) {
        return '<li><span class="ol">' + esc(L) + '</span><span>' + esc(q.others[L]) + '</span></li>';
      }).join('') + '</ul></div>';
    }
    if (q.point) body += '<div class="point"><div class="ex-sub">覚えておきたい表現</div><p>' + esc(q.point) + '</p></div>';
    var line = function (who, zhHtml, py, ja) {
      return '<div class="sl">' + (who ? '<span class="who" lang="zh-CN">' + esc(who) + '：</span>' : '') +
        '<div class="sl-txt">' + (py ? '<span class="py">' + esc(py) + '</span>' : '') + zhHtml +
        (ja ? '<span class="ja">' + esc(ja) + '</span>' : '') + '</div></div>';
    };
    if (q.script && q.script.length) {
      body += '<div class="ex-sub">原文</div>' + q.script.map(function (l) {
        return line(l.who, '<span class="zh" lang="zh-CN">' + esc(l.zh) + '</span>', l.py, l.ja);
      }).join('');
    } else if (q.word) {
      body += '<div class="ex-sub">語句の意味</div>' + line('', U.rubyHtml(q.word), '', q.ja);
    } else if (q.text) {
      body += '<div class="ex-sub">日本語訳</div>' + line('', '<span class="zh" lang="zh-CN">' + esc(U.plain(q.text)) + '</span>', '', q.ja);
    } else if (q.lines) {
      var ans = textOption(def, sec, q, q.answer);
      body += '<div class="ex-sub">日本語訳</div>' + q.lines.map(function (l) {
        var zh = U.parseRuby(l.text).map(function (p) {
          return p.t === 'ruby' ? esc(p.hz) : p.t === 'blank' ? '<b class="ins">' + esc(ans ? U.plain(ans.text) : '（　）') + '</b>' : esc(p.s);
        }).join('');
        return line(l.who, '<span class="zh" lang="zh-CN">' + zh + '</span>', '', l.ja);
      }).join('');
    }
    return body ? '<div class="explain">' + body + '</div>' : '';
  }

  /* o: { t, def, sec, q, mode: practice|exam|review|example, chosen, wrong[], solved, msg, exIndex } */
  function renderQ(o) {
    var t = o.t, def = o.def, sec = o.sec, q = o.q, mode = o.mode;
    var isEx = mode === 'example';
    var wrong = o.wrong || [];
    var chosen = isEx ? q.answer : mode === 'practice' ? (o.solved ? q.answer : null) : o.chosen;
    var answered = chosen != null;
    var ok = answered && chosen === q.answer;
    var listen = def.kind === 'listening';
    /* 是否显示答案：例题、复习，练习中答对或答错之后 */
    var reveal = isEx || mode === 'review' || (mode === 'practice' && (o.solved || wrong.length > 0));
    var id = isEx ? ('ex-' + def.id + '-' + (o.exIndex || 0)) : ('q-' + q.no);

    var cls = 'q q-' + def.type;
    if (mode === 'review') cls += ok ? ' q-ok' : ' q-ng';
    if (mode === 'practice' && o.solved) cls += wrong.length ? ' q-fixed' : ' q-ok';
    if (mode === 'practice' && !o.solved && wrong.length) cls += ' q-ng';
    if (mode === 'exam' && answered) cls += ' q-done';
    if (isEx) cls += ' q-ex';

    var h = '<article class="' + cls + '" id="' + id + '"' + (isEx ? '' : ' data-no="' + q.no + '"') + '>';
    h += '<div class="q-head"><span class="q-no">' + (isEx ? '例' : '第' + q.no + '題') + '</span>';
    if (listen && mode !== 'exam') {
      var key = 'clip:' + t.id + ':' + (isEx ? id : q.no);
      h += playBtn(t, key, q.audio, t.title + '　' + (isEx ? def.title + ' 例題' : '第' + q.no + '題'));
    }
    if (mode === 'review') h += '<span class="q-res ' + (ok ? 'ok' : 'ng') + '">' + (ok ? '○ 正解' : answered ? '× 不正解' : '× 未解答') + '</span>';
    h += '</div>';

    /* 题干 */
    if (def.type === 'tf-image') {
      h += '<div class="q-media"><img class="q-img" src="' + esc(imgSrc(t, q.img)) + '" alt="問題の写真"></div>';
    } else if (def.type === 'tf-word') {
      h += '<div class="q-media q-media-word"><img class="q-img" src="' + esc(imgSrc(t, q.img)) + '" alt="問題の写真">' +
        '<div class="q-word">' + U.rubyHtml(q.word) + '</div></div>';
    } else if (q.text) {
      h += '<p class="q-text">' + U.rubyHtml(q.text) + '</p>';
    } else if (q.lines) {
      var fill = '';
      if (answered && sec.options && sec.options[chosen]) {
        var fcls = mode === 'exam' ? 'fill' : ok ? 'fill fill-ok' : 'fill fill-ng';
        fill = '<span class="' + fcls + '">' + U.rubyHtml(textOption(def, sec, q, chosen).text) + '</span>';
      }
      h += '<div class="q-lines">' + q.lines.map(function (l) {
        return '<p class="q-text">' + (l.who ? '<span class="who" lang="zh-CN">' + esc(l.who) + '：</span>' : '') + U.rubyHtml(l.text, fill) + '</p>';
      }).join('') + '</div>';
    } else if (listen && def.type === 'match-image') {
      h += '<p class="q-hint">会話を聞いて、合う写真を選んでください。</p>';
    } else if (listen && def.type === 'pick-text') {
      h += '<p class="q-hint">質問は音声だけで流れます。答えを選んでください。</p>';
    }

    /* 选项 */
    var letters = choicesFor(def, sec, q);
    var exL = isEx ? [] : exampleLetters(def, sec);
    var kind = (def.type === 'tf-image' || def.type === 'tf-word') ? 'tf'
      : (def.type === 'pick-image' || def.type === 'match-image') ? 'img' : 'text';
    var showJa = reveal && mode !== 'exam';
    h += '<div class="choices choices-' + kind + (kind === 'img' && letters.length > 3 ? ' choices-6' : '') + '" role="group" aria-label="選択肢">';
    letters.forEach(function (L) {
      var used = exL.indexOf(L) >= 0;
      var isAns = L === q.answer;
      var st = '', dis = false;
      if (isEx) { st = isAns ? ' is-answer' : ''; dis = true; }
      else if (mode === 'exam') { st = chosen === L ? ' is-chosen' : ''; dis = used; }
      else if (mode === 'review') {
        if (chosen === L) st = ok ? ' is-correct' : ' is-wrong'; else if (isAns) st = ' is-answer';
        dis = true;
      } else { /* practice */
        if (o.solved) { st = isAns ? ' is-correct' : wrong.indexOf(L) >= 0 ? ' is-wrong' : ''; dis = true; }
        else if (wrong.length) {
          if (isAns) st = ' is-answer is-target';           // 正确答案：要点它才能进下一题
          else { st = wrong.indexOf(L) >= 0 ? ' is-wrong' : ' is-dim'; dis = true; }
        } else dis = used;
      }
      if (used) { st += ' is-used'; dis = true; }
      var inner;
      if (kind === 'tf') {
        inner = '<span class="tf">' + (L === 'T' ? '✓' : '✗') + '</span><span class="tf-ja">' + (L === 'T' ? '合っている' : '合っていない') + '</span>';
      } else if (kind === 'img') {
        var src = def.type === 'pick-image' ? q.imgs[L] : sec.options[L].img;
        inner = '<img src="' + esc(imgSrc(t, src)) + '" alt="写真 ' + L + '"><span class="letter">' + L + '</span>' +
          (used ? '<span class="used-tag">例題</span>' : '');
      } else {
        var opt = textOption(def, sec, q, L) || { text: '' };
        inner = '<span class="letter">' + L + '</span><span class="ctext">' + U.rubyHtml(opt.text) +
          (showJa && opt.ja ? '<span class="cja">' + esc(opt.ja) + '</span>' : '') + '</span>' +
          (used ? '<span class="used-tag">例題</span>' : '');
      }
      h += '<button type="button" class="choice' + st + '" data-act="choose"' + (isEx ? '' : ' data-no="' + q.no + '"') + ' data-choice="' + L + '"' +
        (dis ? ' disabled' : '') + ' aria-pressed="' + (!isEx && chosen === L) + '"' +
        (used ? ' title="例題で使った選択肢です"' : '') + '>' + inner + '</button>';
    });
    h += '</div>';

    /* 反馈 */
    if (isEx) {
      h += '<div class="fb fb-ex">答え：<b>' + letterName(q.answer) + '</b></div>';
    } else if (mode === 'practice' && reveal) {
      var aopt = textOption(def, sec, q, q.answer);
      var ansTxt = '<b>' + letterName(q.answer) + '</b>' + (aopt && aopt.text ? '（' + U.rubyHtml(aopt.text) + '）' : '');
      if (o.solved && !wrong.length) h += '<div class="fb fb-ok" role="status"><strong>' + esc(o.msg || '正解！') + '</strong></div>';
      else if (o.solved) h += '<div class="fb fb-fixed" role="status"><strong>OK！</strong> 正解は ' + ansTxt + ' でした。解説を読んでから次へ進みましょう。</div>';
      else h += '<div class="fb fb-ng" role="status"><strong>ざんねん…</strong> 正解は ' + ansTxt + ' です。<br>解説を読んで、正解の <b>' + letterName(q.answer) + '</b> を選ぶと次へ進めます。</div>';
    } else if (mode === 'review') {
      var ropt = textOption(def, sec, q, q.answer);
      h += '<div class="fb ' + (ok ? 'fb-ok' : 'fb-ng') + '">あなたの答え：<b>' + (answered ? letterName(chosen) : '—') + '</b>　正解：<b>' + letterName(q.answer) + '</b>' +
        (ropt && ropt.text ? '（' + U.rubyHtml(ropt.text) + '）' : '') + '</div>';
    }

    /* 解说 */
    if (isEx) {
      var ex = explainHtml(def, sec, q);
      if (ex) h += '<details class="explain-box"><summary>例題の解説</summary>' + ex + '</details>';
    } else if (mode === 'practice' && reveal) {
      h += explainHtml(def, sec, q);
    } else if (mode === 'review') {
      h += '<details class="explain-box"' + (ok ? '' : ' open') + '><summary>解説を見る</summary>' + explainHtml(def, sec, q) + '</details>';
    }

    if (mode === 'practice' && o.solved) {
      h += '<div class="q-actions"><button type="button" class="btn btn-primary btn-lg" data-act="next">' + esc(o.nextLabel || '次の問題へ →') + '</button></div>';
    }
    h += '</article>';
    return h;
  }

  function exampleBlock(t, def, sec) {
    if (!sec.example || !sec.example.length) return '';
    return '<details class="example"><summary>例題を見る（答えつき）</summary><div class="ex-body">' +
      sec.example.map(function (e, i) { return renderQ({ t: t, def: def, sec: sec, q: e, mode: 'example', exIndex: i }); }).join('') +
      '</div></details>';
  }

  /* ---------- 4. 首页 ---------- */
  function viewHome() {
    document.title = 'HSK 練習';
    var tpl = document.getElementById('tpl-home');
    main.innerHTML = '';
    main.appendChild(tpl.content.cloneNode(true));
    var slot = main.querySelector('[data-slot="tests"]');
    if (slot) slot.innerHTML = tests().map(testCard).join('') || '<p class="warn-box">試験データが見つかりません。</p>';
    errorBanner();
  }

  function testCard(t) {
    var ss = sectionsOf(t);
    var tid = encodeURIComponent(t.id);
    var ex = store.get(KEY_EXAM + t.id, null);
    var exInfo = '未受験', exBtn = '試験を始める';
    if (ex && ex.status === 'done') {
      var sc = scoreExam(t, ex.answers || {});
      exInfo = '前回の結果：<b>' + sc.total + '</b> / ' + sc.max + ' 点（' + (sc.pass ? '合格ライン到達' : '合格ラインまであと ' + (sc.passLine - sc.total) + ' 点') + '）';
      exBtn = '結果を見る';
    } else if (ex && ex.status && ex.status !== 'intro') {
      exInfo = '途中まで解答済み（' + (ex.status === 'listening' ? '聴解' : '読解') + '）';
      exBtn = '続きから受ける';
    }
    var tile = function (scope, title, sub, type) {
      var info = scopeInfo(t, scope);
      if (!info) return '';
      var st = statsFor(t, info.nos);
      var pct = st.total ? Math.round(st.answered / st.total * 100) : 0;
      return '<a class="part-tile" href="#/practice/' + tid + '/' + scope + '">' +
        '<span class="pt-title">' + esc(title) + '</span>' +
        '<span class="pt-range">' + esc(sub || '') + '</span>' +
        (type ? '<span class="pt-type">' + esc(type) + '</span>' : '') +
        '<span class="pt-meter" aria-hidden="true"><i style="width:' + pct + '%"></i></span>' +
        '<span class="pt-stat">' + (st.answered ? '一発正解 ' + st.correct + '/' + st.total : '未着手') + '</span></a>';
    };
    var group = function (kind, label) {
      var list = ss.filter(function (s) { return s.def.kind === kind; });
      if (!list.length) return '';
      return '<h4 class="grp-title"><span class="grp-ic ' + kind + '" aria-hidden="true"></span>' + label + '</h4><div class="part-grid">' +
        list.map(function (s) { return tile(s.def.id, '第' + s.def.no + '部分', s.def.range, s.def.short); }).join('') + '</div>';
    };
    return '<section class="test-card">' +
      '<h2 class="test-title" lang="zh-CN">' + esc(t.title) + '</h2>' +

      '<div class="mode-box mode-practice">' +
      '<div class="mode-head"><span class="mode-tag">練習モード</span><p>1問ずつ解きます。間違えるとすぐに正解と解説が表示され、<b>正解を選ぶと次の問題へ進めます</b>。</p></div>' +
      '<fieldset class="order-pick"><legend>出題の順番</legend>' +
      '<label><input type="radio" name="order-' + esc(t.id) + '" value="original"' + (settings.order === 'original' ? ' checked' : '') + ' data-setting="order"> 原題の順番</label>' +
      '<label><input type="radio" name="order-' + esc(t.id) + '" value="random"' + (settings.order === 'random' ? ' checked' : '') + ' data-setting="order"> ランダム</label></fieldset>' +
      '<div class="part-grid part-grid-wide">' +
      tile('all', '全問', '第1〜40題') + tile('listening', '聴解のみ', '第1〜20題') + tile('reading', '読解のみ', '第21〜40題') + '</div>' +
      group('listening', '聴解（部分別）') + group('reading', '読解（部分別）') +
      '<div class="card-foot"><button type="button" class="btn-link danger" data-act="reset-all" data-test="' + esc(t.id) + '">この試験の練習記録をすべて消す</button></div>' +
      '</div>' +

      '<div class="mode-box mode-exam">' +
      '<div class="mode-head"><span class="mode-tag exam">試験モード</span><p>本番と同じ順番・時間で40問を解き、最後に点数と解説を確認します（聴解 約15分＋読解 17分）。</p></div>' +
      '<div class="exam-row"><div class="exam-info">' + exInfo + '</div>' +
      '<a class="btn btn-primary" href="#/exam/' + tid + '">' + exBtn + '</a></div></div>' +
      '</section>';
  }

  function errorBanner() {
    var msgs = (HSK.errors || []).slice();
    (HSK.manifest || []).forEach(function (id) { if (!HSK.tests[id]) msgs.push('data/' + id + '.js を読み込めませんでした'); });
    if (!msgs.length) return;
    var d = document.createElement('div');
    d.className = 'warn-box';
    d.innerHTML = '<b>データに問題があります。</b>先生に連絡してください。<ul>' + msgs.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>';
    main.insertBefore(d, main.firstChild);
  }

  /* ---------- 5. 练习模式 ---------- */
  var cur = null; // 当前页面的上下文

  function sessKey(t, scope) { return KEY_SESS + t.id + '.' + scope; }
  function newSession(t, scope, nos) {
    var idx = qIndex(t);
    var list = nos.filter(function (n) { return idx[n]; });
    list.sort(function (a, b) { return a - b; });
    if (settings.order === 'random') shuffle(list);
    return { order: settings.order, list: list, i: 0, wrong: {}, solved: {}, first: {} };
  }
  function loadSession(t, info) {
    var s = store.get(sessKey(t, info.scope), null), idx = qIndex(t);
    var valid = s && s.list && s.list.length && s.list.every(function (n) { return idx[n]; }) &&
      typeof s.i === 'number' && s.i < s.list.length && s.order === settings.order;
    if (!valid) return newSession(t, info.scope, info.nos);
    s.wrong = s.wrong || {}; s.solved = s.solved || {}; s.first = s.first || {};
    return s;
  }
  function saveSession() { if (cur && cur.view === 'practice') store.set(sessKey(cur.t, cur.info.scope), cur.s); }

  function viewPractice(t, scope) {
    var info = scopeInfo(t, scope);
    if (!info) return viewNotFound();
    cur = { view: 'practice', t: t, info: info, s: loadSession(t, info), msg: null };
    document.title = info.label + '｜練習｜' + t.title;
    var orderSel = '<div class="seg" role="radiogroup" aria-label="出題の順番">' +
      '<button type="button" role="radio" data-act="order" data-order="original" aria-checked="' + (settings.order === 'original') + '">原題の順番</button>' +
      '<button type="button" role="radio" data-act="order" data-order="random" aria-checked="' + (settings.order === 'random') + '">ランダム</button></div>';
    var hasListen = info.nos.some(function (n) { return qIndex(t)[n].def.kind === 'listening'; });
    main.innerHTML =
      '<nav class="crumb"><a href="#/">← トップ</a><span lang="zh-CN">' + esc(t.title) + '</span><span>練習モード</span></nav>' +
      '<header class="page-head"><h1>' + esc(info.label) + (info.sub ? '<small>' + esc(info.sub) + '</small>' : '') + '</h1>' +
      '<div class="toolbar">' + orderSel +
      (hasListen ? '<label class="chk"><input type="checkbox" id="chk-autoplay"' + (settings.autoplay ? ' checked' : '') + '> 次の問題で音声を自動再生</label>' : '') +
      '<span class="spacer"></span><button type="button" class="btn btn-ghost" data-act="restart">最初からやり直す</button></div>' +
      '<div class="prog"><div class="prog-text" id="prog-text"></div><ol class="dots" id="dots" aria-hidden="true"></ol></div></header>' +
      '<div id="pq"></div>';
    renderCurrent();
  }

  function dotsHtml() {
    var s = cur.s, idx = qIndex(cur.t);
    return s.list.map(function (no, i) {
      var c = i === s.i ? 'cur' : '';
      if (s.solved[no]) c += s.first[no] === idx[no].q.answer ? ' ok' : ' ng';
      return '<li class="' + c + '" title="第' + no + '題"></li>';
    }).join('');
  }
  function updateProg() {
    var s = cur.s;
    var done = s.list.filter(function (n) { return s.solved[n]; }).length;
    var pt = document.getElementById('prog-text');
    if (pt) pt.innerHTML = s.i < s.list.length
      ? '<b>' + (s.i + 1) + '</b> / ' + s.list.length + ' 問目<span class="prog-sub">（' + (s.order === 'random' ? 'ランダム' : '原題の順番') + '・完了 ' + done + '）</span>'
      : '完了 <b>' + done + '</b> / ' + s.list.length;
    var d = document.getElementById('dots');
    if (d) d.innerHTML = dotsHtml();
  }

  function practiceCardHtml(no) {
    var s = cur.s, x = qIndex(cur.t)[no];
    var last = s.i >= s.list.length - 1;
    return renderQ({ t: cur.t, def: x.def, sec: x.sec, q: x.q, mode: 'practice', wrong: s.wrong[no] || [], solved: !!s.solved[no],
      msg: cur.msg, nextLabel: last ? '結果を見る →' : '次の問題へ →' });
  }

  function renderCurrent() {
    var s = cur.s, box = document.getElementById('pq');
    updateProg();
    if (s.i >= s.list.length) return renderSummary();
    var no = s.list[s.i], x = qIndex(cur.t)[no];
    box.innerHTML = '<div class="ctx"><div class="ctx-title">' + esc(x.def.title) + '<small>' + esc(x.def.range || '') + '</small></div>' +
      '<p class="instr">' + esc(x.def.instruction || '') + '</p>' + exampleBlock(cur.t, x.def, x.sec) + '</div>' +
      '<div id="pcard">' + practiceCardHtml(no) + '</div>';
    syncPlayButtons();
  }
  function rerenderCard() {
    var wrap = document.getElementById('pcard');
    if (!wrap) return;
    wrap.innerHTML = practiceCardHtml(cur.s.list[cur.s.i]);
    syncPlayButtons();
    updateProg();
  }

  function renderSummary() {
    var s = cur.s, idx = qIndex(cur.t), tid = encodeURIComponent(cur.t.id);
    var firstOk = s.list.filter(function (n) { return s.first[n] === idx[n].q.answer; });
    var missed = s.list.filter(function (n) { return s.first[n] !== idx[n].q.answer; }).sort(function (a, b) { return a - b; });
    var perfect = !missed.length;
    document.getElementById('pq').innerHTML =
      '<div class="summary' + (perfect ? ' perfect' : '') + '">' +
      '<div class="sum-label">一発で正解した問題</div>' +
      '<div class="sum-score">' + firstOk.length + '<small> / ' + s.list.length + ' 問</small></div>' +
      '<p>' + (perfect ? '全問一発正解です！ 太棒了！ 試験モードにも挑戦してみましょう。' : '間違えた問題：' + missed.map(function (n) { return '第' + n + '題'; }).join('、')) + '</p>' +
      '<div class="sum-btns">' +
      (missed.length ? '<button type="button" class="btn btn-primary" data-act="retry-missed">間違えた問題だけもう一度（' + missed.length + '問）</button>' : '') +
      '<button type="button" class="btn ' + (missed.length ? 'btn-ghost' : 'btn-primary') + '" data-act="restart-now">全部もう一度</button>' +
      '<a class="btn btn-ghost" href="#/exam/' + tid + '">試験モードへ</a>' +
      '<a class="btn btn-ghost" href="#/">トップへ</a></div></div>';
  }

  /* ---------- 6. 考试模式 ---------- */
  function examKey(t) { return KEY_EXAM + t.id; }
  function loadExam(t) {
    var e = store.get(examKey(t), null);
    if (!e || typeof e !== 'object') e = {};
    if (['intro', 'listening', 'reading', 'done'].indexOf(e.status) < 0) e.status = 'intro';
    if (!e.answers || typeof e.answers !== 'object') e.answers = {};
    e.pos = Number(e.pos) || 0;
    return e;
  }
  function saveExam() { if (cur && cur.view === 'exam') store.set(examKey(cur.t), cur.exam); }

  function scoreExam(t, answers) {
    var L = levelOf(t), sc = (L && L.scoring) || { perQuestion: 5, pass: 120 };
    var per = sc.perQuestion || 5;
    var r = { listening: 0, reading: 0, total: 0, max: 0, bySec: [], passLine: sc.pass || 0 };
    sectionsOf(t).forEach(function (s) {
      var c = 0;
      s.sec.questions.forEach(function (q) { if (answers[q.no] === q.answer) c++; });
      r[s.def.kind] += c * per; r.total += c * per; r.max += s.sec.questions.length * per;
      r.bySec.push({ def: s.def, correct: c, total: s.sec.questions.length });
    });
    r.pass = r.total >= r.passLine;
    return r;
  }

  function viewExam(t) {
    var exam = loadExam(t);
    var L = levelOf(t) || {};
    cur = { view: 'exam', t: t, exam: exam, active: null, lastSave: 0 };
    document.title = '試験モード｜' + t.title;
    var head = '<nav class="crumb"><a href="#/">← トップ</a><span lang="zh-CN">' + esc(t.title) + '</span><span>試験モード</span></nav>';

    if (exam.status === 'intro') {
      var mins = (L.exam && L.exam.readingMinutes) || 17;
      main.innerHTML = head +
        '<header class="page-head"><h1>試験モード</h1></header>' +
        '<div class="intro-card"><ol class="steps">' +
        '<li><b>聴解（第1〜20題）</b>録音が最初から最後まで流れます（約15分）。各問2回ずつ流れるので、聞きながら答えを選んでください。答えはあとから変えられます。</li>' +
        '<li><b>読解（第21〜40題）</b>制限時間は' + mins + '分です。時間になると自動で提出されます。</li>' +
        '<li><b>結果</b>1問5点、聴解100点＋読解100点＝200点満点です。<b>' + ((L.scoring && L.scoring.pass) || 120) + '点以上</b>で合格ラインです。全問の正解と解説も確認できます。</li></ol>' +
        '<p class="note">試験中は正解・不正解は表示されません。途中でページを閉じても、答えと再生位置は保存されます。イヤホンの使用をおすすめします。</p>' +
        '<button type="button" class="btn btn-primary btn-lg" data-act="exam-start">▶ 聴解を開始する</button></div>';
      return;
    }
    if (exam.status === 'done') return viewResult(t, exam, head);

    var phase = exam.status; // listening | reading
    var list = sectionsOf(t).filter(function (s) { return s.def.kind === phase; }).map(function (s) {
      return '<section class="exam-sec" id="sec-' + s.def.id + '"><h2 class="sec-title">' + esc(s.def.title) + '<small>' + esc(s.def.range || '') + '</small></h2>' +
        '<p class="instr">' + esc(s.def.instruction || '') + '</p>' +
        s.sec.questions.map(function (q) { return renderQ({ t: t, def: s.def, sec: s.sec, q: q, mode: 'exam', chosen: exam.answers[q.no] }); }).join('') +
        '</section>';
    }).join('');

    var bar = phase === 'listening'
      ? '<div class="exam-bar" id="exam-bar"><div class="eb-main"><span class="eb-phase">聴解</span><span class="eb-now" id="eb-now">—</span></div>' +
        '<div class="eb-side"><label class="chk"><input type="checkbox" id="chk-autoscroll"' + (settings.autoscroll ? ' checked' : '') + '> 自動スクロール</label>' +
        '<span class="eb-count" id="eb-count"></span></div></div><div id="exam-ctl" class="exam-ctl"></div>'
      : '<div class="exam-bar" id="exam-bar"><div class="eb-main"><span class="eb-phase">読解</span><span class="eb-timer" id="eb-timer">--:--</span></div>' +
        '<div class="eb-side"><span class="eb-count" id="eb-count"></span></div></div>';
    var foot = phase === 'listening'
      ? '<div class="exam-foot"><button type="button" class="btn btn-primary" data-act="to-reading">聴解を終えて読解へ進む</button></div>'
      : '<div class="exam-foot"><button type="button" class="btn btn-primary btn-lg" data-act="submit">解答を提出する</button></div>';

    main.innerHTML = head + '<header class="page-head"><h1>試験モード<small>' + (phase === 'listening' ? '聴解' : '読解') + '</small></h1></header>' +
      bar + list + foot;
    updateExamCount();
    if (phase === 'listening') { updateExamCtl(); updateActive(); }
    else startTimer();
  }

  function updateExamCount() {
    var el = document.getElementById('eb-count');
    if (!el || !cur || cur.view !== 'exam') return;
    var phase = cur.exam.status, n = 0, tot = 0;
    sectionsOf(cur.t).forEach(function (s) {
      if (s.def.kind !== phase) return;
      s.sec.questions.forEach(function (q) { tot++; if (cur.exam.answers[q.no] != null) n++; });
    });
    el.textContent = '解答済み ' + n + '/' + tot;
  }

  function examAudioItem(t, startAt) {
    return { key: 'exam:' + t.id, src: audioSrc(t, t.fullAudio && t.fullAudio.file), label: t.title + '　聴解（全体）', startAt: startAt || 0 };
  }

  /* 听力控制区：从头播放 / 从保存位置继续 / 播放结束 */
  function updateExamCtl() {
    var el = document.getElementById('exam-ctl');
    if (!el || !cur || cur.view !== 'exam') return;
    var t = cur.t, st = P.state(), mine = P.isKey('exam:' + t.id);
    if (!t.fullAudio || !t.fullAudio.file) { el.innerHTML = '<p class="warn-box">この試験には聴解の録音がありません。</p>'; return; }
    if (mine && (st === 'playing' || st === 'loading')) { el.innerHTML = ''; return; }
    if (mine && st === 'ended') {
      el.innerHTML = '<div class="ctl-card done"><span><b>聴解の録音が終わりました。</b>答えを確認したら読解に進みましょう。</span>' +
        '<button type="button" class="btn btn-primary" data-act="to-reading-now">読解へ進む →</button></div>';
      return;
    }
    if (mine && st === 'paused') {
      el.innerHTML = '<div class="ctl-card"><span>一時停止中です。</span><button type="button" class="btn btn-primary" data-act="exam-resume">▶ 再開する</button></div>';
      return;
    }
    if (mine && st === 'error') {
      el.innerHTML = '<div class="ctl-card warn"><span>録音を再生できませんでした。ファイルがそろっているか確認してください。</span>' +
        '<button type="button" class="btn btn-ghost" data-act="exam-play">もう一度試す</button></div>';
      return;
    }
    var pos = cur.exam.pos || 0;
    el.innerHTML = '<div class="ctl-card">' + (pos > 3
      ? '<span>前回は <b>' + fmtTime(pos) + '</b> まで聞きました。</span><button type="button" class="btn btn-primary" data-act="exam-play">▶ 続きから再生</button>' +
        '<button type="button" class="btn btn-ghost" data-act="exam-restart">最初から</button>'
      : '<span>準備ができたら録音を再生してください。</span><button type="button" class="btn btn-primary" data-act="exam-play">▶ 聴解の録音を再生</button>') + '</div>';
  }

  /* 根据整段录音的播放位置，找出「现在是第几题」 */
  function examPosition(t, sec) {
    var fa = t.fullAudio || {}, parts = fa.parts || {};
    var res = { part: null, q: null };
    sectionsOf(t).forEach(function (s) {
      if (s.def.kind !== 'listening') return;
      if (parts[s.def.id] != null && sec >= parts[s.def.id]) res.part = s.def;
      s.sec.questions.forEach(function (q) { if (q.t && sec >= q.t[0] - 1) res.q = q; });
    });
    if (res.q && res.part && parts[res.part.id] != null && res.q.t[0] < parts[res.part.id]) res.q = null; // 新部分的说明阶段
    if (fa.end && sec >= fa.end) { res.q = null; res.part = null; res.end = true; }
    return res;
  }

  function updateActive() {
    if (!cur || cur.view !== 'exam' || cur.exam.status !== 'listening') return;
    var t = cur.t, now = document.getElementById('eb-now');
    var mine = P.isKey('exam:' + t.id);
    var sec = mine ? P.time().t : (cur.exam.pos || 0);
    var p = examPosition(t, sec);
    var label = !mine && sec < 1 ? '再生前' : p.end ? '聴解終了' : p.q ? '第' + p.q.no + '題' : p.part ? esc(p.part.title) + '　説明・例題' : '開始の案内';
    if (now) now.innerHTML = label;
    var no = p.q ? p.q.no : null;
    if (no !== cur.active) {
      var old = cur.active != null && document.getElementById('q-' + cur.active);
      if (old) old.classList.remove('is-active');
      cur.active = no;
      var el = no != null && document.getElementById('q-' + no);
      if (el) {
        el.classList.add('is-active');
        if (settings.autoscroll && mine && P.state() === 'playing') el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  var timerId = null;
  function startTimer() {
    stopTimer();
    var L = levelOf(cur.t) || {};
    if (!cur.exam.deadline) { cur.exam.deadline = Date.now() + ((L.exam && L.exam.readingMinutes) || 17) * 60000; saveExam(); }
    var tick = function () {
      if (!cur || cur.view !== 'exam' || cur.exam.status !== 'reading') return stopTimer();
      var left = Math.max(0, Math.round((cur.exam.deadline - Date.now()) / 1000));
      var el = document.getElementById('eb-timer');
      if (el) { el.textContent = '残り ' + fmtTime(left); el.classList.toggle('low', left <= 120); }
      if (left <= 0) { stopTimer(); finishExam(true); }
    };
    tick();
    timerId = setInterval(tick, 1000);
  }
  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

  function toReading() {
    if (P.isKey('exam:' + cur.t.id)) P.stop();
    cur.exam.status = 'reading';
    cur.exam.deadline = null;
    saveExam();
    viewExam(cur.t);
    window.scrollTo(0, 0);
  }
  function finishExam(auto) {
    stopTimer();
    cur.exam.status = 'done';
    cur.exam.finishedAt = Date.now();
    cur.exam.autoSubmitted = !!auto;
    saveExam();
    viewExam(cur.t);
    window.scrollTo(0, 0);
  }

  function viewResult(t, exam, head) {
    var sc = scoreExam(t, exam.answers);
    var L = levelOf(t) || {}, scg = L.scoring || {};
    var rows = sc.bySec.map(function (b) {
      return '<tr><th>' + esc(b.def.title) + '</th><td>' + b.correct + ' / ' + b.total + '</td><td><span class="mini-meter"><i style="width:' + Math.round(b.correct / b.total * 100) + '%"></i></span></td></tr>';
    }).join('');
    var review = sectionsOf(t).map(function (s) {
      return '<section class="exam-sec"><h3 class="sec-title">' + esc(s.def.title) + '<small>' + esc(s.def.range || '') + '</small></h3>' +
        s.sec.questions.map(function (q) { return renderQ({ t: t, def: s.def, sec: s.sec, q: q, mode: 'review', chosen: exam.answers[q.no] }); }).join('') + '</section>';
    }).join('');
    main.innerHTML = head +
      '<header class="page-head"><h1>試験モードの結果</h1></header>' +
      (exam.autoSubmitted ? '<p class="note">読解の制限時間になったため、自動で提出しました。</p>' : '') +
      '<div class="result-card ' + (sc.pass ? 'pass' : 'fail') + '">' +
      '<div class="rc-total"><span class="rc-num">' + sc.total + '</span><span class="rc-max"> / ' + sc.max + ' 点</span></div>' +
      '<div class="rc-verdict">' + (sc.pass ? '合格ライン（' + sc.passLine + '点）に到達しました！ 恭喜！' : '合格ライン（' + sc.passLine + '点）まであと ' + (sc.passLine - sc.total) + ' 点。加油！') + '</div>' +
      '<div class="rc-split"><div><span>聴解</span><b>' + sc.listening + '</b><small> / ' + (scg.listening || 100) + '</small></div>' +
      '<div><span>読解</span><b>' + sc.reading + '</b><small> / ' + (scg.reading || 100) + '</small></div></div></div>' +
      '<table class="sec-table"><tbody>' + rows + '</tbody></table>' +
      '<div class="toolbar"><label class="chk"><input type="checkbox" id="chk-wrong"> 間違えた問題だけ表示</label><span class="spacer"></span>' +
      '<button type="button" class="btn btn-ghost" data-act="exam-reset">もう一度受験する</button></div>' +
      '<div id="review">' + review + '</div>';
    syncPlayButtons();
  }

  /* ---------- 7. 底部播放器 ---------- */
  var bar = {
    root: document.getElementById('playerbar'),
    toggle: document.getElementById('pb-toggle'),
    stop: document.getElementById('pb-stop'),
    status: document.getElementById('pb-status'),
    label: document.getElementById('pb-label'),
    time: document.getElementById('pb-time'),
    seek: document.getElementById('pb-seek'),
    rate: document.getElementById('pb-rate')
  };
  var seeking = false;

  function updateBar() {
    var st = P.state(), c = P.current();
    bar.root.setAttribute('data-state', st);
    bar.status.textContent = P.LABEL[st] || st;
    bar.label.textContent = c ? c.label : '音声を選んでください';
    bar.toggle.disabled = !c;
    bar.stop.disabled = !c || st === 'idle' || st === 'stopped';
    var playing = st === 'playing' || st === 'loading';
    bar.toggle.setAttribute('aria-label', playing ? '一時停止' : '再生');
    bar.toggle.classList.toggle('is-playing', playing);
  }
  function updateTime() {
    var tm = P.time();
    bar.time.textContent = fmtTime(tm.t) + ' / ' + fmtTime(tm.d);
    if (!seeking) bar.seek.value = tm.d ? Math.round(tm.t / tm.d * 1000) : 0;
    bar.seek.disabled = !tm.d;
  }

  function syncPlayButtons() {
    var c = P.current(), st = P.state();
    var btns = main.querySelectorAll('button.play[data-key]');
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i], mine = c && b.getAttribute('data-key') === c.key;
      var s = mine ? st : 'idle';
      b.setAttribute('data-state', s);
      var tx = { playing: '再生中', paused: '一時停止中', loading: '読み込み中', ended: 'もう一度', error: '再生できません' }[s] || '再生';
      b.querySelector('.play-tx').textContent = tx;
      b.setAttribute('aria-label', (s === 'playing' ? '一時停止（再生中）' : s === 'paused' ? '続きを再生（一時停止中）' : '再生') + '：' + b.getAttribute('data-label'));
      var card = b.closest('.q');
      if (card) card.classList.toggle('is-playing', s === 'playing' || s === 'loading');
    }
  }

  P.on(function (type) {
    if (type === 'state') { updateBar(); syncPlayButtons(); if (cur && cur.view === 'exam') { updateExamCtl(); updateActive(); } }
    if (type === 'time') {
      updateTime();
      if (cur && cur.view === 'exam' && P.isKey('exam:' + cur.t.id)) {
        var tt = P.time().t;
        if (tt > 0) cur.exam.pos = tt;
        if (Date.now() - cur.lastSave > 2000) { cur.lastSave = Date.now(); saveExam(); }
        updateActive();
      }
    }
  });

  bar.toggle.addEventListener('click', function () { var c = P.current(); if (c) P.toggle(c); });
  bar.stop.addEventListener('click', function () { P.stop(); });
  bar.seek.addEventListener('input', function () { seeking = true; });
  bar.seek.addEventListener('change', function () { P.seekFraction(bar.seek.value / 1000); seeking = false; });
  bar.rate.addEventListener('change', function () {
    settings.rate = Number(bar.rate.value) || 1; saveSettings(); P.setRate(settings.rate);
  });

  /* ---------- 8. 事件、路由与启动 ---------- */
  function playCurrentClip() {
    var b = document.querySelector('#pcard button.play[data-key]');
    if (b) P.toggle({ key: b.getAttribute('data-key'), src: b.getAttribute('data-src'), label: b.getAttribute('data-label') });
  }

  function onPracticeAct(act, el) {
    var s = cur.s, t = cur.t;
    if (act === 'choose') {
      var no = Number(el.getAttribute('data-no'));
      if (no !== s.list[s.i] || s.solved[no]) return;
      var q = qIndex(t)[no].q, L = el.getAttribute('data-choice');
      var w = s.wrong[no] || (s.wrong[no] = []);
      if (!w.length && s.first[no] == null) {      // 这一轮第一次作答 → 记入练习记录
        s.first[no] = L;
        practice[pkey(t, no)] = L;
        savePractice();
      }
      if (L === q.answer) { s.solved[no] = true; cur.msg = w.length ? null : praise(); }
      else if (w.indexOf(L) < 0) w.push(L);
      saveSession();
      rerenderCard();
      var target = document.querySelector(s.solved[no] ? '#pcard [data-act="next"]' : '#pcard .choice.is-target');
      if (target) { target.focus({ preventScroll: true }); }
      var fb = document.querySelector('#pcard .fb');
      if (fb) fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
    if (act === 'next') {
      if (!s.solved[s.list[s.i]]) return;
      s.i++; cur.msg = null;
      saveSession();
      P.stop();
      renderCurrent();
      window.scrollTo(0, 0);
      if (s.i < s.list.length && settings.autoplay && qIndex(t)[s.list[s.i]].def.kind === 'listening') playCurrentClip();
      var fc = document.querySelector('#pcard .choice:not([disabled])');
      if (fc) fc.focus({ preventScroll: true });
      return;
    }
    if (act === 'order') {
      var o = el.getAttribute('data-order');
      if (o === settings.order) return;
      settings.order = o; saveSettings();
      cur.s = newSession(t, cur.info.scope, cur.info.nos); saveSession();
      P.stop();
      viewPractice(t, cur.info.scope);
      return;
    }
    if (act === 'restart') {
      var started = s.i > 0 || Object.keys(s.wrong).length || Object.keys(s.solved).length;
      if (started && !armConfirm(el, 'もう一度押すと最初から')) return;
      act = 'restart-now';
    }
    if (act === 'restart-now') {
      cur.s = newSession(t, cur.info.scope, cur.info.nos); saveSession();
      P.stop(); renderCurrent(); window.scrollTo(0, 0);
      return;
    }
    if (act === 'retry-missed') {
      var idx = qIndex(t);
      var missed = s.list.filter(function (n) { return s.first[n] !== idx[n].q.answer; });
      cur.s = newSession(t, cur.info.scope, missed); saveSession();
      P.stop(); renderCurrent(); window.scrollTo(0, 0);
    }
  }

  function onExamAct(act, el) {
    var t = cur.t;
    if (act === 'choose') {
      var no = el.getAttribute('data-no'), C = el.getAttribute('data-choice');
      if (cur.exam.answers[no] === C) delete cur.exam.answers[no];   // 再点一次取消
      else cur.exam.answers[no] = C;
      saveExam();
      var card = el.closest('.q');
      var bs = card.querySelectorAll('.choice');
      for (var i = 0; i < bs.length; i++) {
        var on = bs[i].getAttribute('data-choice') === cur.exam.answers[no];
        bs[i].classList.toggle('is-chosen', on);
        bs[i].setAttribute('aria-pressed', String(on));
      }
      card.classList.toggle('q-done', cur.exam.answers[no] != null);
      var fillIn = card.querySelector('.blank-in');
      if (fillIn) {
        var x = qIndex(t)[no], ch = cur.exam.answers[no];
        fillIn.innerHTML = ch && x && x.sec.options && x.sec.options[ch] ? '<span class="fill">' + U.rubyHtml(x.sec.options[ch].text) + '</span>' : '&emsp;&emsp;';
      }
      updateExamCount();
      return;
    }
    if (act === 'exam-start') {
      cur.exam = { status: 'listening', answers: {}, pos: 0, startedAt: Date.now() };
      saveExam();
      viewExam(t);
      P.load(examAudioItem(t, 0), true);
      return;
    }
    if (act === 'exam-play') { P.load(examAudioItem(t, cur.exam.pos || 0), true); return; }
    if (act === 'exam-restart') { cur.exam.pos = 0; saveExam(); P.load(examAudioItem(t, 0), true); return; }
    if (act === 'exam-resume') { P.resume(); return; }
    if (act === 'to-reading-now') { toReading(); return; }
    if (act === 'to-reading') {
      if (!(P.isKey('exam:' + t.id) && P.state() === 'ended') && !armConfirm(el, '録音の途中です。もう一度押すと読解へ進みます')) return;
      toReading();
      return;
    }
    if (act === 'submit') {
      if (!armConfirm(el, 'もう一度押すと提出します（変更できなくなります）')) return;
      finishExam(false);
      return;
    }
    if (act === 'exam-reset') {
      if (!armConfirm(el, 'もう一度押すと前回の結果を消して始めます')) return;
      store.del(examKey(t));
      viewExam(t);
      window.scrollTo(0, 0);
    }
  }

  main.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-act]');
    if (!el || !main.contains(el) || el.disabled) return;
    var act = el.getAttribute('data-act');
    if (act === 'play') {
      P.toggle({ key: el.getAttribute('data-key'), src: el.getAttribute('data-src'), label: el.getAttribute('data-label') });
      return;
    }
    if (act === 'reset-all') {
      if (!armConfirm(el, 'もう一度押すと練習記録を消去します')) return;
      var tid = el.getAttribute('data-test');
      Object.keys(practice).forEach(function (k) { if (k.indexOf(tid + ':') === 0) delete practice[k]; });
      savePractice();
      try {
        for (var i = localStorage.length - 1; i >= 0; i--) {
          var k = localStorage.key(i);
          if (k && k.indexOf(KEY_SESS + tid + '.') === 0) localStorage.removeItem(k);
        }
      } catch (e) {}
      viewHome();
      return;
    }
    if (!cur) return;
    if (cur.view === 'practice') onPracticeAct(act, el);
    else if (cur.view === 'exam') onExamAct(act, el);
  });

  main.addEventListener('change', function (ev) {
    var tg = ev.target;
    if (tg.id === 'chk-autoscroll') { settings.autoscroll = tg.checked; saveSettings(); }
    if (tg.id === 'chk-autoplay') { settings.autoplay = tg.checked; saveSettings(); }
    if (tg.id === 'chk-wrong') { var r = document.getElementById('review'); if (r) r.classList.toggle('only-wrong', tg.checked); }
    if (tg.getAttribute('data-setting') === 'order' && tg.checked) {
      settings.order = tg.value === 'random' ? 'random' : 'original'; saveSettings();
      var rs = main.querySelectorAll('input[data-setting="order"]');
      for (var i = 0; i < rs.length; i++) rs[i].checked = rs[i].value === settings.order;
    }
  });

  /* 图片读不到时显示占位 */
  main.addEventListener('error', function (ev) {
    var im = ev.target;
    if (im && im.tagName === 'IMG' && !im.classList.contains('is-broken')) {
      im.classList.add('is-broken');
      im.alt = '画像なし';
      im.removeAttribute('src');
    }
  }, true);

  document.getElementById('btn-pinyin').addEventListener('click', function () { settings.pinyin = !settings.pinyin; saveSettings(); applySettings(); });
  document.getElementById('btn-font-down').addEventListener('click', function () {
    var i = SCALES.indexOf(settings.scale); if (i > 0) { settings.scale = SCALES[i - 1]; saveSettings(); applySettings(); }
  });
  document.getElementById('btn-font-up').addEventListener('click', function () {
    var i = SCALES.indexOf(settings.scale); if (i < SCALES.length - 1) { settings.scale = SCALES[i + 1]; saveSettings(); applySettings(); }
  });

  function viewNotFound() {
    cur = null;
    main.innerHTML = '<div class="warn-box">ページが見つかりません。<a href="#/">トップへ戻る</a></div>';
  }

  function route() {
    /* 切换页面前：保存模拟考试的位置，停止播放 */
    if (cur && cur.view === 'exam') {
      if (P.isKey('exam:' + cur.t.id) && P.time().t > 0) cur.exam.pos = P.time().t;
      if (cur.exam.status === 'listening') saveExam();
    }
    stopTimer();
    P.stop();
    cur = null;

    var h = (location.hash || '').replace(/^#\/?/, '');
    var parts = h.split('/').filter(Boolean).map(function (x) { try { return decodeURIComponent(x); } catch (e) { return x; } });
    if (!parts.length) viewHome();
    else if (parts[0] === 'practice' && HSK.tests[parts[1]]) viewPractice(HSK.tests[parts[1]], parts[2] || 'all');
    else if (parts[0] === 'exam' && HSK.tests[parts[1]]) viewExam(HSK.tests[parts[1]]);
    else viewNotFound();
    try { main.focus({ preventScroll: true }); } catch (e) { main.focus(); }
    window.scrollTo(0, 0);
  }

  /* 启动 */
  bar.rate.value = String(settings.rate);
  P.setRate(settings.rate);
  applySettings();
  updateBar(); updateTime();
  window.addEventListener('hashchange', route);
  window.addEventListener('pagehide', function () {
    if (cur && cur.view === 'exam' && P.isKey('exam:' + cur.t.id)) { cur.exam.pos = P.time().t; saveExam(); }
  });
  route();
})();
