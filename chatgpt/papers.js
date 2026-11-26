const firstLevelSections = [
  ['音声と写真の正誤判定','音声を聞き、写真と内容が合えば「一致する」、合わなければ「一致しない」を選びましょう。'],
  ['文に合う写真','音声を聞き、文の内容を表す写真を3枚から1枚選びましょう。'],
  ['会話に合う写真','2人の会話を聞き、場面に合う写真をA〜Fから選びましょう。'],
  ['音声を聞いて質問に答える','短い話の後に質問が流れます。答えを中国語の選択肢から1つ選びましょう。'],
  ['単語と写真の正誤判定','中国語の単語を読み、写真と意味が合うかどうかを判断しましょう。'],
  ['文を読んで写真を選ぶ','中国語の文を読み、その場面を表す写真をA〜Fから選びましょう。'],
  ['問いかけと応答','中国語の問いかけを読み、会話の続きとして自然な応答を選びましょう。'],
  ['空欄に入る語','文や会話を読み、かっこに入る語をA〜Fから選びましょう。']
];

const paperCodes=Object.keys(paperCatalog).sort();
const requestedPaper=new URLSearchParams(location.search).get('paper');
const paperId=paperCodes.includes(requestedPaper)?requestedPaper:'H11004';
const level=Number(paperId[1]), advanced=level>1;
const assetDir=paperId==='H11004'?'':'papers/'+paperId+'/';
const useHostedMedia=advanced && location.hostname.endsWith('.chatgpt.site');
const mediaDir=(useHostedMedia?publishedMediaBase:'')+assetDir;
document.title='HSK 学習室 · '+level+'級 過去問 '+paperId;
document.querySelector('#paper-footer').textContent='HSK '+level+'級 · '+paperId;

function loadPaperScript(path){
 return new Promise((resolve,reject)=>{
  const script=document.createElement('script');
  script.src=path;
  script.onload=resolve;
  script.onerror=()=>reject(new Error(path));
  document.head.appendChild(script);
 });
}
const files=advanced?['paper.js']:['data.js','picture-labels.js','notes-ja.js'];
Promise.all([loadPaperScript('levels.js'),...files.map(name=>loadPaperScript(assetDir+name))])
 .then(()=>loadPaperScript('app.js'))
 .catch(()=>{
  const message=document.createElement('p');
  message.className='card load-error';
  message.textContent='問題を読み込めませんでした。ページを再読み込みしてください。';
  document.querySelector('main').replaceChildren(message);
 });
