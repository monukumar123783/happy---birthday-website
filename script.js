/* =====================================================
   ⚙️  EDIT CONFIG — change these to personalize the site
   ===================================================== */
const CONFIG = {
  herName: "Bestie",
  correctPin: "2006",
  birthDate: "2006-09-23",              // YYYY-MM-DD used for the age/day stats
  cakeCandles: 20,                       // number shown on the cake

  letterText: "I don't even know where to start, honestly. Out of everyone I've met, you're the one who just gets it — the 2am voice notes, the inside jokes nobody else understands, the plans we never actually follow through on but talk about anyway.\n\nYou've been there for the good days and the messy ones, and I don't think I say thank you enough for that. So today, on your day, I just want you to know how much you're appreciated.\n\nHappy Birthday, my favourite person to annoy. Here's to another year of chaos, laughter, and everything in between.",

  wishes: [
    "May this year bring you all the good vibes 🌈",
    "Endless laughing fits with me, always 😂",
    "Every dream on your list, ticked off ✅",
    "Non-stop food trips & road trips 🍕🚗",
    "Stay this wonderfully weird forever 🤪",
    "A friendship that never gets old 🤍"
  ],

  memories: [
    { img: "sh1.jpeg", caption: "That random Sunday hangout 🌇" },
    { img: "sh2.jpeg", caption: "Our go-to café corner ☕" },
    { img: "sh3.jpeg", caption: "The bonfire night we still talk about 🔥" },
    { img: "sh6.jpeg", caption: "Stargazing & overthinking life 🌌" }
  ],

  puzzleImage: "sh1.jpeg",

  scratchTitle: "Happy Birthday!",
  scratchSub: "Here's to another year of us being unstoppable 🥳"
};

/* ---------- helper: screen navigation ---------- */
function goTo(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
}

/* ---------- fireflies ---------- */
(function(){
  const field = document.getElementById('fireflies');
  for(let i=0;i<28;i++){
    const f = document.createElement('div');
    f.className='firefly';
    f.style.left = Math.random()*100+'%';
    f.style.top = Math.random()*100+'%';
    f.style.animationDuration = (3+Math.random()*4)+'s';
    f.style.opacity = 0.25+Math.random()*0.5;
    field.appendChild(f);
  }
})();

/* ---------- 1. clock + lock/pin ---------- */
function updateClock(){
  const d = new Date();
  const h = String(d.getHours()).padStart(2,'0');
  const m = String(d.getMinutes()).padStart(2,'0');
  document.getElementById('clockDisplay').textContent = h+':'+m;
}
updateClock(); setInterval(updateClock, 1000*10);
document.getElementById('pinHintText').textContent = CONFIG.correctPin;

let pinEntered = "";
const pinDots = document.querySelectorAll('#pinDots span');
function renderPin(){
  pinDots.forEach((dot,i)=> dot.classList.toggle('filled', i < pinEntered.length));
}
function buildKeypad(){
  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫'];
  const pad = document.getElementById('keypad');
  keys.forEach(k=>{
    const btn = document.createElement('div');
    if(k===''){ btn.style.visibility='hidden'; btn.className='key'; pad.appendChild(btn); return; }
    btn.className='key';
    btn.textContent=k;
    btn.addEventListener('click', ()=>handleKey(k));
    pad.appendChild(btn);
  });
}
function handleKey(k){
  if(k==='⌫'){ pinEntered = pinEntered.slice(0,-1); renderPin(); return; }
  if(pinEntered.length>=4) return;
  pinEntered += k;
  renderPin();
  if(pinEntered.length===4){
    setTimeout(()=>{
      if(pinEntered === CONFIG.correctPin){
        goTo('gift');
      } else {
        pinDots.forEach(d=>{ d.classList.add('shake'); setTimeout(()=>d.classList.remove('shake'),400); });
        pinEntered=""; renderPin();
      }
    }, 200);
  }
}
buildKeypad();

