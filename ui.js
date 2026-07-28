/* Landing page, painting labels, and tour navigation. */
/* ---------- didactic panel ---------- */
const panel=document.getElementById('panel');
function openPanel(i){
  const p=PAINTINGS[i];
  document.getElementById('pEyebrow').textContent='Biophilia · Painting '+(i+1)+' of 3';
  document.getElementById('pTitle').textContent=p.title;
  document.getElementById('pDims').textContent=p.dims;
  document.getElementById('pQuote').textContent=p.quote;
  document.getElementById('pCtx').textContent=p.ctx;
  panel.classList.add('open');
}
function closePanel(){panel.classList.remove('open');}
document.getElementById('panelClose').addEventListener('click',closePanel);

/* ---------- landing / tour switching ---------- */
const landing=document.getElementById('landing');
const tourUI=document.getElementById('tourUI');
let tourActive=false;
function enterTour(jump){
  landing.classList.add('hidden');
  tourUI.classList.add('active');
  tourUI.setAttribute('aria-hidden','false');
  tourActive=true;
  setTimeout(()=>document.getElementById('hint').classList.add('fade'),7000);
  if(jump!==undefined) setTimeout(()=>goToStop(jump),700);
}
document.getElementById('enterBtn').addEventListener('click',()=>enterTour());
document.querySelectorAll('.work').forEach(b=>
  b.addEventListener('click',()=>enterTour(parseInt(b.dataset.jump))));
document.getElementById('exitBtn').addEventListener('click',()=>{
  tourActive=false;
  landing.classList.remove('hidden');
  tourUI.classList.remove('active');
  tourUI.setAttribute('aria-hidden','true');
  closePanel();
  goToStop('overview');
});
document.querySelectorAll('#nav button').forEach(b=>
  b.addEventListener('click',()=>{
    const s=b.dataset.stop;
    goToStop(s==='overview'?'overview':parseInt(s));
  }));
