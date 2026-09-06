import {connect,boot,goto,evalJS,metrics,shot} from './cdp.mjs';
const c = await connect(); await boot(c);
await metrics(c,1440,900);
for (const v of ['a','b','c','d']){
  await goto(c,'http://127.0.0.1:8099/');
  await new Promise(r=>setTimeout(r,1600));
  if (v!=='a') await evalJS(c,`document.documentElement.setAttribute('data-hero','${v}')`);
  const H = await evalJS(c,`document.getElementById('hero-sec').offsetHeight-innerHeight`);
  // mid-journey (band 2 live) and the settle
  await evalJS(c,`scrollTo({top:${Math.round(H*0.36)},behavior:'instant'})`);
  await new Promise(r=>setTimeout(r,950));
  await shot(c,`audit/variant-${v}-mid.png`);
  await evalJS(c,`scrollTo({top:${Math.round(H*0.96)},behavior:'instant'})`);
  await new Promise(r=>setTimeout(r,950));
  await shot(c,`audit/variant-${v}-end.png`);
  console.log('captured', v);
}
c.close(); process.exit(0);
