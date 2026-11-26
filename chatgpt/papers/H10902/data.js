const key = '×××√√BACABEFDBACACCB×√×√√ABCDFCEBDABEAFC'.split('');
const transcript = [
  '她的猫','吃东西','在商店里','再见','请喝茶',
  '儿子爱吃米饭。','我喜欢这个电脑。','我看见她买衣服了。','苹果在桌子上。','北京一年中有三个月很冷。',
  '男：上午去医院看同学的时候，你没买些水果？\n女：我买了不少。',
  '女：你是哪年来中国的？\n男：我？今年，2009年。',
  '男：你的大狗叫什么名字？\n女：叫多多。多多是我的好朋友。',
  '女：李老师的女儿今年二十岁了？\n男：是。她很漂亮。',
  '男：现在几点了？\n女：十点十分。',
  '你好，这个杯子十八块钱。\n问：那个杯子多少钱？',
  '中午我不回家吃饭了，和朋友在饭店吃。\n问：我在哪儿吃午饭？',
  '喂？是王先生吗？\n问：他在做什么？',
  '明天星期一，我去学校。\n问：今天星期几？',
  '他不想坐火车，我们坐飞机去。\n问：他们怎么去？'
];
const readings = [
  ['水','shuǐ'],['读','dú'],['工作','gōngzuò'],['睡觉','shuìjiào'],['椅子','yǐzi'],
  ['这些都是张小姐的。','Zhèxiē dōu shì Zhāng xiǎojiě de.'],
  ['没关系，不会做没关系。','Méi guānxi, bú huì zuò méi guānxi.'],
  ['10月前我回来，再见。','Shí yuè qián wǒ huílai, zàijiàn.'],
  ['对不起，今天天气太热了。','Duìbuqǐ, jīntiān tiānqì tài rè le.'],
  ['妈妈，我不爱吃这个菜。','Māma, wǒ bú ài chī zhège cài.'],
  ['医生！医生在哪儿？','Yīshēng! Yīshēng zài nǎr?'],
  ['谁在说话？','Shéi zài shuōhuà?'],
  ['李先生是什么时候来的？','Lǐ xiānsheng shì shénme shíhou lái de?'],
  ['我们去下面吃？','Wǒmen qù xiàmiàn chī?'],
  ['那几本书怎么样？','Nà jǐ běn shū zěnmeyàng?'],
  ['我在中国（　）了4年了。','Wǒ zài Zhōngguó (　) le sì nián le.'],
  ['爸爸，下雨了，我们怎么回家？（　）出租车吗？','Bàba, xià yǔ le, wǒmen zěnme huí jiā? (　) chūzūchē ma?'],
  ['（　）来这儿学习汉语，我很高兴。','(　) lái zhèr xuéxí Hànyǔ, wǒ hěn gāoxìng.'],
  ['女：（　）你请我看电影。\n男：不客气。','(　) nǐ qǐng wǒ kàn diànyǐng. / Bú kèqi.'],
  ['男：你（　）他？他是谁？\n女：他是我的学生。','Nǐ (　) tā? Tā shì shéi? / Tā shì wǒ de xuésheng.']
];
const listeningOptions = [
  [['7块','qī kuài'],['8块','bā kuài'],['18块','shíbā kuài']],
  [['饭店','fàndiàn'],['家里','jiā li'],['朋友家','péngyou jiā']],
  [['写字','xiě zì'],['看电视','kàn diànshì'],['打电话','dǎ diànhuà']],
  [['星期五','xīngqīwǔ'],['星期六','xīngqīliù'],['星期日','xīngqīrì']],
  [['开车','kāi chē'],['坐飞机','zuò fēijī'],['坐火车','zuò huǒchē']]
];
const replies = [
  ['都很好。','Dōu hěn hǎo.'],['昨天下午。','Zuótiān xiàwǔ.'],['那儿。','Nàr.'],
  ['听你的。','Tīng nǐ de.'],['后面的人。','Hòumian de rén.'],['好的，谢谢！','Hǎo de, xièxie!']
];
const words = [
  ['能','néng'],['住','zhù'],['认识','rènshi'],['名字','míngzi'],['坐','zuò'],['谢谢','xièxie']
];
