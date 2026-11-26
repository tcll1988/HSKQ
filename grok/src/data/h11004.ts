export type Seg = { py: string; hz: string };
export type PartId = "L1" | "L2" | "L3" | "L4" | "R1" | "R2" | "R3" | "R4";
export type Choice = { key: string; image?: string; segs?: Seg[] };
export type Question = {
  id: number;
  part: PartId;
  audio?: [number, number];
  image?: string;
  stem?: Seg[];
  choices: Choice[];
  answer: string;
  transcript?: Seg[];
  explain: string;
};

export const PARTS: Record<
  PartId,
  { ja: string; zh: string; hint: string; group: "listen" | "read" }
> = {
  L1: {
    ja: "リスニング 第1部分",
    zh: "听力 · 第1–5题",
    hint: "絵を見てください。聞こえた内容と絵が合っていれば「合っている」、違うなら「違う」です。",
    group: "listen",
  },
  L2: {
    ja: "リスニング 第2部分",
    zh: "听力 · 第6–10题",
    hint: "文を聞いて、内容に合う絵を A・B・C から一つ選んでください。",
    group: "listen",
  },
  L3: {
    ja: "リスニング 第3部分",
    zh: "听力 · 第11–15题",
    hint: "短い会話を聞いて、内容に合う絵を選んでください。",
    group: "listen",
  },
  L4: {
    ja: "リスニング 第4部分",
    zh: "听力 · 第16–20题",
    hint: "短い話と質問を聞いて、答えを A・B・C から選んでください。",
    group: "listen",
  },
  R1: {
    ja: "読解 第1部分",
    zh: "阅读 · 第21–25题",
    hint: "ことばと絵を見くらべて、合っていれば「合っている」、違うなら「違う」です。",
    group: "read",
  },
  R2: {
    ja: "読解 第2部分",
    zh: "阅读 · 第26–30题",
    hint: "文を読んで、内容に合う絵を選んでください。",
    group: "read",
  },
  R3: {
    ja: "読解 第3部分",
    zh: "阅读 · 第31–35题",
    hint: "問いの文に合う返事を選んでください。同じ返事は一度だけ使います。",
    group: "read",
  },
  R4: {
    ja: "読解 第4部分",
    zh: "阅读 · 第36–40题",
    hint: "空欄に入ることばを選んでください。",
    group: "read",
  },
};

const T = "T";
const F = "F";
const judge: Choice[] = [
  { key: T, segs: [{ py: "", hz: "合っている" }] },
  { key: F, segs: [{ py: "", hz: "違う" }] },
];

function segs(pairs: [string, string][]): Seg[] {
  return pairs.map(([py, hz]) => ({ py, hz }));
}

const l3: Choice[] = ["a", "b", "c", "d", "e", "f"].map((k) => ({
  key: k.toUpperCase(),
  image: `/hsk/l3-${k}.png`,
}));

const r2: Choice[] = ["a", "b", "c", "d", "e", "f"].map((k) => ({
  key: k.toUpperCase(),
  image: `/hsk/r2-${k}.png`,
}));

const replies: Choice[] = [
  { key: "A", segs: segs([["Dǎ", "打"], ["diànhuà.", "电话。"]]) },
  { key: "B", segs: segs([["Wǒ", "我"], ["méi", "没"], ["kàn.", "看。"]]) },
  { key: "C", segs: segs([["Zhuōzi", "桌子"], ["shang.", "上。"]]) },
  { key: "D", segs: segs([["Méi", "没"], ["guānxi.", "关系。"]]) },
  { key: "E", segs: segs([["Lǐ", "李"], ["xiǎojiě", "小姐"], ["de.", "的。"]]) },
  { key: "F", segs: segs([["Hǎo", "好"], ["de,", "的，"], ["xièxie!", "谢谢！"]]) },
];

const bank: Choice[] = [
  { key: "A", segs: segs([["lǐ", "里"]]) },
  { key: "B", segs: segs([["néng", "能"]]) },
  { key: "C", segs: segs([["suì", "岁"]]) },
  { key: "D", segs: segs([["míngzi", "名字"]]) },
  { key: "E", segs: segs([["duōshao", "多少"]]) },
  { key: "F", segs: segs([["xǐhuan", "喜欢"]]) },
];

