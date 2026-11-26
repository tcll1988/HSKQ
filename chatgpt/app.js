const main = document.querySelector('main');
const dialog = document.querySelector('dialog');
const modes = {all:'全40問の通し演習',listen:'リスニング',read:'読解'};
const ranges = {all:[1,40],listen:[1,20],read:[21,40]};
const storeKey = 'hsk-room-'+paperId+'-v1';
let state;
try { state = JSON.parse(localStorage.getItem(storeKey)) || {}; } catch { state = {}; }
state.drafts = state.drafts || {};
state.history = state.history || [];
let storageOK=true;
const save=()=>{try{localStorage.setItem(storeKey,JSON.stringify(state));}catch{storageOK=false;}};
const ids = mode=>Array.from({length:ranges[mode][1]-ranges[mode][0]+1},(_,i)=>ranges[mode][0]+i);
const choices = n => n<=5 || (n>=21 && n<=25) ? ['√','×'] : [...(n<=10 || (n>=16 && n<=20) ? 'ABC':'ABCDEF')];
const iconPaths = {
 headphones:'<path d="M4 14v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="12" width="4" height="8" rx="2"/><rect x="17" y="12" width="4" height="8" rx="2"/>',
 book:'<path d="M12 6c-3-2-6-2-10-1v14c4-1 7-1 10 1 3-2 6-2 10-1V5c-4-1-7-1-10 1v14"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
 paper:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/>',
 layers:'<path d="m3 8 9-5 9 5-9 5-9-5Zm1 5 8 4 8-4M4 17l8 4 8-4"/>',
 play:'<path d="m8 5 10 7-10 7Z" fill="currentColor" stroke="none"/>',
 flag:'<path d="M5 21V4c5-4 9 4 14 0v10c-5 4-9-4-14 0"/>',
 tick:'<path d="m4 11 5 5 11-11"/>',
 history:'<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6M12 7v5l3 2"/>'
};
function icon(name){return '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+iconPaths[name]+'</svg>';}
function section(n){return Math.floor((n-1)/5);}

const sessionLabels = {practice:'練習モード', exam:'試験モード'};
const orderLabels = {original:'原題順', random:'ランダム順'};
function draftId(scope,kind,order){return [scope,kind,order].join('/');}
function validSettings(scope,kind,order){
 return Object.prototype.hasOwnProperty.call(modes,scope) &&
   Object.prototype.hasOwnProperty.call(sessionLabels,kind) &&
   Object.prototype.hasOwnProperty.call(orderLabels,order);
}
function questionOrder(scope,order){
 const list=ids(scope);
 if(order==='random'){
  for(let i=list.length-1;i>0;i--){
   const j=Math.floor(Math.random()*(i+1));
   [list[i],list[j]]=[list[j],list[i]];
  }
  if(list.every((n,i)=>n===ranges[scope][0]+i)) list.push(list.shift());
 }
 return list;
}
function openSession(scope,kind,order){
 const id=draftId(scope,kind,order);
 if(!state.drafts[id]){
  const sequence=questionOrder(scope,order);
  state.drafts[id]={mode:scope,kind,order,sequence,at:sequence[0],answers:{},first:{}};
 }
 state.preferences[scope]={kind,order};
 save();
 const target='#run/'+id;
 if(location.hash===target)route();else location.hash=target;
}
function migrateDrafts(){
 state.preferences=state.preferences||{};
 for(const scope of Object.keys(modes)){
  const old=state.drafts[scope];
  if(!old)continue;
  const id=draftId(scope,'exam','original');
  if(!state.drafts[id]){
   state.drafts[id]={...old,mode:scope,kind:'exam',order:'original',sequence:ids(scope),first:{}};
  }
  if(Object.keys(old.answers||{}).length)state.preferences[scope]={kind:'exam',order:'original'};
  delete state.drafts[scope];
 }
}
function setup(scope){
 const pref=state.preferences[scope]||{kind:'practice',order:'original'};
 const radio=(name,value,title,description,checked)=>`<label class="setting-option"><input type="radio" name="${name}" value="${value}" ${checked?'checked':''}><span><strong>${title}</strong><small>${description}</small></span></label>`;
 main.innerHTML=`<div class="crumb"><a href="#home">問題演習</a><em>/</em>${modes[scope]}</div>
  <div class="quiz-head"><div><small class="micro">${paperId} · ${ids(scope).length}問</small><h1>${modes[scope]}</h1></div></div>
  <form id="session-settings" class="card settings">
   <fieldset><legend>学習モード</legend><div class="setting-grid">
   ${radio('kind','practice',sessionLabels.practice,'解答すると、正解とその理由が日本語で表示されます。間違えたら選び直してから進みます。',pref.kind==='practice')}
   ${radio('kind','exam',sessionLabels.exam,'提出するまで正誤は表示されません。問題を行き来して、解答を見直せます。',pref.kind==='exam')}</div></fieldset>
   <fieldset><legend>出題順</legend><div class="setting-grid">
   ${radio('order','original',orderLabels.original,'問題冊子と同じ順番で解きます。',pref.order==='original')}
   ${radio('order','random',orderLabels.random,'選んだ範囲の問題を並べ替えます。',pref.order==='random')}</div></fieldset>
   <p class="session-status" aria-live="polite"></p><button class="solid" type="submit"></button>
  </form>`;
 const form=main.querySelector('form');
 function update(){
  const {kind,order}=form.elements;
  const d=state.drafts[draftId(scope,kind.value,order.value)];
  form.querySelector('.session-status').textContent=d?`保存済みの続き：${d.sequence.indexOf(d.at)+1}問目 ／ 全${d.sequence.length}問`:'';
  form.querySelector('button').textContent=d?'続きから解く':kind.value==='practice'?'練習を始める':'試験を始める';
 }
 form.onchange=update;
 form.onsubmit=e=>{e.preventDefault();openSession(scope,form.elements.kind.value,form.elements.order.value);};
 update();
}

function stats(r){return ids(r.mode).filter(n=>r.answers[n]===key[n-1]).length;}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function img(id){return '<img src="'+assetDir+'pictures/'+id+'.webp" alt="'+esc((window.pictureLabels && window.pictureLabels[id]) || '問題の写真')+'">';}
function launch(mode){return '#practice/'+mode;}
function startText(mode){return mode==='all' ? '全40問を解く' : '問題を解く';}
function moduleCard(mode,name,eng,mins,style,ico,details){return '<a class="module '+style+'" href="'+launch(mode)+'"><div class="module-top"><span class="module-icon">'+icon(ico)+'</span><span class="module-en">'+eng+'</span></div><h3>'+name+'</h3><p>'+details+'</p><div class="module-bottom"><span>20問 <b>·</b> '+mins+'分</span><span class="module-link">'+startText(mode)+'</span></div></a>';}
function paperSelector(view){
 const links=paperCodes.map(code=>{
  const current=code===paperId;
  return `<a href="?paper=${code}#${view}"${current?' aria-current="page"':''}>${code}</a>`;
 }).join('');
 return `<nav class="paper-selector" aria-label="問題冊子を選ぶ"><strong>問題冊子を選ぶ</strong><div>${links}</div></nav>`;
}
function home(){
 main.innerHTML='<div class="crumb">問題演習 <em>/</em> HSK 1級</div>'+paperSelector('home')+'<article class="hero"><div class="hero-art" role="presentation"></div><div class="hero-copy"><div class="hero-meta"><span class="level"><i></i> HSK 1</span><span class="mono">'+paperId+'</span></div><h1>HSK 1級<br>過去問演習</h1><div class="facts"><span>'+icon('paper')+'全40問</span><span>'+icon('clock')+'試験時間 約40分</span></div><a class="solid" href="'+launch('all')+'">'+icon('play')+startText('all')+'</a></div></article><section class="modules"><div class="section-heading"><div><h2>分野別に練習する</h2><p>各20問。苦手な分野から取り組めます。</p></div></div><div class="module-grid">'+moduleCard('listen','リスニング','第1〜20問','約15','mint','headphones','単語・文・会話を聞き、写真や答えを選びます。')+moduleCard('read','読解','第21〜40問','17','gold','book','ピンインを手がかりに、短い文や会話を読みます。')+'</div></section><details class="guide"><summary>初めての方へ：演習の進め方</summary><ol><li>通し演習または分野を選び、学習モードと出題順を設定します。どちらのモードも時間制限はありません。</li><li>リスニングでは再生ボタンを押します。各問の音声には同じ内容が2回収録されており、何度でも聞き直せます。</li><li>練習モードでは、間違えると正解が表示されます。正しい選択肢を自分で選ぶと次に進めます。成績は初回の解答で集計します。</li><li>試験モードでは、提出前に解答を見直せます。終了後はどちらのモードでも日本語訳と解説を読めます。学習履歴は同じ端末のブラウザーに保存されます。</li></ol></details><div class="paper-link">'+icon('paper')+'<div><strong>中国語の問題冊子（原本）</strong><small>'+paperId+' · PDF · 全10ページ</small></div><a href="'+assetDir+'student.pdf" target="_blank" rel="noopener">PDFを開く</a></div>';
}
function options(n){
 const list=choices(n);let text;
 if(n>=16&&n<=20)text=listeningOptions[n-16];
 if(n>=31)text=n<=35?replies:words;
 return list.map((v,i)=>{
  let photo='';
  if(n>=6&&n<=10)photo='q'+n+'-'+v;
  if(n>=11&&n<=15)photo='bank11-'+v;
  if(n>=26&&n<=30)photo='bank26-'+v;
  return {v,photo,body:photo?img(photo):text?'<span lang="zh-CN"><small lang="zh-Latn">'+text[i][1]+'</small>'+text[i][0]+'</span>':'<span>'+(v==='√'?'一致する':'一致しない')+'</span>'};
 });
}


function explanationFor(n){
 const [translation,reason,detail]=studyNotes[n-1];
 const source=n<=20?transcript[n-1]:readings[n-21][0];
 return `<div class="answer-reason"><strong>正解の理由</strong><p>${esc(reason)}</p><p>${esc(detail)}</p></div>
 <div class="source-note"><h4>${n<=20?'音声の原文':'問題文'}</h4><p lang="zh-CN">${esc(source)}</p><h4>日本語訳</h4><p>${esc(translation)}</p></div>`;
}
function resultExplanations(record,seq,firstOpen){
 const items=seq.map((n,index)=>{
  const answer=record.answers[n],correct=key[n-1],status=!answer?'未解答':answer===correct?'正解':'不正解';
  return `<details class="question-detail" data-original="${n}" ${n===firstOpen?'open':''}><summary>${index+1}問目（原題 第${n}問）・${status}</summary>
  <div class="detail-body"><p>${record.kind==='practice'?'初回の解答':'あなたの解答'}：${esc(answer||'未解答')}　正解：${correct}</p>
  ${explanationFor(n)}
  <a class="textlink" href="#review/${record.id}/${n}">問題と選択肢を見直す</a></div></details>`;
 });
 return `<section class="card all-explanations"><h2>全${seq.length}問の解説</h2>${items.join('')}</section>`;
}


function quiz(d,reviewing=false){
 const scope=d.mode, seq=d.sequence||ids(scope);
 const guided=!reviewing&&d.kind==='practice';
 const target=Number(location.hash.split('/')[2]);
 const n=reviewing?(seq.includes(target)?target:seq[0]):d.at;
 const pos=seq.indexOf(n), s=section(n), group=sections[s], opts=options(n), correct=key[n-1];
 const label=reviewing?'解答・解説':sessionLabels[d.kind];
 const picture=n<=5||n>=21&&n<=25;
 const reading=readings[n-21];
 const prompt=reading?`<div class="prompt" lang="zh-CN"><small lang="zh-Latn">${reading[1]}</small><strong>${reading[0]}</strong></div>`:'';
 const audio=n<=20?`<div class="player"><span>${icon('headphones')}問題の音声</span><audio aria-label="原題第${n}問の音声" controls preload="metadata" src="${assetDir}audio/q${n}.mp3"></audio><a class="audio-file" href="${assetDir}audio/q${n}.mp3" target="_blank" rel="noopener">再生できない場合は音声ファイルを開く</a></div>`:'';
 function unlocked(){
  if(!guided)return seq.length;
  const first=seq.findIndex(i=>d.answers[i]!==key[i-1]);
  return first===-1?seq.length:first;
 }
 const submitText=guided?'練習を終了する':'採点する';
 const submitButton=`<button class="solid" data-submit>${submitText}</button>`;
 const buttons=opts.map(o=>`<button type="button" class="option ${o.photo?'pic-option':''}" data-pick="${o.v}" aria-pressed="false"><span class="letter">${o.v}</span>${o.body}</button>`).join('');
 const numbers=seq.map((id,j)=>`<button data-go="${id}" class="num ${pos===j?'current':''}">${j+1}</button>`).join('');
 const reason=explanationFor(n);
 const review=reviewing?`<aside class="explain"><h3>${!d.answers[n]?'未解答':d.answers[n]===correct?'正解です':'不正解です'}</h3>
   <p>${d.kind==='practice'?'初回の解答':'あなたの解答'}：${d.answers[n]||'未解答'}　正解：${correct}</p>
   ${reason}</aside>`:'';
 const exitLink=reviewing?'#result/'+d.id:launch(scope);
 const last=pos===seq.length-1;
 const forward=last?(reviewing?`<a class="solid" href="${exitLink}">結果を見る</a>`:submitButton):`<button class="solid" data-go="${seq[pos+1]}">次の問題</button>`;
 main.innerHTML=`<div class="crumb"><a href="#home">問題演習</a><em>/</em>${modes[scope]}<em>/</em>${label}</div>
 <div class="quiz-head"><div><small class="micro">${paperId} · ${orderLabels[d.order||'original']}</small><h1>${label}</h1></div>
 <a class="textlink" href="${exitLink}">${reviewing?'結果に戻る':(storageOK?'保存して設定に戻る':'設定に戻る')}</a></div>
 <div class="quiz-grid"><article class="card question"><div class="qhead"><span>${n<=20?'リスニング':'読解'}・パート${s%4+1}（原題 第${n}問）</span><b>${pos+1} / ${seq.length}</b></div>
 <h2>${group[0]}</h2><p class="instruction">${group[1]}</p>${audio}${prompt}${picture?`<div class="single-photo">${img('q'+n)}</div>`:''}
 <div class="options ${opts[0].photo?'photos':''}">${buttons}</div>
 ${guided?'<div class="practice-feedback" role="status" aria-live="polite" aria-atomic="true"></div>':''}${review}
 <div class="step"><button class="ghost" data-go="${pos?seq[pos-1]:0}">前の問題</button>${forward}</div></article>
 <aside class="card sheet"><h2>${icon('layers')}問題一覧</h2><p class="sheet-count"></p><progress aria-label="問題の進捗" max="${seq.length}"></progress><div class="numbers">${numbers}</div>
 ${reviewing?'<p>番号は出題順です。緑は正解、オレンジは不正解・未解答です。</p>':(guided?'<p>正解すると次の問題に進めます。</p>':'<button class="ghost wide" data-submit>採点する</button>')+'<small class="save-note"></small>'}</aside></div>`;
 function refresh(){
  const selected=d.answers[n], limit=unlocked(), solved=selected===correct;
  const count=reviewing?stats(d):guided?limit:seq.filter(i=>d.answers[i]).length;
  main.querySelector('.sheet-count').textContent=`${reviewing?'正解':guided?'クリア':'解答済み'} ${count} / ${seq.length}問`;
  main.querySelector('progress').value=count;
  main.querySelectorAll('[data-pick]').forEach(b=>{
   const val=b.dataset.pick, reveal=reviewing||guided&&!!selected;
   b.classList.toggle('selected',!reveal&&val===selected);
   b.classList.toggle('wrong',reveal&&val===selected&&!solved);
   b.classList.toggle('correct',reveal&&val===correct);
   b.setAttribute('aria-pressed',val===selected?'true':'false');
   b.disabled=reviewing||guided&&solved;
  });
  main.querySelectorAll('[data-go]').forEach(b=>{
   const dest=Number(b.dataset.go),index=seq.indexOf(dest);
   b.disabled=index<0||index>limit;
   if(!b.classList.contains('num'))return;
   const hit=d.answers[dest]===key[dest-1];
   b.classList.toggle('done',!reviewing&&(guided?hit:!!d.answers[dest]));
   b.classList.toggle('good',reviewing&&hit);b.classList.toggle('bad',reviewing&&!hit);
   b.setAttribute('aria-label',`${index+1}問目、原題第${dest}問、${b.disabled?'未開放':reviewing?(hit?'正解':d.answers[dest]?'不正解':'未解答'):guided&&hit?'クリア':d.answers[dest]?'解答済み':'未解答'}`);
  });
  main.querySelectorAll('[data-submit]').forEach(b=>{b.disabled=guided&&limit<seq.length;});
  if(!reviewing)main.querySelector('.save-note').textContent=storageOK?'進捗はこのブラウザーに自動保存されます。':'このページを閉じると進捗は消去されます。';
  if(guided){
   const fb=main.querySelector('.practice-feedback');
   fb.className='practice-feedback'+(selected?(solved?' is-right':' is-wrong'):'');
   if(!selected){fb.textContent='';return;}
   if(solved){
    const next=last?'練習を終了して結果を確認しましょう。':'次の問題に進めます。';
    fb.innerHTML=`<strong>正解です。</strong>${reason}<p class="feedback-next">${next}</p>`;
   }else{
    const option=opts.find(o=>o.v===correct);
    fb.innerHTML=`<strong>正解は ${correct} です。</strong>
     <div class="feedback-answer"><span class="letter">${correct}</span>${option.body}</div>
     ${reason}<p class="feedback-next">正しい選択肢を選び直してください。</p>`;
   }
  }
 }
 main.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{
  if(reviewing||guided&&d.answers[n]===correct)return;
  if(guided&&!d.first[n])d.first[n]=b.dataset.pick;
  d.answers[n]=b.dataset.pick;save();refresh();
 });
 main.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{
  const go=Number(b.dataset.go), index=seq.indexOf(go);
  if(index<0||index>unlocked())return;
  if(reviewing){location.hash='review/'+d.id+'/'+go;return;}
  d.at=go;save();quiz(d);window.scrollTo(0,0);main.focus({preventScroll:true});
 });
 main.querySelectorAll('[data-submit]').forEach(b=>b.onclick=()=>{
  if(guided&&unlocked()<seq.length)return;
  function finish(){
   const id=draftId(scope,d.kind,d.order);
   if(state.drafts[id]!==d)return;
   const record={id:Date.now().toString(),date:Date.now(),mode:scope,kind:d.kind,order:d.order,sequence:seq.slice(),answers:{...(guided?d.first:d.answers)}};
   state.history.unshift(record);delete state.drafts[id];save();location.hash='result/'+record.id;
  }
  if(guided){finish();return;}
  const missing=seq.filter(i=>!d.answers[i]).length;
  ask('解答を提出しますか？',missing?`未解答の問題が${missing}問あります。このまま提出すると未解答として採点されます。`:`全${seq.length}問に解答しました。提出すると結果と解説を確認できます。`,finish);
 });
 refresh();
}

