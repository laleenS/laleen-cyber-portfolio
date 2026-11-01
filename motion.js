import { $, make } from './lib/dom.js';
export function initMotion() {
  const world = $('#garden-world');
  const art = $('.garden-art');
  const goldenArt = $('.golden-art');
  let palette;
  const readPalette = () => {
    const styles = getComputedStyle(document.documentElement);
    palette = {particle:styles.getPropertyValue('--particle-rgb').trim() || '231,219,164',packet:styles.getPropertyValue('--packet-color').trim() || '#e7dcb6',ripple:styles.getPropertyValue('--ripple-rgb').trim() || '180,211,201'};
  };
  readPalette();
  document.addEventListener('garden:themechange',readPalette);
  const overlay = $('.system-overlay');
  const firefly = $('.firefly');
  const canvas = make('canvas', null, 'garden-atmosphere');
  canvas.setAttribute('aria-hidden','true');world.append(canvas);
  const ctx = canvas.getContext('2d');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer: fine)');
  let paused = false, visible = false, frame = null, previous = null;
  let modalOpen = false;
  let width=1,height=1,dpr=1;
  const target={x:0,y:0},position={x:0,y:0};
  const pointer={x:-1000,y:-1000};
  const ripples=[];
  const particles = Array.from({length:24},(_,i)=>({x:.15+((i*37)%71)/100,y:.28+((i*23)%48)/100,phase:i*1.7,r:i%4===0?2:1,driftX:0,driftY:0}));
  const pause=$('#motion-toggle');
  const shouldRun=()=>ctx && visible && !paused && !motion.matches && !document.hidden && !modalOpen;
  const resize=()=>{
    const box=world.getBoundingClientRect();width=box.width;height=box.height;dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);
  };
  function resetLayers() {art.style.transform='';goldenArt.style.transform='';overlay.style.transform='';world.style.removeProperty('--pointer-x');world.style.removeProperty('--pointer-y');firefly.style.transform='';ctx?.clearRect(0,0,width,height);}
  function sync() {
    world.classList.toggle('motion-running',Boolean(shouldRun()));
    if(shouldRun() && frame===null){previous=null;frame=requestAnimationFrame(draw);}
    else if(!shouldRun()){if(frame!==null)cancelAnimationFrame(frame);frame=null;previous=null;resetLayers();}
    pause.textContent=motion.matches?'Reduced motion enabled':paused?'Resume motion':'Pause motion';
    pause.disabled=motion.matches;pause.setAttribute('aria-pressed',String(paused||motion.matches));
  }
  function draw(time) {
    frame=null;if(!shouldRun())return;
    const delta=Math.min((time-(previous??time))/1000,.05);previous=time;
    const ease=1-Math.exp(-delta*7);
    position.x+=(target.x-position.x)*ease;position.y+=(target.y-position.y)*ease;
    const depth=fine.matches?1:.2;
    art.style.transform=`translate3d(${position.x*13*depth}px,${position.y*10*depth}px,0) rotate(${position.x*.7*depth}deg)`;
    goldenArt.style.transform=art.style.transform;
    overlay.style.transform=`translate3d(${position.x*19*depth}px,${position.y*14*depth}px,0)`;
    world.style.setProperty('--pointer-x',`${position.x*25*depth}px`);world.style.setProperty('--pointer-y',`${position.y*17*depth}px`);
    firefly.style.transform=`translate(${position.x*65}px, ${position.y*50}px)`;
    ctx.clearRect(0,0,width,height);
    const count=fine.matches?particles.length:10;
    for(let i=0;i<count;i++){
      const particle=particles[i];
      const bx=particle.x*width+Math.sin(time*.0003+particle.phase)*12;
      const by=particle.y*height+Math.cos(time*.0004+particle.phase)*15;
      const dx=bx-pointer.x,dy=by-pointer.y,distance=Math.hypot(dx,dy);
      const influence=Math.max(0,1-distance/100);
      const repelX=distance>0?dx/distance*influence*32:0,repelY=distance>0?dy/distance*influence*32:0;
      particle.driftX+=(repelX-particle.driftX)*ease;particle.driftY+=(repelY-particle.driftY)*ease;
      const x=bx+particle.driftX+position.x*8,y=by+particle.driftY+position.y*8;
      ctx.fillStyle=`rgba(${palette.particle},${.45+.25*Math.sin(time*.001+particle.phase)})`;
      ctx.beginPath();ctx.arc(x,y,particle.r,0,Math.PI*2);ctx.fill();
      if(influence>.2 && fine.matches){ctx.strokeStyle=`rgba(170,202,185,${influence*.25})`;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(pointer.x,pointer.y);ctx.stroke();}
    }
    // A pair of packets follows the same curved path as the illustrated network.
    for(let i=0;i<2;i++){
      const t=((time*.000055+i*.5)%1),u=1-t;
      const x=(u*u*.2+2*u*t*.46+t*t*.81)*width;
      const y=(u*u*.69+2*u*t*.46+t*t*.68)*height;
      ctx.fillStyle=palette.packet;ctx.beginPath();ctx.arc(x,y,2.2,0,Math.PI*2);ctx.fill();
    }
    for(let i=ripples.length-1;i>=0;i--){const ripple=ripples[i];const age=(time-ripple.time)/1000;if(age>1.4){ripples.splice(i,1);continue;}ctx.strokeStyle=`rgba(${palette.ripple},${(1-age/1.4)*.5})`;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(ripple.x,ripple.y,4+age*38,2+age*14,0,0,Math.PI*2);ctx.stroke();}
    frame=requestAnimationFrame(draw);
  }
  pause.addEventListener('click',()=>{paused=!paused;sync();});
  world.addEventListener('pointermove',event=>{
    if(!fine.matches || motion.matches || paused)return;
    const box=world.getBoundingClientRect();pointer.x=event.clientX-box.left;pointer.y=event.clientY-box.top;
    target.x=(pointer.x/box.width-.5)*2;target.y=(pointer.y/box.height-.5)*2;
    const pondX=width*.62,pondY=height*.8;
    if(Math.hypot((pointer.x-pondX)/2,pointer.y-pondY)<width*.07 && (!ripples.length || performance.now()-ripples[ripples.length-1].time>160))ripples.push({x:pointer.x,y:pointer.y,time:performance.now()});
  });
  world.addEventListener('pointerleave',()=>{target.x=0;target.y=0;pointer.x=-1000;pointer.y=-1000;});
  world.addEventListener('pointerdown',event=>{if(event.target.closest('button,a')||!shouldRun())return;const box=world.getBoundingClientRect();ripples.push({x:event.clientX-box.left,y:event.clientY-box.top,time:performance.now()});if(ripples.length>12)ripples.shift();});
  new ResizeObserver(resize).observe(world);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.05}).observe(world);
  new MutationObserver(() => { modalOpen = Boolean(document.querySelector('dialog[open]')); sync(); }).observe(document.body, {subtree:true,attributes:true,attributeFilter:['open']});
  motion.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
  resize();sync();
  // Material tilt is small, pointer-only, and never moves the underlying hit target.
  for(const card of document.querySelectorAll('.cabinet-object')){
    card.addEventListener('pointermove',event=>{if(motion.matches||paused||!fine.matches)return;const rect=card.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width-.5,y=(event.clientY-rect.top)/rect.height-.5;card.style.setProperty('--tilt-x',`${-y*5}deg`);card.style.setProperty('--tilt-y',`${x*5}deg`);});
    card.addEventListener('pointerleave',()=>{card.style.removeProperty('--tilt-x');card.style.removeProperty('--tilt-y');});
  }
}
