import {connect,boot,goto,evalJS,metrics,shot} from './cdp.mjs';
const c = await connect(); await boot(c);
await metrics(c,1440,900); await goto(c,'http://127.0.0.1:8099/');
await new Promise(r=>setTimeout(r,2400));
const H = await evalJS(c,`document.getElementById('hero-sec').offsetHeight-innerHeight`);
for (const [f,n] of [[0,'00'],[0.18,'18'],[0.40,'40'],[0.64,'64'],[0.96,'96']]){
  await evalJS(c,`scrollTo({top:${Math.round(H*f)},behavior:'instant'})`);
  await new Promise(r=>setTimeout(r,900));
  await shot(c,`audit/ex-${n}.png`);
}
console.log('captured');
c.close(); process.exit(0);
