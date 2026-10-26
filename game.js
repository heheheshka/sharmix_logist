'use strict';
// To activate the second result-screen button, replace the address below.
const SHARMIX_URL = 'https://wiki.skbkontur.ru/pages/viewpage.action?pageId=1043631326'; // e.g. 'https://your-company.example/sharmixes'

const MEDIA = window.matchMedia('(max-width: 760px)');
const HEROES = [
  {id:'dog',name:'Корги',bg:'bg/dog.png',mobile:'mobile/mobile_dog_bg.png',stand:'elements/dog_stand.png',runs:['elements/dog_run_1.png','elements/dog_run_2.png','elements/dog_run_3.png'],height:135},
  {id:'moto',name:'Мотоциклист',bg:'bg/moto.png',mobile:'mobile/mobile_moto_bg.png',stand:'elements/moto_stand.png',runs:['elements/moto_run_1.png','elements/moto_run_2.png'],height:128},
  {id:'wolf',name:'Волк',bg:'bg/wolf.png',mobile:'mobile/mobile_wolf_bg.png',stand:'elements/volk_stand.png',runs:['elements/volk_run_2.png','elements/volk_run_3.png'],height:122},
  {id:'truck',name:'Грузовик',bg:'bg/truck.png',mobile:'mobile/mobile_truck_bg.png',stand:'elements/gruzovik_stand.png',runs:['elements/gruzovik_run_1.png','elements/gruzovik_run_2.png'],height:130}
];
const CHARMS = [
  {file:'charms_normalized/1_guru.png',category:0,name:'Гуру заботы'},
  {file:'charms_normalized/2_volshebnik.png',category:0,name:'Эмпатичный волшебник'},
  {file:'charms_normalized/3_molnia.png',category:0,name:'Молниеносная поддержка'},
  {file:'charms_normalized/4_next.png',category:1,name:'Next level'},
  {file:'charms_normalized/5_genium.png',category:1,name:'Универсальный гений'},
  {file:'charms_normalized/6_best.png',category:1,name:'Лучший в своем деле'},
  {file:'charms_normalized/7_hero.png',category:2,name:'Герой отчетности'},
  {file:'charms_normalized/8_vibe.png',category:2,name:'Ответственный за вайб'},
  {file:'charms_normalized/9_master.png',category:2,name:'Мастер перевоплощений'}
];
const PHRASES = [
  [
    'Забота о клиентах сегодня самый востребованный груз!',
    'Клиентам повезло: сегодня внеплановое пополнение запасов заботы!',
    'На складе избыток заботы. Срочно отправить клиентам!',
    'Прибыла крупная партия эмпатии!'
  ],
  [
    'Осторожно при разгрузке: внутри очень много знаний!',
    'Запасы экспертизы успешно пополнены!',
    'На складе обнаружен стратегический запас профессионализма.',
    'Экспертиза прибыла в полном объеме. Можно брать задачи посложнее!'
  ],
  [
    'Командный дух доставлен в особо крупных размерах!',
    'Такой груз в одиночку не разобрать — слишком много вайба!',
    'Внимание, хрупкий груз: атмосфера доверия и взаимопомощи.',
    'На складе переизбыток хорошего вайба. Но жалоб пока не поступало!'
  ],
  [
    'Редкая поставка: все три направления в идеальной комплектации!',
    'Идеальный баланс! Забота, экспертиза и поддержка доставлены в равных долях.'
  ],
  ['Маршрут разведан, теперь можно возвращаться за шармиксами!']
];
const TUTORIAL = [
  {title:'Сначала освой управление',desc:'Перемещай героя влево и вправо, чтобы ловить падающие предметы.',type:'charm'},
  {title:'Лови шармиксы!',desc:'Каждый приносит 10 очков. Пропускать их нельзя.',type:'charm'},
  {title:'Бонусная доставка',desc:'Посылка принесет 25 очков.',type:'box'},
  {title:'Осторожно',desc:'Ошибки отнимают жизни. Уворачивайся.',type:'error'},
  {title:'Письмо поддержки',desc:'Восстанавливает одну жизнь.',type:'letter'}
];
const ITEM_IMAGES = {box:'elements/box.png',letter:'elements/letter.png',error:'elements/error.png',shield:'elements/shield.png'};
const IMG = {};
const SOUND_FILES={charm:'pickup.wav',box:'box.wav',error:'error.wav',letter:'heal.wav',shield:'boost.wav',double:'boost.wav',finish:'finish.wav',click:'click.wav'};
// Flowerbed Fields by Zane Little Music, licensed CC0 (OpenGameArt).
// For a self-contained/offline site, download flowerbed_fields.ogg into assets/audio/.
// Without that file the player tries the official OpenGameArt media address when enabled.
const MUSIC_LOCAL='assets/audio/flowerbed_fields.ogg';
const MUSIC_ONLINE='https://opengameart.org/sites/default/files/flowerbed_fields.ogg';
const MUSIC_VOLUME=0.10; // Quiet background music (10%); collectible sound effects are unchanged.
const sound={enabled:false,music:null,players:{},onlineFallback:false};
function initAudio(){
 for(const [key,name] of Object.entries(SOUND_FILES)){const a=new Audio('assets/audio/'+name);a.preload='auto';sound.players[key]=a;}
 const bg=new Audio(MUSIC_LOCAL);
 bg.loop=true;
 bg.volume=MUSIC_VOLUME;
 bg.preload='none';
 bg.addEventListener('error',()=>{
   if(sound.onlineFallback)return;
   sound.onlineFallback=true;
   bg.src=MUSIC_ONLINE;
   bg.load();
   if(sound.enabled && ['home','playing','tutorial'].includes(state.mode))bg.play().catch(()=>{});
 });
 sound.music=bg;
}
function playSound(type){
 if(!sound.enabled)return;const a=sound.players[type];if(!a)return;
 const play=a.cloneNode();play.volume=type==='error'?.35:.23;play.play().catch(()=>{});
}
function refreshAudio(){
 const inGameButton=get('soundButton');
 const homeButton=get('homeSoundButton');
 const label=sound.enabled?'Выключить музыку и звуки':'Включить музыку и звуки';
 for(const button of [inGameButton,homeButton]){
   if(!button)continue;
   button.classList.toggle('is-muted',!sound.enabled);
   button.setAttribute('aria-label',label);
   button.setAttribute('aria-pressed',String(sound.enabled));
   button.setAttribute('title',label);
 }
 inGameButton.textContent=sound.enabled?'♫':'♪';
 if(homeButton)homeButton.textContent=sound.enabled?'♫ Музыка: вкл.':'♪ Музыка: выкл.';
 if(!sound.enabled){sound.music?.pause();return;}
 // A click on either toggle counts as user interaction and permits browser playback.
 if(['home','playing','tutorial'].includes(state.mode))sound.music?.play().catch(()=>{});
 else sound.music?.pause();
}
function toggleAudio(){sound.enabled=!sound.enabled;refreshAudio();if(sound.enabled)playSound('click');}

