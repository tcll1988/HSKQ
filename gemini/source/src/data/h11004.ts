import type {
  AudioSegment,
  HskQuestion,
  PartId,
  PartMeta,
  RubyToken,
} from '../types';

export const EXAM_INFO = {
  code: 'H11004',
  titleJa: 'HSK（1級）公式過去問演習',
  officialTitle: '新汉语水平考试 HSK（一级）',
  subtitleJa: '大学生向け中国語リスニング・リーディング学習プラットフォーム',
  publisherJa: '国家漢弁 / 孔子学院本部 作成過去問（H11004）',
  totalQuestions: 40,
  listeningCount: 20,
  readingCount: 20,
  totalScore: 200,
  passScore: 120,
  examMinutes: 35, // リスニング約15分 + 解答用紙記入3分 + リーディング17分
  audioUrl: './assets/audio/H11004.mp3',
  audioDurationSeconds: 877,
};

export const PARTS_META: PartMeta[] = [
  {
    id: 'L1',
    section: 'listening',
    sectionTitleJa: '第1セクション：リスニング（聴力）',
    titleJa: '第1部',
    shortLabelJa: '聴力1',
    subtitleJa: '第1〜5問・音声とイラストの正誤判断',
    questionRange: [1, 5],
    instructionJa:
      '音声は各2回流れます。聞こえた単語・フレーズがイラストの内容と合っていれば「◯ 正しい」、違っていれば「× 誤り」を選んでください。',
    audioIntro: { start: 63.6, end: 106.2 },
  },
  {
    id: 'L2',
    section: 'listening',
    sectionTitleJa: '第1セクション：リスニング（聴力）',
    titleJa: '第2部',
    shortLabelJa: '聴力2',
    subtitleJa: '第6〜10問・短文に合うイラスト選択',
    questionRange: [6, 10],
    instructionJa:
      '音声は各2回流れます。聞こえた中国語の文に最もよく合うイラストを A・B・C の中から1つ選んでください。',
    audioIntro: { start: 195.8, end: 230.8 },
  },
  {
    id: 'L3',
    section: 'listening',
    sectionTitleJa: '第1セクション：リスニング（聴力）',
    titleJa: '第3部',
    shortLabelJa: '聴力3',
    subtitleJa: '第11〜15問・会話とイラストのマッチング',
    questionRange: [11, 15],
    instructionJa:
      '音声は各2回流れます。男女の短い会話を聞き、内容に合うイラストを A〜F から選んでください（C は例題で使用済み）。',
    audioIntro: { start: 365.5, end: 406.9 },
  },
  {
    id: 'L4',
    section: 'listening',
    sectionTitleJa: '第1セクション：リスニング（聴力）',
    titleJa: '第4部',
    shortLabelJa: '聴力4',
    subtitleJa: '第16〜20問・短文と質問の聞き取り',
    questionRange: [16, 20],
    instructionJa:
      '音声は各2回流れます。短文の後に続く質問を聞き、正しい答えを A・B・C の選択肢から選んでください。',
    audioIntro: { start: 599.6, end: 652.6 },
  },
  {
    id: 'R1',
    section: 'reading',
    sectionTitleJa: '第2セクション：リーディング（読解）',
    titleJa: '第1部',
    shortLabelJa: '読解1',
    subtitleJa: '第21〜25問・イラストと単語の正誤判断',
    questionRange: [21, 25],
    instructionJa:
      'イラストと中国語の単語を見て、意味が一致していれば「◯ 正しい」、一致していなければ「× 誤り」を選んでください。',
  },
  {
    id: 'R2',
    section: 'reading',
    sectionTitleJa: '第2セクション：リーディング（読解）',
    titleJa: '第2部',
    shortLabelJa: '読解2',
    subtitleJa: '第26〜30問・文とイラストのマッチング',
    questionRange: [26, 30],
    instructionJa:
      '中国語の文を読み、内容に最も合うイラストを A〜F の中から選んでください（E は例題で使用済み）。',
  },
  {
    id: 'R3',
    section: 'reading',
    sectionTitleJa: '第2セクション：リーディング（読解）',
    titleJa: '第3部',
    shortLabelJa: '読解3',
    subtitleJa: '第31〜35問・質問と応答のペアリング',
    questionRange: [31, 35],
    instructionJa:
      '各問題の問いかけに対して、最も自然な返答を A〜F の中から選んでください（F は例題で使用済み）。',
  },
  {
    id: 'R4',
    section: 'reading',
    sectionTitleJa: '第2セクション：リーディング（読解）',
    titleJa: '第4部',
    shortLabelJa: '読解4',
    subtitleJa: '第36〜40問・空欄補充（語句選択）',
    questionRange: [36, 40],
    instructionJa:
      '語群 A〜F の中から、文中の（　）に当てはまる最も適切な単語を選んでください（D は例題で使用済み）。',
  },
];

export const L3_IMAGES: {
  label: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  image: string;
  alt: string;
  isExample?: boolean;
}[] = [
  { label: 'A', image: './assets/images/L3_A.png', alt: '白衣を着てカルテを持つ男性医師' },
  { label: 'B', image: './assets/images/L3_B.png', alt: '空を飛ぶ旅客機' },
  { label: 'C', image: './assets/images/L3_C.png', alt: '笑顔で握手する2人（例題）', isExample: true },
  { label: 'D', image: './assets/images/L3_D.png', alt: 'タクシーの中で電話する男性' },
  { label: 'E', image: './assets/images/L3_E.png', alt: '談笑している友人グループ' },
  { label: 'F', image: './assets/images/L3_F.png', alt: '果物を囲む男女' },
];

export const R2_IMAGES: {
  label: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  image: string;
  alt: string;
  isExample?: boolean;
}[] = [
  { label: 'A', image: './assets/images/R2_A.png', alt: '雨の中で傘をさしてコートを着る女性' },
  { label: 'B', image: './assets/images/R2_B.png', alt: 'スーパーでカートを押して買い物する男性' },
  { label: 'C', image: './assets/images/R2_C.png', alt: 'カメラで女性の写真を撮っている場面' },
  { label: 'D', image: './assets/images/R2_D.png', alt: '会議テーブルに並ぶ複数の椅子' },
  { label: 'E', image: './assets/images/R2_E.png', alt: '本を読んでいる女性（例題）', isExample: true },
  { label: 'F', image: './assets/images/R2_F.png', alt: '教官の隣で運転を練習する男性' },
];

export const R3_RESPONSES: {
  label: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  tokens: RubyToken[];
  text: string;
  translationJa: string;
  isExample?: boolean;
}[] = [
  {
    label: 'A',
    text: '打电话。',
    translationJa: '電話をかけています。',
    tokens: [
      { hanzi: '打', pinyin: 'Dǎ' },
      { hanzi: '电话', pinyin: 'diànhuà' },
      { hanzi: '。' },
    ],
  },
  {
    label: 'B',
    text: '我没看。',
    translationJa: '私は見ていません。',
    tokens: [
      { hanzi: '我', pinyin: 'Wǒ' },
      { hanzi: '没', pinyin: 'méi' },
      { hanzi: '看', pinyin: 'kàn' },
      { hanzi: '。' },
    ],
  },
  {
    label: 'C',
    text: '桌子上。',
    translationJa: 'テーブルの上です。',
    tokens: [
      { hanzi: '桌子', pinyin: 'Zhuōzi' },
      { hanzi: '上', pinyin: 'shang' },
      { hanzi: '。' },
    ],
  },
  {
    label: 'D',
    text: '没关系。',
    translationJa: '大丈夫ですよ／気にしないでください。',
    tokens: [
      { hanzi: '没', pinyin: 'Méi' },
      { hanzi: '关系', pinyin: 'guānxi' },
      { hanzi: '。' },
    ],
  },
  {
    label: 'E',
    text: '李小姐的。',
    translationJa: '李さんのものです。',
    tokens: [
      { hanzi: '李', pinyin: 'Lǐ' },
      { hanzi: '小姐', pinyin: 'xiǎojiě' },
      { hanzi: '的', pinyin: 'de' },
      { hanzi: '。' },
    ],
  },
  {
    label: 'F',
    text: '好的，谢谢！',
    translationJa: 'はい、ありがとうございます！',
    isExample: true,
    tokens: [
      { hanzi: '好', pinyin: 'Hǎo' },
      { hanzi: '的', pinyin: 'de' },
      { hanzi: '，' },
      { hanzi: '谢谢', pinyin: 'xièxie' },
      { hanzi: '！' },
    ],
  },
];

export const R4_WORD_BANK: {
  label: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  hanzi: string;
  pinyin: string;
  meaningJa: string;
  isExample?: boolean;
}[] = [
  { label: 'A', hanzi: '里', pinyin: 'lǐ', meaningJa: '〜の中' },
  { label: 'B', hanzi: '能', pinyin: 'néng', meaningJa: '〜できる／〜してもよい' },
  { label: 'C', hanzi: '岁', pinyin: 'suì', meaningJa: '〜歳' },
  { label: 'D', hanzi: '名字', pinyin: 'míngzi', meaningJa: '名前', isExample: true },
  { label: 'E', hanzi: '多少', pinyin: 'duōshao', meaningJa: 'いくら／いくつ' },
  { label: 'F', hanzi: '喜欢', pinyin: 'xǐhuan', meaningJa: '好きだ' },
];

