import { $, make, action } from './lib/dom.js';
import { projects, profile } from './content.js';
import { playSound } from './sound.js';

let station;
let opener;
let navigating = false;
let activeApp = 'files';
let maximized = false;
let drag;
let wallpaperPaused = false;
let pointerFrame = null;
const apps = [
  {id:'files',name:'Field files',icon:'◇'},
  {id:'about',name:'About Laleen',icon:'✳︎'},
  {id:'console',name:'Console',icon:'>_'},
  {id:'contact',name:'Contact',icon:'@'},
];
function navigateTo(target, caseSlug) {
  navigating = true;
  station.close();
  requestAnimationFrame(() => {
    if (caseSlug) $(`#${caseSlug} button`).click();
    else {
      const section = $(target);
      section.tabIndex = -1;
      section.scrollIntoView({behavior:'instant'});
      section.focus({preventScroll:true});
    }
    navigating = false;
  });
}
function renderApp(id) {
  activeApp = id;
  const app = apps.find(item=>item.id===id);
  const container = $('#station-window-content');
  container.replaceChildren();
  $('#station-window-name').textContent = app.name;
  $('#station-task-label').textContent = app.name;
  $('.station-window').hidden = false;
  document.querySelectorAll('[data-station-app]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.stationApp===id)));
  if (id==='files') {
    container.append(make('p','/garden/fieldwork/','station-path'),make('h3','Things I’m working on.'),make('p','Three student labs, each asking a different security question. Open a file to see its scope, what is planned, and what evidence is still to come.'));
    const list=make('div',null,'station-files');
    for (const project of projects) {
      const button=action('',()=>navigateTo(null,project.slug),'station-file');
      button.append(make('span',project.symbol,'station-file-icon'),make('strong',project.title),make('small','CASE '+project.number+' / IN PROGRESS'),make('span',project.summary));
      list.append(button);
    }
    container.append(list,make('p','The garden’s synthetic teaching demos are separate from these lab projects.','tiny'));
  }
  if (id==='about') {
    container.append(make('p','/garden/about.txt','station-path'),make('h3','Hi, I’m Laleen.'),make('p',profile.introduction),make('p',profile.direction));
    const ledger=make('dl',null,'station-ledger');
    for (const [key,value] of [['Studying',profile.degrees.map(degree=>degree.title+' / '+degree.concentration).join(' + ')],['Looking toward','Early-career cybersecurity, with an interest in policy and building technical skills'],['Project status','Student labs in progress; findings await reviewed evidence']]) ledger.append(make('dt',key),make('dd',value));
    container.append(ledger,action('Read the full introduction →',()=>navigateTo('#about')));
  }
  if (id==='contact') {
    container.append(make('p','/garden/contact/','station-path'),make('h3','You found me.'),make('p','Here’s the direct path. No puzzles, no hidden buttons.'));
    const github=make('a','Visit GitHub / laleenS →','outline-button');github.href='https://github.com/laleenS';github.target='_blank';github.rel='noopener noreferrer';
    container.append(github,make('p','I’ll add my email, LinkedIn, and résumé here when they’re ready. For now, you can find me on GitHub.'),action('Open the contact area →',()=>navigateTo('#contact'),'text-button'));
  }
  if (id==='console') {
    container.append(make('p','/garden/console · SIMULATED','station-path'),make('h3','A little window into the garden.'),make('p','Try help. This console only recognizes portfolio commands; it has no connection to a shell.'));
    const output=make('div',null,'station-console-log');output.id='station-console-log';output.setAttribute('role','log');output.setAttribute('aria-live','polite');output.setAttribute('aria-label','Field station console output');
    output.append(make('p','guest@root / welcome. Type help to look around.'));
    const form=make('form',null,'station-console-form');
    const label=make('label','guest $');label.htmlFor='station-command';
    const input=make('input');input.id='station-command';input.maxLength=80;input.autocomplete='off';input.spellcheck=false;input.setAttribute('aria-label','Field station command');
    const submit=make('button','Run');submit.type='submit';
    form.append(label,input,submit);
    form.addEventListener('submit',event=>{
      event.preventDefault();const command=input.value.trim().toLowerCase();input.value='';if(!command)return;
      if(command==='clear'){output.replaceChildren();return;}
      output.append(make('p','guest $ '+command));
      const replies={help:'help · ls · whoami · about · projects · contact · open soc · open iam · open baseline · clear',ls:'about.txt  fieldwork/  contact/  console/',whoami:'guest — welcome to Laleen’s field station.',about:'Laleen Salim / UNC Charlotte / B.S. Computer Science + B.A. Political Science / expected December 2026.',projects:'SOC Investigation Lab · IAM Access Review · Security Baseline Checker. Student projects in progress.',contact:'Confirmed GitHub: github.com/laleenS. Other contact details are awaiting confirmation.'};
      if(['open soc','open iam','open baseline'].includes(command)){navigateTo(null,command.split(' ')[1]);return;}
      output.append(make('p',Object.hasOwn(replies,command)?replies[command]:'Unknown command. Try help; no arbitrary commands are run.'));
      while(output.children.length>30)output.firstElementChild.remove();output.scrollTop=output.scrollHeight;playSound('key');
    });
    container.append(output,form);
  }
  playSound('glass');
}
function createGalaxy() {
  const ns='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 1200 800');svg.setAttribute('aria-hidden','true');svg.classList.add('station-galaxy');
  const spiral=document.createElementNS(ns,'g');spiral.classList.add('galaxy-spiral');
  for(let i=0;i<160;i++){
    const arm=i%2,progress=i/160,angle=progress*Math.PI*5+arm*Math.PI,radius=25+progress*390;
    const circle=document.createElementNS(ns,'circle');circle.setAttribute('cx',String(600+Math.cos(angle)*radius));circle.setAttribute('cy',String(400+Math.sin(angle)*radius*.62));circle.setAttribute('r',i%11===0?'2.7':'1.2');circle.setAttribute('opacity',String(.2+(i%7)/12));spiral.append(circle);
  }
  for(let i=0;i<3;i++){
    const ellipse=document.createElementNS(ns,'ellipse');ellipse.setAttribute('cx','600');ellipse.setAttribute('cy','400');ellipse.setAttribute('rx',String(160+i*105));ellipse.setAttribute('ry',String(80+i*60));ellipse.classList.add('galaxy-orbit');spiral.append(ellipse);
  }
  svg.append(spiral);return svg;
}
function recenter() {
  const panel=$('.station-window');panel.style.left='';panel.style.top='';panel.style.transform='';
}
function clampWindow(x,y) {
  const workspace=$('.station-workspace');const panel=$('.station-window');
  panel.style.left=Math.max(12,Math.min(x,Math.max(12,workspace.clientWidth-panel.offsetWidth-12)))+'px';
  panel.style.top=Math.max(12,Math.min(y,Math.max(12,workspace.clientHeight-panel.offsetHeight-12)))+'px';
  panel.style.transform='none';
}
function setMaximized() {
  maximized=!maximized;$('.station-window').classList.toggle('maximized',maximized);
  $('#station-maximize').setAttribute('aria-pressed',String(maximized));$('#station-maximize').textContent=maximized?'Restore':'Expand';recenter();
}
function buildStation() {
  station=make('dialog',null,'station-dialog');station.id='field-station';station.setAttribute('aria-labelledby','station-heading');
  const header=make('div',null,'station-header');
  const heading=make('h2','Root Access / field station');heading.id='station-heading';
  const status=make('span','A DESKTOP IN THE GARDEN · LOCAL / SIMULATED','tiny');
  const controls=make('div',null,'station-header-controls');
  const theme=action('Change light',()=>$('#theme-toggle').click(),'station-tool');theme.id='station-theme';
  const wallpaper=action('Pause wallpaper',()=>{wallpaperPaused=!wallpaperPaused;station.classList.toggle('wallpaper-paused',wallpaperPaused);updateWallpaperLabel();},'station-tool');wallpaper.id='station-wallpaper-toggle';wallpaper.setAttribute('aria-pressed','false');
  controls.append(theme,wallpaper,action('Back to garden ×',()=>station.close(),'station-tool'));
  header.append(heading,status,controls);
  const workspace=make('div',null,'station-workspace');workspace.append(createGalaxy());
  const shortcuts=make('nav',null,'station-shortcuts');shortcuts.setAttribute('aria-label','Field station apps');
  for(const app of apps){const button=action('',()=>{renderApp(app.id);$('#station-window-name').focus();},'station-shortcut');button.dataset.stationApp=app.id;button.setAttribute('aria-pressed',String(app.id===activeApp));button.append(make('span',app.icon,'station-app-icon'),make('span',app.name));shortcuts.append(button);}
  const panel=make('section',null,'station-window');panel.setAttribute('aria-labelledby','station-window-name');
  const titlebar=make('div',null,'station-titlebar');
  const handle=make('button','Field files','station-window-handle');handle.type='button';handle.id='station-window-name';handle.setAttribute('aria-description','On a large screen, drag to move. Arrow keys move the window; Home recenters it.');
  const tools=make('div',null,'station-window-tools');
  const maximize=action('Expand',setMaximized,'station-tool');maximize.id='station-maximize';maximize.setAttribute('aria-pressed','false');
  tools.append(action('Recenter',recenter,'station-tool'),maximize,action('Minimize',()=>{panel.hidden=true;$('#station-restore').focus();},'station-tool'));
  titlebar.append(handle,tools);panel.append(titlebar,make('div',null,'station-window-content'));panel.lastChild.id='station-window-content';
  const caption=make('p','A tiny observatory for your curiosity. Open a file. Stay a while.','station-wallpaper-note');
  workspace.append(shortcuts,caption,panel);
  const taskbar=make('div',null,'station-taskbar');
  const restore=action('',()=>{panel.hidden=false;handle.focus();},'station-tool');restore.id='station-restore';restore.append(make('span','◇'),make('span','Field files'));restore.lastChild.id='station-task-label';
  taskbar.append(make('span','✳︎ ROOT ACCESS','station-system-name'),restore,action('Contact →',()=>{renderApp('contact');handle.focus();},'station-tool'));
  station.append(header,workspace,taskbar);document.body.append(station);
  const fine=matchMedia('(pointer:fine)');
  handle.addEventListener('pointerdown',event=>{
    if(!fine.matches||innerWidth<760||maximized||event.button!==0)return;
    const box=panel.getBoundingClientRect(),area=workspace.getBoundingClientRect();
    drag={x:event.clientX,y:event.clientY,left:box.left-area.left,top:box.top-area.top};handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener('pointermove',event=>{if(drag)clampWindow(drag.left+event.clientX-drag.x,drag.top+event.clientY-drag.y);});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])handle.addEventListener(event,()=>{drag=null;});
  handle.addEventListener('keydown',event=>{
    if(innerWidth<760||maximized)return;
    if(event.key==='Home'){event.preventDefault();recenter();return;}
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
    event.preventDefault();const box=panel.getBoundingClientRect(),area=workspace.getBoundingClientRect(),step=event.shiftKey?30:12;
    clampWindow(box.left-area.left+(event.key==='ArrowRight'?step:event.key==='ArrowLeft'?-step:0),box.top-area.top+(event.key==='ArrowDown'?step:event.key==='ArrowUp'?-step:0));
  });
  workspace.addEventListener('pointermove',event=>{
    if(!fine.matches||matchMedia('(prefers-reduced-motion:reduce)').matches||wallpaperPaused)return;
    if(pointerFrame!==null)cancelAnimationFrame(pointerFrame);
    pointerFrame=requestAnimationFrame(()=>{const box=workspace.getBoundingClientRect();workspace.style.setProperty('--wall-x',((event.clientX-box.left)/box.width-.5)*18+'px');workspace.style.setProperty('--wall-y',((event.clientY-box.top)/box.height-.5)*12+'px');pointerFrame=null;});
  });
  workspace.addEventListener('pointerleave',()=>{workspace.style.setProperty('--wall-x','0px');workspace.style.setProperty('--wall-y','0px');});
  station.addEventListener('close',()=>{station.classList.remove('station-open');if(pointerFrame!==null)cancelAnimationFrame(pointerFrame);pointerFrame=null;if(!navigating)opener?.focus();});
  new ResizeObserver(()=>{if(!station.open)return;if(innerWidth<760){recenter();return;}if(panel.style.left){const box=panel.getBoundingClientRect(),area=workspace.getBoundingClientRect();clampWindow(box.left-area.left,box.top-area.top);}}).observe(workspace);
  const updateThemeLabel=()=>{const golden=document.documentElement.dataset.theme==='golden';theme.textContent=golden?'Switch to moonlit':'Switch to golden hour';};
  document.addEventListener('garden:themechange',updateThemeLabel);updateThemeLabel();
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  function updateWallpaperLabel(){wallpaper.disabled=reduced.matches;wallpaper.textContent=reduced.matches?'Reduced motion':wallpaperPaused?'Resume wallpaper':'Pause wallpaper';wallpaper.setAttribute('aria-pressed',String(wallpaperPaused||reduced.matches));}
  reduced.addEventListener('change',updateWallpaperLabel);updateWallpaperLabel();
  document.addEventListener('visibilitychange',()=>station.classList.toggle('page-hidden',document.hidden));
}
export function openFieldStation(trigger) {
  opener=trigger;
  if(!station)buildStation();
  station.classList.add('station-open');station.showModal();
  renderApp(activeApp);playSound('latch');
}