const get = id => document.getElementById(id);
const canvas=get('gameCanvas'),ctx=canvas.getContext('2d',{alpha:false});
const views = {home:get('homeScreen'),play:get('playScreen'),tutorial:get('tutorialScreen'),pause:get('pausedScreen'),practiceEnd:get('practiceEnd'),results:get('resultScreen')};
const touchBtns={left:[get('leftControl'),get('leftTrialControl')],right:[get('rightControl'),get('rightTrialControl')]};
const state = {
 mode:'loading',selected:0,mobile:MEDIA.matches,W:1150,H:800,
 playerX:575,playerTarget:null,moveLeft:false,moveRight:false,wasMoving:false,moveClock:0,facing:1,
 lives:4,score:0,counts:[0,0,0],charmsCaught:0,objects:[],particles:[],elapsed:0,spawnCooldown:1.0,
 lastCharmX:575,heroHitTime:0,pan:0,finishClock:0,activeToastUntil:0,toastTimer:null,
 shieldTimer:0,shieldBurstTimer:0,fieldEpoch:0,doubleTimer:0,letterCooldown:0,criticalTime:0,heartGuarantee:0,bonusNotice:{},hudClock:0,
 tutorialStep:0,tutorialSpawned:false,tutorialNextAt:0,tutorialSuccessClock:0,tutorialPendingStep:-1,pauseReturn:'playing',
 flashClock:0,resultsShown:false,chosenPhrase:'',best:0,photoInProgress:false,shieldJustEnded:false,lastSpawnLane:-1,lastCharmIndex:-1,
 nextCharmAt:0,nextErrorAt:3.3,nextShieldAt:15,nextDoubleAt:10,nextLetterAt:12,
 lastCharmSpawnAt:-10,lastErrorSpawnAt:-10,lastCharmXAt:-10,spawnCounter:0,forcedErrors:0
};
let lastStamp=0,appReady=false;

function loadImage(src){return new Promise(resolve=>{let im=new Image();im.decoding='async';im.onload=()=>{IMG[src]=im;resolve(true)};im.onerror=()=>{console.warn('Не удалось загрузить изображение:',src);resolve(false)};im.src='assets/'+src;});}
function preload(){
 const needed=new Set(['bg/hub.png','background.png',...HEROES.flatMap(h=>[h.bg,h.mobile,h.stand,...h.runs]),...CHARMS.map(c=>c.file),...Object.values(ITEM_IMAGES)]);
 return Promise.all([...needed].map(loadImage));
}
function show(view){Object.values(views).forEach(v=>v.classList.add('hidden'));if(view)views[view].classList.remove('hidden');}
function bestScore(){try{return Number(localStorage.getItem('precious_cargo_best_v1'))||0}catch(e){return 0}}
function saveBest(n){try{localStorage.setItem('precious_cargo_best_v1',String(n))}catch(e){}}
function pick(arr){return arr[Math.floor(Math.random()*arr.length)]}
function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function lerp(a,b,t){return a+(b-a)*t}
function smooth(t){t=clamp(t,0,1);return t*t*(3-2*t)}
function currentHero(){return HEROES[state.selected]}
function bgPath(){return state.mobile?currentHero().mobile:currentHero().bg}
function actualImagePath(path){return IMG[path]?path:'bg/dog.png'}
function sizeFrame(){
 const mobile=MEDIA.matches;
 if(!mobile&&state.W===1150&&state.H===800)return;
 if(mobile&&state.W===700&&state.H===870)return;
 const prevW=state.W;
 state.mobile=mobile;state.W=mobile?700:1150;state.H=mobile?870:800;
 const oldX=state.playerX;
 state.playerX=clamp((oldX/prevW)*state.W,0,state.W);
 if(state.playerTarget!==null)state.playerTarget=(state.playerTarget/prevW)*state.W;
 state.objects.forEach(o=>{o.x=(o.x/prevW)*state.W;o.y=o.y/state.H*state.H;});
 canvas.width=state.W;canvas.height=state.H;ctx.imageSmoothingEnabled=false;
}
function setHero(id){const n=HEROES.findIndex(h=>h.id===id);if(n<0)return;state.selected=n;renderHeroOptions();if(state.mode==='home')drawScene(0);}
function renderHeroOptions(){
 get('heroPicker').innerHTML=HEROES.map((h,i)=>`<button type="button" class="hero-option ${i===state.selected?'is-selected':''}" data-hero="${h.id}" aria-pressed="${i===state.selected}" aria-label="${h.name}" title="${h.name}"><img src="assets/${h.stand}" alt="" draggable="false"></button>`).join('');
 [...get('heroPicker').querySelectorAll('button')].forEach(b=>b.addEventListener('click',()=>setHero(b.dataset.hero)));
}
function goHome(){get('resultConfetti').innerHTML='';state.mode='home';state.objects=[];state.resultsShown=false;state.playerTarget=null;state.pan=0;state.moveLeft=false;state.moveRight=false;show('home');get('playScreen').classList.add('hidden');renderHeroOptions();refreshAudio();}
function resetRound(){state.playerX=state.W*.48;state.playerTarget=null;state.moveLeft=false;state.moveRight=false;state.moveClock=0;state.facing=1;state.tutorialSuccessClock=0;state.tutorialPendingStep=-1;get('tutorialMessage').classList.remove('success');get('tutorialBurst').classList.add('hidden');state.lives=4;state.score=0;state.counts=[0,0,0];state.charmsCaught=0;state.objects=[];state.particles=[];state.elapsed=0;state.spawnCooldown=.57;state.shieldTimer=0;state.shieldBurstTimer=0;state.fieldEpoch=0;state.doubleTimer=0;state.letterCooldown=0;state.criticalTime=0;state.heartGuarantee=0;state.bonusNotice={};state.hudClock=0;state.lastCharmX=state.playerX;state.lastSpawnLane=-1;state.lastCharmIndex=-1;state.nextCharmAt=.55;state.nextErrorAt=3.3;
 state.nextShieldAt=15;state.nextDoubleAt=10;state.nextLetterAt=12;state.lastCharmSpawnAt=-10;
 state.lastErrorSpawnAt=-10;state.lastCharmXAt=-10;state.spawnCounter=0;state.forcedErrors=0;
 state.heroHitTime=0;state.pan=0;state.finishClock=0;state.flashClock=0;state.resultsShown=false;hideToast();renderHud();renderEffects();}