function ask(title,msg,action){
 if(typeof dialog.showModal!=='function'){
  if(window.confirm(title+'\n'+msg)) action();
  return;
 }
 document.querySelector('#dialog-title').textContent=title;document.querySelector('#dialog-text').textContent=msg;document.querySelector('#cancel').onclick=()=>dialog.close();document.querySelector('#accept').onclick=()=>{dialog.close();action();};dialog.showModal();}
function attemptLabel(r){
 return r.kind ? sessionLabels[r.kind]+'・'+orderLabels[r.order] : '従来の演習・原題順';
}
function renderHistory(){
 const list=state.history.map(r=>'<a class="history-row" href="#result/'+r.id+'"><span><b>'+modes[r.mode]+'</b><small>'+attemptLabel(r)+' · '+new Date(r.date).toLocaleString('ja-JP',{hour12:false})+' · '+paperId+'</small></span><strong>'+stats(r)+' / '+ids(r.mode).length+'</strong></a>').join('');
 main.innerHTML='<div class="crumb"><a href="#home">問題演習</a><em>/</em>学習履歴</div><div class="quiz-head"><h1>学習履歴</h1></div>'+paperSelector('history')+'<section class="card history">'+(list||'<div class="empty">'+icon('history')+'<h2>学習履歴はまだありません</h2><p>演習を提出すると、ここから結果と各問の日本語解説を確認できます。</p><a class="solid" href="#home">問題を選ぶ</a></div>')+'</section>';
}
function result(r){
 const seq=r.sequence||ids(r.mode),score=stats(r),blanks=seq.filter(n=>!r.answers[n]).length,miss=seq.find(n=>r.answers[n]!==key[n-1]);
 const rows=sections.map((g,i)=>{const group=seq.filter(n=>section(n)===i);return group.length?'<div class="result-row"><span>'+g[0]+'</span><b>'+group.filter(n=>r.answers[n]===key[n-1]).length+' / '+group.length+'</b></div>':'';}).join('');
 main.innerHTML='<div class="crumb"><a href="#history">学習履歴</a><em>/</em>今回の結果</div><div class="quiz-head"><div><small class="micro">'+paperId+' · '+modes[r.mode]+' · '+attemptLabel(r)+'</small><h1>演習結果</h1></div></div><div class="quiz-grid"><section class="card result"><span class="micro">'+(r.kind==='practice'?'初回で正解した問題':'正解数')+'</span><div class="score">'+score+' <small>/ '+seq.length+'</small></div><p>'+(r.kind==='practice'?'全問クリア。選び直して正解した問題は'+(seq.length-score)+'問です。':'正解 '+score+'問　不正解 '+(seq.length-score-blanks)+'問　未解答 '+blanks+'問')+'</p><div class="actions"><a class="solid" href="#review/'+r.id+'/'+(miss||seq[0])+'">'+(miss?'間違えた問題・未解答から復習':'解答・解説を見る')+'</a><a class="ghost" href="'+launch(r.mode)+'">もう一度解く</a></div></section><section class="card sheet"><h2>問題形式別の成績</h2>'+rows+'</section></div>'+resultExplanations(r,seq,miss||seq[0]);
}
function route(){
 const [view='home',param,kind,order]=location.hash.slice(1).split('/');
 const r=state.history.find(h=>h.id===param);
 if(dialog.open)dialog.close();
 if(view==='practice'&&Object.prototype.hasOwnProperty.call(modes,param)){setup(param);}
 else if(view==='run'&&validSettings(param,kind,order)){
  const d=state.drafts[draftId(param,kind,order)];
  if(d)quiz(d);else setup(param);
 }
 else if(view==='result'&&r)result(r);
 else if(view==='review'&&r)quiz(r,true);
 else if(view==='history')renderHistory();
 else home();
 const past=['result','review','history'].includes(view);
 document.querySelector('#nav-home').classList.toggle('active',!past);document.querySelector('#nav-history').classList.toggle('active',past);
 window.scrollTo(0,0);
}
migrateDrafts();
window.addEventListener('hashchange',()=>{route();main.focus({preventScroll:true});});route();
