import {connect,boot,goto,evalJS,metrics,shot} from './cdp.mjs';
const c = await connect(); await boot(c);
const URL='http://127.0.0.1:8099/';
await metrics(c,1440,900); await goto(c,URL); await new Promise(r=>setTimeout(r,2000));
// settle every entrance first, then come back and shoot
await evalJS(c,`(async()=>{for(const s of document.querySelectorAll('.rise')){s.scrollIntoView({behavior:'instant'});await new Promise(r=>setTimeout(r,450));}return 1})()`);
await new Promise(r=>setTimeout(r,1800));
for (const [sel,name] of [['#top','a-hero'],['#panel','b-panel'],['#why','c-why'],['#worries','d-worries'],['#install','e-install'],['#questions','f-faq'],['#talk','g-close']]){
  await evalJS(c,`document.querySelector('${sel}').scrollIntoView({behavior:'instant'})`);
  await new Promise(r=>setTimeout(r,700));
  await shot(c,`audit/settled-${name}.png`);
}
console.log('settled shots captured');
c.close(); process.exit(0);