/* ---------- 2. gift box ---------- */
document.getElementById('giftBox').addEventListener('click', function(){
  this.classList.add('opened');
  this.textContent = '🎉' ;
  this.textContent = 'Love you  ' + CONFIG.herName + ' 💖';
  document.getElementById('bgm').play().catch(()=>{});
  setTimeout(()=>{ goTo('cake'); buildStats(); }, 550);
});

/* ---------- 3. cake / stats ---------- */
document.getElementById('cakeTitle').textContent = "Happy Birthday " + CONFIG.herName + " 🎂";
function buildStats(){
  const birth = new Date(CONFIG.birthDate);
  const now = new Date();
  const ms = now - birth;
  const days = Math.floor(ms/86400000);
  const hours = Math.floor(ms/3600000);
  const mins = Math.floor(ms/60000);
  const years = Math.floor(days/365.25);
  const grid = document.getElementById('statGrid');
  grid.innerHTML = '';
  const stats = [
    [years, "Years"], [days.toLocaleString(), "Days"],
    [hours.toLocaleString(), "Hours"], [mins.toLocaleString(), "Minutes"]
  ];
  stats.forEach(([v,l])=>{
    grid.innerHTML += `<div class="stat"><b>${v}</b><span>${l}</span></div>`;
  });
}
document.getElementById('cakeEmoji').addEventListener('click', function(){
  this.textContent = '🎂✨';
  this.classList.add('candle-out');
  document.getElementById('cakeHint').textContent = "Make a wish 💫";
  document.getElementById('toLetterBtn').style.display = 'inline-block';
  launchConfetti();
});
document.getElementById('toLetterBtn').addEventListener('click', ()=>goTo('letter'));

/* ---------- 4. letter ---------- */
document.getElementById('letterBody').textContent = "Dear " + CONFIG.herName + ",\n\n" + CONFIG.letterText;
document.getElementById('letterBody').style.whiteSpace = 'pre-line';
document.getElementById('envelope').addEventListener('click', function(){
  document.getElementById('letterCard').classList.add('show');
  document.getElementById('toBalloonsBtn').style.display = 'inline-block';
  this.style.display = 'none';
});
document.getElementById('toBalloonsBtn').addEventListener('click', ()=>goTo('balloons'));

/* ---------- 5. balloons ---------- */
let poppedCount = 0;
function buildBalloons(){
  const palette = ['#ff8fb1','#f0c46d','#7ec9e8','#c79cf0','#8fe0a3','#ff6f91'];
  const field = document.getElementById('balloonField');
  CONFIG.wishes.forEach((wish,i)=>{
    const color = palette[i % palette.length];
    const b = document.createElement('div');
    b.className='balloon';
    b.style.setProperty('--knot', color);
    b.innerHTML = `
      <div class="body" style="background:radial-gradient(circle at 32% 28%, ${lighten(color)}, ${color} 70%);"></div>
      <div class="string"></div>
      <div class="wish">${wish}</div>
    `;
    b.addEventListener('click', function(){
      if(this.classList.contains('popped')) return;
      this.classList.add('popped');
      poppedCount++;
      document.getElementById('balloonProgress').textContent = `Popped ${poppedCount}/${CONFIG.wishes.length}`;
      confettiBurst(this);
      if(poppedCount === CONFIG.wishes.length){
        document.getElementById('toMemoriesBtn').style.display='inline-block';
      }
    });
    field.appendChild(b);
  });
}
function lighten(hex){
  // quick helper to create a lighter highlight shade for the balloon gradient
  const c = hex.replace('#','');
  const r = Math.min(255, parseInt(c.substring(0,2),16) + 60);
  const g = Math.min(255, parseInt(c.substring(2,4),16) + 60);
  const bl = Math.min(255, parseInt(c.substring(4,6),16) + 60);
  return `rgb(${r},${g},${bl})`;
}
buildBalloons();
document.getElementById('toMemoriesBtn').addEventListener('click', ()=>goTo('memories'));