function startGame(){
 resetRound();state.mode='playing';refreshAudio();
 // Three items are already falling as the route starts: no empty opening sky.
 const starters=[
   {type:'charm',x:state.W*.56,y:state.H*.28},
   {type:'box',x:state.W*.24,y:state.H*.14}
 ];
 for(const starter of starters){const ob=spawn(starter.type);ob.x=starter.x;ob.y=starter.y;}
 show('play');get('gameFrame').focus({preventScroll:true});
}
function startTrial(){resetRound();state.mode='tutorial';refreshAudio();state.tutorialStep=0;state.tutorialSpawned=false;state.tutorialNextAt=.65;state.tutorialPendingStep=-1;state.tutorialSuccessClock=0;show('tutorial');updateTutorialView();get('gameFrame').focus({preventScroll:true});}
function finishTrial(){sound.music?.pause();state.mode='practiceEnd';state.objects=[];state.moveLeft=false;state.moveRight=false;show('practiceEnd');}
function updateTutorialView(){const t=TUTORIAL[state.tutorialStep];if(!t)return;get('tutorialMessage').classList.remove('success');get('tutorialBurst').classList.add('hidden');get('tutorialProgress').textContent=`${String(state.tutorialStep+1).padStart(2,'0')} / 05`;get('tutorialMessage').innerHTML=`<strong>${t.title}</strong><p>${t.desc}</p>`;}
const TUTORIAL_SUCCESS = [
 'Управление освоено. Отличный старт!',
 'Шармикс пойман: +10 очков',
 'Бонусный груз получен: +25 очков',
 'Верно! Ошибку нужно пропустить',
 'Письмо помогло восстановить жизнь'
];
function celebrateTutorial(){
 const burst=get('tutorialBurst');const colors=['#befe75','#00e4be','#fff49f','#8ce7ff','#ffb46d'];
 burst.innerHTML=Array.from({length:19},(_,i)=>{const angle=(i/19)*Math.PI*2;const x=Math.cos(angle)*(85+(i%4)*28),y=Math.sin(angle)*(45+(i%5)*20)+35;return `<i style="--x:${x.toFixed(1)}px;--y:${y.toFixed(1)}px;--rot:${((i*37)%270)-110}deg;--delay:${(i%4)*.017}s;--c:${colors[i%colors.length]}"></i>`}).join('');
 burst.classList.remove('hidden');
 const panel=get('tutorialMessage');panel.classList.add('success');panel.innerHTML=`<strong>Отлично!</strong><p>${TUTORIAL_SUCCESS[state.tutorialStep]}</p>`;
}
function advanceTutorial(){
 if(state.tutorialPendingStep>=0)return;
 state.objects=[];state.tutorialPendingStep=state.tutorialStep+1;state.tutorialSuccessClock=.98;
 state.tutorialSpawned=true;state.tutorialNextAt=Infinity;celebrateTutorial();
}
function completeTutorialFeedback(){
 if(state.tutorialPendingStep<0)return;
 state.tutorialStep=state.tutorialPendingStep;state.tutorialPendingStep=-1;
 state.tutorialSuccessClock=0;
 get('tutorialBurst').classList.add('hidden');
 if(state.tutorialStep>=TUTORIAL.length){finishTrial();return;}
 if(state.tutorialStep===4){state.lives=3;renderHud();}
 state.tutorialSpawned=false;state.tutorialNextAt=state.elapsed+.42;
 updateTutorialView();
}
function renderHud(){
 get('hudScore').textContent=state.score.toLocaleString('ru-RU');
 get('hudLives').innerHTML=Array.from({length:4},(_,i)=>`<span class="heart-pip ${i>=state.lives?'lost':''}" aria-hidden="true">♥</span>`).join('');
 get('hudLives').setAttribute('aria-label',`${state.lives} из 4 жизней`);
 state.counts.forEach((count,i)=>{
   const node=get('hudCat'+i);
   const points=count*10;
   node.textContent=String(points);
   node.parentElement.style.setProperty('--progress',Math.min(100,points)+'%');
 });
}
function renderEffects(){
 const buffs=[];
 if(state.shieldTimer>0)buffs.push(`<span class="effect-pill effect-shield">◈ ЩИТ ${Math.ceil(state.shieldTimer)}с</span>`);
 if(state.doubleTimer>0)buffs.push(`<span class="effect-pill effect-double">×2 ${Math.ceil(state.doubleTimer)}с</span>`);
 get('hudEffects').innerHTML=buffs.join('');
}
function showToast(msg,duration=950,kind='positive'){
 const el=get('levelToast');el.textContent=msg;el.classList.remove('hidden');
 el.classList.toggle('negative',kind==='negative');
 clearTimeout(state.toastTimer);state.toastTimer=setTimeout(()=>el.classList.add('hidden'),duration);
}
function hideToast(){clearTimeout(state.toastTimer);get('levelToast').classList.add('hidden');get('pointsFlash').classList.remove('show');}
function showPoints(text){const el=get('pointsFlash');el.textContent=text;el.classList.add('show');clearTimeout(el._timer);el._timer=setTimeout(()=>el.classList.remove('show'),420)}
function heroBox(){
 const h=currentHero();
 const frame=(state.mode==='playing'||state.mode==='tutorial'||state.mode==='delivery')&&state.wasMoving?h.runs[Math.floor(state.moveClock/.15)%h.runs.length]:h.stand;
 const im=IMG[frame]||IMG[h.stand];
 const targetHeight=h.height*(state.mobile?.89:1);
 const w=im?targetHeight*(im.width/im.height):targetHeight*1.2;
 return {w,h:targetHeight,path:frame,baseY:state.H-(state.mobile?60:58)};
}
function gameGroundY(){return state.H-(state.mobile?60:58)}
function moveSpeed(){return state.mobile?770:920}
function itemSize(type){
 if(type==='box')return state.mobile?78:86;
 if(type==='error'||type==='letter')return state.mobile?70:74;
 if(type==='shield'||type==='double')return state.mobile?62:66;
 return state.mobile?70:74;
}
function resolveImage(item){if(item.type==='charm')return IMG[CHARMS[item.charmIndex].file];return IMG[ITEM_IMAGES[item.type]];}
function itemSpeed(){const mult=Math.min(2.75,Math.pow(1.075,Math.floor(state.elapsed/15)));return (state.mobile?285:276)*mult;}
function interval(){
 // More frequent staggered drops as the route continues; shield burst lasts only two seconds.
 if(state.shieldBurstTimer>0)return state.mobile?.29:.27;
 const growth=Math.pow(.974,Math.floor(state.elapsed/17));
 return Math.max(state.mobile?.48:.45,(state.mobile?.63:.58)*growth);
}
function minimumFalling(){
 if(state.shieldBurstTimer>0)return state.mobile?4:5;
 return 3;
}
function activeCharms(){return state.objects.filter(o=>o.type==='charm'&&!o.collected);}
function visibleObjects(){return state.objects.filter(o=>!o.collected&&o.y>-o.size*.6&&o.y<state.H);}
function maintainFlow(){
 // Keep the field occupied. Refill above the upper quarter without dropping surprises near the player.
 const cap=state.shieldBurstTimer>0?8:6;
 let tries=0;
 while(visibleObjects().length<minimumFalling() && state.objects.filter(o=>!o.collected).length<cap && tries++<5){
   const type=state.shieldBurstTimer>0&&Math.random()<.88?'charm':null;
   spawn(type,false,state.H*(.01+.045*(tries%3)));
 }
}
function getNewItemType(){
 const r=Math.random();
 if(state.shieldBurstTimer>0){
   if(r<.85)return 'charm';
   if(r<.94)return 'box';
   return 'error';
 }
 // Scheduled guarantees mean rare objects cannot simply disappear from a whole run.
 // Priorities intentionally prevent the same thing from spawning repeatedly at once.
 if(state.lives<4 && state.letterCooldown<=0 && state.elapsed>=state.nextLetterAt)return 'letter';
 if(state.elapsed>=state.nextErrorAt && state.elapsed-state.lastErrorSpawnAt>2)return 'error';
 if(state.elapsed>=state.nextDoubleAt && state.doubleTimer<=0)return 'double';
 if(state.elapsed>=state.nextShieldAt && state.shieldTimer<=0)return 'shield';
 if(state.elapsed>=state.nextCharmAt && activeCharms().length<3)return 'charm';
 if(r<.48)return 'charm';
 if(r<.75)return 'box';
 if(r<.90)return 'error';
 if(r<.944 && state.elapsed>9 && state.doubleTimer<=0)return 'double';
 if(r<.973 && state.elapsed>12 && state.shieldTimer<=0)return 'shield';
 if(state.lives<4 && state.letterCooldown<=0 && r<.996)return 'letter';
 return 'box';
}
// The actual arrival time at the hero's pickup height, measured from now.
function pickupTime(x){
 const pickupY=gameGroundY()-heroBox().h*.46;
 return (pickupY-x.y)/x.v;
}
function safeCharmX(x,arrival,size){
 if(state.shieldTimer>0)return true;
 const speed=moveSpeed()*.86;
 const collisionAllowance=Math.max(64,heroBox().w*.29+size*.25);
 // Every consecutive mandatory pickup must be within reach of the previous one.
 const planned=[{x:state.playerX,t:0},...activeCharms().map(ob=>({x:ob.x,t:pickupTime(ob)})),{x,t:arrival}].sort((a,b)=>a.t-b.t);
 for(let i=1;i<planned.length;i++){
   const dt=planned[i].t-planned[i-1].t;
   const reachable=Math.max(0,dt-.085)*speed+collisionAllowance;
   if(Math.abs(planned[i].x-planned[i-1].x)>reachable)return false;
 }
 // Never force the player to collect a mandatory charm through an error at the same instant.
 for(const err of state.objects){
   if(err.collected||err.type!=='error')continue;
   if(Math.abs(arrival-pickupTime(err))<.55 && Math.abs(x-err.x)<(size+err.size)*.55+heroBox().w*.16)return false;
 }
 return true;
}
function safeErrorX(x,arrival,size){
 // Errors should complicate the route, not sit directly on an unavoidable charm.
 for(const charm of activeCharms()){
   if(Math.abs(arrival-pickupTime(charm))<.68 && Math.abs(x-charm.x)<(size+charm.size)*.55+heroBox().w*.18)return false;
 }
 return true;
}
function chooseLane(type,size,v,y){
 const margin=Math.max(size*.72,26),W=state.W;
 const laneFractions=state.mobile?[.10,.28,.49,.70,.90]:[.075,.24,.405,.595,.76,.925];
 const arrival=(gameGroundY()-heroBox().h*.46-y)/v;
 const lanes=laneFractions.map((f,i)=>({
   i,x:clamp(W*f+(Math.random()-.5)*W*.025,margin,W-margin)
 }));
 const future=state.objects.filter(o=>!o.collected&&Math.abs(o.y-y)<size*1.6);
 const score=(p)=>{
   const overlap=future.reduce((cost,o)=>cost+(Math.abs(o.x-p.x)<(o.size+size)*.65?30:0),0);
   let val=-overlap+(Math.random()-.5)*2.0;
   if(p.i===state.lastSpawnLane)val-=7;
   if(type==='charm'){
     // Alternate between middle and sides: a distant but reachable next charm makes the trip fun.
     const distance=Math.abs(p.x-state.lastCharmX)/W;
     val+=distance*18;
     if(state.elapsed-state.lastCharmSpawnAt<.65)val-=3;
   } else if(type==='error'){
     const next=activeCharms().sort((a,b)=>pickupTime(a)-pickupTime(b))[0];
     if(next){
       const gap=Math.abs(p.x-next.x);
       val+=(gap/W<.34&&gap/W>.12)?11:0;
       if(gap/W<.10)val-=7;
     }else{
       // Occasionally put the obstacle near the current lane to prompt a dodge.
       const gap=Math.abs(p.x-state.playerX)/W;
       if(gap<.19)val+=5;
     }
   }
   return val;
 };
 let candidates=lanes.filter(p=>{
   if(type==='charm')return safeCharmX(p.x,arrival,size);
   if(type==='error')return safeErrorX(p.x,arrival,size);
   return true;
 });
 if(!candidates.length)return null;
 candidates.sort((a,b)=>score(b)-score(a));
 // Pick mostly among the highest-scoring lanes so the pattern is varied, not repetitive.
 const chosen=candidates[Math.floor(Math.pow(Math.random(),1.7)*Math.min(3,candidates.length))];
 state.lastSpawnLane=chosen.i;
 return chosen.x;
}
function spawn(typeOverride=null,practice=false,yOverride=null){
 let type=typeOverride||getNewItemType();
 // Never place more than two unprotected mandatory charms at once.
 if(!practice&&type==='charm'&&state.shieldTimer<=0&&activeCharms().length>=3)type='box';
 let size=itemSize(type);
 const speed=practice?state.H*.39:itemSpeed()*(.95+Math.random()*.10);
 const y=yOverride??(-size*.60);
 let x=state.W*.5;
 if(practice){
   const positions=[.72,.26,.60,.5,.52];x=state.W*positions[state.tutorialStep]||state.W*.5;
   if(state.tutorialStep===3)x=state.playerX;
 }else{
   let lane=chooseLane(type,size,speed,y);
   if(lane===null){
     // Badly timed mandatory spawn becomes optional cargo rather than a forced lost life.
     type='box';size=itemSize(type);lane=chooseLane(type,size,speed,y);
   }
   x=lane??state.W*.5;
   if(type==='letter')x=clamp(state.playerX+(Math.random()-.5)*(state.mobile?190:240),size*.7,state.W-size*.7);
 }
 if(!practice){
   if(type==='charm'){
     state.lastCharmSpawnAt=state.elapsed;state.lastCharmX=x;
     state.nextCharmAt=state.elapsed+(state.shieldBurstTimer>0?.1:.85+Math.random()*.35);
   }else if(type==='error'){
     state.lastErrorSpawnAt=state.elapsed;state.nextErrorAt=state.elapsed+4.5+Math.random()*2.4;
   }else if(type==='shield'){
     state.nextShieldAt=state.elapsed+20+Math.random()*8;
   }else if(type==='double'){
     state.nextDoubleAt=state.elapsed+16+Math.random()*6;
   }else if(type==='letter'){
     state.letterCooldown=state.lives===1?7.5:14;
     state.nextLetterAt=state.elapsed+(state.lives===1?7:11);
     state.criticalTime=0;
   }
 }
 let charmIndex=-1;
 if(type==='charm'){
   const choices=CHARMS.map((c,i)=>i).filter(i=>i!==state.lastCharmIndex);
   charmIndex=pick(choices);state.lastCharmIndex=charmIndex;
 }
 state.spawnCounter++;
 const ob={type,x,y,size,v:speed,charmIndex,collected:false,rot:Math.random()*6.28,practice};
 state.objects.push(ob);return ob;
}

