/* Tidemark. No libraries, fonts, network calls, or remote assets required. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const ICONS = {
    settings:'<circle cx="12" cy="12" r="3"/><path d="m9 3-1 3-3 1-2 3 2 2-1 3 3 2 3-1 2 2 3-2 1-3 3-1 1-3-2-2-3-1-1-3z"/>',
    close:'<path d="m6 6 12 12M18 6 6 18"/>', heart:'<path d="M20 5c-3-3-7-1-8 2-1-3-5-5-8-2-4 4 1 9 8 14 7-5 12-10 8-14Z"/>',
    bag:'<path d="M7 7V5a5 3 0 0 1 10 0v2M5 7h14l1 14H4L5 7Z"/><path d="M8 11h8v6H8zM10 7h4"/>',
    journal:'<path d="M6 3h14v18H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM7 3v18M11 8h5M11 12h5M11 16h3"/>',
    map:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5ZM9 3v16M15 5v16"/>',
    compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5 5-3Z"/>',
    arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>', stop:'<rect x="7" y="7" width="10" height="10" rx="2"/>',
    home:'<path d="m3 11 9-8 9 8M6 9v12h12V9M10 21v-7h4v7"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9 8a3 3 0 0 1 6 0c0 2-3 2-3 5M12 17h.01"/>',
    beacon:'<path d="m9 8-2 13h10L15 8ZM8 8h8V4H8ZM10 4V2h4v2M3 5h2M19 5h2M10 15h4"/>',
    wood:'<path d="m5 16 10-12 5 4-10 12Z"/><ellipse cx="7" cy="18" rx="4" ry="3" transform="rotate(40 7 18)"/><path d="m10 14 6-7M7 17l1 1"/>',
    stone:'<path d="m3 16 3-9 9-4 6 9-4 8H8Z"/><path d="m6 7 6 7 9-2M12 14l-4 6M12 14l3-11"/>',
    reed:'<path d="M10 21 8 3M14 21l3-17M5 5l4 3M9 11l-5-2M16 9l5-3M15 15l5-3M8 16l-5-2"/>',
    fish:'<path d="M4 12c4-8 11-8 15 0-4 8-11 8-15 0Zm0 0-3-4v8ZM12 5l4-2-1 5M12 19l4 2-1-5"/><circle cx="15" cy="11" r=".7"/>',
    food:'<path d="M3 12h18a9 9 0 0 1-18 0ZM6 21h12M8 3c-3 3 3 3 0 6M13 2c-3 3 3 3 0 6M18 3c-3 3 3 3 0 6"/>',
    herb:'<path d="M7 21 16 7M10 16C0 18 2 8 3 7c6 1 9 3 7 9ZM12 12C10 2 19 2 21 3c0 6-3 10-9 9Z"/>',
    copper:'<path d="m3 15 5-9 7-3 6 12-7 6H7Z"/><path d="m8 6 5 8 8 1M13 14l1 7"/>',
    glass:'<path d="m3 9 9-6 9 6-9 12L3 9ZM3 9h18M12 3l-4 6 4 12 4-12-4-6"/>',
    plank:'<path d="m3 16 12-13 6 5L9 21Z"/><path d="m6 16 10-11M10 17l6-6"/>',
    rope:'<path d="M9 20c-9-4-4-17 4-16s7 13 1 12-3-9 1-7 1 13-5 12M7 6l4 2M5 11l4 1M6 16l4-1M15 5l-1 4"/>',
    coil:'<path d="M4 18V6c0-4 4-4 4 0v12c0 4 4 4 4 0V6c0-4 4-4 4 0v12c0 4 4 4 4 0V6"/>',
    lens:'<circle cx="11" cy="11" r="8"/><path d="m17 17 4 4M7 7c2-2 5-2 7 0"/>',
    axe:'<path d="M7 22 16 3M12 7c3-4 6-4 9-2l-3 7-6-5Z"/>',
    coat:'<path d="m8 3 4 3 4-3 5 7-4 3v8H7v-8l-4-3 5-7ZM12 6v15M10 15H8M14 15h2"/>',
    fire:'<path d="M11 2c1 6-5 5-6 12-1 9 14 10 15 0 0-4-2-5-3-6 0 5-3 4-3 1l-3-7Z"/><path d="M12 13c0 3-4 4-2 7 4 2 6-3 2-7Z"/>',
    bench:'<path d="M3 10h18v4H3zM6 14v7M18 14v7M8 10V5h8v5M6 5h12"/>',
    storage:'<path d="M3 6h18v15H3ZM3 11h18M8 6V3h8v3M10 14h4v3h-4z"/>',
    bridge:'<path d="M2 18c4 0 5-2 10-2s6 2 10 2M3 14V6M21 14V6M3 9c6 5 12 5 18 0M7 11v4M12 12v3M17 11v4"/>',
    talk:'<path d="M21 10a9 7 0 0 1-9 7H8l-5 4 1-7a7 7 0 0 1-1-4 9 7 0 0 1 18 0ZM8 10h.01M12 10h.01M16 10h.01"/>',
    wildlife:'<path d="M5 14c0-7 14-7 14 0v4H5ZM5 18v3M17 18v3M5 15H2v-3M8 10 6 5l5 4M17 10l2-5-5 4M19 13h3v5h-3"/>',
    coin:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="6"/><path d="M12 8v8M10 9h3a2 2 0 0 1 0 4h-2a2 2 0 0 0 0 4"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.compass}</svg>`;
  document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  const escapeHTML = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const W = 64, H = 44, SAVE_KEY = 'tidemark_island_v1';
  const canvas = $('world'), ctx = canvas.getContext('2d');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ITEMS = {
    wood:{name:'Driftwood',icon:'wood',description:'Salt-worn wood, washed ashore by the storm. Gather it on the beach or from fallen branches.',value:3},
    stone:{name:'Stone',icon:'stone',description:'Good, solid stone. Collect it at the old quarry, north of the village.',value:3},
    reed:{name:'Marsh reeds',icon:'reed',description:'Flexible reeds. Twist them into rope at the workbench.',value:3},
    fish:{name:'Fresh mackerel',icon:'fish',description:'A small island catch. Take it to the camp stove to cook.',value:6},
    meal:{name:'Smoked fish',icon:'food',description:'A proper fireside lunch. Eat it to restore 35 health, or save two for Mara.',value:13,heal:35},
    herb:{name:'Sea fennel',icon:'herb',description:'Bright, aromatic leaves. Eat a handful to restore 12 health.',value:4,heal:12},
    copper:{name:'Copper scraps',icon:'copper',description:'Salvaged from the abandoned weather station on the eastern shore. Useful for the beacon.',value:8},
    glass:{name:'Sea glass',icon:'glass',description:'Smooth, clear glass from the eastern coves. A lens can give it a second life.',value:6},
    plank:{name:'Timber planks',icon:'plank',description:'Two pieces of driftwood, cut and fitted at a workbench.',value:9},
    rope:{name:'Reed rope',icon:'rope',description:'Three bundles of reeds, twisted together. A simple fix for a battered jetty.',value:12},
    coil:{name:'Copper coil',icon:'coil',description:'A hand-wound coil made from two copper scraps. Part of the beacon’s circuit.',value:20},
    lens:{name:'Beacon lens',icon:'lens',description:'Three pieces of glass held in a copper frame. Ready to catch the light.',value:32},
    axe:{name:'Salvage hatchet',icon:'axe',description:'A practical tool made from copper and timber. Equip it to collect one extra driftwood each time.',value:35,gear:'tool'},
    coat:{name:'Field jacket',icon:'coat',description:'A woven, weatherproof jacket. Equip it to halve damage from startled wildlife.',value:40,gear:'coat'}
  };
  const RECIPES = [
    {item:'plank',cost:{wood:2},skill:'Making',xp:15},
    {item:'rope',cost:{reed:3},skill:'Making',xp:20},
    {item:'coil',cost:{copper:2},skill:'Making',xp:25},
    {item:'lens',cost:{glass:3,copper:2},skill:'Making',xp:40},
    {item:'axe',cost:{copper:3,wood:3},skill:'Making',xp:35},
    {item:'coat',cost:{reed:6,rope:1},skill:'Making',xp:40}
  ];
  const PROJECTS = [
    {id:'welcome',title:'A warm welcome',subtitle:'Mara has been clearing the village since dawn. Bring her two smoked fish and stay for lunch.',cost:{meal:2},reward:35,x:22,y:24,target:'mara',place:'Mara, in Bracken Bay'},
    {id:'bridge',title:'Across the water',subtitle:'The storm took the footbridge. A few sturdy timbers and stones will reconnect the two sides of the island.',cost:{wood:6,stone:4},reward:60,x:37,y:22,target:'bridge',place:'The broken footbridge'},
    {id:'jetty',title:'A way back to the sea',subtitle:'Patch the harbour jetty. Once it is safe, the island paths will open for quick travel.',cost:{plank:4,rope:2},reward:85,x:47,y:31,target:'jetty',place:'The harbour jetty'},
    {id:'beacon',title:'Bring the light back',subtitle:'Repair the headland beacon so passing boats can find their way home. One small light makes a difference.',cost:{coil:2,glass:4,lens:1},reward:150,x:49,y:9,target:'beacon',place:'The headland beacon'}
  ];
  const freshState = () => ({version:1,x:22,y:22,hp:100,coins:20,bag:{wood:2,herb:2},storage:{},gear:{tool:null,coat:null},xp:{Gathering:0,Angling:0,Making:0,Cooking:0,Trailcraft:0},projects:[],visited:['village'],cooldowns:{},sound:true,labels:true,log:[],introSeen:false});
  let state = freshState(), saveAvailable = true;
  try {
    const data = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (data?.version === 1) {
      state = {...freshState(),...data};
      for(const group of ['bag','storage']) {
        state[group] = Object.fromEntries(Object.entries(data[group] || {}).filter(([k,v]) => ITEMS[k] && Number.isSafeInteger(v) && v > 0 && v < 100000));
      }
      state.gear = {tool:data.gear?.tool === 'axe' ? 'axe' : null,coat:data.gear?.coat === 'coat' ? 'coat' : null};
      state.xp = Object.fromEntries(Object.keys(freshState().xp).map(k => [k,Math.max(0,Number(data.xp?.[k]) || 0)]));
      state.projects = [...new Set((Array.isArray(data.projects) ? data.projects : []).filter(id => PROJECTS.some(p => p.id === id)))];
      state.visited = Array.isArray(data.visited) ? data.visited : ['village'];
      state.log = Array.isArray(data.log) ? data.log.filter(v => typeof v === 'string').slice(0,25) : [];
      state.cooldowns = data.cooldowns && typeof data.cooldowns === 'object' ? data.cooldowns : {};
      state.hp = Math.max(1,Math.min(100,Number(data.hp) || 100));
      state.coins = Math.max(0,Math.floor(Number(data.coins) || 0));
    }
  } catch { saveAvailable = false; }

  const rand = (x,y) => {const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
  const terrain = Array.from({length:H},(_,y)=>Array.from({length:W},(_,x)=>{
    const west=3+Math.sin(y*.31)*1.6, east=55+Math.sin(y*.22)*2;
    if(x<west||x>east||y<3+Math.sin(x*.25)*1.5||y>36+Math.sin(x*.21)*2)return 'water';
    if(x===37||x===38)return 'river';
    if(x<west+2||x>east-3||y>34+Math.sin(x*.21)*2)return 'sand';
    if(y>=18&&y<=26&&x>=17&&x<=27)return 'village';
    if(y>=6&&y<=12&&x>=14&&x<=22)return 'quarry';
    if((Math.abs(y-22)<1&&x>9&&x<51)||(Math.abs(x-22)<1&&y>9&&y<32)||(Math.abs(x-47)<1&&y>10&&y<34))return 'path';
    return 'grass';
  }));
  const buildings = [
    {x:17,y:18,w:4,h:3,name:'The workshop',roof:'#b36d51'},
    {x:24,y:18,w:4,h:3,name:'Bay stores',roof:'#537d7d'},
    {x:17,y:25,w:4,h:3,name:'A place to stay',roof:'#b7895a'},
    {x:44,y:28,w:4,h:3,name:'The boathouse',roof:'#577d83'},
    {x:46,y:6,w:3,h:2,name:'Weather station',roof:'#839384'}
  ];
  const objects = [];
  const addObj = (id,type,name,x,y,extra={}) => objects.push({id,type,name,x,y,...extra});
  addObj('bench','bench','Village workbench',20,22,{action:'Make something',description:'Turn found materials into something useful.'});
  addObj('stove','fire','Camp stove',24,24,{action:'Cook fish',description:'Cook fresh mackerel into a nourishing meal.'});
  addObj('storage','storage','Supply chest',18,23,{action:'Open chest',description:'A little room for things you want to keep.'});
  addObj('shop','shop','Bay stores',26,22,{action:'Trade',description:'Sell your finds or pick up a few supplies.'});
  addObj('mara','person','Mara',22,24,{action:'Talk to Mara',description:'The keeper of Bracken Bay. Good company, better directions.'});
  addObj('bridge','bridge','Broken footbridge',37,22,{action:'Repair bridge',description:'Six driftwood and four stone will get you across.'});
  addObj('jetty','jetty','Harbour jetty',47,31,{action:'Repair jetty',description:'A few planks and some rope. Then the boats can return.'});
  addObj('beacon','beacon','Headland beacon',49,9,{action:'Repair beacon',description:'Bring a lens, two copper coils and four sea glass.'});
  addObj('rest','rest','Your cottage',21,27,{action:'Rest a while',description:'Take a breath and restore your health.'});
  const resources=[
    ['wood','Fallen branches',[[12,23],[13,26],[10,27],[14,30],[11,31],[28,29],[30,25],[7,19],[10,18],[32,17],[31,32]]],
    ['wood','Beach driftwood',[[7,31],[8,33],[10,35],[15,35],[24,35],[30,34],[52,27]]],
    ['stone','Quarry stone',[[16,10],[18,9],[20,10],[15,8],[21,7],[18,12]]],
    ['reed','Marsh reeds',[[34,23],[35,25],[35,28],[34,30],[40,25],[41,27]]],
    ['herb','Sea fennel',[[12,20],[15,24],[29,23],[31,29],[44,16],[50,24]]],
    ['fish','Mackerel shoal',[[37,20],[37,18],[38,29],[55,33],[56,30]]],
    ['copper','Weather station salvage',[[46,10],[48,11],[50,12],[51,8],[45,8]]],
    ['glass','Sea glass',[[53,14],[54,17],[53,21],[52,25],[53,28],[52,31]]]
  ];
  for(const [item,name,positions] of resources)positions.forEach(([x,y])=>addObj(`${item}-${x}-${y}`,'resource',name,x,y,{item,action:item==='fish'?'Cast a line':item==='stone'?'Collect stone':item==='copper'?'Salvage copper':'Gather',description:ITEMS[item].description}));
  const trees=[];
  for(let y=4;y<37;y++)for(let x=5;x<55;x++){
    if(terrain[y][x]==='grass'&&rand(x,y)>.85&&!objects.some(o=>Math.hypot(o.x-x,o.y-y)<1.6)&&!buildings.some(b=>x>=b.x-1&&x<=b.x+b.w&&y>=b.y-1&&y<=b.y+b.h))trees.push({x,y,size:.85+rand(y,x)*.5});
  }
  const boars=[{id:'boar-1',x:11,y:12,homeX:11,homeY:12,calmUntil:0,lastHit:0},{id:'boar-2',x:43,y:15,homeX:43,homeY:15,calmUntil:0,lastHit:0}];
  const waypoints=[{id:'village',name:'Bracken Bay',x:22,y:22},{id:'quarry',name:'Old quarry',x:20,y:13},{id:'grove',name:'Driftwood grove',x:13,y:28},{id:'harbour',name:'South harbour',x:46,y:32},{id:'headland',name:'The headland',x:48,y:13}];
  const completed = id => state.projects.includes(id);
  function walkable(x,y,projectIds=state.projects){
    if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=W||y>=H)return false;
    if(y===22&&(x===37||x===38))return projectIds.includes('bridge');
    if(['water','river'].includes(terrain[y][x]))return false;
    if(buildings.some(b=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h))return false;
    if(trees.some(o=>o.x===x&&o.y===y))return false;
    if(objects.some(o=>o.x===x&&o.y===y&&o.type!=='bridge'))return false;
    return true;
  }
  if(!walkable(Math.round(state.x),Math.round(state.y))){state.x=22;state.y=22;}
  let px=state.x,py=state.y,path=[],task=null,nearby=null,selected=null,panel=null,returnFocus=null;
  let view={w:0,h:0,tile:48,camX:0,camY:0},lastTime=0,simTime=0,autosaveTime=0,toastTime=0,moveCount=0,hudClock=0;
  let stick={x:0,y:0,id:null},pointer=null,marker=null,particles=[],audio=null,dirty=false;
  const keys=new Set();
  function notify(message,record=true){
    $('toast').textContent=message;$('toast').classList.add('show');toastTime=4.4;
    if(record){state.log.unshift(message);state.log=state.log.slice(0,25);dirty=true;}
  }
  function sound(kind='gather'){
    if(!state.sound)return;
    try{
      audio ||= new (window.AudioContext||window.webkitAudioContext)();
      if(audio.state==='suspended')audio.resume();
      const oscillator=audio.createOscillator(),gain=audio.createGain(),now=audio.currentTime;
      oscillator.type='sine';oscillator.frequency.setValueAtTime(kind==='success'?620:kind==='step'?180:390,now);
      oscillator.frequency.exponentialRampToValueAtTime(kind==='success'?930:240,now+.12);
      gain.gain.setValueAtTime(.035,now);gain.gain.exponentialRampToValueAtTime(.001,now+.2);
      oscillator.connect(gain);gain.connect(audio.destination);oscillator.start();oscillator.stop(now+.22);
    }catch{/* Sound is optional on devices with unavailable audio. */}
  }
  function save(){
    try{state.x=Math.round(px);state.y=Math.round(py);localStorage.setItem(SAVE_KEY,JSON.stringify(state));saveAvailable=true;dirty=false;$('save-indicator').textContent='Saved on this device';}
    catch{saveAvailable=false;$('save-indicator').textContent='Saving unavailable';}
  }
  function count(item){return state.bag[item]||0;}
  function has(cost){return Object.entries(cost).every(([item,n])=>count(item)>=n);}
  function give(item,n=1){state.bag[item]=count(item)+n;dirty=true;updateHUD();}
  function take(cost){if(!has(cost))return false;for(const [item,n]of Object.entries(cost)){state.bag[item]-=n;if(!state.bag[item])delete state.bag[item];}dirty=true;return true;}
  function xp(skill,n){const before=level(skill);state.xp[skill]+=n;dirty=true;if(level(skill)>before)notify(`${skill} is now level ${level(skill)}. Finding your feet.`,false);}
  function level(skill){return 1+Math.floor(Math.sqrt(state.xp[skill]/60));}
  function ready(obj){return (Number(state.cooldowns[obj.id])||0)<=Date.now();}
  function nextProject(){return PROJECTS.find(p=>!completed(p.id));}
  function updateHUD(){
    $('health-label').textContent=Math.round(state.hp);$('health-fill').style.width=`${state.hp}%`;
    $('bag-count').textContent=Object.values(state.bag).reduce((a,b)=>a+b,0);
    $('objective-text').textContent=nextProject()?.title||'The light is on. Keep exploring.';
    $('journal-dot').hidden=!nextProject()||!has(nextProject().cost);
    $('nav-status').textContent=completed('beacon')?'Bracken Bay is finding its feet.':'No rush. You’re on island time.';
    if(!saveAvailable)$('save-indicator').textContent='Saving unavailable';
  }
  function findPath(sx,sy,gx,gy,range=0){
    sx=Math.round(sx);sy=Math.round(sy);gx=Math.round(gx);gy=Math.round(gy);
    const isGoal=(x,y)=>Math.hypot(x-gx,y-gy)<=range+.01;
    if(isGoal(sx,sy))return [];
    const start=sy*W+sx,queue=[start],prev=new Int32Array(W*H).fill(-1);prev[start]=start;
    let head=0,found=-1;
    while(head<queue.length){
      const at=queue[head++],x=at%W,y=Math.floor(at/W);
      for(const [dx,dy]of [[0,-1],[1,0],[0,1],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]){
        const nx=x+dx,ny=y+dy,ni=ny*W+nx;
        if(!walkable(nx,ny)||prev[ni]!==-1)continue;
        if(dx&&dy&&(!walkable(x+dx,y)||!walkable(x,y+dy)))continue;
        prev[ni]=at;queue.push(ni);
        if(isGoal(nx,ny)){found=ni;break;}
      }
      if(found!==-1)break;
    }
    if(found===-1)return null;
    const result=[];while(found!==start){result.push({x:found%W,y:Math.floor(found/W)});found=prev[found];}return result.reverse();
  }
  function stop(){path=[];task=null;$('gather-progress').hidden=true;updateNearby();}
  function goTo(x,y,obj=null){
    const route=findPath(px,py,x,y,obj?1.5:0);
    if(route===null){notify(x>=37&&!completed('bridge')?'Repair the footbridge to reach the eastern shore.':'There’s no clear path there. Try the open ground nearby.',false);return false;}
    path=route;task=obj?{obj,progress:0,duration:obj.item==='fish'?2.4:1.25}:null;
    marker={x,y,time:1};sound('step');updateNearby();return true;
  }
  function travel(x,y){
    stop();px=x;py=y;state.x=x;state.y=y;dirty=true;particlesBurst(px,py,'#fff1c1',15);updateNearby();save();
  }
  function particlesBurst(x,y,color,n=8){if(reducedMotion)return;for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2;particles.push({x:x+.5,y:y+.5,vx:Math.cos(a)*1.2,vy:Math.sin(a)*1.2-1,life:1,color});}}
  function updateNearby(){
    if(task){nearby=task.obj;}else{
      nearby=objects.filter(o=>Math.hypot(px-o.x,py-o.y)<2.35&&(o.type!=='resource'||ready(o))).sort((a,b)=>Math.hypot(px-a.x,py-a.y)-Math.hypot(px-b.x,py-b.y))[0]||null;
      const boar=boars.find(b=>Math.hypot(px-b.x,py-b.y)<2.4&&b.calmUntil<simTime);
      if(boar)nearby={...boar,type:'boar',name:'Startled wild boar',action:'Give it space',description:'Keep your distance, or gently drive it away.'};
    }
    let title='Take the slow way',detail='Walk over to something that catches your eye.',label='Explore',symbol='compass';
    if(nearby){title=nearby.name;detail=nearby.description;label=nearby.action;symbol=nearby.type==='resource'?ITEMS[nearby.item].icon:nearby.type==='shop'?'bag':nearby.type==='person'?'talk':nearby.type==='boar'?'wildlife':nearby.type;
      if(['bridge','jetty','beacon'].includes(nearby.type)&&completed(nearby.id)){label='Take a look';title=nearby.id==='bridge'?'Mended footbridge':nearby.id==='jetty'?'Harbour jetty':'Headland beacon';}
    }
    if(path.length){detail=task?`On the way · ${nearby?.name||''}`:'On the way. Tap anywhere to change direction.';}
    if(task&&!path.length&&task.obj.type==='resource'){label='Gathering…';detail='A small find. Tap Stop to cancel.';}
    $('action-title').textContent=title;$('action-detail').textContent=detail;$('interact-label').textContent=label;
    $('action-symbol').innerHTML=icon(symbol);$('interact-button').disabled=!nearby||!!task;
    let location='Bracken Bay',sub='The island is yours to explore';
    if(px<16&&py>18){location='Driftwood grove';sub='Take only what you need';}
    else if(py<15&&px<25){location='The old quarry';sub='Solid ground, useful things';}
    else if(px>39&&py>26){location='South harbour';sub='Where the island meets the sea';}
    else if(px>39&&py<17){location='The headland';sub='A little closer to the sky';}
    else if(px>30&&px<42){location='The reedbeds';sub='Water finds its own way';}
    else if(px>40){location='Glasswater coast';sub='See what the tide left behind';}
    $('location').textContent=location;$('location-sub').textContent=sub;
  }
  function activate(obj){
    if(obj.type!=='boar'&&Math.hypot(px-obj.x,py-obj.y)>1.65){goTo(obj.x,obj.y,obj);return;}
    if(obj.type==='resource'){
      if(!ready(obj)){notify('Let this spot recover. There are more supplies nearby.',false);return;}
      if(Math.hypot(px-obj.x,py-obj.y)>1.6){goTo(obj.x,obj.y,obj);return;}
      task={obj,progress:0,duration:obj.item==='fish'?2.4:1.25};path=[];updateNearby();return;
    }
    if(obj.type==='boar'){
      const b=boars.find(b=>b.id===obj.id);if(b){b.calmUntil=simTime+25;particlesBurst(b.x,b.y,'#e1bd92');xp('Trailcraft',12);notify('A firm tap of your walking stick. The boar gives you room.');}stop();return;
    }
    stop();
    if(obj.type==='bench')openPanel('craft');
    else if(obj.type==='storage')openPanel('storage');
    else if(obj.type==='shop')openPanel('shop');
    else if(obj.type==='person')openPanel('mara');
    else if(obj.type==='rest'){state.hp=100;updateHUD();sound('success');dirty=true;notify('A deep breath, a cup of tea. Good as new.');}
    else if(obj.type==='fire'){
      if(!count('fish')){notify('Bring fresh mackerel. There’s a fishing spot by the western riverbank.',false);return;}
      take({fish:1});give('meal');xp('Cooking',24);particlesBurst(obj.x,obj.y,'#f0bb71');sound('success');notify('One smoked fish, ready for lunch.');
    }else if(['bridge','jetty','beacon'].includes(obj.type))openPanel('project',obj.id);
  }
  function finishGather(obj){
    if(!ready(obj)){stop();return;}
    const amount=obj.item==='wood'?(state.gear.tool==='axe'?3:2):obj.item==='fish'?1:2;
    give(obj.item,amount);xp(obj.item==='fish'?'Angling':'Gathering',obj.item==='fish'?24:16);
    state.cooldowns[obj.id]=Date.now()+(obj.item==='fish'?4000:16000);
    particlesBurst(obj.x,obj.y,obj.item==='copper'?'#d99864':'#e5d59d');sound();
    notify(`+${amount} ${ITEMS[obj.item].name.toLowerCase()}. A useful find.`);stop();save();
  }
  function completeProject(id){
    const project=PROJECTS.find(p=>p.id===id);if(!project||completed(id))return;
    if(Math.hypot(px-project.x,py-project.y)>2){notify('Bring the supplies to the project first.',false);return;}
    const idx=PROJECTS.indexOf(project);
    if(idx&& !completed(PROJECTS[idx-1].id)){notify('Finish the earlier island project first.',false);return;}
    if(!take(project.cost)){notify('You still need a few supplies. Check the list in your journal.',false);return;}
    state.projects.push(id);state.coins+=project.reward;xp('Trailcraft',75);sound('success');
    closePanel();particlesBurst(project.x,project.y,'#ffe2a5',24);
    notify(id==='beacon'?'The beacon is glowing. Bracken Bay is connected to the world again.':`${project.title}: complete. +${project.reward} trade tokens.`);
    updateHUD();updateNearby();save();
    if(id==='beacon')setTimeout(()=>openPanel('ending'),700);
  }
  const requirementHTML=cost=>Object.entries(cost).map(([id,n])=>`<span class="requirement ${count(id)>=n?'met':''}">${count(id)}/${n} ${ITEMS[id].name.toLowerCase()}</span>`).join('');
  function projectHTML(p,detail=false){
    const done=completed(p.id),idx=PROJECTS.indexOf(p),locked=idx>0&&!completed(PROJECTS[idx-1].id),near=Math.hypot(px-p.x,py-p.y)<2;
    return `<article class="project-card"><div class="project-top"><h3>${p.title}</h3><span class="badge ${!done&&!locked?'current':''}">${done?'Restored':locked?'Up next':'In progress'}</span></div><p>${p.subtitle}</p>${!done?`<div class="requirements">${requirementHTML(p.cost)}</div><div class="button-row">${detail&&near&&!locked?`<button class="primary-button" data-complete="${p.id}" ${has(p.cost)?'':'disabled'}>${p.id==='welcome'?'Share lunch':'Finish repair'}</button>`:`<button class="secondary-button" data-route="${p.target}">Find ${p.id==='welcome'?'Mara':p.id==='bridge'?'the bridge':p.id==='jetty'?'the jetty':'the beacon'}</button>`}</div><p style="margin-bottom:0;font-size:10px">${p.reward} trade tokens · ${p.place}</p>`:'<p style="margin-bottom:0">A small change, a better island.</p>'}</article>`;
  }
  const TITLES={bag:['YOUR POCKET OF THE WORLD','Your satchel'],journal:['LITTLE THINGS ADD UP','Field journal'],map:['FIND YOUR OWN WAY','The island'],craft:['FOUND, MADE, USEFUL','The workbench'],storage:['ROOM FOR ANOTHER DAY','Supply chest'],shop:['BRACKEN BAY CO-OPERATIVE','Bay stores'],mara:['A FAMILIAR FACE','A word with Mara'],project:['PUTTING THINGS RIGHT','Island project'],settings:['MAKE YOURSELF AT HOME','A few preferences'],help:['A LITTLE POINTER','Welcome to Tidemark'],ending:['ONE SMALL LIGHT','The way home']};
  let panelDetail=null;
  function openPanel(name,detail=null){
    if(!panel)returnFocus=document.activeElement;
    panel=name;panelDetail=detail;selected=null;keys.clear();stick.x=stick.y=0;$('joystick-knob').style.transform='';
    $('sheet-backdrop').hidden=false;$('sheet').hidden=false;renderPanel();
    document.querySelectorAll('[data-panel]').forEach(b=>b.setAttribute('aria-expanded',String(b.dataset.panel===name)));
    requestAnimationFrame(()=>$('close-sheet').focus({preventScroll:true}));
  }
  function closePanel(){
    panel=null;$('sheet').hidden=true;$('sheet-backdrop').hidden=true;document.querySelectorAll('[data-panel]').forEach(b=>b.setAttribute('aria-expanded','false'));
    (returnFocus?.isConnected?returnFocus:canvas).focus({preventScroll:true});returnFocus=null;save();updateNearby();
  }
  function renderPanel(){
    if(!panel)return;const [eyebrow,title]=TITLES[panel];$('sheet-eyebrow').textContent=eyebrow;$('sheet-title').textContent=title;
    let html='';
    if(panel==='bag'||panel==='storage'){
      const entries=Object.entries(state.bag);html=`<p class="intro">${panel==='storage'?'Tap an item to move it into the supply chest. Everything here is yours to keep.':'Found things, useful things, a little lunch for later. Tap an item for details.'}</p><div class="section-label"><span>Carrying ${entries.length} kinds of things</span><span>${state.coins} trade tokens</span></div><div class="item-grid">${entries.map(([id,n])=>`<button class="item-card ${selected===id?'selected':''}" data-item="${id}" aria-label="${ITEMS[id].name}, ${n} held"><span class="item-art">${icon(ITEMS[id].icon)}</span><span class="item-quantity">${n}</span><b>${ITEMS[id].name}</b><small>${ITEMS[id].gear?'Equipment':ITEMS[id].heal?'Ready to eat':'Material'}</small></button>`).join('')}</div>${!entries.length?'<p class="empty-message">A little room for your next find.</p>':''}`;
      if(selected&&ITEMS[selected]&&count(selected)){
        const item=ITEMS[selected];html+=`<div class="item-detail"><h3>${item.name}</h3><p>${item.description}</p><div class="button-row">${item.heal?'<button class="primary-button" data-use="eat">Eat one</button>':''}${item.gear?'<button class="primary-button" data-use="equip">Equip</button>':''}<button class="secondary-button danger" data-use="discard">Leave one behind</button></div></div>`;
      }
      html+=`<div class="section-label"><span>Wearing & carrying</span></div><div class="button-row"><button class="secondary-button" data-unequip="tool">${state.gear.tool?'Hatchet equipped · Remove':'Walking stick · Always handy'}</button><button class="secondary-button" data-unequip="coat">${state.gear.coat?'Field jacket · Remove':'Everyday clothes'}</button></div>`;
      if(panel==='storage')html+=`<div class="section-label"><span>In the chest</span><button class="secondary-button" data-store-all>Store everything</button></div><div class="item-grid">${Object.entries(state.storage).map(([id,n])=>`<button class="item-card" data-withdraw="${id}"><span class="item-art">${icon(ITEMS[id].icon)}</span><span class="item-quantity">${n}</span><b>${ITEMS[id].name}</b><small>Take one</small></button>`).join('')}</div>${!Object.keys(state.storage).length?'<p class="empty-message">Nothing stored yet.</p>':''}`;
    }else if(panel==='journal'){
      html='<p class="intro">The storm left its mark. Help Mara reconnect the island, one small repair at a time.</p>'+PROJECTS.map(p=>projectHTML(p)).join('');
      html+='<div class="section-label"><span>Learning by doing</span></div><div class="skill-list">'+Object.entries(state.xp).map(([name,n])=>{const l=level(name),low=(l-1)**2*60,high=l*l*60;return `<div class="skill">${name}<span>Level ${l}</span><div class="skill-track"><i style="width:${(n-low)/(high-low)*100}%"></i></div></div>`;}).join('')+'</div>';
      html+='<div class="section-label"><span>Notes from the island</span></div>'+state.log.slice(0,8).map(line=>`<div class="log-line">${escapeHTML(line)}</div>`).join('');
    }else if(panel==='craft'){
      html='<p class="intro">Nothing enchanted. Just a few found materials, a steady hand, and a useful idea.</p>'+RECIPES.map((r,i)=>`<div class="recipe"><span class="recipe-art">${icon(ITEMS[r.item].icon)}</span><div class="recipe-info"><h3>${ITEMS[r.item].name}</h3><p>${Object.entries(r.cost).map(([id,n])=>`${n} ${ITEMS[id].name.toLowerCase()} (${count(id)} held)`).join(' + ')}</p></div><button class="secondary-button" data-craft="${i}" ${has(r.cost)?'':'disabled'}>Make one</button></div>`).join('');
    }else if(panel==='mara'){
      html='<p class="intro">“You made it. Good. The kettle’s still on.”</p><p class="intro">“Start with lunch. There are mackerel in the river, just west of the footbridge. Cook them at our camp stove. After that, we’ll see about putting the island back together.”</p>';
      html+=completed('welcome')?`<p class="intro">“That bridge needs driftwood and quarry stone. The jetty needs planks and rope. For the beacon, you’ll find copper at the old weather station and glass along the eastern shore. You’ll want the workbench for those.”</p><button class="primary-button" data-open-journal>Open field journal</button>`:projectHTML(PROJECTS[0],true);
    }else if(panel==='project'){
      const p=PROJECTS.find(p=>p.id===panelDetail);html=p?projectHTML(p,true):'';
    }else if(panel==='map'){
      html='<p class="intro">Tap open ground to set a walking route. The footbridge connects the east coast once you’ve repaired it.</p><div class="map-wrap"><canvas id="atlas" width="768" height="528" aria-label="Island map. Tap to walk, or choose a named destination below."></canvas></div><div class="map-key"><span><i style="background:#df7752"></i>You are here</span><span><i style="background:#6d8b62"></i>Island landmarks</span></div><div class="waypoints">'+waypoints.map(w=>`<button class="secondary-button" data-waypoint="${w.id}">${w.name}<small>${completed('jetty')&&state.visited.includes(w.id)?'Quick travel available':'Set a walking route'}</small></button>`).join('')+'</div>';
    }else if(panel==='shop'){
      html=`<p class="intro">The island trades in favours and useful things. You have <b>${state.coins} trade tokens</b>.</p><div class="section-label"><span>Pick up a few supplies</span></div>`+[['meal',16],['wood',5],['stone',5],['reed',5]].map(([id,price])=>`<div class="recipe"><span class="recipe-art">${icon(ITEMS[id].icon)}</span><div class="recipe-info"><h3>${ITEMS[id].name}</h3><p>${price} tokens each</p></div><button class="secondary-button" data-buy="${id}" data-price="${price}" ${state.coins>=price?'':'disabled'}>Buy one</button></div>`).join('');
      html+='<div class="section-label"><span>Make room in your satchel</span></div>'+Object.entries(state.bag).map(([id,n])=>`<div class="recipe"><span class="recipe-art">${icon(ITEMS[id].icon)}</span><div class="recipe-info"><h3>${ITEMS[id].name} × ${n}</h3><p>${ITEMS[id].value} tokens each</p></div><button class="secondary-button" data-sell="${id}">Sell one</button></div>`).join('');
    }else if(panel==='settings'){
      html=`<div class="settings-row"><div>Quiet little sounds<small>A soft note for finds and finished work</small></div><button class="secondary-button" data-toggle="sound" aria-pressed="${state.sound}">${state.sound?'On':'Off'}</button></div><div class="settings-row"><div>Place names<small>Show useful labels around the island</small></div><button class="secondary-button" data-toggle="labels" aria-pressed="${state.labels}">${state.labels?'On':'Off'}</button></div><div class="settings-row"><div>Save your progress<small>${saveAvailable?'Automatically saved on this browser and device':'This browser is blocking local saves'}</small></div><button class="secondary-button" data-save>Save now</button></div><div class="settings-row"><div>Take your save with you<small>Download a backup or load an earlier save</small></div><div class="button-row"><button class="secondary-button" data-export>Export</button><button class="secondary-button" data-import>Import</button></div></div><input id="save-file" type="file" accept="application/json,.json" hidden><div class="section-label"><span>A fresh start</span></div><p class="intro">Starting over clears the progress saved in this browser. You’ll be asked once more before anything changes.</p><button class="secondary-button danger" data-reset>Start a new island</button>`;
    }else if(panel==='help'){
      html='<p class="intro">Welcome to Bracken Bay. The storm has passed. There’s an island to explore, a few things to fix, and no particular hurry.</p>'+[
        ['Follow your curiosity','Tap open ground to walk there. On a phone, you can also hold and move the thumb stick. On a keyboard, use WASD or the arrow keys.'],
        ['Make yourself useful','Tap a resource to walk over and gather it. Or stand nearby and use the action button (E on a keyboard). Look for fallen branches, quarry stone, reeds and ripples in the river.'],
        ['A little lunch, a little repair','Talk to Mara in the village. Catch two fish, use the camp stove twice, then bring her lunch. Your journal keeps track of the next island project.'],
        ['Found things become new things','Use the village workbench to make planks, rope and equipment. Equip a hatchet or field jacket from your satchel. Bay stores buys spare materials; the supply chest keeps them safe.'],
        ['Look after yourself','Give wild boars room, or use the action button to drive them off. Eat from your satchel or rest at your cottage. If you’re hurt, you return home with all your belongings.'],
        ['Come back whenever','Progress saves automatically in this browser. Menus pause the island. After repairing the jetty, you can quickly travel to places you’ve visited.']
      ].map(([title,text],i)=>`<div class="help-step"><span class="step-num">${i+1}</span><div><h3>${title}</h3><p>${text}</p></div></div>`).join('')+'<button class="primary-button" data-start>Make yourself at home</button>';
    }else if(panel==='ending'){
      html='<div class="recipe-art" style="color:var(--accent);margin-bottom:18px">'+icon('beacon')+'</div><p class="intro">A light sweeps across the water. Out past the headland, a boat answers with a little flash of its own.</p><p class="intro">The bridge is standing. The harbour is open. There’s lunch in the village and a light to guide the way home.</p><p class="intro">You’ve finished the island’s four projects. You can keep wandering, make yourself some equipment, or simply stay a while.</p><button class="primary-button" data-start>Stay a while</button>';
    }
    const oldScroll=$('sheet-content').scrollTop;$('sheet-content').innerHTML=html;$('sheet-content').scrollTop=oldScroll;
    if(panel==='map'){drawAtlas();$('atlas').addEventListener('click',e=>{const r=e.currentTarget.getBoundingClientRect(),x=Math.floor((e.clientX-r.left)/r.width*W),y=Math.floor((e.clientY-r.top)/r.height*H);if(walkable(x,y)){closePanel();goTo(x,y);}else notify('Choose open ground, or a named destination below.',false);});}
    if(panel==='settings')$('save-file').addEventListener('change',importSave);
  }
  $('sheet-content').addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b||b.disabled)return;const d=b.dataset;
    if(d.item){
      if(panel==='storage'){state.storage[d.item]=(state.storage[d.item]||0)+1;take({[d.item]:1});}
      else selected=selected===d.item?null:d.item;
      renderPanel();
    }else if(d.withdraw){if(state.storage[d.withdraw]>0){state.storage[d.withdraw]--;if(!state.storage[d.withdraw])delete state.storage[d.withdraw];give(d.withdraw);}renderPanel();}
    else if('storeAll'in d){for(const [id,n]of Object.entries(state.bag))state.storage[id]=(state.storage[id]||0)+n;state.bag={};dirty=true;renderPanel();}
    else if(d.use&&selected){const item=ITEMS[selected];
      if(d.use==='eat'){if(state.hp===100){notify('You’re already feeling good. Save it for later.',false);return;}take({[selected]:1});state.hp=Math.min(100,state.hp+item.heal);sound();}
      else if(d.use==='equip'){take({[selected]:1});if(state.gear[item.gear])give(state.gear[item.gear]);state.gear[item.gear]=selected;sound();}
      else if(d.use==='discard')take({[selected]:1});renderPanel();
    }else if(d.unequip){if(state.gear[d.unequip]){give(state.gear[d.unequip]);state.gear[d.unequip]=null;dirty=true;renderPanel();}}
    else if(d.craft!==undefined){const r=RECIPES[+d.craft];if(take(r.cost)){give(r.item);xp(r.skill,r.xp);sound('success');renderPanel();}}
    else if(d.complete){completeProject(d.complete);}
    else if(d.route){const obj=objects.find(o=>o.id===d.route);closePanel();goTo(obj.x,obj.y,obj);}
    else if(d.waypoint){const w=waypoints.find(w=>w.id===d.waypoint);closePanel();if(completed('jetty')&&state.visited.includes(w.id)){travel(w.x,w.y);notify(`Back to ${w.name}. The paths feel familiar.`,false);}else goTo(w.x,w.y);}
    else if(d.buy){const price=Number(d.price);if(state.coins>=price){state.coins-=price;give(d.buy);sound();renderPanel();}}
    else if(d.sell){if(take({[d.sell]:1})){state.coins+=ITEMS[d.sell].value;sound();renderPanel();}}
    else if(d.toggle){state[d.toggle]=!state[d.toggle];dirty=true;renderPanel();}
    else if('save'in d){save();renderPanel();}
    else if('export'in d){save();const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='tidemark-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
    else if('import'in d)$('save-file').click();
    else if('reset'in d){if(confirm('Start a new island? This clears your current progress on this device.')){state=freshState();px=22;py=22;simTime=0;boars.forEach(b=>{b.calmUntil=0;b.lastHit=0;});particles=[];stop();closePanel();save();updateHUD();notify('A fresh start. Mara is waiting by the stove.');}}
    else if('start'in d){state.introSeen=true;dirty=true;closePanel();}
    else if('openJournal'in d)openPanel('journal');
    updateHUD();if(d.use||d.craft!==undefined||d.buy||d.sell||d.item||d.withdraw||'storeAll'in d||d.toggle)save();
  });
  async function importSave(e){
    const file=e.target.files?.[0];if(!file)return;
    try{
      if(file.size>100000)throw Error('too large');
      const data=JSON.parse(await file.text());
      const valid=data.version===1&&walkable(data.x,data.y,data.projects)&&Number.isFinite(data.hp)&&Number.isSafeInteger(data.coins)&&data.coins>=0&&Array.isArray(data.projects)&&data.projects.every(id=>PROJECTS.some(p=>p.id===id))&&data.projects.every((id,i)=>PROJECTS[i]?.id===id)&&Array.isArray(data.visited)&&data.visited.every(id=>waypoints.some(w=>w.id===id))&&typeof data.introSeen==='boolean'&&typeof data.labels==='boolean'&&typeof data.sound==='boolean'&&[data.bag,data.storage].every(g=>g&&typeof g==='object'&&!Array.isArray(g)&&Object.entries(g).every(([k,v])=>ITEMS[k]&&Number.isSafeInteger(v)&&v>0&&v<100000))&&data.xp&&Object.keys(freshState().xp).every(k=>Number.isFinite(data.xp[k])&&data.xp[k]>=0)&&data.gear&&[null,'axe'].includes(data.gear.tool)&&[null,'coat'].includes(data.gear.coat);
      if(!valid)throw Error('invalid');
      if(!confirm('Replace the current island with this saved progress?'))return;
      state={...freshState(),...data,cooldowns:{},log:[]};px=data.x;py=data.y;stop();closePanel();updateHUD();save();notify('Your island is right where you left it.');
    }catch{notify('That file isn’t a valid Tidemark save. Your current island is safe.',false);}
  }

  function resize(){const r=canvas.getBoundingClientRect();view.w=r.width;view.h=r.height;view.tile=innerWidth<700?44:48;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
  new ResizeObserver(resize).observe($('playfield'));
  function camera(){view.camX=Math.max(0,Math.min(W-view.w/view.tile,px+.5-view.w/view.tile/2));view.camY=Math.max(0,Math.min(H-view.h/view.tile,py+.5-view.h/view.tile/2));}
  function eventWorld(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)/view.tile+view.camX,y:(e.clientY-r.top)/view.tile+view.camY};}
  canvas.addEventListener('pointerdown',e=>{if(panel||e.button!==0)return;pointer={x:e.clientX,y:e.clientY,id:e.pointerId};canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointerup',e=>{
    if(!pointer||pointer.id!==e.pointerId)return;const start=pointer;pointer=null;if(panel||Math.hypot(e.clientX-start.x,e.clientY-start.y)>14)return;
    const pos=eventWorld(e);const radius=e.pointerType==='touch'?.75:.58;
    const obj=objects.filter(o=>Math.hypot(o.x+.5-pos.x,o.y+.5-pos.y)<radius).sort((a,b)=>Math.hypot(a.x+.5-pos.x,a.y+.5-pos.y)-Math.hypot(b.x+.5-pos.x,b.y+.5-pos.y))[0];
    if(obj){if(Math.hypot(px-obj.x,py-obj.y)<1.6)activate(obj);else goTo(obj.x,obj.y,obj);}
    else {let x=Math.floor(pos.x),y=Math.floor(pos.y);if(!walkable(x,y)){const candidates=[];for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(walkable(x+dx,y+dy))candidates.push({x:x+dx,y:y+dy});candidates.sort((a,b)=>Math.hypot(a.x+.5-pos.x,a.y+.5-pos.y)-Math.hypot(b.x+.5-pos.x,b.y+.5-pos.y));if(candidates[0])({x,y}=candidates[0]);}goTo(x,y);}
    canvas.focus({preventScroll:true});
  });
  canvas.addEventListener('pointercancel',()=>pointer=null);
  canvas.addEventListener('contextmenu',e=>e.preventDefault());
  function updateStick(e){const r=$('joystick').getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,length=Math.hypot(dx,dy),radius=29;stick.x=length>8?dx/Math.max(radius,length):0;stick.y=length>8?dy/Math.max(radius,length):0;$('joystick-knob').style.transform=`translate(${stick.x*radius}px,${stick.y*radius}px)`;}
  $('joystick').addEventListener('pointerdown',e=>{if(panel)return;stick.id=e.pointerId;$('joystick').setPointerCapture(e.pointerId);stop();updateStick(e);});
  $('joystick').addEventListener('pointermove',e=>{if(e.pointerId===stick.id)updateStick(e);});
  function releaseStick(e){if(e.pointerId===stick.id){stick={x:0,y:0,id:null};$('joystick-knob').style.transform='';}}
  ['pointerup','pointercancel','lostpointercapture'].forEach(type=>$('joystick').addEventListener(type,releaseStick));
  window.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&panel){e.preventDefault();closePanel();return;}
    if(panel){if(e.key==='Tab'){const els=[...$('sheet').querySelectorAll('button:not(:disabled),input:not([hidden])')].filter(el=>el.getClientRects().length),first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}return;}
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(e.key)){e.preventDefault();keys.add(e.key);stop();}
    if(e.key.toLowerCase()==='e'&&!e.repeat&&nearby){e.preventDefault();activate(nearby);}
    if(e.key.toLowerCase()==='i'&&!e.repeat)openPanel('bag');if(e.key.toLowerCase()==='j'&&!e.repeat)openPanel('journal');if(e.key.toLowerCase()==='m'&&!e.repeat)openPanel('map');
  });
  window.addEventListener('keyup',e=>keys.delete(e.key));
  window.addEventListener('blur',()=>{keys.clear();stick={x:0,y:0,id:null};$('joystick-knob').style.transform='';save();});
  document.addEventListener('visibilitychange',()=>{lastTime=performance.now();if(document.hidden){keys.clear();stick={x:0,y:0,id:null};$('joystick-knob').style.transform='';save();}});
  window.addEventListener('pagehide',save);
  $('interact-button').addEventListener('click',()=>{if(nearby&&!task)activate(nearby);});
  $('stop-button').addEventListener('click',stop);
  $('centre-button').addEventListener('click',()=>{travel(22,22);notify('Back in Bracken Bay. Put the kettle on.',false);});
  $('objective-button').addEventListener('click',()=>openPanel('journal'));
  $('settings-button').addEventListener('click',()=>openPanel('settings'));
  $('help-button').addEventListener('click',()=>openPanel('help'));
  $('close-sheet').addEventListener('click',closePanel);$('sheet-backdrop').addEventListener('click',closePanel);
  document.querySelectorAll('[data-panel]').forEach(b=>b.addEventListener('click',()=>openPanel(b.dataset.panel)));

  function update(dt){
    simTime+=dt;autosaveTime+=dt;hudClock+=dt;toastTime-=dt;if(toastTime<=0)$('toast').classList.remove('show');
    let dx=stick.x+(keys.has('d')||keys.has('ArrowRight')?1:0)-(keys.has('a')||keys.has('ArrowLeft')?1:0),dy=stick.y+(keys.has('s')||keys.has('ArrowDown')?1:0)-(keys.has('w')||keys.has('ArrowUp')?1:0);
    const len=Math.hypot(dx,dy),speed=3.5;
    if(len>.1){
      path=[];task=null;$('gather-progress').hidden=true;dx/=len;dy/=len;
      const nx=px+dx*speed*dt,ny=py+dy*speed*dt;
      if(walkable(Math.round(nx),Math.round(py)))px=nx;
      if(walkable(Math.round(px),Math.round(ny)))py=ny;
      dirty=true;
    }else if(path.length){
      let remaining=speed*dt;
      while(path.length&&remaining>0){const next=path[0],dx=next.x-px,dy=next.y-py,dist=Math.hypot(dx,dy);if(dist<=remaining){px=next.x;py=next.y;path.shift();remaining-=dist;moveCount++;}else{px+=dx/dist*remaining;py+=dy/dist*remaining;remaining=0;}}
      dirty=true;
    }else if(task){
      const obj=task.obj;
      if(Math.hypot(px-obj.x,py-obj.y)>1.65){stop();}
      else if(obj.type==='resource'){
        task.progress+=dt;$('gather-progress').hidden=false;$('gather-label').textContent=obj.item==='fish'?'Waiting for a bite…':'Finding something useful…';$('gather-fill').style.width=`${Math.min(100,task.progress/task.duration*100)}%`;
        if(task.progress>=task.duration)finishGather(obj);
      }else{task=null;activate(obj);}
    }
    if(moveCount>=12){xp('Trailcraft',5);moveCount=0;}
    for(const w of waypoints)if(!state.visited.includes(w.id)&&Math.hypot(px-w.x,py-w.y)<3){state.visited.push(w.id);xp('Trailcraft',25);notify(`Found ${w.name}. A new corner of the island.`);}
    for(const b of boars){
      if(b.calmUntil>simTime)continue;
      if(Math.hypot(px-b.x,py-b.y)<1.25&&simTime-b.lastHit>2){
        b.lastHit=simTime;state.hp=Math.max(0,state.hp-(state.gear.coat?4:8));dirty=true;updateHUD();particlesBurst(px,py,'#db866a');
        if(state.hp<=0){state.hp=100;travel(22,22);notify('Mara brings you home for a rest. All your belongings are safe.');updateHUD();}
        else notify('A startled boar! Step back, or use the action button to drive it off.',false);
      }
    }
    particles=particles.filter(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=2*dt;p.life-=dt;return p.life>0;});
    if(marker){marker.time-=dt;if(marker.time<=0)marker=null;}
    if(autosaveTime>8){if(dirty)save();autosaveTime=0;}
    if(hudClock>.12){updateNearby();hudClock=0;}
  }

  // Rendering is independent of saveable simulation state.
  const palette={grass:'#91a477',sand:'#d4c19a',water:'#568e98',river:'#609da3',village:'#b7b59b',quarry:'#a2a590',path:'#c6bd99'};
  const terrainCache=document.createElement('canvas');terrainCache.width=W*48;terrainCache.height=H*48;const tc=terrainCache.getContext('2d');
  function ellipse(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
  function rounded(c,x,y,w,h,r,color){c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();}
  function buildTerrain(){
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const t=terrain[y][x],sx=x*48,sy=y*48,n=rand(x,y);tc.fillStyle=palette[t];tc.fillRect(sx,sy,48,48);
      if(t==='grass'){
        tc.fillStyle=n>.5?'#ffffff05':'#29472506';tc.fillRect(sx,sy,48,48);
        for(let i=0;i<3;i++){const gx=sx+rand(x+i,y)*38+5,gy=sy+rand(y+i,x)*36+6;tc.strokeStyle='#647c4e45';tc.lineWidth=1;tc.beginPath();tc.moveTo(gx,gy);tc.lineTo(gx-2,gy-3);tc.moveTo(gx,gy);tc.lineTo(gx+2,gy-4);tc.stroke();}
        if(n>.84){ellipse(tc,sx+12,sy+20,2,2,'#e9d6a5');ellipse(tc,sx+28,sy+33,1.5,1.5,'#ede2ba');}
      }else if(t==='village'){
        tc.strokeStyle='#9eaa8e65';tc.lineWidth=1;tc.beginPath();tc.moveTo(sx+5,sy+12);tc.lineTo(sx+24,sy+9);tc.lineTo(sx+26,sy+29);tc.lineTo(sx+4,sy+32);tc.closePath();tc.stroke();tc.beginPath();tc.moveTo(sx+29,sy+2);tc.lineTo(sx+44,sy+4);tc.lineTo(sx+42,sy+23);tc.stroke();
      }else if(t==='sand'||t==='path'||t==='quarry'){
        tc.fillStyle=t==='quarry'?'#717c6c50':'#a4967455';for(let i=0;i<4;i++)ellipse(tc,sx+rand(x+i,y)*46,sy+rand(y+i,x)*46,1.1,1,tc.fillStyle);
      }
      if(t!=='water'&&t!=='river'){
        for(const [dx,dy]of [[0,-1],[1,0],[0,1],[-1,0]]){if(terrain[y+dy]?.[x+dx]==='water'||terrain[y+dy]?.[x+dx]==='river'){tc.fillStyle=t==='sand'?'#e2d6b1':'#bac7a0';if(dx)tc.fillRect(sx+(dx>0?43:0),sy,5,48);else tc.fillRect(sx,sy+(dy>0?43:0),48,5);}}
      }
    }
    // A few broad patches soften the tile grid, with deterministic foliage.
    for(let y=5;y<35;y++)for(let x=6;x<54;x++)if(terrain[y][x]==='grass'&&rand(x+50,y)>.93)ellipse(tc,x*48+20,y*48+25,17,11,'#77926425');
  }
  buildTerrain();
  function drawTree(t,time){
    const x=(t.x-view.camX)*view.tile+view.tile*.5,y=(t.y-view.camY)*view.tile+view.tile*.5,s=view.tile/48*t.size;
    ctx.save();ctx.translate(x,y);ctx.scale(s,s);const sway=reducedMotion?0:Math.sin(time*.0006+t.x)*1.3;
    ellipse(ctx,9,16,23,10,'#334d3430');rounded(ctx,-4,0,8,22,2,'#77684b');
    ellipse(ctx,sway,-10,23,26,'#426d58');ellipse(ctx,sway-7,-18,18,19,'#577d5a');ellipse(ctx,sway+6,-23,15,14,'#648a60');ellipse(ctx,sway-8,-28,10,8,'#779768');
    ctx.restore();
  }
  function label(text,x,y,color='#fcf5df'){
    ctx.font='500 10px "Avenir Next", sans-serif';ctx.textAlign='center';const w=ctx.measureText(text).width+14;rounded(ctx,x-w/2,y-12,w,19,6,'#28483bd9');ctx.fillStyle=color;ctx.fillText(text,x,y+1);ctx.textAlign='left';
  }
  function drawBuilding(b){
    const s=view.tile/48,x=(b.x-view.camX)*view.tile,y=(b.y-view.camY)*view.tile,w=b.w*view.tile,h=b.h*view.tile;
    ctx.save();ctx.translate(x,y);ctx.scale(s,s);const bw=w/s,bh=h/s;
    rounded(ctx,9,20,bw,bh,5,'#324f3526');rounded(ctx,2,10,bw-4,bh-10,5,'#d6c6a3');
    ctx.fillStyle='#e8dbb9';ctx.fillRect(3,bh-33,bw-6,25);ctx.fillStyle='#796d52';ctx.fillRect(bw/2-10,bh-25,20,25);
    for(let wx=22;wx<bw-10;wx+=53){rounded(ctx,wx,bh-28,17,17,2,'#688983');ctx.strokeStyle='#e7d7af';ctx.lineWidth=2;ctx.strokeRect(wx,bh-28,17,17);ctx.beginPath();ctx.moveTo(wx+8,bh-28);ctx.lineTo(wx+8,bh-11);ctx.stroke();}
    ctx.fillStyle=b.roof;ctx.beginPath();ctx.moveTo(-7,12);ctx.lineTo(bw/2,-14);ctx.lineTo(bw+7,12);ctx.lineTo(bw+7,bh-40);ctx.lineTo(-7,bh-40);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#ffffff12';ctx.lineWidth=1;for(let ry=21;ry<bh-40;ry+=14){ctx.beginPath();ctx.moveTo(-4,ry);ctx.lineTo(bw+4,ry);ctx.stroke();}
    ctx.strokeStyle='#493d3628';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-7,bh-40);ctx.lineTo(bw+7,bh-40);ctx.stroke();
    rounded(ctx,bw-35,-7,12,26,2,'#b0a48a');ctx.fillStyle='#827b66';ctx.fillRect(bw-37,-9,16,6);
    ctx.restore();if(state.labels&&Math.hypot(px-(b.x+b.w/2),py-(b.y+b.h/2))<8)label(b.name,x+w/2,y+h-28*s);
  }
  function drawObject(o,time){
    const t=view.tile,s=t/48,x=(o.x-view.camX)*t+t/2,y=(o.y-view.camY)*t+t/2;
    ctx.save();ctx.translate(x,y);ctx.scale(s,s);
    if(o.type==='resource'&&!ready(o)){ellipse(ctx,0,9,9,3,'#6d7c5740');ctx.restore();return;}
    const active=task?.obj===o||nearby?.id===o.id;
    if(active){ctx.strokeStyle='#fff3be90';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(0,12,20,9,0,0,Math.PI*2);ctx.stroke();}
    if(o.type==='resource'){
      if(o.item==='wood'){
        ellipse(ctx,2,12,16,6,'#4d5d3422');ctx.save();ctx.rotate(-.35);rounded(ctx,-18,-3,35,12,4,'#95795a');ctx.fillStyle='#bda079';ctx.fillRect(-14,-3,27,3);ellipse(ctx,-16,3,4,6,'#cfb48a');ctx.strokeStyle='#826a4b';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-9,5);ctx.lineTo(11,5);ctx.stroke();ctx.restore();
      }else if(o.item==='stone'||o.item==='copper'){
        ellipse(ctx,2,12,18,7,'#44534320');ctx.fillStyle=o.item==='stone'?'#76867a':'#7c8781';ctx.beginPath();ctx.moveTo(-20,10);ctx.lineTo(-16,-10);ctx.lineTo(-2,-18);ctx.lineTo(15,-10);ctx.lineTo(20,8);ctx.lineTo(5,16);ctx.closePath();ctx.fill();ctx.fillStyle='#a0ad96';ctx.beginPath();ctx.moveTo(-16,-10);ctx.lineTo(-2,-18);ctx.lineTo(6,-3);ctx.lineTo(-10,1);ctx.closePath();ctx.fill();if(o.item==='copper'){rounded(ctx,-7,-7,7,5,2,'#d69a70');rounded(ctx,6,3,9,4,1,'#c9835e');}
      }else if(o.item==='reed'){
        ellipse(ctx,0,14,17,7,'#71876060');for(let i=-2;i<=2;i++){ctx.strokeStyle=i%2?'#617a48':'#8a965a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(i*4,13);ctx.quadraticCurveTo(i*6-3,-2,i*6,-17+Math.abs(i)*3);ctx.stroke();rounded(ctx,i*6-2,-22+Math.abs(i)*3,4,9,2,'#a8935c');}
      }else if(o.item==='herb'){
        for(let i=0;i<6;i++){const a=i*Math.PI/3;ellipse(ctx,Math.cos(a)*9,Math.sin(a)*7,6,4,'#648c63');ellipse(ctx,Math.cos(a)*13,Math.sin(a)*10,2,2,'#f1d999');}
      }else if(o.item==='fish'){
        const pulse=reducedMotion?0:Math.sin(time*.002+o.x)*3;ctx.strokeStyle='#dcf0d680';ctx.lineWidth=1;for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(0,5,9+i*8+pulse,3+i*3,0,0,Math.PI*2);ctx.stroke();}ctx.fillStyle='#d9e9cf';ctx.beginPath();ctx.moveTo(-7,4);ctx.quadraticCurveTo(1,-2,7,4);ctx.quadraticCurveTo(1,10,-7,4);ctx.fill();
      }else if(o.item==='glass'){
        for(let i=0;i<4;i++){ctx.fillStyle=['#d8e5c2','#b5d3bb','#e5e9cd','#a9c9b6'][i];ctx.save();ctx.translate((i%2)*15-9,Math.floor(i/2)*12-7);ctx.rotate(i*.5);ctx.fillRect(-3,-4,7,10);ctx.restore();}
      }
    }else if(o.type==='bridge'){
      if(completed('bridge')){
        ctx.fillStyle='#806f50';ctx.fillRect(-25,-16,98,34);for(let i=0;i<8;i++){ctx.fillStyle=i%2?'#c1a77e':'#b69b71';ctx.fillRect(-22+i*12,-14,10,30);}ctx.strokeStyle='#6e6850';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-26,-18);ctx.lineTo(73,-18);ctx.moveTo(-26,19);ctx.lineTo(73,19);ctx.stroke();
      }else{ctx.fillStyle='#ac9069';ctx.save();ctx.rotate(.2);ctx.fillRect(-27,-12,21,8);ctx.fillRect(-28,2,29,9);ctx.restore();ctx.fillRect(55,-10,18,8);ctx.fillRect(58,3,18,8);ctx.strokeStyle='#7f795c';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-22,-20);ctx.lineTo(70,-20);ctx.stroke();}
    }else if(o.type==='bench'){
      ctx.fillStyle='#756c51';ctx.fillRect(-15,5,5,14);ctx.fillRect(10,5,5,14);rounded(ctx,-23,-7,46,18,3,'#b2926a');ctx.fillStyle='#d4b78b';ctx.fillRect(-21,-7,42,4);ctx.strokeStyle='#68716a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-8,-10);ctx.lineTo(5,3);ctx.stroke();ctx.fillStyle='#69786e';ctx.fillRect(-12,-13,12,6);
    }else if(o.type==='storage'){
      rounded(ctx,-18,-8,36,28,3,'#a98b60');rounded(ctx,-19,-12,38,13,4,'#bda273');ctx.fillStyle='#67786a';ctx.fillRect(-12,-12,4,31);ctx.fillRect(9,-12,4,31);rounded(ctx,-3,-1,6,7,1,'#e0cd96');
    }else if(o.type==='fire'){
      ellipse(ctx,0,12,19,8,'#87917b');rounded(ctx,-14,-3,28,20,5,'#5d7067');ctx.fillStyle='#dda46e';ctx.fillRect(-7,5,14,7);ctx.fillStyle='#f3cd90';ctx.fillRect(-3,3,6,7);ctx.strokeStyle='#bac5ad';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-17,-6);ctx.lineTo(17,-6);ctx.stroke();ellipse(ctx,0,-6,12,4,'#374e46');
    }else if(o.type==='person')drawPerson(0,0,time,false,'#b77d60');
    else if(o.type==='shop'){
      ctx.fillStyle='#977d59';ctx.fillRect(-19,-2,38,22);ctx.fillStyle='#ddcc98';ctx.fillRect(-22,-17,44,17);ctx.fillStyle='#719080';ctx.fillRect(-22,-17,9,17);ctx.fillRect(-5,-17,9,17);ctx.fillRect(13,-17,9,17);ellipse(ctx,-9,1,5,3,'#d2a26b');ellipse(ctx,8,1,5,3,'#9aaf74');
    }else if(o.type==='jetty'){
      const done=completed('jetty');ctx.fillStyle='#806e50';ctx.fillRect(-17,-10,34,85);for(let i=0;i<7;i++){if(!done&&[2,4].includes(i))continue;ctx.fillStyle=i%2?'#bca37a':'#ac946d';ctx.fillRect(-17,-10+i*12,34,10);}ctx.fillStyle='#6f7053';ctx.fillRect(-21,-8,5,13);ctx.fillRect(17,-8,5,13);if(done){ctx.fillStyle='#d9d4b3';ctx.beginPath();ctx.ellipse(38,56,10,25,.2,0,Math.PI*2);ctx.fill();ellipse(ctx,38,56,6,18,'#758f83');}
    }else if(o.type==='beacon'){
      ellipse(ctx,0,18,27,12,'#65785d40');ctx.fillStyle='#d9cfaf';ctx.beginPath();ctx.moveTo(-18,18);ctx.lineTo(-11,-43);ctx.lineTo(11,-43);ctx.lineTo(18,18);ctx.closePath();ctx.fill();ctx.fillStyle='#d1b28c';ctx.fillRect(-13,-13,26,9);ctx.fillStyle='#617e79';ctx.fillRect(-14,-54,28,15);ctx.fillStyle=completed('beacon')?'#ffdfa0':'#b1c3ae';ctx.fillRect(-9,-50,18,10);ctx.fillStyle='#b16e53';ctx.beginPath();ctx.moveTo(-19,-55);ctx.lineTo(0,-68);ctx.lineTo(19,-55);ctx.closePath();ctx.fill();ctx.fillStyle='#6d7d6a';ctx.fillRect(-4,5,8,13);
    }else if(o.type==='rest'){
      rounded(ctx,-16,0,32,14,4,'#b99c71');rounded(ctx,-18,-9,36,10,3,'#bda87e');ellipse(ctx,0,-10,9,3,'#719582');
    }
    ctx.restore();
    if(state.labels&&active)label(o.name,x,y-(o.type==='beacon'?78:37)*s);
    else if(state.labels&&['bench','storage','fire','person','shop'].includes(o.type)&&Math.hypot(px-o.x,py-o.y)<6)label(o.type==='person'?'Mara':o.type==='bench'?'Workbench':o.type==='fire'?'Camp stove':o.type==='storage'?'Supply chest':'Bay stores',x,y-36*s);
  }
  function drawPerson(x,y,time,isPlayer,color='#638c89'){
    const moving=isPlayer&&(path.length||keys.size||Math.hypot(stick.x,stick.y)>.1),bob=reducedMotion?0:moving?Math.sin(time*.015)*1.4:Math.sin(time*.002)*.4;
    ellipse(ctx,x+2,y+17,12,5,'#304b3d35');ctx.fillStyle='#3e5953';ctx.fillRect(x-7,y+6,5,13+(moving?Math.sin(time*.015)*2:0));ctx.fillRect(x+2,y+6,5,13-(moving?Math.sin(time*.015)*2:0));
    rounded(ctx,x-10,y-11+bob,20,24,6,isPlayer&&state.gear.coat?'#a28a61':color);
    rounded(ctx,x-13,y-7+bob,5,15,2,'#d6b497');rounded(ctx,x+8,y-7+bob,5,15,2,'#d6b497');
    if(isPlayer){rounded(ctx,x-11,y-3+bob,7,11,2,'#b1996d');ctx.strokeStyle='#b99c73';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+13,y+17);ctx.lineTo(x+16,y-6);ctx.stroke();if(state.gear.tool){ctx.fillStyle='#9cae9f';ctx.fillRect(x+13,y-6,10,6);}}
    ellipse(ctx,x,y-14+bob,8,9,'#dcbca0');ellipse(ctx,x,y-20+bob,10,4,isPlayer?'#ddba7c':'#b9c29f');rounded(ctx,x-7,y-25+bob,14,7,3,isPlayer?'#c99e62':'#8f9d76');
    ctx.fillStyle='#465b4d';ctx.fillRect(x+2,y-15+bob,1.5,1.5);ctx.fillRect(x-4,y-15+bob,1.5,1.5);
  }
  function drawBoar(b){
    const x=(b.x-view.camX+.5)*view.tile,y=(b.y-view.camY+.5)*view.tile,s=view.tile/48;ctx.save();ctx.translate(x,y);ctx.scale(s,s);
    ellipse(ctx,2,14,18,6,'#405b3c26');ctx.fillStyle='#6a6653';ctx.fillRect(-11,7,5,11);ctx.fillRect(7,7,5,11);ellipse(ctx,0,2,18,12,'#878271');ellipse(ctx,15,2,8,8,'#9d9682');ctx.fillStyle='#656653';ctx.fillRect(17,1,8,6);ctx.fillRect(10,-10,5,8);ctx.fillStyle='#e4d3b3';ctx.fillRect(16,8,3,5);ctx.fillStyle='#454f40';ctx.fillRect(15,-1,2,2);ctx.restore();
    if(Math.hypot(px-b.x,py-b.y)<4&&state.labels)label(b.calmUntil>simTime?'Keeping its distance':'Wild boar · Give it room',x,y-28,b.calmUntil>simTime?'#dbe5bd':'#f2c69c');
  }
  function render(time){
    if(!view.w||!view.h)return;camera();const t=view.tile;
    ctx.clearRect(0,0,view.w,view.h);
    ctx.drawImage(terrainCache,view.camX*48,view.camY*48,view.w/t*48,view.h/t*48,0,0,view.w,view.h);
    // Restrained water movement; shore colour and texture live in the static cache.
    for(let y=Math.max(0,Math.floor(view.camY));y<Math.min(H,Math.ceil(view.camY+view.h/t));y++)for(let x=Math.max(0,Math.floor(view.camX));x<Math.min(W,Math.ceil(view.camX+view.w/t));x++){
      if(['water','river'].includes(terrain[y][x])&&rand(x,y)>.43){const drift=reducedMotion?0:Math.sin(time*.0008+x+y)*4;ctx.strokeStyle='#d7ece21e';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo((x-view.camX)*t+10+drift,(y-view.camY)*t+16);ctx.quadraticCurveTo((x-view.camX)*t+18+drift,(y-view.camY)*t+18,(x-view.camX)*t+27+drift,(y-view.camY)*t+16);ctx.stroke();}
    }
    if(path.length){ctx.strokeStyle='#ffedbf60';ctx.lineWidth=2;ctx.setLineDash([2,9]);ctx.beginPath();ctx.moveTo((px+.5-view.camX)*t,(py+.5-view.camY)*t);for(const p of path)ctx.lineTo((p.x+.5-view.camX)*t,(p.y+.5-view.camY)*t);ctx.stroke();ctx.setLineDash([]);}
    const things=[...trees.map(o=>({y:o.y+.7,draw:()=>drawTree(o,time)})),...buildings.map(o=>({y:o.y+o.h-.2,draw:()=>drawBuilding(o)})),...objects.map(o=>({y:o.y+.5,draw:()=>drawObject(o,time)})),...boars.map(o=>({y:o.y+.5,draw:()=>drawBoar(o)})),{y:py+.5,draw:()=>{ctx.save();ctx.translate((px+.5-view.camX)*t,(py+.5-view.camY)*t);ctx.scale(t/48,t/48);drawPerson(0,0,time,true);ctx.restore();}}];
    things.sort((a,b)=>a.y-b.y);for(const o of things)if(o.y>view.camY-4&&o.y<view.camY+view.h/t+5)o.draw();
    if(marker){const x=(marker.x+.5-view.camX)*t,y=(marker.y+.5-view.camY)*t;ctx.globalAlpha=marker.time;ctx.strokeStyle='#fff3c1';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,14+(1-marker.time)*10,6+(1-marker.time)*5,0,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
    for(const p of particles){ctx.globalAlpha=p.life;ellipse(ctx,(p.x-view.camX)*t,(p.y-view.camY)*t,2.5,2.5,p.color);}ctx.globalAlpha=1;
    if(completed('beacon')){
      const bx=(49.5-view.camX)*t,by=(9.5-view.camY)*t-48;ctx.save();ctx.translate(bx,by);ctx.rotate(reducedMotion?-.5:time*.00015);const grad=ctx.createLinearGradient(0,0,420,0);grad.addColorStop(0,'#ffedb740');grad.addColorStop(1,'#ffedb700');ctx.fillStyle=grad;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(420,-65);ctx.lineTo(420,65);ctx.closePath();ctx.fill();ctx.restore();
    }
    const shade=ctx.createLinearGradient(0,0,0,view.h);shade.addColorStop(0,'#254b3320');shade.addColorStop(.3,'#254b3300');shade.addColorStop(1,'#254b331a');ctx.fillStyle=shade;ctx.fillRect(0,0,view.w,view.h);
  }
  function drawAtlas(){
    const atlas=$('atlas');if(!atlas)return;const c=atlas.getContext('2d'),tw=atlas.width/W,th=atlas.height/H;
    c.drawImage(terrainCache,0,0,atlas.width,atlas.height);
    for(const b of buildings){rounded(c,b.x*tw,b.y*th,b.w*tw,b.h*th,2,b.roof);}
    for(const tree of trees)ellipse(c,(tree.x+.5)*tw,(tree.y+.5)*th,3,3,'#4f785b');
    if(completed('bridge')){c.fillStyle='#b99d73';c.fillRect(37*tw,22*th,2*tw,th);}
    c.font='600 15px "Avenir Next",sans-serif';c.textAlign='center';
    for(const w of waypoints){ellipse(c,(w.x+.5)*tw,(w.y+.5)*th,5,5,'#f5ecd0');c.fillStyle='#fdf7e9';c.shadowColor='#38594c';c.shadowBlur=4;c.fillText(w.name,(w.x+.5)*tw,(w.y+.5)*th-13);c.shadowBlur=0;}
    ellipse(c,(px+.5)*tw,(py+.5)*th,9,9,'#fff8df');ellipse(c,(px+.5)*tw,(py+.5)*th,6,6,'#df7752');
  }
  function frame(time){const dt=Math.min(.05,(time-(lastTime||time))/1000);lastTime=time;if(!document.hidden){if(!panel)update(dt);render(simTime*1000);}requestAnimationFrame(frame);}
  resize();updateHUD();updateNearby();requestAnimationFrame(frame);
  if(!state.introSeen){notify('Welcome to Bracken Bay. Mara is just south of you. Tap her to say hello.',false);state.introSeen=true;save();}
})();
