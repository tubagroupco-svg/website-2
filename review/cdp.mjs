// Minimal CDP driver: zero deps, Node 22 global WebSocket.
const PORT = process.env.CDP_PORT || 9222;
let _id = 0;

export async function connect(){
  let list;
  for (let i=0;i<40;i++){
    try { list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); if(list.length) break; }
    catch(e){}
    await new Promise(r=>setTimeout(r,250));
  }
  const t = list.find(t=>t.type==='page');
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  const waiters = new Map(); const events = [];
  await new Promise(r=>ws.addEventListener('open',r));
  ws.addEventListener('message', ev=>{
    const m = JSON.parse(ev.data);
    if (m.id && waiters.has(m.id)){ waiters.get(m.id)(m); waiters.delete(m.id); }
    else if (m.method) events.push(m);
  });
  const send = (method, params={}) => new Promise((res,rej)=>{
    const id = ++_id; waiters.set(id, m=> m.error ? rej(new Error(method+': '+m.error.message)) : res(m.result));
    ws.send(JSON.stringify({id, method, params}));
  });
  return { send, events, close:()=>ws.close() };
}

export async function boot(c){
  await c.send('Page.enable'); await c.send('Runtime.enable');
  await c.send('Log.enable').catch(()=>{}); await c.send('Network.enable');
}
export async function goto(c, url){
  await c.send('Page.navigate',{url});
  await new Promise(r=>setTimeout(r,1600));
}
export async function evalJS(c, expr){
  const r = await c.send('Runtime.evaluate',{expression:expr, returnByValue:true, awaitPromise:true});
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' ' + (r.exceptionDetails.exception?.description||''));
  return r.result.value;
}
export async function metrics(c, w, h, mobile=false, touch=false){
  await c.send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile});
  await c.send('Emulation.setTouchEmulationEnabled',{enabled:touch,maxTouchPoints:5});
}
export async function shot(c, path){
  const {data} = await c.send('Page.captureScreenshot',{format:'png'});
  const fs = await import('node:fs'); fs.writeFileSync(path, Buffer.from(data,'base64'));
}
export async function media(c, features){
  await c.send('Emulation.setEmulatedMedia',{features});
}
