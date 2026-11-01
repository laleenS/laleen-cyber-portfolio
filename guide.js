import { $, make, action } from './lib/dom.js';
import { sources, localAnswer } from './knowledge.js';
import { playSound } from './sound.js';
let mode='local';
let opener;
let pending=false;
let requestController;
let requestId=0;
let activeResponse;
function modeLabel() {
  $('#guide-mode').textContent = mode==='ai' ? 'AI mode · questions + public portfolio context sent to OpenAI · no chat history saved here' : 'Local cited guide · no generative model · no question leaves your browser';
}
export function openGuide(trigger=document.activeElement) {
  opener=trigger;$('#guide-dialog').showModal();$('#guide-question').focus();playSound('glass');
}
async function ask(question) {
  if(pending)return;
  const q=question.trim().slice(0,400);if(!q)return;
  const requestMode=mode;
  const log=$('#guide-log');const entry=make('article',null,'guide-entry');
  entry.append(make('p',q,'guide-question'));const response=make('p','Reading the portfolio…');entry.append(response);log.append(entry);activeResponse=response;
  while(log.children.length>10)log.firstElementChild.remove();
  pending=true;$('#guide-form button').disabled=true;
  const id=++requestId;
  let result;
  try {
    if(requestMode==='ai'){
      requestController=new AbortController();
      const timeout=setTimeout(()=>requestController?.abort(),16000);
      try {
        const res=await fetch('/api/guide',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q}),signal:requestController.signal});
        if(!res.ok)throw new Error('AI unavailable');
        result=await res.json();
        if(typeof result.answer!=='string' || !Array.isArray(result.sources) || !result.sources.length || result.sources.some(id=>!sources.some(s=>s.id===id)))throw new Error('Invalid response');
      } finally {clearTimeout(timeout);}
    }else result=localAnswer(q);
    if(id!==requestId)return;
    response.textContent=result.answer;
    const references=make('div',null,'guide-citations');
    for(const sourceId of [...new Set(result.sources)]){
      const source=sources.find(s=>s.id===sourceId);if(!source)continue;
      const link=make('a',source.title+' →');link.href=source.href;
      link.addEventListener('click',()=>{$('#guide-dialog').close();document.querySelector(source.href)?.scrollIntoView();});references.append(link);
    }
    entry.append(references,make('span',requestMode==='ai'?'AI-generated · check the cited evidence':'LOCAL CORPUS · NO MODEL CALL','tiny'));
  } catch {
    if(id!==requestId)return;
    result=localAnswer(q);response.textContent='AI is unavailable for this question. Local evidence lookup: '+result.answer;
    const references=make('div',null,'guide-citations');
    for(const sourceId of result.sources){const source=sources.find(s=>s.id===sourceId);const link=make('a',source.title+' →');link.href=source.href;link.addEventListener('click',()=>$('#guide-dialog').close());references.append(link);}
    entry.append(references,make('span','LOCAL FALLBACK · NO AI ANSWER','tiny'));
  } finally {if(id===requestId){pending=false;$('#guide-form button').disabled=false;log.scrollTop=log.scrollHeight;}}
}
export async function initGuide() {
  $('#open-guide').addEventListener('click',event=>openGuide(event.currentTarget));
  $('.guide-close').addEventListener('click',()=>$('#guide-dialog').close());
  $('#guide-dialog').addEventListener('close',()=>{requestController?.abort();requestId++;if(pending && activeResponse)activeResponse.textContent='Request cancelled when the guide closed. Ask again to continue.';pending=false;$('#guide-form button').disabled=false;opener?.focus();});
  $('#guide-form').addEventListener('submit',event=>{event.preventDefault();const input=$('#guide-question');const q=input.value;if(pending)return;input.value='';void ask(q);});
  document.querySelectorAll('[data-question]').forEach(button=>button.addEventListener('click',()=>void ask(button.dataset.question)));
  const controls=make('div',null,'guide-controls');
  controls.append(action('Clear conversation',()=>{if(pending)return;$('#guide-log').replaceChildren(make('p','Conversation cleared. Nothing is saved.','guide-welcome'));},'text-button'));
  $('#guide-form').after(controls);
  // The capability check sends no visitor input. No provider request is made until AI mode is explicitly chosen.
  try {const res=await fetch('/api/guide/status');if(!res.ok)return;const status=await res.json();if(status.enabled){
    const toggle=action('Enable AI mode',()=>{mode=mode==='local'?'ai':'local';toggle.textContent=mode==='ai'?'Use local guide':'Enable AI mode';toggle.setAttribute('aria-pressed',String(mode==='ai'));modeLabel();},'text-button');toggle.setAttribute('aria-pressed','false');controls.append(toggle);
  }} catch { /* Static hosting keeps the fully local guide. */ }
  modeLabel();
}
