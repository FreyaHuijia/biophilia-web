/* BIOPHILIA 3D gallery: scene, camera, controls, and render loop. */
/* ---------- renderer & scene ---------- */
const container = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1410);
scene.fog = new THREE.FogExp2(0x0c1611, 0.052);

const camera = new THREE.PerspectiveCamera(58, innerWidth/innerHeight, 0.1, 200);
camera.position.set(0,1.6,0.001);

/* ---------- lights ---------- */
const hemi = new THREE.HemisphereLight(0x9db89a, 0x101a12, 0.55);
scene.add(hemi);
const amb = new THREE.AmbientLight(0x1c2a20, 0.8);
scene.add(amb);

/* ---------- ground: dark mossy clearing ---------- */
function groundTexture(){
  const c=document.createElement('canvas');c.width=c.height=512;
  const g=c.getContext('2d');
  const rg=g.createRadialGradient(256,256,40,256,256,256);
  rg.addColorStop(0,'#1a2a1e');rg.addColorStop(.6,'#13201a');rg.addColorStop(1,'#0b1410');
  g.fillStyle=rg;g.fillRect(0,0,512,512);
  for(let i=0;i<2600;i++){
    g.fillStyle=`rgba(${90+Math.random()*60|0},${120+Math.random()*70|0},${70+Math.random()*40|0},${Math.random()*.05})`;
    g.fillRect(Math.random()*512,Math.random()*512,2,2);
  }
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;
}
const ground = new THREE.Mesh(
  new THREE.CircleGeometry(60,48),
  new THREE.MeshStandardMaterial({map:groundTexture(),roughness:.95,metalness:0})
);
ground.rotation.x=-Math.PI/2; scene.add(ground);

/* ---------- forest: slender trunks fading into fog ---------- */
const trunkMat = new THREE.MeshStandardMaterial({color:0x4a3f4e,roughness:.9});
const trunkGeo = new THREE.CylinderGeometry(.10,.16,16,7);
for(let i=0;i<90;i++){
  const a=Math.random()*Math.PI*2;
  const r=15+Math.random()*32;
  const m=new THREE.Mesh(trunkGeo,trunkMat);
  m.position.set(Math.cos(a)*r,7.5,Math.sin(a)*r);
  m.rotation.y=Math.random()*Math.PI;
  m.rotation.z=(Math.random()-.5)*.07;
  const s=.6+Math.random()*1.4; m.scale.set(s,1,s);
  scene.add(m);
}

/* ---------- floating motes ---------- */
function moteTexture(){
  const c=document.createElement('canvas');c.width=c.height=32;
  const g=c.getContext('2d');
  const rg=g.createRadialGradient(16,16,0,16,16,16);
  rg.addColorStop(0,'rgba(220,235,210,.9)');rg.addColorStop(1,'rgba(220,235,210,0)');
  g.fillStyle=rg;g.fillRect(0,0,32,32);
  return new THREE.CanvasTexture(c);
}
const moteCount=320, motePos=new Float32Array(moteCount*3), moteSeed=new Float32Array(moteCount);
for(let i=0;i<moteCount;i++){
  motePos[i*3]=(Math.random()-.5)*36;
  motePos[i*3+1]=Math.random()*7+.2;
  motePos[i*3+2]=(Math.random()-.5)*36;
  moteSeed[i]=Math.random()*Math.PI*2;
}
const moteGeo=new THREE.BufferGeometry();
moteGeo.setAttribute('position',new THREE.BufferAttribute(motePos,3));
const motes=new THREE.Points(moteGeo,new THREE.PointsMaterial({
  map:moteTexture(),size:.09,transparent:true,opacity:.5,depthWrite:false,
  blending:THREE.AdditiveBlending,color:0xd8e8cc
}));
scene.add(motes);

