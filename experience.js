import { $, make, action, announce } from './lib/dom.js';
import { evidence, identities, doors, baselineRules, growth, packetSteps } from './garden-data.js';
import { discover, journalContent } from './journal.js';
import { playSound } from './sound.js';
const seen = new Set();
const pinned = new Set();
let activeEvidence = evidence[0].id;
let activeIdentity = identities[0].id;
const reviewedGrants = new Map();
let incidentOutcome = null;
let drawerOpener;
const drawer = $('#drawer-dialog');

export function setStation(station, focus = false) {
  if (!['soc','iam','baseline'].includes(station)) return;
  document.querySelectorAll('[role="tab"]').forEach(tab => {
    const selected = tab.dataset.station === station;
    tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1;
    $(`#panel-${tab.dataset.station}`).hidden = !selected;
    if (selected && focus) tab.focus();
  });
  $('#living-lab').dataset.station = station;
}
function inspectEvidence(id) {
  const item = evidence.find(record => record.id === id); if (!item) return;
  activeEvidence = id; seen.add(id);
  const reader = $('#evidence-reader'); reader.replaceChildren();
  reader.append(make('span',`${item.tag} / ${item.time} UTC`,'case-number'),make('h4',item.title));
  const pre = make('pre', item.log); pre.tabIndex = 0; pre.setAttribute('aria-label',`${item.title} fictional evidence record`);
  reader.append(pre, make('p',item.meaning), make('p',item.question,'evidence-question'));
  const pin = action(pinned.has(id) ? 'Unpin evidence' : 'Pin evidence', () => {
    if (pinned.has(id)) pinned.delete(id); else pinned.add(id);
    renderPins(); inspectEvidence(id); $('#pin-evidence').focus(); playSound('paper');
  });
  pin.id = 'pin-evidence';
  reader.append(pin);
  document.querySelectorAll('.evidence-slip').forEach(button => {
    const selected = button.dataset.evidence === id;
    button.setAttribute('aria-pressed',String(selected)); button.classList.toggle('reviewed',seen.has(button.dataset.evidence));
  });
  updateDecisionButtons();
}
function renderPins() {
  const container = $('#evidence-pins');container.replaceChildren();
  for (const id of pinned) {
    const item = evidence.find(e=>e.id===id);
    container.append(action(`${item.icon} / ${item.title} ×`,()=>{pinned.delete(id);renderPins();inspectEvidence(activeEvidence);$('#pin-evidence').focus();},'pinned-slip'));
  }
  const connected = pinned.has('auth') && pinned.has('change');
  $('#connection-reasoning').textContent = connected
    ? 'Connection: a credential rotation preceded the login retries. That is a plausible explanation to verify with the owner, not an automatic benign verdict.'
    : 'Pin the authentication event and change record to connect timing with context.';
  $('#connection-reasoning').classList.toggle('connected',connected);
}
function updateDecisionButtons() {
  const ready = seen.size === evidence.length;
  document.querySelectorAll('[data-verdict]').forEach(button => { button.disabled = !ready; });
  if (!incidentOutcome) $('#verdict-result').textContent = ready ? 'All three slips reviewed. Add your rationale, then record a decision.' : `${seen.size} of 3 evidence slips reviewed. Read all three before deciding.`;
}
function decide(verdict) {
  if (seen.size !== evidence.length) return;
  const rationale = $('#analyst-reason').value.trim();
  if (rationale.length < 12) { $('#verdict-result').textContent = 'Add a short rationale (at least 12 characters) so the decision is auditable.';$('#analyst-reason').focus();return; }
  incidentOutcome = verdict;
  const decisions = {
    verify:'Recorded: verify maintenance first. A reasonable next step is to confirm the change owner, source inventory, and approved script hash. The evidence supports a hypothesis, not closure yet.',
    escalate:'Recorded: escalate for investigation. Preserving evidence and requesting source/script validation is defensible. Explain priority and uncertainty rather than claiming a confirmed incident.',
    close:'Recorded: close as benign. Review note: this is premature with the current evidence. The owner, source inventory and script hash are still unverified. Reopen and validate those gaps before closure.',
  };
  $('#verdict-result').textContent = decisions[verdict];
  $('#verdict-result').dataset.outcome = verdict;
  document.body.dataset.incident = verdict === 'close' ? 'unverified' : 'reviewed';
  discover('investigation'); announce('Analyst decision recorded in this visit.');
}
function renderIdentity() {
  const person = identities.find(i=>i.id===activeIdentity);
  $('#identity-note').textContent = `${person.type}. ${person.note}`;
  const grants = reviewedGrants.get(person.id) || person.grants;
  const container = $('#permission-doors');container.replaceChildren();
  for (const door of doors) {
    const permitted = grants.includes(door.id);
    const element = make('article',null,`permission-door ${permitted ? 'permitted' : 'locked'}`);
    element.append(make('span',door.glyph,'door-symbol'), make('span',door.permission,'case-number'),make('h4',door.title),make('p',permitted ? 'ACCESS ASSIGNED' : 'NO ACCESS','door-status'));
    const test = action('Try this door',()=>{
      const sessionValid = !$('#session-expired')?.checked;
      $('#access-result').textContent = sessionValid ? (permitted ? `Authorized in the demo: ${person.name} can use ${door.title}. Assigned access can still be inappropriate; review the business need.` : `Denied in the demo: no ${door.permission.toLowerCase()} entitlement for this resource.`) : 'Session expired. A valid session must be renewed before an authorization decision. This is a local simulation.';
      element.classList.toggle('door-open', permitted && sessionValid);
      playSound(permitted && sessionValid ? 'latch' : 'release');
    },'text-button');
    element.append(test);container.append(element);
  }
}
function reviewAccess(exception = false) {
  const person = identities.find(i=>i.id===activeIdentity);
  const rationale = $('#access-rationale').value.trim();
  if (rationale.length < 12) { $('#access-result').textContent = 'Add an auditable rationale of at least 12 characters before recording a review.';$('#access-rationale').focus();return; }
  const isInactive = ['leaver','contractor'].includes(person.id);
  if (exception && isInactive) { $('#access-result').textContent = 'Exception refused in this demo: a terminated or expired identity needs a validated lifecycle process, not a routine access extension.';return; }
  let grants = isInactive ? [] : person.id === 'approver' && !$('#role-move').checked ? ['review'] : ['archive'];
  let result = isInactive ? 'Revoke interactive grants; validate downstream sessions, tokens and lifecycle completion.' : person.id === 'approver' && !$('#role-move').checked ? 'Keep review duties; remove administration to separate approval from provisioning.' : 'Keep archive read access; remove privileged grants that have no current business need.';
  if (exception) {
    grants = reviewedGrants.get(person.id) || person.grants;
    result = 'Proposed exception: privileged access for 24 hours, pending independent owner approval and monitoring. Current assignments are unchanged until approved. This local demo does not grant or auto-expire real access.';
  }
  reviewedGrants.set(person.id,grants);renderIdentity();
  $('#access-result').textContent = result;
  const item = make('li',`${person.name} · ${result} Rationale: ${rationale}`);
  $('#access-ledger').prepend(item);
  while ($('#access-ledger').children.length > 5) $('#access-ledger').lastElementChild.remove();
  document.body.dataset.access = exception ? 'exception' : 'reviewed';
  discover('keys');playSound('release');
}
function compareBaseline() {
  let passed=0;
  const results = $('#baseline-results');results.replaceChildren();
  const list = make('ul');
  for (const [index,rule] of baselineRules.entries()) {
    const ok = $(`#config-${rule.id}`).checked === rule.safe;
    if(ok)passed++;
    list.append(make('li',`${ok ? 'PASS' : 'REVIEW'} · ${rule.title}. ${ok ? 'Matches the teaching baseline.' : rule.why}`));
    $('#root-lights').children[index].classList.toggle('healthy',ok);
  }
  results.append(make('strong',`${passed} of ${baselineRules.length} checks match`),list,make('p','This comparison applies only to the fictional inputs above. It is not a vulnerability scan.','tiny'));
  document.body.dataset.baseline = passed===4 ? 'healthy' : 'review';
  if(passed===4)discover('baseline');
}