/* ---------- 6. memories carousel ---------- */
let memIndex = 0;
function renderMemory(){
  const m = CONFIG.memories[memIndex];
  const card = document.getElementById('memoryCard');
  card.style.backgroundImage = `url('${m.img}')`;
  document.getElementById('memoryCap').textContent = m.caption;
  const dotsWrap = document.getElementById('memoryDots');
  dotsWrap.innerHTML = CONFIG.memories.map((_,i)=>`<span class="${i===memIndex?'on':''}"></span>`).join('');
  document.getElementById('memNext').textContent = memIndex === CONFIG.memories.length-1 ? "Next Surprise ➜" : "Next ➜";
}
document.getElementById('memPrev').addEventListener('click', ()=>{
  memIndex = (memIndex - 1 + CONFIG.memories.length) % CONFIG.memories.length;
  renderMemory();
});
document.getElementById('memNext').addEventListener('click', ()=>{
  if(memIndex === CONFIG.memories.length-1){
    goTo('puzzle'); buildPuzzle();
  } else {
    memIndex++; renderMemory();
  }
});
renderMemory();

/* ---------- 7. sliding puzzle (3x3) ---------- */
let tiles = [], moveCount = 0;
function buildPuzzle(){
  moveCount = 0;
  document.getElementById('puzzleMoves').textContent = '0 Moves';
  tiles = [0,1,2,3,4,5,6,7,8]; // 8 = empty
  shuffleTiles();
  renderPuzzle();
}
function shuffleTiles(){
  // perform random valid moves so it's always solvable
  for(let i=0;i<120;i++){
    const empty = tiles.indexOf(8);
    const moves = validMoves(empty);
    const m = moves[Math.floor(Math.random()*moves.length)];
    [tiles[empty],tiles[m]] = [tiles[m],tiles[empty]];
  }
}
function validMoves(emptyIdx){
  const row = Math.floor(emptyIdx/3), col = emptyIdx%3;
  const moves = [];
  if(row>0) moves.push(emptyIdx-3);
  if(row<2) moves.push(emptyIdx+3);
  if(col>0) moves.push(emptyIdx-1);
  if(col<2) moves.push(emptyIdx+1);
  return moves;
}
function renderPuzzle(){
  const grid = document.getElementById('puzzleGrid');
  grid.innerHTML = '';
  tiles.forEach((val, idx)=>{
    const tile = document.createElement('div');
    if(val===8){
      tile.className='tile empty';
    } else {
      tile.className='tile';
      const r = Math.floor(val/3), c = val%3;
      tile.style.backgroundImage = `url('${CONFIG.puzzleImage}')`;
      tile.style.backgroundPosition = `-${c*72}px -${r*72}px`;
      tile.addEventListener('click', ()=>tryMove(idx));
    }
    grid.appendChild(tile);
  });
}
function tryMove(idx){
  const empty = tiles.indexOf(8);
  if(validMoves(empty).includes(idx)){
    [tiles[empty],tiles[idx]] = [tiles[idx],tiles[empty]];
    moveCount++;
    document.getElementById('puzzleMoves').textContent = moveCount+' Moves';
    renderPuzzle();
    checkSolved();
  }
}
function checkSolved(){
  const solved = tiles.every((v,i)=>v===i);
  if(solved){
    document.getElementById('toScratchBtn').style.display='inline-block';
    launchConfetti();
  }
}
document.getElementById('shuffleBtn').addEventListener('click', buildPuzzle);
document.getElementById('toScratchBtn').addEventListener('click', ()=>{ goTo('scratch'); setTimeout(initScratch,200); });

/* ---------- 8. scratch card ---------- */
document.getElementById('scratchMsg').innerHTML =
  `${CONFIG.scratchTitle}<br><span style="font-size:1rem;">${CONFIG.scratchSub}</span>`;

