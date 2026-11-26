const key = '√√×××AABBCABDEFCBACC××√√√BAFCDDECBACFEBA'.split('');
const transcript = [
  '一块儿苹果','写字','开出租车','做饭','没关系',
  '她喜欢上午喝杯茶。','狗狗，你看电脑里是什么？','我今年十六岁了。','这是小猫爱吃的东西。','这些书你都读了吗？',
  '男：能看见儿子在哪儿吗？\n女：在那儿，我看见他了。',
  '女：太漂亮了！谢谢你！\n男：不客气。',
  '男：现在几点了？\n女：现在六点三十五。',
  '女：喂，你好，是小李吗？\n男：小李？对不起，我不是小李。',
  '男：这上面没有我的名字。\n女：有，在这儿呢，下面。',
  '在飞机上，爸爸听见后面有人叫他。\n问：谁在飞机上？',
  '我的电话是二七九零。\n问：他的电话是多少？',
  '我要这几本书，多少钱？\n问：他在买什么？',
  '下午我们去火车站，有个朋友来北京住几天。\n问：他们下午去哪儿？',
  '现在是十一月十一日十一点十一分。\n问：现在几点了？'
];
const readings = [
  ['先生','xiānsheng'],['坐','zuò'],['喝','hē'],['衣服','yīfu'],['请','qǐng'],
  ['我想睡觉了，再见。','Wǒ xiǎng shuìjiào le, zàijiàn.'],
  ['这是我买的桌子和椅子。','Zhè shì wǒ mǎi de zhuōzi hé yǐzi.'],
  ['他今天很不高兴。','Tā jīntiān hěn bù gāoxìng.'],
  ['现在十点多了。','Xiànzài shí diǎn duō le.'],
  ['王小姐，是你的电话。','Wáng xiǎojiě, shì nǐ de diànhuà.'],
  ['谁会说汉语？','Shéi huì shuō Hànyǔ?'],
  ['你们学校有多少老师？','Nǐmen xuéxiào yǒu duōshao lǎoshī?'],
  ['昨天下雨了吗？','Zuótiān xià yǔ le ma?'],
  ['他们什么时候回来？','Tāmen shénme shíhou huílai?'],
  ['你去北京学习几天？','Nǐ qù Běijīng xuéxí jǐ tiān?'],
  ['我妈妈喜欢吃中国（　）。','Wǒ māma xǐhuan chī Zhōngguó (　).'],
  ['我朋友在前面那个商店（　）。','Wǒ péngyou zài qiánmiàn nàge shāngdiàn (　).'],
  ['天气很冷，喝点儿（　）水吧。','Tiānqì hěn lěng, hē diǎnr (　) shuǐ ba.'],
  ['女：你们是怎么（　）的？\n男：她是我大学同学。','Nǐmen shì zěnme (　) de? / Tā shì wǒ dàxué tóngxué.'],
  ['男：昨天的电影（　）？\n女：我没去看电影，我在家看电视了。','Zuótiān de diànyǐng (　)? / Wǒ méi qù kàn diànyǐng, wǒ zài jiā kàn diànshì le.']
];
const listeningOptions = [
  [['医生','yīshēng'],['学生','xuésheng'],['爸爸','bàba']],
  [['9270',''],['2790',''],['7290','']],
  [['书','shū'],['苹果','píngguǒ'],['杯子','bēizi']],
  [['北京','Běijīng'],['饭馆儿','fànguǎnr'],['火车站','huǒchēzhàn']],
  [['1点','1 diǎn'],['7点','7 diǎn'],['11点','11 diǎn']]
];
const replies = [
  ['一个星期。','Yí ge xīngqī.'],['明天中午。','Míngtiān zhōngwǔ.'],['没有。','Méiyǒu.'],
  ['我女儿。','Wǒ nǚ’ér.'],['84个。','84 ge.'],['好的，谢谢！','Hǎo de, xièxie!']
];
const words = [
  ['怎么样','zěnmeyàng'],['认识','rènshi'],['菜','cài'],['名字','míngzi'],['热','rè'],['工作','gōngzuò']
];
