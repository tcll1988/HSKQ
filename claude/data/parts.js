/* =========================================================
   各级别共用的「部分」说明（同一级别的所有试卷共用）
   - id    : 部分编号（试卷数据 data/Hxxxxx.js 里用同样的 id）
   - type  : 题型（决定网页怎么显示，不要随便改）
   - title / short / instruction : 显示给学生看的日语说明，可以改
   ========================================================= */
var HSK = window.HSK || {};
window.HSK = HSK;

HSK.levels = HSK.levels || {};

HSK.levels['1'] = {
  label: 'HSK 1級',
  sections: [
    { id: 'L1', kind: 'listening', no: 1, type: 'tf-image', short: '写真と音声 ✓✗',
      title: '聴解 第1部分', range: '第1〜5題',
      instruction: '音声を聞いて、写真の内容と合っていれば ✓、合っていなければ ✗ を選んでください。音声は2回流れます。' },
    { id: 'L2', kind: 'listening', no: 2, type: 'pick-image', short: '写真を選ぶ',
      title: '聴解 第2部分', range: '第6〜10題',
      instruction: '音声を聞いて、内容に合う写真を A・B・C から1つ選んでください。音声は2回流れます。' },
    { id: 'L3', kind: 'listening', no: 3, type: 'match-image', short: '会話と写真',
      title: '聴解 第3部分', range: '第11〜15題',
      instruction: '会話を聞いて、内容に合う写真を A〜F から選んでください。例題で使った写真は選べません。音声は2回流れます。' },
    { id: 'L4', kind: 'listening', no: 4, type: 'pick-text', short: '答えを選ぶ',
      title: '聴解 第4部分', range: '第16〜20題',
      instruction: '文と質問を聞いて、答えを A・B・C から1つ選んでください。質問は音声だけで流れます。音声は2回流れます。' },
    { id: 'R1', kind: 'reading', no: 1, type: 'tf-word', short: '写真と語句 ✓✗',
      title: '読解 第1部分', range: '第21〜25題',
      instruction: '写真と語句の意味が合っていれば ✓、合っていなければ ✗ を選んでください。' },
    { id: 'R2', kind: 'reading', no: 2, type: 'match-image', short: '文と写真',
      title: '読解 第2部分', range: '第26〜30題',
      instruction: '文の内容に合う写真を A〜F から選んでください。例題で使った写真は選べません。' },
    { id: 'R3', kind: 'reading', no: 3, type: 'match-text', short: '問いと答え',
      title: '読解 第3部分', range: '第31〜35題',
      instruction: '問いかけに対する答えとして最も適切なものを A〜F から選んでください。例題で使った答えは選べません。' },
    { id: 'R4', kind: 'reading', no: 4, type: 'fill-word', short: '空所補充',
      title: '読解 第4部分', range: '第36〜40題',
      instruction: '（　）に入る語を A〜F から選んでください。例題で使った語は選べません。' }
  ],
  scoring: { perQuestion: 5, listening: 100, reading: 100, total: 200, pass: 120 },
  exam: { listeningMinutes: 15, readingMinutes: 17 }
};