/* ---------- light shafts ---------- */
const shaftMat=new THREE.MeshBasicMaterial({color:0xbcd9a8,transparent:true,opacity:.045,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide});
const shafts=[];
for(let i=0;i<10;i++){
  const a=Math.random()*Math.PI*2, r=4+Math.random()*16;
  const s=new THREE.Mesh(new THREE.PlaneGeometry(.8+Math.random()*1.6,18),shaftMat.clone());
  s.position.set(Math.cos(a)*r,8,Math.sin(a)*r);
  s.rotation.y=Math.random()*Math.PI;
  s.rotation.z=(Math.random()-.5)*.25;
  s.material.opacity=.025+Math.random()*.05;
  scene.add(s); shafts.push(s);
}

/* ---------- placeholder texture for WITHIN ---------- */
function withinPlaceholder(){
  const c=document.createElement('canvas');c.width=800;c.height=600;
  const g=c.getContext('2d');
  const lin=g.createLinearGradient(0,0,800,600);
  lin.addColorStop(0,'#2a4030');lin.addColorStop(.5,'#3c5a40');lin.addColorStop(1,'#22382c');
  g.fillStyle=lin;g.fillRect(0,0,800,600);
  // painterly strokes
  for(let i=0;i<900;i++){
    const x=Math.random()*800,y=Math.random()*600;
    const hue=Math.random();
    g.strokeStyle=hue<.7
      ? `rgba(${70+Math.random()*80|0},${110+Math.random()*90|0},${60+Math.random()*50|0},${.05+Math.random()*.12})`
      : `rgba(${150+Math.random()*40|0},${130+Math.random()*40|0},${150+Math.random()*40|0},${.04+Math.random()*.08})`;
    g.lineWidth=2+Math.random()*9; g.lineCap='round';
    g.beginPath();g.moveTo(x,y);
    g.quadraticCurveTo(x+(Math.random()-.5)*70,y+(Math.random()-.5)*50,x+(Math.random()-.5)*120,y+(Math.random()-.5)*80);
    g.stroke();
  }
  // soft inner glow center — a clearing
  const rg=g.createRadialGradient(400,280,30,400,280,330);
  rg.addColorStop(0,'rgba(200,225,180,.22)');rg.addColorStop(1,'rgba(200,225,180,0)');
  g.fillStyle=rg;g.fillRect(0,0,800,600);
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;
}

/* ---------- paintings ---------- */
const loader=new THREE.TextureLoader();
const clickables=[]; const stops=[];
const GALLERY_R=8.5;
const angles=PAINTINGS.map((_,i)=>Math.PI/2+i*2*Math.PI/PAINTINGS.length);