export const PART_EXAMPLES = {
  L1: [
    {
      image: './assets/images/L1_ex1.png',
      alt: '笑顔の女性',
      answer: 'T' as const,
      transcript: '很高兴',
      pinyin: 'hěn gāoxìng',
      translationJa: 'とてもうれしい',
      audio: { start: 70.8, end: 78.2 } as AudioSegment,
    },
    {
      image: './assets/images/L1_ex2.png',
      alt: 'ベンチで新聞を読む男性',
      answer: 'F' as const,
      transcript: '看电影',
      pinyin: 'kàn diànyǐng',
      translationJa: '映画を見る（イラストは新聞を読んでいるので ×）',
      audio: { start: 87.7, end: 93.4 } as AudioSegment,
    },
  ],
  L2: {
    options: [
      { label: 'A' as const, image: './assets/images/L2_ex_A.png', alt: '積み重ねた本' },
      { label: 'B' as const, image: './assets/images/L2_ex_B.png', alt: '固定電話' },
      { label: 'C' as const, image: './assets/images/L2_ex_C.png', alt: '赤いリンゴ3つ' },
    ],
    answer: 'A' as const,
    transcript: '这是我的书。',
    pinyin: 'Zhè shì wǒ de shū.',
    translationJa: 'これは私の本です。',
    audio: { start: 203.8, end: 213.4 } as AudioSegment,
  },
  L3: {
    lines: [
      {
        speaker: '女' as const,
        tokens: [
          { hanzi: '你', pinyin: 'Nǐ' },
          { hanzi: '好', pinyin: 'hǎo' },
          { hanzi: '！' },
        ],
      },
      {
        speaker: '男' as const,
        tokens: [
          { hanzi: '你', pinyin: 'Nǐ' },
          { hanzi: '好', pinyin: 'hǎo' },
          { hanzi: '！' },
          { hanzi: '很', pinyin: 'Hěn' },
          { hanzi: '高兴', pinyin: 'gāoxìng' },
          { hanzi: '认识', pinyin: 'rènshi' },
          { hanzi: '你', pinyin: 'nǐ' },
          { hanzi: '。' },
        ],
      },
    ],
    answer: 'C' as const,
    translationJa: '女：こんにちは！／男：こんにちは！お会いできてうれしいです。',
    audio: { start: 373.4, end: 389.0 } as AudioSegment,
  },
  L4: {
    statement: [
      { hanzi: '下午', pinyin: 'Xiàwǔ' },
      { hanzi: '我', pinyin: 'wǒ' },
      { hanzi: '去', pinyin: 'qù' },
      { hanzi: '商店', pinyin: 'shāngdiàn' },
      { hanzi: '，' },
      { hanzi: '我', pinyin: 'wǒ' },
      { hanzi: '想', pinyin: 'xiǎng' },
      { hanzi: '买', pinyin: 'mǎi' },
      { hanzi: '一些', pinyin: 'yìxiē' },
      { hanzi: '水果', pinyin: 'shuǐguǒ' },
      { hanzi: '。' },
    ] as RubyToken[],
    question: [
      { hanzi: '她', pinyin: 'Tā' },
      { hanzi: '下午', pinyin: 'xiàwǔ' },
      { hanzi: '去', pinyin: 'qù' },
      { hanzi: '哪里', pinyin: 'nǎlǐ' },
      { hanzi: '？' },
    ] as RubyToken[],
    options: [
      { label: 'A', tokens: [{ hanzi: '商店', pinyin: 'shāngdiàn' }] },
      { label: 'B', tokens: [{ hanzi: '医院', pinyin: 'yīyuàn' }] },
      { label: 'C', tokens: [{ hanzi: '学校', pinyin: 'xuéxiào' }] },
    ],
    answer: 'A' as const,
    translationJa: '午後、私はお店に行って果物を少し買いたいです。問：彼女は午後どこへ行きますか？',
    audio: { start: 607.6, end: 635.0 } as AudioSegment,
  },
  R1: [
    {
      image: './assets/images/R1_ex1.png',
      alt: 'ノートパソコン',
      wordTokens: [{ hanzi: '电视', pinyin: 'diànshì' }],
      answer: 'F' as const,
      noteJa: 'イラストはパソコン（电脑）であり、テレビ（电视）ではないため ×',
    },
    {
      image: './assets/images/R1_ex2.png',
      alt: '飛行機',
      wordTokens: [{ hanzi: '飞机', pinyin: 'fēijī' }],
      answer: 'T' as const,
      noteJa: 'イラストは飛行機（飞机）で一致しているため ◯',
    },
  ],
  R2: {
    tokens: [
      { hanzi: '我', pinyin: 'Wǒ' },
      { hanzi: '很', pinyin: 'hěn' },
      { hanzi: '喜欢', pinyin: 'xǐhuan' },
      { hanzi: '这', pinyin: 'zhè' },
      { hanzi: '本', pinyin: 'běn' },
      { hanzi: '书', pinyin: 'shū' },
      { hanzi: '。' },
    ] as RubyToken[],
    answer: 'E' as const,
    translationJa: '私はこの本がとても好きです。',
  },
  R3: {
    tokens: [
      { hanzi: '你', pinyin: 'Nǐ' },
      { hanzi: '喝', pinyin: 'hē' },
      { hanzi: '水', pinyin: 'shuǐ' },
      { hanzi: '吗', pinyin: 'ma' },
      { hanzi: '？' },
    ] as RubyToken[],
    answer: 'F' as const,
    translationJa: 'お水を飲みますか？ → はい、ありがとうございます！',
  },
  R4: {
    tokens: [
      { hanzi: '你', pinyin: 'Nǐ' },
      { hanzi: '叫', pinyin: 'jiào' },
      { hanzi: '什么', pinyin: 'shénme' },
      { hanzi: '', isBlank: true },
      { hanzi: '？' },
    ] as RubyToken[],
    answer: 'D' as const,
    translationJa: 'お名前は何ですか？',
  },
};

