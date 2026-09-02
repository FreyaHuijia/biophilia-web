/* Landing page, painting labels, and tour navigation. */
/* ---------- didactic panel ---------- */
const panel=document.getElementById('panel');
const overviewText=`This series is my artistic meditation on our connection to the natural world.

Human presence emerges from stone, water, and mountain, not as intrusion, but as belonging.

Biophilia is a call to return.
To see nature not as background, but as guide.
To understand that in observing the earth, we are also observing ourselves.

Nature becomes teacher, mirror, and memory, reminding us that separation has always been an illusion.`;
function openOverviewPanel(){
  document.getElementById('pEyebrow').textContent='Artist statement';
  document.getElementById('pTitle').textContent='BIOPHILIA';
  document.getElementById('pDims').textContent='';
  document.getElementById('pQuote').textContent=overviewText;
  document.getElementById('pCtx').textContent='— Belinda Person (BelaB)';
  document.getElementById('pVr').hidden=true;
  document.getElementById('pVrVideo').pause();
  panel.classList.add('open');
}
function openPanel(i){
  const p=PAINTINGS[i];
  document.getElementById('pEyebrow').textContent='Biophilia · Painting '+(i+1)+' of '+PAINTINGS.length;
  document.getElementById('pTitle').textContent=p.title;
  document.getElementById('pDims').textContent=p.dims;
  document.getElementById('pQuote').textContent=p.quote;
  document.getElementById('pCtx').textContent=p.artist;
  const vrWrap=document.getElementById('pVr'),vrVid=document.getElementById('pVrVideo');
  if(p.vr){
    if(vrVid.getAttribute('src')!==p.vr){vrVid.src=p.vr;vrVid.poster=p.vrPoster||p.src;}
    vrWrap.hidden=false;
    vrVid.currentTime=0;vrVid.play().catch(()=>{});
  }else{
    vrWrap.hidden=true;vrVid.pause();
  }
  panel.classList.add('open');
}
function closePanel(){panel.classList.remove('open');document.getElementById('pVrVideo').pause();}
document.getElementById('panelClose').addEventListener('click',closePanel);

/* ---------- VR video fullscreen ---------- */
const vrPlayer=document.getElementById('pVrPlayer');
const vrVideo=document.getElementById('pVrVideo');
function openVrFullscreen(){
  if(vrPlayer.requestFullscreen) vrPlayer.requestFullscreen();
  else if(vrVideo.webkitEnterFullscreen) vrVideo.webkitEnterFullscreen();
}
vrVideo.addEventListener('click',openVrFullscreen);
document.getElementById('pVrOpen').addEventListener('click',openVrFullscreen);
vrVideo.addEventListener('keydown',e=>{
  if(e.key==='Enter'||e.key===' '){e.preventDefault();openVrFullscreen();}
});
document.getElementById('pVrExit').addEventListener('click',()=>document.exitFullscreen());

/* ---------- landing / tour switching ---------- */
const landing=document.getElementById('landing');
const tourUI=document.getElementById('tourUI');
let tourActive=false;
function enterTour(jump){
  landing.classList.add('hidden');
  tourUI.classList.add('active');
  tourUI.setAttribute('aria-hidden','false');
  tourActive=true;
  if(jump!==undefined) setTimeout(()=>goToStop(jump),700);
  else if(matchMedia('(min-width: 641px)').matches) openOverviewPanel();
}
document.getElementById('enterBtn').addEventListener('click',()=>enterTour());
document.querySelectorAll('.work').forEach(b=>
  b.addEventListener('click',()=>enterTour(parseInt(b.dataset.jump))));
function exitTour(){
  tourActive=false;
  landing.classList.remove('hidden');
  tourUI.classList.remove('active');
  tourUI.setAttribute('aria-hidden','true');
  goToStop('overview');
  closePanel();
}
document.getElementById('exitBtn').addEventListener('click',exitTour);
document.getElementById('homeBtn').addEventListener('click',exitTour);
document.querySelectorAll('#nav button').forEach(b=>
  b.addEventListener('click',()=>{
    const s=b.dataset.stop;
    goToStop(s==='overview'?'overview':parseInt(s));
  }));

/* ---------- landing VR video fullscreen ---------- */
const vrBtn=document.getElementById('vrBtn');
const landingVrVideo=document.getElementById('landingVrVideo');
const landingVrPlayer=document.getElementById('landingVrPlayer');
function openLandingVrFullscreen(){
  if(landingVrPlayer.requestFullscreen) landingVrPlayer.requestFullscreen();
  else if(landingVrVideo.webkitEnterFullscreen) landingVrVideo.webkitEnterFullscreen();
}
vrBtn.addEventListener('click',openLandingVrFullscreen);
landingVrVideo.addEventListener('click',openLandingVrFullscreen);
document.getElementById('landingVrExit').addEventListener('click',()=>document.exitFullscreen());
