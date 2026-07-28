/* Generated ambient soundscape; no audio assets required. */
/* ---------- ambient sound (generated, no assets) ---------- */
let audioCtx=null,soundOn=false,masterGain=null;
function buildAudio(){
  audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  masterGain=audioCtx.createGain(); masterGain.gain.value=0;
  masterGain.connect(audioCtx.destination);
  // wind: filtered noise
  const len=audioCtx.sampleRate*4;
  const buf=audioCtx.createBuffer(1,len,audioCtx.sampleRate);
  const d=buf.getChannelData(0);
  let last=0;
  for(let i=0;i<len;i++){ last=last*.97+(Math.random()*2-1)*.03; d[i]=last*3; }
  const noise=audioCtx.createBufferSource(); noise.buffer=buf; noise.loop=true;
  const lp=audioCtx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=380; lp.Q.value=.6;
  const lfo=audioCtx.createOscillator(); lfo.frequency.value=.06;
  const lfoGain=audioCtx.createGain(); lfoGain.gain.value=190;
  lfo.connect(lfoGain); lfoGain.connect(lp.frequency);
  const ng=audioCtx.createGain(); ng.gain.value=.5;
  noise.connect(lp); lp.connect(ng); ng.connect(masterGain);
  // low drone
  const o1=audioCtx.createOscillator(); o1.type='sine'; o1.frequency.value=62;
  const o2=audioCtx.createOscillator(); o2.type='sine'; o2.frequency.value=62.7;
  const og=audioCtx.createGain(); og.gain.value=.05;
  o1.connect(og); o2.connect(og); og.connect(masterGain);
  noise.start(); lfo.start(); o1.start(); o2.start();
}
const soundBtn=document.getElementById('soundBtn');
soundBtn.addEventListener('click',()=>{
  if(!audioCtx) buildAudio();
  if(audioCtx.state==='suspended') audioCtx.resume();
  soundOn=!soundOn;
  masterGain.gain.linearRampToValueAtTime(soundOn?.55:0,audioCtx.currentTime+1.2);
  soundBtn.setAttribute('aria-pressed',soundOn);
});