function abcPics(n: number): Choice[] {
  return ["a", "b", "c"].map((k) => ({
    key: k.toUpperCase(),
    image: `/hsk/l2-${n}${k}.png`,
  }));
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    part: "L1",
    audio: [110.9, 116.5],
    image: "/hsk/l1-1.png",
    choices: judge,
    answer: F,
    transcript: segs([["Sān", "三"], ["běn", "本"], ["shū.", "书。"]]),
    explain:
      "「三本书」は「本が3冊」です。三は数の3、本は本を数えるときの助数詞です。絵は本が1冊なので、数があっていません。",
  },
  {
    id: 2,
    part: "L1",
    audio: [128.2, 133.0],
    image: "/hsk/l1-2.png",
    choices: judge,
    answer: F,
    transcript: segs([["Duìbuqǐ.", "对不起。"]]),
    explain:
      "「对不起」は「すみません・ごめんなさい」。謝ることばです。絵は服で、謝っている場面ではないので違います。",
  },
  {
    id: 3,
    part: "L1",
    audio: [145.0, 149.9],
    image: "/hsk/l1-3.png",
    choices: judge,
    answer: T,
    transcript: segs([["Hěn", "很"], ["piàoliang.", "漂亮。"]]),
    explain:
      "「很漂亮」は「とてもきれい」。很は「とても」、漂亮は見た目がきれいなときによく使います。絵の人物と合っています。",
  },
  {
    id: 4,
    part: "L1",
    audio: [161.9, 166.8],
    image: "/hsk/l1-4.png",
    choices: judge,
    answer: T,
    transcript: segs([["Mǎi", "买"], ["yīfu.", "衣服。"]]),
    explain:
      "「买衣服」は「服を買う」。买は買う、衣服は服です。絵は服なので合っています。",
  },
  {
    id: 5,
    part: "L1",
    audio: [179.0, 186.0],
    image: "/hsk/l1-5.png",
    choices: judge,
    answer: T,
    transcript: segs([["Èr líng líng bā nián.", "二零零八年。"]]),
    explain:
      "「二零零八年」は2008年です。年は「年（nián）」。絵に2008とあるので合っています。",
  },
  {
    id: 6,
    part: "L2",
    audio: [235.6, 242.4],
    choices: abcPics(6),
    answer: "A",
    transcript: segs([["Tā", "他"], ["zài", "在"], ["shuìjiào", "睡觉"], ["ne.", "呢。"]]),
    explain:
      "「他在睡觉呢」は「彼は今、寝ています」。在〜呢 は「ちょうど〜しているところ」。寝ている絵は A です。",
  },
  {
    id: 7,
    part: "L2",
    audio: [259.2, 268.0],
    choices: abcPics(7),
    answer: "B",
    transcript: segs([
      ["Nǐ", "你"],
      ["zěnme", "怎么"],
      ["le,", "了，"],
      ["bù", "不"],
      ["gāoxìng", "高兴"],
      ["le?", "了？"],
    ]),
    explain:
      "「你怎么了，不高兴了？」は「どうしたの、機嫌が悪いの？」。不高兴は不機嫌。怒ったような顔の絵は B です。A は嬉しそう、C は食事中です。",
  },
  {
    id: 8,
    part: "L2",
    audio: [284.6, 298.4],
    choices: abcPics(8),
    answer: "C",
    transcript: segs([
      ["Tài", "太"],
      ["rè", "热"],
      ["le,", "了，"],
      ["yǒu", "有"],
      ["shuǐ", "水"],
      ["ma?", "吗？"],
      ["Wǒ", "我"],
      ["xiǎng", "想"],
      ["hē", "喝"],
      ["shuǐ.", "水。"],
    ]),
    explain:
      "「太热了」は暑すぎる、「有水吗」は水はある？、「我想喝水」は水が飲みたい。水を飲んでいる絵は C です。",
  },
  {
    id: 9,
    part: "L2",
    audio: [315.3, 326.4],
    choices: abcPics(9),
    answer: "B",
    transcript: segs([
      ["Xiànzài", "现在"],
      ["shì", "是"],
      ["xiàwǔ", "下午"],
      ["yì diǎn", "一点"],
      ["shí fēn.", "十分。"],
    ]),
    explain:
      "「现在是下午一点十分」は「今は午後1時10分」。一点は1時、十分は10分です。1時10分を指している時計は B です。",
  },
  {
    id: 10,
    part: "L2",
    audio: [343.3, 350.9],
    choices: abcPics(10),
    answer: "B",
    transcript: segs([["Tā", "他"], ["qù", "去"], ["huǒchēzhàn", "火车站"], ["le.", "了。"]]),
    explain:
      "「他去火车站了」は「彼は駅へ行きました」。火车站は駅、火车は電車。電車の絵は B です。A はタクシー、C は飛行機です。",
  },
  {
    id: 11,
    part: "L3",
    audio: [409.6, 435.6],
    choices: l3,
    answer: "A",
    transcript: segs([
      ["Nán:", "男："],
      ["Qiánmiàn", "前面"],
      ["nàge", "那个"],
      ["yīshēng", "医生"],
      ["jiào", "叫"],
      ["shénme", "什么"],
      ["míngzi?", "名字？"],
      ["Nǚ:", "女："],
      ["Tā?", "他？"],
      ["Tā", "他"],
      ["jiào", "叫"],
      ["Lǐ Míng.", "李明。"],
    ]),
    explain:
      "男の人は「前にいるあの医者の名前は？」と聞き、女の人は「李明です」と答えています。医者の絵は A です。叫は名前を言うときの「〜という」。",
  },
  {
    id: 12,
    part: "L3",
    audio: [452.4, 476.2],
    choices: l3,
    answer: "D",
    transcript: segs([
      ["Nǚ:", "女："],
      ["Wèi,", "喂，"],
      ["nǐ", "你"],
      ["huí", "回"],
      ["jiā", "家"],
      ["le?", "了？"],
      ["Nán:", "男："],
      ["Méi,", "没，"],
      ["wǒ", "我"],
      ["zài", "在"],
      ["chūzūchē", "出租车"],
      ["shang,", "上，"],
      ["wǒ", "我"],
      ["qù", "去"],
      ["xuéxiào.", "学校。"],
    ]),
    explain:
      "「回家了？」はもう家に着いた？「没」はまだ。「我在出租车上」はタクシーに乗っている。「去学校」は学校へ行く。タクシーの絵は D です。",
  },
  {
    id: 13,
    part: "L3",
    audio: [490.9, 509.4],
    choices: l3,
    answer: "B",
    transcript: segs([
      ["Nán:", "男："],
      ["Nǐ", "你"],
      ["zuò", "坐"],
      ["jǐ diǎn", "几点"],
      ["de", "的"],
      ["fēijī?", "飞机？"],
      ["Nǚ:", "女："],
      ["Shàngwǔ", "上午"],
      ["jiǔ diǎn.", "九点。"],
    ]),
    explain:
      "「你坐几点的飞机？」は「何時の飛行機に乗るの？」。答えは「上午九点」、午前9時です。飛行機の絵は B です。",
  },
  {
    id: 14,
    part: "L3",
    audio: [524.1, 545.5],
    choices: l3,
    answer: "F",
    transcript: segs([
      ["Nǚ:", "女："],
      ["Xièxie", "谢谢"],
      ["nǐ", "你"],
      ["de", "的"],
      ["shuǐguǒ.", "水果。"],
      ["Nán:", "男："],
      ["Bú", "不"],
      ["kèqi.", "客气。"],
      ["Nǐ", "你"],
      ["duō", "多"],
      ["chī", "吃"],
      ["píngguǒ.", "苹果。"],
    ]),
    explain:
      "女の人は果物をもらって礼を言い、男の人は「どういたしまして。りんごをたくさん食べて」と言っています。りんごの絵は F です。不客气は「どういたしまして」。",
  },
  {
    id: 15,
    part: "L3",
    audio: [560.1, 585.0],
    choices: l3,
    answer: "E",
    transcript: segs([
      ["Nán:", "男："],
      ["Zhèxiē", "这些"],
      ["rén", "人"],
      ["shì", "是"],
      ["shuí?", "谁？"],
      ["Nǚ:", "女："],
      ["Tāmen", "他们"],
      ["dōu", "都"],
      ["shì", "是"],
      ["wǒ", "我"],
      ["zài", "在"],
      ["Zhōngguó", "中国"],
      ["rènshi", "认识"],
      ["de", "的"],
      ["péngyou.", "朋友。"],
    ]),
    explain:
      "「这些人是谁？」はこの人たちはだれ？「他们都是我在中国认识的朋友」は、みんな中国で知り合った友だち。人が集まっている絵は E です。",
  },
  {
    id: 16,
    part: "L4",
    audio: [657.6, 675.6],
    choices: [
      { key: "A", segs: segs([["hòutiān", "后天"]]) },
      { key: "B", segs: segs([["xià ge", "下个"], ["xīngqī", "星期"]]) },
      { key: "C", segs: segs([["xià ge", "下个"], ["yuè", "月"]]) },
    ],
    answer: "C",
    transcript: segs([
      ["Xià ge", "下个"],
      ["yuè,", "月，"],
      ["wǒ", "我"],
      ["qù", "去"],
      ["Běijīng.", "北京。"],
      ["Wèn:", "问："],
      ["Tā", "他"],
      ["shénme", "什么"],
      ["shíhou", "时候"],
      ["qù", "去"],
      ["Běijīng?", "北京？"],
    ]),
    explain:
      "本文は「下个月，我去北京（来月、北京へ行きます）」。質問はいつ北京へ行くか。下个月は来月なので C です。A 后天はあさって、B 下个星期は来週で、どちらも言っていません。",
  },
  {
    id: 17,
    part: "L4",
    audio: [692.7, 715.0],
    choices: [
      { key: "A", segs: segs([["xiǎoxué", "小学"]]) },
      { key: "B", segs: segs([["zhōngxué", "中学"]]) },
      { key: "C", segs: segs([["dàxué", "大学"]]) },
    ],
    answer: "A",
    transcript: segs([
      ["Tā", "他"],
      ["shì", "是"],
      ["xiǎoxué", "小学"],
      ["lǎoshī,", "老师，"],
      ["tā", "他"],
      ["yǒu", "有"],
      ["hěn", "很"],
      ["duō", "多"],
      ["xuéshēng.", "学生。"],
      ["Wèn:", "问："],
      ["Tā", "他"],
      ["shì", "是"],
      ["nǎr", "哪儿"],
      ["de", "的"],
      ["lǎoshī?", "老师？"],
    ]),
    explain:
      "「他是小学老师」は小学校の先生。質問「他是哪儿的老师？」は、どこの先生か。小学なので A です。中学は中学校、大学は大学。",
  },
  {
    id: 18,
    part: "L4",
    audio: [732.2, 758.5],
    choices: [
      { key: "A", segs: segs([["wǒ", "我"]]) },
      { key: "B", segs: segs([["érzi", "儿子"]]) },
      { key: "C", segs: segs([["érzi de", "儿子的"], ["tóngxué", "同学"]]) },
    ],
    answer: "C",
    transcript: segs([
      ["Tā", "他"],
      ["shì", "是"],
      ["wǒ", "我"],
      ["érzi", "儿子"],
      ["de", "的"],
      ["tóngxué,", "同学，"],
      ["tīng", "听"],
      ["érzi", "儿子"],
      ["shuō,", "说，"],
      ["tā", "他"],
      ["zài", "在"],
      ["yīyuàn", "医院"],
      ["gōngzuò.", "工作。"],
      ["Wèn:", "问："],
      ["Shuí", "谁"],
      ["zài", "在"],
      ["yīyuàn", "医院"],
      ["gōngzuò?", "工作？"],
    ]),
    explain:
      "「他是我儿子的同学」の「他」は息子の同級生です。その人が病院で働いている、と息子が言った、という話です。病院で働いているのは「私」でも「息子」でもなく、息子の同級生なので C です。",
  },
  {
    id: 19,
    part: "L4",
    audio: [775.6, 799.0],
    choices: [
      { key: "A", segs: segs([["xīngqīsān", "星期三"]]) },
      { key: "B", segs: segs([["xīngqīsì", "星期四"]]) },
      { key: "C", segs: segs([["xīngqīrì", "星期日"]]) },
    ],
    answer: "C",
    transcript: segs([
      ["Wǒ", "我"],
      ["zài", "在"],
      ["nàr", "那儿"],
      ["zhù", "住"],
      ["sān", "三"],
      ["tiān,", "天，"],
      ["xīngqītiān", "星期天"],
      ["huílái,", "回来，"],
      ["zàijiàn.", "再见。"],
      ["Wèn:", "问："],
      ["Tā", "他"],
      ["nǎ tiān", "哪天"],
      ["huílái?", "回来？"],
    ]),
    explain:
      "「住三天」は3日泊まる、という情報です。質問は「哪天回来（何曜日に帰るか）」。星期天＝星期日で、日曜日なので C です。日数と曜日を取りちがえないようにします。",
  },
  {
    id: 20,
    part: "L4",
    audio: [816.0, 839.2],
    choices: [
      { key: "A", segs: segs([["hěn", "很"], ["hǎo", "好"]]) },
      { key: "B", segs: segs([["bú", "不"], ["huì", "会"], ["xiě", "写"]]) },
      { key: "C", segs: segs([["bú", "不"], ["huì", "会"], ["dú", "读"]]) },
    ],
    answer: "A",
    transcript: segs([
      ["Tā", "他"],
      ["de", "的"],
      ["Hànyǔ", "汉语"],
      ["hěn", "很"],
      ["hǎo,", "好，"],
      ["tā", "他"],
      ["huì", "会"],
      ["xiě", "写"],
      ["bùshǎo", "不少"],
      ["Hànzì.", "汉字。"],
      ["Wèn:", "问："],
      ["Tā", "他"],
      ["de", "的"],
      ["Hànyǔ", "汉语"],
      ["zěnmeyàng?", "怎么样？"],
    ]),
    explain:
      "「他的汉语很好」で、中国語はとても上手、とまず言っています。会写不少汉字は「漢字がかなり書ける」。質問は中国語がどうか、なので A「很好」です。B の「書けない」は本文と逆です。",
  },
  {
    id: 21,
    part: "R1",
    image: "/hsk/r1-21.png",
    stem: segs([["māo", "猫"]]),
    choices: judge,
    answer: T,
    explain: "「猫」はねこです。絵もねこなので合っています。",
  },
  {
    id: 22,
    part: "R1",
    image: "/hsk/r1-22.png",
    stem: segs([["sì", "四"]]),
    choices: judge,
    answer: T,
    explain: "「四」は数の4です。絵の数字が4なので合っています。",
  },
  {
    id: 23,
    part: "R1",
    image: "/hsk/r1-23.png",
    stem: segs([["nǚ'ér", "女儿"]]),
    choices: judge,
    answer: F,
    explain:
      "「女儿」は娘、女の子です。儿子が息子です。絵は男の子なので、ことばと絵は違います。",
  },
  {
    id: 24,
    part: "R1",
    image: "/hsk/r1-24.png",
    stem: segs([["chá", "茶"]]),
    choices: judge,
    answer: F,
    explain:
      "「茶」はお茶です。コーヒーは「咖啡（kāfēi）」。絵はコーヒーカップなので違います。",
  },
  {
    id: 25,
    part: "R1",
    image: "/hsk/r1-25.png",
    stem: segs([["shuōhuà", "说话"]]),
    choices: judge,
    answer: F,
    explain:
      "「说话」は話すことです。絵は本を読んでいるので違います。読むは「看书（kàn shū）」。",
  },
  {
    id: 26,
    part: "R2",
    stem: segs([
      ["Nǐ", "你"],
      ["xiǎng", "想"],
      ["zuò", "坐"],
      ["nǎge", "哪个"],
      ["yǐzi?", "椅子？"],
    ]),
    choices: r2,
    answer: "D",
    explain:
      "「你想坐哪个椅子？」は「どのいすに座りたい？」。椅子はいすです。いすが描いてある絵は D です。",
  },
  {
    id: 27,
    part: "R2",
    stem: segs([
      ["Wáng", "王"],
      ["xiānsheng", "先生"],
      ["zài", "在"],
      ["shāngdiàn", "商店"],
      ["mǎi", "买"],
      ["dōngxi", "东西"],
      ["ne.", "呢。"],
    ]),
    choices: r2,
    answer: "B",
    explain:
      "「王先生在商店买东西呢」は「王さんはお店で買い物をしています」。在〜呢 は「今まさに〜している」。店で買い物している絵は B です。本の絵（例の E）とまちがえないでください。",
  },
  {
    id: 28,
    part: "R2",
    stem: segs([
      ["Xià", "下"],
      ["yǔ", "雨"],
      ["le,", "了，"],
      ["tiānqì", "天气"],
      ["hěn", "很"],
      ["lěng.", "冷。"],
    ]),
    choices: r2,
    answer: "A",
    explain:
      "「下雨了」は雨が降った、「天气很冷」は天気がとても寒い。雨で寒そうな絵は A です。",
  },
  {
    id: 29,
    part: "R2",
    stem: segs([
      ["Lái,", "来，"],
      ["kàn", "看"],
      ["wǒ", "我"],
      ["zhèr,", "这儿，"],
      ["yī,", "一，"],
      ["èr,", "二，"],
      ["sān,", "三，"],
      ["hǎo.", "好。"],
    ]),
    choices: r2,
    answer: "C",
    explain:
      "「来，看我这儿」は「さあ、こっちを見て」。そのあと「一、二、三」と数えています。1・2・3と数える絵は C です。",
  },
  {
    id: 30,
    part: "R2",
    stem: segs([
      ["Tā", "他"],
      ["zuótiān", "昨天"],
      ["qù", "去"],
      ["xuéxí", "学习"],
      ["kāi", "开"],
      ["chē", "车"],
      ["le.", "了。"],
    ]),
    choices: r2,
    answer: "F",
    explain:
      "「昨天去学习开车了」は「昨日、車の運転を習いに行った」。开车は車を運転する。車の絵は F です。",
  },
  {
    id: 31,
    part: "R3",
    stem: segs([
      ["Nàge", "那个"],
      ["diànyǐng", "电影"],
      ["zěnmeyàng?", "怎么样？"],
    ]),
    choices: replies,
    answer: "B",
    explain:
      "「那个电影怎么样？」は「あの映画はどうだった？」。見ていなければ「我没看（見ていない）」と答えます。B です。A の「打电话」は電話する、で質問に答えていません。",
  },
  {
    id: 32,
    part: "R3",
    stem: segs([
      ["Zhè", "这"],
      ["shì", "是"],
      ["shéi", "谁"],
      ["de", "的"],
      ["diànnǎo?", "电脑？"],
    ]),
    choices: replies,
    answer: "E",
    explain:
      "「这是谁的电脑？」は「これはだれのパソコン？」。持ち主を聞くので「李小姐的（李さんのものです）」が答えです。E。「桌子上」は場所で、だれのかには答えていません。",
  },
  {
    id: 33,
    part: "R3",
    stem: segs([
      ["Duìbuqǐ,", "对不起，"],
      ["nǐ", "你"],
      ["bù", "不"],
      ["xǐhuan", "喜欢"],
      ["gǒu?", "狗？"],
    ]),
    choices: replies,
    answer: "D",
    explain:
      "「对不起，你不喜欢狗？」は「ごめん、犬が嫌いなの？」。気にしなくていい、と返すのが「没关系（大丈夫・気にしないで）」。D です。",
  },
  {
    id: 34,
    part: "R3",
    stem: segs([
      ["Tā", "她"],
      ["zài", "在"],
      ["jiā", "家"],
      ["zuò", "做"],
      ["shénme", "什么"],
      ["ne?", "呢？"],
    ]),
    choices: replies,
    answer: "A",
    explain:
      "「她在家做什么呢？」は「彼女は家で何をしているの？」。動作で答えるので「打电话（電話している）」が合います。A です。",
  },
  {
    id: 35,
    part: "R3",
    stem: segs([
      ["Bà,", "爸，"],
      ["wǒ", "我"],
      ["de", "的"],
      ["bēizi", "杯子"],
      ["ne?", "呢？"],
    ]),
    choices: replies,
    answer: "C",
    explain:
      "「我的杯子呢？」は「僕のコップはどこ？」。ね で所在をたずねています。場所の答えは「桌子上（机の上）」。C です。F の「谢谢」はお礼で、場所ではありません。",
  },
  {
    id: 36,
    part: "R4",
    stem: segs([
      ["Zhōngwǔ", "中午"],
      ["wǒ", "我"],
      ["（  ）", "（　　）"],
      ["qǐng", "请"],
      ["nǐ", "你"],
      ["chī", "吃"],
      ["fàn", "饭"],
      ["ma?", "吗？"],
    ]),
    choices: bank,
    answer: "B",
    explain:
      "「中午我能请你吃饭吗？」は「お昼ごはん、おごってもいい？」。能は「できる・〜してもいい」。请你吃饭は食事をおごる、です。年齢の岁や「中」の里は入りません。",
  },
  {
    id: 37,
    part: "R4",
    stem: segs([
      ["Wáng", "王"],
      ["lǎoshī", "老师"],
      ["jīnnián", "今年"],
      ["60", "60"],
      ["（  ）", "（　　）"],
      ["le.", "了。"],
    ]),
    choices: bank,
    answer: "C",
    explain:
      "年齢は数字のあとに「岁」をつけます。「今年60岁了」は今年60歳になった、です。C。多少は「いくつ」と聞くことばで、ここでは使いません。",
  },
  {
    id: 38,
    part: "R4",
    stem: segs([
      ["Tā", "他"],
      ["hé", "和"],
      ["tā", "他"],
      ["māma", "妈妈"],
      ["dōu", "都"],
      ["（  ）", "（　　）"],
      ["kàn", "看"],
      ["diànshì.", "电视。"],
    ]),
    choices: bank,
    answer: "F",
    explain:
      "「他和他妈妈都喜欢看电视」は「彼もお母さんも、二人ともテレビを見るのが好き」。都は「どちらも」。好きは喜欢です。能だと「二人ともテレビが見られる」になり、この文では不自然です。",
  },
  {
    id: 39,
    part: "R4",
    stem: segs([
      ["Nǚ:", "女："],
      ["Wǒ", "我"],
      ["ài", "爱"],
      ["chī", "吃"],
      ["zhège", "这个"],
      ["cài,", "菜，"],
      ["zhège", "这个"],
      ["cài", "菜"],
      ["（  ）", "（　　）"],
      ["qián?", "钱？"],
      ["Nán:", "男："],
      ["17", "17"],
      ["kuài.", "块。"],
    ]),
    choices: bank,
    answer: "E",
    explain:
      "「这个菜多少钱？」は「この料理はいくら？」。多少钱で値段を聞きます。男の人の「17块」は17元、という答えです。E。里は「中」なので値段には使いません。",
  },
  {
    id: 40,
    part: "R4",
    stem: segs([
      ["Nán:", "男："],
      ["Nǐ", "你"],
      ["zài", "在"],
      ["nǎr?", "哪儿？"],
      ["Wǒ", "我"],
      ["méi", "没"],
      ["kànjiàn", "看见"],
      ["nǐ.", "你。"],
      ["Nǚ:", "女："],
      ["Wǒ", "我"],
      ["zài", "在"],
      ["fàndiàn", "饭店"],
      ["（  ）", "（　　），"],
      ["wǒ", "我"],
      ["kànjiàn", "看见"],
      ["nǐ", "你"],
      ["le.", "了。"],
    ]),
    choices: bank,
    answer: "A",
    explain:
      "男の人は「どこにいるの、見えない」。女の人は「レストランの中にいるよ、あなたが見えた」。里面の「里」が「中」です。「饭店里」でレストランの中。A。看见は見る・目に入る、です。",
  },
];

export const AUDIO_SRC = "/hsk/listening.mp3";

export function questionsIn(scope: "all" | "listen" | "read" | PartId): Question[] {
  return QUESTIONS.filter((q) => {
    if (scope === "all") return true;
    if (scope === "listen") return PARTS[q.part].group === "listen";
    if (scope === "read") return PARTS[q.part].group === "read";
    return q.part === scope;
  });
}