export const QUESTIONS: HskQuestion[] = [
  // ===================== リスニング第1部 (1-5) =====================
  {
    id: 1,
    section: 'listening',
    part: 'L1',
    image: './assets/images/L1_q01.png',
    answer: 'F',
    audio: { start: 108.8, end: 117.0 },
    transcript: [
      {
        text: '三本书',
        pinyin: 'sān běn shū',
        tokens: [
          { hanzi: '三', pinyin: 'sān' },
          { hanzi: '本', pinyin: 'běn' },
          { hanzi: '书', pinyin: 'shū' },
        ],
      },
    ],
    translationJa: '3冊の本',
    explanationJa:
      '音声は「三本书（sān běn shū＝3冊の本）」と言っていますが、イラストに積み重なっている本をよく数えると「4冊」あります。冊数が一致しないため「×（誤り）」が正解です。',
    tipJa: '量詞「本（běn）」は本・ノートなど冊子状のものを数える定番の単位です。HSK1級ではイラストの「個数」の引っ掛けがよく出ます。',
  },
  {
    id: 2,
    section: 'listening',
    part: 'L1',
    image: './assets/images/L1_q02.png',
    answer: 'F',
    audio: { start: 126.1, end: 133.5 },
    transcript: [
      {
        text: '对不起',
        pinyin: 'duìbuqǐ',
        tokens: [{ hanzi: '对不起', pinyin: 'duìbuqǐ' }],
      },
    ],
    translationJa: 'すみません／ごめんなさい',
    explanationJa:
      '音声は謝罪の挨拶「对不起（ごめんなさい）」ですが、イラストの男性は両手を握りしめて満面の笑みで喜んでいます。表情と意味が合わないため「×（誤り）」が正解です。',
    tipJa: '「对不起（duìbuqǐ）」の「不」は軽声で弱く発音されます。返答は「没关系（méi guānxi＝大丈夫です）」とセットで覚えましょう。',
  },
  {
    id: 3,
    section: 'listening',
    part: 'L1',
    image: './assets/images/L1_q03.png',
    answer: 'T',
    audio: { start: 142.8, end: 150.4 },
    transcript: [
      {
        text: '很漂亮',
        pinyin: 'hěn piàoliang',
        tokens: [
          { hanzi: '很', pinyin: 'hěn' },
          { hanzi: '漂亮', pinyin: 'piàoliang' },
        ],
      },
    ],
    translationJa: 'とてもきれいだ',
    explanationJa:
      '音声は「很漂亮（とてもきれい／美しい）」で、イラストには鮮やかに咲いた赤い花が描かれています。意味が合っているため「◯（正しい）」が正解です。',
    tipJa: '中国語では形容詞述語文の肯定形で、特別な強調がなくても習慣的に「很（hěn）」を前に置くことがよくあります。',
  },
  {
    id: 4,
    section: 'listening',
    part: 'L1',
    image: './assets/images/L1_q04.png',
    answer: 'T',
    audio: { start: 159.7, end: 167.3 },
    transcript: [
      {
        text: '买衣服',
        pinyin: 'mǎi yīfu',
        tokens: [
          { hanzi: '买', pinyin: 'mǎi' },
          { hanzi: '衣服', pinyin: 'yīfu' },
        ],
      },
    ],
    translationJa: '服を買う',
    explanationJa:
      '音声は「买衣服（服を買う）」で、イラストの女性はバッグを肩に掛けてハンガーラックの服を選んでいます。場面が一致するため「◯（正しい）」が正解です。',
    tipJa: '「买（mǎi＝買う・第3声）」と「卖（mài＝売る・第4声）」は声調の違いに注意しましょう。',
  },
  {
    id: 5,
    section: 'listening',
    part: 'L1',
    image: './assets/images/L1_q05.png',
    answer: 'T',
    audio: { start: 176.6, end: 186.5 },
    transcript: [
      {
        text: '二零零八年',
        pinyin: 'èr líng líng bā nián',
        tokens: [
          { hanzi: '二', pinyin: 'èr' },
          { hanzi: '零', pinyin: 'líng' },
          { hanzi: '零', pinyin: 'líng' },
          { hanzi: '八', pinyin: 'bā' },
          { hanzi: '年', pinyin: 'nián' },
        ],
      },
    ],
    translationJa: '2008年',
    explanationJa:
      '音声は「二零零八年（2008年）」と読み上げており、イラストの風船にも「2・0・0・8」の数字が並んでいます。一致するため「◯（正しい）」が正解です。',
    tipJa: '中国語の西暦は「二千八年」ではなく、1桁ずつ「二・零・零・八・年（èr líng líng bā nián）」と読むのがルールです。',
  },

  // ===================== リスニング第2部 (6-10) =====================
  {
    id: 6,
    section: 'listening',
    part: 'L2',
    options: [
      { label: 'A', image: './assets/images/L2_q06_A.png', alt: 'ベビーカーで眠っている赤ちゃん' },
      { label: 'B', image: './assets/images/L2_q06_B.png', alt: 'ベビーチェアで果物を食べている赤ちゃん' },
      { label: 'C', image: './assets/images/L2_q06_C.png', alt: 'サングラスをかけた赤ちゃん' },
    ],
    answer: 'A',
    audio: { start: 233.5, end: 243.0 },
    transcript: [
      {
        text: '他在睡觉呢。',
        pinyin: 'Tā zài shuìjiào ne.',
        tokens: [
          { hanzi: '他', pinyin: 'Tā' },
          { hanzi: '在', pinyin: 'zài' },
          { hanzi: '睡觉', pinyin: 'shuìjiào' },
          { hanzi: '呢', pinyin: 'ne' },
          { hanzi: '。' },
        ],
      },
    ],
    translationJa: '彼は寝ていますよ。',
    explanationJa:
      'キーワードは「睡觉（shuìjiào＝眠る）」。Aはベビーカーでぐっすり寝ている赤ちゃん、Bは食べているところ、Cはサングラス姿なので、正解は A です。',
    tipJa: '「在＋動詞＋呢」は「今ちょうど〜しているところだ」という現在進行を表す超重要文型です。',
  },
  {
    id: 7,
    section: 'listening',
    part: 'L2',
    options: [
      { label: 'A', image: './assets/images/L2_q07_A.png', alt: '笑顔で抱き合う2人' },
      { label: 'B', image: './assets/images/L2_q07_B.png', alt: '機嫌の悪そうな女性と心配そうに話しかける男性' },
      { label: 'C', image: './assets/images/L2_q07_C.png', alt: '楽しそうに携帯電話を見る女性2人' },
    ],
    answer: 'B',
    audio: { start: 257.1, end: 268.5 },
    transcript: [
      {
        text: '你怎么了，不高兴了？',
        pinyin: 'Nǐ zěnme le, bù gāoxìng le?',
        tokens: [
          { hanzi: '你', pinyin: 'Nǐ' },
          { hanzi: '怎么', pinyin: 'zěnme' },
          { hanzi: '了', pinyin: 'le' },
          { hanzi: '，' },
          { hanzi: '不', pinyin: 'bù' },
          { hanzi: '高兴', pinyin: 'gāoxìng' },
          { hanzi: '了', pinyin: 'le' },
          { hanzi: '？' },
        ],
      },
    ],
    translationJa: 'どうしたの、機嫌が悪いの（楽しくないの）？',
    explanationJa:
      'キーワードは「不高兴（うれしくない・機嫌が悪い）」。AとCは楽しそうな様子ですが、Bはふくれっ面で落ち込む女性に男性が声を掛けているため、正解は B です。',
    tipJa: '「怎么了？（zěnme le?）」は「どうしたの？」と相手の様子やトラブルを尋ねる日常頻出表現です。',
  },
  {
    id: 8,
    section: 'listening',
    part: 'L2',
    options: [
      { label: 'A', image: './assets/images/L2_q08_A.png', alt: 'ニット帽をかぶり寒そうに腕を抱える女性' },
      { label: 'B', image: './assets/images/L2_q08_B.png', alt: 'お菓子を食べている女性' },
      { label: 'C', image: './assets/images/L2_q08_C.png', alt: 'タンクトップ姿でタオルで汗を拭く男性' },
    ],
    answer: 'C',
    audio: { start: 282.6, end: 299.0 },
    transcript: [
      {
        text: '太热了，有水吗？我想喝水。',
        pinyin: 'Tài rè le, yǒu shuǐ ma? Wǒ xiǎng hē shuǐ.',
        tokens: [
          { hanzi: '太', pinyin: 'Tài' },
          { hanzi: '热', pinyin: 'rè' },
          { hanzi: '了', pinyin: 'le' },
          { hanzi: '，' },
          { hanzi: '有', pinyin: 'yǒu' },
          { hanzi: '水', pinyin: 'shuǐ' },
          { hanzi: '吗', pinyin: 'ma' },
          { hanzi: '？' },
          { hanzi: '我', pinyin: 'Wǒ' },
          { hanzi: '想', pinyin: 'xiǎng' },
          { hanzi: '喝', pinyin: 'hē' },
          { hanzi: '水', pinyin: 'shuǐ' },
          { hanzi: '。' },
        ],
      },
    ],
    translationJa: '暑すぎます、お水はありますか？水が飲みたいです。',
    explanationJa:
      'キーワードは「太热了（暑すぎる）」。Aは「冷（寒い）」、Bは「吃（食べる）」、Cはタオルで汗を拭いて暑そうにしている男性なので、正解は C です。',
    tipJa: '「太＋形容詞＋了」で「〜すぎる／本当に〜だ」という強い程度を表します（例：太好了＝最高だ）。',
  },
  {
    id: 9,
    section: 'listening',
    part: 'L2',
    options: [
      { label: 'A', image: './assets/images/L2_q09_A.png', alt: '6時ちょうどを指す時計を持つ人物' },
      { label: 'B', image: './assets/images/L2_q09_B.png', alt: '1時10分を指す時計とあくびをする男性' },
      { label: 'C', image: './assets/images/L2_q09_C.png', alt: '11時20分を指す時計を持つ女性' },
    ],
    answer: 'B',
    audio: { start: 313.1, end: 327.0 },
    transcript: [
      {
        text: '现在是下午一点十分。',
        pinyin: 'Xiànzài shì xiàwǔ yì diǎn shí fēn.',
        tokens: [
          { hanzi: '现在', pinyin: 'Xiànzài' },
          { hanzi: '是', pinyin: 'shì' },
          { hanzi: '下午', pinyin: 'xiàwǔ' },
          { hanzi: '一', pinyin: 'yì' },
          { hanzi: '点', pinyin: 'diǎn' },
          { hanzi: '十', pinyin: 'shí' },
          { hanzi: '分', pinyin: 'fēn' },
          { hanzi: '。' },
        ],
      },
    ],
    translationJa: '今は午後1時10分です。',
    explanationJa:
      '音声の時刻は「下午一点十分（午後1時10分）」。時計の針を確認すると、Aは6:00、Bは短針が1・長針が2（1:10）、Cは11:20なので、正解は B です。',
    tipJa: '日本語の「〜時」にあたる中国語は「〜点（diǎn）」です。「1時10分」＝「一点十分」。イラストを拡大して針を確認することもできます。',
  },
  {
    id: 10,
    section: 'listening',
    part: 'L2',
    options: [
      { label: 'A', image: './assets/images/L2_q10_A.png', alt: 'スーパーのカートを押す女性' },
      { label: 'B', image: './assets/images/L2_q10_B.png', alt: 'スーツケースを引き腕時計を見る男性' },
      { label: 'C', image: './assets/images/L2_q10_C.png', alt: '紙袋をいくつも持つ女性' },
    ],
    answer: 'B',
    audio: { start: 341.1, end: 351.4 },
    transcript: [
      {
        text: '他去火车站了。',
        pinyin: 'Tā qù huǒchēzhàn le.',
        tokens: [
          { hanzi: '他', pinyin: 'Tā' },
          { hanzi: '去', pinyin: 'qù' },
          { hanzi: '火车站', pinyin: 'huǒchēzhàn' },
          { hanzi: '了', pinyin: 'le' },
          { hanzi: '。' },
        ],
      },
    ],
    translationJa: '彼は駅（鉄道駅）へ行きました。',
    explanationJa:
      'キーワードは「火车站（鉄道駅）」。AとCはいずれも買い物をする女性ですが、Bはスーツケースを引いて腕時計を見ながら移動する男性なので、正解は B です。',
    tipJa: '中国語の「火车（huǒchē）」は日本語の「汽車」に限らず、一般的な長距離鉄道・列車全般を指します。「站（zhàn）」は「駅」。',
  },

  // ===================== リスニング第3部 (11-15) =====================
  {
    id: 11,
    section: 'listening',
    part: 'L3',
    answer: 'A',
    audio: { start: 409.5, end: 436.0 },
    transcript: [
      {
        speaker: '男',
        text: '前面那个医生叫什么名字？',
        pinyin: 'Qiánmiàn nàge yīshēng jiào shénme míngzi?',
        tokens: [
          { hanzi: '前面', pinyin: 'Qiánmiàn' },
          { hanzi: '那个', pinyin: 'nàge' },
          { hanzi: '医生', pinyin: 'yīshēng' },
          { hanzi: '叫', pinyin: 'jiào' },
          { hanzi: '什么', pinyin: 'shénme' },
          { hanzi: '名字', pinyin: 'míngzi' },
          { hanzi: '？' },
        ],
      },
      {
        speaker: '女',
        text: '他？他叫李明。',
        pinyin: 'Tā? Tā jiào Lǐ Míng.',
        tokens: [
          { hanzi: '他', pinyin: 'Tā' },
          { hanzi: '？' },
          { hanzi: '他', pinyin: 'Tā' },
          { hanzi: '叫', pinyin: 'jiào' },
          { hanzi: '李明', pinyin: 'Lǐ Míng' },
          { hanzi: '。' },
        ],
      },
    ],
    translationJa: '男：前のあの医者は何という名前ですか？／女：彼？李明（リー・ミン）と言いますよ。',
    explanationJa:
      '男性のセリフにあるキーワード「前面那个医生（前のあの医者）」が決め手です。「医生（yīshēng）」は「医者・医師」を意味するため、白衣を着てカルテを見ている医師のイラスト A が正解になります（Bは飛行機、Dはタクシー、Eは友人たち、Fは果物なので不適）。',
    tipJa: '「叫什么名字？（何という名前ですか？）」は自己紹介でも定番のフレーズです。',
  },
  {
    id: 12,
    section: 'listening',
    part: 'L3',
    answer: 'D',
    audio: { start: 450.1, end: 476.7 },
    transcript: [
      {
        speaker: '女',
        text: '喂，你回家了？',
        pinyin: 'Wèi, nǐ huí jiā le?',
        tokens: [
          { hanzi: '喂', pinyin: 'Wèi' },
          { hanzi: '，' },
          { hanzi: '你', pinyin: 'nǐ' },
          { hanzi: '回', pinyin: 'huí' },
          { hanzi: '家', pinyin: 'jiā' },
          { hanzi: '了', pinyin: 'le' },
          { hanzi: '？' },
        ],
      },
      {
        speaker: '男',
        text: '没，我在出租车上，我去学校。',
        pinyin: 'Méi, wǒ zài chūzūchē shang, wǒ qù xuéxiào.',
        tokens: [
          { hanzi: '没', pinyin: 'Méi' },
          { hanzi: '，' },
          { hanzi: '我', pinyin: 'wǒ' },
          { hanzi: '在', pinyin: 'zài' },
          { hanzi: '出租车', pinyin: 'chūzūchē' },
          { hanzi: '上', pinyin: 'shang' },
          { hanzi: '，' },
          { hanzi: '我', pinyin: 'wǒ' },
          { hanzi: '去', pinyin: 'qù' },
          { hanzi: '学校', pinyin: 'xuéxiào' },
          { hanzi: '。' },
        ],
      },
    ],
    translationJa: '女：もしもし、もう家に帰った？／男：いや、今タクシーに乗っていて、学校へ行くところだよ。',
    explanationJa:
      '冒頭の「喂（wèi＝もしもし）」から電話の会話だと分かり、さらに男性が「我在出租车上（今タクシーに乗っている）」と答えています。車の後部座席で携帯電話をかけているイラスト D が状況に完全に一致するため正解です。',
    tipJa: '「出租车（chūzūchē）」はタクシー。「在〜上」は車やバスなどの乗り物に「乗っている」状態でもよく使います。',
  },
  {
    id: 13,
    section: 'listening',
    part: 'L3',
    answer: 'B',
    audio: { start: 490.8, end: 510.0 },
    transcript: [
      {
        speaker: '男',
        text: '你坐几点的飞机？',
        pinyin: 'Nǐ zuò jǐ diǎn de fēijī?',
        tokens: [
          { hanzi: '你', pinyin: 'Nǐ' },
          { hanzi: '坐', pinyin: 'zuò' },
          { hanzi: '几', pinyin: 'jǐ' },
          { hanzi: '点', pinyin: 'diǎn' },
          { hanzi: '的', pinyin: 'de' },
          { hanzi: '飞机', pinyin: 'fēijī' },
          { hanzi: '？' },
        ],
      },
      {
        speaker: '女',
        text: '上午九点。',
        pinyin: 'Shàngwǔ jiǔ diǎn.',
        tokens: [
          { hanzi: '上午', pinyin: 'Shàngwǔ' },
          { hanzi: '九', pinyin: 'jiǔ' },
          { hanzi: '点', pinyin: 'diǎn' },
          { hanzi: '。' },
        ],
      },
    ],
    translationJa: '男：何時の飛行機に乗りますか？／女：午前9時です。',
    explanationJa:
      '男性が「你坐几点的飞机？（何時の飛行機に乗りますか？）」と尋ねています。「飞机（fēijī）」は「飛行機」を意味するため、空を飛んでいる旅客機のイラスト B が正解になります。',
    tipJa: '「坐（zuò）」は「座る」だけでなく、飛行機・電車・タクシーなどの乗り物に「乗る」という意味でも使います。',
  },
  {
    id: 14,
    section: 'listening',
    part: 'L3',
    answer: 'F',
    audio: { start: 524.1, end: 546.0 },
    transcript: [
      {
        speaker: '女',
        text: '谢谢你的水果。',
        pinyin: 'Xièxie nǐ de shuǐguǒ.',
        tokens: [
          { hanzi: '谢谢', pinyin: 'Xièxie' },
          { hanzi: '你', pinyin: 'nǐ' },
          { hanzi: '的', pinyin: 'de' },
          { hanzi: '水果', pinyin: 'shuǐguǒ' },
          { hanzi: '。' },
        ],
      },
      {
        speaker: '男',
        text: '不客气。你多吃苹果。',
        pinyin: 'Bú kèqi. Nǐ duō chī píngguǒ.',
        tokens: [
          { hanzi: '不', pinyin: 'Bú' },
          { hanzi: '客气', pinyin: 'kèqi' },
          { hanzi: '。' },
          { hanzi: '你', pinyin: 'Nǐ' },
          { hanzi: '多', pinyin: 'duō' },
          { hanzi: '吃', pinyin: 'chī' },
          { hanzi: '苹果', pinyin: 'píngguǒ' },
          { hanzi: '。' },
        ],
      },
    ],
    translationJa: '女：果物をありがとう。／男：どういたしまして。リンゴをたくさん食べてね。',
    explanationJa:
      '女性が「水果（shuǐguǒ＝果物）」のお礼を言い、男性が「苹果（píngguǒ＝リンゴ）」をたくさん食べてと返しています。テーブルの上に果物が並んでいる男女のイラスト F が会話の内容にぴったり合うため正解です。',
    tipJa: '「谢谢（ありがとう）」に対する定番の返答が「不客气（どういたしまして）」です。「多＋動詞」は「たくさん〜してね」と勧める表現。',
  },
  {
    id: 15,
    section: 'listening',
    part: 'L3',
    answer: 'E',
    audio: { start: 560.1, end: 585.5 },
    transcript: [
      {
        speaker: '男',
        text: '这些人是谁？',
        pinyin: 'Zhèxiē rén shì shéi?',
        tokens: [
          { hanzi: '这些', pinyin: 'Zhèxiē' },
          { hanzi: '人', pinyin: 'rén' },
          { hanzi: '是', pinyin: 'shì' },
          { hanzi: '谁', pinyin: 'shéi' },
          { hanzi: '？' },
        ],
      },
      {
        speaker: '女',
        text: '他们都是我在中国认识的朋友。',
        pinyin: 'Tāmen dōu shì wǒ zài Zhōngguó rènshi de péngyou.',
        tokens: [
          { hanzi: '他们', pinyin: 'Tāmen' },
          { hanzi: '都', pinyin: 'dōu' },
          { hanzi: '是', pinyin: 'shì' },
          { hanzi: '我', pinyin: 'wǒ' },
          { hanzi: '在', pinyin: 'zài' },
          { hanzi: '中国', pinyin: 'Zhōngguó' },
          { hanzi: '认识', pinyin: 'rènshi' },
          { hanzi: '的', pinyin: 'de' },
          { hanzi: '朋友', pinyin: 'péngyou' },
          { hanzi: '。' },
        ],
      },
    ],
    translationJa: '男：この人たちは誰ですか？／女：みんな私が中国で知り合った友達です。',
    explanationJa:
      '「这些人（この人たち）」や「他们都（彼らみんな）」という複数表現、さらに「朋友（友達）」という単語がポイントです。複数の友人たちが集まって談笑しているイラスト E が唯一該当するため正解になります。',
    tipJa: '「认识（rènshi）」は日本語の「認識」よりも身近で、「（人と）知り合う・面識がある」という意味で非常によく使います。',
  },

  // ===================== リスニング第4部 (16-20) =====================
  {
    id: 16,
    section: 'listening',
    part: 'L4',
    answer: 'C',
    audio: { start: 655.2, end: 676.2 },
    options: [
      { label: 'A', text: '后天', meaningJa: 'あさって', tokens: [{ hanzi: '后天', pinyin: 'hòutiān' }] },
      {
        label: 'B',
        text: '下个星期',
        meaningJa: '来週',
        tokens: [
          { hanzi: '下', pinyin: 'xià' },
          { hanzi: '个', pinyin: 'ge' },
          { hanzi: '星期', pinyin: 'xīngqī' },
        ],
      },
      {
        label: 'C',
        text: '下个月',
        meaningJa: '来月',
        tokens: [
          { hanzi: '下', pinyin: 'xià' },
          { hanzi: '个', pinyin: 'ge' },
          { hanzi: '月', pinyin: 'yuè' },
        ],
      },
    ],
    transcript: [
      {
        text: '下个月，我去北京。',
        pinyin: 'Xià ge yuè, wǒ qù Běijīng.',
        tokens: [
          { hanzi: '下', pinyin: 'Xià' },
          { hanzi: '个', pinyin: 'ge' },
          { hanzi: '月', pinyin: 'yuè' },
          { hanzi: '，' },
          { hanzi: '我', pinyin: 'wǒ' },
          { hanzi: '去', pinyin: 'qù' },
          { hanzi: '北京', pinyin: 'Běijīng' },
          { hanzi: '。' },
        ],
      },
      {
        speaker: '問',
        text: '他什么时候去北京？',
        pinyin: 'Tā shénme shíhou qù Běijīng?',
        tokens: [
          { hanzi: '他', pinyin: 'Tā' },
          { hanzi: '什么', pinyin: 'shénme' },
          { hanzi: '时候', pinyin: 'shíhou' },
          { hanzi: '去', pinyin: 'qù' },
          { hanzi: '北京', pinyin: 'Běijīng' },
          { hanzi: '？' },
        ],
      },
    ],
    translationJa: '来月、私は北京へ行きます。問：彼はいつ北京へ行きますか？',
    explanationJa:
      '本文の冒頭で「下个月，我去北京。（来月、北京へ行きます）」と時期を明言しており、質問は「什么时候（いつ）」を尋ねています。A（后天＝あさって）、B（下个星期＝来週）はいずれも本文と異なるため、C（下个月＝来月）が正解です。',
    tipJa: '「上个〜（前の〜）」と「下个〜（次の〜）」の対比を覚えましょう（上个月＝先月、下个月＝来月、下个星期＝来週）。',
  },
  {
    id: 17,
    section: 'listening',
    part: 'L4',
    answer: 'A',
    audio: { start: 690.3, end: 715.6 },
    options: [
      { label: 'A', text: '小学', meaningJa: '小学校', tokens: [{ hanzi: '小学', pinyin: 'xiǎoxué' }] },
      { label: 'B', text: '中学', meaningJa: '中学校', tokens: [{ hanzi: '中学', pinyin: 'zhōngxué' }] },
      { label: 'C', text: '大学', meaningJa: '大学', tokens: [{ hanzi: '大学', pinyin: 'dàxué' }] },
    ],
    transcript: [
      {
        text: '他是小学老师，他有很多学生。',
        pinyin: 'Tā shì xiǎoxué lǎoshī, tā yǒu hěn duō xuésheng.',
        tokens: [
          { hanzi: '他', pinyin: 'Tā' },
          { hanzi: '是', pinyin: 'shì' },
          { hanzi: '小学', pinyin: 'xiǎoxué' },
          { hanzi: '老师', pinyin: 'lǎoshī' },
          { hanzi: '，' },
          { hanzi: '他', pinyin: 'tā' },
          { hanzi: '有', pinyin: 'yǒu' },
          { hanzi: '很', pinyin: 'hěn' },
          { hanzi: '多', pinyin: 'duō' },
          { hanzi: '学生', pinyin: 'xuésheng' },
          { hanzi: '。' },
        ],
      },
      {
        speaker: '問',
        text: '他是哪儿的老师？',
        pinyin: 'Tā shì nǎr de lǎoshī?',
        tokens: [
          { hanzi: '他', pinyin: 'Tā' },
          { hanzi: '是', pinyin: 'shì' },
          { hanzi: '哪儿', pinyin: 'nǎr' },
          { hanzi: '的', pinyin: 'de' },
          { hanzi: '老师', pinyin: 'lǎoshī' },
          { hanzi: '？' },
        ],
      },
    ],
    translationJa: '彼は小学校の先生で、たくさん生徒がいます。問：彼はどこの先生ですか？',
    explanationJa:
      '本文で「他是小学老师（彼は小学校の先生です）」とはっきり述べられています。B（中学）やC（大学）は本文に出てこないため、そのまま一致する A（小学）が正解です。',
    tipJa: '「哪儿（nǎr）」は「どこ」（＝哪里 nǎlǐ）。末尾の r は舌を巻く「アル化」の発音になります。',
  },
  {
    id: 18,
    section: 'listening',
    part: 'L4',
    answer: 'C',
    audio: { start: 729.8, end: 759.0 },
    options: [
      { label: 'A', text: '我', meaningJa: '私', tokens: [{ hanzi: '我', pinyin: 'wǒ' }] },
      { label: 'B', text: '儿子', meaningJa: '息子', tokens: [{ hanzi: '儿子', pinyin: 'érzi' }] },
      {
        label: 'C',
        text: '儿子的同学',
        meaningJa: '息子のクラスメート',
        tokens: [
          { hanzi: '儿子', pinyin: 'érzi' },
          { hanzi: '的', pinyin: 'de' },
          { hanzi: '同学', pinyin: 'tóngxué' },
        ],
      },
    ],
    transcript: [
      {
        text: '他是我儿子的同学，听儿子说，他在医院工作。',
        pinyin: 'Tā shì wǒ érzi de tóngxué, tīng érzi shuō, tā zài yīyuàn gōngzuò.',
        tokens: [
          { hanzi: '他', pinyin: 'Tā' },
          { hanzi: '是', pinyin: 'shì' },
          { hanzi: '我', pinyin: 'wǒ' },
          { hanzi: '儿子', pinyin: 'érzi' },
          { hanzi: '的', pinyin: 'de' },
          { hanzi: '同学', pinyin: 'tóngxué' },
          { hanzi: '，' },
          { hanzi: '听', pinyin: 'tīng' },
          { hanzi: '儿子', pinyin: 'érzi' },
          { hanzi: '说', pinyin: 'shuō' },
          { hanzi: '，' },
          { hanzi: '他', pinyin: 'tā' },
          { hanzi: '在', pinyin: 'zài' },
          { hanzi: '医院', pinyin: 'yīyuàn' },
          { hanzi: '工作', pinyin: 'gōngzuò' },
          { hanzi: '。' },
        ],
      },
      {
        speaker: '問',
        text: '谁在医院工作？',
        pinyin: 'Shéi zài yīyuàn gōngzuò?',
        tokens: [
          { hanzi: '谁', pinyin: 'Shéi' },
          { hanzi: '在', pinyin: 'zài' },
          { hanzi: '医院', pinyin: 'yīyuàn' },
          { hanzi: '工作', pinyin: 'gōngzuò' },
          { hanzi: '？' },
        ],
      },
    ],
    translationJa: '彼は私の息子のクラスメートです。息子の話では、彼は病院で働いているそうです。問：誰が病院で働いていますか？',
    explanationJa:
      '人物関係の整理がカギです。最初の「他（彼）」は「我儿子的同学（息子のクラスメート）」であり、後半の「听儿子说，他在医院工作（息子の話では、彼が病院で働いている）」の「他」も同じ人物を指します。A（私）やB（息子）は病院で働いている本人ではないため、C（儿子的同学）が正解です。',
    tipJa: '「听〜说」で「〜の話によると／〜から聞いたのだが」という伝聞を表します。',
  },
  {
    id: 19,
    section: 'listening',
    part: 'L4',
    answer: 'C',
    audio: { start: 773.1, end: 799.5 },
    options: [
      { label: 'A', text: '星期三', meaningJa: '水曜日', tokens: [{ hanzi: '星期三', pinyin: 'xīngqīsān' }] },
      { label: 'B', text: '星期四', meaningJa: '木曜日', tokens: [{ hanzi: '星期四', pinyin: 'xīngqīsì' }] },
      { label: 'C', text: '星期日', meaningJa: '日曜日', tokens: [{ hanzi: '星期日', pinyin: 'xīngqīrì' }] },
    ],
    transcript: [
      {
        text: '我在那儿住三天，星期天回来，再见。',
        pinyin: 'Wǒ zài nàr zhù sān tiān, xīngqītiān huílai, zàijiàn.',
        tokens: [
          { hanzi: '我', pinyin: 'Wǒ' },
          { hanzi: '在', pinyin: 'zài' },
          { hanzi: '那儿', pinyin: 'nàr' },
          { hanzi: '住', pinyin: 'zhù' },
          { hanzi: '三', pinyin: 'sān' },
          { hanzi: '天', pinyin: 'tiān' },
          { hanzi: '，' },
          { hanzi: '星期天', pinyin: 'xīngqītiān' },
          { hanzi: '回来', pinyin: 'huílai' },
          { hanzi: '，' },
          { hanzi: '再见', pinyin: 'zàijiàn' },
          { hanzi: '。' },
        ],
      },
      {
        speaker: '問',
        text: '他哪天回来？',
        pinyin: 'Tā nǎ tiān huílai?',
        tokens: [
          { hanzi: '他', pinyin: 'Tā' },
          { hanzi: '哪', pinyin: 'nǎ' },
          { hanzi: '天', pinyin: 'tiān' },
          { hanzi: '回来', pinyin: 'huílai' },
          { hanzi: '？' },
        ],
      },
    ],
    translationJa: '私はあそこに3日間泊まって、日曜日に戻ります。さようなら。問：彼はどの曜日に戻りますか？',
    explanationJa:
      'HSK超頻出の言い換え問題です！本文では「星期天回来（日曜日に戻ります）」と言っており、「星期天」は選択肢 C の「星期日」と同じ「日曜日」を意味するため C が正解です。「住三天（3日間泊まる）」は A（星期三＝水曜日）を選ばせる引っ掛けなので注意しましょう。',
    tipJa: '中国語の曜日は月曜＝星期一〜土曜＝星期六、そして日曜だけは「星期天」または「星期日」と言います（星期七はNG！）。',
  },
  {
    id: 20,
    section: 'listening',
    part: 'L4',
    answer: 'A',
    audio: { start: 813.6, end: 839.8 },
    options: [
      {
        label: 'A',
        text: '很好',
        meaningJa: 'とても上手だ',
        tokens: [
          { hanzi: '很', pinyin: 'hěn' },
          { hanzi: '好', pinyin: 'hǎo' },
        ],
      },
      {
        label: 'B',
        text: '不会写',
        meaningJa: '書けない',
        tokens: [
          { hanzi: '不', pinyin: 'bú' },
          { hanzi: '会', pinyin: 'huì' },
          { hanzi: '写', pinyin: 'xiě' },
        ],
      },
      {
        label: 'C',
        text: '不会读',
        meaningJa: '読めない',
        tokens: [
          { hanzi: '不', pinyin: 'bú' },
          { hanzi: '会', pinyin: 'huì' },
          { hanzi: '读', pinyin: 'dú' },
        ],
      },
    ],
    transcript: [
      {
        text: '他的汉语很好，他会写不少汉字。',
        pinyin: 'Tā de Hànyǔ hěn hǎo, tā huì xiě bùshǎo Hànzì.',
        tokens: [
          { hanzi: '他', pinyin: 'Tā' },
          { hanzi: '的', pinyin: 'de' },
          { hanzi: '汉语', pinyin: 'Hànyǔ' },
          { hanzi: '很', pinyin: 'hěn' },
          { hanzi: '好', pinyin: 'hǎo' },
          { hanzi: '，' },
          { hanzi: '他', pinyin: 'tā' },
          { hanzi: '会', pinyin: 'huì' },
          { hanzi: '写', pinyin: 'xiě' },
          { hanzi: '不少', pinyin: 'bùshǎo' },
          { hanzi: '汉字', pinyin: 'Hànzì' },
          { hanzi: '。' },
        ],
      },
      {
        speaker: '問',
        text: '他的汉语怎么样？',
        pinyin: 'Tā de Hànyǔ zěnmeyàng?',
        tokens: [
          { hanzi: '他', pinyin: 'Tā' },
          { hanzi: '的', pinyin: 'de' },
          { hanzi: '汉语', pinyin: 'Hànyǔ' },
          { hanzi: '怎么样', pinyin: 'zěnmeyàng' },
          { hanzi: '？' },
        ],
      },
    ],
    translationJa: '彼の中国語はとても上手で、漢字もかなりたくさん書けます。問：彼の中国語はどうですか？',
    explanationJa:
      '本文の最初に「他的汉语很好（彼の中国語はとても上手だ）」と直接答えが述べられています。後半の「会写不少汉字（少なくない漢字＝たくさんの漢字が書ける）」も肯定的な内容なので、否定の B（書けない）・C（読めない）は誤り、A（很好）が正解です。',
    tipJa: '「不会（bú huì）」の「不」は後ろに第4声（huì）が来るため、第2声（bú）へ声調変化します。',
  },

  // ===================== リーディング第1部 (21-25) =====================
  {
    id: 21,
    section: 'reading',
    part: 'R1',
    image: './assets/images/R1_q21.png',
    wordText: '猫',
    wordTokens: [{ hanzi: '猫', pinyin: 'māo' }],
    answer: 'T',
    translationJa: '猫（ねこ）',
    explanationJa:
      'カゴの中に子猫が2匹入っているイラストで、単語も「猫（māo）」です。意味が一致しているので「◯（正しい）」が正解です。',
    tipJa: '動物の「猫」は第1声の māo。鳴き声の「ミャオ」を連想すると覚えやすいです。',
  },
  {
    id: 22,
    section: 'reading',
    part: 'R1',
    image: './assets/images/R1_q22.png',
    wordText: '四',
    wordTokens: [{ hanzi: '四', pinyin: 'sì' }],
    answer: 'T',
    translationJa: '4（よん）',
    explanationJa:
      'イラストに描かれたキウイはちょうど「4個」あり、単語も「四（sì＝4）」です。数が一致しているので「◯（正しい）」が正解です。',
    tipJa: '「四（sì＝4）」と「十（shí＝10）」はそり舌音と声調の違いに注意しましょう。',
  },
  {
    id: 23,
    section: 'reading',
    part: 'R1',
    image: './assets/images/R1_q23.png',
    wordText: '女儿',
    wordTokens: [{ hanzi: '女儿', pinyin: "nǚ'ér" }],
    answer: 'F',
    translationJa: '娘（むすめ）',
    explanationJa:
      '「女儿（nǚ\'ér）」は「娘（女の子）」を意味しますが、イラストでバスケットボールを持ち上げているのは小さな「男の子（儿子）」です。性別が異なるため「×（誤り）」が正解です。',
    tipJa: '日本語の「女児」に近い漢字で「娘」の意味になります。対になる「息子」は「儿子（érzi）」。',
  },
  {
    id: 24,
    section: 'reading',
    part: 'R1',
    image: './assets/images/R1_q24.png',
    wordText: '茶',
    wordTokens: [{ hanzi: '茶', pinyin: 'chá' }],
    answer: 'F',
    translationJa: 'お茶',
    explanationJa:
      '「茶（chá）」はお茶（飲み物）ですが、イラストはおかずとご飯が盛られたどんぶり（米饭・菜）です。一致しないため「×（誤り）」が正解です。',
    tipJa: '「お茶を飲む」は「喝茶（hē chá）」、「ご飯を食べる」は「吃饭（chī fàn）」。動詞の使い分けも頻出です。',
  },
  {
    id: 25,
    section: 'reading',
    part: 'R1',
    image: './assets/images/R1_q25.png',
    wordText: '说话',
    wordTokens: [{ hanzi: '说话', pinyin: 'shuōhuà' }],
    answer: 'F',
    translationJa: '話す・しゃべる',
    explanationJa:
      '「说话（shuōhuà）」は「話す・しゃべる」という意味ですが、イラストの女性はヘッドホンをつけて目を閉じ、静かに音楽を「聴いて（听）」います。動作が違うため「×（誤り）」が正解です。',
    tipJa: '「说（話す）」と「听（聞く・聴く）」はよく対比されます。「说话」は「話をする」という離合詞です。',
  },

  // ===================== リーディング第2部 (26-30) =====================
  {
    id: 26,
    section: 'reading',
    part: 'R2',
    text: '你想坐哪个椅子？',
    tokens: [
      { hanzi: '你', pinyin: 'Nǐ' },
      { hanzi: '想', pinyin: 'xiǎng' },
      { hanzi: '坐', pinyin: 'zuò' },
      { hanzi: '哪个', pinyin: 'nǎge' },
      { hanzi: '椅子', pinyin: 'yǐzi' },
      { hanzi: '？' },
    ],
    answer: 'D',
    translationJa: 'どの椅子に座りたいですか？',
    explanationJa:
      'キーワードは「坐（座る）」と「椅子（yǐzi＝椅子）」。会議テーブルの横に椅子がずらりと並ぶイラスト D が正解です。',
    tipJa: '「想（xiǎng）＋動詞」で「〜したい」という願望を表します。「哪个（nǎge）」は「どの〜」。',
  },
  {
    id: 27,
    section: 'reading',
    part: 'R2',
    text: '王先生在商店买东西呢。',
    tokens: [
      { hanzi: '王', pinyin: 'Wáng' },
      { hanzi: '先生', pinyin: 'xiānsheng' },
      { hanzi: '在', pinyin: 'zài' },
      { hanzi: '商店', pinyin: 'shāngdiàn' },
      { hanzi: '买', pinyin: 'mǎi' },
      { hanzi: '东西', pinyin: 'dōngxi' },
      { hanzi: '呢', pinyin: 'ne' },
      { hanzi: '。' },
    ],
    answer: 'B',
    translationJa: '王さんはお店で買い物をしていますよ。',
    explanationJa:
      '「王先生（王さん・男性）」と「在商店买东西（お店で買い物をしている）」がヒント。スーパーでカートを押して買い物をしている男性のイラスト B が正解です。',
    tipJa: '【日本人要注意！】中国語の「先生（xiānsheng）」は教師ではなく、男性への敬称「〜さん（Mr.）」です。学校の先生は「老师（lǎoshī）」。また「东西（dōngxi）」は「モノ・品物」という意味になります。',
  },
  {
    id: 28,
    section: 'reading',
    part: 'R2',
    text: '下雨了，天气很冷。',
    tokens: [
      { hanzi: '下', pinyin: 'Xià' },
      { hanzi: '雨', pinyin: 'yǔ' },
      { hanzi: '了', pinyin: 'le' },
      { hanzi: '，' },
      { hanzi: '天气', pinyin: 'tiānqì' },
      { hanzi: '很', pinyin: 'hěn' },
      { hanzi: '冷', pinyin: 'lěng' },
      { hanzi: '。' },
    ],
    answer: 'A',
    translationJa: '雨が降ってきました、天気はとても寒いです。',
    explanationJa:
      'キーワードは「下雨（雨が降る）」と「冷（寒い）」。コートを着て傘をさしている女性のイラスト A が正解です。',
    tipJa: '文末の「了（le）」は「（今まで降っていなかったのに）雨が降ってきた」という状況の変化を表します。',
  },
  {
    id: 29,
    section: 'reading',
    part: 'R2',
    text: '来，看我这儿，一，二，三，好。',
    tokens: [
      { hanzi: '来', pinyin: 'Lái' },
      { hanzi: '，' },
      { hanzi: '看', pinyin: 'kàn' },
      { hanzi: '我', pinyin: 'wǒ' },
      { hanzi: '这儿', pinyin: 'zhèr' },
      { hanzi: '，' },
      { hanzi: '一', pinyin: 'yī' },
      { hanzi: '，' },
      { hanzi: '二', pinyin: 'èr' },
      { hanzi: '，' },
      { hanzi: '三', pinyin: 'sān' },
      { hanzi: '，' },
      { hanzi: '好', pinyin: 'hǎo' },
      { hanzi: '。' },
    ],
    answer: 'C',
    translationJa: 'ほら、私の方を見て、いち、に、さん、はいOK！',
    explanationJa:
      '「こっちを見て、1・2・3、はい！」は写真を撮るときの定番の掛け声です。カメラを構えて女性の写真を撮っているイラスト C が正解です。',
    tipJa: '冒頭の「来（lái）」は「さあ／ほら」と相手の注意を促す掛け声としてよく使われます。',
  },
  {
    id: 30,
    section: 'reading',
    part: 'R2',
    text: '他昨天去学习开车了。',
    tokens: [
      { hanzi: '他', pinyin: 'Tā' },
      { hanzi: '昨天', pinyin: 'zuótiān' },
      { hanzi: '去', pinyin: 'qù' },
      { hanzi: '学习', pinyin: 'xuéxí' },
      { hanzi: '开', pinyin: 'kāi' },
      { hanzi: '车', pinyin: 'chē' },
      { hanzi: '了', pinyin: 'le' },
      { hanzi: '。' },
    ],
    answer: 'F',
    translationJa: '彼は昨日、車の運転を習いに行きました。',
    explanationJa:
      'キーワードは「学习开车（車の運転を習う）」。教官の横でハンドルを握って運転の練習をしているイラスト F が正解です。',
    tipJa: '中国語の「开车（kāi chē）」は「車を運転する」という意味。「开」は「開ける」だけでなく、乗り物や機械を「動かす・操作する」意味を持ちます。',
  },

  // ===================== リーディング第3部 (31-35) =====================
  {
    id: 31,
    section: 'reading',
    part: 'R3',
    text: '那个电影怎么样？',
    tokens: [
      { hanzi: '那个', pinyin: 'Nàge' },
      { hanzi: '电影', pinyin: 'diànyǐng' },
      { hanzi: '怎么样', pinyin: 'zěnmeyàng' },
      { hanzi: '？' },
    ],
    answer: 'B',
    translationJa: 'あの映画はどうでしたか？',
    explanationJa:
      '映画の感想を尋ねる「怎么样？（どうですか？）」に対し、「まだ見ていません（だから分からない）」と返している B「我没看。」が最も自然です。',
    tipJa: '過去の動作の否定（「見なかった／見ていない」）には「不」ではなく「没（méi）」を使います。',
  },
  {
    id: 32,
    section: 'reading',
    part: 'R3',
    text: '这是谁的电脑？',
    tokens: [
      { hanzi: '这', pinyin: 'Zhè' },
      { hanzi: '是', pinyin: 'shì' },
      { hanzi: '谁', pinyin: 'shéi' },
      { hanzi: '的', pinyin: 'de' },
      { hanzi: '电脑', pinyin: 'diànnǎo' },
      { hanzi: '？' },
    ],
    answer: 'E',
    translationJa: 'これは誰のパソコンですか？',
    explanationJa:
      '「谁的〜？（誰の〜？）」と所有者を尋ねているので、「〜のものです」と答える E「李小姐的。（李さんのです）」が正解です。',
    tipJa: '「电脑（diànnǎo）」はパソコン、「电视（diànshì）」はテレビ、「电话（diànhuà）」は電話。「电」のつく3語をセットで区別しましょう。',
  },
  {
    id: 33,
    section: 'reading',
    part: 'R3',
    text: '对不起，你不喜欢狗？',
    tokens: [
      { hanzi: '对不起', pinyin: 'Duìbuqǐ' },
      { hanzi: '，' },
      { hanzi: '你', pinyin: 'nǐ' },
      { hanzi: '不', pinyin: 'bù' },
      { hanzi: '喜欢', pinyin: 'xǐhuan' },
      { hanzi: '狗', pinyin: 'gǒu' },
      { hanzi: '？' },
    ],
    answer: 'D',
    translationJa: 'ごめんなさい、犬は苦手（好きじゃない）ですか？',
    explanationJa:
      '謝罪の「对不起（ごめんなさい）」に対する王道の返答は「没关系（大丈夫ですよ）」です。したがって D が正解です。',
    tipJa: 'HSK1級では「对不起 ↔ 没关系」「谢谢 ↔ 不客气」の決まり文句ペアが毎年のように出題されます。',
  },
  {
    id: 34,
    section: 'reading',
    part: 'R3',
    text: '她在家做什么呢？',
    tokens: [
      { hanzi: '她', pinyin: 'Tā' },
      { hanzi: '在', pinyin: 'zài' },
      { hanzi: '家', pinyin: 'jiā' },
      { hanzi: '做', pinyin: 'zuò' },
      { hanzi: '什么', pinyin: 'shénme' },
      { hanzi: '呢', pinyin: 'ne' },
      { hanzi: '？' },
    ],
    answer: 'A',
    translationJa: '彼女は家で何をしていますか？',
    explanationJa:
      '「做什么呢？（何をしているの？）」と具体的な行動を尋ねているため、動作を答える A「打电话。（電話をかけています）」が正解です。',
    tipJa: '「電話をかける」は中国語で「打电话（dǎ diànhuà）」。動詞「打」を使います。',
  },
  {
    id: 35,
    section: 'reading',
    part: 'R3',
    text: '爸，我的杯子呢？',
    tokens: [
      { hanzi: '爸', pinyin: 'Bà' },
      { hanzi: '，' },
      { hanzi: '我', pinyin: 'wǒ' },
      { hanzi: '的', pinyin: 'de' },
      { hanzi: '杯子', pinyin: 'bēizi' },
      { hanzi: '呢', pinyin: 'ne' },
      { hanzi: '？' },
    ],
    answer: 'C',
    translationJa: 'お父さん、私のコップはどこ？',
    explanationJa:
      '「名詞＋呢？」は「〜はどこにありますか？」と場所を尋ねる定番の表現です。場所を答えている C「桌子上。（テーブルの上だよ）」が正解です。',
    tipJa: '「桌子上（zhuōzi shang）」のように方位詞「上」が名詞の後ろにつくと、軽声で発音されるのが一般的です。',
  },

  // ===================== リーディング第4部 (36-40) =====================
  {
    id: 36,
    section: 'reading',
    part: 'R4',
    lines: [
      {
        tokens: [
          { hanzi: '中午', pinyin: 'Zhōngwǔ' },
          { hanzi: '我', pinyin: 'wǒ' },
          { hanzi: '', isBlank: true },
          { hanzi: '请', pinyin: 'qǐng' },
          { hanzi: '你', pinyin: 'nǐ' },
          { hanzi: '吃', pinyin: 'chī' },
          { hanzi: '饭', pinyin: 'fàn' },
          { hanzi: '吗', pinyin: 'ma' },
          { hanzi: '？' },
        ],
      },
    ],
    answer: 'B',
    translationJa: 'お昼に食事をご馳走してもいいですか？',
    explanationJa:
      '「中午我（能）请你吃饭吗？」となり、助動詞「能（néng＝〜してもいいですか）」を入れると丁寧な申し出・許可の疑問文になります。したがって B（能）が正解です。',
    tipJa: '「请＋人＋吃饭」は「（人）に食事をご馳走する」という重要表現です。',
  },
  {
    id: 37,
    section: 'reading',
    part: 'R4',
    lines: [
      {
        tokens: [
          { hanzi: '王', pinyin: 'Wáng' },
          { hanzi: '老师', pinyin: 'lǎoshī' },
          { hanzi: '今年', pinyin: 'jīnnián' },
          { hanzi: '60', pinyin: '' },
          { hanzi: '', isBlank: true },
          { hanzi: '了', pinyin: 'le' },
          { hanzi: '。' },
        ],
      },
    ],
    answer: 'C',
    translationJa: '王先生は今年60歳になりました。',
    explanationJa:
      '「今年 60（岁）了」のように、年齢を表す数字の直後には「岁（suì＝歳）」を入れます。したがって C（岁）が正解です。',
    tipJa: '年齢を言うとき、中国語では「是」を入れず「王老师今年60岁了」と直接つなげるのが自然です（名詞述語文）。',
  },
  {
    id: 38,
    section: 'reading',
    part: 'R4',
    lines: [
      {
        tokens: [
          { hanzi: '他', pinyin: 'Tā' },
          { hanzi: '和', pinyin: 'hé' },
          { hanzi: '他', pinyin: 'tā' },
          { hanzi: '妈妈', pinyin: 'māma' },
          { hanzi: '都', pinyin: 'dōu' },
          { hanzi: '', isBlank: true },
          { hanzi: '看', pinyin: 'kàn' },
          { hanzi: '电视', pinyin: 'diànshì' },
          { hanzi: '。' },
        ],
      },
    ],
    answer: 'F',
    translationJa: '彼も彼のお母さんもテレビを見るのが好きです。',
    explanationJa:
      '「都（どちらも）」の後ろと「看电视（テレビを見る）」の間には、好みを表す動詞「喜欢（xǐhuan＝好きだ）」がぴったり入ります。したがって F（喜欢）が正解です。',
    tipJa: '副詞「都（dōu＝すべて・どちらも）」は必ず主語の後ろ、動詞・形容詞の前に置きます。',
  },
  {
    id: 39,
    section: 'reading',
    part: 'R4',
    lines: [
      {
        speaker: '女',
        tokens: [
          { hanzi: '我', pinyin: 'Wǒ' },
          { hanzi: '爱', pinyin: 'ài' },
          { hanzi: '吃', pinyin: 'chī' },
          { hanzi: '这个', pinyin: 'zhège' },
          { hanzi: '菜', pinyin: 'cài' },
          { hanzi: '，' },
          { hanzi: '这个', pinyin: 'zhège' },
          { hanzi: '菜', pinyin: 'cài' },
          { hanzi: '', isBlank: true },
          { hanzi: '钱', pinyin: 'qián' },
          { hanzi: '？' },
        ],
      },
      {
        speaker: '男',
        tokens: [
          { hanzi: '17', pinyin: '' },
          { hanzi: '块', pinyin: 'kuài' },
          { hanzi: '。' },
        ],
      },
    ],
    answer: 'E',
    translationJa: '女：私この料理が大好きなんです、この料理はいくらですか？／男：17元です。',
    explanationJa:
      '値段を尋ねる決まり文句は「多少钱？（duōshao qián?＝いくらですか？）」。返答も「17块（17元）」と金額になっているため、E（多少）が正解です。',
    tipJa: '「菜（cài）」は野菜だけでなく「料理・おかず」の意味でも使われます。「块（kuài）」は口語で人民元の「元」を表す単位です。',
  },
  {
    id: 40,
    section: 'reading',
    part: 'R4',
    lines: [
      {
        speaker: '男',
        tokens: [
          { hanzi: '你', pinyin: 'Nǐ' },
          { hanzi: '在', pinyin: 'zài' },
          { hanzi: '哪儿', pinyin: 'nǎr' },
          { hanzi: '？' },
          { hanzi: '我', pinyin: 'Wǒ' },
          { hanzi: '没', pinyin: 'méi' },
          { hanzi: '看见', pinyin: 'kànjiàn' },
          { hanzi: '你', pinyin: 'nǐ' },
          { hanzi: '。' },
        ],
      },
      {
        speaker: '女',
        tokens: [
          { hanzi: '我', pinyin: 'Wǒ' },
          { hanzi: '在', pinyin: 'zài' },
          { hanzi: '饭店', pinyin: 'fàndiàn' },
          { hanzi: '', isBlank: true },
          { hanzi: '，' },
          { hanzi: '我', pinyin: 'wǒ' },
          { hanzi: '看见', pinyin: 'kànjiàn' },
          { hanzi: '你', pinyin: 'nǐ' },
          { hanzi: '了', pinyin: 'le' },
          { hanzi: '。' },
        ],
      },
    ],
    answer: 'A',
    translationJa: '男：どこにいるの？君が見えないよ。／女：レストランの中にいるよ、私からはあなたが見えるよ。',
    explanationJa:
      '「在＋場所＋里」で「〜の中にいる」という意味になります。「在饭店里（レストランの中にいる）」となるため、A（里）が正解です。',
    tipJa: '「饭店（fàndiàn）」はレストラン・食堂・ホテルを意味します。「看见（kànjiàn）」は結果補語「见」がついて「（目に入って）見える」という意味になります。',
  },
];

