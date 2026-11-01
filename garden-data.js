// Fictional teaching fixtures. These are not completed results from Laleen's labs.
export const evidence = [
  { id: 'auth', time: '02:13:04', title: 'An unusual arrival', tag: 'AUTHENTICATION', icon: '01', summary: 'Eight failed logins, then one successful login.', log: '02:12:41–02:13:04 UTC\naccount: svc_irrigation\nsource: 192.0.2.42 (documentation IP)\nfailures: 8 / success: 1\nmethod: password\nasset: greenhouse-02', meaning: 'Failures followed by success deserve investigation. They do not establish whether someone guessed a password or a service retried an old one.', question: 'What changed before the successful login?' },
  { id: 'change', time: '01:55:00', title: 'A missing piece of context', tag: 'CHANGE RECORD', icon: '02', summary: 'A scheduled credential rotation preceded the event.', log: 'Synthetic change CHG-014\n01:55 UTC: service credential rotated\n02:00–02:20 UTC: approved maintenance window\nowner: greenhouse automation\nstatus: record present; owner not yet verified', meaning: 'A credential rotation could explain retries with a cached password. A change ticket is context to validate, not proof that activity is benign.', question: 'Can the owner confirm the source and timing?' },
  { id: 'process', time: '02:13:08', title: 'The process behind the signal', tag: 'PROCESS CONTEXT', icon: '03', summary: 'An encoded command references a watering task.', log: 'process: powershell.exe\nargument: -EncodedCommand [sample omitted]\nparent: scheduled task runner\nclaimed task: greenhouse-water.ps1\nscript hash: not yet verified\nsource inventory: not yet verified', meaning: 'Encoded PowerShell is dual-use. Inspect the decoded behavior safely and verify provenance; the flag alone cannot determine intent.', question: 'Does the script match an approved version?' },
];
export const identities = [
  { id: 'employee', name: 'Mira · researcher', type: 'Active employee', note: 'Needs the specimen archive. No production administration duties.', grants: ['archive', 'admin'] },
  { id: 'contractor', name: 'Ari · contractor', type: 'Expired contract', note: 'Contract ended yesterday. Existing access is still assigned.', grants: ['archive'] },
  { id: 'leaver', name: 'Rowan · former operator', type: 'Terminated identity', note: 'Employment ended. Interactive access has not been removed.', grants: ['archive', 'admin'] },
  { id: 'approver', name: 'Noor · reviewer', type: 'Active reviewer', note: 'Can certify requests. Granting their own access would conflict with review duties.', grants: ['review', 'admin'] },
];
export const doors = [
  { id: 'archive', title: 'Specimen archive', permission: 'READ', glyph: '◇' },
  { id: 'admin', title: 'Climate controls', permission: 'ADMIN', glyph: '⌘' },
  { id: 'review', title: 'Certification ledger', permission: 'APPROVE', glyph: '✓' },
];
export const baselineRules = [
  { id: 'firewall', title: 'Firewall enabled', safe: true, why: 'A host firewall reduces unnecessary exposure. Rules and application requirements still need review.' },
  { id: 'rootLogin', title: 'Direct SSH root login', safe: false, why: 'Use attributable accounts and controlled privilege elevation instead of direct root login.' },
  { id: 'passwordAuth', title: 'SSH password authentication', safe: false, why: 'For this teaching baseline, SSH uses managed keys. A real policy depends on the environment.' },
  { id: 'worldWrite', title: 'World-writable service config', safe: false, why: 'Restrict who can modify a service configuration. Permissions alone do not prove exploitation.' },
];
export const discoveries = [
  { id: 'lens', title: 'Beneath the leaves', description: 'Reveal the system inside the garden.' },
  { id: 'investigation', title: 'An analyst’s pause', description: 'Read all evidence and make a reasoned decision.' },
  { id: 'challenge', title: 'Question the machine', description: 'Challenge the assistant’s first hypothesis.' },
  { id: 'keys', title: 'The smallest useful key', description: 'Make and record an access-review decision.' },
  { id: 'baseline', title: 'Healthy roots', description: 'Meet the example security baseline.' },
  { id: 'packet', title: 'A firefly’s journey', description: 'Follow a request across a trust boundary.' },
  { id: 'cipher', title: 'Caesar’s seed', description: 'Decode the note in the study.' },
  { id: 'integrity', title: 'Same name, different bytes', description: 'Compare a specimen with its SHA-256 fingerprint.' },
  { id: 'honey', title: 'The decoy bloom', description: 'Touch a clearly marked synthetic honeytoken.' },
  { id: 'source', title: 'A note under the soil', description: 'Find the harmless clue in the page source.' },
  { id: 'craft', title: 'Behind the glass', description: 'Open the notebook about how this world works.' },
];
export const growth = [
  { title: 'The first seed', date: 'Portfolio foundation', detail: 'Original SVG environment, project case files, accessible navigation, and a safe simulated terminal.', source: 'index.html / app.js', complete: true },
  { title: 'A garden with rules', date: 'Interactive edition', detail: 'Synthetic investigation, access review, baseline comparison, local cited guide, and a discovery journal.', source: 'experience.js / guide.js', complete: true },
  { title: 'Evidence takes root', date: 'Awaiting reviewed lab evidence', detail: 'Screenshots, reproducible lab steps, and reviewed findings will grow new branches here.', source: null, complete: false },
];
export const packetSteps = [
  ['Request', 'A fictional visitor asks to read a specimen record. A request begins a journey; it does not grant access.'],
  ['Authentication', 'The gate checks identity. Knowing who someone is does not decide what they may do.'],
  ['Authorization', 'At the trust boundary, policy checks the requested action and resource. This identity has archive:read, not climate:admin.'],
  ['Response', 'The permitted record returns. The fictional session expires after this journey; a new request would need a valid session.'],
];
