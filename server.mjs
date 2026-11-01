import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { createGuideHandler } from './lib/guide-server.mjs';
const root = process.cwd();
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff2':'font/woff2'};
const guide = createGuideHandler();
http.createServer(async (req,res) => {
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Content-Security-Policy',"default-src 'self'; img-src 'self'; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(await guide(req,res,pathname))return;
    if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405).end('Method not allowed');return;}
    const path = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!path.startsWith(root + '/') || pathname.split('/').some(p=>p.startsWith('.')) || !types[extname(path)]) { res.writeHead(404).end('Not found'); return; }
    const body = await readFile(path);
    res.writeHead(200, {'Content-Type':types[extname(path)]}).end(req.method==='HEAD'?undefined:body);
  } catch { if(!res.headersSent)res.writeHead(404).end('Not found'); }
}).listen(Number(process.env.PORT || 5173),'0.0.0.0',()=>console.log('Garden server ready on port ' + (process.env.PORT || 5173)));