PAINTINGS.forEach((p,i)=>{
  const a=angles[i];
  const px=Math.cos(a)*GALLERY_R, pz=Math.sin(a)*GALLERY_R;
  const group=new THREE.Group();
  group.position.set(px,0,pz);
  group.lookAt(0,0,0);

  // frame
  const frameDepth=.07, border=.07;
  const frame=new THREE.Mesh(
    new THREE.BoxGeometry(p.w+border*2,p.h+border*2,frameDepth),
    new THREE.MeshStandardMaterial({color:0x241d26,roughness:.6})
  );
  frame.position.set(0,1.75,0); group.add(frame);

  // canvas
  let tex;
  if(p.src){ tex=loader.load(p.src); tex.encoding=THREE.sRGBEncoding; }
  else tex=withinPlaceholder();
  const canvasMesh=new THREE.Mesh(
    new THREE.PlaneGeometry(p.w,p.h),
    new THREE.MeshStandardMaterial({map:tex,roughness:.85})
  );
  canvasMesh.position.set(0,1.75,frameDepth/2+.005);
  canvasMesh.userData.index=i;
  group.add(canvasMesh); clickables.push(canvasMesh);

  // label plinth
  const lc=document.createElement('canvas');lc.width=256;lc.height=96;
  const lg=lc.getContext('2d');
  lg.fillStyle='#0e1813';lg.fillRect(0,0,256,96);
  lg.strokeStyle='rgba(199,212,201,.35)';lg.strokeRect(4,4,248,88);
  lg.fillStyle='#e9efe7';lg.font='300 30px Georgia';lg.textAlign='center';
  lg.fillText(p.title,128,42);
  lg.fillStyle='rgba(199,212,201,.6)';lg.font='14px sans-serif';
  lg.fillText(p.dims.replace('Oil on canvas · ',''),128,70);
  const lt=new THREE.CanvasTexture(lc);lt.encoding=THREE.sRGBEncoding;
  const label=new THREE.Mesh(new THREE.PlaneGeometry(.6,.225),
    new THREE.MeshBasicMaterial({map:lt}));
  label.position.set(p.w/2+border+.42,1.25,.02);
  label.userData.index=i;
  group.add(label); clickables.push(label);

  // spotlight
  const spot=new THREE.SpotLight(0xfff4dd,1.15,22,.5,.55,1.2);
  spot.position.set(px*0.62, 6.2, pz*0.62);
  spot.target=frame; scene.add(spot);

  scene.add(group);

  // viewing stop: stand back from painting along its normal toward center
  const dist=Math.max(p.h,p.w)*1.55+.8;
  const nx=-Math.cos(a), nz=-Math.sin(a); // toward center
  stops.push({
    pos:new THREE.Vector3(px+nx*dist,1.6,pz+nz*dist),
    look:new THREE.Vector3(px,1.7,pz)
  });
});

const OVERVIEW={pos:new THREE.Vector3(0,1.6,0.001),look:stops[0].look.clone()};

/* ---------- camera controls ---------- */
let yaw=0,pitch=0;
function setYawPitchFromLook(pos,look){
  const d=new THREE.Vector3().subVectors(look,pos).normalize();
  yaw=Math.atan2(d.x,d.z)+Math.PI; /* not used directly; recompute below */
}
/* simpler: keep yaw/pitch and apply */
function applyLook(){
  const dir=new THREE.Vector3(
    Math.sin(yaw)*Math.cos(pitch), Math.sin(pitch), Math.cos(yaw)*Math.cos(pitch));
  camera.lookAt(camera.position.clone().add(dir));
}
function lookToward(target){
  const d=new THREE.Vector3().subVectors(target,camera.position).normalize();
  pitch=Math.asin(THREE.MathUtils.clamp(d.y,-1,1));
  yaw=Math.atan2(d.x,d.z);
}
lookToward(stops[0].look);

let dragging=false,lastX=0,lastY=0,moved=0,overviewAutoRotate=true;
const cv=renderer.domElement;
cv.addEventListener('pointerdown',e=>{
  dragging=true;overviewAutoRotate=false;moved=0;lastX=e.clientX;lastY=e.clientY;
});
addEventListener('pointermove',e=>{
  if(!dragging)return;
  const dx=e.clientX-lastX, dy=e.clientY-lastY;
  moved+=Math.abs(dx)+Math.abs(dy);
  if(moved>3) closePanel();
  lastX=e.clientX;lastY=e.clientY;
  yaw-=dx*0.0042; pitch-=dy*0.0032;
  pitch=THREE.MathUtils.clamp(pitch,-1.1,1.1);
});
addEventListener('pointerup',()=>dragging=false);

const keys={};
addEventListener('keydown',e=>{
  keys[e.code]=true;
  if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)){
    overviewAutoRotate=false;
    closePanel();
  }
});
addEventListener('keyup',e=>{keys[e.code]=false;});

/* click to select painting */
const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2();
cv.addEventListener('click',e=>{
  if(!tourActive||moved>6)return;
  pointer.x=(e.clientX/innerWidth)*2-1;
  pointer.y=-(e.clientY/innerHeight)*2+1;
  raycaster.setFromCamera(pointer,camera);
  const hit=raycaster.intersectObjects(clickables)[0];
  if(hit) goToStop(hit.object.userData.index);
});

