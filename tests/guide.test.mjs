import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createGuideHandler } from '../lib/guide-server.mjs';
import { localAnswer } from '../knowledge.js';
function request(server, path, {method='GET',body,origin,contentType='application/json'}={}) {
  return new Promise((resolve,reject)=>{
    const req=http.request({host:'127.0.0.1',port:server.address().port,path,method,headers:{...(body===undefined?{}:{'Content-Type':contentType}),...(origin?{Origin:origin}:{})}},res=>{
      let data='';res.on('data',chunk=>data+=chunk);res.on('end',()=>resolve({status:res.statusCode,data:JSON.parse(data)}));
    });req.on('error',reject);req.end(body);
  });
}
async function withServer(options,run){const handler=createGuideHandler(options);const server=http.createServer((req,res)=>void handler(req,res,new URL(req.url,'http://localhost').pathname));await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));try{await run(server);}finally{await new Promise(resolve=>server.close(resolve));}}
test('unconfigured AI is explicit and does not contact a provider',async()=>{
 await withServer({apiKey:'',fetchImpl:()=>{throw new Error('must not call');}},async server=>{
  assert.deepEqual((await request(server,'/api/guide/status')).data,{enabled:false});
  assert.equal((await request(server,'/api/guide',{method:'POST',body:'{"question":"hello"}'})).status,503);
 });
});
test('AI route rejects cross-origin, invalid, oversized, and wrong-method input before provider calls',async()=>{
 let calls=0;
 await withServer({apiKey:'test-fixture',fetchImpl:()=>{calls++;throw new Error();}},async server=>{
  assert.equal((await request(server,'/api/guide')).status,405);
  assert.equal((await request(server,'/api/guide',{method:'POST',origin:'https://unrelated.example',body:'{}'})).status,403);
  assert.equal((await request(server,'/api/guide',{method:'POST',body:'{'})).status,400);
  assert.equal((await request(server,'/api/guide',{method:'POST',body:JSON.stringify({question:'a'.repeat(401)})})).status,400);
  assert.equal((await request(server,'/api/guide',{method:'POST',body:JSON.stringify({question:'a'.repeat(2100)})})).status,413);
  assert.equal((await request(server,'/api/guide',{method:'POST',body:'{}',contentType:'text/plain'})).status,415);
  assert.equal(calls,0);
 });
});
test('AI answers require known source IDs and provider request has no tools or retained response',async()=>{
 let unknown=false;
 await withServer({apiKey:'test-fixture',fetchImpl:async(url,options)=>{
  assert.equal(url,'https://api.openai.com/v1/responses');const body=JSON.parse(options.body);assert.equal(body.store,false);assert.equal(body.tools,undefined);assert.match(body.instructions,/Never invent/);
  return {ok:true,json:async()=>({output:[{content:[{type:'output_text',text:JSON.stringify({answer:'Student labs are in progress.',sources:[unknown?'invented':'soc']})}]}]})};
 }},async server=>{
  const result=await request(server,'/api/guide',{method:'POST',body:JSON.stringify({question:'Is Splunk complete?'})});assert.equal(result.status,200);assert.deepEqual(result.data.sources,['soc']);
  unknown=true;assert.equal((await request(server,'/api/guide',{method:'POST',body:'{"question":"hello"}'})).status,502);
 });
});
test('provider failure is generic and rate limited',async()=>{
 let calls=0;
 await withServer({apiKey:'test-fixture',fetchImpl:async()=>{calls++;throw new Error('private-provider-details');}},async server=>{
  for(let i=0;i<8;i++){const r=await request(server,'/api/guide',{method:'POST',body:'{"question":"hello"}'});assert.equal(r.status,502);assert.ok(!JSON.stringify(r).includes('private-provider-details'));}
  assert.equal((await request(server,'/api/guide',{method:'POST',body:'{"question":"hello"}'})).status,429);assert.equal(calls,8);
 });
});
test('local answers distinguish implemented demos, planned labs, and missing facts',()=>{
 assert.match(localAnswer('What has Laleen built?').answer,/remain in progress/);
 assert.match(localAnswer('Is Splunk complete?').answer,/future work/);
 assert.match(localAnswer('What is her email?').answer,/not yet been supplied/);
 assert.match(localAnswer('Tell me tomorrow’s weather').answer,/don’t have evidence/);
});