let scratchInit = false;
function initScratch(){
  if(scratchInit) return;
  scratchInit = true;
  const canvas = document.getElementById('scratchCanvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#caa14a';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  for(let i=0;i<400;i++){
    ctx.beginPath();
    ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height, Math.random()*1.4, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.fillStyle = '#3a2410';
  ctx.font = '600 16px Quicksand, sans-serif';
  ctx.textAlign='center';
  ctx.fillText('Scratch here ✨', canvas.width/2, canvas.height/2);

  let drawing = false;
  function scratch(x,y){
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x,y,18,0,Math.PI*2);
    ctx.fill();
  }
  function getPos(e){
    const rect = canvas.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return {x:cx,y:cy};
  }
  function checkClear(){
    const img = ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let cleared = 0;
    for(let i=3;i<img.length;i+=4*20){ if(img[i]===0) cleared++; }
    if(cleared / (img.length/4/20) > 0.55){
      canvas.style.transition='opacity .4s ease';
      canvas.style.opacity='0';
      launchConfetti();
    }
  }
  canvas.addEventListener('mousedown', e=>{drawing=true; const p=getPos(e); scratch(p.x,p.y);});
  canvas.addEventListener('mousemove', e=>{if(drawing){const p=getPos(e); scratch(p.x,p.y); checkClear();}});
  window.addEventListener('mouseup', ()=>drawing=false);
  canvas.addEventListener('touchstart', e=>{drawing=true; const p=getPos(e); scratch(p.x,p.y);});
  canvas.addEventListener('touchmove', e=>{e.preventDefault(); const p=getPos(e); scratch(p.x,p.y); checkClear();}, {passive:false});
  canvas.addEventListener('touchend', ()=>drawing=false);
}

/* ---------- confetti ---------- */
function launchConfetti(){
  const colors = ['#f0c46d','#ff8fb1','#ff5f8f','#e8b65a','#fbe9d0'];
  for(let i=0;i<40;i++){
    const c = document.createElement('div');
    c.className='confetti-piece';
    c.style.left = Math.random()*100+'vw';
    c.style.width = (5+Math.random()*5)+'px';
    c.style.height = (8+Math.random()*8)+'px';
    c.style.background = colors[Math.floor(Math.random()*colors.length)];
    c.style.transform = `rotate(${Math.random()*360}deg)`;
    document.body.appendChild(c);
    const duration = 2200 + Math.random()*1800;
    c.animate([
      { transform:`translateY(0) rotate(0deg)`, opacity:1 },
      { transform:`translateY(100vh) rotate(${360+Math.random()*360}deg)`, opacity:0.9 }
    ], { duration, easing:'ease-in' });
    setTimeout(()=>c.remove(), duration);
  }
}

/* small local burst right where a balloon popped */
function confettiBurst(el){
  const rect = el.getBoundingClientRect();
  const colors = ['#f0c46d','#ff8fb1','#ff5f8f','#e8b65a'];
  for(let i=0;i<14;i++){
    const c = document.createElement('div');
    c.className='confetti-piece';
    c.style.left = (rect.left + rect.width/2) + 'px';
    c.style.top = (rect.top + rect.height/2) + 'px';
    c.style.width='5px';c.style.height='8px';
    c.style.background = colors[Math.floor(Math.random()*colors.length)];
    document.body.appendChild(c);
    const angle = Math.random()*Math.PI*2;
    const dist = 40+Math.random()*50;
    const dx = Math.cos(angle)*dist, dy = Math.sin(angle)*dist;
    const duration = 600+Math.random()*400;
    c.animate([
      { transform:'translate(0,0) rotate(0deg)', opacity:1 },
      { transform:`translate(${dx}px,${dy}px) rotate(${Math.random()*360}deg)`, opacity:0 }
    ], { duration, easing:'ease-out' });
    setTimeout(()=>c.remove(), duration);
  }
}