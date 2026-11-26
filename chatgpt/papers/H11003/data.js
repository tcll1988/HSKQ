const key = [
 '×√√××','CACBC','EFABD','ACABB',
 '×√√√×','BAFCD','DCAEB','EFCBA'
].join('').split('');
const transcript = [
 '太热了','三个杯子','读书','吃菜','在医院',
 '我会做饭。','你好，这个电视多少钱？','他妈妈是医生。','我今天开车回家。','这个衣服太小了。',
 '男：这儿怎么了？\n女：这里很多年没下雨了。',
 '女：再见。\n男：好，星期日火车站见。',
 '男：这些字是你写的？很漂亮！\n女：谢谢你！',
 '女：不能在这儿睡觉，去里面睡。\n女：五分钟，我睡五分钟。',
 '男：这一块钱不是你的吗？对不起。\n女：没关系。',
 '我喜欢狗，不太喜欢猫。\n问：他喜欢什么？',
 '小赵在那儿工作了七年，认识很多朋友。\n问：小赵在那儿工作了几年？',
 '你的那本书？在桌子上。\n问：那本书在哪儿？',
 '下午我不在家，你明天来好吗？\n问：他什么时候在家？',
 '他儿子今年二十岁，是个大学生。\n问：他儿子多大了？'
];
const readings = [
 ['听','tīng'],['米饭','mǐfàn'],['高兴','gāoxìng'],['九点','jiǔ diǎn'],['学习','xuéxí'],
 ['李老师在打电话呢。','Lǐ lǎoshī zài dǎ diànhuà ne.'],
 ['家里有很多苹果。','Jiā lǐ yǒu hěn duō píngguǒ.'],
 ['我们去前面那个饭馆儿吃饭，怎么样？','Wǒmen qù qiánmiàn nàge fànguǎnr chī fàn, zěnmeyàng?'],
 ['我和女儿都爱看电影。','Wǒ hé nǚ’ér dōu ài kàn diànyǐng.'],
 ['不客气，王先生，请坐。','Bú kèqì, Wáng xiānsheng, qǐng zuò.'],
 ['哪个是你的同学？','Nǎge shì nǐ de tóngxué?'],
 ['你汉语怎么样？','Nǐ Hànyǔ zěnmeyàng?'],
 ['你看见张小姐了吗？','Nǐ kànjiàn Zhāng xiǎojiě le ma?'],
 ['对不起，他们是谁？','Duìbuqǐ, tāmen shì shéi?'],
 ['你现在住在哪儿？','Nǐ xiànzài zhù zài nǎr?'],
 ['中国人喜欢喝（　）。','Zhōngguórén xǐhuan hē (　).'],
 ['喂，中午你买什么（　）了？','Wéi, zhōngwǔ nǐ mǎi shénme (　) le?'],
 ['他少（　）了一个零。','Tā shǎo (　) le yí ge líng.'],
 ['女：你开出租车（　）年了？\n男：十几年了。','Nǐ kāi chūzūchē (　) nián le? / Shíjǐ nián le.'],
 ['男：北京昨天天气怎么样？\n女：很（　）。','Běijīng zuótiān tiānqì zěnmeyàng? / Hěn (　).']
];
const listeningOptions = [
 [['狗','gǒu'],['猫','māo'],['猫和狗','māo hé gǒu']],
 [['0','líng'],['6年','liù nián'],['7年','qī nián']],
 [['桌子上','zhuōzi shang'],['椅子上','yǐzi shang'],['电脑后面','diànnǎo hòumiàn']],
 [['上午','shàngwǔ'],['明天','míngtiān'],['下个月','xià ge yuè']],
 [['8岁','bā suì'],['20岁','èrshí suì'],['40岁','sìshí suì']]
];
const replies = [
 ['没。','Méi.'],['学校里。','Xuéxiào lǐ.'],['会说一些。','Huì shuō yìxiē.'],
 ['这个。','Zhège.'],['我爸爸妈妈。','Wǒ bàba māma.'],['好的，谢谢！','Hǎo de, xièxie!']
];
const words = [
 ['冷','lěng'],['多少','duōshao'],['写','xiě'],['名字','míngzi'],['茶','chá'],['东西','dōngxi']
];