/* tween */
let tween=null;
function goTo(pos,look,dur=2200,onDone){
  tween={t:0,dur,fromP:camera.position.clone(),toP:pos.clone(),
    fromYaw:yaw,fromPitch:pitch,look:look.clone(),onDone};
}
function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}

let currentStop='overview';
function goToStop(i){
  currentStop=i;
  if(i==='overview') overviewAutoRotate=true;
  const s= i==='overview'?OVERVIEW:stops[i];
  goTo(s.pos,s.look,2200, i==='overview'?null:()=>openPanel(i));
  document.querySelectorAll('#nav button').forEach(b=>
    b.classList.toggle('cur',String(b.dataset.stop)===String(i)));
  if(i==='overview') openOverviewPanel();
}

/* ---------- resize ---------- */
addEventListener('resize',()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});

/* ---------- main loop ---------- */
const clock=new THREE.Clock();
let idleYaw=0;
function animate(){
  requestAnimationFrame(animate);
  const dt=Math.min(clock.getDelta(),.05);
  const t=clock.elapsedTime;

  // breathing light
  hemi.intensity=.55+Math.sin(t*.25)*.08;
  shafts.forEach((s,i)=>{ s.material.opacity=(.03+.025*Math.sin(t*.18+i))*1; });

  // motes drift
  const pos=moteGeo.attributes.position;
  for(let i=0;i<moteCount;i++){
    pos.array[i*3+1]+=Math.sin(t*.4+moteSeed[i])*.0009;
    pos.array[i*3]+=Math.cos(t*.22+moteSeed[i])*.0012;
  }
  pos.needsUpdate=true;

  // tween camera
  if(tween){
    tween.t+=dt*1000;
    const k=ease(Math.min(tween.t/tween.dur,1));
    camera.position.lerpVectors(tween.fromP,tween.toP,k);
    // blend look direction toward target
    const desired=new THREE.Vector3().subVectors(tween.look,camera.position).normalize();
    const dPitch=Math.asin(THREE.MathUtils.clamp(desired.y,-1,1));
    const dYaw=Math.atan2(desired.x,desired.z);
    let dy=dYaw-yaw; while(dy>Math.PI)dy-=2*Math.PI; while(dy<-Math.PI)dy+=2*Math.PI;
    yaw+=dy*Math.min(1,dt*3.2);
    pitch+=(dPitch-pitch)*Math.min(1,dt*3.2);
    if(tween.t>=tween.dur){const cb=tween.onDone;tween=null;if(cb)cb();}
  }else if(tourActive){
    if(currentStop==='overview'&&overviewAutoRotate) yaw+=dt*.07;
    // WASD walk
    const sp=3.2*dt;
    const fwd=new THREE.Vector3(Math.sin(yaw),0,Math.cos(yaw));
    const right=new THREE.Vector3(fwd.z,0,-fwd.x);
    if(keys['KeyW']||keys['ArrowUp'])camera.position.addScaledVector(fwd,sp);
    if(keys['KeyS']||keys['ArrowDown'])camera.position.addScaledVector(fwd,-sp);
    if(keys['KeyA']||keys['ArrowLeft'])camera.position.addScaledVector(right,sp);
    if(keys['KeyD']||keys['ArrowRight'])camera.position.addScaledVector(right,-sp);
    const r=Math.hypot(camera.position.x,camera.position.z);
    const maxR=GALLERY_R+2;
    if(r>maxR){camera.position.x*=maxR/r;camera.position.z*=maxR/r;}
    camera.position.y=1.6;
  }else{
    // landing: slow ambient orbit
    idleYaw+=dt*.045;
    camera.position.set(Math.sin(idleYaw)*1.2,1.7,Math.cos(idleYaw)*1.2);
    yaw=idleYaw+Math.PI; pitch=.06;
  }
  applyLook();
  renderer.render(scene,camera);
}
animate();
