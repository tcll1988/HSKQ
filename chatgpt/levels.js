
const layouts={
 1:{count:[20,20],minutes:[15,17],totalMinutes:40},
 2:{count:[35,25],minutes:[25,22],totalMinutes:55,parts:[
  [10,'写真と音声の正誤','√×'],[20,'会話に合う写真','ABCDEF'],[30,'会話の内容理解','ABC'],[35,'長い会話の内容理解','ABC'],
  [40,'文に合う写真','ABCDEF'],[45,'語句の穴埋め','ABCDEF'],[50,'文の正誤','√×'],[60,'会話の組み合わせ','ABCDEF']]},
 3:{count:[40,30,10],minutes:[35,30,15],totalMinutes:90,parts:[
  [10,'会話に合う写真','ABCDEF'],[20,'内容の正誤','√×'],[30,'短い会話の内容理解','ABC'],[40,'長い会話の内容理解','ABC'],
  [50,'会話の組み合わせ','ABCDEF'],[60,'語句の穴埋め','ABCDEF'],[70,'短文読解','ABC'],[75,'語句を並べて文を作る','sentence'],[80,'漢字の穴埋め','character']]},
 4:{count:[45,40,15],minutes:[30,40,25],totalMinutes:105,parts:[
  [10,'内容の正誤','√×'],[25,'短い会話の内容理解','ABCD'],[45,'会話・文章の内容理解','ABCD'],
  [55,'語句の穴埋め','ABCDEF'],[65,'文の並べ替え','order'],[85,'文章読解','ABCD'],[95,'語句を並べて文を作る','sentence'],[100,'写真と指定語を使った作文','essay']]},
 5:{count:[45,45,10],minutes:[30,45,40],totalMinutes:125,parts:[
  [20,'会話の内容理解','ABCD'],[45,'会話・文章の内容理解','ABCD'],[60,'文章の穴埋め','ABCD'],[70,'本文と一致する文','ABCD'],[90,'長文読解','ABCD'],
  [98,'語句を並べて文を作る','sentence'],[100,'約80字の作文','essay']]},
 6:{count:[50,50,1],minutes:[35,50,45],totalMinutes:140,parts:[
  [15,'音声と一致する文','ABCD'],[30,'インタビューの内容理解','ABCD'],[50,'まとまりのある話の内容理解','ABCD'],
  [60,'文法上の誤り','ABCD'],[70,'語句の穴埋め','ABCD'],[80,'文の穴埋め','ABCDE'],[100,'長文読解','ABCD'],[101,'文章の要約','essay']]}
};
function scopeOf(n){
 if(n<=layout.count[0])return 'listen';
 return n<=layout.count[0]+layout.count[1]?'read':'write';
}
function partType(n){
 if(!advanced)return 'choice';
 return layout.parts.find(p=>n<=p[0])[2];
}
function isWritten(n){return ['sentence','essay','character'].includes(partType(n));}
function isManual(n){return partType(n)==='essay';}
function matchesKey(n,value){
 if(!value)return false;
 if(!isWritten(n))return value===key[n-1];
 if(isManual(n))return false;
 const normalize=answer=>answer.normalize('NFKC').replace(/[\s。.!！?？、,，;；：“”「」]/g,'');
 const typed=normalize(value);
 return Boolean(typed)&&key[n-1].split(/[/／]/).some(answer=>normalize(answer)===typed);
}
function isSolved(d,n){
 if(isManual(n))return Boolean(d.checked && d.checked[n]);
 return matchesKey(n,d.answers[n]);
}
function originalPanel(n){
 const pages=book.questionPages[n-1],first=pages[0];
 const pageOptions=Array.from({length:book.pages-1},(_,j)=>`<option value="${j+2}" ${j+2===first?'selected':''}>${j+2}ページ</option>`).join('');
 return `<section class="original"><div class="original-tools"><strong>原題 第${n}問</strong><label>冊子 <select aria-label="問題冊子の表示ページ">${pageOptions}</select></label></div>
 <div class="original-actions"><button type="button" class="page-zoom" aria-pressed="false">拡大する</button>${book.marks[n]?'<button type="button" class="page-locate">この問題の位置へ</button>':''}</div>
 <div class="page-images" tabindex="0" aria-label="問題冊子。スクロールして読めます">${pages.map(i=>pagePicture(i,n)).join('')}</div></section>`;
}
function pagePicture(i,n){
 const path=mediaDir+'pages/'+i+'.webp';
 const mark=book.questionPages[n-1][0]===i&&book.marks[n];
 const pointer=mark?`<span class="printed-marker" aria-hidden="true" style="left:${mark[0]}%;top:${mark[1]}%"></span>`:'';
 return `<a class="printed-page" href="${path}" target="_blank" rel="noopener"><img src="${path}" alt="${paperId} 問題冊子 ${i}ページ。原寸で開く">${pointer}</a>`;
}
function audioPanel(n){
 if(!advanced)return `<div class="player"><span>${icon('headphones')}問題の音声</span><audio aria-label="原題第${n}問の音声" controls preload="metadata" src="${assetDir}audio/q${n}.mp3"></audio><a class="audio-file" href="${assetDir}audio/q${n}.mp3" target="_blank" rel="noopener">再生できない場合は音声ファイルを開く</a></div>`;
 const [start,end]=book.audio[n];
 const related=Object.entries(book.audio).filter(([,v])=>v[0]===start&&v[1]===end).map(([k])=>k);
 const title=related.length>1?`第${related[0]}〜${related[related.length-1]}問の共通音声`:`第${n}問の音声`;
 return `<div class="player"><span>${icon('headphones')}${title}</span><audio aria-label="${title}" controls preload="metadata" src="${mediaDir}listening.mp3#t=${start},${end}"></audio><button class="replay" type="button">この音声を最初から聞く</button><a class="audio-file" href="${mediaDir}listening.mp3#t=${start},${end}" target="_blank" rel="noopener">音声ファイルを開く</a></div>`;
}
function wireOriginal(n){
 const selector=main.querySelector('.original select');
 const viewer=main.querySelector('.page-images'), zoom=main.querySelector('.page-zoom'),locate=main.querySelector('.page-locate');
 function locateQuestion(){
  const marker=viewer.querySelector('.printed-marker');
  if(!marker)return;
  const frame=viewer.getBoundingClientRect(),point=marker.getBoundingClientRect();
  viewer.scrollTop+=point.top-frame.top-20;
  viewer.scrollLeft+=point.left-frame.left-viewer.clientWidth*.12;
 }
 selector.onchange=()=>{
  viewer.innerHTML=pagePicture(Number(selector.value),n);viewer.scrollTop=0;viewer.scrollLeft=0;
  if(locate)locate.disabled=!viewer.querySelector('.printed-marker');
 };
 zoom.onclick=()=>{
  const enlarged=viewer.classList.toggle('enlarged');
  zoom.textContent=enlarged?'元の大きさに戻す':'拡大する';
  zoom.setAttribute('aria-pressed',String(enlarged));
  if(enlarged)locateQuestion();
 };
 if(locate)locate.onclick=locateQuestion;
 const audio=main.querySelector('audio');
 if(!audio)return;
 const [start,end]=book.audio[n];
 const seekStart=()=>{if(Number.isFinite(audio.duration))audio.currentTime=start;};
 if(audio.readyState>=1)seekStart();else audio.addEventListener('loadedmetadata',seekStart,{once:true});
 audio.addEventListener('seeked',()=>{
  if(audio.currentTime<start-.3||audio.currentTime>end+.3)seekStart();
 });
 audio.addEventListener('play',()=>{if(audio.currentTime<start-.3||audio.currentTime>=end-.1)audio.currentTime=start;});
 audio.addEventListener('timeupdate',()=>{if(!audio.paused&&audio.currentTime>=end)audio.pause();});
 main.querySelector('.replay').onclick=()=>{audio.currentTime=start;audio.play().catch(()=>{});};
}
function writingPanel(d,n,reviewing){
 const raw=(d.written||{})[n]||d.answers[n]||'';
 const label=partType(n)==='character'?'空欄に入る漢字':'中国語で解答';
 return `<div class="writing"><label>${label}<textarea id="written" lang="zh-CN" rows="${partType(n)==='essay'?6:2}" ${reviewing?'readonly':''}>${esc(raw)}</textarea></label>
 ${!reviewing&&d.kind==='practice'?'<button class="ghost" id="check-written" type="button">解答を確認する</button>':''}</div>`;
}
function homeHeading(){
 const scopeLinks=Object.keys(ranges).filter(s=>s!=='all').map(scope=>{
  const range=ranges[scope],desc=scope==='listen'?'音声を聞いて答えます。':scope==='read'?'原文を読み、答えを選びます。':'指定された語句や条件に合わせて書きます。';
  return moduleCard(scope,modes[scope],`第${range[0]}〜${range[1]}問`,layout.minutes[['listen','read','write'].indexOf(scope)],scope==='read'?'gold':'mint',scope==='listen'?'headphones':scope==='read'?'book':'paper',desc);
 }).join('');
 return `<div class="crumb">問題演習 <em>/</em> HSK ${level}級</div>${paperSelector('home')}
 <article class="hero"><div class="hero-art" role="presentation"></div><div class="hero-copy"><div class="hero-meta"><span class="level"><i></i> HSK ${level}</span><span class="mono">${paperId}</span></div><h1>HSK ${level}級<br>過去問演習</h1><div class="facts"><span>${icon('paper')}全${total}問</span><span>${icon('clock')}試験時間 約${layout.totalMinutes}分</span></div><a class="solid" href="${launch('all')}">${icon('play')}${startText('all')}</a></div></article>
 <section class="modules"><div class="section-heading"><h2>分野別に練習する</h2></div><div class="module-grid">${scopeLinks}</div></section>
 <details class="guide"><summary>演習の進め方</summary><p>練習モードでは解答後に日本語の理由を読み、正解してから次に進みます。試験モードでは提出後に全問を復習できます。進捗はこの端末に冊子別に保存されます。${level===3?'語順と漢字は自動採点されます。':level>=4?'自由作文・要約は、解答例と日本語の解説で自己確認します。':''}</p></details>
 <div class="paper-link">${icon('paper')}<div><strong>中国語の問題冊子（原本）</strong><small>${paperId} · PDF · 全${advanced?book.pages:10}ページ</small></div><a href="${mediaDir}student.pdf" target="_blank" rel="noopener">PDFを開く</a></div>`;
}
