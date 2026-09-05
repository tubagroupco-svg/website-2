import {connect,boot,goto,evalJS,metrics,shot} from './cdp.mjs';
const c = await connect(); await boot(c);
await metrics(c,1440,900); await goto(c,'http://127.0.0.1:8099/');
await new Promise(r=>setTimeout(r,2200));
const H = await evalJS(c,`document.getElementById('hero-sec').offsetHeight-innerHeight`);
for (const [f,name] of [[0,'p00'],[0.35,'p35'],[0.62,'p62'],[0.95,'p95']]){
  await evalJS(c,`scrollTo({top:${Math.round(H*f)},behavior:'instant'})`);
  await new Promise(r=>setTimeout(r,900));
  await shot(c,`audit/hero-${name}.png`);
}
await metrics(c,375,812,true,true);
await goto(c,'http://127.0.0.1:8099/'); await new Promise(r=>setTimeout(r,1800));
await shot(c,'audit/phone-final.png');
console.log('hero shots captured');
c.close(); process.exit(0);
