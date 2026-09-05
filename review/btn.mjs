import {connect,boot,goto,evalJS,metrics} from './cdp.mjs';
const c = await connect(); await boot(c);
await metrics(c,1440,900); await goto(c,'http://127.0.0.1:8099/');
await new Promise(r=>setTimeout(r,2000));
const H = await evalJS(c,`document.getElementById('hero-sec').offsetHeight-innerHeight`);
await evalJS(c,`scrollTo({top:${Math.round(H*0.95)},behavior:'instant'})`);
await new Promise(r=>setTimeout(r,1100));
console.log(await evalJS(c,`(()=>{
  const b=document.querySelector('.band-4 .btn'), n=document.querySelector('.nav .btn');
  const band=document.querySelector('.band-4');
  return JSON.stringify({
    bandOpacity:getComputedStyle(band).opacity,
    bandK:band.style.getPropertyValue('--k'),
    ctaRowOpacity:getComputedStyle(document.querySelector('.band-4 .ctarow')).opacity,
    ctaBg:getComputedStyle(b).backgroundColor,
    ctaColor:getComputedStyle(b).color,
    navBg:getComputedStyle(n).backgroundColor,
    ctaBox:(r=>({x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}))(b.getBoundingClientRect())
  },null,1)})()`));
c.close(); process.exit(0);