export function openDrawer(kind, trigger = document.activeElement) {
  drawerOpener = trigger;
  const content = $('#drawer-content');content.replaceChildren();
  const title = make('h2','');title.id='drawer-title';
  if (kind==='map') {
    title.textContent='A map of the garden';content.append(make('p','EVERY PATH IS OPEN','case-number'),title,make('p','Take a direct path, or wander. No puzzle is required to reach the portfolio.'));
    const links=make('nav',null,'garden-map');links.setAttribute('aria-label','Garden map');
    for(const [id,name,description] of [['home','The gate','Introduction & living garden'],['about','The gardener','Laleen’s academic background'],['living-lab','The living system','Three fictional security teaching stations'],['projects','Fieldwork','Project scope, evidence status & future work'],['archive','The study','Education, skills placeholders & terminal'],['resume','Résumé','Awaiting the reviewed PDF'],['contact','An open gate','GitHub & forthcoming contact details']]) {
      const a=make('a');a.href='#'+id;a.append(make('strong',name),make('span',description));
      a.addEventListener('click',()=>{drawer.close();const target=$('#'+id);if(target.tagName==='DETAILS')target.open=true;requestAnimationFrame(()=>{target.scrollIntoView();target.tabIndex=-1;target.focus({preventScroll:true});});});links.append(a);
    }
    content.append(links);
  }
  if (kind==='journal') { title.textContent='Collected along the way';content.append(title,journalContent()); }
  if (kind==='packet') { title.textContent='A firefly’s journey';content.append(make('p','A REQUEST, NOT A MAGIC KEY','case-number'),title);renderPacket(content); }
  if (kind==='integrity') { title.textContent='The specimen drawer';content.append(make('p','FINGERPRINTS / NOT ENCRYPTION','case-number'),title);renderIntegrity(content); }
  if (kind==='craft') { title.textContent='The build notebook';content.append(make('p','ORIGINAL MATERIALS, OPEN MECHANISMS','case-number'),title);renderCraft(content);discover('craft'); }
  if (!content.children.length) return;
  if(!drawer.open)drawer.showModal();
  playSound(kind==='craft'?'paper':'glass');
}
function renderPacket(content) {
  let step=0;
  const track=make('div',null,'packet-track');
  for(const [i,item] of packetSteps.entries()) { const node=make('span',`${i+1} / ${item[0]}`);track.append(node); }
  const title=make('h3');const description=make('p');const status=make('p',null,'case-status');
  const next=action('Begin journey →',()=>{if(step<4)step++;else step=0;render();playSound('glass');});
  const render=()=>{
    track.dataset.step=step;
    [...track.children].forEach((node,i)=>node.classList.toggle('active',i===Math.max(0,step-1)));
    title.textContent=step ? packetSteps[step-1][0] : 'One small request, four distinct checks.';
    description.textContent=step ? packetSteps[step-1][1] : 'Follow this synthetic packet from a visitor to the specimen archive. Each step can be advanced without animation.';
    status.textContent=step===4 ? 'Session expired after the response. No identity or credential was created.' : 'LOCAL SIMULATION / NO NETWORK REQUESTS';
    next.textContent=step===4 ? 'Replay journey' : step===0 ? 'Begin journey →' : 'Next checkpoint →';
    if(step===4)discover('packet');
  };
  content.append(track,title,description,next,status);render();
}
function renderIntegrity(content) {
  const original='specimen=moonflower;permission=read';
  content.append(make('p','Two specimens can share a label while containing different bytes. Compare the sample with its published SHA-256 fingerprint. Hashes support integrity checks; they do not encrypt a message or establish who published it.'));
  const label=make('label','Specimen contents');label.htmlFor='specimen-value';
  const input=make('textarea',original);input.id='specimen-value';input.maxLength=200;input.rows=2;
  const expected=make('code',null,'hash-value');const actual=make('code',null,'hash-value');const status=make('p');status.setAttribute('role','status');
  const digest=async value=>{const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('');};
  let reference;
  const compare=action('Compare fingerprint',async()=>{
    compare.disabled=true;
    try { reference ||= await digest(original);expected.textContent=reference;const fingerprint=await digest(input.value);actual.textContent=fingerprint;const matches=fingerprint===reference;status.textContent=matches?'MATCH · Contents equal the reference sample. Publisher trust still needs an independent channel.':'MISMATCH · Same label, different contents. Restore the sample before trusting this specimen.';discover('integrity'); }
    catch {status.textContent='SHA-256 requires a secure browser context (HTTPS or localhost). No data was sent.';}
    finally {compare.disabled=false;}
  });
  content.append(label,input,make('p','REFERENCE SHA-256','tiny'),expected,make('p','CURRENT SHA-256','tiny'),actual,make('div',null,'button-row'));
  content.lastElementChild.append(compare,action('Tamper with the sample',()=>{input.value='specimen=moonflower;permission=admin';status.textContent='The label looks familiar. Compare the actual bytes.';},'text-button'),action('Restore sample',()=>{input.value=original;status.textContent='Reference sample restored. Compare to verify.';},'text-button'));
  content.append(status);
  const decoder=make('details');decoder.append(make('summary','+ Open the encoding drawer'));
  const encoded=make('code',btoa('ROOT ACCESS'),'hash-value');
  decoder.append(make('p','Base64 is reversible encoding, not encryption. This known sample needs no secret key.'),encoded,action('Decode this sample',()=>{decoded.textContent=atob(encoded.textContent);},'text-button'));
  const decoded=make('p');decoded.setAttribute('role','status');decoder.append(decoded);content.append(decoder);
}
function renderCraft(content) {
  const entries=[
    ['A garden with depth','Original SVG illustration + a lightweight canvas of packets and pond ripples. Pointer position eases toward a target; layers move by different amounts. No camera permissions, device orientation or cursor replacement.','const ease = 1 - Math.exp(-deltaSeconds * 7);\nposition += (target - position) * ease;'],
    ['Motion with an off switch','One time-based requestAnimationFrame loop handles the decorative hero. It stops when the hero is offscreen, the tab is hidden, motion is paused or reduced motion is requested. Mobile keeps a simpler layer.','if (!visible || reducedMotion || paused) stopLoop();'],
    ['Materials you can hear','An opt-in Web Audio oscillator and gain envelope make brief glass, latch, paper-like and discovery tones. Sound starts off every visit; volume is adjustable. No recordings or copyrighted music.','oscillator → gain envelope → audio destination'],
    ['Evidence before interpretation','Fictional logs are hardcoded teaching fixtures. A scripted assistant makes a deliberately weak claim for visitors to challenge. None of these demos is a claim of completed external lab work.','signal + context + verification ≠ instant attribution'],
    ['A guide with a boundary','Local mode uses explicit question matching against a public evidence corpus. Optional server-side AI uses the same corpus, validated source IDs, no tools and no conversation memory. Model answers can still be wrong.','question → public sources → answer + citations'],
    ['Safe little windows','Text is created with textContent, terminal commands use an allowlist, and native dialogs manage modal focus. Dragging evidence has an equivalent button. Discovery storage is optional and local.','element.textContent = visitorInput;'],
  ];
  for(const [heading,body,code] of entries){const section=make('section',null,'craft-entry');section.append(make('h3',heading),make('p',body),make('pre',code));content.append(section);}
  content.append(make('p','Research notes: Bruno Simon’s public Folio 2025 documentation describes a coherent world of inputs, environmental systems, interactive points and audio. MDN’s requestAnimationFrame guidance informed time-based motion and background behavior. This garden’s code and artwork are original.','tiny'));
  const links=make('div',null,'button-row');
  for(const [label,href] of [['Folio 2025 documentation','https://github.com/brunosimon/folio-2025'],['Animation timing reference','https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame']]){const a=make('a',`${label} →`,'text-button');a.href=href;a.target='_blank';a.rel='noopener noreferrer';links.append(a);}
  content.append(links);
}
export function initExperience() {
  document.querySelectorAll('[data-station]').forEach(tab=>{
    tab.addEventListener('click',()=>setStation(tab.dataset.station));
    tab.addEventListener('keydown',event=>{
      const tabs=[...document.querySelectorAll('[role="tab"]')];let index=tabs.indexOf(tab);
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();index=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
      setStation(tabs[index].dataset.station,true);
    });
  });
  document.querySelectorAll('[data-explore]').forEach(button=>button.addEventListener('click',()=>{setStation(button.dataset.explore,true);$('#living-lab').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}));
  for(const item of evidence){
    const button=action('',()=>{inspectEvidence(item.id);playSound('paper');},'evidence-slip');button.dataset.evidence=item.id;button.draggable=true;
    button.append(make('span',`${item.icon} / ${item.time}`,'case-number'),make('strong',item.title),make('span',item.summary));
    button.addEventListener('dragstart',event=>{event.dataTransfer.setData('text/plain',item.id);event.dataTransfer.effectAllowed='copy';});
    $('#evidence-buttons').append(button);
  }
  const notebook=$('.analyst-notebook');
  notebook.addEventListener('dragover',event=>{event.preventDefault();event.dataTransfer.dropEffect='copy';});
  notebook.addEventListener('drop',event=>{event.preventDefault();const id=event.dataTransfer.getData('text/plain');if(!evidence.some(e=>e.id===id))return;pinned.add(id);renderPins();inspectEvidence(id);announce('Evidence pinned to the notebook.');});
  inspectEvidence(activeEvidence);renderPins();
  document.querySelectorAll('[data-verdict]').forEach(button=>button.addEventListener('click',()=>decide(button.dataset.verdict)));
  $('#reset-incident').addEventListener('click',()=>{seen.clear();pinned.clear();incidentOutcome=null;$('#analyst-reason').value='';$('#assistant-correction').textContent='';$('#challenge-assistant').disabled=false;delete document.body.dataset.incident;delete $('#verdict-result').dataset.outcome;renderPins();inspectEvidence(evidence[0].id);});
  $('#challenge-assistant').addEventListener('click',()=>{
    $('#assistant-correction').textContent='Challenge accepted. Encoded PowerShell is dual-use. The maintenance record suggests an alternative explanation, but owner confirmation, source inventory and script integrity remain unverified. The appropriate conclusion is uncertainty with concrete next checks.';
    discover('challenge');
  });
  for(const identity of identities){const option=make('option',identity.name);option.value=identity.id;$('#identity').append(option);}
  $('#identity').addEventListener('change',event=>{activeIdentity=event.target.value;$('#role-move').checked=false;$('#access-rationale').value='';$('#access-result').textContent='Review lifecycle status and business need before approving access.';renderIdentity();playSound('glass');});
  $('#role-move').addEventListener('change',()=>{$('#access-result').textContent=$('#role-move').checked?'Role changed; existing grants persist until reviewed. Apply a new least-privilege decision.':'Original role restored; inspect the grants before making a decision.';renderIdentity();});
  $('#review-access').addEventListener('click',()=>reviewAccess());$('#access-exception').addEventListener('click',()=>reviewAccess(true));
  $('#reset-access').addEventListener('click',()=>{reviewedGrants.delete(activeIdentity);$('#role-move').checked=false;renderIdentity();$('#access-result').textContent='Original fictional assignments restored.';});
  const session=make('label',null,'toggle-label');const expired=make('input');expired.type='checkbox';expired.id='session-expired';session.append(expired,document.createTextNode('Simulate an expired session'));$('.identity-drawer').append(session);renderIdentity();
  for(const rule of baselineRules){const label=make('label',null,'baseline-control');const input=make('input');input.type='checkbox';input.id=`config-${rule.id}`;input.checked=rule.id==='worldWrite'||rule.id==='rootLogin'||rule.id==='passwordAuth';label.append(input,make('span',rule.title),make('small',`Expected: ${rule.safe?'enabled':'disabled'}`));$('#baseline-controls').append(label);input.addEventListener('change',()=>{$('#baseline-results').textContent='Configuration changed. Compare again to evaluate the current inputs.';delete document.body.dataset.baseline;[...$('#root-lights').children].forEach(n=>n.classList.remove('healthy'));});}
  $('#run-baseline').addEventListener('click',compareBaseline);
  $('#reset-baseline').addEventListener('click',()=>{for(const rule of baselineRules)$(`#config-${rule.id}`).checked=!rule.safe;compareBaseline();});
  document.querySelectorAll('[data-open-drawer]').forEach(button=>button.addEventListener('click',()=>openDrawer(button.dataset.openDrawer,button)));
  $('#open-map').addEventListener('click',event=>openDrawer('map',event.currentTarget));
  for(const id of ['open-journal','dock-journal'])$(`#${id}`).addEventListener('click',event=>openDrawer('journal',event.currentTarget));
  for(const id of ['open-craft'])$(`#${id}`).addEventListener('click',event=>openDrawer('craft',event.currentTarget));
  $('.drawer-close').addEventListener('click',()=>drawer.close());drawer.addEventListener('close',()=>drawerOpener?.focus());
  $('#honeytoken').addEventListener('click',()=>{$('#honey-result').textContent='DEMO ALERT / decoy bloom touched. A honeytoken is a monitored decoy: its use can be a signal worth reviewing. This event stays in this page; no monitoring service was contacted.';$('#honeytoken').classList.add('bloom-alert');discover('honey');});
  for(const milestone of growth){const item=make('article',null,milestone.complete?'growth-item grown':'growth-item');item.append(make('span',milestone.complete?'✳︎':'○','growth-marker'),make('p',milestone.date,'case-number'),make('h3',milestone.title),make('p',milestone.detail));if(milestone.source)item.append(make('code',milestone.source));$('#growth-timeline').append(item);}
  const lens=$('#lens-toggle');lens.addEventListener('click',()=>{const enabled=lens.getAttribute('aria-pressed')!=='true';lens.setAttribute('aria-pressed',String(enabled));lens.textContent=enabled?'◇ Return to the garden':'◇ Reveal the system';$('#garden-world').classList.toggle('system-view',enabled);$('.lens-caption').textContent=enabled?'System view · endpoints, policy & trust boundaries':'Botanical view · a network beneath the leaves';if(enabled)discover('lens');});
}