function handleCatch(item){
 item.collected=true;
 if(state.mode==='tutorial'){
   if(item.type==='error'){showToast('ERROR нужно пропустить',1000,'negative');state.objects=[];state.tutorialSpawned=false;state.tutorialNextAt=state.elapsed+1.1;return;}
   if(item.type==='letter')state.lives=4;
   if(item.type==='charm')state.score+=10;
   if(item.type==='box')state.score+=25;
   renderHud();advanceTutorial();return;
 }
 if(item.type==='charm'){
   playSound('charm');const gain=state.doubleTimer>0?20:10;state.score+=gain;const category=CHARMS[item.charmIndex].category;state.counts[category]++;state.charmsCaught++;showPoints('+'+gain);
 }else if(item.type==='box'){
   playSound('box');const gain=state.doubleTimer>0?50:25;state.score+=gain;showPoints('+'+gain);
 }else if(item.type==='letter'){
   if(state.lives<4){playSound('letter');state.lives++;state.criticalTime=0;showToast('Письмо поддержки: +1 жизнь',1200)}
 }else if(item.type==='shield'){
   playSound('shield');state.shieldTimer=10;state.shieldBurstTimer=2;state.spawnCooldown=.01;state.shieldJustEnded=false;showToast('Щит: 2 секунды дождя, 10 секунд защиты',1700);
 }else if(item.type==='double'){
   playSound('double');state.doubleTimer=11;showToast('×2 очков на 11 секунд',1350);
 }else if(item.type==='error'){
   playSound('error');loseLife('error');
 }
 renderHud();
}
function loseLife(reason){
 if(state.mode!=='playing')return;
 if(state.heroHitTime>0)return;
 if(state.shieldTimer>0){
   if(reason==='miss')return; // During the 10-second rain missed charmixes cost no lives.
   endShield();state.heroHitTime=.32;state.spawnCooldown=.24;
   showToast('ERROR разбил щит: усиление закончилось',1300,'negative');return;
 }
 playSound('error');state.lives=Math.max(0,state.lives-1);
 if(state.lives===1){state.criticalTime=0;state.heartGuarantee=state.elapsed+1.05;state.letterCooldown=Math.min(state.letterCooldown,.85);}state.heroHitTime=.64;
 renderHud();
 if(state.lives===0){beginDelivery();return;}
 showToast(reason==='miss'?'Шармикс пропущен: −1 жизнь':'ERROR: −1 жизнь',1000,'negative');
}
function beginDelivery(){state.mode='delivery';state.heroHitTime=0;state.shieldTimer=0;state.shieldBurstTimer=0;state.finishClock=0;state.objects=[];state.playerTarget=null;state.moveLeft=false;state.moveRight=false;state.pan=0;get('deliveryToast').classList.remove('hidden');get('levelToast').classList.add('hidden');get('pointsFlash').classList.remove('show');}
function calcEndOffset(){const bg=IMG[bgPath()];if(!bg)return state.mobile?630:522;
 // Panorama artwork is authored in matching virtual pixel dimensions.
 return Math.max(0,bg.width-state.W);
}
function choosePhrase(){
 const c=state.counts;let group;
 if(c.every(v=>v===0))group=4;
 else if(c[0]===c[1]&&c[1]===c[2])group=3;
 else {const max=Math.max(...c);const leading=c.map((v,i)=>v===max?i:-1).filter(v=>v!==-1);group=pick(leading)}
 return pick(PHRASES[group]);
}
function endShield(){
 // Preserve every object and its current trajectory: the shield ending must not visually reset the field.
 // Charms that are already airborne get a one-time grace on missed pickup, since they
 // may have been generated without the usual reachability restrictions during the shield.
 for(const ob of state.objects){
   if(!ob.collected && ob.type==='charm') ob.shieldGrace=true;
 }
 state.shieldTimer=0;
 state.shieldBurstTimer=0;
 state.shieldJustEnded=true;
 // Keep the existing spawn schedule, speed and positions as they are.
 renderEffects();
}
function updateResults(){
 const total=state.counts.reduce((sum,n)=>sum+n,0);
 const ids=['Service','Expert','Culture'];
 ids.forEach((id,i)=>{get('stat'+id).textContent=state.counts[i]*10;get('bar'+id).style.width=total?`${state.counts[i]/total*100}%`:'0%';});
 get('resultScore').textContent=state.score.toLocaleString('ru-RU');
 state.chosenPhrase=choosePhrase();get('resultMessage').textContent=state.chosenPhrase;
 state.best=Math.max(bestScore(),state.score);saveBest(state.best);
 get('bestScore').textContent=`Лучший рейс: ${state.best.toLocaleString('ru-RU')} очков`;
 const learn=get('learnButton');learn.href=SHARMIX_URL||'#';learn.title=SHARMIX_URL?'Открыть статью о шармиксах':'Ссылка на статью добавляется в game.js';
}
function showResultConfetti(){
 const holder=get('resultConfetti');
 const palette=['#C8FF03','#FFFFFF','#225FC9','#FFC36C','#FF98C5'];
 holder.innerHTML=Array.from({length:34},(_,i)=>{
   const x=(i*31.7+8)%96;
   const delay=(i%9)*.07;
   const drift=((i%7)-3)*18;
   const c=palette[i%palette.length];
   const spin=(i*67)%500;
   return `<i style="--x:${x}%;--delay:${delay}s;--drift:${drift}px;--spin:${spin}deg;--c:${c}"></i>`;
 }).join('');
}
function endDelivery(){sound.music?.pause();playSound('finish');updateResults();state.mode='results';state.resultsShown=true;show('results');showResultConfetti();}
function speedMovement(dt){
 const hb=heroBox();const margin=Math.min(145,hb.w*.5);
 const lo=margin,hi=state.W-margin;
 if(state.moveLeft||state.moveRight){
   state.playerTarget=null;
   const direction=(state.moveRight?1:0)-(state.moveLeft?1:0);
   state.playerX=clamp(state.playerX+direction*moveSpeed()*dt,lo,hi);
   state.wasMoving=direction!==0;
   if(direction!==0)state.facing=direction;
 }else if(state.playerTarget!==null){
   const dx=state.playerTarget-state.playerX;
   const step=moveSpeed()*dt;
   state.playerX+=Math.sign(dx)*Math.min(Math.abs(dx),step);
   state.playerX=clamp(state.playerX,lo,hi);
   state.wasMoving=Math.abs(dx)>3;
   if(state.wasMoving)state.facing=Math.sign(dx);
 }else state.wasMoving=false;
 if(state.wasMoving)state.moveClock+=dt;
}
function advanceObjects(dt){
 const startingEpoch=state.fieldEpoch;
 const hero=heroBox();const catchY=hero.baseY-hero.h*.45;
 for(const ob of state.objects){
   ob.y+=ob.v*dt;
   if(!ob.collected&&ob.y+ob.size*.34>=catchY&&ob.y-ob.size*.32<=catchY+36){
     const collision=hero.w*.30+ob.size*.32;
     if(Math.abs(ob.x-state.playerX)<collision){handleCatch(ob);if(state.mode==='delivery'||state.fieldEpoch!==startingEpoch)return;}
   }
   if(!ob.collected&&ob.y>hero.baseY+ob.size*.55){
     ob.collected=true;
     if(state.mode==='tutorial'){
       if(ob.type==='error')advanceTutorial();
       else {state.tutorialSpawned=false;state.tutorialNextAt=state.elapsed+.5;}
     }else if(ob.type==='charm'&&!ob.shieldGrace){loseLife('miss');if(state.mode==='delivery'||state.fieldEpoch!==startingEpoch)return;}
   }
 }
 state.objects=state.objects.filter(ob=>!ob.collected&&ob.y<state.H+120);
}
function update(dt){
 if(state.mode==='playing'||state.mode==='tutorial'){
   state.elapsed+=dt;
   if(state.mode==='playing'){
     state.letterCooldown=Math.max(0,state.letterCooldown-dt);
     const shieldBefore=state.shieldTimer;
     state.shieldTimer=Math.max(0,state.shieldTimer-dt);
     if(shieldBefore>0&&state.shieldTimer===0)endShield();
     state.shieldBurstTimer=Math.max(0,state.shieldBurstTimer-dt);
     state.doubleTimer=Math.max(0,state.doubleTimer-dt);
     state.hudClock-=dt;if(state.hudClock<=0){renderEffects();state.hudClock=.21;}
     if(state.lives===1){state.criticalTime+=dt;
       if(state.criticalTime>1.2&&state.letterCooldown<=0&&!state.objects.some(o=>o.type==='letter')){const rescue=spawn('letter');rescue.y=state.H*.13;state.criticalTime=0;}
     }else if(state.lives===2&&state.elapsed>14&&state.letterCooldown<=0&&!state.objects.some(o=>o.type==='letter')){
       if(Math.random()<dt*.11)spawn('letter');
     }
   }
   state.heroHitTime=Math.max(0,state.heroHitTime-dt);
   speedMovement(dt);
   if(state.mode==='playing'){
     state.spawnCooldown-=dt;
     if(state.spawnCooldown<=0){
       if(state.objects.length<(state.shieldBurstTimer>0?8:6)){
         const forced=state.shieldBurstTimer>0&&Math.random()<.87?'charm':null;
         spawn(forced);
       }
       state.spawnCooldown=interval()*(.86+Math.random()*.24);
     }
     maintainFlow();
   }else{
     if(state.tutorialPendingStep>=0){state.tutorialSuccessClock-=dt;if(state.tutorialSuccessClock<=0)completeTutorialFeedback();}
     else if(!state.tutorialSpawned&&state.elapsed>=state.tutorialNextAt){spawn(TUTORIAL[state.tutorialStep].type,true);state.tutorialSpawned=true;}
   }
   advanceObjects(dt);
   if(state.mode==='playing')maintainFlow();
 }else if(state.mode==='delivery'){
   state.finishClock+=dt;
   const t=state.finishClock;
   const progress=smooth((t-1.45)/3.1);
   state.pan=calcEndOffset()*progress;
   if(t>=1.4){state.facing=1;state.wasMoving=t<4.9;state.moveClock+=dt;state.playerX=lerp(state.playerX,Math.min(state.W*.89,state.W-100),Math.min(1,2.1*dt));}
   if(t>1.55)get('deliveryToast').classList.add('hidden');
   if(t>=5.5)endDelivery();
 }
}
function imageCover(img,w,h){const k=Math.max(w/img.width,h/img.height);const iw=img.width*k,ih=img.height*k;ctx.drawImage(img,(w-iw)*.5,(h-ih)*.5,iw,ih);}
function drawScene(time){
 ctx.imageSmoothingEnabled=false;
 const W=state.W,H=state.H;
 const isResults=state.mode==='results';
 const img=isResults?IMG['bg/hub.png']:IMG[bgPath()];
 if(img){
   if(isResults){imageCover(img,W,H)}
   else{
     const desiredW=state.mobile?1330:1672;
     const desiredH=state.mobile?870:800;
     const sx=state.mode==='delivery'?state.pan:0;
     // The requested fixed viewport always masks the wider background.
     ctx.drawImage(img,-sx,0,desiredW,desiredH);
   }
 }else{ctx.fillStyle='#63bafa';ctx.fillRect(0,0,W,H)}
 if(state.mode==='home'){
   ctx.fillStyle='rgba(2,21,70,.13)';ctx.fillRect(0,0,W,H);
   drawHero(W*.84,true,time);
 }
 if(state.mode==='playing'||state.mode==='tutorial'||state.mode==='delivery'||state.mode==='paused'){
   if(state.mode!=='delivery')for(const ob of state.objects)drawItem(ob);
   drawHero(state.playerX,false,time);
   if(state.mode==='delivery'){
     const t=state.finishClock;
     // A single gentle fade to black, then transition to interior.
     let alpha=t<4.65?0:smooth((t-4.65)/.72);
     if(alpha>0){ctx.fillStyle=`rgba(0,0,0,${alpha})`;ctx.fillRect(0,0,W,H)}
   }
 }
}
function drawHero(x,preview=false,time=0){
 const hb=heroBox(),h=currentHero();let img=IMG[hb.path]||IMG[h.stand];
 if(preview){const frame=Math.floor((time||0)/.2)%h.runs.length;img=IMG[h.runs[frame]]||IMG[h.stand];}
 if(!img)return;
 let w=hb.w,hh=w*img.height/img.width;
 if(preview){w*=1.18;hh=w*img.height/img.width}
 const baseline=preview?state.H-(state.mobile?65:70):hb.baseY;
 ctx.save();
 if(!preview&&state.mode!=='delivery'&&state.heroHitTime>0&&Math.floor(state.heroHitTime*10)%2===0){ctx.globalAlpha=.62;}
 // Original assets look right. Mirror the whole sprite only while facing left.
 ctx.translate(Math.round(x),0);ctx.scale(preview?1:state.facing,1);
 ctx.drawImage(img,Math.round(-w/2),Math.round(baseline-hh),Math.round(w),Math.round(hh));
 if(!preview&&state.mode!=='delivery'&&state.shieldTimer>0){
   const pulse=.70+Math.sin(time*5.2)*.07;
   ctx.globalAlpha=.22;
   ctx.fillStyle='#C8FF03';
   ctx.beginPath();ctx.ellipse(0,baseline-hh*.5,w*.88,hh*.72,0,0,Math.PI*2);ctx.fill();
   ctx.globalAlpha=pulse;
   ctx.strokeStyle='#C8FF03';ctx.lineWidth=5;
   ctx.beginPath();ctx.ellipse(0,baseline-hh*.5,w*.86,hh*.70,0,0,Math.PI*2);ctx.stroke();
   ctx.globalAlpha=.36;ctx.strokeStyle='#C8FF03';ctx.lineWidth=10;
   ctx.beginPath();ctx.ellipse(0,baseline-hh*.5,w*.72,hh*.58,0,0,Math.PI*2);ctx.stroke();
   ctx.globalAlpha=1;
 }
 ctx.restore();
}
function drawBonus(item){
 const s=item.size,px=Math.max(4,Math.round(s/13));
 ctx.save();ctx.translate(Math.round(item.x),Math.round(item.y));
 const bop=Math.sin(state.elapsed*4+item.rot)*3;
 ctx.translate(0,bop);
 ctx.shadowBlur=0;
 ctx.fillStyle='#a6590b';ctx.fillRect(-px*5,-px*5,px*10,px*10);
 ctx.fillStyle='#ffd354';ctx.fillRect(-px*4,-px*4,px*8,px*8);
 ctx.fillStyle='#ff9b20';ctx.fillRect(-px*3,-px*3,px*6,px*6);
 ctx.fillStyle='#fffced';ctx.font=`900 ${Math.round(s*.43)}px monospace`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('×2',0,px*.4);
 ctx.restore();
}
function drawItem(item){
 if(item.type==='double'){drawBonus(item);return;}
 const img=resolveImage(item);if(!img)return;
 const factor=Math.min(item.size/img.width,item.size/img.height);
 const w=img.width*factor,h=img.height*factor;
 ctx.save();ctx.translate(Math.round(item.x),Math.round(item.y));
 if(item.type==='shield'){
   ctx.globalAlpha=.23;ctx.fillStyle='#C8FF03';ctx.beginPath();ctx.ellipse(0,0,w*.62,h*.62,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
 }
 // Small alternating tilt creates a floating-charm effect without blurring pixels.
 if(item.type==='charm')ctx.rotate(Math.sin(state.elapsed*4.1+item.rot)*.085);
 ctx.drawImage(img,Math.round(-w/2),Math.round(-h/2),Math.round(w),Math.round(h));
 ctx.restore();
}
function tick(stamp){
 const dt=lastStamp?Math.min(.048,(stamp-lastStamp)/1000):0;
 lastStamp=stamp;
 if(appReady){update(dt);drawScene(stamp/1000)}
 requestAnimationFrame(tick);
}
function keyChange(e,pressed){
 if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A'){
   if(state.mode==='playing'||state.mode==='tutorial')e.preventDefault();state.moveLeft=pressed;
 }
 if(e.key==='ArrowRight'||e.key==='d'||e.key==='D'){
   if(state.mode==='playing'||state.mode==='tutorial')e.preventDefault();state.moveRight=pressed;
 }
 if(e.code==='Space'&&pressed){
   if(state.mode==='playing'||state.mode==='paused'){
     e.preventDefault();pauseToggle();
   }
 }
}
function pauseToggle(){
 if(state.mode==='playing'){sound.music?.pause();state.mode='paused';state.moveLeft=false;state.moveRight=false;show('pause');}
 else if(state.mode==='paused'){state.mode='playing';show('play');refreshAudio();}
}
function pointX(event){const r=canvas.getBoundingClientRect();return ((event.clientX-r.left)/r.width)*state.W}
let dragging=false;
function pointerStart(e){if(state.mode!=='playing'&&state.mode!=='tutorial')return;if(e.pointerType==='mouse'&&e.button!==0)return;dragging=true;state.playerTarget=pointX(e);if(canvas.setPointerCapture)canvas.setPointerCapture(e.pointerId);e.preventDefault()}
function pointerMove(e){if((state.mode==='playing'||state.mode==='tutorial')&&dragging){state.playerTarget=pointX(e);e.preventDefault();}}
function pointerEnd(){dragging=false;}
function setupHeldButtons(arr,key){
 for(const btn of arr){
   btn.addEventListener('pointerdown',e=>{e.preventDefault();state[key]=true;state.playerTarget=null;try{btn.setPointerCapture(e.pointerId)}catch(_){}});
   ['pointerup','pointercancel','lostpointercapture','pointerleave'].forEach(n=>btn.addEventListener(n,()=>{state[key]=false}));
 }
}
function setup(){
 initAudio();refreshAudio();get('soundButton').addEventListener('click',toggleAudio);get('homeSoundButton').addEventListener('click',toggleAudio);
 sizeFrame();state.best=bestScore();
 get('playButton').addEventListener('click',startGame);
 get('trialButton').addEventListener('click',startTrial);
 get('afterTrialButton').addEventListener('click',startGame);
 get('skipTutorial').addEventListener('click',finishTrial);
 get('trialHomeButton').addEventListener('click',goHome);
 get('againButton').addEventListener('click',goHome);
 get('pauseButton').addEventListener('click',pauseToggle);
 get('resumeButton').addEventListener('click',pauseToggle);
 get('pauseHomeButton').addEventListener('click',goHome);
 get('learnButton').addEventListener('click',e=>{if(!SHARMIX_URL){e.preventDefault();window.alert('Ссылка на статью пока не добавлена. Впиши адрес в SHARMIX_URL в файле game.js.')}});
 window.addEventListener('keydown',e=>keyChange(e,true));
 window.addEventListener('keyup',e=>keyChange(e,false));
 window.addEventListener('blur',()=>{state.moveLeft=false;state.moveRight=false;dragging=false;if(state.mode==='playing')pauseToggle()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.mode==='playing')pauseToggle()});
 canvas.addEventListener('pointerdown',pointerStart);
 canvas.addEventListener('pointermove',pointerMove);
 canvas.addEventListener('pointerup',pointerEnd);
 canvas.addEventListener('pointercancel',pointerEnd);
 setupHeldButtons(touchBtns.left,'moveLeft');setupHeldButtons(touchBtns.right,'moveRight');
 MEDIA.addEventListener('change',()=>{const frac=state.playerX/state.W;state.mobile=MEDIA.matches;state.W=state.mobile?700:1150;state.H=state.mobile?870:800;state.playerX=frac*state.W;state.objects=[];canvas.width=state.W;canvas.height=state.H;ctx.imageSmoothingEnabled=false});
 // Test hooks for automated QA; only exposed with ?qa=1.
 if(new URLSearchParams(window.location.search).has('qa')){
  window.__gameQA={state,startGame,startTrial,select:setHero,spawn,step:update,minFalling:minimumFalling,finish:()=>{state.lives=0;beginDelivery()},result:()=>{state.mode='delivery';state.finishClock=5.49;state.pan=calcEndOffset();},advanceTrial:advanceTutorial,goHome,catchItem:handleCatch,loseLife};
 }
 preload().then(()=>{appReady=true;get('boot').classList.add('hidden');goHome()});
 requestAnimationFrame(tick);
}
setup();
