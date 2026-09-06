import {connect,boot,goto,evalJS,metrics} from './cdp.mjs';
const c = await connect(); await boot(c);
await metrics(c,1440,900); await goto(c,'http://127.0.0.1:8099/');
await new Promise(r=>setTimeout(r,2200));
const H = await evalJS(c,`document.getElementById('hero-sec').offsetHeight-innerHeight`);
await evalJS(c,`scrollTo({top:${Math.round(H*0.96)},behavior:'instant'})`);
await new Promise(r=>setTimeout(r,900));
console.log(await evalJS(c,`(()=>{
  const imgs=[...document.querySelectorAll('.lyr img')].map(i=>i.getBoundingClientRect());
  const stripTop=Math.min(...imgs.map(r=>r.top)), stripBot=Math.max(...imgs.map(r=>r.bottom));
  const h2=document.querySelector('.band-4 h2').getBoundingClientRect();
  const nav=document.querySelector('.nav').getBoundingClientRect();
  return JSON.stringify({
    navBottom:Math.round(nav.bottom),
    stripTop:Math.round(stripTop), stripBottom:Math.round(stripBot),
    headlineTop:Math.round(h2.top),
    clearanceAboveStrip:Math.round(stripTop-nav.bottom),
    clearanceBelowStrip:Math.round(h2.top-stripBot)
  },null,1)})()`));
c.close(); process.exit(0);