export interface AudioTimelineItem {
  labelJa: string;
  part: PartId | 'INTRO' | 'END';
  questionId?: number;
  start: number;
  end: number;
}

export const AUDIO_TIMELINE: AudioTimelineItem[] = [
  { labelJa: 'オープニング音楽・試験案内', part: 'INTRO', start: 0, end: 63.6 },
  { labelJa: '聴力 第1部・説明と例題', part: 'L1', start: 63.6, end: 108.8 },
  { labelJa: '聴力 第1部・第1問', part: 'L1', questionId: 1, start: 108.8, end: 126.1 },
  { labelJa: '聴力 第1部・第2問', part: 'L1', questionId: 2, start: 126.1, end: 142.8 },
  { labelJa: '聴力 第1部・第3問', part: 'L1', questionId: 3, start: 142.8, end: 159.7 },
  { labelJa: '聴力 第1部・第4問', part: 'L1', questionId: 4, start: 159.7, end: 176.6 },
  { labelJa: '聴力 第1部・第5問', part: 'L1', questionId: 5, start: 176.6, end: 195.8 },
  { labelJa: '聴力 第2部・説明と例題', part: 'L2', start: 195.8, end: 233.5 },
  { labelJa: '聴力 第2部・第6問', part: 'L2', questionId: 6, start: 233.5, end: 257.1 },
  { labelJa: '聴力 第2部・第7問', part: 'L2', questionId: 7, start: 257.1, end: 282.6 },
  { labelJa: '聴力 第2部・第8問', part: 'L2', questionId: 8, start: 282.6, end: 313.1 },
  { labelJa: '聴力 第2部・第9問', part: 'L2', questionId: 9, start: 313.1, end: 341.1 },
  { labelJa: '聴力 第2部・第10問', part: 'L2', questionId: 10, start: 341.1, end: 365.5 },
  { labelJa: '聴力 第3部・説明と例題', part: 'L3', start: 365.5, end: 409.5 },
  { labelJa: '聴力 第3部・第11問', part: 'L3', questionId: 11, start: 409.5, end: 450.1 },
  { labelJa: '聴力 第3部・第12問', part: 'L3', questionId: 12, start: 450.1, end: 490.8 },
  { labelJa: '聴力 第3部・第13問', part: 'L3', questionId: 13, start: 490.8, end: 524.1 },
  { labelJa: '聴力 第3部・第14問', part: 'L3', questionId: 14, start: 524.1, end: 560.1 },
  { labelJa: '聴力 第3部・第15問', part: 'L3', questionId: 15, start: 560.1, end: 599.6 },
  { labelJa: '聴力 第4部・説明と例題', part: 'L4', start: 599.6, end: 655.2 },
  { labelJa: '聴力 第4部・第16問', part: 'L4', questionId: 16, start: 655.2, end: 690.3 },
  { labelJa: '聴力 第4部・第17問', part: 'L4', questionId: 17, start: 690.3, end: 729.8 },
  { labelJa: '聴力 第4部・第18問', part: 'L4', questionId: 18, start: 729.8, end: 773.1 },
  { labelJa: '聴力 第4部・第19問', part: 'L4', questionId: 19, start: 773.1, end: 813.6 },
  { labelJa: '聴力 第4部・第20問', part: 'L4', questionId: 20, start: 813.6, end: 853.8 },
  { labelJa: 'リスニング試験終了', part: 'END', start: 853.8, end: 877.5 },
];

export function getTimelineAt(seconds: number): AudioTimelineItem {
  for (let i = AUDIO_TIMELINE.length - 1; i >= 0; i--) {
    if (seconds >= AUDIO_TIMELINE[i].start) {
      return AUDIO_TIMELINE[i];
    }
  }
  return AUDIO_TIMELINE[0];
}
